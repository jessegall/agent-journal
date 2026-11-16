if (!document.getElementById("window-styles-e5a92405c1c8")) { const style = document.createElement("style"); style.id = "window-styles-e5a92405c1c8"; style.textContent = ".approval-question[data-v-372999c2]{margin:4px 14px 2px 36px;color:var(--text);font-size:13.5px;font-weight:600}.approval-description[data-v-372999c2]{margin:0 14px 8px 36px;color:var(--text-3);font-size:12px;font-weight:400;white-space:pre-wrap}.approval-why[data-v-372999c2]{margin:0 14px 8px 36px;color:var(--text-2);font-size:12.5px;font-weight:400;white-space:pre-wrap;overflow-wrap:anywhere}.approval-details[data-v-372999c2]{margin:4px 14px 8px 36px}.approval-details pre[data-v-372999c2]{margin:6px 0 0;white-space:pre-wrap;overflow-wrap:anywhere}.heading[data-v-64cddd92]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.row[data-v-64cddd92]{display:grid;grid-template-columns:1fr auto;gap:2px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.row small[data-v-64cddd92]{grid-column:1;color:var(--text-3);font-size:10.5px}.row button[data-v-64cddd92]{grid-column:2;grid-row:1 / span 2}.none[data-v-64cddd92]{margin:0;color:var(--text-3);font-size:12px}.saved-question[data-v-e9bda2d0]{margin:4px 14px 2px 36px;color:var(--text);font-size:13.5px;font-weight:600}.saved-reason[data-v-e9bda2d0]{margin:0 14px 8px 36px;color:var(--text-3);font-size:12px;font-weight:400}\n"; document.head.appendChild(style); }
import { computed as t, openBlock as r, createElementBlock as p, Fragment as u, createElementVNode as o, toDisplayString as a } from "vue";
import { useDockCard as i, useWindow as l } from "@journal/window-kit";
import { _ } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const m = {
  class: "saved-question",
  "data-saved-question": ""
}, v = {
  class: "saved-reason",
  "data-saved-reason": ""
}, f = {
  __name: "SavedUsedDock",
  setup(h) {
    const s = i(), c = l().option("row"), n = t(() => c.value.text), d = t(
      () => {
        var e;
        return ((e = s.data.value) == null ? void 0 : e.scope) === "same" ? "You accepted this request before and chose to always accept it." : "You accepted requests like this before and chose to always accept them.";
      }
    );
    return (e, k) => (r(), p(u, null, [
      o("p", m, a(n.value), 1),
      o("p", v, a(d.value), 1)
    ], 64));
  }
}, D = /* @__PURE__ */ _(f, [["__scopeId", "data-v-e9bda2d0"]]);
export {
  D as default
};
