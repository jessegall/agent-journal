/* @code-commandments-generated */
if (!document.getElementById("window-styles-0011acd8fb70")) { const style = document.createElement("style"); style.id = "window-styles-0011acd8fb70"; style.textContent = ".current[data-v-78349099]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-78349099]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-78349099]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-78349099]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-78349099]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-78349099]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-78349099]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-b468e960]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-b468e960]{margin:0;font-weight:600}.fitness-measure[data-v-b468e960]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-b468e960]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-9be402b9]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-9be402b9]{margin:0;font-weight:600}.load-row[data-v-9be402b9]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-9be402b9]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-21b9065f]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-21b9065f]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-21b9065f]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-21b9065f]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-21b9065f]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-21b9065f]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-21b9065f]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as f, openBlock as s, createElementBlock as t, toDisplayString as o, createCommentVNode as i, Fragment as u, createElementVNode as r, renderList as m, createTextVNode as _ } from "vue";
import { useWindow as v } from "@journal/window-kit";
import { _ as k } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const h = {
  class: "fitness",
  "data-fitness": ""
}, y = {
  key: 0,
  class: "fitness-note"
}, g = {
  class: "fitness-head",
  "data-fitness-head": ""
}, w = ["data-measure"], x = {
  __name: "FitnessPanel",
  setup(F) {
    const c = v(), a = f(null), l = f("");
    async function p() {
      const n = await c.read(`usage fitness --agent ${c.agent}`);
      l.value = n.ok ? "" : n.error, a.value = n.ok ? n.value : null;
    }
    return p(), (n, d) => (s(), t("div", h, [
      l.value ? (s(), t("p", y, o(l.value), 1)) : i("", !0),
      a.value ? (s(), t(u, { key: 1 }, [
        r("p", g, o(a.value.is_measured ? `Fitness ${a.value.score} of 100` : "Fitness not measured yet: an agent is measured after its first half hour"), 1),
        (s(!0), t(u, null, m(a.value.measures, (e) => (s(), t("p", {
          key: e.key,
          class: "fitness-measure",
          "data-measure": e.key
        }, [
          r("span", null, o(e.label), 1),
          r("span", null, [
            _(o(e.value), 1),
            e.pass_level !== null ? (s(), t(u, { key: 0 }, [
              _(" of " + o(e.pass_level), 1)
            ], 64)) : i("", !0)
          ])
        ], 8, w))), 128)),
        d[0] || (d[0] = r("p", { class: "fitness-note" }, "Counts messages, waits and tasks. Version 4 also measured workers, merges and lines of code, which this version does not record.", -1))
      ], 64)) : i("", !0)
    ]));
  }
}, B = /* @__PURE__ */ k(x, [["__scopeId", "data-v-b468e960"]]);
export {
  B as default
};
