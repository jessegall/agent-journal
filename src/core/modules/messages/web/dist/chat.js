/* @code-commandments-generated */
if (!document.getElementById("window-styles-bd58917470d5")) { const style = document.createElement("style"); style.id = "window-styles-bd58917470d5"; style.textContent = ".chat[data-v-f814d43f]{display:flex;flex-direction:column;gap:12px}.from[data-v-f814d43f]{min-width:56px;color:var(--text-3);font-size:12px}.text[data-v-f814d43f]{white-space:pre-wrap}.composer[data-v-f814d43f]{display:flex;gap:8px}.composer-input[data-v-f814d43f]{flex:1;min-width:0;padding:6px 10px;border:1px solid var(--line);border-radius:6px;color:var(--text);background:transparent}.composer-failure[data-v-f814d43f]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as f, openBlock as _, createElementBlock as v, createVNode as x, unref as r, withCtx as h, createElementVNode as n, toDisplayString as m, withModifiers as k, withDirectives as w, vModelText as y, createTextVNode as g, createCommentVNode as C } from "vue";
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
    const { rows: i, failure: t, load: c, context: u } = N("message list", ["message.*"]), e = f(""), d = f("");
    async function p() {
      const s = await u.run(["message", "send", e.value]);
      d.value = s.ok ? "" : s.error, s.ok && (e.value = ""), c();
    }
    return (s, o) => (_(), v("div", S, [
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
      d.value ? (_(), v("p", M, m(d.value), 1)) : C("", !0)
    ]));
  }
}, I = /* @__PURE__ */ B(R, [["__scopeId", "data-v-f814d43f"]]);
export {
  I as default
};
