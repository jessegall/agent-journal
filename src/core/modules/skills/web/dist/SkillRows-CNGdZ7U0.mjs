/* @code-commandments-generated */
import { computed as x, ref as j, watch as X, onUnmounted as ee, openBlock as l, createElementBlock as n, normalizeClass as Y, createElementVNode as t, createVNode as I, unref as u, createTextVNode as T, toDisplayString as v, createCommentVNode as S, Fragment as R, renderList as V, createBlock as F, useModel as G, mergeProps as ce, mergeModels as J, withDirectives as K, withKeys as ge, withModifiers as te, vModelText as z, withCtx as le, reactive as ke, vModelSelect as me } from "vue";
import { useWindow as se, coalesced as he, READ_RATES as ve, Icon as ne, useListTools as ye, ListTools as pe, DropList as ae, Btn as fe, TextDisplay as ie, WindowRoom as be } from "@journal/window-kit";
function $e() {
  const e = se(), { rows: g } = e.props.catalogue, { rows: a } = e.props.loaded, { rows: h } = e.props.triggers, i = x(() => e.props.requirements.data.value ?? { session_start: [], after_compaction: [], main_agent: [], environment_overrides: !1 }), s = x(() => {
    var c;
    return ((c = e.props["main-agent"].data.value) == null ? void 0 : c.id) ?? null;
  }), r = x(() => e.props.catalogue.loaded.value && e.props.requirements.loaded.value && e.props.triggers.loaded.value), o = j(""), d = x(() => o.value || ["catalogue", "requirements", "triggers", "loaded"].map((c) => e.props[c].failure.value).find(Boolean) || ""), w = j([]), p = j(""), b = j(null), k = j("");
  e.state.tab = "skills";
  const y = x({ get: () => e.state.tab, set: (c) => e.state.tab = c }), f = j(null), A = e.option("row");
  let N = 0;
  const O = x(() => g.value.map((c) => {
    const m = a.value.find((D) => D.skill === c.folder);
    return {
      ...c,
      required: i.value.session_start.includes(c.folder) || i.value.main_agent.includes(c.folder),
      agents: i.value.main_agent.includes(c.folder) ? "main" : "all",
      again: i.value.after_compaction.includes(c.folder),
      held: m,
      read: (m == null ? void 0 : m.state) === "loaded",
      changed: (m == null ? void 0 : m.state) === "loaded" && m.digest !== c.digest
    };
  })), E = x(() => O.value.find((c) => c.folder === p.value)), M = x(() => h.value.filter((c) => c.skill === p.value));
  async function B() {
    await e.reload({ only: ["main-agent", "catalogue", "requirements", "triggers", ...s.value ? ["loaded"] : []] });
  }
  X(s, async (c) => {
    a.value = [], c && (e.state["loaded.agent"] = String(c), await e.reload("loaded"));
  });
  async function U(c, m = !0) {
    if (p.value = c, b.value = null, k.value = "", f.value = null, m && !A.value) {
      const H = new URL(location.href);
      c ? H.searchParams.set("skill", c) : H.searchParams.delete("skill"), history.pushState(null, "", H);
    }
    const D = ++N;
    if (!c) return;
    e.state["text.folder"] = c;
    const C = await e.readKey("text");
    D === N && (b.value = C.ok ? C.value : null, k.value = C.ok ? "" : C.failure === "refused" ? `The skill ${c} is no longer available.` : C.error);
  }
  async function P(c) {
    const m = await e.run(c);
    return o.value = m.ok ? "" : m.error, m.ok && await B(), m.ok;
  }
  async function W(c, m, D = !0) {
    w.value.includes(c) || (w.value = [...w.value, c], await P(["skill", "set-required", c, "--agents", m, ...D ? [] : ["--no-after-compaction"]]), w.value = w.value.filter((C) => C !== c));
  }
  async function $() {
    if (!s.value || !E.value) return;
    const c = E.value.held;
    await P((c == null ? void 0 : c.state) === "loaded" ? ["agent-skill", "reset", String(c.id)] : ["skill", "require", String(s.value), p.value]);
  }
  const q = () => U(new URLSearchParams(location.search).get("skill") || "", !1);
  return window.addEventListener("popstate", q), ee(() => window.removeEventListener("popstate", q)), e.follow(["agent_skill.*"], he(() => {
    s.value && e.reload("loaded");
  }, ve.openPanel)), A.value ? e.readKey(`agent-skill.${A.value.skillId ?? A.value.id}`).then((c) => c.ok ? U(c.value.skill, !1) : k.value = c.error) : q(), { skills: O, selected: E, selectedTriggers: M, triggers: h, requirements: i, mainAgent: s, answered: r, failure: d, busy: w, opened: p, text: b, openFailure: k, tab: y, draft: f, marked: A, load: B, open: U, run: P, requireSkill: W, readNow: $ };
}
const L = (e, g) => {
  const a = e.__vccOpts || e;
  for (const [h, i] of g)
    a[h] = i;
  return a;
}, we = ["aria-checked", "aria-label", "disabled"], qe = {
  __name: "RequiredSkillSwitch",
  props: { folder: { type: String, required: !0 }, required: Boolean, busy: Boolean },
  emits: ["change"],
  setup(e, { emit: g }) {
    const a = g;
    return (h, i) => (l(), n("button", {
      type: "button",
      role: "switch",
      "aria-checked": e.required,
      "aria-label": `${e.required ? "Stop requiring" : "Require"} ${e.folder} at the start`,
      disabled: e.busy,
      class: Y(["required-switch", { on: e.required }]),
      onClick: i[0] || (i[0] = (s) => a("change", !e.required))
    }, [...i[1] || (i[1] = [
      t("span", null, null, -1)
    ])], 10, we));
  }
}, re = /* @__PURE__ */ L(qe, [["__scopeId", "data-v-37017fe1"]]), Se = ["data-skill"], xe = ["aria-label"], Ce = { class: "name-line" }, Te = {
  key: 0,
  class: "read-dot",
  title: "Read by the main agent"
}, Re = { class: "description" }, Ae = {
  class: "groups",
  "data-skill-groups": ""
}, Oe = {
  __name: "SkillListItem",
  props: { skill: { type: Object, required: !0 }, selected: Boolean, busy: Boolean },
  emits: ["open", "require"],
  setup(e, { emit: g }) {
    const a = e, h = x(() => {
      var s;
      return (s = a.skill.groups) != null && s.length ? a.skill.groups : ["Main agent"];
    }), i = g;
    return (s, r) => (l(), n("div", {
      class: Y(["skill-list-item", { selected: e.selected }]),
      "data-skill": e.skill.folder
    }, [
      t("button", {
        type: "button",
        class: "skill-name",
        "aria-label": e.skill.folder,
        onClick: r[0] || (r[0] = (o) => i("open", e.skill.folder))
      }, [
        t("span", Ce, [
          I(u(ne), {
            name: "book",
            size: 13
          }),
          T(v(e.skill.folder), 1),
          e.skill.read ? (l(), n("span", Te)) : S("", !0)
        ]),
        t("span", Re, v(e.skill.description), 1),
        t("span", Ae, [
          (l(!0), n(R, null, V(h.value, (o) => (l(), n("span", {
            key: o,
            class: "group"
          }, v(o), 1))), 128))
        ])
      ], 8, xe),
      I(re, {
        folder: e.skill.folder,
        required: e.skill.required,
        busy: e.busy,
        onChange: r[1] || (r[1] = (o) => i("require", e.skill.folder, o))
      }, null, 8, ["folder", "required", "busy"])
    ], 10, Se));
  }
}, Z = /* @__PURE__ */ L(Oe, [["__scopeId", "data-v-33ddf837"]]), je = { class: "skill-group" }, Ie = ["aria-expanded"], Ee = ["aria-expanded", "onClick"], We = {
  __name: "SkillListGroup",
  props: { title: { type: String, required: !0 }, skills: { type: Array, required: !0 }, opened: { type: String, default: "" }, busy: { type: Array, default: () => [] }, searching: Boolean },
  emits: ["open", "require"],
  setup(e, { emit: g }) {
    const a = e, h = g, i = j(!1), s = j(/* @__PURE__ */ new Set()), r = (p) => {
      var b;
      return ((b = p.folder.match(/^commandments-([^-]+)-/)) == null ? void 0 : b[0].slice(0, -1)) || "";
    }, o = x(() => a.skills.filter((p) => !r(p))), d = x(() => [...new Set(a.skills.map(r).filter(Boolean))].map((p) => ({ name: p, skills: a.skills.filter((b) => r(b) === p) }))), w = (p) => {
      const b = new Set(s.value);
      b.has(p) ? b.delete(p) : b.add(p), s.value = b;
    };
    return (p, b) => (l(), n("section", je, [
      t("button", {
        type: "button",
        class: "group-head",
        "aria-expanded": !i.value || e.searching,
        onClick: b[0] || (b[0] = (k) => i.value = !i.value)
      }, [
        T(v(i.value && !e.searching ? "›" : "⌄") + " " + v(e.title) + " ", 1),
        t("small", null, v(e.skills.length) + ", " + v(e.skills.filter((k) => k.required).length) + " required", 1)
      ], 8, Ie),
      !i.value || e.searching ? (l(), n(R, { key: 0 }, [
        (l(!0), n(R, null, V(o.value, (k) => (l(), F(Z, {
          key: k.folder,
          skill: k,
          selected: e.opened === k.folder,
          busy: e.busy.includes(k.folder),
          onOpen: b[1] || (b[1] = (y) => h("open", y)),
          onRequire: b[2] || (b[2] = (y, f) => h("require", y, f))
        }, null, 8, ["skill", "selected", "busy"]))), 128)),
        (l(!0), n(R, null, V(d.value, (k) => (l(), n(R, {
          key: k.name
        }, [
          t("button", {
            type: "button",
            class: "group-head family",
            "aria-expanded": s.value.has(k.name) || e.searching,
            onClick: (y) => w(k.name)
          }, [
            T(v(s.value.has(k.name) || e.searching ? "⌄" : "›") + " " + v(k.name) + " ", 1),
            t("small", null, v(k.skills.length), 1)
          ], 8, Ee),
          s.value.has(k.name) || e.searching ? (l(!0), n(R, { key: 0 }, V(k.skills, (y) => (l(), F(Z, {
            key: y.folder,
            skill: y,
            selected: e.opened === y.folder,
            busy: e.busy.includes(y.folder),
            onOpen: b[3] || (b[3] = (f) => h("open", f)),
            onRequire: b[4] || (b[4] = (f, A) => h("require", f, A))
          }, null, 8, ["skill", "selected", "busy"]))), 128)) : S("", !0)
        ], 64))), 128))
      ], 64)) : S("", !0)
    ]));
  }
}, Le = /* @__PURE__ */ L(We, [["__scopeId", "data-v-f48d4dac"]]), Ne = {
  class: "skills-list",
  "data-skills-catalogue": ""
}, Ve = { class: "filters" }, Be = ["aria-pressed", "onClick"], Fe = { class: "skill-list-scroll" }, Me = {
  key: 1,
  class: "skills-empty"
}, Pe = {
  __name: "SkillsList",
  props: { skills: { type: Array, required: !0 }, opened: { type: String, default: "" }, busy: { type: Array, default: () => [] } },
  emits: ["open", "require"],
  setup(e, { emit: g }) {
    const a = e, h = g, i = j("all"), s = x(() => [...a.skills].sort((k, y) => (y.modified_at || 0) - (k.modified_at || 0))), r = ye(s, { title: (k) => k.folder });
    r.order.value = "title";
    const o = x(() => [{ key: "all", label: "All", count: a.skills.length }, { key: "required", label: "Required", count: a.skills.filter((k) => k.required).length }, { key: "read", label: "Read by the main agent", count: a.skills.filter((k) => k.read).length }]), d = x(() => r.shown.value.filter((k) => ({ all: !0, required: k.required, read: k.read })[i.value])), w = (k) => {
      var y;
      return (y = k.module) != null && y.startsWith("plugin:") ? "plugin" : k.shipped ? "journal" : "project";
    }, p = x(() => [{ key: "journal", title: "From the journal" }, { key: "plugin", title: "From a plugin" }, { key: "project", title: "From this project" }].map((k) => ({ ...k, skills: d.value.filter((y) => w(y) === k.key) })).filter((k) => k.skills.length)), b = x(() => a.skills.length ? r.words.value.trim() ? ["No skill matches", "Try other words."] : i.value === "required" ? ["No skill is required", "Switch on Required beside a skill to make the agent read it at the start."] : ["No skill is read in this conversation", "Skills appear here after the main agent reads them."] : ["No skills are installed", "Add a folder with a SKILL.md file under .agents/skills in this project."]);
    return (k, y) => (l(), n("aside", Ne, [
      I(u(pe), {
        tools: u(r),
        placeholder: "Find a skill"
      }, null, 8, ["tools"]),
      t("div", Ve, [
        (l(!0), n(R, null, V(o.value, (f) => (l(), n("button", {
          key: f.key,
          type: "button",
          "aria-pressed": i.value === f.key,
          onClick: (A) => i.value = f.key
        }, [
          T(v(f.label) + " ", 1),
          t("small", null, v(f.count), 1)
        ], 8, Be))), 128))
      ]),
      t("div", Fe, [
        d.value.length ? (l(), n(R, { key: 0 }, [
          y[3] || (y[3] = t("div", { class: "column-head" }, [
            t("span", null, "Skill"),
            t("span", null, "Required")
          ], -1)),
          (l(!0), n(R, null, V(p.value, (f) => (l(), F(Le, {
            key: f.key,
            title: f.title,
            skills: f.skills,
            opened: e.opened,
            busy: e.busy,
            searching: u(r).filtering.value || i.value !== "all",
            onOpen: y[0] || (y[0] = (A) => h("open", A)),
            onRequire: y[1] || (y[1] = (A, N) => h("require", A, N))
          }, null, 8, ["title", "skills", "opened", "busy", "searching"]))), 128))
        ], 64)) : (l(), n("div", Me, [
          t("strong", null, v(b.value[0]), 1),
          t("p", null, v(b.value[1]), 1),
          u(r).words.value ? (l(), n("button", {
            key: 0,
            type: "button",
            onClick: y[2] || (y[2] = (f) => u(r).words.value = "")
          }, "Clear the search")) : S("", !0)
        ]))
      ])
    ]));
  }
}, Ue = /* @__PURE__ */ L(Pe, [["__scopeId", "data-v-bcdb5e6a"]]), De = { class: "requirements" }, Ge = { class: "block-head" }, He = { class: "switch-label" }, Ke = {
  key: 0,
  class: "choices"
}, ze = ["value", "disabled"], Ye = { key: 0 }, Je = {
  key: 1,
  class: "again"
}, Qe = ["checked", "disabled"], Xe = {
  __name: "SkillRequirements",
  props: { skill: { type: Object, required: !0 }, busy: Boolean },
  emits: ["change"],
  setup(e, { emit: g }) {
    const a = g, h = (i) => a("change", i ? "all" : "none", !0);
    return (i, s) => (l(), n("section", De, [
      t("div", Ge, [
        s[3] || (s[3] = t("div", null, [
          t("h3", null, "Must the agent read it at the start?"),
          t("p", null, "When a conversation starts, the agent must read this skill before it may do anything else.")
        ], -1)),
        t("span", He, [
          s[2] || (s[2] = T("Required ", -1)),
          I(re, {
            folder: e.skill.folder,
            required: e.skill.required,
            busy: e.busy,
            onChange: h
          }, null, 8, ["folder", "required", "busy"])
        ])
      ]),
      e.skill.required ? (l(), n("div", Ke, [
        t("label", null, [
          s[5] || (s[5] = T("Which agents must read it", -1)),
          t("select", {
            value: e.skill.agents,
            "aria-label": "Which agents must read it",
            disabled: e.busy,
            onChange: s[0] || (s[0] = (r) => a("change", r.target.value, e.skill.again))
          }, [...s[4] || (s[4] = [
            t("option", { value: "all" }, "Every agent", -1),
            t("option", { value: "main" }, "Only the main agent", -1)
          ])], 40, ze)
        ]),
        e.skill.agents === "main" ? (l(), n("p", Ye, "The main agent reads it at the start and again after every compaction.")) : (l(), n("label", Je, [
          s[6] || (s[6] = t("span", null, [
            T("Read it again after the conversation is compacted"),
            t("small", null, "Compacting empties what the agent has read.")
          ], -1)),
          t("input", {
            type: "checkbox",
            checked: e.skill.again,
            disabled: e.busy,
            "aria-label": "Read it again after the conversation is compacted",
            onChange: s[1] || (s[1] = (r) => a("change", e.skill.agents, r.target.checked))
          }, null, 40, Qe)
        ]))
      ])) : S("", !0)
    ]));
  }
}, Ze = /* @__PURE__ */ L(Xe, [["__scopeId", "data-v-87c0e195"]]), _e = [
  { key: "nudge", value: "nudge", label: "Remind the agent", hint: "A short note only the agent sees. It carries on with its work.", ask: "What to remind the agent of", example: "Add the change to src/CHANGELOG.md in plain words." },
  { key: "instruct", value: "instruct", label: "Tell the agent to do something now", hint: "The agent sees “Do this now:” followed by your text.", ask: "What the agent should do", example: "Stop and ask me before you touch the database." },
  { key: "deny", value: "deny", label: "Block a command or file change", hint: "The command or file change is refused, and the agent is given your reason.", ask: "Reason the agent is given", example: "Never force-push. Ask me first." },
  { key: "skill", value: "skill", label: "Make the agent read a skill", hint: "The agent must read the skill before it continues.", ask: "Which skill the agent must read", example: "journal-plans" }
];
_e.filter((e) => !["deny", "skill"].includes(e.value));
const et = [
  { key: "messages", label: "What you write to the agent" },
  { key: "commands", label: "Commands the agent runs" },
  { key: "files", label: "Files the agent changes" }
], tt = [
  { key: "part", label: "Part of the text", hint: "Capitals ignored" },
  { key: "word", label: "Whole word", hint: "Not part of another word" },
  { key: "pattern", label: "Pattern", hint: "A regular expression" }
], lt = [
  { key: "main", value: "main", label: "The main agent" },
  { key: "helper", value: "helper", label: "An agent or helper" }
], _ = [
  { key: "agent", value: "agent", label: "Agent", note: "The main agent or a helper", choices: lt },
  { key: "environment", value: "environment", label: "Environment", note: "Only in one environment", example: "main" },
  { key: "fired", value: "fired", label: "How often it has fired", note: "Only the first few times", example: "3" },
  { key: "hours", value: "hours", label: "Hours of the day", note: "From one hour until another", example: "9-17" }
], Q = (e) => `“${e}”`;
function st(e) {
  const g = e.slice(0, 3).map(Q), a = e.length - 3;
  return a > 0 ? `${g.join(", ")} or ${a} other ${a === 1 ? "phrase" : "phrases"}` : g.length > 1 ? `${g.slice(0, -1).join(", ")} or ${g.at(-1)}` : g[0];
}
const nt = {
  skill: (e) => `make the agent read ${e}`,
  nudge: (e) => `remind the agent ${e}`,
  instruct: (e) => `tell the agent to do this now: ${e}`,
  deny: (e) => `block it and tell the agent ${e}`
}, at = {
  every: (e) => `Every ${e.every || "few"} minutes`,
  once: () => "At the time you choose",
  cron: () => "At the scheduled times"
};
function oe(e) {
  const g = nt[e.action](e.action === "skill" ? Q(e.skill || "the skill") : e.text ? Q(e.text) : "(no text yet)");
  return e.type === "time" ? `${at[e.time](e)}, ${g}.` : e.phrases.length ? `When ${st(e.phrases)} appears, ${g}.` : "Add the words to watch for and choose what happens.";
}
const it = {
  key: 0,
  class: "waiting"
}, rt = { key: 0 }, ot = ["disabled"], dt = ["disabled"], ut = ["disabled", "aria-label"], ct = {
  __name: "SkillTriggerCard",
  props: { trigger: { type: Object, required: !0 }, busy: Boolean },
  emits: ["edit", "run"],
  setup(e, { emit: g }) {
    const a = e, h = g, i = x(() => oe(a.trigger));
    return (s, r) => (l(), n("article", {
      class: Y(["skill-trigger-card", { paused: e.trigger.paused_at }])
    }, [
      t("p", null, v(i.value), 1),
      e.trigger.needs_enabling ? (l(), n("p", it, "An agent made this trigger. It does nothing until you turn it on.")) : S("", !0),
      t("footer", null, [
        t("span", null, v(e.trigger.fired_count ? `Fired ${e.trigger.fired_count} times` : "Not fired yet"), 1),
        e.trigger.paused_at ? (l(), n("span", rt, "Paused")) : S("", !0),
        r[3] || (r[3] = t("span", { class: "push" }, null, -1)),
        t("button", {
          type: "button",
          disabled: e.busy,
          onClick: r[0] || (r[0] = (o) => h("edit", e.trigger))
        }, "Edit", 8, ot),
        e.trigger.needs_enabling ? (l(), n("button", {
          key: 1,
          type: "button",
          disabled: e.busy,
          onClick: r[1] || (r[1] = (o) => h("run", ["trigger", "enable", String(e.trigger.id)]))
        }, "Turn it on", 8, dt)) : (l(), n("button", {
          key: 2,
          type: "button",
          disabled: e.busy,
          "aria-label": e.trigger.paused_at ? "Resume this trigger" : "Pause this trigger",
          onClick: r[2] || (r[2] = (o) => h("run", ["trigger", "pause", String(e.trigger.id), ...e.trigger.paused_at ? ["--off"] : []]))
        }, v(e.trigger.paused_at ? "Resume" : "Pause"), 9, ut))
      ])
    ], 2));
  }
}, de = /* @__PURE__ */ L(ct, [["__scopeId", "data-v-a8b11e7d"]]), gt = { class: "tiles" }, kt = ["onClick"], mt = {
  __name: "TriggerTiles",
  props: /* @__PURE__ */ J({ options: { type: Array, required: !0 }, mark: { type: String, required: !0 } }, {
    modelValue: { type: String, required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const g = G(e, "modelValue");
    return (a, h) => (l(), n("div", gt, [
      (l(!0), n(R, null, V(e.options, (i) => (l(), n("button", ce({
        key: i.key,
        type: "button",
        class: ["tile", { picked: g.value === i.key }]
      }, { ref_for: !0 }, { [`data-${e.mark}`]: i.key }, {
        onClick: (s) => g.value = i.key
      }), [
        t("b", null, v(i.label), 1),
        t("span", null, v(i.hint), 1)
      ], 16, kt))), 128))
    ]));
  }
}, ht = /* @__PURE__ */ L(mt, [["__scopeId", "data-v-e5657c19"]]), vt = { class: "words" }, yt = ["aria-label", "onClick"], pt = ["onKeydown"], ft = {
  __name: "WatchedWords",
  props: { words: { type: Array, required: !0 } },
  emits: ["words"],
  setup(e, { emit: g }) {
    const a = e, h = g, i = j("");
    function s() {
      const o = i.value.trim();
      i.value = "", o && !a.words.includes(o) && h("words", [...a.words, o]);
    }
    const r = (o) => h("words", a.words.filter((d) => d !== o));
    return (o, d) => (l(), n("div", vt, [
      (l(!0), n(R, null, V(e.words, (w) => (l(), n("span", {
        key: w,
        class: "word"
      }, [
        T(v(w) + " ", 1),
        t("button", {
          type: "button",
          class: "word-remove",
          "aria-label": `Remove ${w}`,
          onClick: (p) => r(w)
        }, [
          I(u(ne), {
            name: "close",
            size: 11
          })
        ], 8, yt)
      ]))), 128)),
      K(t("input", {
        "onUpdate:modelValue": d[0] || (d[0] = (w) => i.value = w),
        class: "word-input",
        placeholder: "Add a word, then Enter",
        "aria-label": "Add a word",
        "data-trigger-word": "",
        onKeydown: ge(te(s, ["prevent"]), ["enter"]),
        onBlur: s
      }, null, 40, pt), [
        [z, i.value]
      ])
    ]));
  }
}, bt = /* @__PURE__ */ L(ft, [["__scopeId", "data-v-740e8b19"]]), $t = { class: "field" }, wt = { class: "field" }, qt = ["checked", "data-trigger-place", "onChange"], St = { class: "field" }, xt = {
  key: 0,
  class: "pattern-limit",
  "data-trigger-pattern-limit": ""
}, Ct = {
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
    const g = G(e, "phrases"), a = G(e, "places"), h = G(e, "match"), i = (s) => a.value = a.value.includes(s) ? a.value.filter((r) => r !== s) : [...a.value, s];
    return (s, r) => (l(), n(R, null, [
      t("div", $t, [
        r[2] || (r[2] = t("span", { class: "label" }, "When these words appear", -1)),
        I(bt, {
          words: g.value,
          onWords: r[0] || (r[0] = (o) => g.value = o)
        }, null, 8, ["words"])
      ]),
      t("div", wt, [
        r[3] || (r[3] = t("span", { class: "label" }, "Where to look", -1)),
        (l(!0), n(R, null, V(u(et), (o) => (l(), n("label", {
          key: o.key,
          class: "check"
        }, [
          t("input", {
            type: "checkbox",
            checked: a.value.includes(o.key),
            "data-trigger-place": o.key,
            onChange: (d) => i(o.key)
          }, null, 40, qt),
          T(v(o.label), 1)
        ]))), 128))
      ]),
      t("div", St, [
        r[4] || (r[4] = t("span", { class: "label" }, "How words match", -1)),
        I(ht, {
          modelValue: h.value,
          "onUpdate:modelValue": r[1] || (r[1] = (o) => h.value = o),
          options: u(tt),
          mark: "trigger-match"
        }, null, 8, ["modelValue", "options"]),
        h.value === "pattern" ? (l(), n("p", xt, "Patterns have no time limit. A slow pattern can delay every command or file change. Patterns are limited to 200 characters and check only the first 2,000 characters; repeating a repeated group is refused.")) : S("", !0)
      ])
    ], 64));
  }
}, Tt = /* @__PURE__ */ L(Ct, [["__scopeId", "data-v-3eabab54"]]), Rt = { class: "block" }, At = {
  key: 0,
  class: "field"
}, Ot = { class: "label" }, jt = {
  key: 1,
  class: "field"
}, It = { class: "label" }, Et = ["placeholder"], Wt = {
  __name: "TriggerListedField",
  props: /* @__PURE__ */ J({
    label: { type: String, required: !0 },
    example: { type: String, default: "" },
    choices: { type: Array, default: null }
  }, {
    modelValue: { type: String, required: !0 },
    modelModifiers: {}
  }),
  emits: /* @__PURE__ */ J(["remove"], ["update:modelValue"]),
  setup(e, { emit: g }) {
    const a = e, h = g, i = G(e, "modelValue"), s = x(() => {
      var r, o;
      return ((o = (r = a.choices) == null ? void 0 : r.find((d) => d.value === i.value)) == null ? void 0 : o.label) ?? "Choose one";
    });
    return (r, o) => (l(), n("div", Rt, [
      e.choices ? (l(), n("div", At, [
        t("span", Ot, v(e.label), 1),
        I(u(ae), {
          label: s.value,
          items: e.choices,
          picked: i.value,
          "data-trigger-choice": "",
          onPick: o[0] || (o[0] = (d) => i.value = d.value)
        }, null, 8, ["label", "items", "picked"])
      ])) : (l(), n("label", jt, [
        t("span", It, v(e.label), 1),
        K(t("input", {
          "onUpdate:modelValue": o[1] || (o[1] = (d) => i.value = d),
          placeholder: e.example,
          "data-trigger-listed": ""
        }, null, 8, Et), [
          [z, i.value]
        ])
      ])),
      I(u(fe), {
        class: "remove",
        small: "",
        onClick: o[2] || (o[2] = (d) => h("remove"))
      }, {
        default: le(() => [...o[3] || (o[3] = [
          T("Remove", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Lt = /* @__PURE__ */ L(Wt, [["__scopeId", "data-v-cec179d6"]]), Nt = {
  __name: "TriggerConditionFields",
  props: {
    modelValue: { type: Array, required: !0 },
    modelModifiers: {}
  },
  emits: ["update:modelValue"],
  setup(e) {
    const g = G(e, "modelValue"), a = (r) => _.find((o) => o.value === r.type), h = (r, o) => g.value = g.value.map((d, w) => w === r ? { ...d, value: o } : d), i = (r) => g.value = g.value.filter((o, d) => d !== r), s = (r) => g.value = [...g.value, { type: r.value, value: "" }];
    return (r, o) => (l(), n(R, null, [
      (l(!0), n(R, null, V(g.value, (d, w) => (l(), F(Lt, {
        key: w,
        "model-value": d.value,
        label: a(d).label,
        example: a(d).example,
        choices: a(d).choices,
        "onUpdate:modelValue": (p) => h(w, p),
        onRemove: (p) => i(w)
      }, null, 8, ["model-value", "label", "example", "choices", "onUpdate:modelValue", "onRemove"]))), 128)),
      I(u(ae), {
        label: "Add a condition",
        icon: "plus",
        items: u(_),
        "data-trigger-add-condition": "",
        onPick: s
      }, null, 8, ["items"])
    ], 64));
  }
}, Vt = {
  key: 0,
  class: "field"
}, Bt = ["value"], Ft = { class: "summary" }, Mt = { class: "field" }, Pt = {
  key: 1,
  class: "trial",
  role: "status"
}, Ut = ["open"], Dt = { class: "more" }, Gt = { class: "field" }, Ht = ["placeholder"], Kt = {
  class: "help",
  role: "status"
}, zt = { class: "actions" }, Yt = ["disabled"], Jt = {
  __name: "SkillTriggerEditor",
  props: { skill: { type: String, default: "" }, trigger: { type: Object, default: null }, skills: { type: Array, required: !0 } },
  emits: ["saved", "cancel"],
  setup(e, { emit: g }) {
    var O, E, M, B, U, P;
    const a = e, h = g, i = se(), s = ke({ skill: ((O = a.trigger) == null ? void 0 : O.skill) || a.skill, name: ((E = a.trigger) == null ? void 0 : E.name) || "", phrases: [...((M = a.trigger) == null ? void 0 : M.phrases) || []], places: [...((B = a.trigger) == null ? void 0 : B.watch_places) || ["messages", "commands", "files"]], match: ((U = a.trigger) == null ? void 0 : U.match_mode) || "word", conditions: JSON.parse(((P = a.trigger) == null ? void 0 : P.conditions) || "[]") }), r = j(""), o = j(null), d = j(""), w = j(!1), p = j(!1), b = x(() => s.skill ? s.phrases.length ? s.places.length ? "" : "Choose where to look." : "Add at least one word." : "Choose a skill."), k = x(() => oe({ ...s, action: "skill" }));
    let y, f = 0;
    X(() => [r.value, s.phrases.join(","), s.match], () => {
      clearTimeout(y);
      const W = ++f;
      o.value = null, !(!r.value.trim() || !s.phrases.length) && (y = setTimeout(async () => {
        i.state["trial.phrases"] = s.phrases.join(","), i.state["trial.sentence"] = r.value, i.state["trial.match-mode"] = s.match, await i.reload("trial"), W === f && (o.value = i.props.trial.failure.value ? { error: i.props.trial.failure.value } : i.props.trial.data.value);
      }, 150));
    }), ee(() => {
      clearTimeout(y), f++;
    });
    async function A() {
      if (w.value || b.value) return;
      w.value = !0;
      const W = ["--name", s.name.trim() || `Read ${s.skill}`, "--skill", s.skill, "--watch-places", ...s.places, "--match-mode", s.match, "--conditions", JSON.stringify(s.conditions)], $ = a.trigger ? ["trigger", "edit", String(a.trigger.id), ...W, ...s.phrases.map((c) => `--phrases=${c}`)] : ["trigger", "make", "--do", "skill", ...W, "--", s.phrases.join(", ")], q = await i.run($);
      d.value = q.ok ? "" : q.error, w.value = !1, q.ok && h("saved");
    }
    async function N() {
      const W = await i.run(["trigger", "strike", String(a.trigger.id)]);
      d.value = W.ok ? "" : W.error, W.ok && h("saved");
    }
    return (W, $) => (l(), n("form", {
      class: "skill-trigger-editor",
      onSubmit: te(A, ["prevent"])
    }, [
      t("h3", null, [
        T(v(e.trigger ? "Edit this trigger" : "New trigger"), 1),
        s.skill ? (l(), n(R, { key: 0 }, [
          T(" for " + v(s.skill), 1)
        ], 64)) : S("", !0)
      ]),
      e.skill ? S("", !0) : (l(), n("label", Vt, [
        $[10] || ($[10] = T("Which skill the agent must read", -1)),
        K(t("select", {
          "onUpdate:modelValue": $[0] || ($[0] = (q) => s.skill = q),
          "aria-label": "Which skill the agent must read"
        }, [
          $[9] || ($[9] = t("option", { value: "" }, "Choose a skill", -1)),
          (l(!0), n(R, null, V(e.skills, (q) => (l(), n("option", {
            key: q.folder,
            value: q.folder
          }, v(q.folder), 9, Bt))), 128))
        ], 512), [
          [me, s.skill]
        ])
      ])),
      I(Tt, {
        phrases: s.phrases,
        "onUpdate:phrases": $[1] || ($[1] = (q) => s.phrases = q),
        places: s.places,
        "onUpdate:places": $[2] || ($[2] = (q) => s.places = q),
        match: s.match,
        "onUpdate:match": $[3] || ($[3] = (q) => s.match = q)
      }, null, 8, ["phrases", "places", "match"]),
      t("div", Ft, [
        $[11] || ($[11] = t("small", null, "What this trigger does", -1)),
        t("p", null, v(k.value), 1)
      ]),
      t("label", Mt, [
        $[12] || ($[12] = T("Try a sentence", -1)),
        K(t("input", {
          "onUpdate:modelValue": $[4] || ($[4] = (q) => r.value = q),
          "aria-label": "Try a sentence",
          placeholder: "For example: take notes about the plan"
        }, null, 512), [
          [z, r.value]
        ])
      ]),
      o.value ? (l(), n("p", Pt, v(o.value.error || (o.value.matches ? "This would fire." : "This would not fire.")), 1)) : S("", !0),
      t("details", {
        open: !!e.trigger
      }, [
        $[14] || ($[14] = t("summary", null, "More choices: its name and when it applies", -1)),
        t("div", Dt, [
          t("label", Gt, [
            $[13] || ($[13] = T("Name", -1)),
            K(t("input", {
              "onUpdate:modelValue": $[5] || ($[5] = (q) => s.name = q),
              "aria-label": "Name",
              placeholder: `Read ${s.skill || "the skill"}`
            }, null, 8, Ht), [
              [z, s.name]
            ])
          ]),
          I(Nt, {
            modelValue: s.conditions,
            "onUpdate:modelValue": $[6] || ($[6] = (q) => s.conditions = q)
          }, null, 8, ["modelValue"])
        ])
      ], 8, Ut),
      t("p", Kt, v(d.value || b.value), 1),
      t("div", zt, [
        e.trigger ? (l(), n("button", {
          key: 0,
          type: "button",
          class: "danger",
          onClick: $[7] || ($[7] = (q) => p.value ? N() : p.value = !0)
        }, v(p.value ? "Yes, end it" : "End this trigger"), 1)) : S("", !0),
        t("button", {
          type: "button",
          onClick: $[8] || ($[8] = (q) => h("cancel"))
        }, "Cancel"),
        t("button", {
          type: "submit",
          class: "primary",
          disabled: w.value || !!b.value
        }, v(e.trigger ? "Save" : "Create trigger"), 9, Yt)
      ])
    ], 32));
  }
}, ue = /* @__PURE__ */ L(Jt, [["__scopeId", "data-v-f829b85c"]]), Qt = { class: "skill-details" }, Xt = { class: "status" }, Zt = { class: "block" }, _t = { class: "block-head" }, el = {
  key: 0,
  class: "help"
}, tl = {
  key: 0,
  class: "block"
}, ll = { key: 0 }, sl = { key: 1 }, nl = { key: 2 }, al = { class: "block" }, il = { class: "block-head" }, rl = ["href"], ol = {
  key: 0,
  "data-skill-text": ""
}, dl = {
  key: 1,
  class: "help"
}, ul = {
  __name: "SkillDetails",
  props: { skill: { type: Object, required: !0 }, text: { type: Object, default: null }, triggers: { type: Array, required: !0 }, skills: { type: Array, required: !0 }, agent: { type: Number, default: null }, draft: { type: Object, default: null }, busy: Boolean },
  emits: ["require", "read", "add", "edit", "run", "saved", "cancel"],
  setup(e, { emit: g }) {
    const a = e, h = g, i = x(() => {
      var o;
      return (o = a.skill.module) != null && o.startsWith("plugin:") ? "From a plugin" : a.skill.shipped ? "From the journal" : "From this project";
    }), s = x(() => {
      var o;
      return a.agent ? a.skill.changed ? "This skill changed after the main agent read it." : ((o = a.skill.held) == null ? void 0 : o.state) === "due" ? "The main agent still has to read this skill. It cannot do anything else first." : a.skill.read ? `The main agent read this skill at ${new Date(a.skill.held.loaded_at).toLocaleString()}.` : "The main agent has not read this skill in this conversation." : "No main agent is running in this environment.";
    }), r = j("");
    return X(() => a.text, (o, d, w) => {
      if (!o) return;
      const p = URL.createObjectURL(new Blob([o.text], { type: "text/plain;charset=utf-8" }));
      r.value = p, w(() => URL.revokeObjectURL(p));
    }, { immediate: !0 }), (o, d) => {
      var w, p, b, k, y, f, A, N;
      return l(), n("div", Qt, [
        t("header", null, [
          t("h2", null, [
            T(v(e.skill.folder) + " ", 1),
            t("small", null, v(i.value), 1)
          ]),
          t("p", null, v(e.skill.description), 1)
        ]),
        t("div", Xt, [
          t("span", null, v(s.value), 1),
          e.agent && ((w = e.skill.held) == null ? void 0 : w.state) !== "due" ? (l(), n("button", {
            key: 0,
            type: "button",
            onClick: d[0] || (d[0] = (O) => h("read"))
          }, v(e.skill.read ? "Make the agent read it again" : "Make the agent read it now"), 1)) : S("", !0)
        ]),
        I(Ze, {
          skill: e.skill,
          busy: e.busy,
          onChange: d[1] || (d[1] = (O, E) => h("require", O, E))
        }, null, 8, ["skill", "busy"]),
        t("section", Zt, [
          t("div", _t, [
            d[7] || (d[7] = t("h3", null, "Make the agent read it when your words appear", -1)),
            e.draft ? S("", !0) : (l(), n("button", {
              key: 0,
              type: "button",
              onClick: d[2] || (d[2] = (O) => h("add"))
            }, "Add a trigger"))
          ]),
          !e.triggers.length && !e.draft ? (l(), n("p", el, "No triggers yet. Add one, and the agent must read this skill as soon as your words appear.")) : S("", !0),
          (l(!0), n(R, null, V(e.triggers, (O) => {
            var E, M;
            return l(), n(R, {
              key: O.id
            }, [
              ((M = (E = e.draft) == null ? void 0 : E.trigger) == null ? void 0 : M.id) !== O.id ? (l(), F(de, {
                key: 0,
                trigger: O,
                onEdit: d[3] || (d[3] = (B) => h("edit", B)),
                onRun: d[4] || (d[4] = (B) => h("run", B))
              }, null, 8, ["trigger"])) : S("", !0)
            ], 64);
          }), 128)),
          e.draft ? (l(), F(ue, {
            key: ((p = e.draft.trigger) == null ? void 0 : p.id) || e.skill.folder,
            skill: e.skill.folder,
            trigger: e.draft.trigger,
            skills: e.skills,
            onSaved: d[5] || (d[5] = (O) => h("saved")),
            onCancel: d[6] || (d[6] = (O) => h("cancel"))
          }, null, 8, ["skill", "trigger", "skills"])) : S("", !0)
        ]),
        (b = e.skill.keywords) != null && b.length || (k = e.skill.commands) != null && k.length || (y = e.skill.events) != null && y.length ? (l(), n("section", tl, [
          d[11] || (d[11] = t("h3", null, "When the skill itself asks to be read", -1)),
          d[12] || (d[12] = t("p", { class: "help" }, "These come with the skill and cannot be changed here.", -1)),
          t("ul", null, [
            (f = e.skill.keywords) != null && f.length ? (l(), n("li", ll, [
              d[8] || (d[8] = T("When you write ", -1)),
              t("code", null, v(e.skill.keywords.join(", ")), 1)
            ])) : S("", !0),
            (A = e.skill.commands) != null && A.length ? (l(), n("li", sl, [
              d[9] || (d[9] = T("Before it runs a command about ", -1)),
              t("code", null, v(e.skill.commands.join(", ")), 1)
            ])) : S("", !0),
            (N = e.skill.events) != null && N.length ? (l(), n("li", nl, [
              d[10] || (d[10] = T("When these changes happen: ", -1)),
              t("code", null, v(e.skill.events.join(", ")), 1)
            ])) : S("", !0)
          ])
        ])) : S("", !0),
        t("section", al, [
          t("div", il, [
            d[13] || (d[13] = t("h3", null, "What the skill says", -1)),
            r.value ? (l(), n("a", {
              key: 0,
              href: r.value,
              target: "_blank",
              rel: "noopener"
            }, "Open SKILL.md", 8, rl)) : S("", !0)
          ]),
          e.text ? (l(), n("div", ol, [
            I(u(ie), {
              text: e.text.text,
              "row-names": !1
            }, null, 8, ["text"])
          ])) : (l(), n("p", dl, "Reading the skill…"))
        ])
      ]);
    };
  }
}, cl = /* @__PURE__ */ L(ul, [["__scopeId", "data-v-ef12011b"]]), gl = { class: "skills" }, kl = { class: "skills-title" }, ml = {
  class: "skills-text",
  "data-skill-text": ""
}, hl = {
  __name: "SkillText",
  props: { skill: { type: Object, default: null }, failure: { type: String, default: "" }, back: { type: Boolean, default: !0 } },
  emits: ["back"],
  setup(e, { emit: g }) {
    const a = g;
    return (h, i) => (l(), n("div", gl, [
      e.back ? (l(), n("button", {
        key: 0,
        type: "button",
        class: "skills-back",
        onClick: i[0] || (i[0] = (s) => a("back"))
      }, "Back to skills")) : S("", !0),
      t("h3", kl, v(e.skill ? e.skill.folder : ""), 1),
      t("div", ml, [
        I(u(ie), {
          text: e.skill ? e.skill.text : e.failure,
          "row-names": !1
        }, null, 8, ["text"])
      ])
    ]));
  }
}, vl = /* @__PURE__ */ L(hl, [["__scopeId", "data-v-7145e806"]]), yl = { class: "page-head" }, pl = { "aria-label": "Skills views" }, fl = ["aria-pressed"], bl = ["aria-pressed"], $l = {
  key: 0,
  class: "warning",
  role: "status"
}, wl = {
  key: 1,
  class: "warning",
  role: "alert"
}, ql = {
  key: 2,
  class: "empty"
}, Sl = {
  key: 3,
  class: "panes"
}, xl = { class: "skill-pane" }, Cl = {
  key: 0,
  class: "empty"
}, Tl = {
  key: 2,
  class: "empty centre"
}, Rl = {
  key: 4,
  class: "panes"
}, Al = { class: "triggers-list" }, Ol = {
  key: 0,
  class: "trigger-cards"
}, jl = {
  key: 1,
  class: "empty"
}, Il = { class: "skill-pane trigger-pane" }, El = {
  key: 0,
  class: "trigger-form"
}, Wl = {
  key: 1,
  class: "empty centre"
}, Ll = {
  __name: "SkillRows",
  setup(e) {
    const { skills: g, selected: a, selectedTriggers: h, triggers: i, requirements: s, mainAgent: r, answered: o, failure: d, busy: w, opened: p, text: b, openFailure: k, tab: y, draft: f, marked: A, load: N, open: O, run: E, requireSkill: M, readNow: B } = $e(), U = (c, m) => M(c, m ? "all" : "none"), P = () => f.value = { trigger: null }, W = (c) => f.value = { trigger: c }, $ = async () => {
      f.value = null, await N();
    }, q = (c) => {
      y.value = c, f.value = null;
    };
    return (c, m) => (l(), F(u(be), { padding: "0" }, {
      default: le(() => {
        var D;
        return [
          u(A) ? (l(), F(vl, {
            key: 0,
            skill: u(b),
            failure: u(k),
            back: !1
          }, null, 8, ["skill", "failure"])) : (l(), n("main", {
            key: 1,
            class: Y(["skills-page", { "skill-open": u(y) === "skills" && !!u(p), "trigger-open": u(y) === "triggers" && !!u(f) }])
          }, [
            t("header", yl, [
              m[8] || (m[8] = t("div", null, [
                t("h1", null, "Skills"),
                t("p", null, "Instructions the agent reads before starting work. Choose which skills the agent must read, and when. These settings apply to the whole project.")
              ], -1)),
              t("nav", pl, [
                t("button", {
                  type: "button",
                  "aria-pressed": u(y) === "skills",
                  onClick: m[0] || (m[0] = (C) => q("skills"))
                }, "Skills", 8, fl),
                t("button", {
                  type: "button",
                  "aria-pressed": u(y) === "triggers",
                  onClick: m[1] || (m[1] = (C) => q("triggers"))
                }, "Triggers", 8, bl)
              ])
            ]),
            u(s).environment_overrides ? (l(), n("p", $l, "This environment uses separate skill lists. Changes here apply to the whole project. The environment lists still take priority.")) : S("", !0),
            u(d) ? (l(), n("div", wl, [
              T(v(u(d)) + " ", 1),
              t("button", {
                type: "button",
                onClick: m[2] || (m[2] = (...C) => u(N) && u(N)(...C))
              }, "Try again")
            ])) : S("", !0),
            u(o) ? u(y) === "skills" ? (l(), n("div", Sl, [
              I(Ue, {
                skills: u(g),
                opened: u(p),
                busy: u(w),
                onOpen: u(O),
                onRequire: U
              }, null, 8, ["skills", "opened", "busy", "onOpen"]),
              t("article", xl, [
                t("button", {
                  type: "button",
                  class: "phone-back",
                  onClick: m[3] || (m[3] = (C) => u(O)(""))
                }, "Back to skills"),
                u(k) ? (l(), n("div", Cl, [
                  m[9] || (m[9] = t("strong", null, "Could not read this skill", -1)),
                  t("p", null, v(u(k)), 1),
                  t("button", {
                    type: "button",
                    onClick: m[4] || (m[4] = (C) => u(O)(u(p), !1))
                  }, "Try again")
                ])) : u(a) ? (l(), F(cl, {
                  key: 1,
                  skill: u(a),
                  text: u(b),
                  triggers: u(h),
                  skills: u(g),
                  agent: u(r),
                  draft: u(f),
                  busy: u(w).includes(u(p)),
                  onRequire: m[5] || (m[5] = (C, H) => u(M)(u(p), C, H)),
                  onRead: u(B),
                  onAdd: P,
                  onEdit: W,
                  onRun: u(E),
                  onSaved: $,
                  onCancel: m[6] || (m[6] = (C) => f.value = null)
                }, null, 8, ["skill", "text", "triggers", "skills", "agent", "draft", "busy", "onRead", "onRun"])) : (l(), n("div", Tl, [...m[10] || (m[10] = [
                  t("strong", null, "Choose a skill to read what it says", -1),
                  t("p", null, "Switch on Required to make the agent read a skill at the start. Open a skill to add words that make the agent read it later.", -1)
                ])]))
              ])
            ])) : (l(), n("div", Rl, [
              t("aside", Al, [
                t("div", { class: "trigger-head" }, [
                  m[11] || (m[11] = t("p", null, "Triggers that make an agent read a skill. Other triggers stay under Triggers.", -1)),
                  t("button", {
                    type: "button",
                    onClick: P
                  }, "Add a trigger")
                ]),
                u(i).length ? (l(), n("div", Ol, [
                  (l(!0), n(R, null, V(u(i), (C) => (l(), F(de, {
                    key: C.id,
                    trigger: C,
                    onEdit: W,
                    onRun: u(E)
                  }, null, 8, ["trigger", "onRun"]))), 128))
                ])) : (l(), n("div", jl, [
                  m[12] || (m[12] = t("strong", null, "You have no triggers yet", -1)),
                  m[13] || (m[13] = t("p", null, "A trigger makes the agent read a skill as soon as your words appear.", -1)),
                  t("button", {
                    type: "button",
                    onClick: P
                  }, "Add a trigger")
                ]))
              ]),
              t("article", Il, [
                u(f) ? (l(), n("div", El, [
                  (l(), F(ue, {
                    key: ((D = u(f).trigger) == null ? void 0 : D.id) || "new",
                    trigger: u(f).trigger,
                    skills: u(g),
                    onSaved: $,
                    onCancel: m[7] || (m[7] = (C) => f.value = null)
                  }, null, 8, ["trigger", "skills"]))
                ])) : (l(), n("div", Wl, [...m[14] || (m[14] = [
                  t("strong", null, "Choose Edit on a trigger to change it", -1),
                  t("p", null, "Or add a new one. Each trigger makes the agent read one skill.", -1)
                ])]))
              ])
            ])) : (l(), n("p", ql, "Reading the skills…"))
          ], 2))
        ];
      }),
      _: 1
    }));
  }
}, Bl = /* @__PURE__ */ L(Ll, [["__scopeId", "data-v-292001d8"]]);
export {
  Bl as S
};
