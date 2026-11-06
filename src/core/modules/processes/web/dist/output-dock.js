/* @code-commandments-generated */
if (!document.getElementById("window-styles-9814983b40fe")) { const style = document.createElement("style"); style.id = "window-styles-9814983b40fe"; style.textContent = ".output-dock-inner[data-v-bdda9a8e]{min-height:0;overflow:hidden}.output-dock-state[data-v-bdda9a8e]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-bdda9a8e]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-bdda9a8e .9s linear infinite}@keyframes output-spin-bdda9a8e{to{transform:rotate(360deg)}}.output-dock-pending[data-v-bdda9a8e]{display:inline-flex;align-items:center;flex:none;gap:3px}.output-dock-pending i[data-v-bdda9a8e]{width:4px;height:4px;border-radius:50%;background:var(--text-3);animation:output-pending-bdda9a8e 1.2s ease-in-out infinite}.output-dock-pending i[data-v-bdda9a8e]:nth-child(2){animation-delay:.2s}.output-dock-pending i[data-v-bdda9a8e]:nth-child(3){animation-delay:.4s}@keyframes output-pending-bdda9a8e{0%,60%,to{opacity:.3}30%{opacity:1}}@media(prefers-reduced-motion:reduce){.output-dock-pending i[data-v-bdda9a8e]{animation:none}}.output-dock-title[data-v-bdda9a8e]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-bdda9a8e]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-bdda9a8e]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-bdda9a8e]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-bdda9a8e]{height:100%;transition:width .4s ease}.output-dock-loading[data-v-bdda9a8e]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-bdda9a8e]{animation:output-fade-bdda9a8e .22s var(--ease) .32s backwards}@keyframes output-fade-bdda9a8e{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-bdda9a8e]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-82026ee8]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-82026ee8]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-82026ee8]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-82026ee8]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-82026ee8]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-35b69091]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-35b69091]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-35b69091],.state.lost[data-v-35b69091]{color:var(--red, #d4574b)}.line[data-v-35b69091]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-35b69091]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { computed as u, unref as t, ref as P, watch as X, openBlock as n, createElementBlock as m, createBlock as i, Teleport as h, createElementVNode as s, normalizeStyle as B, toDisplayString as w, createCommentVNode as v, createTextVNode as q, nextTick as J } from "vue";
import { useWindow as K, useDockCard as Q, useOutputPages as U, useNow as Y, usePoll as Z, Icon as tt, SkeletonLine as et, afterSkeletonMinimum as ot } from "@journal/window-kit";
import { _ as at } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const st = {
  class: "output-dock",
  "data-output-dock": ""
}, nt = ["data-state"], ut = {
  key: 0,
  class: "output-dock-ring"
}, lt = ["title"], rt = ["data-figure-bar", "data-figure-began"], dt = ["data-figure-progress"], it = { "data-output-steps": "" }, ct = { class: "output-dock-figure" }, pt = { class: "output-dock-more" }, vt = { class: "output-dock-inner" }, gt = 2e3, _t = 5e3, ft = 24, kt = {
  __name: "OutputDock",
  setup(mt) {
    const L = {
      running: "var(--tone-work)",
      good: "var(--tone-good)",
      bad: "var(--danger)",
      stopped: "var(--text-3)"
    }, H = {
      running: "terminal",
      good: "tick",
      bad: "cross",
      stopped: "stop"
    }, V = {
      running: "running",
      background: "running",
      finished: "good",
      failed: "bad",
      stopped: "stopped",
      orphaned: "stopped"
    }, d = K(), b = Q(), y = d.option("row"), g = d.option("head"), _ = d.option("foot"), x = d.option("time"), z = d.option("folded"), a = b.data, S = U(
      b.readOutput,
      () => {
        var e;
        return (e = y.value) == null ? void 0 : e.target_id;
      }
    ), A = S.lines, D = u(() => !t(z)), c = P(null), M = P(!1), F = Y(), l = u(() => {
      var e;
      return V[(e = a.value) == null ? void 0 : e.state] ?? "running";
    }), N = () => l.value === "running", f = u(() => l.value !== "running"), O = u(() => {
      var e;
      return Number(((e = a.value) == null ? void 0 : e.progress) ?? 0) / 100;
    }), R = u(
      () => f.value ? "100%" : `${Math.round(O.value * 100)}%`
    ), W = u(
      () => {
        var e;
        return (e = a.value) != null && e.created_at ? Date.parse(a.value.created_at) / 1e3 : 0;
      }
    ), E = u(() => {
      var e, o;
      return !((e = a.value) != null && e.steps_passed) && !((o = a.value) != null && o.steps_failed) ? "" : a.value.steps_failed ? `${a.value.steps_passed} passed, ${a.value.steps_failed} failed` : `${a.value.steps_passed} passed`;
    }), j = u(() => {
      var r;
      if (!((r = a.value) != null && r.created_at)) return "";
      const e = a.value.ended_at ? Date.parse(a.value.ended_at) : F.value, o = Math.max(
        0,
        Math.round((e - Date.parse(a.value.created_at)) / 1e3)
      );
      return o >= 60 ? `${Math.floor(o / 60)}m ${o % 60}s` : `${o}s`;
    });
    async function I() {
      var p;
      if (!((p = y.value) == null ? void 0 : p.target_id) || (await b.reload(), !D.value)) return;
      const o = c.value, r = !o || o.scrollHeight - o.scrollTop - o.clientHeight < ft, k = performance.now();
      await S.follow(), ot(k, async () => {
        M.value = !0, await J(), r && c.value && (c.value.scrollTop = c.value.scrollHeight);
      });
    }
    return X(D, (e) => e && I()), d.follow(
      ["process.*"],
      (e) => {
        var o;
        return e.row_id === ((o = y.value) == null ? void 0 : o.target_id) && I();
      }
    ), Z(
      I,
      N,
      () => D.value ? gt : _t
    ), (e, o) => {
      var r, k, p, T, $, C;
      return n(), m("div", st, [
        ((r = t(g)) == null ? void 0 : r.value) ?? t(g) ? (n(), i(h, {
          key: 0,
          to: ((k = t(g)) == null ? void 0 : k.value) ?? t(g)
        }, [
          s("span", {
            class: "output-dock-state",
            "data-state": l.value,
            style: B({ "--tone": L[l.value] })
          }, [
            N() ? (n(), m("span", ut)) : (n(), i(t(tt), {
              key: 1,
              name: H[l.value],
              size: 14
            }, null, 8, ["name"]))
          ], 12, nt),
          s("span", {
            class: "output-dock-title",
            title: ((p = t(a)) == null ? void 0 : p.title) || ((T = t(a)) == null ? void 0 : T.line)
          }, w((($ = t(a)) == null ? void 0 : $.title) || ((C = t(a)) == null ? void 0 : C.line)), 9, lt),
          O.value > 0 || f.value ? (n(), m("div", {
            key: 0,
            class: "output-dock-bar",
            "data-figure-bar": f.value ? l.value : "",
            "data-figure-began": W.value
          }, [
            s("div", {
              class: "output-dock-fill",
              style: B({ width: R.value, background: L[l.value] }),
              "data-figure-progress": f.value ? null : ""
            }, null, 12, dt)
          ], 8, rt)) : v("", !0)
        ], 8, ["to"])) : v("", !0),
        t(t(_)) && N() && !O.value && !E.value ? (n(), i(h, {
          key: 1,
          to: t(t(_))
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
        ], 8, ["to"])) : v("", !0),
        t(t(_)) && E.value ? (n(), i(h, {
          key: 2,
          to: t(t(_))
        }, [
          s("span", it, [
            o[2] || (o[2] = q("Steps: ", -1)),
            s("b", null, w(E.value), 1)
          ])
        ], 8, ["to"])) : v("", !0),
        t(t(x)) ? (n(), i(h, {
          key: 3,
          to: t(t(x))
        }, [
          s("span", ct, w(j.value), 1)
        ], 8, ["to"])) : v("", !0),
        s("div", pt, [
          s("div", vt, [
            M.value ? (n(), m("pre", {
              key: 1,
              ref_key: "terminal",
              ref: c,
              class: "output-dock-terminal",
              "data-output-terminal": "",
              onScroll: o[0] || (o[0] = (G) => t(S).loadEarlier(G.target))
            }, w(t(A).join(`
`)), 545)) : (n(), i(t(et), {
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
}, yt = /* @__PURE__ */ at(kt, [["__scopeId", "data-v-bdda9a8e"]]);
export {
  yt as default
};
