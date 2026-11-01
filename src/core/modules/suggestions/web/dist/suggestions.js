/* @code-commandments-generated */
if (!document.getElementById("window-styles-95931b8e742e")) { const style = document.createElement("style"); style.id = "window-styles-95931b8e742e"; style.textContent = ".suggestion[data-v-f4d06b4c]{display:flex;flex:1;align-items:baseline;gap:10px;font-size:13px}.title[data-v-f4d06b4c]{flex:1}.answer[data-v-f4d06b4c]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as _, createElementBlock as g, Fragment as p, createVNode as i, unref as t, withCtx as w, createElementVNode as c, toDisplayString as u } from "vue";
import { useRows as f, useListTools as m, ListTools as h, RowList as v } from "@journal/window-kit";
const x = (n, a) => {
  const e = n.__vccOpts || n;
  for (const [l, o] of a)
    e[l] = o;
  return e;
}, y = ["data-row"], R = { class: "title" }, S = { class: "answer" }, k = {
  __name: "SuggestionRows",
  setup(n) {
    const { rows: a, failure: e, loaded: l } = f("suggestion list", ["suggestion.*"]), o = m(a, { title: (s) => s.title }), d = (s) => s.answer ? `Answer: ${s.answer}` : "Answer: none yet";
    return (s, L) => (_(), g(p, null, [
      i(t(h), {
        tools: t(o),
        placeholder: "Search the suggestions"
      }, null, 8, ["tools"]),
      i(t(v), {
        rows: t(o).shown.value,
        failure: t(e),
        loaded: t(l),
        empty: "No suggestions yet"
      }, {
        default: w(({ row: r }) => [
          c("div", {
            class: "suggestion",
            "data-row": r.id
          }, [
            c("span", R, u(r.title), 1),
            c("span", S, u(d(r)), 1)
          ], 8, y)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ], 64));
  }
}, A = /* @__PURE__ */ x(k, [["__scopeId", "data-v-f4d06b4c"]]);
export {
  A as default
};
