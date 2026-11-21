let noticeHost, noticeRoot, currentResult, dismissedKey;
let previousKey = "";
let alertLanguage = resolveAlertLanguage();
const artURL = name => chrome.runtime.getURL("art/" + name);
const posterFont = new FontFace("HarisLocalPoster", "url(" + artURL("BarlowCondensed-Black.ttf") + ")", {weight:"900"});
const arabicFont = new FontFace("HarisLocalArabic", "url(" + artURL("Cairo.ttf") + ")", { weight: "200 1000" });
const requestedFonts = new Set();
const noticeStyle = `
:host{all:initial;color-scheme:light}*{box-sizing:border-box}
.sheet{--ink:#183f3d;--panel:#155d60;--paper:#f3e5d7;--line:#b8bcb1;font:16px/1.36 Arial,sans-serif;background:var(--paper);color:var(--ink);border:1px solid var(--panel);border-radius:5px;overflow:hidden;box-shadow:0 7px 28px #19272140}
.sheet.danger{--ink:#59271e;--panel:#762e25;--line:#ccafa3}
.poster{display:grid;grid-template-columns:54% 46%;min-height:150px;border-bottom:1px solid var(--panel)}
h2{align-self:stretch;display:flex;align-items:center;margin:0;padding:15px 16px 18px;background:var(--panel);color:#fff0e1;font:900 clamp(45px,6vw,70px)/.86 HarisLocalPoster,Impact,"Arial Narrow",Arial,sans-serif;letter-spacing:-.035em;text-transform:uppercase;white-space:pre-line;overflow-wrap:normal}
.art{position:relative;background:var(--panel);overflow:hidden}.art img{position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:contain;padding:12px}.body{padding:14px 18px 16px}
p{font:600 17px/1.32 Arial,sans-serif;margin:0 0 13px}
.actions{display:flex;align-items:center;gap:15px}button{font:inherit;color:inherit;cursor:pointer}.primary{background:var(--panel);color:#fff3e7;border:1px solid var(--panel);border-radius:3px;min-height:42px;padding:10px 19px;font:bold 15px Arial}
.why,.close{background:none;border:0;font:600 14px Arial;min-height:40px}.why{padding:8px 3px;text-decoration:underline;text-underline-offset:3px}.close{margin-inline-start:auto;padding:8px 3px;color:var(--ink)}
button:focus-visible,a:focus-visible{outline:3px solid var(--ink);outline-offset:3px}.facts{border-top:1px solid var(--line);margin-top:12px;padding-top:10px;font:14px/1.4 Arial}.facts dl{margin:8px 0}.facts dt{margin-top:6px}.facts dd{margin:0;font:700 13px/1.4 monospace;overflow-wrap:anywhere}.facts dd{direction:ltr;text-align:start;unicode-bidi:isolate}.facts a{color:var(--ink);font-weight:700}.facts[hidden]{display:none}
.sheet.calm .poster{min-height:98px;grid-template-columns:68% 32%}.sheet.calm h2{font-size:44px}
.sheet[dir=rtl],.sheet[dir=rtl] p,.sheet[dir=rtl] button,.sheet[dir=rtl] .facts{font-family:HarisLocalArabic,Arial,sans-serif}
.sheet[dir=rtl] h2{font:900 44px/1.12 HarisLocalArabic,Arial,sans-serif;letter-spacing:normal}
.sheet.calm[dir=rtl] h2{font-size:32px}
@media(max-width:420px){h2{font-size:53px}.poster{min-height:128px}}
`;
function hideNotice() { noticeHost?.remove(); noticeHost = noticeRoot = null; }
if (window === top) {
  const updateLanguage = preference => {
    const language = resolveAlertLanguage(preference);
    if (language === alertLanguage) return;
    alertLanguage = language;
    if (noticeHost?.isConnected) displayNotice(currentResult, true);
  };
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && changes[alertLanguageKey]) {
      updateLanguage(changes[alertLanguageKey].newValue);
    }
  });
  chrome.storage.local.get(alertLanguageKey).then(settings => {
    updateLanguage(settings[alertLanguageKey]);
  }).catch(() => {});
}

function displayNotice(result, force = false) {
  currentResult = result;
  const key = JSON.stringify(result);
  if (!result) { previousKey = ""; dismissedKey = null; hideNotice(); return; }
  if (!force && previousKey === key && (noticeHost?.isConnected || dismissedKey === key)) return;
  previousKey = key;
  if (force) dismissedKey = null;
  hideNotice();
  const font = alertLanguage === "ar" ? arabicFont : posterFont;
  if (!requestedFonts.has(font)) {
    requestedFonts.add(font);
    document.fonts.add(font);
    font.load().catch(() => {});
  }
  const danger = result.status === "mismatch", listed = result.status === "listed", code = result.kind === "code";
  const copy = alertCopy[alertLanguage];
  const variant = code
    ? (danger ? "codeMismatch" : listed ? "codeListed" : "codeUnknown")
    : (danger ? "mismatch" : listed ? "listed" : "unknown");
  const [heading, message] = copy[variant];
  noticeHost = document.createElement("div");
  noticeHost.style.cssText = "all:initial!important;position:fixed!important;top:16px!important;right:16px!important;width:min("+(danger ? "425" : "335")+"px,calc(100vw - 32px))!important;max-height:calc(100vh - 32px)!important;overflow:auto!important;z-index:2147483647!important";
  noticeRoot = noticeHost.attachShadow({mode:"closed"});
  noticeRoot.innerHTML = `<style>${noticeStyle}</style><aside class="sheet"><div class="poster"><h2></h2><div class="art"><img alt=""></div></div><div class="body"><p></p><div class="actions"></div><div class="facts" hidden><span class="reason"></span><dl></dl></div></div></aside>`;
  const get = q => noticeRoot.querySelector(q);
  const sheet = get("aside");
  sheet.lang = alertLanguage;
  sheet.dir = alertLanguage === "ar" ? "rtl" : "ltr";
  sheet.setAttribute("aria-label", copy.label);
  sheet.classList.add(danger ? "danger" : "calm");
  get("h2").setAttribute("role", danger ? "alert" : "status");
  get("h2").textContent = heading;
  get(".art img").src = artURL((code ? "voice" : listed ? "receipt" : "caution") + ".webp");
  get("p").textContent = message;
  get(".reason").textContent = danger ? copy.mismatchReason : listed ? copy.listedReason : copy.unknownReason;
  const dl = get("dl");
  const addresses = [[copy.page, location.hostname]];
  if (result.destination !== location.hostname) addresses.push([copy.field, result.destination]);
  if (danger || listed) addresses.push([copy.billing, demoOperator.billing]);
  for (const [label, value] of addresses) {
    const dt=document.createElement("dt"),dd=document.createElement("dd");
    dt.textContent=label;dd.textContent=value;dl.append(dt,dd);
  }
  if (danger && location.hostname === "paydesk.localhost") {
    const official = document.createElement("a"); const trusted = new URL("http://" + demoOperator.billing);
    trusted.port = location.port; official.href = trusted.href;
    official.textContent = copy.official;get(".facts").append(official);
  }
  function button(label,cls,cb) {
    const b=document.createElement("button");b.className=cls;b.textContent=label;b.onclick=cb;get(".actions").append(b);return b;
  }
  const dismiss = () => { dismissedKey = key; hideNotice(); };
  button(danger ? copy.leave : copy.gotIt,"primary",danger ? () => location.replace("about:blank") : dismiss);
  const why=button(copy.why,"why",() => {
    const facts=get(".facts");facts.hidden=!facts.hidden;why.setAttribute("aria-expanded",String(!facts.hidden));
  });
  why.setAttribute("aria-expanded","false");
  if(danger) button(copy.dismiss,"close",dismiss);
  document.documentElement.append(noticeHost);
}
