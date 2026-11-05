/* @code-commandments-generated */
if (!document.getElementById("window-styles-4f8e84e0c3e9")) { const style = document.createElement("style"); style.id = "window-styles-4f8e84e0c3e9"; style.textContent = ".profile-panel[data-v-27cd4ee6]{display:flex;flex-direction:column;gap:14px}.profile-panel-note[data-v-27cd4ee6]{margin:0;color:var(--text-3);font-size:12.5px}.profile-panel-check[data-v-27cd4ee6]{display:flex;gap:8px;align-items:center;font-size:13px}.profile-panel-grow[data-v-27cd4ee6]{flex:1}.profiles[data-v-e3c0ea95]{padding:0 0 40px}.bar[data-v-e3c0ea95]{flex-wrap:wrap;gap:8px 12px;color:var(--text-2)}.count[data-v-e3c0ea95]{margin-left:auto;color:var(--text-3);font-size:12.5px}.notice[data-v-e3c0ea95]{font-size:12px;color:var(--text-2)}.notice.failed[data-v-e3c0ea95]{color:var(--danger)}.empty[data-v-e3c0ea95]{margin:40px auto;max-width:480px}.rows[data-v-e3c0ea95]{display:flex;flex-direction:column;padding:8px 14px 0 22px}.profile-open[data-v-e3c0ea95]{text-align:left}.profile-meta[data-v-e3c0ea95]{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:12px}.profile-model[data-v-e3c0ea95]{color:var(--text-2)}.profile-used[data-v-e3c0ea95]{color:var(--text-3);white-space:nowrap}.profile-warning[data-v-e3c0ea95]{color:var(--tone-warn)}.profile-used.never[data-v-e3c0ea95]{color:var(--text-4)}@media(max-width:640px){.profiles-find[data-v-e3c0ea95]{flex:1 1 100%}.profile-meta[data-v-e3c0ea95]{display:none}}\n"; document.head.appendChild(style); }
import { computed as m, ref as I, watch as U, openBlock as u, createBlock as g, unref as t, withCtx as r, createElementVNode as x, createVNode as i, createCommentVNode as w, createElementBlock as y, toDisplayString as b, withDirectives as te, vModelCheckbox as le, createTextVNode as C, Fragment as F, renderList as q, normalizeClass as ae } from "vue";
import { SidePanel as oe, FormField as k, TextInput as z, TextArea as G, Segmented as M, ModelPicker as Y, Btn as j, DiffCard as ne, useRows as se, matchesSearch as ie, SearchBar as re, EmptyState as D, ListRow as de, ago as ue } from "@journal/window-kit";
const J = (p, R) => {
  const f = p.__vccOpts || p;
  for (const [c, S] of R)
    f[c] = S;
  return f;
}, pe = {
  class: "profile-panel",
  "data-profile-panel": ""
}, fe = {
  key: 0,
  "data-profile-type-locked": ""
}, ce = { class: "profile-panel-check" }, me = {
  key: 2,
  class: "profile-panel-note"
}, H = "writing", ve = {
  __name: "ProfilePanel",
  props: { profile: { type: Object, required: !0 }, used: { type: String, default: "" }, types: { type: Array, default: () => [] } },
  emits: ["close", "save", "reset"],
  setup(p, { emit: R }) {
    const f = p, c = R, S = [{ key: "", label: "The parent's program" }, { key: "claude", label: "Claude Code" }, { key: "codex", label: "Codex" }], E = m(() => f.types.map((s) => ({ key: s.key, label: s.label }))), N = ["description", "agent_type", "access", "program", "independent", "mcp_tools", "model", "codex_model", "body"], o = I({});
    U(
      () => f.profile.name,
      () => {
        o.value = { name: f.profile.name, ...Object.fromEntries(N.map((s) => [s, f.profile[s]])), mcp_tools: f.profile.mcp_tools.join(",") };
      },
      { immediate: !0 }
    );
    const W = m(() => f.types.find((s) => s.key === o.value.agent_type)), L = m(() => {
      var s;
      return ((s = W.value) == null ? void 0 : s.access) === H;
    }), O = m(() => [{ key: "read-only", label: "Read-only" }, ...L.value ? [{ key: H, label: "Writing" }] : []]);
    U(L, (s) => {
      s || (o.value.access = "read-only");
    });
    const h = I(!1), P = (s, e, l) => e.map(($, A) => ({ line_type: s, line: A + 1, text: $ })).filter(($) => !l.includes($.text)), v = m(() => {
      const s = f.profile.body.split(`
`), e = (f.profile.module_body || "").split(`
`);
      return [...P("del", s, e), ...P("add", e, s)];
    }), _ = m(() => ({ ...f.profile, mcp_tools: f.profile.mcp_tools.join(",") })), V = m(() => N.some((s) => o.value[s] !== _.value[s]) || !f.profile.name), B = m(() => V.value && /^[a-z0-9_-]+$/i.test(o.value.name || "") && o.value.description.trim());
    return (s, e) => (u(), g(t(oe), {
      title: p.profile.name || "New profile",
      abstract: p.profile.name ? p.used : "Instructions, type and model for an agent",
      onClose: e[14] || (e[14] = (l) => c("close"))
    }, {
      foot: r(() => [
        p.profile.changed.length || p.profile.problem ? (u(), g(t(j), {
          key: 0,
          kind: "ghost",
          small: "",
          "data-profile-reset": "",
          onClick: e[11] || (e[11] = (l) => c("reset", p.profile))
        }, {
          default: r(() => [...e[18] || (e[18] = [
            C("Use the journal's version", -1)
          ])]),
          _: 1
        })) : w("", !0),
        e[21] || (e[21] = x("span", { class: "profile-panel-grow" }, null, -1)),
        i(t(j), {
          kind: "ghost",
          small: "",
          "data-profile-cancel": "",
          onClick: e[12] || (e[12] = (l) => c("close"))
        }, {
          default: r(() => [...e[19] || (e[19] = [
            C("Cancel", -1)
          ])]),
          _: 1
        }),
        i(t(j), {
          kind: "primary",
          small: "",
          disabled: !B.value,
          "data-profile-save": "",
          onClick: e[13] || (e[13] = (l) => c("save", p.profile, o.value))
        }, {
          default: r(() => [...e[20] || (e[20] = [
            C("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: r(() => [
        x("div", pe, [
          p.profile.name ? w("", !0) : (u(), g(t(k), {
            key: 0,
            label: "Name",
            for: "profile-name",
            help: "Letters, digits and dashes; the agent starts it by this name."
          }, {
            default: r(() => [
              i(t(z), {
                id: "profile-name",
                value: o.value.name,
                placeholder: "critic",
                onInput: e[0] || (e[0] = (l) => o.value.name = l.target.value.trim())
              }, null, 8, ["value"])
            ]),
            _: 1
          })),
          i(t(k), {
            label: "When it is used",
            for: "profile-description",
            help: "The agent reads this to decide when to start it."
          }, {
            default: r(() => [
              i(t(G), {
                id: "profile-description",
                rows: "3",
                value: o.value.description,
                onInput: e[1] || (e[1] = (l) => o.value.description = l.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(t(k), {
            label: "Type",
            for: "profile-kind",
            help: "The kind of agent that runs this profile."
          }, {
            default: r(() => {
              var l;
              return [
                p.profile.shipped ? (u(), y("span", fe, b((l = W.value) == null ? void 0 : l.label), 1)) : (u(), g(t(M), {
                  key: 1,
                  "data-profile-type": "",
                  options: E.value,
                  value: o.value.agent_type,
                  onPick: e[2] || (e[2] = ($) => o.value.agent_type = $)
                }, null, 8, ["options", "value"]))
              ];
            }),
            _: 1
          }),
          i(t(k), {
            label: "Access",
            for: "profile-access",
            help: "Whether it may change files."
          }, {
            default: r(() => [
              i(t(M), {
                "data-profile-access": "",
                options: O.value,
                value: o.value.access,
                onPick: e[3] || (e[3] = (l) => o.value.access = l)
              }, null, 8, ["options", "value"])
            ]),
            _: 1
          }),
          i(t(k), {
            label: "Program",
            for: "profile-program",
            help: "Claude Code or Codex, or the same program as the agent that starts it."
          }, {
            default: r(() => [
              i(t(M), {
                options: S,
                value: o.value.program,
                onPick: e[4] || (e[4] = (l) => o.value.program = l)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(t(k), {
            label: "Model on Claude Code",
            for: "profile-model",
            help: "The least expensive model that reliably fits the work."
          }, {
            default: r(() => [
              i(t(Y), {
                provider: "claude",
                inherits: "",
                value: o.value.model,
                "data-profile-model": "claude",
                onPick: e[5] || (e[5] = (l) => o.value.model = l)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(t(k), {
            label: "Model on Codex",
            for: "profile-codex-model",
            help: "The model it runs on when the agent is Codex."
          }, {
            default: r(() => [
              i(t(Y), {
                provider: "codex",
                inherits: "",
                value: o.value.codex_model,
                "data-profile-model": "codex",
                onPick: e[6] || (e[6] = (l) => o.value.codex_model = l)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(t(k), {
            label: "Instructions",
            for: "profile-body",
            help: "What it is told each time it starts, after the brief."
          }, {
            default: r(() => [
              i(t(G), {
                id: "profile-body",
                rows: "16",
                value: o.value.body,
                onInput: e[7] || (e[7] = (l) => o.value.body = l.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(t(k), {
            label: "MCP tools this profile may call",
            for: "profile-mcp",
            help: "Separate the names with commas."
          }, {
            default: r(() => [
              i(t(z), {
                id: "profile-mcp",
                value: o.value.mcp_tools,
                onInput: e[8] || (e[8] = (l) => o.value.mcp_tools = l.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          x("label", ce, [
            te(x("input", {
              "onUpdate:modelValue": e[9] || (e[9] = (l) => o.value.independent = l),
              type: "checkbox",
              "data-profile-independent": ""
            }, null, 512), [
              [le, o.value.independent]
            ]),
            e[15] || (e[15] = C(" Must judge fresh", -1))
          ]),
          p.profile.module_text_changed ? (u(), y(F, { key: 1 }, [
            e[17] || (e[17] = x("p", { class: "profile-panel-note" }, "Text changed: the journal's instructions have a new version.", -1)),
            i(t(j), {
              kind: "ghost",
              small: "",
              "data-profile-compare": "",
              onClick: e[10] || (e[10] = (l) => h.value = !h.value)
            }, {
              default: r(() => [...e[16] || (e[16] = [
                C("Compare", -1)
              ])]),
              _: 1
            }),
            h.value ? (u(), g(t(ne), {
              key: 0,
              path: "Instructions",
              kind: "edit",
              added: v.value.filter((l) => l.line_type === "add").length,
              removed: v.value.filter((l) => l.line_type === "del").length,
              at: "",
              rows: v.value,
              "data-profile-diff": ""
            }, null, 8, ["added", "removed", "rows"])) : w("", !0)
          ], 64)) : w("", !0),
          p.profile.shipped ? (u(), y("p", me, "This comes with the journal. Your changes are kept through updates.")) : w("", !0)
        ])
      ]),
      _: 1
    }, 8, ["title", "abstract"]));
  }
}, ye = /* @__PURE__ */ J(ve, [["__scopeId", "data-v-27cd4ee6"]]), ge = {
  class: "profiles",
  "data-profiles": ""
}, he = {
  class: "count",
  "data-profile-count": ""
}, ke = {
  key: 0,
  class: "notice",
  "data-profile-notice": ""
}, be = {
  key: 1,
  class: "notice failed",
  role: "alert",
  "data-profile-failure": ""
}, xe = {
  key: 3,
  class: "rows"
}, Ce = { class: "profile-meta" }, we = { class: "profile-model" }, _e = {
  __name: "ProfileRows",
  setup(p) {
    const R = { name: "", description: "", agent_type: "helper", access: "read-only", program: "", independent: !1, mcp_tools: [], changed: [], notes: [], problem: "", model: "sonnet", codex_model: "gpt-6.1-sol", body: "", shipped: !1, uses: 0 }, f = { "read-only": "Read-only", writing: "Writing" }, { rows: c, listing: S, failure: E, loaded: N, act: o, actionFailure: W, context: L } = se("profile list", []), O = m(() => S.value ? S.value.types : []), h = I(""), P = I(""), v = I(""), _ = I(!1), V = m(() => {
      const a = P.value.toLowerCase().split(/\s+/).filter(Boolean);
      return c.value.filter((n) => a.every((d) => {
        var T;
        return ie(n, d, (T = L.search) == null ? void 0 : T.fields);
      }));
    }), B = m(() => _.value ? R : c.value.find((a) => a.name === h.value) || null), s = (a) => {
      var n;
      return ((n = O.value.find((d) => d.key === a.agent_type)) == null ? void 0 : n.label) || a.agent_type;
    }, e = (a) => a.shipped ? "Comes with the journal" : a.module, l = (a) => [`Type: ${s(a)}`, `Access: ${f[a.access]}`, `${a.model || "chosen at start"} on Claude`, `${a.codex_model || "chosen at start"} on Codex`, a.changed.length ? "Changed" : "", e(a)].filter(Boolean).join(" · "), $ = (a) => [a.problem, a.module_text_changed ? "Text changed: the journal's instructions have a new version" : "", ...a.notes].filter(Boolean), A = (a) => a.uses ? `Uses: ${a.uses} ${a.uses === 1 ? "time" : "times"}, last ${ue(new Date(a.last_used * 1e3).toISOString())}` : "Uses: none";
    function K() {
      _.value = !0, h.value = "";
    }
    function Q(a) {
      _.value = !1, h.value = a.name;
    }
    function X() {
      _.value = !1, h.value = "";
    }
    async function Z(a) {
      v.value = "", (await o(["profile", "reset", a.name])).ok && (v.value = `${a.name} is back to the journal's version.`);
    }
    async function ee(a, n) {
      v.value = "";
      const d = a.name || n.name;
      (await o(["profile", "save", d, "--description", n.description, "--type", n.agent_type, "--access", n.access, "--program", n.program, "--model", n.model, "--codex-model", n.codex_model, "--mcp-tools", n.mcp_tools, n.independent ? "--independent" : "--no-independent", "--body", n.body])).ok && (_.value = !1, h.value = d, v.value = `${d} saved. The agent will use it the next time it starts a helper with this profile.`);
    }
    return (a, n) => (u(), y("section", ge, [
      i(t(re), {
        modelValue: P.value,
        "onUpdate:modelValue": n[0] || (n[0] = (d) => P.value = d),
        class: "bar",
        "data-profile-find": ""
      }, {
        default: r(() => [
          i(t(j), {
            kind: "ghost",
            small: "",
            "data-profile-new": "",
            onClick: K
          }, {
            default: r(() => [...n[1] || (n[1] = [
              C("New profile", -1)
            ])]),
            _: 1
          }),
          x("span", he, b(t(c).length) + " " + b(t(c).length === 1 ? "profile" : "profiles"), 1),
          v.value ? (u(), y("span", ke, b(v.value), 1)) : w("", !0),
          t(W) ? (u(), y("span", be, b(t(W)), 1)) : w("", !0)
        ]),
        _: 1
      }, 8, ["modelValue"]),
      t(E) ? (u(), g(t(D), {
        key: 0,
        class: "empty",
        title: "The profiles could not be read"
      }, {
        default: r(() => [
          C(b(t(E)), 1)
        ]),
        _: 1
      })) : !t(N) || !t(c).length ? (u(), g(t(D), {
        key: 1,
        class: "empty",
        loading: !t(N),
        title: "No profiles yet"
      }, {
        default: r(() => [...n[2] || (n[2] = [
          C(" A profile gives an agent its instructions, type and model. The journal includes standard profiles. ", -1)
        ])]),
        _: 1
      }, 8, ["loading"])) : V.value.length ? (u(), y("div", xe, [
        (u(!0), y(F, null, q(V.value, (d) => (u(), g(t(j), {
          key: d.name,
          kind: "text",
          fill: "",
          class: "profile-open",
          "aria-label": `Open ${d.name}`,
          "data-profile": d.name,
          onClick: (T) => Q(d)
        }, {
          default: r(() => [
            i(t(de), {
              title: d.name,
              text: d.description
            }, {
              end: r(() => [
                x("span", Ce, [
                  x("span", we, b(l(d)), 1),
                  (u(!0), y(F, null, q($(d), (T) => (u(), y("span", {
                    key: T,
                    class: "profile-warning",
                    "data-profile-warning": ""
                  }, b(T), 1))), 128)),
                  x("span", {
                    class: ae(["profile-used", { never: !d.uses }])
                  }, b(A(d)), 3)
                ])
              ]),
              _: 2
            }, 1032, ["title", "text"])
          ]),
          _: 2
        }, 1032, ["aria-label", "data-profile", "onClick"]))), 128))
      ])) : (u(), g(t(D), {
        key: 2,
        class: "empty",
        title: "No profile matches"
      }, {
        default: r(() => [...n[3] || (n[3] = [
          C("Try other words.", -1)
        ])]),
        _: 1
      })),
      B.value ? (u(), g(ye, {
        key: 4,
        types: O.value,
        profile: B.value,
        used: A(B.value),
        onClose: X,
        onSave: ee,
        onReset: Z
      }, null, 8, ["types", "profile", "used"])) : w("", !0)
    ]));
  }
}, Se = /* @__PURE__ */ J(_e, [["__scopeId", "data-v-e3c0ea95"]]);
export {
  Se as default
};
