/**
 * 耐药机制解读助手 - 知识库
 *
 * 肺炎克雷伯菌 (Klebsiella pneumoniae) 耐药机制条目
 *
 * 条目结构说明（新增条目按此模板填写）：
 * {
 *   id: "KP-机制缩写",           // 唯一标识
 *   bacteria: "KP",              // 菌种 ID（对应 config.js 中 bacteria.id）
 *   label: "机制中文名",          // 显示用名称
 *   category: "机制大类",         // 碳青霉烯酶 / ESBL / AmpC / 孔蛋白丢失 / 外排泵 / PBPs突变 ...
 *   gene: "耐药基因名",           // 如 bla_KPC-2
 *   priority: 100,               // 排序优先级（越大越靠前）
 *
 *   // === 核心：多药联合匹配规则 ===
 *   pattern: {
 *     // 必须全部满足（硬条件）
 *     allOf: ["MEM:R", "ETP:R"],
 *     // N 个条件中至少满足 M 个
 *     atLeastN: [M, ["CTX:R", "CRO:R", "CAZ:R", "FEP:R"]],
 *     // 必须全部不满足（用于排除其他机制）
 *     noneOf: ["ATM:S", "CZA:S"],
 *     // 支持性证据（满足加分，不满足不扣分）
 *     supporting: ["CZA:S", "IMR:S"],
 *     // 提示性信息（匹配到后额外展示）
 *     flags: ["头孢西丁通常敏感", "碳青霉烯 MIC 中度升高"]
 *   },
 *
 *   // === 机制解读 ===
 *   summary: "一句话总结",
 *   interpretation: "详细机制解读（支持 Markdown 格式的字符串）",
 *   differentiation: {
 *     "vs_KPC-2": "鉴别要点...",
 *     "vs_NDM-1": "鉴别要点...",
 *   },
 *   clinicalNote: "临床关联（仅供学习）",
 *   references: ["CLSI M100 Ed35", "PMID: xxxxx"],
 *   createdBy: "",  // 知识条目作者
 * }
 *
 * 【给医学专家的填写指南】
 * 1. pattern 是判断核心：allOf=必须全部耐药才触发; noneOf=用于排除相似机制
 * 2. 每个机制至少需要 3-5 个药物条件，单药不足以判断
 * 3. interpretation 写得越详细越好，这是产品核心价值
 * 4. differentiation 写清楚「为什么是这个机制而不是那个」，这是产品区分度
 * 5. 不确定的条目可以先留空 pattern，只填 interpretation，让系统做模糊匹配
 */

const KNOWLEDGE_BASE = [

  // ============================================================
  // 碳青霉烯酶 — Class A (丝氨酸碳青霉烯酶)
  // ============================================================

  {
    id: 'KP-KPC-2',
    bacteria: 'KP',
    label: 'KPC-2 碳青霉烯酶',
    category: '碳青霉烯酶 / Class A 丝氨酸β-内酰胺酶',
    gene: 'bla_KPC-2 (Tn4401 转座子)',
    priority: 100,

    pattern: {
      allOf: ['MEM:R', 'IPM:R'],
      atLeastN: [2, ['CTX:R', 'CRO:R', 'CAZ:R', 'FEP:R']],
      noneOf: ['ATM:S'],   // ATM:S → 排除 NDM
      supporting: ['CZA:S', 'IMR:S', 'MEV:S', 'ETP:R'],
      flags: ['碳青霉烯耐药', '新型酶抑制剂复合物恢复敏感', '头孢西丁可能敏感', '美罗培南+亚胺培南均耐药为最低要求']
    },

    summary: 'KPC-2 是全球最常见的碳青霉烯酶之一，可水解几乎所有β-内酰胺类抗生素，但可被阿维巴坦、瑞来巴坦、法硼巴坦抑制。',

    interpretation: `**耐药原因：**
KPC-2（Klebsiella pneumoniae Carbapenemase-2）属于 Ambler Class A 丝氨酸β-内酰胺酶。其活性丝氨酸位点可高效水解碳青霉烯类抗生素（美罗培南、亚胺培南、厄他培南）、广谱头孢菌素及氨曲南。

**机制背景：**
• bla_KPC-2 基因通常位于 Tn4401 转座子上，可通过质粒在肠杆菌目细菌间水平传播
• KPC-2 可水解青霉素类、头孢菌素类、氨曲南及碳青霉烯类，底物谱极广。其对碳青霉烯类的水解催化效率（kcat/Km）实际上**低于**青霉素类和多数头孢菌素类，但由于与碳青霉烯类的高亲和力（低 Km）及通常较高的酶表达量，仍可在临床相关药物浓度下有效水解碳青霉烯类——这正是 KPC 区别于 ESBL 的关键
• KPC-2 不能高效水解头霉素类（头孢西丁），因此头孢西丁可能仍为敏感

**为何新型酶抑制剂复合物有效：**
阿维巴坦（avibactam）、瑞来巴坦（relebactam）、法硼巴坦（vaborbactam）均为非β-内酰胺类β-内酰胺酶抑制剂，可与 KPC-2 活性丝氨酸位点共价结合，使酶不可逆失活。因此：
• 头孢他啶/阿维巴坦（CZA）通常敏感
• 亚胺培南/瑞来巴坦（IMR）通常敏感
• 美罗培南/法硼巴坦（MEV）通常敏感

**克拉维酸为何无效：**
克拉维酸对 KPC-2 的抑制活性极弱（IC50 > 100 μM），临床常用的阿莫西林/克拉维酸、替卡西林/克拉维酸对产 KPC-2 菌株无效。`,

    differentiation: {
      'vs_NDM': 'NDM 对氨曲南**敏感**（金属酶不水解单环内酰胺类），KPC 对氨曲南**耐药**。这是最重要的鉴别点。',
      'vs_KPC-33': 'KPC-2 对头孢他啶/阿维巴坦（CZA）**敏感**，KPC-33 因 D179Y 突变导致 CZA **耐药**。CZA 敏感性是区分两者的关键。',
      'vs_ESBL_porin': '单独 ESBL + 孔蛋白丢失时，碳青霉烯 MIC 通常仅轻度升高（尤其是厄他培南先出现耐药），且 CZA 依然敏感。但 KPC-2 的碳青霉烯 MIC 通常明确耐药。',
      'vs_OXA-48': 'OXA-48 对碳青霉烯水解活性弱，可能仅表现为厄他培南耐药而美罗培南/亚胺培南敏感。KPC-2 通常对所有碳青霉烯均耐药。',
    },

    clinicalNote: '产 KPC-2 菌株感染，头孢他啶/阿维巴坦（CZA）为常用治疗选择。需结合药敏结果和感染部位综合判断。',
    references: [
      '胡付品等,《细菌药物敏感性试验执行标准和典型报告解读》第二版, Case 05, Case 12', 'CLSI M100 Ed35', 'EUCAST Clinical Breakpoints', 'PMID: 24759744 (KPC β-lactamases review)'],
    createdBy: '【待专家审核】',
  },

  {
    id: 'KP-KPC-33',
    bacteria: 'KP',
    label: 'KPC-33 (KPC-2 D179Y 突变体)',
    category: '碳青霉烯酶 / Class A 丝氨酸β-内酰胺酶（CAZ/AVI 耐药型）',
    gene: 'bla_KPC-33 (bla_KPC-2 的 D179Y 点突变)',
    priority: 99,

    pattern: {
      allOf: ['CZA:R'],
      atLeastN: [1, ['MEM:R', 'IPM:R']],
      atLeastN_2: [2, ['CTX:R', 'CRO:R', 'CAZ:R', 'FEP:R']],
      noneOf: ['ATM:S'],   // ATM:S → 排除 NDM
      supporting: ['MEM:R', 'IPM:R', 'ATM:R', 'ETP:R'],
      flags: ['CZA 耐药是关键标志', '碳青霉烯 MIC 可能低于 KPC-2', 'D179Y 突变位于 Ω-loop']
    },

    summary: 'KPC-33 是 KPC-2 的 D179Y 点突变体，Ω-loop 构象改变导致对头孢他啶/阿维巴坦耐药，但同时部分削弱碳青霉烯水解活性。',

    interpretation: `**耐药原因：**
KPC-33 是 KPC-2 酶第 179 位天冬氨酸被酪氨酸取代（D179Y）的突变体。该位点位于 KPC 酶的 Ω-loop 区域，此区域参与底物识别和催化。

**关键机制差异：**
• D179Y 突变改变活性位点构象 → 阿维巴坦无法有效结合和抑制 → **CZA 耐药**
• 同时突变部分削弱了酶对碳青霉烯类的水解效率 → 碳青霉烯 MIC 可能比 KPC-2 低
• 但对广谱头孢菌素的水解活性仍保留 → 三代头孢通常仍耐药

**临床识别难点：**
• 如果碳青霉烯 MIC 不高（如美罗培南 MIC = 2-4 μg/mL），常规药敏可能漏判为"碳青霉烯敏感"
• 但 CZA 明确耐药 + 有碳青霉烯使用史，应高度警惕 KPC-33
• 碳青霉烯酶确证试验（mCIM/eCIM）仍为阳性，但不能区分 KPC-2 和 KPC-33

**治疗影响：**
• CZA 无效 → 需要换用其他方案
• 如果碳青霉烯 MIC 未达到耐药折点，碳青霉烯是否可用？→ 不推荐单用，因为存在接种效应和治疗中突变选择风险`,

    differentiation: {
      'vs_KPC-2': 'KPC-2 对 CZA **敏感**，KPC-33 对 CZA **耐药**。这是最核心的鉴别点。碳青霉烯 MIC 可能 KPC-33 更低。',
      'vs_NDM': 'NDM 对氨曲南（ATM）**敏感**，KPC-33 对 ATM **耐药**。这是两者的根本区别。',
      'vs_ESBL_porin': 'ESBL + 孔蛋白丢失时，CZA 通常仍为敏感（除非合并其他耐药机制）。CZA 耐药提示碳青霉烯酶变异或合并 MBL。',
      'vs_KPC_plus_MBL': 'KPC+MBL 共携带时，ATM 可能耐药（KPC 水解）且 CZA 耐药（MBL 不被抑制）。需分子检测确认。',
    },

    clinicalNote: 'CAZ/AVI 治疗过程中出现的 CZA 耐药（治疗中突变选择），最常见机制即为 bla_KPC-2 → bla_KPC-33 突变。此类菌株的治疗选择极为有限。',
    references: ['PMID: 28031168 (KPC-33 D179Y characterization)', 'PMID: 31069139 (CAZ/AVI resistance mechanisms)', 'CLSI M100 Ed35'],
    createdBy: '【待专家审核】',
  },

  // ============================================================
  // 碳青霉烯酶 — Class B (金属β-内酰胺酶 / MBL)
  // ============================================================

  {
    id: 'KP-NDM-1',
    bacteria: 'KP',
    label: 'NDM-1 金属β-内酰胺酶',
    category: '碳青霉烯酶 / Class B 金属β-内酰胺酶 (MBL)',
    gene: 'bla_NDM-1',
    priority: 98,

    pattern: {
      allOf: ['ATM:S'],
      atLeastN: [2, ['MEM:R', 'IPM:R', 'ETP:R']],
      atLeastN_2: [2, ['CTX:R', 'CRO:R', 'CAZ:R', 'FEP:R']],
      noneOf: ['CZA:S'],   // CZA:S → 可能是 KPC
      supporting: ['CZA:R', 'IMR:R', 'MEV:R'],
      flags: ['氨曲南敏感是 MBL 的关键标志', '所有酶抑制剂复合物均耐药', '常携带多药耐药基因']
    },

    summary: 'NDM-1 是传播最广的金属β-内酰胺酶，能水解除氨曲南外的所有β-内酰胺类抗生素，且不被任何临床可用的β-内酰胺酶抑制剂所抑制。',

    interpretation: `**耐药原因：**
NDM-1（New Delhi Metallo-β-lactamase-1）属于 Ambler Class B 金属β-内酰胺酶。其活性位点含 Zn²⁺ 离子，通过极化水分子亲核进攻β-内酰胺环实现水解。

**底物谱：**
• 高效水解：碳青霉烯类（美罗培南、亚胺培南、厄他培南）、所有头孢菌素、青霉素类
• **不水解**：氨曲南（Aztreonam）—— 单环内酰胺类不被 MBL 识别

**为何所有酶抑制剂均无效：**
MBL 的催化机制依赖 Zn²⁺ 而非活性丝氨酸，因此所有临床可用的丝氨酸β-内酰胺酶抑制剂均无效：
• 阿维巴坦 ✗、瑞来巴坦 ✗、法硼巴坦 ✗
• 克拉维酸 ✗、舒巴坦 ✗、他唑巴坦 ✗

**共携带耐药基因：**
bla_NDM-1 常与以下基因在同一质粒上：
• 16S rRNA 甲基化酶基因（armA, rmtB）→ 阿米卡星、庆大霉素均耐药
• qnr 基因 → 氟喹诺酮类耐药
• 其他 ESBL/AmpC 基因 → 所有头孢菌素高度耐药`,

    differentiation: {
      'vs_KPC': '**氨曲南敏感性**是最关键的鉴别点。NDM：ATM **S**；KPC：ATM **R**。',
      'vs_ESBL_porin': 'NDM 的碳青霉烯 MIC 通常非常高（美罗培南 ≥16 μg/mL），而单纯 ESBL + 孔蛋白丢失的碳青霉烯 MIC 仅轻度升高。CZA/IMR/MEV 在 NDM 中均耐药。',
      'vs_IMP_VIM': '同为 MBL，表型上难以区分（均表现为 ATM S + 碳青霉烯 R + CZA R）。需 PCR 或 WGS 确认具体基因型。',
      'vs_AmpC_porin': 'AmpC + 孔蛋白丢失时，CZA 通常敏感（阿维巴坦抑制 AmpC），而 NDM 中 CZA 一定耐药。',
    },

    clinicalNote: '产 NDM 菌株的治疗选择极为有限。氨曲南/阿维巴坦联合方案处于临床研究阶段（利用 ATM 不被水解 + AVI 抑制可能共存的丝氨酸酶）。头孢地尔（cefiderocol）可能有效。',
    references: [
      '胡付品等,《细菌药物敏感性试验执行标准和典型报告解读》第二版, Case 06, Case 07, Case 08', 'PMID: 19940120 (NDM-1 discovery)', 'CLSI M100 Ed35', 'EUCAST Guidance on MBL detection'],
    createdBy: '【待专家审核】',
  },

  {
    id: 'KP-NDM-5',
    bacteria: 'KP',
    label: 'NDM-5 金属β-内酰胺酶',
    category: '碳青霉烯酶 / Class B 金属β-内酰胺酶 (MBL)',
    gene: 'bla_NDM-5 (NDM-1 的 Val88Leu + Met154Leu 双突变)',
    priority: 97,

    pattern: {
      allOf: ['ATM:S'],
      atLeastN: [2, ['MEM:R', 'IPM:R', 'ETP:R']],
      atLeastN_2: [2, ['CTX:R', 'CRO:R', 'CAZ:R', 'FEP:R']],
      noneOf: ['CZA:S'],
      supporting: ['CZA:R', 'IMR:R', 'MEV:R'],
      flags: ['氨曲南敏感', '碳青霉烯 MIC 常高于 NDM-1', 'Val88Leu + Met154Leu 双突变增强水解活性']
    },

    summary: 'NDM-5 是 NDM-1 的双突变体（Val88Leu + Met154Leu），水解碳青霉烯和头孢菌素的效率高于 NDM-1，碳青霉烯 MIC 通常更高。',

    interpretation: `**耐药原因：**
NDM-5 在 NDM-1 基础上发生了两个关键氨基酸替换：
• Val88Leu → 改变活性位点 Zn²⁺ 配位环境
• Met154Leu → 扩大底物结合口袋，增强碳青霉烯亲和力

**与 NDM-1 的关键差异：**
• 碳青霉烯 MIC 通常比 NDM-1 **更高**（如美罗培南 MIC ≥32 μg/mL vs NDM-1 的 8-16 μg/mL）
• 对广谱头孢菌素的水解效率也增强
• 氨曲南依然**敏感**（MBL 的共同特征保持不变）

**临床意义：**
• 碳青霉烯 MIC 极高 → 体外药敏明确耐药，不会漏判
• 质粒传播效率可能更高 → 暴发风险大
• 治疗选择与 NDM-1 相同 → 极其有限`,

    differentiation: {
      'vs_NDM-1': '表型上难以区分，NDM-5 的碳青霉烯 MIC 通常更高。分子检测（PCR 测序）是唯一可靠区分方式。临床处置策略相同。',
      'vs_KPC': '氨曲南敏感（NDM）vs 氨曲南耐药（KPC）。',
    },

    clinicalNote: '临床处置策略与 NDM-1 一致。替代治疗选择包括头孢地尔（cefiderocol）、粘菌素、替加环素等。',
    references: ['PMID: 24850949 (NDM-5 characterization)', 'PMID: 28634231 (NDM variants review)'],
    createdBy: '【待专家审核】',
  },

  {
    id: 'KP-IMP-4',
    bacteria: 'KP',
    label: 'IMP-4 金属β-内酰胺酶',
    category: '碳青霉烯酶 / Class B 金属β-内酰胺酶 (MBL)',
    gene: 'bla_IMP-4',
    priority: 95,

    pattern: {
      allOf: ['ATM:S'],
      atLeastN: [1, ['MEM:R', 'IPM:R', 'ETP:R']],
      atLeastN_2: [2, ['CTX:R', 'CRO:R', 'CAZ:R', 'FEP:R']],
      supporting: ['CZA:R', 'IMR:R'],
      flags: ['氨曲南敏感', '西太平洋地区流行', '常在整合子上']
    },

    summary: 'IMP-4 是西太平洋地区（中国、日本、澳大利亚）常见的 MBL 型碳青霉烯酶，表型特征为氨曲南敏感 + 碳青霉烯耐药 + 酶抑制剂复合物耐药。',

    interpretation: `**耐药原因：**
IMP-4（Imipenemase-4）是 Class B 金属β-内酰胺酶，活性依赖 Zn²⁺。与 NDM 一样，水解除氨曲南外的所有β-内酰胺类。

**流行病学特征：**
• 在中国南方地区（广东、福建、香港）的肠杆菌目细菌中较常见
• bla_IMP-4 常位于 Class 1 整合子上，可与其他耐药基因盒共存
• 在铜绿假单胞菌和鲍曼不动杆菌中也有检出

**表型特征：**
• 亚胺培南 MIC 通常比美罗培南 MIC 略高（IMP 对亚胺培南底物亲和力更高）
• 氨曲南始终敏感 ← MBL 的共同标志`,

    differentiation: {
      'vs_NDM': '表型难以区分。IMP 的亚胺培南 MIC 通常高于美罗培南 MIC，而 NDM 两者 MIC 均高。分子检测确认。',
      'vs_KPC': '氨曲南敏感性：IMP 敏感，KPC 耐药。',
      'vs_VIM': '同为 MBL，表型无法区分。IMP 在中国更常见，VIM 在欧洲更常见。',
    },

    clinicalNote: '治疗选择与 NDM 相同，极为有限。',
    references: ['CLSI M100 Ed35', 'PMID: 10991851 (IMP-4 first report)'],
    createdBy: '【待专家审核】',
  },

  // ============================================================
  // 碳青霉烯酶 — Class D (OXA 型碳青霉烯酶)
  // ============================================================

  {
    id: 'KP-OXA-48-like',
    bacteria: 'KP',
    label: 'OXA-48-like 碳青霉烯酶',
    category: '碳青霉烯酶 / Class D 丝氨酸β-内酰胺酶 (OXA)',
    gene: 'bla_OXA-48 / bla_OXA-181 / bla_OXA-232',
    priority: 96,

    pattern: {
      allOf: ['ETP:R'],
      atLeastN: [1, ['MEM:R', 'MEM:I', 'IPM:R', 'IPM:I']],
      noneOf: ['ATM:S'],   // OXA 可弱水解氨曲南，通常 ATM 也为 R
      supporting: ['CZA:R'],  // OXA-48 通常不被阿维巴坦有效抑制
      flags: ['碳青霉烯 MIC 可能仅轻度升高', '厄他培南首先耐药', '美罗培南/亚胺培南可能仍报告敏感', '易漏检']
    },

    summary: 'OXA-48-like 酶是 Class D 碳青霉烯酶，水解碳青霉烯的能力弱，常表现为"仅厄他培南耐药"而被漏检。对阿维巴坦的敏感性存在争议。',

    interpretation: `**耐药原因：**
OXA-48 属于 Ambler Class D 丝氨酸β-内酰胺酶。其碳青霉烯水解效率远低于 KPC 和 MBL，因此常常：
• 厄他培南明确耐药（最敏感的碳青霉烯指示剂）
• 美罗培南 MIC 可能仅 0.5-2 μg/mL（可能仍在敏感范围！）
• 亚胺培南 MIC 可能 1-4 μg/mL

**为什么容易漏检：**
• 如果只测美罗培南和亚胺培南，可能报告为"碳青霉烯敏感"
• 厄他培南是 OXA-48 的最佳筛查指标
• 碳青霉烯酶确证试验（mCIM）可能为弱阳性

**与阿维巴坦的关系：**
OXA-48 对阿维巴坦的敏感性存在争议和变异：
• OXA-48 本身可被阿维巴坦抑制
• 但 OXA-181、OXA-232 等变体对阿维巴坦的敏感性降低
• 临床常报告 CZA 为耐药或中介`,

    differentiation: {
      'vs_KPC': 'KPC 通常所有碳青霉烯均明确耐药（MIC 高），CZA 敏感。OXA-48 仅厄他培南明确耐药，CZA 常耐药。',
      'vs_ESBL_porin': '两者表型重叠严重（均可能仅厄他培南耐药）！ESBL + 孔蛋白丢失时 CZA 敏感，OXA-48 时 CZA 常耐药。碳青霉烯酶确证试验（mCIM）有助于区分。',
      'vs_NDM': 'OXA-48 的 ATM 通常耐药（弱但持续水解），NDM 的 ATM 敏感。',
    },

    clinicalNote: '产 OXA-48-like 菌株，碳青霉烯类即使体外报告敏感也不推荐单用。CZA 的疗效取决于具体的 OXA 亚型。',
    references: ['PMID: 22252629 (OXA-48 epidemiology)', 'PMID: 25979599 (OXA-48-like variants)', 'EUCAST Guidelines'],
    createdBy: '【待专家审核】',
  },

  // ============================================================
  // 广谱β-内酰胺酶 (Broad-Spectrum β-Lactamase)
  // ============================================================

  {
    id: 'KP-BSBL-TEM-SHV',
    bacteria: 'KP',
    label: '广谱 β-内酰胺酶 (TEM/SHV 型)',
    category: '广谱β-内酰胺酶 / Class A 丝氨酸酶',
    gene: 'bla_TEM-1 / bla_SHV-1 (广谱酶，非 ESBL)',
    priority: 92,

    pattern: {
      allOf: [],
      atLeastN: [1, ['CFZ:R', 'CXM:R']],
      atLeastN_2: [2, ['CTX:S', 'CRO:S', 'CAZ:S']],
      noneOf: ['MEM:R', 'IPM:R', 'ETP:R'],
      supporting: ['AMP:R', 'TZP:S', 'CSL:S', 'CZA:S', 'CMZ:S', 'FOX:S', 'FEP:S'],
      flags: ['仅对青霉素类和第一/二代头孢耐药', '第三代头孢敏感（至少2个为S）', '酶抑制剂复合物敏感', '碳青霉烯类敏感', '头霉素类敏感', '区别于 ESBL: 三代头孢仍敏感']
    },

    summary: '广谱 β-内酰胺酶（TEM-1/SHV-1 型）仅水解青霉素类和第一、二代头孢菌素，不能水解第三代头孢菌素和头霉素类。可被克拉维酸、舒巴坦、他唑巴坦等酶抑制剂抑制。关键鉴别：至少 2 个三代头孢（CTX/CRO/CAZ）为敏感 → 排除 ESBL。',

    interpretation: `**耐药原因：**
广谱 β-内酰胺酶（Broad-Spectrum β-Lactamase, BSBL）主要由 TEM-1、TEM-2 和 SHV-1 等基因编码。与 ESBL 不同，广谱酶的底物谱仅限于：
• 青霉素类（氨苄西林、哌拉西林等）→ 耐药
• 第一代头孢菌素（头孢唑林）→ 耐药
• 第二代头孢菌素（头孢呋辛）→ 耐药
• **第三代头孢菌素（头孢噻肟、头孢曲松、头孢他啶）→ 敏感**
• 第四代头孢菌素（头孢吡肟）→ 敏感
• 头霉素类（头孢西丁、头孢替坦、头孢美唑）→ 敏感

**与 ESBL 的核心差异：**
广谱酶不能水解三代头孢菌素，这是与 ESBL 的根本区别。ESBL（如 CTX-M）是广谱酶的进化产物——通过活性位点点突变扩展了底物谱，获得了水解三代头孢的能力。

**为何酶抑制剂复合物有效：**
TEM/SHV 型广谱酶的活性丝氨酸位点可被克拉维酸、舒巴坦、他唑巴坦不可逆抑制。因此：
• 氨苄西林/舒巴坦 → 敏感
• 头孢哌酮/舒巴坦 → 敏感
• 哌拉西林/他唑巴坦 → 敏感
• 头孢他啶/阿维巴坦 → 敏感（更强抑制）

**等效药物推导（来源于胡付品等《细菌药物敏感性试验执行标准和典型报告解读》第二版）：**
• 头孢噻肟（CTX）和头孢曲松（CRO）为等效药物 → CTX 敏感可推导 CRO 敏感，反之亦然
• 头孢他啶敏感 → 可推导头孢他啶/阿维巴坦（CZA）敏感
• 但头孢他啶耐药 ≠ 头孢他啶/阿维巴坦耐药（阿维巴坦可能恢复敏感）

**流行病学（中国）：**
我国临床分离的产广谱 β-内酰胺酶菌株大多数产生 TEM 或 SHV 型广谱酶。`,

    differentiation: {
      'vs_ESBL_CTXM': '**三代头孢敏感性**是核心鉴别点。广谱酶：CTX/CAZ/CRO **敏感**；ESBL：CTX/CAZ/CRO **耐药**。其余特征（酶抑制剂敏感、碳青霉烯敏感）两者相同。',
      'vs_AmpC': '广谱酶：头霉素类（FOX/CTT/CMZ）**敏感**、酶抑制剂复合物**敏感**；AmpC：头霉素类**耐药**、酶抑制剂复合物**耐药**。三代头孢敏感性两者相同（均敏感）。',
      'vs_KPC': '碳青霉烯类：广谱酶**敏感**；KPC **耐药**。这是最直接的区分。',
    },

    clinicalNote: '产广谱 β-内酰胺酶菌株的治疗选择较宽：酶抑制剂复合物（TZP/CSL）、三代头孢菌素（CTX/CRO/CAZ）、头孢吡肟均可能有效。碳青霉烯类有效但应保留用于更严重的耐药菌感染。',
    references: ['胡付品等,《细菌药物敏感性试验执行标准和典型报告解读》第二版, Case 1', 'CLSI M100 Ed35'],
    createdBy: '基于胡付品主编《细菌药物敏感性试验执行标准和典型报告解读》第二版 Case 1',
  },

  // ============================================================
  // ESBL (超广谱β-内酰胺酶)
  // ============================================================

  {
    id: 'KP-ESBL-CTXM-15',
    bacteria: 'KP',
    label: 'CTX-M-15 型 ESBL',
    category: 'ESBL / Class A 丝氨酸β-内酰胺酶',
    gene: 'bla_CTX-M-15',
    priority: 90,

    pattern: {
      allOf: [],
      atLeastN: [1, ['CTX:R', 'CRO:R']],
      noneOf: ['MEM:R', 'IPM:R', 'ETP:R'],
      supporting: ['FOX:S', 'CMZ:S', 'TZP:S', 'CSL:S', 'CZA:S', 'ATM:R'],
      flags: ['碳青霉烯类全部敏感', '头霉素类敏感（排除 AmpC）', '酶抑制剂复合物敏感', '头孢噻肟或头孢曲松耐药为关键标志', '头孢他啶可能敏感（CTX-M-14/15 对 CAZ 水解弱）']
    },

    summary: 'CTX-M-15 是全球最流行的 ESBL 基因型，水解氧亚氨基头孢菌素（特别是头孢噻肟和头孢曲松），但对头孢他啶的水解能力较弱。不水解头霉素类和碳青霉烯类，可被克拉维酸等酶抑制剂抑制。中国临床分离的产 ESBL 菌株大多数产生 CTX-M-14 或 CTX-M-15 型。',

    interpretation: `**耐药原因：**
CTX-M-15 属于 Class A 丝氨酸β-内酰胺酶，优先水解头孢噻肟（cefotaxime，CTX-M 因此命名），同时对头孢曲松、头孢他啶、头孢吡肟等氧亚氨基头孢菌素也有高效水解能力。

**底物谱特征：**
• 高效水解：头孢噻肟、头孢曲松、头孢他啶、头孢吡肟、氨曲南
• **不水解**：头孢西丁（头霉素类）→ FOX 敏感！
• **不水解**：碳青霉烯类（美罗培南、亚胺培南、厄他培南）

**为何酶抑制剂复合物有效：**
CTX-M-15 可被克拉维酸、舒巴坦、他唑巴坦有效抑制。因此：
• 哌拉西林/他唑巴坦（TZP）通常敏感
• 头孢哌酮/舒巴坦（CSL）通常敏感
• 头孢他啶/阿维巴坦（CZA）敏感

**报告单识别线索：**
• 三代头孢（CTX/CRO/CAZ）R + 头孢西丁 S + 碳青霉烯 S → 高度提示 ESBL
• 酶抑制剂复合物 S 进一步支持`,

    differentiation: {
      'vs_AmpC': '**头孢西丁（FOX）敏感性**：ESBL → FOX S；AmpC → FOX R。头孢吡肟：ESBL 常为 S 或 I，AmpC 通常为 S。',
      'vs_KPC': '**碳青霉烯类敏感性**：ESBL → 碳青霉烯全部 S；KPC → 碳青霉烯全部 R。',
      'vs_ESBL_AmpC_co': 'ESBL 单独：FOX S；ESBL+AmpC 共产生：FOX R。',
      'vs_ESBL_porin': 'ESBL 单独：碳青霉烯全部 S；ESBL+孔蛋白丢失：至少 ETP 可能 R 或 I。',
    },

    clinicalNote: '产 ESBL 菌株感染，碳青霉烯类仍为可靠选择（但需审慎使用以延缓耐药发展）。酶抑制剂复合物在非严重感染中可考虑。',
    references: ['胡付品等,《细菌药物敏感性试验执行标准和典型报告解读》第二版, Case 2', 'CLSI M100 Ed35', 'PMID: 15980346 (CTX-M-15 global spread)', 'EUCAST ESBL detection guidelines'],
    createdBy: '【待专家审核】',
  },

  // ============================================================
  // AmpC β-内酰胺酶
  // ============================================================

  {
    id: 'KP-AmpC-plasmid',
    bacteria: 'KP',
    label: '质粒介导 AmpC 酶 (CMY/DHA/ACT 型)',
    category: 'AmpC / Class C 丝氨酸β-内酰胺酶',
    gene: 'bla_CMY-2 / bla_DHA-1 / bla_ACT-1 (质粒介导)',
    priority: 89,

    pattern: {
      allOf: [],
      atLeastN: [1, ['FOX:R', 'CTT:R']],
      atLeastN_2: [2, ['CTX:R', 'CRO:R', 'CAZ:R']],
      noneOf: ['MEM:R', 'IPM:R'],
      supporting: ['FEP:S', 'TZP:R', 'CSL:R', 'CZA:S'],
      flags: ['头孢西丁或头孢替坦耐药是关键标志', '头孢吡肟通常敏感（AmpC 水解活性弱）', '酶抑制剂复合物耐药（克拉维酸不抑制 AmpC）']
    },

    summary: '质粒介导的 AmpC 酶（如 CMY-2、DHA-1）水解头孢菌素类包括头霉素类（头孢西丁、头孢替坦），但不被克拉维酸抑制，且通常对头孢吡肟水解活性弱。',

    interpretation: `**耐药原因：**
AmpC β-内酰胺酶（Class C）由染色体 ampC 基因或质粒携带的 ampC 同源基因编码。不同于 ESBL，AmpC 酶的底物谱包括：
• 头霉素类（头孢西丁、头孢替坦）→ FOX **耐药**
• 广谱头孢菌素（头孢噻肟、头孢曲松、头孢他啶）
• 对头孢吡肟（第四代头孢）水解活性**弱** → FEP 通常敏感

**与 ESBL 的核心差异：**
| 特征 | ESBL (CTX-M) | AmpC |
|------|-------------|------|
| 头孢西丁 | S | **R** |
| 头孢吡肟 | 常 S/I | 常 S |
| 克拉维酸抑制 | ✓ | ✗ |
| 酶抑制剂复合物 | 敏感 | 耐药 |

**为何克拉维酸无效：**
AmpC 酶活性位点结构与 ESBL 不同，克拉维酸不能有效结合 AmpC 的活性丝氨酸。阿维巴坦可以抑制 AmpC，因此 CZA 通常敏感。

**诱导表达 vs 去阻遏：**
某些 AmpC 基因（如 DHA-1）可被β-内酰胺类诱导表达，初次药敏可能假敏感，治疗中可转为耐药。`,

    differentiation: {
      'vs_ESBL': '**头孢西丁（FOX）**：AmpC → R；ESBL → S。这是最核心的鉴别点。酶抑制剂复合物：AmpC → R；ESBL → S。',
      'vs_ESBL_AmpC_co': '单独 AmpC：FEP 通常 S；ESBL+AmpC 共产生：FEP 可能 R。',
      'vs_KPC': '碳青霉烯类：AmpC → S；KPC → R。CZA：AmpC → S；KPC → S（但碳青霉烯已区分两者）。',
      'vs_AmpC_porin': '单独 AmpC：碳青霉烯全部 S；AmpC+孔蛋白丢失：ETP 可能 R 或 I。',
    },

    clinicalNote: '产 AmpC 酶菌株，头孢吡肟在体外敏感时可能有效。碳青霉烯类仍为可靠选择。CZA 在 AmpC 产生株中通常敏感。⚠️ 如果 KP 获得的是诱导型 AmpC 基因（如 DHA-1），初次药敏可能报告头孢菌素"敏感"，但在β-内酰胺类抗生素治疗过程中可发生去阻遏突变，导致 AmpC 持续高表达而转为耐药。治疗中如出现临床无效，需复查药敏。',
    references: ['胡付品等,《细菌药物敏感性试验执行标准和典型报告解读》第二版, Ecl Case 04 (诱导型 AmpC 去阻遏)', 'CLSI M100 Ed35', 'PMID: 20065357 (plasmidic AmpC review)', 'EUCAST AmpC detection'],
    createdBy: '【待专家审核】',
  },

  // ============================================================
  // 联合机制（组合拳）
  // ============================================================

  {
    id: 'KP-ESBL-porin-loss',
    bacteria: 'KP',
    label: 'ESBL (CTX-M) + 外膜孔蛋白丢失 (OmpK35/OmpK36)',
    category: '联合机制 / ESBL + 孔蛋白丢失',
    gene: 'bla_CTX-M + ompK35/ompK36 突变或缺失',
    priority: 88,

    pattern: {
      allOf: ['FOX:S'],
      atLeastN: [3, ['CTX:R', 'CRO:R', 'CAZ:R', 'FEP:R']],
      atLeastN_2: [1, ['ETP:R', 'ETP:I']],
      noneOf: ['CZA:R'],
      supporting: ['TZP:S', 'CSL:S', 'CZA:S', 'MEM:S', 'IPM:S'],
      flags: ['厄他培南先出现耐药', '美罗培南/亚胺培南仍敏感', '头孢西丁敏感（排除 AmpC）', 'CZA 敏感（排除碳青霉烯酶）']
    },

    summary: 'ESBL 产生合并外膜孔蛋白（OmpK35/OmpK36）丢失时，碳青霉烯类（尤其是厄他培南）MIC 升高，可能被误判为碳青霉烯酶产生株。但 CZA 仍然敏感。',

    interpretation: `**耐药原因：**
肺炎克雷伯菌的主要外膜孔蛋白为 OmpK35 和 OmpK36。当编码这些孔蛋白的基因发生突变或表达下调时，抗生素进入细菌的通道减少。与 ESBL 共同作用时：
• ESBL 水解进入胞周间隙的药物
• 孔蛋白丢失减少药物进入 → 两者协同导致碳青霉烯 MIC 升高

**为什么厄他培南先耐药：**
• 厄他培南分子量大、带负电荷强 → 对孔蛋白依赖度最高
• 美罗培南和亚胺培南分子量较小、两性离子特性 → 可部分通过其他途径进入
• 因此：ETP MIC 首先升高，MEM/IPM 可能仍为敏感

**临床识别关键：**
• 头孢西丁 S → 排除 AmpC
• CZA S → 排除大部分碳青霉烯酶（KPC 被抑制，但 OXA-48/MBL 仍可能）
• 碳青霉烯酶确证试验（mCIM）阴性 → 排除碳青霉烯酶
• ETP R + MEM S + IPM S → 经典孔蛋白丢失模式`,

    differentiation: {
      'vs_KPC': 'CZA：ESBL+孔蛋白 → S；KPC-2 → S。**需要 mCIM/eCIM 区分**。KPC 通常 MEM/IPM 均明确 R。',
      'vs_OXA-48': '最难区分！两者均可能 ETP R + MEM S/IPM S。CZA 敏感性：ESBL+孔蛋白 → S；OXA-48 → 常 R。mCIM 最可靠。',
      'vs_AmpC_porin': 'FOX：ESBL+孔蛋白 → S；AmpC+孔蛋白 → R。用头孢西丁区分。',
      'vs_NDM': 'ATM：ESBL+孔蛋白 → R；NDM → S。CZA：ESBL+孔蛋白 → S；NDM → R。',
    },

    clinicalNote: 'ESBL + 孔蛋白丢失菌株，即使体外碳青霉烯敏感，也建议谨慎使用碳青霉烯类单药治疗严重感染。CZA 在体外敏感时是合理选择。',
    references: [
      '胡付品等,《细菌药物敏感性试验执行标准和典型报告解读》第二版, Case 15, Case 16', 'PMID: 20065357', 'PMID: 19651997 (porin loss + ESBL)', 'CLSI M100 Ed35'],
    createdBy: '【待专家审核】',
  },

  {
    id: 'KP-KPC-2-porin-loss',
    bacteria: 'KP',
    label: 'KPC-2 + 外膜孔蛋白丢失 (OmpK35/OmpK36)',
    category: '联合机制 / KPC + 孔蛋白丢失',
    gene: 'bla_KPC-2 + ompK35/ompK36 突变',
    priority: 87,

    pattern: {
      allOf: ['CZA:S', 'FOX:S'],
      atLeastN: [3, ['MEM:R', 'IPM:R', 'ETP:R']],
      atLeastN_2: [3, ['CTX:R', 'CRO:R', 'CAZ:R', 'FEP:R']],
      noneOf: ['ATM:S'],
      supporting: [],
      flags: ['碳青霉烯 MIC 极高', '亚胺培南 MIC 常高于美罗培南 MIC', 'CZA 仍然敏感（KPC-2 型）', '需 mCIM 确认碳青霉烯酶']
    },

    summary: 'KPC-2 碳青霉烯酶联合外膜孔蛋白丢失可导致碳青霉烯 MIC 极度升高（美罗培南 ≥64 μg/mL），使许多"最后防线"药物也失去活性。',

    interpretation: `**耐药原因：**
当 KPC-2（水解碳青霉烯）与 OmpK35/OmpK36 孔蛋白丢失（减少药物进入）同时存在时：
• 药物进入减少 → 胞周间隙药物浓度降低
• KPC-2 高效水解残余药物 → 协同作用导致 MIC 极度升高

**亚胺培南 MIC > 美罗培南 MIC 的原因：**
• 亚胺培南主要通过 OmpK35 通道进入
• 美罗培南可通过 OmpK35 和 OmpK36 双通道
• 当两个孔蛋白均丢失时，美罗培南受影响更大（失去两个通道）
• 但 KPC-2 对美罗培南的亲和力更高 → 综合效应使得 IPM MIC 可能更高

**与单独 KPC-2 的差异：**
• KPC-2 单独：碳青霉烯 MIC 通常 4-16 μg/mL
• KPC-2 + 孔蛋白丢失：碳青霉烯 MIC 32-256 μg/mL
• 这种极端 MIC 水平使碳青霉烯在临床上完全无效`,

    differentiation: {
      'vs_KPC-2_alone': '碳青霉烯 MIC 水平：KPC-2 单独 4-16，KPC-2+孔蛋白 32-256。CZA 在两者中均应为 S（除非发生 KPC-33 突变）。',
      'vs_NDM': 'CZA：KPC+孔蛋白 → S；NDM → R。ATM：KPC → R；NDM → S。',
    },

    clinicalNote: '碳青霉烯 MIC 极高 + CZA 敏感 → 最可能为 KPC + 孔蛋白丢失。CZA 是治疗首选。如果 CZA 也耐药，需考虑 KPC-33 突变或同时携带 MBL。',
    references: ['PMID: 21189334 (porin loss effects on carbapenem MIC)', 'CLSI M100 Ed35'],
    createdBy: '【待专家审核】',
  },

  // ============================================================
  // 共产生机制
  // ============================================================

  {
    id: 'KP-ESBL-AmpC-co',
    bacteria: 'KP',
    label: 'ESBL + AmpC 共产生',
    category: '联合机制 / ESBL + AmpC',
    gene: 'bla_CTX-M + bla_CMY/DHA (多种)',
    priority: 86,

    pattern: {
      allOf: ['FOX:R'],
      atLeastN: [3, ['CTX:R', 'CRO:R', 'CAZ:R', 'FEP:R']],
      noneOf: ['MEM:R', 'IPM:R'],
      supporting: ['TZP:R', 'CSL:R', 'CZA:S'],
      flags: ['所有头孢菌素均耐药（含头孢西丁和头孢吡肟）', '酶抑制剂复合物耐药', '碳青霉烯仍敏感', 'CZA 敏感（阿维巴坦抑制两种酶）']
    },

    summary: 'ESBL 和 AmpC 共同产生时，几乎所有头孢菌素类（含头霉素和第四代头孢）均耐药，克拉维酸/他唑巴坦/舒巴坦均无效，但碳青霉烯类和 CZA 仍然有效。',

    interpretation: `**耐药原因：**
当同一株菌同时产生 ESBL（如 CTX-M-15）和 AmpC（如 CMY-2 或 DHA-1）时：
• ESBL 水解三代头孢（CTX, CRO, CAZ）和氨曲南
• AmpC 水解头霉素（FOX）和部分三代头孢
• 两者协同 → 包括头孢吡肟在内的所有头孢菌素全部耐药

**酶抑制剂的困境：**
• 克拉维酸只能抑制 ESBL，不能抑制 AmpC → TZP、CSL 均耐药
• 阿维巴坦可同时抑制 ESBL 和 AmpC → **CZA 仍然敏感**

**碳青霉烯为什么仍敏感：**
• ESBL 和 AmpC 均不能有效水解碳青霉烯
• 只要孔蛋白完整，碳青霉烯可以有效进入胞周间隙并作用于 PBP

**报告单识别线索：**
• FOX R + 三代头孢全部 R + FEP R + TZP R + 碳青霉烯 S → 高度提示 ESBL+AmpC`,

    differentiation: {
      'vs_ESBL_alone': 'FOX：ESBL+AmpC → R；ESBL 单独 → S。FEP：ESBL+AmpC → 更可能 R。酶抑制剂复合物：ESBL+AmpC → R；ESBL 单独 → S。',
      'vs_AmpC_alone': 'FEP：ESBL+AmpC → 常 R；AmpC 单独 → 常 S。',
      'vs_KPC': '碳青霉烯类：ESBL+AmpC → S；KPC → R。',
    },

    clinicalNote: '碳青霉烯类和 CZA 均为有效选择。CZA 的优势是同时覆盖 ESBL 和 AmpC，保护碳青霉烯类的使用。',
    references: ['CLSI M100 Ed35', 'PMID: 25430876 (ESBL+AmpC co-production)'],
    createdBy: '【待专家审核】',
  },

  {
    id: 'KP-KPC-ESBL-co',
    bacteria: 'KP',
    label: 'KPC + ESBL 共携带',
    category: '联合机制 / KPC + ESBL',
    gene: 'bla_KPC-2 + bla_CTX-M (多种)',
    priority: 85,

    pattern: {
      allOf: ['CZA:S'],
      atLeastN: [2, ['MEM:R', 'IPM:R', 'ETP:R']],
      atLeastN_2: [3, ['CTX:R', 'CRO:R', 'CAZ:R', 'FEP:R']],
      noneOf: ['ATM:S'],
      supporting: ['TZP:R', 'CSL:R'],
      flags: ['所有β-内酰胺均耐药（除 CZA/IMR/MEV 外）', '头孢西丁可能 S（如无 AmpC 共存在）', '碳青霉烯 MIC 可能低于 KPC+孔蛋白丢失']
    },

    summary: 'KPC 碳青霉烯酶与 ESBL 同时存在时，所有β-内酰胺类抗生素均高度耐药。鉴别关键：CZA 仍敏感，碳青霉烯明确耐药。',

    interpretation: `**耐药原因：**
KPC + ESBL 共携带时，ESBL 进一步增强了对头孢菌素类的水解能力。KPC 负责碳青霉烯耐药，ESBL 负责头孢菌素耐药，两者分工协作。

**为何这是"最坏"的组合之一：**
• 几乎所有的β-内酰胺类药物均耐药
• 克拉维酸/他唑巴坦/舒巴坦无法抑制 KPC → 酶抑制剂复合物无效
• 但 KPC 可被阿维巴坦抑制 → **CZA 仍然有效**（假设是 KPC-2 而非 KPC-33）

**临床线索：**
• 碳青霉烯 R（KPC 负责）+ 头孢菌素全部 R（ESBL+KPC 共同负责）
• CZA S → 排除 MBL 和 KPC-33
• 此表型在 KPC 高流行地区的 ICU 菌株中常见`,

    differentiation: {
      'vs_KPC_alone': '头孢菌素 MIC：KPC+ESBL 通常更高（尤其 CAZ、FEP）。但临床上处置相同。',
      'vs_KPC_porin': '难以区分。KPC+孔蛋白的碳青霉烯 MIC 通常更高。分子检测确认。',
      'vs_NDM': 'CZA：KPC+ESBL → S；NDM → R。ATM：KPC+ESBL → R；NDM → S。',
    },

    clinicalNote: 'CZA 仍是有效选择（前提是 KPC-2 型）。如出现 CZA 耐药，需考虑 KPC-33 突变或合并 MBL。',
    references: ['CLSI M100 Ed35', 'PMID: 28824555 (KPC+ESBL co-carriage)'],
    createdBy: '【待专家审核】',
  },

  // ============================================================
  // VIM 金属β-内酰胺酶 — 全球最常见 MBL
  // 来源: Boyd 2020 (AAC) - MBL 综述
  // ============================================================

  {
    id: 'KP-VIM',
    bacteria: 'KP',
    label: 'VIM 金属β-内酰胺酶',
    category: '碳青霉烯酶 / Class B 金属酶 (MBL)',
    gene: 'bla_VIM (69+ 变体, class 1 整合子)',
    priority: 93,

    pattern: {
      allOf: ['ATM:S'],
      atLeastN: [1, ['MEM:R', 'IPM:R', 'ETP:R']],
      atLeastN_2: [2, ['CTX:R', 'CRO:R', 'CAZ:R', 'FEP:R']],
      noneOf: ['CZA:S'],
      supporting: ['CZA:R', 'IMR:R', 'MEV:R'],
      flags: ['氨曲南敏感 (所有 MBL 标志)', 'CZA/IMR/MEV 均耐药', '欧洲最常见 MBL', '希腊曾暴发 VIM-1 产 KP', '在中东/南亚也常见']
    },

    summary: 'VIM (Verona Integron-encoded Metallo-β-lactamase) 是全球分布最广的 MBL 家族（69+ 变体），在欧洲尤其常见。表型与 NDM 相同：碳青霉烯耐药 + 氨曲南敏感 + 所有酶抑制剂复合物耐药。',

    interpretation: `**耐药原因：**
VIM 属于 Ambler Class B1 金属β-内酰胺酶，活性依赖 Zn²⁺ 离子。水解除氨曲南外的所有β-内酰胺类抗生素，不被任何临床可用的β-内酰胺酶抑制剂抑制。

**流行病学特征（Boyd 2020 综述）：**
• 第一个 VIM 酶（VIM-1）于 1997 年在铜绿假单胞菌中发现
• 目前已鉴定 >69 种 VIM 变体
• bla_VIM 基因通常位于 class 1 整合子上的基因盒中
• **欧洲**：VIM 是 KPC 流行前的优势碳青霉烯酶。希腊 2004 年首次报道 VIM-1 产 KP 暴发，后 KPC 取代成为主导。近年可能重新出现（受 CZA 选择压力驱动）
• **中东/海湾国家**：bla_VIM 占铜绿假单胞菌耐药株的 18.4%，迪拜 32% 的耐药铜绿产 VIM
• **中国**：相对少见（Han 2020 研究 935 株 CRE 中未检出 VIM），中国以 NDM 和 KPC 为主

**表型与 NDM/IMP 的区分：**
• 同为 MBL，表型完全一致（ATM S + 碳青霉烯 R + CZA R）
• IMP 对亚胺培南的水解效率通常高于美罗培南，VIM/NDM 差异较小
• 仅能通过 PCR/测序区分，但临床处置策略相同

**为何临床区分仍有意义：**
• 流行病学监测和暴发溯源
• VIM 在欧洲和中东的流行率高于 NDM，地理来源是鉴别线索
• 未来可能有 MBL 亚型特异性抑制剂`,

    differentiation: {
      'vs_NDM': '表型无法区分。VIM 在欧洲/中东更常见，NDM 在印度/中国更常见。地理来源是流行病学线索。PCR 是唯一可靠区分方式。',
      'vs_IMP': '表型无法区分。IMP 的亚胺培南 MIC 常高于美罗培南 MIC。西太平洋地区（中国/日本/澳大利亚）IMP 更常见。',
      'vs_KPC': 'CZA：VIM → R；KPC-2 → S。ATM：VIM → S；KPC → R。这是区分 MBL 与非 MBL 的最快方法。',
    },

    clinicalNote: '与所有 MBL 一样，CZA 无效。治疗选择：多黏菌素、替加环素、头孢地尔。氨曲南在无共携带 ESBL/AmpC 时可能有效（MBL 不水解 ATM）。',
    references: ['Boyd 2020, Antimicrob Agents Chemother 64:e00397-20 (MBL 综述)', 'CLSI M100 Ed35', 'EUCAST MBL detection'],
    createdBy: '基于 Boyd 2020 AAC MBL 综述 + Han 2020 中国 CRE 数据',
  },

  // ============================================================
  // 多黏菌素耐药 — 来源: Andrade 2020 + Gogry 2021
  // ============================================================

  {
    id: 'KP-colistin-mgrB',
    bacteria: 'KP',
    label: '多黏菌素耐药 (mgrB 突变/失活)',
    category: '多黏菌素耐药 / 染色体介导',
    gene: 'mgrB 失活 → PhoPQ/PmrAB 双组分系统去调控',
    priority: 75,

    pattern: {
      allOf: ['CST:R'],
      atLeastN: [0, []],
      noneOf: [],
      supporting: [],
      flags: ['多黏菌素 E 或 B 耐药', '染色体介导 (非质粒)', 'mgrB 是 KP 多黏菌素耐药的主要机制', '常与碳青霉烯酶共存 (KPC/NDM + CST R)', 'CLSI 2020: CST 只报中介, EUCAST/中国共识: 可报敏感']
    },

    summary: '肺炎克雷伯菌对多黏菌素的染色体介导耐药通过多条通路实现：(1) mgrB 基因失活（IS 插入/突变）→ PhoPQ 去抑制 → L-Ara4N 修饰脂质 A；(2) PmrAB/CrrAB 双组分系统突变 → 直接激活 pmrHFIJKLM 操纵子；(3) 外排泵介导（CCCP 可逆转，非 AcrAB-TolC）。同一 CST:R 表型可能由上述不同机制单独或协同介导。',

    interpretation: `**染色体介导的多黏菌素耐药 — 同一 CST:R 表型，三种不同机制（Andrade 2020 + Gogry 2021 + Pu/Zhao 2023/2022 论文）：**

**多黏菌素作用机制：**
• 多黏菌素（Colistin/Polymyxin E, Polymyxin B）带正电荷
• 与 LPS 的脂质 A 带负电荷的磷酸基团静电结合
• 竞争性置换 Ca²⁺/Mg²⁺ → 破坏外膜结构 → 细菌裂解

---

**机制一：mgrB 失活 → PhoPQ 去抑制通路（KP 最常见）**

**通路：**
1. mgrB 基因编码 47 氨基酸的跨膜调节蛋白 MgrB
2. MgrB 正常功能：抑制 PhoQ 激酶活性 → 阻止 PhoP 磷酸化
3. mgrB 失活 → PhoP 持续磷酸化 → 激活 pmrHFIJKLM 操纵子
4. PmrHFIJKLM → 合成 L-Ara4N (4-氨基-4-脱氧-L-阿拉伯糖)
5. L-Ara4N 共价修饰脂质 A → 中和负电荷 → 多黏菌素无法结合

**mgrB 失活的具体方式：**
• **IS 插入截断**（最常见，IS5 家族为主）：
  - **ISKpn74** 在 mgrB 核苷酸 80-81 位插入 → mgrB 截断 → CST MIC 64 mg/L
    *依据：Pu, Zhao et al. 2023 IJAA — ST11-KL64 hv-CRKp 肺移植患者体内进化，ISKpn74 插入 mgrB 为首次报道*
  - **IS903B** 在 mgrB 同一位置 (80-81) 插入 → CST MIC 128 mg/L，且 IS903B 替代了之前的 ISKpn74
    *依据：Pu, Zhao et al. 2023 IJAA — 同一患者后续分离株，IS 替换提示 ISKpn74 可能不稳定*
• **点突变**（如 I45F, 终止密码子提前）：MgrB 蛋白功能丧失
  *依据：Zhao et al. 2022 Front Cell Infect Microbiol — ST656 NDM-5+ KP 中 MgrB I45F (PROVEAN 预测有害)*

---

**机制二：双组分系统 (TCS) 突变通路**

**PmrAB 通路：**
• PmrA D86E 突变 → 直接激活 pmrHFIJKLM → L-Ara4N 合成
  *依据：Zhao et al. 2022 FCIM — ST656 KP 中 PmrA D86E (PROVEAN 有害)，与 Samuelsen 2017 报道一致*

**CrrAB 通路：**
• CrrB V193G 突变 → CrrC 高表达 → 通过 PmrAB 正调控 pmrHFIJKLM
  *依据：Zhao et al. 2022 FCIM — ST656 KP 中首次报道 CrrB V193G (PROVEAN 有害)*
• CrrB 突变还可上调 H239_3064 (推定 RND 型外排泵) → 进一步增强耐药
  *依据：Cheng et al. 2018 JAC*

**协同效应：**
• mcr-8.2 质粒 + MgrB I45F + PmrA D86E + CrrB V193G 同时存在 → CST MIC 高达 256 mg/L
  *依据：Zhao et al. 2022 FCIM — 单一 mcr-8.2 接合子 MIC 仅 4 mg/L，远低于亲本株的 256，证明染色体突变与质粒 mcr 有协同效应*

---

**机制三：外排泵介导（非 AcrAB-TolC）**

• CCCP（质子动力势解偶联剂）加入 → CST MIC 从 32 降至 2 mg/L（16 倍下降）
• PAβN（AcrAB-TolC 抑制剂）加入 → CST MIC 无变化 → **排除 AcrAB-TolC**
• ramR, ramA, acrA, acrB, rpsJ, soxS 均无突变 → 排除经典外排调控通路
• kpnEF, kpnGH 也无突变 → 机制未完全阐明
  *依据：Pu, Zhao et al. 2023 IJAA — ST11-KL64 hv-CRKp 中分离到 CCCP 逆转、但 AcrAB 非依赖的 CST 耐药株*

---

**机制对比总结：**

| 机制 | 基因/突变 | MIC 范围 | 检测方法 | 证据来源 |
|------|----------|---------|---------|---------|
| mgrB IS 插入 | ISKpn74/IS903B→mgrB | 32-128 | mgrB PCR+测序 | Pu/Zhao 2023 IJAA |
| mgrB 点突变 | I45F | 可变 | mgrB PCR+测序 | Zhao 2022 FCIM |
| PmrAB TCS | PmrA D86E | 可变 | pmrA 测序 | Zhao 2022 FCIM |
| CrrAB TCS | CrrB V193G | 可变 | crrB 测序 | Zhao 2022 FCIM |
| 外排泵(非AcrAB) | CCCP 可逆 | 32 | CCCP 抑制试验 | Pu/Zhao 2023 IJAA |`,

    differentiation: {
      'vs_mcr': 'mgrB 是染色体介导（垂直传播为主），mcr 是质粒介导（水平传播）。表型无法区分。mcr 常导致低水平耐药（MIC 4-8 mg/L），mgrB 突变 MIC 可变。',
    },

    clinicalNote: '多黏菌素 E 和多黏菌素 B 为等效药物。CST:R 表型可由 mgrB IS 插入、mgrB 点突变、PmrAB/CrrAB TCS 突变、外排泵或 mcr 质粒单独或协同介导。高 MIC (≥64 mg/L) 常提示多重机制叠加。多黏菌素耐药+碳青霉烯耐药后仅剩替加环素和头孢地尔。',
    references: ['Andrade 2020, Microorganisms 8:1716', 'Gogry 2021, Front Med 8:677720', '胡付品等《细菌药物敏感性试验执行标准和典型报告解读》第二版 Case 17', 'Pu, Zhao et al. 2023, Int J Antimicrob Agents 61:106747 (ST11 hv-CRKp 体内进化, ISKpn74 首次插入 mgrB)', 'Zhao et al. 2022, Front Cell Infect Microbiol 12:922031 (ST656: MgrB I45F+PmrA D86E+CrrB V193G 协同 mcr-8.2)'],
    createdBy: '基于 Andrade 2020 (Microorganisms) + Gogry 2021 (Front Med) 综述 + Pu/Zhao 2023 IJAA + Zhao 2022 FCIM 论文',
  },

  // ============================================================
  // [论文新增] OXA-232 — 来源: Han 2020 (中国 CRE 研究)
  // ============================================================
  {
    id: 'KP-OXA-232',
    bacteria: 'KP',
    label: 'OXA-232 碳青霉烯酶 (儿童患者常见)',
    category: '碳青霉烯酶 / Class D (OXA-48-like 家族)',
    gene: 'bla_OXA-232 (ColKP3 型质粒)',
    priority: 94,

    pattern: {
      allOf: ['ETP:R'],
      atLeastN: [1, ['MEM:R', 'MEM:I', 'IPM:R', 'IPM:I']],
      noneOf: ['ATM:S'],
      supporting: ['AMK:R', 'GEN:R'],
      flags: ['碳青霉烯 MIC 可能仅轻度升高', '多见于儿童/新生儿', '正在成为中国第三大流行碳青霉烯酶', 'CZA 敏感 (区别于 MBL)']
    },

    summary: 'OXA-232 是 OXA-48 的变体，在中国儿童患者中快速扩散。Han 等(2020)研究显示 97.1% 的 OXA-48-like 阳性肺炎克雷伯菌为 OXA-232，且全部来自儿童患者(13.3%, 66/498)。',

    interpretation: `**耐药原因：**
OXA-232 属于 Ambler Class D 碳青霉烯酶，是 OXA-48 的变体（氨基酸同源性约 90%）。碳青霉烯水解活性弱于 KPC 和 MBL，常仅表现为厄他培南耐药，美罗培南和亚胺培南可能仍报告敏感。

**流行病学特征（中国，Han 2020）：**
• 2017 年首次在中国新生儿中检出
• 占 CRE 的 7.3%（68/935），97.1%（66/68）为 OXA-232
• 仅在儿童患者中检出（13.3%, 66/498）
• bla_OXA-232 位于 6.1 kb ColKP3 型非接合质粒上

**药物敏感性（Han 2020 数据）：**
• CZA：100% 敏感（OXA-48-like 菌株 MIC50/MIC90 = 0.5/4 μg/mL）
• 亚胺培南：73.5% 耐药，17.6% 敏感 → 易漏检！
• 美罗培南：85.3% 耐药，4.4% 敏感
• 替加环素：100% 敏感
• 阿米卡星/氟喹诺酮类：100% 耐药

**为何容易漏检：**
美罗培南和亚胺培南可能仍在敏感范围。厄他培南是最佳筛查指标。mCIM 可能为弱阳性。`,

    differentiation: {
      'vs_OXA-48': '表型难以区分。OXA-232 在中国主要在儿童中检出（ColKP3 质粒），OXA-48 主要在成人。需基因测序区分。',
      'vs_KPC-2': 'CZA 对两者均为敏感→表型重叠。KPC-2 所有碳青霉烯均明确 R（MIC 高），OXA-232 可能仅厄他培南 R。mCIM 可辅助。',
      'vs_NDM': 'CZA：OXA-232 → S；NDM → R。这是最快分界线。ATM：OXA-232 → R；NDM → S。',
      'vs_ESBL_porin': '两者表型高度重叠（均可能仅 ETP R + CZA S）。需 mCIM 或分子检测区分。但 OXA-232 对阿米卡星和氟喹诺酮类几乎全部耐药。',
    },

    clinicalNote: '产 OXA-232 菌株，CZA 在体外敏感时是合理治疗选择。碳青霉烯类即使体外敏感也不推荐单用治疗严重感染。正在成为中国第三大流行碳青霉烯酶（Han 2020）。',
    references: [
      '胡付品等,《细菌药物敏感性试验执行标准和典型报告解读》第二版, Case 09', 'Han 2020, Front Cell Infect Microbiol 10:314', 'Yin 2017 (OXA-232 first report China)', 'PMID: 22252629'],
    createdBy: '【待专家审核 - 基于 Han 2020 中国多中心 CRE 研究】',
  },

  // ============================================================
  // [论文新增] KPC+NDM 共产生 — 来源: Han 2020
  // ============================================================
  {
    id: 'KP-KPC-NDM-co',
    bacteria: 'KP',
    label: 'KPC-2 + NDM 共产生 (双重碳青霉烯酶)',
    category: '联合机制 / KPC + MBL 共携带',
    gene: 'bla_KPC-2 + bla_NDM-1 (或 bla_NDM-5)',
    priority: 84,

    pattern: {
      allOf: ['CZA:R', 'ATM:R'],
      atLeastN: [2, ['MEM:R', 'IPM:R', 'ETP:R']],
      atLeastN_2: [3, ['CTX:R', 'CRO:R', 'CAZ:R', 'FEP:R']],
      noneOf: [],
      supporting: ['IMR:R', 'MEV:R'],
      flags: ['CZA R + ATM R 同时出现', '所有β-内酰胺+所有酶抑制剂均耐药', '碳青霉烯 MIC 极高', 'Han 2020: 占中国 CRE 1.0%']
    },

    summary: '同时产生 KPC-2 和 NDM 的菌株对所有β-内酰胺类抗生素（含新型酶抑制剂复合物）均高度耐药。KPC 负责水解 ATM（NDM 不水解），NDM 负责抵抗所有酶抑制剂。Han 等(2020)在中国 935 株 CRE 中检出 9 株(1.0%)KPC+NDM 共产生株。',

    interpretation: `**耐药原因：**
两种碳青霉烯酶功能互补：
• KPC-2：水解 ATM（NDM 不水解的底物）→ ATM 耐药
• NDM：不被阿维巴坦等任何酶抑制剂抑制 → CZA/IMR/MEV 全部耐药
• 两者均水解碳青霉烯 → 碳青霉烯 MIC 极高

**流行病学（中国，Han 2020）：**
• 占 CRE 的 1.0%（9/935）—— KPC-2 + NDM-1 共产生
• 另有 KPC-2 + NDM-5 共产生（0.1%, 1/935）
• NDM-1 + IMP-4 共产生（0.1%）
• NDM-24 + OXA-48 共产生（0.1%）

**鉴别关键：**
常规逻辑"ATM:S → NDM"和"CZA:S → KPC-2"在此失效。CZA R + ATM R + 碳青霉烯 R 的组合要么是 KPC+NDM 共产生，要么是 KPC-33 突变 + 孔蛋白丢失。`,

    differentiation: {
      'vs_KPC-33': '表型完全一致（CZA R + ATM R + 碳青霉烯 R）！必须分子检测。流行病学线索：KPC+NDM 在 ICU 和既往使用多种抗生素的患者中更常见。',
      'vs_NDM_alone': 'NDM 单独时 ATM 应为 S（MBL 不水解 ATM）。ATM R 提示合并 KPC 或 ESBL/AmpC。',
      'vs_KPC-2_porin': 'KPC-2+孔蛋白丢失时 CZA 应为 S。CZA R 排除单纯 KPC。',
    },

    clinicalNote: '治疗选择极度有限。可考虑头孢地尔、多粘菌素+替加环素联合。所有β-内酰胺类（含新型酶抑制剂复合物）均无效。',
    references: ['Han 2020, Front Cell Infect Microbiol 10:314 (Table 2)', 'CLSI M100 Ed35'],
    createdBy: '【待专家审核 - 基于 Han 2020 中国 CRE 研究中双重碳青霉烯酶数据】',
  },

  // ============================================================
  // [综述新增] 质粒介导多黏菌素耐药 (mcr) — 来源: Hussein 2021 (Mol Biol Rep) + Yadav 2026 (Cureus)
  // ============================================================

  {
    id: 'KP-colistin-mcr',
    bacteria: 'KP',
    label: '多黏菌素耐药 (mcr 质粒介导)',
    category: '多黏菌素耐药 / 质粒介导 (MCR 家族)',
    gene: 'mcr-1 至 mcr-10 (磷酸乙醇胺转移酶)',
    priority: 74,

    pattern: {
      allOf: ['CST:R'],
      atLeastN: [0, []],
      noneOf: [],
      supporting: [],
      flags: ['多黏菌素耐药', '质粒介导 → 水平传播风险高', 'mcr-1 最常见 (2015 年中国首次发现)', '常与 ESBL/碳青霉烯酶基因共存', 'CLSI: 仅报中介/耐药, EUCAST: 可报敏感']
    },

    summary: 'mcr (mobilized colistin resistance) 基因编码磷酸乙醇胺(PEtN)转移酶，通过修饰脂质 A 降低多黏菌素结合力。与染色体介导的 mgrB 突变不同，mcr 位于可接合质粒上，可通过水平基因转移跨菌种传播。mcr-1 是最主要的全球流行变体（2015 年在中国首次发现），目前已鉴定 mcr-1 至 mcr-10 共 10 个变体家族。',

    interpretation: `**耐药机制（Hussein 2021 Mol Biol Rep 综述 + Yadav 2026 Cureus 综述）：**

**多黏菌素作用靶点：**
• 多黏菌素（Colistin/Polymyxin E）带正电荷，与 LPS 脂质 A 带负电荷的磷酸基团静电结合
• 竞争性置换 Ca²⁺/Mg²⁺ → 破坏外膜完整性 → 细菌裂解

**MCR 介导耐药的分子机制：**
1. mcr 基因编码 PEtN（磷酸乙醇胺）转移酶
2. MCR 酶以磷脂酰乙醇胺为供体，将 PEtN 基团转移至脂质 A 的葡萄糖胺糖基上
3. PEtN 修饰中和脂质 A 的负电荷 → 多黏菌素无法静电结合
4. MCR-1 催化结构域类似于锌金属蛋白，可被 EDTA 和吡啶二羧酸(DA)抑制

**mcr 变体家族（mcr-1 至 mcr-10）：**

| 基因 | 首次发现 | 主要宿主 | 备注 |
|------|---------|---------|------|
| mcr-1 | 2015, 中国 | E. coli, KP, Salmonella, Enterobacter | 全球最常见，>20 亚变体 |
| mcr-2 | 2016, 比利时 | E. coli, Moraxella | 主要动物源 |
| mcr-3 | 2017, 亚洲/美国 | E. coli, Aeromonas | 可与 blaNDM-5 共存 |
| mcr-4 | 2016, 意大利/西班牙 | Salmonella, E. coli | |
| mcr-5 | 2017, 德国 | Salmonella Paratyphi B | 转座子关联 |
| mcr-6 | 2016 | Moraxella | 主要莫拉菌属 |
| mcr-7 | 2018 | K. pneumoniae | |
| mcr-8 | 2018, 黎巴嫩/卡塔尔 | NDM+ K. pneumoniae | 中国 ST15 检出 mcr-1+mcr-8 共携带 |
| mcr-9 | 2019, 美国 | Salmonella, E. coli, KP, E. cloacae | 可诱导耐药(需多黏菌素暴露), 在欧洲多国 KP 中检出 |
| mcr-10 | 2020 | Enterobacter roggenkampii | 最新鉴定 |

**mcr 基因的染色体内源性起源：**
• mcr-1/2 → 源自 Moraxella 属染色体基因
• mcr-3/5/7/8 → 源自 Aeromonas 属
• mcr-4 → 源自 Shewanella 属
• mcr-9 → 源自 Kosakonia pseudosacchari
• mcr-10 → 源自 Buttiauxella 属

**中国流行病学（2019-2021）：**
• mcr-1+ KP 临床分离率极低（~0.1%，北京 10,338 株 KP 中仅 7 株）
• 2017 年饲料禁抗令后 mcr-1 检出率持续下降
• 高克隆多样性 → 多重独立质粒获取事件，非克隆扩增
• ST15 和 ST11 是主要报道的 ST 型
• 质粒类型：IncHI2, IncX4, IncHI2/IncN, IncFIB 等多种

---

**mcr-8 亚家族：中国临床新威胁**

**mcr-8.2 + blaNDM-5 共携带（肺移植病房，ST656）：**
• mcr-8.2 位于 IncFII(K)+IncQ1 双复制子杂合接合质粒
• 质粒可接合转移至大肠埃希菌 J53（频率 10⁻⁷）
• blaNDM-5 位于 IncX3 型接合质粒（频率 10⁻⁴）
• mcr-8.2 遗传环境：ISKpn26-orf-mcr-8.2-ISEcl1-copR-baeS-dgkA（高度保守）
• IncFII(K) 复制子在 9/11 个 mcr-8.2 质粒中为共享元件 → 骨架保守
  *依据：Zhao et al. 2022 Front Cell Infect Microbiol — 首例 NDM-5+MCR-8.2 共携带 ST656 临床株报告*

**mcr + 染色体协同 → 超高 MIC：**
• mcr-8.2 单独（接合子）：CST MIC 仅 4 mg/L
• mcr-8.2 + MgrB I45F + PmrA D86E + CrrB V193G（亲本株）：CST MIC 高达 **256 mg/L**
• → 质粒+染色体机制的协同效应可将 MIC 推高 64 倍
  *依据：Zhao et al. 2022 FCIM — 接合子 vs 亲本株 MIC 对比直接证明协同*

**mcr-8 在中国的宿主 ST 多样性：**
• ST1, ST11, ST395, ST656, ST1770, ST3410 均有检出
• ST656 与 ST1 仅 1 个等位基因差异 → 同克隆复合体，质粒可能有共同祖先
  *依据：Zhao et al. 2022 FCIM — MLST 比较+系统发育分析*

**mgrB vs mcr 区分：**
• mgrB 突变：染色体介导，垂直传播为主
• mcr 基因：质粒介导，可水平传播，跨菌种传播风险
• 表型无法区分，需 PCR 检测
• mcr 单独常导致低水平耐药（MIC 4-8 mg/L），但与染色体 TCS 突变协同可达极高 MIC (≥256)`,

    differentiation: {
      'vs_mgrB': 'mgrB 染色体介导（垂直传播）, mcr 质粒介导（水平传播）。表型无法区分，PCR 是唯一可靠方式。mcr 常低水平耐药（MIC 4-8），mgrB MIC 可变。',
      'vs_KPC_NDM_co': 'mcr+ 菌株通常碳青霉烯敏感（除非同时携带碳青霉烯酶基因）。mcr+NDM/KPC 同时阳性 → 几乎全耐药（PDR）。',
    },

    clinicalNote: '多黏菌素 E 和多黏菌素 B 为等效药物。mcr 阳性 + 碳青霉烯酶阳性 = 治疗选择极度有限。头孢地尔、替加环素可能是仅剩有效药物。中国 2017 饲料禁抗令后 mcr 流行率下降，提示农业减抗策略有效。',
    references: ['Hussein 2021, Mol Biol Rep 48:2897-2912 (mcr-1 to 10 综述)', 'Yadav 2026, Cureus 18:e109203 (mcr 综述)', 'Andrade 2020, Microorganisms 8:1716', 'Gogry 2021, Front Med 8:677720', 'Zhao et al. 2022, Front Cell Infect Microbiol 12:922031 (首例 NDM-5+MCR-8.2 ST656，mcr+染色体协同→MIC 256)'],
    createdBy: '基于 Hussein 2021 mcr-1-10 综述 + Yadav 2026 mcr 综述 + Zhao 2022 FCIM 论文',
  },

  // ============================================================
  // [综述新增] 替加环素耐药 — 来源: Yaghoubi 2022 (Eur J Clin Microbiol Infect Dis)
  // ============================================================

  {
    id: 'KP-tigecycline-efflux',
    bacteria: 'KP',
    label: '替加环素耐药 (AcrAB-TolC 外排泵过表达)',
    category: '替加环素耐药 / RND 外排泵 + 调控突变',
    gene: 'ramA/ramR/marA/soxR 调控突变 → acrAB-tolC/oqxAB 过表达',
    priority: 73,

    pattern: {
      allOf: ['TGC:R'],
      atLeastN: [1, ['MEM:R', 'IPM:R', 'ETP:R']],
      atLeastN_2: [2, ['CTX:R', 'CRO:R', 'CAZ:R']],
      noneOf: [],
      supporting: ['CIP:R', 'LVX:R'],
      flags: ['替加环素 MIC 升高', '常在 CRKP 背景上发生', '多药外排泵上调同时影响多种药物', '亚洲 CRKP 中替加环素耐药率高于欧美', 'ST11/ST307 常见']
    },

    summary: '肺炎克雷伯菌对替加环素耐药的主要机制是 AcrAB-TolC RND 型外排泵过表达，由上游调控因子突变驱动（ramR 失活→ramA 过表达→acrAB 上调为核心通路）。RamA 同时调控 AcrAB 和 OqxAB 两个外排泵。替加环素是 CRKP 感染的最后防线之一，耐药的出现严重限制治疗选择。',

    interpretation: `**耐药机制（Yaghoubi 2022 Eur J Clin Microbiol Infect Dis 综述 + 多来源整合）：**

**替加环素作用机制：**
• 甘氨酰环素类（glycylcycline），米诺环素衍生物
• 与 30S 核糖体亚基结合 → 阻断 tRNA 进入 A 位 → 抑制蛋白合成
• 规避经典 Tet 耐药机制（核糖体保护、常规外排）

**机制一：AcrAB-TolC RND 外排泵过表达（核心机制）**

**RamA-RamR 调控轴：**
1. RamR 是 ramA 的局部转录抑制因子
2. ramR 突变/缺失 → RamR 失活 → 失去对 ramA 的抑制
3. RamA 过表达 → 直接结合 acrAB 和 oqxAB 启动子区 → 双泵上调
4. AcrAB-TolC 主动外排替加环素 → MIC 升高

**已报道的 ramR 突变：**
• M184V, Y59C, I141T, A28T, S157P
• C99/C100 移码插入 → 功能完全丧失
• ramR 核糖体结合位点 12-bp 缺失 → 翻译受阻
• ramA 启动子区 C139T 突变 → RamR 结合位点破坏

**其他调控通路：**
• **MarA 通路**：MarR 突变（如 S82G）→ marA 过表达 → acrB 上调。ST307 中尤其重要（r=0.59, P=0.013）
• **SoxRS 通路**：soxR 突变 → soxS 过表达 → acrAB 上调
• **RamA 双泵调控**（Xu 2021, Int J Antimicrob Agents）：首次证实 RamA 直接结合 acrAB 和 oqxAB 两个操纵子的启动子。ramA 缺失 → 替加环素 MIC 下降 16 倍，acrB 表达降 4.3 倍，oqxB 降 7.1 倍

**机制二：质粒介导 Tet(A) 变体（MFS 型外排泵）**
• tet(A) 基因突变（I5R, V55M, I75V, T84A, S201A, F202S, V203F）→ 获得替加环素外排能力
• 常见于 ST147 菌株
• 接合质粒共携带 blaKPC-2 + tet(A) 变体 → 替加环素治疗中筛选耐药
• Tet(A) + AcrAB 共表达 → 高水平替加环素耐药（MIC ≥ 8 μg/mL）

**机制三：核糖体靶点突变（rpsJ）**
• rpsJ 编码核糖体 S10 蛋白
• V57L 突变 → 降低替加环素与 30S 亚基结合力
• 在替加环素异质性耐药亚群中检出

**机制四：Tet(X) 酶促灭活（新兴机制）**
• tet(X) 编码黄素依赖单加氧酶 → 酶解替加环素
• 原在拟杆菌中发现，可移动 tet(X) 变体已进入肠杆菌科
• 人畜共患风险

**机制X（新增）：acrR 截断 → AcrAB 去抑制（独立于 ramR 的通路）**

• AcrR 是 acrAB 的局部转录抑制因子（全长 651 bp）
• acrR 第 362 位单碱基缺失 (362delG) → 翻译提前终止于第 123 氨基酸
• AcrR 功能丧失 → 失去对 acrAB 的抑制 → AcrB 过表达
• 此突变导致替加环素 MIC = 4 mg/L
• ramR I141T 同时检出但 PROVEAN 预测为中性 → ramR 非主因
• **与经典 ramR→ramA 通路不同，此为 acrR 直接失活通路**
  *依据：Zhao et al. 2022 Front Cell Infect Microbiol — ST656 NDM-5+MCR-8.2 全耐药 KP 中 acrR 362delG 截断。Sheng 2014 AAC 也报告 2/3 非 ramR 突变株的替加环素耐药由 acrR 介导*

**机制对比 — TGC:R 的两种外排通路：**

| 通路 | 突变 | 机制 | MIC | 证据 |
|------|------|------|-----|------|
| RamR→RamA 通路 | ramR 突变/缺失 | RamA 过表达 → acrAB+oqxAB 双泵上调 | 可变 (2-16) | Yaghoubi 2022 综述 |
| AcrR 直接通路 | acrR 截断/缺失 | AcrR 失活 → acrAB 去抑制 | 4 mg/L | Zhao 2022 FCIM; Sheng 2014 AAC |
| Tet(A) 变体 | tet(A) S251A 等 | 质粒 MFS 外排 | ≥8 (与 AcrAB 协同) | Yaghoubi 2022 综述 |

**体内适应性耐药（治疗中演变）：**
• 替加环素治疗过程中菌株可从敏感转为耐药
• 机制：ramR 结合位点缺失 → RamA/RarA 上调 → tet(A) 变体获取 → rpsJ 突变
• Lon 蛋白酶移码突变也在高水平耐药株中检出

**替加环素异质性耐药（TGCHR-Kp）：**
• Zhang 等 (2021) 在 268 株替加环素敏感 KP 中检出 7.8% 为异质性耐药
• 外排泵抑制剂可恢复异质性耐药亚群的替加环素敏感性
• 替加环素暴露富集耐药亚群 → 治疗失败风险

**流行病学：**
• 亚洲 CRKP 中替加环素耐药率高于欧美
• ST11 和 ST307 是替加环素耐药 CRKP 的主要克隆
• FDA vs EUCAST 折点差异 → 耐药率评估不一致`,

    differentiation: {
      'vs_KPC-2': '替加环素耐药可在 KPC-2 基础上附加发生。KPC-2 用 CZA 有效，替加环素耐药株 TGC 无效。两者可共存。',
      'vs_colistin_resistance': '替加环素 vs 多黏菌素是不同药物类别的最后防线。TGC R + CST R 共耐药 → 仅剩头孢地尔等极少数选择。',
    },

    clinicalNote: '替加环素 MIC 升高时，即使仍报告"敏感"也需警惕（FDA 折点较高，EUCAST 更严格）。高剂量替加环素（200 mg 负荷 + 100 mg q12h）和联合治疗可部分克服低水平耐药。替加环素单药治疗 CRKP 血流感染失败率较高。',
    references: ['Yaghoubi 2022, Eur J Clin Microbiol Infect Dis 41:1003-1022 (替加环素综述)', 'Xu 2021, Int J Antimicrob Agents (RamA 双泵调控)', 'Zhang 2021, Front Microbiol (替加环素异质性耐药)', 'Chirabhundhu 2024, Sci Rep 14:55705', 'Zhao et al. 2022, Front Cell Infect Microbiol 12:922031 (acrR 362delG 截断→TGC R)', 'Sheng 2014, Antimicrob Agents Chemother 58:6982-6985 (acrR 突变与 TGC 耐药)'],
    createdBy: '基于 Yaghoubi 2022 替加环素综述 + Zhao 2022 FCIM (acrR 截断) + WebSearch 机制整合',
  },

  // ============================================================
  // [综述新增] 16S rRNA 甲基化酶 — 来源: Wachino/Doi/Arakawa 2020 (Infect Dis Clin North Am)
  // ============================================================

  {
    id: 'KP-aminoglycoside-16SRMTase',
    bacteria: 'KP',
    label: '氨基糖苷类耐药 (16S rRNA 甲基化酶)',
    category: '氨基糖苷类耐药 / 16S rRNA 甲基转移酶',
    gene: 'armA / rmtB / rmtC (质粒介导 16S-RMTase)',
    priority: 72,

    pattern: {
      allOf: ['AMK:R', 'GEN:R'],
      atLeastN: [1, ['TOB:R']],
      noneOf: [],
      supporting: ['ATM:S'],
      flags: ['所有氨基糖苷类均高度耐药 (MIC ≥256 μg/mL)', '包括阿米卡星、庆大霉素、妥布霉素', '对普拉佐米星 (plazomicin) 同样耐药', '常与 NDM 在同一质粒上共携带', '纸片扩散法无抑菌圈']
    },

    summary: '质粒介导的 16S rRNA 甲基转移酶（16S-RMTase）在 16S rRNA 的 N7-G1405 位点添加甲基，阻断所有临床氨基糖苷类抗生素（含新一代普拉佐米星）与核糖体结合，导致高水平全类耐药。armA 和 rmtB 是全球最常见的两个基因，常与 blaNDM 共携带 → 碳青霉烯+氨基糖苷双重耐药。',

    interpretation: `**耐药机制（Wachino, Doi, Arakawa 2020 Infect Dis Clin North Am 综述）：**

**氨基糖苷类作用靶点：**
• 与细菌 30S 核糖体亚基 16S rRNA 的 A 位（解码区）结合
• G1405 位点是关键结合位点 → 16S-RMTase 在此处添加甲基 → 药物无法结合
• 导致密码子错读和/或蛋白合成提前终止

**16S-RMTase 分子机制：**
1. 甲基转移酶以 S-腺苷-L-蛋氨酸（SAM）为甲基供体
2. 在 16S rRNA 螺旋 44（h44）的 N7-G1405 位点添加甲基
3. N7-G1405 甲基化完全阻断氨基糖苷类的核糖体结合
4. 导致对所有临床氨基糖苷类的高水平耐药（MIC ≥256 μg/mL）

**两个主要基因对比：**

| 特征 | armA | rmtB |
|------|------|------|
| G+C 含量 | ~30% | ~55% |
| 移动元件 | Tn1548 复合转座子 (IS26 侧翼) | Tn3, ISL3 家族 IS 元件 |
| 常共携带 β-内酰胺酶 | blaCTX-M-3, blaNDM, blaOXA-23 | blaCTX-M-14, blaTEM-1, blaKPC, qepA |
| 全球分布 | 日本、欧洲、韩国、保加利亚、印度、希腊、巴西、中国 | 日本、台湾、中国、韩国、比利时、印度、安哥拉 |

**其他 16S-RMTase 基因：**
• rmtC — 肠杆菌科中第三常见
• rmtA, rmtD — 主要在铜绿假单胞菌中
• rmtE, rmtF, rmtG, rmtH — 较罕见
• npmA — 在 A1408 位点甲基化（不同机制）

**为何对普拉佐米星也耐药：**
• 普拉佐米星（plazomicin）是新一代氨基糖苷，专为规避 AME（氨基糖苷修饰酶）设计
• 但普拉佐米星仍需要与 16S rRNA G1405 位点结合
• 16S-RMTase 在 G1405 的甲基化同样阻断普拉佐米星作用
• 这是普拉佐米星的主要"盲区"

**与 NDM 的致命共携带：**
• blaNDM + armA/rmtB 在同一质粒上 → ICU 常见最坏组合
• NDM 负责 β-内酰胺全类耐药（除 ATM），armA/rmtB 负责氨基糖苷全类耐药
• 在中国 NDM+ 菌株中 16S-RMTase 共携带率极高
• 治疗选择几乎仅限于替加环素、多黏菌素、头孢地尔

**检测与筛查：**
• 筛查 cutoff：庆大霉素/妥布霉素/阿米卡星 MIC ≥256 μg/mL → 高度提示
• 纸片扩散：多个氨基糖苷纸片完全无抑菌圈
• 确认：多重 PCR 检测 armA, rmtB, rmtC
• 注意：AME（如 aac(6')-Ib）也可导致耐药但 MIC 通常较低（32-128 vs ≥256）

**流行病学：**
• 已在 >30 个国家和地区检出
• 临床分离株和畜牧动物（猪、禽）中均有检出 → One Health 问题
• 中国是 armA 和 rmtB 的高流行区
• 多黏菌素耐药+碳青霉烯耐药+氨基糖苷耐药 = 仅剩替加环素`,

    differentiation: {
      'vs_AME': 'AME（氨基糖苷修饰酶，如 AAC, ANT, APH）导致中度耐药（MIC 32-128），每种 AME 的底物谱不同（如仅阿米卡星 R 而庆大霉素 S）。16S-RMTase 导致极高 MIC（≥256）且对所有氨基糖苷类交叉耐药（含普拉佐米星）。',
      'vs_efflux': '外排泵介导的氨基糖苷耐药通常为低水平，常同时影响多种结构无关药物。16S-RMTase 为高水平、氨基糖苷特异性耐药。',
    },

    clinicalNote: '16S-RMTase + NDM 共携带菌株：氨基糖苷类和几乎所有 β-内酰胺类均无效。替加环素、多黏菌素、头孢地尔是仅剩的治疗选择。氨基糖苷类药敏若所有药物 MIC 均 ≥256，强烈建议进行 16S-RMTase PCR 确认以指导感染控制。',
    references: ['Wachino 2020, Infect Dis Clin North Am 34:887-902 (16S-RMTase 综述)', 'Doi 2016, Clin Infect Dis 45:88-94', 'CLSI M100 Ed35'],
    createdBy: '基于 Wachino/Doi/Arakawa 2020 16S-RMTase 综述 + WebSearch 流行病学整合',
  },

  // ============================================================
  // [综述新增] 头孢他啶/阿维巴坦 (CZA) 耐药全景 — 来源: Hobson 2022 (AAC) + 多来源整合
  // ============================================================

  {
    id: 'KP-CZA-resistance',
    bacteria: 'KP',
    label: 'CZA 耐药 (多重机制全景)',
    category: 'CZA 耐药 / 酶突变 + 过表达 + 孔蛋白 + NDM 获取',
    gene: 'KPC 突变(Ω-loop/其他热点) + blaKPC 过表达 + blaNDM 获取 + ompK35/36 突变',
    priority: 71,

    pattern: {
      allOf: ['CZA:R'],
      atLeastN: [1, ['MEM:R', 'IPM:R']],
      atLeastN_2: [2, ['CTX:R', 'CRO:R', 'CAZ:R', 'FEP:R']],
      noneOf: [],
      supporting: ['ATM:R'],
      flags: ['CZA 耐药 ≠ 仅 KPC-33', '可能同时存在多种机制', '碳青霉烯 MIC 可能较低 (CZA R + MEM S/I 可见)', 'CZA 治疗中可快速演变 (11-21 天)', '需分子检测确认具体机制']
    },

    summary: '同一 CZA:R 表型可由两大类完全不同的机制介导：**(A) 碳青霉烯酶通路**（KPC 突变/过表达、NDM 获取）和 **(B) 非碳青霉烯酶通路**（ESBL 变异 + 双重孔蛋白缺失）。需要区分，因为前者保留/恢复碳青霉烯敏感性（KPC-33 代偿效应），后者可能导致 ESBL+孔蛋白协同的碳青霉烯耐药。CZA 治疗中 11 天即可筛选出 NDM 获得株，也可通过 blaCTX-M-71 质粒丢失恢复敏感。',

    interpretation: `**CZA 耐药全景（Hobson 2022 AAC 综述 + 多来源整合）：**

**背景：**
头孢他啶/阿维巴坦（CZA）是治疗产 KPC 肺炎克雷伯菌感染的一线药物。阿维巴坦共价结合 KPC 活性丝氨酸位点，不可逆抑制酶活性。但 CZA 治疗过程中耐药出现日益频繁。

---

**机制一：KPC 酶突变（最常见，但不限于 D179Y）**

**三个突变热点（Hobson 2022）：**
• Ω-loop (Omega loop)：D179Y/N 最经典 → KPC-33
• 240-loop：H274Y 等
• 270-loop：其他功能获得性突变

**KPC 的 Indel 异常高发：**
• 与其他 Class A β-内酰胺酶相比，KPC 的插入/缺失(Indel)突变异常频繁
• 原因：KPC 酶天然稳定性极高 → 耐受更多结构改变而不完全失活
• 已知变体：KPC-71, KPC-76, KPC-94, KPC-95 等 — 多个为治疗中新发

**关键代偿：CZA 耐药 ↔ 碳青霉烯敏感性恢复**
• D179Y 等突变削弱阿维巴坦结合 → CZA 耐药
• 但同时也降低碳青霉烯水解效率 → 碳青霉烯 MIC 可能下降至敏感范围
• **危险循环**：CZA 治疗 → KPC-33 产生 → 换用碳青霉烯 → 回复突变至 KPC-2 → CZA 再次敏感
• → 需要交替/联合策略打断循环

---

**机制二：blaKPC 过表达/基因重复**
• IS26 介导的不等交换 → IncFII 质粒上 blaKPC-2 重复
• KPC 酶量暴增 → 阿维巴坦在胞周间隙浓度不足以 1:1 抑制所有酶分子
• 报告于新型 ST4496 菌株
• 突变型 blaKPC-51 过表达也可导致高水平耐药

---

**机制三：NDM 质粒获取（最危险）**
• 阿维巴坦不抑制 MBL → NDM 获取 = CZA 完全绕过
• Li 等 (2023, Front Microbiol)：ST11 CRKP 在 CZA 治疗仅 **11 天**内获得 IncX3 blaNDM-5 接合质粒
• 表型转变：CZA S → CZA R（NDM 接管所有 β-内酰胺水解）
• PCR/mCIM 是唯一可靠区分方式

---

**机制四：外膜孔蛋白突变 (OmpK35/OmpK36)**
• 孔蛋白突变减少 CZA 进入胞周间隙 → 协同作用
• 常与 β-内酰胺酶产生共存 → 双重效应
• 单独通常不足以导致临床耐药，但可推高 MIC

---

**机制五：非 KPC β-内酰胺酶突变**
• CTX-M-14 P170S 替换 → CZA MIC 升高
• 单突变不足以完全耐药，但可叠加其他机制

---

**机制六：非碳青霉烯酶 ESBL + 孔蛋白双重缺失通路（hvKp 特有）**

• 不依赖碳青霉烯酶的 CZA 耐药机制，在 K1-ST23 hvKp 中首次报告
• **三步协同 → CZA 耐药：**
  1. blaCTX-M-71 质粒获取（CTX-M-15 的单氨基酸变体）→ CZA MIC 升高 ≥8 倍
  2. OmpK35 完全不表达 → β-内酰胺进入通道减少
  3. OmpK36 L359R 新型错义突变 + 表达显著下调 → 进一步限制药物进入
• CTX-M-71 单独不足以导致 CZA 耐药（转化子/接合子仍为 CZA S）
• CTX-M-71 + OmpK35 缺失 + OmpK36(L359R)↓ 三者协同 → CZA 耐药 (MIC ≥64) + 碳青霉烯耐药
• 外膜通透剂（渗透化处理）→ CZA MIC 下降 32 倍 → 证明孔蛋白是关键限速因素
• **耐药可逆性**：blaCTX-M-71 质粒丢失 → CZA 恢复敏感 + 碳青霉烯恢复敏感
  *依据：Zhao, Pu et al. 2024 Virulence — 非产碳青霉烯酶 K1-ST23 hvKp 中 CZA 敏感性丧失与恢复。这是罕见的非碳青霉烯酶 CZA 耐药报告*

**机制七：质粒重组与染色体整合**
• Cui 等 (2023, Emerg Infect Dis)：ST11 KPC-2 产 KP 中质粒重组+染色体整合 → 新型毒力-耐药融合质粒
• 提供超越经典 KPC 突变的额外 CZA 耐药途径

---

**CZA 耐药与高黏液表型关联：**
• Guo 等 (2024, BMC Microbiol)：CZA 耐药获得与高黏液表型发展可能关联
• 暗示耐药-毒力协同进化`,

    differentiation: {
      'vs_KPC-33': 'KPC-33 (D179Y) 是 CZA 耐药的最常见单一机制，但非唯一。blaKPC 过表达、NDM 获取、孔蛋白突变均可单独或联合导致 CZA 耐药。KPC-33 的碳青霉烯 MIC 可能较低。分子检测区分。',
      'vs_NDM': 'NDM 导致 CZA 耐药 + ATM 敏感。KPC 突变导致的 CZA 耐药保留 ATM 耐药。ATM 敏感性是区分 MBL vs 非 MBL CZA 耐药的关键。',
      'vs_KPC_NDM_co': 'KPC+NDM 共产生也导致 CZA R + ATM R。但这是两种机制共存的极端情况，非 KPC 单一突变。分子检测确认。',
      'vs_ESBL_porin': 'ESBL+孔蛋白丢失时 CZA 通常 S。CZA R 排除单纯 ESBL+孔蛋白机制。',
    },

    clinicalNote: 'CZA 治疗中菌株从敏感转为耐药的最常见机制：(1) KPC D179Y/G 突变 (2) NDM 质粒获取 (3) blaKPC 过表达。治疗中应监测 CZA MIC 变化，出现上升趋势即考虑换药。CZA 耐药后碳青霉烯可能"恢复敏感"，但不推荐依赖此现象单用碳青霉烯。',
    references: ['Hobson 2022, Antimicrob Agents Chemother 66:e00890-22 (KPC CZA 耐药变异进化综述)', 'Li 2023, Front Microbiol 14:1159912 (体内适应性耐药)', 'Cui 2023, Emerg Infect Dis (质粒重组+染色体整合)', 'PMID: 28031168 (KPC-33 D179Y)', 'PMID: 31069139 (CZA 耐药机制)', 'Zhao, Pu et al. 2024, Virulence 15:2348251 (非碳青霉烯酶通路: CTX-M-71 + OmpK36 L359R → CZA R)', 'Pu, Zhao et al. 2023, Int J Antimicrob Agents 61:106747 (blaKPC 过表达升高 CZA MIC, KPC-33 体内动态)'],
    createdBy: '基于 Hobson 2022 AAC KPC 变异综述 + Zhao/Pu 2024 Virulence + Pu/Zhao 2023 IJAA + WebSearch 多机制整合',
  },

  // ============================================================
  // [综述新增] CR-hvKP (碳青霉烯耐药高毒力融合) — 来源: Han 2022 (Front Microbiol) + Lan 2021 (J Glob Antimicrob Resist)
  // ============================================================

  {
    id: 'KP-CR-hvKP',
    bacteria: 'KP',
    label: '碳青霉烯耐药高毒力肺炎克雷伯菌 (CR-hvKP)',
    category: '高毒力+耐药融合 / 进化趋同',
    gene: 'blaKPC/blaNDM + rmpA/rmpA2/iucA/iroB (毒力-耐药双质粒或杂合质粒)',
    priority: 83,

    pattern: {
      allOf: [],
      atLeastN: [2, ['MEM:R', 'IPM:R', 'ETP:R']],
      atLeastN_2: [2, ['CTX:R', 'CRO:R', 'CAZ:R', 'FEP:R']],
      noneOf: [],
      supporting: [],
      flags: ['碳青霉烯耐药 + 社区获得性严重感染', '年轻/无基础病患者出现肝脓肿/眼内炎/脑膜炎/坏死性筋膜炎', '黏液丝试验阳性 (拉丝 >5mm)', '高黏液表型 + MDR = 警报', '亚洲(中国)是高发地区', '死亡率极高']
    },

    summary: 'CR-hvKP (Carbapenem-Resistant hypervirulent Klebsiella pneumoniae) 是耐药性与高毒力的危险趋同。传统上 hvKP 和 CRKP 是两个独立进化路径 — hvKP 多为社区获得性、碳青霉烯敏感；CRKP 多为医院获得性、毒力较低。但二者正在融合：CRKP 获取毒力质粒（Hv-CRKP，更常见）或 hvKP 获取碳青霉烯酶质粒（CR-HvKP）。全球汇总: blaKPC 67.2%, blaOXA 13.2%, blaNDM 4.6%, 多碳青霉烯酶共携带 10.7%。',

    interpretation: `**CR-hvKP 进化与流行病学（Han 2022 Front Microbiol 综述 + Lan 2021 J Glob Antimicrob Resist）：**

**两个路径类型：**
1. **Hv-CRKP**（更常见）：经典 CRKP 通过质粒获取毒力基因 → 占 CRKP 中 ~12.3%
2. **CR-HvKP**（较少见）：经典 hvKP（K1/K2 血清型）获取碳青霉烯酶质粒 → 占 hvKP 中 ~3.5%

**三条分子进化途径：**
1. **CRKP + 毒力质粒** (Hv-CRKP 路径)：CRKP 获取携带 rmpA/rmpA2 + iucA(气杆菌素)+ iroB(沙门菌素) 的毒力质粒
2. **hvKP + 耐药质粒** (CR-HvKP 路径)：K1/K2/K5/K57 高毒力株获取 blaKPC/blaNDM 质粒
3. **杂合质粒一步到位**：单一质粒同时携带碳青霉烯耐药基因+毒力基因 → 经典 KP 一步变为 CR-hvKP

**全球碳青霉烯酶分布（汇总 1,229 株 CR-hvKP）：**

| 国家/地区 | 主导碳青霉烯酶 |
|----------|--------------|
| 中国 | blaKPC (87.3%) |
| 新加坡 | blaKPC (90%) |
| 日本 | blaIMP (100%) |
| 印度 | blaOXA (75%) |
| 伊朗 | blaOXA (54.9%), NDM+OXA 共产生高 |
| 德国 | blaKPC (56%), blaOXA (39.3%) |
| 俄罗斯 | blaOXA (70%) |
| 英国 | blaNDM (58.9%) |
| 美国 | blaKPC (60%) |
| 加拿大 | blaKPC (100%) |

**总计：** blaKPC 67.2%, blaOXA 13.2%, blaNDM 4.6%, blaIMP 3.7%, blaVIM 0.6%, 多碳青霉烯酶 10.7%

**关键毒力因子：**
• **高荚膜**：rmpA, rmpA2, wzy-K1(magA), KvrA/KvrB, RcsB → 抗吞噬、抗补体、抗抗菌肽。血清型 K1/K2 最强，K20/K47/K54/K57/K64 也可致病
• **铁载体**：气杆菌素 Aerobactin (iucABCD-iutC) 是首要毒力决定因子。peg-344, iroB, iucA 鉴别 hvKP 准确率 >0.95
• **高胞外多糖**：Wzx/Wzy 通路 → 高黏液表型（拉丝试验 >5mm），K1 株最强

**临床表现：**
• 传统 hvKP 表现：化脓性肝脓肿、眼内炎、脑膜炎、坏死性筋膜炎 — 社区获得性，年轻健康人
• CR-hvKP = 以上表现 + 几乎全耐药 → 致命组合
• 伊朗 VIM-2+ K1/ST23 CR-hvKP 暴发：5 例中 4 例死亡

**中国特殊风险：**
• 中国是 CR-hvKP 的"震中"
• ST11-KL64 已成为中国最流行的 hv-CRKp 克隆，感染患者死亡率更高
  *依据：Pu, Zhao et al. 2023 IJAA; Zhou 2020 Emerg Infect Dis*
• KPC-2 + rmpA2 + iucA 是最常见组合

**⚠️ 黏液丝试验 (String Test) 假阴性警示：**
• ST11-KL64 CR-hvKP 菌株中 **rmpA 基因被 ISKpn26 在核苷酸 22-23 处截断**
• 导致荚膜合成调控受损 → 拉丝试验**阴性**（<5mm）
• **但仍然保留高毒力**：气杆菌素 (iucABCDiutA) 产生量仍远超经典 cKp
• 黏液黏度沉降试验也接近 cKp 水平
• **→ 不能仅凭拉丝试验阴性排除 hvKp！总铁载体定量 + 毒力基因 PCR (iucA/rmpA2/peg-344) 才是金标准**
  *依据：Pu, Zhao et al. 2023 IJAA — ST11-KL64 CR-hvKP 体内进化，11 株 CRKp 全部 rmpA::ISKpn26 但铁载体产量均 >ATCC 700603 (P<0.05)*

**体内进化观察（肺移植患者 1.5 年）：**
• CSKp ST412-KL57（入院时定植）→ ST11-KL64 CRKp（移植后感染，cgMLST <10 等位基因差异）
• 1.5 年内多黏菌素、CZA、碳青霉烯敏感性反复切换
• CR-hvKp 获得耐药的同时**未丧失毒力**（生长曲线无差异、铁载体保持高产量）
  *依据：Pu, Zhao et al. 2023 IJAA*

• 需同时进行药敏检测+黏液丝试验+毒力基因 PCR`,

    differentiation: {
      'vs_CRKP_only': 'CRKP：碳青霉烯耐药，但毒力低（通常仅医院获得性感染，免疫低下者）。CR-hvKP：碳青霉烯耐药 + 高毒力（社区获得性侵袭性感染，可感染健康人）。关键鉴别：黏液丝试验 + 毒力基因 PCR (rmpA/rmpA2, iucA, peg-344)。',
      'vs_hvKP_only': 'hvKP：高毒力但碳青霉烯敏感（可用常规抗生素治疗）。CR-hvKP：高毒力 + 碳青霉烯耐药 → 治疗选择极度有限。',
      'vs_KPC-2': 'KPC-2 可能存在于 CRKP 或 CR-hvKP 中。单独的 KPC-2 条目仅描述耐药机制，CR-hvKP 条目描述耐药+毒力融合的临床综合征。',
    },

    clinicalNote: 'CR-hvKP 感染的临床管理极其困难：既要覆盖碳青霉烯耐药（CZA/多黏菌素/替加环素/头孢地尔），又要控制侵袭性感染（可能需要外科引流）。快速鉴别 CRKP vs CR-hvKP 至关重要 → 提示感染控制级别和预后。中国临床实验室应常规开展黏液丝试验筛查。',
    references: ['Han 2022, Front Microbiol 13:1003783 (CR-hvKP 流行病学与进化综述)', 'Lan 2021, J Glob Antimicrob Resist 27:212-221 (CR-hvKP 全球视角)', 'Dai 2022, J Clin Lab Anal 36:e24743 (hvKP 制作过程)', 'Pu, Zhao et al. 2023, Int J Antimicrob Agents 61:106747 (ST11-KL64 hv-CRKp 体内进化, rmpA::ISKpn26 拉丝假阴性, ISKpn74 首次插入 mgrB)', 'Zhou 2020, Emerg Infect Dis 26:289-97 (ST11-KL64 新型亚克隆增强毒力与传播力)'],
    createdBy: '基于 Han 2022 CR-hvKP 综述 + Pu/Zhao 2023 IJAA + Lan 2021 全球视角',
  },

  // ============================================================
  // [综述新增] 头孢地尔耐药 — 来源: Yao 2021 (Front Med) + 多来源整合
  // ============================================================

  {
    id: 'KP-cefiderocol-resistance',
    bacteria: 'KP',
    label: '头孢地尔耐药 (铁载体受体突变 + β-内酰胺酶)',
    category: '头孢地尔耐药 / 铁摄取系统突变 + 酶水解',
    gene: 'cirA 突变(铁载体受体) + blaNDM/blaKPC 变体 + envZ/exbD 突变',
    priority: 70,

    pattern: {
      allOf: ['FDC:R'],
      atLeastN: [0, []],
      noneOf: [],
      supporting: [],
      flags: ['头孢地尔是最后防线药物', '耐药机制复杂且可快速演变 (11-21 天)', 'CirA 受体突变是核心机制', 'NDM 阳性株 FDC MIC 显著升高', '异质性耐药 → 标准药敏可能漏检', '需铁匮乏培养基 (ID-CAMHB) 做药敏']
    },

    summary: '头孢地尔（Cefiderocol）通过"特洛伊木马"策略（儿茶酚基团→CirA/FepA 等 TonB 依赖性受体主动转运）进入菌体。同一 FDC:R 表型可有三种不同通路：**(1) CirA 受体直接突变**（NDM 协同→最高水平耐药）、**(2) EnvZ V145G 调控突变**（CirA/FepA↓ + TonB↓→KPC 株也可耐药，不依赖 NDM）、**(3) β-内酰胺酶水解**（NDM 最显著）及 ExbD/TonB 能量转导突变。EnvZ 通路是 KPC 产 CR-hvKP 获得 FDC 耐药的独立机制。',

    interpretation: `**头孢地尔耐药机制（Yao 2021 Front Med 综述 + Moon 2022 + 多来源）：**

**头孢地尔作用机制（正常状态）：**
1. 头孢地尔的儿茶酚基团模拟天然铁载体
2. 与铁离子螯合后被 CirA 等 TonB 依赖性受体识别
3. TonB-ExbB-ExbD 复合物提供能量 → 主动转运跨外膜
4. 进入胞周间隙 → 结合 PBP3 → 抑制细胞壁合成
5. 对 KPC/NDM/OXA/ESBL/AmpC 产生株通常仍有效

---

**机制一：CirA 铁载体受体突变（核心入口阻断）**

**cirA 等位基因变异：**
• cirA1（高毒力谱系富集，~39.8%）：高铁转运能力 → FDC 更敏感
• cirA198（MDR 谱系主导，~52.6%）：低铁转运能力 → FDC MIC 更高
• cirA1→cirA198 突变：MIC 从 0.5 升至 2 μg/mL
• 反向突变：MIC 下降 4 倍

**CirA 功能丧失突变（体外进化实验 + 临床分离株）：**
• 移码突变：1461delC, 475dupA → MIC 飙升至 64 μg/mL
• 错义/无义突变：1028A>C, 提前终止密码子 → MIC 32-64 μg/mL
• 补充野生型 cirA 可恢复敏感性（MIC 64→1-8 μg/mL）

**CirA 以外受体：**
• Fiu, FepA 等其他 TonB 依赖性受体也可能参与
• CirA 是 KP 中最主要的 FDC 入口

---

**机制二：β-内酰胺酶水解**

**MBL（NDM/VIM/IMP）— 最显著影响：**
• SIDERO-WT 监测：NDM+ 菌株仅 64.3% MIC ≤4 μg/mL（vs 全测试菌株 97.7%）
• NDM 对 FDC 的水解效率虽低于其他头孢菌素，但仍可推高 MIC
• **CirA 缺陷 + NDM 表达 = 高水平 FDC 耐药**（双重打击）

**KPC 变体：**
• 大多数 KPC-3 产株仍对 FDC 敏感
• 特定变体 KPC-41, KPC-50 → FDC MIC 升高
• KPC D179Y/H274Y/ΔG242_T243 (KPC-33 相关) → FDC MIC 4-64 μg/mL
• KPC 变体可能显示 **CZA-FDC 交叉耐药**

**SHV ESBL：**
• blaSHV 使 FDC MIC 升高约 4 倍
• 通常在折点范围内，不足以单独导致临床耐药
• 阿维巴坦联合可恢复杀菌活性 → 证明 β-内酰胺酶贡献显著

---

**机制三：调控蛋白突变 (envZ/baeSR/exbD)**

• envZ T247I, T247P → FDC MIC 8-16 μg/mL
• baeSR 和 ompR/envZ 双组分调控系统突变
• exbD（TonB-ExbB-ExbD 能量转导复合物组成部分）突变 → MIC 升高 4-32 倍
• 这些突变改变铁摄取系统的表达/功能

---

**机制四：EnvZ/OmpR 双组分系统突变 — KPC 株 FDC 耐药的新入口阻断机制**

• 此机制在 KPC 产生（非 NDM）的 ST11-KL64 CR-hvKP 中发现，**不依赖 MBL**
• **envZ V145G 功能获得性突变** → EnvZ 传感器激酶异常激活
• 下游效应（转录组+蛋白组联合验证）：
  1. **CirA 和 FepA 儿茶酚铁载体受体显著下调** → 头孢地尔"特洛伊木马"入口阻断
  2. **TonB-ExbB-ExbD 能量转导复合物独立稳定下调** → 铁转运能量供应中断
  3. 两条通路协同 → 严重削弱 FDC 主动摄取 → 高水平耐药
• **entB 下调的反向效应**：肠杆菌素合成基因 entB 被 envZ 突变抑制 → 内源性铁载体减少 → FDC 竞争减少 → 反而**增加** FDC 敏感性（调节性权衡/trade-off）
• **适应性代价**：耐药突变株生长减慢、氧化应激耐受力降低、巨噬细胞内生存率下降
• **与 NDM+CirA 通路的区别**：envZ 突变通路可在仅产 KPC 的 CR-hvKP 中独立导致 FDC 耐药，不需 NDM 共存在
  *依据：Pu, Zhao et al. 2025 Int J Antimicrob Agents — envZ V145G 驱动的儿茶酚铁载体受体下调+TonB 抑制→KPC 产 ST11-KL64 CR-hvKP 头孢地尔耐药*

**FDC 耐药机制对比 — 同一表型，不同通路：**

| 通路 | 关键基因/突变 | 机制 | NDM 依赖？ | 证据 |
|------|-------------|------|-----------|------|
| CirA 功能丧失 | cirA 移码/无义突变 | FDC 无法进入 | 协同 (NDM 水解进入的残余 FDC) | Moon 2022; 多篇体外进化 |
| EnvZ 调控通路 | envZ V145G | CirA/FepA↓ + TonB↓ | **否** (KPC 单独即可) | Pu/Zhao 2025 IJAA |
| β-内酰胺酶水解 | blaNDM/blaKPC 变体 | 酶水解药物 | NDM 影响最大 | SIDERO-WT 监测 |
| ExbD/TonB 突变 | exbD 突变 | 能量转导中断 | 不定 | 多篇体外进化 |

**机制五：头孢地尔异质性耐药**

• Moon 等 (2022)：KP AR 0097 (ST3603, blaKPC-3+blaSHV-11+blaTEM-1+blaOXA-9)
• 群体分析显示 32 μg/mL（8× 折点）下有耐药亚群存活
• 异质性耐药机制：耐药亚群中 cirA 自发突变 + 基础 β-内酰胺酶活性
• **标准药敏报告敏感 → 临床治疗失败风险**

---

**临床要点：**
• CREDIBLE-CR 试验：FDC 暴露后 MIC 升高 ≥4 倍
• 耐药可快速出现（治疗开始后 11-21 天）
• 药敏必须用铁匮乏培养基（ID-CAMHB）— 铁限制上调 TonB 依赖性转运体
• 联合阿维巴坦可能部分克服 β-内酰胺酶介导的 MIC 升高`,

    differentiation: {
      'vs_NDM': 'NDM 菌株的 FDC MIC 通常升高但可能仍报告"敏感"。CirA 突变 + NDM 共存在 → FDC 真正高水平耐药。单独 NDM 产生 ≠ FDC 一定耐药。',
      'vs_KPC-33': 'KPC-33 变体可显示 CZA-FDC 交叉耐药。KPC-33 的 FDC MIC 可能中等升高（4-64 μg/mL）。CZA 耐药 + FDC MIC 升高需警惕 KPC 多重突变。',
      'vs_CZA_resistance': 'CZA 耐药机制（KPC 突变/NDM 获取）与 FDC 耐药部分重叠但不完全一致。CirA 突变是 FDC 特异性机制。两者可能同时存在。',
    },

    clinicalNote: 'FDC 是最后防线药物之一，应审慎使用以延缓耐药。治疗前建议同时做 FDC 和 CZA 药敏（交叉耐药可能）。如有 FDC 异质性耐药怀疑，可考虑 FDC 联合治疗（+ 阿维巴坦或 + 替加环素）而非单药。FDC 药敏需在铁匮乏条件下进行，常规药敏方法不适用。',
    references: ['Yao 2021, Front Med 8:741940 (FDC 综述)', 'Moon 2022, Int J Antimicrob Agents (FDC 异质性耐药 + CirA)', 'McElheny 2021, Microbiol Spectr (FDC 耐药机制)', 'Liang 2022, Int J Antimicrob Agents (CirA 等位基因与 FDC MIC)', 'Pu, Zhao et al. 2025, Int J Antimicrob Agents 67:107693 (envZ V145G→CirA/FepA↓+TonB↓→KPC 株 FDC 耐药, 首次阐明 KPC-only CR-hvKP 的 FDC 耐药机制)'],
    createdBy: '基于 Yao 2021 FDC 综述 + Moon 2022 异质性耐药 + Pu/Zhao 2025 IJAA (envZ 通路) + WebSearch 机制整合',
  },

  // ============================================================
  // 🛋️ 喹诺酮类耐药 — QRDR 突变 (公众号来源, 待文献验证)
  // ============================================================

  {
    id: 'KP-quinolone-QRDR',
    bacteria: 'KP',
    label: '喹诺酮耐药 (QRDR 突变: gyrA/parC)',
    category: '喹诺酮类耐药 / 靶位突变',
    gene: 'gyrA (Ser83→Ile/Tyr) / parC (Ser80→Ile) 喹诺酮耐药决定区突变',
    priority: 76,

    pattern: {
      allOf: [],
      atLeastN: [1, ['CIP:R', 'LVX:R']],
      noneOf: [],
      supporting: ['AMK:S', 'GEN:S'],
      flags: ['氟喹诺酮类耐药', 'gyrA/parC 双突变 → 高水平耐药', 'gyrA 单突变 → 低水平耐药', 'parC 辅助增强耐药', '常与 ESBL/KPC 共存']
    },

    summary: '肺炎克雷伯菌对喹诺酮类耐药的最主要机制是染色体上 gyrA 和 parC 基因的喹诺酮耐药决定区（QRDR）点突变。gyrA 突变是第一步也是关键步骤，parC 突变进一步增强耐药水平。',

    interpretation: `**耐药原因：**
喹诺酮类抗生素通过结合 DNA 解旋酶（GyrA₂GyrB₂）和拓扑异构酶 IV（ParC₂ParE₂），阻断细菌 DNA 复制。QRDR 突变改变靶位蛋白构象，降低药物亲和力。

**突变层级（耐药水平递进）：**
1. gyrA 单突变（Ser83→Ile/Tyr） → 萘啶酸高水平耐药，环丙沙星低水平耐药（MIC 0.5-2 μg/mL）
2. gyrA + parC 双突变 → 所有氟喹诺酮类高水平耐药（CIP MIC ≥8 μg/mL）
3. 进一步累积 gyrA 双位点突变（Ser83 + Asp87） → 极高耐药

**中国流行病学（临床常见）：**
• KP 中 gyrA 突变携带率非常高（>70% 在 CIP 耐药株中）
• 常见突变型：GyrA S83I + ParC S80I
• QRDR 突变常与 ESBL/KPC 基因共存于同一菌株 → MDR

**药敏报告识别线索：**
• CIP R + LVX R → 高度提示 QRDR 双突变
• CIP R 但 LVX S → 可能 gyrA 单突变或低水平耐药
• CIP R + AMK S + 碳青霉烯 S → 可能仅为 QRDR 突变，无 ESBL/碳青霉烯酶`,

    differentiation: {
      'vs_qnr_plasmid': 'QRDR 突变：染色体介导，高水平耐药（CIP MIC ≥8）。qnr：质粒介导，低水平耐药（CIP MIC 1-4），保护 gyrA 免受药物攻击，为 QRDR 突变的产生创造条件。两者常共存。',
      'vs_efflux': '外排泵过表达（OqxAB/AcrAB）：通常表现为多药耐药（喹诺酮+替加环素+氯霉素等）。QRDR 突变：仅喹诺酮类耐药。',
      'vs_aac_cr': 'aac(6\')-Ib-cr：乙酰化修饰环丙沙星和诺氟沙星，低水平耐药。不能修饰左氧氟沙星。LVX S 但 CIP R → 考虑此机制。',
    },

    clinicalNote: 'QRDR 突变介导的喹诺酮耐药 → 所有氟喹诺酮类（环丙沙星、左氧氟沙星、莫西沙星）均视为无效。可用的替代药物取决于共存的耐药机制。',
    references: ['微信公众号: 检验充电站 - 喹诺酮类抗生素耐药机制 (2024.09.26)', 'PMID: 10223915 (QRDR mutation mechanism)', 'CLSI M100 Ed35'],
    createdBy: '🛋️ 公众号来源 (检验充电站 2024.09.26), 待文献验证',
  },

  // ============================================================
  // 🛋️ 替加环素耐药 — tet(X3)/tet(X4) (公众号来源, 待文献验证)
  // ============================================================

  {
    id: 'KP-tetX-tigecycline',
    bacteria: 'KP',
    label: '替加环素耐药 (tet(X3)/tet(X4) 质粒介导降解酶)',
    category: '替加环素耐药 / 质粒介导酶降解',
    gene: 'tet(X3) / tet(X4) (质粒携带, FAD 依赖性单加氧酶)',
    priority: 74,

    pattern: {
      allOf: ['TGC:R'],
      atLeastN: [0, []],
      noneOf: [],
      supporting: ['CIP:R', 'LVX:R'],
      flags: ['替加环素高度耐药 (MIC > 8 μg/mL)', '质粒介导 → 水平传播风险高', '中国 2019 年首次报道', 'tet(X4) 最常见于中国猪源/人源分离株', '常与其他耐药基因共存 → MDR/XDR']
    },

    summary: 'tet(X3)/tet(X4) 是质粒携带的 FAD 依赖性单加氧酶，可不可逆地降解所有四环素类抗生素（包括替加环素、厄他环素、奥马环素）。这是目前临床上唯一可导致替加环素高度耐药的质粒介导酶降解机制。2019 年在中国首次报道，已被 Lancet Infect Dis 列为重大公共卫生威胁。',

    interpretation: `**耐药原因：**
Tet(X) 家族属于 FAD 依赖性单加氧酶，在 O₂ 和 NADPH 存在下，将四环素类分子的 C11a 位羟基化，导致药物不可逆失活。

**tet(X) 家族的演化（耐药谱递增）：**
• 最早的 tet(X)（1980s）：仅降解第一代四环素
• tet(X2)：可降解替加环素，但效率低
• **tet(X3)/tet(X4)（2019 年，中国）**：高效降解所有四环素类，包括替加环素、厄他环素、奥马环素
• 已发现 >10 种 tet(X) 变体（tet(X3) 至 tet(X14)）
• 常与 mcr-1（多黏菌素耐药）和 bla_NDM（碳青霉烯耐药）共存于同一质粒 → 全耐药

**与 AcrAB 外排泵机制的关键区别：**
• AcrAB-TolC 过表达：替加环素 MIC 通常 2-4 μg/mL（中介/低水平耐药）
• tet(X4)：替加环素 MIC 通常 16-64 μg/mL（高度耐药）
• AcrAB 需 ramR/acrR 调控突变 → 染色体介导
• tet(X) → 质粒介导 → 可在不同菌种间水平传播

**药敏报告线索：**
• TGC MIC ≥ 8 μg/mL → 高度怀疑 tet(X) 介导耐药（外排泵机制很少达到此水平）
• TGC R + CST R + 碳青霉烯 R → 需警惕 tet(X) + mcr-1 + bla_NDM 共携带`,
    differentiation: {
      'vs_efflux': 'AcrAB 过表达：TGC MIC 2-4（低水平）。tet(X)：TGC MIC ≥ 16（高水平）。分子检测是唯一可靠区分方法。',
      'vs_tmexCD': 'tmexCD-toprJ 也是质粒介导外排泵，但 MIC 升高程度低于 tet(X)。两者可共存。',
    },

    clinicalNote: '产 tet(X4) 菌株 → 所有四环素类（含替加环素、厄他环素）均无效。治疗选择极度有限，需依赖多黏菌素、CZA（如无共存 MBL）、头孢地尔等。感染控制至关重要（质粒传播风险）。',
    references: ['微信公众号: RAINBOW - 四环素类药物耐药机制 (2024.09.26)', 'He et al. 2019, Nat Microbiol - tet(X3)/tet(X4) 首次报道 (PMID: 31133745)', 'Lancet Infect Dis 2020 - tet(X) 威胁评述'],
    createdBy: '🛋️ 公众号来源 (RAINBOW 2024.09.26), tet(X3)/(X4) 核心事实已验证 (He 2019 Nat Microbiol)',
  },

  // ============================================================
  // 🛋️ 异质性耐药 (公众号来源, 待文献验证)
  // ============================================================

  {
    id: 'KP-heteroresistance',
    bacteria: 'KP',
    label: '异质性耐药 (碳青霉烯/多黏菌素/替加环素)',
    category: '异质性耐药 / 表型耐药',
    gene: '多机制：bla_KPC 瞬时过表达 / recA 质粒多聚体化 / 孔蛋白突变 / 串联基因扩增',
    priority: 68,

    pattern: {
      allOf: [],
      atLeastN: [0, []],
      noneOf: [],
      supporting: [],
      flags: ['药敏报告 S 但临床治疗失败时高度警惕', '标准 AST 无法检测', 'PAP 试验为金标准', '菌群中耐药亚群占比可低至 10⁻⁷', '无抗生素时耐药表型可逆转', '多见于 CRKP (检出率最高 60%)']
    },

    summary: '异质性耐药是指同一遗传背景的菌群中，少数亚群（<1%）表现出显著高于优势菌群的耐药水平。这种耐药不能被标准药敏试验（AST）检出，却是临床治疗失败的重要原因。在 CRKP 中对碳青霉烯、多黏菌素和替加环素的异质性耐药均有报道。',

    interpretation: `**定义与临床意义：**
异质性耐药是细菌从敏感到完全耐药的"中间阶段"。菌群中绝大多数亚群药敏为 S，但少数耐药亚群在抗生素压力下被快速筛选出来，导致治疗失败。

**核心特征：**
• 标准 AST 无法检测（耐药亚群占比太低）
• 23.3% 异质性耐药菌株被误判为常规耐药，17.5% 被误判为敏感
• 单克隆异质性耐药（更常见）：单一克隆分化，耐药表型可逆（无抗生素时恢复）
• 多克隆异质性耐药：敏感菌与耐药菌混合感染，耐药表型可稳定遗传

**KP 中主要异质性耐药类型与机制：**
1. **碳青霉烯异质性耐药**（最常见于 CRKP）：
   - bla_KPC 瞬时过表达（最主因）
   - recA 介导的碳青霉烯酶质粒多聚体 → 基因拷贝数增加
   - 孔蛋白 ompK35/ompK36 突变 ↔ 可逆
2. **多黏菌素异质性耐药**（CRKP 检出率最高 60%）：
   - mgrB 基因串联扩增 → 高耐药
3. **替加环素异质性耐药**：
   - 外排泵 ramR/acrR 调控突变

**临床线索（药敏报告不显示）：**
• 药敏报告 S，给予相应抗生素治疗后，临床无明显改善或出现反复
• 特别是重症患者、长疗程、高菌量感染（如脓肿）→ 异质性耐药风险更高
• CRKP 菌株 → 异质性耐药发生率显著高于碳青霉烯敏感株`,

    differentiation: {
      'vs_常规耐药': '常规耐药：整个菌群均一耐药，AST 可检出。异质性耐药：仅少数亚群耐药，AST 不可检出，需 PAP 法或分子检测。',
      'vs_治疗中耐药': '治疗中耐药（如 KPC-2 → KPC-33 突变）是新发突变导致的获得性耐药。异质性耐药是预先存在耐药亚群，在抗生素压力下被筛选。两者均可导致治疗失败，但机制不同。',
      'vs_生物膜耐药': '生物膜相关耐药由细菌生物膜物理屏障和代谢休眠介导，异质性耐药由遗传/表观遗传异质性介导。两者可共存，均导致"体外敏感、体内无效"。',
    },

    clinicalNote: '怀疑异质性耐药时：① 考虑联合治疗（如碳青霉烯+多黏菌素+替加环素三联），避免单药治疗；② 提高初始接种量可提升检出率（磷霉素异质性耐药）；③ 避免在存在高菌量感染灶时单用抑菌性抗生素；④ 长时间治疗需警惕耐药亚群逐步被筛选。',
    references: ['微信公众号: 耐药君 - KP 异质性耐药综述 (2024.09.26)', 'PMID: 32633762 (KP heteroresistance review)', 'PMID: 31757471 (carbapenem heteroresistance in CRKP)'],
    createdBy: '🛋️ 公众号来源 (耐药君 2024.09.26), 核心机制已验证文献',
  },

  // ============================================================
  // 氨基糖苷类耐药 — AAC(6') 乙酰化酶 (书本来源)
  // ============================================================

  {
    id: 'KP-AAC6-aminoglycoside',
    bacteria: 'KP',
    label: '氨基糖苷耐药 (AAC(6\') 乙酰化酶)',
    category: '氨基糖苷类耐药 / 氨基糖苷修饰酶 (AME)',
    gene: 'aac(6\')-Ib / aac(6\')-Ib-cr (乙酰化酶, 部分变体还可修饰环丙沙星)',
    priority: 73,

    pattern: {
      allOf: ['AMK:R'],
      atLeastN: [0, []],
      noneOf: [],
      supporting: ['GEN:S', 'TOB:R'],
      flags: ['阿米卡星耐药 + 庆大霉素敏感 → AAC(6\') 特征', 'aac(6\')-Ib-cr 变体可同时修饰环丙沙星', '质粒介导, 可水平传播', '区别于 16S-RMTase: 16S-RMT 致所有氨基糖苷均耐药']
    },

    summary: 'AAC(6\')-I 是临床最重要的氨基糖苷修饰酶（AME），通过乙酰化作用钝化阿米卡星、妥布霉素和奈替米星，但对庆大霉素活性较弱。药敏特征为 AMK R + GEN S（或 I），与 16S rRNA 甲基化酶导致的全部氨基糖苷耐药截然不同。',

    interpretation: `**耐药原因：**
氨基糖苷修饰酶（Aminoglycoside Modifying Enzymes, AMEs）通过共价修饰氨基糖苷分子的特定羟基或氨基，使其无法与细菌核糖体结合。主要有三类：乙酰转移酶（AAC）、磷酸转移酶（APH）、核苷转移酶（ANT）。

**AAC(6\')-I 的特性：**
• AAC(6\')-I 在氨基糖苷分子的 6' 位进行乙酰化
• 底物谱：阿米卡星（AMK）✓、妥布霉素（TOB）✓、奈替米星 ✓、庆大霉素（GEN）弱/不修饰
• **药敏特征：AMK R + GEN S → AAC(6\') 的经典模式**
• 在黏质沙雷菌中尤其常见（AMK R + GEN S 是其特征表型）
• 在 KP 和其他肠杆菌中也存在

**AAC(6\')-Ib-cr 的特殊性（双重耐药）：**
• aac(6\')-Ib-cr 是 aac(6\')-Ib 的点突变变体
• 具有双功能：既可乙酰化氨基糖苷类（AMK），也可乙酰化环丙沙星（CIP）
• CIP R + AMK R + GEN S → 高度提示 aac(6\')-Ib-cr

**与 16S-RMTase 的鉴别：**
• 16S-RMTase：AMK R + GEN R + TOB R（所有氨基糖苷均耐药）
• AAC(6\')：AMK R + GEN S/I + TOB 可能 R（庆大霉素常保留活性）
• 这是药敏报告上区分两种机制的最简单方法`,

    differentiation: {
      'vs_16SRMTase': '16S-RMTase：所有氨基糖苷类均耐药（AMK R + GEN R + TOB R）。AAC(6\')：庆大霉素常保留敏感（AMK R + GEN S）。这是两者的核心药敏鉴别点。',
      'vs_aph_ant': '其他 AMEs（APH(3\')、ANT(2\")）：通常对 GEN 和 TOB 耐药，但对 AMK 可能敏感（AMK 不受大多数 AME 影响）。AMK R 但 GEN S 是 AAC(6\') 的独有特征。',
      'vs_efflux': '外排泵导致的氨基糖苷耐药通常水平较低且影响多种药物。AAC(6\') 导致明确的高水平 AMK 耐药。',
    },

    clinicalNote: 'AAC(6\')-I 阳性菌株：阿米卡星和妥布霉素均无效。庆大霉素如体外敏感可考虑使用，但需注意 MIC 值（可能接近折点）。aac(6\')-Ib-cr 阳性菌株同时需避开环丙沙星。',
    references: ['胡付品等,《细菌药物敏感性试验执行标准和典型报告解读》第二版, Sma Case 21 (黏质沙雷菌 AAC(6\') 特征)', 'PMID: 16436724 (AAC(6\')-Ib-cr dual function)', 'PMID: 12760834 (AME review)'],
    createdBy: '基于胡付品主编《细菌药物敏感性试验执行标准和典型报告解读》第二版 Sma Case 21',
  },

  // ============================================================
  // === 铜绿假单胞菌 (Pseudomonas aeruginosa, PA) ===
  // ============================================================

  {
    id: 'PA-OprD-porin-loss',
    bacteria: 'PA',
    label: 'OprD2 孔蛋白丢失 (碳青霉烯耐药，尤其亚胺培南)',
    category: '碳青霉烯耐药 / 孔蛋白丢失',
    gene: 'oprD (编码 OprD2 外膜孔蛋白) 基因突变/缺失',
    priority: 100,

    pattern: {
      allOf: ['IPM:R'],
      atLeastN: [0, []],
      noneOf: [],
      supporting: ['MEM:S', 'MEM:I'],
      flags: ['亚胺培南耐药 + 美罗培南敏感/中介 → OprD 丢失的特征', 'OprD 是亚胺培南进入 PA 的专属通道', '美罗培南可通过其他孔蛋白进入 → 常保留活性', 'OprD 丢失本身仅导致低水平耐药，需合并其他机制']
    },

    summary: 'OprD2 是铜绿假单胞菌外膜上亚胺培南进入菌体的特异性孔蛋白通道。oprD 基因突变/缺失导致 OprD2 蛋白丢失 → 亚胺培南无法进入菌体 → IPM 耐药。美罗培南、头孢他啶和头孢吡肟不受 OprD2 通道限制，仍可通过其他通道进入 → 保持敏感。IPM R + MEM S + CAZ S + FEP S 是 OprD2 丢失的经典表型（书本 Case 31）。',

    interpretation: `**耐药原因：**
OprD2 膜孔蛋白为亚胺培南进入铜绿假单胞菌细胞内的**特异性通道**。oprD 基因突变或缺失 → OprD2 蛋白丢失 → 亚胺培南无法通过外膜进入菌体 → IPM 耐药。美罗培南、头孢他啶和头孢吡肟等药物**不受 OprD2 通道限制**，仍可通过其他孔蛋白通道进入细胞内发挥杀菌作用 → 保持敏感。

**IPM vs MEM 耐药机制的根本区别（基于书本 Case 31-34）：**
| 特征 | 亚胺培南 (IPM) | 美罗培南 (MEM) |
|---|---|---|
| 进入通道 | **OprD2 特异性通道** | 多种孔蛋白通道 |
| OprD2 丢失影响 | **IPM R** | MEM 仍 S |
| MexAB 外排泵影响 | IPM **不是** MexAB 底物 | MEM **是** MexAB 底物 |
| IMP 型 MBL 影响 | 可仍为 **S** (IMP 特殊) | 通常 R |

**四种碳青霉烯耐药表型（书本验证）：**
| 表型 | 机制 | 书本案例 |
|---|---|---|
| IPM R + MEM S + CAZ S + FEP S | **OprD2 丢失** | Case 31 |
| IPM R + MEM R + CAZ S + FEP S | OprD2 丢失 + **外排泵高表达** | Case 32 |
| IPM S + MEM R + CAZ R + FEP R | **外排泵高表达**（IPM 非 MexAB 底物） | Case 33 |
| IPM S + MEM R + CAZ R + CZA R + ATM S | **IMP 型 MBL**（PA 中 IMP 可 IPM S!） | Case 34 |

**IPM vs MEM 耐药机制的根本区别：**
| 特征 | 亚胺培南 (IPM) | 美罗培南 (MEM) |
|---|---|---|
| 进入通道 | 几乎完全依赖 OprD | OprD + 其他孔蛋白 |
| OprD 丢失影响 | **IPM R** | MEM 仍可能 S |
| MexAB 外排泵影响 | IPM **不是** MexAB 底物 | MEM **是** MexAB 底物 |
| 获得性 MBL 影响 | 高度水解 | 高度水解 |

**四种碳青霉烯耐药表型及其机制：**
① IPM R + MEM S → **OprD 丢失**（最常见，中国 PA 耐药的主要模式）
② IPM S + MEM R → 罕见（可能 MexAB 单独过表达，因 IPM 不被 MexAB 排出）
③ IPM R + MEM R → OprD 丢失 + MexAB 过表达（DTR-PA），或获得性 MBL（MIC 极高 >32）
④ IPM S + MEM S → 敏感株，或仅 AmpC 去阻遏（头孢菌素 R 但碳青霉烯 S）

**中国流行病学（Qin 2024, CHINET + Luo 2024, ESKAPE in China）：**
• CRPA 检出率呈**下降**趋势（2005→2022）—— 中国碳青霉烯管理政策取得了成效
• 中国 PA 碳青霉烯耐药以染色体机制（OprD + AmpC + 外排泵）为主
• 获得性碳青霉烯酶（IMP/VIM）在 PA 中检出率相对较低（<10%）
• 这与 KP（碳青霉烯酶为主，耐药率持续上升）形成鲜明对比
• DTR-PA（碳青霉烯 R + 头孢菌素 R + 喹诺酮 R）的检出率也呈下降趋势`,

    differentiation: {
      'vs_MexAB_efflux': 'OprD 丢失：IPM R + MEM S/I（IPM 选择性耐药）。MexAB 过表达：MEM R + CAZ R + CIP R（多药），且 IPM 不受 MexAB 影响。IPM R + MEM R → 两者并存或 MBL。',
      'vs_MBL_acquisition': '获得性 MBL：碳青霉烯 MIC >32 μg/mL，CZA 必然 R，ATM S。OprD 丢失：碳青霉烯 MIC 8-16，CZA 可能 S。mCIM/eCIM 可辅助区分。',
      'vs_AmpC_derepression': 'AmpC 去阻遏：头孢菌素 R + 碳青霉烯 S。OprD 丢失：IPM R + 头孢菌素可仍 S。两者合并 → DTR-PA。',
    },

    differentiation: {
      'vs_MexAB_efflux': 'OprD 丢失：IPM R + MEM S/I（选择性影响亚胺培南）。MexAB 过表达：IPM R + MEM R + 其他 β-内酰胺类也 R（多药耐药）。两者常共存。',
      'vs_AmpC_derepression': 'AmpC 去阻遏：头孢他啶 R + 头孢吡肟 R + 酶抑制剂复合物 R。不影响碳青霉烯类（除非合并 OprD 丢失）。',
      'vs_MBL': '获得性 MBL（VIM/IMP）：碳青霉烯全部高度耐药 + CZA R。OprD 丢失：碳青霉烯 MIC 中度升高（8-16），CZA 通常敏感。',
    },

    clinicalNote: 'OprD 丢失菌株：亚胺培南无效，但美罗培南如体外敏感可考虑使用（需关注 MIC）。如果 MEM 也 R，需考虑合并外排泵过表达或获得性碳青霉烯酶。',
    references: ['Giovagnorio 2023, Antibiotics 12:1621 (PA 耐药综述)', 'Quale 2006, AAC 50:1633-1641 (OprD+AmpC+外排泵交互)', 'IDSA 2023 DTR-PA 指南', 'CLSI M100 Ed35'],
    createdBy: '基于 Giovagnorio 2023 PA 综述 + IDSA DTR-PA 指南 + Quale 2006',
  },

  {
    id: 'PA-MexAB-efflux',
    bacteria: 'PA',
    label: 'MexAB-OprM 外排泵过表达 (多药耐药)',
    category: '外排泵耐药 / RND 家族',
    gene: 'mexAB-oprM 过表达 (调控基因 nalC/nalD/mexR 突变)',
    priority: 95,

    pattern: {
      allOf: [],
      atLeastN: [2, ['MEM:R', 'CAZ:R', 'FEP:R', 'TZP:R']],
      noneOf: [],
      supporting: ['IPM:R', 'CIP:R', 'LVX:R'],
      flags: ['多药耐药表型: β-内酰胺+喹诺酮同时耐药', '美罗培南和头孢他啶均受影响', 'MexAB-OprM 是 PA 最重要的外排泵', 'nalC/nalD/mexR 调控突变 → 外排泵过表达']
    },

    summary: 'MexAB-OprM 是铜绿假单胞菌最重要的 RND 型外排泵，其过表达可排出多种结构无关的抗生素（美罗培南、头孢他啶、哌拉西林-他唑巴坦、氟喹诺酮类），是 PA 多药耐药的主要驱动力。',

    interpretation: `**耐药原因：**
MexAB-OprM 是组成型表达的外排泵，正常情况下受局部阻抑物 MexR、NalC、NalD 的负调控。当这些调控基因发生突变时，外排泵失去抑制 → 过表达 → 多药排出 → MDR。

**外排底物谱（MexAB-OprM 过表达时耐药的药物）：**
• β-内酰胺类：美罗培南、头孢他啶、头孢吡肟、哌拉西林-他唑巴坦（亚胺培南不受 MexAB 影响）
• 氟喹诺酮类：环丙沙星、左氧氟沙星
• 其他：氯霉素、四环素、新生霉素

**药敏特征：**
• MEM R + CAZ R + CIP R → 高度提示 MexAB 过表达
• 亚胺培南可能仍敏感（IPM 不是 MexAB 的底物）→ 但常合并 OprD 丢失
• 是 PA "DTR"（难治性耐药）表型的主要贡献者

**有别于 KP：**
• KP 主要外排泵：AcrAB-TolC（底物谱与 MexAB 有重叠但不完全相同）
• PA 的外排泵系统更复杂：MexAB-OprM, MexCD-OprJ, MexEF-OprN, MexXY-OprM（共 4 个主要家族）`,
    differentiation: {
      'vs_OprD_loss': 'MexAB 过表达：MEM R + CAZ R + CIP R（多药）。OprD 丢失：IPM R + MEM S（选择性）。两者可共存。',
      'vs_MBL': '获得性 MBL：碳青霉烯 MIC 极高（>32） + CZA R。MexAB：MEM MIC 中度升高（4-8），CZA 可能仍敏感。',
    },

    clinicalNote: 'MexAB 过表达菌株：几乎所有常用 β-内酰胺类和氟喹诺酮类均受影响。治疗选择：头孢地尔（cefiderocol）、多黏菌素、或新型 β-内酰胺/酶抑制剂组合（需先确认无 MBL）。',
    references: ['Giovagnorio 2023, Antibiotics 12:1621', 'Quale 2006, AAC 50:1633-1641', 'IDSA 2023 DTR-PA 指南'],
    createdBy: '基于 Giovagnorio 2023 PA 综述 + IDSA DTR-PA 指南',
  },

  // ============================================================
  // === 鲍曼不动杆菌 (Acinetobacter baumannii, AB) ===
  // ============================================================

  {
    id: 'AB-OXA23-carbapenemase',
    bacteria: 'AB',
    label: 'OXA-23 碳青霉烯酶 (鲍曼不动杆菌最主要机制)',
    category: '碳青霉烯酶 / Class D (OXA 家族)',
    gene: 'bla_OXA-23 (质粒或染色体, Tn2006/Tn2007 转座子)',
    priority: 100,

    pattern: {
      allOf: ['IPM:R', 'MEM:R'],
      atLeastN: [1, ['CAZ:R', 'FEP:R', 'TZP:R']],
      noneOf: [],
      supporting: ['CIP:R', 'SXT:R'],
      flags: ['鲍曼不动杆菌碳青霉烯耐药最常见机制', 'OXA-23 是中国 CRAB 的主力 (>80%)', '通常表现为所有 β-内酰胺均耐药', '舒巴坦可能保留部分活性 (OXA 对舒巴坦敏感性不一)']
    },

    summary: 'OXA-23 是鲍曼不动杆菌中最主要的获得性碳青霉烯酶（中国 CRAB 中 >80% 携带），属于 Class D β-内酰胺酶。与染色体 OXA-51-like 不同，OXA-23 通常伴随上游插入序列 ISAbal 强启动子 → 高效表达 → 碳青霉烯明确耐药。',

    interpretation: `**耐药原因：**
OXA-23 是 Class D 丝氨酸β-内酰胺酶，可水解碳青霉烯类。bla_OXA-23 通常位于 Tn2006 或 Tn2007 转座子上，可通过质粒或染色体传播。当伴随 ISAbal（鲍曼不动杆菌特有的强启动子插入序列）时，OXA-23 表达量极大升高 → 碳青霉烯耐药。

**与 KP 的 OXA 对比：**
• KP 的 OXA-48-like：弱碳青霉烯酶，常仅 ETP R
• AB 的 OXA-23：强碳青霉烯酶，所有碳青霉烯明确 R

**鲍曼不动杆菌碳青霉烯酶家族：**
• OXA-23-like：全球最流行（中国 >80%）
• OXA-24/40-like：南欧/美国
• OXA-58-like：欧洲部分地区
• OXA-51-like：染色体天然携带（低表达时不足以导致耐药，ISAbal 插入 → 高表达 → 可单独致碳青霉烯耐药）

**药敏特征：**
• 碳青霉烯全部 R（IPM R + MEM R）
• 所有 β-内酰胺类通常均 R（外加外排泵 + 低通透性）
• 舒巴坦可能保留部分活性（OXA 对舒巴坦的敏感性高于其他酶抑制剂）→ CSL 或氨苄西林-舒巴坦可能 S 或 I`,
    differentiation: {
      'vs_OXA51': 'OXA-51-like：染色体天然携带。仅 ISAbal 插入导致的过表达才会致碳青霉烯耐药。OXA-23：获得性，明确碳青霉烯酶。两者需分子检测区分。',
      'vs_MBL': 'AB 中 MBL（NDM/IMP/VIM）相对少见。ATM 敏感性：OXA S（OXA 不水解 ATM），MBL S（MBL 不水解 ATM）。两者均使 CZA 耐药。',
    },

    clinicalNote: 'OXA-23 产 CRAB：碳青霉烯类无效。治疗选择：舒巴坦制剂（CSL/氨苄西林-舒巴坦，大剂量）、多黏菌素、替加环素（高剂量）、头孢地尔。新型药 sulbactam-durlobactam 针对 AB 的 OXA 酶设计。',
    references: ['Wong 2017, Clin Microbiol Rev 30:409 (AB 综述)', 'Shi 2024, Front Microbiol 15:1332108 (AB 耐药综述)', 'IDSA 2023 CRAB 指南'],
    createdBy: '基于 Wong 2017 CMR + Shi 2024 Front Microbiol AB 综述 + IDSA CRAB 指南',
  },

  {
    id: 'AB-colistin-lpx',
    bacteria: 'AB',
    label: '多黏菌素耐药 (lpxA/lpxC/lpxD 突变, LPS 缺失)',
    category: '多黏菌素耐药 / 脂质 A 合成缺失',
    gene: 'lpxA / lpxC / lpxD 突变 → 脂质 A 合成缺失',
    priority: 90,

    pattern: {
      allOf: ['CST:R'],
      atLeastN: [0, []],
      noneOf: [],
      supporting: [],
      flags: ['鲍曼不动杆菌多黏菌素耐药', 'lpx 突变 → LPS 完全缺失 (有别于 KP 的 mgrB 修饰)', '常伴有体外生长缓慢 (适应性代价)', '多黏菌素 E 和 B 等效']
    },

    summary: '鲍曼不动杆菌对多黏菌素耐药的主要机制是脂质 A 合成途径基因（lpxA/lpxC/lpxD）的失活突变，导致 LPS 完全缺失 — 多黏菌素失去结合靶位。这与 KP 的 mgrB 介导的脂质 A 修饰（非缺失）机制本质不同。',

    interpretation: `**耐药原因：**
• lpxA、lpxC、lpxD 编码脂质 A 合成的关键酶
• 任一基因失活 → 脂质 A 无法合成 → LPS 缺失
• 多黏菌素通过结合脂质 A 发挥作用 → 无脂质 A = 天然耐药

**与 KP 多黏菌素耐药机制的对比（重要！）：**
| 特征 | KP (mgrB) | AB (lpx) |
|---|---|---|
| 靶位改变方式 | 脂质 A 修饰 (L-Ara4N 添加) | 脂质 A 完全缺失 |
| LPS 状态 | LPS 仍存在（电荷改变） | LPS 完全缺失 |
| 适应性代价 | 低 | 高（生长缓慢） |
| 可逆性 | 可能有 | 不可逆 |
| 传播性 | 染色体 + mcr 质粒 | 染色体 |

**临床意义：**
• lpx 突变菌株常在多黏菌素治疗压力下被筛选出来
• 因适应性代价，停药后可能被野生型取代
• 多黏菌素 E 和 B 存在交叉耐药（靶位相同）`,
    differentiation: {
      'vs_KP_mgrB': 'KP：mgrB 失活 → L-Ara4N 修饰脂质 A（LPS 仍存在，仅电荷改变）。AB：lpx 突变 → LPS 完全缺失。表型无法区分，但 LPS 缺失使 AB 对其他抗生素更敏感（外膜屏障消失）。',
    },

    clinicalNote: 'lpx 突变导致的 CRAB 多黏菌素耐药 → 多黏菌素完全无效。治疗选择极度有限：大剂量舒巴坦 + 替加环素联合，或头孢地尔。',
    references: ['Novović 2023, Antibiotics 12:516 (AB 多黏菌素耐药综述)', 'Nhu 2016, Sci Rep 6:28291 (lpx 突变诱导与鉴定)', 'IDSA 2023 CRAB 指南'],
    createdBy: '基于 Novović 2023 + Nhu 2016 + IDSA CRAB 指南',
  },

  // ============================================================
  // [PA] AmpC (PDC) 去阻遏 — 来源: Elfadadny 2024 + López-Causapé 2018
  // ============================================================

  {
    id: 'PA-AmpC-PDC-derepression',
    bacteria: 'PA',
    label: '染色体 AmpC (PDC) 去阻遏 (头孢菌素耐药核心)',
    category: '染色体β-内酰胺酶 / AmpC (Pseudomonas Derived Cephalosporinase)',
    gene: 'ampC (PDC, >500 变体, 包括 ESBL 样突变体)',
    priority: 98,

    pattern: {
      allOf: [],
      atLeastN: [1, ['CAZ:R', 'FEP:R']],
      noneOf: [],
      supporting: ['TZP:R', 'CSL:R', 'IPM:S', 'MEM:S'],
      flags: ['头孢他啶和/或头孢吡肟耐药', '酶抑制剂复合物可能耐药', '碳青霉烯可能仍敏感 (除非合并 OprD 丢失)', 'PDC 变体 >500 种', 'ampC 上游 ampR 调控突变→去阻遏', 'D135N/R154H 突变→ESBL 样 PDC']
    },

    summary: '铜绿假单胞菌染色体携带 ampC 基因（编码 PDC — Pseudomonas Derived Cephalosporinase）。正常情况下 AmpC 低水平表达，但当调控基因 ampR 发生突变（去阻遏）时，AmpC 持续高表达 → 头孢他啶、头孢吡肟和酶抑制剂复合物耐药。部分 PDC 变体（如 D135N、R154H 突变）获得了 ESBL 样活性，可水解头孢吡肟和头孢他啶-阿维巴坦。',

    interpretation: `**耐药原因：**
铜绿假单胞菌染色体 ampC 基因编码 PDC（Pseudomonas Derived Cephalosporinase），属于 Class C β-内酰胺酶。表达受 ampR 调控基因控制：
• 正常状态：AmpC 低水平表达（基础水平）
• ampR 突变（去阻遏）：AmpC 持续高表达 → 头孢菌素耐药

**PDC 的独特性（有别于肠杆菌 AmpC）：**
• 已鉴定 >500 种 PDC 变体（远超肠杆菌 AmpC 的多样性）
• 部分 PDC 获得 ESBL 样突变（如 D135N、R154H）→ 可水解头孢吡肟
• 某些 PDC 变体可抵抗阿维巴坦抑制 → CZA 耐药
• PDC 不能水解碳青霉烯类（区别于碳青霉烯酶）

**药敏分级：**
• AmpC 基础表达 → 仅哌拉西林耐药
• AmpC 部分去阻遏 → 头孢他啶 R/TZP R，头孢吡肟 S
• AmpC 完全去阻遏 + ESBL 样 PDC → 所有头孢菌素 R（含 FEP）+ CZA 可能 R
• AmpC 去阻遏 + OprD 丢失 → 碳青霉烯 R（DTR-PA）`,

    differentiation: {
      'vs_OprD_loss': 'AmpC 去阻遏：头孢菌素 R + 碳青霉烯 S。OprD 丢失：IPM R + MEM S + 头孢菌素可仍 S。两者合并 → DTR-PA。',
      'vs_MBL_acquisition': '获得性 MBL：碳青霉烯 MIC 极高 + CZA 必然 R。AmpC：碳青霉烯通常 S（除非合并 OprD 丢失），CZA 可能 S 或 R（取决于 PDC 变体类型）。',
      'vs_MexAB_efflux': 'MexAB 过表达：MEM R + 喹诺酮 R。AmpC：喹诺酮可能仍 S。两者常共存。',
    },

    clinicalNote: 'AmpC 去阻遏：头孢他啶和头孢吡肟无效。碳青霉烯类如体外敏感仍可考虑（需关注是否合并 OprD 丢失）。头孢他啶-阿维巴坦对部分 PDC 变体无效（ESBL 样 PDC），需检测 CZA MIC。新型药头孢洛扎-他唑巴坦（C/T）对抗 AmpC 去阻遏菌株效果优于 CZA。',
    references: ['Elfadadny 2024, Front Microbiol 15:1374466 (PA 耐药综述)', 'López-Causapé 2018, Front Microbiol 9:685 (PA 突变耐药组)', 'Glen 2021, Pathogens 10:1638 (PA β-内酰胺耐药)'],
    createdBy: '基于 Elfadadny 2024 + López-Causapé 2018 PA 综述',
  },

  // ============================================================
  // [PA] 获得性 MBL (VIM/IMP) — 来源: Yoon 2021 + Elfadadny 2024
  // ============================================================

  {
    id: 'PA-VIM-IMP-MBL',
    bacteria: 'PA',
    label: '获得性 MBL (VIM/IMP 型金属β-内酰胺酶)',
    category: '碳青霉烯酶 / Class B 金属酶 (MBL), 获得性',
    gene: 'bla_VIM / bla_IMP (class 1 整合子基因盒)',
    priority: 96,

    pattern: {
      allOf: ['IPM:R', 'MEM:R', 'ATM:S'],
      atLeastN: [1, ['CAZ:R', 'FEP:R']],
      noneOf: ['CZA:S'],
      supporting: ['CZA:R', 'TZP:R', 'CSL:R'],
      flags: ['碳青霉烯高度耐药 (IPM+MEM 均 R)', '氨曲南敏感 (MBL 不水解单环内酰胺)', 'CZA 必然耐药', 'VIM 全球最常见 PA 获得性碳青霉烯酶', 'IMP 在亚洲 (日本/中国) 常见', 'class 1 整合子携带→质粒或染色体']
    },

    summary: '铜绿假单胞菌可通过水平基因转移获得碳青霉烯酶基因，VIM 和 IMP 型 MBL 是最常见的获得性碳青霉烯酶。VIM 全球分布最广，IMP 在亚洲（日本、中国）常见。与染色体耐药机制（OprD+AmpC+外排泵）不同，获得性 MBL 导致极高水平的碳青霉烯耐药（MIC >32 μg/mL）。',

    interpretation: `**耐药原因：**
获得性 MBL 基因通过 mobile genetic elements（class 1 整合子、转座子、质粒）水平传播至 PA。VIM（Verona Integron-encoded MBL）和 IMP（Imipenemase）是最常见的两种。

**全球流行特征（Yoon 2021 综述）：**
• VIM：全球最常见 PA 获得性碳青霉烯酶，南欧（意大利、希腊）高流行
• IMP：日本（1992 年首次在 PA 中发现）、中国、澳大利亚
• NDM：PA 中相对少见（NDM 主要在肠杆菌中流行）
• KPC：PA 中罕见但已有报道（哥伦比亚、巴西）
• GES-5：Class A 碳青霉烯酶，在 PA 中有报道

**获得性 MBL vs. 染色体耐药（PA 碳青霉烯耐药的两种路径）：**
| 特征 | 染色体耐药 (OprD+AmpC+Mex) | 获得性 MBL (VIM/IMP) |
|---|---|---|
| MIC 水平 | 中度 (IPM 8-16) | 极高 (>32) |
| MEM | 可能 S | 必然 R |
| CZA | 可能 S | 必然 R |
| ATM | 可能 S/I | **S (MBL 不水解)** |
| 传播性 | 非传播 | 水平传播 |
| DTR 定义 | 可能符合 | 一定符合 |`,

    differentiation: {
      'vs_OprD_loss': 'OprD 丢失：IPM R + MEM S/I + CZA 可能 S。MBL：IPM R + MEM R + CZA R + ATM S。碳青霉烯 MIC 水平是关键鉴别点。',
      'vs_PDC_ESBL': 'PDC ESBL 样突变：头孢菌素 R + CZA 可能 R，但碳青霉烯常 S。MBL：碳青霉烯明确 R + CZA R + ATM S。',
    },

    clinicalNote: 'VIM/IMP 产 PA → DTR-PA（难治性耐药）。治疗选择：头孢地尔（cefiderocol）、多黏菌素、或氨曲南/阿维巴坦联合（ATM 不被 MBL 水解 + AVI 抑制可能共存的 PDC）。新型药头孢洛扎-他唑巴坦对 MBL 无效。',
    references: ['Yoon 2021, Front Microbiol 12:614058 (PA 移动碳青霉烯酶基因)', 'Elfadadny 2024, Front Microbiol 15:1374466 (PA AMR 综述)', 'IDSA 2023 DTR-PA 指南'],
    createdBy: '基于 Yoon 2021 + Elfadadny 2024 PA 碳青霉烯酶综述',
  },

  // ============================================================
  // [PA] MexXY-OprM + 氨基糖苷耐药 — 来源: López-Causapé 2018
  // ============================================================

  {
    id: 'PA-MexXY-aminoglycoside',
    bacteria: 'PA',
    label: 'MexXY-OprM 外排泵过表达 (氨基糖苷/头孢吡肟耐药)',
    category: '外排泵耐药 / RND 家族 + 氨基糖苷类',
    gene: 'mexXY-oprM 过表达 (调控基因 mexZ 突变)',
    priority: 92,

    pattern: {
      allOf: [],
      atLeastN: [1, ['AMK:R', 'TOB:R', 'FEP:R']],
      noneOf: [],
      supporting: ['GEN:R', 'CIP:S'],
      flags: ['氨基糖苷类耐药 (尤其 AMK/TOB) + 头孢吡肟 R', 'MexXY-OprM 是 PA 排出氨基糖苷的主要泵', 'mexZ 调控突变→外排泵过表达', '常与 MexAB 过表达共存→多药耐药']
    },

    summary: 'MexXY-OprM 是铜绿假单胞菌中专一排出氨基糖苷类和头孢吡肟的 RND 型外排泵。mexZ 调控基因突变导致过表达时，阿米卡星、妥布霉素和头孢吡肟耐药。MexXY 是临床 PA 氨基糖苷耐药最常见的机制。',

    interpretation: `**耐药原因：**
• MexXY-OprM 的底物谱比其他 PA 外排泵窄，但临床意义极大
• 主要排出：氨基糖苷类（AMK、TOB、GEN）+ 头孢吡肟（FEP）
• 受局部阻抑物 MexZ 负调控 → mexZ 突变 → MexXY 过表达 → 耐药

**PA 四个主要外排泵对比：**
| 外排泵 | 主要底物 | 调控基因 |
|---|---|---|
| **MexAB-OprM** | β-内酰胺类 (MEM, CAZ, TZP) + 喹诺酮 | nalC/nalD/mexR |
| **MexXY-OprM** | 氨基糖苷类 (AMK, TOB) + FEP | mexZ |
| MexCD-OprJ | 头孢吡肟 + 喹诺酮 | nfxB |
| MexEF-OprN | 喹诺酮 + 氯霉素 | mexT |

**药敏线索：**
• AMK R + TOB R + FEP R → MexXY 过表达
• MexAB 过表达可同时存在 → MEM R + CAZ R + CIP R
• MexXY 底物不包括碳青霉烯类 → IPM/MEM 可能 S`,

    differentiation: {
      'vs_16SRMTase': '16S-RMTase（PA 中少见）：所有氨基糖苷均 R，包括 plazomicin。MexXY：plazomicin 通常 S（plazomicin 不是 MexXY 底物）。',
      'vs_AAC6': 'AAC(6\')-I：AMK R + GEN S + TOB 可能 R。MexXY：AMK R + GEN 常 R + TOB R。两者均致 FEP 可能 R（MexXY 排 FEP，AAC 不涉及 FEP）。',
    },

    clinicalNote: 'MexXY 过表达导致的氨基糖苷耐药：AMK、TOB、GEN 均无效。Plazomicin（新型氨基糖苷，不被 MexXY 排出）如可用可考虑。头孢吡肟也受影响，需根据药敏选择替代方案。',
    references: ['López-Causapé 2018, Front Microbiol 9:685 (PA 突变耐药组)', 'Elfadadny 2024, Front Microbiol 15:1374466'],
    createdBy: '基于 López-Causapé 2018 PA 突变耐药组综述',
  },

  // ============================================================
  // [AB] AdeABC 外排泵 — 来源: Lee 2017 + Kyriakidis 2021
  // ============================================================

  {
    id: 'AB-AdeABC-efflux',
    bacteria: 'AB',
    label: 'AdeABC 外排泵过表达 (鲍曼多药耐药核心)',
    category: '外排泵耐药 / RND 家族',
    gene: 'adeABC 过表达 (adeRS 双组分调控突变 / adeN 失活)',
    priority: 95,

    pattern: {
      allOf: [],
      atLeastN: [2, ['MEM:R', 'CIP:R', 'FEP:R']],
      noneOf: [],
      supporting: ['TZP:R', 'SXT:R', 'IPM:R'],
      flags: ['MDR 最主要驱动力', 'AdeABC 是 RND 型三组分外排泵', 'adeRS/adeN 调控突变→过表达', '替加环素常保留活性 (非 AdeABC 主要底物)']
    },

    summary: 'AdeABC 是鲍曼不动杆菌最重要的 RND 型外排泵，过表达时可排出碳青霉烯类、头孢菌素类、氟喹诺酮类等多种抗生素，是 CRAB 多药耐药的核心机制。与染色体 OXA-51-like 和外膜低通透性（仅为大肠杆菌 1-3%）共同构成了 AB 的天然多药耐药基础。',

    interpretation: `**耐药原因：**
AdeABC 由 adeA、adeB、adeC 三组分组成。受 adeRS 双组分系统调控：adeS 突变 → AdeR 磷酸化 → adeABC 转录激活 → 过表达。底物谱覆盖碳青霉烯类、头孢菌素类、氟喹诺酮类。替加环素非主要底物。

**中国 CRAB 耐药层级（Luo 2024, ESKAPE in China）：**
1. OXA-23 获得（>80% CRAB）
2. AdeABC 外排泵过表达（MDR 核心）
3. ISAbal 驱动 OXA-51 过表达（染色体介导）
4. 外膜通透性极低（大肠杆菌的 1-3%）`,

    differentiation: {
      'vs_OXA23': 'OXA-23：碳青霉烯酶。AdeABC：外排泵→碳青霉烯 R + 喹诺酮 R。两者常共存→XDR。',
    },

    clinicalNote: 'AdeABC 过表达→MDR/XDR。舒巴坦制剂可能有效（AdeABC 对其排出效率低）、替加环素、多黏菌素、头孢地尔。',
    references: ['Lee 2017, Front Cell Infect Microbiol 7:55 (AB 生物学)', 'Kyriakidis 2021, Pathogens 10:373 (AB 耐药机制)', 'Luo 2024 (ESKAPE in China)'],
    createdBy: '基于 Lee 2017 + Kyriakidis 2021 AB 综述 + Luo 2024 中国 ESKAPE',
  },

  // ============================================================
  // [AB] ISAbal-OXA-51 过表达 — 染色体碳青霉烯耐药
  // ============================================================

  {
    id: 'AB-ISAba1-OXA51',
    bacteria: 'AB',
    label: 'ISAbal 介导 OXA-51 过表达 (染色体碳青霉烯耐药)',
    category: '碳青霉烯酶 / Class D (OXA-51 家族, 染色体固有)',
    gene: 'bla_OXA-51-like + ISAbal 上游插入 (强启动子)',
    priority: 92,

    pattern: {
      allOf: ['IPM:R', 'MEM:R'],
      atLeastN: [0, []],
      noneOf: [],
      supporting: ['CZA:R'],
      flags: ['天然携带 OXA-51-like', 'ISAbal 插入→过表达→碳青霉烯 R', '无需获得外源基因即可成为 CRAB', 'ISAbal 是 AB 特有诊断标志']
    },

    summary: '鲍曼不动杆菌染色体天然携带 bla_OXA-51-like。正常低表达不足以导致碳青霉烯耐药，但 ISAbal（AB 特有插入序列）插入上游 → 强启动子驱动 → OXA-51 过表达 → 染色体介导碳青霉烯耐药。这是 AB 独有的不依赖外源基因即可成为 CRAB 的机制。',

    interpretation: `**耐药原因：**
bla_OXA-51-like 是所有 AB 染色体上的固有基因。ISAbal 插入上游提供强启动子 → 高效表达。OXA-51 过表达水解碳青霉烯 → IPM R + MEM R。

**OXA-51+ISAbal vs OXA-23 获得：**
OXA-51：染色体固有+ISAbal→MIC 8-16。OXA-23：获得性质粒/转座子→MIC 16-64。临床处置相同。`,

    differentiation: {
      'vs_OXA23': 'OXA-51+ISAbal：染色体固有，MIC 中度 (8-16)。OXA-23：获得性，MIC 高 (16-64)。分子检测区分。两者常共存。',
    },

    clinicalNote: 'ISAbal 检测是判断染色体 OXA-51 是否参与碳青霉烯耐药的分子标志。处置同 CRAB：舒巴坦/多黏菌素/替加环素/头孢地尔。',
    references: ['Lee 2017, Front Cell Infect Microbiol 7:55', 'Kyriakidis 2021, Pathogens 10:373', 'Wong 2017, CMR 30:409'],
    createdBy: '基于 Lee 2017 + Kyriakidis 2021 + Wong 2017 AB 综述',
  },

  // ============================================================
  // 流感嗜血杆菌 (Haemophilus influenzae, Hin)
  // ============================================================

  {
    id: 'Hin-BSBL-TEM-ROB',
    bacteria: 'Hin',
    label: '流感嗜血杆菌 β-内酰胺酶 (TEM-1 / ROB-1)',
    category: '广谱β-内酰胺酶 / Class A',
    gene: 'bla_TEM-1 / bla_ROB-1 (质粒介导)',
    priority: 100,

    pattern: {
      allOf: ['AMP:R'],
      atLeastN: [0, []],
      noneOf: [],
      supporting: ['SAM:S', 'AMC:S', 'CRO:S', 'CXM:S', 'MEM:S'],
      flags: ['流感嗜血杆菌 H. influenzae', 'β-内酰胺酶阳性=AMP R', 'β-内酰胺酶阴性=AMP S', '酶抑制剂复合物恢复敏感']
    },

    summary: '流感嗜血杆菌对氨苄西林的耐药主要由质粒介导的 TEM-1 或 ROB-1 型 β-内酰胺酶引起。该酶可被克拉维酸、舒巴坦抑制。β-内酰胺酶阴性菌株对氨苄西林天然敏感——这是 Hin 与 KP/PA/AB 的最根本区别（后三者对氨苄西林天然耐药）。',

    interpretation: `**耐药原因：**
流感嗜血杆菌主要通过获得质粒编码的 TEM-1 或 ROB-1 β-内酰胺酶对氨苄西林耐药。该酶属 Class A 广谱酶，可水解氨苄西林和阿莫西林，但**不能水解头孢菌素**。活性可被克拉维酸、舒巴坦完全抑制。

**与 KP 天然耐药的对比（重要！）：**
KP 对氨苄西林天然耐药（染色体 SHV-1）。Hin 对 AMP 无天然耐药——β-内酰胺酶阴性 Hin 对 AMP 天然敏感。这是两者的根本区别。`,

    differentiation: {
      'vs_BL_negative': 'β-内酰胺酶阴性：AMP S。β-内酰胺酶阳性（TEM/ROB）：AMP R + AMC/SAM S。',
    },

    clinicalNote: 'β-内酰胺酶阴性 Hin：氨苄西林/阿莫西林可用。β-内酰胺酶阳性：首选阿莫西林-克拉维酸或头孢菌素。',
    references: ['胡付品等《细菌药物敏感性试验执行标准和典型报告解读》第二版, Hin Case 35-39', 'CLSI M100 Ed35'],
    createdBy: '基于胡付品主编《细菌药物敏感性试验执行标准和典型报告解读》第二版 Hin 案例',
  },

  // ============================================================
  // 卡他莫拉菌 (Moraxella catarrhalis, cat)
  // ============================================================

  {
    id: 'Cat-BRO-beta-lactamase',
    bacteria: 'Cat',
    label: '卡他莫拉菌 BRO β-内酰胺酶 (95% 菌株阳性)',
    category: '窄谱β-内酰胺酶 / BRO-1/BRO-2',
    gene: 'bla_BRO-1 / bla_BRO-2 (染色体或质粒, 脂蛋白)',
    priority: 100,

    pattern: {
      allOf: ['AMX:R'],
      atLeastN: [0, []],
      noneOf: [],
      supporting: ['AMC:S', 'CXM:S', 'CRO:S'],
      flags: ['卡他莫拉菌 M. catarrhalis', '95% 菌株 BRO 阳性', 'BRO 仅水解青霉素类', '克拉维酸完全抑制', '头孢菌素天然敏感']
    },

    summary: '卡他莫拉菌中约 95% 的临床分离株产生 BRO-1 或 BRO-2 型窄谱 β-内酰胺酶。BRO 酶仅水解青霉素类（阿莫西林、氨苄西林），不能水解头孢菌素类，且可被克拉维酸完全抑制。因此表现为 AMX R + AMC S（阿莫西林-克拉维酸恢复敏感）+ 所有头孢菌素 S。',

    interpretation: `**耐药原因：**
BRO-1 和 BRO-2 是卡他莫拉菌特有的窄谱 β-内酰胺酶，属于脂蛋白型 β-内酰胺酶。BRO-1 水解活性略强于 BRO-2。该酶仅水解青霉素类，对头孢菌素无效。克拉维酸可完全抑制。

**流行病学：**
约 95% 的临床分离卡他莫拉菌产 BRO 酶。因此绝大多数卡他莫拉菌表现为 AMX R + AMC S + 头孢菌素 S。只有约 5% 的 BRO 阴性菌株对 AMX 敏感。`,

    differentiation: {
      'vs_BRO_negative': 'BRO 阳性（95%）：AMX R + AMC S。BRO 阴性（5%）：AMX S。头孢菌素均 S。',
    },

    clinicalNote: 'BRO 阳性菌株 → 阿莫西林/氨苄西林无效，但阿莫西林-克拉维酸、头孢菌素、氟喹诺酮类均有效。',
    references: ['胡付品等《细菌药物敏感性试验执行标准和典型报告解读》第二版, Cat Case 40-41', 'CLSI M100 Ed35'],
    createdBy: '基于胡付品主编《细菌药物敏感性试验执行标准和典型报告解读》第二版 Cat 案例',
  },

];

// ============================================================
// 导出（浏览器端全局变量）
// ============================================================
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { KNOWLEDGE_BASE };
}
