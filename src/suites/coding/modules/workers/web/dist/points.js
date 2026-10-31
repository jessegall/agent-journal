/* @code-commandments-generated */
if (!document.getElementById("window-styles-6277b4c92604")) { const style = document.createElement("style"); style.id = "window-styles-6277b4c92604"; style.textContent = ".number[data-v-de42c19d]{color:var(--text-3);font-size:12px}.main[data-v-de42c19d]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-de42c19d]{color:var(--text-3);font-size:12px}.main[data-v-41c93352]{flex:1}.note[data-v-41c93352]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as c, openBlock as d, createBlock as h, unref as w, withCtx as g, createElementVNode as n, toDisplayString as l, createElementBlock as x, createCommentVNode as P } from "vue";
import { useWindow as b, RowList as y } from "@journal/window-kit";
import { _ as $ } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const B = { class: "number" }, E = { class: "main" }, I = { class: "note" }, N = {
  key: 0,
  class: "note"
}, _ = "- ", C = {
  __name: "Points",
  setup(R) {
    const r = b(), i = c([]), s = c(""), a = c(!1);
    function k(o) {
      const t = [];
      for (const e of o.brief.split(`
`))
        e.startsWith(_) && t.push(e.slice(_.length));
      return t.length ? t : [o.brief || o.title];
    }
    async function u() {
      const o = await r.read(`worker-worktree list --agent ${r.agent}`), t = o.ok ? o.value.rows[0] : null;
      if (!t) {
        s.value = o.ok ? "" : o.error, i.value = [], a.value = !0;
        return;
      }
      const [e, f] = await Promise.all([r.read(`task show ${t.task_id}`), r.read(`proof list --worktree ${t.id}`)]);
      if (!e.ok || !f.ok) {
        s.value = e.ok ? f.error : e.error, a.value = !0;
        return;
      }
      s.value = "", a.value = !0, i.value = k(e.value).map((m, p) => ({
        id: p + 1,
        text: m,
        proof: f.value.rows.find((v) => v.point === p + 1)
      }));
    }
    return r.follow(["proof.*", "worker_worktree.*"], u), u(), (o, t) => (d(), h(w(y), {
      rows: i.value,
      failure: s.value,
      loaded: a.value,
      empty: "This agent has no task brief to prove"
    }, {
      default: g(({ row: e }) => [
        n("span", B, l(e.id), 1),
        n("span", E, [
          n("span", null, l(e.text), 1),
          n("span", I, l(e.proof ? `${e.proof.state}: ${e.proof.text}` : "no proof yet"), 1),
          e.proof && e.proof.shortfall ? (d(), x("span", N, "missing: " + l(e.proof.shortfall), 1)) : P("", !0)
        ])
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, D = /* @__PURE__ */ $(C, [["__scopeId", "data-v-de42c19d"]]);
export {
  D as default
};
