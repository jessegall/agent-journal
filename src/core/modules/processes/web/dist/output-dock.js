if (!document.getElementById("window-styles-60a1145235f8")) { const style = document.createElement("style"); style.id = "window-styles-60a1145235f8"; style.textContent = ".output-dock-inner[data-v-2f29b64f]{min-height:0;overflow:hidden}.output-dock-state[data-v-2f29b64f]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-2f29b64f]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-2f29b64f .9s linear infinite}@keyframes output-spin-2f29b64f{to{transform:rotate(360deg)}}.output-dock-pending[data-v-2f29b64f]{display:inline-flex;align-items:center;flex:none;gap:3px}.output-dock-pending i[data-v-2f29b64f]{width:4px;height:4px;border-radius:50%;background:var(--text-3);animation:output-pending-2f29b64f 1.2s ease-in-out infinite}.output-dock-pending i[data-v-2f29b64f]:nth-child(2){animation-delay:.2s}.output-dock-pending i[data-v-2f29b64f]:nth-child(3){animation-delay:.4s}@keyframes output-pending-2f29b64f{0%,60%,to{opacity:.3}30%{opacity:1}}@media(prefers-reduced-motion:reduce){.output-dock-pending i[data-v-2f29b64f]{animation:none}}.output-dock-title[data-v-2f29b64f]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-2f29b64f]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-percent[data-v-2f29b64f]{flex:none;align-self:center;width:32px;height:4px;margin-right:6px;overflow:hidden;border-radius:2px;background:var(--hover)}.output-dock-percent i[data-v-2f29b64f]{display:block;height:100%}.output-dock-terminal[data-v-2f29b64f]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-2f29b64f]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-2f29b64f]{height:100%;transition:width .4s ease}.output-dock-box[data-v-2f29b64f]{position:relative}.output-dock-reader[data-v-2f29b64f]{position:absolute;top:6px;right:14px;padding:2px 8px;border:1px solid var(--border-2);border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;cursor:pointer}.output-dock-reader[data-v-2f29b64f]:hover{background:var(--hover)}.output-dock-loading[data-v-2f29b64f]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-2f29b64f]{animation:output-fade-2f29b64f .22s var(--ease) .32s backwards}@keyframes output-fade-2f29b64f{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-2f29b64f]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-8c713a5e]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-8c713a5e]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-8c713a5e]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-8c713a5e]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-8c713a5e]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-393a83e0]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-393a83e0]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-393a83e0],.state.lost[data-v-393a83e0]{color:var(--red, #d4574b)}.line[data-v-393a83e0]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-393a83e0]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { computed as u, unref as a, ref as $, watch as V, openBlock as n, createElementBlock as p, createBlock as v, Teleport as k, createElementVNode as s, normalizeStyle as T, toDisplayString as m, createCommentVNode as g, createTextVNode as z, nextTick as ee } from "vue";
import { useWindow as te, useDockCard as ae, useOutputPages as oe, useNow as se, usePoll as ne, Icon as ue, SkeletonLine as re, afterSkeletonMinimum as le } from "@journal/window-kit";
import { _ as de } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const ie = {
  class: "output-dock",
  "data-output-dock": ""
}, ce = ["data-state"], pe = {
  key: 0,
  class: "output-dock-ring"
}, ve = ["title"], ge = ["data-figure-bar", "data-figure-began"], _e = ["data-figure-progress"], fe = { "data-output-steps": "" }, ke = { "data-output-progress": "" }, me = ["title", "aria-label"], he = {
  key: 1,
  class: "output-dock-figure"
}, be = { class: "output-dock-more" }, ye = { class: "output-dock-inner" }, we = {
  key: 1,
  class: "output-dock-box"
}, Se = 2e3, Ne = 5e3, De = 24, Oe = {
  __name: "OutputDock",
  setup(xe) {
    const O = {
      running: "var(--tone-work)",
      good: "var(--tone-good)",
      bad: "var(--danger)",
      stopped: "var(--text-3)"
    }, W = {
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
    }, r = te(), x = ae(), h = r.option("row"), b = r.option("head"), _ = r.option("foot"), C = r.option("time"), q = r.option("folded"), G = r.option("collapsed"), o = x.data, y = oe(
      x.readOutput,
      () => {
        var e;
        return (e = h.value) == null ? void 0 : e.target_id;
      }
    ), E = y.lines, I = u(() => !a(q)), i = $(null), P = $(!1), X = se(), l = u(() => {
      var e;
      return j[(e = o.value) == null ? void 0 : e.state] ?? "running";
    }), L = () => l.value === "running", d = u(() => l.value !== "running"), M = u(() => {
      var e;
      return Number(((e = o.value) == null ? void 0 : e.progress) ?? 0) / 100;
    }), J = u(
      () => d.value ? "100%" : `${Math.round(M.value * 100)}%`
    ), K = u(
      () => {
        var e;
        return (e = o.value) != null && e.created_at ? Date.parse(o.value.created_at) / 1e3 : 0;
      }
    ), w = u(() => {
      var t;
      if (!a(G)) return "";
      if (d.value) return l.value === "good" ? "100%" : "";
      const e = Math.round(Number(((t = o.value) == null ? void 0 : t.progress) ?? 0));
      return e > 0 ? `${e}%` : "";
    }), S = u(() => {
      var e, t;
      return !((e = o.value) != null && e.steps_passed) && !((t = o.value) != null && t.steps_failed) ? "" : o.value.steps_failed ? `${o.value.steps_passed} passed, ${o.value.steps_failed} failed` : `${o.value.steps_passed} passed`;
    }), A = u(() => {
      var t;
      if (S.value || d.value) return "";
      const e = Math.round(Number(((t = o.value) == null ? void 0 : t.progress) ?? 0));
      return e > 0 ? `${e}%` : "";
    }), Q = u(() => {
      var c;
      if (!((c = o.value) != null && c.created_at)) return "";
      const e = o.value.ended_at ? Date.parse(o.value.ended_at) : X.value, t = Math.max(
        0,
        Math.round((e - Date.parse(o.value.created_at)) / 1e3)
      );
      return t >= 60 ? `${Math.floor(t / 60)}m ${t % 60}s` : `${t}s`;
    });
    async function N() {
      var f;
      if (!((f = h.value) == null ? void 0 : f.target_id) || (await x.reload(), !I.value)) return;
      const t = i.value, c = !t || t.scrollHeight - t.scrollTop - t.clientHeight < De, D = performance.now();
      await y.follow(), le(D, async () => {
        P.value = !0, await ee(), c && i.value && (i.value.scrollTop = i.value.scrollHeight), i.value && y.feed.drawn(i.value);
      });
    }
    V(I, (e) => e && N());
    const F = $(!1);
    async function U() {
      var t;
      const e = await r.run(["output", "ask-reader", String((t = h.value) == null ? void 0 : t.target_id)]);
      (e == null ? void 0 : e.ok) !== !1 && (F.value = !0);
    }
    const Y = u(() => {
      var e, t;
      return !F.value && !((e = o.value) != null && e.reader_requested) && !((t = o.value) != null && t.reads_progress) && !d.value;
    });
    return V(d, (e) => e && N()), r.follow(
      ["process.*"],
      (e) => {
        var t;
        return e.row_id === ((t = h.value) == null ? void 0 : t.target_id) && N();
      }
    ), ne(
      N,
      L,
      () => I.value ? Se : Ne
    ), (e, t) => {
      var c, D, f, R, B, H;
      return n(), p("div", ie, [
        ((c = a(b)) == null ? void 0 : c.value) ?? a(b) ? (n(), v(k, {
          key: 0,
          to: ((D = a(b)) == null ? void 0 : D.value) ?? a(b)
        }, [
          s("span", {
            class: "output-dock-state",
            "data-state": l.value,
            style: T({ "--tone": O[l.value] })
          }, [
            L() ? (n(), p("span", pe)) : (n(), v(a(ue), {
              key: 1,
              name: W[l.value],
              size: 14
            }, null, 8, ["name"]))
          ], 12, ce),
          s("span", {
            class: "output-dock-title",
            title: ((f = a(o)) == null ? void 0 : f.title) || ((R = a(o)) == null ? void 0 : R.line)
          }, m(((B = a(o)) == null ? void 0 : B.title) || ((H = a(o)) == null ? void 0 : H.line)), 9, ve),
          M.value > 0 || d.value ? (n(), p("div", {
            key: 0,
            class: "output-dock-bar",
            "data-figure-bar": d.value ? l.value : "",
            "data-figure-began": K.value
          }, [
            s("div", {
              class: "output-dock-fill",
              style: T({ width: J.value, background: O[l.value] }),
              "data-figure-progress": d.value ? null : ""
            }, null, 12, _e)
          ], 8, ge)) : g("", !0)
        ], 8, ["to"])) : g("", !0),
        a(a(_)) && L() && !M.value && !S.value ? (n(), v(k, {
          key: 1,
          to: a(a(_))
        }, [
          t[1] || (t[1] = s("span", {
            class: "output-dock-pending",
            "data-output-pending": "",
            "aria-label": "Pending"
          }, [
            s("i"),
            s("i"),
            s("i")
          ], -1))
        ], 8, ["to"])) : g("", !0),
        a(a(_)) && S.value ? (n(), v(k, {
          key: 2,
          to: a(a(_))
        }, [
          s("span", fe, [
            t[2] || (t[2] = z("Steps: ", -1)),
            s("b", null, m(S.value), 1)
          ])
        ], 8, ["to"])) : g("", !0),
        a(a(_)) && A.value ? (n(), v(k, {
          key: 3,
          to: a(a(_))
        }, [
          s("span", ke, [
            t[3] || (t[3] = z("Progress: ", -1)),
            s("b", null, m(A.value), 1)
          ])
        ], 8, ["to"])) : g("", !0),
        a(a(C)) ? (n(), v(k, {
          key: 4,
          to: a(a(C))
        }, [
          w.value ? (n(), p("span", {
            key: 0,
            class: "output-dock-percent",
            "data-output-percent": "",
            role: "img",
            title: w.value,
            "aria-label": w.value
          }, [
            s("i", {
              style: T({ width: w.value, background: O.running })
            }, null, 4)
          ], 8, me)) : (n(), p("span", he, m(Q.value), 1))
        ], 8, ["to"])) : g("", !0),
        s("div", be, [
          s("div", ye, [
            P.value ? (n(), p("div", we, [
              s("pre", {
                ref_key: "terminal",
                ref: i,
                class: "output-dock-terminal",
                "data-output-terminal": "",
                onScroll: t[0] || (t[0] = (Z) => a(y).loadEarlier(Z.target))
              }, m(a(E).length ? a(E).join(`
`) : "No output yet"), 545),
              !a(E).length && Y.value ? (n(), p("button", {
                key: 0,
                type: "button",
                class: "output-dock-reader",
                "data-output-reader-ask": "",
                onClick: U
              }, " Ask the agent to draw a reader ")) : g("", !0)
            ])) : (n(), v(a(re), {
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
}, Me = /* @__PURE__ */ de(Oe, [["__scopeId", "data-v-2f29b64f"]]);
export {
  Me as default
};
