/* @code-commandments-generated */
if (!document.getElementById("window-styles-f10f3c33cbf8")) { const style = document.createElement("style"); style.id = "window-styles-f10f3c33cbf8"; style.textContent = ".helper-start[data-v-11cb72ba]{display:grid;gap:12px;padding:0 0 20px;margin-bottom:20px;border-bottom:1px solid var(--border-2)}h3[data-v-11cb72ba]{margin:0;font-size:14px;font-weight:600}.field[data-v-11cb72ba]{display:grid;gap:4px}.field>span[data-v-11cb72ba]{color:var(--text-2);font-size:12px;font-weight:500}select[data-v-11cb72ba]{padding:6px 9px;border:1px solid var(--border-2);border-radius:7px;background:var(--bg);color:var(--text);font:inherit}.reason[data-v-11cb72ba],.notice[data-v-11cb72ba]{margin:0;color:var(--text-3);font-size:12px;line-height:1.5;overflow-wrap:anywhere}.idle-helper[data-v-11cb72ba]{display:flex;align-items:center;justify-content:space-between;gap:12px}.profile-panel[data-v-ac3e3396]{display:flex;flex-direction:column;gap:14px}.profile-panel-note[data-v-ac3e3396]{margin:0;color:var(--text-3);font-size:12.5px}.profile-panel-check[data-v-ac3e3396]{display:flex;gap:8px;align-items:center;font-size:13px}.profile-panel-grow[data-v-ac3e3396]{flex:1}.profiles[data-v-6686c589]{padding:0 0 40px}.bar[data-v-6686c589]{flex-wrap:wrap;gap:8px 12px;color:var(--text-2)}.count[data-v-6686c589]{margin-left:auto;color:var(--text-3);font-size:12.5px}.notice[data-v-6686c589]{font-size:12px;color:var(--text-2)}.notice.failed[data-v-6686c589]{color:var(--danger)}.empty[data-v-6686c589]{margin:40px auto;max-width:480px}.rows[data-v-6686c589]{display:flex;flex-direction:column;padding:8px 14px 0 22px}.profile-open[data-v-6686c589]{text-align:left}.profile-meta[data-v-6686c589]{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:12px}.profile-model[data-v-6686c589]{color:var(--text-2)}.profile-used[data-v-6686c589]{color:var(--text-3);white-space:nowrap}.profile-warning[data-v-6686c589]{color:var(--tone-warn)}.profile-used.never[data-v-6686c589]{color:var(--text-4)}@media(max-width:640px){.profiles-find[data-v-6686c589]{flex:1 1 100%}.profile-meta[data-v-6686c589]{display:none}}\n"; document.head.appendChild(style); }
import { ref as b, computed as h, watch as H, openBlock as s, createElementBlock as m, withModifiers as ae, createElementVNode as c, createVNode as r, unref as t, withDirectives as Q, Fragment as O, renderList as D, toDisplayString as y, vModelSelect as oe, withCtx as u, createTextVNode as P, createCommentVNode as g, createBlock as $, renderSlot as se, vModelCheckbox as ne, normalizeClass as re } from "vue";
import { useWindow as X, TextArea as z, Btn as B, TextInput as U, SidePanel as ie, FormField as I, Segmented as F, ModelPicker as Y, DiffCard as ue, matchesSearch as de, SearchBar as pe, EmptyState as G, ListRow as ve, ago as fe } from "@journal/window-kit";
const J = (f, W) => {
  const d = f.__vccOpts || f;
  for (const [k, p] of W)
    d[k] = p;
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
}, xe = {
  __name: "HelperStartForm",
  props: { profile: { type: String, required: !0 } },
  setup(f) {
    const W = f, d = X(), k = { can_start: !1, reason: "", programs: [], idle_helpers: [], can_start_fresh: !1, fresh_reason: "" }, p = b(k), S = b(""), _ = b(""), j = b(""), a = b(""), w = b(!1), A = b(!0);
    let R = 0;
    const T = h(() => !w.value && !A.value && !!S.value.trim()), x = h(() => !T.value || !(p.value.can_start || p.value.can_start_fresh && a.value.trim()));
    async function C() {
      const n = ++R;
      if (A.value = !0, d.state["availability.profile"] = W.profile, _.value ? d.state["availability.program"] = _.value : delete d.state["availability.program"], await d.reload("availability"), n !== R) return;
      const e = d.props.availability;
      e.failure.value ? (p.value = k, j.value = e.failure.value) : p.value = e.data.value, A.value = !1;
    }
    async function L() {
      x.value || await M(["helper", "start", W.profile, "--brief", S.value, ..._.value ? ["--program", _.value] : [], ...a.value.trim() ? ["--fresh", a.value.trim()] : []], "The helper is starting.");
    }
    async function V(n) {
      T.value && await M(["helper", "send", String(n), S.value], "Job sent.");
    }
    async function M(n, e) {
      w.value = !0;
      try {
        const l = await d.run(n);
        j.value = l.ok ? e : l.error, l.ok && (S.value = "", a.value = ""), await C();
      } finally {
        w.value = !1;
      }
    }
    return H([() => W.profile, _], C, { immediate: !0 }), (n, e) => (s(), m("form", {
      class: "helper-start",
      "data-helper-start": "",
      onSubmit: ae(L, ["prevent"])
    }, [
      e[9] || (e[9] = c("h3", null, "Give a helper a job", -1)),
      c("label", me, [
        e[3] || (e[3] = c("span", null, "The job", -1)),
        r(t(z), {
          value: S.value,
          rows: "3",
          disabled: w.value,
          "data-helper-brief": "",
          onInput: e[0] || (e[0] = (l) => S.value = l.target.value)
        }, null, 8, ["value", "disabled"])
      ]),
      c("label", ce, [
        e[5] || (e[5] = c("span", null, "Program", -1)),
        Q(c("select", {
          "onUpdate:modelValue": e[1] || (e[1] = (l) => _.value = l),
          disabled: w.value,
          "data-helper-program": ""
        }, [
          e[4] || (e[4] = c("option", { value: "" }, "The profile's program", -1)),
          (s(!0), m(O, null, D(p.value.programs, (l) => (s(), m("option", {
            key: l,
            value: l
          }, y(l), 9, ge))), 128))
        ], 8, ye), [
          [oe, _.value]
        ])
      ]),
      (s(!0), m(O, null, D(p.value.idle_helpers, (l) => (s(), m("div", {
        key: l.id,
        class: "idle-helper",
        "data-helper-idle": l.id
      }, [
        c("span", null, y(l.name) + " · Idle", 1),
        r(t(B), {
          type: "button",
          disabled: !T.value,
          "data-helper-send": l.id,
          onClick: (N) => V(l.id)
        }, {
          default: u(() => [...e[6] || (e[6] = [
            P("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled", "data-helper-send", "onClick"])
      ], 8, he))), 128)),
      p.value.idle_helpers.length ? (s(), m("label", be, [
        e[7] || (e[7] = c("span", null, "Why start another helper?", -1)),
        r(t(U), {
          modelValue: a.value,
          "onUpdate:modelValue": e[2] || (e[2] = (l) => a.value = l),
          disabled: w.value,
          "data-helper-fresh-reason": ""
        }, null, 8, ["modelValue", "disabled"])
      ])) : g("", !0),
      r(t(B), {
        type: "submit",
        disabled: x.value,
        "data-helper-start-button": ""
      }, {
        default: u(() => [...e[8] || (e[8] = [
          P("Start a helper", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      p.value.fresh_reason ? (s(), m("p", ke, y(p.value.fresh_reason), 1)) : g("", !0),
      p.value.reason && p.value.reason !== p.value.fresh_reason ? (s(), m("p", _e, y(p.value.reason), 1)) : g("", !0),
      j.value ? (s(), m("p", we, y(j.value), 1)) : g("", !0)
    ], 32));
  }
}, Ce = /* @__PURE__ */ J(xe, [["__scopeId", "data-v-11cb72ba"]]), $e = {
  class: "profile-panel",
  "data-profile-panel": ""
}, Se = { key: 0 }, Te = {
  key: 0,
  "data-profile-type-locked": ""
}, Ie = { class: "profile-panel-check" }, Pe = {
  key: 4,
  class: "profile-panel-note"
}, K = "writing", je = {
  __name: "ProfilePanel",
  props: { profile: { type: Object, required: !0 }, used: { type: String, default: "" }, types: { type: Array, default: () => [] } },
  emits: ["close", "save", "reset"],
  setup(f, { emit: W }) {
    const d = f, k = W, p = [{ key: "always", label: "Always this program" }, { key: "possible", label: "This program if possible" }], S = [{ key: "", label: "The parent's program" }, { key: "claude", label: "Claude Code" }, { key: "codex", label: "Codex" }], _ = h(() => d.types.map((n) => ({ key: n.key, label: n.label }))), j = ["title", "description", "agent_type", "access", "program", "program_if_possible", "independent", "mcp_tools", "model", "codex_model", "body"], a = b({});
    H(
      () => d.profile.name,
      () => {
        a.value = { name: d.profile.name, ...Object.fromEntries(j.map((n) => [n, d.profile[n]])), mcp_tools: d.profile.mcp_tools.join(",") };
      },
      { immediate: !0 }
    );
    const w = h(() => d.types.find((n) => n.key === a.value.agent_type)), A = h(() => {
      var n;
      return ((n = w.value) == null ? void 0 : n.access) === K;
    }), R = h(() => [{ key: "read-only", label: "Read-only" }, ...A.value ? [{ key: K, label: "Writing" }] : []]);
    H(A, (n) => {
      n || (a.value.access = "read-only");
    });
    const T = b(!1), x = (n, e, l) => e.map((N, q) => ({ line_type: n, line: q + 1, text: N })).filter((N) => !l.includes(N.text)), C = h(() => {
      const n = d.profile.body.split(`
`), e = (d.profile.module_body || "").split(`
`);
      return [...x("del", n, e), ...x("add", e, n)];
    }), L = h(() => ({ ...d.profile, mcp_tools: d.profile.mcp_tools.join(",") })), V = h(() => j.some((n) => a.value[n] !== L.value[n]) || !d.profile.name), M = h(() => V.value && /^[a-z0-9_-]+$/i.test(a.value.name || "") && a.value.description.trim());
    return (n, e) => (s(), $(t(ie), {
      title: f.profile.title || f.profile.name || "New profile",
      abstract: f.profile.name ? f.used : "Instructions, type and model for an agent",
      onClose: e[16] || (e[16] = (l) => k("close"))
    }, {
      foot: u(() => [
        f.profile.changed.length || f.profile.problem ? (s(), $(t(B), {
          key: 0,
          variant: "ghost",
          small: "",
          "data-profile-reset": "",
          onClick: e[13] || (e[13] = (l) => k("reset", f.profile))
        }, {
          default: u(() => [...e[20] || (e[20] = [
            P("Use the journal's version", -1)
          ])]),
          _: 1
        })) : g("", !0),
        e[23] || (e[23] = c("span", { class: "profile-panel-grow" }, null, -1)),
        r(t(B), {
          variant: "ghost",
          small: "",
          "data-profile-cancel": "",
          onClick: e[14] || (e[14] = (l) => k("close"))
        }, {
          default: u(() => [...e[21] || (e[21] = [
            P("Cancel", -1)
          ])]),
          _: 1
        }),
        r(t(B), {
          variant: "primary",
          small: "",
          disabled: !M.value,
          "data-profile-save": "",
          onClick: e[15] || (e[15] = (l) => k("save", f.profile, a.value))
        }, {
          default: u(() => [...e[22] || (e[22] = [
            P("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: u(() => [
        se(n.$slots, "default", {}, void 0, !0),
        c("div", $e, [
          f.profile.title ? (s(), m("small", Se, y(f.profile.name), 1)) : g("", !0),
          f.profile.name ? g("", !0) : (s(), $(t(I), {
            key: 1,
            label: "Name",
            for: "profile-name",
            help: "Letters, digits and dashes; the agent starts it by this name."
          }, {
            default: u(() => [
              r(t(U), {
                id: "profile-name",
                value: a.value.name,
                placeholder: "critic",
                onInput: e[0] || (e[0] = (l) => a.value.name = l.target.value.trim())
              }, null, 8, ["value"])
            ]),
            _: 1
          })),
          r(t(I), {
            label: "Title",
            for: "profile-title"
          }, {
            default: u(() => [
              r(t(U), {
                id: "profile-title",
                value: a.value.title,
                onInput: e[1] || (e[1] = (l) => a.value.title = l.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          r(t(I), {
            label: "When it is used",
            for: "profile-description",
            help: "The agent reads this to decide when to start it."
          }, {
            default: u(() => [
              r(t(z), {
                id: "profile-description",
                rows: "3",
                value: a.value.description,
                onInput: e[2] || (e[2] = (l) => a.value.description = l.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          r(t(I), {
            label: "Type",
            for: "profile-type",
            help: "The type of agent that runs this profile."
          }, {
            default: u(() => {
              var l;
              return [
                f.profile.shipped ? (s(), m("span", Te, y((l = w.value) == null ? void 0 : l.label), 1)) : (s(), $(t(F), {
                  key: 1,
                  "data-profile-type": "",
                  options: _.value,
                  value: a.value.agent_type,
                  onPick: e[3] || (e[3] = (N) => a.value.agent_type = N)
                }, null, 8, ["options", "value"]))
              ];
            }),
            _: 1
          }),
          r(t(I), {
            label: "Access",
            for: "profile-access",
            help: "Whether it may change files."
          }, {
            default: u(() => [
              r(t(F), {
                "data-profile-access": "",
                options: R.value,
                value: a.value.access,
                onPick: e[4] || (e[4] = (l) => a.value.access = l)
              }, null, 8, ["options", "value"])
            ]),
            _: 1
          }),
          r(t(I), {
            label: "Program",
            for: "profile-program",
            help: "Claude Code or Codex, or the same program as the agent that starts it."
          }, {
            default: u(() => [
              r(t(F), {
                options: S,
                value: a.value.program,
                onPick: e[5] || (e[5] = (l) => a.value.program = l)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          a.value.program ? (s(), $(t(I), {
            key: 2,
            label: "When it cannot start",
            for: "profile-program-choice",
            help: "If possible: a start uses the other program, on its model, when this one is not installed or not ready, and says so."
          }, {
            default: u(() => [
              r(t(F), {
                "data-profile-program-choice": "",
                options: p,
                value: a.value.program_if_possible ? "possible" : "always",
                onPick: e[6] || (e[6] = (l) => a.value.program_if_possible = l === "possible")
              }, null, 8, ["value"])
            ]),
            _: 1
          })) : g("", !0),
          r(t(I), {
            label: "Model on Claude Code",
            for: "profile-model",
            help: "The least expensive model that reliably fits the work."
          }, {
            default: u(() => [
              r(t(Y), {
                provider: "claude",
                inherits: "",
                value: a.value.model,
                "data-profile-model": "claude",
                onPick: e[7] || (e[7] = (l) => a.value.model = l)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          r(t(I), {
            label: "Model on Codex",
            for: "profile-codex-model",
            help: "The model it runs on when the agent is Codex."
          }, {
            default: u(() => [
              r(t(Y), {
                provider: "codex",
                inherits: "",
                value: a.value.codex_model,
                "data-profile-model": "codex",
                onPick: e[8] || (e[8] = (l) => a.value.codex_model = l)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          r(t(I), {
            label: "Instructions",
            for: "profile-body",
            help: "What it is told each time it starts, after the brief."
          }, {
            default: u(() => [
              r(t(z), {
                id: "profile-body",
                rows: "16",
                value: a.value.body,
                onInput: e[9] || (e[9] = (l) => a.value.body = l.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          r(t(I), {
            label: "MCP tools this profile may call",
            for: "profile-mcp",
            help: "Separate the names with commas."
          }, {
            default: u(() => [
              r(t(U), {
                id: "profile-mcp",
                value: a.value.mcp_tools,
                onInput: e[10] || (e[10] = (l) => a.value.mcp_tools = l.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          c("label", Ie, [
            Q(c("input", {
              "onUpdate:modelValue": e[11] || (e[11] = (l) => a.value.independent = l),
              type: "checkbox",
              "data-profile-independent": ""
            }, null, 512), [
              [ne, a.value.independent]
            ]),
            e[17] || (e[17] = P(" Must judge fresh", -1))
          ]),
          f.profile.module_text_changed ? (s(), m(O, { key: 3 }, [
            e[19] || (e[19] = c("p", { class: "profile-panel-note" }, "Text changed: the journal's instructions have a new version.", -1)),
            r(t(B), {
              variant: "ghost",
              small: "",
              "data-profile-compare": "",
              onClick: e[12] || (e[12] = (l) => T.value = !T.value)
            }, {
              default: u(() => [...e[18] || (e[18] = [
                P("Compare", -1)
              ])]),
              _: 1
            }),
            T.value ? (s(), $(t(ue), {
              key: 0,
              path: "Instructions",
              change: "edit",
              added: C.value.filter((l) => l.line_type === "add").length,
              removed: C.value.filter((l) => l.line_type === "del").length,
              at: "",
              rows: C.value,
              "data-profile-diff": ""
            }, null, 8, ["added", "removed", "rows"])) : g("", !0)
          ], 64)) : g("", !0),
          f.profile.shipped ? (s(), m("p", Pe, "This comes with the journal. Your changes are kept through updates.")) : g("", !0)
        ])
      ]),
      _: 3
    }, 8, ["title", "abstract"]));
  }
}, Re = /* @__PURE__ */ J(je, [["__scopeId", "data-v-ac3e3396"]]), Ve = {
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
}, Be = {
  key: 3,
  class: "rows"
}, Ee = { class: "profile-meta" }, Le = {
  key: 0,
  class: "profile-model"
}, Me = { class: "profile-model" }, Oe = {
  __name: "ProfileRows",
  setup(f) {
    const W = { name: "", title: "", description: "", agent_type: "helper", access: "read-only", program: "", independent: !1, mcp_tools: [], changed: [], notes: [], problem: "", model: "sonnet", codex_model: "gpt-6.1-sol", body: "", shipped: !1, uses: 0 }, d = { "read-only": "Read-only", writing: "Writing" }, k = X(), { rows: p, listing: S, failure: _, loaded: j, act: a, actionFailure: w } = k.props.profiles, A = h(() => S.value ? S.value.types : []), R = b(""), T = b(""), x = b(""), C = b(!1), L = h(() => {
      const o = T.value.toLowerCase().split(/\s+/).filter(Boolean);
      return p.value.filter((i) => o.every((v) => {
        var E;
        return de(i, v, (E = k.search) == null ? void 0 : E.fields);
      }));
    }), V = h(() => C.value ? W : p.value.find((o) => o.name === R.value) || null), M = (o) => {
      var i;
      return ((i = A.value.find((v) => v.key === o.agent_type)) == null ? void 0 : i.label) || o.agent_type;
    }, n = (o) => o.shipped ? "Comes with the journal" : o.module, e = (o) => [`Type: ${M(o)}`, `Access: ${d[o.access]}`, `${o.model || "chosen at start"} on Claude`, `${o.codex_model || "chosen at start"} on Codex`, o.changed.length ? "Changed" : "", n(o)].filter(Boolean).join(" · "), l = (o) => [o.problem, o.module_text_changed ? "Text changed: the journal's instructions have a new version" : "", ...o.notes].filter(Boolean), N = (o) => o.uses ? `Uses: ${o.uses} ${o.uses === 1 ? "time" : "times"}, last ${fe(new Date(o.last_used * 1e3).toISOString())}` : "Uses: none";
    function q() {
      C.value = !0, R.value = "";
    }
    function Z(o) {
      C.value = !1, R.value = o.name;
    }
    function ee() {
      C.value = !1, R.value = "";
    }
    async function le(o) {
      x.value = "", (await a(["profile", "reset", o.name])).ok && (x.value = `${o.name} is back to the journal's version.`);
    }
    async function te(o, i) {
      x.value = "";
      const v = o.name || i.name;
      (await a(["profile", "save", v, ...i.title ? ["--title", i.title] : [], "--description", i.description, "--type", i.agent_type, "--access", i.access, "--program", i.program, i.program_if_possible ? "--program-if-possible" : "--no-program-if-possible", "--model", i.model, "--codex-model", i.codex_model, "--mcp-tools", i.mcp_tools, i.independent ? "--independent" : "--no-independent", "--body", i.body])).ok && (C.value = !1, R.value = v, x.value = `${v} saved. The agent will use it the next time it starts a helper with this profile.`);
    }
    return (o, i) => (s(), m("section", Ve, [
      r(t(pe), {
        modelValue: T.value,
        "onUpdate:modelValue": i[0] || (i[0] = (v) => T.value = v),
        class: "bar",
        "data-profile-find": ""
      }, {
        default: u(() => [
          r(t(B), {
            variant: "ghost",
            small: "",
            "data-profile-new": "",
            onClick: q
          }, {
            default: u(() => [...i[1] || (i[1] = [
              P("New profile", -1)
            ])]),
            _: 1
          }),
          c("span", We, y(t(p).length) + " " + y(t(p).length === 1 ? "profile" : "profiles"), 1),
          x.value ? (s(), m("span", Ae, y(x.value), 1)) : g("", !0),
          t(w) ? (s(), m("span", Ne, y(t(w)), 1)) : g("", !0)
        ]),
        _: 1
      }, 8, ["modelValue"]),
      t(_) ? (s(), $(t(G), {
        key: 0,
        class: "empty",
        title: "The profiles could not be read"
      }, {
        default: u(() => [
          P(y(t(_)), 1)
        ]),
        _: 1
      })) : !t(j) || !t(p).length ? (s(), $(t(G), {
        key: 1,
        class: "empty",
        loading: !t(j),
        title: "No profiles yet"
      }, {
        default: u(() => [...i[2] || (i[2] = [
          P(" A profile gives an agent its instructions, type and model. The journal includes standard profiles. ", -1)
        ])]),
        _: 1
      }, 8, ["loading"])) : L.value.length ? (s(), m("div", Be, [
        (s(!0), m(O, null, D(L.value, (v) => (s(), $(t(B), {
          key: v.name,
          variant: "text",
          fill: "",
          class: "profile-open",
          "aria-label": `Open ${v.name}`,
          "data-profile": v.name,
          onClick: (E) => Z(v)
        }, {
          default: u(() => [
            r(t(ve), {
              title: v.title || v.name,
              text: v.description
            }, {
              end: u(() => [
                c("span", Ee, [
                  v.title ? (s(), m("span", Le, y(v.name), 1)) : g("", !0),
                  c("span", Me, y(e(v)), 1),
                  (s(!0), m(O, null, D(l(v), (E) => (s(), m("span", {
                    key: E,
                    class: "profile-warning",
                    "data-profile-warning": ""
                  }, y(E), 1))), 128)),
                  c("span", {
                    class: re(["profile-used", { never: !v.uses }])
                  }, y(N(v)), 3)
                ])
              ]),
              _: 2
            }, 1032, ["title", "text"])
          ]),
          _: 2
        }, 1032, ["aria-label", "data-profile", "onClick"]))), 128))
      ])) : (s(), $(t(G), {
        key: 2,
        class: "empty",
        title: "No profile matches"
      }, {
        default: u(() => [...i[3] || (i[3] = [
          P("Try other words.", -1)
        ])]),
        _: 1
      })),
      V.value ? (s(), $(Re, {
        key: 4,
        types: A.value,
        profile: V.value,
        used: N(V.value),
        onClose: ee,
        onSave: te,
        onReset: le
      }, {
        default: u(() => [
          V.value.name && V.value.agent_type === "helper" ? (s(), $(Ce, {
            key: 0,
            profile: V.value.name
          }, null, 8, ["profile"])) : g("", !0)
        ]),
        _: 1
      }, 8, ["types", "profile", "used"])) : g("", !0)
    ]));
  }
}, De = /* @__PURE__ */ J(Oe, [["__scopeId", "data-v-6686c589"]]);
export {
  De as default
};
