/* @code-commandments-generated */
if (!document.getElementById("window-styles-e55a7643fbc0")) { const style = document.createElement("style"); style.id = "window-styles-e55a7643fbc0"; style.textContent = ".output-body[data-v-8b8c8324]{display:flex;flex-direction:column;gap:4px;padding:2px 0 0 20px;font-size:12px}.progress[data-v-8b8c8324]{height:3px;border-radius:2px;background:var(--border, #ddd)}.bar[data-v-8b8c8324]{display:block;height:100%;border-radius:2px;background:var(--text-3)}.figure[data-v-8b8c8324]{color:var(--text-3)}.last-lines[data-v-8b8c8324]{margin:0;color:var(--text-2);line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock[data-v-270da32c]{display:flex;margin:0 14px 10px 36px;flex-wrap:wrap;gap:4px 8px;font-size:12px;line-height:1.45}.output-dock-state[data-v-270da32c]{color:var(--text-3)}.output-dock-state.running[data-v-270da32c],.output-dock-state.background[data-v-270da32c]{color:var(--accent-text)}.output-dock-line[data-v-270da32c]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-lines[data-v-270da32c]{flex-basis:100%;margin:0;color:var(--text-2);font-size:11.5px;white-space:pre-wrap}.output[data-v-b54b35ed]{display:flex;flex-direction:column;height:100%}.bar[data-v-b54b35ed]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-b54b35ed]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-b54b35ed]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-b54b35ed]{flex:1;margin:0;padding:0 12px 12px;overflow:auto;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-62193fb4]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-62193fb4]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-62193fb4],.state.lost[data-v-62193fb4]{color:var(--red, #d4574b)}.line[data-v-62193fb4]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-62193fb4]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as i, openBlock as s, createElementBlock as u, Fragment as k, createElementVNode as p, normalizeClass as f, toDisplayString as c, createCommentVNode as d } from "vue";
import { useWindow as g, usePoll as h } from "@journal/window-kit";
import { _ as w } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const x = {
  class: "output-dock",
  "data-output-dock": ""
}, y = { class: "output-dock-line" }, D = {
  key: 1,
  class: "output-dock-lines"
}, B = {
  __name: "OutputDock",
  setup(C) {
    const o = g(), _ = o.option("row"), t = i(null), a = i([]), m = () => t.value === null || t.value.state === "running" || t.value.state === "background";
    async function v() {
      var r;
      const e = (r = _.value) == null ? void 0 : r.target_id;
      if (!e) return;
      const n = await o.read(`process show ${e}`);
      t.value = n.ok ? n.value : null;
      const l = await o.read(`output peek ${e} --summary`);
      a.value = l.ok ? l.value.lines : [];
    }
    return h(v, m), (e, n) => (s(), u("div", x, [
      t.value ? (s(), u(k, { key: 0 }, [
        p("span", {
          class: f(["output-dock-state", t.value.state])
        }, c(t.value.state), 3),
        p("span", y, c(t.value.line), 1)
      ], 64)) : d("", !0),
      a.value.length ? (s(), u("pre", D, c(a.value.join(`
`)), 1)) : d("", !0)
    ]));
  }
}, V = /* @__PURE__ */ w(B, [["__scopeId", "data-v-270da32c"]]);
export {
  V as default
};
