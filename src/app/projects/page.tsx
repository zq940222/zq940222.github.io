import type { Metadata } from "next";
import ProjectCard from "@/components/ProjectCard";
import { projects, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "项目",
  description: "开源项目与业余作品：Agent 流水线、MCP 技能、桌面工具与游戏。",
};

export default function ProjectsPage() {
  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-14 sm:px-8">
      <h1 className="font-display text-3xl font-bold tracking-tight">
        项目
        <span className="ml-3 font-mono text-sm font-normal text-ink-faint">
          PROJECTS · {projects.length}
        </span>
      </h1>
      <p className="mt-3 max-w-xl leading-relaxed text-ink-soft">
        开源项目与业余作品：Agent 流水线、MCP 技能、桌面工具与游戏。 更多在{" "}
        <a
          href={site.github}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent-ink underline decoration-accent/40 underline-offset-4 hover:decoration-accent"
        >
          GitHub
        </a>
        。
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((p) => (
          <ProjectCard key={p.name} project={p} />
        ))}
      </div>
    </main>
  );
}
