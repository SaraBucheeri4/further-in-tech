(() => {
  let port, last, timer;
  function scan() {
    timer = undefined;
    const { top: data } = inspectCheckout();
    const next = JSON.stringify(data);
    if (next !== last && port) { try { port.postMessage(data); last = next; } catch { /* reconnect below */ } }
  }
  function schedule() { if (timer === undefined) timer = setTimeout(scan,50); }
  function connect() {
    if (!chrome.runtime?.id) return;
    port = chrome.runtime.connect({name:"scan"}); last = undefined;
    if (window === top) port.onMessage.addListener(({result}) => displayNotice(result));
    port.onDisconnect.addListener(() => { port = null; if (chrome.runtime?.id) setTimeout(connect,350); });
    scan();
  }
  new MutationObserver(schedule).observe(document,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:["class","style","hidden","aria-label","autocomplete","placeholder","name","type"]});
  window.addEventListener("resize", schedule);
  if (window === top) chrome.runtime.onMessage.addListener((msg,_,reply) => {
    if (msg.type !== "current") return;
    if (msg.show && currentResult) displayNotice(currentResult,true);
    reply(currentResult || null);
  });
  connect();
})();
