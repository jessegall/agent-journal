import { openBlock as d, createElementBlock as O, withModifiers as $e, createElementVNode as v, createVNode as k, unref as a, withCtx as h, createTextVNode as M, ref as _, computed as c, onMounted as Y, toDisplayString as B, createBlock as $, createCommentVNode as C, Fragment as te, renderList as fe, normalizeClass as ve, watch as ne, nextTick as Se, renderSlot as Oe, onBeforeUnmount as _e } from "vue";
import { TextInput as Ce, Btn as V, useWindow as G, useNow as Ae, agentTitle as Te, age as Ne, agentNumber as xe, WindowRoom as Re, SwitchCase as oe, InnerTabs as Ee, TabBody as Ie } from "@journal/window-kit";
import { SettingEmptyState as Pe, isFull as re, SettingBackPath as Be, SettingPerTypeOverrideRow as le, SettingsScreen as me, SettingRow as je, SettingThreeWayCap as Le, SettingBanner as Fe, SettingHelperTypeTable as qe, SettingPresetCard as ie, SettingPresetCompareTable as Me, sectionsOf as Ue, SettingSectionList as We, useSettingsDraft as De, currentPreset as Ve, SettingPresetBand as Ke, FindBox as ze, ChangeFoot as He } from "@journal/setting-components";
import { _ as F } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const Ye = { class: "action-buttons" }, Ge = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(t) {
    return (l, e) => (d(), O("form", {
      "data-agent-retire-confirm": "",
      onSubmit: e[2] || (e[2] = $e((o) => l.$emit("submit"), ["prevent"]))
    }, [
      e[5] || (e[5] = v("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      k(a(Ce), {
        "model-value": t.reason,
        label: "Reason",
        disabled: t.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": e[0] || (e[0] = (o) => l.$emit("update:reason", o))
      }, null, 8, ["model-value", "disabled"]),
      v("div", Ye, [
        k(a(V), {
          type: "submit",
          small: "",
          disabled: t.pending || !t.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: h(() => [...e[3] || (e[3] = [
            M("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        k(a(V), {
          small: "",
          disabled: t.pending,
          onClick: e[1] || (e[1] = (o) => l.$emit("cancel"))
        }, {
          default: h(() => [...e[4] || (e[4] = [
            M("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Xe = /* @__PURE__ */ F(Ge, [["__scopeId", "data-v-92de7dd6"]]), Ze = {
  class: "type-agents",
  "data-type-agents": ""
}, Je = { class: "models" }, Qe = ["data-count-agent"], et = { class: "person-text" }, tt = {
  key: 2,
  role: "alert",
  class: "bad"
}, nt = {
  key: 3,
  role: "status"
}, st = {
  __name: "AgentTypeAgents",
  props: { role: { type: String, required: !0 }, profile: { type: String, default: "" } },
  emits: ["open-agent", "retired"],
  setup(t, { emit: l }) {
    const e = t, o = l, i = G(), p = Ae(), m = _([]), w = _(0), n = _(!1), S = _(!1), R = _(""), E = _(""), T = _(null), N = _(""), I = c(() => m.value.filter((y) => {
      var u;
      return y.state !== "retired" && y.role === e.role && (!e.profile || (((u = y.facts) == null ? void 0 : u.profile) || y.profile) === e.profile);
    }).sort((y, u) => (y.state !== "running") - (u.state !== "running") || String(y.ended_at || y.created_at).localeCompare(String(u.ended_at || u.created_at)))), j = c(() => {
      var u;
      const y = /* @__PURE__ */ new Map();
      for (const s of I.value) {
        const f = ((u = s.facts) == null ? void 0 : u.model) || s.program_model;
        f && y.set(f, (y.get(f) || 0) + 1);
      }
      return [...y].map(([s, f]) => `${f} ${s}`).join(", ");
    });
    async function A(y = 1) {
      i.state["count-agents.role"] = e.role, e.profile ? i.state["count-agents.profile"] = e.profile : delete i.state["count-agents.profile"], i.state["count-agents.page"] = String(y), await i.reload("count-agents");
      const u = i.props["count-agents"];
      m.value = y === 1 ? [...u.rows.value] : [...m.value, ...u.rows.value], w.value = y, n.value = u.more.value;
    }
    async function U(y) {
      if (!N.value.trim() || S.value) return;
      S.value = !0;
      const u = await i.run(["agent", "retire", String(y.number), "--reason", N.value.trim()]);
      R.value = u.ok ? "" : "The agent could not be retired. Try again.", u.ok && (T.value = null, N.value = "", E.value = "Agent retired permanently.", o("retired"), await A()), S.value = !1;
    }
    return Y(() => A()), (y, u) => (d(), O("section", Ze, [
      v("p", Je, B(j.value), 1),
      I.value.length ? C("", !0) : (d(), $(a(Pe), {
        key: 0,
        title: "No agents here yet",
        line: "An agent shows here as soon as one of this type starts."
      })),
      (d(!0), O(te, null, fe(I.value, (s) => {
        var f, b, P, L;
        return d(), O("div", {
          key: s.id,
          class: "person",
          "data-count-agent": s.id
        }, [
          v("span", {
            class: ve(["dot", { running: s.state === "running" }])
          }, null, 2),
          v("div", et, [
            v("strong", null, B(a(Te)(s).text), 1),
            M(" " + B(s.state === "running" ? "Running" : "Idle") + ", " + B(a(Ne)(s.state === "running" ? s.process_started_at || s.created_at : s.ended_at, a(p))) + " ", 1),
            v("small", null, B([s.program, (f = s.facts) == null ? void 0 : f.model, (b = s.facts) == null ? void 0 : b.effort, a(xe)(s)].filter(Boolean).join(", ")), 1),
            v("small", null, B(((P = s.facts) == null ? void 0 : P.task_title) || ((L = s.facts) == null ? void 0 : L.helper_job)), 1)
          ]),
          k(a(V), {
            small: "",
            onClick: (x) => o("open-agent", s)
          }, {
            default: h(() => [...u[3] || (u[3] = [
              M("Open", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]),
          s.state === "idle" && !a(i).readOnly ? (d(), $(a(V), {
            key: 0,
            small: "",
            onClick: (x) => {
              T.value = s.id, N.value = "";
            }
          }, {
            default: h(() => [...u[4] || (u[4] = [
              M("Retire", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])) : C("", !0),
          T.value === s.id ? (d(), $(Xe, {
            key: 1,
            reason: N.value,
            "onUpdate:reason": u[0] || (u[0] = (x) => N.value = x),
            pending: S.value,
            onSubmit: (x) => U(s),
            onCancel: u[1] || (u[1] = (x) => T.value = null)
          }, null, 8, ["reason", "pending", "onSubmit"])) : C("", !0)
        ], 8, Qe);
      }), 128)),
      n.value ? (d(), $(a(V), {
        key: 1,
        small: "",
        onClick: u[2] || (u[2] = (s) => A(w.value + 1))
      }, {
        default: h(() => [...u[5] || (u[5] = [
          M("Show more", -1)
        ])]),
        _: 1
      })) : C("", !0),
      R.value ? (d(), O("p", tt, B(R.value), 1)) : E.value ? (d(), O("p", nt, B(E.value), 1)) : C("", !0)
    ]));
  }
}, at = /* @__PURE__ */ F(st, [["__scopeId", "data-v-67f17bfa"]]), q = "journal.core.helpers", ot = `${q}.context-limit-on`, se = `${q}.context-limit-tokens`, ye = `${q}.context-limit-kinds`, K = `${q}.context-limit-profiles`, Z = `${q}.read-only-helper-profile-limits`, rt = `${q}.read-only-helper-run-limit`, lt = `${q}.read-only-helper-kept-limit`, it = "none", ge = (t) => `${t / 1e3}k`, ke = (t) => {
  const l = t.lastIndexOf(":");
  return { name: t.slice(0, l).trim(), value: t.slice(l + 1).trim() };
}, H = (t, l) => {
  var e;
  return (e = (t ?? []).map(ke).find((o) => o.name === l)) == null ? void 0 : e.value;
}, ue = (t) => t === it ? "No cap" : ge(Number(t));
function de(t, l, e) {
  if (t(ot) !== !0) return { text: "Off", where: "Context limit is off", own: !1 };
  const o = e ? H(t(K), e) : void 0;
  if (o !== void 0) return { text: ue(o), where: "Own value", own: !0 };
  const i = H(t(ye), l);
  return i !== void 0 ? { text: ue(i), where: "Set for its kind", own: !1 } : { text: ge(Number(t(se))), where: "Set for every agent", own: !1 };
}
const ut = (t) => t > 0 ? t : null, dt = { worker: "workers" }, z = "merger", ce = "designer";
function pe(t, l, e, o, i, p = {}) {
  return { key: t, name: l, line: e, running: o.running, runLimit: o.run_limit, kept: o.kept, keptLimit: ut(o.kept_limit), cap: i, ...p };
}
function ct(t, l) {
  const e = t.filter((n) => !n.per_profile).map((n) => pe(n.key, n.label, n.line, n, de(l, n.key, ""), { screen: dt[n.key] ?? "read-only", role: n.key, profile: "", defaultProfile: n.default_profile })), o = t.find((n) => n.per_profile);
  if (!o) return e;
  const i = (n) => pe(`${o.key}:${n.profile}`, n.title, n.line, n, de(l, o.key, n.profile), { screen: n.group === z ? z : "read-only", role: o.key, profile: n.profile }), p = o.profiles.filter((n) => n.group === z || n.group === ce).map(i), m = o.profiles.filter((n) => n.group !== z && n.group !== ce).map((n) => ({ ...i(n), indent: !0 })), w = { key: o.key, name: "Read-only helpers", group: !0, screen: "read-only", role: o.key, profile: "", line: `${o.running} running, ${o.kept} kept. Every profile runs up to ${o.run_limit} and keeps ${o.kept_limit ? `up to ${o.kept_limit}` : "any number"} unless it has limits of its own.` };
  return [...e, ...p, w, ...m];
}
const ee = Array.from({ length: 10 }, (t, l) => (l + 1) * 1e5), pt = (t) => t.filter((l) => !l.group && (re(l.running, l.runLimit) || re(l.kept, l.keptLimit ?? 0))).length;
function we(t, l) {
  const e = c(() => t.props.limits.rows.value ?? []), o = c(() => ct(e.value, l.value)), i = c(() => !!t.props.limits.failure.value);
  return { rows: o, unreadable: i, reread: () => t.reload("limits") };
}
const ft = {
  class: "type",
  "data-agent-type-screen": ""
}, vt = { class: "typebody" }, mt = {
  class: "typemain",
  "data-type-settings": ""
}, yt = { class: "typeside" }, J = "none", gt = {
  __name: "AgentSettingsTypeScreen",
  props: { row: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back"],
  setup(t, { emit: l }) {
    const e = t, o = l, i = G(), p = c(() => i.props["type-screen"].data.value), m = c(() => {
      var s;
      return ((s = p.value) == null ? void 0 : s.nodes) ?? [];
    }), w = c(() => e.row.profile !== "");
    async function n() {
      i.state["type-screen.type"] = e.row.screen, await i.reload("type-screen");
    }
    ne(p, (s) => {
      s && e.draft.load([s]);
    }), Y(n);
    const S = c(() => (e.draft.value(Z) ?? []).map((s) => s.split(":"))), R = c(() => S.value.find((s) => s[0] === e.row.profile)), E = c(() => ({ running: Number(e.draft.value(rt)), kept: Number(e.draft.value(lt)) })), T = (s) => R.value ? Number(R.value[s === "running" ? 1 : 2]) : null;
    function N(s, f) {
      const b = S.value.filter((x) => x[0] !== e.row.profile).map((x) => x.join(":"));
      if (f === null) return e.draft.set(Z, b);
      if (f === "") return;
      const P = s === "running" ? f : T("running") ?? E.value.running, L = s === "kept" ? f : T("kept") ?? E.value.kept;
      e.draft.set(Z, [...b, `${e.row.profile}:${P}:${L}`]);
    }
    const I = c(() => e.row.group ? "" : e.row.profile || e.row.defaultProfile || ""), j = c(() => H(e.draft.value(K), I.value)), A = c(() => j.value === void 0 ? "kind" : j.value === J ? "none" : "own"), U = c(() => {
      const s = H(e.draft.value(ye), e.row.role);
      return s === J ? null : Number(s ?? e.draft.value(se));
    });
    function y({ mode: s, size: f }) {
      const b = (e.draft.value(K) ?? []).filter((P) => P.slice(0, P.lastIndexOf(":")).trim() !== I.value);
      e.draft.set(K, s === "kind" ? b : [...b, `${I.value}:${s === "none" ? J : f}`]);
    }
    const u = (s) => i.open("agents.agents", s.id);
    return (s, f) => (d(), O("div", ft, [
      k(a(Be), {
        parent: "Helpers",
        current: t.row.name,
        onBack: f[0] || (f[0] = (b) => o("back"))
      }, null, 8, ["current"]),
      v("div", vt, [
        v("div", mt, [
          w.value && t.row.screen === "read-only" ? (d(), O(te, { key: 0 }, [
            k(a(le), {
              label: "Running",
              help: "Agents of this profile that run at once.",
              "every-value": E.value.running,
              "own-value": T("running"),
              disabled: t.readOnly,
              "data-override-running": "",
              "onUpdate:ownValue": f[1] || (f[1] = (b) => N("running", b))
            }, null, 8, ["every-value", "own-value", "disabled"]),
            k(a(le), {
              label: "Kept",
              help: "Agents of this profile kept until retired, running or idle. At 0 there is no limit.",
              "every-value": E.value.kept,
              "own-value": T("kept"),
              disabled: t.readOnly,
              "data-override-kept": "",
              "onUpdate:ownValue": f[2] || (f[2] = (b) => N("kept", b))
            }, null, 8, ["every-value", "own-value", "disabled"])
          ], 64)) : (d(), $(a(me), {
            key: 1,
            nodes: m.value,
            draft: t.draft,
            "read-only": t.readOnly
          }, null, 8, ["nodes", "draft", "read-only"])),
          I.value ? (d(), $(a(je), {
            key: 2,
            label: "Context cap",
            help: "The context size at which this type is compacted.",
            source: A.value === "own" || A.value === "none" ? "own" : "default",
            "data-context-cap": ""
          }, {
            default: h(() => [
              k(a(Le), {
                mode: A.value,
                "kind-value": U.value,
                "own-value": A.value === "own" ? Number(j.value) : null,
                sizes: a(ee),
                disabled: t.readOnly,
                onChange: y
              }, null, 8, ["mode", "kind-value", "own-value", "sizes", "disabled"])
            ]),
            _: 1
          }, 8, ["source"])) : C("", !0)
        ]),
        v("aside", yt, [
          f[3] || (f[3] = v("h3", null, "Agents", -1)),
          k(at, {
            role: t.row.role,
            profile: t.row.profile,
            onOpenAgent: u
          }, null, 8, ["role", "profile"])
        ])
      ])
    ]));
  }
}, kt = /* @__PURE__ */ F(gt, [["__scopeId", "data-v-51bee498"]]), wt = {
  class: "agents",
  "data-agent-settings-agents": ""
}, bt = {
  __name: "AgentSettingsAgents",
  props: { draft: { type: Object, required: !0 } },
  setup(t) {
    const l = t, e = G(), { rows: o, unreadable: i, reread: p } = we(e, l.draft), m = _(null);
    Y(p);
    const w = (n) => {
      m.value = o.value.find((S) => S.key === n);
    };
    return (n, S) => (d(), O("section", wt, [
      m.value ? (d(), $(kt, {
        key: 0,
        row: m.value,
        draft: t.draft,
        "read-only": a(e).readOnly,
        onBack: S[0] || (S[0] = (R) => m.value = null)
      }, null, 8, ["row", "draft", "read-only"])) : a(i) ? (d(), $(a(Fe), {
        key: 1,
        kind: "unreadable",
        text: "The counts could not be read.",
        onRetry: a(p)
      }, null, 8, ["onRetry"])) : (d(), $(a(qe), {
        key: 2,
        rows: a(o),
        onOpen: w
      }, null, 8, ["rows"]))
    ]));
  }
}, ht = /* @__PURE__ */ F(bt, [["__scopeId", "data-v-05cc036a"]]), $t = {
  class: "page",
  "data-agent-settings-presets": ""
}, St = { class: "crumb" }, Ot = { class: "body" }, _t = { class: "cards" }, Ct = "Any other mix of the eight switches. The form shows Custom as soon as the switches match neither preset.", At = {
  __name: "AgentSettingsPresets",
  props: { presets: { type: Array, required: !0 }, switches: { type: Array, required: !0 }, now: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back", "fill"],
  setup(t, { emit: l }) {
    const e = l;
    return (o, i) => (d(), O("section", $t, [
      v("div", St, [
        v("button", {
          type: "button",
          class: "back",
          "data-presets-back": "",
          onClick: i[0] || (i[0] = (p) => e("back"))
        }, "‹ Back"),
        i[1] || (i[1] = v("b", null, "What is a preset?", -1))
      ]),
      v("div", Ot, [
        i[2] || (i[2] = v("p", { class: "lead" }, "A preset is a set of eight switches and nothing more. It is not a kind of agent: the main agent is the same program under every preset, and a preset only fills in the switches below. Nothing is saved until you press Save.", -1)),
        v("div", _t, [
          (d(!0), O(te, null, fe(t.presets, (p) => (d(), $(a(ie), {
            key: p.key,
            name: p.name,
            line: p.line,
            "can-fill": !t.readOnly,
            onFill: (m) => e("fill", p.key)
          }, null, 8, ["name", "line", "can-fill", "onFill"]))), 128)),
          k(a(ie), {
            name: "Custom",
            line: Ct
          })
        ]),
        k(a(Me), {
          rows: t.switches,
          presets: t.presets,
          now: t.now
        }, null, 8, ["rows", "presets", "now"])
      ])
    ]));
  }
}, Tt = /* @__PURE__ */ F(At, [["__scopeId", "data-v-2cf94460"]]), Nt = { class: "screen" }, xt = { class: "rail" }, Rt = {
  __name: "AgentSettingsScreen",
  props: { nodes: { type: Array, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 }, extras: { type: Object, default: () => ({}) }, found: { type: String, default: "" } },
  setup(t) {
    const l = t, e = _(null), o = c(() => Ue(l.nodes));
    ne(() => l.found, (p) => p && Se(() => {
      var m, w;
      return (w = (m = e.value) == null ? void 0 : m.querySelector(`[data-setting="${p}"]`)) == null ? void 0 : w.scrollIntoView({ block: "center" });
    }), { immediate: !0, flush: "post" });
    const i = (p) => {
      var m, w;
      return (w = (m = e.value) == null ? void 0 : m.querySelector(`[data-section="${p}"]`)) == null ? void 0 : w.scrollIntoView({ block: "start", behavior: "smooth" });
    };
    return (p, m) => (d(), O("div", Nt, [
      v("nav", xt, [
        k(a(We), {
          sections: o.value,
          scope: e.value,
          onChoose: i
        }, null, 8, ["sections", "scope"])
      ]),
      v("div", {
        ref_key: "scroll",
        ref: e,
        class: "content"
      }, [
        Oe(p.$slots, "before", {}, void 0, !0),
        k(a(me), {
          nodes: t.nodes,
          draft: t.draft,
          "read-only": t.readOnly,
          extras: t.extras,
          found: t.found
        }, null, 8, ["nodes", "draft", "read-only", "extras", "found"])
      ], 512)
    ]));
  }
}, Q = /* @__PURE__ */ F(Rt, [["__scopeId", "data-v-1cab27ca"]]), Et = {
  class: "settings",
  "data-agent-settings": ""
}, It = { class: "head" }, Pt = {
  class: "env",
  "data-settings-environment": ""
}, Bt = { class: "settings-bar" }, jt = {
  key: 1,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, Lt = {
  key: 0,
  class: "hint",
  "data-work-hint": ""
}, Ft = "journal.suites.coding.auto-mode", qt = "journal.suites.coding.workers.main-dispatches-workers", Mt = 1200, Ut = {
  __name: "AgentSettings",
  setup(t) {
    const l = { work: "work-screen", tests: "tests-screen", advanced: "advanced-screen", "helper-types": "helper-types-screen" }, e = G(), o = _("work"), i = [{ key: "work", label: "Work" }, { key: "agents", label: "Helpers", count_field: "full" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }], p = c(() => i.find((r) => r.key === o.value)), m = () => Object.values(l).map((r) => e.props[r].data.value), w = c(() => m().every(Boolean)), n = De({
      run: (r) => e.run(r),
      reload: async () => {
        const r = "type-screen.type" in e.state;
        await Promise.all([...Object.values(l).map((g) => e.reload(g)), e.reload("limits"), ...r ? [e.reload("type-screen")] : []]), n.load([...m(), ...r ? [e.props["type-screen"].data.value] : []]);
      }
    });
    ne(m, (r) => {
      r.every(Boolean) && n.load(r);
    }, { immediate: !0 });
    const { rows: S } = we(e, n), R = c(() => pt(S.value)), E = c(() => R.value ? { full: `${R.value} full` } : {});
    Y(() => e.reload("limits"));
    const T = [{ key: "main", name: "Main agent" }, { key: "worker", name: "Workers" }, { key: "helper", name: "Read-only helpers" }], N = (r) => {
      var g;
      return ((g = S.value.find((D) => D.profile === r)) == null ? void 0 : g.name) ?? r;
    }, I = c(() => (n.value(K) ?? []).map(ke).map(({ name: r, value: g }) => ({ name: N(r), value: g === "none" ? "no cap" : `${Number(g) / 1e3}k` }))), j = c(() => ({ "keyed-cap-table": { rows: T, sizes: ee, defaultCap: Number(n.value(se)) || ee[0], ownCaps: I.value } })), A = (r) => {
      var g;
      return ((g = e.props[l[r]].data.value) == null ? void 0 : g.nodes) ?? [];
    }, U = c(() => n.value(Ft) === !1 && n.value(qt) === !1), y = c(() => !e.readOnly), u = _("main"), s = c(() => {
      var r;
      return ((r = e.props.work.data.value) == null ? void 0 : r.presets) ?? [];
    }), f = c(() => {
      var r;
      return ((r = e.props.work.data.value) == null ? void 0 : r.switches) ?? [];
    }), b = c(() => Object.fromEntries(f.value.map((r) => [r.key, n.value(r.key)]))), P = c(() => Ve(b.value, s.value)), L = (r) => n.fill(s.value.find((g) => g.key === r).values), x = c(() => {
      var r;
      return ((r = e.props.find.data.value) == null ? void 0 : r.rows) ?? [];
    }), W = _("");
    let X = null;
    const be = (r) => r.startsWith("helper-type") ? "agents" : r;
    function he(r) {
      u.value = "main", ae({ key: be(r.screen) }), W.value = r.key, clearTimeout(X), X = setTimeout(() => {
        W.value = "";
      }, Mt);
    }
    _e(() => clearTimeout(X));
    function ae(r) {
      o.value = r.key, e.state.tab = r.key === "agents" ? "agents" : "";
    }
    return (r, g) => (d(), $(a(Re), { padding: "0" }, {
      default: h(() => [
        v("div", Et, [
          k(a(oe), { value: u.value }, {
            main: h(() => [
              v("div", It, [
                v("span", Pt, B(a(e).environment), 1)
              ]),
              s.value.length ? (d(), $(a(Ke), {
                key: 0,
                presets: s.value,
                current: P.value,
                disabled: a(e).readOnly,
                onPick: L,
                onOpenPage: g[0] || (g[0] = (D) => u.value = "presets")
              }, {
                default: h(() => [
                  k(a(ze), {
                    index: x.value,
                    onPick: he
                  }, null, 8, ["index"])
                ]),
                _: 1
              }, 8, ["presets", "current", "disabled"])) : C("", !0),
              v("div", Bt, [
                k(a(Ee), {
                  tabs: i,
                  active: p.value,
                  answer: E.value,
                  onChoose: ae
                }, null, 8, ["active", "answer"])
              ]),
              a(e).readOnly ? (d(), O("p", jt, "Only a person can change these settings. You can read every value, and ask a person for a change.")) : C("", !0),
              v("div", {
                class: ve(["settings-body", { flush: o.value === "agents" }])
              }, [
                k(a(Ie), { tab: p.value }, {
                  default: h(() => [
                    k(a(oe), { value: o.value }, {
                      work: h(() => [
                        w.value ? (d(), $(Q, {
                          key: "work",
                          nodes: A("work"),
                          draft: a(n),
                          "read-only": a(e).readOnly,
                          found: W.value,
                          "data-agent-settings-work": ""
                        }, {
                          before: h(() => [
                            U.value ? (d(), O("p", Lt, "With Auto off and no workers, nothing starts the work: a person starts tasks or turns one of them on.")) : C("", !0)
                          ]),
                          _: 1
                        }, 8, ["nodes", "draft", "read-only", "found"])) : C("", !0)
                      ]),
                      agents: h(() => [
                        k(ht, { draft: a(n) }, null, 8, ["draft"])
                      ]),
                      tests: h(() => [
                        w.value ? (d(), $(Q, {
                          key: "tests",
                          nodes: A("tests"),
                          draft: a(n),
                          "read-only": a(e).readOnly,
                          found: W.value,
                          "data-agent-settings-tests": ""
                        }, null, 8, ["nodes", "draft", "read-only", "found"])) : C("", !0)
                      ]),
                      advanced: h(() => [
                        w.value ? (d(), $(Q, {
                          key: "advanced",
                          nodes: A("advanced"),
                          draft: a(n),
                          "read-only": a(e).readOnly,
                          found: W.value,
                          extras: j.value,
                          "data-agent-settings-advanced": ""
                        }, null, 8, ["nodes", "draft", "read-only", "found", "extras"])) : C("", !0)
                      ]),
                      _: 1
                    }, 8, ["value"])
                  ]),
                  _: 1
                }, 8, ["tab"])
              ], 2)
            ]),
            presets: h(() => [
              k(Tt, {
                presets: s.value,
                switches: f.value,
                now: b.value,
                "read-only": a(e).readOnly,
                onBack: g[1] || (g[1] = (D) => u.value = "main"),
                onFill: L
              }, null, 8, ["presets", "switches", "now", "read-only"])
            ]),
            _: 1
          }, 8, ["value"]),
          y.value ? (d(), $(a(He), {
            key: 0,
            changes: a(n).changes(),
            "can-save": a(n).canSave.value,
            pending: a(n).pending.value,
            reason: a(n).reason.value,
            environment: a(e).environment,
            onSave: g[2] || (g[2] = (D) => a(n).apply()),
            onCancel: g[3] || (g[3] = (D) => a(n).reset())
          }, null, 8, ["changes", "can-save", "pending", "reason", "environment"])) : C("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, zt = /* @__PURE__ */ F(Ut, [["__scopeId", "data-v-6d0deb31"]]);
export {
  zt as A
};
