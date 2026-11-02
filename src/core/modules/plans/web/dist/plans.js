/* @code-commandments-generated */
if (!document.getElementById("window-styles-7849ec171672")) { const style = document.createElement("style"); style.id = "window-styles-7849ec171672"; style.textContent = ".plan-dock-phases[data-v-4f34e7f3]{margin:0;padding:0 12px 9px 16px;list-style:none}.plan-dock-phase[data-v-4f34e7f3]{display:grid;grid-template-columns:18px minmax(0,1fr) auto;align-items:center;column-gap:8px;height:24px;font-size:12.5px}.plan-dock-number[data-v-4f34e7f3]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-4f34e7f3]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-4f34e7f3]{color:var(--text-4)}.plan-dock-tasks[data-v-4f34e7f3]{color:var(--text-4);font-size:11.5px}.plans[data-v-2a15110f]{display:flex;flex-direction:column;gap:14px}.plans-grid[data-v-2a15110f]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}.plan[data-v-2a15110f]{cursor:pointer;display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plan-head[data-v-2a15110f]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-2a15110f]{margin-left:auto;padding:1px 7px;border:1px solid var(--border-2);border-radius:999px;color:var(--text-2);font-size:11px}.plan-state.started[data-v-2a15110f],.plan-state.completed[data-v-2a15110f]{border-color:var(--tone-good, var(--green));color:var(--tone-good, var(--green))}.plan-state.blocked[data-v-2a15110f]{border-color:var(--tone-warn);color:var(--tone-warn)}.plan-title[data-v-2a15110f]{font-weight:500}.plan-bar[data-v-2a15110f]{height:4px;border-radius:2px;background:var(--raised)}.plan-bar-fill[data-v-2a15110f]{display:block;height:100%;border-radius:2px;background:var(--accent)}.plan-foot[data-v-2a15110f],.plans-note[data-v-2a15110f]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as v, computed as C, openBlock as o, createElementBlock as r, createBlock as g, unref as i, toDisplayString as u, Fragment as f, createVNode as x, createCommentVNode as k, createElementVNode as d, renderList as z, withKeys as E, createTextVNode as h, normalizeClass as I, normalizeStyle as K, withCtx as L } from "vue";
import { useWindow as M, Skeleton as R, InnerTabs as T, peekRef as w, Icon as W, Btn as A } from "@journal/window-kit";
import { _ as D } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const F = { class: "plans" }, G = {
  key: 1,
  class: "plans-note"
}, O = {
  key: 0,
  class: "plans-note"
}, j = { class: "plans-grid" }, q = ["data-row", "onClick", "onKeydown"], H = { class: "plan-head" }, J = { class: "plan-title" }, Q = { class: "plan-bar" }, U = { class: "plan-foot" }, X = 25, Y = {
  __name: "PlanCards",
  setup(Z) {
    var b;
    const c = M(), l = v((b = c.tabs) == null ? void 0 : b[0]), t = v({ open_total: 0, closed_total: 0, plans: [] }), p = v(""), y = v(!1), $ = () => l.value.read;
    async function m() {
      const a = l.value, n = t.value.plans.length, s = await c.read(c.shared ? `${c.shared.model} show ${c.shared.id}` : `${$()}${n > X ? ` --limit ${n}` : ""}`);
      a === l.value && (p.value = s.ok ? "" : s.error, y.value = !0, s.ok && (t.value = c.shared ? { open_total: 1, closed_total: 0, plans: [{ task_count: 0, completed_count: 0, current_phase: 0, ...s.value }] } : s.value));
    }
    async function S() {
      if (!t.value.plans.length) return;
      const a = l.value, n = await c.read(`${$()} --before-id ${Math.min(...t.value.plans.map((e) => e.id))}`);
      if (a !== l.value) return;
      if (!n.ok) return void (p.value = n.error);
      const s = new Set(t.value.plans.map((e) => e.id));
      t.value = { ...n.value, plans: [...t.value.plans, ...n.value.plans.filter((e) => !s.has(e.id))] };
    }
    const N = (a) => {
      l.value = a, t.value = { ...t.value, plans: [] }, m();
    }, _ = C(() => t.value.plans), B = C(() => {
      var a;
      return t.value[(a = l.value) == null ? void 0 : a.count_field];
    }), P = (a) => a.task_count ? Math.round(a.completed_count / a.task_count * 100) : 0;
    return c.follow(["plan.*", "phase.*", "task.*"], m), m(), (a, n) => {
      var s;
      return o(), r("div", F, [
        y.value ? p.value ? (o(), r("p", G, u(p.value), 1)) : (o(), r(f, { key: 2 }, [
          x(i(T), {
            active: l.value,
            answer: t.value,
            onChoose: N
          }, null, 8, ["active", "answer"]),
          _.value.length ? k("", !0) : (o(), r("p", O, "No " + u((s = l.value) == null ? void 0 : s.label.toLowerCase()) + " plans", 1)),
          d("div", j, [
            (o(!0), r(f, null, z(_.value, (e) => (o(), r("div", {
              key: e.id,
              class: "plan",
              "data-row": e.id,
              role: "button",
              tabindex: "0",
              onClick: (V) => i(w)(`plans:${e.id}`),
              onKeydown: E((V) => i(w)(`plans:${e.id}`), ["enter"])
            }, [
              d("span", H, [
                x(i(W), {
                  name: "plan",
                  size: 12
                }),
                h(" Plan " + u(e.id), 1),
                d("span", {
                  class: I(["plan-state", e.state]),
                  "data-plan-state": ""
                }, u(e.state), 3)
              ]),
              d("span", J, u(e.title), 1),
              d("span", Q, [
                d("span", {
                  class: "plan-bar-fill",
                  style: K({ width: `${P(e)}%` })
                }, null, 4)
              ]),
              d("span", U, [
                h(u(e.completed_count) + " of " + u(e.task_count) + " tasks done", 1),
                e.current_phase ? (o(), r(f, { key: 0 }, [
                  h(" · phase " + u(e.current_phase), 1)
                ], 64)) : k("", !0)
              ])
            ], 40, q))), 128))
          ]),
          _.value.length && _.value.length < B.value ? (o(), g(i(A), {
            key: 1,
            kind: "text",
            "data-plans-more": "",
            onClick: S
          }, {
            default: L(() => [...n[0] || (n[0] = [
              h("Show more", -1)
            ])]),
            _: 1
          })) : k("", !0)
        ], 64)) : (o(), g(i(R), {
          key: 0,
          shape: "cards"
        }))
      ]);
    };
  }
}, ne = /* @__PURE__ */ D(Y, [["__scopeId", "data-v-2a15110f"]]);
export {
  ne as default
};
