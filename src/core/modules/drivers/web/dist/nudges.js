/* @code-commandments-generated */
if (!document.getElementById("window-styles-4fe434278c06")) { const style = document.createElement("style"); style.id = "window-styles-4fe434278c06"; style.textContent = ".main[data-v-d1545365]{flex:1}.note[data-v-d1545365]{color:var(--text-3);font-size:12px}.nudge[data-v-30fe2b6a]{min-width:0;padding:6px 0}.nudge-head[data-v-30fe2b6a]{display:flex;gap:10px;align-items:baseline;margin:0 0 2px;font-size:12px}.nudge-key[data-v-30fe2b6a]{color:var(--text);font-weight:500}.nudge-type[data-v-30fe2b6a],.nudge-count[data-v-30fe2b6a]{color:var(--text-3)}.nudge-type[data-type=refusal][data-v-30fe2b6a]{color:var(--tone-bad)}.nudge-type[data-type=steering][data-v-30fe2b6a]{color:var(--accent-text)}.nudge-text[data-v-30fe2b6a]{margin:0;color:var(--text-2);font-size:12.5px;overflow-wrap:anywhere}\n"; document.head.appendChild(style); }
import { openBlock as u, createBlock as i, unref as s, withCtx as a, createVNode as _, createElementVNode as t, toDisplayString as o } from "vue";
import { useRows as l, WindowRoom as r, RowList as p } from "@journal/window-kit";
import { _ as g } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const m = {
  class: "nudge",
  "data-nudge": ""
}, f = { class: "nudge-head" }, y = { class: "nudge-key" }, h = ["data-type"], x = { class: "nudge-count" }, v = { class: "nudge-text" }, N = {
  __name: "NudgeList",
  setup(k) {
    const { rows: d, failure: n, loaded: c } = l("nudge list", ["nudge_record.*"]);
    return (b, L) => (u(), i(s(r), null, {
      default: a(() => [
        _(s(p), {
          rows: s(d),
          failure: s(n),
          loaded: s(c),
          empty: "No module declares a nudge",
          hint: "Instructions available to agents appear here, grouped by module."
        }, {
          default: a(({ row: e }) => [
            t("div", m, [
              t("p", f, [
                t("span", y, o(e.key), 1),
                t("span", {
                  class: "nudge-type",
                  "data-type": e.type
                }, o(e.type), 9, h),
                t("span", x, "said " + o(e.delivery_count) + " " + o(e.delivery_count === 1 ? "time" : "times"), 1)
              ]),
              t("p", v, o(e.text), 1)
            ])
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, I = /* @__PURE__ */ g(N, [["__scopeId", "data-v-30fe2b6a"]]);
export {
  I as default
};
