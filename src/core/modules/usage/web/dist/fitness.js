if (!document.getElementById("window-styles-a734fbe4e1f0")) { const style = document.createElement("style"); style.id = "window-styles-a734fbe4e1f0"; style.textContent = ".current[data-v-cc48d24a]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-cc48d24a]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-cc48d24a]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-cc48d24a]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-cc48d24a]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-cc48d24a]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-cc48d24a]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-e020b3e9]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-e020b3e9]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-e020b3e9]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-e020b3e9]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-e020b3e9]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-e020b3e9]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-e020b3e9]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-f3fd6de8]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-f3fd6de8]{margin:0;font-weight:600}.fitness-measure[data-v-f3fd6de8]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-f3fd6de8]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-9de62706]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-9de62706]{margin:0;font-weight:600}.load-row[data-v-9de62706]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-9de62706]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-39e57460]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-39e57460]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-39e57460]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-39e57460]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-39e57460]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-39e57460]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.limit-form[data-v-39e57460]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr) 64px auto;gap:6px;padding:8px 0}.limit-form select[data-v-39e57460],.limit-form .percent[data-v-39e57460]{box-sizing:border-box;width:100%;min-width:0}.limit-form .current[data-v-39e57460]{grid-column:1 / -1;padding:0}.none[data-v-39e57460]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as t, createBlock as u, unref as e, withCtx as _, createElementVNode as n, createElementBlock as a, toDisplayString as o, createCommentVNode as l, Fragment as d, renderList as m, createTextVNode as p } from "vue";
import { useWindow as k, agentRowArgument as g, WindowRoom as h } from "@journal/window-kit";
import { _ as y } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const x = {
  class: "fitness",
  "data-fitness": ""
}, v = {
  key: 0,
  class: "fitness-note"
}, w = {
  class: "fitness-head",
  "data-fitness-head": ""
}, F = ["data-measure"], B = {
  __name: "FitnessPanel",
  setup(C) {
    const i = k();
    i.state["fitness.agent"] = g(i.agent);
    const { data: r, failure: f } = i.props.fitness;
    return (N, c) => (t(), u(e(h), { padding: "14px 16px" }, {
      default: _(() => [
        n("div", x, [
          e(f) ? (t(), a("p", v, o(e(f)), 1)) : l("", !0),
          e(r) ? (t(), a(d, { key: 1 }, [
            n("p", w, o(e(r).is_measured ? `Fitness: ${e(r).score} of 100` : "Fitness not measured yet: an agent is measured after its first half hour"), 1),
            (t(!0), a(d, null, m(e(r).measures, (s) => (t(), a("p", {
              key: s.key,
              class: "fitness-measure",
              "data-measure": s.key
            }, [
              n("span", null, o(s.label), 1),
              n("span", null, [
                p(o(s.value), 1),
                s.pass_level !== null ? (t(), a(d, { key: 0 }, [
                  p(" of " + o(s.pass_level), 1)
                ], 64)) : l("", !0)
              ])
            ], 8, F))), 128)),
            c[0] || (c[0] = n("p", { class: "fitness-note" }, "Counts messages, waits and tasks.", -1))
          ], 64)) : l("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, R = /* @__PURE__ */ y(B, [["__scopeId", "data-v-f3fd6de8"]]);
export {
  R as default
};
