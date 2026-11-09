/* @code-commandments-generated */
import { openBlock as n, createElementBlock as u, createElementVNode as t, computed as h, normalizeClass as X, toDisplayString as y, renderSlot as me, createTextVNode as A, createCommentVNode as j, createVNode as $, unref as m, withCtx as S, reactive as ie, ref as x, watch as ne, Fragment as T, renderList as L, createBlock as V, withModifiers as ke, useModel as ye, normalizeStyle as le, mergeModels as fe, onMounted as be } from "vue";
import { useWindow as G, Btn as U, Switch as ee, TextInput as he, useNow as _e, age as $e, Icon as we, Segmented as Ce, WindowRoom as Ae, InnerTabs as Se, SwitchCase as Oe } from "@journal/window-kit";
import { _ as P } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const re = (l) => l.flatMap((p) => p.per_profile ? p.profiles.map((r) => ({ ...r, label: r.title, type: p.key, key: `${p.key}:${r.profile}` })) : [{ ...p, type: p.key }]), te = (l, p) => p > 0 && l >= p, xe = { class: "step" }, Te = ["disabled"], je = ["value", "disabled"], Ne = ["disabled"], Ie = {
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
      }, "−", 8, Te),
      t("input", {
        type: "number",
        min: "0",
        value: l.modelValue,
        disabled: l.disabled,
        onInput: s[1] || (s[1] = (c) => k("update:modelValue", c.target.value))
      }, null, 40, je),
      t("button", {
        type: "button",
        disabled: l.disabled,
        "aria-label": "More",
        onClick: s[2] || (s[2] = (c) => o(1))
      }, "+", 8, Ne)
    ]));
  }
}, Me = /* @__PURE__ */ P(Ie, [["__scopeId", "data-v-e9d43b82"]]), Re = { class: "ctl-text" }, Ve = { class: "ctl-label" }, Be = { class: "ctl-help" }, We = { class: "ctl-input" }, Ee = {
  key: 0,
  class: "ctl-src"
}, Fe = {
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
        t("span", Be, y(l.help), 1)
      ]),
      t("div", We, [
        me(a.$slots, "default", {}, void 0, !0)
      ]),
      l.source ? (n(), u("div", Ee, [
        t("span", {
          class: X(["src", { here: l.source === "environment", changed: l.changed }]),
          "data-setting-source": ""
        }, [
          s[0] || (s[0] = t("i", null, null, -1)),
          A(y(o.value), 1)
        ], 2)
      ])) : j("", !0)
    ], 2));
  }
}, Z = /* @__PURE__ */ P(Fe, [["__scopeId", "data-v-6e2d513b"]]), Ue = { class: "foot" }, Pe = {
  __name: "SettingsFoot",
  props: { changes: { type: Number, default: 0 }, pending: { type: Boolean, default: !1 }, problem: { type: String, default: "" }, blocked: { type: Boolean, default: !1 } },
  emits: ["cancel", "apply"],
  setup(l, { emit: p }) {
    const r = l, k = p, o = G(), a = h(() => r.problem ? r.problem : r.pending ? "Applying." : r.changes ? `${r.changes} ${r.changes === 1 ? "change" : "changes"} to apply to ${o.environment}.` : `No changes. For the environment ${o.environment}.`);
    return (s, c) => (n(), u("div", Ue, [
      t("span", {
        class: X(["foot-note", { bad: l.problem, busy: l.pending }]),
        role: "status"
      }, y(a.value), 3),
      $(m(U), {
        bordered: "",
        disabled: !l.changes || l.pending,
        "data-settings-cancel": "",
        onClick: c[0] || (c[0] = (O) => k("cancel"))
      }, {
        default: S(() => [...c[2] || (c[2] = [
          A("Cancel", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      $(m(U), {
        variant: "primary",
        disabled: !l.changes || l.pending || l.blocked || m(o).readOnly,
        "data-settings-apply": "",
        onClick: c[1] || (c[1] = (O) => k("apply"))
      }, {
        default: S(() => [...c[3] || (c[3] = [
          A("Apply", -1)
        ])]),
        _: 1
      }, 8, ["disabled"])
    ]));
  }
}, ue = /* @__PURE__ */ P(Pe, [["__scopeId", "data-v-88c3dd59"]]), Ke = ["data-agent-settings-group"], Le = { class: "sw-word" }, qe = ["value", "disabled", "data-field", "onChange"], De = ["value"], ze = ["data-field-badge"], Ge = {
  __name: "AgentSettingsGroup",
  props: { group: { type: String, required: !0 } },
  setup(l) {
    const p = l, r = (d) => typeof d == "number" ? `${d / 1e3}k` : `${d.charAt(0).toUpperCase()}${d.slice(1)}`, k = G(), o = k.props.work, a = ie({}), s = x(""), c = x(""), O = x(!1), E = h(() => {
      var d;
      return (((d = o.data.value) == null ? void 0 : d.fields) ?? []).filter((I) => I.group === p.group);
    }), D = h(() => E.value.filter((d) => {
      var I, b;
      return (((b = (I = o.data.value) == null ? void 0 : I.depends) == null ? void 0 : b[d.key]) ?? []).every((v) => a[v] !== !1);
    })), K = (d) => d.type === "flag" ? !!d.value : String(d.value), M = (d) => (d.type === "flag" ? a[d.key] : String(a[d.key])) !== K(d), N = h(() => E.value.filter(M)), R = h(() => N.value.length > 0), B = h(() => {
      var d;
      return R.value && s.value && ((d = o.data.value) == null ? void 0 : d.revision) !== s.value;
    }), F = (d) => d.type === "flag" ? a[d.key] ? "on" : "off" : String(a[d.key]).trim(), W = h(() => N.value.some((d) => d.type !== "flag" && F(d) === ""));
    function q() {
      var d;
      for (const I of E.value) a[I.key] = K(I);
      s.value = ((d = o.data.value) == null ? void 0 : d.revision) ?? "", c.value = "";
    }
    ne(() => o.data.value, () => {
      (!s.value || !R.value) && q();
    }, { immediate: !0 });
    const z = h(() => c.value || (B.value ? "These settings changed since you opened them. Cancel to read them again." : "") || (W.value ? "A number is missing." : ""));
    async function C() {
      O.value = !0;
      const d = await k.run(`work-settings apply --revision ${s.value} ${N.value.map((I) => `${I.key}=${F(I)}`).join(" ")}`);
      O.value = !1, c.value = d.ok ? "" : d.error, await k.reload("work"), d.ok && q();
    }
    return (d, I) => (n(), u("section", {
      class: "group",
      "data-agent-settings-group": l.group
    }, [
      (n(!0), u(T, null, L(D.value, (b) => (n(), V(Z, {
        key: b.key,
        label: b.title,
        help: b.description,
        source: b.source,
        changed: M(b),
        "data-control": b.key
      }, {
        default: S(() => {
          var v;
          return [
            b.type === "flag" ? (n(), u(T, { key: 0 }, [
              $(m(ee), {
                on: a[b.key],
                disabled: m(k).readOnly,
                onChange: (f) => a[b.key] = !a[b.key]
              }, null, 8, ["on", "disabled", "onChange"]),
              t("span", Le, y(a[b.key] ? "On" : "Off"), 1)
            ], 64)) : (v = b.choices) != null && v.length ? (n(), u("select", {
              key: 1,
              class: "choice",
              value: a[b.key],
              disabled: m(k).readOnly,
              "data-field": b.key,
              onChange: (f) => a[b.key] = f.target.value
            }, [
              (n(!0), u(T, null, L(b.choices, (f) => (n(), u("option", {
                key: f,
                value: String(f)
              }, y(r(f)), 9, De))), 128))
            ], 40, qe)) : (n(), V(Me, {
              key: 2,
              modelValue: a[b.key],
              "onUpdate:modelValue": (f) => a[b.key] = f,
              disabled: m(k).readOnly,
              "data-field": b.key
            }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "data-field"])),
            b.badge ? (n(), u("span", {
              key: 3,
              class: "badge",
              "data-field-badge": b.key
            }, y(b.badge), 9, ze)) : j("", !0)
          ];
        }),
        _: 2
      }, 1032, ["label", "help", "source", "changed", "data-control"]))), 128)),
      $(ue, {
        changes: N.value.length,
        pending: O.value,
        problem: z.value,
        blocked: B.value || W.value,
        onCancel: q,
        onApply: C
      }, null, 8, ["changes", "pending", "problem", "blocked"])
    ], 8, Ke));
  }
}, de = /* @__PURE__ */ P(Ge, [["__scopeId", "data-v-09d5a122"]]), He = {
  __name: "AgentSettingsAdvanced",
  setup(l) {
    return (p, r) => (n(), V(de, {
      group: "advanced",
      "data-agent-settings-advanced": ""
    }));
  }
}, Ye = { class: "action-buttons" }, Je = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(l) {
    return (p, r) => (n(), u("form", {
      "data-agent-retire-confirm": "",
      onSubmit: r[2] || (r[2] = ke((k) => p.$emit("submit"), ["prevent"]))
    }, [
      r[5] || (r[5] = t("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      $(m(he), {
        "model-value": l.reason,
        label: "Reason",
        disabled: l.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": r[0] || (r[0] = (k) => p.$emit("update:reason", k))
      }, null, 8, ["model-value", "disabled"]),
      t("div", Ye, [
        $(m(U), {
          type: "submit",
          small: "",
          disabled: l.pending || !l.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: S(() => [...r[3] || (r[3] = [
            A("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        $(m(U), {
          small: "",
          disabled: l.pending,
          onClick: r[1] || (r[1] = (k) => p.$emit("cancel"))
        }, {
          default: S(() => [...r[4] || (r[4] = [
            A("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Qe = /* @__PURE__ */ P(Je, [["__scopeId", "data-v-23a905c0"]]), Xe = ["data-edit-type"], Ze = { key: 0 }, et = { class: "stepper" }, tt = ["disabled", "onClick"], nt = ["value", "disabled", "data-agent-limit-input", "onChange"], at = ["disabled", "onClick"], st = { key: 0 }, lt = { key: 1 }, ot = {
  __name: "AgentLimitEditor",
  props: { rows: { type: Array, required: !0 }, pending: Boolean, readOnly: Boolean, environment: { type: String, required: !0 } },
  emits: ["change"],
  setup(l, { emit: p }) {
    const r = p;
    return (k, o) => (n(), u(T, null, [
      o[0] || (o[0] = t("p", null, "How many agents of a type may run at once, and how many may be kept.", -1)),
      (n(!0), u(T, null, L(l.rows, (a) => (n(), u("div", {
        key: a.key,
        class: "edit-row",
        "data-edit-type": a.key
      }, [
        t("div", null, [
          t("strong", null, y(a.per_profile ? "Each read-only helper type" : "Workers"), 1),
          a.per_profile ? (n(), u("small", Ze, "Researcher, Planner and the others")) : j("", !0)
        ]),
        (n(!0), u(T, null, L([{ name: "Most running", value: a.run_limit, key: a.run_setting, source: a.run_source, kind: "run" }, { name: "Most kept", value: a.kept_limit, key: a.kept_setting, source: a.kept_source, kind: "kept" }], (s) => (n(), u("label", {
          key: s.key
        }, [
          A(y(s.name), 1),
          t("span", et, [
            t("button", {
              type: "button",
              disabled: l.pending || l.readOnly || s.value === 0,
              onClick: (c) => r("change", a, s.key, s.value, s.value - 1)
            }, "−", 8, tt),
            t("input", {
              type: "number",
              min: "0",
              value: s.value,
              disabled: l.pending || l.readOnly,
              "data-agent-limit-input": s.kind,
              onChange: (c) => r("change", a, s.key, s.value, c.target.value)
            }, null, 40, nt),
            t("button", {
              type: "button",
              disabled: l.pending || l.readOnly,
              onClick: (c) => r("change", a, s.key, s.value, s.value + 1)
            }, "+", 8, at)
          ]),
          s.value === 0 ? (n(), u("small", st, y(s.kind === "run" ? "None can start" : "Any number"), 1)) : s.source === `environment ${l.environment}` ? (n(), u("small", lt, "Changed for " + y(l.environment), 1)) : j("", !0)
        ]))), 128))
      ], 8, Xe))), 128))
    ], 64));
  }
}, it = /* @__PURE__ */ P(ot, [["__scopeId", "data-v-fc209014"]]), rt = { class: "counts-panel" }, ut = { class: "counts" }, dt = ["data-count-agent"], ct = { class: "person-text" }, gt = {
  key: 0,
  class: "helper-head"
}, pt = ["data-agent-limit-type", "data-agent-limit-profile", "onClick"], vt = {
  key: 0,
  class: "bar"
}, mt = {
  key: 5,
  role: "alert"
}, kt = {
  key: 6,
  role: "status"
}, yt = { class: "foot" }, ft = { class: "foot-note" }, bt = {
  __name: "AgentCountsPanel",
  props: {
    title: { default: "Agent counts" },
    titleModifiers: {}
  },
  emits: /* @__PURE__ */ fe(["open-agent", "close"], ["update:title"]),
  setup(l, { emit: p }) {
    const r = p, k = ye(l, "title"), o = G(), a = h(() => o.props.limits.rows.value ?? []), s = h(() => o.props.limits.failure.value), c = x([]), O = x(0), E = x(!1), D = _e(), K = x(null), M = x(!1), N = x(!1), R = x(""), B = x(""), F = x(null), W = x(""), q = h(() => re(a.value)), z = h(() => a.value.find((g) => g.per_profile)), C = h(() => q.value.find((g) => g.key === K.value)), d = h(() => c.value.filter((g) => {
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
    }), b = (g, e) => e ? `${Math.min(g / Math.max(g, e) * 100, 100)}%` : "0%", v = (g, e) => e && g > e ? `${(g - e) / g * 100}%` : "0%";
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
      M.value = !1, K.value = null, F.value = null, R.value = "";
    }
    function ce() {
      Y(), r("close");
    }
    async function ge(g, e, i, _) {
      if (N.value || o.readOnly) return;
      const H = Number(_);
      if (!String(_).trim() || !Number.isInteger(H) || H < 0) {
        R.value = "Use a whole number of 0 or more.";
        return;
      }
      N.value = !0, R.value = "";
      const J = await o.run(["setting", "set", e, String(H), "--environment", o.environment]);
      J.ok ? (await o.reload("limits"), B.value = "Saved.") : R.value = J.error, N.value = !1;
    }
    async function pe(g) {
      if (!W.value.trim() || N.value) return;
      N.value = !0;
      const e = await o.run(["agent", "retire", String(g.id), "--reason", W.value.trim()]);
      R.value = e.ok ? "" : "The agent could not be retired. Try again.", e.ok && (F.value = null, W.value = "", B.value = "Agent retired permanently.", await o.reload("limits"), await f(C.value)), N.value = !1;
    }
    function ve(g) {
      ce(), r("open-agent", g);
    }
    return (g, e) => (n(), u("div", rt, [
      t("div", ut, [
        M.value || C.value ? (n(), u("button", {
          key: 0,
          class: "back",
          type: "button",
          onClick: Y
        }, "‹ Back to the counts")) : j("", !0),
        s.value ? (n(), u(T, { key: 1 }, [
          e[6] || (e[6] = t("strong", null, "The counts could not be read", -1)),
          e[7] || (e[7] = t("p", null, "The journal did not answer.", -1)),
          $(m(U), {
            small: "",
            onClick: e[0] || (e[0] = (i) => m(o).reload("limits"))
          }, {
            default: S(() => [...e[5] || (e[5] = [
              A("Try again", -1)
            ])]),
            _: 1
          })
        ], 64)) : M.value ? (n(), V(it, {
          key: 2,
          rows: a.value,
          pending: N.value,
          "read-only": m(o).readOnly,
          environment: m(o).environment,
          onChange: ge
        }, null, 8, ["rows", "pending", "read-only", "environment"])) : C.value ? (n(), u(T, { key: 3 }, [
          t("p", null, [
            t("strong", null, y(C.value.running) + " of " + y(C.value.run_limit), 1),
            e[8] || (e[8] = A(" running, ", -1)),
            t("strong", null, [
              A(y(C.value.kept), 1),
              C.value.kept_limit ? (n(), u(T, { key: 0 }, [
                A(" of " + y(C.value.kept_limit), 1)
              ], 64)) : j("", !0)
            ]),
            e[9] || (e[9] = A(" kept", -1))
          ]),
          t("p", null, y(I.value), 1),
          d.value.length ? j("", !0) : (n(), u(T, { key: 0 }, [
            e[10] || (e[10] = t("strong", null, "No agents here yet", -1)),
            e[11] || (e[11] = t("p", null, "An agent shows here as soon as one of this type starts.", -1))
          ], 64)),
          (n(!0), u(T, null, L(d.value, (i) => {
            var _, H, J, ae, se;
            return n(), u("div", {
              key: i.id,
              class: "person",
              "data-count-agent": i.id
            }, [
              t("span", {
                class: X(["dot", { running: i.state === "running" }])
              }, null, 2),
              t("div", ct, [
                t("strong", null, y(((_ = i.facts) == null ? void 0 : _.given_name) || i.id), 1),
                A(" " + y(i.state === "running" ? "Running" : "Idle") + ", " + y(m($e)(i.state === "running" ? i.process_started_at || i.created_at : i.ended_at, m(D))), 1),
                t("small", null, y([i.program, (H = i.facts) == null ? void 0 : H.model, (J = i.facts) == null ? void 0 : J.effort, `${i.role} ${i.id}`].filter(Boolean).join(", ")), 1),
                t("small", null, y(((ae = i.facts) == null ? void 0 : ae.task_title) || ((se = i.facts) == null ? void 0 : se.helper_job)), 1)
              ]),
              $(m(U), {
                small: "",
                onClick: (Q) => ve(i)
              }, {
                default: S(() => [...e[12] || (e[12] = [
                  A("Open", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              i.state === "idle" && !m(o).readOnly ? (n(), V(m(U), {
                key: 0,
                small: "",
                onClick: (Q) => {
                  F.value = i.id, W.value = "";
                }
              }, {
                default: S(() => [...e[13] || (e[13] = [
                  A("Retire", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : j("", !0),
              F.value === i.id ? (n(), V(Qe, {
                key: 1,
                reason: W.value,
                "onUpdate:reason": e[1] || (e[1] = (Q) => W.value = Q),
                pending: N.value,
                onSubmit: (Q) => pe(i),
                onCancel: e[2] || (e[2] = (Q) => F.value = null)
              }, null, 8, ["reason", "pending", "onSubmit"])) : j("", !0)
            ], 8, dt);
          }), 128)),
          E.value ? (n(), V(m(U), {
            key: 1,
            small: "",
            onClick: e[3] || (e[3] = (i) => f(C.value, O.value + 1))
          }, {
            default: S(() => [...e[14] || (e[14] = [
              A("Show more", -1)
            ])]),
            _: 1
          })) : j("", !0)
        ], 64)) : (n(), u(T, { key: 4 }, [
          e[16] || (e[16] = t("div", { class: "columns" }, [
            t("span", null, "Name"),
            t("span", null, "Running"),
            t("span", null, "Kept"),
            t("span")
          ], -1)),
          z.value ? (n(), u("div", gt, [
            e[15] || (e[15] = t("strong", null, "Read-only helpers", -1)),
            t("span", null, y(z.value.running) + " running, " + y(z.value.kept) + " kept", 1)
          ])) : j("", !0),
          (n(!0), u(T, null, L(q.value, (i) => (n(), u("button", {
            key: i.key,
            type: "button",
            class: "count-row",
            "data-agent-limit-type": i.type || i.key,
            "data-agent-limit-profile": i.profile,
            onClick: (_) => w(i)
          }, [
            t("strong", null, y(i.label), 1),
            (n(!0), u(T, null, L([{ count: i.running, limit: i.run_limit, unlimited: !1 }, { count: i.kept, limit: i.kept_limit, unlimited: !0 }], (_) => (n(), u("span", {
              key: _.unlimited,
              class: X({ full: m(te)(_.count, _.limit) })
            }, [
              t("span", null, [
                A(y(_.count), 1),
                _.limit || !_.unlimited ? (n(), u(T, { key: 0 }, [
                  A(" of " + y(_.limit), 1)
                ], 64)) : j("", !0)
              ]),
              _.limit ? (n(), u("span", vt, [
                t("span", {
                  style: le({ width: b(_.count, _.limit) })
                }, null, 4),
                t("i", {
                  style: le({ width: v(_.count, _.limit) })
                }, null, 4)
              ])) : j("", !0)
            ], 2))), 128)),
            $(m(we), {
              name: "chevronRight",
              size: 12
            })
          ], 8, pt))), 128))
        ], 64)),
        R.value ? (n(), u("p", mt, y(R.value), 1)) : B.value ? (n(), u("p", kt, y(B.value), 1)) : j("", !0)
      ]),
      t("div", yt, [
        M.value ? (n(), u(T, { key: 0 }, [
          t("span", ft, y(B.value || `Changes apply to ${m(o).environment}.`), 1),
          $(m(U), { onClick: Y }, {
            default: S(() => [...e[17] || (e[17] = [
              A("Done", -1)
            ])]),
            _: 1
          })
        ], 64)) : C.value ? j("", !0) : (n(), V(m(U), {
          key: 1,
          disabled: m(o).readOnly,
          "data-agent-limits-edit": "",
          onClick: e[4] || (e[4] = (i) => M.value = !0)
        }, {
          default: S(() => [...e[18] || (e[18] = [
            A("Change the maximums", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]))
      ])
    ]));
  }
}, ht = /* @__PURE__ */ P(bt, [["__scopeId", "data-v-604ef447"]]), _t = {
  class: "agents",
  "data-agent-settings-agents": ""
}, $t = {
  __name: "AgentSettingsAgents",
  setup(l) {
    const p = G(), r = x("Agent counts"), k = (o) => p.open("agents.agents", o.id);
    return be(() => p.reload("limits")), (o, a) => (n(), u("section", _t, [
      $(ht, {
        title: r.value,
        "onUpdate:title": a[0] || (a[0] = (s) => r.value = s),
        onOpenAgent: k
      }, null, 8, ["title"])
    ]));
  }
}, wt = /* @__PURE__ */ P($t, [["__scopeId", "data-v-3e01c727"]]), Ct = {
  __name: "AgentSettingsTests",
  setup(l) {
    return (p, r) => (n(), V(de, {
      group: "tests",
      "data-agent-settings-tests": ""
    }));
  }
}, At = {
  class: "work",
  "data-agent-settings-work": ""
}, St = { class: "section" }, Ot = { class: "sw-word" }, xt = { class: "section" }, Tt = { class: "sw-word" }, jt = {
  key: 0,
  class: "section-help warn",
  "data-work-hint": ""
}, oe = "journal.suites.coding.auto-mode", Nt = "journal.suites.coding.workers.main-dispatches-workers", It = {
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
    ], r = [{ key: "builder", label: "Builder" }, { key: "orchestrator", label: "Orchestrator" }], k = [oe], o = G(), a = o.props.work, s = ie({}), c = x(""), O = x(""), E = x(!1), D = h(() => p.filter((v) => {
      var f, w;
      return s[v.key] !== ((w = (f = a.data.value) == null ? void 0 : f.controls) == null ? void 0 : w[v.key]);
    })), K = h(() => D.value.length > 0), M = h(() => K.value && a.data.value && c.value && a.data.value.revision !== c.value), N = h(() => {
      var v;
      return ((v = a.data.value) == null ? void 0 : v.workflow) ?? "";
    }), R = h(() => {
      var v;
      return ((v = a.data.value) == null ? void 0 : v.depends) ?? {};
    }), B = (v) => (R.value[v.key] ?? []).every((f) => s[f] !== !1), F = h(() => p.filter((v) => k.includes(v.key) && B(v))), W = h(() => p.filter((v) => !k.includes(v.key) && B(v))), q = h(() => O.value || (M.value ? "These settings changed since you opened them. Cancel to read them again." : "")), z = h(() => s[oe] === !1 && s[Nt] === !1);
    function C() {
      const v = a.data.value;
      if (v) {
        for (const f of p) s[f.key] = v.controls[f.key];
        c.value = v.revision, O.value = "";
      }
    }
    ne(() => a.data.value, () => {
      (!c.value || !K.value) && C();
    }, { immediate: !0 });
    async function d(v) {
      E.value = !0;
      const f = await o.run(v);
      E.value = !1, f.ok ? (await o.reload("work"), C()) : (O.value = f.error, await o.reload("work"));
    }
    const I = () => d(`work-settings apply --revision ${c.value} ${D.value.map((v) => `${v.key}=${s[v.key] ? "on" : "off"}`).join(" ")}`), b = (v) => d(`work-settings preset ${v} --revision ${c.value}`);
    return (v, f) => (n(), u("section", At, [
      t("div", St, [
        f[0] || (f[0] = t("p", { class: "section-title" }, "Taking on work", -1)),
        $(Z, {
          label: "Workflow",
          help: "A preset sets the switches below at once; Custom is any other mix.",
          "data-work-flow": ""
        }, {
          default: S(() => [
            $(m(Ce), {
              options: r,
              value: N.value,
              onPick: b
            }, null, 8, ["value"])
          ]),
          _: 1
        }),
        (n(!0), u(T, null, L(F.value, (w) => (n(), V(Z, {
          key: w.key,
          label: w.label,
          help: w.line,
          "data-control": w.key
        }, {
          default: S(() => [
            $(m(ee), {
              on: s[w.key],
              disabled: m(o).readOnly,
              onChange: (Y) => s[w.key] = !s[w.key]
            }, null, 8, ["on", "disabled", "onChange"]),
            t("span", Ot, y(s[w.key] ? "On" : "Off"), 1)
          ]),
          _: 2
        }, 1032, ["label", "help", "data-control"]))), 128))
      ]),
      t("div", xt, [
        f[1] || (f[1] = t("p", { class: "section-title" }, "How the main agent works", -1)),
        f[2] || (f[2] = t("p", { class: "section-help" }, "Your models, maximums and tests stay as you set them.", -1)),
        (n(!0), u(T, null, L(W.value, (w) => (n(), V(Z, {
          key: w.key,
          label: w.label,
          help: w.line,
          "data-control": w.key
        }, {
          default: S(() => [
            $(m(ee), {
              on: s[w.key],
              disabled: m(o).readOnly,
              onChange: (Y) => s[w.key] = !s[w.key]
            }, null, 8, ["on", "disabled", "onChange"]),
            t("span", Tt, y(s[w.key] ? "On" : "Off"), 1)
          ]),
          _: 2
        }, 1032, ["label", "help", "data-control"]))), 128)),
        z.value ? (n(), u("p", jt, "With Auto off and no workers, nothing starts the work: a person starts tasks or turns one of them on.")) : j("", !0)
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
}, Mt = /* @__PURE__ */ P(It, [["__scopeId", "data-v-9f39da05"]]), Rt = {
  class: "settings",
  "data-agent-settings": ""
}, Vt = { class: "settings-bar" }, Bt = { class: "settings-body" }, Wt = {
  key: 0,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, Et = {
  __name: "AgentSettings",
  setup(l) {
    const p = G(), r = x("work"), k = h(() => {
      var c;
      return re(((c = p.props.limits) == null ? void 0 : c.rows.value) ?? []).filter((O) => te(O.running, O.run_limit) || te(O.kept, O.kept_limit)).length;
    }), o = h(() => [{ key: "work", label: "Work" }, { key: "agents", label: k.value ? `Agents ${k.value}` : "Agents" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }]), a = h(() => o.value.find((c) => c.key === r.value));
    function s(c) {
      r.value = c.key, p.state.tab = c.key === "agents" ? "agents" : "";
    }
    return (c, O) => (n(), V(m(Ae), { padding: "0" }, {
      default: S(() => [
        t("div", Rt, [
          t("div", Vt, [
            $(m(Se), {
              tabs: o.value,
              active: a.value,
              onChoose: s
            }, null, 8, ["tabs", "active"])
          ]),
          t("div", Bt, [
            m(p).readOnly ? (n(), u("p", Wt, "Only a person can change these settings. You can read every value, and ask a person for a change.")) : j("", !0),
            $(m(Oe), { value: r.value }, {
              work: S(() => [
                $(Mt)
              ]),
              agents: S(() => [
                $(wt)
              ]),
              tests: S(() => [
                $(Ct)
              ]),
              advanced: S(() => [
                $(He)
              ]),
              _: 1
            }, 8, ["value"])
          ])
        ])
      ]),
      _: 1
    }));
  }
}, Kt = /* @__PURE__ */ P(Et, [["__scopeId", "data-v-475da6b6"]]);
export {
  Kt as A
};
