# Zina Liu 部落格 · 靜態網站

從 WordPress 重新設計的靜態個人部落格。現在與工具站合併在同一個 GitHub repo（`utopiawrite/utopiawrite.github.io`），用 **GitHub Pages（免費）** 部署，網域 **zinaliu.com**。

## Repo 結構（合併後）
```
/ (repo 根目錄)
├─ index.html          部落格首頁
├─ articles.html       所有文章（分類篩選 + 搜尋）
├─ about.html          關於我
├─ feed.xml            RSS 訂閱（網址已寫死為 https://zinaliu.com）
├─ CNAME               自訂網域：zinaliu.com
├─ posts/              24 篇文章
├─ assets/             style.css / site.js
├─ images/             文章內的圖（見下方「待補圖片」）
└─ tools/              自製工具（原本 repo 根目錄的全部內容搬進這層）
```

部落格連到工具的網址都已改成 `/tools/...`，工具站首頁在 `zinaliu.com/tools/`。

## 部署到 GitHub Pages
1. 把上述「部落格檔案」放到 repo 根目錄；原本的工具檔全部移進 `tools/`。
2. GitHub → repo → Settings → Pages → Build and deployment 選 `Deploy from a branch`、分支 `main` / 根目錄。
3. Custom domain 已由 `CNAME` 檔指定為 `zinaliu.com`；DNS 設定好後勾選 **Enforce HTTPS**。
4. Namecheap DNS：apex 加 4 筆 A 紀錄（185.199.108.153 / .109.153 / .110.153 / .111.153），`www` 加 CNAME 指向 `utopiawrite.github.io`。

## ⚠️ 待補圖片（WordPress / Cloudways 關閉前先下載！）
文章內這 3 張是真內容圖，請從舊站媒體庫下載後放進根目錄 `images/`（檔名保持一致）：

| 檔名 | 出現在文章 |
|---|---|
| `leap-call-exit-strategy-1-754x1024.png` | LEAP Call出場工具 |
| `bookkeeping-514x1024.png` | 邁向夢想的記帳法 |
| `landing-page-512x1024.jpg` | 一頁式網站架構 [內容篇] |

> 圖片還沒放上去時，文章內會顯示虛線 placeholder，不會破版。放上去就自動顯示。
> **務必在退掉 Cloudways 之前先把這 3 張圖（及任何其他想保留的媒體）抓下來。**

## 留言功能（建議用 Giscus）
每篇文章底部已預留留言區（`posts/*.html` 的 `<div class="box">`）。因為站已經在 GitHub 上，最適合用 **Giscus**（GitHub Discussions，免費無廣告）。要啟用時把嵌入碼貼進留言區即可。

## 新增 / 修改文章
透過 Claude 更新檔案後，於本機 `git push` 即可上線。
