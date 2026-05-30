# ==========================================
# Stage 1: Builder (建置階段)
# 負責安裝所有套件，並將 TypeScript 編譯成 JavaScript
# ==========================================
FROM node:20-alpine AS builder

# 設定工作目錄
WORKDIR /app

# 先複製 package.json (利用 Docker 緩存機制加速後續建置)
COPY package*.json ./

# 安裝「所有」依賴 (包含開發用的 TypeScript)
RUN npm install

# 複製原始碼
COPY . .

# 將 TypeScript 編譯成 JavaScript (會輸出到 dist 資料夾)
RUN npx tsc

# ==========================================
# Stage 2: Production (正式運行階段)
# 只複製編譯後的檔案，打造極輕量級的 Image
# ==========================================
FROM node:20-alpine

WORKDIR /app

# 將 package.json 複製過來
COPY package*.json ./

# 這次只安裝「正式環境」需要的套件 (排除 typescript 等開發工具)
RUN npm install --omit=dev

# 從前一個 builder 階段，把編譯好的 JS 檔案複製過來
COPY --from=builder /app/dist ./dist

# 告訴 Image 啟動時要執行的指令 (執行編譯後的 JS 檔)
CMD ["node", "dist/index.js"]