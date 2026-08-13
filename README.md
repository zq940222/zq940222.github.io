# zq940222.github.io

个人博客 / Personal blog — [zq940222.github.io](https://zq940222.github.io)

把 AI Agent 变成真正能交付的工具。记录 LLM 应用、agentic 系统与工程实践。

## 技术栈

- [Next.js](https://nextjs.org) (App Router, 静态导出) + TypeScript + Tailwind CSS v4
- 文章为 `content/posts/` 下的 Markdown（gray-matter + remark/rehype 构建时渲染）
- GitHub Actions 自动部署到 GitHub Pages

## 本地开发

```bash
npm install
npm run dev
```

## 写文章

在 `content/posts/` 新建 `my-post.md`：

```markdown
---
title: 中文标题
titleEn: English Title
date: "2026-08-13"
tags: [标签A, 标签B]
summary: 列表页显示的中文摘要。
summaryEn: English summary.
---

正文 Markdown……
```

推送到 `main` 分支后自动构建发布。
