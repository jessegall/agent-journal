/* @code-commandments-generated */
if (!document.getElementById("window-styles-a18b00034dc5")) { const style = document.createElement("style"); style.id = "window-styles-a18b00034dc5"; style.textContent = ".task-dock[data-v-3ff12b87]{display:flex;gap:8px;font-size:12px;line-height:1.45}.task-dock-state[data-v-3ff12b87]{color:var(--text-4)}.tasks-more[data-v-bd2ce6f9]{margin:4px 0 0 8px;padding:2px 8px;border:0;border-radius:5px;background:none;color:var(--text-3);font:inherit;font-size:12px;cursor:pointer}.tasks-more[data-v-bd2ce6f9]:hover{background:var(--hover);color:var(--text)}.tasks[data-v-bd2ce6f9]{display:flex;flex-direction:column;gap:14px}.tasks-search[data-v-bd2ce6f9]{max-width:320px;padding:6px 12px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text)}.tasks-group-head[data-v-bd2ce6f9]{margin:0 0 4px;color:var(--text-3);font-size:11px;font-weight:500;letter-spacing:.04em;text-transform:uppercase}.tasks-count[data-v-bd2ce6f9]{margin-left:4px}.task[data-v-bd2ce6f9]{cursor:pointer;display:flex;gap:10px;align-items:center;padding:6px 8px;border-radius:6px}.task[data-v-bd2ce6f9]:hover{background:var(--hover)}.task-mark[data-v-bd2ce6f9]{flex:none;width:12px;height:12px;border:1.5px solid var(--text-4);border-radius:50%}.task-mark.started[data-v-bd2ce6f9],.task-mark.testing[data-v-bd2ce6f9]{border-color:var(--accent);background:linear-gradient(90deg,var(--accent) 50%,transparent 50%)}.task-mark.blocked[data-v-bd2ce6f9]{border-color:var(--tone-warn)}.task-mark.completed[data-v-bd2ce6f9]{border-color:var(--accent);background:var(--accent)}.task-mark.cancelled[data-v-bd2ce6f9]{opacity:.4}.task-id[data-v-bd2ce6f9]{flex:none;width:40px;color:var(--text-3);font-size:12px}.task-title[data-v-bd2ce6f9]{flex:1;min-width:0}.task-priority[data-v-bd2ce6f9],.tasks-note[data-v-bd2ce6f9]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as i, computed as V, openBlock as o, createElementBlock as n, createBlock as B, unref as p, toDisplayString as l, Fragment as f, withDirectives as D, createElementVNode as c, vModelText as E, createCommentVNode as w, renderList as x, createTextVNode as I, withKeys as K, normalizeClass as L } from "vue";
import { useWindow as F, Skeleton as G, peekRef as S } from "@journal/window-kit";
import { _ as M } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const U = { class: "tasks" }, q = {
  key: 1,
  class: "tasks-note"
}, z = {
  key: 0,
  class: "tasks-note"
}, H = ["data-state"], R = { class: "tasks-group-head" }, W = { class: "tasks-count" }, j = ["data-row", "onClick", "onKeydown"], A = { class: "task-id" }, J = { class: "task-title" }, O = {
  key: 0,
  class: "task-priority"
}, P = ["data-more", "onClick"], Q = {
  __name: "TaskGroups",
  setup(X) {
    const y = /* @__PURE__ */ new Set(["completed", "cancelled"]), r = F(), d = i([]), k = i(""), $ = i(!1), u = i({}), h = i("");
    async function b() {
      const e = await r.read(r.shared ? `${r.shared.model} show ${r.shared.id}` : "task board");
      if (k.value = e.ok ? "" : e.error, $.value = !0, !e.ok) return;
      if (r.shared) return void (d.value = [{ state: e.value.state, total: 1, rows: [e.value] }]);
      const a = new Map(d.value.map((t) => [t.state, t]));
      d.value = e.value.groups.map((t) => {
        var v;
        const m = u.value[t.state] > (y.has(t.state) ? 0 : 1) ? ((v = a.get(t.state)) == null ? void 0 : v.rows) ?? [] : [], s = new Set(t.rows.map((_) => _.id));
        return { ...t, rows: [...t.rows, ...m.filter((_) => !s.has(_.id))] };
      });
    }
    async function N(e) {
      const a = (u.value[e.state] ?? (y.has(e.state) ? 0 : 1)) + 1, t = await r.read(`task board --state ${e.state} --page ${a}`);
      if (!t.ok) return void (k.value = t.error);
      u.value = { ...u.value, [e.state]: a }, e.rows = [...e.rows, ...t.value.groups[0].rows];
    }
    const C = V(() => {
      const e = h.value.trim().toLowerCase();
      return d.value.map((a) => ({ group: a, tasks: a.rows.filter((t) => !e || `${t.title} ${t.id}`.toLowerCase().includes(e)) })).filter(({ group: a }) => a.total);
    }), T = (e) => e.slice(0, 1).toUpperCase() + e.slice(1);
    return r.follow(["task.*"], b), b(), (e, a) => (o(), n("div", U, [
      $.value ? k.value ? (o(), n("p", q, l(k.value), 1)) : (o(), n(f, { key: 2 }, [
        D(c("input", {
          "onUpdate:modelValue": a[0] || (a[0] = (t) => h.value = t),
          class: "tasks-search",
          type: "search",
          placeholder: "Search the tasks",
          "aria-label": "Search the tasks"
        }, null, 512), [
          [E, h.value]
        ]),
        C.value.length ? w("", !0) : (o(), n("p", z, l(h.value ? "No task matches" : "No tasks yet"), 1)),
        (o(!0), n(f, null, x(C.value, ({ group: t, tasks: m }) => (o(), n("section", {
          key: t.state,
          class: "tasks-group",
          "data-state": t.state
        }, [
          c("h3", R, [
            I(l(T(t.state)) + " ", 1),
            c("span", W, l(t.total), 1)
          ]),
          (o(!0), n(f, null, x(m, (s) => (o(), n("div", {
            key: s.id,
            class: "task",
            "data-row": s.id,
            role: "button",
            tabindex: "0",
            onClick: (v) => p(S)(`tasks:${s.id}`),
            onKeydown: K((v) => p(S)(`tasks:${s.id}`), ["enter"])
          }, [
            c("span", {
              class: L(["task-mark", s.state])
            }, null, 2),
            c("span", A, l(s.id), 1),
            c("span", J, l(s.title), 1),
            s.priority && s.priority !== "normal" ? (o(), n("span", O, l(s.priority), 1)) : w("", !0)
          ], 40, j))), 128)),
          t.rows.length < t.total ? (o(), n("button", {
            key: 0,
            type: "button",
            class: "tasks-more",
            "data-more": t.state,
            onClick: (s) => N(t)
          }, "Show " + l(t.rows.length ? "more" : "them"), 9, P)) : w("", !0)
        ], 8, H))), 128))
      ], 64)) : (o(), B(p(G), {
        key: 0,
        shape: "rows"
      }))
    ]));
  }
}, tt = /* @__PURE__ */ M(Q, [["__scopeId", "data-v-bd2ce6f9"]]);
export {
  tt as default
};
