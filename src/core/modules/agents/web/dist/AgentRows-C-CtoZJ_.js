import { openBlock as a, createElementBlock as o, withModifiers as ge, unref as h, createTextVNode as b, toDisplayString as g, createVNode as M, createBlock as z, createElementVNode as C, createCommentVNode as m, withCtx as x, Fragment as H, renderList as ae, computed as d, ref as W, watch as ce, onUnmounted as xe, defineAsyncComponent as Je, createSlots as Ye, resolveDynamicComponent as Qe, normalizeClass as se, normalizeStyle as _e, renderSlot as $e, onMounted as Xe, Teleport as et, mergeProps as tt, toRef as Re, withKeys as Ee, nextTick as Ne } from "vue";
import { peekRef as Se, Icon as Oe, RunningCommand as at, TimeAgo as Fe, FoldGroup as Pe, TaskStatusIcon as nt, useWindow as Ve, loadWindowComponent as ot, coalesced as st, READ_RATES as lt, eventMayBeChildOf as rt, InnerTabs as it, TabBody as ct, SwitchCase as dt, EmptyState as ze, HoverTip as be, TaskBar as ut, useNow as Ge, age as ht, perHour as gt, sinceWords as pt, seenWords as vt, AgentTip as ft, SearchBar as mt, Segmented as kt, MenuLabel as Be, MenuItem as Le, Btn as yt, RowList as wt, toggleFilter as bt } from "@journal/window-kit";
import { _ as Z, T as Mt } from "./TranscriptRows-Crmxs6Un.js";
const xt = {
  class: "agent-command",
  "data-agent-command": ""
}, $t = {
  key: 1,
  "data-agent-stopped": ""
}, St = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (s, n) => (a(), o("span", xt, [
      e.waitReason ? (a(), o("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: n[0] || (n[0] = ge((i) => h(Se)("test_queue:0"), ["stop"]))
      }, [
        b("Waiting: " + g(e.waitReason) + " ", 1),
        M(h(Oe), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), o("span", $t, "Waiting")) : (a(), z(h(at), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, Ct = /* @__PURE__ */ Z(St, [["__scopeId", "data-v-1b371fb5"]]), Tt = {
  key: 0,
  class: "lasting-facts",
  "data-agent-lasting-facts": ""
}, At = { "data-agent-retired-at": "" }, Lt = { key: 0 }, jt = { "data-agent-retired-by": "" }, _t = {
  __name: "AgentLastingFacts",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    return (s, n) => e.row.retired_at ? (a(), o("dl", Tt, [
      C("div", null, [
        n[0] || (n[0] = C("dt", null, "Retired", -1)),
        C("dd", At, [
          M(h(Fe), {
            at: e.row.retired_at
          }, null, 8, ["at"])
        ])
      ]),
      e.row.retiring_actor_name ? (a(), o("div", Lt, [
        n[1] || (n[1] = C("dt", null, "Retired by", -1)),
        C("dd", jt, g(e.row.retiring_actor_name), 1)
      ])) : m("", !0)
    ])) : m("", !0);
  }
}, Rt = /* @__PURE__ */ Z(_t, [["__scopeId", "data-v-abc8e12a"]]), Bt = ["data-agent-delegated", "onClick"], Ot = { class: "agent-task-number" }, zt = { class: "agent-task-title" }, Vt = ["title"], It = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: s }) {
    const n = s;
    return (i, r) => (a(), z(h(Pe), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: r[0] || (r[0] = (t) => n("toggle"))
    }, {
      default: x(() => [
        (a(!0), o(H, null, ae(e.section.tasks, (t) => (a(), o("button", {
          key: t.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": t.id,
          onClick: (f) => h(Se)(`tasks:${t.id}`)
        }, [
          M(h(nt), {
            status: t.state
          }, null, 8, ["status"]),
          C("span", Ot, g(t.id), 1),
          C("span", zt, g(t.title), 1),
          t.plan_id ? (a(), o("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${t.plan_id}: ${t.plan_title}`
          }, "Plan " + g(t.plan_id), 9, Vt)) : m("", !0)
        ], 8, Bt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Ht = /* @__PURE__ */ Z(It, [["__scopeId", "data-v-ea4ccd6b"]]), Et = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Nt = {
  key: 1,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, Wt = ["data-peek", "onClick"], qt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Dt = {
  key: 0,
  class: "agent-helper-brief"
}, Ft = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Pt = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Gt = "It ended without a report", Ut = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const s = e, n = ["started", "blocked", "open", "completed"], i = d(() => {
      var p, c;
      return s.row.ended_at && ((c = (p = s.facts) == null ? void 0 : p.job_returned) != null && c.startsWith(Gt)) ? s.facts.job_returned : "";
    }), r = d(() => s.tasks.length ? n.map((p) => ({ state: p, label: p.slice(0, 1).toUpperCase() + p.slice(1), tasks: s.tasks.filter((c) => c.state === p || p === "started" && c.state === "testing" || p === "completed" && c.state === "cancelled") })) : []), t = /* @__PURE__ */ new Set(["completed"]), f = W({}), $ = (p) => !(f.value[p] ?? t.has(p)), A = (p) => f.value = { ...f.value, [p]: $(p) }, T = Ve(), { rows: V } = T.props.reports;
    T.state["reports.agent"] = String(s.row.number);
    const E = d(() => s.row.access === "read-only"), I = ["tasks", "transcript", "terminal", "file-feed", "processes", "reports", "memories"], F = d(() => [...T.tabs].sort((p, c) => (I.indexOf(p.key) < 0 ? I.length : I.indexOf(p.key)) - (I.indexOf(c.key) < 0 ? I.length : I.indexOf(c.key)))), j = d(() => !!s.row.retired_at || s.row.state === "retired"), R = () => E.value || j.value ? F.value.find((p) => p.key === "transcript") : F.value[0], O = W(R());
    ce(O, (p) => {
      T.state.tab = (p == null ? void 0 : p.key) ?? "";
    }, { immediate: !0 }), xe(() => {
      T.state.tab = "";
    }), ce(F, (p) => {
      p.some((c) => {
        var l;
        return c.key === ((l = O.value) == null ? void 0 : l.key);
      }) || (O.value = p[0]);
    }), ce(() => s.open, (p) => {
      p && (O.value = R());
    });
    const G = Object.fromEntries(T.tabs.filter((p) => p.component).map((p) => [p.key, Je(() => ot(p.component))])), U = W(!1), { data: X } = T.props.tool, le = d(() => {
      var p;
      return ((p = X.value) == null ? void 0 : p.tool) ?? "";
    }), Y = d(() => {
      var p;
      return ((p = X.value) == null ? void 0 : p.note) ?? "";
    }), q = d(() => s.row.role !== "main" && (!s.row.ended_at || s.stoppedWithWork || s.waitReason));
    async function k() {
      !s.open || !q.value || (T.state["tool.agent"] = String(s.row.number), await T.reload("tool"));
    }
    const u = st(k, lt.agentCommand), P = T.follow(["hook_call.*", "process_part.*"], (p) => rt(p, "session_agent_id", /* @__PURE__ */ new Set([s.row.id])) && u());
    return xe(() => P == null ? void 0 : P()), ce(() => s.open, (p) => {
      p && k();
    }, { immediate: !0 }), (p, c) => {
      var l;
      return a(), o("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: c[2] || (c[2] = ge(() => {
        }, ["stop"]))
      }, [
        M(Rt, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (a(), o("p", Et, "Retirement reason: " + g(e.row.retirement_reason), 1)) : m("", !0),
        i.value ? (a(), o("p", Nt, g(i.value), 1)) : m("", !0),
        M(h(it), {
          class: "agent-tabs",
          tabs: F.value,
          active: O.value,
          answer: { tasks: e.tasks.length, reports: e.row.report_count ?? h(V).length, memories: e.row.memory_count ?? 0 },
          onChoose: c[0] || (c[0] = (L) => O.value = L)
        }, null, 8, ["tabs", "active", "answer"]),
        M(h(ct), {
          class: "agent-tab-body",
          tab: O.value,
          "data-agent-tab-body": (l = O.value) == null ? void 0 : l.key
        }, {
          default: x(() => {
            var L;
            return [
              M(h(dt), {
                value: (L = O.value) == null ? void 0 : L.key
              }, Ye({
                reports: x(() => [
                  h(V).length ? m("", !0) : (a(), z(h(ze), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: x(() => [...c[3] || (c[3] = [
                      b("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (a(!0), o(H, null, ae(h(V), (B) => (a(), o("button", {
                    key: B.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${B.id}`,
                    onClick: (D) => h(Se)(`messages:${B.id}`)
                  }, g(B.text), 9, Wt))), 128))
                ]),
                tasks: x(() => {
                  var B;
                  return [
                    e.tasks.length ? m("", !0) : (a(), z(h(ze), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: x(() => [...c[4] || (c[4] = [
                        b("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (a(!0), o(H, null, ae(r.value, (D) => (a(), z(Ht, {
                      key: D.state,
                      section: D,
                      open: $(D.state),
                      onToggle: (ie) => A(D.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (B = e.facts) != null && B.instruction ? (a(), o(H, { key: 1 }, [
                      c[5] || (c[5] = C("p", { class: "agent-label" }, "Instruction", -1)),
                      C("div", qt, g(e.facts.instruction), 1)
                    ], 64)) : m("", !0)
                  ];
                }),
                transcript: x(() => {
                  var B;
                  return [
                    E.value ? (a(), o(H, { key: 0 }, [
                      (B = e.facts) != null && B.instruction ? (a(), o("div", Dt, [
                        M(h(Pe), {
                          label: "Instruction",
                          open: U.value,
                          "data-agent-section": "instruction",
                          onToggle: c[1] || (c[1] = (D) => U.value = !U.value)
                        }, {
                          default: x(() => [
                            C("div", Ft, g(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (a(), o("p", Pt, "No job recorded")) : m("", !0)
                    ], 64)) : m("", !0),
                    M(Mt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                ae(h(G), (B, D) => ({
                  name: D,
                  fn: x(() => [
                    (a(), z(Qe(B), {
                      agent: e.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ];
          }),
          _: 1
        }, 8, ["tab", "data-agent-tab-body"]),
        q.value ? (a(), z(Ct, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: le.value,
          note: Y.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0)
      ]);
    };
  }
}, Kt = /* @__PURE__ */ Z(Ut, [["__scopeId", "data-v-fabbecdf"]]), Zt = { class: "line" }, Jt = {
  key: 0,
  class: "line",
  "data-agent-since": ""
}, Yt = {
  key: 1,
  class: "line",
  "data-agent-seen": ""
}, Qt = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" }, seen: { type: String, default: "" } },
  setup(e) {
    const s = /* @__PURE__ */ new Set(["running", "working", "thinking"]), n = e, i = d(() => s.has(n.state)), r = d(() => [n.doing, n.since, n.seen].filter(Boolean).join(". "));
    return (t, f) => (a(), z(h(be), {
      as: "button",
      place: "corner",
      class: se(["agent-dot", { pulse: i.value }]),
      "data-state": e.state,
      "aria-label": r.value,
      "data-agent-status": "",
      onClick: f[0] || (f[0] = ge(() => {
      }, ["stop"]))
    }, {
      tip: x(() => [
        C("b", Zt, g(e.doing), 1),
        e.since ? (a(), o("span", Jt, g(e.since), 1)) : m("", !0),
        e.seen ? (a(), o("span", Yt, g(e.seen), 1)) : m("", !0)
      ]),
      default: x(() => [
        f[1] || (f[1] = C("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, Xt = /* @__PURE__ */ Z(Qt, [["__scopeId", "data-v-1a0bc478"]]), ea = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, ta = (e) => e.filter((s) => s.state !== "cancelled"), We = (e, s) => e.filter((n) => n.state === s).length, aa = 5, na = (e, s) => e || s.split(/\s+/).slice(0, aa).join(" ");
function oa({ tasks: e, inHand: s, perHour: n }) {
  const i = ta(e), r = We(i, "completed"), t = ea[s == null ? void 0 : s.state], f = i.filter((V) => V.state === "started").map((V) => ({ number: V.id, title: V.title })), $ = Math.max(f.length, s && s.state !== "completed" ? 1 : 0), A = i.length - r - $, T = r === i.length;
  return {
    number: s.id,
    title: s.title,
    started: f,
    plan: s.plan_id ?? 0,
    count: `${r} of ${i.length}`,
    taskTip: `${r} of its ${i.length} tasks done${t ? `. This one is ${t.words}.` : "."}`,
    countTip: T ? `All ${i.length} tasks done` : `${r} done, ${$} in hand, ${A} to go`,
    paceTip: !T && n ? `About ${n} an hour.` : "",
    rate: !T && n ? `${Math.round(n)}/hour` : "",
    bar: { total: i.length, done: r, testing: We(i, "testing") }
  };
}
const sa = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, la = {
  key: 0,
  class: "plan",
  "data-agent-job-launch": ""
}, ra = {
  class: "task-line",
  "data-agent-task-line": ""
}, ia = {
  key: 0,
  class: "tasks",
  "data-agent-tasks": ""
}, ca = {
  key: 2,
  class: "plan",
  "data-agent-plan": ""
}, da = {
  key: 3,
  class: "rate",
  "data-agent-rate": ""
}, ua = { key: 0 }, ha = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, jobTitle: { type: String, default: "" }, jobLaunch: { type: String, default: "" }, perHour: { type: Number, default: 0 } },
  setup(e) {
    const s = e, n = d(() => s.inHand ? oa({ tasks: s.tasks, inHand: s.inHand, perHour: s.perHour }) : null);
    return (i, r) => e.job && !n.value ? (a(), o("span", sa, [
      M(h(be), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: x(() => [
          C("b", null, g(e.job), 1)
        ]),
        default: x(() => [
          b(g(h(na)(e.jobTitle, e.job)), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (a(), o("span", la, g(e.jobLaunch), 1)) : m("", !0)
    ])) : n.value ? (a(), o(H, { key: 1 }, [
      C("span", ra, [
        n.value.started.length > 1 ? (a(), o("span", ia, [
          r[1] || (r[1] = b("Tasks ", -1)),
          (a(!0), o(H, null, ae(n.value.started, (t, f) => (a(), o(H, {
            key: t.number
          }, [
            f ? (a(), o(H, { key: 0 }, [
              b(", ")
            ], 64)) : m("", !0),
            M(h(be), {
              as: "button",
              class: "task",
              "data-agent-task": "",
              "data-peek": `tasks:${t.number}`,
              "aria-label": `Task ${t.number}: ${t.title}`,
              onClick: ge(($) => h(Se)(`tasks:${t.number}`), ["stop"])
            }, {
              tip: x(() => [
                C("b", null, g(t.title), 1)
              ]),
              default: x(() => [
                b(g(t.number), 1)
              ]),
              _: 2
            }, 1032, ["data-peek", "aria-label", "onClick"])
          ], 64))), 128))
        ])) : (a(), z(h(be), {
          key: 1,
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${n.value.number}`,
          "aria-label": `Task ${n.value.number}: ${n.value.title}`,
          onClick: r[0] || (r[0] = ge((t) => h(Se)(`tasks:${n.value.number}`), ["stop"]))
        }, {
          tip: x(() => [
            C("b", null, g(n.value.title), 1),
            C("span", null, g(n.value.taskTip), 1)
          ]),
          default: x(() => [
            b("Task " + g(n.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])),
        n.value.plan ? (a(), o("span", ca, "Plan " + g(n.value.plan), 1)) : m("", !0),
        n.value.rate ? (a(), o("span", da, g(n.value.rate), 1)) : m("", !0),
        M(h(be), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: x(() => [
            C("b", null, g(n.value.countTip), 1),
            n.value.paceTip ? (a(), o("span", ua, g(n.value.paceTip), 1)) : m("", !0)
          ]),
          default: x(() => [
            b(g(n.value.count), 1)
          ]),
          _: 1
        })
      ]),
      M(h(ut), {
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: n.value.bar.total,
        done: n.value.bar.done,
        testing: n.value.bar.testing
      }, null, 8, ["total", "done", "testing"])
    ], 64)) : m("", !0);
  }
}, ga = /* @__PURE__ */ Z(ha, [["__scopeId", "data-v-e51f5781"]]), pa = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', va = ["data-icon", "stroke-width", "innerHTML"], J = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const s = e, n = { right: 0, down: 90, left: 180, up: 270 }, i = {
      mail: "inbox",
      circle: "todos",
      play: "work",
      flag: "plan",
      file: "docs",
      report: "reports",
      pin: "pins",
      list: "rules",
      clock: "reminders",
      help: "questions",
      bubble: "inbox",
      wrench: "tools",
      brush: "style",
      band: "rules",
      smile: "smile",
      bot: "agents",
      panel: "activity",
      x: "close",
      check: "todos",
      clip: "paperclip",
      send: "arrow",
      more: "dots",
      chevron: "arrow"
    }, r = {
      agent: pa,
      time: '<circle cx="8" cy="8" r="5.5"/><path d="M8 4.5V8l2.4 1.5"/>',
      allowance: '<path d="M3 4.5h10v7H3zM5 6.5h1M10 9.5h1"/><circle cx="8" cy="8" r="1.4"/>',
      phone: '<rect x="4.5" y="1.5" width="7" height="13" rx="1.6"/><path d="M7 12.2h2"/>',
      key: '<circle cx="5.5" cy="10.5" r="2.8"/><path d="M7.5 8.5 13 3M10.8 5.2l1.7 1.7M9.2 6.8l1.2 1.2"/>',
      terminal: '<path d="M2 3.5h12v9H2zM4.8 6.4 6.9 8l-2.1 1.6M8.4 10h3"/>',
      trash: '<path d="M3 4.5h10M6.4 4.5V3h3.2v1.5M4.4 4.5l.7 8.5h5.8l.7-8.5"/>',
      chat: '<path d="M2.5 3h11v7.5H8L5 13v-2.5H2.5z"/>',
      edits: '<path d="M8 3v6M5 6h6M5 12.5h6"/>',
      gauge: '<path d="M2.6 11.5a5.4 5.4 0 1 1 10.8 0"/><path d="M8 11.5 10.4 7.4"/><circle cx="8" cy="11.5" r=".6" fill="currentColor"/>',
      hook: '<path d="M8 2v7.6a2.9 2.9 0 1 1-2.9-2.9"/><circle cx="8" cy="2.6" r=".7" fill="currentColor"/>',
      request: '<path d="M3 5.2h9.4M10 2.9l2.4 2.3L10 7.5"/><path d="M13 10.8H3.6M6 8.5l-2.4 2.3L6 13.1"/>',
      heart: '<path d="M8 13.2 3.2 8.4a2.9 2.9 0 0 1 4.1-4.1L8 5l.7-.7a2.9 2.9 0 0 1 4.1 4.1z"/>',
      weight: '<path d="M2.5 13.5h11l-1.6-7.5H4.1zM6 6a2 2 0 1 1 4 0"/>',
      points: '<path d="M3 13.2V8.6M6.7 13.2V5.4M10.4 13.2V9.8M14 13.2V2.8" stroke-linecap="round"/>',
      bolt: '<path d="M9.2 2 4.2 8.8h3.6L6.8 14l5-6.8H8.2z"/>',
      bulb: '<path d="M5.4 9.9a4.3 4.3 0 1 1 5.2 0c-.45.35-.7.85-.7 1.4v.2H6.1v-.2c0-.55-.25-1.05-.7-1.4Z"/><path d="M6.3 13.5h3.4"/>',
      todos: '<circle cx="8" cy="8" r="5.75"/><path d="M5.6 8.1l1.7 1.7 3.2-3.5"/>',
      task: '<rect x="3.5" y="2.5" width="9" height="11.5" rx="1.4"/><path d="M6.2 2.5V1.6h3.6v.9M5.8 6.4h4.4M5.8 8.9h4.4M5.8 11.4h2.6"/>',
      pins: '<path d="M8 14V9.5M5 2.5h6M6 2.5v3.5L4 9.5h8L10 6V2.5"/>',
      style: '<path d="M5.5 4.5 2.5 8l3 3.5M10.5 4.5l3 3.5-3 3.5M9 3.5l-2 9"/>',
      warn: '<path d="M8 2.6 14 13H2zM8 6.6v3.2M8 11.6v.1"/>',
      book: '<path d="M8 4.4c-1.7-1.2-3.8-1.5-6-.9v9c2.2-.6 4.3-.3 6 .9 1.7-1.2 3.8-1.5 6-.9v-9c-2.2-.6-4.3-.3-6 .9Z"/><path d="M8 4.4v9"/>',
      auto: '<path d="M5 3.4 12.4 8 5 12.6z" fill="currentColor" stroke-width="1"/>',
      branch: '<circle cx="5" cy="3.6" r="1.6"/><circle cx="5" cy="12.4" r="1.6"/><circle cx="11.6" cy="5.4" r="1.6"/><path d="M5 5.2v5.6M11.6 7v.6a3.6 3.6 0 0 1-3.6 3.6H6.6"/>',
      scheme: '<circle cx="8" cy="8" r="5.75"/><path d="M8 2.25a5.75 5.75 0 0 1 0 11.5z" fill="currentColor" stroke="none"/>',
      wide: '<path d="M6.2 2.6H2.6v3.6M9.8 2.6h3.6v3.6M6.2 13.4H2.6V9.8M9.8 13.4h3.6V9.8"/>',
      narrow: '<path d="M2.6 6.2h3.6V2.6M13.4 6.2H9.8V2.6M2.6 9.8h3.6v3.6M13.4 9.8H9.8v3.6"/>',
      up: '<path d="M8 12.5V4M4.5 7.5L8 4l3.5 3.5"/>',
      down: '<path d="M8 3.5V12M4.5 8.5L8 12l3.5-3.5"/>',
      board: '<rect x="1.8" y="2.5" width="12.4" height="11" rx="2"/><rect x="3.6" y="4.4" width="2.4" height="4" rx=".5" fill="currentColor" stroke="none"/><rect x="3.6" y="9.4" width="2.4" height="2.2" rx=".5" fill="currentColor" stroke="none"/><rect x="6.8" y="4.4" width="2.4" height="5.6" rx=".5" fill="currentColor" stroke="none"/><rect x="10" y="4.4" width="2.4" height="2.4" rx=".5" fill="currentColor" stroke="none"/><rect x="10" y="7.8" width="2.4" height="3.2" rx=".5" fill="currentColor" stroke="none"/>',
      ticket: '<path d="M2.5 4.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v1.75a1.75 1.75 0 0 0 0 3.5v1.75a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1V9.75a1.75 1.75 0 0 0 0-3.5z"/><path d="M6.5 5v1M6.5 7.5v1M6.5 10v1"/>',
      download: '<path d="M8 2.5v7.5M5 7l3 3 3-3"/><path d="M3 11v2h10v-2"/>',
      upload: '<path d="M8 10V2.5M5 5.5l3-3 3 3"/><path d="M3 11v2h10v-2"/>',
      open: '<path d="M9 3.5h3.5V7"/><path d="M12.5 3.5L7.5 8.5"/><path d="M11 9.5v3H3.5V5h3"/>',
      sidepanel: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9.5 3v10"/>',
      columns: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M8 3v10"/>',
      rows: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M2.5 8h11"/>',
      tab: '<path d="M2.5 5.5h11V13h-11zM2.5 5.5V3h5v2.5"/>',
      float: '<rect x="5.5" y="5.5" width="8" height="7.5" rx="1"/><path d="M2.5 10.5V3h8"/>',
      minimize: '<path d="M4 8h8"/>',
      chapters: '<path d="M2.5 4h6M2.5 8h11M2.5 12h8"/><path d="M11 2.2v3.6l1.2-.9 1.2.9V2.2"/>',
      reply: '<path d="M6.5 4.2 3 7.6l3.5 3.4"/><path d="M3.4 7.6h5.4a4 4 0 0 1 4 4v1.2"/>',
      copy: '<rect x="5.5" y="5.5" width="8" height="8" rx="1.6"/><path d="M10.5 3.8V3.6A1.6 1.6 0 0 0 8.9 2H4.1A1.6 1.6 0 0 0 2.5 3.6v4.8A1.6 1.6 0 0 0 4.1 10h.2"/>',
      broadcast: '<circle cx="8" cy="8" r="1.3"/><path d="M5.4 5.2a4 4 0 0 0 0 5.6"/><path d="M10.6 5.2a4 4 0 0 1 0 5.6"/><path d="M3.2 2.9a7 7 0 0 0 0 10.2"/><path d="M12.8 2.9a7 7 0 0 1 0 10.2"/>',
      artboard: '<path d="M5 2.5v11M11 2.5v11M2.5 5h11M2.5 11h11"/>',
      webpage: '<rect x="2.5" y="3" width="11" height="10" rx="1.6"/><path d="M2.5 5.8h11M5 8.6h6M5 10.6h3.6"/>',
      pull: '<circle cx="4.5" cy="3.8" r="1.5"/><circle cx="4.5" cy="12.2" r="1.5"/><circle cx="11.5" cy="12.2" r="1.5"/><path d="M4.5 5.3v5.4M11.5 10.7V7.2a2.2 2.2 0 0 0-2.2-2.2H7.4M8.8 3.4 7.2 5l1.6 1.6"/>',
      window: '<rect x="3.5" y="3.5" width="9" height="9" rx="1.5"/>',
      dock: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M8 5.5V10M5.8 7.8 8 10l2.2-2.2"/>',
      restore: '<path d="M3 8a5 5 0 1 0 1.5-3.55"/><path d="M3 2.75V5h2.25"/>',
      caret: '<path d="M5 6.5l3 3 3-3"/>',
      share: '<path d="M5.5 6H4.5A1.5 1.5 0 0 0 3 7.5v5A1.5 1.5 0 0 0 4.5 14h7a1.5 1.5 0 0 0 1.5-1.5v-5A1.5 1.5 0 0 0 11.5 6h-1"/><path d="M8 9.5V2M5.75 4.25L8 2l2.25 2.25"/>',
      floppy: '<path d="M3 4.5A1.5 1.5 0 0 1 4.5 3h6.4L13 5.1v6.4a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 11.5z"/><path d="M5.5 3v3h4.5V3"/><rect x="5" y="8.5" width="6" height="4.5" rx="0.6"/>',
      saveinto: '<path d="M5.5 3H4a1.5 1.5 0 0 0-1.5 1.5v7A1.5 1.5 0 0 0 4 13h8a1.5 1.5 0 0 0 1.5-1.5v-7A1.5 1.5 0 0 0 12 3h-1.5"/><path d="M8 1.75v6.5M5.75 6l2.25 2.25L10.25 6"/><path d="M5 10.75h6"/>',
      tiles: '<rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="9" y="2.5" width="4.5" height="4.5" rx="1"/><rect x="2.5" y="9" width="4.5" height="4.5" rx="1"/><rect x="9" y="9" width="4.5" height="4.5" rx="1"/>',
      palette: '<path d="M8 2.5a5.5 5.5 0 1 0 0 11c.8 0 1.2-.5 1.2-1.1 0-.9-.8-1.2-.8-2 0-.6.5-1 1.1-1h1.6a2.4 2.4 0 0 0 2.4-2.4C13.5 4.6 11.1 2.5 8 2.5z"/><circle cx="5.3" cy="7.2" r=".6"/><circle cx="7.4" cy="5.1" r=".6"/><circle cx="10.2" cy="5.4" r=".6"/>',
      pause: '<path d="M5.8 4v8M10.2 4v8"/>',
      stop: '<path d="M4.5 4.5h7v7h-7z"/>',
      phone: '<rect x="4.5" y="1.5" width="7" height="13" rx="1.6"/><path d="M7 12.2h2"/>',
      resume: '<path d="M5.5 3.8v8.4L12.2 8z"/>',
      tick: '<path d="M3.8 8.3l2.6 2.6 5.8-6.1"/>',
      ring: '<circle cx="8" cy="8" r="5.25" stroke-width="2"/>',
      checkbox: '<rect x="2.75" y="2.75" width="10.5" height="10.5" rx="2.5"/><path d="M5.4 8.1l1.8 1.8 3.5-3.7"/>',
      layout: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9 3v10M9 8h4.5"/>',
      info: '<circle cx="8" cy="8" r="5.75"/><path d="M8 7.3v3.4"/><path d="M8 5.1v.1"/>',
      bell: '<path d="M4.5 11V7.5a3.5 3.5 0 0 1 7 0V11l1 1.5h-9z"/><path d="M6.8 13.5a1.3 1.3 0 0 0 2.4 0"/>',
      activity: '<rect x="2.5" y="3" width="11" height="10" rx="1.5"/><path d="M9.5 3v10M11 6h1M11 8.5h1"/>',
      arrow: '<path d="M3.5 8h9M9 4.5L12.5 8 9 11.5"/>',
      chevronRight: '<path d="M6 3 11 8 6 13"/>',
      back: '<path d="M12.5 8h-9M7 4.5L3.5 8 7 11.5"/>',
      paperclip: '<path d="M10.5 5.5l-4.3 4.3a1.3 1.3 0 0 0 1.8 1.8l4.6-4.6a2.6 2.6 0 0 0-3.7-3.7L4.3 8a3.9 3.9 0 0 0 5.5 5.5l3.7-3.7"/>',
      crosshair: '<circle cx="8" cy="8" r="4.2"/><path d="M8 1.5v3M8 11.5v3M1.5 8h3M11.5 8h3"/>',
      camera: '<path d="M2 5.5h2.6l1.2-1.8h4.4l1.2 1.8H14v7.5H2z"/><circle cx="8" cy="9" r="2.3"/>',
      wheel: '<circle cx="8" cy="8" r="5.6"/><circle cx="8" cy="8" r="1.6"/><path d="M8 2.4v4M8 9.6v4M2.4 8h4M9.6 8h4"/>',
      model: '<path d="M8 2.2c.5 2.9 2 4.4 4.9 4.9-2.9.5-4.4 2-4.9 4.9-.5-2.9-2-4.4-4.9-4.9 2.9-.5 4.4-2 4.9-4.9z"/><path d="M12.6 10.6c.2 1.1.8 1.7 1.9 1.9-1.1.2-1.7.8-1.9 1.9-.2-1.1-.8-1.7-1.9-1.9 1.1-.2 1.7-.8 1.9-1.9z"/>',
      agents: '<circle cx="6" cy="5.5" r="2"/><path d="M2.5 13a3.5 3.5 0 0 1 7 0"/><path d="M10.5 3.8a2 2 0 0 1 0 3.4"/><path d="M11.5 9.8a3.5 3.5 0 0 1 2 3.2"/>',
      reviewer: '<circle cx="7" cy="7" r="4.6"/><path d="M10.4 10.4 14 14"/><path d="M5 7.1l1.4 1.4 2.6-2.8"/>',
      verifier: '<path d="M8 1.8v1.4"/><path d="M5.5 3.2h5"/><path d="M5 4.6h6v7.4H5z"/><path d="M4.5 13.6h7"/><path d="M8 6.9c.9.9 1.2 1.6 1.2 2.3a1.2 1.2 0 0 1-2.4 0c0-.7.3-1.4 1.2-2.3z"/>',
      reports: '<path d="M4 2.5h5.5L12 5v8.5H4z"/><path d="M6.5 8h3M6.5 10.5h3"/>',
      work: '<circle cx="8" cy="8" r="5.5"/><path d="M8 5v3l2 1.5"/>',
      reminders: '<path d="M13 8a5 5 0 1 1-1.5-3.55"/><path d="M13 2.75V5h-2.25"/><path d="M8 5.5V8l1.75 1.25"/>',
      pencil: '<path d="M10.6 2.8l2.6 2.6-7.4 7.4-3.3.7.7-3.3z"/><path d="M9.2 4.2l2.6 2.6"/>',
      revisions: '<path d="M5.2 4.4h7v9.8h-7z"/><path d="M3.4 11.8V2.2h6.4"/><path d="M7 7.4h3.4M7 10h3.4"/>',
      docs: '<path d="M4 1.8h5.5L12.5 5v9.2H4V1.8Z"/><path d="M9.5 1.8V5h3"/>',
      rules: '<path d="M3 3.5h10M3 8h10M3 12.5h6"/>',
      folder: '<path d="M2.5 3h4l1.5 1.5h5.5v8.5h-11V3Z"/>',
      inbox: '<path d="M2 9.5l1.8-6h8.4l1.8 6v3.5H2V9.5Z"/><path d="M2 9.5h3.5l1 1.5h3l1-1.5H14"/>',
      questions: '<circle cx="8" cy="8" r="5.5"/><path d="M6.4 6.3a1.7 1.7 0 0 1 3.2.7c0 1.2-1.6 1.4-1.6 2.5"/><circle cx="8" cy="11.4" r=".6" fill="currentColor" stroke="none"/>',
      home: '<path d="M2.5 7.5L8 2.75l5.5 4.75v6.25h-3.75v-4h-3.5v4H2.5V7.5Z"/>',
      close: '<path d="M4 4l8 8M12 4l-8 8"/>',
      plus: '<path d="M8 3.5v9M3.5 8h9"/>',
      minus: '<path d="M3.5 8h9"/>',
      power: '<path d="M8 2v6"/><path d="M4.5 4.2a5 5 0 1 0 7 0"/>',
      people: '<circle cx="6" cy="5.5" r="2.2"/><path d="M2.2 13c.4-2.2 1.9-3.5 3.8-3.5s3.4 1.3 3.8 3.5"/><circle cx="11.2" cy="6" r="1.8"/><path d="M11 9.6c1.6 0 2.8 1.1 3.1 3"/>',
      lock: '<rect x="3.5" y="7" width="9" height="6.5" rx="1.5"/><path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2"/>',
      plug: '<path d="M5.2 2.2v3.2M8.8 2.2v3.2M3.4 5.4h7.2v2.1a3.6 3.6 0 0 1-3.6 3.6 3.6 3.6 0 0 1-3.6-3.6Z"/><path d="M7 11.3v2.5"/>',
      tools: '<path d="M9.8 2.3a3 3 0 0 0-3.6 3.9L2.5 9.9a1.2 1.2 0 0 0 1.7 1.7l3.7-3.7a3 3 0 0 0 3.9-3.6L10 6 8.6 5.4 8 4l1.8-1.7Z"/>',
      plan: '<path d="M4 14V2.5M4 3h7.5l-1.5 2.75 1.5 2.75H4"/>',
      search: '<circle cx="7" cy="7" r="4.25"/><path d="M10.25 10.25L13.5 13.5"/>',
      settings: '<circle cx="8" cy="8" r="2"/><path d="M8 1.75v1.5M8 12.75v1.5M1.75 8h1.5M12.75 8h1.5M3.6 3.6l1.05 1.05M11.35 11.35l1.05 1.05M3.6 12.4l1.05-1.05M11.35 4.65l1.05-1.05"/>',
      smile: '<circle cx="8" cy="8" r="5.5"/><path d="M5.8 9.5c1.2 1.2 3.2 1.2 4.4 0M6.2 6.5h.01M9.8 6.5h.01"/>',
      dots: '<path d="M4 8h.01M8 8h.01M12 8h.01"/>',
      "dots-vertical": '<circle cx="8" cy="3.5" r="1.3" fill="currentColor" stroke="none"/><circle cx="8" cy="8" r="1.3" fill="currentColor" stroke="none"/><circle cx="8" cy="12.5" r="1.3" fill="currentColor" stroke="none"/>',
      eye: '<path d="M1.9 8c1.5-2.6 3.5-3.9 6.1-3.9s4.6 1.3 6.1 3.9c-1.5 2.6-3.5 3.9-6.1 3.9S3.4 10.6 1.9 8Z"/><circle cx="8" cy="8" r="1.8"/>',
      dot: '<circle cx="8" cy="8" r="2.5"/>',
      start: '<path d="M5.5 3.8v8.4L12 8z" stroke-linejoin="round"/>',
      family: '<rect x="6" y="1.8" width="4" height="3.4" rx="1"/><rect x="1.8" y="10.8" width="4" height="3.4" rx="1"/><rect x="10.2" y="10.8" width="4" height="3.4" rx="1"/><path d="M8 5.2v2.6M3.8 10.8V9.4q0-1.6 1.6-1.6h5.2q1.6 0 1.6 1.6v1.4"/>',
      loop: '<path d="M12.6 6.2A4.9 4.9 0 0 0 3.4 6M3.4 9.8a4.9 4.9 0 0 0 9.2.2"/><path d="M12.8 3v3.3H9.5M3.2 13V9.7h3.3"/>'
    };
    return (t, f) => (a(), o("svg", {
      class: "ico",
      "data-icon": e.name,
      style: _e({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...s.facing === "right" ? {} : { transform: `rotate(${n[s.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: r[i[e.name] || e.name] || r.dot
    }, null, 12, va));
  }
}, fa = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, ma = {
  key: 1,
  class: "menu-item-text"
}, ka = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (s, n) => (a(), o("button", {
      type: "button",
      class: se(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), o("span", fa, g(e.checked ? "✓" : ""), 1)) : m("", !0),
      e.description ? (a(), o("span", ma, [
        C("span", null, [
          $e(s.$slots, "default", {}, void 0, !0)
        ]),
        C("small", null, g(e.description), 1)
      ])) : $e(s.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, fe = /* @__PURE__ */ Z(ka, [["__scopeId", "data-v-fec99974"]]), ya = {}, wa = { class: "menu-label" };
function ba(e, s) {
  return a(), o("span", wa, [
    $e(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Me = /* @__PURE__ */ Z(ya, [["render", ba], ["__scopeId", "data-v-aa955b3e"]]), Ma = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, xa = {
  key: 0,
  class: "skills-none"
}, $a = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: s }) {
    const n = e, i = s, r = d(() => n.skills.filter((f) => f.state === "loaded")), t = d(() => n.skills.filter((f) => f.state !== "loaded"));
    return (f, $) => (a(), o("div", Ma, [
      M(Me, null, {
        default: x(() => [...$[1] || ($[1] = [
          b("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      r.value.length ? m("", !0) : (a(), o("p", xa, "None yet. Compacting the conversation empties this list.")),
      (a(!0), o(H, null, ae(r.value, (A) => (a(), o("p", {
        key: A.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        M(J, {
          name: "book",
          size: 12
        }),
        b(g(A.skill), 1)
      ]))), 128)),
      t.value.length ? (a(), o(H, { key: 1 }, [
        M(Me, null, {
          default: x(() => [...$[2] || ($[2] = [
            b("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), o(H, null, ae(t.value, (A) => (a(), o("p", {
          key: A.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          M(J, {
            name: "book",
            size: 12
          }),
          b(g(A.skill), 1)
        ]))), 128))
      ], 64)) : m("", !0),
      M(fe, {
        "data-agent-skills-browse": "",
        onClick: $[0] || ($[0] = (A) => i("browse"))
      }, {
        default: x(() => [...$[3] || ($[3] = [
          b("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Sa = /* @__PURE__ */ Z($a, [["__scopeId", "data-v-be514d47"]]), Ca = ["disabled", "title"], Ta = { class: "gauge usage" }, Aa = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: s }) {
    const n = e, i = s, r = d(() => n.windows[0] ?? null), t = d(() => r.value && Number.isFinite(r.value.used_percent) ? Math.max(0, Math.min(100, Math.round(r.value.used_percent))) : null), f = d(() => t.value !== null && t.value >= 100), $ = d(() => {
      var T;
      return (T = r.value) != null && T.reset_epoch_seconds ? new Date(r.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), A = d(() => f.value ? `At usage limit: the plan's ${r.value.title} allowance is used up${$.value ? `, starts again ${$.value}` : ""}` : `${t.value}% of the plan's ${r.value.title} allowance used${$.value ? `, starts again ${$.value}` : ""}`);
    return (T, V) => t.value !== null ? (a(), o("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: A.value,
      onClick: V[0] || (V[0] = (E) => i("open", E.currentTarget))
    }, [
      M(J, {
        name: "allowance",
        size: 12
      }),
      V[1] || (V[1] = b()),
      C("span", Ta, [
        C("span", {
          style: _e({ width: `${t.value}%` })
        }, null, 4)
      ]),
      b(" " + g(f.value ? "At usage limit" : `${t.value}%`), 1)
    ], 8, Ca)) : m("", !0);
  }
}, La = /* @__PURE__ */ Z(Aa, [["__scopeId", "data-v-a36f09dc"]]), ja = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (s, n) => (a(), o("span", {
      class: se(["badge", e.tone])
    }, g(e.text), 3));
  }
}, _a = /* @__PURE__ */ Z(ja, [["__scopeId", "data-v-9e7e1157"]]), Ra = (e, s, n) => Math.max(s, Math.min(n, e)), Ue = /* @__PURE__ */ new WeakMap(), Ba = (e, s) => Ue.set(e, s);
function Oa(e, s) {
  for (let n = s; n; n = Ue.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function za(e, s) {
  const n = (i) => {
    var t, f;
    const r = ((t = e.value) == null ? void 0 : t.element) || ((f = e.value) == null ? void 0 : f.$el) || e.value;
    r && !Oa(r, i.target) && s(i);
  };
  window.addEventListener("click", n), xe(() => window.removeEventListener("click", n));
}
const ve = 8, Va = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "MenuPanel",
  props: {
    anchor: { type: Object, default: null },
    align: { type: String, default: "auto" },
    minWidth: { type: Number, default: 0 },
    maxWidth: { type: Number, default: 0 },
    maxHeight: { type: Number, default: 0 },
    gap: { type: Number, default: 4 },
    height: { type: Number, default: 0 },
    plain: Boolean
  },
  emits: ["close"],
  setup(e, { expose: s, emit: n }) {
    const i = e, r = W(null), t = (l) => l ? `${l}px` : void 0, f = d(() => ({
      minWidth: t(i.minWidth),
      maxWidth: t(i.maxWidth),
      maxHeight: t(i.maxHeight),
      height: t(i.height)
    })), $ = W({ w: 0, h: 0 }), A = W(i.anchor ? i.anchor.getBoundingClientRect() : null), T = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), V = (l) => ({
      left: Math.max(0, l.left),
      top: Math.max(0, l.top),
      right: Math.min(window.innerWidth, l.right),
      bottom: Math.min(window.innerHeight, l.bottom)
    }), E = (l) => {
      const L = l.closest(".pane, .float-window");
      return L ? V(L.getBoundingClientRect()) : T();
    }, I = (l, L) => `${Math.max(0, l ? Math.min(l, L) : L)}px`;
    function F(l, L) {
      return {
        below: l.bottom - L.bottom - i.gap - ve,
        above: L.top - l.top - i.gap - ve,
        across: l.right - l.left - 2 * ve
      };
    }
    function j(l) {
      const L = E(i.anchor), B = F(L, l);
      return $.value.w <= B.across && $.value.h <= Math.max(B.below, B.above) ? L : T();
    }
    const R = d(() => {
      if (!A.value) return f.value;
      const l = A.value, L = j(l), B = F(L, l), { w: D, h: ie } = $.value, me = i.align === "auto" ? l.left + l.right > L.left + L.right : i.align === "right", ke = Ra(me ? l.right - D : l.left, L.left + ve, Math.max(L.left + ve, L.right - D - ve)), K = ie > B.below && B.above > B.below ? { bottom: `${window.innerHeight - l.top + i.gap}px`, maxHeight: I(i.maxHeight, B.above) } : { top: `${l.bottom + i.gap}px`, maxHeight: I(i.maxHeight, B.below) };
      return { ...f.value, ...K, left: `${ke}px`, maxWidth: I(i.maxWidth, B.across) };
    }), O = n, G = () => [...r.value.querySelectorAll("button:not(:disabled)")];
    function U(l) {
      const L = G(), B = L.indexOf(document.activeElement);
      L[(B + l + L.length) % L.length].focus();
    }
    const X = { ArrowDown: () => U(1), ArrowUp: () => U(-1), Escape: () => O("close") }, le = (l) => X[l.key] && (l.preventDefault(), X[l.key]()), Y = () => r.value && ($.value = { w: r.value.offsetWidth, h: r.value.scrollHeight });
    let q = 0;
    const k = new ResizeObserver(() => {
      cancelAnimationFrame(q), q = requestAnimationFrame(Y);
    });
    za(r, (l) => i.anchor && !i.anchor.contains(l.target) && O("close"));
    const u = (l, L) => ["top", "left", "right", "bottom"].some((B) => Math.abs(l[B] - L[B]) > 1), P = (l) => l.bottom < 0 || l.top > window.innerHeight;
    let p = 0;
    function c() {
      if (i.anchor) {
        const l = i.anchor.getBoundingClientRect();
        if (!i.anchor.isConnected || P(l)) return O("close");
        u(l, A.value) && (A.value = l);
      }
      p = requestAnimationFrame(c);
    }
    return Xe(() => {
      i.anchor && r.value && Ba(r.value, i.anchor), Y(), r.value && k.observe(r.value), !i.plain && G()[0] && G()[0].focus(), c();
    }), xe(() => {
      k.disconnect(), cancelAnimationFrame(p), cancelAnimationFrame(q);
    }), s({ element: r }), (l, L) => (a(), z(et, {
      to: "body",
      disabled: !e.anchor
    }, [
      C("div", tt({
        ref_key: "panel",
        ref: r
      }, l.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: R.value,
        onKeydown: le
      }), [
        $e(l.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Ia = /* @__PURE__ */ Z(Va, [["__scopeId", "data-v-3d203970"]]);
async function Ha(e, s, n) {
  if (!e) return n(s);
  const { target: i, fields: r } = e, t = Object.fromEntries(Object.keys(r).map((A) => [A, i[A]])), f = () => Object.assign(i, t);
  Object.assign(i, r);
  let $ = !1;
  try {
    const A = await n(s);
    return $ = A.ok, A;
  } finally {
    $ || f();
  }
}
function Ea(e, s, n, { groups: i, programs: r }) {
  const t = W({}), f = W(""), $ = W(!1), A = d(() => !!e.value && !e.value.ended_at), T = d(() => A.value && !!e.value.paused_at);
  async function V(j, R = null) {
    f.value = "";
    const O = await Ha(R, j, s);
    return f.value = O.ok ? "" : O.error, n(), O;
  }
  return { groups: i, programs: r, chosen: t, failure: f, asking: $, running: A, paused: T, choose: (j, R) => V(["agent", "control", String(e.value.number), j, R.value], { target: t, fields: { value: { ...t.value, [j]: R.label } } }), stop: () => ($.value = !1, V(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (j) => V(["agent", "launch", j.name]) };
}
function Na(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const Wa = { compact: "Compaction", clear: "Clear" };
function qa(e) {
  return e != null && e.is_open ? `${Wa[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
const Da = ["disabled", "title"], Fa = ["disabled", "title"], Pa = { class: "gauge" }, Ga = {
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, Ua = ["disabled", "title"], Ka = ["disabled"], Za = ["disabled"], Ja = {
  key: 5,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Ya = ["title"], Qa = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Xa = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, en = { class: "gauge" }, tn = { class: "context-used" }, an = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, nn = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, on = 75, sn = {
  __name: "InformationBar",
  props: {
    agent: { type: Object, default: null },
    card: Boolean,
    controlGroups: { type: Array, default: () => [] },
    agentPrograms: { type: Array, default: () => [] },
    skills: { type: Array, default: () => [] },
    loading: Boolean,
    jobs: { type: Number, default: 0 },
    usage: { type: Object, default: () => ({ agents: [], windows: [] }) },
    branch: { type: String, default: "" },
    fitness: { type: Object, default: null },
    run: { type: Function, default: null }
  },
  emits: ["open", "changed", "skills"],
  setup(e, { emit: s }) {
    const n = e, i = s, r = Ea(Re(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => i("changed"), { groups: Re(n, "controlGroups"), programs: Re(n, "agentPrograms") }), t = W(null), f = W(""), $ = d(() => r.groups.value.find((k) => k.key === f.value));
    function A(k, u) {
      t.value = k.currentTarget, f.value = u;
    }
    function T() {
      t.value = null, f.value = "", r.asking.value = !1;
    }
    const V = d(() => n.skills.filter((k) => k.state === "loaded"));
    function E(k) {
      A(k, "skills"), i("skills");
    }
    const I = (k) => r.groups.value.some((u) => u.key === k), F = d(() => {
      var k;
      return r.chosen.value.model ?? ((k = R.value) == null ? void 0 : k.model) ?? "";
    }), j = d(() => {
      var k;
      return r.chosen.value.effort ?? ((k = R.value) == null ? void 0 : k.effort) ?? "";
    });
    d(() => !!n.agent && !n.agent.ended_at);
    const R = d(() => {
      var k;
      return ((k = n.usage.agents) == null ? void 0 : k.find((u) => {
        var P;
        return u.id === ((P = n.agent) == null ? void 0 : P.id);
      })) ?? null;
    }), O = d(() => {
      var k;
      return ((k = R.value) == null ? void 0 : k.context_percent) == null ? null : Math.round(R.value.context_percent);
    }), G = d(() => {
      var k;
      return qa(((k = R.value) == null ? void 0 : k.context_change) ?? null);
    }), U = (k) => `${Math.round(k / 1e3)}k`, X = d(() => {
      var k;
      return !!((k = R.value) != null && k.context_limit_tokens);
    }), le = d(() => {
      var k, u;
      return ((k = R.value) == null ? void 0 : k.context_limit_tokens) || ((u = R.value) == null ? void 0 : u.context_window_tokens) || 0;
    }), Y = d(() => le.value ? `${U(R.value.context_tokens ?? 0)} of ${U(le.value)}` : ""), q = d(() => {
      var k;
      return (k = R.value) != null && k.cost_dollars ? `$${R.value.cost_dollars.toFixed(2)}` : "";
    });
    return (k, u) => {
      var P, p;
      return a(), o("div", {
        class: se(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (a(), o(H, { key: 0 }, [
          C("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: u[0] || (u[0] = (c) => A(c, "agent"))
          }, [
            M(J, {
              name: "agents",
              size: 12
            }),
            b(" " + g(((P = e.agentPrograms.find((c) => c.name === e.agent.program)) == null ? void 0 : P.title) || e.agent.program), 1)
          ], 8, Da),
          M(La, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: u[1] || (u[1] = (c) => i("open", "usage", c))
          }, null, 8, ["windows", "disabled"]),
          O.value !== null ? (a(), o("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${O.value}% full: clear or compact it`,
            onClick: u[2] || (u[2] = (c) => I("context") ? A(c, "context") : i("open", "context", c.currentTarget))
          }, [
            M(J, {
              name: "gauge",
              size: 12
            }),
            u[14] || (u[14] = b()),
            C("span", Pa, [
              C("span", {
                style: _e({ width: `${O.value}%` })
              }, null, 4)
            ]),
            b(" " + g(O.value) + "% ", 1)
          ], 8, Fa)) : (p = R.value) != null && p.context_unknown ? (a(), o("span", Ga, [
            M(J, {
              name: "gauge",
              size: 12
            }),
            u[15] || (u[15] = b(" Context: unknown", -1))
          ])) : m("", !0),
          F.value ? (a(), o("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${F.value}: change the model`,
            onClick: u[3] || (u[3] = (c) => I("model") ? A(c, "model") : null)
          }, [
            M(J, {
              name: "model",
              size: 12
            }),
            b(" " + g(F.value), 1)
          ], 8, Ua)) : m("", !0),
          I("effort") || e.card && j.value ? (a(), o("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: u[4] || (u[4] = (c) => A(c, "effort"))
          }, [
            M(J, {
              name: "bolt",
              size: 12
            }),
            b(" " + g(j.value), 1)
          ], 8, Ka)) : m("", !0),
          q.value ? (a(), o("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: u[5] || (u[5] = (c) => i("open", "cost", c.currentTarget))
          }, g(q.value), 9, Za)) : m("", !0),
          e.branch ? (a(), o("span", Ja, [
            M(J, {
              name: "branch",
              size: 12
            }),
            b(" " + g(e.branch), 1)
          ])) : m("", !0),
          e.card ? m("", !0) : (a(), o("button", {
            key: 6,
            type: "button",
            class: se(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: u[6] || (u[6] = (c) => i("open", "jobs", c.currentTarget))
          }, [
            M(J, {
              name: "clock",
              size: 12
            }),
            b(" " + g(e.jobs), 1)
          ], 2)),
          e.run ? (a(), o("button", {
            key: 7,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: E
          }, [
            M(J, {
              name: "book",
              size: 12
            }),
            b(" " + g(V.value.length), 1)
          ])) : m("", !0),
          e.fitness ? (a(), o(H, { key: 8 }, [
            C("button", {
              type: "button",
              class: se(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < on }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: u[7] || (u[7] = (c) => i("open", "fitness", c.currentTarget))
            }, [
              M(J, {
                name: "heart",
                size: 12
              }),
              b(" " + g(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            C("button", {
              type: "button",
              class: se(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: u[8] || (u[8] = (c) => i("open", "load", c.currentTarget))
            }, [
              M(J, {
                name: "weight",
                size: 12
              }),
              b(" " + g(e.fitness.workload), 1)
            ], 2)
          ], 64)) : m("", !0)
        ], 64)) : e.run && !e.loading ? (a(), o("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: u[9] || (u[9] = (c) => A(c, "start"))
        }, [
          M(J, {
            name: "agents",
            size: 12
          }),
          u[16] || (u[16] = b(" Start an agent", -1))
        ])) : m("", !0),
        u[22] || (u[22] = C("span", { class: "space" }, null, -1)),
        h(r).failure.value ? (a(), o("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: h(r).failure.value
        }, g(h(r).failure.value), 9, Ya)) : m("", !0),
        $e(k.$slots, "default", {}, void 0, !0),
        t.value ? (a(), z(Ia, {
          key: 3,
          anchor: t.value,
          "min-width": 190,
          onClose: T
        }, {
          default: x(() => {
            var c;
            return [
              f.value === "agent" ? (a(), o(H, { key: 0 }, [
                h(r).asking.value ? (a(), o(H, { key: 0 }, [
                  M(Me, { "data-agent-stop-ask": "" }, {
                    default: x(() => [...u[17] || (u[17] = [
                      b("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  M(fe, {
                    "data-agent-stop-confirm": "",
                    onClick: u[10] || (u[10] = (l) => (T(), h(r).stop()))
                  }, {
                    default: x(() => [...u[18] || (u[18] = [
                      b("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  M(fe, {
                    onClick: u[11] || (u[11] = (l) => h(r).asking.value = !1)
                  }, {
                    default: x(() => [...u[19] || (u[19] = [
                      b("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (a(), z(fe, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: u[12] || (u[12] = (l) => h(r).asking.value = !0)
                }, {
                  default: x(() => [...u[20] || (u[20] = [
                    b("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : f.value === "start" ? (a(), o(H, { key: 1 }, [
                M(Me, null, {
                  default: x(() => [...u[21] || (u[21] = [
                    b("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (a(!0), o(H, null, ae(h(r).programs.value, (l) => (a(), z(fe, {
                  key: l.name,
                  "data-agent-program": l.name,
                  onClick: (L) => (T(), h(r).start(l))
                }, {
                  default: x(() => [
                    b(g(l.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : f.value === "skills" ? (a(), z(Sa, {
                key: 2,
                skills: e.skills,
                onBrowse: u[13] || (u[13] = (l) => (T(), i("open", "skills", null)))
              }, null, 8, ["skills"])) : $.value ? (a(), o(H, { key: 3 }, [
                M(Me, null, {
                  default: x(() => [
                    b(g($.value.label), 1)
                  ]),
                  _: 1
                }),
                f.value === "context" ? (a(), o(H, { key: 0 }, [
                  C("p", Qa, g(h(Na)(((c = R.value) == null ? void 0 : c.last_compaction) ?? null)), 1),
                  C("div", Xa, [
                    C("span", en, [
                      C("span", {
                        style: _e({ width: `${O.value}%` })
                      }, null, 4)
                    ]),
                    C("span", tn, g(O.value) + "%", 1)
                  ]),
                  Y.value ? (a(), o("p", an, [
                    b(g(Y.value) + " ", 1),
                    X.value ? (a(), z(_a, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : m("", !0)
                  ])) : m("", !0)
                ], 64)) : m("", !0),
                f.value === "context" && G.value ? (a(), o("p", nn, g(G.value), 1)) : (a(!0), o(H, { key: 2 }, ae($.value.choices, (l) => (a(), z(fe, {
                  key: l.value,
                  "data-agent-choice": l.value,
                  onClick: (L) => (h(r).choose($.value.key, l), T())
                }, {
                  default: x(() => [
                    b(g(l.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : m("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : m("", !0)
      ], 2);
    };
  }
}, ln = /* @__PURE__ */ Z(sn, [["__scopeId", "data-v-d7113347"]]), rn = ["data-agent-open", "aria-expanded", "role", "tabindex"], cn = {
  class: "agent-head",
  "data-agent-head": ""
}, dn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, un = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, hn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, gn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, pn = {
  key: 0,
  class: "agent-line"
}, vn = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, fn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, mn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, kn = {
  class: "agent-live-fact",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, yn = {
  key: 1,
  class: "agent-live-fact",
  "data-agent-last-heard": ""
}, wn = {
  key: 2,
  class: "agent-unit",
  "data-agent-unit": ""
}, bn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: s }) {
    const n = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), i = { helper: "Helper", reviewer: "Reviewer", main: "Main agent" }, r = { running: "Working", starting: "Starting", stopping: "Stopping", ended: "Idle: its process has stopped", failed: "Could not start", never_started: "Not started" }, t = e, f = s, $ = Ge(), A = d(() => {
      var S, ee;
      if ((S = t.facts) != null && S.profile_title) return t.facts.profile_title;
      if ((ee = t.facts) != null && ee.profile) return t.facts.profile;
      const v = i[t.row.role] || t.row.role;
      return v.slice(0, 1).toUpperCase() + v.slice(1);
    }), T = d(() => {
      var v;
      return ((v = t.facts) == null ? void 0 : v.tasks) ?? [];
    }), V = d(() => T.value.filter((v) => v.state === "open")), E = d(() => T.value.find((v) => {
      var S;
      return v.id === ((S = t.progress) == null ? void 0 : S.task_id) && v.state === "started";
    })), I = d(() => E.value || T.value.find((v) => {
      var S;
      return v.id === ((S = t.facts) == null ? void 0 : S.task_id);
    }) || T.value.find((v) => n.has(v.state)) || V.value[0] || T.value.at(-1)), F = d(() => {
      var v, S, ee, Q, de, re;
      return t.row.role === "helper" ? ((v = t.facts) == null ? void 0 : v.helper_job) || "" : (S = t.facts) != null && S.job_enabled && (((ee = E.value) == null ? void 0 : ee.title) || ((Q = t.facts) == null ? void 0 : Q.task_title) || ((de = V.value[0]) == null ? void 0 : de.title) || ((re = T.value.at(-1)) == null ? void 0 : re.title)) || "";
    }), j = d(() => `${t.row.role} ${t.row.number}`), R = d(() => {
      var v, S;
      return [t.row.program, (v = t.facts) == null ? void 0 : v.model, (S = t.facts) == null ? void 0 : S.effort, j.value].filter(Boolean).join(" · ");
    }), O = d(() => t.row.role === "main" ? A.value : `${A.value} ${t.row.number}`), G = Ve(), U = d(() => ht(t.row.process_started_at || t.row.created_at, $.value)), X = /* @__PURE__ */ new Set(["open", "started", "testing"]), le = { fresh: "new conversation", resumed: "resumed" }, Y = d(() => {
      var v, S;
      return [(v = t.facts) == null ? void 0 : v.helper_job_program, le[(S = t.facts) == null ? void 0 : S.occupant_launch]].filter(Boolean).join(", ");
    }), q = d(() => {
      var v;
      return (v = t.facts) == null ? void 0 : v.work_status;
    }), k = d(() => !!t.row.ended_at && t.row.role !== "main" && T.value.some((v) => X.has(v.state))), u = d(() => {
      var v, S;
      return t.row.state === "running" && ((v = t.facts) == null ? void 0 : v.state) === "at usage limit" && !!((S = t.facts) != null && S.usage_limit_ends_at);
    }), P = (v) => new Date(v).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), p = d(() => t.row.halted_at ? `Stopped at the usage limit since ${P(t.row.halted_at)}, goes on at ${P(t.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(t.facts.usage_limit_ends_at).toLocaleString()}`), c = d(() => {
      var v;
      return t.row.retired_at || t.row.state === "retired" ? "retired" : u.value || q.value || t.waitReason || k.value ? "waiting" : t.row.state === "running" && ((v = t.facts) == null ? void 0 : v.state) || t.row.state;
    }), l = d(() => {
      var v;
      return u.value ? p.value : q.value ? `Status: ${q.value}` : t.waitReason ? `Waiting: ${t.waitReason}` : c.value === "blocked" ? (v = t.facts) != null && v.blocked_reason ? `Blocked: ${t.facts.blocked_reason}` : "Blocked" : k.value ? "Stopped with work left" : "";
    }), L = d(() => {
      var v;
      return ((v = t.progress) == null ? void 0 : v.completed_count) ?? T.value.filter((S) => S.state === "completed").length;
    }), B = d(() => {
      var v;
      return gt(L.value, ((v = t.progress) == null ? void 0 : v.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, $.value);
    }), D = d(() => t.row.role === "main" ? 0 : B.value), ie = d(() => !!t.row.retired_at || t.row.state === "retired"), me = d(() => ie.value ? "Retired" : c.value === "blocked" || c.value === "waiting" ? l.value || (c.value === "blocked" ? "Blocked" : "Waiting") : r[t.row.standing]), ke = d(() => {
      var S;
      if (ie.value) return t.row.retired_at;
      const v = c.value === "blocked" || c.value === "waiting";
      return t.row.ended_at || v && ((S = t.facts) == null ? void 0 : S.last_activity) || t.row.process_started_at || t.row.created_at;
    }), ye = d(() => pt(ke.value, $.value)), K = d(() => {
      var v;
      return vt((v = t.facts) == null ? void 0 : v.last_activity, $.value);
    });
    return (v, S) => {
      var ee, Q, de, re, ne, we, Ce;
      return a(), o("div", {
        class: se(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: S[1] || (S[1] = (te) => !e.open && f("toggle")),
        onKeydown: [
          S[2] || (S[2] = Ee(ge((te) => !e.open && f("toggle"), ["self", "prevent"]), ["enter"])),
          S[3] || (S[3] = Ee(ge((te) => !e.open && f("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        C("div", cn, [
          e.open ? (a(), o("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back",
            "aria-label": "Back",
            onClick: S[0] || (S[0] = ge((te) => f("toggle"), ["stop"]))
          }, [
            M(h(Oe), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : m("", !0),
          e.open ? (a(), o(H, { key: 1 }, [
            C("span", dn, g(O.value), 1),
            C("span", un, g(((ee = e.facts) == null ? void 0 : ee.given_name) || e.row.id), 1)
          ], 64)) : (a(), o(H, { key: 2 }, [
            M(h(ft), {
              "agent-id": e.row.id,
              label: A.value,
              class: "agent-who"
            }, {
              default: x(() => {
                var te;
                return [
                  C("span", hn, g(A.value), 1),
                  C("span", gn, g(((te = e.facts) == null ? void 0 : te.given_name) || e.row.id), 1)
                ];
              }),
              _: 1
            }, 8, ["agent-id", "label"]),
            M(h(Oe), {
              class: "agent-chevron",
              name: "chevronRight",
              size: 12
            })
          ], 64))
        ]),
        e.open ? m("", !0) : (a(), o("span", pn, [
          C("span", vn, g(R.value), 1),
          (Q = e.facts) != null && Q.sandbox_off ? (a(), o("span", fn, "sandbox off")) : m("", !0)
        ])),
        e.open && !ie.value ? (a(), z(ln, {
          key: 1,
          class: "agent-live",
          "agent-programs": h(G).props.programs.rows.value,
          agent: e.row,
          branch: (de = e.progress) == null ? void 0 : de.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((re = e.facts) == null ? void 0 : re.windows) ?? [] },
          card: ""
        }, {
          default: x(() => {
            var te, Te;
            return [
              (te = e.facts) != null && te.sandbox_off ? (a(), o("span", mn, "sandbox off")) : m("", !0),
              C("span", kn, "Run time: " + g(U.value), 1),
              (Te = e.facts) != null && Te.last_activity ? (a(), o("span", yn, [
                S[4] || (S[4] = b("Seen: ", -1)),
                M(h(Fe), {
                  at: e.facts.last_activity
                }, null, 8, ["at"])
              ])) : m("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : m("", !0),
        (ne = e.facts) != null && ne.unit_name ? (a(), o("div", wn, "Unit: " + g(e.facts.unit_name), 1)) : m("", !0),
        e.open ? m("", !0) : (a(), z(ga, {
          key: 3,
          tasks: T.value,
          "in-hand": e.row.role !== "helper" && ((we = e.facts) != null && we.job_enabled) && I.value || null,
          job: e.row.role === "helper" ? F.value : "",
          "job-title": e.row.role === "helper" && ((Ce = e.facts) == null ? void 0 : Ce.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? Y.value : "",
          "per-hour": D.value
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour"])),
        M(Xt, {
          state: c.value,
          doing: me.value,
          since: ye.value,
          seen: K.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (a(), z(Kt, {
          key: 4,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: T.value,
          "stopped-with-work": k.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : m("", !0)
      ], 42, rn);
    };
  }
}, Mn = /* @__PURE__ */ Z(bn, [["__scopeId", "data-v-fc9af29f"]]), xn = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, $n = ["data-agent-row", "data-agent-lingering"], qe = "journal.agents.filters", De = 300 * 1e3, je = "cubic-bezier(0.2, 0.9, 0.25, 1)", Sn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const s = e, n = Ve(), { rows: i } = n.props.waits, { rows: r } = n.props.progress, { rows: t, failure: f, loaded: $, more: A } = n.props.agents, T = (w) => r.value.find((_) => _.agent_id === w.id) ?? null, V = (w) => {
      var _;
      return ((_ = i.value.find((y) => y.agent_id === w.id)) == null ? void 0 : _.reason) ?? "";
    }, E = W("running"), I = W(""), F = JSON.parse(localStorage.getItem(qe) || '{"roles":[],"profiles":[],"programs":[]}'), j = W(F), R = d(() => n.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: O } = n.props.programs, G = d(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), U = (w, _) => {
      j.value = bt(j.value, w, _);
    }, X = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, le = (w) => w.slice(0, 1).toUpperCase() + w.slice(1);
    ce(j, (w) => localStorage.setItem(qe, JSON.stringify(w)));
    const Y = W(25);
    function q() {
      Object.assign(n.state, {
        "agents.show": E.value,
        "agents.search": I.value,
        "agents.limit": String(Y.value),
        "agents.roles": j.value.roles.join(","),
        "agents.profiles": j.value.profiles.join(","),
        "agents.programs": j.value.programs.join(",")
      });
    }
    async function k() {
      return Y.value += 25, q(), await n.reload("agents"), !0;
    }
    ce([E, I, j], () => {
      Y.value = 25, q(), n.reload("agents");
    }), q();
    const u = (w) => w.facts ?? null, P = t, p = Ge(), c = W([]), l = d(() => new Set(c.value.filter((w) => p.value - w.left < De).map((w) => w.row.id))), L = d(() => c.value.filter((w) => l.value.has(w.row.id)).map((w) => w.row)), B = d(() => [...P.value, ...L.value]);
    let D = "", ie = [];
    async function me(w) {
      await n.reload(`card.${w.id}`);
      const _ = n.props[`card.${w.id}`].rows.value.find((y) => y.id === w.id);
      _ != null && _.ended_at && !c.value.some((y) => y.row.id === w.id) && (c.value = [...c.value, { row: _, left: Date.now() }]);
    }
    ce(t, (w) => {
      const _ = D === `${E.value}|${I.value}|${JSON.stringify(j.value)}` && E.value === "running", y = _ ? ie.filter((N) => !w.some((ue) => ue.id === N.id)) : [];
      D = `${E.value}|${I.value}|${JSON.stringify(j.value)}`, ie = w, c.value = _ ? c.value.filter((N) => p.value - N.left < De && !w.some((ue) => ue.id === N.row.id)) : [], y.forEach(me);
    }, { immediate: !0 });
    const ke = d(() => !!I.value.trim() || G.value > 0), ye = d(() => s.texts[E.value] ?? { title: s.empty, hint: "" }), K = W(null), v = W(null), S = W(null), ee = W(null), Q = d(() => K.value === null ? null : n.props[`card.${K.value}`].rows.value.find((w) => w.id === K.value) ?? v.value), de = d(() => Q.value ? [Q.value] : B.value), re = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, ne = W(!1);
    let we = 0;
    async function Ce(w) {
      if (ne.value) return;
      ne.value = !0, we = ee.value.scrollTop;
      const _ = S.value.querySelector(`[data-agent-open="${w.id}"]`);
      if (!re()) {
        const he = [...S.value.querySelectorAll(".agent-row")].filter((oe) => !oe.contains(_));
        await Promise.all(he.map((oe) => oe.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const y = [..._.querySelectorAll(".agent-head, .agent-line")], N = [...y, ..._.querySelectorAll("[data-agent-motion]")], ue = N.map((he) => he.getBoundingClientRect());
      if (v.value = w, K.value = w.id, n.reload(`card.${w.id}`), await Ne(), !re()) {
        const he = N.map((oe) => oe.getBoundingClientRect());
        N.forEach((oe, Ae) => {
          const pe = y.findIndex((He) => He !== oe && He.contains(oe)), Ke = ue[Ae].left - he[Ae].left - (pe < 0 ? 0 : ue[pe].left - he[pe].left), Ze = ue[Ae].top - he[Ae].top - (pe < 0 ? 0 : ue[pe].top - he[pe].top);
          oe.animate([{ transform: `translate(${Ke}px, ${Ze}px)` }, { transform: "none" }], { duration: 280, easing: je });
        }), S.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((oe) => {
          oe.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: je, fill: "backwards" });
        });
      }
      ne.value = !1;
    }
    async function te() {
      if (ne.value || !Q.value) return;
      ne.value = !0;
      const w = S.value.querySelector(`[data-agent-open="${K.value}"]`), _ = [...w.children], y = re() ? [] : _.map((N) => N.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(y.map((N) => N.finished)), K.value = null, await Ne(), ee.value.scrollTop = we, y.forEach((N) => N.cancel()), re() || (w.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: je }), S.value.querySelectorAll(".agent-row").forEach((N) => {
        N.contains(w) || N.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: je });
      })), ne.value = !1;
    }
    const Te = (w) => K.value === w.id ? te() : Ce(w);
    ce(I, (w) => w.trim() && (K.value = null)), ce(E, () => {
      K.value = null;
    });
    const Ie = (w) => {
      w.key === "Escape" && te();
    };
    return window.addEventListener("keydown", Ie), xe(() => window.removeEventListener("keydown", Ie)), (w, _) => (a(), o("div", {
      ref_key: "agents",
      ref: S,
      class: se(["agents", { focused: Q.value, "card-changing": ne.value }])
    }, [
      Q.value ? m("", !0) : (a(), z(h(mt), {
        key: 0,
        modelValue: I.value,
        "onUpdate:modelValue": _[1] || (_[1] = (y) => I.value = y),
        placeholder: "Search agents",
        "menu-count": G.value,
        "data-agents-search": ""
      }, {
        menu: x(() => [
          M(h(Be), null, {
            default: x(() => [..._[2] || (_[2] = [
              b("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), o(H, null, ae(R.value.roles, (y) => (a(), z(h(Le), {
            key: y,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes(y),
            checked: j.value.roles.includes(y),
            "data-filter-role": y,
            onClick: (N) => U("roles", y)
          }, {
            default: x(() => [
              b(g(le(y)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          R.value.profiles.length ? (a(), z(h(Be), { key: 0 }, {
            default: x(() => [..._[3] || (_[3] = [
              b("Profile", -1)
            ])]),
            _: 1
          })) : m("", !0),
          (a(!0), o(H, null, ae(R.value.profiles, (y) => (a(), z(h(Le), {
            key: y.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes(y.name),
            checked: j.value.profiles.includes(y.name),
            "data-filter-profile": y.name,
            onClick: (N) => U("profiles", y.name)
          }, {
            default: x(() => [
              b(g(y.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          M(h(Be), null, {
            default: x(() => [..._[4] || (_[4] = [
              b("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), o(H, null, ae(h(O), (y) => (a(), z(h(Le), {
            key: y.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.programs.includes(y.name),
            checked: j.value.programs.includes(y.name),
            "data-filter-program": y.name,
            onClick: (N) => U("programs", y.name)
          }, {
            default: x(() => [
              b(g(y.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          G.value ? (a(), z(h(Le), {
            key: 1,
            "data-filter-clear": "",
            onClick: X
          }, {
            default: x(() => [..._[5] || (_[5] = [
              b("Clear filters", -1)
            ])]),
            _: 1
          })) : m("", !0)
        ]),
        default: x(() => [
          M(h(kt), {
            options: R.value.states,
            value: E.value,
            onPick: _[0] || (_[0] = (y) => E.value = y)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      E.value === "retired" && R.value.upgrade_retired ? (a(), o("p", xn, "Retired during the upgrade: " + g(R.value.upgrade_retired), 1)) : m("", !0),
      C("div", {
        ref_key: "list",
        ref: ee,
        class: se(["agents-view", { "agents-view-open": Q.value }])
      }, [
        h($) && !h(f) && !de.value.length && G.value ? (a(), z(h(ze), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: x(() => [
            M(h(yt), {
              small: "",
              "data-empty-clear": "",
              onClick: X
            }, {
              default: x(() => [..._[6] || (_[6] = [
                b("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), z(h(wt), {
          key: 1,
          moves: "",
          "leaves-at-once": ne.value,
          rows: de.value,
          failure: h(f),
          loaded: h($),
          more: !Q.value && h(A),
          older: k,
          empty: ye.value.title,
          hint: ye.value.hint,
          searching: ke.value
        }, {
          default: x(({ row: y }) => [
            C("div", {
              class: se(["agent-row", { lingering: l.value.has(y.id) && y.id !== K.value }]),
              "data-agent-row": y.id,
              "data-agent-lingering": l.value.has(y.id) ? "" : null
            }, [
              M(Mn, {
                row: y,
                facts: u(y),
                progress: T(y),
                "wait-reason": V(y),
                open: y.id === K.value,
                onToggle: (N) => Te(y)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, $n)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Ln = /* @__PURE__ */ Z(Sn, [["__scopeId", "data-v-fceb20c3"]]);
export {
  Ln as A
};
