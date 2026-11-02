/* @code-commandments-generated */
if (!document.getElementById("window-styles-ff50da57bb03")) { const style = document.createElement("style"); style.id = "window-styles-ff50da57bb03"; style.textContent = ".main[data-v-b751fa35]{flex:1}.note[data-v-b751fa35]{color:var(--text-3);font-size:12px}.nudge[data-v-19f61f82]{min-width:0;padding:6px 0}.nudge-head[data-v-19f61f82]{display:flex;gap:10px;align-items:baseline;margin:0 0 2px;font-size:12px}.nudge-key[data-v-19f61f82]{color:var(--text);font-weight:500}.nudge-type[data-v-19f61f82],.nudge-count[data-v-19f61f82]{color:var(--text-3)}.nudge-type[data-type=refusal][data-v-19f61f82]{color:var(--tone-bad)}.nudge-type[data-type=instruction][data-v-19f61f82]{color:var(--accent-text)}.nudge-text[data-v-19f61f82]{margin:0;color:var(--text-2);font-size:12.5px;overflow-wrap:anywhere}\n"; document.head.appendChild(style); }
import { openBlock as c, createBlock as _, unref as d, withCtx as i, createElementVNode as t, toDisplayString as s } from "vue";
import { useRows as u, RowList as l } from "@journal/window-kit";
import { _ as r } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const p = {
  class: "nudge",
  "data-nudge": ""
}, f = { class: "nudge-head" }, g = { class: "nudge-key" }, m = ["data-type"], y = { class: "nudge-count" }, h = { class: "nudge-text" }, x = {
  __name: "NudgeList",
  setup(k) {
    const { rows: o, failure: a, loaded: n } = u("nudge list", ["nudge_record.*"]);
    return (v, N) => (c(), _(d(l), {
      rows: d(o),
      failure: d(a),
      loaded: d(n),
      empty: "No module declares a nudge"
    }, {
      default: i(({ row: e }) => [
        t("div", p, [
          t("p", f, [
            t("span", g, s(e.key), 1),
            t("span", {
              class: "nudge-type",
              "data-type": e.type
            }, s(e.type), 9, m),
            t("span", y, "said " + s(e.delivery_count) + " " + s(e.delivery_count === 1 ? "time" : "times"), 1)
          ]),
          t("p", h, s(e.text), 1)
        ])
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, w = /* @__PURE__ */ r(x, [["__scopeId", "data-v-19f61f82"]]);
export {
  w as default
};
