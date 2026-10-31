/* @code-commandments-generated */
if (!document.getElementById("window-styles-b684d6d8472e")) { const style = document.createElement("style"); style.id = "window-styles-b684d6d8472e"; style.textContent = ".shares[data-v-e1ce7233]{display:flex;flex-direction:column;gap:12px}.shares-make[data-v-e1ce7233]{display:flex;gap:8px}.shares-target[data-v-e1ce7233]{flex:1;min-width:0}.shares-link[data-v-e1ce7233]{margin:0;overflow-wrap:anywhere}.shares-hint[data-v-e1ce7233],.shares-failure[data-v-e1ce7233]{margin:0;color:var(--text-2)}.shares-name[data-v-e1ce7233]{flex:1}\n"; document.head.appendChild(style); }
import { computed as g, ref as N, openBlock as p, createElementBlock as m, createElementVNode as o, withModifiers as R, unref as e, withDirectives as S, vModelText as V, createVNode as _, withCtx as h, createTextVNode as v, Fragment as C, toDisplayString as a, createCommentVNode as w } from "vue";
import { useRows as b, Btn as x, RowList as B } from "@journal/window-kit";
const M = (i, l) => {
  const r = i.__vccOpts || i;
  for (const [d, n] of l)
    r[d] = n;
  return r;
}, T = { class: "shares" }, D = { class: "shares-link" }, E = { class: "shares-hint" }, F = {
  key: 1,
  class: "shares-failure"
}, $ = { class: "shares-name" }, A = {
  __name: "ShareRows",
  setup(i) {
    const { rows: l, failure: r, loaded: d, act: n, actionFailure: f, answer: c } = b("share list", []), y = g(() => l.value.filter((k) => k.state === "active")), u = N("");
    return (k, t) => (p(), m("div", T, [
      o("form", {
        class: "shares-make",
        onSubmit: t[1] || (t[1] = R((s) => e(n)(["share", "make", u.value.trim()]), ["prevent"]))
      }, [
        S(o("input", {
          "onUpdate:modelValue": t[0] || (t[0] = (s) => u.value = s),
          class: "shares-target",
          placeholder: "plans:2",
          "aria-label": "What to share"
        }, null, 512), [
          [V, u.value]
        ]),
        _(e(x), {
          kind: "primary",
          type: "submit"
        }, {
          default: h(() => [...t[2] || (t[2] = [
            v("Make a link", -1)
          ])]),
          _: 1
        })
      ], 32),
      e(c) ? (p(), m(C, { key: 0 }, [
        o("p", D, a(e(c).link), 1),
        o("p", E, "This link is shown once. Anyone who has it can read the plan until " + a(e(c).expires_at) + ".", 1)
      ], 64)) : w("", !0),
      e(f) ? (p(), m("p", F, a(e(f)), 1)) : w("", !0),
      _(e(B), {
        rows: y.value,
        failure: e(r),
        loaded: e(d),
        empty: "No link is open"
      }, {
        default: h(({ row: s }) => [
          o("span", $, a(s.row_model) + " " + a(s.row_id) + ", ends " + a(s.expires_at), 1),
          _(e(x), {
            small: "",
            onClick: (I) => e(n)(["share", "revoke", String(s.id)])
          }, {
            default: h(() => [...t[3] || (t[3] = [
              v("Revoke", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ]));
  }
}, U = /* @__PURE__ */ M(A, [["__scopeId", "data-v-e1ce7233"]]);
export {
  U as default
};
