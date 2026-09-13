// Chinese and English copy for the gallery, and the switch between them.
//
// The page ships in Chinese so it still reads correctly without JavaScript. Every
// translated element carries data-i18n (its text) or data-i18n-attr (attributes,
// as "attribute:key" pairs), and the key names an entry below. data-i18n replaces
// only the element's first text node, so an arrow or a count inside a child
// element stays where it is and keeps its own styling.
//
// A value is a string, or a function: applied to the page it receives the element,
// and called from the other scripts it receives whatever they pass.
//
// The language comes from ?lang=, then the visitor's last choice, then the browser's
// first preferred language. Choosing one writes ?lang= back so the address is
// shareable, and fires "i18n:change" so scripts holding dynamic text can re-render.
(() => {
  const storageKey = "cybertrade-icons-language";
  const htmlLanguages = { zh: "zh-CN", en: "en" };

  const messages = {
    zh: {
      metaDescription: "CyberTrade Logo 配色图库：28 款设计与原版素材，包含纯色、渐变、SVG 和高清 PNG 下载。",
      customJump: "自定义 Logo 配色 ↘",
      heroLead: "同一字形，",
      heroAccent: "不同光谱。",
      heroDescription: "28 款 CyberTrade Logo 与原版素材。探索纯色、极光与金属质感，找到属于你的配色。",
      downloadAll: "下载全部配色",
      heroAlt: "极光青紫渐变 CyberTrade Logo",
      heroExplore: "探索配色 ↓",
      bundleProgress: (done, total) => "正在打包：" + done + " / " + total,
      bundleDone: (count) => "已打包 " + count + " 个文件，下载已开始。",
      bundleFailed: "部分文件下载失败，请检查网络后重试。",

      galleryLabel: "Logo 配色图库",
      categoriesLabel: "配色分类",
      filterAll: "全部",
      filterGradient: "渐变",
      filterSolid: "纯色",
      filterOriginal: "原版",
      countSvgPng: (count) => count + " 款 / SVG · PNG",
      countPng: (count) => count + " 款 / PNG",
      enlarge: (element) => "放大预览 " + element.dataset.name,
      colors: "配色",
      downloadSvg: "下载 SVG",
      downloadPng: "下载 PNG",
      downloadOriginalPng: "下载原图 PNG",
      originalAsset: "原版素材",
      "solid.midnight-gold": "黑金",
      "solid.navy-mint": "深蓝薄荷",
      "solid.ivory-ink": "米白墨色",
      "solid.cobalt-white": "钴蓝白",
      "solid.forest-cream": "森林绿奶油",
      "solid.violet-lavender": "紫色薰衣草",
      "solid.burgundy-rose": "酒红浅粉",
      "solid.sand-espresso": "沙色咖啡",
      "solid.charcoal-ice": "炭黑冰蓝",

      customTitle: "手搓你的 CyberTrade",
      customDescription: "自由搭配背景与字色，拖动方向，实时查看渐变效果。",
      customReset: "重置配色",
      customPreviewAlt: "自定义 CyberTrade Logo 实时预览",
      customPreviewCaption: "原版字形 / 1024 × 1024",
      background: "背景",
      wordmarkColor: "Logo 字色",
      fillMode: "填充方式",
      fillSolid: "纯色",
      fillLinear: "线性渐变",
      fillRadial: "径向渐变",
      startColor: "起始颜色",
      endColor: "结束颜色",
      direction: "方向",
      directionHint: "0° 向右 · 90° 向下 · 180° 向左 · 270° 向上",
      customSvg: "下载 SVG ↓",
      customPng: "下载 PNG ↓",
      customLoading: "正在加载原版 Logo…",
      customReady: "实时预览 · SVG 可无损缩放 · PNG 为 1024 × 1024",
      customLoadFailed: "原版 Logo 加载失败，请刷新页面重试。",
      customExporting: "正在导出 PNG…",
      customExported: "PNG 已导出 · 1024 × 1024",
      customExportFailed: "PNG 导出失败，请重试或下载 SVG。",

      footerFormats: "原始尺寸 PNG · 可缩放 SVG",
      closePreview: "关闭预览",
      previewSvg: "下载 SVG ↗",
      previewPng: "下载 PNG ↗"
    },
    en: {
      metaDescription: "CyberTrade logo colorway gallery: 28 designs and original assets in solid and gradient editions, with SVG and high-resolution PNG downloads.",
      customJump: "Customize logo colors ↘",
      heroLead: "One wordmark,",
      heroAccent: "many spectra.",
      heroDescription: "28 CyberTrade logos and original assets. Explore solid, aurora and metallic finishes and find a colorway of your own.",
      downloadAll: "Download all colorways",
      heroAlt: "CyberTrade logo in the Aurora cyan-to-violet gradient",
      heroExplore: "EXPLORE COLORWAYS ↓",
      bundleProgress: (done, total) => "Packing " + done + " / " + total + "…",
      bundleDone: (count) => "Packed " + count + " files. Your download has started.",
      bundleFailed: "Some files failed to download. Check your connection and try again.",

      galleryLabel: "Logo colorway gallery",
      categoriesLabel: "Colorway categories",
      filterAll: "All",
      filterGradient: "Gradient",
      filterSolid: "Solid",
      filterOriginal: "Original",
      countSvgPng: (count) => count + (count === 1 ? " design" : " designs") + " / SVG · PNG",
      countPng: (count) => count + (count === 1 ? " design" : " designs") + " / PNG",
      enlarge: (element) => "Enlarge " + element.dataset.name,
      colors: "Colors",
      downloadSvg: "Download SVG",
      downloadPng: "Download PNG",
      downloadOriginalPng: "Download original PNG",
      originalAsset: "ORIGINAL ASSET",
      "solid.midnight-gold": "SOLID / BLACK & GOLD",
      "solid.navy-mint": "SOLID / NAVY & MINT",
      "solid.ivory-ink": "SOLID / IVORY & INK",
      "solid.cobalt-white": "SOLID / COBALT & WHITE",
      "solid.forest-cream": "SOLID / FOREST GREEN & CREAM",
      "solid.violet-lavender": "SOLID / VIOLET & LAVENDER",
      "solid.burgundy-rose": "SOLID / BURGUNDY & ROSE",
      "solid.sand-espresso": "SOLID / SAND & ESPRESSO",
      "solid.charcoal-ice": "SOLID / CHARCOAL & ICE BLUE",

      customTitle: "Craft your own CyberTrade",
      customDescription: "Pair any background and wordmark colors, set the direction, and watch the gradient update live.",
      customReset: "Reset colors",
      customPreviewAlt: "Live preview of your custom CyberTrade logo",
      customPreviewCaption: "ORIGINAL WORDMARK / 1024 × 1024",
      background: "Background",
      wordmarkColor: "Wordmark color",
      fillMode: "Fill",
      fillSolid: "Solid",
      fillLinear: "Linear gradient",
      fillRadial: "Radial gradient",
      startColor: "Start color",
      endColor: "End color",
      direction: "Direction",
      directionHint: "0° right · 90° down · 180° left · 270° up",
      customSvg: "Download SVG ↓",
      customPng: "Download PNG ↓",
      customLoading: "Loading the original wordmark…",
      customReady: "Live preview · SVG scales losslessly · PNG is 1024 × 1024",
      customLoadFailed: "Couldn't load the original wordmark. Refresh the page to try again.",
      customExporting: "Exporting PNG…",
      customExported: "PNG exported · 1024 × 1024",
      customExportFailed: "PNG export failed. Try again, or download the SVG.",

      footerFormats: "ORIGINAL-SIZE PNG · SCALABLE SVG",
      closePreview: "Close preview",
      previewSvg: "Download SVG ↗",
      previewPng: "Download PNG ↗"
    }
  };

  const isLanguage = (value) => Object.hasOwn(messages, value);

  function initialLanguage() {
    const requested = new URLSearchParams(location.search).get("lang");
    if (isLanguage(requested)) return requested;
    try {
      const saved = localStorage.getItem(storageKey);
      if (isLanguage(saved)) return saved;
    } catch {
      // Storage can be unavailable (private windows, blocked site data); the
      // browser's language is still a sensible answer.
    }
    const preferred = (navigator.languages && navigator.languages[0]) || navigator.language || "";
    return /^zh\b/i.test(preferred) ? "zh" : "en";
  }

  let language = initialLanguage();

  function t(key, ...args) {
    const value = Object.hasOwn(messages[language], key) ? messages[language][key] : messages.zh[key];
    if (value === undefined) {
      console.warn("i18n: missing key " + key);
      return key;
    }
    return typeof value === "function" ? value(...args) : value;
  }

  // Replaces the trimmed content of the first non-blank text node, keeping the
  // whitespace around it so "下载 SVG <span>↗</span>" keeps its space.
  function replaceText(element, text) {
    const node = Array.from(element.childNodes).find(
      (child) => child.nodeType === Node.TEXT_NODE && child.nodeValue.trim()
    );
    if (node) node.nodeValue = node.nodeValue.replace(/\S(?:[\s\S]*\S)?/, () => text);
    else if (!element.children.length) element.textContent = text;
    else element.prepend(text);
  }

  function apply() {
    document.documentElement.lang = htmlLanguages[language];
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      replaceText(element, t(element.dataset.i18n, element));
    });
    document.querySelectorAll("[data-i18n-attr]").forEach((element) => {
      for (const pair of element.dataset.i18nAttr.split(",")) {
        const [attribute, key] = pair.split(":").map((part) => part.trim());
        element.setAttribute(attribute, t(key, element));
      }
    });
    document.querySelectorAll("[data-lang]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.lang === language));
    });
  }

  function setLanguage(next) {
    if (!isLanguage(next) || next === language) return;
    language = next;
    try {
      localStorage.setItem(storageKey, next);
    } catch {
      // The choice still applies to this page view and to the address below.
    }
    const url = new URL(location.href);
    url.searchParams.set("lang", next);
    history.replaceState(history.state, "", url);
    apply();
    document.dispatchEvent(new CustomEvent("i18n:change", { detail: { language } }));
  }

  document.querySelectorAll("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.lang));
  });

  window.i18n = {
    t,
    setLanguage,
    get language() {
      return language;
    }
  };

  apply();
})();
