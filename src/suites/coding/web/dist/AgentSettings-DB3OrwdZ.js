import { openBlock as n, createElementBlock as u, createElementVNode as l, computed as h, normalizeClass as Q, toDisplayString as k, renderSlot as me, createTextVNode as C, createCommentVNode as x, createVNode as w, unref as p, withCtx as S, reactive as ie, ref as O, watch as ee, Fragment as T, renderList as K, createBlock as B, withModifiers as ye, useModel as ke, normalizeStyle as se, mergeModels as be, onMounted as fe } from "vue";
import { useWindow as z, Btn as P, Switch as re, TextInput as he, useNow as $e, age as we, Icon as _e, Segmented as Ce, WindowRoom as Se, InnerTabs as Ae, TabBody as Oe, SwitchCase as Te } from "@journal/window-kit";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const xe = { class: "step" }, je = ["disabled"], Ne = ["value", "disabled"], Ie = ["disabled"], Be = {
  __name: "NumberStep",
  props: { modelValue: { type: [Number, String], default: 0 }, disabled: { type: Boolean, default: !1 } },
  emits: ["update:modelValue"],
  setup(t, { emit: g }) {
    const i = t, y = g, o = (s) => y("update:modelValue", Math.max(0, (Number(i.modelValue) || 0) + s));
    return (s, a) => (n(), u("span", xe, [
      l("button", {
        type: "button",
        disabled: t.disabled || Number(t.modelValue) <= 0,
        "aria-label": "Less",
        onClick: a[0] || (a[0] = (m) => o(-1))
      }, "−", 8, je),
      l("input", {
        type: "number",
        min: "0",
        value: t.modelValue,
        disabled: t.disabled,
        onInput: a[1] || (a[1] = (m) => y("update:modelValue", m.target.value))
      }, null, 40, Ne),
      l("button", {
        type: "button",
        disabled: t.disabled,
        "aria-label": "More",
        onClick: a[2] || (a[2] = (m) => o(1))
      }, "+", 8, Ie)
    ]));
  }
}, Re = /* @__PURE__ */ E(Be, [["__scopeId", "data-v-e9d43b82"]]), Me = { class: "ctl-text" }, Ve = { class: "ctl-label" }, We = { class: "ctl-help" }, Ee = { class: "ctl-input" }, Fe = {
  key: 0,
  class: "ctl-src"
}, Ue = {
  __name: "SettingRow",
  props: { label: { type: String, required: !0 }, help: { type: String, default: "" }, source: { type: String, default: "" }, changed: { type: Boolean, default: !1 } },
  setup(t) {
    const g = t, i = z(), y = { environment: () => `This environment, ${i.environment}`, project: () => "Every environment", default: () => "Default" }, o = h(() => {
      var s;
      return g.changed ? "Changed, not applied" : ((s = y[g.source]) == null ? void 0 : s.call(y)) ?? "";
    });
    return (s, a) => (n(), u("div", {
      class: Q(["ctl", { flat: !t.source }])
    }, [
      l("div", Me, [
        l("span", Ve, k(t.label), 1),
        l("span", We, k(t.help), 1)
      ]),
      l("div", Ee, [
        me(s.$slots, "default", {}, void 0, !0)
      ]),
      t.source ? (n(), u("div", Fe, [
        l("span", {
          class: Q(["src", { here: t.source === "environment", changed: t.changed }]),
          "data-setting-source": ""
        }, [
          a[0] || (a[0] = l("i", null, null, -1)),
          C(k(o.value), 1)
        ], 2)
      ])) : x("", !0)
    ], 2));
  }
}, te = /* @__PURE__ */ E(Ue, [["__scopeId", "data-v-6e2d513b"]]), Pe = { class: "foot" }, qe = {
  __name: "SettingsFoot",
  props: { changes: { type: Number, default: 0 }, pending: { type: Boolean, default: !1 }, problem: { type: String, default: "" }, blocked: { type: Boolean, default: !1 } },
  emits: ["cancel", "apply"],
  setup(t, { emit: g }) {
    const i = t, y = g, o = z(), s = h(() => i.problem ? i.problem : i.pending ? "Applying." : i.changes ? `${i.changes} ${i.changes === 1 ? "change" : "changes"} to apply to ${o.environment}.` : `No changes. For the environment ${o.environment}.`);
    return (a, m) => (n(), u("div", Pe, [
      l("span", {
        class: Q(["foot-note", { bad: t.problem, busy: t.pending }]),
        role: "status"
      }, k(s.value), 3),
      w(p(P), {
        bordered: "",
        disabled: !t.changes || t.pending,
        "data-settings-cancel": "",
        onClick: m[0] || (m[0] = (R) => y("cancel"))
      }, {
        default: S(() => [...m[2] || (m[2] = [
          C("Cancel", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      w(p(P), {
        variant: "primary",
        disabled: !t.changes || t.pending || t.blocked || p(o).readOnly,
        "data-settings-apply": "",
        onClick: m[1] || (m[1] = (R) => y("apply"))
      }, {
        default: S(() => [...m[3] || (m[3] = [
          C("Apply", -1)
        ])]),
        _: 1
      }, 8, ["disabled"])
    ]));
  }
}, ue = /* @__PURE__ */ E(qe, [["__scopeId", "data-v-88c3dd59"]]), Ke = ["data-agent-settings-group"], Le = { class: "sw-word" }, De = ["value", "disabled", "data-field", "onChange"], He = ["value"], ze = ["data-field-badge"], Ge = {
  __name: "AgentSettingsGroup",
  props: { group: { type: String, required: !0 } },
  setup(t) {
    const g = t, i = (c) => typeof c == "number" ? `${c / 1e3}k` : `${c.charAt(0).toUpperCase()}${c.slice(1)}`, y = z(), o = y.props.work, s = ie({}), a = O(""), m = O(""), R = O(!1), F = h(() => {
      var c;
      return (((c = o.data.value) == null ? void 0 : c.fields) ?? []).filter((N) => N.group === g.group);
    }), D = h(() => F.value.filter((c) => {
      var N, b;
      return (((b = (N = o.data.value) == null ? void 0 : N.depends) == null ? void 0 : b[c.key]) ?? []).every((v) => s[v] !== !1);
    })), q = (c) => c.type === "flag" ? !!c.value : String(c.value), I = (c) => (c.type === "flag" ? s[c.key] : String(s[c.key])) !== q(c), j = h(() => F.value.filter(I)), M = h(() => j.value.length > 0), V = h(() => {
      var c;
      return M.value && a.value && ((c = o.data.value) == null ? void 0 : c.revision) !== a.value;
    }), U = (c) => c.type === "flag" ? s[c.key] ? "on" : "off" : String(s[c.key]).trim(), W = h(() => j.value.some((c) => c.type !== "flag" && U(c) === ""));
    function L() {
      var c;
      for (const N of F.value) s[N.key] = q(N);
      a.value = ((c = o.data.value) == null ? void 0 : c.revision) ?? "", m.value = "";
    }
    ee(() => o.data.value, () => {
      (!a.value || !M.value) && L();
    }, { immediate: !0 });
    const H = h(() => m.value || (V.value ? "These settings changed since you opened them. Cancel to read them again." : "") || (W.value ? "A number is missing." : ""));
    async function _() {
      R.value = !0;
      const c = await y.run(`work-settings apply --revision ${a.value} ${j.value.map((N) => `${N.key}=${U(N)}`).join(" ")}`);
      R.value = !1, m.value = c.ok ? "" : c.error, await y.reload("work"), c.ok && L();
    }
    return (c, N) => (n(), u("section", {
      class: "group",
      "data-agent-settings-group": t.group
    }, [
      (n(!0), u(T, null, K(D.value, (b) => (n(), B(te, {
        key: b.key,
        label: b.title,
        help: b.description,
        source: b.source,
        changed: I(b),
        "data-control": b.key
      }, {
        default: S(() => {
          var v;
          return [
            b.type === "flag" ? (n(), u(T, { key: 0 }, [
              w(p(re), {
                on: s[b.key],
                disabled: p(y).readOnly,
                onChange: (f) => s[b.key] = !s[b.key]
              }, null, 8, ["on", "disabled", "onChange"]),
              l("span", Le, k(s[b.key] ? "On" : "Off"), 1)
            ], 64)) : (v = b.choices) != null && v.length ? (n(), u("select", {
              key: 1,
              class: "choice",
              value: s[b.key],
              disabled: p(y).readOnly,
              "data-field": b.key,
              onChange: (f) => s[b.key] = f.target.value
            }, [
              (n(!0), u(T, null, K(b.choices, (f) => (n(), u("option", {
                key: f,
                value: String(f)
              }, k(i(f)), 9, He))), 128))
            ], 40, De)) : (n(), B(Re, {
              key: 2,
              modelValue: s[b.key],
              "onUpdate:modelValue": (f) => s[b.key] = f,
              disabled: p(y).readOnly,
              "data-field": b.key
            }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "data-field"])),
            b.badge ? (n(), u("span", {
              key: 3,
              class: "badge",
              "data-field-badge": b.key
            }, k(b.badge), 9, ze)) : x("", !0)
          ];
        }),
        _: 2
      }, 1032, ["label", "help", "source", "changed", "data-control"]))), 128)),
      w(ue, {
        changes: j.value.length,
        pending: R.value,
        problem: H.value,
        blocked: V.value || W.value,
        onCancel: L,
        onApply: _
      }, null, 8, ["changes", "pending", "problem", "blocked"])
    ], 8, Ke));
  }
}, de = /* @__PURE__ */ E(Ge, [["__scopeId", "data-v-09d5a122"]]), Ye = {
  __name: "AgentSettingsAdvanced",
  setup(t) {
    return (g, i) => (n(), B(de, {
      group: "advanced",
      "data-agent-settings-advanced": ""
    }));
  }
}, Je = { class: "action-buttons" }, Qe = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(t) {
    return (g, i) => (n(), u("form", {
      "data-agent-retire-confirm": "",
      onSubmit: i[2] || (i[2] = ye((y) => g.$emit("submit"), ["prevent"]))
    }, [
      i[5] || (i[5] = l("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      w(p(he), {
        "model-value": t.reason,
        label: "Reason",
        disabled: t.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": i[0] || (i[0] = (y) => g.$emit("update:reason", y))
      }, null, 8, ["model-value", "disabled"]),
      l("div", Je, [
        w(p(P), {
          type: "submit",
          small: "",
          disabled: t.pending || !t.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: S(() => [...i[3] || (i[3] = [
            C("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        w(p(P), {
          small: "",
          disabled: t.pending,
          onClick: i[1] || (i[1] = (y) => g.$emit("cancel"))
        }, {
          default: S(() => [...i[4] || (i[4] = [
            C("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Xe = /* @__PURE__ */ E(Qe, [["__scopeId", "data-v-23a905c0"]]), Ze = ["data-edit-type"], et = { key: 0 }, tt = { class: "stepper" }, nt = ["disabled", "onClick"], at = ["value", "disabled", "data-agent-limit-input", "onChange"], st = ["disabled", "onClick"], lt = { key: 0 }, ot = { key: 1 }, it = {
  __name: "AgentLimitEditor",
  props: { rows: { type: Array, required: !0 }, pending: Boolean, readOnly: Boolean, environment: { type: String, required: !0 } },
  emits: ["change"],
  setup(t, { emit: g }) {
    const i = g;
    return (y, o) => (n(), u(T, null, [
      o[0] || (o[0] = l("p", null, "How many agents of a type may run at once, and how many may be kept.", -1)),
      (n(!0), u(T, null, K(t.rows, (s) => (n(), u("div", {
        key: s.key,
        class: "edit-row",
        "data-edit-type": s.key
      }, [
        l("div", null, [
          l("strong", null, k(s.per_profile ? "Each read-only helper type" : "Workers"), 1),
          s.per_profile ? (n(), u("small", et, "Researcher, Planner and the others")) : x("", !0)
        ]),
        (n(!0), u(T, null, K([{ name: "Most running", value: s.run_limit, key: s.run_setting, source: s.run_source, kind: "run" }, { name: "Most kept", value: s.kept_limit, key: s.kept_setting, source: s.kept_source, kind: "kept" }], (a) => (n(), u("label", {
          key: a.key
        }, [
          C(k(a.name), 1),
          l("span", tt, [
            l("button", {
              type: "button",
              disabled: t.pending || t.readOnly || a.value === 0,
              onClick: (m) => i("change", s, a.key, a.value, a.value - 1)
            }, "−", 8, nt),
            l("input", {
              type: "number",
              min: "0",
              value: a.value,
              disabled: t.pending || t.readOnly,
              "data-agent-limit-input": a.kind,
              onChange: (m) => i("change", s, a.key, a.value, m.target.value)
            }, null, 40, at),
            l("button", {
              type: "button",
              disabled: t.pending || t.readOnly,
              onClick: (m) => i("change", s, a.key, a.value, a.value + 1)
            }, "+", 8, st)
          ]),
          a.value === 0 ? (n(), u("small", lt, k(a.kind === "run" ? "None can start" : "Any number"), 1)) : a.source === `environment ${t.environment}` ? (n(), u("small", ot, "Changed for " + k(t.environment), 1)) : x("", !0)
        ]))), 128))
      ], 8, Ze))), 128))
    ], 64));
  }
}, rt = /* @__PURE__ */ E(it, [["__scopeId", "data-v-fc209014"]]), ut = (t) => t.flatMap((g) => g.per_profile ? g.profiles.map((i) => ({ ...i, label: i.title, type: g.key, key: `${g.key}:${i.profile}` })) : [{ ...g, type: g.key }]), dt = (t, g) => g > 0 && t >= g, ct = { class: "counts-panel" }, gt = ["data-count-agent"], vt = { class: "person-text" }, pt = {
  key: 0,
  class: "helper-head"
}, mt = ["data-agent-limit-type", "data-agent-limit-profile", "onClick"], yt = {
  key: 0,
  class: "bar"
}, kt = {
  key: 5,
  role: "alert"
}, bt = {
  key: 6,
  role: "status"
}, ft = { class: "foot" }, ht = { class: "foot-note" }, $t = {
  __name: "AgentCountsPanel",
  props: {
    title: { default: "Agent counts" },
    titleModifiers: {}
  },
  emits: /* @__PURE__ */ be(["open-agent", "close"], ["update:title"]),
  setup(t, { emit: g }) {
    const i = g, y = ke(t, "title"), o = z(), s = h(() => o.props.limits.rows.value ?? []), a = h(() => o.props.limits.failure.value), m = O([]), R = O(0), F = O(!1), D = $e(), q = O(null), I = O(!1), j = O(!1), M = O(""), V = O(""), U = O(null), W = O(""), L = h(() => ut(s.value)), H = h(() => s.value.find((d) => d.per_profile)), _ = h(() => L.value.find((d) => d.key === q.value)), c = h(() => m.value.filter((d) => {
      var e, r;
      return d.state !== "retired" && d.role === ((e = _.value) == null ? void 0 : e.type) && (!_.value.profile || (((r = d.facts) == null ? void 0 : r.profile) || d.profile) === _.value.profile);
    }).sort((d, e) => (d.state !== "running") - (e.state !== "running") || String(d.ended_at || d.created_at).localeCompare(String(e.ended_at || e.created_at)))), N = h(() => {
      var e;
      const d = /* @__PURE__ */ new Map();
      for (const r of c.value) {
        const $ = ((e = r.facts) == null ? void 0 : e.model) || r.program_model;
        $ && d.set($, (d.get($) || 0) + 1);
      }
      return [...d].map(([r, $]) => `${$} ${r}`).join(", ");
    }), b = (d, e) => e ? `${Math.min(d / Math.max(d, e) * 100, 100)}%` : "0%", v = (d, e) => e && d > e ? `${(d - e) / d * 100}%` : "0%", f = h(() => {
      var d;
      return I.value ? "edit" : ((d = _.value) == null ? void 0 : d.key) ?? "counts";
    });
    ee(() => {
      var d;
      return I.value ? "Edit" : ((d = _.value) == null ? void 0 : d.label) || "Agent counts";
    }, (d) => {
      y.value = d;
    }, { immediate: !0 });
    async function A(d, e = 1) {
      o.state["count-agents.role"] = d.type, d.profile ? o.state["count-agents.profile"] = d.profile : delete o.state["count-agents.profile"], o.state["count-agents.page"] = String(e), await o.reload("count-agents");
      const r = o.props["count-agents"];
      m.value = e === 1 ? [...r.rows.value] : [...m.value, ...r.rows.value], R.value = e, F.value = r.more.value;
    }
    function X(d) {
      q.value = d.key, m.value = [], A(d);
    }
    function Z() {
      I.value = !1, q.value = null, U.value = null, M.value = "";
    }
    function ce() {
      Z(), i("close");
    }
    async function ge(d, e, r, $) {
      if (j.value || o.readOnly) return;
      const G = Number($);
      if (!String($).trim() || !Number.isInteger(G) || G < 0) {
        M.value = "Use a whole number of 0 or more.";
        return;
      }
      j.value = !0, M.value = "";
      const Y = await o.run(["setting", "set", e, String(G), "--environment", o.environment]);
      Y.ok ? (await o.reload("limits"), V.value = "Saved.") : M.value = Y.error, j.value = !1;
    }
    async function ve(d) {
      if (!W.value.trim() || j.value) return;
      j.value = !0;
      const e = await o.run(["agent", "retire", String(d.id), "--reason", W.value.trim()]);
      M.value = e.ok ? "" : "The agent could not be retired. Try again.", e.ok && (U.value = null, W.value = "", V.value = "Agent retired permanently.", await o.reload("limits"), await A(_.value)), j.value = !1;
    }
    function pe(d) {
      ce(), i("open-agent", d);
    }
    return (d, e) => (n(), u("div", ct, [
      (n(), u("div", {
        key: f.value,
        class: "counts",
        "data-counts-screen": ""
      }, [
        I.value || _.value ? (n(), u("button", {
          key: 0,
          class: "back",
          type: "button",
          onClick: Z
        }, "‹ Back to the counts")) : x("", !0),
        a.value ? (n(), u(T, { key: 1 }, [
          e[6] || (e[6] = l("strong", null, "The counts could not be read", -1)),
          e[7] || (e[7] = l("p", null, "The journal did not answer.", -1)),
          w(p(P), {
            small: "",
            onClick: e[0] || (e[0] = (r) => p(o).reload("limits"))
          }, {
            default: S(() => [...e[5] || (e[5] = [
              C("Try again", -1)
            ])]),
            _: 1
          })
        ], 64)) : I.value ? (n(), B(rt, {
          key: 2,
          rows: s.value,
          pending: j.value,
          "read-only": p(o).readOnly,
          environment: p(o).environment,
          onChange: ge
        }, null, 8, ["rows", "pending", "read-only", "environment"])) : _.value ? (n(), u(T, { key: 3 }, [
          l("p", null, [
            l("strong", null, k(_.value.running) + " of " + k(_.value.run_limit), 1),
            e[8] || (e[8] = C(" running, ", -1)),
            l("strong", null, [
              C(k(_.value.kept), 1),
              _.value.kept_limit ? (n(), u(T, { key: 0 }, [
                C(" of " + k(_.value.kept_limit), 1)
              ], 64)) : x("", !0)
            ]),
            e[9] || (e[9] = C(" kept", -1))
          ]),
          l("p", null, k(N.value), 1),
          c.value.length ? x("", !0) : (n(), u(T, { key: 0 }, [
            e[10] || (e[10] = l("strong", null, "No agents here yet", -1)),
            e[11] || (e[11] = l("p", null, "An agent shows here as soon as one of this type starts.", -1))
          ], 64)),
          (n(!0), u(T, null, K(c.value, (r) => {
            var $, G, Y, ne, ae;
            return n(), u("div", {
              key: r.id,
              class: "person",
              "data-count-agent": r.id
            }, [
              l("span", {
                class: Q(["dot", { running: r.state === "running" }])
              }, null, 2),
              l("div", vt, [
                l("strong", null, k((($ = r.facts) == null ? void 0 : $.given_name) || r.id), 1),
                C(" " + k(r.state === "running" ? "Running" : "Idle") + ", " + k(p(we)(r.state === "running" ? r.process_started_at || r.created_at : r.ended_at, p(D))), 1),
                l("small", null, k([r.program, (G = r.facts) == null ? void 0 : G.model, (Y = r.facts) == null ? void 0 : Y.effort, `${r.role} ${r.id}`].filter(Boolean).join(", ")), 1),
                l("small", null, k(((ne = r.facts) == null ? void 0 : ne.task_title) || ((ae = r.facts) == null ? void 0 : ae.helper_job)), 1)
              ]),
              w(p(P), {
                small: "",
                onClick: (J) => pe(r)
              }, {
                default: S(() => [...e[12] || (e[12] = [
                  C("Open", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              r.state === "idle" && !p(o).readOnly ? (n(), B(p(P), {
                key: 0,
                small: "",
                onClick: (J) => {
                  U.value = r.id, W.value = "";
                }
              }, {
                default: S(() => [...e[13] || (e[13] = [
                  C("Retire", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : x("", !0),
              U.value === r.id ? (n(), B(Xe, {
                key: 1,
                reason: W.value,
                "onUpdate:reason": e[1] || (e[1] = (J) => W.value = J),
                pending: j.value,
                onSubmit: (J) => ve(r),
                onCancel: e[2] || (e[2] = (J) => U.value = null)
              }, null, 8, ["reason", "pending", "onSubmit"])) : x("", !0)
            ], 8, gt);
          }), 128)),
          F.value ? (n(), B(p(P), {
            key: 1,
            small: "",
            onClick: e[3] || (e[3] = (r) => A(_.value, R.value + 1))
          }, {
            default: S(() => [...e[14] || (e[14] = [
              C("Show more", -1)
            ])]),
            _: 1
          })) : x("", !0)
        ], 64)) : (n(), u(T, { key: 4 }, [
          e[16] || (e[16] = l("div", { class: "columns" }, [
            l("span", null, "Name"),
            l("span", null, "Running"),
            l("span", null, "Kept"),
            l("span")
          ], -1)),
          H.value ? (n(), u("div", pt, [
            e[15] || (e[15] = l("strong", null, "Read-only helpers", -1)),
            l("span", null, k(H.value.running) + " running, " + k(H.value.kept) + " kept", 1)
          ])) : x("", !0),
          (n(!0), u(T, null, K(L.value, (r) => (n(), u("button", {
            key: r.key,
            type: "button",
            class: "count-row",
            "data-agent-limit-type": r.type || r.key,
            "data-agent-limit-profile": r.profile,
            onClick: ($) => X(r)
          }, [
            l("strong", null, k(r.label), 1),
            (n(!0), u(T, null, K([{ count: r.running, limit: r.run_limit, unlimited: !1 }, { count: r.kept, limit: r.kept_limit, unlimited: !0 }], ($) => (n(), u("span", {
              key: $.unlimited,
              class: Q({ full: p(dt)($.count, $.limit) })
            }, [
              l("span", null, [
                C(k($.count), 1),
                $.limit || !$.unlimited ? (n(), u(T, { key: 0 }, [
                  C(" of " + k($.limit), 1)
                ], 64)) : x("", !0)
              ]),
              $.limit ? (n(), u("span", yt, [
                l("span", {
                  style: se({ width: b($.count, $.limit) })
                }, null, 4),
                l("i", {
                  style: se({ width: v($.count, $.limit) })
                }, null, 4)
              ])) : x("", !0)
            ], 2))), 128)),
            w(p(_e), {
              name: "chevronRight",
              size: 12
            })
          ], 8, mt))), 128))
        ], 64)),
        M.value ? (n(), u("p", kt, k(M.value), 1)) : V.value ? (n(), u("p", bt, k(V.value), 1)) : x("", !0)
      ])),
      l("div", ft, [
        I.value ? (n(), u(T, { key: 0 }, [
          l("span", ht, k(V.value || `Changes apply to ${p(o).environment}.`), 1),
          w(p(P), { onClick: Z }, {
            default: S(() => [...e[17] || (e[17] = [
              C("Done", -1)
            ])]),
            _: 1
          })
        ], 64)) : _.value ? x("", !0) : (n(), B(p(P), {
          key: 1,
          disabled: p(o).readOnly,
          "data-agent-limits-edit": "",
          onClick: e[4] || (e[4] = (r) => I.value = !0)
        }, {
          default: S(() => [...e[18] || (e[18] = [
            C("Edit", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]))
      ])
    ]));
  }
}, wt = /* @__PURE__ */ E($t, [["__scopeId", "data-v-093d9886"]]), _t = {
  class: "agents",
  "data-agent-settings-agents": ""
}, Ct = {
  __name: "AgentSettingsAgents",
  setup(t) {
    const g = z(), i = O("Agent counts"), y = (o) => g.open("agents.agents", o.id);
    return fe(() => g.reload("limits")), (o, s) => (n(), u("section", _t, [
      w(wt, {
        title: i.value,
        "onUpdate:title": s[0] || (s[0] = (a) => i.value = a),
        onOpenAgent: y
      }, null, 8, ["title"])
    ]));
  }
}, St = /* @__PURE__ */ E(Ct, [["__scopeId", "data-v-3e01c727"]]), At = {
  __name: "AgentSettingsTests",
  setup(t) {
    return (g, i) => (n(), B(de, {
      group: "tests",
      "data-agent-settings-tests": ""
    }));
  }
}, Ot = { class: "sw-word" }, Tt = {
  __name: "SettingSwitchRow",
  props: { control: { type: Object, required: !0 }, on: { type: Boolean, default: !1 }, disabled: { type: Boolean, default: !1 } },
  emits: ["change"],
  setup(t) {
    return (g, i) => (n(), B(te, {
      label: t.control.label,
      help: t.control.line,
      "data-control": t.control.key
    }, {
      default: S(() => [
        w(p(re), {
          on: t.on,
          disabled: t.disabled,
          onChange: i[0] || (i[0] = (y) => g.$emit("change"))
        }, null, 8, ["on", "disabled"]),
        l("span", Ot, k(t.on ? "On" : "Off"), 1)
      ]),
      _: 1
    }, 8, ["label", "help", "data-control"]));
  }
}, le = /* @__PURE__ */ E(Tt, [["__scopeId", "data-v-a43d15dd"]]), xt = {
  class: "work",
  "data-agent-settings-work": ""
}, jt = { class: "section" }, Nt = { class: "section" }, It = {
  key: 0,
  class: "section-help warn",
  "data-work-hint": ""
}, oe = "journal.suites.coding.auto-mode", Bt = "journal.suites.coding.workers.main-dispatches-workers", Rt = {
  __name: "AgentSettingsWork",
  setup(t) {
    const g = [
      { key: "journal.suites.coding.auto-mode", label: "Auto mode", line: "The journal hands the main agent its next task, and it keeps going while tasks are left" },
      { key: "journal.suites.coding.main-writes-code", label: "Main agent writes code", line: "The main agent may change project files itself; off, it plans, delegates and merges" },
      { key: "journal.suites.coding.workers.main-dispatches-workers", label: "Main agent sends workers", line: "Whether the main agent may send workers to do tasks." },
      { key: "journal.suites.coding.continue-while-delegatable", label: "Keep going while work can be delegated", line: "Keep the main agent working while open tasks can still be sent to workers." },
      { key: "journal.suites.coding.workers.merger-on", label: "Merger takes in workers", line: "A helper merges workers whose tests passed, and passes on what the main agent must judge." },
      { key: "journal.suites.coding.main-starts-read-only-helpers", label: "Use read-only helpers", line: "Whether the main agent may start read-only helpers." },
      { key: "journal.suites.coding.designer-enabled", label: "Use a designer", line: "Whether the main agent may start a designer, which writes a design document and changes no code." },
      { key: "journal.suites.coding.workers.main-agent-may-merge", label: "Main agent may merge workers", line: "Whether the main agent may merge the work of a worker itself." }
    ], i = [{ key: "builder", label: "Builder" }, { key: "orchestrator", label: "Orchestrator" }], y = [oe], o = z(), s = o.props.work, a = ie({}), m = O(""), R = O(""), F = O(!1), D = h(() => g.filter((v) => {
      var f, A;
      return a[v.key] !== ((A = (f = s.data.value) == null ? void 0 : f.controls) == null ? void 0 : A[v.key]);
    })), q = h(() => D.value.length > 0), I = h(() => q.value && s.data.value && m.value && s.data.value.revision !== m.value), j = h(() => {
      var v;
      return ((v = s.data.value) == null ? void 0 : v.workflow) ?? "";
    }), M = h(() => {
      var v;
      return ((v = s.data.value) == null ? void 0 : v.depends) ?? {};
    }), V = (v) => (M.value[v.key] ?? []).every((f) => a[f] !== !1), U = h(() => g.filter((v) => y.includes(v.key) && V(v))), W = h(() => g.filter((v) => !y.includes(v.key) && V(v))), L = h(() => R.value || (I.value ? "These settings changed since you opened them. Cancel to read them again." : "")), H = h(() => a[oe] === !1 && a[Bt] === !1);
    function _() {
      const v = s.data.value;
      if (v) {
        for (const f of g) a[f.key] = v.controls[f.key];
        m.value = v.revision, R.value = "";
      }
    }
    ee(() => s.data.value, () => {
      (!m.value || !q.value) && _();
    }, { immediate: !0 });
    async function c(v) {
      F.value = !0;
      const f = await o.run(v);
      F.value = !1, f.ok ? (await o.reload("work"), _()) : (R.value = f.error, await o.reload("work"));
    }
    const N = () => c(`work-settings apply --revision ${m.value} ${D.value.map((v) => `${v.key}=${a[v.key] ? "on" : "off"}`).join(" ")}`), b = (v) => c(`work-settings preset ${v} --revision ${m.value}`);
    return (v, f) => (n(), u("section", xt, [
      l("div", jt, [
        f[0] || (f[0] = l("p", { class: "section-title" }, "Taking on work", -1)),
        w(te, {
          label: "Workflow",
          help: "A preset sets the switches below at once; Custom is any other mix.",
          "data-work-flow": ""
        }, {
          default: S(() => [
            w(p(Ce), {
              options: i,
              value: j.value,
              onPick: b
            }, null, 8, ["value"])
          ]),
          _: 1
        }),
        (n(!0), u(T, null, K(U.value, (A) => (n(), B(le, {
          key: A.key,
          control: A,
          on: a[A.key],
          disabled: p(o).readOnly,
          onChange: (X) => a[A.key] = !a[A.key]
        }, null, 8, ["control", "on", "disabled", "onChange"]))), 128))
      ]),
      l("div", Nt, [
        f[1] || (f[1] = l("p", { class: "section-title" }, "How the main agent works", -1)),
        f[2] || (f[2] = l("p", { class: "section-help" }, "Your models, maximums and tests stay as you set them.", -1)),
        (n(!0), u(T, null, K(W.value, (A) => (n(), B(le, {
          key: A.key,
          control: A,
          on: a[A.key],
          disabled: p(o).readOnly,
          onChange: (X) => a[A.key] = !a[A.key]
        }, null, 8, ["control", "on", "disabled", "onChange"]))), 128)),
        H.value ? (n(), u("p", It, "With Auto off and no workers, nothing starts the work: a person starts tasks or turns one of them on.")) : x("", !0)
      ]),
      w(ue, {
        changes: D.value.length,
        pending: F.value,
        problem: L.value,
        blocked: I.value,
        onCancel: _,
        onApply: N
      }, null, 8, ["changes", "pending", "problem", "blocked"])
    ]));
  }
}, Mt = /* @__PURE__ */ E(Rt, [["__scopeId", "data-v-dfe4b9be"]]), Vt = {
  class: "settings",
  "data-agent-settings": ""
}, Wt = { class: "settings-bar" }, Et = { class: "settings-body" }, Ft = {
  key: 0,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, Ut = {
  __name: "AgentSettings",
  setup(t) {
    const g = z(), i = O("work"), y = [{ key: "work", label: "Work" }, { key: "agents", label: "Helpers" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }], o = h(() => y.find((a) => a.key === i.value));
    function s(a) {
      i.value = a.key, g.state.tab = a.key === "agents" ? "agents" : "";
    }
    return (a, m) => (n(), B(p(Se), { padding: "0" }, {
      default: S(() => [
        l("div", Vt, [
          l("div", Wt, [
            w(p(Ae), {
              tabs: y,
              active: o.value,
              onChoose: s
            }, null, 8, ["active"])
          ]),
          l("div", Et, [
            p(g).readOnly ? (n(), u("p", Ft, "Only a person can change these settings. You can read every value, and ask a person for a change.")) : x("", !0),
            w(p(Oe), { tab: o.value }, {
              default: S(() => [
                w(p(Te), { value: i.value }, {
                  work: S(() => [
                    w(Mt)
                  ]),
                  agents: S(() => [
                    w(St)
                  ]),
                  tests: S(() => [
                    w(At)
                  ]),
                  advanced: S(() => [
                    w(Ye)
                  ]),
                  _: 1
                }, 8, ["value"])
              ]),
              _: 1
            }, 8, ["tab"])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, Lt = /* @__PURE__ */ E(Ut, [["__scopeId", "data-v-2da31f3d"]]);
export {
  Lt as A
};
