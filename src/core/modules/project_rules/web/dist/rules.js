/* @code-commandments-generated */
if (!document.getElementById("window-styles-62d557693f23")) { const style = document.createElement("style"); style.id = "window-styles-62d557693f23"; style.textContent = ".rule-dock[data-v-b89aea04]{margin:0;padding:8px 10px;border:1px solid var(--warn);border-radius:8px;background:color-mix(in srgb,var(--warn) 12%,transparent);color:var(--text);font-size:13px;line-height:1.5}.rules-page[data-v-4868a35b]{display:flex;flex-direction:column;gap:8px}.rules-refusal[data-v-4868a35b]{margin:0;color:var(--danger);font-size:12.5px}.rule[data-v-4868a35b]{display:flex;flex:1;flex-wrap:wrap;gap:8px;align-items:center;min-width:0;padding:4px 0}.rule-text[data-v-4868a35b]{flex:1 1 240px;min-width:0}.rule-state[data-v-4868a35b]{color:var(--warn);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as S, ref as B, openBlock as r, createBlock as m, unref as o, withCtx as a, createElementVNode as s, createElementBlock as f, toDisplayString as v, createCommentVNode as D, createVNode as u, Fragment as P, createTextVNode as i } from "vue";
import { useWindow as V, useRows as b, WindowRoom as O, RowList as T, Btn as c } from "@journal/window-kit";
import { _ as $ } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const A = { class: "rules-page" }, W = {
  key: 0,
  class: "rules-refusal",
  role: "alert",
  "data-rule-refusal": ""
}, h = ["data-rule", "data-rule-state"], F = { class: "rule-text" }, _ = "proposed", I = {
  __name: "RulesPage",
  setup(L) {
    const k = [_, "active"], y = V(), { rows: R, failure: x, loaded: C, more: g, load: w, older: E } = b("rule list", ["rule.*"], { incremental: !0 }), N = S(() => k.flatMap((l) => R.value.filter((e) => e.state === l))), n = B("");
    async function d(l, e) {
      const t = await y.run(["rule", l, String(e.id)]);
      n.value = t.ok ? "" : t.error, t.ok && w();
    }
    return (l, e) => (r(), m(o(O), null, {
      default: a(() => [
        s("div", A, [
          n.value ? (r(), f("p", W, v(n.value), 1)) : D("", !0),
          u(o(T), {
            rows: N.value,
            failure: o(x),
            loaded: o(C),
            more: o(g),
            older: o(E),
            empty: "No rules yet",
            hint: "Rules you add or approve hold for every agent."
          }, {
            default: a(({ row: t }) => [
              s("div", {
                class: "rule",
                "data-rule": t.id,
                "data-rule-state": t.state
              }, [
                s("span", F, v(t.text), 1),
                t.state === _ ? (r(), f(P, { key: 0 }, [
                  e[2] || (e[2] = s("span", { class: "rule-state" }, "State: proposed", -1)),
                  u(o(c), {
                    small: "",
                    kind: "primary",
                    onClick: (p) => d("approve", t)
                  }, {
                    default: a(() => [...e[0] || (e[0] = [
                      i("Approve", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"]),
                  u(o(c), {
                    small: "",
                    bordered: "",
                    onClick: (p) => d("deny", t)
                  }, {
                    default: a(() => [...e[1] || (e[1] = [
                      i("Deny", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"])
                ], 64)) : (r(), m(o(c), {
                  key: 1,
                  small: "",
                  bordered: "",
                  onClick: (p) => d("remove", t)
                }, {
                  default: a(() => [...e[3] || (e[3] = [
                    i("Remove", -1)
                  ])]),
                  _: 1
                }, 8, ["onClick"]))
              ], 8, h)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded", "more", "older"])
        ])
      ]),
      _: 1
    }));
  }
}, z = /* @__PURE__ */ $(I, [["__scopeId", "data-v-4868a35b"]]);
export {
  z as default
};
