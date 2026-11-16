import { openBlock as o, createElementBlock as n, Fragment as y, createVNode as h, unref as t, withCtx as Q, createTextVNode as p, toDisplayString as i, ref as O, computed as D, withDirectives as P, normalizeClass as M, createElementVNode as a, createCommentVNode as b, createBlock as N, renderList as U, withModifiers as W } from "vue";
import { Btn as B, peekRef as S, useWindow as j, AgentBadge as G, ActionsMenu as H, TextInput as R, vContext as J, TimeAgo as K } from "@journal/window-kit";
import { _ as L } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const I = {
  __name: "QuestionActions",
  props: { elaborated: Boolean },
  emits: ["close", "elaborate", "answer"],
  setup(e) {
    return (c, s) => (o(), n(y, null, [
      h(t(B), {
        small: "",
        "data-question-close": "",
        onClick: s[0] || (s[0] = (r) => c.$emit("close"))
      }, {
        default: Q(() => [...s[3] || (s[3] = [
          p("Close", -1)
        ])]),
        _: 1
      }),
      h(t(B), {
        small: "",
        disabled: e.elaborated,
        "data-question-elaborate": "",
        onClick: s[1] || (s[1] = (r) => c.$emit("elaborate"))
      }, {
        default: Q(() => [
          p(i(e.elaborated ? "Asked to elaborate" : "Elaborate"), 1)
        ]),
        _: 1
      }, 8, ["disabled"]),
      h(t(B), {
        variant: "primary",
        small: "",
        "data-question-answer": "",
        onClick: s[2] || (s[2] = (r) => c.$emit("answer"))
      }, {
        default: Q(() => [...s[4] || (s[4] = [
          p("Answer", -1)
        ])]),
        _: 1
      })
    ], 64));
  }
}, Ne = (e) => e.state === "open", X = (e) => e ? new Date(e).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 }) : "", Y = (e) => e.agent_name || `Agent ${e.session_agent_id}`, Z = (e) => e.row_model === "plan" ? e.row_id : null;
function _(e, { elaborate: c, close: s, elaborated: r }) {
  return [
    { label: "Open", group: "open", run: () => S(`questions:${e.id}`) },
    { label: r ? "Asked to elaborate" : "Elaborate", group: "own", disabled: r, reason: "Already asked", run: c },
    { label: "Close", group: "own", run: s }
  ];
}
function z(e, c, s) {
  const r = O(null), g = O(""), u = O(!1);
  async function q(m, V) {
    r.value = m, g.value = "";
    const v = await c(V);
    if (v.ok) return void s("changed");
    r.value = null, g.value = v.error;
  }
  const x = (m) => q({ state: "answered", answer: m }, ["question", "answer", String(e().id), "--answer", m]), C = () => q({ state: "closed" }, ["question", "close", String(e().id)]);
  async function A() {
    u.value = !0;
    const m = await c(["message", "send", `Elaborate on question ${e().id}: ask it again with more context on each option and which you would pick, and you choose.`]);
    m.ok || (u.value = !1, g.value = m.error);
  }
  return { settled: r, refusal: g, elaborated: u, answer: x, close: C, elaborate: A };
}
const ee = ["data-state"], te = { class: "head" }, oe = ["title", "data-question-open"], ne = ["datetime"], se = { class: "text" }, ae = {
  key: 0,
  class: "settled",
  "data-question-settled": ""
}, le = {
  key: 0,
  class: "context",
  "data-question-context": ""
}, ie = {
  class: "options",
  role: "radiogroup",
  "aria-label": "Options"
}, de = ["aria-checked", "data-question-option", "onClick"], re = { class: "option-text" }, ue = {
  key: 0,
  class: "star",
  "aria-label": "Recommended",
  "data-question-recommended": ""
}, ce = {
  key: 2,
  class: "failure",
  role: "alert",
  "data-question-failure": ""
}, me = {
  __name: "QuestionWindowCard",
  props: { row: { type: Object, required: !0 } },
  emits: ["changed"],
  setup(e, { emit: c }) {
    const s = e, r = c, g = j(), u = O(""), q = O(""), { settled: x, refusal: C, elaborated: A, answer: m, close: V, elaborate: v } = z(() => s.row, (E) => g.run(E), r), f = D(() => ({ ...s.row, ...x.value })), $ = D(() => q.value.trim() || u.value), l = Z(s.row), d = () => $.value && m($.value), T = () => _(s.row, { elaborate: v, close: V, elaborated: A.value }), F = (E) => {
      u.value = E, q.value = "";
    };
    return (E, w) => P((o(), n("section", {
      class: M(["card", { done: f.value.state !== "open" }]),
      "data-state": f.value.state,
      "data-question-card": ""
    }, [
      a("header", te, [
        a("button", {
          type: "button",
          class: "number",
          title: `Question ${e.row.id}`,
          "data-question-open": e.row.id,
          onClick: w[0] || (w[0] = (k) => t(S)(`questions:${e.row.id}`))
        }, i(e.row.id), 9, oe),
        h(t(G), {
          name: t(Y)(e.row),
          chip: "",
          "data-question-agent": ""
        }, null, 8, ["name"]),
        t(l) ? (o(), n("button", {
          key: 0,
          type: "button",
          class: "plan",
          "data-question-plan": "",
          onClick: w[1] || (w[1] = (k) => t(S)(`plans:${t(l)}`))
        }, "Plan " + i(t(l)), 1)) : b("", !0),
        w[3] || (w[3] = a("span", { class: "grow" }, null, -1)),
        f.value.state === "open" ? (o(), N(t(H), {
          key: 1,
          items: T(),
          head: `Question ${e.row.id}`,
          label: "More"
        }, null, 8, ["items", "head"])) : b("", !0),
        a("time", {
          class: "time",
          datetime: e.row.created_at,
          "data-question-time": ""
        }, i(t(X)(e.row.created_at)), 9, ne)
      ]),
      a("p", se, i(e.row.text), 1),
      f.value.state !== "open" ? (o(), n("p", ae, i(f.value.state === "answered" ? f.value.answer : "Closed"), 1)) : (o(), n(y, { key: 1 }, [
        e.row.context ? (o(), n("p", le, i(e.row.context), 1)) : b("", !0),
        a("div", ie, [
          (o(!0), n(y, null, U(e.row.options, (k) => (o(), n("button", {
            key: k,
            type: "button",
            role: "radio",
            class: "option",
            "aria-checked": u.value === k && !q.value.trim(),
            "data-question-option": k,
            onClick: (Be) => F(k)
          }, [
            w[4] || (w[4] = a("i", { class: "ring" }, null, -1)),
            a("span", re, i(k), 1),
            k === e.row.recommended ? (o(), n("span", ue, "★")) : b("", !0)
          ], 8, de))), 128))
        ]),
        a("form", {
          class: "form",
          onSubmit: W(d, ["prevent"])
        }, [
          h(t(R), {
            modelValue: q.value,
            "onUpdate:modelValue": w[2] || (w[2] = (k) => q.value = k),
            placeholder: "Other",
            "aria-label": "Other answer"
          }, null, 8, ["modelValue"]),
          h(t(B), {
            variant: "primary",
            small: "",
            type: "submit",
            "data-question-answer": "",
            disabled: !$.value
          }, {
            default: Q(() => [...w[5] || (w[5] = [
              p("Answer", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ], 32)
      ], 64)),
      t(C) ? (o(), n("p", ce, i(t(C)), 1)) : b("", !0)
    ], 10, ee)), [
      [t(J), () => ({ head: `Question ${e.row.id}`, items: T() })]
    ]);
  }
}, we = /* @__PURE__ */ L(me, [["__scopeId", "data-v-2d9fc1fa"]]), be = ["data-state"], qe = { class: "question-head" }, ve = {
  key: 0,
  class: "question-dot",
  "data-question-dot": ""
}, fe = { class: "question-label" }, ke = ["data-question-open"], ye = {
  key: 0,
  class: "question-context",
  "data-question-context": ""
}, he = {
  key: 1,
  class: "question-closed",
  "data-question-settled": ""
}, $e = { class: "question-answer" }, ge = { class: "question-options" }, Ce = ["data-question-option", "onClick"], pe = {
  key: 0,
  class: "question-ring"
}, xe = {
  key: 1,
  class: "question-tag"
}, Ae = { class: "question-option-text" }, Ve = {
  key: 2,
  class: "question-chip"
}, Oe = { class: "question-buttons" }, Qe = {
  key: 3,
  class: "question-failure",
  role: "alert",
  "data-question-failure": ""
}, Ee = {
  __name: "QuestionCard",
  props: { row: { type: Object, required: !0 }, flush: Boolean, window: Boolean },
  emits: ["changed"],
  setup(e, { emit: c }) {
    const s = e, r = c, g = j(), u = O(""), { settled: q, refusal: x, elaborated: C, answer: A, close: m, elaborate: V } = z(() => s.row, ($) => g.run($), r), v = () => ({ ...s.row, ...q.value });
    function f() {
      const $ = u.value.trim();
      $ && A($);
    }
    return ($, l) => e.window ? (o(), N(we, {
      key: 0,
      row: e.row,
      onChanged: l[0] || (l[0] = (d) => r("changed"))
    }, null, 8, ["row"])) : (o(), n("section", {
      key: 1,
      class: M(["question", { flush: e.flush }]),
      "data-state": v().state,
      "data-question-card": ""
    }, [
      a("header", qe, [
        e.flush ? (o(), n("i", ve)) : b("", !0),
        a("p", fe, "Question " + i(e.row.id), 1),
        h(t(K), {
          class: "question-time",
          at: e.row.created_at,
          "data-question-time": ""
        }, null, 8, ["at"])
      ]),
      a("button", {
        type: "button",
        class: "question-open",
        "data-question-open": e.row.id,
        onClick: l[1] || (l[1] = (d) => t(S)(`questions:${e.row.id}`))
      }, i(e.row.text), 9, ke),
      e.row.context ? (o(), n("p", ye, i(e.row.context), 1)) : b("", !0),
      v().state !== "open" ? (o(), n("p", he, [
        v().state === "answered" ? (o(), n(y, { key: 0 }, [
          e.flush ? (o(), n(y, { key: 0 }, [
            l[4] || (l[4] = a("b", { class: "question-answered" }, "Answered:", -1)),
            l[5] || (l[5] = p()),
            a("span", $e, i(v().answer), 1)
          ], 64)) : (o(), n(y, { key: 1 }, [
            p("Answered: " + i(v().answer), 1)
          ], 64))
        ], 64)) : (o(), n(y, { key: 1 }, [
          p("Closed")
        ], 64))
      ])) : (o(), n(y, { key: 2 }, [
        a("div", ge, [
          (o(!0), n(y, null, U(e.row.options, (d) => (o(), n("button", {
            key: d,
            type: "button",
            class: M(["question-option", { recommended: d === e.row.recommended }]),
            "data-question-option": d,
            onClick: (T) => t(A)(d)
          }, [
            e.flush ? (o(), n("i", pe)) : b("", !0),
            d === e.row.recommended && !e.flush ? (o(), n("span", xe, "Recommended")) : b("", !0),
            a("span", Ae, i(d), 1),
            d === e.row.recommended && e.flush ? (o(), n("span", Ve, "Recommended")) : b("", !0)
          ], 10, Ce))), 128))
        ]),
        a("form", {
          class: "question-form",
          onSubmit: W(f, ["prevent"])
        }, [
          e.flush ? (o(), n(y, { key: 0 }, [
            h(t(R), {
              modelValue: u.value,
              "onUpdate:modelValue": l[2] || (l[2] = (d) => u.value = d),
              class: "question-input",
              placeholder: "Or answer in your own words…"
            }, null, 8, ["modelValue"]),
            a("span", Oe, [
              h(I, {
                elaborated: t(C),
                onClose: t(m),
                onElaborate: t(V),
                onAnswer: f
              }, null, 8, ["elaborated", "onClose", "onElaborate"])
            ])
          ], 64)) : (o(), N(t(R), {
            key: 1,
            modelValue: u.value,
            "onUpdate:modelValue": l[3] || (l[3] = (d) => u.value = d),
            placeholder: "Or answer in your own words…"
          }, {
            end: Q(() => [
              h(I, {
                elaborated: t(C),
                onClose: t(m),
                onElaborate: t(V),
                onAnswer: f
              }, null, 8, ["elaborated", "onClose", "onElaborate"])
            ]),
            _: 1
          }, 8, ["modelValue"]))
        ], 32)
      ], 64)),
      t(x) ? (o(), n("p", Qe, i(t(x)), 1)) : b("", !0)
    ], 10, be));
  }
}, Re = /* @__PURE__ */ L(Ee, [["__scopeId", "data-v-d8bdf9ea"]]);
export {
  Re as Q,
  Ne as i
};
