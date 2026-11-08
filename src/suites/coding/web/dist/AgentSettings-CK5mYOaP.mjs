/* @code-commandments-generated */
import { reactive as Z, ref as $, computed as C, watch as G, openBlock as t, createElementBlock as l, Fragment as A, renderList as P, createElementVNode as n, toDisplayString as v, createBlock as O, unref as y, withDirectives as de, vModelText as ce, createCommentVNode as b, createVNode as S, withCtx as T, createTextVNode as h, withModifiers as pe, useModel as ge, normalizeClass as X, normalizeStyle as Y, mergeModels as ve, onMounted as ke } from "vue";
import { useWindow as q, Switch as ee, Btn as M, TextInput as me, useNow as ye, age as fe, Icon as _e, WindowRoom as he, Segmented as be } from "@journal/window-kit";
import { _ as V } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const we = ["data-agent-settings-group"], $e = ["data-control"], Ce = { class: "group-text" }, Ae = { class: "group-label" }, Se = { class: "group-line" }, je = { class: "group-source" }, Te = ["onUpdate:modelValue", "data-field"], xe = {
  key: 0,
  class: "group-hint",
  "data-group-blank": ""
}, Me = {
  key: 1,
  class: "group-hint",
  role: "alert",
  "data-group-stale": ""
}, Oe = {
  key: 2,
  class: "group-failure",
  role: "alert",
  "data-group-failure": ""
}, Re = { class: "group-buttons" }, Be = {
  __name: "AgentSettingsGroup",
  props: { group: { type: String, required: !0 } },
  setup(m) {
    const k = m, r = q(), _ = r.props.work, s = Z({}), i = $(""), d = $(""), w = $(!1), R = C(() => {
      var u;
      return (((u = _.data.value) == null ? void 0 : u.fields) ?? []).filter((c) => c.group === k.group);
    }), U = (u) => u.type === "flag" ? !!u.value : String(u.value), N = C(() => R.value.filter((u) => s[u.key] !== U(u))), B = C(() => N.value.length > 0), W = C(() => {
      var u;
      return B.value && i.value && ((u = _.data.value) == null ? void 0 : u.revision) !== i.value;
    }), x = (u) => u.type === "flag" ? s[u.key] ? "on" : "off" : String(s[u.key]).trim(), j = C(() => N.value.some((u) => u.type !== "flag" && x(u) === ""));
    function I() {
      var u;
      for (const c of R.value) s[c.key] = U(c);
      i.value = ((u = _.data.value) == null ? void 0 : u.revision) ?? "", d.value = "";
    }
    G(() => _.data.value, () => {
      (!i.value || !B.value) && I();
    }, { immediate: !0 });
    async function E() {
      w.value = !0;
      const u = await r.run(`work-settings apply --revision ${i.value} ${N.value.map((c) => `${c.key}=${x(c)}`).join(" ")}`);
      w.value = !1, d.value = u.ok ? "" : u.error, await r.reload("work"), u.ok && I();
    }
    return (u, c) => (t(), l("section", {
      class: "group",
      "data-agent-settings-group": m.group
    }, [
      (t(!0), l(A, null, P(R.value, (g) => (t(), l("label", {
        key: g.key,
        class: "group-row",
        "data-control": g.key
      }, [
        n("span", Ce, [
          n("span", Ae, v(g.title), 1),
          n("span", Se, v(g.description), 1),
          n("span", je, v(g.source), 1)
        ]),
        g.type === "flag" ? (t(), O(y(ee), {
          key: 0,
          on: s[g.key],
          onChange: (p) => s[g.key] = !s[g.key]
        }, null, 8, ["on", "onChange"])) : de((t(), l("input", {
          key: 1,
          "onUpdate:modelValue": (p) => s[g.key] = p,
          class: "group-input",
          type: "number",
          min: "0",
          step: "any",
          "data-field": g.key
        }, null, 8, Te)), [
          [ce, s[g.key]]
        ])
      ], 8, $e))), 128)),
      j.value ? (t(), l("p", xe, "A number is missing.")) : b("", !0),
      W.value ? (t(), l("p", Me, "These settings changed since you opened them. Cancel to read them again.")) : b("", !0),
      d.value ? (t(), l("p", Oe, v(d.value), 1)) : b("", !0),
      n("div", Re, [
        S(y(M), {
          disabled: !B.value || w.value,
          "data-group-cancel": "",
          onClick: I
        }, {
          default: T(() => [...c[0] || (c[0] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        S(y(M), {
          disabled: !B.value || w.value || W.value || j.value,
          "data-group-apply": "",
          onClick: E
        }, {
          default: T(() => [...c[1] || (c[1] = [
            h("Apply", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 8, we));
  }
}, te = /* @__PURE__ */ V(Be, [["__scopeId", "data-v-9082d05c"]]), Ie = {
  __name: "AgentSettingsAdvanced",
  setup(m) {
    return (k, r) => (t(), O(te, {
      group: "advanced",
      "data-agent-settings-advanced": ""
    }));
  }
}, We = { class: "action-buttons" }, Ne = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(m) {
    return (k, r) => (t(), l("form", {
      "data-agent-retire-confirm": "",
      onSubmit: r[2] || (r[2] = pe((_) => k.$emit("submit"), ["prevent"]))
    }, [
      r[5] || (r[5] = n("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      S(y(me), {
        "model-value": m.reason,
        label: "Reason",
        disabled: m.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": r[0] || (r[0] = (_) => k.$emit("update:reason", _))
      }, null, 8, ["model-value", "disabled"]),
      n("div", We, [
        S(y(M), {
          type: "submit",
          small: "",
          disabled: m.pending || !m.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: T(() => [...r[3] || (r[3] = [
            h("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        S(y(M), {
          small: "",
          disabled: m.pending,
          onClick: r[1] || (r[1] = (_) => k.$emit("cancel"))
        }, {
          default: T(() => [...r[4] || (r[4] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ee = /* @__PURE__ */ V(Ne, [["__scopeId", "data-v-bbe4e841"]]), Ue = ["data-edit-type"], Pe = { key: 0 }, Ve = { class: "stepper" }, Fe = ["disabled", "onClick"], De = ["value", "disabled", "data-agent-limit-input", "onChange"], Ke = ["disabled", "onClick"], Le = { key: 0 }, qe = { key: 1 }, ze = {
  __name: "AgentLimitEditor",
  props: { rows: { type: Array, required: !0 }, pending: Boolean, readOnly: Boolean, environment: { type: String, required: !0 } },
  emits: ["change"],
  setup(m, { emit: k }) {
    const r = k;
    return (_, s) => (t(), l(A, null, [
      s[0] || (s[0] = n("p", null, "How many agents of a type may run at once, and how many may be kept.", -1)),
      (t(!0), l(A, null, P(m.rows, (i) => (t(), l("div", {
        key: i.key,
        class: "edit-row",
        "data-edit-type": i.key
      }, [
        n("div", null, [
          n("strong", null, v(i.per_profile ? "Each helper type" : "Workers"), 1),
          i.per_profile ? (t(), l("small", Pe, "Researcher, Planner and the others")) : b("", !0)
        ]),
        (t(!0), l(A, null, P([{ name: "Most running", value: i.run_limit, key: i.run_setting, source: i.run_source, kind: "run" }, { name: "Most kept", value: i.kept_limit, key: i.kept_setting, source: i.kept_source, kind: "kept" }], (d) => (t(), l("label", {
          key: d.key
        }, [
          h(v(d.name), 1),
          n("span", Ve, [
            n("button", {
              type: "button",
              disabled: m.pending || m.readOnly || d.value === 0,
              onClick: (w) => r("change", i, d.key, d.value, d.value - 1)
            }, "−", 8, Fe),
            n("input", {
              type: "number",
              min: "0",
              value: d.value,
              disabled: m.pending || m.readOnly,
              "data-agent-limit-input": d.kind,
              onChange: (w) => r("change", i, d.key, d.value, w.target.value)
            }, null, 40, De),
            n("button", {
              type: "button",
              disabled: m.pending || m.readOnly,
              onClick: (w) => r("change", i, d.key, d.value, d.value + 1)
            }, "+", 8, Ke)
          ]),
          d.value === 0 ? (t(), l("small", Le, v(d.kind === "run" ? "None can start" : "Any number"), 1)) : d.source === `environment ${m.environment}` ? (t(), l("small", qe, "Changed for " + v(m.environment), 1)) : b("", !0)
        ]))), 128))
      ], 8, Ue))), 128))
    ], 64));
  }
}, He = /* @__PURE__ */ V(ze, [["__scopeId", "data-v-f4f7965a"]]), Ge = (m) => m.flatMap((k) => k.per_profile ? k.profiles.map((r) => ({ ...r, label: r.title, type: k.key, key: `${k.key}:${r.profile}` })) : [{ ...k, type: k.key }]), Je = (m, k) => k > 0 && m >= k, Qe = { class: "counts-panel" }, Xe = { class: "counts" }, Ye = ["data-count-agent"], Ze = { class: "person-text" }, et = {
  key: 0,
  class: "helper-head"
}, tt = ["data-agent-limit-type", "data-agent-limit-profile", "onClick"], nt = {
  key: 0,
  class: "bar"
}, at = {
  key: 5,
  role: "alert"
}, st = {
  key: 6,
  role: "status"
}, lt = { class: "foot" }, ot = { class: "foot-note" }, it = {
  __name: "AgentCountsPanel",
  props: {
    title: { default: "Agent counts" },
    titleModifiers: {}
  },
  emits: /* @__PURE__ */ ve(["open-agent", "close"], ["update:title"]),
  setup(m, { emit: k }) {
    const r = k, _ = ge(m, "title"), s = q(), i = C(() => s.props.limits.rows.value ?? []), d = C(() => s.props.limits.failure.value), w = $([]), R = $(0), U = $(!1), N = ye(), B = $(null), W = $(!1), x = $(!1), j = $(""), I = $(""), E = $(null), u = $(""), c = C(() => Ge(i.value)), g = C(() => i.value.find((o) => o.per_profile)), p = C(() => c.value.find((o) => o.key === B.value)), D = C(() => w.value.filter((o) => {
      var e, a;
      return o.state !== "retired" && o.role === ((e = p.value) == null ? void 0 : e.type) && (!p.value.profile || (((a = o.facts) == null ? void 0 : a.profile) || o.profile) === p.value.profile);
    }).sort((o, e) => (o.state !== "running") - (e.state !== "running") || String(o.ended_at || o.created_at).localeCompare(String(e.ended_at || e.created_at)))), ne = C(() => {
      var e;
      const o = /* @__PURE__ */ new Map();
      for (const a of D.value) {
        const f = ((e = a.facts) == null ? void 0 : e.model) || a.program_model;
        f && o.set(f, (o.get(f) || 0) + 1);
      }
      return [...o].map(([a, f]) => `${f} ${a}`).join(", ");
    }), ae = (o, e) => e ? `${Math.min(o / Math.max(o, e) * 100, 100)}%` : "0%", se = (o, e) => e && o > e ? `${(o - e) / o * 100}%` : "0%";
    G(() => {
      var o;
      return W.value ? "Change the maximums" : ((o = p.value) == null ? void 0 : o.label) || "Agent counts";
    }, (o) => {
      _.value = o;
    }, { immediate: !0 });
    async function z(o, e = 1) {
      s.state["count-agents.role"] = o.type, o.profile ? s.state["count-agents.profile"] = o.profile : delete s.state["count-agents.profile"], s.state["count-agents.page"] = String(e), await s.reload("count-agents");
      const a = s.props["count-agents"];
      w.value = e === 1 ? [...a.rows.value] : [...w.value, ...a.rows.value], R.value = e, U.value = a.more.value;
    }
    function le(o) {
      B.value = o.key, w.value = [], z(o);
    }
    function H() {
      W.value = !1, B.value = null, E.value = null, j.value = "";
    }
    function oe() {
      H(), r("close");
    }
    async function ie(o, e, a, f) {
      if (x.value || s.readOnly) return;
      const F = Number(f);
      if (!String(f).trim() || !Number.isInteger(F) || F < 0) {
        j.value = "Use a whole number of 0 or more.";
        return;
      }
      x.value = !0, j.value = "";
      const K = await s.run(["setting", "set", e, String(F), "--environment", s.environment]);
      K.ok ? (await s.reload("limits"), I.value = "Saved.") : j.value = K.error, x.value = !1;
    }
    async function re(o) {
      if (!u.value.trim() || x.value) return;
      x.value = !0;
      const e = await s.run(["agent", "retire", String(o.id), "--reason", u.value.trim()]);
      j.value = e.ok ? "" : "The agent could not be retired. Try again.", e.ok && (E.value = null, u.value = "", I.value = "Agent retired permanently.", await s.reload("limits"), await z(p.value)), x.value = !1;
    }
    function ue(o) {
      oe(), r("open-agent", o);
    }
    return (o, e) => (t(), l("div", Qe, [
      n("div", Xe, [
        W.value || p.value ? (t(), l("button", {
          key: 0,
          class: "back",
          type: "button",
          onClick: H
        }, "‹ Back to the counts")) : b("", !0),
        d.value ? (t(), l(A, { key: 1 }, [
          e[6] || (e[6] = n("strong", null, "The counts could not be read", -1)),
          e[7] || (e[7] = n("p", null, "The journal did not answer.", -1)),
          S(y(M), {
            small: "",
            onClick: e[0] || (e[0] = (a) => y(s).reload("limits"))
          }, {
            default: T(() => [...e[5] || (e[5] = [
              h("Try again", -1)
            ])]),
            _: 1
          })
        ], 64)) : W.value ? (t(), O(He, {
          key: 2,
          rows: i.value,
          pending: x.value,
          "read-only": y(s).readOnly,
          environment: y(s).environment,
          onChange: ie
        }, null, 8, ["rows", "pending", "read-only", "environment"])) : p.value ? (t(), l(A, { key: 3 }, [
          n("p", null, [
            n("strong", null, v(p.value.running) + " of " + v(p.value.run_limit), 1),
            e[8] || (e[8] = h(" running, ", -1)),
            n("strong", null, [
              h(v(p.value.kept), 1),
              p.value.kept_limit ? (t(), l(A, { key: 0 }, [
                h(" of " + v(p.value.kept_limit), 1)
              ], 64)) : b("", !0)
            ]),
            e[9] || (e[9] = h(" kept", -1))
          ]),
          n("p", null, v(ne.value), 1),
          D.value.length ? b("", !0) : (t(), l(A, { key: 0 }, [
            e[10] || (e[10] = n("strong", null, "No agents here yet", -1)),
            e[11] || (e[11] = n("p", null, "An agent shows here as soon as one of this type starts.", -1))
          ], 64)),
          (t(!0), l(A, null, P(D.value, (a) => {
            var f, F, K, J, Q;
            return t(), l("div", {
              key: a.id,
              class: "person",
              "data-count-agent": a.id
            }, [
              n("span", {
                class: X(["dot", { running: a.state === "running" }])
              }, null, 2),
              n("div", Ze, [
                n("strong", null, v(((f = a.facts) == null ? void 0 : f.given_name) || a.id), 1),
                h(" " + v(a.state === "running" ? "Running" : "Idle") + ", " + v(y(fe)(a.state === "running" ? a.process_started_at || a.created_at : a.ended_at, y(N))), 1),
                n("small", null, v([a.program, (F = a.facts) == null ? void 0 : F.model, (K = a.facts) == null ? void 0 : K.effort, `${a.role} ${a.id}`].filter(Boolean).join(", ")), 1),
                n("small", null, v(((J = a.facts) == null ? void 0 : J.task_title) || ((Q = a.facts) == null ? void 0 : Q.helper_job)), 1)
              ]),
              S(y(M), {
                small: "",
                onClick: (L) => ue(a)
              }, {
                default: T(() => [...e[12] || (e[12] = [
                  h("Open", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              a.state === "idle" && !y(s).readOnly ? (t(), O(y(M), {
                key: 0,
                small: "",
                onClick: (L) => {
                  E.value = a.id, u.value = "";
                }
              }, {
                default: T(() => [...e[13] || (e[13] = [
                  h("Retire", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : b("", !0),
              E.value === a.id ? (t(), O(Ee, {
                key: 1,
                reason: u.value,
                "onUpdate:reason": e[1] || (e[1] = (L) => u.value = L),
                pending: x.value,
                onSubmit: (L) => re(a),
                onCancel: e[2] || (e[2] = (L) => E.value = null)
              }, null, 8, ["reason", "pending", "onSubmit"])) : b("", !0)
            ], 8, Ye);
          }), 128)),
          U.value ? (t(), O(y(M), {
            key: 1,
            small: "",
            onClick: e[3] || (e[3] = (a) => z(p.value, R.value + 1))
          }, {
            default: T(() => [...e[14] || (e[14] = [
              h("Show more", -1)
            ])]),
            _: 1
          })) : b("", !0)
        ], 64)) : (t(), l(A, { key: 4 }, [
          e[16] || (e[16] = n("p", null, "Kept agents have not been retired, so they can take another job. Open an item to see them.", -1)),
          e[17] || (e[17] = n("div", { class: "columns" }, [
            n("span", null, "Name"),
            n("span", null, "Running"),
            n("span", null, "Kept"),
            n("span")
          ], -1)),
          g.value ? (t(), l("div", et, [
            e[15] || (e[15] = n("strong", null, "Helpers", -1)),
            n("span", null, v(g.value.running) + " running, " + v(g.value.kept) + " kept", 1)
          ])) : b("", !0),
          (t(!0), l(A, null, P(c.value, (a) => (t(), l("button", {
            key: a.key,
            type: "button",
            class: "count-row",
            "data-agent-limit-type": a.type || a.key,
            "data-agent-limit-profile": a.profile,
            onClick: (f) => le(a)
          }, [
            n("strong", null, v(a.label), 1),
            (t(!0), l(A, null, P([{ count: a.running, limit: a.run_limit, unlimited: !1 }, { count: a.kept, limit: a.kept_limit, unlimited: !0 }], (f) => (t(), l("span", {
              key: f.unlimited,
              class: X({ full: y(Je)(f.count, f.limit) })
            }, [
              n("span", null, [
                h(v(f.count), 1),
                f.limit || !f.unlimited ? (t(), l(A, { key: 0 }, [
                  h(" of " + v(f.limit), 1)
                ], 64)) : b("", !0)
              ]),
              f.limit ? (t(), l("span", nt, [
                n("span", {
                  style: Y({ width: ae(f.count, f.limit) })
                }, null, 4),
                n("i", {
                  style: Y({ width: se(f.count, f.limit) })
                }, null, 4)
              ])) : b("", !0)
            ], 2))), 128)),
            S(y(_e), {
              name: "chevronRight",
              size: 12
            })
          ], 8, tt))), 128))
        ], 64)),
        j.value ? (t(), l("p", at, v(j.value), 1)) : I.value ? (t(), l("p", st, v(I.value), 1)) : b("", !0)
      ]),
      n("div", lt, [
        W.value ? (t(), l(A, { key: 0 }, [
          n("span", ot, v(I.value || `Changes apply to ${y(s).environment}.`), 1),
          S(y(M), { onClick: H }, {
            default: T(() => [...e[18] || (e[18] = [
              h("Done", -1)
            ])]),
            _: 1
          })
        ], 64)) : p.value ? b("", !0) : (t(), O(y(M), {
          key: 1,
          disabled: y(s).readOnly,
          "data-agent-limits-edit": "",
          onClick: e[4] || (e[4] = (a) => W.value = !0)
        }, {
          default: T(() => [...e[19] || (e[19] = [
            h("Change the maximums", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]))
      ])
    ]));
  }
}, rt = /* @__PURE__ */ V(it, [["__scopeId", "data-v-b07672a4"]]), ut = {
  class: "agents",
  "data-agent-settings-agents": ""
}, dt = { class: "agents-title" }, ct = {
  __name: "AgentSettingsAgents",
  setup(m) {
    const k = q(), r = $("Agent counts"), _ = (s) => k.open("agents.agents", s.id);
    return ke(() => k.reload("limits")), (s, i) => (t(), l("section", ut, [
      n("h3", dt, v(r.value), 1),
      S(rt, {
        title: r.value,
        "onUpdate:title": i[0] || (i[0] = (d) => r.value = d),
        onOpenAgent: _
      }, null, 8, ["title"])
    ]));
  }
}, pt = /* @__PURE__ */ V(ct, [["__scopeId", "data-v-4077038c"]]), gt = {
  __name: "AgentSettingsTests",
  setup(m) {
    return (k, r) => (t(), O(te, {
      group: "tests",
      "data-agent-settings-tests": ""
    }));
  }
}, vt = {
  class: "work",
  "data-agent-settings-work": ""
}, kt = {
  class: "work-flow",
  "data-work-flow": ""
}, mt = { class: "work-presets" }, yt = ["data-control"], ft = { class: "work-text" }, _t = { class: "work-label" }, ht = { class: "work-line" }, bt = {
  key: 0,
  class: "work-hint",
  "data-work-hint": ""
}, wt = {
  key: 1,
  class: "work-hint",
  role: "alert",
  "data-work-stale": ""
}, $t = {
  key: 2,
  class: "work-failure",
  role: "alert",
  "data-work-failure": ""
}, Ct = { class: "work-buttons" }, At = "journal.suites.coding.auto-mode", St = "journal.suites.coding.workers.main-dispatches-workers", jt = {
  __name: "AgentSettingsWork",
  setup(m) {
    const k = [
      { key: "journal.suites.coding.auto-mode", label: "Auto mode", line: "The journal hands the main agent its next task, and it keeps going while tasks are left" },
      { key: "journal.suites.coding.main-writes-code", label: "Main agent writes code", line: "The main agent may change project files itself; off, it plans, delegates and merges" },
      { key: "journal.suites.coding.workers.main-dispatches-workers", label: "Main agent sends workers", line: "Whether the main agent may send workers to do tasks." },
      { key: "journal.suites.coding.continue-while-delegatable", label: "Keep going while work can be delegated", line: "Keep the main agent working while open tasks can still be sent to workers." },
      { key: "journal.suites.coding.workers.merger-on", label: "Merger takes in workers", line: "A helper merges workers whose tests passed, and passes on what the main agent must judge." },
      { key: "journal.suites.coding.main-starts-helpers", label: "Use ordinary helpers", line: "Whether the main agent may start ordinary helpers." },
      { key: "journal.suites.coding.designer-enabled", label: "Use a designer", line: "Whether the main agent may start a designer, which writes a design document and changes no code." },
      { key: "journal.suites.coding.workers.main-agent-may-merge", label: "Main agent may merge workers", line: "Whether the main agent may merge the work of a worker itself." }
    ], r = [{ key: "builder", label: "Builder" }, { key: "orchestrator", label: "Orchestrator" }], _ = q(), s = _.props.work, i = Z({}), d = $(""), w = $(""), R = $(!1), U = C(() => k.filter((c) => {
      var g, p;
      return i[c.key] !== ((p = (g = s.data.value) == null ? void 0 : g.controls) == null ? void 0 : p[c.key]);
    })), N = C(() => U.value.length > 0), B = C(() => N.value && s.data.value && d.value && s.data.value.revision !== d.value), W = C(() => {
      var c;
      return ((c = s.data.value) == null ? void 0 : c.workflow) ?? "";
    }), x = C(() => i[At] === !1 && i[St] === !1);
    function j() {
      const c = s.data.value;
      if (c) {
        for (const g of k) i[g.key] = c.controls[g.key];
        d.value = c.revision, w.value = "";
      }
    }
    G(() => s.data.value, () => {
      (!d.value || !N.value) && j();
    }, { immediate: !0 });
    async function I(c) {
      R.value = !0;
      const g = await _.run(c);
      R.value = !1, g.ok ? (await _.reload("work"), j()) : (w.value = g.error, await _.reload("work"));
    }
    const E = () => I(`work-settings apply --revision ${d.value} ${U.value.map((c) => `${c.key}=${i[c.key] ? "on" : "off"}`).join(" ")}`), u = (c) => I(`work-settings preset ${c} --revision ${d.value}`);
    return (c, g) => (t(), l("section", vt, [
      n("p", kt, [
        g[0] || (g[0] = h("Workflow: ", -1)),
        n("strong", null, v(W.value || "unknown"), 1)
      ]),
      n("div", mt, [
        (t(), l(A, null, P(r, (p) => S(y(M), {
          key: p.key,
          disabled: R.value || B.value,
          "data-preset": p.key,
          onClick: (D) => u(p.key)
        }, {
          default: T(() => [
            h(v(p.label), 1)
          ]),
          _: 2
        }, 1032, ["disabled", "data-preset", "onClick"])), 64))
      ]),
      (t(), l(A, null, P(k, (p) => n("label", {
        key: p.key,
        class: "work-row",
        "data-control": p.key
      }, [
        n("span", ft, [
          n("span", _t, v(p.label), 1),
          n("span", ht, v(p.line), 1)
        ]),
        S(y(ee), {
          on: i[p.key],
          onChange: (D) => i[p.key] = !i[p.key]
        }, null, 8, ["on", "onChange"])
      ], 8, yt)), 64)),
      x.value ? (t(), l("p", bt, "With Auto off and no workers, nothing starts the work: a person starts tasks or turns one of them on.")) : b("", !0),
      B.value ? (t(), l("p", wt, "These settings changed since you opened them. Cancel to read them again.")) : b("", !0),
      w.value ? (t(), l("p", $t, v(w.value), 1)) : b("", !0),
      n("div", Ct, [
        S(y(M), {
          disabled: !N.value || R.value,
          "data-work-cancel": "",
          onClick: j
        }, {
          default: T(() => [...g[1] || (g[1] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        S(y(M), {
          disabled: !N.value || R.value || B.value,
          "data-work-apply": "",
          onClick: E
        }, {
          default: T(() => [...g[2] || (g[2] = [
            h("Apply", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ]));
  }
}, Tt = /* @__PURE__ */ V(jt, [["__scopeId", "data-v-73d2b468"]]), xt = {
  class: "settings",
  "data-agent-settings": ""
}, Mt = {
  __name: "AgentSettings",
  setup(m) {
    const k = [{ key: "work", label: "Work" }, { key: "agents", label: "Agents" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }], r = q(), _ = $("work");
    function s(i) {
      _.value = i, r.state.tab = i === "agents" ? "agents" : "";
    }
    return (i, d) => (t(), O(y(he), null, {
      default: T(() => [
        n("div", xt, [
          S(y(be), {
            options: k,
            value: _.value,
            onPick: s
          }, null, 8, ["value"]),
          _.value === "work" ? (t(), O(Tt, { key: 0 })) : _.value === "agents" ? (t(), O(pt, { key: 1 })) : _.value === "tests" ? (t(), O(gt, { key: 2 })) : (t(), O(Ie, { key: 3 }))
        ])
      ]),
      _: 1
    }));
  }
}, It = /* @__PURE__ */ V(Mt, [["__scopeId", "data-v-b066268a"]]);
export {
  It as A
};
