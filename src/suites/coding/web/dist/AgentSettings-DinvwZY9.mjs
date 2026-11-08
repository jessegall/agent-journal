/* @code-commandments-generated */
import { openBlock as a, createElementBlock as d, createElementVNode as n, computed as b, normalizeClass as Q, toDisplayString as y, renderSlot as ke, createTextVNode as C, createCommentVNode as x, createVNode as S, unref as v, withCtx as j, reactive as ie, ref as A, watch as ne, Fragment as O, renderList as L, createBlock as T, withModifiers as ye, useModel as fe, normalizeStyle as le, mergeModels as be, onMounted as he } from "vue";
import { useWindow as q, Btn as P, Switch as ee, TextInput as _e, useNow as $e, age as we, Icon as Ce, Segmented as re, WindowRoom as Ae } from "@journal/window-kit";
import { _ as F } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const ue = (l) => l.flatMap((c) => c.per_profile ? c.profiles.map((o) => ({ ...o, label: o.title, type: c.key, key: `${c.key}:${o.profile}` })) : [{ ...c, type: c.key }]), te = (l, c) => c > 0 && l >= c, Se = { class: "step" }, Oe = ["disabled"], xe = ["value", "disabled"], Te = ["disabled"], je = {
  __name: "NumberStep",
  props: { modelValue: { type: [Number, String], default: 0 }, disabled: { type: Boolean, default: !1 } },
  emits: ["update:modelValue"],
  setup(l, { emit: c }) {
    const o = l, k = c, s = (r) => k("update:modelValue", Math.max(0, (Number(o.modelValue) || 0) + r));
    return (r, t) => (a(), d("span", Se, [
      n("button", {
        type: "button",
        disabled: l.disabled || Number(l.modelValue) <= 0,
        "aria-label": "Less",
        onClick: t[0] || (t[0] = (g) => s(-1))
      }, "−", 8, Oe),
      n("input", {
        type: "number",
        min: "0",
        value: l.modelValue,
        disabled: l.disabled,
        onInput: t[1] || (t[1] = (g) => k("update:modelValue", g.target.value))
      }, null, 40, xe),
      n("button", {
        type: "button",
        disabled: l.disabled,
        "aria-label": "More",
        onClick: t[2] || (t[2] = (g) => s(1))
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
    const c = l, o = q(), k = { environment: () => `This environment, ${o.environment}`, project: () => "Every environment", default: () => "Default" }, s = b(() => {
      var r;
      return c.changed ? "Changed, not applied" : ((r = k[c.source]) == null ? void 0 : r.call(k)) ?? "";
    });
    return (r, t) => (a(), d("div", {
      class: Q(["ctl", { flat: !l.source }])
    }, [
      n("div", Ie, [
        n("span", Me, y(l.label), 1),
        n("span", Ve, y(l.help), 1)
      ]),
      n("div", Be, [
        ke(r.$slots, "default", {}, void 0, !0)
      ]),
      l.source ? (a(), d("div", Re, [
        n("span", {
          class: Q(["src", { here: l.source === "environment", changed: l.changed }]),
          "data-setting-source": ""
        }, [
          t[0] || (t[0] = n("i", null, null, -1)),
          C(y(s.value), 1)
        ], 2)
      ])) : x("", !0)
    ], 2));
  }
}, X = /* @__PURE__ */ F(We, [["__scopeId", "data-v-c011fa59"]]), Ee = { class: "foot" }, Pe = {
  __name: "SettingsFoot",
  props: { changes: { type: Number, default: 0 }, pending: { type: Boolean, default: !1 }, problem: { type: String, default: "" }, blocked: { type: Boolean, default: !1 } },
  emits: ["cancel", "apply"],
  setup(l, { emit: c }) {
    const o = l, k = c, s = q(), r = b(() => o.problem ? o.problem : o.pending ? "Applying." : o.changes ? `${o.changes} ${o.changes === 1 ? "change" : "changes"} to apply to ${s.environment}.` : `No changes. For the environment ${s.environment}.`);
    return (t, g) => (a(), d("div", Ee, [
      n("span", {
        class: Q(["foot-note", { bad: l.problem, busy: l.pending }]),
        role: "status"
      }, y(r.value), 3),
      S(v(P), {
        bordered: "",
        disabled: !l.changes || l.pending,
        "data-settings-cancel": "",
        onClick: g[0] || (g[0] = (I) => k("cancel"))
      }, {
        default: j(() => [...g[2] || (g[2] = [
          C("Cancel", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      S(v(P), {
        variant: "primary",
        disabled: !l.changes || l.pending || l.blocked || v(s).readOnly,
        "data-settings-apply": "",
        onClick: g[1] || (g[1] = (I) => k("apply"))
      }, {
        default: j(() => [...g[3] || (g[3] = [
          C("Apply", -1)
        ])]),
        _: 1
      }, 8, ["disabled"])
    ]));
  }
}, de = /* @__PURE__ */ F(Pe, [["__scopeId", "data-v-ceae936f"]]), Fe = ["data-agent-settings-group"], Ue = { class: "sw-word" }, Ke = {
  __name: "AgentSettingsGroup",
  props: { group: { type: String, required: !0 } },
  setup(l) {
    const c = l, o = q(), k = o.props.work, s = ie({}), r = A(""), t = A(""), g = A(!1), I = b(() => {
      var p;
      return (((p = k.data.value) == null ? void 0 : p.fields) ?? []).filter((f) => f.group === c.group);
    }), U = (p) => p.type === "flag" ? !!p.value : String(p.value), K = (p) => (p.type === "flag" ? s[p.key] : String(s[p.key])) !== U(p), B = b(() => I.value.filter(K)), M = b(() => B.value.length > 0), N = b(() => {
      var p;
      return M.value && r.value && ((p = k.data.value) == null ? void 0 : p.revision) !== r.value;
    }), V = (p) => p.type === "flag" ? s[p.key] ? "on" : "off" : String(s[p.key]).trim(), R = b(() => B.value.some((p) => p.type !== "flag" && V(p) === ""));
    function W() {
      var p;
      for (const f of I.value) s[f.key] = U(f);
      r.value = ((p = k.data.value) == null ? void 0 : p.revision) ?? "", t.value = "";
    }
    ne(() => k.data.value, () => {
      (!r.value || !M.value) && W();
    }, { immediate: !0 });
    const E = b(() => t.value || (N.value ? "These settings changed since you opened them. Cancel to read them again." : "") || (R.value ? "A number is missing." : ""));
    async function D() {
      g.value = !0;
      const p = await o.run(`work-settings apply --revision ${r.value} ${B.value.map((f) => `${f.key}=${V(f)}`).join(" ")}`);
      g.value = !1, t.value = p.ok ? "" : p.error, await o.reload("work"), p.ok && W();
    }
    return (p, f) => (a(), d("section", {
      class: "group",
      "data-agent-settings-group": l.group
    }, [
      (a(!0), d(O, null, L(I.value, ($) => (a(), T(X, {
        key: $.key,
        label: $.title,
        help: $.description,
        source: $.source,
        changed: K($),
        "data-control": $.key
      }, {
        default: j(() => [
          $.type === "flag" ? (a(), d(O, { key: 0 }, [
            S(v(ee), {
              on: s[$.key],
              disabled: v(o).readOnly,
              onChange: (H) => s[$.key] = !s[$.key]
            }, null, 8, ["on", "disabled", "onChange"]),
            n("span", Ue, y(s[$.key] ? "On" : "Off"), 1)
          ], 64)) : (a(), T(Ne, {
            key: 1,
            modelValue: s[$.key],
            "onUpdate:modelValue": (H) => s[$.key] = H,
            disabled: v(o).readOnly,
            "data-field": $.key
          }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "data-field"]))
        ]),
        _: 2
      }, 1032, ["label", "help", "source", "changed", "data-control"]))), 128)),
      S(de, {
        changes: B.value.length,
        pending: g.value,
        problem: E.value,
        blocked: N.value || R.value,
        onCancel: W,
        onApply: D
      }, null, 8, ["changes", "pending", "problem", "blocked"])
    ], 8, Fe));
  }
}, ce = /* @__PURE__ */ F(Ke, [["__scopeId", "data-v-95d26603"]]), Le = {
  __name: "AgentSettingsAdvanced",
  setup(l) {
    return (c, o) => (a(), T(ce, {
      group: "advanced",
      "data-agent-settings-advanced": ""
    }));
  }
}, qe = { class: "action-buttons" }, De = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(l) {
    return (c, o) => (a(), d("form", {
      "data-agent-retire-confirm": "",
      onSubmit: o[2] || (o[2] = ye((k) => c.$emit("submit"), ["prevent"]))
    }, [
      o[5] || (o[5] = n("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      S(v(_e), {
        "model-value": l.reason,
        label: "Reason",
        disabled: l.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": o[0] || (o[0] = (k) => c.$emit("update:reason", k))
      }, null, 8, ["model-value", "disabled"]),
      n("div", qe, [
        S(v(P), {
          type: "submit",
          small: "",
          disabled: l.pending || !l.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: j(() => [...o[3] || (o[3] = [
            C("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        S(v(P), {
          small: "",
          disabled: l.pending,
          onClick: o[1] || (o[1] = (k) => c.$emit("cancel"))
        }, {
          default: j(() => [...o[4] || (o[4] = [
            C("Cancel", -1)
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
    return (k, s) => (a(), d(O, null, [
      s[0] || (s[0] = n("p", null, "How many agents of a type may run at once, and how many may be kept.", -1)),
      (a(!0), d(O, null, L(l.rows, (r) => (a(), d("div", {
        key: r.key,
        class: "edit-row",
        "data-edit-type": r.key
      }, [
        n("div", null, [
          n("strong", null, y(r.per_profile ? "Each helper type" : "Workers"), 1),
          r.per_profile ? (a(), d("small", Ge, "Researcher, Planner and the others")) : x("", !0)
        ]),
        (a(!0), d(O, null, L([{ name: "Most running", value: r.run_limit, key: r.run_setting, source: r.run_source, kind: "run" }, { name: "Most kept", value: r.kept_limit, key: r.kept_setting, source: r.kept_source, kind: "kept" }], (t) => (a(), d("label", {
          key: t.key
        }, [
          C(y(t.name), 1),
          n("span", Ye, [
            n("button", {
              type: "button",
              disabled: l.pending || l.readOnly || t.value === 0,
              onClick: (g) => o("change", r, t.key, t.value, t.value - 1)
            }, "−", 8, Je),
            n("input", {
              type: "number",
              min: "0",
              value: t.value,
              disabled: l.pending || l.readOnly,
              "data-agent-limit-input": t.kind,
              onChange: (g) => o("change", r, t.key, t.value, g.target.value)
            }, null, 40, Qe),
            n("button", {
              type: "button",
              disabled: l.pending || l.readOnly,
              onClick: (g) => o("change", r, t.key, t.value, t.value + 1)
            }, "+", 8, Xe)
          ]),
          t.value === 0 ? (a(), d("small", Ze, y(t.kind === "run" ? "None can start" : "Any number"), 1)) : t.source === `environment ${l.environment}` ? (a(), d("small", et, "Changed for " + y(l.environment), 1)) : x("", !0)
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
    const o = c, k = fe(l, "title"), s = q(), r = b(() => s.props.limits.rows.value ?? []), t = b(() => s.props.limits.failure.value), g = A([]), I = A(0), U = A(!1), K = $e(), B = A(null), M = A(!1), N = A(!1), V = A(""), R = A(""), W = A(null), E = A(""), D = b(() => ue(r.value)), p = b(() => r.value.find((u) => u.per_profile)), f = b(() => D.value.find((u) => u.key === B.value)), $ = b(() => g.value.filter((u) => {
      var e, i;
      return u.state !== "retired" && u.role === ((e = f.value) == null ? void 0 : e.type) && (!f.value.profile || (((i = u.facts) == null ? void 0 : i.profile) || u.profile) === f.value.profile);
    }).sort((u, e) => (u.state !== "running") - (e.state !== "running") || String(u.ended_at || u.created_at).localeCompare(String(e.ended_at || e.created_at)))), H = b(() => {
      var e;
      const u = /* @__PURE__ */ new Map();
      for (const i of $.value) {
        const h = ((e = i.facts) == null ? void 0 : e.model) || i.program_model;
        h && u.set(h, (u.get(h) || 0) + 1);
      }
      return [...u].map(([i, h]) => `${h} ${i}`).join(", ");
    }), Z = (u, e) => e ? `${Math.min(u / Math.max(u, e) * 100, 100)}%` : "0%", m = (u, e) => e && u > e ? `${(u - e) / u * 100}%` : "0%";
    ne(() => {
      var u;
      return M.value ? "Change the maximums" : ((u = f.value) == null ? void 0 : u.label) || "Agent counts";
    }, (u) => {
      k.value = u;
    }, { immediate: !0 });
    async function w(u, e = 1) {
      s.state["count-agents.role"] = u.type, u.profile ? s.state["count-agents.profile"] = u.profile : delete s.state["count-agents.profile"], s.state["count-agents.page"] = String(e), await s.reload("count-agents");
      const i = s.props["count-agents"];
      g.value = e === 1 ? [...i.rows.value] : [...g.value, ...i.rows.value], I.value = e, U.value = i.more.value;
    }
    function _(u) {
      B.value = u.key, g.value = [], w(u);
    }
    function G() {
      M.value = !1, B.value = null, W.value = null, V.value = "";
    }
    function ge() {
      G(), o("close");
    }
    async function pe(u, e, i, h) {
      if (N.value || s.readOnly) return;
      const z = Number(h);
      if (!String(h).trim() || !Number.isInteger(z) || z < 0) {
        V.value = "Use a whole number of 0 or more.";
        return;
      }
      N.value = !0, V.value = "";
      const Y = await s.run(["setting", "set", e, String(z), "--environment", s.environment]);
      Y.ok ? (await s.reload("limits"), R.value = "Saved.") : V.value = Y.error, N.value = !1;
    }
    async function ve(u) {
      if (!E.value.trim() || N.value) return;
      N.value = !0;
      const e = await s.run(["agent", "retire", String(u.id), "--reason", E.value.trim()]);
      V.value = e.ok ? "" : "The agent could not be retired. Try again.", e.ok && (W.value = null, E.value = "", R.value = "Agent retired permanently.", await s.reload("limits"), await w(f.value)), N.value = !1;
    }
    function me(u) {
      ge(), o("open-agent", u);
    }
    return (u, e) => (a(), d("div", at, [
      n("div", st, [
        M.value || f.value ? (a(), d("button", {
          key: 0,
          class: "back",
          type: "button",
          onClick: G
        }, "‹ Back to the counts")) : x("", !0),
        t.value ? (a(), d(O, { key: 1 }, [
          e[6] || (e[6] = n("strong", null, "The counts could not be read", -1)),
          e[7] || (e[7] = n("p", null, "The journal did not answer.", -1)),
          S(v(P), {
            small: "",
            onClick: e[0] || (e[0] = (i) => v(s).reload("limits"))
          }, {
            default: j(() => [...e[5] || (e[5] = [
              C("Try again", -1)
            ])]),
            _: 1
          })
        ], 64)) : M.value ? (a(), T(nt, {
          key: 2,
          rows: r.value,
          pending: N.value,
          "read-only": v(s).readOnly,
          environment: v(s).environment,
          onChange: pe
        }, null, 8, ["rows", "pending", "read-only", "environment"])) : f.value ? (a(), d(O, { key: 3 }, [
          n("p", null, [
            n("strong", null, y(f.value.running) + " of " + y(f.value.run_limit), 1),
            e[8] || (e[8] = C(" running, ", -1)),
            n("strong", null, [
              C(y(f.value.kept), 1),
              f.value.kept_limit ? (a(), d(O, { key: 0 }, [
                C(" of " + y(f.value.kept_limit), 1)
              ], 64)) : x("", !0)
            ]),
            e[9] || (e[9] = C(" kept", -1))
          ]),
          n("p", null, y(H.value), 1),
          $.value.length ? x("", !0) : (a(), d(O, { key: 0 }, [
            e[10] || (e[10] = n("strong", null, "No agents here yet", -1)),
            e[11] || (e[11] = n("p", null, "An agent shows here as soon as one of this type starts.", -1))
          ], 64)),
          (a(!0), d(O, null, L($.value, (i) => {
            var h, z, Y, ae, se;
            return a(), d("div", {
              key: i.id,
              class: "person",
              "data-count-agent": i.id
            }, [
              n("span", {
                class: Q(["dot", { running: i.state === "running" }])
              }, null, 2),
              n("div", ot, [
                n("strong", null, y(((h = i.facts) == null ? void 0 : h.given_name) || i.id), 1),
                C(" " + y(i.state === "running" ? "Running" : "Idle") + ", " + y(v(we)(i.state === "running" ? i.process_started_at || i.created_at : i.ended_at, v(K))), 1),
                n("small", null, y([i.program, (z = i.facts) == null ? void 0 : z.model, (Y = i.facts) == null ? void 0 : Y.effort, `${i.role} ${i.id}`].filter(Boolean).join(", ")), 1),
                n("small", null, y(((ae = i.facts) == null ? void 0 : ae.task_title) || ((se = i.facts) == null ? void 0 : se.helper_job)), 1)
              ]),
              S(v(P), {
                small: "",
                onClick: (J) => me(i)
              }, {
                default: j(() => [...e[12] || (e[12] = [
                  C("Open", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              i.state === "idle" && !v(s).readOnly ? (a(), T(v(P), {
                key: 0,
                small: "",
                onClick: (J) => {
                  W.value = i.id, E.value = "";
                }
              }, {
                default: j(() => [...e[13] || (e[13] = [
                  C("Retire", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : x("", !0),
              W.value === i.id ? (a(), T(He, {
                key: 1,
                reason: E.value,
                "onUpdate:reason": e[1] || (e[1] = (J) => E.value = J),
                pending: N.value,
                onSubmit: (J) => ve(i),
                onCancel: e[2] || (e[2] = (J) => W.value = null)
              }, null, 8, ["reason", "pending", "onSubmit"])) : x("", !0)
            ], 8, lt);
          }), 128)),
          U.value ? (a(), T(v(P), {
            key: 1,
            small: "",
            onClick: e[3] || (e[3] = (i) => w(f.value, I.value + 1))
          }, {
            default: j(() => [...e[14] || (e[14] = [
              C("Show more", -1)
            ])]),
            _: 1
          })) : x("", !0)
        ], 64)) : (a(), d(O, { key: 4 }, [
          e[16] || (e[16] = n("div", { class: "columns" }, [
            n("span", null, "Name"),
            n("span", null, "Running"),
            n("span", null, "Kept"),
            n("span")
          ], -1)),
          p.value ? (a(), d("div", it, [
            e[15] || (e[15] = n("strong", null, "Helpers", -1)),
            n("span", null, y(p.value.running) + " running, " + y(p.value.kept) + " kept", 1)
          ])) : x("", !0),
          (a(!0), d(O, null, L(D.value, (i) => (a(), d("button", {
            key: i.key,
            type: "button",
            class: "count-row",
            "data-agent-limit-type": i.type || i.key,
            "data-agent-limit-profile": i.profile,
            onClick: (h) => _(i)
          }, [
            n("strong", null, y(i.label), 1),
            (a(!0), d(O, null, L([{ count: i.running, limit: i.run_limit, unlimited: !1 }, { count: i.kept, limit: i.kept_limit, unlimited: !0 }], (h) => (a(), d("span", {
              key: h.unlimited,
              class: Q({ full: v(te)(h.count, h.limit) })
            }, [
              n("span", null, [
                C(y(h.count), 1),
                h.limit || !h.unlimited ? (a(), d(O, { key: 0 }, [
                  C(" of " + y(h.limit), 1)
                ], 64)) : x("", !0)
              ]),
              h.limit ? (a(), d("span", ut, [
                n("span", {
                  style: le({ width: Z(h.count, h.limit) })
                }, null, 4),
                n("i", {
                  style: le({ width: m(h.count, h.limit) })
                }, null, 4)
              ])) : x("", !0)
            ], 2))), 128)),
            S(v(Ce), {
              name: "chevronRight",
              size: 12
            })
          ], 8, rt))), 128))
        ], 64)),
        V.value ? (a(), d("p", dt, y(V.value), 1)) : R.value ? (a(), d("p", ct, y(R.value), 1)) : x("", !0)
      ]),
      n("div", gt, [
        M.value ? (a(), d(O, { key: 0 }, [
          n("span", pt, y(R.value || `Changes apply to ${v(s).environment}.`), 1),
          S(v(P), { onClick: G }, {
            default: j(() => [...e[17] || (e[17] = [
              C("Done", -1)
            ])]),
            _: 1
          })
        ], 64)) : f.value ? x("", !0) : (a(), T(v(P), {
          key: 1,
          disabled: v(s).readOnly,
          "data-agent-limits-edit": "",
          onClick: e[4] || (e[4] = (i) => M.value = !0)
        }, {
          default: j(() => [...e[18] || (e[18] = [
            C("Change the maximums", -1)
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
    const c = q(), o = A("Agent counts"), k = (s) => c.open("agents.agents", s.id);
    return he(() => c.reload("limits")), (s, r) => (a(), d("section", kt, [
      S(mt, {
        title: o.value,
        "onUpdate:title": r[0] || (r[0] = (t) => o.value = t),
        onOpenAgent: k
      }, null, 8, ["title"])
    ]));
  }
}, ft = /* @__PURE__ */ F(yt, [["__scopeId", "data-v-b2fa0c3e"]]), bt = {
  __name: "AgentSettingsTests",
  setup(l) {
    return (c, o) => (a(), T(ce, {
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
}, oe = "journal.suites.coding.auto-mode", St = "journal.suites.coding.workers.main-dispatches-workers", Ot = {
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
    ], o = [{ key: "builder", label: "Builder" }, { key: "orchestrator", label: "Orchestrator" }], k = [oe], s = q(), r = s.props.work, t = ie({}), g = A(""), I = A(""), U = A(!1), K = b(() => c.filter((m) => {
      var w, _;
      return t[m.key] !== ((_ = (w = r.data.value) == null ? void 0 : w.controls) == null ? void 0 : _[m.key]);
    })), B = b(() => K.value.length > 0), M = b(() => B.value && r.data.value && g.value && r.data.value.revision !== g.value), N = b(() => {
      var m;
      return ((m = r.data.value) == null ? void 0 : m.workflow) ?? "";
    }), V = b(() => {
      var m;
      return ((m = r.data.value) == null ? void 0 : m.depends) ?? {};
    }), R = (m) => (V.value[m.key] ?? []).every((w) => t[w] !== !1), W = b(() => c.filter((m) => k.includes(m.key) && R(m))), E = b(() => c.filter((m) => !k.includes(m.key) && R(m))), D = b(() => I.value || (M.value ? "These settings changed since you opened them. Cancel to read them again." : "")), p = b(() => t[oe] === !1 && t[St] === !1);
    function f() {
      const m = r.data.value;
      if (m) {
        for (const w of c) t[w.key] = m.controls[w.key];
        g.value = m.revision, I.value = "";
      }
    }
    ne(() => r.data.value, () => {
      (!g.value || !B.value) && f();
    }, { immediate: !0 });
    async function $(m) {
      U.value = !0;
      const w = await s.run(m);
      U.value = !1, w.ok ? (await s.reload("work"), f()) : (I.value = w.error, await s.reload("work"));
    }
    const H = () => $(`work-settings apply --revision ${g.value} ${K.value.map((m) => `${m.key}=${t[m.key] ? "on" : "off"}`).join(" ")}`), Z = (m) => $(`work-settings preset ${m} --revision ${g.value}`);
    return (m, w) => (a(), d("section", ht, [
      n("div", _t, [
        w[0] || (w[0] = n("p", { class: "section-title" }, "Taking on work", -1)),
        S(X, {
          label: "Workflow",
          help: "A preset sets the switches below at once; Custom is any other mix.",
          "data-work-flow": ""
        }, {
          default: j(() => [
            S(v(re), {
              options: o,
              value: N.value,
              onPick: Z
            }, null, 8, ["value"])
          ]),
          _: 1
        }),
        (a(!0), d(O, null, L(W.value, (_) => (a(), T(X, {
          key: _.key,
          label: _.label,
          help: _.line,
          "data-control": _.key
        }, {
          default: j(() => [
            S(v(ee), {
              on: t[_.key],
              disabled: v(s).readOnly,
              onChange: (G) => t[_.key] = !t[_.key]
            }, null, 8, ["on", "disabled", "onChange"]),
            n("span", $t, y(t[_.key] ? "On" : "Off"), 1)
          ]),
          _: 2
        }, 1032, ["label", "help", "data-control"]))), 128))
      ]),
      n("div", wt, [
        w[1] || (w[1] = n("p", { class: "section-title" }, "How the main agent works", -1)),
        w[2] || (w[2] = n("p", { class: "section-help" }, "Your models, maximums and tests stay as you set them.", -1)),
        (a(!0), d(O, null, L(E.value, (_) => (a(), T(X, {
          key: _.key,
          label: _.label,
          help: _.line,
          "data-control": _.key
        }, {
          default: j(() => [
            S(v(ee), {
              on: t[_.key],
              disabled: v(s).readOnly,
              onChange: (G) => t[_.key] = !t[_.key]
            }, null, 8, ["on", "disabled", "onChange"]),
            n("span", Ct, y(t[_.key] ? "On" : "Off"), 1)
          ]),
          _: 2
        }, 1032, ["label", "help", "data-control"]))), 128)),
        p.value ? (a(), d("p", At, "With Auto off and no workers, nothing starts the work: a person starts tasks or turns one of them on.")) : x("", !0)
      ]),
      S(de, {
        changes: K.value.length,
        pending: U.value,
        problem: D.value,
        blocked: M.value,
        onCancel: f,
        onApply: H
      }, null, 8, ["changes", "pending", "problem", "blocked"])
    ]));
  }
}, xt = /* @__PURE__ */ F(Ot, [["__scopeId", "data-v-65899621"]]), Tt = {
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
    const c = q(), o = A("work"), k = b(() => {
      var t;
      return ue(((t = c.props.limits) == null ? void 0 : t.rows.value) ?? []).filter((g) => te(g.running, g.run_limit) || te(g.kept, g.kept_limit)).length;
    }), s = b(() => [{ key: "work", label: "Work" }, { key: "agents", label: k.value ? `Agents ${k.value}` : "Agents" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }]);
    function r(t) {
      o.value = t, c.state.tab = t === "agents" ? "agents" : "";
    }
    return (t, g) => (a(), T(v(Ae), { padding: "0" }, {
      default: j(() => [
        n("div", Tt, [
          n("div", jt, [
            S(v(re), {
              options: s.value,
              value: o.value,
              onPick: r
            }, null, 8, ["options", "value"])
          ]),
          n("div", Nt, [
            v(c).readOnly ? (a(), d("p", It, "Only a person can change these settings. You can read every value, and ask a person for a change.")) : x("", !0),
            o.value === "work" ? (a(), T(xt, { key: 1 })) : o.value === "agents" ? (a(), T(ft, { key: 2 })) : o.value === "tests" ? (a(), T(bt, { key: 3 })) : (a(), T(Le, { key: 4 }))
          ])
        ])
      ]),
      _: 1
    }));
  }
}, Wt = /* @__PURE__ */ F(Mt, [["__scopeId", "data-v-868efd17"]]);
export {
  Wt as A
};
