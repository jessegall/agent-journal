/* @code-commandments-generated */
import { computed as d, ref as N, openBlock as c, createElementBlock as p, createElementVNode as l, toDisplayString as i, createVNode as g, unref as s, normalizeClass as H, withModifiers as j, createTextVNode as T, createCommentVNode as I, withCtx as C, Fragment as A, createBlock as q, renderList as E } from "vue";
import { useNow as P, age as F, Icon as W, Btn as U, peekRef as z, MenuPanel as G, MenuLabel as J, MenuItem as Q, TaskStatusIcon as X, useRows as K, TextInput as Y, Segmented as Z, RowList as ee } from "@journal/window-kit";
import { _ as D } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const te = ["data-agent-open", "aria-expanded", "title"], ae = { class: "agent-head" }, ne = ["data-state"], se = {
  class: "agent-title",
  "data-agent-title": ""
}, le = {
  class: "agent-name",
  "data-agent-name": ""
}, oe = { class: "agent-time" }, re = { class: "agent-line" }, de = {
  class: "agent-identity",
  "data-agent-identity": ""
}, ue = ["aria-expanded"], ie = { class: "agent-usage-line" }, ce = {
  class: "agent-usage",
  "data-agent-card-usage": ""
}, ge = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, pe = { class: "agent-task-number" }, me = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null } },
  setup(u) {
    const L = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, f = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), x = [
      { label: "Working on", states: ["started", "testing"] },
      { label: "Still queued", states: ["open", "blocked"] },
      { label: "Completed", states: ["completed", "cancelled"] }
    ], a = u, S = P(), B = d(() => {
      var e;
      return ((e = a.facts) == null ? void 0 : e.profile) || L[a.row.role] || a.row.role;
    }), R = d(() => {
      var e;
      return [a.row.program, (e = a.facts) == null ? void 0 : e.model, f.has(a.row.role) ? a.row.role : ""].filter(Boolean).join(" · ");
    }), V = d(() => a.row.ended_at ? `${F(a.row.ended_at, S.value)} ago` : F(a.row.process_started_at || a.row.created_at, S.value)), k = d(() => {
      var e;
      return a.row.ended_at ? "closed" : ((e = a.facts) == null ? void 0 : e.state) || "running";
    }), h = d(() => {
      var n, b, $;
      const e = [`agent ${a.row.id}`];
      return ((n = a.facts) == null ? void 0 : n.context_percent) !== null && ((b = a.facts) == null ? void 0 : b.context_percent) !== void 0 && e.push(`Context ${a.facts.context_percent}%`), ($ = a.facts) != null && $.cost_dollars && e.push(`$${a.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), m = d(() => {
      var e;
      return ((e = a.facts) == null ? void 0 : e.tasks) ?? [];
    }), y = d(() => m.value.filter((e) => e.state === "completed").length), O = d(() => `${y.value} of ${m.value.length} ${m.value.length === 1 ? "task" : "tasks"}`), M = d(() => x.map((e) => ({ ...e, tasks: m.value.filter((n) => e.states.includes(n.state)) })).filter((e) => e.tasks.length)), v = N(!1), t = N(null), o = (e) => t.value = t.value ? null : e.currentTarget;
    function r(e) {
      t.value = null, z(`tasks:${e}`);
    }
    return (e, n) => {
      var b, $;
      return c(), p("div", {
        class: "agent-card",
        "data-agent-open": u.row.id,
        "aria-expanded": v.value,
        title: u.row.session,
        onClick: n[4] || (n[4] = (_) => v.value = !v.value)
      }, [
        l("span", ae, [
          l("span", {
            class: "agent-dot",
            "data-state": k.value
          }, null, 8, ne),
          l("span", se, i(B.value), 1),
          l("span", le, i(((b = u.facts) == null ? void 0 : b.given_name) || u.row.id), 1),
          l("span", oe, i(V.value), 1),
          g(s(W), {
            class: H(["agent-chevron", { opened: v.value }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        l("span", re, [
          l("span", de, i(R.value), 1),
          m.value.length ? (c(), p("button", {
            key: 0,
            type: "button",
            class: "agent-tasks",
            "data-agent-tasks": "",
            "aria-expanded": !!t.value,
            onClick: j(o, ["stop"])
          }, [
            T(i(O.value) + " ", 1),
            g(s(W), {
              name: "caret",
              size: 12
            })
          ], 8, ue)) : I("", !0)
        ]),
        v.value ? (c(), p("div", {
          key: 0,
          class: "agent-more",
          "data-agent-more": "",
          onClick: n[1] || (n[1] = j(() => {
          }, ["stop"]))
        }, [
          l("span", ie, [
            l("span", ce, i(h.value), 1),
            g(s(U), {
              small: "",
              bordered: "",
              "data-agent-inspect": "",
              onClick: n[0] || (n[0] = (_) => s(z)(`agents:${u.row.id}`))
            }, {
              default: C(() => [...n[5] || (n[5] = [
                T("Inspect", -1)
              ])]),
              _: 1
            })
          ]),
          ($ = u.facts) != null && $.instruction ? (c(), p(A, { key: 0 }, [
            n[6] || (n[6] = l("p", { class: "agent-label" }, "Instruction", -1)),
            l("div", ge, i(u.facts.instruction), 1)
          ], 64)) : I("", !0)
        ])) : I("", !0),
        t.value ? (c(), q(s(G), {
          key: 1,
          anchor: t.value,
          align: "end",
          "min-width": 320,
          "max-width": 440,
          "data-agent-task-menu": "",
          onClick: n[2] || (n[2] = j(() => {
          }, ["stop"])),
          onClose: n[3] || (n[3] = (_) => t.value = null)
        }, {
          default: C(() => [
            (c(!0), p(A, null, E(M.value, (_) => (c(), p(A, {
              key: _.label
            }, [
              g(s(J), null, {
                default: C(() => [
                  T(i(_.label), 1)
                ]),
                _: 2
              }, 1024),
              (c(!0), p(A, null, E(_.tasks, (w) => (c(), q(s(Q), {
                key: w.id,
                "data-agent-delegated": w.id,
                onClick: (we) => r(w.id)
              }, {
                default: C(() => [
                  g(s(X), {
                    state: w.state
                  }, null, 8, ["state"]),
                  l("span", pe, i(w.id), 1),
                  T(" " + i(w.title), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-delegated", "onClick"]))), 128))
            ], 64))), 128))
          ]),
          _: 1
        }, 8, ["anchor"])) : I("", !0)
      ], 8, te);
    };
  }
}, ve = /* @__PURE__ */ D(me, [["__scopeId", "data-v-c0cbd5ff"]]), fe = {
  class: "agents",
  "data-window-flush": ""
}, ke = { class: "agents-bar" }, _e = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, only: { type: Function, default: () => !0 } },
  setup(u) {
    const L = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], f = u, { rows: x, failure: a, loaded: S, more: B, older: R } = K(f.line, ["agent.*"], { incremental: !0 }), { rows: V } = K("usage agents --closed", ["agent.*", "task.*"]), k = N("running"), h = N(""), m = (t) => k.value === "all" || k.value === "running" == !t.ended_at, y = (t) => V.value.find((o) => o.id === t.id) ?? null, O = (t) => {
      var o, r;
      return `${t.id} ${t.session} ${t.program} ${t.role} ${((o = y(t)) == null ? void 0 : o.profile) ?? ""} ${((r = y(t)) == null ? void 0 : r.given_name) ?? ""}`.toLowerCase().includes(h.value.trim().toLowerCase());
    }, M = d(() => x.value.filter((t) => f.only(t) && m(t) && O(t))), v = d(() => x.value.some(f.only) ? "Nothing matches" : f.empty);
    return (t, o) => (c(), p("div", fe, [
      l("div", ke, [
        g(s(Y), {
          modelValue: h.value,
          "onUpdate:modelValue": o[0] || (o[0] = (r) => h.value = r),
          icon: "search",
          class: "agents-search",
          placeholder: "Search the agents",
          "data-agents-search": ""
        }, null, 8, ["modelValue"]),
        g(s(Z), {
          options: L,
          value: k.value,
          onPick: o[1] || (o[1] = (r) => k.value = r)
        }, null, 8, ["value"])
      ]),
      g(s(ee), {
        rows: M.value,
        failure: s(a),
        loaded: s(S),
        more: s(B),
        older: s(R),
        empty: v.value
      }, {
        default: C(({ row: r }) => [
          g(ve, {
            row: r,
            facts: y(r)
          }, null, 8, ["row", "facts"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty"])
    ]));
  }
}, $e = /* @__PURE__ */ D(_e, [["__scopeId", "data-v-8ab6f856"]]);
export {
  $e as A
};
