---
title: 阿里的 GUI Agent 把"问一句用户"写进了动作空间
titleEn: Alibaba's GUI Agent Puts "Ask the User" in Its Action Space
date: "2026-08-21"
tags: [Qwen, GUI Agent, Computer Use, 人工门禁]
summary: 8 月 20 日国内标题一片"超越 GPT/Claude/Gemini"，但技术报告 7 月 30 日就挂在 arXiv 上了，权重到现在也没放。跑分要分平台看：手机端确实领先，桌面端是第二和第三。真正值得读的是它的动作空间——cli_command、api_call，和一个叫 ask_user 的动作。
summaryEn: The Chinese coverage landed Aug 20, but the technical report has been on arXiv since Jul 30 and the weights still aren't out. Read the benchmarks per platform, and read the action space first.
---

8 月 20 日国内媒体集体推了一波 **Qwen-UI-Agent**：阿里通义 MAI-UI 团队的 GUI 智能体基座模型，一个模型同时管手机、电脑、浏览器和 DeepSearch。标题基本都是"超越 GPT / Claude / Gemini 旗舰"。

先说时间线，因为这条被漏掉了：**技术报告 7 月 30 日就挂上 arXiv 了**（[2607.28227](https://arxiv.org/abs/2607.28227)，只有 v1），项目仓库的 News 里那条 "Introducing Qwen-UI-Agent" 也标着 `2026-07-30`。8 月 20 日这一波是中文侧的宣发，比论文晚了三周。所以这不是"今天发布了一个新模型"，是**一份已经公开三周的技术报告终于被翻译成中文标题**。

这篇是我读完技术报告、项目站和仓库之后的整理，还没上手——原因见文末，权重还没放出来。

## 跑分得分平台看

官方站点自己把跑分按平台切开了，切开看的结论和中文标题不太一样。

**手机端是真的领先**（成功率 %，数据取自[项目站](https://tongyi-mai.github.io/Qwen-UI-Agent/)）：

| 基准 | Qwen-UI-Agent | Seed 2.1 Pro | GPT-5.6 Sol | Claude Opus 4.8 | Gemini 3.1 Pro |
| --- | --- | --- | --- | --- | --- |
| MobileWorld | **82.1** | 73.2 | 70.1 | 67.5 | 58.1 |
| MobileWorld-Real | **92.2** | 88.7 | 85.4 | 84.7 | 86.2 |
| AndroidDaily | **97.5** | 95.2 | 92.6 | 93.0 | 93.8 |

MobileWorld 上领先 Opus 4.8 有 14.6 个点，这个差距在同代模型里算大的。而且 MobileWorld-Real 是**真机基准**——100 多台物理手机、150 多款 App、400 多个任务，这套环境同时也是它的训练环境。

**桌面端不是第一**：

| 基准 | Qwen-UI-Agent | Claude Opus 4.8 | GPT-5.5 | Seed 2.1 Pro | Gemini 3.1 Pro |
| --- | --- | --- | --- | --- | --- |
| OSWorld-Verified | 79.5 | **83.4** | 78.7 | 78.8 | 76.2 |
| OSWorld-v2（部分进度） | 40.0 | **54.8** | 49.5 | — | — |
| WebArena | **73.6** | 71.9 | 69.5 | — | 65.3 |

OSWorld-Verified 是第二，长周期的 OSWorld-v2 是第三，而且 40.0 那个数是**部分进度分不是任务成功率**——长程桌面任务恰好是真实工作流最容易断的地方。浏览器端 WebArena 反超了 Opus 4.8，但幅度是 1.7 个点。

顺手记两个细节。桌面和浏览器这几栏的 OpenAI 对照用的是 **GPT-5.5**，手机那几栏用的是 GPT-5.6 Sol，不是一套对照。另外 ScreenSpot-Pro 那个常被引用的 **81.5 是开了缩放的成绩，不开缩放是 76.6**——MAI-UI 1.0 今年 1 月刷榜时特意强调过 "without any zoom-in tricks"，引用的时候别把两个数混了。

还有一条得摆在前面：项目站的评测声明写着所有分数都是**在作者自己的评测环境里复现的**，带 † 的对照更是作者亲手跑的，harness、judge、模拟器和任务子集的设置与官方评测有差异。这不是说数据不能看，是说这是一份自评报告。

## 真正该读的是动作空间

跑分之外，我觉得这份报告最实的部分是动作空间的定义。它不是"GUI 动作集合"，是四类东西的并集：

- **GUI 动作**——按平台暴露各自支持的子集；
- **`cli_command`**——直接执行 bash。桌面任务里 CLI 和点击是并列的两大主力动作类型；
- **`api_call`**——带结构化参数调外部服务；
- **`ask_user`**——向用户要缺失信息，或者在敏感操作前拿明确确认。

再加上**批量动作**：一次模型决策可以吐多个动作，桌面任务里约 40% 的输出是批量的。

`cli_command` 这条比看起来重要。GUI Agent 最蠢的失败模式就是用鼠标去做本该一行命令解决的事——重命名二十个文件、递归找一个目录。把 bash 放进同一个动作空间，等于允许模型在"该点就点、该敲就敲"之间自己选。效果也能在跑分上看出来：Terminal-Bench 2.0 从基座的 41.1 涨到 **50.1**，这是 GUI 训练往终端任务上的正迁移。

顺着这条看通用能力的对照表，会发现另一件事——它做 GUI 特化，**基本没把通用能力吃掉**：

| 基准 | Qwen-UI-Agent | Qwen3.5-27B |
| --- | --- | --- |
| MMLU-Pro | 86.5 | 86.0 |
| MMMU-Pro | 72.4 | 73.5 |
| IFEval（prompt 严格） | 90.2 | 90.4 |
| Terminal-Bench 2.0 | 50.1 | 41.1 |
| BrowseComp-ZH | 75.0 | 62.1 |

报告里没有一句"我们的基座是 Qwen3.5-27B"，但对照表全程拿它当参照、通用分几乎一分不差、正文又提到"27B 规模上的能力"——基座是它的可能性很高。真正的信息是：**GUI 特化没有换来通用能力的塌陷**。绝大多数 GUI 专用模型是反例，同一张表里 GUI-Owl 32B 的 MMMU-Pro 是 39.5、Tau2-Bench 是 6.1，专下去就通不回来了。

## ask_user：门禁被做成了动作，但只是训出来的

我做 [Claude-Code-Film-Studio](https://github.com/zq940222/Claude-Code-Film-Studio) 反复验证过三条编排原则：工具窄化、结构化交付物、关键节点的人工门禁。第三条一直是最难落的——[上一篇写 deepseek-harness](/posts/deepseek-v4-pro-and-harness/) 时我最想翻的也是这部分代码。

Qwen-UI-Agent 是我见过第一个把门禁直接做进动作空间的：`ask_user` 和 GUI 点击、bash 执行是同一层的一等公民。报告里对应的训练侧设计是一个专门的 **User Agent**——训练时扮演用户，补缺失信息、对涉及数据和支付的操作给明确确认，遇到验证码这类必须真人上手的直接交还控制权，用户处理完任务再从断点续上。官方 demo 也是照这个演的：订车那条一路比价，最后停在"Approve CNY 86"，画面上明写 *No booking before approval*；航班取消那条比完机票和高铁给三个方案，**不替用户订**。

但这里得把话说准：**这是训练出来的行为，不是拦下来的动作**。

报告自己的措辞是"包含了安全敏感的训练场景，教会模型在需要授权时交还控制权"，结尾的 limitation 也写得很直接——*"More systematic safety evaluations, safety-oriented training objectives, and interpretability-based methods ... remain important directions."* 更系统的安全评测、面向安全的训练目标、可解释性约束，都还是 open problem。

对我这种要跑批量流水线的人，差别很要命。一个"学会了在付款前问一句"的模型，和一个"付款动作在 harness 层被硬拦住、必须等人点头才放行"的系统，不是一回事。前者是概率，后者是保证。这也是我说这份报告最实的部分在动作空间而不是安全章节的原因——它给了门禁一个**位置**，怎么把这个位置变成不可绕过的接缝，还是接入方自己的工程活。

（一个细节：报告正文管这个动作叫 `ask_user`，结论段落里出现过一次 `call_user`。同一个东西，两个名字，我按正文的写法记。）

## 提个醒：权重没放出来

中文报道里有一部分把这件事写成了"开源"。我去核了一下：

Hugging Face 上 `Tongyi-MAI` 组织下现在只有四个模型——`Z-Image-Turbo`、`Z-Image`，以及 **`MAI-UI-2B` 和 `MAI-UI-8B`**。后两个是 2025 年 12 月 29 日随 MAI-UI 1.0 放出来的，仓库 News 里那条 Model Release 也只对应它们。**Qwen-UI-Agent 自己的权重，到我写这篇时没有。**

仓库的 LICENSE 是 Apache 2.0，覆盖的是这个项目仓库；项目站的图例把 Qwen-UI-Agent 单独列成一类，和 "Open-weight Model" 并排而不是归进去。所以现在能拿到的是：技术报告、项目站、demo 视频，以及上一代 2B/8B 的权重。

这不影响这份报告的价值——真机环境、混合动作空间、`ask_user` 这几个设计本身就值得读，而且都是可以照着自己实现一遍的。但"开源了一个能操作手机电脑的模型、下载下来就能跑"这个预期，现在还落不了地。

---

参考：[技术报告 arXiv:2607.28227](https://arxiv.org/abs/2607.28227) · [项目站与跑分](https://tongyi-mai.github.io/Qwen-UI-Agent/) · [GitHub Tongyi-MAI/MAI-UI](https://github.com/Tongyi-MAI/MAI-UI) · [MobileWorld 基准](https://tongyi-mai.github.io/MobileWorld/) · [8 月 20 日中文报道](https://news.mydrivers.com/1/1145/1145200.htm)
