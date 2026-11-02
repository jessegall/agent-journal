/* @code-commandments-generated */
if (!document.getElementById("window-styles-0998ff0cca95")) { const style = document.createElement("style"); style.id = "window-styles-0998ff0cca95"; style.textContent = ".memories[data-v-27f37bdb],.memories-form[data-v-27f37bdb]{display:flex;flex-direction:column;gap:8px}.memories-form[data-v-27f37bdb]{align-items:flex-start}.memories-form textarea[data-v-27f37bdb]{width:100%}.memories-refusal[data-v-27f37bdb]{margin:0;color:var(--danger);font-size:12.5px}.memory[data-v-27f37bdb]{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0;padding:4px 0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.memory-kind[data-v-27f37bdb]{color:var(--text-3);font-size:12px}.memories-page[data-v-e72d53ed]{display:flex;flex-direction:column;gap:8px;align-items:flex-start}.memories-page[data-v-e72d53ed]>.memories{align-self:stretch}.memory-dock[data-v-19bd84d7]{display:flex;gap:8px;font-size:12px;line-height:1.45}.memory-dock-weight[data-v-19bd84d7]{color:var(--text-4)}.memory-round[data-v-03fe1c3a]{margin:0 0 0 20px}.memory-round-rows[data-v-03fe1c3a]{margin:0;padding:0;list-style:none}.memory-round-row[data-v-03fe1c3a]{display:flex;flex-wrap:wrap;gap:2px 8px;padding:2px 0;color:var(--text-2);font-size:12px;line-height:1.45;overflow-wrap:anywhere}.memory-round-ref[data-v-03fe1c3a]{padding:0;border:0;background:none;color:var(--accent-text);font:inherit;cursor:pointer}.memory-round-weight[data-v-03fe1c3a]{color:var(--text-4)}\n"; document.head.appendChild(style); }
import { ref as i, openBlock as u, createElementBlock as y, createElementVNode as m, createVNode as n, unref as e, withCtx as x, createTextVNode as R, withModifiers as E, withDirectives as W, vModelText as A, createCommentVNode as S, toDisplayString as p, computed as D, createBlock as I } from "vue";
import { useWindow as N, useRows as C, useListTools as j, Btn as M, Segmented as L, ListTools as F, RowList as O, peekRef as U } from "@journal/window-kit";
import { _ as P } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const Y = { class: "memories" }, q = { class: "memories-tools" }, z = {
  key: 1,
  class: "memories-refusal",
  role: "alert",
  "data-memory-refusal": ""
}, G = ["data-memory", "onClick"], H = { class: "memory-text" }, J = { class: "memory-kind" }, K = {
  __name: "MemoryRows",
  props: { environment: { type: String, default: "" } },
  setup(h) {
    const f = [
      { key: "fact", label: "Fact" },
      { key: "rule", label: "Rule" },
      { key: "reminder", label: "Reminder" }
    ], d = h, a = d.environment ? ["--environment", d.environment] : [], _ = N(), { rows: l, failure: c, loaded: k, more: T, load: V, older: $ } = C(["memory list", ...a].join(" "), ["memory.*"], { incremental: !0 }), g = j(l, { title: (s) => s.text, isOpen: (s) => s.state === "active" }), v = i(!1), r = i(""), b = i("fact"), w = i("");
    async function B() {
      const s = await _.run(["memory", "make", r.value.trim(), "--type", b.value, ...a]);
      w.value = s.ok ? "" : s.error, s.ok && (r.value = "", v.value = !1, V());
    }
    return (s, t) => (u(), y("div", Y, [
      m("div", q, [
        n(e(M), {
          small: "",
          bordered: "",
          "data-memory-new": "",
          onClick: t[0] || (t[0] = (o) => v.value = !v.value)
        }, {
          default: x(() => [...t[3] || (t[3] = [
            R("New memory", -1)
          ])]),
          _: 1
        })
      ]),
      v.value ? (u(), y("form", {
        key: 0,
        class: "memories-form",
        "data-memory-form": "",
        onSubmit: E(B, ["prevent"])
      }, [
        W(m("textarea", {
          "onUpdate:modelValue": t[1] || (t[1] = (o) => r.value = o),
          rows: "2",
          placeholder: "What should be remembered?",
          "aria-label": "What should be remembered?"
        }, null, 512), [
          [A, r.value]
        ]),
        n(e(L), {
          options: f,
          value: b.value,
          onPick: t[2] || (t[2] = (o) => b.value = o)
        }, null, 8, ["value"]),
        n(e(M), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !r.value.trim()
        }, {
          default: x(() => [...t[4] || (t[4] = [
            R("Save it", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : S("", !0),
      w.value ? (u(), y("p", z, p(w.value), 1)) : S("", !0),
      n(e(F), {
        tools: e(g),
        placeholder: "Search the memories"
      }, null, 8, ["tools"]),
      n(e(O), {
        rows: e(g).shown.value,
        failure: e(c),
        loaded: e(k),
        more: e(T),
        older: e($),
        empty: "No memories yet"
      }, {
        default: x(({ row: o }) => [
          m("button", {
            type: "button",
            class: "memory",
            "data-memory": o.id,
            onClick: (te) => e(U)(`memories:${o.id}`)
          }, [
            m("span", H, p(o.text), 1),
            m("span", J, p(o.type) + " · weight " + p(o.weight), 1)
          ], 8, G)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older"])
    ]));
  }
}, Q = /* @__PURE__ */ P(K, [["__scopeId", "data-v-27f37bdb"]]), X = { class: "memories-page" }, Z = "", ee = {
  __name: "MemoriesPage",
  setup(h) {
    const f = N(), { rows: d } = C("environment list", ["environment.*"]), a = i(f.environment), _ = D(() => [{ key: Z, label: "All" }, ...d.value.map((l) => ({ key: l.name, label: l.name }))]);
    return (l, c) => (u(), y("div", X, [
      n(e(L), {
        options: _.value,
        value: a.value,
        "data-memory-tabs": "",
        onPick: c[0] || (c[0] = (k) => a.value = k)
      }, null, 8, ["options", "value"]),
      (u(), I(Q, {
        key: a.value,
        environment: a.value
      }, null, 8, ["environment"]))
    ]));
  }
}, ne = /* @__PURE__ */ P(ee, [["__scopeId", "data-v-e72d53ed"]]);
export {
  ne as default
};
