/* @code-commandments-generated */
if (!document.getElementById("window-styles-4d3aa400bc1c")) { const style = document.createElement("style"); style.id = "window-styles-4d3aa400bc1c"; style.textContent = ".requests[data-v-e05d2e6b]{display:flex;flex-wrap:wrap;gap:16px}.list[data-v-e05d2e6b]{display:flex;flex:1 1 280px;flex-direction:column;gap:2px}.row[data-v-e05d2e6b]{display:flex;flex-wrap:wrap;gap:8px;padding:6px 8px;border:0;border-radius:6px;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.row.open[data-v-e05d2e6b]{background:var(--surface-2, var(--border))}.event[data-v-e05d2e6b]{font-weight:600}.note[data-v-e05d2e6b]{margin:0;color:var(--text-3);font-size:12px}.detail[data-v-e05d2e6b]{flex:2 1 420px;min-width:0}.heading[data-v-e05d2e6b]{margin:0 0 4px;font-size:12px}pre[data-v-e05d2e6b]{margin:0 0 12px;padding:8px;overflow:auto;border:1px solid var(--border);border-radius:6px;font-size:12px}.numbers-tools[data-v-b039a2fd]{display:flex;gap:8px;margin-bottom:10px}.numbers-note[data-v-b039a2fd]{margin:0;color:var(--text-3);font-size:12.5px}.numbers-table[data-v-b039a2fd]{width:100%;border-collapse:collapse;font-size:12.5px}.numbers-table th[data-v-b039a2fd],.numbers-table td[data-v-b039a2fd]{padding:4px 8px;border-bottom:1px solid var(--border);text-align:left}.numbers-table th[data-v-b039a2fd]{color:var(--text-3);font-weight:500}\n"; document.head.appendChild(style); }
import { computed as h, ref as q, openBlock as n, createElementBlock as a, unref as p, toDisplayString as d, Fragment as v, createElementVNode as s, renderList as b, normalizeClass as g, createCommentVNode as N } from "vue";
import { useReadLine as C, usePoll as R } from "@journal/window-kit";
import { _ as x } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const B = {
  class: "requests",
  "data-hook-requests": ""
}, H = {
  key: 0,
  class: "note",
  role: "alert"
}, O = {
  key: 1,
  class: "note"
}, E = { class: "list" }, L = ["data-hook-request", "onClick"], S = { class: "event" }, V = { class: "note" }, z = { class: "note" }, D = {
  key: 0,
  class: "detail",
  "data-hook-request-detail": ""
}, F = { "data-hook-request-headers": "" }, I = { "data-hook-request-body": "" }, J = {
  __name: "HookRequests",
  setup(P) {
    const { value: k, failure: u, load: m } = C(() => "developer hook-requests"), l = h(() => {
      var e;
      return ((e = k.value) == null ? void 0 : e.rows) ?? [];
    }), r = q(0), i = h(() => l.value.find((e) => e.id === r.value)), y = (e) => {
      var o, t;
      return ((o = e.body) == null ? void 0 : o.event) ?? ((t = e.body) == null ? void 0 : t.hook_event_name) ?? "hook";
    }, f = (e) => {
      var o, t, c;
      return ((t = (o = e.body) == null ? void 0 : o.tool) == null ? void 0 : t.name) ?? ((c = e.body) == null ? void 0 : c.tool_name) ?? "";
    }, _ = (e) => JSON.stringify(e, null, 2);
    return R(m, () => !0), (e, o) => (n(), a("div", B, [
      p(u) ? (n(), a("p", H, d(p(u)), 1)) : l.value.length ? (n(), a(v, { key: 2 }, [
        s("div", E, [
          (n(!0), a(v, null, b(l.value, (t) => (n(), a("button", {
            key: t.id,
            type: "button",
            class: g(["row", { open: t.id === r.value }]),
            "data-hook-request": t.id,
            onClick: (c) => r.value = t.id
          }, [
            s("span", S, d(y(t)), 1),
            s("span", V, d(f(t)), 1),
            s("span", z, d(t.received_at), 1)
          ], 10, L))), 128))
        ]),
        i.value ? (n(), a("div", D, [
          o[0] || (o[0] = s("h3", { class: "heading" }, "Headers", -1)),
          s("pre", F, d(_(i.value.headers)), 1),
          o[1] || (o[1] = s("h3", { class: "heading" }, "Body", -1)),
          s("pre", I, d(_(i.value.body)), 1)
        ])) : N("", !0)
      ], 64)) : (n(), a("p", O, "Nothing recorded yet. Record agent calls in the developer settings turns the log on."))
    ]));
  }
}, G = /* @__PURE__ */ x(J, [["__scopeId", "data-v-e05d2e6b"]]);
export {
  G as default
};
