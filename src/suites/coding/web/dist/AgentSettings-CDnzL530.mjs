/* @code-commandments-generated */
import { openBlock as n, createElementBlock as u, createElementVNode as t, computed as h, normalizeClass as X, toDisplayString as y, renderSlot as me, createTextVNode as S, createCommentVNode as j, createVNode as $, unref as v, withCtx as A, reactive as ie, ref as T, watch as ne, Fragment as x, renderList as L, createBlock as R, withModifiers as ke, useModel as ye, normalizeStyle as le, mergeModels as fe, onMounted as be } from "vue";
import { useWindow as G, Btn as U, Switch as ee, TextInput as he, useNow as _e, age as $e, Icon as we, Segmented as Ce, WindowRoom as Ae, InnerTabs as Se, TabBody as Oe, SwitchCase as Te } from "@journal/window-kit";
import { _ as P } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const re = (l) => l.flatMap((p) => p.per_profile ? p.profiles.map((r) => ({ ...r, label: r.title, type: p.key, key: `${p.key}:${r.profile}` })) : [{ ...p, type: p.key }]), te = (l, p) => p > 0 && l >= p, xe = { class: "step" }, je = ["disabled"], Ne = ["value", "disabled"], Ie = ["disabled"], Me = {
  __name: "NumberStep",
  props: { modelValue: { type: [Number, String], default: 0 }, disabled: { type: Boolean, default: !1 } },
  emits: ["update:modelValue"],
  setup(l, { emit: p }) {
    const r = l, k = p, o = (a) => k("update:modelValue", Math.max(0, (Number(r.modelValue) || 0) + a));
    return (a, s) => (n(), u("span", xe, [
      t("button", {
        type: "button",
        disabled: l.disabled || Number(l.modelValue) <= 0,
        "aria-label": "Less",
        onClick: s[0] || (s[0] = (c) => o(-1))
      }, "−", 8, je),
      t("input", {
        type: "number",
        min: "0",
        value: l.modelValue,
        disabled: l.disabled,
        onInput: s[1] || (s[1] = (c) => k("update:modelValue", c.target.value))
      }, null, 40, Ne),
      t("button", {
        type: "button",
        disabled: l.disabled,
        "aria-label": "More",
        onClick: s[2] || (s[2] = (c) => o(1))
      }, "+", 8, Ie)
    ]));
  }
}, Be = /* @__PURE__ */ P(Me, [["__scopeId", "data-v-a7b54780"]]), Re = { class: "ctl-text" }, Ve = { class: "ctl-label" }, We = { class: "ctl-help" }, Ee = { class: "ctl-input" }, Fe = {
  key: 0,
  class: "ctl-src"
}, Ue = {
  __name: "SettingRow",
  props: { label: { type: String, required: !0 }, help: { type: String, default: "" }, source: { type: String, default: "" }, changed: { type: Boolean, default: !1 } },
  setup(l) {
    const p = l, r = G(), k = { environment: () => `This environment, ${r.environment}`, project: () => "Every environment", default: () => "Default" }, o = h(() => {
      var a;
      return p.changed ? "Changed, not applied" : ((a = k[p.source]) == null ? void 0 : a.call(k)) ?? "";
    });
    return (a, s) => (n(), u("div", {
      class: X(["ctl", { flat: !l.source }])
    }, [
      t("div", Re, [
        t("span", Ve, y(l.label), 1),
        t("span", We, y(l.help), 1)
      ]),
      t("div", Ee, [
        me(a.$slots, "default", {}, void 0, !0)
      ]),
      l.source ? (n(), u("div", Fe, [
        t("span", {
          class: X(["src", { here: l.source === "environment", changed: l.changed }]),
          "data-setting-source": ""
        }, [
          s[0] || (s[0] = t("i", null, null, -1)),
          S(y(o.value), 1)
        ], 2)
      ])) : j("", !0)
    ], 2));
  }
}, Z = /* @__PURE__ */ P(Ue, [["__scopeId", "data-v-c011fa59"]]), Pe = { class: "foot" }, Ke = {
  __name: "SettingsFoot",
  props: { changes: { type: Number, default: 0 }, pending: { type: Boolean, default: !1 }, problem: { type: String, default: "" }, blocked: { type: Boolean, default: !1 } },
  emits: ["cancel", "apply"],
  setup(l, { emit: p }) {
    const r = l, k = p, o = G(), a = h(() => r.problem ? r.problem : r.pending ? "Applying." : r.changes ? `${r.changes} ${r.changes === 1 ? "change" : "changes"} to apply to ${o.environment}.` : `No changes. For the environment ${o.environment}.`);
    return (s, c) => (n(), u("div", Pe, [
      t("span", {
        class: X(["foot-note", { bad: l.problem, busy: l.pending }]),
        role: "status"
      }, y(a.value), 3),
      $(v(U), {
        bordered: "",
        disabled: !l.changes || l.pending,
        "data-settings-cancel": "",
        onClick: c[0] || (c[0] = (O) => k("cancel"))
      }, {
        default: A(() => [...c[2] || (c[2] = [
          S("Cancel", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      $(v(U), {
        variant: "primary",
        disabled: !l.changes || l.pending || l.blocked || v(o).readOnly,
        "data-settings-apply": "",
        onClick: c[1] || (c[1] = (O) => k("apply"))
      }, {
        default: A(() => [...c[3] || (c[3] = [
          S("Apply", -1)
        ])]),
        _: 1
      }, 8, ["disabled"])
    ]));
  }
}, ue = /* @__PURE__ */ P(Ke, [["__scopeId", "data-v-ceae936f"]]), Le = ["data-agent-settings-group"], qe = { class: "sw-word" }, De = ["value", "disabled", "data-field", "onChange"], ze = ["value"], Ge = ["data-field-badge"], He = {
  __name: "AgentSettingsGroup",
  props: { group: { type: String, required: !0 } },
  setup(l) {
    const p = l, r = (d) => typeof d == "number" ? `${d / 1e3}k` : `${d.charAt(0).toUpperCase()}${d.slice(1)}`, k = G(), o = k.props.work, a = ie({}), s = T(""), c = T(""), O = T(!1), E = h(() => {
      var d;
      return (((d = o.data.value) == null ? void 0 : d.fields) ?? []).filter((I) => I.group === p.group);
    }), D = h(() => E.value.filter((d) => {
      var I, b;
      return (((b = (I = o.data.value) == null ? void 0 : I.depends) == null ? void 0 : b[d.key]) ?? []).every((m) => a[m] !== !1);
    })), K = (d) => d.type === "flag" ? !!d.value : String(d.value), M = (d) => (d.type === "flag" ? a[d.key] : String(a[d.key])) !== K(d), N = h(() => E.value.filter(M)), B = h(() => N.value.length > 0), V = h(() => {
      var d;
      return B.value && s.value && ((d = o.data.value) == null ? void 0 : d.revision) !== s.value;
    }), F = (d) => d.type === "flag" ? a[d.key] ? "on" : "off" : String(a[d.key]).trim(), W = h(() => N.value.some((d) => d.type !== "flag" && F(d) === ""));
    function q() {
      var d;
      for (const I of E.value) a[I.key] = K(I);
      s.value = ((d = o.data.value) == null ? void 0 : d.revision) ?? "", c.value = "";
    }
    ne(() => o.data.value, () => {
      (!s.value || !B.value) && q();
    }, { immediate: !0 });
    const z = h(() => c.value || (V.value ? "These settings changed since you opened them. Cancel to read them again." : "") || (W.value ? "A number is missing." : ""));
    async function C() {
      O.value = !0;
      const d = await k.run(`work-settings apply --revision ${s.value} ${N.value.map((I) => `${I.key}=${F(I)}`).join(" ")}`);
      O.value = !1, c.value = d.ok ? "" : d.error, await k.reload("work"), d.ok && q();
    }
    return (d, I) => (n(), u("section", {
      class: "group",
      "data-agent-settings-group": l.group
    }, [
      (n(!0), u(x, null, L(D.value, (b) => (n(), R(Z, {
        key: b.key,
        label: b.title,
        help: b.description,
        source: b.source,
        changed: M(b),
        "data-control": b.key
      }, {
        default: A(() => {
          var m;
          return [
            b.type === "flag" ? (n(), u(x, { key: 0 }, [
              $(v(ee), {
                on: a[b.key],
                disabled: v(k).readOnly,
                onChange: (f) => a[b.key] = !a[b.key]
              }, null, 8, ["on", "disabled", "onChange"]),
              t("span", qe, y(a[b.key] ? "On" : "Off"), 1)
            ], 64)) : (m = b.choices) != null && m.length ? (n(), u("select", {
              key: 1,
              class: "choice",
              value: a[b.key],
              disabled: v(k).readOnly,
              "data-field": b.key,
              onChange: (f) => a[b.key] = f.target.value
            }, [
              (n(!0), u(x, null, L(b.choices, (f) => (n(), u("option", {
                key: f,
                value: String(f)
              }, y(r(f)), 9, ze))), 128))
            ], 40, De)) : (n(), R(Be, {
              key: 2,
              modelValue: a[b.key],
              "onUpdate:modelValue": (f) => a[b.key] = f,
              disabled: v(k).readOnly,
              "data-field": b.key
            }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "data-field"])),
            b.badge ? (n(), u("span", {
              key: 3,
              class: "badge",
              "data-field-badge": b.key
            }, y(b.badge), 9, Ge)) : j("", !0)
          ];
        }),
        _: 2
      }, 1032, ["label", "help", "source", "changed", "data-control"]))), 128)),
      $(ue, {
        changes: N.value.length,
        pending: O.value,
        problem: z.value,
        blocked: V.value || W.value,
        onCancel: q,
        onApply: C
      }, null, 8, ["changes", "pending", "problem", "blocked"])
    ], 8, Le));
  }
}, de = /* @__PURE__ */ P(He, [["__scopeId", "data-v-f06fd592"]]), Ye = {
  __name: "AgentSettingsAdvanced",
  setup(l) {
    return (p, r) => (n(), R(de, {
      group: "advanced",
      "data-agent-settings-advanced": ""
    }));
  }
}, Je = { class: "action-buttons" }, Qe = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(l) {
    return (p, r) => (n(), u("form", {
      "data-agent-retire-confirm": "",
      onSubmit: r[2] || (r[2] = ke((k) => p.$emit("submit"), ["prevent"]))
    }, [
      r[5] || (r[5] = t("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      $(v(he), {
        "model-value": l.reason,
        label: "Reason",
        disabled: l.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": r[0] || (r[0] = (k) => p.$emit("update:reason", k))
      }, null, 8, ["model-value", "disabled"]),
      t("div", Je, [
        $(v(U), {
          type: "submit",
          small: "",
          disabled: l.pending || !l.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: A(() => [...r[3] || (r[3] = [
            S("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        $(v(U), {
          small: "",
          disabled: l.pending,
          onClick: r[1] || (r[1] = (k) => p.$emit("cancel"))
        }, {
          default: A(() => [...r[4] || (r[4] = [
            S("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Xe = /* @__PURE__ */ P(Qe, [["__scopeId", "data-v-bbe4e841"]]), Ze = ["data-edit-type"], et = { key: 0 }, tt = { class: "stepper" }, nt = ["disabled", "onClick"], at = ["value", "disabled", "data-agent-limit-input", "onChange"], st = ["disabled", "onClick"], lt = { key: 0 }, ot = { key: 1 }, it = {
  __name: "AgentLimitEditor",
  props: { rows: { type: Array, required: !0 }, pending: Boolean, readOnly: Boolean, environment: { type: String, required: !0 } },
  emits: ["change"],
  setup(l, { emit: p }) {
    const r = p;
    return (k, o) => (n(), u(x, null, [
      o[0] || (o[0] = t("p", null, "How many agents of a type may run at once, and how many may be kept.", -1)),
      (n(!0), u(x, null, L(l.rows, (a) => (n(), u("div", {
        key: a.key,
        class: "edit-row",
        "data-edit-type": a.key
      }, [
        t("div", null, [
          t("strong", null, y(a.per_profile ? "Each read-only helper type" : "Workers"), 1),
          a.per_profile ? (n(), u("small", et, "Researcher, Planner and the others")) : j("", !0)
        ]),
        (n(!0), u(x, null, L([{ name: "Most running", value: a.run_limit, key: a.run_setting, source: a.run_source, kind: "run" }, { name: "Most kept", value: a.kept_limit, key: a.kept_setting, source: a.kept_source, kind: "kept" }], (s) => (n(), u("label", {
          key: s.key
        }, [
          S(y(s.name), 1),
          t("span", tt, [
            t("button", {
              type: "button",
              disabled: l.pending || l.readOnly || s.value === 0,
              onClick: (c) => r("change", a, s.key, s.value, s.value - 1)
            }, "−", 8, nt),
            t("input", {
              type: "number",
              min: "0",
              value: s.value,
              disabled: l.pending || l.readOnly,
              "data-agent-limit-input": s.kind,
              onChange: (c) => r("change", a, s.key, s.value, c.target.value)
            }, null, 40, at),
            t("button", {
              type: "button",
              disabled: l.pending || l.readOnly,
              onClick: (c) => r("change", a, s.key, s.value, s.value + 1)
            }, "+", 8, st)
          ]),
          s.value === 0 ? (n(), u("small", lt, y(s.kind === "run" ? "None can start" : "Any number"), 1)) : s.source === `environment ${l.environment}` ? (n(), u("small", ot, "Changed for " + y(l.environment), 1)) : j("", !0)
        ]))), 128))
      ], 8, Ze))), 128))
    ], 64));
  }
}, rt = /* @__PURE__ */ P(it, [["__scopeId", "data-v-0222402b"]]), ut = { class: "counts-panel" }, dt = { class: "counts" }, ct = ["data-count-agent"], gt = { class: "person-text" }, pt = {
  key: 0,
  class: "helper-head"
}, vt = ["data-agent-limit-type", "data-agent-limit-profile", "onClick"], mt = {
  key: 0,
  class: "bar"
}, kt = {
  key: 5,
  role: "alert"
}, yt = {
  key: 6,
  role: "status"
}, ft = { class: "foot" }, bt = { class: "foot-note" }, ht = {
  __name: "AgentCountsPanel",
  props: {
    title: { default: "Agent counts" },
    titleModifiers: {}
  },
  emits: /* @__PURE__ */ fe(["open-agent", "close"], ["update:title"]),
  setup(l, { emit: p }) {
    const r = p, k = ye(l, "title"), o = G(), a = h(() => o.props.limits.rows.value ?? []), s = h(() => o.props.limits.failure.value), c = T([]), O = T(0), E = T(!1), D = _e(), K = T(null), M = T(!1), N = T(!1), B = T(""), V = T(""), F = T(null), W = T(""), q = h(() => re(a.value)), z = h(() => a.value.find((g) => g.per_profile)), C = h(() => q.value.find((g) => g.key === K.value)), d = h(() => c.value.filter((g) => {
      var e, i;
      return g.state !== "retired" && g.role === ((e = C.value) == null ? void 0 : e.type) && (!C.value.profile || (((i = g.facts) == null ? void 0 : i.profile) || g.profile) === C.value.profile);
    }).sort((g, e) => (g.state !== "running") - (e.state !== "running") || String(g.ended_at || g.created_at).localeCompare(String(e.ended_at || e.created_at)))), I = h(() => {
      var e;
      const g = /* @__PURE__ */ new Map();
      for (const i of d.value) {
        const _ = ((e = i.facts) == null ? void 0 : e.model) || i.program_model;
        _ && g.set(_, (g.get(_) || 0) + 1);
      }
      return [...g].map(([i, _]) => `${_} ${i}`).join(", ");
    }), b = (g, e) => e ? `${Math.min(g / Math.max(g, e) * 100, 100)}%` : "0%", m = (g, e) => e && g > e ? `${(g - e) / g * 100}%` : "0%";
    ne(() => {
      var g;
      return M.value ? "Change the maximums" : ((g = C.value) == null ? void 0 : g.label) || "Agent counts";
    }, (g) => {
      k.value = g;
    }, { immediate: !0 });
    async function f(g, e = 1) {
      o.state["count-agents.role"] = g.type, g.profile ? o.state["count-agents.profile"] = g.profile : delete o.state["count-agents.profile"], o.state["count-agents.page"] = String(e), await o.reload("count-agents");
      const i = o.props["count-agents"];
      c.value = e === 1 ? [...i.rows.value] : [...c.value, ...i.rows.value], O.value = e, E.value = i.more.value;
    }
    function w(g) {
      K.value = g.key, c.value = [], f(g);
    }
    function Y() {
      M.value = !1, K.value = null, F.value = null, B.value = "";
    }
    function ce() {
      Y(), r("close");
    }
    async function ge(g, e, i, _) {
      if (N.value || o.readOnly) return;
      const H = Number(_);
      if (!String(_).trim() || !Number.isInteger(H) || H < 0) {
        B.value = "Use a whole number of 0 or more.";
        return;
      }
      N.value = !0, B.value = "";
      const J = await o.run(["setting", "set", e, String(H), "--environment", o.environment]);
      J.ok ? (await o.reload("limits"), V.value = "Saved.") : B.value = J.error, N.value = !1;
    }
    async function pe(g) {
      if (!W.value.trim() || N.value) return;
      N.value = !0;
      const e = await o.run(["agent", "retire", String(g.id), "--reason", W.value.trim()]);
      B.value = e.ok ? "" : "The agent could not be retired. Try again.", e.ok && (F.value = null, W.value = "", V.value = "Agent retired permanently.", await o.reload("limits"), await f(C.value)), N.value = !1;
    }
    function ve(g) {
      ce(), r("open-agent", g);
    }
    return (g, e) => (n(), u("div", ut, [
      t("div", dt, [
        M.value || C.value ? (n(), u("button", {
          key: 0,
          class: "back",
          type: "button",
          onClick: Y
        }, "‹ Back to the counts")) : j("", !0),
        s.value ? (n(), u(x, { key: 1 }, [
          e[6] || (e[6] = t("strong", null, "The counts could not be read", -1)),
          e[7] || (e[7] = t("p", null, "The journal did not answer.", -1)),
          $(v(U), {
            small: "",
            onClick: e[0] || (e[0] = (i) => v(o).reload("limits"))
          }, {
            default: A(() => [...e[5] || (e[5] = [
              S("Try again", -1)
            ])]),
            _: 1
          })
        ], 64)) : M.value ? (n(), R(rt, {
          key: 2,
          rows: a.value,
          pending: N.value,
          "read-only": v(o).readOnly,
          environment: v(o).environment,
          onChange: ge
        }, null, 8, ["rows", "pending", "read-only", "environment"])) : C.value ? (n(), u(x, { key: 3 }, [
          t("p", null, [
            t("strong", null, y(C.value.running) + " of " + y(C.value.run_limit), 1),
            e[8] || (e[8] = S(" running, ", -1)),
            t("strong", null, [
              S(y(C.value.kept), 1),
              C.value.kept_limit ? (n(), u(x, { key: 0 }, [
                S(" of " + y(C.value.kept_limit), 1)
              ], 64)) : j("", !0)
            ]),
            e[9] || (e[9] = S(" kept", -1))
          ]),
          t("p", null, y(I.value), 1),
          d.value.length ? j("", !0) : (n(), u(x, { key: 0 }, [
            e[10] || (e[10] = t("strong", null, "No agents here yet", -1)),
            e[11] || (e[11] = t("p", null, "An agent shows here as soon as one of this type starts.", -1))
          ], 64)),
          (n(!0), u(x, null, L(d.value, (i) => {
            var _, H, J, ae, se;
            return n(), u("div", {
              key: i.id,
              class: "person",
              "data-count-agent": i.id
            }, [
              t("span", {
                class: X(["dot", { running: i.state === "running" }])
              }, null, 2),
              t("div", gt, [
                t("strong", null, y(((_ = i.facts) == null ? void 0 : _.given_name) || i.id), 1),
                S(" " + y(i.state === "running" ? "Running" : "Idle") + ", " + y(v($e)(i.state === "running" ? i.process_started_at || i.created_at : i.ended_at, v(D))), 1),
                t("small", null, y([i.program, (H = i.facts) == null ? void 0 : H.model, (J = i.facts) == null ? void 0 : J.effort, `${i.role} ${i.id}`].filter(Boolean).join(", ")), 1),
                t("small", null, y(((ae = i.facts) == null ? void 0 : ae.task_title) || ((se = i.facts) == null ? void 0 : se.helper_job)), 1)
              ]),
              $(v(U), {
                small: "",
                onClick: (Q) => ve(i)
              }, {
                default: A(() => [...e[12] || (e[12] = [
                  S("Open", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              i.state === "idle" && !v(o).readOnly ? (n(), R(v(U), {
                key: 0,
                small: "",
                onClick: (Q) => {
                  F.value = i.id, W.value = "";
                }
              }, {
                default: A(() => [...e[13] || (e[13] = [
                  S("Retire", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : j("", !0),
              F.value === i.id ? (n(), R(Xe, {
                key: 1,
                reason: W.value,
                "onUpdate:reason": e[1] || (e[1] = (Q) => W.value = Q),
                pending: N.value,
                onSubmit: (Q) => pe(i),
                onCancel: e[2] || (e[2] = (Q) => F.value = null)
              }, null, 8, ["reason", "pending", "onSubmit"])) : j("", !0)
            ], 8, ct);
          }), 128)),
          E.value ? (n(), R(v(U), {
            key: 1,
            small: "",
            onClick: e[3] || (e[3] = (i) => f(C.value, O.value + 1))
          }, {
            default: A(() => [...e[14] || (e[14] = [
              S("Show more", -1)
            ])]),
            _: 1
          })) : j("", !0)
        ], 64)) : (n(), u(x, { key: 4 }, [
          e[16] || (e[16] = t("div", { class: "columns" }, [
            t("span", null, "Name"),
            t("span", null, "Running"),
            t("span", null, "Kept"),
            t("span")
          ], -1)),
          z.value ? (n(), u("div", pt, [
            e[15] || (e[15] = t("strong", null, "Read-only helpers", -1)),
            t("span", null, y(z.value.running) + " running, " + y(z.value.kept) + " kept", 1)
          ])) : j("", !0),
          (n(!0), u(x, null, L(q.value, (i) => (n(), u("button", {
            key: i.key,
            type: "button",
            class: "count-row",
            "data-agent-limit-type": i.type || i.key,
            "data-agent-limit-profile": i.profile,
            onClick: (_) => w(i)
          }, [
            t("strong", null, y(i.label), 1),
            (n(!0), u(x, null, L([{ count: i.running, limit: i.run_limit, unlimited: !1 }, { count: i.kept, limit: i.kept_limit, unlimited: !0 }], (_) => (n(), u("span", {
              key: _.unlimited,
              class: X({ full: v(te)(_.count, _.limit) })
            }, [
              t("span", null, [
                S(y(_.count), 1),
                _.limit || !_.unlimited ? (n(), u(x, { key: 0 }, [
                  S(" of " + y(_.limit), 1)
                ], 64)) : j("", !0)
              ]),
              _.limit ? (n(), u("span", mt, [
                t("span", {
                  style: le({ width: b(_.count, _.limit) })
                }, null, 4),
                t("i", {
                  style: le({ width: m(_.count, _.limit) })
                }, null, 4)
              ])) : j("", !0)
            ], 2))), 128)),
            $(v(we), {
              name: "chevronRight",
              size: 12
            })
          ], 8, vt))), 128))
        ], 64)),
        B.value ? (n(), u("p", kt, y(B.value), 1)) : V.value ? (n(), u("p", yt, y(V.value), 1)) : j("", !0)
      ]),
      t("div", ft, [
        M.value ? (n(), u(x, { key: 0 }, [
          t("span", bt, y(V.value || `Changes apply to ${v(o).environment}.`), 1),
          $(v(U), { onClick: Y }, {
            default: A(() => [...e[17] || (e[17] = [
              S("Done", -1)
            ])]),
            _: 1
          })
        ], 64)) : C.value ? j("", !0) : (n(), R(v(U), {
          key: 1,
          disabled: v(o).readOnly,
          "data-agent-limits-edit": "",
          onClick: e[4] || (e[4] = (i) => M.value = !0)
        }, {
          default: A(() => [...e[18] || (e[18] = [
            S("Change the maximums", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]))
      ])
    ]));
  }
}, _t = /* @__PURE__ */ P(ht, [["__scopeId", "data-v-c850ee3a"]]), $t = {
  class: "agents",
  "data-agent-settings-agents": ""
}, wt = {
  __name: "AgentSettingsAgents",
  setup(l) {
    const p = G(), r = T("Agent counts"), k = (o) => p.open("agents.agents", o.id);
    return be(() => p.reload("limits")), (o, a) => (n(), u("section", $t, [
      $(_t, {
        title: r.value,
        "onUpdate:title": a[0] || (a[0] = (s) => r.value = s),
        onOpenAgent: k
      }, null, 8, ["title"])
    ]));
  }
}, Ct = /* @__PURE__ */ P(wt, [["__scopeId", "data-v-b2fa0c3e"]]), At = {
  __name: "AgentSettingsTests",
  setup(l) {
    return (p, r) => (n(), R(de, {
      group: "tests",
      "data-agent-settings-tests": ""
    }));
  }
}, St = {
  class: "work",
  "data-agent-settings-work": ""
}, Ot = { class: "section" }, Tt = { class: "sw-word" }, xt = { class: "section" }, jt = { class: "sw-word" }, Nt = {
  key: 0,
  class: "section-help warn",
  "data-work-hint": ""
}, oe = "journal.suites.coding.auto-mode", It = "journal.suites.coding.workers.main-dispatches-workers", Mt = {
  __name: "AgentSettingsWork",
  setup(l) {
    const p = [
      { key: "journal.suites.coding.auto-mode", label: "Auto mode", line: "The journal hands the main agent its next task, and it keeps going while tasks are left" },
      { key: "journal.suites.coding.main-writes-code", label: "Main agent writes code", line: "The main agent may change project files itself; off, it plans, delegates and merges" },
      { key: "journal.suites.coding.workers.main-dispatches-workers", label: "Main agent sends workers", line: "Whether the main agent may send workers to do tasks." },
      { key: "journal.suites.coding.continue-while-delegatable", label: "Keep going while work can be delegated", line: "Keep the main agent working while open tasks can still be sent to workers." },
      { key: "journal.suites.coding.workers.merger-on", label: "Merger takes in workers", line: "A helper merges workers whose tests passed, and passes on what the main agent must judge." },
      { key: "journal.suites.coding.main-starts-read-only-helpers", label: "Use read-only helpers", line: "Whether the main agent may start read-only helpers." },
      { key: "journal.suites.coding.designer-enabled", label: "Use a designer", line: "Whether the main agent may start a designer, which writes a design document and changes no code." },
      { key: "journal.suites.coding.workers.main-agent-may-merge", label: "Main agent may merge workers", line: "Whether the main agent may merge the work of a worker itself." }
    ], r = [{ key: "builder", label: "Builder" }, { key: "orchestrator", label: "Orchestrator" }], k = [oe], o = G(), a = o.props.work, s = ie({}), c = T(""), O = T(""), E = T(!1), D = h(() => p.filter((m) => {
      var f, w;
      return s[m.key] !== ((w = (f = a.data.value) == null ? void 0 : f.controls) == null ? void 0 : w[m.key]);
    })), K = h(() => D.value.length > 0), M = h(() => K.value && a.data.value && c.value && a.data.value.revision !== c.value), N = h(() => {
      var m;
      return ((m = a.data.value) == null ? void 0 : m.workflow) ?? "";
    }), B = h(() => {
      var m;
      return ((m = a.data.value) == null ? void 0 : m.depends) ?? {};
    }), V = (m) => (B.value[m.key] ?? []).every((f) => s[f] !== !1), F = h(() => p.filter((m) => k.includes(m.key) && V(m))), W = h(() => p.filter((m) => !k.includes(m.key) && V(m))), q = h(() => O.value || (M.value ? "These settings changed since you opened them. Cancel to read them again." : "")), z = h(() => s[oe] === !1 && s[It] === !1);
    function C() {
      const m = a.data.value;
      if (m) {
        for (const f of p) s[f.key] = m.controls[f.key];
        c.value = m.revision, O.value = "";
      }
    }
    ne(() => a.data.value, () => {
      (!c.value || !K.value) && C();
    }, { immediate: !0 });
    async function d(m) {
      E.value = !0;
      const f = await o.run(m);
      E.value = !1, f.ok ? (await o.reload("work"), C()) : (O.value = f.error, await o.reload("work"));
    }
    const I = () => d(`work-settings apply --revision ${c.value} ${D.value.map((m) => `${m.key}=${s[m.key] ? "on" : "off"}`).join(" ")}`), b = (m) => d(`work-settings preset ${m} --revision ${c.value}`);
    return (m, f) => (n(), u("section", St, [
      t("div", Ot, [
        f[0] || (f[0] = t("p", { class: "section-title" }, "Taking on work", -1)),
        $(Z, {
          label: "Workflow",
          help: "A preset sets the switches below at once; Custom is any other mix.",
          "data-work-flow": ""
        }, {
          default: A(() => [
            $(v(Ce), {
              options: r,
              value: N.value,
              onPick: b
            }, null, 8, ["value"])
          ]),
          _: 1
        }),
        (n(!0), u(x, null, L(F.value, (w) => (n(), R(Z, {
          key: w.key,
          label: w.label,
          help: w.line,
          "data-control": w.key
        }, {
          default: A(() => [
            $(v(ee), {
              on: s[w.key],
              disabled: v(o).readOnly,
              onChange: (Y) => s[w.key] = !s[w.key]
            }, null, 8, ["on", "disabled", "onChange"]),
            t("span", Tt, y(s[w.key] ? "On" : "Off"), 1)
          ]),
          _: 2
        }, 1032, ["label", "help", "data-control"]))), 128))
      ]),
      t("div", xt, [
        f[1] || (f[1] = t("p", { class: "section-title" }, "How the main agent works", -1)),
        f[2] || (f[2] = t("p", { class: "section-help" }, "Your models, maximums and tests stay as you set them.", -1)),
        (n(!0), u(x, null, L(W.value, (w) => (n(), R(Z, {
          key: w.key,
          label: w.label,
          help: w.line,
          "data-control": w.key
        }, {
          default: A(() => [
            $(v(ee), {
              on: s[w.key],
              disabled: v(o).readOnly,
              onChange: (Y) => s[w.key] = !s[w.key]
            }, null, 8, ["on", "disabled", "onChange"]),
            t("span", jt, y(s[w.key] ? "On" : "Off"), 1)
          ]),
          _: 2
        }, 1032, ["label", "help", "data-control"]))), 128)),
        z.value ? (n(), u("p", Nt, "With Auto off and no workers, nothing starts the work: a person starts tasks or turns one of them on.")) : j("", !0)
      ]),
      $(ue, {
        changes: D.value.length,
        pending: E.value,
        problem: q.value,
        blocked: M.value,
        onCancel: C,
        onApply: I
      }, null, 8, ["changes", "pending", "problem", "blocked"])
    ]));
  }
}, Bt = /* @__PURE__ */ P(Mt, [["__scopeId", "data-v-1c535ddc"]]), Rt = {
  class: "settings",
  "data-agent-settings": ""
}, Vt = { class: "settings-bar" }, Wt = { class: "settings-body" }, Et = {
  key: 0,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, Ft = {
  __name: "AgentSettings",
  setup(l) {
    const p = G(), r = T("work"), k = h(() => {
      var c;
      return re(((c = p.props.limits) == null ? void 0 : c.rows.value) ?? []).filter((O) => te(O.running, O.run_limit) || te(O.kept, O.kept_limit)).length;
    }), o = h(() => [{ key: "work", label: "Work" }, { key: "agents", label: k.value ? `Agents ${k.value}` : "Agents" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }]), a = h(() => o.value.find((c) => c.key === r.value));
    function s(c) {
      r.value = c.key, p.state.tab = c.key === "agents" ? "agents" : "";
    }
    return (c, O) => (n(), R(v(Ae), { padding: "0" }, {
      default: A(() => [
        t("div", Rt, [
          t("div", Vt, [
            $(v(Se), {
              tabs: o.value,
              active: a.value,
              onChoose: s
            }, null, 8, ["tabs", "active"])
          ]),
          t("div", Wt, [
            v(p).readOnly ? (n(), u("p", Et, "Only a person can change these settings. You can read every value, and ask a person for a change.")) : j("", !0),
            $(v(Oe), { tab: a.value }, {
              default: A(() => [
                $(v(Te), { value: r.value }, {
                  work: A(() => [
                    $(Bt)
                  ]),
                  agents: A(() => [
                    $(Ct)
                  ]),
                  tests: A(() => [
                    $(At)
                  ]),
                  advanced: A(() => [
                    $(Ye)
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
}, Lt = /* @__PURE__ */ P(Ft, [["__scopeId", "data-v-932b9c8c"]]);
export {
  Lt as A
};
