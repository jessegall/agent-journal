/* @code-commandments-generated */
if (!document.getElementById("window-styles-c47430673806")) { const style = document.createElement("style"); style.id = "window-styles-c47430673806"; style.textContent = ".worker-models[data-v-57a26c8a]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-57a26c8a]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-57a26c8a]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-57a26c8a]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-57a26c8a]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-57a26c8a]{display:flex;gap:8px;align-items:center}.number[data-v-d5811db8]{color:var(--text-3);font-size:12px}.main[data-v-d5811db8]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-d5811db8]{color:var(--text-3);font-size:12px}.main[data-v-35658be4]{flex:1}.note[data-v-35658be4]{color:var(--text-3);font-size:12px}.worktree[data-v-91a64b63]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-91a64b63]{flex:1;min-width:0}.worktree-holder[data-v-91a64b63]{font-weight:500}.worktree-folder[data-v-91a64b63]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-91a64b63]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as f, openBlock as i, createBlock as v, unref as o, withCtx as s, createElementVNode as l, toDisplayString as d, createElementBlock as _, createCommentVNode as p, Fragment as x, createVNode as h, createTextVNode as k } from "vue";
import { useRows as b, RowList as j, Btn as u, removed as B } from "@journal/window-kit";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const R = ["data-worktree"], V = { class: "worktree-names" }, W = { class: "worktree-holder" }, P = { class: "worktree-folder" }, A = {
  key: 0,
  class: "worktree-refusal",
  role: "alert",
  "data-worktree-refusal": ""
}, D = {
  __name: "ProjectWorktrees",
  setup(F) {
    const { rows: g, failure: w, loaded: C, act: $ } = b("project-worktree list", []), n = f(""), a = f({});
    function y(e) {
      return e.is_checkout ? "Main checkout" : e.worker_id !== null ? `Worker ${e.worker_id}` : e.agent_count ? `Environment ${e.environment}, agent running` : e.environment ? `Environment ${e.environment}` : "No environment";
    }
    const N = (e) => e.is_checkout || e.worker_id !== null || e.agent_count > 0;
    async function c(e) {
      if (n.value !== e.id) return void (n.value = e.id);
      n.value = "";
      const t = await $(["project-worktree", "remove", e.folder], B(e.id));
      a.value = { ...a.value, [e.id]: t.ok ? "" : t.error };
    }
    return (e, t) => (i(), v(o(j), {
      rows: o(g),
      failure: o(w),
      loaded: o(C),
      empty: "No worktrees",
      hint: "A worker's worktree shows here while it works and until its work is merged."
    }, {
      default: s(({ row: r }) => [
        l("div", {
          class: "worktree",
          "data-worktree": r.folder
        }, [
          l("div", V, [
            l("span", W, d(y(r)), 1),
            l("p", P, d(r.folder) + d(r.branch ? ` on ${r.branch}` : ""), 1),
            a.value[r.id] ? (i(), _("p", A, d(a.value[r.id]), 1)) : p("", !0)
          ]),
          n.value === r.id ? (i(), _(x, { key: 0 }, [
            h(o(u), {
              small: "",
              "data-worktree-keep": "",
              onClick: t[0] || (t[0] = (m) => n.value = "")
            }, {
              default: s(() => [...t[1] || (t[1] = [
                k("Keep it", -1)
              ])]),
              _: 1
            }),
            h(o(u), {
              small: "",
              kind: "danger",
              "data-worktree-confirm": "",
              onClick: (m) => c(r)
            }, {
              default: s(() => [...t[2] || (t[2] = [
                k("Yes, remove the folder", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ], 64)) : N(r) ? p("", !0) : (i(), v(o(u), {
            key: 1,
            small: "",
            kind: "danger",
            title: "Remove this worktree folder, keeping its branch",
            "data-worktree-remove": "",
            onClick: (m) => c(r)
          }, {
            default: s(() => [...t[3] || (t[3] = [
              k("Remove worktree", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]))
        ], 8, R)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, L = /* @__PURE__ */ E(D, [["__scopeId", "data-v-91a64b63"]]);
export {
  L as default
};
