/* @code-commandments-generated */
if (!document.getElementById("window-styles-66ec22d7c6dc")) { const style = document.createElement("style"); style.id = "window-styles-66ec22d7c6dc"; style.textContent = ".worker-models[data-v-e982edb4]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-e982edb4]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-e982edb4]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-e982edb4]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-e982edb4]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-e982edb4]{display:flex;gap:8px;align-items:center}.number[data-v-ad3f073f]{color:var(--text-3);font-size:12px}.main[data-v-ad3f073f]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-ad3f073f]{color:var(--text-3);font-size:12px}.main[data-v-ef968966]{flex:1}.note[data-v-ef968966]{color:var(--text-3);font-size:12px}.worker-moment[data-v-d9e1bce4]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-d9e1bce4]{flex:none;color:var(--text-3);font-size:12px}.worker-tab-body[data-v-4596a516]{padding:14px 16px}.worktree[data-v-fe754622]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-fe754622]{flex:1;min-width:0}.worktree-holder[data-v-fe754622]{font-weight:500}.worktree-folder[data-v-fe754622]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-fe754622]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as g, computed as h, openBlock as c, createBlock as w, unref as s, withCtx as m, createElementVNode as l, createElementBlock as v, toDisplayString as i, createCommentVNode as b, createVNode as x, createTextVNode as L } from "vue";
import { useRows as y, WindowRoom as N, RowList as C, patched as E } from "@journal/window-kit";
import { _ as S } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const V = { class: "worker-models" }, W = {
  key: 0,
  class: "worker-models-refusal",
  role: "alert"
}, j = ["data-worker-model"], A = { class: "worker-model-program" }, B = { class: "worker-model-name" }, D = ["checked", "disabled", "title", "onChange"], M = "journal.suites.coding.workers.allowed-models", R = {
  __name: "WorkerModels",
  setup(O) {
    const { rows: r, failure: p, loaded: u, act: _ } = y("worker models", ["setting.*"]), d = g(""), n = (o) => o.allowed && r.value.filter((t) => t.program === o.program && t.allowed).length === 1, k = h(() => new Set(r.value.filter((o, t) => {
      var e;
      return ((e = r.value[t - 1]) == null ? void 0 : e.program) !== o.program;
    }).map((o) => o.id)));
    async function f(o) {
      if (n(o)) return;
      const t = r.value.filter((a) => a.id === o.id ? !a.allowed : a.allowed).map((a) => a.id), e = await _(["setting", "set", M, t.join(","), "--project"], E(o.id, { allowed: !o.allowed }));
      d.value = e.ok ? "" : e.error;
    }
    return (o, t) => (c(), w(s(N), null, {
      default: m(() => [
        l("div", V, [
          t[0] || (t[0] = l("p", { class: "worker-models-note" }, "Listed from the cheapest to the strongest. A worker runs on the general model when it is ticked, otherwise on the ticked model nearest to it.", -1)),
          d.value ? (c(), v("p", W, i(d.value), 1)) : b("", !0),
          x(s(C), {
            rows: s(r),
            failure: s(p),
            loaded: s(u),
            empty: "No agent programs",
            hint: "Available agent programs and their models appear here."
          }, {
            default: m(({ row: e }) => [
              l("div", {
                class: "worker-model",
                "data-worker-model": e.id
              }, [
                l("span", A, i(k.value.has(e.id) ? e.title : ""), 1),
                l("label", B, [
                  l("input", {
                    type: "checkbox",
                    checked: e.allowed,
                    disabled: n(e),
                    title: n(e) ? "Keep at least one model enabled" : "",
                    onChange: (a) => f(e)
                  }, null, 40, D),
                  L(" " + i(e.model), 1)
                ])
              ], 8, j)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ])
      ]),
      _: 1
    }));
  }
}, $ = /* @__PURE__ */ S(R, [["__scopeId", "data-v-e982edb4"]]);
export {
  $ as default
};
