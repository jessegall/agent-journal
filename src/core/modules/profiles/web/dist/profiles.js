/* @code-commandments-generated */
if (!document.getElementById("window-styles-46551e3ca749")) { const style = document.createElement("style"); style.id = "window-styles-46551e3ca749"; style.textContent = ".profile-panel[data-v-78397654]{display:flex;flex-direction:column;gap:14px}.profile-panel-note[data-v-78397654]{margin:0;color:var(--text-3);font-size:12.5px}.profile-panel-check[data-v-78397654]{display:flex;gap:8px;align-items:center;font-size:13px}.profile-panel-grow[data-v-78397654]{flex:1}.profiles[data-v-e3c0ea95]{padding:0 0 40px}.bar[data-v-e3c0ea95]{flex-wrap:wrap;gap:8px 12px;color:var(--text-2)}.count[data-v-e3c0ea95]{margin-left:auto;color:var(--text-3);font-size:12.5px}.notice[data-v-e3c0ea95]{font-size:12px;color:var(--text-2)}.notice.failed[data-v-e3c0ea95]{color:var(--danger)}.empty[data-v-e3c0ea95]{margin:40px auto;max-width:480px}.rows[data-v-e3c0ea95]{display:flex;flex-direction:column;padding:8px 14px 0 22px}.profile-open[data-v-e3c0ea95]{text-align:left}.profile-meta[data-v-e3c0ea95]{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:12px}.profile-model[data-v-e3c0ea95]{color:var(--text-2)}.profile-used[data-v-e3c0ea95]{color:var(--text-3);white-space:nowrap}.profile-warning[data-v-e3c0ea95]{color:var(--tone-warn)}.profile-used.never[data-v-e3c0ea95]{color:var(--text-4)}@media(max-width:640px){.profiles-find[data-v-e3c0ea95]{flex:1 1 100%}.profile-meta[data-v-e3c0ea95]{display:none}}\n"; document.head.appendChild(style); }
import { computed as m, ref as j, watch as A, openBlock as u, createBlock as h, unref as t, withCtx as r, createElementVNode as b, createVNode as i, createCommentVNode as $, createElementBlock as g, toDisplayString as y, withDirectives as te, vModelCheckbox as le, createTextVNode as x, Fragment as M, renderList as F, normalizeClass as ae } from "vue";
import { SidePanel as oe, FormField as v, TextInput as D, TextArea as U, Segmented as L, ModelPicker as q, Btn as R, useRows as ne, matchesSearch as se, SearchBar as ie, EmptyState as O, ListRow as re, ago as de } from "@journal/window-kit";
const G = (p, S) => {
  const c = p.__vccOpts || p;
  for (const [f, w] of S)
    c[f] = w;
  return c;
}, ue = {
  class: "profile-panel",
  "data-profile-panel": ""
}, pe = {
  key: 0,
  "data-profile-type-locked": ""
}, ce = { class: "profile-panel-check" }, fe = {
  key: 1,
  class: "profile-panel-note"
}, z = "writing", me = {
  __name: "ProfilePanel",
  props: { profile: { type: Object, required: !0 }, used: { type: String, default: "" }, types: { type: Array, default: () => [] } },
  emits: ["close", "save", "reset"],
  setup(p, { emit: S }) {
    const c = p, f = S, w = [{ key: "", label: "The parent's program" }, { key: "claude", label: "Claude Code" }, { key: "codex", label: "Codex" }], N = m(() => c.types.map((s) => ({ key: s.key, label: s.label }))), T = ["description", "agent_type", "access", "program", "independent", "mcp_tools", "model", "codex_model", "body"], a = j({});
    A(
      () => c.profile.name,
      () => {
        a.value = { name: c.profile.name, ...Object.fromEntries(T.map((s) => [s, c.profile[s]])), mcp_tools: c.profile.mcp_tools.join(",") };
      },
      { immediate: !0 }
    );
    const P = m(() => c.types.find((s) => s.key === a.value.agent_type)), W = m(() => {
      var s;
      return ((s = P.value) == null ? void 0 : s.access) === z;
    }), B = m(() => [{ key: "read-only", label: "Read-only" }, ...W.value ? [{ key: z, label: "Writing" }] : []]);
    A(W, (s) => {
      s || (a.value.access = "read-only");
    });
    const C = m(() => ({ ...c.profile, mcp_tools: c.profile.mcp_tools.join(",") })), I = m(() => T.some((s) => a.value[s] !== C.value[s]) || !c.profile.name), k = m(() => I.value && /^[a-z0-9_-]+$/i.test(a.value.name || "") && a.value.description.trim());
    return (s, e) => (u(), h(t(oe), {
      title: p.profile.name || "New profile",
      abstract: p.profile.name ? p.used : "Instructions, type and model for an agent",
      onClose: e[13] || (e[13] = (o) => f("close"))
    }, {
      foot: r(() => [
        p.profile.changed.length || p.profile.problem ? (u(), h(t(R), {
          key: 0,
          kind: "ghost",
          small: "",
          "data-profile-reset": "",
          onClick: e[10] || (e[10] = (o) => f("reset", p.profile))
        }, {
          default: r(() => [...e[15] || (e[15] = [
            x("Use the journal's version", -1)
          ])]),
          _: 1
        })) : $("", !0),
        e[18] || (e[18] = b("span", { class: "profile-panel-grow" }, null, -1)),
        i(t(R), {
          kind: "ghost",
          small: "",
          "data-profile-cancel": "",
          onClick: e[11] || (e[11] = (o) => f("close"))
        }, {
          default: r(() => [...e[16] || (e[16] = [
            x("Cancel", -1)
          ])]),
          _: 1
        }),
        i(t(R), {
          kind: "primary",
          small: "",
          disabled: !k.value,
          "data-profile-save": "",
          onClick: e[12] || (e[12] = (o) => f("save", p.profile, a.value))
        }, {
          default: r(() => [...e[17] || (e[17] = [
            x("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: r(() => [
        b("div", ue, [
          p.profile.name ? $("", !0) : (u(), h(t(v), {
            key: 0,
            label: "Name",
            for: "profile-name",
            help: "Letters, digits and dashes; the agent starts it by this name."
          }, {
            default: r(() => [
              i(t(D), {
                id: "profile-name",
                value: a.value.name,
                placeholder: "critic",
                onInput: e[0] || (e[0] = (o) => a.value.name = o.target.value.trim())
              }, null, 8, ["value"])
            ]),
            _: 1
          })),
          i(t(v), {
            label: "When it is used",
            for: "profile-description",
            help: "The agent reads this to decide when to start it."
          }, {
            default: r(() => [
              i(t(U), {
                id: "profile-description",
                rows: "3",
                value: a.value.description,
                onInput: e[1] || (e[1] = (o) => a.value.description = o.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(t(v), {
            label: "Type",
            for: "profile-kind",
            help: "The kind of agent that runs this profile."
          }, {
            default: r(() => {
              var o;
              return [
                p.profile.shipped ? (u(), g("span", pe, y((o = P.value) == null ? void 0 : o.label), 1)) : (u(), h(t(L), {
                  key: 1,
                  "data-profile-type": "",
                  options: N.value,
                  value: a.value.agent_type,
                  onPick: e[2] || (e[2] = (E) => a.value.agent_type = E)
                }, null, 8, ["options", "value"]))
              ];
            }),
            _: 1
          }),
          i(t(v), {
            label: "Access",
            for: "profile-access",
            help: "Whether it may change files."
          }, {
            default: r(() => [
              i(t(L), {
                "data-profile-access": "",
                options: B.value,
                value: a.value.access,
                onPick: e[3] || (e[3] = (o) => a.value.access = o)
              }, null, 8, ["options", "value"])
            ]),
            _: 1
          }),
          i(t(v), {
            label: "Program",
            for: "profile-program",
            help: "Claude Code or Codex, or the same program as the agent that starts it."
          }, {
            default: r(() => [
              i(t(L), {
                options: w,
                value: a.value.program,
                onPick: e[4] || (e[4] = (o) => a.value.program = o)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(t(v), {
            label: "Model on Claude Code",
            for: "profile-model",
            help: "The least expensive model that reliably fits the work."
          }, {
            default: r(() => [
              i(t(q), {
                provider: "claude",
                inherits: "",
                value: a.value.model,
                "data-profile-model": "claude",
                onPick: e[5] || (e[5] = (o) => a.value.model = o)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(t(v), {
            label: "Model on Codex",
            for: "profile-codex-model",
            help: "The model it runs on when the agent is Codex."
          }, {
            default: r(() => [
              i(t(q), {
                provider: "codex",
                inherits: "",
                value: a.value.codex_model,
                "data-profile-model": "codex",
                onPick: e[6] || (e[6] = (o) => a.value.codex_model = o)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(t(v), {
            label: "Instructions",
            for: "profile-body",
            help: "What it is told each time it starts, after the brief."
          }, {
            default: r(() => [
              i(t(U), {
                id: "profile-body",
                rows: "16",
                value: a.value.body,
                onInput: e[7] || (e[7] = (o) => a.value.body = o.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(t(v), {
            label: "MCP tools this profile may call",
            for: "profile-mcp",
            help: "Separate the names with commas."
          }, {
            default: r(() => [
              i(t(D), {
                id: "profile-mcp",
                value: a.value.mcp_tools,
                onInput: e[8] || (e[8] = (o) => a.value.mcp_tools = o.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          b("label", ce, [
            te(b("input", {
              "onUpdate:modelValue": e[9] || (e[9] = (o) => a.value.independent = o),
              type: "checkbox",
              "data-profile-independent": ""
            }, null, 512), [
              [le, a.value.independent]
            ]),
            e[14] || (e[14] = x(" Must judge fresh", -1))
          ]),
          p.profile.shipped ? (u(), g("p", fe, "This comes with the journal. Your changes are kept through updates.")) : $("", !0)
        ])
      ]),
      _: 1
    }, 8, ["title", "abstract"]));
  }
}, ve = /* @__PURE__ */ G(me, [["__scopeId", "data-v-78397654"]]), ye = {
  class: "profiles",
  "data-profiles": ""
}, ge = {
  class: "count",
  "data-profile-count": ""
}, he = {
  key: 0,
  class: "notice",
  "data-profile-notice": ""
}, ke = {
  key: 1,
  class: "notice failed",
  role: "alert",
  "data-profile-failure": ""
}, be = {
  key: 3,
  class: "rows"
}, xe = { class: "profile-meta" }, Ce = { class: "profile-model" }, _e = {
  __name: "ProfileRows",
  setup(p) {
    const S = { name: "", description: "", agent_type: "helper", access: "read-only", program: "", independent: !1, mcp_tools: [], changed: [], notes: [], problem: "", model: "sonnet", codex_model: "gpt-6.1-sol", body: "", shipped: !1, uses: 0 }, c = { "read-only": "Read-only", writing: "Writing" }, { rows: f, listing: w, failure: N, loaded: T, act: a, actionFailure: P, context: W } = ne("profile list", []), B = m(() => w.value ? w.value.types : []), C = j(""), I = j(""), k = j(""), s = j(!1), e = m(() => {
      const l = I.value.toLowerCase().split(/\s+/).filter(Boolean);
      return f.value.filter((n) => l.every((d) => {
        var _;
        return se(n, d, (_ = W.search) == null ? void 0 : _.fields);
      }));
    }), o = m(() => s.value ? S : f.value.find((l) => l.name === C.value) || null), E = (l) => {
      var n;
      return ((n = B.value.find((d) => d.key === l.agent_type)) == null ? void 0 : n.label) || l.agent_type;
    }, Y = (l) => l.shipped ? "Comes with the journal" : l.module, H = (l) => [`Type: ${E(l)}`, `Access: ${c[l.access]}`, `${l.model || "chosen at start"} on Claude`, `${l.codex_model || "chosen at start"} on Codex`, l.changed.length ? "Changed" : "", Y(l)].filter(Boolean).join(" · "), J = (l) => [l.problem, l.module_text_changed ? "Text changed: the journal's instructions have a new version" : "", ...l.notes].filter(Boolean), V = (l) => l.uses ? `Uses: ${l.uses} ${l.uses === 1 ? "time" : "times"}, last ${de(new Date(l.last_used * 1e3).toISOString())}` : "Uses: none";
    function K() {
      s.value = !0, C.value = "";
    }
    function Q(l) {
      s.value = !1, C.value = l.name;
    }
    function X() {
      s.value = !1, C.value = "";
    }
    async function Z(l) {
      k.value = "", (await a(["profile", "reset", l.name])).ok && (k.value = `${l.name} is back to the journal's version.`);
    }
    async function ee(l, n) {
      k.value = "";
      const d = l.name || n.name;
      (await a(["profile", "save", d, "--description", n.description, "--type", n.agent_type, "--access", n.access, "--program", n.program, "--model", n.model, "--codex-model", n.codex_model, "--mcp-tools", n.mcp_tools, n.independent ? "--independent" : "--no-independent", "--body", n.body])).ok && (s.value = !1, C.value = d, k.value = `${d} saved. The agent will use it the next time it starts a helper with this profile.`);
    }
    return (l, n) => (u(), g("section", ye, [
      i(t(ie), {
        modelValue: I.value,
        "onUpdate:modelValue": n[0] || (n[0] = (d) => I.value = d),
        class: "bar",
        "data-profile-find": ""
      }, {
        default: r(() => [
          i(t(R), {
            kind: "ghost",
            small: "",
            "data-profile-new": "",
            onClick: K
          }, {
            default: r(() => [...n[1] || (n[1] = [
              x("New profile", -1)
            ])]),
            _: 1
          }),
          b("span", ge, y(t(f).length) + " " + y(t(f).length === 1 ? "profile" : "profiles"), 1),
          k.value ? (u(), g("span", he, y(k.value), 1)) : $("", !0),
          t(P) ? (u(), g("span", ke, y(t(P)), 1)) : $("", !0)
        ]),
        _: 1
      }, 8, ["modelValue"]),
      t(N) ? (u(), h(t(O), {
        key: 0,
        class: "empty",
        title: "The profiles could not be read"
      }, {
        default: r(() => [
          x(y(t(N)), 1)
        ]),
        _: 1
      })) : !t(T) || !t(f).length ? (u(), h(t(O), {
        key: 1,
        class: "empty",
        loading: !t(T),
        title: "No profiles yet"
      }, {
        default: r(() => [...n[2] || (n[2] = [
          x(" A profile gives an agent its instructions, type and model. The journal includes standard profiles. ", -1)
        ])]),
        _: 1
      }, 8, ["loading"])) : e.value.length ? (u(), g("div", be, [
        (u(!0), g(M, null, F(e.value, (d) => (u(), h(t(R), {
          key: d.name,
          kind: "text",
          fill: "",
          class: "profile-open",
          "aria-label": `Open ${d.name}`,
          "data-profile": d.name,
          onClick: (_) => Q(d)
        }, {
          default: r(() => [
            i(t(re), {
              title: d.name,
              text: d.description
            }, {
              end: r(() => [
                b("span", xe, [
                  b("span", Ce, y(H(d)), 1),
                  (u(!0), g(M, null, F(J(d), (_) => (u(), g("span", {
                    key: _,
                    class: "profile-warning",
                    "data-profile-warning": ""
                  }, y(_), 1))), 128)),
                  b("span", {
                    class: ae(["profile-used", { never: !d.uses }])
                  }, y(V(d)), 3)
                ])
              ]),
              _: 2
            }, 1032, ["title", "text"])
          ]),
          _: 2
        }, 1032, ["aria-label", "data-profile", "onClick"]))), 128))
      ])) : (u(), h(t(O), {
        key: 2,
        class: "empty",
        title: "No profile matches"
      }, {
        default: r(() => [...n[3] || (n[3] = [
          x("Try other words.", -1)
        ])]),
        _: 1
      })),
      o.value ? (u(), h(ve, {
        key: 4,
        types: B.value,
        profile: o.value,
        used: V(o.value),
        onClose: X,
        onSave: ee,
        onReset: Z
      }, null, 8, ["types", "profile", "used"])) : $("", !0)
    ]));
  }
}, Se = /* @__PURE__ */ G(_e, [["__scopeId", "data-v-e3c0ea95"]]);
export {
  Se as default
};
