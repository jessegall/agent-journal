import { openBlock as d, createElementBlock as O, withModifiers as $e, createElementVNode as v, createVNode as k, unref as a, withCtx as h, createTextVNode as U, ref as _, computed as c, onMounted as Y, toDisplayString as B, createBlock as $, createCommentVNode as C, Fragment as te, renderList as fe, normalizeClass as ve, watch as ne, nextTick as Se, renderSlot as Oe, onBeforeUnmount as _e } from "vue";
import { TextInput as Ce, Btn as V, useWindow as G, useNow as Ae, age as Te, WindowRoom as Ne, SwitchCase as oe, InnerTabs as xe, TabBody as Re } from "@journal/window-kit";
import { SettingEmptyState as Ee, isFull as re, SettingBackPath as Ie, SettingPerTypeOverrideRow as le, SettingsScreen as me, SettingRow as Pe, SettingThreeWayCap as Be, SettingBanner as je, SettingHelperTypeTable as Le, SettingPresetCard as ie, SettingPresetCompareTable as Fe, sectionsOf as qe, SettingSectionList as Me, useSettingsDraft as Ue, currentPreset as We, SettingPresetBand as De, FindBox as Ve, ChangeFoot as Ke } from "@journal/setting-components";
import { _ as q } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const ze = { class: "action-buttons" }, He = {
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
      v("div", ze, [
        k(a(V), {
          type: "submit",
          small: "",
          disabled: t.pending || !t.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: h(() => [...e[3] || (e[3] = [
            U("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        k(a(V), {
          small: "",
          disabled: t.pending,
          onClick: e[1] || (e[1] = (o) => l.$emit("cancel"))
        }, {
          default: h(() => [...e[4] || (e[4] = [
            U("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ye = /* @__PURE__ */ q(He, [["__scopeId", "data-v-92de7dd6"]]), Ge = {
  class: "type-agents",
  "data-type-agents": ""
}, Xe = { class: "models" }, Ze = ["data-count-agent"], Je = { class: "person-text" }, Qe = {
  key: 2,
  role: "alert",
  class: "bad"
}, et = {
  key: 3,
  role: "status"
}, tt = {
  __name: "AgentTypeAgents",
  props: { role: { type: String, required: !0 }, profile: { type: String, default: "" } },
  emits: ["open-agent", "retired"],
  setup(t, { emit: l }) {
    const e = t, o = l, i = G(), p = Ae(), m = _([]), w = _(0), s = _(!1), S = _(!1), R = _(""), E = _(""), T = _(null), N = _(""), I = c(() => m.value.filter((y) => {
      var u;
      return y.state !== "retired" && y.role === e.role && (!e.profile || (((u = y.facts) == null ? void 0 : u.profile) || y.profile) === e.profile);
    }).sort((y, u) => (y.state !== "running") - (u.state !== "running") || String(y.ended_at || y.created_at).localeCompare(String(u.ended_at || u.created_at)))), L = c(() => {
      var u;
      const y = /* @__PURE__ */ new Map();
      for (const n of I.value) {
        const f = ((u = n.facts) == null ? void 0 : u.model) || n.program_model;
        f && y.set(f, (y.get(f) || 0) + 1);
      }
      return [...y].map(([n, f]) => `${f} ${n}`).join(", ");
    });
    async function A(y = 1) {
      i.state["count-agents.role"] = e.role, e.profile ? i.state["count-agents.profile"] = e.profile : delete i.state["count-agents.profile"], i.state["count-agents.page"] = String(y), await i.reload("count-agents");
      const u = i.props["count-agents"];
      m.value = y === 1 ? [...u.rows.value] : [...m.value, ...u.rows.value], w.value = y, s.value = u.more.value;
    }
    async function W(y) {
      if (!N.value.trim() || S.value) return;
      S.value = !0;
      const u = await i.run(["agent", "retire", String(y.number), "--reason", N.value.trim()]);
      R.value = u.ok ? "" : "The agent could not be retired. Try again.", u.ok && (T.value = null, N.value = "", E.value = "Agent retired permanently.", o("retired"), await A()), S.value = !1;
    }
    return Y(() => A()), (y, u) => (d(), O("section", Ge, [
      v("p", Xe, B(L.value), 1),
      I.value.length ? C("", !0) : (d(), $(a(Ee), {
        key: 0,
        title: "No agents here yet",
        line: "An agent shows here as soon as one of this type starts."
      })),
      (d(!0), O(te, null, fe(I.value, (n) => {
        var f, b, P, F, j;
        return d(), O("div", {
          key: n.id,
          class: "person",
          "data-count-agent": n.id
        }, [
          v("span", {
            class: ve(["dot", { running: n.state === "running" }])
          }, null, 2),
          v("div", Je, [
            v("strong", null, B(((f = n.facts) == null ? void 0 : f.given_name) || n.number), 1),
            U(" " + B(n.state === "running" ? "Running" : "Idle") + ", " + B(a(Te)(n.state === "running" ? n.process_started_at || n.created_at : n.ended_at, a(p))) + " ", 1),
            v("small", null, B([n.program, (b = n.facts) == null ? void 0 : b.model, (P = n.facts) == null ? void 0 : P.effort, `${n.role} ${n.id}`].filter(Boolean).join(", ")), 1),
            v("small", null, B(((F = n.facts) == null ? void 0 : F.task_title) || ((j = n.facts) == null ? void 0 : j.helper_job)), 1)
          ]),
          k(a(V), {
            small: "",
            onClick: (x) => o("open-agent", n)
          }, {
            default: h(() => [...u[3] || (u[3] = [
              U("Open", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]),
          n.state === "idle" && !a(i).readOnly ? (d(), $(a(V), {
            key: 0,
            small: "",
            onClick: (x) => {
              T.value = n.id, N.value = "";
            }
          }, {
            default: h(() => [...u[4] || (u[4] = [
              U("Retire", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])) : C("", !0),
          T.value === n.id ? (d(), $(Ye, {
            key: 1,
            reason: N.value,
            "onUpdate:reason": u[0] || (u[0] = (x) => N.value = x),
            pending: S.value,
            onSubmit: (x) => W(n),
            onCancel: u[1] || (u[1] = (x) => T.value = null)
          }, null, 8, ["reason", "pending", "onSubmit"])) : C("", !0)
        ], 8, Ze);
      }), 128)),
      s.value ? (d(), $(a(V), {
        key: 1,
        small: "",
        onClick: u[2] || (u[2] = (n) => A(w.value + 1))
      }, {
        default: h(() => [...u[5] || (u[5] = [
          U("Show more", -1)
        ])]),
        _: 1
      })) : C("", !0),
      R.value ? (d(), O("p", Qe, B(R.value), 1)) : E.value ? (d(), O("p", et, B(E.value), 1)) : C("", !0)
    ]));
  }
}, nt = /* @__PURE__ */ q(tt, [["__scopeId", "data-v-91280b9f"]]), M = "journal.core.helpers", st = `${M}.context-limit-on`, se = `${M}.context-limit-tokens`, ye = `${M}.context-limit-kinds`, K = `${M}.context-limit-profiles`, Z = `${M}.read-only-helper-profile-limits`, at = `${M}.read-only-helper-run-limit`, ot = `${M}.read-only-helper-kept-limit`, rt = "none", ge = (t) => `${t / 1e3}k`, ke = (t) => {
  const l = t.lastIndexOf(":");
  return { name: t.slice(0, l).trim(), value: t.slice(l + 1).trim() };
}, H = (t, l) => {
  var e;
  return (e = (t ?? []).map(ke).find((o) => o.name === l)) == null ? void 0 : e.value;
}, ue = (t) => t === rt ? "No cap" : ge(Number(t));
function de(t, l, e) {
  if (t(st) !== !0) return { text: "Off", where: "Context limit is off", own: !1 };
  const o = e ? H(t(K), e) : void 0;
  if (o !== void 0) return { text: ue(o), where: "Own value", own: !0 };
  const i = H(t(ye), l);
  return i !== void 0 ? { text: ue(i), where: "Set for its kind", own: !1 } : { text: ge(Number(t(se))), where: "Set for every agent", own: !1 };
}
const lt = (t) => t > 0 ? t : null, it = { worker: "workers" }, z = "merger", ce = "designer";
function pe(t, l, e, o, i, p = {}) {
  return { key: t, name: l, line: e, running: o.running, runLimit: o.run_limit, kept: o.kept, keptLimit: lt(o.kept_limit), cap: i, ...p };
}
function ut(t, l) {
  const e = t.filter((s) => !s.per_profile).map((s) => pe(s.key, s.label, s.line, s, de(l, s.key, ""), { screen: it[s.key] ?? "read-only", role: s.key, profile: "", defaultProfile: s.default_profile })), o = t.find((s) => s.per_profile);
  if (!o) return e;
  const i = (s) => pe(`${o.key}:${s.profile}`, s.title, s.line, s, de(l, o.key, s.profile), { screen: s.group === z ? z : "read-only", role: o.key, profile: s.profile }), p = o.profiles.filter((s) => s.group === z || s.group === ce).map(i), m = o.profiles.filter((s) => s.group !== z && s.group !== ce).map((s) => ({ ...i(s), indent: !0 })), w = { key: o.key, name: "Read-only helpers", group: !0, screen: "read-only", role: o.key, profile: "", line: `${o.running} running, ${o.kept} kept. Every profile runs up to ${o.run_limit} and keeps ${o.kept_limit ? `up to ${o.kept_limit}` : "any number"} unless it has limits of its own.` };
  return [...e, ...p, w, ...m];
}
const ee = Array.from({ length: 10 }, (t, l) => (l + 1) * 1e5), dt = (t) => t.filter((l) => !l.group && (re(l.running, l.runLimit) || re(l.kept, l.keptLimit ?? 0))).length;
function we(t, l) {
  const e = c(() => t.props.limits.rows.value ?? []), o = c(() => ut(e.value, l.value)), i = c(() => !!t.props.limits.failure.value);
  return { rows: o, unreadable: i, reread: () => t.reload("limits") };
}
const ct = {
  class: "type",
  "data-agent-type-screen": ""
}, pt = { class: "typebody" }, ft = {
  class: "typemain",
  "data-type-settings": ""
}, vt = { class: "typeside" }, J = "none", mt = {
  __name: "AgentSettingsTypeScreen",
  props: { row: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back"],
  setup(t, { emit: l }) {
    const e = t, o = l, i = G(), p = c(() => i.props["type-screen"].data.value), m = c(() => {
      var n;
      return ((n = p.value) == null ? void 0 : n.nodes) ?? [];
    }), w = c(() => e.row.profile !== "");
    async function s() {
      i.state["type-screen.type"] = e.row.screen, await i.reload("type-screen");
    }
    ne(p, (n) => {
      n && e.draft.load([n]);
    }), Y(s);
    const S = c(() => (e.draft.value(Z) ?? []).map((n) => n.split(":"))), R = c(() => S.value.find((n) => n[0] === e.row.profile)), E = c(() => ({ running: Number(e.draft.value(at)), kept: Number(e.draft.value(ot)) })), T = (n) => R.value ? Number(R.value[n === "running" ? 1 : 2]) : null;
    function N(n, f) {
      const b = S.value.filter((j) => j[0] !== e.row.profile).map((j) => j.join(":"));
      if (f === null) return e.draft.set(Z, b);
      if (f === "") return;
      const P = n === "running" ? f : T("running") ?? E.value.running, F = n === "kept" ? f : T("kept") ?? E.value.kept;
      e.draft.set(Z, [...b, `${e.row.profile}:${P}:${F}`]);
    }
    const I = c(() => e.row.group ? "" : e.row.profile || e.row.defaultProfile || ""), L = c(() => H(e.draft.value(K), I.value)), A = c(() => L.value === void 0 ? "kind" : L.value === J ? "none" : "own"), W = c(() => {
      const n = H(e.draft.value(ye), e.row.role);
      return n === J ? null : Number(n ?? e.draft.value(se));
    });
    function y({ mode: n, size: f }) {
      const b = (e.draft.value(K) ?? []).filter((P) => P.slice(0, P.lastIndexOf(":")).trim() !== I.value);
      e.draft.set(K, n === "kind" ? b : [...b, `${I.value}:${n === "none" ? J : f}`]);
    }
    const u = (n) => i.open("agents.agents", n.id);
    return (n, f) => (d(), O("div", ct, [
      k(a(Ie), {
        parent: "Helpers",
        current: t.row.name,
        onBack: f[0] || (f[0] = (b) => o("back"))
      }, null, 8, ["current"]),
      v("div", pt, [
        v("div", ft, [
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
          I.value ? (d(), $(a(Pe), {
            key: 2,
            label: "Context cap",
            help: "The context size at which this type is compacted.",
            source: A.value === "own" || A.value === "none" ? "own" : "default",
            "data-context-cap": ""
          }, {
            default: h(() => [
              k(a(Be), {
                mode: A.value,
                "kind-value": W.value,
                "own-value": A.value === "own" ? Number(L.value) : null,
                sizes: a(ee),
                disabled: t.readOnly,
                onChange: y
              }, null, 8, ["mode", "kind-value", "own-value", "sizes", "disabled"])
            ]),
            _: 1
          }, 8, ["source"])) : C("", !0)
        ]),
        v("aside", vt, [
          f[3] || (f[3] = v("h3", null, "Agents", -1)),
          k(nt, {
            role: t.row.role,
            profile: t.row.profile,
            onOpenAgent: u
          }, null, 8, ["role", "profile"])
        ])
      ])
    ]));
  }
}, yt = /* @__PURE__ */ q(mt, [["__scopeId", "data-v-51bee498"]]), gt = {
  class: "agents",
  "data-agent-settings-agents": ""
}, kt = {
  __name: "AgentSettingsAgents",
  props: { draft: { type: Object, required: !0 } },
  setup(t) {
    const l = t, e = G(), { rows: o, unreadable: i, reread: p } = we(e, l.draft), m = _(null);
    Y(p);
    const w = (s) => {
      m.value = o.value.find((S) => S.key === s);
    };
    return (s, S) => (d(), O("section", gt, [
      m.value ? (d(), $(yt, {
        key: 0,
        row: m.value,
        draft: t.draft,
        "read-only": a(e).readOnly,
        onBack: S[0] || (S[0] = (R) => m.value = null)
      }, null, 8, ["row", "draft", "read-only"])) : a(i) ? (d(), $(a(je), {
        key: 1,
        kind: "unreadable",
        text: "The counts could not be read.",
        onRetry: a(p)
      }, null, 8, ["onRetry"])) : (d(), $(a(Le), {
        key: 2,
        rows: a(o),
        onOpen: w
      }, null, 8, ["rows"]))
    ]));
  }
}, wt = /* @__PURE__ */ q(kt, [["__scopeId", "data-v-05cc036a"]]), bt = {
  class: "page",
  "data-agent-settings-presets": ""
}, ht = { class: "crumb" }, $t = { class: "body" }, St = { class: "cards" }, Ot = "Any other mix of the eight switches. The form shows Custom as soon as the switches match neither preset.", _t = {
  __name: "AgentSettingsPresets",
  props: { presets: { type: Array, required: !0 }, switches: { type: Array, required: !0 }, now: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back", "fill"],
  setup(t, { emit: l }) {
    const e = l;
    return (o, i) => (d(), O("section", bt, [
      v("div", ht, [
        v("button", {
          type: "button",
          class: "back",
          "data-presets-back": "",
          onClick: i[0] || (i[0] = (p) => e("back"))
        }, "‹ Back"),
        i[1] || (i[1] = v("b", null, "What is a preset?", -1))
      ]),
      v("div", $t, [
        i[2] || (i[2] = v("p", { class: "lead" }, "A preset is a set of eight switches and nothing more. It is not a kind of agent: the main agent is the same program under every preset, and a preset only fills in the switches below. Nothing is saved until you press Save.", -1)),
        v("div", St, [
          (d(!0), O(te, null, fe(t.presets, (p) => (d(), $(a(ie), {
            key: p.key,
            name: p.name,
            line: p.line,
            "can-fill": !t.readOnly,
            onFill: (m) => e("fill", p.key)
          }, null, 8, ["name", "line", "can-fill", "onFill"]))), 128)),
          k(a(ie), {
            name: "Custom",
            line: Ot
          })
        ]),
        k(a(Fe), {
          rows: t.switches,
          presets: t.presets,
          now: t.now
        }, null, 8, ["rows", "presets", "now"])
      ])
    ]));
  }
}, Ct = /* @__PURE__ */ q(_t, [["__scopeId", "data-v-2cf94460"]]), At = { class: "screen" }, Tt = { class: "rail" }, Nt = {
  __name: "AgentSettingsScreen",
  props: { nodes: { type: Array, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 }, extras: { type: Object, default: () => ({}) }, found: { type: String, default: "" } },
  setup(t) {
    const l = t, e = _(null), o = c(() => qe(l.nodes));
    ne(() => l.found, (p) => p && Se(() => {
      var m, w;
      return (w = (m = e.value) == null ? void 0 : m.querySelector(`[data-setting="${p}"]`)) == null ? void 0 : w.scrollIntoView({ block: "center" });
    }), { immediate: !0, flush: "post" });
    const i = (p) => {
      var m, w;
      return (w = (m = e.value) == null ? void 0 : m.querySelector(`[data-section="${p}"]`)) == null ? void 0 : w.scrollIntoView({ block: "start", behavior: "smooth" });
    };
    return (p, m) => (d(), O("div", At, [
      v("nav", Tt, [
        k(a(Me), {
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
}, Q = /* @__PURE__ */ q(Nt, [["__scopeId", "data-v-1cab27ca"]]), xt = {
  class: "settings",
  "data-agent-settings": ""
}, Rt = { class: "head" }, Et = {
  class: "env",
  "data-settings-environment": ""
}, It = { class: "settings-bar" }, Pt = {
  key: 1,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, Bt = {
  key: 0,
  class: "hint",
  "data-work-hint": ""
}, jt = "journal.suites.coding.auto-mode", Lt = "journal.suites.coding.workers.main-dispatches-workers", Ft = 1200, qt = {
  __name: "AgentSettings",
  setup(t) {
    const l = { work: "work-screen", tests: "tests-screen", advanced: "advanced-screen", "helper-types": "helper-types-screen" }, e = G(), o = _("work"), i = [{ key: "work", label: "Work" }, { key: "agents", label: "Helpers", count_field: "full" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }], p = c(() => i.find((r) => r.key === o.value)), m = () => Object.values(l).map((r) => e.props[r].data.value), w = c(() => m().every(Boolean)), s = Ue({
      run: (r) => e.run(r),
      reload: async () => {
        const r = "type-screen.type" in e.state;
        await Promise.all([...Object.values(l).map((g) => e.reload(g)), e.reload("limits"), ...r ? [e.reload("type-screen")] : []]), s.load([...m(), ...r ? [e.props["type-screen"].data.value] : []]);
      }
    });
    ne(m, (r) => {
      r.every(Boolean) && s.load(r);
    }, { immediate: !0 });
    const { rows: S } = we(e, s), R = c(() => dt(S.value)), E = c(() => R.value ? { full: `${R.value} full` } : {});
    Y(() => e.reload("limits"));
    const T = [{ key: "main", name: "Main agent" }, { key: "worker", name: "Workers" }, { key: "helper", name: "Read-only helpers" }], N = (r) => {
      var g;
      return ((g = S.value.find((D) => D.profile === r)) == null ? void 0 : g.name) ?? r;
    }, I = c(() => (s.value(K) ?? []).map(ke).map(({ name: r, value: g }) => ({ name: N(r), value: g === "none" ? "no cap" : `${Number(g) / 1e3}k` }))), L = c(() => ({ "keyed-cap-table": { rows: T, sizes: ee, defaultCap: Number(s.value(se)) || ee[0], ownCaps: I.value } })), A = (r) => {
      var g;
      return ((g = e.props[l[r]].data.value) == null ? void 0 : g.nodes) ?? [];
    }, W = c(() => s.value(jt) === !1 && s.value(Lt) === !1), y = c(() => !e.readOnly), u = _("main"), n = c(() => {
      var r;
      return ((r = e.props.work.data.value) == null ? void 0 : r.presets) ?? [];
    }), f = c(() => {
      var r;
      return ((r = e.props.work.data.value) == null ? void 0 : r.switches) ?? [];
    }), b = c(() => Object.fromEntries(f.value.map((r) => [r.key, s.value(r.key)]))), P = c(() => We(b.value, n.value)), F = (r) => s.fill(n.value.find((g) => g.key === r).values), j = c(() => {
      var r;
      return ((r = e.props.find.data.value) == null ? void 0 : r.rows) ?? [];
    }), x = _("");
    let X = null;
    const be = (r) => r.startsWith("helper-type") ? "agents" : r;
    function he(r) {
      u.value = "main", ae({ key: be(r.screen) }), x.value = r.key, clearTimeout(X), X = setTimeout(() => {
        x.value = "";
      }, Ft);
    }
    _e(() => clearTimeout(X));
    function ae(r) {
      o.value = r.key, e.state.tab = r.key === "agents" ? "agents" : "";
    }
    return (r, g) => (d(), $(a(Ne), { padding: "0" }, {
      default: h(() => [
        v("div", xt, [
          k(a(oe), { value: u.value }, {
            main: h(() => [
              v("div", Rt, [
                v("span", Et, B(a(e).environment), 1)
              ]),
              n.value.length ? (d(), $(a(De), {
                key: 0,
                presets: n.value,
                current: P.value,
                disabled: a(e).readOnly,
                onPick: F,
                onOpenPage: g[0] || (g[0] = (D) => u.value = "presets")
              }, {
                default: h(() => [
                  k(a(Ve), {
                    index: j.value,
                    onPick: he
                  }, null, 8, ["index"])
                ]),
                _: 1
              }, 8, ["presets", "current", "disabled"])) : C("", !0),
              v("div", It, [
                k(a(xe), {
                  tabs: i,
                  active: p.value,
                  answer: E.value,
                  onChoose: ae
                }, null, 8, ["active", "answer"])
              ]),
              a(e).readOnly ? (d(), O("p", Pt, "Only a person can change these settings. You can read every value, and ask a person for a change.")) : C("", !0),
              v("div", {
                class: ve(["settings-body", { flush: o.value === "agents" }])
              }, [
                k(a(Re), { tab: p.value }, {
                  default: h(() => [
                    k(a(oe), { value: o.value }, {
                      work: h(() => [
                        w.value ? (d(), $(Q, {
                          key: "work",
                          nodes: A("work"),
                          draft: a(s),
                          "read-only": a(e).readOnly,
                          found: x.value,
                          "data-agent-settings-work": ""
                        }, {
                          before: h(() => [
                            W.value ? (d(), O("p", Bt, "With Auto off and no workers, nothing starts the work: a person starts tasks or turns one of them on.")) : C("", !0)
                          ]),
                          _: 1
                        }, 8, ["nodes", "draft", "read-only", "found"])) : C("", !0)
                      ]),
                      agents: h(() => [
                        k(wt, { draft: a(s) }, null, 8, ["draft"])
                      ]),
                      tests: h(() => [
                        w.value ? (d(), $(Q, {
                          key: "tests",
                          nodes: A("tests"),
                          draft: a(s),
                          "read-only": a(e).readOnly,
                          found: x.value,
                          "data-agent-settings-tests": ""
                        }, null, 8, ["nodes", "draft", "read-only", "found"])) : C("", !0)
                      ]),
                      advanced: h(() => [
                        w.value ? (d(), $(Q, {
                          key: "advanced",
                          nodes: A("advanced"),
                          draft: a(s),
                          "read-only": a(e).readOnly,
                          found: x.value,
                          extras: L.value,
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
              k(Ct, {
                presets: n.value,
                switches: f.value,
                now: b.value,
                "read-only": a(e).readOnly,
                onBack: g[1] || (g[1] = (D) => u.value = "main"),
                onFill: F
              }, null, 8, ["presets", "switches", "now", "read-only"])
            ]),
            _: 1
          }, 8, ["value"]),
          y.value ? (d(), $(a(Ke), {
            key: 0,
            changes: a(s).changes(),
            "can-save": a(s).canSave.value,
            pending: a(s).pending.value,
            reason: a(s).reason.value,
            environment: a(e).environment,
            onSave: g[2] || (g[2] = (D) => a(s).apply()),
            onCancel: g[3] || (g[3] = (D) => a(s).reset())
          }, null, 8, ["changes", "can-save", "pending", "reason", "environment"])) : C("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, Vt = /* @__PURE__ */ q(qt, [["__scopeId", "data-v-6d0deb31"]]);
export {
  Vt as A
};
