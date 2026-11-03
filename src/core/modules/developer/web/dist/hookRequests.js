/* @code-commandments-generated */
if (!document.getElementById("window-styles-58d2e76383f1")) { const style = document.createElement("style"); style.id = "window-styles-58d2e76383f1"; style.textContent = ".requests[data-v-2498560f]{display:grid;grid-template-columns:minmax(360px,46%) 1px minmax(0,1fr);height:100%;min-height:0;overflow:hidden}.list[data-v-2498560f]{display:flex;flex-direction:column;min-height:0;min-width:0}.list-scroll[data-v-2498560f]{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain}.columns[data-v-2498560f],.row[data-v-2498560f]{display:grid;grid-template-columns:minmax(105px,1.4fr) minmax(52px,.7fr) 96px 72px;align-items:center;gap:8px;padding:10px 16px;font-size:12px}.columns[data-v-2498560f]{flex:none;border-bottom:1px solid var(--border);color:var(--text-3)}.columns[data-v-2498560f]>:last-child,.duration[data-v-2498560f]{text-align:right}.day[data-v-2498560f]{display:flex;justify-content:space-between;padding:9px 16px;border-bottom:1px solid var(--border);background:var(--side);color:var(--text-3);font-size:11px}.row[data-v-2498560f]{width:100%;border:0;border-bottom:1px solid var(--border);background:none;color:inherit;font-family:inherit;text-align:left;cursor:pointer}.row[data-v-2498560f]:hover,.row.open[data-v-2498560f]{background:var(--surface-2, var(--border))}.event[data-v-2498560f]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500}.tool[data-v-2498560f]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-3)}time[data-v-2498560f],.duration[data-v-2498560f]{font-variant-numeric:tabular-nums;white-space:nowrap}.slow .duration[data-v-2498560f],.detail-head .slow[data-v-2498560f]{color:#c58b35}.refused .event[data-v-2498560f],.refused .duration[data-v-2498560f],.detail-head .refused[data-v-2498560f]{color:#d76b6b}.note[data-v-2498560f]{margin:0;color:var(--text-3);font-size:12px}.detail[data-v-2498560f]{padding:20px;min-width:0;min-height:0;overflow:auto;overscroll-behavior:contain}.divider[data-v-2498560f]{background:var(--border)}.message[data-v-2498560f]{padding:16px;line-height:1.6}.detail-head[data-v-2498560f]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:24px;font-size:12px;color:var(--text-3)}.detail-head h2[data-v-2498560f]{margin:0;color:var(--text);font-size:14px}.heading[data-v-2498560f]{margin:0 0 8px;font-size:12px}pre[data-v-2498560f]{margin:0 0 24px;padding:12px;overflow:auto;border:1px solid var(--border);border-radius:6px;font-size:12px;line-height:1.6}@media(max-width:760px){.requests[data-v-2498560f]{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(140px,45%) 1px minmax(0,1fr)}}.numbers-tools[data-v-a530fc48]{display:flex;gap:8px;margin-bottom:10px}.numbers-note[data-v-a530fc48]{margin:0;color:var(--text-3);font-size:12.5px}.numbers-table[data-v-a530fc48]{width:100%;border-collapse:collapse;font-size:12.5px}.numbers-table th[data-v-a530fc48],.numbers-table td[data-v-a530fc48]{padding:4px 8px;border-bottom:1px solid var(--border);text-align:left}.numbers-table th[data-v-a530fc48]{color:var(--text-3);font-weight:500}\n"; document.head.appendChild(style); }
import { computed as v, ref as b, openBlock as n, createBlock as R, unref as c, withCtx as C, createElementVNode as e, createElementBlock as l, toDisplayString as o, createCommentVNode as k, Fragment as f, renderList as N, createTextVNode as x, normalizeClass as y } from "vue";
import { useReadLine as B, usePoll as S, WindowRoom as T } from "@journal/window-kit";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const H = {
  class: "requests",
  "data-hook-requests": ""
}, V = {
  class: "list",
  "aria-label": "Recorded requests"
}, D = {
  class: "list-scroll",
  "data-hook-request-list": ""
}, L = {
  key: 0,
  class: "note message",
  role: "alert"
}, O = {
  key: 1,
  class: "note message"
}, $ = {
  key: 0,
  class: "day",
  "data-hook-day": ""
}, z = ["data-hook-request", "aria-pressed", "title", "onClick"], F = { class: "event" }, I = { class: "tool" }, J = ["datetime"], M = { class: "duration" }, P = {
  class: "detail",
  "data-hook-request-detail-area": "",
  "aria-label": "Request details"
}, U = {
  key: 0,
  "data-hook-request-detail": ""
}, W = { class: "detail-head" }, j = { "data-hook-request-headers": "" }, A = { "data-hook-request-body": "" }, G = {
  key: 1,
  class: "note message"
}, K = {
  __name: "HookRequests",
  setup(Q) {
    const { value: q, failure: _, load: g } = B(() => "developer hook-requests"), r = v(() => {
      var s;
      return ((s = q.value) == null ? void 0 : s.rows) ?? [];
    }), i = b(0), d = v(() => r.value.find((s) => s.id === i.value)), h = (s) => JSON.stringify(s, null, 2), u = (s) => s.outcome === "refused", m = (s) => !u(s) && s.duration_ms >= 500, p = (s) => `${Math.round(s.duration_ms)} ms`;
    return S(g, () => !0), (s, a) => (n(), R(c(T), { padding: "0" }, {
      default: C(() => [
        e("div", H, [
          e("section", V, [
            a[1] || (a[1] = e("div", { class: "columns" }, [
              e("span", { "data-hook-column": "" }, "Event"),
              e("span", { "data-hook-column": "" }, "Tool"),
              e("span", { "data-hook-column": "" }, "Time"),
              e("span", { "data-hook-column": "" }, "Duration")
            ], -1)),
            e("div", D, [
              c(_) ? (n(), l("p", L, o(c(_)), 1)) : r.value.length ? k("", !0) : (n(), l("p", O, "Nothing recorded yet. Record agent calls in the developer settings turns the log on.")),
              (n(!0), l(f, null, N(r.value, (t) => (n(), l(f, {
                key: t.id
              }, [
                t.day_start ? (n(), l("div", $, [
                  x(o(t.day), 1),
                  a[0] || (a[0] = e("span", null, "UTC", -1))
                ])) : k("", !0),
                e("button", {
                  type: "button",
                  class: y(["row", { open: t.id === i.value, slow: m(t), refused: u(t) }]),
                  "data-hook-request": t.id,
                  "aria-pressed": t.id === i.value,
                  title: t.outcome,
                  onClick: (X) => i.value = t.id
                }, [
                  e("span", F, o(t.event), 1),
                  e("span", I, o(t.tool || "—"), 1),
                  e("time", {
                    datetime: t.received_at
                  }, o(t.time), 9, J),
                  e("span", M, o(p(t)), 1)
                ], 10, z)
              ], 64))), 128))
            ])
          ]),
          a[4] || (a[4] = e("div", {
            class: "divider",
            "data-hook-request-divider": "",
            role: "separator",
            "aria-orientation": "vertical"
          }, null, -1)),
          e("section", P, [
            d.value ? (n(), l("div", U, [
              e("div", W, [
                e("h2", null, o(d.value.event), 1),
                e("span", {
                  class: y({ slow: m(d.value), refused: u(d.value) })
                }, o(d.value.outcome) + " · " + o(p(d.value)), 3)
              ]),
              a[2] || (a[2] = e("h3", { class: "heading" }, "Headers", -1)),
              e("pre", j, o(h(d.value.headers)), 1),
              a[3] || (a[3] = e("h3", { class: "heading" }, "Body", -1)),
              e("pre", A, o(h(d.value.body)), 1)
            ])) : (n(), l("p", G, "Select a request to see its headers and body."))
          ])
        ])
      ]),
      _: 1
    }));
  }
}, ee = /* @__PURE__ */ E(K, [["__scopeId", "data-v-2498560f"]]);
export {
  ee as default
};
