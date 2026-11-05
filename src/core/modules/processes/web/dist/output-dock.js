/* @code-commandments-generated */
if (!document.getElementById("window-styles-b96ce100613a")) { const style = document.createElement("style"); style.id = "window-styles-b96ce100613a"; style.textContent = ".output-dock-inner[data-v-ce35fbc4]{min-height:0;overflow:hidden}.output-dock-state[data-v-ce35fbc4]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-ce35fbc4]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-ce35fbc4 .9s linear infinite}@keyframes output-spin-ce35fbc4{to{transform:rotate(360deg)}}.output-dock-pending[data-v-ce35fbc4]{display:inline-flex;align-items:center;flex:none;gap:3px}.output-dock-pending i[data-v-ce35fbc4]{width:4px;height:4px;border-radius:50%;background:var(--text-3);animation:output-pending-ce35fbc4 1.2s ease-in-out infinite}.output-dock-pending i[data-v-ce35fbc4]:nth-child(2){animation-delay:.2s}.output-dock-pending i[data-v-ce35fbc4]:nth-child(3){animation-delay:.4s}@keyframes output-pending-ce35fbc4{0%,60%,to{opacity:.3}30%{opacity:1}}@media(prefers-reduced-motion:reduce){.output-dock-pending i[data-v-ce35fbc4]{animation:none}}.output-dock-title[data-v-ce35fbc4]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-ce35fbc4]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-ce35fbc4]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-ce35fbc4]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-ce35fbc4]{height:100%;transition:width .4s ease}.output-dock-loading[data-v-ce35fbc4]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-ce35fbc4]{animation:output-fade-ce35fbc4 .22s var(--ease) .32s backwards}@keyframes output-fade-ce35fbc4{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-ce35fbc4]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-97d5a832]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-97d5a832]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-97d5a832]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-97d5a832]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-97d5a832]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-4486ac26]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-4486ac26]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-4486ac26],.state.lost[data-v-4486ac26]{color:var(--red, #d4574b)}.line[data-v-4486ac26]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-4486ac26]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as E, computed as r, unref as a, watch as G, openBlock as l, createElementBlock as p, createBlock as v, Teleport as x, createElementVNode as n, normalizeStyle as P, toDisplayString as h, createCommentVNode as _, createTextVNode as X, nextTick as q } from "vue";
import { useWindow as J, useOutputPages as K, useNow as Q, usePoll as U, Icon as Y, SkeletonLine as Z, afterSkeletonMinimum as tt } from "@journal/window-kit";
import { _ as et } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const ot = {
  class: "output-dock",
  "data-output-dock": ""
}, at = ["data-state"], nt = {
  key: 0,
  class: "output-dock-ring"
}, st = ["title"], lt = {
  key: 0,
  class: "output-dock-pending",
  "data-output-pending": "",
  "aria-label": "Pending"
}, ut = ["data-figure-bar", "data-figure-began"], rt = ["data-figure-progress"], it = { "data-output-steps": "" }, dt = { class: "output-dock-figure" }, ct = { class: "output-dock-more" }, pt = { class: "output-dock-inner" }, vt = 2e3, _t = 5e3, gt = 24, ft = {
  __name: "OutputDock",
  setup(kt) {
    const I = {
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
    }, u = J(), w = u.option("row"), g = u.option("head"), L = u.option("foot"), $ = u.option("time"), V = u.option("folded"), o = E(null), b = K(
      (t) => u.read(t.join(" ")),
      () => {
        var t;
        return (t = w.value) == null ? void 0 : t.target_id;
      }
    ), j = b.lines, y = r(() => !a(V)), d = E(null), M = E(!1), z = Q(), i = r(() => {
      var t;
      return H[(t = o.value) == null ? void 0 : t.state] ?? "running";
    }), S = () => i.value === "running", f = r(() => i.value !== "running"), N = r(() => {
      var t;
      return Number(((t = o.value) == null ? void 0 : t.progress) ?? 0) / 100;
    }), A = r(
      () => f.value ? "100%" : `${Math.round(N.value * 100)}%`
    ), F = r(
      () => {
        var t;
        return (t = o.value) != null && t.created_at ? Date.parse(o.value.created_at) / 1e3 : 0;
      }
    ), D = r(() => {
      var t, e;
      return !((t = o.value) != null && t.steps_passed) && !((e = o.value) != null && e.steps_failed) ? "" : o.value.steps_failed ? `${o.value.steps_passed} passed, ${o.value.steps_failed} failed` : `${o.value.steps_passed} passed`;
    }), R = r(() => {
      var s;
      if (!((s = o.value) != null && s.created_at)) return "";
      const t = o.value.ended_at ? Date.parse(o.value.ended_at) : z.value, e = Math.max(
        0,
        Math.round((t - Date.parse(o.value.created_at)) / 1e3)
      );
      return e >= 60 ? `${Math.floor(e / 60)}m ${e % 60}s` : `${e}s`;
    });
    async function O() {
      var c;
      const t = (c = w.value) == null ? void 0 : c.target_id;
      if (!t) return;
      const e = await u.read(`process card ${t}`);
      if (o.value = e.ok ? e.value : null, !y.value) return;
      const s = d.value, k = !s || s.scrollHeight - s.scrollTop - s.clientHeight < gt, m = performance.now();
      await b.follow(), tt(m, async () => {
        M.value = !0, await q(), k && d.value && (d.value.scrollTop = d.value.scrollHeight);
      });
    }
    return G(y, (t) => t && O()), u.follow(
      ["process.*"],
      (t) => {
        var e;
        return t.row_id === ((e = w.value) == null ? void 0 : e.target_id) && O();
      }
    ), U(
      O,
      S,
      () => y.value ? vt : _t
    ), (t, e) => {
      var s, k, m, c, T, C;
      return l(), p("div", ot, [
        ((s = a(g)) == null ? void 0 : s.value) ?? a(g) ? (l(), v(x, {
          key: 0,
          to: ((k = a(g)) == null ? void 0 : k.value) ?? a(g)
        }, [
          n("span", {
            class: "output-dock-state",
            "data-state": i.value,
            style: P({ "--tone": I[i.value] })
          }, [
            S() ? (l(), p("span", nt)) : (l(), v(a(Y), {
              key: 1,
              name: B[i.value],
              size: 14
            }, null, 8, ["name"]))
          ], 12, at),
          n("span", {
            class: "output-dock-title",
            title: ((m = o.value) == null ? void 0 : m.title) || ((c = o.value) == null ? void 0 : c.line)
          }, h(((T = o.value) == null ? void 0 : T.title) || ((C = o.value) == null ? void 0 : C.line)), 9, st),
          S() && !N.value && !D.value ? (l(), p("span", lt, [...e[1] || (e[1] = [
            n("i", null, null, -1),
            n("i", null, null, -1),
            n("i", null, null, -1)
          ])])) : _("", !0),
          N.value > 0 || f.value ? (l(), p("div", {
            key: 1,
            class: "output-dock-bar",
            "data-figure-bar": f.value ? i.value : "",
            "data-figure-began": F.value
          }, [
            n("div", {
              class: "output-dock-fill",
              style: P({ width: A.value, background: I[i.value] }),
              "data-figure-progress": f.value ? null : ""
            }, null, 12, rt)
          ], 8, ut)) : _("", !0)
        ], 8, ["to"])) : _("", !0),
        a(a(L)) && D.value ? (l(), v(x, {
          key: 1,
          to: a(a(L))
        }, [
          n("span", it, [
            e[2] || (e[2] = X("Steps: ", -1)),
            n("b", null, h(D.value), 1)
          ])
        ], 8, ["to"])) : _("", !0),
        a(a($)) ? (l(), v(x, {
          key: 2,
          to: a(a($))
        }, [
          n("span", dt, h(R.value), 1)
        ], 8, ["to"])) : _("", !0),
        n("div", ct, [
          n("div", pt, [
            M.value ? (l(), p("pre", {
              key: 1,
              ref_key: "terminal",
              ref: d,
              class: "output-dock-terminal",
              "data-output-terminal": "",
              onScroll: e[0] || (e[0] = (W) => a(b).loadEarlier(W.target))
            }, h(a(j).join(`
`)), 545)) : (l(), v(a(Z), {
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
}, bt = /* @__PURE__ */ et(ft, [["__scopeId", "data-v-ce35fbc4"]]);
export {
  bt as default
};
