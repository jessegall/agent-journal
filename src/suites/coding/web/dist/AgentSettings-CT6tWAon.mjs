import { openBlock as u, createElementBlock as $, createElementVNode as m, Fragment as te, renderList as fe, createBlock as S, unref as s, createVNode as k, withModifiers as Se, withCtx as h, createTextVNode as M, ref as C, computed as c, onMounted as H, toDisplayString as B, createCommentVNode as A, normalizeClass as pe, watch as ne, nextTick as Oe, renderSlot as $e, onBeforeUnmount as Ce } from "vue";
import { TextInput as Ae, Btn as D, useWindow as Y, useNow as Te, agentTitle as xe, age as Ne, agentNumber as Ee, TabBody as Re, SwitchCase as ve, WindowRoom as _e, InnerTabs as Ie } from "@journal/window-kit";
import { SettingPresetCard as oe, SettingPresetCompareTable as Pe, SettingEmptyState as Be, isFull as re, SettingBackPath as je, SettingPerTypeOverrideRow as le, SettingsScreen as me, SettingRow as Le, SettingThreeWayCap as qe, SettingBanner as Fe, SettingHelperTypeTable as Me, sectionsOf as Ue, SettingSectionList as We, useSettingsDraft as De, currentPreset as Ve, SettingPresetBand as Ke, FindBox as ze, ChangeFoot as He } from "@journal/setting-components";
import { _ as q } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const Ye = {
  class: "page",
  "data-agent-settings-presets": ""
}, Ge = { class: "crumb" }, Xe = { class: "body" }, Ze = { class: "cards" }, Je = "Any other mix of the eight switches. The form shows Custom as soon as the switches match neither preset.", Qe = {
  __name: "AgentSettingsPresets",
  props: { presets: { type: Array, required: !0 }, switches: { type: Array, required: !0 }, now: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back", "fill"],
  setup(e, { emit: l }) {
    const t = l;
    return (o, i) => (u(), $("section", Ye, [
      m("div", Ge, [
        m("button", {
          type: "button",
          class: "back",
          "data-presets-back": "",
          onClick: i[0] || (i[0] = (f) => t("back"))
        }, "‹ Back"),
        i[1] || (i[1] = m("b", null, "What is a preset?", -1))
      ]),
      m("div", Xe, [
        i[2] || (i[2] = m("p", { class: "lead" }, "A preset is a set of eight switches and nothing more. It is not a type of agent: the main agent is the same program under every preset, and a preset only fills in the switches below. Nothing is saved until you press Save.", -1)),
        m("div", Ze, [
          (u(!0), $(te, null, fe(e.presets, (f) => (u(), S(s(oe), {
            key: f.key,
            name: f.name,
            line: f.line,
            "can-fill": !e.readOnly,
            onFill: (v) => t("fill", f.key)
          }, null, 8, ["name", "line", "can-fill", "onFill"]))), 128)),
          k(s(oe), {
            name: "Custom",
            line: Je
          })
        ]),
        k(s(Pe), {
          rows: e.switches,
          presets: e.presets,
          now: e.now
        }, null, 8, ["rows", "presets", "now"])
      ])
    ]));
  }
}, et = /* @__PURE__ */ q(Qe, [["__scopeId", "data-v-0d0e399d"]]), tt = { class: "action-buttons" }, nt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (l, t) => (u(), $("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = Se((o) => l.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = m("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      k(s(Ae), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (o) => l.$emit("update:reason", o))
      }, null, 8, ["model-value", "disabled"]),
      m("div", tt, [
        k(s(D), {
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
        k(s(D), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (o) => l.$emit("cancel"))
        }, {
          default: h(() => [...t[4] || (t[4] = [
            M("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, at = /* @__PURE__ */ q(nt, [["__scopeId", "data-v-818a34c9"]]), st = {
  class: "type-agents",
  "data-type-agents": ""
}, ot = { class: "models" }, rt = ["data-count-agent"], lt = { class: "person-text" }, it = {
  key: 2,
  role: "alert",
  class: "bad"
}, dt = {
  key: 3,
  role: "status"
}, ut = {
  __name: "AgentTypeAgents",
  props: { role: { type: String, required: !0 }, profile: { type: String, default: "" } },
  emits: ["open-agent", "retired"],
  setup(e, { emit: l }) {
    const t = e, o = l, i = Y(), f = Te(), v = C([]), w = C(0), a = C(!1), O = C(!1), E = C(""), R = C(""), T = C(null), x = C(""), _ = c(() => v.value.filter((y) => {
      var d;
      return y.state !== "retired" && y.role === t.role && (!t.profile || (((d = y.facts) == null ? void 0 : d.profile) || y.profile) === t.profile);
    }).sort((y, d) => (y.state !== "running") - (d.state !== "running") || String(y.ended_at || y.created_at).localeCompare(String(d.ended_at || d.created_at)))), j = c(() => {
      var d;
      const y = /* @__PURE__ */ new Map();
      for (const n of _.value) {
        const p = ((d = n.facts) == null ? void 0 : d.model) || n.program_model;
        p && y.set(p, (y.get(p) || 0) + 1);
      }
      return [...y].map(([n, p]) => `${p} ${n}`).join(", ");
    });
    async function I(y = 1) {
      i.state["count-agents.role"] = t.role, t.profile ? i.state["count-agents.profile"] = t.profile : delete i.state["count-agents.profile"], i.state["count-agents.page"] = String(y), await i.reload("count-agents");
      const d = i.props["count-agents"];
      v.value = y === 1 ? [...d.rows.value] : [...v.value, ...d.rows.value], w.value = y, a.value = d.more.value;
    }
    async function U(y) {
      if (!x.value.trim() || O.value) return;
      O.value = !0;
      const d = await i.run(["agent", "retire", String(y.number), "--reason", x.value.trim()]);
      E.value = d.ok ? "" : "The agent could not be retired. Try again.", d.ok && (T.value = null, x.value = "", R.value = "Agent retired permanently.", o("retired"), await I()), O.value = !1;
    }
    return H(() => I()), (y, d) => (u(), $("section", st, [
      m("p", ot, B(j.value), 1),
      _.value.length ? A("", !0) : (u(), S(s(Be), {
        key: 0,
        title: "No agents here yet",
        line: "An agent shows here as soon as one of this type starts."
      })),
      (u(!0), $(te, null, fe(_.value, (n) => {
        var p, b, P, L;
        return u(), $("div", {
          key: n.id,
          class: "person",
          "data-count-agent": n.id
        }, [
          m("span", {
            class: pe(["dot", { running: n.state === "running" }])
          }, null, 2),
          m("div", lt, [
            m("strong", null, B(s(xe)(n).text), 1),
            M(" " + B(n.state === "running" ? "Running" : "Idle") + ", " + B(s(Ne)(n.state === "running" ? n.process_started_at || n.created_at : n.ended_at, s(f))) + " ", 1),
            m("small", null, B([n.program, (p = n.facts) == null ? void 0 : p.model, (b = n.facts) == null ? void 0 : b.effort, s(Ee)(n)].filter(Boolean).join(", ")), 1),
            m("small", null, B(((P = n.facts) == null ? void 0 : P.task_title) || ((L = n.facts) == null ? void 0 : L.helper_job)), 1)
          ]),
          k(s(D), {
            small: "",
            onClick: (N) => o("open-agent", n)
          }, {
            default: h(() => [...d[3] || (d[3] = [
              M("Open", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]),
          n.state === "idle" && !s(i).readOnly ? (u(), S(s(D), {
            key: 0,
            small: "",
            onClick: (N) => {
              T.value = n.id, x.value = "";
            }
          }, {
            default: h(() => [...d[4] || (d[4] = [
              M("Retire", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])) : A("", !0),
          T.value === n.id ? (u(), S(at, {
            key: 1,
            reason: x.value,
            "onUpdate:reason": d[0] || (d[0] = (N) => x.value = N),
            pending: O.value,
            onSubmit: (N) => U(n),
            onCancel: d[1] || (d[1] = (N) => T.value = null)
          }, null, 8, ["reason", "pending", "onSubmit"])) : A("", !0)
        ], 8, rt);
      }), 128)),
      a.value ? (u(), S(s(D), {
        key: 1,
        small: "",
        onClick: d[2] || (d[2] = (n) => I(w.value + 1))
      }, {
        default: h(() => [...d[5] || (d[5] = [
          M("Show more", -1)
        ])]),
        _: 1
      })) : A("", !0),
      E.value ? (u(), $("p", it, B(E.value), 1)) : R.value ? (u(), $("p", dt, B(R.value), 1)) : A("", !0)
    ]));
  }
}, ct = /* @__PURE__ */ q(ut, [["__scopeId", "data-v-77081f39"]]), F = "journal.core.helpers", ft = `${F}.context-limit-on`, ae = `${F}.context-limit-tokens`, ye = `${F}.context-limit-kinds`, V = `${F}.context-limit-profiles`, Z = `${F}.read-only-helper-profile-limits`, pt = `${F}.read-only-helper-run-limit`, vt = `${F}.read-only-helper-kept-limit`, mt = "none", ge = (e) => `${e / 1e3}k`, ke = (e) => {
  const l = e.lastIndexOf(":");
  return { name: e.slice(0, l).trim(), value: e.slice(l + 1).trim() };
}, z = (e, l) => {
  var t;
  return (t = (e ?? []).map(ke).find((o) => o.name === l)) == null ? void 0 : t.value;
}, ie = (e) => e === mt ? "No cap" : ge(Number(e));
function de(e, l, t) {
  if (e(ft) !== !0) return { text: "Off", where: "Context limit is off", own: !1 };
  const o = t ? z(e(V), t) : void 0;
  if (o !== void 0) return { text: ie(o), where: "Own value", own: !0 };
  const i = z(e(ye), l);
  return i !== void 0 ? { text: ie(i), where: "Set for its type", own: !1 } : { text: ge(Number(e(ae))), where: "Set for every agent", own: !1 };
}
const yt = (e) => e > 0 ? e : null, gt = { worker: "workers" }, K = "merger", ue = "designer";
function ce(e, l, t, o, i, f = {}) {
  return { key: e, name: l, line: t, running: o.running, runLimit: o.run_limit, kept: o.kept, keptLimit: yt(o.kept_limit), cap: i, ...f };
}
function kt(e, l) {
  const t = e.filter((a) => !a.per_profile).map((a) => ce(a.key, a.label, a.line, a, de(l, a.key, ""), { screen: gt[a.key] ?? "read-only", role: a.key, profile: "", defaultProfile: a.default_profile })), o = e.find((a) => a.per_profile);
  if (!o) return t;
  const i = (a) => ce(`${o.key}:${a.profile}`, a.title, a.line, a, de(l, o.key, a.profile), { screen: a.group === K ? K : "read-only", role: o.key, profile: a.profile }), f = o.profiles.filter((a) => a.group === K || a.group === ue).map(i), v = o.profiles.filter((a) => a.group !== K && a.group !== ue).map((a) => ({ ...i(a), indent: !0 })), w = { key: o.key, name: "Read-only helpers", group: !0, screen: "read-only", role: o.key, profile: "", line: `${o.running} running, ${o.kept} kept. Every profile runs up to ${o.run_limit} and keeps ${o.kept_limit ? `up to ${o.kept_limit}` : "any number"} unless it has limits of its own.` };
  return [...t, ...f, w, ...v];
}
const ee = Array.from({ length: 10 }, (e, l) => (l + 1) * 1e5), wt = (e) => e.filter((l) => !l.group && (re(l.running, l.runLimit) || re(l.kept, l.keptLimit ?? 0))).length;
function we(e, l) {
  const t = c(() => e.props.limits.rows.value ?? []), o = c(() => kt(t.value, l.value)), i = c(() => !!e.props.limits.failure.value);
  return { rows: o, unreadable: i, reread: () => e.reload("limits") };
}
const bt = {
  class: "type",
  "data-agent-type-screen": ""
}, ht = { class: "typebody" }, St = {
  class: "typemain",
  "data-type-settings": ""
}, Ot = { class: "typeside" }, J = "none", $t = {
  __name: "AgentSettingsTypeScreen",
  props: { row: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back"],
  setup(e, { emit: l }) {
    const t = e, o = l, i = Y(), f = c(() => i.props["type-screen"].data.value), v = c(() => {
      var n;
      return ((n = f.value) == null ? void 0 : n.nodes) ?? [];
    }), w = c(() => t.row.profile !== "");
    async function a() {
      i.state["type-screen.type"] = t.row.screen, await i.reload("type-screen");
    }
    ne(f, (n) => {
      n && t.draft.load([n]);
    }), H(a);
    const O = c(() => (t.draft.value(Z) ?? []).map((n) => n.split(":"))), E = c(() => O.value.find((n) => n[0] === t.row.profile)), R = c(() => ({ running: Number(t.draft.value(pt)), kept: Number(t.draft.value(vt)) })), T = (n) => E.value ? Number(E.value[n === "running" ? 1 : 2]) : null;
    function x(n, p) {
      const b = O.value.filter((N) => N[0] !== t.row.profile).map((N) => N.join(":"));
      if (p === null) return t.draft.set(Z, b);
      if (p === "") return;
      const P = n === "running" ? p : T("running") ?? R.value.running, L = n === "kept" ? p : T("kept") ?? R.value.kept;
      t.draft.set(Z, [...b, `${t.row.profile}:${P}:${L}`]);
    }
    const _ = c(() => t.row.group ? "" : t.row.profile || t.row.defaultProfile || ""), j = c(() => z(t.draft.value(V), _.value)), I = c(() => j.value === void 0 ? "kind" : j.value === J ? "none" : "own"), U = c(() => {
      const n = z(t.draft.value(ye), t.row.role);
      return n === J ? null : Number(n ?? t.draft.value(ae));
    });
    function y({ mode: n, size: p }) {
      const b = (t.draft.value(V) ?? []).filter((P) => P.slice(0, P.lastIndexOf(":")).trim() !== _.value);
      t.draft.set(V, n === "kind" ? b : [...b, `${_.value}:${n === "none" ? J : p}`]);
    }
    const d = (n) => i.open("agents.agents", n.id);
    return (n, p) => (u(), $("div", bt, [
      k(s(je), {
        parent: "Helpers",
        current: e.row.name,
        onBack: p[0] || (p[0] = (b) => o("back"))
      }, null, 8, ["current"]),
      m("div", ht, [
        m("div", St, [
          w.value && e.row.screen === "read-only" ? (u(), $(te, { key: 0 }, [
            k(s(le), {
              label: "Running",
              help: "Agents of this profile that run at once.",
              "every-value": R.value.running,
              "own-value": T("running"),
              disabled: e.readOnly,
              "data-override-running": "",
              "onUpdate:ownValue": p[1] || (p[1] = (b) => x("running", b))
            }, null, 8, ["every-value", "own-value", "disabled"]),
            k(s(le), {
              label: "Kept",
              help: "Agents of this profile kept until retired, running or idle. At 0 there is no limit.",
              "every-value": R.value.kept,
              "own-value": T("kept"),
              disabled: e.readOnly,
              "data-override-kept": "",
              "onUpdate:ownValue": p[2] || (p[2] = (b) => x("kept", b))
            }, null, 8, ["every-value", "own-value", "disabled"])
          ], 64)) : (u(), S(s(me), {
            key: 1,
            nodes: v.value,
            draft: e.draft,
            "read-only": e.readOnly
          }, null, 8, ["nodes", "draft", "read-only"])),
          _.value ? (u(), S(s(Le), {
            key: 2,
            label: "Context cap",
            help: "The context size at which this type is compacted.",
            source: I.value === "own" || I.value === "none" ? "own" : "default",
            "data-context-cap": ""
          }, {
            default: h(() => [
              k(s(qe), {
                mode: I.value,
                "kind-value": U.value,
                "own-value": I.value === "own" ? Number(j.value) : null,
                sizes: s(ee),
                disabled: e.readOnly,
                onChange: y
              }, null, 8, ["mode", "kind-value", "own-value", "sizes", "disabled"])
            ]),
            _: 1
          }, 8, ["source"])) : A("", !0)
        ]),
        m("aside", Ot, [
          p[3] || (p[3] = m("h3", null, "Agents", -1)),
          k(ct, {
            role: e.row.role,
            profile: e.row.profile,
            onOpenAgent: d
          }, null, 8, ["role", "profile"])
        ])
      ])
    ]));
  }
}, Ct = /* @__PURE__ */ q($t, [["__scopeId", "data-v-12fb5c41"]]), At = {
  class: "agents",
  "data-agent-settings-agents": ""
}, Tt = {
  __name: "AgentSettingsAgents",
  props: { draft: { type: Object, required: !0 } },
  setup(e) {
    const l = e, t = Y(), { rows: o, unreadable: i, reread: f } = we(t, l.draft), v = C(null);
    H(f);
    const w = (a) => {
      v.value = o.value.find((O) => O.key === a);
    };
    return (a, O) => (u(), $("section", At, [
      v.value ? (u(), S(Ct, {
        key: 0,
        row: v.value,
        draft: e.draft,
        "read-only": s(t).readOnly,
        onBack: O[0] || (O[0] = (E) => v.value = null)
      }, null, 8, ["row", "draft", "read-only"])) : s(i) ? (u(), S(s(Fe), {
        key: 1,
        kind: "unreadable",
        text: "The counts could not be read.",
        onRetry: s(f)
      }, null, 8, ["onRetry"])) : (u(), S(s(Me), {
        key: 2,
        rows: s(o),
        onOpen: w
      }, null, 8, ["rows"]))
    ]));
  }
}, xt = /* @__PURE__ */ q(Tt, [["__scopeId", "data-v-c7e6716c"]]), Nt = { class: "screen" }, Et = { class: "rail" }, Rt = {
  __name: "AgentSettingsScreen",
  props: { nodes: { type: Array, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 }, extras: { type: Object, default: () => ({}) }, found: { type: String, default: "" } },
  setup(e) {
    const l = e, t = C(null), o = c(() => Ue(l.nodes));
    ne(() => l.found, (f) => f && Oe(() => {
      var v, w;
      return (w = (v = t.value) == null ? void 0 : v.querySelector(`[data-setting="${f}"]`)) == null ? void 0 : w.scrollIntoView({ block: "center" });
    }), { immediate: !0, flush: "post" });
    const i = (f) => {
      var v, w;
      return (w = (v = t.value) == null ? void 0 : v.querySelector(`[data-section="${f}"]`)) == null ? void 0 : w.scrollIntoView({ block: "start", behavior: "smooth" });
    };
    return (f, v) => (u(), $("div", Nt, [
      m("nav", Et, [
        k(s(We), {
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
        $e(f.$slots, "before", {}, void 0, !0),
        k(s(me), {
          nodes: e.nodes,
          draft: e.draft,
          "read-only": e.readOnly,
          extras: e.extras,
          found: e.found
        }, null, 8, ["nodes", "draft", "read-only", "extras", "found"])
      ], 512)
    ]));
  }
}, Q = /* @__PURE__ */ q(Rt, [["__scopeId", "data-v-ab3a8dd5"]]), _t = {
  key: 0,
  class: "hint",
  "data-work-hint": ""
}, It = {
  __name: "AgentSettingsTab",
  props: { tab: { type: String, required: !0 }, active: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, isLoaded: Boolean, nodes: { type: Function, required: !0 }, readOnly: Boolean, found: { type: String, default: "" }, nothingStarts: Boolean, advancedExtras: { type: Object, required: !0 } },
  setup(e) {
    return (l, t) => (u(), $("div", {
      class: pe(["settings-body", { flush: e.tab === "agents" }])
    }, [
      k(s(Re), { tab: e.active }, {
        default: h(() => [
          k(s(ve), { value: e.tab }, {
            work: h(() => [
              e.isLoaded ? (u(), S(Q, {
                key: "work",
                nodes: e.nodes("work"),
                draft: e.draft,
                "read-only": e.readOnly,
                found: e.found,
                "data-agent-settings-work": ""
              }, {
                before: h(() => [
                  e.nothingStarts ? (u(), $("p", _t, "With Auto off and no workers, nothing starts the work: a user starts tasks or turns one of them on.")) : A("", !0)
                ]),
                _: 1
              }, 8, ["nodes", "draft", "read-only", "found"])) : A("", !0)
            ]),
            agents: h(() => [
              k(xt, { draft: e.draft }, null, 8, ["draft"])
            ]),
            tests: h(() => [
              e.isLoaded ? (u(), S(Q, {
                key: "tests",
                nodes: e.nodes("tests"),
                draft: e.draft,
                "read-only": e.readOnly,
                found: e.found,
                "data-agent-settings-tests": ""
              }, null, 8, ["nodes", "draft", "read-only", "found"])) : A("", !0)
            ]),
            advanced: h(() => [
              e.isLoaded ? (u(), S(Q, {
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
}, Pt = {
  class: "settings",
  "data-agent-settings": ""
}, Bt = { class: "head" }, jt = {
  class: "env",
  "data-settings-environment": ""
}, Lt = { class: "settings-bar" }, qt = {
  key: 1,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, Ft = "journal.suites.coding.auto-mode", Mt = "journal.suites.coding.workers.main-dispatches-workers", Ut = 1200, Wt = {
  __name: "AgentSettings",
  setup(e) {
    const l = { work: "work-screen", tests: "tests-screen", advanced: "advanced-screen", "helper-types": "helper-types-screen" }, t = Y(), o = C("work"), i = [{ key: "work", label: "Work" }, { key: "agents", label: "Helpers", count_field: "full" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }], f = c(() => i.find((r) => r.key === o.value)), v = () => Object.values(l).map((r) => t.props[r].data.value), w = c(() => v().every(Boolean)), a = De({
      run: (r) => t.run(r),
      reload: async () => {
        const r = "type-screen.type" in t.state;
        await Promise.all([...Object.values(l).map((g) => t.reload(g)), t.reload("limits"), ...r ? [t.reload("type-screen")] : []]), a.load([...v(), ...r ? [t.props["type-screen"].data.value] : []]);
      }
    });
    ne(v, (r) => {
      r.every(Boolean) && a.load(r);
    }, { immediate: !0 });
    const { rows: O } = we(t, a), E = c(() => wt(O.value)), R = c(() => E.value ? { full: `${E.value} full` } : {});
    H(() => t.reload("limits"));
    const T = [{ key: "main", name: "Main agent" }, { key: "worker", name: "Workers" }, { key: "helper", name: "Read-only helpers" }], x = (r) => {
      var g;
      return ((g = O.value.find((W) => W.profile === r)) == null ? void 0 : g.name) ?? r;
    }, _ = c(() => (a.value(V) ?? []).map(ke).map(({ name: r, value: g }) => ({ name: x(r), value: g === "none" ? "no cap" : `${Number(g) / 1e3}k` }))), j = c(() => ({ "keyed-cap-table": { rows: T, sizes: ee, defaultCap: Number(a.value(ae)) || ee[0], ownCaps: _.value } })), I = (r) => {
      var g;
      return ((g = t.props[l[r]].data.value) == null ? void 0 : g.nodes) ?? [];
    }, U = c(() => a.value(Ft) === !1 && a.value(Mt) === !1), y = c(() => !t.readOnly), d = C("main"), n = c(() => {
      var r;
      return ((r = t.props.work.data.value) == null ? void 0 : r.presets) ?? [];
    }), p = c(() => {
      var r;
      return ((r = t.props.work.data.value) == null ? void 0 : r.switches) ?? [];
    }), b = c(() => Object.fromEntries(p.value.map((r) => [r.key, a.value(r.key)]))), P = c(() => Ve(b.value, n.value)), L = (r) => a.fill(n.value.find((g) => g.key === r).values), N = c(() => {
      var r;
      return ((r = t.props.find.data.value) == null ? void 0 : r.rows) ?? [];
    }), G = C("");
    let X = null;
    const be = (r) => r.startsWith("helper-type") ? "agents" : r;
    function he(r) {
      d.value = "main", se({ key: be(r.screen) }), G.value = r.key, clearTimeout(X), X = setTimeout(() => {
        G.value = "";
      }, Ut);
    }
    Ce(() => clearTimeout(X));
    function se(r) {
      o.value = r.key, t.state.tab = r.key === "agents" ? "agents" : "";
    }
    return (r, g) => (u(), S(s(_e), { padding: "0" }, {
      default: h(() => [
        m("div", Pt, [
          k(s(ve), { value: d.value }, {
            main: h(() => [
              m("div", Bt, [
                m("span", jt, B(s(t).environment), 1)
              ]),
              n.value.length ? (u(), S(s(Ke), {
                key: 0,
                presets: n.value,
                current: P.value,
                disabled: s(t).readOnly,
                onPick: L,
                onOpenPage: g[0] || (g[0] = (W) => d.value = "presets")
              }, {
                default: h(() => [
                  k(s(ze), {
                    index: N.value,
                    onPick: he
                  }, null, 8, ["index"])
                ]),
                _: 1
              }, 8, ["presets", "current", "disabled"])) : A("", !0),
              m("div", Lt, [
                k(s(Ie), {
                  tabs: i,
                  active: f.value,
                  answer: R.value,
                  onChoose: se
                }, null, 8, ["active", "answer"])
              ]),
              s(t).readOnly ? (u(), $("p", qt, "Only a user can change these settings. You can read every value, and ask a user for a change.")) : A("", !0),
              k(It, {
                tab: o.value,
                active: f.value,
                draft: s(a),
                "is-loaded": w.value,
                nodes: I,
                "read-only": s(t).readOnly,
                found: G.value,
                "nothing-starts": U.value,
                "advanced-extras": j.value
              }, null, 8, ["tab", "active", "draft", "is-loaded", "read-only", "found", "nothing-starts", "advanced-extras"])
            ]),
            presets: h(() => [
              k(et, {
                presets: n.value,
                switches: p.value,
                now: b.value,
                "read-only": s(t).readOnly,
                onBack: g[1] || (g[1] = (W) => d.value = "main"),
                onFill: L
              }, null, 8, ["presets", "switches", "now", "read-only"])
            ]),
            _: 1
          }, 8, ["value"]),
          y.value ? (u(), S(s(He), {
            key: 0,
            changes: s(a).changes(),
            "can-save": s(a).canSave.value,
            pending: s(a).pending.value,
            reason: s(a).reason.value,
            environment: s(t).environment,
            onSave: g[2] || (g[2] = (W) => s(a).apply()),
            onCancel: g[3] || (g[3] = (W) => s(a).reset())
          }, null, 8, ["changes", "can-save", "pending", "reason", "environment"])) : A("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, Ht = /* @__PURE__ */ q(Wt, [["__scopeId", "data-v-d7950420"]]);
export {
  Ht as A
};
