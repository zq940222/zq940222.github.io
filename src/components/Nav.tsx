import Link from "next/link";
import { site } from "@/lib/site";

const links = [
  { href: "/posts/", zh: "文章", en: "Posts" },
  { href: "/projects/", zh: "项目", en: "Projects" },
  { href: "/about/", zh: "关于", en: "About" },
];

export default function Nav() {
  return (
    <header className="border-b border-hairline bg-paper/90 backdrop-blur sticky top-0 z-10">
      <nav className="mx-auto flex max-w-5xl items-baseline justify-between px-5 py-4 sm:px-8">
        <Link href="/" className="group flex items-baseline gap-2.5">
          <span className="font-mono text-sm text-accent">~/</span>
          <span className="font-display text-lg font-semibold tracking-tight">
            {site.nameZh}
          </span>
          <span className="font-mono text-xs text-ink-faint transition-colors group-hover:text-accent">
            {site.name}
          </span>
        </Link>
        <div className="flex items-baseline gap-5 sm:gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="group text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {l.zh}
              <span className="ml-1 hidden font-mono text-[0.65rem] text-ink-faint group-hover:text-accent sm:inline">
                {l.en}
              </span>
            </Link>
          ))}
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-xs text-ink-soft underline decoration-hairline underline-offset-4 transition-colors hover:text-accent hover:decoration-accent"
          >
            GitHub ↗
          </a>
        </div>
      </nav>
    </header>
  );
}
