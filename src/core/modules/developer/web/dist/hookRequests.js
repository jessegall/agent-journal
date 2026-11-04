/* @code-commandments-generated */
if (!document.getElementById("window-styles-df4f3e53e366")) { const style = document.createElement("style"); style.id = "window-styles-df4f3e53e366"; style.textContent = ".requests[data-v-1acf8fd1]{display:grid;grid-template-columns:minmax(360px,46%) 1px minmax(0,1fr);height:100%;min-height:0;overflow:hidden}.list[data-v-1acf8fd1]{display:flex;flex-direction:column;min-height:0;min-width:0}.list-scroll[data-v-1acf8fd1]{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain}.columns[data-v-1acf8fd1],.row[data-v-1acf8fd1]{display:grid;grid-template-columns:minmax(105px,1.4fr) minmax(52px,.7fr) 64px 96px 72px;align-items:center;gap:8px;padding:10px 16px;font-size:12px}.columns[data-v-1acf8fd1]{flex:none;border-bottom:1px solid var(--border);color:var(--text-3)}.columns[data-v-1acf8fd1]>:last-child,.duration[data-v-1acf8fd1],.parts[data-v-1acf8fd1]{text-align:right}.parts[data-v-1acf8fd1]{padding-right:28px;color:var(--text-3);font-variant-numeric:tabular-nums}.day[data-v-1acf8fd1]{display:flex;justify-content:space-between;padding:9px 16px;border-bottom:1px solid var(--border);background:var(--side);color:var(--text-3);font-size:11px}.row[data-v-1acf8fd1]{width:100%;border:0;border-bottom:1px solid var(--border);background:none;color:inherit;font-family:inherit;text-align:left;cursor:pointer}.row[data-v-1acf8fd1]:hover,.row.open[data-v-1acf8fd1]{background:var(--surface-2, var(--border))}.event[data-v-1acf8fd1]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500}.tool[data-v-1acf8fd1]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-3)}time[data-v-1acf8fd1],.duration[data-v-1acf8fd1]{font-variant-numeric:tabular-nums;white-space:nowrap}.slow .duration[data-v-1acf8fd1],.detail-head .slow[data-v-1acf8fd1]{color:#c58b35}.refused .event[data-v-1acf8fd1],.refused .duration[data-v-1acf8fd1],.detail-head .refused[data-v-1acf8fd1]{color:#d76b6b}.note[data-v-1acf8fd1]{margin:0;color:var(--text-3);font-size:12px}.detail[data-v-1acf8fd1]{padding:20px;min-width:0;min-height:0;overflow:auto;overscroll-behavior:contain}.divider[data-v-1acf8fd1]{background:var(--border)}.message[data-v-1acf8fd1]{padding:16px;line-height:1.6}.detail-head[data-v-1acf8fd1]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:24px;font-size:12px;color:var(--text-3)}.detail-head h2[data-v-1acf8fd1]{margin:0;color:var(--text);font-size:14px}.heading[data-v-1acf8fd1]{margin:0 0 8px;font-size:12px}pre[data-v-1acf8fd1]{margin:0 0 24px;padding:12px;overflow:auto;border:1px solid var(--border);border-radius:6px;font-size:12px;line-height:1.6}@media(max-width:760px){.requests[data-v-1acf8fd1]{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(140px,45%) 1px minmax(0,1fr)}}.numbers-tools[data-v-21644aad]{display:flex;gap:8px;margin-bottom:10px}.numbers-note[data-v-21644aad]{margin:0;color:var(--text-3);font-size:12.5px}.numbers-table[data-v-21644aad]{width:100%;border-collapse:collapse;font-size:12.5px}.numbers-table th[data-v-21644aad],.numbers-table td[data-v-21644aad]{padding:4px 8px;border-bottom:1px solid var(--border);text-align:left}.numbers-table th[data-v-21644aad]{color:var(--text-3);font-weight:500}\n"; document.head.appendChild(style); }
import { computed as v, ref as b, openBlock as d, createBlock as R, unref as c, withCtx as T, createElementVNode as e, createElementBlock as l, toDisplayString as a, createCommentVNode as k, Fragment as f, renderList as H, createTextVNode as C, normalizeClass as y } from "vue";
import { useReadLine as L, usePoll as N, WindowRoom as x, highlight as M } from "@journal/window-kit";
import { _ as B } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const S = {
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
}, I = ["datetime"], J = { class: "duration" }, U = {
  class: "detail",
  "data-hook-request-detail-area": "",
  "aria-label": "Request details"
}, W = {
  key: 0,
  "data-hook-request-detail": ""
}, A = { class: "detail-head" }, G = ["innerHTML"], K = ["innerHTML"], Q = {
  key: 1,
  class: "note message"
}, X = {
  __name: "HookRequests",
  setup(Y) {
    const { value: q, failure: h, load: g } = L(() => "developer hook-requests"), r = v(() => {
      var t;
      return ((t = q.value) == null ? void 0 : t.rows) ?? [];
    }), i = b(0), n = v(() => r.value.find((t) => t.id === i.value)), _ = (t) => M(JSON.stringify(t, null, 2), "json").join(`
`), u = (t) => t.outcome === "refused", p = (t) => !u(t) && t.duration_ms >= 500, m = (t) => `${Math.round(t.duration_ms)} ms`;
    return N(g, () => !0), (t, o) => (d(), R(c(x), { padding: "0" }, {
      default: T(() => [
        e("div", S, [
          e("section", E, [
            o[1] || (o[1] = e("div", { class: "columns" }, [
              e("span", { "data-hook-column": "" }, "Event"),
              e("span", { "data-hook-column": "" }, "Tool"),
              e("span", {
                class: "parts",
                "data-hook-column": ""
              }, "Parts"),
              e("span", { "data-hook-column": "" }, "Time"),
              e("span", { "data-hook-column": "" }, "Duration")
            ], -1)),
            e("div", V, [
              c(h) ? (d(), l("p", j, a(c(h)), 1)) : r.value.length ? k("", !0) : (d(), l("p", D, "Nothing recorded yet. Record agent calls in the developer settings turns the log on.")),
              (d(!0), l(f, null, H(r.value, (s) => (d(), l(f, {
                key: s.id
              }, [
                s.day_start ? (d(), l("div", O, [
                  C(a(s.day), 1),
                  o[0] || (o[0] = e("span", null, "UTC", -1))
                ])) : k("", !0),
                e("button", {
                  type: "button",
                  class: y(["row", { open: s.id === i.value, slow: p(s), refused: u(s) }]),
                  "data-hook-request": s.id,
                  "aria-pressed": s.id === i.value,
                  title: s.outcome,
                  onClick: (Z) => i.value = s.id
                }, [
                  e("span", $, a(s.event), 1),
                  e("span", z, a(s.tool || "—"), 1),
                  e("span", F, a(s.part_count || ""), 1),
                  e("time", {
                    datetime: s.received_at
                  }, a(s.time), 9, I),
                  e("span", J, a(m(s)), 1)
                ], 10, P)
              ], 64))), 128))
            ])
          ]),
          o[4] || (o[4] = e("div", {
            class: "divider",
            "data-hook-request-divider": "",
            role: "separator",
            "aria-orientation": "vertical"
          }, null, -1)),
          e("section", U, [
            n.value ? (d(), l("div", W, [
              e("div", A, [
                e("h2", null, a(n.value.event), 1),
                e("span", {
                  class: y({ slow: p(n.value), refused: u(n.value) })
                }, a(n.value.outcome) + " · " + a(m(n.value)), 3)
              ]),
              o[2] || (o[2] = e("h3", { class: "heading" }, "Headers", -1)),
              e("pre", {
                "data-hook-request-headers": "",
                innerHTML: _(n.value.headers)
              }, null, 8, G),
              o[3] || (o[3] = e("h3", { class: "heading" }, "Body", -1)),
              e("pre", {
                "data-hook-request-body": "",
                innerHTML: _(n.value.body)
              }, null, 8, K)
            ])) : (d(), l("p", Q, "Select a request to see its headers and body."))
          ])
        ])
      ]),
      _: 1
    }));
  }
}, te = /* @__PURE__ */ B(X, [["__scopeId", "data-v-1acf8fd1"]]);
export {
  te as default
};
