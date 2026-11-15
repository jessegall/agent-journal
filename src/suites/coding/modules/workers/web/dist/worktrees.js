if (!document.getElementById("window-styles-5eb4ed552c4a")) { const style = document.createElement("style"); style.id = "window-styles-5eb4ed552c4a"; style.textContent = ".worker-models[data-v-8506c219]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-8506c219]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-8506c219]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-8506c219]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-8506c219]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-8506c219]{display:flex;gap:8px;align-items:center}.number[data-v-6eb6af04]{color:var(--text-3);font-size:12px}.main[data-v-6eb6af04]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-6eb6af04]{color:var(--text-3);font-size:12px}.main[data-v-a11fd403]{flex:1}.note[data-v-a11fd403]{color:var(--text-3);font-size:12px}.worker-moment[data-v-826dfb51]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-826dfb51]{flex:none;color:var(--text-3);font-size:12px}.program[data-v-1b768aad]{display:flex;flex-direction:column;gap:6px;padding:10px 0;border-bottom:1px solid var(--border)}.share[data-v-1b768aad]{display:flex;align-items:center;gap:8px}input[data-v-1b768aad]{min-width:0;flex:1}output[data-v-1b768aad]{min-width:36px;text-align:right}small[data-v-1b768aad]{color:var(--text-3)}p[data-v-1b768aad]{margin:0}.actions[data-v-1b768aad]{display:flex;gap:6px}.route[data-v-928533ab]{display:flex;flex-direction:column;gap:6px;padding:10px 0;border-bottom:1px solid var(--border)}p[data-v-928533ab]{margin:0}small[data-v-928533ab]{color:var(--text-3)}.actions[data-v-928533ab]{display:flex;flex-wrap:wrap;gap:6px}.route-form[data-v-1c28c310]{display:flex;flex-direction:column;gap:8px;margin-top:12px}h4[data-v-1c28c310]{margin:0}label[data-v-1c28c310]{display:flex;align-items:center;gap:8px}select[data-v-1c28c310],input[type=number][data-v-1c28c310]{min-width:0;flex:1;background:var(--bg);color:var(--text);border:1px solid var(--border);padding:4px}.outage[data-v-079b94a1]{display:flex;flex-direction:column;gap:8px;padding:10px 0}label[data-v-079b94a1]{display:flex;gap:8px}input[data-v-079b94a1]{min-width:0;flex:1}.split[data-v-29716346]{display:flex;flex-direction:column;gap:8px}p[data-v-29716346],h3[data-v-29716346]{margin:0}p[data-v-29716346]{color:var(--text-3);font-size:12px}h3[data-v-29716346]{margin-top:12px;font-size:13px}label[data-v-29716346]{display:flex;align-items:center;gap:8px}input[data-v-29716346]{width:54px}[role=alert][data-v-29716346]{color:var(--danger)}.worker-tab-body[data-v-f8b83cb6]{padding:14px 16px}.worktree[data-v-158c53fa]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-158c53fa]{flex:1;min-width:0}.worktree-holder[data-v-158c53fa]{font-weight:500}.worktree-folder[data-v-158c53fa]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-158c53fa]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as v, openBlock as l, createBlock as _, unref as o, withCtx as a, createVNode as u, createElementVNode as s, toDisplayString as d, createElementBlock as p, createCommentVNode as g, Fragment as x, createTextVNode as c } from "vue";
import { useWindow as B, WindowRoom as E, RowList as R, Btn as k, removed as V } from "@journal/window-kit";
import { _ as b } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const j = ["data-worktree"], P = { class: "worktree-names" }, D = { class: "worktree-holder" }, F = { class: "worktree-folder" }, H = {
  key: 0,
  class: "worktree-refusal",
  role: "alert",
  "data-worktree-refusal": ""
}, I = {
  __name: "ProjectWorktrees",
  setup(K) {
    const h = B(), { rows: w, failure: C, loaded: $, act: y } = h.props.worktrees, n = v(""), i = v({});
    function N(e) {
      return e.is_checkout ? "Main checkout" : e.worker_id !== null ? `Worker ${e.worker_id}` : e.agent_count ? `Environment ${e.environment}, agent running` : e.environment ? `Environment ${e.environment}` : "No environment";
    }
    const W = (e) => e.is_checkout || e.worker_id !== null || e.agent_count > 0;
    async function m(e) {
      if (n.value !== e.id) return void (n.value = e.id);
      n.value = "";
      const t = await y(["project-worktree", "remove", e.folder], V(e.id));
      i.value = { ...i.value, [e.id]: t.ok ? "" : t.error };
    }
    return (e, t) => (l(), _(o(E), null, {
      default: a(() => [
        u(o(R), {
          rows: o(w),
          failure: o(C),
          loaded: o($),
          empty: "No worktrees",
          hint: "Worker working copies appear here until their changes are merged."
        }, {
          default: a(({ row: r }) => [
            s("div", {
              class: "worktree",
              "data-worktree": r.folder
            }, [
              s("div", P, [
                s("span", D, d(N(r)), 1),
                s("p", F, d(r.folder) + d(r.branch ? ` on ${r.branch}` : ""), 1),
                i.value[r.id] ? (l(), p("p", H, d(i.value[r.id]), 1)) : g("", !0)
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
              ], 64)) : W(r) ? g("", !0) : (l(), _(o(k), {
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
            ], 8, j)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, T = /* @__PURE__ */ b(I, [["__scopeId", "data-v-158c53fa"]]);
export {
  T as default
};
