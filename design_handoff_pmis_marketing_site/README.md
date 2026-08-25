# Handoff：PMIS.ai 行銷網站

## Overview

PMIS.ai（公共工程專案管理，繁體中文）的對外行銷／銷售網站。目標受眾是**監造顧問公司與技師事務所**，次要是主辦機關承辦人；唯一的轉換動作是**預約 30 分鐘線上示範**。

產品目前**沒有已成交客戶**，所以整個網站的信任來源是兩件事：(1) 創辦人的跨界背景（監造實務、機關 4 年、系統自己寫），(2) 產品本身的工程紀律（AI 只做草稿、權限寫在資料庫、有測試在守）。**不要在網站上加入任何客戶案例、logo 牆、推薦語或使用人數**——目前沒有可以支撑的事實。

四個頁面 + 一組社群素材：

| 檔案 | 用途 | 路由建議 |
|---|---|---|
| `PMIS.ai 官網.dc.html` | Landing | `/` |
| `功能全覽.dc.html` | 六個工作面逐段說明 | `/features` |
| `AI 邊界與資安.dc.html` | AI 邊界、資料庫權限、資安（拿去簽辦用） | `/security` |
| `預約示範.dc.html` | 預約表單（可操作） | `/demo` |
| `社群輪播圖.dc.html` | 六張 1080×1080 社群輪播圖，非網頁 | 匯出圖片用 |

## About the Design Files

這個 bundle 裡的 `.dc.html` 檔是**設計參考**：用 HTML + inline styles 寫的原型，用來表達最終長相與行為，**不是要直接搬進 production 的程式碼**。

任務是**在目標環境中重建這些設計**。PMIS 產品本體是 React 19 + Vite + Tailwind CSS 4 + Supabase；行銷網站是獨立的靜態站，**建議另建一個專案**（Next.js static export、Astro 或純 Vite + React 都可以），不要塞進產品 repo 的 `src/pages`，理由：

- 行銷站不需要 Supabase、不需要登入、不需要 store。
- 行銷站的 SEO 與載入速度要求跟後台工具不同（要 SSG／預算 hydration）。
- 產品 repo 的 `App.jsx` 有 role guard，行銷頁不該經過它。

若最後決定放進同一個 repo，請放在獨立的 entry（例如 `marketing/`）與獨立的 build target，並沿用下面的 token 表而非 `src/index.css`（值相同，但行銷站不需要深色模式）。

**這些檔案不能直接部署**：它們依賴一個 streaming design-component runtime（`support.js`、`<x-dc>`、`{{ }}` template holes、`<sc-if>`／`<sc-for>`、`<image-slot>`）。重建時把它們當成 markup 與樣式的規格書來讀，忽略這層 runtime。

### 讀檔時要知道的轉換規則

| 原型寫法 | 重建時 |
|---|---|
| `<x-dc>` 外層與 `<script src="./support.js">` | 丟掉 |
| `<helmet>` 內容 | 搬到 `<head>`／全域 CSS |
| `{{ ctaLabel }}` 等 template holes | 常數或 props，值見「文案變數」 |
| `<sc-if value="{{ sent }}">` | 條件渲染 |
| `<sc-for list="{{ roles }}" as="r">` | `.map()` |
| `style-hover="…"` | CSS `:hover` |
| `<image-slot>` | 已無使用（照片已全部移除） |
| `_ds/classical-…/styles.css` 與 `_ds_bundle.js` | **丟掉**。這是設計工具端的預設樣式表，原型在 `:root` 把每個變數都覆寫掉了；行銷站不需要它 |

`class="msy"` 是 Material Symbols Outlined 的 icon span，`class="num"` 是 tabular-nums。這兩個 class 需要保留（見「Design Tokens」）。

## Fidelity

**High-fidelity。** 顏色、字級、圓角、間距、陰影都是最終值，請照 token 表實作。

文案是最終文案，**請逐字沿用，不要改寫**。裡面的每一句都對應到產品的實際行為或已定案的產品原則（四條紅線、三方權限邊界），改寫容易講出產品做不到的承諾。

原型中的專案名稱、金額、人名（桃園市立圖書館新建工程、NT$ 722,624,067、王建國、宏觀工程顧問）都是**示範資料**，頁尾已有註明。

## 視覺方向

沿用 PMIS 產品本體的 Google Workspace 風格，這是刻意的：點進網站看到的長相就是登入後看到的長相。

- 底色只有兩個：`#ffffff` 與 `#f8fafd`，逐段交替。深色只用在最後的 CTA 區（`#041e49`）。
- 卡片是**白底 + 1px 邊框 + 極輕陰影**，不是填色塊。
- 按鈕是**藥丸形**（`border-radius: 100px`）。一個畫面只有一顆實心主色鈕。
- 大量留白。段落上下 padding 是 `clamp(56px, 8vw, 88px)`。
- 標題用 `--font-display`（Google Sans Display，未安裝時退回 Google Sans Text／Noto Sans TC），字重一律 400，`letter-spacing: -.015em`。**不要用粗體標題**。
- 每個段落標題上方有一個 kicker：24px 長的 1px 主色橫線 + 11.5px/500 主色文字。這是全站的節奏標記。
- 不要漸層（除了 hero 的 `#fff → #f8fafd` 垂直漸層）、不要 emoji、不要圓角容器加左邊色條。

## Design Tokens

值與產品 `src/index.css` 的亮色模式相同。行銷站**不需要深色模式**。

### 顏色

| 用途 | 變數 | 值 |
|---|---|---|
| 主色 | `--color-accent` | `#0b57d0` |
| 主色 hover | `--color-accent-700` | `#0842a0` |
| 主色 pressed | `--color-accent-800` | `#062e6f` |
| 主色 ramp 100–300 | `--color-accent-100/200/300` | `#ecf3fe` / `#d3e3fd` / `#a8c7fa` |
| 主色 ramp 900（CTA 底） | `--color-accent-900` | `#041e49` |
| 選取態文字（淺藍底上） | — | `#174ea6` |
| 文字 | `--color-text` / `--color-neutral-900` | `#202124` |
| 次要文字 | `--color-neutral-800` | `#3c4043` |
| 弱文字 | `--color-neutral-700` | `#5f6368` |
| 更弱文字 | `--color-neutral-600` | `#80868b` |
| 卡面 | `--g-card` | `#ffffff` |
| 卡框 | `--g-line` | `#e3e6ea` |
| 內容底 | `--g-ground` | `#f8fafd` |
| 卡內分隔線 | `--color-divider` | `#dadce0` |
| chip 底 | `--g-chip` | `#f1f3f4` |
| 搜尋框底 | `--g-search` | `#ecf3fe` |
| AI 面板底／字 | `--ai-tint` / `--ai-text` | `#ecf3fe` / `#062e6f` |
| 焦點環 | — | `#1a73e8` |

五語意狀態色票（顏色 + 文字並存，不可只靠顏色）：

| 語意 | 底 | 字 |
|---|---|---|
| danger 需立刻處理 | `#fce8e6` | `#a50e0e` |
| warn 待確認、接近期限 | `#fef7e0` | `#b06000` |
| ok 正常 | `#e6f4ea` | `#137333` |
| info 進行中 | `#ecf3fe` | `#174ea6` |
| mute 已結束 | `#f1f3f4` | `#5f6368` |
| （非五語意標記） | `#f3e8fd` | `#681da8` |

品牌四色（**只用於標誌與行銷素材，不進元件**）：機關藍 `#1a73e8`、監造紅 `#ea4335`、廠商黃 `#fbbc04`、連線灰 `#dadce0`。深色版：`#8ab4f8` / `#f28b82` / `#fdd663`，連線 `#5f6368`。

### 字型

```css
--font-body:    "Google Sans Text", "Noto Sans TC", system-ui, sans-serif;
--font-heading: "Google Sans Text", "Noto Sans TC", system-ui, sans-serif;
--font-display: "Google Sans Display", "Google Sans", "Google Sans Text", "Noto Sans TC", system-ui, sans-serif;
```

`Google Sans` 系列非公開授權、不能 self-host；使用者本機有裝才吃到，沒裝就退回 Noto Sans TC，視覺差異極小。**Noto Sans TC 必須 self-host 或從 Google Fonts 載入，fontsource 的 family 名是 `"Noto Sans TC Variable"`，漏了 `Variable` 後綴會靜默退回系統字。**

數字一律 tabular：

```css
.num { font-variant-numeric: tabular-nums; font-feature-settings: "tnum"; }
```

字級（`clamp()` 的三個值分別是最小、流動、最大）：

| 用途 | 值 |
|---|---|
| Hero h1 | `clamp(32px, 5.4vw, 54px)` / line-height 1.18 |
| 段落 h2 | `clamp(28px, 3.6vw, 36px)` / line-height 1.3 |
| 內頁 h1 | `clamp(30px, 5vw, 44px)` / line-height 1.22 |
| 內頁段落 h2 | `clamp(23px, 3vw, 26px)` |
| 卡片 h3 | 16.5–19px / 500 |
| Hero 說明 | `clamp(15px, 1.6vw, 16.5px)` / line-height 1.85 |
| 段落說明 | 15px / line-height 1.9 |
| 卡片正文 | 13–13.5px / line-height 1.85 |
| 輔助文字 | 11.5–12.5px / line-height 1.75 |
| kicker | 11.5px / 500 / letter-spacing .04em |

所有標題 `font-weight: 400`、`letter-spacing: -.015em`（h1 用 `-.012em`）。所有文字段落加 `text-wrap: pretty`。

### 間距、圓角、陰影

- 頁面最大寬度 `1180px`，左右 padding `24px`。FAQ 段落用 `820px`。
- 段落上下 padding `clamp(56px, 8vw, 88px)`，段落之間用 `1px solid var(--g-line)` 分隔。
- 卡片內距 `20–24px`，卡片間距 `20px`。
- 圓角：卡片 `12px`、大卡（表單）`28px`、chip 與輸入框 `8px`、按鈕與導覽 `100px`（藥丸）、logo 方塊 `10px`。
- 陰影（三層，都很輕）：
  ```css
  --shadow-sm: 0 1px 2px rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.08);
  --shadow-md: 0 1px 3px rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.1);
  --shadow-lg: 0 2px 6px rgba(60,64,67,.3), 0 8px 24px 6px rgba(60,64,67,.12);
  ```

### 圖示

Material Symbols Outlined（可變字軸，選取態用 `FILL 1`）：

```css
.msy {
  font-family: "Material Symbols Outlined";
  font-weight: 400; font-style: normal; line-height: 1;
  letter-spacing: normal; text-transform: none;
  display: inline-block; white-space: nowrap; direction: ltr;
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
.msy-f { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
```

用到的字符：`architecture` `arrow_forward` `person` `shield` `location_on` `history` `school` `mail` `grid_view` `engineering` `rate_review` `payments` `folder` `checklist` `auto_awesome` `lock` `gavel` `hub` `expand_more` `warning` `search` `tune` `folder_open` `arrow_drop_down` `menu` `dark_mode` `notifications` `help` `verified_user` `photo_camera` `check_circle` `block` `description` `code` `handshake` `progress_activity`。

機關禁外連 CDN 時，可下載可變字型 woff2 self-host（`font-display: block`），或改用 `@material-symbols/svg-400` 的 SVG 以避免 3.5 MB 的字型檔。

## 版面骨架

所有頁面同一個結構：

```
sticky header (66px)
  → 段落 × N（白底／#f8fafd 交替，段落間 1px 分隔線）
  → CTA 段落（#041e49 深底）
  → footer
```

### Header（所有頁面共用）

- 高 66px、`position: sticky; top: 0; z-index: 20`
- 底色 `rgba(255,255,255,.9)` + `backdrop-filter: blur(10px)`、下緣 `1px solid var(--g-line)`
- 左側品牌：34×34 圓角 10px 的 `#0b57d0` 方塊，內含反白三點標誌（第三點用 `#fdd663`）；右邊兩行 lockup：`PMIS`＋主色 `.ai`（19px/500，`letter-spacing:-.02em`）／`公共工程專案管理`（10.5px，`letter-spacing:.04em`）
- 右側導覽：三個文字連結（36px 高、藥丸、hover 底 `#f1f3f4`）＋一顆實心主色鈕。**目前頁的連結換成 `#ecf3fe` 底 `#174ea6` 字的不可點 chip。**
- **720px 以下三個文字連結隱藏，只留品牌與主色鈕。**（沒有做漢堡選單——內頁少，footer 有完整連結。若要加，維持 44px 觸控目標。）

## Screens

### 1. Landing（`PMIS.ai 官網.dc.html`）

段落順序刻意如此：先講產品在解決什麼，**第二段馬上講創辦人**（目前最強的說服點），再展開產品與資安。

#### 1.1 Hero

- 底：`linear-gradient(180deg, #ffffff 0%, #f8fafd 100%)`，上 padding `clamp(48px,7vw,80px)`
- Kicker chip：28px 高藥丸、白底、`1px solid #d3e3fd` 邊、`#062e6f` 字、11.5px/500，內含 `architecture` 圖示。文字：`公共工程 · 廠商／監造／機關三方協作`
- H1：`廠商、監造、機關`＋換行＋`在同一份契約事實上協作。`
- 說明（max 700px）：`PMIS.ai 把 PCCES 標單、施工日誌、查驗、估驗計價與送審接成一條資料鏈。AI 只做查詢、彙整與草稿；核定、判定、結案與驗收，永遠是人的。`
- 動作：主色實心鈕「預約線上示範」＋ `arrow_forward`（46px 高、padding 0 26px、`box-shadow: 0 1px 3px rgba(11,87,208,.3)`）；白底邊框鈕「誰做的」＋ `person` 圖示，連到 `#founder`
- 信任列：三項 12.5px `#5f6368` 文字，各配 17px `#146c2e` 圖示 —— `資通系統防護基準 · 普通級` / `個資境內存放，未境外傳輸` / `操作全程留存稽核軌跡`

**Hero 產品畫面（重點，也是最容易做錯的地方）**

Hero 下方是一張**等比縮放的完整產品介面**：一個 1440×908 的「今日待辦」畫面（監造角色），縮放後置中，上緣圓角 14px、無下框，`--shadow-lg`。

原型的做法是固定 1440px 內容 + `transform: scale(var(--s))`，`--s` 用 media query 階梯（不能用 `calc(100cqi/1440px)`，CSS 不允許長度相除）：

```css
.appshot { width: calc(1440px * var(--s)); height: calc(908px * var(--s)); margin: 0 auto; overflow: hidden; }
.appshot > div { transform: scale(var(--s)); transform-origin: top left; }
:root { --s: 0.7778; }                              /* ≥1168px：容器 1120px */
@media (max-width: 1167px) { :root { --s: 0.6778; } }
@media (max-width: 1023px) { :root { --s: 0.5917; } }
@media (max-width:  899px) { :root { --s: 0.4944; } }
```

**760px 以下換成手機版畫面**（330px 寬、9px `#202124` 邊框、34px 圓角），不要縮放桌機版。切換用：

```css
.only-wide   { display: block; }
.only-narrow { display: none !important; }
@media (max-width: 759px) {
  .only-wide   { display: none !important; }
  .only-narrow { display: flex !important; justify-content: center; }
}
```

`!important` 是必要的：手機版容器帶 inline `display`，會蓋過 class 規則。（這是實際踩過的 bug，兩張圖同時出現。）

實作時可以改成兩個 React 元件（`<DesktopShot />` / `<PhoneShot />`）配 `matchMedia`，但**桌機版必須維持 1440px 的固定內部尺寸再整體縮放**——它的價值在於「這就是產品真正的樣子」，改成響應式重排就失去意義了。

畫面內容（照抄，全部靜態）：256px 白底左側導覽（menu 鈕、標誌 lockup、「問 PMIS」淺藍藥丸鈕、「工作面」群組標題、六個導覽項含未處理件數、底部 `verified_user` 綠 +「正式模式 · 稽核中」）；64px 白底 App bar（專案 chip、搜尋藥丸、三顆圓形圖示鈕、頭像＋姓名兩行）；頁首（24px/400 標題 + 13px 說明 + 三顆 Material chips 分頁）；四張指標卡（`repeat(4,1fr)` gap 16）；`1.35fr 1fr` 兩欄（左「現在輪到我」五列清單，每列 `84px 1fr auto`：期限色票／標題＋說明／案號；右上「風險警示」、右下「AI 今日已代辦」）。

#### 1.2 誰做的（`#founder`）

白底。左右欄 `300px 1fr`，920px 以下單欄。

左欄：姓名 `Ryan Huang`（26px display）→ 一行頭銜 → 1px 分隔線 → 兩個 logo 橫排（UCLA 26px 高、Georgia Tech 30px 高，gap 24px）→ 兩行 12px 學歷文字 → 信箱連結。

右欄：kicker `誰做的` → H2 `監造、機關、系統，三邊我都待過` → 說明 → **引言卡**（左側 3px 主色實線、`#f8fafd` 底、右側圓角 12px）：

> 「我自己用過大型顧問公司的 PMIS，很痛苦。」
> 所以初衷不是再推一套系統、讓現場工程師多填一份表，而是把重複的內業拿掉：AI 出草稿，工程師只做覆核與簽名。

→ 一段排名說明（13.5px `#5f6368`）→ 三張經歷卡（`repeat(auto-fit, minmax(258px,1fr))`），每張是「色票 + 17px 標題 + 一行說明」：

| 色票 | 標題 | 說明 |
|---|---|---|
| ok 綠「監造這一側」 | 台灣世曦工程顧問｜監造 | 查驗、送審、估驗覆核都自己做過；監造報表與缺失追蹤的工時，我自己耗過。 |
| info 藍「機關這一側」 | 公務機關｜4 年 | 走過簽辦、審查、發包到驗收，知道承辦人真正會被卡在哪一關。 |
| 紫「系統這一側」 | AI Agent 新創｜產品經理 | 這套系統是我自己做的，從資料模型到 AI 邊界都自己決定。 |

**這一段的資訊密度是刻意壓低的**（前一版有照片、四點學歷清單、兩張排名卡、三行說明，被砍掉了）。加東西回來之前先想清楚。

#### 1.3 三方協作（`#roles`）

`#f8fafd` 底。kicker + H2 `三方各有立場，事實只能有一份` + 說明，接三張卡（`auto-fit minmax(258px,1fr)`）。每張卡開頭是一個 12px 品牌色圓點（機關 `#1a73e8`／監造 `#ea4335`／廠商 `#fbbc04`），標題 18px，說明 13.5px，底部三個 mute 色票。

#### 1.4 六個工作面

白底。標題列右側有一顆「功能全覽」邊框鈕。六張 `#f8fafd` 底卡片（`auto-fit minmax(258px,1fr)`），每張：26px 主色圖示 → 16.5px 標題 → 13px 說明。

#### 1.5 AI 只做草稿

`#f8fafd` 底。四張白卡（兩欄，920px 以下單欄），每張：`紅線 01`（13px display 主色 tabular）→ 19px 標題 → 13.5px 說明。下方一條 `#ecf3fe` 底的補充列，配 `auto_awesome` 圖示。

#### 1.6 資安與稽核

白底，左右等分。左欄：kicker + H2 + 說明 + 四條「圖示 + 粗體詞 + 說明」（資料列級安全性／狀態轉移 Guard／不可竄改稽核軌跡／佐證鏈）+ 一顆邊框鈕。右欄：`#f8fafd` 底卡片，四列「32px display 數字（寬 64px）+ 13px 說明」，列間 1px 分隔線，底部 11.5px 註記。

#### 1.7 FAQ

`#f8fafd` 底，`820px` 置中。用原生 `<details>`／`<summary>`（`list-style: none`、隱藏 `::-webkit-details-marker`），每則 18px 上下 padding、下緣 1px 分隔線，標題左側 20px `expand_more` 圖示。**重建時 summary 展開後圖示應旋轉 180°**（原型沒做）。五則問答見檔案。

#### 1.8 CTA

`#041e49` 深底，`1.15fr 1fr` 兩欄。左：38px 白字標題 `用你自己的案子看一次` + `#c2d9fd` 說明 + 一行 `#a8c7fa` 洽談狀態（可關）+ 兩顆鈕（`#a8c7fa` 底 `#062e6f` 字實心 / `#5f6368` 邊框 `#a8c7fa` 字）。右：`rgba(13,47,95,.5)` 底、`#1f52a0` 邊框的卡片，四步驟編號清單。

深色底上的按鈕配色**不要沿用亮色的實心藍**：主鈕是淺藍底深藍字（對比才夠）。

#### 1.9 Footer

白底、上緣 1px 線。左品牌（30px logo 方塊）＋中間四個連結＋右側 11.5px `畫面中的專案、金額與人名為示範資料。`

### 2. 功能全覽（`功能全覽.dc.html`）

頁首（漸層底）+ 七個段落，每段是 `280px 1fr` 兩欄：左欄是圖示 + 標題 + 一行定位，右欄是 2×2 說明格 + 選配的產品畫面。

含兩張**靜態資料表**：
- 契約重點表（條號／履約要求＋來源頁碼／責任方／期限／信賴度色票）
- 第 5 期估驗計價表：`table-layout: fixed` + `colgroup`，欄寬 項次 88px／工項 auto／契約數量 104px／本期 88px／累計 % 78px／本期金額 126px。所有數字欄右對齊、tabular、`white-space: nowrap`。工項階層用「18px 空白 span + 文字 span」，縮排不推移其他欄。父層列 `#f8f9fa` 底 + 500 字重。表尾合計列 `#f1f3f4` 底。長工項名 `text-overflow: ellipsis` 截斷。表下方一條 `#ecf3fe` 底的 AI 差異提示。
- **860px 以下表格容器改 `overflow-x: auto`、表格 `min-width: 620px`**，不要讓表格擠壓變形。

最後一段是「問 PMIS」的對話卡：使用者泡泡靠右（白底 1px 邊、圓角 12px）、回覆含編號清單與來源連結、底部 `#f8fafd` 灰卡列出工具軌跡（等寬感靠 tabular，不用 mono 字型）。

### 3. AI 邊界與資安（`AI 邊界與資安.dc.html`）

這一頁的用途是**讓機關拿去簽辦**，所以結構是問答式：

1. **Agent 的工具白名單** —— 兩張並排卡，綠卡頭「Agent 可以做」（5 列）、紅卡頭「Agent 沒有這些工具」（5 列）。這是全站最重要的一張圖，機關第一個問題就是這個。
2. **草稿到核定五步** —— 五格橫排（`auto-fit minmax(180px,1fr)`），第三格（AI 產草稿）用 `#ecf3fe` 底突顯。
3. **權限的邊界在資料庫** —— 左三條 `border-left: 2px` 主色說明，右四張測試數字卡。
4. **資料在哪裡、留多久** —— 三張 `#f8fafd` 底卡。
5. **AI 功能開關表** —— 四列 `1fr 130px 120px`（功能名＋說明／狀態色票／本月次數），700px 以下改 `1fr auto` 並讓次數換行。

### 4. 預約示範（`預約示範.dc.html`）

`#f8fafd` 底，`1fr 380px` 兩欄（980px 以下單欄）。左邊是 28px 圓角的白色大卡表單，右邊三張側欄卡。

表單狀態與驗證：

| 項目 | 規則 |
|---|---|
| 身分（三選一） | 預設「監造單位」。選取態：2px `#0b57d0` 邊框 + `#ecf3fe` 底 + 右上 `check_circle` + 圖示轉 `FILL 1` |
| 「單位名稱」欄的 label | 隨身分變：監造→`事務所／公司名稱`，機關→`機關名稱`，廠商→`公司名稱` |
| 姓名 / 單位 / 信箱 | 必填。信箱用 `/.+@.+\..+/` |
| 電話 / 議題 / 備註 | 選填 |
| 議題（六個 chip） | 可多選，切換 `#ecf3fe` 底 + 主色邊 + `check` 圖示 |
| 送出鈕 | 三個必填欄齊全才啟用；停用時底色 `#bdc1c6`、`cursor: not-allowed` |
| 右側提示文字 | 未齊全「姓名、單位與信箱填完就能送出」／齊全「一個工作日內回信」 |
| 送出後 | 整張卡換成確認畫面：44px 綠 `check_circle`（FILL 1）+ 28px 標題 + 說明 + 「再填一份」邊框鈕 |

浮動標籤輸入框：52px 高、圓角 8px、`1px solid #dadce0`，focus 時邊框轉主色；label 絕對定位在 `top:-8px; left:10px`，白底 padding 蓋住邊框。

**表單目前沒有後端。** 實作時要接：儲存進資料庫或寄信（產品已有 Resend），加上機器人防護、送出中禁用（`progress_activity` 圖示 0.9s linear 旋轉）、以及失敗狀態（`#fce8e6` 底 + `error` 圖示 + 重試鈕，文案沿用產品的 `errorMessage.js`）。頁尾目前寫著「此表單為設計稿，尚未接後端」，接好後刪掉。

### 5. 社群輪播圖（`社群輪播圖.dc.html`）

六張 1080×1080，**不是網頁**，是拿去匯出 PNG 貼社群的版面。順序：

1. 深底封面 —— `同一個工程／三方看到三份／不一樣的數字`
2. 白底 —— 問題：三方各自的痛點（三個品牌色圓點）
3. `#f8fafd` —— 解法：420px 的三點三角標誌 + 說明
4. 白底 —— AI 邊界：綠／紅兩欄對照
5. `#f8fafd` —— 誰做的：引言 + 三段經歷 + 學歷
6. 深底 CTA —— `帶你自己的／標單來試一次` + 96px 藥丸鈕

字級最小 22px（社群圖在手機上很小，不要再縮）。每張都有 88px 內距。

## Interactions & Behavior

- **hover**：導覽項與圖示鈕 `#f1f3f4`；主色鈕 `#0842a0`；白底邊框鈕 `#ecf3fe`；表格列 `#f8fafd`；深底上的淺藍鈕 `#c2d9fd`。
- **focus-visible**：`outline: 2px solid #1a73e8; outline-offset: 2px`。全站不留瀏覽器預設藍框。
- **按壓回饋**（產品端有，行銷站選配）：`transform: scale(0.97)`、`140ms cubic-bezier(0.23,1,0.32,1)`。
- **轉場**：UI 一律 < 300ms。`--ease-out: cubic-bezier(0.23,1,0.32,1)`。行銷站不要做滾動觸發動畫——這是給工程師與公務員看的網站，動效只做回饋，不表演。
- **`::selection`**：`#d3e3fd`。
- **連結**：預設 `#0b57d0`，hover `#0842a0` + underline。**務必明確定義**，否則後續加的連結會是瀏覽器預設藍。
- **響應式斷點**：1168 / 1023 / 980 / 920 / 899 / 860 / 760 / 720。手機優先驗證 390px。
- **觸控目標**：768px 以下所有可點元素 ≥ 44px。

## 文案變數

Landing 有五個可調文案／開關，實作時建議做成一份 config：

| 名稱 | 預設值 | 用在哪 |
|---|---|---|
| `ctaLabel` | `預約線上示範` | header 鈕、hero 鈕、CTA 鈕（三處同步） |
| `contactEmail` | `ryanxhuang1212@gmail.com` | 創辦人段、CTA、footer、預約頁側欄 |
| `founderName` | `Ryan Huang` | 創辦人段 |
| `founderTitle` | `創辦人 · 土木本科出身，補了資工與商管` | 創辦人段 |
| `showPipelineNote` | `true` | CTA 區那行「目前有兩家建築師事務所與一個政府機關在導入洽談中。」——成交或洽談結束後要改或關掉 |

## Assets

`assets/` 內含：

- `brand/pmis-mark.svg`、`pmis-mark-mono.svg`、`pmis-mark-white.svg`、`pmis-mark-dark.svg`、`pmis-lockup.svg`、`app-icon-blue.svg`、`favicon.svg` —— 從產品 repo 的 `public/brand/` 複製。**24px 以下改用 `favicon.svg` 的加粗版本，最小 16px。不要旋轉、加漸層陰影外框、改動三方顏色對應、非等比拉伸。**
- `logos/ucla.png`、`logos/georgia-tech.png` —— 創辦人學歷 logo。

header／footer 的品牌方塊是 inline SVG（不是引用檔案），因為要讓標誌顏色配合藍底反白。

**沒有任何照片。** 產品現場照片已全部移除（那些是別的案子的照片，不能用）。要放照片的話需要取得授權的自有照片；目前的版面在沒有照片的狀態下是完整的，不要為了填空隨便找圖。

**學校與公司 logo 有商標規範**：陳述學歷／經歷通常屬於合理使用，但部分學校禁止在商業網站使用校徽。上線前確認一次；保守做法是只留左欄的文字學歷。

## 需要決定的事（上線前）

1. **表單後端**：接資料庫還是寄信、防機器人方式。
2. **網域**：產品正式站是 `gov-agent.ai`。行銷站要放 `pmis.ai`、`gov-agent.ai` 根目錄還是子網域？導覽與 footer 的連結要跟著改。
3. **SEO 與分享**：`<title>`、`<meta description>`、OG image（可用輪播圖第一張）、`lang="zh-Hant-TW"`、favicon（已有）。目前原型完全沒有這些。
4. **排名數字會過期**：創辦人段落引用 U.S. News 2026 的排名，每年九月會更新，記得回來改。
5. **手機版漢堡選單**：目前 720px 以下直接隱藏導覽連結。若內頁增加就需要真的選單。

## Files

| 檔案 | 內容 |
|---|---|
| `PMIS.ai 官網.dc.html` | Landing（含 1440×908 產品畫面與 330px 手機畫面） |
| `功能全覽.dc.html` | 功能全覽內頁（含兩張資料表與對話卡） |
| `AI 邊界與資安.dc.html` | AI 邊界與資安內頁 |
| `預約示範.dc.html` | 預約表單（含 state 與驗證邏輯，在檔案下方的 logic class） |
| `社群輪播圖.dc.html` | 六張 1080×1080 社群圖 |
| `assets/brand/*.svg` | 品牌標誌 |
| `assets/logos/*.png` | 學歷 logo |

表單的 state 邏輯在 `預約示範.dc.html` 底部的 `class Component extends DCLogic`：`ROLES`／`TOPICS` 兩個常數、`state = { role, picked, name, org, email, sent }`、`ready` 的驗證條件都在裡面，可以直接讀。
