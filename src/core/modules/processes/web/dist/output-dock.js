/* @code-commandments-generated */
if (!document.getElementById("window-styles-21fd6149c5f5")) { const style = document.createElement("style"); style.id = "window-styles-21fd6149c5f5"; style.textContent = ".output-dock-inner[data-v-9f9a7e28]{min-height:0;overflow:hidden}.output-dock-state[data-v-9f9a7e28]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-9f9a7e28]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-9f9a7e28 .9s linear infinite}@keyframes output-spin-9f9a7e28{to{transform:rotate(360deg)}}.output-dock-pending[data-v-9f9a7e28]{display:inline-flex;align-items:center;flex:none;gap:3px}.output-dock-pending i[data-v-9f9a7e28]{width:4px;height:4px;border-radius:50%;background:var(--text-3);animation:output-pending-9f9a7e28 1.2s ease-in-out infinite}.output-dock-pending i[data-v-9f9a7e28]:nth-child(2){animation-delay:.2s}.output-dock-pending i[data-v-9f9a7e28]:nth-child(3){animation-delay:.4s}@keyframes output-pending-9f9a7e28{0%,60%,to{opacity:.3}30%{opacity:1}}@media(prefers-reduced-motion:reduce){.output-dock-pending i[data-v-9f9a7e28]{animation:none}}.output-dock-title[data-v-9f9a7e28]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-9f9a7e28]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-percent[data-v-9f9a7e28]{flex:none;margin-right:6px;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-9f9a7e28]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-9f9a7e28]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-9f9a7e28]{height:100%;transition:width .4s ease}.output-dock-loading[data-v-9f9a7e28]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-9f9a7e28]{animation:output-fade-9f9a7e28 .22s var(--ease) .32s backwards}@keyframes output-fade-9f9a7e28{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-9f9a7e28]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-fe4bfd6e]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-fe4bfd6e]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-fe4bfd6e]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-fe4bfd6e]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-fe4bfd6e]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-cd6ac8a9]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-cd6ac8a9]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-cd6ac8a9],.state.lost[data-v-cd6ac8a9]{color:var(--red, #d4574b)}.line[data-v-cd6ac8a9]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-cd6ac8a9]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { computed as u, unref as t, ref as B, watch as J, openBlock as n, createElementBlock as g, createBlock as i, Teleport as w, createElementVNode as s, normalizeStyle as H, toDisplayString as _, createCommentVNode as c, createTextVNode as K, nextTick as Q } from "vue";
import { useWindow as U, useDockCard as Y, useOutputPages as Z, useNow as tt, usePoll as et, Icon as ot, SkeletonLine as at, afterSkeletonMinimum as st } from "@journal/window-kit";
import { _ as nt } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
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
}, gt = { class: "output-dock-figure" }, _t = { class: "output-dock-more" }, ft = { class: "output-dock-inner" }, kt = 2e3, mt = 5e3, ht = 24, wt = {
  __name: "OutputDock",
  setup(yt) {
    const L = {
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
    }, l = U(), y = Y(), b = l.option("row"), f = l.option("head"), k = l.option("foot"), x = l.option("time"), A = l.option("folded"), F = l.option("collapsed"), a = y.data, S = Z(
      y.readOutput,
      () => {
        var e;
        return (e = b.value) == null ? void 0 : e.target_id;
      }
    ), R = S.lines, N = u(() => !t(A)), p = B(null), M = B(!1), W = tt(), r = u(() => {
      var e;
      return z[(e = a.value) == null ? void 0 : e.state] ?? "running";
    }), D = () => r.value === "running", m = u(() => r.value !== "running"), O = u(() => {
      var e;
      return Number(((e = a.value) == null ? void 0 : e.progress) ?? 0) / 100;
    }), j = u(
      () => m.value ? "100%" : `${Math.round(O.value * 100)}%`
    ), G = u(
      () => {
        var e;
        return (e = a.value) != null && e.created_at ? Date.parse(a.value.created_at) / 1e3 : 0;
      }
    ), $ = u(() => {
      var o;
      const e = Math.round(Number(((o = a.value) == null ? void 0 : o.progress) ?? 0));
      return t(F) && e > 0 ? `${e}%` : "";
    }), E = u(() => {
      var e, o;
      return !((e = a.value) != null && e.steps_passed) && !((o = a.value) != null && o.steps_failed) ? "" : a.value.steps_failed ? `${a.value.steps_passed} passed, ${a.value.steps_failed} failed` : `${a.value.steps_passed} passed`;
    }), X = u(() => {
      var d;
      if (!((d = a.value) != null && d.created_at)) return "";
      const e = a.value.ended_at ? Date.parse(a.value.ended_at) : W.value, o = Math.max(
        0,
        Math.round((e - Date.parse(a.value.created_at)) / 1e3)
      );
      return o >= 60 ? `${Math.floor(o / 60)}m ${o % 60}s` : `${o}s`;
    });
    async function I() {
      var v;
      if (!((v = b.value) == null ? void 0 : v.target_id) || (await y.reload(), !N.value)) return;
      const o = p.value, d = !o || o.scrollHeight - o.scrollTop - o.clientHeight < ht, h = performance.now();
      await S.follow(), st(h, async () => {
        M.value = !0, await Q(), d && p.value && (p.value.scrollTop = p.value.scrollHeight);
      });
    }
    return J(N, (e) => e && I()), l.follow(
      ["process.*"],
      (e) => {
        var o;
        return e.row_id === ((o = b.value) == null ? void 0 : o.target_id) && I();
      }
    ), et(
      I,
      D,
      () => N.value ? kt : mt
    ), (e, o) => {
      var d, h, v, T, C, P;
      return n(), g("div", ut, [
        ((d = t(f)) == null ? void 0 : d.value) ?? t(f) ? (n(), i(w, {
          key: 0,
          to: ((h = t(f)) == null ? void 0 : h.value) ?? t(f)
        }, [
          s("span", {
            class: "output-dock-state",
            "data-state": r.value,
            style: H({ "--tone": L[r.value] })
          }, [
            D() ? (n(), g("span", rt)) : (n(), i(t(ot), {
              key: 1,
              name: V[r.value],
              size: 14
            }, null, 8, ["name"]))
          ], 12, lt),
          s("span", {
            class: "output-dock-title",
            title: ((v = t(a)) == null ? void 0 : v.title) || ((T = t(a)) == null ? void 0 : T.line)
          }, _(((C = t(a)) == null ? void 0 : C.title) || ((P = t(a)) == null ? void 0 : P.line)), 9, dt),
          O.value > 0 || m.value ? (n(), g("div", {
            key: 0,
            class: "output-dock-bar",
            "data-figure-bar": m.value ? r.value : "",
            "data-figure-began": G.value
          }, [
            s("div", {
              class: "output-dock-fill",
              style: H({ width: j.value, background: L[r.value] }),
              "data-figure-progress": m.value ? null : ""
            }, null, 12, ct)
          ], 8, it)) : c("", !0)
        ], 8, ["to"])) : c("", !0),
        t(t(k)) && D() && !O.value && !E.value ? (n(), i(w, {
          key: 1,
          to: t(t(k))
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
        ], 8, ["to"])) : c("", !0),
        t(t(k)) && E.value ? (n(), i(w, {
          key: 2,
          to: t(t(k))
        }, [
          s("span", pt, [
            o[2] || (o[2] = K("Steps: ", -1)),
            s("b", null, _(E.value), 1)
          ])
        ], 8, ["to"])) : c("", !0),
        t(t(x)) ? (n(), i(w, {
          key: 3,
          to: t(t(x))
        }, [
          $.value ? (n(), g("span", vt, _($.value), 1)) : c("", !0),
          s("span", gt, _(X.value), 1)
        ], 8, ["to"])) : c("", !0),
        s("div", _t, [
          s("div", ft, [
            M.value ? (n(), g("pre", {
              key: 1,
              ref_key: "terminal",
              ref: p,
              class: "output-dock-terminal",
              "data-output-terminal": "",
              onScroll: o[0] || (o[0] = (q) => t(S).loadEarlier(q.target))
            }, _(t(R).join(`
`)), 545)) : (n(), i(t(at), {
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
}, Dt = /* @__PURE__ */ nt(wt, [["__scopeId", "data-v-9f9a7e28"]]);
export {
  Dt as default
};
