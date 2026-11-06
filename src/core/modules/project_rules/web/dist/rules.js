/* @code-commandments-generated */
if (!document.getElementById("window-styles-5aa5d5d6d2bc")) { const style = document.createElement("style"); style.id = "window-styles-5aa5d5d6d2bc"; style.textContent = ".rule-dock[data-v-5c184a03]{margin:3px 0 6px;border-block:1px solid var(--border-inner);padding:7px 14px 8px 36px;color:var(--text);font-size:13px;line-height:1.5}.rules-page[data-v-741afd9c]{display:flex;flex-direction:column;gap:8px}.rules-refusal[data-v-741afd9c]{margin:0;color:var(--danger);font-size:12.5px}.rule[data-v-741afd9c]{display:flex;flex:1;flex-wrap:wrap;gap:8px;align-items:center;min-width:0;padding:4px 0}.rule-text[data-v-741afd9c]{flex:1 1 240px;min-width:0}.rule-state[data-v-741afd9c]{color:var(--warn);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as w, ref as B, openBlock as l, createBlock as f, unref as o, withCtx as a, createElementVNode as s, createElementBlock as v, toDisplayString as _, createCommentVNode as D, createVNode as u, Fragment as P, createTextVNode as i } from "vue";
import { useWindow as V, WindowRoom as O, RowList as T, Btn as p } from "@journal/window-kit";
import { _ as $ } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const b = { class: "rules-page" }, A = {
  key: 0,
  class: "rules-refusal",
  role: "alert",
  "data-rule-refusal": ""
}, W = ["data-rule", "data-rule-state"], h = { class: "rule-text" }, k = "proposed", F = {
  __name: "RulesPage",
  setup(I) {
    const y = [k, "active"], c = V(), { rows: R, failure: x, loaded: C, more: g, load: E, older: N } = c.props.rules, S = w(() => y.flatMap((r) => R.value.filter((e) => e.state === r))), n = B("");
    async function d(r, e) {
      const t = await c.run(["rule", r, String(e.id)]);
      n.value = t.ok ? "" : t.error, t.ok && E();
    }
    return (r, e) => (l(), f(o(O), null, {
      default: a(() => [
        s("div", b, [
          n.value ? (l(), v("p", A, _(n.value), 1)) : D("", !0),
          u(o(T), {
            rows: S.value,
            failure: o(x),
            loaded: o(C),
            more: o(g),
            older: o(N),
            empty: "No rules yet",
            hint: "Rules you add or approve hold for every agent."
          }, {
            default: a(({ row: t }) => [
              s("div", {
                class: "rule",
                "data-rule": t.id,
                "data-rule-state": t.state
              }, [
                s("span", h, _(t.text), 1),
                t.state === k ? (l(), v(P, { key: 0 }, [
                  e[2] || (e[2] = s("span", { class: "rule-state" }, "State: proposed", -1)),
                  u(o(p), {
                    small: "",
                    variant: "primary",
                    onClick: (m) => d("approve", t)
                  }, {
                    default: a(() => [...e[0] || (e[0] = [
                      i("Approve", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"]),
                  u(o(p), {
                    small: "",
                    bordered: "",
                    onClick: (m) => d("deny", t)
                  }, {
                    default: a(() => [...e[1] || (e[1] = [
                      i("Deny", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"])
                ], 64)) : (l(), f(o(p), {
                  key: 1,
                  small: "",
                  bordered: "",
                  onClick: (m) => d("remove", t)
                }, {
                  default: a(() => [...e[3] || (e[3] = [
                    i("Remove", -1)
                  ])]),
                  _: 1
                }, 8, ["onClick"]))
              ], 8, W)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded", "more", "older"])
        ])
      ]),
      _: 1
    }));
  }
}, q = /* @__PURE__ */ $(F, [["__scopeId", "data-v-741afd9c"]]);
export {
  q as default
};
