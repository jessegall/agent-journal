/* @code-commandments-generated */
if (!document.getElementById("window-styles-915b0357cb18")) { const style = document.createElement("style"); style.id = "window-styles-915b0357cb18"; style.textContent = ".plan-dock-agents[data-v-aa962e00]{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 6px 16px}.plan-dock-agent[data-v-aa962e00]{padding:0 8px;border:1px solid var(--border-2);border-radius:99px;background:none;color:var(--text-2);font:inherit;font-size:11.5px;line-height:20px;cursor:pointer}.plan-dock-phases[data-v-aa962e00]{margin:0;padding:0 12px 9px 16px;list-style:none}.plan-dock-phase[data-v-aa962e00]{display:grid;grid-template-columns:18px minmax(0,1fr) auto;align-items:center;column-gap:8px;height:24px;font-size:12.5px}.plan-dock-number[data-v-aa962e00]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-aa962e00]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-aa962e00]{color:var(--text-4)}.plan-dock-tasks[data-v-aa962e00]{color:var(--text-4);font-size:11.5px}.plans[data-v-d9eee9a9]{display:flex;flex-direction:column;gap:14px}.plans-grid[data-v-d9eee9a9]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}.plan[data-v-d9eee9a9]{cursor:pointer;display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plan-head[data-v-d9eee9a9]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-agents[data-v-d9eee9a9]{display:flex;flex-direction:column;gap:2px;color:var(--text-3);font-size:12px}.plan-agent strong[data-v-d9eee9a9]{color:var(--text-2);font-weight:500}.plan-state[data-v-d9eee9a9]{margin-left:auto;padding:1px 7px;border:1px solid var(--border-2);border-radius:999px;color:var(--text-2);font-size:11px}.plan-state.started[data-v-d9eee9a9],.plan-state.completed[data-v-d9eee9a9]{border-color:var(--tone-good, var(--green));color:var(--tone-good, var(--green))}.plan-state.blocked[data-v-d9eee9a9]{border-color:var(--tone-warn);color:var(--tone-warn)}.plan-title[data-v-d9eee9a9]{font-weight:500}.plan-bar[data-v-d9eee9a9]{height:4px;border-radius:2px;background:var(--raised)}.plan-bar-fill[data-v-d9eee9a9]{display:block;height:100%;border-radius:2px;background:var(--accent)}.plan-foot[data-v-d9eee9a9],.plans-note[data-v-d9eee9a9]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as k, computed as x, openBlock as n, createBlock as $, unref as p, withCtx as w, createElementVNode as d, createElementBlock as u, toDisplayString as s, Fragment as m, createVNode as S, createCommentVNode as f, renderList as N, withKeys as I, createTextVNode as _, normalizeClass as K, normalizeStyle as L } from "vue";
import { useWindow as R, WindowRoom as W, Skeleton as M, InnerTabs as T, peekRef as B, Icon as A, Btn as D } from "@journal/window-kit";
import { _ as F } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const G = { class: "plans" }, O = {
  key: 1,
  class: "plans-note"
}, j = {
  key: 0,
  class: "plans-note"
}, q = { class: "plans-grid" }, H = ["data-row", "onClick", "onKeydown"], J = { class: "plan-head" }, Q = { class: "plan-title" }, U = {
  key: 0,
  class: "plan-agents",
  "data-plan-agents": ""
}, X = { class: "plan-bar" }, Y = { class: "plan-foot" }, Z = 25, ee = {
  __name: "PlanCards",
  setup(ae) {
    var C;
    const r = R(), c = k((C = r.tabs) == null ? void 0 : C[0]), t = k({ open_total: 0, closed_total: 0, plans: [] }), v = k(""), b = k(!1), g = () => c.value.read;
    async function y() {
      const a = c.value, l = t.value.plans.length, o = await r.read(r.shared ? `${r.shared.model} show ${r.shared.id}` : `${g()}${l > Z ? ` --limit ${l}` : ""}`);
      a === c.value && (v.value = o.ok ? "" : o.error, b.value = !0, o.ok && (t.value = r.shared ? { open_total: 1, closed_total: 0, plans: [{ task_count: 0, completed_count: 0, current_phase: 0, ...o.value }] } : o.value));
    }
    async function P() {
      if (!t.value.plans.length) return;
      const a = c.value, l = await r.read(`${g()} --before-id ${Math.min(...t.value.plans.map((e) => e.id))}`);
      if (a !== c.value) return;
      if (!l.ok) return void (v.value = l.error);
      const o = new Set(t.value.plans.map((e) => e.id));
      t.value = { ...l.value, plans: [...t.value.plans, ...l.value.plans.filter((e) => !o.has(e.id))] };
    }
    const V = (a) => {
      c.value = a, t.value = { ...t.value, plans: [] }, y();
    }, h = x(() => t.value.plans), z = x(() => {
      var a;
      return t.value[(a = c.value) == null ? void 0 : a.count_field];
    }), E = (a) => a.task_count ? Math.round(a.completed_count / a.task_count * 100) : 0;
    return r.follow(["plan.*", "phase.*", "task.*"], y), y(), (a, l) => (n(), $(p(W), null, {
      default: w(() => {
        var o;
        return [
          d("div", G, [
            b.value ? v.value ? (n(), u("p", O, s(v.value), 1)) : (n(), u(m, { key: 2 }, [
              S(p(T), {
                active: c.value,
                answer: t.value,
                onChoose: V
              }, null, 8, ["active", "answer"]),
              h.value.length ? f("", !0) : (n(), u("p", j, "No " + s((o = c.value) == null ? void 0 : o.label.toLowerCase()) + " plans", 1)),
              d("div", q, [
                (n(!0), u(m, null, N(h.value, (e) => (n(), u("div", {
                  key: e.id,
                  class: "plan",
                  "data-row": e.id,
                  role: "button",
                  tabindex: "0",
                  onClick: (i) => p(B)(`plans:${e.id}`),
                  onKeydown: I((i) => p(B)(`plans:${e.id}`), ["enter"])
                }, [
                  d("span", J, [
                    S(p(A), {
                      name: "plan",
                      size: 12
                    }),
                    _(" Plan " + s(e.id), 1),
                    d("span", {
                      class: K(["plan-state", e.state]),
                      "data-plan-state": ""
                    }, s(e.state), 3)
                  ]),
                  d("span", Q, s(e.title), 1),
                  e.delegated ? (n(), u("span", U, [
                    (n(!0), u(m, null, N(e.agents, (i) => (n(), u("span", {
                      key: `${i.id}:${i.task_id}`,
                      class: "plan-agent",
                      "data-plan-agent": ""
                    }, [
                      d("strong", null, s(i.name), 1),
                      _(" task " + s(i.task_id) + ": " + s(i.task_title), 1)
                    ]))), 128))
                  ])) : f("", !0),
                  d("span", X, [
                    d("span", {
                      class: "plan-bar-fill",
                      style: L({ width: `${E(e)}%` })
                    }, null, 4)
                  ]),
                  d("span", Y, [
                    _(s(e.completed_count) + " of " + s(e.task_count) + " tasks done", 1),
                    e.current_phase ? (n(), u(m, { key: 0 }, [
                      _(" · phase " + s(e.current_phase), 1)
                    ], 64)) : f("", !0)
                  ])
                ], 40, H))), 128))
              ]),
              h.value.length && h.value.length < z.value ? (n(), $(p(D), {
                key: 1,
                kind: "text",
                "data-plans-more": "",
                onClick: P
              }, {
                default: w(() => [...l[0] || (l[0] = [
                  _("Show more", -1)
                ])]),
                _: 1
              })) : f("", !0)
            ], 64)) : (n(), $(p(M), {
              key: 0,
              shape: "cards"
            }))
          ])
        ];
      }),
      _: 1
    }));
  }
}, le = /* @__PURE__ */ F(ee, [["__scopeId", "data-v-d9eee9a9"]]);
export {
  le as default
};
