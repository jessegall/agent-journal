/* @code-commandments-generated */
import { onUnmounted as N, ref as h, computed as B, openBlock as _, createBlock as V, unref as s, withCtx as c, createElementVNode as i, createVNode as w, toDisplayString as m, createElementBlock as x, withModifiers as C, withDirectives as D, withKeys as M, vModelText as R, createTextVNode as E, createCommentVNode as y } from "vue";
import { useWindow as K, WindowRoom as O, AutoScrollPane as L, RowList as U, Btn as W } from "@journal/window-kit";
const q = (r, t) => {
  const a = r.__vccOpts || r;
  for (const [l, p] of t)
    a[l] = p;
  return a;
}, A = { class: "transcript" }, I = ["data-author"], P = { class: "text" }, j = ["datetime"], z = {
  key: 0,
  role: "alert"
}, F = {
  __name: "TranscriptRows",
  props: { name: { type: String, required: !0 }, agent: { type: Number, default: null }, padding: { type: String, default: "8px 22px 8px 27px" }, helper: Boolean },
  setup(r) {
    const t = r, a = K(), { rows: l, failure: p, loaded: k } = a.props[t.name];
    a.reload(t.name);
    const g = a.follow(["hook_call.*"], () => a.reload(t.name));
    N(() => g == null ? void 0 : g());
    const n = h(""), d = h(!1), f = h("");
    async function v() {
      if (t.agent === null || !n.value.trim() || d.value) return;
      d.value = !0;
      const e = await a.run(t.helper ? ["helper", "send", String(t.agent), n.value] : ["message", "send", n.value, "--target-agent", String(t.agent)]);
      f.value = e.ok ? "" : e.error, e.ok && (n.value = ""), d.value = !1;
    }
    function S(e) {
      e.shiftKey || e.isComposing || (e.preventDefault(), v());
    }
    const b = B(() => {
      var e;
      return ((e = l.value.at(-1)) == null ? void 0 : e.id) ?? 0;
    }), T = (e) => e.time ? new Date(e.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }) : "";
    return (e, u) => (_(), V(s(O), { padding: r.padding }, {
      default: c(() => [
        i("div", A, [
          w(s(L), { "row-count": b.value }, {
            default: c(() => [
              w(s(U), {
                rows: s(l),
                failure: s(p),
                loaded: s(k),
                empty: "No conversation yet",
                hint: "The agent’s messages and tool calls appear here."
              }, {
                default: c(({ row: o }) => [
                  i("span", {
                    class: "author",
                    "data-author": o.author
                  }, m(o.author), 9, I),
                  i("span", P, m(o.text), 1),
                  i("time", {
                    class: "time",
                    "data-row-time": "",
                    datetime: o.time
                  }, m(T(o)), 9, j)
                ]),
                _: 1
              }, 8, ["rows", "failure", "loaded"])
            ]),
            _: 1
          }, 8, ["row-count"]),
          r.agent !== null ? (_(), x("form", {
            key: 0,
            class: "agent-message",
            onSubmit: C(v, ["prevent"])
          }, [
            D(i("textarea", {
              "onUpdate:modelValue": u[0] || (u[0] = (o) => n.value = o),
              "aria-label": "Message this agent",
              placeholder: "Message this agent",
              rows: "2",
              onKeydown: M(S, ["enter"])
            }, null, 544), [
              [R, n.value]
            ]),
            w(s(W), {
              disabled: d.value || !n.value.trim(),
              onClick: v
            }, {
              default: c(() => [...u[1] || (u[1] = [
                E("Send", -1)
              ])]),
              _: 1
            }, 8, ["disabled"]),
            f.value ? (_(), x("p", z, m(f.value), 1)) : y("", !0)
          ], 32)) : y("", !0)
        ])
      ]),
      _: 1
    }, 8, ["padding"]));
  }
}, J = /* @__PURE__ */ q(F, [["__scopeId", "data-v-c348b43b"]]);
export {
  J as T,
  q as _
};
