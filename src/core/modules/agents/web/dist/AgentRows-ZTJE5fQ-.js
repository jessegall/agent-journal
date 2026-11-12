import { openBlock as a, createElementBlock as s, withModifiers as ue, unref as g, createTextVNode as b, toDisplayString as p, createVNode as M, createBlock as I, createElementVNode as S, createCommentVNode as m, withCtx as x, Fragment as H, renderList as te, computed as c, ref as W, watch as re, onUnmounted as $e, defineAsyncComponent as Je, createSlots as Ye, resolveDynamicComponent as Qe, normalizeClass as oe, normalizeStyle as Re, renderSlot as Se, onMounted as Xe, Teleport as et, mergeProps as tt, toRef as Be, withKeys as Ee, nextTick as Ne } from "vue";
import { peekRef as Ce, Icon as ze, RunningCommand as at, TimeAgo as Fe, FoldGroup as Pe, TaskStatusIcon as nt, useWindow as Ie, loadWindowComponent as ot, coalesced as st, READ_RATES as lt, eventMayBeChildOf as rt, InnerTabs as it, TabBody as ct, SwitchCase as dt, EmptyState as Ve, HoverTip as Me, TaskBar as ut, useNow as Ge, age as ht, perHour as gt, sinceWords as pt, seenWords as vt, AgentTip as ft, SearchBar as mt, Segmented as kt, MenuLabel as Oe, MenuItem as je, Btn as yt, RowList as wt, toggleFilter as bt } from "@journal/window-kit";
import { _ as J, T as Mt } from "./TranscriptRows-Crmxs6Un.js";
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
    return (l, n) => (a(), s("span", xt, [
      e.waitReason ? (a(), s("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: n[0] || (n[0] = ue((i) => g(Ce)("test_queue:0"), ["stop"]))
      }, [
        b("Waiting: " + p(e.waitReason) + " ", 1),
        M(g(ze), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), s("span", $t, "Waiting")) : (a(), I(g(at), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, Ct = /* @__PURE__ */ J(St, [["__scopeId", "data-v-1b371fb5"]]), Tt = {
  key: 0,
  class: "lasting-facts",
  "data-agent-lasting-facts": ""
}, At = { "data-agent-retired-at": "" }, Lt = { key: 0 }, jt = { "data-agent-retired-by": "" }, _t = {
  __name: "AgentLastingFacts",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    return (l, n) => e.row.retired_at ? (a(), s("dl", Tt, [
      S("div", null, [
        n[0] || (n[0] = S("dt", null, "Retired", -1)),
        S("dd", At, [
          M(g(Fe), {
            at: e.row.retired_at
          }, null, 8, ["at"])
        ])
      ]),
      e.row.retiring_actor_name ? (a(), s("div", Lt, [
        n[1] || (n[1] = S("dt", null, "Retired by", -1)),
        S("dd", jt, p(e.row.retiring_actor_name), 1)
      ])) : m("", !0)
    ])) : m("", !0);
  }
}, Rt = /* @__PURE__ */ J(_t, [["__scopeId", "data-v-abc8e12a"]]), Bt = ["data-agent-delegated", "onClick"], Ot = { class: "agent-task-number" }, zt = { class: "agent-task-title" }, Vt = ["title"], It = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const n = l;
    return (i, r) => (a(), I(g(Pe), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: r[0] || (r[0] = (h) => n("toggle"))
    }, {
      default: x(() => [
        (a(!0), s(H, null, te(e.section.tasks, (h) => (a(), s("button", {
          key: h.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": h.id,
          onClick: (t) => g(Ce)(`tasks:${h.id}`)
        }, [
          M(g(nt), {
            status: h.state
          }, null, 8, ["status"]),
          S("span", Ot, p(h.id), 1),
          S("span", zt, p(h.title), 1),
          h.plan_id ? (a(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${h.plan_id}: ${h.plan_title}`
          }, "Plan " + p(h.plan_id), 9, Vt)) : m("", !0)
        ], 8, Bt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Ht = /* @__PURE__ */ J(It, [["__scopeId", "data-v-ea4ccd6b"]]), Et = {
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
    const l = e, n = ["started", "blocked", "open", "completed"], i = c(() => {
      var f, u;
      return l.row.ended_at && ((u = (f = l.facts) == null ? void 0 : f.job_returned) != null && u.startsWith(Gt)) ? l.facts.job_returned : "";
    }), r = c(() => l.tasks.length ? n.map((f) => ({ state: f, label: f.slice(0, 1).toUpperCase() + f.slice(1), tasks: l.tasks.filter((u) => u.state === f || f === "started" && u.state === "testing" || f === "completed" && u.state === "cancelled") })) : []), h = /* @__PURE__ */ new Set(["completed"]), t = W({}), $ = (f) => !(t.value[f] ?? h.has(f)), C = (f) => t.value = { ...t.value, [f]: $(f) }, L = Ie(), { rows: R } = L.props.reports;
    L.state["reports.agent"] = String(l.row.number);
    const E = c(() => l.row.access === "read-only"), V = ["tasks", "transcript", "terminal", "file-feed", "processes", "reports", "memories"], D = c(() => [...L.tabs].sort((f, u) => (V.indexOf(f.key) < 0 ? V.length : V.indexOf(f.key)) - (V.indexOf(u.key) < 0 ? V.length : V.indexOf(u.key)))), j = c(() => !!l.row.retired_at || l.row.state === "retired"), B = () => E.value || j.value ? D.value.find((f) => f.key === "transcript") : D.value[0], z = W(B());
    re(z, (f) => {
      L.state.tab = (f == null ? void 0 : f.key) ?? "";
    }, { immediate: !0 }), $e(() => {
      L.state.tab = "";
    }), re(D, (f) => {
      f.some((u) => {
        var o;
        return u.key === ((o = z.value) == null ? void 0 : o.key);
      }) || (z.value = f[0]);
    }), re(() => l.open, (f) => {
      f && (z.value = B());
    });
    const G = Object.fromEntries(L.tabs.filter((f) => f.component).map((f) => [f.key, Je(() => ot(f.component))])), U = W(!1), { data: ee } = L.props.tool, se = c(() => {
      var f;
      return ((f = ee.value) == null ? void 0 : f.tool) ?? "";
    }), X = c(() => {
      var f;
      return ((f = ee.value) == null ? void 0 : f.note) ?? "";
    }), K = c(() => l.row.role !== "main" && (!l.row.ended_at || l.stoppedWithWork || l.waitReason));
    async function k() {
      !l.open || !K.value || (L.state["tool.agent"] = String(l.row.number), await L.reload("tool"));
    }
    const d = st(k, lt.agentCommand), F = L.follow(["hook_call.*", "process_part.*"], (f) => rt(f, "session_agent_id", /* @__PURE__ */ new Set([l.row.id])) && d());
    return $e(() => F == null ? void 0 : F()), re(() => l.open, (f) => {
      f && k();
    }, { immediate: !0 }), (f, u) => {
      var o;
      return a(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: u[2] || (u[2] = ue(() => {
        }, ["stop"]))
      }, [
        M(Rt, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (a(), s("p", Et, "Retirement reason: " + p(e.row.retirement_reason), 1)) : m("", !0),
        i.value ? (a(), s("p", Nt, p(i.value), 1)) : m("", !0),
        M(g(it), {
          class: "agent-tabs",
          tabs: D.value,
          active: z.value,
          answer: { tasks: e.tasks.length, reports: e.row.report_count ?? g(R).length, memories: e.row.memory_count ?? 0 },
          onChoose: u[0] || (u[0] = (A) => z.value = A)
        }, null, 8, ["tabs", "active", "answer"]),
        M(g(ct), {
          class: "agent-tab-body",
          tab: z.value,
          "data-agent-tab-body": (o = z.value) == null ? void 0 : o.key
        }, {
          default: x(() => {
            var A;
            return [
              M(g(dt), {
                value: (A = z.value) == null ? void 0 : A.key
              }, Ye({
                reports: x(() => [
                  g(R).length ? m("", !0) : (a(), I(g(Ve), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: x(() => [...u[3] || (u[3] = [
                      b("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (a(!0), s(H, null, te(g(R), (O) => (a(), s("button", {
                    key: O.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${O.id}`,
                    onClick: (q) => g(Ce)(`messages:${O.id}`)
                  }, p(O.text), 9, Wt))), 128))
                ]),
                tasks: x(() => {
                  var O;
                  return [
                    e.tasks.length ? m("", !0) : (a(), I(g(Ve), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: x(() => [...u[4] || (u[4] = [
                        b("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (a(!0), s(H, null, te(r.value, (q) => (a(), I(Ht, {
                      key: q.state,
                      section: q,
                      open: $(q.state),
                      onToggle: (he) => C(q.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (O = e.facts) != null && O.instruction ? (a(), s(H, { key: 1 }, [
                      u[5] || (u[5] = S("p", { class: "agent-label" }, "Instruction", -1)),
                      S("div", qt, p(e.facts.instruction), 1)
                    ], 64)) : m("", !0)
                  ];
                }),
                transcript: x(() => {
                  var O;
                  return [
                    E.value ? (a(), s(H, { key: 0 }, [
                      (O = e.facts) != null && O.instruction ? (a(), s("div", Dt, [
                        M(g(Pe), {
                          label: "Instruction",
                          open: U.value,
                          "data-agent-section": "instruction",
                          onToggle: u[1] || (u[1] = (q) => U.value = !U.value)
                        }, {
                          default: x(() => [
                            S("div", Ft, p(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (a(), s("p", Pt, "No job recorded")) : m("", !0)
                    ], 64)) : m("", !0),
                    M(Mt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                te(g(G), (O, q) => ({
                  name: q,
                  fn: x(() => [
                    (a(), I(Qe(O), {
                      agent: e.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ];
          }),
          _: 1
        }, 8, ["tab", "data-agent-tab-body"]),
        K.value ? (a(), I(Ct, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: se.value,
          note: X.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0)
      ]);
    };
  }
}, Kt = /* @__PURE__ */ J(Ut, [["__scopeId", "data-v-fabbecdf"]]), Zt = { class: "line" }, Jt = {
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
    const l = /* @__PURE__ */ new Set(["running", "working", "thinking"]), n = e, i = c(() => l.has(n.state)), r = c(() => [n.doing, n.since, n.seen].filter(Boolean).join(". "));
    return (h, t) => (a(), I(g(Me), {
      as: "button",
      place: "corner",
      class: oe(["agent-dot", { pulse: i.value }]),
      "data-state": e.state,
      "aria-label": r.value,
      "data-agent-status": "",
      onClick: t[0] || (t[0] = ue(() => {
      }, ["stop"]))
    }, {
      tip: x(() => [
        S("b", Zt, p(e.doing), 1),
        e.since ? (a(), s("span", Jt, p(e.since), 1)) : m("", !0),
        e.seen ? (a(), s("span", Yt, p(e.seen), 1)) : m("", !0)
      ]),
      default: x(() => [
        t[1] || (t[1] = S("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, Xt = /* @__PURE__ */ J(Qt, [["__scopeId", "data-v-1a0bc478"]]), ea = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, ta = (e) => e.filter((l) => l.state !== "cancelled"), We = (e, l) => e.filter((n) => n.state === l).length, aa = 5, na = (e, l) => e || l.split(/\s+/).slice(0, aa).join(" ");
function oa({ tasks: e, inHand: l, perHour: n }) {
  const i = ta(e), r = We(i, "completed"), h = ea[l == null ? void 0 : l.state], t = i.filter((R) => R.state === "started").map((R) => ({ number: R.id, title: R.title })), $ = Math.max(t.length, l && l.state !== "completed" ? 1 : 0), C = i.length - r - $, L = r === i.length;
  return {
    number: l.id,
    title: l.title,
    started: t,
    plan: l.plan_id ?? 0,
    count: `${r} of ${i.length}`,
    taskTip: `${r} of its ${i.length} tasks done${h ? `. This one is ${h.words}.` : "."}`,
    countTip: L ? `All ${i.length} tasks done` : `${r} done, ${$} in hand, ${C} to go`,
    paceTip: !L && n ? `About ${n} an hour.` : "",
    rate: !L && n ? `${Math.round(n)}/hour` : "",
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
    const l = e, n = c(() => l.inHand ? oa({ tasks: l.tasks, inHand: l.inHand, perHour: l.perHour }) : null);
    return (i, r) => e.job && !n.value ? (a(), s("span", sa, [
      M(g(Me), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: x(() => [
          S("b", null, p(e.job), 1)
        ]),
        default: x(() => [
          b(p(g(na)(e.jobTitle, e.job)), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (a(), s("span", la, p(e.jobLaunch), 1)) : m("", !0)
    ])) : n.value ? (a(), s(H, { key: 1 }, [
      S("span", ra, [
        n.value.started.length > 1 ? (a(), s("span", ia, [
          r[1] || (r[1] = b("Tasks ", -1)),
          (a(!0), s(H, null, te(n.value.started, (h, t) => (a(), s(H, {
            key: h.number
          }, [
            t ? (a(), s(H, { key: 0 }, [
              b(", ")
            ], 64)) : m("", !0),
            M(g(Me), {
              as: "button",
              class: "task",
              "data-agent-task": "",
              "data-peek": `tasks:${h.number}`,
              "aria-label": `Task ${h.number}: ${h.title}`,
              onClick: ue(($) => g(Ce)(`tasks:${h.number}`), ["stop"])
            }, {
              tip: x(() => [
                S("b", null, p(h.title), 1)
              ]),
              default: x(() => [
                b(p(h.number), 1)
              ]),
              _: 2
            }, 1032, ["data-peek", "aria-label", "onClick"])
          ], 64))), 128))
        ])) : (a(), I(g(Me), {
          key: 1,
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${n.value.number}`,
          "aria-label": `Task ${n.value.number}: ${n.value.title}`,
          onClick: r[0] || (r[0] = ue((h) => g(Ce)(`tasks:${n.value.number}`), ["stop"]))
        }, {
          tip: x(() => [
            S("b", null, p(n.value.title), 1),
            S("span", null, p(n.value.taskTip), 1)
          ]),
          default: x(() => [
            b("Task " + p(n.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])),
        n.value.plan ? (a(), s("span", ca, "Plan " + p(n.value.plan), 1)) : m("", !0),
        n.value.rate ? (a(), s("span", da, p(n.value.rate), 1)) : m("", !0),
        M(g(Me), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: x(() => [
            S("b", null, p(n.value.countTip), 1),
            n.value.paceTip ? (a(), s("span", ua, p(n.value.paceTip), 1)) : m("", !0)
          ]),
          default: x(() => [
            b(p(n.value.count), 1)
          ]),
          _: 1
        })
      ]),
      M(g(ut), {
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: n.value.bar.total,
        done: n.value.bar.done,
        testing: n.value.bar.testing
      }, null, 8, ["total", "done", "testing"])
    ], 64)) : m("", !0);
  }
}, ga = /* @__PURE__ */ J(ha, [["__scopeId", "data-v-e51f5781"]]), pa = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', va = ["data-icon", "stroke-width", "innerHTML"], Q = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const l = e, n = { right: 0, down: 90, left: 180, up: 270 }, i = {
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
    return (h, t) => (a(), s("svg", {
      class: "ico",
      "data-icon": e.name,
      style: Re({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...l.facing === "right" ? {} : { transform: `rotate(${n[l.facing]}deg)` }
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
    return (l, n) => (a(), s("button", {
      type: "button",
      class: oe(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), s("span", fa, p(e.checked ? "✓" : ""), 1)) : m("", !0),
      e.description ? (a(), s("span", ma, [
        S("span", null, [
          Se(l.$slots, "default", {}, void 0, !0)
        ]),
        S("small", null, p(e.description), 1)
      ])) : Se(l.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, fe = /* @__PURE__ */ J(ka, [["__scopeId", "data-v-fec99974"]]), ya = {}, wa = { class: "menu-label" };
function ba(e, l) {
  return a(), s("span", wa, [
    Se(e.$slots, "default", {}, void 0, !0)
  ]);
}
const xe = /* @__PURE__ */ J(ya, [["render", ba], ["__scopeId", "data-v-aa955b3e"]]), Ma = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, xa = {
  key: 0,
  class: "skills-none"
}, $a = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: l }) {
    const n = e, i = l, r = c(() => n.skills.filter((t) => t.state === "loaded")), h = c(() => n.skills.filter((t) => t.state !== "loaded"));
    return (t, $) => (a(), s("div", Ma, [
      M(xe, null, {
        default: x(() => [...$[1] || ($[1] = [
          b("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      r.value.length ? m("", !0) : (a(), s("p", xa, "None yet. Compacting the conversation empties this list.")),
      (a(!0), s(H, null, te(r.value, (C) => (a(), s("p", {
        key: C.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        M(Q, {
          name: "book",
          size: 12
        }),
        b(p(C.skill), 1)
      ]))), 128)),
      h.value.length ? (a(), s(H, { key: 1 }, [
        M(xe, null, {
          default: x(() => [...$[2] || ($[2] = [
            b("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), s(H, null, te(h.value, (C) => (a(), s("p", {
          key: C.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          M(Q, {
            name: "book",
            size: 12
          }),
          b(p(C.skill), 1)
        ]))), 128))
      ], 64)) : m("", !0),
      M(fe, {
        "data-agent-skills-browse": "",
        onClick: $[0] || ($[0] = (C) => i("browse"))
      }, {
        default: x(() => [...$[3] || ($[3] = [
          b("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Sa = /* @__PURE__ */ J($a, [["__scopeId", "data-v-be514d47"]]), Ca = ["disabled", "title"], Ta = { class: "gauge usage" }, Aa = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: l }) {
    const n = e, i = l, r = c(() => n.windows[0] ?? null), h = c(() => r.value && Number.isFinite(r.value.used_percent) ? Math.max(0, Math.min(100, Math.round(r.value.used_percent))) : null), t = c(() => h.value !== null && h.value >= 100), $ = c(() => {
      var L;
      return (L = r.value) != null && L.reset_epoch_seconds ? new Date(r.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), C = c(() => t.value ? `At usage limit: the plan's ${r.value.title} allowance is used up${$.value ? `, starts again ${$.value}` : ""}` : `${h.value}% of the plan's ${r.value.title} allowance used${$.value ? `, starts again ${$.value}` : ""}`);
    return (L, R) => h.value !== null ? (a(), s("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: C.value,
      onClick: R[0] || (R[0] = (E) => i("open", E.currentTarget))
    }, [
      M(Q, {
        name: "allowance",
        size: 12
      }),
      R[1] || (R[1] = b()),
      S("span", Ta, [
        S("span", {
          style: Re({ width: `${h.value}%` })
        }, null, 4)
      ]),
      b(" " + p(t.value ? "At usage limit" : `${h.value}%`), 1)
    ], 8, Ca)) : m("", !0);
  }
}, La = /* @__PURE__ */ J(Aa, [["__scopeId", "data-v-a36f09dc"]]), ja = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (l, n) => (a(), s("span", {
      class: oe(["badge", e.tone])
    }, p(e.text), 3));
  }
}, _a = /* @__PURE__ */ J(ja, [["__scopeId", "data-v-9e7e1157"]]), Ra = (e, l, n) => Math.max(l, Math.min(n, e)), Ue = /* @__PURE__ */ new WeakMap(), Ba = (e, l) => Ue.set(e, l);
function Oa(e, l) {
  for (let n = l; n; n = Ue.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function za(e, l) {
  const n = (i) => {
    var h, t;
    const r = ((h = e.value) == null ? void 0 : h.element) || ((t = e.value) == null ? void 0 : t.$el) || e.value;
    r && !Oa(r, i.target) && l(i);
  };
  window.addEventListener("click", n), $e(() => window.removeEventListener("click", n));
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
  setup(e, { expose: l, emit: n }) {
    const i = e, r = W(null), h = (o) => o ? `${o}px` : void 0, t = c(() => ({
      minWidth: h(i.minWidth),
      maxWidth: h(i.maxWidth),
      maxHeight: h(i.maxHeight),
      height: h(i.height)
    })), $ = W({ w: 0, h: 0 }), C = W(i.anchor ? i.anchor.getBoundingClientRect() : null), L = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), R = (o) => ({
      left: Math.max(0, o.left),
      top: Math.max(0, o.top),
      right: Math.min(window.innerWidth, o.right),
      bottom: Math.min(window.innerHeight, o.bottom)
    }), E = (o) => {
      const A = o.closest(".pane, .float-window");
      return A ? R(A.getBoundingClientRect()) : L();
    }, V = (o, A) => `${Math.max(0, o ? Math.min(o, A) : A)}px`;
    function D(o, A) {
      return {
        below: o.bottom - A.bottom - i.gap - ve,
        above: A.top - o.top - i.gap - ve,
        across: o.right - o.left - 2 * ve
      };
    }
    function j(o) {
      const A = E(i.anchor), O = D(A, o);
      return $.value.w <= O.across && $.value.h <= Math.max(O.below, O.above) ? A : L();
    }
    const B = c(() => {
      if (!C.value) return t.value;
      const o = C.value, A = j(o), O = D(A, o), { w: q, h: he } = $.value, ge = i.align === "auto" ? o.left + o.right > A.left + A.right : i.align === "right", me = Ra(ge ? o.right - q : o.left, A.left + ve, Math.max(A.left + ve, A.right - q - ve)), Z = he > O.below && O.above > O.below ? { bottom: `${window.innerHeight - o.top + i.gap}px`, maxHeight: V(i.maxHeight, O.above) } : { top: `${o.bottom + i.gap}px`, maxHeight: V(i.maxHeight, O.below) };
      return { ...t.value, ...Z, left: `${me}px`, maxWidth: V(i.maxWidth, O.across) };
    }), z = n, G = () => [...r.value.querySelectorAll("button:not(:disabled)")];
    function U(o) {
      const A = G(), O = A.indexOf(document.activeElement);
      A[(O + o + A.length) % A.length].focus();
    }
    const ee = { ArrowDown: () => U(1), ArrowUp: () => U(-1), Escape: () => z("close") }, se = (o) => ee[o.key] && (o.preventDefault(), ee[o.key]()), X = () => r.value && ($.value = { w: r.value.offsetWidth, h: r.value.scrollHeight });
    let K = 0;
    const k = new ResizeObserver(() => {
      cancelAnimationFrame(K), K = requestAnimationFrame(X);
    });
    za(r, (o) => i.anchor && !i.anchor.contains(o.target) && z("close"));
    const d = (o, A) => ["top", "left", "right", "bottom"].some((O) => Math.abs(o[O] - A[O]) > 1), F = (o) => o.bottom < 0 || o.top > window.innerHeight;
    let f = 0;
    function u() {
      if (i.anchor) {
        const o = i.anchor.getBoundingClientRect();
        if (!i.anchor.isConnected || F(o)) return z("close");
        d(o, C.value) && (C.value = o);
      }
      f = requestAnimationFrame(u);
    }
    return Xe(() => {
      i.anchor && r.value && Ba(r.value, i.anchor), X(), r.value && k.observe(r.value), !i.plain && G()[0] && G()[0].focus(), u();
    }), $e(() => {
      k.disconnect(), cancelAnimationFrame(f), cancelAnimationFrame(K);
    }), l({ element: r }), (o, A) => (a(), I(et, {
      to: "body",
      disabled: !e.anchor
    }, [
      S("div", tt({
        ref_key: "panel",
        ref: r
      }, o.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: B.value,
        onKeydown: se
      }), [
        Se(o.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Ia = /* @__PURE__ */ J(Va, [["__scopeId", "data-v-3d203970"]]);
async function Ha(e, l, n) {
  if (!e) return n(l);
  const { target: i, fields: r } = e, h = Object.fromEntries(Object.keys(r).map((C) => [C, i[C]])), t = () => Object.assign(i, h);
  Object.assign(i, r);
  let $ = !1;
  try {
    const C = await n(l);
    return $ = C.ok, C;
  } finally {
    $ || t();
  }
}
function Ea(e, l, n, { groups: i, programs: r }) {
  const h = W({}), t = W(""), $ = W(!1), C = c(() => !!e.value && !e.value.ended_at), L = c(() => C.value && !!e.value.paused_at);
  async function R(j, B = null) {
    t.value = "";
    const z = await Ha(B, j, l);
    return t.value = z.ok ? "" : z.error, n(), z;
  }
  return { groups: i, programs: r, chosen: h, failure: t, asking: $, running: C, paused: L, choose: (j, B) => R(["agent", "control", String(e.value.number), j, B.value], { target: h, fields: { value: { ...h.value, [j]: B.label } } }), stop: () => ($.value = !1, R(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (j) => R(["agent", "launch", j.name]) };
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
  setup(e, { emit: l }) {
    const n = e, i = l, r = Ea(Be(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => i("changed"), { groups: Be(n, "controlGroups"), programs: Be(n, "agentPrograms") }), h = W(null), t = W(""), $ = c(() => r.groups.value.find((k) => k.key === t.value));
    function C(k, d) {
      h.value = k.currentTarget, t.value = d;
    }
    function L() {
      h.value = null, t.value = "", r.asking.value = !1;
    }
    const R = c(() => n.skills.filter((k) => k.state === "loaded"));
    function E(k) {
      C(k, "skills"), i("skills");
    }
    const V = (k) => r.groups.value.some((d) => d.key === k), D = c(() => {
      var k;
      return r.chosen.value.model ?? ((k = B.value) == null ? void 0 : k.model) ?? "";
    }), j = c(() => {
      var k;
      return r.chosen.value.effort ?? ((k = B.value) == null ? void 0 : k.effort) ?? "";
    });
    c(() => !!n.agent && !n.agent.ended_at);
    const B = c(() => {
      var k;
      return ((k = n.usage.agents) == null ? void 0 : k.find((d) => {
        var F;
        return d.id === ((F = n.agent) == null ? void 0 : F.id);
      })) ?? null;
    }), z = c(() => {
      var k;
      return ((k = B.value) == null ? void 0 : k.context_percent) == null ? null : Math.round(B.value.context_percent);
    }), G = c(() => {
      var k;
      return qa(((k = B.value) == null ? void 0 : k.context_change) ?? null);
    }), U = (k) => `${Math.round(k / 1e3)}k`, ee = c(() => {
      var k;
      return !!((k = B.value) != null && k.context_limit_tokens);
    }), se = c(() => {
      var k, d;
      return ((k = B.value) == null ? void 0 : k.context_limit_tokens) || ((d = B.value) == null ? void 0 : d.context_window_tokens) || 0;
    }), X = c(() => se.value ? `${U(B.value.context_tokens ?? 0)} of ${U(se.value)}` : ""), K = c(() => {
      var k;
      return (k = B.value) != null && k.cost_dollars ? `$${B.value.cost_dollars.toFixed(2)}` : "";
    });
    return (k, d) => {
      var F, f;
      return a(), s("div", {
        class: oe(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (a(), s(H, { key: 0 }, [
          S("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: d[0] || (d[0] = (u) => C(u, "agent"))
          }, [
            M(Q, {
              name: "agents",
              size: 12
            }),
            b(" " + p(((F = e.agentPrograms.find((u) => u.name === e.agent.program)) == null ? void 0 : F.title) || e.agent.program), 1)
          ], 8, Da),
          M(La, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: d[1] || (d[1] = (u) => i("open", "usage", u))
          }, null, 8, ["windows", "disabled"]),
          z.value !== null ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${z.value}% full: clear or compact it`,
            onClick: d[2] || (d[2] = (u) => V("context") ? C(u, "context") : i("open", "context", u.currentTarget))
          }, [
            M(Q, {
              name: "gauge",
              size: 12
            }),
            d[14] || (d[14] = b()),
            S("span", Pa, [
              S("span", {
                style: Re({ width: `${z.value}%` })
              }, null, 4)
            ]),
            b(" " + p(z.value) + "% ", 1)
          ], 8, Fa)) : (f = B.value) != null && f.context_unknown ? (a(), s("span", Ga, [
            M(Q, {
              name: "gauge",
              size: 12
            }),
            d[15] || (d[15] = b(" Context: unknown", -1))
          ])) : m("", !0),
          D.value ? (a(), s("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${D.value}: change the model`,
            onClick: d[3] || (d[3] = (u) => V("model") ? C(u, "model") : null)
          }, [
            M(Q, {
              name: "model",
              size: 12
            }),
            b(" " + p(D.value), 1)
          ], 8, Ua)) : m("", !0),
          V("effort") || e.card && j.value ? (a(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: d[4] || (d[4] = (u) => C(u, "effort"))
          }, [
            M(Q, {
              name: "bolt",
              size: 12
            }),
            b(" " + p(j.value), 1)
          ], 8, Ka)) : m("", !0),
          K.value ? (a(), s("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: d[5] || (d[5] = (u) => i("open", "cost", u.currentTarget))
          }, p(K.value), 9, Za)) : m("", !0),
          e.branch ? (a(), s("span", Ja, [
            M(Q, {
              name: "branch",
              size: 12
            }),
            b(" " + p(e.branch), 1)
          ])) : m("", !0),
          e.card ? m("", !0) : (a(), s("button", {
            key: 6,
            type: "button",
            class: oe(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: d[6] || (d[6] = (u) => i("open", "jobs", u.currentTarget))
          }, [
            M(Q, {
              name: "clock",
              size: 12
            }),
            b(" " + p(e.jobs), 1)
          ], 2)),
          e.run ? (a(), s("button", {
            key: 7,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: E
          }, [
            M(Q, {
              name: "book",
              size: 12
            }),
            b(" " + p(R.value.length), 1)
          ])) : m("", !0),
          e.fitness ? (a(), s(H, { key: 8 }, [
            S("button", {
              type: "button",
              class: oe(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < on }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: d[7] || (d[7] = (u) => i("open", "fitness", u.currentTarget))
            }, [
              M(Q, {
                name: "heart",
                size: 12
              }),
              b(" " + p(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            S("button", {
              type: "button",
              class: oe(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: d[8] || (d[8] = (u) => i("open", "load", u.currentTarget))
            }, [
              M(Q, {
                name: "weight",
                size: 12
              }),
              b(" " + p(e.fitness.workload), 1)
            ], 2)
          ], 64)) : m("", !0)
        ], 64)) : e.run && !e.loading ? (a(), s("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: d[9] || (d[9] = (u) => C(u, "start"))
        }, [
          M(Q, {
            name: "agents",
            size: 12
          }),
          d[16] || (d[16] = b(" Start an agent", -1))
        ])) : m("", !0),
        d[22] || (d[22] = S("span", { class: "space" }, null, -1)),
        g(r).failure.value ? (a(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: g(r).failure.value
        }, p(g(r).failure.value), 9, Ya)) : m("", !0),
        Se(k.$slots, "default", {}, void 0, !0),
        h.value ? (a(), I(Ia, {
          key: 3,
          anchor: h.value,
          "min-width": 190,
          onClose: L
        }, {
          default: x(() => {
            var u;
            return [
              t.value === "agent" ? (a(), s(H, { key: 0 }, [
                g(r).asking.value ? (a(), s(H, { key: 0 }, [
                  M(xe, { "data-agent-stop-ask": "" }, {
                    default: x(() => [...d[17] || (d[17] = [
                      b("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  M(fe, {
                    "data-agent-stop-confirm": "",
                    onClick: d[10] || (d[10] = (o) => (L(), g(r).stop()))
                  }, {
                    default: x(() => [...d[18] || (d[18] = [
                      b("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  M(fe, {
                    onClick: d[11] || (d[11] = (o) => g(r).asking.value = !1)
                  }, {
                    default: x(() => [...d[19] || (d[19] = [
                      b("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (a(), I(fe, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: d[12] || (d[12] = (o) => g(r).asking.value = !0)
                }, {
                  default: x(() => [...d[20] || (d[20] = [
                    b("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : t.value === "start" ? (a(), s(H, { key: 1 }, [
                M(xe, null, {
                  default: x(() => [...d[21] || (d[21] = [
                    b("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (a(!0), s(H, null, te(g(r).programs.value, (o) => (a(), I(fe, {
                  key: o.name,
                  "data-agent-program": o.name,
                  onClick: (A) => (L(), g(r).start(o))
                }, {
                  default: x(() => [
                    b(p(o.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : t.value === "skills" ? (a(), I(Sa, {
                key: 2,
                skills: e.skills,
                onBrowse: d[13] || (d[13] = (o) => (L(), i("open", "skills", null)))
              }, null, 8, ["skills"])) : $.value ? (a(), s(H, { key: 3 }, [
                M(xe, null, {
                  default: x(() => [
                    b(p($.value.label), 1)
                  ]),
                  _: 1
                }),
                t.value === "context" ? (a(), s(H, { key: 0 }, [
                  S("p", Qa, p(g(Na)(((u = B.value) == null ? void 0 : u.last_compaction) ?? null)), 1),
                  S("div", Xa, [
                    S("span", en, [
                      S("span", {
                        style: Re({ width: `${z.value}%` })
                      }, null, 4)
                    ]),
                    S("span", tn, p(z.value) + "%", 1)
                  ]),
                  X.value ? (a(), s("p", an, [
                    b(p(X.value) + " ", 1),
                    ee.value ? (a(), I(_a, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : m("", !0)
                  ])) : m("", !0)
                ], 64)) : m("", !0),
                t.value === "context" && G.value ? (a(), s("p", nn, p(G.value), 1)) : (a(!0), s(H, { key: 2 }, te($.value.choices, (o) => (a(), I(fe, {
                  key: o.value,
                  "data-agent-choice": o.value,
                  onClick: (A) => (g(r).choose($.value.key, o), L())
                }, {
                  default: x(() => [
                    b(p(o.label), 1)
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
}, ln = /* @__PURE__ */ J(sn, [["__scopeId", "data-v-d7113347"]]), rn = ["data-agent-open", "aria-expanded", "role", "tabindex"], cn = {
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
  setup(e, { emit: l }) {
    const n = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), i = ["completed", "testing"], r = { helper: "Helper", reviewer: "Reviewer", main: "Main agent" }, h = { running: "Working", starting: "Starting", stopping: "Stopping", ended: "Idle: its process has stopped", failed: "Could not start", never_started: "Not started" }, t = e, $ = l, C = Ge(), L = c(() => {
      var T, P;
      if ((T = t.facts) != null && T.profile_title) return t.facts.profile_title;
      if ((P = t.facts) != null && P.profile) return t.facts.profile;
      const v = r[t.row.role] || t.row.role;
      return v.slice(0, 1).toUpperCase() + v.slice(1);
    }), R = c(() => {
      var v;
      return ((v = t.facts) == null ? void 0 : v.tasks) ?? [];
    }), E = c(() => R.value.filter((v) => v.state === "open")), V = c(() => R.value.find((v) => {
      var T;
      return v.id === ((T = t.progress) == null ? void 0 : T.task_id) && v.state === "started";
    })), D = c(() => V.value || R.value.find((v) => {
      var T;
      return v.id === ((T = t.facts) == null ? void 0 : T.task_id);
    }) || R.value.find((v) => n.has(v.state)) || E.value[0] || R.value.at(-1)), j = c(() => {
      var v, T, P, ie, le, Y;
      return t.row.role === "helper" ? ((v = t.facts) == null ? void 0 : v.helper_job) || "" : (T = t.facts) != null && T.job_enabled && (((P = V.value) == null ? void 0 : P.title) || ((ie = t.facts) == null ? void 0 : ie.task_title) || ((le = E.value[0]) == null ? void 0 : le.title) || ((Y = R.value.at(-1)) == null ? void 0 : Y.title)) || "";
    }), B = c(() => `${t.row.role} ${t.row.number}`), z = c(() => {
      var v, T;
      return [t.row.program, (v = t.facts) == null ? void 0 : v.model, (T = t.facts) == null ? void 0 : T.effort, B.value].filter(Boolean).join(" · ");
    }), G = c(() => t.row.role === "main" ? L.value : `${L.value} ${t.row.number}`), U = Ie(), ee = c(() => ht(t.row.process_started_at || t.row.created_at, C.value)), se = /* @__PURE__ */ new Set(["open", "started", "testing"]), X = { fresh: "new conversation", resumed: "resumed" }, K = c(() => {
      var v, T;
      return [(v = t.facts) == null ? void 0 : v.helper_job_program, X[(T = t.facts) == null ? void 0 : T.occupant_launch]].filter(Boolean).join(", ");
    }), k = c(() => {
      var v;
      return (v = t.facts) == null ? void 0 : v.work_status;
    }), d = c(() => !!t.row.ended_at && t.row.role !== "main" && R.value.some((v) => se.has(v.state))), F = c(() => {
      var v, T;
      return t.row.state === "running" && ((v = t.facts) == null ? void 0 : v.state) === "at usage limit" && !!((T = t.facts) != null && T.usage_limit_ends_at);
    }), f = (v) => new Date(v).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), u = c(() => t.row.halted_at ? `Stopped at the usage limit since ${f(t.row.halted_at)}, goes on at ${f(t.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(t.facts.usage_limit_ends_at).toLocaleString()}`), o = c(() => {
      var v;
      return t.row.retired_at || t.row.state === "retired" ? "retired" : F.value || k.value || t.waitReason || d.value ? "waiting" : t.row.state === "running" && ((v = t.facts) == null ? void 0 : v.state) || t.row.state;
    }), A = c(() => {
      var v;
      return F.value ? u.value : k.value ? `Status: ${k.value}` : t.waitReason ? `Waiting: ${t.waitReason}` : o.value === "blocked" ? (v = t.facts) != null && v.blocked_reason ? `Blocked: ${t.facts.blocked_reason}` : "Blocked" : d.value ? "Stopped with work left" : "";
    }), O = c(() => {
      var v;
      return ((v = t.progress) == null ? void 0 : v.completed_count) ?? R.value.filter((T) => i.includes(T.state)).length;
    }), q = c(() => {
      var v;
      return gt(O.value, ((v = t.progress) == null ? void 0 : v.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, C.value);
    }), he = c(() => t.row.role === "main" ? 0 : q.value), ge = c(() => !!t.row.retired_at || t.row.state === "retired"), me = c(() => ge.value ? "Retired" : o.value === "blocked" || o.value === "waiting" ? A.value || (o.value === "blocked" ? "Blocked" : "Waiting") : h[t.row.standing]), ke = c(() => {
      var T;
      if (ge.value) return t.row.retired_at;
      const v = o.value === "blocked" || o.value === "waiting";
      return t.row.ended_at || v && ((T = t.facts) == null ? void 0 : T.last_activity) || t.row.process_started_at || t.row.created_at;
    }), Z = c(() => pt(ke.value, C.value)), Te = c(() => {
      var v;
      return vt((v = t.facts) == null ? void 0 : v.last_activity, C.value);
    });
    return (v, T) => {
      var P, ie, le, Y, ye, Ae, we;
      return a(), s("div", {
        class: oe(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: T[1] || (T[1] = (ae) => !e.open && $("toggle")),
        onKeydown: [
          T[2] || (T[2] = Ee(ue((ae) => !e.open && $("toggle"), ["self", "prevent"]), ["enter"])),
          T[3] || (T[3] = Ee(ue((ae) => !e.open && $("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        S("div", cn, [
          e.open ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back",
            "aria-label": "Back",
            onClick: T[0] || (T[0] = ue((ae) => $("toggle"), ["stop"]))
          }, [
            M(g(ze), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : m("", !0),
          e.open ? (a(), s(H, { key: 1 }, [
            S("span", dn, p(G.value), 1),
            S("span", un, p(((P = e.facts) == null ? void 0 : P.given_name) || e.row.id), 1)
          ], 64)) : (a(), s(H, { key: 2 }, [
            M(g(ft), {
              "agent-id": e.row.id,
              label: L.value,
              class: "agent-who"
            }, {
              default: x(() => {
                var ae;
                return [
                  S("span", hn, p(L.value), 1),
                  S("span", gn, p(((ae = e.facts) == null ? void 0 : ae.given_name) || e.row.id), 1)
                ];
              }),
              _: 1
            }, 8, ["agent-id", "label"]),
            M(g(ze), {
              class: "agent-chevron",
              name: "chevronRight",
              size: 12
            })
          ], 64))
        ]),
        e.open ? m("", !0) : (a(), s("span", pn, [
          S("span", vn, p(z.value), 1),
          (ie = e.facts) != null && ie.sandbox_off ? (a(), s("span", fn, "sandbox off")) : m("", !0)
        ])),
        e.open && !ge.value ? (a(), I(ln, {
          key: 1,
          class: "agent-live",
          "agent-programs": g(U).props.programs.rows.value,
          agent: e.row,
          branch: (le = e.progress) == null ? void 0 : le.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((Y = e.facts) == null ? void 0 : Y.windows) ?? [] },
          card: ""
        }, {
          default: x(() => {
            var ae, be;
            return [
              (ae = e.facts) != null && ae.sandbox_off ? (a(), s("span", mn, "sandbox off")) : m("", !0),
              S("span", kn, "Run time: " + p(ee.value), 1),
              (be = e.facts) != null && be.last_activity ? (a(), s("span", yn, [
                T[4] || (T[4] = b("Seen: ", -1)),
                M(g(Fe), {
                  at: e.facts.last_activity
                }, null, 8, ["at"])
              ])) : m("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : m("", !0),
        (ye = e.facts) != null && ye.unit_name ? (a(), s("div", wn, "Unit: " + p(e.facts.unit_name), 1)) : m("", !0),
        e.open ? m("", !0) : (a(), I(ga, {
          key: 3,
          tasks: R.value,
          "in-hand": e.row.role !== "helper" && ((Ae = e.facts) != null && Ae.job_enabled) && D.value || null,
          job: e.row.role === "helper" ? j.value : "",
          "job-title": e.row.role === "helper" && ((we = e.facts) == null ? void 0 : we.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? K.value : "",
          "per-hour": he.value
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour"])),
        M(Xt, {
          state: o.value,
          doing: me.value,
          since: Z.value,
          seen: Te.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (a(), I(Kt, {
          key: 4,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: R.value,
          "stopped-with-work": d.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : m("", !0)
      ], 42, rn);
    };
  }
}, Mn = /* @__PURE__ */ J(bn, [["__scopeId", "data-v-de207be6"]]), xn = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, $n = ["data-agent-row", "data-agent-lingering"], qe = "journal.agents.filters", De = 300 * 1e3, _e = "cubic-bezier(0.2, 0.9, 0.25, 1)", Sn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const l = e, n = Ie(), { rows: i } = n.props.waits, { rows: r } = n.props.progress, { rows: h, failure: t, loaded: $, more: C } = n.props.agents, L = (w) => r.value.find((_) => _.agent_id === w.id) ?? null, R = (w) => {
      var _;
      return ((_ = i.value.find((y) => y.agent_id === w.id)) == null ? void 0 : _.reason) ?? "";
    }, E = W("running"), V = W(""), D = JSON.parse(localStorage.getItem(qe) || '{"roles":[],"profiles":[],"programs":[]}'), j = W(D), B = c(() => n.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: z } = n.props.programs, G = c(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), U = (w, _) => {
      j.value = bt(j.value, w, _);
    }, ee = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, se = (w) => w.slice(0, 1).toUpperCase() + w.slice(1);
    re(j, (w) => localStorage.setItem(qe, JSON.stringify(w)));
    const X = W(25);
    function K() {
      Object.assign(n.state, {
        "agents.show": E.value,
        "agents.search": V.value,
        "agents.limit": String(X.value),
        "agents.roles": j.value.roles.join(","),
        "agents.profiles": j.value.profiles.join(","),
        "agents.programs": j.value.programs.join(",")
      });
    }
    async function k() {
      return X.value += 25, K(), await n.reload("agents"), !0;
    }
    re([E, V, j], () => {
      X.value = 25, K(), n.reload("agents");
    }), K();
    const d = (w) => w.facts ?? null, F = h, f = Ge(), u = W([]), o = c(() => new Set(u.value.filter((w) => f.value - w.left < De).map((w) => w.row.id))), A = c(() => u.value.filter((w) => o.value.has(w.row.id)).map((w) => w.row)), O = c(() => [...F.value, ...A.value]);
    let q = "", he = [];
    async function ge(w) {
      await n.reload(`card.${w.id}`);
      const _ = n.props[`card.${w.id}`].rows.value.find((y) => y.id === w.id);
      _ != null && _.ended_at && !u.value.some((y) => y.row.id === w.id) && (u.value = [...u.value, { row: _, left: Date.now() }]);
    }
    re(h, (w) => {
      const _ = q === `${E.value}|${V.value}|${JSON.stringify(j.value)}` && E.value === "running", y = _ ? he.filter((N) => !w.some((ce) => ce.id === N.id)) : [];
      q = `${E.value}|${V.value}|${JSON.stringify(j.value)}`, he = w, u.value = _ ? u.value.filter((N) => f.value - N.left < De && !w.some((ce) => ce.id === N.row.id)) : [], y.forEach(ge);
    }, { immediate: !0 });
    const me = c(() => !!V.value.trim() || G.value > 0), ke = c(() => l.texts[E.value] ?? { title: l.empty, hint: "" }), Z = W(null), Te = W(null), v = W(null), T = W(null), P = c(() => Z.value === null ? null : n.props[`card.${Z.value}`].rows.value.find((w) => w.id === Z.value) ?? Te.value), ie = c(() => P.value ? [P.value] : O.value), le = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, Y = W(!1);
    let ye = 0;
    async function Ae(w) {
      if (Y.value) return;
      Y.value = !0, ye = T.value.scrollTop;
      const _ = v.value.querySelector(`[data-agent-open="${w.id}"]`);
      if (!le()) {
        const de = [...v.value.querySelectorAll(".agent-row")].filter((ne) => !ne.contains(_));
        await Promise.all(de.map((ne) => ne.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const y = [..._.querySelectorAll(".agent-head, .agent-line")], N = [...y, ..._.querySelectorAll("[data-agent-motion]")], ce = N.map((de) => de.getBoundingClientRect());
      if (Te.value = w, Z.value = w.id, n.reload(`card.${w.id}`), await Ne(), !le()) {
        const de = N.map((ne) => ne.getBoundingClientRect());
        N.forEach((ne, Le) => {
          const pe = y.findIndex((He) => He !== ne && He.contains(ne)), Ke = ce[Le].left - de[Le].left - (pe < 0 ? 0 : ce[pe].left - de[pe].left), Ze = ce[Le].top - de[Le].top - (pe < 0 ? 0 : ce[pe].top - de[pe].top);
          ne.animate([{ transform: `translate(${Ke}px, ${Ze}px)` }, { transform: "none" }], { duration: 280, easing: _e });
        }), v.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ne) => {
          ne.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: _e, fill: "backwards" });
        });
      }
      Y.value = !1;
    }
    async function we() {
      if (Y.value || !P.value) return;
      Y.value = !0;
      const w = v.value.querySelector(`[data-agent-open="${Z.value}"]`), _ = [...w.children], y = le() ? [] : _.map((N) => N.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(y.map((N) => N.finished)), Z.value = null, await Ne(), T.value.scrollTop = ye, y.forEach((N) => N.cancel()), le() || (w.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: _e }), v.value.querySelectorAll(".agent-row").forEach((N) => {
        N.contains(w) || N.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: _e });
      })), Y.value = !1;
    }
    const ae = (w) => Z.value === w.id ? we() : Ae(w);
    re(V, (w) => w.trim() && (Z.value = null)), re(E, () => {
      Z.value = null;
    });
    const be = (w) => {
      w.key === "Escape" && we();
    };
    return window.addEventListener("keydown", be), $e(() => window.removeEventListener("keydown", be)), (w, _) => (a(), s("div", {
      ref_key: "agents",
      ref: v,
      class: oe(["agents", { focused: P.value, "card-changing": Y.value }])
    }, [
      P.value ? m("", !0) : (a(), I(g(mt), {
        key: 0,
        modelValue: V.value,
        "onUpdate:modelValue": _[1] || (_[1] = (y) => V.value = y),
        placeholder: "Search agents",
        "menu-count": G.value,
        "data-agents-search": ""
      }, {
        menu: x(() => [
          M(g(Oe), null, {
            default: x(() => [..._[2] || (_[2] = [
              b("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(H, null, te(B.value.roles, (y) => (a(), I(g(je), {
            key: y,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes(y),
            checked: j.value.roles.includes(y),
            "data-filter-role": y,
            onClick: (N) => U("roles", y)
          }, {
            default: x(() => [
              b(p(se(y)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          B.value.profiles.length ? (a(), I(g(Oe), { key: 0 }, {
            default: x(() => [..._[3] || (_[3] = [
              b("Profile", -1)
            ])]),
            _: 1
          })) : m("", !0),
          (a(!0), s(H, null, te(B.value.profiles, (y) => (a(), I(g(je), {
            key: y.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes(y.name),
            checked: j.value.profiles.includes(y.name),
            "data-filter-profile": y.name,
            onClick: (N) => U("profiles", y.name)
          }, {
            default: x(() => [
              b(p(y.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          M(g(Oe), null, {
            default: x(() => [..._[4] || (_[4] = [
              b("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(H, null, te(g(z), (y) => (a(), I(g(je), {
            key: y.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.programs.includes(y.name),
            checked: j.value.programs.includes(y.name),
            "data-filter-program": y.name,
            onClick: (N) => U("programs", y.name)
          }, {
            default: x(() => [
              b(p(y.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          G.value ? (a(), I(g(je), {
            key: 1,
            "data-filter-clear": "",
            onClick: ee
          }, {
            default: x(() => [..._[5] || (_[5] = [
              b("Clear filters", -1)
            ])]),
            _: 1
          })) : m("", !0)
        ]),
        default: x(() => [
          M(g(kt), {
            options: B.value.states,
            value: E.value,
            onPick: _[0] || (_[0] = (y) => E.value = y)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      E.value === "retired" && B.value.upgrade_retired ? (a(), s("p", xn, "Retired during the upgrade: " + p(B.value.upgrade_retired), 1)) : m("", !0),
      S("div", {
        ref_key: "list",
        ref: T,
        class: oe(["agents-view", { "agents-view-open": P.value }])
      }, [
        g($) && !g(t) && !ie.value.length && G.value ? (a(), I(g(Ve), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: x(() => [
            M(g(yt), {
              small: "",
              "data-empty-clear": "",
              onClick: ee
            }, {
              default: x(() => [..._[6] || (_[6] = [
                b("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), I(g(wt), {
          key: 1,
          moves: "",
          "leaves-at-once": Y.value,
          rows: ie.value,
          failure: g(t),
          loaded: g($),
          more: !P.value && g(C),
          older: k,
          empty: ke.value.title,
          hint: ke.value.hint,
          searching: me.value
        }, {
          default: x(({ row: y }) => [
            S("div", {
              class: oe(["agent-row", { lingering: o.value.has(y.id) && y.id !== Z.value }]),
              "data-agent-row": y.id,
              "data-agent-lingering": o.value.has(y.id) ? "" : null
            }, [
              M(Mn, {
                row: y,
                facts: d(y),
                progress: L(y),
                "wait-reason": R(y),
                open: y.id === Z.value,
                onToggle: (N) => ae(y)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, $n)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Ln = /* @__PURE__ */ J(Sn, [["__scopeId", "data-v-fceb20c3"]]);
export {
  Ln as A
};
