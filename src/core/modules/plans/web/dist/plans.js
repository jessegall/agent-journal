/* @code-commandments-generated */
if (!document.getElementById("window-styles-02acb64e6925")) { const style = document.createElement("style"); style.id = "window-styles-02acb64e6925"; style.textContent = ".plan-dock-phases[data-v-4f34e7f3]{margin:0;padding:0 12px 9px 16px;list-style:none}.plan-dock-phase[data-v-4f34e7f3]{display:grid;grid-template-columns:18px minmax(0,1fr) auto;align-items:center;column-gap:8px;height:24px;font-size:12.5px}.plan-dock-number[data-v-4f34e7f3]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-4f34e7f3]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-4f34e7f3]{color:var(--text-4)}.plan-dock-tasks[data-v-4f34e7f3]{color:var(--text-4);font-size:11.5px}.plans[data-v-164ac91f]{display:flex;flex-direction:column;gap:14px}.plans-tabs[data-v-164ac91f]{display:flex;gap:14px}.plans-tab[data-v-164ac91f]{padding:0 0 4px;border:0;border-bottom:1px solid transparent;background:none;color:var(--text-3);font:inherit;font-size:11px;letter-spacing:.04em;text-transform:uppercase;cursor:pointer}.plans-tab.on[data-v-164ac91f]{border-bottom-color:var(--accent);color:var(--text)}.plans-grid[data-v-164ac91f]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}.plan[data-v-164ac91f]{cursor:pointer;display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plan-head[data-v-164ac91f]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-164ac91f]{margin-left:auto}.plan-title[data-v-164ac91f]{font-weight:500}.plan-bar[data-v-164ac91f]{height:4px;border-radius:2px;background:var(--raised)}.plan-bar-fill[data-v-164ac91f]{display:block;height:100%;border-radius:2px;background:var(--accent)}.plan-foot[data-v-164ac91f],.plans-note[data-v-164ac91f]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as v, computed as x, openBlock as o, createElementBlock as i, createBlock as g, unref as u, toDisplayString as l, Fragment as w, createElementVNode as d, createVNode as f, normalizeClass as N, withCtx as m, createTextVNode as h, createCommentVNode as S, renderList as E, withKeys as K, normalizeStyle as I } from "vue";
import { useWindow as L, Skeleton as M, Btn as $, peekRef as B, Icon as O } from "@journal/window-kit";
import { _ as R } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const W = { class: "plans" }, A = {
  key: 1,
  class: "plans-note"
}, D = { class: "plans-tabs" }, F = {
  key: 0,
  class: "plans-note"
}, G = { class: "plans-grid" }, T = ["data-row", "onClick", "onKeydown"], j = { class: "plan-head" }, q = { class: "plan-state" }, H = { class: "plan-title" }, J = { class: "plan-bar" }, Q = { class: "plan-foot" }, U = 25, X = {
  __name: "PlanCards",
  setup(Y) {
    const c = L(), n = v("open"), a = v({ open_total: 0, closed_total: 0, plans: [] }), r = v(""), b = v(!1), y = () => `plan board${n.value === "closed" ? " --closed" : ""}`;
    async function k() {
      const s = n.value, t = a.value.plans.length, e = await c.read(c.shared ? `${c.shared.model} show ${c.shared.id}` : `${y()}${t > U ? ` --limit ${t}` : ""}`);
      s === n.value && (r.value = e.ok ? "" : e.error, b.value = !0, e.ok && (a.value = c.shared ? { open_total: 1, closed_total: 0, plans: [{ task_count: 0, completed_count: 0, current_phase: 0, ...e.value }] } : e.value));
    }
    async function P() {
      if (!a.value.plans.length) return;
      const s = n.value, t = await c.read(`${y()} --before-id ${Math.min(...a.value.plans.map((p) => p.id))}`);
      if (s !== n.value) return;
      if (!t.ok) return void (r.value = t.error);
      const e = new Set(a.value.plans.map((p) => p.id));
      a.value = { ...t.value, plans: [...a.value.plans, ...t.value.plans.filter((p) => !e.has(p.id))] };
    }
    const C = (s) => {
      n.value = s, a.value = { ...a.value, plans: [] }, k();
    }, _ = x(() => a.value.plans), V = x(() => n.value === "open" ? a.value.open_total : a.value.closed_total), z = (s) => s.task_count ? Math.round(s.completed_count / s.task_count * 100) : 0;
    return c.follow(["plan.*", "phase.*", "task.*"], k), k(), (s, t) => (o(), i("div", W, [
      b.value ? r.value ? (o(), i("p", A, l(r.value), 1)) : (o(), i(w, { key: 2 }, [
        d("div", D, [
          f(u($), {
            kind: "text",
            class: N(["plans-tab", { on: n.value === "open" }]),
            "data-tab": "open",
            onClick: t[0] || (t[0] = (e) => C("open"))
          }, {
            default: m(() => [
              h("Open " + l(a.value.open_total), 1)
            ]),
            _: 1
          }, 8, ["class"]),
          f(u($), {
            kind: "text",
            class: N(["plans-tab", { on: n.value === "closed" }]),
            "data-tab": "closed",
            onClick: t[1] || (t[1] = (e) => C("closed"))
          }, {
            default: m(() => [
              h("Closed " + l(a.value.closed_total), 1)
            ]),
            _: 1
          }, 8, ["class"])
        ]),
        _.value.length ? S("", !0) : (o(), i("p", F, l(n.value === "open" ? "No open plans" : "No closed plans"), 1)),
        d("div", G, [
          (o(!0), i(w, null, E(_.value, (e) => (o(), i("div", {
            key: e.id,
            class: "plan",
            "data-row": e.id,
            role: "button",
            tabindex: "0",
            onClick: (p) => u(B)(`plans:${e.id}`),
            onKeydown: K((p) => u(B)(`plans:${e.id}`), ["enter"])
          }, [
            d("span", j, [
              f(u(O), {
                name: "plan",
                size: 12
              }),
              h(" Plan " + l(e.id), 1),
              d("span", q, l(e.state), 1)
            ]),
            d("span", H, l(e.title), 1),
            d("span", J, [
              d("span", {
                class: "plan-bar-fill",
                style: I({ width: `${z(e)}%` })
              }, null, 4)
            ]),
            d("span", Q, l(e.completed_count) + " of " + l(e.task_count) + " tasks done · phase " + l(e.current_phase), 1)
          ], 40, T))), 128))
        ]),
        _.value.length && _.value.length < V.value ? (o(), g(u($), {
          key: 1,
          kind: "text",
          "data-plans-more": "",
          onClick: P
        }, {
          default: m(() => [...t[2] || (t[2] = [
            h("Show more", -1)
          ])]),
          _: 1
        })) : S("", !0)
      ], 64)) : (o(), g(u(M), {
        key: 0,
        shape: "cards"
      }))
    ]));
  }
}, te = /* @__PURE__ */ R(X, [["__scopeId", "data-v-164ac91f"]]);
export {
  te as default
};
