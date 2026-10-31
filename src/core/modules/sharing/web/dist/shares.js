/* @code-commandments-generated */
if (!document.getElementById("window-styles-22722c81a2ec")) { const style = document.createElement("style"); style.id = "window-styles-22722c81a2ec"; style.textContent = ".shares[data-v-585d1252]{display:flex;flex-direction:column;gap:12px}.shares-make[data-v-585d1252]{display:flex;gap:8px}.shares-target[data-v-585d1252]{flex:1;min-width:0}.shares-link[data-v-585d1252]{margin:0;overflow-wrap:anywhere}.shares-hint[data-v-585d1252],.shares-failure[data-v-585d1252]{margin:0;color:var(--text-2)}.shares-name[data-v-585d1252]{flex:1}\n"; document.head.appendChild(style); }
import { computed as V, ref as m, openBlock as _, createElementBlock as h, createElementVNode as o, withModifiers as C, withDirectives as b, vModelText as B, createVNode as k, unref as r, withCtx as f, createTextVNode as y, Fragment as M, toDisplayString as s, createCommentVNode as x } from "vue";
import { useRows as T, Btn as g, RowList as D } from "@journal/window-kit";
const E = (c, d) => {
  const l = c.__vccOpts || c;
  for (const [p, n] of d)
    l[p] = n;
  return l;
}, F = { class: "shares" }, A = { class: "shares-link" }, I = { class: "shares-hint" }, L = {
  key: 1,
  class: "shares-failure"
}, O = { class: "shares-name" }, U = {
  __name: "ShareRows",
  setup(c) {
    const { rows: d, failure: l, loaded: p, load: n, context: w } = T("share list", []), N = V(() => d.value.filter((e) => e.state === "active")), v = m(""), i = m(null), u = m("");
    async function R() {
      const e = await w.run(["share", "make", v.value.trim()]);
      u.value = e.ok ? "" : e.error, i.value = e.ok ? e.value : null, n();
    }
    async function S(e) {
      const t = await w.run(["share", "revoke", String(e.id)]);
      u.value = t.ok ? "" : t.error, n();
    }
    return (e, t) => (_(), h("div", F, [
      o("form", {
        class: "shares-make",
        onSubmit: C(R, ["prevent"])
      }, [
        b(o("input", {
          "onUpdate:modelValue": t[0] || (t[0] = (a) => v.value = a),
          class: "shares-target",
          placeholder: "plans:2",
          "aria-label": "What to share"
        }, null, 512), [
          [B, v.value]
        ]),
        k(r(g), {
          kind: "primary",
          type: "submit"
        }, {
          default: f(() => [...t[1] || (t[1] = [
            y("Make a link", -1)
          ])]),
          _: 1
        })
      ], 32),
      i.value ? (_(), h(M, { key: 0 }, [
        o("p", A, s(i.value.link), 1),
        o("p", I, "This link is shown once. Anyone who has it can read the plan until " + s(i.value.expires_at) + ".", 1)
      ], 64)) : x("", !0),
      u.value ? (_(), h("p", L, s(u.value), 1)) : x("", !0),
      k(r(D), {
        rows: N.value,
        failure: r(l),
        loaded: r(p),
        empty: "No link is open"
      }, {
        default: f(({ row: a }) => [
          o("span", O, s(a.row_model) + " " + s(a.row_id) + ", ends " + s(a.expires_at), 1),
          k(r(g), {
            small: "",
            onClick: (W) => S(a)
          }, {
            default: f(() => [...t[2] || (t[2] = [
              y("Revoke", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ]));
  }
}, q = /* @__PURE__ */ E(U, [["__scopeId", "data-v-585d1252"]]);
export {
  q as default
};
