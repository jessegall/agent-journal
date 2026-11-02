/* @code-commandments-generated */
if (!document.getElementById("window-styles-0011acd8fb70")) { const style = document.createElement("style"); style.id = "window-styles-0011acd8fb70"; style.textContent = ".current[data-v-78349099]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-78349099]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-78349099]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-78349099]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-78349099]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-78349099]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-78349099]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-b468e960]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-b468e960]{margin:0;font-weight:600}.fitness-measure[data-v-b468e960]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-b468e960]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-9be402b9]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-9be402b9]{margin:0;font-weight:600}.load-row[data-v-9be402b9]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-9be402b9]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-21b9065f]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-21b9065f]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-21b9065f]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-21b9065f]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-21b9065f]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-21b9065f]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-21b9065f]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as _, computed as g, onUnmounted as h, openBlock as t, createElementBlock as s, Fragment as i, createElementVNode as n, toDisplayString as l, createCommentVNode as u, renderList as k, normalizeStyle as y } from "vue";
import { useWindow as S } from "@journal/window-kit";
import { _ as x } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const E = {
  key: 0,
  class: "none"
}, I = { class: "track" }, N = {
  key: 1,
  class: "none"
}, w = {
  key: 2,
  class: "none"
}, L = 3e4, b = {
  __name: "UsagePanel",
  setup(C) {
    const m = S(), o = _(null), r = _(""), c = g(() => {
      var e;
      return ((e = o.value) == null ? void 0 : e.windows) ?? [];
    });
    async function d() {
      const e = await m.read("usage show");
      o.value = e.ok ? e.value : null, r.value = e.ok ? "" : e.error;
    }
    const v = (e) => `Starts again ${new Date(e * 1e3).toLocaleString()}`, f = setInterval(d, L);
    return h(() => clearInterval(f)), d(), (e, p) => (t(), s(i, null, [
      p[0] || (p[0] = n("p", { class: "current" }, "Plan allowance used", -1)),
      r.value ? (t(), s("p", E, l(r.value), 1)) : u("", !0),
      (t(!0), s(i, null, k(c.value, (a) => (t(), s("div", {
        key: a.title,
        class: "meter",
        "data-usage-meter": ""
      }, [
        n("span", null, l(a.title), 1),
        n("strong", null, l(Math.round(a.used_percent)) + "%", 1),
        n("span", I, [
          n("span", {
            style: y({ width: `${a.used_percent}%` })
          }, null, 4)
        ]),
        n("small", null, l(v(a.reset_epoch_seconds)), 1)
      ]))), 128)),
      o.value && !c.value.length ? (t(), s("p", N, "No current plan window has been reported here.")) : u("", !0),
      o.value ? (t(), s("p", w, "Cost of the open sessions: $" + l(Number(o.value.cost_dollars || 0).toFixed(2)), 1)) : u("", !0)
    ], 64));
  }
}, U = /* @__PURE__ */ x(b, [["__scopeId", "data-v-21b9065f"]]);
export {
  U as default
};
