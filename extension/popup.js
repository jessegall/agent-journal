const env = document.getElementById("env");
const where = document.getElementById("where");

chrome.runtime.sendMessage({ kind: "where" }, (got) => {
  if (!got || !got.url) {
    where.textContent = "No journal viewer is running. Start one with `journal serve`.";
    env.disabled = true;
    return;
  }
  where.textContent = got.url;
  env.replaceChildren(...(got.envs || []).map((name) => {
    const option = document.createElement("option");
    option.value = option.textContent = name;
    option.selected = name === got.env;
    return option;
  }));
});

env.addEventListener("change", () => chrome.storage.local.set({ env: env.value }));
document.getElementById("point").addEventListener("click", () => {
  chrome.runtime.sendMessage({ kind: "point" }, () => window.close());
});
document.getElementById("chat").addEventListener("click", () => {
  chrome.runtime.sendMessage({ kind: "chat" }, () => window.close());
});
