/* @code-commandments-generated */
if (!document.getElementById("window-styles-de2648ad85dd")) { const style = document.createElement("style"); style.id = "window-styles-de2648ad85dd"; style.textContent = ".output-dock-more[data-v-a1003215]{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows var(--move),opacity var(--fade)}.output-dock-more.open[data-v-a1003215]{grid-template-rows:1fr;opacity:1}.output-dock-inner[data-v-a1003215]{min-height:0;overflow:hidden}.output-dock-state[data-v-a1003215]{display:flex;flex:none;justify-content:center;width:16px;color:var(--tone)}.output-dock-label[data-v-a1003215]{display:flex;flex:1 1 auto;align-items:center;gap:9px;min-width:0;padding:0;border:none;background:none;color:var(--text);font:inherit;font-size:12px;font-weight:500;text-align:left;cursor:pointer}.output-dock-title[data-v-a1003215]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-a1003215]{flex:none;color:var(--text-3);font-size:11px;font-variant-numeric:tabular-nums}.output-dock-lines[data-v-a1003215]{margin:0;padding:0 12px 10px 35px;color:var(--text-3);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;list-style:none;overflow-wrap:anywhere}.output-dock-bar[data-v-a1003215]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-a1003215]{height:100%;transition:width .4s ease}.output[data-v-7e18ff9e]{display:flex;flex-direction:column;height:100%}.bar[data-v-7e18ff9e]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-7e18ff9e]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-7e18ff9e]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-7e18ff9e]{flex:1;margin:0;padding:0 12px 12px;overflow:auto;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-454d324c]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-454d324c]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-454d324c],.state.lost[data-v-454d324c]{color:var(--red, #d4574b)}.line[data-v-454d324c]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-454d324c]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as _, computed as l, openBlock as n, createElementBlock as d, unref as r, createBlock as V, Teleport as z, createElementVNode as u, normalizeStyle as C, createVNode as I, toDisplayString as k, createCommentVNode as m, normalizeClass as A, Fragment as G, renderList as L } from "vue";
import { useWindow as P, usePoll as R, Icon as W, FoldSign as j } from "@journal/window-kit";
import { _ as q } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const H = {
  class: "output-dock",
  "data-output-dock": ""
}, J = ["data-state"], K = ["aria-expanded", "title"], Q = { class: "output-dock-title" }, U = {
  key: 0,
  class: "output-dock-figure",
  "data-output-steps": ""
}, X = {
  key: 1,
  class: "output-dock-figure"
}, Y = {
  key: 2,
  class: "output-dock-bar"
}, Z = { class: "output-dock-inner" }, ee = { class: "output-dock-lines" }, te = {
  __name: "OutputDock",
  setup(ae) {
    const f = { running: "var(--tone-work)", good: "var(--tone-good)", bad: "var(--tone-bad)", stopped: "var(--text-3)" }, M = { running: "terminal", good: "tick", bad: "cross", stopped: "stop" }, O = { running: "running", background: "running", finished: "good", failed: "bad", stopped: "stopped", orphaned: "stopped" }, p = P(), B = p.option("row"), v = p.option("head"), e = _(null), h = _([]), c = _(!1), b = _(Date.now()), s = l(() => {
      var t;
      return O[(t = e.value) == null ? void 0 : t.state] ?? "running";
    }), E = () => s.value === "running", y = l(() => s.value === "good" || s.value === "bad"), w = l(() => {
      var t;
      return Number(((t = e.value) == null ? void 0 : t.progress) ?? 0) / 100;
    }), F = l(() => y.value ? "100%" : `${Math.round(w.value * 100)}%`), $ = l(() => {
      var t, a;
      return !((t = e.value) != null && t.steps_passed) && !((a = e.value) != null && a.steps_failed) ? "" : e.value.steps_failed ? `${e.value.steps_passed} passed, ${e.value.steps_failed} failed` : `${e.value.steps_passed} passed`;
    }), x = l(() => {
      var o;
      if (!((o = e.value) != null && o.created_at)) return "";
      const t = e.value.ended_at ? Date.parse(e.value.ended_at) : b.value, a = Math.max(0, Math.round((t - Date.parse(e.value.created_at)) / 1e3));
      return a >= 60 ? `${Math.floor(a / 60)}m ${a % 60}s` : `${a}s`;
    });
    async function T() {
      var i;
      const t = (i = B.value) == null ? void 0 : i.target_id;
      if (!t) return;
      b.value = Date.now();
      const a = await p.read(`process card ${t}`);
      e.value = a.ok ? a.value : null;
      const o = await p.read(`output peek ${t} --summary`);
      h.value = o.ok ? o.value.lines : [];
    }
    return R(T, E), (t, a) => {
      var o, i, D, N, S;
      return n(), d("div", H, [
        ((o = r(v)) == null ? void 0 : o.value) ?? r(v) ? (n(), V(z, {
          key: 0,
          to: ((i = r(v)) == null ? void 0 : i.value) ?? r(v)
        }, [
          u("span", {
            class: "output-dock-state",
            "data-state": s.value,
            style: C({ "--tone": f[s.value] })
          }, [
            I(r(W), {
              name: M[s.value]
            }, null, 8, ["name"])
          ], 12, J),
          u("button", {
            type: "button",
            class: "output-dock-label",
            "data-output-toggle": "",
            "aria-expanded": c.value,
            title: (D = e.value) == null ? void 0 : D.line,
            onClick: a[0] || (a[0] = (g) => c.value = !c.value)
          }, [
            u("span", Q, k(((N = e.value) == null ? void 0 : N.title) || ((S = e.value) == null ? void 0 : S.line)), 1),
            I(r(j), { open: c.value }, null, 8, ["open"])
          ], 8, K),
          $.value ? (n(), d("span", U, k($.value), 1)) : m("", !0),
          x.value ? (n(), d("span", X, k(x.value), 1)) : m("", !0),
          w.value > 0 || y.value ? (n(), d("div", Y, [
            u("div", {
              class: "output-dock-fill",
              style: C({ width: F.value, background: f[s.value] })
            }, null, 4)
          ])) : m("", !0)
        ], 8, ["to"])) : m("", !0),
        u("div", {
          class: A(["output-dock-more", { open: c.value }])
        }, [
          u("div", Z, [
            u("ul", ee, [
              (n(!0), d(G, null, L(h.value, (g) => (n(), d("li", { key: g }, k(g), 1))), 128))
            ])
          ])
        ], 2)
      ]);
    };
  }
}, ue = /* @__PURE__ */ q(te, [["__scopeId", "data-v-a1003215"]]);
export {
  ue as default
};
