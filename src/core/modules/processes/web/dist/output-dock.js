/* @code-commandments-generated */
if (!document.getElementById("window-styles-a822ff08193f")) { const style = document.createElement("style"); style.id = "window-styles-a822ff08193f"; style.textContent = ".output-dock-inner[data-v-549aa434]{min-height:0;overflow:hidden}.output-dock-state[data-v-549aa434]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-549aa434]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-549aa434 .9s linear infinite}@keyframes output-spin-549aa434{to{transform:rotate(360deg)}}.output-dock-pending[data-v-549aa434]{display:inline-flex;align-items:center;flex:none;gap:3px}.output-dock-pending i[data-v-549aa434]{width:4px;height:4px;border-radius:50%;background:var(--text-3);animation:output-pending-549aa434 1.2s ease-in-out infinite}.output-dock-pending i[data-v-549aa434]:nth-child(2){animation-delay:.2s}.output-dock-pending i[data-v-549aa434]:nth-child(3){animation-delay:.4s}@keyframes output-pending-549aa434{0%,60%,to{opacity:.3}30%{opacity:1}}@media(prefers-reduced-motion:reduce){.output-dock-pending i[data-v-549aa434]{animation:none}}.output-dock-title[data-v-549aa434]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-549aa434]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-549aa434]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-549aa434]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-549aa434]{height:100%;transition:width .4s ease}.output-dock-loading[data-v-549aa434]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-549aa434]{animation:output-fade-549aa434 .22s var(--ease) .32s backwards}@keyframes output-fade-549aa434{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-549aa434]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-b90056e4]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-b90056e4]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-b90056e4]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-b90056e4]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-b90056e4]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-0821d3b6]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-0821d3b6]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-0821d3b6],.state.lost[data-v-0821d3b6]{color:var(--red, #d4574b)}.line[data-v-0821d3b6]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-0821d3b6]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as I, computed as r, unref as e, watch as G, openBlock as u, createElementBlock as h, createBlock as d, Teleport as w, createElementVNode as n, normalizeStyle as P, toDisplayString as y, createCommentVNode as v, createTextVNode as X, nextTick as q } from "vue";
import { useWindow as J, useOutputPages as K, useNow as Q, usePoll as U, Icon as Y, SkeletonLine as Z, afterSkeletonMinimum as tt } from "@journal/window-kit";
import { _ as et } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const ot = {
  class: "output-dock",
  "data-output-dock": ""
}, at = ["data-state"], nt = {
  key: 0,
  class: "output-dock-ring"
}, st = ["title"], ut = ["data-figure-bar", "data-figure-began"], lt = ["data-figure-progress"], rt = { "data-output-steps": "" }, it = { class: "output-dock-figure" }, dt = { class: "output-dock-more" }, ct = { class: "output-dock-inner" }, pt = 2e3, vt = 5e3, gt = 24, _t = {
  __name: "OutputDock",
  setup(ft) {
    const L = {
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
    }, l = J(), b = l.option("row"), g = l.option("head"), _ = l.option("foot"), $ = l.option("time"), V = l.option("folded"), a = I(null), S = K(
      (t) => l.read(t.join(" ")),
      () => {
        var t;
        return (t = b.value) == null ? void 0 : t.target_id;
      }
    ), j = S.lines, N = r(() => !e(V)), c = I(null), M = I(!1), z = Q(), i = r(() => {
      var t;
      return H[(t = a.value) == null ? void 0 : t.state] ?? "running";
    }), D = () => i.value === "running", f = r(() => i.value !== "running"), O = r(() => {
      var t;
      return Number(((t = a.value) == null ? void 0 : t.progress) ?? 0) / 100;
    }), A = r(
      () => f.value ? "100%" : `${Math.round(O.value * 100)}%`
    ), F = r(
      () => {
        var t;
        return (t = a.value) != null && t.created_at ? Date.parse(a.value.created_at) / 1e3 : 0;
      }
    ), E = r(() => {
      var t, o;
      return !((t = a.value) != null && t.steps_passed) && !((o = a.value) != null && o.steps_failed) ? "" : a.value.steps_failed ? `${a.value.steps_passed} passed, ${a.value.steps_failed} failed` : `${a.value.steps_passed} passed`;
    }), R = r(() => {
      var s;
      if (!((s = a.value) != null && s.created_at)) return "";
      const t = a.value.ended_at ? Date.parse(a.value.ended_at) : z.value, o = Math.max(
        0,
        Math.round((t - Date.parse(a.value.created_at)) / 1e3)
      );
      return o >= 60 ? `${Math.floor(o / 60)}m ${o % 60}s` : `${o}s`;
    });
    async function x() {
      var p;
      const t = (p = b.value) == null ? void 0 : p.target_id;
      if (!t) return;
      const o = await l.read(`process card ${t}`);
      if (a.value = o.ok ? o.value : null, !N.value) return;
      const s = c.value, k = !s || s.scrollHeight - s.scrollTop - s.clientHeight < gt, m = performance.now();
      await S.follow(), tt(m, async () => {
        M.value = !0, await q(), k && c.value && (c.value.scrollTop = c.value.scrollHeight);
      });
    }
    return G(N, (t) => t && x()), l.follow(
      ["process.*"],
      (t) => {
        var o;
        return t.row_id === ((o = b.value) == null ? void 0 : o.target_id) && x();
      }
    ), U(
      x,
      D,
      () => N.value ? pt : vt
    ), (t, o) => {
      var s, k, m, p, T, C;
      return u(), h("div", ot, [
        ((s = e(g)) == null ? void 0 : s.value) ?? e(g) ? (u(), d(w, {
          key: 0,
          to: ((k = e(g)) == null ? void 0 : k.value) ?? e(g)
        }, [
          n("span", {
            class: "output-dock-state",
            "data-state": i.value,
            style: P({ "--tone": L[i.value] })
          }, [
            D() ? (u(), h("span", nt)) : (u(), d(e(Y), {
              key: 1,
              name: B[i.value],
              size: 14
            }, null, 8, ["name"]))
          ], 12, at),
          n("span", {
            class: "output-dock-title",
            title: ((m = a.value) == null ? void 0 : m.title) || ((p = a.value) == null ? void 0 : p.line)
          }, y(((T = a.value) == null ? void 0 : T.title) || ((C = a.value) == null ? void 0 : C.line)), 9, st),
          O.value > 0 || f.value ? (u(), h("div", {
            key: 0,
            class: "output-dock-bar",
            "data-figure-bar": f.value ? i.value : "",
            "data-figure-began": F.value
          }, [
            n("div", {
              class: "output-dock-fill",
              style: P({ width: A.value, background: L[i.value] }),
              "data-figure-progress": f.value ? null : ""
            }, null, 12, lt)
          ], 8, ut)) : v("", !0)
        ], 8, ["to"])) : v("", !0),
        e(e(_)) && D() && !O.value && !E.value ? (u(), d(w, {
          key: 1,
          to: e(e(_))
        }, [
          o[1] || (o[1] = n("span", {
            class: "output-dock-pending",
            "data-output-pending": "",
            "aria-label": "Pending"
          }, [
            n("i"),
            n("i"),
            n("i")
          ], -1))
        ], 8, ["to"])) : v("", !0),
        e(e(_)) && E.value ? (u(), d(w, {
          key: 2,
          to: e(e(_))
        }, [
          n("span", rt, [
            o[2] || (o[2] = X("Steps: ", -1)),
            n("b", null, y(E.value), 1)
          ])
        ], 8, ["to"])) : v("", !0),
        e(e($)) ? (u(), d(w, {
          key: 3,
          to: e(e($))
        }, [
          n("span", it, y(R.value), 1)
        ], 8, ["to"])) : v("", !0),
        n("div", dt, [
          n("div", ct, [
            M.value ? (u(), h("pre", {
              key: 1,
              ref_key: "terminal",
              ref: c,
              class: "output-dock-terminal",
              "data-output-terminal": "",
              onScroll: o[0] || (o[0] = (W) => e(S).loadEarlier(W.target))
            }, y(e(j).join(`
`)), 545)) : (u(), d(e(Z), {
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
}, wt = /* @__PURE__ */ et(_t, [["__scopeId", "data-v-549aa434"]]);
export {
  wt as default
};
