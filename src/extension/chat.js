// THE SHELL, AND NOTHING THE USER LOOKS AT. The window is a frame of the journal's own viewer,
// which draws the bar, the switches, the fold and the close itself; this file makes the frame,
// places it, keeps its box, and obeys what the page inside asks — so a change to the window's
// look is a journal upgrade and never an extension reload.
(() => {
  const ID = "__journal-chat-window";
  // NOTHING HERE MAY THROW. An extension reloaded under an open page leaves this script with a dead
  // chrome.*: every call would throw "context invalidated". Each one is wrapped, and a dead call is
  // simply a call that did nothing — the window stays where it is and closes when the user says.
  const ask = (msg, cb) => { try { chrome.runtime.sendMessage(msg, (got) => { void chrome.runtime.lastError; if (cb) cb(got); }); } catch (e) { if (cb) cb(null); } };
  const stored = (key) => { try { return chrome.storage.local.get(key).catch(() => ({})); } catch (e) { return Promise.resolve({}); } };
  const store = (value) => { try { chrome.storage.local.set(value).catch(() => {}); } catch (e) { /* not remembered, not fatal */ } };
  const onJournal = /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(window.location.origin);
  const tellBackground = (kind, extra) => {
    // CLOSED ON THE JOURNAL'S OWN PAGE IS PUTTING THE CHAT BACK, which is the one close that reaches
    // every tab; closed anywhere else is this tab's alone, and the others keep their windows.
    if (kind === "closed" && onJournal) {
      ask({ kind: "follow", on: false });
      try { window.postMessage({ source: "journal-extension", kind: "attached" }, window.location.origin); } catch (e) { /* nothing to tell */ }
      return;
    }
    ask({ kind, ...(extra || {}) });
  };
  const old = document.getElementById(ID);
  if (old) {                                        // the shortcut toggles: press it again to close
    old.remove();
    tellBackground("closed");
    return;
  }
  tellBackground("opened");

  const host = document.createElement("div");
  host.id = ID;
  host.style.cssText = "position:fixed;inset:0;z-index:2147483647;pointer-events:none";
  const shade = host.attachShadow({ mode: "open" });   // the page's CSS cannot reach in here
  document.documentElement.append(host);

  const frame = document.createElement("div");
  frame.className = "win";
  frame.innerHTML = `
    <style>
      :host { all: initial; }
      .win { position: absolute; display: flex; flex-direction: column; overflow: hidden;
        min-width: 320px; min-height: 260px; pointer-events: auto;
        border: 1px solid #2a2d33; border-radius: 12px; background: #0e1013;
        box-shadow: 0 24px 60px rgba(0,0,0,.5); }
      .win.shut { height: auto !important; min-height: 0; }
      .win.shut .body { flex: none !important; height: 86px !important; }
      .win.shut .grip { display: none; }
      .win.dragging iframe { pointer-events: none; }
      .body { flex: 1; display: flex; min-height: 0; }
      iframe { flex: 1; width: 100%; border: 0; background: #0e1013; }
      .grip { position: absolute; right: 2px; bottom: 2px; width: 14px; height: 14px; cursor: nwse-resize; }
      .grip::after { content: ""; position: absolute; right: 3px; bottom: 3px; width: 7px; height: 7px;
        border-right: 2px solid #3a3d44; border-bottom: 2px solid #3a3d44; }
      .grip:hover::after { border-color: #6c8cff; }
      .none { display: flex; align-items: center; justify-content: center; flex: 1; padding: 20px;
        text-align: center; color: #9aa0a8; font: 12px/1.45 -apple-system, system-ui, sans-serif; }
      /* A BAR OF LAST RESORT. The page draws the bar — unless it is an older journal that cannot;
         then this one appears, enough to drag, go back to the last journal, and close. */
      .fallback { display: none; align-items: center; gap: 8px; height: 32px; padding: 0 6px 0 10px; cursor: grab;
        border-bottom: 1px solid #1d2026; background: #14161a; color: #9aa0a8; user-select: none;
        font: 500 11.5px/1 -apple-system, system-ui, sans-serif; }
      .win.bare .fallback { display: flex; }
      .fallback .name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
      .fallback button { border: 0; border-radius: 6px; padding: 3px 7px; background: transparent; color: #9aa0a8; font: inherit; cursor: pointer; }
      .fallback button:hover { background: #1e222a; color: #e6e8ec; }
    </style>
    <div class="fallback"><span class="name">journal</span><button class="back" title="Back to the last journal">←</button><button class="x" title="Close">×</button></div>
    <div class="body"></div>
    <div class="grip"></div>`;
  shade.append(frame);
  const body = shade.querySelector(".body");

  const place = (box) => {
    frame.style.left = `${box.x}px`;
    frame.style.top = `${box.y}px`;
    frame.style.width = `${box.w}px`;
    frame.style.height = `${box.h}px`;
  };
  const fallback = {
    x: Math.max(12, window.innerWidth - 452), y: 72,
    w: 440, h: Math.min(680, Math.max(360, window.innerHeight - 140)),
  };
  let box = { ...fallback };
  place(box);
  let view = null;
  const tellPage = (extra) => { if (view && view.contentWindow) view.contentWindow.postMessage({ source: "journal-extension", kind: "shell", ...extra }, "*"); };
  const setShut = (on) => {
    box.shut = !!on;
    frame.classList.toggle("shut", box.shut);
    tellPage({ shut: box.shut });
  };
  stored("window").then((got) => {
    if (got && got.window) {
      box = { ...fallback, ...got.window };
      box.x = Math.min(Math.max(0, box.x), Math.max(0, window.innerWidth - 120));
      box.y = Math.min(Math.max(0, box.y), Math.max(0, window.innerHeight - 60));
      place(box);
      setShut(box.shut);
    }
  });
  const remember = () => store({ window: box });
  // WHAT ANOTHER TAB DID, DONE HERE TOO. The box and the open flag live in the extension's storage;
  // a change from any tab arrives as a change event, and this window follows it.
  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "local" || !document.getElementById(ID)) return;
      if (changes.chatOpen && changes.chatOpen.newValue === false) { host.remove(); return; }
      // the shared choice changed (the popup, or a pick with no tab): a window on no choice of its own follows it
      if (changes.url || changes.env) ask({ kind: "where" }, (got) => { if (got && got.url && view && !view.src.startsWith(got.url)) load(true); });
      if (changes.window && changes.window.newValue) {
        box = { ...box, ...changes.window.newValue };
        place(box);
        setShut(box.shut);
      }
    });
  } catch (e) { /* no storage events here: this window keeps to itself */ }

  let lastUrl = "";                                 // the journal before the current one, for the fallback's way back
  const expectHello = () => {
    // THE BAR IS THERE FROM THE FIRST FRAME: the shell's own, until the page says hello and draws
    // its own in the same place — on a current journal that is a moment, on an older one never.
    frame.classList.add("bare");
  };
  const load = (fresh) => ask({ kind: "where", fresh: !!fresh }, (got) => {
    body.innerHTML = "";
    view = null;
    if (!got || !got.url) {
      body.innerHTML = `<div class="none">${(got && got.why) || "No journal viewer is running."}</div>`;
      frame.classList.add("bare");
      return;
    }
    shade.querySelector(".fallback .name").textContent = [got.project, got.env].filter(Boolean).join(" · ") || "journal";
    view = document.createElement("iframe");
    view.src = got.env ? `${got.url}/?chat#/${got.env}` : `${got.url}/?chat`;
    body.append(view);
    expectHello();
  });
  load(false);
  shade.querySelector(".fallback .x").addEventListener("click", () => { host.remove(); tellBackground("closed"); });
  shade.querySelector(".fallback .back").addEventListener("click", () => {
    if (lastUrl) ask({ kind: "pick", url: lastUrl, env: "" }, () => load(true));
  });
  shade.querySelector(".fallback").addEventListener("pointerdown", (e) => {
    if (e.target.tagName === "BUTTON") return;
    e.preventDefault();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* the document listeners still do */ }
    dragWindow(e.screenX, e.screenY);
  });

  // DRAGGING IS ON THE DOCUMENT, NOT THE BAR — the bar is inside the frame, in another origin, so
  // what arrives from it is a start in screen coordinates; from there the pointer is on this document,
  // the frame muted, and screen coordinates are the one system both sides share.
  let live = null;                                  // the drag in progress: where it started, and how it moves the box
  const drag = (sx, sy, move) => {
    const from = { sx, sy, ...box };
    frame.classList.add("dragging");
    const step = (ev) => { move(ev.screenX - from.sx, ev.screenY - from.sy, from); place(box); };
    const done = () => {
      live = null;
      frame.classList.remove("dragging");
      document.removeEventListener("pointermove", step, true);
      document.removeEventListener("pointerup", done, true);
      document.removeEventListener("pointercancel", done, true);
      remember();
    };
    live = { at: (x, y) => { move(x - from.sx, y - from.sy, from); place(box); }, done };
    document.addEventListener("pointermove", step, true);
    document.addEventListener("pointerup", done, true);
    document.addEventListener("pointercancel", done, true);
  };
  const dragWindow = (sx, sy) => drag(sx, sy, (dx, dy, from) => {
    box.x = Math.min(Math.max(-from.w + 80, from.x + dx), window.innerWidth - 80);
    box.y = Math.min(Math.max(0, from.y + dy), window.innerHeight - 40);
  });
  shade.querySelector(".grip").addEventListener("pointerdown", (e) => {
    e.preventDefault();
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* the document listeners still do */ }
    drag(e.screenX, e.screenY, (dx, dy, from) => {
      box.w = Math.max(320, from.w + dx);
      box.h = Math.max(260, from.h + dy);
    });
  });

  // WHAT THE PAGE ASKS FOR. It draws the bar; this is the hand that moves the window for it.
  window.addEventListener("message", (e) => {
    if (!view || e.source !== view.contentWindow || !e.data || e.data.source !== "journal-page" || e.data.kind !== "shell") return;
    const op = e.data.op;
    if (op === "hello") { frame.classList.remove("bare"); tellPage({ shut: box.shut }); ask({ kind: "driving" }, (d) => tellPage({ driving: !!(d && d.on), drivingUrl: (d && d.url) || "" })); }
    // THE WHEEL: the page asks to drive this tab, or to stop; the worker attaches Chrome's debugger
    else if (op === "drive") ask({ kind: "drive", on: !!e.data.on }, (got) => tellPage({ driving: !!(got && got.ok && e.data.on), drivingUrl: location.href, driveWhy: got && !got.ok ? got.why : "" }));
    else if (op === "drag") dragWindow(e.data.sx, e.data.sy);
    else if (op === "dragmove") { if (live) live.at(e.data.sx, e.data.sy); }
    else if (op === "dragend") { if (live) live.done(); }
    else if (op === "shut" || op === "open") { setShut(op === "shut"); remember(); }
    else if (op === "close") { host.remove(); tellBackground("closed"); }
    else if (op === "pick") {
      expectHello();                                // the frame is about to be another page, which may not speak
      ask({ kind: "where" }, (was) => { if (was && was.url) lastUrl = was.url; });
      ask({ kind: "pick", url: e.data.url, env: e.data.env || "" }, () => load(true));
    }
  });

  document.addEventListener("keydown", function esc(e) {
    if (e.key === "Escape" && document.getElementById(ID)) {
      host.remove();
      tellBackground("closed");
      document.removeEventListener("keydown", esc, true);
    }
  }, true);
})();
