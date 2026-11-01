/* @code-commandments-generated */
if (!document.getElementById("window-styles-9373951f284c")) { const style = document.createElement("style"); style.id = "window-styles-9373951f284c"; style.textContent = ".plan-dock[data-v-d117f864]{display:flex;margin:0 14px 10px 36px;gap:8px;align-items:baseline;font-size:12px;line-height:1.45}.plan-dock-state[data-v-d117f864]{flex:none;padding:1px 8px;margin-left:-8px;border-radius:9px;background:var(--raised);color:var(--text-2)}.plan-dock-state.started[data-v-d117f864]{background:var(--accent-dim);color:var(--accent-text)}.plan-dock-state.waiting[data-v-d117f864]{background:color-mix(in srgb,var(--warn, #d9a441) 22%,transparent);color:var(--warn, #d9a441)}.plan-dock-state.cancelled[data-v-d117f864],.plan-dock-state.paused[data-v-d117f864]{color:var(--text-3)}.plan-dock-text[data-v-d117f864]{min-width:0;color:var(--text-3)}.plans[data-v-5b63e501]{display:flex;flex-direction:column;gap:14px}.plans-tabs[data-v-5b63e501]{display:flex;gap:14px}.plans-tab[data-v-5b63e501]{padding:0 0 4px;border:0;border-bottom:1px solid transparent;background:none;color:var(--text-3);font:inherit;font-size:11px;letter-spacing:.04em;text-transform:uppercase;cursor:pointer}.plans-tab.on[data-v-5b63e501]{border-bottom-color:var(--accent);color:var(--text)}.plans-grid[data-v-5b63e501]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}.plan[data-v-5b63e501]{cursor:pointer;display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plan-head[data-v-5b63e501]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-5b63e501]{margin-left:auto}.plan-title[data-v-5b63e501]{font-weight:500}.plan-bar[data-v-5b63e501]{height:4px;border-radius:2px;background:var(--raised)}.plan-bar-fill[data-v-5b63e501]{display:block;height:100%;border-radius:2px;background:var(--accent)}.plan-foot[data-v-5b63e501],.plans-note[data-v-5b63e501]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as C, computed as u, watch as V, openBlock as l, createElementBlock as o, unref as n, createBlock as z, toDisplayString as a, Fragment as x, createElementVNode as c, createVNode as _, normalizeClass as g, withCtx as $, createTextVNode as v, createCommentVNode as N, renderList as K, withKeys as O, normalizeStyle as w } from "vue";
import { useRows as D, Skeleton as I, Btn as S, peekRef as B, Icon as L } from "@journal/window-kit";
import { _ as R } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const j = { class: "plans" }, F = {
  key: 1,
  class: "plans-note"
}, M = { class: "plans-tabs" }, T = {
  key: 0,
  class: "plans-note"
}, q = { class: "plans-grid" }, A = ["data-row", "onClick", "onKeydown"], G = { class: "plan-head" }, H = { class: "plan-state" }, J = { class: "plan-title" }, Q = { class: "plan-bar" }, U = {
  key: 0,
  class: "plan-foot"
}, W = {
  __name: "PlanCards",
  setup(X) {
    const { rows: r, failure: h, loaded: E, context: m } = D("plan list", ["plan.*", "phase.*", "task.*"]), k = /* @__PURE__ */ new Set(["completed", "cancelled"]), d = C("open"), p = C({}), f = u(() => r.value.filter((s) => !k.has(s.state))), y = u(() => r.value.filter((s) => k.has(s.state))), b = u(() => d.value === "open" ? f.value : y.value);
    V(r, async (s) => {
      if (m.shared) return;
      const t = await Promise.all(s.map((e) => m.read(`plan progress ${e.id}`)));
      p.value = Object.fromEntries(s.map((e, i) => [e.id, t[i].ok ? t[i].value : null]));
    }, { immediate: !0 });
    const P = (s) => {
      const t = p.value[s.id];
      return t && t.task_count ? Math.round(t.completed_count / t.task_count * 100) : 0;
    };
    return (s, t) => (l(), o("div", j, [
      n(E) ? n(h) ? (l(), o("p", F, a(n(h)), 1)) : (l(), o(x, { key: 2 }, [
        c("div", M, [
          _(n(S), {
            kind: "text",
            class: g(["plans-tab", { on: d.value === "open" }]),
            "data-tab": "open",
            onClick: t[0] || (t[0] = (e) => d.value = "open")
          }, {
            default: $(() => [
              v("Open " + a(f.value.length), 1)
            ]),
            _: 1
          }, 8, ["class"]),
          _(n(S), {
            kind: "text",
            class: g(["plans-tab", { on: d.value === "closed" }]),
            "data-tab": "closed",
            onClick: t[1] || (t[1] = (e) => d.value = "closed")
          }, {
            default: $(() => [
              v("Closed " + a(y.value.length), 1)
            ]),
            _: 1
          }, 8, ["class"])
        ]),
        b.value.length ? N("", !0) : (l(), o("p", T, a(d.value === "open" ? "No open plans" : "No closed plans"), 1)),
        c("div", q, [
          (l(!0), o(x, null, K(b.value, (e) => (l(), o("div", {
            key: e.id,
            class: "plan",
            "data-row": e.id,
            role: "button",
            tabindex: "0",
            onClick: (i) => n(B)(`plans:${e.id}`),
            onKeydown: O((i) => n(B)(`plans:${e.id}`), ["enter"])
          }, [
            c("span", G, [
              _(n(L), {
                name: "plan",
                size: 12
              }),
              v(" Plan " + a(e.id), 1),
              c("span", H, a(e.state), 1)
            ]),
            c("span", J, a(e.title), 1),
            c("span", Q, [
              c("span", {
                class: "plan-bar-fill",
                style: w({ width: `${P(e)}%` })
              }, null, 4)
            ]),
            p.value[e.id] ? (l(), o("span", U, a(p.value[e.id].completed_count) + " of " + a(p.value[e.id].task_count) + " tasks done · phase " + a(p.value[e.id].current_phase), 1)) : N("", !0)
          ], 40, A))), 128))
        ])
      ], 64)) : (l(), z(n(I), {
        key: 0,
        shape: "cards"
      }))
    ]));
  }
}, te = /* @__PURE__ */ R(W, [["__scopeId", "data-v-5b63e501"]]);
export {
  te as default
};
