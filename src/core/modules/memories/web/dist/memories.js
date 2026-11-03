/* @code-commandments-generated */
if (!document.getElementById("window-styles-dd0a30a3ecf6")) { const style = document.createElement("style"); style.id = "window-styles-dd0a30a3ecf6"; style.textContent = ".memories[data-v-a3ef6a6c],.memories-form[data-v-a3ef6a6c]{display:flex;flex-direction:column;gap:8px}.memories-form[data-v-a3ef6a6c]{align-items:flex-start}.memories-form textarea[data-v-a3ef6a6c]{width:100%}.memories-refusal[data-v-a3ef6a6c]{margin:0;color:var(--danger);font-size:12.5px}.memory[data-v-a3ef6a6c]{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0;padding:4px 0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.memory-kind[data-v-a3ef6a6c]{color:var(--text-3);font-size:12px}.memories-page[data-v-e72d53ed]{display:flex;flex-direction:column;gap:8px;align-items:flex-start}.memories-page[data-v-e72d53ed]>.memories{align-self:stretch}.memory-dock[data-v-19bd84d7]{display:flex;gap:8px;font-size:12px;line-height:1.45}.memory-dock-weight[data-v-19bd84d7]{color:var(--text-4)}.memory-round[data-v-03fe1c3a]{margin:0 0 0 20px}.memory-round-rows[data-v-03fe1c3a]{margin:0;padding:0;list-style:none}.memory-round-row[data-v-03fe1c3a]{display:flex;flex-wrap:wrap;gap:2px 8px;padding:2px 0;color:var(--text-2);font-size:12px;line-height:1.45;overflow-wrap:anywhere}.memory-round-ref[data-v-03fe1c3a]{padding:0;border:0;background:none;color:var(--accent-text);font:inherit;cursor:pointer}.memory-round-weight[data-v-03fe1c3a]{color:var(--text-4)}\n"; document.head.appendChild(style); }
import { ref as i, openBlock as u, createElementBlock as y, createElementVNode as m, createVNode as n, unref as e, withCtx as x, createTextVNode as R, withModifiers as A, withDirectives as E, vModelText as W, createCommentVNode as M, toDisplayString as p, computed as j, createBlock as D } from "vue";
import { useWindow as S, useRows as C, useListTools as I, Btn as N, Segmented as L, ListTools as F, RowList as O, peekRef as U } from "@journal/window-kit";
import { _ as P } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const Y = { class: "memories" }, q = { class: "memories-tools" }, z = {
  key: 1,
  class: "memories-refusal",
  role: "alert",
  "data-memory-refusal": ""
}, G = ["data-memory", "onClick"], H = { class: "memory-text" }, J = { class: "memory-kind" }, K = {
  __name: "MemoryRows",
  props: { environment: { type: String, default: "" } },
  setup(g) {
    const f = [
      { key: "fact", label: "Fact" },
      { key: "rule", label: "Rule" },
      { key: "reminder", label: "Reminder" }
    ], d = g, a = d.environment ? ["--environment", d.environment] : [], k = S(), { rows: r, failure: c, loaded: _, more: T, load: V, older: $ } = C(["memory list", ...a].join(" "), ["memory.*"], { incremental: !0 }), b = I(r, { title: (s) => s.text, isOpen: (s) => s.state === "active" }), v = i(!1), l = i(""), w = i("fact"), h = i("");
    async function B() {
      const s = await k.run(["memory", "make", l.value.trim(), "--type", w.value, ...a]);
      h.value = s.ok ? "" : s.error, s.ok && (l.value = "", v.value = !1, V());
    }
    return (s, t) => (u(), y("div", Y, [
      m("div", q, [
        n(e(N), {
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
        onSubmit: A(B, ["prevent"])
      }, [
        E(m("textarea", {
          "onUpdate:modelValue": t[1] || (t[1] = (o) => l.value = o),
          rows: "2",
          placeholder: "What should be remembered?",
          "aria-label": "What should be remembered?"
        }, null, 512), [
          [W, l.value]
        ]),
        n(e(L), {
          options: f,
          value: w.value,
          onPick: t[2] || (t[2] = (o) => w.value = o)
        }, null, 8, ["value"]),
        n(e(N), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !l.value.trim()
        }, {
          default: x(() => [...t[4] || (t[4] = [
            R("Save it", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : M("", !0),
      h.value ? (u(), y("p", z, p(h.value), 1)) : M("", !0),
      n(e(F), { tools: e(b) }, null, 8, ["tools"]),
      n(e(O), {
        rows: e(b).shown.value,
        failure: e(c),
        loaded: e(_),
        more: e(T),
        older: e($),
        empty: "No memories yet",
        hint: "A memory an agent or you keep with journal memory make shows here.",
        searching: e(b).filtering.value
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
      }, 8, ["rows", "failure", "loaded", "more", "older", "searching"])
    ]));
  }
}, Q = /* @__PURE__ */ P(K, [["__scopeId", "data-v-a3ef6a6c"]]), X = { class: "memories-page" }, Z = "", ee = {
  __name: "MemoriesPage",
  setup(g) {
    const f = S(), { rows: d } = C("environment list", ["environment.*"]), a = i(f.environment), k = j(() => [{ key: Z, label: "All" }, ...d.value.map((r) => ({ key: r.name, label: r.name }))]);
    return (r, c) => (u(), y("div", X, [
      n(e(L), {
        options: k.value,
        value: a.value,
        "data-memory-tabs": "",
        onPick: c[0] || (c[0] = (_) => a.value = _)
      }, null, 8, ["options", "value"]),
      (u(), D(Q, {
        key: a.value,
        environment: a.value
      }, null, 8, ["environment"]))
    ]));
  }
}, ne = /* @__PURE__ */ P(ee, [["__scopeId", "data-v-e72d53ed"]]);
export {
  ne as default
};
