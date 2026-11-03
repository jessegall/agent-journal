/* @code-commandments-generated */
if (!document.getElementById("window-styles-3f63469c497d")) { const style = document.createElement("style"); style.id = "window-styles-3f63469c497d"; style.textContent = ".program-add[data-v-9cf71978]{display:inline-flex;gap:4px}.failure[data-v-9cf71978]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.tools[data-v-9cf71978]{margin-bottom:8px}.draft[data-v-9cf71978]{display:flex;flex-direction:column;gap:8px;margin-bottom:10px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.draft-foot[data-v-9cf71978]{display:flex;gap:6px;justify-content:flex-end}.removed[data-v-9cf71978]{margin:0 0 8px;color:var(--text-3);font-size:12px}.grow[data-v-9cf71978]{flex:1}.secret[data-v-9cf71978]{display:flex;flex:1;flex-direction:column;gap:6px;font-size:13px}.head[data-v-9cf71978]{display:flex;align-items:baseline;gap:10px}.title[data-v-9cf71978]{flex:1;font-weight:600}.kind[data-v-9cf71978],.brief[data-v-9cf71978],.label[data-v-9cf71978]{color:var(--text-3);font-size:12px}.brief[data-v-9cf71978]{margin:0}.field[data-v-9cf71978]{display:flex;flex-direction:column;gap:4px}.field input[data-v-9cf71978]{padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px}.programs[data-v-9cf71978]{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px}button[data-v-9cf71978]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { reactive as $, ref as E, openBlock as o, createElementBlock as a, Fragment as k, unref as d, toDisplayString as c, createCommentVNode as f, createElementVNode as n, createVNode as p, withCtx as y, createTextVNode as _, withModifiers as V, withDirectives as m, vModelText as b, renderList as I, vModelDynamic as Z } from "vue";
import { useRows as B, Btn as h, Segmented as w, RowList as ee, patched as O, removed as te } from "@journal/window-kit";
const ie = (R, g) => {
  const U = R.__vccOpts || R;
  for (const [T, P] of g)
    U[T] = P;
  return U;
}, le = {
  key: 0,
  class: "failure"
}, ne = { class: "tools" }, se = { class: "draft-foot" }, oe = ["onClick"], ae = ["data-row"], de = ["onSubmit"], re = { class: "draft-foot" }, ue = { class: "head" }, ce = { class: "title" }, me = { class: "kind" }, fe = ["onClick"], pe = ["onClick"], be = ["onClick"], ve = {
  key: 0,
  class: "brief"
}, ke = ["onSubmit"], ye = ["for"], _e = ["id", "onUpdate:modelValue", "type", "placeholder"], ge = ["data-secret-field-remove", "onClick"], Se = ["onSubmit"], Ce = ["onUpdate:modelValue"], $e = { class: "programs" }, Ve = ["onClick"], he = ["onClick"], Ue = ["onSubmit"], Ae = ["onUpdate:modelValue"], Ne = {
  __name: "SecretRows",
  setup(R) {
    const g = [
      { key: "api key", label: "API key" },
      { key: "login", label: "Login" },
      { key: "custom", label: "Custom" }
    ], { rows: U, failure: T, loaded: P, act: r, actionFailure: L } = B("secret list", ["secret.*"]), { rows: K, load: M } = B("secret list --deleted", ["secret.*"]), A = $({}), N = $({}), F = $({}), S = E(!1), s = $({ kind: g[0].key, title: "", brief: "", field: "" }), x = E(0), u = $({ title: "", brief: "" }), C = E(0);
    async function Y() {
      if (!s.title.trim()) return;
      const i = s.kind === "custom" && s.field.trim() ? ["--field", s.field.trim()] : [];
      (await r(["secret", "make", s.title.trim(), "--kind", s.kind, ...i, ...s.brief.trim() ? ["--brief", s.brief.trim()] : []])).ok && (S.value = !1, Object.assign(s, { kind: g[0].key, title: "", brief: "", field: "" }));
    }
    function q(i) {
      x.value = i.id, Object.assign(u, { title: i.title, brief: i.brief });
    }
    async function z(i) {
      (await r(["secret", "update", String(i.id), "--title", u.title.trim(), "--brief", u.brief.trim()], O(i.id, { title: u.title.trim(), brief: u.brief.trim() }))).ok && (x.value = 0);
    }
    async function j(i) {
      if (C.value !== i.id) return void (C.value = i.id);
      C.value = 0, await r(["secret", "delete", String(i.id)], te(i.id)), M();
    }
    async function G(i) {
      await r(["secret", "restore", String(i.id)]), M();
    }
    async function H(i) {
      const e = (A[i.id] || "").trim();
      if (!e) return;
      (await r(["secret", "update", String(i.id), "--add-field", e])).ok && (A[i.id] = "");
    }
    const J = (i, e) => r(["secret", "update", String(i.id), "--remove-field", e.name]);
    async function Q(i) {
      const e = (N[i.id] || "").trim();
      if (!e) return;
      (await r(["secret", "allow", String(i.id), e])).ok && (N[i.id] = "");
    }
    const v = (i, e) => `${i.id}:${e.name}`, W = (i, e) => i.filled.includes(e.name);
    async function X(i, e) {
      const t = (F[v(i, e)] || "").trim();
      if (!t) return;
      (await r(["secret", "fill", String(i.id), e.name, t], O(i.id, { filled: [...i.filled, e.name] }))).ok && (F[v(i, e)] = "");
    }
    return (i, e) => (o(), a(k, null, [
      d(L) ? (o(), a("p", le, c(d(L)), 1)) : f("", !0),
      n("div", ne, [
        p(d(h), {
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
        onSubmit: V(Y, ["prevent"])
      }, [
        p(d(w), {
          options: g,
          value: s.kind,
          onPick: e[1] || (e[1] = (t) => s.kind = t)
        }, null, 8, ["value"]),
        m(n("input", {
          "onUpdate:modelValue": e[2] || (e[2] = (t) => s.title = t),
          placeholder: "Its purpose",
          "aria-label": "Title"
        }, null, 512), [
          [b, s.title]
        ]),
        m(n("input", {
          "onUpdate:modelValue": e[3] || (e[3] = (t) => s.brief = t),
          placeholder: "A note on where it is used; you can leave this empty",
          "aria-label": "Note"
        }, null, 512), [
          [b, s.brief]
        ]),
        s.kind === "custom" ? m((o(), a("input", {
          key: 0,
          "onUpdate:modelValue": e[4] || (e[4] = (t) => s.field = t),
          placeholder: "The name of its first field",
          "aria-label": "First field",
          "data-secret-first-field": ""
        }, null, 512)), [
          [b, s.field]
        ]) : f("", !0),
        n("div", se, [
          p(d(h), {
            small: "",
            onClick: e[5] || (e[5] = (t) => S.value = !1)
          }, {
            default: y(() => [...e[11] || (e[11] = [
              _("Cancel", -1)
            ])]),
            _: 1
          }),
          p(d(h), {
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
      ], 32)) : f("", !0),
      (o(!0), a(k, null, I(d(K), (t) => (o(), a("p", {
        key: t.id,
        class: "removed",
        "data-secret-removed": ""
      }, [
        _(c(t.title) + " was deleted. ", 1),
        n("button", {
          type: "button",
          "data-secret-restore": "",
          onClick: (l) => G(t)
        }, "Restore", 8, oe)
      ]))), 128)),
      p(d(ee), {
        rows: d(U),
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
              onSubmit: V((l) => z(t), ["prevent"])
            }, [
              m(n("input", {
                "onUpdate:modelValue": e[6] || (e[6] = (l) => u.title = l),
                "aria-label": "Title"
              }, null, 512), [
                [b, u.title]
              ]),
              m(n("input", {
                "onUpdate:modelValue": e[7] || (e[7] = (l) => u.brief = l),
                "aria-label": "Note"
              }, null, 512), [
                [b, u.brief]
              ]),
              n("div", re, [
                p(d(h), {
                  small: "",
                  onClick: e[8] || (e[8] = (l) => x.value = 0)
                }, {
                  default: y(() => [...e[13] || (e[13] = [
                    _("Cancel", -1)
                  ])]),
                  _: 1
                }),
                p(d(h), {
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
            ], 40, de)) : (o(), a(k, { key: 1 }, [
              n("div", ue, [
                n("span", ce, c(t.title), 1),
                n("span", me, c(t.secret_type), 1),
                e[15] || (e[15] = n("span", { class: "grow" }, null, -1)),
                n("button", {
                  type: "button",
                  "data-secret-edit-open": "",
                  onClick: (l) => q(t)
                }, "Edit", 8, fe),
                C.value === t.id ? (o(), a(k, { key: 0 }, [
                  n("button", {
                    type: "button",
                    onClick: e[9] || (e[9] = (l) => C.value = 0)
                  }, "Keep it"),
                  n("button", {
                    type: "button",
                    "data-secret-confirm": "",
                    onClick: (l) => j(t)
                  }, "Yes, delete", 8, pe)
                ], 64)) : (o(), a("button", {
                  key: 1,
                  type: "button",
                  "data-secret-delete": "",
                  onClick: (l) => j(t)
                }, "Delete", 8, be))
              ]),
              t.brief ? (o(), a("p", ve, c(t.brief), 1)) : f("", !0)
            ], 64)),
            (o(!0), a(k, null, I(t.fields, (l) => (o(), a("form", {
              key: l.name,
              class: "field",
              onSubmit: V((D) => X(t, l), ["prevent"])
            }, [
              n("label", {
                for: v(t, l)
              }, c(l.name), 9, ye),
              m(n("input", {
                id: v(t, l),
                "onUpdate:modelValue": (D) => F[v(t, l)] = D,
                type: l.hidden ? "password" : "text",
                autocomplete: "off",
                placeholder: W(t, l) ? "Filled; type to replace it" : "Type the value"
              }, null, 8, _e), [
                [Z, F[v(t, l)]]
              ]),
              e[16] || (e[16] = n("button", { type: "submit" }, "Save", -1)),
              t.secret_type === "custom" ? (o(), a("button", {
                key: 0,
                type: "button",
                "data-secret-field-remove": l.name,
                onClick: (D) => J(t, l)
              }, "Remove", 8, ge)) : f("", !0)
            ], 40, ke))), 128)),
            t.secret_type === "custom" ? (o(), a("form", {
              key: 2,
              class: "field",
              "data-secret-field-add": "",
              onSubmit: V((l) => H(t), ["prevent"])
            }, [
              m(n("input", {
                "onUpdate:modelValue": (l) => A[t.id] = l,
                placeholder: "Add a field",
                "aria-label": "Add a field",
                autocomplete: "off"
              }, null, 8, Ce), [
                [b, A[t.id]]
              ]),
              e[17] || (e[17] = n("button", { type: "submit" }, "Add", -1))
            ], 40, Se)) : f("", !0),
            n("div", $e, [
              e[19] || (e[19] = n("span", { class: "label" }, "Programs", -1)),
              n("span", null, c(t.programs.length ? t.programs.join(", ") : "None allowed yet"), 1),
              (o(!0), a(k, null, I(t.proposed, (l) => (o(), a("button", {
                key: l,
                type: "button",
                onClick: (D) => d(r)(["secret", "allow", String(t.id), l])
              }, "Allow " + c(l), 9, Ve))), 128)),
              t.helpers ? f("", !0) : (o(), a("button", {
                key: 0,
                type: "button",
                onClick: (l) => d(r)(["secret", "allow", String(t.id), "--helpers"])
              }, "Let helpers use it", 8, he)),
              n("form", {
                class: "program-add",
                "data-secret-program-add": "",
                onSubmit: V((l) => Q(t), ["prevent"])
              }, [
                m(n("input", {
                  "onUpdate:modelValue": (l) => N[t.id] = l,
                  placeholder: "Allow a program",
                  "aria-label": "Allow a program",
                  autocomplete: "off"
                }, null, 8, Ae), [
                  [b, N[t.id]]
                ]),
                e[18] || (e[18] = n("button", { type: "submit" }, "Allow", -1))
              ], 40, Ue)
            ])
          ], 8, ae)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ], 64));
  }
}, De = /* @__PURE__ */ ie(Ne, [["__scopeId", "data-v-9cf71978"]]);
export {
  De as default
};
