/* @code-commandments-generated */
if (!document.getElementById("window-styles-e5e6ca8d2000")) { const style = document.createElement("style"); style.id = "window-styles-e5e6ca8d2000"; style.textContent = ".library-draft[data-v-b8430932]{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.library-draft-foot[data-v-b8430932]{display:flex;gap:6px;justify-content:flex-end}.library[data-v-b8430932]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-b8430932]{gap:10px}.library-body[data-v-b8430932]{display:grid;flex:1;grid-template-columns:minmax(240px,2fr) 3fr;min-height:0}.library-list[data-v-b8430932]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-b8430932]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-b8430932]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-b8430932]:hover,.library-row.chosen[data-v-b8430932]{background:var(--hover)}.library-icon[data-v-b8430932]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-b8430932]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-b8430932]{font-weight:600}.library-abstract[data-v-b8430932]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-b8430932],.library-age[data-v-b8430932]{color:var(--text-3);font-size:12px}.library-reader[data-v-b8430932]{overflow-y:auto;padding:20px 28px}.reader-title[data-v-b8430932]{margin:0 0 6px;font-size:20px}.reader-abstract[data-v-b8430932]{margin:0 0 18px;color:var(--text-2)}.reader-empty[data-v-b8430932]{margin-top:120px;text-align:center}.reader-empty-title[data-v-b8430932]{margin:0 0 6px;font-weight:500}.reader-empty-text[data-v-b8430932],.library-more[data-v-b8430932]{margin:8px 12px;color:var(--muted);background:none;border:0;cursor:pointer}.library-note[data-v-b8430932]{margin:0;color:var(--text-2)}.library-note[data-v-b8430932]{padding:12px}\n"; document.head.appendChild(style); }
import { openBlock as d, createBlock as s, unref as n } from "vue";
import { useWindow as u, DocumentBody as i } from "@journal/window-kit";
const w = {
  __name: "DocumentBodyWindow",
  setup(m) {
    const e = u(), t = e.option("row"), r = /* @__PURE__ */ new Set(["doc comment", "report comment", "doc close", "doc edit", "report edit"]), c = (o) => r.has(o.slice(0, 2).join(" ")) ? e.run(o) : e.read(o);
    return (o, a) => (d(), s(n(i), {
      noun: n(t).noun,
      id: n(t).id,
      read: c
    }, null, 8, ["noun", "id"]));
  }
};
export {
  w as default
};
