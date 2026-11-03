/* @code-commandments-generated */
if (!document.getElementById("window-styles-4e9ee7695254")) { const style = document.createElement("style"); style.id = "window-styles-4e9ee7695254"; style.textContent = ".current[data-v-6f487acc]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-6f487acc]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-6f487acc]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-6f487acc]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-6f487acc]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-6f487acc]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-6f487acc]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-dad3ba37]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-dad3ba37]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-dad3ba37]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-dad3ba37]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-dad3ba37]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-dad3ba37]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-dad3ba37]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-7beafc0d]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-7beafc0d]{margin:0;font-weight:600}.fitness-measure[data-v-7beafc0d]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-7beafc0d]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-27cf7d88]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-27cf7d88]{margin:0;font-weight:600}.load-row[data-v-27cf7d88]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-27cf7d88]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-b7f1678d]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-b7f1678d]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-b7f1678d]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-b7f1678d]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-b7f1678d]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-b7f1678d]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-b7f1678d]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as n, createElementBlock as r, unref as o, toDisplayString as t, createCommentVNode as d, Fragment as p, createElementVNode as a } from "vue";
import { useWindow as _, useReadLine as g } from "@journal/window-kit";
import { _ as m } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const w = {
  class: "load",
  "data-load": ""
}, c = {
  key: 0,
  class: "load-note"
}, f = {
  class: "load-head",
  "data-load-head": ""
}, h = {
  class: "load-row",
  "data-load-row": "arrivals"
}, v = {
  class: "load-row",
  "data-load-row": "answers"
}, k = {
  class: "load-row",
  "data-load-row": "waiting"
}, x = {
  __name: "LoadPanel",
  setup(y) {
    const i = _(), { value: e, failure: l, load: u } = g(() => `usage fitness --agent ${i.agent}`);
    return u(), (L, s) => (n(), r("div", w, [
      o(l) ? (n(), r("p", c, t(o(l)), 1)) : d("", !0),
      o(e) ? (n(), r(p, { key: 1 }, [
        a("p", f, "Load " + t(o(e).workload.toFixed(2)), 1),
        a("p", h, [
          s[0] || (s[0] = a("span", null, "Your messages arriving an hour", -1)),
          a("span", null, t(Math.round(o(e).arrivals_hourly)), 1)
        ]),
        a("p", v, [
          s[1] || (s[1] = a("span", null, "Messages the agent answers an hour", -1)),
          a("span", null, t(Math.round(o(e).answers_hourly)), 1)
        ]),
        a("p", k, [
          s[2] || (s[2] = a("span", null, "Your messages waiting to be read", -1)),
          a("span", null, t(o(e).waiting_messages), 1)
        ]),
        s[3] || (s[3] = a("p", { class: "load-note" }, "Load is messages arriving against those answered, over the last half hour.", -1))
      ], 64)) : d("", !0)
    ]));
  }
}, F = /* @__PURE__ */ m(x, [["__scopeId", "data-v-27cf7d88"]]);
export {
  F as default
};
