import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// site:行銷站 canonical 基準 = 根網域 gov-agent.ai(SaaS 標準配置);
// 產品在 app.gov-agent.ai。custom domain 由 public/CNAME + GitHub Pages 設定
// + Cloudflare DNS(A 記錄指 GitHub Pages)組成,見 docs/domain-migration.md。
export default defineConfig({
  site: 'https://gov-agent.ai',
  integrations: [sitemap()],
});
