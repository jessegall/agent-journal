/* @code-commandments-generated */
if (!document.getElementById("window-styles-8bbdc05c5070")) { const style = document.createElement("style"); style.id = "window-styles-8bbdc05c5070"; style.textContent = ".phones[data-v-7c70d321]{display:flex;flex-direction:column;gap:16px}.phones-pair[data-v-7c70d321]{display:flex;flex-direction:column;align-items:flex-start;gap:6px}.phones-code[data-v-7c70d321]{margin:0;font-size:18px;letter-spacing:.08em}.phones-hint[data-v-7c70d321],.phones-failure[data-v-7c70d321]{margin:0;color:var(--text-2)}.phones-abilities[data-v-7c70d321]{margin:0;padding-left:18px;color:var(--text-3);font-size:12.5px}.phones-name[data-v-7c70d321]{flex:1}\n"; document.head.appendChild(style); }
import { computed as N, ref as B, openBlock as s, createElementBlock as a, toDisplayString as r, createCommentVNode as c, createElementVNode as i, createVNode as d, unref as e, withCtx as v, createTextVNode as x, Fragment as C, renderList as I } from "vue";
import { useRows as S, useListTools as V, Btn as R, QrCode as E, ListTools as P, RowList as j } from "@journal/window-kit";
const q = (u, h) => {
  const p = u.__vccOpts || u;
  for (const [_, f] of h)
    p[_] = f;
  return p;
}, F = { class: "phones" }, O = {
  key: 0,
  class: "phones-failure",
  "data-phone-tunnel": ""
}, $ = { class: "phones-pair" }, b = { class: "phones-code" }, D = {
  key: 0,
  "data-phone-qr": ""
}, Q = { class: "phones-hint" }, U = {
  key: 1,
  class: "phones-failure"
}, z = {
  class: "phones-abilities",
  "data-phone-abilities": ""
}, G = { class: "phones-name" }, H = {
  __name: "PhoneRows",
  setup(u) {
    const h = ["Read the chat and see what needs you", "Answer questions", "Read reports, documents, plans and tasks", "Approve a plan or ask for changes", "Send the agent instructions"], { rows: p, failure: _, loaded: f, act: w, actionFailure: y, answer: l, context: T } = S("phone list", ["phone.*"]), A = N(() => p.value.filter((t) => t.state === "paired")), m = V(A, { title: (t) => t.name }), k = B(null);
    async function L() {
      const t = await T.read("tunnel status");
      k.value = t.ok ? t.value : null;
    }
    return L(), (t, o) => {
      var g;
      return s(), a("div", F, [
        ((g = k.value) == null ? void 0 : g.state) === "disconnected" ? (s(), a("p", O, "A phone can't reach this journal yet: " + r(k.value.reason), 1)) : c("", !0),
        i("div", $, [
          d(e(R), {
            kind: "primary",
            onClick: o[0] || (o[0] = (n) => e(w)(["phone", "pair"]))
          }, {
            default: v(() => [...o[1] || (o[1] = [
              x("Pair a phone", -1)
            ])]),
            _: 1
          }),
          e(l) ? (s(), a(C, { key: 0 }, [
            i("p", b, "Code: " + r(e(l).code), 1),
            e(l).link ? (s(), a("div", D, [
              d(e(E), {
                text: e(l).link
              }, null, 8, ["text"])
            ])) : c("", !0),
            i("p", Q, "Open " + r(e(l).link) + " on the phone, or type the code on its pairing page. The code works once, for ten minutes.", 1)
          ], 64)) : c("", !0),
          e(y) ? (s(), a("p", U, r(e(y)), 1)) : c("", !0),
          i("ul", z, [
            (s(), a(C, null, I(h, (n) => i("li", { key: n }, r(n), 1)), 64))
          ])
        ]),
        d(e(P), { tools: e(m) }, null, 8, ["tools"]),
        d(e(j), {
          rows: e(m).shown.value,
          failure: e(_),
          loaded: e(f),
          empty: "No phone is paired",
          hint: "A phone you pair with this journal shows here.",
          searching: e(m).filtering.value
        }, {
          default: v(({ row: n }) => [
            i("span", G, r(n.name), 1),
            d(e(R), {
              small: "",
              onClick: (J) => e(w)(["phone", "unpair", String(n.id)])
            }, {
              default: v(() => [...o[2] || (o[2] = [
                x("Unpair", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "searching"])
      ]);
    };
  }
}, W = /* @__PURE__ */ q(H, [["__scopeId", "data-v-7c70d321"]]);
export {
  W as default
};
