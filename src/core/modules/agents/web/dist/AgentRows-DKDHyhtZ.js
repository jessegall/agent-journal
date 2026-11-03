/* @code-commandments-generated */
import { computed as i, openBlock as d, createElementBlock as r, unref as o, createCommentVNode as T, createVNode as p, withCtx as I, ref as _, onUnmounted as ke, normalizeClass as ue, createElementVNode as v, toDisplayString as f, createBlock as ie, Fragment as P, withModifiers as ve, renderList as pe, watch as fe, createTextVNode as ye, normalizeStyle as be } from "vue";
import { useRows as G, AutoScrollPane as Se, RowList as he, DiffCard as $e, useNow as Ce, age as Te, useWindow as _e, TimeAgo as Ie, Icon as Ae, peekRef as re, RunningCommand as xe, FoldGroup as me, InnerTabs as De, SwitchCase as Ne, TaskStatusIcon as Oe, ordered as Re, SearchBar as Ee, Segmented as Me, Btn as qe } from "@journal/window-kit";
import { _ as ce, T as we } from "./TranscriptRows-DhYd90lu.js";
const Le = { class: "file-feed" }, We = 5, Be = {
  __name: "AgentFileEdits",
  props: { agent: { type: Number, required: !0 } },
  setup(u) {
    const W = u, { rows: y, failure: E, loaded: B, more: a, older: M } = G(`file-edit list --agent ${W.agent}`, ["file_edit.create"], { incremental: !0 }), q = i(() => y.value.map((g) => ({ ...g, lines: JSON.parse(g.rows || "[]") })).reverse()), L = i(() => {
      var g;
      return ((g = y.value[0]) == null ? void 0 : g.id) ?? 0;
    });
    return (g, O) => (d(), r("div", Le, [
      o(a) && o(y).length ? (d(), r("button", {
        key: 0,
        type: "button",
        class: "file-feed-older",
        "data-file-feed-older": "",
        onClick: O[0] || (O[0] = (...w) => o(M) && o(M)(...w))
      }, "Show older edits")) : T("", !0),
      p(o(Se), { "row-count": L.value }, {
        default: I(() => [
          p(o(he), {
            rows: q.value,
            failure: o(E),
            loaded: o(B),
            empty: "No edits by this agent yet",
            hint: "The files it changes show here as it works."
          }, {
            default: I(({ row: w }) => [
              p(o($e), {
                flush: "",
                lines: We,
                path: w.path,
                kind: w.edit_type,
                added: w.added,
                removed: w.removed,
                at: w.created_at,
                rows: w.lines
              }, null, 8, ["path", "kind", "added", "removed", "at", "rows"])
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ]),
        _: 1
      }, 8, ["row-count"])
    ]));
  }
}, Fe = /* @__PURE__ */ ce(Be, [["__scopeId", "data-v-69712d4d"]]), Ue = ["data-agent-open", "aria-expanded", "title"], Ve = { class: "agent-head" }, He = ["data-state"], je = {
  class: "agent-title",
  "data-agent-title": ""
}, ze = {
  class: "agent-name",
  "data-agent-name": ""
}, Ke = {
  key: 1,
  class: "agent-time"
}, Pe = { class: "agent-line" }, Ge = {
  class: "agent-identity",
  "data-agent-identity": ""
}, Je = {
  key: 0,
  class: "agent-tasks",
  "data-agent-pace": ""
}, Qe = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, Xe = {
  key: 0,
  class: "agent-command",
  "data-agent-command": ""
}, Ye = {
  key: 0,
  class: "agent-stopped",
  "data-agent-stopped": ""
}, Ze = {
  key: 0,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, et = {
  key: 1,
  class: "agent-tab-body",
  "data-agent-tab-body": "transcript",
  "data-agent-only-transcript": ""
}, tt = {
  key: 0,
  class: "agent-subagent-brief"
}, at = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, nt = ["data-agent-tab-body"], st = ["data-agent-delegated", "onClick"], ot = { class: "agent-task-number" }, lt = { class: "agent-task-title" }, it = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, dt = 36e5, ut = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, open: Boolean },
  emits: ["toggle"],
  setup(u, { emit: W }) {
    const y = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, E = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), B = ["started", "testing", "blocked", "open", "completed", "cancelled"], a = u, M = W, q = Ce(), L = i(() => {
      var l;
      const t = ((l = a.facts) == null ? void 0 : l.profile) || y[a.row.role] || a.row.role;
      return t.slice(0, 1).toUpperCase() + t.slice(1);
    }), g = i(() => {
      var t;
      return ((t = a.facts) == null ? void 0 : t.tasks) ?? [];
    }), O = i(() => !a.row.ended_at && g.value.some((t) => t.state === "testing") && !g.value.some((t) => t.state === "started")), w = i(() => {
      var t, l;
      return [a.row.program, (t = a.facts) == null ? void 0 : t.model, (l = a.facts) == null ? void 0 : l.effort, a.row.role === "worker" ? `worker ${a.row.id}` : E.has(a.row.role) ? a.row.role : ""].filter(Boolean).join(" · ");
    }), te = i(() => Te(a.row.process_started_at || a.row.created_at, q.value)), b = /* @__PURE__ */ new Set(["open", "started", "testing"]), S = i(() => !!a.row.ended_at && a.row.role === "worker" && g.value.some((t) => b.has(t.state))), ae = i(() => {
      var t;
      return S.value ? "waiting" : a.row.ended_at ? "closed" : O.value ? "waiting" : ((t = a.facts) == null ? void 0 : t.state) || "running";
    }), m = i(() => {
      var l, k, R;
      const t = [];
      return ((l = a.facts) == null ? void 0 : l.context_percent) !== null && ((k = a.facts) == null ? void 0 : k.context_percent) !== void 0 && t.push(`Context ${a.facts.context_percent}%`), (R = a.facts) != null && R.cost_dollars && t.push(`$${a.facts.cost_dollars.toFixed(2)}`), t.join(" · ");
    }), A = i(() => g.value.filter((t) => t.state === "completed").length), J = i(() => `${A.value} of ${g.value.length} ${g.value.length === 1 ? "task" : "tasks"}`), F = i(() => {
      const t = Date.parse(a.row.process_started_at || a.row.created_at), k = ((a.row.ended_at ? Date.parse(a.row.ended_at) : q.value) - t) / dt;
      return a.row.role === "worker" && k > 0 && A.value ? `${Math.round(A.value / k)}/h` : "";
    }), ne = i(() => B.map((t) => ({ state: t, label: t.slice(0, 1).toUpperCase() + t.slice(1), tasks: g.value.filter((l) => l.state === t) })).filter((t) => t.tasks.length)), Q = /* @__PURE__ */ new Set(["completed"]), U = _({}), X = (t) => !(U.value[t] ?? Q.has(t)), se = (t) => U.value = { ...U.value, [t]: X(t) }, V = _e(), N = _(V.tabs[0]), oe = i(() => a.row.role === "subagent"), H = _(!1), x = _(""), Y = _(""), j = _(""), Z = i(() => a.row.role !== "main" && (!a.row.ended_at || S.value));
    async function ee() {
      if (!Z.value) return;
      const t = await V.read(`usage tool --agent ${a.row.id}`);
      x.value = t.ok ? t.value.tool : "", Y.value = t.ok ? t.value.note : "", j.value = t.ok ? t.value.wait_target ?? "" : "";
    }
    const z = V.follow(["hook_call.*", "process_part.*"], ee);
    return ke(() => z == null ? void 0 : z()), ee(), (t, l) => {
      var k, R, K, D;
      return d(), r("div", {
        class: ue(["agent-card", { open: u.open }]),
        "data-agent-open": u.row.id,
        "aria-expanded": u.open,
        title: u.row.session,
        onClick: l[4] || (l[4] = (h) => M("toggle"))
      }, [
        v("span", Ve, [
          v("span", {
            class: "agent-dot",
            "data-state": ae.value
          }, null, 8, He),
          v("span", je, f(L.value), 1),
          v("span", ze, f(((k = u.facts) == null ? void 0 : k.given_name) || u.row.id), 1),
          u.row.ended_at && !S.value ? (d(), ie(o(Ie), {
            key: 0,
            class: "agent-time",
            at: u.row.ended_at
          }, null, 8, ["at"])) : (d(), r("span", Ke, f(te.value), 1)),
          p(o(Ae), {
            class: ue(["agent-chevron", { opened: u.open }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        v("span", Pe, [
          v("span", Ge, f(w.value), 1),
          g.value.length ? (d(), r(P, { key: 0 }, [
            F.value ? (d(), r("span", Je, f(F.value), 1)) : T("", !0),
            v("span", Qe, f(J.value), 1)
          ], 64)) : T("", !0)
        ]),
        Z.value ? (d(), r("span", Xe, [
          S.value ? (d(), r("span", Ye, f(j.value ? `Waiting: ${j.value}` : "Waiting"), 1)) : O.value ? (d(), r("button", {
            key: 1,
            type: "button",
            class: "agent-waiting",
            "data-agent-waiting": "",
            title: "Open the test queue",
            onClick: l[0] || (l[0] = ve((h) => o(re)("test_queue:0"), ["stop"]))
          }, "Waiting: tests")) : (d(), ie(o(xe), {
            key: 2,
            text: x.value,
            idle: Y.value || "thinking"
          }, null, 8, ["text", "idle"]))
        ])) : T("", !0),
        u.open ? (d(), r("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: l[3] || (l[3] = ve(() => {
          }, ["stop"]))
        }, [
          m.value ? (d(), r("span", Ze, f(m.value), 1)) : T("", !0),
          oe.value ? (d(), r("div", et, [
            (R = u.facts) != null && R.instruction ? (d(), r("div", tt, [
              p(o(me), {
                label: "Instruction",
                open: H.value,
                "data-agent-section": "instruction",
                onToggle: l[1] || (l[1] = (h) => H.value = !H.value)
              }, {
                default: I(() => [
                  v("div", at, f(u.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : T("", !0),
            p(we, {
              line: `agent transcript ${u.row.id}`
            }, null, 8, ["line"])
          ])) : (d(), r(P, { key: 2 }, [
            p(o(De), {
              class: "agent-tabs",
              active: N.value,
              answer: { tasks: g.value.length },
              onChoose: l[2] || (l[2] = (h) => N.value = h)
            }, null, 8, ["active", "answer"]),
            v("div", {
              class: "agent-tab-body",
              "data-agent-tab-body": (K = N.value) == null ? void 0 : K.key
            }, [
              p(o(Ne), {
                value: (D = N.value) == null ? void 0 : D.key
              }, {
                tasks: I(() => {
                  var h;
                  return [
                    (d(!0), r(P, null, pe(ne.value, ($) => (d(), ie(o(me), {
                      key: $.state,
                      label: $.label,
                      count: $.tasks.length,
                      open: X($.state),
                      "data-agent-section": $.state,
                      onToggle: (C) => se($.state)
                    }, {
                      default: I(() => [
                        (d(!0), r(P, null, pe($.tasks, (C) => (d(), r("button", {
                          key: C.id,
                          type: "button",
                          class: "agent-task",
                          "data-agent-delegated": C.id,
                          onClick: (ge) => o(re)(`tasks:${C.id}`)
                        }, [
                          p(o(Oe), {
                            status: C.state
                          }, null, 8, ["status"]),
                          v("span", ot, f(C.id), 1),
                          v("span", lt, f(C.title), 1)
                        ], 8, st))), 128))
                      ]),
                      _: 2
                    }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                    (h = u.facts) != null && h.instruction ? (d(), r(P, { key: 0 }, [
                      l[5] || (l[5] = v("p", { class: "agent-label" }, "Instruction", -1)),
                      v("div", it, f(u.facts.instruction), 1)
                    ], 64)) : T("", !0)
                  ];
                }),
                transcript: I(() => [
                  p(we, {
                    line: `agent transcript ${u.row.id}`
                  }, null, 8, ["line"])
                ]),
                "file-feed": I(() => [
                  p(Fe, {
                    agent: u.row.id
                  }, null, 8, ["agent"])
                ]),
                _: 1
              }, 8, ["value"])
            ], 8, nt)
          ], 64))
        ])) : T("", !0)
      ], 10, Ue);
    };
  }
}, rt = /* @__PURE__ */ ce(ut, [["__scopeId", "data-v-62a0ddf0"]]), ct = { class: "agents-bar" }, gt = {
  class: "agents-queue-count",
  "data-agents-queue-count": ""
}, vt = ["data-agent-row", "onMouseenter", "onMouseleave"], pt = {
  key: 0,
  class: "agent-leave",
  "data-agent-leave": "",
  "aria-hidden": "true"
}, de = 1e4, ft = 250, mt = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) }, only: { type: Function, default: () => !0 } },
  setup(u) {
    const W = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], y = u, { rows: E, failure: B, loaded: a, more: M, older: q } = G(y.line, ["agent.*"], { incremental: !0 }), { rows: L } = G("agent running", ["agent.*"]), { rows: g } = G("usage agents --closed", ["agent.*", "task.*"]), { rows: O } = G("proof list --limit 50", ["proof.*"]), w = /* @__PURE__ */ new Set(["queued", "running"]), te = i(() => O.value.filter((e) => w.has(e.state)).length), b = _("running"), S = _(""), ae = _(Date.now()), m = _(/* @__PURE__ */ new Map()), A = _(/* @__PURE__ */ new Set());
    let J = Date.now(), F = /* @__PURE__ */ new Map();
    const ne = setInterval(() => {
      const e = Date.now(), s = new Map(m.value);
      for (const [n, c] of s)
        A.value.has(n) ? s.set(n, { ...c, leavesAt: c.leavesAt + (e - J) }) : e >= c.leavesAt && s.delete(n);
      J = e, ae.value = e, (s.size !== m.value.size || [...s].some(([n, c]) => c !== m.value.get(n))) && (m.value = s);
    }, ft);
    ke(() => clearInterval(ne)), fe(L, (e) => {
      const s = new Set(e.map((c) => c.id)), n = new Map(m.value);
      for (const [c, le] of F)
        !s.has(c) && !n.has(c) && !N(le) && n.set(c, { row: { ...le, ended_at: le.ended_at ?? (/* @__PURE__ */ new Date()).toISOString() }, leavesAt: Date.now() + de });
      for (const c of s) n.delete(c);
      F = new Map(e.map((c) => [c.id, c])), m.value = n;
    });
    const Q = (e) => m.value.get(e.id) ?? null, U = (e) => A.value = /* @__PURE__ */ new Set([...A.value, e.id]), X = (e) => A.value = new Set([...A.value].filter((s) => s !== e.id)), se = (e) => ({ animationDuration: `${de}ms`, animationDelay: `${Math.min(0, Q(e).leavesAt - de - Date.now())}ms` }), V = /* @__PURE__ */ new Set(["open", "started", "testing"]), N = (e) => {
      var s;
      return e.role === "worker" && (((s = x(e)) == null ? void 0 : s.tasks) ?? []).some((n) => V.has(n.state));
    }, oe = (e) => !e.ended_at || N(e), H = (e) => b.value === "all" || b.value === "running" === oe(e) || b.value === "running" && m.value.has(e.id), x = (e) => g.value.find((s) => s.id === e.id) ?? null, Y = (e) => {
      var s, n;
      return `${e.id} ${e.session} ${e.program} ${e.role} ${((s = x(e)) == null ? void 0 : s.profile) ?? ""} ${((n = x(e)) == null ? void 0 : n.given_name) ?? ""}`.toLowerCase().includes(S.value.trim().toLowerCase());
    }, j = i(() => E.value.filter((e) => e.ended_at && N(e) && !m.value.has(e.id))), Z = i(() => b.value === "running" ? [...L.value, ...j.value, ...[...m.value.values()].map((e) => e.row)] : E.value), ee = i(() => Z.value.filter((e) => y.only(e) && H(e) && Y(e))), z = _e().option("order"), t = (e) => {
      var s, n;
      return e.ended_at ? "stopped" : ((s = x(e)) == null ? void 0 : s.state) === "blocked" ? "waiting" : ((n = x(e)) == null ? void 0 : n.state) === "waiting" || e.paused_at ? "idle" : "working";
    }, l = (e) => ({ key: String(e.id), kind: e.role, n: e.id, time: Date.parse(e.updated_at ?? e.created_at ?? 0) / 1e3 || 0, card: { state: t(e) }, row: e }), k = i(() => Re(ee.value.map(l), z.value ?? "number").map((e) => e.row)), R = i(() => !!S.value.trim()), K = i(() => y.texts[b.value] ?? { title: y.empty, hint: "" }), D = _(null), h = i(() => k.value.find((e) => e.id === D.value) ?? null), $ = i(() => h.value ? [h.value] : k.value), C = i(() => k.value.length - $.value.length), ge = (e) => D.value = D.value === e.id ? null : e.id;
    return fe(S, (e) => e.trim() && (D.value = null)), (e, s) => (d(), r("div", {
      class: ue(["agents", { focused: h.value }])
    }, [
      v("div", ct, [
        p(o(Ee), {
          modelValue: S.value,
          "onUpdate:modelValue": s[2] || (s[2] = (n) => S.value = n),
          class: "agents-search",
          "data-agents-search": ""
        }, {
          default: I(() => [
            p(o(Me), {
              options: W,
              value: b.value,
              onPick: s[0] || (s[0] = (n) => b.value = n)
            }, null, 8, ["value"]),
            p(o(qe), {
              small: "",
              bordered: "",
              title: "Open the test queue",
              "data-agents-queue": "",
              onClick: s[1] || (s[1] = (n) => o(re)("test_queue:0"))
            }, {
              default: I(() => [
                s[4] || (s[4] = ye("Test queue ", -1)),
                v("span", gt, f(te.value), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      p(o(he), {
        rows: $.value,
        failure: o(B),
        loaded: o(a),
        more: o(M) && b.value !== "running",
        older: o(q),
        empty: K.value.title,
        hint: K.value.hint,
        searching: R.value
      }, {
        default: I(({ row: n }) => [
          v("div", {
            class: "agent-row",
            "data-agent-row": n.id,
            onMouseenter: (c) => U(n),
            onMouseleave: (c) => X(n)
          }, [
            p(rt, {
              row: n,
              facts: x(n),
              open: n.id === D.value,
              onToggle: (c) => ge(n)
            }, null, 8, ["row", "facts", "open", "onToggle"]),
            Q(n) ? (d(), r("span", pt, [
              v("i", {
                style: be(se(n))
              }, null, 4)
            ])) : T("", !0)
          ], 40, vt)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty", "hint", "searching"]),
      h.value && C.value ? (d(), r("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: s[3] || (s[3] = (n) => D.value = null)
      }, f(C.value) + " more", 1)) : T("", !0)
    ], 2));
  }
}, _t = /* @__PURE__ */ ce(mt, [["__scopeId", "data-v-2fa988e8"]]);
export {
  _t as A
};
