/* @code-commandments-generated */
import { computed as l, openBlock as i, createElementBlock as r, unref as o, createCommentVNode as T, createVNode as p, withCtx as I, ref as _, onUnmounted as we, normalizeClass as de, createElementVNode as v, toDisplayString as w, createBlock as le, Fragment as z, withModifiers as ge, renderList as ve, watch as pe, createTextVNode as ye, normalizeStyle as be } from "vue";
import { useRows as K, AutoScrollPane as Se, RowList as ke, DiffCard as $e, useNow as Ce, age as Te, useWindow as he, TimeAgo as Ie, Icon as Ae, peekRef as ue, RunningCommand as xe, FoldGroup as me, InnerTabs as De, SwitchCase as Ne, TaskStatusIcon as Oe, ordered as Re, SearchBar as Ee, Segmented as Me, Btn as qe } from "@journal/window-kit";
import { _ as re, T as fe } from "./TranscriptRows-DhYd90lu.js";
const Le = { class: "file-feed" }, We = 5, Be = {
  __name: "AgentFileEdits",
  props: { agent: { type: Number, required: !0 } },
  setup(u) {
    const L = u, { rows: y, failure: R, loaded: W, more: a, older: E } = K(`file-edit list --agent ${L.agent}`, ["file_edit.create"], { incremental: !0 }), M = l(() => y.value.map((g) => ({ ...g, lines: JSON.parse(g.rows || "[]") })).reverse()), q = l(() => {
      var g;
      return ((g = y.value[0]) == null ? void 0 : g.id) ?? 0;
    });
    return (g, N) => (i(), r("div", Le, [
      o(a) && o(y).length ? (i(), r("button", {
        key: 0,
        type: "button",
        class: "file-feed-older",
        "data-file-feed-older": "",
        onClick: N[0] || (N[0] = (...k) => o(E) && o(E)(...k))
      }, "Show older edits")) : T("", !0),
      p(o(Se), { "row-count": q.value }, {
        default: I(() => [
          p(o(ke), {
            rows: M.value,
            failure: o(R),
            loaded: o(W),
            empty: "No edits by this agent yet",
            hint: "The files it changes show here as it works."
          }, {
            default: I(({ row: k }) => [
              p(o($e), {
                flush: "",
                lines: We,
                path: k.path,
                kind: k.edit_type,
                added: k.added,
                removed: k.removed,
                at: k.created_at,
                rows: k.lines
              }, null, 8, ["path", "kind", "added", "removed", "at", "rows"])
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ]),
        _: 1
      }, 8, ["row-count"])
    ]));
  }
}, Fe = /* @__PURE__ */ re(Be, [["__scopeId", "data-v-69712d4d"]]), Ue = ["data-agent-open", "aria-expanded", "title"], Ve = { class: "agent-head" }, He = ["data-state"], je = {
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
  setup(u, { emit: L }) {
    const y = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, R = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), W = ["started", "testing", "blocked", "open", "completed", "cancelled"], a = u, E = L, M = Ce(), q = l(() => {
      var d;
      const t = ((d = a.facts) == null ? void 0 : d.profile) || y[a.row.role] || a.row.role;
      return t.slice(0, 1).toUpperCase() + t.slice(1);
    }), g = l(() => {
      var t;
      return ((t = a.facts) == null ? void 0 : t.tasks) ?? [];
    }), N = l(() => !a.row.ended_at && g.value.some((t) => t.state === "testing") && !g.value.some((t) => t.state === "started")), k = l(() => {
      var t;
      return [a.row.program, (t = a.facts) == null ? void 0 : t.model, a.row.role === "worker" ? `worker ${a.row.id}` : R.has(a.row.role) ? a.row.role : ""].filter(Boolean).join(" · ");
    }), ee = l(() => Te(a.row.process_started_at || a.row.created_at, M.value)), b = /* @__PURE__ */ new Set(["open", "started", "testing"]), S = l(() => !!a.row.ended_at && a.row.role === "worker" && g.value.some((t) => b.has(t.state))), te = l(() => {
      var t;
      return S.value ? "waiting" : a.row.ended_at ? "closed" : N.value ? "waiting" : ((t = a.facts) == null ? void 0 : t.state) || "running";
    }), f = l(() => {
      var d, $, D;
      const t = [];
      return ((d = a.facts) == null ? void 0 : d.context_percent) !== null && (($ = a.facts) == null ? void 0 : $.context_percent) !== void 0 && t.push(`Context ${a.facts.context_percent}%`), (D = a.facts) != null && D.cost_dollars && t.push(`$${a.facts.cost_dollars.toFixed(2)}`), t.join(" · ");
    }), A = l(() => g.value.filter((t) => t.state === "completed").length), P = l(() => `${A.value} of ${g.value.length} ${g.value.length === 1 ? "task" : "tasks"}`), B = l(() => {
      const t = Date.parse(a.row.process_started_at || a.row.created_at), $ = ((a.row.ended_at ? Date.parse(a.row.ended_at) : M.value) - t) / dt;
      return a.row.role === "worker" && $ > 0 && A.value ? `${Math.round(A.value / $)}/h` : "";
    }), ae = l(() => W.map((t) => ({ state: t, label: t.slice(0, 1).toUpperCase() + t.slice(1), tasks: g.value.filter((d) => d.state === t) })).filter((t) => t.tasks.length)), G = /* @__PURE__ */ new Set(["completed"]), F = _({}), J = (t) => !(F.value[t] ?? G.has(t)), ne = (t) => F.value = { ...F.value, [t]: J(t) }, U = he(), O = _(U.tabs[0]), se = l(() => a.row.role === "subagent"), V = _(!1), x = _(""), Q = _(""), X = l(() => a.row.role !== "main" && (!a.row.ended_at || S.value));
    async function Y() {
      if (!X.value) return;
      const t = await U.read(`usage tool --agent ${a.row.id}`);
      x.value = t.ok ? t.value.tool : "", Q.value = t.ok ? t.value.note : "";
    }
    const H = U.follow(["hook_call.*", "process_part.*"], Y);
    return we(() => H == null ? void 0 : H()), Y(), (t, d) => {
      var $, D, Z, j;
      return i(), r("div", {
        class: de(["agent-card", { open: u.open }]),
        "data-agent-open": u.row.id,
        "aria-expanded": u.open,
        title: u.row.session,
        onClick: d[4] || (d[4] = (m) => E("toggle"))
      }, [
        v("span", Ve, [
          v("span", {
            class: "agent-dot",
            "data-state": te.value
          }, null, 8, He),
          v("span", je, w(q.value), 1),
          v("span", ze, w((($ = u.facts) == null ? void 0 : $.given_name) || u.row.id), 1),
          u.row.ended_at && !S.value ? (i(), le(o(Ie), {
            key: 0,
            class: "agent-time",
            at: u.row.ended_at
          }, null, 8, ["at"])) : (i(), r("span", Ke, w(ee.value), 1)),
          p(o(Ae), {
            class: de(["agent-chevron", { opened: u.open }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        v("span", Pe, [
          v("span", Ge, w(k.value), 1),
          g.value.length ? (i(), r(z, { key: 0 }, [
            B.value ? (i(), r("span", Je, w(B.value), 1)) : T("", !0),
            v("span", Qe, w(P.value), 1)
          ], 64)) : T("", !0)
        ]),
        X.value ? (i(), r("span", Xe, [
          S.value ? (i(), r("span", Ye, "Waiting: started again when there is more to do")) : N.value ? (i(), r("button", {
            key: 1,
            type: "button",
            class: "agent-waiting",
            "data-agent-waiting": "",
            title: "Open the test queue",
            onClick: d[0] || (d[0] = ge((m) => o(ue)("test_queue:0"), ["stop"]))
          }, "Waiting: tests")) : (i(), le(o(xe), {
            key: 2,
            text: x.value,
            idle: Q.value || "thinking"
          }, null, 8, ["text", "idle"]))
        ])) : T("", !0),
        u.open ? (i(), r("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: d[3] || (d[3] = ge(() => {
          }, ["stop"]))
        }, [
          f.value ? (i(), r("span", Ze, w(f.value), 1)) : T("", !0),
          se.value ? (i(), r("div", et, [
            (D = u.facts) != null && D.instruction ? (i(), r("div", tt, [
              p(o(me), {
                label: "Instruction",
                open: V.value,
                "data-agent-section": "instruction",
                onToggle: d[1] || (d[1] = (m) => V.value = !V.value)
              }, {
                default: I(() => [
                  v("div", at, w(u.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : T("", !0),
            p(fe, {
              line: `agent transcript ${u.row.id}`
            }, null, 8, ["line"])
          ])) : (i(), r(z, { key: 2 }, [
            p(o(De), {
              class: "agent-tabs",
              active: O.value,
              answer: { tasks: g.value.length },
              onChoose: d[2] || (d[2] = (m) => O.value = m)
            }, null, 8, ["active", "answer"]),
            v("div", {
              class: "agent-tab-body",
              "data-agent-tab-body": (Z = O.value) == null ? void 0 : Z.key
            }, [
              p(o(Ne), {
                value: (j = O.value) == null ? void 0 : j.key
              }, {
                tasks: I(() => {
                  var m;
                  return [
                    (i(!0), r(z, null, ve(ae.value, (h) => (i(), le(o(me), {
                      key: h.state,
                      label: h.label,
                      count: h.tasks.length,
                      open: J(h.state),
                      "data-agent-section": h.state,
                      onToggle: (C) => ne(h.state)
                    }, {
                      default: I(() => [
                        (i(!0), r(z, null, ve(h.tasks, (C) => (i(), r("button", {
                          key: C.id,
                          type: "button",
                          class: "agent-task",
                          "data-agent-delegated": C.id,
                          onClick: (oe) => o(ue)(`tasks:${C.id}`)
                        }, [
                          p(o(Oe), {
                            status: C.state
                          }, null, 8, ["status"]),
                          v("span", ot, w(C.id), 1),
                          v("span", lt, w(C.title), 1)
                        ], 8, st))), 128))
                      ]),
                      _: 2
                    }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                    (m = u.facts) != null && m.instruction ? (i(), r(z, { key: 0 }, [
                      d[5] || (d[5] = v("p", { class: "agent-label" }, "Instruction", -1)),
                      v("div", it, w(u.facts.instruction), 1)
                    ], 64)) : T("", !0)
                  ];
                }),
                transcript: I(() => [
                  p(fe, {
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
}, rt = /* @__PURE__ */ re(ut, [["__scopeId", "data-v-3f4aa4de"]]), ct = { class: "agents-bar" }, gt = {
  class: "agents-queue-count",
  "data-agents-queue-count": ""
}, vt = ["data-agent-row", "onMouseenter", "onMouseleave"], pt = {
  key: 0,
  class: "agent-leave",
  "data-agent-leave": "",
  "aria-hidden": "true"
}, ie = 1e4, mt = 250, ft = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) }, only: { type: Function, default: () => !0 } },
  setup(u) {
    const L = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], y = u, { rows: R, failure: W, loaded: a, more: E, older: M } = K(y.line, ["agent.*"], { incremental: !0 }), { rows: q } = K("agent running", ["agent.*"]), { rows: g } = K("usage agents --closed", ["agent.*", "task.*"]), { rows: N } = K("proof list --limit 50", ["proof.*"]), k = /* @__PURE__ */ new Set(["queued", "running"]), ee = l(() => N.value.filter((e) => k.has(e.state)).length), b = _("running"), S = _(""), te = _(Date.now()), f = _(/* @__PURE__ */ new Map()), A = _(/* @__PURE__ */ new Set());
    let P = Date.now(), B = /* @__PURE__ */ new Map();
    const ae = setInterval(() => {
      const e = Date.now(), s = new Map(f.value);
      for (const [n, c] of s)
        A.value.has(n) ? s.set(n, { ...c, leavesAt: c.leavesAt + (e - P) }) : e >= c.leavesAt && s.delete(n);
      P = e, te.value = e, (s.size !== f.value.size || [...s].some(([n, c]) => c !== f.value.get(n))) && (f.value = s);
    }, mt);
    we(() => clearInterval(ae)), pe(q, (e) => {
      const s = new Set(e.map((c) => c.id)), n = new Map(f.value);
      for (const [c, ce] of B)
        !s.has(c) && !n.has(c) && n.set(c, { row: { ...ce, ended_at: ce.ended_at ?? (/* @__PURE__ */ new Date()).toISOString() }, leavesAt: Date.now() + ie });
      for (const c of s) n.delete(c);
      B = new Map(e.map((c) => [c.id, c])), f.value = n;
    });
    const G = (e) => f.value.get(e.id) ?? null, F = (e) => A.value = /* @__PURE__ */ new Set([...A.value, e.id]), J = (e) => A.value = new Set([...A.value].filter((s) => s !== e.id)), ne = (e) => ({ animationDuration: `${ie}ms`, animationDelay: `${Math.min(0, G(e).leavesAt - ie - Date.now())}ms` }), U = /* @__PURE__ */ new Set(["open", "started", "testing"]), O = (e) => {
      var s;
      return e.role === "worker" && (((s = x(e)) == null ? void 0 : s.tasks) ?? []).some((n) => U.has(n.state));
    }, se = (e) => !e.ended_at || O(e), V = (e) => b.value === "all" || b.value === "running" === se(e) || b.value === "running" && f.value.has(e.id), x = (e) => g.value.find((s) => s.id === e.id) ?? null, Q = (e) => {
      var s, n;
      return `${e.id} ${e.session} ${e.program} ${e.role} ${((s = x(e)) == null ? void 0 : s.profile) ?? ""} ${((n = x(e)) == null ? void 0 : n.given_name) ?? ""}`.toLowerCase().includes(S.value.trim().toLowerCase());
    }, X = l(() => R.value.filter((e) => e.ended_at && O(e) && !f.value.has(e.id))), Y = l(() => b.value === "running" ? [...q.value, ...X.value, ...[...f.value.values()].map((e) => e.row)] : R.value), H = l(() => Y.value.filter((e) => y.only(e) && V(e) && Q(e))), t = he().option("order"), d = (e) => {
      var s, n;
      return e.ended_at ? "stopped" : ((s = x(e)) == null ? void 0 : s.state) === "blocked" ? "waiting" : ((n = x(e)) == null ? void 0 : n.state) === "waiting" || e.paused_at ? "idle" : "working";
    }, $ = (e) => ({ key: String(e.id), kind: e.role, n: e.id, time: Date.parse(e.updated_at ?? e.created_at ?? 0) / 1e3 || 0, card: { state: d(e) }, row: e }), D = l(() => Re(H.value.map($), t.value ?? "number").map((e) => e.row)), Z = l(() => !!S.value.trim()), j = l(() => y.texts[b.value] ?? { title: y.empty, hint: "" }), m = _(null), h = l(() => D.value.find((e) => e.id === m.value) ?? null), C = l(() => h.value ? [h.value] : D.value), oe = l(() => D.value.length - C.value.length), _e = (e) => m.value = m.value === e.id ? null : e.id;
    return pe(S, (e) => e.trim() && (m.value = null)), (e, s) => (i(), r("div", {
      class: de(["agents", { focused: h.value }])
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
              options: L,
              value: b.value,
              onPick: s[0] || (s[0] = (n) => b.value = n)
            }, null, 8, ["value"]),
            p(o(qe), {
              small: "",
              bordered: "",
              title: "Open the test queue",
              "data-agents-queue": "",
              onClick: s[1] || (s[1] = (n) => o(ue)("test_queue:0"))
            }, {
              default: I(() => [
                s[4] || (s[4] = ye("Test queue ", -1)),
                v("span", gt, w(ee.value), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      p(o(ke), {
        rows: C.value,
        failure: o(W),
        loaded: o(a),
        more: o(E) && b.value !== "running",
        older: o(M),
        empty: j.value.title,
        hint: j.value.hint,
        searching: Z.value
      }, {
        default: I(({ row: n }) => [
          v("div", {
            class: "agent-row",
            "data-agent-row": n.id,
            onMouseenter: (c) => F(n),
            onMouseleave: (c) => J(n)
          }, [
            p(rt, {
              row: n,
              facts: x(n),
              open: n.id === m.value,
              onToggle: (c) => _e(n)
            }, null, 8, ["row", "facts", "open", "onToggle"]),
            G(n) ? (i(), r("span", pt, [
              v("i", {
                style: be(ne(n))
              }, null, 4)
            ])) : T("", !0)
          ], 40, vt)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty", "hint", "searching"]),
      h.value && oe.value ? (i(), r("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: s[3] || (s[3] = (n) => m.value = null)
      }, w(oe.value) + " more", 1)) : T("", !0)
    ], 2));
  }
}, _t = /* @__PURE__ */ re(ft, [["__scopeId", "data-v-b4bee987"]]);
export {
  _t as A
};
