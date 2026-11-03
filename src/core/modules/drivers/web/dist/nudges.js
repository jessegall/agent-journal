/* @code-commandments-generated */
if (!document.getElementById("window-styles-3ae8c1a2eb3b")) { const style = document.createElement("style"); style.id = "window-styles-3ae8c1a2eb3b"; style.textContent = ".main[data-v-fbaf83d4]{flex:1}.note[data-v-fbaf83d4]{color:var(--text-3);font-size:12px}.nudge[data-v-c72d88cb]{min-width:0;padding:6px 0}.nudge-head[data-v-c72d88cb]{display:flex;gap:10px;align-items:baseline;margin:0 0 2px;font-size:12px}.nudge-key[data-v-c72d88cb]{color:var(--text);font-weight:500}.nudge-type[data-v-c72d88cb],.nudge-count[data-v-c72d88cb]{color:var(--text-3)}.nudge-type[data-type=refusal][data-v-c72d88cb]{color:var(--tone-bad)}.nudge-type[data-type=instruction][data-v-c72d88cb]{color:var(--accent-text)}.nudge-text[data-v-c72d88cb]{margin:0;color:var(--text-2);font-size:12.5px;overflow-wrap:anywhere}\n"; document.head.appendChild(style); }
import { openBlock as c, createBlock as i, unref as d, withCtx as _, createElementVNode as t, toDisplayString as s } from "vue";
import { useRows as l, RowList as u } from "@journal/window-kit";
import { _ as r } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const p = {
  class: "nudge",
  "data-nudge": ""
}, m = { class: "nudge-head" }, g = { class: "nudge-key" }, h = ["data-type"], y = { class: "nudge-count" }, f = { class: "nudge-text" }, x = {
  __name: "NudgeList",
  setup(k) {
    const { rows: a, failure: o, loaded: n } = l("nudge list", ["nudge_record.*"]);
    return (v, N) => (c(), i(d(u), {
      rows: d(a),
      failure: d(o),
      loaded: d(n),
      empty: "No module declares a nudge",
      hint: "A line a module may say to an agent is listed here with the module that declares it."
    }, {
      default: _(({ row: e }) => [
        t("div", p, [
          t("p", m, [
            t("span", g, s(e.key), 1),
            t("span", {
              class: "nudge-type",
              "data-type": e.type
            }, s(e.type), 9, h),
            t("span", y, "said " + s(e.delivery_count) + " " + s(e.delivery_count === 1 ? "time" : "times"), 1)
          ]),
          t("p", f, s(e.text), 1)
        ])
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, R = /* @__PURE__ */ r(x, [["__scopeId", "data-v-c72d88cb"]]);
export {
  R as default
};
