/* @code-commandments-generated */
import { onUnmounted as R, ref as h, computed as x, openBlock as _, createBlock as V, unref as s, withCtx as c, createElementVNode as d, createVNode as w, toDisplayString as p, createElementBlock as k, withModifiers as D, withDirectives as O, withKeys as E, vModelText as K, createTextVNode as A, createCommentVNode as S } from "vue";
import { useWindow as L, FeedPaginator as P, eventMayBeChildOf as U, WindowRoom as W, AutoScrollPane as q, RowList as F, Btn as I } from "@journal/window-kit";
const j = (r, t) => {
  const a = r.__vccOpts || r;
  for (const [l, m] of t)
    a[l] = m;
  return a;
}, z = { class: "transcript" }, G = ["data-author"], H = { class: "text" }, J = ["datetime"], Q = {
  key: 0,
  role: "alert"
}, X = {
  __name: "TranscriptRows",
  props: { name: { type: String, required: !0 }, agent: { type: Number, default: null }, padding: { type: String, default: "8px 22px 8px 27px" }, helper: Boolean },
  setup(r) {
    const t = r, a = L(), l = a.props[t.name], { failure: m, loaded: N } = l, T = P.ofRows("transcript", l);
    a.reload(t.name);
    const b = /* @__PURE__ */ new Set([Number(t.name.split(".").pop())]), g = a.follow(["hook_call.*"], (e) => U(e, "session_agent_id", b) && a.reload(t.name));
    R(() => g == null ? void 0 : g());
    const n = h(""), u = h(!1), f = h("");
    async function v() {
      if (t.agent === null || !n.value.trim() || u.value) return;
      u.value = !0;
      const e = await a.run(t.helper ? ["helper", "send", String(t.agent), n.value] : ["message", "send", n.value, "--target-agent", String(t.agent)]);
      f.value = e.ok ? "" : e.error, e.ok && (n.value = ""), u.value = !1;
    }
    function B(e) {
      e.shiftKey || e.isComposing || (e.preventDefault(), v());
    }
    const y = x(() => [...l.rows.value].sort((e, i) => e.id - i.id)), C = x(() => {
      var e;
      return ((e = y.value.at(-1)) == null ? void 0 : e.id) ?? 0;
    }), M = (e) => e.time ? new Date(e.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";
    return (e, i) => (_(), V(s(W), { padding: r.padding }, {
      default: c(() => [
        d("div", z, [
          w(s(q), {
            "row-count": C.value,
            feed: s(T)
          }, {
            default: c(() => [
              w(s(F), {
                rows: y.value,
                failure: s(m),
                loaded: s(N),
                empty: "No conversation yet",
                hint: "The agent’s messages and tool calls appear here."
              }, {
                default: c(({ row: o }) => [
                  d("span", {
                    class: "author",
                    "data-author": o.author
                  }, p(o.author), 9, G),
                  d("span", H, p(o.text), 1),
                  d("time", {
                    class: "time",
                    "data-row-time": "",
                    datetime: o.time
                  }, p(M(o)), 9, J)
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
            O(d("textarea", {
              "onUpdate:modelValue": i[0] || (i[0] = (o) => n.value = o),
              "aria-label": "Message this agent",
              placeholder: "Message this agent",
              rows: "2",
              onKeydown: E(B, ["enter"])
            }, null, 544), [
              [K, n.value]
            ]),
            w(s(I), {
              disabled: u.value || !n.value.trim(),
              onClick: v
            }, {
              default: c(() => [...i[1] || (i[1] = [
                A("Send", -1)
              ])]),
              _: 1
            }, 8, ["disabled"]),
            f.value ? (_(), k("p", Q, p(f.value), 1)) : S("", !0)
          ], 32)) : S("", !0)
        ])
      ]),
      _: 1
    }, 8, ["padding"]));
  }
}, $ = /* @__PURE__ */ j(X, [["__scopeId", "data-v-43829806"]]);
export {
  $ as T,
  j as _
};
