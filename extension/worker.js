importScripts("directory.js");

// Ports belong to individual documents and disconnect when their frame disappears.
const tabs = new Map();
function refresh(frames) {
  const main = [...frames.values()].find(frame => frame.main);
  if (!main) return;
  const result = decide(main.host, [...frames.values()].filter(f => f.data).map(f => ({...f.data, host: f.host})));
  try { main.port.postMessage({ result }); } catch { /* The tab closed. */ }
}
chrome.runtime.onConnect.addListener(port => {
  const sender = port.sender;
  if (port.name !== "scan" || !sender?.tab || !sender.url) return;
  const id = sender.tab.id;
  const frames = tabs.get(id) || new Map();
  tabs.set(id, frames);
  const frame = { main: sender.frameId === 0, host: new URL(sender.url).hostname, port };
  frames.set(port, frame);
  port.onMessage.addListener(data => { frame.data = data; refresh(frames); });
  port.onDisconnect.addListener(() => {
    frames.delete(port);
    if (frames.size) refresh(frames);
    else tabs.delete(id);
  });
});
