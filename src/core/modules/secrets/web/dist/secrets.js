/* @code-commandments-generated */
if (!document.getElementById("window-styles-54564e42dcfe")) { const style = document.createElement("style"); style.id = "window-styles-54564e42dcfe"; style.textContent = ".program-add[data-v-baca99fa]{display:inline-flex;gap:4px}.failure[data-v-baca99fa]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.tools[data-v-baca99fa]{margin-bottom:8px}.draft[data-v-baca99fa]{display:flex;flex-direction:column;gap:8px;margin-bottom:10px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.draft-foot[data-v-baca99fa]{display:flex;gap:6px;justify-content:flex-end}.removed[data-v-baca99fa]{margin:0 0 8px;color:var(--text-3);font-size:12px}.grow[data-v-baca99fa]{flex:1}.secret[data-v-baca99fa]{display:flex;flex:1;flex-direction:column;gap:6px;font-size:13px}.head[data-v-baca99fa]{display:flex;align-items:baseline;gap:10px}.title[data-v-baca99fa]{flex:1;font-weight:600}.kind[data-v-baca99fa],.brief[data-v-baca99fa],.label[data-v-baca99fa]{color:var(--text-3);font-size:12px}.brief[data-v-baca99fa]{margin:0}.field[data-v-baca99fa]{display:flex;flex-direction:column;gap:4px}.field input[data-v-baca99fa]{padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px}.programs[data-v-baca99fa]{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px}button[data-v-baca99fa]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { reactive as $, ref as E, openBlock as o, createElementBlock as a, Fragment as k, unref as d, toDisplayString as u, createCommentVNode as p, createElementVNode as n, createVNode as f, withCtx as y, createTextVNode as _, withModifiers as V, withDirectives as c, vModelText as b, renderList as I, vModelDynamic as X } from "vue";
import { useRows as B, Btn as U, Segmented as Z, RowList as w } from "@journal/window-kit";
const ee = (R, g) => {
  const h = R.__vccOpts || R;
  for (const [T, P] of g)
    h[T] = P;
  return h;
}, te = {
  key: 0,
  class: "failure"
}, ie = { class: "tools" }, le = { class: "draft-foot" }, ne = ["onClick"], se = ["data-row"], oe = ["onSubmit"], ae = { class: "draft-foot" }, de = { class: "head" }, re = { class: "title" }, ue = { class: "kind" }, ce = ["onClick"], me = ["onClick"], pe = ["onClick"], fe = {
  key: 0,
  class: "brief"
}, be = ["onSubmit"], ve = ["for"], ke = ["id", "onUpdate:modelValue", "type", "placeholder"], ye = ["data-secret-field-remove", "onClick"], _e = ["onSubmit"], ge = ["onUpdate:modelValue"], Se = { class: "programs" }, Ce = ["onClick"], $e = ["onClick"], Ve = ["onSubmit"], Ue = ["onUpdate:modelValue"], he = {
  __name: "SecretRows",
  setup(R) {
    const g = [
      { key: "api key", label: "API key" },
      { key: "login", label: "Login" },
      { key: "custom", label: "Custom" }
    ], { rows: h, failure: T, loaded: P, act: r, actionFailure: L } = B("secret list", ["secret.*"]), { rows: O, load: M } = B("secret list --deleted", ["secret.*"]), A = $({}), N = $({}), F = $({}), S = E(!1), s = $({ kind: g[0].key, title: "", brief: "", field: "" }), x = E(0), m = $({ title: "", brief: "" }), C = E(0);
    async function K() {
      if (!s.title.trim()) return;
      const l = s.kind === "custom" && s.field.trim() ? ["--field", s.field.trim()] : [];
      (await r(["secret", "make", s.title.trim(), "--kind", s.kind, ...l, ...s.brief.trim() ? ["--brief", s.brief.trim()] : []])).ok && (S.value = !1, Object.assign(s, { kind: g[0].key, title: "", brief: "", field: "" }));
    }
    function Y(l) {
      x.value = l.id, Object.assign(m, { title: l.title, brief: l.brief });
    }
    async function q(l) {
      (await r(["secret", "update", String(l.id), "--title", m.title.trim(), "--brief", m.brief.trim()])).ok && (x.value = 0);
    }
    async function j(l) {
      if (C.value !== l.id) return void (C.value = l.id);
      C.value = 0, await r(["secret", "delete", String(l.id)]), M();
    }
    async function z(l) {
      await r(["secret", "restore", String(l.id)]), M();
    }
    async function G(l) {
      const e = (A[l.id] || "").trim();
      if (!e) return;
      (await r(["secret", "update", String(l.id), "--add-field", e])).ok && (A[l.id] = "");
    }
    const H = (l, e) => r(["secret", "update", String(l.id), "--remove-field", e.name]);
    async function J(l) {
      const e = (N[l.id] || "").trim();
      if (!e) return;
      (await r(["secret", "allow", String(l.id), e])).ok && (N[l.id] = "");
    }
    const v = (l, e) => `${l.id}:${e.name}`, Q = (l, e) => l.filled.includes(e.name);
    async function W(l, e) {
      const t = (F[v(l, e)] || "").trim();
      if (!t) return;
      (await r(["secret", "fill", String(l.id), e.name, t])).ok && (F[v(l, e)] = "");
    }
    return (l, e) => (o(), a(k, null, [
      d(L) ? (o(), a("p", te, u(d(L)), 1)) : p("", !0),
      n("div", ie, [
        f(d(U), {
          small: "",
          bordered: "",
          "data-secret-new": "",
          onClick: e[0] || (e[0] = (t) => S.value = !S.value)
        }, {
          default: y(() => [...e[10] || (e[10] = [
            _("New secret", -1)
          ])]),
          _: 1
        })
      ]),
      S.value ? (o(), a("form", {
        key: 1,
        class: "draft",
        "data-secret-draft": "",
        onSubmit: V(K, ["prevent"])
      }, [
        f(d(Z), {
          options: g,
          value: s.kind,
          onPick: e[1] || (e[1] = (t) => s.kind = t)
        }, null, 8, ["value"]),
        c(n("input", {
          "onUpdate:modelValue": e[2] || (e[2] = (t) => s.title = t),
          placeholder: "Its purpose",
          "aria-label": "Title"
        }, null, 512), [
          [b, s.title]
        ]),
        c(n("input", {
          "onUpdate:modelValue": e[3] || (e[3] = (t) => s.brief = t),
          placeholder: "A note on where it is used; you can leave this empty",
          "aria-label": "Note"
        }, null, 512), [
          [b, s.brief]
        ]),
        s.kind === "custom" ? c((o(), a("input", {
          key: 0,
          "onUpdate:modelValue": e[4] || (e[4] = (t) => s.field = t),
          placeholder: "The name of its first field",
          "aria-label": "First field",
          "data-secret-first-field": ""
        }, null, 512)), [
          [b, s.field]
        ]) : p("", !0),
        n("div", le, [
          f(d(U), {
            small: "",
            onClick: e[5] || (e[5] = (t) => S.value = !1)
          }, {
            default: y(() => [...e[11] || (e[11] = [
              _("Cancel", -1)
            ])]),
            _: 1
          }),
          f(d(U), {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !s.title.trim() || s.kind === "custom" && !s.field.trim(),
            "data-secret-create": ""
          }, {
            default: y(() => [...e[12] || (e[12] = [
              _("Make the secret", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : p("", !0),
      (o(!0), a(k, null, I(d(O), (t) => (o(), a("p", {
        key: t.id,
        class: "removed",
        "data-secret-removed": ""
      }, [
        _(u(t.title) + " was deleted. ", 1),
        n("button", {
          type: "button",
          "data-secret-restore": "",
          onClick: (i) => z(t)
        }, "Restore", 8, ne)
      ]))), 128)),
      f(d(w), {
        rows: d(h),
        failure: d(T),
        loaded: d(P),
        empty: "No secrets yet",
        hint: "A key or a login you add shows here by its name, never by its value."
      }, {
        default: y(({ row: t }) => [
          n("div", {
            class: "secret",
            "data-row": t.id
          }, [
            x.value === t.id ? (o(), a("form", {
              key: 0,
              class: "draft",
              "data-secret-edit": "",
              onSubmit: V((i) => q(t), ["prevent"])
            }, [
              c(n("input", {
                "onUpdate:modelValue": e[6] || (e[6] = (i) => m.title = i),
                "aria-label": "Title"
              }, null, 512), [
                [b, m.title]
              ]),
              c(n("input", {
                "onUpdate:modelValue": e[7] || (e[7] = (i) => m.brief = i),
                "aria-label": "Note"
              }, null, 512), [
                [b, m.brief]
              ]),
              n("div", ae, [
                f(d(U), {
                  small: "",
                  onClick: e[8] || (e[8] = (i) => x.value = 0)
                }, {
                  default: y(() => [...e[13] || (e[13] = [
                    _("Cancel", -1)
                  ])]),
                  _: 1
                }),
                f(d(U), {
                  small: "",
                  kind: "primary",
                  type: "submit",
                  "data-secret-save": ""
                }, {
                  default: y(() => [...e[14] || (e[14] = [
                    _("Save", -1)
                  ])]),
                  _: 1
                })
              ])
            ], 40, oe)) : (o(), a(k, { key: 1 }, [
              n("div", de, [
                n("span", re, u(t.title), 1),
                n("span", ue, u(t.secret_type), 1),
                e[15] || (e[15] = n("span", { class: "grow" }, null, -1)),
                n("button", {
                  type: "button",
                  "data-secret-edit-open": "",
                  onClick: (i) => Y(t)
                }, "Edit", 8, ce),
                C.value === t.id ? (o(), a(k, { key: 0 }, [
                  n("button", {
                    type: "button",
                    onClick: e[9] || (e[9] = (i) => C.value = 0)
                  }, "Keep it"),
                  n("button", {
                    type: "button",
                    "data-secret-confirm": "",
                    onClick: (i) => j(t)
                  }, "Yes, delete", 8, me)
                ], 64)) : (o(), a("button", {
                  key: 1,
                  type: "button",
                  "data-secret-delete": "",
                  onClick: (i) => j(t)
                }, "Delete", 8, pe))
              ]),
              t.brief ? (o(), a("p", fe, u(t.brief), 1)) : p("", !0)
            ], 64)),
            (o(!0), a(k, null, I(t.fields, (i) => (o(), a("form", {
              key: i.name,
              class: "field",
              onSubmit: V((D) => W(t, i), ["prevent"])
            }, [
              n("label", {
                for: v(t, i)
              }, u(i.name), 9, ve),
              c(n("input", {
                id: v(t, i),
                "onUpdate:modelValue": (D) => F[v(t, i)] = D,
                type: i.hidden ? "password" : "text",
                autocomplete: "off",
                placeholder: Q(t, i) ? "Filled; type to replace it" : "Type the value"
              }, null, 8, ke), [
                [X, F[v(t, i)]]
              ]),
              e[16] || (e[16] = n("button", { type: "submit" }, "Save", -1)),
              t.secret_type === "custom" ? (o(), a("button", {
                key: 0,
                type: "button",
                "data-secret-field-remove": i.name,
                onClick: (D) => H(t, i)
              }, "Remove", 8, ye)) : p("", !0)
            ], 40, be))), 128)),
            t.secret_type === "custom" ? (o(), a("form", {
              key: 2,
              class: "field",
              "data-secret-field-add": "",
              onSubmit: V((i) => G(t), ["prevent"])
            }, [
              c(n("input", {
                "onUpdate:modelValue": (i) => A[t.id] = i,
                placeholder: "Add a field",
                "aria-label": "Add a field",
                autocomplete: "off"
              }, null, 8, ge), [
                [b, A[t.id]]
              ]),
              e[17] || (e[17] = n("button", { type: "submit" }, "Add", -1))
            ], 40, _e)) : p("", !0),
            n("div", Se, [
              e[19] || (e[19] = n("span", { class: "label" }, "Programs", -1)),
              n("span", null, u(t.programs.length ? t.programs.join(", ") : "None allowed yet"), 1),
              (o(!0), a(k, null, I(t.proposed, (i) => (o(), a("button", {
                key: i,
                type: "button",
                onClick: (D) => d(r)(["secret", "allow", String(t.id), i])
              }, "Allow " + u(i), 9, Ce))), 128)),
              t.helpers ? p("", !0) : (o(), a("button", {
                key: 0,
                type: "button",
                onClick: (i) => d(r)(["secret", "allow", String(t.id), "--helpers"])
              }, "Let helpers use it", 8, $e)),
              n("form", {
                class: "program-add",
                "data-secret-program-add": "",
                onSubmit: V((i) => J(t), ["prevent"])
              }, [
                c(n("input", {
                  "onUpdate:modelValue": (i) => N[t.id] = i,
                  placeholder: "Allow a program",
                  "aria-label": "Allow a program",
                  autocomplete: "off"
                }, null, 8, Ue), [
                  [b, N[t.id]]
                ]),
                e[18] || (e[18] = n("button", { type: "submit" }, "Allow", -1))
              ], 40, Ve)
            ])
          ], 8, se)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ], 64));
  }
}, Fe = /* @__PURE__ */ ee(he, [["__scopeId", "data-v-baca99fa"]]);
export {
  Fe as default
};
