/* @code-commandments-generated */
if (!document.getElementById("window-styles-c1ef6a3e59fa")) { const style = document.createElement("style"); style.id = "window-styles-c1ef6a3e59fa"; style.textContent = ".worker-models[data-v-703d4f39]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-703d4f39]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-703d4f39]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-703d4f39]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-703d4f39]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-703d4f39]{display:flex;gap:8px;align-items:center}.number[data-v-470549ee]{color:var(--text-3);font-size:12px}.main[data-v-470549ee]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-470549ee]{color:var(--text-3);font-size:12px}.main[data-v-7b462dac]{flex:1}.note[data-v-7b462dac]{color:var(--text-3);font-size:12px}.worker-moment[data-v-b883c89e]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-b883c89e]{flex:none;color:var(--text-3);font-size:12px}.worker-tab-body[data-v-2e45450f]{padding:14px 16px}.worktree[data-v-ca173274]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-ca173274]{flex:1;min-width:0}.worktree-holder[data-v-ca173274]{font-weight:500}.worktree-folder[data-v-ca173274]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-ca173274]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as v, openBlock as l, createBlock as _, unref as o, withCtx as a, createVNode as u, createElementVNode as s, toDisplayString as d, createElementBlock as p, createCommentVNode as g, Fragment as x, createTextVNode as c } from "vue";
import { useRows as R, WindowRoom as W, RowList as j, Btn as k, removed as B } from "@journal/window-kit";
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
                u(o(k), {
                  small: "",
                  "data-worktree-keep": "",
                  onClick: t[0] || (t[0] = (f) => n.value = "")
                }, {
                  default: a(() => [...t[1] || (t[1] = [
                    c("Keep it", -1)
                  ])]),
                  _: 1
                }),
                u(o(k), {
                  small: "",
                  variant: "danger",
                  "data-worktree-confirm": "",
                  onClick: (f) => m(r)
                }, {
                  default: a(() => [...t[2] || (t[2] = [
                    c("Yes, remove the folder", -1)
                  ])]),
                  _: 1
                }, 8, ["onClick"])
              ], 64)) : N(r) ? g("", !0) : (l(), _(o(k), {
                key: 1,
                small: "",
                variant: "danger",
                title: "Remove this worktree folder, keeping its branch",
                "data-worktree-remove": "",
                onClick: (f) => m(r)
              }, {
                default: a(() => [...t[3] || (t[3] = [
                  c("Remove worktree", -1)
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
}, S = /* @__PURE__ */ E(H, [["__scopeId", "data-v-ca173274"]]);
export {
  S as default
};
