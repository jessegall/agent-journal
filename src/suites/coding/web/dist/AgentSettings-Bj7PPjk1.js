import { openBlock as s, createElementBlock as p, createElementVNode as i, Fragment as D, renderList as K, createBlock as N, unref as r, createVNode as C, withModifiers as be, withCtx as E, createTextVNode as Y, ref as x, computed as g, onMounted as Q, toDisplayString as b, createCommentVNode as $, normalizeClass as X, watch as ie, withDirectives as ae, vModelSelect as Te, vModelText as ue, nextTick as Ae, renderSlot as xe, onBeforeUnmount as Re } from "vue";
import { TextInput as Ee, Btn as J, useWindow as ee, useNow as Ne, agentTitle as Ie, age as Be, agentNumber as Pe, TabBody as je, SwitchCase as we, WindowRoom as Le, InnerTabs as Fe } from "@journal/window-kit";
import { SettingPresetCard as ce, SettingPresetCompareTable as qe, SettingEmptyState as Ve, isFull as ve, SettingBackPath as Me, SettingPerTypeOverrideRow as pe, SettingsScreen as $e, SettingRow as fe, SettingEntryList as Ue, SettingThreeWayCap as We, SettingBanner as De, SettingHelperTypeTable as Ke, sectionsOf as He, SettingSectionList as ze, useSettingsDraft as Ge, currentPreset as Ye, SettingPresetBand as Xe, FindBox as Je, ChangeFoot as Ze } from "@journal/setting-components";
import { _ as H } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const Qe = {
  class: "page",
  "data-agent-settings-presets": ""
}, et = { class: "crumb" }, tt = { class: "body" }, nt = { class: "cards" }, at = "Any other mix of the eight switches. The form shows Custom as soon as the switches match neither preset.", st = {
  __name: "AgentSettingsPresets",
  props: { presets: { type: Array, required: !0 }, switches: { type: Array, required: !0 }, now: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back", "fill"],
  setup(t, { emit: d }) {
    const e = d;
    return (l, v) => (s(), p("section", Qe, [
      i("div", et, [
        i("button", {
          type: "button",
          class: "back",
          "data-presets-back": "",
          onClick: v[0] || (v[0] = (y) => e("back"))
        }, "‹ Back"),
        v[1] || (v[1] = i("b", null, "What is a preset?", -1))
      ]),
      i("div", tt, [
        v[2] || (v[2] = i("p", { class: "lead" }, "A preset is a set of eight switches and nothing more. It is not a type of agent: the main agent is the same program under every preset, and a preset only fills in the switches below. Nothing is saved until you press Save.", -1)),
        i("div", nt, [
          (s(!0), p(D, null, K(t.presets, (y) => (s(), N(r(ce), {
            key: y.key,
            name: y.name,
            line: y.line,
            "can-fill": !t.readOnly,
            onFill: (w) => e("fill", y.key)
          }, null, 8, ["name", "line", "can-fill", "onFill"]))), 128)),
          C(r(ce), {
            name: "Custom",
            line: at
          })
        ]),
        C(r(qe), {
          rows: t.switches,
          presets: t.presets,
          now: t.now
        }, null, 8, ["rows", "presets", "now"])
      ])
    ]));
  }
}, ot = /* @__PURE__ */ H(st, [["__scopeId", "data-v-cf40939d"]]), lt = { class: "action-buttons" }, rt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(t) {
    return (d, e) => (s(), p("form", {
      "data-agent-retire-confirm": "",
      onSubmit: e[2] || (e[2] = be((l) => d.$emit("submit"), ["prevent"]))
    }, [
      e[5] || (e[5] = i("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      C(r(Ee), {
        "model-value": t.reason,
        label: "Reason",
        disabled: t.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": e[0] || (e[0] = (l) => d.$emit("update:reason", l))
      }, null, 8, ["model-value", "disabled"]),
      i("div", lt, [
        C(r(J), {
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
        C(r(J), {
          small: "",
          disabled: t.pending,
          onClick: e[1] || (e[1] = (l) => d.$emit("cancel"))
        }, {
          default: E(() => [...e[4] || (e[4] = [
            Y("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, it = /* @__PURE__ */ H(rt, [["__scopeId", "data-v-92de7dd6"]]), dt = {
  class: "type-agents",
  "data-type-agents": ""
}, ut = { class: "models" }, ct = ["data-count-agent"], vt = { class: "person-text" }, pt = {
  key: 2,
  role: "alert",
  class: "bad"
}, ft = {
  key: 3,
  role: "status"
}, mt = {
  __name: "AgentTypeAgents",
  props: { role: { type: String, required: !0 }, profile: { type: String, default: "" } },
  emits: ["open-agent", "retired"],
  setup(t, { emit: d }) {
    const e = t, l = d, v = ee(), y = Ne(), w = x([]), A = x(0), a = x(!1), T = x(!1), L = x(""), P = x(""), j = x(null), F = x(""), q = g(() => w.value.filter((_) => {
      var c;
      return _.state !== "retired" && _.role === e.role && (!e.profile || (((c = _.facts) == null ? void 0 : c.profile) || _.profile) === e.profile);
    }).sort((_, c) => (_.state !== "running") - (c.state !== "running") || String(_.ended_at || _.created_at).localeCompare(String(c.ended_at || c.created_at)))), U = g(() => {
      var c;
      const _ = /* @__PURE__ */ new Map();
      for (const m of q.value) {
        const I = ((c = m.facts) == null ? void 0 : c.model) || m.program_model;
        I && _.set(I, (_.get(I) || 0) + 1);
      }
      return [..._].map(([m, I]) => `${I} ${m}`).join(", ");
    });
    async function B(_ = 1) {
      v.state["count-agents.role"] = e.role, e.profile ? v.state["count-agents.profile"] = e.profile : delete v.state["count-agents.profile"], v.state["count-agents.page"] = String(_), await v.reload("count-agents");
      const c = v.props["count-agents"];
      w.value = _ === 1 ? [...c.rows.value] : [...w.value, ...c.rows.value], A.value = _, a.value = c.more.value;
    }
    async function z(_) {
      if (!F.value.trim() || T.value) return;
      T.value = !0;
      const c = await v.run(["agent", "retire", String(_.number), "--reason", F.value.trim()]);
      L.value = c.ok ? "" : "The agent could not be retired. Try again.", c.ok && (j.value = null, F.value = "", P.value = "Agent retired permanently.", l("retired"), await B()), T.value = !1;
    }
    return Q(() => B()), (_, c) => (s(), p("section", dt, [
      i("p", ut, b(U.value), 1),
      q.value.length ? $("", !0) : (s(), N(r(Ve), {
        key: 0,
        title: "No agents here yet",
        line: "An agent shows here as soon as one of this type starts."
      })),
      (s(!0), p(D, null, K(q.value, (m) => {
        var I, V, M, u;
        return s(), p("div", {
          key: m.id,
          class: "person",
          "data-count-agent": m.id
        }, [
          i("span", {
            class: X(["dot", { running: m.state === "running" }])
          }, null, 2),
          i("div", vt, [
            i("strong", null, b(r(Ie)(m).text), 1),
            Y(" " + b(m.state === "running" ? "Running" : "Idle") + ", " + b(r(Be)(m.state === "running" ? m.process_started_at || m.created_at : m.ended_at, r(y))) + " ", 1),
            i("small", null, b([m.program, (I = m.facts) == null ? void 0 : I.model, (V = m.facts) == null ? void 0 : V.effort, r(Pe)(m)].filter(Boolean).join(", ")), 1),
            i("small", null, b(((M = m.facts) == null ? void 0 : M.task_title) || ((u = m.facts) == null ? void 0 : u.helper_job)), 1)
          ]),
          C(r(J), {
            small: "",
            onClick: (k) => l("open-agent", m)
          }, {
            default: E(() => [...c[3] || (c[3] = [
              Y("Open", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]),
          m.state === "idle" && !r(v).readOnly ? (s(), N(r(J), {
            key: 0,
            small: "",
            onClick: (k) => {
              j.value = m.id, F.value = "";
            }
          }, {
            default: E(() => [...c[4] || (c[4] = [
              Y("Retire", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])) : $("", !0),
          j.value === m.id ? (s(), N(it, {
            key: 1,
            reason: F.value,
            "onUpdate:reason": c[0] || (c[0] = (k) => F.value = k),
            pending: T.value,
            onSubmit: (k) => z(m),
            onCancel: c[1] || (c[1] = (k) => j.value = null)
          }, null, 8, ["reason", "pending", "onSubmit"])) : $("", !0)
        ], 8, ct);
      }), 128)),
      a.value ? (s(), N(r(J), {
        key: 1,
        small: "",
        onClick: c[2] || (c[2] = (m) => B(A.value + 1))
      }, {
        default: E(() => [...c[5] || (c[5] = [
          Y("Show more", -1)
        ])]),
        _: 1
      })) : $("", !0),
      L.value ? (s(), p("p", pt, b(L.value), 1)) : P.value ? (s(), p("p", ft, b(P.value), 1)) : $("", !0)
    ]));
  }
}, gt = /* @__PURE__ */ H(mt, [["__scopeId", "data-v-67f17bfa"]]), G = "journal.core.helpers", yt = `${G}.context-limit-on`, de = `${G}.context-limit-tokens`, _e = `${G}.context-limit-kinds`, Z = `${G}.context-limit-profiles`, se = `${G}.read-only-helper-profile-limits`, kt = `${G}.read-only-helper-run-limit`, ht = `${G}.read-only-helper-kept-limit`, me = "journal.suites.coding.workers.merge-hooks", bt = "none", Oe = (t) => `${t / 1e3}k`, Se = (t) => {
  const d = t.lastIndexOf(":");
  return { name: t.slice(0, d).trim(), value: t.slice(d + 1).trim() };
}, ne = (t, d) => {
  var e;
  return (e = (t ?? []).map(Se).find((l) => l.name === d)) == null ? void 0 : e.value;
}, ge = (t) => t === bt ? "No cap" : Oe(Number(t));
function ye(t, d, e) {
  if (t(yt) !== !0) return { text: "Off", where: "Context limit is off", own: !1 };
  const l = e ? ne(t(Z), e) : void 0;
  if (l !== void 0) return { text: ge(l), where: "Own value", own: !0 };
  const v = ne(t(_e), d);
  return v !== void 0 ? { text: ge(v), where: "Set for its type", own: !1 } : { text: Oe(Number(t(de))), where: "Set for every agent", own: !1 };
}
const wt = (t) => t > 0 ? t : null, $t = { worker: "workers" }, te = "merger", ke = "designer";
function he(t, d, e, l, v, y = {}) {
  return { key: t, name: d, line: e, running: l.running, runLimit: l.run_limit, kept: l.kept, keptLimit: wt(l.kept_limit), cap: v, ...y };
}
function _t(t, d) {
  const e = t.filter((a) => !a.per_profile).map((a) => he(a.key, a.label, a.line, a, ye(d, a.key, ""), { screen: $t[a.key] ?? "read-only", role: a.key, profile: "", defaultProfile: a.default_profile })), l = t.find((a) => a.per_profile);
  if (!l) return e;
  const v = (a) => he(`${l.key}:${a.profile}`, a.title, a.line, a, ye(d, l.key, a.profile), { screen: a.group === te ? te : "read-only", role: l.key, profile: a.profile }), y = l.profiles.filter((a) => a.group === te || a.group === ke).map(v), w = l.profiles.filter((a) => a.group !== te && a.group !== ke).map((a) => ({ ...v(a), indent: !0 })), A = { key: l.key, name: "Read-only helpers", group: !0, screen: "read-only", role: l.key, profile: "", line: `${l.running} running, ${l.kept} kept. Every profile runs up to ${l.run_limit} and keeps ${l.kept_limit ? `up to ${l.kept_limit}` : "any number"} unless it has limits of its own.` };
  return [...e, ...y, A, ...w];
}
const re = Array.from({ length: 10 }, (t, d) => (d + 1) * 1e5), Ot = (t) => t.filter((d) => !d.group && (ve(d.running, d.runLimit) || ve(d.kept, d.keptLimit ?? 0))).length;
function Ce(t, d) {
  const e = g(() => t.props.limits.rows.value ?? []), l = g(() => _t(e.value, d.value)), v = g(() => !!t.props.limits.failure.value);
  return { rows: l, unreadable: v, reread: () => t.reload("limits") };
}
const St = {
  class: "type",
  "data-agent-type-screen": ""
}, Ct = { class: "typebody" }, Tt = {
  class: "typemain",
  "data-type-settings": ""
}, At = { class: "typeside" }, oe = "none", xt = "worker", Rt = {
  __name: "AgentSettingsTypeScreen",
  props: { row: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back"],
  setup(t, { emit: d }) {
    const e = t, l = d, v = ee(), y = g(() => v.props["type-screen"].data.value), w = g(() => {
      var u;
      return ((u = y.value) == null ? void 0 : u.nodes) ?? [];
    }), A = g(() => e.row.profile !== "");
    async function a() {
      v.state["type-screen.type"] = e.row.screen, await v.reload("type-screen");
    }
    ie(y, (u) => {
      u && e.draft.load([u]);
    }), Q(a);
    const T = g(() => (e.draft.value(se) ?? []).map((u) => u.split(":"))), L = g(() => T.value.find((u) => u[0] === e.row.profile)), P = g(() => ({ running: Number(e.draft.value(kt)), kept: Number(e.draft.value(ht)) })), j = (u) => L.value ? Number(L.value[u === "running" ? 1 : 2]) : null;
    function F(u, k) {
      const S = T.value.filter((f) => f[0] !== e.row.profile).map((f) => f.join(":"));
      if (k === null) return e.draft.set(se, S);
      if (k === "") return;
      const W = u === "running" ? k : j("running") ?? P.value.running, o = u === "kept" ? k : j("kept") ?? P.value.kept;
      e.draft.set(se, [...S, `${e.row.profile}:${W}:${o}`]);
    }
    const q = g(() => e.row.group ? "" : e.row.profile || e.row.defaultProfile || ""), U = g(() => ne(e.draft.value(Z), q.value)), B = g(() => U.value === void 0 ? "kind" : U.value === oe ? "none" : "own"), z = g(() => {
      const u = ne(e.draft.value(_e), e.row.role);
      return u === oe ? null : Number(u ?? e.draft.value(de));
    });
    function _({ mode: u, size: k }) {
      const S = (e.draft.value(Z) ?? []).filter((W) => W.slice(0, W.lastIndexOf(":")).trim() !== q.value);
      e.draft.set(Z, u === "kind" ? S : [...S, `${q.value}:${u === "none" ? oe : k}`]);
    }
    const c = g(() => e.row.role === xt ? q.value : ""), m = g(() => (e.draft.value(me) ?? []).map((u) => {
      const k = u.indexOf(":");
      return { name: u.slice(0, k).trim(), command: u.slice(k + 1).trim() };
    })), I = g(() => m.value.filter((u) => u.name === c.value).map((u) => u.command));
    function V(u) {
      const k = m.value.filter((S) => S.name !== c.value).map((S) => `${S.name}: ${S.command}`);
      e.draft.set(me, [...k, ...u.map((S) => `${c.value}: ${S}`)]);
    }
    const M = (u) => v.open("agents.agents", u.id);
    return (u, k) => (s(), p("div", St, [
      C(r(Me), {
        parent: "Helpers",
        current: t.row.name,
        onBack: k[0] || (k[0] = (S) => l("back"))
      }, null, 8, ["current"]),
      i("div", Ct, [
        i("div", Tt, [
          A.value && t.row.screen === "read-only" ? (s(), p(D, { key: 0 }, [
            C(r(pe), {
              label: "Running",
              help: "Agents of this profile that run at once.",
              "every-value": P.value.running,
              "own-value": j("running"),
              disabled: t.readOnly,
              "data-override-running": "",
              "onUpdate:ownValue": k[1] || (k[1] = (S) => F("running", S))
            }, null, 8, ["every-value", "own-value", "disabled"]),
            C(r(pe), {
              label: "Kept",
              help: "Agents of this profile kept until retired, running or idle. At 0 there is no limit.",
              "every-value": P.value.kept,
              "own-value": j("kept"),
              disabled: t.readOnly,
              "data-override-kept": "",
              "onUpdate:ownValue": k[2] || (k[2] = (S) => F("kept", S))
            }, null, 8, ["every-value", "own-value", "disabled"])
          ], 64)) : (s(), N(r($e), {
            key: 1,
            nodes: w.value,
            draft: t.draft,
            "read-only": t.readOnly
          }, null, 8, ["nodes", "draft", "read-only"])),
          c.value ? (s(), N(r(fe), {
            key: 2,
            label: "When merged",
            help: "Commands run in the main checkout after a worker of this profile is merged. One that fails is told to the main agent; the merge stands.",
            source: I.value.length ? "own" : "default",
            "data-merge-hooks": ""
          }, {
            default: E(() => [
              C(r(Ue), {
                "model-value": I.value,
                placeholder: "a command",
                disabled: t.readOnly,
                "onUpdate:modelValue": V
              }, null, 8, ["model-value", "disabled"])
            ]),
            _: 1
          }, 8, ["source"])) : $("", !0),
          q.value ? (s(), N(r(fe), {
            key: 3,
            label: "Context cap",
            help: "The context size at which this type is compacted.",
            source: B.value === "own" || B.value === "none" ? "own" : "default",
            "data-context-cap": ""
          }, {
            default: E(() => [
              C(r(We), {
                mode: B.value,
                "kind-value": z.value,
                "own-value": B.value === "own" ? Number(U.value) : null,
                sizes: r(re),
                disabled: t.readOnly,
                onChange: _
              }, null, 8, ["mode", "kind-value", "own-value", "sizes", "disabled"])
            ]),
            _: 1
          }, 8, ["source"])) : $("", !0)
        ]),
        i("aside", At, [
          k[3] || (k[3] = i("h3", null, "Agents", -1)),
          C(gt, {
            role: t.row.role,
            profile: t.row.profile,
            onOpenAgent: M
          }, null, 8, ["role", "profile"])
        ])
      ])
    ]));
  }
}, Et = /* @__PURE__ */ H(Rt, [["__scopeId", "data-v-c0427867"]]), Nt = {
  class: "agents",
  "data-agent-settings-agents": ""
}, It = {
  __name: "AgentSettingsAgents",
  props: { draft: { type: Object, required: !0 } },
  setup(t) {
    const d = t, e = ee(), { rows: l, unreadable: v, reread: y } = Ce(e, d.draft), w = x(null);
    Q(y);
    const A = (a) => {
      w.value = l.value.find((T) => T.key === a);
    };
    return (a, T) => (s(), p("section", Nt, [
      w.value ? (s(), N(Et, {
        key: 0,
        row: w.value,
        draft: t.draft,
        "read-only": r(e).readOnly,
        onBack: T[0] || (T[0] = (L) => w.value = null)
      }, null, 8, ["row", "draft", "read-only"])) : r(v) ? (s(), N(r(De), {
        key: 1,
        kind: "unreadable",
        text: "The counts could not be read.",
        onRetry: r(y)
      }, null, 8, ["onRetry"])) : (s(), N(r(Ke), {
        key: 2,
        rows: r(l),
        onOpen: A
      }, null, 8, ["rows"]))
    ]));
  }
}, Bt = /* @__PURE__ */ H(It, [["__scopeId", "data-v-05cc036a"]]), Pt = {
  class: "assign",
  "data-agent-settings-assign": ""
}, jt = {
  class: "targets",
  role: "listbox",
  "aria-label": "Give tasks to"
}, Lt = ["aria-selected", "data-assign-target", "onClick"], Ft = { class: "name" }, qt = { class: "facts" }, Vt = {
  key: 0,
  class: "facts"
}, Mt = { class: "rules" }, Ut = ["data-assign-rule"], Wt = { class: "place" }, Dt = { class: "summary" }, Kt = {
  key: 0,
  class: "warning",
  "data-assign-warning": ""
}, Ht = {
  class: "activity",
  "data-assign-activity": ""
}, zt = {
  key: 1,
  class: "activity",
  "data-assign-last-skip": ""
}, Gt = {
  key: 2,
  class: "actions"
}, Yt = ["disabled", "onClick"], Xt = ["disabled", "onClick"], Jt = ["title", "onClick"], Zt = ["onClick"], Qt = {
  key: 0,
  class: "empty"
}, en = ["value", "onChange"], tn = ["value"], nn = ["onUpdate:modelValue"], an = ["value"], sn = ["onUpdate:modelValue"], on = ["disabled", "onClick"], ln = {
  key: 0,
  class: "warning",
  "data-assign-main-warning": ""
}, rn = { class: "trial" }, dn = ["disabled"], un = {
  key: 1,
  class: "verdict",
  "data-assign-recent": ""
}, cn = {
  key: 2,
  class: "trial-result",
  "data-assign-trial": ""
}, vn = { class: "verdict" }, pn = {
  key: 2,
  class: "failure",
  role: "alert",
  "data-assign-failure": ""
}, fn = "journal.suites.coding.main-writes-code", mn = {
  __name: "AgentSettingsAssign",
  props: { draft: { type: Object, required: !0 }, readOnly: Boolean },
  setup(t) {
    const d = t, e = ee(), l = g(() => e.props.assign.data.value), v = x("main"), y = x("");
    let w = 0;
    const A = () => ({ id: ++w, field: "complexity", operator: "minimum", value: "" }), a = x([A()]);
    Q(() => e.reload("assign"));
    const T = g(() => {
      var o, f;
      return ((o = l.value) == null ? void 0 : o.targets.find((R) => R.key === v.value)) ?? ((f = l.value) == null ? void 0 : f.targets[0]);
    }), L = g(() => {
      var o;
      return (((o = l.value) == null ? void 0 : o.rules) ?? []).filter((f) => {
        var R;
        return f.target_key === ((R = T.value) == null ? void 0 : R.key);
      });
    }), P = (o) => {
      var f, R;
      return ((R = (f = l.value) == null ? void 0 : f.fields.find((n) => n.field === o)) == null ? void 0 : R.operators) ?? [];
    }, j = (o) => {
      var f;
      return ((f = P(o.field).find((R) => R.operator === o.operator)) == null ? void 0 : f.needs_value) ?? !1;
    }, F = g(() => {
      var o;
      return ((o = T.value) == null ? void 0 : o.target) === "main" && d.draft.value(fn) === !1;
    });
    function q(o) {
      return { main: ["--target", "main"], agent: ["--target", "agent", "--agent", `row:${o.agent_id}`], model: ["--target", "model", "--program", o.program, "--model", o.program_model] }[o.target];
    }
    const U = (o) => [o.field, o.operator, j(o) ? o.value : ""].filter(Boolean).join(" ");
    async function B(o) {
      const f = await e.run([...o, "--revision", l.value.revision, "--environment", e.environment]);
      return y.value = f.ok ? "" : f.error, await e.reload("assign"), f.ok;
    }
    function z(o, f) {
      var R;
      o.field = f, o.operator = ((R = P(f)[0]) == null ? void 0 : R.operator) ?? "", o.value = "";
    }
    async function _() {
      const o = ["assign-rule", "make", ...q(T.value), ...a.value.flatMap((f) => ["--condition", U(f)])];
      await B(o) && (a.value = [A()]);
    }
    const c = (o, f) => B(["assign-rule", "move", String(o.id), "--to", String(o.position + f)]), m = (o) => B(["assign-rule", o.enabled ? "disable" : "enable", String(o.id)]), I = (o) => B(["assign-rule", "delete", String(o.id)]), V = x(""), M = x(null), u = x(""), k = () => a.value.map((o) => `--condition ${JSON.stringify(U(o))}`).join(" ");
    async function S() {
      const o = await e.read(`assign-rule try ${Number(V.value)} ${k()} --environment ${e.environment}`);
      y.value = o.ok ? "" : o.error, M.value = o.ok ? o.value : null;
    }
    async function W() {
      const o = await e.read(`assign-rule recent ${k()} --environment ${e.environment}`);
      y.value = o.ok ? "" : o.error, u.value = o.ok ? o.value.text : "";
    }
    return (o, f) => {
      var R;
      return s(), p("section", Pt, [
        l.value ? (s(), p(D, { key: 0 }, [
          i("div", jt, [
            (s(!0), p(D, null, K(l.value.targets, (n) => {
              var h, O;
              return s(), p("button", {
                key: n.key,
                type: "button",
                class: X(["target", { chosen: n.key === ((h = T.value) == null ? void 0 : h.key) }]),
                "aria-selected": n.key === ((O = T.value) == null ? void 0 : O.key),
                "data-assign-target": n.key,
                onClick: (En) => v.value = n.key
              }, [
                i("span", Ft, b(n.label), 1),
                i("span", qt, b(n.description), 1),
                n.target === "agent" ? (s(), p("span", Vt, "State: " + b(n.running ? "running" : "kept") + " · Open tasks: " + b(n.open_tasks), 1)) : $("", !0)
              ], 10, Lt);
            }), 128))
          ]),
          i("div", Mt, [
            f[4] || (f[4] = i("p", { class: "note" }, "The rules are tried in order and the first match wins.", -1)),
            (s(!0), p(D, null, K(L.value, (n) => (s(), p("div", {
              key: n.id,
              class: X(["rule", { off: !n.enabled, warned: n.warning }]),
              "data-assign-rule": n.id
            }, [
              i("span", Wt, b(n.position), 1),
              i("span", Dt, b(n.summary), 1),
              n.warning ? (s(), p("span", Kt, b(n.warning), 1)) : $("", !0),
              i("span", Ht, b(n.activity.text), 1),
              n.activity.last_skip ? (s(), p("span", zt, "Last skipped: " + b(n.activity.last_skip), 1)) : $("", !0),
              t.readOnly ? $("", !0) : (s(), p("span", Gt, [
                i("button", {
                  type: "button",
                  title: "Move the rule up",
                  disabled: n.position === 1,
                  onClick: (h) => c(n, -1)
                }, "↑", 8, Yt),
                i("button", {
                  type: "button",
                  title: "Move the rule down",
                  disabled: n.position === l.value.rules.length,
                  onClick: (h) => c(n, 1)
                }, "↓", 8, Xt),
                i("button", {
                  type: "button",
                  title: n.enabled ? "Turn the rule off" : "Turn the rule on",
                  onClick: (h) => m(n)
                }, b(n.enabled ? "Turn off" : "Turn on"), 9, Jt),
                i("button", {
                  type: "button",
                  title: "Delete the rule",
                  onClick: (h) => I(n)
                }, "Delete", 8, Zt)
              ]))
            ], 10, Ut))), 128)),
            L.value.length ? $("", !0) : (s(), p("p", Qt, "No rules give tasks to " + b((R = T.value) == null ? void 0 : R.label) + " yet.", 1)),
            t.readOnly ? $("", !0) : (s(), p("form", {
              key: 1,
              class: "editor",
              "data-assign-editor": "",
              onSubmit: be(_, ["prevent"])
            }, [
              f[2] || (f[2] = i("p", { class: "all" }, "A task must meet all of these conditions:", -1)),
              (s(!0), p(D, null, K(a.value, (n, h) => (s(), p("div", {
                key: n.id,
                class: "condition"
              }, [
                i("select", {
                  value: n.field,
                  "aria-label": "Condition",
                  onChange: (O) => z(n, O.target.value)
                }, [
                  (s(!0), p(D, null, K(l.value.fields, (O) => (s(), p("option", {
                    key: O.field,
                    value: O.field
                  }, b(O.field === "any" ? "Any task" : O.field), 9, tn))), 128))
                ], 40, en),
                ae(i("select", {
                  "onUpdate:modelValue": (O) => n.operator = O,
                  "aria-label": "Comparison"
                }, [
                  (s(!0), p(D, null, K(P(n.field), (O) => (s(), p("option", {
                    key: O.operator,
                    value: O.operator
                  }, b(O.label), 9, an))), 128))
                ], 8, nn), [
                  [Te, n.operator]
                ]),
                j(n) ? ae((s(), p("input", {
                  key: 0,
                  "onUpdate:modelValue": (O) => n.value = O,
                  "aria-label": "Value",
                  placeholder: "For example: 4 or migration"
                }, null, 8, sn)), [
                  [ue, n.value]
                ]) : $("", !0),
                i("button", {
                  type: "button",
                  title: "Remove the condition",
                  disabled: a.value.length === 1,
                  onClick: (O) => a.value.splice(h, 1)
                }, "Remove", 8, on)
              ]))), 128)),
              i("button", {
                type: "button",
                onClick: f[0] || (f[0] = (n) => a.value.push(A()))
              }, "Add a condition"),
              F.value ? (s(), p("p", ln, "The main agent writes no code here, so a rule that gives it a task is skipped.")) : $("", !0),
              i("div", rn, [
                ae(i("input", {
                  "onUpdate:modelValue": f[1] || (f[1] = (n) => V.value = n),
                  type: "number",
                  min: "1",
                  "aria-label": "Task to try the rule on",
                  placeholder: "Task number",
                  "data-assign-trial-task": ""
                }, null, 512), [
                  [ue, V.value]
                ]),
                i("button", {
                  type: "button",
                  disabled: !V.value,
                  "data-assign-try": "",
                  onClick: S
                }, "Try on this task", 8, dn),
                i("button", {
                  type: "button",
                  "data-assign-count": "",
                  onClick: W
                }, "Count the last 20 tasks")
              ]),
              u.value ? (s(), p("p", un, b(u.value), 1)) : $("", !0),
              M.value ? (s(), p("div", cn, [
                i("p", vn, b(M.value.matches ? "The rule would match" : "The rule would not match") + " task " + b(M.value.task_id) + ". Nothing is assigned.", 1),
                (s(!0), p(D, null, K(M.value.conditions, (n) => (s(), p("p", {
                  key: n.label,
                  class: X(["said", { missed: !n.matched }])
                }, b(n.label) + ": " + b(n.matched ? "met" : "not met"), 3))), 128))
              ])) : $("", !0),
              f[3] || (f[3] = i("button", {
                type: "submit",
                class: "save"
              }, "Add the rule", -1))
            ], 32)),
            y.value ? (s(), p("p", pn, b(y.value), 1)) : $("", !0)
          ])
        ], 64)) : $("", !0)
      ]);
    };
  }
}, gn = /* @__PURE__ */ H(mn, [["__scopeId", "data-v-f080b579"]]), yn = { class: "screen" }, kn = { class: "rail" }, hn = {
  __name: "AgentSettingsScreen",
  props: { nodes: { type: Array, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 }, extras: { type: Object, default: () => ({}) }, found: { type: String, default: "" } },
  setup(t) {
    const d = t, e = x(null), l = g(() => He(d.nodes));
    ie(() => d.found, (y) => y && Ae(() => {
      var w, A;
      return (A = (w = e.value) == null ? void 0 : w.querySelector(`[data-setting="${y}"]`)) == null ? void 0 : A.scrollIntoView({ block: "center" });
    }), { immediate: !0, flush: "post" });
    const v = (y) => {
      var w, A;
      return (A = (w = e.value) == null ? void 0 : w.querySelector(`[data-section="${y}"]`)) == null ? void 0 : A.scrollIntoView({ block: "start", behavior: "smooth" });
    };
    return (y, w) => (s(), p("div", yn, [
      i("nav", kn, [
        C(r(ze), {
          sections: l.value,
          scope: e.value,
          onChoose: v
        }, null, 8, ["sections", "scope"])
      ]),
      i("div", {
        ref_key: "scroll",
        ref: e,
        class: "content"
      }, [
        xe(y.$slots, "before", {}, void 0, !0),
        C(r($e), {
          nodes: t.nodes,
          draft: t.draft,
          "read-only": t.readOnly,
          extras: t.extras,
          found: t.found
        }, null, 8, ["nodes", "draft", "read-only", "extras", "found"])
      ], 512)
    ]));
  }
}, le = /* @__PURE__ */ H(hn, [["__scopeId", "data-v-1cab27ca"]]), bn = {
  key: 0,
  class: "hint",
  "data-work-hint": ""
}, wn = {
  __name: "AgentSettingsTab",
  props: { tab: { type: String, required: !0 }, active: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, isLoaded: Boolean, nodes: { type: Function, required: !0 }, readOnly: Boolean, found: { type: String, default: "" }, nothingStarts: Boolean, advancedExtras: { type: Object, required: !0 } },
  setup(t) {
    return (d, e) => (s(), p("div", {
      class: X(["settings-body", { flush: t.tab === "agents" }])
    }, [
      C(r(je), { tab: t.active }, {
        default: E(() => [
          C(r(we), { value: t.tab }, {
            work: E(() => [
              t.isLoaded ? (s(), N(le, {
                key: "work",
                nodes: t.nodes("work"),
                draft: t.draft,
                "read-only": t.readOnly,
                found: t.found,
                "data-agent-settings-work": ""
              }, {
                before: E(() => [
                  t.nothingStarts ? (s(), p("p", bn, "With Auto off and no workers, nothing starts the work: a user starts tasks or turns one of them on.")) : $("", !0)
                ]),
                _: 1
              }, 8, ["nodes", "draft", "read-only", "found"])) : $("", !0)
            ]),
            agents: E(() => [
              C(Bt, { draft: t.draft }, null, 8, ["draft"])
            ]),
            assign: E(() => [
              C(gn, {
                draft: t.draft,
                "read-only": t.readOnly
              }, null, 8, ["draft", "read-only"])
            ]),
            tests: E(() => [
              t.isLoaded ? (s(), N(le, {
                key: "tests",
                nodes: t.nodes("tests"),
                draft: t.draft,
                "read-only": t.readOnly,
                found: t.found,
                "data-agent-settings-tests": ""
              }, null, 8, ["nodes", "draft", "read-only", "found"])) : $("", !0)
            ]),
            advanced: E(() => [
              t.isLoaded ? (s(), N(le, {
                key: "advanced",
                nodes: t.nodes("advanced"),
                draft: t.draft,
                "read-only": t.readOnly,
                found: t.found,
                extras: t.advancedExtras,
                "data-agent-settings-advanced": ""
              }, null, 8, ["nodes", "draft", "read-only", "found", "extras"])) : $("", !0)
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        _: 1
      }, 8, ["tab"])
    ], 2));
  }
}, $n = {
  class: "settings",
  "data-agent-settings": ""
}, _n = { class: "head" }, On = {
  class: "env",
  "data-settings-environment": ""
}, Sn = { class: "settings-bar" }, Cn = {
  key: 1,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, Tn = "journal.suites.coding.auto-mode", An = "journal.suites.coding.workers.main-dispatches-workers", xn = 1200, Rn = {
  __name: "AgentSettings",
  setup(t) {
    const d = { work: "work-screen", tests: "tests-screen", advanced: "advanced-screen", "helper-types": "helper-types-screen" }, e = ee(), l = x("work"), v = [{ key: "work", label: "Work" }, { key: "agents", label: "Helpers", count_field: "full" }, { key: "assign", label: "Assign" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }], y = g(() => v.find((n) => n.key === l.value)), w = () => Object.values(d).map((n) => e.props[n].data.value), A = g(() => w().every(Boolean)), a = Ge({
      run: (n) => e.run(n),
      reload: async () => {
        const n = "type-screen.type" in e.state;
        await Promise.all([...Object.values(d).map((h) => e.reload(h)), e.reload("limits"), ...n ? [e.reload("type-screen")] : []]), a.load([...w(), ...n ? [e.props["type-screen"].data.value] : []]);
      }
    });
    ie(w, (n) => {
      n.every(Boolean) && a.load(n);
    }, { immediate: !0 });
    const { rows: T } = Ce(e, a), L = g(() => Ot(T.value)), P = g(() => L.value ? { full: `${L.value} full` } : {});
    Q(() => e.reload("limits"));
    const j = [{ key: "main", name: "Main agent" }, { key: "worker", name: "Workers" }, { key: "helper", name: "Read-only helpers" }], F = (n) => {
      var h;
      return ((h = T.value.find((O) => O.profile === n)) == null ? void 0 : h.name) ?? n;
    }, q = g(() => (a.value(Z) ?? []).map(Se).map(({ name: n, value: h }) => ({ name: F(n), value: h === "none" ? "no cap" : `${Number(h) / 1e3}k` }))), U = g(() => ({ "keyed-cap-table": { rows: j, sizes: re, defaultCap: Number(a.value(de)) || re[0], ownCaps: q.value } })), B = (n) => {
      var h;
      return ((h = e.props[d[n]].data.value) == null ? void 0 : h.nodes) ?? [];
    }, z = g(() => a.value(Tn) === !1 && a.value(An) === !1), _ = g(() => !e.readOnly), c = x("main"), m = g(() => {
      var n;
      return ((n = e.props.work.data.value) == null ? void 0 : n.presets) ?? [];
    }), I = g(() => {
      var n;
      return ((n = e.props.work.data.value) == null ? void 0 : n.switches) ?? [];
    }), V = g(() => Object.fromEntries(I.value.map((n) => [n.key, a.value(n.key)]))), M = g(() => Ye(V.value, m.value)), u = (n) => a.fill(m.value.find((h) => h.key === n).values), k = g(() => {
      var n;
      return ((n = e.props.find.data.value) == null ? void 0 : n.rows) ?? [];
    }), S = x("");
    let W = null;
    const o = (n) => n.startsWith("helper-type") ? "agents" : n;
    function f(n) {
      c.value = "main", R({ key: o(n.screen) }), S.value = n.key, clearTimeout(W), W = setTimeout(() => {
        S.value = "";
      }, xn);
    }
    Re(() => clearTimeout(W));
    function R(n) {
      l.value = n.key, e.state.tab = n.key === "agents" ? "agents" : "";
    }
    return (n, h) => (s(), N(r(Le), { padding: "0" }, {
      default: E(() => [
        i("div", $n, [
          C(r(we), { value: c.value }, {
            main: E(() => [
              i("div", _n, [
                i("span", On, b(r(e).environment), 1)
              ]),
              m.value.length ? (s(), N(r(Xe), {
                key: 0,
                presets: m.value,
                current: M.value,
                disabled: r(e).readOnly,
                onPick: u,
                onOpenPage: h[0] || (h[0] = (O) => c.value = "presets")
              }, {
                default: E(() => [
                  C(r(Je), {
                    index: k.value,
                    onPick: f
                  }, null, 8, ["index"])
                ]),
                _: 1
              }, 8, ["presets", "current", "disabled"])) : $("", !0),
              i("div", Sn, [
                C(r(Fe), {
                  tabs: v,
                  active: y.value,
                  answer: P.value,
                  onChoose: R
                }, null, 8, ["active", "answer"])
              ]),
              r(e).readOnly ? (s(), p("p", Cn, "Only a user can change these settings. You can read every value, and ask a user for a change.")) : $("", !0),
              C(wn, {
                tab: l.value,
                active: y.value,
                draft: r(a),
                "is-loaded": A.value,
                nodes: B,
                "read-only": r(e).readOnly,
                found: S.value,
                "nothing-starts": z.value,
                "advanced-extras": U.value
              }, null, 8, ["tab", "active", "draft", "is-loaded", "read-only", "found", "nothing-starts", "advanced-extras"])
            ]),
            presets: E(() => [
              C(ot, {
                presets: m.value,
                switches: I.value,
                now: V.value,
                "read-only": r(e).readOnly,
                onBack: h[1] || (h[1] = (O) => c.value = "main"),
                onFill: u
              }, null, 8, ["presets", "switches", "now", "read-only"])
            ]),
            _: 1
          }, 8, ["value"]),
          _.value ? (s(), N(r(Ze), {
            key: 0,
            changes: r(a).changes(),
            "can-save": r(a).canSave.value,
            pending: r(a).pending.value,
            reason: r(a).reason.value,
            environment: r(e).environment,
            onSave: h[2] || (h[2] = (O) => r(a).apply()),
            onCancel: h[3] || (h[3] = (O) => r(a).reset())
          }, null, 8, ["changes", "can-save", "pending", "reason", "environment"])) : $("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, jn = /* @__PURE__ */ H(Rn, [["__scopeId", "data-v-f88ce405"]]);
export {
  jn as A
};
