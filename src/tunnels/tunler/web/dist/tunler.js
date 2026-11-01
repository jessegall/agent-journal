/* @code-commandments-generated */
if (!document.getElementById("window-styles-f7badd158a3c")) { const style = document.createElement("style"); style.id = "window-styles-f7badd158a3c"; style.textContent = ".login[data-v-2d10db84]{display:flex;flex-direction:column;gap:6px}label[data-v-2d10db84]{color:var(--text-3);font-size:12px}input[data-v-2d10db84]{padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:13px}.fine[data-v-2d10db84]{margin:0;color:var(--text-3);font-size:12px}.failure[data-v-2d10db84]{margin:0;color:var(--danger);font-size:12.5px}.actions[data-v-2d10db84]{display:flex;gap:8px}.account[data-v-0e5494fb]{display:flex;flex-direction:column;gap:18px;max-width:640px}.part[data-v-0e5494fb]{display:flex;flex-direction:column;gap:8px}h3[data-v-0e5494fb]{margin:0;font-size:13px;font-weight:600}.line[data-v-0e5494fb]{margin:0;color:var(--text-2);line-height:1.5}.fine[data-v-0e5494fb]{margin:0;color:var(--text-3);font-size:12px}.failure[data-v-0e5494fb]{margin:0;color:var(--danger);font-size:12.5px}.row[data-v-0e5494fb]{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.domain[data-v-0e5494fb]{display:flex;flex-direction:column;gap:4px}.name[data-v-0e5494fb]{overflow-wrap:anywhere}input[data-v-0e5494fb]{flex:1;min-width:0;padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:13px}\n"; document.head.appendChild(style); }
import { ref as u, openBlock as l, createElementBlock as a, withModifiers as L, createElementVNode as t, withDirectives as N, vModelText as E, toDisplayString as p, createCommentVNode as k, createVNode as m, unref as i, withCtx as d, createTextVNode as r, Fragment as h, createBlock as M, renderList as O } from "vue";
import { useWindow as D, Btn as v, Skeleton as P } from "@journal/window-kit";
const F = (_, $) => {
  const o = _.__vccOpts || _;
  for (const [b, V] of $)
    o[b] = V;
  return o;
}, G = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-tunler-login-failure": ""
}, W = { class: "actions" }, q = {
  __name: "TunlerLoginForm",
  props: { host: { type: String, default: "" } },
  emits: ["ready"],
  setup(_, { emit: $ }) {
    const o = _, b = $, V = D(), g = u(o.host), y = u(""), j = u(""), f = u(""), w = u(!1), x = u(!1), U = u("");
    async function T() {
      x.value = !0;
      const A = f.value ? ["--master", f.value] : [], n = await V.run(["tunler", "login", g.value.trim(), y.value.trim(), j.value, ...A]);
      if (x.value = !1, U.value = n.ok ? "" : n.error, !!n.ok) {
        if (n.value.connected) {
          j.value = "", f.value = "", b("ready");
          return;
        }
        w.value = n.value.needs_master, U.value = n.value.error;
      }
    }
    return (A, n) => (l(), a("form", {
      class: "login",
      "data-tunler-login": "",
      onSubmit: L(T, ["prevent"])
    }, [
      n[4] || (n[4] = t("label", { for: "tunler-server" }, "Tunler server address", -1)),
      N(t("input", {
        id: "tunler-server",
        "onUpdate:modelValue": n[0] || (n[0] = (C) => g.value = C),
        placeholder: "tunler.example.com",
        autocomplete: "off"
      }, null, 512), [
        [E, g.value]
      ]),
      n[5] || (n[5] = t("label", { for: "tunler-username" }, "Username", -1)),
      N(t("input", {
        id: "tunler-username",
        "onUpdate:modelValue": n[1] || (n[1] = (C) => y.value = C),
        autocomplete: "username"
      }, null, 512), [
        [E, y.value]
      ]),
      n[6] || (n[6] = t("label", { for: "tunler-password" }, "Password", -1)),
      N(t("input", {
        id: "tunler-password",
        "onUpdate:modelValue": n[2] || (n[2] = (C) => j.value = C),
        type: "password",
        autocomplete: "current-password"
      }, null, 512), [
        [E, j.value]
      ]),
      n[7] || (n[7] = t("p", { class: "fine" }, "At least 8 characters.", -1)),
      n[8] || (n[8] = t("label", { for: "tunler-master" }, "Master password", -1)),
      N(t("input", {
        id: "tunler-master",
        "onUpdate:modelValue": n[3] || (n[3] = (C) => f.value = C),
        type: "password",
        autocomplete: "off",
        "data-tunler-master": ""
      }, null, 512), [
        [E, f.value]
      ]),
      n[9] || (n[9] = t("p", { class: "fine" }, "Only to create a new account.", -1)),
      U.value ? (l(), a("p", G, p(U.value), 1)) : k("", !0),
      t("div", W, [
        m(i(v), {
          small: "",
          kind: "primary",
          type: "submit",
          busy: x.value,
          "data-tunler-connect": ""
        }, {
          default: d(() => [
            r(p(w.value ? "Create the account" : "Connect"), 1)
          ]),
          _: 1
        }, 8, ["busy"])
      ]),
      n[10] || (n[10] = t("p", { class: "fine" }, "A forgotten password can't be recovered: make a new account. Accounts unused for 30 days are deleted with their domains.", -1))
    ], 32));
  }
}, z = /* @__PURE__ */ F(q, [["__scopeId", "data-v-2d10db84"]]), H = {
  class: "account",
  "data-tunler": ""
}, J = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-tunler-failure": ""
}, Q = { class: "part" }, X = {
  class: "line",
  "data-tunler-account": ""
}, Y = { class: "line" }, Z = { class: "row" }, ee = {
  key: 0,
  class: "line"
}, te = {
  key: 1,
  class: "line",
  "data-tunler-rejected": ""
}, ne = {
  key: 2,
  class: "line"
}, le = {
  key: 3,
  class: "row"
}, se = {
  key: 3,
  class: "row",
  "data-tunler-version": ""
}, ae = { class: "line" }, oe = { class: "fine" }, re = {
  key: 1,
  class: "fine"
}, ue = {
  key: 0,
  class: "part"
}, ie = {
  class: "line",
  "data-tunler-in-use": ""
}, de = {
  key: 1,
  class: "part"
}, ve = ["data-tunler-domain"], me = { class: "row" }, pe = { class: "name" }, fe = {
  key: 0,
  class: "fine"
}, ce = ["onSubmit"], ke = { class: "row" }, B = "journal.tunnels.tunler.subdomain", R = "journal.core.tunnel.service", ye = {
  __name: "TunlerAccount",
  setup(_) {
    const $ = D(), o = u(null), b = u(null), V = u([]), g = u(""), y = u(!1), j = u(""), f = u(""), w = u(""), x = u("");
    async function U() {
      var s;
      const [c, e, S] = await Promise.all([$.read("tunler status"), $.read("tunler version"), $.read("tunler domains")]);
      g.value = c.ok ? "" : c.error, o.value = c.ok ? c.value : null, b.value = e.ok ? e.value : null, V.value = S.ok ? S.value.domains : [], f.value = ((s = o.value) == null ? void 0 : s.subdomain) ?? "";
    }
    async function T(...c) {
      for (const e of c) {
        const S = await $.run(e);
        if (g.value = S.ok ? "" : S.error, !S.ok) break;
      }
      w.value = "", await U();
    }
    const A = (c, e) => ["setting", "set", c, e, "--project"], n = () => T(A(B, f.value.trim()), A(R, "tunler")), C = (c) => T(A(B, x.value.trim()), ["tunler", "release", c.name]);
    function K() {
      y.value = !1, U();
    }
    return U(), (c, e) => {
      var S;
      return l(), a("div", H, [
        g.value ? (l(), a("p", J, p(g.value), 1)) : k("", !0),
        o.value ? (l(), a(h, { key: 2 }, [
          t("section", Q, [
            e[21] || (e[21] = t("h3", null, "Connection", -1)),
            o.value.installed ? o.value.authenticated && !y.value ? (l(), a(h, { key: 1 }, [
              t("p", X, [
                e[13] || (e[13] = r("Connected as ", -1)),
                t("b", null, p(o.value.account), 1),
                e[14] || (e[14] = r(" on ", -1)),
                t("b", null, p(o.value.host), 1),
                e[15] || (e[15] = r(". Every journal on this machine uses this login.", -1))
              ]),
              t("p", Y, [
                e[16] || (e[16] = r("tunler is installed at ", -1)),
                t("code", null, p(o.value.command), 1)
              ]),
              t("div", Z, [
                m(i(v), {
                  small: "",
                  "data-tunler-switch": "",
                  onClick: e[2] || (e[2] = (s) => y.value = !0)
                }, {
                  default: d(() => [...e[17] || (e[17] = [
                    r("Use another account", -1)
                  ])]),
                  _: 1
                }),
                m(i(v), {
                  small: "",
                  "data-tunler-logout": "",
                  onClick: e[3] || (e[3] = (s) => T(["tunler", "logout"]))
                }, {
                  default: d(() => [...e[18] || (e[18] = [
                    r("Log out", -1)
                  ])]),
                  _: 1
                })
              ])
            ], 64)) : (l(), a(h, { key: 2 }, [
              y.value ? (l(), a("p", ee, "Logging in with another account replaces the current login for every journal here. Each journal's address stays with the account that claimed it, so those addresses stop answering until you switch back with that account's password.")) : o.value.rejected ? (l(), a("p", te, "The tunler server no longer accepts the saved login. Log in again.")) : (l(), a("p", ne, "No account is connected here. Log in once, and every journal on this machine uses that account.")),
              m(z, {
                host: o.value.host ?? "",
                onReady: K
              }, null, 8, ["host"]),
              y.value ? (l(), a("div", le, [
                m(i(v), {
                  small: "",
                  onClick: e[4] || (e[4] = (s) => y.value = !1)
                }, {
                  default: d(() => [...e[19] || (e[19] = [
                    r("Keep the current account", -1)
                  ])]),
                  _: 1
                })
              ])) : k("", !0)
            ], 64)) : (l(), a(h, { key: 0 }, [
              e[12] || (e[12] = t("p", { class: "line" }, "tunler isn't installed on this machine, so sharing and phones can't reach it.", -1)),
              t("form", {
                class: "row",
                "data-tunler-install": "",
                onSubmit: e[1] || (e[1] = L((s) => T(["tunler", "install", j.value.trim()]), ["prevent"]))
              }, [
                N(t("input", {
                  "onUpdate:modelValue": e[0] || (e[0] = (s) => j.value = s),
                  placeholder: "tunler.example.com",
                  "aria-label": "Tunler server address"
                }, null, 512), [
                  [E, j.value]
                ]),
                m(i(v), {
                  small: "",
                  kind: "primary",
                  type: "submit"
                }, {
                  default: d(() => [...e[11] || (e[11] = [
                    r("Install tunler", -1)
                  ])]),
                  _: 1
                })
              ], 32)
            ], 64)),
            (S = b.value) != null && S.current ? (l(), a("div", se, [
              t("span", ae, "tunler " + p(b.value.current), 1),
              b.value.update_available ? (l(), a(h, { key: 0 }, [
                t("span", oe, p(b.value.latest) + " is available", 1),
                m(i(v), {
                  small: "",
                  kind: "primary",
                  "data-tunler-update": "",
                  onClick: e[5] || (e[5] = (s) => T(["tunler", "update"]))
                }, {
                  default: d(() => [...e[20] || (e[20] = [
                    r("Update tunler", -1)
                  ])]),
                  _: 1
                })
              ], 64)) : (l(), a("span", re, "up to date"))
            ])) : k("", !0)
          ]),
          o.value.authenticated ? (l(), a("section", ue, [
            e[23] || (e[23] = t("h3", null, "This journal", -1)),
            t("p", ie, p(o.value.in_use ? "Phones and share links reach this journal through tunler." : "This journal doesn't use tunler yet."), 1),
            t("form", {
              class: "row",
              "data-tunler-use": "",
              onSubmit: L(n, ["prevent"])
            }, [
              N(t("input", {
                "onUpdate:modelValue": e[6] || (e[6] = (s) => f.value = s),
                placeholder: "The name in front of the server's address",
                "aria-label": "Subdomain"
              }, null, 512), [
                [E, f.value]
              ]),
              m(i(v), {
                small: "",
                kind: "primary",
                type: "submit",
                disabled: !f.value.trim()
              }, {
                default: d(() => [
                  r(p(o.value.in_use ? "Save" : "Use tunler"), 1)
                ]),
                _: 1
              }, 8, ["disabled"]),
              o.value.in_use ? (l(), M(i(v), {
                key: 0,
                small: "",
                "data-tunler-stop": "",
                onClick: e[7] || (e[7] = (s) => T(A(R, "none")))
              }, {
                default: d(() => [...e[22] || (e[22] = [
                  r("Stop using tunler", -1)
                ])]),
                _: 1
              })) : k("", !0)
            ], 32)
          ])) : k("", !0),
          V.value.length ? (l(), a("section", de, [
            e[30] || (e[30] = t("h3", null, "Domains", -1)),
            (l(!0), a(h, null, O(V.value, (s) => (l(), a("div", {
              key: s.name,
              class: "domain",
              "data-tunler-domain": s.name
            }, [
              t("div", me, [
                t("span", pe, p(s.name), 1),
                s.own ? (l(), a("span", fe, "In use")) : k("", !0),
                w.value !== s.name ? (l(), M(i(v), {
                  key: 1,
                  small: "",
                  "data-tunler-release": "",
                  onClick: (I) => w.value = s.name
                }, {
                  default: d(() => [
                    r(p(s.own ? "Move to a new address" : "Release"), 1)
                  ]),
                  _: 2
                }, 1032, ["onClick"])) : k("", !0)
              ]),
              w.value === s.name && s.own ? (l(), a(h, { key: 0 }, [
                e[26] || (e[26] = t("p", { class: "fine" }, "Share links stop working and a paired phone has to be paired again.", -1)),
                t("form", {
                  class: "row",
                  "data-tunler-move": "",
                  onSubmit: L((I) => C(s), ["prevent"])
                }, [
                  N(t("input", {
                    "onUpdate:modelValue": e[8] || (e[8] = (I) => x.value = I),
                    placeholder: "The new name",
                    "aria-label": "The new name"
                  }, null, 512), [
                    [E, x.value]
                  ]),
                  m(i(v), {
                    small: "",
                    kind: "primary",
                    type: "submit",
                    disabled: !x.value.trim()
                  }, {
                    default: d(() => [...e[24] || (e[24] = [
                      r("Move to the new address", -1)
                    ])]),
                    _: 1
                  }, 8, ["disabled"]),
                  m(i(v), {
                    small: "",
                    onClick: e[9] || (e[9] = (I) => w.value = "")
                  }, {
                    default: d(() => [...e[25] || (e[25] = [
                      r("Keep it", -1)
                    ])]),
                    _: 1
                  })
                ], 40, ce)
              ], 64)) : w.value === s.name ? (l(), a(h, { key: 1 }, [
                e[29] || (e[29] = t("p", { class: "fine" }, "Release it? Anyone can claim it after.", -1)),
                t("div", ke, [
                  m(i(v), {
                    small: "",
                    kind: "primary",
                    "data-tunler-release-confirm": "",
                    onClick: (I) => T(["tunler", "release", s.name])
                  }, {
                    default: d(() => [...e[27] || (e[27] = [
                      r("Release the address", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"]),
                  m(i(v), {
                    small: "",
                    onClick: e[10] || (e[10] = (I) => w.value = "")
                  }, {
                    default: d(() => [...e[28] || (e[28] = [
                      r("Keep it", -1)
                    ])]),
                    _: 1
                  })
                ])
              ], 64)) : k("", !0)
            ], 8, ve))), 128))
          ])) : k("", !0)
        ], 64)) : (l(), a(h, { key: 1 }, [
          g.value ? k("", !0) : (l(), M(i(P), {
            key: 0,
            shape: "text"
          }))
        ], 64))
      ]);
    };
  }
}, ge = /* @__PURE__ */ F(ye, [["__scopeId", "data-v-0e5494fb"]]);
export {
  ge as default
};
