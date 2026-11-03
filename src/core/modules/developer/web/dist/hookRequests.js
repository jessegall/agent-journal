/* @code-commandments-generated */
if (!document.getElementById("window-styles-c536c98f6c0a")) { const style = document.createElement("style"); style.id = "window-styles-c536c98f6c0a"; style.textContent = ".requests[data-v-0c163f7f]{display:flex;flex-wrap:wrap;gap:16px}.list[data-v-0c163f7f]{display:flex;flex:1 1 280px;flex-direction:column;gap:2px}.row[data-v-0c163f7f]{display:flex;flex-wrap:wrap;gap:8px;padding:6px 8px;border:0;border-radius:6px;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.row.open[data-v-0c163f7f]{background:var(--surface-2, var(--border))}.event[data-v-0c163f7f]{font-weight:600}.note[data-v-0c163f7f]{margin:0;color:var(--text-3);font-size:12px}.detail[data-v-0c163f7f]{flex:2 1 420px;min-width:0}.heading[data-v-0c163f7f]{margin:0 0 4px;font-size:12px}pre[data-v-0c163f7f]{margin:0 0 12px;padding:8px;overflow:auto;border:1px solid var(--border);border-radius:6px;font-size:12px}.numbers-tools[data-v-21644aad]{display:flex;gap:8px;margin-bottom:10px}.numbers-note[data-v-21644aad]{margin:0;color:var(--text-3);font-size:12.5px}.numbers-table[data-v-21644aad]{width:100%;border-collapse:collapse;font-size:12.5px}.numbers-table th[data-v-21644aad],.numbers-table td[data-v-21644aad]{padding:4px 8px;border-bottom:1px solid var(--border);text-align:left}.numbers-table th[data-v-21644aad]{color:var(--text-3);font-weight:500}\n"; document.head.appendChild(style); }
import { computed as p, ref as q, openBlock as n, createBlock as g, unref as u, withCtx as b, createElementVNode as s, createElementBlock as a, toDisplayString as d, Fragment as v, renderList as C, normalizeClass as N, createCommentVNode as R } from "vue";
import { useReadLine as x, usePoll as B, WindowRoom as H } from "@journal/window-kit";
import { _ as O } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const E = {
  class: "requests",
  "data-hook-requests": ""
}, L = {
  key: 0,
  class: "note",
  role: "alert"
}, S = {
  key: 1,
  class: "note"
}, V = { class: "list" }, z = ["data-hook-request", "onClick"], D = { class: "event" }, F = { class: "note" }, I = { class: "note" }, J = {
  key: 0,
  class: "detail",
  "data-hook-request-detail": ""
}, P = { "data-hook-request-headers": "" }, W = { "data-hook-request-body": "" }, $ = {
  __name: "HookRequests",
  setup(j) {
    const { value: k, failure: _, load: m } = x(() => "developer hook-requests"), l = p(() => {
      var e;
      return ((e = k.value) == null ? void 0 : e.rows) ?? [];
    }), r = q(0), i = p(() => l.value.find((e) => e.id === r.value)), f = (e) => {
      var o, t;
      return ((o = e.body) == null ? void 0 : o.event) ?? ((t = e.body) == null ? void 0 : t.hook_event_name) ?? "hook";
    }, y = (e) => {
      var o, t, c;
      return ((t = (o = e.body) == null ? void 0 : o.tool) == null ? void 0 : t.name) ?? ((c = e.body) == null ? void 0 : c.tool_name) ?? "";
    }, h = (e) => JSON.stringify(e, null, 2);
    return B(m, () => !0), (e, o) => (n(), g(u(H), null, {
      default: b(() => [
        s("div", E, [
          u(_) ? (n(), a("p", L, d(u(_)), 1)) : l.value.length ? (n(), a(v, { key: 2 }, [
            s("div", V, [
              (n(!0), a(v, null, C(l.value, (t) => (n(), a("button", {
                key: t.id,
                type: "button",
                class: N(["row", { open: t.id === r.value }]),
                "data-hook-request": t.id,
                onClick: (c) => r.value = t.id
              }, [
                s("span", D, d(f(t)), 1),
                s("span", F, d(y(t)), 1),
                s("span", I, d(t.received_at), 1)
              ], 10, z))), 128))
            ]),
            i.value ? (n(), a("div", J, [
              o[0] || (o[0] = s("h3", { class: "heading" }, "Headers", -1)),
              s("pre", P, d(h(i.value.headers)), 1),
              o[1] || (o[1] = s("h3", { class: "heading" }, "Body", -1)),
              s("pre", W, d(h(i.value.body)), 1)
            ])) : R("", !0)
          ], 64)) : (n(), a("p", S, "Nothing recorded yet. Record agent calls in the developer settings turns the log on."))
        ])
      ]),
      _: 1
    }));
  }
}, M = /* @__PURE__ */ O($, [["__scopeId", "data-v-0c163f7f"]]);
export {
  M as default
};
