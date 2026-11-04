/* @code-commandments-generated */
if (!document.getElementById("window-styles-5568e4247e0a")) { const style = document.createElement("style"); style.id = "window-styles-5568e4247e0a"; style.textContent = ".memories[data-v-ba051f84],.memories-form[data-v-ba051f84]{display:flex;flex-direction:column;gap:8px}.memories-form[data-v-ba051f84]{align-items:flex-start}.memories-form textarea[data-v-ba051f84]{width:100%}.memories-refusal[data-v-ba051f84]{margin:0;color:var(--danger);font-size:12.5px}.memory[data-v-ba051f84]{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0;padding:4px 0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.memory-kind[data-v-ba051f84]{color:var(--text-3);font-size:12px}.memories-page[data-v-76fcf470]{display:flex;flex-direction:column;gap:8px;align-items:flex-start}.memories-page[data-v-76fcf470]>.memories{align-self:stretch}.memory-dock[data-v-19bd84d7]{display:flex;gap:8px;font-size:12px;line-height:1.45}.memory-dock-weight[data-v-19bd84d7]{color:var(--text-4)}.memory-round[data-v-03fe1c3a]{margin:0 0 0 20px}.memory-round-rows[data-v-03fe1c3a]{margin:0;padding:0;list-style:none}.memory-round-row[data-v-03fe1c3a]{display:flex;flex-wrap:wrap;gap:2px 8px;padding:2px 0;color:var(--text-2);font-size:12px;line-height:1.45;overflow-wrap:anywhere}.memory-round-ref[data-v-03fe1c3a]{padding:0;border:0;background:none;color:var(--accent-text);font:inherit;cursor:pointer}.memory-round-weight[data-v-03fe1c3a]{color:var(--text-4)}\n"; document.head.appendChild(style); }
import { ref as i, openBlock as u, createElementBlock as g, createElementVNode as n, createVNode as l, unref as e, withCtx as y, createTextVNode as R, withModifiers as E, withDirectives as A, vModelText as D, createCommentVNode as M, toDisplayString as p, computed as I, createBlock as N } from "vue";
import { useWindow as C, useRows as L, useListTools as j, Btn as S, Segmented as P, ListTools as F, RowList as O, peekRef as U, WindowRoom as Y } from "@journal/window-kit";
import { _ as T } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const q = { class: "memories" }, z = { class: "memories-tools" }, G = {
  key: 1,
  class: "memories-refusal",
  role: "alert",
  "data-memory-refusal": ""
}, H = ["data-memory", "onClick"], J = { class: "memory-text" }, K = { class: "memory-kind" }, Q = {
  __name: "MemoryRows",
  props: { environment: { type: String, default: "" } },
  setup(h) {
    const f = [
      { key: "fact", label: "Fact" },
      { key: "rule", label: "Rule" },
      { key: "reminder", label: "Reminder" }
    ], d = h, a = d.environment ? ["--environment", d.environment] : [], _ = C(), { rows: r, failure: c, loaded: k, more: V, load: $, older: B } = L(["memory list", ...a].join(" "), ["memory.*"], { incremental: !0 }), b = j(r, { title: (s) => s.text, isOpen: (s) => s.state === "active" }), v = i(!1), m = i(""), w = i("fact"), x = i("");
    async function W() {
      const s = await _.run(["memory", "make", m.value.trim(), "--type", w.value, ...a]);
      x.value = s.ok ? "" : s.error, s.ok && (m.value = "", v.value = !1, $());
    }
    return (s, t) => (u(), g("div", q, [
      n("div", z, [
        l(e(S), {
          small: "",
          bordered: "",
          "data-memory-new": "",
          onClick: t[0] || (t[0] = (o) => v.value = !v.value)
        }, {
          default: y(() => [...t[3] || (t[3] = [
            R("New memory", -1)
          ])]),
          _: 1
        })
      ]),
      v.value ? (u(), g("form", {
        key: 0,
        class: "memories-form",
        "data-memory-form": "",
        onSubmit: E(W, ["prevent"])
      }, [
        A(n("textarea", {
          "onUpdate:modelValue": t[1] || (t[1] = (o) => m.value = o),
          rows: "2",
          placeholder: "What should be remembered?",
          "aria-label": "What should be remembered?"
        }, null, 512), [
          [D, m.value]
        ]),
        l(e(P), {
          options: f,
          value: w.value,
          onPick: t[2] || (t[2] = (o) => w.value = o)
        }, null, 8, ["value"]),
        l(e(S), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !m.value.trim()
        }, {
          default: y(() => [...t[4] || (t[4] = [
            R("Save memory", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : M("", !0),
      x.value ? (u(), g("p", G, p(x.value), 1)) : M("", !0),
      l(e(F), { tools: e(b) }, null, 8, ["tools"]),
      l(e(O), {
        rows: e(b).shown.value,
        failure: e(c),
        loaded: e(k),
        more: e(V),
        older: e(B),
        empty: "No memories yet",
        hint: "Memories you or the agent save appear here.",
        searching: e(b).filtering.value
      }, {
        default: y(({ row: o }) => [
          n("button", {
            type: "button",
            class: "memory",
            "data-memory": o.id,
            onClick: (oe) => e(U)(`memories:${o.id}`)
          }, [
            n("span", J, p(o.text), 1),
            n("span", K, p(o.type) + " · weight " + p(o.weight), 1)
          ], 8, H)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "searching"])
    ]));
  }
}, X = /* @__PURE__ */ T(Q, [["__scopeId", "data-v-ba051f84"]]), Z = { class: "memories-page" }, ee = "", te = {
  __name: "MemoriesPage",
  setup(h) {
    const f = C(), { rows: d } = L("environment list", ["environment.*"]), a = i(f.environment), _ = I(() => [{ key: ee, label: "All" }, ...d.value.map((r) => ({ key: r.name, label: r.name }))]);
    return (r, c) => (u(), N(e(Y), null, {
      default: y(() => [
        n("div", Z, [
          l(e(P), {
            options: _.value,
            value: a.value,
            "data-memory-tabs": "",
            onPick: c[0] || (c[0] = (k) => a.value = k)
          }, null, 8, ["options", "value"]),
          (u(), N(X, {
            key: a.value,
            environment: a.value
          }, null, 8, ["environment"]))
        ])
      ]),
      _: 1
    }));
  }
}, le = /* @__PURE__ */ T(te, [["__scopeId", "data-v-76fcf470"]]);
export {
  le as default
};
