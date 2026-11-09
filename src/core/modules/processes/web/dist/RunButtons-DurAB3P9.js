import { openBlock as c, createElementBlock as l, Fragment as m, createElementVNode as n } from "vue";
import { useWindow as a } from "@journal/window-kit";
const d = {
  __name: "RunButtons",
  props: { processId: { type: Number, required: !0 } },
  setup(s) {
    const r = s, p = a(), o = (e) => p.run(`output ${e} ${r.processId}`);
    return (e, t) => (c(), l(m, null, [
      n("button", {
        class: "stop",
        type: "button",
        onClick: t[0] || (t[0] = (u) => o("stop"))
      }, "Stop"),
      n("button", {
        class: "watch",
        type: "button",
        onClick: t[1] || (t[1] = (u) => o("watch"))
      }, "Watch")
    ], 64));
  }
};
export {
  d as _
};
