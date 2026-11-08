/* @code-commandments-generated */
import { onUnmounted as V, ref as h, computed as y, openBlock as _, createBlock as C, unref as s, withCtx as c, createElementVNode as d, createVNode as w, toDisplayString as p, createElementBlock as k, withModifiers as D, withDirectives as M, withKeys as E, vModelText as K, createTextVNode as O, createCommentVNode as S } from "vue";
import { useWindow as L, FeedPaginator as P, WindowRoom as U, AutoScrollPane as W, RowList as q, Btn as A } from "@journal/window-kit";
const F = (r, t) => {
  const a = r.__vccOpts || r;
  for (const [l, m] of t)
    a[l] = m;
  return a;
}, I = { class: "transcript" }, j = ["data-author"], z = { class: "text" }, G = ["datetime"], H = {
  key: 0,
  role: "alert"
}, J = {
  __name: "TranscriptRows",
  props: { name: { type: String, required: !0 }, agent: { type: Number, default: null }, padding: { type: String, default: "8px 22px 8px 27px" }, helper: Boolean },
  setup(r) {
    const t = r, a = L(), l = a.props[t.name], { failure: m, loaded: T } = l, N = P.ofRows("transcript", l);
    a.reload(t.name);
    const f = a.follow(["hook_call.*"], () => a.reload(t.name));
    V(() => f == null ? void 0 : f());
    const n = h(""), u = h(!1), g = h("");
    async function v() {
      if (t.agent === null || !n.value.trim() || u.value) return;
      u.value = !0;
      const e = await a.run(t.helper ? ["helper", "send", String(t.agent), n.value] : ["message", "send", n.value, "--target-agent", String(t.agent)]);
      g.value = e.ok ? "" : e.error, e.ok && (n.value = ""), u.value = !1;
    }
    function b(e) {
      e.shiftKey || e.isComposing || (e.preventDefault(), v());
    }
    const x = y(() => [...l.rows.value].sort((e, i) => e.id - i.id)), B = y(() => {
      var e;
      return ((e = x.value.at(-1)) == null ? void 0 : e.id) ?? 0;
    }), R = (e) => e.time ? new Date(e.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";
    return (e, i) => (_(), C(s(U), { padding: r.padding }, {
      default: c(() => [
        d("div", I, [
          w(s(W), {
            "row-count": B.value,
            feed: s(N)
          }, {
            default: c(() => [
              w(s(q), {
                rows: x.value,
                failure: s(m),
                loaded: s(T),
                empty: "No conversation yet",
                hint: "The agent’s messages and tool calls appear here."
              }, {
                default: c(({ row: o }) => [
                  d("span", {
                    class: "author",
                    "data-author": o.author
                  }, p(o.author), 9, j),
                  d("span", z, p(o.text), 1),
                  d("time", {
                    class: "time",
                    "data-row-time": "",
                    datetime: o.time
                  }, p(R(o)), 9, G)
                ]),
                _: 1
              }, 8, ["rows", "failure", "loaded"])
            ]),
            _: 1
          }, 8, ["row-count", "feed"]),
          r.agent !== null ? (_(), k("form", {
            key: 0,
            class: "agent-message",
            onSubmit: D(v, ["prevent"])
          }, [
            M(d("textarea", {
              "onUpdate:modelValue": i[0] || (i[0] = (o) => n.value = o),
              "aria-label": "Message this agent",
              placeholder: "Message this agent",
              rows: "2",
              onKeydown: E(b, ["enter"])
            }, null, 544), [
              [K, n.value]
            ]),
            w(s(A), {
              disabled: u.value || !n.value.trim(),
              onClick: v
            }, {
              default: c(() => [...i[1] || (i[1] = [
                O("Send", -1)
              ])]),
              _: 1
            }, 8, ["disabled"]),
            g.value ? (_(), k("p", H, p(g.value), 1)) : S("", !0)
          ], 32)) : S("", !0)
        ])
      ]),
      _: 1
    }, 8, ["padding"]));
  }
}, Y = /* @__PURE__ */ F(J, [["__scopeId", "data-v-805fdf18"]]);
export {
  Y as T,
  F as _
};
