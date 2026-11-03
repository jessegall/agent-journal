/* @code-commandments-generated */
if (!document.getElementById("window-styles-affb1076006a")) { const style = document.createElement("style"); style.id = "window-styles-affb1076006a"; style.textContent = ".domain[data-v-2b8b5b75]{display:flex;flex-direction:column;gap:4px}.name[data-v-2b8b5b75]{overflow-wrap:anywhere}.fine[data-v-2b8b5b75]{margin:0;color:var(--text-3);font-size:12px}.row[data-v-2b8b5b75]{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.login[data-v-2d10db84]{display:flex;flex-direction:column;gap:6px}label[data-v-2d10db84]{color:var(--text-3);font-size:12px}input[data-v-2d10db84]{padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:13px}.fine[data-v-2d10db84]{margin:0;color:var(--text-3);font-size:12px}.failure[data-v-2d10db84]{margin:0;color:var(--danger);font-size:12.5px}.actions[data-v-2d10db84]{display:flex;gap:8px}.account[data-v-baff373f]{display:flex;flex-direction:column;gap:18px;max-width:640px}.part[data-v-baff373f]{display:flex;flex-direction:column;gap:8px}h3[data-v-baff373f]{margin:0;font-size:13px;font-weight:600}.line[data-v-baff373f]{margin:0;color:var(--text-2);line-height:1.5}.fine[data-v-baff373f]{margin:0;color:var(--text-3);font-size:12px}.failure[data-v-baff373f]{margin:0;color:var(--danger);font-size:12.5px}.row[data-v-baff373f]{display:flex;flex-wrap:wrap;align-items:center;gap:8px}input[data-v-baff373f]{flex:1;min-width:0;padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:13px}\n"; document.head.appendChild(style); }
import { ref as v, openBlock as a, createElementBlock as s, createElementVNode as n, toDisplayString as b, createCommentVNode as $, createBlock as I, unref as f, withCtx as c, createTextVNode as m, Fragment as x, withModifiers as E, withDirectives as A, vModelText as V, createVNode as g, renderList as B } from "vue";
import { Btn as y, useWindow as R, WindowRoom as O, Skeleton as F } from "@journal/window-kit";
const L = (r, S) => {
  const o = r.__vccOpts || r;
  for (const [i, w] of S)
    o[i] = w;
  return o;
}, G = ["data-tunler-domain"], K = { class: "row" }, P = { class: "name" }, W = {
  key: 0,
  class: "fine"
}, q = { class: "row" }, z = "journal.tunnels.tunler.subdomain", H = {
  __name: "TunlerDomain",
  props: { domain: { type: Object, required: !0 } },
  emits: ["run"],
  setup(r, { emit: S }) {
    const o = S, i = v(""), w = v(""), T = (u, l) => ["setting", "set", u, l, "--project"];
    function k(...u) {
      i.value = "", o("run", u);
    }
    const C = (u) => k(T(z, w.value.trim()), ["tunler", "release", u.name]);
    return (u, l) => (a(), s("div", {
      class: "domain",
      "data-tunler-domain": r.domain.name
    }, [
      n("div", K, [
        n("span", P, b(r.domain.name), 1),
        r.domain.own ? (a(), s("span", W, "In use")) : $("", !0),
        i.value !== r.domain.name ? (a(), I(f(y), {
          key: 1,
          small: "",
          "data-tunler-release": "",
          onClick: l[0] || (l[0] = (d) => i.value = r.domain.name)
        }, {
          default: c(() => [
            m(b(r.domain.own ? "Move to a new address" : "Release"), 1)
          ]),
          _: 1
        })) : $("", !0)
      ]),
      i.value === r.domain.name && r.domain.own ? (a(), s(x, { key: 0 }, [
        l[8] || (l[8] = n("p", { class: "fine" }, "Share links stop working and a paired phone has to be paired again.", -1)),
        n("form", {
          class: "row",
          "data-tunler-move": "",
          onSubmit: l[3] || (l[3] = E((d) => C(r.domain), ["prevent"]))
        }, [
          A(n("input", {
            "onUpdate:modelValue": l[1] || (l[1] = (d) => w.value = d),
            placeholder: "The new name",
            "aria-label": "The new name"
          }, null, 512), [
            [V, w.value]
          ]),
          g(f(y), {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !w.value.trim()
          }, {
            default: c(() => [...l[6] || (l[6] = [
              m("Move to the new address", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          g(f(y), {
            small: "",
            onClick: l[2] || (l[2] = (d) => i.value = "")
          }, {
            default: c(() => [...l[7] || (l[7] = [
              m("Keep it", -1)
            ])]),
            _: 1
          })
        ], 32)
      ], 64)) : i.value === r.domain.name ? (a(), s(x, { key: 1 }, [
        l[11] || (l[11] = n("p", { class: "fine" }, "Release it? Anyone can claim it after.", -1)),
        n("div", q, [
          g(f(y), {
            small: "",
            kind: "primary",
            "data-tunler-release-confirm": "",
            onClick: l[4] || (l[4] = (d) => k(["tunler", "release", r.domain.name]))
          }, {
            default: c(() => [...l[9] || (l[9] = [
              m("Release the address", -1)
            ])]),
            _: 1
          }),
          g(f(y), {
            small: "",
            onClick: l[5] || (l[5] = (d) => i.value = "")
          }, {
            default: c(() => [...l[10] || (l[10] = [
              m("Keep it", -1)
            ])]),
            _: 1
          })
        ])
      ], 64)) : $("", !0)
    ], 8, G));
  }
}, J = /* @__PURE__ */ L(H, [["__scopeId", "data-v-2b8b5b75"]]), Q = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-tunler-login-failure": ""
}, X = { class: "actions" }, Y = {
  __name: "TunlerLoginForm",
  props: { host: { type: String, default: "" } },
  emits: ["ready"],
  setup(r, { emit: S }) {
    const o = r, i = S, w = R(), T = v(o.host), k = v(""), C = v(""), u = v(""), l = v(!1), d = v(!1), U = v("");
    async function D() {
      d.value = !0;
      const N = u.value ? ["--master", u.value] : [], t = await w.run(["tunler", "login", T.value.trim(), k.value.trim(), C.value, ...N]);
      if (d.value = !1, U.value = t.ok ? "" : t.error, !!t.ok) {
        if (t.value.connected) {
          C.value = "", u.value = "", i("ready");
          return;
        }
        l.value = t.value.needs_master, U.value = t.value.error;
      }
    }
    return (N, t) => (a(), s("form", {
      class: "login",
      "data-tunler-login": "",
      onSubmit: E(D, ["prevent"])
    }, [
      t[4] || (t[4] = n("label", { for: "tunler-server" }, "Tunler server address", -1)),
      A(n("input", {
        id: "tunler-server",
        "onUpdate:modelValue": t[0] || (t[0] = (e) => T.value = e),
        placeholder: "tunler.example.com",
        autocomplete: "off"
      }, null, 512), [
        [V, T.value]
      ]),
      t[5] || (t[5] = n("label", { for: "tunler-username" }, "Username", -1)),
      A(n("input", {
        id: "tunler-username",
        "onUpdate:modelValue": t[1] || (t[1] = (e) => k.value = e),
        autocomplete: "username"
      }, null, 512), [
        [V, k.value]
      ]),
      t[6] || (t[6] = n("label", { for: "tunler-password" }, "Password", -1)),
      A(n("input", {
        id: "tunler-password",
        "onUpdate:modelValue": t[2] || (t[2] = (e) => C.value = e),
        type: "password",
        autocomplete: "current-password"
      }, null, 512), [
        [V, C.value]
      ]),
      t[7] || (t[7] = n("p", { class: "fine" }, "At least 8 characters.", -1)),
      t[8] || (t[8] = n("label", { for: "tunler-master" }, "Master password", -1)),
      A(n("input", {
        id: "tunler-master",
        "onUpdate:modelValue": t[3] || (t[3] = (e) => u.value = e),
        type: "password",
        autocomplete: "off",
        "data-tunler-master": ""
      }, null, 512), [
        [V, u.value]
      ]),
      t[9] || (t[9] = n("p", { class: "fine" }, "Only to create a new account.", -1)),
      U.value ? (a(), s("p", Q, b(U.value), 1)) : $("", !0),
      n("div", X, [
        g(f(y), {
          small: "",
          kind: "primary",
          type: "submit",
          busy: d.value,
          "data-tunler-connect": ""
        }, {
          default: c(() => [
            m(b(l.value ? "Create the account" : "Connect"), 1)
          ]),
          _: 1
        }, 8, ["busy"])
      ]),
      t[10] || (t[10] = n("p", { class: "fine" }, "A forgotten password can't be recovered: make a new account. Accounts unused for 30 days are deleted with their domains.", -1))
    ], 32));
  }
}, Z = /* @__PURE__ */ L(Y, [["__scopeId", "data-v-2d10db84"]]), _ = {
  class: "account",
  "data-tunler": ""
}, ee = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-tunler-failure": ""
}, te = { class: "part" }, ne = {
  class: "line",
  "data-tunler-account": ""
}, le = { class: "line" }, ae = { class: "row" }, se = {
  key: 0,
  class: "line"
}, oe = {
  key: 1,
  class: "line",
  "data-tunler-rejected": ""
}, ue = {
  key: 2,
  class: "line"
}, re = {
  key: 3,
  class: "row"
}, ie = {
  key: 3,
  class: "row",
  "data-tunler-version": ""
}, de = { class: "line" }, me = { class: "fine" }, ve = {
  key: 1,
  class: "fine"
}, pe = {
  key: 0,
  class: "part"
}, fe = {
  class: "line",
  "data-tunler-in-use": ""
}, ce = {
  key: 1,
  class: "part"
}, ke = "journal.tunnels.tunler.subdomain", M = "journal.core.tunnel.service", ye = {
  __name: "TunlerAccount",
  setup(r) {
    const S = R(), o = v(null), i = v(null), w = v([]), T = v(""), k = v(!1), C = v(""), u = v("");
    async function l() {
      var p;
      const [t, e, j] = await Promise.all([S.read("tunler status"), S.read("tunler version"), S.read("tunler domains")]);
      T.value = t.ok ? "" : t.error, o.value = t.ok ? t.value : null, i.value = e.ok ? e.value : null, w.value = j.ok ? j.value.domains : [], u.value = ((p = o.value) == null ? void 0 : p.subdomain) ?? "";
    }
    async function d(...t) {
      for (const e of t) {
        const j = await S.run(e);
        if (T.value = j.ok ? "" : j.error, !j.ok) break;
      }
      await l();
    }
    const U = (t, e) => ["setting", "set", t, e, "--project"], D = () => d(U(ke, u.value.trim()), U(M, "tunler"));
    function N() {
      k.value = !1, l();
    }
    return l(), (t, e) => (a(), I(f(O), null, {
      default: c(() => {
        var j;
        return [
          n("div", _, [
            T.value ? (a(), s("p", ee, b(T.value), 1)) : $("", !0),
            o.value ? (a(), s(x, { key: 2 }, [
              n("section", te, [
                e[19] || (e[19] = n("h3", null, "Connection", -1)),
                o.value.installed ? o.value.authenticated && !k.value ? (a(), s(x, { key: 1 }, [
                  n("p", ne, [
                    e[11] || (e[11] = m("Connected as ", -1)),
                    n("b", null, b(o.value.account), 1),
                    e[12] || (e[12] = m(" on ", -1)),
                    n("b", null, b(o.value.host), 1),
                    e[13] || (e[13] = m(". Every journal on this machine uses this login.", -1))
                  ]),
                  n("p", le, [
                    e[14] || (e[14] = m("tunler is installed at ", -1)),
                    n("code", null, b(o.value.command), 1)
                  ]),
                  n("div", ae, [
                    g(f(y), {
                      small: "",
                      "data-tunler-switch": "",
                      onClick: e[2] || (e[2] = (p) => k.value = !0)
                    }, {
                      default: c(() => [...e[15] || (e[15] = [
                        m("Use another account", -1)
                      ])]),
                      _: 1
                    }),
                    g(f(y), {
                      small: "",
                      "data-tunler-logout": "",
                      onClick: e[3] || (e[3] = (p) => d(["tunler", "logout"]))
                    }, {
                      default: c(() => [...e[16] || (e[16] = [
                        m("Log out", -1)
                      ])]),
                      _: 1
                    })
                  ])
                ], 64)) : (a(), s(x, { key: 2 }, [
                  k.value ? (a(), s("p", se, "Logging in with another account replaces the current login for every journal here. Each journal's address stays with the account that claimed it, so those addresses stop answering until you switch back with that account's password.")) : o.value.rejected ? (a(), s("p", oe, "The tunler server no longer accepts the saved login. Log in again.")) : (a(), s("p", ue, "No account is connected here. Log in once, and every journal on this machine uses that account.")),
                  g(Z, {
                    host: o.value.host ?? "",
                    onReady: N
                  }, null, 8, ["host"]),
                  k.value ? (a(), s("div", re, [
                    g(f(y), {
                      small: "",
                      onClick: e[4] || (e[4] = (p) => k.value = !1)
                    }, {
                      default: c(() => [...e[17] || (e[17] = [
                        m("Keep the current account", -1)
                      ])]),
                      _: 1
                    })
                  ])) : $("", !0)
                ], 64)) : (a(), s(x, { key: 0 }, [
                  e[10] || (e[10] = n("p", { class: "line" }, "tunler isn't installed on this machine, so sharing and phones can't reach it.", -1)),
                  n("form", {
                    class: "row",
                    "data-tunler-install": "",
                    onSubmit: e[1] || (e[1] = E((p) => d(["tunler", "install", C.value.trim()]), ["prevent"]))
                  }, [
                    A(n("input", {
                      "onUpdate:modelValue": e[0] || (e[0] = (p) => C.value = p),
                      placeholder: "tunler.example.com",
                      "aria-label": "Tunler server address"
                    }, null, 512), [
                      [V, C.value]
                    ]),
                    g(f(y), {
                      small: "",
                      kind: "primary",
                      type: "submit"
                    }, {
                      default: c(() => [...e[9] || (e[9] = [
                        m("Install tunler", -1)
                      ])]),
                      _: 1
                    })
                  ], 32)
                ], 64)),
                (j = i.value) != null && j.current ? (a(), s("div", ie, [
                  n("span", de, "tunler " + b(i.value.current), 1),
                  i.value.update_available ? (a(), s(x, { key: 0 }, [
                    n("span", me, b(i.value.latest) + " is available", 1),
                    g(f(y), {
                      small: "",
                      kind: "primary",
                      "data-tunler-update": "",
                      onClick: e[5] || (e[5] = (p) => d(["tunler", "update"]))
                    }, {
                      default: c(() => [...e[18] || (e[18] = [
                        m("Update tunler", -1)
                      ])]),
                      _: 1
                    })
                  ], 64)) : (a(), s("span", ve, "up to date"))
                ])) : $("", !0)
              ]),
              o.value.authenticated ? (a(), s("section", pe, [
                e[21] || (e[21] = n("h3", null, "This journal", -1)),
                n("p", fe, b(o.value.is_used ? "Phones and share links reach this journal through tunler." : "This journal doesn't use tunler yet."), 1),
                n("form", {
                  class: "row",
                  "data-tunler-use": "",
                  onSubmit: E(D, ["prevent"])
                }, [
                  A(n("input", {
                    "onUpdate:modelValue": e[6] || (e[6] = (p) => u.value = p),
                    placeholder: "The name in front of the server's address",
                    "aria-label": "Subdomain"
                  }, null, 512), [
                    [V, u.value]
                  ]),
                  g(f(y), {
                    small: "",
                    kind: "primary",
                    type: "submit",
                    disabled: !u.value.trim()
                  }, {
                    default: c(() => [
                      m(b(o.value.is_used ? "Save" : "Use tunler"), 1)
                    ]),
                    _: 1
                  }, 8, ["disabled"]),
                  o.value.is_used ? (a(), I(f(y), {
                    key: 0,
                    small: "",
                    "data-tunler-stop": "",
                    onClick: e[7] || (e[7] = (p) => d(U(M, "none")))
                  }, {
                    default: c(() => [...e[20] || (e[20] = [
                      m("Stop using tunler", -1)
                    ])]),
                    _: 1
                  })) : $("", !0)
                ], 32)
              ])) : $("", !0),
              w.value.length ? (a(), s("section", ce, [
                e[22] || (e[22] = n("h3", null, "Domains", -1)),
                (a(!0), s(x, null, B(w.value, (p) => (a(), I(J, {
                  key: p.name,
                  domain: p,
                  onRun: e[8] || (e[8] = (h) => d(...h))
                }, null, 8, ["domain"]))), 128))
              ])) : $("", !0)
            ], 64)) : (a(), s(x, { key: 1 }, [
              T.value ? $("", !0) : (a(), I(f(F), {
                key: 0,
                shape: "text"
              }))
            ], 64))
          ])
        ];
      }),
      _: 1
    }));
  }
}, ge = /* @__PURE__ */ L(ye, [["__scopeId", "data-v-baff373f"]]);
export {
  ge as default
};
