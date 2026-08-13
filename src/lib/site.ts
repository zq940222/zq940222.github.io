export const site = {
  name: "Zenas",
  nameZh: "张强",
  url: "https://zq940222.github.io",
  title: "Zenas · 把 AI Agent 变成真正能交付的工具",
  titleEn: "Zenas · Turning AI agents into tools that actually ship",
  description:
    "软件工程师 · AI Agent 工具开发者。专注 LLM 应用与 agentic AI 系统，把 Agent 编排成完整生产流水线。",
  descriptionEn:
    "Software engineer building AI agent tooling — LLM apps, agentic systems, and full production pipelines.",
  email: "zhangqiang940222@gmail.com",
  github: "https://github.com/zq940222",
  location: "Shanghai, China",
  company: "OpsMate AI",
};

export type ProjectCategory = "agent" | "app" | "game";

export const categories: Record<
  ProjectCategory,
  { zh: string; en: string }
> = {
  agent: { zh: "Agent 工具", en: "AGENT TOOLING" },
  app: { zh: "全栈应用", en: "FULL-STACK" },
  game: { zh: "游戏", en: "GAMES" },
};

export type Project = {
  name: string;
  repo: string;
  zh: string;
  en: string;
  tech: string[];
  category: ProjectCategory;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    name: "Claude-Code-Film-Studio",
    repo: "https://github.com/zq940222/Claude-Code-Film-Studio",
    zh: "把 Claude Code 变成 AI 影视工作台：11 个专业 Agent + 11 个阶段技能，覆盖剧本 → 分镜 → 拍摄 → 剪辑 → 发布全流程。",
    en: "A Claude Code plugin that turns the CLI into an AI film studio — 11 agents across the full script-to-publish pipeline.",
    tech: ["Claude Code", "Multi-Agent", "Python"],
    category: "agent",
    featured: true,
  },
  {
    name: "blender-mcp-skill",
    repo: "https://github.com/zq940222/blender-mcp-skill",
    zh: "让 AI Agent 通过官方 blender.org MCP 服务器做专业 3D 设计的技能包。",
    en: "An agent skill for professional 3D design in Blender via the official blender.org MCP server.",
    tech: ["MCP", "Blender", "Claude Skill"],
    category: "agent",
    featured: true,
  },
  {
    name: "claude-pet",
    repo: "https://github.com/zq940222/claude-pet",
    zh: "常驻置顶的桌面宠物，通过 hook 驱动的 HTTP 事件实时展示 Claude Code 的工作状态。",
    en: "An always-on-top desktop pet showing Claude Code status in real time, driven by hook events.",
    tech: ["Tauri 2", "Rust", "TypeScript"],
    category: "agent",
    featured: true,
  },
  {
    name: "super-agent",
    repo: "https://github.com/zq940222/super-agent",
    zh: "从零手写的通用任务 Agent（TS/Node，可插拔模型后端），用来吃透 Agent 架构。",
    en: "A from-scratch general-purpose task agent (TS/Node, pluggable model backends) built to learn agent architecture hands-on.",
    tech: ["TypeScript", "Node.js", "Agent"],
    category: "agent",
    featured: true,
  },
  {
    name: "film-studio-dashboard",
    repo: "https://github.com/zq940222/film-studio-dashboard",
    zh: "影视工作台的只读可观测仪表盘：图形化观测项目进度、镜头、产物与积分。",
    en: "A read-only observability dashboard for the film studio pipeline.",
    tech: ["Vite", "React", "Express"],
    category: "app",
  },
  {
    name: "shanghai-fresh-prices",
    repo: "https://github.com/zq940222/shanghai-fresh-prices",
    zh: "上海生鲜价格查询系统，全栈实战。",
    en: "Full-stack Shanghai fresh-produce price lookup.",
    tech: ["Next.js", "PostgreSQL", "Prisma"],
    category: "app",
  },
  {
    name: "kings-and-pigs",
    repo: "https://github.com/zq940222/kings-and-pigs",
    zh: "用 Godot 4.6 做的 2D 银河恶魔城游戏。",
    en: "A 2D Metroidvania built with Godot 4.6.",
    tech: ["Godot", "GDScript"],
    category: "game",
  },
  {
    name: "godot-star-ball",
    repo: "https://github.com/zq940222/godot-star-ball",
    zh: "星际滚球 —— Godot 4.6 3D 滚球小游戏。",
    en: "A 3D ball-rolling mini-game in Godot 4.6.",
    tech: ["Godot", "3D"],
    category: "game",
  },
];
