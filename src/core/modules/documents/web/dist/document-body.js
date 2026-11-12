if (!document.getElementById("window-styles-ad49b4c38aa8")) { const style = document.createElement("style"); style.id = "window-styles-ad49b4c38aa8"; style.textContent = ".library-draft[data-v-f3669d2d]{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.library-draft-foot[data-v-f3669d2d]{display:flex;gap:6px;justify-content:flex-end}.library[data-v-f3669d2d]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-f3669d2d]{gap:10px}.library-body[data-v-f3669d2d]{display:grid;flex:1;grid-template-columns:minmax(240px,2fr) 3fr;min-height:0}.library-list[data-v-f3669d2d]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-f3669d2d]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-f3669d2d]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-f3669d2d]:hover,.library-row.chosen[data-v-f3669d2d]{background:var(--hover)}.library-icon[data-v-f3669d2d]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-f3669d2d]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-f3669d2d]{font-weight:600}.library-abstract[data-v-f3669d2d]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-f3669d2d],.library-age[data-v-f3669d2d]{color:var(--text-3);font-size:12px}.library-reader[data-v-f3669d2d]{overflow-y:auto;padding:20px 28px}.reader-title[data-v-f3669d2d]{margin:0 0 6px;font-size:20px}.reader-abstract[data-v-f3669d2d]{margin:0 0 18px;color:var(--text-2)}.reader-empty[data-v-f3669d2d]{margin-top:120px;text-align:center}.reader-empty-title[data-v-f3669d2d]{margin:0 0 6px;font-weight:500}.reader-empty-text[data-v-f3669d2d],.library-more[data-v-f3669d2d]{margin:8px 12px;color:var(--muted);background:none;border:0;cursor:pointer}.library-note[data-v-f3669d2d]{margin:0;color:var(--text-2)}.library-note[data-v-f3669d2d]{padding:12px}\n"; document.head.appendChild(style); }
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
