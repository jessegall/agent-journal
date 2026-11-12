import { openBlock as d, createElementBlock as _, withModifiers as pe, createElementVNode as p, createVNode as k, unref as s, withCtx as h, createTextVNode as U, ref as A, computed as g, onMounted as K, toDisplayString as I, createBlock as $, createCommentVNode as C, Fragment as z, renderList as le, normalizeClass as ie, watch as J, nextTick as fe, renderSlot as ve, onBeforeUnmount as me } from "vue";
import { TextInput as ye, Btn as V, useWindow as H, useNow as ge, age as ke, WindowRoom as we, SwitchCase as Q, InnerTabs as be, TabBody as he } from "@journal/window-kit";
import { SettingEmptyState as $e, isFull as Z, SettingBackPath as Se, SettingPerTypeOverrideRow as ee, SettingsScreen as ue, SettingBanner as _e, SettingHelperTypeTable as Oe, SettingPresetCard as te, SettingPresetCompareTable as Ae, sectionsOf as Te, SettingSectionList as Ce, useSettingsDraft as Ee, currentPreset as Ne, SettingPresetBand as Re, FindBox as xe, ChangeFoot as Ie } from "@journal/setting-components";
import { _ as L } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const Be = { class: "action-buttons" }, Pe = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(t) {
    return (o, e) => (d(), _("form", {
      "data-agent-retire-confirm": "",
      onSubmit: e[2] || (e[2] = pe((a) => o.$emit("submit"), ["prevent"]))
    }, [
      e[5] || (e[5] = p("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      k(s(ye), {
        "model-value": t.reason,
        label: "Reason",
        disabled: t.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": e[0] || (e[0] = (a) => o.$emit("update:reason", a))
      }, null, 8, ["model-value", "disabled"]),
      p("div", Be, [
        k(s(V), {
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
        k(s(V), {
          small: "",
          disabled: t.pending,
          onClick: e[1] || (e[1] = (a) => o.$emit("cancel"))
        }, {
          default: h(() => [...e[4] || (e[4] = [
            U("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, je = /* @__PURE__ */ L(Pe, [["__scopeId", "data-v-92de7dd6"]]), Le = {
  class: "type-agents",
  "data-type-agents": ""
}, Fe = { class: "models" }, qe = ["data-count-agent"], Ue = { class: "person-text" }, Ve = {
  key: 2,
  role: "alert",
  class: "bad"
}, De = {
  key: 3,
  role: "status"
}, Me = {
  __name: "AgentTypeAgents",
  props: { role: { type: String, required: !0 }, profile: { type: String, default: "" } },
  emits: ["open-agent", "retired"],
  setup(t, { emit: o }) {
    const e = t, a = o, r = H(), c = ge(), f = A([]), w = A(0), n = A(!1), S = A(!1), N = A(""), R = A(""), O = A(null), E = A(""), j = g(() => f.value.filter((m) => {
      var u;
      return m.state !== "retired" && m.role === e.role && (!e.profile || (((u = m.facts) == null ? void 0 : u.profile) || m.profile) === e.profile);
    }).sort((m, u) => (m.state !== "running") - (u.state !== "running") || String(m.ended_at || m.created_at).localeCompare(String(u.ended_at || u.created_at)))), v = g(() => {
      var u;
      const m = /* @__PURE__ */ new Map();
      for (const i of j.value) {
        const x = ((u = i.facts) == null ? void 0 : u.model) || i.program_model;
        x && m.set(x, (m.get(x) || 0) + 1);
      }
      return [...m].map(([i, x]) => `${x} ${i}`).join(", ");
    });
    async function y(m = 1) {
      r.state["count-agents.role"] = e.role, e.profile ? r.state["count-agents.profile"] = e.profile : delete r.state["count-agents.profile"], r.state["count-agents.page"] = String(m), await r.reload("count-agents");
      const u = r.props["count-agents"];
      f.value = m === 1 ? [...u.rows.value] : [...f.value, ...u.rows.value], w.value = m, n.value = u.more.value;
    }
    async function T(m) {
      if (!E.value.trim() || S.value) return;
      S.value = !0;
      const u = await r.run(["agent", "retire", String(m.number), "--reason", E.value.trim()]);
      N.value = u.ok ? "" : "The agent could not be retired. Try again.", u.ok && (O.value = null, E.value = "", R.value = "Agent retired permanently.", a("retired"), await y()), S.value = !1;
    }
    return K(() => y()), (m, u) => (d(), _("section", Le, [
      p("p", Fe, I(v.value), 1),
      j.value.length ? C("", !0) : (d(), $(s($e), {
        key: 0,
        title: "No agents here yet",
        line: "An agent shows here as soon as one of this type starts."
      })),
      (d(!0), _(z, null, le(j.value, (i) => {
        var x, B, q, D, M;
        return d(), _("div", {
          key: i.id,
          class: "person",
          "data-count-agent": i.id
        }, [
          p("span", {
            class: ie(["dot", { running: i.state === "running" }])
          }, null, 2),
          p("div", Ue, [
            p("strong", null, I(((x = i.facts) == null ? void 0 : x.given_name) || i.number), 1),
            U(" " + I(i.state === "running" ? "Running" : "Idle") + ", " + I(s(ke)(i.state === "running" ? i.process_started_at || i.created_at : i.ended_at, s(c))) + " ", 1),
            p("small", null, I([i.program, (B = i.facts) == null ? void 0 : B.model, (q = i.facts) == null ? void 0 : q.effort, `${i.role} ${i.id}`].filter(Boolean).join(", ")), 1),
            p("small", null, I(((D = i.facts) == null ? void 0 : D.task_title) || ((M = i.facts) == null ? void 0 : M.helper_job)), 1)
          ]),
          k(s(V), {
            small: "",
            onClick: (P) => a("open-agent", i)
          }, {
            default: h(() => [...u[3] || (u[3] = [
              U("Open", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]),
          i.state === "idle" && !s(r).readOnly ? (d(), $(s(V), {
            key: 0,
            small: "",
            onClick: (P) => {
              O.value = i.id, E.value = "";
            }
          }, {
            default: h(() => [...u[4] || (u[4] = [
              U("Retire", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])) : C("", !0),
          O.value === i.id ? (d(), $(je, {
            key: 1,
            reason: E.value,
            "onUpdate:reason": u[0] || (u[0] = (P) => E.value = P),
            pending: S.value,
            onSubmit: (P) => T(i),
            onCancel: u[1] || (u[1] = (P) => O.value = null)
          }, null, 8, ["reason", "pending", "onSubmit"])) : C("", !0)
        ], 8, qe);
      }), 128)),
      n.value ? (d(), $(s(V), {
        key: 1,
        small: "",
        onClick: u[2] || (u[2] = (i) => y(w.value + 1))
      }, {
        default: h(() => [...u[5] || (u[5] = [
          U("Show more", -1)
        ])]),
        _: 1
      })) : C("", !0),
      N.value ? (d(), _("p", Ve, I(N.value), 1)) : R.value ? (d(), _("p", De, I(R.value), 1)) : C("", !0)
    ]));
  }
}, We = /* @__PURE__ */ L(Me, [["__scopeId", "data-v-91280b9f"]]), F = "journal.core.helpers", Ke = `${F}.context-limit-on`, He = `${F}.context-limit-tokens`, Ye = `${F}.context-limit-kinds`, Ge = `${F}.context-limit-profiles`, G = `${F}.read-only-helper-profile-limits`, Xe = `${F}.read-only-helper-run-limit`, ze = `${F}.read-only-helper-kept-limit`, Je = "none", de = (t) => `${t / 1e3}k`, Qe = (t) => {
  const o = t.lastIndexOf(":");
  return { name: t.slice(0, o).trim(), value: t.slice(o + 1).trim() };
}, ne = (t, o) => {
  var e;
  return (e = (t ?? []).map(Qe).find((a) => a.name === o)) == null ? void 0 : e.value;
}, se = (t) => t === Je ? "No cap" : de(Number(t));
function ae(t, o, e) {
  if (t(Ke) !== !0) return { text: "Off", where: "Context limit is off", own: !1 };
  const a = e ? ne(t(Ge), e) : void 0;
  if (a !== void 0) return { text: se(a), where: "Own cap", own: !0 };
  const r = ne(t(Ye), o);
  return r !== void 0 ? { text: se(r), where: "Set for its kind", own: !1 } : { text: de(Number(t(He))), where: "Set for every agent", own: !1 };
}
const Ze = (t) => t > 0 ? t : null, et = { worker: "workers" }, W = "merger", oe = "designer";
function re(t, o, e, a, r, c = {}) {
  return { key: t, name: o, line: e, running: a.running, runLimit: a.run_limit, kept: a.kept, keptLimit: Ze(a.kept_limit), cap: r, ...c };
}
function tt(t, o) {
  const e = t.filter((n) => !n.per_profile).map((n) => re(n.key, n.label, n.line, n, ae(o, n.key, ""), { screen: et[n.key] ?? "read-only", role: n.key, profile: "" })), a = t.find((n) => n.per_profile);
  if (!a) return e;
  const r = (n) => re(`${a.key}:${n.profile}`, n.title, n.line, n, ae(o, a.key, n.profile), { screen: n.group === W ? W : "read-only", role: a.key, profile: n.profile }), c = a.profiles.filter((n) => n.group === W || n.group === oe).map(r), f = a.profiles.filter((n) => n.group !== W && n.group !== oe).map((n) => ({ ...r(n), indent: !0 })), w = { key: a.key, name: "Read-only helpers", group: !0, screen: "read-only", role: a.key, profile: "", line: `${a.running} running, ${a.kept} kept. Every profile runs up to ${a.run_limit} and keeps ${a.kept_limit ? `up to ${a.kept_limit}` : "any number"} unless it has limits of its own.` };
  return [...e, ...c, w, ...f];
}
const nt = (t) => t.filter((o) => !o.group && (Z(o.running, o.runLimit) || Z(o.kept, o.keptLimit ?? 0))).length;
function ce(t, o) {
  const e = g(() => t.props.limits.rows.value ?? []), a = g(() => tt(e.value, o.value)), r = g(() => !!t.props.limits.failure.value);
  return { rows: a, unreadable: r, reread: () => t.reload("limits") };
}
const st = {
  class: "type",
  "data-agent-type-screen": ""
}, at = { class: "typebody" }, ot = {
  class: "typemain",
  "data-type-settings": ""
}, rt = { class: "typeside" }, lt = {
  __name: "AgentSettingsTypeScreen",
  props: { row: { type: Object, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back"],
  setup(t, { emit: o }) {
    const e = t, a = o, r = H(), c = g(() => r.props["type-screen"].data.value), f = g(() => {
      var v;
      return ((v = c.value) == null ? void 0 : v.nodes) ?? [];
    }), w = g(() => e.row.profile !== "");
    async function n() {
      r.state["type-screen.type"] = e.row.screen, await r.reload("type-screen");
    }
    J(c, (v) => {
      v && e.draft.load([v]);
    }), K(n);
    const S = g(() => (e.draft.value(G) ?? []).map((v) => v.split(":"))), N = g(() => S.value.find((v) => v[0] === e.row.profile)), R = g(() => ({ running: Number(e.draft.value(Xe)), kept: Number(e.draft.value(ze)) })), O = (v) => N.value ? Number(N.value[v === "running" ? 1 : 2]) : null;
    function E(v, y) {
      const T = S.value.filter((i) => i[0] !== e.row.profile).map((i) => i.join(":"));
      if (y === null) return e.draft.set(G, T);
      if (y === "") return;
      const m = v === "running" ? y : O("running") ?? R.value.running, u = v === "kept" ? y : O("kept") ?? R.value.kept;
      e.draft.set(G, [...T, `${e.row.profile}:${m}:${u}`]);
    }
    const j = (v) => r.open("agents.agents", v.id);
    return (v, y) => (d(), _("div", st, [
      k(s(Se), {
        parent: "Helpers",
        current: t.row.name,
        onBack: y[0] || (y[0] = (T) => a("back"))
      }, null, 8, ["current"]),
      p("div", at, [
        p("div", ot, [
          w.value && t.row.screen === "read-only" ? (d(), _(z, { key: 0 }, [
            k(s(ee), {
              label: "Running",
              help: "Agents of this profile that run at once.",
              "every-value": R.value.running,
              "own-value": O("running"),
              disabled: t.readOnly,
              "data-override-running": "",
              "onUpdate:ownValue": y[1] || (y[1] = (T) => E("running", T))
            }, null, 8, ["every-value", "own-value", "disabled"]),
            k(s(ee), {
              label: "Kept",
              help: "Agents of this profile kept until retired, running or idle. At 0 there is no limit.",
              "every-value": R.value.kept,
              "own-value": O("kept"),
              disabled: t.readOnly,
              "data-override-kept": "",
              "onUpdate:ownValue": y[2] || (y[2] = (T) => E("kept", T))
            }, null, 8, ["every-value", "own-value", "disabled"])
          ], 64)) : (d(), $(s(ue), {
            key: 1,
            nodes: f.value,
            draft: t.draft,
            "read-only": t.readOnly
          }, null, 8, ["nodes", "draft", "read-only"]))
        ]),
        p("aside", rt, [
          y[3] || (y[3] = p("h3", null, "Agents", -1)),
          k(We, {
            role: t.row.role,
            profile: t.row.profile,
            onOpenAgent: j
          }, null, 8, ["role", "profile"])
        ])
      ])
    ]));
  }
}, it = /* @__PURE__ */ L(lt, [["__scopeId", "data-v-a2b965ee"]]), ut = {
  class: "agents",
  "data-agent-settings-agents": ""
}, dt = {
  __name: "AgentSettingsAgents",
  props: { draft: { type: Object, required: !0 } },
  setup(t) {
    const o = t, e = H(), { rows: a, unreadable: r, reread: c } = ce(e, o.draft), f = A(null);
    K(c);
    const w = (n) => {
      f.value = a.value.find((S) => S.key === n);
    };
    return (n, S) => (d(), _("section", ut, [
      f.value ? (d(), $(it, {
        key: 0,
        row: f.value,
        draft: t.draft,
        "read-only": s(e).readOnly,
        onBack: S[0] || (S[0] = (N) => f.value = null)
      }, null, 8, ["row", "draft", "read-only"])) : s(r) ? (d(), $(s(_e), {
        key: 1,
        kind: "unreadable",
        text: "The counts could not be read.",
        onRetry: s(c)
      }, null, 8, ["onRetry"])) : (d(), $(s(Oe), {
        key: 2,
        rows: s(a),
        onOpen: w
      }, null, 8, ["rows"]))
    ]));
  }
}, ct = /* @__PURE__ */ L(dt, [["__scopeId", "data-v-18d49cff"]]), pt = {
  class: "page",
  "data-agent-settings-presets": ""
}, ft = { class: "crumb" }, vt = { class: "body" }, mt = { class: "cards" }, yt = "Any other mix of the eight switches. The form shows Custom as soon as the switches match neither preset.", gt = {
  __name: "AgentSettingsPresets",
  props: { presets: { type: Array, required: !0 }, switches: { type: Array, required: !0 }, now: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 } },
  emits: ["back", "fill"],
  setup(t, { emit: o }) {
    const e = o;
    return (a, r) => (d(), _("section", pt, [
      p("div", ft, [
        p("button", {
          type: "button",
          class: "back",
          "data-presets-back": "",
          onClick: r[0] || (r[0] = (c) => e("back"))
        }, "‹ Back"),
        r[1] || (r[1] = p("b", null, "What is a preset?", -1))
      ]),
      p("div", vt, [
        r[2] || (r[2] = p("p", { class: "lead" }, "A preset is a set of eight switches and nothing more. It is not a kind of agent: the main agent is the same program under every preset, and a preset only fills in the switches below. Nothing is saved until you press Save.", -1)),
        p("div", mt, [
          (d(!0), _(z, null, le(t.presets, (c) => (d(), $(s(te), {
            key: c.key,
            name: c.name,
            line: c.line,
            "can-fill": !t.readOnly,
            onFill: (f) => e("fill", c.key)
          }, null, 8, ["name", "line", "can-fill", "onFill"]))), 128)),
          k(s(te), {
            name: "Custom",
            line: yt
          })
        ]),
        k(s(Ae), {
          rows: t.switches,
          presets: t.presets,
          now: t.now
        }, null, 8, ["rows", "presets", "now"])
      ])
    ]));
  }
}, kt = /* @__PURE__ */ L(gt, [["__scopeId", "data-v-2cf94460"]]), wt = { class: "screen" }, bt = { class: "rail" }, ht = {
  __name: "AgentSettingsScreen",
  props: { nodes: { type: Array, required: !0 }, draft: { type: Object, required: !0 }, readOnly: { type: Boolean, default: !1 }, extras: { type: Object, default: () => ({}) }, found: { type: String, default: "" } },
  setup(t) {
    const o = t, e = A(null), a = g(() => Te(o.nodes));
    J(() => o.found, (c) => c && fe(() => {
      var f, w;
      return (w = (f = e.value) == null ? void 0 : f.querySelector(`[data-setting="${c}"]`)) == null ? void 0 : w.scrollIntoView({ block: "center" });
    }), { immediate: !0, flush: "post" });
    const r = (c) => {
      var f, w;
      return (w = (f = e.value) == null ? void 0 : f.querySelector(`[data-section="${c}"]`)) == null ? void 0 : w.scrollIntoView({ block: "start", behavior: "smooth" });
    };
    return (c, f) => (d(), _("div", wt, [
      p("nav", bt, [
        k(s(Ce), {
          sections: a.value,
          scope: e.value,
          onChoose: r
        }, null, 8, ["sections", "scope"])
      ]),
      p("div", {
        ref_key: "scroll",
        ref: e,
        class: "content"
      }, [
        ve(c.$slots, "before", {}, void 0, !0),
        k(s(ue), {
          nodes: t.nodes,
          draft: t.draft,
          "read-only": t.readOnly,
          extras: t.extras,
          found: t.found
        }, null, 8, ["nodes", "draft", "read-only", "extras", "found"])
      ], 512)
    ]));
  }
}, X = /* @__PURE__ */ L(ht, [["__scopeId", "data-v-1cab27ca"]]), $t = {
  class: "settings",
  "data-agent-settings": ""
}, St = { class: "head" }, _t = {
  class: "env",
  "data-settings-environment": ""
}, Ot = { class: "settings-bar" }, At = {
  key: 1,
  class: "note lock",
  role: "note",
  "data-settings-lock": ""
}, Tt = {
  key: 0,
  class: "hint",
  "data-work-hint": ""
}, Ct = "journal.suites.coding.auto-mode", Et = "journal.suites.coding.workers.main-dispatches-workers", Nt = 1200, Rt = {
  __name: "AgentSettings",
  setup(t) {
    const o = { work: "work-screen", tests: "tests-screen", advanced: "advanced-screen" }, e = H(), a = A("work"), r = [{ key: "work", label: "Work" }, { key: "agents", label: "Helpers", count_field: "full" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }], c = g(() => r.find((l) => l.key === a.value)), f = () => Object.values(o).map((l) => e.props[l].data.value), w = g(() => f().every(Boolean)), n = Ee({
      run: (l) => e.run(l),
      reload: async () => {
        const l = "type-screen.type" in e.state;
        await Promise.all([...Object.values(o).map((b) => e.reload(b)), e.reload("limits"), ...l ? [e.reload("type-screen")] : []]), n.load([...f(), ...l ? [e.props["type-screen"].data.value] : []]);
      }
    });
    J(f, (l) => {
      l.every(Boolean) && n.load(l);
    }, { immediate: !0 });
    const { rows: S } = ce(e, n), N = g(() => nt(S.value)), R = g(() => N.value ? { full: `${N.value} full` } : {});
    K(() => e.reload("limits"));
    const O = (l) => {
      var b;
      return ((b = e.props[o[l]].data.value) == null ? void 0 : b.nodes) ?? [];
    }, E = g(() => n.value(Ct) === !1 && n.value(Et) === !1), j = g(() => !e.readOnly), v = A("main"), y = g(() => {
      var l;
      return ((l = e.props.work.data.value) == null ? void 0 : l.presets) ?? [];
    }), T = g(() => {
      var l;
      return ((l = e.props.work.data.value) == null ? void 0 : l.switches) ?? [];
    }), m = g(() => Object.fromEntries(T.value.map((l) => [l.key, n.value(l.key)]))), u = g(() => Ne(m.value, y.value)), i = (l) => n.fill(y.value.find((b) => b.key === l).values), x = g(() => {
      var l;
      return ((l = e.props.find.data.value) == null ? void 0 : l.rows) ?? [];
    }), B = A("");
    let q = null;
    const D = (l) => l.startsWith("helper-type") ? "agents" : l;
    function M(l) {
      v.value = "main", P({ key: D(l.screen) }), B.value = l.key, clearTimeout(q), q = setTimeout(() => {
        B.value = "";
      }, Nt);
    }
    me(() => clearTimeout(q));
    function P(l) {
      a.value = l.key, e.state.tab = l.key === "agents" ? "agents" : "";
    }
    return (l, b) => (d(), $(s(we), { padding: "0" }, {
      default: h(() => [
        p("div", $t, [
          k(s(Q), { value: v.value }, {
            main: h(() => [
              p("div", St, [
                p("span", _t, I(s(e).environment), 1)
              ]),
              y.value.length ? (d(), $(s(Re), {
                key: 0,
                presets: y.value,
                current: u.value,
                disabled: s(e).readOnly,
                onPick: i,
                onOpenPage: b[0] || (b[0] = (Y) => v.value = "presets")
              }, {
                default: h(() => [
                  k(s(xe), {
                    index: x.value,
                    onPick: M
                  }, null, 8, ["index"])
                ]),
                _: 1
              }, 8, ["presets", "current", "disabled"])) : C("", !0),
              p("div", Ot, [
                k(s(be), {
                  tabs: r,
                  active: c.value,
                  answer: R.value,
                  onChoose: P
                }, null, 8, ["active", "answer"])
              ]),
              s(e).readOnly ? (d(), _("p", At, "Only a person can change these settings. You can read every value, and ask a person for a change.")) : C("", !0),
              p("div", {
                class: ie(["settings-body", { flush: a.value === "agents" }])
              }, [
                k(s(he), { tab: c.value }, {
                  default: h(() => [
                    k(s(Q), { value: a.value }, {
                      work: h(() => [
                        w.value ? (d(), $(X, {
                          key: "work",
                          nodes: O("work"),
                          draft: s(n),
                          "read-only": s(e).readOnly,
                          found: B.value,
                          "data-agent-settings-work": ""
                        }, {
                          before: h(() => [
                            E.value ? (d(), _("p", Tt, "With Auto off and no workers, nothing starts the work: a person starts tasks or turns one of them on.")) : C("", !0)
                          ]),
                          _: 1
                        }, 8, ["nodes", "draft", "read-only", "found"])) : C("", !0)
                      ]),
                      agents: h(() => [
                        k(ct, { draft: s(n) }, null, 8, ["draft"])
                      ]),
                      tests: h(() => [
                        w.value ? (d(), $(X, {
                          key: "tests",
                          nodes: O("tests"),
                          draft: s(n),
                          "read-only": s(e).readOnly,
                          found: B.value,
                          "data-agent-settings-tests": ""
                        }, null, 8, ["nodes", "draft", "read-only", "found"])) : C("", !0)
                      ]),
                      advanced: h(() => [
                        w.value ? (d(), $(X, {
                          key: "advanced",
                          nodes: O("advanced"),
                          draft: s(n),
                          "read-only": s(e).readOnly,
                          found: B.value,
                          "data-agent-settings-advanced": ""
                        }, null, 8, ["nodes", "draft", "read-only", "found"])) : C("", !0)
                      ]),
                      _: 1
                    }, 8, ["value"])
                  ]),
                  _: 1
                }, 8, ["tab"])
              ], 2)
            ]),
            presets: h(() => [
              k(kt, {
                presets: y.value,
                switches: T.value,
                now: m.value,
                "read-only": s(e).readOnly,
                onBack: b[1] || (b[1] = (Y) => v.value = "main"),
                onFill: i
              }, null, 8, ["presets", "switches", "now", "read-only"])
            ]),
            _: 1
          }, 8, ["value"]),
          j.value ? (d(), $(s(Ie), {
            key: 0,
            changes: s(n).changes(),
            "can-save": s(n).canSave.value,
            pending: s(n).pending.value,
            reason: s(n).reason.value,
            environment: s(e).environment,
            onSave: b[2] || (b[2] = (Y) => s(n).apply()),
            onCancel: b[3] || (b[3] = (Y) => s(n).reset())
          }, null, 8, ["changes", "can-save", "pending", "reason", "environment"])) : C("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, jt = /* @__PURE__ */ L(Rt, [["__scopeId", "data-v-60821cba"]]);
export {
  jt as A
};
