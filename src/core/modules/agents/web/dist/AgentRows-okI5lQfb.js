/* @code-commandments-generated */
import { computed as r, openBlock as o, createBlock as O, unref as n, withCtx as E, createVNode as f, ref as T, onUnmounted as ne, createElementBlock as v, createElementVNode as l, toDisplayString as m, normalizeClass as se, Fragment as L, createCommentVNode as x, withModifiers as X, createTextVNode as oe, renderList as Y } from "vue";
import { useRows as F, RowList as ee, DiffCard as le, ago as re, useNow as de, age as Z, useWindow as ie, Icon as ue, peekRef as M, RunningCommand as ce, Btn as ge, InnerTabs as pe, FoldGroup as ve, TaskStatusIcon as me, SearchBar as fe, Segmented as we } from "@journal/window-kit";
import { _ as te, T as _e } from "./TranscriptRows-Cotthc_y.js";
const ke = 5, ye = {
  __name: "AgentFileEdits",
  props: { agent: { type: Number, required: !0 } },
  setup(i) {
    const A = i, { rows: w, failure: C, loaded: t, more: y, older: N } = F(`file-edit list --agent ${A.agent}`, ["file_edit.create"], { incremental: !0 }), c = r(() => w.value.map((_) => ({ ..._, lines: JSON.parse(_.rows || "[]") })));
    return (_, D) => (o(), O(n(ee), {
      rows: c.value,
      failure: n(C),
      loaded: n(t),
      more: n(y),
      older: n(N),
      empty: "No edits by this agent yet"
    }, {
      default: E(({ row: d }) => [
        f(n(le), {
          flush: "",
          lines: ke,
          path: d.path,
          kind: d.edit_type,
          added: d.added,
          removed: d.removed,
          ago: n(re)(d.created_at),
          rows: d.lines
        }, null, 8, ["path", "kind", "added", "removed", "ago", "rows"])
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "more", "older"]));
  }
}, he = ["data-agent-open", "aria-expanded", "title"], be = { class: "agent-head" }, $e = ["data-state"], Ce = {
  class: "agent-title",
  "data-agent-title": ""
}, Se = {
  class: "agent-name",
  "data-agent-name": ""
}, xe = { class: "agent-time" }, Te = { class: "agent-line" }, Ae = {
  class: "agent-identity",
  "data-agent-identity": ""
}, Ne = {
  key: 0,
  class: "agent-tasks",
  "data-agent-pace": ""
}, Re = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, Ie = {
  key: 0,
  class: "agent-command",
  "data-agent-command": ""
}, Le = { class: "agent-usage-line" }, Oe = {
  class: "agent-usage",
  "data-agent-card-usage": ""
}, Ee = ["data-agent-tab-body"], De = ["data-agent-delegated", "onClick"], Be = { class: "agent-task-number" }, Fe = { class: "agent-task-title" }, Ve = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, qe = 36e5, Ue = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null } },
  setup(i) {
    const A = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, w = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), C = ["started", "testing", "blocked", "open", "completed", "cancelled"], t = i, y = de(), N = r(() => {
      var a;
      const e = ((a = t.facts) == null ? void 0 : a.profile) || A[t.row.role] || t.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), c = r(() => {
      var e;
      return ((e = t.facts) == null ? void 0 : e.tasks) ?? [];
    }), _ = r(() => !t.row.ended_at && c.value.some((e) => e.state === "testing") && !c.value.some((e) => e.state === "started")), D = r(() => {
      var e;
      return [t.row.program, (e = t.facts) == null ? void 0 : e.model, t.row.role === "worker" ? `worker ${t.row.id}` : w.has(t.row.role) ? t.row.role : ""].filter(Boolean).join(" · ");
    }), d = r(() => t.row.ended_at ? `${Z(t.row.ended_at, y.value)} ago` : Z(t.row.process_started_at || t.row.created_at, y.value)), R = r(() => {
      var e;
      return t.row.ended_at ? "closed" : _.value ? "waiting" : ((e = t.facts) == null ? void 0 : e.state) || "running";
    }), V = r(() => {
      var a, k, I;
      const e = [`agent ${t.row.id}`];
      return ((a = t.facts) == null ? void 0 : a.context_percent) !== null && ((k = t.facts) == null ? void 0 : k.context_percent) !== void 0 && e.push(`Context ${t.facts.context_percent}%`), (I = t.facts) != null && I.cost_dollars && e.push(`$${t.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), h = r(() => c.value.filter((e) => e.state === "completed").length), q = r(() => `${h.value} of ${c.value.length} ${c.value.length === 1 ? "task" : "tasks"}`), B = r(() => {
      const e = Date.parse(t.row.process_started_at || t.row.created_at), k = ((t.row.ended_at ? Date.parse(t.row.ended_at) : y.value) - e) / qe;
      return t.row.role === "worker" && k > 0 && h.value ? `${Math.round(h.value / k)}/h` : "";
    }), U = r(() => C.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: c.value.filter((a) => a.state === e) })).filter((e) => e.tasks.length)), b = T(!1), s = /* @__PURE__ */ new Set(["completed"]), u = T({}), g = (e) => !(u.value[e] ?? s.has(e)), ae = (e) => u.value = { ...u.value, [e]: g(e) }, j = ie(), S = T(j.tabs[0]), W = T(""), K = r(() => t.row.role === "worker" && !t.row.ended_at);
    async function P() {
      if (!K.value) return;
      const e = await j.read(`usage tool --agent ${t.row.id}`);
      W.value = e.ok ? e.value.tool : "";
    }
    const H = j.follow(["hook_call.*", "process_part.*"], P);
    return ne(() => H == null ? void 0 : H()), P(), (e, a) => {
      var k, I, z, G, J, Q;
      return o(), v("div", {
        class: "agent-card",
        "data-agent-open": i.row.id,
        "aria-expanded": b.value,
        title: i.row.session,
        onClick: a[4] || (a[4] = (p) => b.value = !b.value)
      }, [
        l("span", be, [
          l("span", {
            class: "agent-dot",
            "data-state": R.value
          }, null, 8, $e),
          l("span", Ce, m(N.value), 1),
          l("span", Se, m(((k = i.facts) == null ? void 0 : k.given_name) || i.row.id), 1),
          l("span", xe, m(d.value), 1),
          f(n(ue), {
            class: se(["agent-chevron", { opened: b.value }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        l("span", Te, [
          l("span", Ae, m(D.value), 1),
          c.value.length ? (o(), v(L, { key: 0 }, [
            B.value ? (o(), v("span", Ne, m(B.value), 1)) : x("", !0),
            l("span", Re, m(q.value), 1)
          ], 64)) : x("", !0)
        ]),
        K.value ? (o(), v("span", Ie, [
          _.value ? (o(), v("button", {
            key: 0,
            type: "button",
            class: "agent-waiting",
            "data-agent-waiting": "",
            title: "Open the test queue",
            onClick: a[0] || (a[0] = X((p) => n(M)("test_queue:0"), ["stop"]))
          }, "waiting for its tests")) : (o(), O(n(ce), {
            key: 1,
            text: W.value,
            idle: "thinking"
          }, null, 8, ["text"]))
        ])) : x("", !0),
        b.value ? (o(), v("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: a[3] || (a[3] = X(() => {
          }, ["stop"]))
        }, [
          l("span", Le, [
            l("span", Oe, m(V.value), 1),
            f(n(ge), {
              small: "",
              bordered: "",
              "data-agent-inspect": "",
              onClick: a[1] || (a[1] = (p) => n(M)(`agents:${i.row.id}`))
            }, {
              default: E(() => [...a[5] || (a[5] = [
                oe("Inspect", -1)
              ])]),
              _: 1
            })
          ]),
          f(n(pe), {
            class: "agent-tabs",
            active: S.value,
            answer: { tasks: c.value.length },
            onChoose: a[2] || (a[2] = (p) => S.value = p)
          }, null, 8, ["active", "answer"]),
          l("div", {
            class: "agent-tab-body",
            "data-agent-tab-body": (I = S.value) == null ? void 0 : I.key
          }, [
            ((z = S.value) == null ? void 0 : z.key) === "tasks" ? (o(), v(L, { key: 0 }, [
              (o(!0), v(L, null, Y(U.value, (p) => (o(), O(n(ve), {
                key: p.state,
                label: p.label,
                count: p.tasks.length,
                open: g(p.state),
                "data-agent-section": p.state,
                onToggle: ($) => ae(p.state)
              }, {
                default: E(() => [
                  (o(!0), v(L, null, Y(p.tasks, ($) => (o(), v("button", {
                    key: $.id,
                    type: "button",
                    class: "agent-task",
                    "data-agent-delegated": $.id,
                    onClick: (Ke) => n(M)(`tasks:${$.id}`)
                  }, [
                    f(n(me), {
                      status: $.state
                    }, null, 8, ["status"]),
                    l("span", Be, m($.id), 1),
                    l("span", Fe, m($.title), 1)
                  ], 8, De))), 128))
                ]),
                _: 2
              }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
              (G = i.facts) != null && G.instruction ? (o(), v(L, { key: 0 }, [
                a[6] || (a[6] = l("p", { class: "agent-label" }, "Instruction", -1)),
                l("div", Ve, m(i.facts.instruction), 1)
              ], 64)) : x("", !0)
            ], 64)) : ((J = S.value) == null ? void 0 : J.key) === "transcript" ? (o(), O(_e, {
              key: 1,
              line: `agent transcript ${i.row.id}`
            }, null, 8, ["line"])) : ((Q = S.value) == null ? void 0 : Q.key) === "file-feed" ? (o(), O(ye, {
              key: 2,
              agent: i.row.id
            }, null, 8, ["agent"])) : x("", !0)
          ], 8, Ee)
        ])) : x("", !0)
      ], 8, he);
    };
  }
}, je = /* @__PURE__ */ te(Ue, [["__scopeId", "data-v-c3c8f1a6"]]), He = {
  class: "agents",
  "data-window-flush": ""
}, Me = { class: "agents-bar" }, We = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, only: { type: Function, default: () => !0 } },
  setup(i) {
    const A = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], w = i, { rows: C, failure: t, loaded: y, more: N, older: c } = F(w.line, ["agent.*"], { incremental: !0 }), { rows: _ } = F("agent running", ["agent.*"]), { rows: D } = F("usage agents --closed", ["agent.*", "task.*"]), d = T("running"), R = T(""), V = (s) => d.value === "all" || d.value === "running" == !s.ended_at, h = (s) => D.value.find((u) => u.id === s.id) ?? null, q = (s) => {
      var u, g;
      return `${s.id} ${s.session} ${s.program} ${s.role} ${((u = h(s)) == null ? void 0 : u.profile) ?? ""} ${((g = h(s)) == null ? void 0 : g.given_name) ?? ""}`.toLowerCase().includes(R.value.trim().toLowerCase());
    }, B = r(() => d.value === "running" ? _.value : C.value), U = r(() => B.value.filter((s) => w.only(s) && V(s) && q(s))), b = r(() => C.value.some(w.only) ? "Nothing matches" : w.empty);
    return (s, u) => (o(), v("div", He, [
      l("div", Me, [
        f(n(fe), {
          modelValue: R.value,
          "onUpdate:modelValue": u[1] || (u[1] = (g) => R.value = g),
          class: "agents-search",
          placeholder: "Search the agents",
          "data-agents-search": ""
        }, {
          default: E(() => [
            f(n(we), {
              options: A,
              value: d.value,
              onPick: u[0] || (u[0] = (g) => d.value = g)
            }, null, 8, ["value"])
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      f(n(ee), {
        rows: U.value,
        failure: n(t),
        loaded: n(y),
        more: n(N) && d.value !== "running",
        older: n(c),
        empty: b.value
      }, {
        default: E(({ row: g }) => [
          f(je, {
            row: g,
            facts: h(g)
          }, null, 8, ["row", "facts"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty"])
    ]));
  }
}, Je = /* @__PURE__ */ te(We, [["__scopeId", "data-v-14c6d427"]]);
export {
  Je as A
};
