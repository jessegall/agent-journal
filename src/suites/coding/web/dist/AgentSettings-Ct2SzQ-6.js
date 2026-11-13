import { openBlock as s, createElementBlock as d, createElementVNode as u, Fragment as F, renderList as D, createBlock as P, unref as i, createVNode as S, withModifiers as be, withCtx as B, createTextVNode as Y, ref as N, computed as y, onMounted as ee, toDisplayString as k, createCommentVNode as _, normalizeClass as J, watch as ue, withDirectives as ae, vModelSelect as Te, vModelText as ce, nextTick as xe, renderSlot as Re, onBeforeUnmount as Ne } from "vue";
import { TextInput as Ee, Btn as Z, useWindow as X, useNow as Ie, agentTitle as je, age as Be, agentNumber as Pe, TabBody as Le, SwitchCase as we, WindowRoom as qe, InnerTabs as Fe } from "@journal/window-kit";
import { SettingPresetCard as ve, SettingPresetCompareTable as Me, SettingEmptyState as Ve, isFull as pe, SettingBackPath as Ue, SettingPerTypeOverrideRow as fe, SettingsScreen as _e, SettingRow as ge, SettingEntryList as We, SettingThreeWayCap as De, SettingBanner as He, SettingHelperTypeTable as Ke, sectionsOf as Ge, SettingSectionList as ze, useSettingsDraft as Ye, currentPreset as Xe, SettingPresetBand as Je, FindBox as Ze, ChangeFoot as Qe } from "@journal/setting-components";
import { _ as H } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const et = {
  class: "page",
  "data-agent-settings-presets": ""
}, tt = { class: "crumb" }, nt = { class: "body" }, at = { class: "cards" }, st = "Any other mix of the eight switches. The form shows Custom as soon as the switches match neither preset.", ot = {
  __name: "AgentSettingsPresets",
  props: { presets: { type: Array, required: !0 }, switches: { type: Array, required: !0 }, now: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back", "fill"],
  setup(t, { emit: r }) {
    const e = r;
    return (a, c) => (s(), d("section", et, [
      u("div", tt, [
        u("button", {
          type: "button",
          class: "back",
          "data-presets-back": "",
          onClick: c[0] || (c[0] = (v) => e("back"))
        }, "‹ Back"),
        c[1] || (c[1] = u("b", null, "What is a preset?", -1))
      ]),
      u("div", nt, [
        c[2] || (c[2] = u("p", { class: "lead" }, "A preset is a set of eight switches and nothing more. It is not a type of agent: the main agent is the same program under every preset, and a preset only fills in the switches below. Nothing is saved until you press Save.", -1)),
        u("div", at, [
          (s(!0), d(F, null, D(t.presets, (v) => (s(), P(i(ve), {
            key: v.key,
            name: v.name,
            line: v.line,
            "can-fill": !t.readOnly,
            onFill: (b) => e("fill", v.key)
          }, null, 8, ["name", "line", "can-fill", "onFill"]))), 128)),
          S(i(ve), {
            name: "Custom",
            line: st
          })
        ]),
        S(i(Me), {
          rows: t.switches,
          presets: t.presets,
          now: t.now
        }, null, 8, ["rows", "presets", "now"])
      ])
    ]));
  }
}, lt = /* @__PURE__ */ H(ot, [["__scopeId", "data-v-cf40939d"]]), rt = { class: "action-buttons" }, it = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(t) {
    return (r, e) => (s(), d("form", {
      "data-agent-retire-confirm": "",
      onSubmit: e[2] || (e[2] = be((a) => r.$emit("submit"), ["prevent"]))
    }, [
      e[5] || (e[5] = u("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      S(i(Ee), {
        "model-value": t.reason,
        label: "Reason",
        disabled: t.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": e[0] || (e[0] = (a) => r.$emit("update:reason", a))
      }, null, 8, ["model-value", "disabled"]),
      u("div", rt, [
        S(i(Z), {
          type: "submit",
          small: "",
          disabled: t.pending || !t.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: B(() => [...e[3] || (e[3] = [
            Y("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        S(i(Z), {
          small: "",
          disabled: t.pending,
          onClick: e[1] || (e[1] = (a) => r.$emit("cancel"))
        }, {
          default: B(() => [...e[4] || (e[4] = [
            Y("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ut = /* @__PURE__ */ H(it, [["__scopeId", "data-v-92de7dd6"]]), dt = {
  class: "type-agents",
  "data-type-agents": ""
}, ct = { class: "models" }, vt = ["data-count-agent"], pt = { class: "person-text" }, ft = {
  key: 2,
  role: "alert",
  class: "bad"
}, gt = {
  key: 3,
  role: "status"
}, mt = {
  __name: "AgentTypeAgents",
  props: { role: { type: String, required: !0 }, profile: { type: String, default: "" } },
  emits: ["open-agent", "retired"],
  setup(t, { emit: r }) {
    const e = t, a = r, c = X(), v = Ie(), b = N([]), T = N(0), o = N(!1), C = N(!1), E = N(""), x = N(""), w = N(null), I = N(""), M = y(() => b.value.filter(($) => {
      var p;
      return $.state !== "retired" && $.role === e.role && (!e.profile || (((p = $.facts) == null ? void 0 : p.profile) || $.profile) === e.profile);
    }).sort(($, p) => ($.state !== "running") - (p.state !== "running") || String($.ended_at || $.created_at).localeCompare(String(p.ended_at || p.created_at)))), U = y(() => {
      var p;
      const $ = /* @__PURE__ */ new Map();
      for (const g of M.value) {
        const q = ((p = g.facts) == null ? void 0 : p.model) || g.program_model;
        q && $.set(q, ($.get(q) || 0) + 1);
      }
      return [...$].map(([g, q]) => `${q} ${g}`).join(", ");
    });
    async function L($ = 1) {
      c.state["count-agents.role"] = e.role, e.profile ? c.state["count-agents.profile"] = e.profile : delete c.state["count-agents.profile"], c.state["count-agents.page"] = String($), await c.reload("count-agents");
      const p = c.props["count-agents"];
      b.value = $ === 1 ? [...p.rows.value] : [...b.value, ...p.rows.value], T.value = $, o.value = p.more.value;
    }
    async function K($) {
      if (!I.value.trim() || C.value) return;
      C.value = !0;
      const p = await c.run(["agent", "retire", String($.number), "--reason", I.value.trim()]);
      E.value = p.ok ? "" : "The agent could not be retired. Try again.", p.ok && (w.value = null, I.value = "", x.value = "Agent retired permanently.", a("retired"), await L()), C.value = !1;
    }
    return ee(() => L()), ($, p) => (s(), d("section", dt, [
      u("p", ct, k(U.value), 1),
      M.value.length ? _("", !0) : (s(), P(i(Ve), {
        key: 0,
        title: "No agents here yet",
        line: "An agent shows here as soon as one of this type starts."
      })),
      (s(!0), d(F, null, D(M.value, (g) => {
        var q, V, m, O;
        return s(), d("div", {
          key: g.id,
          class: "person",
          "data-count-agent": g.id
        }, [
          u("span", {
            class: J(["dot", { running: g.state === "running" }])
          }, null, 2),
          u("div", pt, [
            u("strong", null, k(i(je)(g).text), 1),
            Y(" " + k(g.state === "running" ? "Running" : "Idle") + ", " + k(i(Be)(g.state === "running" ? g.process_started_at || g.created_at : g.ended_at, i(v))) + " ", 1),
            u("small", null, k([g.program, (q = g.facts) == null ? void 0 : q.model, (V = g.facts) == null ? void 0 : V.effort, i(Pe)(g)].filter(Boolean).join(", ")), 1),
            u("small", null, k(((m = g.facts) == null ? void 0 : m.task_title) || ((O = g.facts) == null ? void 0 : O.helper_job)), 1)
          ]),
          S(i(Z), {
            small: "",
            onClick: (R) => a("open-agent", g)
          }, {
            default: B(() => [...p[3] || (p[3] = [
              Y("Open", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]),
          g.state === "idle" && !i(c).readOnly ? (s(), P(i(Z), {
            key: 0,
            small: "",
            onClick: (R) => {
              w.value = g.id, I.value = "";
            }
          }, {
            default: B(() => [...p[4] || (p[4] = [
              Y("Retire", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])) : _("", !0),
          w.value === g.id ? (s(), P(ut, {
            key: 1,
            reason: I.value,
            "onUpdate:reason": p[0] || (p[0] = (R) => I.value = R),
            pending: C.value,
            onSubmit: (R) => K(g),
            onCancel: p[1] || (p[1] = (R) => w.value = null)
          }, null, 8, ["reason", "pending", "onSubmit"])) : _("", !0)
        ], 8, vt);
      }), 128)),
      o.value ? (s(), P(i(Z), {
        key: 1,
        small: "",
        onClick: p[2] || (p[2] = (g) => L(T.value + 1))
      }, {
        default: B(() => [...p[5] || (p[5] = [
          Y("Show more", -1)
        ])]),
        _: 1
      })) : _("", !0),
      E.value ? (s(), d("p", ft, k(E.value), 1)) : x.value ? (s(), d("p", gt, k(x.value), 1)) : _("", !0)
    ]));
  }
}, yt = /* @__PURE__ */ H(mt, [["__scopeId", "data-v-67f17bfa"]]), z = "journal.core.helpers", kt = `${z}.context-limit-on`, de = `${z}.context-limit-tokens`, $e = `${z}.context-limit-kinds`, Q = `${z}.context-limit-profiles`, se = `${z}.read-only-helper-profile-limits`, ht = `${z}.read-only-helper-run-limit`, bt = `${z}.read-only-helper-kept-limit`, oe = "journal.suites.coding.workers.merge-hooks", wt = "none", Oe = (t) => `${t / 1e3}k`, Se = (t) => {
  const r = t.lastIndexOf(":");
  return { name: t.slice(0, r).trim(), value: t.slice(r + 1).trim() };
}, Ce = (t) => {
  const r = t.indexOf(":");
  return r < 0 ? { text: t, name: "", command: "" } : { text: t, name: t.slice(0, r).trim(), command: t.slice(r + 1).trim() };
}, _t = (t, r) => (t ?? []).map(Ce).filter((e) => e.name === r).map((e) => e.command), $t = (t, r, e) => [
  ...(t ?? []).map(Ce).filter((a) => a.name !== r).map((a) => a.text),
  ...e.map((a) => `${r}: ${a}`)
], ne = (t, r) => {
  var e;
  return (e = (t ?? []).map(Se).find((a) => a.name === r)) == null ? void 0 : e.value;
}, me = (t) => t === wt ? "No cap" : Oe(Number(t));
function ye(t, r, e) {
  if (t(kt) !== !0) return { text: "Off", where: "Context limit is off", own: !1 };
  const a = e ? ne(t(Q), e) : void 0;
  if (a !== void 0) return { text: me(a), where: "Own value", own: !0 };
  const c = ne(t($e), r);
  return c !== void 0 ? { text: me(c), where: "Set for its type", own: !1 } : { text: Oe(Number(t(de))), where: "Set for every agent", own: !1 };
}
const Ot = (t) => t > 0 ? t : null, St = { worker: "workers" }, te = "merger", ke = "designer";
function he(t, r, e, a, c, v = {}) {
  return { key: t, name: r, line: e, running: a.running, runLimit: a.run_limit, kept: a.kept, keptLimit: Ot(a.kept_limit), cap: c, ...v };
}
function Ct(t, r) {
  const e = t.filter((o) => !o.per_profile).map((o) => he(o.key, o.label, o.line, o, ye(r, o.key, ""), { screen: St[o.key] ?? "read-only", role: o.key, profile: "", defaultProfile: o.default_profile })), a = t.find((o) => o.per_profile);
  if (!a) return e;
  const c = (o) => he(`${a.key}:${o.profile}`, o.title, o.line, o, ye(r, a.key, o.profile), { screen: o.group === te ? te : "read-only", role: a.key, profile: o.profile }), v = a.profiles.filter((o) => o.group === te || o.group === ke).map(c), b = a.profiles.filter((o) => o.group !== te && o.group !== ke).map((o) => ({ ...c(o), indent: !0 })), T = { key: a.key, name: "Read-only helpers", group: !0, screen: "read-only", role: a.key, profile: "", line: `${a.running} running, ${a.kept} kept. Every profile runs up to ${a.run_limit} and keeps ${a.kept_limit ? `up to ${a.kept_limit}` : "any number"} unless it has limits of its own.` };
  return [...e, ...v, T, ...b];
}
const ie = Array.from({ length: 10 }, (t, r) => (r + 1) * 1e5), At = (t) => t.filter((r) => !r.group && (pe(r.running, r.runLimit) || pe(r.kept, r.keptLimit ?? 0))).length;
function Ae(t, r) {
  const e = y(() => t.props.limits.rows.value ?? []), a = y(() => Ct(e.value, r.value)), c = y(() => !!t.props.limits.failure.value);
  return { rows: a, unreadable: c, reread: () => t.reload("limits") };
}
const Tt = {
  class: "type",
  "data-agent-type-screen": ""
}, xt = { class: "typebody" }, Rt = {
  class: "typemain",
  "data-type-settings": ""
}, Nt = { class: "typeside" }, le = "none", Et = "worker", It = {
  __name: "AgentSettingsTypeScreen",
  props: { row: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back"],
  setup(t, { emit: r }) {
    const e = t, a = r, c = X(), v = y(() => c.props["type-screen"].data.value), b = y(() => {
      var m;
      return ((m = v.value) == null ? void 0 : m.nodes) ?? [];
    }), T = y(() => e.row.profile !== "");
    async function o() {
      c.state["type-screen.type"] = e.row.screen, await c.reload("type-screen");
    }
    ue(v, (m) => {
      m && e.draft.load([m]);
    }), ee(o);
    const C = y(() => (e.draft.value(se) ?? []).map((m) => m.split(":"))), E = y(() => C.value.find((m) => m[0] === e.row.profile)), x = y(() => ({ running: Number(e.draft.value(ht)), kept: Number(e.draft.value(bt)) })), w = (m) => E.value ? Number(E.value[m === "running" ? 1 : 2]) : null;
    function I(m, O) {
      const R = C.value.filter((l) => l[0] !== e.row.profile).map((l) => l.join(":"));
      if (O === null) return e.draft.set(se, R);
      if (O === "") return;
      const W = m === "running" ? O : w("running") ?? x.value.running, G = m === "kept" ? O : w("kept") ?? x.value.kept;
      e.draft.set(se, [...R, `${e.row.profile}:${W}:${G}`]);
    }
    const M = y(() => e.row.group ? "" : e.row.profile || e.row.defaultProfile || ""), U = y(() => ne(e.draft.value(Q), M.value)), L = y(() => U.value === void 0 ? "kind" : U.value === le ? "none" : "own"), K = y(() => {
      const m = ne(e.draft.value($e), e.row.role);
      return m === le ? null : Number(m ?? e.draft.value(de));
    });
    function $({ mode: m, size: O }) {
      const R = (e.draft.value(Q) ?? []).filter((W) => W.slice(0, W.lastIndexOf(":")).trim() !== M.value);
      e.draft.set(Q, m === "kind" ? R : [...R, `${M.value}:${m === "none" ? le : O}`]);
    }
    const p = y(() => e.row.role === Et ? M.value : ""), g = y(() => _t(e.draft.value(oe), p.value)), q = (m) => e.draft.set(oe, $t(e.draft.value(oe), p.value, m)), V = (m) => c.open("agents.agents", m.id);
    return (m, O) => (s(), d("div", Tt, [
      S(i(Ue), {
        parent: "Helpers",
        current: t.row.name,
        onBack: O[0] || (O[0] = (R) => a("back"))
      }, null, 8, ["current"]),
      u("div", xt, [
        u("div", Rt, [
          T.value && t.row.screen === "read-only" ? (s(), d(F, { key: 0 }, [
            S(i(fe), {
              label: "Running",
              help: "Agents of this profile that run at once.",
              "every-value": x.value.running,
              "own-value": w("running"),
              disabled: t.readOnly,
              "data-override-running": "",
              "onUpdate:ownValue": O[1] || (O[1] = (R) => I("running", R))
            }, null, 8, ["every-value", "own-value", "disabled"]),
            S(i(fe), {
              label: "Kept",
              help: "Agents of this profile kept until retired, running or idle. At 0 there is no limit.",
              "every-value": x.value.kept,
              "own-value": w("kept"),
              disabled: t.readOnly,
              "data-override-kept": "",
              "onUpdate:ownValue": O[2] || (O[2] = (R) => I("kept", R))
            }, null, 8, ["every-value", "own-value", "disabled"])
          ], 64)) : (s(), P(i(_e), {
            key: 1,
            nodes: b.value,
            draft: t.draft,
            "read-only": t.readOnly
          }, null, 8, ["nodes", "draft", "read-only"])),
          p.value ? (s(), P(i(ge), {
            key: 2,
            label: "When merged",
            help: "Commands run in the main checkout after a worker of this profile is merged. One that fails is told to the main agent; the merge stands.",
            source: g.value.length ? "own" : "default",
            "data-merge-hooks": ""
          }, {
            default: B(() => [
              S(i(We), {
                "model-value": g.value,
                placeholder: "a command",
                disabled: t.readOnly,
                "onUpdate:modelValue": q
              }, null, 8, ["model-value", "disabled"])
            ]),
            _: 1
          }, 8, ["source"])) : _("", !0),
          M.value ? (s(), P(i(ge), {
            key: 3,
            label: "Context cap",
            help: "The context size at which this type is compacted.",
            source: L.value === "own" || L.value === "none" ? "own" : "default",
            "data-context-cap": ""
          }, {
            default: B(() => [
              S(i(De), {
                mode: L.value,
                "kind-value": K.value,
                "own-value": L.value === "own" ? Number(U.value) : null,
                sizes: i(ie),
                disabled: t.readOnly,
                onChange: $
              }, null, 8, ["mode", "kind-value", "own-value", "sizes", "disabled"])
            ]),
            _: 1
          }, 8, ["source"])) : _("", !0)
        ]),
        u("aside", Nt, [
          O[3] || (O[3] = u("h3", null, "Agents", -1)),
          S(yt, {
            role: t.row.role,
            profile: t.row.profile,
            onOpenAgent: V
          }, null, 8, ["role", "profile"])
        ])
      ])
    ]));
  }
}, jt = /* @__PURE__ */ H(It, [["__scopeId", "data-v-3bc929c1"]]), Bt = {
  class: "agents",
  "data-agent-settings-agents": ""
}, Pt = {
  __name: "AgentSettingsAgents",
  props: { draft: { type: Object, required: !0 } },
  setup(t) {
    const r = t, e = X(), { rows: a, unreadable: c, reread: v } = Ae(e, r.draft), b = N(null);
    ee(v);
    const T = (o) => {
      b.value = a.value.find((C) => C.key === o);
    };
    return (o, C) => (s(), d("section", Bt, [
      b.value ? (s(), P(jt, {
        key: 0,
        row: b.value,
        draft: t.draft,
        "read-only": i(e).readOnly,
        onBack: C[0] || (C[0] = (E) => b.value = null)
      }, null, 8, ["row", "draft", "read-only"])) : i(c) ? (s(), P(i(He), {
        key: 1,
        kind: "unreadable",
        text: "The counts could not be read.",
        onRetry: i(v)
      }, null, 8, ["onRetry"])) : (s(), P(i(Ke), {
        key: 2,
        rows: i(a),
        onOpen: T
      }, null, 8, ["rows"]))
    ]));
  }
}, Lt = /* @__PURE__ */ H(Pt, [["__scopeId", "data-v-05cc036a"]]), qt = {
  class: "activity",
  "data-assign-activity": ""
}, Ft = {
  key: 0,
  class: "activity",
  "data-assign-last-skip": ""
}, Mt = {
  __name: "AssignRuleActivity",
  props: { activity: { type: Object, required: !0 } },
  setup(t) {
    return (r, e) => (s(), d(F, null, [
      u("span", qt, k(t.activity.text), 1),
      t.activity.last_skip ? (s(), d("span", Ft, "Last skipped: " + k(t.activity.last_skip), 1)) : _("", !0)
    ], 64));
  }
}, Vt = /* @__PURE__ */ H(Mt, [["__scopeId", "data-v-51520c3a"]]), Ut = {
  class: "changes",
  "data-assign-task-change": ""
}, Wt = ["title", "data-assign-change", "onClick"], Dt = {
  key: 0,
  class: "listing",
  "data-assign-listing": ""
}, Ht = { class: "heading" }, Kt = ["disabled"], Gt = {
  __name: "AssignRuleTaskChange",
  props: { rule: { type: Object, required: !0 }, revision: { type: String, required: !0 } },
  emits: ["changed", "failed"],
  setup(t, { emit: r }) {
    const e = t, a = r, c = X(), v = N(null), b = [
      { verb: "apply", label: "Apply now", title: "List the free tasks the rule would give now" },
      { verb: "reassign", label: "Move its tasks", title: "List the waiting tasks the rule gave that would move to its target" },
      { verb: "give-back", label: "Give back its tasks", title: "List the waiting tasks the rule gave that would be free again" }
    ];
    async function T(E, x) {
      const w = ["assign-rule", E, String(e.rule.id), ...x ? ["--confirm"] : [], "--revision", e.revision, "--environment", c.environment], I = await c.run(w);
      return I.ok || a("failed", I.error), I;
    }
    async function o(E) {
      const x = await T(E, !1);
      v.value = x.ok ? { verb: E, tasks: x.value.tasks, text: x.value.text } : null;
    }
    async function C() {
      await T(v.value.verb, !0), v.value = null, a("changed");
    }
    return (E, x) => (s(), d(F, null, [
      u("span", Ut, [
        (s(), d(F, null, D(b, (w) => u("button", {
          key: w.verb,
          type: "button",
          title: w.title,
          "data-assign-change": w.verb,
          onClick: (I) => o(w.verb)
        }, k(w.label), 9, Wt)), 64))
      ]),
      v.value ? (s(), d("div", Dt, [
        u("p", Ht, "Tasks: " + k(v.value.tasks.length) + ". Nothing changes until you confirm.", 1),
        (s(!0), d(F, null, D(v.value.tasks, (w) => (s(), d("p", {
          key: w.task_id,
          class: "task"
        }, "Task " + k(w.task_id) + ", " + k(w.title) + ": " + k(w.target), 1))), 128)),
        u("button", {
          type: "button",
          disabled: !v.value.tasks.length,
          "data-assign-confirm": "",
          onClick: C
        }, "Change these tasks", 8, Kt),
        u("button", {
          type: "button",
          onClick: x[0] || (x[0] = (w) => v.value = null)
        }, "Cancel")
      ])) : _("", !0)
    ], 64));
  }
}, zt = /* @__PURE__ */ H(Gt, [["__scopeId", "data-v-f13ec31d"]]), Yt = {
  class: "assign",
  "data-agent-settings-assign": ""
}, Xt = {
  class: "targets",
  role: "listbox",
  "aria-label": "Give tasks to"
}, Jt = ["aria-selected", "data-assign-target", "onClick"], Zt = { class: "name" }, Qt = { class: "facts" }, en = {
  key: 0,
  class: "facts"
}, tn = {
  key: 1,
  class: "facts",
  "data-assign-waiting": ""
}, nn = { class: "rules" }, an = ["data-assign-rule"], sn = { class: "place" }, on = { class: "summary" }, ln = {
  key: 0,
  class: "warning",
  "data-assign-warning": ""
}, rn = { class: "actions" }, un = ["disabled", "onClick"], dn = ["disabled", "onClick"], cn = ["title", "onClick"], vn = ["onClick"], pn = {
  key: 0,
  class: "empty"
}, fn = ["value", "onChange"], gn = ["value"], mn = ["onUpdate:modelValue"], yn = ["value"], kn = ["onUpdate:modelValue"], hn = ["disabled", "onClick"], bn = {
  key: 0,
  class: "warning",
  "data-assign-main-warning": ""
}, wn = { class: "trial" }, _n = ["disabled"], $n = {
  key: 1,
  class: "verdict",
  "data-assign-recent": ""
}, On = {
  key: 2,
  class: "trial-result",
  "data-assign-trial": ""
}, Sn = { class: "verdict" }, Cn = {
  key: 2,
  class: "failure",
  role: "alert",
  "data-assign-failure": ""
}, An = "journal.suites.coding.main-writes-code", Tn = {
  __name: "AgentSettingsAssign",
  props: { draft: { type: Object, required: !0 }, readOnly: Boolean },
  setup(t) {
    const r = t, e = X(), a = y(() => e.props.assign.data.value), c = N("main"), v = N("");
    let b = 0;
    const T = () => ({ id: ++b, field: "complexity", operator: "minimum", value: "" }), o = N([T()]);
    ee(() => e.reload("assign"));
    const C = y(() => {
      var l, f;
      return ((l = a.value) == null ? void 0 : l.targets.find((j) => j.key === c.value)) ?? ((f = a.value) == null ? void 0 : f.targets[0]);
    }), E = y(() => {
      var l;
      return (((l = a.value) == null ? void 0 : l.rules) ?? []).filter((f) => {
        var j;
        return f.target_key === ((j = C.value) == null ? void 0 : j.key);
      });
    }), x = (l) => {
      var f, j;
      return ((j = (f = a.value) == null ? void 0 : f.fields.find((n) => n.field === l)) == null ? void 0 : j.operators) ?? [];
    }, w = (l) => {
      var f;
      return ((f = x(l.field).find((j) => j.operator === l.operator)) == null ? void 0 : f.needs_value) ?? !1;
    }, I = y(() => {
      var l;
      return ((l = C.value) == null ? void 0 : l.target) === "main" && r.draft.value(An) === !1;
    });
    function M(l) {
      return { main: ["--target", "main"], agent: ["--target", "agent", "--agent", `row:${l.agent_id}`], model: ["--target", "model", "--program", l.program, "--model", l.program_model] }[l.target];
    }
    const U = (l) => [l.field, l.operator, w(l) ? l.value : ""].filter(Boolean).join(" ");
    async function L(l) {
      const f = await e.run([...l, "--revision", a.value.revision, "--environment", e.environment]);
      return v.value = f.ok ? "" : f.error, await e.reload("assign"), f.ok;
    }
    function K(l, f) {
      var j;
      l.field = f, l.operator = ((j = x(f)[0]) == null ? void 0 : j.operator) ?? "", l.value = "";
    }
    async function $() {
      const l = ["assign-rule", "make", ...M(C.value), ...o.value.flatMap((f) => ["--condition", U(f)])];
      await L(l) && (o.value = [T()]);
    }
    const p = (l, f) => L(["assign-rule", "move", String(l.id), "--to", String(l.position + f)]), g = (l) => L(["assign-rule", l.enabled ? "disable" : "enable", String(l.id)]), q = (l) => L(["assign-rule", "delete", String(l.id)]), V = N(""), m = N(null), O = N(""), R = () => o.value.map((l) => `--condition ${JSON.stringify(U(l))}`).join(" ");
    async function W() {
      const l = await e.read(`assign-rule try ${Number(V.value)} ${R()} --environment ${e.environment}`);
      v.value = l.ok ? "" : l.error, m.value = l.ok ? l.value : null;
    }
    async function G() {
      const l = await e.read(`assign-rule recent ${R()} --environment ${e.environment}`);
      v.value = l.ok ? "" : l.error, O.value = l.ok ? l.value.text : "";
    }
    return (l, f) => {
      var j;
      return s(), d("section", Yt, [
        a.value ? (s(), d(F, { key: 0 }, [
          u("div", Xt, [
            (s(!0), d(F, null, D(a.value.targets, (n) => {
              var h, A;
              return s(), d("button", {
                key: n.key,
                type: "button",
                class: J(["target", { chosen: n.key === ((h = C.value) == null ? void 0 : h.key) }]),
                "aria-selected": n.key === ((A = C.value) == null ? void 0 : A.key),
                "data-assign-target": n.key,
                onClick: (Dn) => c.value = n.key
              }, [
                u("span", Zt, k(n.label), 1),
                u("span", Qt, k(n.description), 1),
                n.target === "agent" ? (s(), d("span", en, "State: " + k(n.running ? "running" : "kept") + " · Open tasks: " + k(n.open_tasks), 1)) : _("", !0),
                n.waiting ? (s(), d("span", tn, k(n.waiting), 1)) : _("", !0)
              ], 10, Jt);
            }), 128))
          ]),
          u("div", nn, [
            f[6] || (f[6] = u("p", { class: "note" }, "The rules are tried in order and the first match wins.", -1)),
            (s(!0), d(F, null, D(E.value, (n) => (s(), d("div", {
              key: n.id,
              class: J(["rule", { off: !n.enabled, warned: n.warning }]),
              "data-assign-rule": n.id
            }, [
              u("span", sn, k(n.position), 1),
              u("span", on, k(n.summary), 1),
              n.warning ? (s(), d("span", ln, k(n.warning), 1)) : _("", !0),
              S(Vt, {
                activity: n.activity
              }, null, 8, ["activity"]),
              t.readOnly ? _("", !0) : (s(), d(F, { key: 1 }, [
                u("span", rn, [
                  u("button", {
                    type: "button",
                    title: "Move the rule up",
                    disabled: n.position === 1,
                    onClick: (h) => p(n, -1)
                  }, "↑", 8, un),
                  u("button", {
                    type: "button",
                    title: "Move the rule down",
                    disabled: n.position === a.value.rules.length,
                    onClick: (h) => p(n, 1)
                  }, "↓", 8, dn),
                  u("button", {
                    type: "button",
                    title: n.enabled ? "Turn the rule off" : "Turn the rule on",
                    onClick: (h) => g(n)
                  }, k(n.enabled ? "Turn off" : "Turn on"), 9, cn),
                  u("button", {
                    type: "button",
                    title: "Delete the rule",
                    onClick: (h) => q(n)
                  }, "Delete", 8, vn)
                ]),
                S(zt, {
                  rule: n,
                  revision: a.value.revision,
                  onChanged: f[0] || (f[0] = (h) => i(e).reload("assign")),
                  onFailed: f[1] || (f[1] = (h) => v.value = h)
                }, null, 8, ["rule", "revision"])
              ], 64))
            ], 10, an))), 128)),
            E.value.length ? _("", !0) : (s(), d("p", pn, "No rules give tasks to " + k((j = C.value) == null ? void 0 : j.label) + " yet.", 1)),
            t.readOnly ? _("", !0) : (s(), d("form", {
              key: 1,
              class: "editor",
              "data-assign-editor": "",
              onSubmit: be($, ["prevent"])
            }, [
              f[4] || (f[4] = u("p", { class: "all" }, "A task must meet all of these conditions:", -1)),
              (s(!0), d(F, null, D(o.value, (n, h) => (s(), d("div", {
                key: n.id,
                class: "condition"
              }, [
                u("select", {
                  value: n.field,
                  "aria-label": "Condition",
                  onChange: (A) => K(n, A.target.value)
                }, [
                  (s(!0), d(F, null, D(a.value.fields, (A) => (s(), d("option", {
                    key: A.field,
                    value: A.field
                  }, k(A.field === "any" ? "Any task" : A.field), 9, gn))), 128))
                ], 40, fn),
                ae(u("select", {
                  "onUpdate:modelValue": (A) => n.operator = A,
                  "aria-label": "Comparison"
                }, [
                  (s(!0), d(F, null, D(x(n.field), (A) => (s(), d("option", {
                    key: A.operator,
                    value: A.operator
                  }, k(A.label), 9, yn))), 128))
                ], 8, mn), [
                  [Te, n.operator]
                ]),
                w(n) ? ae((s(), d("input", {
                  key: 0,
                  "onUpdate:modelValue": (A) => n.value = A,
                  "aria-label": "Value",
                  placeholder: "For example: 4 or migration"
                }, null, 8, kn)), [
                  [ce, n.value]
                ]) : _("", !0),
                u("button", {
                  type: "button",
                  title: "Remove the condition",
                  disabled: o.value.length === 1,
                  onClick: (A) => o.value.splice(h, 1)
                }, "Remove", 8, hn)
              ]))), 128)),
              u("button", {
                type: "button",
                onClick: f[2] || (f[2] = (n) => o.value.push(T()))
              }, "Add a condition"),
              I.value ? (s(), d("p", bn, "The main agent writes no code here, so a rule that gives it a task is skipped.")) : _("", !0),
              u("div", wn, [
                ae(u("input", {
                  "onUpdate:modelValue": f[3] || (f[3] = (n) => V.value = n),
                  type: "number",
                  min: "1",
                  "aria-label": "Task number for the trial",
                  placeholder: "Task number",
                  "data-assign-trial-task": ""
                }, null, 512), [
                  [ce, V.value]
                ]),
                u("button", {
                  type: "button",
                  disabled: !V.value,
                  "data-assign-try": "",
                  onClick: W
                }, "Try on this task", 8, _n),
                u("button", {
                  type: "button",
                  "data-assign-count": "",
                  onClick: G
                }, "Count the last 20 tasks")
              ]),
              O.value ? (s(), d("p", $n, k(O.value), 1)) : _("", !0),
              m.value ? (s(), d("div", On, [
                u("p", Sn, k(m.value.matches ? "The rule would match" : "The rule would not match") + " task " + k(m.value.task_id) + ". Nothing is assigned.", 1),
                (s(!0), d(F, null, D(m.value.conditions, (n) => (s(), d("p", {
                  key: n.label,
                  class: J(["said", { missed: !n.matched }])
                }, k(n.label) + ": " + k(n.matched ? "met" : "not met"), 3))), 128))
              ])) : _("", !0),
              f[5] || (f[5] = u("button", {
                type: "submit",
                class: "save"
              }, "Add the rule", -1))
            ], 32)),
            v.value ? (s(), d("p", Cn, k(v.value), 1)) : _("", !0)
          ])
        ], 64)) : _("", !0)
      ]);
    };
  }
}, xn = /* @__PURE__ */ H(Tn, [["__scopeId", "data-v-7f403ea3"]]), Rn = { class: "screen" }, Nn = { class: "rail" }, En = {
  __name: "AgentSettingsScreen",
  props: { nodes: { type: Array, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 }, extras: { type: Object, default: () => ({}) }, found: { type: String, default: "" } },
  setup(t) {
    const r = t, e = N(null), a = y(() => Ge(r.nodes));
    ue(() => r.found, (v) => v && xe(() => {
      var b, T;
      return (T = (b = e.value) == null ? void 0 : b.querySelector(`[data-setting="${v}"]`)) == null ? void 0 : T.scrollIntoView({ block: "center" });
    }), { immediate: !0, flush: "post" });
    const c = (v) => {
      var b, T;
      return (T = (b = e.value) == null ? void 0 : b.querySelector(`[data-section="${v}"]`)) == null ? void 0 : T.scrollIntoView({ block: "start", behavior: "smooth" });
    };
    return (v, b) => (s(), d("div", Rn, [
      u("nav", Nn, [
        S(i(ze), {
          sections: a.value,
          scope: e.value,
          onChoose: c
        }, null, 8, ["sections", "scope"])
      ]),
      u("div", {
        ref_key: "scroll",
        ref: e,
        class: "content"
      }, [
        Re(v.$slots, "before", {}, void 0, !0),
        S(i(_e), {
          nodes: t.nodes,
          draft: t.draft,
          "read-only": t.readOnly,
          extras: t.extras,
          found: t.found
        }, null, 8, ["nodes", "draft", "read-only", "extras", "found"])
      ], 512)
    ]));
  }
}, re = /* @__PURE__ */ H(En, [["__scopeId", "data-v-1cab27ca"]]), In = {
  key: 0,
  class: "hint",
  "data-work-hint": ""
}, jn = {
  __name: "AgentSettingsTab",
  props: { tab: { type: String, required: !0 }, active: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, isLoaded: Boolean, nodes: { type: Function, required: !0 }, readOnly: Boolean, found: { type: String, default: "" }, nothingStarts: Boolean, advancedExtras: { type: Object, required: !0 } },
  setup(t) {
    return (r, e) => (s(), d("div", {
      class: J(["settings-body", { flush: t.tab === "agents" }])
    }, [
      S(i(Le), { tab: t.active }, {
        default: B(() => [
          S(i(we), { value: t.tab }, {
            work: B(() => [
              t.isLoaded ? (s(), P(re, {
                key: "work",
                nodes: t.nodes("work"),
                draft: t.draft,
                "read-only": t.readOnly,
                found: t.found,
                "data-agent-settings-work": ""
              }, {
                before: B(() => [
                  t.nothingStarts ? (s(), d("p", In, "With Auto off and no workers, nothing starts the work: a user starts tasks or turns one of them on.")) : _("", !0)
                ]),
                _: 1
              }, 8, ["nodes", "draft", "read-only", "found"])) : _("", !0)
            ]),
            agents: B(() => [
              S(Lt, { draft: t.draft }, null, 8, ["draft"])
            ]),
            assign: B(() => [
              S(xn, {
                draft: t.draft,
                "read-only": t.readOnly
              }, null, 8, ["draft", "read-only"])
            ]),
            tests: B(() => [
              t.isLoaded ? (s(), P(re, {
                key: "tests",
                nodes: t.nodes("tests"),
                draft: t.draft,
                "read-only": t.readOnly,
                found: t.found,
                "data-agent-settings-tests": ""
              }, null, 8, ["nodes", "draft", "read-only", "found"])) : _("", !0)
            ]),
            advanced: B(() => [
              t.isLoaded ? (s(), P(re, {
                key: "advanced",
                nodes: t.nodes("advanced"),
                draft: t.draft,
                "read-only": t.readOnly,
                found: t.found,
                extras: t.advancedExtras,
                "data-agent-settings-advanced": ""
              }, null, 8, ["nodes", "draft", "read-only", "found", "extras"])) : _("", !0)
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        _: 1
      }, 8, ["tab"])
    ], 2));
  }
}, Bn = {
  class: "settings",
  "data-agent-settings": ""
}, Pn = { class: "head" }, Ln = {
  class: "env",
  "data-settings-environment": ""
}, qn = { class: "settings-bar" }, Fn = {
  key: 1,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, Mn = "journal.suites.coding.auto-mode", Vn = "journal.suites.coding.workers.main-dispatches-workers", Un = 1200, Wn = {
  __name: "AgentSettings",
  setup(t) {
    const r = { work: "work-screen", tests: "tests-screen", advanced: "advanced-screen", "helper-types": "helper-types-screen" }, e = X(), a = N("work"), c = [{ key: "work", label: "Work" }, { key: "agents", label: "Helpers", count_field: "full" }, { key: "assign", label: "Assign" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }], v = y(() => c.find((n) => n.key === a.value)), b = () => Object.values(r).map((n) => e.props[n].data.value), T = y(() => b().every(Boolean)), o = Ye({
      run: (n) => e.run(n),
      reload: async () => {
        const n = "type-screen.type" in e.state;
        await Promise.all([...Object.values(r).map((h) => e.reload(h)), e.reload("limits"), ...n ? [e.reload("type-screen")] : []]), o.load([...b(), ...n ? [e.props["type-screen"].data.value] : []]);
      }
    });
    ue(b, (n) => {
      n.every(Boolean) && o.load(n);
    }, { immediate: !0 });
    const { rows: C } = Ae(e, o), E = y(() => At(C.value)), x = y(() => E.value ? { full: `${E.value} full` } : {});
    ee(() => e.reload("limits"));
    const w = [{ key: "main", name: "Main agent" }, { key: "worker", name: "Workers" }, { key: "helper", name: "Read-only helpers" }], I = (n) => {
      var h;
      return ((h = C.value.find((A) => A.profile === n)) == null ? void 0 : h.name) ?? n;
    }, M = y(() => (o.value(Q) ?? []).map(Se).map(({ name: n, value: h }) => ({ name: I(n), value: h === "none" ? "no cap" : `${Number(h) / 1e3}k` }))), U = y(() => ({ "keyed-cap-table": { rows: w, sizes: ie, defaultCap: Number(o.value(de)) || ie[0], ownCaps: M.value } })), L = (n) => {
      var h;
      return ((h = e.props[r[n]].data.value) == null ? void 0 : h.nodes) ?? [];
    }, K = y(() => o.value(Mn) === !1 && o.value(Vn) === !1), $ = y(() => !e.readOnly), p = N("main"), g = y(() => {
      var n;
      return ((n = e.props.work.data.value) == null ? void 0 : n.presets) ?? [];
    }), q = y(() => {
      var n;
      return ((n = e.props.work.data.value) == null ? void 0 : n.switches) ?? [];
    }), V = y(() => Object.fromEntries(q.value.map((n) => [n.key, o.value(n.key)]))), m = y(() => Xe(V.value, g.value)), O = (n) => o.fill(g.value.find((h) => h.key === n).values), R = y(() => {
      var n;
      return ((n = e.props.find.data.value) == null ? void 0 : n.rows) ?? [];
    }), W = N("");
    let G = null;
    const l = (n) => n.startsWith("helper-type") ? "agents" : n;
    function f(n) {
      p.value = "main", j({ key: l(n.screen) }), W.value = n.key, clearTimeout(G), G = setTimeout(() => {
        W.value = "";
      }, Un);
    }
    Ne(() => clearTimeout(G));
    function j(n) {
      a.value = n.key, e.state.tab = n.key === "agents" ? "agents" : "";
    }
    return (n, h) => (s(), P(i(qe), { padding: "0" }, {
      default: B(() => [
        u("div", Bn, [
          S(i(we), { value: p.value }, {
            main: B(() => [
              u("div", Pn, [
                u("span", Ln, k(i(e).environment), 1)
              ]),
              g.value.length ? (s(), P(i(Je), {
                key: 0,
                presets: g.value,
                current: m.value,
                disabled: i(e).readOnly,
                onPick: O,
                onOpenPage: h[0] || (h[0] = (A) => p.value = "presets")
              }, {
                default: B(() => [
                  S(i(Ze), {
                    index: R.value,
                    onPick: f
                  }, null, 8, ["index"])
                ]),
                _: 1
              }, 8, ["presets", "current", "disabled"])) : _("", !0),
              u("div", qn, [
                S(i(Fe), {
                  tabs: c,
                  active: v.value,
                  answer: x.value,
                  onChoose: j
                }, null, 8, ["active", "answer"])
              ]),
              i(e).readOnly ? (s(), d("p", Fn, "Only a user can change these settings. You can read every value, and ask a user for a change.")) : _("", !0),
              S(jn, {
                tab: a.value,
                active: v.value,
                draft: i(o),
                "is-loaded": T.value,
                nodes: L,
                "read-only": i(e).readOnly,
                found: W.value,
                "nothing-starts": K.value,
                "advanced-extras": U.value
              }, null, 8, ["tab", "active", "draft", "is-loaded", "read-only", "found", "nothing-starts", "advanced-extras"])
            ]),
            presets: B(() => [
              S(lt, {
                presets: g.value,
                switches: q.value,
                now: V.value,
                "read-only": i(e).readOnly,
                onBack: h[1] || (h[1] = (A) => p.value = "main"),
                onFill: O
              }, null, 8, ["presets", "switches", "now", "read-only"])
            ]),
            _: 1
          }, 8, ["value"]),
          $.value ? (s(), P(i(Qe), {
            key: 0,
            changes: i(o).changes(),
            "can-save": i(o).canSave.value,
            pending: i(o).pending.value,
            reason: i(o).reason.value,
            environment: i(e).environment,
            onSave: h[2] || (h[2] = (A) => i(o).apply()),
            onCancel: h[3] || (h[3] = (A) => i(o).reset())
          }, null, 8, ["changes", "can-save", "pending", "reason", "environment"])) : _("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, Yn = /* @__PURE__ */ H(Wn, [["__scopeId", "data-v-f88ce405"]]);
export {
  Yn as A
};
