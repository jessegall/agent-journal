/* @code-commandments-generated */
if (!document.getElementById("window-styles-945754acbb99")) { const style = document.createElement("style"); style.id = "window-styles-945754acbb99"; style.textContent = ".heading[data-v-920dbaa9]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.row[data-v-920dbaa9]{display:grid;grid-template-columns:1fr auto;gap:2px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.row small[data-v-920dbaa9]{grid-column:1;color:var(--text-3);font-size:10.5px}.row button[data-v-920dbaa9]{grid-column:2;grid-row:1 / span 2}.none[data-v-920dbaa9]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as f, ref as y, openBlock as t, createBlock as x, unref as d, withCtx as v, createElementVNode as m, createElementBlock as a, toDisplayString as c, createCommentVNode as g, Fragment as w, renderList as h, createVNode as C, createTextVNode as N } from "vue";
import { useWindow as S, WindowRoom as A, Btn as B } from "@journal/window-kit";
const V = (p, n) => {
  const o = p.__vccOpts || p;
  for (const [s, r] of n)
    o[s] = r;
  return o;
}, q = {
  key: 0,
  class: "none"
}, E = {
  key: 1,
  class: "none",
  "data-standing-empty": ""
}, F = {
  key: 2,
  class: "none",
  "data-standing-failure": ""
}, P = {
  __name: "StandingApprovalsPanel",
  setup(p) {
    const n = S(), { rows: o, failure: s } = n.props.standing, r = f(() => o.value ?? []), u = y("");
    async function _(l) {
      const e = await n.run(["standing-approval", "delete", String(l.id)]);
      u.value = e.ok ? "" : e.error, e.ok && await n.reload("standing");
    }
    const k = (l) => l.scope === "same" ? "the same request" : "any request like it";
    return (l, e) => (t(), x(d(A), { padding: "14px 16px" }, {
      default: v(() => [
        e[1] || (e[1] = m("p", { class: "heading" }, "Standing yeses", -1)),
        d(s) ? (t(), a("p", q, c(d(s)), 1)) : r.value.length ? g("", !0) : (t(), a("p", E, "No standing yes is kept. Choose Accept and always on an approval to keep one.")),
        (t(!0), a(w, null, h(r.value, (i) => (t(), a("div", {
          key: i.id,
          class: "row",
          "data-standing-yes": ""
        }, [
          m("span", null, c(i.text), 1),
          m("small", null, "Accepts " + c(k(i)), 1),
          C(d(B), {
            small: "",
            onClick: (R) => _(i)
          }, {
            default: v(() => [...e[0] || (e[0] = [
              N("Remove", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ]))), 128)),
        u.value ? (t(), a("p", F, c(u.value), 1)) : g("", !0)
      ]),
      _: 1
    }));
  }
}, D = /* @__PURE__ */ V(P, [["__scopeId", "data-v-920dbaa9"]]);
export {
  D as default
};
