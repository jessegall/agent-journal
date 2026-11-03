/* @code-commandments-generated */
if (!document.getElementById("window-styles-e02a41bd085e")) { const style = document.createElement("style"); style.id = "window-styles-e02a41bd085e"; style.textContent = ".shares[data-v-82920287]{display:flex;flex-direction:column;gap:12px}.shares-make[data-v-82920287],.shares-waiting[data-v-82920287],.shares-opens[data-v-82920287],.shares-open[data-v-82920287]{display:flex;flex-direction:column;gap:8px;flex:1;min-width:0}.shares-make[data-v-82920287],.shares-waiting[data-v-82920287],.shares-opens[data-v-82920287]{align-items:flex-start}.shares-target[data-v-82920287]{width:100%;min-width:0}.shares-option[data-v-82920287],.shares-row[data-v-82920287]{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center}.shares-label[data-v-82920287]{margin:0;color:var(--text-3);font-size:12px;font-weight:500}.shares-name[data-v-82920287]{flex:1;min-width:0}.shares-link[data-v-82920287],.shares-comment[data-v-82920287]{margin:0;overflow-wrap:anywhere}.shares-hint[data-v-82920287],.shares-failure[data-v-82920287]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as U, ref as c, openBlock as t, createBlock as E, unref as o, withCtx as i, createElementVNode as n, withModifiers as G, withDirectives as O, vModelText as F, createVNode as d, createElementBlock as r, createCommentVNode as u, Fragment as _, renderList as T, toDisplayString as l, createTextVNode as h } from "vue";
import { useWindow as H, useRows as J, useListTools as Q, WindowRoom as X, Segmented as Z, Switch as ee, Btn as m, ListTools as se, RowList as ae } from "@journal/window-kit";
const te = (x, N) => {
  const k = x.__vccOpts || x;
  for (const [b, V] of N)
    k[b] = V;
  return k;
}, ne = { class: "shares" }, oe = { class: "shares-option" }, le = { class: "shares-option" }, re = {
  key: 0,
  class: "shares-hint"
}, ie = { class: "shares-option" }, de = {
  key: 0,
  class: "shares-opens",
  "data-share-opens": ""
}, ue = {
  class: "shares-link",
  "data-share-address": ""
}, ve = { class: "shares-hint" }, ce = {
  key: 0,
  class: "shares-hint",
  "data-share-inside": ""
}, he = {
  key: 1,
  class: "shares-failure",
  role: "alert",
  "data-share-refusal": ""
}, pe = {
  key: 2,
  class: "shares-waiting",
  "data-share-waiting": ""
}, me = ["data-share-row"], ke = { class: "shares-name" }, we = ["data-share-row"], fe = { class: "shares-row" }, ye = { class: "shares-name" }, _e = {
  key: 0,
  class: "shares-hint"
}, ge = {
  key: 0,
  class: "shares-row"
}, Ce = {
  __name: "ShareRows",
  setup(x) {
    const N = [
      { key: "1d", label: "1 day" },
      { key: "7d", label: "7 days" },
      { key: "30d", label: "30 days" },
      { key: "never", label: "Never" }
    ], k = H(), { rows: b, failure: V, loaded: I, load: K } = J("share list", ["share_link.*", "share_comment.*"]), D = U(() => b.value.filter((a) => a.state === "waiting")), R = U(() => b.value.filter((a) => a.state === "active")), L = Q(R, { title: (a) => `${a.row_model} ${a.row_id}` }), f = c(new URLSearchParams(window.location.search).get("share") ?? ""), A = c("7d"), y = c(""), B = c(!1), S = c(null), w = c(null), g = c(""), p = c({}), $ = c(!1), P = (a) => a.expires_at ? `ends ${a.expires_at}` : "never ends";
    async function C(a) {
      const e = await k.run(a);
      return g.value = e.ok ? "" : e.error, e.ok && K(), e;
    }
    async function W(a) {
      const e = await k.read(["tunnel", "status"]), s = e.ok && e.value.address ? e.value.address : window.location.origin;
      return { ...a.value, address: `${s}${a.value.link}`, outside: !!(e.ok && e.value.address) };
    }
    async function M() {
      const a = await k.read(["share", "opens", f.value.trim()]);
      g.value = a.ok ? "" : a.error, S.value = a.ok ? a.value.rows : null;
    }
    f.value && M();
    async function Y() {
      const a = await C(["share", "make", f.value.trim(), "--ends", A.value, ...y.value ? [`--password=${y.value}`] : [], ...B.value ? ["--comments"] : []]);
      a.ok && (w.value = await W(a), y.value = "", S.value = null);
    }
    async function j(a) {
      const e = await C(["share", "accept", String(a.id)]);
      e.ok && (w.value = await W(e));
    }
    async function q() {
      for (const a of R.value) await C(["share", "revoke", String(a.id)]);
      $.value = !1;
    }
    async function z(a) {
      if (p.value[a.id]) {
        const { [a.id]: s, ...v } = p.value;
        return void (p.value = v);
      }
      const e = await k.read(["share", "comments", String(a.id)]);
      g.value = e.ok ? "" : e.error, e.ok && (p.value = { ...p.value, [a.id]: e.value.rows });
    }
    return (a, e) => (t(), E(o(X), null, {
      default: i(() => [
        n("div", ne, [
          n("form", {
            class: "shares-make",
            "data-share-form": "",
            onSubmit: G(Y, ["prevent"])
          }, [
            O(n("input", {
              "onUpdate:modelValue": e[0] || (e[0] = (s) => f.value = s),
              class: "shares-target",
              placeholder: "plans:2, docs:12 or reports:4",
              "aria-label": "What to share",
              onChange: M
            }, null, 544), [
              [F, f.value]
            ]),
            n("div", oe, [
              e[6] || (e[6] = n("span", { class: "shares-label" }, "Ends after", -1)),
              d(o(Z), {
                options: N,
                value: A.value,
                "data-share-ends": "",
                onPick: e[1] || (e[1] = (s) => A.value = s)
              }, null, 8, ["value"])
            ]),
            n("div", le, [
              e[7] || (e[7] = n("span", { class: "shares-label" }, "Password", -1)),
              O(n("input", {
                "onUpdate:modelValue": e[2] || (e[2] = (s) => y.value = s),
                class: "shares-password",
                type: "password",
                autocomplete: "new-password",
                placeholder: "None",
                "aria-label": "Password"
              }, null, 512), [
                [F, y.value]
              ]),
              y.value ? (t(), r("span", re, "Visitors enter any name and this password.")) : u("", !0)
            ]),
            n("div", ie, [
              e[8] || (e[8] = n("span", { class: "shares-label" }, "Visitors can comment", -1)),
              d(o(ee), {
                on: B.value,
                title: "Let visitors comment under a name of their own",
                onChange: e[3] || (e[3] = (s) => B.value = s)
              }, null, 8, ["on"])
            ]),
            S.value ? (t(), r("div", de, [
              e[9] || (e[9] = n("span", { class: "shares-label" }, "Whoever has the link can view", -1)),
              (t(!0), r(_, null, T(S.value, (s) => (t(), r("span", {
                key: s.id
              }, l(s.line), 1))), 128))
            ])) : u("", !0),
            d(o(m), {
              kind: "primary",
              type: "submit",
              disabled: !f.value.trim()
            }, {
              default: i(() => [...e[10] || (e[10] = [
                h("Make a link", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ], 32),
          w.value ? (t(), r(_, { key: 0 }, [
            n("p", ue, l(w.value.address), 1),
            n("p", ve, "This link is shown once. Anyone who has it can read it" + l(w.value.expires_at ? ` until ${w.value.expires_at}` : "") + ".", 1),
            w.value.outside ? u("", !0) : (t(), r("p", ce, "No tunnel is connected, so this address works only from this computer."))
          ], 64)) : u("", !0),
          g.value ? (t(), r("p", he, l(g.value), 1)) : u("", !0),
          D.value.length ? (t(), r("section", pe, [
            e[13] || (e[13] = n("h3", { class: "shares-label" }, "Needs you", -1)),
            (t(!0), r(_, null, T(D.value, (s) => (t(), r("div", {
              key: s.id,
              class: "shares-row",
              "data-share-row": s.id
            }, [
              n("span", ke, "An agent asks to share " + l(s.row_model) + " " + l(s.row_id) + ", " + l(P(s)) + l(s.locked ? ", with a password" : "") + l(s.comments ? ", with comments" : ""), 1),
              d(o(m), {
                small: "",
                kind: "primary",
                "data-share-accept": "",
                onClick: (v) => j(s)
              }, {
                default: i(() => [...e[11] || (e[11] = [
                  h("Accept", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              d(o(m), {
                small: "",
                "data-share-deny": "",
                onClick: (v) => C(["share", "deny", String(s.id)])
              }, {
                default: i(() => [...e[12] || (e[12] = [
                  h("Deny", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])
            ], 8, me))), 128))
          ])) : u("", !0),
          d(o(se), { tools: o(L) }, null, 8, ["tools"]),
          d(o(ae), {
            rows: o(L).shown.value,
            failure: o(V),
            loaded: o(I),
            empty: "No link is open",
            hint: "A link you share an item with shows here until you close it.",
            searching: o(L).filtering.value
          }, {
            default: i(({ row: s }) => [
              n("div", {
                class: "shares-open",
                "data-share-row": s.id
              }, [
                n("div", fe, [
                  n("span", ye, l(s.row_model) + " " + l(s.row_id) + ", " + l(P(s)) + ", " + l(s.view_count) + " " + l(s.view_count === 1 ? "view" : "views") + l(s.locked ? ", with a password" : ""), 1),
                  s.comments ? (t(), E(o(m), {
                    key: 0,
                    small: "",
                    "data-share-comments-open": "",
                    onClick: (v) => z(s)
                  }, {
                    default: i(() => [...e[14] || (e[14] = [
                      h("Comments", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"])) : u("", !0),
                  d(o(m), {
                    small: "",
                    "data-share-stop": "",
                    onClick: (v) => C(["share", "revoke", String(s.id)])
                  }, {
                    default: i(() => [...e[15] || (e[15] = [
                      h("Stop sharing", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"])
                ]),
                p.value[s.id] ? (t(), r(_, { key: 0 }, [
                  p.value[s.id].length ? u("", !0) : (t(), r("p", _e, "No comments yet")),
                  (t(!0), r(_, null, T(p.value[s.id], (v) => (t(), r("p", {
                    key: v.id,
                    class: "shares-comment",
                    "data-share-comment": ""
                  }, [
                    n("strong", null, l(v.visitor_name), 1),
                    h(" " + l(v.text), 1)
                  ]))), 128))
                ], 64)) : u("", !0)
              ], 8, we)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded", "searching"]),
          R.value.length > 1 ? (t(), r(_, { key: 3 }, [
            $.value ? (t(), r("div", ge, [
              d(o(m), {
                small: "",
                onClick: e[4] || (e[4] = (s) => $.value = !1)
              }, {
                default: i(() => [...e[16] || (e[16] = [
                  h("Keep them", -1)
                ])]),
                _: 1
              }),
              d(o(m), {
                small: "",
                kind: "danger",
                "data-share-stop-every-confirm": "",
                onClick: q
              }, {
                default: i(() => [...e[17] || (e[17] = [
                  h("Yes, stop every share", -1)
                ])]),
                _: 1
              })
            ])) : (t(), E(o(m), {
              key: 1,
              small: "",
              "data-share-stop-every": "",
              onClick: e[5] || (e[5] = (s) => $.value = !0)
            }, {
              default: i(() => [...e[18] || (e[18] = [
                h("Stop every share", -1)
              ])]),
              _: 1
            }))
          ], 64)) : u("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, $e = /* @__PURE__ */ te(Ce, [["__scopeId", "data-v-82920287"]]);
export {
  $e as default
};
