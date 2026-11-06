/* @code-commandments-generated */
if (!document.getElementById("window-styles-c1ef6a3e59fa")) { const style = document.createElement("style"); style.id = "window-styles-c1ef6a3e59fa"; style.textContent = ".worker-models[data-v-703d4f39]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-703d4f39]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-703d4f39]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-703d4f39]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-703d4f39]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-703d4f39]{display:flex;gap:8px;align-items:center}.number[data-v-470549ee]{color:var(--text-3);font-size:12px}.main[data-v-470549ee]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-470549ee]{color:var(--text-3);font-size:12px}.main[data-v-7b462dac]{flex:1}.note[data-v-7b462dac]{color:var(--text-3);font-size:12px}.worker-moment[data-v-b883c89e]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-b883c89e]{flex:none;color:var(--text-3);font-size:12px}.worker-tab-body[data-v-2e45450f]{padding:14px 16px}.worktree[data-v-ca173274]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-ca173274]{flex:1;min-width:0}.worktree-holder[data-v-ca173274]{font-weight:500}.worktree-folder[data-v-ca173274]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-ca173274]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as w, computed as g, openBlock as c, createBlock as v, unref as r, withCtx as m, createElementVNode as l, createElementBlock as b, toDisplayString as i, createCommentVNode as x, createVNode as y, createTextVNode as L } from "vue";
import { useWindow as N, WindowRoom as W, RowList as A, patched as C } from "@journal/window-kit";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const S = { class: "worker-models" }, V = {
  key: 0,
  class: "worker-models-refusal",
  role: "alert"
}, j = ["data-worker-model"], B = { class: "worker-model-program" }, D = { class: "worker-model-name" }, M = ["checked", "disabled", "title", "onChange"], O = "journal.core.helpers.allowed-models", R = {
  __name: "WorkerModels",
  setup(I) {
    const p = N(), { rows: s, failure: u, loaded: _, act: f } = p.props.models, d = w(""), n = (o) => o.allowed && s.value.filter((t) => t.program === o.program && t.allowed).length === 1, h = g(() => new Set(s.value.filter((o, t) => {
      var e;
      return ((e = s.value[t - 1]) == null ? void 0 : e.program) !== o.program;
    }).map((o) => o.id)));
    async function k(o) {
      if (n(o)) return;
      const t = s.value.filter((a) => a.id === o.id ? !a.allowed : a.allowed).map((a) => a.id), e = await f(["setting", "set", O, t.join(","), "--project"], C(o.id, { allowed: !o.allowed }));
      d.value = e.ok ? "" : e.error;
    }
    return (o, t) => (c(), v(r(W), null, {
      default: m(() => [
        l("div", S, [
          t[0] || (t[0] = l("p", { class: "worker-models-note" }, "Listed from the cheapest to the strongest. A worker runs on the model its profile names when that model is ticked. A model that is not ticked is refused, and you name another with --model.", -1)),
          d.value ? (c(), b("p", V, i(d.value), 1)) : x("", !0),
          y(r(A), {
            rows: r(s),
            failure: r(u),
            loaded: r(_),
            empty: "No agent programs",
            hint: "Available agent programs and their models appear here."
          }, {
            default: m(({ row: e }) => [
              l("div", {
                class: "worker-model",
                "data-worker-model": e.id
              }, [
                l("span", B, i(h.value.has(e.id) ? e.title : ""), 1),
                l("label", D, [
                  l("input", {
                    type: "checkbox",
                    checked: e.allowed,
                    disabled: n(e),
                    title: n(e) ? "Keep at least one model enabled" : "",
                    onChange: (a) => k(e)
                  }, null, 40, M),
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
}, q = /* @__PURE__ */ E(R, [["__scopeId", "data-v-703d4f39"]]);
export {
  q as default
};
