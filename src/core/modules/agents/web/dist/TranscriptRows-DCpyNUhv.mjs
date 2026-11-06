/* @code-commandments-generated */
import { ref as h, computed as N, openBlock as v, createBlock as b, unref as o, withCtx as u, createElementVNode as i, createVNode as _, toDisplayString as c, createElementBlock as w, withModifiers as B, withDirectives as R, withKeys as V, vModelText as C, createTextVNode as D, createCommentVNode as x } from "vue";
import { useRows as M, WindowRoom as E, AutoScrollPane as K, RowList as O, Btn as L } from "@journal/window-kit";
const q = (s, t) => {
  const r = s.__vccOpts || s;
  for (const [p, m] of t)
    r[p] = m;
  return r;
}, A = { class: "transcript" }, F = ["data-author"], I = { class: "text" }, P = ["datetime"], U = {
  key: 0,
  role: "alert"
}, W = {
  __name: "TranscriptRows",
  props: { line: { type: String, required: !0 }, agent: { type: Number, default: null }, padding: { type: String, default: "8px 22px 8px 27px" }, helper: Boolean },
  setup(s) {
    const t = s, { rows: r, failure: p, loaded: m, context: y } = M(t.line, ["hook_call.*"]), a = h(""), l = h(!1), g = h("");
    async function f() {
      if (t.agent === null || !a.value.trim() || l.value) return;
      l.value = !0;
      const e = await y.run(t.helper ? ["helper", "send", String(t.agent), a.value] : ["message", "send", a.value, "--target-agent", String(t.agent)]);
      g.value = e.ok ? "" : e.error, e.ok && (a.value = ""), l.value = !1;
    }
    function k(e) {
      e.shiftKey || e.isComposing || (e.preventDefault(), f());
    }
    const S = N(() => {
      var e;
      return ((e = r.value.at(-1)) == null ? void 0 : e.id) ?? 0;
    }), T = (e) => e.time ? new Date(e.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";
    return (e, d) => (v(), b(o(E), { padding: s.padding }, {
      default: u(() => [
        i("div", A, [
          _(o(K), { "row-count": S.value }, {
            default: u(() => [
              _(o(O), {
                rows: o(r),
                failure: o(p),
                loaded: o(m),
                empty: "No conversation yet",
                hint: "The agent’s messages and tool calls appear here."
              }, {
                default: u(({ row: n }) => [
                  i("span", {
                    class: "author",
                    "data-author": n.author
                  }, c(n.author), 9, F),
                  i("span", I, c(n.text), 1),
                  i("time", {
                    class: "time",
                    "data-row-time": "",
                    datetime: n.time
                  }, c(T(n)), 9, P)
                ]),
                _: 1
              }, 8, ["rows", "failure", "loaded"])
            ]),
            _: 1
          }, 8, ["row-count"]),
          s.agent !== null ? (v(), w("form", {
            key: 0,
            class: "agent-message",
            onSubmit: B(f, ["prevent"])
          }, [
            R(i("textarea", {
              "onUpdate:modelValue": d[0] || (d[0] = (n) => a.value = n),
              "aria-label": "Message this agent",
              placeholder: "Message this agent",
              rows: "2",
              onKeydown: V(k, ["enter"])
            }, null, 544), [
              [C, a.value]
            ]),
            _(o(L), {
              disabled: l.value || !a.value.trim(),
              onClick: f
            }, {
              default: u(() => [...d[1] || (d[1] = [
                D("Send", -1)
              ])]),
              _: 1
            }, 8, ["disabled"]),
            g.value ? (v(), w("p", U, c(g.value), 1)) : x("", !0)
          ], 32)) : x("", !0)
        ])
      ]),
      _: 1
    }, 8, ["padding"]));
  }
}, G = /* @__PURE__ */ q(W, [["__scopeId", "data-v-229f56cf"]]);
export {
  G as T,
  q as _
};
