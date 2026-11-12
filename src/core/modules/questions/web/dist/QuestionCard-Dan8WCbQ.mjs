import { openBlock as t, createElementBlock as o, Fragment as u, createVNode as d, unref as c, withCtx as C, createTextVNode as w, toDisplayString as r, ref as h, normalizeClass as Q, createElementVNode as i, createCommentVNode as m, renderList as T, withModifiers as O, createBlock as R } from "vue";
import { Btn as $, useWindow as I, TimeAgo as U, peekRef as j, TextInput as N } from "@journal/window-kit";
import { _ as z } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const S = {
  __name: "QuestionActions",
  props: { elaborated: Boolean },
  emits: ["close", "elaborate", "answer"],
  setup(e) {
    return (q, s) => (t(), o(u, null, [
      d(c($), {
        small: "",
        "data-question-close": "",
        onClick: s[0] || (s[0] = (y) => q.$emit("close"))
      }, {
        default: C(() => [...s[3] || (s[3] = [
          w("Close", -1)
        ])]),
        _: 1
      }),
      d(c($), {
        small: "",
        disabled: e.elaborated,
        "data-question-elaborate": "",
        onClick: s[1] || (s[1] = (y) => q.$emit("elaborate"))
      }, {
        default: C(() => [
          w(r(e.elaborated ? "Asked to elaborate" : "Elaborate"), 1)
        ]),
        _: 1
      }, 8, ["disabled"]),
      d(c($), {
        variant: "primary",
        small: "",
        "data-question-answer": "",
        onClick: s[2] || (s[2] = (y) => q.$emit("answer"))
      }, {
        default: C(() => [...s[4] || (s[4] = [
          w("Answer", -1)
        ])]),
        _: 1
      })
    ], 64));
  }
}, D = ["data-state"], F = { class: "question-head" }, L = {
  key: 0,
  class: "question-dot",
  "data-question-dot": ""
}, M = { class: "question-label" }, W = ["data-question-open"], G = {
  key: 0,
  class: "question-context",
  "data-question-context": ""
}, H = {
  key: 1,
  class: "question-closed",
  "data-question-settled": ""
}, J = { class: "question-answer" }, K = { class: "question-options" }, P = ["data-question-option", "onClick"], X = {
  key: 0,
  class: "question-ring"
}, Y = {
  key: 1,
  class: "question-tag"
}, Z = { class: "question-option-text" }, _ = {
  key: 2,
  class: "question-chip"
}, ee = { class: "question-buttons" }, te = {
  key: 3,
  class: "question-failure",
  role: "alert",
  "data-question-failure": ""
}, oe = {
  __name: "QuestionCard",
  props: { row: { type: Object, required: !0 }, flush: Boolean },
  emits: ["changed"],
  setup(e, { emit: q }) {
    const s = e, y = q, V = I(), f = h(""), x = h(null), k = h(""), v = h(!1);
    async function p(l, a) {
      x.value = l, k.value = "";
      const n = await V.run(a);
      if (n.ok) return void y("changed");
      x.value = null, k.value = n.error;
    }
    const b = () => ({ ...s.row, ...x.value }), A = (l) => p({ state: "answered", answer: l }, ["question", "answer", String(s.row.id), "--answer", l]), B = () => p({ state: "closed" }, ["question", "close", String(s.row.id)]);
    function g() {
      const l = f.value.trim();
      l && A(l);
    }
    async function E() {
      v.value = !0;
      const l = await V.run(["message", "send", `Elaborate on question ${s.row.id}: ask it again with more context on each option and which you would pick, and you choose.`]);
      l.ok || (v.value = !1, k.value = l.error);
    }
    return (l, a) => (t(), o("section", {
      class: Q(["question", { flush: e.flush }]),
      "data-state": b().state,
      "data-question-card": ""
    }, [
      i("header", F, [
        e.flush ? (t(), o("i", L)) : m("", !0),
        i("p", M, "Question " + r(e.row.id), 1),
        d(c(U), {
          class: "question-time",
          at: e.row.created_at,
          "data-question-time": ""
        }, null, 8, ["at"])
      ]),
      i("button", {
        type: "button",
        class: "question-open",
        "data-question-open": e.row.id,
        onClick: a[0] || (a[0] = (n) => c(j)(`questions:${e.row.id}`))
      }, r(e.row.text), 9, W),
      e.row.context ? (t(), o("p", G, r(e.row.context), 1)) : m("", !0),
      b().state !== "open" ? (t(), o("p", H, [
        b().state === "answered" ? (t(), o(u, { key: 0 }, [
          e.flush ? (t(), o(u, { key: 0 }, [
            a[3] || (a[3] = i("b", { class: "question-answered" }, "Answered:", -1)),
            a[4] || (a[4] = w()),
            i("span", J, r(b().answer), 1)
          ], 64)) : (t(), o(u, { key: 1 }, [
            w("Answered: " + r(b().answer), 1)
          ], 64))
        ], 64)) : (t(), o(u, { key: 1 }, [
          w("Closed")
        ], 64))
      ])) : (t(), o(u, { key: 2 }, [
        i("div", K, [
          (t(!0), o(u, null, T(e.row.options, (n) => (t(), o("button", {
            key: n,
            type: "button",
            class: Q(["question-option", { recommended: n === e.row.recommended }]),
            "data-question-option": n,
            onClick: (se) => A(n)
          }, [
            e.flush ? (t(), o("i", X)) : m("", !0),
            n === e.row.recommended && !e.flush ? (t(), o("span", Y, "Recommended")) : m("", !0),
            i("span", Z, r(n), 1),
            n === e.row.recommended && e.flush ? (t(), o("span", _, "Recommended")) : m("", !0)
          ], 10, P))), 128))
        ]),
        i("form", {
          class: "question-form",
          onSubmit: O(g, ["prevent"])
        }, [
          e.flush ? (t(), o(u, { key: 0 }, [
            d(c(N), {
              modelValue: f.value,
              "onUpdate:modelValue": a[1] || (a[1] = (n) => f.value = n),
              class: "question-input",
              placeholder: "Or answer in your own words…"
            }, null, 8, ["modelValue"]),
            i("span", ee, [
              d(S, {
                elaborated: v.value,
                onClose: B,
                onElaborate: E,
                onAnswer: g
              }, null, 8, ["elaborated"])
            ])
          ], 64)) : (t(), R(c(N), {
            key: 1,
            modelValue: f.value,
            "onUpdate:modelValue": a[2] || (a[2] = (n) => f.value = n),
            placeholder: "Or answer in your own words…"
          }, {
            end: C(() => [
              d(S, {
                elaborated: v.value,
                onClose: B,
                onElaborate: E,
                onAnswer: g
              }, null, 8, ["elaborated"])
            ]),
            _: 1
          }, 8, ["modelValue"]))
        ], 32)
      ], 64)),
      k.value ? (t(), o("p", te, r(k.value), 1)) : m("", !0)
    ], 10, D));
  }
}, ie = /* @__PURE__ */ z(oe, [["__scopeId", "data-v-6cf624e5"]]);
export {
  ie as Q
};
