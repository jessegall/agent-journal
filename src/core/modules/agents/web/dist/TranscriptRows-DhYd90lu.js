/* @code-commandments-generated */
import { computed as m, openBlock as h, createBlock as f, unref as e, withCtx as d, createElementVNode as r, createVNode as u, toDisplayString as l } from "vue";
import { useRows as w, WindowRoom as x, AutoScrollPane as g, RowList as v } from "@journal/window-kit";
const k = (s, i) => {
  const o = s.__vccOpts || s;
  for (const [n, c] of i)
    o[n] = c;
  return o;
}, y = { class: "transcript" }, R = ["data-author"], T = { class: "text" }, S = ["datetime"], N = {
  __name: "TranscriptRows",
  props: { line: { type: String, required: !0 } },
  setup(s) {
    const i = s, { rows: o, failure: n, loaded: c } = w(i.line, ["hook_call.create"]), p = m(() => {
      var t;
      return ((t = o.value.at(-1)) == null ? void 0 : t.id) ?? 0;
    }), _ = (t) => t.time ? new Date(t.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";
    return (t, B) => (h(), f(e(x), { padding: "8px 22px 8px 27px" }, {
      default: d(() => [
        r("div", y, [
          u(e(g), { "row-count": p.value }, {
            default: d(() => [
              u(e(v), {
                rows: e(o),
                failure: e(n),
                loaded: e(c),
                empty: "No conversation yet",
                hint: "The agent's words and its tool calls show here as it works."
              }, {
                default: d(({ row: a }) => [
                  r("span", {
                    class: "author",
                    "data-author": a.author
                  }, l(a.author), 9, R),
                  r("span", T, l(a.text), 1),
                  r("time", {
                    class: "time",
                    "data-row-time": "",
                    datetime: a.time
                  }, l(_(a)), 9, S)
                ]),
                _: 1
              }, 8, ["rows", "failure", "loaded"])
            ]),
            _: 1
          }, 8, ["row-count"])
        ])
      ]),
      _: 1
    }));
  }
}, O = /* @__PURE__ */ k(N, [["__scopeId", "data-v-827f2819"]]);
export {
  O as T,
  k as _
};
