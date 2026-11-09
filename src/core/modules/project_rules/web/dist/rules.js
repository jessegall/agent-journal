if (!document.getElementById("window-styles-12cedbc03e9f")) { const style = document.createElement("style"); style.id = "window-styles-12cedbc03e9f"; style.textContent = ".rules-page[data-v-741afd9c]{display:flex;flex-direction:column;gap:8px}.rules-refusal[data-v-741afd9c]{margin:0;color:var(--danger);font-size:12.5px}.rule[data-v-741afd9c]{display:flex;flex:1;flex-wrap:wrap;gap:8px;align-items:center;min-width:0;padding:4px 0}.rule-text[data-v-741afd9c]{flex:1 1 240px;min-width:0}.rule-state[data-v-741afd9c]{color:var(--warn);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as B, ref as D, openBlock as s, createBlock as y, unref as o, withCtx as r, createElementVNode as n, createElementBlock as R, toDisplayString as g, createCommentVNode as O, createVNode as m, Fragment as P, createTextVNode as v } from "vue";
import { useWindow as V, WindowRoom as T, RowList as $, Btn as _ } from "@journal/window-kit";
const b = (d, u) => {
  const a = d.__vccOpts || d;
  for (const [i, c] of u)
    a[i] = c;
  return a;
}, A = { class: "rules-page" }, W = {
  key: 0,
  class: "rules-refusal",
  role: "alert",
  "data-rule-refusal": ""
}, h = ["data-rule", "data-rule-state"], F = { class: "rule-text" }, x = "proposed", I = {
  __name: "RulesPage",
  setup(d) {
    const u = [x, "active"], a = V(), { rows: i, failure: c, loaded: C, more: E, load: N, older: S } = a.props.rules, w = B(() => u.flatMap((l) => i.value.filter((e) => e.state === l))), p = D("");
    async function f(l, e) {
      const t = await a.run(["rule", l, String(e.id)]);
      p.value = t.ok ? "" : t.error, t.ok && N();
    }
    return (l, e) => (s(), y(o(T), null, {
      default: r(() => [
        n("div", A, [
          p.value ? (s(), R("p", W, g(p.value), 1)) : O("", !0),
          m(o($), {
            rows: w.value,
            failure: o(c),
            loaded: o(C),
            more: o(E),
            older: o(S),
            empty: "No rules yet",
            hint: "Rules you add or approve hold for every agent."
          }, {
            default: r(({ row: t }) => [
              n("div", {
                class: "rule",
                "data-rule": t.id,
                "data-rule-state": t.state
              }, [
                n("span", F, g(t.text), 1),
                t.state === x ? (s(), R(P, { key: 0 }, [
                  e[2] || (e[2] = n("span", { class: "rule-state" }, "State: proposed", -1)),
                  m(o(_), {
                    small: "",
                    variant: "primary",
                    onClick: (k) => f("approve", t)
                  }, {
                    default: r(() => [...e[0] || (e[0] = [
                      v("Approve", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"]),
                  m(o(_), {
                    small: "",
                    bordered: "",
                    onClick: (k) => f("deny", t)
                  }, {
                    default: r(() => [...e[1] || (e[1] = [
                      v("Deny", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"])
                ], 64)) : (s(), y(o(_), {
                  key: 1,
                  small: "",
                  bordered: "",
                  onClick: (k) => f("remove", t)
                }, {
                  default: r(() => [...e[3] || (e[3] = [
                    v("Remove", -1)
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
}, j = /* @__PURE__ */ b(I, [["__scopeId", "data-v-741afd9c"]]);
export {
  j as default
};
