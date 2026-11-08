/* @code-commandments-generated */
import { openBlock as n, createElementBlock as d, createElementVNode as t, computed as h, normalizeClass as J, toDisplayString as k, renderSlot as ke, createTextVNode as w, createCommentVNode as x, createVNode as A, unref as v, withCtx as j, reactive as oe, ref as C, watch as te, Fragment as O, renderList as q, createBlock as T, withModifiers as ye, useModel as fe, normalizeStyle as se, mergeModels as be, onMounted as he } from "vue";
import { useWindow as D, Btn as P, Switch as Z, TextInput as _e, useNow as $e, age as we, Icon as Ce, Segmented as ie, WindowRoom as Ae } from "@journal/window-kit";
import { _ as F } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const re = (l) => l.flatMap((c) => c.per_profile ? c.profiles.map((o) => ({ ...o, label: o.title, type: c.key, key: `${c.key}:${o.profile}` })) : [{ ...c, type: c.key }]), ee = (l, c) => c > 0 && l >= c, Se = { class: "step" }, Oe = ["disabled"], xe = ["value", "disabled"], Te = ["disabled"], je = {
  __name: "NumberStep",
  props: { modelValue: { type: [Number, String], default: 0 }, disabled: { type: Boolean, default: !1 } },
  emits: ["update:modelValue"],
  setup(l, { emit: c }) {
    const o = l, m = c, a = (r) => m("update:modelValue", Math.max(0, (Number(o.modelValue) || 0) + r));
    return (r, s) => (n(), d("span", Se, [
      t("button", {
        type: "button",
        disabled: l.disabled || Number(l.modelValue) <= 0,
        "aria-label": "Less",
        onClick: s[0] || (s[0] = (g) => a(-1))
      }, "−", 8, Oe),
      t("input", {
        type: "number",
        min: "0",
        value: l.modelValue,
        disabled: l.disabled,
        onInput: s[1] || (s[1] = (g) => m("update:modelValue", g.target.value))
      }, null, 40, xe),
      t("button", {
        type: "button",
        disabled: l.disabled,
        "aria-label": "More",
        onClick: s[2] || (s[2] = (g) => a(1))
      }, "+", 8, Te)
    ]));
  }
}, Ne = /* @__PURE__ */ F(je, [["__scopeId", "data-v-a7b54780"]]), Ie = { class: "ctl-text" }, Me = { class: "ctl-label" }, Ve = { class: "ctl-help" }, Be = { class: "ctl-input" }, Re = {
  key: 0,
  class: "ctl-src"
}, We = {
  __name: "SettingRow",
  props: { label: { type: String, required: !0 }, help: { type: String, default: "" }, source: { type: String, default: "" }, changed: { type: Boolean, default: !1 } },
  setup(l) {
    const c = l, o = D(), m = { environment: () => `This environment, ${o.environment}`, project: () => "Every environment", default: () => "Default" }, a = h(() => {
      var r;
      return c.changed ? "Changed, not applied" : ((r = m[c.source]) == null ? void 0 : r.call(m)) ?? "";
    });
    return (r, s) => (n(), d("div", {
      class: J(["ctl", { flat: !l.source }])
    }, [
      t("div", Ie, [
        t("span", Me, k(l.label), 1),
        t("span", Ve, k(l.help), 1)
      ]),
      t("div", Be, [
        ke(r.$slots, "default", {}, void 0, !0)
      ]),
      l.source ? (n(), d("div", Re, [
        t("span", {
          class: J(["src", { here: l.source === "environment", changed: l.changed }]),
          "data-setting-source": ""
        }, [
          s[0] || (s[0] = t("i", null, null, -1)),
          w(k(a.value), 1)
        ], 2)
      ])) : x("", !0)
    ], 2));
  }
}, Q = /* @__PURE__ */ F(We, [["__scopeId", "data-v-c011fa59"]]), Ee = { class: "foot" }, Pe = {
  __name: "SettingsFoot",
  props: { changes: { type: Number, default: 0 }, pending: { type: Boolean, default: !1 }, problem: { type: String, default: "" }, blocked: { type: Boolean, default: !1 } },
  emits: ["cancel", "apply"],
  setup(l, { emit: c }) {
    const o = l, m = c, a = D(), r = h(() => o.problem ? o.problem : o.pending ? "Applying." : o.changes ? `${o.changes} ${o.changes === 1 ? "change" : "changes"} to apply to ${a.environment}.` : `No changes. For the environment ${a.environment}.`);
    return (s, g) => (n(), d("div", Ee, [
      t("span", {
        class: J(["foot-note", { bad: l.problem, busy: l.pending }]),
        role: "status"
      }, k(r.value), 3),
      A(v(P), {
        bordered: "",
        disabled: !l.changes || l.pending,
        "data-settings-cancel": "",
        onClick: g[0] || (g[0] = (I) => m("cancel"))
      }, {
        default: j(() => [...g[2] || (g[2] = [
          w("Cancel", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      A(v(P), {
        variant: "primary",
        disabled: !l.changes || l.pending || l.blocked || v(a).readOnly,
        "data-settings-apply": "",
        onClick: g[1] || (g[1] = (I) => m("apply"))
      }, {
        default: j(() => [...g[3] || (g[3] = [
          w("Apply", -1)
        ])]),
        _: 1
      }, 8, ["disabled"])
    ]));
  }
}, ue = /* @__PURE__ */ F(Pe, [["__scopeId", "data-v-ceae936f"]]), Fe = ["data-agent-settings-group"], Ue = { class: "sw-word" }, Ke = {
  __name: "AgentSettingsGroup",
  props: { group: { type: String, required: !0 } },
  setup(l) {
    const c = l, o = D(), m = o.props.work, a = oe({}), r = C(""), s = C(""), g = C(!1), I = h(() => {
      var p;
      return (((p = m.data.value) == null ? void 0 : p.fields) ?? []).filter((f) => f.group === c.group);
    }), U = (p) => p.type === "flag" ? !!p.value : String(p.value), K = (p) => (p.type === "flag" ? a[p.key] : String(a[p.key])) !== U(p), B = h(() => I.value.filter(K)), M = h(() => B.value.length > 0), N = h(() => {
      var p;
      return M.value && r.value && ((p = m.data.value) == null ? void 0 : p.revision) !== r.value;
    }), V = (p) => p.type === "flag" ? a[p.key] ? "on" : "off" : String(a[p.key]).trim(), W = h(() => B.value.some((p) => p.type !== "flag" && V(p) === ""));
    function R() {
      var p;
      for (const f of I.value) a[f.key] = U(f);
      r.value = ((p = m.data.value) == null ? void 0 : p.revision) ?? "", s.value = "";
    }
    te(() => m.data.value, () => {
      (!r.value || !M.value) && R();
    }, { immediate: !0 });
    const E = h(() => s.value || (N.value ? "These settings changed since you opened them. Cancel to read them again." : "") || (W.value ? "A number is missing." : ""));
    async function L() {
      g.value = !0;
      const p = await o.run(`work-settings apply --revision ${r.value} ${B.value.map((f) => `${f.key}=${V(f)}`).join(" ")}`);
      g.value = !1, s.value = p.ok ? "" : p.error, await o.reload("work"), p.ok && R();
    }
    return (p, f) => (n(), d("section", {
      class: "group",
      "data-agent-settings-group": l.group
    }, [
      (n(!0), d(O, null, q(I.value, ($) => (n(), T(Q, {
        key: $.key,
        label: $.title,
        help: $.description,
        source: $.source,
        changed: K($),
        "data-control": $.key
      }, {
        default: j(() => [
          $.type === "flag" ? (n(), d(O, { key: 0 }, [
            A(v(Z), {
              on: a[$.key],
              disabled: v(o).readOnly,
              onChange: (y) => a[$.key] = !a[$.key]
            }, null, 8, ["on", "disabled", "onChange"]),
            t("span", Ue, k(a[$.key] ? "On" : "Off"), 1)
          ], 64)) : (n(), T(Ne, {
            key: 1,
            modelValue: a[$.key],
            "onUpdate:modelValue": (y) => a[$.key] = y,
            disabled: v(o).readOnly,
            "data-field": $.key
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "data-field"]))
        ]),
        _: 2
      }, 1032, ["label", "help", "source", "changed", "data-control"]))), 128)),
      A(ue, {
        changes: B.value.length,
        pending: g.value,
        problem: E.value,
        blocked: N.value || W.value,
        onCancel: R,
        onApply: L
      }, null, 8, ["changes", "pending", "problem", "blocked"])
    ], 8, Fe));
  }
}, de = /* @__PURE__ */ F(Ke, [["__scopeId", "data-v-95d26603"]]), Le = {
  __name: "AgentSettingsAdvanced",
  setup(l) {
    return (c, o) => (n(), T(de, {
      group: "advanced",
      "data-agent-settings-advanced": ""
    }));
  }
}, qe = { class: "action-buttons" }, De = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(l) {
    return (c, o) => (n(), d("form", {
      "data-agent-retire-confirm": "",
      onSubmit: o[2] || (o[2] = ye((m) => c.$emit("submit"), ["prevent"]))
    }, [
      o[5] || (o[5] = t("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      A(v(_e), {
        "model-value": l.reason,
        label: "Reason",
        disabled: l.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": o[0] || (o[0] = (m) => c.$emit("update:reason", m))
      }, null, 8, ["model-value", "disabled"]),
      t("div", qe, [
        A(v(P), {
          type: "submit",
          small: "",
          disabled: l.pending || !l.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: j(() => [...o[3] || (o[3] = [
            w("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        A(v(P), {
          small: "",
          disabled: l.pending,
          onClick: o[1] || (o[1] = (m) => c.$emit("cancel"))
        }, {
          default: j(() => [...o[4] || (o[4] = [
            w("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, He = /* @__PURE__ */ F(De, [["__scopeId", "data-v-bbe4e841"]]), ze = ["data-edit-type"], Ge = { key: 0 }, Ye = { class: "stepper" }, Je = ["disabled", "onClick"], Qe = ["value", "disabled", "data-agent-limit-input", "onChange"], Xe = ["disabled", "onClick"], Ze = { key: 0 }, et = { key: 1 }, tt = {
  __name: "AgentLimitEditor",
  props: { rows: { type: Array, required: !0 }, pending: Boolean, readOnly: Boolean, environment: { type: String, required: !0 } },
  emits: ["change"],
  setup(l, { emit: c }) {
    const o = c;
    return (m, a) => (n(), d(O, null, [
      a[0] || (a[0] = t("p", null, "How many agents of a type may run at once, and how many may be kept.", -1)),
      (n(!0), d(O, null, q(l.rows, (r) => (n(), d("div", {
        key: r.key,
        class: "edit-row",
        "data-edit-type": r.key
      }, [
        t("div", null, [
          t("strong", null, k(r.per_profile ? "Each helper type" : "Workers"), 1),
          r.per_profile ? (n(), d("small", Ge, "Researcher, Planner and the others")) : x("", !0)
        ]),
        (n(!0), d(O, null, q([{ name: "Most running", value: r.run_limit, key: r.run_setting, source: r.run_source, kind: "run" }, { name: "Most kept", value: r.kept_limit, key: r.kept_setting, source: r.kept_source, kind: "kept" }], (s) => (n(), d("label", {
          key: s.key
        }, [
          w(k(s.name), 1),
          t("span", Ye, [
            t("button", {
              type: "button",
              disabled: l.pending || l.readOnly || s.value === 0,
              onClick: (g) => o("change", r, s.key, s.value, s.value - 1)
            }, "−", 8, Je),
            t("input", {
              type: "number",
              min: "0",
              value: s.value,
              disabled: l.pending || l.readOnly,
              "data-agent-limit-input": s.kind,
              onChange: (g) => o("change", r, s.key, s.value, g.target.value)
            }, null, 40, Qe),
            t("button", {
              type: "button",
              disabled: l.pending || l.readOnly,
              onClick: (g) => o("change", r, s.key, s.value, s.value + 1)
            }, "+", 8, Xe)
          ]),
          s.value === 0 ? (n(), d("small", Ze, k(s.kind === "run" ? "None can start" : "Any number"), 1)) : s.source === `environment ${l.environment}` ? (n(), d("small", et, "Changed for " + k(l.environment), 1)) : x("", !0)
        ]))), 128))
      ], 8, ze))), 128))
    ], 64));
  }
}, nt = /* @__PURE__ */ F(tt, [["__scopeId", "data-v-f4f7965a"]]), at = { class: "counts-panel" }, st = { class: "counts" }, lt = ["data-count-agent"], ot = { class: "person-text" }, it = {
  key: 0,
  class: "helper-head"
}, rt = ["data-agent-limit-type", "data-agent-limit-profile", "onClick"], ut = {
  key: 0,
  class: "bar"
}, dt = {
  key: 5,
  role: "alert"
}, ct = {
  key: 6,
  role: "status"
}, gt = { class: "foot" }, pt = { class: "foot-note" }, vt = {
  __name: "AgentCountsPanel",
  props: {
    title: { default: "Agent counts" },
    titleModifiers: {}
  },
  emits: /* @__PURE__ */ be(["open-agent", "close"], ["update:title"]),
  setup(l, { emit: c }) {
    const o = c, m = fe(l, "title"), a = D(), r = h(() => a.props.limits.rows.value ?? []), s = h(() => a.props.limits.failure.value), g = C([]), I = C(0), U = C(!1), K = $e(), B = C(null), M = C(!1), N = C(!1), V = C(""), W = C(""), R = C(null), E = C(""), L = h(() => re(r.value)), p = h(() => r.value.find((u) => u.per_profile)), f = h(() => L.value.find((u) => u.key === B.value)), $ = h(() => g.value.filter((u) => {
      var e, i;
      return u.state !== "retired" && u.role === ((e = f.value) == null ? void 0 : e.type) && (!f.value.profile || (((i = u.facts) == null ? void 0 : i.profile) || u.profile) === f.value.profile);
    }).sort((u, e) => (u.state !== "running") - (e.state !== "running") || String(u.ended_at || u.created_at).localeCompare(String(e.ended_at || e.created_at)))), y = h(() => {
      var e;
      const u = /* @__PURE__ */ new Map();
      for (const i of $.value) {
        const b = ((e = i.facts) == null ? void 0 : e.model) || i.program_model;
        b && u.set(b, (u.get(b) || 0) + 1);
      }
      return [...u].map(([i, b]) => `${b} ${i}`).join(", ");
    }), S = (u, e) => e ? `${Math.min(u / Math.max(u, e) * 100, 100)}%` : "0%", _ = (u, e) => e && u > e ? `${(u - e) / u * 100}%` : "0%";
    te(() => {
      var u;
      return M.value ? "Change the maximums" : ((u = f.value) == null ? void 0 : u.label) || "Agent counts";
    }, (u) => {
      m.value = u;
    }, { immediate: !0 });
    async function z(u, e = 1) {
      a.state["count-agents.role"] = u.type, u.profile ? a.state["count-agents.profile"] = u.profile : delete a.state["count-agents.profile"], a.state["count-agents.page"] = String(e), await a.reload("count-agents");
      const i = a.props["count-agents"];
      g.value = e === 1 ? [...i.rows.value] : [...g.value, ...i.rows.value], I.value = e, U.value = i.more.value;
    }
    function ce(u) {
      B.value = u.key, g.value = [], z(u);
    }
    function X() {
      M.value = !1, B.value = null, R.value = null, V.value = "";
    }
    function ge() {
      X(), o("close");
    }
    async function pe(u, e, i, b) {
      if (N.value || a.readOnly) return;
      const H = Number(b);
      if (!String(b).trim() || !Number.isInteger(H) || H < 0) {
        V.value = "Use a whole number of 0 or more.";
        return;
      }
      N.value = !0, V.value = "";
      const G = await a.run(["setting", "set", e, String(H), "--environment", a.environment]);
      G.ok ? (await a.reload("limits"), W.value = "Saved.") : V.value = G.error, N.value = !1;
    }
    async function ve(u) {
      if (!E.value.trim() || N.value) return;
      N.value = !0;
      const e = await a.run(["agent", "retire", String(u.id), "--reason", E.value.trim()]);
      V.value = e.ok ? "" : "The agent could not be retired. Try again.", e.ok && (R.value = null, E.value = "", W.value = "Agent retired permanently.", await a.reload("limits"), await z(f.value)), N.value = !1;
    }
    function me(u) {
      ge(), o("open-agent", u);
    }
    return (u, e) => (n(), d("div", at, [
      t("div", st, [
        M.value || f.value ? (n(), d("button", {
          key: 0,
          class: "back",
          type: "button",
          onClick: X
        }, "‹ Back to the counts")) : x("", !0),
        s.value ? (n(), d(O, { key: 1 }, [
          e[6] || (e[6] = t("strong", null, "The counts could not be read", -1)),
          e[7] || (e[7] = t("p", null, "The journal did not answer.", -1)),
          A(v(P), {
            small: "",
            onClick: e[0] || (e[0] = (i) => v(a).reload("limits"))
          }, {
            default: j(() => [...e[5] || (e[5] = [
              w("Try again", -1)
            ])]),
            _: 1
          })
        ], 64)) : M.value ? (n(), T(nt, {
          key: 2,
          rows: r.value,
          pending: N.value,
          "read-only": v(a).readOnly,
          environment: v(a).environment,
          onChange: pe
        }, null, 8, ["rows", "pending", "read-only", "environment"])) : f.value ? (n(), d(O, { key: 3 }, [
          t("p", null, [
            t("strong", null, k(f.value.running) + " of " + k(f.value.run_limit), 1),
            e[8] || (e[8] = w(" running, ", -1)),
            t("strong", null, [
              w(k(f.value.kept), 1),
              f.value.kept_limit ? (n(), d(O, { key: 0 }, [
                w(" of " + k(f.value.kept_limit), 1)
              ], 64)) : x("", !0)
            ]),
            e[9] || (e[9] = w(" kept", -1))
          ]),
          t("p", null, k(y.value), 1),
          $.value.length ? x("", !0) : (n(), d(O, { key: 0 }, [
            e[10] || (e[10] = t("strong", null, "No agents here yet", -1)),
            e[11] || (e[11] = t("p", null, "An agent shows here as soon as one of this type starts.", -1))
          ], 64)),
          (n(!0), d(O, null, q($.value, (i) => {
            var b, H, G, ne, ae;
            return n(), d("div", {
              key: i.id,
              class: "person",
              "data-count-agent": i.id
            }, [
              t("span", {
                class: J(["dot", { running: i.state === "running" }])
              }, null, 2),
              t("div", ot, [
                t("strong", null, k(((b = i.facts) == null ? void 0 : b.given_name) || i.id), 1),
                w(" " + k(i.state === "running" ? "Running" : "Idle") + ", " + k(v(we)(i.state === "running" ? i.process_started_at || i.created_at : i.ended_at, v(K))), 1),
                t("small", null, k([i.program, (H = i.facts) == null ? void 0 : H.model, (G = i.facts) == null ? void 0 : G.effort, `${i.role} ${i.id}`].filter(Boolean).join(", ")), 1),
                t("small", null, k(((ne = i.facts) == null ? void 0 : ne.task_title) || ((ae = i.facts) == null ? void 0 : ae.helper_job)), 1)
              ]),
              A(v(P), {
                small: "",
                onClick: (Y) => me(i)
              }, {
                default: j(() => [...e[12] || (e[12] = [
                  w("Open", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              i.state === "idle" && !v(a).readOnly ? (n(), T(v(P), {
                key: 0,
                small: "",
                onClick: (Y) => {
                  R.value = i.id, E.value = "";
                }
              }, {
                default: j(() => [...e[13] || (e[13] = [
                  w("Retire", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : x("", !0),
              R.value === i.id ? (n(), T(He, {
                key: 1,
                reason: E.value,
                "onUpdate:reason": e[1] || (e[1] = (Y) => E.value = Y),
                pending: N.value,
                onSubmit: (Y) => ve(i),
                onCancel: e[2] || (e[2] = (Y) => R.value = null)
              }, null, 8, ["reason", "pending", "onSubmit"])) : x("", !0)
            ], 8, lt);
          }), 128)),
          U.value ? (n(), T(v(P), {
            key: 1,
            small: "",
            onClick: e[3] || (e[3] = (i) => z(f.value, I.value + 1))
          }, {
            default: j(() => [...e[14] || (e[14] = [
              w("Show more", -1)
            ])]),
            _: 1
          })) : x("", !0)
        ], 64)) : (n(), d(O, { key: 4 }, [
          e[16] || (e[16] = t("div", { class: "columns" }, [
            t("span", null, "Name"),
            t("span", null, "Running"),
            t("span", null, "Kept"),
            t("span")
          ], -1)),
          p.value ? (n(), d("div", it, [
            e[15] || (e[15] = t("strong", null, "Helpers", -1)),
            t("span", null, k(p.value.running) + " running, " + k(p.value.kept) + " kept", 1)
          ])) : x("", !0),
          (n(!0), d(O, null, q(L.value, (i) => (n(), d("button", {
            key: i.key,
            type: "button",
            class: "count-row",
            "data-agent-limit-type": i.type || i.key,
            "data-agent-limit-profile": i.profile,
            onClick: (b) => ce(i)
          }, [
            t("strong", null, k(i.label), 1),
            (n(!0), d(O, null, q([{ count: i.running, limit: i.run_limit, unlimited: !1 }, { count: i.kept, limit: i.kept_limit, unlimited: !0 }], (b) => (n(), d("span", {
              key: b.unlimited,
              class: J({ full: v(ee)(b.count, b.limit) })
            }, [
              t("span", null, [
                w(k(b.count), 1),
                b.limit || !b.unlimited ? (n(), d(O, { key: 0 }, [
                  w(" of " + k(b.limit), 1)
                ], 64)) : x("", !0)
              ]),
              b.limit ? (n(), d("span", ut, [
                t("span", {
                  style: se({ width: S(b.count, b.limit) })
                }, null, 4),
                t("i", {
                  style: se({ width: _(b.count, b.limit) })
                }, null, 4)
              ])) : x("", !0)
            ], 2))), 128)),
            A(v(Ce), {
              name: "chevronRight",
              size: 12
            })
          ], 8, rt))), 128))
        ], 64)),
        V.value ? (n(), d("p", dt, k(V.value), 1)) : W.value ? (n(), d("p", ct, k(W.value), 1)) : x("", !0)
      ]),
      t("div", gt, [
        M.value ? (n(), d(O, { key: 0 }, [
          t("span", pt, k(W.value || `Changes apply to ${v(a).environment}.`), 1),
          A(v(P), { onClick: X }, {
            default: j(() => [...e[17] || (e[17] = [
              w("Done", -1)
            ])]),
            _: 1
          })
        ], 64)) : f.value ? x("", !0) : (n(), T(v(P), {
          key: 1,
          disabled: v(a).readOnly,
          "data-agent-limits-edit": "",
          onClick: e[4] || (e[4] = (i) => M.value = !0)
        }, {
          default: j(() => [...e[18] || (e[18] = [
            w("Change the maximums", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]))
      ])
    ]));
  }
}, mt = /* @__PURE__ */ F(vt, [["__scopeId", "data-v-cf143060"]]), kt = {
  class: "agents",
  "data-agent-settings-agents": ""
}, yt = {
  __name: "AgentSettingsAgents",
  setup(l) {
    const c = D(), o = C("Agent counts"), m = (a) => c.open("agents.agents", a.id);
    return he(() => c.reload("limits")), (a, r) => (n(), d("section", kt, [
      A(mt, {
        title: o.value,
        "onUpdate:title": r[0] || (r[0] = (s) => o.value = s),
        onOpenAgent: m
      }, null, 8, ["title"])
    ]));
  }
}, ft = /* @__PURE__ */ F(yt, [["__scopeId", "data-v-b2fa0c3e"]]), bt = {
  __name: "AgentSettingsTests",
  setup(l) {
    return (c, o) => (n(), T(de, {
      group: "tests",
      "data-agent-settings-tests": ""
    }));
  }
}, ht = {
  class: "work",
  "data-agent-settings-work": ""
}, _t = { class: "section" }, $t = { class: "sw-word" }, wt = { class: "section" }, Ct = { class: "sw-word" }, At = {
  key: 0,
  class: "section-help warn",
  "data-work-hint": ""
}, le = "journal.suites.coding.auto-mode", St = "journal.suites.coding.workers.main-dispatches-workers", Ot = {
  __name: "AgentSettingsWork",
  setup(l) {
    const c = [
      { key: "journal.suites.coding.auto-mode", label: "Auto mode", line: "The journal hands the main agent its next task, and it keeps going while tasks are left" },
      { key: "journal.suites.coding.main-writes-code", label: "Main agent writes code", line: "The main agent may change project files itself; off, it plans, delegates and merges" },
      { key: "journal.suites.coding.workers.main-dispatches-workers", label: "Main agent sends workers", line: "Whether the main agent may send workers to do tasks." },
      { key: "journal.suites.coding.continue-while-delegatable", label: "Keep going while work can be delegated", line: "Keep the main agent working while open tasks can still be sent to workers." },
      { key: "journal.suites.coding.workers.merger-on", label: "Merger takes in workers", line: "A helper merges workers whose tests passed, and passes on what the main agent must judge." },
      { key: "journal.suites.coding.main-starts-helpers", label: "Use ordinary helpers", line: "Whether the main agent may start ordinary helpers." },
      { key: "journal.suites.coding.designer-enabled", label: "Use a designer", line: "Whether the main agent may start a designer, which writes a design document and changes no code." },
      { key: "journal.suites.coding.workers.main-agent-may-merge", label: "Main agent may merge workers", line: "Whether the main agent may merge the work of a worker itself." }
    ], o = [{ key: "builder", label: "Builder" }, { key: "orchestrator", label: "Orchestrator" }], m = [le], a = D(), r = a.props.work, s = oe({}), g = C(""), I = C(""), U = C(!1), K = h(() => c.filter((y) => {
      var S, _;
      return s[y.key] !== ((_ = (S = r.data.value) == null ? void 0 : S.controls) == null ? void 0 : _[y.key]);
    })), B = h(() => K.value.length > 0), M = h(() => B.value && r.data.value && g.value && r.data.value.revision !== g.value), N = h(() => {
      var y;
      return ((y = r.data.value) == null ? void 0 : y.workflow) ?? "";
    }), V = h(() => c.filter((y) => m.includes(y.key))), W = h(() => c.filter((y) => !m.includes(y.key))), R = h(() => I.value || (M.value ? "These settings changed since you opened them. Cancel to read them again." : "")), E = h(() => s[le] === !1 && s[St] === !1);
    function L() {
      const y = r.data.value;
      if (y) {
        for (const S of c) s[S.key] = y.controls[S.key];
        g.value = y.revision, I.value = "";
      }
    }
    te(() => r.data.value, () => {
      (!g.value || !B.value) && L();
    }, { immediate: !0 });
    async function p(y) {
      U.value = !0;
      const S = await a.run(y);
      U.value = !1, S.ok ? (await a.reload("work"), L()) : (I.value = S.error, await a.reload("work"));
    }
    const f = () => p(`work-settings apply --revision ${g.value} ${K.value.map((y) => `${y.key}=${s[y.key] ? "on" : "off"}`).join(" ")}`), $ = (y) => p(`work-settings preset ${y} --revision ${g.value}`);
    return (y, S) => (n(), d("section", ht, [
      t("div", _t, [
        S[0] || (S[0] = t("p", { class: "section-title" }, "Taking on work", -1)),
        A(Q, {
          label: "Workflow",
          help: "A preset sets the switches below at once; Custom is any other mix.",
          "data-work-flow": ""
        }, {
          default: j(() => [
            A(v(ie), {
              options: o,
              value: N.value,
              onPick: $
            }, null, 8, ["value"])
          ]),
          _: 1
        }),
        (n(!0), d(O, null, q(V.value, (_) => (n(), T(Q, {
          key: _.key,
          label: _.label,
          help: _.line,
          "data-control": _.key
        }, {
          default: j(() => [
            A(v(Z), {
              on: s[_.key],
              disabled: v(a).readOnly,
              onChange: (z) => s[_.key] = !s[_.key]
            }, null, 8, ["on", "disabled", "onChange"]),
            t("span", $t, k(s[_.key] ? "On" : "Off"), 1)
          ]),
          _: 2
        }, 1032, ["label", "help", "data-control"]))), 128))
      ]),
      t("div", wt, [
        S[1] || (S[1] = t("p", { class: "section-title" }, "How the main agent works", -1)),
        S[2] || (S[2] = t("p", { class: "section-help" }, "Your models, maximums and tests stay as you set them.", -1)),
        (n(!0), d(O, null, q(W.value, (_) => (n(), T(Q, {
          key: _.key,
          label: _.label,
          help: _.line,
          "data-control": _.key
        }, {
          default: j(() => [
            A(v(Z), {
              on: s[_.key],
              disabled: v(a).readOnly,
              onChange: (z) => s[_.key] = !s[_.key]
            }, null, 8, ["on", "disabled", "onChange"]),
            t("span", Ct, k(s[_.key] ? "On" : "Off"), 1)
          ]),
          _: 2
        }, 1032, ["label", "help", "data-control"]))), 128)),
        E.value ? (n(), d("p", At, "With Auto off and no workers, nothing starts the work: a person starts tasks or turns one of them on.")) : x("", !0)
      ]),
      A(ue, {
        changes: K.value.length,
        pending: U.value,
        problem: R.value,
        blocked: M.value,
        onCancel: L,
        onApply: f
      }, null, 8, ["changes", "pending", "problem", "blocked"])
    ]));
  }
}, xt = /* @__PURE__ */ F(Ot, [["__scopeId", "data-v-c12bef8d"]]), Tt = {
  class: "settings",
  "data-agent-settings": ""
}, jt = { class: "settings-bar" }, Nt = { class: "settings-body" }, It = {
  key: 0,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, Mt = {
  __name: "AgentSettings",
  setup(l) {
    const c = D(), o = C("work"), m = h(() => {
      var s;
      return re(((s = c.props.limits) == null ? void 0 : s.rows.value) ?? []).filter((g) => ee(g.running, g.run_limit) || ee(g.kept, g.kept_limit)).length;
    }), a = h(() => [{ key: "work", label: "Work" }, { key: "agents", label: m.value ? `Agents ${m.value}` : "Agents" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }]);
    function r(s) {
      o.value = s, c.state.tab = s === "agents" ? "agents" : "";
    }
    return (s, g) => (n(), T(v(Ae), { padding: "0" }, {
      default: j(() => [
        t("div", Tt, [
          t("div", jt, [
            A(v(ie), {
              options: a.value,
              value: o.value,
              onPick: r
            }, null, 8, ["options", "value"])
          ]),
          t("div", Nt, [
            v(c).readOnly ? (n(), d("p", It, "Only a person can change these settings. You can read every value, and ask a person for a change.")) : x("", !0),
            o.value === "work" ? (n(), T(xt, { key: 1 })) : o.value === "agents" ? (n(), T(ft, { key: 2 })) : o.value === "tests" ? (n(), T(bt, { key: 3 })) : (n(), T(Le, { key: 4 }))
          ])
        ])
      ]),
      _: 1
    }));
  }
}, Wt = /* @__PURE__ */ F(Mt, [["__scopeId", "data-v-05cfef70"]]);
export {
  Wt as A
};
