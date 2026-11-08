/* @code-commandments-generated */
if (!document.getElementById("window-styles-bae5e1bcecf6")) { const style = document.createElement("style"); style.id = "window-styles-bae5e1bcecf6"; style.textContent = ".current[data-v-cc48d24a]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-cc48d24a]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-cc48d24a]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-cc48d24a]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-cc48d24a]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-cc48d24a]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-cc48d24a]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-e020b3e9]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-e020b3e9]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-e020b3e9]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-e020b3e9]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-e020b3e9]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-e020b3e9]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-e020b3e9]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-917afa20]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-917afa20]{margin:0;font-weight:600}.fitness-measure[data-v-917afa20]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-917afa20]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-dce9407d]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-dce9407d]{margin:0;font-weight:600}.load-row[data-v-dce9407d]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-dce9407d]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-1552c5d6]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-1552c5d6]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-1552c5d6]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-1552c5d6]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-1552c5d6]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-1552c5d6]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-1552c5d6]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as t, createBlock as _, unref as e, withCtx as u, createElementVNode as a, createElementBlock as n, toDisplayString as o, createCommentVNode as l, Fragment as d, renderList as m, createTextVNode as p } from "vue";
import { useWindow as k, WindowRoom as g } from "@journal/window-kit";
import { _ as h } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
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
  setup(B) {
    const r = k();
    r.state["fitness.agent"] = String(r.agent);
    const { data: i, failure: f } = r.props.fitness;
    return (C, c) => (t(), _(e(g), { padding: "14px 16px" }, {
      default: u(() => [
        a("div", y, [
          e(f) ? (t(), n("p", x, o(e(f)), 1)) : l("", !0),
          e(i) ? (t(), n(d, { key: 1 }, [
            a("p", v, o(e(i).is_measured ? `Fitness: ${e(i).score} of 100` : "Fitness not measured yet: an agent is measured after its first half hour"), 1),
            (t(!0), n(d, null, m(e(i).measures, (s) => (t(), n("p", {
              key: s.key,
              class: "fitness-measure",
              "data-measure": s.key
            }, [
              a("span", null, o(s.label), 1),
              a("span", null, [
                p(o(s.value), 1),
                s.pass_level !== null ? (t(), n(d, { key: 0 }, [
                  p(" of " + o(s.pass_level), 1)
                ], 64)) : l("", !0)
              ])
            ], 8, w))), 128)),
            c[0] || (c[0] = a("p", { class: "fitness-note" }, "Counts messages, waits and tasks.", -1))
          ], 64)) : l("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, P = /* @__PURE__ */ h(F, [["__scopeId", "data-v-917afa20"]]);
export {
  P as default
};
