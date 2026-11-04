/* @code-commandments-generated */
if (!document.getElementById("window-styles-a4feb3648708")) { const style = document.createElement("style"); style.id = "window-styles-a4feb3648708"; style.textContent = ".worker-models[data-v-ea84e528]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-ea84e528]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-ea84e528]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-ea84e528]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-ea84e528]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-ea84e528]{display:flex;gap:8px;align-items:center}.plan-bar[data-v-f62e90bd]{position:relative;display:inline-flex;gap:8px;align-items:center;font-size:12.5px}.plan-bar-badge[data-v-f62e90bd]{padding:0 7px;border:1px solid var(--border-2);border-radius:99px;color:var(--progress);font-size:11px;line-height:18px}.plan-bar-title[data-v-f62e90bd],.plan-bar-delegation[data-v-f62e90bd],.plan-bar-agent[data-v-f62e90bd]{border:0;background:none;color:var(--text-2);font:inherit;cursor:pointer}.plan-bar-title[data-v-f62e90bd]{max-width:260px;padding:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.plan-bar-delegation[data-v-f62e90bd]{padding:0 8px;border:1px solid var(--border-2);border-radius:99px;line-height:20px}.plan-bar-popover[data-v-f62e90bd]{position:absolute;top:calc(100% + 6px);right:0;z-index:5;display:flex;flex-direction:column;gap:4px;min-width:260px;padding:10px 12px;border:1px solid var(--border);border-radius:10px;background:var(--raised);box-shadow:0 8px 24px #00000040}.plan-bar-head[data-v-f62e90bd]{margin:0 0 4px;color:var(--text-3);font-size:11.5px}.plan-bar-agent[data-v-f62e90bd]{display:flex;flex-direction:column;align-items:flex-start;padding:2px 0;text-align:left}.plan-bar-agent span[data-v-f62e90bd],.number[data-v-073d22f6]{color:var(--text-3);font-size:12px}.main[data-v-073d22f6]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-073d22f6]{color:var(--text-3);font-size:12px}.main[data-v-b360bbe9]{flex:1}.note[data-v-b360bbe9]{color:var(--text-3);font-size:12px}.workers-count[data-v-beb16041]{display:inline-flex;gap:5px;align-items:center;padding:2px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12.5px;font-variant-numeric:tabular-nums;cursor:pointer}.workers-count[data-v-beb16041]:hover{background:var(--hover);color:var(--text)}.worker-moment[data-v-661201ce]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-661201ce]{flex:none;color:var(--text-3);font-size:12px}.worktree[data-v-cee4d71e]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-cee4d71e]{flex:1;min-width:0}.worktree-holder[data-v-cee4d71e]{font-weight:500}.worktree-folder[data-v-cee4d71e]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-cee4d71e]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as v, openBlock as l, createBlock as _, unref as o, withCtx as a, createVNode as u, createElementVNode as s, toDisplayString as d, createElementBlock as p, createCommentVNode as g, Fragment as x, createTextVNode as c } from "vue";
import { useRows as R, WindowRoom as W, RowList as j, Btn as k, removed as B } from "@journal/window-kit";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
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
                  kind: "danger",
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
                kind: "danger",
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
}, S = /* @__PURE__ */ E(H, [["__scopeId", "data-v-cee4d71e"]]);
export {
  S as default
};
