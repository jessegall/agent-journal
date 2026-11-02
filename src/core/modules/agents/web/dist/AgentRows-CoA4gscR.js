/* @code-commandments-generated */
import { computed as k, ref as N, openBlock as d, createElementBlock as c, createElementVNode as i, unref as r, normalizeClass as V, toDisplayString as l, createTextVNode as _, Fragment as T, createCommentVNode as p, createVNode as y, createBlock as L, withCtx as A, renderList as E } from "vue";
import { useNow as M, age as j, peekRef as O, Icon as q, MenuPanel as F, MenuItem as z, useRows as I, TextInput as D, Segmented as H, RowList as P } from "@journal/window-kit";
import { _ as B } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const W = ["data-agent-open", "title"], U = ["aria-label"], G = { class: "agent-head" }, J = { class: "agent-name" }, K = { class: "agent-program" }, Q = {
  key: 0,
  class: "agent-line"
}, X = {
  class: "agent-task",
  "data-agent-card-task": ""
}, Y = ["aria-expanded"], Z = {
  key: 1,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, ee = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null } },
  setup(t) {
    const x = { main: "Main agent", subagent: "Helper", worker: "Worker", reviewer: "Reviewer" }, a = t, w = k(() => x[a.row.role] ?? a.row.role), C = M(), b = k(() => a.row.ended_at ? `Closed ${new Date(a.row.ended_at).toLocaleString()}` : `Running ${j(a.row.process_started_at || a.row.created_at, C.value)}`), $ = k(() => {
      var u, m, f;
      const s = [];
      return ((u = a.facts) == null ? void 0 : u.context_percent) !== null && ((m = a.facts) == null ? void 0 : m.context_percent) !== void 0 && s.push(`Context ${a.facts.context_percent}%`), (f = a.facts) != null && f.cost_dollars && s.push(`$${a.facts.cost_dollars.toFixed(2)}`), s.join(" · ");
    }), g = k(() => {
      var s;
      return ((s = a.facts) == null ? void 0 : s.delegated) ?? [];
    }), R = k(() => `${g.value.length} ${g.value.length === 1 ? "task" : "tasks"}`), o = N(null), h = (s) => o.value = o.value ? null : s.currentTarget;
    function S(s) {
      o.value = null, O(`tasks:${s}`);
    }
    return (s, u) => {
      var m, f, n;
      return d(), c("div", {
        class: "agent-card",
        "data-agent-open": t.row.id,
        title: t.row.session
      }, [
        i("button", {
          type: "button",
          class: "agent-open",
          "aria-label": `Open ${w.value} ${t.row.id}`,
          onClick: u[0] || (u[0] = (e) => r(O)(`agents:${t.row.id}`))
        }, null, 8, U),
        i("span", G, [
          i("span", {
            class: V(["agent-dot", { running: !t.row.ended_at }])
          }, null, 2),
          i("span", J, l(w.value) + " " + l(t.row.id), 1),
          i("span", K, [
            _(l(t.row.program), 1),
            (m = t.facts) != null && m.model ? (d(), c(T, { key: 0 }, [
              _(" · " + l(t.facts.model), 1)
            ], 64)) : p("", !0)
          ]),
          i("span", {
            class: V(["agent-time", { running: !t.row.ended_at }])
          }, l(b.value), 3)
        ]),
        (f = t.facts) != null && f.task_id || g.value.length ? (d(), c("span", Q, [
          i("span", X, [
            (n = t.facts) != null && n.task_id ? (d(), c(T, { key: 0 }, [
              _("Task " + l(t.facts.task_id) + ": " + l(t.facts.task_title), 1)
            ], 64)) : p("", !0)
          ]),
          g.value.length ? (d(), c("button", {
            key: 0,
            type: "button",
            class: "agent-tasks",
            "data-agent-tasks": "",
            "aria-expanded": !!o.value,
            onClick: h
          }, [
            _(l(R.value) + " ", 1),
            y(r(q), {
              name: "caret",
              size: 12
            })
          ], 8, Y)) : p("", !0)
        ])) : p("", !0),
        $.value ? (d(), c("span", Z, l($.value), 1)) : p("", !0),
        o.value ? (d(), L(r(F), {
          key: 2,
          anchor: o.value,
          "min-width": 260,
          "max-width": 420,
          "data-agent-task-menu": "",
          onClose: u[1] || (u[1] = (e) => o.value = null)
        }, {
          default: A(() => [
            (d(!0), c(T, null, E(g.value, (e) => (d(), L(r(z), {
              key: e.id,
              "data-agent-delegated": e.id,
              onClick: (v) => S(e.id)
            }, {
              default: A(() => [
                _("Task " + l(e.id) + ": " + l(e.title) + " · " + l(e.state), 1)
              ]),
              _: 2
            }, 1032, ["data-agent-delegated", "onClick"]))), 128))
          ]),
          _: 1
        }, 8, ["anchor"])) : p("", !0)
      ], 8, W);
    };
  }
}, te = /* @__PURE__ */ B(ee, [["__scopeId", "data-v-a16a5c31"]]), ae = {
  class: "agents",
  "data-window-flush": ""
}, ne = { class: "agents-bar" }, se = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, only: { type: Function, default: () => !0 } },
  setup(t) {
    const x = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], a = t, { rows: w, failure: C, loaded: b, more: $, older: g } = I(a.line, ["agent.*"], { incremental: !0 }), { rows: R } = I("usage agents", ["agent.*", "task.*"]), o = N("running"), h = N(""), S = (n) => o.value === "all" || o.value === "running" == !n.ended_at, s = (n) => R.value.find((e) => e.id === n.id) ?? null, u = (n) => {
      var e;
      return `${n.id} ${n.session} ${n.program} ${n.role} ${((e = s(n)) == null ? void 0 : e.task_title) ?? ""}`.toLowerCase().includes(h.value.trim().toLowerCase());
    }, m = k(() => w.value.filter((n) => a.only(n) && S(n) && u(n))), f = k(() => w.value.some(a.only) ? "Nothing matches" : a.empty);
    return (n, e) => (d(), c("div", ae, [
      i("div", ne, [
        y(r(D), {
          modelValue: h.value,
          "onUpdate:modelValue": e[0] || (e[0] = (v) => h.value = v),
          icon: "search",
          class: "agents-search",
          placeholder: "Search the agents",
          "data-agents-search": ""
        }, null, 8, ["modelValue"]),
        y(r(H), {
          options: x,
          value: o.value,
          onPick: e[1] || (e[1] = (v) => o.value = v)
        }, null, 8, ["value"])
      ]),
      y(r(P), {
        rows: m.value,
        failure: r(C),
        loaded: r(b),
        more: r($),
        older: r(g),
        empty: f.value
      }, {
        default: A(({ row: v }) => [
          y(te, {
            row: v,
            facts: s(v)
          }, null, 8, ["row", "facts"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty"])
    ]));
  }
}, de = /* @__PURE__ */ B(se, [["__scopeId", "data-v-657044e9"]]);
export {
  de as A
};
