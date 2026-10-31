/* @code-commandments-generated */
if (!document.getElementById("window-styles-0027ae573cee")) { const style = document.createElement("style"); style.id = "window-styles-0027ae573cee"; style.textContent = ".chat[data-v-0b08c47f]{display:flex;flex-direction:column;gap:12px;height:100%;min-height:0}.history[data-v-0b08c47f]{flex:1;min-height:0;overflow-y:auto}.composer[data-v-0b08c47f]{display:flex;gap:8px}.composer-input[data-v-0b08c47f]{flex:1;min-width:0;padding:6px 10px;border:1px solid var(--line);border-radius:6px;color:var(--text);background:transparent}.composer-failure[data-v-0b08c47f]{margin:0;color:var(--text-2)}.history[data-v-0b08c47f] .row-list-row{padding:1px 8px}.history[data-v-0b08c47f] .mark.w-event{color:var(--text-3)}\n"; document.head.appendChild(style); }
import { computed as v, onMounted as N, ref as _, openBlock as l, createElementBlock as w, createVNode as m, unref as e, withCtx as h, createBlock as g, createElementVNode as y, withModifiers as V, withDirectives as b, vModelText as B, createTextVNode as S, toDisplayString as E, createCommentVNode as R } from "vue";
import { useRows as k, shownMarks as T, markDeclaration as F, interleaved as H, fetchMarkDeclarations as I, fetchDockDeclarations as L, DockStack as O, RowList as P, MarkHost as U, MessageCard as W, Btn as j } from "@journal/window-kit";
const q = (n, c) => {
  const o = n.__vccOpts || n;
  for (const [i, d] of c)
    o[i] = d;
  return o;
}, z = { class: "chat" }, A = {
  key: 0,
  class: "composer-failure"
}, G = {
  __name: "Chat",
  setup(n) {
    const { rows: c, failure: o, loaded: i, load: d, context: p } = k("message list", ["message.*"]), { rows: x } = k("chat-mark list", ["chat_mark.*"]), { rows: M } = k("dock-item list", ["dock_item.*"]), D = v(() => T(x.value, F, (t) => p.option(t).value)), C = v(() => H(c.value, D.value));
    N(() => Promise.all([I(), L()]));
    const s = _(""), u = _("");
    async function f() {
      const t = await p.run(["message", "send", s.value]);
      u.value = t.ok ? "" : t.error, t.ok && (s.value = ""), d();
    }
    return (t, r) => (l(), w("div", z, [
      m(e(O), { items: e(M) }, null, 8, ["items"]),
      m(e(P), {
        class: "history",
        rows: C.value,
        failure: e(o),
        loaded: e(i),
        empty: "No messages yet"
      }, {
        default: h(({ row: a }) => [
          a.kind === "mark" ? (l(), g(e(U), {
            key: 0,
            mark: a.row
          }, null, 8, ["mark"])) : (l(), g(e(W), {
            key: 1,
            message: a.row
          }, null, 8, ["message"]))
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"]),
      y("form", {
        class: "composer",
        onSubmit: V(f, ["prevent"])
      }, [
        b(y("input", {
          "onUpdate:modelValue": r[0] || (r[0] = (a) => s.value = a),
          class: "composer-input",
          placeholder: "Write a message"
        }, null, 512), [
          [B, s.value]
        ]),
        m(e(j), {
          kind: "primary",
          disabled: !s.value.trim(),
          onClick: f
        }, {
          default: h(() => [...r[1] || (r[1] = [
            S("Send", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32),
      u.value ? (l(), w("p", A, E(u.value), 1)) : R("", !0)
    ]));
  }
}, Q = /* @__PURE__ */ q(G, [["__scopeId", "data-v-0b08c47f"]]);
export {
  Q as default
};
