/* @code-commandments-generated */
if (!document.getElementById("window-styles-676f47d9f109")) { const style = document.createElement("style"); style.id = "window-styles-676f47d9f109"; style.textContent = ".shares[data-v-974d094c]{display:flex;flex-direction:column;gap:12px}.shares-make[data-v-974d094c]{display:flex;gap:8px}.shares-target[data-v-974d094c]{flex:1;min-width:0}.shares-link[data-v-974d094c]{margin:0;overflow-wrap:anywhere}.shares-hint[data-v-974d094c],.shares-failure[data-v-974d094c]{margin:0;color:var(--text-2)}.shares-name[data-v-974d094c]{flex:1}\n"; document.head.appendChild(style); }
import { computed as S, ref as N, openBlock as m, createElementBlock as _, createElementVNode as r, withModifiers as R, unref as e, withDirectives as T, vModelText as V, createVNode as i, withCtx as k, createTextVNode as w, Fragment as C, toDisplayString as o, createCommentVNode as x } from "vue";
import { useRows as $, useListTools as b, Btn as y, ListTools as B, RowList as L } from "@journal/window-kit";
const M = (d, c) => {
  const l = d.__vccOpts || d;
  for (const [u, n] of c)
    l[u] = n;
  return l;
}, D = { class: "shares" }, E = { class: "shares-link" }, F = { class: "shares-hint" }, A = {
  key: 1,
  class: "shares-failure"
}, I = { class: "shares-name" }, O = {
  __name: "ShareRows",
  setup(d) {
    const { rows: c, failure: l, loaded: u, act: n, actionFailure: f, answer: p } = $("share list", []), g = S(() => c.value.filter((a) => a.state === "active")), h = N(""), v = b(g, { title: (a) => `${a.row_model} ${a.row_id}` });
    return (a, t) => (m(), _("div", D, [
      r("form", {
        class: "shares-make",
        onSubmit: t[1] || (t[1] = R((s) => e(n)(["share", "make", h.value.trim()]), ["prevent"]))
      }, [
        T(r("input", {
          "onUpdate:modelValue": t[0] || (t[0] = (s) => h.value = s),
          class: "shares-target",
          placeholder: "plans:2",
          "aria-label": "What to share"
        }, null, 512), [
          [V, h.value]
        ]),
        i(e(y), {
          kind: "primary",
          type: "submit"
        }, {
          default: k(() => [...t[2] || (t[2] = [
            w("Make a link", -1)
          ])]),
          _: 1
        })
      ], 32),
      e(p) ? (m(), _(C, { key: 0 }, [
        r("p", E, o(e(p).link), 1),
        r("p", F, "This link is shown once. Anyone who has it can read the plan until " + o(e(p).expires_at) + ".", 1)
      ], 64)) : x("", !0),
      e(f) ? (m(), _("p", A, o(e(f)), 1)) : x("", !0),
      i(e(B), {
        tools: e(v),
        placeholder: "Search the links"
      }, null, 8, ["tools"]),
      i(e(L), {
        rows: e(v).shown.value,
        failure: e(l),
        loaded: e(u),
        empty: "No link is open"
      }, {
        default: k(({ row: s }) => [
          r("span", I, o(s.row_model) + " " + o(s.row_id) + ", ends " + o(s.expires_at), 1),
          i(e(y), {
            small: "",
            onClick: (U) => e(n)(["share", "revoke", String(s.id)])
          }, {
            default: k(() => [...t[3] || (t[3] = [
              w("Revoke", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ]));
  }
}, q = /* @__PURE__ */ M(O, [["__scopeId", "data-v-974d094c"]]);
export {
  q as default
};
