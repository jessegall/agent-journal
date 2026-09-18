// The chat as a window over the page you are on: injected on demand, dragged by its bar, resized
// from its corner, and remembered where you left it. It is a frame of the journal's own viewer, so
// nothing here reimplements the chat.
(() => {
  const ID = "__journal-chat-window";
  const old = document.getElementById(ID);
  const tellBackground = (kind) => { try { chrome.runtime.sendMessage({ kind }, () => chrome.runtime.lastError); } catch (e) { /* the extension is gone; nothing to remember */ } };
  if (old) {                                        // the shortcut toggles: press it again to close
    old.remove();
    tellBackground("closed");
    return;
  }
  tellBackground("opened");
  // THE JOURNAL'S OWN PAGE IS THE ONE PLACE THE CHAT ALREADY IS — unless it has just handed it over,
  // which is exactly when the window is what was asked for. The page says which by its own state.


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
        box-shadow: 0 24px 60px rgba(0,0,0,.5); font: 13px/1.45 -apple-system, system-ui, sans-serif;
        font-variant-ligatures: none; color: #e6e8ec; }
      .bar { display: flex; align-items: center; gap: 8px; padding: 7px 9px; cursor: grab;
        border-bottom: 1px solid #1d2026; background: #14161a; user-select: none; }
      .bar.dragging { cursor: grabbing; }
      .dot { width: 7px; height: 7px; border-radius: 50%; background: #6c8cff; }
      .name { flex: 1; display: flex; align-items: center; gap: 4px; min-width: 0; font-size: 11.5px; font-weight: 500; color: #9aa0a8; }
      .pick { border: 0; border-radius: 6px; padding: 2px 6px; background: transparent; color: #c8ccd3;
        font: inherit; font-size: 11.5px; font-weight: 500; cursor: pointer; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      .pick:hover { background: #1e222a; color: #e6e8ec; }
      .pick::after { content: " ▾"; color: #6b7079; }
      .sep { color: #4a4e56; }
      .menu { position: absolute; top: 32px; z-index: 2; min-width: 160px; max-height: 260px; overflow-y: auto; padding: 4px;
        border: 1px solid #2a2d33; border-radius: 9px; background: #14161a; box-shadow: 0 14px 40px rgba(0,0,0,.5); }
      .menu button { display: block; width: 100%; padding: 6px 9px; border: 0; border-radius: 6px; background: transparent;
        color: #c8ccd3; font: inherit; font-size: 12px; text-align: left; cursor: pointer; white-space: nowrap; }
      .menu button:hover { background: #1e222a; color: #e6e8ec; }
      .menu button.on { color: #a3a8f0; }
      .x, .min { border: 0; border-radius: 6px; padding: 2px 7px; background: transparent; color: #9aa0a8;
        font: inherit; font-size: 14px; line-height: 1; cursor: pointer; }
      .x:hover, .min:hover { background: #1e222a; color: #e6e8ec; }
      /* MINIMIZED: the bar and the viewer's own status line, which is the first thing in the frame.
         The frame is cut to that line's height rather than hidden, so what the agent is doing stays in view. */
      .win.shut { height: auto !important; min-height: 0; }
      .win.shut .body { flex: none !important; height: 54px !important; }
      .win.shut .grip { display: none; }
      .win.dragging iframe { pointer-events: none; }
      .grip:hover::after { border-color: #6c8cff; }
      /* the menu hangs below the bar; a minimized window is shorter than the menu, so it may not clip while one is open */
      .win.menu-open { overflow: visible; }
      iframe { flex: 1; width: 100%; border: 0; background: #0e1013; }
      .grip { position: absolute; right: 2px; bottom: 2px; width: 14px; height: 14px;
        cursor: nwse-resize; }
      .grip::after { content: ""; position: absolute; right: 3px; bottom: 3px; width: 7px; height: 7px;
        border-right: 2px solid #3a3d44; border-bottom: 2px solid #3a3d44; }
      .none { display: flex; align-items: center; justify-content: center; flex: 1; padding: 20px;
        text-align: center; color: #9aa0a8; font-size: 12px; }
    </style>
    <div class="bar"><span class="dot"></span><span class="name">journal</span>
      <button class="min" title="Minimize">–</button>
      <button class="x" title="Close">×</button></div>
    <div class="menu" hidden></div>
    <div class="body"></div>
    <div class="grip"></div>`;
  shade.append(frame);

  const bar = shade.querySelector(".bar");
  const body = shade.querySelector(".body");
  body.style.cssText = "flex:1;display:flex;min-height:0";

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
  const minBtn = shade.querySelector(".min");
  const setShut = (on) => {
    box.shut = !!on;
    frame.classList.toggle("shut", box.shut);
    // folded down to the status line, the frame goes back to the chat: a page it had opened would
    // put its Back bar where the status line is, and there is nothing else to see at that height
    const view = body.querySelector("iframe");
    if (box.shut && view && view.contentWindow) view.contentWindow.postMessage({ source: "journal-extension", kind: "shut" }, "*");
    minBtn.textContent = box.shut ? "▴" : "–";
    minBtn.title = box.shut ? "Restore" : "Minimize";
  };
  chrome.storage.local.get("window").then((got) => {
    if (got && got.window) {
      box = { ...fallback, ...got.window };
      box.x = Math.min(Math.max(0, box.x), Math.max(0, window.innerWidth - 120));
      box.y = Math.min(Math.max(0, box.y), Math.max(0, window.innerHeight - 60));
      place(box);
      setShut(box.shut);
    }
  });
  const remember = () => chrome.storage.local.set({ window: box });
  minBtn.addEventListener("click", () => { setShut(!box.shut); remember(); });

  // THE SWITCH IS AT THE TOP: which journal, which environment, one click each. Picking one is the
  // same choice the popup makes, kept in the same place, so the two never disagree.
  const name = shade.querySelector(".name");
  const menu = shade.querySelector(".menu");
  const closeMenu = () => { menu.hidden = true; menu.innerHTML = ""; frame.classList.remove("menu-open"); };
  const openMenu = (anchor, rows) => {
    menu.innerHTML = "";
    for (const r of rows) {
      const b = document.createElement("button");
      b.textContent = r.label;
      if (r.on) b.className = "on";
      b.addEventListener("click", () => { closeMenu(); r.go(); });
      menu.append(b);
    }
    menu.style.left = `${Math.max(6, anchor.offsetLeft)}px`;
    menu.hidden = false;
    frame.classList.add("menu-open");
  };
  const pick = (url, env) => new Promise((res) => chrome.runtime.sendMessage({ kind: "pick", url, env }, res)).then(() => load(true));
  const show = (got) => {
    name.innerHTML = "";
    const journal = document.createElement("button");
    journal.className = "pick";
    journal.textContent = got.project || "journal";
    journal.title = "Switch journal";
    journal.addEventListener("click", () => openMenu(journal, (got.journals || []).map((j) => ({
      label: j.project, on: j.url === got.url, go: () => pick(j.url, "") }))));
    name.append(journal);
    if (got.env) {
      const sep = document.createElement("span");
      sep.className = "sep";
      sep.textContent = "·";
      const env = document.createElement("button");
      env.className = "pick";
      env.textContent = got.env;
      env.title = "Switch environment";
      env.addEventListener("click", () => openMenu(env, (got.envs || []).map((e) => ({
        label: e, on: e === got.env, go: () => pick(got.url, e) }))));
      name.append(sep, env);
    }
  };
  const load = (fresh) => chrome.runtime.sendMessage({ kind: "where", fresh: !!fresh }, (got) => {
    body.innerHTML = "";
    if (!got || !got.url) {
      body.innerHTML = `<div class="none">${(got && got.why) || "No journal viewer is running."}</div>`;
      name.textContent = "journal";
      return;
    }
    const view = document.createElement("iframe");
    view.src = got.env ? `${got.url}/?chat#/env/${got.env}` : `${got.url}/?chat`;
    body.append(view);
    show(got);
  });
  load(false);
  shade.addEventListener("click", (e) => { if (!menu.hidden && !menu.contains(e.target) && !e.target.classList.contains("pick")) closeMenu(); });

  // DRAGGING IS ON THE DOCUMENT, NOT THE BAR. A pointer that leaves the bar mid-drag — which it does
  // the moment the window cannot keep up — would otherwise drop the window where it stood.
  const drag = (e, move) => {
    e.preventDefault();
    // THE POINTER AND THE BOX ARE TWO DIFFERENT x's. Spreading the box over the pointer's own
    // coordinates made every drag measure from the window's corner, which is the jump to the right.
    const from = { px: e.clientX, py: e.clientY, ...box };
    // THE POINTER IS CAPTURED, AND THE FRAME STOPS LISTENING. A fast drag leaves the grip and lands
    // on the iframe, whose document takes every event from then on — the drag froze there. Capture
    // keeps the events on the grip wherever the pointer is, and the frame ignores them until it ends.
    const grabbed = e.currentTarget;
    try { grabbed.setPointerCapture(e.pointerId); } catch (err) { /* an older browser: the document listeners still do */ }
    bar.classList.add("dragging");
    frame.classList.add("dragging");
    const step = (ev) => {
      move(ev.clientX - from.px, ev.clientY - from.py, from);
      place(box);
    };
    const done = (ev) => {
      bar.classList.remove("dragging");
      frame.classList.remove("dragging");
      try { grabbed.releasePointerCapture(ev.pointerId); } catch (err) { /* already released */ }
      document.removeEventListener("pointermove", step, true);
      document.removeEventListener("pointerup", done, true);
      document.removeEventListener("pointercancel", done, true);
      remember();
    };
    document.addEventListener("pointermove", step, true);
    document.addEventListener("pointerup", done, true);
    document.addEventListener("pointercancel", done, true);
  };

  bar.addEventListener("pointerdown", (e) => {
    if (e.target.classList.contains("x") || e.target.classList.contains("min") || e.target.classList.contains("pick")) return;
    drag(e, (dx, dy, from) => {
      box.x = Math.min(Math.max(-from.w + 80, from.x + dx), window.innerWidth - 80);
      box.y = Math.min(Math.max(0, from.y + dy), window.innerHeight - 40);
    });
  });
  shade.querySelector(".grip").addEventListener("pointerdown", (e) => drag(e, (dx, dy, from) => {
    box.w = Math.max(320, from.w + dx);
    box.h = Math.max(260, from.h + dy);
  }));
  shade.querySelector(".x").addEventListener("click", () => { host.remove(); tellBackground("closed"); });
  document.addEventListener("keydown", function esc(e) {
    if (e.key === "Escape" && document.getElementById(ID)) {
      host.remove();
      tellBackground("closed");
      document.removeEventListener("keydown", esc, true);
    }
  }, true);
})();
