/* @code-commandments-generated */
if (!document.getElementById("window-styles-9f9740835ef1")) { const style = document.createElement("style"); style.id = "window-styles-9f9740835ef1"; style.textContent = ".helper-start[data-v-4297a573]{display:grid;gap:12px;padding:0 0 20px;margin-bottom:20px;border-bottom:1px solid var(--border-2)}h3[data-v-4297a573]{margin:0;font-size:14px;font-weight:600}.field[data-v-4297a573]{display:grid;gap:4px}.field>span[data-v-4297a573]{color:var(--text-2);font-size:12px;font-weight:500}select[data-v-4297a573]{padding:6px 9px;border:1px solid var(--border-2);border-radius:7px;background:var(--bg);color:var(--text);font:inherit}.reason[data-v-4297a573],.notice[data-v-4297a573]{margin:0;color:var(--text-3);font-size:12px;line-height:1.5;overflow-wrap:anywhere}.idle-helper[data-v-4297a573]{display:flex;align-items:center;justify-content:space-between;gap:12px}.profile-panel[data-v-4db0ab71]{display:flex;flex-direction:column;gap:14px}.profile-panel-note[data-v-4db0ab71]{margin:0;color:var(--text-3);font-size:12.5px}.profile-panel-check[data-v-4db0ab71]{display:flex;gap:8px;align-items:center;font-size:13px}.profile-panel-grow[data-v-4db0ab71]{flex:1}.profiles[data-v-813a8fcb]{padding:0 0 40px}.bar[data-v-813a8fcb]{flex-wrap:wrap;gap:8px 12px;color:var(--text-2)}.count[data-v-813a8fcb]{margin-left:auto;color:var(--text-3);font-size:12.5px}.notice[data-v-813a8fcb]{font-size:12px;color:var(--text-2)}.notice.failed[data-v-813a8fcb]{color:var(--danger)}.empty[data-v-813a8fcb]{margin:40px auto;max-width:480px}.rows[data-v-813a8fcb]{display:flex;flex-direction:column;padding:8px 14px 0 22px}.profile-open[data-v-813a8fcb]{text-align:left}.profile-meta[data-v-813a8fcb]{display:flex;flex-direction:column;align-items:flex-end;gap:2px;font-size:12px}.profile-model[data-v-813a8fcb]{color:var(--text-2)}.profile-used[data-v-813a8fcb]{color:var(--text-3);white-space:nowrap}.profile-warning[data-v-813a8fcb]{color:var(--tone-warn)}.profile-used.never[data-v-813a8fcb]{color:var(--text-4)}@media(max-width:640px){.profiles-find[data-v-813a8fcb]{flex:1 1 100%}.profile-meta[data-v-813a8fcb]{display:none}}\n"; document.head.appendChild(style); }
import { ref as $, computed as h, watch as H, openBlock as o, createElementBlock as m, withModifiers as oe, createElementVNode as c, createVNode as u, unref as l, withDirectives as Q, Fragment as F, renderList as U, toDisplayString as y, vModelSelect as se, withCtx as p, createTextVNode as j, createCommentVNode as g, createBlock as S, renderSlot as ne, vModelCheckbox as re, normalizeClass as ie } from "vue";
import { useWindow as X, TextArea as J, Btn as O, TextInput as D, SidePanel as ue, FormField as N, Segmented as q, ModelPicker as pe, DiffCard as de, matchesSearch as fe, SearchBar as ve, EmptyState as G, ListRow as me, ago as ce } from "@journal/window-kit";
const z = (v, R) => {
  const i = v.__vccOpts || v;
  for (const [b, d] of R)
    i[b] = d;
  return i;
}, ye = { class: "field" }, ge = { class: "field" }, he = ["disabled"], be = ["value"], ke = ["data-helper-idle"], _e = {
  key: 0,
  class: "field"
}, we = {
  key: 1,
  class: "reason",
  "data-helper-fresh-blocked": ""
}, $e = {
  key: 2,
  class: "reason",
  "data-helper-start-reason": ""
}, Se = {
  key: 3,
  class: "notice"
}, Ce = {
  __name: "HelperStartForm",
  props: { profile: { type: String, required: !0 }, programs: { type: Array, required: !0 } },
  setup(v) {
    const R = v, i = X(), b = { can_start: !1, reason: "", programs: [], idle_helpers: [], can_start_fresh: !1, fresh_reason: "" }, d = $(b), x = $(""), C = $(""), A = $(""), a = $(""), T = $(!1), I = $(!0);
    let B = 0;
    const k = h(() => !T.value && !I.value && !!x.value.trim()), V = h(() => !k.value || !(d.value.can_start || d.value.can_start_fresh && a.value.trim()));
    async function _() {
      const s = ++B;
      if (I.value = !0, i.state["availability.profile"] = R.profile, C.value ? i.state["availability.program"] = C.value : delete i.state["availability.program"], await i.reload("availability"), s !== B) return;
      const e = i.props.availability;
      e.failure.value ? (d.value = b, A.value = e.failure.value) : d.value = e.data.value, I.value = !1;
    }
    async function W() {
      V.value || await P(["helper", "start", R.profile, "--brief", x.value, ...C.value ? ["--program", C.value] : [], ...a.value.trim() ? ["--fresh", a.value.trim()] : []], "The helper is starting.");
    }
    async function L(s) {
      k.value && await P(["helper", "send", String(s), x.value], "Job sent.");
    }
    async function P(s, e) {
      T.value = !0;
      try {
        const t = await i.run(s);
        A.value = t.ok ? e : t.error, t.ok && (x.value = "", a.value = ""), await _();
      } finally {
        T.value = !1;
      }
    }
    return H([() => R.profile, C], _, { immediate: !0 }), (s, e) => (o(), m("form", {
      class: "helper-start",
      "data-helper-start": "",
      onSubmit: oe(W, ["prevent"])
    }, [
      e[9] || (e[9] = c("h3", null, "Give a helper a job", -1)),
      c("label", ye, [
        e[3] || (e[3] = c("span", null, "The job", -1)),
        u(l(J), {
          value: x.value,
          rows: "3",
          disabled: T.value,
          "data-helper-brief": "",
          onInput: e[0] || (e[0] = (t) => x.value = t.target.value)
        }, null, 8, ["value", "disabled"])
      ]),
      c("label", ge, [
        e[5] || (e[5] = c("span", null, "Program", -1)),
        Q(c("select", {
          "onUpdate:modelValue": e[1] || (e[1] = (t) => C.value = t),
          disabled: T.value,
          "data-helper-program": ""
        }, [
          e[4] || (e[4] = c("option", { value: "" }, "The profile program", -1)),
          (o(!0), m(F, null, U(d.value.programs, (t) => {
            var w;
            return o(), m("option", {
              key: t,
              value: t
            }, y(((w = v.programs.find((M) => M.name === t)) == null ? void 0 : w.title) || t), 9, be);
          }), 128))
        ], 8, he), [
          [se, C.value]
        ])
      ]),
      (o(!0), m(F, null, U(d.value.idle_helpers, (t) => (o(), m("div", {
        key: t.id,
        class: "idle-helper",
        "data-helper-idle": t.id
      }, [
        c("span", null, y(t.name) + " · Idle", 1),
        u(l(O), {
          type: "button",
          disabled: !k.value,
          "data-helper-send": t.id,
          onClick: (w) => L(t.id)
        }, {
          default: p(() => [...e[6] || (e[6] = [
            j("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled", "data-helper-send", "onClick"])
      ], 8, ke))), 128)),
      d.value.idle_helpers.length ? (o(), m("label", _e, [
        e[7] || (e[7] = c("span", null, "Why start another helper?", -1)),
        u(l(D), {
          modelValue: a.value,
          "onUpdate:modelValue": e[2] || (e[2] = (t) => a.value = t),
          disabled: T.value,
          "data-helper-fresh-reason": ""
        }, null, 8, ["modelValue", "disabled"])
      ])) : g("", !0),
      u(l(O), {
        type: "submit",
        disabled: V.value,
        "data-helper-start-button": ""
      }, {
        default: p(() => [...e[8] || (e[8] = [
          j("Start a helper", -1)
        ])]),
        _: 1
      }, 8, ["disabled"]),
      d.value.fresh_reason ? (o(), m("p", we, y(d.value.fresh_reason), 1)) : g("", !0),
      d.value.reason && d.value.reason !== d.value.fresh_reason ? (o(), m("p", $e, y(d.value.reason), 1)) : g("", !0),
      A.value ? (o(), m("p", Se, y(A.value), 1)) : g("", !0)
    ], 32));
  }
}, Te = /* @__PURE__ */ z(Ce, [["__scopeId", "data-v-4297a573"]]), xe = {
  class: "profile-panel",
  "data-profile-panel": ""
}, Ie = { key: 0 }, Pe = {
  key: 0,
  "data-profile-type-locked": ""
}, je = { class: "profile-panel-check" }, Ae = {
  key: 4,
  class: "profile-panel-note"
}, K = "writing", Ne = {
  __name: "ProfilePanel",
  props: { profile: { type: Object, required: !0 }, used: { type: String, default: "" }, types: { type: Array, default: () => [] }, programs: { type: Array, required: !0 } },
  emits: ["close", "save", "reset"],
  setup(v, { emit: R }) {
    const i = v, b = R, d = [{ key: "always", label: "Always this program" }, { key: "possible", label: "This program if possible" }], x = h(() => [{ key: "", label: "The parent program" }, ...i.programs.map((s) => ({ key: s.name, label: s.title }))]), C = h(() => i.types.map((s) => ({ key: s.key, label: s.label }))), A = ["title", "description", "agent_type", "access", "program", "program_if_possible", "independent", "mcp_tools", "program_models", "body"], a = $({});
    H(
      () => i.profile.name,
      () => {
        a.value = { name: i.profile.name, ...Object.fromEntries(A.map((s) => [s, i.profile[s]])), mcp_tools: i.profile.mcp_tools.join(","), program_models: { ...i.profile.program_models } };
      },
      { immediate: !0 }
    );
    const T = h(() => i.types.find((s) => s.key === a.value.agent_type)), I = h(() => {
      var s;
      return ((s = T.value) == null ? void 0 : s.access) === K;
    }), B = h(() => [{ key: "read-only", label: "Read-only" }, ...I.value ? [{ key: K, label: "Writing" }] : []]);
    H(I, (s) => {
      s || (a.value.access = "read-only");
    });
    const k = $(!1), V = (s, e, t) => e.map((w, M) => ({ line_type: s, line: M + 1, text: w })).filter((w) => !t.includes(w.text)), _ = h(() => {
      const s = i.profile.body.split(`
`), e = (i.profile.module_body || "").split(`
`);
      return [...V("del", s, e), ...V("add", e, s)];
    }), W = h(() => ({ ...i.profile, mcp_tools: i.profile.mcp_tools.join(",") })), L = h(() => A.some((s) => JSON.stringify(a.value[s]) !== JSON.stringify(W.value[s])) || !i.profile.name), P = h(() => L.value && /^[a-z0-9_-]+$/i.test(a.value.name || "") && a.value.description.trim());
    return (s, e) => (o(), S(l(ue), {
      title: v.profile.title || v.profile.name || "New profile",
      abstract: v.profile.name ? v.used : "Instructions, type and model for an agent",
      onClose: e[14] || (e[14] = (t) => b("close"))
    }, {
      foot: p(() => [
        v.profile.changed.length || v.profile.problem ? (o(), S(l(O), {
          key: 0,
          variant: "ghost",
          small: "",
          "data-profile-reset": "",
          onClick: e[11] || (e[11] = (t) => b("reset", v.profile))
        }, {
          default: p(() => [...e[18] || (e[18] = [
            j("Use the journal's version", -1)
          ])]),
          _: 1
        })) : g("", !0),
        e[21] || (e[21] = c("span", { class: "profile-panel-grow" }, null, -1)),
        u(l(O), {
          variant: "ghost",
          small: "",
          "data-profile-cancel": "",
          onClick: e[12] || (e[12] = (t) => b("close"))
        }, {
          default: p(() => [...e[19] || (e[19] = [
            j("Cancel", -1)
          ])]),
          _: 1
        }),
        u(l(O), {
          variant: "primary",
          small: "",
          disabled: !P.value,
          "data-profile-save": "",
          onClick: e[13] || (e[13] = (t) => b("save", v.profile, a.value))
        }, {
          default: p(() => [...e[20] || (e[20] = [
            j("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: p(() => [
        ne(s.$slots, "default", {}, void 0, !0),
        c("div", xe, [
          v.profile.title ? (o(), m("small", Ie, y(v.profile.name), 1)) : g("", !0),
          v.profile.name ? g("", !0) : (o(), S(l(N), {
            key: 1,
            label: "Name",
            for: "profile-name",
            help: "Letters, digits and dashes; the agent starts it by this name."
          }, {
            default: p(() => [
              u(l(D), {
                id: "profile-name",
                value: a.value.name,
                placeholder: "critic",
                onInput: e[0] || (e[0] = (t) => a.value.name = t.target.value.trim())
              }, null, 8, ["value"])
            ]),
            _: 1
          })),
          u(l(N), {
            label: "Title",
            for: "profile-title"
          }, {
            default: p(() => [
              u(l(D), {
                id: "profile-title",
                value: a.value.title,
                onInput: e[1] || (e[1] = (t) => a.value.title = t.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          u(l(N), {
            label: "When it is used",
            for: "profile-description",
            help: "The agent reads this to decide when to start it."
          }, {
            default: p(() => [
              u(l(J), {
                id: "profile-description",
                rows: "3",
                value: a.value.description,
                onInput: e[2] || (e[2] = (t) => a.value.description = t.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          u(l(N), {
            label: "Type",
            for: "profile-type",
            help: "The type of agent that runs this profile."
          }, {
            default: p(() => {
              var t;
              return [
                v.profile.shipped ? (o(), m("span", Pe, y((t = T.value) == null ? void 0 : t.label), 1)) : (o(), S(l(q), {
                  key: 1,
                  "data-profile-type": "",
                  options: C.value,
                  value: a.value.agent_type,
                  onPick: e[3] || (e[3] = (w) => a.value.agent_type = w)
                }, null, 8, ["options", "value"]))
              ];
            }),
            _: 1
          }),
          u(l(N), {
            label: "Access",
            for: "profile-access",
            help: "Whether it may change files."
          }, {
            default: p(() => [
              u(l(q), {
                "data-profile-access": "",
                options: B.value,
                value: a.value.access,
                onPick: e[4] || (e[4] = (t) => a.value.access = t)
              }, null, 8, ["options", "value"])
            ]),
            _: 1
          }),
          u(l(N), {
            label: "Program",
            for: "profile-program",
            help: "A registered program, or the same program as the agent that starts it."
          }, {
            default: p(() => [
              u(l(q), {
                options: x.value,
                value: a.value.program,
                onPick: e[5] || (e[5] = (t) => a.value.program = t)
              }, null, 8, ["options", "value"])
            ]),
            _: 1
          }),
          a.value.program ? (o(), S(l(N), {
            key: 2,
            label: "When it cannot start",
            for: "profile-program-choice",
            help: "If possible: a start uses the other program, on its model, when this one is not installed or not ready, and says so."
          }, {
            default: p(() => [
              u(l(q), {
                "data-profile-program-choice": "",
                options: d,
                value: a.value.program_if_possible ? "possible" : "always",
                onPick: e[6] || (e[6] = (t) => a.value.program_if_possible = t === "possible")
              }, null, 8, ["value"])
            ]),
            _: 1
          })) : g("", !0),
          (o(!0), m(F, null, U(i.programs, (t) => (o(), S(l(N), {
            key: t.name,
            label: `Model on ${t.title}`,
            for: `profile-model-${t.name}`,
            help: "The least expensive model that reliably fits the work."
          }, {
            default: p(() => [
              u(l(pe), {
                title: t.title,
                models: t.models,
                inherits: "",
                value: a.value.program_models[t.name] || "",
                "data-profile-model": t.name,
                onPick: (w) => a.value.program_models[t.name] = w
              }, null, 8, ["title", "models", "value", "data-profile-model", "onPick"])
            ]),
            _: 2
          }, 1032, ["label", "for"]))), 128)),
          u(l(N), {
            label: "Instructions",
            for: "profile-body",
            help: "What it is told each time it starts, after the brief."
          }, {
            default: p(() => [
              u(l(J), {
                id: "profile-body",
                rows: "16",
                value: a.value.body,
                onInput: e[7] || (e[7] = (t) => a.value.body = t.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          u(l(N), {
            label: "MCP tools this profile may call",
            for: "profile-mcp",
            help: "Separate the names with commas."
          }, {
            default: p(() => [
              u(l(D), {
                id: "profile-mcp",
                value: a.value.mcp_tools,
                onInput: e[8] || (e[8] = (t) => a.value.mcp_tools = t.target.value)
              }, null, 8, ["value"])
            ]),
            _: 1
          }),
          c("label", je, [
            Q(c("input", {
              "onUpdate:modelValue": e[9] || (e[9] = (t) => a.value.independent = t),
              type: "checkbox",
              "data-profile-independent": ""
            }, null, 512), [
              [re, a.value.independent]
            ]),
            e[15] || (e[15] = j(" Must judge fresh", -1))
          ]),
          v.profile.module_text_changed ? (o(), m(F, { key: 3 }, [
            e[17] || (e[17] = c("p", { class: "profile-panel-note" }, "Text changed: the journal's instructions have a new version.", -1)),
            u(l(O), {
              variant: "ghost",
              small: "",
              "data-profile-compare": "",
              onClick: e[10] || (e[10] = (t) => k.value = !k.value)
            }, {
              default: p(() => [...e[16] || (e[16] = [
                j("Compare", -1)
              ])]),
              _: 1
            }),
            k.value ? (o(), S(l(de), {
              key: 0,
              path: "Instructions",
              change: "edit",
              added: _.value.filter((t) => t.line_type === "add").length,
              removed: _.value.filter((t) => t.line_type === "del").length,
              at: "",
              rows: _.value,
              "data-profile-diff": ""
            }, null, 8, ["added", "removed", "rows"])) : g("", !0)
          ], 64)) : g("", !0),
          v.profile.shipped ? (o(), m("p", Ae, "This comes with the journal. Your changes are kept through updates.")) : g("", !0)
        ])
      ]),
      _: 3
    }, 8, ["title", "abstract"]));
  }
}, Re = /* @__PURE__ */ z(Ne, [["__scopeId", "data-v-4db0ab71"]]), Ve = {
  class: "profiles",
  "data-profiles": ""
}, We = {
  class: "count",
  "data-profile-count": ""
}, Oe = {
  key: 0,
  class: "notice",
  "data-profile-notice": ""
}, Be = {
  key: 1,
  class: "notice failed",
  role: "alert",
  "data-profile-failure": ""
}, Ee = {
  key: 3,
  class: "rows"
}, Le = { class: "profile-meta" }, Me = {
  key: 0,
  class: "profile-model"
}, Fe = { class: "profile-model" }, Ue = {
  __name: "ProfileRows",
  setup(v) {
    const R = { name: "", title: "", description: "", agent_type: "helper", access: "read-only", program: "", independent: !1, mcp_tools: [], changed: [], notes: [], problem: "", program_models: {}, body: "", shipped: !1, uses: 0 }, i = { "read-only": "Read-only", writing: "Writing" }, b = X(), { rows: d, listing: x, failure: C, loaded: A, act: a, actionFailure: T } = b.props.profiles, I = b.props.programs.rows, B = h(() => x.value ? x.value.types : []), k = $(""), V = $(""), _ = $(""), W = $(!1), L = h(() => {
      const n = V.value.toLowerCase().split(/\s+/).filter(Boolean);
      return d.value.filter((r) => n.every((f) => {
        var E;
        return fe(r, f, (E = b.search) == null ? void 0 : E.fields);
      }));
    }), P = h(() => W.value ? R : d.value.find((n) => n.name === k.value) || null), s = (n) => {
      var r;
      return ((r = B.value.find((f) => f.key === n.agent_type)) == null ? void 0 : r.label) || n.agent_type;
    }, e = (n) => n.shipped ? "Comes with the journal" : n.module, t = (n) => [`Type: ${s(n)}`, `Access: ${i[n.access]}`, ...I.value.map((r) => `${n.program_models[r.name] || "chosen at start"} on ${r.title}`), n.changed.length ? "Changed" : "", e(n)].filter(Boolean).join(" · "), w = (n) => [n.problem, n.module_text_changed ? "Text changed: the journal's instructions have a new version" : "", ...n.notes].filter(Boolean), M = (n) => n.uses ? `Uses: ${n.uses} ${n.uses === 1 ? "time" : "times"}, last ${ce(new Date(n.last_used * 1e3).toISOString())}` : "Uses: none";
    function Z() {
      W.value = !0, k.value = "";
    }
    function ee(n) {
      W.value = !1, k.value = n.name;
    }
    function te() {
      W.value = !1, k.value = "";
    }
    async function le(n) {
      _.value = "", (await a(["profile", "reset", n.name])).ok && (_.value = `${n.name} is back to the journal's version.`);
    }
    async function ae(n, r) {
      _.value = "";
      const f = n.name || r.name;
      (await a(["profile", "save", f, ...r.title ? ["--title", r.title] : [], "--description", r.description, "--type", r.agent_type, "--access", r.access, "--program", r.program, r.program_if_possible ? "--program-if-possible" : "--no-program-if-possible", ...I.value.flatMap((Y) => [Y.model_option, r.program_models[Y.name] || ""]), "--mcp-tools", r.mcp_tools, r.independent ? "--independent" : "--no-independent", "--body", r.body])).ok && (W.value = !1, k.value = f, _.value = `${f} saved. The agent will use it the next time it starts a helper with this profile.`);
    }
    return (n, r) => (o(), m("section", Ve, [
      u(l(ve), {
        modelValue: V.value,
        "onUpdate:modelValue": r[0] || (r[0] = (f) => V.value = f),
        class: "bar",
        "data-profile-find": ""
      }, {
        default: p(() => [
          u(l(O), {
            variant: "ghost",
            small: "",
            "data-profile-new": "",
            onClick: Z
          }, {
            default: p(() => [...r[1] || (r[1] = [
              j("New profile", -1)
            ])]),
            _: 1
          }),
          c("span", We, y(l(d).length) + " " + y(l(d).length === 1 ? "profile" : "profiles"), 1),
          _.value ? (o(), m("span", Oe, y(_.value), 1)) : g("", !0),
          l(T) ? (o(), m("span", Be, y(l(T)), 1)) : g("", !0)
        ]),
        _: 1
      }, 8, ["modelValue"]),
      l(C) ? (o(), S(l(G), {
        key: 0,
        class: "empty",
        title: "The profiles could not be read"
      }, {
        default: p(() => [
          j(y(l(C)), 1)
        ]),
        _: 1
      })) : !l(A) || !l(d).length ? (o(), S(l(G), {
        key: 1,
        class: "empty",
        loading: !l(A),
        title: "No profiles yet"
      }, {
        default: p(() => [...r[2] || (r[2] = [
          j(" A profile gives an agent its instructions, type and model. The journal includes standard profiles. ", -1)
        ])]),
        _: 1
      }, 8, ["loading"])) : L.value.length ? (o(), m("div", Ee, [
        (o(!0), m(F, null, U(L.value, (f) => (o(), S(l(O), {
          key: f.name,
          variant: "text",
          fill: "",
          class: "profile-open",
          "aria-label": `Open ${f.name}`,
          "data-profile": f.name,
          onClick: (E) => ee(f)
        }, {
          default: p(() => [
            u(l(me), {
              title: f.title || f.name,
              text: f.description
            }, {
              end: p(() => [
                c("span", Le, [
                  f.title ? (o(), m("span", Me, y(f.name), 1)) : g("", !0),
                  c("span", Fe, y(t(f)), 1),
                  (o(!0), m(F, null, U(w(f), (E) => (o(), m("span", {
                    key: E,
                    class: "profile-warning",
                    "data-profile-warning": ""
                  }, y(E), 1))), 128)),
                  c("span", {
                    class: ie(["profile-used", { never: !f.uses }])
                  }, y(M(f)), 3)
                ])
              ]),
              _: 2
            }, 1032, ["title", "text"])
          ]),
          _: 2
        }, 1032, ["aria-label", "data-profile", "onClick"]))), 128))
      ])) : (o(), S(l(G), {
        key: 2,
        class: "empty",
        title: "No profile matches"
      }, {
        default: p(() => [...r[3] || (r[3] = [
          j("Try other words.", -1)
        ])]),
        _: 1
      })),
      P.value ? (o(), S(Re, {
        key: 4,
        programs: l(I),
        types: B.value,
        profile: P.value,
        used: M(P.value),
        onClose: te,
        onSave: ae,
        onReset: le
      }, {
        default: p(() => [
          P.value.name && P.value.agent_type === "helper" ? (o(), S(Te, {
            key: 0,
            programs: l(I),
            profile: P.value.name
          }, null, 8, ["programs", "profile"])) : g("", !0)
        ]),
        _: 1
      }, 8, ["programs", "types", "profile", "used"])) : g("", !0)
    ]));
  }
}, Ge = /* @__PURE__ */ z(Ue, [["__scopeId", "data-v-813a8fcb"]]);
export {
  Ge as default
};
