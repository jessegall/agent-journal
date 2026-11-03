/* @code-commandments-generated */
if (!document.getElementById("window-styles-6f398262ef03")) { const style = document.createElement("style"); style.id = "window-styles-6f398262ef03"; style.textContent = ".search-mark[data-v-65b45c0e]{display:flex;flex-direction:column;gap:1px;min-width:260px;max-width:520px;margin:2px 0 2px 12px}.search-child[data-v-65b45c0e]{display:flex;gap:10px;align-items:baseline;padding:4px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;text-align:left;cursor:pointer}.search-child[data-v-65b45c0e]:hover:not(:disabled){background:var(--hover);color:var(--text)}.search-child[data-v-65b45c0e]:disabled{cursor:default}.search-child-name[data-v-65b45c0e]{flex:none;min-width:64px;color:var(--text-3)}.search-child-excerpt[data-v-65b45c0e]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.search-more[data-v-65b45c0e]{align-items:center;color:var(--text-3)}.search-none[data-v-65b45c0e]{margin:0;padding:4px 8px;color:var(--text-3);font-size:12px}.search[data-v-0bbbd9bc]{display:flex;flex-direction:column;gap:14px}.search-form[data-v-0bbbd9bc]{display:flex;gap:10px;align-items:center;color:var(--text-3)}.search-input[data-v-0bbbd9bc]{flex:1;max-width:520px;padding:7px 12px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text)}.search-chips[data-v-0bbbd9bc]{display:flex;flex-wrap:wrap;gap:6px}.search-chip[data-v-0bbbd9bc]{padding:2px 10px;border:0;border-radius:10px;background:var(--raised);color:var(--text-2);font-size:12px;cursor:pointer}.search-chip.on[data-v-0bbbd9bc]{background:var(--accent);color:#fff}.search-hits[data-v-0bbbd9bc]{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}.search-hit[data-v-0bbbd9bc]{display:flex;gap:12px;width:100%;padding:8px 10px;border:0;border-radius:7px;background:none;color:var(--text);font:inherit;text-align:left;cursor:pointer}.search-hit[data-v-0bbbd9bc]:hover:not(:disabled){background:var(--hover)}.search-hit[data-v-0bbbd9bc]:disabled{cursor:default}.search-hit-name[data-v-0bbbd9bc]{flex:none;width:110px;color:var(--text-3)}.search-hit-excerpt[data-v-0bbbd9bc]{flex:1;min-width:0}.search-note[data-v-0bbbd9bc]{margin:0;color:var(--text-3)}\n"; document.head.appendChild(style); }
import { computed as i, openBlock as s, createElementBlock as o, Fragment as k, renderList as f, createElementVNode as c, toDisplayString as n, createCommentVNode as h, unref as u, createVNode as v } from "vue";
import { useWindow as b, Icon as C, peekRef as g, tableOfWord as x } from "@journal/window-kit";
import { _ as y } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const $ = {
  class: "search-mark",
  "data-search-mark": ""
}, N = ["disabled", "onClick"], S = { class: "search-child-name" }, E = { class: "search-child-excerpt" }, A = {
  key: 0,
  class: "search-none",
  "data-search-none": ""
}, O = "search.search", V = {
  __name: "SearchMarkCard",
  setup(w) {
    const r = b(), m = r.option("row"), a = i(() => {
      var e;
      return JSON.parse(((e = m.value) == null ? void 0 : e.lines) || '{"terms": [], "total": 0, "hits": []}');
    }), p = i(() => a.value.total - a.value.hits.length), l = (e) => x(e.cli_name), _ = (e) => g(`${l(e)}:${e.id}`);
    return (e, d) => (s(), o("div", $, [
      (s(!0), o(k, null, f(a.value.hits, (t) => (s(), o("button", {
        key: `${t.cli_name}:${t.id}`,
        type: "button",
        class: "search-child",
        "data-search-child": "",
        disabled: !l(t),
        onClick: (B) => _(t)
      }, [
        c("span", S, n(t.cli_name) + " " + n(t.id), 1),
        c("span", E, n(t.excerpt), 1)
      ], 8, N))), 128)),
      a.value.hits.length ? h("", !0) : (s(), o("p", A, "Nothing held all of: " + n(a.value.terms.join(" ")), 1)),
      p.value > 0 ? (s(), o("button", {
        key: 1,
        type: "button",
        class: "search-child search-more",
        "data-search-more": "",
        onClick: d[0] || (d[0] = (t) => u(r).open(O))
      }, [
        v(u(C), {
          name: "search",
          size: 12
        }),
        c("span", null, "All " + n(a.value.total) + " results on the search page", 1)
      ])) : h("", !0)
    ]));
  }
}, W = /* @__PURE__ */ y(V, [["__scopeId", "data-v-65b45c0e"]]);
export {
  W as default
};
