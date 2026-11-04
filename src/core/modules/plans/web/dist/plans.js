/* @code-commandments-generated */
if (!document.getElementById("window-styles-4605da24eb5d")) { const style = document.createElement("style"); style.id = "window-styles-4605da24eb5d"; style.textContent = ".plan-dock-agents[data-v-aa962e00]{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 6px 16px}.plan-dock-agent[data-v-aa962e00]{padding:0 8px;border:1px solid var(--border-2);border-radius:99px;background:none;color:var(--text-2);font:inherit;font-size:11.5px;line-height:20px;cursor:pointer}.plan-dock-phases[data-v-aa962e00]{margin:0;padding:0 12px 9px 16px;list-style:none}.plan-dock-phase[data-v-aa962e00]{display:grid;grid-template-columns:18px minmax(0,1fr) auto;align-items:center;column-gap:8px;height:24px;font-size:12.5px}.plan-dock-number[data-v-aa962e00]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-aa962e00]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-aa962e00]{color:var(--text-4)}.plan-dock-tasks[data-v-aa962e00]{color:var(--text-4);font-size:11.5px}.plans[data-v-b67ba505]{display:flex;flex-direction:column;gap:14px}.plans-grid[data-v-b67ba505]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}.plan[data-v-b67ba505]{cursor:pointer;display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plan-head[data-v-b67ba505]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-agents[data-v-b67ba505]{display:flex;flex-direction:column;gap:2px;color:var(--text-3);font-size:12px}.plan-agent strong[data-v-b67ba505]{color:var(--text-2);font-weight:500}.plan-state[data-v-b67ba505]{margin-left:auto;padding:1px 7px;border:1px solid var(--border-2);border-radius:999px;color:var(--text-2);font-size:11px}.plan-state.started[data-v-b67ba505],.plan-state.completed[data-v-b67ba505]{border-color:var(--tone-good, var(--green));color:var(--tone-good, var(--green))}.plan-state.blocked[data-v-b67ba505]{border-color:var(--tone-warn);color:var(--tone-warn)}.plan-title[data-v-b67ba505]{font-weight:500}.plan-bar[data-v-b67ba505]{height:4px;border-radius:2px;background:var(--raised)}.plan-bar-fill[data-v-b67ba505]{display:block;height:100%;border-radius:2px;background:var(--accent)}.plan-foot[data-v-b67ba505],.plans-note[data-v-b67ba505]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as m, computed as x, openBlock as a, createBlock as y, unref as p, withCtx as S, createElementVNode as u, createElementBlock as o, toDisplayString as n, Fragment as v, createVNode as N, createCommentVNode as f, renderList as b, withKeys as I, createTextVNode as _, normalizeClass as K, normalizeStyle as L } from "vue";
import { useWindow as R, WindowRoom as T, Skeleton as W, InnerTabs as M, peekRef as B, Icon as A, Btn as D } from "@journal/window-kit";
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
}, X = {
  key: 1,
  class: "plan-agents",
  "data-plan-working": ""
}, Y = { class: "plan-bar" }, Z = { class: "plan-foot" }, ee = 25, ae = {
  __name: "PlanCards",
  setup(te) {
    var C;
    const i = R(), c = m((C = i.tabs) == null ? void 0 : C[0]), s = m({ open_total: 0, closed_total: 0, plans: [] }), k = m(""), $ = m(!1), w = () => c.value.read;
    async function g() {
      const t = c.value, l = s.value.plans.length, r = await i.read(i.shared ? `${i.shared.model} show ${i.shared.id}` : `${w()}${l > ee ? ` --limit ${l}` : ""}`);
      t === c.value && (k.value = r.ok ? "" : r.error, $.value = !0, r.ok && (s.value = i.shared ? { open_total: 1, closed_total: 0, plans: [{ task_count: 0, completed_count: 0, current_phase: 0, working: [], ...r.value }] } : r.value));
    }
    async function P() {
      if (!s.value.plans.length) return;
      const t = c.value, l = await i.read(`${w()} --before-id ${Math.min(...s.value.plans.map((e) => e.id))}`);
      if (t !== c.value) return;
      if (!l.ok) return void (k.value = l.error);
      const r = new Set(s.value.plans.map((e) => e.id));
      s.value = { ...l.value, plans: [...s.value.plans, ...l.value.plans.filter((e) => !r.has(e.id))] };
    }
    const V = (t) => {
      c.value = t, s.value = { ...s.value, plans: [] }, g();
    }, h = x(() => s.value.plans), z = x(() => {
      var t;
      return s.value[(t = c.value) == null ? void 0 : t.count_field];
    }), E = (t) => t.task_count ? Math.round(t.completed_count / t.task_count * 100) : 0;
    return i.follow(["plan.*", "phase.*", "task.*"], g), g(), (t, l) => (a(), y(p(T), null, {
      default: S(() => {
        var r;
        return [
          u("div", G, [
            $.value ? k.value ? (a(), o("p", O, n(k.value), 1)) : (a(), o(v, { key: 2 }, [
              N(p(M), {
                active: c.value,
                answer: s.value,
                onChoose: V
              }, null, 8, ["active", "answer"]),
              h.value.length ? f("", !0) : (a(), o("p", j, "No " + n((r = c.value) == null ? void 0 : r.label.toLowerCase()) + " plans", 1)),
              u("div", q, [
                (a(!0), o(v, null, b(h.value, (e) => (a(), o("div", {
                  key: e.id,
                  class: "plan",
                  "data-row": e.id,
                  role: "button",
                  tabindex: "0",
                  onClick: (d) => p(B)(`plans:${e.id}`),
                  onKeydown: I((d) => p(B)(`plans:${e.id}`), ["enter"])
                }, [
                  u("span", J, [
                    N(p(A), {
                      name: "plan",
                      size: 12
                    }),
                    _(" Plan " + n(e.id), 1),
                    u("span", {
                      class: K(["plan-state", e.state]),
                      "data-plan-state": ""
                    }, n(e.state), 3)
                  ]),
                  u("span", Q, n(e.title), 1),
                  e.delegated ? (a(), o("span", U, [
                    (a(!0), o(v, null, b(e.agents, (d) => (a(), o("span", {
                      key: `${d.id}:${d.task_id}`,
                      class: "plan-agent",
                      "data-plan-agent": ""
                    }, [
                      u("strong", null, n(d.name), 1),
                      _(" task " + n(d.task_id) + ": " + n(d.task_title), 1)
                    ]))), 128))
                  ])) : e.working.length ? (a(), o("span", X, [
                    l[0] || (l[0] = u("span", null, "Task being worked on", -1)),
                    (a(!0), o(v, null, b(e.working, (d) => (a(), o("span", {
                      key: d.id,
                      class: "plan-agent",
                      "data-plan-working-task": ""
                    }, [
                      u("strong", null, n(d.id), 1),
                      _(" " + n(d.title), 1)
                    ]))), 128))
                  ])) : f("", !0),
                  u("span", Y, [
                    u("span", {
                      class: "plan-bar-fill",
                      style: L({ width: `${E(e)}%` })
                    }, null, 4)
                  ]),
                  u("span", Z, [
                    _(n(e.completed_count) + " of " + n(e.task_count) + " tasks done", 1),
                    e.current_phase ? (a(), o(v, { key: 0 }, [
                      _(" · phase " + n(e.current_phase), 1)
                    ], 64)) : f("", !0)
                  ])
                ], 40, H))), 128))
              ]),
              h.value.length && h.value.length < z.value ? (a(), y(p(D), {
                key: 1,
                kind: "text",
                "data-plans-more": "",
                onClick: P
              }, {
                default: S(() => [...l[1] || (l[1] = [
                  _("Show more", -1)
                ])]),
                _: 1
              })) : f("", !0)
            ], 64)) : (a(), y(p(W), {
              key: 0,
              shape: "cards"
            }))
          ])
        ];
      }),
      _: 1
    }));
  }
}, oe = /* @__PURE__ */ F(ae, [["__scopeId", "data-v-b67ba505"]]);
export {
  oe as default
};
