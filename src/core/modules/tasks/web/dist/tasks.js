/* @code-commandments-generated */
if (!document.getElementById("window-styles-170a6078f269")) { const style = document.createElement("style"); style.id = "window-styles-170a6078f269"; style.textContent = ".task-dock[data-v-3ff12b87]{display:flex;gap:8px;font-size:12px;line-height:1.45}.task-dock-state[data-v-3ff12b87]{color:var(--text-4)}.tasks[data-v-6a9cff2c]{display:flex;flex-direction:column;gap:14px}.tasks-search[data-v-6a9cff2c]{max-width:320px;padding:6px 12px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text)}.tasks-group-head[data-v-6a9cff2c]{margin:0 0 4px;color:var(--text-3);font-size:11px;font-weight:500;letter-spacing:.04em;text-transform:uppercase}.tasks-count[data-v-6a9cff2c]{margin-left:4px}.task[data-v-6a9cff2c]{display:flex;gap:10px;align-items:center;padding:6px 8px;border-radius:6px}.task[data-v-6a9cff2c]:hover{background:var(--hover)}.task-mark[data-v-6a9cff2c]{flex:none;width:12px;height:12px;border:1.5px solid var(--text-4);border-radius:50%}.task-mark.started[data-v-6a9cff2c],.task-mark.testing[data-v-6a9cff2c]{border-color:var(--accent);background:linear-gradient(90deg,var(--accent) 50%,transparent 50%)}.task-mark.blocked[data-v-6a9cff2c]{border-color:var(--danger)}.task-mark.completed[data-v-6a9cff2c]{border-color:var(--accent);background:var(--accent)}.task-mark.cancelled[data-v-6a9cff2c]{opacity:.4}.task-id[data-v-6a9cff2c]{flex:none;width:40px;color:var(--text-3);font-size:12px}.task-title[data-v-6a9cff2c]{flex:1;min-width:0}.task-priority[data-v-6a9cff2c],.tasks-note[data-v-6a9cff2c]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as v, computed as g, openBlock as e, createElementBlock as a, unref as i, createBlock as x, toDisplayString as o, Fragment as d, withDirectives as C, createElementVNode as n, vModelText as N, createCommentVNode as u, renderList as _, createTextVNode as S, normalizeClass as T } from "vue";
import { useRows as V, Skeleton as B } from "@journal/window-kit";
import { _ as D } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const E = { class: "tasks" }, L = {
  key: 1,
  class: "tasks-note"
}, R = {
  key: 0,
  class: "tasks-note"
}, b = ["data-state"], G = { class: "tasks-group-head" }, U = { class: "tasks-count" }, $ = ["data-row"], q = { class: "task-id" }, w = { class: "task-title" }, z = {
  key: 0,
  class: "task-priority"
}, F = {
  __name: "TaskGroups",
  setup(I) {
    const { rows: h, failure: k, loaded: m } = V("task list", ["task.*"]), y = ["started", "testing", "blocked", "open", "completed", "cancelled"], c = v(""), p = g(() => {
      const l = c.value.trim().toLowerCase(), r = h.value.filter((t) => !l || `${t.title} ${t.id}`.toLowerCase().includes(l));
      return y.map((t) => ({ state: t, tasks: r.filter((s) => s.state === t) })).filter((t) => t.tasks.length);
    }), f = (l) => l.slice(0, 1).toUpperCase() + l.slice(1);
    return (l, r) => (e(), a("div", E, [
      i(m) ? i(k) ? (e(), a("p", L, o(i(k)), 1)) : (e(), a(d, { key: 2 }, [
        C(n("input", {
          "onUpdate:modelValue": r[0] || (r[0] = (t) => c.value = t),
          class: "tasks-search",
          type: "search",
          placeholder: "Search the tasks",
          "aria-label": "Search the tasks"
        }, null, 512), [
          [N, c.value]
        ]),
        p.value.length ? u("", !0) : (e(), a("p", R, o(c.value ? "No task matches" : "No tasks yet"), 1)),
        (e(!0), a(d, null, _(p.value, (t) => (e(), a("section", {
          key: t.state,
          class: "tasks-group",
          "data-state": t.state
        }, [
          n("h3", G, [
            S(o(f(t.state)) + " ", 1),
            n("span", U, o(t.tasks.length), 1)
          ]),
          (e(!0), a(d, null, _(t.tasks, (s) => (e(), a("div", {
            key: s.id,
            class: "task",
            "data-row": s.id
          }, [
            n("span", {
              class: T(["task-mark", s.state])
            }, null, 2),
            n("span", q, o(s.id), 1),
            n("span", w, o(s.title), 1),
            s.priority && s.priority !== "normal" ? (e(), a("span", z, o(s.priority), 1)) : u("", !0)
          ], 8, $))), 128))
        ], 8, b))), 128))
      ], 64)) : (e(), x(i(B), {
        key: 0,
        shape: "rows"
      }))
    ]));
  }
}, A = /* @__PURE__ */ D(F, [["__scopeId", "data-v-6a9cff2c"]]);
export {
  A as default
};
