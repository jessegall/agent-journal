/* @code-commandments-generated */
if (!document.getElementById("window-styles-c36e75d83981")) { const style = document.createElement("style"); style.id = "window-styles-c36e75d83981"; style.textContent = ".phones[data-v-63f855f0]{display:flex;flex-direction:column;gap:16px}.phones-pair[data-v-63f855f0]{display:flex;flex-direction:column;align-items:flex-start;gap:6px}.phones-code[data-v-63f855f0]{margin:0;font-size:18px;letter-spacing:.08em}.phones-hint[data-v-63f855f0],.phones-failure[data-v-63f855f0]{margin:0;color:var(--text-2)}.phones-name[data-v-63f855f0]{flex:1}\n"; document.head.appendChild(style); }
import { computed as R, ref as k, openBlock as d, createElementBlock as _, createElementVNode as r, createVNode as f, unref as t, withCtx as h, createTextVNode as w, Fragment as V, toDisplayString as i, createCommentVNode as y } from "vue";
import { useRows as B, Btn as g, RowList as P } from "@journal/window-kit";
const E = (l, p) => {
  const n = l.__vccOpts || l;
  for (const [c, u] of p)
    n[c] = u;
  return n;
}, F = { class: "phones" }, O = { class: "phones-pair" }, S = { class: "phones-code" }, T = { class: "phones-hint" }, D = {
  key: 1,
  class: "phones-failure"
}, I = { class: "phones-name" }, L = {
  __name: "PhoneRows",
  setup(l) {
    const { rows: p, failure: n, loaded: c, load: u, context: m } = B("phone list", ["phone.*"]), x = R(() => p.value.filter((e) => e.state === "paired")), s = k(null), a = k("");
    async function C() {
      const e = await m.run(["phone", "pair"]);
      a.value = e.ok ? "" : e.error, s.value = e.ok ? e.value : null;
    }
    async function N(e) {
      const o = await m.run(["phone", "unpair", String(e.id)]);
      a.value = o.ok ? "" : o.error, u();
    }
    return (e, o) => (d(), _("div", F, [
      r("div", O, [
        f(t(g), {
          kind: "primary",
          onClick: C
        }, {
          default: h(() => [...o[0] || (o[0] = [
            w("Pair a phone", -1)
          ])]),
          _: 1
        }),
        s.value ? (d(), _(V, { key: 0 }, [
          r("p", S, "Code: " + i(s.value.code), 1),
          r("p", T, "Open " + i(s.value.link) + " on the phone, or type the code on its pairing page. The code works once, for ten minutes.", 1)
        ], 64)) : y("", !0),
        a.value ? (d(), _("p", D, i(a.value), 1)) : y("", !0)
      ]),
      f(t(P), {
        rows: x.value,
        failure: t(n),
        loaded: t(c),
        empty: "No phone is paired"
      }, {
        default: h(({ row: v }) => [
          r("span", I, i(v.name), 1),
          f(t(g), {
            small: "",
            onClick: (U) => N(v)
          }, {
            default: h(() => [...o[1] || (o[1] = [
              w("Unpair", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ]));
  }
}, j = /* @__PURE__ */ E(L, [["__scopeId", "data-v-63f855f0"]]);
export {
  j as default
};
