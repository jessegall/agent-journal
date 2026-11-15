import { computed as u, ref as p, watch as x, openBlock as l, createBlock as B, unref as c, withCtx as v, createElementVNode as s, createElementBlock as n, createCommentVNode as k, Fragment as C, renderList as M, createTextVNode as _, toDisplayString as b, withModifiers as N, createVNode as h } from "vue";
import { useWindow as S, eventMayBeChildOf as A, InspectorPart as F, TextInput as I, Btn as T } from "@journal/window-kit";
import { _ as $ } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const E = {
  class: "memory-facts",
  "data-memory-keywords": ""
}, O = {
  key: 0,
  class: "memory-none"
}, j = { class: "memory-words" }, D = ["aria-label", "onClick"], K = {
  key: 1,
  class: "memory-refusal",
  role: "alert"
}, L = {
  __name: "MemoryFacts",
  props: { row: { type: Object, default: null } },
  setup(V) {
    const o = S(), y = V, m = y.row ? u(() => y.row) : o.option("row"), d = u(() => `keywords.${m.value.id}`), w = u(() => o.props[d.value].rows.value), r = p(""), i = p("");
    async function f(t) {
      const e = await o.run(t);
      return i.value = e.ok ? "" : e.error, e.ok && o.reload(d.value), e.ok;
    }
    async function g() {
      r.value.trim() && await f(["memory-keyword", "make", String(m.value.id), r.value.trim()]) && (r.value = "");
    }
    return x(d, (t) => o.reload(t), { immediate: !0 }), o.follow(["memory_keyword.*"], (t) => A(t, "memory_id", /* @__PURE__ */ new Set([m.value.id])) && o.reload(d.value)), (t, e) => (l(), B(c(F), { title: "Keywords" }, {
      default: v(() => [
        s("section", E, [
          w.value.length ? k("", !0) : (l(), n("p", O, "No keywords: this memory comes back only as the conversation fills up.")),
          s("div", j, [
            (l(!0), n(C, null, M(w.value, (a) => (l(), n("span", {
              key: a.id,
              class: "memory-word",
              "data-memory-word": ""
            }, [
              _(b(a.word), 1),
              s("button", {
                type: "button",
                class: "memory-word-off",
                "aria-label": `Take off ${a.word}`,
                "data-memory-word-off": "",
                onClick: (P) => f(["memory-keyword", "delete", String(a.id)])
              }, "×", 8, D)
            ]))), 128))
          ]),
          s("form", {
            class: "memory-add",
            "data-memory-word-form": "",
            onSubmit: N(g, ["prevent"])
          }, [
            h(c(I), {
              modelValue: r.value,
              "onUpdate:modelValue": e[0] || (e[0] = (a) => r.value = a),
              class: "memory-word-input",
              placeholder: "Add a word",
              "aria-label": "Add a word"
            }, null, 8, ["modelValue"]),
            h(c(T), {
              small: "",
              type: "submit",
              disabled: !r.value.trim()
            }, {
              default: v(() => [...e[1] || (e[1] = [
                _("Add", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ], 32),
          i.value ? (l(), n("p", K, b(i.value), 1)) : k("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, z = /* @__PURE__ */ $(L, [["__scopeId", "data-v-09dd9f4c"]]);
export {
  z as M
};
