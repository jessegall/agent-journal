/* @code-commandments-generated */
if (!document.getElementById("window-styles-33df0b12fa2a")) { const style = document.createElement("style"); style.id = "window-styles-33df0b12fa2a"; style.textContent = ".output-dock-more[data-v-8ed4ef84]{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows var(--move),opacity var(--fade)}.output-dock-more.open[data-v-8ed4ef84]{grid-template-rows:1fr;opacity:1}.output-dock-inner[data-v-8ed4ef84]{min-height:0;overflow:hidden}.output-dock-state[data-v-8ed4ef84]{display:flex;flex:none;justify-content:center;width:16px;color:var(--tone)}.output-dock-label[data-v-8ed4ef84]{display:flex;flex:1 1 auto;align-items:center;gap:9px;min-width:0;padding:0;border:none;background:none;color:var(--text);font:inherit;font-size:12px;font-weight:500;text-align:left;cursor:pointer}.output-dock-title[data-v-8ed4ef84]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-8ed4ef84]{flex:none;color:var(--text-3);font-size:11px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-8ed4ef84]{overflow:auto;max-height:280px;margin:0 12px 10px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-8ed4ef84]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-8ed4ef84]{height:100%;transition:width .4s ease}.output[data-v-7e24d4df]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-7e24d4df]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-7e24d4df]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-7e24d4df]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-7e24d4df]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-f3235ed9]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-f3235ed9]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-f3235ed9],.state.lost[data-v-f3235ed9]{color:var(--red, #d4574b)}.line[data-v-f3235ed9]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-f3235ed9]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as k, computed as u, watch as F, openBlock as v, createElementBlock as m, unref as r, createBlock as H, Teleport as P, createElementVNode as l, normalizeStyle as $, createVNode as E, toDisplayString as h, createCommentVNode as b, normalizeClass as V, nextTick as z } from "vue";
import { useWindow as W, useNow as j, usePoll as A, Icon as G, FoldSign as R } from "@journal/window-kit";
import { _ as X } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const q = {
  class: "output-dock",
  "data-output-dock": ""
}, J = ["data-state"], K = ["aria-expanded", "title"], Q = { class: "output-dock-title" }, U = {
  key: 0,
  class: "output-dock-figure",
  "data-output-steps": ""
}, Y = {
  key: 1,
  class: "output-dock-figure"
}, Z = ["data-figure-bar", "data-figure-began"], ee = ["data-figure-progress"], te = { class: "output-dock-inner" }, ae = 2e3, oe = 5e3, se = 24, ne = {
  __name: "OutputDock",
  setup(ue) {
    const S = { running: "var(--tone-work)", good: "var(--tone-good)", bad: "var(--tone-bad)", stopped: "var(--text-3)" }, I = { running: "terminal", good: "tick", bad: "cross", stopped: "stop" }, L = { running: "running", background: "running", finished: "good", failed: "bad", stopped: "stopped", orphaned: "stopped" }, d = W(), N = d.option("row"), _ = d.option("head"), t = k(null), x = k([]), s = k(!1), c = k(null), C = j(), n = u(() => {
      var e;
      return L[(e = t.value) == null ? void 0 : e.state] ?? "running";
    }), M = () => n.value === "running", g = u(() => n.value === "good" || n.value === "bad"), y = u(() => {
      var e;
      return Number(((e = t.value) == null ? void 0 : e.progress) ?? 0) / 100;
    }), T = u(() => g.value ? "100%" : `${Math.round(y.value * 100)}%`), B = u(() => {
      var e;
      return (e = t.value) != null && e.created_at ? Date.parse(t.value.created_at) / 1e3 : 0;
    }), D = u(() => {
      var e, a;
      return !((e = t.value) != null && e.steps_passed) && !((a = t.value) != null && a.steps_failed) ? "" : t.value.steps_failed ? `${t.value.steps_passed} passed, ${t.value.steps_failed} failed` : `${t.value.steps_passed} passed`;
    }), O = u(() => {
      var o;
      if (!((o = t.value) != null && o.created_at)) return "";
      const e = t.value.ended_at ? Date.parse(t.value.ended_at) : C.value, a = Math.max(0, Math.round((e - Date.parse(t.value.created_at)) / 1e3));
      return a >= 60 ? `${Math.floor(a / 60)}m ${a % 60}s` : `${a}s`;
    });
    async function w() {
      var p;
      const e = (p = N.value) == null ? void 0 : p.target_id;
      if (!e) return;
      const a = await d.read(`process card ${e}`);
      if (t.value = a.ok ? a.value : null, !s.value) return;
      const o = c.value, f = !o || o.scrollHeight - o.scrollTop - o.clientHeight < se, i = await d.read(`output peek ${e} --all`);
      x.value = i.ok ? i.value.lines : [], await z(), f && c.value && (c.value.scrollTop = c.value.scrollHeight);
    }
    return F(s, (e) => e && w()), d.follow(["process.*"], (e) => {
      var a;
      return e.row_id === ((a = N.value) == null ? void 0 : a.target_id) && w();
    }), A(w, M, () => s.value ? ae : oe), (e, a) => {
      var o, f, i, p;
      return v(), m("div", q, [
        ((o = r(_)) == null ? void 0 : o.value) ?? r(_) ? (v(), H(P, {
          key: 0,
          to: ((f = r(_)) == null ? void 0 : f.value) ?? r(_)
        }, [
          l("span", {
            class: "output-dock-state",
            "data-state": n.value,
            style: $({ "--tone": S[n.value] })
          }, [
            E(r(G), {
              name: I[n.value]
            }, null, 8, ["name"])
          ], 12, J),
          l("button", {
            type: "button",
            class: "output-dock-label",
            "data-output-toggle": "",
            "aria-expanded": s.value,
            title: (i = t.value) == null ? void 0 : i.title,
            onClick: a[0] || (a[0] = (le) => s.value = !s.value)
          }, [
            l("span", Q, h((p = t.value) == null ? void 0 : p.title), 1),
            E(r(R), { open: s.value }, null, 8, ["open"])
          ], 8, K),
          D.value ? (v(), m("span", U, h(D.value), 1)) : b("", !0),
          O.value ? (v(), m("span", Y, h(O.value), 1)) : b("", !0),
          y.value > 0 || g.value ? (v(), m("div", {
            key: 2,
            class: "output-dock-bar",
            "data-figure-bar": g.value ? n.value : "",
            "data-figure-began": B.value
          }, [
            l("div", {
              class: "output-dock-fill",
              style: $({ width: T.value, background: S[n.value] }),
              "data-figure-progress": g.value ? null : ""
            }, null, 12, ee)
          ], 8, Z)) : b("", !0)
        ], 8, ["to"])) : b("", !0),
        l("div", {
          class: V(["output-dock-more", { open: s.value }])
        }, [
          l("div", te, [
            l("pre", {
              ref_key: "terminal",
              ref: c,
              class: "output-dock-terminal",
              "data-output-terminal": ""
            }, h(x.value.join(`
`)), 513)
          ])
        ], 2)
      ]);
    };
  }
}, ie = /* @__PURE__ */ X(ne, [["__scopeId", "data-v-8ed4ef84"]]);
export {
  ie as default
};
