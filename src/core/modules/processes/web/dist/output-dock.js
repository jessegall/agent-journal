/* @code-commandments-generated */
if (!document.getElementById("window-styles-74b3fce88cef")) { const style = document.createElement("style"); style.id = "window-styles-74b3fce88cef"; style.textContent = ".output-dock-inner[data-v-a063d0e4]{min-height:0;overflow:hidden}.output-dock-state[data-v-a063d0e4]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-a063d0e4]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-a063d0e4 .9s linear infinite}@keyframes output-spin-a063d0e4{to{transform:rotate(360deg)}}.output-dock-pending[data-v-a063d0e4]{display:inline-flex;align-items:center;flex:none;gap:3px}.output-dock-pending i[data-v-a063d0e4]{width:4px;height:4px;border-radius:50%;background:var(--text-3);animation:output-pending-a063d0e4 1.2s ease-in-out infinite}.output-dock-pending i[data-v-a063d0e4]:nth-child(2){animation-delay:.2s}.output-dock-pending i[data-v-a063d0e4]:nth-child(3){animation-delay:.4s}@keyframes output-pending-a063d0e4{0%,60%,to{opacity:.3}30%{opacity:1}}@media(prefers-reduced-motion:reduce){.output-dock-pending i[data-v-a063d0e4]{animation:none}}.output-dock-title[data-v-a063d0e4]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-a063d0e4]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-percent[data-v-a063d0e4]{flex:none;margin-right:6px;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-a063d0e4]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-a063d0e4]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-a063d0e4]{height:100%;transition:width .4s ease}.output-dock-loading[data-v-a063d0e4]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-a063d0e4]{animation:output-fade-a063d0e4 .22s var(--ease) .32s backwards}@keyframes output-fade-a063d0e4{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-a063d0e4]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-8c713a5e]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-8c713a5e]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-8c713a5e]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-8c713a5e]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-8c713a5e]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-393a83e0]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-393a83e0]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-393a83e0],.state.lost[data-v-393a83e0]{color:var(--red, #d4574b)}.line[data-v-393a83e0]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-393a83e0]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { computed as u, unref as e, ref as B, watch as H, openBlock as n, createElementBlock as p, createBlock as v, Teleport as b, createElementVNode as s, normalizeStyle as V, toDisplayString as _, createCommentVNode as f, createTextVNode as K, nextTick as Q } from "vue";
import { useWindow as U, useDockCard as Y, useOutputPages as Z, useNow as tt, usePoll as et, Icon as ot, SkeletonLine as at, afterSkeletonMinimum as nt } from "@journal/window-kit";
import { _ as st } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const ut = {
  class: "output-dock",
  "data-output-dock": ""
}, lt = ["data-state"], rt = {
  key: 0,
  class: "output-dock-ring"
}, dt = ["title"], it = ["data-figure-bar", "data-figure-began"], ct = ["data-figure-progress"], pt = { "data-output-steps": "" }, vt = {
  key: 0,
  class: "output-dock-percent",
  "data-output-percent": ""
}, gt = {
  key: 1,
  class: "output-dock-figure"
}, _t = { class: "output-dock-more" }, ft = { class: "output-dock-inner" }, kt = 2e3, mt = 5e3, ht = 24, wt = {
  __name: "OutputDock",
  setup(yt) {
    const L = {
      running: "var(--tone-work)",
      good: "var(--tone-good)",
      bad: "var(--danger)",
      stopped: "var(--text-3)"
    }, z = {
      running: "terminal",
      good: "tick",
      bad: "cross",
      stopped: "stop"
    }, A = {
      running: "running",
      background: "running",
      finished: "good",
      failed: "bad",
      stopped: "stopped",
      orphaned: "stopped"
    }, r = U(), S = Y(), N = r.option("row"), k = r.option("head"), m = r.option("foot"), x = r.option("time"), F = r.option("folded"), R = r.option("collapsed"), a = S.data, h = Z(
      S.readOutput,
      () => {
        var t;
        return (t = N.value) == null ? void 0 : t.target_id;
      }
    ), W = h.lines, D = u(() => !e(F)), d = B(null), M = B(!1), j = tt(), l = u(() => {
      var t;
      return A[(t = a.value) == null ? void 0 : t.state] ?? "running";
    }), O = () => l.value === "running", c = u(() => l.value !== "running"), E = u(() => {
      var t;
      return Number(((t = a.value) == null ? void 0 : t.progress) ?? 0) / 100;
    }), G = u(
      () => c.value ? "100%" : `${Math.round(E.value * 100)}%`
    ), X = u(
      () => {
        var t;
        return (t = a.value) != null && t.created_at ? Date.parse(a.value.created_at) / 1e3 : 0;
      }
    ), $ = u(() => {
      var o;
      if (!e(R)) return "";
      if (c.value) return l.value === "good" ? "100%" : "";
      const t = Math.round(Number(((o = a.value) == null ? void 0 : o.progress) ?? 0));
      return t > 0 ? `${t}%` : "";
    }), I = u(() => {
      var t, o;
      return !((t = a.value) != null && t.steps_passed) && !((o = a.value) != null && o.steps_failed) ? "" : a.value.steps_failed ? `${a.value.steps_passed} passed, ${a.value.steps_failed} failed` : `${a.value.steps_passed} passed`;
    }), q = u(() => {
      var i;
      if (!((i = a.value) != null && i.created_at)) return "";
      const t = a.value.ended_at ? Date.parse(a.value.ended_at) : j.value, o = Math.max(
        0,
        Math.round((t - Date.parse(a.value.created_at)) / 1e3)
      );
      return o >= 60 ? `${Math.floor(o / 60)}m ${o % 60}s` : `${o}s`;
    });
    async function w() {
      var g;
      if (!((g = N.value) == null ? void 0 : g.target_id) || (await S.reload(), !D.value)) return;
      const o = d.value, i = !o || o.scrollHeight - o.scrollTop - o.clientHeight < ht, y = performance.now();
      await h.follow(), nt(y, async () => {
        M.value = !0, await Q(), i && d.value && (d.value.scrollTop = d.value.scrollHeight), d.value && h.feed.drawn(d.value);
      });
    }
    return H(D, (t) => t && w()), H(c, (t) => t && w()), r.follow(
      ["process.*"],
      (t) => {
        var o;
        return t.row_id === ((o = N.value) == null ? void 0 : o.target_id) && w();
      }
    ), et(
      w,
      O,
      () => D.value ? kt : mt
    ), (t, o) => {
      var i, y, g, T, C, P;
      return n(), p("div", ut, [
        ((i = e(k)) == null ? void 0 : i.value) ?? e(k) ? (n(), v(b, {
          key: 0,
          to: ((y = e(k)) == null ? void 0 : y.value) ?? e(k)
        }, [
          s("span", {
            class: "output-dock-state",
            "data-state": l.value,
            style: V({ "--tone": L[l.value] })
          }, [
            O() ? (n(), p("span", rt)) : (n(), v(e(ot), {
              key: 1,
              name: z[l.value],
              size: 14
            }, null, 8, ["name"]))
          ], 12, lt),
          s("span", {
            class: "output-dock-title",
            title: ((g = e(a)) == null ? void 0 : g.title) || ((T = e(a)) == null ? void 0 : T.line)
          }, _(((C = e(a)) == null ? void 0 : C.title) || ((P = e(a)) == null ? void 0 : P.line)), 9, dt),
          E.value > 0 || c.value ? (n(), p("div", {
            key: 0,
            class: "output-dock-bar",
            "data-figure-bar": c.value ? l.value : "",
            "data-figure-began": X.value
          }, [
            s("div", {
              class: "output-dock-fill",
              style: V({ width: G.value, background: L[l.value] }),
              "data-figure-progress": c.value ? null : ""
            }, null, 12, ct)
          ], 8, it)) : f("", !0)
        ], 8, ["to"])) : f("", !0),
        e(e(m)) && O() && !E.value && !I.value ? (n(), v(b, {
          key: 1,
          to: e(e(m))
        }, [
          o[1] || (o[1] = s("span", {
            class: "output-dock-pending",
            "data-output-pending": "",
            "aria-label": "Pending"
          }, [
            s("i"),
            s("i"),
            s("i")
          ], -1))
        ], 8, ["to"])) : f("", !0),
        e(e(m)) && I.value ? (n(), v(b, {
          key: 2,
          to: e(e(m))
        }, [
          s("span", pt, [
            o[2] || (o[2] = K("Steps: ", -1)),
            s("b", null, _(I.value), 1)
          ])
        ], 8, ["to"])) : f("", !0),
        e(e(x)) ? (n(), v(b, {
          key: 3,
          to: e(e(x))
        }, [
          $.value ? (n(), p("span", vt, _($.value), 1)) : (n(), p("span", gt, _(q.value), 1))
        ], 8, ["to"])) : f("", !0),
        s("div", _t, [
          s("div", ft, [
            M.value ? (n(), p("pre", {
              key: 1,
              ref_key: "terminal",
              ref: d,
              class: "output-dock-terminal",
              "data-output-terminal": "",
              onScroll: o[0] || (o[0] = (J) => e(h).loadEarlier(J.target))
            }, _(e(W).join(`
`)), 545)) : (n(), v(e(at), {
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
}, Dt = /* @__PURE__ */ st(wt, [["__scopeId", "data-v-a063d0e4"]]);
export {
  Dt as default
};
