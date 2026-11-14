if (!document.getElementById("window-styles-6dc54b2ac0e6")) { const style = document.createElement("style"); style.id = "window-styles-6dc54b2ac0e6"; style.textContent = ".sections[data-v-bc1a9b84]{display:flex;flex-direction:column;gap:18px}.section[data-v-bc1a9b84]{display:flex;flex-direction:column;gap:10px}.label[data-v-bc1a9b84]{color:var(--text-4);font-size:10.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase}.lead[data-v-bc1a9b84]{margin:0;color:var(--text-2);font-size:12.5px;line-height:1.55}.field[data-v-bc1a9b84]{display:flex;flex-direction:column;gap:5px;color:var(--text-2);font-size:12.5px;font-weight:500}.line[data-v-bc1a9b84]{display:flex;align-items:center;gap:8px}.line[data-v-bc1a9b84]>:first-child{flex:1;min-width:0}.value[data-v-bc1a9b84]{box-sizing:border-box;width:100%;height:30px;padding:0 9px;border:1px solid var(--border-2);border-radius:7px;outline:none;background:var(--bg);color:var(--text);font:inherit;font-weight:400}.value[data-v-bc1a9b84]:focus{border-color:var(--accent)}.chips[data-v-bc1a9b84]{display:flex;flex-wrap:wrap;gap:6px}.chip[data-v-bc1a9b84]{display:inline-flex;align-items:center;height:22px;padding:0 9px;border-radius:6px;background:var(--chip);color:var(--text-2);font-family:var(--mono);font-size:11.5px}.muted[data-v-bc1a9b84]{color:var(--text-3);font-size:12.5px}.proposal[data-v-bc1a9b84]{display:flex;flex-wrap:wrap;align-items:center;gap:10px;color:var(--text-2);font-size:12.5px}code[data-v-bc1a9b84]{padding:1px 6px;border-radius:5px;background:var(--chip);font-family:var(--mono);font-size:11.5px}.refusal[data-v-bc1a9b84]{margin:0;color:var(--danger);font-size:12.5px}.sections[data-v-8301a7e5]{display:flex;flex-direction:column;gap:14px}.choice[data-v-8301a7e5]{display:flex;flex-direction:column;gap:5px}.question[data-v-8301a7e5]{color:var(--text-2);font-size:12.5px;font-weight:500}.types[data-v-8301a7e5]{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px}.type[data-v-8301a7e5]{display:flex;flex-direction:column;gap:3px;padding:10px;border:1px solid var(--border-2);border-radius:10px;background:var(--bg);color:var(--text-3);font:inherit;text-align:left;cursor:pointer}.type b[data-v-8301a7e5]{color:var(--text);font-size:13px;font-weight:600}.type span[data-v-8301a7e5]{font-size:11.5px;line-height:1.4}.type.picked[data-v-8301a7e5]{border-color:var(--accent);background:var(--accent-dim);color:var(--accent-text)}.type.picked b[data-v-8301a7e5]{color:var(--accent-text)}.line[data-v-8301a7e5]{margin:0;color:var(--text-2);font-size:12.5px;line-height:1.55}.refusal[data-v-8301a7e5]{margin:0;color:var(--danger);font-size:12.5px}.lead[data-v-0833ef9e]{max-width:640px;margin:0;color:var(--text-3);font-size:12.5px;line-height:1.55}.meta[data-v-0833ef9e]{margin:0;overflow:hidden;color:var(--text-3);font-size:12px;text-overflow:ellipsis;white-space:nowrap}.failure[data-v-0833ef9e]{margin:0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { computed as E, ref as f, reactive as X, openBlock as o, createBlock as D, unref as a, withCtx as u, createElementVNode as n, createElementBlock as m, createCommentVNode as I, Fragment as U, renderList as P, toDisplayString as A, withDirectives as Z, vModelDynamic as h, createVNode as c, withModifiers as H, createTextVNode as V, normalizeClass as ee } from "vue";
import { Dialog as W, Btn as _, Icon as B, TextInput as x, copying as te, deleteItem as le, useWindow as ae, CardPage as se, ActionsMenu as oe, Skeleton as ne, removed as re } from "@journal/window-kit";
const M = (s, N) => {
  const r = s.__vccOpts || s;
  for (const [b, w] of N)
    r[b] = w;
  return r;
}, ie = { class: "sections" }, de = {
  key: 0,
  class: "lead"
}, ue = { class: "section" }, ce = ["for"], pe = { class: "line" }, ve = ["id", "onUpdate:modelValue", "type", "placeholder", "data-secret-value"], me = { class: "section" }, fe = {
  key: 0,
  class: "chips"
}, ye = {
  key: 1,
  class: "muted"
}, ke = { class: "section" }, we = {
  key: 0,
  class: "muted"
}, ge = {
  key: 1,
  class: "proposal"
}, be = { class: "section" }, Ce = {
  key: 1,
  class: "refusal",
  role: "alert"
}, $e = {
  __name: "SecretDialog",
  props: { row: { type: Object, required: !0 }, run: { type: Function, required: !0 } },
  emits: ["close"],
  setup(s, { emit: N }) {
    const r = s, b = N, w = String(r.row.id), C = E(() => r.row.secret_type === "custom"), y = f(r.row.title), g = f(r.row.brief), $ = X({}), k = f(r.row.fields.map((d) => ({ ...d, added: !1 }))), S = f([]), F = f(""), p = f([...r.row.programs]), v = f([...r.row.proposed]), t = f(""), i = f(r.row.helpers), T = f(""), L = f(!1), j = (d) => r.row.filled.includes(d.name), Y = (d) => j(d) ? "Leave blank to keep the saved credential" : "Paste or type your credential";
    function G() {
      const d = F.value.trim();
      !d || k.value.some((e) => e.name === d) || (k.value = [...k.value, { name: d, hidden: !0, added: !0 }], F.value = "");
    }
    function J(d) {
      k.value = k.value.filter((e) => e.name !== d.name), d.added || (S.value = [...S.value, d.name]), delete $[d.name];
    }
    function z(d) {
      const e = d.trim();
      e && !p.value.includes(e) && (p.value = [...p.value, e]), v.value = v.value.filter((l) => l !== e), t.value = "";
    }
    function K() {
      const d = p.value.filter((e) => !r.row.programs.includes(e));
      return [
        ...k.value.filter((e) => e.added).map((e) => ["secret", "update", w, "--add-field", e.name]),
        ...S.value.map((e) => ["secret", "update", w, "--remove-field", e]),
        ...k.value.filter((e) => ($[e.name] ?? "").trim()).map((e) => ["secret", "fill", w, e.name, $[e.name].trim()]),
        ...d.map((e) => ["secret", "allow", w, e]),
        ...i.value && !r.row.helpers ? [["secret", "allow", w, "--helpers"]] : [],
        ...y.value.trim() !== r.row.title || g.value.trim() !== r.row.brief ? [["secret", "update", w, "--title", y.value.trim(), "--brief", g.value.trim()]] : []
      ];
    }
    async function Q() {
      L.value = !0;
      for (const d of K()) {
        const e = await r.run(d);
        if (!e.ok) {
          T.value = e.error, L.value = !1;
          return;
        }
      }
      b("close");
    }
    return (d, e) => (o(), D(a(W), {
      padded: "",
      title: s.row.title,
      onClose: e[7] || (e[7] = (l) => b("close"))
    }, {
      foot: u(() => [
        c(a(_), {
          onClick: e[6] || (e[6] = (l) => b("close"))
        }, {
          default: u(() => [...e[17] || (e[17] = [
            V("Cancel", -1)
          ])]),
          _: 1
        }),
        c(a(_), {
          variant: "primary",
          disabled: L.value || !y.value.trim(),
          "data-secret-save": "",
          onClick: Q
        }, {
          default: u(() => [...e[18] || (e[18] = [
            V("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: u(() => [
        n("div", ie, [
          s.row.waiting ? (o(), m("p", de, "The agent requested these credentials. Add them below, then save.")) : I("", !0),
          n("section", ue, [
            e[9] || (e[9] = n("span", { class: "label" }, "Credentials", -1)),
            (o(!0), m(U, null, P(k.value, (l) => (o(), m("div", {
              key: l.name,
              class: "field"
            }, [
              n("label", {
                for: `secret-${l.name}`
              }, A(l.name), 9, ce),
              n("div", pe, [
                Z(n("input", {
                  id: `secret-${l.name}`,
                  "onUpdate:modelValue": (O) => $[l.name] = O,
                  class: "value",
                  type: l.hidden ? "password" : "text",
                  autocomplete: "off",
                  placeholder: Y(l),
                  "data-secret-value": l.name
                }, null, 8, ve), [
                  [h, $[l.name]]
                ]),
                C.value ? (o(), D(a(_), {
                  key: 0,
                  variant: "icon",
                  title: `Remove the field ${l.name}`,
                  "data-secret-field-remove": l.name,
                  onClick: (O) => J(l)
                }, {
                  default: u(() => [
                    c(a(B), {
                      name: "close",
                      size: 12
                    })
                  ]),
                  _: 1
                }, 8, ["title", "data-secret-field-remove", "onClick"])) : I("", !0)
              ])
            ]))), 128)),
            C.value ? (o(), m("form", {
              key: 0,
              class: "line",
              "data-secret-field-add": "",
              onSubmit: H(G, ["prevent"])
            }, [
              c(a(x), {
                modelValue: F.value,
                "onUpdate:modelValue": e[0] || (e[0] = (l) => F.value = l),
                label: "Add a field"
              }, null, 8, ["modelValue"]),
              c(a(_), {
                bordered: "",
                type: "submit"
              }, {
                default: u(() => [...e[8] || (e[8] = [
                  V("Add", -1)
                ])]),
                _: 1
              })
            ], 32)) : I("", !0)
          ]),
          n("section", me, [
            e[12] || (e[12] = n("span", { class: "label" }, "Allowed programs", -1)),
            p.value.length ? (o(), m("div", fe, [
              (o(!0), m(U, null, P(p.value, (l) => (o(), m("span", {
                key: l,
                class: "chip",
                "data-secret-program": ""
              }, A(l), 1))), 128))
            ])) : (o(), m("span", ye, "No programs have access to this secret yet.")),
            (o(!0), m(U, null, P(v.value, (l) => (o(), m("div", {
              key: l,
              class: "proposal"
            }, [
              n("span", null, [
                e[10] || (e[10] = V("The agent proposed ", -1)),
                n("code", null, A(l), 1)
              ]),
              c(a(_), {
                small: "",
                variant: "primary",
                "data-secret-allow": l,
                onClick: (O) => z(l)
              }, {
                default: u(() => [
                  V("Allow " + A(l), 1)
                ]),
                _: 2
              }, 1032, ["data-secret-allow", "onClick"])
            ]))), 128)),
            n("form", {
              class: "line",
              "data-secret-program-add": "",
              onSubmit: e[2] || (e[2] = H((l) => z(t.value), ["prevent"]))
            }, [
              c(a(x), {
                modelValue: t.value,
                "onUpdate:modelValue": e[1] || (e[1] = (l) => t.value = l),
                label: "Allow a program, such as curl"
              }, null, 8, ["modelValue"]),
              c(a(_), {
                bordered: "",
                type: "submit",
                disabled: !t.value.trim()
              }, {
                default: u(() => [...e[11] || (e[11] = [
                  V("Allow", -1)
                ])]),
                _: 1
              }, 8, ["disabled"])
            ], 32)
          ]),
          n("section", ke, [
            e[15] || (e[15] = n("span", { class: "label" }, "Helpers", -1)),
            i.value ? (o(), m("span", we, "Helpers can use this secret too.")) : (o(), m("div", ge, [
              e[14] || (e[14] = n("span", null, "Helpers cannot use it.", -1)),
              c(a(_), {
                small: "",
                bordered: "",
                "data-secret-helpers": "",
                onClick: e[3] || (e[3] = (l) => i.value = !0)
              }, {
                default: u(() => [...e[13] || (e[13] = [
                  V("Allow helpers", -1)
                ])]),
                _: 1
              })
            ]))
          ]),
          n("section", be, [
            e[16] || (e[16] = n("span", { class: "label" }, "Title and note", -1)),
            c(a(x), {
              modelValue: y.value,
              "onUpdate:modelValue": e[4] || (e[4] = (l) => y.value = l),
              label: "Title",
              "data-secret-title": ""
            }, null, 8, ["modelValue"]),
            c(a(x), {
              modelValue: g.value,
              "onUpdate:modelValue": e[5] || (e[5] = (l) => g.value = l),
              label: "Note for the agent",
              "data-secret-note": ""
            }, null, 8, ["modelValue"])
          ]),
          T.value ? (o(), m("p", Ce, A(T.value), 1)) : I("", !0)
        ])
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Ve = /* @__PURE__ */ M($e, [["__scopeId", "data-v-bc1a9b84"]]), _e = { class: "sections" }, Ae = { class: "choice" }, Se = {
  class: "types",
  role: "radiogroup",
  "aria-label": "Type of secret"
}, Ne = ["aria-checked", "data-secret-type", "onClick"], De = {
  key: 1,
  class: "refusal",
  role: "alert"
}, Fe = {
  __name: "SecretNewDialog",
  props: { run: { type: Function, required: !0 } },
  emits: ["close"],
  setup(s, { emit: N }) {
    const r = [
      { key: "api key", icon: "key", title: "API key", line: "One hidden value, such as a token." },
      { key: "login", icon: "lock", title: "Login", line: "A username and a password." },
      { key: "custom", icon: "rows", title: "Custom", line: "Fields you name yourself." }
    ], b = s, w = N, C = f(r[0].key), y = f(""), g = f(""), $ = f(""), k = f(""), S = E(() => C.value === "custom"), F = E(() => y.value.trim() && (!S.value || $.value.trim()));
    async function p() {
      const v = S.value ? ["--field", $.value.trim()] : [], t = g.value.trim() ? ["--brief", g.value.trim()] : [], i = await b.run(["secret", "make", y.value.trim(), "--type", C.value, ...v, ...t]);
      if (i.ok) return w("close");
      k.value = i.error;
    }
    return (v, t) => (o(), D(a(W), {
      padded: "",
      title: "New secret",
      onClose: t[4] || (t[4] = (i) => w("close"))
    }, {
      foot: u(() => [
        c(a(_), {
          onClick: t[3] || (t[3] = (i) => w("close"))
        }, {
          default: u(() => [...t[7] || (t[7] = [
            V("Cancel", -1)
          ])]),
          _: 1
        }),
        c(a(_), {
          variant: "primary",
          disabled: !F.value,
          "data-secret-create": "",
          onClick: p
        }, {
          default: u(() => [...t[8] || (t[8] = [
            V("Create secret", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: u(() => [
        n("div", _e, [
          n("div", Ae, [
            t[5] || (t[5] = n("span", { class: "question" }, "What type of secret is it?", -1)),
            n("div", Se, [
              (o(), m(U, null, P(r, (i) => n("button", {
                key: i.key,
                type: "button",
                class: ee(["type", { picked: C.value === i.key }]),
                role: "radio",
                "aria-checked": C.value === i.key,
                "data-secret-type": i.key,
                onClick: (T) => C.value = i.key
              }, [
                c(a(B), {
                  name: i.icon,
                  size: 16
                }, null, 8, ["name"]),
                n("b", null, A(i.title), 1),
                n("span", null, A(i.line), 1)
              ], 10, Ne)), 64))
            ])
          ]),
          c(a(x), {
            modelValue: y.value,
            "onUpdate:modelValue": t[0] || (t[0] = (i) => y.value = i),
            label: "What is it for?",
            "data-secret-new-title": ""
          }, null, 8, ["modelValue"]),
          c(a(x), {
            modelValue: g.value,
            "onUpdate:modelValue": t[1] || (t[1] = (i) => g.value = i),
            label: "Note for the agent",
            "data-secret-new-note": ""
          }, null, 8, ["modelValue"]),
          S.value ? (o(), D(a(x), {
            key: 0,
            modelValue: $.value,
            "onUpdate:modelValue": t[2] || (t[2] = (i) => $.value = i),
            label: "First field name",
            "data-secret-first-field": ""
          }, null, 8, ["modelValue"])) : I("", !0),
          t[6] || (t[6] = n("p", { class: "line" }, "After creating the secret, select Add credentials to save your key or login.", -1)),
          k.value ? (o(), m("p", De, A(k.value), 1)) : I("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, Ie = /* @__PURE__ */ M(Fe, [["__scopeId", "data-v-8301a7e5"]]), xe = { "api key": "key", login: "lock", custom: "rows" }, Ue = { "api key": "API key", login: "Login", custom: "Custom" }, R = "Needs credentials", q = "Ready", Ee = (s) => ({
  id: s.id,
  title: s.title,
  icon: xe[s.secret_type],
  state: s.waiting ? R : Ue[s.secret_type],
  status: s.waiting ? R : q,
  line: s.brief || "Note: none",
  programs: s.programs.length ? s.programs.join(", ") : "none",
  row: s
}), Te = [{ key: "status", label: "State", options: [[q, q], [R, R]], get: (s) => s.status }];
function Pe(s, { edit: N, remove: r }) {
  return [
    { label: s.row.waiting ? "Add credentials" : "Replace value", group: "open", run: N },
    { label: "Copy name", group: "copy", run: ({ say: b }) => te(s.title, s.title, b) },
    { label: "Duplicate", group: "own", disabled: !0, reason: "A secret's value is never copied" },
    le({ word: "Delete", name: s.title, remove: r, erase: !0 })
  ];
}
const Re = {
  key: 0,
  class: "failure",
  role: "alert"
}, Le = {
  key: 2,
  class: "lead"
}, Oe = ["title"], qe = {
  class: "meta",
  "data-secret-helpers-line": ""
}, Be = {
  __name: "SecretRows",
  setup(s) {
    const N = ae(), { rows: r, failure: b, loaded: w, act: C } = N.props.secrets, y = f(0), g = f(!1), $ = E(() => r.value.map(Ee)), k = E(() => r.value.find((p) => p.id === y.value) ?? null), S = (p) => Pe(p, { edit: () => y.value = p.id, remove: () => C(["secret", "delete", String(p.id)], re(p.id)) }), F = (p) => ({ head: p.title, items: S(p) });
    return (p, v) => (o(), m(U, null, [
      c(a(se), {
        title: "Secrets",
        items: $.value,
        fields: a(Te),
        place: F,
        "empty-title": "No secrets yet",
        "data-secrets": ""
      }, {
        primary: u(() => [
          c(a(_), {
            small: "",
            variant: "primary",
            "data-secret-new": "",
            onClick: v[0] || (v[0] = (t) => g.value = !0)
          }, {
            default: u(() => [
              c(a(B), {
                name: "plus",
                size: 12
              }),
              v[3] || (v[3] = V("New secret", -1))
            ]),
            _: 1
          })
        ]),
        empty: u(() => [
          a(b) ? (o(), m("p", Re, A(a(b)), 1)) : a(w) ? (o(), m("p", Le, "Add a key or login to get started. Only its name will appear here.")) : (o(), D(a(ne), {
            key: 1,
            shape: "rows"
          }))
        ]),
        card: u(({ item: t }) => [
          n("p", {
            class: "meta",
            "data-secret-programs": "",
            title: t.programs
          }, "Programs: " + A(t.programs), 9, Oe),
          n("p", qe, "Helpers: " + A(t.row.helpers ? "can use it" : "cannot use it"), 1)
        ]),
        foot: u(({ item: t }) => [
          t.row.waiting ? (o(), D(a(_), {
            key: 0,
            small: "",
            variant: "primary",
            "data-secret-ask": t.id,
            onClick: (i) => y.value = t.id
          }, {
            default: u(() => [...v[4] || (v[4] = [
              V("Add credentials", -1)
            ])]),
            _: 1
          }, 8, ["data-secret-ask", "onClick"])) : (o(), D(a(_), {
            key: 1,
            small: "",
            bordered: "",
            "data-secret-update": "",
            onClick: (i) => y.value = t.id
          }, {
            default: u(() => [...v[5] || (v[5] = [
              V("Edit secret", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]))
        ]),
        "card-actions": u(({ item: t }) => [
          c(a(oe), {
            items: S(t),
            head: t.title
          }, null, 8, ["items", "head"])
        ]),
        _: 1
      }, 8, ["items", "fields"]),
      k.value ? (o(), D(Ve, {
        key: k.value.id,
        row: k.value,
        run: a(C),
        onClose: v[1] || (v[1] = (t) => y.value = 0)
      }, null, 8, ["row", "run"])) : I("", !0),
      g.value ? (o(), D(Ie, {
        key: 1,
        run: a(C),
        onClose: v[2] || (v[2] = (t) => g.value = !1)
      }, null, 8, ["run"])) : I("", !0)
    ], 64));
  }
}, He = /* @__PURE__ */ M(Be, [["__scopeId", "data-v-0833ef9e"]]);
export {
  He as default
};
