/* @code-commandments-generated */
if (!document.getElementById("window-styles-49bdfd926ca7")) { const style = document.createElement("style"); style.id = "window-styles-49bdfd926ca7"; style.textContent = ".plan-dock-phases[data-v-4f34e7f3]{margin:0;padding:0 12px 9px 16px;list-style:none}.plan-dock-phase[data-v-4f34e7f3]{display:grid;grid-template-columns:18px minmax(0,1fr) auto;align-items:center;column-gap:8px;height:24px;font-size:12.5px}.plan-dock-number[data-v-4f34e7f3]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-4f34e7f3]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-4f34e7f3]{color:var(--text-4)}.plan-dock-tasks[data-v-4f34e7f3]{color:var(--text-4);font-size:11.5px}.plans[data-v-a6a6ace4]{display:flex;flex-direction:column;gap:14px}.plans-tabs[data-v-a6a6ace4]{display:flex;gap:14px}.plans-tab[data-v-a6a6ace4]{padding:0 0 4px;border:0;border-bottom:1px solid transparent;background:none;color:var(--text-3);font:inherit;font-size:11px;letter-spacing:.04em;text-transform:uppercase;cursor:pointer}.plans-tab.on[data-v-a6a6ace4]{border-bottom-color:var(--accent);color:var(--text)}.plans-grid[data-v-a6a6ace4]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}.plan[data-v-a6a6ace4]{cursor:pointer;display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plan-head[data-v-a6a6ace4]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-a6a6ace4]{margin-left:auto}.plan-title[data-v-a6a6ace4]{font-weight:500}.plan-bar[data-v-a6a6ace4]{height:4px;border-radius:2px;background:var(--raised)}.plan-bar-fill[data-v-a6a6ace4]{display:block;height:100%;border-radius:2px;background:var(--accent)}.plan-foot[data-v-a6a6ace4],.plans-note[data-v-a6a6ace4]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as _, computed as x, openBlock as o, createElementBlock as i, createBlock as g, unref as u, toDisplayString as l, Fragment as w, createElementVNode as d, createVNode as m, normalizeClass as N, withCtx as f, createTextVNode as v, createCommentVNode as S, renderList as E, withKeys as K, normalizeStyle as I } from "vue";
import { useWindow as L, Skeleton as M, Btn as $, peekRef as B, Icon as O } from "@journal/window-kit";
import { _ as R } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const W = { class: "plans" }, A = {
  key: 1,
  class: "plans-note"
}, D = { class: "plans-tabs" }, F = {
  key: 0,
  class: "plans-note"
}, G = { class: "plans-grid" }, T = ["data-row", "onClick", "onKeydown"], j = { class: "plan-head" }, q = { class: "plan-state" }, H = { class: "plan-title" }, J = { class: "plan-bar" }, Q = { class: "plan-foot" }, U = 25, X = {
  __name: "PlanCards",
  setup(Y) {
    const c = L(), s = _("open"), t = _({ open_total: 0, closed_total: 0, plans: [] }), r = _(""), b = _(!1), y = () => `plan board${s.value === "closed" ? " --closed" : ""}`;
    async function h() {
      const n = s.value, a = t.value.plans.length, e = await c.read(c.shared ? `${c.shared.model} show ${c.shared.id}` : `${y()}${a > U ? ` --limit ${a}` : ""}`);
      n === s.value && (r.value = e.ok ? "" : e.error, b.value = !0, e.ok && (t.value = c.shared ? { open_total: 1, closed_total: 0, plans: [{ task_count: 0, completed_count: 0, current_phase: 0, ...e.value }] } : e.value));
    }
    async function P() {
      const n = s.value, a = await c.read(`${y()} --before-id ${Math.min(...t.value.plans.map((p) => p.id))}`);
      if (n !== s.value) return;
      if (!a.ok) return void (r.value = a.error);
      const e = new Set(t.value.plans.map((p) => p.id));
      t.value = { ...a.value, plans: [...t.value.plans, ...a.value.plans.filter((p) => !e.has(p.id))] };
    }
    const C = (n) => {
      s.value = n, t.value = { ...t.value, plans: [] }, h();
    }, k = x(() => t.value.plans), V = x(() => s.value === "open" ? t.value.open_total : t.value.closed_total), z = (n) => n.task_count ? Math.round(n.completed_count / n.task_count * 100) : 0;
    return c.follow(["plan.*", "phase.*", "task.*"], h), h(), (n, a) => (o(), i("div", W, [
      b.value ? r.value ? (o(), i("p", A, l(r.value), 1)) : (o(), i(w, { key: 2 }, [
        d("div", D, [
          m(u($), {
            kind: "text",
            class: N(["plans-tab", { on: s.value === "open" }]),
            "data-tab": "open",
            onClick: a[0] || (a[0] = (e) => C("open"))
          }, {
            default: f(() => [
              v("Open " + l(t.value.open_total), 1)
            ]),
            _: 1
          }, 8, ["class"]),
          m(u($), {
            kind: "text",
            class: N(["plans-tab", { on: s.value === "closed" }]),
            "data-tab": "closed",
            onClick: a[1] || (a[1] = (e) => C("closed"))
          }, {
            default: f(() => [
              v("Closed " + l(t.value.closed_total), 1)
            ]),
            _: 1
          }, 8, ["class"])
        ]),
        k.value.length ? S("", !0) : (o(), i("p", F, l(s.value === "open" ? "No open plans" : "No closed plans"), 1)),
        d("div", G, [
          (o(!0), i(w, null, E(k.value, (e) => (o(), i("div", {
            key: e.id,
            class: "plan",
            "data-row": e.id,
            role: "button",
            tabindex: "0",
            onClick: (p) => u(B)(`plans:${e.id}`),
            onKeydown: K((p) => u(B)(`plans:${e.id}`), ["enter"])
          }, [
            d("span", j, [
              m(u(O), {
                name: "plan",
                size: 12
              }),
              v(" Plan " + l(e.id), 1),
              d("span", q, l(e.state), 1)
            ]),
            d("span", H, l(e.title), 1),
            d("span", J, [
              d("span", {
                class: "plan-bar-fill",
                style: I({ width: `${z(e)}%` })
              }, null, 4)
            ]),
            d("span", Q, l(e.completed_count) + " of " + l(e.task_count) + " tasks done · phase " + l(e.current_phase), 1)
          ], 40, T))), 128))
        ]),
        k.value.length < V.value ? (o(), g(u($), {
          key: 1,
          kind: "text",
          "data-plans-more": "",
          onClick: P
        }, {
          default: f(() => [...a[2] || (a[2] = [
            v("Show more", -1)
          ])]),
          _: 1
        })) : S("", !0)
      ], 64)) : (o(), g(u(M), {
        key: 0,
        shape: "cards"
      }))
    ]));
  }
}, te = /* @__PURE__ */ R(X, [["__scopeId", "data-v-a6a6ace4"]]);
export {
  te as default
};
