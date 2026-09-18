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
    const r = await fetch(`${url}/api/overview`, { cache: "no-store" });
    const got = await r.json();
    return (got.environments || []).map((e) => e.name);
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

async function target({ fresh = false } = {}) {
  const found = await journals({ fresh });
  if (!found.length) return { why: "No journal viewer is running. Start one with `journal serve`." };
  const chosen = await kept(["url", "env"], {});
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
    const r = await fetch(`${to.url}/api/env/${to.env}/messages`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ text, files }),
    });
    if (!r.ok) return { ok: false, why: `${to.project} refused it (${r.status}).` };
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
    // chat.js says when it opened or closed on a page, so the window comes back after a reload
    opened: () => rememberOpen(true).then(() => ({ ok: true })),
    closed: () => rememberOpen(false).then(() => ({ ok: true })),
    follow: () => follow(msg.on, sender.tab && sender.tab.id),
    following: async () => ({ on: await following(), everywhere: await everywhere() }),
    where: async () => {
      const to = await target({ fresh: !!msg.fresh });
      return to.why ? { why: to.why, journals: [] } : {
        url: to.url, project: to.project, env: to.env, envs: to.envs,
        journals: (to.journals || []).map((j) => ({ url: j.url, project: j.project })),
      };
    },
    pick: async () => {
      // the viewer writes a journal's url with a trailing slash, this file without: one form is kept
      await keep({ url: String(msg.url || "").replace(/\/+$/, ""), env: msg.env || "" });
      return { ok: true };
    },
  }[msg.kind];
  if (!answer) return false;
  answer().then(reply, (e) => reply({ ok: false, why: e.message }));
  return true;                                      // the reply is awaited
});
