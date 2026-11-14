if (!document.getElementById("window-styles-ed430a45360d")) { const style = document.createElement("style"); style.id = "window-styles-ed430a45360d"; style.textContent = ".helper-start[data-v-382ed53a]{display:grid;gap:12px;padding:0 0 20px;margin-bottom:20px;border-bottom:1px solid var(--border-2)}h3[data-v-382ed53a]{margin:0;font-size:14px;font-weight:600}.field[data-v-382ed53a]{display:grid;gap:4px}.field>span[data-v-382ed53a]{color:var(--text-2);font-size:12px;font-weight:500}.reason[data-v-382ed53a],.notice[data-v-382ed53a]{margin:0;color:var(--text-3);font-size:12px;line-height:1.5;overflow-wrap:anywhere}.idle-helper[data-v-382ed53a]{display:flex;align-items:center;justify-content:space-between;gap:12px}.profile-panel-tab[data-v-29dafd7a]{display:flex;flex-direction:column;gap:14px}.profile-panel-reason[data-v-29dafd7a]{margin:0;color:var(--text-3);font-size:12px}.profile-panel-tab[data-v-06548598]{display:flex;flex-direction:column;gap:14px}.profile-panel-models[data-v-06548598]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}.profile-skill[data-v-da955a19]{display:flex;gap:10px;align-items:flex-start;padding:10px 12px}.profile-skill+.profile-skill[data-v-da955a19]{border-top:1px solid var(--border)}.profile-skill-text[data-v-da955a19]{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0}.profile-skill-head[data-v-da955a19]{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.profile-skill-name[data-v-da955a19]{color:var(--text);font-size:13px}.profile-skill.off .profile-skill-name[data-v-da955a19]{color:var(--text-3)}.profile-skill-own[data-v-da955a19]{padding:0 5px;border:1px solid var(--border-2);border-radius:5px;color:var(--text-3);font-size:10px}.profile-skill-about[data-v-da955a19]{display:-webkit-box;overflow:hidden;color:var(--text-3);font-size:12px;-webkit-box-orient:vertical;-webkit-line-clamp:2}.profile-skill-end[data-v-da955a19]{display:flex;flex:none;justify-content:flex-end;min-width:84px}.profile-skill-locked[data-v-da955a19]{max-width:130px;color:var(--text-3);font-size:11.5px;text-align:right}@media(max-width:640px){.profile-skill[data-v-da955a19]{flex-wrap:wrap}.profile-skill-end[data-v-da955a19]{justify-content:flex-start;width:100%;padding-left:38px}}.profile-skills[data-v-5fb78afd]{display:flex;flex-direction:column;gap:10px}.profile-skills-line[data-v-5fb78afd]{display:flex;gap:12px;align-items:baseline;justify-content:space-between}.profile-skills-help[data-v-5fb78afd],.profile-skills-count[data-v-5fb78afd],.profile-skills-note[data-v-5fb78afd]{margin:0;color:var(--text-3);font-size:12px}.profile-skills-card[data-v-5fb78afd]{border:1px solid var(--border);border-radius:8px;background:var(--bg-2)}.profile-skills-skeleton[data-v-5fb78afd],.profile-skills-note[data-v-5fb78afd]{padding:10px 12px}.profile-reader[data-v-81e8ee3b]{display:flex;flex-direction:column;gap:14px;min-width:0;padding:18px var(--inset) 0}.profile-title[data-v-81e8ee3b]{margin:0;font-size:16px;font-weight:600}.profile-abstract[data-v-81e8ee3b]{margin:2px 0 0;color:var(--text-3);font-size:12.5px}.profile-foot[data-v-81e8ee3b]{position:sticky;bottom:0;display:flex;gap:8px;align-items:center;padding:10px 0;border-top:1px solid var(--border);background:var(--bg)}.profile-panel[data-v-81e8ee3b],.profile-panel-tab[data-v-81e8ee3b]{display:flex;flex-direction:column;gap:14px}.profile-panel-meta[data-v-81e8ee3b]{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:8px}.profile-panel-name[data-v-81e8ee3b]{color:var(--text-3);font-size:12px}.profile-panel-tag[data-v-81e8ee3b]{padding:0 5px;border:1px solid var(--border-2);border-radius:5px;color:var(--text-3);font-size:10px}.profile-panel-changed[data-v-81e8ee3b]{display:flex;gap:10px;align-items:center;justify-content:space-between}.profile-panel-reason[data-v-81e8ee3b],.profile-panel-unsaved[data-v-81e8ee3b]{margin:0;color:var(--text-3);font-size:12px}.profile-panel-grow[data-v-81e8ee3b]{flex:1}.note[data-v-d94d1998]{margin:0;padding:4px var(--inset);color:var(--text-2);font-size:12px}.failed[data-v-d94d1998]{color:var(--danger)}.faint[data-v-d94d1998]{color:var(--text-4);font-size:12px;white-space:nowrap}\n"; document.head.appendChild(style); }
import { ref as q, computed as T, watch as X, openBlock as l, createElementBlock as d, withModifiers as ve, createElementVNode as m, createVNode as u, unref as a, withDirectives as H, Fragment as L, renderList as J, toDisplayString as I, vModelSelect as me, withCtx as y, createTextVNode as W, createCommentVNode as w, useModel as ue, createBlock as N, mergeModels as pe, normalizeClass as ye, renderSlot as ie, vShow as Y } from "vue";
import { useWindow as oe, TextArea as se, Btn as V, TextInput as Z, FormField as B, Segmented as G, ModelPicker as ke, Switch as ne, matchesSearch as he, SearchBar as ge, Notice as Q, SkeletonLine as be, DiffCard as _e, InnerTabs as we, TabBody as $e, defaultFilter as Se, applyFilter as Te, ListReaderLayout as qe, Skeleton as Ce, PageHeader as Ie, FilterBar as Pe, ago as Ne, copying as Ae, removed as Re } from "@journal/window-kit";
const D = (e, A) => {
  const o = e.__vccOpts || e;
  for (const [h, i] of A)
    o[h] = i;
  return o;
}, je = { class: "field" }, xe = { class: "field" }, Be = ["disabled"], Oe = ["value"], Ee = ["data-helper-idle"], Me = {
  key: 0,
  class: "field"
}, We = {
  key: 1,
  class: "reason",
  "data-helper-fresh-blocked": ""
}, Le = {
  key: 2,
  class: "reason",
  "data-helper-start-reason": ""
}, Ue = {
  key: 3,
  class: "notice"
}, Ve = {
  __name: "HelperStartForm",
  props: { profile: { type: String, required: !0 }, programs: { type: Array, required: !0 } },
  setup(e) {
    const A = e, o = oe(), h = { can_start: !1, reason: "", programs: [], idle_helpers: [], can_start_fresh: !1, fresh_reason: "" }, i = q(h), p = q(""), r = q(""), C = q(""), R = q(""), f = q(!1), S = q(!0);
    let P = 0;
    const j = T(() => !f.value && !S.value && !!p.value.trim()), O = T(() => !j.value || !(i.value.can_start || i.value.can_start_fresh && R.value.trim()));
    async function x() {
      const g = ++P;
      if (S.value = !0, o.state["availability.profile"] = A.profile, r.value ? o.state["availability.program"] = r.value : delete o.state["availability.program"], await o.reload("availability"), g !== P) return;
      const s = o.props.availability;
      s.failure.value ? (i.value = h, C.value = s.failure.value) : i.value = s.data.value, S.value = !1;
    }
    async function E() {
      O.value || await v(["helper", "start", A.profile, "--brief", p.value, ...r.value ? ["--program", r.value] : [], ...R.value.trim() ? ["--fresh", R.value.trim()] : []], "The read-only helper is starting.");
    }
    async function M(g) {
      j.value && await v(["helper", "send", String(g), p.value], "Job sent.");
    }
    async function v(g, s) {
      f.value = !0;
      try {
        const b = await o.run(g);
        C.value = b.ok ? s : b.error, b.ok && (p.value = "", R.value = ""), await x();
      } finally {
        f.value = !1;
      }
    }
    return X([() => A.profile, r], x, { immediate: !0 }), (g, s) => (l(), d("form", {
      class: "helper-start",
      "data-helper-start": "",
      onSubmit: ve(E, ["prevent"])
    }, [
      s[9] || (s[9] = m("h3", null, "Give a read-only helper a job", -1)),
      m("label", je, [
        s[3] || (s[3] = m("span", null, "The job", -1)),
        u(a(se), {
          value: p.value,
          rows: "3",
          disabled: f.value,
          "data-helper-brief": "",
          onInput: s[0] || (s[0] = (b) => p.value = b.target.value)
        }, null, 8, ["value", "disabled"])
      ]),
      m("label", xe, [
        s[5] || (s[5] = m("span", null, "Program", -1)),
        H(m("select", {
          "onUpdate:modelValue": s[1] || (s[1] = (b) => r.value = b),
          disabled: f.value,
          "data-helper-program": ""
        }, [
          s[4] || (s[4] = m("option", { value: "" }, "The profile program", -1)),
          (l(!0), d(L, null, J(i.value.programs, (b) => {
            var U;
            return l(), d("option", {
              key: b,
              value: b
            }, I(((U = e.programs.find((z) => z.name === b)) == null ? void 0 : U.title) || b), 9, Oe);
          }), 128))
        ], 8, Be), [
          [me, r.value]
        ])
      ]),
      (l(!0), d(L, null, J(i.value.idle_helpers, (b) => (l(), d("div", {
        key: b.id,
        class: "idle-helper",
        "data-helper-idle": b.id
      }, [
        m("span", null, I(b.name) + " · Idle", 1),
        u(a(V), {
          type: "button",
          disabled: !j.value,
          "data-helper-send": b.id,
          onClick: (U) => M(b.number)
        }, {
          default: y(() => [...s[6] || (s[6] = [
            W("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled", "data-helper-send", "onClick"])
      ], 8, Ee))), 128)),
      i.value.idle_helpers.length ? (l(), d("label", Me, [
        s[7] || (s[7] = m("span", null, "Why start another helper?", -1)),
        u(a(Z), {
          modelValue: R.value,
          "onUpdate:modelValue": s[2] || (s[2] = (b) => R.value = b),
          disabled: f.value,
          "data-helper-fresh-reason": ""
        }, null, 8, ["modelValue", "disabled"])
      ])) : w("", !0),
      u(a(V), {
        type: "submit",
        disabled: O.value,
        "data-helper-start-button": ""
      }, {
        default: y(() => [...s[8] || (s[8] = [
          W("Start a read-only helper", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      i.value.fresh_reason ? (l(), d("p", We, I(i.value.fresh_reason), 1)) : w("", !0),
      i.value.reason && i.value.reason !== i.value.fresh_reason ? (l(), d("p", Le, I(i.value.reason), 1)) : w("", !0),
      C.value ? (l(), d("p", Ue, I(C.value), 1)) : w("", !0)
    ], 32));
  }
}, Fe = /* @__PURE__ */ D(Ve, [["__scopeId", "data-v-382ed53a"]]), De = {
  class: "profile-panel-tab",
  "data-profile-tab": "about"
}, ze = {
  key: 0,
  class: "profile-panel-reason"
}, He = {
  key: 1,
  class: "profile-panel-reason"
}, Ge = {
  key: 0,
  "data-profile-type-locked": ""
}, Je = {
  __name: "ProfileAboutTab",
  props: /* @__PURE__ */ pe({ profile: { type: Object, required: !0 }, choices: { type: Array, required: !0 }, accesses: { type: Array, required: !0 }, pickedType: { type: Object, default: null }, nameIsBad: Boolean, descriptionIsEmpty: Boolean }, {
    draft: { type: Object, required: !0 },
    draftModifiers: {}
  }),
  emits: ["update:draft"],
  setup(e) {
    const A = [{ key: "continue", label: "Resume it" }, { key: "when-cold", label: "Start over after a long pause" }, { key: "each-launch", label: "New for each job" }], o = ue(e, "draft");
    return (h, i) => {
      var p;
      return l(), d("div", De, [
        e.profile.name ? w("", !0) : (l(), d(L, { key: 0 }, [
          u(a(B), {
            label: "Name",
            for: "profile-name",
            help: "Letters, digits and dashes; the agent starts it by this name."
          }, {
            default: y(() => [
              u(a(Z), {
                id: "profile-name",
                value: o.value.name,
                placeholder: "critic",
                onInput: i[0] || (i[0] = (r) => o.value.name = r.target.value.trim())
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          e.nameIsBad && o.value.name ? (l(), d("p", ze, "Use letters, digits and dashes.")) : w("", !0)
        ], 64)),
        u(a(B), {
          label: "Title",
          for: "profile-title"
        }, {
          default: y(() => [
            u(a(Z), {
              id: "profile-title",
              value: o.value.title,
              onInput: i[1] || (i[1] = (r) => o.value.title = r.target.value)
            }, null, 8, ["value"])
          ]),
          _: 1
        }),
        u(a(B), {
          label: "When it is used",
          for: "profile-description",
          help: "The agent reads this to decide when to start it."
        }, {
          default: y(() => [
            u(a(se), {
              id: "profile-description",
              rows: "3",
              value: o.value.description,
              onInput: i[2] || (i[2] = (r) => o.value.description = r.target.value)
            }, null, 8, ["value"])
          ]),
          _: 1
        }),
        e.descriptionIsEmpty ? (l(), d("p", He, "Describe when the agent should start it.")) : w("", !0),
        u(a(B), {
          label: "Type",
          for: "profile-type",
          help: "The type of agent that runs this profile."
        }, {
          default: y(() => {
            var r;
            return [
              e.profile.shipped ? (l(), d("span", Ge, I((r = e.pickedType) == null ? void 0 : r.label), 1)) : (l(), N(a(G), {
                key: 1,
                "data-profile-type": "",
                options: e.choices,
                value: o.value.agent_type,
                onPick: i[3] || (i[3] = (C) => o.value.agent_type = C)
              }, null, 8, ["options", "value"]))
            ];
          }),
          _: 1
        }),
        u(a(B), {
          label: "Access",
          for: "profile-access",
          help: "Whether it may change files."
        }, {
          default: y(() => [
            u(a(G), {
              "data-profile-access": "",
              options: e.accesses,
              value: o.value.access,
              onPick: i[4] || (i[4] = (r) => o.value.access = r)
            }, null, 8, ["options", "value"])
          ]),
          _: 1
        }),
        (p = e.pickedType) != null && p.declares_occupant ? (l(), N(a(B), {
          key: 2,
          label: "Conversation",
          for: "profile-occupant",
          help: "What the agent does with its conversation when it gets its next job. The agent itself is kept in each case."
        }, {
          default: y(() => [
            u(a(G), {
              "data-profile-occupant": "",
              options: A,
              value: o.value.occupant,
              onPick: i[5] || (i[5] = (r) => o.value.occupant = r)
            }, null, 8, ["value"])
          ]),
          _: 1
        })) : w("", !0)
      ]);
    };
  }
}, Ke = /* @__PURE__ */ D(Je, [["__scopeId", "data-v-29dafd7a"]]), Ye = {
  class: "profile-panel-tab",
  "data-profile-tab": "model"
}, Qe = { class: "profile-panel-models" }, Xe = {
  __name: "ProfileModelTab",
  props: /* @__PURE__ */ pe({ programs: { type: Array, required: !0 }, programChoices: { type: Array, required: !0 } }, {
    draft: { type: Object, required: !0 },
    draftModifiers: {}
  }),
  emits: ["update:draft"],
  setup(e) {
    const A = [{ key: "always", label: "Always this program" }, { key: "possible", label: "This program if possible" }], o = [{ key: "", label: "Profile models" }, { key: "fast", label: "Fast" }, { key: "general", label: "General" }, { key: "strongest", label: "Strongest" }], h = ue(e, "draft");
    return (i, p) => (l(), d("div", Ye, [
      u(a(B), {
        label: "Program",
        for: "profile-program",
        help: "A registered program, or the same program as the agent that starts it."
      }, {
        default: y(() => [
          u(a(G), {
            options: e.programChoices,
            value: h.value.program,
            onPick: p[0] || (p[0] = (r) => h.value.program = r)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }),
      h.value.program ? (l(), d(L, { key: 0 }, [
        u(a(B), {
          label: "When it cannot start",
          for: "profile-program-choice",
          help: "If possible: a start uses the other program, on its model, when this one is not installed or not ready, and says so."
        }, {
          default: y(() => [
            u(a(G), {
              "data-profile-program-choice": "",
              options: A,
              value: h.value.preferred_program ? "possible" : "always",
              onPick: p[1] || (p[1] = (r) => h.value.preferred_program = r === "possible")
            }, null, 8, ["value"])
          ]),
          _: 1
        }),
        h.value.preferred_program ? (l(), N(a(B), {
          key: 0,
          label: "Programs to try instead",
          for: "profile-fallbacks",
          help: "Program names in the order to try them, separated by commas. Blank tries every other program."
        }, {
          default: y(() => [
            u(a(Z), {
              id: "profile-fallbacks",
              value: h.value.fallback_programs,
              "data-profile-fallbacks": "",
              onInput: p[2] || (p[2] = (r) => h.value.fallback_programs = r.target.value)
            }, null, 8, ["value"])
          ]),
          _: 1
        })) : w("", !0)
      ], 64)) : w("", !0),
      u(a(B), {
        label: "Model tier",
        for: "profile-tier",
        help: "Chooses a model when this profile has no named model for the program."
      }, {
        default: y(() => [
          u(a(G), {
            "data-profile-tier": "",
            options: o,
            value: h.value.tier || "",
            onPick: p[3] || (p[3] = (r) => h.value.tier = r || null)
          }, null, 8, ["value"])
        ]),
        _: 1
      }),
      m("div", Qe, [
        (l(!0), d(L, null, J(e.programs, (r) => (l(), N(a(B), {
          key: r.name,
          label: `Model on ${r.title}`,
          for: `profile-model-${r.name}`,
          help: "The least expensive model that reliably fits the work."
        }, {
          default: y(() => [
            u(a(ke), {
              title: r.title,
              models: r.models,
              inherits: "",
              value: h.value.program_models[r.name] || "",
              "data-profile-model": r.name,
              onPick: (C) => h.value.program_models[r.name] = C
            }, null, 8, ["title", "models", "value", "data-profile-model", "onPick"])
          ]),
          _: 2
        }, 1032, ["label", "for"]))), 128))
      ])
    ]));
  }
}, Ze = /* @__PURE__ */ D(Xe, [["__scopeId", "data-v-06548598"]]), el = ["data-profile-skill"], ll = { class: "profile-skill-text" }, al = { class: "profile-skill-head" }, tl = { class: "profile-skill-name" }, ol = {
  key: 0,
  class: "profile-skill-own",
  "data-profile-skill-own": ""
}, sl = ["title"], rl = { class: "profile-skill-end" }, il = {
  key: 0,
  class: "profile-skill-locked",
  "data-profile-skill-locked": ""
}, nl = {
  __name: "ProfileSkillRow",
  props: { row: { type: Object, required: !0 }, on: Boolean, required: Boolean },
  emits: ["toggle", "require"],
  setup(e, { emit: A }) {
    const o = A;
    return (h, i) => (l(), d("div", {
      class: ye(["profile-skill", { off: !e.on }]),
      "data-profile-skill": e.row.key
    }, [
      u(a(ne), {
        on: e.on,
        disabled: e.row.locked,
        title: `Give ${e.row.key} to this profile's agents`,
        "data-profile-skill-switch": "",
        onChange: i[0] || (i[0] = (p) => o("toggle", p))
      }, null, 8, ["on", "disabled", "title"]),
      m("span", ll, [
        m("span", al, [
          m("span", tl, I(e.row.key), 1),
          e.row.own ? (l(), d("span", ol, "Made for this type")) : w("", !0)
        ]),
        m("span", {
          class: "profile-skill-about",
          title: e.row.description
        }, I(e.row.description), 9, sl)
      ]),
      m("span", rl, [
        e.row.locked ? (l(), d("span", il, "Every agent reads this at the start")) : e.on ? (l(), N(a(ne), {
          key: 1,
          labelled: "",
          small: "",
          word: "Required",
          on: e.required,
          title: `Require ${e.row.key} at the start`,
          "data-profile-skill-required": "",
          onChange: i[1] || (i[1] = (p) => o("require", p))
        }, null, 8, ["on", "title"])) : w("", !0)
      ])
    ], 10, el));
  }
}, dl = /* @__PURE__ */ D(nl, [["__scopeId", "data-v-da955a19"]]), ul = {
  class: "profile-skills",
  "data-profile-skills": ""
}, pl = { class: "profile-skills-line" }, fl = {
  key: 0,
  class: "profile-skills-count",
  "data-profile-skill-count": ""
}, cl = { role: "alert" }, vl = {
  key: 2,
  class: "profile-skills-card"
}, ml = {
  key: 1,
  class: "profile-skills-note"
}, yl = {
  key: 2,
  class: "profile-skills-note"
}, kl = 8, hl = 3, gl = {
  __name: "ProfileSkillToggles",
  props: { profile: { type: String, required: !0 }, chosen: { type: Array, default: null }, requiredChosen: { type: Array, default: null } },
  emits: ["change", "change-required", "count"],
  setup(e, { emit: A }) {
    const o = e, h = A, i = oe(), p = q([]), r = q(""), C = q(!1), R = q(""), f = T(() => new Set(o.chosen ?? p.value.filter((v) => v.state === "on").map((v) => v.key))), S = T(() => new Set(o.requiredChosen ?? p.value.filter((v) => v.required).map((v) => v.key))), P = T(() => {
      const v = R.value.toLowerCase().split(/\s+/).filter(Boolean);
      return p.value.filter((g) => v.every((s) => he(g, s, ["key", "description"])));
    }), j = T(() => `${f.value.size} of ${p.value.length} on${S.value.size ? `, ${S.value.size} required` : ""}`);
    async function O() {
      C.value = !1, i.state["skills.profile"] = o.profile, await i.reload("skills");
      const v = i.props.skills;
      r.value = v.failure.value, p.value = r.value ? [] : v.data.value.rows, C.value = !0;
    }
    const x = (v) => p.value.filter((g) => v.has(g.key)).map((g) => g.key);
    function E(v, g) {
      const s = new Set(f.value);
      g ? s.add(v.key) : s.delete(v.key), h("change", x(s)), !g && S.value.has(v.key) && M(v, !1);
    }
    function M(v, g) {
      const s = new Set(S.value);
      g ? s.add(v.key) : s.delete(v.key), h("change-required", x(s));
    }
    return X(() => o.profile, O, { immediate: !0 }), X(() => f.value.size, (v) => h("count", v), { immediate: !0 }), (v, g) => (l(), d("div", ul, [
      m("div", pl, [
        g[1] || (g[1] = m("span", { class: "profile-skills-help" }, "Changing a skill here saves the whole list.", -1)),
        C.value && p.value.length ? (l(), d("span", fl, I(j.value), 1)) : w("", !0)
      ]),
      p.value.length > kl ? (l(), N(a(ge), {
        key: 0,
        modelValue: R.value,
        "onUpdate:modelValue": g[0] || (g[0] = (s) => R.value = s),
        "data-profile-skill-find": ""
      }, null, 8, ["modelValue"])) : w("", !0),
      r.value ? (l(), N(a(Q), {
        key: 1,
        tone: "danger"
      }, {
        default: y(() => [
          m("span", cl, I(r.value), 1),
          u(a(V), {
            variant: "ghost",
            small: "",
            "data-profile-skills-retry": "",
            onClick: O
          }, {
            default: y(() => [...g[2] || (g[2] = [
              W("Try again", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      })) : (l(), d("div", vl, [
        C.value ? p.value.length ? P.value.length ? (l(!0), d(L, { key: 3 }, J(P.value, (s) => (l(), N(dl, {
          key: s.key,
          row: s,
          on: f.value.has(s.key),
          required: S.value.has(s.key),
          onToggle: (b) => E(s, b),
          onRequire: (b) => M(s, b)
        }, null, 8, ["row", "on", "required", "onToggle", "onRequire"]))), 128)) : (l(), d("p", yl, "No skill matches that.")) : (l(), d("p", ml, "No skills are installed.")) : (l(), d(L, { key: 0 }, J(hl, (s) => m("div", {
          key: s,
          class: "profile-skills-skeleton"
        }, [
          u(a(be))
        ])), 64))
      ]))
    ]));
  }
}, bl = /* @__PURE__ */ D(gl, [["__scopeId", "data-v-5fb78afd"]]), _l = {
  class: "profile-reader",
  "data-profile-reader": ""
}, wl = {
  class: "profile-head",
  "data-profile-head": ""
}, $l = { class: "profile-title" }, Sl = { class: "profile-abstract" }, Tl = {
  key: 0,
  class: "profile-panel-meta",
  "data-profile-meta": ""
}, ql = { class: "profile-panel-name" }, Cl = {
  key: 0,
  class: "profile-panel-tag",
  title: "Your changes are kept through updates."
}, Il = {
  key: 1,
  class: "profile-panel-tag"
}, Pl = {
  key: 2,
  class: "profile-panel-tag"
}, Nl = {
  class: "profile-panel",
  "data-profile-panel": ""
}, Al = {
  role: "alert",
  "data-profile-panel-failure": ""
}, Rl = { "data-profile-panel-notice": "" }, jl = { class: "profile-panel-changed" }, xl = {
  class: "profile-panel-tab",
  "data-profile-tab": "instructions"
}, Bl = {
  class: "profile-panel-tab",
  "data-profile-tab": "tools"
}, Ol = {
  class: "profile-panel-tab",
  "data-profile-tab": "skills"
}, El = {
  key: 1,
  class: "profile-panel-reason"
}, Ml = {
  class: "profile-sections",
  "data-profile-sections": ""
}, Wl = {
  class: "profile-foot",
  "data-inspector-actions": ""
}, Ll = {
  key: 1,
  class: "profile-panel-unsaved",
  "data-profile-unsaved": ""
}, de = "writing", Ul = {
  __name: "ProfilePanel",
  props: { profile: { type: Object, required: !0 }, used: { type: String, default: "" }, types: { type: Array, default: () => [] }, programs: { type: Array, required: !0 }, notice: { type: String, default: "" }, failure: { type: String, default: "" } },
  emits: ["close", "save", "reset"],
  setup(e, { emit: A }) {
    const o = e, h = A, i = /^[a-z0-9_-]+$/i, p = [{ key: "about", label: "About" }, { key: "model", label: "Model" }, { key: "instructions", label: "Instructions" }, { key: "tools", label: "Tools" }, { key: "skills", label: "Skills", count_field: "skills" }], r = T(() => [{ key: "", label: "The parent program" }, ...o.programs.map((_) => ({ key: _.name, label: _.title }))]), C = T(() => o.types.map((_) => ({ key: _.key, label: _.label }))), R = ["title", "description", "agent_type", "access", "program", "preferred_program", "fallback_programs", "occupant", "mcp_tools", "program_models", "tier", "body"], f = q({}), S = q(p[0]), P = q(null);
    X(
      () => o.profile.name,
      () => {
        f.value = { name: o.profile.name, ...Object.fromEntries(R.map((_) => [_, o.profile[_]])), mcp_tools: o.profile.mcp_tools.join(","), fallback_programs: o.profile.fallback_programs.join(","), program_models: { ...o.profile.program_models }, skills: null, required_skills: null }, S.value = p[0], P.value = null;
      },
      { immediate: !0 }
    );
    const j = T(() => o.types.find((_) => _.key === f.value.agent_type)), O = T(() => {
      var _;
      return ((_ = j.value) == null ? void 0 : _.access) === de;
    }), x = T(() => [{ key: "read-only", label: "Read-only" }, ...O.value ? [{ key: de, label: "Writing" }] : []]);
    X(O, (_) => {
      _ || (f.value.access = "read-only");
    });
    const E = q(!1), M = (_, n, k) => n.map((K, te) => ({ line_type: _, line: te + 1, text: K })).filter((K) => !k.includes(K.text)), v = T(() => {
      const _ = o.profile.body.split(`
`), n = (o.profile.module_body || "").split(`
`);
      return [...M("del", _, n), ...M("add", n, _)];
    }), g = T(() => ({ ...o.profile, mcp_tools: o.profile.mcp_tools.join(","), fallback_programs: o.profile.fallback_programs.join(",") })), s = T(() => R.some((_) => JSON.stringify(f.value[_]) !== JSON.stringify(g.value[_])) || f.value.skills !== null || f.value.required_skills !== null || !o.profile.name), b = T(() => !o.profile.name && !i.test(f.value.name || "")), U = T(() => !f.value.description.trim()), z = T(() => s.value && !b.value && !U.value), ee = T(() => P.value === null ? {} : { skills: P.value }), ae = T(() => [o.profile.problem, ...o.profile.notes].filter(Boolean));
    return (_, n) => (l(), d("article", _l, [
      m("header", wl, [
        m("h2", $l, I(e.profile.title || e.profile.name || "New profile"), 1),
        m("p", Sl, I(e.profile.name ? e.used : "Instructions, type and model for an agent"), 1),
        e.profile.name ? (l(), d("div", Tl, [
          m("span", ql, I(e.profile.name), 1),
          e.profile.shipped ? (l(), d("span", Cl, "Comes with the journal")) : w("", !0),
          e.profile.changed.length ? (l(), d("span", Il, "Changed")) : w("", !0),
          e.profile.problem ? (l(), d("span", Pl, "Problem")) : w("", !0)
        ])) : w("", !0)
      ]),
      ie(_.$slots, "default", {}, void 0, !0),
      m("div", Nl, [
        e.failure ? (l(), N(a(Q), {
          key: 0,
          tone: "danger"
        }, {
          default: y(() => [
            m("span", Al, I(e.failure), 1)
          ]),
          _: 1
        })) : e.notice ? (l(), N(a(Q), { key: 1 }, {
          default: y(() => [
            m("span", Rl, I(e.notice), 1)
          ]),
          _: 1
        })) : w("", !0),
        (l(!0), d(L, null, J(ae.value, (k) => (l(), N(a(Q), {
          key: k,
          tone: "wait"
        }, {
          default: y(() => [
            W(I(k), 1)
          ]),
          _: 2
        }, 1024))), 128)),
        e.profile.module_text_changed ? (l(), d(L, { key: 2 }, [
          u(a(Q), null, {
            default: y(() => [
              m("span", jl, [
                n[13] || (n[13] = m("span", null, "Text changed: the journal's instructions have a new version.", -1)),
                u(a(V), {
                  variant: "ghost",
                  small: "",
                  "data-profile-compare": "",
                  onClick: n[0] || (n[0] = (k) => E.value = !E.value)
                }, {
                  default: y(() => [...n[12] || (n[12] = [
                    W("Compare", -1)
                  ])]),
                  _: 1
                })
              ])
            ]),
            _: 1
          }),
          E.value ? (l(), N(a(_e), {
            key: 0,
            path: "Instructions",
            change: "edit",
            added: v.value.filter((k) => k.line_type === "add").length,
            removed: v.value.filter((k) => k.line_type === "del").length,
            at: "",
            rows: v.value,
            "data-profile-diff": ""
          }, null, 8, ["added", "removed", "rows"])) : w("", !0)
        ], 64)) : w("", !0),
        u(a(we), {
          tabs: p,
          active: S.value,
          answer: ee.value,
          onChoose: n[1] || (n[1] = (k) => S.value = k)
        }, null, 8, ["active", "answer"]),
        u(a($e), { tab: S.value }, {
          default: y(() => [
            H(u(Ke, {
              draft: f.value,
              "onUpdate:draft": n[2] || (n[2] = (k) => f.value = k),
              profile: e.profile,
              choices: C.value,
              accesses: x.value,
              "picked-type": j.value,
              "name-is-bad": b.value,
              "description-is-empty": U.value
            }, null, 8, ["draft", "profile", "choices", "accesses", "picked-type", "name-is-bad", "description-is-empty"]), [
              [Y, S.value.key === "about"]
            ]),
            H(u(Ze, {
              draft: f.value,
              "onUpdate:draft": n[3] || (n[3] = (k) => f.value = k),
              programs: e.programs,
              "program-choices": r.value
            }, null, 8, ["draft", "programs", "program-choices"]), [
              [Y, S.value.key === "model"]
            ]),
            H(m("div", xl, [
              u(a(B), {
                label: "Instructions",
                for: "profile-body",
                help: "What it is told each time it starts, after the brief."
              }, {
                default: y(() => [
                  u(a(se), {
                    id: "profile-body",
                    rows: "16",
                    value: f.value.body,
                    onInput: n[4] || (n[4] = (k) => f.value.body = k.target.value)
                  }, null, 8, ["value"])
                ]),
                _: 1
              })
            ], 512), [
              [Y, S.value.key === "instructions"]
            ]),
            H(m("div", Bl, [
              u(a(B), {
                label: "MCP tools this profile may call",
                for: "profile-mcp",
                help: "Separate the names with commas."
              }, {
                default: y(() => [
                  u(a(Z), {
                    id: "profile-mcp",
                    value: f.value.mcp_tools,
                    onInput: n[5] || (n[5] = (k) => f.value.mcp_tools = k.target.value)
                  }, null, 8, ["value"])
                ]),
                _: 1
              })
            ], 512), [
              [Y, S.value.key === "tools"]
            ]),
            H(m("div", Ol, [
              e.profile.name ? (l(), N(bl, {
                key: 0,
                profile: e.profile.name,
                chosen: f.value.skills,
                "required-chosen": f.value.required_skills,
                onChange: n[6] || (n[6] = (k) => f.value.skills = k),
                onChangeRequired: n[7] || (n[7] = (k) => f.value.required_skills = k),
                onCount: n[8] || (n[8] = (k) => P.value = k)
              }, null, 8, ["profile", "chosen", "required-chosen"])) : (l(), d("p", El, "Save the profile first, then choose its skills."))
            ], 512), [
              [Y, S.value.key === "skills"]
            ])
          ]),
          _: 1
        }, 8, ["tab"]),
        m("div", Ml, [
          ie(_.$slots, "sections", { profile: e.profile }, void 0, !0)
        ])
      ]),
      m("footer", Wl, [
        u(a(V), {
          variant: "ghost",
          small: "",
          "data-profile-cancel": "",
          onClick: n[9] || (n[9] = (k) => h("close"))
        }, {
          default: y(() => [...n[14] || (n[14] = [
            W("Cancel", -1)
          ])]),
          _: 1
        }),
        e.profile.changed.length || e.profile.problem ? (l(), N(a(V), {
          key: 0,
          variant: "ghost",
          small: "",
          "data-profile-reset": "",
          onClick: n[10] || (n[10] = (k) => h("reset", e.profile))
        }, {
          default: y(() => [...n[15] || (n[15] = [
            W("Use the journal's version", -1)
          ])]),
          _: 1
        })) : w("", !0),
        n[17] || (n[17] = m("span", { class: "profile-panel-grow" }, null, -1)),
        s.value && e.profile.name ? (l(), d("span", Ll, "Unsaved changes")) : w("", !0),
        u(a(V), {
          variant: "primary",
          small: "",
          disabled: !z.value,
          "data-profile-save": "",
          onClick: n[11] || (n[11] = (k) => h("save", e.profile, f.value))
        }, {
          default: y(() => [...n[16] || (n[16] = [
            W("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ]));
  }
}, Vl = /* @__PURE__ */ D(Ul, [["__scopeId", "data-v-81e8ee3b"]]), Fl = {
  key: 0,
  class: "note",
  "data-profile-notice": ""
}, Dl = {
  key: 1,
  class: "note failed",
  role: "alert",
  "data-profile-failure": ""
}, zl = {
  key: 2,
  class: "note failed",
  role: "alert"
}, Hl = {
  key: 0,
  class: "faint"
}, Gl = {
  key: 1,
  class: "faint",
  title: "Other profiles extend this one; it is never started by itself",
  "data-profile-base": ""
}, Jl = {
  key: 2,
  class: "faint"
}, Kl = 360, F = "__new", Yl = {
  __name: "ProfileRows",
  setup(e) {
    const A = { name: "", title: "", description: "", agent_type: "helper", access: "read-only", program: "", occupant: "when-cold", mcp_tools: [], fallback_programs: [], changed: [], notes: [], problem: "", program_models: {}, tier: null, body: "", shipped: !1, uses: 0 }, o = oe(), { rows: h, listing: i, failure: p, loaded: r, act: C, actionFailure: R } = o.props.profiles, f = o.props.programs.rows, S = T(() => i.value ? i.value.types : []), P = q(null), j = q(null), O = q(0), x = q(""), E = q(Se([])), M = q(""), v = (t) => {
      var c;
      return ((c = S.value.find(($) => $.key === t.agent_type)) == null ? void 0 : c.label) || t.agent_type;
    }, g = T(() => [{ key: "type", label: "Type", options: S.value.map((t) => [t.key, t.label]), get: (t) => t.p.agent_type }]), s = (t) => t.uses ? `Uses: ${t.uses} ${t.uses === 1 ? "time" : "times"}, last ${Ne(new Date(t.last_used * 1e3).toISOString())}` : "Uses: none", b = (t) => f.value.map((c) => {
      var $;
      return `${(($ = t.program_models) == null ? void 0 : $[c.name]) || "chosen at start"} on ${c.title}`;
    }).join(" · "), U = T(() => [
      ...j.value ? [{ id: F, title: j.value.title || "New profile", desc: "Not saved", group: "New", p: j.value }] : [],
      ...h.value.map((t) => ({ id: t.name, title: t.title || t.name, desc: b(t), group: t.is_base ? "Base profiles" : v(t), kind: v(t), p: t }))
    ]), z = T(() => Te(U.value, g.value, E.value, M.value, ["id", "title", "desc", "kind"])), ee = (t) => {
      j.value = t, O.value += 1, P.value = F;
    }, ae = () => ee({ ...A }), _ = (t) => ee({ ...t, name: "", title: `${t.title || t.name} copy`, shipped: !1, changed: [], uses: 0, problem: "", notes: [], module_text_changed: !1, is_base: !1 }), n = () => {
      j.value = null, P.value = null;
    };
    async function k(t) {
      x.value = "", (await C(["profile", "reset", t.name])).ok && (x.value = `${t.name} is back to the journal's version.`);
    }
    async function K(t, c) {
      var re;
      x.value = "";
      const $ = t.name || c.name;
      (await C(["profile", "save", $, ...c.title ? ["--title", c.title] : [], "--description", c.description, "--type", c.agent_type, "--access", c.access, "--program", c.program, c.preferred_program ? "--program-if-possible" : "--no-program-if-possible", "--fallback-programs", c.fallback_programs, "--tier", c.tier || "", ...f.value.flatMap((le) => [le.model_option, c.program_models[le.name] || ""]), "--mcp-tools", c.mcp_tools, ...(re = S.value.find((le) => le.key === c.agent_type)) != null && re.declares_occupant ? ["--occupant", c.occupant] : [], "--body", c.body, ...c.skills ? ["--skills", c.skills.join(",")] : [], ...c.required_skills ? ["--required-skills", c.required_skills.join(",")] : []])).ok && (j.value = null, P.value = $, x.value = `${$} saved. The agent will use it the next time it starts a helper with this profile.`);
    }
    const te = (t) => !!(t.changed.length || t.problem || t.module_text_changed), fe = (t) => [
      { label: "Open", group: "open", disabled: t.id === P.value, reason: "Already open", run: () => P.value = t.id },
      { label: "Duplicate", group: "open", disabled: t.id === F, reason: "Not saved yet", run: () => _(t.p) },
      { label: "Copy name", group: "copy", disabled: t.id === F, reason: "Not saved yet", run: ({ say: c }) => Ae(t.id, t.id, c) },
      { label: "Reset", group: "own", disabled: t.id === F || !t.p.module || !te(t.p), reason: "Same as the journal's version", run: () => k(t.p) },
      { label: "Remove", group: "delete", danger: !0, armedLabel: "Remove: click again", disabled: t.id === F || !!t.p.module, reason: "Comes with the journal", run: () => C(["profile", "remove", t.id], Re(t.id)) }
    ], ce = (t) => ({ head: t.title, items: fe(t) });
    return (t, c) => (l(), N(a(qe), {
      chosen: P.value,
      "onUpdate:chosen": c[2] || (c[2] = ($) => P.value = $),
      items: z.value,
      "list-width": Kl,
      place: ce,
      "empty-title": "No profiles yet",
      "pick-line": "No profile chosen",
      "data-profiles": ""
    }, {
      top: y(() => [
        u(a(Ie), {
          title: "Profiles",
          count: a(h).length
        }, {
          primary: y(() => [
            u(a(V), {
              small: "",
              variant: "primary",
              "data-profile-new": "",
              onClick: ae
            }, {
              default: y(() => [...c[3] || (c[3] = [
                W("New profile", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["count"]),
        u(a(Pe), {
          modelValue: E.value,
          "onUpdate:modelValue": c[0] || (c[0] = ($) => E.value = $),
          words: M.value,
          "onUpdate:words": c[1] || (c[1] = ($) => M.value = $),
          fields: g.value,
          rows: U.value,
          shown: z.value.length,
          placeholder: "Search profiles",
          "data-profile-find": ""
        }, null, 8, ["modelValue", "words", "fields", "rows", "shown"]),
        x.value ? (l(), d("p", Fl, I(x.value), 1)) : w("", !0),
        a(R) ? (l(), d("p", Dl, I(a(R)), 1)) : w("", !0),
        a(p) ? (l(), d("p", zl, I(a(p)), 1)) : w("", !0)
      ]),
      empty: y(() => [
        a(r) ? (l(), d(L, { key: 1 }, [
          W("A profile gives an agent its instructions, type and model. The journal includes standard profiles.")
        ], 64)) : (l(), N(a(Ce), {
          key: 0,
          shape: "rows"
        }))
      ]),
      meta: y(({ item: $ }) => [
        $.id === F ? (l(), d("span", Hl, "New")) : $.p.is_base ? (l(), d("span", Gl, "Base")) : $.p.changed.length ? (l(), d("span", Jl, "Changed")) : w("", !0)
      ]),
      reader: y(({ item: $ }) => [
        (l(), N(Vl, {
          key: `${$.id}-${O.value}`,
          notice: x.value,
          failure: a(R),
          programs: a(f),
          types: S.value,
          profile: $.p,
          used: s($.p),
          onClose: n,
          onSave: K,
          onReset: k
        }, {
          default: y(() => [
            $.p.name && $.p.agent_type === "helper" ? (l(), N(Fe, {
              key: 0,
              programs: a(f),
              profile: $.p.name
            }, null, 8, ["programs", "profile"])) : w("", !0)
          ]),
          _: 2
        }, 1032, ["notice", "failure", "programs", "types", "profile", "used"]))
      ]),
      _: 1
    }, 8, ["chosen", "items"]));
  }
}, ea = /* @__PURE__ */ D(Yl, [["__scopeId", "data-v-d94d1998"]]);
export {
  ea as default
};
