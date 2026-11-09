/* @code-commandments-generated */
if (!document.getElementById("window-styles-49bd8d6752d3")) { const style = document.createElement("style"); style.id = "window-styles-49bd8d6752d3"; style.textContent = ".library-draft[data-v-44557343]{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.library-draft-foot[data-v-44557343]{display:flex;gap:6px;justify-content:flex-end}.library[data-v-44557343]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-44557343]{gap:10px}.library-body[data-v-44557343]{display:grid;flex:1;grid-template-columns:minmax(240px,2fr) 3fr;min-height:0}.library-list[data-v-44557343]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-44557343]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-44557343]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-44557343]:hover,.library-row.chosen[data-v-44557343]{background:var(--hover)}.library-icon[data-v-44557343]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-44557343]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-44557343]{font-weight:600}.library-abstract[data-v-44557343]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-44557343],.library-age[data-v-44557343]{color:var(--text-3);font-size:12px}.library-reader[data-v-44557343]{overflow-y:auto;padding:20px 28px}.reader-title[data-v-44557343]{margin:0 0 6px;font-size:20px}.reader-abstract[data-v-44557343]{margin:0 0 18px;color:var(--text-2)}.reader-empty[data-v-44557343]{margin-top:120px;text-align:center}.reader-empty-title[data-v-44557343]{margin:0 0 6px;font-weight:500}.reader-empty-text[data-v-44557343],.library-more[data-v-44557343]{margin:8px 12px;color:var(--muted);background:none;border:0;cursor:pointer}.library-note[data-v-44557343]{margin:0;color:var(--text-2)}.library-note[data-v-44557343]{padding:12px}\n"; document.head.appendChild(style); }
import { openBlock as d, createBlock as m, unref as t } from "vue";
import { useWindow as s, DocumentBody as i } from "@journal/window-kit";
const w = {
  __name: "DocumentBodyWindow",
  setup(a) {
    const e = s(), r = e.option("row"), c = /* @__PURE__ */ new Set(["doc comment", "report comment", "doc close", "doc edit", "report edit"]), n = (o) => c.has(o.slice(0, 2).join(" ")) ? e.run(o) : e.read(o);
    return (o, p) => (d(), m(t(i), {
      term: t(r).term,
      id: t(r).id,
      read: n
    }, null, 8, ["term", "id"]));
  }
};
export {
  w as default
};
