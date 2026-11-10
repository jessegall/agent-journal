import { computed as x, ref as L, watch as X, onUnmounted as ee, openBlock as l, createElementBlock as n, normalizeClass as z, createElementVNode as t, createVNode as j, unref as u, createTextVNode as R, toDisplayString as p, createCommentVNode as S, Fragment as A, renderList as V, createBlock as M, useModel as G, mergeProps as ge, mergeModels as J, withDirectives as K, withKeys as ke, withModifiers as te, vModelText as Y, withCtx as le, reactive as me, vModelSelect as he } from "vue";
import { useWindow as se, coalesced as ve, READ_RATES as ye, Icon as ne, useListTools as pe, ListTools as fe, DropList as ae, Btn as be, TextDisplay as ie, WindowRoom as $e } from "@journal/window-kit";
function we() {
  const e = se(), { rows: k } = e.props.catalogue, { rows: a } = e.props.loaded, { rows: y } = e.props.triggers, i = x(() => e.props.requirements.data.value ?? { session_start: [], after_compaction: [], main_agent: [], environment_overrides: !1 }), s = x(() => {
    var g;
    return ((g = e.props["main-agent"].data.value) == null ? void 0 : g.id) ?? null;
  }), r = x(() => e.props.catalogue.loaded.value && e.props.requirements.loaded.value && e.props.triggers.loaded.value), o = L(""), d = x(() => o.value || ["catalogue", "requirements", "triggers", "loaded"].map((g) => e.props[g].failure.value).find(Boolean) || ""), b = L([]), w = L(""), I = L(null), m = L("");
  e.state.tab = "skills";
  const c = x({ get: () => e.state.tab, set: (g) => e.state.tab = g }), v = L(null), q = e.option("row");
  let O = 0;
  const C = x(() => k.value.map((g) => {
    const h = a.value.find((D) => D.skill === g.folder);
    return {
      ...g,
      required: i.value.session_start.includes(g.folder) || i.value.main_agent.includes(g.folder),
      agents: i.value.main_agent.includes(g.folder) ? "main" : "all",
      again: i.value.after_compaction.includes(g.folder),
      held: h,
      read: (h == null ? void 0 : h.state) === "loaded",
      changed: (h == null ? void 0 : h.state) === "loaded" && h.digest !== g.digest
    };
  })), E = x(() => C.value.find((g) => g.folder === w.value)), F = x(() => y.value.filter((g) => g.skill === w.value));
  async function B() {
    await e.reload({ only: ["main-agent", "catalogue", "requirements", "triggers", ...s.value ? ["loaded"] : []] });
  }
  X(s, async (g) => {
    a.value = [], g && (e.state["loaded.agent"] = String(g), await e.reload("loaded"));
  });
  async function U(g, h = !0) {
    if (w.value = g, I.value = null, m.value = "", v.value = null, h && !q.value) {
      const H = new URL(location.href);
      g ? H.searchParams.set("skill", g) : H.searchParams.delete("skill"), history.pushState(null, "", H);
    }
    const D = ++O;
    if (!g) return;
    e.state["text.folder"] = g;
    const T = await e.readKey("text");
    D === O && (I.value = T.ok ? T.value : null, m.value = T.ok ? "" : T.failure === "refused" ? `The skill ${g} is no longer available.` : T.error);
  }
  async function P(g) {
    const h = await e.run(g);
    return o.value = h.ok ? "" : h.error, h.ok && await B(), h.ok;
  }
  async function W(g, h, D = !0) {
    b.value.includes(g) || (b.value = [...b.value, g], await P(["skill", "set-required", g, "--agents", h, ...D ? [] : ["--no-after-compaction"]]), b.value = b.value.filter((T) => T !== g));
  }
  async function f() {
    if (!s.value || !E.value) return;
    const g = E.value.held;
    await P((g == null ? void 0 : g.state) === "loaded" ? ["agent-skill", "reset", String(g.id)] : ["skill", "require", String(s.value), w.value]);
  }
  const $ = () => U(new URLSearchParams(location.search).get("skill") || "", !1);
  return window.addEventListener("popstate", $), ee(() => window.removeEventListener("popstate", $)), e.follow(["agent_skill.*"], ve(() => {
    s.value && e.reload("loaded");
  }, ye.openPanel)), q.value ? e.readKey(`agent-skill.${q.value.skillId ?? q.value.id}`).then((g) => g.ok ? U(g.value.skill, !1) : m.value = g.error) : $(), { skills: C, selected: E, selectedTriggers: F, triggers: y, requirements: i, mainAgent: s, answered: r, failure: d, busy: b, opened: w, text: I, openFailure: m, tab: c, draft: v, marked: q, load: B, open: U, run: P, requireSkill: W, readNow: f };
}
const N = (e, k) => {
  const a = e.__vccOpts || e;
  for (const [y, i] of k)
    a[y] = i;
  return a;
}, qe = ["aria-checked", "aria-label", "disabled"], Se = {
  __name: "RequiredSkillSwitch",
  props: { folder: { type: String, required: !0 }, required: Boolean, busy: Boolean },
  emits: ["change"],
  setup(e, { emit: k }) {
    const a = k;
    return (y, i) => (l(), n("button", {
      type: "button",
      role: "switch",
      "aria-checked": e.required,
      "aria-label": `${e.required ? "Stop requiring" : "Require"} ${e.folder} at the start`,
      disabled: e.busy,
      class: z(["required-switch", { on: e.required }]),
      onClick: i[0] || (i[0] = (s) => a("change", !e.required))
    }, [...i[1] || (i[1] = [
      t("span", null, null, -1)
    ])], 10, qe));
  }
}, re = /* @__PURE__ */ N(Se, [["__scopeId", "data-v-ee9d0e40"]]), xe = ["data-skill"], Ce = ["aria-label"], Te = { class: "name-line" }, Re = {
  key: 0,
  class: "read-dot",
  title: "Read by the main agent"
}, Ae = { class: "description" }, Oe = {
  class: "groups",
  "data-skill-groups": ""
}, Ie = {
  __name: "SkillListItem",
  props: { skill: { type: Object, required: !0 }, selected: Boolean, busy: Boolean },
  emits: ["open", "require"],
  setup(e, { emit: k }) {
    const a = e, y = x(() => {
      var s;
      return (s = a.skill.groups) != null && s.length ? a.skill.groups : ["Main agent"];
    }), i = k;
    return (s, r) => (l(), n("div", {
      class: z(["skill-list-item", { selected: e.selected }]),
      "data-skill": e.skill.folder
    }, [
      t("button", {
        type: "button",
        class: "skill-name",
        "aria-label": e.skill.folder,
        onClick: r[0] || (r[0] = (o) => i("open", e.skill.folder))
      }, [
        t("span", Te, [
          j(u(ne), {
            name: "book",
            size: 13
          }),
          R(p(e.skill.folder), 1),
          e.skill.read ? (l(), n("span", Re)) : S("", !0)
        ]),
        t("span", Ae, p(e.skill.description), 1),
        t("span", Oe, [
          (l(!0), n(A, null, V(y.value, (o) => (l(), n("span", {
            key: o,
            class: "group"
          }, p(o), 1))), 128))
        ])
      ], 8, Ce),
      j(re, {
        folder: e.skill.folder,
        required: e.skill.required,
        busy: e.busy,
        onChange: r[1] || (r[1] = (o) => i("require", e.skill.folder, o))
      }, null, 8, ["folder", "required", "busy"])
    ], 10, xe));
  }
}, Z = /* @__PURE__ */ N(Ie, [["__scopeId", "data-v-031ec345"]]), Le = { class: "skill-group" }, je = ["aria-expanded"], Ee = ["aria-expanded", "onClick"], We = 3, Ne = {
  __name: "SkillListGroup",
  props: { title: { type: String, required: !0 }, skills: { type: Array, required: !0 }, opened: { type: String, default: "" }, busy: { type: Array, default: () => [] }, searching: Boolean },
  emits: ["open", "require"],
  setup(e, { emit: k }) {
    const a = e, y = k, i = L(!1), s = L(/* @__PURE__ */ new Set()), r = (m) => {
      var c;
      return ((c = m.folder.match(/^[^-]+-[^-]+(?=-)/)) == null ? void 0 : c[0]) || "";
    }, o = x(() => a.skills.reduce((m, c) => m.set(r(c), (m.get(r(c)) || 0) + 1), /* @__PURE__ */ new Map())), d = (m) => o.value.get(r(m)) >= We ? r(m) : "", b = x(() => a.skills.filter((m) => !d(m))), w = x(() => [...new Set(a.skills.map(d).filter(Boolean))].map((m) => ({ name: m, skills: a.skills.filter((c) => d(c) === m) }))), I = (m) => {
      const c = new Set(s.value);
      c.has(m) ? c.delete(m) : c.add(m), s.value = c;
    };
    return (m, c) => (l(), n("section", Le, [
      t("button", {
        type: "button",
        class: "group-head",
        "aria-expanded": !i.value || e.searching,
        onClick: c[0] || (c[0] = (v) => i.value = !i.value)
      }, [
        R(p(i.value && !e.searching ? "›" : "⌄") + " " + p(e.title) + " ", 1),
        t("small", null, p(e.skills.length) + ", " + p(e.skills.filter((v) => v.required).length) + " required", 1)
      ], 8, je),
      !i.value || e.searching ? (l(), n(A, { key: 0 }, [
        (l(!0), n(A, null, V(b.value, (v) => (l(), M(Z, {
          key: v.folder,
          skill: v,
          selected: e.opened === v.folder,
          busy: e.busy.includes(v.folder),
          onOpen: c[1] || (c[1] = (q) => y("open", q)),
          onRequire: c[2] || (c[2] = (q, O) => y("require", q, O))
        }, null, 8, ["skill", "selected", "busy"]))), 128)),
        (l(!0), n(A, null, V(w.value, (v) => (l(), n(A, {
          key: v.name
        }, [
          t("button", {
            type: "button",
            class: "group-head family",
            "aria-expanded": s.value.has(v.name) || e.searching,
            onClick: (q) => I(v.name)
          }, [
            R(p(s.value.has(v.name) || e.searching ? "⌄" : "›") + " " + p(v.name) + " ", 1),
            t("small", null, p(v.skills.length), 1)
          ], 8, Ee),
          s.value.has(v.name) || e.searching ? (l(!0), n(A, { key: 0 }, V(v.skills, (q) => (l(), M(Z, {
            key: q.folder,
            skill: q,
            selected: e.opened === q.folder,
            busy: e.busy.includes(q.folder),
            onOpen: c[3] || (c[3] = (O) => y("open", O)),
            onRequire: c[4] || (c[4] = (O, C) => y("require", O, C))
          }, null, 8, ["skill", "selected", "busy"]))), 128)) : S("", !0)
        ], 64))), 128))
      ], 64)) : S("", !0)
    ]));
  }
}, Ve = /* @__PURE__ */ N(Ne, [["__scopeId", "data-v-968fab13"]]), Be = {
  class: "skills-list",
  "data-skills-catalogue": ""
}, Me = { class: "filters" }, Fe = ["aria-pressed", "onClick"], Pe = { class: "skill-list-scroll" }, Ue = {
  key: 1,
  class: "skills-empty"
}, De = {
  __name: "SkillsList",
  props: { skills: { type: Array, required: !0 }, opened: { type: String, default: "" }, busy: { type: Array, default: () => [] } },
  emits: ["open", "require"],
  setup(e, { emit: k }) {
    const a = e, y = k, i = L("all"), s = x(() => [...a.skills].sort((m, c) => (c.modified_at || 0) - (m.modified_at || 0))), r = pe(s, { title: (m) => m.folder });
    r.order.value = "title";
    const o = x(() => [{ key: "all", label: "All", count: a.skills.length }, { key: "required", label: "Required", count: a.skills.filter((m) => m.required).length }, { key: "read", label: "Read by the main agent", count: a.skills.filter((m) => m.read).length }]), d = x(() => r.shown.value.filter((m) => ({ all: !0, required: m.required, read: m.read })[i.value])), b = (m) => {
      var c;
      return (c = m.module) != null && c.startsWith("plugin:") ? "plugin" : m.shipped ? "journal" : "project";
    }, w = x(() => [{ key: "journal", title: "From the journal" }, { key: "plugin", title: "From a plugin" }, { key: "project", title: "From this project" }].map((m) => ({ ...m, skills: d.value.filter((c) => b(c) === m.key) })).filter((m) => m.skills.length)), I = x(() => a.skills.length ? r.words.value.trim() ? ["No skill matches", "Try other words."] : i.value === "required" ? ["No skill is required", "Switch on Required beside a skill to make the agent read it at the start."] : ["No skill is read in this conversation", "Skills appear here after the main agent reads them."] : ["No skills are installed", "Add a folder with a SKILL.md file under .agents/skills in this project."]);
    return (m, c) => (l(), n("aside", Be, [
      j(u(fe), {
        tools: u(r),
        placeholder: "Find a skill"
      }, null, 8, ["tools"]),
      t("div", Me, [
        (l(!0), n(A, null, V(o.value, (v) => (l(), n("button", {
          key: v.key,
          type: "button",
          "aria-pressed": i.value === v.key,
          onClick: (q) => i.value = v.key
        }, [
          R(p(v.label) + " ", 1),
          t("small", null, p(v.count), 1)
        ], 8, Fe))), 128))
      ]),
      t("div", Pe, [
        d.value.length ? (l(), n(A, { key: 0 }, [
          c[3] || (c[3] = t("div", { class: "column-head" }, [
            t("span", null, "Skill"),
            t("span", null, "Required")
          ], -1)),
          (l(!0), n(A, null, V(w.value, (v) => (l(), M(Ve, {
            key: v.key,
            title: v.title,
            skills: v.skills,
            opened: e.opened,
            busy: e.busy,
            searching: u(r).filtering.value || i.value !== "all",
            onOpen: c[0] || (c[0] = (q) => y("open", q)),
            onRequire: c[1] || (c[1] = (q, O) => y("require", q, O))
          }, null, 8, ["title", "skills", "opened", "busy", "searching"]))), 128))
        ], 64)) : (l(), n("div", Ue, [
          t("strong", null, p(I.value[0]), 1),
          t("p", null, p(I.value[1]), 1),
          u(r).words.value ? (l(), n("button", {
            key: 0,
            type: "button",
            onClick: c[2] || (c[2] = (v) => u(r).words.value = "")
          }, "Clear the search")) : S("", !0)
        ]))
      ])
    ]));
  }
}, Ge = /* @__PURE__ */ N(De, [["__scopeId", "data-v-093ffe0e"]]), oe = (e) => String(e || "").replace(/^---\n[\s\S]*?\n---\n+/, ""), He = { class: "requirements" }, Ke = { class: "block-head" }, Ye = { class: "switch-label" }, ze = {
  key: 0,
  class: "choices"
}, Je = ["value", "disabled"], Qe = { key: 0 }, Xe = {
  key: 1,
  class: "again"
}, Ze = ["checked", "disabled"], _e = {
  __name: "SkillRequirements",
  props: { skill: { type: Object, required: !0 }, busy: Boolean },
  emits: ["change"],
  setup(e, { emit: k }) {
    const a = k, y = (i) => a("change", i ? "all" : "none", !0);
    return (i, s) => (l(), n("section", He, [
      t("div", Ke, [
        s[3] || (s[3] = t("div", null, [
          t("h3", null, "Must the agent read it at the start?"),
          t("p", null, "When a conversation starts, the agent must read this skill before it may do anything else.")
        ], -1)),
        t("span", Ye, [
          s[2] || (s[2] = R("Required ", -1)),
          j(re, {
            folder: e.skill.folder,
            required: e.skill.required,
            busy: e.busy,
            onChange: y
          }, null, 8, ["folder", "required", "busy"])
        ])
      ]),
      e.skill.required ? (l(), n("div", ze, [
        t("label", null, [
          s[5] || (s[5] = R("Which agents must read it", -1)),
          t("select", {
            value: e.skill.agents,
            "aria-label": "Which agents must read it",
            disabled: e.busy,
            onChange: s[0] || (s[0] = (r) => a("change", r.target.value, e.skill.again))
          }, [...s[4] || (s[4] = [
            t("option", { value: "all" }, "Every agent", -1),
            t("option", { value: "main" }, "Only the main agent", -1)
          ])], 40, Je)
        ]),
        e.skill.agents === "main" ? (l(), n("p", Qe, "The main agent reads it at the start and again after every compaction.")) : (l(), n("label", Xe, [
          s[6] || (s[6] = t("span", null, [
            R("Read it again after the conversation is compacted"),
            t("small", null, "Compacting empties what the agent has read.")
          ], -1)),
          t("input", {
            type: "checkbox",
            checked: e.skill.again,
            disabled: e.busy,
            "aria-label": "Read it again after the conversation is compacted",
            onChange: s[1] || (s[1] = (r) => a("change", e.skill.agents, r.target.checked))
          }, null, 40, Ze)
        ]))
      ])) : S("", !0)
    ]));
  }
}, et = /* @__PURE__ */ N(_e, [["__scopeId", "data-v-7c679e99"]]), tt = [
  { key: "nudge", value: "nudge", label: "Remind the agent", hint: "A short note only the agent sees. It carries on with its work.", ask: "What to remind the agent of", example: "Add the change to src/CHANGELOG.md in plain words." },
  { key: "instruct", value: "instruct", label: "Tell the agent to do something now", hint: "The agent sees “Do this now:” followed by your text.", ask: "What the agent should do", example: "Stop and ask me before you touch the database." },
  { key: "deny", value: "deny", label: "Block a command or file change", hint: "The command or file change is refused, and the agent is given your reason.", ask: "Reason the agent is given", example: "Never force-push. Ask me first." },
  { key: "skill", value: "skill", label: "Make the agent read a skill", hint: "The agent must read the skill before it continues.", ask: "Which skill the agent must read", example: "journal-plans" }
];
tt.filter((e) => !["deny", "skill"].includes(e.value));
const lt = [
  { key: "messages", label: "What you write to the agent" },
  { key: "commands", label: "Commands the agent runs" },
  { key: "files", label: "Files the agent changes" }
], st = [
  { key: "part", label: "Part of the text", hint: "Capitals ignored" },
  { key: "word", label: "Whole word", hint: "Not part of another word" },
  { key: "pattern", label: "Pattern", hint: "A regular expression" }
], nt = [
  { key: "main", value: "main", label: "The main agent" },
  { key: "helper", value: "helper", label: "An agent or helper" }
], _ = [
  { key: "agent", value: "agent", label: "Agent", note: "The main agent or a helper", choices: nt },
  { key: "environment", value: "environment", label: "Environment", note: "Only in one environment", example: "main" },
  { key: "fired", value: "fired", label: "How often it has fired", note: "Only the first few times", example: "3" },
  { key: "hours", value: "hours", label: "Hours of the day", note: "From one hour until another", example: "9-17" }
], Q = (e) => `“${e}”`;
function at(e) {
  const k = e.slice(0, 3).map(Q), a = e.length - 3;
  return a > 0 ? `${k.join(", ")} or ${a} other ${a === 1 ? "phrase" : "phrases"}` : k.length > 1 ? `${k.slice(0, -1).join(", ")} or ${k.at(-1)}` : k[0];
}
const it = {
  skill: (e) => `make the agent read ${e}`,
  nudge: (e) => `remind the agent ${e}`,
  instruct: (e) => `tell the agent to do this now: ${e}`,
  deny: (e) => `block it and tell the agent ${e}`
}, rt = {
  every: (e) => `Every ${e.every || "few"} minutes`,
  once: () => "At the time you choose",
  cron: () => "At the scheduled times"
};
function de(e) {
  const k = it[e.action](e.action === "skill" ? Q(e.skill || "the skill") : e.text ? Q(e.text) : "(no text yet)");
  return e.type === "time" ? `${rt[e.time](e)}, ${k}.` : e.phrases.length ? `When ${at(e.phrases)} appears, ${k}.` : "Add the words to watch for and choose what happens.";
}
const ot = {
  key: 0,
  class: "waiting"
}, dt = { key: 0 }, ut = ["disabled"], ct = ["disabled"], gt = ["disabled", "aria-label"], kt = {
  __name: "SkillTriggerCard",
  props: { trigger: { type: Object, required: !0 }, busy: Boolean },
  emits: ["edit", "run"],
  setup(e, { emit: k }) {
    const a = e, y = k, i = x(() => de(a.trigger));
    return (s, r) => (l(), n("article", {
      class: z(["skill-trigger-card", { paused: e.trigger.paused_at }])
    }, [
      t("p", null, p(i.value), 1),
      e.trigger.needs_enabling ? (l(), n("p", ot, "An agent made this trigger. It does nothing until you turn it on.")) : S("", !0),
      t("footer", null, [
        t("span", null, p(e.trigger.fired_count ? `Fired ${e.trigger.fired_count} times` : "Not fired yet"), 1),
        e.trigger.paused_at ? (l(), n("span", dt, "Paused")) : S("", !0),
        r[3] || (r[3] = t("span", { class: "push" }, null, -1)),
        t("button", {
          type: "button",
          disabled: e.busy,
          onClick: r[0] || (r[0] = (o) => y("edit", e.trigger))
        }, "Edit", 8, ut),
        e.trigger.needs_enabling ? (l(), n("button", {
          key: 1,
          type: "button",
          disabled: e.busy,
          onClick: r[1] || (r[1] = (o) => y("run", ["trigger", "enable", String(e.trigger.id)]))
        }, "Turn it on", 8, ct)) : (l(), n("button", {
          key: 2,
          type: "button",
          disabled: e.busy,
          "aria-label": e.trigger.paused_at ? "Resume this trigger" : "Pause this trigger",
          onClick: r[2] || (r[2] = (o) => y("run", ["trigger", "pause", String(e.trigger.id), ...e.trigger.paused_at ? ["--off"] : []]))
        }, p(e.trigger.paused_at ? "Resume" : "Pause"), 9, gt))
      ])
    ], 2));
  }
}, ue = /* @__PURE__ */ N(kt, [["__scopeId", "data-v-8f3251db"]]), mt = { class: "tiles" }, ht = ["onClick"], vt = {
  __name: "TriggerTiles",
  props: /* @__PURE__ */ J({ options: { type: Array, required: !0 }, mark: { type: String, required: !0 } }, {
    modelValue: { type: String, required: !0 },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e) {
    const k = G(e, "modelValue");
    return (a, y) => (l(), n("div", mt, [
      (l(!0), n(A, null, V(e.options, (i) => (l(), n("button", ge({
        key: i.key,
        type: "button",
        class: ["tile", { picked: k.value === i.key }]
      }, { ref_for: !0 }, { [`data-${e.mark}`]: i.key }, {
        onClick: (s) => k.value = i.key
      }), [
        t("b", null, p(i.label), 1),
        t("span", null, p(i.hint), 1)
      ], 16, ht))), 128))
    ]));
  }
}, yt = /* @__PURE__ */ N(vt, [["__scopeId", "data-v-eb4da38d"]]), pt = { class: "words" }, ft = ["aria-label", "onClick"], bt = ["onKeydown"], $t = {
  __name: "WatchedWords",
  props: { words: { type: Array, required: !0 } },
  emits: ["words"],
  setup(e, { emit: k }) {
    const a = e, y = k, i = L("");
    function s() {
      const o = i.value.trim();
      i.value = "", o && !a.words.includes(o) && y("words", [...a.words, o]);
    }
    const r = (o) => y("words", a.words.filter((d) => d !== o));
    return (o, d) => (l(), n("div", pt, [
      (l(!0), n(A, null, V(e.words, (b) => (l(), n("span", {
        key: b,
        class: "word"
      }, [
        R(p(b) + " ", 1),
        t("button", {
          type: "button",
          class: "word-remove",
          "aria-label": `Remove ${b}`,
          onClick: (w) => r(b)
        }, [
          j(u(ne), {
            name: "close",
            size: 11
          })
        ], 8, ft)
      ]))), 128)),
      K(t("input", {
        "onUpdate:modelValue": d[0] || (d[0] = (b) => i.value = b),
        class: "word-input",
        placeholder: "Add a word, then Enter",
        "aria-label": "Add a word",
        "data-trigger-word": "",
        onKeydown: ke(te(s, ["prevent"]), ["enter"]),
        onBlur: s
      }, null, 40, bt), [
        [Y, i.value]
      ])
    ]));
  }
}, wt = /* @__PURE__ */ N($t, [["__scopeId", "data-v-7a597156"]]), qt = { class: "field" }, St = { class: "field" }, xt = ["checked", "data-trigger-place", "onChange"], Ct = { class: "field" }, Tt = {
  key: 0,
  class: "pattern-limit",
  "data-trigger-pattern-limit": ""
}, Rt = {
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
    const k = G(e, "phrases"), a = G(e, "places"), y = G(e, "match"), i = (s) => a.value = a.value.includes(s) ? a.value.filter((r) => r !== s) : [...a.value, s];
    return (s, r) => (l(), n(A, null, [
      t("div", qt, [
        r[2] || (r[2] = t("span", { class: "label" }, "When these words appear", -1)),
        j(wt, {
          words: k.value,
          onWords: r[0] || (r[0] = (o) => k.value = o)
        }, null, 8, ["words"])
      ]),
      t("div", St, [
        r[3] || (r[3] = t("span", { class: "label" }, "Where to look", -1)),
        (l(!0), n(A, null, V(u(lt), (o) => (l(), n("label", {
          key: o.key,
          class: "check"
        }, [
          t("input", {
            type: "checkbox",
            checked: a.value.includes(o.key),
            "data-trigger-place": o.key,
            onChange: (d) => i(o.key)
          }, null, 40, xt),
          R(p(o.label), 1)
        ]))), 128))
      ]),
      t("div", Ct, [
        r[4] || (r[4] = t("span", { class: "label" }, "How words match", -1)),
        j(yt, {
          modelValue: y.value,
          "onUpdate:modelValue": r[1] || (r[1] = (o) => y.value = o),
          options: u(st),
          mark: "trigger-match"
        }, null, 8, ["modelValue", "options"]),
        y.value === "pattern" ? (l(), n("p", Tt, "Patterns have no time limit. A slow pattern can delay every command or file change. Patterns are limited to 200 characters and check only the first 2,000 characters; repeating a repeated group is refused.")) : S("", !0)
      ])
    ], 64));
  }
}, At = /* @__PURE__ */ N(Rt, [["__scopeId", "data-v-2e25b9b9"]]), Ot = { class: "block" }, It = {
  key: 0,
  class: "field"
}, Lt = { class: "label" }, jt = {
  key: 1,
  class: "field"
}, Et = { class: "label" }, Wt = ["placeholder"], Nt = {
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
  setup(e, { emit: k }) {
    const a = e, y = k, i = G(e, "modelValue"), s = x(() => {
      var r, o;
      return ((o = (r = a.choices) == null ? void 0 : r.find((d) => d.value === i.value)) == null ? void 0 : o.label) ?? "Choose one";
    });
    return (r, o) => (l(), n("div", Ot, [
      e.choices ? (l(), n("div", It, [
        t("span", Lt, p(e.label), 1),
        j(u(ae), {
          label: s.value,
          items: e.choices,
          picked: i.value,
          "data-trigger-choice": "",
          onPick: o[0] || (o[0] = (d) => i.value = d.value)
        }, null, 8, ["label", "items", "picked"])
      ])) : (l(), n("label", jt, [
        t("span", Et, p(e.label), 1),
        K(t("input", {
          "onUpdate:modelValue": o[1] || (o[1] = (d) => i.value = d),
          placeholder: e.example,
          "data-trigger-listed": ""
        }, null, 8, Wt), [
          [Y, i.value]
        ])
      ])),
      j(u(be), {
        class: "remove",
        small: "",
        onClick: o[2] || (o[2] = (d) => y("remove"))
      }, {
        default: le(() => [...o[3] || (o[3] = [
          R("Remove", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Vt = /* @__PURE__ */ N(Nt, [["__scopeId", "data-v-1a787719"]]), Bt = {
  __name: "TriggerConditionFields",
  props: {
    modelValue: { type: Array, required: !0 },
    modelModifiers: {}
  },
  emits: ["update:modelValue"],
  setup(e) {
    const k = G(e, "modelValue"), a = (r) => _.find((o) => o.value === r.type), y = (r, o) => k.value = k.value.map((d, b) => b === r ? { ...d, value: o } : d), i = (r) => k.value = k.value.filter((o, d) => d !== r), s = (r) => k.value = [...k.value, { type: r.value, value: "" }];
    return (r, o) => (l(), n(A, null, [
      (l(!0), n(A, null, V(k.value, (d, b) => (l(), M(Vt, {
        key: b,
        "model-value": d.value,
        label: a(d).label,
        example: a(d).example,
        choices: a(d).choices,
        "onUpdate:modelValue": (w) => y(b, w),
        onRemove: (w) => i(b)
      }, null, 8, ["model-value", "label", "example", "choices", "onUpdate:modelValue", "onRemove"]))), 128)),
      j(u(ae), {
        label: "Add a condition",
        icon: "plus",
        items: u(_),
        "data-trigger-add-condition": "",
        onPick: s
      }, null, 8, ["items"])
    ], 64));
  }
}, Mt = {
  key: 0,
  class: "field"
}, Ft = ["value"], Pt = { class: "summary" }, Ut = { class: "field" }, Dt = {
  key: 1,
  class: "trial",
  role: "status"
}, Gt = ["open"], Ht = { class: "more" }, Kt = { class: "field" }, Yt = ["placeholder"], zt = {
  class: "help",
  role: "status"
}, Jt = { class: "actions" }, Qt = ["disabled"], Xt = {
  __name: "SkillTriggerEditor",
  props: { skill: { type: String, default: "" }, trigger: { type: Object, default: null }, skills: { type: Array, required: !0 } },
  emits: ["saved", "cancel"],
  setup(e, { emit: k }) {
    var C, E, F, B, U, P;
    const a = e, y = k, i = se(), s = me({ skill: ((C = a.trigger) == null ? void 0 : C.skill) || a.skill, name: ((E = a.trigger) == null ? void 0 : E.name) || "", phrases: [...((F = a.trigger) == null ? void 0 : F.phrases) || []], places: [...((B = a.trigger) == null ? void 0 : B.watch_places) || ["messages", "commands", "files"]], match: ((U = a.trigger) == null ? void 0 : U.match_mode) || "word", conditions: JSON.parse(((P = a.trigger) == null ? void 0 : P.conditions) || "[]") }), r = L(""), o = L(null), d = L(""), b = L(!1), w = L(!1), I = x(() => s.skill ? s.phrases.length ? s.places.length ? "" : "Choose where to look." : "Add at least one word." : "Choose a skill."), m = x(() => de({ ...s, action: "skill" }));
    let c, v = 0;
    X(() => [r.value, s.phrases.join(","), s.match], () => {
      clearTimeout(c);
      const W = ++v;
      o.value = null, !(!r.value.trim() || !s.phrases.length) && (c = setTimeout(async () => {
        i.state["trial.phrases"] = s.phrases.join(","), i.state["trial.sentence"] = r.value, i.state["trial.match-mode"] = s.match, await i.reload("trial"), W === v && (o.value = i.props.trial.failure.value ? { error: i.props.trial.failure.value } : i.props.trial.data.value);
      }, 150));
    }), ee(() => {
      clearTimeout(c), v++;
    });
    async function q() {
      if (b.value || I.value) return;
      b.value = !0;
      const W = ["--name", s.name.trim() || `Read ${s.skill}`, "--skill", s.skill, "--watch-places", ...s.places, "--match-mode", s.match, "--conditions", JSON.stringify(s.conditions)], f = a.trigger ? ["trigger", "edit", String(a.trigger.id), ...W, ...s.phrases.map((g) => `--phrases=${g}`)] : ["trigger", "make", "--do", "skill", ...W, "--", s.phrases.join(", ")], $ = await i.run(f);
      d.value = $.ok ? "" : $.error, b.value = !1, $.ok && y("saved");
    }
    async function O() {
      const W = await i.run(["trigger", "strike", String(a.trigger.id)]);
      d.value = W.ok ? "" : W.error, W.ok && y("saved");
    }
    return (W, f) => (l(), n("form", {
      class: "skill-trigger-editor",
      onSubmit: te(q, ["prevent"])
    }, [
      t("h3", null, [
        R(p(e.trigger ? "Edit this trigger" : "New trigger"), 1),
        s.skill ? (l(), n(A, { key: 0 }, [
          R(" for " + p(s.skill), 1)
        ], 64)) : S("", !0)
      ]),
      e.skill ? S("", !0) : (l(), n("label", Mt, [
        f[10] || (f[10] = R("Which skill the agent must read", -1)),
        K(t("select", {
          "onUpdate:modelValue": f[0] || (f[0] = ($) => s.skill = $),
          "aria-label": "Which skill the agent must read"
        }, [
          f[9] || (f[9] = t("option", { value: "" }, "Choose a skill", -1)),
          (l(!0), n(A, null, V(e.skills, ($) => (l(), n("option", {
            key: $.folder,
            value: $.folder
          }, p($.folder), 9, Ft))), 128))
        ], 512), [
          [he, s.skill]
        ])
      ])),
      j(At, {
        phrases: s.phrases,
        "onUpdate:phrases": f[1] || (f[1] = ($) => s.phrases = $),
        places: s.places,
        "onUpdate:places": f[2] || (f[2] = ($) => s.places = $),
        match: s.match,
        "onUpdate:match": f[3] || (f[3] = ($) => s.match = $)
      }, null, 8, ["phrases", "places", "match"]),
      t("div", Pt, [
        f[11] || (f[11] = t("small", null, "What this trigger does", -1)),
        t("p", null, p(m.value), 1)
      ]),
      t("label", Ut, [
        f[12] || (f[12] = R("Try a sentence", -1)),
        K(t("input", {
          "onUpdate:modelValue": f[4] || (f[4] = ($) => r.value = $),
          "aria-label": "Try a sentence",
          placeholder: "For example: take notes about the plan"
        }, null, 512), [
          [Y, r.value]
        ])
      ]),
      o.value ? (l(), n("p", Dt, p(o.value.error || (o.value.matches ? "This would fire." : "This would not fire.")), 1)) : S("", !0),
      t("details", {
        open: !!e.trigger
      }, [
        f[14] || (f[14] = t("summary", null, "More choices: its name and when it applies", -1)),
        t("div", Ht, [
          t("label", Kt, [
            f[13] || (f[13] = R("Name", -1)),
            K(t("input", {
              "onUpdate:modelValue": f[5] || (f[5] = ($) => s.name = $),
              "aria-label": "Name",
              placeholder: `Read ${s.skill || "the skill"}`
            }, null, 8, Yt), [
              [Y, s.name]
            ])
          ]),
          j(Bt, {
            modelValue: s.conditions,
            "onUpdate:modelValue": f[6] || (f[6] = ($) => s.conditions = $)
          }, null, 8, ["modelValue"])
        ])
      ], 8, Gt),
      t("p", zt, p(d.value || I.value), 1),
      t("div", Jt, [
        e.trigger ? (l(), n("button", {
          key: 0,
          type: "button",
          class: "danger",
          onClick: f[7] || (f[7] = ($) => w.value ? O() : w.value = !0)
        }, p(w.value ? "Yes, end it" : "End this trigger"), 1)) : S("", !0),
        t("button", {
          type: "button",
          onClick: f[8] || (f[8] = ($) => y("cancel"))
        }, "Cancel"),
        t("button", {
          type: "submit",
          class: "primary",
          disabled: b.value || !!I.value
        }, p(e.trigger ? "Save" : "Create trigger"), 9, Qt)
      ])
    ], 32));
  }
}, ce = /* @__PURE__ */ N(Xt, [["__scopeId", "data-v-272d3d66"]]), Zt = { class: "skill-details" }, _t = { class: "status" }, el = { class: "block" }, tl = { class: "block-head" }, ll = {
  key: 0,
  class: "help"
}, sl = {
  key: 0,
  class: "block"
}, nl = { key: 0 }, al = { key: 1 }, il = { key: 2 }, rl = { class: "block" }, ol = { class: "block-head" }, dl = ["href"], ul = {
  key: 0,
  "data-skill-text": ""
}, cl = {
  key: 1,
  class: "help"
}, gl = {
  __name: "SkillDetails",
  props: { skill: { type: Object, required: !0 }, text: { type: Object, default: null }, triggers: { type: Array, required: !0 }, skills: { type: Array, required: !0 }, agent: { type: Number, default: null }, draft: { type: Object, default: null }, busy: Boolean },
  emits: ["require", "read", "add", "edit", "run", "saved", "cancel"],
  setup(e, { emit: k }) {
    const a = e, y = k, i = x(() => {
      var o;
      return (o = a.skill.module) != null && o.startsWith("plugin:") ? "From a plugin" : a.skill.shipped ? "From the journal" : "From this project";
    }), s = x(() => {
      var o;
      return a.agent ? a.skill.changed ? "This skill changed after the main agent read it." : ((o = a.skill.held) == null ? void 0 : o.state) === "due" ? "The main agent still has to read this skill. It cannot do anything else first." : a.skill.read ? `The main agent read this skill at ${new Date(a.skill.held.loaded_at).toLocaleString()}.` : "The main agent has not read this skill in this conversation." : "No main agent is running in this environment.";
    }), r = L("");
    return X(() => a.text, (o, d, b) => {
      if (!o) return;
      const w = URL.createObjectURL(new Blob([o.text], { type: "text/plain;charset=utf-8" }));
      r.value = w, b(() => URL.revokeObjectURL(w));
    }, { immediate: !0 }), (o, d) => {
      var b, w, I, m, c, v, q, O;
      return l(), n("div", Zt, [
        t("header", null, [
          t("h2", null, [
            R(p(e.skill.folder) + " ", 1),
            t("small", null, p(i.value), 1)
          ]),
          t("p", null, p(e.skill.description), 1)
        ]),
        t("div", _t, [
          t("span", null, p(s.value), 1),
          e.agent && ((b = e.skill.held) == null ? void 0 : b.state) !== "due" ? (l(), n("button", {
            key: 0,
            type: "button",
            onClick: d[0] || (d[0] = (C) => y("read"))
          }, p(e.skill.read ? "Make the agent read it again" : "Make the agent read it now"), 1)) : S("", !0)
        ]),
        j(et, {
          skill: e.skill,
          busy: e.busy,
          onChange: d[1] || (d[1] = (C, E) => y("require", C, E))
        }, null, 8, ["skill", "busy"]),
        t("section", el, [
          t("div", tl, [
            d[7] || (d[7] = t("h3", null, "Make the agent read it when your words appear", -1)),
            e.draft ? S("", !0) : (l(), n("button", {
              key: 0,
              type: "button",
              onClick: d[2] || (d[2] = (C) => y("add"))
            }, "Add a trigger"))
          ]),
          !e.triggers.length && !e.draft ? (l(), n("p", ll, "No triggers yet. Add one, and the agent must read this skill as soon as your words appear.")) : S("", !0),
          (l(!0), n(A, null, V(e.triggers, (C) => {
            var E, F;
            return l(), n(A, {
              key: C.id
            }, [
              ((F = (E = e.draft) == null ? void 0 : E.trigger) == null ? void 0 : F.id) !== C.id ? (l(), M(ue, {
                key: 0,
                trigger: C,
                onEdit: d[3] || (d[3] = (B) => y("edit", B)),
                onRun: d[4] || (d[4] = (B) => y("run", B))
              }, null, 8, ["trigger"])) : S("", !0)
            ], 64);
          }), 128)),
          e.draft ? (l(), M(ce, {
            key: ((w = e.draft.trigger) == null ? void 0 : w.id) || e.skill.folder,
            skill: e.skill.folder,
            trigger: e.draft.trigger,
            skills: e.skills,
            onSaved: d[5] || (d[5] = (C) => y("saved")),
            onCancel: d[6] || (d[6] = (C) => y("cancel"))
          }, null, 8, ["skill", "trigger", "skills"])) : S("", !0)
        ]),
        (I = e.skill.keywords) != null && I.length || (m = e.skill.commands) != null && m.length || (c = e.skill.events) != null && c.length ? (l(), n("section", sl, [
          d[11] || (d[11] = t("h3", null, "When the skill itself asks to be read", -1)),
          d[12] || (d[12] = t("p", { class: "help" }, "These come with the skill and cannot be changed here.", -1)),
          t("ul", null, [
            (v = e.skill.keywords) != null && v.length ? (l(), n("li", nl, [
              d[8] || (d[8] = R("When you write ", -1)),
              t("code", null, p(e.skill.keywords.join(", ")), 1)
            ])) : S("", !0),
            (q = e.skill.commands) != null && q.length ? (l(), n("li", al, [
              d[9] || (d[9] = R("Before it runs a command about ", -1)),
              t("code", null, p(e.skill.commands.join(", ")), 1)
            ])) : S("", !0),
            (O = e.skill.events) != null && O.length ? (l(), n("li", il, [
              d[10] || (d[10] = R("When these changes happen: ", -1)),
              t("code", null, p(e.skill.events.join(", ")), 1)
            ])) : S("", !0)
          ])
        ])) : S("", !0),
        t("section", rl, [
          t("div", ol, [
            d[13] || (d[13] = t("h3", null, "What the skill says", -1)),
            r.value ? (l(), n("a", {
              key: 0,
              href: r.value,
              target: "_blank",
              rel: "noopener"
            }, "Open SKILL.md", 8, dl)) : S("", !0)
          ]),
          e.text ? (l(), n("div", ul, [
            j(u(ie), {
              text: u(oe)(e.text.text),
              "row-names": !1
            }, null, 8, ["text"])
          ])) : (l(), n("p", cl, "Reading the skill…"))
        ])
      ]);
    };
  }
}, kl = /* @__PURE__ */ N(gl, [["__scopeId", "data-v-4f1bf52d"]]), ml = { class: "skills" }, hl = { class: "skills-title" }, vl = {
  class: "skills-text",
  "data-skill-text": ""
}, yl = {
  __name: "SkillText",
  props: { skill: { type: Object, default: null }, failure: { type: String, default: "" }, back: { type: Boolean, default: !0 } },
  emits: ["back"],
  setup(e, { emit: k }) {
    const a = k;
    return (y, i) => (l(), n("div", ml, [
      e.back ? (l(), n("button", {
        key: 0,
        type: "button",
        class: "skills-back",
        onClick: i[0] || (i[0] = (s) => a("back"))
      }, "Back to skills")) : S("", !0),
      t("h3", hl, p(e.skill ? e.skill.folder : ""), 1),
      t("div", vl, [
        j(u(ie), {
          text: e.skill ? u(oe)(e.skill.text) : e.failure,
          "row-names": !1
        }, null, 8, ["text"])
      ])
    ]));
  }
}, pl = /* @__PURE__ */ N(yl, [["__scopeId", "data-v-d6cfa5ab"]]), fl = { class: "page-head" }, bl = { "aria-label": "Skills views" }, $l = ["aria-pressed"], wl = ["aria-pressed"], ql = {
  key: 0,
  class: "warning",
  role: "status"
}, Sl = {
  key: 1,
  class: "warning",
  role: "alert"
}, xl = {
  key: 2,
  class: "empty"
}, Cl = {
  key: 3,
  class: "panes"
}, Tl = { class: "skill-pane" }, Rl = {
  key: 0,
  class: "empty"
}, Al = {
  key: 2,
  class: "empty centre"
}, Ol = {
  key: 4,
  class: "panes"
}, Il = { class: "triggers-list" }, Ll = {
  key: 0,
  class: "trigger-cards"
}, jl = {
  key: 1,
  class: "empty"
}, El = { class: "skill-pane trigger-pane" }, Wl = {
  key: 0,
  class: "trigger-form"
}, Nl = {
  key: 1,
  class: "empty centre"
}, Vl = {
  __name: "SkillRows",
  setup(e) {
    const { skills: k, selected: a, selectedTriggers: y, triggers: i, requirements: s, mainAgent: r, answered: o, failure: d, busy: b, opened: w, text: I, openFailure: m, tab: c, draft: v, marked: q, load: O, open: C, run: E, requireSkill: F, readNow: B } = we(), U = (g, h) => F(g, h ? "all" : "none"), P = () => v.value = { trigger: null }, W = (g) => v.value = { trigger: g }, f = async () => {
      v.value = null, await O();
    }, $ = (g) => {
      c.value = g, v.value = null;
    };
    return (g, h) => (l(), M(u($e), { padding: "0" }, {
      default: le(() => {
        var D;
        return [
          u(q) ? (l(), M(pl, {
            key: 0,
            skill: u(I),
            failure: u(m),
            back: !1
          }, null, 8, ["skill", "failure"])) : (l(), n("main", {
            key: 1,
            class: z(["skills-page", { "skill-open": u(c) === "skills" && !!u(w), "trigger-open": u(c) === "triggers" && !!u(v) }])
          }, [
            t("header", fl, [
              h[8] || (h[8] = t("div", null, [
                t("h1", null, "Skills"),
                t("p", null, "Instructions the agent reads before starting work. Choose which skills the agent must read, and when. These settings apply to the whole project.")
              ], -1)),
              t("nav", bl, [
                t("button", {
                  type: "button",
                  "aria-pressed": u(c) === "skills",
                  onClick: h[0] || (h[0] = (T) => $("skills"))
                }, "Skills", 8, $l),
                t("button", {
                  type: "button",
                  "aria-pressed": u(c) === "triggers",
                  onClick: h[1] || (h[1] = (T) => $("triggers"))
                }, "Triggers", 8, wl)
              ])
            ]),
            u(s).environment_overrides ? (l(), n("p", ql, "This environment uses separate skill lists. Changes here apply to the whole project. The environment lists still take priority.")) : S("", !0),
            u(d) ? (l(), n("div", Sl, [
              R(p(u(d)) + " ", 1),
              t("button", {
                type: "button",
                onClick: h[2] || (h[2] = (...T) => u(O) && u(O)(...T))
              }, "Try again")
            ])) : S("", !0),
            u(o) ? u(c) === "skills" ? (l(), n("div", Cl, [
              j(Ge, {
                skills: u(k),
                opened: u(w),
                busy: u(b),
                onOpen: u(C),
                onRequire: U
              }, null, 8, ["skills", "opened", "busy", "onOpen"]),
              t("article", Tl, [
                t("button", {
                  type: "button",
                  class: "phone-back",
                  onClick: h[3] || (h[3] = (T) => u(C)(""))
                }, "Back to skills"),
                u(m) ? (l(), n("div", Rl, [
                  h[9] || (h[9] = t("strong", null, "Could not read this skill", -1)),
                  t("p", null, p(u(m)), 1),
                  t("button", {
                    type: "button",
                    onClick: h[4] || (h[4] = (T) => u(C)(u(w), !1))
                  }, "Try again")
                ])) : u(a) ? (l(), M(kl, {
                  key: 1,
                  skill: u(a),
                  text: u(I),
                  triggers: u(y),
                  skills: u(k),
                  agent: u(r),
                  draft: u(v),
                  busy: u(b).includes(u(w)),
                  onRequire: h[5] || (h[5] = (T, H) => u(F)(u(w), T, H)),
                  onRead: u(B),
                  onAdd: P,
                  onEdit: W,
                  onRun: u(E),
                  onSaved: f,
                  onCancel: h[6] || (h[6] = (T) => v.value = null)
                }, null, 8, ["skill", "text", "triggers", "skills", "agent", "draft", "busy", "onRead", "onRun"])) : (l(), n("div", Al, [...h[10] || (h[10] = [
                  t("strong", null, "Choose a skill to read what it says", -1),
                  t("p", null, "Switch on Required to make the agent read a skill at the start. Open a skill to add words that make the agent read it later.", -1)
                ])]))
              ])
            ])) : (l(), n("div", Ol, [
              t("aside", Il, [
                t("div", { class: "trigger-head" }, [
                  h[11] || (h[11] = t("p", null, "Triggers that make an agent read a skill. Other triggers stay under Triggers.", -1)),
                  t("button", {
                    type: "button",
                    onClick: P
                  }, "Add a trigger")
                ]),
                u(i).length ? (l(), n("div", Ll, [
                  (l(!0), n(A, null, V(u(i), (T) => (l(), M(ue, {
                    key: T.id,
                    trigger: T,
                    onEdit: W,
                    onRun: u(E)
                  }, null, 8, ["trigger", "onRun"]))), 128))
                ])) : (l(), n("div", jl, [
                  h[12] || (h[12] = t("strong", null, "You have no triggers yet", -1)),
                  h[13] || (h[13] = t("p", null, "A trigger makes the agent read a skill as soon as your words appear.", -1)),
                  t("button", {
                    type: "button",
                    onClick: P
                  }, "Add a trigger")
                ]))
              ]),
              t("article", El, [
                u(v) ? (l(), n("div", Wl, [
                  (l(), M(ce, {
                    key: ((D = u(v).trigger) == null ? void 0 : D.id) || "new",
                    trigger: u(v).trigger,
                    skills: u(k),
                    onSaved: f,
                    onCancel: h[7] || (h[7] = (T) => v.value = null)
                  }, null, 8, ["trigger", "skills"]))
                ])) : (l(), n("div", Nl, [...h[14] || (h[14] = [
                  t("strong", null, "Choose Edit on a trigger to change it", -1),
                  t("p", null, "Or add a new one. Each trigger makes the agent read one skill.", -1)
                ])]))
              ])
            ])) : (l(), n("p", xl, "Reading the skills…"))
          ], 2))
        ];
      }),
      _: 1
    }));
  }
}, Fl = /* @__PURE__ */ N(Vl, [["__scopeId", "data-v-d59c26e6"]]);
export {
  Fl as S
};
