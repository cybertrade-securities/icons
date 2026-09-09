(() => {
  const button = document.querySelector("#download-bundle");
  const status = document.querySelector("#bundle-status");
  const encoder = new TextEncoder();
  const crcTable = Uint32Array.from({ length: 256 }, (_, value) => {
    for (let bit = 0; bit < 8; bit++) value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    return value >>> 0;
  });

  function crc32(bytes) {
    let crc = 0xffffffff;
    for (const byte of bytes) crc = crcTable[(crc ^ byte) & 255] ^ (crc >>> 8);
    return (crc ^ 0xffffffff) >>> 0;
  }

  // Store PNG and SVG bytes directly in a standard ZIP; PNGs are already compressed.
  function zip(files) {
    const entries = [];
    const directory = [];
    let offset = 0;
    let directorySize = 0;
    for (const { path, bytes } of files) {
      const name = encoder.encode(path);
      const crc = crc32(bytes);
      const local = new Uint8Array(30 + name.length);
      const localView = new DataView(local.buffer);
      localView.setUint32(0, 0x04034b50, true);
      localView.setUint16(4, 20, true);
      localView.setUint16(6, 0x0800, true);
      localView.setUint16(12, 0x0021, true);
      localView.setUint32(14, crc, true);
      localView.setUint32(18, bytes.length, true);
      localView.setUint32(22, bytes.length, true);
      localView.setUint16(26, name.length, true);
      local.set(name, 30);
      entries.push(local, bytes);

      const central = new Uint8Array(46 + name.length);
      const centralView = new DataView(central.buffer);
      centralView.setUint32(0, 0x02014b50, true);
      centralView.setUint16(4, 20, true);
      centralView.setUint16(6, 20, true);
      centralView.setUint16(8, 0x0800, true);
      centralView.setUint16(14, 0x0021, true);
      centralView.setUint32(16, crc, true);
      centralView.setUint32(20, bytes.length, true);
      centralView.setUint32(24, bytes.length, true);
      centralView.setUint16(28, name.length, true);
      centralView.setUint32(42, offset, true);
      central.set(name, 46);
      directory.push(central);
      directorySize += central.length;
      offset += local.length + bytes.length;
    }
    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);
    endView.setUint32(0, 0x06054b50, true);
    endView.setUint16(8, files.length, true);
    endView.setUint16(10, files.length, true);
    endView.setUint32(12, directorySize, true);
    endView.setUint32(16, offset, true);
    return new Blob([...entries, ...directory, end], { type: "application/zip" });
  }

  button.addEventListener("click", async () => {
    if (button.disabled) return;
    button.disabled = true;
    const paths = [...new Set([
      ...Array.from(document.querySelectorAll(".downloads a[download]"), link => link.getAttribute("href")),
      "assets/cybertrade-wordmark.svg",
      "assets/solid/palettes.csv",
      "assets/gradient/palettes.csv"
    ])];
    const files = [];
    status.textContent = "正在打包：0 / " + paths.length;
    try {
      for (let i = 0; i < paths.length; i += 4) {
        const batch = await Promise.all(paths.slice(i, i + 4).map(async (path) => {
          const response = await fetch(path);
          if (!response.ok) throw new Error("Asset download failed");
          return { path, bytes: new Uint8Array(await response.arrayBuffer()) };
        }));
        files.push(...batch);
        status.textContent = "正在打包：" + files.length + " / " + paths.length;
      }
      const url = URL.createObjectURL(zip(files));
      const link = document.createElement("a");
      link.href = url;
      link.download = "cybertrade-logos.zip";
      document.body.append(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      status.textContent = "已打包 " + files.length + " 个文件，下载已开始。";
    } catch {
      status.textContent = "部分文件下载失败，请检查网络后重试。";
    } finally {
      button.disabled = false;
    }
  });
})();
