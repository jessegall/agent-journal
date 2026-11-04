/* @code-commandments-generated */
if (!document.getElementById("window-styles-898772b0f630")) { const style = document.createElement("style"); style.id = "window-styles-898772b0f630"; style.textContent = ".plan-dock-agents[data-v-aa962e00]{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 6px 16px}.plan-dock-agent[data-v-aa962e00]{padding:0 8px;border:1px solid var(--border-2);border-radius:99px;background:none;color:var(--text-2);font:inherit;font-size:11.5px;line-height:20px;cursor:pointer}.plan-dock-phases[data-v-aa962e00]{margin:0;padding:0 12px 9px 16px;list-style:none}.plan-dock-phase[data-v-aa962e00]{display:grid;grid-template-columns:18px minmax(0,1fr) auto;align-items:center;column-gap:8px;height:24px;font-size:12.5px}.plan-dock-number[data-v-aa962e00]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-aa962e00]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-aa962e00]{color:var(--text-4)}.plan-dock-tasks[data-v-aa962e00]{color:var(--text-4);font-size:11.5px}.plan-agents[data-v-e922f4c2]{display:flex;align-items:center;min-width:0;height:34px;margin:2px -14px 0;padding:0 14px;border-top:1px solid var(--border-inner);color:var(--text-3);font-size:12px}.plan-agents-none[data-v-e922f4c2]{color:var(--text-4)}.plan-agents-button[data-v-e922f4c2]{display:inline-flex;gap:5px;align-items:center;min-width:0;margin-left:-6px;padding:3px 6px;overflow:hidden;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.plan-agents-button[data-v-e922f4c2]:hover{background:var(--hover);color:var(--text)}.plans[data-v-f55630bd]{display:flex;flex-direction:column}.plans-grid[data-v-f55630bd]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));margin-right:-1px}.plan[data-v-f55630bd]{cursor:pointer;display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 0;border-right:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg)}.plan[data-v-f55630bd]:hover{background:var(--raised)}.plan-head[data-v-f55630bd]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-f55630bd]{margin-left:auto;padding:1px 7px;border:1px solid var(--border-2);border-radius:999px;color:var(--text-2);font-size:11px}.plan-state.started[data-v-f55630bd],.plan-state.completed[data-v-f55630bd]{border-color:var(--tone-good, var(--green));color:var(--tone-good, var(--green))}.plan-state.blocked[data-v-f55630bd]{border-color:var(--tone-warn);color:var(--tone-warn)}.plan-title[data-v-f55630bd]{overflow:hidden;font-weight:500;text-overflow:ellipsis;white-space:nowrap}.plan-bar[data-v-f55630bd]{display:flex;height:4px;overflow:hidden;border-radius:2px;background:var(--chip)}.plan-bar-fill[data-v-f55630bd]{display:block;height:100%;background:var(--accent)}.plan-bar-testing[data-v-f55630bd]{display:block;height:100%;background:color-mix(in srgb,var(--accent) 40%,transparent)}.plan-foot[data-v-f55630bd],.plans-note[data-v-f55630bd]{margin:0;color:var(--text-3);font-size:12px}.plans-note[data-v-f55630bd],[data-plans-more][data-v-f55630bd]{padding:8px 14px}\n"; document.head.appendChild(style); }
import { computed as A, ref as f, openBlock as t, createElementBlock as p, withKeys as z, withModifiers as N, toDisplayString as u, Fragment as b, createElementVNode as _, createTextVNode as h, createVNode as k, unref as d, createBlock as $, withCtx as g, renderList as K, createCommentVNode as x, normalizeClass as W, normalizeStyle as B } from "vue";
import { Icon as L, MenuPanel as O, MenuLabel as q, MenuItem as D, peekRef as M, useWindow as F, WindowRoom as G, Skeleton as j, InnerTabs as H, TabBody as J, Btn as Q, afterSkeletonMinimum as U } from "@journal/window-kit";
import { _ as V } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const X = {
  key: 0,
  class: "plan-agents-none",
  "data-plan-agents-none": ""
}, Y = ["title"], Z = ["aria-expanded"], ee = {
  __name: "PlanAgents",
  props: { planId: { type: Number, required: !0 }, agents: { type: Array, default: () => [] } },
  setup(w) {
    const i = w, a = A(() => [...new Map(i.agents.map((m) => [m.id, m])).values()]), n = f(null), r = f(!1), y = (m) => M(`agents:${m.id}`);
    return (m, l) => (t(), p("span", {
      class: "plan-agents",
      "data-plan-agents": "",
      onClick: l[3] || (l[3] = N(() => {
      }, ["stop"])),
      onKeydown: l[4] || (l[4] = z(N(() => {
      }, ["stop"]), ["enter"]))
    }, [
      a.value.length ? a.value.length === 1 ? (t(), p("button", {
        key: 1,
        type: "button",
        class: "plan-agents-button",
        title: `Open ${a.value[0].name}`,
        "data-plan-agent": "",
        onClick: l[0] || (l[0] = (c) => y(a.value[0]))
      }, "Agent: " + u(a.value[0].name), 9, Y)) : (t(), p(b, { key: 2 }, [
        _("button", {
          ref_key: "anchor",
          ref: n,
          type: "button",
          class: "plan-agents-button",
          "aria-expanded": r.value,
          "data-plan-agents-list": "",
          onClick: l[1] || (l[1] = (c) => r.value = !r.value)
        }, [
          h(" Agents: " + u(a.value.length) + " ", 1),
          k(d(L), {
            name: "down",
            size: 11
          })
        ], 8, Z),
        r.value ? (t(), $(d(O), {
          key: 0,
          anchor: n.value,
          "min-width": 200,
          "data-plan-agents-menu": "",
          onClose: l[2] || (l[2] = (c) => r.value = !1)
        }, {
          default: g(() => [
            k(d(q), null, {
              default: g(() => [
                h("Agents on plan " + u(w.planId), 1)
              ]),
              _: 1
            }),
            (t(!0), p(b, null, K(a.value, (c) => (t(), $(d(D), {
              key: c.id,
              "data-plan-agent": "",
              onClick: (I) => y(c)
            }, {
              default: g(() => [
                h(u(c.name), 1)
              ]),
              _: 2
            }, 1032, ["onClick"]))), 128))
          ]),
          _: 1
        }, 8, ["anchor"])) : x("", !0)
      ], 64)) : (t(), p("span", X, "Agents: none"))
    ], 32));
  }
}, ae = /* @__PURE__ */ V(ee, [["__scopeId", "data-v-e922f4c2"]]), te = { class: "plans" }, ne = {
  key: 1,
  class: "plans-note"
}, le = {
  key: 0,
  class: "plans-note"
}, se = { class: "plans-grid" }, oe = ["data-row", "onClick", "onKeydown"], ue = { class: "plan-head" }, de = ["title"], pe = { class: "plan-bar" }, ie = { class: "plan-foot" }, re = 25, ce = {
  __name: "PlanCards",
  setup(w) {
    var S;
    const i = F(), a = f((S = i.tabs) == null ? void 0 : S[0]), n = f({ open_total: 0, closed_total: 0, plans: [] }), r = f(""), y = f(!1), m = performance.now(), l = () => a.value.read;
    async function c() {
      const s = a.value, o = n.value.plans.length, v = await i.read(i.shared ? `${i.shared.model} show ${i.shared.id}` : `${l()}${o > re ? ` --limit ${o}` : ""}`);
      s === a.value && (r.value = v.ok ? "" : v.error, U(m, () => y.value = !0), v.ok && (n.value = i.shared ? { open_total: 1, closed_total: 0, plans: [{ task_count: 0, completed_count: 0, current_phase: 0, agents: [], ...v.value }] } : v.value));
    }
    async function I() {
      if (!n.value.plans.length) return;
      const s = a.value, o = await i.read(`${l()} --before-id ${Math.min(...n.value.plans.map((e) => e.id))}`);
      if (s !== a.value) return;
      if (!o.ok) return void (r.value = o.error);
      const v = new Set(n.value.plans.map((e) => e.id));
      n.value = { ...o.value, plans: [...n.value.plans, ...o.value.plans.filter((e) => !v.has(e.id))] };
    }
    const E = (s) => {
      a.value = s, n.value = { ...n.value, plans: [] }, c();
    }, C = A(() => n.value.plans), R = A(() => {
      var s;
      return n.value[(s = a.value) == null ? void 0 : s.count_field];
    }), P = (s, o) => s.task_count ? Math.round(o / s.task_count * 100) : 0;
    return i.follow(["plan.*", "phase.*", "task.*"], c), c(), (s, o) => (t(), $(d(G), { padding: "0" }, {
      default: g(() => [
        _("div", te, [
          y.value ? r.value ? (t(), p("p", ne, u(r.value), 1)) : (t(), p(b, { key: 2 }, [
            k(d(H), {
              active: a.value,
              answer: n.value,
              onChoose: E
            }, null, 8, ["active", "answer"]),
            k(d(J), {
              tab: a.value,
              shape: "cards"
            }, {
              default: g(() => {
                var v;
                return [
                  C.value.length ? x("", !0) : (t(), p("p", le, "No " + u((v = a.value) == null ? void 0 : v.label.toLowerCase()) + " plans", 1)),
                  _("div", se, [
                    (t(!0), p(b, null, K(C.value, (e) => (t(), p("div", {
                      key: e.id,
                      class: "plan",
                      "data-row": e.id,
                      role: "button",
                      tabindex: "0",
                      onClick: (T) => d(M)(`plans:${e.id}`),
                      onKeydown: z((T) => d(M)(`plans:${e.id}`), ["enter"])
                    }, [
                      _("span", ue, [
                        k(d(L), {
                          name: "plan",
                          size: 12
                        }),
                        h(" Plan " + u(e.id), 1),
                        _("span", {
                          class: W(["plan-state", e.state]),
                          "data-plan-state": ""
                        }, u(e.state), 3)
                      ]),
                      _("span", {
                        class: "plan-title",
                        title: e.title
                      }, u(e.title), 9, de),
                      _("span", pe, [
                        _("span", {
                          class: "plan-bar-fill",
                          style: B({ width: `${P(e, e.completed_count)}%` })
                        }, null, 4),
                        _("span", {
                          class: "plan-bar-testing",
                          "data-plan-testing": "",
                          style: B({ width: `${P(e, e.testing_count)}%` })
                        }, null, 4)
                      ]),
                      _("span", ie, [
                        h(u(e.completed_count) + " of " + u(e.task_count) + " tasks done", 1),
                        e.current_phase ? (t(), p(b, { key: 0 }, [
                          h(" · phase " + u(e.current_phase), 1)
                        ], 64)) : x("", !0)
                      ]),
                      k(ae, {
                        "plan-id": e.id,
                        agents: e.agents
                      }, null, 8, ["plan-id", "agents"])
                    ], 40, oe))), 128))
                  ]),
                  C.value.length && C.value.length < R.value ? (t(), $(d(Q), {
                    key: 1,
                    kind: "text",
                    "data-plans-more": "",
                    onClick: I
                  }, {
                    default: g(() => [...o[0] || (o[0] = [
                      h("Show more", -1)
                    ])]),
                    _: 1
                  })) : x("", !0)
                ];
              }),
              _: 1
            }, 8, ["tab"])
          ], 64)) : (t(), $(d(j), {
            key: 0,
            shape: "cards"
          }))
        ])
      ]),
      _: 1
    }));
  }
}, he = /* @__PURE__ */ V(ce, [["__scopeId", "data-v-f55630bd"]]);
export {
  he as default
};
