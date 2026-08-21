/**
 * 生成 src/lottie/ 下的两个 Lottie 动画。
 *
 *   node scripts/build-lottie.mjs      （或 npm run lottie）
 *
 * 为什么有这个脚本：Lottie JSON 按惯例是不透明产物（正常是 AE 导出的），
 * 但这两个动画是手写的——直接改 JSON 里的关键帧既难读又容易写坏。
 * 所以这里是它们唯一的可读来源：调时长、配色、节奏都改这个文件再重跑，
 * 产物一起提交。改完记得 `git diff src/lottie/` 看一眼输出是否符合预期。
 *
 * 配色一律引用站点自己的 token（见 src/app/globals.css），
 * 不要在这里写死新的颜色——那样主题一改动画就脱节了。
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const OUT = fileURLToPath(new URL("../src/lottie", import.meta.url));

// 站点 token → lottie 的 0..1 浮点
const C = {
  accent: [0.478, 0.635, 0.969, 1], // #7aa2f7
  amber: [0.878, 0.686, 0.408, 1], // #e0af68
  signal: [0.62, 0.808, 0.416, 1], // #9ece6a
  dim: [0.435, 0.478, 0.651, 1], // #6f7aa6
};

const EASE = { o: { x: [0.33], y: [0] }, i: { x: [0.67], y: [1] } };
const LIN = { o: { x: [0.5], y: [0.5] }, i: { x: [0.5], y: [0.5] } };

// 关键帧序列：除最后一帧外都带 o/i 缓动
const anim = (frames, ease = EASE) => ({
  a: 1,
  k: frames.map(([t, s], idx) =>
    idx === frames.length - 1 ? { t, s } : { t, s, ...ease },
  ),
});
const fix = (k) => ({ a: 0, k });

const tr = () => ({
  ty: "tr",
  a: fix([0, 0]),
  p: fix([0, 0]),
  s: fix([100, 100]),
  r: fix(0),
  o: fix(100),
  sk: fix(0),
  sa: fix(0),
});

// 折线：全部直角顶点，切线一律 [0,0]
const path = (verts) => ({
  ty: "sh",
  ind: 0,
  nm: "path",
  ks: fix({
    c: false,
    v: verts,
    i: verts.map(() => [0, 0]),
    o: verts.map(() => [0, 0]),
  }),
});

const stroke = (c, w) => ({
  ty: "st",
  nm: "stroke",
  c: Array.isArray(c) ? fix(c) : c,
  o: fix(100),
  w: fix(w),
  lc: 2,
  lj: 2,
  ml: 1,
});

// trim 的 s/e 可以给定值也可以给 anim()：s 追着 e 跑就是一段带尾巴的行进光段
const trim = (s, e) => ({
  ty: "tm",
  nm: "trim",
  s: Array.isArray(s) || typeof s === "number" ? fix(s) : s,
  e: Array.isArray(e) || typeof e === "number" ? fix(e) : e,
  o: fix(0),
  m: 1,
});

const ellipse = (size) => ({
  ty: "el",
  nm: "ring",
  p: fix([0, 0]),
  s: fix([size, size]),
});
const fill = (c) => ({ ty: "fl", nm: "fill", c: fix(c), o: fix(100) });

const layer = (ind, nm, shapes, ks, op) => ({
  ddd: 0,
  ind,
  ty: 4,
  nm,
  sr: 1,
  ks: {
    a: fix([0, 0, 0]),
    p: fix([0, 0, 0]),
    s: fix([100, 100, 100]),
    r: fix(0),
    o: fix(100),
    ...ks,
  },
  ao: 0,
  shapes: [{ ty: "gr", nm: nm + "-g", it: [...shapes, tr()] }],
  ip: 0,
  op,
  st: 0,
  bm: 0,
});

// 注意：layers 数组里越靠前越靠上层（lottie 按倒序进 DOM）
const root = (nm, w, h, op, layers) => ({
  v: "5.13.0",
  fr: 30,
  ip: 0,
  op,
  w,
  h,
  nm,
  ddd: 0,
  assets: [],
  layers,
  markers: [],
});

/* ————————————————————————————————
   1. signal-lost —— 404
   结构层常亮（暗），高亮层像一束扫过的脉冲：
   trim 的 s 追着 e 跑，形成一段有尾巴的行进光段。
   全程不整体淡出，所以循环时画面不会整块消失。
——————————————————————————————— */
{
  const OP = 108;
  const B = 60;
  // 振幅一路衰减 38 → 28 → 18 → 8，走到 x=240 断掉，之后是平直基线
  const full = [
    [0, B], [24, B], [36, 22], [48, 98], [60, B],
    [88, B], [100, 32], [112, 88], [124, B],
    [152, B], [164, 42], [176, 78], [188, B],
    [212, B], [220, 52], [228, 68], [236, B], [240, B],
    [470, B],
  ];

  const layers = [
    // 断点标记：常亮，只在脉冲经过时弹一下，不闪灭
    layer(
      1,
      "break",
      [ellipse(11), fill(C.amber)],
      {
        p: fix([240, B, 0]),
        s: anim([
          [40, [100, 100, 100]],
          [54, [142, 142, 100]],
          [66, [100, 100, 100]],
        ]),
        o: fix(100),
      },
      OP,
    ),
    // 行进的高亮脉冲
    layer(
      2,
      "pulse",
      [
        path(full),
        stroke(C.accent, 2.5),
        trim(
          anim([
            [20, [0]],
            [98, [100]],
          ]),
          anim([
            [0, [0]],
            [78, [100]],
          ]),
        ),
      ],
      {},
      OP,
    ),
    // 结构层：整条路径常亮，画面永远不空
    layer(3, "structure", [path(full), stroke(C.dim, 2)], { o: fix(28) }, OP),
  ];

  writeFileSync(
    `${OUT}/signal-lost.json`,
    JSON.stringify(root("signal-lost", 480, 120, OP, layers)),
  );
}

/* ————————————————————————————————
   2. pipeline —— about
   底轨常亮；节点点亮后回落到静息态（不是消失）；
   走过的那段先画进来，再从头端抽走，循环处不闪断。
——————————————————————————————— */
{
  const OP = 150;
  const Y = 40;
  const XS = [60, 180, 300, 420, 540];
  const HIT = XS.map((_, i) => 12 + i * 24); // 数据包抵达各节点的帧
  const REST_IN = 138; // 开始回落
  const REST_OUT = 148; // 回到静息

  const layers = [
    layer(
      1,
      "packet",
      [ellipse(9), fill(C.amber)],
      {
        p: anim(
          [
            [12, [XS[0], Y, 0]],
            [108, [XS[4], Y, 0]],
          ],
          LIN,
        ),
        o: anim([
          [6, [0]],
          [14, [100]],
          [104, [100]],
          [112, [0]],
        ]),
      },
      OP,
    ),
    // 5 个节点：命中转 signal 绿并弹一下，末尾回落到冷灰静息态
    ...XS.map((x, i) =>
      layer(
        2 + i,
        `node-${i}`,
        [
          ellipse(14),
          stroke(
            anim([
              [0, C.dim],
              [HIT[i], C.dim],
              [HIT[i] + 10, C.signal],
              [REST_IN, C.signal],
              [REST_OUT, C.dim],
            ]),
            2,
          ),
        ],
        {
          p: fix([x, Y, 0]),
          s: anim([
            [HIT[i], [100, 100, 100]],
            [HIT[i] + 7, [152, 152, 100]],
            [HIT[i] + 16, [112, 112, 100]],
          ]),
          o: anim([
            [0, [32]],
            [HIT[i], [32]],
            [HIT[i] + 8, [100]],
            [REST_IN, [100]],
            [REST_OUT, [32]],
          ]),
        },
        OP,
      ),
    ),
    // 走过的那一段：先从尾端画进来，再从头端抽走
    layer(
      7,
      "progress",
      [
        path([
          [XS[0], Y],
          [XS[4], Y],
        ]),
        stroke(C.accent, 2),
        trim(
          anim(
            [
              [118, [0]],
              [146, [100]],
            ],
            EASE,
          ),
          anim(
            [
              [12, [0]],
              [108, [100]],
            ],
            LIN,
          ),
        ),
      ],
      {},
      OP,
    ),
    // 底轨：常亮，画面永远不空
    layer(
      8,
      "track",
      [
        path([
          [XS[0], Y],
          [XS[4], Y],
        ]),
        stroke(C.dim, 2),
      ],
      { o: fix(30) },
      OP,
    ),
  ];

  writeFileSync(
    `${OUT}/pipeline.json`,
    JSON.stringify(root("pipeline", 600, 80, OP, layers)),
  );
}

console.log(`wrote signal-lost.json + pipeline.json → ${OUT}`);
