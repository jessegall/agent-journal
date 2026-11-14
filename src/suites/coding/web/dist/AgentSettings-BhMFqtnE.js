import { openBlock as n, createElementBlock as c, createElementVNode as u, Fragment as M, renderList as D, createBlock as L, unref as l, createVNode as C, withModifiers as _e, withCtx as B, createTextVNode as X, ref as E, computed as y, onMounted as ne, toDisplayString as k, createCommentVNode as _, normalizeClass as Q, watch as ce, withDirectives as oe, vModelSelect as xe, vModelText as pe, nextTick as Ne, renderSlot as Ee, onBeforeUnmount as Ie } from "vue";
import { TextInput as Be, Btn as ee, useWindow as J, useNow as je, agentTitle as Pe, age as Le, agentNumber as qe, TabBody as Fe, SwitchCase as $e, WindowRoom as Me, InnerTabs as Ve } from "@journal/window-kit";
import { SettingPresetCard as fe, SettingPresetCompareTable as Ue, SettingEmptyState as We, isFull as ge, SettingBackPath as De, SettingPerTypeOverrideRow as me, SettingsScreen as Se, SettingRow as ye, SettingEntryList as He, SettingThreeWayCap as Ke, SettingBanner as Ge, SettingHelperTypeTable as ze, sectionsOf as Ye, SettingSectionList as Xe, useSettingsDraft as Je, currentPreset as Ze, SettingPresetBand as Qe, FindBox as et, ChangeFoot as tt } from "@journal/setting-components";
import { _ as H } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const nt = {
  class: "page",
  "data-agent-settings-presets": ""
}, at = { class: "crumb" }, st = { class: "body" }, ot = { class: "cards" }, lt = "Any other mix of the eight switches. The form shows Custom as soon as the switches match neither preset.", rt = {
  __name: "AgentSettingsPresets",
  props: { presets: { type: Array, required: !0 }, switches: { type: Array, required: !0 }, now: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back", "fill"],
  setup(t, { emit: r }) {
    const e = r;
    return (a, p) => (n(), c("section", nt, [
      u("div", at, [
        u("button", {
          type: "button",
          class: "back",
          "data-presets-back": "",
          onClick: p[0] || (p[0] = (v) => e("back"))
        }, "‹ Back"),
        p[1] || (p[1] = u("b", null, "What is a preset?", -1))
      ]),
      u("div", st, [
        p[2] || (p[2] = u("p", { class: "lead" }, "A preset is a set of eight switches and nothing more. It is not a type of agent: the main agent is the same program under every preset, and a preset only fills in the switches below. Nothing is saved until you press Save.", -1)),
        u("div", ot, [
          (n(!0), c(M, null, D(t.presets, (v) => (n(), L(l(fe), {
            key: v.key,
            name: v.name,
            line: v.line,
            "can-fill": !t.readOnly,
            onFill: ($) => e("fill", v.key)
          }, null, 8, ["name", "line", "can-fill", "onFill"]))), 128)),
          C(l(fe), {
            name: "Custom",
            line: lt
          })
        ]),
        C(l(Ue), {
          rows: t.switches,
          presets: t.presets,
          now: t.now
        }, null, 8, ["rows", "presets", "now"])
      ])
    ]));
  }
}, it = /* @__PURE__ */ H(rt, [["__scopeId", "data-v-cf40939d"]]), ut = { class: "action-buttons" }, dt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(t) {
    return (r, e) => (n(), c("form", {
      "data-agent-retire-confirm": "",
      onSubmit: e[2] || (e[2] = _e((a) => r.$emit("submit"), ["prevent"]))
    }, [
      e[5] || (e[5] = u("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      C(l(Be), {
        "model-value": t.reason,
        label: "Reason",
        disabled: t.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": e[0] || (e[0] = (a) => r.$emit("update:reason", a))
      }, null, 8, ["model-value", "disabled"]),
      u("div", ut, [
        C(l(ee), {
          type: "submit",
          small: "",
          disabled: t.pending || !t.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: B(() => [...e[3] || (e[3] = [
            X("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        C(l(ee), {
          small: "",
          disabled: t.pending,
          onClick: e[1] || (e[1] = (a) => r.$emit("cancel"))
        }, {
          default: B(() => [...e[4] || (e[4] = [
            X("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ct = /* @__PURE__ */ H(dt, [["__scopeId", "data-v-92de7dd6"]]), vt = {
  class: "type-agents",
  "data-type-agents": ""
}, pt = { class: "models" }, ft = ["data-count-agent"], gt = { class: "person-text" }, mt = {
  key: 2,
  role: "alert",
  class: "bad"
}, yt = {
  key: 3,
  role: "status"
}, kt = {
  __name: "AgentTypeAgents",
  props: { role: { type: String, required: !0 }, profile: { type: String, default: "" } },
  emits: ["open-agent", "retired"],
  setup(t, { emit: r }) {
    const e = t, a = r, p = J(), v = je(), $ = E([]), A = E(0), d = E(!1), R = E(!1), h = E(""), T = E(""), w = E(null), I = E(""), U = y(() => $.value.filter((S) => {
      var g;
      return S.state !== "retired" && S.role === e.role && (!e.profile || (((g = S.facts) == null ? void 0 : g.profile) || S.profile) === e.profile);
    }).sort((S, g) => (S.state !== "running") - (g.state !== "running") || String(S.ended_at || S.created_at).localeCompare(String(g.ended_at || g.created_at)))), W = y(() => {
      var g;
      const S = /* @__PURE__ */ new Map();
      for (const b of U.value) {
        const j = ((g = b.facts) == null ? void 0 : g.model) || b.program_model;
        j && S.set(j, (S.get(j) || 0) + 1);
      }
      return [...S].map(([b, j]) => `${j} ${b}`).join(", ");
    });
    async function q(S = 1) {
      p.state["count-agents.role"] = e.role, e.profile ? p.state["count-agents.profile"] = e.profile : delete p.state["count-agents.profile"], p.state["count-agents.page"] = String(S), await p.reload("count-agents");
      const g = p.props["count-agents"];
      $.value = S === 1 ? [...g.rows.value] : [...$.value, ...g.rows.value], A.value = S, d.value = g.more.value;
    }
    async function G(S) {
      if (!I.value.trim() || R.value) return;
      R.value = !0;
      const g = await p.run(["agent", "retire", String(S.number), "--reason", I.value.trim()]);
      h.value = g.ok ? "" : "The agent could not be retired. Try again.", g.ok && (w.value = null, I.value = "", T.value = "Agent retired permanently.", a("retired"), await q()), R.value = !1;
    }
    return ne(() => q()), (S, g) => (n(), c("section", vt, [
      u("p", pt, k(W.value), 1),
      U.value.length ? _("", !0) : (n(), L(l(We), {
        key: 0,
        title: "No agents here yet",
        line: "An agent shows here as soon as one of this type starts."
      })),
      (n(!0), c(M, null, D(U.value, (b) => {
        var j, F, m, O;
        return n(), c("div", {
          key: b.id,
          class: "person",
          "data-count-agent": b.id
        }, [
          u("span", {
            class: Q(["dot", { running: b.state === "running" }])
          }, null, 2),
          u("div", gt, [
            u("strong", null, k(l(Pe)(b).text), 1),
            X(" " + k(b.state === "running" ? "Running" : "Idle") + ", " + k(l(Le)(b.state === "running" ? b.process_started_at || b.created_at : b.ended_at, l(v))) + " ", 1),
            u("small", null, k([b.program, (j = b.facts) == null ? void 0 : j.model, (F = b.facts) == null ? void 0 : F.effort, l(qe)(b)].filter(Boolean).join(", ")), 1),
            u("small", null, k(((m = b.facts) == null ? void 0 : m.task_title) || ((O = b.facts) == null ? void 0 : O.helper_job)), 1)
          ]),
          C(l(ee), {
            small: "",
            onClick: (N) => a("open-agent", b)
          }, {
            default: B(() => [...g[3] || (g[3] = [
              X("Open", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]),
          b.state === "idle" && !l(p).readOnly ? (n(), L(l(ee), {
            key: 0,
            small: "",
            onClick: (N) => {
              w.value = b.id, I.value = "";
            }
          }, {
            default: B(() => [...g[4] || (g[4] = [
              X("Retire", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])) : _("", !0),
          w.value === b.id ? (n(), L(ct, {
            key: 1,
            reason: I.value,
            "onUpdate:reason": g[0] || (g[0] = (N) => I.value = N),
            pending: R.value,
            onSubmit: (N) => G(b),
            onCancel: g[1] || (g[1] = (N) => w.value = null)
          }, null, 8, ["reason", "pending", "onSubmit"])) : _("", !0)
        ], 8, ft);
      }), 128)),
      d.value ? (n(), L(l(ee), {
        key: 1,
        small: "",
        onClick: g[2] || (g[2] = (b) => q(A.value + 1))
      }, {
        default: B(() => [...g[5] || (g[5] = [
          X("Show more", -1)
        ])]),
        _: 1
      })) : _("", !0),
      h.value ? (n(), c("p", mt, k(h.value), 1)) : T.value ? (n(), c("p", yt, k(T.value), 1)) : _("", !0)
    ]));
  }
}, ht = /* @__PURE__ */ H(kt, [["__scopeId", "data-v-67f17bfa"]]), Y = "journal.core.helpers", bt = `${Y}.context-limit-on`, ve = `${Y}.context-limit-tokens`, Oe = `${Y}.context-limit-kinds`, te = `${Y}.context-limit-profiles`, le = `${Y}.read-only-helper-profile-limits`, wt = `${Y}.read-only-helper-run-limit`, _t = `${Y}.read-only-helper-kept-limit`, re = "journal.suites.coding.workers.merge-hooks", $t = "none", Ce = (t) => `${t / 1e3}k`, Ae = (t) => {
  const r = t.lastIndexOf(":");
  return { name: t.slice(0, r).trim(), value: t.slice(r + 1).trim() };
}, Te = (t) => {
  const r = t.indexOf(":");
  return r < 0 ? { text: t, name: "", command: "" } : { text: t, name: t.slice(0, r).trim(), command: t.slice(r + 1).trim() };
}, St = (t, r) => (t ?? []).map(Te).filter((e) => e.name === r).map((e) => e.command), Ot = (t, r, e) => [
  ...(t ?? []).map(Te).filter((a) => a.name !== r).map((a) => a.text),
  ...e.map((a) => `${r}: ${a}`)
], se = (t, r) => {
  var e;
  return (e = (t ?? []).map(Ae).find((a) => a.name === r)) == null ? void 0 : e.value;
}, ke = (t) => t === $t ? "No cap" : Ce(Number(t));
function he(t, r, e) {
  if (t(bt) !== !0) return { text: "Off", where: "Context limit is off", own: !1 };
  const a = e ? se(t(te), e) : void 0;
  if (a !== void 0) return { text: ke(a), where: "Own value", own: !0 };
  const p = se(t(Oe), r);
  return p !== void 0 ? { text: ke(p), where: "Set for its type", own: !1 } : { text: Ce(Number(t(ve))), where: "Set for every agent", own: !1 };
}
const Ct = (t) => t > 0 ? t : null, At = { worker: "workers" }, ae = "merger", be = "designer";
function we(t, r, e, a, p, v = {}) {
  return { key: t, name: r, line: e, running: a.running, runLimit: a.run_limit, kept: a.kept, keptLimit: Ct(a.kept_limit), cap: p, ...v };
}
function Tt(t, r) {
  const e = t.filter((d) => !d.per_profile).map((d) => we(d.key, d.label, d.line, d, he(r, d.key, ""), { screen: At[d.key] ?? "read-only", role: d.key, profile: "", defaultProfile: d.default_profile })), a = t.find((d) => d.per_profile);
  if (!a) return e;
  const p = (d) => we(`${a.key}:${d.profile}`, d.title, d.line, d, he(r, a.key, d.profile), { screen: d.group === ae ? ae : "read-only", role: a.key, profile: d.profile }), v = a.profiles.filter((d) => d.group === ae || d.group === be).map(p), $ = a.profiles.filter((d) => d.group !== ae && d.group !== be).map((d) => ({ ...p(d), indent: !0 })), A = { key: a.key, name: "Read-only helpers", group: !0, screen: "read-only", role: a.key, profile: "", line: `${a.running} running, ${a.kept} kept. Every profile runs up to ${a.run_limit} and keeps ${a.kept_limit ? `up to ${a.kept_limit}` : "any number"} unless the profile sets other limits.` };
  return [...e, ...v, A, ...$];
}
const de = Array.from({ length: 10 }, (t, r) => (r + 1) * 1e5), Rt = (t) => t.filter((r) => !r.group && (ge(r.running, r.runLimit) || ge(r.kept, r.keptLimit ?? 0))).length;
function Re(t, r) {
  const e = y(() => t.props.limits.rows.value ?? []), a = y(() => Tt(e.value, r.value)), p = y(() => !!t.props.limits.failure.value);
  return { rows: a, unreadable: p, reread: () => t.reload("limits") };
}
const xt = {
  class: "type",
  "data-agent-type-screen": ""
}, Nt = { class: "typebody" }, Et = {
  class: "typemain",
  "data-type-settings": ""
}, It = { class: "typeside" }, ie = "none", Bt = "worker", jt = {
  __name: "AgentSettingsTypeScreen",
  props: { row: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back"],
  setup(t, { emit: r }) {
    const e = t, a = r, p = J(), v = y(() => p.props["type-screen"].data.value), $ = y(() => {
      var m;
      return ((m = v.value) == null ? void 0 : m.nodes) ?? [];
    }), A = y(() => e.row.profile !== "");
    async function d() {
      p.state["type-screen.type"] = e.row.screen, await p.reload("type-screen");
    }
    ce(v, (m) => {
      m && e.draft.load([m]);
    }), ne(d);
    const R = y(() => (e.draft.value(le) ?? []).map((m) => m.split(":"))), h = y(() => R.value.find((m) => m[0] === e.row.profile)), T = y(() => ({ running: Number(e.draft.value(wt)), kept: Number(e.draft.value(_t)) })), w = (m) => h.value ? Number(h.value[m === "running" ? 1 : 2]) : null;
    function I(m, O) {
      const N = R.value.filter((o) => o[0] !== e.row.profile).map((o) => o.join(":"));
      if (O === null) return e.draft.set(le, N);
      if (O === "") return;
      const K = m === "running" ? O : w("running") ?? T.value.running, Z = m === "kept" ? O : w("kept") ?? T.value.kept;
      e.draft.set(le, [...N, `${e.row.profile}:${K}:${Z}`]);
    }
    const U = y(() => e.row.group ? "" : e.row.profile || e.row.defaultProfile || ""), W = y(() => se(e.draft.value(te), U.value)), q = y(() => W.value === void 0 ? "kind" : W.value === ie ? "none" : "own"), G = y(() => {
      const m = se(e.draft.value(Oe), e.row.role);
      return m === ie ? null : Number(m ?? e.draft.value(ve));
    });
    function S({ mode: m, size: O }) {
      const N = (e.draft.value(te) ?? []).filter((K) => K.slice(0, K.lastIndexOf(":")).trim() !== U.value);
      e.draft.set(te, m === "kind" ? N : [...N, `${U.value}:${m === "none" ? ie : O}`]);
    }
    const g = y(() => e.row.role === Bt ? U.value : ""), b = y(() => St(e.draft.value(re), g.value)), j = (m) => e.draft.set(re, Ot(e.draft.value(re), g.value, m)), F = (m) => p.open("agents.agents", m.id);
    return (m, O) => (n(), c("div", xt, [
      C(l(De), {
        parent: "Helpers",
        current: t.row.name,
        onBack: O[0] || (O[0] = (N) => a("back"))
      }, null, 8, ["current"]),
      u("div", Nt, [
        u("div", Et, [
          A.value && t.row.screen === "read-only" ? (n(), c(M, { key: 0 }, [
            C(l(me), {
              label: "Running",
              help: "Agents of this profile that run at once.",
              "every-value": T.value.running,
              "own-value": w("running"),
              disabled: t.readOnly,
              "data-override-running": "",
              "onUpdate:ownValue": O[1] || (O[1] = (N) => I("running", N))
            }, null, 8, ["every-value", "own-value", "disabled"]),
            C(l(me), {
              label: "Kept",
              help: "Agents of this profile kept until retired, running or idle. At 0 there is no limit.",
              "every-value": T.value.kept,
              "own-value": w("kept"),
              disabled: t.readOnly,
              "data-override-kept": "",
              "onUpdate:ownValue": O[2] || (O[2] = (N) => I("kept", N))
            }, null, 8, ["every-value", "own-value", "disabled"])
          ], 64)) : (n(), L(l(Se), {
            key: 1,
            nodes: $.value,
            draft: t.draft,
            "read-only": t.readOnly
          }, null, 8, ["nodes", "draft", "read-only"])),
          g.value ? (n(), L(l(ye), {
            key: 2,
            label: "When merged",
            help: "Commands run in the main checkout after a worker of this profile is merged. One that fails is told to the main agent; the merge stands.",
            source: b.value.length ? "own" : "default",
            "data-merge-hooks": ""
          }, {
            default: B(() => [
              C(l(He), {
                "model-value": b.value,
                placeholder: "a command",
                disabled: t.readOnly,
                "onUpdate:modelValue": j
              }, null, 8, ["model-value", "disabled"])
            ]),
            _: 1
          }, 8, ["source"])) : _("", !0),
          U.value ? (n(), L(l(ye), {
            key: 3,
            label: "Context cap",
            help: "The context size at which this type is compacted.",
            source: q.value === "own" || q.value === "none" ? "own" : "default",
            "data-context-cap": ""
          }, {
            default: B(() => [
              C(l(Ke), {
                mode: q.value,
                "kind-value": G.value,
                "own-value": q.value === "own" ? Number(W.value) : null,
                sizes: l(de),
                disabled: t.readOnly,
                onChange: S
              }, null, 8, ["mode", "kind-value", "own-value", "sizes", "disabled"])
            ]),
            _: 1
          }, 8, ["source"])) : _("", !0)
        ]),
        u("aside", It, [
          O[3] || (O[3] = u("h3", null, "Agents", -1)),
          C(ht, {
            role: t.row.role,
            profile: t.row.profile,
            onOpenAgent: F
          }, null, 8, ["role", "profile"])
        ])
      ])
    ]));
  }
}, Pt = /* @__PURE__ */ H(jt, [["__scopeId", "data-v-3bc929c1"]]), Lt = {
  class: "agents",
  "data-agent-settings-agents": ""
}, qt = {
  __name: "AgentSettingsAgents",
  props: { draft: { type: Object, required: !0 } },
  setup(t) {
    const r = t, e = J(), { rows: a, unreadable: p, reread: v } = Re(e, r.draft), $ = E(null);
    ne(v);
    const A = (d) => {
      $.value = a.value.find((R) => R.key === d);
    };
    return (d, R) => (n(), c("section", Lt, [
      $.value ? (n(), L(Pt, {
        key: 0,
        row: $.value,
        draft: t.draft,
        "read-only": l(e).readOnly,
        onBack: R[0] || (R[0] = (h) => $.value = null)
      }, null, 8, ["row", "draft", "read-only"])) : l(p) ? (n(), L(l(Ge), {
        key: 1,
        kind: "unreadable",
        text: "The counts could not be read.",
        onRetry: l(v)
      }, null, 8, ["onRetry"])) : (n(), L(l(ze), {
        key: 2,
        rows: l(a),
        onOpen: A
      }, null, 8, ["rows"]))
    ]));
  }
}, Ft = /* @__PURE__ */ H(qt, [["__scopeId", "data-v-05cc036a"]]), Mt = {
  class: "activity",
  "data-assign-activity": ""
}, Vt = {
  key: 0,
  class: "activity",
  "data-assign-last-skip": ""
}, Ut = {
  __name: "AssignRuleActivity",
  props: { activity: { type: Object, required: !0 } },
  setup(t) {
    return (r, e) => (n(), c(M, null, [
      u("span", Mt, k(t.activity.text), 1),
      t.activity.last_skip ? (n(), c("span", Vt, "Last skipped: " + k(t.activity.last_skip), 1)) : _("", !0)
    ], 64));
  }
}, Wt = /* @__PURE__ */ H(Ut, [["__scopeId", "data-v-51520c3a"]]), Dt = {
  class: "changes",
  "data-assign-task-change": ""
}, Ht = ["title", "data-assign-change", "onClick"], Kt = {
  key: 0,
  class: "listing",
  "data-assign-listing": ""
}, Gt = { class: "heading" }, zt = ["disabled"], Yt = {
  __name: "AssignRuleTaskChange",
  props: { rule: { type: Object, required: !0 }, revision: { type: String, required: !0 } },
  emits: ["changed", "failed"],
  setup(t, { emit: r }) {
    const e = t, a = r, p = J(), v = E(null), $ = [
      { verb: "apply", label: "Apply now", title: "List the free tasks the rule would give now" },
      { verb: "reassign", label: "Move its tasks", title: "List the waiting tasks the rule gave that would move to its target" },
      { verb: "give-back", label: "Give back its tasks", title: "List the waiting tasks the rule gave that would be free again" }
    ];
    async function A(h, T) {
      const w = ["assign-rule", h, String(e.rule.id), ...T ? ["--change"] : [], "--revision", e.revision, "--environment", p.environment], I = await p.run(w);
      return I.ok || a("failed", I.error), I;
    }
    async function d(h) {
      const T = await A(h, !1);
      v.value = T.ok ? { verb: h, tasks: T.value.tasks, text: T.value.text } : null;
    }
    async function R() {
      await A(v.value.verb, !0), v.value = null, a("changed");
    }
    return (h, T) => (n(), c(M, null, [
      u("span", Dt, [
        (n(), c(M, null, D($, (w) => u("button", {
          key: w.verb,
          type: "button",
          title: w.title,
          "data-assign-change": w.verb,
          onClick: (I) => d(w.verb)
        }, k(w.label), 9, Ht)), 64))
      ]),
      v.value ? (n(), c("div", Kt, [
        u("p", Gt, "Tasks: " + k(v.value.tasks.length) + ". Nothing changes until you confirm.", 1),
        (n(!0), c(M, null, D(v.value.tasks, (w) => (n(), c("p", {
          key: w.task_id,
          class: "task"
        }, "Task " + k(w.task_id) + ", " + k(w.title) + ": " + k(w.target), 1))), 128)),
        u("button", {
          type: "button",
          disabled: !v.value.tasks.length,
          "data-assign-confirm": "",
          onClick: R
        }, "Change these tasks", 8, zt),
        u("button", {
          type: "button",
          onClick: T[0] || (T[0] = (w) => v.value = null)
        }, "Cancel")
      ])) : _("", !0)
    ], 64));
  }
}, Xt = /* @__PURE__ */ H(Yt, [["__scopeId", "data-v-a0c23201"]]), Jt = {
  class: "assign",
  "data-agent-settings-assign": ""
}, Zt = {
  class: "targets",
  role: "listbox",
  "aria-label": "Give tasks to"
}, Qt = ["aria-selected", "data-assign-target", "onClick"], en = { class: "name" }, tn = { class: "facts" }, nn = {
  key: 0,
  class: "facts"
}, an = {
  key: 1,
  class: "facts",
  "data-assign-waiting": ""
}, sn = { class: "rules" }, on = ["data-assign-rule"], ln = { class: "place" }, rn = { class: "summary" }, un = {
  key: 0,
  class: "warning",
  "data-assign-warning": ""
}, dn = { class: "actions" }, cn = ["disabled", "onClick"], vn = ["disabled", "onClick"], pn = ["title", "onClick"], fn = ["onClick"], gn = {
  key: 0,
  class: "empty"
}, mn = ["value", "onChange"], yn = ["value"], kn = ["onUpdate:modelValue"], hn = ["value"], bn = ["onUpdate:modelValue"], wn = ["disabled", "onClick"], _n = {
  key: 0,
  class: "warning",
  "data-assign-main-warning": ""
}, $n = { class: "trial" }, Sn = ["disabled"], On = {
  key: 1,
  class: "verdict",
  "data-assign-recent": ""
}, Cn = {
  key: 2,
  class: "trial-result",
  "data-assign-trial": ""
}, An = { class: "verdict" }, Tn = {
  key: 2,
  class: "failure",
  role: "alert",
  "data-assign-failure": ""
}, Rn = "journal.suites.coding.main-writes-code", xn = {
  __name: "AgentSettingsAssign",
  props: { draft: { type: Object, required: !0 }, readOnly: Boolean },
  setup(t) {
    const r = t, e = J(), a = y(() => e.props.assign.data.value), p = E("main"), v = E("");
    let $ = 0;
    const A = () => ({ id: ++$, field: "complexity", operator: "minimum", value: "" }), d = E([A()]);
    ne(() => e.reload("assign"));
    const R = y(() => {
      var o, f;
      return ((o = a.value) == null ? void 0 : o.targets.find((P) => P.key === p.value)) ?? ((f = a.value) == null ? void 0 : f.targets[0]);
    }), h = y(() => {
      var o;
      return (((o = a.value) == null ? void 0 : o.rules) ?? []).filter((f) => {
        var P;
        return f.target_key === ((P = R.value) == null ? void 0 : P.key);
      });
    }), T = (o) => {
      var f, P;
      return ((P = (f = a.value) == null ? void 0 : f.fields.find((i) => i.field === o)) == null ? void 0 : P.operators) ?? [];
    }, w = (o) => {
      var f;
      return ((f = T(o.field).find((P) => P.operator === o.operator)) == null ? void 0 : f.needs_value) ?? !1;
    }, I = y(() => {
      var o;
      return ((o = R.value) == null ? void 0 : o.target) === "main" && r.draft.value(Rn) === !1;
    });
    function U(o) {
      return { main: ["--target", "main"], agent: ["--target", "agent", "--agent", `row:${o.agent_id}`], model: ["--target", "model", "--program", o.program, "--model", o.program_model] }[o.target];
    }
    const W = (o) => [o.field, o.operator, w(o) ? o.value : ""].filter(Boolean).join(" ");
    async function q(o) {
      const f = await e.run([...o, "--revision", a.value.revision, "--environment", e.environment]);
      return v.value = f.ok ? "" : f.error, await e.reload("assign"), f.ok;
    }
    function G(o, f) {
      var P;
      o.field = f, o.operator = ((P = T(f)[0]) == null ? void 0 : P.operator) ?? "", o.value = "";
    }
    async function S() {
      const o = ["assign-rule", "make", ...U(R.value), ...d.value.flatMap((f) => ["--condition", W(f)])];
      await q(o) && (d.value = [A()]);
    }
    const g = (o, f) => q(["assign-rule", "move", String(o.id), "--to", String(o.position + f)]), b = (o) => q(["assign-rule", o.enabled ? "disable" : "enable", String(o.id)]), j = (o) => q(["assign-rule", "delete", String(o.id)]), F = E(""), m = E(null), O = E(""), N = () => d.value.map((o) => `--condition ${JSON.stringify(W(o))}`).join(" ");
    async function K() {
      const o = await e.read(`assign-rule try ${Number(F.value)} ${N()} --environment ${e.environment}`);
      v.value = o.ok ? "" : o.error, m.value = o.ok ? o.value : null;
    }
    async function Z() {
      const o = await e.read(`assign-rule recent ${N()} --environment ${e.environment}`);
      v.value = o.ok ? "" : o.error, O.value = o.ok ? o.value.text : "";
    }
    return (o, f) => {
      var P;
      return n(), c("section", Jt, [
        a.value ? (n(), c(M, { key: 0 }, [
          u("div", Zt, [
            (n(!0), c(M, null, D(a.value.targets, (i) => {
              var V, s;
              return n(), c("button", {
                key: i.key,
                type: "button",
                class: Q(["target", { chosen: i.key === ((V = R.value) == null ? void 0 : V.key) }]),
                "aria-selected": i.key === ((s = R.value) == null ? void 0 : s.key),
                "data-assign-target": i.key,
                onClick: (x) => p.value = i.key
              }, [
                u("span", en, k(i.label), 1),
                u("span", tn, k(i.description), 1),
                i.target === "agent" ? (n(), c("span", nn, "State: " + k(i.running ? "running" : "kept") + " · Open tasks: " + k(i.open_tasks), 1)) : _("", !0),
                i.waiting ? (n(), c("span", an, k(i.waiting), 1)) : _("", !0)
              ], 10, Qt);
            }), 128))
          ]),
          u("div", sn, [
            f[6] || (f[6] = u("p", { class: "note" }, "The rules are tried in order and the first match wins.", -1)),
            (n(!0), c(M, null, D(h.value, (i) => (n(), c("div", {
              key: i.id,
              class: Q(["rule", { off: !i.enabled, warned: i.warning }]),
              "data-assign-rule": i.id
            }, [
              u("span", ln, k(i.position), 1),
              u("span", rn, k(i.summary), 1),
              i.warning ? (n(), c("span", un, k(i.warning), 1)) : _("", !0),
              C(Wt, {
                activity: i.activity
              }, null, 8, ["activity"]),
              t.readOnly ? _("", !0) : (n(), c(M, { key: 1 }, [
                u("span", dn, [
                  u("button", {
                    type: "button",
                    title: "Move the rule up",
                    disabled: i.position === 1,
                    onClick: (V) => g(i, -1)
                  }, "↑", 8, cn),
                  u("button", {
                    type: "button",
                    title: "Move the rule down",
                    disabled: i.position === a.value.rules.length,
                    onClick: (V) => g(i, 1)
                  }, "↓", 8, vn),
                  u("button", {
                    type: "button",
                    title: i.enabled ? "Turn the rule off" : "Turn the rule on",
                    onClick: (V) => b(i)
                  }, k(i.enabled ? "Turn off" : "Turn on"), 9, pn),
                  u("button", {
                    type: "button",
                    title: "Delete the rule",
                    onClick: (V) => j(i)
                  }, "Delete", 8, fn)
                ]),
                C(Xt, {
                  rule: i,
                  revision: a.value.revision,
                  onChanged: f[0] || (f[0] = (V) => l(e).reload("assign")),
                  onFailed: f[1] || (f[1] = (V) => v.value = V)
                }, null, 8, ["rule", "revision"])
              ], 64))
            ], 10, on))), 128)),
            h.value.length ? _("", !0) : (n(), c("p", gn, "No rules give tasks to " + k((P = R.value) == null ? void 0 : P.label) + " yet.", 1)),
            t.readOnly ? _("", !0) : (n(), c("form", {
              key: 1,
              class: "editor",
              "data-assign-editor": "",
              onSubmit: _e(S, ["prevent"])
            }, [
              f[4] || (f[4] = u("p", { class: "all" }, "A task must meet all of these conditions:", -1)),
              (n(!0), c(M, null, D(d.value, (i, V) => (n(), c("div", {
                key: i.id,
                class: "condition"
              }, [
                u("select", {
                  value: i.field,
                  "aria-label": "Condition",
                  onChange: (s) => G(i, s.target.value)
                }, [
                  (n(!0), c(M, null, D(a.value.fields, (s) => (n(), c("option", {
                    key: s.field,
                    value: s.field
                  }, k(s.field === "any" ? "Any task" : s.field), 9, yn))), 128))
                ], 40, mn),
                oe(u("select", {
                  "onUpdate:modelValue": (s) => i.operator = s,
                  "aria-label": "Comparison"
                }, [
                  (n(!0), c(M, null, D(T(i.field), (s) => (n(), c("option", {
                    key: s.operator,
                    value: s.operator
                  }, k(s.label), 9, hn))), 128))
                ], 8, kn), [
                  [xe, i.operator]
                ]),
                w(i) ? oe((n(), c("input", {
                  key: 0,
                  "onUpdate:modelValue": (s) => i.value = s,
                  "aria-label": "Value",
                  placeholder: "For example: 4 or migration"
                }, null, 8, bn)), [
                  [pe, i.value]
                ]) : _("", !0),
                u("button", {
                  type: "button",
                  title: "Remove the condition",
                  disabled: d.value.length === 1,
                  onClick: (s) => d.value.splice(V, 1)
                }, "Remove", 8, wn)
              ]))), 128)),
              u("button", {
                type: "button",
                onClick: f[2] || (f[2] = (i) => d.value.push(A()))
              }, "Add a condition"),
              I.value ? (n(), c("p", _n, "The main agent writes no code here, so a rule that gives it a task is skipped.")) : _("", !0),
              u("div", $n, [
                oe(u("input", {
                  "onUpdate:modelValue": f[3] || (f[3] = (i) => F.value = i),
                  type: "number",
                  min: "1",
                  "aria-label": "Task number for the trial",
                  placeholder: "Task number",
                  "data-assign-trial-task": ""
                }, null, 512), [
                  [pe, F.value]
                ]),
                u("button", {
                  type: "button",
                  disabled: !F.value,
                  "data-assign-try": "",
                  onClick: K
                }, "Try on this task", 8, Sn),
                u("button", {
                  type: "button",
                  "data-assign-count": "",
                  onClick: Z
                }, "Count the last 20 tasks")
              ]),
              O.value ? (n(), c("p", On, k(O.value), 1)) : _("", !0),
              m.value ? (n(), c("div", Cn, [
                u("p", An, k(m.value.matches ? "The rule would match" : "The rule would not match") + " task " + k(m.value.task_id) + ". Nothing is assigned.", 1),
                (n(!0), c(M, null, D(m.value.conditions, (i) => (n(), c("p", {
                  key: i.label,
                  class: Q(["said", { missed: !i.matched }])
                }, k(i.label) + ": " + k(i.matched ? "met" : "not met"), 3))), 128))
              ])) : _("", !0),
              f[5] || (f[5] = u("button", {
                type: "submit",
                class: "save"
              }, "Add the rule", -1))
            ], 32)),
            v.value ? (n(), c("p", Tn, k(v.value), 1)) : _("", !0)
          ])
        ], 64)) : _("", !0)
      ]);
    };
  }
}, Nn = /* @__PURE__ */ H(xn, [["__scopeId", "data-v-7f403ea3"]]), En = { class: "screen" }, In = { class: "rail" }, Bn = {
  __name: "AgentSettingsScreen",
  props: { nodes: { type: Array, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 }, extras: { type: Object, default: () => ({}) }, found: { type: String, default: "" } },
  setup(t) {
    const r = t, e = E(null), a = y(() => Ye(r.nodes));
    ce(() => r.found, (v) => v && Ne(() => {
      var $, A;
      return (A = ($ = e.value) == null ? void 0 : $.querySelector(`[data-setting="${v}"]`)) == null ? void 0 : A.scrollIntoView({ block: "center" });
    }), { immediate: !0, flush: "post" });
    const p = (v) => {
      var $, A;
      return (A = ($ = e.value) == null ? void 0 : $.querySelector(`[data-section="${v}"]`)) == null ? void 0 : A.scrollIntoView({ block: "start", behavior: "smooth" });
    };
    return (v, $) => (n(), c("div", En, [
      u("nav", In, [
        C(l(Xe), {
          sections: a.value,
          scope: e.value,
          onChoose: p
        }, null, 8, ["sections", "scope"])
      ]),
      u("div", {
        ref_key: "scroll",
        ref: e,
        class: "content"
      }, [
        Ee(v.$slots, "before", {}, void 0, !0),
        C(l(Se), {
          nodes: t.nodes,
          draft: t.draft,
          "read-only": t.readOnly,
          extras: t.extras,
          found: t.found
        }, null, 8, ["nodes", "draft", "read-only", "extras", "found"])
      ], 512)
    ]));
  }
}, ue = /* @__PURE__ */ H(Bn, [["__scopeId", "data-v-1cab27ca"]]), jn = {
  key: 0,
  class: "hint",
  "data-work-hint": ""
}, Pn = {
  __name: "AgentSettingsTab",
  props: { tab: { type: String, required: !0 }, active: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, isReady: Boolean, nodes: { type: Function, required: !0 }, readOnly: Boolean, found: { type: String, default: "" }, nothingStarts: Boolean, advancedExtras: { type: Object, required: !0 } },
  setup(t) {
    return (r, e) => (n(), c("div", {
      class: Q(["settings-body", { flush: t.tab === "agents" }])
    }, [
      C(l(Fe), { tab: t.active }, {
        default: B(() => [
          C(l($e), { value: t.tab }, {
            work: B(() => [
              t.isReady ? (n(), L(ue, {
                key: "work",
                nodes: t.nodes("work"),
                draft: t.draft,
                "read-only": t.readOnly,
                found: t.found,
                "data-agent-settings-work": ""
              }, {
                before: B(() => [
                  t.nothingStarts ? (n(), c("p", jn, "With Auto off and no workers, nothing starts the work: a user starts tasks or turns one of them on.")) : _("", !0)
                ]),
                _: 1
              }, 8, ["nodes", "draft", "read-only", "found"])) : _("", !0)
            ]),
            agents: B(() => [
              C(Ft, { draft: t.draft }, null, 8, ["draft"])
            ]),
            assign: B(() => [
              C(Nn, {
                draft: t.draft,
                "read-only": t.readOnly
              }, null, 8, ["draft", "read-only"])
            ]),
            tests: B(() => [
              t.isReady ? (n(), L(ue, {
                key: "tests",
                nodes: t.nodes("tests"),
                draft: t.draft,
                "read-only": t.readOnly,
                found: t.found,
                "data-agent-settings-tests": ""
              }, null, 8, ["nodes", "draft", "read-only", "found"])) : _("", !0)
            ]),
            advanced: B(() => [
              t.isReady ? (n(), L(ue, {
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
}, Ln = {
  class: "settings",
  "data-agent-settings": ""
}, qn = { class: "head" }, Fn = {
  class: "env",
  "data-settings-environment": ""
}, Mn = {
  key: 1,
  class: "settings-bar"
}, Vn = {
  key: 2,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, Un = "journal.suites.coding.auto-mode", Wn = "journal.suites.coding.workers.main-dispatches-workers", Dn = 1200, Hn = {
  __name: "AgentSettings",
  setup(t) {
    const r = { work: "work-screen", tests: "tests-screen", advanced: "advanced-screen", "helper-types": "helper-types-screen" }, e = J(), a = [{ key: "work", label: "Work" }, { key: "agents", label: "Helpers", count_field: "full" }, { key: "assign", label: "Assign" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }], p = e.option("sections").value, v = p ? a.filter((s) => p.includes(s.key)) : a, $ = E(v[0].key), A = y(() => v.find((s) => s.key === $.value)), d = () => Object.values(r).map((s) => e.props[s].data.value), R = y(() => d().every(Boolean)), h = Je({
      run: (s) => e.run(s),
      reload: async () => {
        const s = "type-screen.type" in e.state;
        await Promise.all([...Object.values(r).map((x) => e.reload(x)), e.reload("limits"), ...s ? [e.reload("type-screen")] : []]), h.load([...d(), ...s ? [e.props["type-screen"].data.value] : []]);
      }
    });
    ce(d, (s) => {
      s.every(Boolean) && h.load(s);
    }, { immediate: !0 });
    const { rows: T } = Re(e, h), w = y(() => Rt(T.value)), I = y(() => w.value ? { full: `${w.value} full` } : {});
    ne(() => e.reload("limits"));
    const U = [{ key: "main", name: "Main agent" }, { key: "worker", name: "Workers" }, { key: "helper", name: "Read-only helpers" }], W = (s) => {
      var x;
      return ((x = T.value.find((z) => z.profile === s)) == null ? void 0 : x.name) ?? s;
    }, q = y(() => (h.value(te) ?? []).map(Ae).map(({ name: s, value: x }) => ({ name: W(s), value: x === "none" ? "no cap" : `${Number(x) / 1e3}k` }))), G = y(() => ({ "keyed-cap-table": { rows: U, sizes: de, defaultCap: Number(h.value(ve)) || de[0], ownCaps: q.value } })), S = (s) => {
      var x;
      return ((x = e.props[r[s]].data.value) == null ? void 0 : x.nodes) ?? [];
    }, g = y(() => h.value(Un) === !1 && h.value(Wn) === !1), b = y(() => !e.readOnly), j = E("main"), F = y(() => {
      var s;
      return ((s = e.props.work.data.value) == null ? void 0 : s.presets) ?? [];
    }), m = y(() => {
      var s;
      return ((s = e.props.work.data.value) == null ? void 0 : s.switches) ?? [];
    }), O = y(() => Object.fromEntries(m.value.map((s) => [s.key, h.value(s.key)]))), N = y(() => Ze(O.value, F.value)), K = (s) => h.fill(F.value.find((x) => x.key === s).values), Z = y(() => {
      var s;
      return ((s = e.props.find.data.value) == null ? void 0 : s.rows) ?? [];
    }), o = E("");
    let f = null;
    const P = (s) => s.startsWith("helper-type") ? "agents" : s;
    function i(s) {
      j.value = "main", V({ key: P(s.screen) }), o.value = s.key, clearTimeout(f), f = setTimeout(() => {
        o.value = "";
      }, Dn);
    }
    Ie(() => clearTimeout(f));
    function V(s) {
      $.value = s.key, e.state.tab = s.key === "agents" ? "agents" : "";
    }
    return (s, x) => (n(), L(l(Me), { padding: "0" }, {
      default: B(() => [
        u("div", Ln, [
          C(l($e), { value: j.value }, {
            main: B(() => [
              u("div", qn, [
                u("span", Fn, k(l(e).environment), 1)
              ]),
              F.value.length && l(v).some((z) => z.key === "work") ? (n(), L(l(Qe), {
                key: 0,
                presets: F.value,
                current: N.value,
                disabled: l(e).readOnly,
                onPick: K,
                onOpenPage: x[0] || (x[0] = (z) => j.value = "presets")
              }, {
                default: B(() => [
                  C(l(et), {
                    index: Z.value,
                    onPick: i
                  }, null, 8, ["index"])
                ]),
                _: 1
              }, 8, ["presets", "current", "disabled"])) : _("", !0),
              l(v).length > 1 ? (n(), c("div", Mn, [
                C(l(Ve), {
                  tabs: l(v),
                  active: A.value,
                  answer: I.value,
                  onChoose: V
                }, null, 8, ["tabs", "active", "answer"])
              ])) : _("", !0),
              l(e).readOnly ? (n(), c("p", Vn, "Only a user can change these settings. You can read every value, and ask a user for a change.")) : _("", !0),
              C(Pn, {
                tab: $.value,
                active: A.value,
                draft: l(h),
                "is-ready": R.value,
                nodes: S,
                "read-only": l(e).readOnly,
                found: o.value,
                "nothing-starts": g.value,
                "advanced-extras": G.value
              }, null, 8, ["tab", "active", "draft", "is-ready", "read-only", "found", "nothing-starts", "advanced-extras"])
            ]),
            presets: B(() => [
              C(it, {
                presets: F.value,
                switches: m.value,
                now: O.value,
                "read-only": l(e).readOnly,
                onBack: x[1] || (x[1] = (z) => j.value = "main"),
                onFill: K
              }, null, 8, ["presets", "switches", "now", "read-only"])
            ]),
            _: 1
          }, 8, ["value"]),
          b.value ? (n(), L(l(tt), {
            key: 0,
            changes: l(h).changes(),
            "can-save": l(h).canSave.value,
            pending: l(h).pending.value,
            reason: l(h).reason.value,
            environment: l(e).environment,
            onSave: x[2] || (x[2] = (z) => l(h).apply()),
            onCancel: x[3] || (x[3] = (z) => l(h).reset())
          }, null, 8, ["changes", "can-save", "pending", "reason", "environment"])) : _("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, Xn = /* @__PURE__ */ H(Hn, [["__scopeId", "data-v-1a389575"]]);
export {
  Xn as A
};
