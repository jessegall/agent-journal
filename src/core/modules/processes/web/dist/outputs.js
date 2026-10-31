/* @code-commandments-generated */
if (!document.getElementById("window-styles-8514aee718a4")) { const style = document.createElement("style"); style.id = "window-styles-8514aee718a4"; style.textContent = ".output-body[data-v-8b8c8324]{display:flex;flex-direction:column;gap:4px;padding:2px 0 0 20px;font-size:12px}.progress[data-v-8b8c8324]{height:3px;border-radius:2px;background:var(--border, #ddd)}.bar[data-v-8b8c8324]{display:block;height:100%;border-radius:2px;background:var(--text-3)}.figure[data-v-8b8c8324]{color:var(--text-3)}.last-lines[data-v-8b8c8324]{margin:0;color:var(--text-2);line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock[data-v-ffbab2f9]{display:flex;gap:8px;font-size:12px;line-height:1.45}.output-dock-state[data-v-ffbab2f9]{color:var(--text-4)}.output-dock-line[data-v-ffbab2f9]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output[data-v-1f3ff26a]{display:flex;flex-direction:column;height:100%}.bar[data-v-1f3ff26a]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-1f3ff26a]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-1f3ff26a]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-1f3ff26a]{flex:1;margin:0;padding:0 12px 12px;overflow:auto;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-62193fb4]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-62193fb4]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-62193fb4],.state.lost[data-v-62193fb4]{color:var(--red, #d4574b)}.line[data-v-62193fb4]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-62193fb4]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { openBlock as c, createBlock as m, unref as o, withCtx as f, createElementVNode as s, normalizeClass as h, toDisplayString as a, createElementBlock as k, Fragment as C, createCommentVNode as b } from "vue";
import { useWindow as y, useRows as g, RowList as x } from "@journal/window-kit";
import { _ as v } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const w = { class: "run" }, $ = { class: "line" }, B = ["onClick"], N = ["onClick"], R = {
  __name: "Outputs",
  setup(E) {
    const n = y(), { rows: u, failure: i, loaded: r } = g("process list", ["process.*", "output.*"]), l = (t) => t.state === "running" || t.state === "background", p = (t) => n.run(`output stop ${t.id}`), d = (t) => n.run(`output watch ${t.id}`);
    return (t, O) => (c(), m(o(x), {
      rows: o(u),
      failure: o(i),
      loaded: o(r),
      empty: "No commands yet"
    }, {
      default: f(({ row: e }) => [
        s("div", w, [
          s("span", {
            class: h(["state", e.state])
          }, a(e.state), 3),
          s("span", $, a(e.line), 1),
          l(e) ? (c(), k(C, { key: 0 }, [
            s("button", {
              class: "stop",
              type: "button",
              onClick: (_) => p(e)
            }, "Stop", 8, B),
            s("button", {
              class: "watch",
              type: "button",
              onClick: (_) => d(e)
            }, "Watch", 8, N)
          ], 64)) : b("", !0)
        ])
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, z = /* @__PURE__ */ v(R, [["__scopeId", "data-v-62193fb4"]]);
export {
  z as default
};
