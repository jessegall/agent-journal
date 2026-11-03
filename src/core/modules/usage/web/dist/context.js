/* @code-commandments-generated */
if (!document.getElementById("window-styles-4b635b62fab7")) { const style = document.createElement("style"); style.id = "window-styles-4b635b62fab7"; style.textContent = ".current[data-v-3111db78]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-3111db78]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-3111db78]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-3111db78]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-3111db78]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-3111db78]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-3111db78]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-6399fd38]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-6399fd38]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-6399fd38]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-6399fd38]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-6399fd38]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-6399fd38]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-6399fd38]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-2ef7b70b]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-2ef7b70b]{margin:0;font-weight:600}.fitness-measure[data-v-2ef7b70b]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-2ef7b70b]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-8ae5ebdd]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-8ae5ebdd]{margin:0;font-weight:600}.load-row[data-v-8ae5ebdd]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-8ae5ebdd]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-bf472fbc]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-bf472fbc]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-bf472fbc]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-bf472fbc]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-bf472fbc]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-bf472fbc]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-bf472fbc]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as l, openBlock as u, createBlock as _, unref as m, withCtx as i, createElementVNode as e, toDisplayString as c, normalizeStyle as x } from "vue";
import { useUsage as f, usePoll as v, WindowRoom as g } from "@journal/window-kit";
import { _ as w } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const S = {
  class: "meter",
  "data-context-meter": ""
}, C = { class: "track" }, y = { "data-last-compacted": "" }, E = 3e4, L = {
  __name: "ContextPanel",
  setup(h) {
    const { value: r, load: d } = f(), a = l(() => {
      var o, t;
      return ((t = (o = r.value) == null ? void 0 : o.agents) == null ? void 0 : t.find((n) => n.role === "main")) ?? null;
    }), p = l(() => {
      var o;
      return (o = a.value) != null && o.last_compacted_at ? new Date(a.value.last_compacted_at).toLocaleString() : "Not yet";
    });
    return v(d, () => !0, E), (o, t) => (u(), _(m(g), { padding: "14px 16px" }, {
      default: i(() => {
        var n, s;
        return [
          t[1] || (t[1] = e("p", { class: "current" }, "Context window", -1)),
          e("div", S, [
            t[0] || (t[0] = e("span", null, "Used", -1)),
            e("strong", null, c(Math.round(((n = a.value) == null ? void 0 : n.context_percent) ?? 0)) + "%", 1),
            e("span", C, [
              e("span", {
                style: x({ width: `${((s = a.value) == null ? void 0 : s.context_percent) ?? 0}%` })
              }, null, 4)
            ]),
            e("small", y, "Last compacted: " + c(p.value), 1)
          ])
        ];
      }),
      _: 1
    }));
  }
}, N = /* @__PURE__ */ w(L, [["__scopeId", "data-v-3111db78"]]);
export {
  N as default
};
