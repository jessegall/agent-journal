/* @code-commandments-generated */
import { computed as m, openBlock as h, createElementBlock as f, createVNode as l, unref as a, withCtx as u, createElementVNode as i, toDisplayString as d } from "vue";
import { useRows as w, AutoScrollPane as g, RowList as v } from "@journal/window-kit";
const x = (s, r) => {
  const e = s.__vccOpts || s;
  for (const [n, c] of r)
    e[n] = c;
  return e;
}, k = { class: "transcript" }, y = ["data-author"], T = ["datetime"], R = { class: "text" }, S = {
  __name: "TranscriptRows",
  props: { line: { type: String, required: !0 } },
  setup(s) {
    const r = s, { rows: e, failure: n, loaded: c } = w(r.line, ["hook_call.create"]), _ = m(() => {
      var t;
      return ((t = e.value.at(-1)) == null ? void 0 : t.id) ?? 0;
    }), p = (t) => t.at ? new Date(t.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";
    return (t, N) => (h(), f("div", k, [
      l(a(g), { "row-count": _.value }, {
        default: u(() => [
          l(a(v), {
            rows: a(e),
            failure: a(n),
            loaded: a(c),
            empty: "No conversation yet",
            hint: "The agent's words and its tool calls show here as it works."
          }, {
            default: u(({ row: o }) => [
              i("span", {
                class: "author",
                "data-author": o.author
              }, d(o.author), 9, y),
              i("time", {
                class: "time",
                "data-row-time": "",
                datetime: o.at
              }, d(p(o)), 9, T),
              i("span", R, d(o.text), 1)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ]),
        _: 1
      }, 8, ["row-count"])
    ]));
  }
}, E = /* @__PURE__ */ x(S, [["__scopeId", "data-v-f5181272"]]);
export {
  E as T,
  x as _
};
