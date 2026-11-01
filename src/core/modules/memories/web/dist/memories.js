/* @code-commandments-generated */
if (!document.getElementById("window-styles-f06400aac13c")) { const style = document.createElement("style"); style.id = "window-styles-f06400aac13c"; style.textContent = ".memories[data-v-17da7ba1],.memories-form[data-v-17da7ba1]{display:flex;flex-direction:column;gap:8px}.memories-form[data-v-17da7ba1]{align-items:flex-start}.memories-form textarea[data-v-17da7ba1]{width:100%}.memories-refusal[data-v-17da7ba1]{margin:0;color:var(--danger);font-size:12.5px}.memory[data-v-17da7ba1]{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0;padding:4px 0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.memory-kind[data-v-17da7ba1]{color:var(--text-3);font-size:12px}.memory-dock[data-v-19bd84d7]{display:flex;gap:8px;font-size:12px;line-height:1.45}.memory-dock-weight[data-v-19bd84d7]{color:var(--text-4)}.memory-round[data-v-0779e035]{margin:0 0 0 20px}.memory-round-rows[data-v-0779e035]{margin:0;padding:0;list-style:none}.memory-round-row[data-v-0779e035]{display:flex;flex-wrap:wrap;gap:2px 8px;padding:2px 0;color:var(--text-2);font-size:12px;line-height:1.45;overflow-wrap:anywhere}.memory-round-ref[data-v-0779e035]{padding:0;border:0;background:none;color:var(--accent-text);font:inherit;cursor:pointer}.memory-round-weight[data-v-0779e035]{color:var(--text-4)}\n"; document.head.appendChild(style); }
import { ref as i, openBlock as c, createElementBlock as y, createElementVNode as a, createVNode as r, unref as e, withCtx as f, createTextVNode as v, withModifiers as C, withDirectives as T, vModelText as V, createCommentVNode as k, toDisplayString as n } from "vue";
import { useWindow as M, useRows as B, useListTools as E, Btn as _, Segmented as L, ListTools as W, RowList as $, peekRef as D } from "@journal/window-kit";
import { _ as P } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const F = { class: "memories" }, I = { class: "memories-tools" }, O = {
  key: 1,
  class: "memories-refusal",
  role: "alert",
  "data-memory-refusal": ""
}, U = ["data-memory", "onClick"], Y = { class: "memory-text" }, j = { class: "memory-kind" }, q = {
  __name: "MemoryRows",
  setup(z) {
    const b = [
      { key: "fact", label: "Fact" },
      { key: "rule", label: "Rule" },
      { key: "reminder", label: "Reminder" }
    ], w = M(), { rows: x, failure: h, loaded: R, load: N, older: S } = B("memory list", ["memory.*"], { incremental: !0 }), p = E(x, { title: (l) => l.text, isOpen: (l) => l.state === "active" }), m = i(!1), s = i(""), d = i("fact"), u = i("");
    async function g() {
      const l = await w.run(["memory", "make", s.value.trim(), "--type", d.value]);
      u.value = l.ok ? "" : l.error, l.ok && (s.value = "", m.value = !1, N());
    }
    return (l, t) => (c(), y("div", F, [
      a("div", I, [
        r(e(_), {
          small: "",
          bordered: "",
          "data-memory-new": "",
          onClick: t[0] || (t[0] = (o) => m.value = !m.value)
        }, {
          default: f(() => [...t[3] || (t[3] = [
            v("New memory", -1)
          ])]),
          _: 1
        })
      ]),
      m.value ? (c(), y("form", {
        key: 0,
        class: "memories-form",
        "data-memory-form": "",
        onSubmit: C(g, ["prevent"])
      }, [
        T(a("textarea", {
          "onUpdate:modelValue": t[1] || (t[1] = (o) => s.value = o),
          rows: "2",
          placeholder: "What should be remembered?",
          "aria-label": "What should be remembered?"
        }, null, 512), [
          [V, s.value]
        ]),
        r(e(L), {
          options: b,
          value: d.value,
          onPick: t[2] || (t[2] = (o) => d.value = o)
        }, null, 8, ["value"]),
        r(e(_), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !s.value.trim()
        }, {
          default: f(() => [...t[4] || (t[4] = [
            v("Save it", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : k("", !0),
      u.value ? (c(), y("p", O, n(u.value), 1)) : k("", !0),
      r(e(W), {
        tools: e(p),
        placeholder: "Search the memories"
      }, null, 8, ["tools"]),
      r(e($), {
        rows: e(p).shown.value,
        failure: e(h),
        loaded: e(R),
        older: e(S),
        empty: "No memories yet"
      }, {
        default: f(({ row: o }) => [
          a("button", {
            type: "button",
            class: "memory",
            "data-memory": o.id,
            onClick: (A) => e(D)(`memories:${o.id}`)
          }, [
            a("span", Y, n(o.text), 1),
            a("span", j, n(o.type) + " · weight " + n(o.weight), 1)
          ], 8, U)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "older"])
    ]));
  }
}, K = /* @__PURE__ */ P(q, [["__scopeId", "data-v-17da7ba1"]]);
export {
  K as default
};
