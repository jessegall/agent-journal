/* @code-commandments-generated */
if (!document.getElementById("window-styles-e896026f7242")) { const style = document.createElement("style"); style.id = "window-styles-e896026f7242"; style.textContent = ".question-dock[data-v-3f6f88a1]{display:flex;gap:8px;font-size:12px;line-height:1.45}.question-dock-state[data-v-3f6f88a1]{color:var(--text-4)}.question[data-v-15a029b2]{display:flex;flex:1;flex-direction:column;gap:6px}.question-text[data-v-15a029b2]{margin:0}.question-choices[data-v-15a029b2],.question-form[data-v-15a029b2]{display:flex;flex-wrap:wrap;gap:6px}.question-answer[data-v-15a029b2]{flex:1;min-width:120px}.question-choice.recommended[data-v-15a029b2]{font-weight:600}.question-failure[data-v-15a029b2]{margin:6px 8px 0;color:var(--text-2)}.waiting-heading[data-v-64e19510]{margin:0 8px 6px;font-size:12px;font-weight:600;color:var(--text-2)}.label[data-v-64e19510]{flex:1}.detail[data-v-64e19510]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as f, openBlock as c, createElementBlock as u, createVNode as y, unref as l, withCtx as b, createElementVNode as o, toDisplayString as a, Fragment as C, renderList as x, normalizeClass as w, withModifiers as S, withDirectives as V, vModelText as $, createCommentVNode as g } from "vue";
import { useRows as N, RowList as R } from "@journal/window-kit";
import { _ as L } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const A = { class: "questions" }, B = { class: "question" }, D = { class: "question-text" }, E = { class: "question-choices" }, F = ["onClick"], M = ["onSubmit"], Q = ["onUpdate:modelValue"], T = ["onClick"], U = ["onClick"], z = {
  key: 0,
  class: "question-failure"
}, I = {
  __name: "QuestionRows",
  setup(j) {
    const { rows: p, failure: h, load: v, context: q } = N("question list", ["question.*"]), i = f({}), r = f("");
    async function d(t) {
      const e = await q.run(t);
      r.value = e.ok ? "" : e.error, v();
    }
    function _(t, e) {
      return d(["question", "answer", String(t.id), "--answer", e]);
    }
    function m(t) {
      const e = (i.value[t.id] || "").trim();
      e && _(t, e).then(() => i.value[t.id] = "");
    }
    function k(t, e) {
      return e === t.recommended ? `${e} (recommended)` : e;
    }
    return (t, e) => (c(), u("div", A, [
      y(l(R), {
        rows: l(p),
        failure: l(h),
        empty: "No open questions"
      }, {
        default: b(({ row: s }) => [
          o("div", B, [
            o("p", D, a(s.text), 1),
            o("div", E, [
              (c(!0), u(C, null, x(s.options, (n) => (c(), u("button", {
                key: n,
                type: "button",
                class: w(["question-choice", { recommended: n === s.recommended }]),
                onClick: (G) => _(s, n)
              }, a(k(s, n)), 11, F))), 128))
            ]),
            o("form", {
              class: "question-form",
              onSubmit: S((n) => m(s), ["prevent"])
            }, [
              V(o("input", {
                "onUpdate:modelValue": (n) => i.value[s.id] = n,
                class: "question-answer",
                placeholder: "Answer in your own words"
              }, null, 8, Q), [
                [$, i.value[s.id]]
              ]),
              o("button", {
                type: "button",
                class: "question-send",
                onClick: (n) => m(s)
              }, "Answer", 8, T),
              o("button", {
                type: "button",
                class: "question-close",
                onClick: (n) => d(["question", "close", String(s.id)])
              }, "Close", 8, U)
            ], 40, M)
          ])
        ]),
        _: 1
      }, 8, ["rows", "failure"]),
      r.value ? (c(), u("p", z, a(r.value), 1)) : g("", !0)
    ]));
  }
}, O = /* @__PURE__ */ L(I, [["__scopeId", "data-v-15a029b2"]]);
export {
  O as default
};
