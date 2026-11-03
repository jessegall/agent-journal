/* @code-commandments-generated */
if (!document.getElementById("window-styles-dc07c7617deb")) { const style = document.createElement("style"); style.id = "window-styles-dc07c7617deb"; style.textContent = ".worker-models[data-v-310982ed]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-310982ed]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-310982ed]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-310982ed]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-310982ed]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-310982ed]{display:flex;gap:8px;align-items:center}.number[data-v-d5811db8]{color:var(--text-3);font-size:12px}.main[data-v-d5811db8]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-d5811db8]{color:var(--text-3);font-size:12px}.main[data-v-35658be4]{flex:1}.note[data-v-35658be4]{color:var(--text-3);font-size:12px}.worktree[data-v-28015355]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-28015355]{flex:1;min-width:0}.worktree-holder[data-v-28015355]{font-weight:500}.worktree-folder[data-v-28015355]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-28015355]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as w, computed as h, openBlock as c, createElementBlock as m, createElementVNode as a, toDisplayString as i, createCommentVNode as v, createVNode as x, unref as l, withCtx as L, createTextVNode as y } from "vue";
import { useRows as N, RowList as b } from "@journal/window-kit";
import { _ as A } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const C = { class: "worker-models" }, E = {
  key: 0,
  class: "worker-models-refusal",
  role: "alert"
}, S = ["data-worker-model"], V = { class: "worker-model-program" }, j = { class: "worker-model-name" }, D = ["checked", "disabled", "title", "onChange"], M = "journal.suites.coding.workers.allowed-models", W = {
  __name: "WorkerModels",
  setup(B) {
    const { rows: r, failure: p, loaded: u, load: _, context: k } = N("worker models", ["setting.*"]), d = w(""), n = (o) => o.allowed && r.value.filter((t) => t.program === o.program && t.allowed).length === 1, f = h(() => new Set(r.value.filter((o, t) => {
      var e;
      return ((e = r.value[t - 1]) == null ? void 0 : e.program) !== o.program;
    }).map((o) => o.id)));
    async function g(o) {
      if (n(o)) return;
      const t = r.value.filter((s) => s.id === o.id ? !s.allowed : s.allowed).map((s) => s.id), e = await k.run(["setting", "set", M, t.join(","), "--project"]);
      d.value = e.ok ? "" : e.error, e.ok && _();
    }
    return (o, t) => (c(), m("div", C, [
      t[0] || (t[0] = a("p", { class: "worker-models-note" }, "Listed from the cheapest to the strongest. A worker runs on the general model when it is ticked, otherwise on the ticked model nearest to it.", -1)),
      d.value ? (c(), m("p", E, i(d.value), 1)) : v("", !0),
      x(l(b), {
        rows: l(r),
        failure: l(p),
        loaded: l(u),
        empty: "No agent programs",
        hint: "An agent program a module offers shows here with its models."
      }, {
        default: L(({ row: e }) => [
          a("div", {
            class: "worker-model",
            "data-worker-model": e.id
          }, [
            a("span", V, i(f.value.has(e.id) ? e.title : ""), 1),
            a("label", j, [
              a("input", {
                type: "checkbox",
                checked: e.allowed,
                disabled: n(e),
                title: n(e) ? "A program keeps at least one model" : "",
                onChange: (s) => g(e)
              }, null, 40, D),
              y(" " + i(e.model), 1)
            ])
          ], 8, S)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ]));
  }
}, T = /* @__PURE__ */ A(W, [["__scopeId", "data-v-310982ed"]]);
export {
  T as default
};
