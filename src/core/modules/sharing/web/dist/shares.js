/* @code-commandments-generated */
if (!document.getElementById("window-styles-a7fa17e05d9e")) { const style = document.createElement("style"); style.id = "window-styles-a7fa17e05d9e"; style.textContent = ".shares[data-v-b72f325d]{display:flex;flex-direction:column;gap:12px}.shares-make[data-v-b72f325d],.shares-waiting[data-v-b72f325d],.shares-opens[data-v-b72f325d],.shares-open[data-v-b72f325d]{display:flex;flex-direction:column;gap:8px;flex:1;min-width:0}.shares-make[data-v-b72f325d],.shares-waiting[data-v-b72f325d],.shares-opens[data-v-b72f325d]{align-items:flex-start}.shares-target[data-v-b72f325d]{width:100%;min-width:0}.shares-option[data-v-b72f325d],.shares-row[data-v-b72f325d]{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center}.shares-label[data-v-b72f325d]{margin:0;color:var(--text-3);font-size:12px;font-weight:500}.shares-name[data-v-b72f325d]{flex:1;min-width:0}.shares-link[data-v-b72f325d],.shares-comment[data-v-b72f325d]{margin:0;overflow-wrap:anywhere}.shares-hint[data-v-b72f325d],.shares-failure[data-v-b72f325d]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as U, ref as v, openBlock as t, createElementBlock as o, createElementVNode as n, withModifiers as G, withDirectives as W, vModelText as O, createVNode as i, unref as l, createCommentVNode as d, Fragment as _, renderList as E, toDisplayString as r, withCtx as c, createTextVNode as h, createBlock as F } from "vue";
import { useWindow as H, useRows as J, useListTools as Q, Segmented as X, Switch as Z, Btn as m, ListTools as ee, RowList as se } from "@journal/window-kit";
const ae = (x, N) => {
  const k = x.__vccOpts || x;
  for (const [b, V] of N)
    k[b] = V;
  return k;
}, te = { class: "shares" }, ne = { class: "shares-option" }, oe = { class: "shares-option" }, le = {
  key: 0,
  class: "shares-hint"
}, re = { class: "shares-option" }, ie = {
  key: 0,
  class: "shares-opens",
  "data-share-opens": ""
}, de = {
  class: "shares-link",
  "data-share-address": ""
}, ue = { class: "shares-hint" }, ve = {
  key: 0,
  class: "shares-hint",
  "data-share-inside": ""
}, ce = {
  key: 1,
  class: "shares-failure",
  role: "alert",
  "data-share-refusal": ""
}, he = {
  key: 2,
  class: "shares-waiting",
  "data-share-waiting": ""
}, pe = ["data-share-row"], me = { class: "shares-name" }, ke = ["data-share-row"], we = { class: "shares-row" }, fe = { class: "shares-name" }, ye = {
  key: 0,
  class: "shares-hint"
}, _e = {
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
    ], k = H(), { rows: b, failure: V, loaded: I, load: K } = J("share list", ["share_link.*", "share_comment.*"]), T = U(() => b.value.filter((a) => a.state === "waiting")), L = U(() => b.value.filter((a) => a.state === "active")), R = Q(L, { title: (a) => `${a.row_model} ${a.row_id}` }), f = v(new URLSearchParams(window.location.search).get("share") ?? ""), A = v("7d"), y = v(""), B = v(!1), S = v(null), w = v(null), g = v(""), p = v({}), $ = v(!1), D = (a) => a.expires_at ? `ends ${a.expires_at}` : "never ends";
    async function C(a) {
      const e = await k.run(a);
      return g.value = e.ok ? "" : e.error, e.ok && K(), e;
    }
    async function P(a) {
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
      a.ok && (w.value = await P(a), y.value = "", S.value = null);
    }
    async function j(a) {
      const e = await C(["share", "accept", String(a.id)]);
      e.ok && (w.value = await P(e));
    }
    async function q() {
      for (const a of L.value) await C(["share", "revoke", String(a.id)]);
      $.value = !1;
    }
    async function z(a) {
      if (p.value[a.id]) {
        const { [a.id]: s, ...u } = p.value;
        return void (p.value = u);
      }
      const e = await k.read(["share", "comments", String(a.id)]);
      g.value = e.ok ? "" : e.error, e.ok && (p.value = { ...p.value, [a.id]: e.value.rows });
    }
    return (a, e) => (t(), o("div", te, [
      n("form", {
        class: "shares-make",
        "data-share-form": "",
        onSubmit: G(Y, ["prevent"])
      }, [
        W(n("input", {
          "onUpdate:modelValue": e[0] || (e[0] = (s) => f.value = s),
          class: "shares-target",
          placeholder: "plans:2, docs:12 or reports:4",
          "aria-label": "What to share",
          onChange: M
        }, null, 544), [
          [O, f.value]
        ]),
        n("div", ne, [
          e[6] || (e[6] = n("span", { class: "shares-label" }, "Ends after", -1)),
          i(l(X), {
            options: N,
            value: A.value,
            "data-share-ends": "",
            onPick: e[1] || (e[1] = (s) => A.value = s)
          }, null, 8, ["value"])
        ]),
        n("div", oe, [
          e[7] || (e[7] = n("span", { class: "shares-label" }, "Password", -1)),
          W(n("input", {
            "onUpdate:modelValue": e[2] || (e[2] = (s) => y.value = s),
            class: "shares-password",
            type: "password",
            autocomplete: "new-password",
            placeholder: "None",
            "aria-label": "Password"
          }, null, 512), [
            [O, y.value]
          ]),
          y.value ? (t(), o("span", le, "Visitors enter any name and this password.")) : d("", !0)
        ]),
        n("div", re, [
          e[8] || (e[8] = n("span", { class: "shares-label" }, "Visitors can comment", -1)),
          i(l(Z), {
            on: B.value,
            title: "Let visitors comment under a name of their own",
            onChange: e[3] || (e[3] = (s) => B.value = s)
          }, null, 8, ["on"])
        ]),
        S.value ? (t(), o("div", ie, [
          e[9] || (e[9] = n("span", { class: "shares-label" }, "Whoever has the link can view", -1)),
          (t(!0), o(_, null, E(S.value, (s) => (t(), o("span", {
            key: s.id
          }, r(s.line), 1))), 128))
        ])) : d("", !0),
        i(l(m), {
          kind: "primary",
          type: "submit",
          disabled: !f.value.trim()
        }, {
          default: c(() => [...e[10] || (e[10] = [
            h("Make a link", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32),
      w.value ? (t(), o(_, { key: 0 }, [
        n("p", de, r(w.value.address), 1),
        n("p", ue, "This link is shown once. Anyone who has it can read it" + r(w.value.expires_at ? ` until ${w.value.expires_at}` : "") + ".", 1),
        w.value.outside ? d("", !0) : (t(), o("p", ve, "No tunnel is connected, so this address works only from this computer."))
      ], 64)) : d("", !0),
      g.value ? (t(), o("p", ce, r(g.value), 1)) : d("", !0),
      T.value.length ? (t(), o("section", he, [
        e[13] || (e[13] = n("h3", { class: "shares-label" }, "Needs you", -1)),
        (t(!0), o(_, null, E(T.value, (s) => (t(), o("div", {
          key: s.id,
          class: "shares-row",
          "data-share-row": s.id
        }, [
          n("span", me, "An agent asks to share " + r(s.row_model) + " " + r(s.row_id) + ", " + r(D(s)) + r(s.locked ? ", with a password" : "") + r(s.comments ? ", with comments" : ""), 1),
          i(l(m), {
            small: "",
            kind: "primary",
            "data-share-accept": "",
            onClick: (u) => j(s)
          }, {
            default: c(() => [...e[11] || (e[11] = [
              h("Accept", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]),
          i(l(m), {
            small: "",
            "data-share-deny": "",
            onClick: (u) => C(["share", "deny", String(s.id)])
          }, {
            default: c(() => [...e[12] || (e[12] = [
              h("Deny", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ], 8, pe))), 128))
      ])) : d("", !0),
      i(l(ee), { tools: l(R) }, null, 8, ["tools"]),
      i(l(se), {
        rows: l(R).shown.value,
        failure: l(V),
        loaded: l(I),
        empty: "No link is open",
        hint: "A link you share a row with shows here until you close it.",
        searching: l(R).filtering.value
      }, {
        default: c(({ row: s }) => [
          n("div", {
            class: "shares-open",
            "data-share-row": s.id
          }, [
            n("div", we, [
              n("span", fe, r(s.row_model) + " " + r(s.row_id) + ", " + r(D(s)) + ", " + r(s.view_count) + " " + r(s.view_count === 1 ? "view" : "views") + r(s.locked ? ", with a password" : ""), 1),
              s.comments ? (t(), F(l(m), {
                key: 0,
                small: "",
                "data-share-comments-open": "",
                onClick: (u) => z(s)
              }, {
                default: c(() => [...e[14] || (e[14] = [
                  h("Comments", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : d("", !0),
              i(l(m), {
                small: "",
                "data-share-stop": "",
                onClick: (u) => C(["share", "revoke", String(s.id)])
              }, {
                default: c(() => [...e[15] || (e[15] = [
                  h("Stop sharing", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])
            ]),
            p.value[s.id] ? (t(), o(_, { key: 0 }, [
              p.value[s.id].length ? d("", !0) : (t(), o("p", ye, "No comments yet")),
              (t(!0), o(_, null, E(p.value[s.id], (u) => (t(), o("p", {
                key: u.id,
                class: "shares-comment",
                "data-share-comment": ""
              }, [
                n("strong", null, r(u.visitor_name), 1),
                h(" " + r(u.text), 1)
              ]))), 128))
            ], 64)) : d("", !0)
          ], 8, ke)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "searching"]),
      L.value.length > 1 ? (t(), o(_, { key: 3 }, [
        $.value ? (t(), o("div", _e, [
          i(l(m), {
            small: "",
            onClick: e[4] || (e[4] = (s) => $.value = !1)
          }, {
            default: c(() => [...e[16] || (e[16] = [
              h("Keep them", -1)
            ])]),
            _: 1
          }),
          i(l(m), {
            small: "",
            kind: "danger",
            "data-share-stop-every-confirm": "",
            onClick: q
          }, {
            default: c(() => [...e[17] || (e[17] = [
              h("Yes, stop every share", -1)
            ])]),
            _: 1
          })
        ])) : (t(), F(l(m), {
          key: 1,
          small: "",
          "data-share-stop-every": "",
          onClick: e[5] || (e[5] = (s) => $.value = !0)
        }, {
          default: c(() => [...e[18] || (e[18] = [
            h("Stop every share", -1)
          ])]),
          _: 1
        }))
      ], 64)) : d("", !0)
    ]));
  }
}, Se = /* @__PURE__ */ ae(ge, [["__scopeId", "data-v-b72f325d"]]);
export {
  Se as default
};
