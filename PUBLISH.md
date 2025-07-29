# 自动发布指南

## 概述

这个项目配置了完整的 CI/CD 流程，可以自动将代码推送到 GitHub 后发布新版本到 npm。

## 🚀 发布流程

### 方法 1: 使用发布脚本（推荐）

```bash
# 发布 patch 版本 (1.0.0 -> 1.0.1)
npm run release:patch

# 发布 minor 版本 (1.0.0 -> 1.1.0)  
npm run release:minor

# 发布 major 版本 (1.0.0 -> 2.0.0)
npm run release:major

# 或者直接使用脚本
./scripts/release.sh patch
```

发布脚本会自动：
1. ✅ 检查当前分支是否为 main
2. ✅ 检查工作目录是否干净
3. ✅ 拉取最新代码
4. ✅ 安装依赖并构建
5. ✅ 测试构建结果
6. ✅ 更新版本号
7. ✅ 创建提交和标签
8. ✅ 推送到 GitHub
9. ✅ 触发自动发布

### 方法 2: 手动创建标签

```bash
# 手动更新版本
npm version patch  # 或 minor/major

# 推送标签
git push origin main --tags
```

### 方法 3: GitHub 手动触发

1. 访问 GitHub 仓库的 Actions 页面
2. 选择 "Publish to NPM" 工作流
3. 点击 "Run workflow"
4. 选择版本类型 (patch/minor/major)
5. 点击 "Run workflow"

## 🔧 设置说明

### 必需的 GitHub Secrets

在 GitHub 仓库设置中添加以下 Secrets：

1. **NPM_TOKEN**: NPM 发布令牌
   - 访问 https://www.npmjs.com/settings/tokens
   - 创建新的 "Automation" 类型令牌
   - 复制令牌到 GitHub Secrets

### NPM 令牌创建步骤

1. 登录 npm 网站
2. 点击头像 → "Access Tokens"
3. 点击 "Generate New Token"
4. 选择 "Automation" 类型
5. 复制生成的令牌
6. 在 GitHub 仓库设置中添加为 Secret

## 📋 工作流说明

### CI 工作流 (`.github/workflows/ci.yml`)

**触发条件**: 
- 推送到 `main` 或 `develop` 分支
- 创建 Pull Request 到 `main` 分支

**功能**:
- ✅ 在 Node.js 18.x 和 20.x 上测试
- ✅ TypeScript 编译检查
- ✅ 服务器启动测试
- ✅ npx 功能测试
- ✅ 包结构检查

### 发布工作流 (`.github/workflows/publish.yml`)

**触发条件**:
- 推送以 `v` 开头的标签 (如 `v1.0.1`)
- 手动触发 (workflow_dispatch)

**功能**:
- ✅ 运行完整测试
- ✅ 构建项目
- ✅ 发布到 npm
- ✅ 创建 GitHub Release
- ✅ 自动生成发布说明

## 📊 发布状态监控

### 检查发布状态

1. **GitHub Actions**: https://github.com/latel/mcp-ip-geolocator-npx/actions
2. **npm 包页面**: https://www.npmjs.com/package/mcp-ip-geolocator-npx
3. **GitHub Releases**: https://github.com/latel/mcp-ip-geolocator-npx/releases

### 常用监控命令

```bash
# 检查最新版本
npm view mcp-ip-geolocator-npx version

# 检查包信息
npm info mcp-ip-geolocator-npx

# 测试最新发布版本
npx mcp-ip-geolocator-npx@latest
```

## 🔍 故障排除

### 发布失败常见原因

1. **NPM_TOKEN 无效或过期**
   - 重新生成 npm 令牌
   - 更新 GitHub Secrets

2. **版本号冲突**
   - npm 上已存在相同版本
   - 需要更新版本号

3. **构建失败**
   - 检查 TypeScript 编译错误
   - 本地运行 `npm run build` 测试

4. **测试失败**
   - 服务器启动问题
   - 依赖安装问题

### 调试步骤

```bash
# 本地测试完整流程
npm ci
npm run build
npm pack
npx ./mcp-ip-geolocator-npx-*.tgz

# 检查包内容
tar -tzf mcp-ip-geolocator-npx-*.tgz
```

## 🎯 最佳实践

1. **在发布前**:
   - 确保所有测试通过
   - 更新 README 和文档
   - 检查 CHANGELOG

2. **版本管理**:
   - patch: 修复 bug
   - minor: 新功能，向后兼容
   - major: 破坏性更改

3. **发布节奏**:
   - 小而频繁的发布
   - 及时修复问题
   - 保持稳定的 API

## 📝 发布清单

- [ ] 代码已合并到 main 分支
- [ ] 所有测试通过
- [ ] 文档已更新
- [ ] CHANGELOG 已更新（如有）
- [ ] 版本号合适
- [ ] NPM_TOKEN 有效
- [ ] 本地测试通过

完成清单后，运行 `npm run release:patch` 即可开始自动发布流程！
