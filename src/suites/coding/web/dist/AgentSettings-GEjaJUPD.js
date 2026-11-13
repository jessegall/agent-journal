import { openBlock as u, createElementBlock as C, createElementVNode as m, Fragment as ae, renderList as me, createBlock as O, unref as a, createVNode as g, withModifiers as Ce, withCtx as h, createTextVNode as M, ref as E, computed as c, onMounted as X, toDisplayString as B, createCommentVNode as A, normalizeClass as ye, watch as se, nextTick as Ae, renderSlot as Te, onBeforeUnmount as Ee } from "vue";
import { TextInput as xe, Btn as K, useWindow as Z, useNow as Ne, agentTitle as Re, age as _e, agentNumber as Ie, TabBody as Pe, SwitchCase as ge, WindowRoom as Be, InnerTabs as je } from "@journal/window-kit";
import { SettingPresetCard as le, SettingPresetCompareTable as Le, SettingEmptyState as qe, isFull as ie, SettingBackPath as Fe, SettingPerTypeOverrideRow as de, SettingsScreen as ke, SettingRow as ue, SettingEntryList as We, SettingThreeWayCap as Me, SettingBanner as Ue, SettingHelperTypeTable as He, sectionsOf as Ve, SettingSectionList as De, useSettingsDraft as Ke, currentPreset as ze, SettingPresetBand as Ge, FindBox as Ye, ChangeFoot as Xe } from "@journal/setting-components";
import { _ as F } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const Ze = {
  class: "page",
  "data-agent-settings-presets": ""
}, Je = { class: "crumb" }, Qe = { class: "body" }, et = { class: "cards" }, tt = "Any other mix of the eight switches. The form shows Custom as soon as the switches match neither preset.", nt = {
  __name: "AgentSettingsPresets",
  props: { presets: { type: Array, required: !0 }, switches: { type: Array, required: !0 }, now: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back", "fill"],
  setup(e, { emit: s }) {
    const t = s;
    return (o, i) => (u(), C("section", Ze, [
      m("div", Je, [
        m("button", {
          type: "button",
          class: "back",
          "data-presets-back": "",
          onClick: i[0] || (i[0] = (v) => t("back"))
        }, "‹ Back"),
        i[1] || (i[1] = m("b", null, "What is a preset?", -1))
      ]),
      m("div", Qe, [
        i[2] || (i[2] = m("p", { class: "lead" }, "A preset is a set of eight switches and nothing more. It is not a type of agent: the main agent is the same program under every preset, and a preset only fills in the switches below. Nothing is saved until you press Save.", -1)),
        m("div", et, [
          (u(!0), C(ae, null, me(e.presets, (v) => (u(), O(a(le), {
            key: v.key,
            name: v.name,
            line: v.line,
            "can-fill": !e.readOnly,
            onFill: (p) => t("fill", v.key)
          }, null, 8, ["name", "line", "can-fill", "onFill"]))), 128)),
          g(a(le), {
            name: "Custom",
            line: tt
          })
        ]),
        g(a(Le), {
          rows: e.switches,
          presets: e.presets,
          now: e.now
        }, null, 8, ["rows", "presets", "now"])
      ])
    ]));
  }
}, at = /* @__PURE__ */ F(nt, [["__scopeId", "data-v-cf40939d"]]), st = { class: "action-buttons" }, ot = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (s, t) => (u(), C("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = Ce((o) => s.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = m("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      g(a(xe), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (o) => s.$emit("update:reason", o))
      }, null, 8, ["model-value", "disabled"]),
      m("div", st, [
        g(a(K), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: h(() => [...t[3] || (t[3] = [
            M("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        g(a(K), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (o) => s.$emit("cancel"))
        }, {
          default: h(() => [...t[4] || (t[4] = [
            M("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, rt = /* @__PURE__ */ F(ot, [["__scopeId", "data-v-92de7dd6"]]), lt = {
  class: "type-agents",
  "data-type-agents": ""
}, it = { class: "models" }, dt = ["data-count-agent"], ut = { class: "person-text" }, ct = {
  key: 2,
  role: "alert",
  class: "bad"
}, ft = {
  key: 3,
  role: "status"
}, vt = {
  __name: "AgentTypeAgents",
  props: { role: { type: String, required: !0 }, profile: { type: String, default: "" } },
  emits: ["open-agent", "retired"],
  setup(e, { emit: s }) {
    const t = e, o = s, i = Z(), v = Ne(), p = E([]), S = E(0), n = E(!1), $ = E(!1), _ = E(""), I = E(""), x = E(null), N = E(""), R = c(() => p.value.filter((y) => {
      var l;
      return y.state !== "retired" && y.role === t.role && (!t.profile || (((l = y.facts) == null ? void 0 : l.profile) || y.profile) === t.profile);
    }).sort((y, l) => (y.state !== "running") - (l.state !== "running") || String(y.ended_at || y.created_at).localeCompare(String(l.ended_at || l.created_at)))), L = c(() => {
      var l;
      const y = /* @__PURE__ */ new Map();
      for (const d of R.value) {
        const T = ((l = d.facts) == null ? void 0 : l.model) || d.program_model;
        T && y.set(T, (y.get(T) || 0) + 1);
      }
      return [...y].map(([d, T]) => `${T} ${d}`).join(", ");
    });
    async function P(y = 1) {
      i.state["count-agents.role"] = t.role, t.profile ? i.state["count-agents.profile"] = t.profile : delete i.state["count-agents.profile"], i.state["count-agents.page"] = String(y), await i.reload("count-agents");
      const l = i.props["count-agents"];
      p.value = y === 1 ? [...l.rows.value] : [...p.value, ...l.rows.value], S.value = y, n.value = l.more.value;
    }
    async function U(y) {
      if (!N.value.trim() || $.value) return;
      $.value = !0;
      const l = await i.run(["agent", "retire", String(y.number), "--reason", N.value.trim()]);
      _.value = l.ok ? "" : "The agent could not be retired. Try again.", l.ok && (x.value = null, N.value = "", I.value = "Agent retired permanently.", o("retired"), await P()), $.value = !1;
    }
    return X(() => P()), (y, l) => (u(), C("section", lt, [
      m("p", it, B(L.value), 1),
      R.value.length ? A("", !0) : (u(), O(a(qe), {
        key: 0,
        title: "No agents here yet",
        line: "An agent shows here as soon as one of this type starts."
      })),
      (u(!0), C(ae, null, me(R.value, (d) => {
        var T, q, f, k;
        return u(), C("div", {
          key: d.id,
          class: "person",
          "data-count-agent": d.id
        }, [
          m("span", {
            class: ye(["dot", { running: d.state === "running" }])
          }, null, 2),
          m("div", ut, [
            m("strong", null, B(a(Re)(d).text), 1),
            M(" " + B(d.state === "running" ? "Running" : "Idle") + ", " + B(a(_e)(d.state === "running" ? d.process_started_at || d.created_at : d.ended_at, a(v))) + " ", 1),
            m("small", null, B([d.program, (T = d.facts) == null ? void 0 : T.model, (q = d.facts) == null ? void 0 : q.effort, a(Ie)(d)].filter(Boolean).join(", ")), 1),
            m("small", null, B(((f = d.facts) == null ? void 0 : f.task_title) || ((k = d.facts) == null ? void 0 : k.helper_job)), 1)
          ]),
          g(a(K), {
            small: "",
            onClick: (b) => o("open-agent", d)
          }, {
            default: h(() => [...l[3] || (l[3] = [
              M("Open", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]),
          d.state === "idle" && !a(i).readOnly ? (u(), O(a(K), {
            key: 0,
            small: "",
            onClick: (b) => {
              x.value = d.id, N.value = "";
            }
          }, {
            default: h(() => [...l[4] || (l[4] = [
              M("Retire", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])) : A("", !0),
          x.value === d.id ? (u(), O(rt, {
            key: 1,
            reason: N.value,
            "onUpdate:reason": l[0] || (l[0] = (b) => N.value = b),
            pending: $.value,
            onSubmit: (b) => U(d),
            onCancel: l[1] || (l[1] = (b) => x.value = null)
          }, null, 8, ["reason", "pending", "onSubmit"])) : A("", !0)
        ], 8, dt);
      }), 128)),
      n.value ? (u(), O(a(K), {
        key: 1,
        small: "",
        onClick: l[2] || (l[2] = (d) => P(S.value + 1))
      }, {
        default: h(() => [...l[5] || (l[5] = [
          M("Show more", -1)
        ])]),
        _: 1
      })) : A("", !0),
      _.value ? (u(), C("p", ct, B(_.value), 1)) : I.value ? (u(), C("p", ft, B(I.value), 1)) : A("", !0)
    ]));
  }
}, pt = /* @__PURE__ */ F(vt, [["__scopeId", "data-v-67f17bfa"]]), W = "journal.core.helpers", mt = `${W}.context-limit-on`, oe = `${W}.context-limit-tokens`, we = `${W}.context-limit-kinds`, z = `${W}.context-limit-profiles`, J = `${W}.read-only-helper-profile-limits`, yt = `${W}.read-only-helper-run-limit`, gt = `${W}.read-only-helper-kept-limit`, Q = "journal.suites.coding.workers.merge-hooks", kt = "none", be = (e) => `${e / 1e3}k`, he = (e) => {
  const s = e.lastIndexOf(":");
  return { name: e.slice(0, s).trim(), value: e.slice(s + 1).trim() };
}, Oe = (e) => {
  const s = e.indexOf(":");
  return s < 0 ? { text: e, name: "", command: "" } : { text: e, name: e.slice(0, s).trim(), command: e.slice(s + 1).trim() };
}, wt = (e, s) => (e ?? []).map(Oe).filter((t) => t.name === s).map((t) => t.command), bt = (e, s, t) => [
  ...(e ?? []).map(Oe).filter((o) => o.name !== s).map((o) => o.text),
  ...t.map((o) => `${s}: ${o}`)
], Y = (e, s) => {
  var t;
  return (t = (e ?? []).map(he).find((o) => o.name === s)) == null ? void 0 : t.value;
}, ce = (e) => e === kt ? "No cap" : be(Number(e));
function fe(e, s, t) {
  if (e(mt) !== !0) return { text: "Off", where: "Context limit is off", own: !1 };
  const o = t ? Y(e(z), t) : void 0;
  if (o !== void 0) return { text: ce(o), where: "Own value", own: !0 };
  const i = Y(e(we), s);
  return i !== void 0 ? { text: ce(i), where: "Set for its type", own: !1 } : { text: be(Number(e(oe))), where: "Set for every agent", own: !1 };
}
const ht = (e) => e > 0 ? e : null, Ot = { worker: "workers" }, G = "merger", ve = "designer";
function pe(e, s, t, o, i, v = {}) {
  return { key: e, name: s, line: t, running: o.running, runLimit: o.run_limit, kept: o.kept, keptLimit: ht(o.kept_limit), cap: i, ...v };
}
function St(e, s) {
  const t = e.filter((n) => !n.per_profile).map((n) => pe(n.key, n.label, n.line, n, fe(s, n.key, ""), { screen: Ot[n.key] ?? "read-only", role: n.key, profile: "", defaultProfile: n.default_profile })), o = e.find((n) => n.per_profile);
  if (!o) return t;
  const i = (n) => pe(`${o.key}:${n.profile}`, n.title, n.line, n, fe(s, o.key, n.profile), { screen: n.group === G ? G : "read-only", role: o.key, profile: n.profile }), v = o.profiles.filter((n) => n.group === G || n.group === ve).map(i), p = o.profiles.filter((n) => n.group !== G && n.group !== ve).map((n) => ({ ...i(n), indent: !0 })), S = { key: o.key, name: "Read-only helpers", group: !0, screen: "read-only", role: o.key, profile: "", line: `${o.running} running, ${o.kept} kept. Every profile runs up to ${o.run_limit} and keeps ${o.kept_limit ? `up to ${o.kept_limit}` : "any number"} unless it has limits of its own.` };
  return [...t, ...v, S, ...p];
}
const ne = Array.from({ length: 10 }, (e, s) => (s + 1) * 1e5), $t = (e) => e.filter((s) => !s.group && (ie(s.running, s.runLimit) || ie(s.kept, s.keptLimit ?? 0))).length;
function Se(e, s) {
  const t = c(() => e.props.limits.rows.value ?? []), o = c(() => St(t.value, s.value)), i = c(() => !!e.props.limits.failure.value);
  return { rows: o, unreadable: i, reread: () => e.reload("limits") };
}
const Ct = {
  class: "type",
  "data-agent-type-screen": ""
}, At = { class: "typebody" }, Tt = {
  class: "typemain",
  "data-type-settings": ""
}, Et = { class: "typeside" }, ee = "none", xt = "worker", Nt = {
  __name: "AgentSettingsTypeScreen",
  props: { row: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back"],
  setup(e, { emit: s }) {
    const t = e, o = s, i = Z(), v = c(() => i.props["type-screen"].data.value), p = c(() => {
      var f;
      return ((f = v.value) == null ? void 0 : f.nodes) ?? [];
    }), S = c(() => t.row.profile !== "");
    async function n() {
      i.state["type-screen.type"] = t.row.screen, await i.reload("type-screen");
    }
    se(v, (f) => {
      f && t.draft.load([f]);
    }), X(n);
    const $ = c(() => (t.draft.value(J) ?? []).map((f) => f.split(":"))), _ = c(() => $.value.find((f) => f[0] === t.row.profile)), I = c(() => ({ running: Number(t.draft.value(yt)), kept: Number(t.draft.value(gt)) })), x = (f) => _.value ? Number(_.value[f === "running" ? 1 : 2]) : null;
    function N(f, k) {
      const b = $.value.filter((V) => V[0] !== t.row.profile).map((V) => V.join(":"));
      if (k === null) return t.draft.set(J, b);
      if (k === "") return;
      const j = f === "running" ? k : x("running") ?? I.value.running, H = f === "kept" ? k : x("kept") ?? I.value.kept;
      t.draft.set(J, [...b, `${t.row.profile}:${j}:${H}`]);
    }
    const R = c(() => t.row.group ? "" : t.row.profile || t.row.defaultProfile || ""), L = c(() => Y(t.draft.value(z), R.value)), P = c(() => L.value === void 0 ? "kind" : L.value === ee ? "none" : "own"), U = c(() => {
      const f = Y(t.draft.value(we), t.row.role);
      return f === ee ? null : Number(f ?? t.draft.value(oe));
    });
    function y({ mode: f, size: k }) {
      const b = (t.draft.value(z) ?? []).filter((j) => j.slice(0, j.lastIndexOf(":")).trim() !== R.value);
      t.draft.set(z, f === "kind" ? b : [...b, `${R.value}:${f === "none" ? ee : k}`]);
    }
    const l = c(() => t.row.role === xt ? R.value : ""), d = c(() => wt(t.draft.value(Q), l.value)), T = (f) => t.draft.set(Q, bt(t.draft.value(Q), l.value, f)), q = (f) => i.open("agents.agents", f.id);
    return (f, k) => (u(), C("div", Ct, [
      g(a(Fe), {
        parent: "Helpers",
        current: e.row.name,
        onBack: k[0] || (k[0] = (b) => o("back"))
      }, null, 8, ["current"]),
      m("div", At, [
        m("div", Tt, [
          S.value && e.row.screen === "read-only" ? (u(), C(ae, { key: 0 }, [
            g(a(de), {
              label: "Running",
              help: "Agents of this profile that run at once.",
              "every-value": I.value.running,
              "own-value": x("running"),
              disabled: e.readOnly,
              "data-override-running": "",
              "onUpdate:ownValue": k[1] || (k[1] = (b) => N("running", b))
            }, null, 8, ["every-value", "own-value", "disabled"]),
            g(a(de), {
              label: "Kept",
              help: "Agents of this profile kept until retired, running or idle. At 0 there is no limit.",
              "every-value": I.value.kept,
              "own-value": x("kept"),
              disabled: e.readOnly,
              "data-override-kept": "",
              "onUpdate:ownValue": k[2] || (k[2] = (b) => N("kept", b))
            }, null, 8, ["every-value", "own-value", "disabled"])
          ], 64)) : (u(), O(a(ke), {
            key: 1,
            nodes: p.value,
            draft: e.draft,
            "read-only": e.readOnly
          }, null, 8, ["nodes", "draft", "read-only"])),
          l.value ? (u(), O(a(ue), {
            key: 2,
            label: "When merged",
            help: "Commands run in the main checkout after a worker of this profile is merged. One that fails is told to the main agent; the merge stands.",
            source: d.value.length ? "own" : "default",
            "data-merge-hooks": ""
          }, {
            default: h(() => [
              g(a(We), {
                "model-value": d.value,
                placeholder: "a command",
                disabled: e.readOnly,
                "onUpdate:modelValue": T
              }, null, 8, ["model-value", "disabled"])
            ]),
            _: 1
          }, 8, ["source"])) : A("", !0),
          R.value ? (u(), O(a(ue), {
            key: 3,
            label: "Context cap",
            help: "The context size at which this type is compacted.",
            source: P.value === "own" || P.value === "none" ? "own" : "default",
            "data-context-cap": ""
          }, {
            default: h(() => [
              g(a(Me), {
                mode: P.value,
                "kind-value": U.value,
                "own-value": P.value === "own" ? Number(L.value) : null,
                sizes: a(ne),
                disabled: e.readOnly,
                onChange: y
              }, null, 8, ["mode", "kind-value", "own-value", "sizes", "disabled"])
            ]),
            _: 1
          }, 8, ["source"])) : A("", !0)
        ]),
        m("aside", Et, [
          k[3] || (k[3] = m("h3", null, "Agents", -1)),
          g(pt, {
            role: e.row.role,
            profile: e.row.profile,
            onOpenAgent: q
          }, null, 8, ["role", "profile"])
        ])
      ])
    ]));
  }
}, Rt = /* @__PURE__ */ F(Nt, [["__scopeId", "data-v-3bc929c1"]]), _t = {
  class: "agents",
  "data-agent-settings-agents": ""
}, It = {
  __name: "AgentSettingsAgents",
  props: { draft: { type: Object, required: !0 } },
  setup(e) {
    const s = e, t = Z(), { rows: o, unreadable: i, reread: v } = Se(t, s.draft), p = E(null);
    X(v);
    const S = (n) => {
      p.value = o.value.find(($) => $.key === n);
    };
    return (n, $) => (u(), C("section", _t, [
      p.value ? (u(), O(Rt, {
        key: 0,
        row: p.value,
        draft: e.draft,
        "read-only": a(t).readOnly,
        onBack: $[0] || ($[0] = (_) => p.value = null)
      }, null, 8, ["row", "draft", "read-only"])) : a(i) ? (u(), O(a(Ue), {
        key: 1,
        kind: "unreadable",
        text: "The counts could not be read.",
        onRetry: a(v)
      }, null, 8, ["onRetry"])) : (u(), O(a(He), {
        key: 2,
        rows: a(o),
        onOpen: S
      }, null, 8, ["rows"]))
    ]));
  }
}, Pt = /* @__PURE__ */ F(It, [["__scopeId", "data-v-05cc036a"]]), Bt = { class: "screen" }, jt = { class: "rail" }, Lt = {
  __name: "AgentSettingsScreen",
  props: { nodes: { type: Array, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 }, extras: { type: Object, default: () => ({}) }, found: { type: String, default: "" } },
  setup(e) {
    const s = e, t = E(null), o = c(() => Ve(s.nodes));
    se(() => s.found, (v) => v && Ae(() => {
      var p, S;
      return (S = (p = t.value) == null ? void 0 : p.querySelector(`[data-setting="${v}"]`)) == null ? void 0 : S.scrollIntoView({ block: "center" });
    }), { immediate: !0, flush: "post" });
    const i = (v) => {
      var p, S;
      return (S = (p = t.value) == null ? void 0 : p.querySelector(`[data-section="${v}"]`)) == null ? void 0 : S.scrollIntoView({ block: "start", behavior: "smooth" });
    };
    return (v, p) => (u(), C("div", Bt, [
      m("nav", jt, [
        g(a(De), {
          sections: o.value,
          scope: t.value,
          onChoose: i
        }, null, 8, ["sections", "scope"])
      ]),
      m("div", {
        ref_key: "scroll",
        ref: t,
        class: "content"
      }, [
        Te(v.$slots, "before", {}, void 0, !0),
        g(a(ke), {
          nodes: e.nodes,
          draft: e.draft,
          "read-only": e.readOnly,
          extras: e.extras,
          found: e.found
        }, null, 8, ["nodes", "draft", "read-only", "extras", "found"])
      ], 512)
    ]));
  }
}, te = /* @__PURE__ */ F(Lt, [["__scopeId", "data-v-1cab27ca"]]), qt = {
  key: 0,
  class: "hint",
  "data-work-hint": ""
}, Ft = {
  __name: "AgentSettingsTab",
  props: { tab: { type: String, required: !0 }, active: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, isLoaded: Boolean, nodes: { type: Function, required: !0 }, readOnly: Boolean, found: { type: String, default: "" }, nothingStarts: Boolean, advancedExtras: { type: Object, required: !0 } },
  setup(e) {
    return (s, t) => (u(), C("div", {
      class: ye(["settings-body", { flush: e.tab === "agents" }])
    }, [
      g(a(Pe), { tab: e.active }, {
        default: h(() => [
          g(a(ge), { value: e.tab }, {
            work: h(() => [
              e.isLoaded ? (u(), O(te, {
                key: "work",
                nodes: e.nodes("work"),
                draft: e.draft,
                "read-only": e.readOnly,
                found: e.found,
                "data-agent-settings-work": ""
              }, {
                before: h(() => [
                  e.nothingStarts ? (u(), C("p", qt, "With Auto off and no workers, nothing starts the work: a user starts tasks or turns one of them on.")) : A("", !0)
                ]),
                _: 1
              }, 8, ["nodes", "draft", "read-only", "found"])) : A("", !0)
            ]),
            agents: h(() => [
              g(Pt, { draft: e.draft }, null, 8, ["draft"])
            ]),
            tests: h(() => [
              e.isLoaded ? (u(), O(te, {
                key: "tests",
                nodes: e.nodes("tests"),
                draft: e.draft,
                "read-only": e.readOnly,
                found: e.found,
                "data-agent-settings-tests": ""
              }, null, 8, ["nodes", "draft", "read-only", "found"])) : A("", !0)
            ]),
            advanced: h(() => [
              e.isLoaded ? (u(), O(te, {
                key: "advanced",
                nodes: e.nodes("advanced"),
                draft: e.draft,
                "read-only": e.readOnly,
                found: e.found,
                extras: e.advancedExtras,
                "data-agent-settings-advanced": ""
              }, null, 8, ["nodes", "draft", "read-only", "found", "extras"])) : A("", !0)
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        _: 1
      }, 8, ["tab"])
    ], 2));
  }
}, Wt = {
  class: "settings",
  "data-agent-settings": ""
}, Mt = { class: "head" }, Ut = {
  class: "env",
  "data-settings-environment": ""
}, Ht = { class: "settings-bar" }, Vt = {
  key: 1,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, Dt = "journal.suites.coding.auto-mode", Kt = "journal.suites.coding.workers.main-dispatches-workers", zt = 1200, Gt = {
  __name: "AgentSettings",
  setup(e) {
    const s = { work: "work-screen", tests: "tests-screen", advanced: "advanced-screen", "helper-types": "helper-types-screen" }, t = Z(), o = E("work"), i = [{ key: "work", label: "Work" }, { key: "agents", label: "Helpers", count_field: "full" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }], v = c(() => i.find((r) => r.key === o.value)), p = () => Object.values(s).map((r) => t.props[r].data.value), S = c(() => p().every(Boolean)), n = Ke({
      run: (r) => t.run(r),
      reload: async () => {
        const r = "type-screen.type" in t.state;
        await Promise.all([...Object.values(s).map((w) => t.reload(w)), t.reload("limits"), ...r ? [t.reload("type-screen")] : []]), n.load([...p(), ...r ? [t.props["type-screen"].data.value] : []]);
      }
    });
    se(p, (r) => {
      r.every(Boolean) && n.load(r);
    }, { immediate: !0 });
    const { rows: $ } = Se(t, n), _ = c(() => $t($.value)), I = c(() => _.value ? { full: `${_.value} full` } : {});
    X(() => t.reload("limits"));
    const x = [{ key: "main", name: "Main agent" }, { key: "worker", name: "Workers" }, { key: "helper", name: "Read-only helpers" }], N = (r) => {
      var w;
      return ((w = $.value.find((D) => D.profile === r)) == null ? void 0 : w.name) ?? r;
    }, R = c(() => (n.value(z) ?? []).map(he).map(({ name: r, value: w }) => ({ name: N(r), value: w === "none" ? "no cap" : `${Number(w) / 1e3}k` }))), L = c(() => ({ "keyed-cap-table": { rows: x, sizes: ne, defaultCap: Number(n.value(oe)) || ne[0], ownCaps: R.value } })), P = (r) => {
      var w;
      return ((w = t.props[s[r]].data.value) == null ? void 0 : w.nodes) ?? [];
    }, U = c(() => n.value(Dt) === !1 && n.value(Kt) === !1), y = c(() => !t.readOnly), l = E("main"), d = c(() => {
      var r;
      return ((r = t.props.work.data.value) == null ? void 0 : r.presets) ?? [];
    }), T = c(() => {
      var r;
      return ((r = t.props.work.data.value) == null ? void 0 : r.switches) ?? [];
    }), q = c(() => Object.fromEntries(T.value.map((r) => [r.key, n.value(r.key)]))), f = c(() => ze(q.value, d.value)), k = (r) => n.fill(d.value.find((w) => w.key === r).values), b = c(() => {
      var r;
      return ((r = t.props.find.data.value) == null ? void 0 : r.rows) ?? [];
    }), j = E("");
    let H = null;
    const V = (r) => r.startsWith("helper-type") ? "agents" : r;
    function $e(r) {
      l.value = "main", re({ key: V(r.screen) }), j.value = r.key, clearTimeout(H), H = setTimeout(() => {
        j.value = "";
      }, zt);
    }
    Ee(() => clearTimeout(H));
    function re(r) {
      o.value = r.key, t.state.tab = r.key === "agents" ? "agents" : "";
    }
    return (r, w) => (u(), O(a(Be), { padding: "0" }, {
      default: h(() => [
        m("div", Wt, [
          g(a(ge), { value: l.value }, {
            main: h(() => [
              m("div", Mt, [
                m("span", Ut, B(a(t).environment), 1)
              ]),
              d.value.length ? (u(), O(a(Ge), {
                key: 0,
                presets: d.value,
                current: f.value,
                disabled: a(t).readOnly,
                onPick: k,
                onOpenPage: w[0] || (w[0] = (D) => l.value = "presets")
              }, {
                default: h(() => [
                  g(a(Ye), {
                    index: b.value,
                    onPick: $e
                  }, null, 8, ["index"])
                ]),
                _: 1
              }, 8, ["presets", "current", "disabled"])) : A("", !0),
              m("div", Ht, [
                g(a(je), {
                  tabs: i,
                  active: v.value,
                  answer: I.value,
                  onChoose: re
                }, null, 8, ["active", "answer"])
              ]),
              a(t).readOnly ? (u(), C("p", Vt, "Only a user can change these settings. You can read every value, and ask a user for a change.")) : A("", !0),
              g(Ft, {
                tab: o.value,
                active: v.value,
                draft: a(n),
                "is-loaded": S.value,
                nodes: P,
                "read-only": a(t).readOnly,
                found: j.value,
                "nothing-starts": U.value,
                "advanced-extras": L.value
              }, null, 8, ["tab", "active", "draft", "is-loaded", "read-only", "found", "nothing-starts", "advanced-extras"])
            ]),
            presets: h(() => [
              g(at, {
                presets: d.value,
                switches: T.value,
                now: q.value,
                "read-only": a(t).readOnly,
                onBack: w[1] || (w[1] = (D) => l.value = "main"),
                onFill: k
              }, null, 8, ["presets", "switches", "now", "read-only"])
            ]),
            _: 1
          }, 8, ["value"]),
          y.value ? (u(), O(a(Xe), {
            key: 0,
            changes: a(n).changes(),
            "can-save": a(n).canSave.value,
            pending: a(n).pending.value,
            reason: a(n).reason.value,
            environment: a(t).environment,
            onSave: w[2] || (w[2] = (D) => a(n).apply()),
            onCancel: w[3] || (w[3] = (D) => a(n).reset())
          }, null, 8, ["changes", "can-save", "pending", "reason", "environment"])) : A("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, Qt = /* @__PURE__ */ F(Gt, [["__scopeId", "data-v-d342f429"]]);
export {
  Qt as A
};
