/* @code-commandments-generated */
import { computed as c, openBlock as i, createBlock as E, unref as s, withCtx as N, createVNode as f, ref as I, createElementBlock as p, createElementVNode as o, toDisplayString as g, normalizeClass as M, createCommentVNode as A, withModifiers as J, createTextVNode as D, Fragment as T, renderList as W } from "vue";
import { useRows as F, RowList as z, DiffCard as P, ago as G, useNow as Q, useWindow as X, age as K, Icon as Y, Btn as Z, peekRef as U, InnerTabs as ee, TaskStatusIcon as te, SearchBar as ae, Segmented as se } from "@journal/window-kit";
import { _ as H, T as ne } from "./TranscriptRows-Cotthc_y.js";
const oe = 5, le = {
  __name: "AgentFileEdits",
  props: { agent: { type: Number, required: !0 } },
  setup(r) {
    const b = r, { rows: _, failure: k, loaded: t, more: y, older: v } = F(`file-edit list --agent ${b.agent}`, ["file_edit.create"], { incremental: !0 }), $ = c(() => _.value.map((d) => ({ ...d, lines: JSON.parse(d.rows || "[]") })));
    return (d, w) => (i(), E(s(z), {
      rows: $.value,
      failure: s(k),
      loaded: s(t),
      more: s(y),
      older: s(v),
      empty: "No edits by this agent yet"
    }, {
      default: N(({ row: u }) => [
        f(s(P), {
          flush: "",
          lines: oe,
          path: u.path,
          kind: u.edit_type,
          added: u.added,
          removed: u.removed,
          ago: s(G)(u.created_at),
          rows: u.lines
        }, null, 8, ["path", "kind", "added", "removed", "ago", "rows"])
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "more", "older"]));
  }
}, re = ["data-agent-open", "aria-expanded", "title"], de = { class: "agent-head" }, ie = ["data-state"], ce = {
  class: "agent-title",
  "data-agent-title": ""
}, ue = {
  class: "agent-name",
  "data-agent-name": ""
}, ge = { class: "agent-time" }, pe = { class: "agent-line" }, ve = {
  class: "agent-identity",
  "data-agent-identity": ""
}, me = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": ""
}, fe = { class: "agent-usage-line" }, _e = {
  class: "agent-usage",
  "data-agent-card-usage": ""
}, we = {
  class: "agent-tab-body",
  "data-agent-tab-body": ""
}, ke = ["data-agent-section"], ye = { class: "agent-section-count" }, he = ["data-agent-delegated", "onClick"], be = { class: "agent-task-number" }, $e = { class: "agent-task-title" }, Ce = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Se = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null } },
  setup(r) {
    const b = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, _ = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), k = ["started", "testing", "blocked", "open", "completed", "cancelled"], t = r, y = Q(), v = I(X().tabs[0]), $ = c(() => {
      var a;
      const e = ((a = t.facts) == null ? void 0 : a.profile) || b[t.row.role] || t.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), d = c(() => {
      var e;
      return ((e = t.facts) == null ? void 0 : e.tasks) ?? [];
    }), w = c(() => !t.row.ended_at && d.value.some((e) => e.state === "testing") && !d.value.some((e) => e.state === "started")), u = c(() => {
      var e;
      return [t.row.program, (e = t.facts) == null ? void 0 : e.model, _.has(t.row.role) ? t.row.role : "", w.value ? "waiting for its tests" : ""].filter(Boolean).join(" · ");
    }), R = c(() => t.row.ended_at ? `${K(t.row.ended_at, y.value)} ago` : K(t.row.process_started_at || t.row.created_at, y.value)), C = c(() => {
      var e;
      return t.row.ended_at ? "closed" : w.value ? "waiting" : ((e = t.facts) == null ? void 0 : e.state) || "running";
    }), L = c(() => {
      var a, S, x;
      const e = [`agent ${t.row.id}`];
      return ((a = t.facts) == null ? void 0 : a.context_percent) !== null && ((S = t.facts) == null ? void 0 : S.context_percent) !== void 0 && e.push(`Context ${t.facts.context_percent}%`), (x = t.facts) != null && x.cost_dollars && e.push(`$${t.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), B = c(() => d.value.filter((e) => e.state === "completed").length), V = c(() => `${B.value} of ${d.value.length} ${d.value.length === 1 ? "task" : "tasks"}`), n = c(() => k.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: d.value.filter((a) => a.state === e) })).filter((e) => e.tasks.length)), l = I(!1);
    return (e, a) => {
      var S, x, O, j, q;
      return i(), p("div", {
        class: "agent-card",
        "data-agent-open": r.row.id,
        "aria-expanded": l.value,
        title: r.row.session,
        onClick: a[3] || (a[3] = (m) => l.value = !l.value)
      }, [
        o("span", de, [
          o("span", {
            class: "agent-dot",
            "data-state": C.value
          }, null, 8, ie),
          o("span", ce, g($.value), 1),
          o("span", ue, g(((S = r.facts) == null ? void 0 : S.given_name) || r.row.id), 1),
          o("span", ge, g(R.value), 1),
          f(s(Y), {
            class: M(["agent-chevron", { opened: l.value }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        o("span", pe, [
          o("span", ve, g(u.value), 1),
          d.value.length ? (i(), p("span", me, g(V.value), 1)) : A("", !0)
        ]),
        l.value ? (i(), p("div", {
          key: 0,
          class: "agent-more",
          "data-agent-more": "",
          onClick: a[2] || (a[2] = J(() => {
          }, ["stop"]))
        }, [
          o("span", fe, [
            o("span", _e, g(L.value), 1),
            f(s(Z), {
              small: "",
              bordered: "",
              "data-agent-inspect": "",
              onClick: a[0] || (a[0] = (m) => s(U)(`agents:${r.row.id}`))
            }, {
              default: N(() => [...a[4] || (a[4] = [
                D("Inspect", -1)
              ])]),
              _: 1
            })
          ]),
          f(s(ee), {
            active: v.value,
            answer: { tasks: d.value.length },
            onChoose: a[1] || (a[1] = (m) => v.value = m)
          }, null, 8, ["active", "answer"]),
          o("div", we, [
            ((x = v.value) == null ? void 0 : x.key) === "tasks" ? (i(), p(T, { key: 0 }, [
              (i(!0), p(T, null, W(n.value, (m) => (i(), p(T, {
                key: m.state
              }, [
                o("p", {
                  class: "agent-label",
                  "data-agent-section": m.state
                }, [
                  D(g(m.label) + " ", 1),
                  o("span", ye, g(m.tasks.length), 1)
                ], 8, ke),
                (i(!0), p(T, null, W(m.tasks, (h) => (i(), p("button", {
                  key: h.id,
                  type: "button",
                  class: "agent-task",
                  "data-agent-delegated": h.id,
                  onClick: (Ie) => s(U)(`tasks:${h.id}`)
                }, [
                  f(s(te), {
                    status: h.state
                  }, null, 8, ["status"]),
                  o("span", be, g(h.id), 1),
                  o("span", $e, g(h.title), 1)
                ], 8, he))), 128))
              ], 64))), 128)),
              (O = r.facts) != null && O.instruction ? (i(), p(T, { key: 0 }, [
                a[5] || (a[5] = o("p", { class: "agent-label" }, "Instruction", -1)),
                o("div", Ce, g(r.facts.instruction), 1)
              ], 64)) : A("", !0)
            ], 64)) : ((j = v.value) == null ? void 0 : j.key) === "transcript" ? (i(), E(ne, {
              key: 1,
              line: `agent transcript ${r.row.id}`
            }, null, 8, ["line"])) : ((q = v.value) == null ? void 0 : q.key) === "file-feed" ? (i(), E(le, {
              key: 2,
              agent: r.row.id
            }, null, 8, ["agent"])) : A("", !0)
          ])
        ])) : A("", !0)
      ], 8, re);
    };
  }
}, xe = /* @__PURE__ */ H(Se, [["__scopeId", "data-v-5cfe2d24"]]), Te = {
  class: "agents",
  "data-window-flush": ""
}, Ae = { class: "agents-bar" }, Ne = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, only: { type: Function, default: () => !0 } },
  setup(r) {
    const b = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], _ = r, { rows: k, failure: t, loaded: y, more: v, older: $ } = F(_.line, ["agent.*"], { incremental: !0 }), { rows: d } = F("usage agents --closed", ["agent.*", "task.*"]), w = I("running"), u = I(""), R = (n) => w.value === "all" || w.value === "running" == !n.ended_at, C = (n) => d.value.find((l) => l.id === n.id) ?? null, L = (n) => {
      var l, e;
      return `${n.id} ${n.session} ${n.program} ${n.role} ${((l = C(n)) == null ? void 0 : l.profile) ?? ""} ${((e = C(n)) == null ? void 0 : e.given_name) ?? ""}`.toLowerCase().includes(u.value.trim().toLowerCase());
    }, B = c(() => k.value.filter((n) => _.only(n) && R(n) && L(n))), V = c(() => k.value.some(_.only) ? "Nothing matches" : _.empty);
    return (n, l) => (i(), p("div", Te, [
      o("div", Ae, [
        f(s(ae), {
          modelValue: u.value,
          "onUpdate:modelValue": l[1] || (l[1] = (e) => u.value = e),
          class: "agents-search",
          placeholder: "Search the agents",
          "data-agents-search": ""
        }, {
          default: N(() => [
            f(s(se), {
              options: b,
              value: w.value,
              onPick: l[0] || (l[0] = (e) => w.value = e)
            }, null, 8, ["value"])
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      f(s(z), {
        rows: B.value,
        failure: s(t),
        loaded: s(y),
        more: s(v),
        older: s($),
        empty: V.value
      }, {
        default: N(({ row: e }) => [
          f(xe, {
            row: e,
            facts: C(e)
          }, null, 8, ["row", "facts"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty"])
    ]));
  }
}, Ve = /* @__PURE__ */ H(Ne, [["__scopeId", "data-v-00b72153"]]);
export {
  Ve as A
};
