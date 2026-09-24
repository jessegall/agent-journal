// The journal's own page and the extension, introduced. It runs only on the journal's origins, says
// "I am here" so the viewer hands its detached windows to the extension instead of drawing them,
// and carries the messages that follow from that.
(() => {
  const SOURCE = "journal-extension";

  // a dead extension (reloaded under this page) throws on every chrome.* call: asked safely, it answers nothing
  const ask = (msg, cb) => { try { chrome.runtime.sendMessage(msg, (got) => { void chrome.runtime.lastError; if (cb) cb(got); }); } catch (e) { if (cb) cb(null); } };
  function tell(kind, extra) {
    window.postMessage({ source: SOURCE, kind, ...(extra || {}) }, window.location.origin);
  }

  // THE PAGE ASKS, THE EXTENSION ANSWERS. A page cannot see an extension, so a viewer with no
  // extension gets no answer and keeps its own window — which is the right fallback, and the
  // reason the handshake exists at all.
  window.addEventListener("message", (e) => {
    if (e.source !== window || !e.data || e.data.source !== "journal-page") return;
    const kind = e.data.kind;
    // "here", with the windows this extension holds and the ones put back while no viewer was open
    if (kind === "hello") return ask({ kind: "holding" }, (got) => tell("here", got || {}));
    // the chat in the window asks for the page under it: point at an element, or send a picture of one
    if (kind === "point" || kind === "shot") return ask({ kind });
    if (kind === "outbox-get") return ask({ kind }, (got) => tell("outbox", { request: e.data.request, value: got && got.value }));
    if (kind === "outbox-set") return ask({ kind, value: e.data.value }, (got) => tell("outbox", { request: e.data.request, value: !!(got && got.ok) }));
    if (kind === "hold") return ask({ kind, id: e.data.id, view: e.data.view, env: e.data.env, box: e.data.box }, (got) => tell(got && got.ok ? "held" : "failed", { id: e.data.id }));
    if (kind === "release") return ask({ kind, id: e.data.id, dock: !!e.data.dock });
    if (kind === "docked") return ask({ kind, ids: e.data.ids || [] });
  });

  ask({ kind: "holding" }, (got) => tell("here", got || {}));   // in case the page was listening before we loaded
})();
