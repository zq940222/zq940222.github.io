import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-start justify-center px-5 py-20 sm:px-8">
      <p className="font-mono text-xs tracking-widest text-accent">404</p>
      <h1 className="mt-4 font-display text-3xl font-bold tracking-tight">
        这一页不存在
      </h1>
      <p className="mt-3 leading-relaxed text-ink-soft">
        地址可能拼错了，或者内容已经移走。
      </p>
      <Link
        href="/"
        className="shine mt-8 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-paper transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent-ink"
      >
        回首页
      </Link>
    </main>
  );
}
