/* @code-commandments-generated */
if (!document.getElementById("window-styles-17a9938a1fbb")) { const style = document.createElement("style"); style.id = "window-styles-17a9938a1fbb"; style.textContent = ".plan-dock-agents[data-v-aa962e00]{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 6px 16px}.plan-dock-agent[data-v-aa962e00]{padding:0 8px;border:1px solid var(--border-2);border-radius:99px;background:none;color:var(--text-2);font:inherit;font-size:11.5px;line-height:20px;cursor:pointer}.plan-dock-phases[data-v-aa962e00]{margin:0;padding:0 12px 9px 16px;list-style:none}.plan-dock-phase[data-v-aa962e00]{display:grid;grid-template-columns:18px minmax(0,1fr) auto;align-items:center;column-gap:8px;height:24px;font-size:12.5px}.plan-dock-number[data-v-aa962e00]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-aa962e00]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-aa962e00]{color:var(--text-4)}.plan-dock-tasks[data-v-aa962e00]{color:var(--text-4);font-size:11.5px}.plan-agents[data-v-e922f4c2]{display:flex;align-items:center;min-width:0;height:34px;margin:2px -14px 0;padding:0 14px;border-top:1px solid var(--border-inner);color:var(--text-3);font-size:12px}.plan-agents-none[data-v-e922f4c2]{color:var(--text-4)}.plan-agents-button[data-v-e922f4c2]{display:inline-flex;gap:5px;align-items:center;min-width:0;margin-left:-6px;padding:3px 6px;overflow:hidden;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.plan-agents-button[data-v-e922f4c2]:hover{background:var(--hover);color:var(--text)}.plans[data-v-d4f9b91a]{display:flex;flex-direction:column}.plans-grid[data-v-d4f9b91a]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));margin-right:-1px}.plan[data-v-d4f9b91a]{cursor:pointer;display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 0;border-right:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg)}.plan[data-v-d4f9b91a]:hover{background:var(--raised)}.plan-head[data-v-d4f9b91a]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-d4f9b91a]{margin-left:auto;padding:1px 7px;border:1px solid var(--border-2);border-radius:999px;color:var(--text-2);font-size:11px}.plan-state.started[data-v-d4f9b91a],.plan-state.completed[data-v-d4f9b91a]{border-color:var(--tone-good, var(--green));color:var(--tone-good, var(--green))}.plan-state.blocked[data-v-d4f9b91a]{border-color:var(--tone-warn);color:var(--tone-warn)}.plan-title[data-v-d4f9b91a]{overflow:hidden;font-weight:500;text-overflow:ellipsis;white-space:nowrap}.plan-bar[data-v-d4f9b91a]{height:4px;border-radius:2px;background:var(--chip)}.plan-bar-fill[data-v-d4f9b91a]{display:block;height:100%;border-radius:2px;background:var(--accent)}.plan-foot[data-v-d4f9b91a],.plans-note[data-v-d4f9b91a]{margin:0;color:var(--text-3);font-size:12px}.plans-note[data-v-d4f9b91a],[data-plans-more][data-v-d4f9b91a]{padding:8px 14px}\n"; document.head.appendChild(style); }
import { computed as A, ref as f, openBlock as n, createElementBlock as d, withKeys as S, withModifiers as N, toDisplayString as o, Fragment as g, createElementVNode as v, createTextVNode as m, createVNode as y, unref as u, createBlock as $, withCtx as b, renderList as z, createCommentVNode as x, normalizeClass as R, normalizeStyle as W } from "vue";
import { Icon as B, MenuPanel as O, MenuLabel as T, MenuItem as q, peekRef as I, useWindow as D, WindowRoom as F, Skeleton as G, InnerTabs as j, Btn as H } from "@journal/window-kit";
import { _ as K } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const J = {
  key: 0,
  class: "plan-agents-none",
  "data-plan-agents-none": ""
}, Q = ["title"], U = ["aria-expanded"], X = {
  __name: "PlanAgents",
  props: { planId: { type: Number, required: !0 }, agents: { type: Array, default: () => [] } },
  setup(w) {
    const p = w, a = A(() => [...new Map(p.agents.map((_) => [_.id, _])).values()]), t = f(null), i = f(!1), k = (_) => I(`agents:${_.id}`);
    return (_, l) => (n(), d("span", {
      class: "plan-agents",
      "data-plan-agents": "",
      onClick: l[3] || (l[3] = N(() => {
      }, ["stop"])),
      onKeydown: l[4] || (l[4] = S(N(() => {
      }, ["stop"]), ["enter"]))
    }, [
      a.value.length ? a.value.length === 1 ? (n(), d("button", {
        key: 1,
        type: "button",
        class: "plan-agents-button",
        title: `Open ${a.value[0].name}`,
        "data-plan-agent": "",
        onClick: l[0] || (l[0] = (h) => k(a.value[0]))
      }, "Agent: " + o(a.value[0].name), 9, Q)) : (n(), d(g, { key: 2 }, [
        v("button", {
          ref_key: "anchor",
          ref: t,
          type: "button",
          class: "plan-agents-button",
          "aria-expanded": i.value,
          "data-plan-agents-list": "",
          onClick: l[1] || (l[1] = (h) => i.value = !i.value)
        }, [
          m(" Agents: " + o(a.value.length) + " ", 1),
          y(u(B), {
            name: "down",
            size: 11
          })
        ], 8, U),
        i.value ? (n(), $(u(O), {
          key: 0,
          anchor: t.value,
          "min-width": 200,
          "data-plan-agents-menu": "",
          onClose: l[2] || (l[2] = (h) => i.value = !1)
        }, {
          default: b(() => [
            y(u(T), null, {
              default: b(() => [
                m("Agents on plan " + o(w.planId), 1)
              ]),
              _: 1
            }),
            (n(!0), d(g, null, z(a.value, (h) => (n(), $(u(q), {
              key: h.id,
              "data-plan-agent": "",
              onClick: (M) => k(h)
            }, {
              default: b(() => [
                m(o(h.name), 1)
              ]),
              _: 2
            }, 1032, ["onClick"]))), 128))
          ]),
          _: 1
        }, 8, ["anchor"])) : x("", !0)
      ], 64)) : (n(), d("span", J, "Agents: none"))
    ], 32));
  }
}, Y = /* @__PURE__ */ K(X, [["__scopeId", "data-v-e922f4c2"]]), Z = { class: "plans" }, ee = {
  key: 1,
  class: "plans-note"
}, ae = {
  key: 0,
  class: "plans-note"
}, ne = { class: "plans-grid" }, te = ["data-row", "onClick", "onKeydown"], le = { class: "plan-head" }, se = ["title"], oe = { class: "plan-bar" }, ue = { class: "plan-foot" }, de = 25, pe = {
  __name: "PlanCards",
  setup(w) {
    var P;
    const p = D(), a = f((P = p.tabs) == null ? void 0 : P[0]), t = f({ open_total: 0, closed_total: 0, plans: [] }), i = f(""), k = f(!1), _ = () => a.value.read;
    async function l() {
      const s = a.value, r = t.value.plans.length, c = await p.read(p.shared ? `${p.shared.model} show ${p.shared.id}` : `${_()}${r > de ? ` --limit ${r}` : ""}`);
      s === a.value && (i.value = c.ok ? "" : c.error, k.value = !0, c.ok && (t.value = p.shared ? { open_total: 1, closed_total: 0, plans: [{ task_count: 0, completed_count: 0, current_phase: 0, agents: [], ...c.value }] } : c.value));
    }
    async function h() {
      if (!t.value.plans.length) return;
      const s = a.value, r = await p.read(`${_()} --before-id ${Math.min(...t.value.plans.map((e) => e.id))}`);
      if (s !== a.value) return;
      if (!r.ok) return void (i.value = r.error);
      const c = new Set(t.value.plans.map((e) => e.id));
      t.value = { ...r.value, plans: [...t.value.plans, ...r.value.plans.filter((e) => !c.has(e.id))] };
    }
    const M = (s) => {
      a.value = s, t.value = { ...t.value, plans: [] }, l();
    }, C = A(() => t.value.plans), L = A(() => {
      var s;
      return t.value[(s = a.value) == null ? void 0 : s.count_field];
    }), V = (s) => s.task_count ? Math.round(s.completed_count / s.task_count * 100) : 0;
    return p.follow(["plan.*", "phase.*", "task.*"], l), l(), (s, r) => (n(), $(u(F), { padding: "0" }, {
      default: b(() => {
        var c;
        return [
          v("div", Z, [
            k.value ? i.value ? (n(), d("p", ee, o(i.value), 1)) : (n(), d(g, { key: 2 }, [
              y(u(j), {
                active: a.value,
                answer: t.value,
                onChoose: M
              }, null, 8, ["active", "answer"]),
              C.value.length ? x("", !0) : (n(), d("p", ae, "No " + o((c = a.value) == null ? void 0 : c.label.toLowerCase()) + " plans", 1)),
              v("div", ne, [
                (n(!0), d(g, null, z(C.value, (e) => (n(), d("div", {
                  key: e.id,
                  class: "plan",
                  "data-row": e.id,
                  role: "button",
                  tabindex: "0",
                  onClick: (E) => u(I)(`plans:${e.id}`),
                  onKeydown: S((E) => u(I)(`plans:${e.id}`), ["enter"])
                }, [
                  v("span", le, [
                    y(u(B), {
                      name: "plan",
                      size: 12
                    }),
                    m(" Plan " + o(e.id), 1),
                    v("span", {
                      class: R(["plan-state", e.state]),
                      "data-plan-state": ""
                    }, o(e.state), 3)
                  ]),
                  v("span", {
                    class: "plan-title",
                    title: e.title
                  }, o(e.title), 9, se),
                  v("span", oe, [
                    v("span", {
                      class: "plan-bar-fill",
                      style: W({ width: `${V(e)}%` })
                    }, null, 4)
                  ]),
                  v("span", ue, [
                    m(o(e.completed_count) + " of " + o(e.task_count) + " tasks done", 1),
                    e.current_phase ? (n(), d(g, { key: 0 }, [
                      m(" · phase " + o(e.current_phase), 1)
                    ], 64)) : x("", !0)
                  ]),
                  y(Y, {
                    "plan-id": e.id,
                    agents: e.agents
                  }, null, 8, ["plan-id", "agents"])
                ], 40, te))), 128))
              ]),
              C.value.length && C.value.length < L.value ? (n(), $(u(H), {
                key: 1,
                kind: "text",
                "data-plans-more": "",
                onClick: h
              }, {
                default: b(() => [...r[0] || (r[0] = [
                  m("Show more", -1)
                ])]),
                _: 1
              })) : x("", !0)
            ], 64)) : (n(), $(u(G), {
              key: 0,
              shape: "cards"
            }))
          ])
        ];
      }),
      _: 1
    }));
  }
}, ve = /* @__PURE__ */ K(pe, [["__scopeId", "data-v-d4f9b91a"]]);
export {
  ve as default
};
