import { openBlock as a, createElementBlock as d, createElementVNode as l, computed as w, normalizeClass as D, toDisplayString as h, renderSlot as pe, createTextVNode as S, createCommentVNode as x, createVNode as $, unref as m, withCtx as A, reactive as oe, ref as C, watch as ee, Fragment as T, renderList as L, createBlock as V, withModifiers as me, useModel as ke, normalizeStyle as ae, mergeModels as ye, onMounted as fe } from "vue";
import { useWindow as G, Btn as K, Switch as ie, TextInput as be, useNow as he, age as we, Icon as $e, Segmented as _e, WindowRoom as Se, InnerTabs as Ce, TabBody as Ae, SwitchCase as Oe } from "@journal/window-kit";
import { _ as W } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const Te = { class: "step" }, je = ["disabled"], xe = ["value", "disabled"], Ie = ["disabled"], Ne = {
  __name: "NumberStep",
  props: { modelValue: { type: [Number, String], default: 0 }, disabled: { type: Boolean, default: !1 } },
  emits: ["update:modelValue"],
  setup(e, { emit: c }) {
    const o = e, p = c, i = (n) => p("update:modelValue", Math.max(0, (Number(o.modelValue) || 0) + n));
    return (n, u) => (a(), d("span", Te, [
      l("button", {
        type: "button",
        disabled: e.disabled || Number(e.modelValue) <= 0,
        "aria-label": "Less",
        onClick: u[0] || (u[0] = (f) => i(-1))
      }, "−", 8, je),
      l("input", {
        type: "number",
        min: "0",
        value: e.modelValue,
        disabled: e.disabled,
        onInput: u[1] || (u[1] = (f) => p("update:modelValue", f.target.value))
      }, null, 40, xe),
      l("button", {
        type: "button",
        disabled: e.disabled,
        "aria-label": "More",
        onClick: u[2] || (u[2] = (f) => i(1))
      }, "+", 8, Ie)
    ]));
  }
}, Be = /* @__PURE__ */ W(Ne, [["__scopeId", "data-v-a7b54780"]]), Me = { class: "ctl-text" }, Re = { class: "ctl-label" }, Ve = { class: "ctl-help" }, We = { class: "ctl-input" }, Fe = {
  key: 0,
  class: "ctl-src"
}, Ue = {
  __name: "SettingRow",
  props: { label: { type: String, required: !0 }, help: { type: String, default: "" }, source: { type: String, default: "" }, changed: { type: Boolean, default: !1 } },
  setup(e) {
    const c = e, o = G(), p = { environment: () => `This environment, ${o.environment}`, project: () => "Every environment", default: () => "Default" }, i = w(() => {
      var n;
      return c.changed ? "Changed, not applied" : ((n = p[c.source]) == null ? void 0 : n.call(p)) ?? "";
    });
    return (n, u) => (a(), d("div", {
      class: D(["ctl", { flat: !e.source }])
    }, [
      l("div", Me, [
        l("span", Re, h(e.label), 1),
        l("span", Ve, h(e.help), 1)
      ]),
      l("div", We, [
        pe(n.$slots, "default", {}, void 0, !0)
      ]),
      e.source ? (a(), d("div", Fe, [
        l("span", {
          class: D(["src", { here: e.source === "environment", changed: e.changed }]),
          "data-setting-source": ""
        }, [
          u[0] || (u[0] = l("i", null, null, -1)),
          S(h(i.value), 1)
        ], 2)
      ])) : x("", !0)
    ], 2));
  }
}, te = /* @__PURE__ */ W(Ue, [["__scopeId", "data-v-c011fa59"]]), Ee = { class: "foot" }, Pe = {
  __name: "SettingsFoot",
  props: { changes: { type: Number, default: 0 }, pending: { type: Boolean, default: !1 }, problem: { type: String, default: "" }, blocked: { type: Boolean, default: !1 } },
  emits: ["cancel", "apply"],
  setup(e, { emit: c }) {
    const o = e, p = c, i = G(), n = w(() => o.problem ? o.problem : o.pending ? "Applying." : o.changes ? `${o.changes} ${o.changes === 1 ? "change" : "changes"} to apply to ${i.environment}.` : `No changes. For the environment ${i.environment}.`);
    return (u, f) => (a(), d("div", Ee, [
      l("span", {
        class: D(["foot-note", { bad: e.problem, busy: e.pending }]),
        role: "status"
      }, h(n.value), 3),
      $(m(K), {
        bordered: "",
        disabled: !e.changes || e.pending,
        "data-settings-cancel": "",
        onClick: f[0] || (f[0] = (B) => p("cancel"))
      }, {
        default: A(() => [...f[2] || (f[2] = [
          S("Cancel", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      $(m(K), {
        variant: "primary",
        disabled: !e.changes || e.pending || e.blocked || m(i).readOnly,
        "data-settings-apply": "",
        onClick: f[1] || (f[1] = (B) => p("apply"))
      }, {
        default: A(() => [...f[3] || (f[3] = [
          S("Apply", -1)
        ])]),
        _: 1
      }, 8, ["disabled"])
    ]));
  }
}, re = /* @__PURE__ */ W(Pe, [["__scopeId", "data-v-ceae936f"]]), qe = ["data-agent-settings-group"], Ke = { class: "sw-word" }, Le = ["value", "disabled", "data-field", "onChange"], He = ["value"], ze = ["data-field-badge"], De = {
  __name: "AgentSettingsGroup",
  props: { group: { type: String, required: !0 } },
  setup(e) {
    const c = e, o = (g) => typeof g == "number" ? `${g / 1e3}k` : `${g.charAt(0).toUpperCase()}${g.slice(1)}`, p = G(), i = p.props.work, n = oe({}), u = C(""), f = C(""), B = C(!1), F = w(() => {
      var g;
      return (((g = i.data.value) == null ? void 0 : g.fields) ?? []).filter((j) => j.group === c.group);
    }), H = w(() => F.value.filter((g) => {
      var j, b;
      return (((b = (j = i.data.value) == null ? void 0 : j.depends) == null ? void 0 : b[g.key]) ?? []).every((v) => n[v] !== !1);
    })), U = (g) => g.type === "flag" ? !!g.value : String(g.value), I = (g) => (g.type === "flag" ? n[g.key] : String(n[g.key])) !== U(g), N = w(() => F.value.filter(I)), q = w(() => N.value.length > 0), M = w(() => {
      var g;
      return q.value && u.value && ((g = i.data.value) == null ? void 0 : g.revision) !== u.value;
    }), R = (g) => g.type === "flag" ? n[g.key] ? "on" : "off" : String(n[g.key]).trim(), z = w(() => N.value.some((g) => g.type !== "flag" && R(g) === ""));
    function E() {
      var g;
      for (const j of F.value) n[j.key] = U(j);
      u.value = ((g = i.data.value) == null ? void 0 : g.revision) ?? "", f.value = "";
    }
    ee(() => i.data.value, () => {
      (!u.value || !q.value) && E();
    }, { immediate: !0 });
    const _ = w(() => f.value || (M.value ? "These settings changed since you opened them. Cancel to read them again." : "") || (z.value ? "A number is missing." : ""));
    async function P() {
      B.value = !0;
      const g = await p.run(`work-settings apply --revision ${u.value} ${N.value.map((j) => `${j.key}=${R(j)}`).join(" ")}`);
      B.value = !1, f.value = g.ok ? "" : g.error, await p.reload("work"), g.ok && E();
    }
    return (g, j) => (a(), d("section", {
      class: "group",
      "data-agent-settings-group": e.group
    }, [
      (a(!0), d(T, null, L(H.value, (b) => (a(), V(te, {
        key: b.key,
        label: b.title,
        help: b.description,
        source: b.source,
        changed: I(b),
        "data-control": b.key
      }, {
        default: A(() => {
          var v;
          return [
            b.type === "flag" ? (a(), d(T, { key: 0 }, [
              $(m(ie), {
                on: n[b.key],
                disabled: m(p).readOnly,
                onChange: (k) => n[b.key] = !n[b.key]
              }, null, 8, ["on", "disabled", "onChange"]),
              l("span", Ke, h(n[b.key] ? "On" : "Off"), 1)
            ], 64)) : (v = b.choices) != null && v.length ? (a(), d("select", {
              key: 1,
              class: "choice",
              value: n[b.key],
              disabled: m(p).readOnly,
              "data-field": b.key,
              onChange: (k) => n[b.key] = k.target.value
            }, [
              (a(!0), d(T, null, L(b.choices, (k) => (a(), d("option", {
                key: k,
                value: String(k)
              }, h(o(k)), 9, He))), 128))
            ], 40, Le)) : (a(), V(Be, {
              key: 2,
              modelValue: n[b.key],
              "onUpdate:modelValue": (k) => n[b.key] = k,
              disabled: m(p).readOnly,
              "data-field": b.key
            }, null, 8, ["modelValue", "onUpdate:modelValue", "disabled", "data-field"])),
            b.badge ? (a(), d("span", {
              key: 3,
              class: "badge",
              "data-field-badge": b.key
            }, h(b.badge), 9, ze)) : x("", !0)
          ];
        }),
        _: 2
      }, 1032, ["label", "help", "source", "changed", "data-control"]))), 128)),
      $(re, {
        changes: N.value.length,
        pending: B.value,
        problem: _.value,
        blocked: M.value || z.value,
        onCancel: E,
        onApply: P
      }, null, 8, ["changes", "pending", "problem", "blocked"])
    ], 8, qe));
  }
}, ue = /* @__PURE__ */ W(De, [["__scopeId", "data-v-f06fd592"]]), Ge = {
  __name: "AgentSettingsAdvanced",
  setup(e) {
    return (c, o) => (a(), V(ue, {
      group: "advanced",
      "data-agent-settings-advanced": ""
    }));
  }
}, Ye = { class: "action-buttons" }, Je = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (c, o) => (a(), d("form", {
      "data-agent-retire-confirm": "",
      onSubmit: o[2] || (o[2] = me((p) => c.$emit("submit"), ["prevent"]))
    }, [
      o[5] || (o[5] = l("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      $(m(be), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": o[0] || (o[0] = (p) => c.$emit("update:reason", p))
      }, null, 8, ["model-value", "disabled"]),
      l("div", Ye, [
        $(m(K), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: A(() => [...o[3] || (o[3] = [
            S("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        $(m(K), {
          small: "",
          disabled: e.pending,
          onClick: o[1] || (o[1] = (p) => c.$emit("cancel"))
        }, {
          default: A(() => [...o[4] || (o[4] = [
            S("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Qe = /* @__PURE__ */ W(Je, [["__scopeId", "data-v-818a34c9"]]), Xe = ["data-edit-type"], Ze = { class: "stepper" }, et = ["disabled", "onClick"], tt = ["value", "disabled", "data-agent-limit-input", "onChange"], nt = ["disabled", "onClick"], at = { key: 0 }, st = { key: 1 }, lt = {
  __name: "AgentLimitEditor",
  props: { row: { type: Object, required: !0 }, pending: Boolean, readOnly: Boolean, environment: { type: String, required: !0 } },
  emits: ["change"],
  setup(e, { emit: c }) {
    const o = c;
    return (p, i) => (a(), d(T, null, [
      i[0] || (i[0] = l("p", null, "How many may run at once, and how many may be kept.", -1)),
      l("div", {
        class: "edit-row",
        "data-edit-type": e.row.key
      }, [
        (a(!0), d(T, null, L([{ name: "Most running", value: e.row.run_limit, source: e.row.run_source, kind: "run" }, { name: "Most kept", value: e.row.kept_limit, source: e.row.kept_source, kind: "kept" }], (n) => (a(), d("label", {
          key: n.kind
        }, [
          S(h(n.name), 1),
          l("span", Ze, [
            l("button", {
              type: "button",
              disabled: e.pending || e.readOnly || n.value === 0,
              onClick: (u) => o("change", n.kind, n.value - 1)
            }, "−", 8, et),
            l("input", {
              type: "number",
              min: "0",
              value: n.value,
              disabled: e.pending || e.readOnly,
              "data-agent-limit-input": n.kind,
              onChange: (u) => o("change", n.kind, u.target.value)
            }, null, 40, tt),
            l("button", {
              type: "button",
              disabled: e.pending || e.readOnly,
              onClick: (u) => o("change", n.kind, n.value + 1)
            }, "+", 8, nt)
          ]),
          n.value === 0 ? (a(), d("small", at, h(n.kind === "run" ? "None can start" : "Any number"), 1)) : n.source === `environment ${e.environment}` ? (a(), d("small", st, "Changed for " + h(e.environment), 1)) : x("", !0)
        ]))), 128))
      ], 8, Xe)
    ], 64));
  }
}, ot = /* @__PURE__ */ W(lt, [["__scopeId", "data-v-736ca02f"]]), it = (e) => e.flatMap((c) => c.per_profile ? c.profiles.map((o) => ({ ...o, label: o.title, type: c.key, key: `${c.key}:${o.profile}` })) : [{ ...c, type: c.key }]), rt = (e, c) => c > 0 && e >= c, ut = { class: "counts-panel" }, dt = ["data-count-agent"], ct = { class: "person-text" }, gt = {
  key: 0,
  class: "helper-head"
}, vt = ["data-agent-limit-type", "data-agent-limit-profile", "onClick"], pt = {
  key: 0,
  class: "bar"
}, mt = {
  key: 4,
  role: "alert"
}, kt = {
  key: 5,
  role: "status"
}, yt = {
  __name: "AgentCountsPanel",
  props: {
    title: { default: "Agent counts" },
    titleModifiers: {}
  },
  emits: /* @__PURE__ */ ye(["open-agent", "close"], ["update:title"]),
  setup(e, { emit: c }) {
    const o = c, p = ke(e, "title"), i = G(), n = w(() => i.props.limits.rows.value ?? []), u = w(() => i.props.limits.failure.value), f = C([]), B = C(0), F = C(!1), H = he(), U = C(null), I = C(!1), N = C(""), q = C(""), M = C(null), R = C(""), z = w(() => it(n.value)), E = w(() => n.value.find((r) => r.per_profile)), _ = w(() => z.value.find((r) => r.key === U.value)), P = w(() => f.value.filter((r) => {
      var t, s;
      return r.state !== "retired" && r.role === ((t = _.value) == null ? void 0 : t.type) && (!_.value.profile || (((s = r.facts) == null ? void 0 : s.profile) || r.profile) === _.value.profile);
    }).sort((r, t) => (r.state !== "running") - (t.state !== "running") || String(r.ended_at || r.created_at).localeCompare(String(t.ended_at || t.created_at)))), g = w(() => {
      var t;
      const r = /* @__PURE__ */ new Map();
      for (const s of P.value) {
        const y = ((t = s.facts) == null ? void 0 : t.model) || s.program_model;
        y && r.set(y, (r.get(y) || 0) + 1);
      }
      return [...r].map(([s, y]) => `${y} ${s}`).join(", ");
    }), j = (r, t) => t ? `${Math.min(r / Math.max(r, t) * 100, 100)}%` : "0%", b = (r, t) => t && r > t ? `${(r - t) / r * 100}%` : "0%", v = w(() => {
      var r;
      return ((r = _.value) == null ? void 0 : r.key) ?? "counts";
    });
    ee(() => {
      var r;
      return ((r = _.value) == null ? void 0 : r.label) || "Agent counts";
    }, (r) => {
      p.value = r;
    }, { immediate: !0 });
    async function k(r, t = 1) {
      i.state["count-agents.role"] = r.type, r.profile ? i.state["count-agents.profile"] = r.profile : delete i.state["count-agents.profile"], i.state["count-agents.page"] = String(t), await i.reload("count-agents");
      const s = i.props["count-agents"];
      f.value = t === 1 ? [...s.rows.value] : [...f.value, ...s.rows.value], B.value = t, F.value = s.more.value;
    }
    function O(r) {
      U.value = r.key, f.value = [], k(r);
    }
    function Z() {
      U.value = null, M.value = null, N.value = "";
    }
    function de() {
      Z(), o("close");
    }
    async function ce(r, t) {
      if (I.value || i.readOnly) return;
      const s = Number(t);
      if (!String(t).trim() || !Number.isInteger(s) || s < 0) {
        N.value = "Use a whole number of 0 or more.";
        return;
      }
      I.value = !0, N.value = "";
      const y = _.value, Y = { run: y.run_limit, kept: y.kept_limit, [r]: s }, J = ["--environment", i.environment], Q = await i.run(y.profile ? ["agent", "profile-limits", y.type, y.profile, "--running", String(Y.run), "--kept", String(Y.kept), ...J] : ["setting", "set", r === "run" ? y.run_setting : y.kept_setting, String(s), ...J]);
      Q.ok ? await i.reload("limits") : N.value = Q.error, I.value = !1;
    }
    async function ge(r) {
      if (!R.value.trim() || I.value) return;
      I.value = !0;
      const t = await i.run(["agent", "retire", String(r.number), "--reason", R.value.trim()]);
      N.value = t.ok ? "" : "The agent could not be retired. Try again.", t.ok && (M.value = null, R.value = "", q.value = "Agent retired permanently.", await i.reload("limits"), await k(_.value)), I.value = !1;
    }
    function ve(r) {
      de(), o("open-agent", r);
    }
    return (r, t) => (a(), d("div", ut, [
      (a(), d("div", {
        key: v.value,
        class: D(["counts", { padded: u.value || _.value }]),
        "data-counts-screen": ""
      }, [
        _.value ? (a(), d("button", {
          key: 0,
          class: "back",
          type: "button",
          onClick: Z
        }, "‹ Back")) : x("", !0),
        u.value ? (a(), d(T, { key: 1 }, [
          t[5] || (t[5] = l("strong", null, "The counts could not be read", -1)),
          t[6] || (t[6] = l("p", null, "The journal did not answer.", -1)),
          $(m(K), {
            small: "",
            onClick: t[0] || (t[0] = (s) => m(i).reload("limits"))
          }, {
            default: A(() => [...t[4] || (t[4] = [
              S("Try again", -1)
            ])]),
            _: 1
          })
        ], 64)) : _.value ? (a(), d(T, { key: 2 }, [
          $(ot, {
            row: _.value,
            pending: I.value,
            "read-only": m(i).readOnly,
            environment: m(i).environment,
            onChange: ce
          }, null, 8, ["row", "pending", "read-only", "environment"]),
          l("p", null, [
            l("strong", null, h(_.value.running) + " of " + h(_.value.run_limit), 1),
            t[7] || (t[7] = S(" running, ", -1)),
            l("strong", null, [
              S(h(_.value.kept), 1),
              _.value.kept_limit ? (a(), d(T, { key: 0 }, [
                S(" of " + h(_.value.kept_limit), 1)
              ], 64)) : x("", !0)
            ]),
            t[8] || (t[8] = S(" kept", -1))
          ]),
          l("p", null, h(g.value), 1),
          P.value.length ? x("", !0) : (a(), d(T, { key: 0 }, [
            t[9] || (t[9] = l("strong", null, "No agents here yet", -1)),
            t[10] || (t[10] = l("p", null, "An agent shows here as soon as one of this type starts.", -1))
          ], 64)),
          (a(!0), d(T, null, L(P.value, (s) => {
            var y, Y, J, Q, ne;
            return a(), d("div", {
              key: s.id,
              class: "person",
              "data-count-agent": s.id
            }, [
              l("span", {
                class: D(["dot", { running: s.state === "running" }])
              }, null, 2),
              l("div", ct, [
                l("strong", null, h(((y = s.facts) == null ? void 0 : y.given_name) || s.number), 1),
                S(" " + h(s.state === "running" ? "Running" : "Idle") + ", " + h(m(we)(s.state === "running" ? s.process_started_at || s.created_at : s.ended_at, m(H))), 1),
                l("small", null, h([s.program, (Y = s.facts) == null ? void 0 : Y.model, (J = s.facts) == null ? void 0 : J.effort, `${s.role} ${s.id}`].filter(Boolean).join(", ")), 1),
                l("small", null, h(((Q = s.facts) == null ? void 0 : Q.task_title) || ((ne = s.facts) == null ? void 0 : ne.helper_job)), 1)
              ]),
              $(m(K), {
                small: "",
                onClick: (X) => ve(s)
              }, {
                default: A(() => [...t[11] || (t[11] = [
                  S("Open", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              s.state === "idle" && !m(i).readOnly ? (a(), V(m(K), {
                key: 0,
                small: "",
                onClick: (X) => {
                  M.value = s.id, R.value = "";
                }
              }, {
                default: A(() => [...t[12] || (t[12] = [
                  S("Retire", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : x("", !0),
              M.value === s.id ? (a(), V(Qe, {
                key: 1,
                reason: R.value,
                "onUpdate:reason": t[1] || (t[1] = (X) => R.value = X),
                pending: I.value,
                onSubmit: (X) => ge(s),
                onCancel: t[2] || (t[2] = (X) => M.value = null)
              }, null, 8, ["reason", "pending", "onSubmit"])) : x("", !0)
            ], 8, dt);
          }), 128)),
          F.value ? (a(), V(m(K), {
            key: 1,
            small: "",
            onClick: t[3] || (t[3] = (s) => k(_.value, B.value + 1))
          }, {
            default: A(() => [...t[13] || (t[13] = [
              S("Show more", -1)
            ])]),
            _: 1
          })) : x("", !0)
        ], 64)) : (a(), d(T, { key: 3 }, [
          t[15] || (t[15] = l("div", { class: "columns" }, [
            l("span", null, "Name"),
            l("span", null, "Running"),
            l("span", null, "Kept"),
            l("span")
          ], -1)),
          E.value ? (a(), d("div", gt, [
            t[14] || (t[14] = l("strong", null, "Read-only helpers", -1)),
            l("span", null, h(E.value.running) + " running, " + h(E.value.kept) + " kept", 1)
          ])) : x("", !0),
          (a(!0), d(T, null, L(z.value, (s) => (a(), d("button", {
            key: s.key,
            type: "button",
            class: "count-row",
            "data-agent-limit-type": s.type || s.key,
            "data-agent-limit-profile": s.profile,
            onClick: (y) => O(s)
          }, [
            l("strong", null, h(s.label), 1),
            (a(!0), d(T, null, L([{ count: s.running, limit: s.run_limit, unlimited: !1 }, { count: s.kept, limit: s.kept_limit, unlimited: !0 }], (y) => (a(), d("span", {
              key: y.unlimited,
              class: D({ full: m(rt)(y.count, y.limit) })
            }, [
              l("span", null, [
                S(h(y.count), 1),
                y.limit || !y.unlimited ? (a(), d(T, { key: 0 }, [
                  S(" of " + h(y.limit), 1)
                ], 64)) : x("", !0)
              ]),
              y.limit ? (a(), d("span", pt, [
                l("span", {
                  style: ae({ width: j(y.count, y.limit) })
                }, null, 4),
                l("i", {
                  style: ae({ width: b(y.count, y.limit) })
                }, null, 4)
              ])) : x("", !0)
            ], 2))), 128)),
            $(m($e), {
              name: "chevronRight",
              size: 12
            })
          ], 8, vt))), 128))
        ], 64)),
        N.value ? (a(), d("p", mt, h(N.value), 1)) : q.value ? (a(), d("p", kt, h(q.value), 1)) : x("", !0)
      ], 2))
    ]));
  }
}, ft = /* @__PURE__ */ W(yt, [["__scopeId", "data-v-002e1f26"]]), bt = {
  class: "agents",
  "data-agent-settings-agents": ""
}, ht = {
  __name: "AgentSettingsAgents",
  setup(e) {
    const c = G(), o = C("Agent counts"), p = (i) => c.open("agents.agents", i.id);
    return fe(() => c.reload("limits")), (i, n) => (a(), d("section", bt, [
      $(ft, {
        title: o.value,
        "onUpdate:title": n[0] || (n[0] = (u) => o.value = u),
        onOpenAgent: p
      }, null, 8, ["title"])
    ]));
  }
}, wt = /* @__PURE__ */ W(ht, [["__scopeId", "data-v-8e37e089"]]), $t = {
  __name: "AgentSettingsTests",
  setup(e) {
    return (c, o) => (a(), V(ue, {
      group: "tests",
      "data-agent-settings-tests": ""
    }));
  }
}, _t = { class: "sw-word" }, St = {
  __name: "SettingSwitchRow",
  props: { control: { type: Object, required: !0 }, on: { type: Boolean, default: !1 }, disabled: { type: Boolean, default: !1 } },
  emits: ["change"],
  setup(e) {
    return (c, o) => (a(), V(te, {
      label: e.control.label,
      help: e.control.line,
      "data-control": e.control.key
    }, {
      default: A(() => [
        $(m(ie), {
          on: e.on,
          disabled: e.disabled,
          onChange: o[0] || (o[0] = (p) => c.$emit("change"))
        }, null, 8, ["on", "disabled"]),
        l("span", _t, h(e.on ? "On" : "Off"), 1)
      ]),
      _: 1
    }, 8, ["label", "help", "data-control"]));
  }
}, se = /* @__PURE__ */ W(St, [["__scopeId", "data-v-f092daf2"]]), Ct = {
  class: "work",
  "data-agent-settings-work": ""
}, At = { class: "section" }, Ot = { class: "section" }, Tt = {
  key: 0,
  class: "section-help warn",
  "data-work-hint": ""
}, le = "journal.suites.coding.auto-mode", jt = "journal.suites.coding.workers.main-dispatches-workers", xt = {
  __name: "AgentSettingsWork",
  setup(e) {
    const c = [
      { key: "journal.suites.coding.auto-mode", label: "Auto mode", line: "The journal hands the main agent its next task, and it keeps going while tasks are left" },
      { key: "journal.suites.coding.main-writes-code", label: "Main agent writes code", line: "The main agent may change project files itself; off, it plans, delegates and merges" },
      { key: "journal.suites.coding.workers.main-dispatches-workers", label: "Main agent sends workers", line: "Whether the main agent may send workers to do tasks." },
      { key: "journal.suites.coding.continue-while-delegatable", label: "Keep going while work can be delegated", line: "Keep the main agent working while open tasks can still be sent to workers." },
      { key: "journal.suites.coding.workers.merger-on", label: "Merger takes in workers", line: "A helper merges workers whose tests passed, and passes on what the main agent must judge." },
      { key: "journal.suites.coding.main-starts-read-only-helpers", label: "Use read-only helpers", line: "Whether the main agent may start read-only helpers." },
      { key: "journal.suites.coding.designer-enabled", label: "Use a designer", line: "Whether the main agent may start a designer, which writes a design document and changes no code." },
      { key: "journal.suites.coding.workers.main-agent-may-merge", label: "Main agent may merge workers", line: "Whether the main agent may merge the work of a worker itself." }
    ], o = [{ key: "builder", label: "Builder" }, { key: "orchestrator", label: "Orchestrator" }], p = [le], i = G(), n = i.props.work, u = oe({}), f = C(""), B = C(""), F = C(!1), H = w(() => c.filter((v) => {
      var k, O;
      return u[v.key] !== ((O = (k = n.data.value) == null ? void 0 : k.controls) == null ? void 0 : O[v.key]);
    })), U = w(() => H.value.length > 0), I = w(() => U.value && n.data.value && f.value && n.data.value.revision !== f.value), N = w(() => {
      var v;
      return ((v = n.data.value) == null ? void 0 : v.workflow) ?? "";
    }), q = w(() => {
      var v;
      return ((v = n.data.value) == null ? void 0 : v.depends) ?? {};
    }), M = (v) => (q.value[v.key] ?? []).every((k) => u[k] !== !1), R = w(() => c.filter((v) => p.includes(v.key) && M(v))), z = w(() => c.filter((v) => !p.includes(v.key) && M(v))), E = w(() => B.value || (I.value ? "These settings changed since you opened them. Cancel to read them again." : "")), _ = w(() => u[le] === !1 && u[jt] === !1);
    function P() {
      const v = n.data.value;
      if (v) {
        for (const k of c) u[k.key] = v.controls[k.key];
        f.value = v.revision, B.value = "";
      }
    }
    ee(() => n.data.value, () => {
      (!f.value || !U.value) && P();
    }, { immediate: !0 });
    async function g(v) {
      F.value = !0;
      const k = await i.run(v);
      F.value = !1, k.ok ? (await i.reload("work"), P()) : (B.value = k.error, await i.reload("work"));
    }
    const j = () => g(`work-settings apply --revision ${f.value} ${H.value.map((v) => `${v.key}=${u[v.key] ? "on" : "off"}`).join(" ")}`), b = (v) => g(`work-settings preset ${v} --revision ${f.value}`);
    return (v, k) => (a(), d("section", Ct, [
      l("div", At, [
        k[0] || (k[0] = l("p", { class: "section-title" }, "Taking on work", -1)),
        $(te, {
          label: "Workflow",
          help: "A preset sets the switches below at once; Custom is any other mix.",
          "data-work-flow": ""
        }, {
          default: A(() => [
            $(m(_e), {
              options: o,
              value: N.value,
              onPick: b
            }, null, 8, ["value"])
          ]),
          _: 1
        }),
        (a(!0), d(T, null, L(R.value, (O) => (a(), V(se, {
          key: O.key,
          control: O,
          on: u[O.key],
          disabled: m(i).readOnly,
          onChange: (Z) => u[O.key] = !u[O.key]
        }, null, 8, ["control", "on", "disabled", "onChange"]))), 128))
      ]),
      l("div", Ot, [
        k[1] || (k[1] = l("p", { class: "section-title" }, "How the main agent works", -1)),
        k[2] || (k[2] = l("p", { class: "section-help" }, "Your models, maximums and tests stay as you set them.", -1)),
        (a(!0), d(T, null, L(z.value, (O) => (a(), V(se, {
          key: O.key,
          control: O,
          on: u[O.key],
          disabled: m(i).readOnly,
          onChange: (Z) => u[O.key] = !u[O.key]
        }, null, 8, ["control", "on", "disabled", "onChange"]))), 128)),
        _.value ? (a(), d("p", Tt, "With Auto off and no workers, nothing starts the work: a person starts tasks or turns one of them on.")) : x("", !0)
      ]),
      $(re, {
        changes: H.value.length,
        pending: F.value,
        problem: E.value,
        blocked: I.value,
        onCancel: P,
        onApply: j
      }, null, 8, ["changes", "pending", "problem", "blocked"])
    ]));
  }
}, It = /* @__PURE__ */ W(xt, [["__scopeId", "data-v-d19fa95b"]]), Nt = {
  class: "settings",
  "data-agent-settings": ""
}, Bt = { class: "settings-bar" }, Mt = {
  key: 0,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, Rt = {
  __name: "AgentSettings",
  setup(e) {
    const c = G(), o = C("work"), p = [{ key: "work", label: "Work" }, { key: "agents", label: "Helpers" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }], i = w(() => p.find((u) => u.key === o.value));
    function n(u) {
      o.value = u.key, c.state.tab = u.key === "agents" ? "agents" : "";
    }
    return (u, f) => (a(), V(m(Se), { padding: "0" }, {
      default: A(() => [
        l("div", Nt, [
          l("div", Bt, [
            $(m(Ce), {
              tabs: p,
              active: i.value,
              onChoose: n
            }, null, 8, ["active"])
          ]),
          l("div", {
            class: D(["settings-body", { flush: o.value === "agents" }])
          }, [
            m(c).readOnly ? (a(), d("p", Mt, "Only a person can change these settings. You can read every value, and ask a person for a change.")) : x("", !0),
            $(m(Ae), { tab: i.value }, {
              default: A(() => [
                $(m(Oe), { value: o.value }, {
                  work: A(() => [
                    $(It)
                  ]),
                  agents: A(() => [
                    $(wt)
                  ]),
                  tests: A(() => [
                    $($t)
                  ]),
                  advanced: A(() => [
                    $(Ge)
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
}, Ut = /* @__PURE__ */ W(Rt, [["__scopeId", "data-v-ba24ef5a"]]);
export {
  Ut as A
};
