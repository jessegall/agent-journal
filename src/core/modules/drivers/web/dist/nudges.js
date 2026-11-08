/* @code-commandments-generated */
if (!document.getElementById("window-styles-634278a1c89c")) { const style = document.createElement("style"); style.id = "window-styles-634278a1c89c"; style.textContent = "details[data-v-efdd3bca]{width:100%;font-size:12px}summary[data-v-efdd3bca]{cursor:pointer}.check[data-v-efdd3bca]{padding:8px 0;border-bottom:1px solid var(--border)}.check span[data-v-efdd3bca]{margin-left:8px}.note[data-v-efdd3bca]{color:var(--text-3)}p[data-v-efdd3bca]{margin:4px 0 0;white-space:pre-wrap}.activity[data-v-d4f200c4]{width:100%}.summary[data-v-d4f200c4]{display:flex;gap:10px}.main[data-v-d4f200c4]{flex:1}.note[data-v-d4f200c4]{color:var(--text-3);font-size:12px}.nudge[data-v-ec205110]{min-width:0;padding:6px 0}.nudge-head[data-v-ec205110]{display:flex;gap:10px;align-items:baseline;margin:0 0 2px;font-size:12px}.nudge-key[data-v-ec205110]{color:var(--text);font-weight:500}.nudge-type[data-v-ec205110],.nudge-count[data-v-ec205110]{color:var(--text-3)}.nudge-type[data-type=refusal][data-v-ec205110]{color:var(--tone-bad)}.nudge-type[data-type=steering][data-v-ec205110]{color:var(--accent-text)}.nudge-text[data-v-ec205110]{margin:0;color:var(--text-2);font-size:12.5px;overflow-wrap:anywhere}\n"; document.head.appendChild(style); }
import { openBlock as u, createBlock as l, unref as t, withCtx as a, createVNode as _, createElementVNode as s, toDisplayString as o } from "vue";
import { useWindow as p, WindowRoom as r, RowList as g } from "@journal/window-kit";
import { _ as m, n as y } from "./_plugin-vue_export-helper-BEOZ8alP.mjs";
const f = {
  class: "nudge",
  "data-nudge": ""
}, h = { class: "nudge-head" }, v = { class: "nudge-key" }, x = ["data-type"], N = { class: "nudge-count" }, k = { class: "nudge-text" }, L = {
  __name: "NudgeList",
  setup(b) {
    const d = p(), { rows: n, failure: c, loaded: i } = d.props.nudges;
    return (w, B) => (u(), l(t(r), null, {
      default: a(() => [
        _(t(g), {
          rows: t(n),
          failure: t(c),
          loaded: t(i),
          empty: "No module declares a nudge",
          hint: "Instructions available to agents appear here, grouped by module."
        }, {
          default: a(({ row: e }) => [
            s("div", f, [
              s("p", h, [
                s("span", v, o(e.key), 1),
                s("span", {
                  class: "nudge-type",
                  "data-type": e.type
                }, o(t(y)(e.type)), 9, x),
                s("span", N, "said " + o(e.delivery_count) + " " + o(e.delivery_count === 1 ? "time" : "times"), 1)
              ]),
              s("p", k, o(e.text), 1)
            ])
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, W = /* @__PURE__ */ m(L, [["__scopeId", "data-v-ec205110"]]);
export {
  W as default
};
