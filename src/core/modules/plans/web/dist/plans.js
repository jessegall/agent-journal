/* @code-commandments-generated */
if (!document.getElementById("window-styles-5e023d4ea5a2")) { const style = document.createElement("style"); style.id = "window-styles-5e023d4ea5a2"; style.textContent = ".plan-dock-agents[data-v-aa962e00]{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 6px 16px}.plan-dock-agent[data-v-aa962e00]{padding:0 8px;border:1px solid var(--border-2);border-radius:99px;background:none;color:var(--text-2);font:inherit;font-size:11.5px;line-height:20px;cursor:pointer}.plan-dock-phases[data-v-aa962e00]{margin:0;padding:0 12px 9px 16px;list-style:none}.plan-dock-phase[data-v-aa962e00]{display:grid;grid-template-columns:18px minmax(0,1fr) auto;align-items:center;column-gap:8px;height:24px;font-size:12.5px}.plan-dock-number[data-v-aa962e00]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-aa962e00]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-aa962e00]{color:var(--text-4)}.plan-dock-tasks[data-v-aa962e00]{color:var(--text-4);font-size:11.5px}.plan-agents[data-v-e922f4c2]{display:flex;align-items:center;min-width:0;height:34px;margin:2px -14px 0;padding:0 14px;border-top:1px solid var(--border-inner);color:var(--text-3);font-size:12px}.plan-agents-none[data-v-e922f4c2]{color:var(--text-4)}.plan-agents-button[data-v-e922f4c2]{display:inline-flex;gap:5px;align-items:center;min-width:0;margin-left:-6px;padding:3px 6px;overflow:hidden;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.plan-agents-button[data-v-e922f4c2]:hover{background:var(--hover);color:var(--text)}.plans[data-v-23f779a1]{display:flex;flex-direction:column}.plans-grid[data-v-23f779a1]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));margin-right:-1px}.plan[data-v-23f779a1]{cursor:pointer;display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 0;border-right:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg)}.plan[data-v-23f779a1]:hover{background:var(--raised)}.plan-head[data-v-23f779a1]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-23f779a1]{margin-left:auto;padding:1px 7px;border:1px solid var(--border-2);border-radius:999px;color:var(--text-2);font-size:11px}.plan-state.started[data-v-23f779a1],.plan-state.completed[data-v-23f779a1]{border-color:var(--tone-good, var(--green));color:var(--tone-good, var(--green))}.plan-state.blocked[data-v-23f779a1]{border-color:var(--tone-warn);color:var(--tone-warn)}.plan-title[data-v-23f779a1]{overflow:hidden;font-weight:500;text-overflow:ellipsis;white-space:nowrap}.plan-bar[data-v-23f779a1]{display:flex;height:4px;overflow:hidden;border-radius:2px;background:var(--chip)}.plan-bar-fill[data-v-23f779a1]{display:block;height:100%;background:var(--accent)}.plan-bar-testing[data-v-23f779a1]{display:block;height:100%;background:color-mix(in srgb,var(--accent) 40%,transparent)}.plan-foot[data-v-23f779a1],.plans-note[data-v-23f779a1]{margin:0;color:var(--text-3);font-size:12px}.plans-note[data-v-23f779a1],[data-plans-more][data-v-23f779a1]{padding:8px 14px}\n"; document.head.appendChild(style); }
import { computed as A, ref as f, openBlock as t, createElementBlock as p, withKeys as B, withModifiers as L, toDisplayString as d, Fragment as b, createElementVNode as _, createTextVNode as h, createVNode as k, unref as l, createBlock as $, withCtx as g, renderList as z, createCommentVNode as x, normalizeClass as W, normalizeStyle as N } from "vue";
import { Icon as K, MenuPanel as O, MenuLabel as q, MenuItem as D, peekRef as M, useWindow as F, WindowRoom as G, Skeleton as j, InnerTabs as H, TabBody as J, stateLook as Q, stateLabel as U, Btn as X, afterSkeletonMinimum as Y } from "@journal/window-kit";
import { _ as V } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const Z = {
  key: 0,
  class: "plan-agents-none",
  "data-plan-agents-none": ""
}, ee = ["title"], ae = ["aria-expanded"], te = {
  __name: "PlanAgents",
  props: { planId: { type: Number, required: !0 }, agents: { type: Array, default: () => [] } },
  setup(w) {
    const i = w, a = A(() => [...new Map(i.agents.map((m) => [m.id, m])).values()]), n = f(null), r = f(!1), y = (m) => M(`agents:${m.id}`);
    return (m, s) => (t(), p("span", {
      class: "plan-agents",
      "data-plan-agents": "",
      onClick: s[3] || (s[3] = L(() => {
      }, ["stop"])),
      onKeydown: s[4] || (s[4] = B(L(() => {
      }, ["stop"]), ["enter"]))
    }, [
      a.value.length ? a.value.length === 1 ? (t(), p("button", {
        key: 1,
        type: "button",
        class: "plan-agents-button",
        title: `Open ${a.value[0].name}`,
        "data-plan-agent": "",
        onClick: s[0] || (s[0] = (c) => y(a.value[0]))
      }, "Agent: " + d(a.value[0].name), 9, ee)) : (t(), p(b, { key: 2 }, [
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
          k(l(K), {
            name: "down",
            size: 11
          })
        ], 8, ae),
        r.value ? (t(), $(l(O), {
          key: 0,
          anchor: n.value,
          "min-width": 200,
          "data-plan-agents-menu": "",
          onClose: s[2] || (s[2] = (c) => r.value = !1)
        }, {
          default: g(() => [
            k(l(q), null, {
              default: g(() => [
                h("Agents on plan " + d(w.planId), 1)
              ]),
              _: 1
            }),
            (t(!0), p(b, null, z(a.value, (c) => (t(), $(l(D), {
              key: c.id,
              "data-plan-agent": "",
              onClick: (I) => y(c)
            }, {
              default: g(() => [
                h(d(c.name), 1)
              ]),
              _: 2
            }, 1032, ["onClick"]))), 128))
          ]),
          _: 1
        }, 8, ["anchor"])) : x("", !0)
      ], 64)) : (t(), p("span", Z, "Agents: none"))
    ], 32));
  }
}, ne = /* @__PURE__ */ V(te, [["__scopeId", "data-v-e922f4c2"]]), le = { class: "plans" }, se = {
  key: 1,
  class: "plans-note"
}, oe = {
  key: 0,
  class: "plans-note"
}, ue = { class: "plans-grid" }, de = ["data-row", "onClick", "onKeydown"], pe = { class: "plan-head" }, ie = ["title"], re = { class: "plan-bar" }, ce = { class: "plan-foot" }, ve = 25, _e = {
  __name: "PlanCards",
  setup(w) {
    var S;
    const i = F(), a = f((S = i.tabs) == null ? void 0 : S[0]), n = f({ open_total: 0, closed_total: 0, plans: [] }), r = f(""), y = f(!1), m = performance.now(), s = () => a.value.read;
    async function c() {
      const o = a.value, u = n.value.plans.length, v = await i.read(i.shared ? `${i.shared.model} show ${i.shared.id}` : `${s()}${u > ve ? ` --limit ${u}` : ""}`);
      o === a.value && (r.value = v.ok ? "" : v.error, Y(m, () => y.value = !0), v.ok && (n.value = i.shared ? { open_total: 1, closed_total: 0, plans: [{ task_count: 0, completed_count: 0, current_phase: 0, agents: [], ...v.value }] } : v.value));
    }
    async function I() {
      if (!n.value.plans.length) return;
      const o = a.value, u = await i.read(`${s()} --before-id ${Math.min(...n.value.plans.map((e) => e.id))}`);
      if (o !== a.value) return;
      if (!u.ok) return void (r.value = u.error);
      const v = new Set(n.value.plans.map((e) => e.id));
      n.value = { ...u.value, plans: [...n.value.plans, ...u.value.plans.filter((e) => !v.has(e.id))] };
    }
    const E = (o) => {
      a.value = o, n.value = { ...n.value, plans: [] }, c();
    }, C = A(() => n.value.plans), R = A(() => {
      var o;
      return n.value[(o = a.value) == null ? void 0 : o.count_field];
    }), P = (o, u) => o.task_count ? Math.round(u / o.task_count * 100) : 0;
    return i.follow(["plan.*", "phase.*", "task.*"], c), c(), (o, u) => (t(), $(l(G), { padding: "0" }, {
      default: g(() => [
        _("div", le, [
          y.value ? r.value ? (t(), p("p", se, d(r.value), 1)) : (t(), p(b, { key: 2 }, [
            k(l(H), {
              active: a.value,
              answer: n.value,
              onChoose: E
            }, null, 8, ["active", "answer"]),
            k(l(J), {
              tab: a.value,
              shape: "cards"
            }, {
              default: g(() => {
                var v;
                return [
                  C.value.length ? x("", !0) : (t(), p("p", oe, "No " + d((v = a.value) == null ? void 0 : v.label.toLowerCase()) + " plans", 1)),
                  _("div", ue, [
                    (t(!0), p(b, null, z(C.value, (e) => (t(), p("div", {
                      key: e.id,
                      class: "plan",
                      "data-row": e.id,
                      role: "button",
                      tabindex: "0",
                      onClick: (T) => l(M)(`plans:${e.id}`),
                      onKeydown: B((T) => l(M)(`plans:${e.id}`), ["enter"])
                    }, [
                      _("span", pe, [
                        k(l(K), {
                          name: "plan",
                          size: 12
                        }),
                        h(" Plan " + d(e.id), 1),
                        _("span", {
                          class: W(["plan-state", l(Q)("plan", e.state)]),
                          "data-plan-state": ""
                        }, d(l(U)("plan", e.state)), 3)
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
                        h(d(e.completed_count) + " of " + d(e.task_count) + " tasks done", 1),
                        e.current_phase ? (t(), p(b, { key: 0 }, [
                          h(" · phase " + d(e.current_phase), 1)
                        ], 64)) : x("", !0)
                      ]),
                      k(ne, {
                        "plan-id": e.id,
                        agents: e.agents
                      }, null, 8, ["plan-id", "agents"])
                    ], 40, de))), 128))
                  ]),
                  C.value.length && C.value.length < R.value ? (t(), $(l(X), {
                    key: 1,
                    kind: "text",
                    "data-plans-more": "",
                    onClick: I
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
          ], 64)) : (t(), $(l(j), {
            key: 0,
            shape: "cards"
          }))
        ])
      ]),
      _: 1
    }));
  }
}, ke = /* @__PURE__ */ V(_e, [["__scopeId", "data-v-23f779a1"]]);
export {
  ke as default
};
