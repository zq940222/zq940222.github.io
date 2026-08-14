---
title: DeepSeek 同一天发了模型和跑模型的壳子
titleEn: DeepSeek Shipped a Flagship Model and an Agent Harness on the Same Day
date: "2026-08-14"
tags: [DeepSeek, Agent Harness, 开源, LLM]
summary: V4-Pro 正式版和 deepseek-harness 在 8 月 13 日一起落地。比模型本身更值得读的是两件事：涨价表把"什么时候跑"变成了架构决策，以及那个 harness 把 agent loop 本身做成了可替换插件。
summaryEn: V4-Pro GA and deepseek-harness both landed on Aug 13. The pricing table and the plugin architecture matter more than the benchmarks.
---

8 月 13 日 DeepSeek 做了两件事：**V4-Pro 正式版**结束预览转正，同一天开源了 **[deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)**——一个自家的 agent harness。

分开看都是常规操作，放一起看才是信号：模型厂商不再只卖 token，开始连"怎么跑这个模型"一起定义了。

这篇是我读完官方发布说明、定价页和 harness 仓库之后的整理和判断，还没上手实测，实测的部分等我跑过再补。

## V4-Pro 正式版：升级点都在 Agent 上

先把硬事实摆出来。以下来自 [官方 GA 公告](https://api-docs.deepseek.com/news/news260813/) 和 [模型卡](https://huggingface.co/deepseek-ai/DeepSeek-V4-Pro)：

| 项 | 值 |
| --- | --- |
| 检查点 | V4-Pro-0813（模型名不变，仍是 `deepseek-v4-pro`） |
| 参数 | 1.6T 总参数，每 token 激活 49B（MoE） |
| 上下文 | 1M，最大输出 384K |
| 许可 | MIT |

官方对这次转正的定性是"Agent 能力大幅升级"，具体落到三个可用的东西上：

- **推理强度可调**：`low` / `high` / `max` 三档，官方给的建议是简单任务用 low、**日常 Agent 工作流用 high**、复杂任务用 max。注意这是官方自己把 high 标成 Agent 场景的默认档；
- **原生支持 OpenAI Responses API**，并且专门针对 Codex 做了一键接入；
- Anthropic 格式的接口也在，一套模型三种调用协议。

模型卡上公布的成绩（Pro-Max 模式）里，跟 Agent 最相关的是 **SWE-Bench Verified 80.6**、LiveCodeBench 93.5、MRCR 1M 长上下文 83.5。

这里要提个醒：模型卡对应的论文是 4 月挂出来的，标注的是 preview 版本；GA 公告里另配了一张跑分图但正文没给数字。所以**这组数字别直接当成 0813 检查点的成绩**，当量级参考就好。

## 真正该读的是涨价表

比跑分更值得盯的是定价。新价格 **2026 年 8 月 16 日 16:00 UTC 生效**，同时引入峰谷计价。

以 V4-Pro 每百万 token 计（[定价页](https://api-docs.deepseek.com/quick_start/pricing/)）：

| 项 | 现价 | 新价（峰） | 新价（谷） |
| --- | --- | --- | --- |
| 输入 · 命中缓存 | $0.003625 | $0.044 | $0.022 |
| 输入 · 未命中 | $0.435 | $1.32 | $0.66 |
| 输出 | $0.87 | $3.96 | $1.98 |

算一下倍数：输出峰值 **4.5 倍**、谷值 2.3 倍；未命中输入峰值 3 倍。

但最狠的是**命中缓存的输入涨了 12 倍**（谷值也有 6 倍）。这条对做 Agent 流水线的人杀伤力最大——多步 agent 循环的成本结构里，每一步都要重放一遍系统提示词和工具 schema，命中缓存的输入占比极高。原来这部分近乎免费，现在它开始进账单了。

峰时是 **01:00–04:00 和 06:00–10:00 UTC**，换成北京时间就是 **09:00–12:00 和 14:00–18:00**——精确地覆盖了国内的工作时段。

这个设计的言外之意很清楚：**交互式的活白天干，批量的活挪到晚上**。对我这种跑影视流水线的场景，一集片子的分镜拆解、批量提示词生成、质检抽帧这些都是纯批处理，挪到谷时直接省一半。以前"什么时候跑"是个调度细节，现在它是个成本架构决策。

## deepseek-harness：把 agent loop 也做成插件

同一天开源的 `dsh` 更有意思。一天就冲到 5.6 万 star（我写这篇时 56132，4588 fork），TypeScript，MIT。

跑起来只要一行：

```sh
npx @deepseek-ai/dsh web
```

默认在 `http://127.0.0.1:3080` 起一个 Web UI。也有 `headless` profile，一次性跑完不起服务器，适合塞进 CI。

架构上它押的是一句话：**Everything is a Plugin**。底座是 [Cordis](https://github.com/cordiverse/cordis)，插件往共享 context 上挂服务、类型化事件和可回滚的副作用。

这句话的分量在架构文档里说得很直白：

> Every part of the product is a plugin, including the model adapter, the tool registry, the session log, and the agent loop itself, so every part is replaceable from configuration.
>
> There is no privileged core to patch.

**agent loop 本身是插件**，这是我觉得最值得注意的一句。多数 agent 框架给你留的是工具注册和提示词模板的口子，循环驱动本身是写死的内核——想改调度策略就得 fork。dsh 的说法是没有特权内核，`core/agent-loop` 只是"默认那个驱动实现"，配置层就能换掉。

组合方式是分层的：profile 叠 bundle，每层都能被上层 patch，最后可以直接打印出你这台机器实际启动的插件树：

```sh
dsh --profile web --dump-config
```

事件被分成三类，扩展时先选域：session 事件是追加到日志、要活过重载的持久事实；`agent/*` 事件带着活的 Agent 对象，用来在执行中观测和拦截；capability 事件（`fs/*`、`tools/*`、`telemetry/*`）负责在接缝上挂策略和适配器。

执行模型也定义得比较干净：一个 **step** 是一次模型请求加它调用的工具，一个 **turn** 是零个或多个 step，开在第一份输入被认领之前，关在无债可还之后。

## 对做流水线的人意味着什么

我自己做 [Claude-Code-Film-Studio](https://github.com/zq940222/Claude-Code-Film-Studio) 反复验证过三条编排原则：工具窄化、结构化交付物、关键节点的人工门禁。拿这三条去对 dsh：

**工具窄化**它给得比较到位——作用域化的工具注册表加上带守卫的执行管线，`core/scope` 专门做每个 agent 的作用域注册。这正是"每个 agent 只拿自己需要的那几个工具"需要的原语。

**人工门禁**是我最想去翻代码的部分。`dsh-base` 里明确列了 sandbox 和 approval policy，加上 `agent/*` 事件里有 request 和 validation——看起来是有地方插确认逻辑的，但门禁做得够不够硬（比如能不能阻塞住一个花钱的批量提交等人点头），得实际跑过才知道。

**一个模型厂商开源自家 harness**这件事本身也值得想一想。好处是模型能力和调用壳子同步演进——V4-Pro 主打 Agent 升级，配套的壳子当天就到位。风险是这个壳子的抽象天然会朝着自家模型的形状长。它的 model adapter 是插件、Anthropic 和 OpenAI 协议都支持，所以短期内不至于锁死，但值得留个心眼。

最后是个务实的提醒：**仓库自己挂着 developer preview 的牌子**，README 上原话是 "THERE WILL BE COMPATIBILITY-BREAKING CHANGES"。仓库是 8 月 13 日才建的。现在适合拿来读架构、试想法，别急着把生产流水线迁上去。

---

参考：[V4-Pro GA 公告](https://api-docs.deepseek.com/news/news260813/) · [定价页](https://api-docs.deepseek.com/quick_start/pricing/) · [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) · [Cordis](https://github.com/cordiverse/cordis)
