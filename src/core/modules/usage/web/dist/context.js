/* @code-commandments-generated */
if (!document.getElementById("window-styles-7e1aa73b5368")) { const style = document.createElement("style"); style.id = "window-styles-7e1aa73b5368"; style.textContent = ".current[data-v-2e50afc3]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-2e50afc3]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-2e50afc3]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-2e50afc3]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-2e50afc3]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-2e50afc3]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-2e50afc3]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-52b7a0da]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-52b7a0da]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-52b7a0da]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-52b7a0da]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-52b7a0da]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-52b7a0da]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-52b7a0da]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-1cfbcbe7]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-1cfbcbe7]{margin:0;font-weight:600}.fitness-measure[data-v-1cfbcbe7]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-1cfbcbe7]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-bf25ffc4]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-bf25ffc4]{margin:0;font-weight:600}.load-row[data-v-bf25ffc4]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-bf25ffc4]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-c383dd48]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-c383dd48]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-c383dd48]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-c383dd48]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-c383dd48]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-c383dd48]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-c383dd48]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as l, openBlock as i, createBlock as m, unref as u, withCtx as _, createElementVNode as e, toDisplayString as c, normalizeStyle as x } from "vue";
import { useWindow as f, WindowRoom as v } from "@journal/window-kit";
import { _ as w } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const g = {
  class: "meter",
  "data-context-meter": ""
}, y = { class: "track" }, C = { "data-last-compacted": "" }, h = {
  __name: "ContextPanel",
  setup(k) {
    const r = f(), { data: p } = r.props.usage, o = l(() => {
      var a, t;
      return ((t = (a = p.value) == null ? void 0 : a.agents) == null ? void 0 : t.find((n) => n.role === "main")) ?? null;
    }), d = l(() => {
      var a;
      return (a = o.value) != null && a.last_compacted_at ? new Date(o.value.last_compacted_at).toLocaleString() : "Not yet";
    });
    return (a, t) => (i(), m(u(v), { padding: "14px 16px" }, {
      default: _(() => {
        var n, s;
        return [
          t[1] || (t[1] = e("p", { class: "current" }, "Context window", -1)),
          e("div", g, [
            t[0] || (t[0] = e("span", null, "Used", -1)),
            e("strong", null, c(Math.round(((n = o.value) == null ? void 0 : n.context_percent) ?? 0)) + "%", 1),
            e("span", y, [
              e("span", {
                style: x({ width: `${((s = o.value) == null ? void 0 : s.context_percent) ?? 0}%` })
              }, null, 4)
            ]),
            e("small", C, "Last compacted: " + c(d.value), 1)
          ])
        ];
      }),
      _: 1
    }));
  }
}, L = /* @__PURE__ */ w(h, [["__scopeId", "data-v-2e50afc3"]]);
export {
  L as default
};
