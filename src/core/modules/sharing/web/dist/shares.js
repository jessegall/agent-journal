/* @code-commandments-generated */
if (!document.getElementById("window-styles-891bb098c27f")) { const style = document.createElement("style"); style.id = "window-styles-891bb098c27f"; style.textContent = ".shares[data-v-c1afeb1c]{display:flex;flex-direction:column;gap:12px}.shares-make[data-v-c1afeb1c],.shares-waiting[data-v-c1afeb1c],.shares-opens[data-v-c1afeb1c],.shares-open[data-v-c1afeb1c]{display:flex;flex-direction:column;gap:8px;flex:1;min-width:0}.shares-make[data-v-c1afeb1c],.shares-waiting[data-v-c1afeb1c],.shares-opens[data-v-c1afeb1c]{align-items:flex-start}.shares-target[data-v-c1afeb1c]{width:100%;min-width:0}.shares-option[data-v-c1afeb1c],.shares-row[data-v-c1afeb1c]{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center}.shares-label[data-v-c1afeb1c]{margin:0;color:var(--text-3);font-size:12px;font-weight:500}.shares-name[data-v-c1afeb1c]{flex:1;min-width:0}.shares-link[data-v-c1afeb1c],.shares-comment[data-v-c1afeb1c]{margin:0;overflow-wrap:anywhere}.shares-hint[data-v-c1afeb1c],.shares-failure[data-v-c1afeb1c]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { onMounted as H, onUnmounted as J, computed as O, ref as v, openBlock as t, createElementBlock as o, createElementVNode as n, withModifiers as Q, withDirectives as U, vModelText as W, createVNode as i, unref as r, createCommentVNode as d, Fragment as w, renderList as M, toDisplayString as l, withCtx as c, createTextVNode as p, createBlock as F } from "vue";
import { useWindow as X, useRows as Z, useListTools as ee, Segmented as se, Switch as ae, Btn as m, ListTools as te, RowList as ne } from "@journal/window-kit";
const oe = (x, N) => {
  const k = x.__vccOpts || x;
  for (const [b, V] of N)
    k[b] = V;
  return k;
}, le = { class: "shares" }, re = { class: "shares-option" }, ie = { class: "shares-option" }, de = {
  key: 0,
  class: "shares-hint"
}, ue = { class: "shares-option" }, ve = {
  key: 0,
  class: "shares-opens",
  "data-share-opens": ""
}, ce = {
  class: "shares-link",
  "data-share-address": ""
}, pe = { class: "shares-hint" }, he = {
  key: 0,
  class: "shares-hint",
  "data-share-inside": ""
}, me = {
  key: 1,
  class: "shares-failure",
  role: "alert",
  "data-share-refusal": ""
}, ke = {
  key: 2,
  class: "shares-waiting",
  "data-share-waiting": ""
}, fe = ["data-share-row"], ye = { class: "shares-name" }, we = ["data-share-row"], _e = { class: "shares-row" }, ge = { class: "shares-name" }, Ce = {
  key: 0,
  class: "shares-hint"
}, be = {
  key: 0,
  class: "shares-row"
}, Se = 1e4, $e = {
  __name: "ShareRows",
  setup(x) {
    const N = [
      { key: "1d", label: "1 day" },
      { key: "7d", label: "7 days" },
      { key: "30d", label: "30 days" },
      { key: "never", label: "Never" }
    ], k = X(), { rows: b, failure: V, loaded: K, load: R } = Z("share list", []);
    let T = 0;
    H(() => T = setInterval(R, Se)), J(() => clearInterval(T));
    const A = O(() => b.value.filter((a) => a.state === "waiting")), L = O(() => b.value.filter((a) => a.state === "active")), D = ee(L, { title: (a) => `${a.row_model} ${a.row_id}` }), _ = v(""), B = v("7d"), y = v(""), E = v(!1), S = v(null), f = v(null), g = v(""), h = v({}), $ = v(!1), P = (a) => a.expires_at ? `ends ${a.expires_at}` : "never ends";
    async function C(a) {
      const e = await k.run(a);
      return g.value = e.ok ? "" : e.error, e.ok && R(), e;
    }
    async function I(a) {
      const e = await k.read(["tunnel", "status"]), s = e.ok && e.value.address ? e.value.address : window.location.origin;
      return { ...a.value, address: `${s}${a.value.link}`, outside: !!(e.ok && e.value.address) };
    }
    async function Y() {
      const a = await k.read(["share", "opens", _.value.trim()]);
      g.value = a.ok ? "" : a.error, S.value = a.ok ? a.value.rows : null;
    }
    async function j() {
      const a = await C(["share", "make", _.value.trim(), "--ends", B.value, ...y.value ? [`--password=${y.value}`] : [], ...E.value ? ["--comments"] : []]);
      a.ok && (f.value = await I(a), y.value = "", S.value = null);
    }
    async function q(a) {
      const e = await C(["share", "accept", String(a.id)]);
      e.ok && (f.value = await I(e));
    }
    async function z() {
      for (const a of L.value) await C(["share", "revoke", String(a.id)]);
      $.value = !1;
    }
    async function G(a) {
      if (h.value[a.id]) {
        const { [a.id]: s, ...u } = h.value;
        return void (h.value = u);
      }
      const e = await k.read(["share", "comments", String(a.id)]);
      g.value = e.ok ? "" : e.error, e.ok && (h.value = { ...h.value, [a.id]: e.value.rows });
    }
    return (a, e) => (t(), o("div", le, [
      n("form", {
        class: "shares-make",
        "data-share-form": "",
        onSubmit: Q(j, ["prevent"])
      }, [
        U(n("input", {
          "onUpdate:modelValue": e[0] || (e[0] = (s) => _.value = s),
          class: "shares-target",
          placeholder: "plans:2",
          "aria-label": "What to share",
          onChange: Y
        }, null, 544), [
          [W, _.value]
        ]),
        n("div", re, [
          e[6] || (e[6] = n("span", { class: "shares-label" }, "Ends after", -1)),
          i(r(se), {
            options: N,
            value: B.value,
            "data-share-ends": "",
            onPick: e[1] || (e[1] = (s) => B.value = s)
          }, null, 8, ["value"])
        ]),
        n("div", ie, [
          e[7] || (e[7] = n("span", { class: "shares-label" }, "Password", -1)),
          U(n("input", {
            "onUpdate:modelValue": e[2] || (e[2] = (s) => y.value = s),
            class: "shares-password",
            type: "password",
            autocomplete: "new-password",
            placeholder: "None",
            "aria-label": "Password"
          }, null, 512), [
            [W, y.value]
          ]),
          y.value ? (t(), o("span", de, "Visitors enter any name and this password.")) : d("", !0)
        ]),
        n("div", ue, [
          e[8] || (e[8] = n("span", { class: "shares-label" }, "Visitors can comment", -1)),
          i(r(ae), {
            on: E.value,
            title: "Let visitors comment under a name of their own",
            onChange: e[3] || (e[3] = (s) => E.value = s)
          }, null, 8, ["on"])
        ]),
        S.value ? (t(), o("div", ve, [
          e[9] || (e[9] = n("span", { class: "shares-label" }, "Whoever has the link can view", -1)),
          (t(!0), o(w, null, M(S.value, (s) => (t(), o("span", {
            key: s.id
          }, l(s.line), 1))), 128))
        ])) : d("", !0),
        i(r(m), {
          kind: "primary",
          type: "submit",
          disabled: !_.value.trim()
        }, {
          default: c(() => [...e[10] || (e[10] = [
            p("Make a link", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32),
      f.value ? (t(), o(w, { key: 0 }, [
        n("p", ce, l(f.value.address), 1),
        n("p", pe, "This link is shown once. Anyone who has it can read it" + l(f.value.expires_at ? ` until ${f.value.expires_at}` : "") + ".", 1),
        f.value.outside ? d("", !0) : (t(), o("p", he, "No tunnel is connected, so this address works only from this computer."))
      ], 64)) : d("", !0),
      g.value ? (t(), o("p", me, l(g.value), 1)) : d("", !0),
      A.value.length ? (t(), o("section", ke, [
        e[13] || (e[13] = n("h3", { class: "shares-label" }, "Needs you", -1)),
        (t(!0), o(w, null, M(A.value, (s) => (t(), o("div", {
          key: s.id,
          class: "shares-row",
          "data-share-row": s.id
        }, [
          n("span", ye, "An agent asks to share " + l(s.row_model) + " " + l(s.row_id) + ", " + l(P(s)) + l(s.locked ? ", with a password" : "") + l(s.comments ? ", with comments" : ""), 1),
          i(r(m), {
            small: "",
            kind: "primary",
            "data-share-accept": "",
            onClick: (u) => q(s)
          }, {
            default: c(() => [...e[11] || (e[11] = [
              p("Accept", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]),
          i(r(m), {
            small: "",
            "data-share-deny": "",
            onClick: (u) => C(["share", "deny", String(s.id)])
          }, {
            default: c(() => [...e[12] || (e[12] = [
              p("Deny", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ], 8, fe))), 128))
      ])) : d("", !0),
      i(r(te), {
        tools: r(D),
        placeholder: "Search the links"
      }, null, 8, ["tools"]),
      i(r(ne), {
        rows: r(D).shown.value,
        failure: r(V),
        loaded: r(K),
        empty: "No link is open"
      }, {
        default: c(({ row: s }) => [
          n("div", {
            class: "shares-open",
            "data-share-row": s.id
          }, [
            n("div", _e, [
              n("span", ge, l(s.row_model) + " " + l(s.row_id) + ", " + l(P(s)) + ", " + l(s.view_count) + " " + l(s.view_count === 1 ? "view" : "views") + l(s.locked ? ", with a password" : ""), 1),
              s.comments ? (t(), F(r(m), {
                key: 0,
                small: "",
                "data-share-comments-open": "",
                onClick: (u) => G(s)
              }, {
                default: c(() => [...e[14] || (e[14] = [
                  p("Comments", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : d("", !0),
              i(r(m), {
                small: "",
                "data-share-stop": "",
                onClick: (u) => C(["share", "revoke", String(s.id)])
              }, {
                default: c(() => [...e[15] || (e[15] = [
                  p("Stop sharing", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])
            ]),
            h.value[s.id] ? (t(), o(w, { key: 0 }, [
              h.value[s.id].length ? d("", !0) : (t(), o("p", Ce, "No comments yet")),
              (t(!0), o(w, null, M(h.value[s.id], (u) => (t(), o("p", {
                key: u.id,
                class: "shares-comment",
                "data-share-comment": ""
              }, [
                n("strong", null, l(u.visitor_name), 1),
                p(" " + l(u.text), 1)
              ]))), 128))
            ], 64)) : d("", !0)
          ], 8, we)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"]),
      L.value.length > 1 ? (t(), o(w, { key: 3 }, [
        $.value ? (t(), o("div", be, [
          i(r(m), {
            small: "",
            onClick: e[4] || (e[4] = (s) => $.value = !1)
          }, {
            default: c(() => [...e[16] || (e[16] = [
              p("Keep them", -1)
            ])]),
            _: 1
          }),
          i(r(m), {
            small: "",
            kind: "danger",
            "data-share-stop-every-confirm": "",
            onClick: z
          }, {
            default: c(() => [...e[17] || (e[17] = [
              p("Yes, stop every share", -1)
            ])]),
            _: 1
          })
        ])) : (t(), F(r(m), {
          key: 1,
          small: "",
          "data-share-stop-every": "",
          onClick: e[5] || (e[5] = (s) => $.value = !0)
        }, {
          default: c(() => [...e[18] || (e[18] = [
            p("Stop every share", -1)
          ])]),
          _: 1
        }))
      ], 64)) : d("", !0)
    ]));
  }
}, Ve = /* @__PURE__ */ oe($e, [["__scopeId", "data-v-c1afeb1c"]]);
export {
  Ve as default
};
