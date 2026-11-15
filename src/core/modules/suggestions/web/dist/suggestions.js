if (!document.getElementById("window-styles-a3b010e4efee")) { const style = document.createElement("style"); style.id = "window-styles-a3b010e4efee"; style.textContent = "button.title[data-v-a4362d67]{padding:0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.suggestion[data-v-a4362d67]{display:flex;flex:1;align-items:baseline;gap:10px;font-size:13px}.title[data-v-a4362d67]{flex:1}.answer[data-v-a4362d67]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as _, createBlock as f, unref as e, withCtx as u, createVNode as d, createElementVNode as c, toDisplayString as g } from "vue";
import { useWindow as w, useListTools as h, WindowRoom as m, ListTools as v, RowList as y, peekRef as k } from "@journal/window-kit";
const x = (n, a) => {
  const s = n.__vccOpts || n;
  for (const [i, r] of a)
    s[i] = r;
  return s;
}, R = ["data-row"], S = ["data-suggestion-open", "onClick"], C = { class: "answer" }, L = {
  __name: "SuggestionRows",
  setup(n) {
    const a = w(), { rows: s, failure: i, loaded: r } = a.props.suggestions, l = h(s, { title: (t) => t.title }), p = (t) => t.answer ? `Answer: ${t.answer}` : "Answer: none yet";
    return (t, N) => (_(), f(e(m), null, {
      default: u(() => [
        d(e(v), { tools: e(l) }, null, 8, ["tools"]),
        d(e(y), {
          rows: e(l).shown.value,
          failure: e(i),
          loaded: e(r),
          empty: "No suggestions yet",
          hint: "Suggestions appear here for you to accept or decline.",
          searching: e(l).filtering.value
        }, {
          default: u(({ row: o }) => [
            c("div", {
              class: "suggestion",
              "data-row": o.id
            }, [
              c("button", {
                type: "button",
                class: "title",
                "data-suggestion-open": o.id,
                onClick: (T) => e(k)(`suggestions:${o.id}`)
              }, g(o.title), 9, S),
              c("span", C, g(p(o)), 1)
            ], 8, R)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "searching"])
      ]),
      _: 1
    }));
  }
}, A = /* @__PURE__ */ x(L, [["__scopeId", "data-v-a4362d67"]]);
export {
  A as default
};
