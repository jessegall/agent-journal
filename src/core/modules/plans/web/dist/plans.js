/* @code-commandments-generated */
if (!document.getElementById("window-styles-f49b1089a684")) { const style = document.createElement("style"); style.id = "window-styles-f49b1089a684"; style.textContent = ".plan-dock-phases[data-v-4f34e7f3]{margin:0;padding:0 12px 9px 16px;list-style:none}.plan-dock-phase[data-v-4f34e7f3]{display:grid;grid-template-columns:18px minmax(0,1fr) auto;align-items:center;column-gap:8px;height:24px;font-size:12.5px}.plan-dock-number[data-v-4f34e7f3]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-4f34e7f3]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-4f34e7f3]{color:var(--text-4)}.plan-dock-tasks[data-v-4f34e7f3]{color:var(--text-4);font-size:11.5px}.plans[data-v-462020cb]{display:flex;flex-direction:column;gap:14px}.plans-grid[data-v-462020cb]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}.plan[data-v-462020cb]{cursor:pointer;display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plan-head[data-v-462020cb]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-462020cb]{margin-left:auto;padding:1px 7px;border:1px solid var(--border-2);border-radius:999px;color:var(--text-2);font-size:11px}.plan-state.started[data-v-462020cb],.plan-state.completed[data-v-462020cb]{border-color:var(--tone-good, var(--green));color:var(--tone-good, var(--green))}.plan-state.blocked[data-v-462020cb]{border-color:var(--tone-warn);color:var(--tone-warn)}.plan-title[data-v-462020cb]{font-weight:500}.plan-bar[data-v-462020cb]{height:4px;border-radius:2px;background:var(--raised)}.plan-bar-fill[data-v-462020cb]{display:block;height:100%;border-radius:2px;background:var(--accent)}.plan-foot[data-v-462020cb],.plans-note[data-v-462020cb]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as v, computed as g, openBlock as o, createBlock as f, unref as r, withCtx as w, createElementVNode as u, createElementBlock as i, toDisplayString as d, Fragment as k, createVNode as x, createCommentVNode as y, renderList as E, withKeys as I, createTextVNode as h, normalizeClass as K, normalizeStyle as L } from "vue";
import { useWindow as R, WindowRoom as W, Skeleton as M, InnerTabs as T, peekRef as S, Icon as A, Btn as D } from "@journal/window-kit";
import { _ as F } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const G = { class: "plans" }, O = {
  key: 1,
  class: "plans-note"
}, j = {
  key: 0,
  class: "plans-note"
}, q = { class: "plans-grid" }, H = ["data-row", "onClick", "onKeydown"], J = { class: "plan-head" }, Q = { class: "plan-title" }, U = { class: "plan-bar" }, X = { class: "plan-foot" }, Y = 25, Z = {
  __name: "PlanCards",
  setup(ee) {
    var C;
    const c = R(), l = v((C = c.tabs) == null ? void 0 : C[0]), t = v({ open_total: 0, closed_total: 0, plans: [] }), p = v(""), b = v(!1), $ = () => l.value.read;
    async function m() {
      const a = l.value, n = t.value.plans.length, s = await c.read(c.shared ? `${c.shared.model} show ${c.shared.id}` : `${$()}${n > Y ? ` --limit ${n}` : ""}`);
      a === l.value && (p.value = s.ok ? "" : s.error, b.value = !0, s.ok && (t.value = c.shared ? { open_total: 1, closed_total: 0, plans: [{ task_count: 0, completed_count: 0, current_phase: 0, ...s.value }] } : s.value));
    }
    async function N() {
      if (!t.value.plans.length) return;
      const a = l.value, n = await c.read(`${$()} --before-id ${Math.min(...t.value.plans.map((e) => e.id))}`);
      if (a !== l.value) return;
      if (!n.ok) return void (p.value = n.error);
      const s = new Set(t.value.plans.map((e) => e.id));
      t.value = { ...n.value, plans: [...t.value.plans, ...n.value.plans.filter((e) => !s.has(e.id))] };
    }
    const B = (a) => {
      l.value = a, t.value = { ...t.value, plans: [] }, m();
    }, _ = g(() => t.value.plans), P = g(() => {
      var a;
      return t.value[(a = l.value) == null ? void 0 : a.count_field];
    }), V = (a) => a.task_count ? Math.round(a.completed_count / a.task_count * 100) : 0;
    return c.follow(["plan.*", "phase.*", "task.*"], m), m(), (a, n) => (o(), f(r(W), null, {
      default: w(() => {
        var s;
        return [
          u("div", G, [
            b.value ? p.value ? (o(), i("p", O, d(p.value), 1)) : (o(), i(k, { key: 2 }, [
              x(r(T), {
                active: l.value,
                answer: t.value,
                onChoose: B
              }, null, 8, ["active", "answer"]),
              _.value.length ? y("", !0) : (o(), i("p", j, "No " + d((s = l.value) == null ? void 0 : s.label.toLowerCase()) + " plans", 1)),
              u("div", q, [
                (o(!0), i(k, null, E(_.value, (e) => (o(), i("div", {
                  key: e.id,
                  class: "plan",
                  "data-row": e.id,
                  role: "button",
                  tabindex: "0",
                  onClick: (z) => r(S)(`plans:${e.id}`),
                  onKeydown: I((z) => r(S)(`plans:${e.id}`), ["enter"])
                }, [
                  u("span", J, [
                    x(r(A), {
                      name: "plan",
                      size: 12
                    }),
                    h(" Plan " + d(e.id), 1),
                    u("span", {
                      class: K(["plan-state", e.state]),
                      "data-plan-state": ""
                    }, d(e.state), 3)
                  ]),
                  u("span", Q, d(e.title), 1),
                  u("span", U, [
                    u("span", {
                      class: "plan-bar-fill",
                      style: L({ width: `${V(e)}%` })
                    }, null, 4)
                  ]),
                  u("span", X, [
                    h(d(e.completed_count) + " of " + d(e.task_count) + " tasks done", 1),
                    e.current_phase ? (o(), i(k, { key: 0 }, [
                      h(" · phase " + d(e.current_phase), 1)
                    ], 64)) : y("", !0)
                  ])
                ], 40, H))), 128))
              ]),
              _.value.length && _.value.length < P.value ? (o(), f(r(D), {
                key: 1,
                kind: "text",
                "data-plans-more": "",
                onClick: N
              }, {
                default: w(() => [...n[0] || (n[0] = [
                  h("Show more", -1)
                ])]),
                _: 1
              })) : y("", !0)
            ], 64)) : (o(), f(r(M), {
              key: 0,
              shape: "cards"
            }))
          ])
        ];
      }),
      _: 1
    }));
  }
}, se = /* @__PURE__ */ F(Z, [["__scopeId", "data-v-462020cb"]]);
export {
  se as default
};
