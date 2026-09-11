# GovAgent 行銷站

Astro 靜態站,部署到 GitHub Pages(`.github/workflows/pages.yml`,push `main` 即部署)。網域配置見 [docs/domain-migration.md](docs/domain-migration.md)。

```sh
npm run dev       # 本機開發
npm run build     # 建到 dist/
npm run preview   # 預覽 dist/
```

設計 token 在 `src/styles/global.css`,值與產品(PMIS repo)的 `src/index.css` 對齊;規範是 PMIS repo 的 `docs/UIUX-Apple-設計規範.md`。

## 產品畫面 `public/appshots/`

Hero 的兩張產品畫面是**從真實 App 截的圖**,不是手繪:

| 檔名 | 內容 | 尺寸 |
|---|---|---|
| `dashboard-desktop@2x.png` | 監造角色的今日待辦,桌機版 | 1440×900 @2x |
| `dashboard-phone@2x.png` | 同一頁,手機版 | 390×844 @2x |

**來源是 PMIS repo,不是這裡。** 這個 repo 只消費、只入版控;圖由擁有 App 的 PMIS repo 產生:

```sh
# 在 PMIS repo 執行(會先 npm run build:demo,再用 Playwright 以 demo 監造登入截 /dashboard)
npm run capture:appshots -- --out ../PMIS_site/public/appshots
```

沒有自動同步:App 改版後要到 PMIS repo 重跑上面那行、再在這裡 commit 新圖。檔名兩邊寫死,改名要兩邊一起改;尺寸或畫面改了,順手核對 `src/components/landing/Hero.astro` 的 `width`／`height` 與 `alt`。細節見 PMIS repo 的 `UIUX/appshots/README.md`。

## `og.png`／`apple-touch-icon.png`

這兩張是行銷站自己算的,源檔在 `assets-src/`(`og-cover.html` 直接 `<link>` `global.css` 拿 token、引用 `public/brand/` 的 SVG 標記,所以 token 或標記改了,重算就同步):

```sh
npx playwright install chromium   # 第一次
npm run render:assets             # → public/og.png(1080×1080)、public/apple-touch-icon.png(180×180)
```

OG 封面的中文用 Google Fonts 的 Noto Sans TC,需要網路;字型載不到腳本會直接失敗,不會悄悄出一張 fallback 字型的圖。
