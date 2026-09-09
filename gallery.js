const cards = [...document.querySelectorAll(".card")];
const filters = [...document.querySelectorAll("[data-filter]")];
const count = document.querySelector("#count");
filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((filter) => filter.setAttribute("aria-pressed", String(filter === button)));
    const category = button.dataset.filter;
    cards.forEach((card) => { card.hidden = category !== "all" && card.dataset.category !== category; });
    count.textContent = cards.filter((card) => !card.hidden).length + (category === "original" ? " 款 / PNG" : " 款 / SVG · PNG");
  });
});
const dialog = document.querySelector("dialog");
document.querySelectorAll(".preview").forEach((button) => {
  button.addEventListener("click", () => {
    const { name, path, format = "svg" } = button.dataset;
    document.querySelector("#preview-title").textContent = name;
    const image = document.querySelector("#preview-image");
    image.src = path + "." + format;
    image.alt = name + " CyberTrade Logo";
    const svgLink = document.querySelector("#preview-svg");
    svgLink.hidden = format !== "svg";
    if (format === "svg") svgLink.href = path + ".svg";
    else svgLink.removeAttribute("href");
    document.querySelector("#preview-png").href = path + ".png";
    dialog.showModal();
  });
});
document.querySelector(".close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
