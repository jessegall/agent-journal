/* @code-commandments-generated */
import { computed as d, openBlock as r, createBlock as B, unref as n, withCtx as O, createVNode as m, ref as S, onUnmounted as ne, createElementBlock as v, createElementVNode as o, toDisplayString as w, normalizeClass as se, createTextVNode as K, Fragment as L, withModifiers as Y, createCommentVNode as C, renderList as Z } from "vue";
import { useRows as F, RowList as te, DiffCard as oe, ago as le, useNow as re, age as ee, useWindow as de, Icon as ie, peekRef as z, RunningCommand as ue, Btn as ce, InnerTabs as ge, FoldGroup as pe, TaskStatusIcon as ve, SearchBar as me, Segmented as fe } from "@journal/window-kit";
import { _ as ae, T as we } from "./TranscriptRows-Cotthc_y.js";
const _e = 5, ke = {
  __name: "AgentFileEdits",
  props: { agent: { type: Number, required: !0 } },
  setup(i) {
    const x = i, { rows: _, failure: h, loaded: t, more: b, older: T } = F(`file-edit list --agent ${x.agent}`, ["file_edit.create"], { incremental: !0 }), u = d(() => _.value.map((f) => ({ ...f, lines: JSON.parse(f.rows || "[]") })));
    return (f, E) => (r(), B(n(te), {
      rows: u.value,
      failure: n(h),
      loaded: n(t),
      more: n(b),
      older: n(T),
      empty: "No edits by this agent yet"
    }, {
      default: O(({ row: l }) => [
        m(n(oe), {
          flush: "",
          lines: _e,
          path: l.path,
          kind: l.edit_type,
          added: l.added,
          removed: l.removed,
          ago: n(le)(l.created_at),
          rows: l.lines
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
}, Le = ["data-agent-tab-body"], Oe = ["data-agent-delegated", "onClick"], Ee = { class: "agent-task-number" }, Be = { class: "agent-task-title" }, Fe = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ve = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null } },
  setup(i) {
    const x = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, _ = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), h = ["started", "testing", "blocked", "open", "completed", "cancelled"], t = i, b = re(), T = d(() => {
      var a;
      const e = ((a = t.facts) == null ? void 0 : a.profile) || x[t.row.role] || t.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), u = d(() => {
      var e;
      return ((e = t.facts) == null ? void 0 : e.tasks) ?? [];
    }), f = d(() => !t.row.ended_at && u.value.some((e) => e.state === "testing") && !u.value.some((e) => e.state === "started")), E = d(() => {
      var e;
      return [t.row.program, (e = t.facts) == null ? void 0 : e.model, _.has(t.row.role) ? t.row.role : ""].filter(Boolean).join(" · ");
    }), l = d(() => t.row.ended_at ? `${ee(t.row.ended_at, b.value)} ago` : ee(t.row.process_started_at || t.row.created_at, b.value)), A = d(() => {
      var e;
      return t.row.ended_at ? "closed" : f.value ? "waiting" : ((e = t.facts) == null ? void 0 : e.state) || "running";
    }), V = d(() => {
      var a, R, I;
      const e = [`agent ${t.row.id}`];
      return ((a = t.facts) == null ? void 0 : a.context_percent) !== null && ((R = t.facts) == null ? void 0 : R.context_percent) !== void 0 && e.push(`Context ${t.facts.context_percent}%`), (I = t.facts) != null && I.cost_dollars && e.push(`$${t.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), N = d(() => u.value.filter((e) => e.state === "completed").length), q = d(() => `${N.value} of ${u.value.length} ${u.value.length === 1 ? "task" : "tasks"}`), D = d(() => h.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: u.value.filter((a) => a.state === e) })).filter((e) => e.tasks.length)), k = S(!1), j = /* @__PURE__ */ new Set(["completed"]), s = S({}), c = (e) => !(s.value[e] ?? j.has(e)), p = (e) => s.value = { ...s.value, [e]: c(e) }, U = de(), $ = S(U.tabs[0]), H = S(""), M = d(() => t.row.role === "worker" && !t.row.ended_at);
    async function G() {
      if (!M.value) return;
      const e = await U.read(`usage tool --agent ${t.row.id}`);
      H.value = e.ok ? e.value.tool : "";
    }
    const W = U.follow(["hook_call.*"], G);
    return ne(() => W == null ? void 0 : W()), G(), (e, a) => {
      var R, I, J, P, Q, X;
      return r(), v("div", {
        class: "agent-card",
        "data-agent-open": i.row.id,
        "aria-expanded": k.value,
        title: i.row.session,
        onClick: a[4] || (a[4] = (g) => k.value = !k.value)
      }, [
        o("span", he, [
          o("span", {
            class: "agent-dot",
            "data-state": A.value
          }, null, 8, be),
          o("span", $e, w(T.value), 1),
          o("span", Ce, w(((R = i.facts) == null ? void 0 : R.given_name) || i.row.id), 1),
          o("span", Se, w(l.value), 1),
          m(n(ie), {
            class: se(["agent-chevron", { opened: k.value }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        o("span", xe, [
          o("span", Te, [
            K(w(E.value), 1),
            f.value ? (r(), v(L, { key: 0 }, [
              a[5] || (a[5] = K(" · ", -1)),
              o("button", {
                type: "button",
                class: "agent-waiting",
                "data-agent-waiting": "",
                title: "Open the test queue",
                onClick: a[0] || (a[0] = Y((g) => n(z)("test_queue:0"), ["stop"]))
              }, "waiting for its tests")
            ], 64)) : C("", !0)
          ]),
          u.value.length ? (r(), v("span", Ae, w(q.value), 1)) : C("", !0)
        ]),
        M.value ? (r(), v("span", Ne, [
          m(n(ue), {
            text: f.value ? "waiting for its tests" : H.value,
            idle: "thinking"
          }, null, 8, ["text"])
        ])) : C("", !0),
        k.value ? (r(), v("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: a[3] || (a[3] = Y(() => {
          }, ["stop"]))
        }, [
          o("span", Re, [
            o("span", Ie, w(V.value), 1),
            m(n(ce), {
              small: "",
              bordered: "",
              "data-agent-inspect": "",
              onClick: a[1] || (a[1] = (g) => n(z)(`agents:${i.row.id}`))
            }, {
              default: O(() => [...a[6] || (a[6] = [
                K("Inspect", -1)
              ])]),
              _: 1
            })
          ]),
          m(n(ge), {
            active: $.value,
            answer: { tasks: u.value.length },
            onChoose: a[2] || (a[2] = (g) => $.value = g)
          }, null, 8, ["active", "answer"]),
          o("div", {
            class: "agent-tab-body",
            "data-agent-tab-body": (I = $.value) == null ? void 0 : I.key
          }, [
            ((J = $.value) == null ? void 0 : J.key) === "tasks" ? (r(), v(L, { key: 0 }, [
              (r(!0), v(L, null, Z(D.value, (g) => (r(), B(n(pe), {
                key: g.state,
                label: g.label,
                count: g.tasks.length,
                open: c(g.state),
                "data-agent-section": g.state,
                onToggle: (y) => p(g.state)
              }, {
                default: O(() => [
                  (r(!0), v(L, null, Z(g.tasks, (y) => (r(), v("button", {
                    key: y.id,
                    type: "button",
                    class: "agent-task",
                    "data-agent-delegated": y.id,
                    onClick: (We) => n(z)(`tasks:${y.id}`)
                  }, [
                    m(n(ve), {
                      status: y.state
                    }, null, 8, ["status"]),
                    o("span", Ee, w(y.id), 1),
                    o("span", Be, w(y.title), 1)
                  ], 8, Oe))), 128))
                ]),
                _: 2
              }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
              (P = i.facts) != null && P.instruction ? (r(), v(L, { key: 0 }, [
                a[7] || (a[7] = o("p", { class: "agent-label" }, "Instruction", -1)),
                o("div", Fe, w(i.facts.instruction), 1)
              ], 64)) : C("", !0)
            ], 64)) : ((Q = $.value) == null ? void 0 : Q.key) === "transcript" ? (r(), B(we, {
              key: 1,
              line: `agent transcript ${i.row.id}`
            }, null, 8, ["line"])) : ((X = $.value) == null ? void 0 : X.key) === "file-feed" ? (r(), B(ke, {
              key: 2,
              agent: i.row.id
            }, null, 8, ["agent"])) : C("", !0)
          ], 8, Le)
        ])) : C("", !0)
      ], 8, ye);
    };
  }
}, qe = /* @__PURE__ */ ae(Ve, [["__scopeId", "data-v-7d2a04fd"]]), De = {
  class: "agents",
  "data-window-flush": ""
}, je = { class: "agents-bar" }, Ue = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, only: { type: Function, default: () => !0 } },
  setup(i) {
    const x = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], _ = i, { rows: h, failure: t, loaded: b, more: T, older: u } = F(_.line, ["agent.*"], { incremental: !0 }), { rows: f } = F("agent running", ["agent.*"]), { rows: E } = F("usage agents --closed", ["agent.*", "task.*"]), l = S("running"), A = S(""), V = (s) => l.value === "all" || l.value === "running" == !s.ended_at, N = (s) => E.value.find((c) => c.id === s.id) ?? null, q = (s) => {
      var c, p;
      return `${s.id} ${s.session} ${s.program} ${s.role} ${((c = N(s)) == null ? void 0 : c.profile) ?? ""} ${((p = N(s)) == null ? void 0 : p.given_name) ?? ""}`.toLowerCase().includes(A.value.trim().toLowerCase());
    }, D = d(() => l.value === "running" ? f.value : h.value), k = d(() => D.value.filter((s) => _.only(s) && V(s) && q(s))), j = d(() => h.value.some(_.only) ? "Nothing matches" : _.empty);
    return (s, c) => (r(), v("div", De, [
      o("div", je, [
        m(n(me), {
          modelValue: A.value,
          "onUpdate:modelValue": c[1] || (c[1] = (p) => A.value = p),
          class: "agents-search",
          placeholder: "Search the agents",
          "data-agents-search": ""
        }, {
          default: O(() => [
            m(n(fe), {
              options: x,
              value: l.value,
              onPick: c[0] || (c[0] = (p) => l.value = p)
            }, null, 8, ["value"])
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      m(n(te), {
        rows: k.value,
        failure: n(t),
        loaded: n(b),
        more: n(T) && l.value !== "running",
        older: n(u),
        empty: j.value
      }, {
        default: O(({ row: p }) => [
          m(qe, {
            row: p,
            facts: N(p)
          }, null, 8, ["row", "facts"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty"])
    ]));
  }
}, Me = /* @__PURE__ */ ae(Ue, [["__scopeId", "data-v-14c6d427"]]);
export {
  Me as A
};
