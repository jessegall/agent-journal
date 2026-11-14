import { openBlock as t, createElementBlock as o, Fragment as b, createVNode as k, unref as a, withCtx as B, createTextVNode as x, toDisplayString as u, ref as g, computed as I, withDirectives as F, normalizeClass as M, createElementVNode as l, createCommentVNode as m, createBlock as N, renderList as W, withModifiers as j } from "vue";
import { Btn as S, peekRef as T, useWindow as L, AgentBadge as P, ActionsMenu as G, TextInput as R, vContext as H, TimeAgo as J } from "@journal/window-kit";
import { _ as z } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const U = {
  __name: "QuestionActions",
  props: { elaborated: Boolean },
  emits: ["close", "elaborate", "answer"],
  setup(e) {
    return (f, n) => (t(), o(b, null, [
      k(a(S), {
        small: "",
        "data-question-close": "",
        onClick: n[0] || (n[0] = (v) => f.$emit("close"))
      }, {
        default: B(() => [...n[3] || (n[3] = [
          x("Close", -1)
        ])]),
        _: 1
      }),
      k(a(S), {
        small: "",
        disabled: e.elaborated,
        "data-question-elaborate": "",
        onClick: n[1] || (n[1] = (v) => f.$emit("elaborate"))
      }, {
        default: B(() => [
          x(u(e.elaborated ? "Asked to elaborate" : "Elaborate"), 1)
        ]),
        _: 1
      }, 8, ["disabled"]),
      k(a(S), {
        variant: "primary",
        small: "",
        "data-question-answer": "",
        onClick: n[2] || (n[2] = (v) => f.$emit("answer"))
      }, {
        default: B(() => [...n[4] || (n[4] = [
          x("Answer", -1)
        ])]),
        _: 1
      })
    ], 64));
  }
}, Me = (e) => e.state === "open", K = (e) => e ? new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 }) : "", X = (e) => e.agent_name || `Agent ${e.session_agent_id}`, Y = (e) => e.row_model === "plan" ? e.row_id : null;
function Z(e, { elaborate: f, close: n, elaborated: v }) {
  return [
    { label: "Open", group: "open", run: () => T(`questions:${e.id}`) },
    { label: v ? "Asked to elaborate" : "Elaborate", group: "own", disabled: v, reason: "Already asked", run: f },
    { label: "Close", group: "own", run: n }
  ];
}
const _ = ["data-state"], ee = { class: "head" }, te = ["title", "data-question-open"], oe = ["datetime"], ne = { class: "text" }, se = {
  key: 0,
  class: "settled",
  "data-question-settled": ""
}, ae = {
  key: 0,
  class: "context",
  "data-question-context": ""
}, le = {
  class: "options",
  role: "radiogroup",
  "aria-label": "Options"
}, ie = ["aria-checked", "data-question-option", "onClick"], ue = { class: "option-text" }, re = {
  key: 0,
  class: "star",
  "aria-label": "Recommended",
  "data-question-recommended": ""
}, de = {
  key: 2,
  class: "failure",
  role: "alert",
  "data-question-failure": ""
}, ce = {
  __name: "QuestionWindowCard",
  props: { row: { type: Object, required: !0 } },
  emits: ["changed"],
  setup(e, { emit: f }) {
    const n = e, v = f, Q = L(), y = g(""), h = g(""), $ = g(null), q = g(""), A = g(!1), w = I(() => ({ ...n.row, ...$.value })), p = I(() => h.value.trim() || y.value), V = Y(n.row);
    async function O(C, r) {
      $.value = C, q.value = "";
      const c = await Q.run(r);
      if (c.ok) return void v("changed");
      $.value = null, q.value = c.error;
    }
    const E = () => p.value && O({ state: "answered", answer: p.value }, ["question", "answer", String(n.row.id), "--answer", p.value]), d = () => O({ state: "closed" }, ["question", "close", String(n.row.id)]);
    async function i() {
      A.value = !0;
      const C = await Q.run(["message", "send", `Elaborate on question ${n.row.id}: ask it again with more context on each option and which you would pick, and you choose.`]);
      C.ok || (A.value = !1, q.value = C.error);
    }
    const s = () => Z(n.row, { elaborate: i, close: d, elaborated: A.value }), D = (C) => {
      y.value = C, h.value = "";
    };
    return (C, r) => F((t(), o("section", {
      class: M(["card", { done: w.value.state !== "open" }]),
      "data-state": w.value.state,
      "data-question-card": ""
    }, [
      l("header", ee, [
        l("button", {
          type: "button",
          class: "number",
          title: `Question ${e.row.id}`,
          "data-question-open": e.row.id,
          onClick: r[0] || (r[0] = (c) => a(T)(`questions:${e.row.id}`))
        }, u(e.row.id), 9, te),
        k(a(P), {
          name: a(X)(e.row),
          chip: "",
          "data-question-agent": ""
        }, null, 8, ["name"]),
        a(V) ? (t(), o("button", {
          key: 0,
          type: "button",
          class: "plan",
          "data-question-plan": "",
          onClick: r[1] || (r[1] = (c) => a(T)(`plans:${a(V)}`))
        }, "Plan " + u(a(V)), 1)) : m("", !0),
        r[3] || (r[3] = l("span", { class: "grow" }, null, -1)),
        w.value.state === "open" ? (t(), N(a(G), {
          key: 1,
          items: s(),
          head: `Question ${e.row.id}`,
          label: "More"
        }, null, 8, ["items", "head"])) : m("", !0),
        l("time", {
          class: "time",
          datetime: e.row.created_at,
          "data-question-time": ""
        }, u(a(K)(e.row.created_at)), 9, oe)
      ]),
      l("p", ne, u(e.row.text), 1),
      w.value.state !== "open" ? (t(), o("p", se, u(w.value.state === "answered" ? w.value.answer : "Closed"), 1)) : (t(), o(b, { key: 1 }, [
        e.row.context ? (t(), o("p", ae, u(e.row.context), 1)) : m("", !0),
        l("div", le, [
          (t(!0), o(b, null, W(e.row.options, (c) => (t(), o("button", {
            key: c,
            type: "button",
            role: "radio",
            class: "option",
            "aria-checked": y.value === c && !h.value.trim(),
            "data-question-option": c,
            onClick: (Be) => D(c)
          }, [
            r[4] || (r[4] = l("i", { class: "ring" }, null, -1)),
            l("span", ue, u(c), 1),
            c === e.row.recommended ? (t(), o("span", re, "★")) : m("", !0)
          ], 8, ie))), 128))
        ]),
        l("form", {
          class: "form",
          onSubmit: j(E, ["prevent"])
        }, [
          k(a(R), {
            modelValue: h.value,
            "onUpdate:modelValue": r[2] || (r[2] = (c) => h.value = c),
            placeholder: "Other",
            "aria-label": "Other answer"
          }, null, 8, ["modelValue"]),
          k(a(S), {
            variant: "primary",
            small: "",
            type: "submit",
            "data-question-answer": "",
            disabled: !p.value
          }, {
            default: B(() => [...r[5] || (r[5] = [
              x("Answer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ], 32)
      ], 64)),
      q.value ? (t(), o("p", de, u(q.value), 1)) : m("", !0)
    ], 10, _)), [
      [a(H), () => ({ head: `Question ${e.row.id}`, items: s() })]
    ]);
  }
}, we = /* @__PURE__ */ z(ce, [["__scopeId", "data-v-32aba95b"]]), me = ["data-state"], ve = { class: "question-head" }, qe = {
  key: 0,
  class: "question-dot",
  "data-question-dot": ""
}, be = { class: "question-label" }, ke = ["data-question-open"], fe = {
  key: 0,
  class: "question-context",
  "data-question-context": ""
}, ye = {
  key: 1,
  class: "question-closed",
  "data-question-settled": ""
}, he = { class: "question-answer" }, $e = { class: "question-options" }, ge = ["data-question-option", "onClick"], pe = {
  key: 0,
  class: "question-ring"
}, Ce = {
  key: 1,
  class: "question-tag"
}, xe = { class: "question-option-text" }, Ae = {
  key: 2,
  class: "question-chip"
}, Ve = { class: "question-buttons" }, Oe = {
  key: 3,
  class: "question-failure",
  role: "alert",
  "data-question-failure": ""
}, Qe = {
  __name: "QuestionCard",
  props: { row: { type: Object, required: !0 }, flush: Boolean, window: Boolean },
  emits: ["changed"],
  setup(e, { emit: f }) {
    const n = e, v = f, Q = L(), y = g(""), h = g(null), $ = g(""), q = g(!1);
    async function A(d, i) {
      h.value = d, $.value = "";
      const s = await Q.run(i);
      if (s.ok) return void v("changed");
      h.value = null, $.value = s.error;
    }
    const w = () => ({ ...n.row, ...h.value }), p = (d) => A({ state: "answered", answer: d }, ["question", "answer", String(n.row.id), "--answer", d]), V = () => A({ state: "closed" }, ["question", "close", String(n.row.id)]);
    function O() {
      const d = y.value.trim();
      d && p(d);
    }
    async function E() {
      q.value = !0;
      const d = await Q.run(["message", "send", `Elaborate on question ${n.row.id}: ask it again with more context on each option and which you would pick, and you choose.`]);
      d.ok || (q.value = !1, $.value = d.error);
    }
    return (d, i) => e.window ? (t(), N(we, {
      key: 0,
      row: e.row,
      onChanged: i[0] || (i[0] = (s) => v("changed"))
    }, null, 8, ["row"])) : (t(), o("section", {
      key: 1,
      class: M(["question", { flush: e.flush }]),
      "data-state": w().state,
      "data-question-card": ""
    }, [
      l("header", ve, [
        e.flush ? (t(), o("i", qe)) : m("", !0),
        l("p", be, "Question " + u(e.row.id), 1),
        k(a(J), {
          class: "question-time",
          at: e.row.created_at,
          "data-question-time": ""
        }, null, 8, ["at"])
      ]),
      l("button", {
        type: "button",
        class: "question-open",
        "data-question-open": e.row.id,
        onClick: i[1] || (i[1] = (s) => a(T)(`questions:${e.row.id}`))
      }, u(e.row.text), 9, ke),
      e.row.context ? (t(), o("p", fe, u(e.row.context), 1)) : m("", !0),
      w().state !== "open" ? (t(), o("p", ye, [
        w().state === "answered" ? (t(), o(b, { key: 0 }, [
          e.flush ? (t(), o(b, { key: 0 }, [
            i[4] || (i[4] = l("b", { class: "question-answered" }, "Answered:", -1)),
            i[5] || (i[5] = x()),
            l("span", he, u(w().answer), 1)
          ], 64)) : (t(), o(b, { key: 1 }, [
            x("Answered: " + u(w().answer), 1)
          ], 64))
        ], 64)) : (t(), o(b, { key: 1 }, [
          x("Closed")
        ], 64))
      ])) : (t(), o(b, { key: 2 }, [
        l("div", $e, [
          (t(!0), o(b, null, W(e.row.options, (s) => (t(), o("button", {
            key: s,
            type: "button",
            class: M(["question-option", { recommended: s === e.row.recommended }]),
            "data-question-option": s,
            onClick: (D) => p(s)
          }, [
            e.flush ? (t(), o("i", pe)) : m("", !0),
            s === e.row.recommended && !e.flush ? (t(), o("span", Ce, "Recommended")) : m("", !0),
            l("span", xe, u(s), 1),
            s === e.row.recommended && e.flush ? (t(), o("span", Ae, "Recommended")) : m("", !0)
          ], 10, ge))), 128))
        ]),
        l("form", {
          class: "question-form",
          onSubmit: j(O, ["prevent"])
        }, [
          e.flush ? (t(), o(b, { key: 0 }, [
            k(a(R), {
              modelValue: y.value,
              "onUpdate:modelValue": i[2] || (i[2] = (s) => y.value = s),
              class: "question-input",
              placeholder: "Or answer in your own words…"
            }, null, 8, ["modelValue"]),
            l("span", Ve, [
              k(U, {
                elaborated: q.value,
                onClose: V,
                onElaborate: E,
                onAnswer: O
              }, null, 8, ["elaborated"])
            ])
          ], 64)) : (t(), N(a(R), {
            key: 1,
            modelValue: y.value,
            "onUpdate:modelValue": i[3] || (i[3] = (s) => y.value = s),
            placeholder: "Or answer in your own words…"
          }, {
            end: B(() => [
              k(U, {
                elaborated: q.value,
                onClose: V,
                onElaborate: E,
                onAnswer: O
              }, null, 8, ["elaborated"])
            ]),
            _: 1
          }, 8, ["modelValue"]))
        ], 32)
      ], 64)),
      $.value ? (t(), o("p", Oe, u($.value), 1)) : m("", !0)
    ], 10, me));
  }
}, Ne = /* @__PURE__ */ z(Qe, [["__scopeId", "data-v-c37bedaf"]]);
export {
  Ne as Q,
  Me as i
};
