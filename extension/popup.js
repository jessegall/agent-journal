const journal = document.getElementById("journal");
const env = document.getElementById("env");
const said = document.getElementById("said");

function tell(text, how) {
  said.textContent = text;
  said.className = `said${how ? ` ${how}` : ""}`;
}

function fill(select, names, chosen) {
  select.replaceChildren(...names.map((name) => {
    const option = document.createElement("option");
    option.value = name.value === undefined ? name : name.value;
    option.textContent = name.label === undefined ? name : name.label;
    option.selected = option.value === chosen;
    return option;
  }));
  select.disabled = !names.length;
}

function load(fresh) {
  tell(fresh ? "Looking again…" : "Looking for journals…");
  chrome.runtime.sendMessage({ kind: "where", fresh: !!fresh }, (got) => {
    if (!got || got.why) {
      fill(journal, []);
      fill(env, []);
      return tell((got && got.why) || "The extension could not answer.", "bad");
    }
    // NOTHING HERE TRUSTS THE ANSWER'S SHAPE. The popup and the service worker are reloaded
    // separately, so a popup can be talking to the version that was running before the reload.
    const found = Array.isArray(got.journals) ? got.journals : [];
    fill(journal, found.map((j) => ({ value: j.url, label: j.project || j.url })), got.url);
    fill(env, Array.isArray(got.envs) ? got.envs : [], got.env);
    tell(`${found.length || 1} journal${found.length === 1 ? "" : "s"} running · ${got.url}`);
  });
}

journal.addEventListener("change", () => {
  chrome.runtime.sendMessage({ kind: "pick", url: journal.value, env: "" }, () => load(true));
});
env.addEventListener("change", () => {
  chrome.runtime.sendMessage({ kind: "pick", url: journal.value, env: env.value }, () => {
    tell(`Messages go to ${env.value}.`, "good");
  });
});
document.getElementById("again").addEventListener("click", () => load(true));
document.getElementById("test").addEventListener("click", () => {
  tell("Sending…");
  chrome.runtime.sendMessage({ kind: "test" }, (got) => {
    if (got && got.ok) return tell(`Sent to ${got.project} · ${got.env}.`, "good");
    tell((got && got.why) || "It did not send.", "bad");
  });
});
document.getElementById("point").addEventListener("click", () => {
  chrome.runtime.sendMessage({ kind: "point" }, (got) => {
    if (got && got.ok) return window.close();
    tell((got && got.why) || "This page cannot be pointed at.", "bad");
  });
});
document.getElementById("chat").addEventListener("click", () => {
  chrome.runtime.sendMessage({ kind: "chat" }, (got) => {
    if (got && got.ok) return window.close();
    tell((got && got.why) || "This page cannot hold the chat window.", "bad");
  });
});

load(false);
