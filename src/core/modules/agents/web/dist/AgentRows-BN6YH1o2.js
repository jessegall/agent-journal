/* @code-commandments-generated */
import { computed as o, ref as I, onUnmounted as H, openBlock as u, createElementBlock as g, createElementVNode as s, toDisplayString as i, createVNode as v, unref as l, normalizeClass as M, createCommentVNode as T, withModifiers as P, withCtx as U, createTextVNode as W, Fragment as R, renderList as q } from "vue";
import { useNow as G, age as K, useWindow as J, Icon as Q, RunningCommand as X, Btn as Y, peekRef as z, TaskStatusIcon as Z, useRows as F, SearchBar as ee, Segmented as te, RowList as ae } from "@journal/window-kit";
import { _ as D } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const ne = ["data-agent-open", "aria-expanded", "title"], se = { class: "agent-head" }, oe = ["data-state"], le = {
  class: "agent-title",
  "data-agent-title": ""
}, re = {
  class: "agent-name",
  "data-agent-name": ""
}, de = { class: "agent-time" }, ie = { class: "agent-line" }, ce = {
  class: "agent-identity",
  "data-agent-identity": ""
}, ue = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": ""
}, ge = {
  key: 0,
  class: "agent-command",
  "data-agent-command": ""
}, me = { class: "agent-usage-line" }, pe = {
  class: "agent-usage",
  "data-agent-card-usage": ""
}, ve = ["data-agent-section"], fe = { class: "agent-section-count" }, _e = ["data-agent-delegated", "onClick"], we = { class: "agent-task-number" }, ke = { class: "agent-task-title" }, he = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ye = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null } },
  setup(c) {
    const N = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, w = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), b = ["started", "testing", "blocked", "open", "completed", "cancelled"], t = c, S = G(), L = o(() => {
      var n;
      const e = ((n = t.facts) == null ? void 0 : n.profile) || N[t.row.role] || t.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), m = o(() => {
      var e;
      return ((e = t.facts) == null ? void 0 : e.tasks) ?? [];
    }), x = o(() => !t.row.ended_at && m.value.some((e) => e.state === "testing") && !m.value.some((e) => e.state === "started")), V = o(() => {
      var e;
      return [t.row.program, (e = t.facts) == null ? void 0 : e.model, t.row.role === "worker" ? `worker ${t.row.id}` : w.has(t.row.role) ? t.row.role : ""].filter(Boolean).join(" · ");
    }), p = o(() => t.row.ended_at ? `${K(t.row.ended_at, S.value)} ago` : K(t.row.process_started_at || t.row.created_at, S.value)), h = o(() => {
      var e;
      return t.row.ended_at ? "closed" : x.value ? "waiting" : ((e = t.facts) == null ? void 0 : e.state) || "running";
    }), B = o(() => {
      var n, $, C;
      const e = [`agent ${t.row.id}`];
      return ((n = t.facts) == null ? void 0 : n.context_percent) !== null && (($ = t.facts) == null ? void 0 : $.context_percent) !== void 0 && e.push(`Context ${t.facts.context_percent}%`), (C = t.facts) != null && C.cost_dollars && e.push(`$${t.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), y = o(() => m.value.filter((e) => e.state === "completed").length), O = o(() => `${y.value} of ${m.value.length} ${m.value.length === 1 ? "task" : "tasks"}`), j = o(() => b.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: m.value.filter((n) => n.state === e) })).filter((e) => e.tasks.length)), f = I(!1), A = J(), a = I(""), r = o(() => t.row.role === "worker" && !t.row.ended_at);
    async function d() {
      if (!r.value) return;
      const e = await A.read(`usage tool --agent ${t.row.id}`);
      a.value = e.ok ? e.value.tool : "";
    }
    const E = A.follow(["hook_call.*"], d);
    return H(() => E == null ? void 0 : E()), d(), (e, n) => {
      var $, C;
      return u(), g("div", {
        class: "agent-card",
        "data-agent-open": c.row.id,
        "aria-expanded": f.value,
        title: c.row.session,
        onClick: n[2] || (n[2] = (_) => f.value = !f.value)
      }, [
        s("span", se, [
          s("span", {
            class: "agent-dot",
            "data-state": h.value
          }, null, 8, oe),
          s("span", le, i(L.value), 1),
          s("span", re, i((($ = c.facts) == null ? void 0 : $.given_name) || c.row.id), 1),
          s("span", de, i(p.value), 1),
          v(l(Q), {
            class: M(["agent-chevron", { opened: f.value }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        s("span", ie, [
          s("span", ce, i(V.value), 1),
          m.value.length ? (u(), g("span", ue, i(O.value), 1)) : T("", !0)
        ]),
        r.value ? (u(), g("span", ge, [
          v(l(X), {
            text: x.value ? "waiting for its tests" : a.value,
            idle: "thinking"
          }, null, 8, ["text"])
        ])) : T("", !0),
        f.value ? (u(), g("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: n[1] || (n[1] = P(() => {
          }, ["stop"]))
        }, [
          s("span", me, [
            s("span", pe, i(B.value), 1),
            v(l(Y), {
              small: "",
              bordered: "",
              "data-agent-inspect": "",
              onClick: n[0] || (n[0] = (_) => l(z)(`agents:${c.row.id}`))
            }, {
              default: U(() => [...n[3] || (n[3] = [
                W("Inspect", -1)
              ])]),
              _: 1
            })
          ]),
          (u(!0), g(R, null, q(j.value, (_) => (u(), g(R, {
            key: _.state
          }, [
            s("p", {
              class: "agent-label",
              "data-agent-section": _.state
            }, [
              W(i(_.label) + " ", 1),
              s("span", fe, i(_.tasks.length), 1)
            ], 8, ve),
            (u(!0), g(R, null, q(_.tasks, (k) => (u(), g("button", {
              key: k.id,
              type: "button",
              class: "agent-task",
              "data-agent-delegated": k.id,
              onClick: (xe) => l(z)(`tasks:${k.id}`)
            }, [
              v(l(Z), {
                status: k.state
              }, null, 8, ["status"]),
              s("span", we, i(k.id), 1),
              s("span", ke, i(k.title), 1)
            ], 8, _e))), 128))
          ], 64))), 128)),
          (C = c.facts) != null && C.instruction ? (u(), g(R, { key: 0 }, [
            n[4] || (n[4] = s("p", { class: "agent-label" }, "Instruction", -1)),
            s("div", he, i(c.facts.instruction), 1)
          ], 64)) : T("", !0)
        ])) : T("", !0)
      ], 8, ne);
    };
  }
}, $e = /* @__PURE__ */ D(ye, [["__scopeId", "data-v-a04d392c"]]), Ce = {
  class: "agents",
  "data-window-flush": ""
}, be = { class: "agents-bar" }, Se = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, only: { type: Function, default: () => !0 } },
  setup(c) {
    const N = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], w = c, { rows: b, failure: t, loaded: S, more: L, older: m } = F(w.line, ["agent.*"], { incremental: !0 }), { rows: x } = F("agent running", ["agent.*"]), { rows: V } = F("usage agents --closed", ["agent.*", "task.*"]), p = I("running"), h = I(""), B = (a) => p.value === "all" || p.value === "running" == !a.ended_at, y = (a) => V.value.find((r) => r.id === a.id) ?? null, O = (a) => {
      var r, d;
      return `${a.id} ${a.session} ${a.program} ${a.role} ${((r = y(a)) == null ? void 0 : r.profile) ?? ""} ${((d = y(a)) == null ? void 0 : d.given_name) ?? ""}`.toLowerCase().includes(h.value.trim().toLowerCase());
    }, j = o(() => p.value === "running" ? x.value : b.value), f = o(() => j.value.filter((a) => w.only(a) && B(a) && O(a))), A = o(() => b.value.some(w.only) ? "Nothing matches" : w.empty);
    return (a, r) => (u(), g("div", Ce, [
      s("div", be, [
        v(l(ee), {
          modelValue: h.value,
          "onUpdate:modelValue": r[1] || (r[1] = (d) => h.value = d),
          class: "agents-search",
          placeholder: "Search the agents",
          "data-agents-search": ""
        }, {
          default: U(() => [
            v(l(te), {
              options: N,
              value: p.value,
              onPick: r[0] || (r[0] = (d) => p.value = d)
            }, null, 8, ["value"])
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      v(l(ae), {
        rows: f.value,
        failure: l(t),
        loaded: l(S),
        more: l(L) && p.value !== "running",
        older: l(m),
        empty: A.value
      }, {
        default: U(({ row: d }) => [
          v($e, {
            row: d,
            facts: y(d)
          }, null, 8, ["row", "facts"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty"])
    ]));
  }
}, Ie = /* @__PURE__ */ D(Se, [["__scopeId", "data-v-14c6d427"]]);
export {
  Ie as A
};
