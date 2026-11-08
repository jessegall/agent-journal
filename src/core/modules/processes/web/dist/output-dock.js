/* @code-commandments-generated */
if (!document.getElementById("window-styles-de605004af7e")) { const style = document.createElement("style"); style.id = "window-styles-de605004af7e"; style.textContent = ".output-dock-inner[data-v-8ffd144c]{min-height:0;overflow:hidden}.output-dock-state[data-v-8ffd144c]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-8ffd144c]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-8ffd144c .9s linear infinite}@keyframes output-spin-8ffd144c{to{transform:rotate(360deg)}}.output-dock-pending[data-v-8ffd144c]{display:inline-flex;align-items:center;flex:none;gap:3px}.output-dock-pending i[data-v-8ffd144c]{width:4px;height:4px;border-radius:50%;background:var(--text-3);animation:output-pending-8ffd144c 1.2s ease-in-out infinite}.output-dock-pending i[data-v-8ffd144c]:nth-child(2){animation-delay:.2s}.output-dock-pending i[data-v-8ffd144c]:nth-child(3){animation-delay:.4s}@keyframes output-pending-8ffd144c{0%,60%,to{opacity:.3}30%{opacity:1}}@media(prefers-reduced-motion:reduce){.output-dock-pending i[data-v-8ffd144c]{animation:none}}.output-dock-title[data-v-8ffd144c]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-8ffd144c]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-percent[data-v-8ffd144c]{flex:none;margin-right:6px;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-8ffd144c]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-8ffd144c]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-8ffd144c]{height:100%;transition:width .4s ease}.output-dock-box[data-v-8ffd144c]{position:relative}.output-dock-reader[data-v-8ffd144c]{position:absolute;top:6px;right:14px;padding:2px 8px;border:1px solid var(--border-2);border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;cursor:pointer}.output-dock-reader[data-v-8ffd144c]:hover{background:var(--hover)}.output-dock-loading[data-v-8ffd144c]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-8ffd144c]{animation:output-fade-8ffd144c .22s var(--ease) .32s backwards}@keyframes output-fade-8ffd144c{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-8ffd144c]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-8c713a5e]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-8c713a5e]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-8c713a5e]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-8c713a5e]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-8c713a5e]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-393a83e0]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-393a83e0]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-393a83e0],.state.lost[data-v-393a83e0]{color:var(--red, #d4574b)}.line[data-v-393a83e0]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-393a83e0]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { computed as u, unref as a, ref as L, watch as B, openBlock as s, createElementBlock as p, createBlock as v, Teleport as S, createElementVNode as n, normalizeStyle as H, toDisplayString as f, createCommentVNode as g, createTextVNode as Y, nextTick as Z } from "vue";
import { useWindow as ee, useDockCard as te, useOutputPages as ae, useNow as oe, usePoll as se, Icon as ne, SkeletonLine as ue, afterSkeletonMinimum as le } from "@journal/window-kit";
import { _ as re } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const de = {
  class: "output-dock",
  "data-output-dock": ""
}, ie = ["data-state"], ce = {
  key: 0,
  class: "output-dock-ring"
}, pe = ["title"], ve = ["data-figure-bar", "data-figure-began"], ge = ["data-figure-progress"], _e = { "data-output-steps": "" }, fe = {
  key: 0,
  class: "output-dock-percent",
  "data-output-percent": ""
}, ke = {
  key: 1,
  class: "output-dock-figure"
}, me = { class: "output-dock-more" }, he = { class: "output-dock-inner" }, ye = {
  key: 1,
  class: "output-dock-box"
}, we = 2e3, be = 5e3, Se = 24, Ne = {
  __name: "OutputDock",
  setup(De) {
    const M = {
      running: "var(--tone-work)",
      good: "var(--tone-good)",
      bad: "var(--danger)",
      stopped: "var(--text-3)"
    }, V = {
      running: "terminal",
      good: "tick",
      bad: "cross",
      stopped: "stop"
    }, z = {
      running: "running",
      background: "running",
      finished: "good",
      failed: "bad",
      stopped: "stopped",
      orphaned: "stopped"
    }, l = ee(), N = te(), k = l.option("row"), m = l.option("head"), h = l.option("foot"), $ = l.option("time"), W = l.option("folded"), j = l.option("collapsed"), o = N.data, y = ae(
      N.readOutput,
      () => {
        var e;
        return (e = k.value) == null ? void 0 : e.target_id;
      }
    ), D = y.lines, O = u(() => !a(W)), d = L(null), C = L(!1), q = oe(), r = u(() => {
      var e;
      return z[(e = o.value) == null ? void 0 : e.state] ?? "running";
    }), E = () => r.value === "running", i = u(() => r.value !== "running"), x = u(() => {
      var e;
      return Number(((e = o.value) == null ? void 0 : e.progress) ?? 0) / 100;
    }), G = u(
      () => i.value ? "100%" : `${Math.round(x.value * 100)}%`
    ), X = u(
      () => {
        var e;
        return (e = o.value) != null && e.created_at ? Date.parse(o.value.created_at) / 1e3 : 0;
      }
    ), T = u(() => {
      var t;
      if (!a(j)) return "";
      if (i.value) return r.value === "good" ? "100%" : "";
      const e = Math.round(Number(((t = o.value) == null ? void 0 : t.progress) ?? 0));
      return e > 0 ? `${e}%` : "";
    }), I = u(() => {
      var e, t;
      return !((e = o.value) != null && e.steps_passed) && !((t = o.value) != null && t.steps_failed) ? "" : o.value.steps_failed ? `${o.value.steps_passed} passed, ${o.value.steps_failed} failed` : `${o.value.steps_passed} passed`;
    }), J = u(() => {
      var c;
      if (!((c = o.value) != null && c.created_at)) return "";
      const e = o.value.ended_at ? Date.parse(o.value.ended_at) : q.value, t = Math.max(
        0,
        Math.round((e - Date.parse(o.value.created_at)) / 1e3)
      );
      return t >= 60 ? `${Math.floor(t / 60)}m ${t % 60}s` : `${t}s`;
    });
    async function w() {
      var _;
      if (!((_ = k.value) == null ? void 0 : _.target_id) || (await N.reload(), !O.value)) return;
      const t = d.value, c = !t || t.scrollHeight - t.scrollTop - t.clientHeight < Se, b = performance.now();
      await y.follow(), le(b, async () => {
        C.value = !0, await Z(), c && d.value && (d.value.scrollTop = d.value.scrollHeight), d.value && y.feed.drawn(d.value);
      });
    }
    B(O, (e) => e && w());
    const P = L(!1);
    async function K() {
      var t;
      const e = await l.run(["output", "ask-reader", String((t = k.value) == null ? void 0 : t.target_id)]);
      (e == null ? void 0 : e.ok) !== !1 && (P.value = !0);
    }
    const Q = u(() => {
      var e, t;
      return !P.value && !((e = o.value) != null && e.reader_requested) && !((t = o.value) != null && t.reads_progress) && !i.value;
    });
    return B(i, (e) => e && w()), l.follow(
      ["process.*"],
      (e) => {
        var t;
        return e.row_id === ((t = k.value) == null ? void 0 : t.target_id) && w();
      }
    ), se(
      w,
      E,
      () => O.value ? we : be
    ), (e, t) => {
      var c, b, _, A, F, R;
      return s(), p("div", de, [
        ((c = a(m)) == null ? void 0 : c.value) ?? a(m) ? (s(), v(S, {
          key: 0,
          to: ((b = a(m)) == null ? void 0 : b.value) ?? a(m)
        }, [
          n("span", {
            class: "output-dock-state",
            "data-state": r.value,
            style: H({ "--tone": M[r.value] })
          }, [
            E() ? (s(), p("span", ce)) : (s(), v(a(ne), {
              key: 1,
              name: V[r.value],
              size: 14
            }, null, 8, ["name"]))
          ], 12, ie),
          n("span", {
            class: "output-dock-title",
            title: ((_ = a(o)) == null ? void 0 : _.title) || ((A = a(o)) == null ? void 0 : A.line)
          }, f(((F = a(o)) == null ? void 0 : F.title) || ((R = a(o)) == null ? void 0 : R.line)), 9, pe),
          x.value > 0 || i.value ? (s(), p("div", {
            key: 0,
            class: "output-dock-bar",
            "data-figure-bar": i.value ? r.value : "",
            "data-figure-began": X.value
          }, [
            n("div", {
              class: "output-dock-fill",
              style: H({ width: G.value, background: M[r.value] }),
              "data-figure-progress": i.value ? null : ""
            }, null, 12, ge)
          ], 8, ve)) : g("", !0)
        ], 8, ["to"])) : g("", !0),
        a(a(h)) && E() && !x.value && !I.value ? (s(), v(S, {
          key: 1,
          to: a(a(h))
        }, [
          t[1] || (t[1] = n("span", {
            class: "output-dock-pending",
            "data-output-pending": "",
            "aria-label": "Pending"
          }, [
            n("i"),
            n("i"),
            n("i")
          ], -1))
        ], 8, ["to"])) : g("", !0),
        a(a(h)) && I.value ? (s(), v(S, {
          key: 2,
          to: a(a(h))
        }, [
          n("span", _e, [
            t[2] || (t[2] = Y("Steps: ", -1)),
            n("b", null, f(I.value), 1)
          ])
        ], 8, ["to"])) : g("", !0),
        a(a($)) ? (s(), v(S, {
          key: 3,
          to: a(a($))
        }, [
          T.value ? (s(), p("span", fe, f(T.value), 1)) : (s(), p("span", ke, f(J.value), 1))
        ], 8, ["to"])) : g("", !0),
        n("div", me, [
          n("div", he, [
            C.value ? (s(), p("div", ye, [
              n("pre", {
                ref_key: "terminal",
                ref: d,
                class: "output-dock-terminal",
                "data-output-terminal": "",
                onScroll: t[0] || (t[0] = (U) => a(y).loadEarlier(U.target))
              }, f(a(D).length ? a(D).join(`
`) : "No output yet"), 545),
              !a(D).length && Q.value ? (s(), p("button", {
                key: 0,
                type: "button",
                class: "output-dock-reader",
                "data-output-reader-ask": "",
                onClick: K
              }, " Ask the agent to draw a reader ")) : g("", !0)
            ])) : (s(), v(a(ue), {
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
}, Ie = /* @__PURE__ */ re(Ne, [["__scopeId", "data-v-8ffd144c"]]);
export {
  Ie as default
};
