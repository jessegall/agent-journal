if (!document.getElementById("window-styles-76c62683ad19")) { const style = document.createElement("style"); style.id = "window-styles-76c62683ad19"; style.textContent = ".revisions[data-v-258f93a7]{padding-top:16px}.failure[data-v-258f93a7]{color:var(--bad, var(--text-2));font-size:12.5px}.age[data-v-d58ef5de]{color:var(--text-3);font-size:12px;white-space:nowrap}.more[data-v-d58ef5de],.failure[data-v-d58ef5de]{margin:0;padding:4px var(--inset);font-size:12px}.failure[data-v-d58ef5de]{color:var(--bad, var(--text-2))}.library-draft[data-v-d338a838]{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.library-draft-foot[data-v-d338a838]{display:flex;gap:6px;justify-content:flex-end}.library[data-v-d338a838]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-d338a838]{gap:10px}.library-body[data-v-d338a838]{display:grid;flex:1;grid-template-columns:1fr;min-height:0}.library-list[data-v-d338a838]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-d338a838]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-d338a838]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-d338a838]:hover{background:var(--hover)}.library-icon[data-v-d338a838]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-d338a838]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-d338a838]{font-weight:600}.library-abstract[data-v-d338a838]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-d338a838],.library-age[data-v-d338a838]{color:var(--text-3);font-size:12px}.library-more[data-v-d338a838]{margin:8px 12px;color:var(--muted);background:none;border:0;cursor:pointer}.library-note[data-v-d338a838]{margin:0;color:var(--text-2)}.library-note[data-v-d338a838]{padding:12px}\n"; document.head.appendChild(style); }
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
