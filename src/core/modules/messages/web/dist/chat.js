/* @code-commandments-generated */
if (!document.getElementById("window-styles-252c38ebd808")) { const style = document.createElement("style"); style.id = "window-styles-252c38ebd808"; style.textContent = ".chat[data-v-72dde1a0]{display:flex;flex-direction:column;gap:12px;height:100%;min-height:0}.history[data-v-72dde1a0]{flex:1;min-height:0;overflow-y:auto}.from[data-v-72dde1a0]{min-width:56px;color:var(--text-3);font-size:12px}.text[data-v-72dde1a0]{white-space:pre-wrap}.composer[data-v-72dde1a0]{display:flex;gap:8px}.composer-input[data-v-72dde1a0]{flex:1;min-width:0;padding:6px 10px;border:1px solid var(--line);border-radius:6px;color:var(--text);background:transparent}.composer-failure[data-v-72dde1a0]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as w, onMounted as N, ref as y, openBlock as l, createElementBlock as k, createVNode as p, unref as e, withCtx as x, createBlock as V, Fragment as B, createElementVNode as n, toDisplayString as _, withModifiers as S, withDirectives as b, vModelText as E, createTextVNode as F, createCommentVNode as R } from "vue";
import { useRows as f, shownMarks as T, markDeclaration as H, interleaved as I, fetchMarkDeclarations as L, fetchDockDeclarations as O, DockStack as P, RowList as U, MarkHost as W, Btn as j } from "@journal/window-kit";
const q = (c, i) => {
  const a = c.__vccOpts || c;
  for (const [d, m] of i)
    a[d] = m;
  return a;
}, z = { class: "chat" }, A = { class: "from" }, G = { class: "text" }, J = {
  key: 0,
  class: "composer-failure"
}, K = {
  __name: "Chat",
  setup(c) {
    const { rows: i, failure: a, loaded: d, load: m, context: v } = f("message list", ["message.*"]), { rows: g } = f("chat-mark list", ["chat_mark.*"]), { rows: D } = f("dock-item list", ["dock_item.*"]), M = w(() => T(g.value, H, (t) => v.option(t).value)), C = w(() => I(i.value, M.value));
    N(() => Promise.all([L(), O()]));
    const o = y(""), u = y("");
    async function h() {
      const t = await v.run(["message", "send", o.value]);
      u.value = t.ok ? "" : t.error, t.ok && (o.value = ""), m();
    }
    return (t, r) => (l(), k("div", z, [
      p(e(P), { items: e(D) }, null, 8, ["items"]),
      p(e(U), {
        class: "history",
        rows: C.value,
        failure: e(a),
        loaded: e(d),
        empty: "No messages yet"
      }, {
        default: x(({ row: s }) => [
          s.kind === "mark" ? (l(), V(e(W), {
            key: 0,
            mark: s.row
          }, null, 8, ["mark"])) : (l(), k(B, { key: 1 }, [
            n("span", A, _(s.row.type), 1),
            n("span", G, _(s.row.text), 1)
          ], 64))
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"]),
      n("form", {
        class: "composer",
        onSubmit: S(h, ["prevent"])
      }, [
        b(n("input", {
          "onUpdate:modelValue": r[0] || (r[0] = (s) => o.value = s),
          class: "composer-input",
          placeholder: "Write a message"
        }, null, 512), [
          [E, o.value]
        ]),
        p(e(j), {
          kind: "primary",
          disabled: !o.value.trim(),
          onClick: h
        }, {
          default: x(() => [...r[1] || (r[1] = [
            F("Send", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32),
      u.value ? (l(), k("p", J, _(u.value), 1)) : R("", !0)
    ]));
  }
}, Y = /* @__PURE__ */ q(K, [["__scopeId", "data-v-72dde1a0"]]);
export {
  Y as default
};
