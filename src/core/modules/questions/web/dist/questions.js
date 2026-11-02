/* @code-commandments-generated */
if (!document.getElementById("window-styles-f714a599f460")) { const style = document.createElement("style"); style.id = "window-styles-f714a599f460"; style.textContent = ".question-dock[data-v-3f6f88a1]{display:flex;gap:8px;font-size:12px;line-height:1.45}.question-dock-state[data-v-3f6f88a1]{color:var(--text-4)}.question[data-v-fe5a9afb]{display:flex;flex:1;flex-direction:column;gap:8px;max-width:640px;margin-bottom:10px;padding:14px 16px 16px;border:1px solid var(--border-2);border-radius:12px;background:var(--raised);overflow-wrap:anywhere}.question-head[data-v-fe5a9afb]{display:flex;align-items:baseline;justify-content:space-between;gap:12px}.question-time[data-v-fe5a9afb]{flex:none;color:var(--text-3);font-size:11.5px}.question-label[data-v-fe5a9afb]{margin:0;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.question-open[data-v-fe5a9afb]{padding:0;border:0;background:none;color:var(--text);font:inherit;font-size:14.5px;font-weight:600;line-height:1.4;text-align:left;cursor:pointer}.question-options[data-v-fe5a9afb]{display:flex;flex-direction:column;gap:6px}.question-option[data-v-fe5a9afb]{display:flex;flex-direction:column;overflow:hidden;padding:9px 12px;border:1px solid var(--border-2);border-radius:8px;background:var(--bg);color:var(--text);font:inherit;font-size:13px;text-align:left;cursor:pointer;transition:transform .12s ease,border-color .2s ease}.question-option[data-v-fe5a9afb]:hover{border-color:var(--accent)}.question-option[data-v-fe5a9afb]:active{transform:scale(.98)}.question-option.recommended[data-v-fe5a9afb]{border-color:color-mix(in srgb,var(--accent) 40%,var(--border-2))}.question-tag[data-v-fe5a9afb]{margin:-9px -12px 8px;padding:4px 12px;background:color-mix(in srgb,var(--accent) 16%,transparent);color:var(--accent-text);font-size:11px}.question-closed[data-v-fe5a9afb]{margin:0;color:var(--text-3);font-size:12.5px}.question-failure[data-v-fe5a9afb]{margin:0;color:var(--danger);font-size:12.5px}.waiting-heading[data-v-2998b0fd]{margin:0 8px 6px;font-size:12px;font-weight:600;color:var(--text-2)}.label[data-v-2998b0fd]{flex:1}.detail[data-v-2998b0fd]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as v, openBlock as l, createElementBlock as d, createVNode as r, unref as n, withCtx as _, createElementVNode as i, toDisplayString as u, Fragment as g, renderList as O, normalizeClass as A, createCommentVNode as $, withModifiers as B, createTextVNode as q } from "vue";
import { useRows as Q, useListTools as j, ListTools as D, RowList as I, ago as U, peekRef as z, TextInput as F, Btn as h } from "@journal/window-kit";
import { _ as M } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const G = { class: "questions" }, H = ["data-state"], J = { class: "question-head" }, K = { class: "question-label" }, P = ["datetime", "title"], W = ["data-question-open", "onClick"], X = {
  key: 0,
  class: "question-closed",
  "data-question-settled": ""
}, Y = { class: "question-options" }, Z = ["data-question-option", "onClick"], w = {
  key: 0,
  class: "question-tag"
}, ee = ["onSubmit"], te = {
  key: 2,
  class: "question-failure",
  role: "alert",
  "data-question-failure": ""
}, se = {
  __name: "QuestionRows",
  setup(ae) {
    const { rows: V, failure: N, loaded: R, load: E, context: k } = Q("question list --all", ["question.*"]), b = j(V, { title: (t) => t.text, isOpen: (t) => t.state === "open" }), f = v({}), m = v({}), o = v({}), c = v(/* @__PURE__ */ new Set()), p = (t) => ({ ...t, ...m.value[t.id] });
    async function y(t, a, e) {
      m.value = { ...m.value, [t.id]: a }, o.value = { ...o.value, [t.id]: "" };
      const s = await k.run(e);
      if (s.ok) return void E();
      m.value = Object.fromEntries(Object.entries(m.value).filter(([S]) => Number(S) !== t.id)), o.value = { ...o.value, [t.id]: s.error };
    }
    const C = (t, a) => y(t, { state: "answered", answer: a }, ["question", "answer", String(t.id), "--answer", a]), L = (t) => y(t, { state: "closed" }, ["question", "close", String(t.id)]);
    function x(t) {
      const a = (f.value[t.id] || "").trim();
      a && C(t, a);
    }
    async function T(t) {
      c.value = /* @__PURE__ */ new Set([...c.value, t.id]);
      const a = await k.run(["message", "send", `Elaborate on question ${t.id}: ask it again with more context on each option and which you would pick, and you choose.`]);
      a.ok || (c.value = new Set([...c.value].filter((e) => e !== t.id)), o.value = { ...o.value, [t.id]: a.error });
    }
    return (t, a) => (l(), d("div", G, [
      r(n(D), {
        tools: n(b),
        placeholder: "Search the questions"
      }, null, 8, ["tools"]),
      r(n(I), {
        rows: n(b).shown.value,
        failure: n(N),
        loaded: n(R),
        empty: "No open questions"
      }, {
        default: _(({ row: e }) => [
          i("section", {
            class: "question",
            "data-state": p(e).state
          }, [
            i("header", J, [
              i("p", K, "Question " + u(e.id), 1),
              i("time", {
                class: "question-time",
                datetime: e.created_at,
                title: new Date(e.created_at).toLocaleString(),
                "data-question-time": ""
              }, u(n(U)(e.created_at)), 9, P)
            ]),
            i("button", {
              type: "button",
              class: "question-open",
              "data-question-open": e.id,
              onClick: (s) => n(z)(`questions:${e.id}`)
            }, u(e.text), 9, W),
            p(e).state !== "open" ? (l(), d("p", X, u(p(e).state === "answered" ? `Answered: ${p(e).answer}` : "Closed"), 1)) : (l(), d(g, { key: 1 }, [
              i("div", Y, [
                (l(!0), d(g, null, O(e.options, (s) => (l(), d("button", {
                  key: s,
                  type: "button",
                  class: A(["question-option", { recommended: s === e.recommended }]),
                  "data-question-option": s,
                  onClick: (S) => C(e, s)
                }, [
                  s === e.recommended ? (l(), d("span", w, "Recommended")) : $("", !0),
                  i("span", null, u(s), 1)
                ], 10, Z))), 128))
              ]),
              i("form", {
                onSubmit: B((s) => x(e), ["prevent"])
              }, [
                r(n(F), {
                  modelValue: f.value[e.id],
                  "onUpdate:modelValue": (s) => f.value[e.id] = s,
                  placeholder: "Or answer in your own words…"
                }, {
                  end: _(() => [
                    r(n(h), {
                      small: "",
                      "data-question-close": "",
                      onClick: (s) => L(e)
                    }, {
                      default: _(() => [...a[0] || (a[0] = [
                        q("Close", -1)
                      ])]),
                      _: 1
                    }, 8, ["onClick"]),
                    r(n(h), {
                      small: "",
                      disabled: c.value.has(e.id),
                      "data-question-elaborate": "",
                      onClick: (s) => T(e)
                    }, {
                      default: _(() => [
                        q(u(c.value.has(e.id) ? "Asked to elaborate" : "Elaborate"), 1)
                      ]),
                      _: 2
                    }, 1032, ["disabled", "onClick"]),
                    r(n(h), {
                      kind: "primary",
                      small: "",
                      "data-question-answer": "",
                      onClick: (s) => x(e)
                    }, {
                      default: _(() => [...a[1] || (a[1] = [
                        q("Answer", -1)
                      ])]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  _: 2
                }, 1032, ["modelValue", "onUpdate:modelValue"])
              ], 40, ee)
            ], 64)),
            o.value[e.id] ? (l(), d("p", te, u(o.value[e.id]), 1)) : $("", !0)
          ], 8, H)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ]));
  }
}, le = /* @__PURE__ */ M(se, [["__scopeId", "data-v-fe5a9afb"]]);
export {
  le as default
};
