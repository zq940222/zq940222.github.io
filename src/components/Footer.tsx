import { site } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-hairline">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-5 py-8 font-mono text-xs text-ink-faint sm:flex-row sm:items-baseline sm:justify-between sm:px-8">
        <p>
          © {new Date().getFullYear()} {site.nameZh} {site.name} ·{" "}
          {site.location}
        </p>
        <p className="flex gap-4">
          <a
            href={`mailto:${site.email}`}
            className="transition-colors hover:text-accent"
          >
            email
          </a>
          <a
            href={site.github}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-accent"
          >
            github
          </a>
          <a href="/feed.xml" className="transition-colors hover:text-accent">
            rss
          </a>
        </p>
      </div>
    </footer>
  );
}
