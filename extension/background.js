// The extension's one process: it finds the viewer, injects the picker, takes the picture, and
// posts the message. Nothing here touches the page except through picker.js.

// THE VIEWER IS FOUND, NOT CONFIGURED. It picks the first free port from 8420 up, so a port typed
// into a settings box is wrong the next time it restarts. /api/identity names the project, which is
// how a journal is told from anything else listening on a local port.
const PORTS = Array.from({ length: 20 }, (_, i) => 8420 + i);

async function stored() {
  const got = await chrome.storage.local.get(["url", "env"]);
  return { url: got.url || "", env: got.env || "" };
}

async function identify(url) {
  try {
    const r = await fetch(`${url}/api/identity`, { cache: "no-store" });
    if (!r.ok) return null;
    const got = await r.json();
    return got && got.root ? got : null;
  } catch (e) {
    return null;
  }
}

async function findViewer() {
  const { url } = await stored();
  if (url && (await identify(url))) return url;
  for (const port of PORTS) {
    const here = `http://127.0.0.1:${port}`;
    if (await identify(here)) {
      await chrome.storage.local.set({ url: here });
      return here;
    }
  }
  return "";
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

async function chosenEnv(url) {
  const { env } = await stored();
  const names = await environments(url);
  if (env && names.includes(env)) return env;
  const first = names[0] || "";
  if (first) await chrome.storage.local.set({ env: first });
  return first;
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
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary);
}

function said(picked) {
  const lines = [`I mean this element: \`${picked.selector}\``, picked.url];
  if (picked.text) lines.push(`"${picked.text}"`);
  if (picked.hints.length) lines.push(picked.hints.join(" · "));
  if (picked.html) lines.push("```html", picked.html, "```");
  return lines.join("\n");
}

async function send(picked, tabId) {
  const url = await findViewer();
  if (!url) return { ok: false, why: "No journal viewer is running — start one with `journal serve`." };
  const env = await chosenEnv(url);
  if (!env) return { ok: false, why: "The viewer answered, but it has no environment to write to." };
  let data = "";
  try {
    data = await shotOf(picked.rect, picked.scale);
  } catch (e) {
    data = "";                                    // a message without its picture is still the message
  }
  const files = data ? [{ name: `pointed-${Date.now()}.png`, data }] : [];
  const r = await fetch(`${url}/api/env/${env}/messages`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ text: said(picked), files }),
  });
  if (!r.ok) return { ok: false, why: `The journal refused it (${r.status}).` };
  return { ok: true, env, url, shot: !!data };
}

async function point(tab) {
  if (!tab || !tab.id) return;
  await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["picker.js"] });
}

async function openChat() {
  const url = await findViewer();
  if (!url) return;
  const env = await chosenEnv(url);
  const where = env ? `${url}/#/env/${env}` : url;
  const [open] = await chrome.tabs.query({ url: `${url}/*` });
  if (open) {
    await chrome.tabs.update(open.id, { active: true, url: where });
    await chrome.windows.update(open.windowId, { focused: true });
    return;
  }
  await chrome.tabs.create({ url: where });
}

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command === "point") await point(tab);
  if (command === "chat") await openChat();
});

chrome.runtime.onMessage.addListener((msg, sender, reply) => {
  if (msg && msg.kind === "picked") {
    send(msg.picked, sender.tab && sender.tab.id).then(reply);
    return true;                                  // the reply is awaited
  }
  if (msg && msg.kind === "point") {
    chrome.tabs.query({ active: true, currentWindow: true }).then(([tab]) => point(tab).then(() => reply({ ok: true })));
    return true;
  }
  if (msg && msg.kind === "chat") {
    openChat().then(() => reply({ ok: true }));
    return true;
  }
  if (msg && msg.kind === "where") {
    findViewer().then(async (url) => reply({ url, env: await chosenEnv(url), envs: await environments(url) }));
    return true;
  }
  return false;
});
