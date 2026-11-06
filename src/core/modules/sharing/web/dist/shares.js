/* @code-commandments-generated */
if (!document.getElementById("window-styles-67df8740f7c8")) { const style = document.createElement("style"); style.id = "window-styles-67df8740f7c8"; style.textContent = ".shares[data-v-de0930ae]{display:flex;flex-direction:column;gap:12px}.shares-make[data-v-de0930ae],.shares-waiting[data-v-de0930ae],.shares-opens[data-v-de0930ae],.shares-open[data-v-de0930ae]{display:flex;flex-direction:column;gap:8px;flex:1;min-width:0}.shares-make[data-v-de0930ae],.shares-waiting[data-v-de0930ae],.shares-opens[data-v-de0930ae]{align-items:flex-start}.shares-target[data-v-de0930ae]{width:100%;min-width:0}.shares-option[data-v-de0930ae],.shares-row[data-v-de0930ae]{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center}.shares-label[data-v-de0930ae]{margin:0;color:var(--text-3);font-size:12px;font-weight:500}.shares-name[data-v-de0930ae]{flex:1;min-width:0}.shares-link[data-v-de0930ae],.shares-comment[data-v-de0930ae]{margin:0;overflow-wrap:anywhere}.shares-hint[data-v-de0930ae],.shares-failure[data-v-de0930ae]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as M, ref as c, openBlock as t, createBlock as B, unref as o, withCtx as d, createElementVNode as n, withModifiers as z, withDirectives as O, vModelText as q, createVNode as u, createElementBlock as r, createCommentVNode as v, Fragment as _, renderList as E, toDisplayString as l, createTextVNode as h } from "vue";
import { useWindow as G, useListTools as H, WindowRoom as J, Segmented as Q, Switch as X, Btn as k, ListTools as Z, RowList as ee } from "@journal/window-kit";
const se = (x, N) => {
  const i = x.__vccOpts || x;
  for (const [b, V] of N)
    i[b] = V;
  return i;
}, ae = { class: "shares" }, te = { class: "shares-option" }, ne = { class: "shares-option" }, oe = {
  key: 0,
  class: "shares-hint"
}, le = { class: "shares-option" }, re = {
  key: 0,
  class: "shares-opens",
  "data-share-opens": ""
}, ie = {
  class: "shares-link",
  "data-share-address": ""
}, de = { class: "shares-hint" }, ue = {
  key: 0,
  class: "shares-hint",
  "data-share-inside": ""
}, ve = {
  key: 1,
  class: "shares-failure",
  role: "alert",
  "data-share-refusal": ""
}, pe = {
  key: 2,
  class: "shares-waiting",
  "data-share-waiting": ""
}, ce = ["data-share-row"], he = { class: "shares-name" }, me = ["data-share-row"], ke = { class: "shares-row" }, fe = { class: "shares-name" }, ye = {
  key: 0,
  class: "shares-hint"
}, we = {
  key: 0,
  class: "shares-row"
}, ge = {
  __name: "ShareRows",
  setup(x) {
    const N = [
      { key: "1d", label: "1 day" },
      { key: "7d", label: "7 days" },
      { key: "30d", label: "30 days" },
      { key: "never", label: "Never" }
    ], i = G(), { rows: b, failure: V, loaded: F } = i.props.shares, P = M(() => b.value.filter((a) => a.state === "waiting")), T = M(() => b.value.filter((a) => a.state === "active")), L = H(T, { title: (a) => `${a.row_model} ${a.row_id}` }), w = c(new URLSearchParams(globalThis.location.search).get("share") ?? ""), R = c("7d"), g = c(""), A = c(!1), S = c(null), f = c(null), y = c(""), m = c({}), $ = c(!1), D = (a) => a.expires_at ? `ends ${a.expires_at}` : "never ends";
    async function C(a) {
      const e = await i.run(a);
      return y.value = e.ok ? "" : e.error, e.ok && i.reload("shares"), e;
    }
    function W(a) {
      const e = i.props.tunnel.data.value, s = (e == null ? void 0 : e.address) || globalThis.location.origin;
      return { ...a.value, address: `${s}${a.value.link}`, outside: !!(e != null && e.address) };
    }
    async function U() {
      i.state["opens.target"] = w.value.trim(), await i.reload("opens"), y.value = i.props.opens.failure.value, S.value = y.value ? null : i.props.opens.rows.value;
    }
    w.value && U();
    async function I() {
      const a = await C(["share", "make", w.value.trim(), "--ends", R.value, ...g.value ? [`--password=${g.value}`] : [], ...A.value ? ["--comments"] : []]);
      a.ok && (f.value = W(a), g.value = "", S.value = null);
    }
    async function K(a) {
      const e = await C(["share", "accept", String(a.id)]);
      e.ok && (f.value = W(e));
    }
    async function Y() {
      for (const a of T.value) await C(["share", "revoke", String(a.id)]);
      $.value = !1;
    }
    async function j(a) {
      if (m.value[a.id]) {
        const { [a.id]: s, ...p } = m.value;
        return void (m.value = p);
      }
      const e = `comments.${a.id}`;
      await i.reload(e), y.value = i.props[e].failure.value, y.value || (m.value = { ...m.value, [a.id]: i.props[e].rows.value });
    }
    return (a, e) => (t(), B(o(J), null, {
      default: d(() => [
        n("div", ae, [
          n("form", {
            class: "shares-make",
            "data-share-form": "",
            onSubmit: z(I, ["prevent"])
          }, [
            O(n("input", {
              "onUpdate:modelValue": e[0] || (e[0] = (s) => w.value = s),
              class: "shares-target",
              placeholder: "plans:2, docs:12 or reports:4",
              "aria-label": "What to share",
              onChange: U
            }, null, 544), [
              [q, w.value]
            ]),
            n("div", te, [
              e[6] || (e[6] = n("span", { class: "shares-label" }, "Ends after", -1)),
              u(o(Q), {
                options: N,
                value: R.value,
                "data-share-ends": "",
                onPick: e[1] || (e[1] = (s) => R.value = s)
              }, null, 8, ["value"])
            ]),
            n("div", ne, [
              e[7] || (e[7] = n("span", { class: "shares-label" }, "Password", -1)),
              O(n("input", {
                "onUpdate:modelValue": e[2] || (e[2] = (s) => g.value = s),
                class: "shares-password",
                type: "password",
                autocomplete: "new-password",
                placeholder: "None",
                "aria-label": "Password"
              }, null, 512), [
                [q, g.value]
              ]),
              g.value ? (t(), r("span", oe, "Visitors enter any name and this password.")) : v("", !0)
            ]),
            n("div", le, [
              e[8] || (e[8] = n("span", { class: "shares-label" }, "Visitors can comment", -1)),
              u(o(X), {
                on: A.value,
                title: "Let visitors choose a name when commenting",
                onChange: e[3] || (e[3] = (s) => A.value = s)
              }, null, 8, ["on"])
            ]),
            S.value ? (t(), r("div", re, [
              e[9] || (e[9] = n("span", { class: "shares-label" }, "Whoever has the link can view", -1)),
              (t(!0), r(_, null, E(S.value, (s) => (t(), r("span", {
                key: s.id
              }, l(s.line), 1))), 128))
            ])) : v("", !0),
            u(o(k), {
              variant: "primary",
              type: "submit",
              disabled: !w.value.trim()
            }, {
              default: d(() => [...e[10] || (e[10] = [
                h("Create link", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ], 32),
          f.value ? (t(), r(_, { key: 0 }, [
            n("p", ie, l(f.value.address), 1),
            n("p", de, "This link is shown once. Anyone who has it can read it" + l(f.value.expires_at ? ` until ${f.value.expires_at}` : "") + ".", 1),
            f.value.outside ? v("", !0) : (t(), r("p", ue, "No tunnel is connected, so this address works only from this computer."))
          ], 64)) : v("", !0),
          y.value ? (t(), r("p", ve, l(y.value), 1)) : v("", !0),
          P.value.length ? (t(), r("section", pe, [
            e[13] || (e[13] = n("h3", { class: "shares-label" }, "Pending requests", -1)),
            (t(!0), r(_, null, E(P.value, (s) => (t(), r("div", {
              key: s.id,
              class: "shares-row",
              "data-share-row": s.id
            }, [
              n("span", he, "An agent asks to share " + l(s.row_model) + " " + l(s.row_id) + ", " + l(D(s)) + l(s.locked ? ", with a password" : "") + l(s.comments ? ", with comments" : ""), 1),
              u(o(k), {
                small: "",
                variant: "primary",
                "data-share-accept": "",
                onClick: (p) => K(s)
              }, {
                default: d(() => [...e[11] || (e[11] = [
                  h("Accept", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              u(o(k), {
                small: "",
                "data-share-deny": "",
                onClick: (p) => C(["share", "deny", String(s.id)])
              }, {
                default: d(() => [...e[12] || (e[12] = [
                  h("Deny", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])
            ], 8, ce))), 128))
          ])) : v("", !0),
          u(o(Z), { tools: o(L) }, null, 8, ["tools"]),
          u(o(ee), {
            rows: o(L).shown.value,
            failure: o(V),
            loaded: o(F),
            empty: "No link is open",
            hint: "Active share links appear here.",
            searching: o(L).filtering.value
          }, {
            default: d(({ row: s }) => [
              n("div", {
                class: "shares-open",
                "data-share-row": s.id
              }, [
                n("div", ke, [
                  n("span", fe, l(s.row_model) + " " + l(s.row_id) + ", " + l(D(s)) + ", " + l(s.view_count) + " " + l(s.view_count === 1 ? "view" : "views") + l(s.locked ? ", with a password" : ""), 1),
                  s.comments ? (t(), B(o(k), {
                    key: 0,
                    small: "",
                    "data-share-comments-open": "",
                    onClick: (p) => j(s)
                  }, {
                    default: d(() => [...e[14] || (e[14] = [
                      h("Comments", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"])) : v("", !0),
                  u(o(k), {
                    small: "",
                    "data-share-stop": "",
                    onClick: (p) => C(["share", "revoke", String(s.id)])
                  }, {
                    default: d(() => [...e[15] || (e[15] = [
                      h("Stop sharing", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"])
                ]),
                m.value[s.id] ? (t(), r(_, { key: 0 }, [
                  m.value[s.id].length ? v("", !0) : (t(), r("p", ye, "No comments yet")),
                  (t(!0), r(_, null, E(m.value[s.id], (p) => (t(), r("p", {
                    key: p.id,
                    class: "shares-comment",
                    "data-share-comment": ""
                  }, [
                    n("strong", null, l(p.visitor_name), 1),
                    h(" " + l(p.text), 1)
                  ]))), 128))
                ], 64)) : v("", !0)
              ], 8, me)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded", "searching"]),
          T.value.length > 1 ? (t(), r(_, { key: 3 }, [
            $.value ? (t(), r("div", we, [
              u(o(k), {
                small: "",
                onClick: e[4] || (e[4] = (s) => $.value = !1)
              }, {
                default: d(() => [...e[16] || (e[16] = [
                  h("Keep them", -1)
                ])]),
                _: 1
              }),
              u(o(k), {
                small: "",
                variant: "danger",
                "data-share-stop-every-confirm": "",
                onClick: Y
              }, {
                default: d(() => [...e[17] || (e[17] = [
                  h("Yes, stop every share", -1)
                ])]),
                _: 1
              })
            ])) : (t(), B(o(k), {
              key: 1,
              small: "",
              "data-share-stop-every": "",
              onClick: e[5] || (e[5] = (s) => $.value = !0)
            }, {
              default: d(() => [...e[18] || (e[18] = [
                h("Stop every share", -1)
              ])]),
              _: 1
            }))
          ], 64)) : v("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, be = /* @__PURE__ */ se(ge, [["__scopeId", "data-v-de0930ae"]]);
export {
  be as default
};
