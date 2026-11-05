/* @code-commandments-generated */
if (!document.getElementById("window-styles-6febfeb210ae")) { const style = document.createElement("style"); style.id = "window-styles-6febfeb210ae"; style.textContent = ".dumps[data-v-cd05b5ba]{display:flex;flex-direction:column;gap:12px}.dump[data-v-cd05b5ba]{display:flex;flex-direction:column;gap:6px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.dump-earlier[data-v-cd05b5ba]{flex-direction:row;align-items:center;justify-content:space-between;color:inherit;text-align:left;cursor:pointer}.dump-head[data-v-cd05b5ba]{display:flex;align-items:center;gap:10px}.dump-title[data-v-cd05b5ba]{margin:0;font-size:13px;font-weight:500}.dump-name[data-v-cd05b5ba]{flex:1;font-size:13px}.dump-pill[data-v-cd05b5ba]{padding:1px 8px;border-radius:10px;color:var(--text-3);font-size:11px;border:1px solid var(--border)}.dump-pill[data-phase=Filed][data-v-cd05b5ba]{color:var(--accent-text)}.dump-rename[data-v-cd05b5ba],.dumps-more[data-v-cd05b5ba]{color:var(--text-3);background:none;border:0;cursor:pointer}.dump-rename[data-v-cd05b5ba]{margin-left:auto;font-size:12px}.dumps-more[data-v-cd05b5ba]{align-self:flex-start}.dump-brief[data-v-cd05b5ba],.dumps-note[data-v-cd05b5ba]{margin:0;color:var(--text-3);font-size:12px}.dump-progress[data-v-cd05b5ba]{display:flex;align-items:center;gap:10px;color:var(--text-3);font-size:12px}.dump-bar[data-v-cd05b5ba]{flex:1;height:4px;border-radius:2px;background:var(--border)}.dump-fill[data-v-cd05b5ba]{display:block;height:100%;border-radius:2px;background:var(--accent-text)}.item[data-v-cd05b5ba]{display:grid;grid-template-columns:64px 1fr;gap:2px 10px;padding:6px 0;border-top:1px solid var(--border)}.item-state[data-v-cd05b5ba]{grid-row:span 3;align-self:start;color:var(--text-3);font-size:12px}.item-state.filed[data-v-cd05b5ba]{color:var(--accent-text)}.item-state.failed[data-v-cd05b5ba]{color:var(--danger)}.item-note[data-v-cd05b5ba],.item-refs[data-v-cd05b5ba]{color:var(--text-3);font-size:12px}.made-title[data-v-cd05b5ba]{margin:8px 0 0;font-size:12px;font-weight:500}.made[data-v-cd05b5ba]{display:flex;gap:10px;font-size:12px}.made-kind[data-v-cd05b5ba]{color:var(--accent-text)}.made-from[data-v-cd05b5ba]{color:var(--text-3)}\n"; document.head.appendChild(style); }
import { ref as s, unref as e, openBlock as m, createBlock as i, Teleport as p, createElementVNode as u, createTextVNode as f, toDisplayString as d, createCommentVNode as _ } from "vue";
import { useWindow as k } from "@journal/window-kit";
const g = {
  __name: "DumpDock",
  setup(w) {
    const t = k(), c = t.option("row"), n = t.option("foot"), r = s(0);
    async function a() {
      const o = await t.read(`dump items ${c.value.target_id}`);
      o.ok && (r.value = o.value.length);
    }
    return t.follow(["dump_item.*"], a), a(), (o, l) => e(e(n)) ? (m(), i(p, {
      key: 0,
      to: e(e(n))
    }, [
      u("span", null, [
        l[0] || (l[0] = f("Items: ", -1)),
        u("b", null, d(r.value), 1)
      ])
    ], 8, ["to"])) : _("", !0);
  }
};
export {
  g as default
};
