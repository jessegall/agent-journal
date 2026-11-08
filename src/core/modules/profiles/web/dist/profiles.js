/* @code-commandments-generated */
if (!document.getElementById("window-styles-416bf4384cea")) { const style = document.createElement("style"); style.id = "window-styles-416bf4384cea"; style.textContent = ".helper-start[data-v-082e841a]{display:grid;gap:12px;padding:0 0 20px;margin-bottom:20px;border-bottom:1px solid var(--border-2)}h3[data-v-082e841a]{margin:0;font-size:14px;font-weight:600}.field[data-v-082e841a]{display:grid;gap:4px}.field>span[data-v-082e841a]{color:var(--text-2);font-size:12px;font-weight:500}.reason[data-v-082e841a],.notice[data-v-082e841a]{margin:0;color:var(--text-3);font-size:12px;line-height:1.5;overflow-wrap:anywhere}.idle-helper[data-v-082e841a]{display:flex;align-items:center;justify-content:space-between;gap:12px}.profile-skills[data-v-915d5f21]{display:flex;flex-direction:column;gap:8px}.profile-skill[data-v-915d5f21]{display:flex;gap:10px;align-items:flex-start}.profile-skill-text[data-v-915d5f21]{display:flex;flex-direction:column;gap:2px;min-width:0;font-size:13px}.profile-skill-own[data-v-915d5f21]{color:var(--accent);font-size:11.5px}.profile-skill-about[data-v-915d5f21],.profile-skills-note[data-v-915d5f21]{margin:0;color:var(--text-3);font-size:12px}.profile-panel[data-v-22e93f26]{display:flex;flex-direction:column;gap:14px}.profile-panel-note[data-v-22e93f26]{margin:0;color:var(--text-3);font-size:12.5px}.profile-panel-check[data-v-22e93f26]{display:flex;gap:8px;align-items:center;font-size:13px}.profile-panel-grow[data-v-22e93f26]{flex:1}.profiles[data-v-cdffb7db]{padding:0 0 40px}.bar[data-v-cdffb7db]{flex-wrap:wrap;gap:8px 12px;color:var(--text-2)}.count[data-v-cdffb7db]{margin-left:auto;color:var(--text-3);font-size:12.5px}.notice[data-v-cdffb7db]{font-size:12px;color:var(--text-2)}.notice.failed[data-v-cdffb7db]{color:var(--danger)}.empty[data-v-cdffb7db]{margin:40px auto;max-width:480px}.rows[data-v-cdffb7db]{display:flex;flex-direction:column;padding:8px 14px 0 22px}.profile-open[data-v-cdffb7db]{text-align:left}.profile-meta[data-v-cdffb7db]{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:12px}.profile-model[data-v-cdffb7db]{color:var(--text-2)}.profile-used[data-v-cdffb7db]{color:var(--text-3);white-space:nowrap}.profile-warning[data-v-cdffb7db]{color:var(--tone-warn)}.profile-used.never[data-v-cdffb7db]{color:var(--text-4)}@media(max-width:640px){.profiles-find[data-v-cdffb7db]{flex:1 1 100%}.profile-meta[data-v-cdffb7db]{display:none}}\n"; document.head.appendChild(style); }
import { ref as C, computed as S, watch as G, openBlock as o, createElementBlock as f, withModifiers as se, createElementVNode as g, createVNode as u, unref as t, withDirectives as Z, Fragment as L, renderList as q, toDisplayString as h, vModelSelect as oe, withCtx as p, createTextVNode as E, createCommentVNode as k, createBlock as x, renderSlot as ne, vModelCheckbox as re, normalizeClass as ie } from "vue";
import { useWindow as K, TextArea as Y, Btn as O, TextInput as D, Switch as ue, SidePanel as pe, FormField as A, Segmented as U, ModelPicker as de, DiffCard as fe, matchesSearch as ve, SearchBar as me, EmptyState as z, ListRow as ce, ago as ye } from "@journal/window-kit";
const H = (v, R) => {
  const i = v.__vccOpts || v;
  for (const [w, d] of R)
    i[w] = d;
  return i;
}, ge = { class: "field" }, he = { class: "field" }, ke = ["disabled"], be = ["value"], _e = ["data-helper-idle"], $e = {
  key: 0,
  class: "field"
}, we = {
  key: 1,
  class: "reason",
  "data-helper-fresh-blocked": ""
}, Se = {
  key: 2,
  class: "reason",
  "data-helper-start-reason": ""
}, Ce = {
  key: 3,
  class: "notice"
}, Te = {
  __name: "HelperStartForm",
  props: { profile: { type: String, required: !0 }, programs: { type: Array, required: !0 } },
  setup(v) {
    const R = v, i = K(), w = { can_start: !1, reason: "", programs: [], idle_helpers: [], can_start_fresh: !1, fresh_reason: "" }, d = C(w), _ = C(""), b = C(""), I = C(""), T = C(""), s = C(!1), y = C(!0);
    let N = 0;
    const c = S(() => !s.value && !y.value && !!_.value.trim()), $ = S(() => !c.value || !(d.value.can_start || d.value.can_start_fresh && T.value.trim()));
    async function P() {
      const M = ++N;
      if (y.value = !0, i.state["availability.profile"] = R.profile, b.value ? i.state["availability.program"] = b.value : delete i.state["availability.program"], await i.reload("availability"), M !== N) return;
      const l = i.props.availability;
      l.failure.value ? (d.value = w, I.value = l.failure.value) : d.value = l.data.value, y.value = !1;
    }
    async function V() {
      $.value || await W(["helper", "start", R.profile, "--brief", _.value, ...b.value ? ["--program", b.value] : [], ...T.value.trim() ? ["--fresh", T.value.trim()] : []], "The helper is starting.");
    }
    async function F(M) {
      c.value && await W(["helper", "send", String(M), _.value], "Job sent.");
    }
    async function W(M, l) {
      s.value = !0;
      try {
        const e = await i.run(M);
        I.value = e.ok ? l : e.error, e.ok && (_.value = "", T.value = ""), await P();
      } finally {
        s.value = !1;
      }
    }
    return G([() => R.profile, b], P, { immediate: !0 }), (M, l) => (o(), f("form", {
      class: "helper-start",
      "data-helper-start": "",
      onSubmit: se(V, ["prevent"])
    }, [
      l[9] || (l[9] = g("h3", null, "Give a helper a job", -1)),
      g("label", ge, [
        l[3] || (l[3] = g("span", null, "The job", -1)),
        u(t(Y), {
          value: _.value,
          rows: "3",
          disabled: s.value,
          "data-helper-brief": "",
          onInput: l[0] || (l[0] = (e) => _.value = e.target.value)
        }, null, 8, ["value", "disabled"])
      ]),
      g("label", he, [
        l[5] || (l[5] = g("span", null, "Program", -1)),
        Z(g("select", {
          "onUpdate:modelValue": l[1] || (l[1] = (e) => b.value = e),
          disabled: s.value,
          "data-helper-program": ""
        }, [
          l[4] || (l[4] = g("option", { value: "" }, "The profile program", -1)),
          (o(!0), f(L, null, q(d.value.programs, (e) => {
            var a;
            return o(), f("option", {
              key: e,
              value: e
            }, h(((a = v.programs.find((j) => j.name === e)) == null ? void 0 : a.title) || e), 9, be);
          }), 128))
        ], 8, ke), [
          [oe, b.value]
        ])
      ]),
      (o(!0), f(L, null, q(d.value.idle_helpers, (e) => (o(), f("div", {
        key: e.id,
        class: "idle-helper",
        "data-helper-idle": e.id
      }, [
        g("span", null, h(e.name) + " · Idle", 1),
        u(t(O), {
          type: "button",
          disabled: !c.value,
          "data-helper-send": e.id,
          onClick: (a) => F(e.id)
        }, {
          default: p(() => [...l[6] || (l[6] = [
            E("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled", "data-helper-send", "onClick"])
      ], 8, _e))), 128)),
      d.value.idle_helpers.length ? (o(), f("label", $e, [
        l[7] || (l[7] = g("span", null, "Why start another helper?", -1)),
        u(t(D), {
          modelValue: T.value,
          "onUpdate:modelValue": l[2] || (l[2] = (e) => T.value = e),
          disabled: s.value,
          "data-helper-fresh-reason": ""
        }, null, 8, ["modelValue", "disabled"])
      ])) : k("", !0),
      u(t(O), {
        type: "submit",
        disabled: $.value,
        "data-helper-start-button": ""
      }, {
        default: p(() => [...l[8] || (l[8] = [
          E("Start a helper", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      d.value.fresh_reason ? (o(), f("p", we, h(d.value.fresh_reason), 1)) : k("", !0),
      d.value.reason && d.value.reason !== d.value.fresh_reason ? (o(), f("p", Se, h(d.value.reason), 1)) : k("", !0),
      I.value ? (o(), f("p", Ce, h(I.value), 1)) : k("", !0)
    ], 32));
  }
}, xe = /* @__PURE__ */ H(Te, [["__scopeId", "data-v-082e841a"]]), Ie = {
  class: "profile-skills",
  "data-profile-skills": ""
}, Pe = {
  key: 0,
  class: "profile-skills-note",
  role: "alert"
}, je = ["data-profile-skill"], Ae = { class: "profile-skill-text" }, Re = { class: "profile-skill-name" }, Ne = {
  key: 0,
  class: "profile-skill-own",
  "data-profile-skill-own": ""
}, Ve = { class: "profile-skill-about" }, We = {
  __name: "ProfileSkillToggles",
  props: { profile: { type: String, required: !0 }, chosen: { type: Array, default: null } },
  emits: ["change"],
  setup(v, { emit: R }) {
    const i = v, w = R, d = K(), _ = C([]), b = C(""), I = S(() => new Set(i.chosen ?? _.value.filter((y) => y.state === "on").map((y) => y.key)));
    async function T() {
      d.state["skills.profile"] = i.profile, await d.reload("skills");
      const y = d.props.skills;
      b.value = y.failure.value, _.value = b.value ? [] : y.data.value.rows;
    }
    function s(y, N) {
      const c = new Set(I.value);
      N ? c.add(y.key) : c.delete(y.key), w("change", _.value.filter(($) => c.has($.key)).map(($) => $.key));
    }
    return G(() => i.profile, T, { immediate: !0 }), (y, N) => (o(), f("div", Ie, [
      b.value ? (o(), f("p", Pe, h(b.value), 1)) : k("", !0),
      (o(!0), f(L, null, q(_.value, (c) => (o(), f("div", {
        key: c.key,
        class: "profile-skill",
        "data-profile-skill": c.key
      }, [
        u(t(ue), {
          on: I.value.has(c.key),
          title: `Give ${c.key} to this profile's agents`,
          "data-profile-skill-switch": "",
          onChange: ($) => s(c, $)
        }, null, 8, ["on", "title", "onChange"]),
        g("span", Ae, [
          g("span", Re, h(c.key), 1),
          c.own ? (o(), f("span", Ne, "Made for this type")) : k("", !0),
          g("span", Ve, h(c.description), 1)
        ])
      ], 8, je))), 128))
    ]));
  }
}, Ee = /* @__PURE__ */ H(We, [["__scopeId", "data-v-915d5f21"]]), Me = {
  class: "profile-panel",
  "data-profile-panel": ""
}, Oe = { key: 0 }, Be = {
  key: 0,
  "data-profile-type-locked": ""
}, Le = { class: "profile-panel-check" }, Fe = {
  key: 5,
  class: "profile-panel-note"
}, X = "writing", qe = {
  __name: "ProfilePanel",
  props: { profile: { type: Object, required: !0 }, used: { type: String, default: "" }, types: { type: Array, default: () => [] }, programs: { type: Array, required: !0 } },
  emits: ["close", "save", "reset"],
  setup(v, { emit: R }) {
    const i = v, w = R, d = [{ key: "", label: "Profile models" }, { key: "fast", label: "Fast" }, { key: "general", label: "General" }, { key: "strongest", label: "Strongest" }], _ = [{ key: "always", label: "Always this program" }, { key: "possible", label: "This program if possible" }], b = S(() => [{ key: "", label: "The parent program" }, ...i.programs.map((l) => ({ key: l.name, label: l.title }))]), I = S(() => i.types.map((l) => ({ key: l.key, label: l.label }))), T = ["title", "description", "agent_type", "access", "program", "program_if_possible", "independent", "mcp_tools", "program_models", "tier", "body"], s = C({});
    G(
      () => i.profile.name,
      () => {
        s.value = { name: i.profile.name, ...Object.fromEntries(T.map((l) => [l, i.profile[l]])), mcp_tools: i.profile.mcp_tools.join(","), program_models: { ...i.profile.program_models }, skills: null };
      },
      { immediate: !0 }
    );
    const y = S(() => i.types.find((l) => l.key === s.value.agent_type)), N = S(() => {
      var l;
      return ((l = y.value) == null ? void 0 : l.access) === X;
    }), c = S(() => [{ key: "read-only", label: "Read-only" }, ...N.value ? [{ key: X, label: "Writing" }] : []]);
    G(N, (l) => {
      l || (s.value.access = "read-only");
    });
    const $ = C(!1), P = (l, e, a) => e.map((j, J) => ({ line_type: l, line: J + 1, text: j })).filter((j) => !a.includes(j.text)), V = S(() => {
      const l = i.profile.body.split(`
`), e = (i.profile.module_body || "").split(`
`);
      return [...P("del", l, e), ...P("add", e, l)];
    }), F = S(() => ({ ...i.profile, mcp_tools: i.profile.mcp_tools.join(",") })), W = S(() => T.some((l) => JSON.stringify(s.value[l]) !== JSON.stringify(F.value[l])) || s.value.skills !== null || !i.profile.name), M = S(() => W.value && /^[a-z0-9_-]+$/i.test(s.value.name || "") && s.value.description.trim());
    return (l, e) => (o(), x(t(pe), {
      title: v.profile.title || v.profile.name || "New profile",
      abstract: v.profile.name ? v.used : "Instructions, type and model for an agent",
      onClose: e[16] || (e[16] = (a) => w("close"))
    }, {
      foot: p(() => [
        v.profile.changed.length || v.profile.problem ? (o(), x(t(O), {
          key: 0,
          variant: "ghost",
          small: "",
          "data-profile-reset": "",
          onClick: e[13] || (e[13] = (a) => w("reset", v.profile))
        }, {
          default: p(() => [...e[20] || (e[20] = [
            E("Use the journal's version", -1)
          ])]),
          _: 1
        })) : k("", !0),
        e[23] || (e[23] = g("span", { class: "profile-panel-grow" }, null, -1)),
        u(t(O), {
          variant: "ghost",
          small: "",
          "data-profile-cancel": "",
          onClick: e[14] || (e[14] = (a) => w("close"))
        }, {
          default: p(() => [...e[21] || (e[21] = [
            E("Cancel", -1)
          ])]),
          _: 1
        }),
        u(t(O), {
          variant: "primary",
          small: "",
          disabled: !M.value,
          "data-profile-save": "",
          onClick: e[15] || (e[15] = (a) => w("save", v.profile, s.value))
        }, {
          default: p(() => [...e[22] || (e[22] = [
            E("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: p(() => [
        ne(l.$slots, "default", {}, void 0, !0),
        g("div", Me, [
          v.profile.title ? (o(), f("small", Oe, h(v.profile.name), 1)) : k("", !0),
          v.profile.name ? k("", !0) : (o(), x(t(A), {
            key: 1,
            label: "Name",
            for: "profile-name",
            help: "Letters, digits and dashes; the agent starts it by this name."
          }, {
            default: p(() => [
              u(t(D), {
                id: "profile-name",
                value: s.value.name,
                placeholder: "critic",
                onInput: e[0] || (e[0] = (a) => s.value.name = a.target.value.trim())
              }, null, 8, ["value"])
            ]),
            _: 1
          })),
          u(t(A), {
            label: "Title",
            for: "profile-title"
          }, {
            default: p(() => [
              u(t(D), {
                id: "profile-title",
                value: s.value.title,
                onInput: e[1] || (e[1] = (a) => s.value.title = a.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          u(t(A), {
            label: "When it is used",
            for: "profile-description",
            help: "The agent reads this to decide when to start it."
          }, {
            default: p(() => [
              u(t(Y), {
                id: "profile-description",
                rows: "3",
                value: s.value.description,
                onInput: e[2] || (e[2] = (a) => s.value.description = a.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          u(t(A), {
            label: "Type",
            for: "profile-type",
            help: "The type of agent that runs this profile."
          }, {
            default: p(() => {
              var a;
              return [
                v.profile.shipped ? (o(), f("span", Be, h((a = y.value) == null ? void 0 : a.label), 1)) : (o(), x(t(U), {
                  key: 1,
                  "data-profile-type": "",
                  options: I.value,
                  value: s.value.agent_type,
                  onPick: e[3] || (e[3] = (j) => s.value.agent_type = j)
                }, null, 8, ["options", "value"]))
              ];
            }),
            _: 1
          }),
          u(t(A), {
            label: "Access",
            for: "profile-access",
            help: "Whether it may change files."
          }, {
            default: p(() => [
              u(t(U), {
                "data-profile-access": "",
                options: c.value,
                value: s.value.access,
                onPick: e[4] || (e[4] = (a) => s.value.access = a)
              }, null, 8, ["options", "value"])
            ]),
            _: 1
          }),
          u(t(A), {
            label: "Program",
            for: "profile-program",
            help: "A registered program, or the same program as the agent that starts it."
          }, {
            default: p(() => [
              u(t(U), {
                options: b.value,
                value: s.value.program,
                onPick: e[5] || (e[5] = (a) => s.value.program = a)
              }, null, 8, ["options", "value"])
            ]),
            _: 1
          }),
          s.value.program ? (o(), x(t(A), {
            key: 2,
            label: "When it cannot start",
            for: "profile-program-choice",
            help: "If possible: a start uses the other program, on its model, when this one is not installed or not ready, and says so."
          }, {
            default: p(() => [
              u(t(U), {
                "data-profile-program-choice": "",
                options: _,
                value: s.value.program_if_possible ? "possible" : "always",
                onPick: e[6] || (e[6] = (a) => s.value.program_if_possible = a === "possible")
              }, null, 8, ["value"])
            ]),
            _: 1
          })) : k("", !0),
          u(t(A), {
            label: "Model tier",
            for: "profile-tier",
            help: "Chooses a model when this profile has no named model for the program."
          }, {
            default: p(() => [
              u(t(U), {
                "data-profile-tier": "",
                options: d,
                value: s.value.tier || "",
                onPick: e[7] || (e[7] = (a) => s.value.tier = a || null)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          (o(!0), f(L, null, q(i.programs, (a) => (o(), x(t(A), {
            key: a.name,
            label: `Model on ${a.title}`,
            for: `profile-model-${a.name}`,
            help: "The least expensive model that reliably fits the work."
          }, {
            default: p(() => [
              u(t(de), {
                title: a.title,
                models: a.models,
                inherits: "",
                value: s.value.program_models[a.name] || "",
                "data-profile-model": a.name,
                onPick: (j) => s.value.program_models[a.name] = j
              }, null, 8, ["title", "models", "value", "data-profile-model", "onPick"])
            ]),
            _: 2
          }, 1032, ["label", "for"]))), 128)),
          u(t(A), {
            label: "Instructions",
            for: "profile-body",
            help: "What it is told each time it starts, after the brief."
          }, {
            default: p(() => [
              u(t(Y), {
                id: "profile-body",
                rows: "16",
                value: s.value.body,
                onInput: e[8] || (e[8] = (a) => s.value.body = a.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          u(t(A), {
            label: "MCP tools this profile may call",
            for: "profile-mcp",
            help: "Separate the names with commas."
          }, {
            default: p(() => [
              u(t(D), {
                id: "profile-mcp",
                value: s.value.mcp_tools,
                onInput: e[9] || (e[9] = (a) => s.value.mcp_tools = a.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          v.profile.name ? (o(), x(t(A), {
            key: 3,
            label: "Skills",
            help: "The skills this profile's agents get. A worker's worktree holds only these, and a helper in the main checkout may read only these."
          }, {
            default: p(() => [
              u(Ee, {
                profile: v.profile.name,
                chosen: s.value.skills,
                onChange: e[10] || (e[10] = (a) => s.value.skills = a)
              }, null, 8, ["profile", "chosen"])
            ]),
            _: 1
          })) : k("", !0),
          g("label", Le, [
            Z(g("input", {
              "onUpdate:modelValue": e[11] || (e[11] = (a) => s.value.independent = a),
              type: "checkbox",
              "data-profile-independent": ""
            }, null, 512), [
              [re, s.value.independent]
            ]),
            e[17] || (e[17] = E(" Must judge fresh", -1))
          ]),
          v.profile.module_text_changed ? (o(), f(L, { key: 4 }, [
            e[19] || (e[19] = g("p", { class: "profile-panel-note" }, "Text changed: the journal's instructions have a new version.", -1)),
            u(t(O), {
              variant: "ghost",
              small: "",
              "data-profile-compare": "",
              onClick: e[12] || (e[12] = (a) => $.value = !$.value)
            }, {
              default: p(() => [...e[18] || (e[18] = [
                E("Compare", -1)
              ])]),
              _: 1
            }),
            $.value ? (o(), x(t(fe), {
              key: 0,
              path: "Instructions",
              change: "edit",
              added: V.value.filter((a) => a.line_type === "add").length,
              removed: V.value.filter((a) => a.line_type === "del").length,
              at: "",
              rows: V.value,
              "data-profile-diff": ""
            }, null, 8, ["added", "removed", "rows"])) : k("", !0)
          ], 64)) : k("", !0),
          v.profile.shipped ? (o(), f("p", Fe, "This comes with the journal. Your changes are kept through updates.")) : k("", !0)
        ])
      ]),
      _: 3
    }, 8, ["title", "abstract"]));
  }
}, Ue = /* @__PURE__ */ H(qe, [["__scopeId", "data-v-22e93f26"]]), De = {
  class: "profiles",
  "data-profiles": ""
}, Ge = {
  class: "count",
  "data-profile-count": ""
}, He = {
  key: 0,
  class: "notice",
  "data-profile-notice": ""
}, Je = {
  key: 1,
  class: "notice failed",
  role: "alert",
  "data-profile-failure": ""
}, ze = {
  key: 3,
  class: "rows"
}, Ye = { class: "profile-meta" }, Ke = {
  key: 0,
  class: "profile-model"
}, Qe = { class: "profile-model" }, Xe = {
  __name: "ProfileRows",
  setup(v) {
    const R = { name: "", title: "", description: "", agent_type: "helper", access: "read-only", program: "", independent: !1, mcp_tools: [], changed: [], notes: [], problem: "", program_models: {}, tier: null, body: "", shipped: !1, uses: 0 }, i = { "read-only": "Read-only", writing: "Writing" }, w = K(), { rows: d, listing: _, failure: b, loaded: I, act: T, actionFailure: s } = w.props.profiles, y = w.props.programs.rows, N = S(() => _.value ? _.value.types : []), c = C(""), $ = C(""), P = C(""), V = C(!1), F = S(() => {
      const r = $.value.toLowerCase().split(/\s+/).filter(Boolean);
      return d.value.filter((n) => r.every((m) => {
        var B;
        return ve(n, m, (B = w.search) == null ? void 0 : B.fields);
      }));
    }), W = S(() => V.value ? R : d.value.find((r) => r.name === c.value) || null), M = (r) => {
      var n;
      return ((n = N.value.find((m) => m.key === r.agent_type)) == null ? void 0 : n.label) || r.agent_type;
    }, l = (r) => r.shipped ? "Comes with the journal" : r.module, e = (r) => [`Type: ${M(r)}`, `Access: ${i[r.access]}`, ...y.value.map((n) => {
      var m;
      return `${((m = r.program_models) == null ? void 0 : m[n.name]) || "chosen at start"} on ${n.title}`;
    }), r.changed.length ? "Changed" : "", l(r)].filter(Boolean).join(" · "), a = (r) => [r.problem, r.module_text_changed ? "Text changed: the journal's instructions have a new version" : "", ...r.notes].filter(Boolean), j = (r) => r.uses ? `Uses: ${r.uses} ${r.uses === 1 ? "time" : "times"}, last ${ye(new Date(r.last_used * 1e3).toISOString())}` : "Uses: none";
    function J() {
      V.value = !0, c.value = "";
    }
    function ee(r) {
      V.value = !1, c.value = r.name;
    }
    function le() {
      V.value = !1, c.value = "";
    }
    async function te(r) {
      P.value = "", (await T(["profile", "reset", r.name])).ok && (P.value = `${r.name} is back to the journal's version.`);
    }
    async function ae(r, n) {
      P.value = "";
      const m = r.name || n.name;
      (await T(["profile", "save", m, ...n.title ? ["--title", n.title] : [], "--description", n.description, "--type", n.agent_type, "--access", n.access, "--program", n.program, n.program_if_possible ? "--program-if-possible" : "--no-program-if-possible", "--tier", n.tier || "", ...y.value.flatMap((Q) => [Q.model_option, n.program_models[Q.name] || ""]), "--mcp-tools", n.mcp_tools, n.independent ? "--independent" : "--no-independent", "--body", n.body, ...n.skills ? ["--skills", n.skills.join(",")] : []])).ok && (V.value = !1, c.value = m, P.value = `${m} saved. The agent will use it the next time it starts a helper with this profile.`);
    }
    return (r, n) => (o(), f("section", De, [
      u(t(me), {
        modelValue: $.value,
        "onUpdate:modelValue": n[0] || (n[0] = (m) => $.value = m),
        class: "bar",
        "data-profile-find": ""
      }, {
        default: p(() => [
          u(t(O), {
            variant: "ghost",
            small: "",
            "data-profile-new": "",
            onClick: J
          }, {
            default: p(() => [...n[1] || (n[1] = [
              E("New profile", -1)
            ])]),
            _: 1
          }),
          g("span", Ge, h(t(d).length) + " " + h(t(d).length === 1 ? "profile" : "profiles"), 1),
          P.value ? (o(), f("span", He, h(P.value), 1)) : k("", !0),
          t(s) ? (o(), f("span", Je, h(t(s)), 1)) : k("", !0)
        ]),
        _: 1
      }, 8, ["modelValue"]),
      t(b) ? (o(), x(t(z), {
        key: 0,
        class: "empty",
        title: "The profiles could not be read"
      }, {
        default: p(() => [
          E(h(t(b)), 1)
        ]),
        _: 1
      })) : !t(I) || !t(d).length ? (o(), x(t(z), {
        key: 1,
        class: "empty",
        loading: !t(I),
        title: "No profiles yet"
      }, {
        default: p(() => [...n[2] || (n[2] = [
          E(" A profile gives an agent its instructions, type and model. The journal includes standard profiles. ", -1)
        ])]),
        _: 1
      }, 8, ["loading"])) : F.value.length ? (o(), f("div", ze, [
        (o(!0), f(L, null, q(F.value, (m) => (o(), x(t(O), {
          key: m.name,
          variant: "text",
          fill: "",
          class: "profile-open",
          "aria-label": `Open ${m.name}`,
          "data-profile": m.name,
          onClick: (B) => ee(m)
        }, {
          default: p(() => [
            u(t(ce), {
              title: m.title || m.name,
              text: m.description
            }, {
              end: p(() => [
                g("span", Ye, [
                  m.title ? (o(), f("span", Ke, h(m.name), 1)) : k("", !0),
                  g("span", Qe, h(e(m)), 1),
                  (o(!0), f(L, null, q(a(m), (B) => (o(), f("span", {
                    key: B,
                    class: "profile-warning",
                    "data-profile-warning": ""
                  }, h(B), 1))), 128)),
                  g("span", {
                    class: ie(["profile-used", { never: !m.uses }])
                  }, h(j(m)), 3)
                ])
              ]),
              _: 2
            }, 1032, ["title", "text"])
          ]),
          _: 2
        }, 1032, ["aria-label", "data-profile", "onClick"]))), 128))
      ])) : (o(), x(t(z), {
        key: 2,
        class: "empty",
        title: "No profile matches"
      }, {
        default: p(() => [...n[3] || (n[3] = [
          E("Try other words.", -1)
        ])]),
        _: 1
      })),
      W.value ? (o(), x(Ue, {
        key: 4,
        programs: t(y),
        types: N.value,
        profile: W.value,
        used: j(W.value),
        onClose: le,
        onSave: ae,
        onReset: te
      }, {
        default: p(() => [
          W.value.name && W.value.agent_type === "helper" ? (o(), x(xe, {
            key: 0,
            programs: t(y),
            profile: W.value.name
          }, null, 8, ["programs", "profile"])) : k("", !0)
        ]),
        _: 1
      }, 8, ["programs", "types", "profile", "used"])) : k("", !0)
    ]));
  }
}, ll = /* @__PURE__ */ H(Xe, [["__scopeId", "data-v-cdffb7db"]]);
export {
  ll as default
};
