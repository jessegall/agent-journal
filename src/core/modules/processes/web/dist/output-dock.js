/* @code-commandments-generated */
if (!document.getElementById("window-styles-e429bda8e7ff")) { const style = document.createElement("style"); style.id = "window-styles-e429bda8e7ff"; style.textContent = ".output-dock-more[data-v-bcc6af90]{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows var(--move),opacity var(--fade)}.output-dock-more.open[data-v-bcc6af90]{grid-template-rows:1fr;opacity:1}.output-dock-inner[data-v-bcc6af90]{min-height:0;overflow:hidden}.output-dock-state[data-v-bcc6af90]{display:flex;flex:none;justify-content:center;width:16px;color:var(--tone)}.output-dock-label[data-v-bcc6af90]{display:flex;flex:1 1 auto;align-items:center;gap:9px;min-width:0;padding:0;border:none;background:none;color:var(--text);font:inherit;font-size:12px;font-weight:500;text-align:left;cursor:pointer}.output-dock-title[data-v-bcc6af90]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-bcc6af90]{flex:none;color:var(--text-3);font-size:11px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-bcc6af90]{overflow:auto;max-height:280px;margin:0 12px 10px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-bcc6af90]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-bcc6af90]{height:100%;transition:width .4s ease}.output[data-v-7e18ff9e]{display:flex;flex-direction:column;height:100%}.bar[data-v-7e18ff9e]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-7e18ff9e]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-7e18ff9e]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-7e18ff9e]{flex:1;margin:0;padding:0 12px 12px;overflow:auto;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-454d324c]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-454d324c]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-454d324c],.state.lost[data-v-454d324c]{color:var(--red, #d4574b)}.line[data-v-454d324c]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-454d324c]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as p, computed as u, watch as H, openBlock as v, createElementBlock as g, unref as c, createBlock as L, Teleport as V, createElementVNode as l, normalizeStyle as T, createVNode as I, toDisplayString as m, createCommentVNode as h, normalizeClass as z, nextTick as P } from "vue";
import { useWindow as W, usePoll as j, Icon as A, FoldSign as G } from "@journal/window-kit";
import { _ as R } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const X = {
  class: "output-dock",
  "data-output-dock": ""
}, q = ["data-state"], J = ["aria-expanded", "title"], K = { class: "output-dock-title" }, Q = {
  key: 0,
  class: "output-dock-figure",
  "data-output-steps": ""
}, U = {
  key: 1,
  class: "output-dock-figure"
}, Y = {
  key: 2,
  class: "output-dock-bar"
}, Z = { class: "output-dock-inner" }, ee = 24, te = {
  __name: "OutputDock",
  setup(ae) {
    const b = { running: "var(--tone-work)", good: "var(--tone-good)", bad: "var(--tone-bad)", stopped: "var(--text-3)" }, C = { running: "terminal", good: "tick", bad: "cross", stopped: "stop" }, E = { running: "running", background: "running", finished: "good", failed: "bad", stopped: "stopped", orphaned: "stopped" }, _ = W(), M = _.option("row"), k = _.option("head"), t = p(null), w = p([]), n = p(!1), d = p(null), x = p(Date.now()), s = u(() => {
      var e;
      return E[(e = t.value) == null ? void 0 : e.state] ?? "running";
    }), B = () => s.value === "running", y = u(() => s.value === "good" || s.value === "bad"), $ = u(() => {
      var e;
      return Number(((e = t.value) == null ? void 0 : e.progress) ?? 0) / 100;
    }), F = u(() => y.value ? "100%" : `${Math.round($.value * 100)}%`), D = u(() => {
      var e, a;
      return !((e = t.value) != null && e.steps_passed) && !((a = t.value) != null && a.steps_failed) ? "" : t.value.steps_failed ? `${t.value.steps_passed} passed, ${t.value.steps_failed} failed` : `${t.value.steps_passed} passed`;
    }), N = u(() => {
      var o;
      if (!((o = t.value) != null && o.created_at)) return "";
      const e = t.value.ended_at ? Date.parse(t.value.ended_at) : x.value, a = Math.max(0, Math.round((e - Date.parse(t.value.created_at)) / 1e3));
      return a >= 60 ? `${Math.floor(a / 60)}m ${a % 60}s` : `${a}s`;
    });
    async function S() {
      var i;
      const e = (i = M.value) == null ? void 0 : i.target_id;
      if (!e) return;
      x.value = Date.now();
      const a = await _.read(`process card ${e}`);
      if (t.value = a.ok ? a.value : null, !n.value) return;
      const o = d.value, f = !o || o.scrollHeight - o.scrollTop - o.clientHeight < ee, r = await _.read(`output peek ${e} --all`);
      w.value = r.ok ? r.value.lines : [], await P(), f && d.value && (d.value.scrollTop = d.value.scrollHeight);
    }
    return H(n, (e) => e && S()), j(S, B), (e, a) => {
      var o, f, r, i, O;
      return v(), g("div", X, [
        ((o = c(k)) == null ? void 0 : o.value) ?? c(k) ? (v(), L(V, {
          key: 0,
          to: ((f = c(k)) == null ? void 0 : f.value) ?? c(k)
        }, [
          l("span", {
            class: "output-dock-state",
            "data-state": s.value,
            style: T({ "--tone": b[s.value] })
          }, [
            I(c(A), {
              name: C[s.value]
            }, null, 8, ["name"])
          ], 12, q),
          l("button", {
            type: "button",
            class: "output-dock-label",
            "data-output-toggle": "",
            "aria-expanded": n.value,
            title: (r = t.value) == null ? void 0 : r.line,
            onClick: a[0] || (a[0] = (oe) => n.value = !n.value)
          }, [
            l("span", K, m(((i = t.value) == null ? void 0 : i.title) || ((O = t.value) == null ? void 0 : O.line)), 1),
            I(c(G), { open: n.value }, null, 8, ["open"])
          ], 8, J),
          D.value ? (v(), g("span", Q, m(D.value), 1)) : h("", !0),
          N.value ? (v(), g("span", U, m(N.value), 1)) : h("", !0),
          $.value > 0 || y.value ? (v(), g("div", Y, [
            l("div", {
              class: "output-dock-fill",
              style: T({ width: F.value, background: b[s.value] })
            }, null, 4)
          ])) : h("", !0)
        ], 8, ["to"])) : h("", !0),
        l("div", {
          class: z(["output-dock-more", { open: n.value }])
        }, [
          l("div", Z, [
            l("pre", {
              ref_key: "terminal",
              ref: d,
              class: "output-dock-terminal",
              "data-output-terminal": ""
            }, m(w.value.join(`
`)), 513)
          ])
        ], 2)
      ]);
    };
  }
}, ue = /* @__PURE__ */ R(te, [["__scopeId", "data-v-bcc6af90"]]);
export {
  ue as default
};
