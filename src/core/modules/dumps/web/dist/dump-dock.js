/* @code-commandments-generated */
if (!document.getElementById("window-styles-7b84f8ef4945")) { const style = document.createElement("style"); style.id = "window-styles-7b84f8ef4945"; style.textContent = ".dumps[data-v-2b72d986]{display:flex;flex-direction:column;gap:12px}.dump[data-v-2b72d986]{display:flex;flex-direction:column;gap:6px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.dump-earlier[data-v-2b72d986]{flex-direction:row;align-items:center;justify-content:space-between;color:inherit;text-align:left;cursor:pointer}.dump-head[data-v-2b72d986]{display:flex;align-items:center;gap:10px}.dump-title[data-v-2b72d986]{margin:0;font-size:13px;font-weight:500}.dump-name[data-v-2b72d986]{flex:1;font-size:13px}.dump-pill[data-v-2b72d986]{padding:1px 8px;border-radius:10px;color:var(--text-3);font-size:11px;border:1px solid var(--border)}.dump-pill[data-phase=Filed][data-v-2b72d986]{color:var(--accent-text)}.dump-rename[data-v-2b72d986],.dumps-more[data-v-2b72d986]{color:var(--text-3);background:none;border:0;cursor:pointer}.dump-rename[data-v-2b72d986]{margin-left:auto;font-size:12px}.dumps-more[data-v-2b72d986]{align-self:flex-start}.dump-brief[data-v-2b72d986],.dumps-note[data-v-2b72d986]{margin:0;color:var(--text-3);font-size:12px}.dump-progress[data-v-2b72d986]{display:flex;align-items:center;gap:10px;color:var(--text-3);font-size:12px}.dump-bar[data-v-2b72d986]{flex:1;height:4px;border-radius:2px;background:var(--border)}.dump-fill[data-v-2b72d986]{display:block;height:100%;border-radius:2px;background:var(--accent-text)}.item[data-v-2b72d986]{display:grid;grid-template-columns:64px 1fr;gap:2px 10px;padding:6px 0;border-top:1px solid var(--border)}.item-state[data-v-2b72d986]{grid-row:span 3;align-self:start;color:var(--text-3);font-size:12px}.item-state.filed[data-v-2b72d986]{color:var(--accent-text)}.item-state.failed[data-v-2b72d986]{color:var(--danger)}.item-note[data-v-2b72d986],.item-refs[data-v-2b72d986]{color:var(--text-3);font-size:12px}.made-title[data-v-2b72d986]{margin:8px 0 0;font-size:12px;font-weight:500}.made[data-v-2b72d986]{display:flex;gap:10px;font-size:12px}.made-type[data-v-2b72d986]{color:var(--accent-text)}.made-from[data-v-2b72d986]{color:var(--text-3)}\n"; document.head.appendChild(style); }
import { computed as u, unref as o, openBlock as m, createBlock as p, Teleport as s, createElementVNode as c, createTextVNode as d, toDisplayString as i, createCommentVNode as f } from "vue";
import { useWindow as _, useDockCard as k } from "@journal/window-kit";
const N = {
  __name: "DumpDock",
  setup(w) {
    const t = _(), n = k(), r = t.option("foot"), l = u(() => {
      var e;
      return ((e = n.data.value) == null ? void 0 : e.length) ?? 0;
    });
    return t.follow(["dump_item.*"], n.reload), (e, a) => o(o(r)) ? (m(), p(s, {
      key: 0,
      to: o(o(r))
    }, [
      c("span", null, [
        a[0] || (a[0] = d("Items: ", -1)),
        c("b", null, i(l.value), 1)
      ])
    ], 8, ["to"])) : f("", !0);
  }
};
export {
  N as default
};
