if (!document.getElementById("window-styles-a18a8b43067e")) { const style = document.createElement("style"); style.id = "window-styles-a18a8b43067e"; style.textContent = ".shares[data-v-1606c8ff]{display:flex;flex-direction:column;gap:12px}.shares-make[data-v-1606c8ff],.shares-waiting[data-v-1606c8ff],.shares-opens[data-v-1606c8ff],.shares-open[data-v-1606c8ff]{display:flex;flex-direction:column;gap:8px;flex:1;min-width:0}.shares-make[data-v-1606c8ff],.shares-waiting[data-v-1606c8ff],.shares-opens[data-v-1606c8ff]{align-items:flex-start}.shares-target[data-v-1606c8ff]{width:100%;min-width:0}.shares-option[data-v-1606c8ff],.shares-row[data-v-1606c8ff]{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center}.shares-label[data-v-1606c8ff]{margin:0;color:var(--text-3);font-size:12px;font-weight:500}.shares-name[data-v-1606c8ff]{flex:1;min-width:0}.shares-link[data-v-1606c8ff],.shares-comment[data-v-1606c8ff]{margin:0;overflow-wrap:anywhere}.shares-hint[data-v-1606c8ff],.shares-failure[data-v-1606c8ff]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as O, ref as h, openBlock as l, createBlock as L, unref as t, withCtx as d, createElementVNode as n, withModifiers as H, withDirectives as U, vModelText as I, createVNode as u, createCommentVNode as v, createElementBlock as i, Fragment as b, renderList as P, toDisplayString as o, createTextVNode as m } from "vue";
import { wordLabel as J, dated as F, useWindow as Q, useListTools as X, WindowRoom as Z, Segmented as ee, InfoTip as se, Switch as ae, Btn as k, ListTools as te, RowList as le } from "@journal/window-kit";
const ne = { doc: "Document", report: "Report", plan: "Plan" }, A = (p) => ne[p] ?? J(p), q = (p) => p ? `ends ${F(p)}` : "never ends", oe = (p, N) => {
  const r = p.__vccOpts || p;
  for (const [S, R] of N)
    r[S] = R;
  return r;
}, re = { class: "shares" }, ie = { class: "shares-option" }, de = { class: "shares-option" }, ue = { class: "shares-option" }, ve = {
  key: 0,
  class: "shares-opens",
  "data-share-opens": ""
}, pe = {
  class: "shares-link",
  "data-share-address": ""
}, ce = { class: "shares-hint" }, he = {
  key: 0,
  class: "shares-hint",
  "data-share-inside": ""
}, me = {
  key: 1,
  class: "shares-failure",
  role: "alert",
  "data-share-refusal": ""
}, fe = {
  key: 2,
  class: "shares-waiting",
  "data-share-waiting": ""
}, ke = ["data-share-row"], we = { class: "shares-name" }, ye = ["data-share-row"], ge = { class: "shares-row" }, _e = { class: "shares-name" }, be = {
  key: 0,
  class: "shares-hint"
}, Ce = {
  key: 0,
  class: "shares-row"
}, Se = {
  __name: "ShareRows",
  setup(p) {
    const N = [
      { key: "1d", label: "1 day" },
      { key: "7d", label: "7 days" },
      { key: "30d", label: "30 days" },
      { key: "never", label: "Never" }
    ], r = Q(), { rows: S, failure: R, loaded: K } = r.props.shares, B = O(() => S.value.filter((a) => a.state === "waiting")), T = O(() => S.value.filter((a) => a.state === "active")), V = X(T, { title: (a) => `${A(a.row_model)} ${a.row_id}` }), g = h(new URLSearchParams(globalThis.location.search).get("share") ?? ""), D = h("7d"), _ = h(""), E = h(!1), $ = h(null), w = h(null), y = h(""), f = h({}), x = h(!1);
    async function C(a) {
      const e = await r.run(a);
      return y.value = e.ok ? "" : e.error, e.ok && r.reload("shares"), e;
    }
    async function W(a) {
      await r.reload("tunnel");
      const e = r.props.tunnel.failure.value ? null : r.props.tunnel.data.value, s = (e == null ? void 0 : e.address) || globalThis.location.origin;
      return { ...a.value, address: `${s}${a.value.link}`, outside: !!(e != null && e.address) };
    }
    async function M() {
      r.state["opens.target"] = g.value.trim(), await r.reload("opens"), y.value = r.props.opens.failure.value, $.value = y.value ? null : r.props.opens.rows.value;
    }
    g.value && M();
    async function Y() {
      const a = await C(["share", "make", g.value.trim(), "--ends", D.value, ..._.value ? [`--password=${_.value}`] : [], ...E.value ? ["--comments"] : []]);
      a.ok && (w.value = await W(a), _.value = "", $.value = null);
    }
    async function j(a) {
      const e = await C(["share", "accept", String(a.id)]);
      e.ok && (w.value = await W(e));
    }
    async function z() {
      for (const a of T.value) await C(["share", "revoke", String(a.id)]);
      x.value = !1;
    }
    async function G(a) {
      if (f.value[a.id]) {
        const { [a.id]: s, ...c } = f.value;
        return void (f.value = c);
      }
      const e = `comments.${a.id}`;
      await r.reload(e), y.value = r.props[e].failure.value, y.value || (f.value = { ...f.value, [a.id]: r.props[e].rows.value });
    }
    return (a, e) => (l(), L(t(Z), null, {
      default: d(() => [
        n("div", re, [
          n("form", {
            class: "shares-make",
            "data-share-form": "",
            onSubmit: H(Y, ["prevent"])
          }, [
            U(n("input", {
              "onUpdate:modelValue": e[0] || (e[0] = (s) => g.value = s),
              class: "shares-target",
              placeholder: "plans:2, docs:12 or reports:4",
              "aria-label": "What to share",
              onChange: M
            }, null, 544), [
              [I, g.value]
            ]),
            n("div", ie, [
              e[6] || (e[6] = n("span", { class: "shares-label" }, "Ends after", -1)),
              u(t(ee), {
                options: N,
                value: D.value,
                "data-share-ends": "",
                onPick: e[1] || (e[1] = (s) => D.value = s)
              }, null, 8, ["value"])
            ]),
            n("div", de, [
              e[7] || (e[7] = n("span", { class: "shares-label" }, "Password", -1)),
              U(n("input", {
                "onUpdate:modelValue": e[2] || (e[2] = (s) => _.value = s),
                class: "shares-password",
                type: "password",
                autocomplete: "new-password",
                placeholder: "None",
                "aria-label": "Password"
              }, null, 512), [
                [I, _.value]
              ]),
              _.value ? (l(), L(t(se), {
                key: 0,
                lines: ["Visitors enter any name and this password."],
                label: "About the password"
              })) : v("", !0)
            ]),
            n("div", ue, [
              e[8] || (e[8] = n("span", { class: "shares-label" }, "Visitors can comment", -1)),
              u(t(ae), {
                on: E.value,
                title: "Let visitors choose a name when commenting",
                onChange: e[3] || (e[3] = (s) => E.value = s)
              }, null, 8, ["on"])
            ]),
            $.value ? (l(), i("div", ve, [
              e[9] || (e[9] = n("span", { class: "shares-label" }, "Whoever has the link can view", -1)),
              (l(!0), i(b, null, P($.value, (s) => (l(), i("span", {
                key: s.id
              }, o(s.line), 1))), 128))
            ])) : v("", !0),
            u(t(k), {
              variant: "primary",
              type: "submit",
              disabled: !g.value.trim()
            }, {
              default: d(() => [...e[10] || (e[10] = [
                m("Create link", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ], 32),
          w.value ? (l(), i(b, { key: 0 }, [
            n("p", pe, o(w.value.address), 1),
            n("p", ce, "This link is shown once. Anyone who has it can read it" + o(w.value.expires_at ? ` until ${t(F)(w.value.expires_at)}` : "") + ".", 1),
            w.value.outside ? v("", !0) : (l(), i("p", he, "No tunnel is connected, so this address works only from this computer."))
          ], 64)) : v("", !0),
          y.value ? (l(), i("p", me, o(y.value), 1)) : v("", !0),
          B.value.length ? (l(), i("section", fe, [
            e[13] || (e[13] = n("h3", { class: "shares-label" }, "Pending requests", -1)),
            (l(!0), i(b, null, P(B.value, (s) => (l(), i("div", {
              key: s.id,
              class: "shares-row",
              "data-share-row": s.id
            }, [
              n("span", we, "An agent asks to share " + o(t(A)(s.row_model)) + " " + o(s.row_id) + ", " + o(t(q)(s.expires_at)) + o(s.locked ? ", with a password" : "") + o(s.comments ? ", with comments" : ""), 1),
              u(t(k), {
                small: "",
                variant: "primary",
                "data-share-accept": "",
                onClick: (c) => j(s)
              }, {
                default: d(() => [...e[11] || (e[11] = [
                  m("Accept", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              u(t(k), {
                small: "",
                "data-share-deny": "",
                onClick: (c) => C(["share", "deny", String(s.id)])
              }, {
                default: d(() => [...e[12] || (e[12] = [
                  m("Deny", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])
            ], 8, ke))), 128))
          ])) : v("", !0),
          u(t(te), { tools: t(V) }, null, 8, ["tools"]),
          u(t(le), {
            rows: t(V).shown.value,
            failure: t(R),
            loaded: t(K),
            empty: "No link is open",
            hint: "Active share links appear here.",
            searching: t(V).filtering.value
          }, {
            default: d(({ row: s }) => [
              n("div", {
                class: "shares-open",
                "data-share-row": s.id
              }, [
                n("div", ge, [
                  n("span", _e, o(t(A)(s.row_model)) + " " + o(s.row_id) + ", " + o(t(q)(s.expires_at)) + ", " + o(s.view_count) + " " + o(s.view_count === 1 ? "view" : "views") + o(s.locked ? ", with a password" : ""), 1),
                  s.comments ? (l(), L(t(k), {
                    key: 0,
                    small: "",
                    "data-share-comments-open": "",
                    onClick: (c) => G(s)
                  }, {
                    default: d(() => [...e[14] || (e[14] = [
                      m("Comments", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"])) : v("", !0),
                  u(t(k), {
                    small: "",
                    "data-share-stop": "",
                    onClick: (c) => C(["share", "revoke", String(s.id)])
                  }, {
                    default: d(() => [...e[15] || (e[15] = [
                      m("Stop sharing", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"])
                ]),
                f.value[s.id] ? (l(), i(b, { key: 0 }, [
                  f.value[s.id].length ? v("", !0) : (l(), i("p", be, "No comments yet")),
                  (l(!0), i(b, null, P(f.value[s.id], (c) => (l(), i("p", {
                    key: c.id,
                    class: "shares-comment",
                    "data-share-comment": ""
                  }, [
                    n("strong", null, o(c.visitor_name), 1),
                    m(" " + o(c.text), 1)
                  ]))), 128))
                ], 64)) : v("", !0)
              ], 8, ye)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded", "searching"]),
          T.value.length > 1 ? (l(), i(b, { key: 3 }, [
            x.value ? (l(), i("div", Ce, [
              u(t(k), {
                small: "",
                onClick: e[4] || (e[4] = (s) => x.value = !1)
              }, {
                default: d(() => [...e[16] || (e[16] = [
                  m("Keep them", -1)
                ])]),
                _: 1
              }),
              u(t(k), {
                small: "",
                variant: "danger",
                "data-share-stop-every-confirm": "",
                onClick: z
              }, {
                default: d(() => [...e[17] || (e[17] = [
                  m("Yes, stop every share", -1)
                ])]),
                _: 1
              })
            ])) : (l(), L(t(k), {
              key: 1,
              small: "",
              "data-share-stop-every": "",
              onClick: e[5] || (e[5] = (s) => x.value = !0)
            }, {
              default: d(() => [...e[18] || (e[18] = [
                m("Stop every share", -1)
              ])]),
              _: 1
            }))
          ], 64)) : v("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, Le = /* @__PURE__ */ oe(Se, [["__scopeId", "data-v-1606c8ff"]]);
export {
  Le as default
};
