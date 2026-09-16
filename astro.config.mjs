import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// site:行銷站 canonical 基準 = 根網域 gov-agent.ai(SaaS 標準配置);
// 產品在 app.gov-agent.ai。custom domain 由 public/CNAME + GitHub Pages 設定
// + Cloudflare DNS(A 記錄指 GitHub Pages)組成,見 docs/domain-migration.md。
export default defineConfig({
  site: 'https://gov-agent.ai',
  integrations: [sitemap()],
  // CSP(Base.astro 的 <meta http-equiv>)只允許自家與白名單來源的腳本／樣式,不開 unsafe-inline:
  // 所以樣式一律輸出成檔案、小腳本也不內嵌(Astro/Vite 預設 <4KB 的 <script> 會直接塞進 HTML)。
  // GitHub Pages 不能設回應標頭,CSP 只能走 meta;每一段腳本都必須有來源可查(PMIS D-025)。
  build: { inlineStylesheets: 'never' },
  vite: { build: { assetsInlineLimit: 0 } },
});
