/* @code-commandments-generated */
if (!document.getElementById("window-styles-a7d921871842")) { const style = document.createElement("style"); style.id = "window-styles-a7d921871842"; style.textContent = ".chat[data-v-495f55e0]{display:flex;flex-direction:column;gap:12px;height:100%;min-height:0}.history[data-v-495f55e0]{flex:1;min-height:0;overflow-y:auto}.from[data-v-495f55e0]{min-width:56px;color:var(--text-3);font-size:12px}.text[data-v-495f55e0]{white-space:pre-wrap}.composer[data-v-495f55e0]{display:flex;gap:8px}.composer-input[data-v-495f55e0]{flex:1;min-width:0;padding:6px 10px;border:1px solid var(--line);border-radius:6px;color:var(--text);background:transparent}.composer-failure[data-v-495f55e0]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as h, onMounted as C, ref as w, openBlock as n, createElementBlock as k, createVNode as p, unref as s, withCtx as y, createBlock as N, Fragment as V, createElementVNode as c, toDisplayString as f, withModifiers as B, withDirectives as S, vModelText as b, createTextVNode as E, createCommentVNode as F } from "vue";
import { useRows as _, shownMarks as R, markDeclaration as T, interleaved as H, fetchMarkDeclarations as I, fetchDockDeclarations as L, DockStack as O, RowList as P, MarkHost as U, Btn as W } from "@journal/window-kit";
const j = (i, m) => {
  const a = i.__vccOpts || i;
  for (const [u, r] of m)
    a[u] = r;
  return a;
}, q = { class: "chat" }, z = { class: "from" }, A = { class: "text" }, G = {
  key: 0,
  class: "composer-failure"
}, J = {
  __name: "Chat",
  setup(i) {
    const { rows: m, failure: a, load: u, context: r } = _("message list", ["message.*"]), { rows: x } = _("chat-mark list", ["chat_mark.*"]), { rows: g } = _("dock-item list", ["dock_item.*"]), D = h(() => R(x.value, T, (e) => r.option(e).value)), M = h(() => H(m.value, D.value));
    C(() => Promise.all([I(), L()]));
    const o = w(""), d = w("");
    async function v() {
      const e = await r.run(["message", "send", o.value]);
      d.value = e.ok ? "" : e.error, e.ok && (o.value = ""), u();
    }
    return (e, l) => (n(), k("div", q, [
      p(s(O), { items: s(g) }, null, 8, ["items"]),
      p(s(P), {
        class: "history",
        rows: M.value,
        failure: s(a),
        empty: "No messages yet"
      }, {
        default: y(({ row: t }) => [
          t.kind === "mark" ? (n(), N(s(U), {
            key: 0,
            mark: t.row
          }, null, 8, ["mark"])) : (n(), k(V, { key: 1 }, [
            c("span", z, f(t.row.type), 1),
            c("span", A, f(t.row.text), 1)
          ], 64))
        ]),
        _: 1
      }, 8, ["rows", "failure"]),
      c("form", {
        class: "composer",
        onSubmit: B(v, ["prevent"])
      }, [
        S(c("input", {
          "onUpdate:modelValue": l[0] || (l[0] = (t) => o.value = t),
          class: "composer-input",
          placeholder: "Write a message"
        }, null, 512), [
          [b, o.value]
        ]),
        p(s(W), {
          kind: "primary",
          disabled: !o.value.trim(),
          onClick: v
        }, {
          default: y(() => [...l[1] || (l[1] = [
            E("Send", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32),
      d.value ? (n(), k("p", G, f(d.value), 1)) : F("", !0)
    ]));
  }
}, X = /* @__PURE__ */ j(J, [["__scopeId", "data-v-495f55e0"]]);
export {
  X as default
};
