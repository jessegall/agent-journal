/* @code-commandments-generated */
import { ref as w, openBlock as n, createElementBlock as s, createElementVNode as i, toDisplayString as r, unref as l, Fragment as _, renderList as N, normalizeClass as Q, createCommentVNode as x, withModifiers as A, createVNode as q, withCtx as f, createTextVNode as y } from "vue";
import { useWindow as B, ago as T, peekRef as D, TextInput as I, Btn as h } from "@journal/window-kit";
import { _ as L } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const O = ["data-state"], R = { class: "question-head" }, j = { class: "question-label" }, z = ["datetime", "title"], F = ["data-question-open"], M = {
  key: 0,
  class: "question-closed",
  "data-question-settled": ""
}, U = { class: "question-options" }, W = ["data-question-option", "onClick"], G = {
  key: 0,
  class: "question-tag"
}, H = {
  key: 2,
  class: "question-failure",
  role: "alert",
  "data-question-failure": ""
}, J = {
  __name: "QuestionCard",
  props: { row: { type: Object, required: !0 } },
  emits: ["changed"],
  setup(t, { emit: V }) {
    const u = t, S = V, b = B(), v = w(""), k = w(null), d = w(""), c = w(!1);
    async function p(o, a) {
      k.value = o, d.value = "";
      const e = await b.run(a);
      if (e.ok) return void S("changed");
      k.value = null, d.value = e.error;
    }
    const m = () => ({ ...u.row, ...k.value }), C = (o) => p({ state: "answered", answer: o }, ["question", "answer", String(u.row.id), "--answer", o]), $ = () => p({ state: "closed" }, ["question", "close", String(u.row.id)]);
    function g() {
      const o = v.value.trim();
      o && C(o);
    }
    async function E() {
      c.value = !0;
      const o = await b.run(["message", "send", `Elaborate on question ${u.row.id}: ask it again with more context on each option and which you would pick, and you choose.`]);
      o.ok || (c.value = !1, d.value = o.error);
    }
    return (o, a) => (n(), s("section", {
      class: "question",
      "data-state": m().state,
      "data-question-card": ""
    }, [
      i("header", R, [
        i("p", j, "Question " + r(t.row.id), 1),
        i("time", {
          class: "question-time",
          datetime: t.row.created_at,
          title: new Date(t.row.created_at).toLocaleString(),
          "data-question-time": ""
        }, r(l(T)(t.row.created_at)), 9, z)
      ]),
      i("button", {
        type: "button",
        class: "question-open",
        "data-question-open": t.row.id,
        onClick: a[0] || (a[0] = (e) => l(D)(`questions:${t.row.id}`))
      }, r(t.row.text), 9, F),
      m().state !== "open" ? (n(), s("p", M, r(m().state === "answered" ? `Answered: ${m().answer}` : "Closed"), 1)) : (n(), s(_, { key: 1 }, [
        i("div", U, [
          (n(!0), s(_, null, N(t.row.options, (e) => (n(), s("button", {
            key: e,
            type: "button",
            class: Q(["question-option", { recommended: e === t.row.recommended }]),
            "data-question-option": e,
            onClick: (K) => C(e)
          }, [
            e === t.row.recommended ? (n(), s("span", G, "Recommended")) : x("", !0),
            i("span", null, r(e), 1)
          ], 10, W))), 128))
        ]),
        i("form", {
          onSubmit: A(g, ["prevent"])
        }, [
          q(l(I), {
            modelValue: v.value,
            "onUpdate:modelValue": a[1] || (a[1] = (e) => v.value = e),
            placeholder: "Or answer in your own words…"
          }, {
            end: f(() => [
              q(l(h), {
                small: "",
                "data-question-close": "",
                onClick: $
              }, {
                default: f(() => [...a[2] || (a[2] = [
                  y("Close", -1)
                ])]),
                _: 1
              }),
              q(l(h), {
                small: "",
                disabled: c.value,
                "data-question-elaborate": "",
                onClick: E
              }, {
                default: f(() => [
                  y(r(c.value ? "Asked to elaborate" : "Elaborate"), 1)
                ]),
                _: 1
              }, 8, ["disabled"]),
              q(l(h), {
                kind: "primary",
                small: "",
                "data-question-answer": "",
                onClick: g
              }, {
                default: f(() => [...a[3] || (a[3] = [
                  y("Answer", -1)
                ])]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["modelValue"])
        ], 32)
      ], 64)),
      d.value ? (n(), s("p", H, r(d.value), 1)) : x("", !0)
    ], 8, O));
  }
}, Z = /* @__PURE__ */ L(J, [["__scopeId", "data-v-61f8aa45"]]);
export {
  Z as Q
};
