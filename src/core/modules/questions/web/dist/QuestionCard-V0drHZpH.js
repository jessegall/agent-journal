/* @code-commandments-generated */
import { openBlock as t, createElementBlock as o, Fragment as u, createVNode as r, unref as d, withCtx as C, createTextVNode as m, toDisplayString as c, ref as h, normalizeClass as Q, createElementVNode as i, createCommentVNode as k, renderList as T, withModifiers as O, createBlock as R } from "vue";
import { Btn as p, useWindow as I, TimeAgo as U, peekRef as j, TextInput as N } from "@journal/window-kit";
import { _ as z } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const S = {
  __name: "QuestionActions",
  props: { elaborated: Boolean },
  emits: ["close", "elaborate", "answer"],
  setup(e) {
    return (w, s) => (t(), o(u, null, [
      r(d(p), {
        small: "",
        "data-question-close": "",
        onClick: s[0] || (s[0] = (b) => w.$emit("close"))
      }, {
        default: C(() => [...s[3] || (s[3] = [
          m("Close", -1)
        ])]),
        _: 1
      }),
      r(d(p), {
        small: "",
        disabled: e.elaborated,
        "data-question-elaborate": "",
        onClick: s[1] || (s[1] = (b) => w.$emit("elaborate"))
      }, {
        default: C(() => [
          m(c(e.elaborated ? "Asked to elaborate" : "Elaborate"), 1)
        ]),
        _: 1
      }, 8, ["disabled"]),
      r(d(p), {
        kind: "primary",
        small: "",
        "data-question-answer": "",
        onClick: s[2] || (s[2] = (b) => w.$emit("answer"))
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
}, H = { key: 0 }, J = { class: "question-options" }, K = ["data-question-option", "onClick"], P = {
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
    const s = e, b = w, V = I(), f = h(""), g = h(null), q = h(""), y = h(!1);
    async function x(a, l) {
      g.value = a, q.value = "";
      const n = await V.run(l);
      if (n.ok) return void b("changed");
      g.value = null, q.value = n.error;
    }
    const v = () => ({ ...s.row, ...g.value }), A = (a) => x({ state: "answered", answer: a }, ["question", "answer", String(s.row.id), "--answer", a]), B = () => x({ state: "closed" }, ["question", "close", String(s.row.id)]);
    function $() {
      const a = f.value.trim();
      a && A(a);
    }
    async function E() {
      y.value = !0;
      const a = await V.run(["message", "send", `Elaborate on question ${s.row.id}: ask it again with more context on each option and which you would pick, and you choose.`]);
      a.ok || (y.value = !1, q.value = a.error);
    }
    return (a, l) => (t(), o("section", {
      class: Q(["question", { flush: e.flush }]),
      "data-state": v().state,
      "data-question-card": ""
    }, [
      i("header", F, [
        e.flush ? (t(), o("i", L)) : k("", !0),
        i("p", M, "Question " + c(e.row.id), 1),
        r(d(U), {
          class: "question-time",
          at: e.row.created_at,
          "data-question-time": ""
        }, null, 8, ["at"])
      ]),
      i("button", {
        type: "button",
        class: "question-open",
        "data-question-open": e.row.id,
        onClick: l[0] || (l[0] = (n) => d(j)(`questions:${e.row.id}`))
      }, c(e.row.text), 9, W),
      v().state !== "open" ? (t(), o("p", G, [
        v().state === "answered" ? (t(), o(u, { key: 0 }, [
          e.flush ? (t(), o("b", H, "Answered:")) : (t(), o(u, { key: 1 }, [
            m("Answered:")
          ], 64)),
          m(" " + c(v().answer), 1)
        ], 64)) : (t(), o(u, { key: 1 }, [
          m("Closed")
        ], 64))
      ])) : (t(), o(u, { key: 1 }, [
        i("div", J, [
          (t(!0), o(u, null, T(e.row.options, (n) => (t(), o("button", {
            key: n,
            type: "button",
            class: Q(["question-option", { recommended: n === e.row.recommended }]),
            "data-question-option": n,
            onClick: (oe) => A(n)
          }, [
            e.flush ? (t(), o("i", P)) : k("", !0),
            n === e.row.recommended && !e.flush ? (t(), o("span", X, "Recommended")) : k("", !0),
            i("span", Y, c(n), 1),
            n === e.row.recommended && e.flush ? (t(), o("span", Z, "Recommended")) : k("", !0)
          ], 10, K))), 128))
        ]),
        i("form", {
          class: "question-form",
          onSubmit: O($, ["prevent"])
        }, [
          e.flush ? (t(), o(u, { key: 0 }, [
            r(d(N), {
              modelValue: f.value,
              "onUpdate:modelValue": l[1] || (l[1] = (n) => f.value = n),
              class: "question-input",
              placeholder: "Or answer in your own words…"
            }, null, 8, ["modelValue"]),
            i("span", _, [
              r(S, {
                elaborated: y.value,
                onClose: B,
                onElaborate: E,
                onAnswer: $
              }, null, 8, ["elaborated"])
            ])
          ], 64)) : (t(), R(d(N), {
            key: 1,
            modelValue: f.value,
            "onUpdate:modelValue": l[2] || (l[2] = (n) => f.value = n),
            placeholder: "Or answer in your own words…"
          }, {
            end: C(() => [
              r(S, {
                elaborated: y.value,
                onClose: B,
                onElaborate: E,
                onAnswer: $
              }, null, 8, ["elaborated"])
            ]),
            _: 1
          }, 8, ["modelValue"]))
        ], 32)
      ], 64)),
      q.value ? (t(), o("p", ee, c(q.value), 1)) : k("", !0)
    ], 10, D));
  }
}, le = /* @__PURE__ */ z(te, [["__scopeId", "data-v-876b94a0"]]);
export {
  le as Q
};
