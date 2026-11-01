/* @code-commandments-generated */
if (!document.getElementById("window-styles-60d7ba529d74")) { const style = document.createElement("style"); style.id = "window-styles-60d7ba529d74"; style.textContent = ".task-dock[data-v-3ff12b87]{display:flex;gap:8px;font-size:12px;line-height:1.45}.task-dock-state[data-v-3ff12b87]{color:var(--text-4)}.tasks-more[data-v-45598eb9]{margin:4px 0 0 8px;padding:2px 8px;border:0;border-radius:5px;background:none;color:var(--text-3);font:inherit;font-size:12px;cursor:pointer}.tasks-more[data-v-45598eb9]:hover{background:var(--hover);color:var(--text)}.tasks[data-v-45598eb9]{display:flex;flex-direction:column;gap:14px}.tasks-tools[data-v-45598eb9]{display:flex;gap:8px;align-items:center}.tasks-search[data-v-45598eb9]{flex:1;min-width:0;max-width:320px;padding:6px 12px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text)}.tasks-group-head[data-v-45598eb9]{margin:0 0 4px;color:var(--text-3);font-size:11px;font-weight:500;letter-spacing:.04em;text-transform:uppercase}.tasks-count[data-v-45598eb9]{margin-left:4px}.task[data-v-45598eb9]{cursor:pointer;display:flex;gap:10px;align-items:center;padding:6px 8px;border-radius:6px}.task[data-v-45598eb9]:hover{background:var(--hover)}.task.selected[data-v-45598eb9]{background:var(--raised)}.task-mark[data-v-45598eb9]{flex:none;width:12px;height:12px;border:1.5px solid var(--text-4);border-radius:50%}.task-mark.started[data-v-45598eb9],.task-mark.testing[data-v-45598eb9]{border-color:var(--accent);background:linear-gradient(90deg,var(--accent) 50%,transparent 50%)}.task-mark.blocked[data-v-45598eb9]{border-color:var(--tone-warn)}.task-mark.completed[data-v-45598eb9]{border-color:var(--accent);background:var(--accent)}.task-mark.cancelled[data-v-45598eb9]{opacity:.4}.task-id[data-v-45598eb9]{flex:none;width:40px;color:var(--text-3);font-size:12px}.task-title[data-v-45598eb9]{flex:1;min-width:0}.task-priority[data-v-45598eb9],.tasks-note[data-v-45598eb9]{margin:0;color:var(--text-3);font-size:12px}.task-draft[data-v-b913ead2]{display:flex;flex-direction:column;gap:8px;margin-bottom:14px;padding:12px 14px;border:1px solid var(--border-2);border-radius:10px;background:var(--raised)}.line[data-v-b913ead2]{display:flex;gap:8px;align-items:center}.title[data-v-b913ead2],.brief[data-v-b913ead2]{width:100%;padding:0;border:0;outline:0;background:none;color:var(--text);font:inherit}.title[data-v-b913ead2]{font-weight:500}.brief[data-v-b913ead2]{resize:vertical;color:var(--text-2);font-size:13px}.failure[data-v-b913ead2]{margin:0;color:var(--danger);font-size:12.5px}.foot[data-v-b913ead2]{display:flex;gap:6px;align-items:center;justify-content:flex-end}.hint[data-v-b913ead2]{flex:1;color:var(--text-3);font-size:11.5px}.tasks-dialog[data-v-959398a9]{position:relative;display:flex;flex:1;flex-direction:column;min-height:0;height:100%}.tasks-head[data-v-959398a9]{display:flex;flex:none;align-items:center;gap:10px;height:52px;padding:0 12px 0 18px;border-bottom:1px solid var(--border)}h2[data-v-959398a9]{margin:0;font-size:15px;font-weight:600}.standing[data-v-959398a9]{color:var(--text-3);font-size:12px}.grow[data-v-959398a9]{flex:1}.tasks-body[data-v-959398a9]{display:flex;flex:1;min-height:0}.tasks-list[data-v-959398a9]{flex:1;min-width:0;overflow:auto;padding:14px 16px}\n"; document.head.appendChild(style); }
import { ref as u, computed as F, openBlock as d, createElementBlock as p, createBlock as M, unref as w, toDisplayString as h, Fragment as L, createElementVNode as r, withDirectives as A, vModelText as G, renderSlot as Q, createCommentVNode as T, renderList as O, createTextVNode as V, withKeys as U, normalizeClass as P, onMounted as R, withModifiers as W, createVNode as b, withCtx as E, onUnmounted as X, nextTick as Z, createSlots as ee } from "vue";
import { useWindow as q, Skeleton as te, peekRef as se, TaskStatusIcon as ae, Btn as B, Dialog as le, Icon as j, TaskInspector as ne } from "@journal/window-kit";
import { _ as Y } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const oe = { class: "tasks" }, re = {
  key: 1,
  class: "tasks-note"
}, ie = { class: "tasks-tools" }, de = {
  key: 0,
  class: "tasks-note"
}, ue = ["data-state"], ce = { class: "tasks-group-head" }, ve = { class: "tasks-count" }, ke = ["data-row", "onClick", "onKeydown"], fe = { class: "task-id" }, me = { class: "task-title" }, pe = {
  key: 0,
  class: "task-priority"
}, we = ["data-more", "onClick"], ye = {
  __name: "TaskGroups",
  props: { selectable: Boolean, selected: { type: Number, default: 0 } },
  emits: ["select"],
  setup(K, { expose: g, emit: _ }) {
    const C = /* @__PURE__ */ new Set(["completed", "cancelled"]), i = K, m = _, k = q(), v = u(null), c = u([]), f = u(""), x = u(!1), n = u({}), l = u("");
    async function y() {
      const s = await k.read(k.shared ? `${k.shared.model} show ${k.shared.id}` : "task board");
      if (f.value = s.ok ? "" : s.error, x.value = !0, !s.ok) return;
      if (k.shared) return void (c.value = [{ state: s.value.state, total: 1, rows: [s.value] }]);
      const t = new Map(c.value.map((e) => [e.state, e]));
      c.value = s.value.groups.map((e) => {
        var $;
        const a = n.value[e.state] > (C.has(e.state) ? 0 : 1) ? (($ = t.get(e.state)) == null ? void 0 : $.rows) ?? [] : [], o = new Set(e.rows.map((I) => I.id));
        return { ...e, rows: [...e.rows, ...a.filter((I) => !o.has(I.id))] };
      });
    }
    async function S(s) {
      const t = (n.value[s.state] ?? (C.has(s.state) ? 0 : 1)) + 1, e = await k.read(`task board --state ${s.state} --page ${t}`);
      if (!e.ok) return void (f.value = e.error);
      n.value = { ...n.value, [s.state]: t }, s.rows = [...s.rows, ...e.value.groups[0].rows];
    }
    const N = F(() => {
      const s = l.value.trim().toLowerCase();
      return c.value.map((t) => ({ group: t, tasks: t.rows.filter((e) => !s || `${e.title} ${e.id}`.toLowerCase().includes(s)) })).filter(({ group: t }) => t.total);
    }), z = (s) => s.slice(0, 1).toUpperCase() + s.slice(1), D = (s) => i.selectable ? m("select", s) : se(`tasks:${s}`);
    return k.follow(["task.*"], y), y(), g({ groups: N, focusSearch: () => {
      var s;
      return (s = v.value) == null ? void 0 : s.focus();
    } }), (s, t) => (d(), p("div", oe, [
      x.value ? f.value ? (d(), p("p", re, h(f.value), 1)) : (d(), p(L, { key: 2 }, [
        r("div", ie, [
          A(r("input", {
            ref_key: "search",
            ref: v,
            "onUpdate:modelValue": t[0] || (t[0] = (e) => l.value = e),
            class: "tasks-search",
            type: "search",
            placeholder: "Search the tasks",
            "aria-label": "Search the tasks"
          }, null, 512), [
            [G, l.value]
          ]),
          Q(s.$slots, "tools", {}, void 0, !0)
        ]),
        N.value.length ? T("", !0) : (d(), p("p", de, h(l.value ? "No task matches" : "No tasks yet"), 1)),
        (d(!0), p(L, null, O(N.value, ({ group: e, tasks: a }) => (d(), p("section", {
          key: e.state,
          class: "tasks-group",
          "data-state": e.state
        }, [
          r("h3", ce, [
            V(h(z(e.state)) + " ", 1),
            r("span", ve, h(e.total), 1)
          ]),
          (d(!0), p(L, null, O(a, (o) => (d(), p("div", {
            key: o.id,
            class: P(["task", { selected: K.selectable && o.id === K.selected }]),
            "data-row": o.id,
            role: "button",
            tabindex: "0",
            onClick: ($) => D(o.id),
            onKeydown: U(($) => D(o.id), ["enter"])
          }, [
            r("span", {
              class: P(["task-mark", o.state])
            }, null, 2),
            r("span", fe, h(o.id), 1),
            r("span", me, h(o.title), 1),
            o.priority && o.priority !== "normal" ? (d(), p("span", pe, h(o.priority), 1)) : T("", !0)
          ], 42, ke))), 128)),
          e.rows.length < e.total ? (d(), p("button", {
            key: 0,
            type: "button",
            class: "tasks-more",
            "data-more": e.state,
            onClick: (o) => S(e)
          }, "Show " + h(e.rows.length ? "more" : "them"), 9, we)) : T("", !0)
        ], 8, ue))), 128))
      ], 64)) : (d(), M(w(te), {
        key: 0,
        shape: "rows"
      }))
    ]));
  }
}, J = /* @__PURE__ */ Y(ye, [["__scopeId", "data-v-45598eb9"]]), _e = { class: "line" }, $e = ["onKeydown"], he = {
  key: 0,
  class: "failure",
  role: "alert"
}, be = { class: "foot" }, Ce = {
  __name: "NewTask",
  emits: ["filed", "cancel"],
  setup(K, { emit: g }) {
    const _ = g, C = q(), i = u(""), m = u(""), k = u(""), v = u(null), c = F(() => !!i.value.trim());
    async function f() {
      if (!c.value) return;
      const n = await C.run(["task", "make", i.value.trim(), ...m.value.trim() ? ["--brief", m.value.trim()] : []]);
      k.value = n.ok ? "" : n.error, n.ok && _("filed", n.value.id);
    }
    const x = (n) => (n.metaKey || n.ctrlKey) && (n.preventDefault(), f());
    return R(() => v.value.focus()), (n, l) => (d(), p("div", {
      class: "task-draft",
      "data-task-draft": "",
      onKeydown: l[3] || (l[3] = U(W((y) => _("cancel"), ["stop", "prevent"]), ["esc"]))
    }, [
      r("div", _e, [
        b(w(ae), { status: "open" }),
        A(r("input", {
          ref_key: "input",
          ref: v,
          "onUpdate:modelValue": l[0] || (l[0] = (y) => i.value = y),
          class: "title",
          placeholder: "Task title",
          "aria-label": "Task title",
          onKeydown: U(W(f, ["prevent"]), ["enter"])
        }, null, 40, $e), [
          [G, i.value]
        ])
      ]),
      A(r("textarea", {
        "onUpdate:modelValue": l[1] || (l[1] = (y) => m.value = y),
        class: "brief",
        rows: "1",
        placeholder: "Add a brief: what done looks like. You can leave this empty.",
        "aria-label": "Brief",
        onKeydown: U(x, ["enter"])
      }, null, 544), [
        [G, m.value]
      ]),
      k.value ? (d(), p("p", he, h(k.value), 1)) : T("", !0),
      r("div", be, [
        l[6] || (l[6] = r("span", { class: "hint" }, "Enter to file it, Esc to cancel", -1)),
        b(w(B), {
          small: "",
          onClick: l[2] || (l[2] = (y) => _("cancel"))
        }, {
          default: E(() => [...l[4] || (l[4] = [
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
          default: E(() => [...l[5] || (l[5] = [
            V("File the task", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ge = /* @__PURE__ */ Y(Ce, [["__scopeId", "data-v-b913ead2"]]), xe = {
  class: "tasks-dialog",
  "data-tasks-dialog": ""
}, Se = { class: "tasks-head" }, Te = {
  class: "standing",
  "data-tasks-standing": ""
}, Ee = { class: "tasks-body" }, Ke = { class: "tasks-list" }, H = "input,textarea,select,[contenteditable],.menu-panel", Ne = {
  __name: "TasksDialog",
  emits: ["close"],
  setup(K, { emit: g }) {
    const _ = g, C = q(), i = u(!0), m = u(null), k = u(null), v = u(0), c = u(!1), f = u(!1), x = u(0);
    C.follow(["task.*"], () => x.value += 1);
    const n = F(() => {
      var t;
      return (((t = m.value) == null ? void 0 : t.groups) ?? []).flatMap(({ tasks: e }) => e.map((a) => a.id));
    }), l = F(() => {
      var a, o;
      const t = (((a = m.value) == null ? void 0 : a.groups) ?? []).filter(({ group: $ }) => $.state !== "completed" && $.state !== "cancelled"), e = (o = t.find(({ group: $ }) => $.state === "blocked")) == null ? void 0 : o.group.total;
      return `${t.reduce(($, { group: I }) => $ + I.total, 0)} not done${e ? `, ${e} blocked` : ""}`;
    });
    function y(t) {
      v.value = t, c.value = !0;
    }
    function S(t) {
      if (!n.value.length) return;
      const e = n.value.indexOf(v.value);
      v.value = e < 0 ? n.value[0] : n.value[Math.max(0, Math.min(n.value.length - 1, e + t))], Z(() => {
        var a;
        return (a = document.querySelector(`.tasks-dialog [data-row="${v.value}"]`)) == null ? void 0 : a.scrollIntoView({ block: "nearest" });
      });
    }
    function N(t) {
      f.value = !1, y(t);
    }
    const z = {
      ArrowDown: () => S(1),
      j: () => S(1),
      ArrowUp: () => S(-1),
      k: () => S(-1),
      Enter: () => v.value && (c.value = !0),
      " ": () => v.value && (c.value = !c.value),
      c: () => f.value = !0,
      s: () => {
        var t;
        return c.value && ((t = k.value) == null ? void 0 : t.openStatus(document.querySelector(".tasks-dialog [data-task-state]")));
      },
      "/": () => {
        var t;
        return (t = m.value) == null ? void 0 : t.focusSearch();
      }
    };
    function D(t) {
      var a, o;
      const e = z[t.key];
      !e || t.metaKey || t.ctrlKey || t.altKey || (o = (a = t.target).closest) != null && o.call(a, H) || (t.preventDefault(), e());
    }
    function s(t) {
      var e, a;
      t.key !== "Escape" || t.defaultPrevented || (a = (e = t.target).closest) != null && a.call(e, H) || (c.value ? c.value = !1 : i.value = !1);
    }
    return R(() => {
      window.addEventListener("keydown", D, !0), window.addEventListener("keydown", s);
    }), X(() => {
      window.removeEventListener("keydown", D, !0), window.removeEventListener("keydown", s);
    }), (t, e) => (d(), M(w(le), {
      wide: "",
      tall: "",
      bare: "",
      title: "Tasks",
      open: i.value,
      onDismiss: e[4] || (e[4] = (a) => i.value = !1),
      onClose: e[5] || (e[5] = (a) => _("close"))
    }, {
      default: E(() => [
        r("div", xe, [
          r("header", Se, [
            e[7] || (e[7] = r("h2", null, "Tasks", -1)),
            r("span", Te, h(l.value), 1),
            e[8] || (e[8] = r("span", { class: "grow" }, null, -1)),
            b(w(B), {
              small: "",
              title: "New task (C)",
              "data-new-task": "",
              onClick: e[0] || (e[0] = (a) => f.value = !0)
            }, {
              default: E(() => [
                b(w(j), {
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
              onClick: e[1] || (e[1] = (a) => i.value = !1)
            }, {
              default: E(() => [
                b(w(j), {
                  name: "close",
                  size: 13
                })
              ]),
              _: 1
            })
          ]),
          r("div", Ee, [
            r("div", Ke, [
              f.value ? (d(), M(ge, {
                key: 0,
                onFiled: N,
                onCancel: e[2] || (e[2] = (a) => f.value = !1)
              })) : T("", !0),
              b(J, {
                ref_key: "list",
                ref: m,
                selectable: "",
                selected: v.value,
                onSelect: y
              }, null, 8, ["selected"])
            ]),
            c.value && v.value ? (d(), M(w(ne), {
              key: 0,
              ref_key: "inspector",
              ref: k,
              stepped: "",
              id: v.value,
              read: w(C).run,
              changes: x.value,
              onClose: e[3] || (e[3] = (a) => c.value = !1),
              onStep: S,
              onSelect: y
            }, null, 8, ["id", "read", "changes"])) : T("", !0)
          ])
        ])
      ]),
      _: 1
    }, 8, ["open"]));
  }
}, De = /* @__PURE__ */ Y(Ne, [["__scopeId", "data-v-959398a9"]]), Be = {
  __name: "TasksWindow",
  setup(K) {
    const g = q(), _ = u(!1);
    return (C, i) => (d(), p(L, null, [
      b(J, null, ee({ _: 2 }, [
        w(g).shared ? void 0 : {
          name: "tools",
          fn: E(() => [
            b(w(B), {
              small: "",
              bordered: "",
              "data-manage-tasks": "",
              onClick: i[0] || (i[0] = (m) => _.value = !0)
            }, {
              default: E(() => [...i[2] || (i[2] = [
                V("Manage tasks", -1)
              ])]),
              _: 1
            })
          ]),
          key: "0"
        }
      ]), 1024),
      _.value ? (d(), M(De, {
        key: 0,
        onClose: i[1] || (i[1] = (m) => _.value = !1)
      })) : T("", !0)
    ], 64));
  }
};
export {
  Be as default
};
