/**
 * 耐药机制解读助手 - 多药联合模式匹配引擎
 *
 * 核心逻辑：
 * 1. 接收药敏数据（药物缩写 → S/I/R 的映射）
 * 2. 遍历知识库中每个机制的 pattern
 * 3. 计算匹配分数
 * 4. 按置信度排序返回结果
 */

const Analyzer = {

  /**
   * 主入口：分析药敏结果
   *
   * @param {string} bacteriaId - 菌种 ID（如 "KP"）
   * @param {Object} drugResults - { "MEM": "R", "IPM": "S", ... }
   *   注意：只有明确标注 S/I/R 的药物才包含，未标注的不要传
   * @returns {Array<AnalysisResult>} 按置信度降序排列的分析结果
   */
  analyze(bacteriaId, drugResults) {
    // 筛选目标菌种的知识条目
    const candidates = KNOWLEDGE_BASE.filter(e => e.bacteria === bacteriaId);

    if (candidates.length === 0) {
      return [{
        mechanism: null,
        label: '未找到匹配的耐药机制',
        confidence: 'none',
        score: 0,
        maxScore: 0,
        matchDetails: [],
        message: `知识库中暂无 ${bacteriaId} 的耐药机制条目，请联系管理员添加。`
      }];
    }

    // 计算每个条目的数据覆盖度
    const inputDrugSet = new Set(Object.keys(drugResults));
    const totalInputDrugs = inputDrugSet.size;

    const scored = candidates.map(entry => {
      const base = this._scoreMatch(entry, drugResults);
      // 统计该条目 pattern 中引用了多少种不同的药物
      const entryDrugs = this._getEntryDrugs(entry);
      const testedCount = entryDrugs.filter(d => inputDrugSet.has(d)).length;
      const coverage = entryDrugs.length > 0 ? testedCount / entryDrugs.length : 0;
      return { ...base, entryDrugCount: entryDrugs.length, testedCount, coverage };
    });

    // 排序：按匹配百分比降序。
    // 但当两个条目百分比差 < 8% 且覆盖率都低时，说明数据不足以区分 → 按优先级排序
    scored.sort((a, b) => {
      const pctA = a.maxScore > 0 ? a.score / a.maxScore : 0;
      const pctB = b.maxScore > 0 ? b.score / b.maxScore : 0;
      const diff = Math.abs(pctB - pctA);
      // 百分比接近且数据稀疏 → 优先级决定排序
      if (diff < 0.08 && totalInputDrugs < 8) {
        return (b.entry.priority || 0) - (a.entry.priority || 0);
      }
      // 否则百分比优先，百分比相等时用优先级
      return pctB - pctA || (b.entry.priority || 0) - (a.entry.priority || 0);
    });

    // 添加置信度标签（低覆盖率时降低一档）
    const results = scored.map(s => {
      const pct = s.maxScore > 0 ? s.score / s.maxScore : 0;

      let confidence;
      if (pct >= 0.80) confidence = 'high';
      else if (pct >= 0.50) confidence = 'medium';
      else if (pct >= 0.25) confidence = 'low';
      else confidence = 'none';

      // 数据覆盖率太低 → 降级置信度
      if (s.coverage < 0.4 && confidence === 'high') confidence = 'medium';
      else if (s.coverage < 0.4 && confidence === 'medium') confidence = 'low';

      return {
        mechanism: s.entry,
        label: s.entry.label,
        category: s.entry.category,
        confidence,
        score: s.score,
        maxScore: s.maxScore,
        matchPct: Math.round(pct * 100),
        matchDetails: s.details,
        flags: s.flags,
        dataCoverage: Math.round(s.coverage * 100),
        totalInputDrugs,
        summary: s.entry.summary,
        interpretation: s.entry.interpretation,
        differentiation: s.entry.differentiation,
        clinicalNote: s.entry.clinicalNote,
        references: s.entry.references,
      };
    });

    // 如果有高置信度结果，标记其余为备选
    const hasHigh = results.some(r => r.confidence === 'high');

    return results.map((r, i) => {
      if (hasHigh && r.confidence !== 'high') {
        r.isAlternative = true;
      }
      r.rank = i + 1;
      return r;
    }).filter(r => r.confidence !== 'none');
  },

  /**
   * 计算单个机制的匹配分数
   */
  _scoreMatch(entry, drugResults) {
    const pattern = entry.pattern;
    const details = [];
    const flags = [...(pattern.flags || [])];

    let score = 0;
    let maxScore = 0;

    // ---- allOf: 必须全部满足 ----
    (pattern.allOf || []).forEach(rule => {
      const { drug, expected } = this._parseRule(rule);
      maxScore += 3;
      const actual = drugResults[drug];
      if (actual === expected) {
        score += 3;
        details.push({ drug, expected, actual, status: 'match', weight: 3, type: 'allOf' });
      } else if (actual === undefined || actual === null) {
        // 药物未测试 → 不能说是Mismatch，算部分扣分
        details.push({ drug, expected, actual: '(未测试)', status: 'unknown', weight: 0, type: 'allOf', note: '未在药敏数据中找到此药物' });
      } else {
        // 与预期不符 → 强力负分
        score -= 5;
        details.push({ drug, expected, actual, status: 'mismatch', weight: -5, type: 'allOf', note: `预期 ${expected}，实际 ${actual}` });
      }
    });

    // ---- atLeastN: N 个条件中至少满足 M 个 ----
    const atLeastNLists = [pattern.atLeastN, pattern.atLeastN_2].filter(Boolean);
    atLeastNLists.forEach(ruleSet => {
      const [minRequired, rules] = ruleSet;
      maxScore += minRequired * 2;
      const parsed = rules.map(r => this._parseRule(r));
      const matches = [];

      parsed.forEach(({ drug, expected }) => {
        const actual = drugResults[drug];
        if (actual === expected) {
          matches.push({ drug, expected, actual, status: 'match', weight: 2, type: 'atLeastN' });
        } else if (actual !== undefined && actual !== null) {
          matches.push({ drug, expected, actual, status: 'mismatch', weight: 0, type: 'atLeastN', note: `预期 ${expected}，实际 ${actual}` });
        } else {
          matches.push({ drug, expected, actual: '(未测试)', status: 'unknown', weight: 0, type: 'atLeastN' });
        }
      });

      const matchCount = matches.filter(m => m.status === 'match').length;
      if (matchCount >= minRequired) {
        score += minRequired * 2; // 满分
      } else {
        score += matchCount * 2; // 部分得分
      }
      details.push(...matches);
    });

    // ---- noneOf: 必须全部不满足（排除条件）----
    (pattern.noneOf || []).forEach(rule => {
      const { drug, expected } = this._parseRule(rule);
      maxScore += 3;
      const actual = drugResults[drug];
      if (actual === expected) {
        // 匹配到了不该匹配的 → 强力惩罚
        score -= 10;
        details.push({ drug, expected, actual, status: 'mismatch', weight: -10, type: 'noneOf', note: `出现排除条件！预期不应为 ${expected}` });
      } else if (actual === undefined || actual === null) {
        details.push({ drug, expected, actual: '(未测试)', status: 'unknown', weight: 0, type: 'noneOf', note: '排除条件未验证' });
      } else {
        // 不匹配 → 正确！不应出现该条件，确实没出现
        score += 3;
        details.push({ drug, expected, actual, status: 'match', weight: 3, type: 'noneOf', note: `排除条件通过（实际 ${actual} ≠ ${expected}）` });
      }
    });

    // ---- supporting: 支持性证据 ----
    (pattern.supporting || []).forEach(rule => {
      const { drug, expected } = this._parseRule(rule);
      maxScore += 1;
      const actual = drugResults[drug];
      if (actual === expected) {
        score += 1;
        details.push({ drug, expected, actual, status: 'match', weight: 1, type: 'supporting' });
      } else if (actual !== undefined && actual !== null && actual !== expected) {
        details.push({ drug, expected, actual, status: 'mismatch', weight: 0, type: 'supporting', note: `支持条件不满足` });
      } else {
        details.push({ drug, expected, actual: '(未测试)', status: 'unknown', weight: 0, type: 'supporting' });
      }
    });

    return { entry, score, maxScore, details, flags };
  },

  /**
   * 解析规则字符串 "MEM:R" → { drug: "MEM", expected: "R" }
   */
  _parseRule(rule) {
    const parts = rule.split(':');
    return { drug: parts[0], expected: parts[1] || 'R' };
  },

  /**
   * 提取某条目 pattern 中引用的所有药物缩写
   */
  _getEntryDrugs(entry) {
    const drugs = new Set();
    const p = entry.pattern;
    const collectFromRules = (rules) => {
      if (!rules) return;
      rules.forEach(r => {
        const { drug } = this._parseRule(r);
        drugs.add(drug);
      });
    };
    collectFromRules(p.allOf);
    if (p.atLeastN) collectFromRules(p.atLeastN[1]);
    if (p.atLeastN_2) collectFromRules(p.atLeastN_2[1]);
    collectFromRules(p.noneOf);
    collectFromRules(p.supporting);
    return [...drugs];
  },

  /**
   * 获取可能的关键鉴别药物
   * 比较排名前两个机制的 differentiation 键，找出建议测试的药物
   */
  getKeyDifferentiators(topResults) {
    if (topResults.length < 2) return [];

    const primary = topResults[0];
    const secondary = topResults[1];

    // 从 primary 的 differentiation 中提取 vs_secondary 的鉴别药物
    const key = `vs_${secondary.mechanism.id}`;
    const diffText = primary.differentiation?.[key];

    if (!diffText) return [];

    // 从鉴别文本中提取药物缩写
    const drugAbbrevs = new Set();
    CONFIG.allDrugs.forEach(d => {
      if (diffText.includes(d.abbrev)) {
        drugAbbrevs.add(d);
      }
    });

    return Array.from(drugAbbrevs);
  },

  /**
   * 从药敏数据中提取关键鉴别药物的状态
   */
  getDifferentiatorStatus(drugResults, differentiators) {
    return differentiators.map(d => ({
      ...d,
      result: drugResults[d.abbrev] || '(未测试)',
      isKey: true
    }));
  },

  /**
   * 生成学习笔记文本
   */
  generateNotes(bacteriaId, drugResults, topResult) {
    if (!topResult || topResult.confidence === 'none') {
      return '未能匹配到高置信度的耐药机制。建议补充关键鉴别药物的药敏数据。';
    }

    const bacteria = CONFIG.bacteria.find(b => b.id === bacteriaId);
    const bacteriaName = bacteria ? bacteria.name : bacteriaId;

    const lines = [
      `=== 耐药机制学习笔记 ===`,
      ``,
      `【菌种】${bacteriaName}`,
      `【解读日期】${new Date().toLocaleDateString('zh-CN')}`,
      ``,
      `【主要耐药机制】${topResult.label}`,
      `【置信度】${topResult.confidence === 'high' ? '★★★★★ 高' : topResult.confidence === 'medium' ? '★★★ 中' : '★★ 低'}`,
      ``,
      `【机制概要】`,
      topResult.summary,
      ``,
      `【详细解读】`,
      topResult.interpretation.replace(/\*\*/g, '').replace(/\*/g, ''),
      ``,
      `【鉴别要点】`,
    ];

    // 添加鉴别信息
    if (topResult.differentiation) {
      Object.entries(topResult.differentiation).forEach(([key, value]) => {
        const label = key.replace(/^vs_/, 'vs. ');
        lines.push(`  ${label}: ${value}`);
      });
    }

    lines.push('');
    lines.push(`【临床关联（仅供学习）】`);
    lines.push(topResult.clinicalNote || '暂无');
    lines.push('');
    lines.push(`【参考资料】`);
    (topResult.references || []).forEach(ref => lines.push(`  • ${ref}`));
    lines.push('');
    lines.push(`【药敏数据摘要】`);
    Object.entries(drugResults).forEach(([drug, result]) => {
      const drugDef = CONFIG.allDrugs.find(d => d.abbrev === drug);
      const name = drugDef ? drugDef.nameCN : drug;
      lines.push(`  ${name} (${drug}): ${result}`);
    });
    lines.push('');
    lines.push(CONFIG.disclaimer);

    return lines.join('\n');
  },

  /**
   * 获取药敏报告中的关键发现摘要
   */
  getFindingsSummary(drugResults) {
    const findings = [];

    // 检查碳青霉烯敏感性
    const carbapenems = ['ETP', 'IPM', 'MEM'].filter(d => drugResults[d]);
    const carbapenemR = carbapenems.filter(d => drugResults[d] === 'R');
    if (carbapenemR.length >= 2) {
      findings.push({ severity: 'critical', text: `碳青霉烯类多重耐药：${carbapenemR.join('、')} 均耐药` });
    } else if (carbapenemR.length === 1) {
      findings.push({ severity: 'warning', text: `单一碳青霉烯耐药：${carbapenemR[0]} 耐药，需进一步确认` });
    }

    // 检查 CZA 敏感性
    if (drugResults['CZA'] === 'S' && carbapenemR.length > 0) {
      findings.push({ severity: 'info', text: '头孢他啶/阿维巴坦仍敏感 → 提示丝氨酸碳青霉烯酶（KPC 或 ESBL+AmpC）' });
    }
    if (drugResults['CZA'] === 'R' && carbapenemR.length > 0) {
      findings.push({ severity: 'critical', text: '头孢他啶/阿维巴坦耐药 → 高度警惕 MBL 或 KPC-33 突变' });
    }

    // 检查 ATM 敏感性
    if (drugResults['ATM'] === 'S' && carbapenemR.length > 0) {
      findings.push({ severity: 'warning', text: '氨曲南敏感 + 碳青霉烯耐药 → 高度提示 MBL（NDM/IMP/VIM）' });
    }

    // 检查 FOX 敏感性
    if (drugResults['FOX'] === 'R' && !carbapenemR.length) {
      findings.push({ severity: 'info', text: '头孢西丁耐药 + 碳青霉烯敏感 → 提示 AmpC 酶或 ESBL+AmpC 共产生' });
    }

    return findings;
  }
};
