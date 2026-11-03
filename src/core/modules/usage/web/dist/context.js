/* @code-commandments-generated */
if (!document.getElementById("window-styles-1ba3a9e0ff56")) { const style = document.createElement("style"); style.id = "window-styles-1ba3a9e0ff56"; style.textContent = ".current[data-v-1aa2ca93]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-1aa2ca93]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-1aa2ca93]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-1aa2ca93]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-1aa2ca93]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-1aa2ca93]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-1aa2ca93]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-0e906283]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-0e906283]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-0e906283]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-0e906283]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-0e906283]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-0e906283]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-0e906283]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-7beafc0d]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-7beafc0d]{margin:0;font-weight:600}.fitness-measure[data-v-7beafc0d]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-7beafc0d]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-27cf7d88]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-27cf7d88]{margin:0;font-weight:600}.load-row[data-v-27cf7d88]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-27cf7d88]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-4db9ff50]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-4db9ff50]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-4db9ff50]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-4db9ff50]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-4db9ff50]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-4db9ff50]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-4db9ff50]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as l, openBlock as m, createElementBlock as p, Fragment as _, createElementVNode as e, toDisplayString as c, normalizeStyle as i } from "vue";
import { useReadLine as v, usePoll as x } from "@journal/window-kit";
import { _ as f } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const g = {
  class: "meter",
  "data-context-meter": ""
}, S = { class: "track" }, w = { "data-last-compacted": "" }, E = 3e4, L = {
  __name: "ContextPanel",
  setup(y) {
    const { value: r, load: u } = v(() => "usage show"), o = l(() => {
      var a, t;
      return ((t = (a = r.value) == null ? void 0 : a.agents) == null ? void 0 : t.find((n) => n.role === "main")) ?? null;
    }), d = l(() => {
      var a;
      return (a = o.value) != null && a.last_compacted_at ? new Date(o.value.last_compacted_at).toLocaleString() : "Not yet";
    });
    return x(u, () => !0, E), (a, t) => {
      var n, s;
      return m(), p(_, null, [
        t[1] || (t[1] = e("p", { class: "current" }, "Context window", -1)),
        e("div", g, [
          t[0] || (t[0] = e("span", null, "Used", -1)),
          e("strong", null, c(Math.round(((n = o.value) == null ? void 0 : n.context_percent) ?? 0)) + "%", 1),
          e("span", S, [
            e("span", {
              style: i({ width: `${((s = o.value) == null ? void 0 : s.context_percent) ?? 0}%` })
            }, null, 4)
          ]),
          e("small", w, "Last compacted: " + c(d.value), 1)
        ])
      ], 64);
    };
  }
}, D = /* @__PURE__ */ f(L, [["__scopeId", "data-v-1aa2ca93"]]);
export {
  D as default
};
