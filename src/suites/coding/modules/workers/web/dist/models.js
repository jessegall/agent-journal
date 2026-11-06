/* @code-commandments-generated */
if (!document.getElementById("window-styles-650e52816ce7")) { const style = document.createElement("style"); style.id = "window-styles-650e52816ce7"; style.textContent = ".worker-models[data-v-4d42029c]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-4d42029c]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-4d42029c]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-4d42029c]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-4d42029c]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-4d42029c]{display:flex;gap:8px;align-items:center}.number[data-v-ad3f073f]{color:var(--text-3);font-size:12px}.main[data-v-ad3f073f]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-ad3f073f]{color:var(--text-3);font-size:12px}.main[data-v-ef968966]{flex:1}.note[data-v-ef968966]{color:var(--text-3);font-size:12px}.worker-moment[data-v-4889fbf7]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-4889fbf7]{flex:none;color:var(--text-3);font-size:12px}.worker-tab-body[data-v-4596a516]{padding:14px 16px}.worktree[data-v-ca173274]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-ca173274]{flex:1;min-width:0}.worktree-holder[data-v-ca173274]{font-weight:500}.worktree-folder[data-v-ca173274]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-ca173274]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as k, computed as w, openBlock as c, createBlock as g, unref as r, withCtx as m, createElementVNode as l, createElementBlock as v, toDisplayString as i, createCommentVNode as b, createVNode as x, createTextVNode as y } from "vue";
import { useRows as L, WindowRoom as N, RowList as A, patched as C } from "@journal/window-kit";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const S = { class: "worker-models" }, V = {
  key: 0,
  class: "worker-models-refusal",
  role: "alert"
}, W = ["data-worker-model"], j = { class: "worker-model-program" }, B = { class: "worker-model-name" }, D = ["checked", "disabled", "title", "onChange"], M = "journal.core.helpers.allowed-models", R = {
  __name: "WorkerModels",
  setup(O) {
    const { rows: s, failure: p, loaded: u, act: _ } = L("worker models", ["setting.*"]), d = k(""), n = (o) => o.allowed && s.value.filter((t) => t.program === o.program && t.allowed).length === 1, h = w(() => new Set(s.value.filter((o, t) => {
      var e;
      return ((e = s.value[t - 1]) == null ? void 0 : e.program) !== o.program;
    }).map((o) => o.id)));
    async function f(o) {
      if (n(o)) return;
      const t = s.value.filter((a) => a.id === o.id ? !a.allowed : a.allowed).map((a) => a.id), e = await _(["setting", "set", M, t.join(","), "--project"], C(o.id, { allowed: !o.allowed }));
      d.value = e.ok ? "" : e.error;
    }
    return (o, t) => (c(), g(r(N), null, {
      default: m(() => [
        l("div", S, [
          t[0] || (t[0] = l("p", { class: "worker-models-note" }, "Listed from the cheapest to the strongest. A worker runs on the model its profile names when that model is ticked. A model that is not ticked is refused, and you name another with --model.", -1)),
          d.value ? (c(), v("p", V, i(d.value), 1)) : b("", !0),
          x(r(A), {
            rows: r(s),
            failure: r(p),
            loaded: r(u),
            empty: "No agent programs",
            hint: "Available agent programs and their models appear here."
          }, {
            default: m(({ row: e }) => [
              l("div", {
                class: "worker-model",
                "data-worker-model": e.id
              }, [
                l("span", j, i(h.value.has(e.id) ? e.title : ""), 1),
                l("label", B, [
                  l("input", {
                    type: "checkbox",
                    checked: e.allowed,
                    disabled: n(e),
                    title: n(e) ? "Keep at least one model enabled" : "",
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
}, $ = /* @__PURE__ */ E(R, [["__scopeId", "data-v-4d42029c"]]);
export {
  $ as default
};
