const cases = {
  mismatch: [
    "The address doesn’t match",
    "The page says Pearl Mobile but uses a different billing address. The alert gives you a quick way out.",
    "Look out alert with a metal caution sign"
  ],
  listed: [
    "The address is on the list",
    "Haris found this billing address in the demo list. Check the amount before you pay.",
    "Listed site alert with a metal receipt"
  ],
  code: [
    "The page asks for a code",
    "The warning changes as soon as a code field appears on the mismatched page.",
    "Code alert with a metal speech bubble"
  ]
};

const capture = document.querySelector("#capture");
const language = document.querySelector("#preview-language");
const examples = [...document.querySelectorAll("[data-case]")];
let selectedCase = "mismatch";

function showExample() {
  const [heading, description, alt] = cases[selectedCase];
  const arabic = language.value === "ar";
  document.querySelector("#case-heading").textContent = heading;
  document.querySelector("#case-description").textContent = description;
  capture.alt = (arabic ? "Arabic " : "English ") + alt + " on a sample checkout";
  capture.src = "assets/chrome-" + selectedCase + (arabic ? "-ar" : "") + ".png";
  const figure = capture.parentElement;
  figure.classList.remove("swap");
  void figure.offsetWidth;
  figure.classList.add("swap");
}

for (const button of examples) {
  button.addEventListener("click", () => {
    selectedCase = button.dataset.case;
    for (const other of examples) other.setAttribute("aria-pressed", String(other === button));
    showExample();
  });
}
language.addEventListener("change", showExample);

const viewer = document.querySelector("#viewer");
document.querySelector("#expand").onclick = () => {
  const img = document.querySelector("#large-image");
  img.src = capture.src;
  img.alt = capture.alt;
  viewer.showModal();
};
document.querySelector("#close").onclick = () => viewer.close();
viewer.onclick = event => { if (event.target === viewer) viewer.close(); };
if (["localhost", "127.0.0.1"].includes(location.hostname)) {
  document.querySelector("#fixture-note").textContent = "Load the extension in desktop Chrome, then choose an example.";
  for (const link of document.querySelectorAll("[data-host]")) {
    const address = new URL(location.origin);
    address.hostname = link.dataset.host;
    link.href = address.href;
  }
}
