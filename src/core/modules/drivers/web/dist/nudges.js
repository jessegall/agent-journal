/* @code-commandments-generated */
if (!document.getElementById("window-styles-76994975f84f")) { const style = document.createElement("style"); style.id = "window-styles-76994975f84f"; style.textContent = "details[data-v-efdd3bca]{width:100%;font-size:12px}summary[data-v-efdd3bca]{cursor:pointer}.check[data-v-efdd3bca]{padding:8px 0;border-bottom:1px solid var(--border)}.check span[data-v-efdd3bca]{margin-left:8px}.note[data-v-efdd3bca]{color:var(--text-3)}p[data-v-efdd3bca]{margin:4px 0 0;white-space:pre-wrap}.activity[data-v-0df7ff1b]{width:100%}.summary[data-v-0df7ff1b]{display:flex;gap:10px}.main[data-v-0df7ff1b]{flex:1}.note[data-v-0df7ff1b]{color:var(--text-3);font-size:12px}.nudge[data-v-894b8f1e]{min-width:0;padding:6px 0}.nudge-head[data-v-894b8f1e]{display:flex;gap:10px;align-items:baseline;margin:0 0 2px;font-size:12px}.nudge-key[data-v-894b8f1e]{color:var(--text);font-weight:500}.nudge-type[data-v-894b8f1e],.nudge-count[data-v-894b8f1e]{color:var(--text-3)}.nudge-type[data-type=refusal][data-v-894b8f1e]{color:var(--tone-bad)}.nudge-type[data-type=steering][data-v-894b8f1e]{color:var(--accent-text)}.nudge-text[data-v-894b8f1e]{margin:0;color:var(--text-2);font-size:12.5px;overflow-wrap:anywhere}\n"; document.head.appendChild(style); }
import { openBlock as u, createBlock as i, unref as t, withCtx as o, createVNode as l, createElementVNode as s, toDisplayString as a } from "vue";
import { useRows as _, WindowRoom as r, RowList as p } from "@journal/window-kit";
import { _ as g, n as m } from "./_plugin-vue_export-helper-BEOZ8alP.mjs";
const f = {
  class: "nudge",
  "data-nudge": ""
}, y = { class: "nudge-head" }, h = { class: "nudge-key" }, x = ["data-type"], v = { class: "nudge-count" }, N = { class: "nudge-text" }, b = {
  __name: "NudgeList",
  setup(k) {
    const { rows: d, failure: n, loaded: c } = _("nudge list", ["nudge_record.*"]);
    return (L, R) => (u(), i(t(r), null, {
      default: o(() => [
        l(t(p), {
          rows: t(d),
          failure: t(n),
          loaded: t(c),
          empty: "No module declares a nudge",
          hint: "Instructions available to agents appear here, grouped by module."
        }, {
          default: o(({ row: e }) => [
            s("div", f, [
              s("p", y, [
                s("span", h, a(e.key), 1),
                s("span", {
                  class: "nudge-type",
                  "data-type": e.type
                }, a(t(m)(e.type)), 9, x),
                s("span", v, "said " + a(e.delivery_count) + " " + a(e.delivery_count === 1 ? "time" : "times"), 1)
              ]),
              s("p", N, a(e.text), 1)
            ])
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, V = /* @__PURE__ */ g(b, [["__scopeId", "data-v-894b8f1e"]]);
export {
  V as default
};
