// 文案變數（handoff README「文案變數」表）
// ctaLabel 用在 header 鈕、hero 鈕、CTA 鈕，三處同步。
export const SITE = {
  ctaLabel: '預約線上示範',
  contactEmail: 'ryanxhuang1212@gmail.com',
  founderName: 'Ryan Huang',
  founderTitle: '創辦人 · 土木本科出身，補了資工與商管',
  // CTA 區「目前有兩家建築師事務所與一個政府機關在導入洽談中。」
  // 成交或洽談結束後要改或關掉。
  showPipelineNote: true,
  // 產品(app 子網域)。header/footer 的「登入」連到這裡。
  appUrl: 'https://app.gov-agent.ai',
} as const;

// 預約表單後端:Supabase Edge Function(專案 PMIS.ai)。
// anon key 是公開金鑰(RLS 擋所有直接存取,寫入只走 function 的 service role)。
export const DEMO_API = {
  endpoint: 'https://buylyonwoyvqdbvkkkbx.supabase.co/functions/v1/demo-request',
  anonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ1eWx5b253b3l2cWRidmtra2J4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMjgwNjUsImV4cCI6MjA5NzkwNDA2NX0.be7meJcGKTXLIXwdx0fKcCWrZQIzG-oMgtC58qpbCFU',
} as const;
