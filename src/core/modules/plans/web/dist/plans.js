/* @code-commandments-generated */
if (!document.getElementById("window-styles-5bf4e31fb708")) { const style = document.createElement("style"); style.id = "window-styles-5bf4e31fb708"; style.textContent = ".plan-dock[data-v-28bdeeb8]{display:flex;gap:8px;font-size:12px;line-height:1.45}.plan-dock-state[data-v-28bdeeb8]{color:var(--text-4)}.plans[data-v-ac50e683]{display:flex;flex-direction:column;gap:14px}.plans-tabs[data-v-ac50e683]{display:flex;gap:14px}.plans-tab[data-v-ac50e683]{padding:0 0 4px;border:0;border-bottom:1px solid transparent;background:none;color:var(--text-3);font:inherit;font-size:11px;letter-spacing:.04em;text-transform:uppercase;cursor:pointer}.plans-tab.on[data-v-ac50e683]{border-bottom-color:var(--accent);color:var(--text)}.plans-grid[data-v-ac50e683]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}.plan[data-v-ac50e683]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plan-head[data-v-ac50e683]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-ac50e683]{margin-left:auto}.plan-title[data-v-ac50e683]{font-weight:500}.plan-bar[data-v-ac50e683]{height:4px;border-radius:2px;background:var(--raised)}.plan-bar-fill[data-v-ac50e683]{display:block;height:100%;border-radius:2px;background:var(--accent)}.plan-foot[data-v-ac50e683],.plans-note[data-v-ac50e683]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as C, computed as r, watch as V, openBlock as n, createElementBlock as l, unref as o, createBlock as $, toDisplayString as t, Fragment as g, createElementVNode as c, createVNode as u, normalizeClass as x, withCtx as N, createTextVNode as _, createCommentVNode as S, renderList as z, normalizeStyle as O } from "vue";
import { useRows as D, Skeleton as I, Btn as B, Icon as L } from "@journal/window-kit";
import { _ as j } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const w = { class: "plans" }, F = {
  key: 1,
  class: "plans-note"
}, M = { class: "plans-tabs" }, R = {
  key: 0,
  class: "plans-note"
}, T = { class: "plans-grid" }, q = ["data-row"], A = { class: "plan-head" }, G = { class: "plan-state" }, H = { class: "plan-title" }, J = { class: "plan-bar" }, K = {
  key: 0,
  class: "plan-foot"
}, Q = {
  __name: "PlanCards",
  setup(U) {
    const { rows: i, failure: v, loaded: E, context: m } = D("plan list", ["plan.*", "phase.*", "task.*"]), h = /* @__PURE__ */ new Set(["completed", "cancelled"]), d = C("open"), p = C({}), k = r(() => i.value.filter((s) => !h.has(s.state))), f = r(() => i.value.filter((s) => h.has(s.state))), y = r(() => d.value === "open" ? k.value : f.value);
    V(i, async (s) => {
      if (m.shared) return;
      const a = await Promise.all(s.map((e) => m.read(`plan progress ${e.id}`)));
      p.value = Object.fromEntries(s.map((e, b) => [e.id, a[b].ok ? a[b].value : null]));
    }, { immediate: !0 });
    const P = (s) => {
      const a = p.value[s.id];
      return a && a.task_count ? Math.round(a.completed_count / a.task_count * 100) : 0;
    };
    return (s, a) => (n(), l("div", w, [
      o(E) ? o(v) ? (n(), l("p", F, t(o(v)), 1)) : (n(), l(g, { key: 2 }, [
        c("div", M, [
          u(o(B), {
            kind: "text",
            class: x(["plans-tab", { on: d.value === "open" }]),
            "data-tab": "open",
            onClick: a[0] || (a[0] = (e) => d.value = "open")
          }, {
            default: N(() => [
              _("Open " + t(k.value.length), 1)
            ]),
            _: 1
          }, 8, ["class"]),
          u(o(B), {
            kind: "text",
            class: x(["plans-tab", { on: d.value === "closed" }]),
            "data-tab": "closed",
            onClick: a[1] || (a[1] = (e) => d.value = "closed")
          }, {
            default: N(() => [
              _("Closed " + t(f.value.length), 1)
            ]),
            _: 1
          }, 8, ["class"])
        ]),
        y.value.length ? S("", !0) : (n(), l("p", R, t(d.value === "open" ? "No open plans" : "No closed plans"), 1)),
        c("div", T, [
          (n(!0), l(g, null, z(y.value, (e) => (n(), l("div", {
            key: e.id,
            class: "plan",
            "data-row": e.id
          }, [
            c("span", A, [
              u(o(L), {
                name: "plan",
                size: 12
              }),
              _(" Plan " + t(e.id), 1),
              c("span", G, t(e.state), 1)
            ]),
            c("span", H, t(e.title), 1),
            c("span", J, [
              c("span", {
                class: "plan-bar-fill",
                style: O({ width: `${P(e)}%` })
              }, null, 4)
            ]),
            p.value[e.id] ? (n(), l("span", K, t(p.value[e.id].completed_count) + " of " + t(p.value[e.id].task_count) + " tasks done · phase " + t(p.value[e.id].current_phase), 1)) : S("", !0)
          ], 8, q))), 128))
        ])
      ], 64)) : (n(), $(o(I), {
        key: 0,
        shape: "cards"
      }))
    ]));
  }
}, Z = /* @__PURE__ */ j(Q, [["__scopeId", "data-v-ac50e683"]]);
export {
  Z as default
};
