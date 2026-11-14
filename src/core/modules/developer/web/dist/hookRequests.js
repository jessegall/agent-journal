if (!document.getElementById("window-styles-d55d5452be22")) { const style = document.createElement("style"); style.id = "window-styles-d55d5452be22"; style.textContent = ".inspector[data-v-7f374e1d]{display:flex;flex-direction:column;min-height:0;height:100%;overflow-y:auto;background:var(--bg)}header[data-v-7f374e1d]{display:flex;align-items:center;gap:8px;padding:14px;border-bottom:1px solid var(--border)}header h1[data-v-7f374e1d]{flex:1;margin:0;font-size:14px}.empty[data-v-7f374e1d]{margin:0;padding:14px;color:var(--text-3);font-size:12px}.detail-head[data-v-360e14b0]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:24px;font-size:12px;color:var(--text-3)}.detail-head h2[data-v-360e14b0]{margin:0;color:var(--text);font-size:14px}.slow[data-v-360e14b0]{color:#c58b35}.refused[data-v-360e14b0]{color:#d76b6b}.heading[data-v-360e14b0]{margin:0 0 8px;font-size:12px}pre[data-v-360e14b0]{margin:0 0 24px;padding:12px;overflow:auto;border:1px solid var(--border);border-radius:6px;font-size:12px;line-height:1.6}.note[data-v-360e14b0]{margin:0;color:var(--text-3);font-size:12px}.message[data-v-360e14b0]{padding:16px;line-height:1.6}.toolbar[data-v-cd8cfab4]{display:flex;justify-content:space-between;padding:8px 12px}.queue-veil[data-v-cd8cfab4]{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;justify-content:flex-end;background:#0005;z-index:3}.queue-veil[data-v-cd8cfab4]>*{width:min(560px,100%);box-shadow:0 0 24px #0003}.requests[data-v-cd8cfab4]{position:relative;display:grid;grid-template-columns:minmax(360px,46%) 1px minmax(0,1fr);height:100%;min-height:0;overflow:hidden}.list[data-v-cd8cfab4]{display:flex;flex-direction:column;min-height:0;min-width:0}.note[data-v-cd8cfab4]{margin:0;color:var(--text-3);font-size:12px}.detail[data-v-cd8cfab4]{padding:20px;min-width:0;min-height:0;overflow:auto;overscroll-behavior:contain}.divider[data-v-cd8cfab4]{background:var(--border)}.message[data-v-cd8cfab4]{padding:16px;line-height:1.6}.detail-head[data-v-cd8cfab4]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:24px;font-size:12px;color:var(--text-3)}.detail-head h2[data-v-cd8cfab4]{margin:0;color:var(--text);font-size:14px}.heading[data-v-cd8cfab4]{margin:0 0 8px;font-size:12px}pre[data-v-cd8cfab4]{margin:0 0 24px;padding:12px;overflow:auto;border:1px solid var(--border);border-radius:6px;font-size:12px;line-height:1.6}@media(max-width:760px){.queue-button[data-v-cd8cfab4]{align-self:flex-end;margin:8px 12px}.queue-veil[data-v-cd8cfab4]{position:absolute;top:0;right:0;bottom:0;left:0;display:flex;justify-content:flex-end;background:#0005;z-index:3}.queue-veil[data-v-cd8cfab4]>*{width:min(560px,100%);box-shadow:0 0 24px #0003}.requests[data-v-cd8cfab4]{position:relative;grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(140px,45%) 1px minmax(0,1fr)}}.numbers-tools[data-v-c16f7101]{display:flex;gap:8px;margin-bottom:10px}.numbers-note[data-v-c16f7101]{margin:0;color:var(--text-3);font-size:12.5px}.logs[data-v-25c9b82f]{display:flex;flex-direction:column;height:100%;min-height:0}.toolbar[data-v-25c9b82f],nav[data-v-25c9b82f]{display:flex;align-items:center;gap:12px;padding:10px 12px;flex:none}.toolbar[data-v-25c9b82f]{border-bottom:1px solid var(--border)}.toolbar label[data-v-25c9b82f]{display:flex;align-items:center;gap:6px}.toolbar button[data-v-25c9b82f]{margin-left:auto}.scroll[data-v-25c9b82f]{flex:1;min-height:0}nav[data-v-25c9b82f]{justify-content:center;border-top:1px solid var(--border)}\n"; document.head.appendChild(style); }
import { openBlock as a, createElementBlock as c, createElementVNode as r, createVNode as d, unref as n, toDisplayString as m, Fragment as S, createCommentVNode as q, normalizeClass as Z, ref as g, computed as C, watch as B, createBlock as _, withCtx as v, createTextVNode as f, renderList as E, withModifiers as ee } from "vue";
import { useWindow as J, usePoll as V, Icon as te, CloseButton as se, ExecutionLanes as ne, wordLabel as oe, highlight as ae, WindowRoom as le, Btn as L, MenuPanel as ue, MenuLabel as N, MenuItem as $, TableLayout as re, toggleFilter as ie } from "@journal/window-kit";
import { _ as I } from "./_plugin-vue_export-helper-CHgC5LLL.js";
import { u as de, t as ce } from "./usePausedProp-C5dSctRP.js";
const me = {
  class: "inspector",
  "data-executions": ""
}, ve = {
  key: 0,
  class: "empty",
  role: "alert"
}, fe = {
  key: 0,
  class: "empty",
  "data-executions-halted": ""
}, ke = {
  __name: "ExecutionsInspector",
  emits: ["close"],
  setup(u, { emit: h }) {
    const y = h, o = J(), { data: i, failure: l } = o.props.queue;
    return V(() => o.reload("queue"), () => o.visible.value), (k, p) => (a(), c("aside", me, [
      r("header", null, [
        d(n(te), {
          name: "terminal",
          size: 13
        }),
        p[1] || (p[1] = r("h1", null, "Executions", -1)),
        d(n(se), {
          title: "Close the executions",
          onClick: p[0] || (p[0] = (w) => y("close"))
        })
      ]),
      n(l) ? (a(), c("p", ve, m(n(l)), 1)) : n(i) ? (a(), c(S, { key: 1 }, [
        n(i).halted ? (a(), c("p", fe, "The long lane is halted: " + m(n(i).halt_reason), 1)) : q("", !0),
        d(n(ne), {
          execution: n(i).execution
        }, null, 8, ["execution"])
      ], 64)) : q("", !0)
    ]));
  }
}, he = /* @__PURE__ */ I(ke, [["__scopeId", "data-v-7f374e1d"]]), pe = { allowed: "Allowed", refused: "Refused" }, qe = (u) => pe[u] ?? oe(u), ye = {
  key: 0,
  "data-hook-request-detail": ""
}, ge = { class: "detail-head" }, _e = ["innerHTML"], be = ["innerHTML"], xe = {
  key: 1,
  class: "note message"
}, Ce = {
  __name: "RequestDetails",
  props: { request: { type: Object, default: null } },
  setup(u) {
    const h = (l) => ae(JSON.stringify(l, null, 2), "json").join(`
`), y = (l) => l.outcome === "refused", o = (l) => !y(l) && l.duration_ms >= 500, i = (l) => `${Math.round(l.duration_ms)} ms`;
    return (l, k) => u.request ? (a(), c("div", ye, [
      r("div", ge, [
        r("h2", null, m(u.request.event), 1),
        r("span", {
          class: Z({ slow: o(u.request), refused: y(u.request) })
        }, m(u.request.sender) + " · queued " + m(Math.round(u.request.queued_ms)) + " ms · " + m(n(qe)(u.request.outcome)) + " · " + m(i(u.request)), 3)
      ]),
      k[0] || (k[0] = r("h3", { class: "heading" }, "Headers", -1)),
      r("pre", {
        "data-hook-request-headers": "",
        innerHTML: h(u.request.headers)
      }, null, 8, _e),
      k[1] || (k[1] = r("h3", { class: "heading" }, "Body", -1)),
      r("pre", {
        "data-hook-request-body": "",
        innerHTML: h(u.request.body)
      }, null, 8, be)
    ])) : (a(), c("p", xe, "Select a request to see its headers and body."));
  }
}, $e = /* @__PURE__ */ I(Ce, [["__scopeId", "data-v-360e14b0"]]), Se = {
  class: "requests",
  "data-hook-requests": ""
}, we = {
  class: "list",
  "aria-label": "Recorded requests"
}, Me = { class: "toolbar" }, Oe = {
  key: 0,
  "data-filter-count": ""
}, Re = {
  key: 0,
  class: "note message",
  role: "alert"
}, Te = {
  key: 1,
  class: "note message"
}, Ee = {
  class: "detail",
  "data-hook-request-detail-area": "",
  "aria-label": "Request details"
}, D = "journal.hook-requests.filters", Le = {
  __name: "HookRequests",
  setup(u) {
    const h = () => ({ category: [], family: [], sender: [] });
    function y() {
      try {
        return { ...h(), ...JSON.parse(localStorage.getItem(D) || "{}") };
      } catch {
        return h();
      }
    }
    const o = g(y()), i = g(!1), l = g({ family: ["process bookkeeping"], sender: [] }), k = C(() => Object.values(o.value).reduce((e, t) => e + t.length, 0)), p = J(), { data: w, failure: P, loaded: A, reload: M } = de(p, "requests", i), U = { category: "categories", family: "families", sender: "senders" };
    function F(e) {
      for (const [t, s] of Object.entries(e)) p.state[`requests.${U[t]}`] = JSON.stringify(s);
    }
    F(o.value);
    const O = C(() => {
      var e;
      return ((e = w.value) == null ? void 0 : e.rows) ?? [];
    });
    B(w, (e) => {
      l.value.family = [.../* @__PURE__ */ new Set(["process bookkeeping", ...e.families || [], ...o.value.family])].sort(), l.value.sender = [.../* @__PURE__ */ new Set([...e.senders || [], ...o.value.sender])].sort();
    }), B(o, (e) => {
      try {
        localStorage.setItem(D, JSON.stringify(e));
      } catch {
      }
      F(e), i.value || M();
    });
    function R(e, t) {
      o.value = ie(o.value, e, t);
    }
    const b = g(null), T = g(0), x = g(!1), z = C(() => O.value.find((e) => e.id === T.value)), Q = (e) => T.value = Number(e), H = (e) => e.outcome === "refused", W = (e) => !H(e) && e.duration_ms >= 500, G = (e) => `${Math.round(e.duration_ms)} ms`, K = ["Event", "Tool", "Parts", "Time", "Sender", "Queued", "Duration"].map((e) => ({ key: e.toLowerCase(), label: e })), X = C(() => O.value.map((e) => ({ mark: e.id, event: e.event, tool: e.tool || "—", parts: e.part_count || "", time: e.time, sender: e.sender, queued: `${Math.round(e.queued_ms)} ms`, duration: G(e), tone: H(e) ? "danger" : W(e) ? "warn" : "" })));
    function Y() {
      ce(i, M);
    }
    return V(() => A.value && M(), () => !i.value && p.visible.value), (e, t) => (a(), _(n(le), { padding: "0" }, {
      default: v(() => [
        r("div", Se, [
          r("section", we, [
            r("div", Me, [
              d(n(L), {
                small: "",
                "data-filter-open": "",
                onClick: t[0] || (t[0] = (s) => b.value = s.currentTarget)
              }, {
                default: v(() => [
                  t[6] || (t[6] = f("Filters", -1)),
                  k.value ? (a(), c("span", Oe, " (" + m(k.value) + ")", 1)) : q("", !0)
                ]),
                _: 1
              }),
              d(n(L), {
                small: "",
                "data-feed-pause": "",
                "aria-pressed": i.value,
                onClick: Y
              }, {
                default: v(() => [
                  f(m(i.value ? "Resume" : "Pause"), 1)
                ]),
                _: 1
              }, 8, ["aria-pressed"]),
              d(n(L), {
                small: "",
                "data-executions-open": "",
                onClick: t[1] || (t[1] = (s) => x.value = !0)
              }, {
                default: v(() => [...t[7] || (t[7] = [
                  f("Executions", -1)
                ])]),
                _: 1
              }),
              b.value ? (a(), _(n(ue), {
                key: 0,
                anchor: b.value,
                align: "start",
                "min-width": 220,
                "max-width": 320,
                onClose: t[3] || (t[3] = (s) => b.value = null)
              }, {
                default: v(() => [
                  d(n(N), null, {
                    default: v(() => [...t[8] || (t[8] = [
                      f("Type", -1)
                    ])]),
                    _: 1
                  }),
                  (a(), c(S, null, E(["hook", "viewer", "command line"], (s) => d(n($), {
                    key: s,
                    "data-filter-category": s,
                    role: "menuitemcheckbox",
                    checked: o.value.category.includes(s),
                    "aria-checked": o.value.category.includes(s),
                    onClick: (j) => R("category", s)
                  }, {
                    default: v(() => [
                      f(m(s), 1)
                    ]),
                    _: 2
                  }, 1032, ["data-filter-category", "checked", "aria-checked", "onClick"])), 64)),
                  d(n(N), null, {
                    default: v(() => [...t[9] || (t[9] = [
                      f("Event or command", -1)
                    ])]),
                    _: 1
                  }),
                  (a(!0), c(S, null, E(l.value.family, (s) => (a(), _(n($), {
                    key: s,
                    "data-filter-family": s,
                    role: "menuitemcheckbox",
                    checked: o.value.family.includes(s),
                    "aria-checked": o.value.family.includes(s),
                    onClick: (j) => R("family", s)
                  }, {
                    default: v(() => [
                      f(m(s), 1)
                    ]),
                    _: 2
                  }, 1032, ["data-filter-family", "checked", "aria-checked", "onClick"]))), 128)),
                  d(n(N), null, {
                    default: v(() => [...t[10] || (t[10] = [
                      f("Sender", -1)
                    ])]),
                    _: 1
                  }),
                  (a(!0), c(S, null, E(l.value.sender, (s) => (a(), _(n($), {
                    key: s,
                    role: "menuitemcheckbox",
                    checked: o.value.sender.includes(s),
                    "aria-checked": o.value.sender.includes(s),
                    onClick: (j) => R("sender", s)
                  }, {
                    default: v(() => [
                      f(m(s), 1)
                    ]),
                    _: 2
                  }, 1032, ["checked", "aria-checked", "onClick"]))), 128)),
                  k.value ? (a(), _(n($), {
                    key: 0,
                    "data-filter-clear": "",
                    onClick: t[2] || (t[2] = (s) => o.value = h())
                  }, {
                    default: v(() => [...t[11] || (t[11] = [
                      f("Clear filters", -1)
                    ])]),
                    _: 1
                  })) : q("", !0)
                ]),
                _: 1
              }, 8, ["anchor"])) : q("", !0)
            ]),
            n(P) ? (a(), c("p", Re, m(n(P)), 1)) : O.value.length ? q("", !0) : (a(), c("p", Te, "Nothing recorded yet. Record agent calls in the developer settings turns the log on.")),
            d(n(re), {
              columns: n(K),
              rows: X.value,
              pick: Q,
              active: T.value,
              empty: "",
              "data-hook-request-list": ""
            }, null, 8, ["columns", "rows", "active"])
          ]),
          t[12] || (t[12] = r("div", {
            class: "divider",
            "data-hook-request-divider": "",
            role: "separator",
            "aria-orientation": "vertical"
          }, null, -1)),
          r("section", Ee, [
            d($e, { request: z.value }, null, 8, ["request"])
          ]),
          x.value ? (a(), c("div", {
            key: 0,
            class: "queue-veil",
            onClick: t[5] || (t[5] = ee((s) => x.value = !1, ["self"]))
          }, [
            d(he, {
              onClose: t[4] || (t[4] = (s) => x.value = !1)
            })
          ])) : q("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, He = /* @__PURE__ */ I(Le, [["__scopeId", "data-v-cd8cfab4"]]);
export {
  He as default
};
