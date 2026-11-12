if (!document.getElementById("window-styles-17f7eaf12f94")) { const style = document.createElement("style"); style.id = "window-styles-17f7eaf12f94"; style.textContent = ".output-dock-inner[data-v-022ad4ba]{min-height:0;overflow:hidden}.output-dock-state[data-v-022ad4ba]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-022ad4ba]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-022ad4ba .9s linear infinite}@keyframes output-spin-022ad4ba{to{transform:rotate(360deg)}}.output-dock-pending[data-v-022ad4ba]{display:inline-flex;align-items:center;flex:none;gap:3px}.output-dock-pending i[data-v-022ad4ba]{width:4px;height:4px;border-radius:50%;background:var(--text-3);animation:output-pending-022ad4ba 1.2s ease-in-out infinite}.output-dock-pending i[data-v-022ad4ba]:nth-child(2){animation-delay:.2s}.output-dock-pending i[data-v-022ad4ba]:nth-child(3){animation-delay:.4s}@keyframes output-pending-022ad4ba{0%,60%,to{opacity:.3}30%{opacity:1}}@media(prefers-reduced-motion:reduce){.output-dock-pending i[data-v-022ad4ba]{animation:none}}.output-dock-title[data-v-022ad4ba]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-022ad4ba]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-percent[data-v-022ad4ba]{flex:none;align-self:center;width:32px;height:4px;margin-right:6px;overflow:hidden;border-radius:2px;background:var(--hover)}.output-dock-percent i[data-v-022ad4ba]{display:block;height:100%}.output-dock-terminal[data-v-022ad4ba]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-022ad4ba]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-022ad4ba]{height:100%;transition:width .4s ease}.output-dock-box[data-v-022ad4ba]{position:relative}.output-dock-reader[data-v-022ad4ba]{position:absolute;top:6px;right:14px;padding:2px 8px;border:1px solid var(--border-2);border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;cursor:pointer}.output-dock-reader[data-v-022ad4ba]:hover{background:var(--hover)}.output-dock-marks[data-v-022ad4ba]{margin:4px 14px}.output-dock-mark[data-v-022ad4ba]{padding:2px 8px;border:1px solid var(--border-2);border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;cursor:pointer}.output-dock-mark[data-v-022ad4ba]:hover{background:var(--hover)}.output-dock-loading[data-v-022ad4ba]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-022ad4ba]{animation:output-fade-022ad4ba .22s var(--ease) .32s backwards}@keyframes output-fade-022ad4ba{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-022ad4ba]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-6f238ea7]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-6f238ea7]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-6f238ea7]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-6f238ea7]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-6f238ea7]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-05ffe401]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-05ffe401]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-05ffe401],.state.lost[data-v-05ffe401]{color:var(--red, #d4574b)}.line[data-v-05ffe401]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.marks[data-v-05ffe401]{padding:8px 12px;font-size:12px}.marks h3[data-v-05ffe401]{margin:0 0 4px;font-size:12px;color:var(--text-2)}.mark[data-v-05ffe401]{display:flex;gap:8px;margin:2px 0}.why[data-v-05ffe401],.who[data-v-05ffe401],.note[data-v-05ffe401]{flex:none;color:var(--text-3)}button[data-v-05ffe401]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { computed as u, unref as a, ref as L, watch as q, openBlock as n, createElementBlock as r, createBlock as k, Teleport as y, createElementVNode as s, normalizeStyle as T, toDisplayString as _, createCommentVNode as i, createTextVNode as G, nextTick as ot } from "vue";
import { useWindow as nt, useDockCard as st, useOutputPages as ut, useNow as rt, usePoll as lt, Icon as dt, SkeletonLine as it, afterSkeletonMinimum as ct } from "@journal/window-kit";
import { _ as pt } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const vt = {
  class: "output-dock",
  "data-output-dock": ""
}, kt = ["data-state"], gt = {
  key: 0,
  class: "output-dock-ring"
}, _t = ["title"], ft = ["data-figure-bar", "data-figure-began"], mt = ["data-figure-progress"], bt = { "data-output-steps": "" }, yt = { "data-output-progress": "" }, ht = ["title", "aria-label"], wt = {
  key: 1,
  class: "output-dock-figure"
}, St = { class: "output-dock-more" }, Nt = { class: "output-dock-inner" }, xt = {
  key: 1,
  class: "output-dock-box"
}, Dt = {
  key: 0,
  class: "output-dock-reading",
  "data-output-reading": ""
}, Ot = {
  key: 1,
  class: "output-dock-marks"
}, Mt = 2e3, $t = 5e3, Et = 24, Ct = {
  __name: "OutputDock",
  setup(It) {
    const D = {
      running: "var(--tone-work)",
      good: "var(--tone-good)",
      bad: "var(--danger)",
      stopped: "var(--text-3)"
    }, X = {
      running: "terminal",
      good: "tick",
      bad: "cross",
      stopped: "stop"
    }, J = {
      running: "running",
      background: "running",
      finished: "good",
      failed: "bad",
      stopped: "stopped",
      orphaned: "stopped"
    }, d = nt(), O = st(), f = d.option("row"), h = d.option("head"), g = d.option("foot"), P = d.option("time"), K = d.option("folded"), Q = d.option("collapsed"), o = O.data, w = ut(
      O.readOutput,
      () => {
        var e;
        return (e = f.value) == null ? void 0 : e.target_id;
      }
    ), M = w.lines, $ = u(() => !a(K)), v = L(null), R = L(!1), U = rt(), c = u(() => {
      var e;
      return J[(e = o.value) == null ? void 0 : e.state] ?? "running";
    }), E = () => c.value === "running", p = u(() => c.value !== "running"), C = u(() => {
      var e;
      return Number(((e = o.value) == null ? void 0 : e.progress) ?? 0) / 100;
    }), Y = u(
      () => p.value ? "100%" : `${Math.round(C.value * 100)}%`
    ), Z = u(
      () => {
        var e;
        return (e = o.value) != null && e.created_at ? Date.parse(o.value.created_at) / 1e3 : 0;
      }
    ), S = u(() => {
      var t;
      if (!a(Q)) return "";
      if (p.value) return c.value === "good" ? "100%" : "";
      const e = Math.round(Number(((t = o.value) == null ? void 0 : t.progress) ?? 0));
      return e > 0 ? `${e}%` : "";
    }), N = u(() => {
      var e, t;
      return !((e = o.value) != null && e.steps_passed) && !((t = o.value) != null && t.steps_failed) ? "" : o.value.steps_failed ? `${o.value.steps_passed} passed, ${o.value.steps_failed} failed` : `${o.value.steps_passed} passed`;
    }), A = u(() => {
      var t;
      if (N.value || p.value) return "";
      const e = Math.round(Number(((t = o.value) == null ? void 0 : t.progress) ?? 0));
      return e > 0 ? `${e}%` : "";
    }), tt = u(() => {
      var l;
      if (!((l = o.value) != null && l.created_at)) return "";
      const e = o.value.ended_at ? Date.parse(o.value.ended_at) : U.value, t = Math.max(
        0,
        Math.round((e - Date.parse(o.value.created_at)) / 1e3)
      );
      return t >= 60 ? `${Math.floor(t / 60)}m ${t % 60}s` : `${t}s`;
    });
    async function m() {
      var b;
      if (!((b = f.value) == null ? void 0 : b.target_id) || (await O.reload(), !$.value)) return;
      const t = v.value, l = !t || t.scrollHeight - t.scrollTop - t.clientHeight < Et, x = performance.now();
      await w.follow(), ct(x, async () => {
        R.value = !0, await ot(), l && v.value && (v.value.scrollTop = v.value.scrollHeight), v.value && w.feed.drawn(v.value);
      });
    }
    q($, (e) => e && m());
    const F = L(!1);
    async function et() {
      var t;
      const e = await d.run(["output", "ask-reader", String((t = f.value) == null ? void 0 : t.target_id)]);
      (e == null ? void 0 : e.ok) !== !1 && (F.value = !0);
    }
    const at = u(() => {
      var e, t;
      return !F.value && !((e = o.value) != null && e.reader_requested) && !((t = o.value) != null && t.reads_progress) && !p.value;
    });
    async function B(e) {
      var l;
      const t = await d.run(["output", e, String((l = f.value) == null ? void 0 : l.target_id)]);
      (t == null ? void 0 : t.ok) !== !1 && m();
    }
    return q(p, (e) => e && m()), d.follow(
      ["process.*"],
      (e) => {
        var t;
        return e.row_id === ((t = f.value) == null ? void 0 : t.target_id) && m();
      }
    ), lt(
      m,
      E,
      () => $.value ? Mt : $t
    ), (e, t) => {
      var l, x, b, H, V, z, W, j;
      return n(), r("div", vt, [
        ((l = a(h)) == null ? void 0 : l.value) ?? a(h) ? (n(), k(y, {
          key: 0,
          to: ((x = a(h)) == null ? void 0 : x.value) ?? a(h)
        }, [
          s("span", {
            class: "output-dock-state",
            "data-state": c.value,
            style: T({ "--tone": D[c.value] })
          }, [
            E() ? (n(), r("span", gt)) : (n(), k(a(dt), {
              key: 1,
              name: X[c.value],
              size: 14
            }, null, 8, ["name"]))
          ], 12, kt),
          s("span", {
            class: "output-dock-title",
            title: ((b = a(o)) == null ? void 0 : b.title) || ((H = a(o)) == null ? void 0 : H.line)
          }, _(((V = a(o)) == null ? void 0 : V.title) || ((z = a(o)) == null ? void 0 : z.line)), 9, _t),
          C.value > 0 || p.value ? (n(), r("div", {
            key: 0,
            class: "output-dock-bar",
            "data-figure-bar": p.value ? c.value : "",
            "data-figure-began": Z.value
          }, [
            s("div", {
              class: "output-dock-fill",
              style: T({ width: Y.value, background: D[c.value] }),
              "data-figure-progress": p.value ? null : ""
            }, null, 12, mt)
          ], 8, ft)) : i("", !0)
        ], 8, ["to"])) : i("", !0),
        a(a(g)) && E() && !C.value && !N.value ? (n(), k(y, {
          key: 1,
          to: a(a(g))
        }, [
          t[3] || (t[3] = s("span", {
            class: "output-dock-pending",
            "data-output-pending": "",
            "aria-label": "Pending"
          }, [
            s("i"),
            s("i"),
            s("i")
          ], -1))
        ], 8, ["to"])) : i("", !0),
        a(a(g)) && N.value ? (n(), k(y, {
          key: 2,
          to: a(a(g))
        }, [
          s("span", bt, [
            t[4] || (t[4] = G("Steps: ", -1)),
            s("b", null, _(N.value), 1)
          ])
        ], 8, ["to"])) : i("", !0),
        a(a(g)) && A.value ? (n(), k(y, {
          key: 3,
          to: a(a(g))
        }, [
          s("span", yt, [
            t[5] || (t[5] = G("Progress: ", -1)),
            s("b", null, _(A.value), 1)
          ])
        ], 8, ["to"])) : i("", !0),
        a(a(P)) ? (n(), k(y, {
          key: 4,
          to: a(a(P))
        }, [
          S.value ? (n(), r("span", {
            key: 0,
            class: "output-dock-percent",
            "data-output-percent": "",
            role: "img",
            title: S.value,
            "aria-label": S.value
          }, [
            s("i", {
              style: T({ width: S.value, background: D.running })
            }, null, 4)
          ], 8, ht)) : (n(), r("span", wt, _(tt.value), 1))
        ], 8, ["to"])) : i("", !0),
        s("div", St, [
          s("div", Nt, [
            R.value ? (n(), r("div", xt, [
              s("pre", {
                ref_key: "terminal",
                ref: v,
                class: "output-dock-terminal",
                "data-output-terminal": "",
                onScroll: t[0] || (t[0] = (I) => a(w).loadEarlier(I.target))
              }, _(a(M).length ? a(M).join(`
`) : "No output yet"), 545),
              (W = a(o)) != null && W.reading_text ? (n(), r("p", Dt, _(a(o).reading_text), 1)) : i("", !0),
              (j = a(o)) != null && j.markable ? (n(), r("p", Ot, [
                a(o).marked_words ? (n(), r("button", {
                  key: 0,
                  type: "button",
                  class: "output-dock-mark",
                  "data-output-mark-readable": "",
                  onClick: t[1] || (t[1] = (I) => B("readable"))
                }, "Mark as readable")) : (n(), r("button", {
                  key: 1,
                  type: "button",
                  class: "output-dock-mark",
                  "data-output-mark-unreadable": "",
                  onClick: t[2] || (t[2] = (I) => B("unreadable"))
                }, "Mark as not readable"))
              ])) : i("", !0),
              !a(M).length && at.value ? (n(), r("button", {
                key: 2,
                type: "button",
                class: "output-dock-reader",
                "data-output-reader-ask": "",
                onClick: et
              }, " Ask the agent to draw a reader ")) : i("", !0)
            ])) : (n(), k(a(it), {
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
}, Rt = /* @__PURE__ */ pt(Ct, [["__scopeId", "data-v-022ad4ba"]]);
export {
  Rt as default
};
