// Injected on demand, runs once, cleans up after itself. It draws a crosshair over the page, marks
// whatever is under it, and sends what was clicked to the extension's own process.
(() => {
  if (window.__journalPicking) return;
  window.__journalPicking = true;

  const box = document.createElement("div");
  box.style.cssText = [
    "position:fixed", "z-index:2147483647", "pointer-events:none",
    "border:2px solid #6c8cff", "border-radius:3px",
    "background:rgba(108,140,255,.14)", "transition:all 40ms linear",
  ].join(";");
  const hint = document.createElement("div");
  hint.style.cssText = [
    "position:fixed", "left:50%", "top:14px", "transform:translateX(-50%)",
    "z-index:2147483647", "pointer-events:none", "padding:6px 12px", "border-radius:7px",
    "background:#14161a", "color:#e6e8ec", "border:1px solid #2a2d33",
    "font:500 12px/1.4 -apple-system,system-ui,sans-serif", "box-shadow:0 6px 24px rgba(0,0,0,.4)",
  ].join(";");
  hint.textContent = "Click an element to send it to the journal · Esc to stop";
  document.documentElement.append(box, hint);

  let at = null;

  // A SELECTOR SOMEBODY CAN PASTE. An id wins outright; otherwise the path is walked up with
  // nth-of-type, and classes that look generated (hashes, utility soup) are left out.
  const stable = (cls) => /^[a-zA-Z][\w-]{1,24}$/.test(cls) && !/^(is|has)-/.test(cls) && !/\d{4,}/.test(cls);

  function selectorFor(el) {
    if (el.id && /^[A-Za-z][\w-]*$/.test(el.id)) return `#${el.id}`;
    const parts = [];
    let node = el;
    while (node && node.nodeType === 1 && parts.length < 5) {
      let part = node.tagName.toLowerCase();
      if (node.id && /^[A-Za-z][\w-]*$/.test(node.id)) {
        parts.unshift(`#${node.id}`);
        break;
      }
      const classes = [...node.classList].filter(stable).slice(0, 2);
      if (classes.length) part += `.${classes.join(".")}`;
      const siblings = node.parentElement ? [...node.parentElement.children].filter((s) => s.tagName === node.tagName) : [];
      if (siblings.length > 1) part += `:nth-of-type(${siblings.indexOf(node) + 1})`;
      parts.unshift(part);
      node = node.parentElement;
    }
    return parts.join(" > ");
  }

  // WHAT THE AGENT CAN ACT ON. A test id or a component attribute is the one thing on a rendered
  // page that names the source, so it is carried even though the selector already identifies the node.
  function hintsFor(el) {
    const out = [];
    for (const name of el.getAttributeNames()) {
      if (/^data-(testid|test|cy|component|source|file|qa)$/.test(name)) out.push(`${name}="${el.getAttribute(name)}"`);
    }
    if (el.getAttribute("aria-label")) out.push(`aria-label="${el.getAttribute("aria-label")}"`);
    return out;
  }

  function stop() {
    box.remove();
    hint.remove();
    document.removeEventListener("mousemove", move, true);
    document.removeEventListener("click", take, true);
    document.removeEventListener("keydown", key, true);
    window.__journalPicking = false;
  }

  function say(text, good) {
    const note = document.createElement("div");
    note.style.cssText = hint.style.cssText.replace("top:14px", "top:14px") + `;border-color:${good ? "#3d7a4f" : "#7a3d3d"}`;
    note.textContent = text;
    document.documentElement.append(note);
    setTimeout(() => note.remove(), 3200);
  }

  function move(e) {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el || el === box || el === hint) return;
    at = el;
    const r = el.getBoundingClientRect();
    box.style.left = `${r.x}px`;
    box.style.top = `${r.y}px`;
    box.style.width = `${r.width}px`;
    box.style.height = `${r.height}px`;
  }

  function take(e) {
    e.preventDefault();
    e.stopPropagation();
    const el = at;
    if (!el) return stop();
    const r = el.getBoundingClientRect();
    const picked = {
      selector: selectorFor(el),
      url: location.href,
      text: (el.innerText || "").trim().replace(/\s+/g, " ").slice(0, 200),
      html: el.outerHTML.slice(0, 600),
      hints: hintsFor(el),
      rect: { x: r.x, y: r.y, width: r.width, height: r.height },
      scale: window.devicePixelRatio || 1,
    };
    // THE MARKS COME OFF BEFORE THE PICTURE IS TAKEN, or the picture is of the marks.
    stop();
    requestAnimationFrame(() => requestAnimationFrame(() => {
      chrome.runtime.sendMessage({ kind: "picked", picked }, (got) => {
        if (chrome.runtime.lastError) return say("The extension could not reach the journal.", false);
        if (got && got.ok) return say(`Sent to ${got.env}${got.shot ? " with a picture" : ""}.`, true);
        say((got && got.why) || "The journal did not take it.", false);
      });
    }));
  }

  function key(e) {
    if (e.key === "Escape") {
      e.preventDefault();
      stop();
    }
  }

  document.addEventListener("mousemove", move, true);
  document.addEventListener("click", take, true);
  document.addEventListener("keydown", key, true);
})();
