/* @code-commandments-generated */
if (!document.getElementById("window-styles-adc521a18fcf")) { const style = document.createElement("style"); style.id = "window-styles-adc521a18fcf"; style.textContent = ".plan-dock-phases[data-v-4f34e7f3]{margin:0;padding:0 12px 9px 16px;list-style:none}.plan-dock-phase[data-v-4f34e7f3]{display:grid;grid-template-columns:18px minmax(0,1fr) auto;align-items:center;column-gap:8px;height:24px;font-size:12.5px}.plan-dock-number[data-v-4f34e7f3]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-4f34e7f3]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-4f34e7f3]{color:var(--text-4)}.plan-dock-tasks[data-v-4f34e7f3]{color:var(--text-4);font-size:11.5px}.plans[data-v-fe0e3bc5]{display:flex;flex-direction:column;gap:14px}.plans-tabs[data-v-fe0e3bc5]{display:flex;gap:14px}.plans-tab[data-v-fe0e3bc5]{padding:0 0 4px;border:0;border-bottom:1px solid transparent;background:none;color:var(--text-3);font:inherit;font-size:11px;letter-spacing:.04em;text-transform:uppercase;cursor:pointer}.plans-tab.on[data-v-fe0e3bc5]{border-bottom-color:var(--accent);color:var(--text)}.plans-grid[data-v-fe0e3bc5]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}.plan[data-v-fe0e3bc5]{cursor:pointer;display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plan-head[data-v-fe0e3bc5]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-fe0e3bc5]{margin-left:auto;padding:1px 7px;border:1px solid var(--border-2);border-radius:999px;color:var(--text-2);font-size:11px}.plan-state.started[data-v-fe0e3bc5],.plan-state.completed[data-v-fe0e3bc5]{border-color:var(--tone-good, var(--green));color:var(--tone-good, var(--green))}.plan-state.blocked[data-v-fe0e3bc5]{border-color:var(--tone-warn);color:var(--tone-warn)}.plan-title[data-v-fe0e3bc5]{font-weight:500}.plan-bar[data-v-fe0e3bc5]{height:4px;border-radius:2px;background:var(--raised)}.plan-bar-fill[data-v-fe0e3bc5]{display:block;height:100%;border-radius:2px;background:var(--accent)}.plan-foot[data-v-fe0e3bc5],.plans-note[data-v-fe0e3bc5]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as h, computed as S, openBlock as o, createElementBlock as u, createBlock as w, unref as r, toDisplayString as l, Fragment as f, createElementVNode as d, createVNode as m, normalizeClass as b, withCtx as y, createTextVNode as i, createCommentVNode as $, renderList as E, withKeys as K, normalizeStyle as I } from "vue";
import { useWindow as L, Skeleton as M, Btn as C, peekRef as B, Icon as O } from "@journal/window-kit";
import { _ as R } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const W = { class: "plans" }, A = {
  key: 1,
  class: "plans-note"
}, D = { class: "plans-tabs" }, F = {
  key: 0,
  class: "plans-note"
}, G = { class: "plans-grid" }, T = ["data-row", "onClick", "onKeydown"], j = { class: "plan-head" }, q = { class: "plan-title" }, H = { class: "plan-bar" }, J = { class: "plan-foot" }, Q = 25, U = {
  __name: "PlanCards",
  setup(X) {
    const c = L(), n = h("open"), a = h({ open_total: 0, closed_total: 0, plans: [] }), v = h(""), x = h(!1), g = () => `plan board${n.value === "closed" ? " --closed" : ""}`;
    async function k() {
      const s = n.value, t = a.value.plans.length, e = await c.read(c.shared ? `${c.shared.model} show ${c.shared.id}` : `${g()}${t > Q ? ` --limit ${t}` : ""}`);
      s === n.value && (v.value = e.ok ? "" : e.error, x.value = !0, e.ok && (a.value = c.shared ? { open_total: 1, closed_total: 0, plans: [{ task_count: 0, completed_count: 0, current_phase: 0, ...e.value }] } : e.value));
    }
    async function P() {
      if (!a.value.plans.length) return;
      const s = n.value, t = await c.read(`${g()} --before-id ${Math.min(...a.value.plans.map((p) => p.id))}`);
      if (s !== n.value) return;
      if (!t.ok) return void (v.value = t.error);
      const e = new Set(a.value.plans.map((p) => p.id));
      a.value = { ...t.value, plans: [...a.value.plans, ...t.value.plans.filter((p) => !e.has(p.id))] };
    }
    const N = (s) => {
      n.value = s, a.value = { ...a.value, plans: [] }, k();
    }, _ = S(() => a.value.plans), V = S(() => n.value === "open" ? a.value.open_total : a.value.closed_total), z = (s) => s.task_count ? Math.round(s.completed_count / s.task_count * 100) : 0;
    return c.follow(["plan.*", "phase.*", "task.*"], k), k(), (s, t) => (o(), u("div", W, [
      x.value ? v.value ? (o(), u("p", A, l(v.value), 1)) : (o(), u(f, { key: 2 }, [
        d("div", D, [
          m(r(C), {
            kind: "text",
            class: b(["plans-tab", { on: n.value === "open" }]),
            "data-tab": "open",
            onClick: t[0] || (t[0] = (e) => N("open"))
          }, {
            default: y(() => [
              i("Open " + l(a.value.open_total), 1)
            ]),
            _: 1
          }, 8, ["class"]),
          m(r(C), {
            kind: "text",
            class: b(["plans-tab", { on: n.value === "closed" }]),
            "data-tab": "closed",
            onClick: t[1] || (t[1] = (e) => N("closed"))
          }, {
            default: y(() => [
              i("Closed " + l(a.value.closed_total), 1)
            ]),
            _: 1
          }, 8, ["class"])
        ]),
        _.value.length ? $("", !0) : (o(), u("p", F, l(n.value === "open" ? "No open plans" : "No closed plans"), 1)),
        d("div", G, [
          (o(!0), u(f, null, E(_.value, (e) => (o(), u("div", {
            key: e.id,
            class: "plan",
            "data-row": e.id,
            role: "button",
            tabindex: "0",
            onClick: (p) => r(B)(`plans:${e.id}`),
            onKeydown: K((p) => r(B)(`plans:${e.id}`), ["enter"])
          }, [
            d("span", j, [
              m(r(O), {
                name: "plan",
                size: 12
              }),
              i(" Plan " + l(e.id), 1),
              d("span", {
                class: b(["plan-state", e.state]),
                "data-plan-state": ""
              }, l(e.state), 3)
            ]),
            d("span", q, l(e.title), 1),
            d("span", H, [
              d("span", {
                class: "plan-bar-fill",
                style: I({ width: `${z(e)}%` })
              }, null, 4)
            ]),
            d("span", J, [
              i(l(e.completed_count) + " of " + l(e.task_count) + " tasks done", 1),
              e.current_phase ? (o(), u(f, { key: 0 }, [
                i(" · phase " + l(e.current_phase), 1)
              ], 64)) : $("", !0)
            ])
          ], 40, T))), 128))
        ]),
        _.value.length && _.value.length < V.value ? (o(), w(r(C), {
          key: 1,
          kind: "text",
          "data-plans-more": "",
          onClick: P
        }, {
          default: y(() => [...t[2] || (t[2] = [
            i("Show more", -1)
          ])]),
          _: 1
        })) : $("", !0)
      ], 64)) : (o(), w(r(M), {
        key: 0,
        shape: "cards"
      }))
    ]));
  }
}, ae = /* @__PURE__ */ R(U, [["__scopeId", "data-v-fe0e3bc5"]]);
export {
  ae as default
};
