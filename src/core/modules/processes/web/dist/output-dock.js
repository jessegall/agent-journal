/* @code-commandments-generated */
if (!document.getElementById("window-styles-fc33da3f0cfc")) { const style = document.createElement("style"); style.id = "window-styles-fc33da3f0cfc"; style.textContent = ".output-dock-inner[data-v-4818e320]{min-height:0;overflow:hidden}.output-dock-state[data-v-4818e320]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-4818e320]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-4818e320 .9s linear infinite}@keyframes output-spin-4818e320{to{transform:rotate(360deg)}}.output-dock-pending[data-v-4818e320]{display:inline-flex;align-items:center;flex:none;gap:3px}.output-dock-pending i[data-v-4818e320]{width:4px;height:4px;border-radius:50%;background:var(--text-3);animation:output-pending-4818e320 1.2s ease-in-out infinite}.output-dock-pending i[data-v-4818e320]:nth-child(2){animation-delay:.2s}.output-dock-pending i[data-v-4818e320]:nth-child(3){animation-delay:.4s}@keyframes output-pending-4818e320{0%,60%,to{opacity:.3}30%{opacity:1}}@media(prefers-reduced-motion:reduce){.output-dock-pending i[data-v-4818e320]{animation:none}}.output-dock-title[data-v-4818e320]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-4818e320]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-percent[data-v-4818e320]{flex:none;margin-right:6px;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-4818e320]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-4818e320]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-4818e320]{height:100%;transition:width .4s ease}.output-dock-box[data-v-4818e320]{position:relative}.output-dock-reader[data-v-4818e320]{position:absolute;top:6px;right:14px;padding:2px 8px;border:1px solid var(--border-2);border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;cursor:pointer}.output-dock-reader[data-v-4818e320]:hover{background:var(--hover)}.output-dock-loading[data-v-4818e320]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-4818e320]{animation:output-fade-4818e320 .22s var(--ease) .32s backwards}@keyframes output-fade-4818e320{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-4818e320]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-8c713a5e]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-8c713a5e]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-8c713a5e]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-8c713a5e]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-8c713a5e]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-393a83e0]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-393a83e0]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-393a83e0],.state.lost[data-v-393a83e0]{color:var(--red, #d4574b)}.line[data-v-393a83e0]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-393a83e0]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { computed as u, unref as o, ref as L, watch as H, openBlock as s, createElementBlock as p, createBlock as v, Teleport as m, createElementVNode as n, normalizeStyle as V, toDisplayString as f, createCommentVNode as g, createTextVNode as z, nextTick as ee } from "vue";
import { useWindow as te, useDockCard as oe, useOutputPages as ae, useNow as se, usePoll as ne, Icon as ue, SkeletonLine as re, afterSkeletonMinimum as le } from "@journal/window-kit";
import { _ as de } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const ie = {
  class: "output-dock",
  "data-output-dock": ""
}, ce = ["data-state"], pe = {
  key: 0,
  class: "output-dock-ring"
}, ve = ["title"], ge = ["data-figure-bar", "data-figure-began"], _e = ["data-figure-progress"], fe = { "data-output-steps": "" }, ke = { "data-output-progress": "" }, me = {
  key: 0,
  class: "output-dock-percent",
  "data-output-percent": ""
}, he = {
  key: 1,
  class: "output-dock-figure"
}, ye = { class: "output-dock-more" }, be = { class: "output-dock-inner" }, we = {
  key: 1,
  class: "output-dock-box"
}, Se = 2e3, Ne = 5e3, De = 24, Oe = {
  __name: "OutputDock",
  setup(xe) {
    const M = {
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
    }, r = te(), D = oe(), h = r.option("row"), y = r.option("head"), _ = r.option("foot"), $ = r.option("time"), q = r.option("folded"), G = r.option("collapsed"), a = D.data, b = ae(
      D.readOutput,
      () => {
        var e;
        return (e = h.value) == null ? void 0 : e.target_id;
      }
    ), O = b.lines, x = u(() => !o(q)), i = L(null), T = L(!1), X = se(), l = u(() => {
      var e;
      return j[(e = a.value) == null ? void 0 : e.state] ?? "running";
    }), E = () => l.value === "running", d = u(() => l.value !== "running"), I = u(() => {
      var e;
      return Number(((e = a.value) == null ? void 0 : e.progress) ?? 0) / 100;
    }), J = u(
      () => d.value ? "100%" : `${Math.round(I.value * 100)}%`
    ), K = u(
      () => {
        var e;
        return (e = a.value) != null && e.created_at ? Date.parse(a.value.created_at) / 1e3 : 0;
      }
    ), C = u(() => {
      var t;
      if (!o(G)) return "";
      if (d.value) return l.value === "good" ? "100%" : "";
      const e = Math.round(Number(((t = a.value) == null ? void 0 : t.progress) ?? 0));
      return e > 0 ? `${e}%` : "";
    }), w = u(() => {
      var e, t;
      return !((e = a.value) != null && e.steps_passed) && !((t = a.value) != null && t.steps_failed) ? "" : a.value.steps_failed ? `${a.value.steps_passed} passed, ${a.value.steps_failed} failed` : `${a.value.steps_passed} passed`;
    }), P = u(() => {
      var t;
      if (w.value || d.value) return "";
      const e = Math.round(Number(((t = a.value) == null ? void 0 : t.progress) ?? 0));
      return e > 0 ? `${e}%` : "";
    }), Q = u(() => {
      var c;
      if (!((c = a.value) != null && c.created_at)) return "";
      const e = a.value.ended_at ? Date.parse(a.value.ended_at) : X.value, t = Math.max(
        0,
        Math.round((e - Date.parse(a.value.created_at)) / 1e3)
      );
      return t >= 60 ? `${Math.floor(t / 60)}m ${t % 60}s` : `${t}s`;
    });
    async function S() {
      var k;
      if (!((k = h.value) == null ? void 0 : k.target_id) || (await D.reload(), !x.value)) return;
      const t = i.value, c = !t || t.scrollHeight - t.scrollTop - t.clientHeight < De, N = performance.now();
      await b.follow(), le(N, async () => {
        T.value = !0, await ee(), c && i.value && (i.value.scrollTop = i.value.scrollHeight), i.value && b.feed.drawn(i.value);
      });
    }
    H(x, (e) => e && S());
    const A = L(!1);
    async function U() {
      var t;
      const e = await r.run(["output", "ask-reader", String((t = h.value) == null ? void 0 : t.target_id)]);
      (e == null ? void 0 : e.ok) !== !1 && (A.value = !0);
    }
    const Y = u(() => {
      var e, t;
      return !A.value && !((e = a.value) != null && e.reader_requested) && !((t = a.value) != null && t.reads_progress) && !d.value;
    });
    return H(d, (e) => e && S()), r.follow(
      ["process.*"],
      (e) => {
        var t;
        return e.row_id === ((t = h.value) == null ? void 0 : t.target_id) && S();
      }
    ), ne(
      S,
      E,
      () => x.value ? Se : Ne
    ), (e, t) => {
      var c, N, k, F, R, B;
      return s(), p("div", ie, [
        ((c = o(y)) == null ? void 0 : c.value) ?? o(y) ? (s(), v(m, {
          key: 0,
          to: ((N = o(y)) == null ? void 0 : N.value) ?? o(y)
        }, [
          n("span", {
            class: "output-dock-state",
            "data-state": l.value,
            style: V({ "--tone": M[l.value] })
          }, [
            E() ? (s(), p("span", pe)) : (s(), v(o(ue), {
              key: 1,
              name: W[l.value],
              size: 14
            }, null, 8, ["name"]))
          ], 12, ce),
          n("span", {
            class: "output-dock-title",
            title: ((k = o(a)) == null ? void 0 : k.title) || ((F = o(a)) == null ? void 0 : F.line)
          }, f(((R = o(a)) == null ? void 0 : R.title) || ((B = o(a)) == null ? void 0 : B.line)), 9, ve),
          I.value > 0 || d.value ? (s(), p("div", {
            key: 0,
            class: "output-dock-bar",
            "data-figure-bar": d.value ? l.value : "",
            "data-figure-began": K.value
          }, [
            n("div", {
              class: "output-dock-fill",
              style: V({ width: J.value, background: M[l.value] }),
              "data-figure-progress": d.value ? null : ""
            }, null, 12, _e)
          ], 8, ge)) : g("", !0)
        ], 8, ["to"])) : g("", !0),
        o(o(_)) && E() && !I.value && !w.value ? (s(), v(m, {
          key: 1,
          to: o(o(_))
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
        o(o(_)) && w.value ? (s(), v(m, {
          key: 2,
          to: o(o(_))
        }, [
          n("span", fe, [
            t[2] || (t[2] = z("Steps: ", -1)),
            n("b", null, f(w.value), 1)
          ])
        ], 8, ["to"])) : g("", !0),
        o(o(_)) && P.value ? (s(), v(m, {
          key: 3,
          to: o(o(_))
        }, [
          n("span", ke, [
            t[3] || (t[3] = z("Progress: ", -1)),
            n("b", null, f(P.value), 1)
          ])
        ], 8, ["to"])) : g("", !0),
        o(o($)) ? (s(), v(m, {
          key: 4,
          to: o(o($))
        }, [
          C.value ? (s(), p("span", me, f(C.value), 1)) : (s(), p("span", he, f(Q.value), 1))
        ], 8, ["to"])) : g("", !0),
        n("div", ye, [
          n("div", be, [
            T.value ? (s(), p("div", we, [
              n("pre", {
                ref_key: "terminal",
                ref: i,
                class: "output-dock-terminal",
                "data-output-terminal": "",
                onScroll: t[0] || (t[0] = (Z) => o(b).loadEarlier(Z.target))
              }, f(o(O).length ? o(O).join(`
`) : "No output yet"), 545),
              !o(O).length && Y.value ? (s(), p("button", {
                key: 0,
                type: "button",
                class: "output-dock-reader",
                "data-output-reader-ask": "",
                onClick: U
              }, " Ask the agent to draw a reader ")) : g("", !0)
            ])) : (s(), v(o(re), {
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
}, Me = /* @__PURE__ */ de(Oe, [["__scopeId", "data-v-4818e320"]]);
export {
  Me as default
};
