/* @code-commandments-generated */
import { computed as r, ref as L, openBlock as c, createElementBlock as i, createElementVNode as s, toDisplayString as l, createVNode as f, unref as o, normalizeClass as q, createCommentVNode as N, withModifiers as K, withCtx as R, createTextVNode as V, Fragment as b, renderList as B } from "vue";
import { useNow as W, age as O, Icon as z, Btn as D, peekRef as j, TaskStatusIcon as H, useRows as E, SearchBar as M, Segmented as U, RowList as P } from "@journal/window-kit";
import { _ as F } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const G = ["data-agent-open", "aria-expanded", "title"], J = { class: "agent-head" }, Q = ["data-state"], X = {
  class: "agent-title",
  "data-agent-title": ""
}, Y = {
  class: "agent-name",
  "data-agent-name": ""
}, Z = { class: "agent-time" }, ee = { class: "agent-line" }, te = {
  class: "agent-identity",
  "data-agent-identity": ""
}, ae = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": ""
}, se = { class: "agent-usage-line" }, ne = {
  class: "agent-usage",
  "data-agent-card-usage": ""
}, oe = ["data-agent-section"], le = { class: "agent-section-count" }, re = ["data-agent-delegated", "onClick"], de = { class: "agent-task-number" }, ce = { class: "agent-task-title" }, ie = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ue = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null } },
  setup(d) {
    const C = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, m = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), y = ["started", "testing", "blocked", "open", "completed", "cancelled"], a = d, $ = W(), S = r(() => {
      var e;
      return ((e = a.facts) == null ? void 0 : e.profile) || C[a.row.role] || a.row.role;
    }), x = r(() => {
      var e;
      return [a.row.program, (e = a.facts) == null ? void 0 : e.model, m.has(a.row.role) ? a.row.role : ""].filter(Boolean).join(" · ");
    }), A = r(() => a.row.ended_at ? `${O(a.row.ended_at, $.value)} ago` : O(a.row.process_started_at || a.row.created_at, $.value)), v = r(() => {
      var e;
      return a.row.ended_at ? "closed" : ((e = a.facts) == null ? void 0 : e.state) || "running";
    }), w = r(() => {
      var t, n, h;
      const e = [`agent ${a.row.id}`];
      return ((t = a.facts) == null ? void 0 : t.context_percent) !== null && ((n = a.facts) == null ? void 0 : n.context_percent) !== void 0 && e.push(`Context ${a.facts.context_percent}%`), (h = a.facts) != null && h.cost_dollars && e.push(`$${a.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), u = r(() => {
      var e;
      return ((e = a.facts) == null ? void 0 : e.tasks) ?? [];
    }), k = r(() => u.value.filter((e) => e.state === "completed").length), T = r(() => `${k.value} of ${u.value.length} ${u.value.length === 1 ? "task" : "tasks"}`), I = r(() => y.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: u.value.filter((t) => t.state === e) })).filter((e) => e.tasks.length)), g = L(!1);
    return (e, t) => {
      var n, h;
      return c(), i("div", {
        class: "agent-card",
        "data-agent-open": d.row.id,
        "aria-expanded": g.value,
        title: d.row.session,
        onClick: t[2] || (t[2] = (p) => g.value = !g.value)
      }, [
        s("span", J, [
          s("span", {
            class: "agent-dot",
            "data-state": v.value
          }, null, 8, Q),
          s("span", X, l(S.value), 1),
          s("span", Y, l(((n = d.facts) == null ? void 0 : n.given_name) || d.row.id), 1),
          s("span", Z, l(A.value), 1),
          f(o(z), {
            class: q(["agent-chevron", { opened: g.value }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        s("span", ee, [
          s("span", te, l(x.value), 1),
          u.value.length ? (c(), i("span", ae, l(T.value), 1)) : N("", !0)
        ]),
        g.value ? (c(), i("div", {
          key: 0,
          class: "agent-more",
          "data-agent-more": "",
          onClick: t[1] || (t[1] = K(() => {
          }, ["stop"]))
        }, [
          s("span", se, [
            s("span", ne, l(w.value), 1),
            f(o(D), {
              small: "",
              bordered: "",
              "data-agent-inspect": "",
              onClick: t[0] || (t[0] = (p) => o(j)(`agents:${d.row.id}`))
            }, {
              default: R(() => [...t[3] || (t[3] = [
                V("Inspect", -1)
              ])]),
              _: 1
            })
          ]),
          (c(!0), i(b, null, B(I.value, (p) => (c(), i(b, {
            key: p.state
          }, [
            s("p", {
              class: "agent-label",
              "data-agent-section": p.state
            }, [
              V(l(p.label) + " ", 1),
              s("span", le, l(p.tasks.length), 1)
            ], 8, oe),
            (c(!0), i(b, null, B(p.tasks, (_) => (c(), i("button", {
              key: _.id,
              type: "button",
              class: "agent-task",
              "data-agent-delegated": _.id,
              onClick: (ve) => o(j)(`tasks:${_.id}`)
            }, [
              f(o(H), {
                status: _.state
              }, null, 8, ["status"]),
              s("span", de, l(_.id), 1),
              s("span", ce, l(_.title), 1)
            ], 8, re))), 128))
          ], 64))), 128)),
          (h = d.facts) != null && h.instruction ? (c(), i(b, { key: 0 }, [
            t[4] || (t[4] = s("p", { class: "agent-label" }, "Instruction", -1)),
            s("div", ie, l(d.facts.instruction), 1)
          ], 64)) : N("", !0)
        ])) : N("", !0)
      ], 8, G);
    };
  }
}, ge = /* @__PURE__ */ F(ue, [["__scopeId", "data-v-33ef2d6d"]]), pe = {
  class: "agents",
  "data-window-flush": ""
}, fe = { class: "agents-bar" }, me = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, only: { type: Function, default: () => !0 } },
  setup(d) {
    const C = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], m = d, { rows: y, failure: a, loaded: $, more: S, older: x } = E(m.line, ["agent.*"], { incremental: !0 }), { rows: A } = E("usage agents --closed", ["agent.*", "task.*"]), v = L("running"), w = L(""), u = (e) => v.value === "all" || v.value === "running" == !e.ended_at, k = (e) => A.value.find((t) => t.id === e.id) ?? null, T = (e) => {
      var t, n;
      return `${e.id} ${e.session} ${e.program} ${e.role} ${((t = k(e)) == null ? void 0 : t.profile) ?? ""} ${((n = k(e)) == null ? void 0 : n.given_name) ?? ""}`.toLowerCase().includes(w.value.trim().toLowerCase());
    }, I = r(() => y.value.filter((e) => m.only(e) && u(e) && T(e))), g = r(() => y.value.some(m.only) ? "Nothing matches" : m.empty);
    return (e, t) => (c(), i("div", pe, [
      s("div", fe, [
        f(o(M), {
          modelValue: w.value,
          "onUpdate:modelValue": t[1] || (t[1] = (n) => w.value = n),
          class: "agents-search",
          placeholder: "Search the agents",
          "data-agents-search": ""
        }, {
          default: R(() => [
            f(o(U), {
              options: C,
              value: v.value,
              onPick: t[0] || (t[0] = (n) => v.value = n)
            }, null, 8, ["value"])
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      f(o(P), {
        rows: I.value,
        failure: o(a),
        loaded: o($),
        more: o(S),
        older: o(x),
        empty: g.value
      }, {
        default: R(({ row: n }) => [
          f(ge, {
            row: n,
            facts: k(n)
          }, null, 8, ["row", "facts"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty"])
    ]));
  }
}, he = /* @__PURE__ */ F(me, [["__scopeId", "data-v-00b72153"]]);
export {
  he as A
};
