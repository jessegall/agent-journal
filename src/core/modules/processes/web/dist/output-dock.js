/* @code-commandments-generated */
if (!document.getElementById("window-styles-906b7968f5ef")) { const style = document.createElement("style"); style.id = "window-styles-906b7968f5ef"; style.textContent = ".output-dock-inner[data-v-49bc5712]{min-height:0;overflow:hidden}.output-dock-state[data-v-49bc5712]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-49bc5712]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-49bc5712 .9s linear infinite}@keyframes output-spin-49bc5712{to{transform:rotate(360deg)}}.output-dock-title[data-v-49bc5712]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-49bc5712]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-49bc5712]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-49bc5712]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-49bc5712]{height:100%;transition:width .4s ease}.output-dock-loading[data-v-49bc5712]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-49bc5712]{animation:output-fade-49bc5712 .22s var(--ease) .32s backwards}@keyframes output-fade-49bc5712{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-49bc5712]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-fcf61e26]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-fcf61e26]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-fcf61e26]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-fcf61e26]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-fcf61e26]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-c1c1f2f0]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-c1c1f2f0]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-c1c1f2f0],.state.lost[data-v-c1c1f2f0]{color:var(--red, #d4574b)}.line[data-v-c1c1f2f0]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-c1c1f2f0]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as N, computed as l, unref as a, watch as G, openBlock as n, createElementBlock as k, createBlock as p, Teleport as D, createElementVNode as r, normalizeStyle as P, toDisplayString as m, createCommentVNode as h, createTextVNode as X, nextTick as q } from "vue";
import { useWindow as J, useOutputPages as K, useNow as Q, usePoll as U, Icon as Y, SkeletonLine as Z, afterSkeletonMinimum as tt } from "@journal/window-kit";
import { _ as et } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const ot = {
  class: "output-dock",
  "data-output-dock": ""
}, at = ["data-state"], st = {
  key: 0,
  class: "output-dock-ring"
}, nt = ["title"], ut = ["data-figure-bar", "data-figure-began"], lt = ["data-figure-progress"], rt = { "data-output-steps": "" }, dt = { class: "output-dock-figure" }, it = { class: "output-dock-more" }, ct = { class: "output-dock-inner" }, pt = 2e3, vt = 5e3, _t = 24, gt = {
  __name: "OutputDock",
  setup(ft) {
    const O = {
      running: "var(--tone-work)",
      good: "var(--tone-good)",
      bad: "var(--danger)",
      stopped: "var(--text-3)"
    }, B = {
      running: "terminal",
      good: "tick",
      bad: "cross",
      stopped: "stop"
    }, H = {
      running: "running",
      background: "running",
      finished: "good",
      failed: "bad",
      stopped: "stopped",
      orphaned: "stopped"
    }, u = J(), w = u.option("row"), v = u.option("head"), E = u.option("foot"), x = u.option("time"), V = u.option("folded"), e = N(null), b = K(
      (t) => u.read(t.join(" ")),
      () => {
        var t;
        return (t = w.value) == null ? void 0 : t.target_id;
      }
    ), j = b.lines, y = l(() => !a(V)), i = N(null), I = N(!1), z = Q(), d = l(() => {
      var t;
      return H[(t = e.value) == null ? void 0 : t.state] ?? "running";
    }), L = () => d.value === "running", _ = l(() => d.value !== "running"), $ = l(() => {
      var t;
      return Number(((t = e.value) == null ? void 0 : t.progress) ?? 0) / 100;
    }), A = l(
      () => _.value ? "100%" : `${Math.round($.value * 100)}%`
    ), F = l(
      () => {
        var t;
        return (t = e.value) != null && t.created_at ? Date.parse(e.value.created_at) / 1e3 : 0;
      }
    ), M = l(() => {
      var t, o;
      return !((t = e.value) != null && t.steps_passed) && !((o = e.value) != null && o.steps_failed) ? "" : e.value.steps_failed ? `${e.value.steps_passed} passed, ${e.value.steps_failed} failed` : `${e.value.steps_passed} passed`;
    }), R = l(() => {
      var s;
      if (!((s = e.value) != null && s.created_at)) return "";
      const t = e.value.ended_at ? Date.parse(e.value.ended_at) : z.value, o = Math.max(
        0,
        Math.round((t - Date.parse(e.value.created_at)) / 1e3)
      );
      return o >= 60 ? `${Math.floor(o / 60)}m ${o % 60}s` : `${o}s`;
    });
    async function S() {
      var c;
      const t = (c = w.value) == null ? void 0 : c.target_id;
      if (!t) return;
      const o = await u.read(`process card ${t}`);
      if (e.value = o.ok ? o.value : null, !y.value) return;
      const s = i.value, g = !s || s.scrollHeight - s.scrollTop - s.clientHeight < _t, f = performance.now();
      await b.follow(), tt(f, async () => {
        I.value = !0, await q(), g && i.value && (i.value.scrollTop = i.value.scrollHeight);
      });
    }
    return G(y, (t) => t && S()), u.follow(
      ["process.*"],
      (t) => {
        var o;
        return t.row_id === ((o = w.value) == null ? void 0 : o.target_id) && S();
      }
    ), U(
      S,
      L,
      () => y.value ? pt : vt
    ), (t, o) => {
      var s, g, f, c, T, C;
      return n(), k("div", ot, [
        ((s = a(v)) == null ? void 0 : s.value) ?? a(v) ? (n(), p(D, {
          key: 0,
          to: ((g = a(v)) == null ? void 0 : g.value) ?? a(v)
        }, [
          r("span", {
            class: "output-dock-state",
            "data-state": d.value,
            style: P({ "--tone": O[d.value] })
          }, [
            L() ? (n(), k("span", st)) : (n(), p(a(Y), {
              key: 1,
              name: B[d.value],
              size: 14
            }, null, 8, ["name"]))
          ], 12, at),
          r("span", {
            class: "output-dock-title",
            title: ((f = e.value) == null ? void 0 : f.title) || ((c = e.value) == null ? void 0 : c.line)
          }, m(((T = e.value) == null ? void 0 : T.title) || ((C = e.value) == null ? void 0 : C.line)), 9, nt),
          $.value > 0 || _.value ? (n(), k("div", {
            key: 0,
            class: "output-dock-bar",
            "data-figure-bar": _.value ? d.value : "",
            "data-figure-began": F.value
          }, [
            r("div", {
              class: "output-dock-fill",
              style: P({ width: A.value, background: O[d.value] }),
              "data-figure-progress": _.value ? null : ""
            }, null, 12, lt)
          ], 8, ut)) : h("", !0)
        ], 8, ["to"])) : h("", !0),
        a(a(E)) && M.value ? (n(), p(D, {
          key: 1,
          to: a(a(E))
        }, [
          r("span", rt, [
            o[1] || (o[1] = X("Steps: ", -1)),
            r("b", null, m(M.value), 1)
          ])
        ], 8, ["to"])) : h("", !0),
        a(a(x)) ? (n(), p(D, {
          key: 2,
          to: a(a(x))
        }, [
          r("span", dt, m(R.value), 1)
        ], 8, ["to"])) : h("", !0),
        r("div", it, [
          r("div", ct, [
            I.value ? (n(), k("pre", {
              key: 1,
              ref_key: "terminal",
              ref: i,
              class: "output-dock-terminal",
              "data-output-terminal": "",
              onScroll: o[0] || (o[0] = (W) => a(b).loadEarlier(W.target))
            }, m(a(j).join(`
`)), 545)) : (n(), p(a(Z), {
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
}, wt = /* @__PURE__ */ et(gt, [["__scopeId", "data-v-49bc5712"]]);
export {
  wt as default
};
