/* @code-commandments-generated */
if (!document.getElementById("window-styles-d4168b1eb2dd")) { const style = document.createElement("style"); style.id = "window-styles-d4168b1eb2dd"; style.textContent = ".helper-start[data-v-a4f6a3c4]{display:grid;gap:8px;margin-top:12px}.field[data-v-a4f6a3c4]{display:grid;gap:4px}.reason[data-v-a4f6a3c4],.notice[data-v-a4f6a3c4]{margin:0}.profile-panel[data-v-27cd4ee6]{display:flex;flex-direction:column;gap:14px}.profile-panel-note[data-v-27cd4ee6]{margin:0;color:var(--text-3);font-size:12.5px}.profile-panel-check[data-v-27cd4ee6]{display:flex;gap:8px;align-items:center;font-size:13px}.profile-panel-grow[data-v-27cd4ee6]{flex:1}.profiles[data-v-58f28de8]{padding:0 0 40px}.bar[data-v-58f28de8]{flex-wrap:wrap;gap:8px 12px;color:var(--text-2)}.count[data-v-58f28de8]{margin-left:auto;color:var(--text-3);font-size:12.5px}.notice[data-v-58f28de8]{font-size:12px;color:var(--text-2)}.notice.failed[data-v-58f28de8]{color:var(--danger)}.empty[data-v-58f28de8]{margin:40px auto;max-width:480px}.rows[data-v-58f28de8]{display:flex;flex-direction:column;padding:8px 14px 0 22px}.profile-open[data-v-58f28de8]{text-align:left}.profile-meta[data-v-58f28de8]{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:12px}.profile-model[data-v-58f28de8]{color:var(--text-2)}.profile-used[data-v-58f28de8]{color:var(--text-3);white-space:nowrap}.profile-warning[data-v-58f28de8]{color:var(--tone-warn)}.profile-used.never[data-v-58f28de8]{color:var(--text-4)}@media(max-width:640px){.profiles-find[data-v-58f28de8]{flex:1 1 100%}.profile-meta[data-v-58f28de8]{display:none}}\n"; document.head.appendChild(style); }
import { ref as S, computed as k, onMounted as le, openBlock as s, createElementBlock as v, withModifiers as ae, createElementVNode as y, withDirectives as D, vModelText as oe, Fragment as F, renderList as q, toDisplayString as b, vModelSelect as ne, createVNode as i, unref as t, withCtx as u, createTextVNode as _, createCommentVNode as x, watch as G, createBlock as $, vModelCheckbox as se, normalizeClass as re } from "vue";
import { useWindow as ie, Btn as B, SidePanel as de, FormField as I, TextInput as H, TextArea as Y, Segmented as A, ModelPicker as J, DiffCard as ue, useRows as pe, matchesSearch as fe, SearchBar as ce, EmptyState as U, ListRow as me, ago as ve } from "@journal/window-kit";
const z = (c, M) => {
  const f = c.__vccOpts || c;
  for (const [m, h] of M)
    f[m] = h;
  return f;
}, ye = { class: "field" }, ge = { class: "field" }, he = ["value"], ke = {
  key: 0,
  class: "reason",
  "data-helper-start-reason": ""
}, be = {
  key: 1,
  class: "notice"
}, xe = {
  __name: "HelperStartForm",
  props: { profile: { type: String, required: !0 } },
  setup(c) {
    const M = c, f = ie(), m = S({ reason: "", programs: [] }), h = S(""), T = S(""), P = S(""), o = k(() => !!m.value.reason || !h.value.trim());
    async function j() {
      const w = await f.read("helper availability");
      w.ok && (m.value = w.value);
    }
    async function E() {
      const w = ["helper", "start", M.profile, "--brief", h.value, ...T.value ? ["--program", T.value] : []], n = await f.run(w);
      P.value = n.ok ? "The helper is starting." : n.error, n.ok && (h.value = ""), await j();
    }
    return le(j), (w, n) => (s(), v("form", {
      class: "helper-start",
      "data-helper-start": "",
      onSubmit: ae(E, ["prevent"])
    }, [
      y("label", ye, [
        n[2] || (n[2] = y("span", null, "The job", -1)),
        D(y("textarea", {
          "onUpdate:modelValue": n[0] || (n[0] = (g) => h.value = g),
          rows: "3",
          "data-helper-brief": ""
        }, null, 512), [
          [oe, h.value]
        ])
      ]),
      y("label", ge, [
        n[4] || (n[4] = y("span", null, "Program", -1)),
        D(y("select", {
          "onUpdate:modelValue": n[1] || (n[1] = (g) => T.value = g),
          "data-helper-program": ""
        }, [
          n[3] || (n[3] = y("option", { value: "" }, "The profile's program", -1)),
          (s(!0), v(F, null, q(m.value.programs, (g) => (s(), v("option", {
            key: g,
            value: g
          }, b(g), 9, he))), 128))
        ], 512), [
          [ne, T.value]
        ])
      ]),
      i(t(B), {
        type: "submit",
        disabled: o.value,
        "data-helper-start-button": ""
      }, {
        default: u(() => [...n[5] || (n[5] = [
          _("Start a helper", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      m.value.reason ? (s(), v("p", ke, b(m.value.reason), 1)) : x("", !0),
      P.value ? (s(), v("p", be, b(P.value), 1)) : x("", !0)
    ], 32));
  }
}, we = /* @__PURE__ */ z(xe, [["__scopeId", "data-v-a4f6a3c4"]]), Ce = {
  class: "profile-panel",
  "data-profile-panel": ""
}, _e = {
  key: 0,
  "data-profile-type-locked": ""
}, $e = { class: "profile-panel-check" }, Se = {
  key: 2,
  class: "profile-panel-note"
}, K = "writing", Te = {
  __name: "ProfilePanel",
  props: { profile: { type: Object, required: !0 }, used: { type: String, default: "" }, types: { type: Array, default: () => [] } },
  emits: ["close", "save", "reset"],
  setup(c, { emit: M }) {
    const f = c, m = M, h = [{ key: "", label: "The parent's program" }, { key: "claude", label: "Claude Code" }, { key: "codex", label: "Codex" }], T = k(() => f.types.map((d) => ({ key: d.key, label: d.label }))), P = ["description", "agent_type", "access", "program", "independent", "mcp_tools", "model", "codex_model", "body"], o = S({});
    G(
      () => f.profile.name,
      () => {
        o.value = { name: f.profile.name, ...Object.fromEntries(P.map((d) => [d, f.profile[d]])), mcp_tools: f.profile.mcp_tools.join(",") };
      },
      { immediate: !0 }
    );
    const j = k(() => f.types.find((d) => d.key === o.value.agent_type)), E = k(() => {
      var d;
      return ((d = j.value) == null ? void 0 : d.access) === K;
    }), w = k(() => [{ key: "read-only", label: "Read-only" }, ...E.value ? [{ key: K, label: "Writing" }] : []]);
    G(E, (d) => {
      d || (o.value.access = "read-only");
    });
    const n = S(!1), g = (d, e, l) => e.map((W, O) => ({ line_type: d, line: O + 1, text: W })).filter((W) => !l.includes(W.text)), C = k(() => {
      const d = f.profile.body.split(`
`), e = (f.profile.module_body || "").split(`
`);
      return [...g("del", d, e), ...g("add", e, d)];
    }), N = k(() => ({ ...f.profile, mcp_tools: f.profile.mcp_tools.join(",") })), L = k(() => P.some((d) => o.value[d] !== N.value[d]) || !f.profile.name), R = k(() => L.value && /^[a-z0-9_-]+$/i.test(o.value.name || "") && o.value.description.trim());
    return (d, e) => (s(), $(t(de), {
      title: c.profile.name || "New profile",
      abstract: c.profile.name ? c.used : "Instructions, type and model for an agent",
      onClose: e[14] || (e[14] = (l) => m("close"))
    }, {
      foot: u(() => [
        c.profile.changed.length || c.profile.problem ? (s(), $(t(B), {
          key: 0,
          kind: "ghost",
          small: "",
          "data-profile-reset": "",
          onClick: e[11] || (e[11] = (l) => m("reset", c.profile))
        }, {
          default: u(() => [...e[18] || (e[18] = [
            _("Use the journal's version", -1)
          ])]),
          _: 1
        })) : x("", !0),
        e[21] || (e[21] = y("span", { class: "profile-panel-grow" }, null, -1)),
        i(t(B), {
          kind: "ghost",
          small: "",
          "data-profile-cancel": "",
          onClick: e[12] || (e[12] = (l) => m("close"))
        }, {
          default: u(() => [...e[19] || (e[19] = [
            _("Cancel", -1)
          ])]),
          _: 1
        }),
        i(t(B), {
          kind: "primary",
          small: "",
          disabled: !R.value,
          "data-profile-save": "",
          onClick: e[13] || (e[13] = (l) => m("save", c.profile, o.value))
        }, {
          default: u(() => [...e[20] || (e[20] = [
            _("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: u(() => [
        y("div", Ce, [
          c.profile.name ? x("", !0) : (s(), $(t(I), {
            key: 0,
            label: "Name",
            for: "profile-name",
            help: "Letters, digits and dashes; the agent starts it by this name."
          }, {
            default: u(() => [
              i(t(H), {
                id: "profile-name",
                value: o.value.name,
                placeholder: "critic",
                onInput: e[0] || (e[0] = (l) => o.value.name = l.target.value.trim())
              }, null, 8, ["value"])
            ]),
            _: 1
          })),
          i(t(I), {
            label: "When it is used",
            for: "profile-description",
            help: "The agent reads this to decide when to start it."
          }, {
            default: u(() => [
              i(t(Y), {
                id: "profile-description",
                rows: "3",
                value: o.value.description,
                onInput: e[1] || (e[1] = (l) => o.value.description = l.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(t(I), {
            label: "Type",
            for: "profile-kind",
            help: "The kind of agent that runs this profile."
          }, {
            default: u(() => {
              var l;
              return [
                c.profile.shipped ? (s(), v("span", _e, b((l = j.value) == null ? void 0 : l.label), 1)) : (s(), $(t(A), {
                  key: 1,
                  "data-profile-type": "",
                  options: T.value,
                  value: o.value.agent_type,
                  onPick: e[2] || (e[2] = (W) => o.value.agent_type = W)
                }, null, 8, ["options", "value"]))
              ];
            }),
            _: 1
          }),
          i(t(I), {
            label: "Access",
            for: "profile-access",
            help: "Whether it may change files."
          }, {
            default: u(() => [
              i(t(A), {
                "data-profile-access": "",
                options: w.value,
                value: o.value.access,
                onPick: e[3] || (e[3] = (l) => o.value.access = l)
              }, null, 8, ["options", "value"])
            ]),
            _: 1
          }),
          i(t(I), {
            label: "Program",
            for: "profile-program",
            help: "Claude Code or Codex, or the same program as the agent that starts it."
          }, {
            default: u(() => [
              i(t(A), {
                options: h,
                value: o.value.program,
                onPick: e[4] || (e[4] = (l) => o.value.program = l)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(t(I), {
            label: "Model on Claude Code",
            for: "profile-model",
            help: "The least expensive model that reliably fits the work."
          }, {
            default: u(() => [
              i(t(J), {
                provider: "claude",
                inherits: "",
                value: o.value.model,
                "data-profile-model": "claude",
                onPick: e[5] || (e[5] = (l) => o.value.model = l)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(t(I), {
            label: "Model on Codex",
            for: "profile-codex-model",
            help: "The model it runs on when the agent is Codex."
          }, {
            default: u(() => [
              i(t(J), {
                provider: "codex",
                inherits: "",
                value: o.value.codex_model,
                "data-profile-model": "codex",
                onPick: e[6] || (e[6] = (l) => o.value.codex_model = l)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(t(I), {
            label: "Instructions",
            for: "profile-body",
            help: "What it is told each time it starts, after the brief."
          }, {
            default: u(() => [
              i(t(Y), {
                id: "profile-body",
                rows: "16",
                value: o.value.body,
                onInput: e[7] || (e[7] = (l) => o.value.body = l.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(t(I), {
            label: "MCP tools this profile may call",
            for: "profile-mcp",
            help: "Separate the names with commas."
          }, {
            default: u(() => [
              i(t(H), {
                id: "profile-mcp",
                value: o.value.mcp_tools,
                onInput: e[8] || (e[8] = (l) => o.value.mcp_tools = l.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          y("label", $e, [
            D(y("input", {
              "onUpdate:modelValue": e[9] || (e[9] = (l) => o.value.independent = l),
              type: "checkbox",
              "data-profile-independent": ""
            }, null, 512), [
              [se, o.value.independent]
            ]),
            e[15] || (e[15] = _(" Must judge fresh", -1))
          ]),
          c.profile.module_text_changed ? (s(), v(F, { key: 1 }, [
            e[17] || (e[17] = y("p", { class: "profile-panel-note" }, "Text changed: the journal's instructions have a new version.", -1)),
            i(t(B), {
              kind: "ghost",
              small: "",
              "data-profile-compare": "",
              onClick: e[10] || (e[10] = (l) => n.value = !n.value)
            }, {
              default: u(() => [...e[16] || (e[16] = [
                _("Compare", -1)
              ])]),
              _: 1
            }),
            n.value ? (s(), $(t(ue), {
              key: 0,
              path: "Instructions",
              kind: "edit",
              added: C.value.filter((l) => l.line_type === "add").length,
              removed: C.value.filter((l) => l.line_type === "del").length,
              at: "",
              rows: C.value,
              "data-profile-diff": ""
            }, null, 8, ["added", "removed", "rows"])) : x("", !0)
          ], 64)) : x("", !0),
          c.profile.shipped ? (s(), v("p", Se, "This comes with the journal. Your changes are kept through updates.")) : x("", !0)
        ])
      ]),
      _: 1
    }, 8, ["title", "abstract"]));
  }
}, Pe = /* @__PURE__ */ z(Te, [["__scopeId", "data-v-27cd4ee6"]]), Ie = {
  class: "profiles",
  "data-profiles": ""
}, je = {
  class: "count",
  "data-profile-count": ""
}, Re = {
  key: 0,
  class: "notice",
  "data-profile-notice": ""
}, Me = {
  key: 1,
  class: "notice failed",
  role: "alert",
  "data-profile-failure": ""
}, Ne = {
  key: 3,
  class: "rows"
}, We = { class: "profile-meta" }, Ve = { class: "profile-model" }, Be = {
  __name: "ProfileRows",
  setup(c) {
    const M = { name: "", description: "", agent_type: "helper", access: "read-only", program: "", independent: !1, mcp_tools: [], changed: [], notes: [], problem: "", model: "sonnet", codex_model: "gpt-6.1-sol", body: "", shipped: !1, uses: 0 }, f = { "read-only": "Read-only", writing: "Writing" }, { rows: m, listing: h, failure: T, loaded: P, act: o, actionFailure: j, context: E } = pe("profile list", []), w = k(() => h.value ? h.value.types : []), n = S(""), g = S(""), C = S(""), N = S(!1), L = k(() => {
      const a = g.value.toLowerCase().split(/\s+/).filter(Boolean);
      return m.value.filter((r) => a.every((p) => {
        var V;
        return fe(r, p, (V = E.search) == null ? void 0 : V.fields);
      }));
    }), R = k(() => N.value ? M : m.value.find((a) => a.name === n.value) || null), d = (a) => {
      var r;
      return ((r = w.value.find((p) => p.key === a.agent_type)) == null ? void 0 : r.label) || a.agent_type;
    }, e = (a) => a.shipped ? "Comes with the journal" : a.module, l = (a) => [`Type: ${d(a)}`, `Access: ${f[a.access]}`, `${a.model || "chosen at start"} on Claude`, `${a.codex_model || "chosen at start"} on Codex`, a.changed.length ? "Changed" : "", e(a)].filter(Boolean).join(" · "), W = (a) => [a.problem, a.module_text_changed ? "Text changed: the journal's instructions have a new version" : "", ...a.notes].filter(Boolean), O = (a) => a.uses ? `Uses: ${a.uses} ${a.uses === 1 ? "time" : "times"}, last ${ve(new Date(a.last_used * 1e3).toISOString())}` : "Uses: none";
    function Q() {
      N.value = !0, n.value = "";
    }
    function X(a) {
      N.value = !1, n.value = a.name;
    }
    function Z() {
      N.value = !1, n.value = "";
    }
    async function ee(a) {
      C.value = "", (await o(["profile", "reset", a.name])).ok && (C.value = `${a.name} is back to the journal's version.`);
    }
    async function te(a, r) {
      C.value = "";
      const p = a.name || r.name;
      (await o(["profile", "save", p, "--description", r.description, "--type", r.agent_type, "--access", r.access, "--program", r.program, "--model", r.model, "--codex-model", r.codex_model, "--mcp-tools", r.mcp_tools, r.independent ? "--independent" : "--no-independent", "--body", r.body])).ok && (N.value = !1, n.value = p, C.value = `${p} saved. The agent will use it the next time it starts a helper with this profile.`);
    }
    return (a, r) => (s(), v("section", Ie, [
      i(t(ce), {
        modelValue: g.value,
        "onUpdate:modelValue": r[0] || (r[0] = (p) => g.value = p),
        class: "bar",
        "data-profile-find": ""
      }, {
        default: u(() => [
          i(t(B), {
            kind: "ghost",
            small: "",
            "data-profile-new": "",
            onClick: Q
          }, {
            default: u(() => [...r[1] || (r[1] = [
              _("New profile", -1)
            ])]),
            _: 1
          }),
          y("span", je, b(t(m).length) + " " + b(t(m).length === 1 ? "profile" : "profiles"), 1),
          C.value ? (s(), v("span", Re, b(C.value), 1)) : x("", !0),
          t(j) ? (s(), v("span", Me, b(t(j)), 1)) : x("", !0)
        ]),
        _: 1
      }, 8, ["modelValue"]),
      t(T) ? (s(), $(t(U), {
        key: 0,
        class: "empty",
        title: "The profiles could not be read"
      }, {
        default: u(() => [
          _(b(t(T)), 1)
        ]),
        _: 1
      })) : !t(P) || !t(m).length ? (s(), $(t(U), {
        key: 1,
        class: "empty",
        loading: !t(P),
        title: "No profiles yet"
      }, {
        default: u(() => [...r[2] || (r[2] = [
          _(" A profile gives an agent its instructions, type and model. The journal includes standard profiles. ", -1)
        ])]),
        _: 1
      }, 8, ["loading"])) : L.value.length ? (s(), v("div", Ne, [
        (s(!0), v(F, null, q(L.value, (p) => (s(), $(t(B), {
          key: p.name,
          kind: "text",
          fill: "",
          class: "profile-open",
          "aria-label": `Open ${p.name}`,
          "data-profile": p.name,
          onClick: (V) => X(p)
        }, {
          default: u(() => [
            i(t(me), {
              title: p.name,
              text: p.description
            }, {
              end: u(() => [
                y("span", We, [
                  y("span", Ve, b(l(p)), 1),
                  (s(!0), v(F, null, q(W(p), (V) => (s(), v("span", {
                    key: V,
                    class: "profile-warning",
                    "data-profile-warning": ""
                  }, b(V), 1))), 128)),
                  y("span", {
                    class: re(["profile-used", { never: !p.uses }])
                  }, b(O(p)), 3)
                ])
              ]),
              _: 2
            }, 1032, ["title", "text"])
          ]),
          _: 2
        }, 1032, ["aria-label", "data-profile", "onClick"]))), 128))
      ])) : (s(), $(t(U), {
        key: 2,
        class: "empty",
        title: "No profile matches"
      }, {
        default: u(() => [...r[3] || (r[3] = [
          _("Try other words.", -1)
        ])]),
        _: 1
      })),
      R.value ? (s(), v(F, { key: 4 }, [
        i(Pe, {
          types: w.value,
          profile: R.value,
          used: O(R.value),
          onClose: Z,
          onSave: te,
          onReset: ee
        }, null, 8, ["types", "profile", "used"]),
        R.value.name && R.value.agent_type === "helper" ? (s(), $(we, {
          key: 0,
          profile: R.value.name
        }, null, 8, ["profile"])) : x("", !0)
      ], 64)) : x("", !0)
    ]));
  }
}, Le = /* @__PURE__ */ z(Be, [["__scopeId", "data-v-58f28de8"]]);
export {
  Le as default
};
