/* @code-commandments-generated */
if (!document.getElementById("window-styles-dc07c7617deb")) { const style = document.createElement("style"); style.id = "window-styles-dc07c7617deb"; style.textContent = ".worker-models[data-v-310982ed]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-310982ed]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-310982ed]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-310982ed]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-310982ed]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-310982ed]{display:flex;gap:8px;align-items:center}.number[data-v-d5811db8]{color:var(--text-3);font-size:12px}.main[data-v-d5811db8]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-d5811db8]{color:var(--text-3);font-size:12px}.main[data-v-35658be4]{flex:1}.note[data-v-35658be4]{color:var(--text-3);font-size:12px}.worktree[data-v-28015355]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-28015355]{flex:1;min-width:0}.worktree-holder[data-v-28015355]{font-weight:500}.worktree-folder[data-v-28015355]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-28015355]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as n, openBlock as p, createBlock as f, unref as _, withCtx as d, createElementVNode as t, toDisplayString as s, createElementBlock as u, createCommentVNode as h } from "vue";
import { useWindow as m, RowList as k } from "@journal/window-kit";
import { _ as v } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const w = { class: "number" }, x = { class: "main" }, g = { class: "note" }, y = {
  key: 0,
  class: "note"
}, b = {
  __name: "Points",
  setup(B) {
    const a = m(), r = n([]), i = n(""), l = n(!1);
    async function c() {
      const o = await a.read(`worker-worktree points --agent ${a.agent}`);
      i.value = o.ok ? "" : o.error, r.value = o.ok ? o.value.points : [], l.value = !0;
    }
    return a.follow(["proof.*", "worker_worktree.*"], c), c(), (o, $) => (p(), f(_(k), {
      rows: r.value,
      failure: i.value,
      loaded: l.value,
      empty: "This agent has no task brief to prove",
      hint: "The points of the brief of the task it was given show here, each with its proof."
    }, {
      default: d(({ row: e }) => [
        t("span", w, s(e.id), 1),
        t("span", x, [
          t("span", null, s(e.text), 1),
          t("span", g, s(e.proof ? `${e.proof.state}: ${e.proof.text}` : "no proof yet"), 1),
          e.proof && e.proof.shortfall ? (p(), u("span", y, "missing: " + s(e.proof.shortfall), 1)) : h("", !0)
        ])
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, P = /* @__PURE__ */ v(b, [["__scopeId", "data-v-d5811db8"]]);
export {
  P as default
};
