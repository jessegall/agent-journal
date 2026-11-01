/* @code-commandments-generated */
if (!document.getElementById("window-styles-cbbb49e7b688")) { const style = document.createElement("style"); style.id = "window-styles-cbbb49e7b688"; style.textContent = ".question-dock[data-v-3f6f88a1]{display:flex;gap:8px;font-size:12px;line-height:1.45}.question-dock-state[data-v-3f6f88a1]{color:var(--text-4)}.question[data-v-9236b95c]{display:flex;flex:1;flex-direction:column;gap:6px}.question-text[data-v-9236b95c]{margin:0}.question-choices[data-v-9236b95c],.question-form[data-v-9236b95c]{display:flex;flex-wrap:wrap;gap:6px}.question-answer[data-v-9236b95c]{flex:1;min-width:120px}.question-choice.recommended[data-v-9236b95c]{font-weight:600}.question-failure[data-v-9236b95c]{margin:6px 8px 0;color:var(--text-2)}.question-closed[data-v-9236b95c]{margin:2px 0 0;color:var(--text-3);font-size:12px}.waiting-heading[data-v-2998b0fd]{margin:0 8px 6px;font-size:12px;font-weight:600;color:var(--text-2)}.label[data-v-2998b0fd]{flex:1}.detail[data-v-2998b0fd]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as f, openBlock as i, createElementBlock as a, createVNode as v, unref as c, withCtx as S, createElementVNode as n, toDisplayString as u, createCommentVNode as r, Fragment as q, renderList as $, normalizeClass as L, withModifiers as V, withDirectives as g, vModelText as N } from "vue";
import { useRows as R, useListTools as T, ListTools as A, RowList as B } from "@journal/window-kit";
import { _ as D } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const E = { class: "questions" }, F = ["data-state"], M = { class: "question-text" }, Q = {
  key: 0,
  class: "question-closed"
}, U = { class: "question-choices" }, z = ["onClick"], I = ["onSubmit"], O = ["onUpdate:modelValue"], j = ["onClick"], G = ["onClick"], H = {
  key: 0,
  class: "question-failure"
}, J = {
  __name: "QuestionRows",
  setup(K) {
    const { rows: k, failure: y, loaded: C, load: b, context: x } = R("question list", ["question.*"]), _ = T(k, { title: (t) => t.text, isOpen: (t) => t.state === "open" }), l = f({}), d = f("");
    async function m(t) {
      const s = await x.run(t);
      d.value = s.ok ? "" : s.error, b();
    }
    function p(t, s) {
      return m(["question", "answer", String(t.id), "--answer", s]);
    }
    function h(t) {
      const s = (l.value[t.id] || "").trim();
      s && p(t, s).then(() => l.value[t.id] = "");
    }
    function w(t, s) {
      return s === t.recommended ? `${s} (recommended)` : s;
    }
    return (t, s) => (i(), a("div", E, [
      v(c(A), {
        tools: c(_),
        placeholder: "Search the questions"
      }, null, 8, ["tools"]),
      v(c(B), {
        rows: c(_).shown.value,
        failure: c(y),
        loaded: c(C),
        empty: "No open questions"
      }, {
        default: S(({ row: e }) => [
          n("div", {
            class: "question",
            "data-state": e.state
          }, [
            n("p", M, u(e.text), 1),
            e.state !== "open" ? (i(), a("p", Q, u(e.state === "answered" ? `Answered: ${e.answer}` : "Closed"), 1)) : r("", !0),
            e.state === "open" ? (i(), a(q, { key: 1 }, [
              n("div", U, [
                (i(!0), a(q, null, $(e.options, (o) => (i(), a("button", {
                  key: o,
                  type: "button",
                  class: L(["question-choice", { recommended: o === e.recommended }]),
                  onClick: (P) => p(e, o)
                }, u(w(e, o)), 11, z))), 128))
              ]),
              n("form", {
                class: "question-form",
                onSubmit: V((o) => h(e), ["prevent"])
              }, [
                g(n("input", {
                  "onUpdate:modelValue": (o) => l.value[e.id] = o,
                  class: "question-answer",
                  placeholder: "Answer in your own words"
                }, null, 8, O), [
                  [N, l.value[e.id]]
                ]),
                n("button", {
                  type: "button",
                  class: "question-send",
                  onClick: (o) => h(e)
                }, "Answer", 8, j),
                n("button", {
                  type: "button",
                  class: "question-close",
                  onClick: (o) => m(["question", "close", String(e.id)])
                }, "Close", 8, G)
              ], 40, I)
            ], 64)) : r("", !0)
          ], 8, F)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"]),
      d.value ? (i(), a("p", H, u(d.value), 1)) : r("", !0)
    ]));
  }
}, Z = /* @__PURE__ */ D(J, [["__scopeId", "data-v-9236b95c"]]);
export {
  Z as default
};
