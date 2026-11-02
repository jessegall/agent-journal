/* @code-commandments-generated */
if (!document.getElementById("window-styles-137b1aeeae6d")) { const style = document.createElement("style"); style.id = "window-styles-137b1aeeae6d"; style.textContent = ".question-dock[data-v-3f6f88a1]{display:flex;gap:8px;font-size:12px;line-height:1.45}.question-dock-state[data-v-3f6f88a1]{color:var(--text-4)}.question[data-v-a84f6908]{display:flex;flex:1;flex-direction:column;gap:8px;max-width:640px;margin-bottom:10px;padding:14px 16px 16px;border:1px solid var(--border-2);border-radius:12px;background:var(--raised);overflow-wrap:anywhere}.question-label[data-v-a84f6908]{margin:0;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.question-open[data-v-a84f6908]{padding:0;border:0;background:none;color:var(--text);font:inherit;font-size:14.5px;font-weight:600;line-height:1.4;text-align:left;cursor:pointer}.question-options[data-v-a84f6908]{display:flex;flex-direction:column;gap:6px}.question-option[data-v-a84f6908]{display:flex;flex-direction:column;overflow:hidden;padding:9px 12px;border:1px solid var(--border-2);border-radius:8px;background:var(--bg);color:var(--text);font:inherit;font-size:13px;text-align:left;cursor:pointer;transition:transform .12s ease,border-color .2s ease}.question-option[data-v-a84f6908]:hover{border-color:var(--accent)}.question-option[data-v-a84f6908]:active{transform:scale(.98)}.question-option.recommended[data-v-a84f6908]{border-color:color-mix(in srgb,var(--accent) 40%,var(--border-2))}.question-tag[data-v-a84f6908]{margin:-9px -12px 8px;padding:4px 12px;background:color-mix(in srgb,var(--accent) 16%,transparent);color:var(--accent-text);font-size:11px}.question-closed[data-v-a84f6908]{margin:0;color:var(--text-3);font-size:12.5px}.question-failure[data-v-a84f6908]{margin:0;color:var(--danger);font-size:12.5px}.waiting-heading[data-v-2998b0fd]{margin:0 8px 6px;font-size:12px;font-weight:600;color:var(--text-2)}.label[data-v-2998b0fd]{flex:1}.detail[data-v-2998b0fd]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as _, openBlock as i, createElementBlock as l, createVNode as u, unref as o, withCtx as p, createElementVNode as c, toDisplayString as r, Fragment as $, renderList as O, normalizeClass as A, createCommentVNode as V, withModifiers as B, createTextVNode as q } from "vue";
import { useRows as Q, useListTools as j, ListTools as I, RowList as U, peekRef as w, TextInput as z, Btn as k } from "@journal/window-kit";
import { _ as D } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const F = { class: "questions" }, M = ["data-state"], G = { class: "question-label" }, H = ["data-question-open", "onClick"], J = {
  key: 0,
  class: "question-closed",
  "data-question-settled": ""
}, K = { class: "question-options" }, P = ["data-question-option", "onClick"], W = {
  key: 0,
  class: "question-tag"
}, X = ["onSubmit"], Y = {
  key: 2,
  class: "question-failure",
  role: "alert",
  "data-question-failure": ""
}, Z = {
  __name: "QuestionRows",
  setup(ee) {
    const { rows: g, failure: N, loaded: R, load: E, context: h } = Q("question list", ["question.*"]), b = j(g, { title: (e) => e.text, isOpen: (e) => e.state === "open" }), f = _({}), m = _({}), a = _({}), d = _(/* @__PURE__ */ new Set()), v = (e) => ({ ...e, ...m.value[e.id] });
    async function y(e, n, t) {
      m.value = { ...m.value, [e.id]: n }, a.value = { ...a.value, [e.id]: "" };
      const s = await h.run(t);
      if (s.ok) return void E();
      m.value = Object.fromEntries(Object.entries(m.value).filter(([S]) => Number(S) !== e.id)), a.value = { ...a.value, [e.id]: s.error };
    }
    const C = (e, n) => y(e, { state: "answered", answer: n }, ["question", "answer", String(e.id), "--answer", n]), T = (e) => y(e, { state: "closed" }, ["question", "close", String(e.id)]);
    function x(e) {
      const n = (f.value[e.id] || "").trim();
      n && C(e, n);
    }
    async function L(e) {
      d.value = /* @__PURE__ */ new Set([...d.value, e.id]);
      const n = await h.run(["message", "send", `Elaborate on question ${e.id}: ask it again with more context on each option and which you would pick, and you choose.`]);
      n.ok || (d.value = new Set([...d.value].filter((t) => t !== e.id)), a.value = { ...a.value, [e.id]: n.error });
    }
    return (e, n) => (i(), l("div", F, [
      u(o(I), {
        tools: o(b),
        placeholder: "Search the questions"
      }, null, 8, ["tools"]),
      u(o(U), {
        rows: o(b).shown.value,
        failure: o(N),
        loaded: o(R),
        empty: "No open questions"
      }, {
        default: p(({ row: t }) => [
          c("section", {
            class: "question",
            "data-state": v(t).state
          }, [
            c("p", G, "Question " + r(t.id), 1),
            c("button", {
              type: "button",
              class: "question-open",
              "data-question-open": t.id,
              onClick: (s) => o(w)(`questions:${t.id}`)
            }, r(t.text), 9, H),
            v(t).state !== "open" ? (i(), l("p", J, r(v(t).state === "answered" ? `Answered: ${v(t).answer}` : "Closed"), 1)) : (i(), l($, { key: 1 }, [
              c("div", K, [
                (i(!0), l($, null, O(t.options, (s) => (i(), l("button", {
                  key: s,
                  type: "button",
                  class: A(["question-option", { recommended: s === t.recommended }]),
                  "data-question-option": s,
                  onClick: (S) => C(t, s)
                }, [
                  s === t.recommended ? (i(), l("span", W, "Recommended")) : V("", !0),
                  c("span", null, r(s), 1)
                ], 10, P))), 128))
              ]),
              c("form", {
                onSubmit: B((s) => x(t), ["prevent"])
              }, [
                u(o(z), {
                  modelValue: f.value[t.id],
                  "onUpdate:modelValue": (s) => f.value[t.id] = s,
                  placeholder: "Or answer in your own words…"
                }, {
                  end: p(() => [
                    u(o(k), {
                      small: "",
                      "data-question-close": "",
                      onClick: (s) => T(t)
                    }, {
                      default: p(() => [...n[0] || (n[0] = [
                        q("Close", -1)
                      ])]),
                      _: 1
                    }, 8, ["onClick"]),
                    u(o(k), {
                      small: "",
                      disabled: d.value.has(t.id),
                      "data-question-elaborate": "",
                      onClick: (s) => L(t)
                    }, {
                      default: p(() => [
                        q(r(d.value.has(t.id) ? "Asked to elaborate" : "Elaborate"), 1)
                      ]),
                      _: 2
                    }, 1032, ["disabled", "onClick"]),
                    u(o(k), {
                      kind: "primary",
                      small: "",
                      "data-question-answer": "",
                      onClick: (s) => x(t)
                    }, {
                      default: p(() => [...n[1] || (n[1] = [
                        q("Answer", -1)
                      ])]),
                      _: 1
                    }, 8, ["onClick"])
                  ]),
                  _: 2
                }, 1032, ["modelValue", "onUpdate:modelValue"])
              ], 40, X)
            ], 64)),
            a.value[t.id] ? (i(), l("p", Y, r(a.value[t.id]), 1)) : V("", !0)
          ], 8, M)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ]));
  }
}, oe = /* @__PURE__ */ D(Z, [["__scopeId", "data-v-a84f6908"]]);
export {
  oe as default
};
