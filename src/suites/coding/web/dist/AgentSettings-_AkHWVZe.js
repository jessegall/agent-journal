import { openBlock as l, createElementBlock as c, createElementVNode as d, Fragment as W, renderList as D, createBlock as N, unref as r, createVNode as S, withModifiers as be, withCtx as E, createTextVNode as Y, ref as x, computed as g, onMounted as Q, toDisplayString as h, createCommentVNode as b, normalizeClass as X, watch as de, withDirectives as ae, vModelSelect as Ae, vModelText as ce, nextTick as xe, renderSlot as Re, onBeforeUnmount as Ee } from "vue";
import { TextInput as Ne, Btn as J, useWindow as ee, useNow as Ie, agentTitle as Be, age as Pe, agentNumber as je, TabBody as Le, SwitchCase as we, WindowRoom as Fe, InnerTabs as qe } from "@journal/window-kit";
import { SettingPresetCard as ve, SettingPresetCompareTable as Ve, SettingEmptyState as Me, isFull as pe, SettingBackPath as Ue, SettingPerTypeOverrideRow as fe, SettingsScreen as _e, SettingRow as me, SettingEntryList as We, SettingThreeWayCap as De, SettingBanner as He, SettingHelperTypeTable as Ke, sectionsOf as ze, SettingSectionList as Ge, useSettingsDraft as Ye, currentPreset as Xe, SettingPresetBand as Je, FindBox as Ze, ChangeFoot as Qe } from "@journal/setting-components";
import { _ as H } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const et = {
  class: "page",
  "data-agent-settings-presets": ""
}, tt = { class: "crumb" }, nt = { class: "body" }, at = { class: "cards" }, st = "Any other mix of the eight switches. The form shows Custom as soon as the switches match neither preset.", ot = {
  __name: "AgentSettingsPresets",
  props: { presets: { type: Array, required: !0 }, switches: { type: Array, required: !0 }, now: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back", "fill"],
  setup(t, { emit: i }) {
    const e = i;
    return (s, v) => (l(), c("section", et, [
      d("div", tt, [
        d("button", {
          type: "button",
          class: "back",
          "data-presets-back": "",
          onClick: v[0] || (v[0] = (y) => e("back"))
        }, "‹ Back"),
        v[1] || (v[1] = d("b", null, "What is a preset?", -1))
      ]),
      d("div", nt, [
        v[2] || (v[2] = d("p", { class: "lead" }, "A preset is a set of eight switches and nothing more. It is not a type of agent: the main agent is the same program under every preset, and a preset only fills in the switches below. Nothing is saved until you press Save.", -1)),
        d("div", at, [
          (l(!0), c(W, null, D(t.presets, (y) => (l(), N(r(ve), {
            key: y.key,
            name: y.name,
            line: y.line,
            "can-fill": !t.readOnly,
            onFill: (w) => e("fill", y.key)
          }, null, 8, ["name", "line", "can-fill", "onFill"]))), 128)),
          S(r(ve), {
            name: "Custom",
            line: st
          })
        ]),
        S(r(Ve), {
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
    return (i, e) => (l(), c("form", {
      "data-agent-retire-confirm": "",
      onSubmit: e[2] || (e[2] = be((s) => i.$emit("submit"), ["prevent"]))
    }, [
      e[5] || (e[5] = d("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      S(r(Ne), {
        "model-value": t.reason,
        label: "Reason",
        disabled: t.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": e[0] || (e[0] = (s) => i.$emit("update:reason", s))
      }, null, 8, ["model-value", "disabled"]),
      d("div", rt, [
        S(r(J), {
          type: "submit",
          small: "",
          disabled: t.pending || !t.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: E(() => [...e[3] || (e[3] = [
            Y("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        S(r(J), {
          small: "",
          disabled: t.pending,
          onClick: e[1] || (e[1] = (s) => i.$emit("cancel"))
        }, {
          default: E(() => [...e[4] || (e[4] = [
            Y("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, dt = /* @__PURE__ */ H(it, [["__scopeId", "data-v-92de7dd6"]]), ut = {
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
  setup(t, { emit: i }) {
    const e = t, s = i, v = ee(), y = Ie(), w = x([]), A = x(0), a = x(!1), C = x(!1), L = x(""), P = x(""), j = x(null), F = x(""), q = g(() => w.value.filter((_) => {
      var u;
      return _.state !== "retired" && _.role === e.role && (!e.profile || (((u = _.facts) == null ? void 0 : u.profile) || _.profile) === e.profile);
    }).sort((_, u) => (_.state !== "running") - (u.state !== "running") || String(_.ended_at || _.created_at).localeCompare(String(u.ended_at || u.created_at)))), M = g(() => {
      var u;
      const _ = /* @__PURE__ */ new Map();
      for (const p of q.value) {
        const B = ((u = p.facts) == null ? void 0 : u.model) || p.program_model;
        B && _.set(B, (_.get(B) || 0) + 1);
      }
      return [..._].map(([p, B]) => `${B} ${p}`).join(", ");
    });
    async function I(_ = 1) {
      v.state["count-agents.role"] = e.role, e.profile ? v.state["count-agents.profile"] = e.profile : delete v.state["count-agents.profile"], v.state["count-agents.page"] = String(_), await v.reload("count-agents");
      const u = v.props["count-agents"];
      w.value = _ === 1 ? [...u.rows.value] : [...w.value, ...u.rows.value], A.value = _, a.value = u.more.value;
    }
    async function K(_) {
      if (!F.value.trim() || C.value) return;
      C.value = !0;
      const u = await v.run(["agent", "retire", String(_.number), "--reason", F.value.trim()]);
      L.value = u.ok ? "" : "The agent could not be retired. Try again.", u.ok && (j.value = null, F.value = "", P.value = "Agent retired permanently.", s("retired"), await I()), C.value = !1;
    }
    return Q(() => I()), (_, u) => (l(), c("section", ut, [
      d("p", ct, h(M.value), 1),
      q.value.length ? b("", !0) : (l(), N(r(Me), {
        key: 0,
        title: "No agents here yet",
        line: "An agent shows here as soon as one of this type starts."
      })),
      (l(!0), c(W, null, D(q.value, (p) => {
        var B, V, f, $;
        return l(), c("div", {
          key: p.id,
          class: "person",
          "data-count-agent": p.id
        }, [
          d("span", {
            class: X(["dot", { running: p.state === "running" }])
          }, null, 2),
          d("div", pt, [
            d("strong", null, h(r(Be)(p).text), 1),
            Y(" " + h(p.state === "running" ? "Running" : "Idle") + ", " + h(r(Pe)(p.state === "running" ? p.process_started_at || p.created_at : p.ended_at, r(y))) + " ", 1),
            d("small", null, h([p.program, (B = p.facts) == null ? void 0 : B.model, (V = p.facts) == null ? void 0 : V.effort, r(je)(p)].filter(Boolean).join(", ")), 1),
            d("small", null, h(((f = p.facts) == null ? void 0 : f.task_title) || (($ = p.facts) == null ? void 0 : $.helper_job)), 1)
          ]),
          S(r(J), {
            small: "",
            onClick: (T) => s("open-agent", p)
          }, {
            default: E(() => [...u[3] || (u[3] = [
              Y("Open", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]),
          p.state === "idle" && !r(v).readOnly ? (l(), N(r(J), {
            key: 0,
            small: "",
            onClick: (T) => {
              j.value = p.id, F.value = "";
            }
          }, {
            default: E(() => [...u[4] || (u[4] = [
              Y("Retire", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])) : b("", !0),
          j.value === p.id ? (l(), N(dt, {
            key: 1,
            reason: F.value,
            "onUpdate:reason": u[0] || (u[0] = (T) => F.value = T),
            pending: C.value,
            onSubmit: (T) => K(p),
            onCancel: u[1] || (u[1] = (T) => j.value = null)
          }, null, 8, ["reason", "pending", "onSubmit"])) : b("", !0)
        ], 8, vt);
      }), 128)),
      a.value ? (l(), N(r(J), {
        key: 1,
        small: "",
        onClick: u[2] || (u[2] = (p) => I(A.value + 1))
      }, {
        default: E(() => [...u[5] || (u[5] = [
          Y("Show more", -1)
        ])]),
        _: 1
      })) : b("", !0),
      L.value ? (l(), c("p", ft, h(L.value), 1)) : P.value ? (l(), c("p", mt, h(P.value), 1)) : b("", !0)
    ]));
  }
}, yt = /* @__PURE__ */ H(gt, [["__scopeId", "data-v-67f17bfa"]]), G = "journal.core.helpers", kt = `${G}.context-limit-on`, ue = `${G}.context-limit-tokens`, $e = `${G}.context-limit-kinds`, Z = `${G}.context-limit-profiles`, se = `${G}.read-only-helper-profile-limits`, ht = `${G}.read-only-helper-run-limit`, bt = `${G}.read-only-helper-kept-limit`, oe = "journal.suites.coding.workers.merge-hooks", wt = "none", Oe = (t) => `${t / 1e3}k`, Se = (t) => {
  const i = t.lastIndexOf(":");
  return { name: t.slice(0, i).trim(), value: t.slice(i + 1).trim() };
}, Ce = (t) => {
  const i = t.indexOf(":");
  return i < 0 ? { text: t, name: "", command: "" } : { text: t, name: t.slice(0, i).trim(), command: t.slice(i + 1).trim() };
}, _t = (t, i) => (t ?? []).map(Ce).filter((e) => e.name === i).map((e) => e.command), $t = (t, i, e) => [
  ...(t ?? []).map(Ce).filter((s) => s.name !== i).map((s) => s.text),
  ...e.map((s) => `${i}: ${s}`)
], ne = (t, i) => {
  var e;
  return (e = (t ?? []).map(Se).find((s) => s.name === i)) == null ? void 0 : e.value;
}, ge = (t) => t === wt ? "No cap" : Oe(Number(t));
function ye(t, i, e) {
  if (t(kt) !== !0) return { text: "Off", where: "Context limit is off", own: !1 };
  const s = e ? ne(t(Z), e) : void 0;
  if (s !== void 0) return { text: ge(s), where: "Own value", own: !0 };
  const v = ne(t($e), i);
  return v !== void 0 ? { text: ge(v), where: "Set for its type", own: !1 } : { text: Oe(Number(t(ue))), where: "Set for every agent", own: !1 };
}
const Ot = (t) => t > 0 ? t : null, St = { worker: "workers" }, te = "merger", ke = "designer";
function he(t, i, e, s, v, y = {}) {
  return { key: t, name: i, line: e, running: s.running, runLimit: s.run_limit, kept: s.kept, keptLimit: Ot(s.kept_limit), cap: v, ...y };
}
function Ct(t, i) {
  const e = t.filter((a) => !a.per_profile).map((a) => he(a.key, a.label, a.line, a, ye(i, a.key, ""), { screen: St[a.key] ?? "read-only", role: a.key, profile: "", defaultProfile: a.default_profile })), s = t.find((a) => a.per_profile);
  if (!s) return e;
  const v = (a) => he(`${s.key}:${a.profile}`, a.title, a.line, a, ye(i, s.key, a.profile), { screen: a.group === te ? te : "read-only", role: s.key, profile: a.profile }), y = s.profiles.filter((a) => a.group === te || a.group === ke).map(v), w = s.profiles.filter((a) => a.group !== te && a.group !== ke).map((a) => ({ ...v(a), indent: !0 })), A = { key: s.key, name: "Read-only helpers", group: !0, screen: "read-only", role: s.key, profile: "", line: `${s.running} running, ${s.kept} kept. Every profile runs up to ${s.run_limit} and keeps ${s.kept_limit ? `up to ${s.kept_limit}` : "any number"} unless it has limits of its own.` };
  return [...e, ...y, A, ...w];
}
const ie = Array.from({ length: 10 }, (t, i) => (i + 1) * 1e5), Tt = (t) => t.filter((i) => !i.group && (pe(i.running, i.runLimit) || pe(i.kept, i.keptLimit ?? 0))).length;
function Te(t, i) {
  const e = g(() => t.props.limits.rows.value ?? []), s = g(() => Ct(e.value, i.value)), v = g(() => !!t.props.limits.failure.value);
  return { rows: s, unreadable: v, reread: () => t.reload("limits") };
}
const At = {
  class: "type",
  "data-agent-type-screen": ""
}, xt = { class: "typebody" }, Rt = {
  class: "typemain",
  "data-type-settings": ""
}, Et = { class: "typeside" }, le = "none", Nt = "worker", It = {
  __name: "AgentSettingsTypeScreen",
  props: { row: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back"],
  setup(t, { emit: i }) {
    const e = t, s = i, v = ee(), y = g(() => v.props["type-screen"].data.value), w = g(() => {
      var f;
      return ((f = y.value) == null ? void 0 : f.nodes) ?? [];
    }), A = g(() => e.row.profile !== "");
    async function a() {
      v.state["type-screen.type"] = e.row.screen, await v.reload("type-screen");
    }
    de(y, (f) => {
      f && e.draft.load([f]);
    }), Q(a);
    const C = g(() => (e.draft.value(se) ?? []).map((f) => f.split(":"))), L = g(() => C.value.find((f) => f[0] === e.row.profile)), P = g(() => ({ running: Number(e.draft.value(ht)), kept: Number(e.draft.value(bt)) })), j = (f) => L.value ? Number(L.value[f === "running" ? 1 : 2]) : null;
    function F(f, $) {
      const T = C.value.filter((o) => o[0] !== e.row.profile).map((o) => o.join(":"));
      if ($ === null) return e.draft.set(se, T);
      if ($ === "") return;
      const U = f === "running" ? $ : j("running") ?? P.value.running, z = f === "kept" ? $ : j("kept") ?? P.value.kept;
      e.draft.set(se, [...T, `${e.row.profile}:${U}:${z}`]);
    }
    const q = g(() => e.row.group ? "" : e.row.profile || e.row.defaultProfile || ""), M = g(() => ne(e.draft.value(Z), q.value)), I = g(() => M.value === void 0 ? "kind" : M.value === le ? "none" : "own"), K = g(() => {
      const f = ne(e.draft.value($e), e.row.role);
      return f === le ? null : Number(f ?? e.draft.value(ue));
    });
    function _({ mode: f, size: $ }) {
      const T = (e.draft.value(Z) ?? []).filter((U) => U.slice(0, U.lastIndexOf(":")).trim() !== q.value);
      e.draft.set(Z, f === "kind" ? T : [...T, `${q.value}:${f === "none" ? le : $}`]);
    }
    const u = g(() => e.row.role === Nt ? q.value : ""), p = g(() => _t(e.draft.value(oe), u.value)), B = (f) => e.draft.set(oe, $t(e.draft.value(oe), u.value, f)), V = (f) => v.open("agents.agents", f.id);
    return (f, $) => (l(), c("div", At, [
      S(r(Ue), {
        parent: "Helpers",
        current: t.row.name,
        onBack: $[0] || ($[0] = (T) => s("back"))
      }, null, 8, ["current"]),
      d("div", xt, [
        d("div", Rt, [
          A.value && t.row.screen === "read-only" ? (l(), c(W, { key: 0 }, [
            S(r(fe), {
              label: "Running",
              help: "Agents of this profile that run at once.",
              "every-value": P.value.running,
              "own-value": j("running"),
              disabled: t.readOnly,
              "data-override-running": "",
              "onUpdate:ownValue": $[1] || ($[1] = (T) => F("running", T))
            }, null, 8, ["every-value", "own-value", "disabled"]),
            S(r(fe), {
              label: "Kept",
              help: "Agents of this profile kept until retired, running or idle. At 0 there is no limit.",
              "every-value": P.value.kept,
              "own-value": j("kept"),
              disabled: t.readOnly,
              "data-override-kept": "",
              "onUpdate:ownValue": $[2] || ($[2] = (T) => F("kept", T))
            }, null, 8, ["every-value", "own-value", "disabled"])
          ], 64)) : (l(), N(r(_e), {
            key: 1,
            nodes: w.value,
            draft: t.draft,
            "read-only": t.readOnly
          }, null, 8, ["nodes", "draft", "read-only"])),
          u.value ? (l(), N(r(me), {
            key: 2,
            label: "When merged",
            help: "Commands run in the main checkout after a worker of this profile is merged. One that fails is told to the main agent; the merge stands.",
            source: p.value.length ? "own" : "default",
            "data-merge-hooks": ""
          }, {
            default: E(() => [
              S(r(We), {
                "model-value": p.value,
                placeholder: "a command",
                disabled: t.readOnly,
                "onUpdate:modelValue": B
              }, null, 8, ["model-value", "disabled"])
            ]),
            _: 1
          }, 8, ["source"])) : b("", !0),
          q.value ? (l(), N(r(me), {
            key: 3,
            label: "Context cap",
            help: "The context size at which this type is compacted.",
            source: I.value === "own" || I.value === "none" ? "own" : "default",
            "data-context-cap": ""
          }, {
            default: E(() => [
              S(r(De), {
                mode: I.value,
                "kind-value": K.value,
                "own-value": I.value === "own" ? Number(M.value) : null,
                sizes: r(ie),
                disabled: t.readOnly,
                onChange: _
              }, null, 8, ["mode", "kind-value", "own-value", "sizes", "disabled"])
            ]),
            _: 1
          }, 8, ["source"])) : b("", !0)
        ]),
        d("aside", Et, [
          $[3] || ($[3] = d("h3", null, "Agents", -1)),
          S(yt, {
            role: t.row.role,
            profile: t.row.profile,
            onOpenAgent: V
          }, null, 8, ["role", "profile"])
        ])
      ])
    ]));
  }
}, Bt = /* @__PURE__ */ H(It, [["__scopeId", "data-v-3bc929c1"]]), Pt = {
  class: "agents",
  "data-agent-settings-agents": ""
}, jt = {
  __name: "AgentSettingsAgents",
  props: { draft: { type: Object, required: !0 } },
  setup(t) {
    const i = t, e = ee(), { rows: s, unreadable: v, reread: y } = Te(e, i.draft), w = x(null);
    Q(y);
    const A = (a) => {
      w.value = s.value.find((C) => C.key === a);
    };
    return (a, C) => (l(), c("section", Pt, [
      w.value ? (l(), N(Bt, {
        key: 0,
        row: w.value,
        draft: t.draft,
        "read-only": r(e).readOnly,
        onBack: C[0] || (C[0] = (L) => w.value = null)
      }, null, 8, ["row", "draft", "read-only"])) : r(v) ? (l(), N(r(He), {
        key: 1,
        kind: "unreadable",
        text: "The counts could not be read.",
        onRetry: r(y)
      }, null, 8, ["onRetry"])) : (l(), N(r(Ke), {
        key: 2,
        rows: r(s),
        onOpen: A
      }, null, 8, ["rows"]))
    ]));
  }
}, Lt = /* @__PURE__ */ H(jt, [["__scopeId", "data-v-05cc036a"]]), Ft = {
  class: "assign",
  "data-agent-settings-assign": ""
}, qt = {
  class: "targets",
  role: "listbox",
  "aria-label": "Give tasks to"
}, Vt = ["aria-selected", "data-assign-target", "onClick"], Mt = { class: "name" }, Ut = { class: "facts" }, Wt = {
  key: 0,
  class: "facts"
}, Dt = {
  key: 1,
  class: "facts",
  "data-assign-waiting": ""
}, Ht = { class: "rules" }, Kt = ["data-assign-rule"], zt = { class: "place" }, Gt = { class: "summary" }, Yt = {
  key: 0,
  class: "warning",
  "data-assign-warning": ""
}, Xt = {
  class: "activity",
  "data-assign-activity": ""
}, Jt = {
  key: 1,
  class: "activity",
  "data-assign-last-skip": ""
}, Zt = {
  key: 2,
  class: "actions"
}, Qt = ["disabled", "onClick"], en = ["disabled", "onClick"], tn = ["title", "onClick"], nn = ["onClick"], an = {
  key: 0,
  class: "empty"
}, sn = ["value", "onChange"], on = ["value"], ln = ["onUpdate:modelValue"], rn = ["value"], dn = ["onUpdate:modelValue"], un = ["disabled", "onClick"], cn = {
  key: 0,
  class: "warning",
  "data-assign-main-warning": ""
}, vn = { class: "trial" }, pn = ["disabled"], fn = {
  key: 1,
  class: "verdict",
  "data-assign-recent": ""
}, mn = {
  key: 2,
  class: "trial-result",
  "data-assign-trial": ""
}, gn = { class: "verdict" }, yn = {
  key: 2,
  class: "failure",
  role: "alert",
  "data-assign-failure": ""
}, kn = "journal.suites.coding.main-writes-code", hn = {
  __name: "AgentSettingsAssign",
  props: { draft: { type: Object, required: !0 }, readOnly: Boolean },
  setup(t) {
    const i = t, e = ee(), s = g(() => e.props.assign.data.value), v = x("main"), y = x("");
    let w = 0;
    const A = () => ({ id: ++w, field: "complexity", operator: "minimum", value: "" }), a = x([A()]);
    Q(() => e.reload("assign"));
    const C = g(() => {
      var o, m;
      return ((o = s.value) == null ? void 0 : o.targets.find((R) => R.key === v.value)) ?? ((m = s.value) == null ? void 0 : m.targets[0]);
    }), L = g(() => {
      var o;
      return (((o = s.value) == null ? void 0 : o.rules) ?? []).filter((m) => {
        var R;
        return m.target_key === ((R = C.value) == null ? void 0 : R.key);
      });
    }), P = (o) => {
      var m, R;
      return ((R = (m = s.value) == null ? void 0 : m.fields.find((n) => n.field === o)) == null ? void 0 : R.operators) ?? [];
    }, j = (o) => {
      var m;
      return ((m = P(o.field).find((R) => R.operator === o.operator)) == null ? void 0 : m.needs_value) ?? !1;
    }, F = g(() => {
      var o;
      return ((o = C.value) == null ? void 0 : o.target) === "main" && i.draft.value(kn) === !1;
    });
    function q(o) {
      return { main: ["--target", "main"], agent: ["--target", "agent", "--agent", `row:${o.agent_id}`], model: ["--target", "model", "--program", o.program, "--model", o.program_model] }[o.target];
    }
    const M = (o) => [o.field, o.operator, j(o) ? o.value : ""].filter(Boolean).join(" ");
    async function I(o) {
      const m = await e.run([...o, "--revision", s.value.revision, "--environment", e.environment]);
      return y.value = m.ok ? "" : m.error, await e.reload("assign"), m.ok;
    }
    function K(o, m) {
      var R;
      o.field = m, o.operator = ((R = P(m)[0]) == null ? void 0 : R.operator) ?? "", o.value = "";
    }
    async function _() {
      const o = ["assign-rule", "make", ...q(C.value), ...a.value.flatMap((m) => ["--condition", M(m)])];
      await I(o) && (a.value = [A()]);
    }
    const u = (o, m) => I(["assign-rule", "move", String(o.id), "--to", String(o.position + m)]), p = (o) => I(["assign-rule", o.enabled ? "disable" : "enable", String(o.id)]), B = (o) => I(["assign-rule", "delete", String(o.id)]), V = x(""), f = x(null), $ = x(""), T = () => a.value.map((o) => `--condition ${JSON.stringify(M(o))}`).join(" ");
    async function U() {
      const o = await e.read(`assign-rule try ${Number(V.value)} ${T()} --environment ${e.environment}`);
      y.value = o.ok ? "" : o.error, f.value = o.ok ? o.value : null;
    }
    async function z() {
      const o = await e.read(`assign-rule recent ${T()} --environment ${e.environment}`);
      y.value = o.ok ? "" : o.error, $.value = o.ok ? o.value.text : "";
    }
    return (o, m) => {
      var R;
      return l(), c("section", Ft, [
        s.value ? (l(), c(W, { key: 0 }, [
          d("div", qt, [
            (l(!0), c(W, null, D(s.value.targets, (n) => {
              var k, O;
              return l(), c("button", {
                key: n.key,
                type: "button",
                class: X(["target", { chosen: n.key === ((k = C.value) == null ? void 0 : k.key) }]),
                "aria-selected": n.key === ((O = C.value) == null ? void 0 : O.key),
                "data-assign-target": n.key,
                onClick: (Pn) => v.value = n.key
              }, [
                d("span", Mt, h(n.label), 1),
                d("span", Ut, h(n.description), 1),
                n.target === "agent" ? (l(), c("span", Wt, "State: " + h(n.running ? "running" : "kept") + " · Open tasks: " + h(n.open_tasks), 1)) : b("", !0),
                n.waiting ? (l(), c("span", Dt, h(n.waiting), 1)) : b("", !0)
              ], 10, Vt);
            }), 128))
          ]),
          d("div", Ht, [
            m[4] || (m[4] = d("p", { class: "note" }, "The rules are tried in order and the first match wins.", -1)),
            (l(!0), c(W, null, D(L.value, (n) => (l(), c("div", {
              key: n.id,
              class: X(["rule", { off: !n.enabled, warned: n.warning }]),
              "data-assign-rule": n.id
            }, [
              d("span", zt, h(n.position), 1),
              d("span", Gt, h(n.summary), 1),
              n.warning ? (l(), c("span", Yt, h(n.warning), 1)) : b("", !0),
              d("span", Xt, h(n.activity.text), 1),
              n.activity.last_skip ? (l(), c("span", Jt, "Last skipped: " + h(n.activity.last_skip), 1)) : b("", !0),
              t.readOnly ? b("", !0) : (l(), c("span", Zt, [
                d("button", {
                  type: "button",
                  title: "Move the rule up",
                  disabled: n.position === 1,
                  onClick: (k) => u(n, -1)
                }, "↑", 8, Qt),
                d("button", {
                  type: "button",
                  title: "Move the rule down",
                  disabled: n.position === s.value.rules.length,
                  onClick: (k) => u(n, 1)
                }, "↓", 8, en),
                d("button", {
                  type: "button",
                  title: n.enabled ? "Turn the rule off" : "Turn the rule on",
                  onClick: (k) => p(n)
                }, h(n.enabled ? "Turn off" : "Turn on"), 9, tn),
                d("button", {
                  type: "button",
                  title: "Delete the rule",
                  onClick: (k) => B(n)
                }, "Delete", 8, nn)
              ]))
            ], 10, Kt))), 128)),
            L.value.length ? b("", !0) : (l(), c("p", an, "No rules give tasks to " + h((R = C.value) == null ? void 0 : R.label) + " yet.", 1)),
            t.readOnly ? b("", !0) : (l(), c("form", {
              key: 1,
              class: "editor",
              "data-assign-editor": "",
              onSubmit: be(_, ["prevent"])
            }, [
              m[2] || (m[2] = d("p", { class: "all" }, "A task must meet all of these conditions:", -1)),
              (l(!0), c(W, null, D(a.value, (n, k) => (l(), c("div", {
                key: n.id,
                class: "condition"
              }, [
                d("select", {
                  value: n.field,
                  "aria-label": "Condition",
                  onChange: (O) => K(n, O.target.value)
                }, [
                  (l(!0), c(W, null, D(s.value.fields, (O) => (l(), c("option", {
                    key: O.field,
                    value: O.field
                  }, h(O.field === "any" ? "Any task" : O.field), 9, on))), 128))
                ], 40, sn),
                ae(d("select", {
                  "onUpdate:modelValue": (O) => n.operator = O,
                  "aria-label": "Comparison"
                }, [
                  (l(!0), c(W, null, D(P(n.field), (O) => (l(), c("option", {
                    key: O.operator,
                    value: O.operator
                  }, h(O.label), 9, rn))), 128))
                ], 8, ln), [
                  [Ae, n.operator]
                ]),
                j(n) ? ae((l(), c("input", {
                  key: 0,
                  "onUpdate:modelValue": (O) => n.value = O,
                  "aria-label": "Value",
                  placeholder: "For example: 4 or migration"
                }, null, 8, dn)), [
                  [ce, n.value]
                ]) : b("", !0),
                d("button", {
                  type: "button",
                  title: "Remove the condition",
                  disabled: a.value.length === 1,
                  onClick: (O) => a.value.splice(k, 1)
                }, "Remove", 8, un)
              ]))), 128)),
              d("button", {
                type: "button",
                onClick: m[0] || (m[0] = (n) => a.value.push(A()))
              }, "Add a condition"),
              F.value ? (l(), c("p", cn, "The main agent writes no code here, so a rule that gives it a task is skipped.")) : b("", !0),
              d("div", vn, [
                ae(d("input", {
                  "onUpdate:modelValue": m[1] || (m[1] = (n) => V.value = n),
                  type: "number",
                  min: "1",
                  "aria-label": "Task to try the rule on",
                  placeholder: "Task number",
                  "data-assign-trial-task": ""
                }, null, 512), [
                  [ce, V.value]
                ]),
                d("button", {
                  type: "button",
                  disabled: !V.value,
                  "data-assign-try": "",
                  onClick: U
                }, "Try on this task", 8, pn),
                d("button", {
                  type: "button",
                  "data-assign-count": "",
                  onClick: z
                }, "Count the last 20 tasks")
              ]),
              $.value ? (l(), c("p", fn, h($.value), 1)) : b("", !0),
              f.value ? (l(), c("div", mn, [
                d("p", gn, h(f.value.matches ? "The rule would match" : "The rule would not match") + " task " + h(f.value.task_id) + ". Nothing is assigned.", 1),
                (l(!0), c(W, null, D(f.value.conditions, (n) => (l(), c("p", {
                  key: n.label,
                  class: X(["said", { missed: !n.matched }])
                }, h(n.label) + ": " + h(n.matched ? "met" : "not met"), 3))), 128))
              ])) : b("", !0),
              m[3] || (m[3] = d("button", {
                type: "submit",
                class: "save"
              }, "Add the rule", -1))
            ], 32)),
            y.value ? (l(), c("p", yn, h(y.value), 1)) : b("", !0)
          ])
        ], 64)) : b("", !0)
      ]);
    };
  }
}, bn = /* @__PURE__ */ H(hn, [["__scopeId", "data-v-b9ca3259"]]), wn = { class: "screen" }, _n = { class: "rail" }, $n = {
  __name: "AgentSettingsScreen",
  props: { nodes: { type: Array, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 }, extras: { type: Object, default: () => ({}) }, found: { type: String, default: "" } },
  setup(t) {
    const i = t, e = x(null), s = g(() => ze(i.nodes));
    de(() => i.found, (y) => y && xe(() => {
      var w, A;
      return (A = (w = e.value) == null ? void 0 : w.querySelector(`[data-setting="${y}"]`)) == null ? void 0 : A.scrollIntoView({ block: "center" });
    }), { immediate: !0, flush: "post" });
    const v = (y) => {
      var w, A;
      return (A = (w = e.value) == null ? void 0 : w.querySelector(`[data-section="${y}"]`)) == null ? void 0 : A.scrollIntoView({ block: "start", behavior: "smooth" });
    };
    return (y, w) => (l(), c("div", wn, [
      d("nav", _n, [
        S(r(Ge), {
          sections: s.value,
          scope: e.value,
          onChoose: v
        }, null, 8, ["sections", "scope"])
      ]),
      d("div", {
        ref_key: "scroll",
        ref: e,
        class: "content"
      }, [
        Re(y.$slots, "before", {}, void 0, !0),
        S(r(_e), {
          nodes: t.nodes,
          draft: t.draft,
          "read-only": t.readOnly,
          extras: t.extras,
          found: t.found
        }, null, 8, ["nodes", "draft", "read-only", "extras", "found"])
      ], 512)
    ]));
  }
}, re = /* @__PURE__ */ H($n, [["__scopeId", "data-v-1cab27ca"]]), On = {
  key: 0,
  class: "hint",
  "data-work-hint": ""
}, Sn = {
  __name: "AgentSettingsTab",
  props: { tab: { type: String, required: !0 }, active: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, isLoaded: Boolean, nodes: { type: Function, required: !0 }, readOnly: Boolean, found: { type: String, default: "" }, nothingStarts: Boolean, advancedExtras: { type: Object, required: !0 } },
  setup(t) {
    return (i, e) => (l(), c("div", {
      class: X(["settings-body", { flush: t.tab === "agents" }])
    }, [
      S(r(Le), { tab: t.active }, {
        default: E(() => [
          S(r(we), { value: t.tab }, {
            work: E(() => [
              t.isLoaded ? (l(), N(re, {
                key: "work",
                nodes: t.nodes("work"),
                draft: t.draft,
                "read-only": t.readOnly,
                found: t.found,
                "data-agent-settings-work": ""
              }, {
                before: E(() => [
                  t.nothingStarts ? (l(), c("p", On, "With Auto off and no workers, nothing starts the work: a user starts tasks or turns one of them on.")) : b("", !0)
                ]),
                _: 1
              }, 8, ["nodes", "draft", "read-only", "found"])) : b("", !0)
            ]),
            agents: E(() => [
              S(Lt, { draft: t.draft }, null, 8, ["draft"])
            ]),
            assign: E(() => [
              S(bn, {
                draft: t.draft,
                "read-only": t.readOnly
              }, null, 8, ["draft", "read-only"])
            ]),
            tests: E(() => [
              t.isLoaded ? (l(), N(re, {
                key: "tests",
                nodes: t.nodes("tests"),
                draft: t.draft,
                "read-only": t.readOnly,
                found: t.found,
                "data-agent-settings-tests": ""
              }, null, 8, ["nodes", "draft", "read-only", "found"])) : b("", !0)
            ]),
            advanced: E(() => [
              t.isLoaded ? (l(), N(re, {
                key: "advanced",
                nodes: t.nodes("advanced"),
                draft: t.draft,
                "read-only": t.readOnly,
                found: t.found,
                extras: t.advancedExtras,
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
}, Cn = {
  class: "settings",
  "data-agent-settings": ""
}, Tn = { class: "head" }, An = {
  class: "env",
  "data-settings-environment": ""
}, xn = { class: "settings-bar" }, Rn = {
  key: 1,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, En = "journal.suites.coding.auto-mode", Nn = "journal.suites.coding.workers.main-dispatches-workers", In = 1200, Bn = {
  __name: "AgentSettings",
  setup(t) {
    const i = { work: "work-screen", tests: "tests-screen", advanced: "advanced-screen", "helper-types": "helper-types-screen" }, e = ee(), s = x("work"), v = [{ key: "work", label: "Work" }, { key: "agents", label: "Helpers", count_field: "full" }, { key: "assign", label: "Assign" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }], y = g(() => v.find((n) => n.key === s.value)), w = () => Object.values(i).map((n) => e.props[n].data.value), A = g(() => w().every(Boolean)), a = Ye({
      run: (n) => e.run(n),
      reload: async () => {
        const n = "type-screen.type" in e.state;
        await Promise.all([...Object.values(i).map((k) => e.reload(k)), e.reload("limits"), ...n ? [e.reload("type-screen")] : []]), a.load([...w(), ...n ? [e.props["type-screen"].data.value] : []]);
      }
    });
    de(w, (n) => {
      n.every(Boolean) && a.load(n);
    }, { immediate: !0 });
    const { rows: C } = Te(e, a), L = g(() => Tt(C.value)), P = g(() => L.value ? { full: `${L.value} full` } : {});
    Q(() => e.reload("limits"));
    const j = [{ key: "main", name: "Main agent" }, { key: "worker", name: "Workers" }, { key: "helper", name: "Read-only helpers" }], F = (n) => {
      var k;
      return ((k = C.value.find((O) => O.profile === n)) == null ? void 0 : k.name) ?? n;
    }, q = g(() => (a.value(Z) ?? []).map(Se).map(({ name: n, value: k }) => ({ name: F(n), value: k === "none" ? "no cap" : `${Number(k) / 1e3}k` }))), M = g(() => ({ "keyed-cap-table": { rows: j, sizes: ie, defaultCap: Number(a.value(ue)) || ie[0], ownCaps: q.value } })), I = (n) => {
      var k;
      return ((k = e.props[i[n]].data.value) == null ? void 0 : k.nodes) ?? [];
    }, K = g(() => a.value(En) === !1 && a.value(Nn) === !1), _ = g(() => !e.readOnly), u = x("main"), p = g(() => {
      var n;
      return ((n = e.props.work.data.value) == null ? void 0 : n.presets) ?? [];
    }), B = g(() => {
      var n;
      return ((n = e.props.work.data.value) == null ? void 0 : n.switches) ?? [];
    }), V = g(() => Object.fromEntries(B.value.map((n) => [n.key, a.value(n.key)]))), f = g(() => Xe(V.value, p.value)), $ = (n) => a.fill(p.value.find((k) => k.key === n).values), T = g(() => {
      var n;
      return ((n = e.props.find.data.value) == null ? void 0 : n.rows) ?? [];
    }), U = x("");
    let z = null;
    const o = (n) => n.startsWith("helper-type") ? "agents" : n;
    function m(n) {
      u.value = "main", R({ key: o(n.screen) }), U.value = n.key, clearTimeout(z), z = setTimeout(() => {
        U.value = "";
      }, In);
    }
    Ee(() => clearTimeout(z));
    function R(n) {
      s.value = n.key, e.state.tab = n.key === "agents" ? "agents" : "";
    }
    return (n, k) => (l(), N(r(Fe), { padding: "0" }, {
      default: E(() => [
        d("div", Cn, [
          S(r(we), { value: u.value }, {
            main: E(() => [
              d("div", Tn, [
                d("span", An, h(r(e).environment), 1)
              ]),
              p.value.length ? (l(), N(r(Je), {
                key: 0,
                presets: p.value,
                current: f.value,
                disabled: r(e).readOnly,
                onPick: $,
                onOpenPage: k[0] || (k[0] = (O) => u.value = "presets")
              }, {
                default: E(() => [
                  S(r(Ze), {
                    index: T.value,
                    onPick: m
                  }, null, 8, ["index"])
                ]),
                _: 1
              }, 8, ["presets", "current", "disabled"])) : b("", !0),
              d("div", xn, [
                S(r(qe), {
                  tabs: v,
                  active: y.value,
                  answer: P.value,
                  onChoose: R
                }, null, 8, ["active", "answer"])
              ]),
              r(e).readOnly ? (l(), c("p", Rn, "Only a user can change these settings. You can read every value, and ask a user for a change.")) : b("", !0),
              S(Sn, {
                tab: s.value,
                active: y.value,
                draft: r(a),
                "is-loaded": A.value,
                nodes: I,
                "read-only": r(e).readOnly,
                found: U.value,
                "nothing-starts": K.value,
                "advanced-extras": M.value
              }, null, 8, ["tab", "active", "draft", "is-loaded", "read-only", "found", "nothing-starts", "advanced-extras"])
            ]),
            presets: E(() => [
              S(lt, {
                presets: p.value,
                switches: B.value,
                now: V.value,
                "read-only": r(e).readOnly,
                onBack: k[1] || (k[1] = (O) => u.value = "main"),
                onFill: $
              }, null, 8, ["presets", "switches", "now", "read-only"])
            ]),
            _: 1
          }, 8, ["value"]),
          _.value ? (l(), N(r(Qe), {
            key: 0,
            changes: r(a).changes(),
            "can-save": r(a).canSave.value,
            pending: r(a).pending.value,
            reason: r(a).reason.value,
            environment: r(e).environment,
            onSave: k[2] || (k[2] = (O) => r(a).apply()),
            onCancel: k[3] || (k[3] = (O) => r(a).reset())
          }, null, 8, ["changes", "can-save", "pending", "reason", "environment"])) : b("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, Vn = /* @__PURE__ */ H(Bn, [["__scopeId", "data-v-f88ce405"]]);
export {
  Vn as A
};
