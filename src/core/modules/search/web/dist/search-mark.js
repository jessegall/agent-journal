if (!document.getElementById("window-styles-6db50b252113")) { const style = document.createElement("style"); style.id = "window-styles-6db50b252113"; style.textContent = ".search-mark[data-v-1c0a0a5e]{display:flex;flex-direction:column;gap:1px;min-width:260px;max-width:520px;margin:2px 0 2px 12px}.search-child[data-v-1c0a0a5e]{display:flex;gap:10px;align-items:baseline;padding:4px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;text-align:left;cursor:pointer}.search-child[data-v-1c0a0a5e]:hover:not(:disabled){background:var(--hover);color:var(--text)}.search-child[data-v-1c0a0a5e]:disabled{cursor:default}.search-child-name[data-v-1c0a0a5e]{flex:none;min-width:64px;color:var(--text-3)}.search-child-excerpt[data-v-1c0a0a5e]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.search-more[data-v-1c0a0a5e]{align-items:center;color:var(--text-3)}.search-none[data-v-1c0a0a5e]{margin:0;padding:4px 8px;color:var(--text-3);font-size:12px}.search[data-v-d40ddf74]{display:flex;flex-direction:column;gap:14px}.search-chips[data-v-d40ddf74]{display:flex;flex-wrap:wrap;gap:6px}.search-chip[data-v-d40ddf74]{padding:2px 10px;border:0;border-radius:10px;background:var(--raised);color:var(--text-2);font-size:12px;cursor:pointer}.search-chip.on[data-v-d40ddf74]{background:var(--accent);color:#fff}.search-hits[data-v-d40ddf74]{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}.search-hit[data-v-d40ddf74]{display:flex;gap:12px;width:100%;padding:8px 10px;border:0;border-radius:7px;background:none;color:var(--text);font:inherit;text-align:left;cursor:pointer}.search-hit[data-v-d40ddf74]:hover{background:var(--hover)}.search-dialog-text[data-v-d40ddf74]{margin:0;white-space:pre-wrap}.search-hit-name[data-v-d40ddf74]{flex:none;width:110px;color:var(--text-3)}.search-hit-excerpt[data-v-d40ddf74]{flex:1;min-width:0}.search-hit-words[data-v-d40ddf74]{color:var(--text-2);font-size:12px}.search-note[data-v-d40ddf74]{margin:0;color:var(--text-3)}\n"; document.head.appendChild(style); }
import { computed as i, openBlock as s, createElementBlock as o, Fragment as k, renderList as v, createElementVNode as n, toDisplayString as c, createCommentVNode as h, unref as u, createVNode as f } from "vue";
import { useWindow as b, Icon as C, peekRef as x, tableOfWord as y } from "@journal/window-kit";
import { _ as $ } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const g = {
  class: "search-mark",
  "data-search-mark": ""
}, N = ["disabled", "onClick"], S = { class: "search-child-name" }, E = { class: "search-child-excerpt" }, w = {
  key: 0,
  class: "search-none",
  "data-search-none": ""
}, A = "search.search", O = {
  __name: "SearchMarkCard",
  setup(V) {
    const r = b(), m = r.option("row"), a = i(() => {
      var e;
      return JSON.parse(((e = m.value) == null ? void 0 : e.lines) || '{"terms": [], "total": 0, "hits": []}');
    }), p = i(() => a.value.total - a.value.hits.length), l = (e) => y(e.cli_name), _ = (e) => x(`${l(e)}:${e.id}`);
    return (e, d) => (s(), o("div", g, [
      (s(!0), o(k, null, v(a.value.hits, (t) => (s(), o("button", {
        key: `${t.cli_name}:${t.id}`,
        type: "button",
        class: "search-child",
        "data-search-child": "",
        disabled: !l(t),
        onClick: (B) => _(t)
      }, [
        n("span", S, c(t.cli_name) + " " + c(t.id), 1),
        n("span", E, c(t.excerpt), 1)
      ], 8, N))), 128)),
      a.value.hits.length ? h("", !0) : (s(), o("p", w, "No results match all these words: " + c(a.value.terms.join(" ")), 1)),
      p.value > 0 ? (s(), o("button", {
        key: 1,
        type: "button",
        class: "search-child search-more",
        "data-search-more": "",
        onClick: d[0] || (d[0] = (t) => u(r).open(A))
      }, [
        f(u(C), {
          name: "search",
          size: 12
        }),
        n("span", null, "All " + c(a.value.total) + " results on the search page", 1)
      ])) : h("", !0)
    ]));
  }
}, W = /* @__PURE__ */ $(O, [["__scopeId", "data-v-1c0a0a5e"]]);
export {
  W as default
};
