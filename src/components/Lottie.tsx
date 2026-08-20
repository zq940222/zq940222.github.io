"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type { AnimationItem } from "lottie-web";

/**
 * 动画数据的注册表。这里用「名字 → 动态 import」而不是把加载函数
 * 当 prop 传进来，有两个原因：
 *   1. 函数没法跨 Server → Client 边界序列化，页面就得整个变成客户端组件
 *   2. 字符串 prop 是稳定的，effect 依赖不会每次渲染都变
 * 每个 import() 各自成 chunk，只有真正用到的那个会进网络。
 */
const SOURCES = {
  "signal-lost": () => import("@/lottie/signal-lost.json"),
  pipeline: () => import("@/lottie/pipeline.json"),
} as const;

type Props = {
  name: keyof typeof SOURCES;
  /** 静态首帧。无 JS、减少动效、加载失败时看到的就是它，
      所以它必须自己独立成立，不是占位符 */
  fallback: ReactNode;
  /** 给整块图形的无障碍描述 */
  label: string;
  loop?: boolean;
  className?: string;
};

/**
 * Lottie 宿主。三件事：
 *   1. prefers-reduced-motion 时根本不加载播放器，直接留在 fallback
 *   2. 进视口才付加载代价，出视口就暂停——不给看不见的东西烧 CPU
 *   3. 播放器起来之前和失败之后，画面都是那张静态首帧
 * IntersectionObserver + 减少动效判断的写法与 Reveal / Pointer 保持一致。
 */
export default function Lottie({
  name,
  fallback,
  label,
  loop = true,
  className,
}: Props) {
  const host = useRef<HTMLDivElement | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (typeof IntersectionObserver === "undefined") return;

    let anim: AnimationItem | undefined;
    let starting = false;
    let dropped = false;

    const start = async () => {
      starting = true;
      try {
        // 播放器与动画数据并行拉，两边都只在这一刻才进网络
        const [lottie, data] = await Promise.all([
          import("lottie-web/build/player/lottie_light"),
          SOURCES[name](),
        ]);
        // 等 await 的这段时间里组件可能已经卸载了
        if (dropped) return;
        anim = lottie.default.loadAnimation({
          container: el,
          renderer: "svg",
          loop,
          autoplay: true,
          animationData: data.default,
        });
        setPlaying(true);
      } catch (err) {
        // 播放器或数据没拿到：静态首帧就是最终形态。但要把原因喊出来——
        // 悄悄咽掉异常的话，画面只是「没动」，排查时毫无线索
        console.error(`[Lottie] ${name} 加载失败`, err);
        starting = false;
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (anim) {
            if (entry.isIntersecting) anim.play();
            else anim.pause();
            continue;
          }
          if (entry.isIntersecting && !starting) void start();
        }
      },
      { rootMargin: "120px" },
    );

    io.observe(el);

    return () => {
      dropped = true;
      io.disconnect();
      anim?.destroy();
    };
  }, [name, loop]);

  return (
    <div
      className={`relative ${className ?? ""}`}
      role="img"
      aria-label={label}
    >
      <div ref={host} className="absolute inset-0" aria-hidden />
      {/* 播放器接手后才把首帧撤下，中间不留空档 */}
      {!playing && (
        <div className="absolute inset-0" aria-hidden>
          {fallback}
        </div>
      )}
    </div>
  );
}
