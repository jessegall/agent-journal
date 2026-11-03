/* @code-commandments-generated */
import { computed as c, openBlock as i, createBlock as E, unref as s, withCtx as N, createVNode as f, ref as I, createElementBlock as v, createElementVNode as o, toDisplayString as g, normalizeClass as J, createCommentVNode as A, withModifiers as P, createTextVNode as W, Fragment as T, renderList as K } from "vue";
import { useRows as F, RowList as H, DiffCard as G, ago as Q, useNow as X, useWindow as Y, age as U, Icon as Z, Btn as ee, peekRef as z, InnerTabs as te, TaskStatusIcon as ae, SearchBar as se, Segmented as ne } from "@journal/window-kit";
import { _ as M, T as oe } from "./TranscriptRows-Cotthc_y.js";
const le = 5, re = {
  __name: "AgentFileEdits",
  props: { agent: { type: Number, required: !0 } },
  setup(r) {
    const b = r, { rows: _, failure: w, loaded: t, more: y, older: p } = F(`file-edit list --agent ${b.agent}`, ["file_edit.create"], { incremental: !0 }), $ = c(() => _.value.map((d) => ({ ...d, lines: JSON.parse(d.rows || "[]") })));
    return (d, k) => (i(), E(s(H), {
      rows: $.value,
      failure: s(w),
      loaded: s(t),
      more: s(y),
      older: s(p),
      empty: "No edits by this agent yet"
    }, {
      default: N(({ row: u }) => [
        f(s(G), {
          flush: "",
          lines: le,
          path: u.path,
          kind: u.edit_type,
          added: u.added,
          removed: u.removed,
          ago: s(Q)(u.created_at),
          rows: u.lines
        }, null, 8, ["path", "kind", "added", "removed", "ago", "rows"])
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "more", "older"]));
  }
}, de = ["data-agent-open", "aria-expanded", "title"], ie = { class: "agent-head" }, ce = ["data-state"], ue = {
  class: "agent-title",
  "data-agent-title": ""
}, ge = {
  class: "agent-name",
  "data-agent-name": ""
}, pe = { class: "agent-time" }, ve = { class: "agent-line" }, me = {
  class: "agent-identity",
  "data-agent-identity": ""
}, fe = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": ""
}, _e = { class: "agent-usage-line" }, ke = {
  class: "agent-usage",
  "data-agent-card-usage": ""
}, we = ["data-agent-tab-body"], ye = ["data-agent-section"], he = { class: "agent-section-count" }, be = ["data-agent-delegated", "onClick"], $e = { class: "agent-task-number" }, Ce = { class: "agent-task-title" }, Se = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, xe = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null } },
  setup(r) {
    const b = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, _ = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), w = ["started", "testing", "blocked", "open", "completed", "cancelled"], t = r, y = X(), p = I(Y().tabs[0]), $ = c(() => {
      var a;
      const e = ((a = t.facts) == null ? void 0 : a.profile) || b[t.row.role] || t.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), d = c(() => {
      var e;
      return ((e = t.facts) == null ? void 0 : e.tasks) ?? [];
    }), k = c(() => !t.row.ended_at && d.value.some((e) => e.state === "testing") && !d.value.some((e) => e.state === "started")), u = c(() => {
      var e;
      return [t.row.program, (e = t.facts) == null ? void 0 : e.model, _.has(t.row.role) ? t.row.role : "", k.value ? "waiting for its tests" : ""].filter(Boolean).join(" · ");
    }), R = c(() => t.row.ended_at ? `${U(t.row.ended_at, y.value)} ago` : U(t.row.process_started_at || t.row.created_at, y.value)), C = c(() => {
      var e;
      return t.row.ended_at ? "closed" : k.value ? "waiting" : ((e = t.facts) == null ? void 0 : e.state) || "running";
    }), L = c(() => {
      var a, S, x;
      const e = [`agent ${t.row.id}`];
      return ((a = t.facts) == null ? void 0 : a.context_percent) !== null && ((S = t.facts) == null ? void 0 : S.context_percent) !== void 0 && e.push(`Context ${t.facts.context_percent}%`), (x = t.facts) != null && x.cost_dollars && e.push(`$${t.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), B = c(() => d.value.filter((e) => e.state === "completed").length), V = c(() => `${B.value} of ${d.value.length} ${d.value.length === 1 ? "task" : "tasks"}`), n = c(() => w.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: d.value.filter((a) => a.state === e) })).filter((e) => e.tasks.length)), l = I(!1);
    return (e, a) => {
      var S, x, O, j, q, D;
      return i(), v("div", {
        class: "agent-card",
        "data-agent-open": r.row.id,
        "aria-expanded": l.value,
        title: r.row.session,
        onClick: a[3] || (a[3] = (m) => l.value = !l.value)
      }, [
        o("span", ie, [
          o("span", {
            class: "agent-dot",
            "data-state": C.value
          }, null, 8, ce),
          o("span", ue, g($.value), 1),
          o("span", ge, g(((S = r.facts) == null ? void 0 : S.given_name) || r.row.id), 1),
          o("span", pe, g(R.value), 1),
          f(s(Z), {
            class: J(["agent-chevron", { opened: l.value }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        o("span", ve, [
          o("span", me, g(u.value), 1),
          d.value.length ? (i(), v("span", fe, g(V.value), 1)) : A("", !0)
        ]),
        l.value ? (i(), v("div", {
          key: 0,
          class: "agent-more",
          "data-agent-more": "",
          onClick: a[2] || (a[2] = P(() => {
          }, ["stop"]))
        }, [
          o("span", _e, [
            o("span", ke, g(L.value), 1),
            f(s(ee), {
              small: "",
              bordered: "",
              "data-agent-inspect": "",
              onClick: a[0] || (a[0] = (m) => s(z)(`agents:${r.row.id}`))
            }, {
              default: N(() => [...a[4] || (a[4] = [
                W("Inspect", -1)
              ])]),
              _: 1
            })
          ]),
          f(s(te), {
            active: p.value,
            answer: { tasks: d.value.length },
            onChoose: a[1] || (a[1] = (m) => p.value = m)
          }, null, 8, ["active", "answer"]),
          o("div", {
            class: "agent-tab-body",
            "data-agent-tab-body": (x = p.value) == null ? void 0 : x.key
          }, [
            ((O = p.value) == null ? void 0 : O.key) === "tasks" ? (i(), v(T, { key: 0 }, [
              (i(!0), v(T, null, K(n.value, (m) => (i(), v(T, {
                key: m.state
              }, [
                o("p", {
                  class: "agent-label",
                  "data-agent-section": m.state
                }, [
                  W(g(m.label) + " ", 1),
                  o("span", he, g(m.tasks.length), 1)
                ], 8, ye),
                (i(!0), v(T, null, K(m.tasks, (h) => (i(), v("button", {
                  key: h.id,
                  type: "button",
                  class: "agent-task",
                  "data-agent-delegated": h.id,
                  onClick: (Re) => s(z)(`tasks:${h.id}`)
                }, [
                  f(s(ae), {
                    status: h.state
                  }, null, 8, ["status"]),
                  o("span", $e, g(h.id), 1),
                  o("span", Ce, g(h.title), 1)
                ], 8, be))), 128))
              ], 64))), 128)),
              (j = r.facts) != null && j.instruction ? (i(), v(T, { key: 0 }, [
                a[5] || (a[5] = o("p", { class: "agent-label" }, "Instruction", -1)),
                o("div", Se, g(r.facts.instruction), 1)
              ], 64)) : A("", !0)
            ], 64)) : ((q = p.value) == null ? void 0 : q.key) === "transcript" ? (i(), E(oe, {
              key: 1,
              line: `agent transcript ${r.row.id}`
            }, null, 8, ["line"])) : ((D = p.value) == null ? void 0 : D.key) === "file-feed" ? (i(), E(re, {
              key: 2,
              agent: r.row.id
            }, null, 8, ["agent"])) : A("", !0)
          ], 8, we)
        ])) : A("", !0)
      ], 8, de);
    };
  }
}, Te = /* @__PURE__ */ M(xe, [["__scopeId", "data-v-e682b055"]]), Ae = {
  class: "agents",
  "data-window-flush": ""
}, Ne = { class: "agents-bar" }, Ie = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, only: { type: Function, default: () => !0 } },
  setup(r) {
    const b = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], _ = r, { rows: w, failure: t, loaded: y, more: p, older: $ } = F(_.line, ["agent.*"], { incremental: !0 }), { rows: d } = F("usage agents --closed", ["agent.*", "task.*"]), k = I("running"), u = I(""), R = (n) => k.value === "all" || k.value === "running" == !n.ended_at, C = (n) => d.value.find((l) => l.id === n.id) ?? null, L = (n) => {
      var l, e;
      return `${n.id} ${n.session} ${n.program} ${n.role} ${((l = C(n)) == null ? void 0 : l.profile) ?? ""} ${((e = C(n)) == null ? void 0 : e.given_name) ?? ""}`.toLowerCase().includes(u.value.trim().toLowerCase());
    }, B = c(() => w.value.filter((n) => _.only(n) && R(n) && L(n))), V = c(() => w.value.some(_.only) ? "Nothing matches" : _.empty);
    return (n, l) => (i(), v("div", Ae, [
      o("div", Ne, [
        f(s(se), {
          modelValue: u.value,
          "onUpdate:modelValue": l[1] || (l[1] = (e) => u.value = e),
          class: "agents-search",
          placeholder: "Search the agents",
          "data-agents-search": ""
        }, {
          default: N(() => [
            f(s(ne), {
              options: b,
              value: k.value,
              onPick: l[0] || (l[0] = (e) => k.value = e)
            }, null, 8, ["value"])
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      f(s(H), {
        rows: B.value,
        failure: s(t),
        loaded: s(y),
        more: s(p),
        older: s($),
        empty: V.value
      }, {
        default: N(({ row: e }) => [
          f(Te, {
            row: e,
            facts: C(e)
          }, null, 8, ["row", "facts"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty"])
    ]));
  }
}, Ee = /* @__PURE__ */ M(Ie, [["__scopeId", "data-v-00b72153"]]);
export {
  Ee as A
};
