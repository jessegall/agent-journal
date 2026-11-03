/* @code-commandments-generated */
if (!document.getElementById("window-styles-00c6c34d9a42")) { const style = document.createElement("style"); style.id = "window-styles-00c6c34d9a42"; style.textContent = ".main[data-v-d1545365]{flex:1}.note[data-v-d1545365]{color:var(--text-3);font-size:12px}.nudge[data-v-ff6ed4dd]{min-width:0;padding:6px 0}.nudge-head[data-v-ff6ed4dd]{display:flex;gap:10px;align-items:baseline;margin:0 0 2px;font-size:12px}.nudge-key[data-v-ff6ed4dd]{color:var(--text);font-weight:500}.nudge-type[data-v-ff6ed4dd],.nudge-count[data-v-ff6ed4dd]{color:var(--text-3)}.nudge-type[data-type=refusal][data-v-ff6ed4dd]{color:var(--tone-bad)}.nudge-type[data-type=steering][data-v-ff6ed4dd]{color:var(--accent-text)}.nudge-text[data-v-ff6ed4dd]{margin:0;color:var(--text-2);font-size:12.5px;overflow-wrap:anywhere}\n"; document.head.appendChild(style); }
import { openBlock as c, createBlock as l, unref as s, withCtx as a, createVNode as u, createElementVNode as t, toDisplayString as d } from "vue";
import { useRows as _, WindowRoom as r, RowList as p } from "@journal/window-kit";
import { _ as m } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const f = {
  class: "nudge",
  "data-nudge": ""
}, g = { class: "nudge-head" }, h = { class: "nudge-key" }, y = ["data-type"], x = { class: "nudge-count" }, N = { class: "nudge-text" }, k = {
  __name: "NudgeList",
  setup(v) {
    const { rows: o, failure: n, loaded: i } = _("nudge list", ["nudge_record.*"]);
    return (w, L) => (c(), l(s(r), null, {
      default: a(() => [
        u(s(p), {
          rows: s(o),
          failure: s(n),
          loaded: s(i),
          empty: "No module declares a nudge",
          hint: "A line a module may say to an agent is listed here with the module that declares it."
        }, {
          default: a(({ row: e }) => [
            t("div", f, [
              t("p", g, [
                t("span", h, d(e.key), 1),
                t("span", {
                  class: "nudge-type",
                  "data-type": e.type
                }, d(e.type), 9, y),
                t("span", x, "said " + d(e.delivery_count) + " " + d(e.delivery_count === 1 ? "time" : "times"), 1)
              ]),
              t("p", N, d(e.text), 1)
            ])
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, A = /* @__PURE__ */ m(k, [["__scopeId", "data-v-ff6ed4dd"]]);
export {
  A as default
};
