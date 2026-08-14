import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, getAllPosts, getPost } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/posts/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: PageProps<"/posts/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  return (
    <main className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-8">
      <p className="font-mono text-xs text-ink-faint">
        <Link href="/posts/" className="transition-colors hover:text-accent">
          POSTS
        </Link>{" "}
        / {formatDate(post.date)}
      </p>
      <h1 className="mt-4 font-display text-3xl font-bold leading-snug tracking-tight sm:text-4xl">
        {post.title}
      </h1>
      {post.titleEn && (
        <p className="mt-2 font-mono text-sm text-ink-faint">{post.titleEn}</p>
      )}
      <p className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded bg-accent-wash px-1.5 py-0.5 font-mono text-[0.65rem] text-accent-ink"
          >
            {tag}
          </span>
        ))}
      </p>
      <article
        className="prose mt-10"
        dangerouslySetInnerHTML={{ __html: post.html }}
      />
      <p className="mt-14 border-t border-hairline pt-6 font-mono text-xs text-ink-faint">
        <Link
          href="/posts/"
          className="group inline-flex items-center gap-1.5 transition-colors hover:text-accent"
        >
          <span className="inline-block transition-transform duration-300 ease-out group-hover:-translate-x-1">
            ←
          </span>
          返回文章列表
        </Link>
      </p>
    </main>
  );
}
