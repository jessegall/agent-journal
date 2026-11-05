/* @code-commandments-generated */
if (!document.getElementById("window-styles-b87efd4d5582")) { const style = document.createElement("style"); style.id = "window-styles-b87efd4d5582"; style.textContent = ".memories[data-v-07625815],.memories-form[data-v-07625815]{display:flex;flex-direction:column;gap:8px}.memories-form[data-v-07625815]{align-items:flex-start}.memories-form textarea[data-v-07625815]{width:100%}.memories-refusal[data-v-07625815]{margin:0;color:var(--danger);font-size:12.5px}.memory[data-v-07625815]{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0;padding:4px 0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.memory-kind[data-v-07625815]{color:var(--text-3);font-size:12px}.memories-page[data-v-3ebd406a]{display:flex;flex-direction:column;gap:8px;align-items:flex-start}.memories-page[data-v-3ebd406a]>.memories{align-self:stretch}.memory-dock[data-v-efaf5416]{display:flex;gap:8px;font-size:12px;line-height:1.45}.memory-dock-weight[data-v-efaf5416]{color:var(--text-4)}.memory-round[data-v-03fe1c3a]{margin:0 0 0 20px}.memory-round-rows[data-v-03fe1c3a]{margin:0;padding:0;list-style:none}.memory-round-row[data-v-03fe1c3a]{display:flex;flex-wrap:wrap;gap:2px 8px;padding:2px 0;color:var(--text-2);font-size:12px;line-height:1.45;overflow-wrap:anywhere}.memory-round-ref[data-v-03fe1c3a]{padding:0;border:0;background:none;color:var(--accent-text);font:inherit;cursor:pointer}.memory-round-weight[data-v-03fe1c3a]{color:var(--text-4)}\n"; document.head.appendChild(style); }
import { ref as i, openBlock as u, createElementBlock as g, createElementVNode as a, createVNode as r, unref as e, withCtx as y, createTextVNode as M, withModifiers as E, withDirectives as A, vModelText as D, createCommentVNode as R, toDisplayString as p, computed as I, createBlock as N } from "vue";
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
      { key: "reminder", label: "Reminder" }
    ], d = h, n = d.environment ? ["--environment", d.environment] : [], _ = C(), { rows: l, failure: c, loaded: k, more: V, load: $, older: B } = L(["memory list", ...n].join(" "), ["memory.*"], { incremental: !0 }), b = j(l, { title: (s) => s.text, isOpen: (s) => s.state === "active" }), v = i(!1), m = i(""), w = i("fact"), x = i("");
    async function W() {
      const s = await _.run(["memory", "make", m.value.trim(), "--type", w.value, ...n]);
      x.value = s.ok ? "" : s.error, s.ok && (m.value = "", v.value = !1, $());
    }
    return (s, t) => (u(), g("div", q, [
      a("div", z, [
        r(e(S), {
          small: "",
          bordered: "",
          "data-memory-new": "",
          onClick: t[0] || (t[0] = (o) => v.value = !v.value)
        }, {
          default: y(() => [...t[3] || (t[3] = [
            M("New memory", -1)
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
        A(a("textarea", {
          "onUpdate:modelValue": t[1] || (t[1] = (o) => m.value = o),
          rows: "2",
          placeholder: "What should be remembered?",
          "aria-label": "What should be remembered?"
        }, null, 512), [
          [D, m.value]
        ]),
        r(e(P), {
          options: f,
          value: w.value,
          onPick: t[2] || (t[2] = (o) => w.value = o)
        }, null, 8, ["value"]),
        r(e(S), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !m.value.trim()
        }, {
          default: y(() => [...t[4] || (t[4] = [
            M("Save memory", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : R("", !0),
      x.value ? (u(), g("p", G, p(x.value), 1)) : R("", !0),
      r(e(F), { tools: e(b) }, null, 8, ["tools"]),
      r(e(O), {
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
          a("button", {
            type: "button",
            class: "memory",
            "data-memory": o.id,
            onClick: (oe) => e(U)(`memories:${o.id}`)
          }, [
            a("span", J, p(o.text), 1),
            a("span", K, p(o.type) + " · weight " + p(o.weight), 1)
          ], 8, H)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "searching"])
    ]));
  }
}, X = /* @__PURE__ */ T(Q, [["__scopeId", "data-v-07625815"]]), Z = { class: "memories-page" }, ee = "", te = {
  __name: "MemoriesPage",
  setup(h) {
    const f = C(), { rows: d } = L("environment list", ["environment.*"]), n = i(f.environment), _ = I(() => [{ key: ee, label: "All" }, ...d.value.map((l) => ({ key: l.name, label: l.name }))]);
    return (l, c) => (u(), N(e(Y), null, {
      default: y(() => [
        a("div", Z, [
          r(e(P), {
            options: _.value,
            value: n.value,
            "data-memory-tabs": "",
            onPick: c[0] || (c[0] = (k) => n.value = k)
          }, null, 8, ["options", "value"]),
          (u(), N(X, {
            key: n.value,
            environment: n.value
          }, null, 8, ["environment"]))
        ])
      ]),
      _: 1
    }));
  }
}, re = /* @__PURE__ */ T(te, [["__scopeId", "data-v-3ebd406a"]]);
export {
  re as default
};
