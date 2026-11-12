if (!document.getElementById("window-styles-985f8e9d4880")) { const style = document.createElement("style"); style.id = "window-styles-985f8e9d4880"; style.textContent = ".current[data-v-cc48d24a]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-cc48d24a]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-cc48d24a]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-cc48d24a]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-cc48d24a]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-cc48d24a]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-cc48d24a]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-e020b3e9]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-e020b3e9]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-e020b3e9]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-e020b3e9]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-e020b3e9]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-e020b3e9]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-e020b3e9]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-f3fd6de8]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-f3fd6de8]{margin:0;font-weight:600}.fitness-measure[data-v-f3fd6de8]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-f3fd6de8]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-9de62706]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-9de62706]{margin:0;font-weight:600}.load-row[data-v-9de62706]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-9de62706]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-5d403466]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-5d403466]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-5d403466]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-5d403466]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-5d403466]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-5d403466]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.limit-form[data-v-5d403466]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr) 64px auto;gap:6px;padding:8px 0}.limit-form select[data-v-5d403466],.limit-form .percent[data-v-5d403466]{box-sizing:border-box;width:100%;min-width:0}.limit-form .current[data-v-5d403466]{grid-column:1 / -1;padding:0}.none[data-v-5d403466]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as r, createBlock as p, unref as s, withCtx as u, createElementVNode as a, createElementBlock as d, toDisplayString as t, createCommentVNode as i, Fragment as _ } from "vue";
import { useWindow as m, agentRowArgument as w, WindowRoom as g } from "@journal/window-kit";
import { _ as c } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const f = {
  class: "load",
  "data-load": ""
}, h = {
  key: 0,
  class: "load-note"
}, v = {
  class: "load-head",
  "data-load-head": ""
}, x = {
  class: "load-row",
  "data-load-row": "arrivals"
}, k = {
  class: "load-row",
  "data-load-row": "answers"
}, y = {
  class: "load-row",
  "data-load-row": "waiting"
}, L = {
  __name: "LoadPanel",
  setup(B) {
    const n = m();
    n.state["fitness.agent"] = w(n.agent);
    const { data: e, failure: l } = n.props.fitness;
    return (A, o) => (r(), p(s(g), { padding: "14px 16px" }, {
      default: u(() => [
        a("div", f, [
          s(l) ? (r(), d("p", h, t(s(l)), 1)) : i("", !0),
          s(e) ? (r(), d(_, { key: 1 }, [
            a("p", v, "Load " + t(s(e).workload.toFixed(2)), 1),
            a("p", x, [
              o[0] || (o[0] = a("span", null, "Your messages per hour", -1)),
              a("span", null, t(Math.round(s(e).arrivals_hourly)), 1)
            ]),
            a("p", k, [
              o[1] || (o[1] = a("span", null, "Agent replies per hour", -1)),
              a("span", null, t(Math.round(s(e).answers_hourly)), 1)
            ]),
            a("p", y, [
              o[2] || (o[2] = a("span", null, "Your messages waiting to be read", -1)),
              a("span", null, t(s(e).waiting_messages), 1)
            ]),
            o[3] || (o[3] = a("p", { class: "load-note" }, "Load is messages arriving against those answered, over the last half hour.", -1))
          ], 64)) : i("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, M = /* @__PURE__ */ c(L, [["__scopeId", "data-v-9de62706"]]);
export {
  M as default
};
