/* @code-commandments-generated */
if (!document.getElementById("window-styles-24c39516c05b")) { const style = document.createElement("style"); style.id = "window-styles-24c39516c05b"; style.textContent = ".helper-start[data-v-33743d25]{display:grid;gap:12px;padding:0 0 20px;margin-bottom:20px;border-bottom:1px solid var(--border-2)}h3[data-v-33743d25]{margin:0;font-size:14px;font-weight:600}.field[data-v-33743d25]{display:grid;gap:4px}.field>span[data-v-33743d25]{color:var(--text-2);font-size:12px;font-weight:500}select[data-v-33743d25]{padding:6px 9px;border:1px solid var(--border-2);border-radius:7px;background:var(--bg);color:var(--text);font:inherit}.reason[data-v-33743d25],.notice[data-v-33743d25]{margin:0;color:var(--text-3);font-size:12px;line-height:1.5;overflow-wrap:anywhere}.idle-helper[data-v-33743d25]{display:flex;align-items:center;justify-content:space-between;gap:12px}.profile-panel[data-v-d0c0e8cf]{display:flex;flex-direction:column;gap:14px}.profile-panel-note[data-v-d0c0e8cf]{margin:0;color:var(--text-3);font-size:12.5px}.profile-panel-check[data-v-d0c0e8cf]{display:flex;gap:8px;align-items:center;font-size:13px}.profile-panel-grow[data-v-d0c0e8cf]{flex:1}.profiles[data-v-5b4b770e]{padding:0 0 40px}.bar[data-v-5b4b770e]{flex-wrap:wrap;gap:8px 12px;color:var(--text-2)}.count[data-v-5b4b770e]{margin-left:auto;color:var(--text-3);font-size:12.5px}.notice[data-v-5b4b770e]{font-size:12px;color:var(--text-2)}.notice.failed[data-v-5b4b770e]{color:var(--danger)}.empty[data-v-5b4b770e]{margin:40px auto;max-width:480px}.rows[data-v-5b4b770e]{display:flex;flex-direction:column;padding:8px 14px 0 22px}.profile-open[data-v-5b4b770e]{text-align:left}.profile-meta[data-v-5b4b770e]{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:12px}.profile-model[data-v-5b4b770e]{color:var(--text-2)}.profile-used[data-v-5b4b770e]{color:var(--text-3);white-space:nowrap}.profile-warning[data-v-5b4b770e]{color:var(--tone-warn)}.profile-used.never[data-v-5b4b770e]{color:var(--text-4)}@media(max-width:640px){.profiles-find[data-v-5b4b770e]{flex:1 1 100%}.profile-meta[data-v-5b4b770e]{display:none}}\n"; document.head.appendChild(style); }
import { ref as $, computed as x, watch as G, openBlock as n, createElementBlock as f, withModifiers as le, createElementVNode as y, createVNode as s, unref as l, withDirectives as K, Fragment as F, renderList as U, toDisplayString as g, vModelSelect as ae, withCtx as d, createTextVNode as P, createCommentVNode as b, createBlock as I, renderSlot as oe, vModelCheckbox as ne, normalizeClass as se } from "vue";
import { useWindow as re, TextArea as z, Btn as B, TextInput as O, SidePanel as ie, FormField as N, Segmented as D, ModelPicker as J, DiffCard as ue, useRows as de, matchesSearch as pe, SearchBar as ve, EmptyState as q, ListRow as fe, ago as me } from "@journal/window-kit";
const H = (v, W) => {
  const c = v.__vccOpts || v;
  for (const [h, m] of W)
    c[h] = m;
  return c;
}, ce = { class: "field" }, ye = { class: "field" }, ge = ["disabled"], he = ["value"], be = ["data-helper-idle"], ke = {
  key: 0,
  class: "field"
}, _e = {
  key: 1,
  class: "reason",
  "data-helper-fresh-blocked": ""
}, xe = {
  key: 2,
  class: "reason",
  "data-helper-start-reason": ""
}, $e = {
  key: 3,
  class: "notice"
}, we = {
  __name: "HelperStartForm",
  props: { profile: { type: String, required: !0 } },
  setup(v) {
    const W = v, c = re(), h = { can_start: !1, reason: "", programs: [], idle_helpers: [], can_start_fresh: !1, fresh_reason: "" }, m = $(h), S = $(""), k = $(""), a = $(""), w = $(""), T = $(!1), A = $(!0);
    let C = 0;
    const j = x(() => !T.value && !A.value && !!S.value.trim()), _ = x(() => !j.value || !(m.value.can_start || m.value.can_start_fresh && w.value.trim()));
    async function R() {
      const t = ++C;
      A.value = !0;
      const e = await c.read(`helper availability --profile ${W.profile}${k.value ? ` --program ${k.value}` : ""}`);
      t === C && (e.ok ? m.value = e.value : (m.value = h, a.value = e.error), A.value = !1);
    }
    async function E() {
      _.value || await r(["helper", "start", W.profile, "--brief", S.value, ...k.value ? ["--program", k.value] : [], ...w.value.trim() ? ["--fresh", w.value.trim()] : []], "The helper is starting.");
    }
    async function V(t) {
      j.value && await r(["helper", "send", String(t), S.value], "Job sent.");
    }
    async function r(t, e) {
      T.value = !0;
      try {
        const i = await c.run(t);
        a.value = i.ok ? e : i.error, i.ok && (S.value = "", w.value = ""), await R();
      } finally {
        T.value = !1;
      }
    }
    return G([() => W.profile, k], R, { immediate: !0 }), (t, e) => (n(), f("form", {
      class: "helper-start",
      "data-helper-start": "",
      onSubmit: le(E, ["prevent"])
    }, [
      e[9] || (e[9] = y("h3", null, "Give a helper a job", -1)),
      y("label", ce, [
        e[3] || (e[3] = y("span", null, "The job", -1)),
        s(l(z), {
          value: S.value,
          rows: "3",
          disabled: T.value,
          "data-helper-brief": "",
          onInput: e[0] || (e[0] = (i) => S.value = i.target.value)
        }, null, 8, ["value", "disabled"])
      ]),
      y("label", ye, [
        e[5] || (e[5] = y("span", null, "Program", -1)),
        K(y("select", {
          "onUpdate:modelValue": e[1] || (e[1] = (i) => k.value = i),
          disabled: T.value,
          "data-helper-program": ""
        }, [
          e[4] || (e[4] = y("option", { value: "" }, "The profile's program", -1)),
          (n(!0), f(F, null, U(m.value.programs, (i) => (n(), f("option", {
            key: i,
            value: i
          }, g(i), 9, he))), 128))
        ], 8, ge), [
          [ae, k.value]
        ])
      ]),
      (n(!0), f(F, null, U(m.value.idle_helpers, (i) => (n(), f("div", {
        key: i.id,
        class: "idle-helper",
        "data-helper-idle": i.id
      }, [
        y("span", null, g(i.name) + " · Idle", 1),
        s(l(B), {
          type: "button",
          disabled: !j.value,
          "data-helper-send": i.id,
          onClick: (M) => V(i.id)
        }, {
          default: d(() => [...e[6] || (e[6] = [
            P("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled", "data-helper-send", "onClick"])
      ], 8, be))), 128)),
      m.value.idle_helpers.length ? (n(), f("label", ke, [
        e[7] || (e[7] = y("span", null, "Why start another helper?", -1)),
        s(l(O), {
          modelValue: w.value,
          "onUpdate:modelValue": e[2] || (e[2] = (i) => w.value = i),
          disabled: T.value,
          "data-helper-fresh-reason": ""
        }, null, 8, ["modelValue", "disabled"])
      ])) : b("", !0),
      s(l(B), {
        type: "submit",
        disabled: _.value,
        "data-helper-start-button": ""
      }, {
        default: d(() => [...e[8] || (e[8] = [
          P("Start a helper", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      m.value.fresh_reason ? (n(), f("p", _e, g(m.value.fresh_reason), 1)) : b("", !0),
      m.value.reason && m.value.reason !== m.value.fresh_reason ? (n(), f("p", xe, g(m.value.reason), 1)) : b("", !0),
      a.value ? (n(), f("p", $e, g(a.value), 1)) : b("", !0)
    ], 32));
  }
}, Ce = /* @__PURE__ */ H(we, [["__scopeId", "data-v-33743d25"]]), Se = {
  class: "profile-panel",
  "data-profile-panel": ""
}, Te = { key: 0 }, Ie = {
  key: 0,
  "data-profile-type-locked": ""
}, Pe = { class: "profile-panel-check" }, je = {
  key: 3,
  class: "profile-panel-note"
}, Y = "writing", Re = {
  __name: "ProfilePanel",
  props: { profile: { type: Object, required: !0 }, used: { type: String, default: "" }, types: { type: Array, default: () => [] } },
  emits: ["close", "save", "reset"],
  setup(v, { emit: W }) {
    const c = v, h = W, m = [{ key: "", label: "The parent's program" }, { key: "claude", label: "Claude Code" }, { key: "codex", label: "Codex" }], S = x(() => c.types.map((r) => ({ key: r.key, label: r.label }))), k = ["title", "description", "agent_type", "access", "program", "independent", "mcp_tools", "model", "codex_model", "body"], a = $({});
    G(
      () => c.profile.name,
      () => {
        a.value = { name: c.profile.name, ...Object.fromEntries(k.map((r) => [r, c.profile[r]])), mcp_tools: c.profile.mcp_tools.join(",") };
      },
      { immediate: !0 }
    );
    const w = x(() => c.types.find((r) => r.key === a.value.agent_type)), T = x(() => {
      var r;
      return ((r = w.value) == null ? void 0 : r.access) === Y;
    }), A = x(() => [{ key: "read-only", label: "Read-only" }, ...T.value ? [{ key: Y, label: "Writing" }] : []]);
    G(T, (r) => {
      r || (a.value.access = "read-only");
    });
    const C = $(!1), j = (r, t, e) => t.map((i, M) => ({ line_type: r, line: M + 1, text: i })).filter((i) => !e.includes(i.text)), _ = x(() => {
      const r = c.profile.body.split(`
`), t = (c.profile.module_body || "").split(`
`);
      return [...j("del", r, t), ...j("add", t, r)];
    }), R = x(() => ({ ...c.profile, mcp_tools: c.profile.mcp_tools.join(",") })), E = x(() => k.some((r) => a.value[r] !== R.value[r]) || !c.profile.name), V = x(() => E.value && /^[a-z0-9_-]+$/i.test(a.value.name || "") && a.value.description.trim());
    return (r, t) => (n(), I(l(ie), {
      title: v.profile.title || v.profile.name || "New profile",
      abstract: v.profile.name ? v.used : "Instructions, type and model for an agent",
      onClose: t[15] || (t[15] = (e) => h("close"))
    }, {
      foot: d(() => [
        v.profile.changed.length || v.profile.problem ? (n(), I(l(B), {
          key: 0,
          variant: "ghost",
          small: "",
          "data-profile-reset": "",
          onClick: t[12] || (t[12] = (e) => h("reset", v.profile))
        }, {
          default: d(() => [...t[19] || (t[19] = [
            P("Use the journal's version", -1)
          ])]),
          _: 1
        })) : b("", !0),
        t[22] || (t[22] = y("span", { class: "profile-panel-grow" }, null, -1)),
        s(l(B), {
          variant: "ghost",
          small: "",
          "data-profile-cancel": "",
          onClick: t[13] || (t[13] = (e) => h("close"))
        }, {
          default: d(() => [...t[20] || (t[20] = [
            P("Cancel", -1)
          ])]),
          _: 1
        }),
        s(l(B), {
          variant: "primary",
          small: "",
          disabled: !V.value,
          "data-profile-save": "",
          onClick: t[14] || (t[14] = (e) => h("save", v.profile, a.value))
        }, {
          default: d(() => [...t[21] || (t[21] = [
            P("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: d(() => [
        oe(r.$slots, "default", {}, void 0, !0),
        y("div", Se, [
          v.profile.title ? (n(), f("small", Te, g(v.profile.name), 1)) : b("", !0),
          v.profile.name ? b("", !0) : (n(), I(l(N), {
            key: 1,
            label: "Name",
            for: "profile-name",
            help: "Letters, digits and dashes; the agent starts it by this name."
          }, {
            default: d(() => [
              s(l(O), {
                id: "profile-name",
                value: a.value.name,
                placeholder: "critic",
                onInput: t[0] || (t[0] = (e) => a.value.name = e.target.value.trim())
              }, null, 8, ["value"])
            ]),
            _: 1
          })),
          s(l(N), {
            label: "Title",
            for: "profile-title"
          }, {
            default: d(() => [
              s(l(O), {
                id: "profile-title",
                value: a.value.title,
                onInput: t[1] || (t[1] = (e) => a.value.title = e.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          s(l(N), {
            label: "When it is used",
            for: "profile-description",
            help: "The agent reads this to decide when to start it."
          }, {
            default: d(() => [
              s(l(z), {
                id: "profile-description",
                rows: "3",
                value: a.value.description,
                onInput: t[2] || (t[2] = (e) => a.value.description = e.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          s(l(N), {
            label: "Type",
            for: "profile-type",
            help: "The type of agent that runs this profile."
          }, {
            default: d(() => {
              var e;
              return [
                v.profile.shipped ? (n(), f("span", Ie, g((e = w.value) == null ? void 0 : e.label), 1)) : (n(), I(l(D), {
                  key: 1,
                  "data-profile-type": "",
                  options: S.value,
                  value: a.value.agent_type,
                  onPick: t[3] || (t[3] = (i) => a.value.agent_type = i)
                }, null, 8, ["options", "value"]))
              ];
            }),
            _: 1
          }),
          s(l(N), {
            label: "Access",
            for: "profile-access",
            help: "Whether it may change files."
          }, {
            default: d(() => [
              s(l(D), {
                "data-profile-access": "",
                options: A.value,
                value: a.value.access,
                onPick: t[4] || (t[4] = (e) => a.value.access = e)
              }, null, 8, ["options", "value"])
            ]),
            _: 1
          }),
          s(l(N), {
            label: "Program",
            for: "profile-program",
            help: "Claude Code or Codex, or the same program as the agent that starts it."
          }, {
            default: d(() => [
              s(l(D), {
                options: m,
                value: a.value.program,
                onPick: t[5] || (t[5] = (e) => a.value.program = e)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          s(l(N), {
            label: "Model on Claude Code",
            for: "profile-model",
            help: "The least expensive model that reliably fits the work."
          }, {
            default: d(() => [
              s(l(J), {
                provider: "claude",
                inherits: "",
                value: a.value.model,
                "data-profile-model": "claude",
                onPick: t[6] || (t[6] = (e) => a.value.model = e)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          s(l(N), {
            label: "Model on Codex",
            for: "profile-codex-model",
            help: "The model it runs on when the agent is Codex."
          }, {
            default: d(() => [
              s(l(J), {
                provider: "codex",
                inherits: "",
                value: a.value.codex_model,
                "data-profile-model": "codex",
                onPick: t[7] || (t[7] = (e) => a.value.codex_model = e)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          s(l(N), {
            label: "Instructions",
            for: "profile-body",
            help: "What it is told each time it starts, after the brief."
          }, {
            default: d(() => [
              s(l(z), {
                id: "profile-body",
                rows: "16",
                value: a.value.body,
                onInput: t[8] || (t[8] = (e) => a.value.body = e.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          s(l(N), {
            label: "MCP tools this profile may call",
            for: "profile-mcp",
            help: "Separate the names with commas."
          }, {
            default: d(() => [
              s(l(O), {
                id: "profile-mcp",
                value: a.value.mcp_tools,
                onInput: t[9] || (t[9] = (e) => a.value.mcp_tools = e.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          y("label", Pe, [
            K(y("input", {
              "onUpdate:modelValue": t[10] || (t[10] = (e) => a.value.independent = e),
              type: "checkbox",
              "data-profile-independent": ""
            }, null, 512), [
              [ne, a.value.independent]
            ]),
            t[16] || (t[16] = P(" Must judge fresh", -1))
          ]),
          v.profile.module_text_changed ? (n(), f(F, { key: 2 }, [
            t[18] || (t[18] = y("p", { class: "profile-panel-note" }, "Text changed: the journal's instructions have a new version.", -1)),
            s(l(B), {
              variant: "ghost",
              small: "",
              "data-profile-compare": "",
              onClick: t[11] || (t[11] = (e) => C.value = !C.value)
            }, {
              default: d(() => [...t[17] || (t[17] = [
                P("Compare", -1)
              ])]),
              _: 1
            }),
            C.value ? (n(), I(l(ue), {
              key: 0,
              path: "Instructions",
              change: "edit",
              added: _.value.filter((e) => e.line_type === "add").length,
              removed: _.value.filter((e) => e.line_type === "del").length,
              at: "",
              rows: _.value,
              "data-profile-diff": ""
            }, null, 8, ["added", "removed", "rows"])) : b("", !0)
          ], 64)) : b("", !0),
          v.profile.shipped ? (n(), f("p", je, "This comes with the journal. Your changes are kept through updates.")) : b("", !0)
        ])
      ]),
      _: 3
    }, 8, ["title", "abstract"]));
  }
}, Ve = /* @__PURE__ */ H(Re, [["__scopeId", "data-v-d0c0e8cf"]]), Ne = {
  class: "profiles",
  "data-profiles": ""
}, We = {
  class: "count",
  "data-profile-count": ""
}, Ae = {
  key: 0,
  class: "notice",
  "data-profile-notice": ""
}, Be = {
  key: 1,
  class: "notice failed",
  role: "alert",
  "data-profile-failure": ""
}, Le = {
  key: 3,
  class: "rows"
}, Ee = { class: "profile-meta" }, Me = {
  key: 0,
  class: "profile-model"
}, Fe = { class: "profile-model" }, Oe = {
  __name: "ProfileRows",
  setup(v) {
    const W = { name: "", title: "", description: "", agent_type: "helper", access: "read-only", program: "", independent: !1, mcp_tools: [], changed: [], notes: [], problem: "", model: "sonnet", codex_model: "gpt-6.1-sol", body: "", shipped: !1, uses: 0 }, c = { "read-only": "Read-only", writing: "Writing" }, { rows: h, listing: m, failure: S, loaded: k, act: a, actionFailure: w, context: T } = de("profile list", []), A = x(() => m.value ? m.value.types : []), C = $(""), j = $(""), _ = $(""), R = $(!1), E = x(() => {
      const o = j.value.toLowerCase().split(/\s+/).filter(Boolean);
      return h.value.filter((u) => o.every((p) => {
        var L;
        return pe(u, p, (L = T.search) == null ? void 0 : L.fields);
      }));
    }), V = x(() => R.value ? W : h.value.find((o) => o.name === C.value) || null), r = (o) => {
      var u;
      return ((u = A.value.find((p) => p.key === o.agent_type)) == null ? void 0 : u.label) || o.agent_type;
    }, t = (o) => o.shipped ? "Comes with the journal" : o.module, e = (o) => [`Type: ${r(o)}`, `Access: ${c[o.access]}`, `${o.model || "chosen at start"} on Claude`, `${o.codex_model || "chosen at start"} on Codex`, o.changed.length ? "Changed" : "", t(o)].filter(Boolean).join(" · "), i = (o) => [o.problem, o.module_text_changed ? "Text changed: the journal's instructions have a new version" : "", ...o.notes].filter(Boolean), M = (o) => o.uses ? `Uses: ${o.uses} ${o.uses === 1 ? "time" : "times"}, last ${me(new Date(o.last_used * 1e3).toISOString())}` : "Uses: none";
    function Q() {
      R.value = !0, C.value = "";
    }
    function X(o) {
      R.value = !1, C.value = o.name;
    }
    function Z() {
      R.value = !1, C.value = "";
    }
    async function ee(o) {
      _.value = "", (await a(["profile", "reset", o.name])).ok && (_.value = `${o.name} is back to the journal's version.`);
    }
    async function te(o, u) {
      _.value = "";
      const p = o.name || u.name;
      (await a(["profile", "save", p, ...u.title ? ["--title", u.title] : [], "--description", u.description, "--type", u.agent_type, "--access", u.access, "--program", u.program, "--model", u.model, "--codex-model", u.codex_model, "--mcp-tools", u.mcp_tools, u.independent ? "--independent" : "--no-independent", "--body", u.body])).ok && (R.value = !1, C.value = p, _.value = `${p} saved. The agent will use it the next time it starts a helper with this profile.`);
    }
    return (o, u) => (n(), f("section", Ne, [
      s(l(ve), {
        modelValue: j.value,
        "onUpdate:modelValue": u[0] || (u[0] = (p) => j.value = p),
        class: "bar",
        "data-profile-find": ""
      }, {
        default: d(() => [
          s(l(B), {
            variant: "ghost",
            small: "",
            "data-profile-new": "",
            onClick: Q
          }, {
            default: d(() => [...u[1] || (u[1] = [
              P("New profile", -1)
            ])]),
            _: 1
          }),
          y("span", We, g(l(h).length) + " " + g(l(h).length === 1 ? "profile" : "profiles"), 1),
          _.value ? (n(), f("span", Ae, g(_.value), 1)) : b("", !0),
          l(w) ? (n(), f("span", Be, g(l(w)), 1)) : b("", !0)
        ]),
        _: 1
      }, 8, ["modelValue"]),
      l(S) ? (n(), I(l(q), {
        key: 0,
        class: "empty",
        title: "The profiles could not be read"
      }, {
        default: d(() => [
          P(g(l(S)), 1)
        ]),
        _: 1
      })) : !l(k) || !l(h).length ? (n(), I(l(q), {
        key: 1,
        class: "empty",
        loading: !l(k),
        title: "No profiles yet"
      }, {
        default: d(() => [...u[2] || (u[2] = [
          P(" A profile gives an agent its instructions, type and model. The journal includes standard profiles. ", -1)
        ])]),
        _: 1
      }, 8, ["loading"])) : E.value.length ? (n(), f("div", Le, [
        (n(!0), f(F, null, U(E.value, (p) => (n(), I(l(B), {
          key: p.name,
          variant: "text",
          fill: "",
          class: "profile-open",
          "aria-label": `Open ${p.name}`,
          "data-profile": p.name,
          onClick: (L) => X(p)
        }, {
          default: d(() => [
            s(l(fe), {
              title: p.title || p.name,
              text: p.description
            }, {
              end: d(() => [
                y("span", Ee, [
                  p.title ? (n(), f("span", Me, g(p.name), 1)) : b("", !0),
                  y("span", Fe, g(e(p)), 1),
                  (n(!0), f(F, null, U(i(p), (L) => (n(), f("span", {
                    key: L,
                    class: "profile-warning",
                    "data-profile-warning": ""
                  }, g(L), 1))), 128)),
                  y("span", {
                    class: se(["profile-used", { never: !p.uses }])
                  }, g(M(p)), 3)
                ])
              ]),
              _: 2
            }, 1032, ["title", "text"])
          ]),
          _: 2
        }, 1032, ["aria-label", "data-profile", "onClick"]))), 128))
      ])) : (n(), I(l(q), {
        key: 2,
        class: "empty",
        title: "No profile matches"
      }, {
        default: d(() => [...u[3] || (u[3] = [
          P("Try other words.", -1)
        ])]),
        _: 1
      })),
      V.value ? (n(), I(Ve, {
        key: 4,
        types: A.value,
        profile: V.value,
        used: M(V.value),
        onClose: Z,
        onSave: te,
        onReset: ee
      }, {
        default: d(() => [
          V.value.name && V.value.agent_type === "helper" ? (n(), I(Ce, {
            key: 0,
            profile: V.value.name
          }, null, 8, ["profile"])) : b("", !0)
        ]),
        _: 1
      }, 8, ["types", "profile", "used"])) : b("", !0)
    ]));
  }
}, qe = /* @__PURE__ */ H(Oe, [["__scopeId", "data-v-5b4b770e"]]);
export {
  qe as default
};
