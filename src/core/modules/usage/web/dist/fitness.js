if (!document.getElementById("window-styles-e1bf735ffaa0")) { const style = document.createElement("style"); style.id = "window-styles-e1bf735ffaa0"; style.textContent = ".current[data-v-2e50afc3]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-2e50afc3]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-2e50afc3]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-2e50afc3]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-2e50afc3]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-2e50afc3]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-2e50afc3]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-52b7a0da]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-52b7a0da]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-52b7a0da]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-52b7a0da]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-52b7a0da]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-52b7a0da]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-52b7a0da]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-1cfbcbe7]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-1cfbcbe7]{margin:0;font-weight:600}.fitness-measure[data-v-1cfbcbe7]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-1cfbcbe7]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-bf25ffc4]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-bf25ffc4]{margin:0;font-weight:600}.load-row[data-v-bf25ffc4]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-bf25ffc4]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-b9f679c6]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-b9f679c6]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-b9f679c6]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-b9f679c6]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-b9f679c6]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-b9f679c6]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.limit-form[data-v-b9f679c6]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr) 64px auto;gap:6px;padding:8px 0}.limit-form select[data-v-b9f679c6],.limit-form .percent[data-v-b9f679c6]{box-sizing:border-box;width:100%;min-width:0}.limit-form .current[data-v-b9f679c6]{grid-column:1 / -1;padding:0}.none[data-v-b9f679c6]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as t, createBlock as _, unref as e, withCtx as u, createElementVNode as n, createElementBlock as a, toDisplayString as o, createCommentVNode as l, Fragment as d, renderList as m, createTextVNode as p } from "vue";
import { useWindow as k, WindowRoom as g } from "@journal/window-kit";
import { _ as h } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const y = {
  class: "fitness",
  "data-fitness": ""
}, x = {
  key: 0,
  class: "fitness-note"
}, v = {
  class: "fitness-head",
  "data-fitness-head": ""
}, w = ["data-measure"], F = {
  __name: "FitnessPanel",
  setup(b) {
    const r = k();
    r.state["fitness.agent"] = String(r.agent);
    const { data: i, failure: c } = r.props.fitness;
    return (B, f) => (t(), _(e(g), { padding: "14px 16px" }, {
      default: u(() => [
        n("div", y, [
          e(c) ? (t(), a("p", x, o(e(c)), 1)) : l("", !0),
          e(i) ? (t(), a(d, { key: 1 }, [
            n("p", v, o(e(i).is_measured ? `Fitness: ${e(i).score} of 100` : "Fitness not measured yet: an agent is measured after its first half hour"), 1),
            (t(!0), a(d, null, m(e(i).measures, (s) => (t(), a("p", {
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
            ], 8, w))), 128)),
            f[0] || (f[0] = n("p", { class: "fitness-note" }, "Counts messages, waits and tasks.", -1))
          ], 64)) : l("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, E = /* @__PURE__ */ h(F, [["__scopeId", "data-v-1cfbcbe7"]]);
export {
  E as default
};
