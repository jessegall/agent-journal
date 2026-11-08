/* @code-commandments-generated */
if (!document.getElementById("window-styles-a44236e89623")) { const style = document.createElement("style"); style.id = "window-styles-a44236e89623"; style.textContent = ".current[data-v-2e50afc3]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-2e50afc3]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-2e50afc3]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-2e50afc3]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-2e50afc3]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-2e50afc3]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-2e50afc3]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-52b7a0da]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-52b7a0da]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-52b7a0da]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-52b7a0da]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-52b7a0da]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-52b7a0da]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-52b7a0da]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-1cfbcbe7]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-1cfbcbe7]{margin:0;font-weight:600}.fitness-measure[data-v-1cfbcbe7]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-1cfbcbe7]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-bf25ffc4]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-bf25ffc4]{margin:0;font-weight:600}.load-row[data-v-bf25ffc4]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-bf25ffc4]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-4106dcdf]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-4106dcdf]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-4106dcdf]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-4106dcdf]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-4106dcdf]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-4106dcdf]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.limit-form[data-v-4106dcdf]{display:grid;grid-template-columns:1fr 1fr 5em auto;gap:6px;padding:8px 0}.limit-form .current[data-v-4106dcdf]{grid-column:1 / -1;padding:0}.none[data-v-4106dcdf]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as r, createBlock as p, unref as s, withCtx as u, createElementVNode as a, createElementBlock as d, toDisplayString as e, createCommentVNode as i, Fragment as _ } from "vue";
import { useWindow as m, WindowRoom as w } from "@journal/window-kit";
import { _ as f } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const g = {
  class: "load",
  "data-load": ""
}, c = {
  key: 0,
  class: "load-note"
}, h = {
  class: "load-head",
  "data-load-head": ""
}, v = {
  class: "load-row",
  "data-load-row": "arrivals"
}, x = {
  class: "load-row",
  "data-load-row": "answers"
}, k = {
  class: "load-row",
  "data-load-row": "waiting"
}, y = {
  __name: "LoadPanel",
  setup(L) {
    const n = m();
    n.state["fitness.agent"] = String(n.agent);
    const { data: t, failure: l } = n.props.fitness;
    return (B, o) => (r(), p(s(w), { padding: "14px 16px" }, {
      default: u(() => [
        a("div", g, [
          s(l) ? (r(), d("p", c, e(s(l)), 1)) : i("", !0),
          s(t) ? (r(), d(_, { key: 1 }, [
            a("p", h, "Load " + e(s(t).workload.toFixed(2)), 1),
            a("p", v, [
              o[0] || (o[0] = a("span", null, "Your messages per hour", -1)),
              a("span", null, e(Math.round(s(t).arrivals_hourly)), 1)
            ]),
            a("p", x, [
              o[1] || (o[1] = a("span", null, "Agent replies per hour", -1)),
              a("span", null, e(Math.round(s(t).answers_hourly)), 1)
            ]),
            a("p", k, [
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
}, F = /* @__PURE__ */ f(y, [["__scopeId", "data-v-bf25ffc4"]]);
export {
  F as default
};
