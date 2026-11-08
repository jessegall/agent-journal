/* @code-commandments-generated */
if (!document.getElementById("window-styles-be200a937ca6")) { const style = document.createElement("style"); style.id = "window-styles-be200a937ca6"; style.textContent = ".phones[data-v-d2849f80]{display:flex;flex-direction:column;gap:16px}.phones-pair[data-v-d2849f80]{display:flex;flex-direction:column;align-items:flex-start;gap:6px}.phones-code[data-v-d2849f80]{margin:0;font-size:18px;letter-spacing:.08em}.phones-hint[data-v-d2849f80],.phones-failure[data-v-d2849f80]{margin:0;color:var(--text-2)}.phones-abilities[data-v-d2849f80]{margin:0;padding-left:18px;color:var(--text-3);font-size:12.5px}.phones-name[data-v-d2849f80]{flex:1}\n"; document.head.appendChild(style); }
import { computed as N, openBlock as s, createBlock as T, unref as e, withCtx as c, createElementVNode as o, createElementBlock as l, toDisplayString as a, createCommentVNode as h, createVNode as d, createTextVNode as x, Fragment as C, renderList as A } from "vue";
import { useWindow as I, useListTools as P, WindowRoom as S, Btn as R, QrCode as V, ListTools as E, RowList as q, removed as F } from "@journal/window-kit";
const O = (u, _) => {
  const r = u.__vccOpts || u;
  for (const [m, f] of _)
    r[m] = f;
  return r;
}, W = { class: "phones" }, $ = {
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
    const _ = ["Read the chat and see what needs you", "Answer questions", "Read reports, documents, plans and tasks", "Approve a plan or ask for changes", "Send the agent instructions"], r = I(), { rows: m, failure: f, loaded: B, act: v, actionFailure: w, answer: i } = r.props.phones, { data: g } = r.props.tunnel, L = N(() => m.value.filter((p) => p.state === "paired")), k = P(L, { title: (p) => p.name });
    return (p, n) => (s(), T(e(S), null, {
      default: c(() => {
        var y;
        return [
          o("div", W, [
            ((y = e(g)) == null ? void 0 : y.state) === "disconnected" ? (s(), l("p", $, "A phone can't reach this journal yet: " + a(e(g).reason), 1)) : h("", !0),
            o("div", b, [
              d(e(R), {
                variant: "primary",
                onClick: n[0] || (n[0] = (t) => e(v)(["phone", "pair"]))
              }, {
                default: c(() => [...n[1] || (n[1] = [
                  x("Pair a phone", -1)
                ])]),
                _: 1
              }),
              e(i) ? (s(), l(C, { key: 0 }, [
                o("p", j, "Code: " + a(e(i).code), 1),
                e(i).link ? (s(), l("div", D, [
                  d(e(V), {
                    text: e(i).link
                  }, null, 8, ["text"])
                ])) : h("", !0),
                o("p", Q, "Open " + a(e(i).link) + " on the phone, or type the code on its pairing page. The code works once, for ten minutes.", 1)
              ], 64)) : h("", !0),
              e(w) ? (s(), l("p", U, a(e(w)), 1)) : h("", !0),
              o("ul", z, [
                (s(), l(C, null, A(_, (t) => o("li", { key: t }, a(t), 1)), 64))
              ])
            ]),
            d(e(E), { tools: e(k) }, null, 8, ["tools"]),
            d(e(q), {
              rows: e(k).shown.value,
              failure: e(f),
              loaded: e(B),
              empty: "No phone is paired",
              hint: "Paired phones appear here.",
              searching: e(k).filtering.value
            }, {
              default: c(({ row: t }) => [
                o("span", G, a(t.name), 1),
                d(e(R), {
                  small: "",
                  onClick: (J) => e(v)(["phone", "unpair", String(t.id)], e(F)(t.id))
                }, {
                  default: c(() => [...n[2] || (n[2] = [
                    x("Unpair", -1)
                  ])]),
                  _: 1
                }, 8, ["onClick"])
              ]),
              _: 1
            }, 8, ["rows", "failure", "loaded", "searching"])
          ])
        ];
      }),
      _: 1
    }));
  }
}, X = /* @__PURE__ */ O(H, [["__scopeId", "data-v-d2849f80"]]);
export {
  X as default
};
