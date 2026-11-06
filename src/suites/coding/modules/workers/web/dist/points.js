/* @code-commandments-generated */
if (!document.getElementById("window-styles-c1ef6a3e59fa")) { const style = document.createElement("style"); style.id = "window-styles-c1ef6a3e59fa"; style.textContent = ".worker-models[data-v-703d4f39]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-703d4f39]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-703d4f39]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-703d4f39]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-703d4f39]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-703d4f39]{display:flex;gap:8px;align-items:center}.number[data-v-470549ee]{color:var(--text-3);font-size:12px}.main[data-v-470549ee]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-470549ee]{color:var(--text-3);font-size:12px}.main[data-v-7b462dac]{flex:1}.note[data-v-7b462dac]{color:var(--text-3);font-size:12px}.worker-moment[data-v-b883c89e]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-b883c89e]{flex:none;color:var(--text-3);font-size:12px}.worker-tab-body[data-v-2e45450f]{padding:14px 16px}.worktree[data-v-ca173274]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-ca173274]{flex:1;min-width:0}.worktree-holder[data-v-ca173274]{font-weight:500}.worktree-folder[data-v-ca173274]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-ca173274]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { computed as f, openBlock as r, createBlock as _, unref as t, withCtx as i, createVNode as m, createElementVNode as o, toDisplayString as s, createElementBlock as u, createCommentVNode as h } from "vue";
import { useWindow as g, WindowRoom as k, RowList as x } from "@journal/window-kit";
import { _ as v } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const y = { class: "number" }, B = { class: "main" }, N = { class: "note" }, V = {
  key: 0,
  class: "note"
}, b = {
  __name: "Points",
  setup(C) {
    const a = g();
    a.state["points.agent"] = String(a.agent);
    const { data: p, failure: c, loaded: l } = a.props.points, d = f(() => {
      var n;
      return ((n = p.value) == null ? void 0 : n.points) ?? [];
    });
    return (n, E) => (r(), _(t(k), null, {
      default: i(() => [
        m(t(x), {
          rows: d.value,
          failure: t(c),
          loaded: t(l),
          empty: "This agent has no task brief to prove",
          hint: "Task requirements and the evidence for each appear here."
        }, {
          default: i(({ row: e }) => [
            o("span", y, s(e.id), 1),
            o("span", B, [
              o("span", null, s(e.text), 1),
              o("span", N, s(e.proof ? `${e.proof.state}: ${e.proof.text}` : "no proof yet"), 1),
              e.proof && e.proof.shortfall ? (r(), u("span", V, "missing: " + s(e.proof.shortfall), 1)) : h("", !0)
            ])
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, T = /* @__PURE__ */ v(b, [["__scopeId", "data-v-470549ee"]]);
export {
  T as default
};
