/* @code-commandments-generated */
if (!document.getElementById("window-styles-d4d058742620")) { const style = document.createElement("style"); style.id = "window-styles-d4d058742620"; style.textContent = ".phones[data-v-0fdd9934]{display:flex;flex-direction:column;gap:16px}.phones-pair[data-v-0fdd9934]{display:flex;flex-direction:column;align-items:flex-start;gap:6px}.phones-code[data-v-0fdd9934]{margin:0;font-size:18px;letter-spacing:.08em}.phones-hint[data-v-0fdd9934],.phones-failure[data-v-0fdd9934]{margin:0;color:var(--text-2)}.phones-abilities[data-v-0fdd9934]{margin:0;padding-left:18px;color:var(--text-3);font-size:12.5px}.phones-name[data-v-0fdd9934]{flex:1}\n"; document.head.appendChild(style); }
import { computed as B, ref as I, openBlock as o, createElementBlock as s, toDisplayString as a, createCommentVNode as p, createElementVNode as r, createVNode as c, unref as e, withCtx as m, createTextVNode as g, Fragment as x, renderList as S } from "vue";
import { useRows as T, Btn as C, QrCode as V, RowList as E } from "@journal/window-kit";
const L = (u, h) => {
  const d = u.__vccOpts || u;
  for (const [_, f] of h)
    d[_] = f;
  return d;
}, P = { class: "phones" }, q = {
  key: 0,
  class: "phones-failure",
  "data-phone-tunnel": ""
}, F = { class: "phones-pair" }, O = { class: "phones-code" }, $ = {
  key: 0,
  "data-phone-qr": ""
}, b = { class: "phones-hint" }, j = {
  key: 1,
  class: "phones-failure"
}, D = {
  class: "phones-abilities",
  "data-phone-abilities": ""
}, Q = { class: "phones-name" }, U = {
  __name: "PhoneRows",
  setup(u) {
    const h = ["Read the chat and see what needs you", "Answer questions", "Read reports, documents, plans and tasks", "Approve a plan or ask for changes", "Send the agent instructions"], { rows: d, failure: _, loaded: f, act: v, actionFailure: w, answer: i, context: R } = T("phone list", ["phone.*"]), N = B(() => d.value.filter((l) => l.state === "paired")), k = I(null);
    async function A() {
      const l = await R.read("tunnel status");
      k.value = l.ok ? l.value : null;
    }
    return A(), (l, t) => {
      var y;
      return o(), s("div", P, [
        ((y = k.value) == null ? void 0 : y.state) === "disconnected" ? (o(), s("p", q, "A phone can't reach this journal yet: " + a(k.value.reason), 1)) : p("", !0),
        r("div", F, [
          c(e(C), {
            kind: "primary",
            onClick: t[0] || (t[0] = (n) => e(v)(["phone", "pair"]))
          }, {
            default: m(() => [...t[1] || (t[1] = [
              g("Pair a phone", -1)
            ])]),
            _: 1
          }),
          e(i) ? (o(), s(x, { key: 0 }, [
            r("p", O, "Code: " + a(e(i).code), 1),
            e(i).link ? (o(), s("div", $, [
              c(e(V), {
                text: e(i).link
              }, null, 8, ["text"])
            ])) : p("", !0),
            r("p", b, "Open " + a(e(i).link) + " on the phone, or type the code on its pairing page. The code works once, for ten minutes.", 1)
          ], 64)) : p("", !0),
          e(w) ? (o(), s("p", j, a(e(w)), 1)) : p("", !0),
          r("ul", D, [
            (o(), s(x, null, S(h, (n) => r("li", { key: n }, a(n), 1)), 64))
          ])
        ]),
        c(e(E), {
          rows: N.value,
          failure: e(_),
          loaded: e(f),
          empty: "No phone is paired"
        }, {
          default: m(({ row: n }) => [
            r("span", Q, a(n.name), 1),
            c(e(C), {
              small: "",
              onClick: (z) => e(v)(["phone", "unpair", String(n.id)])
            }, {
              default: m(() => [...t[2] || (t[2] = [
                g("Unpair", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]);
    };
  }
}, J = /* @__PURE__ */ L(U, [["__scopeId", "data-v-0fdd9934"]]);
export {
  J as default
};
