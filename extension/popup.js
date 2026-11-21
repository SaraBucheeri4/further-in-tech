(async () => {
  const status = document.querySelector("#status");
  const description = document.querySelector("#description");
  const hostname = document.querySelector("#hostname");
  const scan = document.querySelector("#scan");
  const show = document.querySelector("#show");
  const selector = document.querySelector("#language");
  let language = resolveAlertLanguage();
  let verdict = { headline: "scanIntro" };
  let scanning = false;

  function render() {
    const copy = alertCopy[language];
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.querySelector("#title").textContent = copy.label;
    document.querySelector("#language-label").textContent = copy.language;
    document.querySelector("#privacy").textContent = copy.privacy;
    status.textContent = copy[verdict.headline];
    status.dataset.result = verdict.tone || "";
    description.textContent = verdict.detail ? copy[verdict.detail] : "";
    description.hidden = !verdict.detail;
    hostname.textContent = verdict.host || "";
    hostname.hidden = !verdict.host;
    scan.textContent = copy.scan;
    scan.disabled = scanning;
    show.textContent = copy.show;
    selector.value = language;
  }

  async function activeTab() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    return tab;
  }

  const sendToPage = (tabId, reopen) => chrome.tabs.sendMessage(
    tabId, { type: "current", show: reopen }, { frameId: 0 }
  );

  async function updateAlertButton(tabId) {
    try {
      show.hidden = !(await sendToPage(tabId, false));
    } catch {
      show.hidden = true;
    }
  }

  function readVerdict({ top, reports, incomplete }) {
    const result = decide(top.host, reports);
    if (result?.status === "mismatch") {
      return { headline: "mismatchResult", detail: "mismatchDetail", tone: "danger", host: top.host };
    }
    const listedHost = demoOperator.providers.includes(top.host);
    if (!incomplete && (result?.status === "listed" || (!result && listedHost))) {
      return { headline: "listedResult", detail: "listedDetail", tone: "listed", host: top.host };
    }
    const detail = incomplete ? "frameDetail" : result ? "unknownDetail" : "noPrompt";
    return { headline: "unknownResult", detail, host: top.host };
  }

  const settings = await chrome.storage.local.get(alertLanguageKey);
  language = resolveAlertLanguage(settings[alertLanguageKey]);
  render();

  selector.onchange = async () => {
    language = resolveAlertLanguage(selector.value);
    render();
    await chrome.storage.local.set({ [alertLanguageKey]: language });
  };

  scan.onclick = async () => {
    scanning = true;
    verdict = { headline: "checking" };
    render();
    let tab;
    try {
      tab = await activeTab();
      const [injection] = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: inspectCheckout,
        args: [true]
      });
      verdict = readVerdict(injection.result);
    } catch {
      verdict = { headline: "unknownResult", detail: "limited" };
    } finally {
      scanning = false;
      render();
    }
    if (tab?.id !== undefined) await updateAlertButton(tab.id);
  };

  show.onclick = async () => {
    try {
      const tab = await activeTab();
      if (await sendToPage(tab.id, true)) window.close();
      else throw new Error("The alert is no longer available.");
    } catch {
      show.hidden = true;
      verdict = { headline: "changed" };
      render();
    }
  };

  const tab = await activeTab();
  if (tab?.id !== undefined) await updateAlertButton(tab.id);
})();
