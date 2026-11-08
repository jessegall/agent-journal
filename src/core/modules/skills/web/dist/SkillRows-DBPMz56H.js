/* @code-commandments-generated */
import { computed as x, ref as j, watch as X, onUnmounted as ee, openBlock as l, createElementBlock as n, normalizeClass as Y, createElementVNode as t, createVNode as I, unref as u, createTextVNode as T, toDisplayString as v, createCommentVNode as S, Fragment as R, renderList as V, createBlock as M, useModel as G, mergeProps as ge, mergeModels as J, withDirectives as K, withKeys as ke, withModifiers as te, vModelText as z, withCtx as le, reactive as me, vModelSelect as he } from "vue";
import { useWindow as se, coalesced as ve, READ_RATES as ye, Icon as ne, useListTools as pe, ListTools as fe, DropList as ae, Btn as be, TextDisplay as ie, WindowRoom as $e } from "@journal/window-kit";
function we() {
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
  })), E = x(() => O.value.find((c) => c.folder === p.value)), F = x(() => h.value.filter((c) => c.skill === p.value));
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
  return window.addEventListener("popstate", q), ee(() => window.removeEventListener("popstate", q)), e.follow(["agent_skill.*"], ve(() => {
    s.value && e.reload("loaded");
  }, ye.openPanel)), A.value ? e.readKey(`agent-skill.${A.value.skillId ?? A.value.id}`).then((c) => c.ok ? U(c.value.skill, !1) : k.value = c.error) : q(), { skills: O, selected: E, selectedTriggers: F, triggers: h, requirements: i, mainAgent: s, answered: r, failure: d, busy: w, opened: p, text: b, openFailure: k, tab: y, draft: f, marked: A, load: B, open: U, run: P, requireSkill: W, readNow: $ };
}
const L = (e, g) => {
  const a = e.__vccOpts || e;
  for (const [h, i] of g)
    a[h] = i;
  return a;
}, qe = ["aria-checked", "aria-label", "disabled"], Se = {
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
    ])], 10, qe));
  }
}, re = /* @__PURE__ */ L(Se, [["__scopeId", "data-v-ee9d0e40"]]), xe = ["data-skill"], Ce = ["aria-label"], Te = { class: "name-line" }, Re = {
  key: 0,
  class: "read-dot",
  title: "Read by the main agent"
}, Ae = { class: "description" }, Oe = {
  class: "groups",
  "data-skill-groups": ""
}, je = {
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
        t("span", Te, [
          I(u(ne), {
            name: "book",
            size: 13
          }),
          T(v(e.skill.folder), 1),
          e.skill.read ? (l(), n("span", Re)) : S("", !0)
        ]),
        t("span", Ae, v(e.skill.description), 1),
        t("span", Oe, [
          (l(!0), n(R, null, V(h.value, (o) => (l(), n("span", {
            key: o,
            class: "group"
          }, v(o), 1))), 128))
        ])
      ], 8, Ce),
      I(re, {
        folder: e.skill.folder,
        required: e.skill.required,
        busy: e.busy,
        onChange: r[1] || (r[1] = (o) => i("require", e.skill.folder, o))
      }, null, 8, ["folder", "required", "busy"])
    ], 10, xe));
  }
}, Z = /* @__PURE__ */ L(je, [["__scopeId", "data-v-031ec345"]]), Ie = { class: "skill-group" }, Ee = ["aria-expanded"], We = ["aria-expanded", "onClick"], Le = {
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
    return (p, b) => (l(), n("section", Ie, [
      t("button", {
        type: "button",
        class: "group-head",
        "aria-expanded": !i.value || e.searching,
        onClick: b[0] || (b[0] = (k) => i.value = !i.value)
      }, [
        T(v(i.value && !e.searching ? "›" : "⌄") + " " + v(e.title) + " ", 1),
        t("small", null, v(e.skills.length) + ", " + v(e.skills.filter((k) => k.required).length) + " required", 1)
      ], 8, Ee),
      !i.value || e.searching ? (l(), n(R, { key: 0 }, [
        (l(!0), n(R, null, V(o.value, (k) => (l(), M(Z, {
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
          ], 8, We),
          s.value.has(k.name) || e.searching ? (l(!0), n(R, { key: 0 }, V(k.skills, (y) => (l(), M(Z, {
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
}, Ne = /* @__PURE__ */ L(Le, [["__scopeId", "data-v-383c3904"]]), Ve = {
  class: "skills-list",
  "data-skills-catalogue": ""
}, Be = { class: "filters" }, Me = ["aria-pressed", "onClick"], Fe = { class: "skill-list-scroll" }, Pe = {
  key: 1,
  class: "skills-empty"
}, Ue = {
  __name: "SkillsList",
  props: { skills: { type: Array, required: !0 }, opened: { type: String, default: "" }, busy: { type: Array, default: () => [] } },
  emits: ["open", "require"],
  setup(e, { emit: g }) {
    const a = e, h = g, i = j("all"), s = x(() => [...a.skills].sort((k, y) => (y.modified_at || 0) - (k.modified_at || 0))), r = pe(s, { title: (k) => k.folder });
    r.order.value = "title";
    const o = x(() => [{ key: "all", label: "All", count: a.skills.length }, { key: "required", label: "Required", count: a.skills.filter((k) => k.required).length }, { key: "read", label: "Read by the main agent", count: a.skills.filter((k) => k.read).length }]), d = x(() => r.shown.value.filter((k) => ({ all: !0, required: k.required, read: k.read })[i.value])), w = (k) => {
      var y;
      return (y = k.module) != null && y.startsWith("plugin:") ? "plugin" : k.shipped ? "journal" : "project";
    }, p = x(() => [{ key: "journal", title: "From the journal" }, { key: "plugin", title: "From a plugin" }, { key: "project", title: "From this project" }].map((k) => ({ ...k, skills: d.value.filter((y) => w(y) === k.key) })).filter((k) => k.skills.length)), b = x(() => a.skills.length ? r.words.value.trim() ? ["No skill matches", "Try other words."] : i.value === "required" ? ["No skill is required", "Switch on Required beside a skill to make the agent read it at the start."] : ["No skill is read in this conversation", "Skills appear here after the main agent reads them."] : ["No skills are installed", "Add a folder with a SKILL.md file under .agents/skills in this project."]);
    return (k, y) => (l(), n("aside", Ve, [
      I(u(fe), {
        tools: u(r),
        placeholder: "Find a skill"
      }, null, 8, ["tools"]),
      t("div", Be, [
        (l(!0), n(R, null, V(o.value, (f) => (l(), n("button", {
          key: f.key,
          type: "button",
          "aria-pressed": i.value === f.key,
          onClick: (A) => i.value = f.key
        }, [
          T(v(f.label) + " ", 1),
          t("small", null, v(f.count), 1)
        ], 8, Me))), 128))
      ]),
      t("div", Fe, [
        d.value.length ? (l(), n(R, { key: 0 }, [
          y[3] || (y[3] = t("div", { class: "column-head" }, [
            t("span", null, "Skill"),
            t("span", null, "Required")
          ], -1)),
          (l(!0), n(R, null, V(p.value, (f) => (l(), M(Ne, {
            key: f.key,
            title: f.title,
            skills: f.skills,
            opened: e.opened,
            busy: e.busy,
            searching: u(r).filtering.value || i.value !== "all",
            onOpen: y[0] || (y[0] = (A) => h("open", A)),
            onRequire: y[1] || (y[1] = (A, N) => h("require", A, N))
          }, null, 8, ["title", "skills", "opened", "busy", "searching"]))), 128))
        ], 64)) : (l(), n("div", Pe, [
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
}, De = /* @__PURE__ */ L(Ue, [["__scopeId", "data-v-093ffe0e"]]), oe = (e) => String(e || "").replace(/^---\n[\s\S]*?\n---\n+/, ""), Ge = { class: "requirements" }, He = { class: "block-head" }, Ke = { class: "switch-label" }, ze = {
  key: 0,
  class: "choices"
}, Ye = ["value", "disabled"], Je = { key: 0 }, Qe = {
  key: 1,
  class: "again"
}, Xe = ["checked", "disabled"], Ze = {
  __name: "SkillRequirements",
  props: { skill: { type: Object, required: !0 }, busy: Boolean },
  emits: ["change"],
  setup(e, { emit: g }) {
    const a = g, h = (i) => a("change", i ? "all" : "none", !0);
    return (i, s) => (l(), n("section", Ge, [
      t("div", He, [
        s[3] || (s[3] = t("div", null, [
          t("h3", null, "Must the agent read it at the start?"),
          t("p", null, "When a conversation starts, the agent must read this skill before it may do anything else.")
        ], -1)),
        t("span", Ke, [
          s[2] || (s[2] = T("Required ", -1)),
          I(re, {
            folder: e.skill.folder,
            required: e.skill.required,
            busy: e.busy,
            onChange: h
          }, null, 8, ["folder", "required", "busy"])
        ])
      ]),
      e.skill.required ? (l(), n("div", ze, [
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
          ])], 40, Ye)
        ]),
        e.skill.agents === "main" ? (l(), n("p", Je, "The main agent reads it at the start and again after every compaction.")) : (l(), n("label", Qe, [
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
          }, null, 40, Xe)
        ]))
      ])) : S("", !0)
    ]));
  }
}, _e = /* @__PURE__ */ L(Ze, [["__scopeId", "data-v-7c679e99"]]), et = [
  { key: "nudge", value: "nudge", label: "Remind the agent", hint: "A short note only the agent sees. It carries on with its work.", ask: "What to remind the agent of", example: "Add the change to src/CHANGELOG.md in plain words." },
  { key: "instruct", value: "instruct", label: "Tell the agent to do something now", hint: "The agent sees “Do this now:” followed by your text.", ask: "What the agent should do", example: "Stop and ask me before you touch the database." },
  { key: "deny", value: "deny", label: "Block a command or file change", hint: "The command or file change is refused, and the agent is given your reason.", ask: "Reason the agent is given", example: "Never force-push. Ask me first." },
  { key: "skill", value: "skill", label: "Make the agent read a skill", hint: "The agent must read the skill before it continues.", ask: "Which skill the agent must read", example: "journal-plans" }
];
et.filter((e) => !["deny", "skill"].includes(e.value));
const tt = [
  { key: "messages", label: "What you write to the agent" },
  { key: "commands", label: "Commands the agent runs" },
  { key: "files", label: "Files the agent changes" }
], lt = [
  { key: "part", label: "Part of the text", hint: "Capitals ignored" },
  { key: "word", label: "Whole word", hint: "Not part of another word" },
  { key: "pattern", label: "Pattern", hint: "A regular expression" }
], st = [
  { key: "main", value: "main", label: "The main agent" },
  { key: "helper", value: "helper", label: "An agent or helper" }
], _ = [
  { key: "agent", value: "agent", label: "Agent", note: "The main agent or a helper", choices: st },
  { key: "environment", value: "environment", label: "Environment", note: "Only in one environment", example: "main" },
  { key: "fired", value: "fired", label: "How often it has fired", note: "Only the first few times", example: "3" },
  { key: "hours", value: "hours", label: "Hours of the day", note: "From one hour until another", example: "9-17" }
], Q = (e) => `“${e}”`;
function nt(e) {
  const g = e.slice(0, 3).map(Q), a = e.length - 3;
  return a > 0 ? `${g.join(", ")} or ${a} other ${a === 1 ? "phrase" : "phrases"}` : g.length > 1 ? `${g.slice(0, -1).join(", ")} or ${g.at(-1)}` : g[0];
}
const at = {
  skill: (e) => `make the agent read ${e}`,
  nudge: (e) => `remind the agent ${e}`,
  instruct: (e) => `tell the agent to do this now: ${e}`,
  deny: (e) => `block it and tell the agent ${e}`
}, it = {
  every: (e) => `Every ${e.every || "few"} minutes`,
  once: () => "At the time you choose",
  cron: () => "At the scheduled times"
};
function de(e) {
  const g = at[e.action](e.action === "skill" ? Q(e.skill || "the skill") : e.text ? Q(e.text) : "(no text yet)");
  return e.type === "time" ? `${it[e.time](e)}, ${g}.` : e.phrases.length ? `When ${nt(e.phrases)} appears, ${g}.` : "Add the words to watch for and choose what happens.";
}
const rt = {
  key: 0,
  class: "waiting"
}, ot = { key: 0 }, dt = ["disabled"], ut = ["disabled"], ct = ["disabled", "aria-label"], gt = {
  __name: "SkillTriggerCard",
  props: { trigger: { type: Object, required: !0 }, busy: Boolean },
  emits: ["edit", "run"],
  setup(e, { emit: g }) {
    const a = e, h = g, i = x(() => de(a.trigger));
    return (s, r) => (l(), n("article", {
      class: Y(["skill-trigger-card", { paused: e.trigger.paused_at }])
    }, [
      t("p", null, v(i.value), 1),
      e.trigger.needs_enabling ? (l(), n("p", rt, "An agent made this trigger. It does nothing until you turn it on.")) : S("", !0),
      t("footer", null, [
        t("span", null, v(e.trigger.fired_count ? `Fired ${e.trigger.fired_count} times` : "Not fired yet"), 1),
        e.trigger.paused_at ? (l(), n("span", ot, "Paused")) : S("", !0),
        r[3] || (r[3] = t("span", { class: "push" }, null, -1)),
        t("button", {
          type: "button",
          disabled: e.busy,
          onClick: r[0] || (r[0] = (o) => h("edit", e.trigger))
        }, "Edit", 8, dt),
        e.trigger.needs_enabling ? (l(), n("button", {
          key: 1,
          type: "button",
          disabled: e.busy,
          onClick: r[1] || (r[1] = (o) => h("run", ["trigger", "enable", String(e.trigger.id)]))
        }, "Turn it on", 8, ut)) : (l(), n("button", {
          key: 2,
          type: "button",
          disabled: e.busy,
          "aria-label": e.trigger.paused_at ? "Resume this trigger" : "Pause this trigger",
          onClick: r[2] || (r[2] = (o) => h("run", ["trigger", "pause", String(e.trigger.id), ...e.trigger.paused_at ? ["--off"] : []]))
        }, v(e.trigger.paused_at ? "Resume" : "Pause"), 9, ct))
      ])
    ], 2));
  }
}, ue = /* @__PURE__ */ L(gt, [["__scopeId", "data-v-8f3251db"]]), kt = { class: "tiles" }, mt = ["onClick"], ht = {
  __name: "TriggerTiles",
  props: /* @__PURE__ */ J({ options: { type: Array, required: !0 }, mark: { type: String, required: !0 } }, {
    modelValue: { type: String, required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const g = G(e, "modelValue");
    return (a, h) => (l(), n("div", kt, [
      (l(!0), n(R, null, V(e.options, (i) => (l(), n("button", ge({
        key: i.key,
        type: "button",
        class: ["tile", { picked: g.value === i.key }]
      }, { ref_for: !0 }, { [`data-${e.mark}`]: i.key }, {
        onClick: (s) => g.value = i.key
      }), [
        t("b", null, v(i.label), 1),
        t("span", null, v(i.hint), 1)
      ], 16, mt))), 128))
    ]));
  }
}, vt = /* @__PURE__ */ L(ht, [["__scopeId", "data-v-eb4da38d"]]), yt = { class: "words" }, pt = ["aria-label", "onClick"], ft = ["onKeydown"], bt = {
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
    return (o, d) => (l(), n("div", yt, [
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
        ], 8, pt)
      ]))), 128)),
      K(t("input", {
        "onUpdate:modelValue": d[0] || (d[0] = (w) => i.value = w),
        class: "word-input",
        placeholder: "Add a word, then Enter",
        "aria-label": "Add a word",
        "data-trigger-word": "",
        onKeydown: ke(te(s, ["prevent"]), ["enter"]),
        onBlur: s
      }, null, 40, ft), [
        [z, i.value]
      ])
    ]));
  }
}, $t = /* @__PURE__ */ L(bt, [["__scopeId", "data-v-7a597156"]]), wt = { class: "field" }, qt = { class: "field" }, St = ["checked", "data-trigger-place", "onChange"], xt = { class: "field" }, Ct = {
  key: 0,
  class: "pattern-limit",
  "data-trigger-pattern-limit": ""
}, Tt = {
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
      t("div", wt, [
        r[2] || (r[2] = t("span", { class: "label" }, "When these words appear", -1)),
        I($t, {
          words: g.value,
          onWords: r[0] || (r[0] = (o) => g.value = o)
        }, null, 8, ["words"])
      ]),
      t("div", qt, [
        r[3] || (r[3] = t("span", { class: "label" }, "Where to look", -1)),
        (l(!0), n(R, null, V(u(tt), (o) => (l(), n("label", {
          key: o.key,
          class: "check"
        }, [
          t("input", {
            type: "checkbox",
            checked: a.value.includes(o.key),
            "data-trigger-place": o.key,
            onChange: (d) => i(o.key)
          }, null, 40, St),
          T(v(o.label), 1)
        ]))), 128))
      ]),
      t("div", xt, [
        r[4] || (r[4] = t("span", { class: "label" }, "How words match", -1)),
        I(vt, {
          modelValue: h.value,
          "onUpdate:modelValue": r[1] || (r[1] = (o) => h.value = o),
          options: u(lt),
          mark: "trigger-match"
        }, null, 8, ["modelValue", "options"]),
        h.value === "pattern" ? (l(), n("p", Ct, "Patterns have no time limit. A slow pattern can delay every command or file change. Patterns are limited to 200 characters and check only the first 2,000 characters; repeating a repeated group is refused.")) : S("", !0)
      ])
    ], 64));
  }
}, Rt = /* @__PURE__ */ L(Tt, [["__scopeId", "data-v-2e25b9b9"]]), At = { class: "block" }, Ot = {
  key: 0,
  class: "field"
}, jt = { class: "label" }, It = {
  key: 1,
  class: "field"
}, Et = { class: "label" }, Wt = ["placeholder"], Lt = {
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
    return (r, o) => (l(), n("div", At, [
      e.choices ? (l(), n("div", Ot, [
        t("span", jt, v(e.label), 1),
        I(u(ae), {
          label: s.value,
          items: e.choices,
          picked: i.value,
          "data-trigger-choice": "",
          onPick: o[0] || (o[0] = (d) => i.value = d.value)
        }, null, 8, ["label", "items", "picked"])
      ])) : (l(), n("label", It, [
        t("span", Et, v(e.label), 1),
        K(t("input", {
          "onUpdate:modelValue": o[1] || (o[1] = (d) => i.value = d),
          placeholder: e.example,
          "data-trigger-listed": ""
        }, null, 8, Wt), [
          [z, i.value]
        ])
      ])),
      I(u(be), {
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
}, Nt = /* @__PURE__ */ L(Lt, [["__scopeId", "data-v-1a787719"]]), Vt = {
  __name: "TriggerConditionFields",
  props: {
    modelValue: { type: Array, required: !0 },
    modelModifiers: {}
  },
  emits: ["update:modelValue"],
  setup(e) {
    const g = G(e, "modelValue"), a = (r) => _.find((o) => o.value === r.type), h = (r, o) => g.value = g.value.map((d, w) => w === r ? { ...d, value: o } : d), i = (r) => g.value = g.value.filter((o, d) => d !== r), s = (r) => g.value = [...g.value, { type: r.value, value: "" }];
    return (r, o) => (l(), n(R, null, [
      (l(!0), n(R, null, V(g.value, (d, w) => (l(), M(Nt, {
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
}, Bt = {
  key: 0,
  class: "field"
}, Mt = ["value"], Ft = { class: "summary" }, Pt = { class: "field" }, Ut = {
  key: 1,
  class: "trial",
  role: "status"
}, Dt = ["open"], Gt = { class: "more" }, Ht = { class: "field" }, Kt = ["placeholder"], zt = {
  class: "help",
  role: "status"
}, Yt = { class: "actions" }, Jt = ["disabled"], Qt = {
  __name: "SkillTriggerEditor",
  props: { skill: { type: String, default: "" }, trigger: { type: Object, default: null }, skills: { type: Array, required: !0 } },
  emits: ["saved", "cancel"],
  setup(e, { emit: g }) {
    var O, E, F, B, U, P;
    const a = e, h = g, i = se(), s = me({ skill: ((O = a.trigger) == null ? void 0 : O.skill) || a.skill, name: ((E = a.trigger) == null ? void 0 : E.name) || "", phrases: [...((F = a.trigger) == null ? void 0 : F.phrases) || []], places: [...((B = a.trigger) == null ? void 0 : B.watch_places) || ["messages", "commands", "files"]], match: ((U = a.trigger) == null ? void 0 : U.match_mode) || "word", conditions: JSON.parse(((P = a.trigger) == null ? void 0 : P.conditions) || "[]") }), r = j(""), o = j(null), d = j(""), w = j(!1), p = j(!1), b = x(() => s.skill ? s.phrases.length ? s.places.length ? "" : "Choose where to look." : "Add at least one word." : "Choose a skill."), k = x(() => de({ ...s, action: "skill" }));
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
      e.skill ? S("", !0) : (l(), n("label", Bt, [
        $[10] || ($[10] = T("Which skill the agent must read", -1)),
        K(t("select", {
          "onUpdate:modelValue": $[0] || ($[0] = (q) => s.skill = q),
          "aria-label": "Which skill the agent must read"
        }, [
          $[9] || ($[9] = t("option", { value: "" }, "Choose a skill", -1)),
          (l(!0), n(R, null, V(e.skills, (q) => (l(), n("option", {
            key: q.folder,
            value: q.folder
          }, v(q.folder), 9, Mt))), 128))
        ], 512), [
          [he, s.skill]
        ])
      ])),
      I(Rt, {
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
      t("label", Pt, [
        $[12] || ($[12] = T("Try a sentence", -1)),
        K(t("input", {
          "onUpdate:modelValue": $[4] || ($[4] = (q) => r.value = q),
          "aria-label": "Try a sentence",
          placeholder: "For example: take notes about the plan"
        }, null, 512), [
          [z, r.value]
        ])
      ]),
      o.value ? (l(), n("p", Ut, v(o.value.error || (o.value.matches ? "This would fire." : "This would not fire.")), 1)) : S("", !0),
      t("details", {
        open: !!e.trigger
      }, [
        $[14] || ($[14] = t("summary", null, "More choices: its name and when it applies", -1)),
        t("div", Gt, [
          t("label", Ht, [
            $[13] || ($[13] = T("Name", -1)),
            K(t("input", {
              "onUpdate:modelValue": $[5] || ($[5] = (q) => s.name = q),
              "aria-label": "Name",
              placeholder: `Read ${s.skill || "the skill"}`
            }, null, 8, Kt), [
              [z, s.name]
            ])
          ]),
          I(Vt, {
            modelValue: s.conditions,
            "onUpdate:modelValue": $[6] || ($[6] = (q) => s.conditions = q)
          }, null, 8, ["modelValue"])
        ])
      ], 8, Dt),
      t("p", zt, v(d.value || b.value), 1),
      t("div", Yt, [
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
        }, v(e.trigger ? "Save" : "Create trigger"), 9, Jt)
      ])
    ], 32));
  }
}, ce = /* @__PURE__ */ L(Qt, [["__scopeId", "data-v-272d3d66"]]), Xt = { class: "skill-details" }, Zt = { class: "status" }, _t = { class: "block" }, el = { class: "block-head" }, tl = {
  key: 0,
  class: "help"
}, ll = {
  key: 0,
  class: "block"
}, sl = { key: 0 }, nl = { key: 1 }, al = { key: 2 }, il = { class: "block" }, rl = { class: "block-head" }, ol = ["href"], dl = {
  key: 0,
  "data-skill-text": ""
}, ul = {
  key: 1,
  class: "help"
}, cl = {
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
      return l(), n("div", Xt, [
        t("header", null, [
          t("h2", null, [
            T(v(e.skill.folder) + " ", 1),
            t("small", null, v(i.value), 1)
          ]),
          t("p", null, v(e.skill.description), 1)
        ]),
        t("div", Zt, [
          t("span", null, v(s.value), 1),
          e.agent && ((w = e.skill.held) == null ? void 0 : w.state) !== "due" ? (l(), n("button", {
            key: 0,
            type: "button",
            onClick: d[0] || (d[0] = (O) => h("read"))
          }, v(e.skill.read ? "Make the agent read it again" : "Make the agent read it now"), 1)) : S("", !0)
        ]),
        I(_e, {
          skill: e.skill,
          busy: e.busy,
          onChange: d[1] || (d[1] = (O, E) => h("require", O, E))
        }, null, 8, ["skill", "busy"]),
        t("section", _t, [
          t("div", el, [
            d[7] || (d[7] = t("h3", null, "Make the agent read it when your words appear", -1)),
            e.draft ? S("", !0) : (l(), n("button", {
              key: 0,
              type: "button",
              onClick: d[2] || (d[2] = (O) => h("add"))
            }, "Add a trigger"))
          ]),
          !e.triggers.length && !e.draft ? (l(), n("p", tl, "No triggers yet. Add one, and the agent must read this skill as soon as your words appear.")) : S("", !0),
          (l(!0), n(R, null, V(e.triggers, (O) => {
            var E, F;
            return l(), n(R, {
              key: O.id
            }, [
              ((F = (E = e.draft) == null ? void 0 : E.trigger) == null ? void 0 : F.id) !== O.id ? (l(), M(ue, {
                key: 0,
                trigger: O,
                onEdit: d[3] || (d[3] = (B) => h("edit", B)),
                onRun: d[4] || (d[4] = (B) => h("run", B))
              }, null, 8, ["trigger"])) : S("", !0)
            ], 64);
          }), 128)),
          e.draft ? (l(), M(ce, {
            key: ((p = e.draft.trigger) == null ? void 0 : p.id) || e.skill.folder,
            skill: e.skill.folder,
            trigger: e.draft.trigger,
            skills: e.skills,
            onSaved: d[5] || (d[5] = (O) => h("saved")),
            onCancel: d[6] || (d[6] = (O) => h("cancel"))
          }, null, 8, ["skill", "trigger", "skills"])) : S("", !0)
        ]),
        (b = e.skill.keywords) != null && b.length || (k = e.skill.commands) != null && k.length || (y = e.skill.events) != null && y.length ? (l(), n("section", ll, [
          d[11] || (d[11] = t("h3", null, "When the skill itself asks to be read", -1)),
          d[12] || (d[12] = t("p", { class: "help" }, "These come with the skill and cannot be changed here.", -1)),
          t("ul", null, [
            (f = e.skill.keywords) != null && f.length ? (l(), n("li", sl, [
              d[8] || (d[8] = T("When you write ", -1)),
              t("code", null, v(e.skill.keywords.join(", ")), 1)
            ])) : S("", !0),
            (A = e.skill.commands) != null && A.length ? (l(), n("li", nl, [
              d[9] || (d[9] = T("Before it runs a command about ", -1)),
              t("code", null, v(e.skill.commands.join(", ")), 1)
            ])) : S("", !0),
            (N = e.skill.events) != null && N.length ? (l(), n("li", al, [
              d[10] || (d[10] = T("When these changes happen: ", -1)),
              t("code", null, v(e.skill.events.join(", ")), 1)
            ])) : S("", !0)
          ])
        ])) : S("", !0),
        t("section", il, [
          t("div", rl, [
            d[13] || (d[13] = t("h3", null, "What the skill says", -1)),
            r.value ? (l(), n("a", {
              key: 0,
              href: r.value,
              target: "_blank",
              rel: "noopener"
            }, "Open SKILL.md", 8, ol)) : S("", !0)
          ]),
          e.text ? (l(), n("div", dl, [
            I(u(ie), {
              text: u(oe)(e.text.text),
              "row-names": !1
            }, null, 8, ["text"])
          ])) : (l(), n("p", ul, "Reading the skill…"))
        ])
      ]);
    };
  }
}, gl = /* @__PURE__ */ L(cl, [["__scopeId", "data-v-4f1bf52d"]]), kl = { class: "skills" }, ml = { class: "skills-title" }, hl = {
  class: "skills-text",
  "data-skill-text": ""
}, vl = {
  __name: "SkillText",
  props: { skill: { type: Object, default: null }, failure: { type: String, default: "" }, back: { type: Boolean, default: !0 } },
  emits: ["back"],
  setup(e, { emit: g }) {
    const a = g;
    return (h, i) => (l(), n("div", kl, [
      e.back ? (l(), n("button", {
        key: 0,
        type: "button",
        class: "skills-back",
        onClick: i[0] || (i[0] = (s) => a("back"))
      }, "Back to skills")) : S("", !0),
      t("h3", ml, v(e.skill ? e.skill.folder : ""), 1),
      t("div", hl, [
        I(u(ie), {
          text: e.skill ? u(oe)(e.skill.text) : e.failure,
          "row-names": !1
        }, null, 8, ["text"])
      ])
    ]));
  }
}, yl = /* @__PURE__ */ L(vl, [["__scopeId", "data-v-d6cfa5ab"]]), pl = { class: "page-head" }, fl = { "aria-label": "Skills views" }, bl = ["aria-pressed"], $l = ["aria-pressed"], wl = {
  key: 0,
  class: "warning",
  role: "status"
}, ql = {
  key: 1,
  class: "warning",
  role: "alert"
}, Sl = {
  key: 2,
  class: "empty"
}, xl = {
  key: 3,
  class: "panes"
}, Cl = { class: "skill-pane" }, Tl = {
  key: 0,
  class: "empty"
}, Rl = {
  key: 2,
  class: "empty centre"
}, Al = {
  key: 4,
  class: "panes"
}, Ol = { class: "triggers-list" }, jl = {
  key: 0,
  class: "trigger-cards"
}, Il = {
  key: 1,
  class: "empty"
}, El = { class: "skill-pane trigger-pane" }, Wl = {
  key: 0,
  class: "trigger-form"
}, Ll = {
  key: 1,
  class: "empty centre"
}, Nl = {
  __name: "SkillRows",
  setup(e) {
    const { skills: g, selected: a, selectedTriggers: h, triggers: i, requirements: s, mainAgent: r, answered: o, failure: d, busy: w, opened: p, text: b, openFailure: k, tab: y, draft: f, marked: A, load: N, open: O, run: E, requireSkill: F, readNow: B } = we(), U = (c, m) => F(c, m ? "all" : "none"), P = () => f.value = { trigger: null }, W = (c) => f.value = { trigger: c }, $ = async () => {
      f.value = null, await N();
    }, q = (c) => {
      y.value = c, f.value = null;
    };
    return (c, m) => (l(), M(u($e), { padding: "0" }, {
      default: le(() => {
        var D;
        return [
          u(A) ? (l(), M(yl, {
            key: 0,
            skill: u(b),
            failure: u(k),
            back: !1
          }, null, 8, ["skill", "failure"])) : (l(), n("main", {
            key: 1,
            class: Y(["skills-page", { "skill-open": u(y) === "skills" && !!u(p), "trigger-open": u(y) === "triggers" && !!u(f) }])
          }, [
            t("header", pl, [
              m[8] || (m[8] = t("div", null, [
                t("h1", null, "Skills"),
                t("p", null, "Instructions the agent reads before starting work. Choose which skills the agent must read, and when. These settings apply to the whole project.")
              ], -1)),
              t("nav", fl, [
                t("button", {
                  type: "button",
                  "aria-pressed": u(y) === "skills",
                  onClick: m[0] || (m[0] = (C) => q("skills"))
                }, "Skills", 8, bl),
                t("button", {
                  type: "button",
                  "aria-pressed": u(y) === "triggers",
                  onClick: m[1] || (m[1] = (C) => q("triggers"))
                }, "Triggers", 8, $l)
              ])
            ]),
            u(s).environment_overrides ? (l(), n("p", wl, "This environment uses separate skill lists. Changes here apply to the whole project. The environment lists still take priority.")) : S("", !0),
            u(d) ? (l(), n("div", ql, [
              T(v(u(d)) + " ", 1),
              t("button", {
                type: "button",
                onClick: m[2] || (m[2] = (...C) => u(N) && u(N)(...C))
              }, "Try again")
            ])) : S("", !0),
            u(o) ? u(y) === "skills" ? (l(), n("div", xl, [
              I(De, {
                skills: u(g),
                opened: u(p),
                busy: u(w),
                onOpen: u(O),
                onRequire: U
              }, null, 8, ["skills", "opened", "busy", "onOpen"]),
              t("article", Cl, [
                t("button", {
                  type: "button",
                  class: "phone-back",
                  onClick: m[3] || (m[3] = (C) => u(O)(""))
                }, "Back to skills"),
                u(k) ? (l(), n("div", Tl, [
                  m[9] || (m[9] = t("strong", null, "Could not read this skill", -1)),
                  t("p", null, v(u(k)), 1),
                  t("button", {
                    type: "button",
                    onClick: m[4] || (m[4] = (C) => u(O)(u(p), !1))
                  }, "Try again")
                ])) : u(a) ? (l(), M(gl, {
                  key: 1,
                  skill: u(a),
                  text: u(b),
                  triggers: u(h),
                  skills: u(g),
                  agent: u(r),
                  draft: u(f),
                  busy: u(w).includes(u(p)),
                  onRequire: m[5] || (m[5] = (C, H) => u(F)(u(p), C, H)),
                  onRead: u(B),
                  onAdd: P,
                  onEdit: W,
                  onRun: u(E),
                  onSaved: $,
                  onCancel: m[6] || (m[6] = (C) => f.value = null)
                }, null, 8, ["skill", "text", "triggers", "skills", "agent", "draft", "busy", "onRead", "onRun"])) : (l(), n("div", Rl, [...m[10] || (m[10] = [
                  t("strong", null, "Choose a skill to read what it says", -1),
                  t("p", null, "Switch on Required to make the agent read a skill at the start. Open a skill to add words that make the agent read it later.", -1)
                ])]))
              ])
            ])) : (l(), n("div", Al, [
              t("aside", Ol, [
                t("div", { class: "trigger-head" }, [
                  m[11] || (m[11] = t("p", null, "Triggers that make an agent read a skill. Other triggers stay under Triggers.", -1)),
                  t("button", {
                    type: "button",
                    onClick: P
                  }, "Add a trigger")
                ]),
                u(i).length ? (l(), n("div", jl, [
                  (l(!0), n(R, null, V(u(i), (C) => (l(), M(ue, {
                    key: C.id,
                    trigger: C,
                    onEdit: W,
                    onRun: u(E)
                  }, null, 8, ["trigger", "onRun"]))), 128))
                ])) : (l(), n("div", Il, [
                  m[12] || (m[12] = t("strong", null, "You have no triggers yet", -1)),
                  m[13] || (m[13] = t("p", null, "A trigger makes the agent read a skill as soon as your words appear.", -1)),
                  t("button", {
                    type: "button",
                    onClick: P
                  }, "Add a trigger")
                ]))
              ]),
              t("article", El, [
                u(f) ? (l(), n("div", Wl, [
                  (l(), M(ce, {
                    key: ((D = u(f).trigger) == null ? void 0 : D.id) || "new",
                    trigger: u(f).trigger,
                    skills: u(g),
                    onSaved: $,
                    onCancel: m[7] || (m[7] = (C) => f.value = null)
                  }, null, 8, ["trigger", "skills"]))
                ])) : (l(), n("div", Ll, [...m[14] || (m[14] = [
                  t("strong", null, "Choose Edit on a trigger to change it", -1),
                  t("p", null, "Or add a new one. Each trigger makes the agent read one skill.", -1)
                ])]))
              ])
            ])) : (l(), n("p", Sl, "Reading the skills…"))
          ], 2))
        ];
      }),
      _: 1
    }));
  }
}, Ml = /* @__PURE__ */ L(Nl, [["__scopeId", "data-v-d59c26e6"]]);
export {
  Ml as S
};
