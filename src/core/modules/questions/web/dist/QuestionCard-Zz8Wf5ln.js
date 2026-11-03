/* @code-commandments-generated */
import { ref as q, openBlock as n, createElementBlock as a, createElementVNode as i, toDisplayString as r, createVNode as u, unref as l, Fragment as _, renderList as N, normalizeClass as Q, createCommentVNode as x, withModifiers as S, withCtx as f, createTextVNode as p } from "vue";
import { useWindow as T, TimeAgo as B, peekRef as I, TextInput as O, Btn as y } from "@journal/window-kit";
import { _ as R } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const j = ["data-state"], z = { class: "question-head" }, D = { class: "question-label" }, F = ["data-question-open"], L = {
  key: 0,
  class: "question-closed",
  "data-question-settled": ""
}, M = { class: "question-options" }, U = ["data-question-option", "onClick"], W = {
  key: 0,
  class: "question-tag"
}, G = {
  key: 2,
  class: "question-failure",
  role: "alert",
  "data-question-failure": ""
}, H = {
  __name: "QuestionCard",
  props: { row: { type: Object, required: !0 } },
  emits: ["changed"],
  setup(s, { emit: V }) {
    const c = s, $ = V, b = T(), v = q(""), k = q(null), d = q(""), m = q(!1);
    async function h(t, o) {
      k.value = t, d.value = "";
      const e = await b.run(o);
      if (e.ok) return void $("changed");
      k.value = null, d.value = e.error;
    }
    const w = () => ({ ...c.row, ...k.value }), C = (t) => h({ state: "answered", answer: t }, ["question", "answer", String(c.row.id), "--answer", t]), A = () => h({ state: "closed" }, ["question", "close", String(c.row.id)]);
    function g() {
      const t = v.value.trim();
      t && C(t);
    }
    async function E() {
      m.value = !0;
      const t = await b.run(["message", "send", `Elaborate on question ${c.row.id}: ask it again with more context on each option and which you would pick, and you choose.`]);
      t.ok || (m.value = !1, d.value = t.error);
    }
    return (t, o) => (n(), a("section", {
      class: "question",
      "data-state": w().state,
      "data-question-card": ""
    }, [
      i("header", z, [
        i("p", D, "Question " + r(s.row.id), 1),
        u(l(B), {
          class: "question-time",
          at: s.row.created_at,
          "data-question-time": ""
        }, null, 8, ["at"])
      ]),
      i("button", {
        type: "button",
        class: "question-open",
        "data-question-open": s.row.id,
        onClick: o[0] || (o[0] = (e) => l(I)(`questions:${s.row.id}`))
      }, r(s.row.text), 9, F),
      w().state !== "open" ? (n(), a("p", L, r(w().state === "answered" ? `Answered: ${w().answer}` : "Closed"), 1)) : (n(), a(_, { key: 1 }, [
        i("div", M, [
          (n(!0), a(_, null, N(s.row.options, (e) => (n(), a("button", {
            key: e,
            type: "button",
            class: Q(["question-option", { recommended: e === s.row.recommended }]),
            "data-question-option": e,
            onClick: (J) => C(e)
          }, [
            e === s.row.recommended ? (n(), a("span", W, "Recommended")) : x("", !0),
            i("span", null, r(e), 1)
          ], 10, U))), 128))
        ]),
        i("form", {
          onSubmit: S(g, ["prevent"])
        }, [
          u(l(O), {
            modelValue: v.value,
            "onUpdate:modelValue": o[1] || (o[1] = (e) => v.value = e),
            placeholder: "Or answer in your own words…"
          }, {
            end: f(() => [
              u(l(y), {
                small: "",
                "data-question-close": "",
                onClick: A
              }, {
                default: f(() => [...o[2] || (o[2] = [
                  p("Close", -1)
                ])]),
                _: 1
              }),
              u(l(y), {
                small: "",
                disabled: m.value,
                "data-question-elaborate": "",
                onClick: E
              }, {
                default: f(() => [
                  p(r(m.value ? "Asked to elaborate" : "Elaborate"), 1)
                ]),
                _: 1
              }, 8, ["disabled"]),
              u(l(y), {
                kind: "primary",
                small: "",
                "data-question-answer": "",
                onClick: g
              }, {
                default: f(() => [...o[3] || (o[3] = [
                  p("Answer", -1)
                ])]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["modelValue"])
        ], 32)
      ], 64)),
      d.value ? (n(), a("p", G, r(d.value), 1)) : x("", !0)
    ], 8, j));
  }
}, Y = /* @__PURE__ */ R(H, [["__scopeId", "data-v-38203f52"]]);
export {
  Y as Q
};
