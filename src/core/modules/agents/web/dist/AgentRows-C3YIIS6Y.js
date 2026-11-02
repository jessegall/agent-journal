/* @code-commandments-generated */
import { computed as o, ref as R, openBlock as c, createElementBlock as u, createElementVNode as n, toDisplayString as r, createVNode as p, unref as l, normalizeClass as K, createCommentVNode as L, withModifiers as U, withCtx as V, createTextVNode as B, Fragment as C, renderList as F } from "vue";
import { useNow as W, age as O, Icon as z, Btn as D, peekRef as j, TaskStatusIcon as H, useRows as E, SearchBar as M, Segmented as P, RowList as G } from "@journal/window-kit";
import { _ as q } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const J = ["data-agent-open", "aria-expanded", "title"], Q = { class: "agent-head" }, X = ["data-state"], Y = {
  class: "agent-title",
  "data-agent-title": ""
}, Z = {
  class: "agent-name",
  "data-agent-name": ""
}, ee = { class: "agent-time" }, te = { class: "agent-line" }, ae = {
  class: "agent-identity",
  "data-agent-identity": ""
}, se = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": ""
}, ne = { class: "agent-usage-line" }, oe = {
  class: "agent-usage",
  "data-agent-card-usage": ""
}, le = ["data-agent-section"], re = { class: "agent-section-count" }, de = ["data-agent-delegated", "onClick"], ie = { class: "agent-task-number" }, ce = { class: "agent-task-title" }, ue = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ge = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null } },
  setup(d) {
    const S = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, m = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), y = ["started", "testing", "blocked", "open", "completed", "cancelled"], a = d, $ = W(), x = o(() => {
      var t;
      const e = ((t = a.facts) == null ? void 0 : t.profile) || S[a.row.role] || a.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), i = o(() => {
      var e;
      return ((e = a.facts) == null ? void 0 : e.tasks) ?? [];
    }), b = o(() => !a.row.ended_at && i.value.some((e) => e.state === "testing") && !i.value.some((e) => e.state === "started")), v = o(() => {
      var e;
      return [a.row.program, (e = a.facts) == null ? void 0 : e.model, m.has(a.row.role) ? a.row.role : "", b.value ? "waiting for its tests" : ""].filter(Boolean).join(" · ");
    }), _ = o(() => a.row.ended_at ? `${O(a.row.ended_at, $.value)} ago` : O(a.row.process_started_at || a.row.created_at, $.value)), A = o(() => {
      var e;
      return a.row.ended_at ? "closed" : b.value ? "waiting" : ((e = a.facts) == null ? void 0 : e.state) || "running";
    }), w = o(() => {
      var t, k, h;
      const e = [`agent ${a.row.id}`];
      return ((t = a.facts) == null ? void 0 : t.context_percent) !== null && ((k = a.facts) == null ? void 0 : k.context_percent) !== void 0 && e.push(`Context ${a.facts.context_percent}%`), (h = a.facts) != null && h.cost_dollars && e.push(`$${a.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), T = o(() => i.value.filter((e) => e.state === "completed").length), I = o(() => `${T.value} of ${i.value.length} ${i.value.length === 1 ? "task" : "tasks"}`), N = o(() => y.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: i.value.filter((t) => t.state === e) })).filter((e) => e.tasks.length)), s = R(!1);
    return (e, t) => {
      var k, h;
      return c(), u("div", {
        class: "agent-card",
        "data-agent-open": d.row.id,
        "aria-expanded": s.value,
        title: d.row.session,
        onClick: t[2] || (t[2] = (g) => s.value = !s.value)
      }, [
        n("span", Q, [
          n("span", {
            class: "agent-dot",
            "data-state": A.value
          }, null, 8, X),
          n("span", Y, r(x.value), 1),
          n("span", Z, r(((k = d.facts) == null ? void 0 : k.given_name) || d.row.id), 1),
          n("span", ee, r(_.value), 1),
          p(l(z), {
            class: K(["agent-chevron", { opened: s.value }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        n("span", te, [
          n("span", ae, r(v.value), 1),
          i.value.length ? (c(), u("span", se, r(I.value), 1)) : L("", !0)
        ]),
        s.value ? (c(), u("div", {
          key: 0,
          class: "agent-more",
          "data-agent-more": "",
          onClick: t[1] || (t[1] = U(() => {
          }, ["stop"]))
        }, [
          n("span", ne, [
            n("span", oe, r(w.value), 1),
            p(l(D), {
              small: "",
              bordered: "",
              "data-agent-inspect": "",
              onClick: t[0] || (t[0] = (g) => l(j)(`agents:${d.row.id}`))
            }, {
              default: V(() => [...t[3] || (t[3] = [
                B("Inspect", -1)
              ])]),
              _: 1
            })
          ]),
          (c(!0), u(C, null, F(N.value, (g) => (c(), u(C, {
            key: g.state
          }, [
            n("p", {
              class: "agent-label",
              "data-agent-section": g.state
            }, [
              B(r(g.label) + " ", 1),
              n("span", re, r(g.tasks.length), 1)
            ], 8, le),
            (c(!0), u(C, null, F(g.tasks, (f) => (c(), u("button", {
              key: f.id,
              type: "button",
              class: "agent-task",
              "data-agent-delegated": f.id,
              onClick: (_e) => l(j)(`tasks:${f.id}`)
            }, [
              p(l(H), {
                status: f.state
              }, null, 8, ["status"]),
              n("span", ie, r(f.id), 1),
              n("span", ce, r(f.title), 1)
            ], 8, de))), 128))
          ], 64))), 128)),
          (h = d.facts) != null && h.instruction ? (c(), u(C, { key: 0 }, [
            t[4] || (t[4] = n("p", { class: "agent-label" }, "Instruction", -1)),
            n("div", ue, r(d.facts.instruction), 1)
          ], 64)) : L("", !0)
        ])) : L("", !0)
      ], 8, J);
    };
  }
}, pe = /* @__PURE__ */ q(ge, [["__scopeId", "data-v-d4fd4636"]]), me = {
  class: "agents",
  "data-window-flush": ""
}, ve = { class: "agents-bar" }, fe = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, only: { type: Function, default: () => !0 } },
  setup(d) {
    const S = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], m = d, { rows: y, failure: a, loaded: $, more: x, older: i } = E(m.line, ["agent.*"], { incremental: !0 }), { rows: b } = E("usage agents --closed", ["agent.*", "task.*"]), v = R("running"), _ = R(""), A = (s) => v.value === "all" || v.value === "running" == !s.ended_at, w = (s) => b.value.find((e) => e.id === s.id) ?? null, T = (s) => {
      var e, t;
      return `${s.id} ${s.session} ${s.program} ${s.role} ${((e = w(s)) == null ? void 0 : e.profile) ?? ""} ${((t = w(s)) == null ? void 0 : t.given_name) ?? ""}`.toLowerCase().includes(_.value.trim().toLowerCase());
    }, I = o(() => y.value.filter((s) => m.only(s) && A(s) && T(s))), N = o(() => y.value.some(m.only) ? "Nothing matches" : m.empty);
    return (s, e) => (c(), u("div", me, [
      n("div", ve, [
        p(l(M), {
          modelValue: _.value,
          "onUpdate:modelValue": e[1] || (e[1] = (t) => _.value = t),
          class: "agents-search",
          placeholder: "Search the agents",
          "data-agents-search": ""
        }, {
          default: V(() => [
            p(l(P), {
              options: S,
              value: v.value,
              onPick: e[0] || (e[0] = (t) => v.value = t)
            }, null, 8, ["value"])
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      p(l(G), {
        rows: I.value,
        failure: l(a),
        loaded: l($),
        more: l(x),
        older: l(i),
        empty: N.value
      }, {
        default: V(({ row: t }) => [
          p(pe, {
            row: t,
            facts: w(t)
          }, null, 8, ["row", "facts"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty"])
    ]));
  }
}, ye = /* @__PURE__ */ q(fe, [["__scopeId", "data-v-00b72153"]]);
export {
  ye as A
};
