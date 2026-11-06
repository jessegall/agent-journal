/* @code-commandments-generated */
import { openBlock as o, createElementBlock as i, withModifiers as J, unref as v, createTextVNode as ce, toDisplayString as p, createVNode as b, createBlock as C, withCtx as R, Fragment as se, renderList as de, createElementVNode as y, createCommentVNode as g, computed as r, ref as k, watch as le, defineAsyncComponent as be, onUnmounted as we, withKeys as ve, normalizeClass as re, createSlots as $e, resolveDynamicComponent as Se, nextTick as pe } from "vue";
import { peekRef as ye, Icon as ge, RunningCommand as _e, FoldGroup as ke, TaskStatusIcon as Te, useNow as Ce, age as Re, perHour as xe, useWindow as he, loadWindowComponent as Ae, TimeAgo as Ee, Btn as Oe, InnerTabs as qe, TabBody as Be, SwitchCase as je, EmptyState as Ie, useRows as Ne, useDeclaredRows as me, SearchBar as We, Segmented as De, RowList as He } from "@journal/window-kit";
import { _ as ie, T as Le } from "./TranscriptRows-DCpyNUhv.mjs";
const Pe = {
  class: "agent-command",
  "data-agent-command": ""
}, Ve = {
  key: 1,
  "data-agent-stopped": ""
}, ze = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(n) {
    return (H, S) => (o(), i("span", Pe, [
      n.waitReason ? (o(), i("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: S[0] || (S[0] = J((z) => v(ye)("test_queue:0"), ["stop"]))
      }, [
        ce("Waiting: " + p(n.waitReason) + " ", 1),
        b(v(ge), {
          name: "arrow",
          size: 11
        })
      ])) : n.stopped ? (o(), i("span", Ve, "Waiting")) : (o(), C(v(_e), {
        key: 2,
        text: n.command,
        idle: n.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, fe = /* @__PURE__ */ ie(ze, [["__scopeId", "data-v-bb905922"]]), Ue = ["data-agent-delegated", "onClick"], Fe = { class: "agent-task-number" }, Ke = { class: "agent-task-title" }, Ge = ["title"], Me = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(n, { emit: H }) {
    const S = H;
    return (z, t) => (o(), C(v(ke), {
      label: n.section.label,
      count: n.section.tasks.length,
      open: n.open,
      "data-agent-section": n.section.state,
      onToggle: t[0] || (t[0] = (c) => S("toggle"))
    }, {
      default: R(() => [
        (o(!0), i(se, null, de(n.section.tasks, (c) => (o(), i("button", {
          key: c.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": c.id,
          onClick: (U) => v(ye)(`tasks:${c.id}`)
        }, [
          b(v(Te), {
            status: c.state
          }, null, 8, ["status"]),
          y("span", Fe, p(c.id), 1),
          y("span", Ke, p(c.title), 1),
          c.plan_id ? (o(), i("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${c.plan_id}: ${c.plan_title}`
          }, "Plan " + p(c.plan_id) + ": " + p(c.plan_title), 9, Ge)) : g("", !0)
        ], 8, Ue))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Ye = /* @__PURE__ */ ie(Me, [["__scopeId", "data-v-acc154a9"]]), Je = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], Qe = { class: "agent-head" }, Xe = ["data-state"], Ze = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, et = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, tt = {
  key: 3,
  class: "agent-time",
  "data-agent-motion": ""
}, at = { class: "agent-line" }, nt = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, ot = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, st = {
  key: 0,
  class: "agent-line agent-work-start"
}, lt = ["title"], rt = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, it = {
  key: 1,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, ut = {
  key: 0,
  class: "agent-usage-band"
}, ct = {
  class: "agent-usage",
  "data-agent-card-usage": ""
}, dt = {
  key: 2,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, gt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, vt = {
  key: 0,
  class: "agent-helper-brief"
}, pt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, mt = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, ft = "It ended without a report", wt = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(n, { emit: H }) {
    const S = { helper: "Helper", reviewer: "Reviewer" }, z = ["started", "blocked", "open", "completed"], t = n, c = H, U = Ce(), ue = r(() => {
      var a;
      const e = ((a = t.facts) == null ? void 0 : a.profile) || S[t.row.role] || t.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), f = r(() => {
      var e;
      return ((e = t.facts) == null ? void 0 : e.tasks) ?? [];
    }), j = r(() => f.value.filter((e) => e.state === "open")), x = r(() => {
      var e, a, d;
      return (e = t.facts) != null && e.job_enabled && (((a = t.facts) == null ? void 0 : a.task_title) || ((d = j.value[0]) == null ? void 0 : d.title)) || "";
    }), Q = r(() => {
      var e, a;
      return [t.row.program, (e = t.facts) == null ? void 0 : e.model, (a = t.facts) == null ? void 0 : a.effort, t.row.role === "main" ? "" : t.progress ? `${t.row.role} ${t.row.id}` : t.row.role, t.row.access === "read-only" ? "Access: Read-only" : ""].filter(Boolean).join(" · ");
    }), F = r(() => {
      var e, a;
      return t.row.ended_at && ((a = (e = t.facts) == null ? void 0 : e.job_returned) != null && a.startsWith(ft)) ? t.facts.job_returned : "";
    }), X = r(() => Re(t.row.process_started_at || t.row.created_at, U.value)), Z = /* @__PURE__ */ new Set(["open", "started", "testing"]), A = r(() => !!t.row.ended_at && t.row.role !== "main" && f.value.some((e) => Z.has(e.state))), ee = r(() => {
      var e;
      return t.waitReason || A.value ? "waiting" : t.row.state === "running" && ((e = t.facts) == null ? void 0 : e.state) || t.row.state;
    }), W = r(() => {
      var a, d, T;
      const e = [];
      return ((a = t.facts) == null ? void 0 : a.context_percent) !== null && ((d = t.facts) == null ? void 0 : d.context_percent) !== void 0 && e.push(`Context: ${t.facts.context_percent}%`), (T = t.facts) != null && T.cost_dollars && e.push(`$${t.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), te = r(() => {
      var e;
      return ((e = t.progress) == null ? void 0 : e.completed_count) ?? f.value.filter((a) => a.state === "completed").length;
    }), I = r(() => {
      var e;
      return ((e = t.progress) == null ? void 0 : e.task_count) ?? f.value.length;
    }), L = r(() => `${te.value} of ${I.value} ${I.value === 1 ? "task" : "tasks"}`), K = r(() => {
      var a;
      const e = xe(te.value, ((a = t.progress) == null ? void 0 : a.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, U.value);
      return t.row.role !== "main" && e ? `${e} per hour` : "";
    }), ae = r(() => f.value.length ? z.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: f.value.filter((a) => a.state === e || e === "started" && a.state === "testing" || e === "completed" && a.state === "cancelled") })) : []), _ = /* @__PURE__ */ new Set(["completed"]), $ = k({}), P = (e) => !($.value[e] ?? _.has(e)), E = (e) => $.value = { ...$.value, [e]: P(e) }, O = he(), D = r(() => t.row.access === "read-only"), N = r(() => D.value ? O.tabs.filter((e) => ["transcript", "terminal"].includes(e.key)) : O.tabs), h = k(N.value[0]);
    le(() => t.open, (e) => {
      e && (h.value = N.value[0]);
    });
    const ne = Object.fromEntries(O.tabs.filter((e) => e.component).map((e) => [e.key, be(() => Ae(e.component))])), G = r(() => t.row.role === "helper" && !t.row.ended_at), M = () => O.run(["helper", "stop", String(t.row.id)]), Y = k(!1), V = k(""), l = k(""), s = r(() => t.row.role !== "main" && (!t.row.ended_at || A.value || t.waitReason));
    async function u() {
      if (!s.value) return;
      const e = await O.read(`usage tool --agent ${t.row.id}`);
      V.value = e.ok ? e.value.tool : "", l.value = e.ok ? e.value.note : "";
    }
    const m = O.follow(["hook_call.*", "process_part.*"], u);
    return we(() => m == null ? void 0 : m()), u(), (e, a) => {
      var d, T;
      return o(), i("div", {
        class: re(["agent-card", { open: n.open }]),
        "data-agent-open": n.row.id,
        "aria-expanded": n.open,
        role: n.open ? void 0 : "button",
        tabindex: n.open ? void 0 : 0,
        title: n.row.session,
        onClick: a[4] || (a[4] = (w) => !n.open && c("toggle")),
        onKeydown: [
          a[5] || (a[5] = ve(J((w) => !n.open && c("toggle"), ["self", "prevent"]), ["enter"])),
          a[6] || (a[6] = ve(J((w) => !n.open && c("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        y("span", Qe, [
          n.open ? (o(), i("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: a[0] || (a[0] = J((w) => c("toggle"), ["stop"]))
          }, [
            b(v(ge), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : g("", !0),
          y("span", {
            class: "agent-dot",
            "data-state": ee.value,
            "data-agent-motion": ""
          }, null, 8, Xe),
          y("span", Ze, p(ue.value), 1),
          y("span", et, p(((d = n.facts) == null ? void 0 : d.given_name) || n.row.id), 1),
          n.open ? g("", !0) : (o(), C(v(ge), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          n.row.ended_at && !A.value ? (o(), C(v(Ee), {
            key: 2,
            class: "agent-time",
            at: n.row.ended_at,
            "data-agent-motion": ""
          }, null, 8, ["at"])) : (o(), i("span", tt, p(X.value), 1))
        ]),
        y("span", at, [
          y("span", nt, p(Q.value), 1),
          I.value && !x.value ? (o(), i("span", ot, p(L.value), 1)) : g("", !0)
        ]),
        x.value ? (o(), i("span", st, [
          y("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: x.value
          }, p(x.value), 9, lt),
          I.value ? (o(), i("span", rt, p(L.value), 1)) : g("", !0)
        ])) : g("", !0),
        !n.open && (s.value || I.value && K.value) ? (o(), i("span", {
          key: 1,
          class: re(["agent-foot", { "agent-work-start": !x.value }]),
          "data-agent-foot": ""
        }, [
          s.value ? (o(), C(fe, {
            key: 0,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: A.value,
            command: V.value,
            note: l.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : g("", !0),
          I.value && K.value ? (o(), i("span", it, p(K.value), 1)) : g("", !0)
        ], 2)) : g("", !0),
        n.open ? (o(), i("div", {
          key: 2,
          class: "agent-more",
          "data-agent-more": "",
          onClick: a[3] || (a[3] = J(() => {
          }, ["stop"]))
        }, [
          W.value ? (o(), i("div", ut, [
            y("span", ct, p(W.value), 1),
            G.value ? (o(), C(v(Oe), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: M
            }, {
              default: R(() => [...a[7] || (a[7] = [
                ce("Stop", -1)
              ])]),
              _: 1
            })) : g("", !0)
          ])) : g("", !0),
          s.value ? (o(), C(fe, {
            key: 1,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: A.value,
            command: V.value,
            note: l.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : g("", !0),
          F.value ? (o(), i("p", dt, p(F.value), 1)) : g("", !0),
          b(v(qe), {
            class: "agent-tabs",
            tabs: N.value,
            active: h.value,
            answer: { tasks: f.value.length },
            onChoose: a[1] || (a[1] = (w) => h.value = w)
          }, null, 8, ["tabs", "active", "answer"]),
          b(v(Be), {
            class: "agent-tab-body",
            tab: h.value,
            "data-agent-tab-body": (T = h.value) == null ? void 0 : T.key
          }, {
            default: R(() => {
              var w;
              return [
                b(v(je), {
                  value: (w = h.value) == null ? void 0 : w.key
                }, $e({
                  tasks: R(() => {
                    var q;
                    return [
                      f.value.length ? g("", !0) : (o(), C(v(Ie), {
                        key: 0,
                        title: "No tasks"
                      }, {
                        default: R(() => [...a[8] || (a[8] = [
                          ce("No tasks have been assigned to this agent.", -1)
                        ])]),
                        _: 1
                      })),
                      (o(!0), i(se, null, de(ae.value, (B) => (o(), C(Ye, {
                        key: B.state,
                        section: B,
                        open: P(B.state),
                        onToggle: (bt) => E(B.state)
                      }, null, 8, ["section", "open", "onToggle"]))), 128)),
                      (q = n.facts) != null && q.instruction ? (o(), i(se, { key: 1 }, [
                        a[9] || (a[9] = y("p", { class: "agent-label" }, "Instruction", -1)),
                        y("div", gt, p(n.facts.instruction), 1)
                      ], 64)) : g("", !0)
                    ];
                  }),
                  transcript: R(() => {
                    var q;
                    return [
                      D.value ? (o(), i(se, { key: 0 }, [
                        (q = n.facts) != null && q.instruction ? (o(), i("div", vt, [
                          b(v(ke), {
                            label: "Instruction",
                            open: Y.value,
                            "data-agent-section": "instruction",
                            onToggle: a[2] || (a[2] = (B) => Y.value = !Y.value)
                          }, {
                            default: R(() => [
                              y("div", pt, p(n.facts.instruction), 1)
                            ]),
                            _: 1
                          }, 8, ["open"])
                        ])) : n.facts && n.row.ended_at ? (o(), i("p", mt, "No job recorded")) : g("", !0)
                      ], 64)) : g("", !0),
                      b(Le, {
                        line: `agent transcript ${n.row.id}`,
                        agent: D.value ? G.value ? n.row.id : null : n.row.id,
                        helper: D.value && G.value,
                        padding: "0"
                      }, null, 8, ["line", "agent", "helper"])
                    ];
                  }),
                  _: 2
                }, [
                  de(v(ne), (q, B) => ({
                    name: B,
                    fn: R(() => [
                      (o(), C(Se(q), {
                        agent: n.row.id
                      }, null, 8, ["agent"]))
                    ])
                  }))
                ]), 1032, ["value"])
              ];
            }),
            _: 1
          }, 8, ["tab", "data-agent-tab-body"])
        ])) : g("", !0)
      ], 42, Je);
    };
  }
}, yt = /* @__PURE__ */ ie(wt, [["__scopeId", "data-v-b75ee764"]]), kt = ["data-agent-row"], oe = "cubic-bezier(0.2, 0.9, 0.25, 1)", ht = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(n) {
    const H = [
      { key: "running", label: "Running" },
      { key: "idle", label: "Idle" },
      { key: "retired", label: "Retired" },
      { key: "all", label: "All" }
    ], S = n, { rows: z } = Ne("usage agents --closed", ["agent.*", "task.*"]), { rows: t } = me("waits"), { rows: c } = me("progress"), U = (l) => c.value.find((s) => s.agent_id === l.id) ?? null, ue = (l) => {
      var s;
      return ((s = t.value.find((u) => u.agent_id === l.id)) == null ? void 0 : s.reason) ?? "";
    }, f = k("running"), j = k(""), x = he(), Q = k([]), F = k(""), X = k(!1), Z = k(!1), A = k(25);
    let ee = 0;
    async function W() {
      const l = ++ee, s = await x.read(`${S.line} --show ${f.value} --search ${JSON.stringify(j.value)} --limit ${A.value}`);
      l === ee && (Q.value = s.ok ? s.value.rows : [], F.value = s.ok ? "" : s.error, Z.value = s.ok && s.value.page * s.value.size < s.value.total, X.value = !0);
    }
    async function te() {
      return A.value += 25, await W(), !0;
    }
    le([f, j], () => {
      A.value = 25, W();
    }), x.follow(["agent.*", "task.*", ...x.sources.flatMap((l) => l.events)], W), W();
    const I = (l) => z.value.find((s) => s.id === l.id) ?? null, L = Q, K = r(() => !!j.value.trim()), ae = r(() => S.texts[f.value] ?? { title: S.empty, hint: "" }), _ = k(null), $ = k(null), P = k(null), E = r(() => L.value.find((l) => l.id === _.value) ?? null), O = r(() => E.value ? [E.value] : L.value), D = r(() => L.value.length - O.value.length), N = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let h = !1, ne = 0;
    async function G(l) {
      if (h) return;
      h = !0, ne = P.value.scrollTop;
      const s = $.value.querySelector(`[data-agent-open="${l.id}"]`);
      if (!N()) {
        const a = [...$.value.querySelectorAll(".agent-row")].filter((d) => !d.contains(s));
        await Promise.all(a.map((d) => d.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const u = [...s.querySelectorAll(".agent-head, .agent-line")], m = [...u, ...s.querySelectorAll("[data-agent-motion]")], e = m.map((a) => a.getBoundingClientRect());
      if (_.value = l.id, await pe(), !N()) {
        const a = m.map((d) => d.getBoundingClientRect());
        m.forEach((d, T) => {
          const w = u.indexOf(d.parentElement), q = e[T].left - a[T].left - (w < 0 ? 0 : e[w].left - a[w].left), B = e[T].top - a[T].top - (w < 0 ? 0 : e[w].top - a[w].top);
          d.animate([{ transform: `translate(${q}px, ${B}px)` }, { transform: "none" }], { duration: 280, easing: oe });
        }), $.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((d) => {
          d.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: oe, fill: "backwards" });
        });
      }
      h = !1;
    }
    async function M() {
      if (h || !E.value) return;
      h = !0;
      const l = $.value.querySelector(`[data-agent-open="${_.value}"]`), s = [...l.children, ...$.value.querySelectorAll(".agents-held")], u = N() ? [] : s.map((m) => m.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(u.map((m) => m.finished)), _.value = null, await pe(), P.value.scrollTop = ne, u.forEach((m) => m.cancel()), N() || (l.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: oe }), $.value.querySelectorAll(".agent-row").forEach((m) => {
        m.contains(l) || m.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: oe });
      })), h = !1;
    }
    const Y = (l) => _.value === l.id ? M() : G(l);
    le(j, (l) => l.trim() && (_.value = null)), le(f, () => {
      _.value = null;
    });
    const V = (l) => {
      l.key === "Escape" && M();
    };
    return window.addEventListener("keydown", V), we(() => window.removeEventListener("keydown", V)), (l, s) => (o(), i("div", {
      ref_key: "agents",
      ref: $,
      class: re(["agents", { focused: E.value }])
    }, [
      b(v(We), {
        modelValue: j.value,
        "onUpdate:modelValue": s[1] || (s[1] = (u) => j.value = u),
        placeholder: "Search agents",
        "data-agents-search": ""
      }, {
        default: R(() => [
          b(v(De), {
            options: H,
            value: f.value,
            onPick: s[0] || (s[0] = (u) => f.value = u)
          }, null, 8, ["value"])
        ]),
        _: 1
      }, 8, ["modelValue"]),
      y("div", {
        ref_key: "list",
        ref: P,
        class: re(["agents-view", { "agents-view-open": E.value }])
      }, [
        b(v(He), {
          rows: O.value,
          failure: F.value,
          loaded: X.value,
          more: !E.value && Z.value,
          older: te,
          empty: ae.value.title,
          hint: ae.value.hint,
          searching: K.value
        }, {
          default: R(({ row: u }) => [
            y("div", {
              class: "agent-row",
              "data-agent-row": u.id
            }, [
              b(yt, {
                row: u,
                facts: I(u),
                progress: U(u),
                "wait-reason": ue(u),
                open: u.id === _.value,
                onToggle: (m) => Y(u)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, kt)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"])
      ], 2),
      E.value && D.value ? (o(), i("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: M
      }, p(D.value) + " more", 1)) : g("", !0)
    ], 2));
  }
}, Tt = /* @__PURE__ */ ie(ht, [["__scopeId", "data-v-aae3aacb"]]);
export {
  Tt as A
};
