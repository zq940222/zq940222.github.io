import Link from "next/link";
import Terminal from "@/components/Terminal";
import PostList from "@/components/PostList";
import ProjectCard from "@/components/ProjectCard";
import { getAllPosts } from "@/lib/posts";
import { projects, site } from "@/lib/site";

function SectionHead({
  zh,
  en,
  href,
  linkText,
}: {
  zh: string;
  en: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="mb-2 flex items-baseline justify-between">
      <h2 className="font-display text-xl font-semibold tracking-tight">
        {zh}
        <span className="ml-2.5 font-mono text-xs font-normal text-ink-faint">
          <span className="text-signal">{"// "}</span>
          {en}
        </span>
      </h2>
      {href && (
        <Link
          href={href}
          className="group font-mono text-xs text-ink-soft transition-colors hover:text-accent"
        >
          {linkText}{" "}
          <span className="inline-block transition-transform duration-300 ease-out group-hover:translate-x-1">
            →
          </span>
        </Link>
      )}
    </div>
  );
}

export default function Home() {
  const posts = getAllPosts().slice(0, 3);
  const featured = projects.filter((p) => p.featured);

  return (
    <main className="mx-auto w-full max-w-5xl px-5 sm:px-8">
      {/* Hero */}
      <section className="grid items-center gap-10 py-14 sm:py-20 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div>
          <p className="font-mono text-xs tracking-widest text-accent">
            <span className="text-signal">{"// "}</span>
            SOFTWARE ENGINEER · AI AGENT TOOLING
          </p>
          <h1 className="mt-5 font-display text-4xl font-bold leading-[1.15] tracking-tight sm:text-[2.75rem]">
            把 AI Agent 变成
            <br />
            <span className="flow-text bg-gradient-to-r from-accent via-cyan to-purple bg-clip-text text-transparent">
              真正能交付
            </span>
            的工具
          </h1>
          <p className="mt-3 font-mono text-sm text-ink-faint">
            Turning AI agents into tools that actually ship.
          </p>
          <p className="mt-6 max-w-md leading-relaxed text-ink-soft">
            我是{site.nameZh}（{site.name}），在 {site.company} 做 AI
            智能自动化工具。 这里记录我把 Agent
            编排成完整生产流水线的实践——从影视创作到 3D 设计，从全栈应用到游戏。
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              href="/posts/"
              className="shine rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-paper shadow-[0_8px_28px_-10px_rgba(122,162,247,0.55)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-ink hover:shadow-[0_14px_36px_-10px_rgba(122,162,247,0.7)]"
            >
              读文章
            </Link>
            <Link
              href="/projects/"
              className="rounded-md border border-hairline px-5 py-2.5 text-sm text-ink transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent-ink"
            >
              看项目
            </Link>
            <a
              href={site.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-xs text-ink-soft underline decoration-hairline underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
            >
              github.com/zq940222
            </a>
          </div>
        </div>
        <Terminal />
      </section>

      {/* Recent posts */}
      <section className="border-t border-hairline py-12">
        <div data-reveal>
          <SectionHead
            zh="最近文章"
            en="RECENT POSTS"
            href="/posts/"
            linkText="全部文章"
          />
        </div>
        <PostList posts={posts} />
      </section>

      {/* Featured projects */}
      <section className="border-t border-hairline py-12">
        <div data-reveal>
          <SectionHead
            zh="精选项目"
            en="FEATURED PROJECTS"
            href="/projects/"
            linkText="全部项目"
          />
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {featured.map((p, i) => (
            <ProjectCard
              key={p.name}
              project={p}
              index={i}
              reveal
              showBadge={false}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
