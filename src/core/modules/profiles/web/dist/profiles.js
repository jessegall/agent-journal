/* @code-commandments-generated */
if (!document.getElementById("window-styles-7e3d235eb579")) { const style = document.createElement("style"); style.id = "window-styles-7e3d235eb579"; style.textContent = ".helper-start[data-v-aca41abb]{display:grid;gap:12px;padding:0 0 20px;margin-bottom:20px;border-bottom:1px solid var(--border-2)}h3[data-v-aca41abb]{margin:0;font-size:14px;font-weight:600}.field[data-v-aca41abb]{display:grid;gap:4px}.field>span[data-v-aca41abb]{color:var(--text-2);font-size:12px;font-weight:500}select[data-v-aca41abb]{padding:6px 9px;border:1px solid var(--border-2);border-radius:7px;background:var(--bg);color:var(--text);font:inherit}.reason[data-v-aca41abb],.notice[data-v-aca41abb]{margin:0;color:var(--text-3);font-size:12px;line-height:1.5;overflow-wrap:anywhere}.idle-helper[data-v-aca41abb]{display:flex;align-items:center;justify-content:space-between;gap:12px}.profile-panel[data-v-70b7fb65]{display:flex;flex-direction:column;gap:14px}.profile-panel-note[data-v-70b7fb65]{margin:0;color:var(--text-3);font-size:12.5px}.profile-panel-check[data-v-70b7fb65]{display:flex;gap:8px;align-items:center;font-size:13px}.profile-panel-grow[data-v-70b7fb65]{flex:1}.profiles[data-v-a1a03008]{padding:0 0 40px}.bar[data-v-a1a03008]{flex-wrap:wrap;gap:8px 12px;color:var(--text-2)}.count[data-v-a1a03008]{margin-left:auto;color:var(--text-3);font-size:12.5px}.notice[data-v-a1a03008]{font-size:12px;color:var(--text-2)}.notice.failed[data-v-a1a03008]{color:var(--danger)}.empty[data-v-a1a03008]{margin:40px auto;max-width:480px}.rows[data-v-a1a03008]{display:flex;flex-direction:column;padding:8px 14px 0 22px}.profile-open[data-v-a1a03008]{text-align:left}.profile-meta[data-v-a1a03008]{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:12px}.profile-model[data-v-a1a03008]{color:var(--text-2)}.profile-used[data-v-a1a03008]{color:var(--text-3);white-space:nowrap}.profile-warning[data-v-a1a03008]{color:var(--tone-warn)}.profile-used.never[data-v-a1a03008]{color:var(--text-4)}@media(max-width:640px){.profiles-find[data-v-a1a03008]{flex:1 1 100%}.profile-meta[data-v-a1a03008]{display:none}}\n"; document.head.appendChild(style); }
import { ref as x, computed as _, watch as G, openBlock as n, createElementBlock as c, withModifiers as ae, createElementVNode as y, createVNode as s, unref as l, withDirectives as K, Fragment as F, renderList as U, toDisplayString as g, vModelSelect as oe, withCtx as d, createTextVNode as P, createCommentVNode as h, createBlock as I, renderSlot as ne, vModelCheckbox as se, normalizeClass as re } from "vue";
import { useWindow as Q, TextArea as z, Btn as B, TextInput as O, SidePanel as ie, FormField as N, Segmented as D, ModelPicker as J, DiffCard as ue, matchesSearch as de, SearchBar as pe, EmptyState as q, ListRow as ve, ago as fe } from "@journal/window-kit";
const H = (m, W) => {
  const p = m.__vccOpts || m;
  for (const [C, v] of W)
    p[C] = v;
  return p;
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
}, xe = {
  key: 3,
  class: "notice"
}, Ce = {
  __name: "HelperStartForm",
  props: { profile: { type: String, required: !0 } },
  setup(m) {
    const W = m, p = Q(), C = { can_start: !1, reason: "", programs: [], idle_helpers: [], can_start_fresh: !1, fresh_reason: "" }, v = x(C), T = x(""), b = x(""), a = x(""), w = x(""), $ = x(!1), A = x(!0);
    let S = 0;
    const j = _(() => !$.value && !A.value && !!T.value.trim()), k = _(() => !j.value || !(v.value.can_start || v.value.can_start_fresh && w.value.trim()));
    async function R() {
      const t = ++S;
      if (A.value = !0, p.state["availability.profile"] = W.profile, b.value ? p.state["availability.program"] = b.value : delete p.state["availability.program"], await p.reload("availability"), t !== S) return;
      const e = p.props.availability;
      e.failure.value ? (v.value = C, a.value = e.failure.value) : v.value = e.data.value, A.value = !1;
    }
    async function E() {
      k.value || await r(["helper", "start", W.profile, "--brief", T.value, ...b.value ? ["--program", b.value] : [], ...w.value.trim() ? ["--fresh", w.value.trim()] : []], "The helper is starting.");
    }
    async function V(t) {
      j.value && await r(["helper", "send", String(t), T.value], "Job sent.");
    }
    async function r(t, e) {
      $.value = !0;
      try {
        const i = await p.run(t);
        a.value = i.ok ? e : i.error, i.ok && (T.value = "", w.value = ""), await R();
      } finally {
        $.value = !1;
      }
    }
    return G([() => W.profile, b], R, { immediate: !0 }), (t, e) => (n(), c("form", {
      class: "helper-start",
      "data-helper-start": "",
      onSubmit: ae(E, ["prevent"])
    }, [
      e[9] || (e[9] = y("h3", null, "Give a helper a job", -1)),
      y("label", me, [
        e[3] || (e[3] = y("span", null, "The job", -1)),
        s(l(z), {
          value: T.value,
          rows: "3",
          disabled: $.value,
          "data-helper-brief": "",
          onInput: e[0] || (e[0] = (i) => T.value = i.target.value)
        }, null, 8, ["value", "disabled"])
      ]),
      y("label", ce, [
        e[5] || (e[5] = y("span", null, "Program", -1)),
        K(y("select", {
          "onUpdate:modelValue": e[1] || (e[1] = (i) => b.value = i),
          disabled: $.value,
          "data-helper-program": ""
        }, [
          e[4] || (e[4] = y("option", { value: "" }, "The profile's program", -1)),
          (n(!0), c(F, null, U(v.value.programs, (i) => (n(), c("option", {
            key: i,
            value: i
          }, g(i), 9, ge))), 128))
        ], 8, ye), [
          [oe, b.value]
        ])
      ]),
      (n(!0), c(F, null, U(v.value.idle_helpers, (i) => (n(), c("div", {
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
      ], 8, he))), 128)),
      v.value.idle_helpers.length ? (n(), c("label", be, [
        e[7] || (e[7] = y("span", null, "Why start another helper?", -1)),
        s(l(O), {
          modelValue: w.value,
          "onUpdate:modelValue": e[2] || (e[2] = (i) => w.value = i),
          disabled: $.value,
          "data-helper-fresh-reason": ""
        }, null, 8, ["modelValue", "disabled"])
      ])) : h("", !0),
      s(l(B), {
        type: "submit",
        disabled: k.value,
        "data-helper-start-button": ""
      }, {
        default: d(() => [...e[8] || (e[8] = [
          P("Start a helper", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      v.value.fresh_reason ? (n(), c("p", ke, g(v.value.fresh_reason), 1)) : h("", !0),
      v.value.reason && v.value.reason !== v.value.fresh_reason ? (n(), c("p", _e, g(v.value.reason), 1)) : h("", !0),
      a.value ? (n(), c("p", xe, g(a.value), 1)) : h("", !0)
    ], 32));
  }
}, we = /* @__PURE__ */ H(Ce, [["__scopeId", "data-v-aca41abb"]]), $e = {
  class: "profile-panel",
  "data-profile-panel": ""
}, Se = { key: 0 }, Te = {
  key: 0,
  "data-profile-type-locked": ""
}, Ie = { class: "profile-panel-check" }, Pe = {
  key: 3,
  class: "profile-panel-note"
}, Y = "writing", je = {
  __name: "ProfilePanel",
  props: { profile: { type: Object, required: !0 }, used: { type: String, default: "" }, types: { type: Array, default: () => [] } },
  emits: ["close", "save", "reset"],
  setup(m, { emit: W }) {
    const p = m, C = W, v = [{ key: "", label: "The parent's program" }, { key: "claude", label: "Claude Code" }, { key: "codex", label: "Codex" }], T = _(() => p.types.map((r) => ({ key: r.key, label: r.label }))), b = ["title", "description", "agent_type", "access", "program", "independent", "mcp_tools", "model", "codex_model", "body"], a = x({});
    G(
      () => p.profile.name,
      () => {
        a.value = { name: p.profile.name, ...Object.fromEntries(b.map((r) => [r, p.profile[r]])), mcp_tools: p.profile.mcp_tools.join(",") };
      },
      { immediate: !0 }
    );
    const w = _(() => p.types.find((r) => r.key === a.value.agent_type)), $ = _(() => {
      var r;
      return ((r = w.value) == null ? void 0 : r.access) === Y;
    }), A = _(() => [{ key: "read-only", label: "Read-only" }, ...$.value ? [{ key: Y, label: "Writing" }] : []]);
    G($, (r) => {
      r || (a.value.access = "read-only");
    });
    const S = x(!1), j = (r, t, e) => t.map((i, M) => ({ line_type: r, line: M + 1, text: i })).filter((i) => !e.includes(i.text)), k = _(() => {
      const r = p.profile.body.split(`
`), t = (p.profile.module_body || "").split(`
`);
      return [...j("del", r, t), ...j("add", t, r)];
    }), R = _(() => ({ ...p.profile, mcp_tools: p.profile.mcp_tools.join(",") })), E = _(() => b.some((r) => a.value[r] !== R.value[r]) || !p.profile.name), V = _(() => E.value && /^[a-z0-9_-]+$/i.test(a.value.name || "") && a.value.description.trim());
    return (r, t) => (n(), I(l(ie), {
      title: m.profile.title || m.profile.name || "New profile",
      abstract: m.profile.name ? m.used : "Instructions, type and model for an agent",
      onClose: t[15] || (t[15] = (e) => C("close"))
    }, {
      foot: d(() => [
        m.profile.changed.length || m.profile.problem ? (n(), I(l(B), {
          key: 0,
          variant: "ghost",
          small: "",
          "data-profile-reset": "",
          onClick: t[12] || (t[12] = (e) => C("reset", m.profile))
        }, {
          default: d(() => [...t[19] || (t[19] = [
            P("Use the journal's version", -1)
          ])]),
          _: 1
        })) : h("", !0),
        t[22] || (t[22] = y("span", { class: "profile-panel-grow" }, null, -1)),
        s(l(B), {
          variant: "ghost",
          small: "",
          "data-profile-cancel": "",
          onClick: t[13] || (t[13] = (e) => C("close"))
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
          onClick: t[14] || (t[14] = (e) => C("save", m.profile, a.value))
        }, {
          default: d(() => [...t[21] || (t[21] = [
            P("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: d(() => [
        ne(r.$slots, "default", {}, void 0, !0),
        y("div", $e, [
          m.profile.title ? (n(), c("small", Se, g(m.profile.name), 1)) : h("", !0),
          m.profile.name ? h("", !0) : (n(), I(l(N), {
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
                m.profile.shipped ? (n(), c("span", Te, g((e = w.value) == null ? void 0 : e.label), 1)) : (n(), I(l(D), {
                  key: 1,
                  "data-profile-type": "",
                  options: T.value,
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
                options: v,
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
          y("label", Ie, [
            K(y("input", {
              "onUpdate:modelValue": t[10] || (t[10] = (e) => a.value.independent = e),
              type: "checkbox",
              "data-profile-independent": ""
            }, null, 512), [
              [se, a.value.independent]
            ]),
            t[16] || (t[16] = P(" Must judge fresh", -1))
          ]),
          m.profile.module_text_changed ? (n(), c(F, { key: 2 }, [
            t[18] || (t[18] = y("p", { class: "profile-panel-note" }, "Text changed: the journal's instructions have a new version.", -1)),
            s(l(B), {
              variant: "ghost",
              small: "",
              "data-profile-compare": "",
              onClick: t[11] || (t[11] = (e) => S.value = !S.value)
            }, {
              default: d(() => [...t[17] || (t[17] = [
                P("Compare", -1)
              ])]),
              _: 1
            }),
            S.value ? (n(), I(l(ue), {
              key: 0,
              path: "Instructions",
              change: "edit",
              added: k.value.filter((e) => e.line_type === "add").length,
              removed: k.value.filter((e) => e.line_type === "del").length,
              at: "",
              rows: k.value,
              "data-profile-diff": ""
            }, null, 8, ["added", "removed", "rows"])) : h("", !0)
          ], 64)) : h("", !0),
          m.profile.shipped ? (n(), c("p", Pe, "This comes with the journal. Your changes are kept through updates.")) : h("", !0)
        ])
      ]),
      _: 3
    }, 8, ["title", "abstract"]));
  }
}, Re = /* @__PURE__ */ H(je, [["__scopeId", "data-v-70b7fb65"]]), Ve = {
  class: "profiles",
  "data-profiles": ""
}, Ne = {
  class: "count",
  "data-profile-count": ""
}, We = {
  key: 0,
  class: "notice",
  "data-profile-notice": ""
}, Ae = {
  key: 1,
  class: "notice failed",
  role: "alert",
  "data-profile-failure": ""
}, Be = {
  key: 3,
  class: "rows"
}, Le = { class: "profile-meta" }, Ee = {
  key: 0,
  class: "profile-model"
}, Me = { class: "profile-model" }, Fe = {
  __name: "ProfileRows",
  setup(m) {
    const W = { name: "", title: "", description: "", agent_type: "helper", access: "read-only", program: "", independent: !1, mcp_tools: [], changed: [], notes: [], problem: "", model: "sonnet", codex_model: "gpt-6.1-sol", body: "", shipped: !1, uses: 0 }, p = { "read-only": "Read-only", writing: "Writing" }, C = Q(), { rows: v, listing: T, failure: b, loaded: a, act: w, actionFailure: $ } = C.props.profiles, A = _(() => T.value ? T.value.types : []), S = x(""), j = x(""), k = x(""), R = x(!1), E = _(() => {
      const o = j.value.toLowerCase().split(/\s+/).filter(Boolean);
      return v.value.filter((u) => o.every((f) => {
        var L;
        return de(u, f, (L = C.search) == null ? void 0 : L.fields);
      }));
    }), V = _(() => R.value ? W : v.value.find((o) => o.name === S.value) || null), r = (o) => {
      var u;
      return ((u = A.value.find((f) => f.key === o.agent_type)) == null ? void 0 : u.label) || o.agent_type;
    }, t = (o) => o.shipped ? "Comes with the journal" : o.module, e = (o) => [`Type: ${r(o)}`, `Access: ${p[o.access]}`, `${o.model || "chosen at start"} on Claude`, `${o.codex_model || "chosen at start"} on Codex`, o.changed.length ? "Changed" : "", t(o)].filter(Boolean).join(" · "), i = (o) => [o.problem, o.module_text_changed ? "Text changed: the journal's instructions have a new version" : "", ...o.notes].filter(Boolean), M = (o) => o.uses ? `Uses: ${o.uses} ${o.uses === 1 ? "time" : "times"}, last ${fe(new Date(o.last_used * 1e3).toISOString())}` : "Uses: none";
    function X() {
      R.value = !0, S.value = "";
    }
    function Z(o) {
      R.value = !1, S.value = o.name;
    }
    function ee() {
      R.value = !1, S.value = "";
    }
    async function te(o) {
      k.value = "", (await w(["profile", "reset", o.name])).ok && (k.value = `${o.name} is back to the journal's version.`);
    }
    async function le(o, u) {
      k.value = "";
      const f = o.name || u.name;
      (await w(["profile", "save", f, ...u.title ? ["--title", u.title] : [], "--description", u.description, "--type", u.agent_type, "--access", u.access, "--program", u.program, "--model", u.model, "--codex-model", u.codex_model, "--mcp-tools", u.mcp_tools, u.independent ? "--independent" : "--no-independent", "--body", u.body])).ok && (R.value = !1, S.value = f, k.value = `${f} saved. The agent will use it the next time it starts a helper with this profile.`);
    }
    return (o, u) => (n(), c("section", Ve, [
      s(l(pe), {
        modelValue: j.value,
        "onUpdate:modelValue": u[0] || (u[0] = (f) => j.value = f),
        class: "bar",
        "data-profile-find": ""
      }, {
        default: d(() => [
          s(l(B), {
            variant: "ghost",
            small: "",
            "data-profile-new": "",
            onClick: X
          }, {
            default: d(() => [...u[1] || (u[1] = [
              P("New profile", -1)
            ])]),
            _: 1
          }),
          y("span", Ne, g(l(v).length) + " " + g(l(v).length === 1 ? "profile" : "profiles"), 1),
          k.value ? (n(), c("span", We, g(k.value), 1)) : h("", !0),
          l($) ? (n(), c("span", Ae, g(l($)), 1)) : h("", !0)
        ]),
        _: 1
      }, 8, ["modelValue"]),
      l(b) ? (n(), I(l(q), {
        key: 0,
        class: "empty",
        title: "The profiles could not be read"
      }, {
        default: d(() => [
          P(g(l(b)), 1)
        ]),
        _: 1
      })) : !l(a) || !l(v).length ? (n(), I(l(q), {
        key: 1,
        class: "empty",
        loading: !l(a),
        title: "No profiles yet"
      }, {
        default: d(() => [...u[2] || (u[2] = [
          P(" A profile gives an agent its instructions, type and model. The journal includes standard profiles. ", -1)
        ])]),
        _: 1
      }, 8, ["loading"])) : E.value.length ? (n(), c("div", Be, [
        (n(!0), c(F, null, U(E.value, (f) => (n(), I(l(B), {
          key: f.name,
          variant: "text",
          fill: "",
          class: "profile-open",
          "aria-label": `Open ${f.name}`,
          "data-profile": f.name,
          onClick: (L) => Z(f)
        }, {
          default: d(() => [
            s(l(ve), {
              title: f.title || f.name,
              text: f.description
            }, {
              end: d(() => [
                y("span", Le, [
                  f.title ? (n(), c("span", Ee, g(f.name), 1)) : h("", !0),
                  y("span", Me, g(e(f)), 1),
                  (n(!0), c(F, null, U(i(f), (L) => (n(), c("span", {
                    key: L,
                    class: "profile-warning",
                    "data-profile-warning": ""
                  }, g(L), 1))), 128)),
                  y("span", {
                    class: re(["profile-used", { never: !f.uses }])
                  }, g(M(f)), 3)
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
      V.value ? (n(), I(Re, {
        key: 4,
        types: A.value,
        profile: V.value,
        used: M(V.value),
        onClose: ee,
        onSave: le,
        onReset: te
      }, {
        default: d(() => [
          V.value.name && V.value.agent_type === "helper" ? (n(), I(we, {
            key: 0,
            profile: V.value.name
          }, null, 8, ["profile"])) : h("", !0)
        ]),
        _: 1
      }, 8, ["types", "profile", "used"])) : h("", !0)
    ]));
  }
}, De = /* @__PURE__ */ H(Fe, [["__scopeId", "data-v-a1a03008"]]);
export {
  De as default
};
