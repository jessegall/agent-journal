/* @code-commandments-generated */
if (!document.getElementById("window-styles-26ab06aeb8d4")) { const style = document.createElement("style"); style.id = "window-styles-26ab06aeb8d4"; style.textContent = ".output-dock-more[data-v-5c485026]{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows var(--move),opacity var(--fade)}.output-dock-more.open[data-v-5c485026]{grid-template-rows:1fr;opacity:1}.output-dock-inner[data-v-5c485026]{min-height:0;overflow:hidden}.output-dock-state[data-v-5c485026]{display:flex;flex:none;justify-content:center;width:16px;color:var(--tone)}.output-dock-label[data-v-5c485026]{display:flex;flex:1 1 auto;align-items:center;gap:9px;min-width:0;padding:0;border:none;background:none;color:var(--text);font:inherit;font-size:12px;font-weight:500;text-align:left;cursor:pointer}.output-dock-title[data-v-5c485026]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-5c485026]{flex:none;color:var(--text-3);font-size:11px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-5c485026]{overflow:auto;max-height:280px;margin:0 12px 10px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-5c485026]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-5c485026]{height:100%;transition:width .4s ease}.output[data-v-7e18ff9e]{display:flex;flex-direction:column;height:100%}.bar[data-v-7e18ff9e]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-7e18ff9e]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-7e18ff9e]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-7e18ff9e]{flex:1;margin:0;padding:0 12px 12px;overflow:auto;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-94f15063]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-94f15063]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-94f15063],.state.lost[data-v-94f15063]{color:var(--red, #d4574b)}.line[data-v-94f15063]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-94f15063]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as k, computed as u, watch as H, openBlock as v, createElementBlock as m, unref as r, createBlock as P, Teleport as V, createElementVNode as l, normalizeStyle as E, createVNode as I, toDisplayString as h, createCommentVNode as b, normalizeClass as z, nextTick as W } from "vue";
import { useWindow as j, useNow as A, usePoll as G, Icon as R, FoldSign as X } from "@journal/window-kit";
import { _ as q } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const J = {
  class: "output-dock",
  "data-output-dock": ""
}, K = ["data-state"], Q = ["aria-expanded", "title"], U = { class: "output-dock-title" }, Y = {
  key: 0,
  class: "output-dock-figure",
  "data-output-steps": ""
}, Z = {
  key: 1,
  class: "output-dock-figure"
}, ee = ["data-figure-bar", "data-figure-began"], te = ["data-figure-progress"], ae = { class: "output-dock-inner" }, oe = 2e3, se = 5e3, ne = 24, ue = {
  __name: "OutputDock",
  setup(le) {
    const S = { running: "var(--tone-work)", good: "var(--tone-good)", bad: "var(--tone-bad)", stopped: "var(--text-3)" }, L = { running: "terminal", good: "tick", bad: "cross", stopped: "stop" }, C = { running: "running", background: "running", finished: "good", failed: "bad", stopped: "stopped", orphaned: "stopped" }, d = j(), N = d.option("row"), _ = d.option("head"), t = k(null), x = k([]), s = k(!1), c = k(null), M = A(), n = u(() => {
      var e;
      return C[(e = t.value) == null ? void 0 : e.state] ?? "running";
    }), T = () => n.value === "running", g = u(() => n.value === "good" || n.value === "bad"), y = u(() => {
      var e;
      return Number(((e = t.value) == null ? void 0 : e.progress) ?? 0) / 100;
    }), B = u(() => g.value ? "100%" : `${Math.round(y.value * 100)}%`), F = u(() => {
      var e;
      return (e = t.value) != null && e.created_at ? Date.parse(t.value.created_at) / 1e3 : 0;
    }), D = u(() => {
      var e, a;
      return !((e = t.value) != null && e.steps_passed) && !((a = t.value) != null && a.steps_failed) ? "" : t.value.steps_failed ? `${t.value.steps_passed} passed, ${t.value.steps_failed} failed` : `${t.value.steps_passed} passed`;
    }), O = u(() => {
      var o;
      if (!((o = t.value) != null && o.created_at)) return "";
      const e = t.value.ended_at ? Date.parse(t.value.ended_at) : M.value, a = Math.max(0, Math.round((e - Date.parse(t.value.created_at)) / 1e3));
      return a >= 60 ? `${Math.floor(a / 60)}m ${a % 60}s` : `${a}s`;
    });
    async function w() {
      var p;
      const e = (p = N.value) == null ? void 0 : p.target_id;
      if (!e) return;
      const a = await d.read(`process card ${e}`);
      if (t.value = a.ok ? a.value : null, !s.value) return;
      const o = c.value, f = !o || o.scrollHeight - o.scrollTop - o.clientHeight < ne, i = await d.read(`output peek ${e} --all`);
      x.value = i.ok ? i.value.lines : [], await W(), f && c.value && (c.value.scrollTop = c.value.scrollHeight);
    }
    return H(s, (e) => e && w()), d.follow(["process.*"], (e) => {
      var a;
      return e.row_id === ((a = N.value) == null ? void 0 : a.target_id) && w();
    }), G(w, T, () => s.value ? oe : se), (e, a) => {
      var o, f, i, p, $;
      return v(), m("div", J, [
        ((o = r(_)) == null ? void 0 : o.value) ?? r(_) ? (v(), P(V, {
          key: 0,
          to: ((f = r(_)) == null ? void 0 : f.value) ?? r(_)
        }, [
          l("span", {
            class: "output-dock-state",
            "data-state": n.value,
            style: E({ "--tone": S[n.value] })
          }, [
            I(r(R), {
              name: L[n.value]
            }, null, 8, ["name"])
          ], 12, K),
          l("button", {
            type: "button",
            class: "output-dock-label",
            "data-output-toggle": "",
            "aria-expanded": s.value,
            title: (i = t.value) == null ? void 0 : i.line,
            onClick: a[0] || (a[0] = (re) => s.value = !s.value)
          }, [
            l("span", U, h(((p = t.value) == null ? void 0 : p.title) || (($ = t.value) == null ? void 0 : $.line)), 1),
            I(r(X), { open: s.value }, null, 8, ["open"])
          ], 8, Q),
          D.value ? (v(), m("span", Y, h(D.value), 1)) : b("", !0),
          O.value ? (v(), m("span", Z, h(O.value), 1)) : b("", !0),
          y.value > 0 || g.value ? (v(), m("div", {
            key: 2,
            class: "output-dock-bar",
            "data-figure-bar": g.value ? n.value : "",
            "data-figure-began": F.value
          }, [
            l("div", {
              class: "output-dock-fill",
              style: E({ width: B.value, background: S[n.value] }),
              "data-figure-progress": g.value ? null : ""
            }, null, 12, te)
          ], 8, ee)) : b("", !0)
        ], 8, ["to"])) : b("", !0),
        l("div", {
          class: z(["output-dock-more", { open: s.value }])
        }, [
          l("div", ae, [
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
}, pe = /* @__PURE__ */ q(ue, [["__scopeId", "data-v-5c485026"]]);
export {
  pe as default
};
