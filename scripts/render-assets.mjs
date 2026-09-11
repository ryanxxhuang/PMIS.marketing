// 把 assets-src/*.html 算成 public/ 的點陣圖(og.png、apple-touch-icon.png)。
//
// 為什麼要有這支:這兩張是點陣圖,token 或品牌標記換了它們不會自己跟上——2026-09 Apple
// 改版後 og.png 就停在 Google 舊色。源檔已改成 <link> global.css / 引用 public/brand 的 SVG,
// 所以「重算」就是同步,不必再開瀏覽器手動截。
//
// 用法:npm run render:assets(需要本機已裝 Playwright 的 Chromium:npx playwright install chromium;
//       og 封面用 Google Fonts 的 Noto Sans TC,需要網路)。
import { closeSync, openSync, readSync } from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { chromium } from 'playwright'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// 尺寸以 Base.astro 宣告的 og:image:width/height 與 apple-touch-icon 慣例為準;
// 1x 算圖:OG 與觸控圖示都是固定像素規格,不是 retina 資產。
const ASSETS = [
  {
    src: 'assets-src/og-cover.html', out: 'public/og.png', width: 1080, height: 1080,
    // 源檔靠 <link> 拿 token、靠 Google Fonts 拿中文字型:兩者任一沒載到,截出來的圖
    // 看起來「有圖」但其實是白底或 fallback 字型——寧可失敗也不要悄悄出錯圖。
    requireToken: '--dark-bg', requireFont: 'Noto Sans TC',
  },
  { src: 'assets-src/touch-icon.html', out: 'public/apple-touch-icon.png', width: 180, height: 180 },
]

function pngSize(path) {
  const fd = openSync(path, 'r')
  const head = Buffer.alloc(24)
  readSync(fd, head, 0, 24, 0)
  closeSync(fd)
  return { width: head.readUInt32BE(16), height: head.readUInt32BE(20) }
}

async function render(browser, asset) {
  const page = await browser.newPage({ viewport: { width: asset.width, height: asset.height }, deviceScaleFactor: 1 })
  try {
    await page.goto(pathToFileURL(join(ROOT, asset.src)).href)
    // 等的是狀態,不是時間:所有 <img> 解碼完成(SVG 標記)、字型載完
    await page.waitForFunction(() => [...document.images].every((img) => img.complete && img.naturalWidth > 0))
    await page.evaluate(() => document.fonts.ready)
    if (asset.requireToken) {
      const value = await page.evaluate((name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim(), asset.requireToken)
      if (!value) throw new Error(`${asset.src}:global.css 沒載到(${asset.requireToken} 是空的),檢查 <link> 的相對路徑`)
    }
    if (asset.requireFont) {
      const loaded = await page.evaluate((family) => [...document.fonts]
        .some((f) => f.family.replace(/["']/g, '') === family && f.status === 'loaded'), asset.requireFont)
      if (!loaded) throw new Error(`${asset.src}:${asset.requireFont} 沒載到(需要網路連 Google Fonts),不出 fallback 字型的圖`)
    }
    const out = join(ROOT, asset.out)
    await page.screenshot({ path: out, animations: 'disabled' })
    const size = pngSize(out)
    if (size.width !== asset.width || size.height !== asset.height) {
      throw new Error(`${asset.out}:尺寸 ${size.width}×${size.height},預期 ${asset.width}×${asset.height}`)
    }
    console.log(`${asset.out}: ${size.width}×${size.height}`)
  } finally {
    await page.close()
  }
}

async function main() {
  const browser = await chromium.launch()
  try {
    for (const asset of ASSETS) await render(browser, asset)
  } finally {
    await browser.close()
  }
}

main().catch((err) => {
  console.error(err)
  process.exitCode = 1
})
