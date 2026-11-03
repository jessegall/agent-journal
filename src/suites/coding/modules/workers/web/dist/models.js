/* @code-commandments-generated */
if (!document.getElementById("window-styles-61d024f416fa")) { const style = document.createElement("style"); style.id = "window-styles-61d024f416fa"; style.textContent = ".worker-models[data-v-39e23a54]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-39e23a54]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-39e23a54]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-39e23a54]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-39e23a54]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-39e23a54]{display:flex;gap:8px;align-items:center}.number[data-v-878fda70]{color:var(--text-3);font-size:12px}.main[data-v-878fda70]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-878fda70]{color:var(--text-3);font-size:12px}.main[data-v-176788f1]{flex:1}.note[data-v-176788f1]{color:var(--text-3);font-size:12px}.worktree[data-v-a608a096]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-a608a096]{flex:1;min-width:0}.worktree-holder[data-v-a608a096]{font-weight:500}.worktree-folder[data-v-a608a096]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-a608a096]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as w, computed as g, openBlock as c, createBlock as h, unref as r, withCtx as m, createElementVNode as l, createElementBlock as v, toDisplayString as i, createCommentVNode as x, createVNode as L, createTextVNode as y } from "vue";
import { useRows as N, WindowRoom as b, RowList as A, patched as C } from "@journal/window-kit";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const S = { class: "worker-models" }, V = {
  key: 0,
  class: "worker-models-refusal",
  role: "alert"
}, W = ["data-worker-model"], j = { class: "worker-model-program" }, B = { class: "worker-model-name" }, D = ["checked", "disabled", "title", "onChange"], M = "journal.suites.coding.workers.allowed-models", R = {
  __name: "WorkerModels",
  setup(O) {
    const { rows: s, failure: p, loaded: u, act: _ } = N("worker models", ["setting.*"]), d = w(""), n = (o) => o.allowed && s.value.filter((t) => t.program === o.program && t.allowed).length === 1, k = g(() => new Set(s.value.filter((o, t) => {
      var e;
      return ((e = s.value[t - 1]) == null ? void 0 : e.program) !== o.program;
    }).map((o) => o.id)));
    async function f(o) {
      if (n(o)) return;
      const t = s.value.filter((a) => a.id === o.id ? !a.allowed : a.allowed).map((a) => a.id), e = await _(["setting", "set", M, t.join(","), "--project"], C(o.id, { allowed: !o.allowed }));
      d.value = e.ok ? "" : e.error;
    }
    return (o, t) => (c(), h(r(b), null, {
      default: m(() => [
        l("div", S, [
          t[0] || (t[0] = l("p", { class: "worker-models-note" }, "Listed from the cheapest to the strongest. A worker runs on the general model when it is ticked, otherwise on the ticked model nearest to it.", -1)),
          d.value ? (c(), v("p", V, i(d.value), 1)) : x("", !0),
          L(r(A), {
            rows: r(s),
            failure: r(p),
            loaded: r(u),
            empty: "No agent programs",
            hint: "An agent program a module offers shows here with its models."
          }, {
            default: m(({ row: e }) => [
              l("div", {
                class: "worker-model",
                "data-worker-model": e.id
              }, [
                l("span", j, i(k.value.has(e.id) ? e.title : ""), 1),
                l("label", B, [
                  l("input", {
                    type: "checkbox",
                    checked: e.allowed,
                    disabled: n(e),
                    title: n(e) ? "A program keeps at least one model" : "",
                    onChange: (a) => f(e)
                  }, null, 40, D),
                  y(" " + i(e.model), 1)
                ])
              ], 8, W)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ])
      ]),
      _: 1
    }));
  }
}, q = /* @__PURE__ */ E(R, [["__scopeId", "data-v-39e23a54"]]);
export {
  q as default
};
