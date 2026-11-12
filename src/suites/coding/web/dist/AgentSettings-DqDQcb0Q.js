import { openBlock as l, createElementBlock as c, createElementVNode as o, computed as w, normalizeClass as H, toDisplayString as h, renderSlot as me, createTextVNode as S, createCommentVNode as j, createVNode as _, unref as k, withCtx as O, reactive as oe, ref as A, watch as ee, Fragment as I, renderList as z, createBlock as M, withModifiers as ke, withDirectives as ye, vModelText as fe, useModel as be, normalizeStyle as ae, mergeModels as he, onMounted as we } from "vue";
import { useWindow as G, Btn as q, Switch as ie, TextInput as $e, useNow as _e, age as Ce, Icon as Se, Segmented as Ae, WindowRoom as xe, InnerTabs as Oe, TabBody as Te, SwitchCase as je } from "@journal/window-kit";
import { _ as R } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const Ie = { class: "step" }, Be = ["disabled"], Ne = ["value", "disabled"], Me = ["disabled"], Re = {
  __name: "NumberStep",
  props: { modelValue: { type: [Number, String], default: 0 }, disabled: { type: Boolean, default: !1 } },
  emits: ["update:modelValue"],
  setup(e, { emit: d }) {
    const s = e, m = d, n = (a) => m("update:modelValue", Math.max(0, (Number(s.modelValue) || 0) + a));
    return (a, u) => (l(), c("span", Ie, [
      o("button", {
        type: "button",
        disabled: e.disabled || Number(e.modelValue) <= 0,
        "aria-label": "Less",
        onClick: u[0] || (u[0] = (p) => n(-1))
      }, "−", 8, Be),
      o("input", {
        type: "number",
        min: "0",
        value: e.modelValue,
        disabled: e.disabled,
        onInput: u[1] || (u[1] = (p) => m("update:modelValue", p.target.value))
      }, null, 40, Ne),
      o("button", {
        type: "button",
        disabled: e.disabled,
        "aria-label": "More",
        onClick: u[2] || (u[2] = (p) => n(1))
      }, "+", 8, Me)
    ]));
  }
}, Ve = /* @__PURE__ */ R(Re, [["__scopeId", "data-v-e9d43b82"]]), We = { class: "ctl-text" }, Ue = { class: "ctl-label" }, Fe = { class: "ctl-help" }, Ee = { class: "ctl-input" }, Le = {
  key: 0,
  class: "ctl-src"
}, Pe = {
  __name: "SettingRow",
  props: { label: { type: String, required: !0 }, help: { type: String, default: "" }, source: { type: String, default: "" }, changed: { type: Boolean, default: !1 } },
  setup(e) {
    const d = e, s = G(), m = { environment: () => `This environment, ${s.environment}`, project: () => "Every environment", default: () => "Default" }, n = w(() => {
      var a;
      return d.changed ? "Changed, not applied" : ((a = m[d.source]) == null ? void 0 : a.call(m)) ?? "";
    });
    return (a, u) => (l(), c("div", {
      class: H(["ctl", { flat: !e.source }])
    }, [
      o("div", We, [
        o("span", Ue, h(e.label), 1),
        o("span", Fe, h(e.help), 1)
      ]),
      o("div", Ee, [
        me(a.$slots, "default", {}, void 0, !0)
      ]),
      e.source ? (l(), c("div", Le, [
        o("span", {
          class: H(["src", { here: e.source === "environment", changed: e.changed }]),
          "data-setting-source": ""
        }, [
          u[0] || (u[0] = o("i", null, null, -1)),
          S(h(n.value), 1)
        ], 2)
      ])) : j("", !0)
    ], 2));
  }
}, te = /* @__PURE__ */ R(Pe, [["__scopeId", "data-v-6e2d513b"]]), qe = { class: "foot" }, ze = {
  __name: "SettingsFoot",
  props: { changes: { type: Number, default: 0 }, pending: { type: Boolean, default: !1 }, problem: { type: String, default: "" }, blocked: { type: Boolean, default: !1 } },
  emits: ["cancel", "apply"],
  setup(e, { emit: d }) {
    const s = e, m = d, n = G(), a = w(() => s.problem ? s.problem : s.pending ? "Applying." : s.changes ? `${s.changes} ${s.changes === 1 ? "change" : "changes"} to apply to ${n.environment}.` : `No changes. For the environment ${n.environment}.`);
    return (u, p) => (l(), c("div", qe, [
      o("span", {
        class: H(["foot-note", { bad: e.problem, busy: e.pending }]),
        role: "status"
      }, h(a.value), 3),
      _(k(q), {
        bordered: "",
        disabled: !e.changes || e.pending,
        "data-settings-cancel": "",
        onClick: p[0] || (p[0] = (N) => m("cancel"))
      }, {
        default: O(() => [...p[2] || (p[2] = [
          S("Cancel", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      _(k(q), {
        variant: "primary",
        disabled: !e.changes || e.pending || e.blocked || k(n).readOnly,
        "data-settings-apply": "",
        onClick: p[1] || (p[1] = (N) => m("apply"))
      }, {
        default: O(() => [...p[3] || (p[3] = [
          S("Apply", -1)
        ])]),
        _: 1
      }, 8, ["disabled"])
    ]));
  }
}, re = /* @__PURE__ */ R(ze, [["__scopeId", "data-v-88c3dd59"]]), Ke = ["data-agent-settings-group"], De = { class: "sw-word" }, He = ["value", "disabled", "data-field", "onChange"], Ge = ["value"], Ye = ["data-field-badge"], Je = {
  __name: "AgentSettingsGroup",
  props: { group: { type: String, required: !0 } },
  setup(e) {
    const d = e, s = (g) => typeof g == "number" ? `${g / 1e3}k` : `${g.charAt(0).toUpperCase()}${g.slice(1)}`, m = G(), n = m.props.work, a = oe({}), u = A(""), p = A(""), N = A(!1), U = w(() => {
      var g;
      return (((g = n.data.value) == null ? void 0 : g.fields) ?? []).filter((B) => B.group === d.group);
    }), K = w(() => U.value.filter((g) => {
      var B, b;
      return (((b = (B = n.data.value) == null ? void 0 : B.depends) == null ? void 0 : b[g.key]) ?? []).every((v) => a[v] !== !1);
    })), F = (g) => g.type === "flag" ? !!g.value : String(g.value), C = (g) => (g.type === "flag" ? a[g.key] : String(a[g.key])) !== F(g), x = w(() => U.value.filter(C)), P = w(() => x.value.length > 0), V = w(() => {
      var g;
      return P.value && u.value && ((g = n.data.value) == null ? void 0 : g.revision) !== u.value;
    }), W = (g) => g.type === "flag" ? a[g.key] ? "on" : "off" : String(a[g.key]).trim(), D = w(() => x.value.some((g) => g.type !== "flag" && W(g) === ""));
    function E() {
      var g;
      for (const B of U.value) a[B.key] = F(B);
      u.value = ((g = n.data.value) == null ? void 0 : g.revision) ?? "", p.value = "";
    }
    ee(() => n.data.value, () => {
      (!u.value || !P.value) && E();
    }, { immediate: !0 });
    const $ = w(() => p.value || (V.value ? "These settings changed since you opened them. Cancel to read them again." : "") || (D.value ? "A number is missing." : ""));
    async function L() {
      N.value = !0;
      const g = await m.run(`work-settings apply --revision ${u.value} ${x.value.map((B) => `${B.key}=${W(B)}`).join(" ")}`);
      N.value = !1, p.value = g.ok ? "" : g.error, await m.reload("work"), g.ok && E();
    }
    return (g, B) => (l(), c("section", {
      class: "group",
      "data-agent-settings-group": e.group
    }, [
      (l(!0), c(I, null, z(K.value, (b) => (l(), M(te, {
        key: b.key,
        label: b.title,
        help: b.description,
        source: b.source,
        changed: C(b),
        "data-control": b.key
      }, {
        default: O(() => {
          var v;
          return [
            b.type === "flag" ? (l(), c(I, { key: 0 }, [
              _(k(ie), {
                on: a[b.key],
                disabled: k(m).readOnly,
                onChange: (y) => a[b.key] = !a[b.key]
              }, null, 8, ["on", "disabled", "onChange"]),
              o("span", De, h(a[b.key] ? "On" : "Off"), 1)
            ], 64)) : (v = b.choices) != null && v.length ? (l(), c("select", {
              key: 1,
              class: "choice",
              value: a[b.key],
              disabled: k(m).readOnly,
              "data-field": b.key,
              onChange: (y) => a[b.key] = y.target.value
            }, [
              (l(!0), c(I, null, z(b.choices, (y) => (l(), c("option", {
                key: y,
                value: String(y)
              }, h(s(y)), 9, Ge))), 128))
            ], 40, He)) : (l(), M(Ve, {
              key: 2,
              modelValue: a[b.key],
              "onUpdate:modelValue": (y) => a[b.key] = y,
              disabled: k(m).readOnly,
              "data-field": b.key
            }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "data-field"])),
            b.badge ? (l(), c("span", {
              key: 3,
              class: "badge",
              "data-field-badge": b.key
            }, h(b.badge), 9, Ye)) : j("", !0)
          ];
        }),
        _: 2
      }, 1032, ["label", "help", "source", "changed", "data-control"]))), 128)),
      _(re, {
        changes: x.value.length,
        pending: N.value,
        problem: $.value,
        blocked: V.value || D.value,
        onCancel: E,
        onApply: L
      }, null, 8, ["changes", "pending", "problem", "blocked"])
    ], 8, Ke));
  }
}, ue = /* @__PURE__ */ R(Je, [["__scopeId", "data-v-09d5a122"]]), Qe = {
  __name: "AgentSettingsAdvanced",
  setup(e) {
    return (d, s) => (l(), M(ue, {
      group: "advanced",
      "data-agent-settings-advanced": ""
    }));
  }
}, Xe = { class: "action-buttons" }, Ze = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (d, s) => (l(), c("form", {
      "data-agent-retire-confirm": "",
      onSubmit: s[2] || (s[2] = ke((m) => d.$emit("submit"), ["prevent"]))
    }, [
      s[5] || (s[5] = o("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      _(k($e), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": s[0] || (s[0] = (m) => d.$emit("update:reason", m))
      }, null, 8, ["model-value", "disabled"]),
      o("div", Xe, [
        _(k(q), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: O(() => [...s[3] || (s[3] = [
            S("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        _(k(q), {
          small: "",
          disabled: e.pending,
          onClick: s[1] || (s[1] = (m) => d.$emit("cancel"))
        }, {
          default: O(() => [...s[4] || (s[4] = [
            S("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, et = /* @__PURE__ */ R(Ze, [["__scopeId", "data-v-92de7dd6"]]), tt = ["data-edit-type"], nt = { class: "stepper" }, at = ["disabled", "onClick"], st = ["value", "disabled", "data-agent-limit-input", "onChange"], lt = ["disabled", "onClick"], ot = { key: 0 }, it = { key: 1 }, rt = {
  __name: "AgentLimitEditor",
  props: { row: { type: Object, required: !0 }, pending: Boolean, readOnly: Boolean, environment: { type: String, required: !0 } },
  emits: ["change"],
  setup(e, { emit: d }) {
    const s = d;
    return (m, n) => (l(), c(I, null, [
      n[0] || (n[0] = o("p", null, "How many may run at once, and how many may be kept.", -1)),
      o("div", {
        class: "edit-row",
        "data-edit-type": e.row.key
      }, [
        (l(!0), c(I, null, z([{ name: "Most running", value: e.row.run_limit, source: e.row.run_source, kind: "run" }, { name: "Most kept", value: e.row.kept_limit, source: e.row.kept_source, kind: "kept" }], (a) => (l(), c("label", {
          key: a.kind
        }, [
          S(h(a.name), 1),
          o("span", nt, [
            o("button", {
              type: "button",
              disabled: e.pending || e.readOnly || a.value === 0,
              onClick: (u) => s("change", a.kind, a.value - 1)
            }, "−", 8, at),
            o("input", {
              type: "number",
              min: "0",
              value: a.value,
              disabled: e.pending || e.readOnly,
              "data-agent-limit-input": a.kind,
              onChange: (u) => s("change", a.kind, u.target.value)
            }, null, 40, st),
            o("button", {
              type: "button",
              disabled: e.pending || e.readOnly,
              onClick: (u) => s("change", a.kind, a.value + 1)
            }, "+", 8, lt)
          ]),
          a.value === 0 ? (l(), c("small", ot, h(a.kind === "run" ? "None can start" : "Any number"), 1)) : a.source === `environment ${e.environment}` ? (l(), c("small", it, "Changed for " + h(e.environment), 1)) : j("", !0)
        ]))), 128))
      ], 8, tt)
    ], 64));
  }
}, ut = /* @__PURE__ */ R(rt, [["__scopeId", "data-v-b2420411"]]), dt = {
  class: "cap",
  "data-agent-context-cap": ""
}, ct = ["disabled"], gt = {
  __name: "AgentContextCap",
  props: { row: { type: Object, required: !0 }, pending: Boolean, readOnly: Boolean },
  emits: ["change"],
  setup(e, { emit: d }) {
    const s = e, m = d, n = A(s.row.context_cap || "");
    ee(() => s.row.context_cap, (u) => {
      n.value = u || "";
    });
    function a() {
      const u = n.value.trim().toLowerCase();
      u !== (s.row.context_cap || "") && m("change", u || "default");
    }
    return (u, p) => (l(), c("label", dt, [
      p[1] || (p[1] = S(" Compact at this context size ", -1)),
      ye(o("input", {
        type: "text",
        inputmode: "numeric",
        placeholder: "Same as its kind of agent",
        "onUpdate:modelValue": p[0] || (p[0] = (N) => n.value = N),
        disabled: e.pending || e.readOnly,
        "data-agent-context-cap-input": "",
        onChange: a
      }, null, 40, ct), [
        [fe, n.value]
      ]),
      p[2] || (p[2] = o("small", null, "A number of tokens, or none for no limit. Leave it empty to use the size set for its kind of agent.", -1))
    ]));
  }
}, pt = /* @__PURE__ */ R(gt, [["__scopeId", "data-v-78a096ea"]]), vt = (e) => e.flatMap((d) => d.per_profile ? d.profiles.map((s) => ({ ...s, label: s.title, type: d.key, key: `${d.key}:${s.profile}` })) : [{ ...d, type: d.key }]), mt = (e, d) => d > 0 && e >= d, kt = { class: "counts-panel" }, yt = ["data-count-agent"], ft = { class: "person-text" }, bt = {
  key: 0,
  class: "helper-head"
}, ht = ["data-agent-limit-type", "data-agent-limit-profile", "onClick"], wt = {
  key: 0,
  class: "bar"
}, $t = {
  key: 4,
  role: "alert"
}, _t = {
  key: 5,
  role: "status"
}, Ct = {
  __name: "AgentCountsPanel",
  props: {
    title: { default: "Agent counts" },
    titleModifiers: {}
  },
  emits: /* @__PURE__ */ he(["open-agent", "close"], ["update:title"]),
  setup(e, { emit: d }) {
    const s = d, m = be(e, "title"), n = G(), a = w(() => n.props.limits.rows.value ?? []), u = w(() => n.props.limits.failure.value), p = A([]), N = A(0), U = A(!1), K = _e(), F = A(null), C = A(!1), x = A(""), P = A(""), V = A(null), W = A(""), D = w(() => vt(a.value)), E = w(() => a.value.find((r) => r.per_profile)), $ = w(() => D.value.find((r) => r.key === F.value)), L = w(() => p.value.filter((r) => {
      var t, i;
      return r.state !== "retired" && r.role === ((t = $.value) == null ? void 0 : t.type) && (!$.value.profile || (((i = r.facts) == null ? void 0 : i.profile) || r.profile) === $.value.profile);
    }).sort((r, t) => (r.state !== "running") - (t.state !== "running") || String(r.ended_at || r.created_at).localeCompare(String(t.ended_at || t.created_at)))), g = w(() => {
      var t;
      const r = /* @__PURE__ */ new Map();
      for (const i of L.value) {
        const f = ((t = i.facts) == null ? void 0 : t.model) || i.program_model;
        f && r.set(f, (r.get(f) || 0) + 1);
      }
      return [...r].map(([i, f]) => `${f} ${i}`).join(", ");
    }), B = (r, t) => t ? `${Math.min(r / Math.max(r, t) * 100, 100)}%` : "0%", b = (r, t) => t && r > t ? `${(r - t) / r * 100}%` : "0%", v = w(() => {
      var r;
      return ((r = $.value) == null ? void 0 : r.key) ?? "counts";
    });
    ee(() => {
      var r;
      return ((r = $.value) == null ? void 0 : r.label) || "Agent counts";
    }, (r) => {
      m.value = r;
    }, { immediate: !0 });
    async function y(r, t = 1) {
      n.state["count-agents.role"] = r.type, r.profile ? n.state["count-agents.profile"] = r.profile : delete n.state["count-agents.profile"], n.state["count-agents.page"] = String(t), await n.reload("count-agents");
      const i = n.props["count-agents"];
      p.value = t === 1 ? [...i.rows.value] : [...p.value, ...i.rows.value], N.value = t, U.value = i.more.value;
    }
    function T(r) {
      F.value = r.key, p.value = [], y(r);
    }
    function Z() {
      F.value = null, V.value = null, x.value = "";
    }
    function de() {
      Z(), s("close");
    }
    async function ce(r, t) {
      if (C.value || n.readOnly) return;
      const i = Number(t);
      if (!String(t).trim() || !Number.isInteger(i) || i < 0) {
        x.value = "Use a whole number of 0 or more.";
        return;
      }
      C.value = !0, x.value = "";
      const f = $.value, Y = { run: f.run_limit, kept: f.kept_limit, [r]: i }, J = ["--environment", n.environment], Q = await n.run(f.profile ? ["agent", "profile-limits", f.type, f.profile, "--running", String(Y.run), "--kept", String(Y.kept), ...J] : ["setting", "set", r === "run" ? f.run_setting : f.kept_setting, String(i), ...J]);
      Q.ok ? await n.reload("limits") : x.value = Q.error, C.value = !1;
    }
    async function ge(r) {
      if (C.value || n.readOnly) return;
      if (r !== "default" && r !== "none" && !/^[0-9]+$/.test(r)) {
        x.value = "Use a whole number of tokens, or none.";
        return;
      }
      C.value = !0, x.value = "";
      const t = await n.run(["agent", "context-cap", $.value.profile, r, "--environment", n.environment]);
      t.ok ? await n.reload("limits") : x.value = t.error, C.value = !1;
    }
    async function pe(r) {
      if (!W.value.trim() || C.value) return;
      C.value = !0;
      const t = await n.run(["agent", "retire", String(r.number), "--reason", W.value.trim()]);
      x.value = t.ok ? "" : "The agent could not be retired. Try again.", t.ok && (V.value = null, W.value = "", P.value = "Agent retired permanently.", await n.reload("limits"), await y($.value)), C.value = !1;
    }
    function ve(r) {
      de(), s("open-agent", r);
    }
    return (r, t) => (l(), c("div", kt, [
      (l(), c("div", {
        key: v.value,
        class: H(["counts", { padded: u.value || $.value }]),
        "data-counts-screen": ""
      }, [
        $.value ? (l(), c("button", {
          key: 0,
          class: "back",
          type: "button",
          onClick: Z
        }, "‹ Back")) : j("", !0),
        u.value ? (l(), c(I, { key: 1 }, [
          t[5] || (t[5] = o("strong", null, "The counts could not be read", -1)),
          t[6] || (t[6] = o("p", null, "The journal did not answer.", -1)),
          _(k(q), {
            small: "",
            onClick: t[0] || (t[0] = (i) => k(n).reload("limits"))
          }, {
            default: O(() => [...t[4] || (t[4] = [
              S("Try again", -1)
            ])]),
            _: 1
          })
        ], 64)) : $.value ? (l(), c(I, { key: 2 }, [
          _(ut, {
            row: $.value,
            pending: C.value,
            "read-only": k(n).readOnly,
            environment: k(n).environment,
            onChange: ce
          }, null, 8, ["row", "pending", "read-only", "environment"]),
          $.value.profile ? (l(), M(pt, {
            key: 0,
            row: $.value,
            pending: C.value,
            "read-only": k(n).readOnly,
            onChange: ge
          }, null, 8, ["row", "pending", "read-only"])) : j("", !0),
          o("p", null, [
            o("strong", null, h($.value.running) + " of " + h($.value.run_limit), 1),
            t[7] || (t[7] = S(" running, ", -1)),
            o("strong", null, [
              S(h($.value.kept), 1),
              $.value.kept_limit ? (l(), c(I, { key: 0 }, [
                S(" of " + h($.value.kept_limit), 1)
              ], 64)) : j("", !0)
            ]),
            t[8] || (t[8] = S(" kept", -1))
          ]),
          o("p", null, h(g.value), 1),
          L.value.length ? j("", !0) : (l(), c(I, { key: 1 }, [
            t[9] || (t[9] = o("strong", null, "No agents here yet", -1)),
            t[10] || (t[10] = o("p", null, "An agent shows here as soon as one of this type starts.", -1))
          ], 64)),
          (l(!0), c(I, null, z(L.value, (i) => {
            var f, Y, J, Q, ne;
            return l(), c("div", {
              key: i.id,
              class: "person",
              "data-count-agent": i.id
            }, [
              o("span", {
                class: H(["dot", { running: i.state === "running" }])
              }, null, 2),
              o("div", ft, [
                o("strong", null, h(((f = i.facts) == null ? void 0 : f.given_name) || i.number), 1),
                S(" " + h(i.state === "running" ? "Running" : "Idle") + ", " + h(k(Ce)(i.state === "running" ? i.process_started_at || i.created_at : i.ended_at, k(K))), 1),
                o("small", null, h([i.program, (Y = i.facts) == null ? void 0 : Y.model, (J = i.facts) == null ? void 0 : J.effort, `${i.role} ${i.id}`].filter(Boolean).join(", ")), 1),
                o("small", null, h(((Q = i.facts) == null ? void 0 : Q.task_title) || ((ne = i.facts) == null ? void 0 : ne.helper_job)), 1)
              ]),
              _(k(q), {
                small: "",
                onClick: (X) => ve(i)
              }, {
                default: O(() => [...t[11] || (t[11] = [
                  S("Open", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              i.state === "idle" && !k(n).readOnly ? (l(), M(k(q), {
                key: 0,
                small: "",
                onClick: (X) => {
                  V.value = i.id, W.value = "";
                }
              }, {
                default: O(() => [...t[12] || (t[12] = [
                  S("Retire", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : j("", !0),
              V.value === i.id ? (l(), M(et, {
                key: 1,
                reason: W.value,
                "onUpdate:reason": t[1] || (t[1] = (X) => W.value = X),
                pending: C.value,
                onSubmit: (X) => pe(i),
                onCancel: t[2] || (t[2] = (X) => V.value = null)
              }, null, 8, ["reason", "pending", "onSubmit"])) : j("", !0)
            ], 8, yt);
          }), 128)),
          U.value ? (l(), M(k(q), {
            key: 2,
            small: "",
            onClick: t[3] || (t[3] = (i) => y($.value, N.value + 1))
          }, {
            default: O(() => [...t[13] || (t[13] = [
              S("Show more", -1)
            ])]),
            _: 1
          })) : j("", !0)
        ], 64)) : (l(), c(I, { key: 3 }, [
          t[15] || (t[15] = o("div", { class: "columns" }, [
            o("span", null, "Name"),
            o("span", null, "Running"),
            o("span", null, "Kept"),
            o("span")
          ], -1)),
          E.value ? (l(), c("div", bt, [
            t[14] || (t[14] = o("strong", null, "Read-only helpers", -1)),
            o("span", null, h(E.value.running) + " running, " + h(E.value.kept) + " kept", 1)
          ])) : j("", !0),
          (l(!0), c(I, null, z(D.value, (i) => (l(), c("button", {
            key: i.key,
            type: "button",
            class: "count-row",
            "data-agent-limit-type": i.type || i.key,
            "data-agent-limit-profile": i.profile,
            onClick: (f) => T(i)
          }, [
            o("strong", null, h(i.label), 1),
            (l(!0), c(I, null, z([{ count: i.running, limit: i.run_limit, unlimited: !1 }, { count: i.kept, limit: i.kept_limit, unlimited: !0 }], (f) => (l(), c("span", {
              key: f.unlimited,
              class: H({ full: k(mt)(f.count, f.limit) })
            }, [
              o("span", null, [
                S(h(f.count), 1),
                f.limit || !f.unlimited ? (l(), c(I, { key: 0 }, [
                  S(" of " + h(f.limit), 1)
                ], 64)) : j("", !0)
              ]),
              f.limit ? (l(), c("span", wt, [
                o("span", {
                  style: ae({ width: B(f.count, f.limit) })
                }, null, 4),
                o("i", {
                  style: ae({ width: b(f.count, f.limit) })
                }, null, 4)
              ])) : j("", !0)
            ], 2))), 128)),
            _(k(Se), {
              name: "chevronRight",
              size: 12
            })
          ], 8, ht))), 128))
        ], 64)),
        x.value ? (l(), c("p", $t, h(x.value), 1)) : P.value ? (l(), c("p", _t, h(P.value), 1)) : j("", !0)
      ], 2))
    ]));
  }
}, St = /* @__PURE__ */ R(Ct, [["__scopeId", "data-v-9210d86a"]]), At = {
  class: "agents",
  "data-agent-settings-agents": ""
}, xt = {
  __name: "AgentSettingsAgents",
  setup(e) {
    const d = G(), s = A("Agent counts"), m = (n) => d.open("agents.agents", n.id);
    return we(() => d.reload("limits")), (n, a) => (l(), c("section", At, [
      _(St, {
        title: s.value,
        "onUpdate:title": a[0] || (a[0] = (u) => s.value = u),
        onOpenAgent: m
      }, null, 8, ["title"])
    ]));
  }
}, Ot = /* @__PURE__ */ R(xt, [["__scopeId", "data-v-fde7fc3f"]]), Tt = {
  __name: "AgentSettingsTests",
  setup(e) {
    return (d, s) => (l(), M(ue, {
      group: "tests",
      "data-agent-settings-tests": ""
    }));
  }
}, jt = { class: "sw-word" }, It = {
  __name: "SettingSwitchRow",
  props: { control: { type: Object, required: !0 }, on: { type: Boolean, default: !1 }, disabled: { type: Boolean, default: !1 } },
  emits: ["change"],
  setup(e) {
    return (d, s) => (l(), M(te, {
      label: e.control.label,
      help: e.control.line,
      "data-control": e.control.key
    }, {
      default: O(() => [
        _(k(ie), {
          on: e.on,
          disabled: e.disabled,
          onChange: s[0] || (s[0] = (m) => d.$emit("change"))
        }, null, 8, ["on", "disabled"]),
        o("span", jt, h(e.on ? "On" : "Off"), 1)
      ]),
      _: 1
    }, 8, ["label", "help", "data-control"]));
  }
}, se = /* @__PURE__ */ R(It, [["__scopeId", "data-v-a43d15dd"]]), Bt = {
  class: "work",
  "data-agent-settings-work": ""
}, Nt = { class: "section" }, Mt = { class: "section" }, Rt = {
  key: 0,
  class: "section-help warn",
  "data-work-hint": ""
}, le = "journal.suites.coding.auto-mode", Vt = "journal.suites.coding.workers.main-dispatches-workers", Wt = {
  __name: "AgentSettingsWork",
  setup(e) {
    const d = [
      { key: "journal.suites.coding.auto-mode", label: "Auto mode", line: "The journal hands the main agent its next task, and it keeps going while tasks are left" },
      { key: "journal.suites.coding.main-writes-code", label: "Main agent writes code", line: "The main agent may change project files itself; off, it plans, delegates and merges" },
      { key: "journal.suites.coding.workers.main-dispatches-workers", label: "Main agent sends workers", line: "Whether the main agent may send workers to do tasks." },
      { key: "journal.suites.coding.continue-while-delegatable", label: "Keep going while work can be delegated", line: "Keep the main agent working while open tasks can still be sent to workers." },
      { key: "journal.suites.coding.workers.merger-on", label: "Merger takes in workers", line: "A helper merges workers whose tests passed, and passes on what the main agent must judge." },
      { key: "journal.suites.coding.main-starts-read-only-helpers", label: "Use read-only helpers", line: "Whether the main agent may start read-only helpers." },
      { key: "journal.suites.coding.designer-enabled", label: "Use a designer", line: "Whether the main agent may start a designer, which writes a design document and changes no code." },
      { key: "journal.suites.coding.workers.main-agent-may-merge", label: "Main agent may merge workers", line: "Whether the main agent may merge the work of a worker itself." }
    ], s = [{ key: "builder", label: "Builder" }, { key: "orchestrator", label: "Orchestrator" }], m = [le], n = G(), a = n.props.work, u = oe({}), p = A(""), N = A(""), U = A(!1), K = w(() => d.filter((v) => {
      var y, T;
      return u[v.key] !== ((T = (y = a.data.value) == null ? void 0 : y.controls) == null ? void 0 : T[v.key]);
    })), F = w(() => K.value.length > 0), C = w(() => F.value && a.data.value && p.value && a.data.value.revision !== p.value), x = w(() => {
      var v;
      return ((v = a.data.value) == null ? void 0 : v.workflow) ?? "";
    }), P = w(() => {
      var v;
      return ((v = a.data.value) == null ? void 0 : v.depends) ?? {};
    }), V = (v) => (P.value[v.key] ?? []).every((y) => u[y] !== !1), W = w(() => d.filter((v) => m.includes(v.key) && V(v))), D = w(() => d.filter((v) => !m.includes(v.key) && V(v))), E = w(() => N.value || (C.value ? "These settings changed since you opened them. Cancel to read them again." : "")), $ = w(() => u[le] === !1 && u[Vt] === !1);
    function L() {
      const v = a.data.value;
      if (v) {
        for (const y of d) u[y.key] = v.controls[y.key];
        p.value = v.revision, N.value = "";
      }
    }
    ee(() => a.data.value, () => {
      (!p.value || !F.value) && L();
    }, { immediate: !0 });
    async function g(v) {
      U.value = !0;
      const y = await n.run(v);
      U.value = !1, y.ok ? (await n.reload("work"), L()) : (N.value = y.error, await n.reload("work"));
    }
    const B = () => g(`work-settings apply --revision ${p.value} ${K.value.map((v) => `${v.key}=${u[v.key] ? "on" : "off"}`).join(" ")}`), b = (v) => g(`work-settings preset ${v} --revision ${p.value}`);
    return (v, y) => (l(), c("section", Bt, [
      o("div", Nt, [
        y[0] || (y[0] = o("p", { class: "section-title" }, "Taking on work", -1)),
        _(te, {
          label: "Workflow",
          help: "A preset sets the switches below at once; Custom is any other mix.",
          "data-work-flow": ""
        }, {
          default: O(() => [
            _(k(Ae), {
              options: s,
              value: x.value,
              onPick: b
            }, null, 8, ["value"])
          ]),
          _: 1
        }),
        (l(!0), c(I, null, z(W.value, (T) => (l(), M(se, {
          key: T.key,
          control: T,
          on: u[T.key],
          disabled: k(n).readOnly,
          onChange: (Z) => u[T.key] = !u[T.key]
        }, null, 8, ["control", "on", "disabled", "onChange"]))), 128))
      ]),
      o("div", Mt, [
        y[1] || (y[1] = o("p", { class: "section-title" }, "How the main agent works", -1)),
        y[2] || (y[2] = o("p", { class: "section-help" }, "Your models, maximums and tests stay as you set them.", -1)),
        (l(!0), c(I, null, z(D.value, (T) => (l(), M(se, {
          key: T.key,
          control: T,
          on: u[T.key],
          disabled: k(n).readOnly,
          onChange: (Z) => u[T.key] = !u[T.key]
        }, null, 8, ["control", "on", "disabled", "onChange"]))), 128)),
        $.value ? (l(), c("p", Rt, "With Auto off and no workers, nothing starts the work: a person starts tasks or turns one of them on.")) : j("", !0)
      ]),
      _(re, {
        changes: K.value.length,
        pending: U.value,
        problem: E.value,
        blocked: C.value,
        onCancel: L,
        onApply: B
      }, null, 8, ["changes", "pending", "problem", "blocked"])
    ]));
  }
}, Ut = /* @__PURE__ */ R(Wt, [["__scopeId", "data-v-dfe4b9be"]]), Ft = {
  class: "settings",
  "data-agent-settings": ""
}, Et = { class: "settings-bar" }, Lt = {
  key: 0,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, Pt = {
  __name: "AgentSettings",
  setup(e) {
    const d = G(), s = A("work"), m = [{ key: "work", label: "Work" }, { key: "agents", label: "Helpers" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }], n = w(() => m.find((u) => u.key === s.value));
    function a(u) {
      s.value = u.key, d.state.tab = u.key === "agents" ? "agents" : "";
    }
    return (u, p) => (l(), M(k(xe), { padding: "0" }, {
      default: O(() => [
        o("div", Ft, [
          o("div", Et, [
            _(k(Oe), {
              tabs: m,
              active: n.value,
              onChoose: a
            }, null, 8, ["active"])
          ]),
          o("div", {
            class: H(["settings-body", { flush: s.value === "agents" }])
          }, [
            k(d).readOnly ? (l(), c("p", Lt, "Only a person can change these settings. You can read every value, and ask a person for a change.")) : j("", !0),
            _(k(Te), { tab: n.value }, {
              default: O(() => [
                _(k(je), { value: s.value }, {
                  work: O(() => [
                    _(Ut)
                  ]),
                  agents: O(() => [
                    _(Ot)
                  ]),
                  tests: O(() => [
                    _(Tt)
                  ]),
                  advanced: O(() => [
                    _(Qe)
                  ]),
                  _: 1
                }, 8, ["value"])
              ]),
              _: 1
            }, 8, ["tab"])
          ], 2)
        ])
      ]),
      _: 1
    }));
  }
}, Dt = /* @__PURE__ */ R(Pt, [["__scopeId", "data-v-643e3fba"]]);
export {
  Dt as A
};
