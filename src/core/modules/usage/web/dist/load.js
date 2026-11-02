/* @code-commandments-generated */
if (!document.getElementById("window-styles-0011acd8fb70")) { const style = document.createElement("style"); style.id = "window-styles-0011acd8fb70"; style.textContent = ".current[data-v-78349099]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-78349099]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-78349099]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-78349099]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-78349099]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-78349099]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-78349099]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-b468e960]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-b468e960]{margin:0;font-weight:600}.fitness-measure[data-v-b468e960]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-b468e960]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-9be402b9]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-9be402b9]{margin:0;font-weight:600}.load-row[data-v-9be402b9]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-9be402b9]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-21b9065f]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-21b9065f]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-21b9065f]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-21b9065f]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-21b9065f]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-21b9065f]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-21b9065f]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as u, openBlock as l, createElementBlock as r, toDisplayString as t, createCommentVNode as i, Fragment as _, createElementVNode as a } from "vue";
import { useWindow as c } from "@journal/window-kit";
import { _ as g } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const m = {
  class: "load",
  "data-load": ""
}, v = {
  key: 0,
  class: "load-note"
}, w = {
  class: "load-head",
  "data-load-head": ""
}, f = {
  class: "load-row",
  "data-load-row": "arrivals"
}, h = {
  class: "load-row",
  "data-load-row": "answers"
}, k = {
  class: "load-row",
  "data-load-row": "waiting"
}, y = {
  __name: "LoadPanel",
  setup(x) {
    const d = c(), o = u(null), n = u("");
    async function p() {
      const e = await d.read(`usage fitness --agent ${d.agent}`);
      n.value = e.ok ? "" : e.error, o.value = e.ok ? e.value : null;
    }
    return p(), (e, s) => (l(), r("div", m, [
      n.value ? (l(), r("p", v, t(n.value), 1)) : i("", !0),
      o.value ? (l(), r(_, { key: 1 }, [
        a("p", w, "Load " + t(o.value.workload.toFixed(2)), 1),
        a("p", f, [
          s[0] || (s[0] = a("span", null, "Your messages arriving an hour", -1)),
          a("span", null, t(Math.round(o.value.arrivals_hourly)), 1)
        ]),
        a("p", h, [
          s[1] || (s[1] = a("span", null, "Messages the agent answers an hour", -1)),
          a("span", null, t(Math.round(o.value.answers_hourly)), 1)
        ]),
        a("p", k, [
          s[2] || (s[2] = a("span", null, "Your messages waiting to be read", -1)),
          a("span", null, t(o.value.waiting_messages), 1)
        ]),
        s[3] || (s[3] = a("p", { class: "load-note" }, "Load is messages arriving against those answered, over the last half hour.", -1))
      ], 64)) : i("", !0)
    ]));
  }
}, B = /* @__PURE__ */ g(y, [["__scopeId", "data-v-9be402b9"]]);
export {
  B as default
};
