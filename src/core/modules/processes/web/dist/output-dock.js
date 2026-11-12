if (!document.getElementById("window-styles-a9aa977645fc")) { const style = document.createElement("style"); style.id = "window-styles-a9aa977645fc"; style.textContent = ".output-dock-inner[data-v-8db61f1b]{min-height:0;overflow:hidden}.output-dock-state[data-v-8db61f1b]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-8db61f1b]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-8db61f1b .9s linear infinite}@keyframes output-spin-8db61f1b{to{transform:rotate(360deg)}}.output-dock-pending[data-v-8db61f1b]{display:inline-flex;align-items:center;flex:none;gap:3px}.output-dock-pending i[data-v-8db61f1b]{width:4px;height:4px;border-radius:50%;background:var(--text-3);animation:output-pending-8db61f1b 1.2s ease-in-out infinite}.output-dock-pending i[data-v-8db61f1b]:nth-child(2){animation-delay:.2s}.output-dock-pending i[data-v-8db61f1b]:nth-child(3){animation-delay:.4s}@keyframes output-pending-8db61f1b{0%,60%,to{opacity:.3}30%{opacity:1}}@media(prefers-reduced-motion:reduce){.output-dock-pending i[data-v-8db61f1b]{animation:none}}.output-dock-title[data-v-8db61f1b]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-8db61f1b]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-percent[data-v-8db61f1b]{flex:none;align-self:center;width:32px;height:4px;margin-right:6px;overflow:hidden;border-radius:2px;background:var(--hover)}.output-dock-percent i[data-v-8db61f1b]{display:block;height:100%}.output-dock-terminal[data-v-8db61f1b]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-8db61f1b]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-8db61f1b]{height:100%;transition:width .4s ease}.output-dock-box[data-v-8db61f1b]{position:relative}.output-dock-report[data-v-8db61f1b]{position:absolute;top:6px;right:14px;display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;padding:0;border:0;border-radius:6px;background:none;color:var(--text-3);cursor:pointer}.output-dock-report[data-v-8db61f1b]:hover{background:var(--hover);color:var(--text)}.output-dock-loading[data-v-8db61f1b]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-8db61f1b]{animation:output-fade-8db61f1b .22s var(--ease) .32s backwards}@keyframes output-fade-8db61f1b{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-8db61f1b]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-8c713a5e]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-8c713a5e]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-8c713a5e]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-8c713a5e]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-8c713a5e]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-6c441eae]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-6c441eae]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-6c441eae],.state.lost[data-v-6c441eae]{color:var(--red, #d4574b)}.line[data-v-6c441eae]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.marks[data-v-6c441eae]{padding:8px 12px;font-size:12px}.marks h3[data-v-6c441eae]{margin:0 0 4px;font-size:12px;color:var(--text-2)}.mark[data-v-6c441eae]{display:flex;gap:8px;margin:2px 0}.why[data-v-6c441eae],.who[data-v-6c441eae],.note[data-v-6c441eae]{flex:none;color:var(--text-3)}button[data-v-6c441eae]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { computed as s, unref as a, ref as h, watch as Z, openBlock as n, createElementBlock as p, createBlock as r, Teleport as S, createElementVNode as u, normalizeStyle as A, toDisplayString as m, createCommentVNode as l, createTextVNode as N, Fragment as ee, createVNode as pe, withCtx as D, nextTick as ce } from "vue";
import { useWindow as ve, useDockCard as ke, useOutputPages as ge, useNow as fe, usePoll as _e, Icon as te, SkeletonLine as me, MenuPanel as be, MenuItem as F, afterSkeletonMinimum as ye } from "@journal/window-kit";
import { _ as we } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const he = {
  class: "output-dock",
  "data-output-dock": ""
}, Se = ["data-state"], Ne = {
  key: 0,
  class: "output-dock-ring"
}, xe = ["title"], $e = ["data-figure-bar", "data-figure-began"], Me = ["data-figure-progress"], Oe = { "data-output-steps": "" }, Ce = { "data-output-progress": "" }, De = ["title", "aria-label"], Ee = {
  key: 1,
  class: "output-dock-figure"
}, Ie = { class: "output-dock-more" }, Le = { class: "output-dock-inner" }, Te = {
  key: 1,
  class: "output-dock-box"
}, Pe = {
  key: 0,
  class: "output-dock-reading",
  "data-output-reading": ""
}, Re = ["aria-expanded"], Ae = 2e3, Fe = 5e3, Ve = 24, ze = {
  __name: "OutputDock",
  setup(Be) {
    const E = {
      running: "var(--tone-work)",
      good: "var(--tone-good)",
      bad: "var(--danger)",
      stopped: "var(--text-3)"
    }, ae = {
      running: "terminal",
      good: "tick",
      bad: "cross",
      stopped: "stop"
    }, oe = {
      running: "running",
      background: "running",
      finished: "good",
      failed: "bad",
      stopped: "stopped",
      orphaned: "stopped"
    }, i = ve(), I = ke(), b = i.option("row"), x = i.option("head"), g = i.option("foot"), V = i.option("time"), ne = i.option("folded"), ue = i.option("collapsed"), o = I.data, $ = ge(
      I.readOutput,
      () => {
        var t;
        return (t = b.value) == null ? void 0 : t.target_id;
      }
    ), z = $.lines, L = s(() => !a(ne)), k = h(null), B = h(!1), se = fe(), c = s(() => {
      var t;
      return oe[(t = o.value) == null ? void 0 : t.state] ?? "running";
    }), T = () => c.value === "running", v = s(() => c.value !== "running"), P = s(() => {
      var t;
      return Number(((t = o.value) == null ? void 0 : t.progress) ?? 0) / 100;
    }), re = s(
      () => v.value ? "100%" : `${Math.round(P.value * 100)}%`
    ), le = s(
      () => {
        var t;
        return (t = o.value) != null && t.created_at ? Date.parse(o.value.created_at) / 1e3 : 0;
      }
    ), M = s(() => {
      var e;
      if (!a(ue)) return "";
      if (v.value) return c.value === "good" ? "100%" : "";
      const t = Math.round(Number(((e = o.value) == null ? void 0 : e.progress) ?? 0));
      return t > 0 ? `${t}%` : "";
    }), O = s(() => {
      var t, e;
      return !((t = o.value) != null && t.steps_passed) && !((e = o.value) != null && e.steps_failed) ? "" : o.value.steps_failed ? `${o.value.steps_passed} passed, ${o.value.steps_failed} failed` : `${o.value.steps_passed} passed`;
    }), H = s(() => {
      var e;
      if (O.value || v.value) return "";
      const t = Math.round(Number(((e = o.value) == null ? void 0 : e.progress) ?? 0));
      return t > 0 ? `${t}%` : "";
    }), de = s(() => {
      var d;
      if (!((d = o.value) != null && d.created_at)) return "";
      const t = o.value.ended_at ? Date.parse(o.value.ended_at) : se.value, e = Math.max(
        0,
        Math.round((t - Date.parse(o.value.created_at)) / 1e3)
      );
      return e >= 60 ? `${Math.floor(e / 60)}m ${e % 60}s` : `${e}s`;
    });
    async function y() {
      var w;
      if (!((w = b.value) == null ? void 0 : w.target_id) || (await I.reload(), !L.value)) return;
      const e = k.value, d = !e || e.scrollHeight - e.scrollTop - e.clientHeight < Ve, C = performance.now();
      await $.follow(), ye(C, async () => {
        B.value = !0, await ce(), d && k.value && (k.value.scrollTop = k.value.scrollHeight), k.value && $.feed.drawn(k.value);
      });
    }
    Z(L, (t) => t && y());
    const W = h(!1);
    async function ie() {
      var e;
      const t = await i.run(["output", "ask-reader", String((e = b.value) == null ? void 0 : e.target_id)]);
      (t == null ? void 0 : t.ok) !== !1 && (W.value = !0);
    }
    const j = s(() => {
      var t, e;
      return !W.value && !((t = o.value) != null && t.reader_requested) && !((e = o.value) != null && e.reads_progress) && !v.value;
    }), q = h(null), f = h(!1);
    async function R(t) {
      f.value = !1, await t();
    }
    async function G(t) {
      var d;
      const e = await i.run(["output", t, String((d = b.value) == null ? void 0 : d.target_id)]);
      (e == null ? void 0 : e.ok) !== !1 && y();
    }
    return Z(v, (t) => t && y()), i.follow(
      ["process.*"],
      (t) => {
        var e;
        return t.row_id === ((e = b.value) == null ? void 0 : e.target_id) && y();
      }
    ), _e(
      y,
      T,
      () => L.value ? Ae : Fe
    ), (t, e) => {
      var d, C, w, X, J, K, Q, U;
      return n(), p("div", he, [
        ((d = a(x)) == null ? void 0 : d.value) ?? a(x) ? (n(), r(S, {
          key: 0,
          to: ((C = a(x)) == null ? void 0 : C.value) ?? a(x)
        }, [
          u("span", {
            class: "output-dock-state",
            "data-state": c.value,
            style: A({ "--tone": E[c.value] })
          }, [
            T() ? (n(), p("span", Ne)) : (n(), r(a(te), {
              key: 1,
              name: ae[c.value],
              size: 14
            }, null, 8, ["name"]))
          ], 12, Se),
          u("span", {
            class: "output-dock-title",
            title: ((w = a(o)) == null ? void 0 : w.title) || ((X = a(o)) == null ? void 0 : X.line)
          }, m(((J = a(o)) == null ? void 0 : J.title) || ((K = a(o)) == null ? void 0 : K.line)), 9, xe),
          P.value > 0 || v.value ? (n(), p("div", {
            key: 0,
            class: "output-dock-bar",
            "data-figure-bar": v.value ? c.value : "",
            "data-figure-began": le.value
          }, [
            u("div", {
              class: "output-dock-fill",
              style: A({ width: re.value, background: E[c.value] }),
              "data-figure-progress": v.value ? null : ""
            }, null, 12, Me)
          ], 8, $e)) : l("", !0)
        ], 8, ["to"])) : l("", !0),
        a(a(g)) && T() && !P.value && !O.value ? (n(), r(S, {
          key: 1,
          to: a(a(g))
        }, [
          e[6] || (e[6] = u("span", {
            class: "output-dock-pending",
            "data-output-pending": "",
            "aria-label": "Pending"
          }, [
            u("i"),
            u("i"),
            u("i")
          ], -1))
        ], 8, ["to"])) : l("", !0),
        a(a(g)) && O.value ? (n(), r(S, {
          key: 2,
          to: a(a(g))
        }, [
          u("span", Oe, [
            e[7] || (e[7] = N("Steps: ", -1)),
            u("b", null, m(O.value), 1)
          ])
        ], 8, ["to"])) : l("", !0),
        a(a(g)) && H.value ? (n(), r(S, {
          key: 3,
          to: a(a(g))
        }, [
          u("span", Ce, [
            e[8] || (e[8] = N("Progress: ", -1)),
            u("b", null, m(H.value), 1)
          ])
        ], 8, ["to"])) : l("", !0),
        a(a(V)) ? (n(), r(S, {
          key: 4,
          to: a(a(V))
        }, [
          M.value ? (n(), p("span", {
            key: 0,
            class: "output-dock-percent",
            "data-output-percent": "",
            role: "img",
            title: M.value,
            "aria-label": M.value
          }, [
            u("i", {
              style: A({ width: M.value, background: E.running })
            }, null, 4)
          ], 8, De)) : (n(), p("span", Ee, m(de.value), 1))
        ], 8, ["to"])) : l("", !0),
        u("div", Ie, [
          u("div", Le, [
            B.value ? (n(), p("div", Te, [
              u("pre", {
                ref_key: "terminal",
                ref: k,
                class: "output-dock-terminal",
                "data-output-terminal": "",
                onScroll: e[0] || (e[0] = (_) => a($).loadEarlier(_.target))
              }, m(a(z).length ? a(z).join(`
`) : "No output yet"), 545),
              (Q = a(o)) != null && Q.reading_text ? (n(), p("p", Pe, m(a(o).reading_text), 1)) : l("", !0),
              j.value || (U = a(o)) != null && U.markable ? (n(), p(ee, { key: 1 }, [
                u("button", {
                  ref_key: "reportAnchor",
                  ref: q,
                  type: "button",
                  class: "output-dock-report",
                  "data-output-report": "",
                  title: "Report a problem with this output",
                  "aria-label": "Report a problem with this output",
                  "aria-expanded": f.value,
                  onClick: e[1] || (e[1] = (_) => f.value = !f.value)
                }, [
                  pe(a(te), {
                    name: "warn",
                    size: 14
                  })
                ], 8, Re),
                f.value ? (n(), r(a(be), {
                  key: 0,
                  anchor: q.value,
                  "min-width": 190,
                  "data-output-report-menu": "",
                  onClose: e[5] || (e[5] = (_) => f.value = !1)
                }, {
                  default: D(() => {
                    var _;
                    return [
                      j.value ? (n(), r(a(F), {
                        key: 0,
                        "data-output-reader-ask": "",
                        onClick: e[2] || (e[2] = (Y) => R(ie))
                      }, {
                        default: D(() => [...e[9] || (e[9] = [
                          N("Ask for a better reader", -1)
                        ])]),
                        _: 1
                      })) : l("", !0),
                      (_ = a(o)) != null && _.markable ? (n(), p(ee, { key: 1 }, [
                        a(o).marked_words ? (n(), r(a(F), {
                          key: 0,
                          "data-output-mark-readable": "",
                          onClick: e[3] || (e[3] = (Y) => R(() => G("readable")))
                        }, {
                          default: D(() => [...e[10] || (e[10] = [
                            N("Mark as readable", -1)
                          ])]),
                          _: 1
                        })) : (n(), r(a(F), {
                          key: 1,
                          "data-output-mark-unreadable": "",
                          onClick: e[4] || (e[4] = (Y) => R(() => G("unreadable")))
                        }, {
                          default: D(() => [...e[11] || (e[11] = [
                            N("Mark as unreadable", -1)
                          ])]),
                          _: 1
                        }))
                      ], 64)) : l("", !0)
                    ];
                  }),
                  _: 1
                }, 8, ["anchor"])) : l("", !0)
              ], 64)) : l("", !0)
            ])) : (n(), r(a(me), {
              key: 0,
              class: "output-dock-loading",
              bars: [
                { width: "70%", height: 11 },
                { width: "45%", height: 11 }
              ]
            }))
          ])
        ])
      ]);
    };
  }
}, qe = /* @__PURE__ */ we(ze, [["__scopeId", "data-v-8db61f1b"]]);
export {
  qe as default
};
