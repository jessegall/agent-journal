/* @code-commandments-generated */
if (!document.getElementById("window-styles-865c90cabfe5")) { const style = document.createElement("style"); style.id = "window-styles-865c90cabfe5"; style.textContent = "button.title[data-v-e75669eb]{padding:0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.suggestion[data-v-e75669eb]{display:flex;flex:1;align-items:baseline;gap:10px;font-size:13px}.title[data-v-e75669eb]{flex:1}.answer[data-v-e75669eb]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as _, createBlock as p, unref as e, withCtx as c, createVNode as u, createElementVNode as r, toDisplayString as d } from "vue";
import { useRows as f, useListTools as w, WindowRoom as h, ListTools as m, RowList as v, peekRef as y } from "@journal/window-kit";
const k = (a, i) => {
  const n = a.__vccOpts || a;
  for (const [l, t] of i)
    n[l] = t;
  return n;
}, R = ["data-row"], x = ["data-suggestion-open", "onClick"], S = { class: "answer" }, b = {
  __name: "SuggestionRows",
  setup(a) {
    const { rows: i, failure: n, loaded: l } = f("suggestion list", ["suggestion.*"]), t = w(i, { title: (s) => s.title }), g = (s) => s.answer ? `Answer: ${s.answer}` : "Answer: none yet";
    return (s, C) => (_(), p(e(h), null, {
      default: c(() => [
        u(e(m), { tools: e(t) }, null, 8, ["tools"]),
        u(e(v), {
          rows: e(t).shown.value,
          failure: e(n),
          loaded: e(l),
          empty: "No suggestions yet",
          hint: "Suggestions appear here for you to accept or decline.",
          searching: e(t).filtering.value
        }, {
          default: c(({ row: o }) => [
            r("div", {
              class: "suggestion",
              "data-row": o.id
            }, [
              r("button", {
                type: "button",
                class: "title",
                "data-suggestion-open": o.id,
                onClick: (L) => e(y)(`suggestions:${o.id}`)
              }, d(o.title), 9, x),
              r("span", S, d(g(o)), 1)
            ], 8, R)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "searching"])
      ]),
      _: 1
    }));
  }
}, $ = /* @__PURE__ */ k(b, [["__scopeId", "data-v-e75669eb"]]);
export {
  $ as default
};
