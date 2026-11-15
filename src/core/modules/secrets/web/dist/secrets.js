if (!document.getElementById("window-styles-c17468a2f72f")) { const style = document.createElement("style"); style.id = "window-styles-c17468a2f72f"; style.textContent = ".sections[data-v-52daba56]{display:flex;flex-direction:column;gap:18px}.section[data-v-52daba56]{display:flex;flex-direction:column;gap:10px}.label[data-v-52daba56]{color:var(--text-4);font-size:10.5px;font-weight:600;letter-spacing:.06em;text-transform:uppercase}.lead[data-v-52daba56]{margin:0;color:var(--text-2);font-size:12.5px;line-height:1.55}.field[data-v-52daba56]{display:flex;flex-direction:column;gap:5px;color:var(--text-2);font-size:12.5px;font-weight:500}.line[data-v-52daba56]{display:flex;align-items:center;gap:8px}.line[data-v-52daba56]>:first-child{flex:1;min-width:0}.value[data-v-52daba56]{box-sizing:border-box;width:100%;height:30px;padding:0 9px;border:1px solid var(--border-2);border-radius:7px;outline:none;background:var(--bg);color:var(--text);font:inherit;font-weight:400}.value[data-v-52daba56]:focus{border-color:var(--accent)}.chips[data-v-52daba56]{display:flex;flex-wrap:wrap;gap:6px}.chip[data-v-52daba56]{display:inline-flex;align-items:center;height:22px;padding:0 9px;border-radius:6px;background:var(--chip);color:var(--text-2);font-family:var(--mono);font-size:11.5px}.muted[data-v-52daba56]{color:var(--text-3);font-size:12.5px}.proposal[data-v-52daba56]{display:flex;flex-wrap:wrap;align-items:center;gap:10px;color:var(--text-2);font-size:12.5px}code[data-v-52daba56]{padding:1px 6px;border-radius:5px;background:var(--chip);font-family:var(--mono);font-size:11.5px}.refusal[data-v-52daba56]{margin:0;color:var(--danger);font-size:12.5px}.sections[data-v-3f1d222b]{display:flex;flex-direction:column;gap:14px}.choice[data-v-3f1d222b]{display:flex;flex-direction:column;gap:5px}.question[data-v-3f1d222b]{color:var(--text-2);font-size:12.5px;font-weight:500}.types[data-v-3f1d222b]{display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:8px}.type[data-v-3f1d222b]{display:flex;flex-direction:column;gap:3px;padding:10px;border:1px solid var(--border-2);border-radius:10px;background:var(--bg);color:var(--text-3);font:inherit;text-align:left;cursor:pointer}.type b[data-v-3f1d222b]{color:var(--text);font-size:13px;font-weight:600}.type span[data-v-3f1d222b]{font-size:11.5px;line-height:1.4}.type.picked[data-v-3f1d222b]{border-color:var(--accent);background:var(--accent-dim);color:var(--accent-text)}.type.picked b[data-v-3f1d222b]{color:var(--accent-text)}.line[data-v-3f1d222b]{margin:0;color:var(--text-2);font-size:12.5px;line-height:1.55}.refusal[data-v-3f1d222b]{margin:0;color:var(--danger);font-size:12.5px}.lead[data-v-65faf47b]{max-width:640px;margin:0;color:var(--text-3);font-size:12.5px;line-height:1.55}.meta[data-v-65faf47b]{margin:0;overflow:hidden;color:var(--text-3);font-size:12px;text-overflow:ellipsis;white-space:nowrap}.failure[data-v-65faf47b]{margin:0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { computed as U, ref as y, reactive as Z, openBlock as o, createBlock as D, unref as s, withCtx as u, createElementVNode as n, createElementBlock as m, createCommentVNode as I, Fragment as T, renderList as O, toDisplayString as A, withDirectives as h, vModelDynamic as ee, createVNode as v, withModifiers as j, createTextVNode as V, normalizeClass as te } from "vue";
import { Dialog as z, Btn as _, Icon as W, TextInput as x, copying as le, deleteItem as ae, useWindow as se, CardPage as oe, ActionsMenu as ne, Skeleton as re, removed as ie } from "@journal/window-kit";
const M = (a, N) => {
  const r = a.__vccOpts || a;
  for (const [b, w] of N)
    r[b] = w;
  return r;
}, de = { class: "sections" }, ue = {
  key: 0,
  class: "lead"
}, ce = { class: "section" }, pe = ["for"], ve = { class: "line" }, me = ["id", "onUpdate:modelValue", "type", "placeholder", "data-secret-value"], ye = { class: "section" }, fe = {
  key: 0,
  class: "chips"
}, ke = {
  key: 1,
  class: "muted"
}, we = { class: "section" }, ge = {
  key: 0,
  class: "muted"
}, be = {
  key: 1,
  class: "proposal"
}, Ce = { class: "section" }, $e = {
  key: 1,
  class: "refusal",
  role: "alert"
}, Ve = {
  __name: "SecretDialog",
  props: { row: { type: Object, required: !0 }, run: { type: Function, required: !0 } },
  emits: ["close"],
  setup(a, { emit: N }) {
    const r = a, b = N, w = String(r.row.id), C = U(() => r.row.secret_type === "custom"), f = y(r.row.title), g = y(r.row.brief), $ = Z({}), k = y(r.row.fields.map((d) => ({ ...d, added: !1 }))), S = y([]), F = y(""), c = y([...r.row.programs]), p = y([...r.row.proposed]), t = y(""), i = y(r.row.helpers), E = y(""), R = y(!1), Y = (d) => r.row.filled.includes(d.name), G = (d) => Y(d) ? "Leave blank to keep the saved credential" : "Paste or type your credential";
    function J() {
      const d = F.value.trim();
      !d || k.value.some((e) => e.name === d) || (k.value = [...k.value, { name: d, hidden: !0, added: !0 }], F.value = "");
    }
    function K(d) {
      k.value = k.value.filter((e) => e.name !== d.name), d.added || (S.value = [...S.value, d.name]), delete $[d.name];
    }
    function H(d) {
      const e = d.trim();
      e && !c.value.includes(e) && (c.value = [...c.value, e]), p.value = p.value.filter((l) => l !== e), t.value = "";
    }
    function Q() {
      const d = c.value.filter((e) => !r.row.programs.includes(e));
      return [
        ...k.value.filter((e) => e.added).map((e) => ["secret", "update", w, "--add-field", e.name]),
        ...S.value.map((e) => ["secret", "update", w, "--remove-field", e]),
        ...k.value.filter((e) => ($[e.name] ?? "").trim()).map((e) => ["secret", "fill", w, e.name, $[e.name].trim()]),
        ...d.map((e) => ["secret", "allow", w, e]),
        ...i.value && !r.row.helpers ? [["secret", "allow", w, "--helpers"]] : [],
        ...f.value.trim() !== r.row.title || g.value.trim() !== r.row.brief ? [["secret", "update", w, "--title", f.value.trim(), "--brief", g.value.trim()]] : []
      ];
    }
    async function X() {
      R.value = !0;
      for (const d of Q()) {
        const e = await r.run(d);
        if (!e.ok) {
          E.value = e.error, R.value = !1;
          return;
        }
      }
      b("close");
    }
    return (d, e) => (o(), D(s(z), {
      padded: "",
      title: a.row.title,
      onClose: e[7] || (e[7] = (l) => b("close"))
    }, {
      foot: u(() => [
        v(s(_), {
          onClick: e[6] || (e[6] = (l) => b("close"))
        }, {
          default: u(() => [...e[17] || (e[17] = [
            V("Cancel", -1)
          ])]),
          _: 1
        }),
        v(s(_), {
          variant: "primary",
          disabled: R.value || !f.value.trim(),
          "data-secret-save": "",
          onClick: X
        }, {
          default: u(() => [...e[18] || (e[18] = [
            V("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: u(() => [
        n("div", de, [
          a.row.waiting ? (o(), m("p", ue, "The agent requested these credentials. Add them below, then save.")) : I("", !0),
          n("section", ce, [
            e[9] || (e[9] = n("span", { class: "label" }, "Credentials", -1)),
            (o(!0), m(T, null, O(k.value, (l) => (o(), m("div", {
              key: l.name,
              class: "field"
            }, [
              n("label", {
                for: `secret-${l.name}`
              }, A(l.name), 9, pe),
              n("div", ve, [
                h(n("input", {
                  id: `secret-${l.name}`,
                  "onUpdate:modelValue": (L) => $[l.name] = L,
                  class: "value",
                  type: l.hidden ? "password" : "text",
                  autocomplete: "off",
                  placeholder: G(l),
                  "data-secret-value": l.name
                }, null, 8, me), [
                  [ee, $[l.name]]
                ]),
                C.value ? (o(), D(s(_), {
                  key: 0,
                  variant: "icon",
                  title: `Remove the field ${l.name}`,
                  "data-secret-field-remove": l.name,
                  onClick: (L) => K(l)
                }, {
                  default: u(() => [
                    v(s(W), {
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
              onSubmit: j(J, ["prevent"])
            }, [
              v(s(x), {
                modelValue: F.value,
                "onUpdate:modelValue": e[0] || (e[0] = (l) => F.value = l),
                label: "Add a field"
              }, null, 8, ["modelValue"]),
              v(s(_), {
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
          n("section", ye, [
            e[12] || (e[12] = n("span", { class: "label" }, "Allowed programs", -1)),
            c.value.length ? (o(), m("div", fe, [
              (o(!0), m(T, null, O(c.value, (l) => (o(), m("span", {
                key: l,
                class: "chip",
                "data-secret-program": ""
              }, A(l), 1))), 128))
            ])) : (o(), m("span", ke, "No programs have access to this secret yet.")),
            (o(!0), m(T, null, O(p.value, (l) => (o(), m("div", {
              key: l,
              class: "proposal"
            }, [
              n("span", null, [
                e[10] || (e[10] = V("The agent proposed ", -1)),
                n("code", null, A(l), 1)
              ]),
              v(s(_), {
                small: "",
                variant: "primary",
                "data-secret-allow": l,
                onClick: (L) => H(l)
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
              onSubmit: e[2] || (e[2] = j((l) => H(t.value), ["prevent"]))
            }, [
              v(s(x), {
                modelValue: t.value,
                "onUpdate:modelValue": e[1] || (e[1] = (l) => t.value = l),
                label: "Allow a program, such as curl"
              }, null, 8, ["modelValue"]),
              v(s(_), {
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
          n("section", we, [
            e[15] || (e[15] = n("span", { class: "label" }, "Helpers", -1)),
            i.value ? (o(), m("span", ge, "Helpers can use this secret too.")) : (o(), m("div", be, [
              e[14] || (e[14] = n("span", null, "Helpers cannot use it.", -1)),
              v(s(_), {
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
          n("section", Ce, [
            e[16] || (e[16] = n("span", { class: "label" }, "Title and note", -1)),
            v(s(x), {
              modelValue: f.value,
              "onUpdate:modelValue": e[4] || (e[4] = (l) => f.value = l),
              label: "Title",
              "data-secret-title": ""
            }, null, 8, ["modelValue"]),
            v(s(x), {
              modelValue: g.value,
              "onUpdate:modelValue": e[5] || (e[5] = (l) => g.value = l),
              label: "Note for the agent",
              "data-secret-note": ""
            }, null, 8, ["modelValue"])
          ]),
          E.value ? (o(), m("p", $e, A(E.value), 1)) : I("", !0)
        ])
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, _e = /* @__PURE__ */ M(Ve, [["__scopeId", "data-v-52daba56"]]), Ae = { class: "sections" }, Se = { class: "choice" }, Ne = {
  class: "types",
  role: "radiogroup",
  "aria-label": "Type of secret"
}, De = ["aria-checked", "data-secret-type", "onClick"], Fe = {
  key: 1,
  class: "refusal",
  role: "alert"
}, Ie = {
  __name: "SecretNewDialog",
  props: { run: { type: Function, required: !0 } },
  emits: ["close"],
  setup(a, { emit: N }) {
    const r = [
      { key: "api key", icon: "key", title: "API key", line: "One hidden value, such as a token." },
      { key: "login", icon: "lock", title: "Login", line: "A username and a password." },
      { key: "custom", icon: "rows", title: "Custom", line: "Fields you name yourself." }
    ], b = a, w = N, C = y(r[0].key), f = y(""), g = y(""), $ = y(""), k = y(""), S = U(() => C.value === "custom"), F = U(() => f.value.trim() && (!S.value || $.value.trim()));
    async function c() {
      const p = S.value ? ["--field", $.value.trim()] : [], t = g.value.trim() ? ["--brief", g.value.trim()] : [], i = await b.run(["secret", "make", f.value.trim(), "--type", C.value, ...p, ...t]);
      if (i.ok) return w("close");
      k.value = i.error;
    }
    return (p, t) => (o(), D(s(z), {
      padded: "",
      title: "New secret",
      onClose: t[4] || (t[4] = (i) => w("close"))
    }, {
      foot: u(() => [
        v(s(_), {
          onClick: t[3] || (t[3] = (i) => w("close"))
        }, {
          default: u(() => [...t[7] || (t[7] = [
            V("Cancel", -1)
          ])]),
          _: 1
        }),
        v(s(_), {
          variant: "primary",
          disabled: !F.value,
          "data-secret-create": "",
          onClick: c
        }, {
          default: u(() => [...t[8] || (t[8] = [
            V("Create secret", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: u(() => [
        n("div", Ae, [
          n("div", Se, [
            t[5] || (t[5] = n("span", { class: "question" }, "What type of secret is it?", -1)),
            n("div", Ne, [
              (o(), m(T, null, O(r, (i) => n("button", {
                key: i.key,
                type: "button",
                class: te(["type", { picked: C.value === i.key }]),
                role: "radio",
                "aria-checked": C.value === i.key,
                "data-secret-type": i.key,
                onClick: (E) => C.value = i.key
              }, [
                v(s(W), {
                  name: i.icon,
                  size: 16
                }, null, 8, ["name"]),
                n("b", null, A(i.title), 1),
                n("span", null, A(i.line), 1)
              ], 10, De)), 64))
            ])
          ]),
          v(s(x), {
            modelValue: f.value,
            "onUpdate:modelValue": t[0] || (t[0] = (i) => f.value = i),
            label: "What is it for?",
            "data-secret-new-title": ""
          }, null, 8, ["modelValue"]),
          v(s(x), {
            modelValue: g.value,
            "onUpdate:modelValue": t[1] || (t[1] = (i) => g.value = i),
            label: "Note for the agent",
            "data-secret-new-note": ""
          }, null, 8, ["modelValue"]),
          S.value ? (o(), D(s(x), {
            key: 0,
            modelValue: $.value,
            "onUpdate:modelValue": t[2] || (t[2] = (i) => $.value = i),
            label: "First field name",
            "data-secret-first-field": ""
          }, null, 8, ["modelValue"])) : I("", !0),
          t[6] || (t[6] = n("p", { class: "line" }, "After creating the secret, select Add credentials to save your key or login.", -1)),
          k.value ? (o(), m("p", Fe, A(k.value), 1)) : I("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, xe = /* @__PURE__ */ M(Ie, [["__scopeId", "data-v-3f1d222b"]]), Te = { "api key": "key", login: "lock", custom: "rows" }, q = { "api key": "API key", login: "Login", custom: "Custom" }, P = "Needs credentials", B = "Ready", Ue = (a) => ({
  id: a.id,
  title: a.title,
  icon: Te[a.secret_type],
  state: a.waiting ? P : q[a.secret_type],
  status: a.waiting ? P : B,
  kind: q[a.secret_type],
  line: a.brief || "Note: none",
  programs: a.programs.length ? a.programs.join(", ") : "none",
  row: a
}), Ee = [
  { key: "status", label: "State", options: [[B, B], [P, P]], get: (a) => a.status },
  { key: "kind", label: "Type", options: Object.values(q).map((a) => [a, a]), get: (a) => a.kind }
];
function Oe(a, { edit: N, remove: r }) {
  return [
    { label: a.row.waiting ? "Add credentials" : "Replace value", group: "open", run: N },
    { label: "Copy name", group: "copy", run: ({ say: b }) => le(a.title, a.title, b) },
    { label: "Duplicate", group: "own", disabled: !0, reason: "A secret's value is never copied" },
    ae({ word: "Delete", name: a.title, remove: r, erase: !0 })
  ];
}
const Pe = {
  key: 0,
  class: "failure",
  role: "alert"
}, Re = {
  key: 2,
  class: "lead"
}, Le = ["title"], qe = {
  class: "meta",
  "data-secret-helpers-line": ""
}, Be = {
  __name: "SecretRows",
  setup(a) {
    const N = se(), { rows: r, failure: b, loaded: w, act: C } = N.props.secrets, f = y(0), g = y(!1), $ = U(() => r.value.map(Ue)), k = U(() => r.value.find((c) => c.id === f.value) ?? null), S = (c) => Oe(c, { edit: () => f.value = c.id, remove: () => C(["secret", "delete", String(c.id)], ie(c.id)) }), F = (c) => ({ head: c.title, items: S(c) });
    return (c, p) => (o(), m(T, null, [
      v(s(oe), {
        title: "Secrets",
        items: $.value,
        fields: s(Ee),
        place: F,
        "empty-title": "No secrets yet",
        "data-secrets": ""
      }, {
        primary: u(() => [
          v(s(_), {
            small: "",
            variant: "primary",
            "data-secret-new": "",
            onClick: p[0] || (p[0] = (t) => g.value = !0)
          }, {
            default: u(() => [...p[3] || (p[3] = [
              V("New secret", -1)
            ])]),
            _: 1
          })
        ]),
        empty: u(() => [
          s(b) ? (o(), m("p", Pe, A(s(b)), 1)) : s(w) ? (o(), m("p", Re, "Add a key or login to get started. Only its name will appear here.")) : (o(), D(s(re), {
            key: 1,
            shape: "rows"
          }))
        ]),
        card: u(({ item: t }) => [
          n("p", {
            class: "meta",
            "data-secret-programs": "",
            title: t.programs
          }, "Programs: " + A(t.programs), 9, Le),
          n("p", qe, "Helpers: " + A(t.row.helpers ? "can use it" : "cannot use it"), 1)
        ]),
        foot: u(({ item: t }) => [
          t.row.waiting ? (o(), D(s(_), {
            key: 0,
            small: "",
            variant: "primary",
            "data-secret-ask": t.id,
            onClick: (i) => f.value = t.id
          }, {
            default: u(() => [...p[4] || (p[4] = [
              V("Add credentials", -1)
            ])]),
            _: 1
          }, 8, ["data-secret-ask", "onClick"])) : (o(), D(s(_), {
            key: 1,
            small: "",
            bordered: "",
            "data-secret-update": "",
            onClick: (i) => f.value = t.id
          }, {
            default: u(() => [...p[5] || (p[5] = [
              V("Edit secret", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]))
        ]),
        "card-actions": u(({ item: t }) => [
          v(s(ne), {
            items: S(t),
            head: t.title
          }, null, 8, ["items", "head"])
        ]),
        _: 1
      }, 8, ["items", "fields"]),
      k.value ? (o(), D(_e, {
        key: k.value.id,
        row: k.value,
        run: s(C),
        onClose: p[1] || (p[1] = (t) => f.value = 0)
      }, null, 8, ["row", "run"])) : I("", !0),
      g.value ? (o(), D(xe, {
        key: 1,
        run: s(C),
        onClose: p[2] || (p[2] = (t) => g.value = !1)
      }, null, 8, ["run"])) : I("", !0)
    ], 64));
  }
}, je = /* @__PURE__ */ M(Be, [["__scopeId", "data-v-65faf47b"]]);
export {
  je as default
};
