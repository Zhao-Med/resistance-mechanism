/**
 * 耐药机制解读助手 - 配置文件
 * 药物定义、菌种列表、常量
 */

const CONFIG = {
  appName: '耐药机制解读助手',
  version: '0.1.0',
  defaultBacteria: 'KP',

  /** 免责声明（全局展示） */
  disclaimer: '本工具仅用于微生物学专业学习与知识查询，所有机制解读均为教学参考，不构成临床用药建议。实际抗生素选择请严格遵循临床指南和当地耐药监测数据。',

  /** 支持的菌种 */
  bacteria: [
    { id: 'KP', name: '肺炎克雷伯菌', latin: 'Klebsiella pneumoniae' },
    // 后续扩展:
    // { id: 'EC', name: '大肠埃希菌', latin: 'Escherichia coli' },
    // { id: 'PA', name: '铜绿假单胞菌', latin: 'Pseudomonas aeruginosa' },
    // { id: 'AB', name: '鲍曼不动杆菌', latin: 'Acinetobacter baumannii' },
    { id: 'PA', name: '铜绿假单胞菌', latin: 'Pseudomonas aeruginosa' },
    { id: 'AB', name: '鲍曼不动杆菌', latin: 'Acinetobacter baumannii' },
  ],

  /** 天然耐药（菌种固有的耐药机制，不依赖 pattern 匹配，始终展示） */
  naturalResistance: {
    KP: [
      {
        drug: 'AMP',
        drugName: '氨苄西林',
        mechanism: '染色体编码 SHV-1 型 β-内酰胺酶',
        detail: '肺炎克雷伯菌天然携带染色体编码的 SHV-1 型 β-内酰胺酶（属于 Class A 广谱酶），该酶可高效水解氨苄西林和替卡西林等氨基青霉素。因此无论药敏报告显示敏感还是耐药，氨苄西林在临床上均视为无效。',
        exception: '极少数菌株因 SHV 基因发生点突变导致 mRNA 不翻译，不产生 SHV 酶，可能出现氨苄西林"假敏感"。遇到氨苄西林敏感的 KP 应怀疑此情况并复核。',
        source: '胡付品等《细菌药物敏感性试验执行标准和典型报告解读》第二版 Case 28-29; CLSI M100',
      },
      {
        drug: 'TIC',
        drugName: '替卡西林',
        mechanism: 'SHV-1 酶水解氨基青霉素类',
        detail: '与氨苄西林同理。染色体 SHV-1 酶对替卡西林也有高效水解能力，天然耐药。',
        source: 'CLSI M100 Ed35',
      },
      {
        drug: 'TGC',
        drugName: '替加环素（部分天然不敏感）',
        mechanism: 'RND 外排泵（AcrAB-TolC）基础表达',
        detail: '部分肺炎克雷伯菌菌株对外排泵底物类药物（如替加环素）的基础 MIC 偏高。若常规药敏显示替加环素中介或耐药，建议用标准肉汤微量稀释法或含复溶液的纸片扩散法复核——因替加环素易见光氧化分解，常规药敏容易出现假中介或假耐药。',
        exception: '复核后仍耐药 → 可能为 AcrAB-TolC 过表达或 ramR/acrR 调控基因突变，参见 KP-tigecycline-efflux 条目。',
        source: '胡付品等《细菌药物敏感性试验执行标准和典型报告解读》第二版 Case 11; EUCAST intrinsic resistance database',
      },
    ],
    PA: [
      {
        drug: 'AMP',
        drugName: '氨苄西林/阿莫西林',
        mechanism: '染色体 AmpC + 外排泵基础表达 + 低通透性外膜',
        detail: '铜绿假单胞菌对几乎所有青霉素类（除哌拉西林等脲基青霉素）、第一/二代头孢菌素、头孢曲松、头孢噻肟、厄他培南、四环素类、甲氧苄啶、氯霉素天然耐药。根本原因是其外膜通透性极低（仅为大肠杆菌的 1/100）+ 染色体 AmpC β-内酰胺酶 + 多种外排泵（MexAB-OprM 等）的基础表达共同作用。',
        source: 'CLSI M100 Ed35 Appendix B; EUCAST Intrinsic Resistance; PMID: 14693518',
      },
      {
        drug: 'ETP',
        drugName: '厄他培南',
        mechanism: '外膜通透性极低 + 染色体 AmpC + 外排泵',
        detail: '厄他培南对铜绿假单胞菌天然无效。碳青霉烯类中对 PA 有活性的仅亚胺培南和美罗培南（+ 多尼培南）。多尼培南未在中国上市。',
        source: 'CLSI M100 Ed35 Appendix B',
      },
      {
        drug: 'SXT',
        drugName: '复方新诺明',
        mechanism: '外膜通透性极低 + 固有外排',
        detail: '甲氧苄啶-磺胺甲噁唑对铜绿假单胞菌天然耐药。',
        source: 'CLSI M100 Ed35 Appendix B',
      },
      {
        drug: 'TGC',
        drugName: '替加环素',
        mechanism: 'MexXY-OprM 外排泵高效排出',
        detail: '替加环素对铜绿假单胞菌天然耐药，由 MexXY-OprM 外排泵高效排出药物所致。',
        source: 'EUCAST Intrinsic Resistance Database',
      },
    ],
    AB: [
      {
        drug: 'AMP',
        drugName: '氨苄西林/所有青霉素类',
        mechanism: '染色体 OXA-51-like β-内酰胺酶 + 外排泵 + 低通透性',
        detail: '鲍曼不动杆菌对氨苄西林、阿莫西林、第一/二代头孢菌素、磷霉素、甲氧苄啶天然耐药。染色体携带 OXA-51-like 碳青霉烯酶基因（表达水平低时不足以导致碳青霉烯耐药，但可水解青霉素类）。此外 AdeABC 外排泵和极低的外膜通透性共同形成了天然多药耐药表型。',
        source: 'CLSI M100 Ed35 Appendix B; EUCAST Intrinsic Resistance Database',
      },
      {
        drug: 'FOS',
        drugName: '磷霉素',
        mechanism: '外膜通透性极低 + 缺乏甘油磷酸转运系统',
        detail: '鲍曼不动杆菌对磷霉素天然耐药。外膜通透性极低（约为大肠杆菌的 1-3%），且缺乏有效的磷霉素摄取转运系统。',
        source: 'CLSI M100 Ed35 Appendix B',
      },
    ],
    // 后续扩展:
    // EC: [...],   // 大肠埃希菌天然耐药
    // PA: [...],   // 铜绿假单胞菌天然耐药
    // AB: [...],   // 鲍曼不动杆菌天然耐药
  },

  /** 药物分类及药物列表（肺炎克雷伯菌药敏常用药物） */
  drugCategories: [
    {
      id: 'beta_lactam',
      name: 'β-内酰胺类',
      drugs: [
        { abbrev: 'AMP',  nameCN: '氨苄西林',     nameEN: 'Ampicillin' },
        { abbrev: 'TZP',  nameCN: '哌拉西林/他唑巴坦', nameEN: 'Piperacillin/Tazobactam' },
        { abbrev: 'CFZ',  nameCN: '头孢唑林',     nameEN: 'Cefazolin' },
        { abbrev: 'CXM',  nameCN: '头孢呋辛',     nameEN: 'Cefuroxime' },
        { abbrev: 'CTX',  nameCN: '头孢噻肟',     nameEN: 'Cefotaxime' },
        { abbrev: 'CRO',  nameCN: '头孢曲松',     nameEN: 'Ceftriaxone' },
        { abbrev: 'CAZ',  nameCN: '头孢他啶',     nameEN: 'Ceftazidime' },
        { abbrev: 'FEP',  nameCN: '头孢吡肟',     nameEN: 'Cefepime' },
        { abbrev: 'CMZ',  nameCN: '头孢美唑',     nameEN: 'Cefmetazole' },
        { abbrev: 'FOX',  nameCN: '头孢西丁',     nameEN: 'Cefoxitin' },
        { abbrev: 'CTT',  nameCN: '头孢替坦',     nameEN: 'Cefotetan' },
        { abbrev: 'CSL',  nameCN: '头孢哌酮/舒巴坦',  nameEN: 'Cefoperazone/Sulbactam' },
        { abbrev: 'ATM',  nameCN: '氨曲南',       nameEN: 'Aztreonam' },
        { abbrev: 'ETP',  nameCN: '厄他培南',     nameEN: 'Ertapenem' },
        { abbrev: 'IPM',  nameCN: '亚胺培南',     nameEN: 'Imipenem' },
        { abbrev: 'MEM',  nameCN: '美罗培南',     nameEN: 'Meropenem' },
        { abbrev: 'CZA',  nameCN: '头孢他啶/阿维巴坦', nameEN: 'Ceftazidime/Avibactam' },
        { abbrev: 'IMR',  nameCN: '亚胺培南/瑞来巴坦', nameEN: 'Imipenem/Relebactam' },
        { abbrev: 'MEV',  nameCN: '美罗培南/法硼巴坦', nameEN: 'Meropenem/Vaborbactam' },
      ]
    },
    {
      id: 'aminoglycoside',
      name: '氨基糖苷类',
      drugs: [
        { abbrev: 'AMK', nameCN: '阿米卡星',   nameEN: 'Amikacin' },
        { abbrev: 'GEN', nameCN: '庆大霉素',   nameEN: 'Gentamicin' },
        { abbrev: 'TOB', nameCN: '妥布霉素',   nameEN: 'Tobramycin' },
      ]
    },
    {
      id: 'quinolone',
      name: '氟喹诺酮类',
      drugs: [
        { abbrev: 'CIP', nameCN: '环丙沙星',   nameEN: 'Ciprofloxacin' },
        { abbrev: 'LVX', nameCN: '左氧氟沙星', nameEN: 'Levofloxacin' },
      ]
    },
    {
      id: 'other',
      name: '其他',
      drugs: [
        { abbrev: 'SXT', nameCN: '复方新诺明',  nameEN: 'Trimethoprim/Sulfamethoxazole' },
        { abbrev: 'TGC', nameCN: '替加环素',    nameEN: 'Tigecycline' },
        { abbrev: 'CST', nameCN: '多粘菌素/粘菌素', nameEN: 'Colistin/Polymyxin B' },
        { abbrev: 'FOS', nameCN: '磷霉素',      nameEN: 'Fosfomycin' },
        { abbrev: 'CHL', nameCN: '氯霉素',      nameEN: 'Chloramphenicol' },
      ]
    }
  ],

  /** 扁平药物列表（方便查找） */
  allDrugs: [],

  /** 药物名→缩写映射表（OCR 用） */
  drugNameMap: {},
};

// 初始化扁平列表和映射
CONFIG.allDrugs = CONFIG.drugCategories.flatMap(cat => cat.drugs);

// 药物中文名 → 缩写
CONFIG.allDrugs.forEach(d => { CONFIG.drugNameMap[d.nameCN] = d.abbrev; });

// OCR 辅助：中文名关键词匹配（处理 OCR 识别不完整的情况）
CONFIG.allDrugs.forEach(d => {
  // 去掉「/」后的部分作为短名
  const shortName = d.nameCN.replace(/\/.*/, '');
  if (shortName !== d.nameCN && !CONFIG.drugNameMap[shortName]) {
    CONFIG.drugNameMap[shortName] = d.abbrev;
  }
  // 去掉括号
  const noParen = d.nameCN.replace(/[（）\(\)]/g, '');
  if (noParen !== d.nameCN && !CONFIG.drugNameMap[noParen]) {
    CONFIG.drugNameMap[noParen] = d.abbrev;
  }
});

/** 结果值映射（中文 → SIR） */
const RESULT_MAP = {
  '敏感': 'S', 's': 'S', 'S': 'S',
  '中介': 'I', 'i': 'I', 'I': 'I',
  '耐药': 'R', 'r': 'R', 'R': 'R',
};

/** 耐药结果排序优先级（用于排序展示） */
const SIR_ORDER = { 'R': 0, 'I': 1, 'S': 2, null: 3 };
