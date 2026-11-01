/* @code-commandments-generated */
if (!document.getElementById("window-styles-496b944af43a")) { const style = document.createElement("style"); style.id = "window-styles-496b944af43a"; style.textContent = "button.title[data-v-5f8119ec]{padding:0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.suggestion[data-v-5f8119ec]{display:flex;flex:1;align-items:baseline;gap:10px;font-size:13px}.title[data-v-5f8119ec]{flex:1}.answer[data-v-5f8119ec]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as g, createElementBlock as _, Fragment as p, createVNode as c, unref as t, withCtx as f, createElementVNode as r, toDisplayString as u } from "vue";
import { useRows as w, useListTools as m, ListTools as h, RowList as k, peekRef as v } from "@journal/window-kit";
const y = (a, i) => {
  const o = a.__vccOpts || a;
  for (const [l, n] of i)
    o[l] = n;
  return o;
}, x = ["data-row"], R = ["data-suggestion-open", "onClick"], S = { class: "answer" }, C = {
  __name: "SuggestionRows",
  setup(a) {
    const { rows: i, failure: o, loaded: l } = w("suggestion list", ["suggestion.*"]), n = m(i, { title: (e) => e.title }), d = (e) => e.answer ? `Answer: ${e.answer}` : "Answer: none yet";
    return (e, L) => (g(), _(p, null, [
      c(t(h), {
        tools: t(n),
        placeholder: "Search the suggestions"
      }, null, 8, ["tools"]),
      c(t(k), {
        rows: t(n).shown.value,
        failure: t(o),
        loaded: t(l),
        empty: "No suggestions yet"
      }, {
        default: f(({ row: s }) => [
          r("div", {
            class: "suggestion",
            "data-row": s.id
          }, [
            r("button", {
              type: "button",
              class: "title",
              "data-suggestion-open": s.id,
              onClick: (N) => t(v)(`suggestions:${s.id}`)
            }, u(s.title), 9, R),
            r("span", S, u(d(s)), 1)
          ], 8, x)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ], 64));
  }
}, b = /* @__PURE__ */ y(C, [["__scopeId", "data-v-5f8119ec"]]);
export {
  b as default
};
