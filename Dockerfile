# Base stage
FROM node:20-alpine AS base
ARG SETUP_ENVIRONMENT=production

# Install dependencies common to all stages
RUN apk add --no-cache libc6-compat git
RUN npm install -g pnpm  # 安装 pnpm 到路径中，使其在所有基于 base 的阶段都可用

# Dependencies stage
FROM base AS deps

WORKDIR /app

# Copy package.json 和 pnpm-lock.yaml 并安装依赖
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prefer-frozen-lockfile

# Builder stage
FROM base AS builder

WORKDIR /app

# 复制环境文件（注意，这里会根据 ARG 设置复制相应的 .env 文件）
COPY .env.$SETUP_ENVIRONMENT .env

# 将依赖项从 deps 阶段复制过来
COPY --from=deps /app/node_modules ./node_modules
# 复制项目的全部内容
COPY . .

# 构建项目
RUN pnpm build

# Production image runner stage
FROM base AS runner

# 设置生产环境变量
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非 root 用户并设置权限
RUN addgroup -S nodejs && adduser -S nextjs -G nodejs
RUN mkdir .next && chown nextjs:nodejs .next

# 复制构建后的文件到最终的运行镜像中
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# 切换到非 root 用户
USER nextjs

# 暴露端口
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 设置健康检查
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 CMD wget -qO- "http://localhost:3000/api/healther" || exit 1

# 运行 Next.js 应用
CMD ["node", "server.js"]
