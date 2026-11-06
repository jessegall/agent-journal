/* @code-commandments-generated */
if (!document.getElementById("window-styles-8f3bb2b5eb65")) { const style = document.createElement("style"); style.id = "window-styles-8f3bb2b5eb65"; style.textContent = ".helper-start[data-v-a4f6a3c4]{display:grid;gap:8px;margin-top:12px}.field[data-v-a4f6a3c4]{display:grid;gap:4px}.reason[data-v-a4f6a3c4],.notice[data-v-a4f6a3c4]{margin:0}.profile-panel[data-v-ff9967b6]{display:flex;flex-direction:column;gap:14px}.profile-panel-note[data-v-ff9967b6]{margin:0;color:var(--text-3);font-size:12.5px}.profile-panel-check[data-v-ff9967b6]{display:flex;gap:8px;align-items:center;font-size:13px}.profile-panel-grow[data-v-ff9967b6]{flex:1}.profiles[data-v-0b7ac22c]{padding:0 0 40px}.bar[data-v-0b7ac22c]{flex-wrap:wrap;gap:8px 12px;color:var(--text-2)}.count[data-v-0b7ac22c]{margin-left:auto;color:var(--text-3);font-size:12.5px}.notice[data-v-0b7ac22c]{font-size:12px;color:var(--text-2)}.notice.failed[data-v-0b7ac22c]{color:var(--danger)}.empty[data-v-0b7ac22c]{margin:40px auto;max-width:480px}.rows[data-v-0b7ac22c]{display:flex;flex-direction:column;padding:8px 14px 0 22px}.profile-open[data-v-0b7ac22c]{text-align:left}.profile-meta[data-v-0b7ac22c]{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:12px}.profile-model[data-v-0b7ac22c]{color:var(--text-2)}.profile-used[data-v-0b7ac22c]{color:var(--text-3);white-space:nowrap}.profile-warning[data-v-0b7ac22c]{color:var(--tone-warn)}.profile-used.never[data-v-0b7ac22c]{color:var(--text-4)}@media(max-width:640px){.profiles-find[data-v-0b7ac22c]{flex:1 1 100%}.profile-meta[data-v-0b7ac22c]{display:none}}\n"; document.head.appendChild(style); }
import { ref as T, computed as x, onMounted as le, openBlock as n, createElementBlock as c, withModifiers as ae, createElementVNode as y, withDirectives as q, vModelText as oe, Fragment as F, renderList as z, toDisplayString as h, vModelSelect as ne, createVNode as i, unref as t, withCtx as u, createTextVNode as $, createCommentVNode as b, watch as H, createBlock as S, vModelCheckbox as se, normalizeClass as re } from "vue";
import { useWindow as ie, Btn as B, SidePanel as ue, FormField as _, TextInput as A, TextArea as Y, Segmented as U, ModelPicker as J, DiffCard as de, useRows as pe, matchesSearch as fe, SearchBar as ve, EmptyState as D, ListRow as me, ago as ce } from "@journal/window-kit";
const G = (f, M) => {
  const v = f.__vccOpts || f;
  for (const [m, k] of M)
    v[m] = k;
  return v;
}, ye = { class: "field" }, ge = { class: "field" }, he = ["value"], be = {
  key: 0,
  class: "reason",
  "data-helper-start-reason": ""
}, ke = {
  key: 1,
  class: "notice"
}, xe = {
  __name: "HelperStartForm",
  props: { profile: { type: String, required: !0 } },
  setup(f) {
    const M = f, v = ie(), m = T({ reason: "", programs: [] }), k = T(""), P = T(""), I = T(""), a = x(() => !!m.value.reason || !k.value.trim());
    async function j() {
      const w = await v.read("helper availability");
      w.ok && (m.value = w.value);
    }
    async function E() {
      const w = ["helper", "start", M.profile, "--brief", k.value, ...P.value ? ["--program", P.value] : []], s = await v.run(w);
      I.value = s.ok ? "The helper is starting." : s.error, s.ok && (k.value = ""), await j();
    }
    return le(j), (w, s) => (n(), c("form", {
      class: "helper-start",
      "data-helper-start": "",
      onSubmit: ae(E, ["prevent"])
    }, [
      y("label", ye, [
        s[2] || (s[2] = y("span", null, "The job", -1)),
        q(y("textarea", {
          "onUpdate:modelValue": s[0] || (s[0] = (g) => k.value = g),
          rows: "3",
          "data-helper-brief": ""
        }, null, 512), [
          [oe, k.value]
        ])
      ]),
      y("label", ge, [
        s[4] || (s[4] = y("span", null, "Program", -1)),
        q(y("select", {
          "onUpdate:modelValue": s[1] || (s[1] = (g) => P.value = g),
          "data-helper-program": ""
        }, [
          s[3] || (s[3] = y("option", { value: "" }, "The profile's program", -1)),
          (n(!0), c(F, null, z(m.value.programs, (g) => (n(), c("option", {
            key: g,
            value: g
          }, h(g), 9, he))), 128))
        ], 512), [
          [ne, P.value]
        ])
      ]),
      i(t(B), {
        type: "submit",
        disabled: a.value,
        "data-helper-start-button": ""
      }, {
        default: u(() => [...s[5] || (s[5] = [
          $("Start a helper", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      m.value.reason ? (n(), c("p", be, h(m.value.reason), 1)) : b("", !0),
      I.value ? (n(), c("p", ke, h(I.value), 1)) : b("", !0)
    ], 32));
  }
}, we = /* @__PURE__ */ G(xe, [["__scopeId", "data-v-a4f6a3c4"]]), Ce = {
  class: "profile-panel",
  "data-profile-panel": ""
}, _e = { key: 0 }, $e = {
  key: 0,
  "data-profile-type-locked": ""
}, Se = { class: "profile-panel-check" }, Te = {
  key: 3,
  class: "profile-panel-note"
}, K = "writing", Pe = {
  __name: "ProfilePanel",
  props: { profile: { type: Object, required: !0 }, used: { type: String, default: "" }, types: { type: Array, default: () => [] } },
  emits: ["close", "save", "reset"],
  setup(f, { emit: M }) {
    const v = f, m = M, k = [{ key: "", label: "The parent's program" }, { key: "claude", label: "Claude Code" }, { key: "codex", label: "Codex" }], P = x(() => v.types.map((d) => ({ key: d.key, label: d.label }))), I = ["title", "description", "agent_type", "access", "program", "independent", "mcp_tools", "model", "codex_model", "body"], a = T({});
    H(
      () => v.profile.name,
      () => {
        a.value = { name: v.profile.name, ...Object.fromEntries(I.map((d) => [d, v.profile[d]])), mcp_tools: v.profile.mcp_tools.join(",") };
      },
      { immediate: !0 }
    );
    const j = x(() => v.types.find((d) => d.key === a.value.agent_type)), E = x(() => {
      var d;
      return ((d = j.value) == null ? void 0 : d.access) === K;
    }), w = x(() => [{ key: "read-only", label: "Read-only" }, ...E.value ? [{ key: K, label: "Writing" }] : []]);
    H(E, (d) => {
      d || (a.value.access = "read-only");
    });
    const s = T(!1), g = (d, e, l) => e.map((W, O) => ({ line_type: d, line: O + 1, text: W })).filter((W) => !l.includes(W.text)), C = x(() => {
      const d = v.profile.body.split(`
`), e = (v.profile.module_body || "").split(`
`);
      return [...g("del", d, e), ...g("add", e, d)];
    }), N = x(() => ({ ...v.profile, mcp_tools: v.profile.mcp_tools.join(",") })), L = x(() => I.some((d) => a.value[d] !== N.value[d]) || !v.profile.name), R = x(() => L.value && /^[a-z0-9_-]+$/i.test(a.value.name || "") && a.value.description.trim());
    return (d, e) => (n(), S(t(ue), {
      title: f.profile.title || f.profile.name || "New profile",
      abstract: f.profile.name ? f.used : "Instructions, type and model for an agent",
      onClose: e[15] || (e[15] = (l) => m("close"))
    }, {
      foot: u(() => [
        f.profile.changed.length || f.profile.problem ? (n(), S(t(B), {
          key: 0,
          variant: "ghost",
          small: "",
          "data-profile-reset": "",
          onClick: e[12] || (e[12] = (l) => m("reset", f.profile))
        }, {
          default: u(() => [...e[19] || (e[19] = [
            $("Use the journal's version", -1)
          ])]),
          _: 1
        })) : b("", !0),
        e[22] || (e[22] = y("span", { class: "profile-panel-grow" }, null, -1)),
        i(t(B), {
          variant: "ghost",
          small: "",
          "data-profile-cancel": "",
          onClick: e[13] || (e[13] = (l) => m("close"))
        }, {
          default: u(() => [...e[20] || (e[20] = [
            $("Cancel", -1)
          ])]),
          _: 1
        }),
        i(t(B), {
          variant: "primary",
          small: "",
          disabled: !R.value,
          "data-profile-save": "",
          onClick: e[14] || (e[14] = (l) => m("save", f.profile, a.value))
        }, {
          default: u(() => [...e[21] || (e[21] = [
            $("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: u(() => [
        y("div", Ce, [
          f.profile.title ? (n(), c("small", _e, h(f.profile.name), 1)) : b("", !0),
          f.profile.name ? b("", !0) : (n(), S(t(_), {
            key: 1,
            label: "Name",
            for: "profile-name",
            help: "Letters, digits and dashes; the agent starts it by this name."
          }, {
            default: u(() => [
              i(t(A), {
                id: "profile-name",
                value: a.value.name,
                placeholder: "critic",
                onInput: e[0] || (e[0] = (l) => a.value.name = l.target.value.trim())
              }, null, 8, ["value"])
            ]),
            _: 1
          })),
          i(t(_), {
            label: "Title",
            for: "profile-title"
          }, {
            default: u(() => [
              i(t(A), {
                id: "profile-title",
                value: a.value.title,
                onInput: e[1] || (e[1] = (l) => a.value.title = l.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(t(_), {
            label: "When it is used",
            for: "profile-description",
            help: "The agent reads this to decide when to start it."
          }, {
            default: u(() => [
              i(t(Y), {
                id: "profile-description",
                rows: "3",
                value: a.value.description,
                onInput: e[2] || (e[2] = (l) => a.value.description = l.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(t(_), {
            label: "Type",
            for: "profile-type",
            help: "The type of agent that runs this profile."
          }, {
            default: u(() => {
              var l;
              return [
                f.profile.shipped ? (n(), c("span", $e, h((l = j.value) == null ? void 0 : l.label), 1)) : (n(), S(t(U), {
                  key: 1,
                  "data-profile-type": "",
                  options: P.value,
                  value: a.value.agent_type,
                  onPick: e[3] || (e[3] = (W) => a.value.agent_type = W)
                }, null, 8, ["options", "value"]))
              ];
            }),
            _: 1
          }),
          i(t(_), {
            label: "Access",
            for: "profile-access",
            help: "Whether it may change files."
          }, {
            default: u(() => [
              i(t(U), {
                "data-profile-access": "",
                options: w.value,
                value: a.value.access,
                onPick: e[4] || (e[4] = (l) => a.value.access = l)
              }, null, 8, ["options", "value"])
            ]),
            _: 1
          }),
          i(t(_), {
            label: "Program",
            for: "profile-program",
            help: "Claude Code or Codex, or the same program as the agent that starts it."
          }, {
            default: u(() => [
              i(t(U), {
                options: k,
                value: a.value.program,
                onPick: e[5] || (e[5] = (l) => a.value.program = l)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(t(_), {
            label: "Model on Claude Code",
            for: "profile-model",
            help: "The least expensive model that reliably fits the work."
          }, {
            default: u(() => [
              i(t(J), {
                provider: "claude",
                inherits: "",
                value: a.value.model,
                "data-profile-model": "claude",
                onPick: e[6] || (e[6] = (l) => a.value.model = l)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(t(_), {
            label: "Model on Codex",
            for: "profile-codex-model",
            help: "The model it runs on when the agent is Codex."
          }, {
            default: u(() => [
              i(t(J), {
                provider: "codex",
                inherits: "",
                value: a.value.codex_model,
                "data-profile-model": "codex",
                onPick: e[7] || (e[7] = (l) => a.value.codex_model = l)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(t(_), {
            label: "Instructions",
            for: "profile-body",
            help: "What it is told each time it starts, after the brief."
          }, {
            default: u(() => [
              i(t(Y), {
                id: "profile-body",
                rows: "16",
                value: a.value.body,
                onInput: e[8] || (e[8] = (l) => a.value.body = l.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(t(_), {
            label: "MCP tools this profile may call",
            for: "profile-mcp",
            help: "Separate the names with commas."
          }, {
            default: u(() => [
              i(t(A), {
                id: "profile-mcp",
                value: a.value.mcp_tools,
                onInput: e[9] || (e[9] = (l) => a.value.mcp_tools = l.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          y("label", Se, [
            q(y("input", {
              "onUpdate:modelValue": e[10] || (e[10] = (l) => a.value.independent = l),
              type: "checkbox",
              "data-profile-independent": ""
            }, null, 512), [
              [se, a.value.independent]
            ]),
            e[16] || (e[16] = $(" Must judge fresh", -1))
          ]),
          f.profile.module_text_changed ? (n(), c(F, { key: 2 }, [
            e[18] || (e[18] = y("p", { class: "profile-panel-note" }, "Text changed: the journal's instructions have a new version.", -1)),
            i(t(B), {
              variant: "ghost",
              small: "",
              "data-profile-compare": "",
              onClick: e[11] || (e[11] = (l) => s.value = !s.value)
            }, {
              default: u(() => [...e[17] || (e[17] = [
                $("Compare", -1)
              ])]),
              _: 1
            }),
            s.value ? (n(), S(t(de), {
              key: 0,
              path: "Instructions",
              change: "edit",
              added: C.value.filter((l) => l.line_type === "add").length,
              removed: C.value.filter((l) => l.line_type === "del").length,
              at: "",
              rows: C.value,
              "data-profile-diff": ""
            }, null, 8, ["added", "removed", "rows"])) : b("", !0)
          ], 64)) : b("", !0),
          f.profile.shipped ? (n(), c("p", Te, "This comes with the journal. Your changes are kept through updates.")) : b("", !0)
        ])
      ]),
      _: 1
    }, 8, ["title", "abstract"]));
  }
}, Ie = /* @__PURE__ */ G(Pe, [["__scopeId", "data-v-ff9967b6"]]), je = {
  class: "profiles",
  "data-profiles": ""
}, Re = {
  class: "count",
  "data-profile-count": ""
}, Me = {
  key: 0,
  class: "notice",
  "data-profile-notice": ""
}, Ne = {
  key: 1,
  class: "notice failed",
  role: "alert",
  "data-profile-failure": ""
}, We = {
  key: 3,
  class: "rows"
}, Ve = { class: "profile-meta" }, Be = {
  key: 0,
  class: "profile-model"
}, Ee = { class: "profile-model" }, Fe = {
  __name: "ProfileRows",
  setup(f) {
    const M = { name: "", title: "", description: "", agent_type: "helper", access: "read-only", program: "", independent: !1, mcp_tools: [], changed: [], notes: [], problem: "", model: "sonnet", codex_model: "gpt-6.1-sol", body: "", shipped: !1, uses: 0 }, v = { "read-only": "Read-only", writing: "Writing" }, { rows: m, listing: k, failure: P, loaded: I, act: a, actionFailure: j, context: E } = pe("profile list", []), w = x(() => k.value ? k.value.types : []), s = T(""), g = T(""), C = T(""), N = T(!1), L = x(() => {
      const o = g.value.toLowerCase().split(/\s+/).filter(Boolean);
      return m.value.filter((r) => o.every((p) => {
        var V;
        return fe(r, p, (V = E.search) == null ? void 0 : V.fields);
      }));
    }), R = x(() => N.value ? M : m.value.find((o) => o.name === s.value) || null), d = (o) => {
      var r;
      return ((r = w.value.find((p) => p.key === o.agent_type)) == null ? void 0 : r.label) || o.agent_type;
    }, e = (o) => o.shipped ? "Comes with the journal" : o.module, l = (o) => [`Type: ${d(o)}`, `Access: ${v[o.access]}`, `${o.model || "chosen at start"} on Claude`, `${o.codex_model || "chosen at start"} on Codex`, o.changed.length ? "Changed" : "", e(o)].filter(Boolean).join(" · "), W = (o) => [o.problem, o.module_text_changed ? "Text changed: the journal's instructions have a new version" : "", ...o.notes].filter(Boolean), O = (o) => o.uses ? `Uses: ${o.uses} ${o.uses === 1 ? "time" : "times"}, last ${ce(new Date(o.last_used * 1e3).toISOString())}` : "Uses: none";
    function Q() {
      N.value = !0, s.value = "";
    }
    function X(o) {
      N.value = !1, s.value = o.name;
    }
    function Z() {
      N.value = !1, s.value = "";
    }
    async function ee(o) {
      C.value = "", (await a(["profile", "reset", o.name])).ok && (C.value = `${o.name} is back to the journal's version.`);
    }
    async function te(o, r) {
      C.value = "";
      const p = o.name || r.name;
      (await a(["profile", "save", p, "--title", r.title, "--description", r.description, "--type", r.agent_type, "--access", r.access, "--program", r.program, "--model", r.model, "--codex-model", r.codex_model, "--mcp-tools", r.mcp_tools, r.independent ? "--independent" : "--no-independent", "--body", r.body])).ok && (N.value = !1, s.value = p, C.value = `${p} saved. The agent will use it the next time it starts a helper with this profile.`);
    }
    return (o, r) => (n(), c("section", je, [
      i(t(ve), {
        modelValue: g.value,
        "onUpdate:modelValue": r[0] || (r[0] = (p) => g.value = p),
        class: "bar",
        "data-profile-find": ""
      }, {
        default: u(() => [
          i(t(B), {
            variant: "ghost",
            small: "",
            "data-profile-new": "",
            onClick: Q
          }, {
            default: u(() => [...r[1] || (r[1] = [
              $("New profile", -1)
            ])]),
            _: 1
          }),
          y("span", Re, h(t(m).length) + " " + h(t(m).length === 1 ? "profile" : "profiles"), 1),
          C.value ? (n(), c("span", Me, h(C.value), 1)) : b("", !0),
          t(j) ? (n(), c("span", Ne, h(t(j)), 1)) : b("", !0)
        ]),
        _: 1
      }, 8, ["modelValue"]),
      t(P) ? (n(), S(t(D), {
        key: 0,
        class: "empty",
        title: "The profiles could not be read"
      }, {
        default: u(() => [
          $(h(t(P)), 1)
        ]),
        _: 1
      })) : !t(I) || !t(m).length ? (n(), S(t(D), {
        key: 1,
        class: "empty",
        loading: !t(I),
        title: "No profiles yet"
      }, {
        default: u(() => [...r[2] || (r[2] = [
          $(" A profile gives an agent its instructions, type and model. The journal includes standard profiles. ", -1)
        ])]),
        _: 1
      }, 8, ["loading"])) : L.value.length ? (n(), c("div", We, [
        (n(!0), c(F, null, z(L.value, (p) => (n(), S(t(B), {
          key: p.name,
          variant: "text",
          fill: "",
          class: "profile-open",
          "aria-label": `Open ${p.name}`,
          "data-profile": p.name,
          onClick: (V) => X(p)
        }, {
          default: u(() => [
            i(t(me), {
              title: p.title || p.name,
              text: p.description
            }, {
              end: u(() => [
                y("span", Ve, [
                  p.title ? (n(), c("span", Be, h(p.name), 1)) : b("", !0),
                  y("span", Ee, h(l(p)), 1),
                  (n(!0), c(F, null, z(W(p), (V) => (n(), c("span", {
                    key: V,
                    class: "profile-warning",
                    "data-profile-warning": ""
                  }, h(V), 1))), 128)),
                  y("span", {
                    class: re(["profile-used", { never: !p.uses }])
                  }, h(O(p)), 3)
                ])
              ]),
              _: 2
            }, 1032, ["title", "text"])
          ]),
          _: 2
        }, 1032, ["aria-label", "data-profile", "onClick"]))), 128))
      ])) : (n(), S(t(D), {
        key: 2,
        class: "empty",
        title: "No profile matches"
      }, {
        default: u(() => [...r[3] || (r[3] = [
          $("Try other words.", -1)
        ])]),
        _: 1
      })),
      R.value ? (n(), c(F, { key: 4 }, [
        i(Ie, {
          types: w.value,
          profile: R.value,
          used: O(R.value),
          onClose: Z,
          onSave: te,
          onReset: ee
        }, null, 8, ["types", "profile", "used"]),
        R.value.name && R.value.agent_type === "helper" ? (n(), S(we, {
          key: 0,
          profile: R.value.name
        }, null, 8, ["profile"])) : b("", !0)
      ], 64)) : b("", !0)
    ]));
  }
}, Ae = /* @__PURE__ */ G(Fe, [["__scopeId", "data-v-0b7ac22c"]]);
export {
  Ae as default
};
