/* @code-commandments-generated */
if (!document.getElementById("window-styles-7a605e6ed2f7")) { const style = document.createElement("style"); style.id = "window-styles-7a605e6ed2f7"; style.textContent = ".task-dock[data-v-3ff12b87]{display:flex;gap:8px;font-size:12px;line-height:1.45}.task-dock-state[data-v-3ff12b87]{color:var(--text-4)}.tasks-more[data-v-90b09758]{margin:4px 0 0 8px;padding:2px 8px;border:0;border-radius:5px;background:none;color:var(--text-3);font:inherit;font-size:12px;cursor:pointer}.tasks-more[data-v-90b09758]:hover{background:var(--hover);color:var(--text)}.tasks[data-v-90b09758]{display:flex;flex-direction:column;gap:14px}.tasks-tools[data-v-90b09758]{display:flex;gap:8px;align-items:center}.tasks-search[data-v-90b09758]{flex:1;min-width:0;max-width:320px;padding:6px 12px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text)}.tasks-group-head[data-v-90b09758]{margin:0 0 4px;color:var(--text-3);font-size:11px;font-weight:500;letter-spacing:.04em;text-transform:uppercase}.tasks-count[data-v-90b09758]{margin-left:4px}.task[data-v-90b09758]{cursor:pointer;display:flex;gap:10px;align-items:center;padding:6px 8px;border-radius:6px}.task[data-v-90b09758]:hover{background:var(--hover)}.task.selected[data-v-90b09758]{background:var(--raised)}.task-mark[data-v-90b09758]{flex:none;width:12px;height:12px;border:1.5px solid var(--text-4);border-radius:50%}.task-mark.started[data-v-90b09758],.task-mark.testing[data-v-90b09758]{border-color:var(--accent);background:linear-gradient(90deg,var(--accent) 50%,transparent 50%)}.task-mark.blocked[data-v-90b09758]{border-color:var(--tone-warn)}.task-mark.completed[data-v-90b09758]{border-color:var(--accent);background:var(--accent)}.task-mark.cancelled[data-v-90b09758]{opacity:.4}.task-id[data-v-90b09758]{flex:none;width:40px;color:var(--text-3);font-size:12px}.task-title[data-v-90b09758]{flex:1;min-width:0}.task-priority[data-v-90b09758],.tasks-note[data-v-90b09758]{margin:0;color:var(--text-3);font-size:12px}.task-draft[data-v-b913ead2]{display:flex;flex-direction:column;gap:8px;margin-bottom:14px;padding:12px 14px;border:1px solid var(--border-2);border-radius:10px;background:var(--raised)}.line[data-v-b913ead2]{display:flex;gap:8px;align-items:center}.title[data-v-b913ead2],.brief[data-v-b913ead2]{width:100%;padding:0;border:0;outline:0;background:none;color:var(--text);font:inherit}.title[data-v-b913ead2]{font-weight:500}.brief[data-v-b913ead2]{resize:vertical;color:var(--text-2);font-size:13px}.failure[data-v-b913ead2]{margin:0;color:var(--danger);font-size:12.5px}.foot[data-v-b913ead2]{display:flex;gap:6px;align-items:center;justify-content:flex-end}.hint[data-v-b913ead2]{flex:1;color:var(--text-3);font-size:11.5px}.tasks-dialog[data-v-6e2664e2]{position:relative;display:flex;flex:1;flex-direction:column;min-height:0;height:100%}.tasks-head[data-v-6e2664e2]{display:flex;flex:none;align-items:center;gap:10px;height:52px;padding:0 12px 0 18px;border-bottom:1px solid var(--border)}h2[data-v-6e2664e2]{margin:0;font-size:15px;font-weight:600}.standing[data-v-6e2664e2]{color:var(--text-3);font-size:12px}.grow[data-v-6e2664e2]{flex:1}.tasks-body[data-v-6e2664e2]{display:flex;flex:1;min-height:0}.tasks-list[data-v-6e2664e2]{flex:1;min-width:0;overflow:auto;padding:14px 16px}\n"; document.head.appendChild(style); }
import { ref as u, computed as z, onUnmounted as Y, openBlock as d, createElementBlock as p, createBlock as M, unref as w, toDisplayString as h, Fragment as U, createElementVNode as o, withDirectives as F, vModelText as O, renderSlot as Z, createCommentVNode as T, renderList as W, createTextVNode as V, withKeys as q, normalizeClass as j, onMounted as Q, withModifiers as H, createVNode as b, withCtx as E, nextTick as ee, createSlots as te } from "vue";
import { useWindow as A, Skeleton as se, peekRef as ae, TaskStatusIcon as le, Btn as B, Dialog as ne, Icon as R, TaskInspector as oe } from "@journal/window-kit";
import { _ as P } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const re = { class: "tasks" }, ie = {
  key: 1,
  class: "tasks-note"
}, de = { class: "tasks-tools" }, ue = {
  key: 0,
  class: "tasks-note"
}, ce = ["data-state"], ke = { class: "tasks-group-head" }, ve = { class: "tasks-count" }, fe = ["data-row", "onClick", "onKeydown"], me = { class: "task-id" }, pe = { class: "task-title" }, we = {
  key: 0,
  class: "task-priority"
}, ye = ["data-more", "onClick"], _e = {
  __name: "TaskGroups",
  props: { selectable: Boolean, selected: { type: Number, default: 0 } },
  emits: ["select"],
  setup(K, { expose: x, emit: y }) {
    const S = /* @__PURE__ */ new Set(["completed", "cancelled"]), r = K, m = y, v = A(), k = u(null), c = u([]), f = u(""), g = u(!1), i = u({}), a = u("");
    async function $() {
      const s = await v.read(v.shared ? `${v.shared.model} show ${v.shared.id}` : "task board");
      if (f.value = s.ok ? "" : s.error, g.value = !0, !s.ok) return;
      if (v.shared) return void (c.value = [{ state: s.value.state, total: 1, rows: [s.value] }]);
      const t = new Map(c.value.map((e) => [e.state, e]));
      c.value = s.value.groups.map((e) => {
        var _;
        const l = i.value[e.state] > (S.has(e.state) ? 0 : 1) ? ((_ = t.get(e.state)) == null ? void 0 : _.rows) ?? [] : [], n = new Set(e.rows.map((I) => I.id));
        return { ...e, rows: [...e.rows, ...l.filter((I) => !n.has(I.id))] };
      });
    }
    async function D(s) {
      const t = (i.value[s.state] ?? (S.has(s.state) ? 0 : 1)) + 1, e = await v.read(`task board --state ${s.state} --page ${t}`);
      if (!e.ok) return void (f.value = e.error);
      i.value = { ...i.value, [s.state]: t }, s.rows = [...s.rows, ...e.value.groups[0].rows];
    }
    const C = z(() => {
      const s = a.value.trim().toLowerCase();
      return c.value.map((t) => ({ group: t, tasks: t.rows.filter((e) => !s || `${e.title} ${e.id}`.toLowerCase().includes(s)) })).filter(({ group: t }) => t.total);
    }), G = (s) => s.slice(0, 1).toUpperCase() + s.slice(1), L = (s) => r.selectable ? m("select", s) : ae(`tasks:${s}`), N = v.follow(["task.*"], $);
    return Y(() => N == null ? void 0 : N()), $(), x({ groups: C, focusSearch: () => {
      var s;
      return (s = k.value) == null ? void 0 : s.focus();
    } }), (s, t) => (d(), p("div", re, [
      g.value ? f.value ? (d(), p("p", ie, h(f.value), 1)) : (d(), p(U, { key: 2 }, [
        o("div", de, [
          F(o("input", {
            ref_key: "search",
            ref: k,
            "onUpdate:modelValue": t[0] || (t[0] = (e) => a.value = e),
            class: "tasks-search",
            type: "search",
            placeholder: "Search the tasks",
            "aria-label": "Search the tasks"
          }, null, 512), [
            [O, a.value]
          ]),
          Z(s.$slots, "tools", {}, void 0, !0)
        ]),
        C.value.length ? T("", !0) : (d(), p("p", ue, h(a.value ? "No task matches" : "No tasks yet"), 1)),
        (d(!0), p(U, null, W(C.value, ({ group: e, tasks: l }) => (d(), p("section", {
          key: e.state,
          class: "tasks-group",
          "data-state": e.state
        }, [
          o("h3", ke, [
            V(h(G(e.state)) + " ", 1),
            o("span", ve, h(e.total), 1)
          ]),
          (d(!0), p(U, null, W(l, (n) => (d(), p("div", {
            key: n.id,
            class: j(["task", { selected: K.selectable && n.id === K.selected }]),
            "data-row": n.id,
            role: "button",
            tabindex: "0",
            onClick: (_) => L(n.id),
            onKeydown: q((_) => L(n.id), ["enter"])
          }, [
            o("span", {
              class: j(["task-mark", n.state])
            }, null, 2),
            o("span", me, h(n.id), 1),
            o("span", pe, h(n.title), 1),
            n.priority && n.priority !== "normal" ? (d(), p("span", we, h(n.priority), 1)) : T("", !0)
          ], 42, fe))), 128)),
          e.rows.length < e.total ? (d(), p("button", {
            key: 0,
            type: "button",
            class: "tasks-more",
            "data-more": e.state,
            onClick: (n) => D(e)
          }, h(e.rows.length ? "Show more" : `Show ${e.total} ${e.total === 1 ? "task" : "tasks"}`), 9, ye)) : T("", !0)
        ], 8, ce))), 128))
      ], 64)) : (d(), M(w(se), {
        key: 0,
        shape: "rows"
      }))
    ]));
  }
}, X = /* @__PURE__ */ P(_e, [["__scopeId", "data-v-90b09758"]]), $e = { class: "line" }, he = ["onKeydown"], be = {
  key: 0,
  class: "failure",
  role: "alert"
}, Ce = { class: "foot" }, Se = {
  __name: "NewTask",
  emits: ["filed", "cancel"],
  setup(K, { emit: x }) {
    const y = x, S = A(), r = u(""), m = u(""), v = u(""), k = u(null), c = z(() => !!r.value.trim());
    async function f() {
      if (!c.value) return;
      const i = await S.run(["task", "make", r.value.trim(), ...m.value.trim() ? ["--brief", m.value.trim()] : []]);
      v.value = i.ok ? "" : i.error, i.ok && y("filed", i.value.id);
    }
    const g = (i) => (i.metaKey || i.ctrlKey) && (i.preventDefault(), f());
    return Q(() => k.value.focus()), (i, a) => (d(), p("div", {
      class: "task-draft",
      "data-task-draft": "",
      onKeydown: a[3] || (a[3] = q(H(($) => y("cancel"), ["stop", "prevent"]), ["esc"]))
    }, [
      o("div", $e, [
        b(w(le), { status: "open" }),
        F(o("input", {
          ref_key: "input",
          ref: k,
          "onUpdate:modelValue": a[0] || (a[0] = ($) => r.value = $),
          class: "title",
          placeholder: "Task title",
          "aria-label": "Task title",
          onKeydown: q(H(f, ["prevent"]), ["enter"])
        }, null, 40, he), [
          [O, r.value]
        ])
      ]),
      F(o("textarea", {
        "onUpdate:modelValue": a[1] || (a[1] = ($) => m.value = $),
        class: "brief",
        rows: "1",
        placeholder: "Add a brief: what done looks like. You can leave this empty.",
        "aria-label": "Brief",
        onKeydown: q(g, ["enter"])
      }, null, 544), [
        [O, m.value]
      ]),
      v.value ? (d(), p("p", be, h(v.value), 1)) : T("", !0),
      o("div", Ce, [
        a[6] || (a[6] = o("span", { class: "hint" }, "Enter to file it, Esc to cancel", -1)),
        b(w(B), {
          small: "",
          onClick: a[2] || (a[2] = ($) => y("cancel"))
        }, {
          default: E(() => [...a[4] || (a[4] = [
            V("Cancel", -1)
          ])]),
          _: 1
        }),
        b(w(B), {
          small: "",
          kind: "primary",
          disabled: !c.value,
          "data-file-task": "",
          onClick: f
        }, {
          default: E(() => [...a[5] || (a[5] = [
            V("File the task", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, xe = /* @__PURE__ */ P(Se, [["__scopeId", "data-v-b913ead2"]]), ge = {
  class: "tasks-dialog",
  "data-tasks-dialog": ""
}, Te = { class: "tasks-head" }, Ee = {
  class: "standing",
  "data-tasks-standing": ""
}, Ke = { class: "tasks-body" }, Ne = { class: "tasks-list" }, J = "input,textarea,select,[contenteditable],.menu-panel", De = {
  __name: "TasksDialog",
  emits: ["close"],
  setup(K, { emit: x }) {
    const y = x, S = A(), r = u(!0), m = u(null), v = u(null), k = u(0), c = u(!1), f = u(!1), g = u(0), i = S.follow(["task.*"], () => g.value += 1);
    Y(() => i == null ? void 0 : i());
    const a = z(() => {
      var t;
      return (((t = m.value) == null ? void 0 : t.groups) ?? []).flatMap(({ tasks: e }) => e.map((l) => l.id));
    }), $ = z(() => {
      var l, n;
      const t = (((l = m.value) == null ? void 0 : l.groups) ?? []).filter(({ group: _ }) => _.state !== "completed" && _.state !== "cancelled"), e = (n = t.find(({ group: _ }) => _.state === "blocked")) == null ? void 0 : n.group.total;
      return `${t.reduce((_, { group: I }) => _ + I.total, 0)} not done${e ? `, ${e} blocked` : ""}`;
    });
    function D(t) {
      k.value = t, c.value = !0;
    }
    function C(t) {
      if (!a.value.length) return;
      const e = a.value.indexOf(k.value);
      k.value = e < 0 ? a.value[0] : a.value[Math.max(0, Math.min(a.value.length - 1, e + t))], ee(() => {
        var l;
        return (l = document.querySelector(`.tasks-dialog [data-row="${k.value}"]`)) == null ? void 0 : l.scrollIntoView({ block: "nearest" });
      });
    }
    function G(t) {
      f.value = !1, D(t);
    }
    const L = {
      ArrowDown: () => C(1),
      j: () => C(1),
      ArrowUp: () => C(-1),
      k: () => C(-1),
      Enter: () => k.value && (c.value = !0),
      " ": () => k.value && (c.value = !c.value),
      c: () => f.value = !0,
      s: () => {
        var t;
        return c.value && ((t = v.value) == null ? void 0 : t.openStatus(document.querySelector(".tasks-dialog [data-task-state]")));
      },
      "/": () => {
        var t;
        return (t = m.value) == null ? void 0 : t.focusSearch();
      }
    };
    function N(t) {
      var l, n;
      const e = L[t.key];
      !e || t.metaKey || t.ctrlKey || t.altKey || (n = (l = t.target).closest) != null && n.call(l, J) || (t.preventDefault(), e());
    }
    function s(t) {
      var e, l;
      t.key !== "Escape" || t.defaultPrevented || (l = (e = t.target).closest) != null && l.call(e, J) || (c.value ? c.value = !1 : r.value = !1);
    }
    return Q(() => {
      window.addEventListener("keydown", N, !0), window.addEventListener("keydown", s);
    }), Y(() => {
      window.removeEventListener("keydown", N, !0), window.removeEventListener("keydown", s);
    }), (t, e) => (d(), M(w(ne), {
      wide: "",
      tall: "",
      bare: "",
      title: "Tasks",
      open: r.value,
      onDismiss: e[4] || (e[4] = (l) => r.value = !1),
      onClose: e[5] || (e[5] = (l) => y("close"))
    }, {
      default: E(() => [
        o("div", ge, [
          o("header", Te, [
            e[7] || (e[7] = o("h2", null, "Tasks", -1)),
            o("span", Ee, h($.value), 1),
            e[8] || (e[8] = o("span", { class: "grow" }, null, -1)),
            b(w(B), {
              small: "",
              title: "New task (C)",
              "data-new-task": "",
              onClick: e[0] || (e[0] = (l) => f.value = !0)
            }, {
              default: E(() => [
                b(w(R), {
                  name: "plus",
                  size: 12
                }),
                e[6] || (e[6] = V(" New task ", -1))
              ]),
              _: 1
            }),
            b(w(B), {
              small: "",
              "aria-label": "Close the tasks (Esc)",
              "data-tasks-close": "",
              onClick: e[1] || (e[1] = (l) => r.value = !1)
            }, {
              default: E(() => [
                b(w(R), {
                  name: "close",
                  size: 13
                })
              ]),
              _: 1
            })
          ]),
          o("div", Ke, [
            o("div", Ne, [
              f.value ? (d(), M(xe, {
                key: 0,
                onFiled: G,
                onCancel: e[2] || (e[2] = (l) => f.value = !1)
              })) : T("", !0),
              b(X, {
                ref_key: "list",
                ref: m,
                selectable: "",
                selected: k.value,
                onSelect: D
              }, null, 8, ["selected"])
            ]),
            c.value && k.value ? (d(), M(w(oe), {
              key: 0,
              ref_key: "inspector",
              ref: v,
              stepped: "",
              id: k.value,
              read: w(S).run,
              changes: g.value,
              onClose: e[3] || (e[3] = (l) => c.value = !1),
              onStep: C,
              onSelect: D
            }, null, 8, ["id", "read", "changes"])) : T("", !0)
          ])
        ])
      ]),
      _: 1
    }, 8, ["open"]));
  }
}, Ie = /* @__PURE__ */ P(De, [["__scopeId", "data-v-6e2664e2"]]), Le = {
  __name: "TasksWindow",
  setup(K) {
    const x = A(), y = u(!1);
    return (S, r) => (d(), p(U, null, [
      b(X, null, te({ _: 2 }, [
        w(x).shared ? void 0 : {
          name: "tools",
          fn: E(() => [
            b(w(B), {
              small: "",
              bordered: "",
              "data-manage-tasks": "",
              onClick: r[0] || (r[0] = (m) => y.value = !0)
            }, {
              default: E(() => [...r[2] || (r[2] = [
                V("Manage tasks", -1)
              ])]),
              _: 1
            })
          ]),
          key: "0"
        }
      ]), 1024),
      y.value ? (d(), M(Ie, {
        key: 0,
        onClose: r[1] || (r[1] = (m) => y.value = !1)
      })) : T("", !0)
    ], 64));
  }
};
export {
  Le as default
};
