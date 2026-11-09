/* @code-commandments-generated */
if (!document.getElementById("window-styles-d55150df1441")) { const style = document.createElement("style"); style.id = "window-styles-d55150df1441"; style.textContent = ".dumps[data-v-a0bd6fa2]{display:flex;flex-direction:column;gap:12px}.dump[data-v-a0bd6fa2]{display:flex;flex-direction:column;gap:6px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.dump-earlier[data-v-a0bd6fa2]{flex-direction:row;align-items:center;justify-content:space-between;color:inherit;text-align:left;cursor:pointer}.dump-head[data-v-a0bd6fa2]{display:flex;align-items:center;gap:10px}.dump-title[data-v-a0bd6fa2]{margin:0;font-size:13px;font-weight:500}.dump-name[data-v-a0bd6fa2]{flex:1;font-size:13px}.dump-pill[data-v-a0bd6fa2]{padding:1px 8px;border-radius:10px;color:var(--text-3);font-size:11px;border:1px solid var(--border)}.dump-pill[data-phase=Filed][data-v-a0bd6fa2]{color:var(--accent-text)}.dump-rename[data-v-a0bd6fa2],.dumps-more[data-v-a0bd6fa2]{color:var(--text-3);background:none;border:0;cursor:pointer}.dump-rename[data-v-a0bd6fa2]{margin-left:auto;font-size:12px}.dumps-more[data-v-a0bd6fa2]{align-self:flex-start}.dump-brief[data-v-a0bd6fa2],.dumps-note[data-v-a0bd6fa2]{margin:0;color:var(--text-3);font-size:12px}.dump-progress[data-v-a0bd6fa2]{display:flex;align-items:center;gap:10px;color:var(--text-3);font-size:12px}.dump-bar[data-v-a0bd6fa2]{flex:1;height:4px;border-radius:2px;background:var(--border)}.dump-fill[data-v-a0bd6fa2]{display:block;height:100%;border-radius:2px;background:var(--accent-text)}.item[data-v-a0bd6fa2]{display:grid;grid-template-columns:64px 1fr;gap:2px 10px;padding:6px 0;border-top:1px solid var(--border)}.item-state[data-v-a0bd6fa2]{grid-row:span 3;align-self:start;color:var(--text-3);font-size:12px}.item-state.filed[data-v-a0bd6fa2]{color:var(--accent-text)}.item-state.failed[data-v-a0bd6fa2]{color:var(--danger)}.item-note[data-v-a0bd6fa2],.item-refs[data-v-a0bd6fa2]{color:var(--text-3);font-size:12px}.made-title[data-v-a0bd6fa2]{margin:8px 0 0;font-size:12px;font-weight:500}.made[data-v-a0bd6fa2]{display:flex;gap:10px;font-size:12px}.made-type[data-v-a0bd6fa2]{color:var(--accent-text)}.made-from[data-v-a0bd6fa2]{color:var(--text-3)}\n"; document.head.appendChild(style); }
import { computed as s, unref as e, openBlock as d, createBlock as i, Teleport as p, createElementVNode as u, createTextVNode as f, toDisplayString as _, createCommentVNode as w } from "vue";
import { useWindow as k, useDockCard as v, eventAboutRows as D, eventChildOf as g } from "@journal/window-kit";
const S = {
  __name: "DumpDock",
  setup(x) {
    const n = k(), r = v(), a = n.option("foot"), c = s(() => {
      var t;
      return ((t = r.data.value) == null ? void 0 : t.length) ?? 0;
    }), l = n.option("row");
    return n.follow(["dump_item.*"], (t) => {
      const o = new Set((r.data.value ?? []).map((m) => m.id));
      (D(t, o) || g(t, "dump_id", /* @__PURE__ */ new Set([e(l).target_id]))) && r.reload();
    }), (t, o) => e(e(a)) ? (d(), i(p, {
      key: 0,
      to: e(e(a))
    }, [
      u("span", null, [
        o[0] || (o[0] = f("Items: ", -1)),
        u("b", null, _(c.value), 1)
      ])
    ], 8, ["to"])) : w("", !0);
  }
};
export {
  S as default
};
