/* @code-commandments-generated */
if (!document.getElementById("window-styles-782eb0fe2d73")) { const style = document.createElement("style"); style.id = "window-styles-782eb0fe2d73"; style.textContent = ".question-dock[data-v-3f6f88a1]{display:flex;gap:8px;font-size:12px;line-height:1.45}.question-dock-state[data-v-3f6f88a1]{color:var(--text-4)}.question[data-v-83676570]{display:flex;flex:1;flex-direction:column;gap:6px}.question-text[data-v-83676570]{margin:0}.question-choices[data-v-83676570],.question-form[data-v-83676570]{display:flex;flex-wrap:wrap;gap:6px}.question-answer[data-v-83676570]{flex:1;min-width:120px}.question-choice.recommended[data-v-83676570]{font-weight:600}.question-failure[data-v-83676570]{margin:6px 8px 0;color:var(--text-2)}.question-closed[data-v-83676570]{margin:2px 0 0;color:var(--text-3);font-size:12px}.waiting-heading[data-v-51430256]{margin:0 8px 6px;font-size:12px;font-weight:600;color:var(--text-2)}.label[data-v-51430256]{flex:1}.detail[data-v-51430256]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as f, openBlock as i, createElementBlock as a, createVNode as x, unref as u, withCtx as w, createElementVNode as o, toDisplayString as d, createCommentVNode as r, Fragment as h, renderList as $, normalizeClass as S, withModifiers as V, withDirectives as g, vModelText as N } from "vue";
import { useRows as R, RowList as A } from "@journal/window-kit";
import { _ as L } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const B = { class: "questions" }, D = ["data-state"], E = { class: "question-text" }, F = {
  key: 0,
  class: "question-closed"
}, M = { class: "question-choices" }, Q = ["onClick"], T = ["onSubmit"], U = ["onUpdate:modelValue"], z = ["onClick"], I = ["onClick"], j = {
  key: 0,
  class: "question-failure"
}, G = {
  __name: "QuestionRows",
  setup(H) {
    const { rows: v, failure: q, loaded: k, load: y, context: C } = R("question list", ["question.*"]), c = f({}), l = f("");
    async function _(s) {
      const t = await C.run(s);
      l.value = t.ok ? "" : t.error, y();
    }
    function m(s, t) {
      return _(["question", "answer", String(s.id), "--answer", t]);
    }
    function p(s) {
      const t = (c.value[s.id] || "").trim();
      t && m(s, t).then(() => c.value[s.id] = "");
    }
    function b(s, t) {
      return t === s.recommended ? `${t} (recommended)` : t;
    }
    return (s, t) => (i(), a("div", B, [
      x(u(A), {
        rows: u(v),
        failure: u(q),
        loaded: u(k),
        empty: "No open questions"
      }, {
        default: w(({ row: e }) => [
          o("div", {
            class: "question",
            "data-state": e.state
          }, [
            o("p", E, d(e.text), 1),
            e.state !== "open" ? (i(), a("p", F, d(e.state === "answered" ? `Answered: ${e.answer}` : "Closed"), 1)) : r("", !0),
            e.state === "open" ? (i(), a(h, { key: 1 }, [
              o("div", M, [
                (i(!0), a(h, null, $(e.options, (n) => (i(), a("button", {
                  key: n,
                  type: "button",
                  class: S(["question-choice", { recommended: n === e.recommended }]),
                  onClick: (J) => m(e, n)
                }, d(b(e, n)), 11, Q))), 128))
              ]),
              o("form", {
                class: "question-form",
                onSubmit: V((n) => p(e), ["prevent"])
              }, [
                g(o("input", {
                  "onUpdate:modelValue": (n) => c.value[e.id] = n,
                  class: "question-answer",
                  placeholder: "Answer in your own words"
                }, null, 8, U), [
                  [N, c.value[e.id]]
                ]),
                o("button", {
                  type: "button",
                  class: "question-send",
                  onClick: (n) => p(e)
                }, "Answer", 8, z),
                o("button", {
                  type: "button",
                  class: "question-close",
                  onClick: (n) => _(["question", "close", String(e.id)])
                }, "Close", 8, I)
              ], 40, T)
            ], 64)) : r("", !0)
          ], 8, D)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"]),
      l.value ? (i(), a("p", j, d(l.value), 1)) : r("", !0)
    ]));
  }
}, W = /* @__PURE__ */ L(G, [["__scopeId", "data-v-83676570"]]);
export {
  W as default
};
