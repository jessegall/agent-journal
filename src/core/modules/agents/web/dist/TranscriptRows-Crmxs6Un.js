import { onUnmounted as V, ref as h, computed as x, openBlock as w, createBlock as D, unref as s, withCtx as c, createElementVNode as d, createVNode as _, toDisplayString as p, createElementBlock as k, withModifiers as O, withDirectives as A, withKeys as E, vModelText as K, createTextVNode as L, createCommentVNode as S } from "vue";
import { useWindow as P, FeedPaginator as U, eventMayBeChildOf as W, WindowRoom as q, AutoScrollPane as F, RowList as I, Btn as j, agentRowArgument as b } from "@journal/window-kit";
const z = (r, t) => {
  const a = r.__vccOpts || r;
  for (const [l, m] of t)
    a[l] = m;
  return a;
}, G = { class: "transcript" }, H = ["data-author"], J = { class: "text" }, Q = ["datetime"], X = {
  key: 0,
  role: "alert"
}, Y = {
  __name: "TranscriptRows",
  props: { name: { type: String, required: !0 }, agent: { type: Number, default: null }, padding: { type: String, default: "8px 22px 8px 27px" }, helper: Boolean },
  setup(r) {
    const t = r, a = P(), l = a.props[t.name], { failure: m, loaded: N } = l, T = U.ofRows("transcript", l);
    a.reload(t.name);
    const B = /* @__PURE__ */ new Set([Number(t.name.split(".").pop())]), g = a.follow(["hook_call.*"], (e) => W(e, "session_agent_id", B) && a.reload(t.name));
    V(() => g == null ? void 0 : g());
    const n = h(""), u = h(!1), f = h("");
    async function v() {
      if (t.agent === null || !n.value.trim() || u.value) return;
      u.value = !0;
      const e = await a.run(t.helper ? ["helper", "send", b(t.agent), n.value] : ["message", "send", n.value, "--target-agent", b(t.agent)]);
      f.value = e.ok ? "" : e.error, e.ok && (n.value = ""), u.value = !1;
    }
    function R(e) {
      e.shiftKey || e.isComposing || (e.preventDefault(), v());
    }
    const y = x(() => [...l.rows.value].sort((e, i) => e.id - i.id)), C = x(() => {
      var e;
      return ((e = y.value.at(-1)) == null ? void 0 : e.id) ?? 0;
    }), M = (e) => e.time ? new Date(e.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";
    return (e, i) => (w(), D(s(q), { padding: r.padding }, {
      default: c(() => [
        d("div", G, [
          _(s(F), {
            "row-count": C.value,
            feed: s(T)
          }, {
            default: c(() => [
              _(s(I), {
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
                  }, p(o.author), 9, H),
                  d("span", J, p(o.text), 1),
                  d("time", {
                    class: "time",
                    "data-row-time": "",
                    datetime: o.time
                  }, p(M(o)), 9, Q)
                ]),
                _: 1
              }, 8, ["rows", "failure", "loaded"])
            ]),
            _: 1
          }, 8, ["row-count", "feed"]),
          r.agent !== null ? (w(), k("form", {
            key: 0,
            class: "agent-message",
            onSubmit: O(v, ["prevent"])
          }, [
            A(d("textarea", {
              "onUpdate:modelValue": i[0] || (i[0] = (o) => n.value = o),
              "aria-label": "Message this agent",
              placeholder: "Message this agent",
              rows: "2",
              onKeydown: E(R, ["enter"])
            }, null, 544), [
              [K, n.value]
            ]),
            _(s(j), {
              disabled: u.value || !n.value.trim(),
              onClick: v
            }, {
              default: c(() => [...i[1] || (i[1] = [
                L("Send", -1)
              ])]),
              _: 1
            }, 8, ["disabled"]),
            f.value ? (w(), k("p", X, p(f.value), 1)) : S("", !0)
          ], 32)) : S("", !0)
        ])
      ]),
      _: 1
    }, 8, ["padding"]));
  }
}, ee = /* @__PURE__ */ z(Y, [["__scopeId", "data-v-836d5abc"]]);
export {
  ee as T,
  z as _
};
