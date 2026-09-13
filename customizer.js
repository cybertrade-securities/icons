(() => {
  const form = document.querySelector("#custom-controls");
  const preview = document.querySelector("#custom-image");
  const status = document.querySelector("#custom-status");
  const svgButton = document.querySelector("#custom-svg");
  const pngButton = document.querySelector("#custom-png");
  let wordmark = "";
  let currentSvg = "";
  let exporting = false;
  // The status line is re-rendered when the language changes, so it keeps the key
  // rather than the text.
  let statusKey = "customLoading";

  function setStatus(key) {
    statusKey = key;
    status.textContent = i18n.t(key);
  }

  function fill(id) {
    const mode = document.querySelector("#" + id + "-mode").value;
    const start = document.querySelector("#" + id + "-start").value;
    const end = document.querySelector("#" + id + "-end").value;
    const angle = Number(document.querySelector("#" + id + "-angle").value);
    document.querySelector("#" + id + "-start-value").value = start.toUpperCase();
    document.querySelector("#" + id + "-end-value").value = end.toUpperCase();
    document.querySelector("#" + id + "-angle-value").value = angle + "°";
    document.querySelector("#" + id + "-end-control").hidden = mode === "solid";
    document.querySelector("#" + id + "-angle-control").hidden = mode !== "linear";
    if (mode === "solid") return { definition: "", paint: start };
    const stops = '<stop stop-color="' + start + '"/><stop offset="1" stop-color="' + end + '"/>';
    if (mode === "radial") {
      return { definition: '<radialGradient id="' + id + '" cx="50%" cy="50%" r="70.71%">' + stops + '</radialGradient>', paint: "url(#" + id + ")" };
    }
    const radians = angle * Math.PI / 180;
    const x = Math.cos(radians) * 50;
    const y = Math.sin(radians) * 50;
    return {
      definition: '<linearGradient id="' + id + '" x1="' + (50 - x) + '%" y1="' + (50 - y) + '%" x2="' + (50 + x) + '%" y2="' + (50 + y) + '%">' + stops + '</linearGradient>',
      paint: "url(#" + id + ")"
    };
  }

  function update() {
    if (!wordmark) return;
    const background = fill("bg");
    const foreground = fill("fg");
    currentSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="1024" height="1024" viewBox="0 0 1024 1024"><title>CyberTrade — Custom Colorway</title><defs>' +
      background.definition + foreground.definition +
      '<mask id="wordmark" maskUnits="userSpaceOnUse" x="0" y="0" width="1024" height="1024"><svg x="102" y="392" width="820" height="240" viewBox="18 76 164 48">' +
      wordmark + '</svg></mask></defs><rect width="1024" height="1024" fill="' + background.paint +
      '"/><rect x="102" y="392" width="820" height="240" fill="' + foreground.paint + '" mask="url(#wordmark)"/></svg>';
    preview.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(currentSvg);
  }

  function download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
  }

  form.addEventListener("submit", (event) => event.preventDefault());
  form.addEventListener("input", update);
  form.addEventListener("change", update);
  document.querySelector("#custom-reset").addEventListener("click", () => {
    form.reset();
    update();
  });
  svgButton.addEventListener("click", () => {
    if (!currentSvg) return;
    download(new Blob([currentSvg], { type: "image/svg+xml;charset=utf-8" }), "cybertrade-custom.svg");
  });
  pngButton.addEventListener("click", async () => {
    if (!currentSvg || exporting) return;
    exporting = true;
    pngButton.disabled = true;
    setStatus("customExporting");
    try {
      const image = new Image();
      image.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(currentSvg);
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 1024;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas unavailable");
      context.drawImage(image, 0, 0, 1024, 1024);
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      if (!blob) throw new Error("PNG export failed");
      download(blob, "cybertrade-custom.png");
      setStatus("customExported");
    } catch {
      setStatus("customExportFailed");
    } finally {
      exporting = false;
      pngButton.disabled = false;
    }
  });

  async function initialize() {
    try {
      const response = await fetch("assets/cybertrade-wordmark.svg");
      if (!response.ok) throw new Error("Wordmark unavailable");
      const source = new DOMParser().parseFromString(await response.text(), "image/svg+xml");
      const group = source.querySelector("g");
      if (source.querySelector("parsererror") || !group) throw new Error("Invalid wordmark");
      group.querySelectorAll("path").forEach((path) => path.setAttribute("fill", "#ffffff"));
      wordmark = new XMLSerializer().serializeToString(group);
      update();
      svgButton.disabled = pngButton.disabled = false;
      setStatus("customReady");
    } catch {
      setStatus("customLoadFailed");
    }
  }
  document.addEventListener("i18n:change", () => setStatus(statusKey));
  setStatus(statusKey);
  initialize();
})();
