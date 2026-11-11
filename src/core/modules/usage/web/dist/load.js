if (!document.getElementById("window-styles-9259c4f8cef4")) { const style = document.createElement("style"); style.id = "window-styles-9259c4f8cef4"; style.textContent = ".current[data-v-2e50afc3]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-2e50afc3]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-2e50afc3]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-2e50afc3]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-2e50afc3]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-2e50afc3]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-2e50afc3]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-52b7a0da]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-52b7a0da]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-52b7a0da]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-52b7a0da]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-52b7a0da]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-52b7a0da]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-52b7a0da]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-1b832570]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-1b832570]{margin:0;font-weight:600}.fitness-measure[data-v-1b832570]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-1b832570]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-046f30aa]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-046f30aa]{margin:0;font-weight:600}.load-row[data-v-046f30aa]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-046f30aa]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-b9f679c6]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-b9f679c6]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-b9f679c6]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-b9f679c6]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-b9f679c6]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-b9f679c6]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.limit-form[data-v-b9f679c6]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr) 64px auto;gap:6px;padding:8px 0}.limit-form select[data-v-b9f679c6],.limit-form .percent[data-v-b9f679c6]{box-sizing:border-box;width:100%;min-width:0}.limit-form .current[data-v-b9f679c6]{grid-column:1 / -1;padding:0}.none[data-v-b9f679c6]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as r, createBlock as p, unref as s, withCtx as u, createElementVNode as a, createElementBlock as d, toDisplayString as e, createCommentVNode as i, Fragment as _ } from "vue";
import { useWindow as m, agentRowArgument as w, WindowRoom as g } from "@journal/window-kit";
import { _ as c } from "./_plugin-vue_export-helper-CHgC5LLL.js";
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
    const { data: t, failure: l } = n.props.fitness;
    return (A, o) => (r(), p(s(g), { padding: "14px 16px" }, {
      default: u(() => [
        a("div", f, [
          s(l) ? (r(), d("p", h, e(s(l)), 1)) : i("", !0),
          s(t) ? (r(), d(_, { key: 1 }, [
            a("p", v, "Load " + e(s(t).workload.toFixed(2)), 1),
            a("p", x, [
              o[0] || (o[0] = a("span", null, "Your messages per hour", -1)),
              a("span", null, e(Math.round(s(t).arrivals_hourly)), 1)
            ]),
            a("p", k, [
              o[1] || (o[1] = a("span", null, "Agent replies per hour", -1)),
              a("span", null, e(Math.round(s(t).answers_hourly)), 1)
            ]),
            a("p", y, [
              o[2] || (o[2] = a("span", null, "Your messages waiting to be read", -1)),
              a("span", null, e(s(t).waiting_messages), 1)
            ]),
            o[3] || (o[3] = a("p", { class: "load-note" }, "Load is messages arriving against those answered, over the last half hour.", -1))
          ], 64)) : i("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, M = /* @__PURE__ */ c(L, [["__scopeId", "data-v-046f30aa"]]);
export {
  M as default
};
