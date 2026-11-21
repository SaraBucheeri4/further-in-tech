const fields = document.querySelector(".fields");
if (location.pathname.endsWith("/neutral")) {
  document.title = "Sample page"; document.querySelector("main").innerHTML = "<h1>Reading room</h1><p>A plain page for the local check.</p>";
} else {
  if (location.hostname === "shop.localhost") {
    document.title = "Sample merchant"; document.querySelector("header span").textContent = "Sample merchant";
  }
  document.querySelector("#next").onclick = () => {
    fields.innerHTML = '<label for="code">One-time code</label><input id="code" autocomplete="one-time-code" readonly placeholder="— — — — — —"><button id="back">Back to sample bill</button>';
    document.querySelector("#back").onclick = () => location.reload();
  };
}
