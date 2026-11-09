if (!document.getElementById("window-styles-454d052c3bd2")) { const style = document.createElement("style"); style.id = "window-styles-454d052c3bd2"; style.textContent = ".helper-start[data-v-6827197a]{display:grid;gap:12px;padding:0 0 20px;margin-bottom:20px;border-bottom:1px solid var(--border-2)}h3[data-v-6827197a]{margin:0;font-size:14px;font-weight:600}.field[data-v-6827197a]{display:grid;gap:4px}.field>span[data-v-6827197a]{color:var(--text-2);font-size:12px;font-weight:500}.reason[data-v-6827197a],.notice[data-v-6827197a]{margin:0;color:var(--text-3);font-size:12px;line-height:1.5;overflow-wrap:anywhere}.idle-helper[data-v-6827197a]{display:flex;align-items:center;justify-content:space-between;gap:12px}.profile-skills[data-v-915d5f21]{display:flex;flex-direction:column;gap:8px}.profile-skill[data-v-915d5f21]{display:flex;gap:10px;align-items:flex-start}.profile-skill-text[data-v-915d5f21]{display:flex;flex-direction:column;gap:2px;min-width:0;font-size:13px}.profile-skill-own[data-v-915d5f21]{color:var(--accent);font-size:11.5px}.profile-skill-about[data-v-915d5f21],.profile-skills-note[data-v-915d5f21]{margin:0;color:var(--text-3);font-size:12px}.profile-panel[data-v-830fab69]{display:flex;flex-direction:column;gap:14px}.profile-panel-note[data-v-830fab69]{margin:0;color:var(--text-3);font-size:12.5px}.profile-panel-check[data-v-830fab69]{display:flex;gap:8px;align-items:center;font-size:13px}.profile-panel-grow[data-v-830fab69]{flex:1}.profiles[data-v-9ff2dc75]{padding:0 0 40px}.bar[data-v-9ff2dc75]{flex-wrap:wrap;gap:8px 12px;color:var(--text-2)}.count[data-v-9ff2dc75]{margin-left:auto;color:var(--text-3);font-size:12.5px}.notice[data-v-9ff2dc75]{font-size:12px;color:var(--text-2)}.notice.failed[data-v-9ff2dc75]{color:var(--danger)}.empty[data-v-9ff2dc75]{margin:40px auto;max-width:480px}.rows[data-v-9ff2dc75]{display:flex;flex-direction:column;padding:8px 14px 0 22px}.profile-open[data-v-9ff2dc75]{text-align:left}.profile-meta[data-v-9ff2dc75]{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:12px}.profile-model[data-v-9ff2dc75]{color:var(--text-2)}.profile-used[data-v-9ff2dc75]{color:var(--text-3);white-space:nowrap}.profile-warning[data-v-9ff2dc75]{color:var(--tone-warn)}.profile-used.never[data-v-9ff2dc75]{color:var(--text-4)}@media(max-width:640px){.profiles-find[data-v-9ff2dc75]{flex:1 1 100%}.profile-meta[data-v-9ff2dc75]{display:none}}\n"; document.head.appendChild(style); }
import { ref as C, computed as S, watch as G, openBlock as s, createElementBlock as d, withModifiers as oe, createElementVNode as g, createVNode as u, unref as t, withDirectives as Z, Fragment as O, renderList as q, toDisplayString as k, vModelSelect as se, withCtx as p, createTextVNode as B, createCommentVNode as h, createBlock as x, renderSlot as re, vModelCheckbox as ne, normalizeClass as ie } from "vue";
import { useWindow as K, TextArea as Y, Btn as M, TextInput as D, Switch as ue, SidePanel as pe, FormField as I, Segmented as U, ModelPicker as de, DiffCard as fe, matchesSearch as ve, SearchBar as me, EmptyState as z, ListRow as ce, ago as ye } from "@journal/window-kit";
const H = (v, R) => {
  const n = v.__vccOpts || v;
  for (const [w, f] of R)
    n[w] = f;
  return n;
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
    const R = v, n = K(), w = { can_start: !1, reason: "", programs: [], idle_helpers: [], can_start_fresh: !1, fresh_reason: "" }, f = C(w), _ = C(""), b = C(""), P = C(""), T = C(""), o = C(!1), y = C(!0);
    let N = 0;
    const c = S(() => !o.value && !y.value && !!_.value.trim()), $ = S(() => !c.value || !(f.value.can_start || f.value.can_start_fresh && T.value.trim()));
    async function j() {
      const E = ++N;
      if (y.value = !0, n.state["availability.profile"] = R.profile, b.value ? n.state["availability.program"] = b.value : delete n.state["availability.program"], await n.reload("availability"), E !== N) return;
      const l = n.props.availability;
      l.failure.value ? (f.value = w, P.value = l.failure.value) : f.value = l.data.value, y.value = !1;
    }
    async function V() {
      $.value || await W(["helper", "start", R.profile, "--brief", _.value, ...b.value ? ["--program", b.value] : [], ...T.value.trim() ? ["--fresh", T.value.trim()] : []], "The read-only helper is starting.");
    }
    async function F(E) {
      c.value && await W(["helper", "send", String(E), _.value], "Job sent.");
    }
    async function W(E, l) {
      o.value = !0;
      try {
        const e = await n.run(E);
        P.value = e.ok ? l : e.error, e.ok && (_.value = "", T.value = ""), await j();
      } finally {
        o.value = !1;
      }
    }
    return G([() => R.profile, b], j, { immediate: !0 }), (E, l) => (s(), d("form", {
      class: "helper-start",
      "data-helper-start": "",
      onSubmit: oe(V, ["prevent"])
    }, [
      l[9] || (l[9] = g("h3", null, "Give a read-only helper a job", -1)),
      g("label", ge, [
        l[3] || (l[3] = g("span", null, "The job", -1)),
        u(t(Y), {
          value: _.value,
          rows: "3",
          disabled: o.value,
          "data-helper-brief": "",
          onInput: l[0] || (l[0] = (e) => _.value = e.target.value)
        }, null, 8, ["value", "disabled"])
      ]),
      g("label", he, [
        l[5] || (l[5] = g("span", null, "Program", -1)),
        Z(g("select", {
          "onUpdate:modelValue": l[1] || (l[1] = (e) => b.value = e),
          disabled: o.value,
          "data-helper-program": ""
        }, [
          l[4] || (l[4] = g("option", { value: "" }, "The profile program", -1)),
          (s(!0), d(O, null, q(f.value.programs, (e) => {
            var a;
            return s(), d("option", {
              key: e,
              value: e
            }, k(((a = v.programs.find((A) => A.name === e)) == null ? void 0 : a.title) || e), 9, be);
          }), 128))
        ], 8, ke), [
          [se, b.value]
        ])
      ]),
      (s(!0), d(O, null, q(f.value.idle_helpers, (e) => (s(), d("div", {
        key: e.id,
        class: "idle-helper",
        "data-helper-idle": e.id
      }, [
        g("span", null, k(e.name) + " · Idle", 1),
        u(t(M), {
          type: "button",
          disabled: !c.value,
          "data-helper-send": e.id,
          onClick: (a) => F(e.id)
        }, {
          default: p(() => [...l[6] || (l[6] = [
            B("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled", "data-helper-send", "onClick"])
      ], 8, _e))), 128)),
      f.value.idle_helpers.length ? (s(), d("label", $e, [
        l[7] || (l[7] = g("span", null, "Why start another helper?", -1)),
        u(t(D), {
          modelValue: T.value,
          "onUpdate:modelValue": l[2] || (l[2] = (e) => T.value = e),
          disabled: o.value,
          "data-helper-fresh-reason": ""
        }, null, 8, ["modelValue", "disabled"])
      ])) : h("", !0),
      u(t(M), {
        type: "submit",
        disabled: $.value,
        "data-helper-start-button": ""
      }, {
        default: p(() => [...l[8] || (l[8] = [
          B("Start a read-only helper", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      f.value.fresh_reason ? (s(), d("p", we, k(f.value.fresh_reason), 1)) : h("", !0),
      f.value.reason && f.value.reason !== f.value.fresh_reason ? (s(), d("p", Se, k(f.value.reason), 1)) : h("", !0),
      P.value ? (s(), d("p", Ce, k(P.value), 1)) : h("", !0)
    ], 32));
  }
}, xe = /* @__PURE__ */ H(Te, [["__scopeId", "data-v-6827197a"]]), Ie = {
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
    const n = v, w = R, f = K(), _ = C([]), b = C(""), P = S(() => new Set(n.chosen ?? _.value.filter((y) => y.state === "on").map((y) => y.key)));
    async function T() {
      f.state["skills.profile"] = n.profile, await f.reload("skills");
      const y = f.props.skills;
      b.value = y.failure.value, _.value = b.value ? [] : y.data.value.rows;
    }
    function o(y, N) {
      const c = new Set(P.value);
      N ? c.add(y.key) : c.delete(y.key), w("change", _.value.filter(($) => c.has($.key)).map(($) => $.key));
    }
    return G(() => n.profile, T, { immediate: !0 }), (y, N) => (s(), d("div", Ie, [
      b.value ? (s(), d("p", Pe, k(b.value), 1)) : h("", !0),
      (s(!0), d(O, null, q(_.value, (c) => (s(), d("div", {
        key: c.key,
        class: "profile-skill",
        "data-profile-skill": c.key
      }, [
        u(t(ue), {
          on: P.value.has(c.key),
          title: `Give ${c.key} to this profile's agents`,
          "data-profile-skill-switch": "",
          onChange: ($) => o(c, $)
        }, null, 8, ["on", "title", "onChange"]),
        g("span", Ae, [
          g("span", Re, k(c.key), 1),
          c.own ? (s(), d("span", Ne, "Made for this type")) : h("", !0),
          g("span", Ve, k(c.description), 1)
        ])
      ], 8, je))), 128))
    ]));
  }
}, Be = /* @__PURE__ */ H(We, [["__scopeId", "data-v-915d5f21"]]), Ee = {
  class: "profile-panel",
  "data-profile-panel": ""
}, Me = { key: 0 }, Oe = {
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
    const n = v, w = R, f = [{ key: "", label: "Profile models" }, { key: "fast", label: "Fast" }, { key: "general", label: "General" }, { key: "strongest", label: "Strongest" }], _ = [{ key: "always", label: "Always this program" }, { key: "possible", label: "This program if possible" }], b = S(() => [{ key: "", label: "The parent program" }, ...n.programs.map((l) => ({ key: l.name, label: l.title }))]), P = S(() => n.types.map((l) => ({ key: l.key, label: l.label }))), T = ["title", "description", "agent_type", "access", "program", "preferred_program", "fallback_programs", "independent", "mcp_tools", "program_models", "tier", "body"], o = C({});
    G(
      () => n.profile.name,
      () => {
        o.value = { name: n.profile.name, ...Object.fromEntries(T.map((l) => [l, n.profile[l]])), mcp_tools: n.profile.mcp_tools.join(","), fallback_programs: n.profile.fallback_programs.join(","), program_models: { ...n.profile.program_models }, skills: null };
      },
      { immediate: !0 }
    );
    const y = S(() => n.types.find((l) => l.key === o.value.agent_type)), N = S(() => {
      var l;
      return ((l = y.value) == null ? void 0 : l.access) === X;
    }), c = S(() => [{ key: "read-only", label: "Read-only" }, ...N.value ? [{ key: X, label: "Writing" }] : []]);
    G(N, (l) => {
      l || (o.value.access = "read-only");
    });
    const $ = C(!1), j = (l, e, a) => e.map((A, J) => ({ line_type: l, line: J + 1, text: A })).filter((A) => !a.includes(A.text)), V = S(() => {
      const l = n.profile.body.split(`
`), e = (n.profile.module_body || "").split(`
`);
      return [...j("del", l, e), ...j("add", e, l)];
    }), F = S(() => ({ ...n.profile, mcp_tools: n.profile.mcp_tools.join(","), fallback_programs: n.profile.fallback_programs.join(",") })), W = S(() => T.some((l) => JSON.stringify(o.value[l]) !== JSON.stringify(F.value[l])) || o.value.skills !== null || !n.profile.name), E = S(() => W.value && /^[a-z0-9_-]+$/i.test(o.value.name || "") && o.value.description.trim());
    return (l, e) => (s(), x(t(pe), {
      title: v.profile.title || v.profile.name || "New profile",
      abstract: v.profile.name ? v.used : "Instructions, type and model for an agent",
      onClose: e[17] || (e[17] = (a) => w("close"))
    }, {
      foot: p(() => [
        v.profile.changed.length || v.profile.problem ? (s(), x(t(M), {
          key: 0,
          variant: "ghost",
          small: "",
          "data-profile-reset": "",
          onClick: e[14] || (e[14] = (a) => w("reset", v.profile))
        }, {
          default: p(() => [...e[21] || (e[21] = [
            B("Use the journal's version", -1)
          ])]),
          _: 1
        })) : h("", !0),
        e[24] || (e[24] = g("span", { class: "profile-panel-grow" }, null, -1)),
        u(t(M), {
          variant: "ghost",
          small: "",
          "data-profile-cancel": "",
          onClick: e[15] || (e[15] = (a) => w("close"))
        }, {
          default: p(() => [...e[22] || (e[22] = [
            B("Cancel", -1)
          ])]),
          _: 1
        }),
        u(t(M), {
          variant: "primary",
          small: "",
          disabled: !E.value,
          "data-profile-save": "",
          onClick: e[16] || (e[16] = (a) => w("save", v.profile, o.value))
        }, {
          default: p(() => [...e[23] || (e[23] = [
            B("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: p(() => [
        re(l.$slots, "default", {}, void 0, !0),
        g("div", Ee, [
          v.profile.title ? (s(), d("small", Me, k(v.profile.name), 1)) : h("", !0),
          v.profile.name ? h("", !0) : (s(), x(t(I), {
            key: 1,
            label: "Name",
            for: "profile-name",
            help: "Letters, digits and dashes; the agent starts it by this name."
          }, {
            default: p(() => [
              u(t(D), {
                id: "profile-name",
                value: o.value.name,
                placeholder: "critic",
                onInput: e[0] || (e[0] = (a) => o.value.name = a.target.value.trim())
              }, null, 8, ["value"])
            ]),
            _: 1
          })),
          u(t(I), {
            label: "Title",
            for: "profile-title"
          }, {
            default: p(() => [
              u(t(D), {
                id: "profile-title",
                value: o.value.title,
                onInput: e[1] || (e[1] = (a) => o.value.title = a.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          u(t(I), {
            label: "When it is used",
            for: "profile-description",
            help: "The agent reads this to decide when to start it."
          }, {
            default: p(() => [
              u(t(Y), {
                id: "profile-description",
                rows: "3",
                value: o.value.description,
                onInput: e[2] || (e[2] = (a) => o.value.description = a.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          u(t(I), {
            label: "Type",
            for: "profile-type",
            help: "The type of agent that runs this profile."
          }, {
            default: p(() => {
              var a;
              return [
                v.profile.shipped ? (s(), d("span", Oe, k((a = y.value) == null ? void 0 : a.label), 1)) : (s(), x(t(U), {
                  key: 1,
                  "data-profile-type": "",
                  options: P.value,
                  value: o.value.agent_type,
                  onPick: e[3] || (e[3] = (A) => o.value.agent_type = A)
                }, null, 8, ["options", "value"]))
              ];
            }),
            _: 1
          }),
          u(t(I), {
            label: "Access",
            for: "profile-access",
            help: "Whether it may change files."
          }, {
            default: p(() => [
              u(t(U), {
                "data-profile-access": "",
                options: c.value,
                value: o.value.access,
                onPick: e[4] || (e[4] = (a) => o.value.access = a)
              }, null, 8, ["options", "value"])
            ]),
            _: 1
          }),
          u(t(I), {
            label: "Program",
            for: "profile-program",
            help: "A registered program, or the same program as the agent that starts it."
          }, {
            default: p(() => [
              u(t(U), {
                options: b.value,
                value: o.value.program,
                onPick: e[5] || (e[5] = (a) => o.value.program = a)
              }, null, 8, ["options", "value"])
            ]),
            _: 1
          }),
          o.value.program ? (s(), d(O, { key: 2 }, [
            u(t(I), {
              label: "When it cannot start",
              for: "profile-program-choice",
              help: "If possible: a start uses the other program, on its model, when this one is not installed or not ready, and says so."
            }, {
              default: p(() => [
                u(t(U), {
                  "data-profile-program-choice": "",
                  options: _,
                  value: o.value.preferred_program ? "possible" : "always",
                  onPick: e[6] || (e[6] = (a) => o.value.preferred_program = a === "possible")
                }, null, 8, ["value"])
              ]),
              _: 1
            }),
            o.value.preferred_program ? (s(), x(t(I), {
              key: 0,
              label: "Programs to try instead",
              for: "profile-fallbacks",
              help: "Program names in the order to try them, separated by commas. Blank tries every other program."
            }, {
              default: p(() => [
                u(t(D), {
                  id: "profile-fallbacks",
                  value: o.value.fallback_programs,
                  "data-profile-fallbacks": "",
                  onInput: e[7] || (e[7] = (a) => o.value.fallback_programs = a.target.value)
                }, null, 8, ["value"])
              ]),
              _: 1
            })) : h("", !0)
          ], 64)) : h("", !0),
          u(t(I), {
            label: "Model tier",
            for: "profile-tier",
            help: "Chooses a model when this profile has no named model for the program."
          }, {
            default: p(() => [
              u(t(U), {
                "data-profile-tier": "",
                options: f,
                value: o.value.tier || "",
                onPick: e[8] || (e[8] = (a) => o.value.tier = a || null)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          (s(!0), d(O, null, q(n.programs, (a) => (s(), x(t(I), {
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
                value: o.value.program_models[a.name] || "",
                "data-profile-model": a.name,
                onPick: (A) => o.value.program_models[a.name] = A
              }, null, 8, ["title", "models", "value", "data-profile-model", "onPick"])
            ]),
            _: 2
          }, 1032, ["label", "for"]))), 128)),
          u(t(I), {
            label: "Instructions",
            for: "profile-body",
            help: "What it is told each time it starts, after the brief."
          }, {
            default: p(() => [
              u(t(Y), {
                id: "profile-body",
                rows: "16",
                value: o.value.body,
                onInput: e[9] || (e[9] = (a) => o.value.body = a.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          u(t(I), {
            label: "MCP tools this profile may call",
            for: "profile-mcp",
            help: "Separate the names with commas."
          }, {
            default: p(() => [
              u(t(D), {
                id: "profile-mcp",
                value: o.value.mcp_tools,
                onInput: e[10] || (e[10] = (a) => o.value.mcp_tools = a.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          v.profile.name ? (s(), x(t(I), {
            key: 3,
            label: "Skills",
            help: "The skills this profile's agents get. A worker's worktree holds only these, and a read-only helper in the main checkout may read only these."
          }, {
            default: p(() => [
              u(Be, {
                profile: v.profile.name,
                chosen: o.value.skills,
                onChange: e[11] || (e[11] = (a) => o.value.skills = a)
              }, null, 8, ["profile", "chosen"])
            ]),
            _: 1
          })) : h("", !0),
          g("label", Le, [
            Z(g("input", {
              "onUpdate:modelValue": e[12] || (e[12] = (a) => o.value.independent = a),
              type: "checkbox",
              "data-profile-independent": ""
            }, null, 512), [
              [ne, o.value.independent]
            ]),
            e[18] || (e[18] = B(" Must judge fresh", -1))
          ]),
          v.profile.module_text_changed ? (s(), d(O, { key: 4 }, [
            e[20] || (e[20] = g("p", { class: "profile-panel-note" }, "Text changed: the journal's instructions have a new version.", -1)),
            u(t(M), {
              variant: "ghost",
              small: "",
              "data-profile-compare": "",
              onClick: e[13] || (e[13] = (a) => $.value = !$.value)
            }, {
              default: p(() => [...e[19] || (e[19] = [
                B("Compare", -1)
              ])]),
              _: 1
            }),
            $.value ? (s(), x(t(fe), {
              key: 0,
              path: "Instructions",
              change: "edit",
              added: V.value.filter((a) => a.line_type === "add").length,
              removed: V.value.filter((a) => a.line_type === "del").length,
              at: "",
              rows: V.value,
              "data-profile-diff": ""
            }, null, 8, ["added", "removed", "rows"])) : h("", !0)
          ], 64)) : h("", !0),
          v.profile.shipped ? (s(), d("p", Fe, "This comes with the journal. Your changes are kept through updates.")) : h("", !0)
        ])
      ]),
      _: 3
    }, 8, ["title", "abstract"]));
  }
}, Ue = /* @__PURE__ */ H(qe, [["__scopeId", "data-v-830fab69"]]), De = {
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
    const R = { name: "", title: "", description: "", agent_type: "helper", access: "read-only", program: "", independent: !1, mcp_tools: [], fallback_programs: [], changed: [], notes: [], problem: "", program_models: {}, tier: null, body: "", shipped: !1, uses: 0 }, n = { "read-only": "Read-only", writing: "Writing" }, w = K(), { rows: f, listing: _, failure: b, loaded: P, act: T, actionFailure: o } = w.props.profiles, y = w.props.programs.rows, N = S(() => _.value ? _.value.types : []), c = C(""), $ = C(""), j = C(""), V = C(!1), F = S(() => {
      const i = $.value.toLowerCase().split(/\s+/).filter(Boolean);
      return f.value.filter((r) => i.every((m) => {
        var L;
        return ve(r, m, (L = w.search) == null ? void 0 : L.fields);
      }));
    }), W = S(() => V.value ? R : f.value.find((i) => i.name === c.value) || null), E = (i) => {
      var r;
      return ((r = N.value.find((m) => m.key === i.agent_type)) == null ? void 0 : r.label) || i.agent_type;
    }, l = (i) => i.shipped ? "Comes with the journal" : i.module, e = (i) => [`Type: ${E(i)}`, `Access: ${n[i.access]}`, ...y.value.map((r) => {
      var m;
      return `${((m = i.program_models) == null ? void 0 : m[r.name]) || "chosen at start"} on ${r.title}`;
    }), i.changed.length ? "Changed" : "", l(i)].filter(Boolean).join(" · "), a = (i) => [i.problem, i.module_text_changed ? "Text changed: the journal's instructions have a new version" : "", ...i.notes].filter(Boolean), A = (i) => i.uses ? `Uses: ${i.uses} ${i.uses === 1 ? "time" : "times"}, last ${ye(new Date(i.last_used * 1e3).toISOString())}` : "Uses: none";
    function J() {
      V.value = !0, c.value = "";
    }
    function ee(i) {
      V.value = !1, c.value = i.name;
    }
    function le() {
      V.value = !1, c.value = "";
    }
    async function te(i) {
      j.value = "", (await T(["profile", "reset", i.name])).ok && (j.value = `${i.name} is back to the journal's version.`);
    }
    async function ae(i, r) {
      j.value = "";
      const m = i.name || r.name;
      (await T(["profile", "save", m, ...r.title ? ["--title", r.title] : [], "--description", r.description, "--type", r.agent_type, "--access", r.access, "--program", r.program, r.preferred_program ? "--program-if-possible" : "--no-program-if-possible", "--fallback-programs", r.fallback_programs, "--tier", r.tier || "", ...y.value.flatMap((Q) => [Q.model_option, r.program_models[Q.name] || ""]), "--mcp-tools", r.mcp_tools, r.independent ? "--independent" : "--no-independent", "--body", r.body, ...r.skills ? ["--skills", r.skills.join(",")] : []])).ok && (V.value = !1, c.value = m, j.value = `${m} saved. The agent will use it the next time it starts a helper with this profile.`);
    }
    return (i, r) => (s(), d("section", De, [
      u(t(me), {
        modelValue: $.value,
        "onUpdate:modelValue": r[0] || (r[0] = (m) => $.value = m),
        class: "bar",
        "data-profile-find": ""
      }, {
        default: p(() => [
          u(t(M), {
            variant: "ghost",
            small: "",
            "data-profile-new": "",
            onClick: J
          }, {
            default: p(() => [...r[1] || (r[1] = [
              B("New profile", -1)
            ])]),
            _: 1
          }),
          g("span", Ge, k(t(f).length) + " " + k(t(f).length === 1 ? "profile" : "profiles"), 1),
          j.value ? (s(), d("span", He, k(j.value), 1)) : h("", !0),
          t(o) ? (s(), d("span", Je, k(t(o)), 1)) : h("", !0)
        ]),
        _: 1
      }, 8, ["modelValue"]),
      t(b) ? (s(), x(t(z), {
        key: 0,
        class: "empty",
        title: "The profiles could not be read"
      }, {
        default: p(() => [
          B(k(t(b)), 1)
        ]),
        _: 1
      })) : !t(P) || !t(f).length ? (s(), x(t(z), {
        key: 1,
        class: "empty",
        loading: !t(P),
        title: "No profiles yet"
      }, {
        default: p(() => [...r[2] || (r[2] = [
          B(" A profile gives an agent its instructions, type and model. The journal includes standard profiles. ", -1)
        ])]),
        _: 1
      }, 8, ["loading"])) : F.value.length ? (s(), d("div", ze, [
        (s(!0), d(O, null, q(F.value, (m) => (s(), x(t(M), {
          key: m.name,
          variant: "text",
          fill: "",
          class: "profile-open",
          "aria-label": `Open ${m.name}`,
          "data-profile": m.name,
          onClick: (L) => ee(m)
        }, {
          default: p(() => [
            u(t(ce), {
              title: m.title || m.name,
              text: m.description
            }, {
              end: p(() => [
                g("span", Ye, [
                  m.title ? (s(), d("span", Ke, k(m.name), 1)) : h("", !0),
                  g("span", Qe, k(e(m)), 1),
                  (s(!0), d(O, null, q(a(m), (L) => (s(), d("span", {
                    key: L,
                    class: "profile-warning",
                    "data-profile-warning": ""
                  }, k(L), 1))), 128)),
                  g("span", {
                    class: ie(["profile-used", { never: !m.uses }])
                  }, k(A(m)), 3)
                ])
              ]),
              _: 2
            }, 1032, ["title", "text"])
          ]),
          _: 2
        }, 1032, ["aria-label", "data-profile", "onClick"]))), 128))
      ])) : (s(), x(t(z), {
        key: 2,
        class: "empty",
        title: "No profile matches"
      }, {
        default: p(() => [...r[3] || (r[3] = [
          B("Try other words.", -1)
        ])]),
        _: 1
      })),
      W.value ? (s(), x(Ue, {
        key: 4,
        programs: t(y),
        types: N.value,
        profile: W.value,
        used: A(W.value),
        onClose: le,
        onSave: ae,
        onReset: te
      }, {
        default: p(() => [
          W.value.name && W.value.agent_type === "helper" ? (s(), x(xe, {
            key: 0,
            programs: t(y),
            profile: W.value.name
          }, null, 8, ["programs", "profile"])) : h("", !0)
        ]),
        _: 1
      }, 8, ["programs", "types", "profile", "used"])) : h("", !0)
    ]));
  }
}, ll = /* @__PURE__ */ H(Xe, [["__scopeId", "data-v-9ff2dc75"]]);
export {
  ll as default
};
