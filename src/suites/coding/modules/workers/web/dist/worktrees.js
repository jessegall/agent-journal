/* @code-commandments-generated */
if (!document.getElementById("window-styles-e71d4abd7e0c")) { const style = document.createElement("style"); style.id = "window-styles-e71d4abd7e0c"; style.textContent = ".worker-models[data-v-e982edb4]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-e982edb4]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-e982edb4]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-e982edb4]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-e982edb4]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-e982edb4]{display:flex;gap:8px;align-items:center}.plan-bar[data-v-0af889c7]{position:relative;display:inline-flex;gap:8px;align-items:center;font-size:12.5px}.plan-bar-badge[data-v-0af889c7]{padding:0 7px;border:1px solid var(--border-2);border-radius:99px;color:var(--progress);font-size:11px;line-height:18px}.plan-bar-title[data-v-0af889c7],.plan-bar-delegation[data-v-0af889c7],.plan-bar-agent[data-v-0af889c7]{border:0;background:none;color:var(--text-2);font:inherit;cursor:pointer}.plan-bar-title[data-v-0af889c7]{max-width:260px;padding:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.plan-bar-delegation[data-v-0af889c7]{padding:0 8px;border:1px solid var(--border-2);border-radius:99px;line-height:20px}.plan-bar-popover[data-v-0af889c7]{position:absolute;top:calc(100% + 6px);right:0;z-index:5;display:flex;flex-direction:column;gap:4px;min-width:260px;padding:10px 12px;border:1px solid var(--border);border-radius:10px;background:var(--raised);box-shadow:0 8px 24px #00000040}.plan-bar-head[data-v-0af889c7]{margin:0 0 4px;color:var(--text-3);font-size:11.5px}.plan-bar-agent[data-v-0af889c7]{display:flex;flex-direction:column;align-items:flex-start;padding:2px 0;text-align:left}.plan-bar-agent span[data-v-0af889c7],.number[data-v-ad3f073f]{color:var(--text-3);font-size:12px}.main[data-v-ad3f073f]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-ad3f073f]{color:var(--text-3);font-size:12px}.main[data-v-ef968966]{flex:1}.note[data-v-ef968966]{color:var(--text-3);font-size:12px}.workers-count[data-v-10ae2edc]{display:inline-flex;gap:5px;align-items:center;padding:2px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12.5px;font-variant-numeric:tabular-nums;cursor:pointer}.workers-count[data-v-10ae2edc]:hover{background:var(--hover);color:var(--text)}.worker-moment[data-v-d9e1bce4]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-d9e1bce4]{flex:none;color:var(--text-3);font-size:12px}.worktree[data-v-fe754622]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-fe754622]{flex:1;min-width:0}.worktree-holder[data-v-fe754622]{font-weight:500}.worktree-folder[data-v-fe754622]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-fe754622]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as v, openBlock as l, createBlock as _, unref as o, withCtx as a, createVNode as u, createElementVNode as s, toDisplayString as d, createElementBlock as p, createCommentVNode as g, Fragment as x, createTextVNode as k } from "vue";
import { useRows as R, WindowRoom as W, RowList as j, Btn as c, removed as B } from "@journal/window-kit";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const V = ["data-worktree"], b = { class: "worktree-names" }, P = { class: "worktree-holder" }, D = { class: "worktree-folder" }, F = {
  key: 0,
  class: "worktree-refusal",
  role: "alert",
  "data-worktree-refusal": ""
}, H = {
  __name: "ProjectWorktrees",
  setup(I) {
    const { rows: h, failure: w, loaded: C, act: $ } = R("project-worktree list", []), n = v(""), i = v({});
    function y(e) {
      return e.is_checkout ? "Main checkout" : e.worker_id !== null ? `Worker ${e.worker_id}` : e.agent_count ? `Environment ${e.environment}, agent running` : e.environment ? `Environment ${e.environment}` : "No environment";
    }
    const N = (e) => e.is_checkout || e.worker_id !== null || e.agent_count > 0;
    async function m(e) {
      if (n.value !== e.id) return void (n.value = e.id);
      n.value = "";
      const t = await $(["project-worktree", "remove", e.folder], B(e.id));
      i.value = { ...i.value, [e.id]: t.ok ? "" : t.error };
    }
    return (e, t) => (l(), _(o(W), null, {
      default: a(() => [
        u(o(j), {
          rows: o(h),
          failure: o(w),
          loaded: o(C),
          empty: "No worktrees",
          hint: "Worker working copies appear here until their changes are merged."
        }, {
          default: a(({ row: r }) => [
            s("div", {
              class: "worktree",
              "data-worktree": r.folder
            }, [
              s("div", b, [
                s("span", P, d(y(r)), 1),
                s("p", D, d(r.folder) + d(r.branch ? ` on ${r.branch}` : ""), 1),
                i.value[r.id] ? (l(), p("p", F, d(i.value[r.id]), 1)) : g("", !0)
              ]),
              n.value === r.id ? (l(), p(x, { key: 0 }, [
                u(o(c), {
                  small: "",
                  "data-worktree-keep": "",
                  onClick: t[0] || (t[0] = (f) => n.value = "")
                }, {
                  default: a(() => [...t[1] || (t[1] = [
                    k("Keep it", -1)
                  ])]),
                  _: 1
                }),
                u(o(c), {
                  small: "",
                  kind: "danger",
                  "data-worktree-confirm": "",
                  onClick: (f) => m(r)
                }, {
                  default: a(() => [...t[2] || (t[2] = [
                    k("Yes, remove the folder", -1)
                  ])]),
                  _: 1
                }, 8, ["onClick"])
              ], 64)) : N(r) ? g("", !0) : (l(), _(o(c), {
                key: 1,
                small: "",
                kind: "danger",
                title: "Remove this worktree folder, keeping its branch",
                "data-worktree-remove": "",
                onClick: (f) => m(r)
              }, {
                default: a(() => [...t[3] || (t[3] = [
                  k("Remove worktree", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]))
            ], 8, V)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, S = /* @__PURE__ */ E(H, [["__scopeId", "data-v-fe754622"]]);
export {
  S as default
};
