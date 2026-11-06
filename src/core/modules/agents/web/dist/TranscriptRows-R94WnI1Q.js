/* @code-commandments-generated */
import { ref as h, computed as N, openBlock as v, createBlock as b, unref as s, withCtx as c, createElementVNode as l, createVNode as _, toDisplayString as p, createElementBlock as w, withModifiers as B, withDirectives as V, withKeys as C, vModelText as D, createTextVNode as M, createCommentVNode as x } from "vue";
import { useWindow as R, WindowRoom as E, AutoScrollPane as K, RowList as O, Btn as L } from "@journal/window-kit";
const W = (r, t) => {
  const a = r.__vccOpts || r;
  for (const [i, m] of t)
    a[i] = m;
  return a;
}, q = { class: "transcript" }, A = ["data-author"], F = { class: "text" }, I = ["datetime"], P = {
  key: 0,
  role: "alert"
}, U = {
  __name: "TranscriptRows",
  props: { name: { type: String, required: !0 }, agent: { type: Number, default: null }, padding: { type: String, default: "8px 22px 8px 27px" }, helper: Boolean },
  setup(r) {
    const t = r, a = R(), { rows: i, failure: m, loaded: y } = a.props[t.name];
    a.reload(t.name), a.follow(["hook_call.*"], () => a.reload(t.name));
    const n = h(""), d = h(!1), g = h("");
    async function f() {
      if (t.agent === null || !n.value.trim() || d.value) return;
      d.value = !0;
      const e = await a.run(t.helper ? ["helper", "send", String(t.agent), n.value] : ["message", "send", n.value, "--target-agent", String(t.agent)]);
      g.value = e.ok ? "" : e.error, e.ok && (n.value = ""), d.value = !1;
    }
    function k(e) {
      e.shiftKey || e.isComposing || (e.preventDefault(), f());
    }
    const S = N(() => {
      var e;
      return ((e = i.value.at(-1)) == null ? void 0 : e.id) ?? 0;
    }), T = (e) => e.time ? new Date(e.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";
    return (e, u) => (v(), b(s(E), { padding: r.padding }, {
      default: c(() => [
        l("div", q, [
          _(s(K), { "row-count": S.value }, {
            default: c(() => [
              _(s(O), {
                rows: s(i),
                failure: s(m),
                loaded: s(y),
                empty: "No conversation yet",
                hint: "The agent’s messages and tool calls appear here."
              }, {
                default: c(({ row: o }) => [
                  l("span", {
                    class: "author",
                    "data-author": o.author
                  }, p(o.author), 9, A),
                  l("span", F, p(o.text), 1),
                  l("time", {
                    class: "time",
                    "data-row-time": "",
                    datetime: o.time
                  }, p(T(o)), 9, I)
                ]),
                _: 1
              }, 8, ["rows", "failure", "loaded"])
            ]),
            _: 1
          }, 8, ["row-count"]),
          r.agent !== null ? (v(), w("form", {
            key: 0,
            class: "agent-message",
            onSubmit: B(f, ["prevent"])
          }, [
            V(l("textarea", {
              "onUpdate:modelValue": u[0] || (u[0] = (o) => n.value = o),
              "aria-label": "Message this agent",
              placeholder: "Message this agent",
              rows: "2",
              onKeydown: C(k, ["enter"])
            }, null, 544), [
              [D, n.value]
            ]),
            _(s(L), {
              disabled: d.value || !n.value.trim(),
              onClick: f
            }, {
              default: c(() => [...u[1] || (u[1] = [
                M("Send", -1)
              ])]),
              _: 1
            }, 8, ["disabled"]),
            g.value ? (v(), w("p", P, p(g.value), 1)) : x("", !0)
          ], 32)) : x("", !0)
        ])
      ]),
      _: 1
    }, 8, ["padding"]));
  }
}, G = /* @__PURE__ */ W(U, [["__scopeId", "data-v-837e642a"]]);
export {
  G as T,
  W as _
};
