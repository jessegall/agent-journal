/* @code-commandments-generated */
async function l() {
  let r = 1;
  const o = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), s = window.parent;
  window.addEventListener("message", (e) => {
    var i;
    if (e.source !== s || !e.data) return;
    const { id: n, answer: t } = e.data;
    if (a.has(n)) {
      t.value && a.get(n)(t.value);
      return;
    }
    (i = o.get(n)) == null || i(t), o.delete(n);
  });
  const c = (e) => new Promise((n) => {
    const t = r++;
    o.set(t, n), s.postMessage({ ...e, id: t }, "*");
  });
  return s.postMessage({ type: "beat" }, "*"), setInterval(() => s.postMessage({ type: "beat" }, "*"), 2e3), {
    read: (e) => c({ type: "read", line: e }),
    run: (e) => c({ type: "run", line: e }),
    follow: (e, n) => {
      const t = r++;
      a.set(t, n), s.postMessage({ type: "follow", patterns: e, id: t }, "*");
    }
  };
}
export {
  l as connect
};
