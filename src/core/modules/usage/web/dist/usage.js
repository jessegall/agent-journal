/* @code-commandments-generated */
if (!document.getElementById("window-styles-4e9ee7695254")) { const style = document.createElement("style"); style.id = "window-styles-4e9ee7695254"; style.textContent = ".current[data-v-6f487acc]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-6f487acc]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-6f487acc]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-6f487acc]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-6f487acc]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-6f487acc]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-6f487acc]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-dad3ba37]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-dad3ba37]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-dad3ba37]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-dad3ba37]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-dad3ba37]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-dad3ba37]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-dad3ba37]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-7beafc0d]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-7beafc0d]{margin:0;font-weight:600}.fitness-measure[data-v-7beafc0d]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-7beafc0d]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-27cf7d88]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-27cf7d88]{margin:0;font-weight:600}.load-row[data-v-27cf7d88]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-27cf7d88]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-b7f1678d]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-b7f1678d]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-b7f1678d]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-b7f1678d]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-b7f1678d]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-b7f1678d]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-b7f1678d]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as g, openBlock as n, createElementBlock as a, Fragment as _, createElementVNode as e, unref as l, toDisplayString as r, createCommentVNode as d, renderList as f, normalizeStyle as h } from "vue";
import { useUsage as S, usePoll as k } from "@journal/window-kit";
import { _ as v } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const y = {
  key: 0,
  class: "none"
}, E = { class: "track" }, L = {
  key: 1,
  class: "none"
}, N = 3e4, P = {
  __name: "UsagePanel",
  setup(x) {
    const { value: o, failure: u, load: m } = S(), c = g(() => {
      var t;
      return ((t = o.value) == null ? void 0 : t.windows) ?? [];
    }), i = (t) => `Starts again ${new Date(t * 1e3).toLocaleString()}`;
    return k(m, () => !0, N), (t, p) => (n(), a(_, null, [
      p[0] || (p[0] = e("p", { class: "current" }, "Plan allowance used", -1)),
      l(u) ? (n(), a("p", y, r(l(u)), 1)) : d("", !0),
      (n(!0), a(_, null, f(c.value, (s) => (n(), a("div", {
        key: s.title,
        class: "meter",
        "data-usage-meter": ""
      }, [
        e("span", null, r(s.title), 1),
        e("strong", null, r(Math.round(s.used_percent)) + "%", 1),
        e("span", E, [
          e("span", {
            style: h({ width: `${s.used_percent}%` })
          }, null, 4)
        ]),
        e("small", null, r(i(s.reset_epoch_seconds)), 1)
      ]))), 128)),
      l(o) && !c.value.length ? (n(), a("p", L, "No current plan window has been reported here.")) : d("", !0)
    ], 64));
  }
}, b = /* @__PURE__ */ v(P, [["__scopeId", "data-v-b7f1678d"]]);
export {
  b as default
};
