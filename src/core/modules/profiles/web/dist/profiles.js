if (!document.getElementById("window-styles-54e18cfa5daa")) { const style = document.createElement("style"); style.id = "window-styles-54e18cfa5daa"; style.textContent = ".helper-start[data-v-07b9fb47]{display:grid;gap:12px;padding:0 0 20px;margin-bottom:20px;border-bottom:1px solid var(--border-2)}h3[data-v-07b9fb47]{margin:0;font-size:14px;font-weight:600}.field[data-v-07b9fb47]{display:grid;gap:4px}.field>span[data-v-07b9fb47]{color:var(--text-2);font-size:12px;font-weight:500}.reason[data-v-07b9fb47],.notice[data-v-07b9fb47]{margin:0;color:var(--text-3);font-size:12px;line-height:1.5;overflow-wrap:anywhere}.idle-helper[data-v-07b9fb47]{display:flex;align-items:center;justify-content:space-between;gap:12px}.profile-panel-tab[data-v-05f24888]{display:flex;flex-direction:column;gap:14px}.profile-panel-reason[data-v-05f24888]{margin:0;color:var(--text-3);font-size:12px}.profile-panel-switch[data-v-05f24888]{display:flex;gap:10px;align-items:center;font-size:13px}.profile-panel-tab[data-v-9096240d]{display:flex;flex-direction:column;gap:14px}.profile-panel-models[data-v-9096240d]{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:14px}.profile-skill[data-v-dede0178]{display:flex;gap:10px;align-items:flex-start;padding:10px 12px}.profile-skill+.profile-skill[data-v-dede0178]{border-top:1px solid var(--border)}.profile-skill-text[data-v-dede0178]{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0}.profile-skill-head[data-v-dede0178]{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.profile-skill-name[data-v-dede0178]{color:var(--text);font-size:13px}.profile-skill.off .profile-skill-name[data-v-dede0178]{color:var(--text-3)}.profile-skill-own[data-v-dede0178]{padding:0 5px;border:1px solid var(--border-2);border-radius:5px;color:var(--text-3);font-size:10px}.profile-skill-about[data-v-dede0178]{display:-webkit-box;overflow:hidden;color:var(--text-3);font-size:12px;-webkit-box-orient:vertical;-webkit-line-clamp:2}.profile-skill-end[data-v-dede0178]{display:flex;flex:none;justify-content:flex-end;min-width:84px}.profile-skill-locked[data-v-dede0178]{max-width:130px;color:var(--text-3);font-size:11.5px;text-align:right}@media(max-width:640px){.profile-skill[data-v-dede0178]{flex-wrap:wrap}.profile-skill-end[data-v-dede0178]{justify-content:flex-start;width:100%;padding-left:38px}}.profile-skills[data-v-83427ac3]{display:flex;flex-direction:column;gap:10px}.profile-skills-line[data-v-83427ac3]{display:flex;gap:12px;align-items:baseline;justify-content:space-between}.profile-skills-help[data-v-83427ac3],.profile-skills-count[data-v-83427ac3],.profile-skills-note[data-v-83427ac3]{margin:0;color:var(--text-3);font-size:12px}.profile-skills-card[data-v-83427ac3]{border:1px solid var(--border);border-radius:8px;background:var(--bg-2)}.profile-skills-skeleton[data-v-83427ac3],.profile-skills-note[data-v-83427ac3]{padding:10px 12px}.profile-panel[data-v-a40dc839],.profile-panel-tab[data-v-a40dc839]{display:flex;flex-direction:column;gap:14px}.profile-panel-meta[data-v-a40dc839]{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-top:8px}.profile-panel-name[data-v-a40dc839]{color:var(--text-3);font-size:12px}.profile-panel-tag[data-v-a40dc839]{padding:0 5px;border:1px solid var(--border-2);border-radius:5px;color:var(--text-3);font-size:10px}.profile-panel-changed[data-v-a40dc839]{display:flex;gap:10px;align-items:center;justify-content:space-between}.profile-panel-reason[data-v-a40dc839],.profile-panel-unsaved[data-v-a40dc839]{margin:0;color:var(--text-3);font-size:12px}.profile-panel-grow[data-v-a40dc839]{flex:1}.profiles[data-v-448d3971]{padding:0 0 40px}.bar[data-v-448d3971]{flex-wrap:wrap;gap:8px 12px;color:var(--text-2)}.count[data-v-448d3971]{margin-left:auto;color:var(--text-3);font-size:12.5px}.notice[data-v-448d3971]{font-size:12px;color:var(--text-2)}.notice.failed[data-v-448d3971]{color:var(--danger)}.empty[data-v-448d3971]{margin:40px auto;max-width:480px}.rows[data-v-448d3971]{display:flex;flex-direction:column;padding:8px 14px 0 22px}.profile-open[data-v-448d3971]{text-align:left}.profile-meta[data-v-448d3971]{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:12px}.profile-model[data-v-448d3971]{color:var(--text-2)}.profile-used[data-v-448d3971]{color:var(--text-3);white-space:nowrap}.profile-warning[data-v-448d3971]{color:var(--tone-warn)}.profile-used.never[data-v-448d3971]{color:var(--text-4)}@media(max-width:640px){.profiles-find[data-v-448d3971]{flex:1 1 100%}.profile-meta[data-v-448d3971]{display:none}}\n"; document.head.appendChild(style); }
import { ref as P, computed as T, watch as Q, openBlock as l, createElementBlock as n, withModifiers as fe, createElementVNode as y, createVNode as d, unref as e, withDirectives as H, Fragment as V, renderList as F, toDisplayString as C, vModelSelect as ce, withCtx as m, createTextVNode as O, createCommentVNode as w, useModel as ne, createBlock as I, mergeModels as ie, normalizeClass as ue, renderSlot as ve, vShow as J } from "vue";
import { useWindow as ae, TextArea as se, Btn as L, TextInput as X, FormField as M, Segmented as Y, Switch as te, ModelPicker as me, matchesSearch as de, SearchBar as pe, Notice as K, SkeletonLine as ye, SidePanel as ke, DiffCard as ge, InnerTabs as he, EmptyState as le, ListRow as be, ago as _e } from "@journal/window-kit";
const z = (t, h) => {
  const i = t.__vccOpts || t;
  for (const [s, o] of h)
    i[s] = o;
  return i;
}, $e = { class: "field" }, we = { class: "field" }, Se = ["disabled"], qe = ["value"], Ce = ["data-helper-idle"], Te = {
  key: 0,
  class: "field"
}, Ie = {
  key: 1,
  class: "reason",
  "data-helper-fresh-blocked": ""
}, Pe = {
  key: 2,
  class: "reason",
  "data-helper-start-reason": ""
}, xe = {
  key: 3,
  class: "notice"
}, Ae = {
  __name: "HelperStartForm",
  props: { profile: { type: String, required: !0 }, programs: { type: Array, required: !0 } },
  setup(t) {
    const h = t, i = ae(), s = { can_start: !1, reason: "", programs: [], idle_helpers: [], can_start_fresh: !1, fresh_reason: "" }, o = P(s), p = P(""), k = P(""), x = P(""), A = P(""), c = P(!1), q = P(!0);
    let N = 0;
    const R = T(() => !c.value && !q.value && !!p.value.trim()), E = T(() => !R.value || !(o.value.can_start || o.value.can_start_fresh && A.value.trim()));
    async function j() {
      const _ = ++N;
      if (q.value = !0, i.state["availability.profile"] = h.profile, k.value ? i.state["availability.program"] = k.value : delete i.state["availability.program"], await i.reload("availability"), _ !== N) return;
      const a = i.props.availability;
      a.failure.value ? (o.value = s, x.value = a.failure.value) : o.value = a.data.value, q.value = !1;
    }
    async function B() {
      E.value || await u(["helper", "start", h.profile, "--brief", p.value, ...k.value ? ["--program", k.value] : [], ...A.value.trim() ? ["--fresh", A.value.trim()] : []], "The read-only helper is starting.");
    }
    async function W(_) {
      R.value && await u(["helper", "send", String(_), p.value], "Job sent.");
    }
    async function u(_, a) {
      c.value = !0;
      try {
        const b = await i.run(_);
        x.value = b.ok ? a : b.error, b.ok && (p.value = "", A.value = ""), await j();
      } finally {
        c.value = !1;
      }
    }
    return Q([() => h.profile, k], j, { immediate: !0 }), (_, a) => (l(), n("form", {
      class: "helper-start",
      "data-helper-start": "",
      onSubmit: fe(B, ["prevent"])
    }, [
      a[9] || (a[9] = y("h3", null, "Give a read-only helper a job", -1)),
      y("label", $e, [
        a[3] || (a[3] = y("span", null, "The job", -1)),
        d(e(se), {
          value: p.value,
          rows: "3",
          disabled: c.value,
          "data-helper-brief": "",
          onInput: a[0] || (a[0] = (b) => p.value = b.target.value)
        }, null, 8, ["value", "disabled"])
      ]),
      y("label", we, [
        a[5] || (a[5] = y("span", null, "Program", -1)),
        H(y("select", {
          "onUpdate:modelValue": a[1] || (a[1] = (b) => k.value = b),
          disabled: c.value,
          "data-helper-program": ""
        }, [
          a[4] || (a[4] = y("option", { value: "" }, "The profile program", -1)),
          (l(!0), n(V, null, F(o.value.programs, (b) => {
            var U;
            return l(), n("option", {
              key: b,
              value: b
            }, C(((U = t.programs.find((G) => G.name === b)) == null ? void 0 : U.title) || b), 9, qe);
          }), 128))
        ], 8, Se), [
          [ce, k.value]
        ])
      ]),
      (l(!0), n(V, null, F(o.value.idle_helpers, (b) => (l(), n("div", {
        key: b.id,
        class: "idle-helper",
        "data-helper-idle": b.id
      }, [
        y("span", null, C(b.name) + " · Idle", 1),
        d(e(L), {
          type: "button",
          disabled: !R.value,
          "data-helper-send": b.id,
          onClick: (U) => W(b.id)
        }, {
          default: m(() => [...a[6] || (a[6] = [
            O("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled", "data-helper-send", "onClick"])
      ], 8, Ce))), 128)),
      o.value.idle_helpers.length ? (l(), n("label", Te, [
        a[7] || (a[7] = y("span", null, "Why start another helper?", -1)),
        d(e(X), {
          modelValue: A.value,
          "onUpdate:modelValue": a[2] || (a[2] = (b) => A.value = b),
          disabled: c.value,
          "data-helper-fresh-reason": ""
        }, null, 8, ["modelValue", "disabled"])
      ])) : w("", !0),
      d(e(L), {
        type: "submit",
        disabled: E.value,
        "data-helper-start-button": ""
      }, {
        default: m(() => [...a[8] || (a[8] = [
          O("Start a read-only helper", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      o.value.fresh_reason ? (l(), n("p", Ie, C(o.value.fresh_reason), 1)) : w("", !0),
      o.value.reason && o.value.reason !== o.value.fresh_reason ? (l(), n("p", Pe, C(o.value.reason), 1)) : w("", !0),
      x.value ? (l(), n("p", xe, C(x.value), 1)) : w("", !0)
    ], 32));
  }
}, je = /* @__PURE__ */ z(Ae, [["__scopeId", "data-v-07b9fb47"]]), Re = {
  class: "profile-panel-tab",
  "data-profile-tab": "about"
}, Ne = {
  key: 0,
  class: "profile-panel-reason"
}, Be = {
  key: 1,
  class: "profile-panel-reason"
}, Ee = {
  key: 0,
  "data-profile-type-locked": ""
}, Oe = { class: "profile-panel-switch" }, Me = {
  __name: "ProfileAboutTab",
  props: /* @__PURE__ */ ie({ profile: { type: Object, required: !0 }, choices: { type: Array, required: !0 }, accesses: { type: Array, required: !0 }, pickedType: { type: Object, default: null }, nameIsBad: Boolean, descriptionIsEmpty: Boolean }, {
    draft: { type: Object, required: !0 },
    draftModifiers: {}
  }),
  emits: ["update:draft"],
  setup(t) {
    const h = ne(t, "draft");
    return (i, s) => (l(), n("div", Re, [
      t.profile.name ? w("", !0) : (l(), n(V, { key: 0 }, [
        d(e(M), {
          label: "Name",
          for: "profile-name",
          help: "Letters, digits and dashes; the agent starts it by this name."
        }, {
          default: m(() => [
            d(e(X), {
              id: "profile-name",
              value: h.value.name,
              placeholder: "critic",
              onInput: s[0] || (s[0] = (o) => h.value.name = o.target.value.trim())
            }, null, 8, ["value"])
          ]),
          _: 1
        }),
        t.nameIsBad && h.value.name ? (l(), n("p", Ne, "Use letters, digits and dashes.")) : w("", !0)
      ], 64)),
      d(e(M), {
        label: "Title",
        for: "profile-title"
      }, {
        default: m(() => [
          d(e(X), {
            id: "profile-title",
            value: h.value.title,
            onInput: s[1] || (s[1] = (o) => h.value.title = o.target.value)
          }, null, 8, ["value"])
        ]),
        _: 1
      }),
      d(e(M), {
        label: "When it is used",
        for: "profile-description",
        help: "The agent reads this to decide when to start it."
      }, {
        default: m(() => [
          d(e(se), {
            id: "profile-description",
            rows: "3",
            value: h.value.description,
            onInput: s[2] || (s[2] = (o) => h.value.description = o.target.value)
          }, null, 8, ["value"])
        ]),
        _: 1
      }),
      t.descriptionIsEmpty ? (l(), n("p", Be, "Describe when the agent should start it.")) : w("", !0),
      d(e(M), {
        label: "Type",
        for: "profile-type",
        help: "The type of agent that runs this profile."
      }, {
        default: m(() => {
          var o;
          return [
            t.profile.shipped ? (l(), n("span", Ee, C((o = t.pickedType) == null ? void 0 : o.label), 1)) : (l(), I(e(Y), {
              key: 1,
              "data-profile-type": "",
              options: t.choices,
              value: h.value.agent_type,
              onPick: s[3] || (s[3] = (p) => h.value.agent_type = p)
            }, null, 8, ["options", "value"]))
          ];
        }),
        _: 1
      }),
      d(e(M), {
        label: "Access",
        for: "profile-access",
        help: "Whether it may change files."
      }, {
        default: m(() => [
          d(e(Y), {
            "data-profile-access": "",
            options: t.accesses,
            value: h.value.access,
            onPick: s[4] || (s[4] = (o) => h.value.access = o)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }),
      y("div", Oe, [
        d(e(te), {
          on: h.value.independent,
          title: "Must judge fresh",
          "data-profile-independent": "",
          onChange: s[5] || (s[5] = (o) => h.value.independent = o)
        }, null, 8, ["on"]),
        s[6] || (s[6] = y("span", null, "Must judge fresh", -1))
      ])
    ]));
  }
}, Ve = /* @__PURE__ */ z(Me, [["__scopeId", "data-v-05f24888"]]), We = {
  class: "profile-panel-tab",
  "data-profile-tab": "model"
}, Le = { class: "profile-panel-models" }, Ue = {
  __name: "ProfileModelTab",
  props: /* @__PURE__ */ ie({ programs: { type: Array, required: !0 }, programChoices: { type: Array, required: !0 } }, {
    draft: { type: Object, required: !0 },
    draftModifiers: {}
  }),
  emits: ["update:draft"],
  setup(t) {
    const h = [{ key: "always", label: "Always this program" }, { key: "possible", label: "This program if possible" }], i = [{ key: "", label: "Profile models" }, { key: "fast", label: "Fast" }, { key: "general", label: "General" }, { key: "strongest", label: "Strongest" }], s = ne(t, "draft");
    return (o, p) => (l(), n("div", We, [
      d(e(M), {
        label: "Program",
        for: "profile-program",
        help: "A registered program, or the same program as the agent that starts it."
      }, {
        default: m(() => [
          d(e(Y), {
            options: t.programChoices,
            value: s.value.program,
            onPick: p[0] || (p[0] = (k) => s.value.program = k)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }),
      s.value.program ? (l(), n(V, { key: 0 }, [
        d(e(M), {
          label: "When it cannot start",
          for: "profile-program-choice",
          help: "If possible: a start uses the other program, on its model, when this one is not installed or not ready, and says so."
        }, {
          default: m(() => [
            d(e(Y), {
              "data-profile-program-choice": "",
              options: h,
              value: s.value.preferred_program ? "possible" : "always",
              onPick: p[1] || (p[1] = (k) => s.value.preferred_program = k === "possible")
            }, null, 8, ["value"])
          ]),
          _: 1
        }),
        s.value.preferred_program ? (l(), I(e(M), {
          key: 0,
          label: "Programs to try instead",
          for: "profile-fallbacks",
          help: "Program names in the order to try them, separated by commas. Blank tries every other program."
        }, {
          default: m(() => [
            d(e(X), {
              id: "profile-fallbacks",
              value: s.value.fallback_programs,
              "data-profile-fallbacks": "",
              onInput: p[2] || (p[2] = (k) => s.value.fallback_programs = k.target.value)
            }, null, 8, ["value"])
          ]),
          _: 1
        })) : w("", !0)
      ], 64)) : w("", !0),
      d(e(M), {
        label: "Model tier",
        for: "profile-tier",
        help: "Chooses a model when this profile has no named model for the program."
      }, {
        default: m(() => [
          d(e(Y), {
            "data-profile-tier": "",
            options: i,
            value: s.value.tier || "",
            onPick: p[3] || (p[3] = (k) => s.value.tier = k || null)
          }, null, 8, ["value"])
        ]),
        _: 1
      }),
      y("div", Le, [
        (l(!0), n(V, null, F(t.programs, (k) => (l(), I(e(M), {
          key: k.name,
          label: `Model on ${k.title}`,
          for: `profile-model-${k.name}`,
          help: "The least expensive model that reliably fits the work."
        }, {
          default: m(() => [
            d(e(me), {
              title: k.title,
              models: k.models,
              inherits: "",
              value: s.value.program_models[k.name] || "",
              "data-profile-model": k.name,
              onPick: (x) => s.value.program_models[k.name] = x
            }, null, 8, ["title", "models", "value", "data-profile-model", "onPick"])
          ]),
          _: 2
        }, 1032, ["label", "for"]))), 128))
      ])
    ]));
  }
}, Fe = /* @__PURE__ */ z(Ue, [["__scopeId", "data-v-9096240d"]]), De = ["data-profile-skill"], ze = { class: "profile-skill-text" }, Ge = { class: "profile-skill-head" }, He = { class: "profile-skill-name" }, Je = {
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
  setup(t, { emit: h }) {
    const i = h;
    return (s, o) => (l(), n("div", {
      class: ue(["profile-skill", { off: !t.on }]),
      "data-profile-skill": t.row.key
    }, [
      d(e(te), {
        on: t.on,
        disabled: t.row.locked,
        title: `Give ${t.row.key} to this profile's agents`,
        "data-profile-skill-switch": "",
        onChange: o[0] || (o[0] = (p) => i("toggle", p))
      }, null, 8, ["on", "disabled", "title"]),
      y("span", ze, [
        y("span", Ge, [
          y("span", He, C(t.row.key), 1),
          t.row.own ? (l(), n("span", Je, "Made for this type")) : w("", !0)
        ]),
        y("span", {
          class: "profile-skill-about",
          title: t.row.description
        }, C(t.row.description), 9, Ke)
      ]),
      y("span", Ye, [
        t.row.locked ? (l(), n("span", Qe, "Every agent reads this at the start")) : t.on ? (l(), I(e(te), {
          key: 1,
          labelled: "",
          small: "",
          word: "Required",
          on: t.required,
          title: `Require ${t.row.key} at the start`,
          "data-profile-skill-required": "",
          onChange: o[1] || (o[1] = (p) => i("require", p))
        }, null, 8, ["on", "title"])) : w("", !0)
      ])
    ], 10, De));
  }
}, Ze = /* @__PURE__ */ z(Xe, [["__scopeId", "data-v-dede0178"]]), el = {
  class: "profile-skills",
  "data-profile-skills": ""
}, ll = { class: "profile-skills-line" }, tl = {
  key: 0,
  class: "profile-skills-count",
  "data-profile-skill-count": ""
}, al = { role: "alert" }, sl = {
  key: 2,
  class: "profile-skills-card"
}, ol = {
  key: 1,
  class: "profile-skills-note"
}, rl = {
  key: 2,
  class: "profile-skills-note"
}, nl = 8, il = 3, ul = {
  __name: "ProfileSkillToggles",
  props: { profile: { type: String, required: !0 }, chosen: { type: Array, default: null }, requiredChosen: { type: Array, default: null } },
  emits: ["change", "change-required", "count"],
  setup(t, { emit: h }) {
    const i = t, s = h, o = ae(), p = P([]), k = P(""), x = P(!1), A = P(""), c = T(() => new Set(i.chosen ?? p.value.filter((u) => u.state === "on").map((u) => u.key))), q = T(() => new Set(i.requiredChosen ?? p.value.filter((u) => u.required).map((u) => u.key))), N = T(() => {
      const u = A.value.toLowerCase().split(/\s+/).filter(Boolean);
      return p.value.filter((_) => u.every((a) => de(_, a, ["key", "description"])));
    }), R = T(() => `${c.value.size} of ${p.value.length} on${q.value.size ? `, ${q.value.size} required` : ""}`);
    async function E() {
      x.value = !1, o.state["skills.profile"] = i.profile, await o.reload("skills");
      const u = o.props.skills;
      k.value = u.failure.value, p.value = k.value ? [] : u.data.value.rows, x.value = !0;
    }
    const j = (u) => p.value.filter((_) => u.has(_.key)).map((_) => _.key);
    function B(u, _) {
      const a = new Set(c.value);
      _ ? a.add(u.key) : a.delete(u.key), s("change", j(a)), !_ && q.value.has(u.key) && W(u, !1);
    }
    function W(u, _) {
      const a = new Set(q.value);
      _ ? a.add(u.key) : a.delete(u.key), s("change-required", j(a));
    }
    return Q(() => i.profile, E, { immediate: !0 }), Q(() => c.value.size, (u) => s("count", u), { immediate: !0 }), (u, _) => (l(), n("div", el, [
      y("div", ll, [
        _[1] || (_[1] = y("span", { class: "profile-skills-help" }, "Changing a skill here saves the whole list.", -1)),
        x.value && p.value.length ? (l(), n("span", tl, C(R.value), 1)) : w("", !0)
      ]),
      p.value.length > nl ? (l(), I(e(pe), {
        key: 0,
        modelValue: A.value,
        "onUpdate:modelValue": _[0] || (_[0] = (a) => A.value = a),
        "data-profile-skill-find": ""
      }, null, 8, ["modelValue"])) : w("", !0),
      k.value ? (l(), I(e(K), {
        key: 1,
        tone: "danger"
      }, {
        default: m(() => [
          y("span", al, C(k.value), 1),
          d(e(L), {
            variant: "ghost",
            small: "",
            "data-profile-skills-retry": "",
            onClick: E
          }, {
            default: m(() => [..._[2] || (_[2] = [
              O("Try again", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      })) : (l(), n("div", sl, [
        x.value ? p.value.length ? N.value.length ? (l(!0), n(V, { key: 3 }, F(N.value, (a) => (l(), I(Ze, {
          key: a.key,
          row: a,
          on: c.value.has(a.key),
          required: q.value.has(a.key),
          onToggle: (b) => B(a, b),
          onRequire: (b) => W(a, b)
        }, null, 8, ["row", "on", "required", "onToggle", "onRequire"]))), 128)) : (l(), n("p", rl, "No skill matches that.")) : (l(), n("p", ol, "No skills are installed.")) : (l(), n(V, { key: 0 }, F(il, (a) => y("div", {
          key: a,
          class: "profile-skills-skeleton"
        }, [
          d(e(ye))
        ])), 64))
      ]))
    ]));
  }
}, dl = /* @__PURE__ */ z(ul, [["__scopeId", "data-v-83427ac3"]]), pl = {
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
}, $l = {
  class: "profile-panel-tab",
  "data-profile-tab": "skills"
}, wl = {
  key: 1,
  class: "profile-panel-reason"
}, Sl = {
  key: 1,
  class: "profile-panel-unsaved",
  "data-profile-unsaved": ""
}, re = "writing", ql = {
  __name: "ProfilePanel",
  props: { profile: { type: Object, required: !0 }, used: { type: String, default: "" }, types: { type: Array, default: () => [] }, programs: { type: Array, required: !0 }, notice: { type: String, default: "" }, failure: { type: String, default: "" } },
  emits: ["close", "save", "reset"],
  setup(t, { emit: h }) {
    const i = t, s = h, o = /^[a-z0-9_-]+$/i, p = [{ key: "about", label: "About" }, { key: "model", label: "Model" }, { key: "instructions", label: "Instructions" }, { key: "tools", label: "Tools" }, { key: "skills", label: "Skills", count_field: "skills" }], k = T(() => [{ key: "", label: "The parent program" }, ...i.programs.map(($) => ({ key: $.name, label: $.title }))]), x = T(() => i.types.map(($) => ({ key: $.key, label: $.label }))), A = ["title", "description", "agent_type", "access", "program", "preferred_program", "fallback_programs", "independent", "mcp_tools", "program_models", "tier", "body"], c = P({}), q = P(p[0]), N = P(null);
    Q(
      () => i.profile.name,
      () => {
        c.value = { name: i.profile.name, ...Object.fromEntries(A.map(($) => [$, i.profile[$]])), mcp_tools: i.profile.mcp_tools.join(","), fallback_programs: i.profile.fallback_programs.join(","), program_models: { ...i.profile.program_models }, skills: null, required_skills: null }, q.value = p[0], N.value = null;
      },
      { immediate: !0 }
    );
    const R = T(() => i.types.find(($) => $.key === c.value.agent_type)), E = T(() => {
      var $;
      return (($ = R.value) == null ? void 0 : $.access) === re;
    }), j = T(() => [{ key: "read-only", label: "Read-only" }, ...E.value ? [{ key: re, label: "Writing" }] : []]);
    Q(E, ($) => {
      $ || (c.value.access = "read-only");
    });
    const B = P(!1), W = ($, r, g) => r.map((v, f) => ({ line_type: $, line: f + 1, text: v })).filter((v) => !g.includes(v.text)), u = T(() => {
      const $ = i.profile.body.split(`
`), r = (i.profile.module_body || "").split(`
`);
      return [...W("del", $, r), ...W("add", r, $)];
    }), _ = T(() => ({ ...i.profile, mcp_tools: i.profile.mcp_tools.join(","), fallback_programs: i.profile.fallback_programs.join(",") })), a = T(() => A.some(($) => JSON.stringify(c.value[$]) !== JSON.stringify(_.value[$])) || c.value.skills !== null || c.value.required_skills !== null || !i.profile.name), b = T(() => !i.profile.name && !o.test(c.value.name || "")), U = T(() => !c.value.description.trim()), G = T(() => a.value && !b.value && !U.value), Z = T(() => N.value === null ? {} : { skills: N.value }), ee = T(() => [i.profile.problem, ...i.profile.notes].filter(Boolean));
    return ($, r) => (l(), I(e(ke), {
      width: "wide",
      "foot-below": "",
      title: t.profile.title || t.profile.name || "New profile",
      abstract: t.profile.name ? t.used : "Instructions, type and model for an agent",
      onClose: r[12] || (r[12] = (g) => s("close"))
    }, {
      meta: m(() => [
        t.profile.name ? (l(), n("div", pl, [
          y("span", fl, C(t.profile.name), 1),
          t.profile.shipped ? (l(), n("span", cl, "Comes with the journal")) : w("", !0),
          t.profile.changed.length ? (l(), n("span", vl, "Changed")) : w("", !0),
          t.profile.problem ? (l(), n("span", ml, "Problem")) : w("", !0)
        ])) : w("", !0)
      ]),
      foot: m(() => [
        d(e(L), {
          variant: "ghost",
          small: "",
          "data-profile-cancel": "",
          onClick: r[9] || (r[9] = (g) => s("close"))
        }, {
          default: m(() => [...r[15] || (r[15] = [
            O("Cancel", -1)
          ])]),
          _: 1
        }),
        t.profile.changed.length || t.profile.problem ? (l(), I(e(L), {
          key: 0,
          variant: "ghost",
          small: "",
          "data-profile-reset": "",
          onClick: r[10] || (r[10] = (g) => s("reset", t.profile))
        }, {
          default: m(() => [...r[16] || (r[16] = [
            O("Use the journal's version", -1)
          ])]),
          _: 1
        })) : w("", !0),
        r[18] || (r[18] = y("span", { class: "profile-panel-grow" }, null, -1)),
        a.value && t.profile.name ? (l(), n("span", Sl, "Unsaved changes")) : w("", !0),
        d(e(L), {
          variant: "primary",
          small: "",
          disabled: !G.value,
          "data-profile-save": "",
          onClick: r[11] || (r[11] = (g) => s("save", t.profile, c.value))
        }, {
          default: m(() => [...r[17] || (r[17] = [
            O("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: m(() => [
        ve($.$slots, "default", {}, void 0, !0),
        y("div", yl, [
          t.failure ? (l(), I(e(K), {
            key: 0,
            tone: "danger"
          }, {
            default: m(() => [
              y("span", kl, C(t.failure), 1)
            ]),
            _: 1
          })) : t.notice ? (l(), I(e(K), { key: 1 }, {
            default: m(() => [
              y("span", gl, C(t.notice), 1)
            ]),
            _: 1
          })) : w("", !0),
          (l(!0), n(V, null, F(ee.value, (g) => (l(), I(e(K), {
            key: g,
            tone: "wait"
          }, {
            default: m(() => [
              O(C(g), 1)
            ]),
            _: 2
          }, 1024))), 128)),
          t.profile.module_text_changed ? (l(), n(V, { key: 2 }, [
            d(e(K), null, {
              default: m(() => [
                y("span", hl, [
                  r[14] || (r[14] = y("span", null, "Text changed: the journal's instructions have a new version.", -1)),
                  d(e(L), {
                    variant: "ghost",
                    small: "",
                    "data-profile-compare": "",
                    onClick: r[0] || (r[0] = (g) => B.value = !B.value)
                  }, {
                    default: m(() => [...r[13] || (r[13] = [
                      O("Compare", -1)
                    ])]),
                    _: 1
                  })
                ])
              ]),
              _: 1
            }),
            B.value ? (l(), I(e(ge), {
              key: 0,
              path: "Instructions",
              change: "edit",
              added: u.value.filter((g) => g.line_type === "add").length,
              removed: u.value.filter((g) => g.line_type === "del").length,
              at: "",
              rows: u.value,
              "data-profile-diff": ""
            }, null, 8, ["added", "removed", "rows"])) : w("", !0)
          ], 64)) : w("", !0),
          d(e(he), {
            tabs: p,
            active: q.value,
            answer: Z.value,
            onChoose: r[1] || (r[1] = (g) => q.value = g)
          }, null, 8, ["active", "answer"]),
          H(d(Ve, {
            draft: c.value,
            "onUpdate:draft": r[2] || (r[2] = (g) => c.value = g),
            profile: t.profile,
            choices: x.value,
            accesses: j.value,
            "picked-type": R.value,
            "name-is-bad": b.value,
            "description-is-empty": U.value
          }, null, 8, ["draft", "profile", "choices", "accesses", "picked-type", "name-is-bad", "description-is-empty"]), [
            [J, q.value.key === "about"]
          ]),
          H(d(Fe, {
            draft: c.value,
            "onUpdate:draft": r[3] || (r[3] = (g) => c.value = g),
            programs: t.programs,
            "program-choices": k.value
          }, null, 8, ["draft", "programs", "program-choices"]), [
            [J, q.value.key === "model"]
          ]),
          H(y("div", bl, [
            d(e(M), {
              label: "Instructions",
              for: "profile-body",
              help: "What it is told each time it starts, after the brief."
            }, {
              default: m(() => [
                d(e(se), {
                  id: "profile-body",
                  rows: "16",
                  value: c.value.body,
                  onInput: r[4] || (r[4] = (g) => c.value.body = g.target.value)
                }, null, 8, ["value"])
              ]),
              _: 1
            })
          ], 512), [
            [J, q.value.key === "instructions"]
          ]),
          H(y("div", _l, [
            d(e(M), {
              label: "MCP tools this profile may call",
              for: "profile-mcp",
              help: "Separate the names with commas."
            }, {
              default: m(() => [
                d(e(X), {
                  id: "profile-mcp",
                  value: c.value.mcp_tools,
                  onInput: r[5] || (r[5] = (g) => c.value.mcp_tools = g.target.value)
                }, null, 8, ["value"])
              ]),
              _: 1
            })
          ], 512), [
            [J, q.value.key === "tools"]
          ]),
          H(y("div", $l, [
            t.profile.name ? (l(), I(dl, {
              key: 0,
              profile: t.profile.name,
              chosen: c.value.skills,
              "required-chosen": c.value.required_skills,
              onChange: r[6] || (r[6] = (g) => c.value.skills = g),
              onChangeRequired: r[7] || (r[7] = (g) => c.value.required_skills = g),
              onCount: r[8] || (r[8] = (g) => N.value = g)
            }, null, 8, ["profile", "chosen", "required-chosen"])) : (l(), n("p", wl, "Save the profile first, then choose its skills."))
          ], 512), [
            [J, q.value.key === "skills"]
          ])
        ])
      ]),
      _: 3
    }, 8, ["title", "abstract"]));
  }
}, Cl = /* @__PURE__ */ z(ql, [["__scopeId", "data-v-a40dc839"]]), Tl = {
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
    const h = { name: "", title: "", description: "", agent_type: "helper", access: "read-only", program: "", independent: !1, mcp_tools: [], fallback_programs: [], changed: [], notes: [], problem: "", program_models: {}, tier: null, body: "", shipped: !1, uses: 0 }, i = { "read-only": "Read-only", writing: "Writing" }, s = ae(), { rows: o, listing: p, failure: k, loaded: x, act: A, actionFailure: c } = s.props.profiles, q = s.props.programs.rows, N = T(() => p.value ? p.value.types : []), R = P(""), E = P(""), j = P(""), B = P(!1), W = T(() => {
      const v = E.value.toLowerCase().split(/\s+/).filter(Boolean);
      return o.value.filter((f) => v.every((S) => {
        var D;
        return de(f, S, (D = s.search) == null ? void 0 : D.fields);
      }));
    }), u = T(() => B.value ? h : o.value.find((v) => v.name === R.value) || null), _ = (v) => {
      var f;
      return ((f = N.value.find((S) => S.key === v.agent_type)) == null ? void 0 : f.label) || v.agent_type;
    }, a = (v) => v.shipped ? "Comes with the journal" : v.module, b = (v) => [`Type: ${_(v)}`, `Access: ${i[v.access]}`, ...q.value.map((f) => {
      var S;
      return `${((S = v.program_models) == null ? void 0 : S[f.name]) || "chosen at start"} on ${f.title}`;
    }), v.changed.length ? "Changed" : "", a(v)].filter(Boolean).join(" · "), U = (v) => [v.problem, v.module_text_changed ? "Text changed: the journal's instructions have a new version" : "", ...v.notes].filter(Boolean), G = (v) => v.uses ? `Uses: ${v.uses} ${v.uses === 1 ? "time" : "times"}, last ${_e(new Date(v.last_used * 1e3).toISOString())}` : "Uses: none";
    function Z() {
      B.value = !0, R.value = "";
    }
    function ee(v) {
      B.value = !1, R.value = v.name;
    }
    function $() {
      B.value = !1, R.value = "";
    }
    async function r(v) {
      j.value = "", (await A(["profile", "reset", v.name])).ok && (j.value = `${v.name} is back to the journal's version.`);
    }
    async function g(v, f) {
      j.value = "";
      const S = v.name || f.name;
      (await A(["profile", "save", S, ...f.title ? ["--title", f.title] : [], "--description", f.description, "--type", f.agent_type, "--access", f.access, "--program", f.program, f.preferred_program ? "--program-if-possible" : "--no-program-if-possible", "--fallback-programs", f.fallback_programs, "--tier", f.tier || "", ...q.value.flatMap((oe) => [oe.model_option, f.program_models[oe.name] || ""]), "--mcp-tools", f.mcp_tools, f.independent ? "--independent" : "--no-independent", "--body", f.body, ...f.skills ? ["--skills", f.skills.join(",")] : [], ...f.required_skills ? ["--required-skills", f.required_skills.join(",")] : []])).ok && (B.value = !1, R.value = S, j.value = `${S} saved. The agent will use it the next time it starts a helper with this profile.`);
    }
    return (v, f) => (l(), n("section", Tl, [
      d(e(pe), {
        modelValue: E.value,
        "onUpdate:modelValue": f[0] || (f[0] = (S) => E.value = S),
        class: "bar",
        "data-profile-find": ""
      }, {
        default: m(() => [
          d(e(L), {
            variant: "ghost",
            small: "",
            "data-profile-new": "",
            onClick: Z
          }, {
            default: m(() => [...f[1] || (f[1] = [
              O("New profile", -1)
            ])]),
            _: 1
          }),
          y("span", Il, C(e(o).length) + " " + C(e(o).length === 1 ? "profile" : "profiles"), 1),
          j.value ? (l(), n("span", Pl, C(j.value), 1)) : w("", !0),
          e(c) ? (l(), n("span", xl, C(e(c)), 1)) : w("", !0)
        ]),
        _: 1
      }, 8, ["modelValue"]),
      e(k) ? (l(), I(e(le), {
        key: 0,
        class: "empty",
        title: "The profiles could not be read"
      }, {
        default: m(() => [
          O(C(e(k)), 1)
        ]),
        _: 1
      })) : !e(x) || !e(o).length ? (l(), I(e(le), {
        key: 1,
        class: "empty",
        loading: !e(x),
        title: "No profiles yet"
      }, {
        default: m(() => [...f[2] || (f[2] = [
          O(" A profile gives an agent its instructions, type and model. The journal includes standard profiles. ", -1)
        ])]),
        _: 1
      }, 8, ["loading"])) : W.value.length ? (l(), n("div", Al, [
        (l(!0), n(V, null, F(W.value, (S) => (l(), I(e(L), {
          key: S.name,
          variant: "text",
          fill: "",
          class: "profile-open",
          "aria-label": `Open ${S.name}`,
          "data-profile": S.name,
          onClick: (D) => ee(S)
        }, {
          default: m(() => [
            d(e(be), {
              title: S.title || S.name,
              text: S.description
            }, {
              end: m(() => [
                y("span", jl, [
                  S.title ? (l(), n("span", Rl, C(S.name), 1)) : w("", !0),
                  y("span", Nl, C(b(S)), 1),
                  (l(!0), n(V, null, F(U(S), (D) => (l(), n("span", {
                    key: D,
                    class: "profile-warning",
                    "data-profile-warning": ""
                  }, C(D), 1))), 128)),
                  y("span", {
                    class: ue(["profile-used", { never: !S.uses }])
                  }, C(G(S)), 3)
                ])
              ]),
              _: 2
            }, 1032, ["title", "text"])
          ]),
          _: 2
        }, 1032, ["aria-label", "data-profile", "onClick"]))), 128))
      ])) : (l(), I(e(le), {
        key: 2,
        class: "empty",
        title: "No profile matches"
      }, {
        default: m(() => [...f[3] || (f[3] = [
          O("Try other words.", -1)
        ])]),
        _: 1
      })),
      u.value ? (l(), I(Cl, {
        key: 4,
        notice: j.value,
        failure: e(c),
        programs: e(q),
        types: N.value,
        profile: u.value,
        used: G(u.value),
        onClose: $,
        onSave: g,
        onReset: r
      }, {
        default: m(() => [
          u.value.name && u.value.agent_type === "helper" ? (l(), I(je, {
            key: 0,
            programs: e(q),
            profile: u.value.name
          }, null, 8, ["programs", "profile"])) : w("", !0)
        ]),
        _: 1
      }, 8, ["notice", "failure", "programs", "types", "profile", "used"])) : w("", !0)
    ]));
  }
}, Ml = /* @__PURE__ */ z(Bl, [["__scopeId", "data-v-448d3971"]]);
export {
  Ml as default
};
