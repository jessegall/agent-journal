/* @code-commandments-generated */
if (!document.getElementById("window-styles-4e9ee7695254")) { const style = document.createElement("style"); style.id = "window-styles-4e9ee7695254"; style.textContent = ".current[data-v-6f487acc]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-6f487acc]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-6f487acc]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-6f487acc]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-6f487acc]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-6f487acc]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-6f487acc]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-dad3ba37]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-dad3ba37]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-dad3ba37]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-dad3ba37]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-dad3ba37]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-dad3ba37]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-dad3ba37]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-7beafc0d]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-7beafc0d]{margin:0;font-weight:600}.fitness-measure[data-v-7beafc0d]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-7beafc0d]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-27cf7d88]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-27cf7d88]{margin:0;font-weight:600}.load-row[data-v-27cf7d88]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-27cf7d88]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-b7f1678d]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-b7f1678d]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-b7f1678d]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-b7f1678d]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-b7f1678d]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-b7f1678d]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-b7f1678d]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as l, openBlock as u, createElementBlock as d, Fragment as _, createElementVNode as e, toDisplayString as c, normalizeStyle as i } from "vue";
import { useUsage as v, usePoll as x } from "@journal/window-kit";
import { _ as f } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const g = {
  class: "meter",
  "data-context-meter": ""
}, S = { class: "track" }, E = { "data-last-compacted": "" }, w = 3e4, y = {
  __name: "ContextPanel",
  setup(C) {
    const { value: r, load: m } = v(), o = l(() => {
      var a, t;
      return ((t = (a = r.value) == null ? void 0 : a.agents) == null ? void 0 : t.find((n) => n.role === "main")) ?? null;
    }), p = l(() => {
      var a;
      return (a = o.value) != null && a.last_compacted_at ? new Date(o.value.last_compacted_at).toLocaleString() : "Not yet";
    });
    return x(m, () => !0, w), (a, t) => {
      var n, s;
      return u(), d(_, null, [
        t[1] || (t[1] = e("p", { class: "current" }, "Context window", -1)),
        e("div", g, [
          t[0] || (t[0] = e("span", null, "Used", -1)),
          e("strong", null, c(Math.round(((n = o.value) == null ? void 0 : n.context_percent) ?? 0)) + "%", 1),
          e("span", S, [
            e("span", {
              style: i({ width: `${((s = o.value) == null ? void 0 : s.context_percent) ?? 0}%` })
            }, null, 4)
          ]),
          e("small", E, "Last compacted: " + c(p.value), 1)
        ])
      ], 64);
    };
  }
}, I = /* @__PURE__ */ f(y, [["__scopeId", "data-v-6f487acc"]]);
export {
  I as default
};
