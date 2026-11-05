/* @code-commandments-generated */
if (!document.getElementById("window-styles-63ee08cfefa4")) { const style = document.createElement("style"); style.id = "window-styles-63ee08cfefa4"; style.textContent = ".memories[data-v-47bce12f],.memories-form[data-v-47bce12f]{display:flex;flex-direction:column;gap:8px}.memories-form[data-v-47bce12f]{align-items:flex-start}.memories-form textarea[data-v-47bce12f]{width:100%}.memories-refusal[data-v-47bce12f]{margin:0;color:var(--danger);font-size:12.5px}.memory[data-v-47bce12f]{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0;padding:4px 0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.memory-kind[data-v-47bce12f]{color:var(--text-3);font-size:12px}.memories-page[data-v-3ebd406a]{display:flex;flex-direction:column;gap:8px;align-items:flex-start}.memories-page[data-v-3ebd406a]>.memories{align-self:stretch}.memory-round[data-v-03fe1c3a]{margin:0 0 0 20px}.memory-round-rows[data-v-03fe1c3a]{margin:0;padding:0;list-style:none}.memory-round-row[data-v-03fe1c3a]{display:flex;flex-wrap:wrap;gap:2px 8px;padding:2px 0;color:var(--text-2);font-size:12px;line-height:1.45;overflow-wrap:anywhere}.memory-round-ref[data-v-03fe1c3a]{padding:0;border:0;background:none;color:var(--accent-text);font:inherit;cursor:pointer}.memory-round-weight[data-v-03fe1c3a]{color:var(--text-4)}\n"; document.head.appendChild(style); }
import { unref as o, openBlock as m, createBlock as c, Teleport as p, createElementVNode as n, createTextVNode as s, toDisplayString as l, createCommentVNode as u } from "vue";
import { useDockRow as a, useWindow as i } from "@journal/window-kit";
const w = {
  __name: "MemoryDock",
  setup(f) {
    const e = a("memory"), t = i().option("foot");
    return (_, r) => o(o(t)) && o(e) ? (m(), c(p, {
      key: 0,
      to: o(o(t))
    }, [
      n("span", null, [
        r[0] || (r[0] = s("Weight: ", -1)),
        n("b", null, l(o(e).weight), 1)
      ])
    ], 8, ["to"])) : u("", !0);
  }
};
export {
  w as default
};
