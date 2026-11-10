if (!document.getElementById("window-styles-5d737a926248")) { const style = document.createElement("style"); style.id = "window-styles-5d737a926248"; style.textContent = ".helper-start[data-v-382ed53a]{display:grid;gap:12px;padding:0 0 20px;margin-bottom:20px;border-bottom:1px solid var(--border-2)}h3[data-v-382ed53a]{margin:0;font-size:14px;font-weight:600}.field[data-v-382ed53a]{display:grid;gap:4px}.field>span[data-v-382ed53a]{color:var(--text-2);font-size:12px;font-weight:500}.reason[data-v-382ed53a],.notice[data-v-382ed53a]{margin:0;color:var(--text-3);font-size:12px;line-height:1.5;overflow-wrap:anywhere}.idle-helper[data-v-382ed53a]{display:flex;align-items:center;justify-content:space-between;gap:12px}.profile-panel-tab[data-v-29dafd7a]{display:flex;flex-direction:column;gap:14px}.profile-panel-reason[data-v-29dafd7a]{margin:0;color:var(--text-3);font-size:12px}.profile-panel-tab[data-v-06548598]{display:flex;flex-direction:column;gap:14px}.profile-panel-models[data-v-06548598]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}.profile-skill[data-v-da955a19]{display:flex;gap:10px;align-items:flex-start;padding:10px 12px}.profile-skill+.profile-skill[data-v-da955a19]{border-top:1px solid var(--border)}.profile-skill-text[data-v-da955a19]{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0}.profile-skill-head[data-v-da955a19]{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.profile-skill-name[data-v-da955a19]{color:var(--text);font-size:13px}.profile-skill.off .profile-skill-name[data-v-da955a19]{color:var(--text-3)}.profile-skill-own[data-v-da955a19]{padding:0 5px;border:1px solid var(--border-2);border-radius:5px;color:var(--text-3);font-size:10px}.profile-skill-about[data-v-da955a19]{display:-webkit-box;overflow:hidden;color:var(--text-3);font-size:12px;-webkit-box-orient:vertical;-webkit-line-clamp:2}.profile-skill-end[data-v-da955a19]{display:flex;flex:none;justify-content:flex-end;min-width:84px}.profile-skill-locked[data-v-da955a19]{max-width:130px;color:var(--text-3);font-size:11.5px;text-align:right}@media(max-width:640px){.profile-skill[data-v-da955a19]{flex-wrap:wrap}.profile-skill-end[data-v-da955a19]{justify-content:flex-start;width:100%;padding-left:38px}}.profile-skills[data-v-5fb78afd]{display:flex;flex-direction:column;gap:10px}.profile-skills-line[data-v-5fb78afd]{display:flex;gap:12px;align-items:baseline;justify-content:space-between}.profile-skills-help[data-v-5fb78afd],.profile-skills-count[data-v-5fb78afd],.profile-skills-note[data-v-5fb78afd]{margin:0;color:var(--text-3);font-size:12px}.profile-skills-card[data-v-5fb78afd]{border:1px solid var(--border);border-radius:8px;background:var(--bg-2)}.profile-skills-skeleton[data-v-5fb78afd],.profile-skills-note[data-v-5fb78afd]{padding:10px 12px}.profile-panel[data-v-a5586041],.profile-panel-tab[data-v-a5586041]{display:flex;flex-direction:column;gap:14px}.profile-panel-meta[data-v-a5586041]{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:8px}.profile-panel-name[data-v-a5586041]{color:var(--text-3);font-size:12px}.profile-panel-tag[data-v-a5586041]{padding:0 5px;border:1px solid var(--border-2);border-radius:5px;color:var(--text-3);font-size:10px}.profile-panel-changed[data-v-a5586041]{display:flex;gap:10px;align-items:center;justify-content:space-between}.profile-panel-reason[data-v-a5586041],.profile-panel-unsaved[data-v-a5586041]{margin:0;color:var(--text-3);font-size:12px}.profile-panel-grow[data-v-a5586041]{flex:1}.profiles[data-v-bd1b1e56]{padding:0 0 40px}.bar[data-v-bd1b1e56]{flex-wrap:wrap;gap:8px 12px;color:var(--text-2)}.count[data-v-bd1b1e56]{margin-left:auto;color:var(--text-3);font-size:12.5px}.notice[data-v-bd1b1e56]{font-size:12px;color:var(--text-2)}.notice.failed[data-v-bd1b1e56]{color:var(--danger)}.empty[data-v-bd1b1e56]{margin:40px auto;max-width:480px}.rows[data-v-bd1b1e56]{display:flex;flex-direction:column;padding:8px 14px 0 22px}.profile-open[data-v-bd1b1e56]{text-align:left}.profile-meta[data-v-bd1b1e56]{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:12px}.profile-model[data-v-bd1b1e56]{color:var(--text-2)}.profile-used[data-v-bd1b1e56]{color:var(--text-3);white-space:nowrap}.profile-warning[data-v-bd1b1e56]{color:var(--tone-warn)}.profile-used.never[data-v-bd1b1e56]{color:var(--text-4)}@media(max-width:640px){.profiles-find[data-v-bd1b1e56]{flex:1 1 100%}.profile-meta[data-v-bd1b1e56]{display:none}}\n"; document.head.appendChild(style); }
import { ref as I, computed as C, watch as Q, openBlock as l, createElementBlock as i, withModifiers as ce, createElementVNode as y, createVNode as f, unref as e, withDirectives as H, Fragment as W, renderList as F, toDisplayString as T, vModelSelect as ve, withCtx as m, createTextVNode as M, createCommentVNode as _, useModel as ie, createBlock as q, mergeModels as ue, normalizeClass as de, renderSlot as me, vShow as K } from "vue";
import { useWindow as ae, TextArea as oe, Btn as L, TextInput as X, FormField as O, Segmented as J, ModelPicker as ye, Switch as re, matchesSearch as pe, SearchBar as fe, Notice as Y, SkeletonLine as ke, SidePanel as ge, DiffCard as he, InnerTabs as be, EmptyState as te, ListRow as _e, ago as we } from "@journal/window-kit";
const z = (t, x) => {
  const a = t.__vccOpts || t;
  for (const [k, r] of x)
    a[k] = r;
  return a;
}, $e = { class: "field" }, Se = { class: "field" }, Te = ["disabled"], Ce = ["value"], qe = ["data-helper-idle"], Ie = {
  key: 0,
  class: "field"
}, Pe = {
  key: 1,
  class: "reason",
  "data-helper-fresh-blocked": ""
}, xe = {
  key: 2,
  class: "reason",
  "data-helper-start-reason": ""
}, Ae = {
  key: 3,
  class: "notice"
}, je = {
  __name: "HelperStartForm",
  props: { profile: { type: String, required: !0 }, programs: { type: Array, required: !0 } },
  setup(t) {
    const x = t, a = ae(), k = { can_start: !1, reason: "", programs: [], idle_helpers: [], can_start_fresh: !1, fresh_reason: "" }, r = I(k), u = I(""), s = I(""), P = I(""), A = I(""), c = I(!1), S = I(!0);
    let R = 0;
    const N = C(() => !c.value && !S.value && !!u.value.trim()), E = C(() => !N.value || !(r.value.can_start || r.value.can_start_fresh && A.value.trim()));
    async function j() {
      const b = ++R;
      if (S.value = !0, a.state["availability.profile"] = x.profile, s.value ? a.state["availability.program"] = s.value : delete a.state["availability.program"], await a.reload("availability"), b !== R) return;
      const o = a.props.availability;
      o.failure.value ? (r.value = k, P.value = o.failure.value) : r.value = o.data.value, S.value = !1;
    }
    async function B() {
      E.value || await d(["helper", "start", x.profile, "--brief", u.value, ...s.value ? ["--program", s.value] : [], ...A.value.trim() ? ["--fresh", A.value.trim()] : []], "The read-only helper is starting.");
    }
    async function V(b) {
      N.value && await d(["helper", "send", String(b), u.value], "Job sent.");
    }
    async function d(b, o) {
      c.value = !0;
      try {
        const h = await a.run(b);
        P.value = h.ok ? o : h.error, h.ok && (u.value = "", A.value = ""), await j();
      } finally {
        c.value = !1;
      }
    }
    return Q([() => x.profile, s], j, { immediate: !0 }), (b, o) => (l(), i("form", {
      class: "helper-start",
      "data-helper-start": "",
      onSubmit: ce(B, ["prevent"])
    }, [
      o[9] || (o[9] = y("h3", null, "Give a read-only helper a job", -1)),
      y("label", $e, [
        o[3] || (o[3] = y("span", null, "The job", -1)),
        f(e(oe), {
          value: u.value,
          rows: "3",
          disabled: c.value,
          "data-helper-brief": "",
          onInput: o[0] || (o[0] = (h) => u.value = h.target.value)
        }, null, 8, ["value", "disabled"])
      ]),
      y("label", Se, [
        o[5] || (o[5] = y("span", null, "Program", -1)),
        H(y("select", {
          "onUpdate:modelValue": o[1] || (o[1] = (h) => s.value = h),
          disabled: c.value,
          "data-helper-program": ""
        }, [
          o[4] || (o[4] = y("option", { value: "" }, "The profile program", -1)),
          (l(!0), i(W, null, F(r.value.programs, (h) => {
            var U;
            return l(), i("option", {
              key: h,
              value: h
            }, T(((U = t.programs.find((G) => G.name === h)) == null ? void 0 : U.title) || h), 9, Ce);
          }), 128))
        ], 8, Te), [
          [ve, s.value]
        ])
      ]),
      (l(!0), i(W, null, F(r.value.idle_helpers, (h) => (l(), i("div", {
        key: h.id,
        class: "idle-helper",
        "data-helper-idle": h.id
      }, [
        y("span", null, T(h.name) + " · Idle", 1),
        f(e(L), {
          type: "button",
          disabled: !N.value,
          "data-helper-send": h.id,
          onClick: (U) => V(h.number)
        }, {
          default: m(() => [...o[6] || (o[6] = [
            M("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled", "data-helper-send", "onClick"])
      ], 8, qe))), 128)),
      r.value.idle_helpers.length ? (l(), i("label", Ie, [
        o[7] || (o[7] = y("span", null, "Why start another helper?", -1)),
        f(e(X), {
          modelValue: A.value,
          "onUpdate:modelValue": o[2] || (o[2] = (h) => A.value = h),
          disabled: c.value,
          "data-helper-fresh-reason": ""
        }, null, 8, ["modelValue", "disabled"])
      ])) : _("", !0),
      f(e(L), {
        type: "submit",
        disabled: E.value,
        "data-helper-start-button": ""
      }, {
        default: m(() => [...o[8] || (o[8] = [
          M("Start a read-only helper", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      r.value.fresh_reason ? (l(), i("p", Pe, T(r.value.fresh_reason), 1)) : _("", !0),
      r.value.reason && r.value.reason !== r.value.fresh_reason ? (l(), i("p", xe, T(r.value.reason), 1)) : _("", !0),
      P.value ? (l(), i("p", Ae, T(P.value), 1)) : _("", !0)
    ], 32));
  }
}, Re = /* @__PURE__ */ z(je, [["__scopeId", "data-v-382ed53a"]]), Ne = {
  class: "profile-panel-tab",
  "data-profile-tab": "about"
}, Be = {
  key: 0,
  class: "profile-panel-reason"
}, Oe = {
  key: 1,
  class: "profile-panel-reason"
}, Ee = {
  key: 0,
  "data-profile-type-locked": ""
}, Me = {
  __name: "ProfileAboutTab",
  props: /* @__PURE__ */ ue({ profile: { type: Object, required: !0 }, choices: { type: Array, required: !0 }, accesses: { type: Array, required: !0 }, pickedType: { type: Object, default: null }, nameIsBad: Boolean, descriptionIsEmpty: Boolean }, {
    draft: { type: Object, required: !0 },
    draftModifiers: {}
  }),
  emits: ["update:draft"],
  setup(t) {
    const x = [{ key: "continue", label: "Resume it" }, { key: "when-cold", label: "Start over after a long pause" }, { key: "each-launch", label: "New for each job" }], a = ie(t, "draft");
    return (k, r) => {
      var u;
      return l(), i("div", Ne, [
        t.profile.name ? _("", !0) : (l(), i(W, { key: 0 }, [
          f(e(O), {
            label: "Name",
            for: "profile-name",
            help: "Letters, digits and dashes; the agent starts it by this name."
          }, {
            default: m(() => [
              f(e(X), {
                id: "profile-name",
                value: a.value.name,
                placeholder: "critic",
                onInput: r[0] || (r[0] = (s) => a.value.name = s.target.value.trim())
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          t.nameIsBad && a.value.name ? (l(), i("p", Be, "Use letters, digits and dashes.")) : _("", !0)
        ], 64)),
        f(e(O), {
          label: "Title",
          for: "profile-title"
        }, {
          default: m(() => [
            f(e(X), {
              id: "profile-title",
              value: a.value.title,
              onInput: r[1] || (r[1] = (s) => a.value.title = s.target.value)
            }, null, 8, ["value"])
          ]),
          _: 1
        }),
        f(e(O), {
          label: "When it is used",
          for: "profile-description",
          help: "The agent reads this to decide when to start it."
        }, {
          default: m(() => [
            f(e(oe), {
              id: "profile-description",
              rows: "3",
              value: a.value.description,
              onInput: r[2] || (r[2] = (s) => a.value.description = s.target.value)
            }, null, 8, ["value"])
          ]),
          _: 1
        }),
        t.descriptionIsEmpty ? (l(), i("p", Oe, "Describe when the agent should start it.")) : _("", !0),
        f(e(O), {
          label: "Type",
          for: "profile-type",
          help: "The type of agent that runs this profile."
        }, {
          default: m(() => {
            var s;
            return [
              t.profile.shipped ? (l(), i("span", Ee, T((s = t.pickedType) == null ? void 0 : s.label), 1)) : (l(), q(e(J), {
                key: 1,
                "data-profile-type": "",
                options: t.choices,
                value: a.value.agent_type,
                onPick: r[3] || (r[3] = (P) => a.value.agent_type = P)
              }, null, 8, ["options", "value"]))
            ];
          }),
          _: 1
        }),
        f(e(O), {
          label: "Access",
          for: "profile-access",
          help: "Whether it may change files."
        }, {
          default: m(() => [
            f(e(J), {
              "data-profile-access": "",
              options: t.accesses,
              value: a.value.access,
              onPick: r[4] || (r[4] = (s) => a.value.access = s)
            }, null, 8, ["options", "value"])
          ]),
          _: 1
        }),
        (u = t.pickedType) != null && u.declares_occupant ? (l(), q(e(O), {
          key: 2,
          label: "Conversation",
          for: "profile-occupant",
          help: "What the agent does with its conversation when it gets its next job. The agent itself is kept in each case."
        }, {
          default: m(() => [
            f(e(J), {
              "data-profile-occupant": "",
              options: x,
              value: a.value.occupant,
              onPick: r[5] || (r[5] = (s) => a.value.occupant = s)
            }, null, 8, ["value"])
          ]),
          _: 1
        })) : _("", !0)
      ]);
    };
  }
}, We = /* @__PURE__ */ z(Me, [["__scopeId", "data-v-29dafd7a"]]), Ve = {
  class: "profile-panel-tab",
  "data-profile-tab": "model"
}, Le = { class: "profile-panel-models" }, Ue = {
  __name: "ProfileModelTab",
  props: /* @__PURE__ */ ue({ programs: { type: Array, required: !0 }, programChoices: { type: Array, required: !0 } }, {
    draft: { type: Object, required: !0 },
    draftModifiers: {}
  }),
  emits: ["update:draft"],
  setup(t) {
    const x = [{ key: "always", label: "Always this program" }, { key: "possible", label: "This program if possible" }], a = [{ key: "", label: "Profile models" }, { key: "fast", label: "Fast" }, { key: "general", label: "General" }, { key: "strongest", label: "Strongest" }], k = ie(t, "draft");
    return (r, u) => (l(), i("div", Ve, [
      f(e(O), {
        label: "Program",
        for: "profile-program",
        help: "A registered program, or the same program as the agent that starts it."
      }, {
        default: m(() => [
          f(e(J), {
            options: t.programChoices,
            value: k.value.program,
            onPick: u[0] || (u[0] = (s) => k.value.program = s)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }),
      k.value.program ? (l(), i(W, { key: 0 }, [
        f(e(O), {
          label: "When it cannot start",
          for: "profile-program-choice",
          help: "If possible: a start uses the other program, on its model, when this one is not installed or not ready, and says so."
        }, {
          default: m(() => [
            f(e(J), {
              "data-profile-program-choice": "",
              options: x,
              value: k.value.preferred_program ? "possible" : "always",
              onPick: u[1] || (u[1] = (s) => k.value.preferred_program = s === "possible")
            }, null, 8, ["value"])
          ]),
          _: 1
        }),
        k.value.preferred_program ? (l(), q(e(O), {
          key: 0,
          label: "Programs to try instead",
          for: "profile-fallbacks",
          help: "Program names in the order to try them, separated by commas. Blank tries every other program."
        }, {
          default: m(() => [
            f(e(X), {
              id: "profile-fallbacks",
              value: k.value.fallback_programs,
              "data-profile-fallbacks": "",
              onInput: u[2] || (u[2] = (s) => k.value.fallback_programs = s.target.value)
            }, null, 8, ["value"])
          ]),
          _: 1
        })) : _("", !0)
      ], 64)) : _("", !0),
      f(e(O), {
        label: "Model tier",
        for: "profile-tier",
        help: "Chooses a model when this profile has no named model for the program."
      }, {
        default: m(() => [
          f(e(J), {
            "data-profile-tier": "",
            options: a,
            value: k.value.tier || "",
            onPick: u[3] || (u[3] = (s) => k.value.tier = s || null)
          }, null, 8, ["value"])
        ]),
        _: 1
      }),
      y("div", Le, [
        (l(!0), i(W, null, F(t.programs, (s) => (l(), q(e(O), {
          key: s.name,
          label: `Model on ${s.title}`,
          for: `profile-model-${s.name}`,
          help: "The least expensive model that reliably fits the work."
        }, {
          default: m(() => [
            f(e(ye), {
              title: s.title,
              models: s.models,
              inherits: "",
              value: k.value.program_models[s.name] || "",
              "data-profile-model": s.name,
              onPick: (P) => k.value.program_models[s.name] = P
            }, null, 8, ["title", "models", "value", "data-profile-model", "onPick"])
          ]),
          _: 2
        }, 1032, ["label", "for"]))), 128))
      ])
    ]));
  }
}, Fe = /* @__PURE__ */ z(Ue, [["__scopeId", "data-v-06548598"]]), De = ["data-profile-skill"], ze = { class: "profile-skill-text" }, Ge = { class: "profile-skill-head" }, He = { class: "profile-skill-name" }, Je = {
  key: 0,
  class: "profile-skill-own",
  "data-profile-skill-own": ""
}, Ke = ["title"], Ye = { class: "profile-skill-end" }, Qe = {
  key: 0,
  class: "profile-skill-locked",
  "data-profile-skill-locked": ""
}, Xe = {
  __name: "ProfileSkillRow",
  props: { row: { type: Object, required: !0 }, on: Boolean, required: Boolean },
  emits: ["toggle", "require"],
  setup(t, { emit: x }) {
    const a = x;
    return (k, r) => (l(), i("div", {
      class: de(["profile-skill", { off: !t.on }]),
      "data-profile-skill": t.row.key
    }, [
      f(e(re), {
        on: t.on,
        disabled: t.row.locked,
        title: `Give ${t.row.key} to this profile's agents`,
        "data-profile-skill-switch": "",
        onChange: r[0] || (r[0] = (u) => a("toggle", u))
      }, null, 8, ["on", "disabled", "title"]),
      y("span", ze, [
        y("span", Ge, [
          y("span", He, T(t.row.key), 1),
          t.row.own ? (l(), i("span", Je, "Made for this type")) : _("", !0)
        ]),
        y("span", {
          class: "profile-skill-about",
          title: t.row.description
        }, T(t.row.description), 9, Ke)
      ]),
      y("span", Ye, [
        t.row.locked ? (l(), i("span", Qe, "Every agent reads this at the start")) : t.on ? (l(), q(e(re), {
          key: 1,
          labelled: "",
          small: "",
          word: "Required",
          on: t.required,
          title: `Require ${t.row.key} at the start`,
          "data-profile-skill-required": "",
          onChange: r[1] || (r[1] = (u) => a("require", u))
        }, null, 8, ["on", "title"])) : _("", !0)
      ])
    ], 10, De));
  }
}, Ze = /* @__PURE__ */ z(Xe, [["__scopeId", "data-v-da955a19"]]), el = {
  class: "profile-skills",
  "data-profile-skills": ""
}, ll = { class: "profile-skills-line" }, tl = {
  key: 0,
  class: "profile-skills-count",
  "data-profile-skill-count": ""
}, al = { role: "alert" }, ol = {
  key: 2,
  class: "profile-skills-card"
}, sl = {
  key: 1,
  class: "profile-skills-note"
}, rl = {
  key: 2,
  class: "profile-skills-note"
}, nl = 8, il = 3, ul = {
  __name: "ProfileSkillToggles",
  props: { profile: { type: String, required: !0 }, chosen: { type: Array, default: null }, requiredChosen: { type: Array, default: null } },
  emits: ["change", "change-required", "count"],
  setup(t, { emit: x }) {
    const a = t, k = x, r = ae(), u = I([]), s = I(""), P = I(!1), A = I(""), c = C(() => new Set(a.chosen ?? u.value.filter((d) => d.state === "on").map((d) => d.key))), S = C(() => new Set(a.requiredChosen ?? u.value.filter((d) => d.required).map((d) => d.key))), R = C(() => {
      const d = A.value.toLowerCase().split(/\s+/).filter(Boolean);
      return u.value.filter((b) => d.every((o) => pe(b, o, ["key", "description"])));
    }), N = C(() => `${c.value.size} of ${u.value.length} on${S.value.size ? `, ${S.value.size} required` : ""}`);
    async function E() {
      P.value = !1, r.state["skills.profile"] = a.profile, await r.reload("skills");
      const d = r.props.skills;
      s.value = d.failure.value, u.value = s.value ? [] : d.data.value.rows, P.value = !0;
    }
    const j = (d) => u.value.filter((b) => d.has(b.key)).map((b) => b.key);
    function B(d, b) {
      const o = new Set(c.value);
      b ? o.add(d.key) : o.delete(d.key), k("change", j(o)), !b && S.value.has(d.key) && V(d, !1);
    }
    function V(d, b) {
      const o = new Set(S.value);
      b ? o.add(d.key) : o.delete(d.key), k("change-required", j(o));
    }
    return Q(() => a.profile, E, { immediate: !0 }), Q(() => c.value.size, (d) => k("count", d), { immediate: !0 }), (d, b) => (l(), i("div", el, [
      y("div", ll, [
        b[1] || (b[1] = y("span", { class: "profile-skills-help" }, "Changing a skill here saves the whole list.", -1)),
        P.value && u.value.length ? (l(), i("span", tl, T(N.value), 1)) : _("", !0)
      ]),
      u.value.length > nl ? (l(), q(e(fe), {
        key: 0,
        modelValue: A.value,
        "onUpdate:modelValue": b[0] || (b[0] = (o) => A.value = o),
        "data-profile-skill-find": ""
      }, null, 8, ["modelValue"])) : _("", !0),
      s.value ? (l(), q(e(Y), {
        key: 1,
        tone: "danger"
      }, {
        default: m(() => [
          y("span", al, T(s.value), 1),
          f(e(L), {
            variant: "ghost",
            small: "",
            "data-profile-skills-retry": "",
            onClick: E
          }, {
            default: m(() => [...b[2] || (b[2] = [
              M("Try again", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      })) : (l(), i("div", ol, [
        P.value ? u.value.length ? R.value.length ? (l(!0), i(W, { key: 3 }, F(R.value, (o) => (l(), q(Ze, {
          key: o.key,
          row: o,
          on: c.value.has(o.key),
          required: S.value.has(o.key),
          onToggle: (h) => B(o, h),
          onRequire: (h) => V(o, h)
        }, null, 8, ["row", "on", "required", "onToggle", "onRequire"]))), 128)) : (l(), i("p", rl, "No skill matches that.")) : (l(), i("p", sl, "No skills are installed.")) : (l(), i(W, { key: 0 }, F(il, (o) => y("div", {
          key: o,
          class: "profile-skills-skeleton"
        }, [
          f(e(ke))
        ])), 64))
      ]))
    ]));
  }
}, dl = /* @__PURE__ */ z(ul, [["__scopeId", "data-v-5fb78afd"]]), pl = {
  key: 0,
  class: "profile-panel-meta",
  "data-profile-meta": ""
}, fl = { class: "profile-panel-name" }, cl = {
  key: 0,
  class: "profile-panel-tag",
  title: "Your changes are kept through updates."
}, vl = {
  key: 1,
  class: "profile-panel-tag"
}, ml = {
  key: 2,
  class: "profile-panel-tag"
}, yl = {
  class: "profile-panel",
  "data-profile-panel": ""
}, kl = {
  role: "alert",
  "data-profile-panel-failure": ""
}, gl = { "data-profile-panel-notice": "" }, hl = { class: "profile-panel-changed" }, bl = {
  class: "profile-panel-tab",
  "data-profile-tab": "instructions"
}, _l = {
  class: "profile-panel-tab",
  "data-profile-tab": "tools"
}, wl = {
  class: "profile-panel-tab",
  "data-profile-tab": "skills"
}, $l = {
  key: 1,
  class: "profile-panel-reason"
}, Sl = {
  key: 1,
  class: "profile-panel-unsaved",
  "data-profile-unsaved": ""
}, ne = "writing", Tl = {
  __name: "ProfilePanel",
  props: { profile: { type: Object, required: !0 }, used: { type: String, default: "" }, types: { type: Array, default: () => [] }, programs: { type: Array, required: !0 }, notice: { type: String, default: "" }, failure: { type: String, default: "" } },
  emits: ["close", "save", "reset"],
  setup(t, { emit: x }) {
    const a = t, k = x, r = /^[a-z0-9_-]+$/i, u = [{ key: "about", label: "About" }, { key: "model", label: "Model" }, { key: "instructions", label: "Instructions" }, { key: "tools", label: "Tools" }, { key: "skills", label: "Skills", count_field: "skills" }], s = C(() => [{ key: "", label: "The parent program" }, ...a.programs.map((w) => ({ key: w.name, label: w.title }))]), P = C(() => a.types.map((w) => ({ key: w.key, label: w.label }))), A = ["title", "description", "agent_type", "access", "program", "preferred_program", "fallback_programs", "occupant", "mcp_tools", "program_models", "tier", "body"], c = I({}), S = I(u[0]), R = I(null);
    Q(
      () => a.profile.name,
      () => {
        c.value = { name: a.profile.name, ...Object.fromEntries(A.map((w) => [w, a.profile[w]])), mcp_tools: a.profile.mcp_tools.join(","), fallback_programs: a.profile.fallback_programs.join(","), program_models: { ...a.profile.program_models }, skills: null, required_skills: null }, S.value = u[0], R.value = null;
      },
      { immediate: !0 }
    );
    const N = C(() => a.types.find((w) => w.key === c.value.agent_type)), E = C(() => {
      var w;
      return ((w = N.value) == null ? void 0 : w.access) === ne;
    }), j = C(() => [{ key: "read-only", label: "Read-only" }, ...E.value ? [{ key: ne, label: "Writing" }] : []]);
    Q(E, (w) => {
      w || (c.value.access = "read-only");
    });
    const B = I(!1), V = (w, n, g) => n.map((v, p) => ({ line_type: w, line: p + 1, text: v })).filter((v) => !g.includes(v.text)), d = C(() => {
      const w = a.profile.body.split(`
`), n = (a.profile.module_body || "").split(`
`);
      return [...V("del", w, n), ...V("add", n, w)];
    }), b = C(() => ({ ...a.profile, mcp_tools: a.profile.mcp_tools.join(","), fallback_programs: a.profile.fallback_programs.join(",") })), o = C(() => A.some((w) => JSON.stringify(c.value[w]) !== JSON.stringify(b.value[w])) || c.value.skills !== null || c.value.required_skills !== null || !a.profile.name), h = C(() => !a.profile.name && !r.test(c.value.name || "")), U = C(() => !c.value.description.trim()), G = C(() => o.value && !h.value && !U.value), ee = C(() => R.value === null ? {} : { skills: R.value }), le = C(() => [a.profile.problem, ...a.profile.notes].filter(Boolean));
    return (w, n) => (l(), q(e(ge), {
      width: "wide",
      "foot-below": "",
      title: t.profile.title || t.profile.name || "New profile",
      abstract: t.profile.name ? t.used : "Instructions, type and model for an agent",
      onClose: n[12] || (n[12] = (g) => k("close"))
    }, {
      meta: m(() => [
        t.profile.name ? (l(), i("div", pl, [
          y("span", fl, T(t.profile.name), 1),
          t.profile.shipped ? (l(), i("span", cl, "Comes with the journal")) : _("", !0),
          t.profile.changed.length ? (l(), i("span", vl, "Changed")) : _("", !0),
          t.profile.problem ? (l(), i("span", ml, "Problem")) : _("", !0)
        ])) : _("", !0)
      ]),
      foot: m(() => [
        f(e(L), {
          variant: "ghost",
          small: "",
          "data-profile-cancel": "",
          onClick: n[9] || (n[9] = (g) => k("close"))
        }, {
          default: m(() => [...n[15] || (n[15] = [
            M("Cancel", -1)
          ])]),
          _: 1
        }),
        t.profile.changed.length || t.profile.problem ? (l(), q(e(L), {
          key: 0,
          variant: "ghost",
          small: "",
          "data-profile-reset": "",
          onClick: n[10] || (n[10] = (g) => k("reset", t.profile))
        }, {
          default: m(() => [...n[16] || (n[16] = [
            M("Use the journal's version", -1)
          ])]),
          _: 1
        })) : _("", !0),
        n[18] || (n[18] = y("span", { class: "profile-panel-grow" }, null, -1)),
        o.value && t.profile.name ? (l(), i("span", Sl, "Unsaved changes")) : _("", !0),
        f(e(L), {
          variant: "primary",
          small: "",
          disabled: !G.value,
          "data-profile-save": "",
          onClick: n[11] || (n[11] = (g) => k("save", t.profile, c.value))
        }, {
          default: m(() => [...n[17] || (n[17] = [
            M("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: m(() => [
        me(w.$slots, "default", {}, void 0, !0),
        y("div", yl, [
          t.failure ? (l(), q(e(Y), {
            key: 0,
            tone: "danger"
          }, {
            default: m(() => [
              y("span", kl, T(t.failure), 1)
            ]),
            _: 1
          })) : t.notice ? (l(), q(e(Y), { key: 1 }, {
            default: m(() => [
              y("span", gl, T(t.notice), 1)
            ]),
            _: 1
          })) : _("", !0),
          (l(!0), i(W, null, F(le.value, (g) => (l(), q(e(Y), {
            key: g,
            tone: "wait"
          }, {
            default: m(() => [
              M(T(g), 1)
            ]),
            _: 2
          }, 1024))), 128)),
          t.profile.module_text_changed ? (l(), i(W, { key: 2 }, [
            f(e(Y), null, {
              default: m(() => [
                y("span", hl, [
                  n[14] || (n[14] = y("span", null, "Text changed: the journal's instructions have a new version.", -1)),
                  f(e(L), {
                    variant: "ghost",
                    small: "",
                    "data-profile-compare": "",
                    onClick: n[0] || (n[0] = (g) => B.value = !B.value)
                  }, {
                    default: m(() => [...n[13] || (n[13] = [
                      M("Compare", -1)
                    ])]),
                    _: 1
                  })
                ])
              ]),
              _: 1
            }),
            B.value ? (l(), q(e(he), {
              key: 0,
              path: "Instructions",
              change: "edit",
              added: d.value.filter((g) => g.line_type === "add").length,
              removed: d.value.filter((g) => g.line_type === "del").length,
              at: "",
              rows: d.value,
              "data-profile-diff": ""
            }, null, 8, ["added", "removed", "rows"])) : _("", !0)
          ], 64)) : _("", !0),
          f(e(be), {
            tabs: u,
            active: S.value,
            answer: ee.value,
            onChoose: n[1] || (n[1] = (g) => S.value = g)
          }, null, 8, ["active", "answer"]),
          H(f(We, {
            draft: c.value,
            "onUpdate:draft": n[2] || (n[2] = (g) => c.value = g),
            profile: t.profile,
            choices: P.value,
            accesses: j.value,
            "picked-type": N.value,
            "name-is-bad": h.value,
            "description-is-empty": U.value
          }, null, 8, ["draft", "profile", "choices", "accesses", "picked-type", "name-is-bad", "description-is-empty"]), [
            [K, S.value.key === "about"]
          ]),
          H(f(Fe, {
            draft: c.value,
            "onUpdate:draft": n[3] || (n[3] = (g) => c.value = g),
            programs: t.programs,
            "program-choices": s.value
          }, null, 8, ["draft", "programs", "program-choices"]), [
            [K, S.value.key === "model"]
          ]),
          H(y("div", bl, [
            f(e(O), {
              label: "Instructions",
              for: "profile-body",
              help: "What it is told each time it starts, after the brief."
            }, {
              default: m(() => [
                f(e(oe), {
                  id: "profile-body",
                  rows: "16",
                  value: c.value.body,
                  onInput: n[4] || (n[4] = (g) => c.value.body = g.target.value)
                }, null, 8, ["value"])
              ]),
              _: 1
            })
          ], 512), [
            [K, S.value.key === "instructions"]
          ]),
          H(y("div", _l, [
            f(e(O), {
              label: "MCP tools this profile may call",
              for: "profile-mcp",
              help: "Separate the names with commas."
            }, {
              default: m(() => [
                f(e(X), {
                  id: "profile-mcp",
                  value: c.value.mcp_tools,
                  onInput: n[5] || (n[5] = (g) => c.value.mcp_tools = g.target.value)
                }, null, 8, ["value"])
              ]),
              _: 1
            })
          ], 512), [
            [K, S.value.key === "tools"]
          ]),
          H(y("div", wl, [
            t.profile.name ? (l(), q(dl, {
              key: 0,
              profile: t.profile.name,
              chosen: c.value.skills,
              "required-chosen": c.value.required_skills,
              onChange: n[6] || (n[6] = (g) => c.value.skills = g),
              onChangeRequired: n[7] || (n[7] = (g) => c.value.required_skills = g),
              onCount: n[8] || (n[8] = (g) => R.value = g)
            }, null, 8, ["profile", "chosen", "required-chosen"])) : (l(), i("p", $l, "Save the profile first, then choose its skills."))
          ], 512), [
            [K, S.value.key === "skills"]
          ])
        ])
      ]),
      _: 3
    }, 8, ["title", "abstract"]));
  }
}, Cl = /* @__PURE__ */ z(Tl, [["__scopeId", "data-v-a5586041"]]), ql = {
  class: "profiles",
  "data-profiles": ""
}, Il = {
  class: "count",
  "data-profile-count": ""
}, Pl = {
  key: 0,
  class: "notice",
  "data-profile-notice": ""
}, xl = {
  key: 1,
  class: "notice failed",
  role: "alert",
  "data-profile-failure": ""
}, Al = {
  key: 3,
  class: "rows"
}, jl = { class: "profile-meta" }, Rl = {
  key: 0,
  class: "profile-model"
}, Nl = { class: "profile-model" }, Bl = {
  __name: "ProfileRows",
  setup(t) {
    const x = { name: "", title: "", description: "", agent_type: "helper", access: "read-only", program: "", occupant: "when-cold", mcp_tools: [], fallback_programs: [], changed: [], notes: [], problem: "", program_models: {}, tier: null, body: "", shipped: !1, uses: 0 }, a = { "read-only": "Read-only", writing: "Writing" }, k = ae(), { rows: r, listing: u, failure: s, loaded: P, act: A, actionFailure: c } = k.props.profiles, S = k.props.programs.rows, R = C(() => u.value ? u.value.types : []), N = I(""), E = I(""), j = I(""), B = I(!1), V = C(() => {
      const v = E.value.toLowerCase().split(/\s+/).filter(Boolean);
      return r.value.filter((p) => v.every(($) => {
        var D;
        return pe(p, $, (D = k.search) == null ? void 0 : D.fields);
      }));
    }), d = C(() => B.value ? x : r.value.find((v) => v.name === N.value) || null), b = (v) => {
      var p;
      return ((p = R.value.find(($) => $.key === v.agent_type)) == null ? void 0 : p.label) || v.agent_type;
    }, o = (v) => v.shipped ? "Comes with the journal" : v.module, h = (v) => [`Type: ${b(v)}`, `Access: ${a[v.access]}`, ...S.value.map((p) => {
      var $;
      return `${(($ = v.program_models) == null ? void 0 : $[p.name]) || "chosen at start"} on ${p.title}`;
    }), v.changed.length ? "Changed" : "", o(v)].filter(Boolean).join(" · "), U = (v) => [v.problem, v.module_text_changed ? "Text changed: the journal's instructions have a new version" : "", ...v.notes].filter(Boolean), G = (v) => v.uses ? `Uses: ${v.uses} ${v.uses === 1 ? "time" : "times"}, last ${we(new Date(v.last_used * 1e3).toISOString())}` : "Uses: none";
    function ee() {
      B.value = !0, N.value = "";
    }
    function le(v) {
      B.value = !1, N.value = v.name;
    }
    function w() {
      B.value = !1, N.value = "";
    }
    async function n(v) {
      j.value = "", (await A(["profile", "reset", v.name])).ok && (j.value = `${v.name} is back to the journal's version.`);
    }
    async function g(v, p) {
      var se;
      j.value = "";
      const $ = v.name || p.name;
      (await A(["profile", "save", $, ...p.title ? ["--title", p.title] : [], "--description", p.description, "--type", p.agent_type, "--access", p.access, "--program", p.program, p.preferred_program ? "--program-if-possible" : "--no-program-if-possible", "--fallback-programs", p.fallback_programs, "--tier", p.tier || "", ...S.value.flatMap((Z) => [Z.model_option, p.program_models[Z.name] || ""]), "--mcp-tools", p.mcp_tools, ...(se = R.value.find((Z) => Z.key === p.agent_type)) != null && se.declares_occupant ? ["--occupant", p.occupant] : [], "--body", p.body, ...p.skills ? ["--skills", p.skills.join(",")] : [], ...p.required_skills ? ["--required-skills", p.required_skills.join(",")] : []])).ok && (B.value = !1, N.value = $, j.value = `${$} saved. The agent will use it the next time it starts a helper with this profile.`);
    }
    return (v, p) => (l(), i("section", ql, [
      f(e(fe), {
        modelValue: E.value,
        "onUpdate:modelValue": p[0] || (p[0] = ($) => E.value = $),
        class: "bar",
        "data-profile-find": ""
      }, {
        default: m(() => [
          f(e(L), {
            variant: "ghost",
            small: "",
            "data-profile-new": "",
            onClick: ee
          }, {
            default: m(() => [...p[1] || (p[1] = [
              M("New profile", -1)
            ])]),
            _: 1
          }),
          y("span", Il, T(e(r).length) + " " + T(e(r).length === 1 ? "profile" : "profiles"), 1),
          j.value ? (l(), i("span", Pl, T(j.value), 1)) : _("", !0),
          e(c) ? (l(), i("span", xl, T(e(c)), 1)) : _("", !0)
        ]),
        _: 1
      }, 8, ["modelValue"]),
      e(s) ? (l(), q(e(te), {
        key: 0,
        class: "empty",
        title: "The profiles could not be read"
      }, {
        default: m(() => [
          M(T(e(s)), 1)
        ]),
        _: 1
      })) : !e(P) || !e(r).length ? (l(), q(e(te), {
        key: 1,
        class: "empty",
        loading: !e(P),
        title: "No profiles yet"
      }, {
        default: m(() => [...p[2] || (p[2] = [
          M(" A profile gives an agent its instructions, type and model. The journal includes standard profiles. ", -1)
        ])]),
        _: 1
      }, 8, ["loading"])) : V.value.length ? (l(), i("div", Al, [
        (l(!0), i(W, null, F(V.value, ($) => (l(), q(e(L), {
          key: $.name,
          variant: "text",
          fill: "",
          class: "profile-open",
          "aria-label": `Open ${$.name}`,
          "data-profile": $.name,
          onClick: (D) => le($)
        }, {
          default: m(() => [
            f(e(_e), {
              title: $.title || $.name,
              text: $.description
            }, {
              end: m(() => [
                y("span", jl, [
                  $.title ? (l(), i("span", Rl, T($.name), 1)) : _("", !0),
                  y("span", Nl, T(h($)), 1),
                  (l(!0), i(W, null, F(U($), (D) => (l(), i("span", {
                    key: D,
                    class: "profile-warning",
                    "data-profile-warning": ""
                  }, T(D), 1))), 128)),
                  y("span", {
                    class: de(["profile-used", { never: !$.uses }])
                  }, T(G($)), 3)
                ])
              ]),
              _: 2
            }, 1032, ["title", "text"])
          ]),
          _: 2
        }, 1032, ["aria-label", "data-profile", "onClick"]))), 128))
      ])) : (l(), q(e(te), {
        key: 2,
        class: "empty",
        title: "No profile matches"
      }, {
        default: m(() => [...p[3] || (p[3] = [
          M("Try other words.", -1)
        ])]),
        _: 1
      })),
      d.value ? (l(), q(Cl, {
        key: 4,
        notice: j.value,
        failure: e(c),
        programs: e(S),
        types: R.value,
        profile: d.value,
        used: G(d.value),
        onClose: w,
        onSave: g,
        onReset: n
      }, {
        default: m(() => [
          d.value.name && d.value.agent_type === "helper" ? (l(), q(Re, {
            key: 0,
            programs: e(S),
            profile: d.value.name
          }, null, 8, ["programs", "profile"])) : _("", !0)
        ]),
        _: 1
      }, 8, ["notice", "failure", "programs", "types", "profile", "used"])) : _("", !0)
    ]));
  }
}, Ml = /* @__PURE__ */ z(Bl, [["__scopeId", "data-v-bd1b1e56"]]);
export {
  Ml as default
};
