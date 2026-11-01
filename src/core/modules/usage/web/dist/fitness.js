/* @code-commandments-generated */
if (!document.getElementById("window-styles-2c335021ff5e")) { const style = document.createElement("style"); style.id = "window-styles-2c335021ff5e"; style.textContent = ".current[data-v-78349099]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-78349099]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-78349099]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-78349099]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-78349099]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-78349099]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-78349099]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-ed516024]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-ed516024]{margin:0;font-weight:600}.fitness-measure[data-v-ed516024]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-ed516024]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-21b9065f]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-21b9065f]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-21b9065f]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-21b9065f]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-21b9065f]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-21b9065f]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-21b9065f]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as f, openBlock as a, createElementBlock as n, toDisplayString as o, createCommentVNode as u, Fragment as d, createElementVNode as e, renderList as m, createTextVNode as p } from "vue";
import { useWindow as v } from "@journal/window-kit";
import { _ as k } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const g = {
  class: "fitness",
  "data-fitness": ""
}, h = {
  key: 0,
  class: "fitness-note"
}, y = {
  class: "fitness-head",
  "data-fitness-head": ""
}, w = ["data-measure"], x = {
  class: "fitness-measure",
  "data-measure": "load"
}, F = {
  __name: "FitnessPanel",
  setup(V) {
    const c = v(), s = f(null), i = f("");
    async function _() {
      const l = await c.read(`usage fitness --agent ${c.agent}`);
      i.value = l.ok ? "" : l.error, s.value = l.ok ? l.value : null;
    }
    return _(), (l, r) => (a(), n("div", g, [
      i.value ? (a(), n("p", h, o(i.value), 1)) : u("", !0),
      s.value ? (a(), n(d, { key: 1 }, [
        e("p", y, o(s.value.is_measured ? `Fitness ${s.value.score} of 100` : "Fitness not measured yet: an agent is measured after its first half hour"), 1),
        (a(!0), n(d, null, m(s.value.measures, (t) => (a(), n("p", {
          key: t.key,
          class: "fitness-measure",
          "data-measure": t.key
        }, [
          e("span", null, o(t.label), 1),
          e("span", null, [
            p(o(t.value), 1),
            t.pass_level !== null ? (a(), n(d, { key: 0 }, [
              p(" of " + o(t.pass_level), 1)
            ], 64)) : u("", !0)
          ])
        ], 8, w))), 128)),
        e("p", x, [
          r[0] || (r[0] = e("span", null, "Load: messages arriving against those answered", -1)),
          e("span", null, o(s.value.load), 1)
        ]),
        r[1] || (r[1] = e("p", { class: "fitness-note" }, "Counts messages, waits and tasks. Version 4 also measured workers, merges and lines of code, which this version does not record.", -1))
      ], 64)) : u("", !0)
    ]));
  }
}, E = /* @__PURE__ */ k(F, [["__scopeId", "data-v-ed516024"]]);
export {
  E as default
};
