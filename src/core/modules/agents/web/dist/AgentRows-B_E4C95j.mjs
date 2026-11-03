/* @code-commandments-generated */
import { computed as i, openBlock as d, createElementBlock as u, unref as l, createCommentVNode as $, createVNode as v, withCtx as C, ref as _, onUnmounted as ye, normalizeClass as ce, createElementVNode as g, toDisplayString as f, createBlock as de, Fragment as J, withModifiers as me, renderList as we, watch as ke, createTextVNode as Ce, normalizeStyle as Te } from "vue";
import { useRows as N, AutoScrollPane as Ie, RowList as be, DiffCard as Ae, useNow as Re, age as xe, useWindow as Se, TimeAgo as De, Icon as Oe, peekRef as ge, RunningCommand as Ne, FoldGroup as he, InnerTabs as Ee, SwitchCase as Me, TaskStatusIcon as qe, ordered as Le, SearchBar as We, Segmented as Be, Btn as Fe } from "@journal/window-kit";
import { _ as ve, T as _e } from "./TranscriptRows-CqsIYdpP.mjs";
const Ue = { class: "file-feed" }, Ve = 5, je = {
  __name: "AgentFileEdits",
  props: { agent: { type: Number, required: !0 } },
  setup(r) {
    const H = r, { rows: y, failure: E, loaded: P, more: a, older: M } = N(`file-edit list --agent ${H.agent}`, ["file_edit.create"], { incremental: !0 }), q = i(() => y.value.map((p) => ({ ...p, lines: JSON.parse(p.rows || "[]") })).reverse()), L = i(() => {
      var p;
      return ((p = y.value[0]) == null ? void 0 : p.id) ?? 0;
    });
    return (p, W) => (d(), u("div", Ue, [
      l(a) && l(y).length ? (d(), u("button", {
        key: 0,
        type: "button",
        class: "file-feed-older",
        "data-file-feed-older": "",
        onClick: W[0] || (W[0] = (...m) => l(M) && l(M)(...m))
      }, "Show older edits")) : $("", !0),
      v(l(Ie), { "row-count": L.value }, {
        default: C(() => [
          v(l(be), {
            rows: q.value,
            failure: l(E),
            loaded: l(P),
            empty: "No edits by this agent yet",
            hint: "The files it changes show here as it works."
          }, {
            default: C(({ row: m }) => [
              v(l(Ae), {
                flush: "",
                lines: Ve,
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
}, He = /* @__PURE__ */ ve(je, [["__scopeId", "data-v-b60acb7e"]]), Pe = ["data-agent-open", "aria-expanded", "title"], ze = { class: "agent-head" }, Ke = ["data-state"], Ge = {
  class: "agent-title",
  "data-agent-title": ""
}, Je = {
  class: "agent-name",
  "data-agent-name": ""
}, Qe = {
  key: 1,
  class: "agent-time"
}, Xe = { class: "agent-line" }, Ye = {
  class: "agent-identity",
  "data-agent-identity": ""
}, Ze = {
  key: 0,
  class: "agent-tasks",
  "data-agent-pace": ""
}, et = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, tt = {
  key: 0,
  class: "agent-command",
  "data-agent-command": ""
}, at = {
  key: 1,
  class: "agent-stopped",
  "data-agent-stopped": ""
}, nt = {
  key: 0,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, st = {
  key: 1,
  class: "agent-tab-body",
  "data-agent-tab-body": "transcript",
  "data-agent-only-transcript": ""
}, ot = {
  key: 0,
  class: "agent-subagent-brief"
}, lt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, it = ["data-agent-tab-body"], rt = ["data-agent-delegated", "onClick"], dt = { class: "agent-task-number" }, ut = { class: "agent-task-title" }, ct = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, gt = 36e5, vt = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(r, { emit: H }) {
    const y = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, E = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), P = ["started", "testing", "blocked", "open", "completed", "cancelled"], a = r, M = H, q = Re(), L = i(() => {
      var o;
      const t = ((o = a.facts) == null ? void 0 : o.profile) || y[a.row.role] || a.row.role;
      return t.slice(0, 1).toUpperCase() + t.slice(1);
    }), p = i(() => {
      var t;
      return ((t = a.facts) == null ? void 0 : t.tasks) ?? [];
    }), W = i(() => {
      var t, o;
      return [a.row.program, (t = a.facts) == null ? void 0 : t.model, (o = a.facts) == null ? void 0 : o.effort, a.row.role === "worker" ? `worker ${a.row.id}` : E.has(a.row.role) ? a.row.role : ""].filter(Boolean).join(" · ");
    }), m = i(() => xe(a.row.process_started_at || a.row.created_at, q.value)), ne = /* @__PURE__ */ new Set(["open", "started", "testing"]), R = i(() => !!a.row.ended_at && a.row.role === "worker" && p.value.some((t) => ne.has(t.state))), se = i(() => {
      var t;
      return a.waitReason || R.value ? "waiting" : a.row.ended_at ? "closed" : ((t = a.facts) == null ? void 0 : t.state) || "running";
    }), Q = i(() => {
      var o, A, S;
      const t = [];
      return ((o = a.facts) == null ? void 0 : o.context_percent) !== null && ((A = a.facts) == null ? void 0 : A.context_percent) !== void 0 && t.push(`Context ${a.facts.context_percent}%`), (S = a.facts) != null && S.cost_dollars && t.push(`$${a.facts.cost_dollars.toFixed(2)}`), t.join(" · ");
    }), z = i(() => {
      var t;
      return ((t = a.progress) == null ? void 0 : t.completed_count) ?? p.value.filter((o) => o.state === "completed").length;
    }), w = i(() => {
      var t;
      return ((t = a.progress) == null ? void 0 : t.task_count) ?? p.value.length;
    }), x = i(() => `${z.value} of ${w.value} ${w.value === 1 ? "task" : "tasks"}`), X = i(() => {
      var O;
      const t = Date.parse(((O = a.progress) == null ? void 0 : O.started_at) || a.row.created_at), o = a.progress ? a.progress.finished_at : a.row.ended_at, S = ((o ? Date.parse(o) : q.value) - t) / gt;
      return a.row.role === "worker" && S > 0 && z.value ? `${Math.round(z.value / S)}/h` : "";
    }), k = i(() => P.map((t) => ({ state: t, label: t.slice(0, 1).toUpperCase() + t.slice(1), tasks: p.value.filter((o) => o.state === t) })).filter((t) => t.tasks.length)), D = /* @__PURE__ */ new Set(["completed"]), B = _({}), K = (t) => !(B.value[t] ?? D.has(t)), oe = (t) => B.value = { ...B.value, [t]: K(t) }, F = Se(), U = _(F.tabs[0]), le = i(() => a.row.role === "subagent"), G = _(!1), Y = _(""), V = _(""), Z = i(() => a.row.role !== "main" && (!a.row.ended_at || R.value || a.waitReason));
    async function ee() {
      if (!Z.value) return;
      const t = await F.read(`usage tool --agent ${a.row.id}`);
      Y.value = t.ok ? t.value.tool : "", V.value = t.ok ? t.value.note : "";
    }
    const b = F.follow(["hook_call.*", "process_part.*"], ee);
    return ye(() => b == null ? void 0 : b()), ee(), (t, o) => {
      var A, S, O, te;
      return d(), u("div", {
        class: ce(["agent-card", { open: r.open }]),
        "data-agent-open": r.row.id,
        "aria-expanded": r.open,
        title: r.row.session,
        onClick: o[4] || (o[4] = (T) => M("toggle"))
      }, [
        g("span", ze, [
          g("span", {
            class: "agent-dot",
            "data-state": se.value
          }, null, 8, Ke),
          g("span", Ge, f(L.value), 1),
          g("span", Je, f(((A = r.facts) == null ? void 0 : A.given_name) || r.row.id), 1),
          r.row.ended_at && !R.value ? (d(), de(l(De), {
            key: 0,
            class: "agent-time",
            at: r.row.ended_at
          }, null, 8, ["at"])) : (d(), u("span", Qe, f(m.value), 1)),
          v(l(Oe), {
            class: ce(["agent-chevron", { opened: r.open }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        g("span", Xe, [
          g("span", Ye, f(W.value), 1),
          w.value ? (d(), u(J, { key: 0 }, [
            X.value ? (d(), u("span", Ze, f(X.value), 1)) : $("", !0),
            g("span", et, f(x.value), 1)
          ], 64)) : $("", !0)
        ]),
        Z.value ? (d(), u("span", tt, [
          r.waitReason ? (d(), u("button", {
            key: 0,
            type: "button",
            class: "agent-waiting",
            "data-agent-waiting": "",
            title: "Open the process queue",
            onClick: o[0] || (o[0] = me((T) => l(ge)("test_queue:0"), ["stop"]))
          }, "Waiting: " + f(r.waitReason), 1)) : R.value ? (d(), u("span", at, "Waiting")) : (d(), de(l(Ne), {
            key: 2,
            text: Y.value,
            idle: V.value || "thinking"
          }, null, 8, ["text", "idle"]))
        ])) : $("", !0),
        r.open ? (d(), u("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: o[3] || (o[3] = me(() => {
          }, ["stop"]))
        }, [
          Q.value ? (d(), u("span", nt, f(Q.value), 1)) : $("", !0),
          le.value ? (d(), u("div", st, [
            (S = r.facts) != null && S.instruction ? (d(), u("div", ot, [
              v(l(he), {
                label: "Instruction",
                open: G.value,
                "data-agent-section": "instruction",
                onToggle: o[1] || (o[1] = (T) => G.value = !G.value)
              }, {
                default: C(() => [
                  g("div", lt, f(r.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : $("", !0),
            v(_e, {
              line: `agent transcript ${r.row.id}`
            }, null, 8, ["line"])
          ])) : (d(), u(J, { key: 2 }, [
            v(l(Ee), {
              class: "agent-tabs",
              active: U.value,
              answer: { tasks: p.value.length },
              onChoose: o[2] || (o[2] = (T) => U.value = T)
            }, null, 8, ["active", "answer"]),
            g("div", {
              class: "agent-tab-body",
              "data-agent-tab-body": (O = U.value) == null ? void 0 : O.key
            }, [
              v(l(Me), {
                value: (te = U.value) == null ? void 0 : te.key
              }, {
                tasks: C(() => {
                  var T;
                  return [
                    (d(!0), u(J, null, we(k.value, (h) => (d(), de(l(he), {
                      key: h.state,
                      label: h.label,
                      count: h.tasks.length,
                      open: K(h.state),
                      "data-agent-section": h.state,
                      onToggle: (I) => oe(h.state)
                    }, {
                      default: C(() => [
                        (d(!0), u(J, null, we(h.tasks, (I) => (d(), u("button", {
                          key: I.id,
                          type: "button",
                          class: "agent-task",
                          "data-agent-delegated": I.id,
                          onClick: (ie) => l(ge)(`tasks:${I.id}`)
                        }, [
                          v(l(qe), {
                            status: I.state
                          }, null, 8, ["status"]),
                          g("span", dt, f(I.id), 1),
                          g("span", ut, f(I.title), 1)
                        ], 8, rt))), 128))
                      ]),
                      _: 2
                    }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                    (T = r.facts) != null && T.instruction ? (d(), u(J, { key: 0 }, [
                      o[5] || (o[5] = g("p", { class: "agent-label" }, "Instruction", -1)),
                      g("div", ct, f(r.facts.instruction), 1)
                    ], 64)) : $("", !0)
                  ];
                }),
                transcript: C(() => [
                  v(_e, {
                    line: `agent transcript ${r.row.id}`
                  }, null, 8, ["line"])
                ]),
                "file-feed": C(() => [
                  v(He, {
                    agent: r.row.id
                  }, null, 8, ["agent"])
                ]),
                _: 1
              }, 8, ["value"])
            ], 8, it)
          ], 64))
        ])) : $("", !0)
      ], 10, Pe);
    };
  }
}, pt = /* @__PURE__ */ ve(vt, [["__scopeId", "data-v-02ad9d94"]]), ft = { class: "agents-bar" }, mt = {
  class: "agents-queue-count",
  "data-agents-queue-count": ""
}, wt = ["data-agent-row", "onMouseenter", "onMouseleave"], kt = {
  key: 0,
  class: "agent-leave",
  "data-agent-leave": "",
  "aria-hidden": "true"
}, ue = 1e4, ht = 250, _t = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) }, only: { type: Function, default: () => !0 } },
  setup(r) {
    const H = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], y = r, { rows: E, failure: P, loaded: a, more: M, older: q } = N(y.line, ["agent.*"], { incremental: !0 }), { rows: L } = N("agent running", ["agent.*"]), { rows: p } = N("usage agents --closed", ["agent.*", "task.*"]), { rows: W } = N("worker waits", ["agent.*", "task.*", "proof.*", "worker_worktree.*"]), { rows: m } = N("worker progress", ["task.*", "worker_worktree.*"]), ne = (e) => m.value.find((n) => n.agent_id === e.id) ?? null, R = (e) => {
      var n;
      return ((n = W.value.find((s) => s.agent_id === e.id)) == null ? void 0 : n.reason) ?? "";
    }, { rows: se } = N("proof list --limit 50", ["proof.*"]), Q = /* @__PURE__ */ new Set(["queued", "running"]), z = i(() => se.value.filter((e) => Q.has(e.state)).length), w = _("running"), x = _(""), X = _(Date.now()), k = _(/* @__PURE__ */ new Map()), D = _(/* @__PURE__ */ new Set());
    let B = Date.now(), K = /* @__PURE__ */ new Map();
    const oe = setInterval(() => {
      const e = Date.now(), n = new Map(k.value);
      for (const [s, c] of n)
        D.value.has(s) ? n.set(s, { ...c, leavesAt: c.leavesAt + (e - B) }) : e >= c.leavesAt && n.delete(s);
      B = e, X.value = e, (n.size !== k.value.size || [...n].some(([s, c]) => c !== k.value.get(s))) && (k.value = n);
    }, ht);
    ye(() => clearInterval(oe)), ke(L, (e) => {
      const n = new Set(e.map((c) => c.id)), s = new Map(k.value);
      for (const [c, re] of K)
        !n.has(c) && !s.has(c) && !V(re) && s.set(c, { row: { ...re, ended_at: re.ended_at ?? (/* @__PURE__ */ new Date()).toISOString() }, leavesAt: Date.now() + ue });
      for (const c of n) s.delete(c);
      K = new Map(e.map((c) => [c.id, c])), k.value = s;
    });
    const F = (e) => k.value.get(e.id) ?? null, U = (e) => D.value = /* @__PURE__ */ new Set([...D.value, e.id]), le = (e) => D.value = new Set([...D.value].filter((n) => n !== e.id)), G = (e) => ({ animationDuration: `${ue}ms`, animationDelay: `${Math.min(0, F(e).leavesAt - ue - Date.now())}ms` }), Y = /* @__PURE__ */ new Set(["open", "started", "testing"]), V = (e) => {
      var n;
      return e.role === "worker" && (!!R(e) || (((n = b(e)) == null ? void 0 : n.tasks) ?? []).some((s) => Y.has(s.state)));
    }, Z = (e) => !e.ended_at || V(e), ee = (e) => w.value === "all" || w.value === "running" === Z(e) || w.value === "running" && k.value.has(e.id), b = (e) => p.value.find((n) => n.id === e.id) ?? null, t = (e) => {
      var n, s;
      return `${e.id} ${e.session} ${e.program} ${e.role} ${((n = b(e)) == null ? void 0 : n.profile) ?? ""} ${((s = b(e)) == null ? void 0 : s.given_name) ?? ""}`.toLowerCase().includes(x.value.trim().toLowerCase());
    }, o = i(() => E.value.filter((e) => e.ended_at && V(e) && !k.value.has(e.id))), A = i(() => w.value === "running" ? [...L.value, ...o.value, ...[...k.value.values()].map((e) => e.row)] : E.value), S = i(() => A.value.filter((e) => y.only(e) && ee(e) && t(e))), O = Se().option("order"), te = (e) => {
      var n, s;
      return e.ended_at ? "stopped" : ((n = b(e)) == null ? void 0 : n.state) === "blocked" ? "waiting" : ((s = b(e)) == null ? void 0 : s.state) === "waiting" || e.paused_at ? "idle" : "working";
    }, T = (e) => ({ key: String(e.id), kind: e.role, n: e.id, time: Date.parse(e.updated_at ?? e.created_at ?? 0) / 1e3 || 0, card: { state: te(e) }, row: e }), h = i(() => Le(S.value.map(T), O.value ?? "number").map((e) => e.row)), I = i(() => !!x.value.trim()), ie = i(() => y.texts[w.value] ?? { title: y.empty, hint: "" }), j = _(null), ae = i(() => h.value.find((e) => e.id === j.value) ?? null), pe = i(() => ae.value ? [ae.value] : h.value), fe = i(() => h.value.length - pe.value.length), $e = (e) => j.value = j.value === e.id ? null : e.id;
    return ke(x, (e) => e.trim() && (j.value = null)), (e, n) => (d(), u("div", {
      class: ce(["agents", { focused: ae.value }])
    }, [
      g("div", ft, [
        v(l(We), {
          modelValue: x.value,
          "onUpdate:modelValue": n[2] || (n[2] = (s) => x.value = s),
          class: "agents-search",
          "data-agents-search": ""
        }, {
          default: C(() => [
            v(l(Be), {
              options: H,
              value: w.value,
              onPick: n[0] || (n[0] = (s) => w.value = s)
            }, null, 8, ["value"]),
            v(l(Fe), {
              small: "",
              bordered: "",
              title: "Open the process queue",
              "data-agents-queue": "",
              onClick: n[1] || (n[1] = (s) => l(ge)("test_queue:0"))
            }, {
              default: C(() => [
                n[4] || (n[4] = Ce("Process queue ", -1)),
                g("span", mt, f(z.value), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      v(l(be), {
        rows: pe.value,
        failure: l(P),
        loaded: l(a),
        more: l(M) && w.value !== "running",
        older: l(q),
        empty: ie.value.title,
        hint: ie.value.hint,
        searching: I.value
      }, {
        default: C(({ row: s }) => [
          g("div", {
            class: "agent-row",
            "data-agent-row": s.id,
            onMouseenter: (c) => U(s),
            onMouseleave: (c) => le(s)
          }, [
            v(pt, {
              row: s,
              facts: b(s),
              progress: ne(s),
              "wait-reason": R(s),
              open: s.id === j.value,
              onToggle: (c) => $e(s)
            }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"]),
            F(s) ? (d(), u("span", kt, [
              g("i", {
                style: Te(G(s))
              }, null, 4)
            ])) : $("", !0)
          ], 40, wt)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty", "hint", "searching"]),
      ae.value && fe.value ? (d(), u("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: n[3] || (n[3] = (s) => j.value = null)
      }, f(fe.value) + " more", 1)) : $("", !0)
    ], 2));
  }
}, $t = /* @__PURE__ */ ve(_t, [["__scopeId", "data-v-884d92e5"]]);
export {
  $t as A
};
