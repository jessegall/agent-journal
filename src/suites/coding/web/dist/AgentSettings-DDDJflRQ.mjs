import { openBlock as o, createElementBlock as d, withModifiers as ie, createElementVNode as s, createVNode as _, unref as l, withCtx as h, createTextVNode as $, Fragment as O, renderList as L, toDisplayString as p, createCommentVNode as y, useModel as ue, computed as w, ref as S, watch as X, normalizeClass as P, createBlock as x, normalizeStyle as Q, mergeModels as de, onMounted as ce, renderSlot as ve } from "vue";
import { TextInput as me, Btn as R, useWindow as K, useNow as pe, age as ge, Icon as ye, WindowRoom as ke, InnerTabs as fe, TabBody as be, SwitchCase as $e } from "@journal/window-kit";
import { isFull as _e, sectionsOf as we, SettingSectionList as he, SettingsScreen as Se, useSettingsDraft as Ce, ChangeFoot as Ae } from "@journal/setting-components";
import { _ as M } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const Oe = { class: "action-buttons" }, Ie = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(r) {
    return (m, a) => (o(), d("form", {
      "data-agent-retire-confirm": "",
      onSubmit: a[2] || (a[2] = ie((k) => m.$emit("submit"), ["prevent"]))
    }, [
      a[5] || (a[5] = s("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      _(l(me), {
        "model-value": r.reason,
        label: "Reason",
        disabled: r.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": a[0] || (a[0] = (k) => m.$emit("update:reason", k))
      }, null, 8, ["model-value", "disabled"]),
      s("div", Oe, [
        _(l(R), {
          type: "submit",
          small: "",
          disabled: r.pending || !r.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: h(() => [...a[3] || (a[3] = [
            $("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        _(l(R), {
          small: "",
          disabled: r.pending,
          onClick: a[1] || (a[1] = (k) => m.$emit("cancel"))
        }, {
          default: h(() => [...a[4] || (a[4] = [
            $("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, xe = /* @__PURE__ */ M(Ie, [["__scopeId", "data-v-818a34c9"]]), Be = ["data-edit-type"], Te = { class: "stepper" }, je = ["disabled", "onClick"], Re = ["value", "disabled", "data-agent-limit-input", "onChange"], Me = ["disabled", "onClick"], Ne = { key: 0 }, Ee = { key: 1 }, Fe = {
  __name: "AgentLimitEditor",
  props: { row: { type: Object, required: !0 }, pending: Boolean, readOnly: Boolean, environment: { type: String, required: !0 } },
  emits: ["change"],
  setup(r, { emit: m }) {
    const a = m;
    return (k, u) => (o(), d(O, null, [
      u[0] || (u[0] = s("p", null, "How many may run at once, and how many may be kept.", -1)),
      s("div", {
        class: "edit-row",
        "data-edit-type": r.row.key
      }, [
        (o(!0), d(O, null, L([{ name: "Most running", value: r.row.run_limit, source: r.row.run_source, kind: "run" }, { name: "Most kept", value: r.row.kept_limit, source: r.row.kept_source, kind: "kept" }], (c) => (o(), d("label", {
          key: c.kind
        }, [
          $(p(c.name), 1),
          s("span", Te, [
            s("button", {
              type: "button",
              disabled: r.pending || r.readOnly || c.value === 0,
              onClick: (f) => a("change", c.kind, c.value - 1)
            }, "−", 8, je),
            s("input", {
              type: "number",
              min: "0",
              value: c.value,
              disabled: r.pending || r.readOnly,
              "data-agent-limit-input": c.kind,
              onChange: (f) => a("change", c.kind, f.target.value)
            }, null, 40, Re),
            s("button", {
              type: "button",
              disabled: r.pending || r.readOnly,
              onClick: (f) => a("change", c.kind, c.value + 1)
            }, "+", 8, Me)
          ]),
          c.value === 0 ? (o(), d("small", Ne, p(c.kind === "run" ? "None can start" : "Any number"), 1)) : c.source === `environment ${r.environment}` ? (o(), d("small", Ee, "Changed for " + p(r.environment), 1)) : y("", !0)
        ]))), 128))
      ], 8, Be)
    ], 64));
  }
}, Ve = /* @__PURE__ */ M(Fe, [["__scopeId", "data-v-736ca02f"]]), qe = (r) => r.flatMap((m) => m.per_profile ? m.profiles.map((a) => ({ ...a, label: a.title, type: m.key, key: `${m.key}:${a.profile}` })) : [{ ...m, type: m.key }]), Le = { class: "counts-panel" }, Pe = ["data-count-agent"], Ue = { class: "person-text" }, We = {
  key: 0,
  class: "helper-head"
}, ze = ["data-agent-limit-type", "data-agent-limit-profile", "onClick"], De = {
  key: 0,
  class: "bar"
}, He = {
  key: 4,
  role: "alert"
}, Ke = {
  key: 5,
  role: "status"
}, Ye = {
  __name: "AgentCountsPanel",
  props: {
    title: { default: "Agent counts" },
    titleModifiers: {}
  },
  emits: /* @__PURE__ */ de(["open-agent", "close"], ["update:title"]),
  setup(r, { emit: m }) {
    const a = m, k = ue(r, "title"), u = K(), c = w(() => u.props.limits.rows.value ?? []), f = w(() => u.props.limits.failure.value), C = S([]), b = S(0), T = S(!1), U = pe(), N = S(null), I = S(!1), v = S(""), A = S(""), B = S(null), j = S(""), Y = w(() => qe(c.value)), W = w(() => c.value.find((n) => n.per_profile)), g = w(() => Y.value.find((n) => n.key === N.value)), z = w(() => C.value.filter((n) => {
      var e, t;
      return n.state !== "retired" && n.role === ((e = g.value) == null ? void 0 : e.type) && (!g.value.profile || (((t = n.facts) == null ? void 0 : t.profile) || n.profile) === g.value.profile);
    }).sort((n, e) => (n.state !== "running") - (e.state !== "running") || String(n.ended_at || n.created_at).localeCompare(String(e.ended_at || e.created_at)))), Z = w(() => {
      var e;
      const n = /* @__PURE__ */ new Map();
      for (const t of z.value) {
        const i = ((e = t.facts) == null ? void 0 : e.model) || t.program_model;
        i && n.set(i, (n.get(i) || 0) + 1);
      }
      return [...n].map(([t, i]) => `${i} ${t}`).join(", ");
    }), ee = (n, e) => e ? `${Math.min(n / Math.max(n, e) * 100, 100)}%` : "0%", te = (n, e) => e && n > e ? `${(n - e) / n * 100}%` : "0%", ne = w(() => {
      var n;
      return ((n = g.value) == null ? void 0 : n.key) ?? "counts";
    });
    X(() => {
      var n;
      return ((n = g.value) == null ? void 0 : n.label) || "Agent counts";
    }, (n) => {
      k.value = n;
    }, { immediate: !0 });
    async function D(n, e = 1) {
      u.state["count-agents.role"] = n.type, n.profile ? u.state["count-agents.profile"] = n.profile : delete u.state["count-agents.profile"], u.state["count-agents.page"] = String(e), await u.reload("count-agents");
      const t = u.props["count-agents"];
      C.value = e === 1 ? [...t.rows.value] : [...C.value, ...t.rows.value], b.value = e, T.value = t.more.value;
    }
    function ae(n) {
      N.value = n.key, C.value = [], D(n);
    }
    function G() {
      N.value = null, B.value = null, v.value = "";
    }
    function se() {
      G(), a("close");
    }
    async function oe(n, e) {
      if (I.value || u.readOnly) return;
      const t = Number(e);
      if (!String(e).trim() || !Number.isInteger(t) || t < 0) {
        v.value = "Use a whole number of 0 or more.";
        return;
      }
      I.value = !0, v.value = "";
      const i = g.value, E = { run: i.run_limit, kept: i.kept_limit, [n]: t }, F = ["--environment", u.environment], V = await u.run(i.profile ? ["agent", "profile-limits", i.type, i.profile, "--running", String(E.run), "--kept", String(E.kept), ...F] : ["setting", "set", n === "run" ? i.run_setting : i.kept_setting, String(t), ...F]);
      V.ok ? await u.reload("limits") : v.value = V.error, I.value = !1;
    }
    async function le(n) {
      if (!j.value.trim() || I.value) return;
      I.value = !0;
      const e = await u.run(["agent", "retire", String(n.number), "--reason", j.value.trim()]);
      v.value = e.ok ? "" : "The agent could not be retired. Try again.", e.ok && (B.value = null, j.value = "", A.value = "Agent retired permanently.", await u.reload("limits"), await D(g.value)), I.value = !1;
    }
    function re(n) {
      se(), a("open-agent", n);
    }
    return (n, e) => (o(), d("div", Le, [
      (o(), d("div", {
        key: ne.value,
        class: P(["counts", { padded: f.value || g.value }]),
        "data-counts-screen": ""
      }, [
        g.value ? (o(), d("button", {
          key: 0,
          class: "back",
          type: "button",
          onClick: G
        }, "‹ Back")) : y("", !0),
        f.value ? (o(), d(O, { key: 1 }, [
          e[5] || (e[5] = s("strong", null, "The counts could not be read", -1)),
          e[6] || (e[6] = s("p", null, "The journal did not answer.", -1)),
          _(l(R), {
            small: "",
            onClick: e[0] || (e[0] = (t) => l(u).reload("limits"))
          }, {
            default: h(() => [...e[4] || (e[4] = [
              $("Try again", -1)
            ])]),
            _: 1
          })
        ], 64)) : g.value ? (o(), d(O, { key: 2 }, [
          _(Ve, {
            row: g.value,
            pending: I.value,
            "read-only": l(u).readOnly,
            environment: l(u).environment,
            onChange: oe
          }, null, 8, ["row", "pending", "read-only", "environment"]),
          s("p", null, [
            s("strong", null, p(g.value.running) + " of " + p(g.value.run_limit), 1),
            e[7] || (e[7] = $(" running, ", -1)),
            s("strong", null, [
              $(p(g.value.kept), 1),
              g.value.kept_limit ? (o(), d(O, { key: 0 }, [
                $(" of " + p(g.value.kept_limit), 1)
              ], 64)) : y("", !0)
            ]),
            e[8] || (e[8] = $(" kept", -1))
          ]),
          s("p", null, p(Z.value), 1),
          z.value.length ? y("", !0) : (o(), d(O, { key: 0 }, [
            e[9] || (e[9] = s("strong", null, "No agents here yet", -1)),
            e[10] || (e[10] = s("p", null, "An agent shows here as soon as one of this type starts.", -1))
          ], 64)),
          (o(!0), d(O, null, L(z.value, (t) => {
            var i, E, F, V, J;
            return o(), d("div", {
              key: t.id,
              class: "person",
              "data-count-agent": t.id
            }, [
              s("span", {
                class: P(["dot", { running: t.state === "running" }])
              }, null, 2),
              s("div", Ue, [
                s("strong", null, p(((i = t.facts) == null ? void 0 : i.given_name) || t.number), 1),
                $(" " + p(t.state === "running" ? "Running" : "Idle") + ", " + p(l(ge)(t.state === "running" ? t.process_started_at || t.created_at : t.ended_at, l(U))), 1),
                s("small", null, p([t.program, (E = t.facts) == null ? void 0 : E.model, (F = t.facts) == null ? void 0 : F.effort, `${t.role} ${t.id}`].filter(Boolean).join(", ")), 1),
                s("small", null, p(((V = t.facts) == null ? void 0 : V.task_title) || ((J = t.facts) == null ? void 0 : J.helper_job)), 1)
              ]),
              _(l(R), {
                small: "",
                onClick: (q) => re(t)
              }, {
                default: h(() => [...e[11] || (e[11] = [
                  $("Open", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              t.state === "idle" && !l(u).readOnly ? (o(), x(l(R), {
                key: 0,
                small: "",
                onClick: (q) => {
                  B.value = t.id, j.value = "";
                }
              }, {
                default: h(() => [...e[12] || (e[12] = [
                  $("Retire", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : y("", !0),
              B.value === t.id ? (o(), x(xe, {
                key: 1,
                reason: j.value,
                "onUpdate:reason": e[1] || (e[1] = (q) => j.value = q),
                pending: I.value,
                onSubmit: (q) => le(t),
                onCancel: e[2] || (e[2] = (q) => B.value = null)
              }, null, 8, ["reason", "pending", "onSubmit"])) : y("", !0)
            ], 8, Pe);
          }), 128)),
          T.value ? (o(), x(l(R), {
            key: 1,
            small: "",
            onClick: e[3] || (e[3] = (t) => D(g.value, b.value + 1))
          }, {
            default: h(() => [...e[13] || (e[13] = [
              $("Show more", -1)
            ])]),
            _: 1
          })) : y("", !0)
        ], 64)) : (o(), d(O, { key: 3 }, [
          e[15] || (e[15] = s("div", { class: "columns" }, [
            s("span", null, "Name"),
            s("span", null, "Running"),
            s("span", null, "Kept"),
            s("span")
          ], -1)),
          W.value ? (o(), d("div", We, [
            e[14] || (e[14] = s("strong", null, "Read-only helpers", -1)),
            s("span", null, p(W.value.running) + " running, " + p(W.value.kept) + " kept", 1)
          ])) : y("", !0),
          (o(!0), d(O, null, L(Y.value, (t) => (o(), d("button", {
            key: t.key,
            type: "button",
            class: "count-row",
            "data-agent-limit-type": t.type || t.key,
            "data-agent-limit-profile": t.profile,
            onClick: (i) => ae(t)
          }, [
            s("strong", null, p(t.label), 1),
            (o(!0), d(O, null, L([{ count: t.running, limit: t.run_limit, unlimited: !1 }, { count: t.kept, limit: t.kept_limit, unlimited: !0 }], (i) => (o(), d("span", {
              key: i.unlimited,
              class: P({ full: l(_e)(i.count, i.limit) })
            }, [
              s("span", null, [
                $(p(i.count), 1),
                i.limit || !i.unlimited ? (o(), d(O, { key: 0 }, [
                  $(" of " + p(i.limit), 1)
                ], 64)) : y("", !0)
              ]),
              i.limit ? (o(), d("span", De, [
                s("span", {
                  style: Q({ width: ee(i.count, i.limit) })
                }, null, 4),
                s("i", {
                  style: Q({ width: te(i.count, i.limit) })
                }, null, 4)
              ])) : y("", !0)
            ], 2))), 128)),
            _(l(ye), {
              name: "chevronRight",
              size: 12
            })
          ], 8, ze))), 128))
        ], 64)),
        v.value ? (o(), d("p", He, p(v.value), 1)) : A.value ? (o(), d("p", Ke, p(A.value), 1)) : y("", !0)
      ], 2))
    ]));
  }
}, Ge = /* @__PURE__ */ M(Ye, [["__scopeId", "data-v-002e1f26"]]), Je = {
  class: "agents",
  "data-agent-settings-agents": ""
}, Qe = {
  __name: "AgentSettingsAgents",
  setup(r) {
    const m = K(), a = S("Agent counts"), k = (u) => m.open("agents.agents", u.id);
    return ce(() => m.reload("limits")), (u, c) => (o(), d("section", Je, [
      _(Ge, {
        title: a.value,
        "onUpdate:title": c[0] || (c[0] = (f) => a.value = f),
        onOpenAgent: k
      }, null, 8, ["title"])
    ]));
  }
}, Xe = /* @__PURE__ */ M(Qe, [["__scopeId", "data-v-8e37e089"]]), Ze = { class: "screen" }, et = { class: "rail" }, tt = {
  __name: "AgentSettingsScreen",
  props: { nodes: { type: Array, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 }, extras: { type: Object, default: () => ({}) } },
  setup(r) {
    const m = r, a = S(null), k = w(() => we(m.nodes)), u = (c) => {
      var f, C;
      return (C = (f = a.value) == null ? void 0 : f.querySelector(`[data-section="${c}"]`)) == null ? void 0 : C.scrollIntoView({ block: "start", behavior: "smooth" });
    };
    return (c, f) => (o(), d("div", Ze, [
      s("nav", et, [
        _(l(he), {
          sections: k.value,
          scope: a.value,
          onChoose: u
        }, null, 8, ["sections", "scope"])
      ]),
      s("div", {
        ref_key: "scroll",
        ref: a,
        class: "content"
      }, [
        ve(c.$slots, "before", {}, void 0, !0),
        _(l(Se), {
          nodes: r.nodes,
          draft: r.draft,
          "read-only": r.readOnly,
          extras: r.extras
        }, null, 8, ["nodes", "draft", "read-only", "extras"])
      ], 512)
    ]));
  }
}, H = /* @__PURE__ */ M(tt, [["__scopeId", "data-v-b835dae4"]]), nt = {
  class: "settings",
  "data-agent-settings": ""
}, at = { class: "head" }, st = {
  class: "env",
  "data-settings-environment": ""
}, ot = { class: "settings-bar" }, lt = {
  key: 0,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, rt = {
  key: 0,
  class: "hint",
  "data-work-hint": ""
}, it = "journal.suites.coding.auto-mode", ut = "journal.suites.coding.workers.main-dispatches-workers", dt = {
  __name: "AgentSettings",
  setup(r) {
    const m = { work: "work-screen", tests: "tests-screen", advanced: "advanced-screen" }, a = K(), k = S("work"), u = [{ key: "work", label: "Work" }, { key: "agents", label: "Helpers" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }], c = w(() => u.find((v) => v.key === k.value)), f = () => Object.values(m).map((v) => a.props[v].data.value), C = w(() => f().every(Boolean)), b = Ce({
      run: (v) => a.run(v),
      reload: async () => {
        await Promise.all(Object.values(m).map((v) => a.reload(v))), b.load(f());
      }
    });
    X(f, (v) => {
      v.every(Boolean) && b.load(v);
    }, { immediate: !0 });
    const T = (v) => {
      var A;
      return ((A = a.props[m[v]].data.value) == null ? void 0 : A.nodes) ?? [];
    }, U = w(() => b.value(it) === !1 && b.value(ut) === !1), N = w(() => k.value !== "agents" && !a.readOnly);
    function I(v) {
      k.value = v.key, a.state.tab = v.key === "agents" ? "agents" : "";
    }
    return (v, A) => (o(), x(l(ke), { padding: "0" }, {
      default: h(() => [
        s("div", nt, [
          s("div", at, [
            s("span", st, p(l(a).environment), 1)
          ]),
          s("div", ot, [
            _(l(fe), {
              tabs: u,
              active: c.value,
              onChoose: I
            }, null, 8, ["active"])
          ]),
          l(a).readOnly ? (o(), d("p", lt, "Only a person can change these settings. You can read every value, and ask a person for a change.")) : y("", !0),
          s("div", {
            class: P(["settings-body", { flush: k.value === "agents" }])
          }, [
            _(l(be), { tab: c.value }, {
              default: h(() => [
                _(l($e), { value: k.value }, {
                  work: h(() => [
                    C.value ? (o(), x(H, {
                      key: "work",
                      nodes: T("work"),
                      draft: l(b),
                      "read-only": l(a).readOnly,
                      "data-agent-settings-work": ""
                    }, {
                      before: h(() => [
                        U.value ? (o(), d("p", rt, "With Auto off and no workers, nothing starts the work: a person starts tasks or turns one of them on.")) : y("", !0)
                      ]),
                      _: 1
                    }, 8, ["nodes", "draft", "read-only"])) : y("", !0)
                  ]),
                  agents: h(() => [
                    _(Xe)
                  ]),
                  tests: h(() => [
                    C.value ? (o(), x(H, {
                      key: "tests",
                      nodes: T("tests"),
                      draft: l(b),
                      "read-only": l(a).readOnly,
                      "data-agent-settings-tests": ""
                    }, null, 8, ["nodes", "draft", "read-only"])) : y("", !0)
                  ]),
                  advanced: h(() => [
                    C.value ? (o(), x(H, {
                      key: "advanced",
                      nodes: T("advanced"),
                      draft: l(b),
                      "read-only": l(a).readOnly,
                      "data-agent-settings-advanced": ""
                    }, null, 8, ["nodes", "draft", "read-only"])) : y("", !0)
                  ]),
                  _: 1
                }, 8, ["value"])
              ]),
              _: 1
            }, 8, ["tab"])
          ], 2),
          N.value ? (o(), x(l(Ae), {
            key: 1,
            changes: l(b).changes(),
            "can-save": l(b).canSave.value,
            pending: l(b).pending.value,
            reason: l(b).reason.value,
            environment: l(a).environment,
            onSave: A[0] || (A[0] = (B) => l(b).apply()),
            onCancel: A[1] || (A[1] = (B) => l(b).reset())
          }, null, 8, ["changes", "can-save", "pending", "reason", "environment"])) : y("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, gt = /* @__PURE__ */ M(dt, [["__scopeId", "data-v-f66da4aa"]]);
export {
  gt as A
};
