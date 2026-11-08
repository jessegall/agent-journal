/* @code-commandments-generated */
if (!document.getElementById("window-styles-6424ed44b9c0")) { const style = document.createElement("style"); style.id = "window-styles-6424ed44b9c0"; style.textContent = ".plan-dock-agents[data-v-e1c7afc3]{display:flex;flex-wrap:wrap;gap:6px;padding:7px 14px 0 36px;align-items:center;color:var(--text-3);font-size:12px}.plan-dock-agent[data-v-e1c7afc3]{padding:0 8px;height:20px;border:1px solid var(--border-2);border-radius:99px;background:none;color:var(--text-2);font:inherit;font-size:11.5px;line-height:20px;cursor:pointer}.plan-dock-phases[data-v-e1c7afc3]{margin:0;padding:4px 14px 5px;list-style:none}.plan-dock-phase[data-v-e1c7afc3]{display:grid;grid-template-columns:22px minmax(0,1fr) auto;align-items:center;height:24px;font-size:12.5px}.plan-dock-number[data-v-e1c7afc3]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-e1c7afc3]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-e1c7afc3]{color:var(--text-4)}.plan-dock-tasks[data-v-e1c7afc3]{color:var(--text-4);font-size:11.5px}.plan-dock-agent[data-v-e1c7afc3]:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.plan-dock-phase.current .plan-dock-name[data-v-e1c7afc3]{color:var(--text)}.plan-dock-phase.current .plan-dock-tasks[data-v-e1c7afc3]{color:var(--text-3)}.plan-dock-loading[data-v-e1c7afc3]{margin:8px 36px}.plan-agents[data-v-b925bf06]{display:flex;align-items:center;min-width:0;height:34px;margin:2px -14px 0;padding:0 14px;border-top:1px solid var(--border-inner);color:var(--text-3);font-size:12px}.plan-agents-none[data-v-b925bf06]{color:var(--text-4)}.plan-agents-button[data-v-b925bf06]{display:inline-flex;gap:5px;align-items:center;min-width:0;margin-left:-6px;padding:3px 6px;overflow:hidden;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.plan-agents-button[data-v-b925bf06]:hover{background:var(--hover);color:var(--text)}.plans[data-v-2fdaa18b]{display:flex;flex-direction:column}.plans-grid[data-v-2fdaa18b]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));margin-right:-1px}.plan[data-v-2fdaa18b]{cursor:pointer;display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 0;border-right:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg)}.plan[data-v-2fdaa18b]:hover{background:var(--raised)}.plan-head[data-v-2fdaa18b]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-2fdaa18b]{margin-left:auto;padding:1px 7px;border:1px solid var(--border-2);border-radius:999px;color:var(--text-2);font-size:11px}.plan-state.started[data-v-2fdaa18b],.plan-state.completed[data-v-2fdaa18b]{border-color:var(--tone-good, var(--green));color:var(--tone-good, var(--green))}.plan-state.blocked[data-v-2fdaa18b]{border-color:var(--tone-warn);color:var(--tone-warn)}.plan-title[data-v-2fdaa18b]{overflow:hidden;font-weight:500;text-overflow:ellipsis;white-space:nowrap}.plan-bar[data-v-2fdaa18b]{display:flex;height:4px;overflow:hidden;border-radius:2px;background:var(--chip)}.plan-bar-fill[data-v-2fdaa18b]{display:block;height:100%;background:var(--accent)}.plan-bar-testing[data-v-2fdaa18b]{display:block;height:100%;background:color-mix(in srgb,var(--accent) 40%,transparent)}.plan-foot[data-v-2fdaa18b],.plans-note[data-v-2fdaa18b]{margin:0;color:var(--text-3);font-size:12px}.plans-note[data-v-2fdaa18b],[data-plans-more][data-v-2fdaa18b]{padding:8px 14px}\n"; document.head.appendChild(style); }
import { computed as h, ref as $, openBlock as l, createElementBlock as i, withKeys as z, withModifiers as P, toDisplayString as d, Fragment as C, createElementVNode as v, createTextVNode as k, createVNode as g, unref as o, createBlock as x, withCtx as b, renderList as L, createCommentVNode as A, watch as B, normalizeClass as F, normalizeStyle as K } from "vue";
import { Icon as V, MenuPanel as O, MenuLabel as q, MenuItem as D, peekRef as S, useWindow as G, afterSkeletonMinimum as j, WindowRoom as H, Skeleton as J, InnerTabs as Q, TabBody as U, StateBadge as X, stateLook as Y, Btn as Z } from "@journal/window-kit";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const ee = {
  key: 0,
  class: "plan-agents-none",
  "data-plan-agents-none": ""
}, ae = ["title"], te = ["aria-expanded"], ne = {
  __name: "PlanAgents",
  props: { planId: { type: Number, required: !0 }, agents: { type: Array, default: () => [] } },
  setup(M) {
    const e = M, s = h(() => [...new Map(e.agents.map((p) => [p.id, p])).values()]), y = $(null), r = $(!1), n = (p) => S(`agents:${p.id}`);
    return (p, u) => (l(), i("span", {
      class: "plan-agents",
      "data-plan-agents": "",
      onClick: u[3] || (u[3] = P(() => {
      }, ["stop"])),
      onKeydown: u[4] || (u[4] = z(P(() => {
      }, ["stop"]), ["enter"]))
    }, [
      s.value.length ? s.value.length === 1 ? (l(), i("button", {
        key: 1,
        type: "button",
        class: "plan-agents-button",
        title: `Open ${s.value[0].name}`,
        "data-plan-agent": "",
        onClick: u[0] || (u[0] = (c) => n(s.value[0]))
      }, "Agent: " + d(s.value[0].name), 9, ae)) : (l(), i(C, { key: 2 }, [
        v("button", {
          ref_key: "anchor",
          ref: y,
          type: "button",
          class: "plan-agents-button",
          "aria-expanded": r.value,
          "data-plan-agents-list": "",
          onClick: u[1] || (u[1] = (c) => r.value = !r.value)
        }, [
          k(" Agents: " + d(s.value.length) + " ", 1),
          g(o(V), {
            name: "down",
            size: 11
          })
        ], 8, te),
        r.value ? (l(), x(o(O), {
          key: 0,
          anchor: y.value,
          "min-width": 200,
          "data-plan-agents-menu": "",
          onClose: u[2] || (u[2] = (c) => r.value = !1)
        }, {
          default: b(() => [
            g(o(q), null, {
              default: b(() => [
                k("Agents on plan " + d(M.planId), 1)
              ]),
              _: 1
            }),
            (l(!0), i(C, null, L(s.value, (c) => (l(), x(o(D), {
              key: c.id,
              "data-plan-agent": "",
              onClick: (I) => n(c)
            }, {
              default: b(() => [
                k(d(c.name), 1)
              ]),
              _: 2
            }, 1032, ["onClick"]))), 128))
          ]),
          _: 1
        }, 8, ["anchor"])) : A("", !0)
      ], 64)) : (l(), i("span", ee, "No agent assigned"))
    ], 32));
  }
}, le = /* @__PURE__ */ E(ne, [["__scopeId", "data-v-b925bf06"]]), se = { class: "plans" }, oe = {
  key: 1,
  class: "plans-note"
}, ue = {
  key: 0,
  class: "plans-note"
}, de = { class: "plans-grid" }, ie = ["data-row", "onClick", "onKeydown"], pe = { class: "plan-head" }, re = ["title"], ce = { class: "plan-bar" }, ve = { class: "plan-foot" }, _e = 25, fe = {
  __name: "PlanCards",
  setup(M) {
    const e = G();
    e.state.tab = e.shared ? "shared" : e.tabs[0].key;
    const s = h(() => e.tabs.find((t) => t.key === e.state.tab) ?? e.tabs[0]), y = h(() => e.shared ? `plan.${e.shared.id}` : e.state.tab), r = h(() => e.props[y.value]), n = $({ open_total: 0, closed_total: 0, plans: [] }), p = $(""), u = h(() => p.value || r.value.failure.value), c = $(!1), I = performance.now();
    B(() => r.value.loaded.value, (t) => {
      t && j(I, () => c.value = !0);
    }, { immediate: !0 }), B(() => r.value.data.value, (t) => {
      t && (p.value = "", n.value = e.shared ? { open_total: 1, closed_total: 0, plans: [{ task_count: 0, completed_count: 0, current_phase: 0, agents: [], ...t }] } : t);
    }, { immediate: !0 });
    async function R() {
      if (!n.value.plans.length) return;
      const t = s.value, _ = `older-${t.key}`;
      if (e.state[`${_}.before-id`] = Math.min(...n.value.plans.map((m) => m.id)), await e.reload(_), t !== s.value) return;
      const f = e.props[_];
      if (f.failure.value) return void (p.value = f.failure.value);
      const a = new Set(n.value.plans.map((m) => m.id));
      n.value = { ...f.data.value, plans: [...n.value.plans, ...f.data.value.plans.filter((m) => !a.has(m.id))] }, n.value.plans.length > _e && (e.state[`${t.key}.limit`] = n.value.plans.length);
    }
    const T = (t) => {
      t.key !== e.state.tab && (e.state.tab = t.key, n.value = { ...n.value, plans: [] }, p.value = "");
    }, w = h(() => n.value.plans), W = h(() => {
      var t;
      return n.value[(t = s.value) == null ? void 0 : t.count_field];
    }), N = (t, _) => t.task_count ? Math.round(_ / t.task_count * 100) : 0;
    return e.shared && (e.reload(y.value), e.follow(["plan.*", "phase.*", "task.*"], () => e.reload(y.value))), (t, _) => (l(), x(o(H), { padding: "0" }, {
      default: b(() => [
        v("div", se, [
          c.value ? u.value ? (l(), i("p", oe, d(u.value), 1)) : (l(), i(C, { key: 2 }, [
            g(o(Q), {
              active: s.value,
              answer: n.value,
              onChoose: T
            }, null, 8, ["active", "answer"]),
            g(o(U), {
              tab: s.value,
              shape: "cards"
            }, {
              default: b(() => {
                var f;
                return [
                  w.value.length ? A("", !0) : (l(), i("p", ue, "No " + d((f = s.value) == null ? void 0 : f.label.toLowerCase()) + " plans", 1)),
                  v("div", de, [
                    (l(!0), i(C, null, L(w.value, (a) => (l(), i("div", {
                      key: a.id,
                      class: "plan",
                      "data-row": a.id,
                      role: "button",
                      tabindex: "0",
                      onClick: (m) => o(S)(`plans:${a.id}`),
                      onKeydown: z((m) => o(S)(`plans:${a.id}`), ["enter"])
                    }, [
                      v("span", pe, [
                        g(o(V), {
                          name: "plan",
                          size: 12
                        }),
                        k(" Plan " + d(a.id), 1),
                        g(o(X), {
                          type: "plan",
                          state: a.state,
                          "row-id": a.id,
                          class: F(["plan-state", o(Y)("plan", a.state)]),
                          "data-plan-state": ""
                        }, null, 8, ["state", "row-id", "class"])
                      ]),
                      v("span", {
                        class: "plan-title",
                        title: a.title
                      }, d(a.title), 9, re),
                      v("span", ce, [
                        v("span", {
                          class: "plan-bar-fill",
                          style: K({ width: `${N(a, a.completed_count)}%` })
                        }, null, 4),
                        v("span", {
                          class: "plan-bar-testing",
                          "data-plan-testing": "",
                          style: K({ width: `${N(a, a.testing_count)}%` })
                        }, null, 4)
                      ]),
                      v("span", ve, [
                        k(d(a.completed_count) + " of " + d(a.task_count) + " tasks done", 1),
                        a.current_phase ? (l(), i(C, { key: 0 }, [
                          k(" · phase " + d(a.current_phase), 1)
                        ], 64)) : A("", !0)
                      ]),
                      g(le, {
                        "plan-id": a.id,
                        agents: a.agents
                      }, null, 8, ["plan-id", "agents"])
                    ], 40, ie))), 128))
                  ]),
                  w.value.length && w.value.length < W.value ? (l(), x(o(Z), {
                    key: 1,
                    variant: "text",
                    "data-plans-more": "",
                    onClick: R
                  }, {
                    default: b(() => [..._[0] || (_[0] = [
                      k("Show more", -1)
                    ])]),
                    _: 1
                  })) : A("", !0)
                ];
              }),
              _: 1
            }, 8, ["tab"])
          ], 64)) : (l(), x(o(J), {
            key: 0,
            shape: "cards"
          }))
        ])
      ]),
      _: 1
    }));
  }
}, ke = /* @__PURE__ */ E(fe, [["__scopeId", "data-v-2fdaa18b"]]);
export {
  ke as default
};
