import { openBlock as r, createElementBlock as c, withModifiers as de, createElementVNode as o, createVNode as k, unref as l, withCtx as $, createTextVNode as _, Fragment as O, renderList as z, toDisplayString as p, createCommentVNode as y, useModel as ce, computed as h, ref as A, watch as te, normalizeClass as D, createBlock as I, normalizeStyle as X, mergeModels as ve, onMounted as me, renderSlot as pe } from "vue";
import { TextInput as ge, Btn as M, useWindow as G, useNow as ye, age as ke, Icon as fe, WindowRoom as be, SwitchCase as Z, InnerTabs as we, TabBody as he } from "@journal/window-kit";
import { isFull as $e, SettingPresetCard as ee, SettingPresetCompareTable as _e, sectionsOf as Se, SettingSectionList as Ce, SettingsScreen as Ae, useSettingsDraft as Oe, currentPreset as Be, SettingPresetBand as Ie, ChangeFoot as Te } from "@journal/setting-components";
import { _ as j } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const xe = { class: "action-buttons" }, je = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(i) {
    return (m, n) => (r(), c("form", {
      "data-agent-retire-confirm": "",
      onSubmit: n[2] || (n[2] = de((f) => m.$emit("submit"), ["prevent"]))
    }, [
      n[5] || (n[5] = o("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      k(l(ge), {
        "model-value": i.reason,
        label: "Reason",
        disabled: i.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": n[0] || (n[0] = (f) => m.$emit("update:reason", f))
      }, null, 8, ["model-value", "disabled"]),
      o("div", xe, [
        k(l(M), {
          type: "submit",
          small: "",
          disabled: i.pending || !i.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: $(() => [...n[3] || (n[3] = [
            _("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        k(l(M), {
          small: "",
          disabled: i.pending,
          onClick: n[1] || (n[1] = (f) => m.$emit("cancel"))
        }, {
          default: $(() => [...n[4] || (n[4] = [
            _("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ne = /* @__PURE__ */ j(je, [["__scopeId", "data-v-92de7dd6"]]), Pe = ["data-edit-type"], Me = { class: "stepper" }, Re = ["disabled", "onClick"], Ee = ["value", "disabled", "data-agent-limit-input", "onChange"], Fe = ["disabled", "onClick"], qe = { key: 0 }, Le = { key: 1 }, Ue = {
  __name: "AgentLimitEditor",
  props: { row: { type: Object, required: !0 }, pending: Boolean, readOnly: Boolean, environment: { type: String, required: !0 } },
  emits: ["change"],
  setup(i, { emit: m }) {
    const n = m;
    return (f, u) => (r(), c(O, null, [
      u[0] || (u[0] = o("p", null, "How many may run at once, and how many may be kept.", -1)),
      o("div", {
        class: "edit-row",
        "data-edit-type": i.row.key
      }, [
        (r(!0), c(O, null, z([{ name: "Most running", value: i.row.run_limit, source: i.row.run_source, kind: "run" }, { name: "Most kept", value: i.row.kept_limit, source: i.row.kept_source, kind: "kept" }], (d) => (r(), c("label", {
          key: d.kind
        }, [
          _(p(d.name), 1),
          o("span", Me, [
            o("button", {
              type: "button",
              disabled: i.pending || i.readOnly || d.value === 0,
              onClick: (b) => n("change", d.kind, d.value - 1)
            }, "−", 8, Re),
            o("input", {
              type: "number",
              min: "0",
              value: d.value,
              disabled: i.pending || i.readOnly,
              "data-agent-limit-input": d.kind,
              onChange: (b) => n("change", d.kind, b.target.value)
            }, null, 40, Ee),
            o("button", {
              type: "button",
              disabled: i.pending || i.readOnly,
              onClick: (b) => n("change", d.kind, d.value + 1)
            }, "+", 8, Fe)
          ]),
          d.value === 0 ? (r(), c("small", qe, p(d.kind === "run" ? "None can start" : "Any number"), 1)) : d.source === `environment ${i.environment}` ? (r(), c("small", Le, "Changed for " + p(i.environment), 1)) : y("", !0)
        ]))), 128))
      ], 8, Pe)
    ], 64));
  }
}, Ve = /* @__PURE__ */ j(Ue, [["__scopeId", "data-v-b2420411"]]), We = (i) => i.flatMap((m) => m.per_profile ? m.profiles.map((n) => ({ ...n, label: n.title, type: m.key, key: `${m.key}:${n.profile}` })) : [{ ...m, type: m.key }]), ze = { class: "counts-panel" }, De = ["data-count-agent"], He = { class: "person-text" }, Ke = {
  key: 0,
  class: "helper-head"
}, Ye = ["data-agent-limit-type", "data-agent-limit-profile", "onClick"], Ge = {
  key: 0,
  class: "bar"
}, Je = {
  key: 4,
  role: "alert"
}, Qe = {
  key: 5,
  role: "status"
}, Xe = {
  __name: "AgentCountsPanel",
  props: {
    title: { default: "Agent counts" },
    titleModifiers: {}
  },
  emits: /* @__PURE__ */ ve(["open-agent", "close"], ["update:title"]),
  setup(i, { emit: m }) {
    const n = m, f = ce(i, "title"), u = G(), d = h(() => u.props.limits.rows.value ?? []), b = h(() => u.props.limits.failure.value), B = A([]), g = A(0), N = A(!1), H = ye(), R = A(null), S = A(!1), C = A(""), P = A(""), T = A(null), x = A(""), E = h(() => We(d.value)), F = h(() => d.value.find((s) => s.per_profile)), a = h(() => E.value.find((s) => s.key === R.value)), w = h(() => B.value.filter((s) => {
      var e, t;
      return s.state !== "retired" && s.role === ((e = a.value) == null ? void 0 : e.type) && (!a.value.profile || (((t = s.facts) == null ? void 0 : t.profile) || s.profile) === a.value.profile);
    }).sort((s, e) => (s.state !== "running") - (e.state !== "running") || String(s.ended_at || s.created_at).localeCompare(String(e.ended_at || e.created_at)))), q = h(() => {
      var e;
      const s = /* @__PURE__ */ new Map();
      for (const t of w.value) {
        const v = ((e = t.facts) == null ? void 0 : e.model) || t.program_model;
        v && s.set(v, (s.get(v) || 0) + 1);
      }
      return [...s].map(([t, v]) => `${v} ${t}`).join(", ");
    }), ne = (s, e) => e ? `${Math.min(s / Math.max(s, e) * 100, 100)}%` : "0%", se = (s, e) => e && s > e ? `${(s - e) / s * 100}%` : "0%", ae = h(() => {
      var s;
      return ((s = a.value) == null ? void 0 : s.key) ?? "counts";
    });
    te(() => {
      var s;
      return ((s = a.value) == null ? void 0 : s.label) || "Agent counts";
    }, (s) => {
      f.value = s;
    }, { immediate: !0 });
    async function K(s, e = 1) {
      u.state["count-agents.role"] = s.type, s.profile ? u.state["count-agents.profile"] = s.profile : delete u.state["count-agents.profile"], u.state["count-agents.page"] = String(e), await u.reload("count-agents");
      const t = u.props["count-agents"];
      B.value = e === 1 ? [...t.rows.value] : [...B.value, ...t.rows.value], g.value = e, N.value = t.more.value;
    }
    function le(s) {
      R.value = s.key, B.value = [], K(s);
    }
    function J() {
      R.value = null, T.value = null, C.value = "";
    }
    function oe() {
      J(), n("close");
    }
    async function re(s, e) {
      if (S.value || u.readOnly) return;
      const t = Number(e);
      if (!String(e).trim() || !Number.isInteger(t) || t < 0) {
        C.value = "Use a whole number of 0 or more.";
        return;
      }
      S.value = !0, C.value = "";
      const v = a.value, L = { run: v.run_limit, kept: v.kept_limit, [s]: t }, U = ["--environment", u.environment], V = await u.run(v.profile ? ["agent", "profile-limits", v.type, v.profile, "--running", String(L.run), "--kept", String(L.kept), ...U] : ["setting", "set", s === "run" ? v.run_setting : v.kept_setting, String(t), ...U]);
      V.ok ? await u.reload("limits") : C.value = V.error, S.value = !1;
    }
    async function ie(s) {
      if (!x.value.trim() || S.value) return;
      S.value = !0;
      const e = await u.run(["agent", "retire", String(s.number), "--reason", x.value.trim()]);
      C.value = e.ok ? "" : "The agent could not be retired. Try again.", e.ok && (T.value = null, x.value = "", P.value = "Agent retired permanently.", await u.reload("limits"), await K(a.value)), S.value = !1;
    }
    function ue(s) {
      oe(), n("open-agent", s);
    }
    return (s, e) => (r(), c("div", ze, [
      (r(), c("div", {
        key: ae.value,
        class: D(["counts", { padded: b.value || a.value }]),
        "data-counts-screen": ""
      }, [
        a.value ? (r(), c("button", {
          key: 0,
          class: "back",
          type: "button",
          onClick: J
        }, "‹ Back")) : y("", !0),
        b.value ? (r(), c(O, { key: 1 }, [
          e[5] || (e[5] = o("strong", null, "The counts could not be read", -1)),
          e[6] || (e[6] = o("p", null, "The journal did not answer.", -1)),
          k(l(M), {
            small: "",
            onClick: e[0] || (e[0] = (t) => l(u).reload("limits"))
          }, {
            default: $(() => [...e[4] || (e[4] = [
              _("Try again", -1)
            ])]),
            _: 1
          })
        ], 64)) : a.value ? (r(), c(O, { key: 2 }, [
          k(Ve, {
            row: a.value,
            pending: S.value,
            "read-only": l(u).readOnly,
            environment: l(u).environment,
            onChange: re
          }, null, 8, ["row", "pending", "read-only", "environment"]),
          o("p", null, [
            o("strong", null, p(a.value.running) + " of " + p(a.value.run_limit), 1),
            e[7] || (e[7] = _(" running, ", -1)),
            o("strong", null, [
              _(p(a.value.kept), 1),
              a.value.kept_limit ? (r(), c(O, { key: 0 }, [
                _(" of " + p(a.value.kept_limit), 1)
              ], 64)) : y("", !0)
            ]),
            e[8] || (e[8] = _(" kept", -1))
          ]),
          o("p", null, p(q.value), 1),
          w.value.length ? y("", !0) : (r(), c(O, { key: 0 }, [
            e[9] || (e[9] = o("strong", null, "No agents here yet", -1)),
            e[10] || (e[10] = o("p", null, "An agent shows here as soon as one of this type starts.", -1))
          ], 64)),
          (r(!0), c(O, null, z(w.value, (t) => {
            var v, L, U, V, Q;
            return r(), c("div", {
              key: t.id,
              class: "person",
              "data-count-agent": t.id
            }, [
              o("span", {
                class: D(["dot", { running: t.state === "running" }])
              }, null, 2),
              o("div", He, [
                o("strong", null, p(((v = t.facts) == null ? void 0 : v.given_name) || t.number), 1),
                _(" " + p(t.state === "running" ? "Running" : "Idle") + ", " + p(l(ke)(t.state === "running" ? t.process_started_at || t.created_at : t.ended_at, l(H))), 1),
                o("small", null, p([t.program, (L = t.facts) == null ? void 0 : L.model, (U = t.facts) == null ? void 0 : U.effort, `${t.role} ${t.id}`].filter(Boolean).join(", ")), 1),
                o("small", null, p(((V = t.facts) == null ? void 0 : V.task_title) || ((Q = t.facts) == null ? void 0 : Q.helper_job)), 1)
              ]),
              k(l(M), {
                small: "",
                onClick: (W) => ue(t)
              }, {
                default: $(() => [...e[11] || (e[11] = [
                  _("Open", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              t.state === "idle" && !l(u).readOnly ? (r(), I(l(M), {
                key: 0,
                small: "",
                onClick: (W) => {
                  T.value = t.id, x.value = "";
                }
              }, {
                default: $(() => [...e[12] || (e[12] = [
                  _("Retire", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : y("", !0),
              T.value === t.id ? (r(), I(Ne, {
                key: 1,
                reason: x.value,
                "onUpdate:reason": e[1] || (e[1] = (W) => x.value = W),
                pending: S.value,
                onSubmit: (W) => ie(t),
                onCancel: e[2] || (e[2] = (W) => T.value = null)
              }, null, 8, ["reason", "pending", "onSubmit"])) : y("", !0)
            ], 8, De);
          }), 128)),
          N.value ? (r(), I(l(M), {
            key: 1,
            small: "",
            onClick: e[3] || (e[3] = (t) => K(a.value, g.value + 1))
          }, {
            default: $(() => [...e[13] || (e[13] = [
              _("Show more", -1)
            ])]),
            _: 1
          })) : y("", !0)
        ], 64)) : (r(), c(O, { key: 3 }, [
          e[15] || (e[15] = o("div", { class: "columns" }, [
            o("span", null, "Name"),
            o("span", null, "Running"),
            o("span", null, "Kept"),
            o("span")
          ], -1)),
          F.value ? (r(), c("div", Ke, [
            e[14] || (e[14] = o("strong", null, "Read-only helpers", -1)),
            o("span", null, p(F.value.running) + " running, " + p(F.value.kept) + " kept", 1)
          ])) : y("", !0),
          (r(!0), c(O, null, z(E.value, (t) => (r(), c("button", {
            key: t.key,
            type: "button",
            class: "count-row",
            "data-agent-limit-type": t.type || t.key,
            "data-agent-limit-profile": t.profile,
            onClick: (v) => le(t)
          }, [
            o("strong", null, p(t.label), 1),
            (r(!0), c(O, null, z([{ count: t.running, limit: t.run_limit, unlimited: !1 }, { count: t.kept, limit: t.kept_limit, unlimited: !0 }], (v) => (r(), c("span", {
              key: v.unlimited,
              class: D({ full: l($e)(v.count, v.limit) })
            }, [
              o("span", null, [
                _(p(v.count), 1),
                v.limit || !v.unlimited ? (r(), c(O, { key: 0 }, [
                  _(" of " + p(v.limit), 1)
                ], 64)) : y("", !0)
              ]),
              v.limit ? (r(), c("span", Ge, [
                o("span", {
                  style: X({ width: ne(v.count, v.limit) })
                }, null, 4),
                o("i", {
                  style: X({ width: se(v.count, v.limit) })
                }, null, 4)
              ])) : y("", !0)
            ], 2))), 128)),
            k(l(fe), {
              name: "chevronRight",
              size: 12
            })
          ], 8, Ye))), 128))
        ], 64)),
        C.value ? (r(), c("p", Je, p(C.value), 1)) : P.value ? (r(), c("p", Qe, p(P.value), 1)) : y("", !0)
      ], 2))
    ]));
  }
}, Ze = /* @__PURE__ */ j(Xe, [["__scopeId", "data-v-55110dab"]]), et = {
  class: "agents",
  "data-agent-settings-agents": ""
}, tt = {
  __name: "AgentSettingsAgents",
  setup(i) {
    const m = G(), n = A("Agent counts"), f = (u) => m.open("agents.agents", u.id);
    return me(() => m.reload("limits")), (u, d) => (r(), c("section", et, [
      k(Ze, {
        title: n.value,
        "onUpdate:title": d[0] || (d[0] = (b) => n.value = b),
        onOpenAgent: f
      }, null, 8, ["title"])
    ]));
  }
}, nt = /* @__PURE__ */ j(tt, [["__scopeId", "data-v-fde7fc3f"]]), st = {
  class: "page",
  "data-agent-settings-presets": ""
}, at = { class: "crumb" }, lt = { class: "body" }, ot = { class: "cards" }, rt = "Any other mix of the eight switches. The form shows Custom as soon as the switches match neither preset.", it = {
  __name: "AgentSettingsPresets",
  props: { presets: { type: Array, required: !0 }, switches: { type: Array, required: !0 }, now: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back", "fill"],
  setup(i, { emit: m }) {
    const n = m;
    return (f, u) => (r(), c("section", st, [
      o("div", at, [
        o("button", {
          type: "button",
          class: "back",
          "data-presets-back": "",
          onClick: u[0] || (u[0] = (d) => n("back"))
        }, "‹ Back"),
        u[1] || (u[1] = o("b", null, "What is a preset?", -1))
      ]),
      o("div", lt, [
        u[2] || (u[2] = o("p", { class: "lead" }, "A preset is a set of eight switches and nothing more. It is not a kind of agent: the main agent is the same program under every preset, and a preset only fills in the switches below. Nothing is saved until you press Save.", -1)),
        o("div", ot, [
          (r(!0), c(O, null, z(i.presets, (d) => (r(), I(l(ee), {
            key: d.key,
            name: d.name,
            line: d.line,
            "can-fill": !i.readOnly,
            onFill: (b) => n("fill", d.key)
          }, null, 8, ["name", "line", "can-fill", "onFill"]))), 128)),
          k(l(ee), {
            name: "Custom",
            line: rt
          })
        ]),
        k(l(_e), {
          rows: i.switches,
          presets: i.presets,
          now: i.now
        }, null, 8, ["rows", "presets", "now"])
      ])
    ]));
  }
}, ut = /* @__PURE__ */ j(it, [["__scopeId", "data-v-2cf94460"]]), dt = { class: "screen" }, ct = { class: "rail" }, vt = {
  __name: "AgentSettingsScreen",
  props: { nodes: { type: Array, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 }, extras: { type: Object, default: () => ({}) } },
  setup(i) {
    const m = i, n = A(null), f = h(() => Se(m.nodes)), u = (d) => {
      var b, B;
      return (B = (b = n.value) == null ? void 0 : b.querySelector(`[data-section="${d}"]`)) == null ? void 0 : B.scrollIntoView({ block: "start", behavior: "smooth" });
    };
    return (d, b) => (r(), c("div", dt, [
      o("nav", ct, [
        k(l(Ce), {
          sections: f.value,
          scope: n.value,
          onChoose: u
        }, null, 8, ["sections", "scope"])
      ]),
      o("div", {
        ref_key: "scroll",
        ref: n,
        class: "content"
      }, [
        pe(d.$slots, "before", {}, void 0, !0),
        k(l(Ae), {
          nodes: i.nodes,
          draft: i.draft,
          "read-only": i.readOnly,
          extras: i.extras
        }, null, 8, ["nodes", "draft", "read-only", "extras"])
      ], 512)
    ]));
  }
}, Y = /* @__PURE__ */ j(vt, [["__scopeId", "data-v-2a30ae54"]]), mt = {
  class: "settings",
  "data-agent-settings": ""
}, pt = { class: "head" }, gt = {
  class: "env",
  "data-settings-environment": ""
}, yt = { class: "settings-bar" }, kt = {
  key: 1,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, ft = {
  key: 0,
  class: "hint",
  "data-work-hint": ""
}, bt = "journal.suites.coding.auto-mode", wt = "journal.suites.coding.workers.main-dispatches-workers", ht = {
  __name: "AgentSettings",
  setup(i) {
    const m = { work: "work-screen", tests: "tests-screen", advanced: "advanced-screen" }, n = G(), f = A("work"), u = [{ key: "work", label: "Work" }, { key: "agents", label: "Helpers" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }], d = h(() => u.find((a) => a.key === f.value)), b = () => Object.values(m).map((a) => n.props[a].data.value), B = h(() => b().every(Boolean)), g = Oe({
      run: (a) => n.run(a),
      reload: async () => {
        await Promise.all(Object.values(m).map((a) => n.reload(a))), g.load(b());
      }
    });
    te(b, (a) => {
      a.every(Boolean) && g.load(a);
    }, { immediate: !0 });
    const N = (a) => {
      var w;
      return ((w = n.props[m[a]].data.value) == null ? void 0 : w.nodes) ?? [];
    }, H = h(() => g.value(bt) === !1 && g.value(wt) === !1), R = h(() => f.value !== "agents" && !n.readOnly), S = A("main"), C = h(() => {
      var a;
      return ((a = n.props.work.data.value) == null ? void 0 : a.presets) ?? [];
    }), P = h(() => {
      var a;
      return ((a = n.props.work.data.value) == null ? void 0 : a.switches) ?? [];
    }), T = h(() => Object.fromEntries(P.value.map((a) => [a.key, g.value(a.key)]))), x = h(() => Be(T.value, C.value)), E = (a) => g.fill(C.value.find((w) => w.key === a).values);
    function F(a) {
      f.value = a.key, n.state.tab = a.key === "agents" ? "agents" : "";
    }
    return (a, w) => (r(), I(l(be), { padding: "0" }, {
      default: $(() => [
        o("div", mt, [
          k(l(Z), { value: S.value }, {
            main: $(() => [
              o("div", pt, [
                o("span", gt, p(l(n).environment), 1)
              ]),
              C.value.length ? (r(), I(l(Ie), {
                key: 0,
                presets: C.value,
                current: x.value,
                disabled: l(n).readOnly,
                onPick: E,
                onOpenPage: w[0] || (w[0] = (q) => S.value = "presets")
              }, null, 8, ["presets", "current", "disabled"])) : y("", !0),
              o("div", yt, [
                k(l(we), {
                  tabs: u,
                  active: d.value,
                  onChoose: F
                }, null, 8, ["active"])
              ]),
              l(n).readOnly ? (r(), c("p", kt, "Only a person can change these settings. You can read every value, and ask a person for a change.")) : y("", !0),
              o("div", {
                class: D(["settings-body", { flush: f.value === "agents" }])
              }, [
                k(l(he), { tab: d.value }, {
                  default: $(() => [
                    k(l(Z), { value: f.value }, {
                      work: $(() => [
                        B.value ? (r(), I(Y, {
                          key: "work",
                          nodes: N("work"),
                          draft: l(g),
                          "read-only": l(n).readOnly,
                          "data-agent-settings-work": ""
                        }, {
                          before: $(() => [
                            H.value ? (r(), c("p", ft, "With Auto off and no workers, nothing starts the work: a person starts tasks or turns one of them on.")) : y("", !0)
                          ]),
                          _: 1
                        }, 8, ["nodes", "draft", "read-only"])) : y("", !0)
                      ]),
                      agents: $(() => [
                        k(nt)
                      ]),
                      tests: $(() => [
                        B.value ? (r(), I(Y, {
                          key: "tests",
                          nodes: N("tests"),
                          draft: l(g),
                          "read-only": l(n).readOnly,
                          "data-agent-settings-tests": ""
                        }, null, 8, ["nodes", "draft", "read-only"])) : y("", !0)
                      ]),
                      advanced: $(() => [
                        B.value ? (r(), I(Y, {
                          key: "advanced",
                          nodes: N("advanced"),
                          draft: l(g),
                          "read-only": l(n).readOnly,
                          "data-agent-settings-advanced": ""
                        }, null, 8, ["nodes", "draft", "read-only"])) : y("", !0)
                      ]),
                      _: 1
                    }, 8, ["value"])
                  ]),
                  _: 1
                }, 8, ["tab"])
              ], 2)
            ]),
            presets: $(() => [
              k(ut, {
                presets: C.value,
                switches: P.value,
                now: T.value,
                "read-only": l(n).readOnly,
                onBack: w[1] || (w[1] = (q) => S.value = "main"),
                onFill: E
              }, null, 8, ["presets", "switches", "now", "read-only"])
            ]),
            _: 1
          }, 8, ["value"]),
          R.value || S.value === "presets" && !l(n).readOnly ? (r(), I(l(Te), {
            key: 0,
            changes: l(g).changes(),
            "can-save": l(g).canSave.value,
            pending: l(g).pending.value,
            reason: l(g).reason.value,
            environment: l(n).environment,
            onSave: w[2] || (w[2] = (q) => l(g).apply()),
            onCancel: w[3] || (w[3] = (q) => l(g).reset())
          }, null, 8, ["changes", "can-save", "pending", "reason", "environment"])) : y("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, At = /* @__PURE__ */ j(ht, [["__scopeId", "data-v-3991545d"]]);
export {
  At as A
};
