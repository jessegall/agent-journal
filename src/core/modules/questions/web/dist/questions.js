/* @code-commandments-generated */
if (!document.getElementById("window-styles-178eb76aafed")) { const style = document.createElement("style"); style.id = "window-styles-178eb76aafed"; style.textContent = ".question-dock[data-v-3f6f88a1]{display:flex;gap:8px;font-size:12px;line-height:1.45}.question-dock-state[data-v-3f6f88a1]{color:var(--text-4)}.question-open[data-v-70feb67d]{padding:0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.question[data-v-70feb67d]{display:flex;flex:1;flex-direction:column;gap:6px}.question-text[data-v-70feb67d]{margin:0}.question-choices[data-v-70feb67d],.question-form[data-v-70feb67d]{display:flex;flex-wrap:wrap;gap:6px}.question-answer[data-v-70feb67d]{flex:1;min-width:120px}.question-choice.recommended[data-v-70feb67d]{font-weight:600}.question-failure[data-v-70feb67d]{margin:6px 8px 0;color:var(--text-2)}.question-closed[data-v-70feb67d]{margin:2px 0 0;color:var(--text-3);font-size:12px}.waiting-heading[data-v-2998b0fd]{margin:0 8px 6px;font-size:12px;font-weight:600;color:var(--text-2)}.label[data-v-2998b0fd]{flex:1}.detail[data-v-2998b0fd]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as f, openBlock as a, createElementBlock as u, createVNode as q, unref as i, withCtx as S, createElementVNode as n, toDisplayString as l, createCommentVNode as r, Fragment as v, renderList as w, normalizeClass as L, withModifiers as R, withDirectives as V, vModelText as g } from "vue";
import { useRows as N, useListTools as T, ListTools as A, RowList as B, peekRef as D } from "@journal/window-kit";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const F = { class: "questions" }, M = ["data-state"], Q = { class: "question-text" }, U = ["data-question-open", "onClick"], z = {
  key: 0,
  class: "question-closed"
}, I = { class: "question-choices" }, O = ["onClick"], j = ["onSubmit"], G = ["onUpdate:modelValue"], H = ["onClick"], J = ["onClick"], K = {
  key: 0,
  class: "question-failure"
}, P = {
  __name: "QuestionRows",
  setup(W) {
    const { rows: k, failure: y, loaded: C, load: b, context: x } = N("question list", ["question.*"]), _ = T(k, { title: (t) => t.text, isOpen: (t) => t.state === "open" }), c = f({}), d = f("");
    async function p(t) {
      const s = await x.run(t);
      d.value = s.ok ? "" : s.error, b();
    }
    function m(t, s) {
      return p(["question", "answer", String(t.id), "--answer", s]);
    }
    function h(t) {
      const s = (c.value[t.id] || "").trim();
      s && m(t, s).then(() => c.value[t.id] = "");
    }
    function $(t, s) {
      return s === t.recommended ? `${s} (recommended)` : s;
    }
    return (t, s) => (a(), u("div", F, [
      q(i(A), {
        tools: i(_),
        placeholder: "Search the questions"
      }, null, 8, ["tools"]),
      q(i(B), {
        rows: i(_).shown.value,
        failure: i(y),
        loaded: i(C),
        empty: "No open questions"
      }, {
        default: S(({ row: e }) => [
          n("div", {
            class: "question",
            "data-state": e.state
          }, [
            n("p", Q, [
              n("button", {
                type: "button",
                class: "question-open",
                "data-question-open": e.id,
                onClick: (o) => i(D)(`questions:${e.id}`)
              }, l(e.text), 9, U)
            ]),
            e.state !== "open" ? (a(), u("p", z, l(e.state === "answered" ? `Answered: ${e.answer}` : "Closed"), 1)) : r("", !0),
            e.state === "open" ? (a(), u(v, { key: 1 }, [
              n("div", I, [
                (a(!0), u(v, null, w(e.options, (o) => (a(), u("button", {
                  key: o,
                  type: "button",
                  class: L(["question-choice", { recommended: o === e.recommended }]),
                  onClick: (X) => m(e, o)
                }, l($(e, o)), 11, O))), 128))
              ]),
              n("form", {
                class: "question-form",
                onSubmit: R((o) => h(e), ["prevent"])
              }, [
                V(n("input", {
                  "onUpdate:modelValue": (o) => c.value[e.id] = o,
                  class: "question-answer",
                  placeholder: "Answer in your own words"
                }, null, 8, G), [
                  [g, c.value[e.id]]
                ]),
                n("button", {
                  type: "button",
                  class: "question-send",
                  onClick: (o) => h(e)
                }, "Answer", 8, H),
                n("button", {
                  type: "button",
                  class: "question-close",
                  onClick: (o) => p(["question", "close", String(e.id)])
                }, "Close", 8, J)
              ], 40, j)
            ], 64)) : r("", !0)
          ], 8, M)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"]),
      d.value ? (a(), u("p", K, l(d.value), 1)) : r("", !0)
    ]));
  }
}, te = /* @__PURE__ */ E(P, [["__scopeId", "data-v-70feb67d"]]);
export {
  te as default
};
