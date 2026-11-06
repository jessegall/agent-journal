/* @code-commandments-generated */
if (!document.getElementById("window-styles-04a13e104bec")) { const style = document.createElement("style"); style.id = "window-styles-04a13e104bec"; style.textContent = ".current[data-v-845f2d56]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-845f2d56]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-845f2d56]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-845f2d56]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-845f2d56]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-845f2d56]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-845f2d56]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-ef30dc1b]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-ef30dc1b]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-ef30dc1b]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-ef30dc1b]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-ef30dc1b]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-ef30dc1b]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-ef30dc1b]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-b55877dd]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-b55877dd]{margin:0;font-weight:600}.fitness-measure[data-v-b55877dd]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-b55877dd]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-fd584773]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-fd584773]{margin:0;font-weight:600}.load-row[data-v-fd584773]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-fd584773]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-bf472fbc]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-bf472fbc]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-bf472fbc]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-bf472fbc]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-bf472fbc]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-bf472fbc]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-bf472fbc]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as t, createBlock as p, unref as e, withCtx as m, createElementVNode as n, createElementBlock as a, toDisplayString as o, createCommentVNode as r, Fragment as l, renderList as k, createTextVNode as u } from "vue";
import { useWindow as g, useReadLine as h, WindowRoom as x } from "@journal/window-kit";
import { _ as y } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const v = {
  class: "fitness",
  "data-fitness": ""
}, F = {
  key: 0,
  class: "fitness-note"
}, w = {
  class: "fitness-head",
  "data-fitness-head": ""
}, B = ["data-measure"], C = {
  __name: "FitnessPanel",
  setup(N) {
    const f = g(), { value: i, failure: d, load: _ } = h(() => `usage fitness --agent ${f.agent}`);
    return _(), (V, c) => (t(), p(e(x), { padding: "14px 16px" }, {
      default: m(() => [
        n("div", v, [
          e(d) ? (t(), a("p", F, o(e(d)), 1)) : r("", !0),
          e(i) ? (t(), a(l, { key: 1 }, [
            n("p", w, o(e(i).is_measured ? `Fitness: ${e(i).score} of 100` : "Fitness not measured yet: an agent is measured after its first half hour"), 1),
            (t(!0), a(l, null, k(e(i).measures, (s) => (t(), a("p", {
              key: s.key,
              class: "fitness-measure",
              "data-measure": s.key
            }, [
              n("span", null, o(s.label), 1),
              n("span", null, [
                u(o(s.value), 1),
                s.pass_level !== null ? (t(), a(l, { key: 0 }, [
                  u(" of " + o(s.pass_level), 1)
                ], 64)) : r("", !0)
              ])
            ], 8, B))), 128)),
            c[0] || (c[0] = n("p", { class: "fitness-note" }, "Counts messages, waits and tasks.", -1))
          ], 64)) : r("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, P = /* @__PURE__ */ y(C, [["__scopeId", "data-v-b55877dd"]]);
export {
  P as default
};
