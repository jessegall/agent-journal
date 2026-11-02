/* @code-commandments-generated */
if (!document.getElementById("window-styles-0011acd8fb70")) { const style = document.createElement("style"); style.id = "window-styles-0011acd8fb70"; style.textContent = ".current[data-v-78349099]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-78349099]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-78349099]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-78349099]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-78349099]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-78349099]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-78349099]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-b468e960]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-b468e960]{margin:0;font-weight:600}.fitness-measure[data-v-b468e960]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-b468e960]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-9be402b9]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-9be402b9]{margin:0;font-weight:600}.load-row[data-v-9be402b9]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-9be402b9]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-21b9065f]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-21b9065f]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-21b9065f]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-21b9065f]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-21b9065f]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-21b9065f]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-21b9065f]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as _, computed as r, onUnmounted as i, openBlock as v, createElementBlock as x, Fragment as f, createElementVNode as n, toDisplayString as u, normalizeStyle as g } from "vue";
import { useWindow as w } from "@journal/window-kit";
import { _ as S } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const y = {
  class: "meter",
  "data-context-meter": ""
}, E = { class: "track" }, I = { "data-last-compacted": "" }, k = 3e4, C = {
  __name: "ContextPanel",
  setup(L) {
    const d = w(), l = _(null), a = r(() => {
      var t, e;
      return ((e = (t = l.value) == null ? void 0 : t.agents) == null ? void 0 : e.find((o) => o.role === "main")) ?? null;
    }), m = r(() => {
      var t;
      return (t = a.value) != null && t.last_compacted_at ? new Date(a.value.last_compacted_at).toLocaleString() : "Not yet";
    });
    async function s() {
      const t = await d.read("usage show");
      l.value = t.ok ? t.value : null;
    }
    const p = setInterval(s, k);
    return i(() => clearInterval(p)), s(), (t, e) => {
      var o, c;
      return v(), x(f, null, [
        e[1] || (e[1] = n("p", { class: "current" }, "Context window", -1)),
        n("div", y, [
          e[0] || (e[0] = n("span", null, "Used", -1)),
          n("strong", null, u(Math.round(((o = a.value) == null ? void 0 : o.context_percent) ?? 0)) + "%", 1),
          n("span", E, [
            n("span", {
              style: g({ width: `${((c = a.value) == null ? void 0 : c.context_percent) ?? 0}%` })
            }, null, 4)
          ]),
          n("small", I, "Last compacted: " + u(m.value), 1)
        ])
      ], 64);
    };
  }
}, B = /* @__PURE__ */ S(C, [["__scopeId", "data-v-78349099"]]);
export {
  B as default
};
