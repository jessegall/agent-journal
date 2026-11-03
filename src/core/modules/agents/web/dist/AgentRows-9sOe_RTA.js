/* @code-commandments-generated */
import { computed as c, openBlock as i, createBlock as R, unref as a, withCtx as N, createVNode as _, ref as A, createElementBlock as f, createElementVNode as l, toDisplayString as m, normalizeClass as Q, createCommentVNode as I, withModifiers as X, createTextVNode as Y, Fragment as L, renderList as z } from "vue";
import { useRows as D, RowList as G, DiffCard as Z, ago as ee, useNow as te, useWindow as ae, age as H, Icon as ne, Btn as se, peekRef as M, InnerTabs as oe, FoldGroup as le, TaskStatusIcon as re, SearchBar as de, Segmented as ie } from "@journal/window-kit";
import { _ as J, T as ce } from "./TranscriptRows-Cotthc_y.js";
const ue = 5, ge = {
  __name: "AgentFileEdits",
  props: { agent: { type: Number, required: !0 } },
  setup(r) {
    const $ = r, { rows: w, failure: h, loaded: t, more: b, older: v } = D(`file-edit list --agent ${$.agent}`, ["file_edit.create"], { incremental: !0 }), S = c(() => w.value.map((d) => ({ ...d, lines: JSON.parse(d.rows || "[]") })));
    return (d, k) => (i(), R(a(G), {
      rows: S.value,
      failure: a(h),
      loaded: a(t),
      more: a(b),
      older: a(v),
      empty: "No edits by this agent yet"
    }, {
      default: N(({ row: u }) => [
        _(a(Z), {
          flush: "",
          lines: ue,
          path: u.path,
          kind: u.edit_type,
          added: u.added,
          removed: u.removed,
          ago: a(ee)(u.created_at),
          rows: u.lines
        }, null, 8, ["path", "kind", "added", "removed", "ago", "rows"])
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "more", "older"]));
  }
}, pe = ["data-agent-open", "aria-expanded", "title"], ve = { class: "agent-head" }, me = ["data-state"], fe = {
  class: "agent-title",
  "data-agent-title": ""
}, _e = {
  class: "agent-name",
  "data-agent-name": ""
}, we = { class: "agent-time" }, ke = { class: "agent-line" }, ye = {
  class: "agent-identity",
  "data-agent-identity": ""
}, he = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": ""
}, be = { class: "agent-usage-line" }, $e = {
  class: "agent-usage",
  "data-agent-card-usage": ""
}, Se = ["data-agent-tab-body"], Ce = ["data-agent-delegated", "onClick"], Te = { class: "agent-task-number" }, xe = { class: "agent-task-title" }, Ae = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ne = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null } },
  setup(r) {
    const $ = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, w = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), h = ["started", "testing", "blocked", "open", "completed", "cancelled"], t = r, b = te(), v = A(ae().tabs[0]), S = c(() => {
      var n;
      const e = ((n = t.facts) == null ? void 0 : n.profile) || $[t.row.role] || t.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), d = c(() => {
      var e;
      return ((e = t.facts) == null ? void 0 : e.tasks) ?? [];
    }), k = c(() => !t.row.ended_at && d.value.some((e) => e.state === "testing") && !d.value.some((e) => e.state === "started")), u = c(() => {
      var e;
      return [t.row.program, (e = t.facts) == null ? void 0 : e.model, w.has(t.row.role) ? t.row.role : "", k.value ? "waiting for its tests" : ""].filter(Boolean).join(" · ");
    }), E = c(() => t.row.ended_at ? `${H(t.row.ended_at, b.value)} ago` : H(t.row.process_started_at || t.row.created_at, b.value)), C = c(() => {
      var e;
      return t.row.ended_at ? "closed" : k.value ? "waiting" : ((e = t.facts) == null ? void 0 : e.state) || "running";
    }), F = c(() => {
      var n, T, x;
      const e = [`agent ${t.row.id}`];
      return ((n = t.facts) == null ? void 0 : n.context_percent) !== null && ((T = t.facts) == null ? void 0 : T.context_percent) !== void 0 && e.push(`Context ${t.facts.context_percent}%`), (x = t.facts) != null && x.cost_dollars && e.push(`$${t.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), O = c(() => d.value.filter((e) => e.state === "completed").length), B = c(() => `${O.value} of ${d.value.length} ${d.value.length === 1 ? "task" : "tasks"}`), s = c(() => h.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: d.value.filter((n) => n.state === e) })).filter((e) => e.tasks.length)), o = A(!1), g = /* @__PURE__ */ new Set(["completed"]), V = A({}), j = (e) => !(V.value[e] ?? g.has(e)), P = (e) => V.value = { ...V.value, [e]: j(e) };
    return (e, n) => {
      var T, x, q, W, K, U;
      return i(), f("div", {
        class: "agent-card",
        "data-agent-open": r.row.id,
        "aria-expanded": o.value,
        title: r.row.session,
        onClick: n[3] || (n[3] = (p) => o.value = !o.value)
      }, [
        l("span", ve, [
          l("span", {
            class: "agent-dot",
            "data-state": C.value
          }, null, 8, me),
          l("span", fe, m(S.value), 1),
          l("span", _e, m(((T = r.facts) == null ? void 0 : T.given_name) || r.row.id), 1),
          l("span", we, m(E.value), 1),
          _(a(ne), {
            class: Q(["agent-chevron", { opened: o.value }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        l("span", ke, [
          l("span", ye, m(u.value), 1),
          d.value.length ? (i(), f("span", he, m(B.value), 1)) : I("", !0)
        ]),
        o.value ? (i(), f("div", {
          key: 0,
          class: "agent-more",
          "data-agent-more": "",
          onClick: n[2] || (n[2] = X(() => {
          }, ["stop"]))
        }, [
          l("span", be, [
            l("span", $e, m(F.value), 1),
            _(a(se), {
              small: "",
              bordered: "",
              "data-agent-inspect": "",
              onClick: n[0] || (n[0] = (p) => a(M)(`agents:${r.row.id}`))
            }, {
              default: N(() => [...n[4] || (n[4] = [
                Y("Inspect", -1)
              ])]),
              _: 1
            })
          ]),
          _(a(oe), {
            active: v.value,
            answer: { tasks: d.value.length },
            onChoose: n[1] || (n[1] = (p) => v.value = p)
          }, null, 8, ["active", "answer"]),
          l("div", {
            class: "agent-tab-body",
            "data-agent-tab-body": (x = v.value) == null ? void 0 : x.key
          }, [
            ((q = v.value) == null ? void 0 : q.key) === "tasks" ? (i(), f(L, { key: 0 }, [
              (i(!0), f(L, null, z(s.value, (p) => (i(), R(a(le), {
                key: p.state,
                label: p.label,
                count: p.tasks.length,
                open: j(p.state),
                "data-agent-section": p.state,
                onToggle: (y) => P(p.state)
              }, {
                default: N(() => [
                  (i(!0), f(L, null, z(p.tasks, (y) => (i(), f("button", {
                    key: y.id,
                    type: "button",
                    class: "agent-task",
                    "data-agent-delegated": y.id,
                    onClick: (Fe) => a(M)(`tasks:${y.id}`)
                  }, [
                    _(a(re), {
                      status: y.state
                    }, null, 8, ["status"]),
                    l("span", Te, m(y.id), 1),
                    l("span", xe, m(y.title), 1)
                  ], 8, Ce))), 128))
                ]),
                _: 2
              }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
              (W = r.facts) != null && W.instruction ? (i(), f(L, { key: 0 }, [
                n[5] || (n[5] = l("p", { class: "agent-label" }, "Instruction", -1)),
                l("div", Ae, m(r.facts.instruction), 1)
              ], 64)) : I("", !0)
            ], 64)) : ((K = v.value) == null ? void 0 : K.key) === "transcript" ? (i(), R(ce, {
              key: 1,
              line: `agent transcript ${r.row.id}`
            }, null, 8, ["line"])) : ((U = v.value) == null ? void 0 : U.key) === "file-feed" ? (i(), R(ge, {
              key: 2,
              agent: r.row.id
            }, null, 8, ["agent"])) : I("", !0)
          ], 8, Se)
        ])) : I("", !0)
      ], 8, pe);
    };
  }
}, Ie = /* @__PURE__ */ J(Ne, [["__scopeId", "data-v-8751c5ae"]]), Le = {
  class: "agents",
  "data-window-flush": ""
}, Re = { class: "agents-bar" }, Ee = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, only: { type: Function, default: () => !0 } },
  setup(r) {
    const $ = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], w = r, { rows: h, failure: t, loaded: b, more: v, older: S } = D(w.line, ["agent.*"], { incremental: !0 }), { rows: d } = D("usage agents --closed", ["agent.*", "task.*"]), k = A("running"), u = A(""), E = (s) => k.value === "all" || k.value === "running" == !s.ended_at, C = (s) => d.value.find((o) => o.id === s.id) ?? null, F = (s) => {
      var o, g;
      return `${s.id} ${s.session} ${s.program} ${s.role} ${((o = C(s)) == null ? void 0 : o.profile) ?? ""} ${((g = C(s)) == null ? void 0 : g.given_name) ?? ""}`.toLowerCase().includes(u.value.trim().toLowerCase());
    }, O = c(() => h.value.filter((s) => w.only(s) && E(s) && F(s))), B = c(() => h.value.some(w.only) ? "Nothing matches" : w.empty);
    return (s, o) => (i(), f("div", Le, [
      l("div", Re, [
        _(a(de), {
          modelValue: u.value,
          "onUpdate:modelValue": o[1] || (o[1] = (g) => u.value = g),
          class: "agents-search",
          placeholder: "Search the agents",
          "data-agents-search": ""
        }, {
          default: N(() => [
            _(a(ie), {
              options: $,
              value: k.value,
              onPick: o[0] || (o[0] = (g) => k.value = g)
            }, null, 8, ["value"])
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      _(a(G), {
        rows: O.value,
        failure: a(t),
        loaded: a(b),
        more: a(v),
        older: a(S),
        empty: B.value
      }, {
        default: N(({ row: g }) => [
          _(Ie, {
            row: g,
            facts: C(g)
          }, null, 8, ["row", "facts"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty"])
    ]));
  }
}, De = /* @__PURE__ */ J(Ee, [["__scopeId", "data-v-00b72153"]]);
export {
  De as A
};
