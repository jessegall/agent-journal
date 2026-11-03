/* @code-commandments-generated */
if (!document.getElementById("window-styles-53a356127812")) { const style = document.createElement("style"); style.id = "window-styles-53a356127812"; style.textContent = ".phones[data-v-608e58f5]{display:flex;flex-direction:column;gap:16px}.phones-pair[data-v-608e58f5]{display:flex;flex-direction:column;align-items:flex-start;gap:6px}.phones-code[data-v-608e58f5]{margin:0;font-size:18px;letter-spacing:.08em}.phones-hint[data-v-608e58f5],.phones-failure[data-v-608e58f5]{margin:0;color:var(--text-2)}.phones-abilities[data-v-608e58f5]{margin:0;padding-left:18px;color:var(--text-3);font-size:12.5px}.phones-name[data-v-608e58f5]{flex:1}\n"; document.head.appendChild(style); }
import { computed as N, ref as B, openBlock as s, createElementBlock as a, toDisplayString as r, createCommentVNode as c, createElementVNode as i, createVNode as d, unref as e, withCtx as v, createTextVNode as x, Fragment as C, renderList as I } from "vue";
import { useRows as S, useListTools as V, Btn as R, QrCode as E, ListTools as P, RowList as j, removed as q } from "@journal/window-kit";
const F = (u, h) => {
  const p = u.__vccOpts || u;
  for (const [_, f] of h)
    p[_] = f;
  return p;
}, O = { class: "phones" }, $ = {
  key: 0,
  class: "phones-failure",
  "data-phone-tunnel": ""
}, b = { class: "phones-pair" }, D = { class: "phones-code" }, Q = {
  key: 0,
  "data-phone-qr": ""
}, U = { class: "phones-hint" }, z = {
  key: 1,
  class: "phones-failure"
}, G = {
  class: "phones-abilities",
  "data-phone-abilities": ""
}, H = { class: "phones-name" }, J = {
  __name: "PhoneRows",
  setup(u) {
    const h = ["Read the chat and see what needs you", "Answer questions", "Read reports, documents, plans and tasks", "Approve a plan or ask for changes", "Send the agent instructions"], { rows: p, failure: _, loaded: f, act: w, actionFailure: y, answer: l, context: T } = S("phone list", ["phone.*"]), A = N(() => p.value.filter((t) => t.state === "paired")), m = V(A, { title: (t) => t.name }), k = B(null);
    async function L() {
      const t = await T.read("tunnel status");
      k.value = t.ok ? t.value : null;
    }
    return L(), (t, n) => {
      var g;
      return s(), a("div", O, [
        ((g = k.value) == null ? void 0 : g.state) === "disconnected" ? (s(), a("p", $, "A phone can't reach this journal yet: " + r(k.value.reason), 1)) : c("", !0),
        i("div", b, [
          d(e(R), {
            kind: "primary",
            onClick: n[0] || (n[0] = (o) => e(w)(["phone", "pair"]))
          }, {
            default: v(() => [...n[1] || (n[1] = [
              x("Pair a phone", -1)
            ])]),
            _: 1
          }),
          e(l) ? (s(), a(C, { key: 0 }, [
            i("p", D, "Code: " + r(e(l).code), 1),
            e(l).link ? (s(), a("div", Q, [
              d(e(E), {
                text: e(l).link
              }, null, 8, ["text"])
            ])) : c("", !0),
            i("p", U, "Open " + r(e(l).link) + " on the phone, or type the code on its pairing page. The code works once, for ten minutes.", 1)
          ], 64)) : c("", !0),
          e(y) ? (s(), a("p", z, r(e(y)), 1)) : c("", !0),
          i("ul", G, [
            (s(), a(C, null, I(h, (o) => i("li", { key: o }, r(o), 1)), 64))
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
          default: v(({ row: o }) => [
            i("span", H, r(o.name), 1),
            d(e(R), {
              small: "",
              onClick: (K) => e(w)(["phone", "unpair", String(o.id)], e(q)(o.id))
            }, {
              default: v(() => [...n[2] || (n[2] = [
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
}, X = /* @__PURE__ */ F(J, [["__scopeId", "data-v-608e58f5"]]);
export {
  X as default
};
