/* @code-commandments-generated */
import { computed as v, ref as T, openBlock as d, createElementBlock as i, createElementVNode as g, unref as u, normalizeClass as A, toDisplayString as o, createTextVNode as h, Fragment as S, createCommentVNode as p, createVNode as _, createBlock as V, withCtx as N, renderList as B } from "vue";
import { useNow as E, age as M, peekRef as L, Icon as j, MenuPanel as q, MenuItem as F, useRows as O, TextInput as z, Segmented as D, RowList as H } from "@journal/window-kit";
import { _ as I } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const P = ["data-agent-open", "title"], W = ["aria-label"], U = { class: "agent-head" }, G = { class: "agent-name" }, J = { class: "agent-program" }, K = {
  key: 0,
  class: "agent-line"
}, Q = {
  class: "agent-task",
  "data-agent-card-task": ""
}, X = ["aria-expanded"], Y = {
  key: 1,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, Z = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null } },
  setup(t) {
    const x = { main: "Main agent", subagent: "Helper", worker: "Worker", reviewer: "Reviewer" }, a = t, w = v(() => x[a.row.role] ?? a.row.role), C = E(), b = v(() => a.row.ended_at ? `Closed ${new Date(a.row.ended_at).toLocaleString()}` : `Running ${M(a.row.process_started_at || a.row.created_at, C.value)}`), y = v(() => {
      var c, f, e;
      const s = [];
      return ((c = a.facts) == null ? void 0 : c.context_percent) !== null && ((f = a.facts) == null ? void 0 : f.context_percent) !== void 0 && s.push(`Context ${a.facts.context_percent}%`), (e = a.facts) != null && e.cost_dollars && s.push(`$${a.facts.cost_dollars.toFixed(2)}`), s.join(" · ");
    }), m = v(() => {
      var s;
      return ((s = a.facts) == null ? void 0 : s.delegated) ?? [];
    }), k = v(() => `${m.value.length} ${m.value.length === 1 ? "task" : "tasks"}`), r = T(null), R = (s) => r.value = r.value ? null : s.currentTarget;
    function $(s) {
      r.value = null, L(`tasks:${s}`);
    }
    return (s, c) => {
      var f, e, l;
      return d(), i("div", {
        class: "agent-card",
        "data-agent-open": t.row.id,
        title: t.row.session
      }, [
        g("button", {
          type: "button",
          class: "agent-open",
          "aria-label": `Open ${w.value} ${t.row.id}`,
          onClick: c[0] || (c[0] = (n) => u(L)(`agents:${t.row.id}`))
        }, null, 8, W),
        g("span", U, [
          g("span", {
            class: A(["agent-dot", { running: !t.row.ended_at }])
          }, null, 2),
          g("span", G, o(w.value) + " " + o(t.row.id), 1),
          g("span", J, [
            h(o(t.row.program), 1),
            (f = t.facts) != null && f.model ? (d(), i(S, { key: 0 }, [
              h(" · " + o(t.facts.model), 1)
            ], 64)) : p("", !0)
          ]),
          g("span", {
            class: A(["agent-time", { running: !t.row.ended_at }])
          }, o(b.value), 3)
        ]),
        (e = t.facts) != null && e.task_id || m.value.length ? (d(), i("span", K, [
          g("span", Q, [
            (l = t.facts) != null && l.task_id ? (d(), i(S, { key: 0 }, [
              h("Task " + o(t.facts.task_id) + ": " + o(t.facts.task_title), 1)
            ], 64)) : p("", !0)
          ]),
          m.value.length ? (d(), i("button", {
            key: 0,
            type: "button",
            class: "agent-tasks",
            "data-agent-tasks": "",
            "aria-expanded": !!r.value,
            onClick: R
          }, [
            h(o(k.value) + " ", 1),
            _(u(j), {
              name: "caret",
              size: 12
            })
          ], 8, X)) : p("", !0)
        ])) : p("", !0),
        y.value ? (d(), i("span", Y, o(y.value), 1)) : p("", !0),
        r.value ? (d(), V(u(q), {
          key: 2,
          anchor: r.value,
          "min-width": 260,
          "max-width": 420,
          "data-agent-task-menu": "",
          onClose: c[1] || (c[1] = (n) => r.value = null)
        }, {
          default: N(() => [
            (d(!0), i(S, null, B(m.value, (n) => (d(), V(u(F), {
              key: n.id,
              "data-agent-delegated": n.id,
              onClick: (se) => $(n.id)
            }, {
              default: N(() => [
                h("Task " + o(n.id) + ": " + o(n.title) + " · " + o(n.state), 1)
              ]),
              _: 2
            }, 1032, ["data-agent-delegated", "onClick"]))), 128))
          ]),
          _: 1
        }, 8, ["anchor"])) : p("", !0)
      ], 8, P);
    };
  }
}, ee = /* @__PURE__ */ I(Z, [["__scopeId", "data-v-a16a5c31"]]), te = {
  class: "agents",
  "data-window-flush": ""
}, ae = { class: "agents-bar" }, ne = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, only: { type: Function, default: () => !0 } },
  setup(t) {
    const x = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], a = t, { rows: w, failure: C, loaded: b, older: y } = O(a.line, ["agent.*"], { incremental: !0 }), { rows: m } = O("usage agents", ["agent.*", "task.*"]), k = T("running"), r = T(""), R = (e) => k.value === "all" || k.value === "running" == !e.ended_at, $ = (e) => m.value.find((l) => l.id === e.id) ?? null, s = (e) => {
      var l;
      return `${e.id} ${e.session} ${e.program} ${e.role} ${((l = $(e)) == null ? void 0 : l.task_title) ?? ""}`.toLowerCase().includes(r.value.trim().toLowerCase());
    }, c = v(() => w.value.filter((e) => a.only(e) && R(e) && s(e))), f = v(() => w.value.some(a.only) ? "Nothing matches" : a.empty);
    return (e, l) => (d(), i("div", te, [
      g("div", ae, [
        _(u(z), {
          modelValue: r.value,
          "onUpdate:modelValue": l[0] || (l[0] = (n) => r.value = n),
          icon: "search",
          class: "agents-search",
          placeholder: "Search the agents",
          "data-agents-search": ""
        }, null, 8, ["modelValue"]),
        _(u(D), {
          options: x,
          value: k.value,
          onPick: l[1] || (l[1] = (n) => k.value = n)
        }, null, 8, ["value"])
      ]),
      _(u(H), {
        rows: c.value,
        failure: u(C),
        loaded: u(b),
        older: u(y),
        empty: f.value
      }, {
        default: N(({ row: n }) => [
          _(ee, {
            row: n,
            facts: $(n)
          }, null, 8, ["row", "facts"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "older", "empty"])
    ]));
  }
}, de = /* @__PURE__ */ I(ne, [["__scopeId", "data-v-52ada3db"]]);
export {
  de as A
};
