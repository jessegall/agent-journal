import { openBlock as f, createElementBlock as C, createElementVNode as g, Fragment as ae, renderList as ge, createBlock as O, unref as a, createVNode as k, withModifiers as $e, withCtx as b, createTextVNode as U, ref as x, computed as c, onMounted as X, toDisplayString as B, createCommentVNode as T, normalizeClass as ye, watch as se, nextTick as Ce, renderSlot as Ae, onBeforeUnmount as Te } from "vue";
import { TextInput as xe, Btn as H, useWindow as Z, useNow as Ee, agentTitle as Ne, age as Re, agentNumber as _e, TabBody as Ie, SwitchCase as ke, WindowRoom as Pe, InnerTabs as Be } from "@journal/window-kit";
import { SettingPresetCard as le, SettingPresetCompareTable as je, SettingEmptyState as Le, isFull as ie, SettingBackPath as qe, SettingPerTypeOverrideRow as de, SettingsScreen as we, SettingRow as ue, SettingEntryList as Fe, SettingThreeWayCap as We, SettingBanner as Me, SettingHelperTypeTable as Ue, sectionsOf as Ve, SettingSectionList as De, useSettingsDraft as Ke, currentPreset as He, SettingPresetBand as ze, FindBox as Ge, ChangeFoot as Ye } from "@journal/setting-components";
import { _ as F } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const Xe = {
  class: "page",
  "data-agent-settings-presets": ""
}, Ze = { class: "crumb" }, Je = { class: "body" }, Qe = { class: "cards" }, et = "Any other mix of the eight switches. The form shows Custom as soon as the switches match neither preset.", tt = {
  __name: "AgentSettingsPresets",
  props: { presets: { type: Array, required: !0 }, switches: { type: Array, required: !0 }, now: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back", "fill"],
  setup(t, { emit: r }) {
    const e = r;
    return (s, d) => (f(), C("section", Xe, [
      g("div", Ze, [
        g("button", {
          type: "button",
          class: "back",
          "data-presets-back": "",
          onClick: d[0] || (d[0] = (p) => e("back"))
        }, "‹ Back"),
        d[1] || (d[1] = g("b", null, "What is a preset?", -1))
      ]),
      g("div", Je, [
        d[2] || (d[2] = g("p", { class: "lead" }, "A preset is a set of eight switches and nothing more. It is not a type of agent: the main agent is the same program under every preset, and a preset only fills in the switches below. Nothing is saved until you press Save.", -1)),
        g("div", Qe, [
          (f(!0), C(ae, null, ge(t.presets, (p) => (f(), O(a(le), {
            key: p.key,
            name: p.name,
            line: p.line,
            "can-fill": !t.readOnly,
            onFill: (m) => e("fill", p.key)
          }, null, 8, ["name", "line", "can-fill", "onFill"]))), 128)),
          k(a(le), {
            name: "Custom",
            line: et
          })
        ]),
        k(a(je), {
          rows: t.switches,
          presets: t.presets,
          now: t.now
        }, null, 8, ["rows", "presets", "now"])
      ])
    ]));
  }
}, nt = /* @__PURE__ */ F(tt, [["__scopeId", "data-v-cf40939d"]]), at = { class: "action-buttons" }, st = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(t) {
    return (r, e) => (f(), C("form", {
      "data-agent-retire-confirm": "",
      onSubmit: e[2] || (e[2] = $e((s) => r.$emit("submit"), ["prevent"]))
    }, [
      e[5] || (e[5] = g("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      k(a(xe), {
        "model-value": t.reason,
        label: "Reason",
        disabled: t.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": e[0] || (e[0] = (s) => r.$emit("update:reason", s))
      }, null, 8, ["model-value", "disabled"]),
      g("div", at, [
        k(a(H), {
          type: "submit",
          small: "",
          disabled: t.pending || !t.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: b(() => [...e[3] || (e[3] = [
            U("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        k(a(H), {
          small: "",
          disabled: t.pending,
          onClick: e[1] || (e[1] = (s) => r.$emit("cancel"))
        }, {
          default: b(() => [...e[4] || (e[4] = [
            U("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ot = /* @__PURE__ */ F(st, [["__scopeId", "data-v-92de7dd6"]]), rt = {
  class: "type-agents",
  "data-type-agents": ""
}, lt = { class: "models" }, it = ["data-count-agent"], dt = { class: "person-text" }, ut = {
  key: 2,
  role: "alert",
  class: "bad"
}, ct = {
  key: 3,
  role: "status"
}, ft = {
  __name: "AgentTypeAgents",
  props: { role: { type: String, required: !0 }, profile: { type: String, default: "" } },
  emits: ["open-agent", "retired"],
  setup(t, { emit: r }) {
    const e = t, s = r, d = Z(), p = Ee(), m = x([]), S = x(0), n = x(!1), $ = x(!1), _ = x(""), I = x(""), E = x(null), N = x(""), R = c(() => m.value.filter((y) => {
      var l;
      return y.state !== "retired" && y.role === e.role && (!e.profile || (((l = y.facts) == null ? void 0 : l.profile) || y.profile) === e.profile);
    }).sort((y, l) => (y.state !== "running") - (l.state !== "running") || String(y.ended_at || y.created_at).localeCompare(String(l.ended_at || l.created_at)))), L = c(() => {
      var l;
      const y = /* @__PURE__ */ new Map();
      for (const u of R.value) {
        const A = ((l = u.facts) == null ? void 0 : l.model) || u.program_model;
        A && y.set(A, (y.get(A) || 0) + 1);
      }
      return [...y].map(([u, A]) => `${A} ${u}`).join(", ");
    });
    async function P(y = 1) {
      d.state["count-agents.role"] = e.role, e.profile ? d.state["count-agents.profile"] = e.profile : delete d.state["count-agents.profile"], d.state["count-agents.page"] = String(y), await d.reload("count-agents");
      const l = d.props["count-agents"];
      m.value = y === 1 ? [...l.rows.value] : [...m.value, ...l.rows.value], S.value = y, n.value = l.more.value;
    }
    async function V(y) {
      if (!N.value.trim() || $.value) return;
      $.value = !0;
      const l = await d.run(["agent", "retire", String(y.number), "--reason", N.value.trim()]);
      _.value = l.ok ? "" : "The agent could not be retired. Try again.", l.ok && (E.value = null, N.value = "", I.value = "Agent retired permanently.", s("retired"), await P()), $.value = !1;
    }
    return X(() => P()), (y, l) => (f(), C("section", rt, [
      g("p", lt, B(L.value), 1),
      R.value.length ? T("", !0) : (f(), O(a(Le), {
        key: 0,
        title: "No agents here yet",
        line: "An agent shows here as soon as one of this type starts."
      })),
      (f(!0), C(ae, null, ge(R.value, (u) => {
        var A, q, M, i;
        return f(), C("div", {
          key: u.id,
          class: "person",
          "data-count-agent": u.id
        }, [
          g("span", {
            class: ye(["dot", { running: u.state === "running" }])
          }, null, 2),
          g("div", dt, [
            g("strong", null, B(a(Ne)(u).text), 1),
            U(" " + B(u.state === "running" ? "Running" : "Idle") + ", " + B(a(Re)(u.state === "running" ? u.process_started_at || u.created_at : u.ended_at, a(p))) + " ", 1),
            g("small", null, B([u.program, (A = u.facts) == null ? void 0 : A.model, (q = u.facts) == null ? void 0 : q.effort, a(_e)(u)].filter(Boolean).join(", ")), 1),
            g("small", null, B(((M = u.facts) == null ? void 0 : M.task_title) || ((i = u.facts) == null ? void 0 : i.helper_job)), 1)
          ]),
          k(a(H), {
            small: "",
            onClick: (v) => s("open-agent", u)
          }, {
            default: b(() => [...l[3] || (l[3] = [
              U("Open", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]),
          u.state === "idle" && !a(d).readOnly ? (f(), O(a(H), {
            key: 0,
            small: "",
            onClick: (v) => {
              E.value = u.id, N.value = "";
            }
          }, {
            default: b(() => [...l[4] || (l[4] = [
              U("Retire", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])) : T("", !0),
          E.value === u.id ? (f(), O(ot, {
            key: 1,
            reason: N.value,
            "onUpdate:reason": l[0] || (l[0] = (v) => N.value = v),
            pending: $.value,
            onSubmit: (v) => V(u),
            onCancel: l[1] || (l[1] = (v) => E.value = null)
          }, null, 8, ["reason", "pending", "onSubmit"])) : T("", !0)
        ], 8, it);
      }), 128)),
      n.value ? (f(), O(a(H), {
        key: 1,
        small: "",
        onClick: l[2] || (l[2] = (u) => P(S.value + 1))
      }, {
        default: b(() => [...l[5] || (l[5] = [
          U("Show more", -1)
        ])]),
        _: 1
      })) : T("", !0),
      _.value ? (f(), C("p", ut, B(_.value), 1)) : I.value ? (f(), C("p", ct, B(I.value), 1)) : T("", !0)
    ]));
  }
}, vt = /* @__PURE__ */ F(ft, [["__scopeId", "data-v-67f17bfa"]]), W = "journal.core.helpers", pt = `${W}.context-limit-on`, oe = `${W}.context-limit-tokens`, he = `${W}.context-limit-kinds`, z = `${W}.context-limit-profiles`, Q = `${W}.read-only-helper-profile-limits`, mt = `${W}.read-only-helper-run-limit`, gt = `${W}.read-only-helper-kept-limit`, ce = "journal.suites.coding.workers.merge-hooks", yt = "none", be = (t) => `${t / 1e3}k`, Oe = (t) => {
  const r = t.lastIndexOf(":");
  return { name: t.slice(0, r).trim(), value: t.slice(r + 1).trim() };
}, Y = (t, r) => {
  var e;
  return (e = (t ?? []).map(Oe).find((s) => s.name === r)) == null ? void 0 : e.value;
}, fe = (t) => t === yt ? "No cap" : be(Number(t));
function ve(t, r, e) {
  if (t(pt) !== !0) return { text: "Off", where: "Context limit is off", own: !1 };
  const s = e ? Y(t(z), e) : void 0;
  if (s !== void 0) return { text: fe(s), where: "Own value", own: !0 };
  const d = Y(t(he), r);
  return d !== void 0 ? { text: fe(d), where: "Set for its type", own: !1 } : { text: be(Number(t(oe))), where: "Set for every agent", own: !1 };
}
const kt = (t) => t > 0 ? t : null, wt = { worker: "workers" }, G = "merger", pe = "designer";
function me(t, r, e, s, d, p = {}) {
  return { key: t, name: r, line: e, running: s.running, runLimit: s.run_limit, kept: s.kept, keptLimit: kt(s.kept_limit), cap: d, ...p };
}
function ht(t, r) {
  const e = t.filter((n) => !n.per_profile).map((n) => me(n.key, n.label, n.line, n, ve(r, n.key, ""), { screen: wt[n.key] ?? "read-only", role: n.key, profile: "", defaultProfile: n.default_profile })), s = t.find((n) => n.per_profile);
  if (!s) return e;
  const d = (n) => me(`${s.key}:${n.profile}`, n.title, n.line, n, ve(r, s.key, n.profile), { screen: n.group === G ? G : "read-only", role: s.key, profile: n.profile }), p = s.profiles.filter((n) => n.group === G || n.group === pe).map(d), m = s.profiles.filter((n) => n.group !== G && n.group !== pe).map((n) => ({ ...d(n), indent: !0 })), S = { key: s.key, name: "Read-only helpers", group: !0, screen: "read-only", role: s.key, profile: "", line: `${s.running} running, ${s.kept} kept. Every profile runs up to ${s.run_limit} and keeps ${s.kept_limit ? `up to ${s.kept_limit}` : "any number"} unless it has limits of its own.` };
  return [...e, ...p, S, ...m];
}
const ne = Array.from({ length: 10 }, (t, r) => (r + 1) * 1e5), bt = (t) => t.filter((r) => !r.group && (ie(r.running, r.runLimit) || ie(r.kept, r.keptLimit ?? 0))).length;
function Se(t, r) {
  const e = c(() => t.props.limits.rows.value ?? []), s = c(() => ht(e.value, r.value)), d = c(() => !!t.props.limits.failure.value);
  return { rows: s, unreadable: d, reread: () => t.reload("limits") };
}
const Ot = {
  class: "type",
  "data-agent-type-screen": ""
}, St = { class: "typebody" }, $t = {
  class: "typemain",
  "data-type-settings": ""
}, Ct = { class: "typeside" }, ee = "none", At = "worker", Tt = {
  __name: "AgentSettingsTypeScreen",
  props: { row: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back"],
  setup(t, { emit: r }) {
    const e = t, s = r, d = Z(), p = c(() => d.props["type-screen"].data.value), m = c(() => {
      var i;
      return ((i = p.value) == null ? void 0 : i.nodes) ?? [];
    }), S = c(() => e.row.profile !== "");
    async function n() {
      d.state["type-screen.type"] = e.row.screen, await d.reload("type-screen");
    }
    se(p, (i) => {
      i && e.draft.load([i]);
    }), X(n);
    const $ = c(() => (e.draft.value(Q) ?? []).map((i) => i.split(":"))), _ = c(() => $.value.find((i) => i[0] === e.row.profile)), I = c(() => ({ running: Number(e.draft.value(mt)), kept: Number(e.draft.value(gt)) })), E = (i) => _.value ? Number(_.value[i === "running" ? 1 : 2]) : null;
    function N(i, v) {
      const w = $.value.filter((D) => D[0] !== e.row.profile).map((D) => D.join(":"));
      if (v === null) return e.draft.set(Q, w);
      if (v === "") return;
      const j = i === "running" ? v : E("running") ?? I.value.running, J = i === "kept" ? v : E("kept") ?? I.value.kept;
      e.draft.set(Q, [...w, `${e.row.profile}:${j}:${J}`]);
    }
    const R = c(() => e.row.group ? "" : e.row.profile || e.row.defaultProfile || ""), L = c(() => Y(e.draft.value(z), R.value)), P = c(() => L.value === void 0 ? "kind" : L.value === ee ? "none" : "own"), V = c(() => {
      const i = Y(e.draft.value(he), e.row.role);
      return i === ee ? null : Number(i ?? e.draft.value(oe));
    });
    function y({ mode: i, size: v }) {
      const w = (e.draft.value(z) ?? []).filter((j) => j.slice(0, j.lastIndexOf(":")).trim() !== R.value);
      e.draft.set(z, i === "kind" ? w : [...w, `${R.value}:${i === "none" ? ee : v}`]);
    }
    const l = c(() => e.row.role === At ? R.value : ""), u = c(() => (e.draft.value(ce) ?? []).map((i) => {
      const v = i.indexOf(":");
      return { name: i.slice(0, v).trim(), command: i.slice(v + 1).trim() };
    })), A = c(() => u.value.filter((i) => i.name === l.value).map((i) => i.command));
    function q(i) {
      const v = u.value.filter((w) => w.name !== l.value).map((w) => `${w.name}: ${w.command}`);
      e.draft.set(ce, [...v, ...i.map((w) => `${l.value}: ${w}`)]);
    }
    const M = (i) => d.open("agents.agents", i.id);
    return (i, v) => (f(), C("div", Ot, [
      k(a(qe), {
        parent: "Helpers",
        current: t.row.name,
        onBack: v[0] || (v[0] = (w) => s("back"))
      }, null, 8, ["current"]),
      g("div", St, [
        g("div", $t, [
          S.value && t.row.screen === "read-only" ? (f(), C(ae, { key: 0 }, [
            k(a(de), {
              label: "Running",
              help: "Agents of this profile that run at once.",
              "every-value": I.value.running,
              "own-value": E("running"),
              disabled: t.readOnly,
              "data-override-running": "",
              "onUpdate:ownValue": v[1] || (v[1] = (w) => N("running", w))
            }, null, 8, ["every-value", "own-value", "disabled"]),
            k(a(de), {
              label: "Kept",
              help: "Agents of this profile kept until retired, running or idle. At 0 there is no limit.",
              "every-value": I.value.kept,
              "own-value": E("kept"),
              disabled: t.readOnly,
              "data-override-kept": "",
              "onUpdate:ownValue": v[2] || (v[2] = (w) => N("kept", w))
            }, null, 8, ["every-value", "own-value", "disabled"])
          ], 64)) : (f(), O(a(we), {
            key: 1,
            nodes: m.value,
            draft: t.draft,
            "read-only": t.readOnly
          }, null, 8, ["nodes", "draft", "read-only"])),
          l.value ? (f(), O(a(ue), {
            key: 2,
            label: "When merged",
            help: "Commands run in the main checkout after a worker of this profile is merged. One that fails is told to the main agent; the merge stands.",
            source: A.value.length ? "own" : "default",
            "data-merge-hooks": ""
          }, {
            default: b(() => [
              k(a(Fe), {
                "model-value": A.value,
                placeholder: "a command",
                disabled: t.readOnly,
                "onUpdate:modelValue": q
              }, null, 8, ["model-value", "disabled"])
            ]),
            _: 1
          }, 8, ["source"])) : T("", !0),
          R.value ? (f(), O(a(ue), {
            key: 3,
            label: "Context cap",
            help: "The context size at which this type is compacted.",
            source: P.value === "own" || P.value === "none" ? "own" : "default",
            "data-context-cap": ""
          }, {
            default: b(() => [
              k(a(We), {
                mode: P.value,
                "kind-value": V.value,
                "own-value": P.value === "own" ? Number(L.value) : null,
                sizes: a(ne),
                disabled: t.readOnly,
                onChange: y
              }, null, 8, ["mode", "kind-value", "own-value", "sizes", "disabled"])
            ]),
            _: 1
          }, 8, ["source"])) : T("", !0)
        ]),
        g("aside", Ct, [
          v[3] || (v[3] = g("h3", null, "Agents", -1)),
          k(vt, {
            role: t.row.role,
            profile: t.row.profile,
            onOpenAgent: M
          }, null, 8, ["role", "profile"])
        ])
      ])
    ]));
  }
}, xt = /* @__PURE__ */ F(Tt, [["__scopeId", "data-v-c0427867"]]), Et = {
  class: "agents",
  "data-agent-settings-agents": ""
}, Nt = {
  __name: "AgentSettingsAgents",
  props: { draft: { type: Object, required: !0 } },
  setup(t) {
    const r = t, e = Z(), { rows: s, unreadable: d, reread: p } = Se(e, r.draft), m = x(null);
    X(p);
    const S = (n) => {
      m.value = s.value.find(($) => $.key === n);
    };
    return (n, $) => (f(), C("section", Et, [
      m.value ? (f(), O(xt, {
        key: 0,
        row: m.value,
        draft: t.draft,
        "read-only": a(e).readOnly,
        onBack: $[0] || ($[0] = (_) => m.value = null)
      }, null, 8, ["row", "draft", "read-only"])) : a(d) ? (f(), O(a(Me), {
        key: 1,
        kind: "unreadable",
        text: "The counts could not be read.",
        onRetry: a(p)
      }, null, 8, ["onRetry"])) : (f(), O(a(Ue), {
        key: 2,
        rows: a(s),
        onOpen: S
      }, null, 8, ["rows"]))
    ]));
  }
}, Rt = /* @__PURE__ */ F(Nt, [["__scopeId", "data-v-05cc036a"]]), _t = { class: "screen" }, It = { class: "rail" }, Pt = {
  __name: "AgentSettingsScreen",
  props: { nodes: { type: Array, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 }, extras: { type: Object, default: () => ({}) }, found: { type: String, default: "" } },
  setup(t) {
    const r = t, e = x(null), s = c(() => Ve(r.nodes));
    se(() => r.found, (p) => p && Ce(() => {
      var m, S;
      return (S = (m = e.value) == null ? void 0 : m.querySelector(`[data-setting="${p}"]`)) == null ? void 0 : S.scrollIntoView({ block: "center" });
    }), { immediate: !0, flush: "post" });
    const d = (p) => {
      var m, S;
      return (S = (m = e.value) == null ? void 0 : m.querySelector(`[data-section="${p}"]`)) == null ? void 0 : S.scrollIntoView({ block: "start", behavior: "smooth" });
    };
    return (p, m) => (f(), C("div", _t, [
      g("nav", It, [
        k(a(De), {
          sections: s.value,
          scope: e.value,
          onChoose: d
        }, null, 8, ["sections", "scope"])
      ]),
      g("div", {
        ref_key: "scroll",
        ref: e,
        class: "content"
      }, [
        Ae(p.$slots, "before", {}, void 0, !0),
        k(a(we), {
          nodes: t.nodes,
          draft: t.draft,
          "read-only": t.readOnly,
          extras: t.extras,
          found: t.found
        }, null, 8, ["nodes", "draft", "read-only", "extras", "found"])
      ], 512)
    ]));
  }
}, te = /* @__PURE__ */ F(Pt, [["__scopeId", "data-v-1cab27ca"]]), Bt = {
  key: 0,
  class: "hint",
  "data-work-hint": ""
}, jt = {
  __name: "AgentSettingsTab",
  props: { tab: { type: String, required: !0 }, active: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, isLoaded: Boolean, nodes: { type: Function, required: !0 }, readOnly: Boolean, found: { type: String, default: "" }, nothingStarts: Boolean, advancedExtras: { type: Object, required: !0 } },
  setup(t) {
    return (r, e) => (f(), C("div", {
      class: ye(["settings-body", { flush: t.tab === "agents" }])
    }, [
      k(a(Ie), { tab: t.active }, {
        default: b(() => [
          k(a(ke), { value: t.tab }, {
            work: b(() => [
              t.isLoaded ? (f(), O(te, {
                key: "work",
                nodes: t.nodes("work"),
                draft: t.draft,
                "read-only": t.readOnly,
                found: t.found,
                "data-agent-settings-work": ""
              }, {
                before: b(() => [
                  t.nothingStarts ? (f(), C("p", Bt, "With Auto off and no workers, nothing starts the work: a user starts tasks or turns one of them on.")) : T("", !0)
                ]),
                _: 1
              }, 8, ["nodes", "draft", "read-only", "found"])) : T("", !0)
            ]),
            agents: b(() => [
              k(Rt, { draft: t.draft }, null, 8, ["draft"])
            ]),
            tests: b(() => [
              t.isLoaded ? (f(), O(te, {
                key: "tests",
                nodes: t.nodes("tests"),
                draft: t.draft,
                "read-only": t.readOnly,
                found: t.found,
                "data-agent-settings-tests": ""
              }, null, 8, ["nodes", "draft", "read-only", "found"])) : T("", !0)
            ]),
            advanced: b(() => [
              t.isLoaded ? (f(), O(te, {
                key: "advanced",
                nodes: t.nodes("advanced"),
                draft: t.draft,
                "read-only": t.readOnly,
                found: t.found,
                extras: t.advancedExtras,
                "data-agent-settings-advanced": ""
              }, null, 8, ["nodes", "draft", "read-only", "found", "extras"])) : T("", !0)
            ]),
            _: 1
          }, 8, ["value"])
        ]),
        _: 1
      }, 8, ["tab"])
    ], 2));
  }
}, Lt = {
  class: "settings",
  "data-agent-settings": ""
}, qt = { class: "head" }, Ft = {
  class: "env",
  "data-settings-environment": ""
}, Wt = { class: "settings-bar" }, Mt = {
  key: 1,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, Ut = "journal.suites.coding.auto-mode", Vt = "journal.suites.coding.workers.main-dispatches-workers", Dt = 1200, Kt = {
  __name: "AgentSettings",
  setup(t) {
    const r = { work: "work-screen", tests: "tests-screen", advanced: "advanced-screen", "helper-types": "helper-types-screen" }, e = Z(), s = x("work"), d = [{ key: "work", label: "Work" }, { key: "agents", label: "Helpers", count_field: "full" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }], p = c(() => d.find((o) => o.key === s.value)), m = () => Object.values(r).map((o) => e.props[o].data.value), S = c(() => m().every(Boolean)), n = Ke({
      run: (o) => e.run(o),
      reload: async () => {
        const o = "type-screen.type" in e.state;
        await Promise.all([...Object.values(r).map((h) => e.reload(h)), e.reload("limits"), ...o ? [e.reload("type-screen")] : []]), n.load([...m(), ...o ? [e.props["type-screen"].data.value] : []]);
      }
    });
    se(m, (o) => {
      o.every(Boolean) && n.load(o);
    }, { immediate: !0 });
    const { rows: $ } = Se(e, n), _ = c(() => bt($.value)), I = c(() => _.value ? { full: `${_.value} full` } : {});
    X(() => e.reload("limits"));
    const E = [{ key: "main", name: "Main agent" }, { key: "worker", name: "Workers" }, { key: "helper", name: "Read-only helpers" }], N = (o) => {
      var h;
      return ((h = $.value.find((K) => K.profile === o)) == null ? void 0 : h.name) ?? o;
    }, R = c(() => (n.value(z) ?? []).map(Oe).map(({ name: o, value: h }) => ({ name: N(o), value: h === "none" ? "no cap" : `${Number(h) / 1e3}k` }))), L = c(() => ({ "keyed-cap-table": { rows: E, sizes: ne, defaultCap: Number(n.value(oe)) || ne[0], ownCaps: R.value } })), P = (o) => {
      var h;
      return ((h = e.props[r[o]].data.value) == null ? void 0 : h.nodes) ?? [];
    }, V = c(() => n.value(Ut) === !1 && n.value(Vt) === !1), y = c(() => !e.readOnly), l = x("main"), u = c(() => {
      var o;
      return ((o = e.props.work.data.value) == null ? void 0 : o.presets) ?? [];
    }), A = c(() => {
      var o;
      return ((o = e.props.work.data.value) == null ? void 0 : o.switches) ?? [];
    }), q = c(() => Object.fromEntries(A.value.map((o) => [o.key, n.value(o.key)]))), M = c(() => He(q.value, u.value)), i = (o) => n.fill(u.value.find((h) => h.key === o).values), v = c(() => {
      var o;
      return ((o = e.props.find.data.value) == null ? void 0 : o.rows) ?? [];
    }), w = x("");
    let j = null;
    const J = (o) => o.startsWith("helper-type") ? "agents" : o;
    function D(o) {
      l.value = "main", re({ key: J(o.screen) }), w.value = o.key, clearTimeout(j), j = setTimeout(() => {
        w.value = "";
      }, Dt);
    }
    Te(() => clearTimeout(j));
    function re(o) {
      s.value = o.key, e.state.tab = o.key === "agents" ? "agents" : "";
    }
    return (o, h) => (f(), O(a(Pe), { padding: "0" }, {
      default: b(() => [
        g("div", Lt, [
          k(a(ke), { value: l.value }, {
            main: b(() => [
              g("div", qt, [
                g("span", Ft, B(a(e).environment), 1)
              ]),
              u.value.length ? (f(), O(a(ze), {
                key: 0,
                presets: u.value,
                current: M.value,
                disabled: a(e).readOnly,
                onPick: i,
                onOpenPage: h[0] || (h[0] = (K) => l.value = "presets")
              }, {
                default: b(() => [
                  k(a(Ge), {
                    index: v.value,
                    onPick: D
                  }, null, 8, ["index"])
                ]),
                _: 1
              }, 8, ["presets", "current", "disabled"])) : T("", !0),
              g("div", Wt, [
                k(a(Be), {
                  tabs: d,
                  active: p.value,
                  answer: I.value,
                  onChoose: re
                }, null, 8, ["active", "answer"])
              ]),
              a(e).readOnly ? (f(), C("p", Mt, "Only a user can change these settings. You can read every value, and ask a user for a change.")) : T("", !0),
              k(jt, {
                tab: s.value,
                active: p.value,
                draft: a(n),
                "is-loaded": S.value,
                nodes: P,
                "read-only": a(e).readOnly,
                found: w.value,
                "nothing-starts": V.value,
                "advanced-extras": L.value
              }, null, 8, ["tab", "active", "draft", "is-loaded", "read-only", "found", "nothing-starts", "advanced-extras"])
            ]),
            presets: b(() => [
              k(nt, {
                presets: u.value,
                switches: A.value,
                now: q.value,
                "read-only": a(e).readOnly,
                onBack: h[1] || (h[1] = (K) => l.value = "main"),
                onFill: i
              }, null, 8, ["presets", "switches", "now", "read-only"])
            ]),
            _: 1
          }, 8, ["value"]),
          y.value ? (f(), O(a(Ye), {
            key: 0,
            changes: a(n).changes(),
            "can-save": a(n).canSave.value,
            pending: a(n).pending.value,
            reason: a(n).reason.value,
            environment: a(e).environment,
            onSave: h[2] || (h[2] = (K) => a(n).apply()),
            onCancel: h[3] || (h[3] = (K) => a(n).reset())
          }, null, 8, ["changes", "can-save", "pending", "reason", "environment"])) : T("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, Xt = /* @__PURE__ */ F(Kt, [["__scopeId", "data-v-d342f429"]]);
export {
  Xt as A
};
