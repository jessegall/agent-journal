import { computed as c, withDirectives as x, openBlock as i, createElementBlock as l, unref as u, normalizeClass as h, createElementVNode as a, toDisplayString as n, createTextVNode as _, Fragment as v, renderList as p } from "vue";
import { useWindow as R, peekRef as g, wordLabel as M, vContext as T, copying as E, short as I, deleteItem as S } from "@journal/window-kit";
import { _ as W } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const C = ["data-memory"], H = {
  class: "memory-title",
  "data-memory-title": ""
}, j = { class: "memory-text" }, B = { class: "memory-meta" }, G = { "data-memory-state": "" }, D = {
  class: "memory-weight",
  "data-memory-weight": ""
}, L = {
  class: "steps",
  "aria-hidden": "true"
}, k = 10, N = {
  __name: "MemoryRow",
  props: { row: { type: Object, required: !0 } },
  setup(o) {
    const e = o, b = c(() => [e.row.task_id ? `Task ${e.row.task_id}` : "", e.row.reason ? `Reason: ${e.row.reason}` : ""].filter(Boolean)), d = R(), f = [["9", "owed work"], ["7", "later today"], ["5", "work in hand"]], w = c(() => e.row.state === "removed"), s = c(() => String(e.row.id)), y = ["memory", "restore", s.value], $ = () => ({
      head: `Memory ${e.row.id}`,
      items: [
        { label: "Open", group: "open", run: () => g(`memories:${e.row.id}`) },
        { label: "Weigh", group: "open", disabled: w.value, reason: "Removed", children: f.map(([t, m]) => ({
          label: `${t}: ${m}`,
          run: async ({ say: r }) => r((await d.run(["memory", "weigh", s.value, t])).ok ? `Memory ${s.value} weighs ${t}` : "The journal refused the weight")
        })) },
        { label: "Copy text", group: "copy", run: ({ say: t }) => E(e.row.text, I(e.row.text, 30), t) },
        w.value ? { label: "Restore", group: "own", run: async ({ say: t }) => t((await d.run(y)).ok ? `Memory ${s.value} is back` : "The journal could not restore it") } : S({ word: "Remove", name: `memory ${s.value}`, remove: () => d.run(["memory", "remove", s.value, "--reason", "Removed from the memory list"]), restore: y })
      ]
    });
    return (t, m) => x((i(), l("button", {
      type: "button",
      class: h(["memory", { removed: o.row.state === "removed" }]),
      "data-memory": o.row.id,
      onClick: m[0] || (m[0] = (r) => u(g)(`memories:${o.row.id}`))
    }, [
      a("span", H, "Memory " + n(o.row.id), 1),
      a("span", j, n(o.row.text), 1),
      a("span", B, [
        a("span", G, "State: " + n(u(M)(o.row.state)), 1),
        a("span", D, [
          _(" Weight: " + n(o.row.weight) + " of " + n(k) + " ", 1),
          a("span", L, [
            (i(), l(v, null, p(k, (r) => a("i", {
              key: r,
              class: h({ on: r <= o.row.weight })
            }, null, 2)), 64))
          ])
        ]),
        (i(!0), l(v, null, p(b.value, (r) => (i(), l("span", { key: r }, n(r), 1))), 128))
      ])
    ], 10, C)), [
      [u(T), $]
    ]);
  }
}, z = /* @__PURE__ */ W(N, [["__scopeId", "data-v-7c7f6b81"]]);
export {
  z as M
};
