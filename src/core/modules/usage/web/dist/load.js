/* @code-commandments-generated */
if (!document.getElementById("window-styles-04a13e104bec")) { const style = document.createElement("style"); style.id = "window-styles-04a13e104bec"; style.textContent = ".current[data-v-845f2d56]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-845f2d56]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-845f2d56]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-845f2d56]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-845f2d56]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-845f2d56]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-845f2d56]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-ef30dc1b]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-ef30dc1b]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-ef30dc1b]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-ef30dc1b]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-ef30dc1b]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-ef30dc1b]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-ef30dc1b]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-b55877dd]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-b55877dd]{margin:0;font-weight:600}.fitness-measure[data-v-b55877dd]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-b55877dd]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-fd584773]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-fd584773]{margin:0;font-weight:600}.load-row[data-v-fd584773]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-fd584773]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-bf472fbc]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-bf472fbc]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-bf472fbc]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-bf472fbc]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-bf472fbc]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-bf472fbc]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-bf472fbc]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as n, createBlock as u, unref as s, withCtx as _, createElementVNode as a, createElementBlock as l, toDisplayString as t, createCommentVNode as d, Fragment as m } from "vue";
import { useWindow as g, useReadLine as w, WindowRoom as c } from "@journal/window-kit";
import { _ as f } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const h = {
  class: "load",
  "data-load": ""
}, x = {
  key: 0,
  class: "load-note"
}, v = {
  class: "load-head",
  "data-load-head": ""
}, k = {
  class: "load-row",
  "data-load-row": "arrivals"
}, y = {
  class: "load-row",
  "data-load-row": "answers"
}, L = {
  class: "load-row",
  "data-load-row": "waiting"
}, B = {
  __name: "LoadPanel",
  setup(C) {
    const i = g(), { value: e, failure: r, load: p } = w(() => `usage fitness --agent ${i.agent}`);
    return p(), (E, o) => (n(), u(s(c), { padding: "14px 16px" }, {
      default: _(() => [
        a("div", h, [
          s(r) ? (n(), l("p", x, t(s(r)), 1)) : d("", !0),
          s(e) ? (n(), l(m, { key: 1 }, [
            a("p", v, "Load " + t(s(e).workload.toFixed(2)), 1),
            a("p", k, [
              o[0] || (o[0] = a("span", null, "Your messages per hour", -1)),
              a("span", null, t(Math.round(s(e).arrivals_hourly)), 1)
            ]),
            a("p", y, [
              o[1] || (o[1] = a("span", null, "Agent replies per hour", -1)),
              a("span", null, t(Math.round(s(e).answers_hourly)), 1)
            ]),
            a("p", L, [
              o[2] || (o[2] = a("span", null, "Your messages waiting to be read", -1)),
              a("span", null, t(s(e).waiting_messages), 1)
            ]),
            o[3] || (o[3] = a("p", { class: "load-note" }, "Load is messages arriving against those answered, over the last half hour.", -1))
          ], 64)) : d("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, P = /* @__PURE__ */ f(B, [["__scopeId", "data-v-fd584773"]]);
export {
  P as default
};
