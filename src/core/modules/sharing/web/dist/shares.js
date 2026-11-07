/* @code-commandments-generated */
if (!document.getElementById("window-styles-783327b747fc")) { const style = document.createElement("style"); style.id = "window-styles-783327b747fc"; style.textContent = ".shares[data-v-64244b46]{display:flex;flex-direction:column;gap:12px}.shares-make[data-v-64244b46],.shares-waiting[data-v-64244b46],.shares-opens[data-v-64244b46],.shares-open[data-v-64244b46]{display:flex;flex-direction:column;gap:8px;flex:1;min-width:0}.shares-make[data-v-64244b46],.shares-waiting[data-v-64244b46],.shares-opens[data-v-64244b46]{align-items:flex-start}.shares-target[data-v-64244b46]{width:100%;min-width:0}.shares-option[data-v-64244b46],.shares-row[data-v-64244b46]{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center}.shares-label[data-v-64244b46]{margin:0;color:var(--text-3);font-size:12px;font-weight:500}.shares-name[data-v-64244b46]{flex:1;min-width:0}.shares-link[data-v-64244b46],.shares-comment[data-v-64244b46]{margin:0;overflow-wrap:anywhere}.shares-hint[data-v-64244b46],.shares-failure[data-v-64244b46]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as M, ref as c, openBlock as t, createBlock as B, unref as l, withCtx as d, createElementVNode as n, withModifiers as z, withDirectives as O, vModelText as q, createVNode as u, createElementBlock as i, createCommentVNode as v, Fragment as _, renderList as E, toDisplayString as o, createTextVNode as h } from "vue";
import { useWindow as G, useListTools as H, WindowRoom as J, Segmented as Q, Switch as X, Btn as f, ListTools as Z, RowList as ee } from "@journal/window-kit";
const se = (x, N) => {
  const r = x.__vccOpts || x;
  for (const [C, V] of N)
    r[C] = V;
  return r;
}, ae = { class: "shares" }, te = { class: "shares-option" }, ne = { class: "shares-option" }, le = {
  key: 0,
  class: "shares-hint"
}, oe = { class: "shares-option" }, re = {
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
}, ce = ["data-share-row"], he = { class: "shares-name" }, me = ["data-share-row"], fe = { class: "shares-row" }, ke = { class: "shares-name" }, ye = {
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
    ], r = G(), { rows: C, failure: V, loaded: F } = r.props.shares, P = M(() => C.value.filter((a) => a.state === "waiting")), T = M(() => C.value.filter((a) => a.state === "active")), L = H(T, { title: (a) => `${a.row_model} ${a.row_id}` }), w = c(new URLSearchParams(globalThis.location.search).get("share") ?? ""), R = c("7d"), g = c(""), A = c(!1), S = c(null), k = c(null), y = c(""), m = c({}), $ = c(!1), D = (a) => a.expires_at ? `ends ${a.expires_at}` : "never ends";
    async function b(a) {
      const e = await r.run(a);
      return y.value = e.ok ? "" : e.error, e.ok && r.reload("shares"), e;
    }
    async function W(a) {
      await r.reload("tunnel");
      const e = r.props.tunnel.failure.value ? null : r.props.tunnel.data.value, s = (e == null ? void 0 : e.address) || globalThis.location.origin;
      return { ...a.value, address: `${s}${a.value.link}`, outside: !!(e != null && e.address) };
    }
    async function U() {
      r.state["opens.target"] = w.value.trim(), await r.reload("opens"), y.value = r.props.opens.failure.value, S.value = y.value ? null : r.props.opens.rows.value;
    }
    w.value && U();
    async function I() {
      const a = await b(["share", "make", w.value.trim(), "--ends", R.value, ...g.value ? [`--password=${g.value}`] : [], ...A.value ? ["--comments"] : []]);
      a.ok && (k.value = await W(a), g.value = "", S.value = null);
    }
    async function K(a) {
      const e = await b(["share", "accept", String(a.id)]);
      e.ok && (k.value = await W(e));
    }
    async function Y() {
      for (const a of T.value) await b(["share", "revoke", String(a.id)]);
      $.value = !1;
    }
    async function j(a) {
      if (m.value[a.id]) {
        const { [a.id]: s, ...p } = m.value;
        return void (m.value = p);
      }
      const e = `comments.${a.id}`;
      await r.reload(e), y.value = r.props[e].failure.value, y.value || (m.value = { ...m.value, [a.id]: r.props[e].rows.value });
    }
    return (a, e) => (t(), B(l(J), null, {
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
              u(l(Q), {
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
              g.value ? (t(), i("span", le, "Visitors enter any name and this password.")) : v("", !0)
            ]),
            n("div", oe, [
              e[8] || (e[8] = n("span", { class: "shares-label" }, "Visitors can comment", -1)),
              u(l(X), {
                on: A.value,
                title: "Let visitors choose a name when commenting",
                onChange: e[3] || (e[3] = (s) => A.value = s)
              }, null, 8, ["on"])
            ]),
            S.value ? (t(), i("div", re, [
              e[9] || (e[9] = n("span", { class: "shares-label" }, "Whoever has the link can view", -1)),
              (t(!0), i(_, null, E(S.value, (s) => (t(), i("span", {
                key: s.id
              }, o(s.line), 1))), 128))
            ])) : v("", !0),
            u(l(f), {
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
          k.value ? (t(), i(_, { key: 0 }, [
            n("p", ie, o(k.value.address), 1),
            n("p", de, "This link is shown once. Anyone who has it can read it" + o(k.value.expires_at ? ` until ${k.value.expires_at}` : "") + ".", 1),
            k.value.outside ? v("", !0) : (t(), i("p", ue, "No tunnel is connected, so this address works only from this computer."))
          ], 64)) : v("", !0),
          y.value ? (t(), i("p", ve, o(y.value), 1)) : v("", !0),
          P.value.length ? (t(), i("section", pe, [
            e[13] || (e[13] = n("h3", { class: "shares-label" }, "Pending requests", -1)),
            (t(!0), i(_, null, E(P.value, (s) => (t(), i("div", {
              key: s.id,
              class: "shares-row",
              "data-share-row": s.id
            }, [
              n("span", he, "An agent asks to share " + o(s.row_model) + " " + o(s.row_id) + ", " + o(D(s)) + o(s.locked ? ", with a password" : "") + o(s.comments ? ", with comments" : ""), 1),
              u(l(f), {
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
              u(l(f), {
                small: "",
                "data-share-deny": "",
                onClick: (p) => b(["share", "deny", String(s.id)])
              }, {
                default: d(() => [...e[12] || (e[12] = [
                  h("Deny", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])
            ], 8, ce))), 128))
          ])) : v("", !0),
          u(l(Z), { tools: l(L) }, null, 8, ["tools"]),
          u(l(ee), {
            rows: l(L).shown.value,
            failure: l(V),
            loaded: l(F),
            empty: "No link is open",
            hint: "Active share links appear here.",
            searching: l(L).filtering.value
          }, {
            default: d(({ row: s }) => [
              n("div", {
                class: "shares-open",
                "data-share-row": s.id
              }, [
                n("div", fe, [
                  n("span", ke, o(s.row_model) + " " + o(s.row_id) + ", " + o(D(s)) + ", " + o(s.view_count) + " " + o(s.view_count === 1 ? "view" : "views") + o(s.locked ? ", with a password" : ""), 1),
                  s.comments ? (t(), B(l(f), {
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
                  u(l(f), {
                    small: "",
                    "data-share-stop": "",
                    onClick: (p) => b(["share", "revoke", String(s.id)])
                  }, {
                    default: d(() => [...e[15] || (e[15] = [
                      h("Stop sharing", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"])
                ]),
                m.value[s.id] ? (t(), i(_, { key: 0 }, [
                  m.value[s.id].length ? v("", !0) : (t(), i("p", ye, "No comments yet")),
                  (t(!0), i(_, null, E(m.value[s.id], (p) => (t(), i("p", {
                    key: p.id,
                    class: "shares-comment",
                    "data-share-comment": ""
                  }, [
                    n("strong", null, o(p.visitor_name), 1),
                    h(" " + o(p.text), 1)
                  ]))), 128))
                ], 64)) : v("", !0)
              ], 8, me)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded", "searching"]),
          T.value.length > 1 ? (t(), i(_, { key: 3 }, [
            $.value ? (t(), i("div", we, [
              u(l(f), {
                small: "",
                onClick: e[4] || (e[4] = (s) => $.value = !1)
              }, {
                default: d(() => [...e[16] || (e[16] = [
                  h("Keep them", -1)
                ])]),
                _: 1
              }),
              u(l(f), {
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
            ])) : (t(), B(l(f), {
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
}, Ce = /* @__PURE__ */ se(ge, [["__scopeId", "data-v-64244b46"]]);
export {
  Ce as default
};
