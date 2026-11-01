/* @code-commandments-generated */
if (!document.getElementById("window-styles-aaa467cc9b8f")) { const style = document.createElement("style"); style.id = "window-styles-aaa467cc9b8f"; style.textContent = ".phones[data-v-61ad171c]{display:flex;flex-direction:column;gap:16px}.phones-pair[data-v-61ad171c]{display:flex;flex-direction:column;align-items:flex-start;gap:6px}.phones-code[data-v-61ad171c]{margin:0;font-size:18px;letter-spacing:.08em}.phones-hint[data-v-61ad171c],.phones-failure[data-v-61ad171c]{margin:0;color:var(--text-2)}.phones-abilities[data-v-61ad171c]{margin:0;padding-left:18px;color:var(--text-3);font-size:12.5px}.phones-name[data-v-61ad171c]{flex:1}\n"; document.head.appendChild(style); }
import { computed as S, ref as A, openBlock as s, createElementBlock as a, toDisplayString as r, createCommentVNode as c, createElementVNode as l, createVNode as d, unref as e, withCtx as k, createTextVNode as x, Fragment as C, renderList as B } from "vue";
import { useRows as I, useListTools as V, Btn as R, QrCode as E, ListTools as P, RowList as q } from "@journal/window-kit";
const F = (u, h) => {
  const p = u.__vccOpts || u;
  for (const [_, f] of h)
    p[_] = f;
  return p;
}, O = { class: "phones" }, $ = {
  key: 0,
  class: "phones-failure",
  "data-phone-tunnel": ""
}, b = { class: "phones-pair" }, j = { class: "phones-code" }, D = {
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
    const h = ["Read the chat and see what needs you", "Answer questions", "Read reports, documents, plans and tasks", "Approve a plan or ask for changes", "Send the agent instructions"], { rows: p, failure: _, loaded: f, act: v, actionFailure: w, answer: i, context: T } = I("phone list", ["phone.*"]), L = S(() => p.value.filter((t) => t.state === "paired")), y = V(L, { title: (t) => t.name }), m = A(null);
    async function N() {
      const t = await T.read("tunnel status");
      m.value = t.ok ? t.value : null;
    }
    return N(), (t, o) => {
      var g;
      return s(), a("div", O, [
        ((g = m.value) == null ? void 0 : g.state) === "disconnected" ? (s(), a("p", $, "A phone can't reach this journal yet: " + r(m.value.reason), 1)) : c("", !0),
        l("div", b, [
          d(e(R), {
            kind: "primary",
            onClick: o[0] || (o[0] = (n) => e(v)(["phone", "pair"]))
          }, {
            default: k(() => [...o[1] || (o[1] = [
              x("Pair a phone", -1)
            ])]),
            _: 1
          }),
          e(i) ? (s(), a(C, { key: 0 }, [
            l("p", j, "Code: " + r(e(i).code), 1),
            e(i).link ? (s(), a("div", D, [
              d(e(E), {
                text: e(i).link
              }, null, 8, ["text"])
            ])) : c("", !0),
            l("p", Q, "Open " + r(e(i).link) + " on the phone, or type the code on its pairing page. The code works once, for ten minutes.", 1)
          ], 64)) : c("", !0),
          e(w) ? (s(), a("p", U, r(e(w)), 1)) : c("", !0),
          l("ul", z, [
            (s(), a(C, null, B(h, (n) => l("li", { key: n }, r(n), 1)), 64))
          ])
        ]),
        d(e(P), {
          tools: e(y),
          placeholder: "Search the phones"
        }, null, 8, ["tools"]),
        d(e(q), {
          rows: e(y).shown.value,
          failure: e(_),
          loaded: e(f),
          empty: "No phone is paired"
        }, {
          default: k(({ row: n }) => [
            l("span", G, r(n.name), 1),
            d(e(R), {
              small: "",
              onClick: (J) => e(v)(["phone", "unpair", String(n.id)])
            }, {
              default: k(() => [...o[2] || (o[2] = [
                x("Unpair", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]);
    };
  }
}, W = /* @__PURE__ */ F(H, [["__scopeId", "data-v-61ad171c"]]);
export {
  W as default
};
