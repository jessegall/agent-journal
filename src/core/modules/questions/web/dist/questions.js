/* @code-commandments-generated */
if (!document.getElementById("window-styles-5d5ca77f50c4")) { const style = document.createElement("style"); style.id = "window-styles-5d5ca77f50c4"; style.textContent = ".question-dock[data-v-3f6f88a1]{display:flex;gap:8px;font-size:12px;line-height:1.45}.question-dock-state[data-v-3f6f88a1]{color:var(--text-4)}.question[data-v-ef7ac5e5]{display:flex;flex:1;flex-direction:column;gap:6px}.question-text[data-v-ef7ac5e5]{margin:0}.question-choices[data-v-ef7ac5e5],.question-form[data-v-ef7ac5e5]{display:flex;flex-wrap:wrap;gap:6px}.question-answer[data-v-ef7ac5e5]{flex:1;min-width:120px}.question-choice.recommended[data-v-ef7ac5e5]{font-weight:600}.question-failure[data-v-ef7ac5e5]{margin:6px 8px 0;color:var(--text-2)}.waiting-heading[data-v-51430256]{margin:0 8px 6px;font-size:12px;font-weight:600;color:var(--text-2)}.label[data-v-51430256]{flex:1}.detail[data-v-51430256]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as f, openBlock as c, createElementBlock as u, createVNode as C, unref as l, withCtx as b, createElementVNode as o, toDisplayString as r, Fragment as x, renderList as w, normalizeClass as S, withModifiers as V, withDirectives as $, vModelText as g, createCommentVNode as N } from "vue";
import { useRows as R, RowList as L } from "@journal/window-kit";
import { _ as A } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const B = { class: "questions" }, D = { class: "question" }, E = { class: "question-text" }, F = { class: "question-choices" }, M = ["onClick"], Q = ["onSubmit"], T = ["onUpdate:modelValue"], U = ["onClick"], z = ["onClick"], I = {
  key: 0,
  class: "question-failure"
}, j = {
  __name: "QuestionRows",
  setup(G) {
    const { rows: p, failure: h, loaded: v, load: q, context: k } = R("question list", ["question.*"]), i = f({}), a = f("");
    async function d(t) {
      const e = await k.run(t);
      a.value = e.ok ? "" : e.error, q();
    }
    function _(t, e) {
      return d(["question", "answer", String(t.id), "--answer", e]);
    }
    function m(t) {
      const e = (i.value[t.id] || "").trim();
      e && _(t, e).then(() => i.value[t.id] = "");
    }
    function y(t, e) {
      return e === t.recommended ? `${e} (recommended)` : e;
    }
    return (t, e) => (c(), u("div", B, [
      C(l(L), {
        rows: l(p),
        failure: l(h),
        loaded: l(v),
        empty: "No open questions"
      }, {
        default: b(({ row: s }) => [
          o("div", D, [
            o("p", E, r(s.text), 1),
            o("div", F, [
              (c(!0), u(x, null, w(s.options, (n) => (c(), u("button", {
                key: n,
                type: "button",
                class: S(["question-choice", { recommended: n === s.recommended }]),
                onClick: (H) => _(s, n)
              }, r(y(s, n)), 11, M))), 128))
            ]),
            o("form", {
              class: "question-form",
              onSubmit: V((n) => m(s), ["prevent"])
            }, [
              $(o("input", {
                "onUpdate:modelValue": (n) => i.value[s.id] = n,
                class: "question-answer",
                placeholder: "Answer in your own words"
              }, null, 8, T), [
                [g, i.value[s.id]]
              ]),
              o("button", {
                type: "button",
                class: "question-send",
                onClick: (n) => m(s)
              }, "Answer", 8, U),
              o("button", {
                type: "button",
                class: "question-close",
                onClick: (n) => d(["question", "close", String(s.id)])
              }, "Close", 8, z)
            ], 40, Q)
          ])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"]),
      a.value ? (c(), u("p", I, r(a.value), 1)) : N("", !0)
    ]));
  }
}, P = /* @__PURE__ */ A(j, [["__scopeId", "data-v-ef7ac5e5"]]);
export {
  P as default
};
