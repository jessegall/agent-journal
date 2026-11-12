if (!document.getElementById("window-styles-c2c10a552a8e")) { const style = document.createElement("style"); style.id = "window-styles-c2c10a552a8e"; style.textContent = ".output-dock-inner[data-v-3b67cdee]{min-height:0;overflow:hidden}.output-dock-state[data-v-3b67cdee]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-3b67cdee]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-3b67cdee .9s linear infinite}@keyframes output-spin-3b67cdee{to{transform:rotate(360deg)}}.output-dock-pending[data-v-3b67cdee]{display:inline-flex;align-items:center;flex:none;gap:3px}.output-dock-pending i[data-v-3b67cdee]{width:4px;height:4px;border-radius:50%;background:var(--text-3);animation:output-pending-3b67cdee 1.2s ease-in-out infinite}.output-dock-pending i[data-v-3b67cdee]:nth-child(2){animation-delay:.2s}.output-dock-pending i[data-v-3b67cdee]:nth-child(3){animation-delay:.4s}@keyframes output-pending-3b67cdee{0%,60%,to{opacity:.3}30%{opacity:1}}@media(prefers-reduced-motion:reduce){.output-dock-pending i[data-v-3b67cdee]{animation:none}}.output-dock-title[data-v-3b67cdee]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-3b67cdee]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-percent[data-v-3b67cdee]{flex:none;align-self:center;width:32px;height:4px;margin-right:6px;overflow:hidden;border-radius:2px;background:var(--hover)}.output-dock-percent i[data-v-3b67cdee]{display:block;height:100%}.output-dock-terminal[data-v-3b67cdee]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-3b67cdee]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-3b67cdee]{height:100%;transition:width .4s ease}.output-dock-box[data-v-3b67cdee]{position:relative}.output-dock-reader[data-v-3b67cdee]{position:absolute;top:6px;right:14px;padding:2px 8px;border:1px solid var(--border-2);border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;cursor:pointer}.output-dock-reader[data-v-3b67cdee]:hover{background:var(--hover)}.output-dock-loading[data-v-3b67cdee]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-3b67cdee]{animation:output-fade-3b67cdee .22s var(--ease) .32s backwards}@keyframes output-fade-3b67cdee{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-3b67cdee]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-6f238ea7]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-6f238ea7]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-6f238ea7]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-6f238ea7]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-6f238ea7]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-cd6ac8a9]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-cd6ac8a9]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-cd6ac8a9],.state.lost[data-v-cd6ac8a9]{color:var(--red, #d4574b)}.line[data-v-cd6ac8a9]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-cd6ac8a9]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { computed as u, unref as a, ref as $, watch as z, openBlock as s, createElementBlock as i, createBlock as g, Teleport as m, createElementVNode as n, normalizeStyle as T, toDisplayString as k, createCommentVNode as c, createTextVNode as W, nextTick as te } from "vue";
import { useWindow as ae, useDockCard as oe, useOutputPages as se, useNow as ne, usePoll as ue, Icon as re, SkeletonLine as le, afterSkeletonMinimum as de } from "@journal/window-kit";
import { _ as ie } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const ce = {
  class: "output-dock",
  "data-output-dock": ""
}, pe = ["data-state"], ve = {
  key: 0,
  class: "output-dock-ring"
}, ge = ["title"], _e = ["data-figure-bar", "data-figure-began"], ke = ["data-figure-progress"], fe = { "data-output-steps": "" }, me = { "data-output-progress": "" }, he = ["title", "aria-label"], be = {
  key: 1,
  class: "output-dock-figure"
}, ye = { class: "output-dock-more" }, we = { class: "output-dock-inner" }, Se = {
  key: 1,
  class: "output-dock-box"
}, Ne = {
  key: 0,
  class: "output-dock-reading",
  "data-output-reading": ""
}, xe = 2e3, De = 5e3, Oe = 24, Ee = {
  __name: "OutputDock",
  setup(Ie) {
    const D = {
      running: "var(--tone-work)",
      good: "var(--tone-good)",
      bad: "var(--danger)",
      stopped: "var(--text-3)"
    }, j = {
      running: "terminal",
      good: "tick",
      bad: "cross",
      stopped: "stop"
    }, q = {
      running: "running",
      background: "running",
      finished: "good",
      failed: "bad",
      stopped: "stopped",
      orphaned: "stopped"
    }, r = ae(), O = oe(), h = r.option("row"), b = r.option("head"), _ = r.option("foot"), C = r.option("time"), G = r.option("folded"), X = r.option("collapsed"), o = O.data, y = se(
      O.readOutput,
      () => {
        var e;
        return (e = h.value) == null ? void 0 : e.target_id;
      }
    ), E = y.lines, I = u(() => !a(G)), p = $(null), P = $(!1), J = ne(), l = u(() => {
      var e;
      return q[(e = o.value) == null ? void 0 : e.state] ?? "running";
    }), L = () => l.value === "running", d = u(() => l.value !== "running"), M = u(() => {
      var e;
      return Number(((e = o.value) == null ? void 0 : e.progress) ?? 0) / 100;
    }), K = u(
      () => d.value ? "100%" : `${Math.round(M.value * 100)}%`
    ), Q = u(
      () => {
        var e;
        return (e = o.value) != null && e.created_at ? Date.parse(o.value.created_at) / 1e3 : 0;
      }
    ), w = u(() => {
      var t;
      if (!a(X)) return "";
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
    }), U = u(() => {
      var v;
      if (!((v = o.value) != null && v.created_at)) return "";
      const e = o.value.ended_at ? Date.parse(o.value.ended_at) : J.value, t = Math.max(
        0,
        Math.round((e - Date.parse(o.value.created_at)) / 1e3)
      );
      return t >= 60 ? `${Math.floor(t / 60)}m ${t % 60}s` : `${t}s`;
    });
    async function N() {
      var f;
      if (!((f = h.value) == null ? void 0 : f.target_id) || (await O.reload(), !I.value)) return;
      const t = p.value, v = !t || t.scrollHeight - t.scrollTop - t.clientHeight < Oe, x = performance.now();
      await y.follow(), de(x, async () => {
        P.value = !0, await te(), v && p.value && (p.value.scrollTop = p.value.scrollHeight), p.value && y.feed.drawn(p.value);
      });
    }
    z(I, (e) => e && N());
    const F = $(!1);
    async function Y() {
      var t;
      const e = await r.run(["output", "ask-reader", String((t = h.value) == null ? void 0 : t.target_id)]);
      (e == null ? void 0 : e.ok) !== !1 && (F.value = !0);
    }
    const Z = u(() => {
      var e, t;
      return !F.value && !((e = o.value) != null && e.reader_requested) && !((t = o.value) != null && t.reads_progress) && !d.value;
    });
    return z(d, (e) => e && N()), r.follow(
      ["process.*"],
      (e) => {
        var t;
        return e.row_id === ((t = h.value) == null ? void 0 : t.target_id) && N();
      }
    ), ue(
      N,
      L,
      () => I.value ? xe : De
    ), (e, t) => {
      var v, x, f, R, B, H, V;
      return s(), i("div", ce, [
        ((v = a(b)) == null ? void 0 : v.value) ?? a(b) ? (s(), g(m, {
          key: 0,
          to: ((x = a(b)) == null ? void 0 : x.value) ?? a(b)
        }, [
          n("span", {
            class: "output-dock-state",
            "data-state": l.value,
            style: T({ "--tone": D[l.value] })
          }, [
            L() ? (s(), i("span", ve)) : (s(), g(a(re), {
              key: 1,
              name: j[l.value],
              size: 14
            }, null, 8, ["name"]))
          ], 12, pe),
          n("span", {
            class: "output-dock-title",
            title: ((f = a(o)) == null ? void 0 : f.title) || ((R = a(o)) == null ? void 0 : R.line)
          }, k(((B = a(o)) == null ? void 0 : B.title) || ((H = a(o)) == null ? void 0 : H.line)), 9, ge),
          M.value > 0 || d.value ? (s(), i("div", {
            key: 0,
            class: "output-dock-bar",
            "data-figure-bar": d.value ? l.value : "",
            "data-figure-began": Q.value
          }, [
            n("div", {
              class: "output-dock-fill",
              style: T({ width: K.value, background: D[l.value] }),
              "data-figure-progress": d.value ? null : ""
            }, null, 12, ke)
          ], 8, _e)) : c("", !0)
        ], 8, ["to"])) : c("", !0),
        a(a(_)) && L() && !M.value && !S.value ? (s(), g(m, {
          key: 1,
          to: a(a(_))
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
        ], 8, ["to"])) : c("", !0),
        a(a(_)) && S.value ? (s(), g(m, {
          key: 2,
          to: a(a(_))
        }, [
          n("span", fe, [
            t[2] || (t[2] = W("Steps: ", -1)),
            n("b", null, k(S.value), 1)
          ])
        ], 8, ["to"])) : c("", !0),
        a(a(_)) && A.value ? (s(), g(m, {
          key: 3,
          to: a(a(_))
        }, [
          n("span", me, [
            t[3] || (t[3] = W("Progress: ", -1)),
            n("b", null, k(A.value), 1)
          ])
        ], 8, ["to"])) : c("", !0),
        a(a(C)) ? (s(), g(m, {
          key: 4,
          to: a(a(C))
        }, [
          w.value ? (s(), i("span", {
            key: 0,
            class: "output-dock-percent",
            "data-output-percent": "",
            role: "img",
            title: w.value,
            "aria-label": w.value
          }, [
            n("i", {
              style: T({ width: w.value, background: D.running })
            }, null, 4)
          ], 8, he)) : (s(), i("span", be, k(U.value), 1))
        ], 8, ["to"])) : c("", !0),
        n("div", ye, [
          n("div", we, [
            P.value ? (s(), i("div", Se, [
              n("pre", {
                ref_key: "terminal",
                ref: p,
                class: "output-dock-terminal",
                "data-output-terminal": "",
                onScroll: t[0] || (t[0] = (ee) => a(y).loadEarlier(ee.target))
              }, k(a(E).length ? a(E).join(`
`) : "No output yet"), 545),
              (V = a(o)) != null && V.reading_text ? (s(), i("p", Ne, k(a(o).reading_text), 1)) : c("", !0),
              !a(E).length && Z.value ? (s(), i("button", {
                key: 1,
                type: "button",
                class: "output-dock-reader",
                "data-output-reader-ask": "",
                onClick: Y
              }, " Ask the agent to draw a reader ")) : c("", !0)
            ])) : (s(), g(a(le), {
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
}, Te = /* @__PURE__ */ ie(Ee, [["__scopeId", "data-v-3b67cdee"]]);
export {
  Te as default
};
