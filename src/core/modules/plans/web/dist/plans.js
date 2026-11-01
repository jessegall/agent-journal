/* @code-commandments-generated */
if (!document.getElementById("window-styles-840252c2435b")) { const style = document.createElement("style"); style.id = "window-styles-840252c2435b"; style.textContent = ".plan-dock-phases[data-v-4f34e7f3]{margin:0;padding:0 12px 9px 16px;list-style:none}.plan-dock-phase[data-v-4f34e7f3]{display:grid;grid-template-columns:18px minmax(0,1fr) auto;align-items:center;column-gap:8px;height:24px;font-size:12.5px}.plan-dock-number[data-v-4f34e7f3]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-4f34e7f3]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-4f34e7f3]{color:var(--text-4)}.plan-dock-tasks[data-v-4f34e7f3]{color:var(--text-4);font-size:11.5px}.plans[data-v-5abf211f]{display:flex;flex-direction:column;gap:14px}.plans-tabs[data-v-5abf211f]{display:flex;gap:14px}.plans-tab[data-v-5abf211f]{padding:0 0 4px;border:0;border-bottom:1px solid transparent;background:none;color:var(--text-3);font:inherit;font-size:11px;letter-spacing:.04em;text-transform:uppercase;cursor:pointer}.plans-tab.on[data-v-5abf211f]{border-bottom-color:var(--accent);color:var(--text)}.plans-grid[data-v-5abf211f]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}.plan[data-v-5abf211f]{cursor:pointer;display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plan-head[data-v-5abf211f]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-5abf211f]{margin-left:auto}.plan-title[data-v-5abf211f]{font-weight:500}.plan-bar[data-v-5abf211f]{height:4px;border-radius:2px;background:var(--raised)}.plan-bar-fill[data-v-5abf211f]{display:block;height:100%;border-radius:2px;background:var(--accent)}.plan-foot[data-v-5abf211f],.plans-note[data-v-5abf211f]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as r, computed as x, openBlock as n, createElementBlock as u, createBlock as g, unref as c, toDisplayString as t, Fragment as N, createElementVNode as l, createVNode as f, normalizeClass as w, withCtx as m, createTextVNode as _, createCommentVNode as B, renderList as E, withKeys as I, normalizeStyle as D } from "vue";
import { useWindow as F, Skeleton as L, Btn as y, peekRef as S, Icon as M } from "@journal/window-kit";
import { _ as O } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const R = { class: "plans" }, T = {
  key: 1,
  class: "plans-note"
}, W = { class: "plans-tabs" }, j = {
  key: 0,
  class: "plans-note"
}, q = { class: "plans-grid" }, A = ["data-row", "onClick", "onKeydown"], G = { class: "plan-head" }, H = { class: "plan-state" }, J = { class: "plan-title" }, Q = { class: "plan-bar" }, U = { class: "plan-foot" }, X = {
  __name: "PlanCards",
  setup(Y) {
    const o = F(), d = r("open"), s = r({ open_total: 0, closed_total: 0, plans: [] }), i = r(""), b = r(!1), v = r(1), $ = (e) => `plan board${d.value === "closed" ? " --closed" : ""}${e > 1 ? ` --page ${e}` : ""}`;
    async function k() {
      const e = await o.read(o.shared ? `${o.shared.model} show ${o.shared.id}` : $(1));
      i.value = e.ok ? "" : e.error, b.value = !0, v.value = 1, e.ok && (s.value = o.shared ? { open_total: 1, closed_total: 0, plans: [{ task_count: 0, completed_count: 0, current_phase: 0, ...e.value }] } : e.value);
    }
    async function V() {
      const e = await o.read($(v.value + 1));
      if (!e.ok) return void (i.value = e.error);
      v.value += 1, s.value = { ...e.value, plans: [...s.value.plans, ...e.value.plans] };
    }
    const C = (e) => {
      d.value = e, k();
    }, h = x(() => s.value.plans), z = x(() => d.value === "open" ? s.value.open_total : s.value.closed_total), K = (e) => e.task_count ? Math.round(e.completed_count / e.task_count * 100) : 0;
    return o.follow(["plan.*", "phase.*", "task.*"], k), k(), (e, p) => (n(), u("div", R, [
      b.value ? i.value ? (n(), u("p", T, t(i.value), 1)) : (n(), u(N, { key: 2 }, [
        l("div", W, [
          f(c(y), {
            kind: "text",
            class: w(["plans-tab", { on: d.value === "open" }]),
            "data-tab": "open",
            onClick: p[0] || (p[0] = (a) => C("open"))
          }, {
            default: m(() => [
              _("Open " + t(s.value.open_total), 1)
            ]),
            _: 1
          }, 8, ["class"]),
          f(c(y), {
            kind: "text",
            class: w(["plans-tab", { on: d.value === "closed" }]),
            "data-tab": "closed",
            onClick: p[1] || (p[1] = (a) => C("closed"))
          }, {
            default: m(() => [
              _("Closed " + t(s.value.closed_total), 1)
            ]),
            _: 1
          }, 8, ["class"])
        ]),
        h.value.length ? B("", !0) : (n(), u("p", j, t(d.value === "open" ? "No open plans" : "No closed plans"), 1)),
        l("div", q, [
          (n(!0), u(N, null, E(h.value, (a) => (n(), u("div", {
            key: a.id,
            class: "plan",
            "data-row": a.id,
            role: "button",
            tabindex: "0",
            onClick: (P) => c(S)(`plans:${a.id}`),
            onKeydown: I((P) => c(S)(`plans:${a.id}`), ["enter"])
          }, [
            l("span", G, [
              f(c(M), {
                name: "plan",
                size: 12
              }),
              _(" Plan " + t(a.id), 1),
              l("span", H, t(a.state), 1)
            ]),
            l("span", J, t(a.title), 1),
            l("span", Q, [
              l("span", {
                class: "plan-bar-fill",
                style: D({ width: `${K(a)}%` })
              }, null, 4)
            ]),
            l("span", U, t(a.completed_count) + " of " + t(a.task_count) + " tasks done · phase " + t(a.current_phase), 1)
          ], 40, A))), 128))
        ]),
        h.value.length < z.value ? (n(), g(c(y), {
          key: 1,
          kind: "text",
          "data-plans-more": "",
          onClick: V
        }, {
          default: m(() => [...p[2] || (p[2] = [
            _("Show more", -1)
          ])]),
          _: 1
        })) : B("", !0)
      ], 64)) : (n(), g(c(L), {
        key: 0,
        shape: "cards"
      }))
    ]));
  }
}, te = /* @__PURE__ */ O(X, [["__scopeId", "data-v-5abf211f"]]);
export {
  te as default
};
