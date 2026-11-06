/* @code-commandments-generated */
if (!document.getElementById("window-styles-98443b0b3c4c")) { const style = document.createElement("style"); style.id = "window-styles-98443b0b3c4c"; style.textContent = ".requests[data-v-bd59359a]{display:grid;grid-template-columns:minmax(360px,46%) 1px minmax(0,1fr);height:100%;min-height:0;overflow:hidden}.list[data-v-bd59359a]{display:flex;flex-direction:column;min-height:0;min-width:0}.list-scroll[data-v-bd59359a]{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain}.columns[data-v-bd59359a],.row[data-v-bd59359a]{display:grid;grid-template-columns:minmax(80px,1.4fr) minmax(40px,.7fr) 32px 88px minmax(72px,1fr) 55px 60px;align-items:center;gap:5px;padding:10px;font-size:12px}.columns[data-v-bd59359a]{flex:none;border-bottom:1px solid var(--border);color:var(--text-3)}.columns[data-v-bd59359a]>:last-child,.duration[data-v-bd59359a],.queued[data-v-bd59359a],.parts[data-v-bd59359a]{text-align:right}.parts[data-v-bd59359a]{padding-right:4px;color:var(--text-3);font-variant-numeric:tabular-nums}.day[data-v-bd59359a]{display:flex;justify-content:space-between;padding:9px 16px;border-bottom:1px solid var(--border);background:var(--side);color:var(--text-3);font-size:11px}.row[data-v-bd59359a]{width:100%;border:0;border-bottom:1px solid var(--border);background:none;color:inherit;font-family:inherit;text-align:left;cursor:pointer}.row[data-v-bd59359a]:hover,.row.open[data-v-bd59359a]{background:var(--surface-2, var(--border))}.event[data-v-bd59359a]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500}.tool[data-v-bd59359a]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-3)}time[data-v-bd59359a],.duration[data-v-bd59359a],.queued[data-v-bd59359a]{font-variant-numeric:tabular-nums;white-space:nowrap}.slow .duration[data-v-bd59359a],.detail-head .slow[data-v-bd59359a]{color:#c58b35}.refused .event[data-v-bd59359a],.refused .duration[data-v-bd59359a],.detail-head .refused[data-v-bd59359a]{color:#d76b6b}.note[data-v-bd59359a]{margin:0;color:var(--text-3);font-size:12px}.detail[data-v-bd59359a]{padding:20px;min-width:0;min-height:0;overflow:auto;overscroll-behavior:contain}.divider[data-v-bd59359a]{background:var(--border)}.message[data-v-bd59359a]{padding:16px;line-height:1.6}.detail-head[data-v-bd59359a]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:24px;font-size:12px;color:var(--text-3)}.detail-head h2[data-v-bd59359a]{margin:0;color:var(--text);font-size:14px}.heading[data-v-bd59359a]{margin:0 0 8px;font-size:12px}pre[data-v-bd59359a]{margin:0 0 24px;padding:12px;overflow:auto;border:1px solid var(--border);border-radius:6px;font-size:12px;line-height:1.6}@media(max-width:760px){.requests[data-v-bd59359a]{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(140px,45%) 1px minmax(0,1fr)}}.numbers-tools[data-v-21644aad]{display:flex;gap:8px;margin-bottom:10px}.numbers-note[data-v-21644aad]{margin:0;color:var(--text-3);font-size:12.5px}.numbers-table[data-v-21644aad]{width:100%;border-collapse:collapse;font-size:12.5px}.numbers-table th[data-v-21644aad],.numbers-table td[data-v-21644aad]{padding:4px 8px;border-bottom:1px solid var(--border);text-align:left}.numbers-table th[data-v-21644aad]{color:var(--text-3);font-weight:500}\n"; document.head.appendChild(style); }
import { computed as v, ref as b, openBlock as d, createBlock as R, unref as c, withCtx as T, createElementVNode as e, createElementBlock as l, toDisplayString as o, createCommentVNode as k, Fragment as q, renderList as H, createTextVNode as M, normalizeClass as y } from "vue";
import { useReadLine as C, usePoll as L, WindowRoom as N, highlight as x } from "@journal/window-kit";
import { _ as S } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const B = {
  class: "requests",
  "data-hook-requests": ""
}, E = {
  class: "list",
  "aria-label": "Recorded requests"
}, V = {
  class: "list-scroll",
  "data-hook-request-list": ""
}, j = {
  key: 0,
  class: "note message",
  role: "alert"
}, D = {
  key: 1,
  class: "note message"
}, O = {
  key: 0,
  class: "day",
  "data-hook-day": ""
}, P = ["data-hook-request", "aria-pressed", "title", "onClick"], $ = { class: "event" }, z = { class: "tool" }, F = {
  class: "parts",
  "data-hook-parts": ""
}, I = ["datetime"], J = { class: "queued" }, Q = { class: "duration" }, U = {
  class: "detail",
  "data-hook-request-detail-area": "",
  "aria-label": "Request details"
}, W = {
  key: 0,
  "data-hook-request-detail": ""
}, A = { class: "detail-head" }, G = ["innerHTML"], K = ["innerHTML"], X = {
  key: 1,
  class: "note message"
}, Y = {
  __name: "HookRequests",
  setup(Z) {
    const { value: f, failure: h, load: g } = C(() => "developer hook-requests"), u = v(() => {
      var t;
      return ((t = f.value) == null ? void 0 : t.rows) ?? [];
    }), i = b(0), a = v(() => u.value.find((t) => t.id === i.value)), _ = (t) => x(JSON.stringify(t, null, 2), "json").join(`
`), r = (t) => t.outcome === "refused", p = (t) => !r(t) && t.duration_ms >= 500, m = (t) => `${Math.round(t.duration_ms)} ms`;
    return L(g, () => !0), (t, n) => (d(), R(c(N), { padding: "0" }, {
      default: T(() => [
        e("div", B, [
          e("section", E, [
            n[1] || (n[1] = e("div", { class: "columns" }, [
              e("span", { "data-hook-column": "" }, "Event"),
              e("span", { "data-hook-column": "" }, "Tool"),
              e("span", {
                class: "parts",
                "data-hook-column": ""
              }, "Parts"),
              e("span", { "data-hook-column": "" }, "Time"),
              e("span", { "data-hook-column": "" }, "Sender"),
              e("span", { "data-hook-column": "" }, "Queued"),
              e("span", { "data-hook-column": "" }, "Duration")
            ], -1)),
            e("div", V, [
              c(h) ? (d(), l("p", j, o(c(h)), 1)) : u.value.length ? k("", !0) : (d(), l("p", D, "Nothing recorded yet. Record agent calls in the developer settings turns the log on.")),
              (d(!0), l(q, null, H(u.value, (s) => (d(), l(q, {
                key: s.id
              }, [
                s.day_start ? (d(), l("div", O, [
                  M(o(s.day), 1),
                  n[0] || (n[0] = e("span", null, "UTC", -1))
                ])) : k("", !0),
                e("button", {
                  type: "button",
                  class: y(["row", { open: s.id === i.value, slow: p(s), refused: r(s) }]),
                  "data-hook-request": s.id,
                  "aria-pressed": s.id === i.value,
                  title: s.outcome,
                  onClick: (w) => i.value = s.id
                }, [
                  e("span", $, o(s.event), 1),
                  e("span", z, o(s.tool || "—"), 1),
                  e("span", F, o(s.part_count || ""), 1),
                  e("time", {
                    datetime: s.received_at
                  }, o(s.time), 9, I),
                  e("span", null, o(s.sender), 1),
                  e("span", J, o(Math.round(s.queued_ms)) + " ms", 1),
                  e("span", Q, o(m(s)), 1)
                ], 10, P)
              ], 64))), 128))
            ])
          ]),
          n[4] || (n[4] = e("div", {
            class: "divider",
            "data-hook-request-divider": "",
            role: "separator",
            "aria-orientation": "vertical"
          }, null, -1)),
          e("section", U, [
            a.value ? (d(), l("div", W, [
              e("div", A, [
                e("h2", null, o(a.value.event), 1),
                e("span", {
                  class: y({ slow: p(a.value), refused: r(a.value) })
                }, o(a.value.sender) + " · queued " + o(Math.round(a.value.queued_ms)) + " ms · " + o(a.value.outcome) + " · " + o(m(a.value)), 3)
              ]),
              n[2] || (n[2] = e("h3", { class: "heading" }, "Headers", -1)),
              e("pre", {
                "data-hook-request-headers": "",
                innerHTML: _(a.value.headers)
              }, null, 8, G),
              n[3] || (n[3] = e("h3", { class: "heading" }, "Body", -1)),
              e("pre", {
                "data-hook-request-body": "",
                innerHTML: _(a.value.body)
              }, null, 8, K)
            ])) : (d(), l("p", X, "Select a request to see its headers and body."))
          ])
        ])
      ]),
      _: 1
    }));
  }
}, oe = /* @__PURE__ */ S(Y, [["__scopeId", "data-v-bd59359a"]]);
export {
  oe as default
};
