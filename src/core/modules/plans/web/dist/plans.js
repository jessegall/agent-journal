/* @code-commandments-generated */
if (!document.getElementById("window-styles-6721b202c0a1")) { const style = document.createElement("style"); style.id = "window-styles-6721b202c0a1"; style.textContent = ".plan-dock-agents[data-v-aa962e00]{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 6px 16px}.plan-dock-agent[data-v-aa962e00]{padding:0 8px;border:1px solid var(--border-2);border-radius:99px;background:none;color:var(--text-2);font:inherit;font-size:11.5px;line-height:20px;cursor:pointer}.plan-dock-phases[data-v-aa962e00]{margin:0;padding:0 12px 9px 16px;list-style:none}.plan-dock-phase[data-v-aa962e00]{display:grid;grid-template-columns:18px minmax(0,1fr) auto;align-items:center;column-gap:8px;height:24px;font-size:12.5px}.plan-dock-number[data-v-aa962e00]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-aa962e00]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-aa962e00]{color:var(--text-4)}.plan-dock-tasks[data-v-aa962e00]{color:var(--text-4);font-size:11.5px}.plan-agents[data-v-e922f4c2]{display:flex;align-items:center;min-width:0;height:34px;margin:2px -14px 0;padding:0 14px;border-top:1px solid var(--border-inner);color:var(--text-3);font-size:12px}.plan-agents-none[data-v-e922f4c2]{color:var(--text-4)}.plan-agents-button[data-v-e922f4c2]{display:inline-flex;gap:5px;align-items:center;min-width:0;margin-left:-6px;padding:3px 6px;overflow:hidden;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.plan-agents-button[data-v-e922f4c2]:hover{background:var(--hover);color:var(--text)}.plans[data-v-99c90e8b]{display:flex;flex-direction:column}.plans-grid[data-v-99c90e8b]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));margin-right:-1px}.plan[data-v-99c90e8b]{cursor:pointer;display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 0;border-right:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg)}.plan[data-v-99c90e8b]:hover{background:var(--raised)}.plan-head[data-v-99c90e8b]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-99c90e8b]{margin-left:auto;padding:1px 7px;border:1px solid var(--border-2);border-radius:999px;color:var(--text-2);font-size:11px}.plan-state.started[data-v-99c90e8b],.plan-state.completed[data-v-99c90e8b]{border-color:var(--tone-good, var(--green));color:var(--tone-good, var(--green))}.plan-state.blocked[data-v-99c90e8b]{border-color:var(--tone-warn);color:var(--tone-warn)}.plan-title[data-v-99c90e8b]{overflow:hidden;font-weight:500;text-overflow:ellipsis;white-space:nowrap}.plan-bar[data-v-99c90e8b]{height:4px;border-radius:2px;background:var(--chip)}.plan-bar-fill[data-v-99c90e8b]{display:block;height:100%;border-radius:2px;background:var(--accent)}.plan-foot[data-v-99c90e8b],.plans-note[data-v-99c90e8b]{margin:0;color:var(--text-3);font-size:12px}.plans-note[data-v-99c90e8b],[data-plans-more][data-v-99c90e8b]{padding:8px 14px}\n"; document.head.appendChild(style); }
import { computed as A, ref as f, openBlock as n, createElementBlock as d, withKeys as N, withModifiers as S, toDisplayString as o, Fragment as b, createElementVNode as _, createTextVNode as h, createVNode as k, unref as u, createBlock as $, withCtx as g, renderList as B, createCommentVNode as w, normalizeClass as T, normalizeStyle as W } from "vue";
import { Icon as z, MenuPanel as O, MenuLabel as q, MenuItem as D, peekRef as M, useWindow as F, WindowRoom as G, Skeleton as j, InnerTabs as H, TabBody as J, Btn as Q, afterSkeletonMinimum as U } from "@journal/window-kit";
import { _ as K } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const X = {
  key: 0,
  class: "plan-agents-none",
  "data-plan-agents-none": ""
}, Y = ["title"], Z = ["aria-expanded"], ee = {
  __name: "PlanAgents",
  props: { planId: { type: Number, required: !0 }, agents: { type: Array, default: () => [] } },
  setup(x) {
    const p = x, a = A(() => [...new Map(p.agents.map((m) => [m.id, m])).values()]), t = f(null), r = f(!1), y = (m) => M(`agents:${m.id}`);
    return (m, l) => (n(), d("span", {
      class: "plan-agents",
      "data-plan-agents": "",
      onClick: l[3] || (l[3] = S(() => {
      }, ["stop"])),
      onKeydown: l[4] || (l[4] = N(S(() => {
      }, ["stop"]), ["enter"]))
    }, [
      a.value.length ? a.value.length === 1 ? (n(), d("button", {
        key: 1,
        type: "button",
        class: "plan-agents-button",
        title: `Open ${a.value[0].name}`,
        "data-plan-agent": "",
        onClick: l[0] || (l[0] = (i) => y(a.value[0]))
      }, "Agent: " + o(a.value[0].name), 9, Y)) : (n(), d(b, { key: 2 }, [
        _("button", {
          ref_key: "anchor",
          ref: t,
          type: "button",
          class: "plan-agents-button",
          "aria-expanded": r.value,
          "data-plan-agents-list": "",
          onClick: l[1] || (l[1] = (i) => r.value = !r.value)
        }, [
          h(" Agents: " + o(a.value.length) + " ", 1),
          k(u(z), {
            name: "down",
            size: 11
          })
        ], 8, Z),
        r.value ? (n(), $(u(O), {
          key: 0,
          anchor: t.value,
          "min-width": 200,
          "data-plan-agents-menu": "",
          onClose: l[2] || (l[2] = (i) => r.value = !1)
        }, {
          default: g(() => [
            k(u(q), null, {
              default: g(() => [
                h("Agents on plan " + o(x.planId), 1)
              ]),
              _: 1
            }),
            (n(!0), d(b, null, B(a.value, (i) => (n(), $(u(D), {
              key: i.id,
              "data-plan-agent": "",
              onClick: (I) => y(i)
            }, {
              default: g(() => [
                h(o(i.name), 1)
              ]),
              _: 2
            }, 1032, ["onClick"]))), 128))
          ]),
          _: 1
        }, 8, ["anchor"])) : w("", !0)
      ], 64)) : (n(), d("span", X, "Agents: none"))
    ], 32));
  }
}, ae = /* @__PURE__ */ K(ee, [["__scopeId", "data-v-e922f4c2"]]), ne = { class: "plans" }, te = {
  key: 1,
  class: "plans-note"
}, le = {
  key: 0,
  class: "plans-note"
}, se = { class: "plans-grid" }, oe = ["data-row", "onClick", "onKeydown"], ue = { class: "plan-head" }, de = ["title"], pe = { class: "plan-bar" }, re = { class: "plan-foot" }, ie = 25, ce = {
  __name: "PlanCards",
  setup(x) {
    var P;
    const p = F(), a = f((P = p.tabs) == null ? void 0 : P[0]), t = f({ open_total: 0, closed_total: 0, plans: [] }), r = f(""), y = f(!1), m = performance.now(), l = () => a.value.read;
    async function i() {
      const s = a.value, c = t.value.plans.length, v = await p.read(p.shared ? `${p.shared.model} show ${p.shared.id}` : `${l()}${c > ie ? ` --limit ${c}` : ""}`);
      s === a.value && (r.value = v.ok ? "" : v.error, U(m, () => y.value = !0), v.ok && (t.value = p.shared ? { open_total: 1, closed_total: 0, plans: [{ task_count: 0, completed_count: 0, current_phase: 0, agents: [], ...v.value }] } : v.value));
    }
    async function I() {
      if (!t.value.plans.length) return;
      const s = a.value, c = await p.read(`${l()} --before-id ${Math.min(...t.value.plans.map((e) => e.id))}`);
      if (s !== a.value) return;
      if (!c.ok) return void (r.value = c.error);
      const v = new Set(t.value.plans.map((e) => e.id));
      t.value = { ...c.value, plans: [...t.value.plans, ...c.value.plans.filter((e) => !v.has(e.id))] };
    }
    const L = (s) => {
      a.value = s, t.value = { ...t.value, plans: [] }, i();
    }, C = A(() => t.value.plans), V = A(() => {
      var s;
      return t.value[(s = a.value) == null ? void 0 : s.count_field];
    }), E = (s) => s.task_count ? Math.round(s.completed_count / s.task_count * 100) : 0;
    return p.follow(["plan.*", "phase.*", "task.*"], i), i(), (s, c) => (n(), $(u(G), { padding: "0" }, {
      default: g(() => [
        _("div", ne, [
          y.value ? r.value ? (n(), d("p", te, o(r.value), 1)) : (n(), d(b, { key: 2 }, [
            k(u(H), {
              active: a.value,
              answer: t.value,
              onChoose: L
            }, null, 8, ["active", "answer"]),
            k(u(J), {
              tab: a.value,
              shape: "cards"
            }, {
              default: g(() => {
                var v;
                return [
                  C.value.length ? w("", !0) : (n(), d("p", le, "No " + o((v = a.value) == null ? void 0 : v.label.toLowerCase()) + " plans", 1)),
                  _("div", se, [
                    (n(!0), d(b, null, B(C.value, (e) => (n(), d("div", {
                      key: e.id,
                      class: "plan",
                      "data-row": e.id,
                      role: "button",
                      tabindex: "0",
                      onClick: (R) => u(M)(`plans:${e.id}`),
                      onKeydown: N((R) => u(M)(`plans:${e.id}`), ["enter"])
                    }, [
                      _("span", ue, [
                        k(u(z), {
                          name: "plan",
                          size: 12
                        }),
                        h(" Plan " + o(e.id), 1),
                        _("span", {
                          class: T(["plan-state", e.state]),
                          "data-plan-state": ""
                        }, o(e.state), 3)
                      ]),
                      _("span", {
                        class: "plan-title",
                        title: e.title
                      }, o(e.title), 9, de),
                      _("span", pe, [
                        _("span", {
                          class: "plan-bar-fill",
                          style: W({ width: `${E(e)}%` })
                        }, null, 4)
                      ]),
                      _("span", re, [
                        h(o(e.completed_count) + " of " + o(e.task_count) + " tasks done", 1),
                        e.current_phase ? (n(), d(b, { key: 0 }, [
                          h(" · phase " + o(e.current_phase), 1)
                        ], 64)) : w("", !0)
                      ]),
                      k(ae, {
                        "plan-id": e.id,
                        agents: e.agents
                      }, null, 8, ["plan-id", "agents"])
                    ], 40, oe))), 128))
                  ]),
                  C.value.length && C.value.length < V.value ? (n(), $(u(Q), {
                    key: 1,
                    kind: "text",
                    "data-plans-more": "",
                    onClick: I
                  }, {
                    default: g(() => [...c[0] || (c[0] = [
                      h("Show more", -1)
                    ])]),
                    _: 1
                  })) : w("", !0)
                ];
              }),
              _: 1
            }, 8, ["tab"])
          ], 64)) : (n(), $(u(j), {
            key: 0,
            shape: "cards"
          }))
        ])
      ]),
      _: 1
    }));
  }
}, he = /* @__PURE__ */ K(ce, [["__scopeId", "data-v-99c90e8b"]]);
export {
  he as default
};
