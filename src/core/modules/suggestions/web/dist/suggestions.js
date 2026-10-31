/* @code-commandments-generated */
if (!document.getElementById("window-styles-90a5605103c7")) { const style = document.createElement("style"); style.id = "window-styles-90a5605103c7"; style.textContent = ".suggestion[data-v-6c641fb2]{display:flex;flex:1;align-items:baseline;gap:10px;font-size:13px}.title[data-v-6c641fb2]{flex:1}.answer[data-v-6c641fb2]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as l, createBlock as d, unref as t, withCtx as u, createElementVNode as i, toDisplayString as _ } from "vue";
import { useRows as g, RowList as p } from "@journal/window-kit";
const w = (e, o) => {
  const s = e.__vccOpts || e;
  for (const [n, a] of o)
    s[n] = a;
  return s;
}, f = ["data-row"], m = { class: "title" }, h = { class: "answer" }, x = {
  __name: "SuggestionRows",
  setup(e) {
    const { rows: o, failure: s, loaded: n } = g("suggestion list", ["suggestion.*"]), a = (r) => r.answer ? `Answer: ${r.answer}` : "Answer: none yet";
    return (r, y) => (l(), d(t(p), {
      rows: t(o),
      failure: t(s),
      loaded: t(n),
      empty: "No suggestions yet"
    }, {
      default: u(({ row: c }) => [
        i("div", {
          class: "suggestion",
          "data-row": c.id
        }, [
          i("span", m, _(c.title), 1),
          i("span", h, _(a(c)), 1)
        ], 8, f)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, k = /* @__PURE__ */ w(x, [["__scopeId", "data-v-6c641fb2"]]);
export {
  k as default
};
