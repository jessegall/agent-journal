/* @code-commandments-generated */
if (!document.getElementById("window-styles-cc3fc53731ed")) { const style = document.createElement("style"); style.id = "window-styles-cc3fc53731ed"; style.textContent = ".output-dock-more[data-v-735ff053]{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows var(--move),opacity var(--fade)}.output-dock-more.open[data-v-735ff053]{grid-template-rows:1fr;opacity:1}.output-dock-inner[data-v-735ff053]{min-height:0;overflow:hidden}.output-dock-state[data-v-735ff053]{display:flex;flex:none;justify-content:center;width:16px;color:var(--tone)}.output-dock-label[data-v-735ff053]{display:flex;flex:1 1 auto;align-items:center;gap:9px;min-width:0;padding:0;border:none;background:none;color:var(--text);font:inherit;font-size:12px;font-weight:500;text-align:left;cursor:pointer}.output-dock-title[data-v-735ff053]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-735ff053]{flex:none;color:var(--text-3);font-size:11px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-735ff053]{overflow:auto;max-height:280px;margin:0 12px 10px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-735ff053]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-735ff053]{height:100%;transition:width .4s ease}.output[data-v-7e18ff9e]{display:flex;flex-direction:column;height:100%}.bar[data-v-7e18ff9e]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-7e18ff9e]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-7e18ff9e]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-7e18ff9e]{flex:1;margin:0;padding:0 12px 12px;overflow:auto;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-94f15063]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-94f15063]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-94f15063],.state.lost[data-v-94f15063]{color:var(--red, #d4574b)}.line[data-v-94f15063]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-94f15063]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as k, computed as u, watch as F, openBlock as v, createElementBlock as g, unref as d, createBlock as H, Teleport as P, createElementVNode as l, normalizeStyle as E, createVNode as I, toDisplayString as m, createCommentVNode as h, normalizeClass as V, nextTick as z } from "vue";
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
}, Z = {
  key: 2,
  class: "output-dock-bar"
}, ee = { class: "output-dock-inner" }, te = 2e3, oe = 5e3, ae = 24, ne = {
  __name: "OutputDock",
  setup(se) {
    const b = { running: "var(--tone-work)", good: "var(--tone-good)", bad: "var(--tone-bad)", stopped: "var(--text-3)" }, L = { running: "terminal", good: "tick", bad: "cross", stopped: "stop" }, C = { running: "running", background: "running", finished: "good", failed: "bad", stopped: "stopped", orphaned: "stopped" }, r = W(), S = r.option("row"), _ = r.option("head"), t = k(null), N = k([]), n = k(!1), c = k(null), M = j(), s = u(() => {
      var e;
      return C[(e = t.value) == null ? void 0 : e.state] ?? "running";
    }), T = () => s.value === "running", x = u(() => s.value === "good" || s.value === "bad"), y = u(() => {
      var e;
      return Number(((e = t.value) == null ? void 0 : e.progress) ?? 0) / 100;
    }), B = u(() => x.value ? "100%" : `${Math.round(y.value * 100)}%`), D = u(() => {
      var e, o;
      return !((e = t.value) != null && e.steps_passed) && !((o = t.value) != null && o.steps_failed) ? "" : t.value.steps_failed ? `${t.value.steps_passed} passed, ${t.value.steps_failed} failed` : `${t.value.steps_passed} passed`;
    }), O = u(() => {
      var a;
      if (!((a = t.value) != null && a.created_at)) return "";
      const e = t.value.ended_at ? Date.parse(t.value.ended_at) : M.value, o = Math.max(0, Math.round((e - Date.parse(t.value.created_at)) / 1e3));
      return o >= 60 ? `${Math.floor(o / 60)}m ${o % 60}s` : `${o}s`;
    });
    async function w() {
      var p;
      const e = (p = S.value) == null ? void 0 : p.target_id;
      if (!e) return;
      const o = await r.read(`process card ${e}`);
      if (t.value = o.ok ? o.value : null, !n.value) return;
      const a = c.value, f = !a || a.scrollHeight - a.scrollTop - a.clientHeight < ae, i = await r.read(`output peek ${e} --all`);
      N.value = i.ok ? i.value.lines : [], await z(), f && c.value && (c.value.scrollTop = c.value.scrollHeight);
    }
    return F(n, (e) => e && w()), r.follow(["process.*"], (e) => {
      var o;
      return e.row_id === ((o = S.value) == null ? void 0 : o.target_id) && w();
    }), A(w, T, () => n.value ? te : oe), (e, o) => {
      var a, f, i, p, $;
      return v(), g("div", q, [
        ((a = d(_)) == null ? void 0 : a.value) ?? d(_) ? (v(), H(P, {
          key: 0,
          to: ((f = d(_)) == null ? void 0 : f.value) ?? d(_)
        }, [
          l("span", {
            class: "output-dock-state",
            "data-state": s.value,
            style: E({ "--tone": b[s.value] })
          }, [
            I(d(G), {
              name: L[s.value]
            }, null, 8, ["name"])
          ], 12, J),
          l("button", {
            type: "button",
            class: "output-dock-label",
            "data-output-toggle": "",
            "aria-expanded": n.value,
            title: (i = t.value) == null ? void 0 : i.line,
            onClick: o[0] || (o[0] = (le) => n.value = !n.value)
          }, [
            l("span", Q, m(((p = t.value) == null ? void 0 : p.title) || (($ = t.value) == null ? void 0 : $.line)), 1),
            I(d(R), { open: n.value }, null, 8, ["open"])
          ], 8, K),
          D.value ? (v(), g("span", U, m(D.value), 1)) : h("", !0),
          O.value ? (v(), g("span", Y, m(O.value), 1)) : h("", !0),
          y.value > 0 || x.value ? (v(), g("div", Z, [
            l("div", {
              class: "output-dock-fill",
              style: E({ width: B.value, background: b[s.value] })
            }, null, 4)
          ])) : h("", !0)
        ], 8, ["to"])) : h("", !0),
        l("div", {
          class: V(["output-dock-more", { open: n.value }])
        }, [
          l("div", ee, [
            l("pre", {
              ref_key: "terminal",
              ref: c,
              class: "output-dock-terminal",
              "data-output-terminal": ""
            }, m(N.value.join(`
`)), 513)
          ])
        ], 2)
      ]);
    };
  }
}, ce = /* @__PURE__ */ X(ne, [["__scopeId", "data-v-735ff053"]]);
export {
  ce as default
};
