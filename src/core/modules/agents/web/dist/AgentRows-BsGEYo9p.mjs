/* @code-commandments-generated */
import { computed as i, openBlock as r, createElementBlock as u, unref as o, createCommentVNode as $, createVNode as p, withCtx as C, ref as _, onUnmounted as he, normalizeClass as re, createElementVNode as g, toDisplayString as f, createBlock as ie, Fragment as K, withModifiers as pe, renderList as fe, watch as me, createTextVNode as Se, normalizeStyle as $e } from "vue";
import { useRows as U, AutoScrollPane as Ce, RowList as _e, DiffCard as Te, useNow as Ie, age as Ae, useWindow as ye, TimeAgo as Re, Icon as xe, peekRef as ue, RunningCommand as De, FoldGroup as we, InnerTabs as Ne, SwitchCase as Oe, TaskStatusIcon as Ee, ordered as Me, SearchBar as qe, Segmented as Le, Btn as We } from "@journal/window-kit";
import { _ as ce, T as ke } from "./TranscriptRows-CqsIYdpP.mjs";
const Be = { class: "file-feed" }, Fe = 5, Ue = {
  __name: "AgentFileEdits",
  props: { agent: { type: Number, required: !0 } },
  setup(d) {
    const V = d, { rows: y, failure: N, loaded: H, more: a, older: O } = U(`file-edit list --agent ${V.agent}`, ["file_edit.create"], { incremental: !0 }), E = i(() => y.value.map((v) => ({ ...v, lines: JSON.parse(v.rows || "[]") })).reverse()), M = i(() => {
      var v;
      return ((v = y.value[0]) == null ? void 0 : v.id) ?? 0;
    });
    return (v, q) => (r(), u("div", Be, [
      o(a) && o(y).length ? (r(), u("button", {
        key: 0,
        type: "button",
        class: "file-feed-older",
        "data-file-feed-older": "",
        onClick: q[0] || (q[0] = (...m) => o(O) && o(O)(...m))
      }, "Show older edits")) : $("", !0),
      p(o(Ce), { "row-count": M.value }, {
        default: C(() => [
          p(o(_e), {
            rows: E.value,
            failure: o(N),
            loaded: o(H),
            empty: "No edits by this agent yet",
            hint: "The files it changes show here as it works."
          }, {
            default: C(({ row: m }) => [
              p(o(Te), {
                flush: "",
                lines: Fe,
                path: m.path,
                kind: m.edit_type,
                added: m.added,
                removed: m.removed,
                at: m.created_at,
                rows: m.lines
              }, null, 8, ["path", "kind", "added", "removed", "at", "rows"])
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ]),
        _: 1
      }, 8, ["row-count"])
    ]));
  }
}, Ve = /* @__PURE__ */ ce(Ue, [["__scopeId", "data-v-b60acb7e"]]), He = ["data-agent-open", "aria-expanded", "title"], je = { class: "agent-head" }, ze = ["data-state"], Pe = {
  class: "agent-title",
  "data-agent-title": ""
}, Ke = {
  class: "agent-name",
  "data-agent-name": ""
}, Ge = {
  key: 1,
  class: "agent-time"
}, Je = { class: "agent-line" }, Qe = {
  class: "agent-identity",
  "data-agent-identity": ""
}, Xe = {
  key: 0,
  class: "agent-tasks",
  "data-agent-pace": ""
}, Ye = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, Ze = {
  key: 0,
  class: "agent-command",
  "data-agent-command": ""
}, et = {
  key: 1,
  class: "agent-stopped",
  "data-agent-stopped": ""
}, tt = {
  key: 0,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, at = {
  key: 1,
  class: "agent-tab-body",
  "data-agent-tab-body": "transcript",
  "data-agent-only-transcript": ""
}, nt = {
  key: 0,
  class: "agent-subagent-brief"
}, st = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ot = ["data-agent-tab-body"], lt = ["data-agent-delegated", "onClick"], it = { class: "agent-task-number" }, dt = { class: "agent-task-title" }, rt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ut = 36e5, ct = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(d, { emit: V }) {
    const y = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, N = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), H = ["started", "testing", "blocked", "open", "completed", "cancelled"], a = d, O = V, E = Ie(), M = i(() => {
      var l;
      const t = ((l = a.facts) == null ? void 0 : l.profile) || y[a.row.role] || a.row.role;
      return t.slice(0, 1).toUpperCase() + t.slice(1);
    }), v = i(() => {
      var t;
      return ((t = a.facts) == null ? void 0 : t.tasks) ?? [];
    }), q = i(() => {
      var t, l;
      return [a.row.program, (t = a.facts) == null ? void 0 : t.model, (l = a.facts) == null ? void 0 : l.effort, a.row.role === "worker" ? `worker ${a.row.id}` : N.has(a.row.role) ? a.row.role : ""].filter(Boolean).join(" · ");
    }), m = i(() => Ae(a.row.process_started_at || a.row.created_at, E.value)), ae = /* @__PURE__ */ new Set(["open", "started", "testing"]), L = i(() => !!a.row.ended_at && a.row.role === "worker" && v.value.some((t) => ae.has(t.state))), ne = i(() => {
      var t;
      return a.waitReason || L.value ? "waiting" : a.row.ended_at ? "closed" : ((t = a.facts) == null ? void 0 : t.state) || "running";
    }), k = i(() => {
      var l, b, x;
      const t = [];
      return ((l = a.facts) == null ? void 0 : l.context_percent) !== null && ((b = a.facts) == null ? void 0 : b.context_percent) !== void 0 && t.push(`Context ${a.facts.context_percent}%`), (x = a.facts) != null && x.cost_dollars && t.push(`$${a.facts.cost_dollars.toFixed(2)}`), t.join(" · ");
    }), T = i(() => v.value.filter((t) => t.state === "completed").length), se = i(() => `${T.value} of ${v.value.length} ${v.value.length === 1 ? "task" : "tasks"}`), w = i(() => {
      const t = Date.parse(a.row.process_started_at || a.row.created_at), b = ((a.row.ended_at ? Date.parse(a.row.ended_at) : E.value) - t) / ut;
      return a.row.role === "worker" && b > 0 && T.value ? `${Math.round(T.value / b)}/h` : "";
    }), R = i(() => H.map((t) => ({ state: t, label: t.slice(0, 1).toUpperCase() + t.slice(1), tasks: v.value.filter((l) => l.state === t) })).filter((t) => t.tasks.length)), G = /* @__PURE__ */ new Set(["completed"]), W = _({}), J = (t) => !(W.value[t] ?? G.has(t)), Q = (t) => W.value = { ...W.value, [t]: J(t) }, j = ye(), B = _(j.tabs[0]), oe = i(() => a.row.role === "subagent"), z = _(!1), F = _(""), X = _(""), Y = i(() => a.row.role !== "main" && (!a.row.ended_at || L.value || a.waitReason));
    async function I() {
      if (!Y.value) return;
      const t = await j.read(`usage tool --agent ${a.row.id}`);
      F.value = t.ok ? t.value.tool : "", X.value = t.ok ? t.value.note : "";
    }
    const P = j.follow(["hook_call.*", "process_part.*"], I);
    return he(() => P == null ? void 0 : P()), I(), (t, l) => {
      var b, x, Z, ee;
      return r(), u("div", {
        class: re(["agent-card", { open: d.open }]),
        "data-agent-open": d.row.id,
        "aria-expanded": d.open,
        title: d.row.session,
        onClick: l[4] || (l[4] = (h) => O("toggle"))
      }, [
        g("span", je, [
          g("span", {
            class: "agent-dot",
            "data-state": ne.value
          }, null, 8, ze),
          g("span", Pe, f(M.value), 1),
          g("span", Ke, f(((b = d.facts) == null ? void 0 : b.given_name) || d.row.id), 1),
          d.row.ended_at && !L.value ? (r(), ie(o(Re), {
            key: 0,
            class: "agent-time",
            at: d.row.ended_at
          }, null, 8, ["at"])) : (r(), u("span", Ge, f(m.value), 1)),
          p(o(xe), {
            class: re(["agent-chevron", { opened: d.open }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        g("span", Je, [
          g("span", Qe, f(q.value), 1),
          v.value.length ? (r(), u(K, { key: 0 }, [
            w.value ? (r(), u("span", Xe, f(w.value), 1)) : $("", !0),
            g("span", Ye, f(se.value), 1)
          ], 64)) : $("", !0)
        ]),
        Y.value ? (r(), u("span", Ze, [
          d.waitReason ? (r(), u("button", {
            key: 0,
            type: "button",
            class: "agent-waiting",
            "data-agent-waiting": "",
            title: "Open the process queue",
            onClick: l[0] || (l[0] = pe((h) => o(ue)("test_queue:0"), ["stop"]))
          }, "Waiting: " + f(d.waitReason), 1)) : L.value ? (r(), u("span", et, "Waiting")) : (r(), ie(o(De), {
            key: 2,
            text: F.value,
            idle: X.value || "thinking"
          }, null, 8, ["text", "idle"]))
        ])) : $("", !0),
        d.open ? (r(), u("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: l[3] || (l[3] = pe(() => {
          }, ["stop"]))
        }, [
          k.value ? (r(), u("span", tt, f(k.value), 1)) : $("", !0),
          oe.value ? (r(), u("div", at, [
            (x = d.facts) != null && x.instruction ? (r(), u("div", nt, [
              p(o(we), {
                label: "Instruction",
                open: z.value,
                "data-agent-section": "instruction",
                onToggle: l[1] || (l[1] = (h) => z.value = !z.value)
              }, {
                default: C(() => [
                  g("div", st, f(d.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : $("", !0),
            p(ke, {
              line: `agent transcript ${d.row.id}`
            }, null, 8, ["line"])
          ])) : (r(), u(K, { key: 2 }, [
            p(o(Ne), {
              class: "agent-tabs",
              active: B.value,
              answer: { tasks: v.value.length },
              onChoose: l[2] || (l[2] = (h) => B.value = h)
            }, null, 8, ["active", "answer"]),
            g("div", {
              class: "agent-tab-body",
              "data-agent-tab-body": (Z = B.value) == null ? void 0 : Z.key
            }, [
              p(o(Oe), {
                value: (ee = B.value) == null ? void 0 : ee.key
              }, {
                tasks: C(() => {
                  var h;
                  return [
                    (r(!0), u(K, null, fe(R.value, (A) => (r(), ie(o(we), {
                      key: A.state,
                      label: A.label,
                      count: A.tasks.length,
                      open: J(A.state),
                      "data-agent-section": A.state,
                      onToggle: (S) => Q(A.state)
                    }, {
                      default: C(() => [
                        (r(!0), u(K, null, fe(A.tasks, (S) => (r(), u("button", {
                          key: S.id,
                          type: "button",
                          class: "agent-task",
                          "data-agent-delegated": S.id,
                          onClick: (D) => o(ue)(`tasks:${S.id}`)
                        }, [
                          p(o(Ee), {
                            status: S.state
                          }, null, 8, ["status"]),
                          g("span", it, f(S.id), 1),
                          g("span", dt, f(S.title), 1)
                        ], 8, lt))), 128))
                      ]),
                      _: 2
                    }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                    (h = d.facts) != null && h.instruction ? (r(), u(K, { key: 0 }, [
                      l[5] || (l[5] = g("p", { class: "agent-label" }, "Instruction", -1)),
                      g("div", rt, f(d.facts.instruction), 1)
                    ], 64)) : $("", !0)
                  ];
                }),
                transcript: C(() => [
                  p(ke, {
                    line: `agent transcript ${d.row.id}`
                  }, null, 8, ["line"])
                ]),
                "file-feed": C(() => [
                  p(Ve, {
                    agent: d.row.id
                  }, null, 8, ["agent"])
                ]),
                _: 1
              }, 8, ["value"])
            ], 8, ot)
          ], 64))
        ])) : $("", !0)
      ], 10, He);
    };
  }
}, gt = /* @__PURE__ */ ce(ct, [["__scopeId", "data-v-84004a42"]]), vt = { class: "agents-bar" }, pt = {
  class: "agents-queue-count",
  "data-agents-queue-count": ""
}, ft = ["data-agent-row", "onMouseenter", "onMouseleave"], mt = {
  key: 0,
  class: "agent-leave",
  "data-agent-leave": "",
  "aria-hidden": "true"
}, de = 1e4, wt = 250, kt = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) }, only: { type: Function, default: () => !0 } },
  setup(d) {
    const V = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], y = d, { rows: N, failure: H, loaded: a, more: O, older: E } = U(y.line, ["agent.*"], { incremental: !0 }), { rows: M } = U("agent running", ["agent.*"]), { rows: v } = U("usage agents --closed", ["agent.*", "task.*"]), { rows: q } = U("worker waits", ["agent.*", "task.*", "proof.*", "worker_worktree.*"]), m = (e) => {
      var s;
      return ((s = q.value.find((n) => n.agent_id === e.id)) == null ? void 0 : s.reason) ?? "";
    }, { rows: ae } = U("proof list --limit 50", ["proof.*"]), L = /* @__PURE__ */ new Set(["queued", "running"]), ne = i(() => ae.value.filter((e) => L.has(e.state)).length), k = _("running"), T = _(""), se = _(Date.now()), w = _(/* @__PURE__ */ new Map()), R = _(/* @__PURE__ */ new Set());
    let G = Date.now(), W = /* @__PURE__ */ new Map();
    const J = setInterval(() => {
      const e = Date.now(), s = new Map(w.value);
      for (const [n, c] of s)
        R.value.has(n) ? s.set(n, { ...c, leavesAt: c.leavesAt + (e - G) }) : e >= c.leavesAt && s.delete(n);
      G = e, se.value = e, (s.size !== w.value.size || [...s].some(([n, c]) => c !== w.value.get(n))) && (w.value = s);
    }, wt);
    he(() => clearInterval(J)), me(M, (e) => {
      const s = new Set(e.map((c) => c.id)), n = new Map(w.value);
      for (const [c, le] of W)
        !s.has(c) && !n.has(c) && !F(le) && n.set(c, { row: { ...le, ended_at: le.ended_at ?? (/* @__PURE__ */ new Date()).toISOString() }, leavesAt: Date.now() + de });
      for (const c of s) n.delete(c);
      W = new Map(e.map((c) => [c.id, c])), w.value = n;
    });
    const Q = (e) => w.value.get(e.id) ?? null, j = (e) => R.value = /* @__PURE__ */ new Set([...R.value, e.id]), B = (e) => R.value = new Set([...R.value].filter((s) => s !== e.id)), oe = (e) => ({ animationDuration: `${de}ms`, animationDelay: `${Math.min(0, Q(e).leavesAt - de - Date.now())}ms` }), z = /* @__PURE__ */ new Set(["open", "started", "testing"]), F = (e) => {
      var s;
      return e.role === "worker" && (!!m(e) || (((s = I(e)) == null ? void 0 : s.tasks) ?? []).some((n) => z.has(n.state)));
    }, X = (e) => !e.ended_at || F(e), Y = (e) => k.value === "all" || k.value === "running" === X(e) || k.value === "running" && w.value.has(e.id), I = (e) => v.value.find((s) => s.id === e.id) ?? null, P = (e) => {
      var s, n;
      return `${e.id} ${e.session} ${e.program} ${e.role} ${((s = I(e)) == null ? void 0 : s.profile) ?? ""} ${((n = I(e)) == null ? void 0 : n.given_name) ?? ""}`.toLowerCase().includes(T.value.trim().toLowerCase());
    }, t = i(() => N.value.filter((e) => e.ended_at && F(e) && !w.value.has(e.id))), l = i(() => k.value === "running" ? [...M.value, ...t.value, ...[...w.value.values()].map((e) => e.row)] : N.value), b = i(() => l.value.filter((e) => y.only(e) && Y(e) && P(e))), x = ye().option("order"), Z = (e) => {
      var s, n;
      return e.ended_at ? "stopped" : ((s = I(e)) == null ? void 0 : s.state) === "blocked" ? "waiting" : ((n = I(e)) == null ? void 0 : n.state) === "waiting" || e.paused_at ? "idle" : "working";
    }, ee = (e) => ({ key: String(e.id), kind: e.role, n: e.id, time: Date.parse(e.updated_at ?? e.created_at ?? 0) / 1e3 || 0, card: { state: Z(e) }, row: e }), h = i(() => Me(b.value.map(ee), x.value ?? "number").map((e) => e.row)), A = i(() => !!T.value.trim()), S = i(() => y.texts[k.value] ?? { title: y.empty, hint: "" }), D = _(null), te = i(() => h.value.find((e) => e.id === D.value) ?? null), ge = i(() => te.value ? [te.value] : h.value), ve = i(() => h.value.length - ge.value.length), be = (e) => D.value = D.value === e.id ? null : e.id;
    return me(T, (e) => e.trim() && (D.value = null)), (e, s) => (r(), u("div", {
      class: re(["agents", { focused: te.value }])
    }, [
      g("div", vt, [
        p(o(qe), {
          modelValue: T.value,
          "onUpdate:modelValue": s[2] || (s[2] = (n) => T.value = n),
          class: "agents-search",
          "data-agents-search": ""
        }, {
          default: C(() => [
            p(o(Le), {
              options: V,
              value: k.value,
              onPick: s[0] || (s[0] = (n) => k.value = n)
            }, null, 8, ["value"]),
            p(o(We), {
              small: "",
              bordered: "",
              title: "Open the process queue",
              "data-agents-queue": "",
              onClick: s[1] || (s[1] = (n) => o(ue)("test_queue:0"))
            }, {
              default: C(() => [
                s[4] || (s[4] = Se("Process queue ", -1)),
                g("span", pt, f(ne.value), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      p(o(_e), {
        rows: ge.value,
        failure: o(H),
        loaded: o(a),
        more: o(O) && k.value !== "running",
        older: o(E),
        empty: S.value.title,
        hint: S.value.hint,
        searching: A.value
      }, {
        default: C(({ row: n }) => [
          g("div", {
            class: "agent-row",
            "data-agent-row": n.id,
            onMouseenter: (c) => j(n),
            onMouseleave: (c) => B(n)
          }, [
            p(gt, {
              row: n,
              facts: I(n),
              "wait-reason": m(n),
              open: n.id === D.value,
              onToggle: (c) => be(n)
            }, null, 8, ["row", "facts", "wait-reason", "open", "onToggle"]),
            Q(n) ? (r(), u("span", mt, [
              g("i", {
                style: $e(oe(n))
              }, null, 4)
            ])) : $("", !0)
          ], 40, ft)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty", "hint", "searching"]),
      te.value && ve.value ? (r(), u("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: s[3] || (s[3] = (n) => D.value = null)
      }, f(ve.value) + " more", 1)) : $("", !0)
    ], 2));
  }
}, bt = /* @__PURE__ */ ce(kt, [["__scopeId", "data-v-6177629e"]]);
export {
  bt as A
};
