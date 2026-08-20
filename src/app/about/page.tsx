import type { Metadata } from "next";
import type { CSSProperties } from "react";
import Lottie from "@/components/Lottie";
import { PipelineStill } from "@/components/LottieStill";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "关于",
  description: site.description,
};

const stack = [
  { group: "Languages", items: ["TypeScript", "Python", "Java", "C#", "Shell"] },
  {
    group: "Frameworks",
    items: ["Next.js", "Node.js", "Supabase", "PostgreSQL", "Prisma", "Godot"],
  },
  {
    group: "AI / LLM",
    items: ["Claude API", "OpenAI", "LangChain", "MCP"],
  },
  {
    group: "Agent Runtimes",
    items: ["Claude Code", "Codex", "Gemini CLI", "Cursor"],
  },
];

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8">
      <h1 className="font-display text-3xl font-bold tracking-tight">
        关于我
        <span className="ml-3 font-mono text-sm font-normal text-ink-faint">
          ABOUT
        </span>
      </h1>

      <div className="mt-8 space-y-5 leading-loose text-ink">
        <p>
          你好，我是<strong>{site.nameZh}</strong>（{site.name}
          ），软件工程师，坐标{site.location.replace(", China", "")}，现在在{" "}
          <strong>{site.company}</strong> 做 AI 智能自动化工具。
        </p>
        <p>
          我最感兴趣的方向是 <strong>LLM 应用</strong>与{" "}
          <strong>agentic AI 系统</strong>
          ——不是让模型答题，而是把 Agent 编排成能独立完成一整件事的生产流水线：
          写剧本、拆分镜、生成视频、剪辑发布；或者接管 Blender 做 3D
          设计。工具窄化、结构化交付物、关键节点的人工门禁，是我反复验证过的三条编排原则。
        </p>
        <p>
          业余时间用 Godot 写游戏放松，也折腾 Claude Code / Codex
          这类 Agent 运行时的扩展开发。
        </p>
        <p className="font-mono text-sm text-ink-soft">
          I&apos;m a software engineer in Shanghai building AI agent tooling at
          OpsMate AI — focused on LLM apps and agentic systems, turning AI
          agents into tools that actually ship.
        </p>
      </div>

      {/* 正文里那句「把 Agent 编排成生产流水线」的图解：
          5 个节点依次点亮，对应首页 Terminal 的 5 个阶段 */}
      <Lottie
        name="pipeline"
        label="五个流水线节点依次点亮，数据沿线流过"
        className="mt-10 aspect-[15/2] w-full"
        fallback={<PipelineStill />}
      />

      <h2
        data-reveal
        className="mt-12 border-t border-hairline pt-8 font-display text-xl font-semibold tracking-tight"
      >
        技术栈
        <span className="ml-2.5 font-mono text-xs font-normal text-ink-faint">
          TECH STACK
        </span>
      </h2>
      <dl className="mt-6 space-y-4">
        {stack.map((s, i) => (
          <div
            key={s.group}
            data-reveal
            style={{ "--i": i } as CSSProperties}
            className="grid gap-1 sm:grid-cols-[10rem_1fr]"
          >
            <dt className="font-mono text-xs uppercase tracking-wider text-ink-faint sm:pt-1">
              {s.group}
            </dt>
            <dd className="flex flex-wrap gap-2">
              {s.items.map((item) => (
                <span
                  key={item}
                  className="rounded border border-hairline bg-paper-raised px-2 py-0.5 font-mono text-xs text-ink-soft transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-accent/60 hover:text-accent-ink"
                >
                  {item}
                </span>
              ))}
            </dd>
          </div>
        ))}
      </dl>

      <h2
        data-reveal
        className="mt-12 border-t border-hairline pt-8 font-display text-xl font-semibold tracking-tight"
      >
        联系我
        <span className="ml-2.5 font-mono text-xs font-normal text-ink-faint">
          CONTACT
        </span>
      </h2>
      <p data-reveal className="mt-5 leading-loose text-ink-soft">
        邮件是最可靠的方式：
        <a
          href={`mailto:${site.email}`}
          className="ml-1 font-mono text-sm text-accent-ink underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
        >
          {site.email}
        </a>
        <br />
        也可以在{" "}
        <a
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-accent-ink underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
        >
          GitHub
        </a>{" "}
        上找到我正在做的事。
      </p>
    </main>
  );
}
