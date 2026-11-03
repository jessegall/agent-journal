/* @code-commandments-generated */
import { computed as r, openBlock as i, createBlock as B, unref as a, withCtx as L, createVNode as p, ref as C, onUnmounted as te, createElementBlock as m, createElementVNode as l, toDisplayString as f, normalizeClass as ae, createCommentVNode as I, withModifiers as ne, createTextVNode as se, Fragment as O, renderList as Q } from "vue";
import { useRows as F, RowList as Z, DiffCard as oe, ago as le, useNow as re, age as X, useWindow as de, Icon as ie, RunningCommand as ue, Btn as ce, peekRef as Y, InnerTabs as ge, FoldGroup as ve, TaskStatusIcon as me, SearchBar as pe, Segmented as fe } from "@journal/window-kit";
import { _ as ee, T as _e } from "./TranscriptRows-Cotthc_y.js";
const we = 5, ke = {
  __name: "AgentFileEdits",
  props: { agent: { type: Number, required: !0 } },
  setup(d) {
    const S = d, { rows: _, failure: h, loaded: t, more: b, older: x } = F(`file-edit list --agent ${S.agent}`, ["file_edit.create"], { incremental: !0 }), u = r(() => _.value.map((w) => ({ ...w, lines: JSON.parse(w.rows || "[]") })));
    return (w, E) => (i(), B(a(Z), {
      rows: u.value,
      failure: a(h),
      loaded: a(t),
      more: a(b),
      older: a(x),
      empty: "No edits by this agent yet"
    }, {
      default: L(({ row: o }) => [
        p(a(oe), {
          flush: "",
          lines: we,
          path: o.path,
          kind: o.edit_type,
          added: o.added,
          removed: o.removed,
          ago: a(le)(o.created_at),
          rows: o.lines
        }, null, 8, ["path", "kind", "added", "removed", "ago", "rows"])
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "more", "older"]));
  }
}, ye = ["data-agent-open", "aria-expanded", "title"], he = { class: "agent-head" }, be = ["data-state"], $e = {
  class: "agent-title",
  "data-agent-title": ""
}, Ce = {
  class: "agent-name",
  "data-agent-name": ""
}, Se = { class: "agent-time" }, xe = { class: "agent-line" }, Te = {
  class: "agent-identity",
  "data-agent-identity": ""
}, Ae = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": ""
}, Ne = {
  key: 0,
  class: "agent-command",
  "data-agent-command": ""
}, Re = { class: "agent-usage-line" }, Ie = {
  class: "agent-usage",
  "data-agent-card-usage": ""
}, Le = ["data-agent-tab-body"], Ee = ["data-agent-delegated", "onClick"], Oe = { class: "agent-task-number" }, Be = { class: "agent-task-title" }, Fe = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ve = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null } },
  setup(d) {
    const S = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, _ = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), h = ["started", "testing", "blocked", "open", "completed", "cancelled"], t = d, b = re(), x = r(() => {
      var n;
      const e = ((n = t.facts) == null ? void 0 : n.profile) || S[t.row.role] || t.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), u = r(() => {
      var e;
      return ((e = t.facts) == null ? void 0 : e.tasks) ?? [];
    }), w = r(() => !t.row.ended_at && u.value.some((e) => e.state === "testing") && !u.value.some((e) => e.state === "started")), E = r(() => {
      var e;
      return [t.row.program, (e = t.facts) == null ? void 0 : e.model, _.has(t.row.role) ? t.row.role : "", w.value ? "waiting for its tests" : ""].filter(Boolean).join(" · ");
    }), o = r(() => t.row.ended_at ? `${X(t.row.ended_at, b.value)} ago` : X(t.row.process_started_at || t.row.created_at, b.value)), T = r(() => {
      var e;
      return t.row.ended_at ? "closed" : w.value ? "waiting" : ((e = t.facts) == null ? void 0 : e.state) || "running";
    }), V = r(() => {
      var n, N, R;
      const e = [`agent ${t.row.id}`];
      return ((n = t.facts) == null ? void 0 : n.context_percent) !== null && ((N = t.facts) == null ? void 0 : N.context_percent) !== void 0 && e.push(`Context ${t.facts.context_percent}%`), (R = t.facts) != null && R.cost_dollars && e.push(`$${t.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), A = r(() => u.value.filter((e) => e.state === "completed").length), D = r(() => `${A.value} of ${u.value.length} ${u.value.length === 1 ? "task" : "tasks"}`), j = r(() => h.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: u.value.filter((n) => n.state === e) })).filter((e) => e.tasks.length)), k = C(!1), q = /* @__PURE__ */ new Set(["completed"]), s = C({}), c = (e) => !(s.value[e] ?? q.has(e)), g = (e) => s.value = { ...s.value, [e]: c(e) }, U = de(), $ = C(U.tabs[0]), K = C(""), z = r(() => t.row.role === "worker" && !t.row.ended_at);
    async function H() {
      if (!z.value) return;
      const e = await U.read(`usage tool --agent ${t.row.id}`);
      K.value = e.ok ? e.value.tool : "";
    }
    const W = U.follow(["hook_call.*"], H);
    return te(() => W == null ? void 0 : W()), H(), (e, n) => {
      var N, R, M, G, J, P;
      return i(), m("div", {
        class: "agent-card",
        "data-agent-open": d.row.id,
        "aria-expanded": k.value,
        title: d.row.session,
        onClick: n[3] || (n[3] = (v) => k.value = !k.value)
      }, [
        l("span", he, [
          l("span", {
            class: "agent-dot",
            "data-state": T.value
          }, null, 8, be),
          l("span", $e, f(x.value), 1),
          l("span", Ce, f(((N = d.facts) == null ? void 0 : N.given_name) || d.row.id), 1),
          l("span", Se, f(o.value), 1),
          p(a(ie), {
            class: ae(["agent-chevron", { opened: k.value }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        l("span", xe, [
          l("span", Te, f(E.value), 1),
          u.value.length ? (i(), m("span", Ae, f(D.value), 1)) : I("", !0)
        ]),
        z.value ? (i(), m("span", Ne, [
          p(a(ue), { text: K.value }, null, 8, ["text"])
        ])) : I("", !0),
        k.value ? (i(), m("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: n[2] || (n[2] = ne(() => {
          }, ["stop"]))
        }, [
          l("span", Re, [
            l("span", Ie, f(V.value), 1),
            p(a(ce), {
              small: "",
              bordered: "",
              "data-agent-inspect": "",
              onClick: n[0] || (n[0] = (v) => a(Y)(`agents:${d.row.id}`))
            }, {
              default: L(() => [...n[4] || (n[4] = [
                se("Inspect", -1)
              ])]),
              _: 1
            })
          ]),
          p(a(ge), {
            active: $.value,
            answer: { tasks: u.value.length },
            onChoose: n[1] || (n[1] = (v) => $.value = v)
          }, null, 8, ["active", "answer"]),
          l("div", {
            class: "agent-tab-body",
            "data-agent-tab-body": (R = $.value) == null ? void 0 : R.key
          }, [
            ((M = $.value) == null ? void 0 : M.key) === "tasks" ? (i(), m(O, { key: 0 }, [
              (i(!0), m(O, null, Q(j.value, (v) => (i(), B(a(ve), {
                key: v.state,
                label: v.label,
                count: v.tasks.length,
                open: c(v.state),
                "data-agent-section": v.state,
                onToggle: (y) => g(v.state)
              }, {
                default: L(() => [
                  (i(!0), m(O, null, Q(v.tasks, (y) => (i(), m("button", {
                    key: y.id,
                    type: "button",
                    class: "agent-task",
                    "data-agent-delegated": y.id,
                    onClick: (We) => a(Y)(`tasks:${y.id}`)
                  }, [
                    p(a(me), {
                      status: y.state
                    }, null, 8, ["status"]),
                    l("span", Oe, f(y.id), 1),
                    l("span", Be, f(y.title), 1)
                  ], 8, Ee))), 128))
                ]),
                _: 2
              }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
              (G = d.facts) != null && G.instruction ? (i(), m(O, { key: 0 }, [
                n[5] || (n[5] = l("p", { class: "agent-label" }, "Instruction", -1)),
                l("div", Fe, f(d.facts.instruction), 1)
              ], 64)) : I("", !0)
            ], 64)) : ((J = $.value) == null ? void 0 : J.key) === "transcript" ? (i(), B(_e, {
              key: 1,
              line: `agent transcript ${d.row.id}`
            }, null, 8, ["line"])) : ((P = $.value) == null ? void 0 : P.key) === "file-feed" ? (i(), B(ke, {
              key: 2,
              agent: d.row.id
            }, null, 8, ["agent"])) : I("", !0)
          ], 8, Le)
        ])) : I("", !0)
      ], 8, ye);
    };
  }
}, De = /* @__PURE__ */ ee(Ve, [["__scopeId", "data-v-c9f18d7b"]]), je = {
  class: "agents",
  "data-window-flush": ""
}, qe = { class: "agents-bar" }, Ue = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, only: { type: Function, default: () => !0 } },
  setup(d) {
    const S = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], _ = d, { rows: h, failure: t, loaded: b, more: x, older: u } = F(_.line, ["agent.*"], { incremental: !0 }), { rows: w } = F("agent running", ["agent.*"]), { rows: E } = F("usage agents --closed", ["agent.*", "task.*"]), o = C("running"), T = C(""), V = (s) => o.value === "all" || o.value === "running" == !s.ended_at, A = (s) => E.value.find((c) => c.id === s.id) ?? null, D = (s) => {
      var c, g;
      return `${s.id} ${s.session} ${s.program} ${s.role} ${((c = A(s)) == null ? void 0 : c.profile) ?? ""} ${((g = A(s)) == null ? void 0 : g.given_name) ?? ""}`.toLowerCase().includes(T.value.trim().toLowerCase());
    }, j = r(() => o.value === "running" ? w.value : h.value), k = r(() => j.value.filter((s) => _.only(s) && V(s) && D(s))), q = r(() => h.value.some(_.only) ? "Nothing matches" : _.empty);
    return (s, c) => (i(), m("div", je, [
      l("div", qe, [
        p(a(pe), {
          modelValue: T.value,
          "onUpdate:modelValue": c[1] || (c[1] = (g) => T.value = g),
          class: "agents-search",
          placeholder: "Search the agents",
          "data-agents-search": ""
        }, {
          default: L(() => [
            p(a(fe), {
              options: S,
              value: o.value,
              onPick: c[0] || (c[0] = (g) => o.value = g)
            }, null, 8, ["value"])
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      p(a(Z), {
        rows: k.value,
        failure: a(t),
        loaded: a(b),
        more: a(x) && o.value !== "running",
        older: a(u),
        empty: q.value
      }, {
        default: L(({ row: g }) => [
          p(De, {
            row: g,
            facts: A(g)
          }, null, 8, ["row", "facts"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty"])
    ]));
  }
}, Me = /* @__PURE__ */ ee(Ue, [["__scopeId", "data-v-14c6d427"]]);
export {
  Me as A
};
