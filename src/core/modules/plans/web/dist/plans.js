/* @code-commandments-generated */
if (!document.getElementById("window-styles-18a3a10fe825")) { const style = document.createElement("style"); style.id = "window-styles-18a3a10fe825"; style.textContent = ".plan-dock-agents[data-v-aa962e00]{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 6px 16px}.plan-dock-agent[data-v-aa962e00]{padding:0 8px;border:1px solid var(--border-2);border-radius:99px;background:none;color:var(--text-2);font:inherit;font-size:11.5px;line-height:20px;cursor:pointer}.plan-dock-phases[data-v-aa962e00]{margin:0;padding:0 12px 9px 16px;list-style:none}.plan-dock-phase[data-v-aa962e00]{display:grid;grid-template-columns:18px minmax(0,1fr) auto;align-items:center;column-gap:8px;height:24px;font-size:12.5px}.plan-dock-number[data-v-aa962e00]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-aa962e00]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-aa962e00]{color:var(--text-4)}.plan-dock-tasks[data-v-aa962e00]{color:var(--text-4);font-size:11.5px}.plan-agents[data-v-e922f4c2]{display:flex;align-items:center;min-width:0;height:34px;margin:2px -14px 0;padding:0 14px;border-top:1px solid var(--border-inner);color:var(--text-3);font-size:12px}.plan-agents-none[data-v-e922f4c2]{color:var(--text-4)}.plan-agents-button[data-v-e922f4c2]{display:inline-flex;gap:5px;align-items:center;min-width:0;margin-left:-6px;padding:3px 6px;overflow:hidden;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.plan-agents-button[data-v-e922f4c2]:hover{background:var(--hover);color:var(--text)}.plans[data-v-fa926dfe]{display:flex;flex-direction:column}.plans-grid[data-v-fa926dfe]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));margin-right:-1px}.plan[data-v-fa926dfe]{cursor:pointer;display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 0;border-right:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg)}.plan[data-v-fa926dfe]:hover{background:var(--raised)}.plan-head[data-v-fa926dfe]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-fa926dfe]{margin-left:auto;padding:1px 7px;border:1px solid var(--border-2);border-radius:999px;color:var(--text-2);font-size:11px}.plan-state.started[data-v-fa926dfe],.plan-state.completed[data-v-fa926dfe]{border-color:var(--tone-good, var(--green));color:var(--tone-good, var(--green))}.plan-state.blocked[data-v-fa926dfe]{border-color:var(--tone-warn);color:var(--tone-warn)}.plan-title[data-v-fa926dfe]{overflow:hidden;font-weight:500;text-overflow:ellipsis;white-space:nowrap}.plan-bar[data-v-fa926dfe]{display:flex;height:4px;overflow:hidden;border-radius:2px;background:var(--chip)}.plan-bar-fill[data-v-fa926dfe]{display:block;height:100%;background:var(--accent)}.plan-bar-testing[data-v-fa926dfe]{display:block;height:100%;background:color-mix(in srgb,var(--accent) 40%,transparent)}.plan-foot[data-v-fa926dfe],.plans-note[data-v-fa926dfe]{margin:0;color:var(--text-3);font-size:12px}.plans-note[data-v-fa926dfe],[data-plans-more][data-v-fa926dfe]{padding:8px 14px}\n"; document.head.appendChild(style); }
import { computed as M, ref as h, openBlock as t, createElementBlock as p, withKeys as z, withModifiers as L, toDisplayString as d, Fragment as b, createElementVNode as _, createTextVNode as f, createVNode as k, unref as s, createBlock as $, withCtx as g, renderList as K, createCommentVNode as x, normalizeClass as O, normalizeStyle as N } from "vue";
import { Icon as V, MenuPanel as q, MenuLabel as D, MenuItem as F, peekRef as w, useWindow as G, WindowRoom as j, Skeleton as H, InnerTabs as J, TabBody as Q, stateLook as B, stateLabel as U, Btn as X, afterSkeletonMinimum as Y } from "@journal/window-kit";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const Z = {
  key: 0,
  class: "plan-agents-none",
  "data-plan-agents-none": ""
}, ee = ["title"], ae = ["aria-expanded"], te = {
  __name: "PlanAgents",
  props: { planId: { type: Number, required: !0 }, agents: { type: Array, default: () => [] } },
  setup(A) {
    const i = A, a = M(() => [...new Map(i.agents.map((m) => [m.id, m])).values()]), n = h(null), r = h(!1), y = (m) => w(`agents:${m.id}`);
    return (m, l) => (t(), p("span", {
      class: "plan-agents",
      "data-plan-agents": "",
      onClick: l[3] || (l[3] = L(() => {
      }, ["stop"])),
      onKeydown: l[4] || (l[4] = z(L(() => {
      }, ["stop"]), ["enter"]))
    }, [
      a.value.length ? a.value.length === 1 ? (t(), p("button", {
        key: 1,
        type: "button",
        class: "plan-agents-button",
        title: `Open ${a.value[0].name}`,
        "data-plan-agent": "",
        onClick: l[0] || (l[0] = (c) => y(a.value[0]))
      }, "Agent: " + d(a.value[0].name), 9, ee)) : (t(), p(b, { key: 2 }, [
        _("button", {
          ref_key: "anchor",
          ref: n,
          type: "button",
          class: "plan-agents-button",
          "aria-expanded": r.value,
          "data-plan-agents-list": "",
          onClick: l[1] || (l[1] = (c) => r.value = !r.value)
        }, [
          f(" Agents: " + d(a.value.length) + " ", 1),
          k(s(V), {
            name: "down",
            size: 11
          })
        ], 8, ae),
        r.value ? (t(), $(s(q), {
          key: 0,
          anchor: n.value,
          "min-width": 200,
          "data-plan-agents-menu": "",
          onClose: l[2] || (l[2] = (c) => r.value = !1)
        }, {
          default: g(() => [
            k(s(D), null, {
              default: g(() => [
                f("Agents on plan " + d(A.planId), 1)
              ]),
              _: 1
            }),
            (t(!0), p(b, null, K(a.value, (c) => (t(), $(s(F), {
              key: c.id,
              "data-plan-agent": "",
              onClick: (I) => y(c)
            }, {
              default: g(() => [
                f(d(c.name), 1)
              ]),
              _: 2
            }, 1032, ["onClick"]))), 128))
          ]),
          _: 1
        }, 8, ["anchor"])) : x("", !0)
      ], 64)) : (t(), p("span", Z, "Agents: none"))
    ], 32));
  }
}, ne = /* @__PURE__ */ E(te, [["__scopeId", "data-v-e922f4c2"]]), se = { class: "plans" }, le = {
  key: 1,
  class: "plans-note"
}, oe = {
  key: 0,
  class: "plans-note"
}, ue = { class: "plans-grid" }, de = ["data-row", "onClick", "onKeydown"], pe = { class: "plan-head" }, ie = ["title"], re = { class: "plan-bar" }, ce = { class: "plan-foot" }, ve = 25, _e = {
  __name: "PlanCards",
  setup(A) {
    var S;
    const i = G(), a = h((S = i.tabs) == null ? void 0 : S[0]), n = h({ open_total: 0, closed_total: 0, plans: [] }), r = h(""), y = h(!1), m = performance.now(), l = () => a.value.read;
    async function c() {
      const o = a.value, u = n.value.plans.length, v = await i.read(i.shared ? `${i.shared.model} show ${i.shared.id}` : `${l()}${u > ve ? ` --limit ${u}` : ""}`);
      o === a.value && (r.value = v.ok ? "" : v.error, Y(m, () => y.value = !0), v.ok && (n.value = i.shared ? { open_total: 1, closed_total: 0, plans: [{ task_count: 0, completed_count: 0, current_phase: 0, agents: [], ...v.value }] } : v.value));
    }
    async function I() {
      if (!n.value.plans.length) return;
      const o = a.value, u = await i.read(`${l()} --before-id ${Math.min(...n.value.plans.map((e) => e.id))}`);
      if (o !== a.value) return;
      if (!u.ok) return void (r.value = u.error);
      const v = new Set(n.value.plans.map((e) => e.id));
      n.value = { ...u.value, plans: [...n.value.plans, ...u.value.plans.filter((e) => !v.has(e.id))] };
    }
    const R = (o) => {
      a.value = o, n.value = { ...n.value, plans: [] }, c();
    }, C = M(() => n.value.plans), T = M(() => {
      var o;
      return n.value[(o = a.value) == null ? void 0 : o.count_field];
    }), P = (o, u) => o.task_count ? Math.round(u / o.task_count * 100) : 0;
    return i.follow(["plan.*", "phase.*", "task.*"], c), c(), (o, u) => (t(), $(s(j), { padding: "0" }, {
      default: g(() => [
        _("div", se, [
          y.value ? r.value ? (t(), p("p", le, d(r.value), 1)) : (t(), p(b, { key: 2 }, [
            k(s(J), {
              active: a.value,
              answer: n.value,
              onChoose: R
            }, null, 8, ["active", "answer"]),
            k(s(Q), {
              tab: a.value,
              shape: "cards"
            }, {
              default: g(() => {
                var v;
                return [
                  C.value.length ? x("", !0) : (t(), p("p", oe, "No " + d((v = a.value) == null ? void 0 : v.label.toLowerCase()) + " plans", 1)),
                  _("div", ue, [
                    (t(!0), p(b, null, K(C.value, (e) => (t(), p("div", {
                      key: e.id,
                      class: "plan",
                      "data-row": e.id,
                      role: "button",
                      tabindex: "0",
                      onClick: (W) => s(w)(`plans:${e.id}`),
                      onKeydown: z((W) => s(w)(`plans:${e.id}`), ["enter"])
                    }, [
                      _("span", pe, [
                        k(s(V), {
                          name: "plan",
                          size: 12
                        }),
                        f(" Plan " + d(e.id), 1),
                        _("span", {
                          class: O(["plan-state", s(B)("plan", e.state)]),
                          "data-plan-state": ""
                        }, d(s(B)("plan", e.state) === e.state ? e.state : s(U)("plan", e.state)), 3)
                      ]),
                      _("span", {
                        class: "plan-title",
                        title: e.title
                      }, d(e.title), 9, ie),
                      _("span", re, [
                        _("span", {
                          class: "plan-bar-fill",
                          style: N({ width: `${P(e, e.completed_count)}%` })
                        }, null, 4),
                        _("span", {
                          class: "plan-bar-testing",
                          "data-plan-testing": "",
                          style: N({ width: `${P(e, e.testing_count)}%` })
                        }, null, 4)
                      ]),
                      _("span", ce, [
                        f(d(e.completed_count) + " of " + d(e.task_count) + " tasks done", 1),
                        e.current_phase ? (t(), p(b, { key: 0 }, [
                          f(" · phase " + d(e.current_phase), 1)
                        ], 64)) : x("", !0)
                      ]),
                      k(ne, {
                        "plan-id": e.id,
                        agents: e.agents
                      }, null, 8, ["plan-id", "agents"])
                    ], 40, de))), 128))
                  ]),
                  C.value.length && C.value.length < T.value ? (t(), $(s(X), {
                    key: 1,
                    kind: "text",
                    "data-plans-more": "",
                    onClick: I
                  }, {
                    default: g(() => [...u[0] || (u[0] = [
                      f("Show more", -1)
                    ])]),
                    _: 1
                  })) : x("", !0)
                ];
              }),
              _: 1
            }, 8, ["tab"])
          ], 64)) : (t(), $(s(H), {
            key: 0,
            shape: "cards"
          }))
        ])
      ]),
      _: 1
    }));
  }
}, ke = /* @__PURE__ */ E(_e, [["__scopeId", "data-v-fa926dfe"]]);
export {
  ke as default
};
