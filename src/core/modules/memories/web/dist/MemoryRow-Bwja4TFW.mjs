import { computed as u, openBlock as a, createElementBlock as n, unref as i, normalizeClass as d, createElementVNode as t, toDisplayString as r, createTextVNode as h, Fragment as c, renderList as l } from "vue";
import { peekRef as _, wordLabel as f } from "@journal/window-kit";
import { _ as k } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const p = ["data-memory"], g = {
  class: "memory-title",
  "data-memory-title": ""
}, x = { class: "memory-text" }, b = { class: "memory-meta" }, v = { "data-memory-state": "" }, E = {
  class: "memory-weight",
  "data-memory-weight": ""
}, M = {
  class: "steps",
  "aria-hidden": "true"
}, w = 10, R = {
  __name: "MemoryRow",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const s = e, y = u(() => [s.row.task_id ? `Task ${s.row.task_id}` : "", s.row.reason ? `Reason: ${s.row.reason}` : ""].filter(Boolean));
    return (T, m) => (a(), n("button", {
      type: "button",
      class: d(["memory", { removed: e.row.state === "removed" }]),
      "data-memory": e.row.id,
      onClick: m[0] || (m[0] = (o) => i(_)(`memories:${e.row.id}`))
    }, [
      t("span", g, "Memory " + r(e.row.id), 1),
      t("span", x, r(e.row.text), 1),
      t("span", b, [
        t("span", v, "State: " + r(i(f)(e.row.state)), 1),
        t("span", E, [
          h(" Weight: " + r(e.row.weight) + " of " + r(w) + " ", 1),
          t("span", M, [
            (a(), n(c, null, l(w, (o) => t("i", {
              key: o,
              class: d({ on: o <= e.row.weight })
            }, null, 2)), 64))
          ])
        ]),
        (a(!0), n(c, null, l(y.value, (o) => (a(), n("span", { key: o }, r(o), 1))), 128))
      ])
    ], 10, p));
  }
}, I = /* @__PURE__ */ k(R, [["__scopeId", "data-v-d20973be"]]);
export {
  I as M
};
