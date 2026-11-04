/* @code-commandments-generated */
if (!document.getElementById("window-styles-c22b37c48f56")) { const style = document.createElement("style"); style.id = "window-styles-c22b37c48f56"; style.textContent = ".current[data-v-3111db78]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-3111db78]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-3111db78]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-3111db78]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-3111db78]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-3111db78]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-3111db78]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-6399fd38]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-6399fd38]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-6399fd38]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-6399fd38]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-6399fd38]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-6399fd38]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-6399fd38]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-e6d9eadc]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-e6d9eadc]{margin:0;font-weight:600}.fitness-measure[data-v-e6d9eadc]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-e6d9eadc]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-8ae5ebdd]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-8ae5ebdd]{margin:0;font-weight:600}.load-row[data-v-8ae5ebdd]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-8ae5ebdd]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-bf472fbc]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-bf472fbc]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-bf472fbc]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-bf472fbc]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-bf472fbc]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-bf472fbc]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-bf472fbc]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as t, createBlock as p, unref as e, withCtx as m, createElementVNode as n, createElementBlock as a, toDisplayString as o, createCommentVNode as i, Fragment as d, renderList as h, createTextVNode as u } from "vue";
import { useWindow as g, useReadLine as k, WindowRoom as x } from "@journal/window-kit";
import { _ as y } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const v = {
  class: "fitness",
  "data-fitness": ""
}, w = {
  key: 0,
  class: "fitness-note"
}, F = {
  class: "fitness-head",
  "data-fitness-head": ""
}, V = ["data-measure"], B = {
  __name: "FitnessPanel",
  setup(C) {
    const f = g(), { value: r, failure: l, load: _ } = k(() => `usage fitness --agent ${f.agent}`);
    return _(), (N, c) => (t(), p(e(x), { padding: "14px 16px" }, {
      default: m(() => [
        n("div", v, [
          e(l) ? (t(), a("p", w, o(e(l)), 1)) : i("", !0),
          e(r) ? (t(), a(d, { key: 1 }, [
            n("p", F, o(e(r).is_measured ? `Fitness ${e(r).score} of 100` : "Fitness not measured yet: an agent is measured after its first half hour"), 1),
            (t(!0), a(d, null, h(e(r).measures, (s) => (t(), a("p", {
              key: s.key,
              class: "fitness-measure",
              "data-measure": s.key
            }, [
              n("span", null, o(s.label), 1),
              n("span", null, [
                u(o(s.value), 1),
                s.pass_level !== null ? (t(), a(d, { key: 0 }, [
                  u(" of " + o(s.pass_level), 1)
                ], 64)) : i("", !0)
              ])
            ], 8, V))), 128)),
            c[0] || (c[0] = n("p", { class: "fitness-note" }, "Counts messages, waits and tasks. Version 4 also measured agents, merges and lines of code, which this version does not record.", -1))
          ], 64)) : i("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, R = /* @__PURE__ */ y(B, [["__scopeId", "data-v-e6d9eadc"]]);
export {
  R as default
};
