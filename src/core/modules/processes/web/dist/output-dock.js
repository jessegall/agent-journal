/* @code-commandments-generated */
if (!document.getElementById("window-styles-7bbc0bf8a15e")) { const style = document.createElement("style"); style.id = "window-styles-7bbc0bf8a15e"; style.textContent = ".output-dock-more[data-v-69af4745]{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows var(--move),opacity var(--fade)}.output-dock-more.open[data-v-69af4745]{grid-template-rows:1fr;opacity:1}.output-dock-inner[data-v-69af4745]{min-height:0;overflow:hidden}.output-dock-state[data-v-69af4745]{display:flex;flex:none;justify-content:center;width:16px;color:var(--tone)}.output-dock-label[data-v-69af4745]{display:flex;flex:1 1 auto;align-items:center;gap:9px;min-width:0;padding:0;border:none;background:none;color:var(--text);font:inherit;font-size:12px;font-weight:500;text-align:left;cursor:pointer}.output-dock-title[data-v-69af4745]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-69af4745]{flex:none;color:var(--text-3);font-size:11px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-69af4745]{overflow:auto;max-height:280px;margin:0 12px 10px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-69af4745]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-69af4745]{height:100%;transition:width .4s ease}.output[data-v-7e18ff9e]{display:flex;flex-direction:column;height:100%}.bar[data-v-7e18ff9e]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-7e18ff9e]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-7e18ff9e]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-7e18ff9e]{flex:1;margin:0;padding:0 12px 12px;overflow:auto;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-454d324c]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-454d324c]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-454d324c],.state.lost[data-v-454d324c]{color:var(--red, #d4574b)}.line[data-v-454d324c]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-454d324c]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as f, computed as u, watch as H, openBlock as p, createElementBlock as g, unref as d, createBlock as L, Teleport as V, createElementVNode as l, normalizeStyle as O, createVNode as T, toDisplayString as m, createCommentVNode as h, normalizeClass as z, nextTick as P } from "vue";
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
}, ee = { class: "output-dock-inner" }, te = 24, ae = {
  __name: "OutputDock",
  setup(oe) {
    const b = { running: "var(--tone-work)", good: "var(--tone-good)", bad: "var(--tone-bad)", stopped: "var(--text-3)" }, I = { running: "terminal", good: "tick", bad: "cross", stopped: "stop" }, C = { running: "running", background: "running", finished: "good", failed: "bad", stopped: "stopped", orphaned: "stopped" }, v = W(), E = v.option("row"), _ = v.option("head"), t = f(null), w = f([]), n = f(!1), r = f(null), M = j(), s = u(() => {
      var e;
      return C[(e = t.value) == null ? void 0 : e.state] ?? "running";
    }), B = () => s.value === "running", x = u(() => s.value === "good" || s.value === "bad"), y = u(() => {
      var e;
      return Number(((e = t.value) == null ? void 0 : e.progress) ?? 0) / 100;
    }), F = u(() => x.value ? "100%" : `${Math.round(y.value * 100)}%`), $ = u(() => {
      var e, a;
      return !((e = t.value) != null && e.steps_passed) && !((a = t.value) != null && a.steps_failed) ? "" : t.value.steps_failed ? `${t.value.steps_passed} passed, ${t.value.steps_failed} failed` : `${t.value.steps_passed} passed`;
    }), N = u(() => {
      var o;
      if (!((o = t.value) != null && o.created_at)) return "";
      const e = t.value.ended_at ? Date.parse(t.value.ended_at) : M.value, a = Math.max(0, Math.round((e - Date.parse(t.value.created_at)) / 1e3));
      return a >= 60 ? `${Math.floor(a / 60)}m ${a % 60}s` : `${a}s`;
    });
    async function S() {
      var i;
      const e = (i = E.value) == null ? void 0 : i.target_id;
      if (!e) return;
      const a = await v.read(`process card ${e}`);
      if (t.value = a.ok ? a.value : null, !n.value) return;
      const o = r.value, k = !o || o.scrollHeight - o.scrollTop - o.clientHeight < te, c = await v.read(`output peek ${e} --all`);
      w.value = c.ok ? c.value.lines : [], await P(), k && r.value && (r.value.scrollTop = r.value.scrollHeight);
    }
    return H(n, (e) => e && S()), A(S, B), (e, a) => {
      var o, k, c, i, D;
      return p(), g("div", q, [
        ((o = d(_)) == null ? void 0 : o.value) ?? d(_) ? (p(), L(V, {
          key: 0,
          to: ((k = d(_)) == null ? void 0 : k.value) ?? d(_)
        }, [
          l("span", {
            class: "output-dock-state",
            "data-state": s.value,
            style: O({ "--tone": b[s.value] })
          }, [
            T(d(G), {
              name: I[s.value]
            }, null, 8, ["name"])
          ], 12, J),
          l("button", {
            type: "button",
            class: "output-dock-label",
            "data-output-toggle": "",
            "aria-expanded": n.value,
            title: (c = t.value) == null ? void 0 : c.line,
            onClick: a[0] || (a[0] = (ne) => n.value = !n.value)
          }, [
            l("span", Q, m(((i = t.value) == null ? void 0 : i.title) || ((D = t.value) == null ? void 0 : D.line)), 1),
            T(d(R), { open: n.value }, null, 8, ["open"])
          ], 8, K),
          $.value ? (p(), g("span", U, m($.value), 1)) : h("", !0),
          N.value ? (p(), g("span", Y, m(N.value), 1)) : h("", !0),
          y.value > 0 || x.value ? (p(), g("div", Z, [
            l("div", {
              class: "output-dock-fill",
              style: O({ width: F.value, background: b[s.value] })
            }, null, 4)
          ])) : h("", !0)
        ], 8, ["to"])) : h("", !0),
        l("div", {
          class: z(["output-dock-more", { open: n.value }])
        }, [
          l("div", ee, [
            l("pre", {
              ref_key: "terminal",
              ref: r,
              class: "output-dock-terminal",
              "data-output-terminal": ""
            }, m(w.value.join(`
`)), 513)
          ])
        ], 2)
      ]);
    };
  }
}, de = /* @__PURE__ */ X(ae, [["__scopeId", "data-v-69af4745"]]);
export {
  de as default
};
