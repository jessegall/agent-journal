/* @code-commandments-generated */
if (!document.getElementById("window-styles-7c802721efca")) { const style = document.createElement("style"); style.id = "window-styles-7c802721efca"; style.textContent = ".profile-panel[data-v-83ce8b10]{display:flex;flex-direction:column;gap:14px}.profile-panel-note[data-v-83ce8b10]{margin:0;color:var(--text-3);font-size:12.5px}.profile-panel-grow[data-v-83ce8b10]{flex:1}.profiles[data-v-055b6826]{padding:0 0 40px}.bar[data-v-055b6826]{flex-wrap:wrap;gap:8px 12px;color:var(--text-2)}.count[data-v-055b6826]{margin-left:auto;color:var(--text-3);font-size:12.5px}.notice[data-v-055b6826]{font-size:12px;color:var(--text-2)}.notice.failed[data-v-055b6826]{color:var(--danger)}.empty[data-v-055b6826]{margin:40px auto;max-width:480px}.rows[data-v-055b6826]{display:flex;flex-direction:column;padding:8px 14px 0 22px}.profile-open[data-v-055b6826]{text-align:left}.profile-meta[data-v-055b6826]{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:12px}.profile-model[data-v-055b6826]{color:var(--text-2)}.profile-used[data-v-055b6826]{color:var(--text-3);white-space:nowrap}.profile-used.never[data-v-055b6826]{color:var(--text-4)}@media(max-width:640px){.profiles-find[data-v-055b6826]{flex:1 1 100%}.profile-meta[data-v-055b6826]{display:none}}\n"; document.head.appendChild(style); }
import { computed as x, ref as S, watch as j, openBlock as u, createBlock as y, unref as e, withCtx as i, createElementVNode as h, createVNode as n, createCommentVNode as $, createElementBlock as b, createTextVNode as k, toDisplayString as m, Fragment as q, renderList as z, normalizeClass as K } from "vue";
import { SidePanel as Y, FormField as c, TextInput as G, TextArea as L, Segmented as H, ModelPicker as O, Btn as N, useRows as J, matchesSearch as Q, SearchBar as X, EmptyState as V, ListRow as Z, ago as ee } from "@journal/window-kit";
const A = (f, _) => {
  const r = f.__vccOpts || f;
  for (const [v, g] of _)
    r[v] = g;
  return r;
}, te = {
  class: "profile-panel",
  "data-profile-panel": ""
}, le = {
  key: 1,
  class: "profile-panel-note"
}, oe = {
  __name: "ProfilePanel",
  props: { profile: { type: Object, required: !0 }, used: { type: String, default: "" }, types: { type: Array, default: () => [] } },
  emits: ["close", "save"],
  setup(f, { emit: _ }) {
    const r = f, v = _, g = x(() => r.types.map((p) => ({ key: p, label: p.slice(0, 1).toUpperCase() + p.slice(1) }))), w = ["description", "tools", "profile_type", "model", "codex_model", "body"], l = S({});
    j(
      () => r.profile.name,
      () => {
        l.value = { name: r.profile.name, ...Object.fromEntries(w.map((p) => [p, r.profile[p]])) };
      },
      { immediate: !0 }
    );
    const I = x(() => w.some((p) => l.value[p] !== r.profile[p]) || !r.profile.name), R = x(() => I.value && /^[a-z0-9_-]+$/i.test(l.value.name || "") && l.value.description.trim());
    return (p, t) => (u(), y(e(Y), {
      title: f.profile.name || "New profile",
      abstract: f.profile.name ? f.used : "Instructions, tools and a model for an agent",
      onClose: t[9] || (t[9] = (o) => v("close"))
    }, {
      foot: i(() => [
        t[12] || (t[12] = h("span", { class: "profile-panel-grow" }, null, -1)),
        n(e(N), {
          kind: "ghost",
          small: "",
          "data-profile-cancel": "",
          onClick: t[7] || (t[7] = (o) => v("close"))
        }, {
          default: i(() => [...t[10] || (t[10] = [
            k("Cancel", -1)
          ])]),
          _: 1
        }),
        n(e(N), {
          kind: "primary",
          small: "",
          disabled: !R.value,
          "data-profile-save": "",
          onClick: t[8] || (t[8] = (o) => v("save", f.profile, l.value))
        }, {
          default: i(() => [...t[11] || (t[11] = [
            k("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: i(() => [
        h("div", te, [
          f.profile.name ? $("", !0) : (u(), y(e(c), {
            key: 0,
            label: "Name",
            for: "profile-name",
            help: "Letters, digits and dashes; the agent starts it by this name."
          }, {
            default: i(() => [
              n(e(G), {
                id: "profile-name",
                value: l.value.name,
                placeholder: "critic",
                onInput: t[0] || (t[0] = (o) => l.value.name = o.target.value.trim())
              }, null, 8, ["value"])
            ]),
            _: 1
          })),
          n(e(c), {
            label: "When it is used",
            for: "profile-description",
            help: "The agent reads this to decide when to start it."
          }, {
            default: i(() => [
              n(e(L), {
                id: "profile-description",
                rows: "3",
                value: l.value.description,
                onInput: t[1] || (t[1] = (o) => l.value.description = o.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          n(e(c), {
            label: "Tools",
            for: "profile-tools",
            help: "Comma separated. A profile that only reads keeps to Read, Grep, Glob and the like."
          }, {
            default: i(() => [
              n(e(G), {
                id: "profile-tools",
                value: l.value.tools,
                placeholder: "Read, Grep, Glob",
                onInput: t[2] || (t[2] = (o) => l.value.tools = o.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          n(e(c), {
            label: "Kind",
            for: "profile-kind",
            help: "The agent roles your suite supports."
          }, {
            default: i(() => [
              n(e(H), {
                options: g.value,
                value: l.value.profile_type,
                onPick: t[3] || (t[3] = (o) => l.value.profile_type = o)
              }, null, 8, ["options", "value"])
            ]),
            _: 1
          }),
          n(e(c), {
            label: "Model on Claude Code",
            for: "profile-model",
            help: "The least expensive model that reliably fits the work."
          }, {
            default: i(() => [
              n(e(O), {
                provider: "claude",
                inherits: "",
                value: l.value.model,
                "data-profile-model": "claude",
                onPick: t[4] || (t[4] = (o) => l.value.model = o)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          n(e(c), {
            label: "Model on Codex",
            for: "profile-codex-model",
            help: "The model it runs on when the agent is Codex."
          }, {
            default: i(() => [
              n(e(O), {
                provider: "codex",
                inherits: "",
                value: l.value.codex_model,
                "data-profile-model": "codex",
                onPick: t[5] || (t[5] = (o) => l.value.codex_model = o)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          n(e(c), {
            label: "Instructions",
            for: "profile-body",
            help: "What it is told each time it starts, after the brief."
          }, {
            default: i(() => [
              n(e(L), {
                id: "profile-body",
                rows: "16",
                value: l.value.body,
                onInput: t[6] || (t[6] = (o) => l.value.body = o.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          f.profile.shipped ? (u(), b("p", le, "This is a built-in profile. Running setup restores its original contents.")) : $("", !0)
        ])
      ]),
      _: 1
    }, 8, ["title", "abstract"]));
  }
}, ae = /* @__PURE__ */ A(oe, [["__scopeId", "data-v-83ce8b10"]]), se = {
  class: "profiles",
  "data-profiles": ""
}, ne = {
  class: "count",
  "data-profile-count": ""
}, ie = {
  key: 0,
  class: "notice",
  "data-profile-notice": ""
}, re = {
  key: 1,
  class: "notice failed",
  role: "alert",
  "data-profile-failure": ""
}, de = {
  key: 3,
  class: "rows"
}, ue = { class: "profile-meta" }, pe = { class: "profile-model" }, fe = {
  __name: "ProfileRows",
  setup(f) {
    const _ = { name: "", description: "", tools: "Read, Grep, Glob", profile_type: "subagent", model: "sonnet", codex_model: "gpt-6.1-sol", body: "", shipped: !1, uses: 0 }, { rows: r, listing: v, failure: g, loaded: w, act: l, actionFailure: I, context: R } = J("profile list", []), p = x(() => v.value ? v.value.types : []), t = S(""), o = S(""), P = S(""), C = S(!1), B = x(() => {
      const d = o.value.toLowerCase().split(/\s+/).filter(Boolean);
      return r.value.filter((s) => d.every((a) => {
        var T;
        return Q(s, a, (T = R.search) == null ? void 0 : T.fields);
      }));
    }), E = x(() => C.value ? _ : r.value.find((d) => d.name === t.value) || null), F = (d) => d.uses ? `Uses: ${d.uses} ${d.uses === 1 ? "time" : "times"}, last ${ee(new Date(d.last_used * 1e3).toISOString())}` : "Uses: none";
    function U() {
      C.value = !0, t.value = "";
    }
    function W(d) {
      C.value = !1, t.value = d.name;
    }
    function D() {
      C.value = !1, t.value = "";
    }
    async function M(d, s) {
      P.value = "";
      const a = d.name || s.name;
      (await l(["profile", "save", a, "--description", s.description, "--tools", s.tools, "--type", s.profile_type, "--model", s.model, "--codex-model", s.codex_model, "--body", s.body])).ok && (C.value = !1, t.value = a, P.value = `${a} saved. The agent will use it the next time it starts a helper with this profile.`);
    }
    return (d, s) => (u(), b("section", se, [
      n(e(X), {
        modelValue: o.value,
        "onUpdate:modelValue": s[0] || (s[0] = (a) => o.value = a),
        class: "bar",
        "data-profile-find": ""
      }, {
        default: i(() => [
          n(e(N), {
            kind: "ghost",
            small: "",
            "data-profile-new": "",
            onClick: U
          }, {
            default: i(() => [...s[1] || (s[1] = [
              k("New profile", -1)
            ])]),
            _: 1
          }),
          h("span", ne, m(e(r).length) + " " + m(e(r).length === 1 ? "profile" : "profiles") + " in .claude/agents", 1),
          P.value ? (u(), b("span", ie, m(P.value), 1)) : $("", !0),
          e(I) ? (u(), b("span", re, m(e(I)), 1)) : $("", !0)
        ]),
        _: 1
      }, 8, ["modelValue"]),
      e(g) ? (u(), y(e(V), {
        key: 0,
        class: "empty",
        title: "The profiles could not be read"
      }, {
        default: i(() => [
          k(m(e(g)), 1)
        ]),
        _: 1
      })) : !e(w) || !e(r).length ? (u(), y(e(V), {
        key: 1,
        class: "empty",
        loading: !e(w),
        title: "No profiles yet"
      }, {
        default: i(() => [...s[2] || (s[2] = [
          k(" A profile gives an agent its instructions, tools and model. Your suite supplies its standard profiles at setup. ", -1)
        ])]),
        _: 1
      }, 8, ["loading"])) : B.value.length ? (u(), b("div", de, [
        (u(!0), b(q, null, z(B.value, (a) => (u(), y(e(N), {
          key: a.name,
          kind: "text",
          fill: "",
          class: "profile-open",
          "aria-label": `Open ${a.name}`,
          "data-profile": a.name,
          onClick: (T) => W(a)
        }, {
          default: i(() => [
            n(e(Z), {
              title: a.name,
              text: a.description
            }, {
              end: i(() => [
                h("span", ue, [
                  h("span", pe, m(a.profile_type) + " · " + m(a.model || "chosen at start") + " on Claude · " + m(a.codex_model || "chosen at start") + " on Codex", 1),
                  h("span", {
                    class: K(["profile-used", { never: !a.uses }])
                  }, m(F(a)), 3)
                ])
              ]),
              _: 2
            }, 1032, ["title", "text"])
          ]),
          _: 2
        }, 1032, ["aria-label", "data-profile", "onClick"]))), 128))
      ])) : (u(), y(e(V), {
        key: 2,
        class: "empty",
        title: "No profile matches"
      }, {
        default: i(() => [...s[3] || (s[3] = [
          k("Try other words.", -1)
        ])]),
        _: 1
      })),
      E.value ? (u(), y(ae, {
        key: 4,
        types: p.value,
        profile: E.value,
        used: F(E.value),
        onClose: D,
        onSave: M
      }, null, 8, ["types", "profile", "used"])) : $("", !0)
    ]));
  }
}, ce = /* @__PURE__ */ A(fe, [["__scopeId", "data-v-055b6826"]]);
export {
  ce as default
};
