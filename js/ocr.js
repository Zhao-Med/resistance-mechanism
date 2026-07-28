/**
 * 耐药机制解读助手 - OCR 模块
 *
 * 使用 Tesseract.js v5 在浏览器端进行 OCR 识别
 * 支持中英文混合识别，无需任何后端服务（完全免费）
 */

const OCR = {

  /** Tesseract worker 实例 */
  worker: null,

  /** 是否正在加载 */
  loading: false,

  /** 加载进度回调 */
  onProgress: null,

  /**
   * 初始化 Tesseract Worker
   * 加载 chi_sim+eng 语言包
   */
  async init(onProgressCb) {
    if (this.worker) return this.worker;

    this.loading = true;
    this.onProgress = onProgressCb || (() => {});

    try {
      // 动态加载 Tesseract.js
      if (typeof Tesseract === 'undefined') {
        await this._loadScript('https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js');
      }

      this.onProgress({ status: 'loading', message: '正在加载 OCR 引擎...', progress: 0.1 });

      this.worker = await Tesseract.createWorker('chi_sim+eng', 1, {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            this.onProgress({
              status: 'recognizing',
              message: '正在识别文字...',
              progress: 0.3 + (m.progress || 0) * 0.6
            });
          }
        },
        errorHandler: (e) => {
          console.warn('Tesseract warning:', e);
        }
      });

      this.onProgress({ status: 'ready', message: 'OCR 引擎就绪', progress: 1.0 });
      this.loading = false;
      return this.worker;

    } catch (err) {
      this.loading = false;
      console.error('OCR 初始化失败:', err);
      throw new Error(`OCR 引擎加载失败: ${err.message}`);
    }
  },

  /**
   * 识别药敏报告图片
   *
   * @param {File|Blob} imageFile - 图片文件
   * @param {Function} onProgress - 进度回调
   * @returns {Promise<{drugResults: Object, rawText: string}>}
   */
  async recognizeReport(imageFile, onProgressCb) {
    const worker = await this.init(onProgressCb);

    // 将图片转为 data URL
    const imageUrl = await this._fileToDataUrl(imageFile);

    this.onProgress && this.onProgress({ status: 'recognizing', message: '正在识别图片中的文字...', progress: 0.2 });

    // 执行 OCR
    const { data } = await worker.recognize(imageUrl);

    const rawText = data.text;
    console.log('OCR 原始输出:\n', rawText);

    this.onProgress && this.onProgress({ status: 'parsing', message: '正在解析药敏数据...', progress: 0.9 });

    // 从 OCR 文本中提取药敏信息
    const drugResults = this._parseDrugResults(rawText);

    this.onProgress && this.onProgress({ status: 'done', message: '识别完成', progress: 1.0 });

    return {
      drugResults,
      rawText,
      confidence: data.confidence
    };
  },

  /**
   * 从 OCR 识别的文本中解析药敏结果
   *
   * 支持格式：
   *   头孢曲松 ≥64 R
   *   美罗培南 ≤0.25 S
   *   亚胺培南 R
   *   头孢他啶 中介
   *   阿米卡星 敏感
   */
  _parseDrugResults(rawText) {
    const results = {};
    const lines = rawText.split('\n');

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // 尝试匹配：药物名 ... [SIR] 或 [敏感/中介/耐药]
      const sirMatch = trimmed.match(/([SIR])\s*$/i) ||
                       trimmed.match(/(敏感|中介|耐药)\s*$/);

      if (!sirMatch) return;

      const resultRaw = sirMatch[1];
      const result = RESULT_MAP[resultRaw] || (resultRaw === '敏感' ? 'S' : resultRaw === '中介' ? 'I' : resultRaw === '耐药' ? 'R' : null);
      if (!result) return;

      // 在结果前面的文本中查找药物名
      const textBeforeResult = trimmed.substring(0, sirMatch.index).trim();

      // 尝试匹配已知药物名
      let matchedDrug = null;
      let matchedLength = 0;

      for (const drug of CONFIG.allDrugs) {
        // 检查完整中文名
        if (textBeforeResult.includes(drug.nameCN)) {
          if (drug.nameCN.length > matchedLength) {
            matchedDrug = drug;
            matchedLength = drug.nameCN.length;
          }
        }
        // 检查短名（去掉 / 之后的部分）
        const shortName = drug.nameCN.replace(/\/.*/, '');
        if (shortName.length > 1 && textBeforeResult.includes(shortName) && shortName.length > matchedLength) {
          matchedDrug = drug;
          matchedLength = shortName.length;
        }
      }

      // 也尝试匹配英文缩写（部分报告用英文）
      if (!matchedDrug) {
        const words = textBeforeResult.split(/\s+/);
        for (const word of words) {
          const upper = word.toUpperCase().replace(/[^A-Z]/g, '');
          const found = CONFIG.allDrugs.find(d => d.abbrev === upper);
          if (found) {
            matchedDrug = found;
            break;
          }
        }
      }

      if (matchedDrug) {
        results[matchedDrug.abbrev] = result;
      }
    });

    return results;
  },

  /**
   * 动态加载 JS 脚本
   */
  _loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = resolve;
      script.onerror = () => reject(new Error(`无法加载 ${src}`));
      document.head.appendChild(script);
    });
  },

  /**
   * File/Blob → Data URL
   */
  _fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  },

  /**
   * 销毁 Worker（释放内存）
   */
  async terminate() {
    if (this.worker) {
      await this.worker.terminate();
      this.worker = null;
      this.loading = false;
    }
  }
};
