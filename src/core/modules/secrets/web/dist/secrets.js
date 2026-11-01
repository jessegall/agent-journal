/* @code-commandments-generated */
if (!document.getElementById("window-styles-ecb7a84efa9d")) { const style = document.createElement("style"); style.id = "window-styles-ecb7a84efa9d"; style.textContent = ".failure[data-v-ae99546e]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.tools[data-v-ae99546e]{margin-bottom:8px}.draft[data-v-ae99546e]{display:flex;flex-direction:column;gap:8px;margin-bottom:10px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.draft-foot[data-v-ae99546e]{display:flex;gap:6px;justify-content:flex-end}.removed[data-v-ae99546e]{margin:0 0 8px;color:var(--text-3);font-size:12px}.grow[data-v-ae99546e]{flex:1}.secret[data-v-ae99546e]{display:flex;flex:1;flex-direction:column;gap:6px;font-size:13px}.head[data-v-ae99546e]{display:flex;align-items:baseline;gap:10px}.title[data-v-ae99546e]{flex:1;font-weight:600}.kind[data-v-ae99546e],.brief[data-v-ae99546e],.label[data-v-ae99546e]{color:var(--text-3);font-size:12px}.brief[data-v-ae99546e]{margin:0}.field[data-v-ae99546e]{display:flex;flex-direction:column;gap:4px}.field input[data-v-ae99546e]{padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px}.programs[data-v-ae99546e]{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px}button[data-v-ae99546e]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { reactive as F, ref as x, openBlock as n, createElementBlock as o, Fragment as m, unref as a, toDisplayString as d, createCommentVNode as U, createElementVNode as s, createVNode as p, withCtx as v, createTextVNode as k, withModifiers as L, withDirectives as C, vModelText as h, renderList as M, vModelDynamic as Y } from "vue";
import { useRows as q, Btn as S, Segmented as z, RowList as G } from "@journal/window-kit";
const H = (D, b) => {
  const $ = D.__vccOpts || D;
  for (const [R, T] of b)
    $[R] = T;
  return $;
}, J = {
  key: 0,
  class: "failure"
}, Q = { class: "tools" }, X = { class: "draft-foot" }, Z = ["onClick"], w = ["data-row"], ee = ["onSubmit"], te = { class: "draft-foot" }, le = { class: "head" }, ie = { class: "title" }, se = { class: "kind" }, ne = ["onClick"], oe = ["onClick"], ae = ["onClick"], re = {
  key: 0,
  class: "brief"
}, de = ["onSubmit"], ue = ["for"], ce = ["id", "onUpdate:modelValue", "type", "placeholder"], pe = { class: "programs" }, fe = ["onClick"], me = ["onClick"], ve = {
  __name: "SecretRows",
  setup(D) {
    const b = [
      { key: "api key", label: "API key" },
      { key: "login", label: "Login" },
      { key: "custom", label: "Custom" }
    ], { rows: $, failure: R, loaded: T, act: u, actionFailure: j } = q("secret list", ["secret.*"]), N = F({}), y = x(!1), r = F({ kind: b[0].key, title: "", brief: "" }), V = x(0), c = F({ title: "", brief: "" }), _ = x(0), g = x([]);
    async function B() {
      !r.title.trim() || !(await u(["secret", "make", r.title.trim(), "--kind", r.kind, ...r.brief.trim() ? ["--brief", r.brief.trim()] : []])).ok || (y.value = !1, Object.assign(r, { kind: b[0].key, title: "", brief: "" }));
    }
    function I(i) {
      V.value = i.id, Object.assign(c, { title: i.title, brief: i.brief });
    }
    async function O(i) {
      (await u(["secret", "update", String(i.id), "--title", c.title.trim(), "--brief", c.brief.trim()])).ok && (V.value = 0);
    }
    async function A(i) {
      if (_.value !== i.id) return void (_.value = i.id);
      _.value = 0, (await u(["secret", "delete", String(i.id)])).ok && (g.value = [...g.value, i]);
    }
    async function P(i) {
      (await u(["secret", "restore", String(i.id)])).ok && (g.value = g.value.filter((t) => t.id !== i.id));
    }
    const f = (i, e) => `${i.id}:${e.name}`, K = (i, e) => i.filled.includes(e.name);
    async function W(i, e) {
      const t = (N[f(i, e)] || "").trim();
      if (!t) return;
      (await u(["secret", "fill", String(i.id), e.name, t])).ok && (N[f(i, e)] = "");
    }
    return (i, e) => (n(), o(m, null, [
      a(j) ? (n(), o("p", J, d(a(j)), 1)) : U("", !0),
      s("div", Q, [
        p(a(S), {
          small: "",
          bordered: "",
          "data-secret-new": "",
          onClick: e[0] || (e[0] = (t) => y.value = !y.value)
        }, {
          default: v(() => [...e[9] || (e[9] = [
            k("New secret", -1)
          ])]),
          _: 1
        })
      ]),
      y.value ? (n(), o("form", {
        key: 1,
        class: "draft",
        "data-secret-draft": "",
        onSubmit: L(B, ["prevent"])
      }, [
        p(a(z), {
          options: b,
          value: r.kind,
          onPick: e[1] || (e[1] = (t) => r.kind = t)
        }, null, 8, ["value"]),
        C(s("input", {
          "onUpdate:modelValue": e[2] || (e[2] = (t) => r.title = t),
          placeholder: "What it is for",
          "aria-label": "Title"
        }, null, 512), [
          [h, r.title]
        ]),
        C(s("input", {
          "onUpdate:modelValue": e[3] || (e[3] = (t) => r.brief = t),
          placeholder: "A note on where it is used; you can leave this empty",
          "aria-label": "Note"
        }, null, 512), [
          [h, r.brief]
        ]),
        s("div", X, [
          p(a(S), {
            small: "",
            onClick: e[4] || (e[4] = (t) => y.value = !1)
          }, {
            default: v(() => [...e[10] || (e[10] = [
              k("Cancel", -1)
            ])]),
            _: 1
          }),
          p(a(S), {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !r.title.trim(),
            "data-secret-create": ""
          }, {
            default: v(() => [...e[11] || (e[11] = [
              k("Make the secret", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : U("", !0),
      (n(!0), o(m, null, M(g.value, (t) => (n(), o("p", {
        key: t.id,
        class: "removed",
        "data-secret-removed": ""
      }, [
        k(d(t.title) + " was deleted. ", 1),
        s("button", {
          type: "button",
          "data-secret-restore": "",
          onClick: (l) => P(t)
        }, "Restore", 8, Z)
      ]))), 128)),
      p(a(G), {
        rows: a($),
        failure: a(R),
        loaded: a(T),
        empty: "No secrets yet"
      }, {
        default: v(({ row: t }) => [
          s("div", {
            class: "secret",
            "data-row": t.id
          }, [
            V.value === t.id ? (n(), o("form", {
              key: 0,
              class: "draft",
              "data-secret-edit": "",
              onSubmit: L((l) => O(t), ["prevent"])
            }, [
              C(s("input", {
                "onUpdate:modelValue": e[5] || (e[5] = (l) => c.title = l),
                "aria-label": "Title"
              }, null, 512), [
                [h, c.title]
              ]),
              C(s("input", {
                "onUpdate:modelValue": e[6] || (e[6] = (l) => c.brief = l),
                "aria-label": "Note"
              }, null, 512), [
                [h, c.brief]
              ]),
              s("div", te, [
                p(a(S), {
                  small: "",
                  onClick: e[7] || (e[7] = (l) => V.value = 0)
                }, {
                  default: v(() => [...e[12] || (e[12] = [
                    k("Cancel", -1)
                  ])]),
                  _: 1
                }),
                p(a(S), {
                  small: "",
                  kind: "primary",
                  type: "submit",
                  "data-secret-save": ""
                }, {
                  default: v(() => [...e[13] || (e[13] = [
                    k("Save", -1)
                  ])]),
                  _: 1
                })
              ])
            ], 40, ee)) : (n(), o(m, { key: 1 }, [
              s("div", le, [
                s("span", ie, d(t.title), 1),
                s("span", se, d(t.secret_type), 1),
                e[14] || (e[14] = s("span", { class: "grow" }, null, -1)),
                s("button", {
                  type: "button",
                  "data-secret-edit-open": "",
                  onClick: (l) => I(t)
                }, "Edit", 8, ne),
                _.value === t.id ? (n(), o(m, { key: 0 }, [
                  s("button", {
                    type: "button",
                    onClick: e[8] || (e[8] = (l) => _.value = 0)
                  }, "Keep it"),
                  s("button", {
                    type: "button",
                    "data-secret-confirm": "",
                    onClick: (l) => A(t)
                  }, "Yes, delete", 8, oe)
                ], 64)) : (n(), o("button", {
                  key: 1,
                  type: "button",
                  "data-secret-delete": "",
                  onClick: (l) => A(t)
                }, "Delete", 8, ae))
              ]),
              t.brief ? (n(), o("p", re, d(t.brief), 1)) : U("", !0)
            ], 64)),
            (n(!0), o(m, null, M(t.fields, (l) => (n(), o("form", {
              key: l.name,
              class: "field",
              onSubmit: L((E) => W(t, l), ["prevent"])
            }, [
              s("label", {
                for: f(t, l)
              }, d(l.name), 9, ue),
              C(s("input", {
                id: f(t, l),
                "onUpdate:modelValue": (E) => N[f(t, l)] = E,
                type: l.hidden ? "password" : "text",
                autocomplete: "off",
                placeholder: K(t, l) ? "Filled; type to replace it" : "Type the value"
              }, null, 8, ce), [
                [Y, N[f(t, l)]]
              ]),
              e[15] || (e[15] = s("button", { type: "submit" }, "Save", -1))
            ], 40, de))), 128)),
            s("div", pe, [
              e[16] || (e[16] = s("span", { class: "label" }, "Programs", -1)),
              s("span", null, d(t.programs.length ? t.programs.join(", ") : "None allowed yet"), 1),
              (n(!0), o(m, null, M(t.proposed, (l) => (n(), o("button", {
                key: l,
                type: "button",
                onClick: (E) => a(u)(["secret", "allow", String(t.id), l])
              }, "Allow " + d(l), 9, fe))), 128)),
              t.helpers ? U("", !0) : (n(), o("button", {
                key: 0,
                type: "button",
                onClick: (l) => a(u)(["secret", "allow", String(t.id), "--helpers"])
              }, "Let helpers use it", 8, me))
            ])
          ], 8, w)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ], 64));
  }
}, ye = /* @__PURE__ */ H(ve, [["__scopeId", "data-v-ae99546e"]]);
export {
  ye as default
};
