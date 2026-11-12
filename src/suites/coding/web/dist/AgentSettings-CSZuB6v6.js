import { openBlock as l, createElementBlock as c, withModifiers as de, createElementVNode as o, createVNode as y, unref as a, withCtx as S, createTextVNode as A, Fragment as I, renderList as H, toDisplayString as g, createCommentVNode as b, useModel as ce, computed as w, ref as O, watch as Z, normalizeClass as Y, createBlock as T, normalizeStyle as se, mergeModels as ve, onMounted as me, nextTick as pe, renderSlot as ge, onBeforeUnmount as fe } from "vue";
import { TextInput as ye, Btn as E, useWindow as ee, useNow as ke, age as be, Icon as we, WindowRoom as he, SwitchCase as ae, InnerTabs as $e, TabBody as Se } from "@journal/window-kit";
import { isFull as _e, SettingPresetCard as oe, SettingPresetCompareTable as Ce, sectionsOf as Ae, SettingSectionList as Oe, SettingsScreen as xe, useSettingsDraft as Ie, currentPreset as Te, SettingPresetBand as Be, FindBox as je, ChangeFoot as Me } from "@journal/setting-components";
import { _ as N } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const Ne = { class: "action-buttons" }, Pe = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(r) {
    return (m, t) => (l(), c("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = de((h) => m.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = o("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      y(a(ye), {
        "model-value": r.reason,
        label: "Reason",
        disabled: r.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (h) => m.$emit("update:reason", h))
      }, null, 8, ["model-value", "disabled"]),
      o("div", Ne, [
        y(a(E), {
          type: "submit",
          small: "",
          disabled: r.pending || !r.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: S(() => [...t[3] || (t[3] = [
            A("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        y(a(E), {
          small: "",
          disabled: r.pending,
          onClick: t[1] || (t[1] = (h) => m.$emit("cancel"))
        }, {
          default: S(() => [...t[4] || (t[4] = [
            A("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Re = /* @__PURE__ */ N(Pe, [["__scopeId", "data-v-92de7dd6"]]), Ee = ["data-edit-type"], Fe = { class: "stepper" }, qe = ["disabled", "onClick"], Le = ["value", "disabled", "data-agent-limit-input", "onChange"], Ue = ["disabled", "onClick"], Ve = { key: 0 }, We = { key: 1 }, De = {
  __name: "AgentLimitEditor",
  props: { row: { type: Object, required: !0 }, pending: Boolean, readOnly: Boolean, environment: { type: String, required: !0 } },
  emits: ["change"],
  setup(r, { emit: m }) {
    const t = m;
    return (h, u) => (l(), c(I, null, [
      u[0] || (u[0] = o("p", null, "How many may run at once, and how many may be kept.", -1)),
      o("div", {
        class: "edit-row",
        "data-edit-type": r.row.key
      }, [
        (l(!0), c(I, null, H([{ name: "Most running", value: r.row.run_limit, source: r.row.run_source, kind: "run" }, { name: "Most kept", value: r.row.kept_limit, source: r.row.kept_source, kind: "kept" }], (d) => (l(), c("label", {
          key: d.kind
        }, [
          A(g(d.name), 1),
          o("span", Fe, [
            o("button", {
              type: "button",
              disabled: r.pending || r.readOnly || d.value === 0,
              onClick: (f) => t("change", d.kind, d.value - 1)
            }, "−", 8, qe),
            o("input", {
              type: "number",
              min: "0",
              value: d.value,
              disabled: r.pending || r.readOnly,
              "data-agent-limit-input": d.kind,
              onChange: (f) => t("change", d.kind, f.target.value)
            }, null, 40, Le),
            o("button", {
              type: "button",
              disabled: r.pending || r.readOnly,
              onClick: (f) => t("change", d.kind, d.value + 1)
            }, "+", 8, Ue)
          ]),
          d.value === 0 ? (l(), c("small", Ve, g(d.kind === "run" ? "None can start" : "Any number"), 1)) : d.source === `environment ${r.environment}` ? (l(), c("small", We, "Changed for " + g(r.environment), 1)) : b("", !0)
        ]))), 128))
      ], 8, Ee)
    ], 64));
  }
}, ze = /* @__PURE__ */ N(De, [["__scopeId", "data-v-b2420411"]]), He = (r) => r.flatMap((m) => m.per_profile ? m.profiles.map((t) => ({ ...t, label: t.title, type: m.key, key: `${m.key}:${t.profile}` })) : [{ ...m, type: m.key }]), Ke = { class: "counts-panel" }, Ye = ["data-count-agent"], Ge = { class: "person-text" }, Je = {
  key: 0,
  class: "helper-head"
}, Qe = ["data-agent-limit-type", "data-agent-limit-profile", "onClick"], Xe = {
  key: 0,
  class: "bar"
}, Ze = {
  key: 4,
  role: "alert"
}, et = {
  key: 5,
  role: "status"
}, tt = {
  __name: "AgentCountsPanel",
  props: {
    title: { default: "Agent counts" },
    titleModifiers: {}
  },
  emits: /* @__PURE__ */ ve(["open-agent", "close"], ["update:title"]),
  setup(r, { emit: m }) {
    const t = m, h = ce(r, "title"), u = ee(), d = w(() => u.props.limits.rows.value ?? []), f = w(() => u.props.limits.failure.value), _ = O([]), k = O(0), P = O(!1), G = ke(), F = O(null), C = O(!1), x = O(""), R = O(""), B = O(null), j = O(""), q = w(() => He(d.value)), L = w(() => d.value.find((s) => s.per_profile)), p = w(() => q.value.find((s) => s.key === F.value)), M = w(() => _.value.filter((s) => {
      var e, n;
      return s.state !== "retired" && s.role === ((e = p.value) == null ? void 0 : e.type) && (!p.value.profile || (((n = s.facts) == null ? void 0 : n.profile) || s.profile) === p.value.profile);
    }).sort((s, e) => (s.state !== "running") - (e.state !== "running") || String(s.ended_at || s.created_at).localeCompare(String(e.ended_at || e.created_at)))), J = w(() => {
      var e;
      const s = /* @__PURE__ */ new Map();
      for (const n of M.value) {
        const v = ((e = n.facts) == null ? void 0 : e.model) || n.program_model;
        v && s.set(v, (s.get(v) || 0) + 1);
      }
      return [...s].map(([n, v]) => `${v} ${n}`).join(", ");
    }), Q = (s, e) => e ? `${Math.min(s / Math.max(s, e) * 100, 100)}%` : "0%", K = (s, e) => e && s > e ? `${(s - e) / s * 100}%` : "0%", i = w(() => {
      var s;
      return ((s = p.value) == null ? void 0 : s.key) ?? "counts";
    });
    Z(() => {
      var s;
      return ((s = p.value) == null ? void 0 : s.label) || "Agent counts";
    }, (s) => {
      h.value = s;
    }, { immediate: !0 });
    async function $(s, e = 1) {
      u.state["count-agents.role"] = s.type, s.profile ? u.state["count-agents.profile"] = s.profile : delete u.state["count-agents.profile"], u.state["count-agents.page"] = String(e), await u.reload("count-agents");
      const n = u.props["count-agents"];
      _.value = e === 1 ? [...n.rows.value] : [..._.value, ...n.rows.value], k.value = e, P.value = n.more.value;
    }
    function U(s) {
      F.value = s.key, _.value = [], $(s);
    }
    function te() {
      F.value = null, B.value = null, x.value = "";
    }
    function le() {
      te(), t("close");
    }
    async function re(s, e) {
      if (C.value || u.readOnly) return;
      const n = Number(e);
      if (!String(e).trim() || !Number.isInteger(n) || n < 0) {
        x.value = "Use a whole number of 0 or more.";
        return;
      }
      C.value = !0, x.value = "";
      const v = p.value, V = { run: v.run_limit, kept: v.kept_limit, [s]: n }, W = ["--environment", u.environment], D = await u.run(v.profile ? ["agent", "profile-limits", v.type, v.profile, "--running", String(V.run), "--kept", String(V.kept), ...W] : ["setting", "set", s === "run" ? v.run_setting : v.kept_setting, String(n), ...W]);
      D.ok ? await u.reload("limits") : x.value = D.error, C.value = !1;
    }
    async function ie(s) {
      if (!j.value.trim() || C.value) return;
      C.value = !0;
      const e = await u.run(["agent", "retire", String(s.number), "--reason", j.value.trim()]);
      x.value = e.ok ? "" : "The agent could not be retired. Try again.", e.ok && (B.value = null, j.value = "", R.value = "Agent retired permanently.", await u.reload("limits"), await $(p.value)), C.value = !1;
    }
    function ue(s) {
      le(), t("open-agent", s);
    }
    return (s, e) => (l(), c("div", Ke, [
      (l(), c("div", {
        key: i.value,
        class: Y(["counts", { padded: f.value || p.value }]),
        "data-counts-screen": ""
      }, [
        p.value ? (l(), c("button", {
          key: 0,
          class: "back",
          type: "button",
          onClick: te
        }, "‹ Back")) : b("", !0),
        f.value ? (l(), c(I, { key: 1 }, [
          e[5] || (e[5] = o("strong", null, "The counts could not be read", -1)),
          e[6] || (e[6] = o("p", null, "The journal did not answer.", -1)),
          y(a(E), {
            small: "",
            onClick: e[0] || (e[0] = (n) => a(u).reload("limits"))
          }, {
            default: S(() => [...e[4] || (e[4] = [
              A("Try again", -1)
            ])]),
            _: 1
          })
        ], 64)) : p.value ? (l(), c(I, { key: 2 }, [
          y(ze, {
            row: p.value,
            pending: C.value,
            "read-only": a(u).readOnly,
            environment: a(u).environment,
            onChange: re
          }, null, 8, ["row", "pending", "read-only", "environment"]),
          o("p", null, [
            o("strong", null, g(p.value.running) + " of " + g(p.value.run_limit), 1),
            e[7] || (e[7] = A(" running, ", -1)),
            o("strong", null, [
              A(g(p.value.kept), 1),
              p.value.kept_limit ? (l(), c(I, { key: 0 }, [
                A(" of " + g(p.value.kept_limit), 1)
              ], 64)) : b("", !0)
            ]),
            e[8] || (e[8] = A(" kept", -1))
          ]),
          o("p", null, g(J.value), 1),
          M.value.length ? b("", !0) : (l(), c(I, { key: 0 }, [
            e[9] || (e[9] = o("strong", null, "No agents here yet", -1)),
            e[10] || (e[10] = o("p", null, "An agent shows here as soon as one of this type starts.", -1))
          ], 64)),
          (l(!0), c(I, null, H(M.value, (n) => {
            var v, V, W, D, ne;
            return l(), c("div", {
              key: n.id,
              class: "person",
              "data-count-agent": n.id
            }, [
              o("span", {
                class: Y(["dot", { running: n.state === "running" }])
              }, null, 2),
              o("div", Ge, [
                o("strong", null, g(((v = n.facts) == null ? void 0 : v.given_name) || n.number), 1),
                A(" " + g(n.state === "running" ? "Running" : "Idle") + ", " + g(a(be)(n.state === "running" ? n.process_started_at || n.created_at : n.ended_at, a(G))), 1),
                o("small", null, g([n.program, (V = n.facts) == null ? void 0 : V.model, (W = n.facts) == null ? void 0 : W.effort, `${n.role} ${n.id}`].filter(Boolean).join(", ")), 1),
                o("small", null, g(((D = n.facts) == null ? void 0 : D.task_title) || ((ne = n.facts) == null ? void 0 : ne.helper_job)), 1)
              ]),
              y(a(E), {
                small: "",
                onClick: (z) => ue(n)
              }, {
                default: S(() => [...e[11] || (e[11] = [
                  A("Open", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              n.state === "idle" && !a(u).readOnly ? (l(), T(a(E), {
                key: 0,
                small: "",
                onClick: (z) => {
                  B.value = n.id, j.value = "";
                }
              }, {
                default: S(() => [...e[12] || (e[12] = [
                  A("Retire", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : b("", !0),
              B.value === n.id ? (l(), T(Re, {
                key: 1,
                reason: j.value,
                "onUpdate:reason": e[1] || (e[1] = (z) => j.value = z),
                pending: C.value,
                onSubmit: (z) => ie(n),
                onCancel: e[2] || (e[2] = (z) => B.value = null)
              }, null, 8, ["reason", "pending", "onSubmit"])) : b("", !0)
            ], 8, Ye);
          }), 128)),
          P.value ? (l(), T(a(E), {
            key: 1,
            small: "",
            onClick: e[3] || (e[3] = (n) => $(p.value, k.value + 1))
          }, {
            default: S(() => [...e[13] || (e[13] = [
              A("Show more", -1)
            ])]),
            _: 1
          })) : b("", !0)
        ], 64)) : (l(), c(I, { key: 3 }, [
          e[15] || (e[15] = o("div", { class: "columns" }, [
            o("span", null, "Name"),
            o("span", null, "Running"),
            o("span", null, "Kept"),
            o("span")
          ], -1)),
          L.value ? (l(), c("div", Je, [
            e[14] || (e[14] = o("strong", null, "Read-only helpers", -1)),
            o("span", null, g(L.value.running) + " running, " + g(L.value.kept) + " kept", 1)
          ])) : b("", !0),
          (l(!0), c(I, null, H(q.value, (n) => (l(), c("button", {
            key: n.key,
            type: "button",
            class: "count-row",
            "data-agent-limit-type": n.type || n.key,
            "data-agent-limit-profile": n.profile,
            onClick: (v) => U(n)
          }, [
            o("strong", null, g(n.label), 1),
            (l(!0), c(I, null, H([{ count: n.running, limit: n.run_limit, unlimited: !1 }, { count: n.kept, limit: n.kept_limit, unlimited: !0 }], (v) => (l(), c("span", {
              key: v.unlimited,
              class: Y({ full: a(_e)(v.count, v.limit) })
            }, [
              o("span", null, [
                A(g(v.count), 1),
                v.limit || !v.unlimited ? (l(), c(I, { key: 0 }, [
                  A(" of " + g(v.limit), 1)
                ], 64)) : b("", !0)
              ]),
              v.limit ? (l(), c("span", Xe, [
                o("span", {
                  style: se({ width: Q(v.count, v.limit) })
                }, null, 4),
                o("i", {
                  style: se({ width: K(v.count, v.limit) })
                }, null, 4)
              ])) : b("", !0)
            ], 2))), 128)),
            y(a(we), {
              name: "chevronRight",
              size: 12
            })
          ], 8, Qe))), 128))
        ], 64)),
        x.value ? (l(), c("p", Ze, g(x.value), 1)) : R.value ? (l(), c("p", et, g(R.value), 1)) : b("", !0)
      ], 2))
    ]));
  }
}, nt = /* @__PURE__ */ N(tt, [["__scopeId", "data-v-55110dab"]]), st = {
  class: "agents",
  "data-agent-settings-agents": ""
}, at = {
  __name: "AgentSettingsAgents",
  setup(r) {
    const m = ee(), t = O("Agent counts"), h = (u) => m.open("agents.agents", u.id);
    return me(() => m.reload("limits")), (u, d) => (l(), c("section", st, [
      y(nt, {
        title: t.value,
        "onUpdate:title": d[0] || (d[0] = (f) => t.value = f),
        onOpenAgent: h
      }, null, 8, ["title"])
    ]));
  }
}, ot = /* @__PURE__ */ N(at, [["__scopeId", "data-v-fde7fc3f"]]), lt = {
  class: "page",
  "data-agent-settings-presets": ""
}, rt = { class: "crumb" }, it = { class: "body" }, ut = { class: "cards" }, dt = "Any other mix of the eight switches. The form shows Custom as soon as the switches match neither preset.", ct = {
  __name: "AgentSettingsPresets",
  props: { presets: { type: Array, required: !0 }, switches: { type: Array, required: !0 }, now: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back", "fill"],
  setup(r, { emit: m }) {
    const t = m;
    return (h, u) => (l(), c("section", lt, [
      o("div", rt, [
        o("button", {
          type: "button",
          class: "back",
          "data-presets-back": "",
          onClick: u[0] || (u[0] = (d) => t("back"))
        }, "‹ Back"),
        u[1] || (u[1] = o("b", null, "What is a preset?", -1))
      ]),
      o("div", it, [
        u[2] || (u[2] = o("p", { class: "lead" }, "A preset is a set of eight switches and nothing more. It is not a kind of agent: the main agent is the same program under every preset, and a preset only fills in the switches below. Nothing is saved until you press Save.", -1)),
        o("div", ut, [
          (l(!0), c(I, null, H(r.presets, (d) => (l(), T(a(oe), {
            key: d.key,
            name: d.name,
            line: d.line,
            "can-fill": !r.readOnly,
            onFill: (f) => t("fill", d.key)
          }, null, 8, ["name", "line", "can-fill", "onFill"]))), 128)),
          y(a(oe), {
            name: "Custom",
            line: dt
          })
        ]),
        y(a(Ce), {
          rows: r.switches,
          presets: r.presets,
          now: r.now
        }, null, 8, ["rows", "presets", "now"])
      ])
    ]));
  }
}, vt = /* @__PURE__ */ N(ct, [["__scopeId", "data-v-2cf94460"]]), mt = { class: "screen" }, pt = { class: "rail" }, gt = {
  __name: "AgentSettingsScreen",
  props: { nodes: { type: Array, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 }, extras: { type: Object, default: () => ({}) }, found: { type: String, default: "" } },
  setup(r) {
    const m = r, t = O(null), h = w(() => Ae(m.nodes));
    Z(() => m.found, (d) => d && pe(() => {
      var f, _;
      return (_ = (f = t.value) == null ? void 0 : f.querySelector(`[data-setting="${d}"]`)) == null ? void 0 : _.scrollIntoView({ block: "center" });
    }), { immediate: !0, flush: "post" });
    const u = (d) => {
      var f, _;
      return (_ = (f = t.value) == null ? void 0 : f.querySelector(`[data-section="${d}"]`)) == null ? void 0 : _.scrollIntoView({ block: "start", behavior: "smooth" });
    };
    return (d, f) => (l(), c("div", mt, [
      o("nav", pt, [
        y(a(Oe), {
          sections: h.value,
          scope: t.value,
          onChoose: u
        }, null, 8, ["sections", "scope"])
      ]),
      o("div", {
        ref_key: "scroll",
        ref: t,
        class: "content"
      }, [
        ge(d.$slots, "before", {}, void 0, !0),
        y(a(xe), {
          nodes: r.nodes,
          draft: r.draft,
          "read-only": r.readOnly,
          extras: r.extras,
          found: r.found
        }, null, 8, ["nodes", "draft", "read-only", "extras", "found"])
      ], 512)
    ]));
  }
}, X = /* @__PURE__ */ N(gt, [["__scopeId", "data-v-1cab27ca"]]), ft = {
  class: "settings",
  "data-agent-settings": ""
}, yt = { class: "head" }, kt = {
  class: "env",
  "data-settings-environment": ""
}, bt = { class: "settings-bar" }, wt = {
  key: 1,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, ht = {
  key: 0,
  class: "hint",
  "data-work-hint": ""
}, $t = "journal.suites.coding.auto-mode", St = "journal.suites.coding.workers.main-dispatches-workers", _t = 1200, Ct = {
  __name: "AgentSettings",
  setup(r) {
    const m = { work: "work-screen", tests: "tests-screen", advanced: "advanced-screen" }, t = ee(), h = O("work"), u = [{ key: "work", label: "Work" }, { key: "agents", label: "Helpers" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }], d = w(() => u.find((i) => i.key === h.value)), f = () => Object.values(m).map((i) => t.props[i].data.value), _ = w(() => f().every(Boolean)), k = Ie({
      run: (i) => t.run(i),
      reload: async () => {
        await Promise.all(Object.values(m).map((i) => t.reload(i))), k.load(f());
      }
    });
    Z(f, (i) => {
      i.every(Boolean) && k.load(i);
    }, { immediate: !0 });
    const P = (i) => {
      var $;
      return (($ = t.props[m[i]].data.value) == null ? void 0 : $.nodes) ?? [];
    }, G = w(() => k.value($t) === !1 && k.value(St) === !1), F = w(() => h.value !== "agents" && !t.readOnly), C = O("main"), x = w(() => {
      var i;
      return ((i = t.props.work.data.value) == null ? void 0 : i.presets) ?? [];
    }), R = w(() => {
      var i;
      return ((i = t.props.work.data.value) == null ? void 0 : i.switches) ?? [];
    }), B = w(() => Object.fromEntries(R.value.map((i) => [i.key, k.value(i.key)]))), j = w(() => Te(B.value, x.value)), q = (i) => k.fill(x.value.find(($) => $.key === i).values), L = w(() => {
      var i;
      return ((i = t.props.find.data.value) == null ? void 0 : i.rows) ?? [];
    }), p = O("");
    let M = null;
    const J = (i) => i.startsWith("helper-type") ? "agents" : i;
    function Q(i) {
      C.value = "main", K({ key: J(i.screen) }), p.value = i.key, clearTimeout(M), M = setTimeout(() => {
        p.value = "";
      }, _t);
    }
    fe(() => clearTimeout(M));
    function K(i) {
      h.value = i.key, t.state.tab = i.key === "agents" ? "agents" : "";
    }
    return (i, $) => (l(), T(a(he), { padding: "0" }, {
      default: S(() => [
        o("div", ft, [
          y(a(ae), { value: C.value }, {
            main: S(() => [
              o("div", yt, [
                o("span", kt, g(a(t).environment), 1)
              ]),
              x.value.length ? (l(), T(a(Be), {
                key: 0,
                presets: x.value,
                current: j.value,
                disabled: a(t).readOnly,
                onPick: q,
                onOpenPage: $[0] || ($[0] = (U) => C.value = "presets")
              }, {
                default: S(() => [
                  y(a(je), {
                    index: L.value,
                    onPick: Q
                  }, null, 8, ["index"])
                ]),
                _: 1
              }, 8, ["presets", "current", "disabled"])) : b("", !0),
              o("div", bt, [
                y(a($e), {
                  tabs: u,
                  active: d.value,
                  onChoose: K
                }, null, 8, ["active"])
              ]),
              a(t).readOnly ? (l(), c("p", wt, "Only a person can change these settings. You can read every value, and ask a person for a change.")) : b("", !0),
              o("div", {
                class: Y(["settings-body", { flush: h.value === "agents" }])
              }, [
                y(a(Se), { tab: d.value }, {
                  default: S(() => [
                    y(a(ae), { value: h.value }, {
                      work: S(() => [
                        _.value ? (l(), T(X, {
                          key: "work",
                          nodes: P("work"),
                          draft: a(k),
                          "read-only": a(t).readOnly,
                          found: p.value,
                          "data-agent-settings-work": ""
                        }, {
                          before: S(() => [
                            G.value ? (l(), c("p", ht, "With Auto off and no workers, nothing starts the work: a person starts tasks or turns one of them on.")) : b("", !0)
                          ]),
                          _: 1
                        }, 8, ["nodes", "draft", "read-only", "found"])) : b("", !0)
                      ]),
                      agents: S(() => [
                        y(ot)
                      ]),
                      tests: S(() => [
                        _.value ? (l(), T(X, {
                          key: "tests",
                          nodes: P("tests"),
                          draft: a(k),
                          "read-only": a(t).readOnly,
                          found: p.value,
                          "data-agent-settings-tests": ""
                        }, null, 8, ["nodes", "draft", "read-only", "found"])) : b("", !0)
                      ]),
                      advanced: S(() => [
                        _.value ? (l(), T(X, {
                          key: "advanced",
                          nodes: P("advanced"),
                          draft: a(k),
                          "read-only": a(t).readOnly,
                          found: p.value,
                          "data-agent-settings-advanced": ""
                        }, null, 8, ["nodes", "draft", "read-only", "found"])) : b("", !0)
                      ]),
                      _: 1
                    }, 8, ["value"])
                  ]),
                  _: 1
                }, 8, ["tab"])
              ], 2)
            ]),
            presets: S(() => [
              y(vt, {
                presets: x.value,
                switches: R.value,
                now: B.value,
                "read-only": a(t).readOnly,
                onBack: $[1] || ($[1] = (U) => C.value = "main"),
                onFill: q
              }, null, 8, ["presets", "switches", "now", "read-only"])
            ]),
            _: 1
          }, 8, ["value"]),
          F.value || C.value === "presets" && !a(t).readOnly ? (l(), T(a(Me), {
            key: 0,
            changes: a(k).changes(),
            "can-save": a(k).canSave.value,
            pending: a(k).pending.value,
            reason: a(k).reason.value,
            environment: a(t).environment,
            onSave: $[2] || ($[2] = (U) => a(k).apply()),
            onCancel: $[3] || ($[3] = (U) => a(k).reset())
          }, null, 8, ["changes", "can-save", "pending", "reason", "environment"])) : b("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, Tt = /* @__PURE__ */ N(Ct, [["__scopeId", "data-v-f51f9daa"]]);
export {
  Tt as A
};
