/* @code-commandments-generated */
if (!document.getElementById("window-styles-9ef14c1d7c3f")) { const style = document.createElement("style"); style.id = "window-styles-9ef14c1d7c3f"; style.textContent = ".phones[data-v-72682178]{display:flex;flex-direction:column;gap:16px}.phones-pair[data-v-72682178]{display:flex;flex-direction:column;align-items:flex-start;gap:6px}.phones-code[data-v-72682178]{margin:0;font-size:18px;letter-spacing:.08em}.phones-hint[data-v-72682178],.phones-failure[data-v-72682178]{margin:0;color:var(--text-2)}.phones-abilities[data-v-72682178]{margin:0;padding-left:18px;color:var(--text-3);font-size:12.5px}.phones-name[data-v-72682178]{flex:1}\n"; document.head.appendChild(style); }
import { computed as L, ref as N, openBlock as a, createBlock as I, unref as e, withCtx as p, createElementVNode as n, createElementBlock as l, toDisplayString as r, createCommentVNode as u, createVNode as d, createTextVNode as x, Fragment as C, renderList as S } from "vue";
import { useRows as V, useListTools as E, WindowRoom as P, Btn as R, QrCode as j, ListTools as q, RowList as F, removed as O } from "@journal/window-kit";
const $ = (h, _) => {
  const c = h.__vccOpts || h;
  for (const [f, m] of _)
    c[f] = m;
  return c;
}, b = { class: "phones" }, D = {
  key: 0,
  class: "phones-failure",
  "data-phone-tunnel": ""
}, Q = { class: "phones-pair" }, U = { class: "phones-code" }, W = {
  key: 0,
  "data-phone-qr": ""
}, z = { class: "phones-hint" }, G = {
  key: 1,
  class: "phones-failure"
}, H = {
  class: "phones-abilities",
  "data-phone-abilities": ""
}, J = { class: "phones-name" }, K = {
  __name: "PhoneRows",
  setup(h) {
    const _ = ["Read the chat and see what needs you", "Answer questions", "Read reports, documents, plans and tasks", "Approve a plan or ask for changes", "Send the agent instructions"], { rows: c, failure: f, loaded: m, act: w, actionFailure: y, answer: i, context: T } = V("phone list", ["phone.*"]), A = L(() => c.value.filter((t) => t.state === "paired")), k = E(A, { title: (t) => t.name }), v = N(null);
    async function B() {
      const t = await T.read("tunnel status");
      v.value = t.ok ? t.value : null;
    }
    return B(), (t, s) => (a(), I(e(P), null, {
      default: p(() => {
        var g;
        return [
          n("div", b, [
            ((g = v.value) == null ? void 0 : g.state) === "disconnected" ? (a(), l("p", D, "A phone can't reach this journal yet: " + r(v.value.reason), 1)) : u("", !0),
            n("div", Q, [
              d(e(R), {
                kind: "primary",
                onClick: s[0] || (s[0] = (o) => e(w)(["phone", "pair"]))
              }, {
                default: p(() => [...s[1] || (s[1] = [
                  x("Pair a phone", -1)
                ])]),
                _: 1
              }),
              e(i) ? (a(), l(C, { key: 0 }, [
                n("p", U, "Code: " + r(e(i).code), 1),
                e(i).link ? (a(), l("div", W, [
                  d(e(j), {
                    text: e(i).link
                  }, null, 8, ["text"])
                ])) : u("", !0),
                n("p", z, "Open " + r(e(i).link) + " on the phone, or type the code on its pairing page. The code works once, for ten minutes.", 1)
              ], 64)) : u("", !0),
              e(y) ? (a(), l("p", G, r(e(y)), 1)) : u("", !0),
              n("ul", H, [
                (a(), l(C, null, S(_, (o) => n("li", { key: o }, r(o), 1)), 64))
              ])
            ]),
            d(e(q), { tools: e(k) }, null, 8, ["tools"]),
            d(e(F), {
              rows: e(k).shown.value,
              failure: e(f),
              loaded: e(m),
              empty: "No phone is paired",
              hint: "A phone you pair with this journal shows here.",
              searching: e(k).filtering.value
            }, {
              default: p(({ row: o }) => [
                n("span", J, r(o.name), 1),
                d(e(R), {
                  small: "",
                  onClick: (M) => e(w)(["phone", "unpair", String(o.id)], e(O)(o.id))
                }, {
                  default: p(() => [...s[2] || (s[2] = [
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
}, Z = /* @__PURE__ */ $(K, [["__scopeId", "data-v-72682178"]]);
export {
  Z as default
};
