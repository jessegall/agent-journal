/* @code-commandments-generated */
if (!document.getElementById("window-styles-502aa8a73cf1")) { const style = document.createElement("style"); style.id = "window-styles-502aa8a73cf1"; style.textContent = ".profile-panel[data-v-57deba13]{display:flex;flex-direction:column;gap:14px}.profile-panel-note[data-v-57deba13]{margin:0;color:var(--text-3);font-size:12.5px}.profile-panel-grow[data-v-57deba13]{flex:1}.profiles[data-v-bb7eea1d]{padding:0 0 40px}.bar[data-v-bb7eea1d]{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;min-height:44px;padding:8px 14px 8px 22px;border-bottom:1px solid var(--border);color:var(--text-2)}.profiles-find[data-v-bb7eea1d]{flex:0 1 280px}.count[data-v-bb7eea1d]{margin-left:auto;color:var(--text-3);font-size:12.5px}.notice[data-v-bb7eea1d]{font-size:12px;color:var(--text-2)}.notice.failed[data-v-bb7eea1d]{color:var(--danger)}.empty[data-v-bb7eea1d]{margin:40px auto;max-width:480px}.rows[data-v-bb7eea1d]{display:flex;flex-direction:column;padding:8px 14px 0 22px}.profile-open[data-v-bb7eea1d]{text-align:left}.profile-meta[data-v-bb7eea1d]{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:12px}.profile-model[data-v-bb7eea1d]{color:var(--text-2)}.profile-used[data-v-bb7eea1d]{color:var(--text-3);white-space:nowrap}.profile-used.never[data-v-bb7eea1d]{color:var(--text-4)}@media(max-width:640px){.profiles-find[data-v-bb7eea1d]{flex:1 1 100%}.profile-meta[data-v-bb7eea1d]{display:none}}\n"; document.head.appendChild(style); }
import { ref as C, watch as D, computed as I, openBlock as u, createBlock as b, unref as e, withCtx as i, createElementVNode as h, createVNode as s, createCommentVNode as $, createElementBlock as w, createTextVNode as x, withKeys as W, toDisplayString as m, Fragment as K, renderList as M, normalizeClass as q } from "vue";
import { SidePanel as z, FormField as y, TextInput as F, TextArea as j, Segmented as U, ModelPicker as E, Btn as N, useRows as H, EmptyState as T, ListRow as J, ago as Q } from "@journal/window-kit";
const L = (p, _) => {
  const r = p.__vccOpts || p;
  for (const [v, g] of _)
    r[v] = g;
  return r;
}, X = {
  class: "profile-panel",
  "data-profile-panel": ""
}, Y = {
  key: 1,
  class: "profile-panel-note"
}, Z = {
  __name: "ProfilePanel",
  props: { profile: { type: Object, required: !0 }, used: { type: String, default: "" } },
  emits: ["close", "save"],
  setup(p, { emit: _ }) {
    const r = p, v = _, g = [
      { key: "subagent", label: "Subagent" },
      { key: "worker", label: "Worker" }
    ], S = ["description", "tools", "profile_type", "model", "codex_model", "body"], o = C({});
    D(
      () => r.profile.name,
      () => {
        o.value = { name: r.profile.name, ...Object.fromEntries(S.map((f) => [f, r.profile[f]])) };
      },
      { immediate: !0 }
    );
    const c = I(() => S.some((f) => o.value[f] !== r.profile[f]) || !r.profile.name), k = I(() => c.value && /^[a-z0-9_-]+$/i.test(o.value.name || "") && o.value.description.trim());
    return (f, t) => (u(), b(e(z), {
      title: p.profile.name || "New profile",
      abstract: p.profile.name ? p.used : "A worker or a subagent the agent can dispatch for one kind of job",
      onClose: t[9] || (t[9] = (n) => v("close"))
    }, {
      foot: i(() => [
        t[12] || (t[12] = h("span", { class: "profile-panel-grow" }, null, -1)),
        s(e(N), {
          kind: "ghost",
          small: "",
          "data-profile-cancel": "",
          onClick: t[7] || (t[7] = (n) => v("close"))
        }, {
          default: i(() => [...t[10] || (t[10] = [
            x("Cancel", -1)
          ])]),
          _: 1
        }),
        s(e(N), {
          kind: "primary",
          small: "",
          disabled: !k.value,
          "data-profile-save": "",
          onClick: t[8] || (t[8] = (n) => v("save", p.profile, o.value))
        }, {
          default: i(() => [...t[11] || (t[11] = [
            x("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: i(() => [
        h("div", X, [
          p.profile.name ? $("", !0) : (u(), b(e(y), {
            key: 0,
            label: "Name",
            for: "profile-name",
            help: "Letters, digits and dashes; the agent starts it by this name."
          }, {
            default: i(() => [
              s(e(F), {
                id: "profile-name",
                value: o.value.name,
                placeholder: "critic",
                onInput: t[0] || (t[0] = (n) => o.value.name = n.target.value.trim())
              }, null, 8, ["value"])
            ]),
            _: 1
          })),
          s(e(y), {
            label: "When it is used",
            for: "profile-description",
            help: "The agent reads this to decide when to start it."
          }, {
            default: i(() => [
              s(e(j), {
                id: "profile-description",
                rows: "3",
                value: o.value.description,
                onInput: t[1] || (t[1] = (n) => o.value.description = n.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          s(e(y), {
            label: "Tools",
            for: "profile-tools",
            help: "Comma separated. A profile that only reads keeps to Read, Grep, Glob and the like."
          }, {
            default: i(() => [
              s(e(F), {
                id: "profile-tools",
                value: o.value.tools,
                placeholder: "Read, Grep, Glob",
                onInput: t[2] || (t[2] = (n) => o.value.tools = n.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          s(e(y), {
            label: "Kind",
            for: "profile-kind",
            help: "A subagent only reads and is started with the Agent tool; a worker writes and is sent out by the agent with a journal command."
          }, {
            default: i(() => [
              s(e(U), {
                options: g,
                value: o.value.profile_type,
                onPick: t[3] || (t[3] = (n) => o.value.profile_type = n)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          s(e(y), {
            label: "Model on Claude Code",
            for: "profile-model",
            help: "The least expensive model that reliably fits the work."
          }, {
            default: i(() => [
              s(e(E), {
                provider: "claude",
                inherits: "",
                value: o.value.model,
                "data-profile-model": "claude",
                onPick: t[4] || (t[4] = (n) => o.value.model = n)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          s(e(y), {
            label: "Model on Codex",
            for: "profile-codex-model",
            help: "The model it runs on when the agent is Codex."
          }, {
            default: i(() => [
              s(e(E), {
                provider: "codex",
                inherits: "",
                value: o.value.codex_model,
                "data-profile-model": "codex",
                onPick: t[5] || (t[5] = (n) => o.value.codex_model = n)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          s(e(y), {
            label: "Instructions",
            for: "profile-body",
            help: "What it is told each time it starts, after the brief."
          }, {
            default: i(() => [
              s(e(j), {
                id: "profile-body",
                rows: "16",
                value: o.value.body,
                onInput: t[6] || (t[6] = (n) => o.value.body = n.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          p.profile.shipped ? (u(), w("p", Y, "The journal ships this profile; setup puts it back as shipped.")) : $("", !0)
        ])
      ]),
      _: 1
    }, 8, ["title", "abstract"]));
  }
}, ee = /* @__PURE__ */ L(Z, [["__scopeId", "data-v-57deba13"]]), te = {
  class: "profiles",
  "data-profiles": ""
}, le = { class: "bar" }, oe = {
  class: "count",
  "data-profile-count": ""
}, ae = {
  key: 0,
  class: "notice",
  "data-profile-notice": ""
}, ne = {
  key: 1,
  class: "notice failed",
  role: "alert",
  "data-profile-failure": ""
}, se = {
  key: 3,
  class: "rows"
}, ie = { class: "profile-meta" }, re = { class: "profile-model" }, de = {
  __name: "ProfileRows",
  setup(p) {
    const _ = { name: "", description: "", tools: "Read, Grep, Glob", profile_type: "subagent", model: "sonnet", codex_model: "gpt-6.1-sol", body: "", shipped: !1, uses: 0 }, { rows: r, failure: v, loaded: g, act: S, actionFailure: o } = H("profile list", []), c = C(""), k = C(""), f = C(""), t = C(!1), n = I(() => {
      const d = k.value.toLowerCase().split(/\s+/).filter(Boolean);
      return r.value.filter((l) => d.every((a) => `${l.name} ${l.description} ${l.profile_type} ${l.model} ${l.codex_model}`.toLowerCase().includes(a)));
    }), P = I(() => t.value ? _ : r.value.find((d) => d.name === c.value) || null), R = (d) => d.uses ? `Dispatched ${d.uses} ${d.uses === 1 ? "time" : "times"}, last ${Q(new Date(d.last_used * 1e3).toISOString())}` : "Never dispatched here";
    function V() {
      t.value = !0, c.value = "";
    }
    function A(d) {
      t.value = !1, c.value = d.name;
    }
    function G() {
      t.value = !1, c.value = "";
    }
    async function O(d, l) {
      f.value = "";
      const a = d.name || l.name;
      (await S(["profile", "save", a, "--description", l.description, "--tools", l.tools, "--type", l.profile_type, "--model", l.model, "--codex-model", l.codex_model, "--body", l.body])).ok && (t.value = !1, c.value = a, f.value = `${a} saved; the agent reads it at its next dispatch.`);
    }
    return (d, l) => (u(), w("section", te, [
      h("div", le, [
        s(e(F), {
          modelValue: k.value,
          "onUpdate:modelValue": l[0] || (l[0] = (a) => k.value = a),
          class: "profiles-find",
          icon: "search",
          placeholder: "Find a profile",
          "aria-label": "Find a profile",
          "data-profile-find": "",
          onKeydown: l[1] || (l[1] = W((a) => k.value = "", ["esc"]))
        }, null, 8, ["modelValue"]),
        s(e(N), {
          kind: "ghost",
          small: "",
          "data-profile-new": "",
          onClick: V
        }, {
          default: i(() => [...l[2] || (l[2] = [
            x("New profile", -1)
          ])]),
          _: 1
        }),
        h("span", oe, m(e(r).length) + " " + m(e(r).length === 1 ? "profile" : "profiles") + " in .claude/agents", 1),
        f.value ? (u(), w("span", ae, m(f.value), 1)) : $("", !0),
        e(o) ? (u(), w("span", ne, m(e(o)), 1)) : $("", !0)
      ]),
      e(v) ? (u(), b(e(T), {
        key: 0,
        class: "empty",
        title: "The profiles could not be read"
      }, {
        default: i(() => [
          x(m(e(v)), 1)
        ]),
        _: 1
      })) : !e(g) || !e(r).length ? (u(), b(e(T), {
        key: 1,
        class: "empty",
        loading: !e(g),
        title: "No profiles yet"
      }, {
        default: i(() => [...l[3] || (l[3] = [
          x(" A profile is a subagent the agent can start for one kind of job: its description says when, its tools what it may do, its model what it runs on. The journal writes a researcher, a planner and a debugger at setup. ", -1)
        ])]),
        _: 1
      }, 8, ["loading"])) : n.value.length ? (u(), w("div", se, [
        (u(!0), w(K, null, M(n.value, (a) => (u(), b(e(N), {
          key: a.name,
          kind: "text",
          fill: "",
          class: "profile-open",
          "aria-label": `Open ${a.name}`,
          "data-profile": a.name,
          onClick: (B) => A(a)
        }, {
          default: i(() => [
            s(e(J), {
              title: a.name,
              text: a.description
            }, {
              end: i(() => [
                h("span", ie, [
                  h("span", re, m(a.profile_type) + " · " + m(a.model || "the agent's model") + " on Claude · " + m(a.codex_model || "the agent's model") + " on Codex", 1),
                  h("span", {
                    class: q(["profile-used", { never: !a.uses }])
                  }, m(R(a)), 3)
                ])
              ]),
              _: 2
            }, 1032, ["title", "text"])
          ]),
          _: 2
        }, 1032, ["aria-label", "data-profile", "onClick"]))), 128))
      ])) : (u(), b(e(T), {
        key: 2,
        class: "empty",
        title: "No profile matches"
      }, {
        default: i(() => [...l[4] || (l[4] = [
          x("Try other words.", -1)
        ])]),
        _: 1
      })),
      P.value ? (u(), b(ee, {
        key: 4,
        profile: P.value,
        used: R(P.value),
        onClose: G,
        onSave: O
      }, null, 8, ["profile", "used"])) : $("", !0)
    ]));
  }
}, fe = /* @__PURE__ */ L(de, [["__scopeId", "data-v-bb7eea1d"]]);
export {
  fe as default
};
