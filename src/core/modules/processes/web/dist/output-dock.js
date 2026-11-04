/* @code-commandments-generated */
if (!document.getElementById("window-styles-0a636a5ba979")) { const style = document.createElement("style"); style.id = "window-styles-0a636a5ba979"; style.textContent = ".output-dock-more[data-v-f69607f3]{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows var(--move),opacity var(--fade)}.output-dock-more.open[data-v-f69607f3]{grid-template-rows:1fr;opacity:1}.output-dock-inner[data-v-f69607f3]{min-height:0;overflow:hidden}.output-dock-state[data-v-f69607f3]{display:flex;flex:none;justify-content:center;width:16px;color:var(--tone)}.output-dock-label[data-v-f69607f3]{display:flex;flex:1 1 auto;align-items:center;gap:9px;min-width:0;padding:0;border:none;background:none;color:var(--text);font:inherit;font-size:12px;font-weight:500;text-align:left;cursor:pointer}.output-dock-title[data-v-f69607f3]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-f69607f3]{flex:none;color:var(--text-3);font-size:11px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-f69607f3]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0 12px 10px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-f69607f3]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-f69607f3]{height:100%;transition:width .4s ease}.output[data-v-97d5a832]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-97d5a832]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-97d5a832]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-97d5a832]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-97d5a832]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-b6264537]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-b6264537]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-b6264537],.state.lost[data-v-b6264537]{color:var(--red, #d4574b)}.line[data-v-b6264537]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-b6264537]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as S, computed as l, watch as H, openBlock as p, createElementBlock as f, unref as u, createBlock as V, Teleport as j, createElementVNode as r, normalizeStyle as I, createVNode as $, toDisplayString as k, createCommentVNode as m, normalizeClass as z, nextTick as W } from "vue";
import { useWindow as A, useOutputPages as G, useNow as R, usePoll as X, Icon as q, FoldSign as J } from "@journal/window-kit";
import { _ as K } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const Q = {
  class: "output-dock",
  "data-output-dock": ""
}, U = ["data-state"], Y = ["aria-expanded", "title"], Z = { class: "output-dock-title" }, ee = {
  key: 0,
  class: "output-dock-figure",
  "data-output-steps": ""
}, te = {
  key: 1,
  class: "output-dock-figure"
}, ae = ["data-figure-bar", "data-figure-began"], oe = ["data-figure-progress"], se = { class: "output-dock-inner" }, ne = 2e3, ue = 5e3, le = 24, re = {
  __name: "OutputDock",
  setup(de) {
    const N = { running: "var(--tone-work)", good: "var(--tone-good)", bad: "var(--tone-bad)", stopped: "var(--text-3)" }, L = { running: "terminal", good: "tick", bad: "cross", stopped: "stop" }, C = { running: "running", background: "running", finished: "good", failed: "bad", stopped: "stopped", orphaned: "stopped" }, d = A(), h = d.option("row"), v = d.option("head"), a = S(null), b = G((e) => d.read(e.join(" ")), () => {
      var e;
      return (e = h.value) == null ? void 0 : e.target_id;
    }), M = b.lines, s = S(!1), c = S(null), T = R(), n = l(() => {
      var e;
      return C[(e = a.value) == null ? void 0 : e.state] ?? "running";
    }), P = () => n.value === "running", _ = l(() => n.value === "good" || n.value === "bad"), y = l(() => {
      var e;
      return Number(((e = a.value) == null ? void 0 : e.progress) ?? 0) / 100;
    }), B = l(() => _.value ? "100%" : `${Math.round(y.value * 100)}%`), F = l(() => {
      var e;
      return (e = a.value) != null && e.created_at ? Date.parse(a.value.created_at) / 1e3 : 0;
    }), D = l(() => {
      var e, t;
      return !((e = a.value) != null && e.steps_passed) && !((t = a.value) != null && t.steps_failed) ? "" : a.value.steps_failed ? `${a.value.steps_passed} passed, ${a.value.steps_failed} failed` : `${a.value.steps_passed} passed`;
    }), O = l(() => {
      var o;
      if (!((o = a.value) != null && o.created_at)) return "";
      const e = a.value.ended_at ? Date.parse(a.value.ended_at) : T.value, t = Math.max(0, Math.round((e - Date.parse(a.value.created_at)) / 1e3));
      return t >= 60 ? `${Math.floor(t / 60)}m ${t % 60}s` : `${t}s`;
    });
    async function w() {
      var i;
      const e = (i = h.value) == null ? void 0 : i.target_id;
      if (!e) return;
      const t = await d.read(`process card ${e}`);
      if (a.value = t.ok ? t.value : null, !s.value) return;
      const o = c.value, g = !o || o.scrollHeight - o.scrollTop - o.clientHeight < le;
      await b.follow(), await W(), g && c.value && (c.value.scrollTop = c.value.scrollHeight);
    }
    return H(s, (e) => e && w()), d.follow(["process.*"], (e) => {
      var t;
      return e.row_id === ((t = h.value) == null ? void 0 : t.target_id) && w();
    }), X(w, P, () => s.value ? ne : ue), (e, t) => {
      var o, g, i, x;
      return p(), f("div", Q, [
        ((o = u(v)) == null ? void 0 : o.value) ?? u(v) ? (p(), V(j, {
          key: 0,
          to: ((g = u(v)) == null ? void 0 : g.value) ?? u(v)
        }, [
          r("span", {
            class: "output-dock-state",
            "data-state": n.value,
            style: I({ "--tone": N[n.value] })
          }, [
            $(u(q), {
              name: L[n.value]
            }, null, 8, ["name"])
          ], 12, U),
          r("button", {
            type: "button",
            class: "output-dock-label",
            "data-output-toggle": "",
            "aria-expanded": s.value,
            title: (i = a.value) == null ? void 0 : i.title,
            onClick: t[0] || (t[0] = (E) => s.value = !s.value)
          }, [
            r("span", Z, k((x = a.value) == null ? void 0 : x.title), 1),
            $(u(J), { open: s.value }, null, 8, ["open"])
          ], 8, Y),
          D.value ? (p(), f("span", ee, k(D.value), 1)) : m("", !0),
          O.value ? (p(), f("span", te, k(O.value), 1)) : m("", !0),
          y.value > 0 || _.value ? (p(), f("div", {
            key: 2,
            class: "output-dock-bar",
            "data-figure-bar": _.value ? n.value : "",
            "data-figure-began": F.value
          }, [
            r("div", {
              class: "output-dock-fill",
              style: I({ width: B.value, background: N[n.value] }),
              "data-figure-progress": _.value ? null : ""
            }, null, 12, oe)
          ], 8, ae)) : m("", !0)
        ], 8, ["to"])) : m("", !0),
        r("div", {
          class: z(["output-dock-more", { open: s.value }])
        }, [
          r("div", se, [
            r("pre", {
              ref_key: "terminal",
              ref: c,
              class: "output-dock-terminal",
              "data-output-terminal": "",
              onScroll: t[1] || (t[1] = (E) => u(b).loadEarlier(E.target))
            }, k(u(M).join(`
`)), 545)
          ])
        ], 2)
      ]);
    };
  }
}, ve = /* @__PURE__ */ K(re, [["__scopeId", "data-v-f69607f3"]]);
export {
  ve as default
};
