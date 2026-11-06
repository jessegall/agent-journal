/* @code-commandments-generated */
if (!document.getElementById("window-styles-eab3be241e1b")) { const style = document.createElement("style"); style.id = "window-styles-eab3be241e1b"; style.textContent = ".current[data-v-845f2d56]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-845f2d56]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-845f2d56]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-845f2d56]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-845f2d56]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-845f2d56]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-845f2d56]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-95096d06]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-95096d06]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-95096d06]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-95096d06]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-95096d06]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-95096d06]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-95096d06]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-78de9950]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-78de9950]{margin:0;font-weight:600}.fitness-measure[data-v-78de9950]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-78de9950]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-0038b75c]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-0038b75c]{margin:0;font-weight:600}.load-row[data-v-0038b75c]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-0038b75c]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-a6955edf]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-a6955edf]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-a6955edf]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-a6955edf]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-a6955edf]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-a6955edf]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-a6955edf]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as r, createBlock as p, unref as s, withCtx as u, createElementVNode as a, createElementBlock as d, toDisplayString as e, createCommentVNode as i, Fragment as _ } from "vue";
import { useWindow as m, WindowRoom as w } from "@journal/window-kit";
import { _ as g } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const c = {
  class: "load",
  "data-load": ""
}, f = {
  key: 0,
  class: "load-note"
}, h = {
  class: "load-head",
  "data-load-head": ""
}, x = {
  class: "load-row",
  "data-load-row": "arrivals"
}, k = {
  class: "load-row",
  "data-load-row": "answers"
}, v = {
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
        a("div", c, [
          s(l) ? (r(), d("p", f, e(s(l)), 1)) : i("", !0),
          s(t) ? (r(), d(_, { key: 1 }, [
            a("p", h, "Load " + e(s(t).workload.toFixed(2)), 1),
            a("p", x, [
              o[0] || (o[0] = a("span", null, "Your messages per hour", -1)),
              a("span", null, e(Math.round(s(t).arrivals_hourly)), 1)
            ]),
            a("p", k, [
              o[1] || (o[1] = a("span", null, "Agent replies per hour", -1)),
              a("span", null, e(Math.round(s(t).answers_hourly)), 1)
            ]),
            a("p", v, [
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
}, F = /* @__PURE__ */ g(y, [["__scopeId", "data-v-0038b75c"]]);
export {
  F as default
};
