/* @code-commandments-generated */
import { computed as m, openBlock as h, createBlock as f, unref as e, withCtx as d, createElementVNode as i, createVNode as p, toDisplayString as l } from "vue";
import { useRows as g, WindowRoom as w, AutoScrollPane as x, RowList as v } from "@journal/window-kit";
const y = (o, n) => {
  const a = o.__vccOpts || o;
  for (const [r, c] of n)
    a[r] = c;
  return a;
}, k = { class: "transcript" }, R = ["data-author"], S = { class: "text" }, T = ["datetime"], N = {
  __name: "TranscriptRows",
  props: { line: { type: String, required: !0 }, padding: { type: String, default: "8px 22px 8px 27px" } },
  setup(o) {
    const n = o, { rows: a, failure: r, loaded: c } = g(n.line, ["hook_call.create"]), u = m(() => {
      var t;
      return ((t = a.value.at(-1)) == null ? void 0 : t.id) ?? 0;
    }), _ = (t) => t.time ? new Date(t.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";
    return (t, B) => (h(), f(e(w), { padding: o.padding }, {
      default: d(() => [
        i("div", k, [
          p(e(x), { "row-count": u.value }, {
            default: d(() => [
              p(e(v), {
                rows: e(a),
                failure: e(r),
                loaded: e(c),
                empty: "No conversation yet",
                hint: "The agent's words and its tool calls show here as it works."
              }, {
                default: d(({ row: s }) => [
                  i("span", {
                    class: "author",
                    "data-author": s.author
                  }, l(s.author), 9, R),
                  i("span", S, l(s.text), 1),
                  i("time", {
                    class: "time",
                    "data-row-time": "",
                    datetime: s.time
                  }, l(_(s)), 9, T)
                ]),
                _: 1
              }, 8, ["rows", "failure", "loaded"])
            ]),
            _: 1
          }, 8, ["row-count"])
        ])
      ]),
      _: 1
    }, 8, ["padding"]));
  }
}, O = /* @__PURE__ */ y(N, [["__scopeId", "data-v-59058e92"]]);
export {
  O as T,
  y as _
};
