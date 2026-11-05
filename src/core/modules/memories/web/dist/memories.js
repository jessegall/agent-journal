/* @code-commandments-generated */
if (!document.getElementById("window-styles-63ee08cfefa4")) { const style = document.createElement("style"); style.id = "window-styles-63ee08cfefa4"; style.textContent = ".memories[data-v-47bce12f],.memories-form[data-v-47bce12f]{display:flex;flex-direction:column;gap:8px}.memories-form[data-v-47bce12f]{align-items:flex-start}.memories-form textarea[data-v-47bce12f]{width:100%}.memories-refusal[data-v-47bce12f]{margin:0;color:var(--danger);font-size:12.5px}.memory[data-v-47bce12f]{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0;padding:4px 0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.memory-kind[data-v-47bce12f]{color:var(--text-3);font-size:12px}.memories-page[data-v-3ebd406a]{display:flex;flex-direction:column;gap:8px;align-items:flex-start}.memories-page[data-v-3ebd406a]>.memories{align-self:stretch}.memory-round[data-v-03fe1c3a]{margin:0 0 0 20px}.memory-round-rows[data-v-03fe1c3a]{margin:0;padding:0;list-style:none}.memory-round-row[data-v-03fe1c3a]{display:flex;flex-wrap:wrap;gap:2px 8px;padding:2px 0;color:var(--text-2);font-size:12px;line-height:1.45;overflow-wrap:anywhere}.memory-round-ref[data-v-03fe1c3a]{padding:0;border:0;background:none;color:var(--accent-text);font:inherit;cursor:pointer}.memory-round-weight[data-v-03fe1c3a]{color:var(--text-4)}\n"; document.head.appendChild(style); }
import { ref as p, openBlock as i, createElementBlock as w, createElementVNode as a, createVNode as m, unref as e, withCtx as f, createTextVNode as g, withModifiers as B, withDirectives as T, vModelText as P, createCommentVNode as M, toDisplayString as h, computed as A, createBlock as N } from "vue";
import { useWindow as C, useRows as L, useListTools as D, Btn as R, ListTools as E, RowList as I, peekRef as j, WindowRoom as O, Segmented as U } from "@journal/window-kit";
import { _ as S } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const q = { class: "memories" }, z = { class: "memories-tools" }, F = {
  key: 1,
  class: "memories-refusal",
  role: "alert",
  "data-memory-refusal": ""
}, G = ["data-memory", "onClick"], H = { class: "memory-text" }, J = { class: "memory-kind" }, K = {
  __name: "MemoryRows",
  props: { environment: { type: String, default: "" } },
  setup(x) {
    const d = x, u = d.environment ? ["--environment", d.environment] : [], n = C(), { rows: y, failure: r, loaded: c, more: _, load: V, older: W } = L(["memory list", ...u].join(" "), ["memory.*"], { incremental: !0 }), k = D(y, { title: (o) => o.text, isOpen: (o) => o.state === "active" }), v = p(!1), l = p(""), b = p("");
    async function $() {
      const o = await n.run(["memory", "make", l.value.trim(), ...u]);
      b.value = o.ok ? "" : o.error, o.ok && (l.value = "", v.value = !1, V());
    }
    return (o, t) => (i(), w("div", q, [
      a("div", z, [
        m(e(R), {
          small: "",
          bordered: "",
          "data-memory-new": "",
          onClick: t[0] || (t[0] = (s) => v.value = !v.value)
        }, {
          default: f(() => [...t[2] || (t[2] = [
            g("New memory", -1)
          ])]),
          _: 1
        })
      ]),
      v.value ? (i(), w("form", {
        key: 0,
        class: "memories-form",
        "data-memory-form": "",
        onSubmit: B($, ["prevent"])
      }, [
        T(a("textarea", {
          "onUpdate:modelValue": t[1] || (t[1] = (s) => l.value = s),
          rows: "2",
          placeholder: "What should be remembered?",
          "aria-label": "What should be remembered?"
        }, null, 512), [
          [P, l.value]
        ]),
        m(e(R), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !l.value.trim()
        }, {
          default: f(() => [...t[3] || (t[3] = [
            g("Save memory", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : M("", !0),
      b.value ? (i(), w("p", F, h(b.value), 1)) : M("", !0),
      m(e(E), { tools: e(k) }, null, 8, ["tools"]),
      m(e(I), {
        rows: e(k).shown.value,
        failure: e(r),
        loaded: e(c),
        more: e(_),
        older: e(W),
        empty: "No memories yet",
        hint: "Memories you or the agent save appear here.",
        searching: e(k).filtering.value
      }, {
        default: f(({ row: s }) => [
          a("button", {
            type: "button",
            class: "memory",
            "data-memory": s.id,
            onClick: (ee) => e(j)(`memories:${s.id}`)
          }, [
            a("span", H, h(s.text), 1),
            a("span", J, "Weight: " + h(s.weight), 1)
          ], 8, G)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "searching"])
    ]));
  }
}, Q = /* @__PURE__ */ S(K, [["__scopeId", "data-v-47bce12f"]]), X = { class: "memories-page" }, Y = "", Z = {
  __name: "MemoriesPage",
  setup(x) {
    const d = C(), { rows: u } = L("environment list", ["environment.*"]), n = p(d.environment), y = A(() => [{ key: Y, label: "All" }, ...u.value.map((r) => ({ key: r.name, label: r.name }))]);
    return (r, c) => (i(), N(e(O), null, {
      default: f(() => [
        a("div", X, [
          m(e(U), {
            options: y.value,
            value: n.value,
            "data-memory-tabs": "",
            onPick: c[0] || (c[0] = (_) => n.value = _)
          }, null, 8, ["options", "value"]),
          (i(), N(Q, {
            key: n.value,
            environment: n.value
          }, null, 8, ["environment"]))
        ])
      ]),
      _: 1
    }));
  }
}, ne = /* @__PURE__ */ S(Z, [["__scopeId", "data-v-3ebd406a"]]);
export {
  ne as default
};
