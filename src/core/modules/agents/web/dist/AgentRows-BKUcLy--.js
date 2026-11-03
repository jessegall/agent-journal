/* @code-commandments-generated */
import { computed as r, openBlock as l, createElementBlock as u, unref as o, createCommentVNode as _, createVNode as g, withCtx as k, ref as w, onUnmounted as ge, normalizeClass as te, createElementVNode as v, toDisplayString as f, createBlock as ee, Fragment as G, withModifiers as oe, renderList as le, watch as re, createTextVNode as ve } from "vue";
import { useRows as J, AutoScrollPane as pe, RowList as de, DiffCard as fe, useNow as we, age as me, useWindow as ce, TimeAgo as ke, Icon as he, peekRef as ae, RunningCommand as _e, FoldGroup as ie, InnerTabs as ye, SwitchCase as be, TaskStatusIcon as Se, SearchBar as Ce, Segmented as $e, Btn as Te } from "@journal/window-kit";
import { _ as ne, T as ue } from "./TranscriptRows-DhYd90lu.js";
const xe = { class: "file-feed" }, Re = 5, Ae = {
  __name: "AgentFileEdits",
  props: { agent: { type: Number, required: !0 } },
  setup(s) {
    const L = s, { rows: h, failure: F, loaded: V, more: t, older: x } = J(`file-edit list --agent ${L.agent}`, ["file_edit.create"], { incremental: !0 }), R = r(() => h.value.map((p) => ({ ...p, lines: JSON.parse(p.rows || "[]") })).reverse()), j = r(() => {
      var p;
      return ((p = h.value[0]) == null ? void 0 : p.id) ?? 0;
    });
    return (p, A) => (l(), u("div", xe, [
      o(t) && o(h).length ? (l(), u("button", {
        key: 0,
        type: "button",
        class: "file-feed-older",
        "data-file-feed-older": "",
        onClick: A[0] || (A[0] = (...c) => o(x) && o(x)(...c))
      }, "Show older edits")) : _("", !0),
      g(o(pe), { "row-count": j.value }, {
        default: k(() => [
          g(o(de), {
            rows: R.value,
            failure: o(F),
            loaded: o(V),
            empty: "No edits by this agent yet",
            hint: "The files it changes show here as it works."
          }, {
            default: k(({ row: c }) => [
              g(o(fe), {
                flush: "",
                lines: Re,
                path: c.path,
                kind: c.edit_type,
                added: c.added,
                removed: c.removed,
                at: c.created_at,
                rows: c.lines
              }, null, 8, ["path", "kind", "added", "removed", "at", "rows"])
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ]),
        _: 1
      }, 8, ["row-count"])
    ]));
  }
}, Ie = /* @__PURE__ */ ne(Ae, [["__scopeId", "data-v-ddb88f22"]]), Oe = ["data-agent-open", "aria-expanded", "title"], Ne = { class: "agent-head" }, qe = ["data-state"], Ee = {
  class: "agent-title",
  "data-agent-title": ""
}, Be = {
  class: "agent-name",
  "data-agent-name": ""
}, De = {
  key: 1,
  class: "agent-time"
}, We = { class: "agent-line" }, Le = {
  class: "agent-identity",
  "data-agent-identity": ""
}, Fe = {
  key: 0,
  class: "agent-tasks",
  "data-agent-pace": ""
}, Ve = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, je = {
  key: 0,
  class: "agent-command",
  "data-agent-command": ""
}, Pe = {
  key: 1,
  class: "agent-stopped",
  "data-agent-stopped": ""
}, Ue = {
  key: 0,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, He = {
  key: 1,
  class: "agent-tab-body",
  "data-agent-tab-body": "transcript",
  "data-agent-only-transcript": ""
}, Me = {
  key: 0,
  class: "agent-subagent-brief"
}, ze = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ke = ["data-agent-tab-body"], Ge = ["data-agent-delegated", "onClick"], Je = { class: "agent-task-number" }, Qe = { class: "agent-task-title" }, Xe = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ye = 36e5, Ze = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(s, { emit: L }) {
    const h = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, F = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), V = ["started", "testing", "blocked", "open", "completed", "cancelled"], t = s, x = L, R = we(), j = r(() => {
      var n;
      const e = ((n = t.facts) == null ? void 0 : n.profile) || h[t.row.role] || t.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), p = r(() => {
      var e;
      return ((e = t.facts) == null ? void 0 : e.tasks) ?? [];
    }), A = r(() => {
      var e, n;
      return [t.row.program, (e = t.facts) == null ? void 0 : e.model, (n = t.facts) == null ? void 0 : n.effort, t.row.role === "worker" ? `worker ${t.row.id}` : F.has(t.row.role) ? t.row.role : ""].filter(Boolean).join(" · ");
    }), c = r(() => me(t.row.process_started_at || t.row.created_at, R.value)), y = /* @__PURE__ */ new Set(["open", "started", "testing"]), S = r(() => !!t.row.ended_at && t.row.role === "worker" && p.value.some((e) => y.has(e.state))), Q = r(() => {
      var e;
      return t.waitReason || S.value ? "waiting" : t.row.ended_at ? "closed" : ((e = t.facts) == null ? void 0 : e.state) || "running";
    }), P = r(() => {
      var n, W, b;
      const e = [];
      return ((n = t.facts) == null ? void 0 : n.context_percent) !== null && ((W = t.facts) == null ? void 0 : W.context_percent) !== void 0 && e.push(`Context ${t.facts.context_percent}%`), (b = t.facts) != null && b.cost_dollars && e.push(`$${t.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), I = r(() => {
      var e;
      return ((e = t.progress) == null ? void 0 : e.completed_count) ?? p.value.filter((n) => n.state === "completed").length;
    }), O = r(() => {
      var e;
      return ((e = t.progress) == null ? void 0 : e.task_count) ?? p.value.length;
    }), U = r(() => `${I.value} of ${O.value} ${O.value === 1 ? "task" : "tasks"}`), H = r(() => {
      var K;
      const e = Date.parse(((K = t.progress) == null ? void 0 : K.started_at) || t.row.created_at), n = t.progress ? t.progress.finished_at : t.row.ended_at, b = ((n ? Date.parse(n) : R.value) - e) / Ye;
      return t.row.role === "worker" && b > 0 && I.value ? `${Math.round(I.value / b)}/h` : "";
    }), N = r(() => V.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: p.value.filter((n) => n.state === e) })).filter((e) => e.tasks.length)), Y = /* @__PURE__ */ new Set(["completed"]), M = w({}), q = (e) => !(M.value[e] ?? Y.has(e)), Z = (e) => M.value = { ...M.value, [e]: q(e) }, E = ce(), m = w(E.tabs[0]), B = r(() => t.row.role === "subagent"), D = w(!1), z = w(""), X = w(""), i = r(() => t.row.role !== "main" && (!t.row.ended_at || S.value || t.waitReason));
    async function a() {
      if (!i.value) return;
      const e = await E.read(`usage tool --agent ${t.row.id}`);
      z.value = e.ok ? e.value.tool : "", X.value = e.ok ? e.value.note : "";
    }
    const d = E.follow(["hook_call.*", "process_part.*"], a);
    return ge(() => d == null ? void 0 : d()), a(), (e, n) => {
      var W, b, K, se;
      return l(), u("div", {
        class: te(["agent-card", { open: s.open }]),
        "data-agent-open": s.row.id,
        "aria-expanded": s.open,
        title: s.row.session,
        onClick: n[4] || (n[4] = (C) => x("toggle"))
      }, [
        v("span", Ne, [
          v("span", {
            class: "agent-dot",
            "data-state": Q.value
          }, null, 8, qe),
          v("span", Ee, f(j.value), 1),
          v("span", Be, f(((W = s.facts) == null ? void 0 : W.given_name) || s.row.id), 1),
          s.row.ended_at && !S.value ? (l(), ee(o(ke), {
            key: 0,
            class: "agent-time",
            at: s.row.ended_at
          }, null, 8, ["at"])) : (l(), u("span", De, f(c.value), 1)),
          g(o(he), {
            class: te(["agent-chevron", { opened: s.open }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        v("span", We, [
          v("span", Le, f(A.value), 1),
          O.value ? (l(), u(G, { key: 0 }, [
            H.value ? (l(), u("span", Fe, f(H.value), 1)) : _("", !0),
            v("span", Ve, f(U.value), 1)
          ], 64)) : _("", !0)
        ]),
        i.value ? (l(), u("span", je, [
          s.waitReason ? (l(), u("button", {
            key: 0,
            type: "button",
            class: "agent-waiting",
            "data-agent-waiting": "",
            title: "Open the process queue",
            onClick: n[0] || (n[0] = oe((C) => o(ae)("test_queue:0"), ["stop"]))
          }, "Waiting: " + f(s.waitReason), 1)) : S.value ? (l(), u("span", Pe, "Waiting")) : (l(), ee(o(_e), {
            key: 2,
            text: z.value,
            idle: X.value || "thinking"
          }, null, 8, ["text", "idle"]))
        ])) : _("", !0),
        s.open ? (l(), u("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: n[3] || (n[3] = oe(() => {
          }, ["stop"]))
        }, [
          P.value ? (l(), u("span", Ue, f(P.value), 1)) : _("", !0),
          B.value ? (l(), u("div", He, [
            (b = s.facts) != null && b.instruction ? (l(), u("div", Me, [
              g(o(ie), {
                label: "Instruction",
                open: D.value,
                "data-agent-section": "instruction",
                onToggle: n[1] || (n[1] = (C) => D.value = !D.value)
              }, {
                default: k(() => [
                  v("div", ze, f(s.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : _("", !0),
            g(ue, {
              line: `agent transcript ${s.row.id}`
            }, null, 8, ["line"])
          ])) : (l(), u(G, { key: 2 }, [
            g(o(ye), {
              class: "agent-tabs",
              active: m.value,
              answer: { tasks: p.value.length },
              onChoose: n[2] || (n[2] = (C) => m.value = C)
            }, null, 8, ["active", "answer"]),
            v("div", {
              class: "agent-tab-body",
              "data-agent-tab-body": (K = m.value) == null ? void 0 : K.key
            }, [
              g(o(be), {
                value: (se = m.value) == null ? void 0 : se.key
              }, {
                tasks: k(() => {
                  var C;
                  return [
                    (l(!0), u(G, null, le(N.value, ($) => (l(), ee(o(ie), {
                      key: $.state,
                      label: $.label,
                      count: $.tasks.length,
                      open: q($.state),
                      "data-agent-section": $.state,
                      onToggle: (T) => Z($.state)
                    }, {
                      default: k(() => [
                        (l(!0), u(G, null, le($.tasks, (T) => (l(), u("button", {
                          key: T.id,
                          type: "button",
                          class: "agent-task",
                          "data-agent-delegated": T.id,
                          onClick: (st) => o(ae)(`tasks:${T.id}`)
                        }, [
                          g(o(Se), {
                            status: T.state
                          }, null, 8, ["status"]),
                          v("span", Je, f(T.id), 1),
                          v("span", Qe, f(T.title), 1)
                        ], 8, Ge))), 128))
                      ]),
                      _: 2
                    }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                    (C = s.facts) != null && C.instruction ? (l(), u(G, { key: 0 }, [
                      n[5] || (n[5] = v("p", { class: "agent-label" }, "Instruction", -1)),
                      v("div", Xe, f(s.facts.instruction), 1)
                    ], 64)) : _("", !0)
                  ];
                }),
                transcript: k(() => [
                  g(ue, {
                    line: `agent transcript ${s.row.id}`
                  }, null, 8, ["line"])
                ]),
                "file-feed": k(() => [
                  g(Ie, {
                    agent: s.row.id
                  }, null, 8, ["agent"])
                ]),
                _: 1
              }, 8, ["value"])
            ], 8, Ke)
          ], 64))
        ])) : _("", !0)
      ], 10, Oe);
    };
  }
}, et = /* @__PURE__ */ ne(Ze, [["__scopeId", "data-v-23591f9b"]]), tt = {
  class: "agents-queue-count",
  "data-agents-queue-count": ""
}, at = ["data-agent-row"], nt = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(s) {
    const L = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], h = s, { rows: F } = J("usage agents --closed", ["agent.*", "task.*"]), { rows: V } = J("worker waits", ["agent.*", "task.*", "proof.*", "worker_worktree.*"]), { rows: t } = J("worker progress", ["task.*", "worker_worktree.*"]), x = (i) => t.value.find((a) => a.agent_id === i.id) ?? null, R = (i) => {
      var a;
      return ((a = V.value.find((d) => d.agent_id === i.id)) == null ? void 0 : a.reason) ?? "";
    }, { rows: j } = J("proof list --limit 50", ["proof.*"]), p = /* @__PURE__ */ new Set(["queued", "running"]), A = r(() => j.value.filter((i) => p.has(i.state)).length), c = w("running"), y = w(""), S = ce(), Q = w([]), P = w(""), I = w(!1), O = w(!1), U = w(25);
    let H = 0;
    async function N() {
      const i = ++H, a = await S.read(`${h.line} --show ${c.value} --search ${JSON.stringify(y.value)} --limit ${U.value}`);
      i === H && (Q.value = a.ok ? a.value.rows : [], P.value = a.ok ? "" : a.error, O.value = a.ok && a.value.page * a.value.size < a.value.total, I.value = !0);
    }
    async function Y() {
      return U.value += 25, await N(), !0;
    }
    re([c, y], () => {
      U.value = 25, N();
    }), S.follow(["agent.*", "task.*", "worker_worktree.*"], N), N();
    const M = (i) => F.value.find((a) => a.id === i.id) ?? null, q = Q, Z = r(() => !!y.value.trim()), E = r(() => h.texts[c.value] ?? { title: h.empty, hint: "" }), m = w(null), B = r(() => q.value.find((i) => i.id === m.value) ?? null), D = r(() => B.value ? [B.value] : q.value), z = r(() => q.value.length - D.value.length), X = (i) => m.value = m.value === i.id ? null : i.id;
    return re(y, (i) => i.trim() && (m.value = null)), (i, a) => (l(), u("div", {
      class: te(["agents", { focused: B.value }])
    }, [
      g(o(Ce), {
        modelValue: y.value,
        "onUpdate:modelValue": a[2] || (a[2] = (d) => y.value = d),
        "data-agents-search": ""
      }, {
        default: k(() => [
          g(o($e), {
            options: L,
            value: c.value,
            onPick: a[0] || (a[0] = (d) => c.value = d)
          }, null, 8, ["value"]),
          g(o(Te), {
            small: "",
            bordered: "",
            title: "Open the process queue",
            "data-agents-queue": "",
            onClick: a[1] || (a[1] = (d) => o(ae)("test_queue:0"))
          }, {
            default: k(() => [
              a[4] || (a[4] = ve("Process queue ", -1)),
              v("span", tt, f(A.value), 1)
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue"]),
      g(o(de), {
        rows: D.value,
        failure: P.value,
        loaded: I.value,
        more: O.value,
        older: Y,
        empty: E.value.title,
        hint: E.value.hint,
        searching: Z.value
      }, {
        default: k(({ row: d }) => [
          v("div", {
            class: "agent-row",
            "data-agent-row": d.id
          }, [
            g(et, {
              row: d,
              facts: M(d),
              progress: x(d),
              "wait-reason": R(d),
              open: d.id === m.value,
              onToggle: (e) => X(d)
            }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
          ], 8, at)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]),
      B.value && z.value ? (l(), u("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: a[3] || (a[3] = (d) => m.value = null)
      }, f(z.value) + " more", 1)) : _("", !0)
    ], 2));
  }
}, it = /* @__PURE__ */ ne(nt, [["__scopeId", "data-v-d8171307"]]);
export {
  it as A
};
