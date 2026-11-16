import { openBlock as n, createElementBlock as c, createElementVNode as u, Fragment as V, renderList as D, createBlock as B, unref as l, createVNode as A, withModifiers as we, withCtx as I, createTextVNode as X, ref as x, computed as y, onMounted as te, toDisplayString as k, createCommentVNode as w, normalizeClass as Z, watch as ce, withDirectives as oe, vModelSelect as Re, vModelText as fe, nextTick as xe, renderSlot as Ee, onBeforeUnmount as Ne } from "vue";
import { TextInput as Ie, Btn as Q, useWindow as Y, useNow as Be, agentTitle as je, age as Pe, agentRoleLabel as Le, TabBody as qe, SwitchCase as _e, WindowRoom as Fe, InnerTabs as Me } from "@journal/window-kit";
import { SettingPresetCard as pe, SettingPresetCompareTable as Ve, SettingEmptyState as Ue, isFull as ge, SettingBackPath as We, SettingPerTypeOverrideRow as De, SettingsScreen as $e, SettingRow as me, SettingEntryList as He, SettingThreeWayCap as Ge, SettingBanner as Ke, SettingHelperTypeTable as ze, sectionsOf as Xe, SettingSectionList as Ye, useSettingsDraft as Je, currentPreset as Ze, SettingPresetBand as Qe, FindBox as et, ChangeFoot as tt } from "@journal/setting-components";
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
    return (s, f) => (n(), c("section", nt, [
      u("div", at, [
        u("button", {
          type: "button",
          class: "back",
          "data-presets-back": "",
          onClick: f[0] || (f[0] = (v) => e("back"))
        }, "‹ Back"),
        f[1] || (f[1] = u("b", null, "What is a preset?", -1))
      ]),
      u("div", st, [
        f[2] || (f[2] = u("p", { class: "lead" }, "A preset is a set of eight switches and nothing more. It is not a type of agent: the main agent is the same program under every preset, and a preset only fills in the switches below. Nothing is saved until you press Save.", -1)),
        u("div", ot, [
          (n(!0), c(V, null, D(t.presets, (v) => (n(), B(l(pe), {
            key: v.key,
            name: v.name,
            line: v.line,
            "can-fill": !t.readOnly,
            onFill: (_) => e("fill", v.key)
          }, null, 8, ["name", "line", "can-fill", "onFill"]))), 128)),
          A(l(pe), {
            name: "Custom",
            line: lt
          })
        ]),
        A(l(Ve), {
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
      onSubmit: e[2] || (e[2] = we((s) => r.$emit("submit"), ["prevent"]))
    }, [
      e[5] || (e[5] = u("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      A(l(Ie), {
        "model-value": t.reason,
        label: "Reason",
        disabled: t.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": e[0] || (e[0] = (s) => r.$emit("update:reason", s))
      }, null, 8, ["model-value", "disabled"]),
      u("div", ut, [
        A(l(Q), {
          type: "submit",
          small: "",
          disabled: t.pending || !t.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: I(() => [...e[3] || (e[3] = [
            X("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        A(l(Q), {
          small: "",
          disabled: t.pending,
          onClick: e[1] || (e[1] = (s) => r.$emit("cancel"))
        }, {
          default: I(() => [...e[4] || (e[4] = [
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
}, ft = { class: "models" }, pt = ["data-count-agent"], gt = { class: "person-text" }, mt = {
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
    const e = t, s = r, f = Y(), v = Be(), _ = x([]), O = x(0), d = x(!1), C = x(!1), h = x(""), R = x(""), $ = x(null), j = x(""), U = y(() => _.value.filter((S) => {
      var g;
      return S.state !== "retired" && S.role === e.role && (!e.profile || (((g = S.facts) == null ? void 0 : g.profile) || S.profile) === e.profile);
    }).sort((S, g) => (S.state !== "running") - (g.state !== "running") || String(S.ended_at || S.created_at).localeCompare(String(g.ended_at || g.created_at)))), W = y(() => {
      var g;
      const S = /* @__PURE__ */ new Map();
      for (const b of U.value) {
        const P = ((g = b.facts) == null ? void 0 : g.model) || b.program_model;
        P && S.set(P, (S.get(P) || 0) + 1);
      }
      return [...S].map(([b, P]) => `${P} ${b}`).join(", ");
    });
    async function q(S = 1) {
      f.state["count-agents.role"] = e.role, e.profile ? f.state["count-agents.profile"] = e.profile : delete f.state["count-agents.profile"], f.state["count-agents.page"] = String(S), await f.reload("count-agents");
      const g = f.props["count-agents"];
      _.value = S === 1 ? [...g.rows.value] : [..._.value, ...g.rows.value], O.value = S, d.value = g.more.value;
    }
    async function G(S) {
      if (!j.value.trim() || C.value) return;
      C.value = !0;
      const g = await f.run(["agent", "retire", String(S.number), "--reason", j.value.trim()]);
      h.value = g.ok ? "" : "The agent could not be retired. Try again.", g.ok && ($.value = null, j.value = "", R.value = "Agent retired permanently.", s("retired"), await q()), C.value = !1;
    }
    return te(() => q()), (S, g) => (n(), c("section", vt, [
      u("p", ft, k(W.value), 1),
      U.value.length ? w("", !0) : (n(), B(l(Ue), {
        key: 0,
        title: "No agents here yet",
        line: "An agent shows here as soon as one of this type starts."
      })),
      (n(!0), c(V, null, D(U.value, (b) => {
        var P, F, m, E;
        return n(), c("div", {
          key: b.id,
          class: "person",
          "data-count-agent": b.id
        }, [
          u("span", {
            class: Z(["dot", { running: b.state === "running" }])
          }, null, 2),
          u("div", gt, [
            u("strong", null, k(l(je)(b).text), 1),
            X(" " + k(b.state === "running" ? "Running" : "Idle") + ", " + k(l(Pe)(b.state === "running" ? b.process_started_at || b.created_at : b.ended_at, l(v))) + " ", 1),
            u("small", null, k([b.program, (P = b.facts) == null ? void 0 : P.model, (F = b.facts) == null ? void 0 : F.effort, l(Le)(b)].filter(Boolean).join(", ")), 1),
            u("small", null, k(((m = b.facts) == null ? void 0 : m.task_title) || ((E = b.facts) == null ? void 0 : E.helper_job)), 1)
          ]),
          A(l(Q), {
            small: "",
            onClick: (N) => s("open-agent", b)
          }, {
            default: I(() => [...g[3] || (g[3] = [
              X("Open", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]),
          b.state === "idle" && !l(f).readOnly ? (n(), B(l(Q), {
            key: 0,
            small: "",
            onClick: (N) => {
              $.value = b.id, j.value = "";
            }
          }, {
            default: I(() => [...g[4] || (g[4] = [
              X("Retire", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])) : w("", !0),
          $.value === b.id ? (n(), B(ct, {
            key: 1,
            reason: j.value,
            "onUpdate:reason": g[0] || (g[0] = (N) => j.value = N),
            pending: C.value,
            onSubmit: (N) => G(b),
            onCancel: g[1] || (g[1] = (N) => $.value = null)
          }, null, 8, ["reason", "pending", "onSubmit"])) : w("", !0)
        ], 8, pt);
      }), 128)),
      d.value ? (n(), B(l(Q), {
        key: 1,
        small: "",
        onClick: g[2] || (g[2] = (b) => q(O.value + 1))
      }, {
        default: I(() => [...g[5] || (g[5] = [
          X("Show more", -1)
        ])]),
        _: 1
      })) : w("", !0),
      h.value ? (n(), c("p", mt, k(h.value), 1)) : R.value ? (n(), c("p", yt, k(R.value), 1)) : w("", !0)
    ]));
  }
}, ht = /* @__PURE__ */ H(kt, [["__scopeId", "data-v-b33e0360"]]), J = "journal.core.helpers", bt = `${J}.context-limit-on`, ve = `${J}.context-limit-tokens`, Se = `${J}.context-limit-kinds`, ee = `${J}.context-limit-profiles`, le = `${J}.read-only-helper-profile-limits`, wt = `${J}.read-only-helper-run-limit`, re = "journal.suites.coding.workers.merge-hooks", _t = "none", Oe = (t) => `${t / 1e3}k`, Ce = (t) => {
  const r = t.lastIndexOf(":");
  return { name: t.slice(0, r).trim(), value: t.slice(r + 1).trim() };
}, Ae = (t) => {
  const r = t.indexOf(":");
  return r < 0 ? { text: t, name: "", command: "" } : { text: t, name: t.slice(0, r).trim(), command: t.slice(r + 1).trim() };
}, $t = (t, r) => (t ?? []).map(Ae).filter((e) => e.name === r).map((e) => e.command), St = (t, r, e) => [
  ...(t ?? []).map(Ae).filter((s) => s.name !== r).map((s) => s.text),
  ...e.map((s) => `${r}: ${s}`)
], ae = (t, r) => {
  var e;
  return (e = (t ?? []).map(Ce).find((s) => s.name === r)) == null ? void 0 : e.value;
}, ye = (t) => t === _t ? "No cap" : Oe(Number(t));
function ke(t, r, e) {
  if (t.value(bt) !== !0) return { text: "Off", where: "Context limit is off", own: !1 };
  const s = e ? ae(t.list(ee), e) : void 0;
  if (s !== void 0) return { text: ye(s), where: "Own value", own: !0 };
  const f = ae(t.list(Se), r);
  return f !== void 0 ? { text: ye(f), where: "Set for its type", own: !1 } : { text: Oe(Number(t.value(ve))), where: "Set for every agent", own: !1 };
}
const Ot = (t) => t > 0 ? t : null, Ct = { worker: "workers" }, ne = "merger", he = "designer";
function be(t, r, e, s, f, v = {}) {
  return { key: t, name: r, line: e, running: s.running, runLimit: s.run_limit, kept: s.kept, keptLimit: Ot(s.kept_limit), cap: f, ...v };
}
function At(t, r) {
  const e = t.filter((d) => !d.per_profile).map((d) => be(d.key, d.label, d.line, d, ke(r, d.key, ""), { screen: Ct[d.key] ?? "read-only", role: d.key, profile: "", defaultProfile: d.default_profile })), s = t.find((d) => d.per_profile);
  if (!s) return e;
  const f = (d) => be(`${s.key}:${d.profile}`, d.title, d.line, d, ke(r, s.key, d.profile), { screen: d.group === ne ? ne : "read-only", role: s.key, profile: d.profile }), v = s.profiles.filter((d) => d.group === ne || d.group === he).map(f), _ = s.profiles.filter((d) => d.group !== ne && d.group !== he).map((d) => ({ ...f(d), indent: !0 })), O = { key: s.key, name: "Read-only helpers", group: !0, screen: "read-only", role: s.key, profile: "", line: `${s.running} running, ${s.kept} kept. Every profile runs up to ${s.run_limit} unless the profile sets its own limit, and an unused helper is retired after its idle hours.` };
  return [...e, ...v, O, ..._];
}
const de = Array.from({ length: 10 }, (t, r) => (r + 1) * 1e5), Tt = (t) => t.filter((r) => !r.group && (ge(r.running, r.runLimit) || ge(r.kept, r.keptLimit ?? 0))).length;
function Te(t, r) {
  const e = y(() => t.props.limits.rows.value ?? []), s = y(() => At(e.value, r)), f = y(() => !!t.props.limits.failure.value);
  return { rows: s, unreadable: f, reread: () => t.reload("limits") };
}
const Rt = {
  class: "type",
  "data-agent-type-screen": ""
}, xt = { class: "typebody" }, Et = {
  class: "typemain",
  "data-type-settings": ""
}, Nt = { class: "typeside" }, ie = "none", It = "worker", Bt = {
  __name: "AgentSettingsTypeScreen",
  props: { row: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back"],
  setup(t, { emit: r }) {
    const e = t, s = r, f = Y(), v = y(() => f.props["type-screen"].data.value), _ = y(() => {
      var m;
      return ((m = v.value) == null ? void 0 : m.nodes) ?? [];
    }), O = y(() => e.row.profile !== "");
    async function d() {
      f.state["type-screen.type"] = e.row.screen, await f.reload("type-screen");
    }
    ce(v, (m) => {
      m && e.draft.load([m]);
    }), te(d);
    const C = y(() => e.draft.list(le).map((m) => m.split(":"))), h = y(() => C.value.find((m) => m[0] === e.row.profile)), R = y(() => ({ running: Number(e.draft.value(wt)) })), $ = () => h.value ? Number(h.value[1]) : null;
    function j(m) {
      const E = C.value.filter((N) => N[0] !== e.row.profile).map((N) => N.join(":"));
      if (m === null) return e.draft.set(le, E);
      m !== "" && e.draft.set(le, [...E, `${e.row.profile}:${m}`]);
    }
    const U = y(() => e.row.group ? "" : e.row.profile || e.row.defaultProfile || ""), W = y(() => ae(e.draft.list(ee), U.value)), q = y(() => W.value === void 0 ? "kind" : W.value === ie ? "none" : "own"), G = y(() => {
      const m = ae(e.draft.list(Se), e.row.role);
      return m === ie ? null : Number(m ?? e.draft.value(ve));
    });
    function S({ mode: m, size: E }) {
      const N = e.draft.list(ee).filter((K) => K.slice(0, K.lastIndexOf(":")).trim() !== U.value);
      e.draft.set(ee, m === "kind" ? N : [...N, `${U.value}:${m === "none" ? ie : E}`]);
    }
    const g = y(() => e.row.role === It ? U.value : ""), b = y(() => $t(e.draft.list(re), g.value)), P = (m) => e.draft.set(re, St(e.draft.list(re), g.value, m)), F = (m) => f.open("agents.agents", m.id);
    return (m, E) => (n(), c("div", Rt, [
      A(l(We), {
        parent: "Helpers",
        current: t.row.name,
        onBack: E[0] || (E[0] = (N) => s("back"))
      }, null, 8, ["current"]),
      u("div", xt, [
        u("div", Et, [
          O.value && t.row.screen === "read-only" ? (n(), B(l(De), {
            key: 0,
            label: "Running",
            help: "Agents of this profile that run at once.",
            "every-value": R.value.running,
            "own-value": $(),
            disabled: t.readOnly,
            "data-override-running": "",
            "onUpdate:ownValue": j
          }, null, 8, ["every-value", "own-value", "disabled"])) : (n(), B(l($e), {
            key: 1,
            nodes: _.value,
            draft: t.draft,
            "read-only": t.readOnly
          }, null, 8, ["nodes", "draft", "read-only"])),
          g.value ? (n(), B(l(me), {
            key: 2,
            label: "When merged",
            help: "Commands run in the main checkout after a worker of this profile is merged. One that fails is told to the main agent; the merge stands.",
            source: b.value.length ? "own" : "default",
            "data-merge-hooks": ""
          }, {
            default: I(() => [
              A(l(He), {
                "model-value": b.value,
                placeholder: "a command",
                disabled: t.readOnly,
                "onUpdate:modelValue": P
              }, null, 8, ["model-value", "disabled"])
            ]),
            _: 1
          }, 8, ["source"])) : w("", !0),
          U.value ? (n(), B(l(me), {
            key: 3,
            label: "Context cap",
            help: "The context size at which this type is compacted.",
            source: q.value === "own" || q.value === "none" ? "own" : "default",
            "data-context-cap": ""
          }, {
            default: I(() => [
              A(l(Ge), {
                mode: q.value,
                "kind-value": G.value,
                "own-value": q.value === "own" ? Number(W.value) : null,
                sizes: l(de),
                disabled: t.readOnly,
                onChange: S
              }, null, 8, ["mode", "kind-value", "own-value", "sizes", "disabled"])
            ]),
            _: 1
          }, 8, ["source"])) : w("", !0)
        ]),
        u("aside", Nt, [
          E[1] || (E[1] = u("h3", null, "Agents", -1)),
          A(ht, {
            role: t.row.role,
            profile: t.row.profile,
            onOpenAgent: F
          }, null, 8, ["role", "profile"])
        ])
      ])
    ]));
  }
}, jt = /* @__PURE__ */ H(Bt, [["__scopeId", "data-v-5883fd13"]]), Pt = {
  class: "agents",
  "data-agent-settings-agents": ""
}, Lt = {
  __name: "AgentSettingsAgents",
  props: { draft: { type: Object, required: !0 } },
  setup(t) {
    const r = t, e = Y(), { rows: s, unreadable: f, reread: v } = Te(e, r.draft), _ = x(null);
    te(v);
    const O = (d) => {
      _.value = s.value.find((C) => C.key === d);
    };
    return (d, C) => (n(), c("section", Pt, [
      _.value ? (n(), B(jt, {
        key: 0,
        row: _.value,
        draft: t.draft,
        "read-only": l(e).readOnly,
        onBack: C[0] || (C[0] = (h) => _.value = null)
      }, null, 8, ["row", "draft", "read-only"])) : l(f) ? (n(), B(l(Ke), {
        key: 1,
        kind: "unreadable",
        text: "The counts could not be read.",
        onRetry: l(v)
      }, null, 8, ["onRetry"])) : (n(), B(l(ze), {
        key: 2,
        rows: l(s),
        onOpen: O
      }, null, 8, ["rows"]))
    ]));
  }
}, qt = /* @__PURE__ */ H(Lt, [["__scopeId", "data-v-05cc036a"]]), Ft = {
  class: "activity",
  "data-assign-activity": ""
}, Mt = {
  key: 0,
  class: "activity",
  "data-assign-last-skip": ""
}, Vt = {
  __name: "AssignRuleActivity",
  props: { activity: { type: Object, required: !0 } },
  setup(t) {
    return (r, e) => (n(), c(V, null, [
      u("span", Ft, k(t.activity.text), 1),
      t.activity.last_skip ? (n(), c("span", Mt, "Last skipped: " + k(t.activity.last_skip), 1)) : w("", !0)
    ], 64));
  }
}, Ut = /* @__PURE__ */ H(Vt, [["__scopeId", "data-v-51520c3a"]]), Wt = {
  class: "changes",
  "data-assign-task-change": ""
}, Dt = ["title", "data-assign-change", "onClick"], Ht = {
  key: 0,
  class: "listing",
  "data-assign-listing": ""
}, Gt = { class: "heading" }, Kt = ["disabled"], zt = {
  __name: "AssignRuleTaskChange",
  props: { rule: { type: Object, required: !0 }, revision: { type: String, required: !0 } },
  emits: ["changed", "failed"],
  setup(t, { emit: r }) {
    const e = t, s = r, f = Y(), v = x(null), _ = [
      { verb: "apply", label: "Apply now", title: "List the free tasks the rule would give now" },
      { verb: "reassign", label: "Move its tasks", title: "List the waiting tasks the rule gave that would move to its target" },
      { verb: "give-back", label: "Give back its tasks", title: "List the waiting tasks the rule gave that would be free again" }
    ];
    async function O(h, R) {
      const $ = ["assign-rule", h, String(e.rule.id), ...R ? ["--change"] : [], "--revision", e.revision, "--environment", f.environment], j = await f.run($);
      return j.ok || s("failed", j.error), j;
    }
    async function d(h) {
      const R = await O(h, !1);
      v.value = R.ok ? { verb: h, tasks: R.value.tasks, text: R.value.text } : null;
    }
    async function C() {
      await O(v.value.verb, !0), v.value = null, s("changed");
    }
    return (h, R) => (n(), c(V, null, [
      u("span", Wt, [
        (n(), c(V, null, D(_, ($) => u("button", {
          key: $.verb,
          type: "button",
          title: $.title,
          "data-assign-change": $.verb,
          onClick: (j) => d($.verb)
        }, k($.label), 9, Dt)), 64))
      ]),
      v.value ? (n(), c("div", Ht, [
        u("p", Gt, "Tasks: " + k(v.value.tasks.length) + ". Nothing changes until you confirm.", 1),
        (n(!0), c(V, null, D(v.value.tasks, ($) => (n(), c("p", {
          key: $.task_id,
          class: "task"
        }, "Task " + k($.task_id) + ", " + k($.title) + ": " + k($.target), 1))), 128)),
        u("button", {
          type: "button",
          disabled: !v.value.tasks.length,
          "data-assign-confirm": "",
          onClick: C
        }, "Change these tasks", 8, Kt),
        u("button", {
          type: "button",
          onClick: R[0] || (R[0] = ($) => v.value = null)
        }, "Cancel")
      ])) : w("", !0)
    ], 64));
  }
}, Xt = /* @__PURE__ */ H(zt, [["__scopeId", "data-v-a0c23201"]]), Yt = {
  class: "assign",
  "data-agent-settings-assign": ""
}, Jt = {
  class: "targets",
  role: "listbox",
  "aria-label": "Give tasks to"
}, Zt = ["aria-selected", "data-assign-target", "onClick"], Qt = { class: "name" }, en = { class: "facts" }, tn = {
  key: 0,
  class: "facts"
}, nn = {
  key: 1,
  class: "facts",
  "data-assign-waiting": ""
}, an = { class: "rules" }, sn = ["data-assign-rule"], on = { class: "place" }, ln = { class: "summary" }, rn = {
  key: 0,
  class: "warning",
  "data-assign-warning": ""
}, un = { class: "actions" }, dn = ["disabled", "onClick"], cn = ["disabled", "onClick"], vn = ["title", "onClick"], fn = ["onClick"], pn = {
  key: 0,
  class: "empty"
}, gn = ["value", "onChange"], mn = ["value"], yn = ["onUpdate:modelValue"], kn = ["value"], hn = ["onUpdate:modelValue"], bn = ["disabled", "onClick"], wn = {
  key: 0,
  class: "warning",
  "data-assign-main-warning": ""
}, _n = { class: "trial" }, $n = ["disabled"], Sn = {
  key: 1,
  class: "verdict",
  "data-assign-recent": ""
}, On = {
  key: 2,
  class: "trial-result",
  "data-assign-trial": ""
}, Cn = { class: "verdict" }, An = {
  key: 2,
  class: "failure",
  role: "alert",
  "data-assign-failure": ""
}, Tn = "journal.suites.coding.main-writes-code", Rn = {
  __name: "AgentSettingsAssign",
  props: { draft: { type: Object, required: !0 }, readOnly: Boolean },
  setup(t) {
    const r = t, e = Y(), s = y(() => e.props.assign.data.value), f = x("main"), v = x("");
    let _ = 0;
    const O = () => ({ id: ++_, field: "complexity", operator: "minimum", value: "" }), d = x([O()]);
    te(() => e.reload("assign"));
    const C = y(() => {
      var o, p;
      return ((o = s.value) == null ? void 0 : o.targets.find((L) => L.key === f.value)) ?? ((p = s.value) == null ? void 0 : p.targets[0]);
    }), h = y(() => {
      var o;
      return (((o = s.value) == null ? void 0 : o.rules) ?? []).filter((p) => {
        var L;
        return p.target_key === ((L = C.value) == null ? void 0 : L.key);
      });
    }), R = (o) => {
      var p, L;
      return ((L = (p = s.value) == null ? void 0 : p.fields.find((i) => i.field === o)) == null ? void 0 : L.operators) ?? [];
    }, $ = (o) => {
      var p;
      return ((p = R(o.field).find((L) => L.operator === o.operator)) == null ? void 0 : p.needs_value) ?? !1;
    }, j = y(() => {
      var o;
      return ((o = C.value) == null ? void 0 : o.target) === "main" && r.draft.value(Tn) === !1;
    });
    function U(o) {
      return { main: ["--target", "main"], agent: ["--target", "agent", "--agent", `row:${o.agent_id}`], model: ["--target", "model", "--program", o.program, "--model", o.program_model] }[o.target];
    }
    const W = (o) => [o.field, o.operator, $(o) ? o.value : ""].filter(Boolean).join(" ");
    async function q(o) {
      const p = await e.run([...o, "--revision", s.value.revision, "--environment", e.environment]);
      return v.value = p.ok ? "" : p.error, await e.reload("assign"), p.ok;
    }
    function G(o, p) {
      var L;
      o.field = p, o.operator = ((L = R(p)[0]) == null ? void 0 : L.operator) ?? "", o.value = "";
    }
    async function S() {
      const o = ["assign-rule", "make", ...U(C.value), ...d.value.flatMap((p) => ["--condition", W(p)])];
      await q(o) && (d.value = [O()]);
    }
    const g = (o, p) => q(["assign-rule", "move", String(o.id), "--to", String(o.position + p)]), b = (o) => q(["assign-rule", o.enabled ? "disable" : "enable", String(o.id)]), P = (o) => q(["assign-rule", "delete", String(o.id)]), F = x(""), m = x(null), E = x(""), N = () => d.value.map((o) => `--condition ${JSON.stringify(W(o))}`).join(" ");
    async function K() {
      const o = await e.read(`assign-rule try ${Number(F.value)} ${N()} --environment ${e.environment}`);
      v.value = o.ok ? "" : o.error, m.value = o.ok ? o.value : null;
    }
    async function se() {
      const o = await e.read(`assign-rule recent ${N()} --environment ${e.environment}`);
      v.value = o.ok ? "" : o.error, E.value = o.ok ? o.value.text : "";
    }
    return (o, p) => {
      var L;
      return n(), c("section", Yt, [
        s.value ? (n(), c(V, { key: 0 }, [
          u("div", Jt, [
            (n(!0), c(V, null, D(s.value.targets, (i) => {
              var M, a;
              return n(), c("button", {
                key: i.key,
                type: "button",
                class: Z(["target", { chosen: i.key === ((M = C.value) == null ? void 0 : M.key) }]),
                "aria-selected": i.key === ((a = C.value) == null ? void 0 : a.key),
                "data-assign-target": i.key,
                onClick: (T) => f.value = i.key
              }, [
                u("span", Qt, k(i.label), 1),
                u("span", en, k(i.description), 1),
                i.target === "agent" ? (n(), c("span", tn, "State: " + k(i.running ? "running" : "kept") + " · Open tasks: " + k(i.open_tasks), 1)) : w("", !0),
                i.waiting ? (n(), c("span", nn, k(i.waiting), 1)) : w("", !0)
              ], 10, Zt);
            }), 128))
          ]),
          u("div", an, [
            p[6] || (p[6] = u("p", { class: "note" }, "The rules are tried in order and the first match wins.", -1)),
            (n(!0), c(V, null, D(h.value, (i) => (n(), c("div", {
              key: i.id,
              class: Z(["rule", { off: !i.enabled, warned: i.warning }]),
              "data-assign-rule": i.id
            }, [
              u("span", on, k(i.position), 1),
              u("span", ln, k(i.summary), 1),
              i.warning ? (n(), c("span", rn, k(i.warning), 1)) : w("", !0),
              A(Ut, {
                activity: i.activity
              }, null, 8, ["activity"]),
              t.readOnly ? w("", !0) : (n(), c(V, { key: 1 }, [
                u("span", un, [
                  u("button", {
                    type: "button",
                    title: "Move the rule up",
                    disabled: i.position === 1,
                    onClick: (M) => g(i, -1)
                  }, "↑", 8, dn),
                  u("button", {
                    type: "button",
                    title: "Move the rule down",
                    disabled: i.position === s.value.rules.length,
                    onClick: (M) => g(i, 1)
                  }, "↓", 8, cn),
                  u("button", {
                    type: "button",
                    title: i.enabled ? "Turn the rule off" : "Turn the rule on",
                    onClick: (M) => b(i)
                  }, k(i.enabled ? "Turn off" : "Turn on"), 9, vn),
                  u("button", {
                    type: "button",
                    title: "Delete the rule",
                    onClick: (M) => P(i)
                  }, "Delete", 8, fn)
                ]),
                A(Xt, {
                  rule: i,
                  revision: s.value.revision,
                  onChanged: p[0] || (p[0] = (M) => l(e).reload("assign")),
                  onFailed: p[1] || (p[1] = (M) => v.value = M)
                }, null, 8, ["rule", "revision"])
              ], 64))
            ], 10, sn))), 128)),
            h.value.length ? w("", !0) : (n(), c("p", pn, "No rules give tasks to " + k((L = C.value) == null ? void 0 : L.label) + " yet.", 1)),
            t.readOnly ? w("", !0) : (n(), c("form", {
              key: 1,
              class: "editor",
              "data-assign-editor": "",
              onSubmit: we(S, ["prevent"])
            }, [
              p[4] || (p[4] = u("p", { class: "all" }, "A task must meet all of these conditions:", -1)),
              (n(!0), c(V, null, D(d.value, (i, M) => (n(), c("div", {
                key: i.id,
                class: "condition"
              }, [
                u("select", {
                  value: i.field,
                  "aria-label": "Condition",
                  onChange: (a) => G(i, a.target.value)
                }, [
                  (n(!0), c(V, null, D(s.value.fields, (a) => (n(), c("option", {
                    key: a.field,
                    value: a.field
                  }, k(a.field === "any" ? "Any task" : a.field), 9, mn))), 128))
                ], 40, gn),
                oe(u("select", {
                  "onUpdate:modelValue": (a) => i.operator = a,
                  "aria-label": "Comparison"
                }, [
                  (n(!0), c(V, null, D(R(i.field), (a) => (n(), c("option", {
                    key: a.operator,
                    value: a.operator
                  }, k(a.label), 9, kn))), 128))
                ], 8, yn), [
                  [Re, i.operator]
                ]),
                $(i) ? oe((n(), c("input", {
                  key: 0,
                  "onUpdate:modelValue": (a) => i.value = a,
                  "aria-label": "Value",
                  placeholder: "For example: 4 or migration"
                }, null, 8, hn)), [
                  [fe, i.value]
                ]) : w("", !0),
                u("button", {
                  type: "button",
                  title: "Remove the condition",
                  disabled: d.value.length === 1,
                  onClick: (a) => d.value.splice(M, 1)
                }, "Remove", 8, bn)
              ]))), 128)),
              u("button", {
                type: "button",
                onClick: p[2] || (p[2] = (i) => d.value.push(O()))
              }, "Add a condition"),
              j.value ? (n(), c("p", wn, "The main agent writes no code here, so a rule that gives it a task is skipped.")) : w("", !0),
              u("div", _n, [
                oe(u("input", {
                  "onUpdate:modelValue": p[3] || (p[3] = (i) => F.value = i),
                  type: "number",
                  min: "1",
                  "aria-label": "Task number for the trial",
                  placeholder: "Task number",
                  "data-assign-trial-task": ""
                }, null, 512), [
                  [fe, F.value]
                ]),
                u("button", {
                  type: "button",
                  disabled: !F.value,
                  "data-assign-try": "",
                  onClick: K
                }, "Try on this task", 8, $n),
                u("button", {
                  type: "button",
                  "data-assign-count": "",
                  onClick: se
                }, "Count the last 20 tasks")
              ]),
              E.value ? (n(), c("p", Sn, k(E.value), 1)) : w("", !0),
              m.value ? (n(), c("div", On, [
                u("p", Cn, k(m.value.matches ? "The rule would match" : "The rule would not match") + " task " + k(m.value.task_id) + ". Nothing is assigned.", 1),
                (n(!0), c(V, null, D(m.value.conditions, (i) => (n(), c("p", {
                  key: i.label,
                  class: Z(["said", { missed: !i.matched }])
                }, k(i.label) + ": " + k(i.matched ? "met" : "not met"), 3))), 128))
              ])) : w("", !0),
              p[5] || (p[5] = u("button", {
                type: "submit",
                class: "save"
              }, "Add the rule", -1))
            ], 32)),
            v.value ? (n(), c("p", An, k(v.value), 1)) : w("", !0)
          ])
        ], 64)) : w("", !0)
      ]);
    };
  }
}, xn = /* @__PURE__ */ H(Rn, [["__scopeId", "data-v-7f403ea3"]]), En = { class: "screen" }, Nn = { class: "rail" }, In = {
  __name: "AgentSettingsScreen",
  props: { nodes: { type: Array, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 }, extras: { type: Object, default: () => ({}) }, found: { type: String, default: "" } },
  setup(t) {
    const r = t, e = x(null), s = y(() => Xe(r.nodes));
    ce(() => r.found, (v) => v && xe(() => {
      var _, O;
      return (O = (_ = e.value) == null ? void 0 : _.querySelector(`[data-setting="${v}"]`)) == null ? void 0 : O.scrollIntoView({ block: "center" });
    }), { immediate: !0, flush: "post" });
    const f = (v) => {
      var _, O;
      return (O = (_ = e.value) == null ? void 0 : _.querySelector(`[data-section="${v}"]`)) == null ? void 0 : O.scrollIntoView({ block: "start", behavior: "smooth" });
    };
    return (v, _) => (n(), c("div", En, [
      u("nav", Nn, [
        A(l(Ye), {
          sections: s.value,
          scope: e.value,
          onChoose: f
        }, null, 8, ["sections", "scope"])
      ]),
      u("div", {
        ref_key: "scroll",
        ref: e,
        class: "content"
      }, [
        Ee(v.$slots, "before", {}, void 0, !0),
        A(l($e), {
          nodes: t.nodes,
          draft: t.draft,
          "read-only": t.readOnly,
          extras: t.extras,
          found: t.found
        }, null, 8, ["nodes", "draft", "read-only", "extras", "found"])
      ], 512)
    ]));
  }
}, ue = /* @__PURE__ */ H(In, [["__scopeId", "data-v-1cab27ca"]]), Bn = {
  key: 0,
  class: "hint",
  "data-work-hint": ""
}, jn = {
  __name: "AgentSettingsTab",
  props: { tab: { type: String, required: !0 }, active: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, isReady: Boolean, nodes: { type: Function, required: !0 }, readOnly: Boolean, found: { type: String, default: "" }, nothingStarts: Boolean, advancedExtras: { type: Object, required: !0 } },
  setup(t) {
    return (r, e) => (n(), c("div", {
      class: Z(["settings-body", { flush: t.tab === "agents" }])
    }, [
      A(l(qe), { tab: t.active }, {
        default: I(() => [
          A(l(_e), { value: t.tab }, {
            work: I(() => [
              t.isReady ? (n(), B(ue, {
                key: "work",
                nodes: t.nodes("work"),
                draft: t.draft,
                "read-only": t.readOnly,
                found: t.found,
                "data-agent-settings-work": ""
              }, {
                before: I(() => [
                  t.nothingStarts ? (n(), c("p", Bn, "With Auto off and no workers, nothing starts the work: a user starts tasks or turns one of them on.")) : w("", !0)
                ]),
                _: 1
              }, 8, ["nodes", "draft", "read-only", "found"])) : w("", !0)
            ]),
            agents: I(() => [
              A(qt, { draft: t.draft }, null, 8, ["draft"])
            ]),
            assign: I(() => [
              A(xn, {
                draft: t.draft,
                "read-only": t.readOnly
              }, null, 8, ["draft", "read-only"])
            ]),
            tests: I(() => [
              t.isReady ? (n(), B(ue, {
                key: "tests",
                nodes: t.nodes("tests"),
                draft: t.draft,
                "read-only": t.readOnly,
                found: t.found,
                "data-agent-settings-tests": ""
              }, null, 8, ["nodes", "draft", "read-only", "found"])) : w("", !0)
            ]),
            advanced: I(() => [
              t.isReady ? (n(), B(ue, {
                key: "advanced",
                nodes: t.nodes("advanced"),
                draft: t.draft,
                "read-only": t.readOnly,
                found: t.found,
                extras: t.advancedExtras,
                "data-agent-settings-advanced": ""
              }, null, 8, ["nodes", "draft", "read-only", "found", "extras"])) : w("", !0)
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        _: 1
      }, 8, ["tab"])
    ], 2));
  }
}, Pn = {
  class: "settings",
  "data-agent-settings": ""
}, Ln = { class: "head" }, qn = {
  class: "env",
  "data-settings-environment": ""
}, Fn = {
  key: 1,
  class: "settings-bar"
}, Mn = {
  key: 2,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, Vn = "journal.suites.coding.auto-mode", Un = "journal.suites.coding.workers.main-dispatches-workers", Wn = 1200, Dn = {
  __name: "AgentSettings",
  setup(t) {
    const r = { work: "work-screen", tests: "tests-screen", advanced: "advanced-screen", "helper-types": "helper-types-screen" }, e = Y(), s = [{ key: "work", label: "Work" }, { key: "agents", label: "Helpers", count_field: "full" }, { key: "assign", label: "Assign" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }], f = e.option("sections").value, v = f ? s.filter((a) => f.includes(a.key)) : s, _ = x(v[0].key), O = y(() => v.find((a) => a.key === _.value)), d = () => Object.values(r).map((a) => e.props[a].data.value), C = y(() => d().every(Boolean)), h = Je({
      run: (a) => e.run(a),
      reload: async () => {
        const a = "type-screen.type" in e.state;
        await Promise.all([...Object.values(r).map((T) => e.reload(T)), e.reload("limits"), ...a ? [e.reload("type-screen")] : []]), h.load([...d(), ...a ? [e.props["type-screen"].data.value] : []]);
      }
    });
    ce(d, (a) => {
      a.every(Boolean) && h.load(a);
    }, { immediate: !0 });
    const { rows: R } = Te(e, h), $ = y(() => Tt(R.value)), j = y(() => $.value ? { full: `${$.value} full` } : {});
    te(() => e.reload("limits"));
    const U = [{ key: "main", name: "Main agent" }, { key: "worker", name: "Workers" }, { key: "helper", name: "Read-only helpers" }], W = (a) => {
      var T;
      return ((T = R.value.find((z) => z.profile === a)) == null ? void 0 : T.name) ?? a;
    }, q = y(() => h.list(ee).map(Ce).map(({ name: a, value: T }) => ({ name: W(a), value: T === "none" ? "no cap" : `${Number(T) / 1e3}k` }))), G = y(() => ({ "keyed-cap-table": { rows: U, sizes: de, defaultCap: Number(h.value(ve)) || de[0], ownCaps: q.value } })), S = (a) => {
      var T;
      return ((T = e.props[r[a]].data.value) == null ? void 0 : T.nodes) ?? [];
    }, g = y(() => h.value(Vn) === !1 && h.value(Un) === !1), b = y(() => !e.readOnly), P = x("main"), F = y(() => {
      var a;
      return ((a = e.props.work.data.value) == null ? void 0 : a.presets) ?? [];
    }), m = y(() => {
      var a;
      return ((a = e.props.work.data.value) == null ? void 0 : a.switches) ?? [];
    }), E = y(() => Object.fromEntries(m.value.map((a) => [a.key, h.value(a.key)]))), N = y(() => Ze(E.value, F.value)), K = (a) => h.fill(F.value.find((T) => T.key === a).values), se = y(() => {
      var a;
      return ((a = e.props.find.data.value) == null ? void 0 : a.rows) ?? [];
    }), o = x("");
    let p = null;
    const L = (a) => a.startsWith("helper-type") ? "agents" : a;
    function i(a) {
      P.value = "main", M({ key: L(a.screen) }), o.value = a.key, clearTimeout(p), p = setTimeout(() => {
        o.value = "";
      }, Wn);
    }
    Ne(() => clearTimeout(p));
    function M(a) {
      _.value = a.key, e.state.tab = a.key === "agents" ? "agents" : "";
    }
    return (a, T) => (n(), B(l(Fe), { padding: "0" }, {
      default: I(() => [
        u("div", Pn, [
          A(l(_e), { value: P.value }, {
            main: I(() => [
              u("div", Ln, [
                u("span", qn, k(l(e).environment), 1)
              ]),
              F.value.length && l(v).some((z) => z.key === "work") ? (n(), B(l(Qe), {
                key: 0,
                presets: F.value,
                current: N.value,
                disabled: l(e).readOnly,
                onPick: K,
                onOpenPage: T[0] || (T[0] = (z) => P.value = "presets")
              }, {
                default: I(() => [
                  A(l(et), {
                    index: se.value,
                    onPick: i
                  }, null, 8, ["index"])
                ]),
                _: 1
              }, 8, ["presets", "current", "disabled"])) : w("", !0),
              l(v).length > 1 ? (n(), c("div", Fn, [
                A(l(Me), {
                  tabs: l(v),
                  active: O.value,
                  answer: j.value,
                  onChoose: M
                }, null, 8, ["tabs", "active", "answer"])
              ])) : w("", !0),
              l(e).readOnly ? (n(), c("p", Mn, "Only a user can change these settings. You can read every value, and ask a user for a change.")) : w("", !0),
              A(jn, {
                tab: _.value,
                active: O.value,
                draft: l(h),
                "is-ready": C.value,
                nodes: S,
                "read-only": l(e).readOnly,
                found: o.value,
                "nothing-starts": g.value,
                "advanced-extras": G.value
              }, null, 8, ["tab", "active", "draft", "is-ready", "read-only", "found", "nothing-starts", "advanced-extras"])
            ]),
            presets: I(() => [
              A(it, {
                presets: F.value,
                switches: m.value,
                now: E.value,
                "read-only": l(e).readOnly,
                onBack: T[1] || (T[1] = (z) => P.value = "main"),
                onFill: K
              }, null, 8, ["presets", "switches", "now", "read-only"])
            ]),
            _: 1
          }, 8, ["value"]),
          b.value ? (n(), B(l(tt), {
            key: 0,
            changes: l(h).changes(),
            "can-save": l(h).canSave.value,
            pending: l(h).pending.value,
            reason: l(h).reason.value,
            environment: l(e).environment,
            onSave: T[2] || (T[2] = (z) => l(h).apply()),
            onCancel: T[3] || (T[3] = (z) => l(h).reset())
          }, null, 8, ["changes", "can-save", "pending", "reason", "environment"])) : w("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, Xn = /* @__PURE__ */ H(Dn, [["__scopeId", "data-v-edbec32a"]]);
export {
  Xn as A
};
