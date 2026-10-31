/* @code-commandments-generated */
if (!document.getElementById("window-styles-1d9533671a2f")) { const style = document.createElement("style"); style.id = "window-styles-1d9533671a2f"; style.textContent = ".phones[data-v-231be85c]{display:flex;flex-direction:column;gap:16px}.phones-pair[data-v-231be85c]{display:flex;flex-direction:column;align-items:flex-start;gap:6px}.phones-code[data-v-231be85c]{margin:0;font-size:18px;letter-spacing:.08em}.phones-hint[data-v-231be85c],.phones-failure[data-v-231be85c]{margin:0;color:var(--text-2)}.phones-name[data-v-231be85c]{flex:1}\n"; document.head.appendChild(style); }
import { computed as g, openBlock as c, createElementBlock as _, createElementVNode as s, createVNode as u, unref as e, withCtx as h, createTextVNode as k, Fragment as C, toDisplayString as a, createCommentVNode as v } from "vue";
import { useRows as x, Btn as w, RowList as N } from "@journal/window-kit";
const R = (r, i) => {
  const t = r.__vccOpts || r;
  for (const [p, n] of i)
    t[p] = n;
  return t;
}, V = { class: "phones" }, B = { class: "phones-pair" }, P = { class: "phones-code" }, E = { class: "phones-hint" }, F = {
  key: 1,
  class: "phones-failure"
}, O = { class: "phones-name" }, S = {
  __name: "PhoneRows",
  setup(r) {
    const { rows: i, failure: t, loaded: p, act: n, actionFailure: m, answer: d } = x("phone list", ["phone.*"]), y = g(() => i.value.filter((f) => f.state === "paired"));
    return (f, o) => (c(), _("div", V, [
      s("div", B, [
        u(e(w), {
          kind: "primary",
          onClick: o[0] || (o[0] = (l) => e(n)(["phone", "pair"]))
        }, {
          default: h(() => [...o[1] || (o[1] = [
            k("Pair a phone", -1)
          ])]),
          _: 1
        }),
        e(d) ? (c(), _(C, { key: 0 }, [
          s("p", P, "Code: " + a(e(d).code), 1),
          s("p", E, "Open " + a(e(d).link) + " on the phone, or type the code on its pairing page. The code works once, for ten minutes.", 1)
        ], 64)) : v("", !0),
        e(m) ? (c(), _("p", F, a(e(m)), 1)) : v("", !0)
      ]),
      u(e(N), {
        rows: y.value,
        failure: e(t),
        loaded: e(p),
        empty: "No phone is paired"
      }, {
        default: h(({ row: l }) => [
          s("span", O, a(l.name), 1),
          u(e(w), {
            small: "",
            onClick: (T) => e(n)(["phone", "unpair", String(l.id)])
          }, {
            default: h(() => [...o[2] || (o[2] = [
              k("Unpair", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ]));
  }
}, D = /* @__PURE__ */ R(S, [["__scopeId", "data-v-231be85c"]]);
export {
  D as default
};
