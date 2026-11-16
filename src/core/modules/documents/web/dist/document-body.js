if (!document.getElementById("window-styles-3d6f6c51354e")) { const style = document.createElement("style"); style.id = "window-styles-3d6f6c51354e"; style.textContent = ".library-draft[data-v-b80380bc]{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.library-draft-foot[data-v-b80380bc]{display:flex;gap:6px;justify-content:flex-end}.library[data-v-b80380bc]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-b80380bc]{gap:10px}.library-body[data-v-b80380bc]{display:grid;flex:1;grid-template-columns:1fr;min-height:0}.library-list[data-v-b80380bc]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-b80380bc]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-b80380bc]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-b80380bc]:hover{background:var(--hover)}.library-icon[data-v-b80380bc]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-b80380bc]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-b80380bc]{font-weight:600}.library-abstract[data-v-b80380bc]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-b80380bc],.library-age[data-v-b80380bc]{color:var(--text-3);font-size:12px}.library-more[data-v-b80380bc]{margin:8px 12px;color:var(--muted);background:none;border:0;cursor:pointer}.library-note[data-v-b80380bc]{margin:0;color:var(--text-2)}.library-note[data-v-b80380bc]{padding:12px}.revisions[data-v-258f93a7]{padding-top:16px}.failure[data-v-258f93a7]{color:var(--bad, var(--text-2));font-size:12.5px}.age[data-v-efc3b3c5]{color:var(--text-3);font-size:12px;white-space:nowrap}.more[data-v-efc3b3c5],.failure[data-v-efc3b3c5]{margin:0;padding:4px var(--inset);font-size:12px}.failure[data-v-efc3b3c5]{color:var(--bad, var(--text-2))}\n"; document.head.appendChild(style); }
import { openBlock as n, createBlock as c, unref as o } from "vue";
import { useWindow as d, DocumentBody as m } from "@journal/window-kit";
import { d as a } from "./documentRead-DHNxyEM4.js";
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
