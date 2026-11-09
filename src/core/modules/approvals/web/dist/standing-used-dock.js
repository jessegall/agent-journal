if (!document.getElementById("window-styles-8cc0327fa11c")) { const style = document.createElement("style"); style.id = "window-styles-8cc0327fa11c"; style.textContent = ".approval-question[data-v-372999c2]{margin:4px 14px 2px 36px;color:var(--text);font-size:13.5px;font-weight:600}.approval-description[data-v-372999c2]{margin:0 14px 8px 36px;color:var(--text-3);font-size:12px;font-weight:400;white-space:pre-wrap}.approval-why[data-v-372999c2]{margin:0 14px 8px 36px;color:var(--text-2);font-size:12.5px;font-weight:400;white-space:pre-wrap;overflow-wrap:anywhere}.approval-details[data-v-372999c2]{margin:4px 14px 8px 36px}.approval-details pre[data-v-372999c2]{margin:6px 0 0;white-space:pre-wrap;overflow-wrap:anywhere}.heading[data-v-adf5f660]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.row[data-v-adf5f660]{display:grid;grid-template-columns:1fr auto;gap:2px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.row small[data-v-adf5f660]{grid-column:1;color:var(--text-3);font-size:10.5px}.row button[data-v-adf5f660]{grid-column:2;grid-row:1 / span 2}.none[data-v-adf5f660]{margin:0;color:var(--text-3);font-size:12px}.standing-question[data-v-72969cec]{margin:4px 14px 2px 36px;color:var(--text);font-size:13.5px;font-weight:600}.standing-reason[data-v-72969cec]{margin:0 14px 8px 36px;color:var(--text-3);font-size:12px;font-weight:400}\n"; document.head.appendChild(style); }
import { computed as t, openBlock as d, createElementBlock as i, Fragment as p, createElementVNode as o, toDisplayString as s } from "vue";
import { useDockCard as u, useWindow as l } from "@journal/window-kit";
import { _ } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const m = {
  class: "standing-question",
  "data-standing-question": ""
}, f = {
  class: "standing-reason",
  "data-standing-reason": ""
}, g = {
  __name: "StandingUsedDock",
  setup(h) {
    const a = u(), n = l().option("row"), c = t(() => n.value.text), r = t(
      () => {
        var e;
        return ((e = a.data.value) == null ? void 0 : e.scope) === "same" ? "You accepted this request before and chose to always accept it." : "You accepted requests like this before and chose to always accept them.";
      }
    );
    return (e, k) => (d(), i(p, null, [
      o("p", m, s(c.value), 1),
      o("p", f, s(r.value), 1)
    ], 64));
  }
}, x = /* @__PURE__ */ _(g, [["__scopeId", "data-v-72969cec"]]);
export {
  x as default
};
