/* @code-commandments-generated */
if (!document.getElementById("window-styles-c47430673806")) { const style = document.createElement("style"); style.id = "window-styles-c47430673806"; style.textContent = ".worker-models[data-v-57a26c8a]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-57a26c8a]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-57a26c8a]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-57a26c8a]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-57a26c8a]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-57a26c8a]{display:flex;gap:8px;align-items:center}.number[data-v-d5811db8]{color:var(--text-3);font-size:12px}.main[data-v-d5811db8]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-d5811db8]{color:var(--text-3);font-size:12px}.main[data-v-35658be4]{flex:1}.note[data-v-35658be4]{color:var(--text-3);font-size:12px}.worktree[data-v-91a64b63]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-91a64b63]{flex:1;min-width:0}.worktree-holder[data-v-91a64b63]{font-weight:500}.worktree-folder[data-v-91a64b63]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-91a64b63]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as g, computed as h, openBlock as c, createElementBlock as m, createElementVNode as l, toDisplayString as i, createCommentVNode as w, createVNode as v, unref as r, withCtx as x, createTextVNode as L } from "vue";
import { useRows as y, RowList as N, patched as b } from "@journal/window-kit";
import { _ as A } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const C = { class: "worker-models" }, E = {
  key: 0,
  class: "worker-models-refusal",
  role: "alert"
}, S = ["data-worker-model"], V = { class: "worker-model-program" }, j = { class: "worker-model-name" }, D = ["checked", "disabled", "title", "onChange"], M = "journal.suites.coding.workers.allowed-models", W = {
  __name: "WorkerModels",
  setup(B) {
    const { rows: s, failure: p, loaded: u, act: _ } = y("worker models", ["setting.*"]), d = g(""), n = (o) => o.allowed && s.value.filter((t) => t.program === o.program && t.allowed).length === 1, k = h(() => new Set(s.value.filter((o, t) => {
      var e;
      return ((e = s.value[t - 1]) == null ? void 0 : e.program) !== o.program;
    }).map((o) => o.id)));
    async function f(o) {
      if (n(o)) return;
      const t = s.value.filter((a) => a.id === o.id ? !a.allowed : a.allowed).map((a) => a.id), e = await _(["setting", "set", M, t.join(","), "--project"], b(o.id, { allowed: !o.allowed }));
      d.value = e.ok ? "" : e.error;
    }
    return (o, t) => (c(), m("div", C, [
      t[0] || (t[0] = l("p", { class: "worker-models-note" }, "Listed from the cheapest to the strongest. A worker runs on the general model when it is ticked, otherwise on the ticked model nearest to it.", -1)),
      d.value ? (c(), m("p", E, i(d.value), 1)) : w("", !0),
      v(r(N), {
        rows: r(s),
        failure: r(p),
        loaded: r(u),
        empty: "No agent programs",
        hint: "An agent program a module offers shows here with its models."
      }, {
        default: x(({ row: e }) => [
          l("div", {
            class: "worker-model",
            "data-worker-model": e.id
          }, [
            l("span", V, i(k.value.has(e.id) ? e.title : ""), 1),
            l("label", j, [
              l("input", {
                type: "checkbox",
                checked: e.allowed,
                disabled: n(e),
                title: n(e) ? "A program keeps at least one model" : "",
                onChange: (a) => f(e)
              }, null, 40, D),
              L(" " + i(e.model), 1)
            ])
          ], 8, S)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ]));
  }
}, T = /* @__PURE__ */ A(W, [["__scopeId", "data-v-57a26c8a"]]);
export {
  T as default
};
