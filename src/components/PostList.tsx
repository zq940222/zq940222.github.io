import Link from "next/link";
import type { CSSProperties } from "react";
import { formatDate, type PostMeta } from "@/lib/posts";

export default function PostList({ posts }: { posts: PostMeta[] }) {
  return (
    <ul className="divide-y divide-hairline">
      {posts.map((post, i) => (
        <li key={post.slug} data-reveal style={{ "--i": i } as CSSProperties}>
          <Link
            href={`/posts/${post.slug}/`}
            className="group grid gap-1.5 py-6 sm:grid-cols-[7.5rem_1fr] sm:gap-6"
          >
            <time className="pt-1 font-mono text-xs text-ink-faint transition-colors duration-300 group-hover:text-accent">
              {formatDate(post.date)}
            </time>
            <div>
              <h3 className="flex items-start gap-2 font-display text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-accent-ink">
                <span className="transition-transform duration-300 ease-out group-hover:translate-x-1">
                  {post.title}
                </span>
                <span
                  aria-hidden
                  className="mt-0.5 shrink-0 font-mono text-sm text-accent opacity-0 transition-all duration-300 ease-out -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100"
                >
                  →
                </span>
              </h3>
              {post.titleEn && (
                <p className="mt-0.5 font-mono text-xs text-ink-faint">
                  {post.titleEn}
                </p>
              )}
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {post.summary}
              </p>
              <p className="mt-2.5 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded bg-accent-wash px-1.5 py-0.5 font-mono text-[0.65rem] text-accent-ink transition-colors duration-300 group-hover:bg-accent/20"
                  >
                    {tag}
                  </span>
                ))}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
