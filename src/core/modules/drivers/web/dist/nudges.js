/* @code-commandments-generated */
if (!document.getElementById("window-styles-871772224cab")) { const style = document.createElement("style"); style.id = "window-styles-871772224cab"; style.textContent = ".main[data-v-f3991ac7]{flex:1}.note[data-v-f3991ac7]{color:var(--text-3);font-size:12px}.nudge[data-v-bd565d01]{min-width:0;padding:6px 0}.nudge-head[data-v-bd565d01]{display:flex;gap:10px;align-items:baseline;margin:0 0 2px;font-size:12px}.nudge-key[data-v-bd565d01]{color:var(--text);font-weight:500}.nudge-type[data-v-bd565d01],.nudge-count[data-v-bd565d01]{color:var(--text-3)}.nudge-type[data-type=refusal][data-v-bd565d01]{color:var(--tone-bad)}.nudge-type[data-type=instruction][data-v-bd565d01]{color:var(--accent-text)}.nudge-text[data-v-bd565d01]{margin:0;color:var(--text-2);font-size:12.5px;overflow-wrap:anywhere}\n"; document.head.appendChild(style); }
import { openBlock as c, createBlock as _, unref as d, withCtx as i, createElementVNode as t, toDisplayString as s } from "vue";
import { useRows as u, RowList as p } from "@journal/window-kit";
import { _ as l } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const r = {
  class: "nudge",
  "data-nudge": ""
}, g = { class: "nudge-head" }, m = { class: "nudge-key" }, f = ["data-type"], h = { class: "nudge-count" }, y = { class: "nudge-text" }, x = {
  __name: "NudgeList",
  setup(k) {
    const { rows: a, failure: o, loaded: n } = u("nudge list", ["nudge_record.*"]);
    return (N, L) => (c(), _(d(p), {
      rows: d(a),
      failure: d(o),
      loaded: d(n),
      empty: "No module declares a nudge"
    }, {
      default: i(({ row: e }) => [
        t("div", r, [
          t("p", g, [
            t("span", m, s(e.key), 1),
            t("span", {
              class: "nudge-type",
              "data-type": e.type
            }, s(e.type), 9, f),
            t("span", h, "said " + s(e.said_count) + " " + s(e.said_count === 1 ? "time" : "times"), 1)
          ]),
          t("p", y, s(e.text), 1)
        ])
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, b = /* @__PURE__ */ l(x, [["__scopeId", "data-v-bd565d01"]]);
export {
  b as default
};
