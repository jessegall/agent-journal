/* @code-commandments-generated */
if (!document.getElementById("window-styles-bb8a9a14b116")) { const style = document.createElement("style"); style.id = "window-styles-bb8a9a14b116"; style.textContent = ".helper-start[data-v-c954766e]{display:grid;gap:12px;padding:0 0 20px;margin-bottom:20px;border-bottom:1px solid var(--border-2)}h3[data-v-c954766e]{margin:0;font-size:14px;font-weight:600}.field[data-v-c954766e]{display:grid;gap:4px}.field>span[data-v-c954766e]{color:var(--text-2);font-size:12px;font-weight:500}.reason[data-v-c954766e],.notice[data-v-c954766e]{margin:0;color:var(--text-3);font-size:12px;line-height:1.5;overflow-wrap:anywhere}.idle-helper[data-v-c954766e]{display:flex;align-items:center;justify-content:space-between;gap:12px}.profile-panel[data-v-dd5c62f2]{display:flex;flex-direction:column;gap:14px}.profile-panel-note[data-v-dd5c62f2]{margin:0;color:var(--text-3);font-size:12.5px}.profile-panel-check[data-v-dd5c62f2]{display:flex;gap:8px;align-items:center;font-size:13px}.profile-panel-grow[data-v-dd5c62f2]{flex:1}.profiles[data-v-6ccfd527]{padding:0 0 40px}.bar[data-v-6ccfd527]{flex-wrap:wrap;gap:8px 12px;color:var(--text-2)}.count[data-v-6ccfd527]{margin-left:auto;color:var(--text-3);font-size:12.5px}.notice[data-v-6ccfd527]{font-size:12px;color:var(--text-2)}.notice.failed[data-v-6ccfd527]{color:var(--danger)}.empty[data-v-6ccfd527]{margin:40px auto;max-width:480px}.rows[data-v-6ccfd527]{display:flex;flex-direction:column;padding:8px 14px 0 22px}.profile-open[data-v-6ccfd527]{text-align:left}.profile-meta[data-v-6ccfd527]{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:12px}.profile-model[data-v-6ccfd527]{color:var(--text-2)}.profile-used[data-v-6ccfd527]{color:var(--text-3);white-space:nowrap}.profile-warning[data-v-6ccfd527]{color:var(--tone-warn)}.profile-used.never[data-v-6ccfd527]{color:var(--text-4)}@media(max-width:640px){.profiles-find[data-v-6ccfd527]{flex:1 1 100%}.profile-meta[data-v-6ccfd527]{display:none}}\n"; document.head.appendChild(style); }
import { ref as k, computed as h, watch as J, openBlock as s, createElementBlock as m, withModifiers as oe, createElementVNode as c, createVNode as i, unref as l, withDirectives as X, Fragment as F, renderList as q, toDisplayString as y, vModelSelect as se, withCtx as u, createTextVNode as A, createCommentVNode as g, createBlock as _, renderSlot as ne, vModelCheckbox as re, normalizeClass as ie } from "vue";
import { useWindow as Z, TextArea as z, Btn as B, TextInput as D, SidePanel as ue, FormField as R, Segmented as U, ModelPicker as pe, DiffCard as de, matchesSearch as fe, SearchBar as ve, EmptyState as H, ListRow as me, ago as ce } from "@journal/window-kit";
const Y = (v, W) => {
  const p = v.__vccOpts || v;
  for (const [b, f] of W)
    p[b] = f;
  return p;
}, ye = { class: "field" }, ge = { class: "field" }, he = ["disabled"], be = ["value"], ke = ["data-helper-idle"], _e = {
  key: 0,
  class: "field"
}, we = {
  key: 1,
  class: "reason",
  "data-helper-fresh-blocked": ""
}, $e = {
  key: 2,
  class: "reason",
  "data-helper-start-reason": ""
}, Se = {
  key: 3,
  class: "notice"
}, Ce = {
  __name: "HelperStartForm",
  props: { profile: { type: String, required: !0 }, programs: { type: Array, required: !0 } },
  setup(v) {
    const W = v, p = Z(), b = { can_start: !1, reason: "", programs: [], idle_helpers: [], can_start_fresh: !1, fresh_reason: "" }, f = k(b), T = k(""), w = k(""), E = k(""), $ = k(""), o = k(!1), I = k(!0);
    let O = 0;
    const x = h(() => !o.value && !I.value && !!T.value.trim()), N = h(() => !x.value || !(f.value.can_start || f.value.can_start_fresh && $.value.trim()));
    async function S() {
      const V = ++O;
      if (I.value = !0, p.state["availability.profile"] = W.profile, w.value ? p.state["availability.program"] = w.value : delete p.state["availability.program"], await p.reload("availability"), V !== O) return;
      const t = p.props.availability;
      t.failure.value ? (f.value = b, E.value = t.failure.value) : f.value = t.data.value, I.value = !1;
    }
    async function P() {
      N.value || await j(["helper", "start", W.profile, "--brief", T.value, ...w.value ? ["--program", w.value] : [], ...$.value.trim() ? ["--fresh", $.value.trim()] : []], "The helper is starting.");
    }
    async function M(V) {
      x.value && await j(["helper", "send", String(V), T.value], "Job sent.");
    }
    async function j(V, t) {
      o.value = !0;
      try {
        const e = await p.run(V);
        E.value = e.ok ? t : e.error, e.ok && (T.value = "", $.value = ""), await S();
      } finally {
        o.value = !1;
      }
    }
    return J([() => W.profile, w], S, { immediate: !0 }), (V, t) => (s(), m("form", {
      class: "helper-start",
      "data-helper-start": "",
      onSubmit: oe(P, ["prevent"])
    }, [
      t[9] || (t[9] = c("h3", null, "Give a helper a job", -1)),
      c("label", ye, [
        t[3] || (t[3] = c("span", null, "The job", -1)),
        i(l(z), {
          value: T.value,
          rows: "3",
          disabled: o.value,
          "data-helper-brief": "",
          onInput: t[0] || (t[0] = (e) => T.value = e.target.value)
        }, null, 8, ["value", "disabled"])
      ]),
      c("label", ge, [
        t[5] || (t[5] = c("span", null, "Program", -1)),
        X(c("select", {
          "onUpdate:modelValue": t[1] || (t[1] = (e) => w.value = e),
          disabled: o.value,
          "data-helper-program": ""
        }, [
          t[4] || (t[4] = c("option", { value: "" }, "The profile program", -1)),
          (s(!0), m(F, null, q(f.value.programs, (e) => {
            var a;
            return s(), m("option", {
              key: e,
              value: e
            }, y(((a = v.programs.find((C) => C.name === e)) == null ? void 0 : a.title) || e), 9, be);
          }), 128))
        ], 8, he), [
          [se, w.value]
        ])
      ]),
      (s(!0), m(F, null, q(f.value.idle_helpers, (e) => (s(), m("div", {
        key: e.id,
        class: "idle-helper",
        "data-helper-idle": e.id
      }, [
        c("span", null, y(e.name) + " · Idle", 1),
        i(l(B), {
          type: "button",
          disabled: !x.value,
          "data-helper-send": e.id,
          onClick: (a) => M(e.id)
        }, {
          default: u(() => [...t[6] || (t[6] = [
            A("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled", "data-helper-send", "onClick"])
      ], 8, ke))), 128)),
      f.value.idle_helpers.length ? (s(), m("label", _e, [
        t[7] || (t[7] = c("span", null, "Why start another helper?", -1)),
        i(l(D), {
          modelValue: $.value,
          "onUpdate:modelValue": t[2] || (t[2] = (e) => $.value = e),
          disabled: o.value,
          "data-helper-fresh-reason": ""
        }, null, 8, ["modelValue", "disabled"])
      ])) : g("", !0),
      i(l(B), {
        type: "submit",
        disabled: N.value,
        "data-helper-start-button": ""
      }, {
        default: u(() => [...t[8] || (t[8] = [
          A("Start a helper", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      f.value.fresh_reason ? (s(), m("p", we, y(f.value.fresh_reason), 1)) : g("", !0),
      f.value.reason && f.value.reason !== f.value.fresh_reason ? (s(), m("p", $e, y(f.value.reason), 1)) : g("", !0),
      E.value ? (s(), m("p", Se, y(E.value), 1)) : g("", !0)
    ], 32));
  }
}, Te = /* @__PURE__ */ Y(Ce, [["__scopeId", "data-v-c954766e"]]), Ie = {
  class: "profile-panel",
  "data-profile-panel": ""
}, xe = { key: 0 }, Pe = {
  key: 0,
  "data-profile-type-locked": ""
}, je = { class: "profile-panel-check" }, Re = {
  key: 4,
  class: "profile-panel-note"
}, Q = "writing", Ae = {
  __name: "ProfilePanel",
  props: { profile: { type: Object, required: !0 }, used: { type: String, default: "" }, types: { type: Array, default: () => [] }, programs: { type: Array, required: !0 } },
  emits: ["close", "save", "reset"],
  setup(v, { emit: W }) {
    const p = v, b = W, f = [{ key: "", label: "Profile models" }, { key: "fast", label: "Fast" }, { key: "general", label: "General" }, { key: "strongest", label: "Strongest" }], T = [{ key: "always", label: "Always this program" }, { key: "possible", label: "This program if possible" }], w = h(() => [{ key: "", label: "The parent program" }, ...p.programs.map((t) => ({ key: t.name, label: t.title }))]), E = h(() => p.types.map((t) => ({ key: t.key, label: t.label }))), $ = ["title", "description", "agent_type", "access", "program", "program_if_possible", "independent", "mcp_tools", "program_models", "tier", "body"], o = k({});
    J(
      () => p.profile.name,
      () => {
        o.value = { name: p.profile.name, ...Object.fromEntries($.map((t) => [t, p.profile[t]])), mcp_tools: p.profile.mcp_tools.join(","), program_models: { ...p.profile.program_models } };
      },
      { immediate: !0 }
    );
    const I = h(() => p.types.find((t) => t.key === o.value.agent_type)), O = h(() => {
      var t;
      return ((t = I.value) == null ? void 0 : t.access) === Q;
    }), x = h(() => [{ key: "read-only", label: "Read-only" }, ...O.value ? [{ key: Q, label: "Writing" }] : []]);
    J(O, (t) => {
      t || (o.value.access = "read-only");
    });
    const N = k(!1), S = (t, e, a) => e.map((C, G) => ({ line_type: t, line: G + 1, text: C })).filter((C) => !a.includes(C.text)), P = h(() => {
      const t = p.profile.body.split(`
`), e = (p.profile.module_body || "").split(`
`);
      return [...S("del", t, e), ...S("add", e, t)];
    }), M = h(() => ({ ...p.profile, mcp_tools: p.profile.mcp_tools.join(",") })), j = h(() => $.some((t) => JSON.stringify(o.value[t]) !== JSON.stringify(M.value[t])) || !p.profile.name), V = h(() => j.value && /^[a-z0-9_-]+$/i.test(o.value.name || "") && o.value.description.trim());
    return (t, e) => (s(), _(l(ue), {
      title: v.profile.title || v.profile.name || "New profile",
      abstract: v.profile.name ? v.used : "Instructions, type and model for an agent",
      onClose: e[15] || (e[15] = (a) => b("close"))
    }, {
      foot: u(() => [
        v.profile.changed.length || v.profile.problem ? (s(), _(l(B), {
          key: 0,
          variant: "ghost",
          small: "",
          "data-profile-reset": "",
          onClick: e[12] || (e[12] = (a) => b("reset", v.profile))
        }, {
          default: u(() => [...e[19] || (e[19] = [
            A("Use the journal's version", -1)
          ])]),
          _: 1
        })) : g("", !0),
        e[22] || (e[22] = c("span", { class: "profile-panel-grow" }, null, -1)),
        i(l(B), {
          variant: "ghost",
          small: "",
          "data-profile-cancel": "",
          onClick: e[13] || (e[13] = (a) => b("close"))
        }, {
          default: u(() => [...e[20] || (e[20] = [
            A("Cancel", -1)
          ])]),
          _: 1
        }),
        i(l(B), {
          variant: "primary",
          small: "",
          disabled: !V.value,
          "data-profile-save": "",
          onClick: e[14] || (e[14] = (a) => b("save", v.profile, o.value))
        }, {
          default: u(() => [...e[21] || (e[21] = [
            A("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: u(() => [
        ne(t.$slots, "default", {}, void 0, !0),
        c("div", Ie, [
          v.profile.title ? (s(), m("small", xe, y(v.profile.name), 1)) : g("", !0),
          v.profile.name ? g("", !0) : (s(), _(l(R), {
            key: 1,
            label: "Name",
            for: "profile-name",
            help: "Letters, digits and dashes; the agent starts it by this name."
          }, {
            default: u(() => [
              i(l(D), {
                id: "profile-name",
                value: o.value.name,
                placeholder: "critic",
                onInput: e[0] || (e[0] = (a) => o.value.name = a.target.value.trim())
              }, null, 8, ["value"])
            ]),
            _: 1
          })),
          i(l(R), {
            label: "Title",
            for: "profile-title"
          }, {
            default: u(() => [
              i(l(D), {
                id: "profile-title",
                value: o.value.title,
                onInput: e[1] || (e[1] = (a) => o.value.title = a.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(l(R), {
            label: "When it is used",
            for: "profile-description",
            help: "The agent reads this to decide when to start it."
          }, {
            default: u(() => [
              i(l(z), {
                id: "profile-description",
                rows: "3",
                value: o.value.description,
                onInput: e[2] || (e[2] = (a) => o.value.description = a.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(l(R), {
            label: "Type",
            for: "profile-type",
            help: "The type of agent that runs this profile."
          }, {
            default: u(() => {
              var a;
              return [
                v.profile.shipped ? (s(), m("span", Pe, y((a = I.value) == null ? void 0 : a.label), 1)) : (s(), _(l(U), {
                  key: 1,
                  "data-profile-type": "",
                  options: E.value,
                  value: o.value.agent_type,
                  onPick: e[3] || (e[3] = (C) => o.value.agent_type = C)
                }, null, 8, ["options", "value"]))
              ];
            }),
            _: 1
          }),
          i(l(R), {
            label: "Access",
            for: "profile-access",
            help: "Whether it may change files."
          }, {
            default: u(() => [
              i(l(U), {
                "data-profile-access": "",
                options: x.value,
                value: o.value.access,
                onPick: e[4] || (e[4] = (a) => o.value.access = a)
              }, null, 8, ["options", "value"])
            ]),
            _: 1
          }),
          i(l(R), {
            label: "Program",
            for: "profile-program",
            help: "A registered program, or the same program as the agent that starts it."
          }, {
            default: u(() => [
              i(l(U), {
                options: w.value,
                value: o.value.program,
                onPick: e[5] || (e[5] = (a) => o.value.program = a)
              }, null, 8, ["options", "value"])
            ]),
            _: 1
          }),
          o.value.program ? (s(), _(l(R), {
            key: 2,
            label: "When it cannot start",
            for: "profile-program-choice",
            help: "If possible: a start uses the other program, on its model, when this one is not installed or not ready, and says so."
          }, {
            default: u(() => [
              i(l(U), {
                "data-profile-program-choice": "",
                options: T,
                value: o.value.program_if_possible ? "possible" : "always",
                onPick: e[6] || (e[6] = (a) => o.value.program_if_possible = a === "possible")
              }, null, 8, ["value"])
            ]),
            _: 1
          })) : g("", !0),
          i(l(R), {
            label: "Model tier",
            for: "profile-tier",
            help: "Chooses a model when this profile has no named model for the program."
          }, {
            default: u(() => [
              i(l(U), {
                "data-profile-tier": "",
                options: f,
                value: o.value.tier || "",
                onPick: e[7] || (e[7] = (a) => o.value.tier = a || null)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          (s(!0), m(F, null, q(p.programs, (a) => (s(), _(l(R), {
            key: a.name,
            label: `Model on ${a.title}`,
            for: `profile-model-${a.name}`,
            help: "The least expensive model that reliably fits the work."
          }, {
            default: u(() => [
              i(l(pe), {
                title: a.title,
                models: a.models,
                inherits: "",
                value: o.value.program_models[a.name] || "",
                "data-profile-model": a.name,
                onPick: (C) => o.value.program_models[a.name] = C
              }, null, 8, ["title", "models", "value", "data-profile-model", "onPick"])
            ]),
            _: 2
          }, 1032, ["label", "for"]))), 128)),
          i(l(R), {
            label: "Instructions",
            for: "profile-body",
            help: "What it is told each time it starts, after the brief."
          }, {
            default: u(() => [
              i(l(z), {
                id: "profile-body",
                rows: "16",
                value: o.value.body,
                onInput: e[8] || (e[8] = (a) => o.value.body = a.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(l(R), {
            label: "MCP tools this profile may call",
            for: "profile-mcp",
            help: "Separate the names with commas."
          }, {
            default: u(() => [
              i(l(D), {
                id: "profile-mcp",
                value: o.value.mcp_tools,
                onInput: e[9] || (e[9] = (a) => o.value.mcp_tools = a.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          c("label", je, [
            X(c("input", {
              "onUpdate:modelValue": e[10] || (e[10] = (a) => o.value.independent = a),
              type: "checkbox",
              "data-profile-independent": ""
            }, null, 512), [
              [re, o.value.independent]
            ]),
            e[16] || (e[16] = A(" Must judge fresh", -1))
          ]),
          v.profile.module_text_changed ? (s(), m(F, { key: 3 }, [
            e[18] || (e[18] = c("p", { class: "profile-panel-note" }, "Text changed: the journal's instructions have a new version.", -1)),
            i(l(B), {
              variant: "ghost",
              small: "",
              "data-profile-compare": "",
              onClick: e[11] || (e[11] = (a) => N.value = !N.value)
            }, {
              default: u(() => [...e[17] || (e[17] = [
                A("Compare", -1)
              ])]),
              _: 1
            }),
            N.value ? (s(), _(l(de), {
              key: 0,
              path: "Instructions",
              change: "edit",
              added: P.value.filter((a) => a.line_type === "add").length,
              removed: P.value.filter((a) => a.line_type === "del").length,
              at: "",
              rows: P.value,
              "data-profile-diff": ""
            }, null, 8, ["added", "removed", "rows"])) : g("", !0)
          ], 64)) : g("", !0),
          v.profile.shipped ? (s(), m("p", Re, "This comes with the journal. Your changes are kept through updates.")) : g("", !0)
        ])
      ]),
      _: 3
    }, 8, ["title", "abstract"]));
  }
}, Ne = /* @__PURE__ */ Y(Ae, [["__scopeId", "data-v-dd5c62f2"]]), Ve = {
  class: "profiles",
  "data-profiles": ""
}, We = {
  class: "count",
  "data-profile-count": ""
}, Ee = {
  key: 0,
  class: "notice",
  "data-profile-notice": ""
}, Oe = {
  key: 1,
  class: "notice failed",
  role: "alert",
  "data-profile-failure": ""
}, Be = {
  key: 3,
  class: "rows"
}, Le = { class: "profile-meta" }, Me = {
  key: 0,
  class: "profile-model"
}, Fe = { class: "profile-model" }, Ue = {
  __name: "ProfileRows",
  setup(v) {
    const W = { name: "", title: "", description: "", agent_type: "helper", access: "read-only", program: "", independent: !1, mcp_tools: [], changed: [], notes: [], problem: "", program_models: {}, tier: null, body: "", shipped: !1, uses: 0 }, p = { "read-only": "Read-only", writing: "Writing" }, b = Z(), { rows: f, listing: T, failure: w, loaded: E, act: $, actionFailure: o } = b.props.profiles, I = b.props.programs.rows, O = h(() => T.value ? T.value.types : []), x = k(""), N = k(""), S = k(""), P = k(!1), M = h(() => {
      const n = N.value.toLowerCase().split(/\s+/).filter(Boolean);
      return f.value.filter((r) => n.every((d) => {
        var L;
        return fe(r, d, (L = b.search) == null ? void 0 : L.fields);
      }));
    }), j = h(() => P.value ? W : f.value.find((n) => n.name === x.value) || null), V = (n) => {
      var r;
      return ((r = O.value.find((d) => d.key === n.agent_type)) == null ? void 0 : r.label) || n.agent_type;
    }, t = (n) => n.shipped ? "Comes with the journal" : n.module, e = (n) => [`Type: ${V(n)}`, `Access: ${p[n.access]}`, ...I.value.map((r) => {
      var d;
      return `${((d = n.program_models) == null ? void 0 : d[r.name]) || "chosen at start"} on ${r.title}`;
    }), n.changed.length ? "Changed" : "", t(n)].filter(Boolean).join(" · "), a = (n) => [n.problem, n.module_text_changed ? "Text changed: the journal's instructions have a new version" : "", ...n.notes].filter(Boolean), C = (n) => n.uses ? `Uses: ${n.uses} ${n.uses === 1 ? "time" : "times"}, last ${ce(new Date(n.last_used * 1e3).toISOString())}` : "Uses: none";
    function G() {
      P.value = !0, x.value = "";
    }
    function ee(n) {
      P.value = !1, x.value = n.name;
    }
    function te() {
      P.value = !1, x.value = "";
    }
    async function le(n) {
      S.value = "", (await $(["profile", "reset", n.name])).ok && (S.value = `${n.name} is back to the journal's version.`);
    }
    async function ae(n, r) {
      S.value = "";
      const d = n.name || r.name;
      (await $(["profile", "save", d, ...r.title ? ["--title", r.title] : [], "--description", r.description, "--type", r.agent_type, "--access", r.access, "--program", r.program, r.program_if_possible ? "--program-if-possible" : "--no-program-if-possible", "--tier", r.tier || "", ...I.value.flatMap((K) => [K.model_option, r.program_models[K.name] || ""]), "--mcp-tools", r.mcp_tools, r.independent ? "--independent" : "--no-independent", "--body", r.body])).ok && (P.value = !1, x.value = d, S.value = `${d} saved. The agent will use it the next time it starts a helper with this profile.`);
    }
    return (n, r) => (s(), m("section", Ve, [
      i(l(ve), {
        modelValue: N.value,
        "onUpdate:modelValue": r[0] || (r[0] = (d) => N.value = d),
        class: "bar",
        "data-profile-find": ""
      }, {
        default: u(() => [
          i(l(B), {
            variant: "ghost",
            small: "",
            "data-profile-new": "",
            onClick: G
          }, {
            default: u(() => [...r[1] || (r[1] = [
              A("New profile", -1)
            ])]),
            _: 1
          }),
          c("span", We, y(l(f).length) + " " + y(l(f).length === 1 ? "profile" : "profiles"), 1),
          S.value ? (s(), m("span", Ee, y(S.value), 1)) : g("", !0),
          l(o) ? (s(), m("span", Oe, y(l(o)), 1)) : g("", !0)
        ]),
        _: 1
      }, 8, ["modelValue"]),
      l(w) ? (s(), _(l(H), {
        key: 0,
        class: "empty",
        title: "The profiles could not be read"
      }, {
        default: u(() => [
          A(y(l(w)), 1)
        ]),
        _: 1
      })) : !l(E) || !l(f).length ? (s(), _(l(H), {
        key: 1,
        class: "empty",
        loading: !l(E),
        title: "No profiles yet"
      }, {
        default: u(() => [...r[2] || (r[2] = [
          A(" A profile gives an agent its instructions, type and model. The journal includes standard profiles. ", -1)
        ])]),
        _: 1
      }, 8, ["loading"])) : M.value.length ? (s(), m("div", Be, [
        (s(!0), m(F, null, q(M.value, (d) => (s(), _(l(B), {
          key: d.name,
          variant: "text",
          fill: "",
          class: "profile-open",
          "aria-label": `Open ${d.name}`,
          "data-profile": d.name,
          onClick: (L) => ee(d)
        }, {
          default: u(() => [
            i(l(me), {
              title: d.title || d.name,
              text: d.description
            }, {
              end: u(() => [
                c("span", Le, [
                  d.title ? (s(), m("span", Me, y(d.name), 1)) : g("", !0),
                  c("span", Fe, y(e(d)), 1),
                  (s(!0), m(F, null, q(a(d), (L) => (s(), m("span", {
                    key: L,
                    class: "profile-warning",
                    "data-profile-warning": ""
                  }, y(L), 1))), 128)),
                  c("span", {
                    class: ie(["profile-used", { never: !d.uses }])
                  }, y(C(d)), 3)
                ])
              ]),
              _: 2
            }, 1032, ["title", "text"])
          ]),
          _: 2
        }, 1032, ["aria-label", "data-profile", "onClick"]))), 128))
      ])) : (s(), _(l(H), {
        key: 2,
        class: "empty",
        title: "No profile matches"
      }, {
        default: u(() => [...r[3] || (r[3] = [
          A("Try other words.", -1)
        ])]),
        _: 1
      })),
      j.value ? (s(), _(Ne, {
        key: 4,
        programs: l(I),
        types: O.value,
        profile: j.value,
        used: C(j.value),
        onClose: te,
        onSave: ae,
        onReset: le
      }, {
        default: u(() => [
          j.value.name && j.value.agent_type === "helper" ? (s(), _(Te, {
            key: 0,
            programs: l(I),
            profile: j.value.name
          }, null, 8, ["programs", "profile"])) : g("", !0)
        ]),
        _: 1
      }, 8, ["programs", "types", "profile", "used"])) : g("", !0)
    ]));
  }
}, Ge = /* @__PURE__ */ Y(Ue, [["__scopeId", "data-v-6ccfd527"]]);
export {
  Ge as default
};
