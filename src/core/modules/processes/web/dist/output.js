/* @code-commandments-generated */
if (!document.getElementById("window-styles-8514aee718a4")) { const style = document.createElement("style"); style.id = "window-styles-8514aee718a4"; style.textContent = ".output-body[data-v-8b8c8324]{display:flex;flex-direction:column;gap:4px;padding:2px 0 0 20px;font-size:12px}.progress[data-v-8b8c8324]{height:3px;border-radius:2px;background:var(--border, #ddd)}.bar[data-v-8b8c8324]{display:block;height:100%;border-radius:2px;background:var(--text-3)}.figure[data-v-8b8c8324]{color:var(--text-3)}.last-lines[data-v-8b8c8324]{margin:0;color:var(--text-2);line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock[data-v-ffbab2f9]{display:flex;gap:8px;font-size:12px;line-height:1.45}.output-dock-state[data-v-ffbab2f9]{color:var(--text-4)}.output-dock-line[data-v-ffbab2f9]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output[data-v-1f3ff26a]{display:flex;flex-direction:column;height:100%}.bar[data-v-1f3ff26a]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-1f3ff26a]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-1f3ff26a]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-1f3ff26a]{flex:1;margin:0;padding:0 12px 12px;overflow:auto;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-62193fb4]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-62193fb4]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-62193fb4],.state.lost[data-v-62193fb4]{color:var(--red, #d4574b)}.line[data-v-62193fb4]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-62193fb4]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as i, onMounted as y, onBeforeUnmount as h, openBlock as r, createBlock as g, unref as p, createElementBlock as w, createElementVNode as a, toDisplayString as v, Fragment as b, createCommentVNode as $ } from "vue";
import { useWindow as x, EmptyState as C } from "@journal/window-kit";
import { _ as S } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const B = {
  key: 1,
  class: "output"
}, E = { class: "bar" }, I = { class: "line" }, L = { class: "text" }, N = 2e3, O = {
  __name: "Output",
  setup(W) {
    const o = x(), t = i(0), n = i(null), d = i([]), l = i(!1);
    let m = null;
    const f = () => n.value !== null && (n.value.state === "running" || n.value.state === "background");
    async function s() {
      if (t.value = t.value || await o.setting("output", 0), !t.value) {
        const u = await o.read("process list --limit 1");
        t.value = u.ok && u.value.rows.length ? u.value.rows[0].id : 0;
      }
      if (!t.value) return;
      const c = await o.read(`process show ${t.value}`);
      n.value = c.ok ? c.value : null;
      const e = await o.read(`output peek ${t.value} ${l.value ? "--all" : "--summary"}`);
      d.value = e.ok ? e.value.lines : [e.error];
    }
    function _() {
      m = setTimeout(async () => {
        f() && await s(), _();
      }, N);
    }
    async function k() {
      l.value = !l.value, await s();
    }
    return o.follow(["process.*", "output.*"], s), y(async () => {
      await s(), _();
    }), h(() => clearTimeout(m)), (c, e) => t.value ? (r(), w("div", B, [
      a("div", E, [
        a("span", I, v(n.value ? n.value.line : ""), 1),
        a("button", {
          class: "whole",
          type: "button",
          onClick: k
        }, v(l.value ? "Reader lines" : "Whole output"), 1),
        f() ? (r(), w(b, { key: 0 }, [
          a("button", {
            class: "stop",
            type: "button",
            onClick: e[0] || (e[0] = (u) => p(o).run(`output stop ${t.value}`))
          }, "Stop"),
          a("button", {
            class: "watch",
            type: "button",
            onClick: e[1] || (e[1] = (u) => p(o).run(`output watch ${t.value}`))
          }, "Watch")
        ], 64)) : $("", !0)
      ]),
      a("pre", L, v(d.value.join(`
`)), 1)
    ])) : (r(), g(p(C), {
      key: 0,
      title: "No output yet"
    }));
  }
}, T = /* @__PURE__ */ S(O, [["__scopeId", "data-v-1f3ff26a"]]);
export {
  T as default
};
