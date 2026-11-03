/* @code-commandments-generated */
import { computed as i, openBlock as d, createElementBlock as r, unref as o, createCommentVNode as $, createVNode as p, withCtx as C, ref as k, onUnmounted as pe, normalizeClass as oe, createElementVNode as v, toDisplayString as m, createBlock as ne, Fragment as K, withModifiers as ue, renderList as re, watch as ce, createTextVNode as we, normalizeStyle as ke } from "vue";
import { useRows as P, AutoScrollPane as he, RowList as me, DiffCard as _e, useNow as ye, age as be, useWindow as fe, TimeAgo as Se, Icon as $e, peekRef as le, RunningCommand as Ce, FoldGroup as ge, InnerTabs as Te, SwitchCase as xe, TaskStatusIcon as Ae, ordered as Ie, SearchBar as De, Segmented as Oe, Btn as Me } from "@journal/window-kit";
import { _ as ie, T as ve } from "./TranscriptRows-DhYd90lu.js";
const Re = { class: "file-feed" }, Ne = 5, qe = {
  __name: "AgentFileEdits",
  props: { agent: { type: Number, required: !0 } },
  setup(u) {
    const B = u, { rows: h, failure: F, loaded: V, more: a, older: N } = P(`file-edit list --agent ${B.agent}`, ["file_edit.create"], { incremental: !0 }), q = i(() => h.value.map((g) => ({ ...g, lines: JSON.parse(g.rows || "[]") })).reverse()), E = i(() => {
      var g;
      return ((g = h.value[0]) == null ? void 0 : g.id) ?? 0;
    });
    return (g, M) => (d(), r("div", Re, [
      o(a) && o(h).length ? (d(), r("button", {
        key: 0,
        type: "button",
        class: "file-feed-older",
        "data-file-feed-older": "",
        onClick: M[0] || (M[0] = (...f) => o(N) && o(N)(...f))
      }, "Show older edits")) : $("", !0),
      p(o(he), { "row-count": E.value }, {
        default: C(() => [
          p(o(me), {
            rows: q.value,
            failure: o(F),
            loaded: o(V),
            empty: "No edits by this agent yet",
            hint: "The files it changes show here as it works."
          }, {
            default: C(({ row: f }) => [
              p(o(_e), {
                flush: "",
                lines: Ne,
                path: f.path,
                kind: f.edit_type,
                added: f.added,
                removed: f.removed,
                at: f.created_at,
                rows: f.lines
              }, null, 8, ["path", "kind", "added", "removed", "at", "rows"])
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ]),
        _: 1
      }, 8, ["row-count"])
    ]));
  }
}, Ee = /* @__PURE__ */ ie(qe, [["__scopeId", "data-v-69712d4d"]]), Le = ["data-agent-open", "aria-expanded", "title"], Be = { class: "agent-head" }, Fe = ["data-state"], Ve = {
  class: "agent-title",
  "data-agent-title": ""
}, We = {
  class: "agent-name",
  "data-agent-name": ""
}, je = {
  key: 1,
  class: "agent-time"
}, ze = { class: "agent-line" }, Ue = {
  class: "agent-identity",
  "data-agent-identity": ""
}, He = {
  key: 0,
  class: "agent-tasks",
  "data-agent-pace": ""
}, Ke = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, Pe = {
  key: 0,
  class: "agent-command",
  "data-agent-command": ""
}, Ge = {
  key: 0,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, Je = {
  key: 1,
  class: "agent-tab-body",
  "data-agent-tab-body": "transcript",
  "data-agent-only-transcript": ""
}, Qe = {
  key: 0,
  class: "agent-subagent-brief"
}, Xe = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ye = ["data-agent-tab-body"], Ze = ["data-agent-delegated", "onClick"], et = { class: "agent-task-number" }, tt = { class: "agent-task-title" }, at = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, nt = 36e5, st = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, open: Boolean },
  emits: ["toggle"],
  setup(u, { emit: B }) {
    const h = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, F = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), V = ["started", "testing", "blocked", "open", "completed", "cancelled"], a = u, N = B, q = ye(), E = i(() => {
      var l;
      const t = ((l = a.facts) == null ? void 0 : l.profile) || h[a.row.role] || a.row.role;
      return t.slice(0, 1).toUpperCase() + t.slice(1);
    }), g = i(() => {
      var t;
      return ((t = a.facts) == null ? void 0 : t.tasks) ?? [];
    }), M = i(() => !a.row.ended_at && g.value.some((t) => t.state === "testing") && !g.value.some((t) => t.state === "started")), f = i(() => {
      var t;
      return [a.row.program, (t = a.facts) == null ? void 0 : t.model, a.row.role === "worker" ? `worker ${a.row.id}` : F.has(a.row.role) ? a.row.role : ""].filter(Boolean).join(" · ");
    }), ee = i(() => be(a.row.process_started_at || a.row.created_at, q.value)), _ = i(() => {
      var t;
      return a.row.ended_at ? "closed" : M.value ? "waiting" : ((t = a.facts) == null ? void 0 : t.state) || "running";
    }), I = i(() => {
      var l, y, O;
      const t = [];
      return ((l = a.facts) == null ? void 0 : l.context_percent) !== null && ((y = a.facts) == null ? void 0 : y.context_percent) !== void 0 && t.push(`Context ${a.facts.context_percent}%`), (O = a.facts) != null && O.cost_dollars && t.push(`$${a.facts.cost_dollars.toFixed(2)}`), t.join(" · ");
    }), W = i(() => g.value.filter((t) => t.state === "completed").length), w = i(() => `${W.value} of ${g.value.length} ${g.value.length === 1 ? "task" : "tasks"}`), D = i(() => {
      const t = Date.parse(a.row.process_started_at || a.row.created_at), y = ((a.row.ended_at ? Date.parse(a.row.ended_at) : q.value) - t) / nt;
      return a.row.role === "worker" && y > 0 && W.value ? `${Math.round(W.value / y)}/h` : "";
    }), G = i(() => V.map((t) => ({ state: t, label: t.slice(0, 1).toUpperCase() + t.slice(1), tasks: g.value.filter((l) => l.state === t) })).filter((t) => t.tasks.length)), J = /* @__PURE__ */ new Set(["completed"]), j = k({}), z = (t) => !(j.value[t] ?? J.has(t)), te = (t) => j.value = { ...j.value, [t]: z(t) }, U = fe(), L = k(U.tabs[0]), ae = i(() => a.row.role === "subagent"), T = k(!1), Q = k(""), X = k(""), Y = i(() => a.row.role !== "main" && !a.row.ended_at);
    async function Z() {
      if (!Y.value) return;
      const t = await U.read(`usage tool --agent ${a.row.id}`);
      Q.value = t.ok ? t.value.tool : "", X.value = t.ok ? t.value.note : "";
    }
    const H = U.follow(["hook_call.*", "process_part.*"], Z);
    return pe(() => H == null ? void 0 : H()), Z(), (t, l) => {
      var y, O, x, R;
      return d(), r("div", {
        class: oe(["agent-card", { open: u.open }]),
        "data-agent-open": u.row.id,
        "aria-expanded": u.open,
        title: u.row.session,
        onClick: l[4] || (l[4] = (b) => N("toggle"))
      }, [
        v("span", Be, [
          v("span", {
            class: "agent-dot",
            "data-state": _.value
          }, null, 8, Fe),
          v("span", Ve, m(E.value), 1),
          v("span", We, m(((y = u.facts) == null ? void 0 : y.given_name) || u.row.id), 1),
          u.row.ended_at ? (d(), ne(o(Se), {
            key: 0,
            class: "agent-time",
            at: u.row.ended_at
          }, null, 8, ["at"])) : (d(), r("span", je, m(ee.value), 1)),
          p(o($e), {
            class: oe(["agent-chevron", { opened: u.open }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        v("span", ze, [
          v("span", Ue, m(f.value), 1),
          g.value.length ? (d(), r(K, { key: 0 }, [
            D.value ? (d(), r("span", He, m(D.value), 1)) : $("", !0),
            v("span", Ke, m(w.value), 1)
          ], 64)) : $("", !0)
        ]),
        Y.value ? (d(), r("span", Pe, [
          M.value ? (d(), r("button", {
            key: 0,
            type: "button",
            class: "agent-waiting",
            "data-agent-waiting": "",
            title: "Open the test queue",
            onClick: l[0] || (l[0] = ue((b) => o(le)("test_queue:0"), ["stop"]))
          }, "Waiting: tests")) : (d(), ne(o(Ce), {
            key: 1,
            text: Q.value,
            idle: X.value || "thinking"
          }, null, 8, ["text", "idle"]))
        ])) : $("", !0),
        u.open ? (d(), r("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: l[3] || (l[3] = ue(() => {
          }, ["stop"]))
        }, [
          I.value ? (d(), r("span", Ge, m(I.value), 1)) : $("", !0),
          ae.value ? (d(), r("div", Je, [
            (O = u.facts) != null && O.instruction ? (d(), r("div", Qe, [
              p(o(ge), {
                label: "Instruction",
                open: T.value,
                "data-agent-section": "instruction",
                onToggle: l[1] || (l[1] = (b) => T.value = !T.value)
              }, {
                default: C(() => [
                  v("div", Xe, m(u.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : $("", !0),
            p(ve, {
              line: `agent transcript ${u.row.id}`
            }, null, 8, ["line"])
          ])) : (d(), r(K, { key: 2 }, [
            p(o(Te), {
              class: "agent-tabs",
              active: L.value,
              answer: { tasks: g.value.length },
              onChoose: l[2] || (l[2] = (b) => L.value = b)
            }, null, 8, ["active", "answer"]),
            v("div", {
              class: "agent-tab-body",
              "data-agent-tab-body": (x = L.value) == null ? void 0 : x.key
            }, [
              p(o(xe), {
                value: (R = L.value) == null ? void 0 : R.key
              }, {
                tasks: C(() => {
                  var b;
                  return [
                    (d(!0), r(K, null, re(G.value, (S) => (d(), ne(o(ge), {
                      key: S.state,
                      label: S.label,
                      count: S.tasks.length,
                      open: z(S.state),
                      "data-agent-section": S.state,
                      onToggle: (A) => te(S.state)
                    }, {
                      default: C(() => [
                        (d(!0), r(K, null, re(S.tasks, (A) => (d(), r("button", {
                          key: A.id,
                          type: "button",
                          class: "agent-task",
                          "data-agent-delegated": A.id,
                          onClick: (e) => o(le)(`tasks:${A.id}`)
                        }, [
                          p(o(Ae), {
                            status: A.state
                          }, null, 8, ["status"]),
                          v("span", et, m(A.id), 1),
                          v("span", tt, m(A.title), 1)
                        ], 8, Ze))), 128))
                      ]),
                      _: 2
                    }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                    (b = u.facts) != null && b.instruction ? (d(), r(K, { key: 0 }, [
                      l[5] || (l[5] = v("p", { class: "agent-label" }, "Instruction", -1)),
                      v("div", at, m(u.facts.instruction), 1)
                    ], 64)) : $("", !0)
                  ];
                }),
                transcript: C(() => [
                  p(ve, {
                    line: `agent transcript ${u.row.id}`
                  }, null, 8, ["line"])
                ]),
                "file-feed": C(() => [
                  p(Ee, {
                    agent: u.row.id
                  }, null, 8, ["agent"])
                ]),
                _: 1
              }, 8, ["value"])
            ], 8, Ye)
          ], 64))
        ])) : $("", !0)
      ], 10, Le);
    };
  }
}, ot = /* @__PURE__ */ ie(st, [["__scopeId", "data-v-9c6cfa2b"]]), lt = { class: "agents-bar" }, it = {
  class: "agents-queue-count",
  "data-agents-queue-count": ""
}, dt = ["data-agent-row", "onMouseenter", "onMouseleave"], ut = {
  key: 0,
  class: "agent-leave",
  "data-agent-leave": "",
  "aria-hidden": "true"
}, se = 1e4, rt = 250, ct = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) }, only: { type: Function, default: () => !0 } },
  setup(u) {
    const B = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], h = u, { rows: F, failure: V, loaded: a, more: N, older: q } = P(h.line, ["agent.*"], { incremental: !0 }), { rows: E } = P("agent running", ["agent.*"]), { rows: g } = P("usage agents --closed", ["agent.*", "task.*"]), { rows: M } = P("proof list --limit 50", ["proof.*"]), f = /* @__PURE__ */ new Set(["queued", "running"]), ee = i(() => M.value.filter((e) => f.has(e.state)).length), _ = k("running"), I = k(""), W = k(Date.now()), w = k(/* @__PURE__ */ new Map()), D = k(/* @__PURE__ */ new Set());
    let G = Date.now(), J = /* @__PURE__ */ new Map();
    const j = setInterval(() => {
      const e = Date.now(), s = new Map(w.value);
      for (const [n, c] of s)
        D.value.has(n) ? s.set(n, { ...c, leavesAt: c.leavesAt + (e - G) }) : e >= c.leavesAt && s.delete(n);
      G = e, W.value = e, (s.size !== w.value.size || [...s].some(([n, c]) => c !== w.value.get(n))) && (w.value = s);
    }, rt);
    pe(() => clearInterval(j)), ce(E, (e) => {
      const s = new Set(e.map((c) => c.id)), n = new Map(w.value);
      for (const [c, de] of J)
        !s.has(c) && !n.has(c) && n.set(c, { row: { ...de, ended_at: de.ended_at ?? (/* @__PURE__ */ new Date()).toISOString() }, leavesAt: Date.now() + se });
      for (const c of s) n.delete(c);
      J = new Map(e.map((c) => [c.id, c])), w.value = n;
    });
    const z = (e) => w.value.get(e.id) ?? null, te = (e) => D.value = /* @__PURE__ */ new Set([...D.value, e.id]), U = (e) => D.value = new Set([...D.value].filter((s) => s !== e.id)), L = (e) => ({ animationDuration: `${se}ms`, animationDelay: `${Math.min(0, z(e).leavesAt - se - Date.now())}ms` }), ae = (e) => _.value === "all" || _.value === "running" == !e.ended_at || _.value === "running" && w.value.has(e.id), T = (e) => g.value.find((s) => s.id === e.id) ?? null, Q = (e) => {
      var s, n;
      return `${e.id} ${e.session} ${e.program} ${e.role} ${((s = T(e)) == null ? void 0 : s.profile) ?? ""} ${((n = T(e)) == null ? void 0 : n.given_name) ?? ""}`.toLowerCase().includes(I.value.trim().toLowerCase());
    }, X = i(() => _.value === "running" ? [...E.value, ...[...w.value.values()].map((e) => e.row)] : F.value), Y = i(() => X.value.filter((e) => h.only(e) && ae(e) && Q(e))), Z = fe().option("order"), H = (e) => {
      var s, n;
      return e.ended_at ? "stopped" : ((s = T(e)) == null ? void 0 : s.state) === "blocked" ? "waiting" : ((n = T(e)) == null ? void 0 : n.state) === "waiting" || e.paused_at ? "idle" : "working";
    }, t = (e) => ({ key: String(e.id), kind: e.role, n: e.id, time: Date.parse(e.updated_at ?? e.created_at ?? 0) / 1e3 || 0, card: { state: H(e) }, row: e }), l = i(() => Ie(Y.value.map(t), Z.value ?? "number").map((e) => e.row)), y = i(() => !!I.value.trim()), O = i(() => h.texts[_.value] ?? { title: h.empty, hint: "" }), x = k(null), R = i(() => l.value.find((e) => e.id === x.value) ?? null), b = i(() => R.value ? [R.value] : l.value), S = i(() => l.value.length - b.value.length), A = (e) => x.value = x.value === e.id ? null : e.id;
    return ce(I, (e) => e.trim() && (x.value = null)), (e, s) => (d(), r("div", {
      class: oe(["agents", { focused: R.value }])
    }, [
      v("div", lt, [
        p(o(De), {
          modelValue: I.value,
          "onUpdate:modelValue": s[2] || (s[2] = (n) => I.value = n),
          class: "agents-search",
          "data-agents-search": ""
        }, {
          default: C(() => [
            p(o(Oe), {
              options: B,
              value: _.value,
              onPick: s[0] || (s[0] = (n) => _.value = n)
            }, null, 8, ["value"]),
            p(o(Me), {
              small: "",
              bordered: "",
              title: "Open the test queue",
              "data-agents-queue": "",
              onClick: s[1] || (s[1] = (n) => o(le)("test_queue:0"))
            }, {
              default: C(() => [
                s[4] || (s[4] = we("Test queue ", -1)),
                v("span", it, m(ee.value), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      p(o(me), {
        rows: b.value,
        failure: o(V),
        loaded: o(a),
        more: o(N) && _.value !== "running",
        older: o(q),
        empty: O.value.title,
        hint: O.value.hint,
        searching: y.value
      }, {
        default: C(({ row: n }) => [
          v("div", {
            class: "agent-row",
            "data-agent-row": n.id,
            onMouseenter: (c) => te(n),
            onMouseleave: (c) => U(n)
          }, [
            p(ot, {
              row: n,
              facts: T(n),
              open: n.id === x.value,
              onToggle: (c) => A(n)
            }, null, 8, ["row", "facts", "open", "onToggle"]),
            z(n) ? (d(), r("span", ut, [
              v("i", {
                style: ke(L(n))
              }, null, 4)
            ])) : $("", !0)
          ], 40, dt)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty", "hint", "searching"]),
      R.value && S.value ? (d(), r("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: s[3] || (s[3] = (n) => x.value = null)
      }, m(S.value) + " more", 1)) : $("", !0)
    ], 2));
  }
}, mt = /* @__PURE__ */ ie(ct, [["__scopeId", "data-v-9b832cd9"]]);
export {
  mt as A
};
