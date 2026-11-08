/* @code-commandments-generated */
if (!document.getElementById("window-styles-bae5e1bcecf6")) { const style = document.createElement("style"); style.id = "window-styles-bae5e1bcecf6"; style.textContent = ".current[data-v-cc48d24a]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-cc48d24a]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-cc48d24a]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-cc48d24a]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-cc48d24a]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-cc48d24a]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-cc48d24a]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-e020b3e9]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-e020b3e9]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-e020b3e9]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-e020b3e9]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-e020b3e9]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-e020b3e9]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-e020b3e9]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-917afa20]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-917afa20]{margin:0;font-weight:600}.fitness-measure[data-v-917afa20]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-917afa20]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-dce9407d]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-dce9407d]{margin:0;font-weight:600}.load-row[data-v-dce9407d]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-dce9407d]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-1552c5d6]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-1552c5d6]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-1552c5d6]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-1552c5d6]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-1552c5d6]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-1552c5d6]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-1552c5d6]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as c, openBlock as i, createBlock as m, unref as u, withCtx as _, createElementVNode as e, toDisplayString as l, normalizeStyle as x } from "vue";
import { useWindow as f, WindowRoom as v } from "@journal/window-kit";
import { _ as w } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const g = {
  class: "meter",
  "data-context-meter": ""
}, y = { class: "track" }, C = { "data-last-compacted": "" }, h = {
  __name: "ContextPanel",
  setup(k) {
    const r = f(), { data: d } = r.props.usage, o = c(() => {
      var a, t;
      return ((t = (a = d.value) == null ? void 0 : a.agents) == null ? void 0 : t.find((n) => n.role === "main")) ?? null;
    }), p = c(() => {
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
            e("strong", null, l(Math.round(((n = o.value) == null ? void 0 : n.context_percent) ?? 0)) + "%", 1),
            e("span", y, [
              e("span", {
                style: x({ width: `${((s = o.value) == null ? void 0 : s.context_percent) ?? 0}%` })
              }, null, 4)
            ]),
            e("small", C, "Last compacted: " + l(p.value), 1)
          ])
        ];
      }),
      _: 1
    }));
  }
}, L = /* @__PURE__ */ w(h, [["__scopeId", "data-v-cc48d24a"]]);
export {
  L as default
};
