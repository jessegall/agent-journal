if (!document.getElementById("window-styles-c54973c936db")) { const style = document.createElement("style"); style.id = "window-styles-c54973c936db"; style.textContent = ".chat[data-v-e61328ed]{display:flex;flex-direction:column;gap:12px}.from[data-v-e61328ed]{min-width:56px;color:var(--text-3);font-size:12px}.text[data-v-e61328ed]{white-space:pre-wrap}.composer[data-v-e61328ed]{display:flex;gap:8px}.composer-input[data-v-e61328ed]{flex:1;min-width:0;padding:6px 10px;border:1px solid var(--line);border-radius:6px;color:var(--text);background:transparent}.composer-failure[data-v-e61328ed]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as _, openBlock as f, createElementBlock as v, createVNode as x, unref as r, withCtx as h, createElementVNode as n, toDisplayString as m, withModifiers as k, withDirectives as w, vModelText as y, createTextVNode as g, createCommentVNode as C } from "vue";
import { useRows as N, RowList as V, Btn as b } from "@journal/window-kit";
const B = (l, i) => {
  const t = l.__vccOpts || l;
  for (const [c, u] of i)
    t[c] = u;
  return t;
}, S = { class: "chat" }, D = { class: "from" }, E = { class: "text" }, M = {
  key: 0,
  class: "composer-failure"
}, R = {
  __name: "Chat",
  setup(l) {
    const { rows: i, failure: t, load: c, context: u } = N("message list", ["message.*"]), e = _(""), d = _("");
    async function p() {
      const s = await u.run(["message", "send", e.value]);
      d.value = s.ok ? "" : s.error, s.ok && (e.value = ""), c();
    }
    return (s, o) => (f(), v("div", S, [
      x(r(V), {
        rows: r(i),
        failure: r(t),
        empty: "No messages yet"
      }, {
        default: h(({ row: a }) => [
          n("span", D, m(a.type), 1),
          n("span", E, m(a.text), 1)
        ]),
        _: 1
      }, 8, ["rows", "failure"]),
      n("form", {
        class: "composer",
        onSubmit: k(p, ["prevent"])
      }, [
        w(n("input", {
          "onUpdate:modelValue": o[0] || (o[0] = (a) => e.value = a),
          class: "composer-input",
          placeholder: "Write a message"
        }, null, 512), [
          [y, e.value]
        ]),
        x(r(b), {
          kind: "primary",
          disabled: !e.value.trim(),
          onClick: p
        }, {
          default: h(() => [...o[1] || (o[1] = [
            g("Send", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32),
      d.value ? (f(), v("p", M, m(d.value), 1)) : C("", !0)
    ]));
  }
}, I = /* @__PURE__ */ B(R, [["__scopeId", "data-v-e61328ed"]]);
export {
  I as default
};
