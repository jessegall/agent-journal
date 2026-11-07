/* @code-commandments-generated */
if (!document.getElementById("window-styles-43f28005cf6c")) { const style = document.createElement("style"); style.id = "window-styles-43f28005cf6c"; style.textContent = ".worker-models[data-v-f2e1dbd2]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-f2e1dbd2]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-f2e1dbd2]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-f2e1dbd2]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-f2e1dbd2]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-f2e1dbd2]{display:flex;gap:8px;align-items:center}.number[data-v-d52c1a26]{color:var(--text-3);font-size:12px}.main[data-v-d52c1a26]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-d52c1a26]{color:var(--text-3);font-size:12px}.main[data-v-dca1eb21]{flex:1}.note[data-v-dca1eb21]{color:var(--text-3);font-size:12px}.worker-moment[data-v-774d56be]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-774d56be]{flex:none;color:var(--text-3);font-size:12px}.worker-tab-body[data-v-ac3caed9]{padding:14px 16px}.worktree[data-v-a10f9f34]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-a10f9f34]{flex:1;min-width:0}.worktree-holder[data-v-a10f9f34]{font-weight:500}.worktree-folder[data-v-a10f9f34]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-a10f9f34]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { computed as f, openBlock as r, createBlock as _, unref as t, withCtx as i, createVNode as m, createElementVNode as o, toDisplayString as s, createElementBlock as u, createCommentVNode as h } from "vue";
import { useWindow as g, WindowRoom as k, RowList as v } from "@journal/window-kit";
import { _ as x } from "./_plugin-vue_export-helper-CHgC5LLL.js";
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
        m(t(v), {
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
}, T = /* @__PURE__ */ x(b, [["__scopeId", "data-v-d52c1a26"]]);
export {
  T as default
};
