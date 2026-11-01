/* @code-commandments-generated */
if (!document.getElementById("window-styles-29fdfd5d689d")) { const style = document.createElement("style"); style.id = "window-styles-29fdfd5d689d"; style.textContent = ".output-body[data-v-8b8c8324]{display:flex;flex-direction:column;gap:4px;padding:2px 0 0 20px;font-size:12px}.progress[data-v-8b8c8324]{height:3px;border-radius:2px;background:var(--border, #ddd)}.bar[data-v-8b8c8324]{display:block;height:100%;border-radius:2px;background:var(--text-3)}.figure[data-v-8b8c8324]{color:var(--text-3)}.last-lines[data-v-8b8c8324]{margin:0;color:var(--text-2);line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-more[data-v-de5c82a4]{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows var(--move),opacity var(--fade)}.output-dock-more.open[data-v-de5c82a4]{grid-template-rows:1fr;opacity:1}.output-dock-inner[data-v-de5c82a4]{min-height:0;overflow:hidden}.output-dock-state[data-v-de5c82a4]{display:flex;flex:none;justify-content:center;width:16px;color:var(--tone)}.output-dock-label[data-v-de5c82a4]{display:flex;flex:1 1 auto;align-items:center;gap:9px;min-width:0;padding:0;border:none;background:none;color:var(--text);font:inherit;font-size:12px;font-weight:500;text-align:left;cursor:pointer}.output-dock-title[data-v-de5c82a4]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-de5c82a4]{flex:none;color:var(--text-3);font-size:11px;font-variant-numeric:tabular-nums}.output-dock-lines[data-v-de5c82a4]{margin:0;padding:0 12px 10px 35px;color:var(--text-3);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;list-style:none;overflow-wrap:anywhere}.output-dock-bar[data-v-de5c82a4]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-de5c82a4]{height:100%;transition:width .4s ease}.output[data-v-b54b35ed]{display:flex;flex-direction:column;height:100%}.bar[data-v-b54b35ed]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-b54b35ed]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-b54b35ed]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-b54b35ed]{flex:1;margin:0;padding:0 12px 12px;overflow:auto;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-62193fb4]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-62193fb4]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-62193fb4],.state.lost[data-v-62193fb4]{color:var(--red, #d4574b)}.line[data-v-62193fb4]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-62193fb4]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as _, computed as c, openBlock as u, createElementBlock as i, unref as l, createBlock as F, Teleport as T, createElementVNode as s, normalizeStyle as S, createVNode as $, toDisplayString as m, createCommentVNode as g, normalizeClass as V, Fragment as z, renderList as A } from "vue";
import { useWindow as G, usePoll as L, Icon as P, FoldSign as R } from "@journal/window-kit";
import { _ as W } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const j = {
  class: "output-dock",
  "data-output-dock": ""
}, q = ["data-state"], H = ["aria-expanded", "title"], J = { class: "output-dock-title" }, K = {
  key: 0,
  class: "output-dock-figure"
}, Q = {
  key: 1,
  class: "output-dock-bar"
}, U = { class: "output-dock-inner" }, X = { class: "output-dock-lines" }, Y = {
  __name: "OutputDock",
  setup(Z) {
    const h = { running: "var(--tone-work)", good: "var(--tone-good)", bad: "var(--tone-bad)", stopped: "var(--text-3)" }, C = { running: "terminal", good: "tick", bad: "cross", stopped: "stop" }, I = { running: "running", background: "running", finished: "good", failed: "bad", stopped: "stopped", orphaned: "stopped" }, p = G(), M = p.option("row"), v = p.option("head"), o = _(null), f = _([]), d = _(!1), b = _(Date.now()), n = c(() => {
      var t;
      return I[(t = o.value) == null ? void 0 : t.state] ?? "running";
    }), O = () => n.value === "running", w = c(() => n.value === "good" || n.value === "bad"), y = c(() => {
      var t;
      return Number(((t = o.value) == null ? void 0 : t.progress) ?? 0) / 100;
    }), B = c(() => w.value ? "100%" : `${Math.round(y.value * 100)}%`), x = c(() => {
      var a;
      if (!((a = o.value) != null && a.created_at)) return "";
      const t = o.value.ended_at ? Date.parse(o.value.ended_at) : b.value, e = Math.max(0, Math.round((t - Date.parse(o.value.created_at)) / 1e3));
      return e >= 60 ? `${Math.floor(e / 60)}m ${e % 60}s` : `${e}s`;
    });
    async function E() {
      var r;
      const t = (r = M.value) == null ? void 0 : r.target_id;
      if (!t) return;
      b.value = Date.now();
      const e = await p.read(`process show ${t}`);
      o.value = e.ok ? e.value : null;
      const a = await p.read(`output peek ${t} --summary`);
      f.value = a.ok ? a.value.lines : [];
    }
    return L(E, O), (t, e) => {
      var a, r, D, N;
      return u(), i("div", j, [
        ((a = l(v)) == null ? void 0 : a.value) ?? l(v) ? (u(), F(T, {
          key: 0,
          to: ((r = l(v)) == null ? void 0 : r.value) ?? l(v)
        }, [
          s("span", {
            class: "output-dock-state",
            "data-state": n.value,
            style: S({ "--tone": h[n.value] })
          }, [
            $(l(P), {
              name: C[n.value]
            }, null, 8, ["name"])
          ], 12, q),
          s("button", {
            type: "button",
            class: "output-dock-label",
            "data-output-toggle": "",
            "aria-expanded": d.value,
            title: (D = o.value) == null ? void 0 : D.line,
            onClick: e[0] || (e[0] = (k) => d.value = !d.value)
          }, [
            s("span", J, m((N = o.value) == null ? void 0 : N.line), 1),
            $(l(R), { open: d.value }, null, 8, ["open"])
          ], 8, H),
          x.value ? (u(), i("span", K, m(x.value), 1)) : g("", !0),
          y.value > 0 || w.value ? (u(), i("div", Q, [
            s("div", {
              class: "output-dock-fill",
              style: S({ width: B.value, background: h[n.value] })
            }, null, 4)
          ])) : g("", !0)
        ], 8, ["to"])) : g("", !0),
        s("div", {
          class: V(["output-dock-more", { open: d.value }])
        }, [
          s("div", U, [
            s("ul", X, [
              (u(!0), i(z, null, A(f.value, (k) => (u(), i("li", { key: k }, m(k), 1))), 128))
            ])
          ])
        ], 2)
      ]);
    };
  }
}, at = /* @__PURE__ */ W(Y, [["__scopeId", "data-v-de5c82a4"]]);
export {
  at as default
};
