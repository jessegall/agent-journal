// The extension's one process: it finds every journal running on this machine, injects the picker
// and the chat window, takes the picture, and posts the message. Nothing here touches the page
// except through picker.js and chat.js.

// A JOURNAL IS FOUND, NOT CONFIGURED. Each viewer takes the first free port from 8420 up, so a port
// typed into a settings box is wrong the next time one restarts — and several projects run at once,
// which is why this collects all of them rather than the first. /api/identity names the project,
// which is how a journal is told from anything else listening on a local port.
const PORTS = Array.from({ length: 20 }, (_, i) => 8420 + i);
const FOUND = { at: 0, journals: [] };
const FRESH_MS = 20_000;

async function identify(url) {
  try {
    const r = await fetch(`${url}/api/identity`, { cache: "no-store", signal: AbortSignal.timeout(900) });
    if (!r.ok) return null;
    const got = await r.json();
    return got && got.root ? { url, project: got.project || "journal", root: got.root } : null;
  } catch (e) {
    return null;
  }
}

async function journals({ fresh = false } = {}) {
  if (!fresh && FOUND.journals.length && Date.now() - FOUND.at < FRESH_MS) return FOUND.journals;
  const found = (await Promise.all(PORTS.map((p) => identify(`http://127.0.0.1:${p}`)))).filter(Boolean);
  FOUND.journals = found;
  FOUND.at = Date.now();
  return found;
}

async function environments(url) {
  try {
    const r = await fetch(`${url}/api/identity`, { cache: "no-store" });
    const got = await r.json();
    return got.environments || [];
  } catch (e) {
    return [];
  }
}

// WHERE A MESSAGE GOES: the journal and the environment the user last picked, as long as both are
// still there. Otherwise the first journal running and its first environment, so a fresh install
// works before anything is chosen.
// STORAGE THAT CANNOT FAIL THE CALLER. A read that throws is an empty read; a write that throws
// is a write that did not happen. Neither is worth a broken window.
async function kept(keys, fallback) {
  try { return (await chrome.storage.local.get(keys)) || fallback; } catch (e) { return fallback; }
}
async function keep(values) {
  try { await chrome.storage.local.set(values); } catch (e) { /* not remembered, not fatal */ }
}

// A TAB MAY GO ITS OWN WAY. The window opens everywhere and starts on the shared choice; a journal
// or environment picked inside one tab's window is that tab's, and a window closed in one tab is
// closed there only. The overrides live for the browser session, keyed by tab, and die with the tab.
async function tabState(tabId) {
  if (!tabId) return {};
  try { return ((await chrome.storage.session.get("tabs")) || {}).tabs?.[String(tabId)] || {}; } catch (e) { return {}; }
}
async function setTabState(tabId, patch) {
  if (!tabId) return;
  try {
    const all = ((await chrome.storage.session.get("tabs")) || {}).tabs || {};
    all[String(tabId)] = patch === null ? undefined : { ...(all[String(tabId)] || {}), ...patch };
    if (patch === null) delete all[String(tabId)];
    await chrome.storage.session.set({ tabs: all });
  } catch (e) { /* the tab keeps to the shared choice */ }
}

async function target({ fresh = false, tabId = null } = {}) {
  const found = await journals({ fresh });
  if (!found.length) return { why: "No journal viewer is running. Start one with `journal serve`." };
  const own = await tabState(tabId);
  const chosen = own.url ? { url: own.url, env: own.env || "" } : await kept(["url", "env"], {});
  const same = (a, b) => String(a || "").replace(/\/+$/, "") === String(b || "").replace(/\/+$/, "");
  const one = found.find((j) => same(j.url, chosen.url)) || found[0];
  const names = await environments(one.url);
  if (!names.length) return { why: `${one.project} answered, but it has no environment to write to.` };
  const env = names.includes(chosen.env) ? chosen.env : names[0];
  return { ...one, env, envs: names, journals: found };
}

// THE PICTURE IS OF WHAT WAS POINTED AT, not of the tab. captureVisibleTab gives the whole visible
// page in device pixels; the element's rect is in CSS pixels, so it is scaled before it is cut out.
async function shotOf(rect, scale) {
  const shot = await chrome.tabs.captureVisibleTab({ format: "png" });
  const bitmap = await createImageBitmap(await (await fetch(shot)).blob());
  const pad = 6 * scale;
  const x = Math.max(0, Math.round(rect.x * scale - pad));
  const y = Math.max(0, Math.round(rect.y * scale - pad));
  const w = Math.min(bitmap.width - x, Math.round(rect.width * scale + pad * 2));
  const h = Math.min(bitmap.height - y, Math.round(rect.height * scale + pad * 2));
  if (w <= 0 || h <= 0) return "";
  const canvas = new OffscreenCanvas(w, h);
  canvas.getContext("2d").drawImage(bitmap, x, y, w, h, 0, 0, w, h);
  const blob = await canvas.convertToBlob({ type: "image/png" });
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function said(picked) {
  if (picked.mode === "shot") return [`A picture of this element: \`${picked.selector}\``, picked.url].join("\n");
  const lines = [`I mean this element: \`${picked.selector}\``, picked.url];
  if (picked.text) lines.push(`"${picked.text}"`);
  if (picked.hints && picked.hints.length) lines.push(picked.hints.join(" · "));
  if (picked.tag) lines.push(`\`${picked.tag}\``);
  return lines.join("\n");
}

async function post(text, files) {
  const to = await target();
  if (to.why) return { ok: false, why: to.why };
  try {
    const title = text.split("\n").find((l) => l.trim() && !l.startsWith(">")) || text;
    const r = await fetch(`${to.url}/api/${to.env}/message`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: title.replace(/:/g, " -").slice(0, 80), brief: text }),
    });
    if (!r.ok) return { ok: false, why: `${to.project} refused it (${r.status}).` };
    const made = await r.json();
    for (const f of files || []) {
      const body = new FormData();
      const data = String(f.data || "").split(",").pop();
      const bytes = Uint8Array.from(atob(data), (c) => c.charCodeAt(0));
      body.append("file", new Blob([bytes], { type: "image/png" }), f.name);
      const uploaded = await fetch(`${to.url}/api/${to.env}/message/${made.n}/upload`, { method: "POST", body });
      if (!uploaded.ok) throw new Error(`${to.project} refused the picture (${uploaded.status}).`);
    }
    return { ok: true, project: to.project, env: to.env, shot: !!(files && files.length) };
  } catch (e) {
    // THE REASON IS CARRIED BACK TO THE PAGE. A pointer that silently does nothing is worse than
    // one that fails: the user cannot tell a broken extension from a journal that is not running.
    return { ok: false, why: `Could not reach ${to.project}: ${e.message}` };
  }
}

async function send(picked) {
  let data = "";
  let shotWhy = "";
  try {
    data = await shotOf(picked.rect, picked.scale);
  } catch (e) {
    shotWhy = e.message;                            // a message without its picture is still the message
  }
  const got = await post(said(picked), data ? [{ name: `pointed-${Date.now()}.png`, data }] : []);
  return { ...got, shotWhy };
}

async function inject(file, mode) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.id) return { ok: false, why: "No page to work on." };
  try {
    // the picker reads its mode off the window: "shot" sends a picture and little else
    if (mode) await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: (m) => { window.__journalPickMode = m; }, args: [mode] });
    await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: [file] });
    return { ok: true };
  } catch (e) {
    return { ok: false, why: e.message };           // chrome:// pages and the Web Store refuse every extension
  }
}

// FOLLOWING YOU FROM TAB TO TAB. Detaching in the viewer hands the chat to this extension: the flag
// says the chat is loose, and every page you open gets the window automatically — but only where
// the user has granted the permission to touch other pages, which they do from the popup. Without
// the grant the flag still works for Alt+J, and the popup says what is missing.
async function everywhere() {
  return chrome.permissions.contains({ origins: ["<all_urls>"] }).catch(() => false);
}

//: THE WINDOW OPENS WHERE YOU PRESSED THE BUTTON. Detaching in the viewer used to set the flag and
//: leave the user to open the window themselves, which is two gestures for one intention.
async function follow(on, tabId) {
  // detaching in the viewer is opening the window: it is open, everywhere, from that moment
  await keep({ following: !!on, chatOpen: !!on });
  if (tabId) {
    try {
      if (on) {
        await chrome.scripting.executeScript({ target: { tabId }, files: ["chat.js"] });
      } else {
        await chrome.scripting.executeScript({
          target: { tabId },
          func: () => { const el = document.getElementById("__journal-chat-window"); if (el) el.remove(); },
        });
      }
    } catch (e) { /* a page the extension may not touch keeps the flag and nothing else */ }
  }
  return { ok: true, everywhere: await everywhere() };
}

async function following() {
  const got = await kept("following", {});
  return !!(got && got.following);
}

// ONE WINDOW, EVERY TAB. Open is a single state: opened anywhere, it is open — a reload, a tab you
// switch to, a page you go to next all get it; closed anywhere, it is closed everywhere, and the
// windows already showing take themselves down. Minimized travels the same way, with the window's
// box. The extension can only put it on a site it may touch: the site is asked for when the window
// is opened by hand, and "follow me everywhere" covers every site at once.
async function chatOpen() {
  const got = await kept("chatOpen", {});
  return !!(got && got.chatOpen);
}

async function rememberOpen(on) {
  await keep({ chatOpen: !!on });
}

async function mayTouch(url) {
  try { return await chrome.permissions.contains({ origins: [`${new URL(url).origin}/*`] }); } catch (e) { return false; }
}

async function openOn(tabId, url) {
  if (!tabId || !url || !/^https?:/.test(url)) return;
  const follow = await following();
  // the journal's own page has the chat on it — unless the user detached it, and then the window is where it lives
  if (!follow && (url.startsWith("http://127.0.0.1") || url.startsWith("http://localhost"))) return;
  const left = (await chatOpen()) && ((await everywhere()) || (await mayTouch(url)));
  if (!follow && !left) return;
  if ((await tabState(tabId)).closed) return;    // this tab said no; the others carry on
  try {
    // CHAT.JS TOGGLES. Run on a tab that already has the window it takes the window DOWN — and says
    // closed, which closes every tab's. Switching back to a tab was doing exactly that. So: look first.
    const [has] = await chrome.scripting.executeScript({ target: { tabId }, func: () => !!document.getElementById("__journal-chat-window") });
    if (has && has.result) return;
    await chrome.scripting.executeScript({ target: { tabId }, files: ["chat.js"] });
  } catch (e) { /* a page the extension may not touch is not an error worth saying twice */ }
}

chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status === "complete") openOn(tabId, tab && tab.url).catch(() => {});
});
chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const tab = await chrome.tabs.get(tabId).catch(() => null);
  if (tab) openOn(tabId, tab.url).catch(() => {});
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === "point") await inject("picker.js");
  if (command === "chat") await inject("chat.js");
});

chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (!msg || !msg.kind) return false;
  const answer = {
    picked: () => send(msg.picked),
    point: () => inject("picker.js", "point"),
    shot: () => inject("picker.js", "shot"),
    chat: () => inject("chat.js"),
    // the page's wheel: drive this tab for the agent, or stop
    drive: () => (msg.on ? driveOn(sender.tab && sender.tab.id) : driveOff()),
    driving: async () => ({ on: DRIVE.tabId !== null && DRIVE.tabId === (sender.tab && sender.tab.id), anywhere: DRIVE.tabId !== null, url: DRIVE.url }),
    // chat.js says when it opened or closed on a page, so the window comes back after a reload
    // opened by hand in this tab: the window is open everywhere again, and this tab's "no" is lifted
    opened: async () => { await setTabState(sender.tab && sender.tab.id, { closed: false }); await rememberOpen(true); return { ok: true }; },
    // closed in this tab: this tab only. Putting the chat back on the journal's page (attach) is the
    // one close that reaches every tab, and it comes through `follow`.
    closed: () => setTabState(sender.tab && sender.tab.id, { closed: true }).then(() => ({ ok: true })),
    follow: () => follow(msg.on, sender.tab && sender.tab.id),
    following: async () => ({ on: await following(), everywhere: await everywhere() }),
    where: async () => {
      const to = await target({ fresh: !!msg.fresh, tabId: sender.tab && sender.tab.id });
      return to.why ? { why: to.why, journals: [] } : {
        url: to.url, project: to.project, env: to.env, envs: to.envs,
        journals: (to.journals || []).map((j) => ({ url: j.url, project: j.project })),
      };
    },
    // picked inside a tab's window: that tab's choice; picked with no tab (the popup): the shared one
    pick: async () => {
      const url = String(msg.url || "").replace(/\/+$/, "");   // the viewer writes a trailing slash, this file does not
      if (sender.tab && sender.tab.id) await setTabState(sender.tab.id, { url, env: msg.env || "" });
      else await keep({ url, env: msg.env || "" });
      return { ok: true };
    },
  }[msg.kind];
  if (!answer) return false;
  answer().then(reply, (e) => reply({ ok: false, why: e.message }));
  return true;                                      // the reply is awaited
});

// ─────────────────────────────────────────────── driving the page for the agent
// THE AGENT ASKS THE JOURNAL, THE JOURNAL QUEUES, THIS RUNS IT ON THE TAB. Chrome's own debugger is
// attached to one tab the user chose from the window; while it is, this polls that journal for
// asks, answers each with the DevTools protocol, and posts the answer back — a picture, the text,
// the DOM — which the journal hands to the agent as a message. Chrome shows its own "is debugging"
// bar the whole time, so the user always sees it is on; the window's button switches it off.
const DRIVE = { tabId: null, url: "", env: "", title: "", timer: null, console: [] };
const POLL_MS = 1500;

async function cdp(method, params) {
  return chrome.debugger.sendCommand({ tabId: DRIVE.tabId }, method, params || {});
}

async function evalIn(expression) {
  const got = await cdp("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (got.exceptionDetails) {
    const ex = got.exceptionDetails;
    throw new Error((ex.exception && ex.exception.description) || ex.text || "threw");
  }
  return got.result ? got.result.value : undefined;
}

const q = (s) => JSON.stringify(String(s));

// each ask, by name: what it runs on the page and what it says back
const ASKS = {
  shot: async () => {
    const got = await cdp("Page.captureScreenshot", { format: "png" });
    return { text: `a picture of ${DRIVE.url}`, files: [{ name: `page-${Date.now()}.png`, data: got.data }] };
  },
  url: async () => ({ text: await evalIn("location.href") }),
  text: async () => ({ text: String(await evalIn("document.body ? document.body.innerText : ''")).slice(0, 12000) }),
  dom: async () => ({ text: String(await evalIn("document.documentElement.outerHTML")).slice(0, 20000) }),
  console: async () => ({ text: DRIVE.console.slice(-80).join("\n") || "(nothing logged since driving began)" }),
  click: async ([sel]) => ({ text: await evalIn(`(() => { const el = document.querySelector(${q(sel)}); if (!el) return "nothing matches " + ${q(sel)}; el.scrollIntoView({ block: "center" }); el.click(); return "clicked " + el.tagName.toLowerCase() + (el.innerText ? " " + JSON.stringify(el.innerText.trim().slice(0, 60)) : ""); })()`) }),
  type: async ([sel, words]) => {
    const focused = await evalIn(`(() => { const el = document.querySelector(${q(sel)}); if (!el) return false; el.focus(); return true; })()`);
    if (!focused) return { text: `nothing matches ${sel}` };
    await cdp("Input.insertText", { text: String(words || "") });
    return { text: `typed ${JSON.stringify(String(words || ""))} into ${sel}` };
  },
  goto: async ([url]) => { await cdp("Page.navigate", { url: String(url) }); return { text: `going to ${url}` }; },
  eval: async ([js]) => { const v = await evalIn(String(js)); return { text: typeof v === "string" ? v : JSON.stringify(v, null, 1) || String(v) }; },
  scroll: async ([sel]) => ({ text: await evalIn(sel === "top" ? "(window.scrollTo(0, 0), 'at the top')"
    : sel === "bottom" ? "(window.scrollTo(0, document.body.scrollHeight), 'at the bottom')"
    : `(() => { const el = document.querySelector(${q(sel)}); if (!el) return "nothing matches " + ${q(sel)}; el.scrollIntoView({ block: "center" }); return "scrolled to " + el.tagName.toLowerCase(); })()`) }),
};

async function runAsk(base, ask) {
  let ok = true;
  let out;
  try {
    const run = ASKS[ask.op];
    out = run ? await run(ask.args || []) : { text: `${ask.op} is not something this extension can do` };
  } catch (e) {
    ok = false;
    out = { text: e.message || String(e) };
  }
  try {
    await fetch(`${base}/api/${DRIVE.env}/browser/${ask.n}/result`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ ok, text: out.text || "", files: out.files || [] }),
    });
  } catch (e) { /* the journal went away; the ask stays pending and is answered when it is back */ }
}

async function pollAsks() {
  if (DRIVE.tabId === null) return;
  const to = await target();
  if (to.why) return;
  try {
    const r = await fetch(`${to.url}/api/${DRIVE.env}/browser/pending`, { method: "POST", headers: { "content-type": "application/json" }, body: "{}" });
    if (!r.ok) return;
    const got = await r.json();
    for (const ask of ((got && got.data) || [])) await runAsk(to.url, ask);
  } catch (e) { /* next poll */ }
}

async function tellDriver(on) {
  const to = await target();
  if (to.why) return;
  try {
    await fetch(`${to.url}/api/${DRIVE.env || to.env}/browser/driver`, {
      method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify({ on, url: DRIVE.url, title: DRIVE.title }),
    });
  } catch (e) { /* the journal is told next time */ }
}

async function driveOn(tabId) {
  const tab = await chrome.tabs.get(tabId).catch(() => null);
  if (!tab || !/^https?:/.test(tab.url || "")) return { ok: false, why: "This page cannot be driven." };
  if (DRIVE.tabId !== null && DRIVE.tabId !== tabId) await driveOff();
  const to = await target();
  if (to.why) return { ok: false, why: to.why };
  try {
    await chrome.debugger.attach({ tabId }, "1.3");
    await chrome.debugger.sendCommand({ tabId }, "Runtime.enable");
  } catch (e) {
    return { ok: false, why: `Chrome would not let the extension drive this page: ${e.message}` };
  }
  Object.assign(DRIVE, { tabId, url: tab.url, title: tab.title || "", env: to.env, console: [] });
  await tellDriver(true);
  clearInterval(DRIVE.timer);
  DRIVE.timer = setInterval(() => pollAsks().catch(() => {}), POLL_MS);
  return { ok: true, env: to.env };
}

async function driveOff() {
  clearInterval(DRIVE.timer);
  DRIVE.timer = null;
  const had = DRIVE.tabId;
  if (had !== null) {
    await tellDriver(false);
    try { await chrome.debugger.detach({ tabId: had }); } catch (e) { /* already gone */ }
  }
  Object.assign(DRIVE, { tabId: null, url: "", title: "", env: "", console: [] });
  return { ok: true };
}

chrome.debugger.onEvent.addListener((source, method, params) => {
  if (source.tabId !== DRIVE.tabId) return;
  if (method === "Runtime.consoleAPICalled") {
    DRIVE.console.push(`${params.type}: ${(params.args || []).map((a) => (a.value !== undefined ? String(a.value) : a.description || a.type)).join(" ")}`);
    if (DRIVE.console.length > 200) DRIVE.console.shift();
  }
  if (method === "Runtime.exceptionThrown") DRIVE.console.push(`error: ${(params.exceptionDetails && params.exceptionDetails.text) || ""}`);
});
chrome.debugger.onDetach.addListener((source) => { if (source.tabId === DRIVE.tabId) driveOff().catch(() => {}); });
chrome.tabs.onUpdated.addListener((tabId, info, tab) => { if (tabId === DRIVE.tabId && tab && tab.url) { DRIVE.url = tab.url; DRIVE.title = tab.title || DRIVE.title; } });
chrome.tabs.onRemoved.addListener((tabId) => {
  if (tabId === DRIVE.tabId) driveOff().catch(() => {});
  setTabState(tabId, null).catch(() => {});       // a tab's own choices die with it
});
