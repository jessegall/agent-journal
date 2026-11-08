/* @code-commandments-generated */
import { openBlock as t, createElementBlock as u, createElementVNode as a, computed as h, normalizeClass as X, toDisplayString as y, renderSlot as ke, createTextVNode as C, createCommentVNode as x, createVNode as O, unref as m, withCtx as I, reactive as ie, ref as A, watch as ne, Fragment as S, renderList as L, createBlock as T, withModifiers as ye, useModel as fe, normalizeStyle as le, mergeModels as be, onMounted as he } from "vue";
import { useWindow as G, Btn as P, Switch as ee, TextInput as _e, useNow as $e, age as we, Icon as Ce, Segmented as re, WindowRoom as Ae } from "@journal/window-kit";
import { _ as U } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const ue = (l) => l.flatMap((g) => g.per_profile ? g.profiles.map((i) => ({ ...i, label: i.title, type: g.key, key: `${g.key}:${i.profile}` })) : [{ ...g, type: g.key }]), te = (l, g) => g > 0 && l >= g, Se = { class: "step" }, Oe = ["disabled"], xe = ["value", "disabled"], Te = ["disabled"], je = {
  __name: "NumberStep",
  props: { modelValue: { type: [Number, String], default: 0 }, disabled: { type: Boolean, default: !1 } },
  emits: ["update:modelValue"],
  setup(l, { emit: g }) {
    const i = l, k = g, o = (s) => k("update:modelValue", Math.max(0, (Number(i.modelValue) || 0) + s));
    return (s, n) => (t(), u("span", Se, [
      a("button", {
        type: "button",
        disabled: l.disabled || Number(l.modelValue) <= 0,
        "aria-label": "Less",
        onClick: n[0] || (n[0] = (p) => o(-1))
      }, "−", 8, Oe),
      a("input", {
        type: "number",
        min: "0",
        value: l.modelValue,
        disabled: l.disabled,
        onInput: n[1] || (n[1] = (p) => k("update:modelValue", p.target.value))
      }, null, 40, xe),
      a("button", {
        type: "button",
        disabled: l.disabled,
        "aria-label": "More",
        onClick: n[2] || (n[2] = (p) => o(1))
      }, "+", 8, Te)
    ]));
  }
}, Ne = /* @__PURE__ */ U(je, [["__scopeId", "data-v-e9d43b82"]]), Ie = { class: "ctl-text" }, Me = { class: "ctl-label" }, Re = { class: "ctl-help" }, Ve = { class: "ctl-input" }, Be = {
  key: 0,
  class: "ctl-src"
}, We = {
  __name: "SettingRow",
  props: { label: { type: String, required: !0 }, help: { type: String, default: "" }, source: { type: String, default: "" }, changed: { type: Boolean, default: !1 } },
  setup(l) {
    const g = l, i = G(), k = { environment: () => `This environment, ${i.environment}`, project: () => "Every environment", default: () => "Default" }, o = h(() => {
      var s;
      return g.changed ? "Changed, not applied" : ((s = k[g.source]) == null ? void 0 : s.call(k)) ?? "";
    });
    return (s, n) => (t(), u("div", {
      class: X(["ctl", { flat: !l.source }])
    }, [
      a("div", Ie, [
        a("span", Me, y(l.label), 1),
        a("span", Re, y(l.help), 1)
      ]),
      a("div", Ve, [
        ke(s.$slots, "default", {}, void 0, !0)
      ]),
      l.source ? (t(), u("div", Be, [
        a("span", {
          class: X(["src", { here: l.source === "environment", changed: l.changed }]),
          "data-setting-source": ""
        }, [
          n[0] || (n[0] = a("i", null, null, -1)),
          C(y(o.value), 1)
        ], 2)
      ])) : x("", !0)
    ], 2));
  }
}, Z = /* @__PURE__ */ U(We, [["__scopeId", "data-v-6e2d513b"]]), Ee = { class: "foot" }, Fe = {
  __name: "SettingsFoot",
  props: { changes: { type: Number, default: 0 }, pending: { type: Boolean, default: !1 }, problem: { type: String, default: "" }, blocked: { type: Boolean, default: !1 } },
  emits: ["cancel", "apply"],
  setup(l, { emit: g }) {
    const i = l, k = g, o = G(), s = h(() => i.problem ? i.problem : i.pending ? "Applying." : i.changes ? `${i.changes} ${i.changes === 1 ? "change" : "changes"} to apply to ${o.environment}.` : `No changes. For the environment ${o.environment}.`);
    return (n, p) => (t(), u("div", Ee, [
      a("span", {
        class: X(["foot-note", { bad: l.problem, busy: l.pending }]),
        role: "status"
      }, y(s.value), 3),
      O(m(P), {
        bordered: "",
        disabled: !l.changes || l.pending,
        "data-settings-cancel": "",
        onClick: p[0] || (p[0] = (M) => k("cancel"))
      }, {
        default: I(() => [...p[2] || (p[2] = [
          C("Cancel", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      O(m(P), {
        variant: "primary",
        disabled: !l.changes || l.pending || l.blocked || m(o).readOnly,
        "data-settings-apply": "",
        onClick: p[1] || (p[1] = (M) => k("apply"))
      }, {
        default: I(() => [...p[3] || (p[3] = [
          C("Apply", -1)
        ])]),
        _: 1
      }, 8, ["disabled"])
    ]));
  }
}, de = /* @__PURE__ */ U(Fe, [["__scopeId", "data-v-88c3dd59"]]), Pe = ["data-agent-settings-group"], Ue = { class: "sw-word" }, Ke = ["value", "disabled", "data-field", "onChange"], Le = ["value"], qe = ["data-field-badge"], De = {
  __name: "AgentSettingsGroup",
  props: { group: { type: String, required: !0 } },
  setup(l) {
    const g = l, i = (d) => typeof d == "number" ? `${d / 1e3}k` : `${d.charAt(0).toUpperCase()}${d.slice(1)}`, k = G(), o = k.props.work, s = ie({}), n = A(""), p = A(""), M = A(!1), E = h(() => {
      var d;
      return (((d = o.data.value) == null ? void 0 : d.fields) ?? []).filter((N) => N.group === g.group);
    }), D = h(() => E.value.filter((d) => {
      var N, b;
      return (((b = (N = o.data.value) == null ? void 0 : N.depends) == null ? void 0 : b[d.key]) ?? []).every((v) => s[v] !== !1);
    })), K = (d) => d.type === "flag" ? !!d.value : String(d.value), R = (d) => (d.type === "flag" ? s[d.key] : String(s[d.key])) !== K(d), j = h(() => E.value.filter(R)), V = h(() => j.value.length > 0), B = h(() => {
      var d;
      return V.value && n.value && ((d = o.data.value) == null ? void 0 : d.revision) !== n.value;
    }), F = (d) => d.type === "flag" ? s[d.key] ? "on" : "off" : String(s[d.key]).trim(), W = h(() => j.value.some((d) => d.type !== "flag" && F(d) === ""));
    function q() {
      var d;
      for (const N of E.value) s[N.key] = K(N);
      n.value = ((d = o.data.value) == null ? void 0 : d.revision) ?? "", p.value = "";
    }
    ne(() => o.data.value, () => {
      (!n.value || !V.value) && q();
    }, { immediate: !0 });
    const z = h(() => p.value || (B.value ? "These settings changed since you opened them. Cancel to read them again." : "") || (W.value ? "A number is missing." : ""));
    async function w() {
      M.value = !0;
      const d = await k.run(`work-settings apply --revision ${n.value} ${j.value.map((N) => `${N.key}=${F(N)}`).join(" ")}`);
      M.value = !1, p.value = d.ok ? "" : d.error, await k.reload("work"), d.ok && q();
    }
    return (d, N) => (t(), u("section", {
      class: "group",
      "data-agent-settings-group": l.group
    }, [
      (t(!0), u(S, null, L(D.value, (b) => (t(), T(Z, {
        key: b.key,
        label: b.title,
        help: b.description,
        source: b.source,
        changed: R(b),
        "data-control": b.key
      }, {
        default: I(() => {
          var v;
          return [
            b.type === "flag" ? (t(), u(S, { key: 0 }, [
              O(m(ee), {
                on: s[b.key],
                disabled: m(k).readOnly,
                onChange: (f) => s[b.key] = !s[b.key]
              }, null, 8, ["on", "disabled", "onChange"]),
              a("span", Ue, y(s[b.key] ? "On" : "Off"), 1)
            ], 64)) : (v = b.choices) != null && v.length ? (t(), u("select", {
              key: 1,
              class: "choice",
              value: s[b.key],
              disabled: m(k).readOnly,
              "data-field": b.key,
              onChange: (f) => s[b.key] = f.target.value
            }, [
              (t(!0), u(S, null, L(b.choices, (f) => (t(), u("option", {
                key: f,
                value: String(f)
              }, y(i(f)), 9, Le))), 128))
            ], 40, Ke)) : (t(), T(Ne, {
              key: 2,
              modelValue: s[b.key],
              "onUpdate:modelValue": (f) => s[b.key] = f,
              disabled: m(k).readOnly,
              "data-field": b.key
            }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "data-field"])),
            b.badge ? (t(), u("span", {
              key: 3,
              class: "badge",
              "data-field-badge": b.key
            }, y(b.badge), 9, qe)) : x("", !0)
          ];
        }),
        _: 2
      }, 1032, ["label", "help", "source", "changed", "data-control"]))), 128)),
      O(de, {
        changes: j.value.length,
        pending: M.value,
        problem: z.value,
        blocked: B.value || W.value,
        onCancel: q,
        onApply: w
      }, null, 8, ["changes", "pending", "problem", "blocked"])
    ], 8, Pe));
  }
}, ce = /* @__PURE__ */ U(De, [["__scopeId", "data-v-09d5a122"]]), ze = {
  __name: "AgentSettingsAdvanced",
  setup(l) {
    return (g, i) => (t(), T(ce, {
      group: "advanced",
      "data-agent-settings-advanced": ""
    }));
  }
}, Ge = { class: "action-buttons" }, He = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(l) {
    return (g, i) => (t(), u("form", {
      "data-agent-retire-confirm": "",
      onSubmit: i[2] || (i[2] = ye((k) => g.$emit("submit"), ["prevent"]))
    }, [
      i[5] || (i[5] = a("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      O(m(_e), {
        "model-value": l.reason,
        label: "Reason",
        disabled: l.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": i[0] || (i[0] = (k) => g.$emit("update:reason", k))
      }, null, 8, ["model-value", "disabled"]),
      a("div", Ge, [
        O(m(P), {
          type: "submit",
          small: "",
          disabled: l.pending || !l.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: I(() => [...i[3] || (i[3] = [
            C("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        O(m(P), {
          small: "",
          disabled: l.pending,
          onClick: i[1] || (i[1] = (k) => g.$emit("cancel"))
        }, {
          default: I(() => [...i[4] || (i[4] = [
            C("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ye = /* @__PURE__ */ U(He, [["__scopeId", "data-v-23a905c0"]]), Je = ["data-edit-type"], Qe = { key: 0 }, Xe = { class: "stepper" }, Ze = ["disabled", "onClick"], et = ["value", "disabled", "data-agent-limit-input", "onChange"], tt = ["disabled", "onClick"], nt = { key: 0 }, at = { key: 1 }, st = {
  __name: "AgentLimitEditor",
  props: { rows: { type: Array, required: !0 }, pending: Boolean, readOnly: Boolean, environment: { type: String, required: !0 } },
  emits: ["change"],
  setup(l, { emit: g }) {
    const i = g;
    return (k, o) => (t(), u(S, null, [
      o[0] || (o[0] = a("p", null, "How many agents of a type may run at once, and how many may be kept.", -1)),
      (t(!0), u(S, null, L(l.rows, (s) => (t(), u("div", {
        key: s.key,
        class: "edit-row",
        "data-edit-type": s.key
      }, [
        a("div", null, [
          a("strong", null, y(s.per_profile ? "Each read-only helper type" : "Workers"), 1),
          s.per_profile ? (t(), u("small", Qe, "Researcher, Planner and the others")) : x("", !0)
        ]),
        (t(!0), u(S, null, L([{ name: "Most running", value: s.run_limit, key: s.run_setting, source: s.run_source, kind: "run" }, { name: "Most kept", value: s.kept_limit, key: s.kept_setting, source: s.kept_source, kind: "kept" }], (n) => (t(), u("label", {
          key: n.key
        }, [
          C(y(n.name), 1),
          a("span", Xe, [
            a("button", {
              type: "button",
              disabled: l.pending || l.readOnly || n.value === 0,
              onClick: (p) => i("change", s, n.key, n.value, n.value - 1)
            }, "−", 8, Ze),
            a("input", {
              type: "number",
              min: "0",
              value: n.value,
              disabled: l.pending || l.readOnly,
              "data-agent-limit-input": n.kind,
              onChange: (p) => i("change", s, n.key, n.value, p.target.value)
            }, null, 40, et),
            a("button", {
              type: "button",
              disabled: l.pending || l.readOnly,
              onClick: (p) => i("change", s, n.key, n.value, n.value + 1)
            }, "+", 8, tt)
          ]),
          n.value === 0 ? (t(), u("small", nt, y(n.kind === "run" ? "None can start" : "Any number"), 1)) : n.source === `environment ${l.environment}` ? (t(), u("small", at, "Changed for " + y(l.environment), 1)) : x("", !0)
        ]))), 128))
      ], 8, Je))), 128))
    ], 64));
  }
}, lt = /* @__PURE__ */ U(st, [["__scopeId", "data-v-fc209014"]]), ot = { class: "counts-panel" }, it = { class: "counts" }, rt = ["data-count-agent"], ut = { class: "person-text" }, dt = {
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
  setup(l, { emit: g }) {
    const i = g, k = fe(l, "title"), o = G(), s = h(() => o.props.limits.rows.value ?? []), n = h(() => o.props.limits.failure.value), p = A([]), M = A(0), E = A(!1), D = $e(), K = A(null), R = A(!1), j = A(!1), V = A(""), B = A(""), F = A(null), W = A(""), q = h(() => ue(s.value)), z = h(() => s.value.find((c) => c.per_profile)), w = h(() => q.value.find((c) => c.key === K.value)), d = h(() => p.value.filter((c) => {
      var e, r;
      return c.state !== "retired" && c.role === ((e = w.value) == null ? void 0 : e.type) && (!w.value.profile || (((r = c.facts) == null ? void 0 : r.profile) || c.profile) === w.value.profile);
    }).sort((c, e) => (c.state !== "running") - (e.state !== "running") || String(c.ended_at || c.created_at).localeCompare(String(e.ended_at || e.created_at)))), N = h(() => {
      var e;
      const c = /* @__PURE__ */ new Map();
      for (const r of d.value) {
        const _ = ((e = r.facts) == null ? void 0 : e.model) || r.program_model;
        _ && c.set(_, (c.get(_) || 0) + 1);
      }
      return [...c].map(([r, _]) => `${_} ${r}`).join(", ");
    }), b = (c, e) => e ? `${Math.min(c / Math.max(c, e) * 100, 100)}%` : "0%", v = (c, e) => e && c > e ? `${(c - e) / c * 100}%` : "0%";
    ne(() => {
      var c;
      return R.value ? "Change the maximums" : ((c = w.value) == null ? void 0 : c.label) || "Agent counts";
    }, (c) => {
      k.value = c;
    }, { immediate: !0 });
    async function f(c, e = 1) {
      o.state["count-agents.role"] = c.type, c.profile ? o.state["count-agents.profile"] = c.profile : delete o.state["count-agents.profile"], o.state["count-agents.page"] = String(e), await o.reload("count-agents");
      const r = o.props["count-agents"];
      p.value = e === 1 ? [...r.rows.value] : [...p.value, ...r.rows.value], M.value = e, E.value = r.more.value;
    }
    function $(c) {
      K.value = c.key, p.value = [], f(c);
    }
    function Y() {
      R.value = !1, K.value = null, F.value = null, V.value = "";
    }
    function ge() {
      Y(), i("close");
    }
    async function pe(c, e, r, _) {
      if (j.value || o.readOnly) return;
      const H = Number(_);
      if (!String(_).trim() || !Number.isInteger(H) || H < 0) {
        V.value = "Use a whole number of 0 or more.";
        return;
      }
      j.value = !0, V.value = "";
      const J = await o.run(["setting", "set", e, String(H), "--environment", o.environment]);
      J.ok ? (await o.reload("limits"), B.value = "Saved.") : V.value = J.error, j.value = !1;
    }
    async function ve(c) {
      if (!W.value.trim() || j.value) return;
      j.value = !0;
      const e = await o.run(["agent", "retire", String(c.id), "--reason", W.value.trim()]);
      V.value = e.ok ? "" : "The agent could not be retired. Try again.", e.ok && (F.value = null, W.value = "", B.value = "Agent retired permanently.", await o.reload("limits"), await f(w.value)), j.value = !1;
    }
    function me(c) {
      ge(), i("open-agent", c);
    }
    return (c, e) => (t(), u("div", ot, [
      a("div", it, [
        R.value || w.value ? (t(), u("button", {
          key: 0,
          class: "back",
          type: "button",
          onClick: Y
        }, "‹ Back to the counts")) : x("", !0),
        n.value ? (t(), u(S, { key: 1 }, [
          e[6] || (e[6] = a("strong", null, "The counts could not be read", -1)),
          e[7] || (e[7] = a("p", null, "The journal did not answer.", -1)),
          O(m(P), {
            small: "",
            onClick: e[0] || (e[0] = (r) => m(o).reload("limits"))
          }, {
            default: I(() => [...e[5] || (e[5] = [
              C("Try again", -1)
            ])]),
            _: 1
          })
        ], 64)) : R.value ? (t(), T(lt, {
          key: 2,
          rows: s.value,
          pending: j.value,
          "read-only": m(o).readOnly,
          environment: m(o).environment,
          onChange: pe
        }, null, 8, ["rows", "pending", "read-only", "environment"])) : w.value ? (t(), u(S, { key: 3 }, [
          a("p", null, [
            a("strong", null, y(w.value.running) + " of " + y(w.value.run_limit), 1),
            e[8] || (e[8] = C(" running, ", -1)),
            a("strong", null, [
              C(y(w.value.kept), 1),
              w.value.kept_limit ? (t(), u(S, { key: 0 }, [
                C(" of " + y(w.value.kept_limit), 1)
              ], 64)) : x("", !0)
            ]),
            e[9] || (e[9] = C(" kept", -1))
          ]),
          a("p", null, y(N.value), 1),
          d.value.length ? x("", !0) : (t(), u(S, { key: 0 }, [
            e[10] || (e[10] = a("strong", null, "No agents here yet", -1)),
            e[11] || (e[11] = a("p", null, "An agent shows here as soon as one of this type starts.", -1))
          ], 64)),
          (t(!0), u(S, null, L(d.value, (r) => {
            var _, H, J, ae, se;
            return t(), u("div", {
              key: r.id,
              class: "person",
              "data-count-agent": r.id
            }, [
              a("span", {
                class: X(["dot", { running: r.state === "running" }])
              }, null, 2),
              a("div", ut, [
                a("strong", null, y(((_ = r.facts) == null ? void 0 : _.given_name) || r.id), 1),
                C(" " + y(r.state === "running" ? "Running" : "Idle") + ", " + y(m(we)(r.state === "running" ? r.process_started_at || r.created_at : r.ended_at, m(D))), 1),
                a("small", null, y([r.program, (H = r.facts) == null ? void 0 : H.model, (J = r.facts) == null ? void 0 : J.effort, `${r.role} ${r.id}`].filter(Boolean).join(", ")), 1),
                a("small", null, y(((ae = r.facts) == null ? void 0 : ae.task_title) || ((se = r.facts) == null ? void 0 : se.helper_job)), 1)
              ]),
              O(m(P), {
                small: "",
                onClick: (Q) => me(r)
              }, {
                default: I(() => [...e[12] || (e[12] = [
                  C("Open", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              r.state === "idle" && !m(o).readOnly ? (t(), T(m(P), {
                key: 0,
                small: "",
                onClick: (Q) => {
                  F.value = r.id, W.value = "";
                }
              }, {
                default: I(() => [...e[13] || (e[13] = [
                  C("Retire", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : x("", !0),
              F.value === r.id ? (t(), T(Ye, {
                key: 1,
                reason: W.value,
                "onUpdate:reason": e[1] || (e[1] = (Q) => W.value = Q),
                pending: j.value,
                onSubmit: (Q) => ve(r),
                onCancel: e[2] || (e[2] = (Q) => F.value = null)
              }, null, 8, ["reason", "pending", "onSubmit"])) : x("", !0)
            ], 8, rt);
          }), 128)),
          E.value ? (t(), T(m(P), {
            key: 1,
            small: "",
            onClick: e[3] || (e[3] = (r) => f(w.value, M.value + 1))
          }, {
            default: I(() => [...e[14] || (e[14] = [
              C("Show more", -1)
            ])]),
            _: 1
          })) : x("", !0)
        ], 64)) : (t(), u(S, { key: 4 }, [
          e[16] || (e[16] = a("div", { class: "columns" }, [
            a("span", null, "Name"),
            a("span", null, "Running"),
            a("span", null, "Kept"),
            a("span")
          ], -1)),
          z.value ? (t(), u("div", dt, [
            e[15] || (e[15] = a("strong", null, "Read-only helpers", -1)),
            a("span", null, y(z.value.running) + " running, " + y(z.value.kept) + " kept", 1)
          ])) : x("", !0),
          (t(!0), u(S, null, L(q.value, (r) => (t(), u("button", {
            key: r.key,
            type: "button",
            class: "count-row",
            "data-agent-limit-type": r.type || r.key,
            "data-agent-limit-profile": r.profile,
            onClick: (_) => $(r)
          }, [
            a("strong", null, y(r.label), 1),
            (t(!0), u(S, null, L([{ count: r.running, limit: r.run_limit, unlimited: !1 }, { count: r.kept, limit: r.kept_limit, unlimited: !0 }], (_) => (t(), u("span", {
              key: _.unlimited,
              class: X({ full: m(te)(_.count, _.limit) })
            }, [
              a("span", null, [
                C(y(_.count), 1),
                _.limit || !_.unlimited ? (t(), u(S, { key: 0 }, [
                  C(" of " + y(_.limit), 1)
                ], 64)) : x("", !0)
              ]),
              _.limit ? (t(), u("span", gt, [
                a("span", {
                  style: le({ width: b(_.count, _.limit) })
                }, null, 4),
                a("i", {
                  style: le({ width: v(_.count, _.limit) })
                }, null, 4)
              ])) : x("", !0)
            ], 2))), 128)),
            O(m(Ce), {
              name: "chevronRight",
              size: 12
            })
          ], 8, ct))), 128))
        ], 64)),
        V.value ? (t(), u("p", pt, y(V.value), 1)) : B.value ? (t(), u("p", vt, y(B.value), 1)) : x("", !0)
      ]),
      a("div", mt, [
        R.value ? (t(), u(S, { key: 0 }, [
          a("span", kt, y(B.value || `Changes apply to ${m(o).environment}.`), 1),
          O(m(P), { onClick: Y }, {
            default: I(() => [...e[17] || (e[17] = [
              C("Done", -1)
            ])]),
            _: 1
          })
        ], 64)) : w.value ? x("", !0) : (t(), T(m(P), {
          key: 1,
          disabled: m(o).readOnly,
          "data-agent-limits-edit": "",
          onClick: e[4] || (e[4] = (r) => R.value = !0)
        }, {
          default: I(() => [...e[18] || (e[18] = [
            C("Change the maximums", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]))
      ])
    ]));
  }
}, ft = /* @__PURE__ */ U(yt, [["__scopeId", "data-v-604ef447"]]), bt = {
  class: "agents",
  "data-agent-settings-agents": ""
}, ht = {
  __name: "AgentSettingsAgents",
  setup(l) {
    const g = G(), i = A("Agent counts"), k = (o) => g.open("agents.agents", o.id);
    return he(() => g.reload("limits")), (o, s) => (t(), u("section", bt, [
      O(ft, {
        title: i.value,
        "onUpdate:title": s[0] || (s[0] = (n) => i.value = n),
        onOpenAgent: k
      }, null, 8, ["title"])
    ]));
  }
}, _t = /* @__PURE__ */ U(ht, [["__scopeId", "data-v-3e01c727"]]), $t = {
  __name: "AgentSettingsTests",
  setup(l) {
    return (g, i) => (t(), T(ce, {
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
  setup(l) {
    const g = [
      { key: "journal.suites.coding.auto-mode", label: "Auto mode", line: "The journal hands the main agent its next task, and it keeps going while tasks are left" },
      { key: "journal.suites.coding.main-writes-code", label: "Main agent writes code", line: "The main agent may change project files itself; off, it plans, delegates and merges" },
      { key: "journal.suites.coding.workers.main-dispatches-workers", label: "Main agent sends workers", line: "Whether the main agent may send workers to do tasks." },
      { key: "journal.suites.coding.continue-while-delegatable", label: "Keep going while work can be delegated", line: "Keep the main agent working while open tasks can still be sent to workers." },
      { key: "journal.suites.coding.workers.merger-on", label: "Merger takes in workers", line: "A helper merges workers whose tests passed, and passes on what the main agent must judge." },
      { key: "journal.suites.coding.main-starts-read-only-helpers", label: "Use read-only helpers", line: "Whether the main agent may start read-only helpers." },
      { key: "journal.suites.coding.designer-enabled", label: "Use a designer", line: "Whether the main agent may start a designer, which writes a design document and changes no code." },
      { key: "journal.suites.coding.workers.main-agent-may-merge", label: "Main agent may merge workers", line: "Whether the main agent may merge the work of a worker itself." }
    ], i = [{ key: "builder", label: "Builder" }, { key: "orchestrator", label: "Orchestrator" }], k = [oe], o = G(), s = o.props.work, n = ie({}), p = A(""), M = A(""), E = A(!1), D = h(() => g.filter((v) => {
      var f, $;
      return n[v.key] !== (($ = (f = s.data.value) == null ? void 0 : f.controls) == null ? void 0 : $[v.key]);
    })), K = h(() => D.value.length > 0), R = h(() => K.value && s.data.value && p.value && s.data.value.revision !== p.value), j = h(() => {
      var v;
      return ((v = s.data.value) == null ? void 0 : v.workflow) ?? "";
    }), V = h(() => {
      var v;
      return ((v = s.data.value) == null ? void 0 : v.depends) ?? {};
    }), B = (v) => (V.value[v.key] ?? []).every((f) => n[f] !== !1), F = h(() => g.filter((v) => k.includes(v.key) && B(v))), W = h(() => g.filter((v) => !k.includes(v.key) && B(v))), q = h(() => M.value || (R.value ? "These settings changed since you opened them. Cancel to read them again." : "")), z = h(() => n[oe] === !1 && n[Tt] === !1);
    function w() {
      const v = s.data.value;
      if (v) {
        for (const f of g) n[f.key] = v.controls[f.key];
        p.value = v.revision, M.value = "";
      }
    }
    ne(() => s.data.value, () => {
      (!p.value || !K.value) && w();
    }, { immediate: !0 });
    async function d(v) {
      E.value = !0;
      const f = await o.run(v);
      E.value = !1, f.ok ? (await o.reload("work"), w()) : (M.value = f.error, await o.reload("work"));
    }
    const N = () => d(`work-settings apply --revision ${p.value} ${D.value.map((v) => `${v.key}=${n[v.key] ? "on" : "off"}`).join(" ")}`), b = (v) => d(`work-settings preset ${v} --revision ${p.value}`);
    return (v, f) => (t(), u("section", wt, [
      a("div", Ct, [
        f[0] || (f[0] = a("p", { class: "section-title" }, "Taking on work", -1)),
        O(Z, {
          label: "Workflow",
          help: "A preset sets the switches below at once; Custom is any other mix.",
          "data-work-flow": ""
        }, {
          default: I(() => [
            O(m(re), {
              options: i,
              value: j.value,
              onPick: b
            }, null, 8, ["value"])
          ]),
          _: 1
        }),
        (t(!0), u(S, null, L(F.value, ($) => (t(), T(Z, {
          key: $.key,
          label: $.label,
          help: $.line,
          "data-control": $.key
        }, {
          default: I(() => [
            O(m(ee), {
              on: n[$.key],
              disabled: m(o).readOnly,
              onChange: (Y) => n[$.key] = !n[$.key]
            }, null, 8, ["on", "disabled", "onChange"]),
            a("span", At, y(n[$.key] ? "On" : "Off"), 1)
          ]),
          _: 2
        }, 1032, ["label", "help", "data-control"]))), 128))
      ]),
      a("div", St, [
        f[1] || (f[1] = a("p", { class: "section-title" }, "How the main agent works", -1)),
        f[2] || (f[2] = a("p", { class: "section-help" }, "Your models, maximums and tests stay as you set them.", -1)),
        (t(!0), u(S, null, L(W.value, ($) => (t(), T(Z, {
          key: $.key,
          label: $.label,
          help: $.line,
          "data-control": $.key
        }, {
          default: I(() => [
            O(m(ee), {
              on: n[$.key],
              disabled: m(o).readOnly,
              onChange: (Y) => n[$.key] = !n[$.key]
            }, null, 8, ["on", "disabled", "onChange"]),
            a("span", Ot, y(n[$.key] ? "On" : "Off"), 1)
          ]),
          _: 2
        }, 1032, ["label", "help", "data-control"]))), 128)),
        z.value ? (t(), u("p", xt, "With Auto off and no workers, nothing starts the work: a person starts tasks or turns one of them on.")) : x("", !0)
      ]),
      O(de, {
        changes: D.value.length,
        pending: E.value,
        problem: q.value,
        blocked: R.value,
        onCancel: w,
        onApply: N
      }, null, 8, ["changes", "pending", "problem", "blocked"])
    ]));
  }
}, Nt = /* @__PURE__ */ U(jt, [["__scopeId", "data-v-9f39da05"]]), It = {
  class: "settings",
  "data-agent-settings": ""
}, Mt = { class: "settings-bar" }, Rt = { class: "settings-body" }, Vt = {
  key: 0,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, Bt = {
  __name: "AgentSettings",
  setup(l) {
    const g = G(), i = A("work"), k = h(() => {
      var n;
      return ue(((n = g.props.limits) == null ? void 0 : n.rows.value) ?? []).filter((p) => te(p.running, p.run_limit) || te(p.kept, p.kept_limit)).length;
    }), o = h(() => [{ key: "work", label: "Work" }, { key: "agents", label: k.value ? `Agents ${k.value}` : "Agents" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }]);
    function s(n) {
      i.value = n, g.state.tab = n === "agents" ? "agents" : "";
    }
    return (n, p) => (t(), T(m(Ae), { padding: "0" }, {
      default: I(() => [
        a("div", It, [
          a("div", Mt, [
            O(m(re), {
              options: o.value,
              value: i.value,
              onPick: s
            }, null, 8, ["options", "value"])
          ]),
          a("div", Rt, [
            m(g).readOnly ? (t(), u("p", Vt, "Only a person can change these settings. You can read every value, and ask a person for a change.")) : x("", !0),
            i.value === "work" ? (t(), T(Nt, { key: 1 })) : i.value === "agents" ? (t(), T(_t, { key: 2 })) : i.value === "tests" ? (t(), T($t, { key: 3 })) : (t(), T(ze, { key: 4 }))
          ])
        ])
      ]),
      _: 1
    }));
  }
}, Pt = /* @__PURE__ */ U(Bt, [["__scopeId", "data-v-f9bdd5f3"]]);
export {
  Pt as A
};
