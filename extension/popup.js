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
    fill(journal, got.journals.map((j) => ({ value: j.url, label: j.project })), got.url);
    fill(env, got.envs, got.env);
    tell(`${got.journals.length} journal${got.journals.length === 1 ? "" : "s"} running · ${got.url}`);
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
