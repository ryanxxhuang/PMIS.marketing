# 網域遷移:行銷站上根網域、產品搬 app 子網域

目標配置(SaaS 標準):
- `gov-agent.ai`(+`www` 轉址)→ 行銷網站(GitHub Pages,此 repo)
- `app.gov-agent.ai` → 產品(Cloudflare Pages,PMIS repo)

程式側已完成(2026-08-24):行銷站 `site`/CNAME/robots/canonical/OG 全部指向
`https://gov-agent.ai`;header/footer 加了「登入」→ app 子網域;demo-request
edge function 的 CORS 白名單本來就含根網域與 www;Supabase function secret
`APP_URL=https://app.gov-agent.ai/` 已設定;產品 repo 的 send-reminders
fallback 已改(待你在產品 repo commit)。

以下是後台操作,**照順序做可零停機**。

## 階段 1:先掛 app 子網域(不動根網域,隨時可回頭)

1. Cloudflare → Workers & Pages → 產品的 Pages 專案 → **Custom domains**
   → 加 `app.gov-agent.ai`(同帳號網域,DNS 記錄會自動建立)。
2. 等憑證生效(通常幾分鐘),開 `https://app.gov-agent.ai` 確認產品正常。
3. Supabase Dashboard → 專案 PMIS.ai → **Authentication → URL Configuration**:
   - Site URL 改成 `https://app.gov-agent.ai`
   - Redirect URLs **加上** `https://app.gov-agent.ai/**`(舊的先留著)
4. 在 `app.gov-agent.ai` 實際走一次登入與「忘記密碼」,確認信件連結指向 app 子網域。

## 階段 2:行銷站上根網域

5. 行銷站 push 到 main(部署 workflow 會把含 CNAME 的 dist 上到 Pages)。
6. GitHub → `ryanxxhuang.github.io` repo → Settings → **Pages → Custom domain**
   填 `gov-agent.ai` → Save。
7. Cloudflare → DNS → `gov-agent.ai`:
   - 移除現有 apex 指向產品 Pages 的記錄;
     同時到產品 Pages 專案的 Custom domains 把 `gov-agent.ai`(與 www,若有)移除。
   - 新增四筆 A 記錄(名稱 `@`),**Proxy 一律關閉(DNS only,灰雲)**——
     GitHub 要簽 Let's Encrypt 憑證,橘雲會讓驗證失敗:
     `185.199.108.153` / `185.199.109.153` / `185.199.110.153` / `185.199.111.153`
   - 新增 `www` CNAME → `ryanxxhuang.github.io`,同樣 DNS only。
8. 回 GitHub Pages 設定頁等 DNS check 變綠 → 勾 **Enforce HTTPS**。
9. 驗收四條:
   - `https://gov-agent.ai` → 行銷站
   - `https://www.gov-agent.ai` → 轉址到 apex
   - `https://app.gov-agent.ai` → 產品
   - `https://ryanxxhuang.github.io` → 轉址到 gov-agent.ai

## 階段 3:收尾

10. 確認舊網址沒有殘餘流量後,Supabase Auth Redirect URLs 移除 `https://gov-agent.ai/**`。
11. 產品 repo commit `supabase/functions/send-reminders/index.ts` 的 fallback 修改
    (secret 已生效,重佈函式非必要)。
12. **HSTS preload 計畫作廢**:`public/_headers` 原註記要等網域穩定後送 preload,
    前提是產品在 apex。apex 現在是 GitHub Pages(custom domain 無法自訂標頭、
    不送 HSTS),preload 申請條件不成立;app 子網域的 HSTS 照舊由 _headers 提供。
13. (建議)Google Search Console 以網域資源驗證 `gov-agent.ai`,提交
    `https://gov-agent.ai/sitemap-index.xml`。
