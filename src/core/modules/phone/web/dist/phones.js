/* @code-commandments-generated */
if (!document.getElementById("window-styles-b42ee69035f8")) { const style = document.createElement("style"); style.id = "window-styles-b42ee69035f8"; style.textContent = ".phones[data-v-302efb71]{display:flex;flex-direction:column;gap:16px}.phones-pair[data-v-302efb71]{display:flex;flex-direction:column;align-items:flex-start;gap:6px}.phones-code[data-v-302efb71]{margin:0;font-size:18px;letter-spacing:.08em}.phones-hint[data-v-302efb71],.phones-failure[data-v-302efb71]{margin:0;color:var(--text-2)}.phones-name[data-v-302efb71]{flex:1}\n"; document.head.appendChild(style); }
import { computed as x, openBlock as r, createElementBlock as a, createElementVNode as i, createVNode as p, unref as e, withCtx as h, createTextVNode as v, Fragment as C, toDisplayString as d, createCommentVNode as m } from "vue";
import { useRows as g, Btn as w, QrCode as N, RowList as R } from "@journal/window-kit";
const V = (l, c) => {
  const n = l.__vccOpts || l;
  for (const [_, s] of c)
    n[_] = s;
  return n;
}, B = { class: "phones" }, P = { class: "phones-pair" }, E = { class: "phones-code" }, F = {
  key: 0,
  "data-phone-qr": ""
}, O = { class: "phones-hint" }, S = {
  key: 1,
  class: "phones-failure"
}, T = { class: "phones-name" }, $ = {
  __name: "PhoneRows",
  setup(l) {
    const { rows: c, failure: n, loaded: _, act: s, actionFailure: f, answer: t } = g("phone list", ["phone.*"]), y = x(() => c.value.filter((k) => k.state === "paired"));
    return (k, o) => (r(), a("div", B, [
      i("div", P, [
        p(e(w), {
          kind: "primary",
          onClick: o[0] || (o[0] = (u) => e(s)(["phone", "pair"]))
        }, {
          default: h(() => [...o[1] || (o[1] = [
            v("Pair a phone", -1)
          ])]),
          _: 1
        }),
        e(t) ? (r(), a(C, { key: 0 }, [
          i("p", E, "Code: " + d(e(t).code), 1),
          e(t).link ? (r(), a("div", F, [
            p(e(N), {
              text: e(t).link
            }, null, 8, ["text"])
          ])) : m("", !0),
          i("p", O, "Open " + d(e(t).link) + " on the phone, or type the code on its pairing page. The code works once, for ten minutes.", 1)
        ], 64)) : m("", !0),
        e(f) ? (r(), a("p", S, d(e(f)), 1)) : m("", !0)
      ]),
      p(e(R), {
        rows: y.value,
        failure: e(n),
        loaded: e(_),
        empty: "No phone is paired"
      }, {
        default: h(({ row: u }) => [
          i("span", T, d(u.name), 1),
          p(e(w), {
            small: "",
            onClick: (b) => e(s)(["phone", "unpair", String(u.id)])
          }, {
            default: h(() => [...o[2] || (o[2] = [
              v("Unpair", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ]));
  }
}, I = /* @__PURE__ */ V($, [["__scopeId", "data-v-302efb71"]]);
export {
  I as default
};
