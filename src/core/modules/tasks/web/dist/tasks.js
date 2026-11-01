/* @code-commandments-generated */
if (!document.getElementById("window-styles-ae56af14fa38")) { const style = document.createElement("style"); style.id = "window-styles-ae56af14fa38"; style.textContent = ".task-dock[data-v-3ff12b87]{display:flex;gap:8px;font-size:12px;line-height:1.45}.task-dock-state[data-v-3ff12b87]{color:var(--text-4)}.tasks[data-v-fc66d718]{display:flex;flex-direction:column;gap:14px}.tasks-search[data-v-fc66d718]{max-width:320px;padding:6px 12px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text)}.tasks-group-head[data-v-fc66d718]{margin:0 0 4px;color:var(--text-3);font-size:11px;font-weight:500;letter-spacing:.04em;text-transform:uppercase}.tasks-count[data-v-fc66d718]{margin-left:4px}.task[data-v-fc66d718]{cursor:pointer;display:flex;gap:10px;align-items:center;padding:6px 8px;border-radius:6px}.task[data-v-fc66d718]:hover{background:var(--hover)}.task-mark[data-v-fc66d718]{flex:none;width:12px;height:12px;border:1.5px solid var(--text-4);border-radius:50%}.task-mark.started[data-v-fc66d718],.task-mark.testing[data-v-fc66d718]{border-color:var(--accent);background:linear-gradient(90deg,var(--accent) 50%,transparent 50%)}.task-mark.blocked[data-v-fc66d718]{border-color:var(--danger)}.task-mark.completed[data-v-fc66d718]{border-color:var(--accent);background:var(--accent)}.task-mark.cancelled[data-v-fc66d718]{opacity:.4}.task-id[data-v-fc66d718]{flex:none;width:40px;color:var(--text-3);font-size:12px}.task-title[data-v-fc66d718]{flex:1;min-width:0}.task-priority[data-v-fc66d718],.tasks-note[data-v-fc66d718]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as x, computed as $, openBlock as s, createElementBlock as a, unref as l, createBlock as g, toDisplayString as o, Fragment as d, withDirectives as N, createElementVNode as c, vModelText as b, createCommentVNode as u, renderList as _, createTextVNode as R, withKeys as S, normalizeClass as T } from "vue";
import { useRows as V, Skeleton as B, peekRef as h } from "@journal/window-kit";
import { _ as D } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const E = { class: "tasks" }, K = {
  key: 1,
  class: "tasks-note"
}, L = {
  key: 0,
  class: "tasks-note"
}, w = ["data-state"], G = { class: "tasks-group-head" }, U = { class: "tasks-count" }, q = ["data-row", "onClick", "onKeydown"], z = { class: "task-id" }, F = { class: "task-title" }, I = {
  key: 0,
  class: "task-priority"
}, M = {
  __name: "TaskGroups",
  setup(O) {
    const { rows: m, failure: k, loaded: y } = V("task list", ["task.*"]), f = ["started", "testing", "blocked", "open", "completed", "cancelled"], r = x(""), p = $(() => {
      const n = r.value.trim().toLowerCase(), i = m.value.filter((t) => !n || `${t.title} ${t.id}`.toLowerCase().includes(n));
      return f.map((t) => ({ state: t, tasks: i.filter((e) => e.state === t) })).filter((t) => t.tasks.length);
    }), v = (n) => n.slice(0, 1).toUpperCase() + n.slice(1);
    return (n, i) => (s(), a("div", E, [
      l(y) ? l(k) ? (s(), a("p", K, o(l(k)), 1)) : (s(), a(d, { key: 2 }, [
        N(c("input", {
          "onUpdate:modelValue": i[0] || (i[0] = (t) => r.value = t),
          class: "tasks-search",
          type: "search",
          placeholder: "Search the tasks",
          "aria-label": "Search the tasks"
        }, null, 512), [
          [b, r.value]
        ]),
        p.value.length ? u("", !0) : (s(), a("p", L, o(r.value ? "No task matches" : "No tasks yet"), 1)),
        (s(!0), a(d, null, _(p.value, (t) => (s(), a("section", {
          key: t.state,
          class: "tasks-group",
          "data-state": t.state
        }, [
          c("h3", G, [
            R(o(v(t.state)) + " ", 1),
            c("span", U, o(t.tasks.length), 1)
          ]),
          (s(!0), a(d, null, _(t.tasks, (e) => (s(), a("div", {
            key: e.id,
            class: "task",
            "data-row": e.id,
            role: "button",
            tabindex: "0",
            onClick: (C) => l(h)(`tasks:${e.id}`),
            onKeydown: S((C) => l(h)(`tasks:${e.id}`), ["enter"])
          }, [
            c("span", {
              class: T(["task-mark", e.state])
            }, null, 2),
            c("span", z, o(e.id), 1),
            c("span", F, o(e.title), 1),
            e.priority && e.priority !== "normal" ? (s(), a("span", I, o(e.priority), 1)) : u("", !0)
          ], 40, q))), 128))
        ], 8, w))), 128))
      ], 64)) : (s(), g(l(B), {
        key: 0,
        shape: "rows"
      }))
    ]));
  }
}, J = /* @__PURE__ */ D(M, [["__scopeId", "data-v-fc66d718"]]);
export {
  J as default
};
