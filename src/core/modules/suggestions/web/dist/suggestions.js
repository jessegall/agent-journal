/* @code-commandments-generated */
if (!document.getElementById("window-styles-e1d14be9024e")) { const style = document.createElement("style"); style.id = "window-styles-e1d14be9024e"; style.textContent = "button.title[data-v-c549c0ce]{padding:0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.suggestion[data-v-c549c0ce]{display:flex;flex:1;align-items:baseline;gap:10px;font-size:13px}.title[data-v-c549c0ce]{flex:1}.answer[data-v-c549c0ce]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as d, createElementBlock as _, Fragment as p, createVNode as c, unref as e, withCtx as f, createElementVNode as r, toDisplayString as u } from "vue";
import { useRows as h, useListTools as w, ListTools as m, RowList as v, peekRef as k } from "@journal/window-kit";
const y = (a, i) => {
  const n = a.__vccOpts || a;
  for (const [l, t] of i)
    n[l] = t;
  return n;
}, x = ["data-row"], R = ["data-suggestion-open", "onClick"], A = { class: "answer" }, C = {
  __name: "SuggestionRows",
  setup(a) {
    const { rows: i, failure: n, loaded: l } = h("suggestion list", ["suggestion.*"]), t = w(i, { title: (s) => s.title }), g = (s) => s.answer ? `Answer: ${s.answer}` : "Answer: none yet";
    return (s, L) => (d(), _(p, null, [
      c(e(m), { tools: e(t) }, null, 8, ["tools"]),
      c(e(v), {
        rows: e(t).shown.value,
        failure: e(n),
        loaded: e(l),
        empty: "No suggestions yet",
        hint: "A suggestion the journal makes, such as a server to install, shows here for you to accept or decline.",
        searching: e(t).filtering.value
      }, {
        default: f(({ row: o }) => [
          r("div", {
            class: "suggestion",
            "data-row": o.id
          }, [
            r("button", {
              type: "button",
              class: "title",
              "data-suggestion-open": o.id,
              onClick: (N) => e(k)(`suggestions:${o.id}`)
            }, u(o.title), 9, R),
            r("span", A, u(g(o)), 1)
          ], 8, x)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "searching"])
    ], 64));
  }
}, $ = /* @__PURE__ */ y(C, [["__scopeId", "data-v-c549c0ce"]]);
export {
  $ as default
};
