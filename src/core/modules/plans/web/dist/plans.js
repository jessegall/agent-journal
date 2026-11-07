/* @code-commandments-generated */
if (!document.getElementById("window-styles-69c5654aa472")) { const style = document.createElement("style"); style.id = "window-styles-69c5654aa472"; style.textContent = ".plan-dock-agents[data-v-98152033]{display:flex;flex-wrap:wrap;gap:6px;padding:7px 14px 0 36px;align-items:center;color:var(--text-3);font-size:12px}.plan-dock-agent[data-v-98152033]{padding:0 8px;height:20px;border:1px solid var(--border-2);border-radius:99px;background:none;color:var(--text-2);font:inherit;font-size:11.5px;line-height:20px;cursor:pointer}.plan-dock-phases[data-v-98152033]{margin:0;padding:4px 14px 5px;list-style:none}.plan-dock-phase[data-v-98152033]{display:grid;grid-template-columns:22px minmax(0,1fr) auto;align-items:center;height:24px;font-size:12.5px}.plan-dock-number[data-v-98152033]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-98152033]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-98152033]{color:var(--text-4)}.plan-dock-tasks[data-v-98152033]{color:var(--text-4);font-size:11.5px}.plan-dock-agent[data-v-98152033]:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.plan-dock-phase.current .plan-dock-name[data-v-98152033]{color:var(--text)}.plan-dock-phase.current .plan-dock-tasks[data-v-98152033]{color:var(--text-3)}.plan-dock-loading[data-v-98152033]{margin:8px 36px}.plan-agents[data-v-c34d84f7]{display:flex;align-items:center;min-width:0;height:34px;margin:2px -14px 0;padding:0 14px;border-top:1px solid var(--border-inner);color:var(--text-3);font-size:12px}.plan-agents-none[data-v-c34d84f7]{color:var(--text-4)}.plan-agents-button[data-v-c34d84f7]{display:inline-flex;gap:5px;align-items:center;min-width:0;margin-left:-6px;padding:3px 6px;overflow:hidden;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.plan-agents-button[data-v-c34d84f7]:hover{background:var(--hover);color:var(--text)}.plans[data-v-d8566e97]{display:flex;flex-direction:column}.plans-grid[data-v-d8566e97]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));margin-right:-1px}.plan[data-v-d8566e97]{cursor:pointer;display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 0;border-right:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg)}.plan[data-v-d8566e97]:hover{background:var(--raised)}.plan-head[data-v-d8566e97]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-d8566e97]{margin-left:auto;padding:1px 7px;border:1px solid var(--border-2);border-radius:999px;color:var(--text-2);font-size:11px}.plan-state.started[data-v-d8566e97],.plan-state.completed[data-v-d8566e97]{border-color:var(--tone-good, var(--green));color:var(--tone-good, var(--green))}.plan-state.blocked[data-v-d8566e97]{border-color:var(--tone-warn);color:var(--tone-warn)}.plan-title[data-v-d8566e97]{overflow:hidden;font-weight:500;text-overflow:ellipsis;white-space:nowrap}.plan-bar[data-v-d8566e97]{display:flex;height:4px;overflow:hidden;border-radius:2px;background:var(--chip)}.plan-bar-fill[data-v-d8566e97]{display:block;height:100%;background:var(--accent)}.plan-bar-testing[data-v-d8566e97]{display:block;height:100%;background:color-mix(in srgb,var(--accent) 40%,transparent)}.plan-foot[data-v-d8566e97],.plans-note[data-v-d8566e97]{margin:0;color:var(--text-3);font-size:12px}.plans-note[data-v-d8566e97],[data-plans-more][data-v-d8566e97]{padding:8px 14px}\n"; document.head.appendChild(style); }
import { computed as h, ref as $, openBlock as l, createElementBlock as i, withKeys as L, withModifiers as S, toDisplayString as d, Fragment as C, createElementVNode as r, createTextVNode as k, createVNode as y, unref as o, createBlock as x, withCtx as b, renderList as z, createCommentVNode as w, watch as B, normalizeClass as F, normalizeStyle as K } from "vue";
import { Icon as V, MenuPanel as O, MenuLabel as q, MenuItem as D, peekRef as I, useWindow as G, afterSkeletonMinimum as j, WindowRoom as H, Skeleton as J, InnerTabs as Q, TabBody as U, stateLook as X, stateLabel as Y, Btn as Z } from "@journal/window-kit";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const ee = {
  key: 0,
  class: "plan-agents-none",
  "data-plan-agents-none": ""
}, ae = ["title"], te = ["aria-expanded"], ne = {
  __name: "PlanAgents",
  props: { planId: { type: Number, required: !0 }, agents: { type: Array, default: () => [] } },
  setup(M) {
    const e = M, s = h(() => [...new Map(e.agents.map((p) => [p.id, p])).values()]), g = $(null), c = $(!1), n = (p) => I(`agents:${p.id}`);
    return (p, u) => (l(), i("span", {
      class: "plan-agents",
      "data-plan-agents": "",
      onClick: u[3] || (u[3] = S(() => {
      }, ["stop"])),
      onKeydown: u[4] || (u[4] = L(S(() => {
      }, ["stop"]), ["enter"]))
    }, [
      s.value.length ? s.value.length === 1 ? (l(), i("button", {
        key: 1,
        type: "button",
        class: "plan-agents-button",
        title: `Open ${s.value[0].name}`,
        "data-plan-agent": "",
        onClick: u[0] || (u[0] = (v) => n(s.value[0]))
      }, "Agent: " + d(s.value[0].name), 9, ae)) : (l(), i(C, { key: 2 }, [
        r("button", {
          ref_key: "anchor",
          ref: g,
          type: "button",
          class: "plan-agents-button",
          "aria-expanded": c.value,
          "data-plan-agents-list": "",
          onClick: u[1] || (u[1] = (v) => c.value = !c.value)
        }, [
          k(" Agents: " + d(s.value.length) + " ", 1),
          y(o(V), {
            name: "down",
            size: 11
          })
        ], 8, te),
        c.value ? (l(), x(o(O), {
          key: 0,
          anchor: g.value,
          "min-width": 200,
          "data-plan-agents-menu": "",
          onClose: u[2] || (u[2] = (v) => c.value = !1)
        }, {
          default: b(() => [
            y(o(q), null, {
              default: b(() => [
                k("Agents on plan " + d(M.planId), 1)
              ]),
              _: 1
            }),
            (l(!0), i(C, null, z(s.value, (v) => (l(), x(o(D), {
              key: v.id,
              "data-plan-agent": "",
              onClick: (N) => n(v)
            }, {
              default: b(() => [
                k(d(v.name), 1)
              ]),
              _: 2
            }, 1032, ["onClick"]))), 128))
          ]),
          _: 1
        }, 8, ["anchor"])) : w("", !0)
      ], 64)) : (l(), i("span", ee, "No agent assigned"))
    ], 32));
  }
}, le = /* @__PURE__ */ E(ne, [["__scopeId", "data-v-c34d84f7"]]), se = { class: "plans" }, oe = {
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
    const s = h(() => e.tabs.find((a) => a.key === e.state.tab) ?? e.tabs[0]), g = h(() => e.shared ? `plan.${e.shared.id}` : e.state.tab), c = h(() => e.props[g.value]), n = $({ open_total: 0, closed_total: 0, plans: [] }), p = $(""), u = h(() => p.value || c.value.failure.value), v = $(!1), N = performance.now();
    B(() => c.value.loaded.value, (a) => {
      a && j(N, () => v.value = !0);
    }, { immediate: !0 }), B(() => c.value.data.value, (a) => {
      a && (p.value = "", n.value = e.shared ? { open_total: 1, closed_total: 0, plans: [{ task_count: 0, completed_count: 0, current_phase: 0, agents: [], ...a }] } : a);
    }, { immediate: !0 });
    async function R() {
      if (!n.value.plans.length) return;
      const a = s.value, _ = `older-${a.key}`;
      if (e.state[`${_}.before-id`] = Math.min(...n.value.plans.map((m) => m.id)), await e.reload(_), a !== s.value) return;
      const f = e.props[_];
      if (f.failure.value) return void (p.value = f.failure.value);
      const t = new Set(n.value.plans.map((m) => m.id));
      n.value = { ...f.data.value, plans: [...n.value.plans, ...f.data.value.plans.filter((m) => !t.has(m.id))] }, n.value.plans.length > _e && (e.state[`${a.key}.limit`] = n.value.plans.length);
    }
    const T = (a) => {
      a.key !== e.state.tab && (e.state.tab = a.key, n.value = { ...n.value, plans: [] }, p.value = "");
    }, A = h(() => n.value.plans), W = h(() => {
      var a;
      return n.value[(a = s.value) == null ? void 0 : a.count_field];
    }), P = (a, _) => a.task_count ? Math.round(_ / a.task_count * 100) : 0;
    return e.shared && (e.reload(g.value), e.follow(["plan.*", "phase.*", "task.*"], () => e.reload(g.value))), (a, _) => (l(), x(o(H), { padding: "0" }, {
      default: b(() => [
        r("div", se, [
          v.value ? u.value ? (l(), i("p", oe, d(u.value), 1)) : (l(), i(C, { key: 2 }, [
            y(o(Q), {
              active: s.value,
              answer: n.value,
              onChoose: T
            }, null, 8, ["active", "answer"]),
            y(o(U), {
              tab: s.value,
              shape: "cards"
            }, {
              default: b(() => {
                var f;
                return [
                  A.value.length ? w("", !0) : (l(), i("p", ue, "No " + d((f = s.value) == null ? void 0 : f.label.toLowerCase()) + " plans", 1)),
                  r("div", de, [
                    (l(!0), i(C, null, z(A.value, (t) => (l(), i("div", {
                      key: t.id,
                      class: "plan",
                      "data-row": t.id,
                      role: "button",
                      tabindex: "0",
                      onClick: (m) => o(I)(`plans:${t.id}`),
                      onKeydown: L((m) => o(I)(`plans:${t.id}`), ["enter"])
                    }, [
                      r("span", pe, [
                        y(o(V), {
                          name: "plan",
                          size: 12
                        }),
                        k(" Plan " + d(t.id), 1),
                        r("span", {
                          class: F(["plan-state", o(X)("plan", t.state)]),
                          "data-plan-state": ""
                        }, d(o(Y)("plan", t.state)), 3)
                      ]),
                      r("span", {
                        class: "plan-title",
                        title: t.title
                      }, d(t.title), 9, re),
                      r("span", ce, [
                        r("span", {
                          class: "plan-bar-fill",
                          style: K({ width: `${P(t, t.completed_count)}%` })
                        }, null, 4),
                        r("span", {
                          class: "plan-bar-testing",
                          "data-plan-testing": "",
                          style: K({ width: `${P(t, t.testing_count)}%` })
                        }, null, 4)
                      ]),
                      r("span", ve, [
                        k(d(t.completed_count) + " of " + d(t.task_count) + " tasks done", 1),
                        t.current_phase ? (l(), i(C, { key: 0 }, [
                          k(" · phase " + d(t.current_phase), 1)
                        ], 64)) : w("", !0)
                      ]),
                      y(le, {
                        "plan-id": t.id,
                        agents: t.agents
                      }, null, 8, ["plan-id", "agents"])
                    ], 40, ie))), 128))
                  ]),
                  A.value.length && A.value.length < W.value ? (l(), x(o(Z), {
                    key: 1,
                    variant: "text",
                    "data-plans-more": "",
                    onClick: R
                  }, {
                    default: b(() => [..._[0] || (_[0] = [
                      k("Show more", -1)
                    ])]),
                    _: 1
                  })) : w("", !0)
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
}, ge = /* @__PURE__ */ E(fe, [["__scopeId", "data-v-d8566e97"]]);
export {
  ge as default
};
