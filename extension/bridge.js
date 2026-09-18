// The journal's own page and the extension, introduced. It runs only on the journal's origins, says
// "I am here" so the viewer can offer the extension's window instead of its own, and carries the
// two messages that follow from that.
(() => {
  const SOURCE = "journal-extension";

  function tell(kind, extra) {
    window.postMessage({ source: SOURCE, kind, ...(extra || {}) }, window.location.origin);
  }

  // THE PAGE ASKS, THE EXTENSION ANSWERS. A page cannot see an extension, so a viewer with no
  // extension gets no answer and keeps its own window — which is the right fallback, and the
  // reason the handshake exists at all.
  window.addEventListener("message", (e) => {
    if (e.source !== window || !e.data || e.data.source !== "journal-page") return;
    const kind = e.data.kind;
    // "here", and whether the chat has been handed to this extension: after a reload the page has
    // forgotten, and the window over it is the extension's to restore, not the page's to draw again
    if (kind === "hello") return chrome.runtime.sendMessage({ kind: "following" }, (got) => tell("here", { holding: !!(got && got.on) }));
    // the chat in the window asks for the page under it: point at an element, or send a picture of one
    if (kind === "point" || kind === "shot") return chrome.runtime.sendMessage({ kind });
    if (kind === "detach" || kind === "attach") {
      chrome.runtime.sendMessage({ kind: "follow", on: kind === "detach" }, (got) => {
        if (chrome.runtime.lastError) return tell("failed");
        tell(kind === "detach" ? "detached" : "attached", { everywhere: !!(got && got.everywhere) });
      });
    }
  });

  chrome.runtime.sendMessage({ kind: "following" }, (got) => tell("here", { holding: !!(got && got.on) }));   // in case the page was listening before we loaded
})();
