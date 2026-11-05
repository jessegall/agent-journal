/* @code-commandments-generated */
if (!document.getElementById("window-styles-286529f3fbfc")) { const style = document.createElement("style"); style.id = "window-styles-286529f3fbfc"; style.textContent = ".profile-panel[data-v-92ae1e68]{display:flex;flex-direction:column;gap:14px}.profile-panel-note[data-v-92ae1e68]{margin:0;color:var(--text-3);font-size:12.5px}.profile-panel-grow[data-v-92ae1e68]{flex:1}.profiles[data-v-3d19976a]{padding:0 0 40px}.bar[data-v-3d19976a]{flex-wrap:wrap;gap:8px 12px;color:var(--text-2)}.count[data-v-3d19976a]{margin-left:auto;color:var(--text-3);font-size:12.5px}.notice[data-v-3d19976a]{font-size:12px;color:var(--text-2)}.notice.failed[data-v-3d19976a]{color:var(--danger)}.empty[data-v-3d19976a]{margin:40px auto;max-width:480px}.rows[data-v-3d19976a]{display:flex;flex-direction:column;padding:8px 14px 0 22px}.profile-open[data-v-3d19976a]{text-align:left}.profile-meta[data-v-3d19976a]{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:12px}.profile-model[data-v-3d19976a]{color:var(--text-2)}.profile-used[data-v-3d19976a]{color:var(--text-3);white-space:nowrap}.profile-used.never[data-v-3d19976a]{color:var(--text-4)}@media(max-width:640px){.profiles-find[data-v-3d19976a]{flex:1 1 100%}.profile-meta[data-v-3d19976a]{display:none}}\n"; document.head.appendChild(style); }
import { computed as x, ref as S, watch as M, openBlock as u, createBlock as v, unref as e, withCtx as s, createElementVNode as k, createVNode as i, createCommentVNode as T, createElementBlock as h, createTextVNode as b, toDisplayString as m, Fragment as q, renderList as z, normalizeClass as G } from "vue";
import { SidePanel as H, FormField as g, TextInput as J, TextArea as O, Segmented as K, ModelPicker as R, Btn as N, useRows as Q, matchesSearch as X, SearchBar as Y, EmptyState as B, ListRow as Z, ago as ee } from "@journal/window-kit";
const U = (f, _) => {
  const r = f.__vccOpts || f;
  for (const [c, y] of _)
    r[c] = y;
  return r;
}, te = {
  class: "profile-panel",
  "data-profile-panel": ""
}, le = {
  key: 1,
  class: "profile-panel-note"
}, ae = {
  __name: "ProfilePanel",
  props: { profile: { type: Object, required: !0 }, used: { type: String, default: "" }, types: { type: Array, default: () => [] } },
  emits: ["close", "save"],
  setup(f, { emit: _ }) {
    const r = f, c = _, y = x(() => r.types.map((p) => ({ key: p, label: p.slice(0, 1).toUpperCase() + p.slice(1) }))), w = ["description", "agent_type", "model", "codex_model", "body"], l = S({});
    M(
      () => r.profile.name,
      () => {
        l.value = { name: r.profile.name, ...Object.fromEntries(w.map((p) => [p, r.profile[p]])) };
      },
      { immediate: !0 }
    );
    const $ = x(() => w.some((p) => l.value[p] !== r.profile[p]) || !r.profile.name), E = x(() => $.value && /^[a-z0-9_-]+$/i.test(l.value.name || "") && l.value.description.trim());
    return (p, t) => (u(), v(e(H), {
      title: f.profile.name || "New profile",
      abstract: f.profile.name ? f.used : "Instructions, type and model for an agent",
      onClose: t[8] || (t[8] = (o) => c("close"))
    }, {
      foot: s(() => [
        t[11] || (t[11] = k("span", { class: "profile-panel-grow" }, null, -1)),
        i(e(N), {
          kind: "ghost",
          small: "",
          "data-profile-cancel": "",
          onClick: t[6] || (t[6] = (o) => c("close"))
        }, {
          default: s(() => [...t[9] || (t[9] = [
            b("Cancel", -1)
          ])]),
          _: 1
        }),
        i(e(N), {
          kind: "primary",
          small: "",
          disabled: !E.value,
          "data-profile-save": "",
          onClick: t[7] || (t[7] = (o) => c("save", f.profile, l.value))
        }, {
          default: s(() => [...t[10] || (t[10] = [
            b("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: s(() => [
        k("div", te, [
          f.profile.name ? T("", !0) : (u(), v(e(g), {
            key: 0,
            label: "Name",
            for: "profile-name",
            help: "Letters, digits and dashes; the agent starts it by this name."
          }, {
            default: s(() => [
              i(e(J), {
                id: "profile-name",
                value: l.value.name,
                placeholder: "critic",
                onInput: t[0] || (t[0] = (o) => l.value.name = o.target.value.trim())
              }, null, 8, ["value"])
            ]),
            _: 1
          })),
          i(e(g), {
            label: "When it is used",
            for: "profile-description",
            help: "The agent reads this to decide when to start it."
          }, {
            default: s(() => [
              i(e(O), {
                id: "profile-description",
                rows: "3",
                value: l.value.description,
                onInput: t[1] || (t[1] = (o) => l.value.description = o.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(e(g), {
            label: "Type",
            for: "profile-kind",
            help: "The kind of agent that runs this profile."
          }, {
            default: s(() => [
              i(e(K), {
                options: y.value,
                value: l.value.agent_type,
                onPick: t[2] || (t[2] = (o) => l.value.agent_type = o)
              }, null, 8, ["options", "value"])
            ]),
            _: 1
          }),
          i(e(g), {
            label: "Model on Claude Code",
            for: "profile-model",
            help: "The least expensive model that reliably fits the work."
          }, {
            default: s(() => [
              i(e(R), {
                provider: "claude",
                inherits: "",
                value: l.value.model,
                "data-profile-model": "claude",
                onPick: t[3] || (t[3] = (o) => l.value.model = o)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(e(g), {
            label: "Model on Codex",
            for: "profile-codex-model",
            help: "The model it runs on when the agent is Codex."
          }, {
            default: s(() => [
              i(e(R), {
                provider: "codex",
                inherits: "",
                value: l.value.codex_model,
                "data-profile-model": "codex",
                onPick: t[4] || (t[4] = (o) => l.value.codex_model = o)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          i(e(g), {
            label: "Instructions",
            for: "profile-body",
            help: "What it is told each time it starts, after the brief."
          }, {
            default: s(() => [
              i(e(O), {
                id: "profile-body",
                rows: "16",
                value: l.value.body,
                onInput: t[5] || (t[5] = (o) => l.value.body = o.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          f.profile.shipped ? (u(), h("p", le, "This is a built-in profile. Running setup restores its original contents.")) : T("", !0)
        ])
      ]),
      _: 1
    }, 8, ["title", "abstract"]));
  }
}, oe = /* @__PURE__ */ U(ae, [["__scopeId", "data-v-92ae1e68"]]), ne = {
  class: "profiles",
  "data-profiles": ""
}, se = {
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
    const _ = { name: "", description: "", agent_type: "helper", model: "sonnet", codex_model: "gpt-6.1-sol", body: "", shipped: !1, uses: 0 }, { rows: r, listing: c, failure: y, loaded: w, act: l, actionFailure: $, context: E } = Q("profile list", []), p = x(() => c.value ? c.value.types : []), t = S(""), o = S(""), P = S(""), C = S(!1), F = x(() => {
      const d = o.value.toLowerCase().split(/\s+/).filter(Boolean);
      return r.value.filter((n) => d.every((a) => {
        var I;
        return X(n, a, (I = E.search) == null ? void 0 : I.fields);
      }));
    }), V = x(() => C.value ? _ : r.value.find((d) => d.name === t.value) || null), L = (d) => d.uses ? `Uses: ${d.uses} ${d.uses === 1 ? "time" : "times"}, last ${ee(new Date(d.last_used * 1e3).toISOString())}` : "Uses: none";
    function W() {
      C.value = !0, t.value = "";
    }
    function j(d) {
      C.value = !1, t.value = d.name;
    }
    function A() {
      C.value = !1, t.value = "";
    }
    async function D(d, n) {
      P.value = "";
      const a = d.name || n.name;
      (await l(["profile", "save", a, "--description", n.description, "--type", n.agent_type, "--model", n.model, "--codex-model", n.codex_model, "--body", n.body])).ok && (C.value = !1, t.value = a, P.value = `${a} saved. The agent will use it the next time it starts a helper with this profile.`);
    }
    return (d, n) => (u(), h("section", ne, [
      i(e(Y), {
        modelValue: o.value,
        "onUpdate:modelValue": n[0] || (n[0] = (a) => o.value = a),
        class: "bar",
        "data-profile-find": ""
      }, {
        default: s(() => [
          i(e(N), {
            kind: "ghost",
            small: "",
            "data-profile-new": "",
            onClick: W
          }, {
            default: s(() => [...n[1] || (n[1] = [
              b("New profile", -1)
            ])]),
            _: 1
          }),
          k("span", se, m(e(r).length) + " " + m(e(r).length === 1 ? "profile" : "profiles") + " in .claude/agents", 1),
          P.value ? (u(), h("span", ie, m(P.value), 1)) : T("", !0),
          e($) ? (u(), h("span", re, m(e($)), 1)) : T("", !0)
        ]),
        _: 1
      }, 8, ["modelValue"]),
      e(y) ? (u(), v(e(B), {
        key: 0,
        class: "empty",
        title: "The profiles could not be read"
      }, {
        default: s(() => [
          b(m(e(y)), 1)
        ]),
        _: 1
      })) : !e(w) || !e(r).length ? (u(), v(e(B), {
        key: 1,
        class: "empty",
        loading: !e(w),
        title: "No profiles yet"
      }, {
        default: s(() => [...n[2] || (n[2] = [
          b(" A profile gives an agent its instructions, type and model. The journal includes standard profiles. ", -1)
        ])]),
        _: 1
      }, 8, ["loading"])) : F.value.length ? (u(), h("div", de, [
        (u(!0), h(q, null, z(F.value, (a) => (u(), v(e(N), {
          key: a.name,
          kind: "text",
          fill: "",
          class: "profile-open",
          "aria-label": `Open ${a.name}`,
          "data-profile": a.name,
          onClick: (I) => j(a)
        }, {
          default: s(() => [
            i(e(Z), {
              title: a.name,
              text: a.description
            }, {
              end: s(() => [
                k("span", ue, [
                  k("span", pe, m(a.agent_type) + " · " + m(a.model || "chosen at start") + " on Claude · " + m(a.codex_model || "chosen at start") + " on Codex", 1),
                  k("span", {
                    class: G(["profile-used", { never: !a.uses }])
                  }, m(L(a)), 3)
                ])
              ]),
              _: 2
            }, 1032, ["title", "text"])
          ]),
          _: 2
        }, 1032, ["aria-label", "data-profile", "onClick"]))), 128))
      ])) : (u(), v(e(B), {
        key: 2,
        class: "empty",
        title: "No profile matches"
      }, {
        default: s(() => [...n[3] || (n[3] = [
          b("Try other words.", -1)
        ])]),
        _: 1
      })),
      V.value ? (u(), v(oe, {
        key: 4,
        types: p.value,
        profile: V.value,
        used: L(V.value),
        onClose: A,
        onSave: D
      }, null, 8, ["types", "profile", "used"])) : T("", !0)
    ]));
  }
}, ve = /* @__PURE__ */ U(fe, [["__scopeId", "data-v-3d19976a"]]);
export {
  ve as default
};
