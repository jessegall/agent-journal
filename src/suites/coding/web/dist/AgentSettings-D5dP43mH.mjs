import { openBlock as r, createElementBlock as y, createElementVNode as v, Fragment as M, renderList as W, createBlock as E, unref as l, createVNode as S, withModifiers as he, withCtx as x, createTextVNode as K, ref as N, computed as g, onMounted as X, toDisplayString as A, createCommentVNode as O, normalizeClass as ee, watch as le, withDirectives as de, vModelSelect as Ce, vModelText as Ae, nextTick as Te, renderSlot as xe, onBeforeUnmount as Ee } from "vue";
import { TextInput as Re, Btn as G, useWindow as Z, useNow as Ne, agentTitle as Ie, age as Be, agentNumber as Pe, TabBody as je, SwitchCase as be, WindowRoom as Le, InnerTabs as Fe } from "@journal/window-kit";
import { SettingPresetCard as ue, SettingPresetCompareTable as qe, SettingEmptyState as Me, isFull as ce, SettingBackPath as Ve, SettingPerTypeOverrideRow as ve, SettingsScreen as we, SettingRow as fe, SettingEntryList as Ue, SettingThreeWayCap as We, SettingBanner as De, SettingHelperTypeTable as Ke, sectionsOf as He, SettingSectionList as ze, useSettingsDraft as Ge, currentPreset as Ye, SettingPresetBand as Xe, FindBox as Ze, ChangeFoot as Je } from "@journal/setting-components";
import { _ as V } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const Qe = {
  class: "page",
  "data-agent-settings-presets": ""
}, et = { class: "crumb" }, tt = { class: "body" }, nt = { class: "cards" }, at = "Any other mix of the eight switches. The form shows Custom as soon as the switches match neither preset.", st = {
  __name: "AgentSettingsPresets",
  props: { presets: { type: Array, required: !0 }, switches: { type: Array, required: !0 }, now: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back", "fill"],
  setup(t, { emit: d }) {
    const e = d;
    return (o, f) => (r(), y("section", Qe, [
      v("div", et, [
        v("button", {
          type: "button",
          class: "back",
          "data-presets-back": "",
          onClick: f[0] || (f[0] = (k) => e("back"))
        }, "‹ Back"),
        f[1] || (f[1] = v("b", null, "What is a preset?", -1))
      ]),
      v("div", tt, [
        f[2] || (f[2] = v("p", { class: "lead" }, "A preset is a set of eight switches and nothing more. It is not a type of agent: the main agent is the same program under every preset, and a preset only fills in the switches below. Nothing is saved until you press Save.", -1)),
        v("div", nt, [
          (r(!0), y(M, null, W(t.presets, (k) => (r(), E(l(ue), {
            key: k.key,
            name: k.name,
            line: k.line,
            "can-fill": !t.readOnly,
            onFill: (w) => e("fill", k.key)
          }, null, 8, ["name", "line", "can-fill", "onFill"]))), 128)),
          S(l(ue), {
            name: "Custom",
            line: at
          })
        ]),
        S(l(qe), {
          rows: t.switches,
          presets: t.presets,
          now: t.now
        }, null, 8, ["rows", "presets", "now"])
      ])
    ]));
  }
}, ot = /* @__PURE__ */ V(st, [["__scopeId", "data-v-0d0e399d"]]), lt = { class: "action-buttons" }, rt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(t) {
    return (d, e) => (r(), y("form", {
      "data-agent-retire-confirm": "",
      onSubmit: e[2] || (e[2] = he((o) => d.$emit("submit"), ["prevent"]))
    }, [
      e[5] || (e[5] = v("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      S(l(Re), {
        "model-value": t.reason,
        label: "Reason",
        disabled: t.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": e[0] || (e[0] = (o) => d.$emit("update:reason", o))
      }, null, 8, ["model-value", "disabled"]),
      v("div", lt, [
        S(l(G), {
          type: "submit",
          small: "",
          disabled: t.pending || !t.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: x(() => [...e[3] || (e[3] = [
            K("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        S(l(G), {
          small: "",
          disabled: t.pending,
          onClick: e[1] || (e[1] = (o) => d.$emit("cancel"))
        }, {
          default: x(() => [...e[4] || (e[4] = [
            K("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, it = /* @__PURE__ */ V(rt, [["__scopeId", "data-v-818a34c9"]]), dt = {
  class: "type-agents",
  "data-type-agents": ""
}, ut = { class: "models" }, ct = ["data-count-agent"], vt = { class: "person-text" }, ft = {
  key: 2,
  role: "alert",
  class: "bad"
}, pt = {
  key: 3,
  role: "status"
}, mt = {
  __name: "AgentTypeAgents",
  props: { role: { type: String, required: !0 }, profile: { type: String, default: "" } },
  emits: ["open-agent", "retired"],
  setup(t, { emit: d }) {
    const e = t, o = d, f = Z(), k = Ne(), w = N([]), T = N(0), a = N(!1), _ = N(!1), j = N(""), B = N(""), P = N(null), L = N(""), F = g(() => w.value.filter(($) => {
      var u;
      return $.state !== "retired" && $.role === e.role && (!e.profile || (((u = $.facts) == null ? void 0 : u.profile) || $.profile) === e.profile);
    }).sort(($, u) => ($.state !== "running") - (u.state !== "running") || String($.ended_at || $.created_at).localeCompare(String(u.ended_at || u.created_at)))), q = g(() => {
      var u;
      const $ = /* @__PURE__ */ new Map();
      for (const m of F.value) {
        const R = ((u = m.facts) == null ? void 0 : u.model) || m.program_model;
        R && $.set(R, ($.get(R) || 0) + 1);
      }
      return [...$].map(([m, R]) => `${R} ${m}`).join(", ");
    });
    async function I($ = 1) {
      f.state["count-agents.role"] = e.role, e.profile ? f.state["count-agents.profile"] = e.profile : delete f.state["count-agents.profile"], f.state["count-agents.page"] = String($), await f.reload("count-agents");
      const u = f.props["count-agents"];
      w.value = $ === 1 ? [...u.rows.value] : [...w.value, ...u.rows.value], T.value = $, a.value = u.more.value;
    }
    async function U($) {
      if (!L.value.trim() || _.value) return;
      _.value = !0;
      const u = await f.run(["agent", "retire", String($.number), "--reason", L.value.trim()]);
      j.value = u.ok ? "" : "The agent could not be retired. Try again.", u.ok && (P.value = null, L.value = "", B.value = "Agent retired permanently.", o("retired"), await I()), _.value = !1;
    }
    return X(() => I()), ($, u) => (r(), y("section", dt, [
      v("p", ut, A(q.value), 1),
      F.value.length ? O("", !0) : (r(), E(l(Me), {
        key: 0,
        title: "No agents here yet",
        line: "An agent shows here as soon as one of this type starts."
      })),
      (r(!0), y(M, null, W(F.value, (m) => {
        var R, i, p, s;
        return r(), y("div", {
          key: m.id,
          class: "person",
          "data-count-agent": m.id
        }, [
          v("span", {
            class: ee(["dot", { running: m.state === "running" }])
          }, null, 2),
          v("div", vt, [
            v("strong", null, A(l(Ie)(m).text), 1),
            K(" " + A(m.state === "running" ? "Running" : "Idle") + ", " + A(l(Be)(m.state === "running" ? m.process_started_at || m.created_at : m.ended_at, l(k))) + " ", 1),
            v("small", null, A([m.program, (R = m.facts) == null ? void 0 : R.model, (i = m.facts) == null ? void 0 : i.effort, l(Pe)(m)].filter(Boolean).join(", ")), 1),
            v("small", null, A(((p = m.facts) == null ? void 0 : p.task_title) || ((s = m.facts) == null ? void 0 : s.helper_job)), 1)
          ]),
          S(l(G), {
            small: "",
            onClick: (n) => o("open-agent", m)
          }, {
            default: x(() => [...u[3] || (u[3] = [
              K("Open", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]),
          m.state === "idle" && !l(f).readOnly ? (r(), E(l(G), {
            key: 0,
            small: "",
            onClick: (n) => {
              P.value = m.id, L.value = "";
            }
          }, {
            default: x(() => [...u[4] || (u[4] = [
              K("Retire", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])) : O("", !0),
          P.value === m.id ? (r(), E(it, {
            key: 1,
            reason: L.value,
            "onUpdate:reason": u[0] || (u[0] = (n) => L.value = n),
            pending: _.value,
            onSubmit: (n) => U(m),
            onCancel: u[1] || (u[1] = (n) => P.value = null)
          }, null, 8, ["reason", "pending", "onSubmit"])) : O("", !0)
        ], 8, ct);
      }), 128)),
      a.value ? (r(), E(l(G), {
        key: 1,
        small: "",
        onClick: u[2] || (u[2] = (m) => I(T.value + 1))
      }, {
        default: x(() => [...u[5] || (u[5] = [
          K("Show more", -1)
        ])]),
        _: 1
      })) : O("", !0),
      j.value ? (r(), y("p", ft, A(j.value), 1)) : B.value ? (r(), y("p", pt, A(B.value), 1)) : O("", !0)
    ]));
  }
}, gt = /* @__PURE__ */ V(mt, [["__scopeId", "data-v-77081f39"]]), D = "journal.core.helpers", yt = `${D}.context-limit-on`, re = `${D}.context-limit-tokens`, $e = `${D}.context-limit-kinds`, Y = `${D}.context-limit-profiles`, ne = `${D}.read-only-helper-profile-limits`, kt = `${D}.read-only-helper-run-limit`, ht = `${D}.read-only-helper-kept-limit`, pe = "journal.suites.coding.workers.merge-hooks", bt = "none", Oe = (t) => `${t / 1e3}k`, Se = (t) => {
  const d = t.lastIndexOf(":");
  return { name: t.slice(0, d).trim(), value: t.slice(d + 1).trim() };
}, te = (t, d) => {
  var e;
  return (e = (t ?? []).map(Se).find((o) => o.name === d)) == null ? void 0 : e.value;
}, me = (t) => t === bt ? "No cap" : Oe(Number(t));
function ge(t, d, e) {
  if (t(yt) !== !0) return { text: "Off", where: "Context limit is off", own: !1 };
  const o = e ? te(t(Y), e) : void 0;
  if (o !== void 0) return { text: me(o), where: "Own value", own: !0 };
  const f = te(t($e), d);
  return f !== void 0 ? { text: me(f), where: "Set for its type", own: !1 } : { text: Oe(Number(t(re))), where: "Set for every agent", own: !1 };
}
const wt = (t) => t > 0 ? t : null, $t = { worker: "workers" }, Q = "merger", ye = "designer";
function ke(t, d, e, o, f, k = {}) {
  return { key: t, name: d, line: e, running: o.running, runLimit: o.run_limit, kept: o.kept, keptLimit: wt(o.kept_limit), cap: f, ...k };
}
function Ot(t, d) {
  const e = t.filter((a) => !a.per_profile).map((a) => ke(a.key, a.label, a.line, a, ge(d, a.key, ""), { screen: $t[a.key] ?? "read-only", role: a.key, profile: "", defaultProfile: a.default_profile })), o = t.find((a) => a.per_profile);
  if (!o) return e;
  const f = (a) => ke(`${o.key}:${a.profile}`, a.title, a.line, a, ge(d, o.key, a.profile), { screen: a.group === Q ? Q : "read-only", role: o.key, profile: a.profile }), k = o.profiles.filter((a) => a.group === Q || a.group === ye).map(f), w = o.profiles.filter((a) => a.group !== Q && a.group !== ye).map((a) => ({ ...f(a), indent: !0 })), T = { key: o.key, name: "Read-only helpers", group: !0, screen: "read-only", role: o.key, profile: "", line: `${o.running} running, ${o.kept} kept. Every profile runs up to ${o.run_limit} and keeps ${o.kept_limit ? `up to ${o.kept_limit}` : "any number"} unless it has limits of its own.` };
  return [...e, ...k, T, ...w];
}
const oe = Array.from({ length: 10 }, (t, d) => (d + 1) * 1e5), St = (t) => t.filter((d) => !d.group && (ce(d.running, d.runLimit) || ce(d.kept, d.keptLimit ?? 0))).length;
function _e(t, d) {
  const e = g(() => t.props.limits.rows.value ?? []), o = g(() => Ot(e.value, d.value)), f = g(() => !!t.props.limits.failure.value);
  return { rows: o, unreadable: f, reread: () => t.reload("limits") };
}
const _t = {
  class: "type",
  "data-agent-type-screen": ""
}, Ct = { class: "typebody" }, At = {
  class: "typemain",
  "data-type-settings": ""
}, Tt = { class: "typeside" }, ae = "none", xt = "worker", Et = {
  __name: "AgentSettingsTypeScreen",
  props: { row: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back"],
  setup(t, { emit: d }) {
    const e = t, o = d, f = Z(), k = g(() => f.props["type-screen"].data.value), w = g(() => {
      var s;
      return ((s = k.value) == null ? void 0 : s.nodes) ?? [];
    }), T = g(() => e.row.profile !== "");
    async function a() {
      f.state["type-screen.type"] = e.row.screen, await f.reload("type-screen");
    }
    le(k, (s) => {
      s && e.draft.load([s]);
    }), X(a);
    const _ = g(() => (e.draft.value(ne) ?? []).map((s) => s.split(":"))), j = g(() => _.value.find((s) => s[0] === e.row.profile)), B = g(() => ({ running: Number(e.draft.value(kt)), kept: Number(e.draft.value(ht)) })), P = (s) => j.value ? Number(j.value[s === "running" ? 1 : 2]) : null;
    function L(s, n) {
      const h = _.value.filter((H) => H[0] !== e.row.profile).map((H) => H.join(":"));
      if (n === null) return e.draft.set(ne, h);
      if (n === "") return;
      const b = s === "running" ? n : P("running") ?? B.value.running, J = s === "kept" ? n : P("kept") ?? B.value.kept;
      e.draft.set(ne, [...h, `${e.row.profile}:${b}:${J}`]);
    }
    const F = g(() => e.row.group ? "" : e.row.profile || e.row.defaultProfile || ""), q = g(() => te(e.draft.value(Y), F.value)), I = g(() => q.value === void 0 ? "kind" : q.value === ae ? "none" : "own"), U = g(() => {
      const s = te(e.draft.value($e), e.row.role);
      return s === ae ? null : Number(s ?? e.draft.value(re));
    });
    function $({ mode: s, size: n }) {
      const h = (e.draft.value(Y) ?? []).filter((b) => b.slice(0, b.lastIndexOf(":")).trim() !== F.value);
      e.draft.set(Y, s === "kind" ? h : [...h, `${F.value}:${s === "none" ? ae : n}`]);
    }
    const u = g(() => e.row.role === xt ? F.value : ""), m = g(() => (e.draft.value(pe) ?? []).map((s) => {
      const n = s.indexOf(":");
      return { name: s.slice(0, n).trim(), command: s.slice(n + 1).trim() };
    })), R = g(() => m.value.filter((s) => s.name === u.value).map((s) => s.command));
    function i(s) {
      const n = m.value.filter((h) => h.name !== u.value).map((h) => `${h.name}: ${h.command}`);
      e.draft.set(pe, [...n, ...s.map((h) => `${u.value}: ${h}`)]);
    }
    const p = (s) => f.open("agents.agents", s.id);
    return (s, n) => (r(), y("div", _t, [
      S(l(Ve), {
        parent: "Helpers",
        current: t.row.name,
        onBack: n[0] || (n[0] = (h) => o("back"))
      }, null, 8, ["current"]),
      v("div", Ct, [
        v("div", At, [
          T.value && t.row.screen === "read-only" ? (r(), y(M, { key: 0 }, [
            S(l(ve), {
              label: "Running",
              help: "Agents of this profile that run at once.",
              "every-value": B.value.running,
              "own-value": P("running"),
              disabled: t.readOnly,
              "data-override-running": "",
              "onUpdate:ownValue": n[1] || (n[1] = (h) => L("running", h))
            }, null, 8, ["every-value", "own-value", "disabled"]),
            S(l(ve), {
              label: "Kept",
              help: "Agents of this profile kept until retired, running or idle. At 0 there is no limit.",
              "every-value": B.value.kept,
              "own-value": P("kept"),
              disabled: t.readOnly,
              "data-override-kept": "",
              "onUpdate:ownValue": n[2] || (n[2] = (h) => L("kept", h))
            }, null, 8, ["every-value", "own-value", "disabled"])
          ], 64)) : (r(), E(l(we), {
            key: 1,
            nodes: w.value,
            draft: t.draft,
            "read-only": t.readOnly
          }, null, 8, ["nodes", "draft", "read-only"])),
          u.value ? (r(), E(l(fe), {
            key: 2,
            label: "When merged",
            help: "Commands run in the main checkout after a worker of this profile is merged. One that fails is told to the main agent; the merge stands.",
            source: R.value.length ? "own" : "default",
            "data-merge-hooks": ""
          }, {
            default: x(() => [
              S(l(Ue), {
                "model-value": R.value,
                placeholder: "a command",
                disabled: t.readOnly,
                "onUpdate:modelValue": i
              }, null, 8, ["model-value", "disabled"])
            ]),
            _: 1
          }, 8, ["source"])) : O("", !0),
          F.value ? (r(), E(l(fe), {
            key: 3,
            label: "Context cap",
            help: "The context size at which this type is compacted.",
            source: I.value === "own" || I.value === "none" ? "own" : "default",
            "data-context-cap": ""
          }, {
            default: x(() => [
              S(l(We), {
                mode: I.value,
                "kind-value": U.value,
                "own-value": I.value === "own" ? Number(q.value) : null,
                sizes: l(oe),
                disabled: t.readOnly,
                onChange: $
              }, null, 8, ["mode", "kind-value", "own-value", "sizes", "disabled"])
            ]),
            _: 1
          }, 8, ["source"])) : O("", !0)
        ]),
        v("aside", Tt, [
          n[3] || (n[3] = v("h3", null, "Agents", -1)),
          S(gt, {
            role: t.row.role,
            profile: t.row.profile,
            onOpenAgent: p
          }, null, 8, ["role", "profile"])
        ])
      ])
    ]));
  }
}, Rt = /* @__PURE__ */ V(Et, [["__scopeId", "data-v-d0c0ed1e"]]), Nt = {
  class: "agents",
  "data-agent-settings-agents": ""
}, It = {
  __name: "AgentSettingsAgents",
  props: { draft: { type: Object, required: !0 } },
  setup(t) {
    const d = t, e = Z(), { rows: o, unreadable: f, reread: k } = _e(e, d.draft), w = N(null);
    X(k);
    const T = (a) => {
      w.value = o.value.find((_) => _.key === a);
    };
    return (a, _) => (r(), y("section", Nt, [
      w.value ? (r(), E(Rt, {
        key: 0,
        row: w.value,
        draft: t.draft,
        "read-only": l(e).readOnly,
        onBack: _[0] || (_[0] = (j) => w.value = null)
      }, null, 8, ["row", "draft", "read-only"])) : l(f) ? (r(), E(l(De), {
        key: 1,
        kind: "unreadable",
        text: "The counts could not be read.",
        onRetry: l(k)
      }, null, 8, ["onRetry"])) : (r(), E(l(Ke), {
        key: 2,
        rows: l(o),
        onOpen: T
      }, null, 8, ["rows"]))
    ]));
  }
}, Bt = /* @__PURE__ */ V(It, [["__scopeId", "data-v-c7e6716c"]]), Pt = {
  class: "assign",
  "data-agent-settings-assign": ""
}, jt = {
  class: "targets",
  role: "listbox",
  "aria-label": "Give tasks to"
}, Lt = ["aria-selected", "data-assign-target", "onClick"], Ft = { class: "name" }, qt = { class: "facts" }, Mt = {
  key: 0,
  class: "facts"
}, Vt = { class: "rules" }, Ut = ["data-assign-rule"], Wt = { class: "place" }, Dt = { class: "summary" }, Kt = {
  key: 0,
  class: "warning",
  "data-assign-warning": ""
}, Ht = {
  key: 1,
  class: "actions"
}, zt = ["disabled", "onClick"], Gt = ["disabled", "onClick"], Yt = ["title", "onClick"], Xt = ["onClick"], Zt = {
  key: 0,
  class: "empty"
}, Jt = ["value", "onChange"], Qt = ["value"], en = ["onUpdate:modelValue"], tn = ["value"], nn = ["onUpdate:modelValue"], an = ["disabled", "onClick"], sn = {
  key: 0,
  class: "warning",
  "data-assign-main-warning": ""
}, on = {
  key: 2,
  class: "failure",
  role: "alert",
  "data-assign-failure": ""
}, ln = "journal.suites.coding.main-writes-code", rn = {
  __name: "AgentSettingsAssign",
  props: { draft: { type: Object, required: !0 }, readOnly: Boolean },
  setup(t) {
    const d = t, e = Z(), o = g(() => e.props.assign.data.value), f = N("main"), k = N("");
    let w = 0;
    const T = () => ({ id: ++w, field: "complexity", operator: "minimum", value: "" }), a = N([T()]);
    X(() => e.reload("assign"));
    const _ = g(() => {
      var i, p;
      return ((i = o.value) == null ? void 0 : i.targets.find((s) => s.key === f.value)) ?? ((p = o.value) == null ? void 0 : p.targets[0]);
    }), j = g(() => {
      var i;
      return (((i = o.value) == null ? void 0 : i.rules) ?? []).filter((p) => {
        var s;
        return p.target_key === ((s = _.value) == null ? void 0 : s.key);
      });
    }), B = (i) => {
      var p, s;
      return ((s = (p = o.value) == null ? void 0 : p.fields.find((n) => n.field === i)) == null ? void 0 : s.operators) ?? [];
    }, P = (i) => {
      var p;
      return ((p = B(i.field).find((s) => s.operator === i.operator)) == null ? void 0 : p.needs_value) ?? !1;
    }, L = g(() => {
      var i;
      return ((i = _.value) == null ? void 0 : i.target) === "main" && d.draft.value(ln) === !1;
    });
    function F(i) {
      return { main: ["--target", "main"], agent: ["--target", "agent", "--agent", `row:${i.agent_id}`], model: ["--target", "model", "--program", i.program, "--model", i.program_model] }[i.target];
    }
    const q = (i) => [i.field, i.operator, P(i) ? i.value : ""].filter(Boolean).join(" ");
    async function I(i) {
      const p = await e.run([...i, "--revision", o.value.revision, "--environment", e.environment]);
      return k.value = p.ok ? "" : p.error, await e.reload("assign"), p.ok;
    }
    function U(i, p) {
      var s;
      i.field = p, i.operator = ((s = B(p)[0]) == null ? void 0 : s.operator) ?? "", i.value = "";
    }
    async function $() {
      const i = ["assign-rule", "make", ...F(_.value), ...a.value.flatMap((p) => ["--condition", q(p)])];
      await I(i) && (a.value = [T()]);
    }
    const u = (i, p) => I(["assign-rule", "move", String(i.id), "--to", String(i.position + p)]), m = (i) => I(["assign-rule", i.enabled ? "disable" : "enable", String(i.id)]), R = (i) => I(["assign-rule", "delete", String(i.id)]);
    return (i, p) => {
      var s;
      return r(), y("section", Pt, [
        o.value ? (r(), y(M, { key: 0 }, [
          v("div", jt, [
            (r(!0), y(M, null, W(o.value.targets, (n) => {
              var h, b;
              return r(), y("button", {
                key: n.key,
                type: "button",
                class: ee(["target", { chosen: n.key === ((h = _.value) == null ? void 0 : h.key) }]),
                "aria-selected": n.key === ((b = _.value) == null ? void 0 : b.key),
                "data-assign-target": n.key,
                onClick: (J) => f.value = n.key
              }, [
                v("span", Ft, A(n.label), 1),
                v("span", qt, A(n.description), 1),
                n.target === "agent" ? (r(), y("span", Mt, "State: " + A(n.running ? "running" : "kept") + " · Open tasks: " + A(n.open_tasks), 1)) : O("", !0)
              ], 10, Lt);
            }), 128))
          ]),
          v("div", Vt, [
            p[3] || (p[3] = v("p", { class: "note" }, "The rules are tried in order and the first match wins.", -1)),
            (r(!0), y(M, null, W(j.value, (n) => (r(), y("div", {
              key: n.id,
              class: ee(["rule", { off: !n.enabled, warned: n.warning }]),
              "data-assign-rule": n.id
            }, [
              v("span", Wt, A(n.position), 1),
              v("span", Dt, A(n.summary), 1),
              n.warning ? (r(), y("span", Kt, A(n.warning), 1)) : O("", !0),
              t.readOnly ? O("", !0) : (r(), y("span", Ht, [
                v("button", {
                  type: "button",
                  title: "Move the rule up",
                  disabled: n.position === 1,
                  onClick: (h) => u(n, -1)
                }, "↑", 8, zt),
                v("button", {
                  type: "button",
                  title: "Move the rule down",
                  disabled: n.position === o.value.rules.length,
                  onClick: (h) => u(n, 1)
                }, "↓", 8, Gt),
                v("button", {
                  type: "button",
                  title: n.enabled ? "Turn the rule off" : "Turn the rule on",
                  onClick: (h) => m(n)
                }, A(n.enabled ? "Turn off" : "Turn on"), 9, Yt),
                v("button", {
                  type: "button",
                  title: "Delete the rule",
                  onClick: (h) => R(n)
                }, "Delete", 8, Xt)
              ]))
            ], 10, Ut))), 128)),
            j.value.length ? O("", !0) : (r(), y("p", Zt, "No rules give tasks to " + A((s = _.value) == null ? void 0 : s.label) + " yet.", 1)),
            t.readOnly ? O("", !0) : (r(), y("form", {
              key: 1,
              class: "editor",
              "data-assign-editor": "",
              onSubmit: he($, ["prevent"])
            }, [
              p[1] || (p[1] = v("p", { class: "all" }, "A task must meet all of these conditions:", -1)),
              (r(!0), y(M, null, W(a.value, (n, h) => (r(), y("div", {
                key: n.id,
                class: "condition"
              }, [
                v("select", {
                  value: n.field,
                  "aria-label": "Condition",
                  onChange: (b) => U(n, b.target.value)
                }, [
                  (r(!0), y(M, null, W(o.value.fields, (b) => (r(), y("option", {
                    key: b.field,
                    value: b.field
                  }, A(b.field === "any" ? "Any task" : b.field), 9, Qt))), 128))
                ], 40, Jt),
                de(v("select", {
                  "onUpdate:modelValue": (b) => n.operator = b,
                  "aria-label": "Comparison"
                }, [
                  (r(!0), y(M, null, W(B(n.field), (b) => (r(), y("option", {
                    key: b.operator,
                    value: b.operator
                  }, A(b.label), 9, tn))), 128))
                ], 8, en), [
                  [Ce, n.operator]
                ]),
                P(n) ? de((r(), y("input", {
                  key: 0,
                  "onUpdate:modelValue": (b) => n.value = b,
                  "aria-label": "Value",
                  placeholder: "For example: 4 or migration"
                }, null, 8, nn)), [
                  [Ae, n.value]
                ]) : O("", !0),
                v("button", {
                  type: "button",
                  title: "Remove the condition",
                  disabled: a.value.length === 1,
                  onClick: (b) => a.value.splice(h, 1)
                }, "Remove", 8, an)
              ]))), 128)),
              v("button", {
                type: "button",
                onClick: p[0] || (p[0] = (n) => a.value.push(T()))
              }, "Add a condition"),
              L.value ? (r(), y("p", sn, "The main agent writes no code here, so a rule that gives it a task is skipped.")) : O("", !0),
              p[2] || (p[2] = v("button", {
                type: "submit",
                class: "save"
              }, "Add the rule", -1))
            ], 32)),
            k.value ? (r(), y("p", on, A(k.value), 1)) : O("", !0)
          ])
        ], 64)) : O("", !0)
      ]);
    };
  }
}, dn = /* @__PURE__ */ V(rn, [["__scopeId", "data-v-3cad056f"]]), un = { class: "screen" }, cn = { class: "rail" }, vn = {
  __name: "AgentSettingsScreen",
  props: { nodes: { type: Array, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 }, extras: { type: Object, default: () => ({}) }, found: { type: String, default: "" } },
  setup(t) {
    const d = t, e = N(null), o = g(() => He(d.nodes));
    le(() => d.found, (k) => k && Te(() => {
      var w, T;
      return (T = (w = e.value) == null ? void 0 : w.querySelector(`[data-setting="${k}"]`)) == null ? void 0 : T.scrollIntoView({ block: "center" });
    }), { immediate: !0, flush: "post" });
    const f = (k) => {
      var w, T;
      return (T = (w = e.value) == null ? void 0 : w.querySelector(`[data-section="${k}"]`)) == null ? void 0 : T.scrollIntoView({ block: "start", behavior: "smooth" });
    };
    return (k, w) => (r(), y("div", un, [
      v("nav", cn, [
        S(l(ze), {
          sections: o.value,
          scope: e.value,
          onChoose: f
        }, null, 8, ["sections", "scope"])
      ]),
      v("div", {
        ref_key: "scroll",
        ref: e,
        class: "content"
      }, [
        xe(k.$slots, "before", {}, void 0, !0),
        S(l(we), {
          nodes: t.nodes,
          draft: t.draft,
          "read-only": t.readOnly,
          extras: t.extras,
          found: t.found
        }, null, 8, ["nodes", "draft", "read-only", "extras", "found"])
      ], 512)
    ]));
  }
}, se = /* @__PURE__ */ V(vn, [["__scopeId", "data-v-ab3a8dd5"]]), fn = {
  key: 0,
  class: "hint",
  "data-work-hint": ""
}, pn = {
  __name: "AgentSettingsTab",
  props: { tab: { type: String, required: !0 }, active: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, isLoaded: Boolean, nodes: { type: Function, required: !0 }, readOnly: Boolean, found: { type: String, default: "" }, nothingStarts: Boolean, advancedExtras: { type: Object, required: !0 } },
  setup(t) {
    return (d, e) => (r(), y("div", {
      class: ee(["settings-body", { flush: t.tab === "agents" }])
    }, [
      S(l(je), { tab: t.active }, {
        default: x(() => [
          S(l(be), { value: t.tab }, {
            work: x(() => [
              t.isLoaded ? (r(), E(se, {
                key: "work",
                nodes: t.nodes("work"),
                draft: t.draft,
                "read-only": t.readOnly,
                found: t.found,
                "data-agent-settings-work": ""
              }, {
                before: x(() => [
                  t.nothingStarts ? (r(), y("p", fn, "With Auto off and no workers, nothing starts the work: a user starts tasks or turns one of them on.")) : O("", !0)
                ]),
                _: 1
              }, 8, ["nodes", "draft", "read-only", "found"])) : O("", !0)
            ]),
            agents: x(() => [
              S(Bt, { draft: t.draft }, null, 8, ["draft"])
            ]),
            assign: x(() => [
              S(dn, {
                draft: t.draft,
                "read-only": t.readOnly
              }, null, 8, ["draft", "read-only"])
            ]),
            tests: x(() => [
              t.isLoaded ? (r(), E(se, {
                key: "tests",
                nodes: t.nodes("tests"),
                draft: t.draft,
                "read-only": t.readOnly,
                found: t.found,
                "data-agent-settings-tests": ""
              }, null, 8, ["nodes", "draft", "read-only", "found"])) : O("", !0)
            ]),
            advanced: x(() => [
              t.isLoaded ? (r(), E(se, {
                key: "advanced",
                nodes: t.nodes("advanced"),
                draft: t.draft,
                "read-only": t.readOnly,
                found: t.found,
                extras: t.advancedExtras,
                "data-agent-settings-advanced": ""
              }, null, 8, ["nodes", "draft", "read-only", "found", "extras"])) : O("", !0)
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        _: 1
      }, 8, ["tab"])
    ], 2));
  }
}, mn = {
  class: "settings",
  "data-agent-settings": ""
}, gn = { class: "head" }, yn = {
  class: "env",
  "data-settings-environment": ""
}, kn = { class: "settings-bar" }, hn = {
  key: 1,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, bn = "journal.suites.coding.auto-mode", wn = "journal.suites.coding.workers.main-dispatches-workers", $n = 1200, On = {
  __name: "AgentSettings",
  setup(t) {
    const d = { work: "work-screen", tests: "tests-screen", advanced: "advanced-screen", "helper-types": "helper-types-screen" }, e = Z(), o = N("work"), f = [{ key: "work", label: "Work" }, { key: "agents", label: "Helpers", count_field: "full" }, { key: "assign", label: "Assign" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }], k = g(() => f.find((c) => c.key === o.value)), w = () => Object.values(d).map((c) => e.props[c].data.value), T = g(() => w().every(Boolean)), a = Ge({
      run: (c) => e.run(c),
      reload: async () => {
        const c = "type-screen.type" in e.state;
        await Promise.all([...Object.values(d).map((C) => e.reload(C)), e.reload("limits"), ...c ? [e.reload("type-screen")] : []]), a.load([...w(), ...c ? [e.props["type-screen"].data.value] : []]);
      }
    });
    le(w, (c) => {
      c.every(Boolean) && a.load(c);
    }, { immediate: !0 });
    const { rows: _ } = _e(e, a), j = g(() => St(_.value)), B = g(() => j.value ? { full: `${j.value} full` } : {});
    X(() => e.reload("limits"));
    const P = [{ key: "main", name: "Main agent" }, { key: "worker", name: "Workers" }, { key: "helper", name: "Read-only helpers" }], L = (c) => {
      var C;
      return ((C = _.value.find((z) => z.profile === c)) == null ? void 0 : C.name) ?? c;
    }, F = g(() => (a.value(Y) ?? []).map(Se).map(({ name: c, value: C }) => ({ name: L(c), value: C === "none" ? "no cap" : `${Number(C) / 1e3}k` }))), q = g(() => ({ "keyed-cap-table": { rows: P, sizes: oe, defaultCap: Number(a.value(re)) || oe[0], ownCaps: F.value } })), I = (c) => {
      var C;
      return ((C = e.props[d[c]].data.value) == null ? void 0 : C.nodes) ?? [];
    }, U = g(() => a.value(bn) === !1 && a.value(wn) === !1), $ = g(() => !e.readOnly), u = N("main"), m = g(() => {
      var c;
      return ((c = e.props.work.data.value) == null ? void 0 : c.presets) ?? [];
    }), R = g(() => {
      var c;
      return ((c = e.props.work.data.value) == null ? void 0 : c.switches) ?? [];
    }), i = g(() => Object.fromEntries(R.value.map((c) => [c.key, a.value(c.key)]))), p = g(() => Ye(i.value, m.value)), s = (c) => a.fill(m.value.find((C) => C.key === c).values), n = g(() => {
      var c;
      return ((c = e.props.find.data.value) == null ? void 0 : c.rows) ?? [];
    }), h = N("");
    let b = null;
    const J = (c) => c.startsWith("helper-type") ? "agents" : c;
    function H(c) {
      u.value = "main", ie({ key: J(c.screen) }), h.value = c.key, clearTimeout(b), b = setTimeout(() => {
        h.value = "";
      }, $n);
    }
    Ee(() => clearTimeout(b));
    function ie(c) {
      o.value = c.key, e.state.tab = c.key === "agents" ? "agents" : "";
    }
    return (c, C) => (r(), E(l(Le), { padding: "0" }, {
      default: x(() => [
        v("div", mn, [
          S(l(be), { value: u.value }, {
            main: x(() => [
              v("div", gn, [
                v("span", yn, A(l(e).environment), 1)
              ]),
              m.value.length ? (r(), E(l(Xe), {
                key: 0,
                presets: m.value,
                current: p.value,
                disabled: l(e).readOnly,
                onPick: s,
                onOpenPage: C[0] || (C[0] = (z) => u.value = "presets")
              }, {
                default: x(() => [
                  S(l(Ze), {
                    index: n.value,
                    onPick: H
                  }, null, 8, ["index"])
                ]),
                _: 1
              }, 8, ["presets", "current", "disabled"])) : O("", !0),
              v("div", kn, [
                S(l(Fe), {
                  tabs: f,
                  active: k.value,
                  answer: B.value,
                  onChoose: ie
                }, null, 8, ["active", "answer"])
              ]),
              l(e).readOnly ? (r(), y("p", hn, "Only a user can change these settings. You can read every value, and ask a user for a change.")) : O("", !0),
              S(pn, {
                tab: o.value,
                active: k.value,
                draft: l(a),
                "is-loaded": T.value,
                nodes: I,
                "read-only": l(e).readOnly,
                found: h.value,
                "nothing-starts": U.value,
                "advanced-extras": q.value
              }, null, 8, ["tab", "active", "draft", "is-loaded", "read-only", "found", "nothing-starts", "advanced-extras"])
            ]),
            presets: x(() => [
              S(ot, {
                presets: m.value,
                switches: R.value,
                now: i.value,
                "read-only": l(e).readOnly,
                onBack: C[1] || (C[1] = (z) => u.value = "main"),
                onFill: s
              }, null, 8, ["presets", "switches", "now", "read-only"])
            ]),
            _: 1
          }, 8, ["value"]),
          $.value ? (r(), E(l(Je), {
            key: 0,
            changes: l(a).changes(),
            "can-save": l(a).canSave.value,
            pending: l(a).pending.value,
            reason: l(a).reason.value,
            environment: l(e).environment,
            onSave: C[2] || (C[2] = (z) => l(a).apply()),
            onCancel: C[3] || (C[3] = (z) => l(a).reset())
          }, null, 8, ["changes", "can-save", "pending", "reason", "environment"])) : O("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, Tn = /* @__PURE__ */ V(On, [["__scopeId", "data-v-f61b1e80"]]);
export {
  Tn as A
};
