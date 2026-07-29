/**
 * 耐药机制解读助手 - 主应用控制器
 */

const App = {

  /** 当前状态 */
  state: {
    mode: 'manual',          // 'manual' | 'ocr'
    bacteria: 'KP',
    drugResults: {},          // { "MEM": "R", "IPM": "S", ... }
    analysisResults: [],      // 分析结果
    ocrRawText: '',           // OCR 原始文本（调试用）
    currentStep: 'input',     // 'input' | 'review' | 'results'
  },

  /** 初始化 */
  init() {
    this._renderDrugList();
    this._bindEvents();
    this._bindTabEvents();

    // 检查 URL 参数
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'ocr') {
      this._switchTab('ocr');
    }
  },

  // ============================================================
  // 渲染函数
  // ============================================================

  /** 渲染手动模式的药物列表 */
  _renderDrugList() {
    const container = document.getElementById('drug-list');
    if (!container) return;

    container.innerHTML = '';

    CONFIG.drugCategories.forEach(cat => {
      const catDiv = document.createElement('div');
      catDiv.className = 'drug-category';

      const catHeader = document.createElement('div');
      catHeader.className = 'drug-category-header';
      catHeader.textContent = cat.name;
      catDiv.appendChild(catHeader);

      const drugGrid = document.createElement('div');
      drugGrid.className = 'drug-grid';

      cat.drugs.forEach(drug => {
        const drugItem = this._createDrugToggle(drug);
        drugGrid.appendChild(drugItem);
      });

      catDiv.appendChild(drugGrid);
      container.appendChild(catDiv);
    });
  },

  /** 创建单个药物的 S/I/R 切换按钮组 */
  _createDrugToggle(drug) {
    const div = document.createElement('div');
    div.className = 'drug-toggle';
    div.dataset.drug = drug.abbrev;

    const label = document.createElement('span');
    label.className = 'drug-toggle-label';
    label.textContent = drug.nameCN;
    label.title = `${drug.nameEN} (${drug.abbrev})`;
    div.appendChild(label);

    const btnGroup = document.createElement('div');
    btnGroup.className = 'sir-btn-group';

    ['S', 'I', 'R'].forEach(val => {
      const btn = document.createElement('button');
      btn.className = `sir-btn sir-${val.toLowerCase()}`;
      btn.textContent = val;
      btn.type = 'button';
      btn.dataset.value = val;
      btn.addEventListener('click', () => {
        this._setDrugResult(drug.abbrev, val, div);
      });
      btnGroup.appendChild(btn);
    });

    div.appendChild(btnGroup);

    // 清除按钮
    const clearBtn = document.createElement('button');
    clearBtn.className = 'sir-clear-btn';
    clearBtn.textContent = '✕';
    clearBtn.type = 'button';
    clearBtn.title = '清除选择';
    clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this._setDrugResult(drug.abbrev, null, div);
    });
    div.appendChild(clearBtn);

    return div;
  },

  /** 设置药物结果并更新 UI */
  _setDrugResult(drugAbbrev, value, toggleDiv) {
    if (value === null) {
      delete this.state.drugResults[drugAbbrev];
    } else {
      this.state.drugResults[drugAbbrev] = value;
    }

    // 更新按钮状态
    if (toggleDiv) {
      const buttons = toggleDiv.querySelectorAll('.sir-btn');
      buttons.forEach(b => {
        b.classList.toggle('active', b.dataset.value === value);
      });
    }

    this._updateAnalyzeButton();
  },

  /** 更新分析按钮状态（至少选 3 个药物才能分析） */
  _updateAnalyzeButton() {
    const btn = document.getElementById('analyze-btn');
    const count = Object.keys(this.state.drugResults).length;
    if (btn) {
      btn.disabled = count < 3;
      btn.textContent = count < 3
        ? `🔍 请至少选择 3 个药物的药敏结果（已选 ${count}）`
        : `🔍 开始分析（已选 ${count} 个药物）`;
    }
  },

  /** 渲染审核表格 */
  _renderReviewTable(drugResults) {
    const tbody = document.getElementById('review-tbody');
    if (!tbody) return;

    tbody.innerHTML = '';

    const entries = Object.entries(drugResults).sort((a, b) => {
      const orderA = SIR_ORDER[a[1]] ?? 3;
      const orderB = SIR_ORDER[b[1]] ?? 3;
      return orderA - orderB; // R 排前面
    });

    if (entries.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="empty-cell">未识别到药敏数据，请手动输入</td></tr>';
      return;
    }

    entries.forEach(([abbrev, result]) => {
      const drug = CONFIG.allDrugs.find(d => d.abbrev === abbrev);
      const drugName = drug ? drug.nameCN : abbrev;

      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td class="drug-name-cell">${drugName} <span class="drug-abbrev">(${abbrev})</span></td>
        <td class="result-cell result-${result.toLowerCase()}"><strong>${result}</strong></td>
        <td class="edit-cell">
          <select class="result-select" data-drug="${abbrev}">
            <option value="">--</option>
            <option value="S" ${result === 'S' ? 'selected' : ''}>S - 敏感</option>
            <option value="I" ${result === 'I' ? 'selected' : ''}>I - 中介</option>
            <option value="R" ${result === 'R' ? 'selected' : ''}>R - 耐药</option>
          </select>
        </td>
        <td class="delete-cell">
          <button class="btn-delete-drug" data-drug="${abbrev}">✕</button>
        </td>
      `;

      // 下拉修改事件
      tr.querySelector('.result-select').addEventListener('change', (e) => {
        const newVal = e.target.value || null;
        if (newVal) {
          this.state.drugResults[abbrev] = newVal;
        } else {
          delete this.state.drugResults[abbrev];
        }
        this._renderReviewTable(this.state.drugResults);
      });

      // 删除按钮
      tr.querySelector('.btn-delete-drug').addEventListener('click', () => {
        delete this.state.drugResults[abbrev];
        this._renderReviewTable(this.state.drugResults);
      });

      tbody.appendChild(tr);
    });
  },

  /** 渲染天然耐药（菌种固有，始终展示） */
  _renderNaturalResistance() {
    const entries = CONFIG.naturalResistance?.[this.state.bacteria];
    if (!entries || entries.length === 0) return '';

    let html = '<details class="natural-resistance"><summary>🧬 天然耐药（' + this.state.bacteria + ' 菌种固有）</summary>';
    html += '<div class="natural-list">';
    entries.forEach(e => {
      const tested = this.state.drugResults[e.drug];
      const badge = tested === 'R' ? ' ✅ 已测试为耐药' : tested === 'S' ? ' ⚠️ 已测试为敏感（罕见！）' : '';
      html += '<div class="natural-item">';
      html += '<strong>' + e.drugName + ' (' + e.drug + ')</strong>' + badge + '<br>';
      html += '<span class="natural-mech">机制: ' + e.mechanism + '</span><br>';
      html += '<span class="natural-detail">' + e.detail + '</span>';
      if (e.exception) {
        html += '<br><span class="natural-exception">⚠️ 例外: ' + e.exception + '</span>';
      }
      html += '<br><span class="natural-source">来源: ' + e.source + '</span>';
      html += '</div>';
    });
    html += '</div></details>';
    return html;
  },

  /** 渲染分析结果 */
  _renderResults(results) {
    const container = document.getElementById('results-container');
    if (!container) return;

    // 结果摘要
    const primary = results[0];
    const altResults = results.slice(1);

    let html = '';

    // 数据质量警告
    const alerts = Analyzer.getQualityAlerts(this.state.drugResults);
    if (alerts.length > 0) {
      html += '<div class="quality-alerts">';
      alerts.forEach(a => {
        html += '<div class="quality-alert quality-' + a.severity + '">' + a.text + '</div>';
      });
      html += '</div>';
    }

    // 天然耐药（菌种固有，始终展示）
    html += this._renderNaturalResistance();

    // 关键发现
    const findings = Analyzer.getFindingsSummary(this.state.drugResults);
    if (findings.length > 0) {
      html += '<div class="findings-summary">';
      html += '<h3>🔑 关键发现</h3>';
      findings.forEach(f => {
        html += `<div class="finding-item finding-${f.severity}">${f.text}</div>`;
      });
      html += '</div>';
    }

    // 主要结果
    if (primary && primary.confidence !== 'none') {
      html += this._renderPrimaryResult(primary);
    } else {
      html += this._renderNoResult();
    }

    // 备选结果
    if (altResults.length > 0) {
      html += '<div class="alternative-results">';
      html += '<h3>📋 其他可能机制（按可能性排序）</h3>';
      altResults.forEach(r => {
        html += this._renderAlternativeResult(r);
      });
      html += '</div>';
    }

    // 药敏数据回顾
    html += this._renderDrugReview();

    container.innerHTML = html;

    // 绑定笔记复制按钮
    const copyBtn = document.getElementById('copy-notes-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this._copyNotes(primary));
    }

    // 绑定鉴别药物高亮
    this._highlightDiffDrugs(primary, results[1]);
  },

  /** 渲染主要结果卡片 */
  _renderPrimaryResult(result) {
    const confClass = `confidence-${result.confidence}`;
    const confLabels = { high: '高置信度 ★★★★★', medium: '中等置信度 ★★★', low: '低置信度 ★★' };
    const confLabel = confLabels[result.confidence] || '未知';

    let html = `
      <div class="result-card primary-result ${confClass}">
        <div class="result-header">
          <div class="result-rank">#${result.rank}</div>
          <div class="result-info">
            <h2>${result.label}</h2>
            <div class="result-meta">
              <span class="result-category">${result.category}</span>
              <span class="result-confidence ${confClass}">${confLabel}</span>
              <span class="result-score">匹配度 ${result.matchPct}%</span>
            </div>
          </div>
        </div>

        <div class="result-summary">
          <strong>📌 一句话总结：</strong>${result.summary}
        </div>

        <div class="result-interpretation">
          <h3>🔬 机制详解</h3>
          <div class="markdown-content">${this._simpleMarkdown(result.interpretation)}</div>
        </div>
    `;

    // 鉴别要点
    if (result.differentiation && Object.keys(result.differentiation).length > 0) {
      html += '<div class="result-differentiation"><h3>🆚 关键鉴别点</h3><ul>';
      Object.entries(result.differentiation).forEach(([key, value]) => {
        const label = key.replace(/^vs_/, 'vs. ');
        html += `<li><strong>${label}</strong>: ${value}</li>`;
      });
      html += '</ul></div>';
    }

    // 临床关联
    if (result.clinicalNote) {
      html += `<div class="result-clinical"><h3>💊 临床关联（仅供学习）</h3><p>${result.clinicalNote}</p></div>`;
    }

    // 参考资料
    if (result.references && result.references.length > 0) {
      html += '<div class="result-references"><h3>📚 参考资料</h3><ul>';
      result.references.forEach(ref => {
        html += `<li>${ref}</li>`;
      });
      html += '</ul></div>';
    }

    // 操作按钮
    html += `
      <div class="result-actions">
        <button id="copy-notes-btn" class="btn-primary">📝 一键复制学习笔记</button>
        <button class="btn-secondary" onclick="App.reset()">🔄 重新分析</button>
      </div>
    `;

    html += '</div>';
    return html;
  },

  /** 渲染备选结果 */
  _renderAlternativeResult(result) {
    const confLabels = { high: '高', medium: '中', low: '低' };
    const confLabel = confLabels[result.confidence] || '低';

    return `
      <div class="result-card alt-result">
        <div class="result-header-compact">
          <span class="result-label">${result.label}</span>
          <span class="result-category">${result.category}</span>
          <span class="result-confidence confidence-${result.confidence}">${confLabel} (${result.matchPct}%)</span>
        </div>
        <div class="result-summary-compact">${result.summary}</div>
      </div>
    `;
  },

  /** 渲染无结果 */
  _renderNoResult() {
    return `
      <div class="result-card no-result">
        <h3>⚠️ 未找到高置信度匹配</h3>
        <p>当前的药敏数据模式未能明确匹配已知耐药机制。可能原因：</p>
        <ul>
          <li>药敏数据不够完整（建议补充：头孢西丁、头孢他啶/阿维巴坦、氨曲南、厄他培南）</li>
          <li>可能为罕见或新发耐药机制</li>
          <li>不同机制的共表达导致表型重叠</li>
        </ul>
        <p><strong>建议：</strong>补充关键鉴别药物的药敏数据后重新分析。</p>
      </div>
    `;
  },

  /** 渲染药敏数据回顾 */
  _renderDrugReview() {
    const entries = Object.entries(this.state.drugResults).sort((a, b) => {
      const orderA = SIR_ORDER[a[1]] ?? 3;
      const orderB = SIR_ORDER[b[1]] ?? 3;
      return orderA - orderB;
    });

    let html = '<div class="drug-review"><h3>📊 药敏数据摘要</h3><div class="drug-review-grid">';

    entries.forEach(([abbrev, result]) => {
      const drug = CONFIG.allDrugs.find(d => d.abbrev === abbrev);
      const name = drug ? drug.nameCN : abbrev;
      html += `<span class="dru-review-item result-badge result-${result.toLowerCase()}">${name} <strong>${result}</strong></span>`;
    });

    html += '</div></div>';
    return html;
  },

  /**
   * 简易 Markdown 渲染
   * 处理: **bold**, • bullet, 表格, 换行
   */
  _simpleMarkdown(text) {
    if (!text) return '';

    let html = text
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // 表格行 → 用特殊格式渲染
      .replace(/^\|(.+)\|$/gm, (match, content) => {
        const cells = content.split('|').map(c => c.trim());
        const cellType = cells.every(c => /^[-—]+$/.test(c)) ? 'sep' : 'row';
        if (cellType === 'sep') return '';
        return '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>';
      })
      // 处理连续 <tr> 包裹在 <table> 中
      .replace(/((?:<tr>.*<\/tr>\s*)+)/g, '<table class="simple-table">$1</table>')
      // 换行
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>');

    html = '<p>' + html + '</p>';
    return html;
  },

  /** 高亮辅助鉴别药物 */
  _highlightDiffDrugs(primary, secondary) {
    if (!primary || !secondary) return;

    const differentiators = Analyzer.getKeyDifferentiators([primary, secondary]);
    if (differentiators.length === 0) return;

    const statuses = Analyzer.getDifferentiatorStatus(this.state.drugResults, differentiators);

    // 在药敏回顾中高亮
    statuses.forEach(d => {
      const badge = document.querySelector(`.drug-review-grid .result-badge`);
      // ...（简化处理，在实际使用时可以更精确）
    });
  },

  // ============================================================
  // 事件绑定
  // ============================================================

  _bindEvents() {
    // 菌种选择
    const bacteriaSelect = document.getElementById('bacteria-select');
    if (bacteriaSelect) {
      bacteriaSelect.addEventListener('change', (e) => {
        this.state.bacteria = e.target.value;
      });
    }

    // 分析按钮（手动模式）
    const analyzeBtn = document.getElementById('analyze-btn');
    if (analyzeBtn) {
      analyzeBtn.addEventListener('click', () => this._runAnalysis());
    }

    // 审核表格中的分析按钮
    const reviewAnalyzeBtn = document.getElementById('review-analyze-btn');
    if (reviewAnalyzeBtn) {
      reviewAnalyzeBtn.addEventListener('click', () => this._runAnalysis());
    }

    // OCR 上传
    const ocrInput = document.getElementById('ocr-file-input');
    if (ocrInput) {
      ocrInput.addEventListener('change', (e) => this._handleOCRUpload(e));
    }

    // 拖拽上传
    const dropZone = document.getElementById('ocr-drop-zone');
    if (dropZone) {
      dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
      });
      dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
      });
      dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
          this._handleOCRFile(file);
        }
      });
      dropZone.addEventListener('click', () => {
        ocrInput.click();
      });
    }

    // 示例按钮
    const exampleBtn = document.getElementById('load-example-btn');
    if (exampleBtn) {
      exampleBtn.addEventListener('click', () => this._loadExample());
    }

    // 重置按钮
    const resetBtn = document.getElementById('reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.reset());
    }
  },

  _bindTabEvents() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const mode = tab.dataset.tab;
        this._switchTab(mode);
      });
    });
  },

  _switchTab(mode) {
    this.state.mode = mode;

    // 更新 tab UI
    document.querySelectorAll('.tab-btn').forEach(t => {
      t.classList.toggle('active', t.dataset.tab === mode);
    });
    document.querySelectorAll('.tab-panel').forEach(p => {
      p.classList.toggle('active', p.id === `tab-${mode}`);
    });
  },

  // ============================================================
  // OCR 处理
  // ============================================================

  async _handleOCRUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    await this._handleOCRFile(file);
  },

  async _handleOCRFile(file) {
    const progressDiv = document.getElementById('ocr-progress');
    const progressBar = document.getElementById('ocr-progress-bar');
    const progressText = document.getElementById('ocr-progress-text');

    if (progressDiv) progressDiv.style.display = 'block';

    try {
      const { drugResults, rawText } = await OCR.recognizeReport(file, (info) => {
        if (progressBar) progressBar.style.width = `${Math.round(info.progress * 100)}%`;
        if (progressText) progressText.textContent = info.message;
      });

      this.state.drugResults = drugResults;
      this.state.ocrRawText = rawText;

      // 检查识别结果
      const count = Object.keys(drugResults).length;
      if (count < 3) {
        // 识别到的药物太少，显示原始文本帮助用户手动输入
        this._showOCRTroubleshoot(rawText, count);
      } else {
        // 跳转到审核步骤
        this._goToReview(drugResults);
      }

    } catch (err) {
      if (progressText) {
        progressText.textContent = `识别失败: ${err.message}`;
        progressText.style.color = 'var(--color-danger)';
      }
      console.error('OCR error:', err);
    } finally {
      if (progressDiv) {
        setTimeout(() => { progressDiv.style.display = 'none'; }, 2000);
      }
    }
  },

  _showOCRTroubleshoot(rawText, count) {
    // 显示 OCR 原始文本，让用户可以看到识别结果并手动补充
    const reviewSection = document.getElementById('review-section');
    const ocrRawDisplay = document.getElementById('ocr-raw-text');
    const reviewTableContainer = document.getElementById('review-table-container');

    if (ocrRawDisplay) {
      ocrRawDisplay.textContent = rawText || '(未识别到文字)';
    }

    if (reviewTableContainer) {
      const tbody = document.getElementById('review-tbody');
      if (tbody) {
        tbody.innerHTML = `<tr><td colspan="4" class="empty-cell">
          OCR 识别到 <strong>${count}</strong> 个药物结果（至少需要 3 个）。<br>
          请在下方手动补充或修正药敏数据。
        </td></tr>`;
      }
    }

    if (reviewSection) reviewSection.style.display = 'block';
    document.getElementById('input-section').style.display = 'none';

    // 同时更新审核表格
    this._renderReviewTable(this.state.drugResults);
  },

  // ============================================================
  // 分析流程
  // ============================================================

  _goToReview(drugResults) {
    document.getElementById('input-section').style.display = 'none';
    document.getElementById('review-section').style.display = 'block';
    document.getElementById('results-section').style.display = 'none';
    this._renderReviewTable(drugResults || this.state.drugResults);
  },

  _runAnalysis() {
    const results = Analyzer.analyze(this.state.bacteria, this.state.drugResults);

    this.state.analysisResults = results;
    this.state.currentStep = 'results';

    document.getElementById('input-section').style.display = 'none';
    document.getElementById('review-section').style.display = 'none';
    document.getElementById('results-section').style.display = 'block';

    this._renderResults(results);

    // 滚动到结果区域
    document.getElementById('results-section').scrollIntoView({ behavior: 'smooth' });
  },

  /** 复制学习笔记 */
  async _copyNotes(primaryResult) {
    const notes = Analyzer.generateNotes(this.state.bacteria, this.state.drugResults, primaryResult);

    try {
      await navigator.clipboard.writeText(notes);
      this._showToast('✅ 学习笔记已复制到剪贴板！');
    } catch (err) {
      // Fallback: 显示在 textarea 中供用户手动复制
      this._showNotesModal(notes);
    }
  },

  _showNotesModal(notes) {
    // 创建简单弹窗
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>📝 学习笔记</h3>
        <textarea readonly class="notes-textarea">${notes}</textarea>
        <div class="modal-actions">
          <button class="btn-primary" onclick="this.closest('.modal-overlay').remove()">关闭</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.remove();
    });
  },

  /** Toast 提示 */
  _showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('toast-hide');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  },

  /** 加载示例数据 */
  _loadExample() {
    // KPC-2 产肺炎克雷伯菌典型药敏模式
    const exampleData = {
      'AMP': 'R', 'TZP': 'R', 'CFZ': 'R', 'CXM': 'R',
      'CTX': 'R', 'CRO': 'R', 'CAZ': 'R', 'FEP': 'R',
      'FOX': 'S', 'CSL': 'R', 'ATM': 'R',
      'ETP': 'R', 'IPM': 'R', 'MEM': 'R',
      'CZA': 'S', 'IMR': 'S', 'MEV': 'S',
      'AMK': 'S', 'GEN': 'R',
      'CIP': 'R', 'LVX': 'R',
      'SXT': 'R', 'TGC': 'S', 'CST': 'S',
    };

    this.state.drugResults = { ...exampleData };

    // 更新手动模式的按钮状态
    Object.entries(exampleData).forEach(([abbrev, result]) => {
      const toggleDiv = document.querySelector(`.drug-toggle[data-drug="${abbrev}"]`);
      if (toggleDiv) {
        const buttons = toggleDiv.querySelectorAll('.sir-btn');
        buttons.forEach(b => {
          b.classList.toggle('active', b.dataset.value === result);
        });
      }
    });

    this._updateAnalyzeButton();
    this._showToast('✅ 已加载 KPC-2 产肺炎克雷伯菌示例数据，点击"开始分析"查看结果');
  },

  /** 重置 */
  reset() {
    this.state.drugResults = {};
    this.state.analysisResults = [];
    this.state.ocrRawText = '';
    this.state.currentStep = 'input';

    // 重置 UI
    document.getElementById('input-section').style.display = 'block';
    document.getElementById('review-section').style.display = 'none';
    document.getElementById('results-section').style.display = 'none';

    // 清除手动模式的按钮状态
    document.querySelectorAll('.sir-btn').forEach(b => b.classList.remove('active'));

    // 清除 OCR 输入
    const ocrInput = document.getElementById('ocr-file-input');
    if (ocrInput) ocrInput.value = '';

    this._updateAnalyzeButton();

    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => App.init());
