/* @code-commandments-generated */
if (!document.getElementById("window-styles-abac19c78139")) { const style = document.createElement("style"); style.id = "window-styles-abac19c78139"; style.textContent = ".output-dock-inner[data-v-0eb910f8]{min-height:0;overflow:hidden}.output-dock-state[data-v-0eb910f8]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-0eb910f8]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-0eb910f8 .9s linear infinite}@keyframes output-spin-0eb910f8{to{transform:rotate(360deg)}}.output-dock-pending[data-v-0eb910f8]{display:inline-flex;align-items:center;flex:none;gap:3px}.output-dock-pending i[data-v-0eb910f8]{width:4px;height:4px;border-radius:50%;background:var(--text-3);animation:output-pending-0eb910f8 1.2s ease-in-out infinite}.output-dock-pending i[data-v-0eb910f8]:nth-child(2){animation-delay:.2s}.output-dock-pending i[data-v-0eb910f8]:nth-child(3){animation-delay:.4s}@keyframes output-pending-0eb910f8{0%,60%,to{opacity:.3}30%{opacity:1}}@media(prefers-reduced-motion:reduce){.output-dock-pending i[data-v-0eb910f8]{animation:none}}.output-dock-title[data-v-0eb910f8]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-0eb910f8]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-percent[data-v-0eb910f8]{flex:none;margin-right:6px;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-0eb910f8]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-0eb910f8]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-0eb910f8]{height:100%;transition:width .4s ease}.output-dock-reader[data-v-0eb910f8]{margin:6px 14px 6px 36px;padding:2px 8px;border:1px solid var(--border-2);border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;cursor:pointer}.output-dock-reader[data-v-0eb910f8]:hover{background:var(--hover)}.output-dock-loading[data-v-0eb910f8]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-0eb910f8]{animation:output-fade-0eb910f8 .22s var(--ease) .32s backwards}@keyframes output-fade-0eb910f8{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-0eb910f8]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-8c713a5e]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-8c713a5e]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-8c713a5e]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-8c713a5e]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-8c713a5e]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-393a83e0]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-393a83e0]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-393a83e0],.state.lost[data-v-393a83e0]{color:var(--red, #d4574b)}.line[data-v-393a83e0]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-393a83e0]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { computed as u, unref as e, ref as B, watch as H, openBlock as n, createElementBlock as p, createBlock as v, Teleport as S, createElementVNode as s, normalizeStyle as R, toDisplayString as f, createCommentVNode as g, createTextVNode as U, Fragment as Y, nextTick as Z } from "vue";
import { useWindow as tt, useDockCard as et, useOutputPages as at, useNow as ot, usePoll as nt, Icon as st, SkeletonLine as ut, afterSkeletonMinimum as rt } from "@journal/window-kit";
import { _ as lt } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const dt = {
  class: "output-dock",
  "data-output-dock": ""
}, it = ["data-state"], ct = {
  key: 0,
  class: "output-dock-ring"
}, pt = ["title"], vt = ["data-figure-bar", "data-figure-began"], gt = ["data-figure-progress"], _t = { "data-output-steps": "" }, ft = {
  key: 0,
  class: "output-dock-percent",
  "data-output-percent": ""
}, kt = {
  key: 1,
  class: "output-dock-figure"
}, mt = { class: "output-dock-more" }, ht = { class: "output-dock-inner" }, wt = 2e3, yt = 5e3, bt = 24, St = {
  __name: "OutputDock",
  setup(Nt) {
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
    }, j = {
      running: "running",
      background: "running",
      finished: "good",
      failed: "bad",
      stopped: "stopped",
      orphaned: "stopped"
    }, r = tt(), N = et(), k = r.option("row"), m = r.option("head"), h = r.option("foot"), $ = r.option("time"), z = r.option("folded"), W = r.option("collapsed"), o = N.data, w = at(
      N.readOutput,
      () => {
        var t;
        return (t = k.value) == null ? void 0 : t.target_id;
      }
    ), O = w.lines, D = u(() => !e(z)), d = B(null), M = B(!1), G = ot(), l = u(() => {
      var t;
      return j[(t = o.value) == null ? void 0 : t.state] ?? "running";
    }), E = () => l.value === "running", i = u(() => l.value !== "running"), x = u(() => {
      var t;
      return Number(((t = o.value) == null ? void 0 : t.progress) ?? 0) / 100;
    }), X = u(
      () => i.value ? "100%" : `${Math.round(x.value * 100)}%`
    ), q = u(
      () => {
        var t;
        return (t = o.value) != null && t.created_at ? Date.parse(o.value.created_at) / 1e3 : 0;
      }
    ), C = u(() => {
      var a;
      if (!e(W)) return "";
      if (i.value) return l.value === "good" ? "100%" : "";
      const t = Math.round(Number(((a = o.value) == null ? void 0 : a.progress) ?? 0));
      return t > 0 ? `${t}%` : "";
    }), I = u(() => {
      var t, a;
      return !((t = o.value) != null && t.steps_passed) && !((a = o.value) != null && a.steps_failed) ? "" : o.value.steps_failed ? `${o.value.steps_passed} passed, ${o.value.steps_failed} failed` : `${o.value.steps_passed} passed`;
    }), J = u(() => {
      var c;
      if (!((c = o.value) != null && c.created_at)) return "";
      const t = o.value.ended_at ? Date.parse(o.value.ended_at) : G.value, a = Math.max(
        0,
        Math.round((t - Date.parse(o.value.created_at)) / 1e3)
      );
      return a >= 60 ? `${Math.floor(a / 60)}m ${a % 60}s` : `${a}s`;
    });
    async function y() {
      var _;
      if (!((_ = k.value) == null ? void 0 : _.target_id) || (await N.reload(), !D.value)) return;
      const a = d.value, c = !a || a.scrollHeight - a.scrollTop - a.clientHeight < bt, b = performance.now();
      await w.follow(), rt(b, async () => {
        M.value = !0, await Z(), c && d.value && (d.value.scrollTop = d.value.scrollHeight), d.value && w.feed.drawn(d.value);
      });
    }
    H(D, (t) => t && y());
    function K() {
      var a;
      const t = (a = k.value) == null ? void 0 : a.target_id;
      r.run([
        "message",
        "send",
        `Output ${t} has no reader that gives its progress, and its box is empty: draw a reader for it with journal reader add.`,
        "--target-agent",
        String(o.value.agent_id)
      ]);
    }
    return H(i, (t) => t && y()), r.follow(
      ["process.*"],
      (t) => {
        var a;
        return t.row_id === ((a = k.value) == null ? void 0 : a.target_id) && y();
      }
    ), nt(
      y,
      E,
      () => D.value ? wt : yt
    ), (t, a) => {
      var c, b, _, T, P, F, A;
      return n(), p("div", dt, [
        ((c = e(m)) == null ? void 0 : c.value) ?? e(m) ? (n(), v(S, {
          key: 0,
          to: ((b = e(m)) == null ? void 0 : b.value) ?? e(m)
        }, [
          s("span", {
            class: "output-dock-state",
            "data-state": l.value,
            style: R({ "--tone": L[l.value] })
          }, [
            E() ? (n(), p("span", ct)) : (n(), v(e(st), {
              key: 1,
              name: V[l.value],
              size: 14
            }, null, 8, ["name"]))
          ], 12, it),
          s("span", {
            class: "output-dock-title",
            title: ((_ = e(o)) == null ? void 0 : _.title) || ((T = e(o)) == null ? void 0 : T.line)
          }, f(((P = e(o)) == null ? void 0 : P.title) || ((F = e(o)) == null ? void 0 : F.line)), 9, pt),
          x.value > 0 || i.value ? (n(), p("div", {
            key: 0,
            class: "output-dock-bar",
            "data-figure-bar": i.value ? l.value : "",
            "data-figure-began": q.value
          }, [
            s("div", {
              class: "output-dock-fill",
              style: R({ width: X.value, background: L[l.value] }),
              "data-figure-progress": i.value ? null : ""
            }, null, 12, gt)
          ], 8, vt)) : g("", !0)
        ], 8, ["to"])) : g("", !0),
        e(e(h)) && E() && !x.value && !I.value ? (n(), v(S, {
          key: 1,
          to: e(e(h))
        }, [
          a[1] || (a[1] = s("span", {
            class: "output-dock-pending",
            "data-output-pending": "",
            "aria-label": "Pending"
          }, [
            s("i"),
            s("i"),
            s("i")
          ], -1))
        ], 8, ["to"])) : g("", !0),
        e(e(h)) && I.value ? (n(), v(S, {
          key: 2,
          to: e(e(h))
        }, [
          s("span", _t, [
            a[2] || (a[2] = U("Steps: ", -1)),
            s("b", null, f(I.value), 1)
          ])
        ], 8, ["to"])) : g("", !0),
        e(e($)) ? (n(), v(S, {
          key: 3,
          to: e(e($))
        }, [
          C.value ? (n(), p("span", ft, f(C.value), 1)) : (n(), p("span", kt, f(J.value), 1))
        ], 8, ["to"])) : g("", !0),
        s("div", mt, [
          s("div", ht, [
            M.value ? (n(), p(Y, { key: 1 }, [
              s("pre", {
                ref_key: "terminal",
                ref: d,
                class: "output-dock-terminal",
                "data-output-terminal": "",
                onScroll: a[0] || (a[0] = (Q) => e(w).loadEarlier(Q.target))
              }, f(e(O).length ? e(O).join(`
`) : "No output yet"), 545),
              !e(O).length && !((A = e(o)) != null && A.reads_progress) && !i.value ? (n(), p("button", {
                key: 0,
                type: "button",
                class: "output-dock-reader",
                "data-output-reader-ask": "",
                onClick: K
              }, " Ask the agent to draw a reader ")) : g("", !0)
            ], 64)) : (n(), v(e(ut), {
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
}, xt = /* @__PURE__ */ lt(St, [["__scopeId", "data-v-0eb910f8"]]);
export {
  xt as default
};
