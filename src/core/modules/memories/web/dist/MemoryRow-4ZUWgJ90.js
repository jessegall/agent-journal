import { computed as y, openBlock as a, createElementBlock as n, unref as i, normalizeClass as c, createElementVNode as o, toDisplayString as r, createTextVNode as h, Fragment as d, renderList as l } from "vue";
import { peekRef as f, wordLabel as _ } from "@journal/window-kit";
import { _ as k } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const p = ["data-memory"], g = { class: "memory-text" }, x = { class: "memory-meta" }, v = { "data-memory-state": "" }, b = {
  class: "memory-weight",
  "data-memory-weight": ""
}, E = {
  class: "steps",
  "aria-hidden": "true"
}, w = 10, R = {
  __name: "MemoryRow",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const s = e, u = y(() => [s.row.task_id ? `Task ${s.row.task_id}` : "", s.row.reason ? `Reason: ${s.row.reason}` : ""].filter(Boolean));
    return (T, m) => (a(), n("button", {
      type: "button",
      class: c(["memory", { removed: e.row.state === "removed" }]),
      "data-memory": e.row.id,
      onClick: m[0] || (m[0] = (t) => i(f)(`memories:${e.row.id}`))
    }, [
      o("span", g, r(e.row.text), 1),
      o("span", x, [
        o("span", v, "State: " + r(i(_)(e.row.state)), 1),
        o("span", b, [
          h(" Weight: " + r(e.row.weight) + " of " + r(w) + " ", 1),
          o("span", E, [
            (a(), n(d, null, l(w, (t) => o("i", {
              key: t,
              class: c({ on: t <= e.row.weight })
            }, null, 2)), 64))
          ])
        ]),
        (a(!0), n(d, null, l(u.value, (t) => (a(), n("span", { key: t }, r(t), 1))), 128))
      ])
    ], 10, p));
  }
}, I = /* @__PURE__ */ k(R, [["__scopeId", "data-v-865a5df0"]]);
export {
  I as M
};
