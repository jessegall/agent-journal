// THE WINDOWS OVER A PAGE: the chat opened by hand, and every view the viewer detached into the
// extension. Each is a frame of the journal's own viewer, which draws its bar; this file makes the
// frames, places them, keeps their boxes, and obeys what the page inside each one asks.
(() => {
  const run = window.__journalRun || "toggle";
  window.__journalRun = "";
  if (window.__journalWindows) return window.__journalWindows(run);

  // NOTHING HERE MAY THROW. An extension reloaded under an open page leaves this script with a dead
  // chrome.*: every call would throw "context invalidated", so each one is wrapped.
  const ask = (msg, cb) => { try { chrome.runtime.sendMessage(msg, (got) => { void chrome.runtime.lastError; if (cb) cb(got); }); } catch (e) { if (cb) cb(null); } };
  const stored = (key) => { try { return chrome.storage.local.get(key).catch(() => ({})); } catch (e) { return Promise.resolve({}); } };
  const store = (value) => { try { chrome.storage.local.set(value).catch(() => {}); } catch (e) { /* not remembered, not fatal */ } };
  const onJournal = /^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/.test(window.location.origin);
  const tellJournal = (kind, extra) => { if (onJournal) window.postMessage({ source: "journal-extension", kind, ...(extra || {}) }, window.location.origin); };
  const CSS = `
    :host { all: initial; }
    .win { position: absolute; display: flex; flex-direction: column; overflow: hidden;
      min-width: 260px; min-height: 180px; pointer-events: auto;
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
    /* A BAR OF LAST RESORT, until the page inside says hello and draws its own. */
    .fallback { display: none; align-items: center; gap: 8px; height: 32px; padding: 0 6px 0 10px; cursor: grab;
      border-bottom: 1px solid #1d2026; background: #14161a; color: #9aa0a8; user-select: none;
      font: 500 11.5px/1 -apple-system, system-ui, sans-serif; }
    .win.bare .fallback { display: flex; }
    .fallback .name { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .fallback button { border: 0; border-radius: 6px; padding: 3px 7px; background: transparent; color: #9aa0a8; font: inherit; cursor: pointer; }
    .fallback button:hover { background: #1e222a; color: #e6e8ec; }
    .win:not(.picks) .back { display: none; }`;
  const windows = new Map();                        // key -> the window drawn for it
  const closedHere = new Set();                     // held windows closed in this tab only
  let heldIds = [];

  function makeWindow(key, how) {
    const host = document.createElement("div");
    host.id = `__journal-window-${key}`;
    host.style.cssText = "position:fixed;inset:0;z-index:2147483647;pointer-events:none";
    const shade = host.attachShadow({ mode: "open" });   // the page's CSS cannot reach in here
    document.documentElement.append(host);
    const frame = document.createElement("div");
    frame.className = how.pick ? "win picks" : "win";
    frame.innerHTML = `<style>${CSS}</style>
      <div class="fallback"><span class="name">journal</span><button class="back" title="Back to the last journal">←</button><button class="x" title="Close">×</button></div>
      <div class="body"></div>
      <div class="grip"></div>`;
    shade.append(frame);
    const win = { key, how, host, frame, body: shade.querySelector(".body"), view: null, box: { ...how.fallback } };
    win.place = () => {
      frame.style.left = `${win.box.x}px`;
      frame.style.top = `${win.box.y}px`;
      frame.style.width = `${win.box.w}px`;
      frame.style.height = `${win.box.h}px`;
    };
    win.tellPage = (extra) => { if (win.view && win.view.contentWindow) win.view.contentWindow.postMessage({ source: "journal-extension", kind: "shell", ...extra }, "*"); };
    win.setShut = (on) => {
      win.box.shut = !!on;
      frame.classList.toggle("shut", win.box.shut);
      win.tellPage({ shut: win.box.shut });
    };
    win.settle = (box) => {
      win.box = { ...how.fallback, ...box };
      win.box.x = Math.min(Math.max(0, win.box.x), Math.max(0, window.innerWidth - 120));
      win.box.y = Math.min(Math.max(0, win.box.y), Math.max(0, window.innerHeight - 60));
      win.place();
      win.setShut(win.box.shut);
    };
    win.show = (src, name) => {
      win.body.innerHTML = "";
      win.view = null;
      if (!src) {
        win.body.innerHTML = `<div class="none">${name || "No journal viewer is running."}</div>`;
        frame.classList.add("bare");
        return;
      }
      shade.querySelector(".fallback .name").textContent = name || "journal";
      win.view = document.createElement("iframe");
      win.view.src = src;
      win.body.append(win.view);
      frame.classList.add("bare");                  // the shell's bar, until the page says hello
    };
    win.remove = () => { host.remove(); windows.delete(key); };
    win.place();
    how.box().then((box) => { if (box) win.settle(box); });
    shade.querySelector(".fallback .x").addEventListener("click", () => how.close(win));
    shade.querySelector(".fallback .back").addEventListener("click", () => how.pick && how.pick(win, ""));
    shade.querySelector(".fallback").addEventListener("pointerdown", (e) => {
      if (e.target.tagName === "BUTTON") return;
      e.preventDefault();
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* the document listeners still do */ }
      dragWindow(win, e.screenX, e.screenY);
    });
    shade.querySelector(".grip").addEventListener("pointerdown", (e) => {
      e.preventDefault();
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch (err) { /* the document listeners still do */ }
      drag(win, e.screenX, e.screenY, (dx, dy, from) => {
        win.box.w = Math.max(260, from.w + dx);
        win.box.h = Math.max(180, from.h + dy);
      });
    });
    windows.set(key, win);
    return win;
  }

  // DRAGGING IS ON THE DOCUMENT, NOT THE BAR — the bar is inside the frame, in another origin, so
  // what arrives from it is a start in screen coordinates, the one system both sides share.
  let live = null;
  function drag(win, sx, sy, move) {
    const from = { sx, sy, ...win.box };
    win.frame.classList.add("dragging");
    const step = (ev) => { move(ev.screenX - from.sx, ev.screenY - from.sy, from); win.place(); };
    const done = () => {
      live = null;
      win.frame.classList.remove("dragging");
      document.removeEventListener("pointermove", step, true);
      document.removeEventListener("pointerup", done, true);
      document.removeEventListener("pointercancel", done, true);
      win.how.keep(win.box);
    };
    live = { at: (x, y) => { move(x - from.sx, y - from.sy, from); win.place(); }, done };
    document.addEventListener("pointermove", step, true);
    document.addEventListener("pointerup", done, true);
    document.addEventListener("pointercancel", done, true);
  }
  const dragWindow = (win, sx, sy) => drag(win, sx, sy, (dx, dy, from) => {
    win.box.x = Math.min(Math.max(-from.w + 80, from.x + dx), window.innerWidth - 80);
    win.box.y = Math.min(Math.max(0, from.y + dy), window.innerHeight - 40);
  });

  // THE CHAT OPENED BY HAND: one window, on the journal the user picked, open in every tab until closed.
  let lastUrl = "";
  const chat = {
    fallback: { x: Math.max(12, window.innerWidth - 452), y: 72, w: 440, h: Math.min(680, Math.max(360, window.innerHeight - 140)) },
    box: () => stored("window").then((got) => got && got.window),
    keep: (box) => store({ window: box }),
    close: (win) => { win.remove(); ask({ kind: "closed" }); },
    load: (win, fresh) => ask({ kind: "where", fresh: !!fresh }, (got) => {
      if (!got || !got.url) return win.show("", (got && got.why) || "");
      win.show(got.env ? `${got.url}/?chat#/${got.env}` : `${got.url}/?chat`, [got.project, got.env].filter(Boolean).join(" · "));
    }),
    pick: (win, url, env) => {
      if (!url && !lastUrl) return;
      win.frame.classList.add("bare");
      ask({ kind: "where" }, (was) => { if (was && was.url) lastUrl = was.url; });
      ask({ kind: "pick", url: url || lastUrl, env: env || "" }, () => chat.load(win, true));
    },
  };

  function openChat() {
    if (windows.has("chat")) return;
    chat.load(makeWindow("chat", chat), false);
    ask({ kind: "opened" });
  }

  // A HELD WINDOW: a view the viewer detached. It follows every tab; closed on the journal's own page
  // it goes back into the layout, closed anywhere else it is closed in this tab only.
  function held(entry, at) {
    const src = entry.view === "chat" ? `${entry.url}/?chat&float=${entry.id}#/${entry.env}` : `${entry.url}/?view=${entry.view}&float=${entry.id}#/${entry.env}`;
    return {
      fallback: { x: 24 + at * 28, y: 72 + at * 28, w: 440, h: Math.min(420, Math.max(260, window.innerHeight - 160)) },
      box: () => stored("boxes").then((got) => got && got.boxes && got.boxes[entry.id]),
      keep: (box) => stored("boxes").then((got) => store({ boxes: { ...((got && got.boxes) || {}), [entry.id]: box } })),
      close: (win) => {
        if (onJournal) return ask({ kind: "release", id: entry.id, dock: true });
        closedHere.add(win.key);
        win.remove();
      },
      src,
    };
  }

  async function sync() {
    const got = await stored("held");
    const list = (got && got.held) || [];
    const ids = list.map((h) => h.id);
    heldIds.filter((id) => !ids.includes(id)).forEach((id) => tellJournal("released", { id }));
    heldIds = ids;
    tellJournal("holding", { held: ids });
    windows.forEach((win, key) => { if (key !== "chat" && !ids.includes(win.id)) win.remove(); });
    list.forEach((entry, at) => {
      const key = `held-${entry.id}`;
      if (windows.has(key) || closedHere.has(key)) return;
      const how = held(entry, at);
      const win = makeWindow(key, how);
      win.id = entry.id;
      win.show(how.src, entry.view);
    });
  }

  // WHAT ANOTHER TAB DID, DONE HERE TOO: boxes, the open chat and the held list live in storage.
  try {
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== "local") return;
      const mine = windows.get("chat");
      if (mine && changes.chatOpen && changes.chatOpen.newValue === false) mine.remove();
      if (mine && (changes.url || changes.env)) ask({ kind: "where" }, (got) => { if (got && got.url && mine.view && !mine.view.src.startsWith(got.url)) chat.load(mine, true); });
      if (mine && changes.window && changes.window.newValue) mine.settle(changes.window.newValue);
      if (changes.held) sync();
      if (changes.boxes && changes.boxes.newValue) windows.forEach((win) => { const box = win.id !== undefined && changes.boxes.newValue[win.id]; if (box) win.settle(box); });
    });
  } catch (e) { /* no storage events here: these windows keep to themselves */ }

  // WHAT A PAGE ASKS FOR. It draws the bar; this is the hand that moves its window for it.
  window.addEventListener("message", (e) => {
    if (!e.data || e.data.source !== "journal-page" || e.data.kind !== "shell") return;
    const win = [...windows.values()].find((w) => w.view && e.source === w.view.contentWindow);
    if (!win) return;
    const op = e.data.op;
    if (op === "hello") { win.frame.classList.remove("bare"); win.tellPage({ shut: win.box.shut }); ask({ kind: "driving" }, (d) => win.tellPage({ driving: !!(d && d.on), drivingUrl: (d && d.url) || "" })); }
    else if (op === "drive") ask({ kind: "drive", on: !!e.data.on }, (got) => win.tellPage({ driving: !!(got && got.ok && e.data.on), drivingUrl: location.href, driveWhy: got && !got.ok ? got.why : "" }));
    else if (op === "drag") dragWindow(win, e.data.sx, e.data.sy);
    else if (op === "dragmove") { if (live) live.at(e.data.sx, e.data.sy); }
    else if (op === "dragend") { if (live) live.done(); }
    else if (op === "shut" || op === "open") { win.setShut(op === "shut"); win.how.keep(win.box); }
    else if (op === "close") win.how.close(win);
    else if (op === "dock" && win.id !== undefined) ask({ kind: "release", id: win.id, dock: true });
    else if (op === "pick" && win.how.pick) win.how.pick(win, e.data.url, e.data.env);
  });

  document.addEventListener("keydown", (e) => {
    const mine = windows.get("chat");
    if (e.key === "Escape" && mine) chat.close(mine);
  }, true);

  window.__journalWindows = (what) => {
    if (what === "toggle") {
      const mine = windows.get("chat");
      if (mine) chat.close(mine);
      else openChat();
    }
    if (what === "open") openChat();
    sync();
  };
  window.__journalWindows(run);
})();
