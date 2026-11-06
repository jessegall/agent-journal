/* @code-commandments-generated */
import { openBlock as t, createElementBlock as o, Fragment as r, createVNode as d, unref as c, withCtx as C, createTextVNode as m, toDisplayString as u, ref as h, normalizeClass as Q, createElementVNode as i, createCommentVNode as k, renderList as T, withModifiers as O, createBlock as R } from "vue";
import { Btn as $, useWindow as I, TimeAgo as U, peekRef as j, TextInput as N } from "@journal/window-kit";
import { _ as z } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const S = {
  __name: "QuestionActions",
  props: { elaborated: Boolean },
  emits: ["close", "elaborate", "answer"],
  setup(e) {
    return (w, s) => (t(), o(r, null, [
      d(c($), {
        small: "",
        "data-question-close": "",
        onClick: s[0] || (s[0] = (v) => w.$emit("close"))
      }, {
        default: C(() => [...s[3] || (s[3] = [
          m("Close", -1)
        ])]),
        _: 1
      }),
      d(c($), {
        small: "",
        disabled: e.elaborated,
        "data-question-elaborate": "",
        onClick: s[1] || (s[1] = (v) => w.$emit("elaborate"))
      }, {
        default: C(() => [
          m(u(e.elaborated ? "Asked to elaborate" : "Elaborate"), 1)
        ]),
        _: 1
      }, 8, ["disabled"]),
      d(c($), {
        variant: "primary",
        small: "",
        "data-question-answer": "",
        onClick: s[2] || (s[2] = (v) => w.$emit("answer"))
      }, {
        default: C(() => [...s[4] || (s[4] = [
          m("Answer", -1)
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
  class: "question-closed",
  "data-question-settled": ""
}, H = { class: "question-answer" }, J = { class: "question-options" }, K = ["data-question-option", "onClick"], P = {
  key: 0,
  class: "question-ring"
}, X = {
  key: 1,
  class: "question-tag"
}, Y = { class: "question-option-text" }, Z = {
  key: 2,
  class: "question-chip"
}, _ = { class: "question-buttons" }, ee = {
  key: 2,
  class: "question-failure",
  role: "alert",
  "data-question-failure": ""
}, te = {
  __name: "QuestionCard",
  props: { row: { type: Object, required: !0 }, flush: Boolean },
  emits: ["changed"],
  setup(e, { emit: w }) {
    const s = e, v = w, V = I(), f = h(""), g = h(null), q = h(""), y = h(!1);
    async function x(l, a) {
      g.value = l, q.value = "";
      const n = await V.run(a);
      if (n.ok) return void v("changed");
      g.value = null, q.value = n.error;
    }
    const b = () => ({ ...s.row, ...g.value }), A = (l) => x({ state: "answered", answer: l }, ["question", "answer", String(s.row.id), "--answer", l]), B = () => x({ state: "closed" }, ["question", "close", String(s.row.id)]);
    function p() {
      const l = f.value.trim();
      l && A(l);
    }
    async function E() {
      y.value = !0;
      const l = await V.run(["message", "send", `Elaborate on question ${s.row.id}: ask it again with more context on each option and which you would pick, and you choose.`]);
      l.ok || (y.value = !1, q.value = l.error);
    }
    return (l, a) => (t(), o("section", {
      class: Q(["question", { flush: e.flush }]),
      "data-state": b().state,
      "data-question-card": ""
    }, [
      i("header", F, [
        e.flush ? (t(), o("i", L)) : k("", !0),
        i("p", M, "Question " + u(e.row.id), 1),
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
      }, u(e.row.text), 9, W),
      b().state !== "open" ? (t(), o("p", G, [
        b().state === "answered" ? (t(), o(r, { key: 0 }, [
          e.flush ? (t(), o(r, { key: 0 }, [
            a[3] || (a[3] = i("b", { class: "question-answered" }, "Answered:", -1)),
            a[4] || (a[4] = m()),
            i("span", H, u(b().answer), 1)
          ], 64)) : (t(), o(r, { key: 1 }, [
            m("Answered: " + u(b().answer), 1)
          ], 64))
        ], 64)) : (t(), o(r, { key: 1 }, [
          m("Closed")
        ], 64))
      ])) : (t(), o(r, { key: 1 }, [
        i("div", J, [
          (t(!0), o(r, null, T(e.row.options, (n) => (t(), o("button", {
            key: n,
            type: "button",
            class: Q(["question-option", { recommended: n === e.row.recommended }]),
            "data-question-option": n,
            onClick: (oe) => A(n)
          }, [
            e.flush ? (t(), o("i", P)) : k("", !0),
            n === e.row.recommended && !e.flush ? (t(), o("span", X, "Recommended")) : k("", !0),
            i("span", Y, u(n), 1),
            n === e.row.recommended && e.flush ? (t(), o("span", Z, "Recommended")) : k("", !0)
          ], 10, K))), 128))
        ]),
        i("form", {
          class: "question-form",
          onSubmit: O(p, ["prevent"])
        }, [
          e.flush ? (t(), o(r, { key: 0 }, [
            d(c(N), {
              modelValue: f.value,
              "onUpdate:modelValue": a[1] || (a[1] = (n) => f.value = n),
              class: "question-input",
              placeholder: "Or answer in your own words…"
            }, null, 8, ["modelValue"]),
            i("span", _, [
              d(S, {
                elaborated: y.value,
                onClose: B,
                onElaborate: E,
                onAnswer: p
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
                elaborated: y.value,
                onClose: B,
                onElaborate: E,
                onAnswer: p
              }, null, 8, ["elaborated"])
            ]),
            _: 1
          }, 8, ["modelValue"]))
        ], 32)
      ], 64)),
      q.value ? (t(), o("p", ee, u(q.value), 1)) : k("", !0)
    ], 10, D));
  }
}, le = /* @__PURE__ */ z(te, [["__scopeId", "data-v-b7fa0d55"]]);
export {
  le as Q
};
