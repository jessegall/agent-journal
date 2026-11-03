/* @code-commandments-generated */
if (!document.getElementById("window-styles-6e29193b9daf")) { const style = document.createElement("style"); style.id = "window-styles-6e29193b9daf"; style.textContent = ".requests[data-v-4b365dd9]{display:grid;grid-template-columns:minmax(360px,46%) 1px minmax(0,1fr);height:100%;min-height:0;overflow:hidden}.list[data-v-4b365dd9]{display:flex;flex-direction:column;min-height:0;min-width:0}.list-scroll[data-v-4b365dd9]{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain}.columns[data-v-4b365dd9],.row[data-v-4b365dd9]{display:grid;grid-template-columns:minmax(105px,1.4fr) minmax(52px,.7fr) 36px 96px 72px;align-items:center;gap:8px;padding:10px 16px;font-size:12px}.columns[data-v-4b365dd9]{flex:none;border-bottom:1px solid var(--border);color:var(--text-3)}.columns[data-v-4b365dd9]>:last-child,.duration[data-v-4b365dd9],.parts[data-v-4b365dd9]{text-align:right}.parts[data-v-4b365dd9]{color:var(--text-3);font-variant-numeric:tabular-nums}.day[data-v-4b365dd9]{display:flex;justify-content:space-between;padding:9px 16px;border-bottom:1px solid var(--border);background:var(--side);color:var(--text-3);font-size:11px}.row[data-v-4b365dd9]{width:100%;border:0;border-bottom:1px solid var(--border);background:none;color:inherit;font-family:inherit;text-align:left;cursor:pointer}.row[data-v-4b365dd9]:hover,.row.open[data-v-4b365dd9]{background:var(--surface-2, var(--border))}.event[data-v-4b365dd9]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500}.tool[data-v-4b365dd9]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-3)}time[data-v-4b365dd9],.duration[data-v-4b365dd9]{font-variant-numeric:tabular-nums;white-space:nowrap}.slow .duration[data-v-4b365dd9],.detail-head .slow[data-v-4b365dd9]{color:#c58b35}.refused .event[data-v-4b365dd9],.refused .duration[data-v-4b365dd9],.detail-head .refused[data-v-4b365dd9]{color:#d76b6b}.note[data-v-4b365dd9]{margin:0;color:var(--text-3);font-size:12px}.detail[data-v-4b365dd9]{padding:20px;min-width:0;min-height:0;overflow:auto;overscroll-behavior:contain}.divider[data-v-4b365dd9]{background:var(--border)}.message[data-v-4b365dd9]{padding:16px;line-height:1.6}.detail-head[data-v-4b365dd9]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:24px;font-size:12px;color:var(--text-3)}.detail-head h2[data-v-4b365dd9]{margin:0;color:var(--text);font-size:14px}.heading[data-v-4b365dd9]{margin:0 0 8px;font-size:12px}pre[data-v-4b365dd9]{margin:0 0 24px;padding:12px;overflow:auto;border:1px solid var(--border);border-radius:6px;font-size:12px;line-height:1.6}@media(max-width:760px){.requests[data-v-4b365dd9]{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(140px,45%) 1px minmax(0,1fr)}}.numbers-tools[data-v-21644aad]{display:flex;gap:8px;margin-bottom:10px}.numbers-note[data-v-21644aad]{margin:0;color:var(--text-3);font-size:12.5px}.numbers-table[data-v-21644aad]{width:100%;border-collapse:collapse;font-size:12.5px}.numbers-table th[data-v-21644aad],.numbers-table td[data-v-21644aad]{padding:4px 8px;border-bottom:1px solid var(--border);text-align:left}.numbers-table th[data-v-21644aad]{color:var(--text-3);font-weight:500}\n"; document.head.appendChild(style); }
import { computed as v, ref as b, openBlock as n, createBlock as R, unref as c, withCtx as C, createElementVNode as e, createElementBlock as l, toDisplayString as o, createCommentVNode as k, Fragment as y, renderList as N, createTextVNode as x, normalizeClass as f } from "vue";
import { useReadLine as B, usePoll as S, WindowRoom as T } from "@journal/window-kit";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.js";
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
}, P = {
  key: 0,
  class: "day",
  "data-hook-day": ""
}, $ = ["data-hook-request", "aria-pressed", "title", "onClick"], z = { class: "event" }, F = { class: "tool" }, I = {
  class: "parts",
  "data-hook-parts": ""
}, J = ["datetime"], M = { class: "duration" }, U = {
  class: "detail",
  "data-hook-request-detail-area": "",
  "aria-label": "Request details"
}, W = {
  key: 0,
  "data-hook-request-detail": ""
}, j = { class: "detail-head" }, A = { "data-hook-request-headers": "" }, G = { "data-hook-request-body": "" }, K = {
  key: 1,
  class: "note message"
}, Q = {
  __name: "HookRequests",
  setup(X) {
    const { value: q, failure: _, load: g } = B(() => "developer hook-requests"), r = v(() => {
      var t;
      return ((t = q.value) == null ? void 0 : t.rows) ?? [];
    }), i = b(0), d = v(() => r.value.find((t) => t.id === i.value)), h = (t) => JSON.stringify(t, null, 2), u = (t) => t.outcome === "refused", p = (t) => !u(t) && t.duration_ms >= 500, m = (t) => `${Math.round(t.duration_ms)} ms`;
    return S(g, () => !0), (t, a) => (n(), R(c(T), { padding: "0" }, {
      default: C(() => [
        e("div", H, [
          e("section", V, [
            a[1] || (a[1] = e("div", { class: "columns" }, [
              e("span", { "data-hook-column": "" }, "Event"),
              e("span", { "data-hook-column": "" }, "Tool"),
              e("span", {
                class: "parts",
                "data-hook-column": ""
              }, "Parts"),
              e("span", { "data-hook-column": "" }, "Time"),
              e("span", { "data-hook-column": "" }, "Duration")
            ], -1)),
            e("div", D, [
              c(_) ? (n(), l("p", L, o(c(_)), 1)) : r.value.length ? k("", !0) : (n(), l("p", O, "Nothing recorded yet. Record agent calls in the developer settings turns the log on.")),
              (n(!0), l(y, null, N(r.value, (s) => (n(), l(y, {
                key: s.id
              }, [
                s.day_start ? (n(), l("div", P, [
                  x(o(s.day), 1),
                  a[0] || (a[0] = e("span", null, "UTC", -1))
                ])) : k("", !0),
                e("button", {
                  type: "button",
                  class: f(["row", { open: s.id === i.value, slow: p(s), refused: u(s) }]),
                  "data-hook-request": s.id,
                  "aria-pressed": s.id === i.value,
                  title: s.outcome,
                  onClick: (Y) => i.value = s.id
                }, [
                  e("span", z, o(s.event), 1),
                  e("span", F, o(s.tool || "—"), 1),
                  e("span", I, o(s.part_count || ""), 1),
                  e("time", {
                    datetime: s.received_at
                  }, o(s.time), 9, J),
                  e("span", M, o(m(s)), 1)
                ], 10, $)
              ], 64))), 128))
            ])
          ]),
          a[4] || (a[4] = e("div", {
            class: "divider",
            "data-hook-request-divider": "",
            role: "separator",
            "aria-orientation": "vertical"
          }, null, -1)),
          e("section", U, [
            d.value ? (n(), l("div", W, [
              e("div", j, [
                e("h2", null, o(d.value.event), 1),
                e("span", {
                  class: f({ slow: p(d.value), refused: u(d.value) })
                }, o(d.value.outcome) + " · " + o(m(d.value)), 3)
              ]),
              a[2] || (a[2] = e("h3", { class: "heading" }, "Headers", -1)),
              e("pre", A, o(h(d.value.headers)), 1),
              a[3] || (a[3] = e("h3", { class: "heading" }, "Body", -1)),
              e("pre", G, o(h(d.value.body)), 1)
            ])) : (n(), l("p", K, "Select a request to see its headers and body."))
          ])
        ])
      ]),
      _: 1
    }));
  }
}, se = /* @__PURE__ */ E(Q, [["__scopeId", "data-v-4b365dd9"]]);
export {
  se as default
};
