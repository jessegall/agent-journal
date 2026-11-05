/* @code-commandments-generated */
import { ref as v, computed as N, openBlock as h, createBlock as b, unref as a, withCtx as u, createElementVNode as i, createVNode as _, toDisplayString as c, createElementBlock as w, withModifiers as R, withDirectives as V, withKeys as B, vModelText as C, createTextVNode as D, createCommentVNode as x } from "vue";
import { useRows as M, WindowRoom as E, AutoScrollPane as K, RowList as O, Btn as L } from "@journal/window-kit";
const q = (n, s) => {
  const r = n.__vccOpts || n;
  for (const [m, p] of s)
    r[m] = p;
  return r;
}, A = { class: "transcript" }, F = ["data-author"], I = { class: "text" }, P = ["datetime"], U = {
  key: 0,
  role: "alert"
}, W = {
  __name: "TranscriptRows",
  props: { line: { type: String, required: !0 }, agent: { type: Number, default: null }, padding: { type: String, default: "8px 22px 8px 27px" } },
  setup(n) {
    const s = n, { rows: r, failure: m, loaded: p, context: y } = M(s.line, ["hook_call.*"]), o = v(""), l = v(!1), g = v("");
    async function f() {
      if (s.agent === null || !o.value.trim() || l.value) return;
      l.value = !0;
      const e = await y.run(["message", "send", o.value, "--target-agent", String(s.agent)]);
      g.value = e.ok ? "" : e.error, e.ok && (o.value = ""), l.value = !1;
    }
    function k(e) {
      e.shiftKey || e.isComposing || (e.preventDefault(), f());
    }
    const S = N(() => {
      var e;
      return ((e = r.value.at(-1)) == null ? void 0 : e.id) ?? 0;
    }), T = (e) => e.time ? new Date(e.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";
    return (e, d) => (h(), b(a(E), { padding: n.padding }, {
      default: u(() => [
        i("div", A, [
          _(a(K), { "row-count": S.value }, {
            default: u(() => [
              _(a(O), {
                rows: a(r),
                failure: a(m),
                loaded: a(p),
                empty: "No conversation yet",
                hint: "The agent’s messages and tool calls appear here."
              }, {
                default: u(({ row: t }) => [
                  i("span", {
                    class: "author",
                    "data-author": t.author
                  }, c(t.author), 9, F),
                  i("span", I, c(t.text), 1),
                  i("time", {
                    class: "time",
                    "data-row-time": "",
                    datetime: t.time
                  }, c(T(t)), 9, P)
                ]),
                _: 1
              }, 8, ["rows", "failure", "loaded"])
            ]),
            _: 1
          }, 8, ["row-count"]),
          n.agent !== null ? (h(), w("form", {
            key: 0,
            class: "agent-message",
            onSubmit: R(f, ["prevent"])
          }, [
            V(i("textarea", {
              "onUpdate:modelValue": d[0] || (d[0] = (t) => o.value = t),
              "aria-label": "Message this agent",
              placeholder: "Message this agent",
              rows: "2",
              onKeydown: B(k, ["enter"])
            }, null, 544), [
              [C, o.value]
            ]),
            _(a(L), {
              disabled: l.value || !o.value.trim(),
              onClick: f
            }, {
              default: u(() => [...d[1] || (d[1] = [
                D("Send", -1)
              ])]),
              _: 1
            }, 8, ["disabled"]),
            g.value ? (h(), w("p", U, c(g.value), 1)) : x("", !0)
          ], 32)) : x("", !0)
        ])
      ]),
      _: 1
    }, 8, ["padding"]));
  }
}, G = /* @__PURE__ */ q(W, [["__scopeId", "data-v-d93e3dc9"]]);
export {
  G as T,
  q as _
};
