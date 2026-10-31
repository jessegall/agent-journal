if (!document.getElementById("window-styles-77b8fff7cb8e")) { const style = document.createElement("style"); style.id = "window-styles-77b8fff7cb8e"; style.textContent = ".main[data-v-7f88e13c]{flex:1}.note[data-v-7f88e13c]{color:var(--text-3);font-size:12px}.main[data-v-3d756525]{flex:1}.note[data-v-3d756525]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
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
