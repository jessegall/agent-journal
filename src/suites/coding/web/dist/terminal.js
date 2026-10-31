/* @code-commandments-generated */
if (!document.getElementById("window-styles-468042f5a592")) { const style = document.createElement("style"); style.id = "window-styles-468042f5a592"; style.textContent = ".main[data-v-e4262f6a]{flex:1}.note[data-v-e4262f6a]{color:var(--text-3);font-size:12px}.main[data-v-3d6ae42d]{flex:1}.note[data-v-3d6ae42d]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as t, createBlock as r, unref as a, withCtx as n, createTextVNode as o } from "vue";
import { EmptyState as i } from "@journal/window-kit";
const _ = {
  __name: "Terminal",
  setup(l) {
    return (m, e) => (t(), r(a(i), { title: "Terminal" }, {
      default: n(() => [...e[0] || (e[0] = [
        o("The terminal is not available in version 5 yet.", -1)
      ])]),
      _: 1
    }));
  }
};
export {
  _ as default
};
