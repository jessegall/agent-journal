/* @code-commandments-generated */
if (!document.getElementById("window-styles-9ae3cc10ceb5")) { const style = document.createElement("style"); style.id = "window-styles-9ae3cc10ceb5"; style.textContent = ".task-dock[data-v-3ff12b87]{display:flex;gap:8px;font-size:12px;line-height:1.45}.task-dock-state[data-v-3ff12b87]{color:var(--text-4)}.tasks-more[data-v-debb731e]{margin:4px 0 0 8px;padding:2px 8px;border:0;border-radius:5px;background:none;color:var(--text-3);font:inherit;font-size:12px;cursor:pointer}.tasks-more[data-v-debb731e]:hover{background:var(--hover);color:var(--text)}.tasks[data-v-debb731e]{display:flex;flex-direction:column;gap:14px}.tasks-tools[data-v-debb731e]{display:flex;gap:8px;align-items:center}.tasks-search[data-v-debb731e]{flex:1;min-width:0;max-width:320px;padding:6px 12px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text)}.tasks-group-head[data-v-debb731e]{margin:0 0 4px;color:var(--text-3);font-size:11px;font-weight:500;letter-spacing:.04em;text-transform:uppercase}.tasks-count[data-v-debb731e]{margin-left:4px}.task[data-v-debb731e]{cursor:pointer;display:flex;gap:10px;align-items:center;padding:6px 8px;border-radius:6px}.task[data-v-debb731e]:hover{background:var(--hover)}.task.selected[data-v-debb731e]{background:var(--raised)}.task-mark[data-v-debb731e]{flex:none;width:12px;height:12px;border:1.5px solid var(--text-4);border-radius:50%}.task-mark.started[data-v-debb731e],.task-mark.testing[data-v-debb731e]{border-color:var(--accent);background:linear-gradient(90deg,var(--accent) 50%,transparent 50%)}.task-mark.blocked[data-v-debb731e]{border-color:var(--tone-warn)}.task-mark.completed[data-v-debb731e]{border-color:var(--accent);background:var(--accent)}.task-mark.cancelled[data-v-debb731e]{opacity:.4}.task-id[data-v-debb731e]{flex:none;width:40px;color:var(--text-3);font-size:12px}.task-title[data-v-debb731e]{flex:1;min-width:0}.task-priority[data-v-debb731e],.tasks-note[data-v-debb731e]{margin:0;color:var(--text-3);font-size:12px}.task-draft[data-v-b913ead2]{display:flex;flex-direction:column;gap:8px;margin-bottom:14px;padding:12px 14px;border:1px solid var(--border-2);border-radius:10px;background:var(--raised)}.line[data-v-b913ead2]{display:flex;gap:8px;align-items:center}.title[data-v-b913ead2],.brief[data-v-b913ead2]{width:100%;padding:0;border:0;outline:0;background:none;color:var(--text);font:inherit}.title[data-v-b913ead2]{font-weight:500}.brief[data-v-b913ead2]{resize:vertical;color:var(--text-2);font-size:13px}.failure[data-v-b913ead2]{margin:0;color:var(--danger);font-size:12.5px}.foot[data-v-b913ead2]{display:flex;gap:6px;align-items:center;justify-content:flex-end}.hint[data-v-b913ead2]{flex:1;color:var(--text-3);font-size:11.5px}.tasks-dialog[data-v-6e2664e2]{position:relative;display:flex;flex:1;flex-direction:column;min-height:0;height:100%}.tasks-head[data-v-6e2664e2]{display:flex;flex:none;align-items:center;gap:10px;height:52px;padding:0 12px 0 18px;border-bottom:1px solid var(--border)}h2[data-v-6e2664e2]{margin:0;font-size:15px;font-weight:600}.standing[data-v-6e2664e2]{color:var(--text-3);font-size:12px}.grow[data-v-6e2664e2]{flex:1}.tasks-body[data-v-6e2664e2]{display:flex;flex:1;min-height:0}.tasks-list[data-v-6e2664e2]{flex:1;min-width:0;overflow:auto;padding:14px 16px}\n"; document.head.appendChild(style); }
import { ref as k, computed as q, onUnmounted as G, openBlock as c, createElementBlock as m, createBlock as M, unref as p, toDisplayString as _, Fragment as L, createElementVNode as r, withDirectives as P, vModelText as Y, renderSlot as Z, createCommentVNode as T, renderList as R, createTextVNode as I, withKeys as U, normalizeClass as W, onMounted as J, withModifiers as j, createVNode as $, withCtx as K, nextTick as ee, createSlots as te } from "vue";
import { useWindow as z, Skeleton as se, peekRef as ae, TaskStatusIcon as le, Btn as V, Dialog as ne, Icon as F, TaskInspector as oe } from "@journal/window-kit";
import { _ as O } from "./_plugin-vue_export-helper-CHgC5LLL.js";
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
  setup(E, { expose: S, emit: y }) {
    const x = E, i = y, n = z(), b = k(null), d = k([]), v = k(""), w = k(!1), g = k(/* @__PURE__ */ new Set()), u = k("");
    async function l() {
      const s = await n.read(n.shared ? `${n.shared.model} show ${n.shared.id}` : "task board");
      if (v.value = s.ok ? "" : s.error, w.value = !0, !s.ok) return;
      if (n.shared) return void (d.value = [{ state: s.value.state, total: 1, rows: [s.value] }]);
      const t = new Map(d.value.map((e) => [e.state, e]));
      d.value = await Promise.all(s.value.groups.map((e) => h(e, t.get(e.state))));
    }
    async function h(s, t) {
      if (!g.value.has(s.state) || !(t != null && t.rows.length)) return s;
      const e = await n.read(`task board --state ${s.state} --limit ${t.rows.length}`);
      return e.ok ? e.value.groups[0] : s;
    }
    async function D(s) {
      const t = s.rows.length ? ` --before-id ${Math.min(...s.rows.map((f) => f.id))}` : "", e = await n.read(`task board --state ${s.state}${t}`);
      if (!e.ok) return void (v.value = e.error);
      g.value = /* @__PURE__ */ new Set([...g.value, s.state]);
      const a = d.value.find((f) => f.state === s.state), o = new Set(a.rows.map((f) => f.id));
      a.rows = [...a.rows, ...e.value.groups[0].rows.filter((f) => !o.has(f.id))];
    }
    const C = q(() => {
      const s = u.value.trim().toLowerCase();
      return d.value.map((t) => ({ group: t, tasks: t.rows.filter((e) => !s || `${e.title} ${e.id}`.toLowerCase().includes(s)) })).filter(({ group: t }) => t.total);
    }), A = (s) => s.slice(0, 1).toUpperCase() + s.slice(1), B = (s) => x.selectable ? i("select", s) : ae(`tasks:${s}`), N = n.follow(["task.*"], l);
    return G(() => N == null ? void 0 : N()), l(), S({ groups: C, focusSearch: () => {
      var s;
      return (s = b.value) == null ? void 0 : s.focus();
    } }), (s, t) => (c(), m("div", re, [
      w.value ? v.value ? (c(), m("p", ie, _(v.value), 1)) : (c(), m(L, { key: 2 }, [
        r("div", de, [
          P(r("input", {
            ref_key: "search",
            ref: b,
            "onUpdate:modelValue": t[0] || (t[0] = (e) => u.value = e),
            class: "tasks-search",
            type: "search",
            placeholder: "Search the tasks",
            "aria-label": "Search the tasks"
          }, null, 512), [
            [Y, u.value]
          ]),
          Z(s.$slots, "tools", {}, void 0, !0)
        ]),
        C.value.length ? T("", !0) : (c(), m("p", ue, _(u.value ? "No task matches" : "No tasks yet"), 1)),
        (c(!0), m(L, null, R(C.value, ({ group: e, tasks: a }) => (c(), m("section", {
          key: e.state,
          class: "tasks-group",
          "data-state": e.state
        }, [
          r("h3", ke, [
            I(_(A(e.state)) + " ", 1),
            r("span", ve, _(e.total), 1)
          ]),
          (c(!0), m(L, null, R(a, (o) => (c(), m("div", {
            key: o.id,
            class: W(["task", { selected: E.selectable && o.id === E.selected }]),
            "data-row": o.id,
            role: "button",
            tabindex: "0",
            onClick: (f) => B(o.id),
            onKeydown: U((f) => B(o.id), ["enter"])
          }, [
            r("span", {
              class: W(["task-mark", o.state])
            }, null, 2),
            r("span", me, _(o.id), 1),
            r("span", pe, _(o.title), 1),
            o.priority && o.priority !== "normal" ? (c(), m("span", we, _(o.priority), 1)) : T("", !0)
          ], 42, fe))), 128)),
          e.rows.length < e.total ? (c(), m("button", {
            key: 0,
            type: "button",
            class: "tasks-more",
            "data-more": e.state,
            onClick: (o) => D(e)
          }, _(e.rows.length ? "Show more" : `Show ${e.total} ${e.total === 1 ? "task" : "tasks"}`), 9, ye)) : T("", !0)
        ], 8, ce))), 128))
      ], 64)) : (c(), M(p(se), {
        key: 0,
        shape: "rows"
      }))
    ]));
  }
}, Q = /* @__PURE__ */ O(_e, [["__scopeId", "data-v-debb731e"]]), $e = { class: "line" }, be = ["onKeydown"], he = {
  key: 0,
  class: "failure",
  role: "alert"
}, Ce = { class: "foot" }, ge = {
  __name: "NewTask",
  emits: ["filed", "cancel"],
  setup(E, { emit: S }) {
    const y = S, x = z(), i = k(""), n = k(""), b = k(""), d = k(null), v = q(() => !!i.value.trim());
    async function w() {
      if (!v.value) return;
      const u = await x.run(["task", "make", i.value.trim(), ...n.value.trim() ? ["--brief", n.value.trim()] : []]);
      b.value = u.ok ? "" : u.error, u.ok && y("filed", u.value.id);
    }
    const g = (u) => (u.metaKey || u.ctrlKey) && (u.preventDefault(), w());
    return J(() => d.value.focus()), (u, l) => (c(), m("div", {
      class: "task-draft",
      "data-task-draft": "",
      onKeydown: l[3] || (l[3] = U(j((h) => y("cancel"), ["stop", "prevent"]), ["esc"]))
    }, [
      r("div", $e, [
        $(p(le), { status: "open" }),
        P(r("input", {
          ref_key: "input",
          ref: d,
          "onUpdate:modelValue": l[0] || (l[0] = (h) => i.value = h),
          class: "title",
          placeholder: "Task title",
          "aria-label": "Task title",
          onKeydown: U(j(w, ["prevent"]), ["enter"])
        }, null, 40, be), [
          [Y, i.value]
        ])
      ]),
      P(r("textarea", {
        "onUpdate:modelValue": l[1] || (l[1] = (h) => n.value = h),
        class: "brief",
        rows: "1",
        placeholder: "Add a brief: what done looks like. You can leave this empty.",
        "aria-label": "Brief",
        onKeydown: U(g, ["enter"])
      }, null, 544), [
        [Y, n.value]
      ]),
      b.value ? (c(), m("p", he, _(b.value), 1)) : T("", !0),
      r("div", Ce, [
        l[6] || (l[6] = r("span", { class: "hint" }, "Enter to file it, Esc to cancel", -1)),
        $(p(V), {
          small: "",
          onClick: l[2] || (l[2] = (h) => y("cancel"))
        }, {
          default: K(() => [...l[4] || (l[4] = [
            I("Cancel", -1)
          ])]),
          _: 1
        }),
        $(p(V), {
          small: "",
          kind: "primary",
          disabled: !v.value,
          "data-file-task": "",
          onClick: w
        }, {
          default: K(() => [...l[5] || (l[5] = [
            I("File the task", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Se = /* @__PURE__ */ O(ge, [["__scopeId", "data-v-b913ead2"]]), xe = {
  class: "tasks-dialog",
  "data-tasks-dialog": ""
}, Te = { class: "tasks-head" }, Ke = {
  class: "standing",
  "data-tasks-standing": ""
}, Ee = { class: "tasks-body" }, Ne = { class: "tasks-list" }, H = "input,textarea,select,[contenteditable],.menu-panel", De = {
  __name: "TasksDialog",
  emits: ["close"],
  setup(E, { emit: S }) {
    const y = S, x = z(), i = k(!0), n = k(null), b = k(null), d = k(0), v = k(!1), w = k(!1), g = k(0), u = x.follow(["task.*"], () => g.value += 1);
    G(() => u == null ? void 0 : u());
    const l = q(() => {
      var t;
      return (((t = n.value) == null ? void 0 : t.groups) ?? []).flatMap(({ tasks: e }) => e.map((a) => a.id));
    }), h = q(() => {
      var a, o;
      const t = (((a = n.value) == null ? void 0 : a.groups) ?? []).filter(({ group: f }) => f.state !== "completed" && f.state !== "cancelled"), e = (o = t.find(({ group: f }) => f.state === "blocked")) == null ? void 0 : o.group.total;
      return `${t.reduce((f, { group: X }) => f + X.total, 0)} not done${e ? `, ${e} blocked` : ""}`;
    });
    function D(t) {
      d.value = t, v.value = !0;
    }
    function C(t) {
      if (!l.value.length) return;
      const e = l.value.indexOf(d.value);
      d.value = e < 0 ? l.value[0] : l.value[Math.max(0, Math.min(l.value.length - 1, e + t))], ee(() => {
        var a;
        return (a = document.querySelector(`.tasks-dialog [data-row="${d.value}"]`)) == null ? void 0 : a.scrollIntoView({ block: "nearest" });
      });
    }
    function A(t) {
      w.value = !1, D(t);
    }
    const B = {
      ArrowDown: () => C(1),
      j: () => C(1),
      ArrowUp: () => C(-1),
      k: () => C(-1),
      Enter: () => d.value && (v.value = !0),
      " ": () => d.value && (v.value = !v.value),
      c: () => w.value = !0,
      s: () => {
        var t;
        return v.value && ((t = b.value) == null ? void 0 : t.openStatus(document.querySelector(".tasks-dialog [data-task-state]")));
      },
      "/": () => {
        var t;
        return (t = n.value) == null ? void 0 : t.focusSearch();
      }
    };
    function N(t) {
      var a, o;
      const e = B[t.key];
      !e || t.metaKey || t.ctrlKey || t.altKey || (o = (a = t.target).closest) != null && o.call(a, H) || (t.preventDefault(), e());
    }
    function s(t) {
      var e, a;
      t.key !== "Escape" || t.defaultPrevented || (a = (e = t.target).closest) != null && a.call(e, H) || (v.value ? v.value = !1 : i.value = !1);
    }
    return J(() => {
      window.addEventListener("keydown", N, !0), window.addEventListener("keydown", s);
    }), G(() => {
      window.removeEventListener("keydown", N, !0), window.removeEventListener("keydown", s);
    }), (t, e) => (c(), M(p(ne), {
      wide: "",
      tall: "",
      bare: "",
      title: "Tasks",
      open: i.value,
      onDismiss: e[4] || (e[4] = (a) => i.value = !1),
      onClose: e[5] || (e[5] = (a) => y("close"))
    }, {
      default: K(() => [
        r("div", xe, [
          r("header", Te, [
            e[7] || (e[7] = r("h2", null, "Tasks", -1)),
            r("span", Ke, _(h.value), 1),
            e[8] || (e[8] = r("span", { class: "grow" }, null, -1)),
            $(p(V), {
              small: "",
              title: "New task (C)",
              "data-new-task": "",
              onClick: e[0] || (e[0] = (a) => w.value = !0)
            }, {
              default: K(() => [
                $(p(F), {
                  name: "plus",
                  size: 12
                }),
                e[6] || (e[6] = I(" New task ", -1))
              ]),
              _: 1
            }),
            $(p(V), {
              small: "",
              "aria-label": "Close the tasks (Esc)",
              "data-tasks-close": "",
              onClick: e[1] || (e[1] = (a) => i.value = !1)
            }, {
              default: K(() => [
                $(p(F), {
                  name: "close",
                  size: 13
                })
              ]),
              _: 1
            })
          ]),
          r("div", Ee, [
            r("div", Ne, [
              w.value ? (c(), M(Se, {
                key: 0,
                onFiled: A,
                onCancel: e[2] || (e[2] = (a) => w.value = !1)
              })) : T("", !0),
              $(Q, {
                ref_key: "list",
                ref: n,
                selectable: "",
                selected: d.value,
                onSelect: D
              }, null, 8, ["selected"])
            ]),
            v.value && d.value ? (c(), M(p(oe), {
              key: 0,
              ref_key: "inspector",
              ref: b,
              stepped: "",
              id: d.value,
              read: p(x).run,
              changes: g.value,
              onClose: e[3] || (e[3] = (a) => v.value = !1),
              onStep: C,
              onSelect: D
            }, null, 8, ["id", "read", "changes"])) : T("", !0)
          ])
        ])
      ]),
      _: 1
    }, 8, ["open"]));
  }
}, Me = /* @__PURE__ */ O(De, [["__scopeId", "data-v-6e2664e2"]]), Le = {
  __name: "TasksWindow",
  setup(E) {
    const S = z(), y = k(!1);
    return (x, i) => (c(), m(L, null, [
      $(Q, null, te({ _: 2 }, [
        p(S).shared ? void 0 : {
          name: "tools",
          fn: K(() => [
            $(p(V), {
              small: "",
              bordered: "",
              "data-manage-tasks": "",
              onClick: i[0] || (i[0] = (n) => y.value = !0)
            }, {
              default: K(() => [...i[2] || (i[2] = [
                I("Manage tasks", -1)
              ])]),
              _: 1
            })
          ]),
          key: "0"
        }
      ]), 1024),
      y.value ? (c(), M(Me, {
        key: 0,
        onClose: i[1] || (i[1] = (n) => y.value = !1)
      })) : T("", !0)
    ], 64));
  }
};
export {
  Le as default
};
