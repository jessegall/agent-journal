/* @code-commandments-generated */
import { openBlock as t, createElementBlock as d, createElementVNode as s, computed as b, normalizeClass as X, toDisplayString as k, renderSlot as ke, createTextVNode as w, createCommentVNode as x, createVNode as O, unref as m, withCtx as j, reactive as ie, ref as A, watch as ne, Fragment as S, renderList as U, createBlock as T, withModifiers as ye, useModel as fe, normalizeStyle as le, mergeModels as be, onMounted as he } from "vue";
import { useWindow as H, Btn as E, Switch as ee, TextInput as _e, useNow as $e, age as we, Icon as Ce, Segmented as re, WindowRoom as Ae } from "@journal/window-kit";
import { _ as F } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const ue = (o) => o.flatMap((g) => g.per_profile ? g.profiles.map((l) => ({ ...l, label: l.title, type: g.key, key: `${g.key}:${l.profile}` })) : [{ ...g, type: g.key }]), te = (o, g) => g > 0 && o >= g, Se = { class: "step" }, Oe = ["disabled"], xe = ["value", "disabled"], Te = ["disabled"], je = {
  __name: "NumberStep",
  props: { modelValue: { type: [Number, String], default: 0 }, disabled: { type: Boolean, default: !1 } },
  emits: ["update:modelValue"],
  setup(o, { emit: g }) {
    const l = o, y = g, n = (u) => y("update:modelValue", Math.max(0, (Number(l.modelValue) || 0) + u));
    return (u, a) => (t(), d("span", Se, [
      s("button", {
        type: "button",
        disabled: o.disabled || Number(o.modelValue) <= 0,
        "aria-label": "Less",
        onClick: a[0] || (a[0] = (v) => n(-1))
      }, "−", 8, Oe),
      s("input", {
        type: "number",
        min: "0",
        value: o.modelValue,
        disabled: o.disabled,
        onInput: a[1] || (a[1] = (v) => y("update:modelValue", v.target.value))
      }, null, 40, xe),
      s("button", {
        type: "button",
        disabled: o.disabled,
        "aria-label": "More",
        onClick: a[2] || (a[2] = (v) => n(1))
      }, "+", 8, Te)
    ]));
  }
}, Ne = /* @__PURE__ */ F(je, [["__scopeId", "data-v-e9d43b82"]]), Ie = { class: "ctl-text" }, Me = { class: "ctl-label" }, Ve = { class: "ctl-help" }, Be = { class: "ctl-input" }, Re = {
  key: 0,
  class: "ctl-src"
}, We = {
  __name: "SettingRow",
  props: { label: { type: String, required: !0 }, help: { type: String, default: "" }, source: { type: String, default: "" }, changed: { type: Boolean, default: !1 } },
  setup(o) {
    const g = o, l = H(), y = { environment: () => `This environment, ${l.environment}`, project: () => "Every environment", default: () => "Default" }, n = b(() => {
      var u;
      return g.changed ? "Changed, not applied" : ((u = y[g.source]) == null ? void 0 : u.call(y)) ?? "";
    });
    return (u, a) => (t(), d("div", {
      class: X(["ctl", { flat: !o.source }])
    }, [
      s("div", Ie, [
        s("span", Me, k(o.label), 1),
        s("span", Ve, k(o.help), 1)
      ]),
      s("div", Be, [
        ke(u.$slots, "default", {}, void 0, !0)
      ]),
      o.source ? (t(), d("div", Re, [
        s("span", {
          class: X(["src", { here: o.source === "environment", changed: o.changed }]),
          "data-setting-source": ""
        }, [
          a[0] || (a[0] = s("i", null, null, -1)),
          w(k(n.value), 1)
        ], 2)
      ])) : x("", !0)
    ], 2));
  }
}, Z = /* @__PURE__ */ F(We, [["__scopeId", "data-v-6e2d513b"]]), Ee = { class: "foot" }, Fe = {
  __name: "SettingsFoot",
  props: { changes: { type: Number, default: 0 }, pending: { type: Boolean, default: !1 }, problem: { type: String, default: "" }, blocked: { type: Boolean, default: !1 } },
  emits: ["cancel", "apply"],
  setup(o, { emit: g }) {
    const l = o, y = g, n = H(), u = b(() => l.problem ? l.problem : l.pending ? "Applying." : l.changes ? `${l.changes} ${l.changes === 1 ? "change" : "changes"} to apply to ${n.environment}.` : `No changes. For the environment ${n.environment}.`);
    return (a, v) => (t(), d("div", Ee, [
      s("span", {
        class: X(["foot-note", { bad: o.problem, busy: o.pending }]),
        role: "status"
      }, k(u.value), 3),
      O(m(E), {
        bordered: "",
        disabled: !o.changes || o.pending,
        "data-settings-cancel": "",
        onClick: v[0] || (v[0] = (M) => y("cancel"))
      }, {
        default: j(() => [...v[2] || (v[2] = [
          w("Cancel", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      O(m(E), {
        variant: "primary",
        disabled: !o.changes || o.pending || o.blocked || m(n).readOnly,
        "data-settings-apply": "",
        onClick: v[1] || (v[1] = (M) => y("apply"))
      }, {
        default: j(() => [...v[3] || (v[3] = [
          w("Apply", -1)
        ])]),
        _: 1
      }, 8, ["disabled"])
    ]));
  }
}, de = /* @__PURE__ */ F(Fe, [["__scopeId", "data-v-88c3dd59"]]), Pe = ["data-agent-settings-group"], Ue = { class: "sw-word" }, Ke = ["value", "disabled", "data-field", "onChange"], Le = ["value"], qe = ["data-field-badge"], De = {
  __name: "AgentSettingsGroup",
  props: { group: { type: String, required: !0 } },
  setup(o) {
    const g = o, l = H(), y = l.props.work, n = ie({}), u = A(""), a = A(""), v = A(!1), M = b(() => {
      var i;
      return (((i = y.data.value) == null ? void 0 : i.fields) ?? []).filter((C) => C.group === g.group);
    }), K = b(() => M.value.filter((i) => {
      var C, f;
      return (((f = (C = y.data.value) == null ? void 0 : C.depends) == null ? void 0 : f[i.key]) ?? []).every((q) => n[q] !== !1);
    })), L = (i) => i.type === "flag" ? !!i.value : String(i.value), P = (i) => (i.type === "flag" ? n[i.key] : String(n[i.key])) !== L(i), N = b(() => M.value.filter(P)), I = b(() => N.value.length > 0), V = b(() => {
      var i;
      return I.value && u.value && ((i = y.data.value) == null ? void 0 : i.revision) !== u.value;
    }), R = (i) => i.type === "flag" ? n[i.key] ? "on" : "off" : String(n[i.key]).trim(), W = b(() => N.value.some((i) => i.type !== "flag" && R(i) === ""));
    function B() {
      var i;
      for (const C of M.value) n[C.key] = L(C);
      u.value = ((i = y.data.value) == null ? void 0 : i.revision) ?? "", a.value = "";
    }
    ne(() => y.data.value, () => {
      (!u.value || !I.value) && B();
    }, { immediate: !0 });
    const z = b(() => a.value || (V.value ? "These settings changed since you opened them. Cancel to read them again." : "") || (W.value ? "A number is missing." : ""));
    async function D() {
      v.value = !0;
      const i = await l.run(`work-settings apply --revision ${u.value} ${N.value.map((C) => `${C.key}=${R(C)}`).join(" ")}`);
      v.value = !1, a.value = i.ok ? "" : i.error, await l.reload("work"), i.ok && B();
    }
    return (i, C) => (t(), d("section", {
      class: "group",
      "data-agent-settings-group": o.group
    }, [
      (t(!0), d(S, null, U(K.value, (f) => (t(), T(Z, {
        key: f.key,
        label: f.title,
        help: f.description,
        source: f.source,
        changed: P(f),
        "data-control": f.key
      }, {
        default: j(() => {
          var q;
          return [
            f.type === "flag" ? (t(), d(S, { key: 0 }, [
              O(m(ee), {
                on: n[f.key],
                disabled: m(l).readOnly,
                onChange: (p) => n[f.key] = !n[f.key]
              }, null, 8, ["on", "disabled", "onChange"]),
              s("span", Ue, k(n[f.key] ? "On" : "Off"), 1)
            ], 64)) : (q = f.choices) != null && q.length ? (t(), d("select", {
              key: 1,
              class: "choice",
              value: n[f.key],
              disabled: m(l).readOnly,
              "data-field": f.key,
              onChange: (p) => n[f.key] = p.target.value
            }, [
              (t(!0), d(S, null, U(f.choices, (p) => (t(), d("option", {
                key: p,
                value: String(p)
              }, k(p / 1e3) + "k", 9, Le))), 128))
            ], 40, Ke)) : (t(), T(Ne, {
              key: 2,
              modelValue: n[f.key],
              "onUpdate:modelValue": (p) => n[f.key] = p,
              disabled: m(l).readOnly,
              "data-field": f.key
            }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "data-field"])),
            f.badge ? (t(), d("span", {
              key: 3,
              class: "badge",
              "data-field-badge": f.key
            }, k(f.badge), 9, qe)) : x("", !0)
          ];
        }),
        _: 2
      }, 1032, ["label", "help", "source", "changed", "data-control"]))), 128)),
      O(de, {
        changes: N.value.length,
        pending: v.value,
        problem: z.value,
        blocked: V.value || W.value,
        onCancel: B,
        onApply: D
      }, null, 8, ["changes", "pending", "problem", "blocked"])
    ], 8, Pe));
  }
}, ce = /* @__PURE__ */ F(De, [["__scopeId", "data-v-561ba16e"]]), He = {
  __name: "AgentSettingsAdvanced",
  setup(o) {
    return (g, l) => (t(), T(ce, {
      group: "advanced",
      "data-agent-settings-advanced": ""
    }));
  }
}, ze = { class: "action-buttons" }, Ge = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(o) {
    return (g, l) => (t(), d("form", {
      "data-agent-retire-confirm": "",
      onSubmit: l[2] || (l[2] = ye((y) => g.$emit("submit"), ["prevent"]))
    }, [
      l[5] || (l[5] = s("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      O(m(_e), {
        "model-value": o.reason,
        label: "Reason",
        disabled: o.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": l[0] || (l[0] = (y) => g.$emit("update:reason", y))
      }, null, 8, ["model-value", "disabled"]),
      s("div", ze, [
        O(m(E), {
          type: "submit",
          small: "",
          disabled: o.pending || !o.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: j(() => [...l[3] || (l[3] = [
            w("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        O(m(E), {
          small: "",
          disabled: o.pending,
          onClick: l[1] || (l[1] = (y) => g.$emit("cancel"))
        }, {
          default: j(() => [...l[4] || (l[4] = [
            w("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ye = /* @__PURE__ */ F(Ge, [["__scopeId", "data-v-23a905c0"]]), Je = ["data-edit-type"], Qe = { key: 0 }, Xe = { class: "stepper" }, Ze = ["disabled", "onClick"], et = ["value", "disabled", "data-agent-limit-input", "onChange"], tt = ["disabled", "onClick"], nt = { key: 0 }, at = { key: 1 }, st = {
  __name: "AgentLimitEditor",
  props: { rows: { type: Array, required: !0 }, pending: Boolean, readOnly: Boolean, environment: { type: String, required: !0 } },
  emits: ["change"],
  setup(o, { emit: g }) {
    const l = g;
    return (y, n) => (t(), d(S, null, [
      n[0] || (n[0] = s("p", null, "How many agents of a type may run at once, and how many may be kept.", -1)),
      (t(!0), d(S, null, U(o.rows, (u) => (t(), d("div", {
        key: u.key,
        class: "edit-row",
        "data-edit-type": u.key
      }, [
        s("div", null, [
          s("strong", null, k(u.per_profile ? "Each helper type" : "Workers"), 1),
          u.per_profile ? (t(), d("small", Qe, "Researcher, Planner and the others")) : x("", !0)
        ]),
        (t(!0), d(S, null, U([{ name: "Most running", value: u.run_limit, key: u.run_setting, source: u.run_source, kind: "run" }, { name: "Most kept", value: u.kept_limit, key: u.kept_setting, source: u.kept_source, kind: "kept" }], (a) => (t(), d("label", {
          key: a.key
        }, [
          w(k(a.name), 1),
          s("span", Xe, [
            s("button", {
              type: "button",
              disabled: o.pending || o.readOnly || a.value === 0,
              onClick: (v) => l("change", u, a.key, a.value, a.value - 1)
            }, "−", 8, Ze),
            s("input", {
              type: "number",
              min: "0",
              value: a.value,
              disabled: o.pending || o.readOnly,
              "data-agent-limit-input": a.kind,
              onChange: (v) => l("change", u, a.key, a.value, v.target.value)
            }, null, 40, et),
            s("button", {
              type: "button",
              disabled: o.pending || o.readOnly,
              onClick: (v) => l("change", u, a.key, a.value, a.value + 1)
            }, "+", 8, tt)
          ]),
          a.value === 0 ? (t(), d("small", nt, k(a.kind === "run" ? "None can start" : "Any number"), 1)) : a.source === `environment ${o.environment}` ? (t(), d("small", at, "Changed for " + k(o.environment), 1)) : x("", !0)
        ]))), 128))
      ], 8, Je))), 128))
    ], 64));
  }
}, lt = /* @__PURE__ */ F(st, [["__scopeId", "data-v-218442c9"]]), ot = { class: "counts-panel" }, it = { class: "counts" }, rt = ["data-count-agent"], ut = { class: "person-text" }, dt = {
  key: 0,
  class: "helper-head"
}, ct = ["data-agent-limit-type", "data-agent-limit-profile", "onClick"], gt = {
  key: 0,
  class: "bar"
}, pt = {
  key: 5,
  role: "alert"
}, vt = {
  key: 6,
  role: "status"
}, mt = { class: "foot" }, kt = { class: "foot-note" }, yt = {
  __name: "AgentCountsPanel",
  props: {
    title: { default: "Agent counts" },
    titleModifiers: {}
  },
  emits: /* @__PURE__ */ be(["open-agent", "close"], ["update:title"]),
  setup(o, { emit: g }) {
    const l = g, y = fe(o, "title"), n = H(), u = b(() => n.props.limits.rows.value ?? []), a = b(() => n.props.limits.failure.value), v = A([]), M = A(0), K = A(!1), L = $e(), P = A(null), N = A(!1), I = A(!1), V = A(""), R = A(""), W = A(null), B = A(""), z = b(() => ue(u.value)), D = b(() => u.value.find((c) => c.per_profile)), i = b(() => z.value.find((c) => c.key === P.value)), C = b(() => v.value.filter((c) => {
      var e, r;
      return c.state !== "retired" && c.role === ((e = i.value) == null ? void 0 : e.type) && (!i.value.profile || (((r = c.facts) == null ? void 0 : r.profile) || c.profile) === i.value.profile);
    }).sort((c, e) => (c.state !== "running") - (e.state !== "running") || String(c.ended_at || c.created_at).localeCompare(String(e.ended_at || e.created_at)))), f = b(() => {
      var e;
      const c = /* @__PURE__ */ new Map();
      for (const r of C.value) {
        const h = ((e = r.facts) == null ? void 0 : e.model) || r.program_model;
        h && c.set(h, (c.get(h) || 0) + 1);
      }
      return [...c].map(([r, h]) => `${h} ${r}`).join(", ");
    }), q = (c, e) => e ? `${Math.min(c / Math.max(c, e) * 100, 100)}%` : "0%", p = (c, e) => e && c > e ? `${(c - e) / c * 100}%` : "0%";
    ne(() => {
      var c;
      return N.value ? "Change the maximums" : ((c = i.value) == null ? void 0 : c.label) || "Agent counts";
    }, (c) => {
      y.value = c;
    }, { immediate: !0 });
    async function $(c, e = 1) {
      n.state["count-agents.role"] = c.type, c.profile ? n.state["count-agents.profile"] = c.profile : delete n.state["count-agents.profile"], n.state["count-agents.page"] = String(e), await n.reload("count-agents");
      const r = n.props["count-agents"];
      v.value = e === 1 ? [...r.rows.value] : [...v.value, ...r.rows.value], M.value = e, K.value = r.more.value;
    }
    function _(c) {
      P.value = c.key, v.value = [], $(c);
    }
    function Y() {
      N.value = !1, P.value = null, W.value = null, V.value = "";
    }
    function ge() {
      Y(), l("close");
    }
    async function pe(c, e, r, h) {
      if (I.value || n.readOnly) return;
      const G = Number(h);
      if (!String(h).trim() || !Number.isInteger(G) || G < 0) {
        V.value = "Use a whole number of 0 or more.";
        return;
      }
      I.value = !0, V.value = "";
      const J = await n.run(["setting", "set", e, String(G), "--environment", n.environment]);
      J.ok ? (await n.reload("limits"), R.value = "Saved.") : V.value = J.error, I.value = !1;
    }
    async function ve(c) {
      if (!B.value.trim() || I.value) return;
      I.value = !0;
      const e = await n.run(["agent", "retire", String(c.id), "--reason", B.value.trim()]);
      V.value = e.ok ? "" : "The agent could not be retired. Try again.", e.ok && (W.value = null, B.value = "", R.value = "Agent retired permanently.", await n.reload("limits"), await $(i.value)), I.value = !1;
    }
    function me(c) {
      ge(), l("open-agent", c);
    }
    return (c, e) => (t(), d("div", ot, [
      s("div", it, [
        N.value || i.value ? (t(), d("button", {
          key: 0,
          class: "back",
          type: "button",
          onClick: Y
        }, "‹ Back to the counts")) : x("", !0),
        a.value ? (t(), d(S, { key: 1 }, [
          e[6] || (e[6] = s("strong", null, "The counts could not be read", -1)),
          e[7] || (e[7] = s("p", null, "The journal did not answer.", -1)),
          O(m(E), {
            small: "",
            onClick: e[0] || (e[0] = (r) => m(n).reload("limits"))
          }, {
            default: j(() => [...e[5] || (e[5] = [
              w("Try again", -1)
            ])]),
            _: 1
          })
        ], 64)) : N.value ? (t(), T(lt, {
          key: 2,
          rows: u.value,
          pending: I.value,
          "read-only": m(n).readOnly,
          environment: m(n).environment,
          onChange: pe
        }, null, 8, ["rows", "pending", "read-only", "environment"])) : i.value ? (t(), d(S, { key: 3 }, [
          s("p", null, [
            s("strong", null, k(i.value.running) + " of " + k(i.value.run_limit), 1),
            e[8] || (e[8] = w(" running, ", -1)),
            s("strong", null, [
              w(k(i.value.kept), 1),
              i.value.kept_limit ? (t(), d(S, { key: 0 }, [
                w(" of " + k(i.value.kept_limit), 1)
              ], 64)) : x("", !0)
            ]),
            e[9] || (e[9] = w(" kept", -1))
          ]),
          s("p", null, k(f.value), 1),
          C.value.length ? x("", !0) : (t(), d(S, { key: 0 }, [
            e[10] || (e[10] = s("strong", null, "No agents here yet", -1)),
            e[11] || (e[11] = s("p", null, "An agent shows here as soon as one of this type starts.", -1))
          ], 64)),
          (t(!0), d(S, null, U(C.value, (r) => {
            var h, G, J, ae, se;
            return t(), d("div", {
              key: r.id,
              class: "person",
              "data-count-agent": r.id
            }, [
              s("span", {
                class: X(["dot", { running: r.state === "running" }])
              }, null, 2),
              s("div", ut, [
                s("strong", null, k(((h = r.facts) == null ? void 0 : h.given_name) || r.id), 1),
                w(" " + k(r.state === "running" ? "Running" : "Idle") + ", " + k(m(we)(r.state === "running" ? r.process_started_at || r.created_at : r.ended_at, m(L))), 1),
                s("small", null, k([r.program, (G = r.facts) == null ? void 0 : G.model, (J = r.facts) == null ? void 0 : J.effort, `${r.role} ${r.id}`].filter(Boolean).join(", ")), 1),
                s("small", null, k(((ae = r.facts) == null ? void 0 : ae.task_title) || ((se = r.facts) == null ? void 0 : se.helper_job)), 1)
              ]),
              O(m(E), {
                small: "",
                onClick: (Q) => me(r)
              }, {
                default: j(() => [...e[12] || (e[12] = [
                  w("Open", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              r.state === "idle" && !m(n).readOnly ? (t(), T(m(E), {
                key: 0,
                small: "",
                onClick: (Q) => {
                  W.value = r.id, B.value = "";
                }
              }, {
                default: j(() => [...e[13] || (e[13] = [
                  w("Retire", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : x("", !0),
              W.value === r.id ? (t(), T(Ye, {
                key: 1,
                reason: B.value,
                "onUpdate:reason": e[1] || (e[1] = (Q) => B.value = Q),
                pending: I.value,
                onSubmit: (Q) => ve(r),
                onCancel: e[2] || (e[2] = (Q) => W.value = null)
              }, null, 8, ["reason", "pending", "onSubmit"])) : x("", !0)
            ], 8, rt);
          }), 128)),
          K.value ? (t(), T(m(E), {
            key: 1,
            small: "",
            onClick: e[3] || (e[3] = (r) => $(i.value, M.value + 1))
          }, {
            default: j(() => [...e[14] || (e[14] = [
              w("Show more", -1)
            ])]),
            _: 1
          })) : x("", !0)
        ], 64)) : (t(), d(S, { key: 4 }, [
          e[16] || (e[16] = s("div", { class: "columns" }, [
            s("span", null, "Name"),
            s("span", null, "Running"),
            s("span", null, "Kept"),
            s("span")
          ], -1)),
          D.value ? (t(), d("div", dt, [
            e[15] || (e[15] = s("strong", null, "Helpers", -1)),
            s("span", null, k(D.value.running) + " running, " + k(D.value.kept) + " kept", 1)
          ])) : x("", !0),
          (t(!0), d(S, null, U(z.value, (r) => (t(), d("button", {
            key: r.key,
            type: "button",
            class: "count-row",
            "data-agent-limit-type": r.type || r.key,
            "data-agent-limit-profile": r.profile,
            onClick: (h) => _(r)
          }, [
            s("strong", null, k(r.label), 1),
            (t(!0), d(S, null, U([{ count: r.running, limit: r.run_limit, unlimited: !1 }, { count: r.kept, limit: r.kept_limit, unlimited: !0 }], (h) => (t(), d("span", {
              key: h.unlimited,
              class: X({ full: m(te)(h.count, h.limit) })
            }, [
              s("span", null, [
                w(k(h.count), 1),
                h.limit || !h.unlimited ? (t(), d(S, { key: 0 }, [
                  w(" of " + k(h.limit), 1)
                ], 64)) : x("", !0)
              ]),
              h.limit ? (t(), d("span", gt, [
                s("span", {
                  style: le({ width: q(h.count, h.limit) })
                }, null, 4),
                s("i", {
                  style: le({ width: p(h.count, h.limit) })
                }, null, 4)
              ])) : x("", !0)
            ], 2))), 128)),
            O(m(Ce), {
              name: "chevronRight",
              size: 12
            })
          ], 8, ct))), 128))
        ], 64)),
        V.value ? (t(), d("p", pt, k(V.value), 1)) : R.value ? (t(), d("p", vt, k(R.value), 1)) : x("", !0)
      ]),
      s("div", mt, [
        N.value ? (t(), d(S, { key: 0 }, [
          s("span", kt, k(R.value || `Changes apply to ${m(n).environment}.`), 1),
          O(m(E), { onClick: Y }, {
            default: j(() => [...e[17] || (e[17] = [
              w("Done", -1)
            ])]),
            _: 1
          })
        ], 64)) : i.value ? x("", !0) : (t(), T(m(E), {
          key: 1,
          disabled: m(n).readOnly,
          "data-agent-limits-edit": "",
          onClick: e[4] || (e[4] = (r) => N.value = !0)
        }, {
          default: j(() => [...e[18] || (e[18] = [
            w("Change the maximums", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]))
      ])
    ]));
  }
}, ft = /* @__PURE__ */ F(yt, [["__scopeId", "data-v-6aa51086"]]), bt = {
  class: "agents",
  "data-agent-settings-agents": ""
}, ht = {
  __name: "AgentSettingsAgents",
  setup(o) {
    const g = H(), l = A("Agent counts"), y = (n) => g.open("agents.agents", n.id);
    return he(() => g.reload("limits")), (n, u) => (t(), d("section", bt, [
      O(ft, {
        title: l.value,
        "onUpdate:title": u[0] || (u[0] = (a) => l.value = a),
        onOpenAgent: y
      }, null, 8, ["title"])
    ]));
  }
}, _t = /* @__PURE__ */ F(ht, [["__scopeId", "data-v-3e01c727"]]), $t = {
  __name: "AgentSettingsTests",
  setup(o) {
    return (g, l) => (t(), T(ce, {
      group: "tests",
      "data-agent-settings-tests": ""
    }));
  }
}, wt = {
  class: "work",
  "data-agent-settings-work": ""
}, Ct = { class: "section" }, At = { class: "sw-word" }, St = { class: "section" }, Ot = { class: "sw-word" }, xt = {
  key: 0,
  class: "section-help warn",
  "data-work-hint": ""
}, oe = "journal.suites.coding.auto-mode", Tt = "journal.suites.coding.workers.main-dispatches-workers", jt = {
  __name: "AgentSettingsWork",
  setup(o) {
    const g = [
      { key: "journal.suites.coding.auto-mode", label: "Auto mode", line: "The journal hands the main agent its next task, and it keeps going while tasks are left" },
      { key: "journal.suites.coding.main-writes-code", label: "Main agent writes code", line: "The main agent may change project files itself; off, it plans, delegates and merges" },
      { key: "journal.suites.coding.workers.main-dispatches-workers", label: "Main agent sends workers", line: "Whether the main agent may send workers to do tasks." },
      { key: "journal.suites.coding.continue-while-delegatable", label: "Keep going while work can be delegated", line: "Keep the main agent working while open tasks can still be sent to workers." },
      { key: "journal.suites.coding.workers.merger-on", label: "Merger takes in workers", line: "A helper merges workers whose tests passed, and passes on what the main agent must judge." },
      { key: "journal.suites.coding.main-starts-helpers", label: "Use ordinary helpers", line: "Whether the main agent may start ordinary helpers." },
      { key: "journal.suites.coding.designer-enabled", label: "Use a designer", line: "Whether the main agent may start a designer, which writes a design document and changes no code." },
      { key: "journal.suites.coding.workers.main-agent-may-merge", label: "Main agent may merge workers", line: "Whether the main agent may merge the work of a worker itself." }
    ], l = [{ key: "builder", label: "Builder" }, { key: "orchestrator", label: "Orchestrator" }], y = [oe], n = H(), u = n.props.work, a = ie({}), v = A(""), M = A(""), K = A(!1), L = b(() => g.filter((p) => {
      var $, _;
      return a[p.key] !== ((_ = ($ = u.data.value) == null ? void 0 : $.controls) == null ? void 0 : _[p.key]);
    })), P = b(() => L.value.length > 0), N = b(() => P.value && u.data.value && v.value && u.data.value.revision !== v.value), I = b(() => {
      var p;
      return ((p = u.data.value) == null ? void 0 : p.workflow) ?? "";
    }), V = b(() => {
      var p;
      return ((p = u.data.value) == null ? void 0 : p.depends) ?? {};
    }), R = (p) => (V.value[p.key] ?? []).every(($) => a[$] !== !1), W = b(() => g.filter((p) => y.includes(p.key) && R(p))), B = b(() => g.filter((p) => !y.includes(p.key) && R(p))), z = b(() => M.value || (N.value ? "These settings changed since you opened them. Cancel to read them again." : "")), D = b(() => a[oe] === !1 && a[Tt] === !1);
    function i() {
      const p = u.data.value;
      if (p) {
        for (const $ of g) a[$.key] = p.controls[$.key];
        v.value = p.revision, M.value = "";
      }
    }
    ne(() => u.data.value, () => {
      (!v.value || !P.value) && i();
    }, { immediate: !0 });
    async function C(p) {
      K.value = !0;
      const $ = await n.run(p);
      K.value = !1, $.ok ? (await n.reload("work"), i()) : (M.value = $.error, await n.reload("work"));
    }
    const f = () => C(`work-settings apply --revision ${v.value} ${L.value.map((p) => `${p.key}=${a[p.key] ? "on" : "off"}`).join(" ")}`), q = (p) => C(`work-settings preset ${p} --revision ${v.value}`);
    return (p, $) => (t(), d("section", wt, [
      s("div", Ct, [
        $[0] || ($[0] = s("p", { class: "section-title" }, "Taking on work", -1)),
        O(Z, {
          label: "Workflow",
          help: "A preset sets the switches below at once; Custom is any other mix.",
          "data-work-flow": ""
        }, {
          default: j(() => [
            O(m(re), {
              options: l,
              value: I.value,
              onPick: q
            }, null, 8, ["value"])
          ]),
          _: 1
        }),
        (t(!0), d(S, null, U(W.value, (_) => (t(), T(Z, {
          key: _.key,
          label: _.label,
          help: _.line,
          "data-control": _.key
        }, {
          default: j(() => [
            O(m(ee), {
              on: a[_.key],
              disabled: m(n).readOnly,
              onChange: (Y) => a[_.key] = !a[_.key]
            }, null, 8, ["on", "disabled", "onChange"]),
            s("span", At, k(a[_.key] ? "On" : "Off"), 1)
          ]),
          _: 2
        }, 1032, ["label", "help", "data-control"]))), 128))
      ]),
      s("div", St, [
        $[1] || ($[1] = s("p", { class: "section-title" }, "How the main agent works", -1)),
        $[2] || ($[2] = s("p", { class: "section-help" }, "Your models, maximums and tests stay as you set them.", -1)),
        (t(!0), d(S, null, U(B.value, (_) => (t(), T(Z, {
          key: _.key,
          label: _.label,
          help: _.line,
          "data-control": _.key
        }, {
          default: j(() => [
            O(m(ee), {
              on: a[_.key],
              disabled: m(n).readOnly,
              onChange: (Y) => a[_.key] = !a[_.key]
            }, null, 8, ["on", "disabled", "onChange"]),
            s("span", Ot, k(a[_.key] ? "On" : "Off"), 1)
          ]),
          _: 2
        }, 1032, ["label", "help", "data-control"]))), 128)),
        D.value ? (t(), d("p", xt, "With Auto off and no workers, nothing starts the work: a person starts tasks or turns one of them on.")) : x("", !0)
      ]),
      O(de, {
        changes: L.value.length,
        pending: K.value,
        problem: z.value,
        blocked: N.value,
        onCancel: i,
        onApply: f
      }, null, 8, ["changes", "pending", "problem", "blocked"])
    ]));
  }
}, Nt = /* @__PURE__ */ F(jt, [["__scopeId", "data-v-c5fb9f6f"]]), It = {
  class: "settings",
  "data-agent-settings": ""
}, Mt = { class: "settings-bar" }, Vt = { class: "settings-body" }, Bt = {
  key: 0,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, Rt = {
  __name: "AgentSettings",
  setup(o) {
    const g = H(), l = A("work"), y = b(() => {
      var a;
      return ue(((a = g.props.limits) == null ? void 0 : a.rows.value) ?? []).filter((v) => te(v.running, v.run_limit) || te(v.kept, v.kept_limit)).length;
    }), n = b(() => [{ key: "work", label: "Work" }, { key: "agents", label: y.value ? `Agents ${y.value}` : "Agents" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }]);
    function u(a) {
      l.value = a, g.state.tab = a === "agents" ? "agents" : "";
    }
    return (a, v) => (t(), T(m(Ae), { padding: "0" }, {
      default: j(() => [
        s("div", It, [
          s("div", Mt, [
            O(m(re), {
              options: n.value,
              value: l.value,
              onPick: u
            }, null, 8, ["options", "value"])
          ]),
          s("div", Vt, [
            m(g).readOnly ? (t(), d("p", Bt, "Only a person can change these settings. You can read every value, and ask a person for a change.")) : x("", !0),
            l.value === "work" ? (t(), T(Nt, { key: 1 })) : l.value === "agents" ? (t(), T(_t, { key: 2 })) : l.value === "tests" ? (t(), T($t, { key: 3 })) : (t(), T(He, { key: 4 }))
          ])
        ])
      ]),
      _: 1
    }));
  }
}, Pt = /* @__PURE__ */ F(Rt, [["__scopeId", "data-v-f9bdd5f3"]]);
export {
  Pt as A
};
