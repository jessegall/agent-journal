/* @code-commandments-generated */
if (!document.getElementById("window-styles-61d024f416fa")) { const style = document.createElement("style"); style.id = "window-styles-61d024f416fa"; style.textContent = ".worker-models[data-v-39e23a54]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-39e23a54]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-39e23a54]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-39e23a54]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-39e23a54]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-39e23a54]{display:flex;gap:8px;align-items:center}.number[data-v-878fda70]{color:var(--text-3);font-size:12px}.main[data-v-878fda70]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-878fda70]{color:var(--text-3);font-size:12px}.main[data-v-176788f1]{flex:1}.note[data-v-176788f1]{color:var(--text-3);font-size:12px}.worktree[data-v-a608a096]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-a608a096]{flex:1;min-width:0}.worktree-holder[data-v-a608a096]{font-weight:500}.worktree-folder[data-v-a608a096]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-a608a096]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as v, openBlock as s, createBlock as _, unref as o, withCtx as a, createVNode as k, createElementVNode as l, toDisplayString as d, createElementBlock as p, createCommentVNode as h, Fragment as x, createTextVNode as u } from "vue";
import { useRows as R, WindowRoom as j, RowList as B, Btn as c, removed as E } from "@journal/window-kit";
import { _ as V } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const W = ["data-worktree"], b = { class: "worktree-names" }, P = { class: "worktree-holder" }, A = { class: "worktree-folder" }, D = {
  key: 0,
  class: "worktree-refusal",
  role: "alert",
  "data-worktree-refusal": ""
}, F = {
  __name: "ProjectWorktrees",
  setup(H) {
    const { rows: w, failure: g, loaded: C, act: $ } = R("project-worktree list", []), n = v(""), i = v({});
    function y(e) {
      return e.is_checkout ? "Main checkout" : e.worker_id !== null ? `Worker ${e.worker_id}` : e.agent_count ? `Environment ${e.environment}, agent running` : e.environment ? `Environment ${e.environment}` : "No environment";
    }
    const N = (e) => e.is_checkout || e.worker_id !== null || e.agent_count > 0;
    async function m(e) {
      if (n.value !== e.id) return void (n.value = e.id);
      n.value = "";
      const t = await $(["project-worktree", "remove", e.folder], E(e.id));
      i.value = { ...i.value, [e.id]: t.ok ? "" : t.error };
    }
    return (e, t) => (s(), _(o(j), null, {
      default: a(() => [
        k(o(B), {
          rows: o(w),
          failure: o(g),
          loaded: o(C),
          empty: "No worktrees",
          hint: "A worker's worktree shows here while it works and until its work is merged."
        }, {
          default: a(({ row: r }) => [
            l("div", {
              class: "worktree",
              "data-worktree": r.folder
            }, [
              l("div", b, [
                l("span", P, d(y(r)), 1),
                l("p", A, d(r.folder) + d(r.branch ? ` on ${r.branch}` : ""), 1),
                i.value[r.id] ? (s(), p("p", D, d(i.value[r.id]), 1)) : h("", !0)
              ]),
              n.value === r.id ? (s(), p(x, { key: 0 }, [
                k(o(c), {
                  small: "",
                  "data-worktree-keep": "",
                  onClick: t[0] || (t[0] = (f) => n.value = "")
                }, {
                  default: a(() => [...t[1] || (t[1] = [
                    u("Keep it", -1)
                  ])]),
                  _: 1
                }),
                k(o(c), {
                  small: "",
                  kind: "danger",
                  "data-worktree-confirm": "",
                  onClick: (f) => m(r)
                }, {
                  default: a(() => [...t[2] || (t[2] = [
                    u("Yes, remove the folder", -1)
                  ])]),
                  _: 1
                }, 8, ["onClick"])
              ], 64)) : N(r) ? h("", !0) : (s(), _(o(c), {
                key: 1,
                small: "",
                kind: "danger",
                title: "Remove this worktree folder, keeping its branch",
                "data-worktree-remove": "",
                onClick: (f) => m(r)
              }, {
                default: a(() => [...t[3] || (t[3] = [
                  u("Remove worktree", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]))
            ], 8, W)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, M = /* @__PURE__ */ V(F, [["__scopeId", "data-v-a608a096"]]);
export {
  M as default
};
