import { openBlock as o, createElementBlock as u, createElementVNode as d, Fragment as M, renderList as H, createBlock as N, unref as i, createVNode as S, withModifiers as be, withCtx as E, createTextVNode as Y, ref as x, computed as g, onMounted as Q, toDisplayString as h, createCommentVNode as b, normalizeClass as X, watch as de, withDirectives as ae, vModelSelect as Te, vModelText as ce, nextTick as xe, renderSlot as Re, onBeforeUnmount as Ee } from "vue";
import { TextInput as Ne, Btn as J, useWindow as ee, useNow as Ie, agentTitle as Be, age as Pe, agentNumber as je, TabBody as Le, SwitchCase as we, WindowRoom as Fe, InnerTabs as qe } from "@journal/window-kit";
import { SettingPresetCard as ve, SettingPresetCompareTable as Ve, SettingEmptyState as Me, isFull as pe, SettingBackPath as Ue, SettingPerTypeOverrideRow as fe, SettingsScreen as _e, SettingRow as me, SettingEntryList as We, SettingThreeWayCap as De, SettingBanner as He, SettingHelperTypeTable as Ke, sectionsOf as ze, SettingSectionList as Ge, useSettingsDraft as Ye, currentPreset as Xe, SettingPresetBand as Je, FindBox as Ze, ChangeFoot as Qe } from "@journal/setting-components";
import { _ as D } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const et = {
  class: "page",
  "data-agent-settings-presets": ""
}, tt = { class: "crumb" }, nt = { class: "body" }, at = { class: "cards" }, st = "Any other mix of the eight switches. The form shows Custom as soon as the switches match neither preset.", ot = {
  __name: "AgentSettingsPresets",
  props: { presets: { type: Array, required: !0 }, switches: { type: Array, required: !0 }, now: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back", "fill"],
  setup(e, { emit: r }) {
    const t = r;
    return (s, v) => (o(), u("section", et, [
      d("div", tt, [
        d("button", {
          type: "button",
          class: "back",
          "data-presets-back": "",
          onClick: v[0] || (v[0] = (y) => t("back"))
        }, "‹ Back"),
        v[1] || (v[1] = d("b", null, "What is a preset?", -1))
      ]),
      d("div", nt, [
        v[2] || (v[2] = d("p", { class: "lead" }, "A preset is a set of eight switches and nothing more. It is not a type of agent: the main agent is the same program under every preset, and a preset only fills in the switches below. Nothing is saved until you press Save.", -1)),
        d("div", at, [
          (o(!0), u(M, null, H(e.presets, (y) => (o(), N(i(ve), {
            key: y.key,
            name: y.name,
            line: y.line,
            "can-fill": !e.readOnly,
            onFill: (w) => t("fill", y.key)
          }, null, 8, ["name", "line", "can-fill", "onFill"]))), 128)),
          S(i(ve), {
            name: "Custom",
            line: st
          })
        ]),
        S(i(Ve), {
          rows: e.switches,
          presets: e.presets,
          now: e.now
        }, null, 8, ["rows", "presets", "now"])
      ])
    ]));
  }
}, lt = /* @__PURE__ */ D(ot, [["__scopeId", "data-v-cf40939d"]]), rt = { class: "action-buttons" }, it = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (r, t) => (o(), u("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = be((s) => r.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = d("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      S(i(Ne), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (s) => r.$emit("update:reason", s))
      }, null, 8, ["model-value", "disabled"]),
      d("div", rt, [
        S(i(J), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: E(() => [...t[3] || (t[3] = [
            Y("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        S(i(J), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (s) => r.$emit("cancel"))
        }, {
          default: E(() => [...t[4] || (t[4] = [
            Y("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, dt = /* @__PURE__ */ D(it, [["__scopeId", "data-v-92de7dd6"]]), ut = {
  class: "type-agents",
  "data-type-agents": ""
}, ct = { class: "models" }, vt = ["data-count-agent"], pt = { class: "person-text" }, ft = {
  key: 2,
  role: "alert",
  class: "bad"
}, mt = {
  key: 3,
  role: "status"
}, gt = {
  __name: "AgentTypeAgents",
  props: { role: { type: String, required: !0 }, profile: { type: String, default: "" } },
  emits: ["open-agent", "retired"],
  setup(e, { emit: r }) {
    const t = e, s = r, v = ee(), y = Ie(), w = x([]), T = x(0), a = x(!1), C = x(!1), L = x(""), P = x(""), j = x(null), F = x(""), q = g(() => w.value.filter((_) => {
      var c;
      return _.state !== "retired" && _.role === t.role && (!t.profile || (((c = _.facts) == null ? void 0 : c.profile) || _.profile) === t.profile);
    }).sort((_, c) => (_.state !== "running") - (c.state !== "running") || String(_.ended_at || _.created_at).localeCompare(String(c.ended_at || c.created_at)))), U = g(() => {
      var c;
      const _ = /* @__PURE__ */ new Map();
      for (const p of q.value) {
        const B = ((c = p.facts) == null ? void 0 : c.model) || p.program_model;
        B && _.set(B, (_.get(B) || 0) + 1);
      }
      return [..._].map(([p, B]) => `${B} ${p}`).join(", ");
    });
    async function I(_ = 1) {
      v.state["count-agents.role"] = t.role, t.profile ? v.state["count-agents.profile"] = t.profile : delete v.state["count-agents.profile"], v.state["count-agents.page"] = String(_), await v.reload("count-agents");
      const c = v.props["count-agents"];
      w.value = _ === 1 ? [...c.rows.value] : [...w.value, ...c.rows.value], T.value = _, a.value = c.more.value;
    }
    async function K(_) {
      if (!F.value.trim() || C.value) return;
      C.value = !0;
      const c = await v.run(["agent", "retire", String(_.number), "--reason", F.value.trim()]);
      L.value = c.ok ? "" : "The agent could not be retired. Try again.", c.ok && (j.value = null, F.value = "", P.value = "Agent retired permanently.", s("retired"), await I()), C.value = !1;
    }
    return Q(() => I()), (_, c) => (o(), u("section", ut, [
      d("p", ct, h(U.value), 1),
      q.value.length ? b("", !0) : (o(), N(i(Me), {
        key: 0,
        title: "No agents here yet",
        line: "An agent shows here as soon as one of this type starts."
      })),
      (o(!0), u(M, null, H(q.value, (p) => {
        var B, V, f, $;
        return o(), u("div", {
          key: p.id,
          class: "person",
          "data-count-agent": p.id
        }, [
          d("span", {
            class: X(["dot", { running: p.state === "running" }])
          }, null, 2),
          d("div", pt, [
            d("strong", null, h(i(Be)(p).text), 1),
            Y(" " + h(p.state === "running" ? "Running" : "Idle") + ", " + h(i(Pe)(p.state === "running" ? p.process_started_at || p.created_at : p.ended_at, i(y))) + " ", 1),
            d("small", null, h([p.program, (B = p.facts) == null ? void 0 : B.model, (V = p.facts) == null ? void 0 : V.effort, i(je)(p)].filter(Boolean).join(", ")), 1),
            d("small", null, h(((f = p.facts) == null ? void 0 : f.task_title) || (($ = p.facts) == null ? void 0 : $.helper_job)), 1)
          ]),
          S(i(J), {
            small: "",
            onClick: (A) => s("open-agent", p)
          }, {
            default: E(() => [...c[3] || (c[3] = [
              Y("Open", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]),
          p.state === "idle" && !i(v).readOnly ? (o(), N(i(J), {
            key: 0,
            small: "",
            onClick: (A) => {
              j.value = p.id, F.value = "";
            }
          }, {
            default: E(() => [...c[4] || (c[4] = [
              Y("Retire", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])) : b("", !0),
          j.value === p.id ? (o(), N(dt, {
            key: 1,
            reason: F.value,
            "onUpdate:reason": c[0] || (c[0] = (A) => F.value = A),
            pending: C.value,
            onSubmit: (A) => K(p),
            onCancel: c[1] || (c[1] = (A) => j.value = null)
          }, null, 8, ["reason", "pending", "onSubmit"])) : b("", !0)
        ], 8, vt);
      }), 128)),
      a.value ? (o(), N(i(J), {
        key: 1,
        small: "",
        onClick: c[2] || (c[2] = (p) => I(T.value + 1))
      }, {
        default: E(() => [...c[5] || (c[5] = [
          Y("Show more", -1)
        ])]),
        _: 1
      })) : b("", !0),
      L.value ? (o(), u("p", ft, h(L.value), 1)) : P.value ? (o(), u("p", mt, h(P.value), 1)) : b("", !0)
    ]));
  }
}, yt = /* @__PURE__ */ D(gt, [["__scopeId", "data-v-67f17bfa"]]), G = "journal.core.helpers", kt = `${G}.context-limit-on`, ue = `${G}.context-limit-tokens`, $e = `${G}.context-limit-kinds`, Z = `${G}.context-limit-profiles`, se = `${G}.read-only-helper-profile-limits`, ht = `${G}.read-only-helper-run-limit`, bt = `${G}.read-only-helper-kept-limit`, oe = "journal.suites.coding.workers.merge-hooks", wt = "none", Oe = (e) => `${e / 1e3}k`, Se = (e) => {
  const r = e.lastIndexOf(":");
  return { name: e.slice(0, r).trim(), value: e.slice(r + 1).trim() };
}, Ce = (e) => {
  const r = e.indexOf(":");
  return r < 0 ? { text: e, name: "", command: "" } : { text: e, name: e.slice(0, r).trim(), command: e.slice(r + 1).trim() };
}, _t = (e, r) => (e ?? []).map(Ce).filter((t) => t.name === r).map((t) => t.command), $t = (e, r, t) => [
  ...(e ?? []).map(Ce).filter((s) => s.name !== r).map((s) => s.text),
  ...t.map((s) => `${r}: ${s}`)
], ne = (e, r) => {
  var t;
  return (t = (e ?? []).map(Se).find((s) => s.name === r)) == null ? void 0 : t.value;
}, ge = (e) => e === wt ? "No cap" : Oe(Number(e));
function ye(e, r, t) {
  if (e(kt) !== !0) return { text: "Off", where: "Context limit is off", own: !1 };
  const s = t ? ne(e(Z), t) : void 0;
  if (s !== void 0) return { text: ge(s), where: "Own value", own: !0 };
  const v = ne(e($e), r);
  return v !== void 0 ? { text: ge(v), where: "Set for its type", own: !1 } : { text: Oe(Number(e(ue))), where: "Set for every agent", own: !1 };
}
const Ot = (e) => e > 0 ? e : null, St = { worker: "workers" }, te = "merger", ke = "designer";
function he(e, r, t, s, v, y = {}) {
  return { key: e, name: r, line: t, running: s.running, runLimit: s.run_limit, kept: s.kept, keptLimit: Ot(s.kept_limit), cap: v, ...y };
}
function Ct(e, r) {
  const t = e.filter((a) => !a.per_profile).map((a) => he(a.key, a.label, a.line, a, ye(r, a.key, ""), { screen: St[a.key] ?? "read-only", role: a.key, profile: "", defaultProfile: a.default_profile })), s = e.find((a) => a.per_profile);
  if (!s) return t;
  const v = (a) => he(`${s.key}:${a.profile}`, a.title, a.line, a, ye(r, s.key, a.profile), { screen: a.group === te ? te : "read-only", role: s.key, profile: a.profile }), y = s.profiles.filter((a) => a.group === te || a.group === ke).map(v), w = s.profiles.filter((a) => a.group !== te && a.group !== ke).map((a) => ({ ...v(a), indent: !0 })), T = { key: s.key, name: "Read-only helpers", group: !0, screen: "read-only", role: s.key, profile: "", line: `${s.running} running, ${s.kept} kept. Every profile runs up to ${s.run_limit} and keeps ${s.kept_limit ? `up to ${s.kept_limit}` : "any number"} unless it has limits of its own.` };
  return [...t, ...y, T, ...w];
}
const ie = Array.from({ length: 10 }, (e, r) => (r + 1) * 1e5), At = (e) => e.filter((r) => !r.group && (pe(r.running, r.runLimit) || pe(r.kept, r.keptLimit ?? 0))).length;
function Ae(e, r) {
  const t = g(() => e.props.limits.rows.value ?? []), s = g(() => Ct(t.value, r.value)), v = g(() => !!e.props.limits.failure.value);
  return { rows: s, unreadable: v, reread: () => e.reload("limits") };
}
const Tt = {
  class: "type",
  "data-agent-type-screen": ""
}, xt = { class: "typebody" }, Rt = {
  class: "typemain",
  "data-type-settings": ""
}, Et = { class: "typeside" }, le = "none", Nt = "worker", It = {
  __name: "AgentSettingsTypeScreen",
  props: { row: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back"],
  setup(e, { emit: r }) {
    const t = e, s = r, v = ee(), y = g(() => v.props["type-screen"].data.value), w = g(() => {
      var f;
      return ((f = y.value) == null ? void 0 : f.nodes) ?? [];
    }), T = g(() => t.row.profile !== "");
    async function a() {
      v.state["type-screen.type"] = t.row.screen, await v.reload("type-screen");
    }
    de(y, (f) => {
      f && t.draft.load([f]);
    }), Q(a);
    const C = g(() => (t.draft.value(se) ?? []).map((f) => f.split(":"))), L = g(() => C.value.find((f) => f[0] === t.row.profile)), P = g(() => ({ running: Number(t.draft.value(ht)), kept: Number(t.draft.value(bt)) })), j = (f) => L.value ? Number(L.value[f === "running" ? 1 : 2]) : null;
    function F(f, $) {
      const A = C.value.filter((l) => l[0] !== t.row.profile).map((l) => l.join(":"));
      if ($ === null) return t.draft.set(se, A);
      if ($ === "") return;
      const W = f === "running" ? $ : j("running") ?? P.value.running, z = f === "kept" ? $ : j("kept") ?? P.value.kept;
      t.draft.set(se, [...A, `${t.row.profile}:${W}:${z}`]);
    }
    const q = g(() => t.row.group ? "" : t.row.profile || t.row.defaultProfile || ""), U = g(() => ne(t.draft.value(Z), q.value)), I = g(() => U.value === void 0 ? "kind" : U.value === le ? "none" : "own"), K = g(() => {
      const f = ne(t.draft.value($e), t.row.role);
      return f === le ? null : Number(f ?? t.draft.value(ue));
    });
    function _({ mode: f, size: $ }) {
      const A = (t.draft.value(Z) ?? []).filter((W) => W.slice(0, W.lastIndexOf(":")).trim() !== q.value);
      t.draft.set(Z, f === "kind" ? A : [...A, `${q.value}:${f === "none" ? le : $}`]);
    }
    const c = g(() => t.row.role === Nt ? q.value : ""), p = g(() => _t(t.draft.value(oe), c.value)), B = (f) => t.draft.set(oe, $t(t.draft.value(oe), c.value, f)), V = (f) => v.open("agents.agents", f.id);
    return (f, $) => (o(), u("div", Tt, [
      S(i(Ue), {
        parent: "Helpers",
        current: e.row.name,
        onBack: $[0] || ($[0] = (A) => s("back"))
      }, null, 8, ["current"]),
      d("div", xt, [
        d("div", Rt, [
          T.value && e.row.screen === "read-only" ? (o(), u(M, { key: 0 }, [
            S(i(fe), {
              label: "Running",
              help: "Agents of this profile that run at once.",
              "every-value": P.value.running,
              "own-value": j("running"),
              disabled: e.readOnly,
              "data-override-running": "",
              "onUpdate:ownValue": $[1] || ($[1] = (A) => F("running", A))
            }, null, 8, ["every-value", "own-value", "disabled"]),
            S(i(fe), {
              label: "Kept",
              help: "Agents of this profile kept until retired, running or idle. At 0 there is no limit.",
              "every-value": P.value.kept,
              "own-value": j("kept"),
              disabled: e.readOnly,
              "data-override-kept": "",
              "onUpdate:ownValue": $[2] || ($[2] = (A) => F("kept", A))
            }, null, 8, ["every-value", "own-value", "disabled"])
          ], 64)) : (o(), N(i(_e), {
            key: 1,
            nodes: w.value,
            draft: e.draft,
            "read-only": e.readOnly
          }, null, 8, ["nodes", "draft", "read-only"])),
          c.value ? (o(), N(i(me), {
            key: 2,
            label: "When merged",
            help: "Commands run in the main checkout after a worker of this profile is merged. One that fails is told to the main agent; the merge stands.",
            source: p.value.length ? "own" : "default",
            "data-merge-hooks": ""
          }, {
            default: E(() => [
              S(i(We), {
                "model-value": p.value,
                placeholder: "a command",
                disabled: e.readOnly,
                "onUpdate:modelValue": B
              }, null, 8, ["model-value", "disabled"])
            ]),
            _: 1
          }, 8, ["source"])) : b("", !0),
          q.value ? (o(), N(i(me), {
            key: 3,
            label: "Context cap",
            help: "The context size at which this type is compacted.",
            source: I.value === "own" || I.value === "none" ? "own" : "default",
            "data-context-cap": ""
          }, {
            default: E(() => [
              S(i(De), {
                mode: I.value,
                "kind-value": K.value,
                "own-value": I.value === "own" ? Number(U.value) : null,
                sizes: i(ie),
                disabled: e.readOnly,
                onChange: _
              }, null, 8, ["mode", "kind-value", "own-value", "sizes", "disabled"])
            ]),
            _: 1
          }, 8, ["source"])) : b("", !0)
        ]),
        d("aside", Et, [
          $[3] || ($[3] = d("h3", null, "Agents", -1)),
          S(yt, {
            role: e.row.role,
            profile: e.row.profile,
            onOpenAgent: V
          }, null, 8, ["role", "profile"])
        ])
      ])
    ]));
  }
}, Bt = /* @__PURE__ */ D(It, [["__scopeId", "data-v-3bc929c1"]]), Pt = {
  class: "agents",
  "data-agent-settings-agents": ""
}, jt = {
  __name: "AgentSettingsAgents",
  props: { draft: { type: Object, required: !0 } },
  setup(e) {
    const r = e, t = ee(), { rows: s, unreadable: v, reread: y } = Ae(t, r.draft), w = x(null);
    Q(y);
    const T = (a) => {
      w.value = s.value.find((C) => C.key === a);
    };
    return (a, C) => (o(), u("section", Pt, [
      w.value ? (o(), N(Bt, {
        key: 0,
        row: w.value,
        draft: e.draft,
        "read-only": i(t).readOnly,
        onBack: C[0] || (C[0] = (L) => w.value = null)
      }, null, 8, ["row", "draft", "read-only"])) : i(v) ? (o(), N(i(He), {
        key: 1,
        kind: "unreadable",
        text: "The counts could not be read.",
        onRetry: i(y)
      }, null, 8, ["onRetry"])) : (o(), N(i(Ke), {
        key: 2,
        rows: i(s),
        onOpen: T
      }, null, 8, ["rows"]))
    ]));
  }
}, Lt = /* @__PURE__ */ D(jt, [["__scopeId", "data-v-05cc036a"]]), Ft = {
  class: "activity",
  "data-assign-activity": ""
}, qt = {
  key: 0,
  class: "activity",
  "data-assign-last-skip": ""
}, Vt = {
  __name: "AssignRuleActivity",
  props: { activity: { type: Object, required: !0 } },
  setup(e) {
    return (r, t) => (o(), u(M, null, [
      d("span", Ft, h(e.activity.text), 1),
      e.activity.last_skip ? (o(), u("span", qt, "Last skipped: " + h(e.activity.last_skip), 1)) : b("", !0)
    ], 64));
  }
}, Mt = /* @__PURE__ */ D(Vt, [["__scopeId", "data-v-51520c3a"]]), Ut = {
  class: "assign",
  "data-agent-settings-assign": ""
}, Wt = {
  class: "targets",
  role: "listbox",
  "aria-label": "Give tasks to"
}, Dt = ["aria-selected", "data-assign-target", "onClick"], Ht = { class: "name" }, Kt = { class: "facts" }, zt = {
  key: 0,
  class: "facts"
}, Gt = {
  key: 1,
  class: "facts",
  "data-assign-waiting": ""
}, Yt = { class: "rules" }, Xt = ["data-assign-rule"], Jt = { class: "place" }, Zt = { class: "summary" }, Qt = {
  key: 0,
  class: "warning",
  "data-assign-warning": ""
}, en = {
  key: 1,
  class: "actions"
}, tn = ["disabled", "onClick"], nn = ["disabled", "onClick"], an = ["title", "onClick"], sn = ["onClick"], on = {
  key: 0,
  class: "empty"
}, ln = ["value", "onChange"], rn = ["value"], dn = ["onUpdate:modelValue"], un = ["value"], cn = ["onUpdate:modelValue"], vn = ["disabled", "onClick"], pn = {
  key: 0,
  class: "warning",
  "data-assign-main-warning": ""
}, fn = { class: "trial" }, mn = ["disabled"], gn = {
  key: 1,
  class: "verdict",
  "data-assign-recent": ""
}, yn = {
  key: 2,
  class: "trial-result",
  "data-assign-trial": ""
}, kn = { class: "verdict" }, hn = {
  key: 2,
  class: "failure",
  role: "alert",
  "data-assign-failure": ""
}, bn = "journal.suites.coding.main-writes-code", wn = {
  __name: "AgentSettingsAssign",
  props: { draft: { type: Object, required: !0 }, readOnly: Boolean },
  setup(e) {
    const r = e, t = ee(), s = g(() => t.props.assign.data.value), v = x("main"), y = x("");
    let w = 0;
    const T = () => ({ id: ++w, field: "complexity", operator: "minimum", value: "" }), a = x([T()]);
    Q(() => t.reload("assign"));
    const C = g(() => {
      var l, m;
      return ((l = s.value) == null ? void 0 : l.targets.find((R) => R.key === v.value)) ?? ((m = s.value) == null ? void 0 : m.targets[0]);
    }), L = g(() => {
      var l;
      return (((l = s.value) == null ? void 0 : l.rules) ?? []).filter((m) => {
        var R;
        return m.target_key === ((R = C.value) == null ? void 0 : R.key);
      });
    }), P = (l) => {
      var m, R;
      return ((R = (m = s.value) == null ? void 0 : m.fields.find((n) => n.field === l)) == null ? void 0 : R.operators) ?? [];
    }, j = (l) => {
      var m;
      return ((m = P(l.field).find((R) => R.operator === l.operator)) == null ? void 0 : m.needs_value) ?? !1;
    }, F = g(() => {
      var l;
      return ((l = C.value) == null ? void 0 : l.target) === "main" && r.draft.value(bn) === !1;
    });
    function q(l) {
      return { main: ["--target", "main"], agent: ["--target", "agent", "--agent", `row:${l.agent_id}`], model: ["--target", "model", "--program", l.program, "--model", l.program_model] }[l.target];
    }
    const U = (l) => [l.field, l.operator, j(l) ? l.value : ""].filter(Boolean).join(" ");
    async function I(l) {
      const m = await t.run([...l, "--revision", s.value.revision, "--environment", t.environment]);
      return y.value = m.ok ? "" : m.error, await t.reload("assign"), m.ok;
    }
    function K(l, m) {
      var R;
      l.field = m, l.operator = ((R = P(m)[0]) == null ? void 0 : R.operator) ?? "", l.value = "";
    }
    async function _() {
      const l = ["assign-rule", "make", ...q(C.value), ...a.value.flatMap((m) => ["--condition", U(m)])];
      await I(l) && (a.value = [T()]);
    }
    const c = (l, m) => I(["assign-rule", "move", String(l.id), "--to", String(l.position + m)]), p = (l) => I(["assign-rule", l.enabled ? "disable" : "enable", String(l.id)]), B = (l) => I(["assign-rule", "delete", String(l.id)]), V = x(""), f = x(null), $ = x(""), A = () => a.value.map((l) => `--condition ${JSON.stringify(U(l))}`).join(" ");
    async function W() {
      const l = await t.read(`assign-rule try ${Number(V.value)} ${A()} --environment ${t.environment}`);
      y.value = l.ok ? "" : l.error, f.value = l.ok ? l.value : null;
    }
    async function z() {
      const l = await t.read(`assign-rule recent ${A()} --environment ${t.environment}`);
      y.value = l.ok ? "" : l.error, $.value = l.ok ? l.value.text : "";
    }
    return (l, m) => {
      var R;
      return o(), u("section", Ut, [
        s.value ? (o(), u(M, { key: 0 }, [
          d("div", Wt, [
            (o(!0), u(M, null, H(s.value.targets, (n) => {
              var k, O;
              return o(), u("button", {
                key: n.key,
                type: "button",
                class: X(["target", { chosen: n.key === ((k = C.value) == null ? void 0 : k.key) }]),
                "aria-selected": n.key === ((O = C.value) == null ? void 0 : O.key),
                "data-assign-target": n.key,
                onClick: (Ln) => v.value = n.key
              }, [
                d("span", Ht, h(n.label), 1),
                d("span", Kt, h(n.description), 1),
                n.target === "agent" ? (o(), u("span", zt, "State: " + h(n.running ? "running" : "kept") + " · Open tasks: " + h(n.open_tasks), 1)) : b("", !0),
                n.waiting ? (o(), u("span", Gt, h(n.waiting), 1)) : b("", !0)
              ], 10, Dt);
            }), 128))
          ]),
          d("div", Yt, [
            m[4] || (m[4] = d("p", { class: "note" }, "The rules are tried in order and the first match wins.", -1)),
            (o(!0), u(M, null, H(L.value, (n) => (o(), u("div", {
              key: n.id,
              class: X(["rule", { off: !n.enabled, warned: n.warning }]),
              "data-assign-rule": n.id
            }, [
              d("span", Jt, h(n.position), 1),
              d("span", Zt, h(n.summary), 1),
              n.warning ? (o(), u("span", Qt, h(n.warning), 1)) : b("", !0),
              S(Mt, {
                activity: n.activity
              }, null, 8, ["activity"]),
              e.readOnly ? b("", !0) : (o(), u("span", en, [
                d("button", {
                  type: "button",
                  title: "Move the rule up",
                  disabled: n.position === 1,
                  onClick: (k) => c(n, -1)
                }, "↑", 8, tn),
                d("button", {
                  type: "button",
                  title: "Move the rule down",
                  disabled: n.position === s.value.rules.length,
                  onClick: (k) => c(n, 1)
                }, "↓", 8, nn),
                d("button", {
                  type: "button",
                  title: n.enabled ? "Turn the rule off" : "Turn the rule on",
                  onClick: (k) => p(n)
                }, h(n.enabled ? "Turn off" : "Turn on"), 9, an),
                d("button", {
                  type: "button",
                  title: "Delete the rule",
                  onClick: (k) => B(n)
                }, "Delete", 8, sn)
              ]))
            ], 10, Xt))), 128)),
            L.value.length ? b("", !0) : (o(), u("p", on, "No rules give tasks to " + h((R = C.value) == null ? void 0 : R.label) + " yet.", 1)),
            e.readOnly ? b("", !0) : (o(), u("form", {
              key: 1,
              class: "editor",
              "data-assign-editor": "",
              onSubmit: be(_, ["prevent"])
            }, [
              m[2] || (m[2] = d("p", { class: "all" }, "A task must meet all of these conditions:", -1)),
              (o(!0), u(M, null, H(a.value, (n, k) => (o(), u("div", {
                key: n.id,
                class: "condition"
              }, [
                d("select", {
                  value: n.field,
                  "aria-label": "Condition",
                  onChange: (O) => K(n, O.target.value)
                }, [
                  (o(!0), u(M, null, H(s.value.fields, (O) => (o(), u("option", {
                    key: O.field,
                    value: O.field
                  }, h(O.field === "any" ? "Any task" : O.field), 9, rn))), 128))
                ], 40, ln),
                ae(d("select", {
                  "onUpdate:modelValue": (O) => n.operator = O,
                  "aria-label": "Comparison"
                }, [
                  (o(!0), u(M, null, H(P(n.field), (O) => (o(), u("option", {
                    key: O.operator,
                    value: O.operator
                  }, h(O.label), 9, un))), 128))
                ], 8, dn), [
                  [Te, n.operator]
                ]),
                j(n) ? ae((o(), u("input", {
                  key: 0,
                  "onUpdate:modelValue": (O) => n.value = O,
                  "aria-label": "Value",
                  placeholder: "For example: 4 or migration"
                }, null, 8, cn)), [
                  [ce, n.value]
                ]) : b("", !0),
                d("button", {
                  type: "button",
                  title: "Remove the condition",
                  disabled: a.value.length === 1,
                  onClick: (O) => a.value.splice(k, 1)
                }, "Remove", 8, vn)
              ]))), 128)),
              d("button", {
                type: "button",
                onClick: m[0] || (m[0] = (n) => a.value.push(T()))
              }, "Add a condition"),
              F.value ? (o(), u("p", pn, "The main agent writes no code here, so a rule that gives it a task is skipped.")) : b("", !0),
              d("div", fn, [
                ae(d("input", {
                  "onUpdate:modelValue": m[1] || (m[1] = (n) => V.value = n),
                  type: "number",
                  min: "1",
                  "aria-label": "Task number for the trial",
                  placeholder: "Task number",
                  "data-assign-trial-task": ""
                }, null, 512), [
                  [ce, V.value]
                ]),
                d("button", {
                  type: "button",
                  disabled: !V.value,
                  "data-assign-try": "",
                  onClick: W
                }, "Try on this task", 8, mn),
                d("button", {
                  type: "button",
                  "data-assign-count": "",
                  onClick: z
                }, "Count the last 20 tasks")
              ]),
              $.value ? (o(), u("p", gn, h($.value), 1)) : b("", !0),
              f.value ? (o(), u("div", yn, [
                d("p", kn, h(f.value.matches ? "The rule would match" : "The rule would not match") + " task " + h(f.value.task_id) + ". Nothing is assigned.", 1),
                (o(!0), u(M, null, H(f.value.conditions, (n) => (o(), u("p", {
                  key: n.label,
                  class: X(["said", { missed: !n.matched }])
                }, h(n.label) + ": " + h(n.matched ? "met" : "not met"), 3))), 128))
              ])) : b("", !0),
              m[3] || (m[3] = d("button", {
                type: "submit",
                class: "save"
              }, "Add the rule", -1))
            ], 32)),
            y.value ? (o(), u("p", hn, h(y.value), 1)) : b("", !0)
          ])
        ], 64)) : b("", !0)
      ]);
    };
  }
}, _n = /* @__PURE__ */ D(wn, [["__scopeId", "data-v-7a8adb88"]]), $n = { class: "screen" }, On = { class: "rail" }, Sn = {
  __name: "AgentSettingsScreen",
  props: { nodes: { type: Array, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 }, extras: { type: Object, default: () => ({}) }, found: { type: String, default: "" } },
  setup(e) {
    const r = e, t = x(null), s = g(() => ze(r.nodes));
    de(() => r.found, (y) => y && xe(() => {
      var w, T;
      return (T = (w = t.value) == null ? void 0 : w.querySelector(`[data-setting="${y}"]`)) == null ? void 0 : T.scrollIntoView({ block: "center" });
    }), { immediate: !0, flush: "post" });
    const v = (y) => {
      var w, T;
      return (T = (w = t.value) == null ? void 0 : w.querySelector(`[data-section="${y}"]`)) == null ? void 0 : T.scrollIntoView({ block: "start", behavior: "smooth" });
    };
    return (y, w) => (o(), u("div", $n, [
      d("nav", On, [
        S(i(Ge), {
          sections: s.value,
          scope: t.value,
          onChoose: v
        }, null, 8, ["sections", "scope"])
      ]),
      d("div", {
        ref_key: "scroll",
        ref: t,
        class: "content"
      }, [
        Re(y.$slots, "before", {}, void 0, !0),
        S(i(_e), {
          nodes: e.nodes,
          draft: e.draft,
          "read-only": e.readOnly,
          extras: e.extras,
          found: e.found
        }, null, 8, ["nodes", "draft", "read-only", "extras", "found"])
      ], 512)
    ]));
  }
}, re = /* @__PURE__ */ D(Sn, [["__scopeId", "data-v-1cab27ca"]]), Cn = {
  key: 0,
  class: "hint",
  "data-work-hint": ""
}, An = {
  __name: "AgentSettingsTab",
  props: { tab: { type: String, required: !0 }, active: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, isLoaded: Boolean, nodes: { type: Function, required: !0 }, readOnly: Boolean, found: { type: String, default: "" }, nothingStarts: Boolean, advancedExtras: { type: Object, required: !0 } },
  setup(e) {
    return (r, t) => (o(), u("div", {
      class: X(["settings-body", { flush: e.tab === "agents" }])
    }, [
      S(i(Le), { tab: e.active }, {
        default: E(() => [
          S(i(we), { value: e.tab }, {
            work: E(() => [
              e.isLoaded ? (o(), N(re, {
                key: "work",
                nodes: e.nodes("work"),
                draft: e.draft,
                "read-only": e.readOnly,
                found: e.found,
                "data-agent-settings-work": ""
              }, {
                before: E(() => [
                  e.nothingStarts ? (o(), u("p", Cn, "With Auto off and no workers, nothing starts the work: a user starts tasks or turns one of them on.")) : b("", !0)
                ]),
                _: 1
              }, 8, ["nodes", "draft", "read-only", "found"])) : b("", !0)
            ]),
            agents: E(() => [
              S(Lt, { draft: e.draft }, null, 8, ["draft"])
            ]),
            assign: E(() => [
              S(_n, {
                draft: e.draft,
                "read-only": e.readOnly
              }, null, 8, ["draft", "read-only"])
            ]),
            tests: E(() => [
              e.isLoaded ? (o(), N(re, {
                key: "tests",
                nodes: e.nodes("tests"),
                draft: e.draft,
                "read-only": e.readOnly,
                found: e.found,
                "data-agent-settings-tests": ""
              }, null, 8, ["nodes", "draft", "read-only", "found"])) : b("", !0)
            ]),
            advanced: E(() => [
              e.isLoaded ? (o(), N(re, {
                key: "advanced",
                nodes: e.nodes("advanced"),
                draft: e.draft,
                "read-only": e.readOnly,
                found: e.found,
                extras: e.advancedExtras,
                "data-agent-settings-advanced": ""
              }, null, 8, ["nodes", "draft", "read-only", "found", "extras"])) : b("", !0)
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        _: 1
      }, 8, ["tab"])
    ], 2));
  }
}, Tn = {
  class: "settings",
  "data-agent-settings": ""
}, xn = { class: "head" }, Rn = {
  class: "env",
  "data-settings-environment": ""
}, En = { class: "settings-bar" }, Nn = {
  key: 1,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, In = "journal.suites.coding.auto-mode", Bn = "journal.suites.coding.workers.main-dispatches-workers", Pn = 1200, jn = {
  __name: "AgentSettings",
  setup(e) {
    const r = { work: "work-screen", tests: "tests-screen", advanced: "advanced-screen", "helper-types": "helper-types-screen" }, t = ee(), s = x("work"), v = [{ key: "work", label: "Work" }, { key: "agents", label: "Helpers", count_field: "full" }, { key: "assign", label: "Assign" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }], y = g(() => v.find((n) => n.key === s.value)), w = () => Object.values(r).map((n) => t.props[n].data.value), T = g(() => w().every(Boolean)), a = Ye({
      run: (n) => t.run(n),
      reload: async () => {
        const n = "type-screen.type" in t.state;
        await Promise.all([...Object.values(r).map((k) => t.reload(k)), t.reload("limits"), ...n ? [t.reload("type-screen")] : []]), a.load([...w(), ...n ? [t.props["type-screen"].data.value] : []]);
      }
    });
    de(w, (n) => {
      n.every(Boolean) && a.load(n);
    }, { immediate: !0 });
    const { rows: C } = Ae(t, a), L = g(() => At(C.value)), P = g(() => L.value ? { full: `${L.value} full` } : {});
    Q(() => t.reload("limits"));
    const j = [{ key: "main", name: "Main agent" }, { key: "worker", name: "Workers" }, { key: "helper", name: "Read-only helpers" }], F = (n) => {
      var k;
      return ((k = C.value.find((O) => O.profile === n)) == null ? void 0 : k.name) ?? n;
    }, q = g(() => (a.value(Z) ?? []).map(Se).map(({ name: n, value: k }) => ({ name: F(n), value: k === "none" ? "no cap" : `${Number(k) / 1e3}k` }))), U = g(() => ({ "keyed-cap-table": { rows: j, sizes: ie, defaultCap: Number(a.value(ue)) || ie[0], ownCaps: q.value } })), I = (n) => {
      var k;
      return ((k = t.props[r[n]].data.value) == null ? void 0 : k.nodes) ?? [];
    }, K = g(() => a.value(In) === !1 && a.value(Bn) === !1), _ = g(() => !t.readOnly), c = x("main"), p = g(() => {
      var n;
      return ((n = t.props.work.data.value) == null ? void 0 : n.presets) ?? [];
    }), B = g(() => {
      var n;
      return ((n = t.props.work.data.value) == null ? void 0 : n.switches) ?? [];
    }), V = g(() => Object.fromEntries(B.value.map((n) => [n.key, a.value(n.key)]))), f = g(() => Xe(V.value, p.value)), $ = (n) => a.fill(p.value.find((k) => k.key === n).values), A = g(() => {
      var n;
      return ((n = t.props.find.data.value) == null ? void 0 : n.rows) ?? [];
    }), W = x("");
    let z = null;
    const l = (n) => n.startsWith("helper-type") ? "agents" : n;
    function m(n) {
      c.value = "main", R({ key: l(n.screen) }), W.value = n.key, clearTimeout(z), z = setTimeout(() => {
        W.value = "";
      }, Pn);
    }
    Ee(() => clearTimeout(z));
    function R(n) {
      s.value = n.key, t.state.tab = n.key === "agents" ? "agents" : "";
    }
    return (n, k) => (o(), N(i(Fe), { padding: "0" }, {
      default: E(() => [
        d("div", Tn, [
          S(i(we), { value: c.value }, {
            main: E(() => [
              d("div", xn, [
                d("span", Rn, h(i(t).environment), 1)
              ]),
              p.value.length ? (o(), N(i(Je), {
                key: 0,
                presets: p.value,
                current: f.value,
                disabled: i(t).readOnly,
                onPick: $,
                onOpenPage: k[0] || (k[0] = (O) => c.value = "presets")
              }, {
                default: E(() => [
                  S(i(Ze), {
                    index: A.value,
                    onPick: m
                  }, null, 8, ["index"])
                ]),
                _: 1
              }, 8, ["presets", "current", "disabled"])) : b("", !0),
              d("div", En, [
                S(i(qe), {
                  tabs: v,
                  active: y.value,
                  answer: P.value,
                  onChoose: R
                }, null, 8, ["active", "answer"])
              ]),
              i(t).readOnly ? (o(), u("p", Nn, "Only a user can change these settings. You can read every value, and ask a user for a change.")) : b("", !0),
              S(An, {
                tab: s.value,
                active: y.value,
                draft: i(a),
                "is-loaded": T.value,
                nodes: I,
                "read-only": i(t).readOnly,
                found: W.value,
                "nothing-starts": K.value,
                "advanced-extras": U.value
              }, null, 8, ["tab", "active", "draft", "is-loaded", "read-only", "found", "nothing-starts", "advanced-extras"])
            ]),
            presets: E(() => [
              S(lt, {
                presets: p.value,
                switches: B.value,
                now: V.value,
                "read-only": i(t).readOnly,
                onBack: k[1] || (k[1] = (O) => c.value = "main"),
                onFill: $
              }, null, 8, ["presets", "switches", "now", "read-only"])
            ]),
            _: 1
          }, 8, ["value"]),
          _.value ? (o(), N(i(Qe), {
            key: 0,
            changes: i(a).changes(),
            "can-save": i(a).canSave.value,
            pending: i(a).pending.value,
            reason: i(a).reason.value,
            environment: i(t).environment,
            onSave: k[2] || (k[2] = (O) => i(a).apply()),
            onCancel: k[3] || (k[3] = (O) => i(a).reset())
          }, null, 8, ["changes", "can-save", "pending", "reason", "environment"])) : b("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, Un = /* @__PURE__ */ D(jn, [["__scopeId", "data-v-f88ce405"]]);
export {
  Un as A
};
