import { computed as S, ref as R, watch as le, onUnmounted as re, openBlock as i, createElementBlock as d, createCommentVNode as $, Fragment as V, renderList as H, createElementVNode as r, toDisplayString as b, createBlock as M, unref as g, withCtx as j, createTextVNode as T, normalizeClass as oe, createVNode as x, useModel as z, mergeProps as ve, mergeModels as _, withDirectives as J, withKeys as pe, withModifiers as de, vModelText as Q, reactive as ye, vModelSelect as be } from "vue";
import { useWindow as se, coalesced as we, READ_RATES as $e, copying as qe, Btn as ae, CreateDialog as Se, Icon as xe, DropList as ue, openFileInspector as Te, Reader as Re, SwitchCase as Ce, TextDisplay as ce, ActionsMenu as Ae, defaultFilter as Ie, applyFilter as We, ListReaderLayout as Ne, Skeleton as Ee, PageHeader as Oe, FilterBar as je } from "@journal/window-kit";
function Ve() {
  const e = se(), { rows: a } = e.props.catalogue, { rows: t } = e.props.loaded, { rows: u } = e.props.triggers, { rows: l } = e.props.profiles, s = S(() => e.props.requirements.data.value ?? { session_start: [], after_compaction: [], main_agent: [], environment_overrides: !1 }), n = S(() => {
    var c;
    return ((c = e.props["main-agent"].data.value) == null ? void 0 : c.id) ?? null;
  }), o = S(() => e.props.catalogue.loaded.value && e.props.requirements.loaded.value && e.props.triggers.loaded.value), m = R(""), k = S(() => m.value || ["catalogue", "requirements", "triggers", "profiles", "loaded"].map((c) => e.props[c].failure.value).find(Boolean) || ""), y = R([]), w = R(""), f = R(null), v = R(""), W = R(null), N = e.option("row");
  let K = 0;
  const U = S(() => a.value.map((c) => {
    const q = t.value.find((D) => D.skill === c.folder);
    return {
      ...c,
      required: s.value.session_start.includes(c.folder) || s.value.main_agent.includes(c.folder),
      agents: s.value.main_agent.includes(c.folder) ? "main" : "all",
      again: s.value.after_compaction.includes(c.folder),
      held: q,
      read: (q == null ? void 0 : q.state) === "loaded",
      changed: (q == null ? void 0 : q.state) === "loaded" && q.digest !== c.digest
    };
  })), F = S(() => U.value.find((c) => c.folder === w.value)), G = S(() => u.value.filter((c) => c.skill === w.value));
  async function L() {
    await e.reload({ only: ["main-agent", "catalogue", "requirements", "triggers", "profiles", ...n.value ? ["loaded"] : []] });
  }
  le(n, async (c) => {
    t.value = [], c && (e.state["loaded.agent"] = String(c), await e.reload("loaded"));
  });
  async function P(c, q = !0) {
    if (w.value = c, f.value = null, v.value = "", W.value = null, q && !N.value) {
      const A = new URL(location.href);
      c ? A.searchParams.set("skill", c) : A.searchParams.delete("skill"), history.pushState(null, "", A);
    }
    const D = ++K;
    if (!c) return;
    e.state["text.folder"] = c;
    const C = await e.readKey("text");
    D === K && (f.value = C.ok ? C.value : null, v.value = C.ok ? "" : C.failure === "refused" ? `The skill ${c} is no longer available.` : C.error);
  }
  async function B(c) {
    const q = await e.run(c);
    return m.value = q.ok ? "" : q.error, q.ok && await L(), q.ok;
  }
  async function E(c, q, D = !0) {
    y.value.includes(c) || (y.value = [...y.value, c], await B(["skill", "set-required", c, "--agents", q, ...D ? [] : ["--no-after-compaction"]]), y.value = y.value.filter((C) => C !== c));
  }
  async function h() {
    if (!n.value || !F.value) return;
    const c = F.value.held;
    await B((c == null ? void 0 : c.state) === "loaded" ? ["agent-skill", "reset", String(c.id)] : ["skill", "require", String(n.value), w.value]);
  }
  const p = () => {
    const c = new URLSearchParams(location.search).get("skill");
    c && P(c, !1);
  };
  return window.addEventListener("popstate", p), re(() => window.removeEventListener("popstate", p)), e.follow(["agent_skill.*"], we(() => {
    n.value && e.reload("loaded");
  }, $e.openPanel)), N.value ? e.readKey(`agent-skill.${N.value.skillId ?? N.value.id}`).then((c) => c.ok ? P(c.value.skill, !1) : v.value = c.error) : p(), { skills: U, selected: F, selectedTriggers: G, triggers: u, requirements: s, mainAgent: n, answered: o, failure: k, busy: y, opened: w, text: f, openFailure: v, profiles: l, draft: W, marked: N, load: L, open: P, run: B, requireSkill: E, readNow: h };
}
const X = [["journal", "From the journal"], ["plugin", "From a plugin"], ["project", "From this project"]], ge = Object.fromEntries(X), Y = (e) => {
  var a;
  return (a = e.module) != null && a.startsWith("plugin:") ? "plugin" : e.shipped ? "journal" : "project";
}, ee = (e) => e.required ? e.agents === "main" ? "Main agent" : "Every agent" : "", Z = [
  { key: "source", label: "Group", options: X, get: Y },
  { key: "required", label: "Required", options: [["required", "Required"], ["optional", "Not required"]], get: (e) => e.required ? "required" : "optional" },
  { key: "read", label: "Read now", options: [["read", "Read"], ["unread", "Not read"]], get: (e) => e.read ? "read" : "unread" }
], Me = (e) => [...e].sort((a, t) => X.findIndex(([u]) => u === Y(a)) - X.findIndex(([u]) => u === Y(t)) || a.folder.localeCompare(t.folder)).map((a) => ({ id: a.folder, title: a.folder, desc: a.description, group: ge[Y(a)], row: a })), me = (e, a) => e.filter((t) => (t.skills ?? []).includes(a)), Pe = (e, a) => e.filter((t) => (t.required_skills ?? []).includes(a)), Fe = (e, { require: a }) => [
  { label: e.required ? "Turn off" : "Turn on", group: "own", run: ({ say: t }) => a(e.folder, e.required ? "none" : "all").then(() => t(e.required ? `${e.folder} is no longer required` : `${e.folder} is required at the start`)) },
  { label: "Copy name", group: "copy", run: ({ say: t }) => qe(e.folder, "", t) }
], I = (e, a) => {
  const t = e.__vccOpts || e;
  for (const [u, l] of a)
    t[u] = l;
  return t;
}, Le = {
  class: "profiles",
  "data-skill-profiles": ""
}, Be = {
  key: 0,
  class: "none",
  "data-skill-profiles-none": ""
}, Ue = { class: "name" }, De = {
  key: 0,
  class: "badge-quiet"
}, He = {
  __name: "SkillProfiles",
  props: { folder: { type: String, required: !0 }, profiles: { type: Array, required: !0 } },
  setup(e) {
    const a = e, t = () => me(a.profiles, a.folder), u = (l) => Pe(a.profiles, a.folder).includes(l);
    return (l, s) => (i(), d("div", Le, [
      t().length ? $("", !0) : (i(), d("p", Be, "No profile names this skill. A profile without a list of skills gets the skills of its agent type.")),
      (i(!0), d(V, null, H(t(), (n) => (i(), d("p", {
        key: n.name,
        class: "profile",
        "data-skill-profile": ""
      }, [
        r("span", Ue, b(n.name), 1),
        u(n) ? (i(), d("span", De, "Must read it")) : $("", !0)
      ]))), 128))
    ]));
  }
}, Ke = /* @__PURE__ */ I(He, [["__scopeId", "data-v-f69575a6"]]), Ge = {
  class: "read-by",
  "data-skill-read-by": ""
}, ze = {
  class: "status",
  "data-skill-status": ""
}, Je = {
  __name: "SkillReadBy",
  props: { skill: { type: Object, required: !0 }, agent: { type: Number, default: null } },
  emits: ["read"],
  setup(e, { emit: a }) {
    const t = e, u = a, l = S(() => {
      var s;
      return t.agent ? t.skill.changed ? "This skill changed after the main agent read it." : ((s = t.skill.held) == null ? void 0 : s.state) === "due" ? "The main agent still has to read this skill. It cannot do anything else first." : t.skill.read ? `The main agent read this skill at ${new Date(t.skill.held.loaded_at).toLocaleString()}.` : "The main agent has not read this skill in this conversation." : "No main agent is running in this environment.";
    });
    return (s, n) => {
      var o;
      return i(), d("div", Ge, [
        r("p", ze, b(l.value), 1),
        e.agent && ((o = e.skill.held) == null ? void 0 : o.state) !== "due" ? (i(), M(g(ae), {
          key: 0,
          small: "",
          "data-skill-read-now": "",
          onClick: n[0] || (n[0] = (m) => u("read"))
        }, {
          default: j(() => [
            T(b(e.skill.read ? "Make the agent read it again" : "Make the agent read it now"), 1)
          ]),
          _: 1
        })) : $("", !0)
      ]);
    };
  }
}, Ye = /* @__PURE__ */ I(Je, [["__scopeId", "data-v-66bcee5b"]]), Qe = {
  __name: "SkillToProfile",
  props: { folder: { type: String, required: !0 }, profiles: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: a }) {
    const t = e, u = a, l = se(), s = [{ key: "profile", label: "Profile", kind: "select", options: t.profiles.map((k) => [k.name, k.name]), required: !0 }], n = (k) => {
      var y;
      return [.../* @__PURE__ */ new Set([...((y = t.profiles.find((w) => w.name === k)) == null ? void 0 : y.required_skills) ?? [], t.folder])].join(",");
    }, o = (k) => ["profile", "save", k.profile, "--required-skills", n(k.profile)], m = (k) => `journal profile save ${k.profile} --required-skills ${n(k.profile)}`;
    return (k, y) => (i(), M(g(Se), {
      title: `Require ${e.folder} in a profile`,
      submit: "Require it",
      fields: s,
      command: m,
      run: (w) => g(l).run(o(w)),
      onClose: y[0] || (y[0] = (w) => u("close"))
    }, null, 8, ["title", "run"]));
  }
}, Xe = ["aria-checked", "aria-label", "disabled"], Ze = {
  __name: "RequiredSkillSwitch",
  props: { folder: { type: String, required: !0 }, required: Boolean, busy: Boolean },
  emits: ["change"],
  setup(e, { emit: a }) {
    const t = a;
    return (u, l) => (i(), d("button", {
      type: "button",
      role: "switch",
      "aria-checked": e.required,
      "aria-label": `${e.required ? "Stop requiring" : "Require"} ${e.folder} at the start`,
      disabled: e.busy,
      class: oe(["required-switch", { on: e.required }]),
      onClick: l[0] || (l[0] = (s) => t("change", !e.required))
    }, [...l[1] || (l[1] = [
      r("span", null, null, -1)
    ])], 10, Xe));
  }
}, _e = /* @__PURE__ */ I(Ze, [["__scopeId", "data-v-ee9d0e40"]]), et = { class: "requirements" }, tt = { class: "block-head" }, lt = { class: "switch-label" }, st = {
  key: 0,
  class: "choices"
}, at = ["value", "disabled"], nt = { key: 0 }, it = {
  key: 1,
  class: "again"
}, rt = ["checked", "disabled"], ot = {
  __name: "SkillRequirements",
  props: { skill: { type: Object, required: !0 }, busy: Boolean },
  emits: ["change"],
  setup(e, { emit: a }) {
    const t = a, u = (l) => t("change", l ? "all" : "none", !0);
    return (l, s) => (i(), d("section", et, [
      r("div", tt, [
        s[3] || (s[3] = r("div", null, [
          r("h3", null, "Must the agent read it at the start?"),
          r("p", null, "When a conversation starts, the agent must read this skill before it may do anything else.")
        ], -1)),
        r("span", lt, [
          s[2] || (s[2] = T("Required ", -1)),
          x(_e, {
            folder: e.skill.folder,
            required: e.skill.required,
            busy: e.busy,
            onChange: u
          }, null, 8, ["folder", "required", "busy"])
        ])
      ]),
      e.skill.required ? (i(), d("div", st, [
        r("label", null, [
          s[5] || (s[5] = T("Which agents must read it", -1)),
          r("select", {
            value: e.skill.agents,
            "aria-label": "Which agents must read it",
            disabled: e.busy,
            onChange: s[0] || (s[0] = (n) => t("change", n.target.value, e.skill.again))
          }, [...s[4] || (s[4] = [
            r("option", { value: "all" }, "Every agent", -1),
            r("option", { value: "main" }, "Only the main agent", -1)
          ])], 40, at)
        ]),
        e.skill.agents === "main" ? (i(), d("p", nt, "The main agent reads it at the start and again after every compaction.")) : (i(), d("label", it, [
          s[6] || (s[6] = r("span", null, [
            T("Read it again after the conversation is compacted"),
            r("small", null, "Compacting empties what the agent has read.")
          ], -1)),
          r("input", {
            type: "checkbox",
            checked: e.skill.again,
            disabled: e.busy,
            "aria-label": "Read it again after the conversation is compacted",
            onChange: s[1] || (s[1] = (n) => t("change", e.skill.agents, n.target.checked))
          }, null, 40, rt)
        ]))
      ])) : $("", !0)
    ]));
  }
}, dt = /* @__PURE__ */ I(ot, [["__scopeId", "data-v-7c679e99"]]), ut = [
  { key: "nudge", value: "nudge", label: "Remind the agent", hint: "A short note only the agent sees. It carries on with its work.", ask: "What to remind the agent of", example: "Add the change to src/CHANGELOG.md in plain words." },
  { key: "instruct", value: "instruct", label: "Tell the agent to do something now", hint: "The agent sees “Do this now:” followed by your text.", ask: "What the agent should do", example: "Stop and ask me before you touch the database." },
  { key: "deny", value: "deny", label: "Block a command or file change", hint: "The command or file change is refused, and the agent is given your reason.", ask: "Reason the agent is given", example: "Never force-push. Ask me first." },
  { key: "skill", value: "skill", label: "Make the agent read a skill", hint: "The agent must read the skill before it continues.", ask: "Which skill the agent must read", example: "journal-plans" }
];
ut.filter((e) => !["deny", "skill"].includes(e.value));
const ct = [
  { key: "messages", label: "What you write to the agent" },
  { key: "commands", label: "Commands the agent runs" },
  { key: "files", label: "Files the agent changes" }
], gt = [
  { key: "part", label: "Part of the text", hint: "Capitals ignored" },
  { key: "word", label: "Whole word", hint: "Not part of another word" },
  { key: "pattern", label: "Pattern", hint: "A regular expression" }
], mt = [
  { key: "main", value: "main", label: "The main agent" },
  { key: "helper", value: "helper", label: "An agent or helper" }
], ie = [
  { key: "agent", value: "agent", label: "Agent", note: "The main agent or a helper", choices: mt },
  { key: "environment", value: "environment", label: "Environment", note: "Only in one environment", example: "main" },
  { key: "fired", value: "fired", label: "How often it has fired", note: "Only the first few times", example: "3" },
  { key: "hours", value: "hours", label: "Hours of the day", note: "From one hour until another", example: "9-17" }
], te = (e) => `“${e}”`;
function kt(e) {
  const a = e.slice(0, 3).map(te), t = e.length - 3;
  return t > 0 ? `${a.join(", ")} or ${t} other ${t === 1 ? "phrase" : "phrases"}` : a.length > 1 ? `${a.slice(0, -1).join(", ")} or ${a.at(-1)}` : a[0];
}
const ft = {
  skill: (e) => `make the agent read ${e}`,
  nudge: (e) => `remind the agent ${e}`,
  instruct: (e) => `tell the agent to do this now: ${e}`,
  deny: (e) => `block it and tell the agent ${e}`
}, ht = {
  every: (e) => `Every ${e.every || "few"} minutes`,
  once: () => "At the time you choose",
  cron: () => "At the scheduled times"
};
function ke(e) {
  const a = ft[e.action](e.action === "skill" ? te(e.skill || "the skill") : e.text ? te(e.text) : "(no text yet)");
  return e.type === "time" ? `${ht[e.time](e)}, ${a}.` : e.phrases.length ? `When ${kt(e.phrases)} appears, ${a}.` : "Add the words to watch for and choose what happens.";
}
const vt = {
  key: 0,
  class: "waiting"
}, pt = { key: 0 }, yt = ["disabled"], bt = ["disabled"], wt = ["disabled", "aria-label"], $t = {
  __name: "SkillTriggerCard",
  props: { trigger: { type: Object, required: !0 }, busy: Boolean },
  emits: ["edit", "run"],
  setup(e, { emit: a }) {
    const t = e, u = a, l = S(() => ke(t.trigger));
    return (s, n) => (i(), d("article", {
      class: oe(["skill-trigger-card", { paused: e.trigger.paused_at }])
    }, [
      r("p", null, b(l.value), 1),
      e.trigger.needs_enabling ? (i(), d("p", vt, "An agent made this trigger. It does nothing until you turn it on.")) : $("", !0),
      r("footer", null, [
        r("span", null, b(e.trigger.fired_count ? `Fired ${e.trigger.fired_count} times` : "Not fired yet"), 1),
        e.trigger.paused_at ? (i(), d("span", pt, "Paused")) : $("", !0),
        n[3] || (n[3] = r("span", { class: "push" }, null, -1)),
        r("button", {
          type: "button",
          disabled: e.busy,
          onClick: n[0] || (n[0] = (o) => u("edit", e.trigger))
        }, "Edit", 8, yt),
        e.trigger.needs_enabling ? (i(), d("button", {
          key: 1,
          type: "button",
          disabled: e.busy,
          onClick: n[1] || (n[1] = (o) => u("run", ["trigger", "enable", String(e.trigger.id)]))
        }, "Turn it on", 8, bt)) : (i(), d("button", {
          key: 2,
          type: "button",
          disabled: e.busy,
          "aria-label": e.trigger.paused_at ? "Resume this trigger" : "Pause this trigger",
          onClick: n[2] || (n[2] = (o) => u("run", ["trigger", "pause", String(e.trigger.id), ...e.trigger.paused_at ? ["--off"] : []]))
        }, b(e.trigger.paused_at ? "Resume" : "Pause"), 9, wt))
      ])
    ], 2));
  }
}, qt = /* @__PURE__ */ I($t, [["__scopeId", "data-v-8f3251db"]]), St = { class: "tiles" }, xt = ["onClick"], Tt = {
  __name: "TriggerTiles",
  props: /* @__PURE__ */ _({ options: { type: Array, required: !0 }, mark: { type: String, required: !0 } }, {
    modelValue: { type: String, required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const a = z(e, "modelValue");
    return (t, u) => (i(), d("div", St, [
      (i(!0), d(V, null, H(e.options, (l) => (i(), d("button", ve({
        key: l.key,
        type: "button",
        class: ["tile", { picked: a.value === l.key }]
      }, { ref_for: !0 }, { [`data-${e.mark}`]: l.key }, {
        onClick: (s) => a.value = l.key
      }), [
        r("b", null, b(l.label), 1),
        r("span", null, b(l.hint), 1)
      ], 16, xt))), 128))
    ]));
  }
}, Rt = /* @__PURE__ */ I(Tt, [["__scopeId", "data-v-eb4da38d"]]), Ct = { class: "words" }, At = ["aria-label", "onClick"], It = ["onKeydown"], Wt = {
  __name: "WatchedWords",
  props: { words: { type: Array, required: !0 } },
  emits: ["words"],
  setup(e, { emit: a }) {
    const t = e, u = a, l = R("");
    function s() {
      const o = l.value.trim();
      l.value = "", o && !t.words.includes(o) && u("words", [...t.words, o]);
    }
    const n = (o) => u("words", t.words.filter((m) => m !== o));
    return (o, m) => (i(), d("div", Ct, [
      (i(!0), d(V, null, H(e.words, (k) => (i(), d("span", {
        key: k,
        class: "word"
      }, [
        T(b(k) + " ", 1),
        r("button", {
          type: "button",
          class: "word-remove",
          "aria-label": `Remove ${k}`,
          onClick: (y) => n(k)
        }, [
          x(g(xe), {
            name: "close",
            size: 11
          })
        ], 8, At)
      ]))), 128)),
      J(r("input", {
        "onUpdate:modelValue": m[0] || (m[0] = (k) => l.value = k),
        class: "word-input",
        placeholder: "Add a word, then Enter",
        "aria-label": "Add a word",
        "data-trigger-word": "",
        onKeydown: pe(de(s, ["prevent"]), ["enter"]),
        onBlur: s
      }, null, 40, It), [
        [Q, l.value]
      ])
    ]));
  }
}, Nt = /* @__PURE__ */ I(Wt, [["__scopeId", "data-v-7a597156"]]), Et = { class: "field" }, Ot = { class: "field" }, jt = ["checked", "data-trigger-place", "onChange"], Vt = { class: "field" }, Mt = {
  key: 0,
  class: "pattern-limit",
  "data-trigger-pattern-limit": ""
}, Pt = {
  __name: "TriggerWordFields",
  props: {
    phrases: { type: Array, required: !0 },
    phrasesModifiers: {},
    places: { type: Array, required: !0 },
    placesModifiers: {},
    match: { type: String, required: !0 },
    matchModifiers: {}
  },
  emits: ["update:phrases", "update:places", "update:match"],
  setup(e) {
    const a = z(e, "phrases"), t = z(e, "places"), u = z(e, "match"), l = (s) => t.value = t.value.includes(s) ? t.value.filter((n) => n !== s) : [...t.value, s];
    return (s, n) => (i(), d(V, null, [
      r("div", Et, [
        n[2] || (n[2] = r("span", { class: "label" }, "When these words appear", -1)),
        x(Nt, {
          words: a.value,
          onWords: n[0] || (n[0] = (o) => a.value = o)
        }, null, 8, ["words"])
      ]),
      r("div", Ot, [
        n[3] || (n[3] = r("span", { class: "label" }, "Where to look", -1)),
        (i(!0), d(V, null, H(g(ct), (o) => (i(), d("label", {
          key: o.key,
          class: "check"
        }, [
          r("input", {
            type: "checkbox",
            checked: t.value.includes(o.key),
            "data-trigger-place": o.key,
            onChange: (m) => l(o.key)
          }, null, 40, jt),
          T(b(o.label), 1)
        ]))), 128))
      ]),
      r("div", Vt, [
        n[4] || (n[4] = r("span", { class: "label" }, "How words match", -1)),
        x(Rt, {
          modelValue: u.value,
          "onUpdate:modelValue": n[1] || (n[1] = (o) => u.value = o),
          options: g(gt),
          mark: "trigger-match"
        }, null, 8, ["modelValue", "options"]),
        u.value === "pattern" ? (i(), d("p", Mt, "Patterns have no time limit. A slow pattern can delay every command or file change. Patterns are limited to 200 characters and check only the first 2,000 characters; repeating a repeated group is refused.")) : $("", !0)
      ])
    ], 64));
  }
}, Ft = /* @__PURE__ */ I(Pt, [["__scopeId", "data-v-2e25b9b9"]]), Lt = { class: "block" }, Bt = {
  key: 0,
  class: "field"
}, Ut = { class: "label" }, Dt = {
  key: 1,
  class: "field"
}, Ht = { class: "label" }, Kt = ["placeholder"], Gt = {
  __name: "TriggerListedField",
  props: /* @__PURE__ */ _({
    label: { type: String, required: !0 },
    example: { type: String, default: "" },
    choices: { type: Array, default: null }
  }, {
    modelValue: { type: String, required: !0 },
    modelModifiers: {}
  }),
  emits: /* @__PURE__ */ _(["remove"], ["update:modelValue"]),
  setup(e, { emit: a }) {
    const t = e, u = a, l = z(e, "modelValue"), s = S(() => {
      var n, o;
      return ((o = (n = t.choices) == null ? void 0 : n.find((m) => m.value === l.value)) == null ? void 0 : o.label) ?? "Choose one";
    });
    return (n, o) => (i(), d("div", Lt, [
      e.choices ? (i(), d("div", Bt, [
        r("span", Ut, b(e.label), 1),
        x(g(ue), {
          label: s.value,
          items: e.choices,
          picked: l.value,
          "data-trigger-choice": "",
          onPick: o[0] || (o[0] = (m) => l.value = m.value)
        }, null, 8, ["label", "items", "picked"])
      ])) : (i(), d("label", Dt, [
        r("span", Ht, b(e.label), 1),
        J(r("input", {
          "onUpdate:modelValue": o[1] || (o[1] = (m) => l.value = m),
          placeholder: e.example,
          "data-trigger-listed": ""
        }, null, 8, Kt), [
          [Q, l.value]
        ])
      ])),
      x(g(ae), {
        class: "remove",
        small: "",
        onClick: o[2] || (o[2] = (m) => u("remove"))
      }, {
        default: j(() => [...o[3] || (o[3] = [
          T("Remove", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, zt = /* @__PURE__ */ I(Gt, [["__scopeId", "data-v-1a787719"]]), Jt = {
  __name: "TriggerConditionFields",
  props: {
    modelValue: { type: Array, required: !0 },
    modelModifiers: {}
  },
  emits: ["update:modelValue"],
  setup(e) {
    const a = z(e, "modelValue"), t = (n) => ie.find((o) => o.value === n.type), u = (n, o) => a.value = a.value.map((m, k) => k === n ? { ...m, value: o } : m), l = (n) => a.value = a.value.filter((o, m) => m !== n), s = (n) => a.value = [...a.value, { type: n.value, value: "" }];
    return (n, o) => (i(), d(V, null, [
      (i(!0), d(V, null, H(a.value, (m, k) => (i(), M(zt, {
        key: k,
        "model-value": m.value,
        label: t(m).label,
        example: t(m).example,
        choices: t(m).choices,
        "onUpdate:modelValue": (y) => u(k, y),
        onRemove: (y) => l(k)
      }, null, 8, ["model-value", "label", "example", "choices", "onUpdate:modelValue", "onRemove"]))), 128)),
      x(g(ue), {
        label: "Add a condition",
        icon: "plus",
        items: g(ie),
        "data-trigger-add-condition": "",
        onPick: s
      }, null, 8, ["items"])
    ], 64));
  }
}, Yt = {
  key: 0,
  class: "field"
}, Qt = ["value"], Xt = { class: "summary" }, Zt = { class: "field" }, _t = {
  key: 1,
  class: "trial",
  role: "status"
}, el = ["open"], tl = { class: "more" }, ll = { class: "field" }, sl = ["placeholder"], al = {
  class: "help",
  role: "status"
}, nl = { class: "actions" }, il = ["disabled"], rl = {
  __name: "SkillTriggerEditor",
  props: { skill: { type: String, default: "" }, trigger: { type: Object, default: null }, skills: { type: Array, required: !0 } },
  emits: ["saved", "cancel"],
  setup(e, { emit: a }) {
    var U, F, G, L, P, B;
    const t = e, u = a, l = se(), s = ye({ skill: ((U = t.trigger) == null ? void 0 : U.skill) || t.skill, name: ((F = t.trigger) == null ? void 0 : F.name) || "", phrases: [...((G = t.trigger) == null ? void 0 : G.phrases) || []], places: [...((L = t.trigger) == null ? void 0 : L.watch_places) || ["messages", "commands", "files"]], match: ((P = t.trigger) == null ? void 0 : P.match_mode) || "word", conditions: JSON.parse(((B = t.trigger) == null ? void 0 : B.conditions) || "[]") }), n = R(""), o = R(null), m = R(""), k = R(!1), y = R(!1), w = S(() => s.skill ? s.phrases.length ? s.places.length ? "" : "Choose where to look." : "Add at least one word." : "Choose a skill."), f = S(() => ke({ ...s, action: "skill" }));
    let v, W = 0;
    le(() => [n.value, s.phrases.join(","), s.match], () => {
      clearTimeout(v);
      const E = ++W;
      o.value = null, !(!n.value.trim() || !s.phrases.length) && (v = setTimeout(async () => {
        l.state["trial.phrases"] = s.phrases.join(","), l.state["trial.sentence"] = n.value, l.state["trial.match-mode"] = s.match, await l.reload("trial"), E === W && (o.value = l.props.trial.failure.value ? { error: l.props.trial.failure.value } : l.props.trial.data.value);
      }, 150));
    }), re(() => {
      clearTimeout(v), W++;
    });
    async function N() {
      if (k.value || w.value) return;
      k.value = !0;
      const E = ["--name", s.name.trim() || `Read ${s.skill}`, "--skill", s.skill, "--watch-places", ...s.places, "--match-mode", s.match, "--conditions", JSON.stringify(s.conditions)], h = t.trigger ? ["trigger", "edit", String(t.trigger.id), ...E, ...s.phrases.map((c) => `--phrases=${c}`)] : ["trigger", "make", "--do", "skill", ...E, "--", s.phrases.join(", ")], p = await l.run(h);
      m.value = p.ok ? "" : p.error, k.value = !1, p.ok && u("saved");
    }
    async function K() {
      const E = await l.run(["trigger", "strike", String(t.trigger.id)]);
      m.value = E.ok ? "" : E.error, E.ok && u("saved");
    }
    return (E, h) => (i(), d("form", {
      class: "skill-trigger-editor",
      onSubmit: de(N, ["prevent"])
    }, [
      r("h3", null, [
        T(b(e.trigger ? "Edit this trigger" : "New trigger"), 1),
        s.skill ? (i(), d(V, { key: 0 }, [
          T(" for " + b(s.skill), 1)
        ], 64)) : $("", !0)
      ]),
      e.skill ? $("", !0) : (i(), d("label", Yt, [
        h[10] || (h[10] = T("Which skill the agent must read", -1)),
        J(r("select", {
          "onUpdate:modelValue": h[0] || (h[0] = (p) => s.skill = p),
          "aria-label": "Which skill the agent must read"
        }, [
          h[9] || (h[9] = r("option", { value: "" }, "Choose a skill", -1)),
          (i(!0), d(V, null, H(e.skills, (p) => (i(), d("option", {
            key: p.folder,
            value: p.folder
          }, b(p.folder), 9, Qt))), 128))
        ], 512), [
          [be, s.skill]
        ])
      ])),
      x(Ft, {
        phrases: s.phrases,
        "onUpdate:phrases": h[1] || (h[1] = (p) => s.phrases = p),
        places: s.places,
        "onUpdate:places": h[2] || (h[2] = (p) => s.places = p),
        match: s.match,
        "onUpdate:match": h[3] || (h[3] = (p) => s.match = p)
      }, null, 8, ["phrases", "places", "match"]),
      r("div", Xt, [
        h[11] || (h[11] = r("small", null, "What this trigger does", -1)),
        r("p", null, b(f.value), 1)
      ]),
      r("label", Zt, [
        h[12] || (h[12] = T("Try a sentence", -1)),
        J(r("input", {
          "onUpdate:modelValue": h[4] || (h[4] = (p) => n.value = p),
          "aria-label": "Try a sentence",
          placeholder: "For example: take notes about the plan"
        }, null, 512), [
          [Q, n.value]
        ])
      ]),
      o.value ? (i(), d("p", _t, b(o.value.error || (o.value.matches ? "This would fire." : "This would not fire.")), 1)) : $("", !0),
      r("details", {
        open: !!e.trigger
      }, [
        h[14] || (h[14] = r("summary", null, "More choices: its name and when it applies", -1)),
        r("div", tl, [
          r("label", ll, [
            h[13] || (h[13] = T("Name", -1)),
            J(r("input", {
              "onUpdate:modelValue": h[5] || (h[5] = (p) => s.name = p),
              "aria-label": "Name",
              placeholder: `Read ${s.skill || "the skill"}`
            }, null, 8, sl), [
              [Q, s.name]
            ])
          ]),
          x(Jt, {
            modelValue: s.conditions,
            "onUpdate:modelValue": h[6] || (h[6] = (p) => s.conditions = p)
          }, null, 8, ["modelValue"])
        ])
      ], 8, el),
      r("p", al, b(m.value || w.value), 1),
      r("div", nl, [
        e.trigger ? (i(), d("button", {
          key: 0,
          type: "button",
          class: "danger",
          onClick: h[7] || (h[7] = (p) => y.value ? K() : y.value = !0)
        }, b(y.value ? "Yes, end it" : "End this trigger"), 1)) : $("", !0),
        r("button", {
          type: "button",
          onClick: h[8] || (h[8] = (p) => u("cancel"))
        }, "Cancel"),
        r("button", {
          type: "submit",
          class: "primary",
          disabled: k.value || !!w.value
        }, b(e.trigger ? "Save" : "Create trigger"), 9, il)
      ])
    ], 32));
  }
}, ol = /* @__PURE__ */ I(rl, [["__scopeId", "data-v-272d3d66"]]), dl = {
  class: "when",
  "data-skill-when": ""
}, ul = { class: "block" }, cl = { class: "block-head" }, gl = {
  key: 0,
  class: "help"
}, ml = {
  key: 0,
  class: "block"
}, kl = { key: 0 }, fl = { key: 1 }, hl = { key: 2 }, vl = {
  __name: "SkillWhen",
  props: { skill: { type: Object, required: !0 }, triggers: { type: Array, required: !0 }, skills: { type: Array, required: !0 }, draft: { type: Object, default: null }, busy: Boolean },
  emits: ["require", "add", "edit", "run", "saved", "cancel"],
  setup(e, { emit: a }) {
    const t = a;
    return (u, l) => {
      var s, n, o, m, k, y, w;
      return i(), d("div", dl, [
        x(dt, {
          skill: e.skill,
          busy: e.busy,
          onChange: l[0] || (l[0] = (f, v) => t("require", f, v))
        }, null, 8, ["skill", "busy"]),
        r("section", ul, [
          r("div", cl, [
            l[7] || (l[7] = r("h3", null, "Make the agent read it when your words appear", -1)),
            e.draft ? $("", !0) : (i(), M(g(ae), {
              key: 0,
              small: "",
              "data-skill-trigger-add": "",
              onClick: l[1] || (l[1] = (f) => t("add"))
            }, {
              default: j(() => [...l[6] || (l[6] = [
                T("Add a trigger", -1)
              ])]),
              _: 1
            }))
          ]),
          !e.triggers.length && !e.draft ? (i(), d("p", gl, "No triggers yet. Add one, and the agent must read this skill as soon as your words appear.")) : $("", !0),
          (i(!0), d(V, null, H(e.triggers, (f) => {
            var v, W;
            return i(), d(V, {
              key: f.id
            }, [
              ((W = (v = e.draft) == null ? void 0 : v.trigger) == null ? void 0 : W.id) !== f.id ? (i(), M(qt, {
                key: 0,
                trigger: f,
                onEdit: l[2] || (l[2] = (N) => t("edit", N)),
                onRun: l[3] || (l[3] = (N) => t("run", N))
              }, null, 8, ["trigger"])) : $("", !0)
            ], 64);
          }), 128)),
          e.draft ? (i(), M(ol, {
            key: ((s = e.draft.trigger) == null ? void 0 : s.id) || e.skill.folder,
            skill: e.skill.folder,
            trigger: e.draft.trigger,
            skills: e.skills,
            onSaved: l[4] || (l[4] = (f) => t("saved")),
            onCancel: l[5] || (l[5] = (f) => t("cancel"))
          }, null, 8, ["skill", "trigger", "skills"])) : $("", !0)
        ]),
        (n = e.skill.keywords) != null && n.length || (o = e.skill.commands) != null && o.length || (m = e.skill.events) != null && m.length ? (i(), d("section", ml, [
          l[11] || (l[11] = r("h3", null, "When the skill itself asks to be read", -1)),
          l[12] || (l[12] = r("p", { class: "help" }, "These come with the skill and cannot be changed here.", -1)),
          r("ul", null, [
            (k = e.skill.keywords) != null && k.length ? (i(), d("li", kl, [
              l[8] || (l[8] = T("When you write ", -1)),
              r("code", null, b(e.skill.keywords.join(", ")), 1)
            ])) : $("", !0),
            (y = e.skill.commands) != null && y.length ? (i(), d("li", fl, [
              l[9] || (l[9] = T("Before it runs a command about ", -1)),
              r("code", null, b(e.skill.commands.join(", ")), 1)
            ])) : $("", !0),
            (w = e.skill.events) != null && w.length ? (i(), d("li", hl, [
              l[10] || (l[10] = T("When these changes happen: ", -1)),
              r("code", null, b(e.skill.events.join(", ")), 1)
            ])) : $("", !0)
          ])
        ])) : $("", !0)
      ]);
    };
  }
}, pl = /* @__PURE__ */ I(vl, [["__scopeId", "data-v-9f2687c2"]]), fe = (e) => String(e || "").replace(/^---\n[\s\S]*?\n---\n+/, ""), yl = {
  key: 0,
  class: "text",
  "data-skill-text": ""
}, bl = ["role"], wl = {
  __name: "SkillReader",
  props: {
    skill: { type: Object, required: !0 },
    text: { type: Object, default: null },
    failure: { type: String, default: "" },
    triggers: { type: Array, required: !0 },
    skills: { type: Array, required: !0 },
    profiles: { type: Array, required: !0 },
    agent: { type: Number, default: null },
    draft: { type: Object, default: null },
    busy: Boolean
  },
  emits: ["require", "read", "add", "edit", "run", "saved", "cancel"],
  setup(e, { emit: a }) {
    const t = e, u = a, l = R("text"), s = R(!1), n = S(() => [
      { key: "text", label: "What it says" },
      { key: "when", label: "When it is read", count: t.triggers.length },
      { key: "readby", label: "Read by" },
      { key: "profiles", label: "Profiles", count: me(t.profiles, t.skill.folder).length }
    ]), o = S(() => [
      { name: "source", label: "From", value: ge[Y(t.skill)] },
      { name: "required", label: "Required", value: ee(t.skill) || "No" }
    ]), m = [["all", "Every agent"], ["main", "Main agent"], ["none", "None"]], k = S(() => {
      var w;
      return (w = t.skill.path) != null && w.startsWith("/") ? `.claude/skills/${t.skill.folder}/SKILL.md` : t.skill.path || `.claude/skills/${t.skill.folder}/SKILL.md`;
    }), y = S(() => [
      { label: "Readers", group: "own", children: m.map(([w, f]) => ({ label: f, run: () => u("require", w, !0) })) },
      { label: "Require in a profile", group: "own", disabled: !t.profiles.length, reason: "No profiles", run: () => s.value = !0 },
      { label: "Add a trigger", group: "own", run: () => {
        l.value = "when", u("add");
      } },
      { label: "Open SKILL.md in Files", group: "open", run: () => Te(k.value) }
    ]);
    return (w, f) => (i(), M(g(Re), {
      tab: l.value,
      "onUpdate:tab": f[8] || (f[8] = (v) => l.value = v),
      title: e.skill.folder,
      abstract: e.skill.description,
      tabs: n.value,
      facts: o.value,
      "data-skill-reader": ""
    }, {
      actions: j(() => [
        x(g(Ae), {
          items: y.value,
          head: e.skill.folder
        }, null, 8, ["items", "head"])
      ]),
      default: j(() => [
        x(g(Ce), { value: l.value }, {
          text: j(() => [
            e.text ? (i(), d("div", yl, [
              x(g(ce), {
                text: g(fe)(e.text.text),
                "row-names": !1
              }, null, 8, ["text"])
            ])) : (i(), d("p", {
              key: 1,
              class: "note",
              role: e.failure ? "alert" : null
            }, b(e.failure || "Reading the skill…"), 9, bl))
          ]),
          when: j(() => [
            x(pl, {
              skill: e.skill,
              triggers: e.triggers,
              skills: e.skills,
              draft: e.draft,
              busy: e.busy,
              onRequire: f[0] || (f[0] = (v, W) => u("require", v, W)),
              onAdd: f[1] || (f[1] = (v) => u("add")),
              onEdit: f[2] || (f[2] = (v) => u("edit", v)),
              onRun: f[3] || (f[3] = (v) => u("run", v)),
              onSaved: f[4] || (f[4] = (v) => u("saved")),
              onCancel: f[5] || (f[5] = (v) => u("cancel"))
            }, null, 8, ["skill", "triggers", "skills", "draft", "busy"])
          ]),
          readby: j(() => [
            x(Ye, {
              skill: e.skill,
              agent: e.agent,
              onRead: f[6] || (f[6] = (v) => u("read"))
            }, null, 8, ["skill", "agent"])
          ]),
          profiles: j(() => [
            x(Ke, {
              folder: e.skill.folder,
              profiles: e.profiles
            }, null, 8, ["folder", "profiles"])
          ]),
          _: 1
        }, 8, ["value"]),
        s.value ? (i(), M(Qe, {
          key: 0,
          folder: e.skill.folder,
          profiles: e.profiles,
          onClose: f[7] || (f[7] = (v) => s.value = !1)
        }, null, 8, ["folder", "profiles"])) : $("", !0)
      ]),
      _: 1
    }, 8, ["tab", "title", "abstract", "tabs", "facts"]));
  }
}, $l = /* @__PURE__ */ I(wl, [["__scopeId", "data-v-ee95151d"]]), ql = { class: "skills" }, Sl = { class: "skills-title" }, xl = {
  class: "skills-text",
  "data-skill-text": ""
}, Tl = {
  __name: "SkillText",
  props: { skill: { type: Object, default: null }, failure: { type: String, default: "" }, back: { type: Boolean, default: !0 } },
  emits: ["back"],
  setup(e, { emit: a }) {
    const t = a;
    return (u, l) => (i(), d("div", ql, [
      e.back ? (i(), d("button", {
        key: 0,
        type: "button",
        class: "skills-back",
        onClick: l[0] || (l[0] = (s) => t("back"))
      }, "Back")) : $("", !0),
      r("h3", Sl, b(e.skill ? e.skill.folder : ""), 1),
      r("div", xl, [
        x(g(ce), {
          text: e.skill ? g(fe)(e.skill.text) : e.failure,
          "row-names": !1
        }, null, 8, ["text"])
      ])
    ]));
  }
}, Rl = /* @__PURE__ */ I(Tl, [["__scopeId", "data-v-96af8725"]]), Cl = {
  key: 0,
  class: "note",
  role: "status"
}, Al = {
  key: 1,
  class: "note failure",
  role: "alert",
  "data-skills-failure": ""
}, Il = {
  key: 0,
  class: "badge-quiet",
  "data-skill-required": ""
}, Wl = 460, Nl = {
  __name: "SkillRows",
  setup(e) {
    const { skills: a, selected: t, selectedTriggers: u, requirements: l, mainAgent: s, answered: n, failure: o, busy: m, opened: k, text: y, openFailure: w, profiles: f, draft: v, marked: W, load: N, open: K, run: U, requireSkill: F, readNow: G } = Ve(), L = R(Ie(Z)), P = R(""), B = S(() => We(a.value, Z, L.value, P.value, ["folder", "description"])), E = S(() => Me(B.value)), h = S({ get: () => k.value || null, set: (C) => K(C ?? "", !1) }), p = (C) => ({ head: C.title, items: Fe(C.row, { require: (A, O) => F(A, O) }) }), c = () => v.value = { trigger: null }, q = (C) => v.value = { trigger: C }, D = async () => {
      v.value = null, await N();
    };
    return le(k, () => v.value = null), (C, A) => g(W) ? (i(), M(Rl, {
      key: 0,
      skill: g(y),
      failure: g(w),
      back: !1
    }, null, 8, ["skill", "failure"])) : (i(), M(g(Ne), {
      key: 1,
      chosen: h.value,
      "onUpdate:chosen": A[3] || (A[3] = (O) => h.value = O),
      items: E.value,
      "list-width": Wl,
      place: p,
      "empty-title": "No skills are installed",
      "pick-line": "Choose a skill to read what it says",
      "open-first": "",
      "data-skills-catalogue": ""
    }, {
      top: j(() => [
        x(g(Oe), {
          title: "Skills",
          count: g(a).length
        }, null, 8, ["count"]),
        x(g(je), {
          modelValue: L.value,
          "onUpdate:modelValue": A[0] || (A[0] = (O) => L.value = O),
          words: P.value,
          "onUpdate:words": A[1] || (A[1] = (O) => P.value = O),
          fields: g(Z),
          rows: g(a),
          shown: B.value.length,
          placeholder: "Find a skill"
        }, null, 8, ["modelValue", "words", "fields", "rows", "shown"]),
        g(l).environment_overrides ? (i(), d("p", Cl, "This environment uses separate skill lists. Changes here apply to the whole project. The environment lists still take priority.")) : $("", !0),
        g(o) ? (i(), d("p", Al, b(g(o)), 1)) : $("", !0)
      ]),
      empty: j(() => [
        g(n) ? g(a).length ? (i(), d(V, { key: 2 }, [
          T("No skill matches. Try other words or filters.")
        ], 64)) : (i(), d(V, { key: 1 }, [
          T("Add a folder with a SKILL.md file under .agents/skills in this project.")
        ], 64)) : (i(), M(g(Ee), {
          key: 0,
          shape: "rows"
        }))
      ]),
      meta: j(({ item: O }) => [
        g(ee)(O.row) ? (i(), d("span", Il, b(g(ee)(O.row)), 1)) : $("", !0)
      ]),
      reader: j(({ item: O }) => [
        g(t) ? (i(), M($l, {
          key: 0,
          skill: g(t),
          text: g(y),
          failure: g(w),
          triggers: g(u),
          skills: g(a),
          profiles: g(f),
          agent: g(s),
          draft: g(v),
          busy: g(m).includes(O.id),
          onRequire: (ne, he) => g(F)(O.id, ne, he),
          onRead: g(G),
          onAdd: c,
          onEdit: q,
          onRun: g(U),
          onSaved: D,
          onCancel: A[2] || (A[2] = (ne) => v.value = null)
        }, null, 8, ["skill", "text", "failure", "triggers", "skills", "profiles", "agent", "draft", "busy", "onRequire", "onRead", "onRun"])) : $("", !0)
      ]),
      _: 1
    }, 8, ["chosen", "items"]));
  }
}, jl = /* @__PURE__ */ I(Nl, [["__scopeId", "data-v-f5e6c428"]]);
export {
  jl as S
};
