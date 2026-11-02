/* @code-commandments-generated */
if (!document.getElementById("window-styles-ba8e5f85d497")) { const style = document.createElement("style"); style.id = "window-styles-ba8e5f85d497"; style.textContent = ".memories[data-v-b76e1645],.memories-form[data-v-b76e1645]{display:flex;flex-direction:column;gap:8px}.memories-form[data-v-b76e1645]{align-items:flex-start}.memories-form textarea[data-v-b76e1645]{width:100%}.memories-refusal[data-v-b76e1645]{margin:0;color:var(--danger);font-size:12.5px}.memory[data-v-b76e1645]{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0;padding:4px 0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.memory-kind[data-v-b76e1645]{color:var(--text-3);font-size:12px}.memories-page[data-v-e72d53ed]{display:flex;flex-direction:column;gap:8px;align-items:flex-start}.memories-page[data-v-e72d53ed]>.memories{align-self:stretch}.memory-dock[data-v-19bd84d7]{display:flex;gap:8px;font-size:12px;line-height:1.45}.memory-dock-weight[data-v-19bd84d7]{color:var(--text-4)}.memory-round[data-v-0779e035]{margin:0 0 0 20px}.memory-round-rows[data-v-0779e035]{margin:0;padding:0;list-style:none}.memory-round-row[data-v-0779e035]{display:flex;flex-wrap:wrap;gap:2px 8px;padding:2px 0;color:var(--text-2);font-size:12px;line-height:1.45;overflow-wrap:anywhere}.memory-round-ref[data-v-0779e035]{padding:0;border:0;background:none;color:var(--accent-text);font:inherit;cursor:pointer}.memory-round-weight[data-v-0779e035]{color:var(--text-4)}\n"; document.head.appendChild(style); }
import { ref as i, openBlock as u, createElementBlock as y, createElementVNode as m, createVNode as n, unref as e, withCtx as x, createTextVNode as R, withModifiers as B, withDirectives as E, vModelText as W, createCommentVNode as S, toDisplayString as p, computed as A, createBlock as D } from "vue";
import { useWindow as N, useRows as C, useListTools as I, Btn as M, Segmented as L, ListTools as j, RowList as F, peekRef as O } from "@journal/window-kit";
import { _ as P } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const U = { class: "memories" }, Y = { class: "memories-tools" }, q = {
  key: 1,
  class: "memories-refusal",
  role: "alert",
  "data-memory-refusal": ""
}, z = ["data-memory", "onClick"], G = { class: "memory-text" }, H = { class: "memory-kind" }, J = {
  __name: "MemoryRows",
  props: { environment: { type: String, default: "" } },
  setup(h) {
    const f = [
      { key: "fact", label: "Fact" },
      { key: "rule", label: "Rule" },
      { key: "reminder", label: "Reminder" }
    ], d = h, a = d.environment ? ["--environment", d.environment] : [], _ = N(), { rows: l, failure: c, loaded: k, load: T, older: V } = C(["memory list", ...a].join(" "), ["memory.*"], { incremental: !0 }), g = I(l, { title: (s) => s.text, isOpen: (s) => s.state === "active" }), v = i(!1), r = i(""), b = i("fact"), w = i("");
    async function $() {
      const s = await _.run(["memory", "make", r.value.trim(), "--type", b.value, ...a]);
      w.value = s.ok ? "" : s.error, s.ok && (r.value = "", v.value = !1, T());
    }
    return (s, t) => (u(), y("div", U, [
      m("div", Y, [
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
        onSubmit: B($, ["prevent"])
      }, [
        E(m("textarea", {
          "onUpdate:modelValue": t[1] || (t[1] = (o) => r.value = o),
          rows: "2",
          placeholder: "What should be remembered?",
          "aria-label": "What should be remembered?"
        }, null, 512), [
          [W, r.value]
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
      w.value ? (u(), y("p", q, p(w.value), 1)) : S("", !0),
      n(e(j), {
        tools: e(g),
        placeholder: "Search the memories"
      }, null, 8, ["tools"]),
      n(e(F), {
        rows: e(g).shown.value,
        failure: e(c),
        loaded: e(k),
        older: e(V),
        empty: "No memories yet"
      }, {
        default: x(({ row: o }) => [
          m("button", {
            type: "button",
            class: "memory",
            "data-memory": o.id,
            onClick: (ee) => e(O)(`memories:${o.id}`)
          }, [
            m("span", G, p(o.text), 1),
            m("span", H, p(o.type) + " · weight " + p(o.weight), 1)
          ], 8, z)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "older"])
    ]));
  }
}, K = /* @__PURE__ */ P(J, [["__scopeId", "data-v-b76e1645"]]), Q = { class: "memories-page" }, X = "", Z = {
  __name: "MemoriesPage",
  setup(h) {
    const f = N(), { rows: d } = C("environment list", ["environment.*"]), a = i(f.environment), _ = A(() => [{ key: X, label: "All" }, ...d.value.map((l) => ({ key: l.name, label: l.name }))]);
    return (l, c) => (u(), y("div", Q, [
      n(e(L), {
        options: _.value,
        value: a.value,
        "data-memory-tabs": "",
        onPick: c[0] || (c[0] = (k) => a.value = k)
      }, null, 8, ["options", "value"]),
      (u(), D(K, {
        key: a.value,
        environment: a.value
      }, null, 8, ["environment"]))
    ]));
  }
}, ae = /* @__PURE__ */ P(Z, [["__scopeId", "data-v-e72d53ed"]]);
export {
  ae as default
};
