if (!document.getElementById("window-styles-d7ae2bd06d5c")) { const style = document.createElement("style"); style.id = "window-styles-d7ae2bd06d5c"; style.textContent = ".domain[data-v-1a7fedc8]{display:flex;flex-direction:column;gap:4px}.name[data-v-1a7fedc8]{overflow-wrap:anywhere}.fine[data-v-1a7fedc8]{margin:0;color:var(--text-3);font-size:12px}.row[data-v-1a7fedc8]{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.login[data-v-841bc053]{display:flex;flex-direction:column;gap:6px}label[data-v-841bc053]{color:var(--text-3);font-size:12px}input[data-v-841bc053]{padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:13px}.fine[data-v-841bc053]{margin:0;color:var(--text-3);font-size:12px}.failure[data-v-841bc053]{margin:0;color:var(--danger);font-size:12.5px}.actions[data-v-841bc053]{display:flex;gap:8px}.account[data-v-c1bc0844]{display:flex;flex-direction:column;gap:18px;max-width:640px}.part[data-v-c1bc0844]{display:flex;flex-direction:column;gap:8px}h3[data-v-c1bc0844]{margin:0;font-size:13px;font-weight:600}.line[data-v-c1bc0844]{margin:0;color:var(--text-2);line-height:1.5}.fine[data-v-c1bc0844]{margin:0;color:var(--text-3);font-size:12px}.failure[data-v-c1bc0844]{margin:0;color:var(--danger);font-size:12.5px}.row[data-v-c1bc0844]{display:flex;flex-wrap:wrap;align-items:center;gap:8px}input[data-v-c1bc0844]{flex:1;min-width:0;padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:13px}\n"; document.head.appendChild(style); }
import { ref as c, openBlock as l, createElementBlock as o, createElementVNode as t, toDisplayString as w, createCommentVNode as $, createBlock as D, unref as s, withCtx as v, createTextVNode as i, Fragment as V, withModifiers as L, withDirectives as N, vModelText as A, createVNode as g, computed as R, watch as K, renderList as P } from "vue";
import { Btn as y, useWindow as F, WindowRoom as W, Skeleton as q } from "@journal/window-kit";
const M = (u, b) => {
  const r = u.__vccOpts || u;
  for (const [p, f] of b)
    r[p] = f;
  return r;
}, z = ["data-tunler-domain"], H = { class: "row" }, J = { class: "name" }, Q = {
  key: 0,
  class: "fine"
}, X = { class: "row" }, Y = "journal.tunnels.tunler.subdomain", Z = {
  __name: "TunlerDomain",
  props: { domain: { type: Object, required: !0 } },
  emits: ["run"],
  setup(u, { emit: b }) {
    const r = b, p = c(""), f = c(""), I = (d, n) => ["setting", "set", d, n, "--project"];
    function j(...d) {
      p.value = "", r("run", d);
    }
    const S = (d) => j(I(Y, f.value.trim()), ["tunler", "release", d.name]);
    return (d, n) => (l(), o("div", {
      class: "domain",
      "data-tunler-domain": u.domain.name
    }, [
      t("div", H, [
        t("span", J, w(u.domain.name), 1),
        u.domain.own ? (l(), o("span", Q, "In use")) : $("", !0),
        p.value !== u.domain.name ? (l(), D(s(y), {
          key: 1,
          small: "",
          "data-tunler-release": "",
          onClick: n[0] || (n[0] = (m) => p.value = u.domain.name)
        }, {
          default: v(() => [
            i(w(u.domain.own ? "Move to a new address" : "Release"), 1)
          ]),
          _: 1
        })) : $("", !0)
      ]),
      p.value === u.domain.name && u.domain.own ? (l(), o(V, { key: 0 }, [
        n[8] || (n[8] = t("p", { class: "fine" }, "Share links stop working and a paired phone has to be paired again.", -1)),
        t("form", {
          class: "row",
          "data-tunler-move": "",
          onSubmit: n[3] || (n[3] = L((m) => S(u.domain), ["prevent"]))
        }, [
          N(t("input", {
            "onUpdate:modelValue": n[1] || (n[1] = (m) => f.value = m),
            placeholder: "The new name",
            "aria-label": "The new name"
          }, null, 512), [
            [A, f.value]
          ]),
          g(s(y), {
            small: "",
            variant: "primary",
            type: "submit",
            disabled: !f.value.trim()
          }, {
            default: v(() => [...n[6] || (n[6] = [
              i("Move to the new address", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          g(s(y), {
            small: "",
            onClick: n[2] || (n[2] = (m) => p.value = "")
          }, {
            default: v(() => [...n[7] || (n[7] = [
              i("Keep it", -1)
            ])]),
            _: 1
          })
        ], 32)
      ], 64)) : p.value === u.domain.name ? (l(), o(V, { key: 1 }, [
        n[11] || (n[11] = t("p", { class: "fine" }, "Release it? Anyone can claim it after.", -1)),
        t("div", X, [
          g(s(y), {
            small: "",
            variant: "primary",
            "data-tunler-release-confirm": "",
            onClick: n[4] || (n[4] = (m) => j(["tunler", "release", u.domain.name]))
          }, {
            default: v(() => [...n[9] || (n[9] = [
              i("Release the address", -1)
            ])]),
            _: 1
          }),
          g(s(y), {
            small: "",
            onClick: n[5] || (n[5] = (m) => p.value = "")
          }, {
            default: v(() => [...n[10] || (n[10] = [
              i("Keep it", -1)
            ])]),
            _: 1
          })
        ])
      ], 64)) : $("", !0)
    ], 8, z));
  }
}, _ = /* @__PURE__ */ M(Z, [["__scopeId", "data-v-1a7fedc8"]]), ee = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-tunler-login-failure": ""
}, te = { class: "actions" }, ne = {
  __name: "TunlerLoginForm",
  props: { host: { type: String, default: "" } },
  emits: ["ready"],
  setup(u, { emit: b }) {
    const r = u, p = b, f = F(), I = c(r.host), j = c(""), S = c(""), d = c(""), n = c(!1), m = c(!1), C = c("");
    async function h() {
      m.value = !0;
      const U = d.value ? ["--master", d.value] : [], a = await f.run(["tunler", "login", I.value.trim(), j.value.trim(), S.value, ...U]);
      if (m.value = !1, C.value = a.ok ? "" : a.error, !!a.ok) {
        if (a.value.connected) {
          S.value = "", d.value = "", p("ready");
          return;
        }
        n.value = a.value.needs_master, C.value = a.value.error;
      }
    }
    return (U, a) => (l(), o("form", {
      class: "login",
      "data-tunler-login": "",
      onSubmit: L(h, ["prevent"])
    }, [
      a[4] || (a[4] = t("label", { for: "tunler-server" }, "Tunler server address", -1)),
      N(t("input", {
        id: "tunler-server",
        "onUpdate:modelValue": a[0] || (a[0] = (x) => I.value = x),
        placeholder: "tunler.example.com",
        autocomplete: "off"
      }, null, 512), [
        [A, I.value]
      ]),
      a[5] || (a[5] = t("label", { for: "tunler-username" }, "Username", -1)),
      N(t("input", {
        id: "tunler-username",
        "onUpdate:modelValue": a[1] || (a[1] = (x) => j.value = x),
        autocomplete: "username"
      }, null, 512), [
        [A, j.value]
      ]),
      a[6] || (a[6] = t("label", { for: "tunler-password" }, "Password", -1)),
      N(t("input", {
        id: "tunler-password",
        "onUpdate:modelValue": a[2] || (a[2] = (x) => S.value = x),
        type: "password",
        autocomplete: "current-password"
      }, null, 512), [
        [A, S.value]
      ]),
      a[7] || (a[7] = t("p", { class: "fine" }, "At least 8 characters.", -1)),
      a[8] || (a[8] = t("label", { for: "tunler-master" }, "Master password", -1)),
      N(t("input", {
        id: "tunler-master",
        "onUpdate:modelValue": a[3] || (a[3] = (x) => d.value = x),
        type: "password",
        autocomplete: "off",
        "data-tunler-master": ""
      }, null, 512), [
        [A, d.value]
      ]),
      a[9] || (a[9] = t("p", { class: "fine" }, "Only to create a new account.", -1)),
      C.value ? (l(), o("p", ee, w(C.value), 1)) : $("", !0),
      t("div", te, [
        g(s(y), {
          small: "",
          variant: "primary",
          type: "submit",
          busy: m.value,
          "data-tunler-connect": ""
        }, {
          default: v(() => [
            i(w(n.value ? "Create the account" : "Connect"), 1)
          ]),
          _: 1
        }, 8, ["busy"])
      ]),
      a[10] || (a[10] = t("p", { class: "fine" }, "A forgotten password can't be recovered: make a new account. Accounts unused for 30 days are deleted with their domains.", -1))
    ], 32));
  }
}, ae = /* @__PURE__ */ M(ne, [["__scopeId", "data-v-841bc053"]]), se = {
  class: "account",
  "data-tunler": ""
}, le = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-tunler-failure": ""
}, oe = { class: "part" }, re = {
  class: "line",
  "data-tunler-account": ""
}, ue = { class: "line" }, ie = { class: "row" }, de = {
  key: 0,
  class: "line"
}, me = {
  key: 1,
  class: "line",
  "data-tunler-rejected": ""
}, ve = {
  key: 2,
  class: "line"
}, pe = {
  key: 3,
  class: "row"
}, fe = {
  key: 3,
  class: "row",
  "data-tunler-version": ""
}, ce = { class: "line" }, ye = { class: "fine" }, ke = {
  key: 1,
  class: "fine"
}, we = {
  key: 0,
  class: "part"
}, ge = {
  class: "line",
  "data-tunler-in-use": ""
}, be = {
  key: 1,
  class: "part"
}, Te = "journal.tunnels.tunler.subdomain", B = "journal.core.tunnel.service", $e = {
  __name: "TunlerAccount",
  setup(u) {
    const b = F(), { data: r, failure: p } = b.props.status, { data: f } = b.props.version, { data: I } = b.props.domains, j = R(() => {
      var T;
      return ((T = I.value) == null ? void 0 : T.domains) ?? [];
    }), S = c(""), d = R(() => S.value || p.value), n = c(!1), m = c(""), C = c("");
    K(r, (T) => C.value = (T == null ? void 0 : T.subdomain) ?? "", { immediate: !0 });
    const h = () => b.reload(["status", "version", "domains"]);
    async function U(...T) {
      S.value = "";
      for (const e of T) {
        const E = await b.run(e);
        if (S.value = E.ok ? "" : E.error, !E.ok) break;
      }
      await h();
    }
    const a = (T, e) => ["setting", "set", T, e, "--project"], x = () => U(a(Te, C.value.trim()), a(B, "tunler"));
    function O() {
      n.value = !1, h();
    }
    return (T, e) => (l(), D(s(W), null, {
      default: v(() => {
        var E;
        return [
          t("div", se, [
            d.value ? (l(), o("p", le, w(d.value), 1)) : $("", !0),
            s(r) ? (l(), o(V, { key: 2 }, [
              t("section", oe, [
                e[19] || (e[19] = t("h3", null, "Connection", -1)),
                s(r).installed ? s(r).authenticated && !n.value ? (l(), o(V, { key: 1 }, [
                  t("p", re, [
                    e[11] || (e[11] = i("Connected as ", -1)),
                    t("b", null, w(s(r).account), 1),
                    e[12] || (e[12] = i(" on ", -1)),
                    t("b", null, w(s(r).host), 1),
                    e[13] || (e[13] = i(". Every journal on this machine uses this login.", -1))
                  ]),
                  t("p", ue, [
                    e[14] || (e[14] = i("tunler is installed at ", -1)),
                    t("code", null, w(s(r).command), 1)
                  ]),
                  t("div", ie, [
                    g(s(y), {
                      small: "",
                      "data-tunler-switch": "",
                      onClick: e[2] || (e[2] = (k) => n.value = !0)
                    }, {
                      default: v(() => [...e[15] || (e[15] = [
                        i("Use another account", -1)
                      ])]),
                      _: 1
                    }),
                    g(s(y), {
                      small: "",
                      "data-tunler-logout": "",
                      onClick: e[3] || (e[3] = (k) => U(["tunler", "logout"]))
                    }, {
                      default: v(() => [...e[16] || (e[16] = [
                        i("Log out", -1)
                      ])]),
                      _: 1
                    })
                  ])
                ], 64)) : (l(), o(V, { key: 2 }, [
                  n.value ? (l(), o("p", de, "Logging in with another account replaces the current login for every journal here. Each journal's address stays with the account that claimed it, so those addresses stop answering until you switch back with that account's password.")) : s(r).rejected ? (l(), o("p", me, "The tunler server no longer accepts the saved login. Log in again.")) : (l(), o("p", ve, "No account is connected here. Log in once, and every journal on this machine uses that account.")),
                  g(ae, {
                    host: s(r).host ?? "",
                    onReady: O
                  }, null, 8, ["host"]),
                  n.value ? (l(), o("div", pe, [
                    g(s(y), {
                      small: "",
                      onClick: e[4] || (e[4] = (k) => n.value = !1)
                    }, {
                      default: v(() => [...e[17] || (e[17] = [
                        i("Keep the current account", -1)
                      ])]),
                      _: 1
                    })
                  ])) : $("", !0)
                ], 64)) : (l(), o(V, { key: 0 }, [
                  e[10] || (e[10] = t("p", { class: "line" }, "tunler isn't installed on this machine, so sharing and phones can't reach it.", -1)),
                  t("form", {
                    class: "row",
                    "data-tunler-install": "",
                    onSubmit: e[1] || (e[1] = L((k) => U(["tunler", "install", m.value.trim()]), ["prevent"]))
                  }, [
                    N(t("input", {
                      "onUpdate:modelValue": e[0] || (e[0] = (k) => m.value = k),
                      placeholder: "tunler.example.com",
                      "aria-label": "Tunler server address"
                    }, null, 512), [
                      [A, m.value]
                    ]),
                    g(s(y), {
                      small: "",
                      variant: "primary",
                      type: "submit"
                    }, {
                      default: v(() => [...e[9] || (e[9] = [
                        i("Install tunler", -1)
                      ])]),
                      _: 1
                    })
                  ], 32)
                ], 64)),
                (E = s(f)) != null && E.current ? (l(), o("div", fe, [
                  t("span", ce, "tunler " + w(s(f).current), 1),
                  s(f).update_available ? (l(), o(V, { key: 0 }, [
                    t("span", ye, w(s(f).latest) + " is available", 1),
                    g(s(y), {
                      small: "",
                      variant: "primary",
                      "data-tunler-update": "",
                      onClick: e[5] || (e[5] = (k) => U(["tunler", "update"]))
                    }, {
                      default: v(() => [...e[18] || (e[18] = [
                        i("Update tunler", -1)
                      ])]),
                      _: 1
                    })
                  ], 64)) : (l(), o("span", ke, "up to date"))
                ])) : $("", !0)
              ]),
              s(r).authenticated ? (l(), o("section", we, [
                e[21] || (e[21] = t("h3", null, "This journal", -1)),
                t("p", ge, w(s(r).is_used ? "Phones and share links reach this journal through tunler." : "This journal doesn't use tunler yet."), 1),
                t("form", {
                  class: "row",
                  "data-tunler-use": "",
                  onSubmit: L(x, ["prevent"])
                }, [
                  N(t("input", {
                    "onUpdate:modelValue": e[6] || (e[6] = (k) => C.value = k),
                    placeholder: "The name in front of the server's address",
                    "aria-label": "Subdomain"
                  }, null, 512), [
                    [A, C.value]
                  ]),
                  g(s(y), {
                    small: "",
                    variant: "primary",
                    type: "submit",
                    disabled: !C.value.trim()
                  }, {
                    default: v(() => [
                      i(w(s(r).is_used ? "Save" : "Use tunler"), 1)
                    ]),
                    _: 1
                  }, 8, ["disabled"]),
                  s(r).is_used ? (l(), D(s(y), {
                    key: 0,
                    small: "",
                    "data-tunler-stop": "",
                    onClick: e[7] || (e[7] = (k) => U(a(B, "none")))
                  }, {
                    default: v(() => [...e[20] || (e[20] = [
                      i("Stop using tunler", -1)
                    ])]),
                    _: 1
                  })) : $("", !0)
                ], 32)
              ])) : $("", !0),
              j.value.length ? (l(), o("section", be, [
                e[22] || (e[22] = t("h3", null, "Domains", -1)),
                (l(!0), o(V, null, P(j.value, (k) => (l(), D(_, {
                  key: k.name,
                  domain: k,
                  onRun: e[8] || (e[8] = (G) => U(...G))
                }, null, 8, ["domain"]))), 128))
              ])) : $("", !0)
            ], 64)) : (l(), o(V, { key: 1 }, [
              d.value ? $("", !0) : (l(), D(s(q), {
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
}, je = /* @__PURE__ */ M($e, [["__scopeId", "data-v-c1bc0844"]]);
export {
  je as default
};
