/* @code-commandments-generated */
if (!document.getElementById("window-styles-264980fd187f")) { const style = document.createElement("style"); style.id = "window-styles-264980fd187f"; style.textContent = ".number[data-v-fa354fe6]{color:var(--text-3);font-size:12px}.main[data-v-fa354fe6]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-fa354fe6]{color:var(--text-3);font-size:12px}.main[data-v-2041751c]{flex:1}.note[data-v-2041751c]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as p, openBlock as u, createBlock as h, unref as v, withCtx as w, createElementVNode as a, toDisplayString as n, createElementBlock as g, createCommentVNode as x } from "vue";
import { useWindow as P, RowList as b } from "@journal/window-kit";
import { _ as y } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const $ = { class: "number" }, B = { class: "main" }, E = { class: "note" }, I = {
  key: 0,
  class: "note"
}, _ = "- ", N = {
  __name: "Points",
  setup(C) {
    const r = P(), i = p([]), s = p("");
    function d(o) {
      const t = o.brief.split(`
`).filter((e) => e.startsWith(_)).map((e) => e.slice(_.length));
      return t.length ? t : [o.brief || o.title];
    }
    async function f() {
      const o = await r.read(`worker-worktree list --agent ${r.agent}`), t = o.ok ? o.value.rows[0] : null;
      if (!t) {
        s.value = o.ok ? "" : o.error, i.value = [];
        return;
      }
      const [e, l] = await Promise.all([r.read(`task show ${t.task_id}`), r.read(`proof list --worktree ${t.id}`)]);
      if (!e.ok || !l.ok) {
        s.value = e.ok ? l.error : e.error;
        return;
      }
      s.value = "", i.value = d(e.value).map((m, c) => ({
        id: c + 1,
        text: m,
        proof: l.value.rows.find((k) => k.point === c + 1)
      }));
    }
    return r.follow(["proof.*", "worker_worktree.*"], f), f(), (o, t) => (u(), h(v(b), {
      rows: i.value,
      failure: s.value,
      empty: "This agent has no task brief to prove"
    }, {
      default: w(({ row: e }) => [
        a("span", $, n(e.id), 1),
        a("span", B, [
          a("span", null, n(e.text), 1),
          a("span", E, n(e.proof ? `${e.proof.state}: ${e.proof.text}` : "no proof yet"), 1),
          e.proof && e.proof.shortfall ? (u(), g("span", I, "missing: " + n(e.proof.shortfall), 1)) : x("", !0)
        ])
      ]),
      _: 1
    }, 8, ["rows", "failure"]));
  }
}, W = /* @__PURE__ */ y(N, [["__scopeId", "data-v-fa354fe6"]]);
export {
  W as default
};
