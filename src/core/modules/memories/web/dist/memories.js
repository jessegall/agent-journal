/* @code-commandments-generated */
if (!document.getElementById("window-styles-5934e77a955f")) { const style = document.createElement("style"); style.id = "window-styles-5934e77a955f"; style.textContent = ".memories[data-v-ad91c901],.memories-form[data-v-ad91c901]{display:flex;flex-direction:column;gap:8px}.memories-form[data-v-ad91c901]{align-items:flex-start}.memories-form textarea[data-v-ad91c901]{width:100%}.memories-refusal[data-v-ad91c901]{margin:0;color:var(--danger);font-size:12.5px}.memory[data-v-ad91c901]{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0;padding:4px 0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.memory-kind[data-v-ad91c901]{color:var(--text-3);font-size:12px}.memory-dock[data-v-19bd84d7]{display:flex;gap:8px;font-size:12px;line-height:1.45}.memory-dock-weight[data-v-19bd84d7]{color:var(--text-4)}.memory-round[data-v-0779e035]{margin:0 0 0 20px}.memory-round-rows[data-v-0779e035]{margin:0;padding:0;list-style:none}.memory-round-row[data-v-0779e035]{display:flex;flex-wrap:wrap;gap:2px 8px;padding:2px 0;color:var(--text-2);font-size:12px;line-height:1.45;overflow-wrap:anywhere}.memory-round-ref[data-v-0779e035]{padding:0;border:0;background:none;color:var(--accent-text);font:inherit;cursor:pointer}.memory-round-weight[data-v-0779e035]{color:var(--text-4)}\n"; document.head.appendChild(style); }
import { ref as i, openBlock as c, createElementBlock as y, createElementVNode as l, createVNode as r, unref as o, withCtx as f, createTextVNode as v, withModifiers as g, withDirectives as C, vModelText as T, createCommentVNode as k, toDisplayString as n } from "vue";
import { useWindow as V, useRows as M, useListTools as B, Btn as _, Segmented as E, ListTools as L, RowList as W, peekRef as $ } from "@journal/window-kit";
import { _ as D } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const P = { class: "memories" }, F = { class: "memories-tools" }, I = {
  key: 1,
  class: "memories-refusal",
  role: "alert",
  "data-memory-refusal": ""
}, O = ["data-memory", "onClick"], U = { class: "memory-text" }, Y = { class: "memory-kind" }, j = {
  __name: "MemoryRows",
  setup(q) {
    const b = [
      { key: "fact", label: "Fact" },
      { key: "rule", label: "Rule" },
      { key: "reminder", label: "Reminder" }
    ], w = V(), { rows: x, failure: h, loaded: R, load: N } = M("memory list", ["memory.*"]), p = B(x, { title: (s) => s.text, isOpen: (s) => s.state === "active" }), m = i(!1), a = i(""), d = i("fact"), u = i("");
    async function S() {
      const s = await w.run(["memory", "make", a.value.trim(), "--type", d.value]);
      u.value = s.ok ? "" : s.error, s.ok && (a.value = "", m.value = !1, N());
    }
    return (s, e) => (c(), y("div", P, [
      l("div", F, [
        r(o(_), {
          small: "",
          bordered: "",
          "data-memory-new": "",
          onClick: e[0] || (e[0] = (t) => m.value = !m.value)
        }, {
          default: f(() => [...e[3] || (e[3] = [
            v("New memory", -1)
          ])]),
          _: 1
        })
      ]),
      m.value ? (c(), y("form", {
        key: 0,
        class: "memories-form",
        "data-memory-form": "",
        onSubmit: g(S, ["prevent"])
      }, [
        C(l("textarea", {
          "onUpdate:modelValue": e[1] || (e[1] = (t) => a.value = t),
          rows: "2",
          placeholder: "What should be remembered?",
          "aria-label": "What should be remembered?"
        }, null, 512), [
          [T, a.value]
        ]),
        r(o(E), {
          options: b,
          value: d.value,
          onPick: e[2] || (e[2] = (t) => d.value = t)
        }, null, 8, ["value"]),
        r(o(_), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !a.value.trim()
        }, {
          default: f(() => [...e[4] || (e[4] = [
            v("Save it", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : k("", !0),
      u.value ? (c(), y("p", I, n(u.value), 1)) : k("", !0),
      r(o(L), {
        tools: o(p),
        placeholder: "Search the memories"
      }, null, 8, ["tools"]),
      r(o(W), {
        rows: o(p).shown.value,
        failure: o(h),
        loaded: o(R),
        empty: "No memories yet"
      }, {
        default: f(({ row: t }) => [
          l("button", {
            type: "button",
            class: "memory",
            "data-memory": t.id,
            onClick: (z) => o($)(`memories:${t.id}`)
          }, [
            l("span", U, n(t.text), 1),
            l("span", Y, n(t.type) + " · weight " + n(t.weight), 1)
          ], 8, O)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ]));
  }
}, J = /* @__PURE__ */ D(j, [["__scopeId", "data-v-ad91c901"]]);
export {
  J as default
};
