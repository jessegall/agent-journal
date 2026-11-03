/* @code-commandments-generated */
if (!document.getElementById("window-styles-93b593a0d82f")) { const style = document.createElement("style"); style.id = "window-styles-93b593a0d82f"; style.textContent = ".profile-panel[data-v-57deba13]{display:flex;flex-direction:column;gap:14px}.profile-panel-note[data-v-57deba13]{margin:0;color:var(--text-3);font-size:12.5px}.profile-panel-grow[data-v-57deba13]{flex:1}.profiles[data-v-c337ca50]{padding:0 0 40px}.bar[data-v-c337ca50]{flex-wrap:wrap;gap:8px 12px;color:var(--text-2)}.count[data-v-c337ca50]{margin-left:auto;color:var(--text-3);font-size:12.5px}.notice[data-v-c337ca50]{font-size:12px;color:var(--text-2)}.notice.failed[data-v-c337ca50]{color:var(--danger)}.empty[data-v-c337ca50]{margin:40px auto;max-width:480px}.rows[data-v-c337ca50]{display:flex;flex-direction:column;padding:8px 14px 0 22px}.profile-open[data-v-c337ca50]{text-align:left}.profile-meta[data-v-c337ca50]{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:12px}.profile-model[data-v-c337ca50]{color:var(--text-2)}.profile-used[data-v-c337ca50]{color:var(--text-3);white-space:nowrap}.profile-used.never[data-v-c337ca50]{color:var(--text-4)}@media(max-width:640px){.profiles-find[data-v-c337ca50]{flex:1 1 100%}.profile-meta[data-v-c337ca50]{display:none}}\n"; document.head.appendChild(style); }
import { ref as _, watch as W, computed as I, openBlock as u, createBlock as y, unref as e, withCtx as i, createElementVNode as k, createVNode as n, createCommentVNode as C, createElementBlock as g, createTextVNode as w, toDisplayString as m, Fragment as M, renderList as q, normalizeClass as z } from "vue";
import { SidePanel as K, FormField as h, TextInput as V, TextArea as A, Segmented as U, ModelPicker as B, Btn as N, useRows as H, matchesSearch as J, SearchBar as Q, EmptyState as R, ListRow as X, ago as Y } from "@journal/window-kit";
const F = (p, x) => {
  const r = p.__vccOpts || p;
  for (const [c, b] of x)
    r[c] = b;
  return r;
}, Z = {
  class: "profile-panel",
  "data-profile-panel": ""
}, ee = {
  key: 1,
  class: "profile-panel-note"
}, te = {
  __name: "ProfilePanel",
  props: { profile: { type: Object, required: !0 }, used: { type: String, default: "" } },
  emits: ["close", "save"],
  setup(p, { emit: x }) {
    const r = p, c = x, b = [
      { key: "subagent", label: "Subagent" },
      { key: "worker", label: "Worker" }
    ], S = ["description", "tools", "profile_type", "model", "codex_model", "body"], l = _({});
    W(
      () => r.profile.name,
      () => {
        l.value = { name: r.profile.name, ...Object.fromEntries(S.map((f) => [f, r.profile[f]])) };
      },
      { immediate: !0 }
    );
    const P = I(() => S.some((f) => l.value[f] !== r.profile[f]) || !r.profile.name), v = I(() => P.value && /^[a-z0-9_-]+$/i.test(l.value.name || "") && l.value.description.trim());
    return (f, t) => (u(), y(e(K), {
      title: p.profile.name || "New profile",
      abstract: p.profile.name ? p.used : "A worker or a subagent the agent can dispatch for one kind of job",
      onClose: t[9] || (t[9] = (o) => c("close"))
    }, {
      foot: i(() => [
        t[12] || (t[12] = k("span", { class: "profile-panel-grow" }, null, -1)),
        n(e(N), {
          kind: "ghost",
          small: "",
          "data-profile-cancel": "",
          onClick: t[7] || (t[7] = (o) => c("close"))
        }, {
          default: i(() => [...t[10] || (t[10] = [
            w("Cancel", -1)
          ])]),
          _: 1
        }),
        n(e(N), {
          kind: "primary",
          small: "",
          disabled: !v.value,
          "data-profile-save": "",
          onClick: t[8] || (t[8] = (o) => c("save", p.profile, l.value))
        }, {
          default: i(() => [...t[11] || (t[11] = [
            w("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: i(() => [
        k("div", Z, [
          p.profile.name ? C("", !0) : (u(), y(e(h), {
            key: 0,
            label: "Name",
            for: "profile-name",
            help: "Letters, digits and dashes; the agent starts it by this name."
          }, {
            default: i(() => [
              n(e(V), {
                id: "profile-name",
                value: l.value.name,
                placeholder: "critic",
                onInput: t[0] || (t[0] = (o) => l.value.name = o.target.value.trim())
              }, null, 8, ["value"])
            ]),
            _: 1
          })),
          n(e(h), {
            label: "When it is used",
            for: "profile-description",
            help: "The agent reads this to decide when to start it."
          }, {
            default: i(() => [
              n(e(A), {
                id: "profile-description",
                rows: "3",
                value: l.value.description,
                onInput: t[1] || (t[1] = (o) => l.value.description = o.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          n(e(h), {
            label: "Tools",
            for: "profile-tools",
            help: "Comma separated. A profile that only reads keeps to Read, Grep, Glob and the like."
          }, {
            default: i(() => [
              n(e(V), {
                id: "profile-tools",
                value: l.value.tools,
                placeholder: "Read, Grep, Glob",
                onInput: t[2] || (t[2] = (o) => l.value.tools = o.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          n(e(h), {
            label: "Kind",
            for: "profile-kind",
            help: "A subagent only reads and is started with the Agent tool; a worker writes and is sent out by the agent with a journal command."
          }, {
            default: i(() => [
              n(e(U), {
                options: b,
                value: l.value.profile_type,
                onPick: t[3] || (t[3] = (o) => l.value.profile_type = o)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          n(e(h), {
            label: "Model on Claude Code",
            for: "profile-model",
            help: "The least expensive model that reliably fits the work."
          }, {
            default: i(() => [
              n(e(B), {
                provider: "claude",
                inherits: "",
                value: l.value.model,
                "data-profile-model": "claude",
                onPick: t[4] || (t[4] = (o) => l.value.model = o)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          n(e(h), {
            label: "Model on Codex",
            for: "profile-codex-model",
            help: "The model it runs on when the agent is Codex."
          }, {
            default: i(() => [
              n(e(B), {
                provider: "codex",
                inherits: "",
                value: l.value.codex_model,
                "data-profile-model": "codex",
                onPick: t[5] || (t[5] = (o) => l.value.codex_model = o)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          n(e(h), {
            label: "Instructions",
            for: "profile-body",
            help: "What it is told each time it starts, after the brief."
          }, {
            default: i(() => [
              n(e(A), {
                id: "profile-body",
                rows: "16",
                value: l.value.body,
                onInput: t[6] || (t[6] = (o) => l.value.body = o.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          p.profile.shipped ? (u(), g("p", ee, "The journal ships this profile; setup puts it back as shipped.")) : C("", !0)
        ])
      ]),
      _: 1
    }, 8, ["title", "abstract"]));
  }
}, le = /* @__PURE__ */ F(te, [["__scopeId", "data-v-57deba13"]]), oe = {
  class: "profiles",
  "data-profiles": ""
}, ae = {
  class: "count",
  "data-profile-count": ""
}, se = {
  key: 0,
  class: "notice",
  "data-profile-notice": ""
}, ne = {
  key: 1,
  class: "notice failed",
  role: "alert",
  "data-profile-failure": ""
}, ie = {
  key: 3,
  class: "rows"
}, re = { class: "profile-meta" }, de = { class: "profile-model" }, ue = {
  __name: "ProfileRows",
  setup(p) {
    const x = { name: "", description: "", tools: "Read, Grep, Glob", profile_type: "subagent", model: "sonnet", codex_model: "gpt-6.1-sol", body: "", shipped: !1, uses: 0 }, { rows: r, failure: c, loaded: b, act: S, actionFailure: l, context: P } = H("profile list", []), v = _(""), f = _(""), t = _(""), o = _(!1), j = I(() => {
      const d = f.value.toLowerCase().split(/\s+/).filter(Boolean);
      return r.value.filter((s) => d.every((a) => {
        var $;
        return J(s, a, ($ = P.search) == null ? void 0 : $.fields);
      }));
    }), T = I(() => o.value ? x : r.value.find((d) => d.name === v.value) || null), E = (d) => d.uses ? `Dispatched ${d.uses} ${d.uses === 1 ? "time" : "times"}, last ${Y(new Date(d.last_used * 1e3).toISOString())}` : "Never dispatched here";
    function G() {
      o.value = !0, v.value = "";
    }
    function L(d) {
      o.value = !1, v.value = d.name;
    }
    function O() {
      o.value = !1, v.value = "";
    }
    async function D(d, s) {
      t.value = "";
      const a = d.name || s.name;
      (await S(["profile", "save", a, "--description", s.description, "--tools", s.tools, "--type", s.profile_type, "--model", s.model, "--codex-model", s.codex_model, "--body", s.body])).ok && (o.value = !1, v.value = a, t.value = `${a} saved; the agent reads it at its next dispatch.`);
    }
    return (d, s) => (u(), g("section", oe, [
      n(e(Q), {
        modelValue: f.value,
        "onUpdate:modelValue": s[0] || (s[0] = (a) => f.value = a),
        class: "bar",
        "data-profile-find": ""
      }, {
        default: i(() => [
          n(e(N), {
            kind: "ghost",
            small: "",
            "data-profile-new": "",
            onClick: G
          }, {
            default: i(() => [...s[1] || (s[1] = [
              w("New profile", -1)
            ])]),
            _: 1
          }),
          k("span", ae, m(e(r).length) + " " + m(e(r).length === 1 ? "profile" : "profiles") + " in .claude/agents", 1),
          t.value ? (u(), g("span", se, m(t.value), 1)) : C("", !0),
          e(l) ? (u(), g("span", ne, m(e(l)), 1)) : C("", !0)
        ]),
        _: 1
      }, 8, ["modelValue"]),
      e(c) ? (u(), y(e(R), {
        key: 0,
        class: "empty",
        title: "The profiles could not be read"
      }, {
        default: i(() => [
          w(m(e(c)), 1)
        ]),
        _: 1
      })) : !e(b) || !e(r).length ? (u(), y(e(R), {
        key: 1,
        class: "empty",
        loading: !e(b),
        title: "No profiles yet"
      }, {
        default: i(() => [...s[2] || (s[2] = [
          w(" A profile is a subagent the agent can start for one kind of job: its description says when, its tools what it may do, its model what it runs on. The journal writes a researcher, a planner and a debugger at setup. ", -1)
        ])]),
        _: 1
      }, 8, ["loading"])) : j.value.length ? (u(), g("div", ie, [
        (u(!0), g(M, null, q(j.value, (a) => (u(), y(e(N), {
          key: a.name,
          kind: "text",
          fill: "",
          class: "profile-open",
          "aria-label": `Open ${a.name}`,
          "data-profile": a.name,
          onClick: ($) => L(a)
        }, {
          default: i(() => [
            n(e(X), {
              title: a.name,
              text: a.description
            }, {
              end: i(() => [
                k("span", re, [
                  k("span", de, m(a.profile_type) + " · " + m(a.model || "the agent's model") + " on Claude · " + m(a.codex_model || "the agent's model") + " on Codex", 1),
                  k("span", {
                    class: z(["profile-used", { never: !a.uses }])
                  }, m(E(a)), 3)
                ])
              ]),
              _: 2
            }, 1032, ["title", "text"])
          ]),
          _: 2
        }, 1032, ["aria-label", "data-profile", "onClick"]))), 128))
      ])) : (u(), y(e(R), {
        key: 2,
        class: "empty",
        title: "No profile matches"
      }, {
        default: i(() => [...s[3] || (s[3] = [
          w("Try other words.", -1)
        ])]),
        _: 1
      })),
      T.value ? (u(), y(le, {
        key: 4,
        profile: T.value,
        used: E(T.value),
        onClose: O,
        onSave: D
      }, null, 8, ["profile", "used"])) : C("", !0)
    ]));
  }
}, me = /* @__PURE__ */ F(ue, [["__scopeId", "data-v-c337ca50"]]);
export {
  me as default
};
