if (!document.getElementById("window-styles-c3ed33de16b1")) { const style = document.createElement("style"); style.id = "window-styles-c3ed33de16b1"; style.textContent = ".library-draft[data-v-ed97fab2]{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.library-draft-foot[data-v-ed97fab2]{display:flex;gap:6px;justify-content:flex-end}.library[data-v-ed97fab2]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-ed97fab2]{gap:10px}.library-body[data-v-ed97fab2]{display:grid;flex:1;grid-template-columns:minmax(240px,2fr) 3fr;min-height:0}.library-list[data-v-ed97fab2]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-ed97fab2]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-ed97fab2]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-ed97fab2]:hover,.library-row.chosen[data-v-ed97fab2]{background:var(--hover)}.library-icon[data-v-ed97fab2]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-ed97fab2]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-ed97fab2]{font-weight:600}.library-abstract[data-v-ed97fab2]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-ed97fab2],.library-age[data-v-ed97fab2]{color:var(--text-3);font-size:12px}.library-reader[data-v-ed97fab2]{overflow-y:auto;padding:20px 28px}.reader-title[data-v-ed97fab2]{margin:0 0 6px;font-size:20px}.reader-abstract[data-v-ed97fab2]{margin:0 0 18px;color:var(--text-2)}.reader-empty[data-v-ed97fab2]{margin-top:120px;text-align:center}.reader-empty-title[data-v-ed97fab2]{margin:0 0 6px;font-weight:500}.reader-empty-text[data-v-ed97fab2],.library-more[data-v-ed97fab2]{margin:8px 12px;color:var(--muted);background:none;border:0;cursor:pointer}.library-note[data-v-ed97fab2]{margin:0;color:var(--text-2)}.library-note[data-v-ed97fab2]{padding:12px}\n"; document.head.appendChild(style); }
import { openBlock as n, createBlock as c, unref as o } from "vue";
import { useWindow as d, DocumentBody as m } from "@journal/window-kit";
import { d as a } from "./documentRead-Dr2B0M3c.js";
const l = {
  __name: "DocumentBodyWindow",
  setup(i) {
    const e = d(), r = e.option("row"), t = a(e);
    return (s, u) => (n(), c(o(m), {
      term: o(r).term,
      id: o(r).id,
      read: o(t)
    }, null, 8, ["term", "id", "read"]));
  }
};
export {
  l as default
};
