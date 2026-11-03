/* @code-commandments-generated */
import { computed as l, openBlock as r, createElementBlock as v, unref as o, createCommentVNode as y, createVNode as p, withCtx as T, ref as b, onUnmounted as _e, normalizeClass as le, createElementVNode as g, toDisplayString as m, Fragment as Z, withModifiers as ve, createBlock as pe, renderList as me, watch as fe, createTextVNode as Se, normalizeStyle as $e } from "vue";
import { useRows as U, AutoScrollPane as Ce, RowList as he, DiffCard as Te, ago as xe, useNow as Ae, age as we, useWindow as ke, Icon as Ie, peekRef as ie, RunningCommand as De, InnerTabs as Oe, SwitchCase as Ne, FoldGroup as Ee, TaskStatusIcon as Me, ordered as Re, hiddenBy as qe, hiddenSummary as Be, SearchBar as Le, Segmented as Fe, Btn as je } from "@journal/window-kit";
import { _ as de, T as Ve } from "./TranscriptRows-DMVGl_Ye.js";
const Ke = { class: "file-feed" }, We = 5, ze = {
  __name: "AgentFileEdits",
  props: { agent: { type: Number, required: !0 } },
  setup(u) {
    const L = u, { rows: h, failure: F, loaded: j, more: a, older: M } = U(`file-edit list --agent ${L.agent}`, ["file_edit.create"], { incremental: !0 }), O = l(() => h.value.map((c) => ({ ...c, lines: JSON.parse(c.rows || "[]") })).reverse()), R = l(() => {
      var c;
      return ((c = h.value[0]) == null ? void 0 : c.id) ?? 0;
    });
    return (c, N) => (r(), v("div", Ke, [
      o(a) && o(h).length ? (r(), v("button", {
        key: 0,
        type: "button",
        class: "file-feed-older",
        "data-file-feed-older": "",
        onClick: N[0] || (N[0] = (...f) => o(M) && o(M)(...f))
      }, "Show older edits")) : y("", !0),
      p(o(Ce), { "row-count": R.value }, {
        default: T(() => [
          p(o(he), {
            rows: O.value,
            failure: o(F),
            loaded: o(j),
            empty: "No edits by this agent yet",
            hint: "The files it changes show here as it works."
          }, {
            default: T(({ row: f }) => [
              p(o(Te), {
                flush: "",
                lines: We,
                path: f.path,
                kind: f.edit_type,
                added: f.added,
                removed: f.removed,
                ago: o(xe)(f.created_at),
                rows: f.lines
              }, null, 8, ["path", "kind", "added", "removed", "ago", "rows"])
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ]),
        _: 1
      }, 8, ["row-count"])
    ]));
  }
}, He = /* @__PURE__ */ de(ze, [["__scopeId", "data-v-3fd4f736"]]), Ue = ["data-agent-open", "aria-expanded", "title"], Pe = { class: "agent-head" }, Ge = ["data-state"], Je = {
  class: "agent-title",
  "data-agent-title": ""
}, Qe = {
  class: "agent-name",
  "data-agent-name": ""
}, Xe = { class: "agent-time" }, Ye = { class: "agent-line" }, Ze = {
  class: "agent-identity",
  "data-agent-identity": ""
}, et = {
  key: 0,
  class: "agent-tasks",
  "data-agent-pace": ""
}, tt = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, at = {
  key: 0,
  class: "agent-command",
  "data-agent-command": ""
}, nt = {
  key: 0,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, st = ["data-agent-tab-body"], ot = ["data-agent-delegated", "onClick"], lt = { class: "agent-task-number" }, it = { class: "agent-task-title" }, dt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, rt = 36e5, ut = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, open: Boolean },
  emits: ["toggle"],
  setup(u, { emit: L }) {
    const h = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, F = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), j = ["started", "testing", "blocked", "open", "completed", "cancelled"], a = u, M = L, O = Ae(), R = l(() => {
      var i;
      const t = ((i = a.facts) == null ? void 0 : i.profile) || h[a.row.role] || a.row.role;
      return t.slice(0, 1).toUpperCase() + t.slice(1);
    }), c = l(() => {
      var t;
      return ((t = a.facts) == null ? void 0 : t.tasks) ?? [];
    }), N = l(() => !a.row.ended_at && c.value.some((t) => t.state === "testing") && !c.value.some((t) => t.state === "started")), f = l(() => {
      var t;
      return [a.row.program, (t = a.facts) == null ? void 0 : t.model, a.row.role === "worker" ? `worker ${a.row.id}` : F.has(a.row.role) ? a.row.role : ""].filter(Boolean).join(" · ");
    }), ee = l(() => a.row.ended_at ? `${we(a.row.ended_at, O.value)} ago` : we(a.row.process_started_at || a.row.created_at, O.value)), k = l(() => {
      var t;
      return a.row.ended_at ? "closed" : N.value ? "waiting" : ((t = a.facts) == null ? void 0 : t.state) || "running";
    }), x = l(() => {
      var i, _, E;
      const t = [];
      return ((i = a.facts) == null ? void 0 : i.context_percent) !== null && ((_ = a.facts) == null ? void 0 : _.context_percent) !== void 0 && t.push(`Context ${a.facts.context_percent}%`), (E = a.facts) != null && E.cost_dollars && t.push(`$${a.facts.cost_dollars.toFixed(2)}`), t.join(" · ");
    }), V = l(() => c.value.filter((t) => t.state === "completed").length), w = l(() => `${V.value} of ${c.value.length} ${c.value.length === 1 ? "task" : "tasks"}`), A = l(() => {
      const t = Date.parse(a.row.process_started_at || a.row.created_at), _ = ((a.row.ended_at ? Date.parse(a.row.ended_at) : O.value) - t) / rt;
      return a.row.role === "worker" && _ > 0 && V.value ? `${Math.round(V.value / _)}/h` : "";
    }), P = l(() => j.map((t) => ({ state: t, label: t.slice(0, 1).toUpperCase() + t.slice(1), tasks: c.value.filter((i) => i.state === t) })).filter((t) => t.tasks.length)), G = /* @__PURE__ */ new Set(["completed"]), K = b({}), W = (t) => !(K.value[t] ?? G.has(t)), te = (t) => K.value = { ...K.value, [t]: W(t) }, z = ke(), q = b(z.tabs[0]), J = b(""), I = b(""), Q = l(() => a.row.role !== "main" && !a.row.ended_at);
    async function X() {
      if (!Q.value) return;
      const t = await z.read(`usage tool --agent ${a.row.id}`);
      J.value = t.ok ? t.value.tool : "", I.value = t.ok ? t.value.note : "";
    }
    const H = z.follow(["hook_call.*", "process_part.*"], X);
    return _e(() => H == null ? void 0 : H()), X(), (t, i) => {
      var _, E, D;
      return r(), v("div", {
        class: le(["agent-card", { open: u.open }]),
        "data-agent-open": u.row.id,
        "aria-expanded": u.open,
        title: u.row.session,
        onClick: i[3] || (i[3] = (S) => M("toggle"))
      }, [
        g("span", Pe, [
          g("span", {
            class: "agent-dot",
            "data-state": k.value
          }, null, 8, Ge),
          g("span", Je, m(R.value), 1),
          g("span", Qe, m(((_ = u.facts) == null ? void 0 : _.given_name) || u.row.id), 1),
          g("span", Xe, m(ee.value), 1),
          p(o(Ie), {
            class: le(["agent-chevron", { opened: u.open }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        g("span", Ye, [
          g("span", Ze, m(f.value), 1),
          c.value.length ? (r(), v(Z, { key: 0 }, [
            A.value ? (r(), v("span", et, m(A.value), 1)) : y("", !0),
            g("span", tt, m(w.value), 1)
          ], 64)) : y("", !0)
        ]),
        Q.value ? (r(), v("span", at, [
          N.value ? (r(), v("button", {
            key: 0,
            type: "button",
            class: "agent-waiting",
            "data-agent-waiting": "",
            title: "Open the test queue",
            onClick: i[0] || (i[0] = ve((S) => o(ie)("test_queue:0"), ["stop"]))
          }, "Waiting: tests")) : (r(), pe(o(De), {
            key: 1,
            text: J.value,
            idle: I.value || "thinking"
          }, null, 8, ["text", "idle"]))
        ])) : y("", !0),
        u.open ? (r(), v("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: i[2] || (i[2] = ve(() => {
          }, ["stop"]))
        }, [
          x.value ? (r(), v("span", nt, m(x.value), 1)) : y("", !0),
          p(o(Oe), {
            class: "agent-tabs",
            active: q.value,
            answer: { tasks: c.value.length },
            onChoose: i[1] || (i[1] = (S) => q.value = S)
          }, null, 8, ["active", "answer"]),
          g("div", {
            class: "agent-tab-body",
            "data-agent-tab-body": (E = q.value) == null ? void 0 : E.key
          }, [
            p(o(Ne), {
              value: (D = q.value) == null ? void 0 : D.key
            }, {
              tasks: T(() => {
                var S;
                return [
                  (r(!0), v(Z, null, me(P.value, ($) => (r(), pe(o(Ee), {
                    key: $.state,
                    label: $.label,
                    count: $.tasks.length,
                    open: W($.state),
                    "data-agent-section": $.state,
                    onToggle: (C) => te($.state)
                  }, {
                    default: T(() => [
                      (r(!0), v(Z, null, me($.tasks, (C) => (r(), v("button", {
                        key: C.id,
                        type: "button",
                        class: "agent-task",
                        "data-agent-delegated": C.id,
                        onClick: (ae) => o(ie)(`tasks:${C.id}`)
                      }, [
                        p(o(Me), {
                          status: C.state
                        }, null, 8, ["status"]),
                        g("span", lt, m(C.id), 1),
                        g("span", it, m(C.title), 1)
                      ], 8, ot))), 128))
                    ]),
                    _: 2
                  }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                  (S = u.facts) != null && S.instruction ? (r(), v(Z, { key: 0 }, [
                    i[4] || (i[4] = g("p", { class: "agent-label" }, "Instruction", -1)),
                    g("div", dt, m(u.facts.instruction), 1)
                  ], 64)) : y("", !0)
                ];
              }),
              transcript: T(() => [
                p(Ve, {
                  line: `agent transcript ${u.row.id}`
                }, null, 8, ["line"])
              ]),
              "file-feed": T(() => [
                p(He, {
                  agent: u.row.id
                }, null, 8, ["agent"])
              ]),
              _: 1
            }, 8, ["value"])
          ], 8, st)
        ])) : y("", !0)
      ], 10, Ue);
    };
  }
}, ct = /* @__PURE__ */ de(ut, [["__scopeId", "data-v-d1df82bf"]]), gt = { class: "agents-bar" }, vt = {
  class: "agents-queue-count",
  "data-agents-queue-count": ""
}, pt = {
  key: 0,
  class: "agents-hidden",
  "data-agents-hidden": ""
}, mt = ["data-agent-row", "onMouseenter", "onMouseleave"], ft = {
  key: 0,
  class: "agent-leave",
  "data-agent-leave": "",
  "aria-hidden": "true"
}, oe = 1e4, wt = 250, _t = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) }, only: { type: Function, default: () => !0 } },
  setup(u) {
    const L = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], h = u, { rows: F, failure: j, loaded: a, more: M, older: O } = U(h.line, ["agent.*"], { incremental: !0 }), { rows: R } = U("agent running", ["agent.*"]), { rows: c } = U("usage agents --closed", ["agent.*", "task.*"]), { rows: N } = U("proof list --limit 50", ["proof.*"]), f = /* @__PURE__ */ new Set(["queued", "running"]), ee = l(() => N.value.filter((e) => f.has(e.state)).length), k = b("running"), x = b(""), V = b(Date.now()), w = b(/* @__PURE__ */ new Map()), A = b(/* @__PURE__ */ new Set());
    let P = Date.now(), G = /* @__PURE__ */ new Map();
    const K = setInterval(() => {
      const e = Date.now(), s = new Map(w.value);
      for (const [n, d] of s)
        A.value.has(n) ? s.set(n, { ...d, leavesAt: d.leavesAt + (e - P) }) : e >= d.leavesAt && s.delete(n);
      P = e, V.value = e, (s.size !== w.value.size || [...s].some(([n, d]) => d !== w.value.get(n))) && (w.value = s);
    }, wt);
    _e(() => clearInterval(K)), fe(R, (e) => {
      const s = new Set(e.map((d) => d.id)), n = new Map(w.value);
      for (const [d, ge] of G)
        !s.has(d) && !n.has(d) && n.set(d, { row: { ...ge, ended_at: ge.ended_at ?? (/* @__PURE__ */ new Date()).toISOString() }, leavesAt: Date.now() + oe });
      for (const d of s) n.delete(d);
      G = new Map(e.map((d) => [d.id, d])), w.value = n;
    });
    const W = (e) => w.value.get(e.id) ?? null, te = (e) => A.value = /* @__PURE__ */ new Set([...A.value, e.id]), z = (e) => A.value = new Set([...A.value].filter((s) => s !== e.id)), q = (e) => ({ animationDuration: `${oe}ms`, animationDelay: `${Math.min(0, W(e).leavesAt - oe - Date.now())}ms` }), J = (e) => k.value === "all" || k.value === "running" == !e.ended_at || k.value === "running" && w.value.has(e.id), I = (e) => c.value.find((s) => s.id === e.id) ?? null, Q = (e) => {
      var s, n;
      return `${e.id} ${e.session} ${e.program} ${e.role} ${((s = I(e)) == null ? void 0 : s.profile) ?? ""} ${((n = I(e)) == null ? void 0 : n.given_name) ?? ""}`.toLowerCase().includes(x.value.trim().toLowerCase());
    }, X = l(() => k.value === "running" ? [...R.value, ...[...w.value.values()].map((e) => e.row)] : F.value), H = l(() => X.value.filter((e) => h.only(e) && J(e) && Q(e))), t = ke(), i = ["working", "waiting", "idle", "stopped"], _ = ["environment", "worker", "subagent"], E = { main: "environment", worker: "worker", subagent: "subagent" }, D = Object.fromEntries([...i, ..._, "order", "every"].map((e) => [e, t.option(e)])), S = l(() => ({
      states: Object.fromEntries(i.map((e) => [e, D.every.value || D[e].value !== !1])),
      kinds: Object.fromEntries(_.map((e) => [e, D.every.value || D[e].value !== !1]))
    })), $ = (e) => {
      var s, n;
      return e.ended_at ? "stopped" : ((s = I(e)) == null ? void 0 : s.state) === "blocked" ? "waiting" : ((n = I(e)) == null ? void 0 : n.state) === "waiting" || e.paused_at ? "idle" : "working";
    }, C = (e) => ({ key: String(e.id), kind: E[e.role] ?? e.role, n: e.id, time: Date.parse(e.updated_at ?? e.created_at ?? 0) / 1e3 || 0, card: { state: $(e) }, row: e }), ae = l(() => H.value.map(C)), ne = l(() => Re(ae.value.filter((e) => !qe(e, S.value)), D.order.value ?? "number").map((e) => e.row)), se = l(() => Be(ae.value, S.value).join(", ")), ye = l(() => !!x.value.trim() || !!se.value), re = l(() => h.texts[k.value] ?? { title: h.empty, hint: "" }), B = b(null), Y = l(() => ne.value.find((e) => e.id === B.value) ?? null), ue = l(() => Y.value ? [Y.value] : ne.value), ce = l(() => ne.value.length - ue.value.length), be = (e) => B.value = B.value === e.id ? null : e.id;
    return fe(x, (e) => e.trim() && (B.value = null)), (e, s) => (r(), v("div", {
      class: le(["agents", { focused: Y.value }])
    }, [
      g("div", gt, [
        p(o(Le), {
          modelValue: x.value,
          "onUpdate:modelValue": s[2] || (s[2] = (n) => x.value = n),
          class: "agents-search",
          "data-agents-search": ""
        }, {
          default: T(() => [
            p(o(Fe), {
              options: L,
              value: k.value,
              onPick: s[0] || (s[0] = (n) => k.value = n)
            }, null, 8, ["value"]),
            p(o(je), {
              small: "",
              bordered: "",
              title: "Open the test queue",
              "data-agents-queue": "",
              onClick: s[1] || (s[1] = (n) => o(ie)("test_queue:0"))
            }, {
              default: T(() => [
                s[4] || (s[4] = Se("Test queue ", -1)),
                g("span", vt, m(ee.value), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      se.value ? (r(), v("p", pt, "Hidden: " + m(se.value), 1)) : y("", !0),
      p(o(he), {
        rows: ue.value,
        failure: o(j),
        loaded: o(a),
        more: o(M) && k.value !== "running",
        older: o(O),
        empty: re.value.title,
        hint: re.value.hint,
        searching: ye.value
      }, {
        default: T(({ row: n }) => [
          g("div", {
            class: "agent-row",
            "data-agent-row": n.id,
            onMouseenter: (d) => te(n),
            onMouseleave: (d) => z(n)
          }, [
            p(ct, {
              row: n,
              facts: I(n),
              open: n.id === B.value,
              onToggle: (d) => be(n)
            }, null, 8, ["row", "facts", "open", "onToggle"]),
            W(n) ? (r(), v("span", ft, [
              g("i", {
                style: $e(q(n))
              }, null, 4)
            ])) : y("", !0)
          ], 40, mt)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty", "hint", "searching"]),
      Y.value && ce.value ? (r(), v("button", {
        key: 1,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: s[3] || (s[3] = (n) => B.value = null)
      }, m(ce.value) + " more", 1)) : y("", !0)
    ], 2));
  }
}, bt = /* @__PURE__ */ de(_t, [["__scopeId", "data-v-d4f81122"]]);
export {
  bt as A
};
