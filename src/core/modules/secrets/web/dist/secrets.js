/* @code-commandments-generated */
if (!document.getElementById("window-styles-c761f5d9baa1")) { const style = document.createElement("style"); style.id = "window-styles-c761f5d9baa1"; style.textContent = ".program-add[data-v-a3c9f684]{display:inline-flex;gap:4px}.failure[data-v-a3c9f684]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.tools[data-v-a3c9f684]{margin-bottom:8px}.draft[data-v-a3c9f684]{display:flex;flex-direction:column;gap:8px;margin-bottom:10px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.draft-foot[data-v-a3c9f684]{display:flex;gap:6px;justify-content:flex-end}.removed[data-v-a3c9f684]{margin:0 0 8px;color:var(--text-3);font-size:12px}.grow[data-v-a3c9f684]{flex:1}.secret[data-v-a3c9f684]{display:flex;flex:1;flex-direction:column;gap:6px;font-size:13px}.head[data-v-a3c9f684]{display:flex;align-items:baseline;gap:10px}.title[data-v-a3c9f684]{flex:1;font-weight:600}.kind[data-v-a3c9f684],.brief[data-v-a3c9f684],.label[data-v-a3c9f684]{color:var(--text-3);font-size:12px}.brief[data-v-a3c9f684]{margin:0}.field[data-v-a3c9f684]{display:flex;flex-direction:column;gap:4px}.field input[data-v-a3c9f684]{padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px}.programs[data-v-a3c9f684]{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px}button[data-v-a3c9f684]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { reactive as C, ref as B, openBlock as o, createBlock as Z, unref as d, withCtx as f, createElementBlock as a, toDisplayString as c, createCommentVNode as p, createElementVNode as n, createVNode as b, createTextVNode as y, withModifiers as $, withDirectives as m, vModelText as v, Fragment as V, renderList as E, vModelDynamic as w } from "vue";
import { useRows as j, WindowRoom as ee, Btn as h, Segmented as te, RowList as ie, patched as O, removed as le } from "@journal/window-kit";
const ne = (D, _) => {
  const U = D.__vccOpts || D;
  for (const [T, P] of _)
    U[T] = P;
  return U;
}, se = {
  key: 0,
  class: "failure"
}, oe = { class: "tools" }, ae = { class: "draft-foot" }, de = ["onClick"], re = ["data-row"], ue = ["onSubmit"], ce = { class: "draft-foot" }, me = { class: "head" }, fe = { class: "title" }, pe = { class: "kind" }, be = ["onClick"], ve = ["onClick"], ke = ["onClick"], ye = {
  key: 0,
  class: "brief"
}, _e = ["onSubmit"], ge = ["for"], Se = ["id", "onUpdate:modelValue", "type", "placeholder"], Ce = ["data-secret-field-remove", "onClick"], $e = ["onSubmit"], Ve = ["onUpdate:modelValue"], he = { class: "programs" }, Ue = ["onClick"], Ae = ["onClick"], Ne = ["onSubmit"], Fe = ["onUpdate:modelValue"], xe = {
  __name: "SecretRows",
  setup(D) {
    const _ = [
      { key: "api key", label: "API key" },
      { key: "login", label: "Login" },
      { key: "custom", label: "Custom" }
    ], { rows: U, failure: T, loaded: P, act: r, actionFailure: I } = j("secret list", ["secret.*"]), { rows: K, load: L } = j("secret list --deleted", ["secret.*"]), A = C({}), N = C({}), F = C({}), g = B(!1), s = C({ kind: _[0].key, title: "", brief: "", field: "" }), x = B(0), u = C({ title: "", brief: "" }), S = B(0);
    async function W() {
      if (!s.title.trim()) return;
      const i = s.kind === "custom" && s.field.trim() ? ["--field", s.field.trim()] : [];
      (await r(["secret", "make", s.title.trim(), "--kind", s.kind, ...i, ...s.brief.trim() ? ["--brief", s.brief.trim()] : []])).ok && (g.value = !1, Object.assign(s, { kind: _[0].key, title: "", brief: "", field: "" }));
    }
    function Y(i) {
      x.value = i.id, Object.assign(u, { title: i.title, brief: i.brief });
    }
    async function q(i) {
      (await r(["secret", "update", String(i.id), "--title", u.title.trim(), "--brief", u.brief.trim()], O(i.id, { title: u.title.trim(), brief: u.brief.trim() }))).ok && (x.value = 0);
    }
    async function M(i) {
      if (S.value !== i.id) return void (S.value = i.id);
      S.value = 0, await r(["secret", "delete", String(i.id)], le(i.id)), L();
    }
    async function z(i) {
      await r(["secret", "restore", String(i.id)]), L();
    }
    async function G(i) {
      const e = (A[i.id] || "").trim();
      if (!e) return;
      (await r(["secret", "update", String(i.id), "--add-field", e])).ok && (A[i.id] = "");
    }
    const H = (i, e) => r(["secret", "update", String(i.id), "--remove-field", e.name]);
    async function J(i) {
      const e = (N[i.id] || "").trim();
      if (!e) return;
      (await r(["secret", "allow", String(i.id), e])).ok && (N[i.id] = "");
    }
    const k = (i, e) => `${i.id}:${e.name}`, Q = (i, e) => i.filled.includes(e.name);
    async function X(i, e) {
      const t = (F[k(i, e)] || "").trim();
      if (!t) return;
      (await r(["secret", "fill", String(i.id), e.name, t], O(i.id, { filled: [...i.filled, e.name] }))).ok && (F[k(i, e)] = "");
    }
    return (i, e) => (o(), Z(d(ee), null, {
      default: f(() => [
        d(I) ? (o(), a("p", se, c(d(I)), 1)) : p("", !0),
        n("div", oe, [
          b(d(h), {
            small: "",
            bordered: "",
            "data-secret-new": "",
            onClick: e[0] || (e[0] = (t) => g.value = !g.value)
          }, {
            default: f(() => [...e[10] || (e[10] = [
              y("New secret", -1)
            ])]),
            _: 1
          })
        ]),
        g.value ? (o(), a("form", {
          key: 1,
          class: "draft",
          "data-secret-draft": "",
          onSubmit: $(W, ["prevent"])
        }, [
          b(d(te), {
            options: _,
            value: s.kind,
            onPick: e[1] || (e[1] = (t) => s.kind = t)
          }, null, 8, ["value"]),
          m(n("input", {
            "onUpdate:modelValue": e[2] || (e[2] = (t) => s.title = t),
            placeholder: "Its purpose",
            "aria-label": "Title"
          }, null, 512), [
            [v, s.title]
          ]),
          m(n("input", {
            "onUpdate:modelValue": e[3] || (e[3] = (t) => s.brief = t),
            placeholder: "A note on where it is used; you can leave this empty",
            "aria-label": "Note"
          }, null, 512), [
            [v, s.brief]
          ]),
          s.kind === "custom" ? m((o(), a("input", {
            key: 0,
            "onUpdate:modelValue": e[4] || (e[4] = (t) => s.field = t),
            placeholder: "The name of its first field",
            "aria-label": "First field",
            "data-secret-first-field": ""
          }, null, 512)), [
            [v, s.field]
          ]) : p("", !0),
          n("div", ae, [
            b(d(h), {
              small: "",
              onClick: e[5] || (e[5] = (t) => g.value = !1)
            }, {
              default: f(() => [...e[11] || (e[11] = [
                y("Cancel", -1)
              ])]),
              _: 1
            }),
            b(d(h), {
              small: "",
              kind: "primary",
              type: "submit",
              disabled: !s.title.trim() || s.kind === "custom" && !s.field.trim(),
              "data-secret-create": ""
            }, {
              default: f(() => [...e[12] || (e[12] = [
                y("Make the secret", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ])
        ], 32)) : p("", !0),
        (o(!0), a(V, null, E(d(K), (t) => (o(), a("p", {
          key: t.id,
          class: "removed",
          "data-secret-removed": ""
        }, [
          y(c(t.title) + " was deleted. ", 1),
          n("button", {
            type: "button",
            "data-secret-restore": "",
            onClick: (l) => z(t)
          }, "Restore", 8, de)
        ]))), 128)),
        b(d(ie), {
          rows: d(U),
          failure: d(T),
          loaded: d(P),
          empty: "No secrets yet",
          hint: "A key or a login you add shows here by its name, never by its value."
        }, {
          default: f(({ row: t }) => [
            n("div", {
              class: "secret",
              "data-row": t.id
            }, [
              x.value === t.id ? (o(), a("form", {
                key: 0,
                class: "draft",
                "data-secret-edit": "",
                onSubmit: $((l) => q(t), ["prevent"])
              }, [
                m(n("input", {
                  "onUpdate:modelValue": e[6] || (e[6] = (l) => u.title = l),
                  "aria-label": "Title"
                }, null, 512), [
                  [v, u.title]
                ]),
                m(n("input", {
                  "onUpdate:modelValue": e[7] || (e[7] = (l) => u.brief = l),
                  "aria-label": "Note"
                }, null, 512), [
                  [v, u.brief]
                ]),
                n("div", ce, [
                  b(d(h), {
                    small: "",
                    onClick: e[8] || (e[8] = (l) => x.value = 0)
                  }, {
                    default: f(() => [...e[13] || (e[13] = [
                      y("Cancel", -1)
                    ])]),
                    _: 1
                  }),
                  b(d(h), {
                    small: "",
                    kind: "primary",
                    type: "submit",
                    "data-secret-save": ""
                  }, {
                    default: f(() => [...e[14] || (e[14] = [
                      y("Save", -1)
                    ])]),
                    _: 1
                  })
                ])
              ], 40, ue)) : (o(), a(V, { key: 1 }, [
                n("div", me, [
                  n("span", fe, c(t.title), 1),
                  n("span", pe, c(t.secret_type), 1),
                  e[15] || (e[15] = n("span", { class: "grow" }, null, -1)),
                  n("button", {
                    type: "button",
                    "data-secret-edit-open": "",
                    onClick: (l) => Y(t)
                  }, "Edit", 8, be),
                  S.value === t.id ? (o(), a(V, { key: 0 }, [
                    n("button", {
                      type: "button",
                      onClick: e[9] || (e[9] = (l) => S.value = 0)
                    }, "Keep it"),
                    n("button", {
                      type: "button",
                      "data-secret-confirm": "",
                      onClick: (l) => M(t)
                    }, "Yes, delete", 8, ve)
                  ], 64)) : (o(), a("button", {
                    key: 1,
                    type: "button",
                    "data-secret-delete": "",
                    onClick: (l) => M(t)
                  }, "Delete", 8, ke))
                ]),
                t.brief ? (o(), a("p", ye, c(t.brief), 1)) : p("", !0)
              ], 64)),
              (o(!0), a(V, null, E(t.fields, (l) => (o(), a("form", {
                key: l.name,
                class: "field",
                onSubmit: $((R) => X(t, l), ["prevent"])
              }, [
                n("label", {
                  for: k(t, l)
                }, c(l.name), 9, ge),
                m(n("input", {
                  id: k(t, l),
                  "onUpdate:modelValue": (R) => F[k(t, l)] = R,
                  type: l.hidden ? "password" : "text",
                  autocomplete: "off",
                  placeholder: Q(t, l) ? "Filled; type to replace it" : "Type the value"
                }, null, 8, Se), [
                  [w, F[k(t, l)]]
                ]),
                e[16] || (e[16] = n("button", { type: "submit" }, "Save", -1)),
                t.secret_type === "custom" ? (o(), a("button", {
                  key: 0,
                  type: "button",
                  "data-secret-field-remove": l.name,
                  onClick: (R) => H(t, l)
                }, "Remove", 8, Ce)) : p("", !0)
              ], 40, _e))), 128)),
              t.secret_type === "custom" ? (o(), a("form", {
                key: 2,
                class: "field",
                "data-secret-field-add": "",
                onSubmit: $((l) => G(t), ["prevent"])
              }, [
                m(n("input", {
                  "onUpdate:modelValue": (l) => A[t.id] = l,
                  placeholder: "Add a field",
                  "aria-label": "Add a field",
                  autocomplete: "off"
                }, null, 8, Ve), [
                  [v, A[t.id]]
                ]),
                e[17] || (e[17] = n("button", { type: "submit" }, "Add", -1))
              ], 40, $e)) : p("", !0),
              n("div", he, [
                e[19] || (e[19] = n("span", { class: "label" }, "Programs", -1)),
                n("span", null, c(t.programs.length ? t.programs.join(", ") : "None allowed yet"), 1),
                (o(!0), a(V, null, E(t.proposed, (l) => (o(), a("button", {
                  key: l,
                  type: "button",
                  onClick: (R) => d(r)(["secret", "allow", String(t.id), l])
                }, "Allow " + c(l), 9, Ue))), 128)),
                t.helpers ? p("", !0) : (o(), a("button", {
                  key: 0,
                  type: "button",
                  onClick: (l) => d(r)(["secret", "allow", String(t.id), "--helpers"])
                }, "Let helpers use it", 8, Ae)),
                n("form", {
                  class: "program-add",
                  "data-secret-program-add": "",
                  onSubmit: $((l) => J(t), ["prevent"])
                }, [
                  m(n("input", {
                    "onUpdate:modelValue": (l) => N[t.id] = l,
                    placeholder: "Allow a program",
                    "aria-label": "Allow a program",
                    autocomplete: "off"
                  }, null, 8, Fe), [
                    [v, N[t.id]]
                  ]),
                  e[18] || (e[18] = n("button", { type: "submit" }, "Allow", -1))
                ], 40, Ne)
              ])
            ], 8, re)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, Te = /* @__PURE__ */ ne(xe, [["__scopeId", "data-v-a3c9f684"]]);
export {
  Te as default
};
