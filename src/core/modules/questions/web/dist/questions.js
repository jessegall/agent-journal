/* @code-commandments-generated */
if (!document.getElementById("window-styles-acdf7891cfd1")) { const style = document.createElement("style"); style.id = "window-styles-acdf7891cfd1"; style.textContent = ".question-dock[data-v-3f6f88a1]{display:flex;gap:8px;font-size:12px;line-height:1.45}.question-dock-state[data-v-3f6f88a1]{color:var(--text-4)}.question[data-v-02837976]{display:flex;flex:1;flex-direction:column;gap:6px}.question-text[data-v-02837976]{margin:0}.question-choices[data-v-02837976],.question-form[data-v-02837976]{display:flex;flex-wrap:wrap;gap:6px}.question-answer[data-v-02837976]{flex:1;min-width:120px}.question-choice.recommended[data-v-02837976]{font-weight:600}.question-failure[data-v-02837976]{margin:6px 8px 0;color:var(--text-2)}.question-closed[data-v-02837976]{margin:2px 0 0;color:var(--text-3);font-size:12px}.waiting-heading[data-v-51430256]{margin:0 8px 6px;font-size:12px;font-weight:600;color:var(--text-2)}.label[data-v-51430256]{flex:1}.detail[data-v-51430256]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as f, openBlock as o, createElementBlock as i, createVNode as b, unref as u, withCtx as x, createElementVNode as a, toDisplayString as d, createCommentVNode as l, Fragment as $, renderList as w, normalizeClass as S, withModifiers as V, withDirectives as g, vModelText as N } from "vue";
import { useRows as R, RowList as A } from "@journal/window-kit";
import { _ as L } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const B = { class: "questions" }, D = ["data-state"], E = { class: "question-text" }, F = {
  key: 0,
  class: "question-closed"
}, M = {
  key: 1,
  class: "question-choices"
}, Q = ["onClick"], T = ["onSubmit"], U = ["onUpdate:modelValue"], z = ["onClick"], I = ["onClick"], j = {
  key: 0,
  class: "question-failure"
}, G = {
  __name: "QuestionRows",
  setup(H) {
    const { rows: h, failure: v, loaded: q, load: k, context: y } = R("question list", ["question.*"]), c = f({}), r = f("");
    async function _(s) {
      const t = await y.run(s);
      r.value = t.ok ? "" : t.error, k();
    }
    function m(s, t) {
      return _(["question", "answer", String(s.id), "--answer", t]);
    }
    function p(s) {
      const t = (c.value[s.id] || "").trim();
      t && m(s, t).then(() => c.value[s.id] = "");
    }
    function C(s, t) {
      return t === s.recommended ? `${t} (recommended)` : t;
    }
    return (s, t) => (o(), i("div", B, [
      b(u(A), {
        rows: u(h),
        failure: u(v),
        loaded: u(q),
        empty: "No open questions"
      }, {
        default: x(({ row: e }) => [
          a("div", {
            class: "question",
            "data-state": e.state
          }, [
            a("p", E, d(e.text), 1),
            e.state !== "open" ? (o(), i("p", F, d(e.state === "answered" ? `Answered: ${e.answer}` : "Closed"), 1)) : l("", !0),
            e.state === "open" ? (o(), i("div", M, [
              (o(!0), i($, null, w(e.options, (n) => (o(), i("button", {
                key: n,
                type: "button",
                class: S(["question-choice", { recommended: n === e.recommended }]),
                onClick: (J) => m(e, n)
              }, d(C(e, n)), 11, Q))), 128))
            ])) : l("", !0),
            e.state === "open" ? (o(), i("form", {
              key: 2,
              class: "question-form",
              onSubmit: V((n) => p(e), ["prevent"])
            }, [
              g(a("input", {
                "onUpdate:modelValue": (n) => c.value[e.id] = n,
                class: "question-answer",
                placeholder: "Answer in your own words"
              }, null, 8, U), [
                [N, c.value[e.id]]
              ]),
              a("button", {
                type: "button",
                class: "question-send",
                onClick: (n) => p(e)
              }, "Answer", 8, z),
              a("button", {
                type: "button",
                class: "question-close",
                onClick: (n) => _(["question", "close", String(e.id)])
              }, "Close", 8, I)
            ], 40, T)) : l("", !0)
          ], 8, D)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"]),
      r.value ? (o(), i("p", j, d(r.value), 1)) : l("", !0)
    ]));
  }
}, W = /* @__PURE__ */ L(G, [["__scopeId", "data-v-02837976"]]);
export {
  W as default
};
