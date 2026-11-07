/* @code-commandments-generated */
if (!document.getElementById("window-styles-f3e9e9671c18")) { const style = document.createElement("style"); style.id = "window-styles-f3e9e9671c18"; style.textContent = ".helper-start[data-v-11cb72ba]{display:grid;gap:12px;padding:0 0 20px;margin-bottom:20px;border-bottom:1px solid var(--border-2)}h3[data-v-11cb72ba]{margin:0;font-size:14px;font-weight:600}.field[data-v-11cb72ba]{display:grid;gap:4px}.field>span[data-v-11cb72ba]{color:var(--text-2);font-size:12px;font-weight:500}select[data-v-11cb72ba]{padding:6px 9px;border:1px solid var(--border-2);border-radius:7px;background:var(--bg);color:var(--text);font:inherit}.reason[data-v-11cb72ba],.notice[data-v-11cb72ba]{margin:0;color:var(--text-3);font-size:12px;line-height:1.5;overflow-wrap:anywhere}.idle-helper[data-v-11cb72ba]{display:flex;align-items:center;justify-content:space-between;gap:12px}.profile-panel[data-v-344a0c50]{display:flex;flex-direction:column;gap:14px}.profile-panel-note[data-v-344a0c50]{margin:0;color:var(--text-3);font-size:12.5px}.profile-panel-check[data-v-344a0c50]{display:flex;gap:8px;align-items:center;font-size:13px}.profile-panel-grow[data-v-344a0c50]{flex:1}.profiles[data-v-6e2e2d84]{padding:0 0 40px}.bar[data-v-6e2e2d84]{flex-wrap:wrap;gap:8px 12px;color:var(--text-2)}.count[data-v-6e2e2d84]{margin-left:auto;color:var(--text-3);font-size:12.5px}.notice[data-v-6e2e2d84]{font-size:12px;color:var(--text-2)}.notice.failed[data-v-6e2e2d84]{color:var(--danger)}.empty[data-v-6e2e2d84]{margin:40px auto;max-width:480px}.rows[data-v-6e2e2d84]{display:flex;flex-direction:column;padding:8px 14px 0 22px}.profile-open[data-v-6e2e2d84]{text-align:left}.profile-meta[data-v-6e2e2d84]{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:12px}.profile-model[data-v-6e2e2d84]{color:var(--text-2)}.profile-used[data-v-6e2e2d84]{color:var(--text-3);white-space:nowrap}.profile-warning[data-v-6e2e2d84]{color:var(--tone-warn)}.profile-used.never[data-v-6e2e2d84]{color:var(--text-4)}@media(max-width:640px){.profiles-find[data-v-6e2e2d84]{flex:1 1 100%}.profile-meta[data-v-6e2e2d84]{display:none}}\n"; document.head.appendChild(style); }
import { ref as k, computed as b, watch as z, openBlock as n, createElementBlock as m, withModifiers as ae, createElementVNode as c, createVNode as r, unref as t, withDirectives as X, Fragment as U, renderList as q, toDisplayString as y, vModelSelect as oe, withCtx as u, createTextVNode as P, createCommentVNode as g, createBlock as $, renderSlot as se, vModelCheckbox as ne, normalizeClass as re } from "vue";
import { useWindow as Z, TextArea as J, Btn as M, TextInput as D, SidePanel as ie, FormField as x, Segmented as F, ModelPicker as K, DiffCard as ue, matchesSearch as de, SearchBar as pe, EmptyState as H, ListRow as ve, ago as fe } from "@journal/window-kit";
const Y = (f, V) => {
  const d = f.__vccOpts || f;
  for (const [_, p] of V)
    d[_] = p;
  return d;
}, me = { class: "field" }, ce = { class: "field" }, ye = ["disabled"], ge = ["value"], he = ["data-helper-idle"], be = {
  key: 0,
  class: "field"
}, ke = {
  key: 1,
  class: "reason",
  "data-helper-fresh-blocked": ""
}, _e = {
  key: 2,
  class: "reason",
  "data-helper-start-reason": ""
}, we = {
  key: 3,
  class: "notice"
}, Ce = {
  __name: "HelperStartForm",
  props: { profile: { type: String, required: !0 } },
  setup(f) {
    const V = f, d = Z(), _ = { can_start: !1, reason: "", programs: [], idle_helpers: [], can_start_fresh: !1, fresh_reason: "" }, p = k(_), S = k(""), w = k(""), W = k(""), C = k(""), a = k(!1), A = k(!0);
    let T = 0;
    const N = b(() => !a.value && !A.value && !!S.value.trim()), h = b(() => !N.value || !(p.value.can_start || p.value.can_start_fresh && C.value.trim()));
    async function I() {
      const R = ++T;
      if (A.value = !0, d.state["availability.profile"] = V.profile, w.value ? d.state["availability.program"] = w.value : delete d.state["availability.program"], await d.reload("availability"), R !== T) return;
      const l = d.props.availability;
      l.failure.value ? (p.value = _, W.value = l.failure.value) : p.value = l.data.value, A.value = !1;
    }
    async function E() {
      h.value || await O(["helper", "start", V.profile, "--brief", S.value, ...w.value ? ["--program", w.value] : [], ...C.value.trim() ? ["--fresh", C.value.trim()] : []], "The helper is starting.");
    }
    async function j(R) {
      N.value && await O(["helper", "send", String(R), S.value], "Job sent.");
    }
    async function O(R, l) {
      a.value = !0;
      try {
        const e = await d.run(R);
        W.value = e.ok ? l : e.error, e.ok && (S.value = "", C.value = ""), await I();
      } finally {
        a.value = !1;
      }
    }
    return z([() => V.profile, w], I, { immediate: !0 }), (R, l) => (n(), m("form", {
      class: "helper-start",
      "data-helper-start": "",
      onSubmit: ae(E, ["prevent"])
    }, [
      l[9] || (l[9] = c("h3", null, "Give a helper a job", -1)),
      c("label", me, [
        l[3] || (l[3] = c("span", null, "The job", -1)),
        r(t(J), {
          value: S.value,
          rows: "3",
          disabled: a.value,
          "data-helper-brief": "",
          onInput: l[0] || (l[0] = (e) => S.value = e.target.value)
        }, null, 8, ["value", "disabled"])
      ]),
      c("label", ce, [
        l[5] || (l[5] = c("span", null, "Program", -1)),
        X(c("select", {
          "onUpdate:modelValue": l[1] || (l[1] = (e) => w.value = e),
          disabled: a.value,
          "data-helper-program": ""
        }, [
          l[4] || (l[4] = c("option", { value: "" }, "The profile's program", -1)),
          (n(!0), m(U, null, q(p.value.programs, (e) => (n(), m("option", {
            key: e,
            value: e
          }, y(e), 9, ge))), 128))
        ], 8, ye), [
          [oe, w.value]
        ])
      ]),
      (n(!0), m(U, null, q(p.value.idle_helpers, (e) => (n(), m("div", {
        key: e.id,
        class: "idle-helper",
        "data-helper-idle": e.id
      }, [
        c("span", null, y(e.name) + " · Idle", 1),
        r(t(M), {
          type: "button",
          disabled: !N.value,
          "data-helper-send": e.id,
          onClick: (o) => j(e.id)
        }, {
          default: u(() => [...l[6] || (l[6] = [
            P("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled", "data-helper-send", "onClick"])
      ], 8, he))), 128)),
      p.value.idle_helpers.length ? (n(), m("label", be, [
        l[7] || (l[7] = c("span", null, "Why start another helper?", -1)),
        r(t(D), {
          modelValue: C.value,
          "onUpdate:modelValue": l[2] || (l[2] = (e) => C.value = e),
          disabled: a.value,
          "data-helper-fresh-reason": ""
        }, null, 8, ["modelValue", "disabled"])
      ])) : g("", !0),
      r(t(M), {
        type: "submit",
        disabled: h.value,
        "data-helper-start-button": ""
      }, {
        default: u(() => [...l[8] || (l[8] = [
          P("Start a helper", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      p.value.fresh_reason ? (n(), m("p", ke, y(p.value.fresh_reason), 1)) : g("", !0),
      p.value.reason && p.value.reason !== p.value.fresh_reason ? (n(), m("p", _e, y(p.value.reason), 1)) : g("", !0),
      W.value ? (n(), m("p", we, y(W.value), 1)) : g("", !0)
    ], 32));
  }
}, xe = /* @__PURE__ */ Y(Ce, [["__scopeId", "data-v-11cb72ba"]]), $e = {
  class: "profile-panel",
  "data-profile-panel": ""
}, Se = { key: 0 }, Te = {
  key: 0,
  "data-profile-type-locked": ""
}, Ie = { class: "profile-panel-check" }, Pe = {
  key: 4,
  class: "profile-panel-note"
}, Q = "writing", je = {
  __name: "ProfilePanel",
  props: { profile: { type: Object, required: !0 }, used: { type: String, default: "" }, types: { type: Array, default: () => [] } },
  emits: ["close", "save", "reset"],
  setup(f, { emit: V }) {
    const d = f, _ = V, p = [{ key: "", label: "Profile models" }, { key: "fast", label: "Fast" }, { key: "general", label: "General" }, { key: "strongest", label: "Strongest" }], S = [{ key: "always", label: "Always this program" }, { key: "possible", label: "This program if possible" }], w = [{ key: "", label: "The parent's program" }, { key: "claude", label: "Claude Code" }, { key: "codex", label: "Codex" }], W = b(() => d.types.map((l) => ({ key: l.key, label: l.label }))), C = ["title", "description", "agent_type", "access", "program", "program_if_possible", "independent", "mcp_tools", "model", "codex_model", "tier", "body"], a = k({});
    z(
      () => d.profile.name,
      () => {
        a.value = { name: d.profile.name, ...Object.fromEntries(C.map((l) => [l, d.profile[l]])), mcp_tools: d.profile.mcp_tools.join(",") };
      },
      { immediate: !0 }
    );
    const A = b(() => d.types.find((l) => l.key === a.value.agent_type)), T = b(() => {
      var l;
      return ((l = A.value) == null ? void 0 : l.access) === Q;
    }), N = b(() => [{ key: "read-only", label: "Read-only" }, ...T.value ? [{ key: Q, label: "Writing" }] : []]);
    z(T, (l) => {
      l || (a.value.access = "read-only");
    });
    const h = k(!1), I = (l, e, o) => e.map((B, G) => ({ line_type: l, line: G + 1, text: B })).filter((B) => !o.includes(B.text)), E = b(() => {
      const l = d.profile.body.split(`
`), e = (d.profile.module_body || "").split(`
`);
      return [...I("del", l, e), ...I("add", e, l)];
    }), j = b(() => ({ ...d.profile, mcp_tools: d.profile.mcp_tools.join(",") })), O = b(() => C.some((l) => a.value[l] !== j.value[l]) || !d.profile.name), R = b(() => O.value && /^[a-z0-9_-]+$/i.test(a.value.name || "") && a.value.description.trim());
    return (l, e) => (n(), $(t(ie), {
      title: f.profile.title || f.profile.name || "New profile",
      abstract: f.profile.name ? f.used : "Instructions, type and model for an agent",
      onClose: e[17] || (e[17] = (o) => _("close"))
    }, {
      foot: u(() => [
        f.profile.changed.length || f.profile.problem ? (n(), $(t(M), {
          key: 0,
          variant: "ghost",
          small: "",
          "data-profile-reset": "",
          onClick: e[14] || (e[14] = (o) => _("reset", f.profile))
        }, {
          default: u(() => [...e[21] || (e[21] = [
            P("Use the journal's version", -1)
          ])]),
          _: 1
        })) : g("", !0),
        e[24] || (e[24] = c("span", { class: "profile-panel-grow" }, null, -1)),
        r(t(M), {
          variant: "ghost",
          small: "",
          "data-profile-cancel": "",
          onClick: e[15] || (e[15] = (o) => _("close"))
        }, {
          default: u(() => [...e[22] || (e[22] = [
            P("Cancel", -1)
          ])]),
          _: 1
        }),
        r(t(M), {
          variant: "primary",
          small: "",
          disabled: !R.value,
          "data-profile-save": "",
          onClick: e[16] || (e[16] = (o) => _("save", f.profile, a.value))
        }, {
          default: u(() => [...e[23] || (e[23] = [
            P("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: u(() => [
        se(l.$slots, "default", {}, void 0, !0),
        c("div", $e, [
          f.profile.title ? (n(), m("small", Se, y(f.profile.name), 1)) : g("", !0),
          f.profile.name ? g("", !0) : (n(), $(t(x), {
            key: 1,
            label: "Name",
            for: "profile-name",
            help: "Letters, digits and dashes; the agent starts it by this name."
          }, {
            default: u(() => [
              r(t(D), {
                id: "profile-name",
                value: a.value.name,
                placeholder: "critic",
                onInput: e[0] || (e[0] = (o) => a.value.name = o.target.value.trim())
              }, null, 8, ["value"])
            ]),
            _: 1
          })),
          r(t(x), {
            label: "Title",
            for: "profile-title"
          }, {
            default: u(() => [
              r(t(D), {
                id: "profile-title",
                value: a.value.title,
                onInput: e[1] || (e[1] = (o) => a.value.title = o.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          r(t(x), {
            label: "When it is used",
            for: "profile-description",
            help: "The agent reads this to decide when to start it."
          }, {
            default: u(() => [
              r(t(J), {
                id: "profile-description",
                rows: "3",
                value: a.value.description,
                onInput: e[2] || (e[2] = (o) => a.value.description = o.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          r(t(x), {
            label: "Type",
            for: "profile-type",
            help: "The type of agent that runs this profile."
          }, {
            default: u(() => {
              var o;
              return [
                f.profile.shipped ? (n(), m("span", Te, y((o = A.value) == null ? void 0 : o.label), 1)) : (n(), $(t(F), {
                  key: 1,
                  "data-profile-type": "",
                  options: W.value,
                  value: a.value.agent_type,
                  onPick: e[3] || (e[3] = (B) => a.value.agent_type = B)
                }, null, 8, ["options", "value"]))
              ];
            }),
            _: 1
          }),
          r(t(x), {
            label: "Access",
            for: "profile-access",
            help: "Whether it may change files."
          }, {
            default: u(() => [
              r(t(F), {
                "data-profile-access": "",
                options: N.value,
                value: a.value.access,
                onPick: e[4] || (e[4] = (o) => a.value.access = o)
              }, null, 8, ["options", "value"])
            ]),
            _: 1
          }),
          r(t(x), {
            label: "Program",
            for: "profile-program",
            help: "Claude Code or Codex, or the same program as the agent that starts it."
          }, {
            default: u(() => [
              r(t(F), {
                options: w,
                value: a.value.program,
                onPick: e[5] || (e[5] = (o) => a.value.program = o)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          a.value.program ? (n(), $(t(x), {
            key: 2,
            label: "When it cannot start",
            for: "profile-program-choice",
            help: "If possible: a start uses the other program, on its model, when this one is not installed or not ready, and says so."
          }, {
            default: u(() => [
              r(t(F), {
                "data-profile-program-choice": "",
                options: S,
                value: a.value.program_if_possible ? "possible" : "always",
                onPick: e[6] || (e[6] = (o) => a.value.program_if_possible = o === "possible")
              }, null, 8, ["value"])
            ]),
            _: 1
          })) : g("", !0),
          r(t(x), {
            label: "Model tier",
            for: "profile-tier",
            help: "Chooses a model when this profile has no named model for the program."
          }, {
            default: u(() => [
              r(t(F), {
                "data-profile-tier": "",
                options: p,
                value: a.value.tier || "",
                onPick: e[7] || (e[7] = (o) => a.value.tier = o || null)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          r(t(x), {
            label: "Model on Claude Code",
            for: "profile-model",
            help: "The least expensive model that reliably fits the work."
          }, {
            default: u(() => [
              r(t(K), {
                provider: "claude",
                inherits: "",
                value: a.value.model,
                "data-profile-model": "claude",
                onPick: e[8] || (e[8] = (o) => a.value.model = o)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          r(t(x), {
            label: "Model on Codex",
            for: "profile-codex-model",
            help: "The model it runs on when the agent is Codex."
          }, {
            default: u(() => [
              r(t(K), {
                provider: "codex",
                inherits: "",
                value: a.value.codex_model,
                "data-profile-model": "codex",
                onPick: e[9] || (e[9] = (o) => a.value.codex_model = o)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          r(t(x), {
            label: "Instructions",
            for: "profile-body",
            help: "What it is told each time it starts, after the brief."
          }, {
            default: u(() => [
              r(t(J), {
                id: "profile-body",
                rows: "16",
                value: a.value.body,
                onInput: e[10] || (e[10] = (o) => a.value.body = o.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          r(t(x), {
            label: "MCP tools this profile may call",
            for: "profile-mcp",
            help: "Separate the names with commas."
          }, {
            default: u(() => [
              r(t(D), {
                id: "profile-mcp",
                value: a.value.mcp_tools,
                onInput: e[11] || (e[11] = (o) => a.value.mcp_tools = o.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          c("label", Ie, [
            X(c("input", {
              "onUpdate:modelValue": e[12] || (e[12] = (o) => a.value.independent = o),
              type: "checkbox",
              "data-profile-independent": ""
            }, null, 512), [
              [ne, a.value.independent]
            ]),
            e[18] || (e[18] = P(" Must judge fresh", -1))
          ]),
          f.profile.module_text_changed ? (n(), m(U, { key: 3 }, [
            e[20] || (e[20] = c("p", { class: "profile-panel-note" }, "Text changed: the journal's instructions have a new version.", -1)),
            r(t(M), {
              variant: "ghost",
              small: "",
              "data-profile-compare": "",
              onClick: e[13] || (e[13] = (o) => h.value = !h.value)
            }, {
              default: u(() => [...e[19] || (e[19] = [
                P("Compare", -1)
              ])]),
              _: 1
            }),
            h.value ? (n(), $(t(ue), {
              key: 0,
              path: "Instructions",
              change: "edit",
              added: E.value.filter((o) => o.line_type === "add").length,
              removed: E.value.filter((o) => o.line_type === "del").length,
              at: "",
              rows: E.value,
              "data-profile-diff": ""
            }, null, 8, ["added", "removed", "rows"])) : g("", !0)
          ], 64)) : g("", !0),
          f.profile.shipped ? (n(), m("p", Pe, "This comes with the journal. Your changes are kept through updates.")) : g("", !0)
        ])
      ]),
      _: 3
    }, 8, ["title", "abstract"]));
  }
}, Re = /* @__PURE__ */ Y(je, [["__scopeId", "data-v-344a0c50"]]), Ve = {
  class: "profiles",
  "data-profiles": ""
}, We = {
  class: "count",
  "data-profile-count": ""
}, Ae = {
  key: 0,
  class: "notice",
  "data-profile-notice": ""
}, Ne = {
  key: 1,
  class: "notice failed",
  role: "alert",
  "data-profile-failure": ""
}, Ee = {
  key: 3,
  class: "rows"
}, Me = { class: "profile-meta" }, Be = {
  key: 0,
  class: "profile-model"
}, Le = { class: "profile-model" }, Oe = {
  __name: "ProfileRows",
  setup(f) {
    const V = { name: "", title: "", description: "", agent_type: "helper", access: "read-only", program: "", independent: !1, mcp_tools: [], changed: [], notes: [], problem: "", model: "", codex_model: "", tier: null, body: "", shipped: !1, uses: 0 }, d = { "read-only": "Read-only", writing: "Writing" }, _ = Z(), { rows: p, listing: S, failure: w, loaded: W, act: C, actionFailure: a } = _.props.profiles, A = b(() => S.value ? S.value.types : []), T = k(""), N = k(""), h = k(""), I = k(!1), E = b(() => {
      const s = N.value.toLowerCase().split(/\s+/).filter(Boolean);
      return p.value.filter((i) => s.every((v) => {
        var L;
        return de(i, v, (L = _.search) == null ? void 0 : L.fields);
      }));
    }), j = b(() => I.value ? V : p.value.find((s) => s.name === T.value) || null), O = (s) => {
      var i;
      return ((i = A.value.find((v) => v.key === s.agent_type)) == null ? void 0 : i.label) || s.agent_type;
    }, R = (s) => s.shipped ? "Comes with the journal" : s.module, l = (s) => [`Type: ${O(s)}`, `Access: ${d[s.access]}`, `${s.model || "chosen at start"} on Claude`, `${s.codex_model || "chosen at start"} on Codex`, s.changed.length ? "Changed" : "", R(s)].filter(Boolean).join(" · "), e = (s) => [s.problem, s.module_text_changed ? "Text changed: the journal's instructions have a new version" : "", ...s.notes].filter(Boolean), o = (s) => s.uses ? `Uses: ${s.uses} ${s.uses === 1 ? "time" : "times"}, last ${fe(new Date(s.last_used * 1e3).toISOString())}` : "Uses: none";
    function B() {
      I.value = !0, T.value = "";
    }
    function G(s) {
      I.value = !1, T.value = s.name;
    }
    function ee() {
      I.value = !1, T.value = "";
    }
    async function le(s) {
      h.value = "", (await C(["profile", "reset", s.name])).ok && (h.value = `${s.name} is back to the journal's version.`);
    }
    async function te(s, i) {
      h.value = "";
      const v = s.name || i.name;
      (await C(["profile", "save", v, ...i.title ? ["--title", i.title] : [], "--description", i.description, "--type", i.agent_type, "--access", i.access, "--program", i.program, i.program_if_possible ? "--program-if-possible" : "--no-program-if-possible", "--tier", i.tier || "", "--model", i.model, "--codex-model", i.codex_model, "--mcp-tools", i.mcp_tools, i.independent ? "--independent" : "--no-independent", "--body", i.body])).ok && (I.value = !1, T.value = v, h.value = `${v} saved. The agent will use it the next time it starts a helper with this profile.`);
    }
    return (s, i) => (n(), m("section", Ve, [
      r(t(pe), {
        modelValue: N.value,
        "onUpdate:modelValue": i[0] || (i[0] = (v) => N.value = v),
        class: "bar",
        "data-profile-find": ""
      }, {
        default: u(() => [
          r(t(M), {
            variant: "ghost",
            small: "",
            "data-profile-new": "",
            onClick: B
          }, {
            default: u(() => [...i[1] || (i[1] = [
              P("New profile", -1)
            ])]),
            _: 1
          }),
          c("span", We, y(t(p).length) + " " + y(t(p).length === 1 ? "profile" : "profiles"), 1),
          h.value ? (n(), m("span", Ae, y(h.value), 1)) : g("", !0),
          t(a) ? (n(), m("span", Ne, y(t(a)), 1)) : g("", !0)
        ]),
        _: 1
      }, 8, ["modelValue"]),
      t(w) ? (n(), $(t(H), {
        key: 0,
        class: "empty",
        title: "The profiles could not be read"
      }, {
        default: u(() => [
          P(y(t(w)), 1)
        ]),
        _: 1
      })) : !t(W) || !t(p).length ? (n(), $(t(H), {
        key: 1,
        class: "empty",
        loading: !t(W),
        title: "No profiles yet"
      }, {
        default: u(() => [...i[2] || (i[2] = [
          P(" A profile gives an agent its instructions, type and model. The journal includes standard profiles. ", -1)
        ])]),
        _: 1
      }, 8, ["loading"])) : E.value.length ? (n(), m("div", Ee, [
        (n(!0), m(U, null, q(E.value, (v) => (n(), $(t(M), {
          key: v.name,
          variant: "text",
          fill: "",
          class: "profile-open",
          "aria-label": `Open ${v.name}`,
          "data-profile": v.name,
          onClick: (L) => G(v)
        }, {
          default: u(() => [
            r(t(ve), {
              title: v.title || v.name,
              text: v.description
            }, {
              end: u(() => [
                c("span", Me, [
                  v.title ? (n(), m("span", Be, y(v.name), 1)) : g("", !0),
                  c("span", Le, y(l(v)), 1),
                  (n(!0), m(U, null, q(e(v), (L) => (n(), m("span", {
                    key: L,
                    class: "profile-warning",
                    "data-profile-warning": ""
                  }, y(L), 1))), 128)),
                  c("span", {
                    class: re(["profile-used", { never: !v.uses }])
                  }, y(o(v)), 3)
                ])
              ]),
              _: 2
            }, 1032, ["title", "text"])
          ]),
          _: 2
        }, 1032, ["aria-label", "data-profile", "onClick"]))), 128))
      ])) : (n(), $(t(H), {
        key: 2,
        class: "empty",
        title: "No profile matches"
      }, {
        default: u(() => [...i[3] || (i[3] = [
          P("Try other words.", -1)
        ])]),
        _: 1
      })),
      j.value ? (n(), $(Re, {
        key: 4,
        types: A.value,
        profile: j.value,
        used: o(j.value),
        onClose: ee,
        onSave: te,
        onReset: le
      }, {
        default: u(() => [
          j.value.name && j.value.agent_type === "helper" ? (n(), $(xe, {
            key: 0,
            profile: j.value.name
          }, null, 8, ["profile"])) : g("", !0)
        ]),
        _: 1
      }, 8, ["types", "profile", "used"])) : g("", !0)
    ]));
  }
}, De = /* @__PURE__ */ Y(Oe, [["__scopeId", "data-v-6e2e2d84"]]);
export {
  De as default
};
