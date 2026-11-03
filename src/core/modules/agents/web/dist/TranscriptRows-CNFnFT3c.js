/* @code-commandments-generated */
import { computed as p, openBlock as h, createElementBlock as f, createVNode as l, unref as s, withCtx as u, createElementVNode as c, toDisplayString as d } from "vue";
import { useRows as w, AutoScrollPane as g, RowList as v } from "@journal/window-kit";
const x = (a, r) => {
  const e = a.__vccOpts || a;
  for (const [i, n] of r)
    e[i] = n;
  return e;
}, k = { class: "transcript" }, y = ["data-author"], T = ["datetime"], R = { class: "text" }, S = {
  __name: "TranscriptRows",
  props: { line: { type: String, required: !0 } },
  setup(a) {
    const r = a, { rows: e, failure: i, loaded: n } = w(r.line, ["hook_call.create"]), _ = p(() => {
      var t;
      return ((t = e.value.at(-1)) == null ? void 0 : t.id) ?? 0;
    }), m = (t) => t.time ? new Date(t.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";
    return (t, N) => (h(), f("div", k, [
      l(s(g), { "row-count": _.value }, {
        default: u(() => [
          l(s(v), {
            rows: s(e),
            failure: s(i),
            loaded: s(n),
            empty: "No conversation yet",
            hint: "The agent's words and its tool calls show here as it works."
          }, {
            default: u(({ row: o }) => [
              c("span", {
                class: "author",
                "data-author": o.author
              }, d(o.author), 9, y),
              c("time", {
                class: "time",
                "data-row-time": "",
                datetime: o.time
              }, d(m(o)), 9, T),
              c("span", R, d(o.text), 1)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ]),
        _: 1
      }, 8, ["row-count"])
    ]));
  }
}, E = /* @__PURE__ */ x(S, [["__scopeId", "data-v-860107b2"]]);
export {
  E as T,
  x as _
};
