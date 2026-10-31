/* @code-commandments-generated */
if (!document.getElementById("window-styles-9aa446bf4cad")) { const style = document.createElement("style"); style.id = "window-styles-9aa446bf4cad"; style.textContent = ".output-body[data-v-8b8c8324]{display:flex;flex-direction:column;gap:4px;padding:2px 0 0 20px;font-size:12px}.progress[data-v-8b8c8324]{height:3px;border-radius:2px;background:var(--border, #ddd)}.bar[data-v-8b8c8324]{display:block;height:100%;border-radius:2px;background:var(--text-3)}.figure[data-v-8b8c8324]{color:var(--text-3)}.last-lines[data-v-8b8c8324]{margin:0;color:var(--text-2);line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock[data-v-ffbab2f9]{display:flex;gap:8px;font-size:12px;line-height:1.45}.output-dock-state[data-v-ffbab2f9]{color:var(--text-4)}.output-dock-line[data-v-ffbab2f9]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output[data-v-1f3ff26a]{display:flex;flex-direction:column;height:100%}.bar[data-v-1f3ff26a]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-1f3ff26a]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-1f3ff26a]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-1f3ff26a]{flex:1;margin:0;padding:0 12px 12px;overflow:auto;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-c6f8cc16]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-c6f8cc16]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-c6f8cc16],.state.lost[data-v-c6f8cc16]{color:var(--red, #d4574b)}.line[data-v-c6f8cc16]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-c6f8cc16]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { computed as u, openBlock as o, createElementBlock as s, Fragment as i, createElementVNode as r, normalizeStyle as d, toDisplayString as n, createCommentVNode as c } from "vue";
import { _ as m } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const p = {
  key: 0,
  class: "output-body"
}, f = { class: "progress" }, y = { class: "figure" }, _ = {
  key: 1,
  class: "last-lines"
}, w = {
  __name: "OutputBody",
  props: { row: { type: Object, default: null } },
  setup(e) {
    const a = e, l = u(() => {
      var t;
      return Math.round((((t = a.row) == null ? void 0 : t.fraction) ?? 0) * 100);
    });
    return (t, h) => e.row ? (o(), s("div", p, [
      e.row.figure ? (o(), s(i, { key: 0 }, [
        r("div", f, [
          r("span", {
            class: "bar",
            style: d({ width: `${l.value}%` })
          }, null, 4)
        ]),
        r("span", y, n(e.row.figure), 1)
      ], 64)) : c("", !0),
      e.row.lines ? (o(), s("pre", _, n(e.row.lines), 1)) : c("", !0)
    ])) : c("", !0);
  }
}, b = /* @__PURE__ */ m(w, [["__scopeId", "data-v-8b8c8324"]]);
export {
  b as default
};
