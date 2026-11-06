/* @code-commandments-generated */
if (!document.getElementById("window-styles-9ff56d9279c6")) { const style = document.createElement("style"); style.id = "window-styles-9ff56d9279c6"; style.textContent = ".plan-dock-agents[data-v-3fdf31fc]{display:flex;flex-wrap:wrap;gap:6px;padding:7px 14px 0 36px;align-items:center;color:var(--text-3);font-size:12px}.plan-dock-agent[data-v-3fdf31fc]{padding:0 8px;height:20px;border:1px solid var(--border-2);border-radius:99px;background:none;color:var(--text-2);font:inherit;font-size:11.5px;line-height:20px;cursor:pointer}.plan-dock-phases[data-v-3fdf31fc]{margin:0;padding:4px 14px 5px;list-style:none}.plan-dock-phase[data-v-3fdf31fc]{display:grid;grid-template-columns:22px minmax(0,1fr) auto;align-items:center;height:24px;font-size:12.5px}.plan-dock-number[data-v-3fdf31fc]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-3fdf31fc]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-3fdf31fc]{color:var(--text-4)}.plan-dock-tasks[data-v-3fdf31fc]{color:var(--text-4);font-size:11.5px}.plan-dock-agent[data-v-3fdf31fc]:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.plan-dock-phase.current .plan-dock-name[data-v-3fdf31fc]{color:var(--text)}.plan-dock-phase.current .plan-dock-tasks[data-v-3fdf31fc]{color:var(--text-3)}.plan-dock-loading[data-v-3fdf31fc]{margin:8px 36px}.plan-agents[data-v-c34d84f7]{display:flex;align-items:center;min-width:0;height:34px;margin:2px -14px 0;padding:0 14px;border-top:1px solid var(--border-inner);color:var(--text-3);font-size:12px}.plan-agents-none[data-v-c34d84f7]{color:var(--text-4)}.plan-agents-button[data-v-c34d84f7]{display:inline-flex;gap:5px;align-items:center;min-width:0;margin-left:-6px;padding:3px 6px;overflow:hidden;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.plan-agents-button[data-v-c34d84f7]:hover{background:var(--hover);color:var(--text)}.plans[data-v-e7a41a05]{display:flex;flex-direction:column}.plans-grid[data-v-e7a41a05]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));margin-right:-1px}.plan[data-v-e7a41a05]{cursor:pointer;display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 0;border-right:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg)}.plan[data-v-e7a41a05]:hover{background:var(--raised)}.plan-head[data-v-e7a41a05]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-e7a41a05]{margin-left:auto;padding:1px 7px;border:1px solid var(--border-2);border-radius:999px;color:var(--text-2);font-size:11px}.plan-state.started[data-v-e7a41a05],.plan-state.completed[data-v-e7a41a05]{border-color:var(--tone-good, var(--green));color:var(--tone-good, var(--green))}.plan-state.blocked[data-v-e7a41a05]{border-color:var(--tone-warn);color:var(--tone-warn)}.plan-title[data-v-e7a41a05]{overflow:hidden;font-weight:500;text-overflow:ellipsis;white-space:nowrap}.plan-bar[data-v-e7a41a05]{display:flex;height:4px;overflow:hidden;border-radius:2px;background:var(--chip)}.plan-bar-fill[data-v-e7a41a05]{display:block;height:100%;background:var(--accent)}.plan-bar-testing[data-v-e7a41a05]{display:block;height:100%;background:color-mix(in srgb,var(--accent) 40%,transparent)}.plan-foot[data-v-e7a41a05],.plans-note[data-v-e7a41a05]{margin:0;color:var(--text-3);font-size:12px}.plans-note[data-v-e7a41a05],[data-plans-more][data-v-e7a41a05]{padding:8px 14px}\n"; document.head.appendChild(style); }
import { computed as w, ref as f, openBlock as t, createElementBlock as p, withKeys as B, withModifiers as P, toDisplayString as d, Fragment as b, createElementVNode as _, createTextVNode as h, createVNode as k, unref as l, createBlock as $, withCtx as g, renderList as E, createCommentVNode as x, normalizeClass as W, normalizeStyle as L } from "vue";
import { Icon as R, MenuPanel as D, MenuLabel as O, MenuItem as q, peekRef as M, useWindow as F, coalesced as G, READ_RATES as j, WindowRoom as H, Skeleton as J, InnerTabs as Q, TabBody as U, stateLook as X, stateLabel as Y, Btn as Z, afterSkeletonMinimum as ee } from "@journal/window-kit";
import { _ as z } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const ae = {
  key: 0,
  class: "plan-agents-none",
  "data-plan-agents-none": ""
}, te = ["title"], ne = ["aria-expanded"], le = {
  __name: "PlanAgents",
  props: { planId: { type: Number, required: !0 }, agents: { type: Array, default: () => [] } },
  setup(A) {
    const i = A, a = w(() => [...new Map(i.agents.map((m) => [m.id, m])).values()]), n = f(null), r = f(!1), y = (m) => M(`agents:${m.id}`);
    return (m, s) => (t(), p("span", {
      class: "plan-agents",
      "data-plan-agents": "",
      onClick: s[3] || (s[3] = P(() => {
      }, ["stop"])),
      onKeydown: s[4] || (s[4] = B(P(() => {
      }, ["stop"]), ["enter"]))
    }, [
      a.value.length ? a.value.length === 1 ? (t(), p("button", {
        key: 1,
        type: "button",
        class: "plan-agents-button",
        title: `Open ${a.value[0].name}`,
        "data-plan-agent": "",
        onClick: s[0] || (s[0] = (c) => y(a.value[0]))
      }, "Agent: " + d(a.value[0].name), 9, te)) : (t(), p(b, { key: 2 }, [
        _("button", {
          ref_key: "anchor",
          ref: n,
          type: "button",
          class: "plan-agents-button",
          "aria-expanded": r.value,
          "data-plan-agents-list": "",
          onClick: s[1] || (s[1] = (c) => r.value = !r.value)
        }, [
          h(" Agents: " + d(a.value.length) + " ", 1),
          k(l(R), {
            name: "down",
            size: 11
          })
        ], 8, ne),
        r.value ? (t(), $(l(D), {
          key: 0,
          anchor: n.value,
          "min-width": 200,
          "data-plan-agents-menu": "",
          onClose: s[2] || (s[2] = (c) => r.value = !1)
        }, {
          default: g(() => [
            k(l(O), null, {
              default: g(() => [
                h("Agents on plan " + d(A.planId), 1)
              ]),
              _: 1
            }),
            (t(!0), p(b, null, E(a.value, (c) => (t(), $(l(q), {
              key: c.id,
              "data-plan-agent": "",
              onClick: (S) => y(c)
            }, {
              default: g(() => [
                h(d(c.name), 1)
              ]),
              _: 2
            }, 1032, ["onClick"]))), 128))
          ]),
          _: 1
        }, 8, ["anchor"])) : x("", !0)
      ], 64)) : (t(), p("span", ae, "No agent assigned"))
    ], 32));
  }
}, se = /* @__PURE__ */ z(le, [["__scopeId", "data-v-c34d84f7"]]), oe = { class: "plans" }, ue = {
  key: 1,
  class: "plans-note"
}, de = {
  key: 0,
  class: "plans-note"
}, pe = { class: "plans-grid" }, ie = ["data-row", "onClick", "onKeydown"], re = { class: "plan-head" }, ce = ["title"], ve = { class: "plan-bar" }, _e = { class: "plan-foot" }, me = 25, he = {
  __name: "PlanCards",
  setup(A) {
    var N;
    const i = F(), a = f((N = i.tabs) == null ? void 0 : N[0]), n = f({ open_total: 0, closed_total: 0, plans: [] }), r = f(""), y = f(!1), m = performance.now(), s = () => a.value.read;
    async function c() {
      const o = a.value, u = n.value.plans.length, v = await i.read(i.shared ? `${i.shared.model} show ${i.shared.id}` : `${s()}${u > me ? ` --limit ${u}` : ""}`);
      o === a.value && (r.value = v.ok ? "" : v.error, ee(m, () => y.value = !0), v.ok && (n.value = i.shared ? { open_total: 1, closed_total: 0, plans: [{ task_count: 0, completed_count: 0, current_phase: 0, agents: [], ...v.value }] } : v.value));
    }
    async function S() {
      if (!n.value.plans.length) return;
      const o = a.value, u = await i.read(`${s()} --before-id ${Math.min(...n.value.plans.map((e) => e.id))}`);
      if (o !== a.value) return;
      if (!u.ok) return void (r.value = u.error);
      const v = new Set(n.value.plans.map((e) => e.id));
      n.value = { ...u.value, plans: [...n.value.plans, ...u.value.plans.filter((e) => !v.has(e.id))] };
    }
    const K = (o) => {
      a.value = o, n.value = { ...n.value, plans: [] }, c();
    }, C = w(() => n.value.plans), T = w(() => {
      var o;
      return n.value[(o = a.value) == null ? void 0 : o.count_field];
    }), I = (o, u) => o.task_count ? Math.round(u / o.task_count * 100) : 0;
    return i.follow(["plan.*", "phase.*", "task.*"], G(c, j.planCard)), c(), (o, u) => (t(), $(l(H), { padding: "0" }, {
      default: g(() => [
        _("div", oe, [
          y.value ? r.value ? (t(), p("p", ue, d(r.value), 1)) : (t(), p(b, { key: 2 }, [
            k(l(Q), {
              active: a.value,
              answer: n.value,
              onChoose: K
            }, null, 8, ["active", "answer"]),
            k(l(U), {
              tab: a.value,
              shape: "cards"
            }, {
              default: g(() => {
                var v;
                return [
                  C.value.length ? x("", !0) : (t(), p("p", de, "No " + d((v = a.value) == null ? void 0 : v.label.toLowerCase()) + " plans", 1)),
                  _("div", pe, [
                    (t(!0), p(b, null, E(C.value, (e) => (t(), p("div", {
                      key: e.id,
                      class: "plan",
                      "data-row": e.id,
                      role: "button",
                      tabindex: "0",
                      onClick: (V) => l(M)(`plans:${e.id}`),
                      onKeydown: B((V) => l(M)(`plans:${e.id}`), ["enter"])
                    }, [
                      _("span", re, [
                        k(l(R), {
                          name: "plan",
                          size: 12
                        }),
                        h(" Plan " + d(e.id), 1),
                        _("span", {
                          class: W(["plan-state", l(X)("plan", e.state)]),
                          "data-plan-state": ""
                        }, d(l(Y)("plan", e.state)), 3)
                      ]),
                      _("span", {
                        class: "plan-title",
                        title: e.title
                      }, d(e.title), 9, ce),
                      _("span", ve, [
                        _("span", {
                          class: "plan-bar-fill",
                          style: L({ width: `${I(e, e.completed_count)}%` })
                        }, null, 4),
                        _("span", {
                          class: "plan-bar-testing",
                          "data-plan-testing": "",
                          style: L({ width: `${I(e, e.testing_count)}%` })
                        }, null, 4)
                      ]),
                      _("span", _e, [
                        h(d(e.completed_count) + " of " + d(e.task_count) + " tasks done", 1),
                        e.current_phase ? (t(), p(b, { key: 0 }, [
                          h(" · phase " + d(e.current_phase), 1)
                        ], 64)) : x("", !0)
                      ]),
                      k(se, {
                        "plan-id": e.id,
                        agents: e.agents
                      }, null, 8, ["plan-id", "agents"])
                    ], 40, ie))), 128))
                  ]),
                  C.value.length && C.value.length < T.value ? (t(), $(l(Z), {
                    key: 1,
                    variant: "text",
                    "data-plans-more": "",
                    onClick: S
                  }, {
                    default: g(() => [...u[0] || (u[0] = [
                      h("Show more", -1)
                    ])]),
                    _: 1
                  })) : x("", !0)
                ];
              }),
              _: 1
            }, 8, ["tab"])
          ], 64)) : (t(), $(l(J), {
            key: 0,
            shape: "cards"
          }))
        ])
      ]),
      _: 1
    }));
  }
}, ye = /* @__PURE__ */ z(he, [["__scopeId", "data-v-e7a41a05"]]);
export {
  ye as default
};
