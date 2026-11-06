/* @code-commandments-generated */
if (!document.getElementById("window-styles-e941bcbbf01f")) { const style = document.createElement("style"); style.id = "window-styles-e941bcbbf01f"; style.textContent = "button.title[data-v-e309bd1a]{padding:0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.suggestion[data-v-e309bd1a]{display:flex;flex:1;align-items:baseline;gap:10px;font-size:13px}.title[data-v-e309bd1a]{flex:1}.answer[data-v-e309bd1a]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as _, createBlock as f, unref as e, withCtx as d, createVNode as u, createElementVNode as c, toDisplayString as g } from "vue";
import { useWindow as w, useListTools as h, WindowRoom as m, ListTools as v, RowList as y, peekRef as k } from "@journal/window-kit";
const x = (n, a) => {
  const s = n.__vccOpts || n;
  for (const [i, r] of a)
    s[i] = r;
  return s;
}, R = ["data-row"], S = ["data-suggestion-open", "onClick"], b = { class: "answer" }, C = {
  __name: "SuggestionRows",
  setup(n) {
    const a = w(), { rows: s, failure: i, loaded: r } = a.props.suggestions, l = h(s, { title: (t) => t.title }), p = (t) => t.answer ? `Answer: ${t.answer}` : "Answer: none yet";
    return (t, L) => (_(), f(e(m), null, {
      default: d(() => [
        u(e(v), { tools: e(l) }, null, 8, ["tools"]),
        u(e(y), {
          rows: e(l).shown.value,
          failure: e(i),
          loaded: e(r),
          empty: "No suggestions yet",
          hint: "Suggestions appear here for you to accept or decline.",
          searching: e(l).filtering.value
        }, {
          default: d(({ row: o }) => [
            c("div", {
              class: "suggestion",
              "data-row": o.id
            }, [
              c("button", {
                type: "button",
                class: "title",
                "data-suggestion-open": o.id,
                onClick: (N) => e(k)(`suggestions:${o.id}`)
              }, g(o.title), 9, S),
              c("span", b, g(p(o)), 1)
            ], 8, R)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "searching"])
      ]),
      _: 1
    }));
  }
}, A = /* @__PURE__ */ x(C, [["__scopeId", "data-v-e309bd1a"]]);
export {
  A as default
};
