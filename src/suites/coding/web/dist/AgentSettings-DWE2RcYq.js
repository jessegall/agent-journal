import { openBlock as n, createElementBlock as u, createElementVNode as s, computed as h, normalizeClass as X, toDisplayString as f, renderSlot as ke, createTextVNode as C, createCommentVNode as x, createVNode as _, unref as m, withCtx as S, reactive as ie, ref as O, watch as ee, Fragment as T, renderList as K, createBlock as B, withModifiers as ye, useModel as fe, normalizeStyle as se, mergeModels as be, onMounted as he } from "vue";
import { useWindow as G, Btn as P, Switch as re, TextInput as $e, useNow as _e, age as we, Icon as Ce, Segmented as Se, WindowRoom as Ae, InnerTabs as Oe, TabBody as Te, SwitchCase as xe } from "@journal/window-kit";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const ue = (t) => t.flatMap((c) => c.per_profile ? c.profiles.map((i) => ({ ...i, label: i.title, type: c.key, key: `${c.key}:${i.profile}` })) : [{ ...c, type: c.key }]), Z = (t, c) => c > 0 && t >= c, je = { class: "step" }, Ne = ["disabled"], Ie = ["value", "disabled"], Be = ["disabled"], Re = {
  __name: "NumberStep",
  props: { modelValue: { type: [Number, String], default: 0 }, disabled: { type: Boolean, default: !1 } },
  emits: ["update:modelValue"],
  setup(t, { emit: c }) {
    const i = t, k = c, o = (a) => k("update:modelValue", Math.max(0, (Number(i.modelValue) || 0) + a));
    return (a, l) => (n(), u("span", je, [
      s("button", {
        type: "button",
        disabled: t.disabled || Number(t.modelValue) <= 0,
        "aria-label": "Less",
        onClick: l[0] || (l[0] = (g) => o(-1))
      }, "−", 8, Ne),
      s("input", {
        type: "number",
        min: "0",
        value: t.modelValue,
        disabled: t.disabled,
        onInput: l[1] || (l[1] = (g) => k("update:modelValue", g.target.value))
      }, null, 40, Ie),
      s("button", {
        type: "button",
        disabled: t.disabled,
        "aria-label": "More",
        onClick: l[2] || (l[2] = (g) => o(1))
      }, "+", 8, Be)
    ]));
  }
}, Me = /* @__PURE__ */ E(Re, [["__scopeId", "data-v-e9d43b82"]]), Ve = { class: "ctl-text" }, We = { class: "ctl-label" }, Ee = { class: "ctl-help" }, Fe = { class: "ctl-input" }, Ue = {
  key: 0,
  class: "ctl-src"
}, Pe = {
  __name: "SettingRow",
  props: { label: { type: String, required: !0 }, help: { type: String, default: "" }, source: { type: String, default: "" }, changed: { type: Boolean, default: !1 } },
  setup(t) {
    const c = t, i = G(), k = { environment: () => `This environment, ${i.environment}`, project: () => "Every environment", default: () => "Default" }, o = h(() => {
      var a;
      return c.changed ? "Changed, not applied" : ((a = k[c.source]) == null ? void 0 : a.call(k)) ?? "";
    });
    return (a, l) => (n(), u("div", {
      class: X(["ctl", { flat: !t.source }])
    }, [
      s("div", Ve, [
        s("span", We, f(t.label), 1),
        s("span", Ee, f(t.help), 1)
      ]),
      s("div", Fe, [
        ke(a.$slots, "default", {}, void 0, !0)
      ]),
      t.source ? (n(), u("div", Ue, [
        s("span", {
          class: X(["src", { here: t.source === "environment", changed: t.changed }]),
          "data-setting-source": ""
        }, [
          l[0] || (l[0] = s("i", null, null, -1)),
          C(f(o.value), 1)
        ], 2)
      ])) : x("", !0)
    ], 2));
  }
}, te = /* @__PURE__ */ E(Pe, [["__scopeId", "data-v-6e2d513b"]]), qe = { class: "foot" }, Ke = {
  __name: "SettingsFoot",
  props: { changes: { type: Number, default: 0 }, pending: { type: Boolean, default: !1 }, problem: { type: String, default: "" }, blocked: { type: Boolean, default: !1 } },
  emits: ["cancel", "apply"],
  setup(t, { emit: c }) {
    const i = t, k = c, o = G(), a = h(() => i.problem ? i.problem : i.pending ? "Applying." : i.changes ? `${i.changes} ${i.changes === 1 ? "change" : "changes"} to apply to ${o.environment}.` : `No changes. For the environment ${o.environment}.`);
    return (l, g) => (n(), u("div", qe, [
      s("span", {
        class: X(["foot-note", { bad: t.problem, busy: t.pending }]),
        role: "status"
      }, f(a.value), 3),
      _(m(P), {
        bordered: "",
        disabled: !t.changes || t.pending,
        "data-settings-cancel": "",
        onClick: g[0] || (g[0] = (A) => k("cancel"))
      }, {
        default: S(() => [...g[2] || (g[2] = [
          C("Cancel", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      _(m(P), {
        variant: "primary",
        disabled: !t.changes || t.pending || t.blocked || m(o).readOnly,
        "data-settings-apply": "",
        onClick: g[1] || (g[1] = (A) => k("apply"))
      }, {
        default: S(() => [...g[3] || (g[3] = [
          C("Apply", -1)
        ])]),
        _: 1
      }, 8, ["disabled"])
    ]));
  }
}, de = /* @__PURE__ */ E(Ke, [["__scopeId", "data-v-88c3dd59"]]), Le = ["data-agent-settings-group"], De = { class: "sw-word" }, ze = ["value", "disabled", "data-field", "onChange"], Ge = ["value"], He = ["data-field-badge"], Ye = {
  __name: "AgentSettingsGroup",
  props: { group: { type: String, required: !0 } },
  setup(t) {
    const c = t, i = (d) => typeof d == "number" ? `${d / 1e3}k` : `${d.charAt(0).toUpperCase()}${d.slice(1)}`, k = G(), o = k.props.work, a = ie({}), l = O(""), g = O(""), A = O(!1), F = h(() => {
      var d;
      return (((d = o.data.value) == null ? void 0 : d.fields) ?? []).filter((I) => I.group === c.group);
    }), D = h(() => F.value.filter((d) => {
      var I, b;
      return (((b = (I = o.data.value) == null ? void 0 : I.depends) == null ? void 0 : b[d.key]) ?? []).every((p) => a[p] !== !1);
    })), q = (d) => d.type === "flag" ? !!d.value : String(d.value), R = (d) => (d.type === "flag" ? a[d.key] : String(a[d.key])) !== q(d), N = h(() => F.value.filter(R)), M = h(() => N.value.length > 0), V = h(() => {
      var d;
      return M.value && l.value && ((d = o.data.value) == null ? void 0 : d.revision) !== l.value;
    }), U = (d) => d.type === "flag" ? a[d.key] ? "on" : "off" : String(a[d.key]).trim(), W = h(() => N.value.some((d) => d.type !== "flag" && U(d) === ""));
    function L() {
      var d;
      for (const I of F.value) a[I.key] = q(I);
      l.value = ((d = o.data.value) == null ? void 0 : d.revision) ?? "", g.value = "";
    }
    ee(() => o.data.value, () => {
      (!l.value || !M.value) && L();
    }, { immediate: !0 });
    const z = h(() => g.value || (V.value ? "These settings changed since you opened them. Cancel to read them again." : "") || (W.value ? "A number is missing." : ""));
    async function w() {
      A.value = !0;
      const d = await k.run(`work-settings apply --revision ${l.value} ${N.value.map((I) => `${I.key}=${U(I)}`).join(" ")}`);
      A.value = !1, g.value = d.ok ? "" : d.error, await k.reload("work"), d.ok && L();
    }
    return (d, I) => (n(), u("section", {
      class: "group",
      "data-agent-settings-group": t.group
    }, [
      (n(!0), u(T, null, K(D.value, (b) => (n(), B(te, {
        key: b.key,
        label: b.title,
        help: b.description,
        source: b.source,
        changed: R(b),
        "data-control": b.key
      }, {
        default: S(() => {
          var p;
          return [
            b.type === "flag" ? (n(), u(T, { key: 0 }, [
              _(m(re), {
                on: a[b.key],
                disabled: m(k).readOnly,
                onChange: (y) => a[b.key] = !a[b.key]
              }, null, 8, ["on", "disabled", "onChange"]),
              s("span", De, f(a[b.key] ? "On" : "Off"), 1)
            ], 64)) : (p = b.choices) != null && p.length ? (n(), u("select", {
              key: 1,
              class: "choice",
              value: a[b.key],
              disabled: m(k).readOnly,
              "data-field": b.key,
              onChange: (y) => a[b.key] = y.target.value
            }, [
              (n(!0), u(T, null, K(b.choices, (y) => (n(), u("option", {
                key: y,
                value: String(y)
              }, f(i(y)), 9, Ge))), 128))
            ], 40, ze)) : (n(), B(Me, {
              key: 2,
              modelValue: a[b.key],
              "onUpdate:modelValue": (y) => a[b.key] = y,
              disabled: m(k).readOnly,
              "data-field": b.key
            }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "data-field"])),
            b.badge ? (n(), u("span", {
              key: 3,
              class: "badge",
              "data-field-badge": b.key
            }, f(b.badge), 9, He)) : x("", !0)
          ];
        }),
        _: 2
      }, 1032, ["label", "help", "source", "changed", "data-control"]))), 128)),
      _(de, {
        changes: N.value.length,
        pending: A.value,
        problem: z.value,
        blocked: V.value || W.value,
        onCancel: L,
        onApply: w
      }, null, 8, ["changes", "pending", "problem", "blocked"])
    ], 8, Le));
  }
}, ce = /* @__PURE__ */ E(Ye, [["__scopeId", "data-v-09d5a122"]]), Je = {
  __name: "AgentSettingsAdvanced",
  setup(t) {
    return (c, i) => (n(), B(ce, {
      group: "advanced",
      "data-agent-settings-advanced": ""
    }));
  }
}, Qe = { class: "action-buttons" }, Xe = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(t) {
    return (c, i) => (n(), u("form", {
      "data-agent-retire-confirm": "",
      onSubmit: i[2] || (i[2] = ye((k) => c.$emit("submit"), ["prevent"]))
    }, [
      i[5] || (i[5] = s("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      _(m($e), {
        "model-value": t.reason,
        label: "Reason",
        disabled: t.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": i[0] || (i[0] = (k) => c.$emit("update:reason", k))
      }, null, 8, ["model-value", "disabled"]),
      s("div", Qe, [
        _(m(P), {
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
        _(m(P), {
          small: "",
          disabled: t.pending,
          onClick: i[1] || (i[1] = (k) => c.$emit("cancel"))
        }, {
          default: S(() => [...i[4] || (i[4] = [
            C("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ze = /* @__PURE__ */ E(Xe, [["__scopeId", "data-v-23a905c0"]]), et = ["data-edit-type"], tt = { key: 0 }, nt = { class: "stepper" }, at = ["disabled", "onClick"], st = ["value", "disabled", "data-agent-limit-input", "onChange"], lt = ["disabled", "onClick"], ot = { key: 0 }, it = { key: 1 }, rt = {
  __name: "AgentLimitEditor",
  props: { rows: { type: Array, required: !0 }, pending: Boolean, readOnly: Boolean, environment: { type: String, required: !0 } },
  emits: ["change"],
  setup(t, { emit: c }) {
    const i = c;
    return (k, o) => (n(), u(T, null, [
      o[0] || (o[0] = s("p", null, "How many agents of a type may run at once, and how many may be kept.", -1)),
      (n(!0), u(T, null, K(t.rows, (a) => (n(), u("div", {
        key: a.key,
        class: "edit-row",
        "data-edit-type": a.key
      }, [
        s("div", null, [
          s("strong", null, f(a.per_profile ? "Each read-only helper type" : "Workers"), 1),
          a.per_profile ? (n(), u("small", tt, "Researcher, Planner and the others")) : x("", !0)
        ]),
        (n(!0), u(T, null, K([{ name: "Most running", value: a.run_limit, key: a.run_setting, source: a.run_source, kind: "run" }, { name: "Most kept", value: a.kept_limit, key: a.kept_setting, source: a.kept_source, kind: "kept" }], (l) => (n(), u("label", {
          key: l.key
        }, [
          C(f(l.name), 1),
          s("span", nt, [
            s("button", {
              type: "button",
              disabled: t.pending || t.readOnly || l.value === 0,
              onClick: (g) => i("change", a, l.key, l.value, l.value - 1)
            }, "−", 8, at),
            s("input", {
              type: "number",
              min: "0",
              value: l.value,
              disabled: t.pending || t.readOnly,
              "data-agent-limit-input": l.kind,
              onChange: (g) => i("change", a, l.key, l.value, g.target.value)
            }, null, 40, st),
            s("button", {
              type: "button",
              disabled: t.pending || t.readOnly,
              onClick: (g) => i("change", a, l.key, l.value, l.value + 1)
            }, "+", 8, lt)
          ]),
          l.value === 0 ? (n(), u("small", ot, f(l.kind === "run" ? "None can start" : "Any number"), 1)) : l.source === `environment ${t.environment}` ? (n(), u("small", it, "Changed for " + f(t.environment), 1)) : x("", !0)
        ]))), 128))
      ], 8, et))), 128))
    ], 64));
  }
}, ut = /* @__PURE__ */ E(rt, [["__scopeId", "data-v-fc209014"]]), dt = { class: "counts-panel" }, ct = { class: "counts" }, gt = ["data-count-agent"], vt = { class: "person-text" }, pt = {
  key: 0,
  class: "helper-head"
}, mt = ["data-agent-limit-type", "data-agent-limit-profile", "onClick"], kt = {
  key: 0,
  class: "bar"
}, yt = {
  key: 5,
  role: "alert"
}, ft = {
  key: 6,
  role: "status"
}, bt = { class: "foot" }, ht = { class: "foot-note" }, $t = {
  __name: "AgentCountsPanel",
  props: {
    title: { default: "Agent counts" },
    titleModifiers: {}
  },
  emits: /* @__PURE__ */ be(["open-agent", "close"], ["update:title"]),
  setup(t, { emit: c }) {
    const i = c, k = fe(t, "title"), o = G(), a = h(() => o.props.limits.rows.value ?? []), l = h(() => o.props.limits.failure.value), g = O([]), A = O(0), F = O(!1), D = _e(), q = O(null), R = O(!1), N = O(!1), M = O(""), V = O(""), U = O(null), W = O(""), L = h(() => ue(a.value)), z = h(() => a.value.find((v) => v.per_profile)), w = h(() => L.value.find((v) => v.key === q.value)), d = h(() => g.value.filter((v) => {
      var e, r;
      return v.state !== "retired" && v.role === ((e = w.value) == null ? void 0 : e.type) && (!w.value.profile || (((r = v.facts) == null ? void 0 : r.profile) || v.profile) === w.value.profile);
    }).sort((v, e) => (v.state !== "running") - (e.state !== "running") || String(v.ended_at || v.created_at).localeCompare(String(e.ended_at || e.created_at)))), I = h(() => {
      var e;
      const v = /* @__PURE__ */ new Map();
      for (const r of d.value) {
        const $ = ((e = r.facts) == null ? void 0 : e.model) || r.program_model;
        $ && v.set($, (v.get($) || 0) + 1);
      }
      return [...v].map(([r, $]) => `${$} ${r}`).join(", ");
    }), b = (v, e) => e ? `${Math.min(v / Math.max(v, e) * 100, 100)}%` : "0%", p = (v, e) => e && v > e ? `${(v - e) / v * 100}%` : "0%";
    ee(() => {
      var v;
      return R.value ? "Change the maximums" : ((v = w.value) == null ? void 0 : v.label) || "Agent counts";
    }, (v) => {
      k.value = v;
    }, { immediate: !0 });
    async function y(v, e = 1) {
      o.state["count-agents.role"] = v.type, v.profile ? o.state["count-agents.profile"] = v.profile : delete o.state["count-agents.profile"], o.state["count-agents.page"] = String(e), await o.reload("count-agents");
      const r = o.props["count-agents"];
      g.value = e === 1 ? [...r.rows.value] : [...g.value, ...r.rows.value], A.value = e, F.value = r.more.value;
    }
    function j(v) {
      q.value = v.key, g.value = [], y(v);
    }
    function Y() {
      R.value = !1, q.value = null, U.value = null, M.value = "";
    }
    function ge() {
      Y(), i("close");
    }
    async function ve(v, e, r, $) {
      if (N.value || o.readOnly) return;
      const H = Number($);
      if (!String($).trim() || !Number.isInteger(H) || H < 0) {
        M.value = "Use a whole number of 0 or more.";
        return;
      }
      N.value = !0, M.value = "";
      const J = await o.run(["setting", "set", e, String(H), "--environment", o.environment]);
      J.ok ? (await o.reload("limits"), V.value = "Saved.") : M.value = J.error, N.value = !1;
    }
    async function pe(v) {
      if (!W.value.trim() || N.value) return;
      N.value = !0;
      const e = await o.run(["agent", "retire", String(v.id), "--reason", W.value.trim()]);
      M.value = e.ok ? "" : "The agent could not be retired. Try again.", e.ok && (U.value = null, W.value = "", V.value = "Agent retired permanently.", await o.reload("limits"), await y(w.value)), N.value = !1;
    }
    function me(v) {
      ge(), i("open-agent", v);
    }
    return (v, e) => (n(), u("div", dt, [
      s("div", ct, [
        R.value || w.value ? (n(), u("button", {
          key: 0,
          class: "back",
          type: "button",
          onClick: Y
        }, "‹ Back to the counts")) : x("", !0),
        l.value ? (n(), u(T, { key: 1 }, [
          e[6] || (e[6] = s("strong", null, "The counts could not be read", -1)),
          e[7] || (e[7] = s("p", null, "The journal did not answer.", -1)),
          _(m(P), {
            small: "",
            onClick: e[0] || (e[0] = (r) => m(o).reload("limits"))
          }, {
            default: S(() => [...e[5] || (e[5] = [
              C("Try again", -1)
            ])]),
            _: 1
          })
        ], 64)) : R.value ? (n(), B(ut, {
          key: 2,
          rows: a.value,
          pending: N.value,
          "read-only": m(o).readOnly,
          environment: m(o).environment,
          onChange: ve
        }, null, 8, ["rows", "pending", "read-only", "environment"])) : w.value ? (n(), u(T, { key: 3 }, [
          s("p", null, [
            s("strong", null, f(w.value.running) + " of " + f(w.value.run_limit), 1),
            e[8] || (e[8] = C(" running, ", -1)),
            s("strong", null, [
              C(f(w.value.kept), 1),
              w.value.kept_limit ? (n(), u(T, { key: 0 }, [
                C(" of " + f(w.value.kept_limit), 1)
              ], 64)) : x("", !0)
            ]),
            e[9] || (e[9] = C(" kept", -1))
          ]),
          s("p", null, f(I.value), 1),
          d.value.length ? x("", !0) : (n(), u(T, { key: 0 }, [
            e[10] || (e[10] = s("strong", null, "No agents here yet", -1)),
            e[11] || (e[11] = s("p", null, "An agent shows here as soon as one of this type starts.", -1))
          ], 64)),
          (n(!0), u(T, null, K(d.value, (r) => {
            var $, H, J, ne, ae;
            return n(), u("div", {
              key: r.id,
              class: "person",
              "data-count-agent": r.id
            }, [
              s("span", {
                class: X(["dot", { running: r.state === "running" }])
              }, null, 2),
              s("div", vt, [
                s("strong", null, f((($ = r.facts) == null ? void 0 : $.given_name) || r.id), 1),
                C(" " + f(r.state === "running" ? "Running" : "Idle") + ", " + f(m(we)(r.state === "running" ? r.process_started_at || r.created_at : r.ended_at, m(D))), 1),
                s("small", null, f([r.program, (H = r.facts) == null ? void 0 : H.model, (J = r.facts) == null ? void 0 : J.effort, `${r.role} ${r.id}`].filter(Boolean).join(", ")), 1),
                s("small", null, f(((ne = r.facts) == null ? void 0 : ne.task_title) || ((ae = r.facts) == null ? void 0 : ae.helper_job)), 1)
              ]),
              _(m(P), {
                small: "",
                onClick: (Q) => me(r)
              }, {
                default: S(() => [...e[12] || (e[12] = [
                  C("Open", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              r.state === "idle" && !m(o).readOnly ? (n(), B(m(P), {
                key: 0,
                small: "",
                onClick: (Q) => {
                  U.value = r.id, W.value = "";
                }
              }, {
                default: S(() => [...e[13] || (e[13] = [
                  C("Retire", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : x("", !0),
              U.value === r.id ? (n(), B(Ze, {
                key: 1,
                reason: W.value,
                "onUpdate:reason": e[1] || (e[1] = (Q) => W.value = Q),
                pending: N.value,
                onSubmit: (Q) => pe(r),
                onCancel: e[2] || (e[2] = (Q) => U.value = null)
              }, null, 8, ["reason", "pending", "onSubmit"])) : x("", !0)
            ], 8, gt);
          }), 128)),
          F.value ? (n(), B(m(P), {
            key: 1,
            small: "",
            onClick: e[3] || (e[3] = (r) => y(w.value, A.value + 1))
          }, {
            default: S(() => [...e[14] || (e[14] = [
              C("Show more", -1)
            ])]),
            _: 1
          })) : x("", !0)
        ], 64)) : (n(), u(T, { key: 4 }, [
          e[16] || (e[16] = s("div", { class: "columns" }, [
            s("span", null, "Name"),
            s("span", null, "Running"),
            s("span", null, "Kept"),
            s("span")
          ], -1)),
          z.value ? (n(), u("div", pt, [
            e[15] || (e[15] = s("strong", null, "Read-only helpers", -1)),
            s("span", null, f(z.value.running) + " running, " + f(z.value.kept) + " kept", 1)
          ])) : x("", !0),
          (n(!0), u(T, null, K(L.value, (r) => (n(), u("button", {
            key: r.key,
            type: "button",
            class: "count-row",
            "data-agent-limit-type": r.type || r.key,
            "data-agent-limit-profile": r.profile,
            onClick: ($) => j(r)
          }, [
            s("strong", null, f(r.label), 1),
            (n(!0), u(T, null, K([{ count: r.running, limit: r.run_limit, unlimited: !1 }, { count: r.kept, limit: r.kept_limit, unlimited: !0 }], ($) => (n(), u("span", {
              key: $.unlimited,
              class: X({ full: m(Z)($.count, $.limit) })
            }, [
              s("span", null, [
                C(f($.count), 1),
                $.limit || !$.unlimited ? (n(), u(T, { key: 0 }, [
                  C(" of " + f($.limit), 1)
                ], 64)) : x("", !0)
              ]),
              $.limit ? (n(), u("span", kt, [
                s("span", {
                  style: se({ width: b($.count, $.limit) })
                }, null, 4),
                s("i", {
                  style: se({ width: p($.count, $.limit) })
                }, null, 4)
              ])) : x("", !0)
            ], 2))), 128)),
            _(m(Ce), {
              name: "chevronRight",
              size: 12
            })
          ], 8, mt))), 128))
        ], 64)),
        M.value ? (n(), u("p", yt, f(M.value), 1)) : V.value ? (n(), u("p", ft, f(V.value), 1)) : x("", !0)
      ]),
      s("div", bt, [
        R.value ? (n(), u(T, { key: 0 }, [
          s("span", ht, f(V.value || `Changes apply to ${m(o).environment}.`), 1),
          _(m(P), { onClick: Y }, {
            default: S(() => [...e[17] || (e[17] = [
              C("Done", -1)
            ])]),
            _: 1
          })
        ], 64)) : w.value ? x("", !0) : (n(), B(m(P), {
          key: 1,
          disabled: m(o).readOnly,
          "data-agent-limits-edit": "",
          onClick: e[4] || (e[4] = (r) => R.value = !0)
        }, {
          default: S(() => [...e[18] || (e[18] = [
            C("Change the maximums", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]))
      ])
    ]));
  }
}, _t = /* @__PURE__ */ E($t, [["__scopeId", "data-v-604ef447"]]), wt = {
  class: "agents",
  "data-agent-settings-agents": ""
}, Ct = {
  __name: "AgentSettingsAgents",
  setup(t) {
    const c = G(), i = O("Agent counts"), k = (o) => c.open("agents.agents", o.id);
    return he(() => c.reload("limits")), (o, a) => (n(), u("section", wt, [
      _(_t, {
        title: i.value,
        "onUpdate:title": a[0] || (a[0] = (l) => i.value = l),
        onOpenAgent: k
      }, null, 8, ["title"])
    ]));
  }
}, St = /* @__PURE__ */ E(Ct, [["__scopeId", "data-v-3e01c727"]]), At = {
  __name: "AgentSettingsTests",
  setup(t) {
    return (c, i) => (n(), B(ce, {
      group: "tests",
      "data-agent-settings-tests": ""
    }));
  }
}, Ot = { class: "sw-word" }, Tt = {
  __name: "SettingSwitchRow",
  props: { control: { type: Object, required: !0 }, on: { type: Boolean, default: !1 }, disabled: { type: Boolean, default: !1 } },
  emits: ["change"],
  setup(t) {
    return (c, i) => (n(), B(te, {
      label: t.control.label,
      help: t.control.line,
      "data-control": t.control.key
    }, {
      default: S(() => [
        _(m(re), {
          on: t.on,
          disabled: t.disabled,
          onChange: i[0] || (i[0] = (k) => c.$emit("change"))
        }, null, 8, ["on", "disabled"]),
        s("span", Ot, f(t.on ? "On" : "Off"), 1)
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
    const c = [
      { key: "journal.suites.coding.auto-mode", label: "Auto mode", line: "The journal hands the main agent its next task, and it keeps going while tasks are left" },
      { key: "journal.suites.coding.main-writes-code", label: "Main agent writes code", line: "The main agent may change project files itself; off, it plans, delegates and merges" },
      { key: "journal.suites.coding.workers.main-dispatches-workers", label: "Main agent sends workers", line: "Whether the main agent may send workers to do tasks." },
      { key: "journal.suites.coding.continue-while-delegatable", label: "Keep going while work can be delegated", line: "Keep the main agent working while open tasks can still be sent to workers." },
      { key: "journal.suites.coding.workers.merger-on", label: "Merger takes in workers", line: "A helper merges workers whose tests passed, and passes on what the main agent must judge." },
      { key: "journal.suites.coding.main-starts-read-only-helpers", label: "Use read-only helpers", line: "Whether the main agent may start read-only helpers." },
      { key: "journal.suites.coding.designer-enabled", label: "Use a designer", line: "Whether the main agent may start a designer, which writes a design document and changes no code." },
      { key: "journal.suites.coding.workers.main-agent-may-merge", label: "Main agent may merge workers", line: "Whether the main agent may merge the work of a worker itself." }
    ], i = [{ key: "builder", label: "Builder" }, { key: "orchestrator", label: "Orchestrator" }], k = [oe], o = G(), a = o.props.work, l = ie({}), g = O(""), A = O(""), F = O(!1), D = h(() => c.filter((p) => {
      var y, j;
      return l[p.key] !== ((j = (y = a.data.value) == null ? void 0 : y.controls) == null ? void 0 : j[p.key]);
    })), q = h(() => D.value.length > 0), R = h(() => q.value && a.data.value && g.value && a.data.value.revision !== g.value), N = h(() => {
      var p;
      return ((p = a.data.value) == null ? void 0 : p.workflow) ?? "";
    }), M = h(() => {
      var p;
      return ((p = a.data.value) == null ? void 0 : p.depends) ?? {};
    }), V = (p) => (M.value[p.key] ?? []).every((y) => l[y] !== !1), U = h(() => c.filter((p) => k.includes(p.key) && V(p))), W = h(() => c.filter((p) => !k.includes(p.key) && V(p))), L = h(() => A.value || (R.value ? "These settings changed since you opened them. Cancel to read them again." : "")), z = h(() => l[oe] === !1 && l[Bt] === !1);
    function w() {
      const p = a.data.value;
      if (p) {
        for (const y of c) l[y.key] = p.controls[y.key];
        g.value = p.revision, A.value = "";
      }
    }
    ee(() => a.data.value, () => {
      (!g.value || !q.value) && w();
    }, { immediate: !0 });
    async function d(p) {
      F.value = !0;
      const y = await o.run(p);
      F.value = !1, y.ok ? (await o.reload("work"), w()) : (A.value = y.error, await o.reload("work"));
    }
    const I = () => d(`work-settings apply --revision ${g.value} ${D.value.map((p) => `${p.key}=${l[p.key] ? "on" : "off"}`).join(" ")}`), b = (p) => d(`work-settings preset ${p} --revision ${g.value}`);
    return (p, y) => (n(), u("section", xt, [
      s("div", jt, [
        y[0] || (y[0] = s("p", { class: "section-title" }, "Taking on work", -1)),
        _(te, {
          label: "Workflow",
          help: "A preset sets the switches below at once; Custom is any other mix.",
          "data-work-flow": ""
        }, {
          default: S(() => [
            _(m(Se), {
              options: i,
              value: N.value,
              onPick: b
            }, null, 8, ["value"])
          ]),
          _: 1
        }),
        (n(!0), u(T, null, K(U.value, (j) => (n(), B(le, {
          key: j.key,
          control: j,
          on: l[j.key],
          disabled: m(o).readOnly,
          onChange: (Y) => l[j.key] = !l[j.key]
        }, null, 8, ["control", "on", "disabled", "onChange"]))), 128))
      ]),
      s("div", Nt, [
        y[1] || (y[1] = s("p", { class: "section-title" }, "How the main agent works", -1)),
        y[2] || (y[2] = s("p", { class: "section-help" }, "Your models, maximums and tests stay as you set them.", -1)),
        (n(!0), u(T, null, K(W.value, (j) => (n(), B(le, {
          key: j.key,
          control: j,
          on: l[j.key],
          disabled: m(o).readOnly,
          onChange: (Y) => l[j.key] = !l[j.key]
        }, null, 8, ["control", "on", "disabled", "onChange"]))), 128)),
        z.value ? (n(), u("p", It, "With Auto off and no workers, nothing starts the work: a person starts tasks or turns one of them on.")) : x("", !0)
      ]),
      _(de, {
        changes: D.value.length,
        pending: F.value,
        problem: L.value,
        blocked: R.value,
        onCancel: w,
        onApply: I
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
    const c = G(), i = O("work"), k = h(() => {
      var g;
      return ue(((g = c.props.limits) == null ? void 0 : g.rows.value) ?? []).filter((A) => Z(A.running, A.run_limit) || Z(A.kept, A.kept_limit)).length;
    }), o = h(() => [{ key: "work", label: "Work" }, { key: "agents", label: k.value ? `Agents ${k.value}` : "Agents" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }]), a = h(() => o.value.find((g) => g.key === i.value));
    function l(g) {
      i.value = g.key, c.state.tab = g.key === "agents" ? "agents" : "";
    }
    return (g, A) => (n(), B(m(Ae), { padding: "0" }, {
      default: S(() => [
        s("div", Vt, [
          s("div", Wt, [
            _(m(Oe), {
              tabs: o.value,
              active: a.value,
              onChoose: l
            }, null, 8, ["tabs", "active"])
          ]),
          s("div", Et, [
            m(c).readOnly ? (n(), u("p", Ft, "Only a person can change these settings. You can read every value, and ask a person for a change.")) : x("", !0),
            _(m(Te), { tab: a.value }, {
              default: S(() => [
                _(m(xe), { value: i.value }, {
                  work: S(() => [
                    _(Mt)
                  ]),
                  agents: S(() => [
                    _(St)
                  ]),
                  tests: S(() => [
                    _(At)
                  ]),
                  advanced: S(() => [
                    _(Je)
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
}, Lt = /* @__PURE__ */ E(Ut, [["__scopeId", "data-v-966d9959"]]);
export {
  Lt as A
};
