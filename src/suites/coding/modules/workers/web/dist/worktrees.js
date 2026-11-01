/* @code-commandments-generated */
if (!document.getElementById("window-styles-4744398a2fa7")) { const style = document.createElement("style"); style.id = "window-styles-4744398a2fa7"; style.textContent = ".worker-models[data-v-0f463709]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-0f463709]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-0f463709]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-0f463709]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-0f463709]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-0f463709]{display:flex;gap:8px;align-items:center}.number[data-v-003ae4c2]{color:var(--text-3);font-size:12px}.main[data-v-003ae4c2]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-003ae4c2]{color:var(--text-3);font-size:12px}.main[data-v-d17dfe5e]{flex:1}.note[data-v-d17dfe5e]{color:var(--text-3);font-size:12px}.worktree[data-v-ae7a1c5d]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-ae7a1c5d]{flex:1;min-width:0}.worktree-holder[data-v-ae7a1c5d]{font-weight:500}.worktree-folder[data-v-ae7a1c5d]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-ae7a1c5d]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as m, openBlock as l, createBlock as v, unref as o, withCtx as i, createElementVNode as s, toDisplayString as d, createElementBlock as _, createCommentVNode as p, Fragment as j, createVNode as g, createTextVNode as k } from "vue";
import { useRows as B, RowList as E, Btn as u } from "@journal/window-kit";
import { _ as R } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const V = ["data-worktree"], b = { class: "worktree-names" }, W = { class: "worktree-holder" }, P = { class: "worktree-folder" }, D = {
  key: 0,
  class: "worktree-refusal",
  role: "alert",
  "data-worktree-refusal": ""
}, F = {
  __name: "ProjectWorktrees",
  setup(H) {
    const { rows: h, failure: C, loaded: $, load: w, context: x } = B("project-worktree list", []), n = m(""), a = m({});
    function y(e) {
      return e.is_checkout ? "Main checkout" : e.worker_id !== null ? `Worker ${e.worker_id}` : e.agent_count ? `Environment ${e.environment}, agent running` : e.environment ? `Environment ${e.environment}` : "No environment";
    }
    const N = (e) => e.is_checkout || e.worker_id !== null || e.agent_count > 0;
    async function c(e) {
      if (n.value !== e.id) return void (n.value = e.id);
      const t = await x.run(["project-worktree", "remove", e.folder]);
      a.value = { ...a.value, [e.id]: t.ok ? "" : t.error }, n.value = "", t.ok && w();
    }
    return (e, t) => (l(), v(o(E), {
      rows: o(h),
      failure: o(C),
      loaded: o($),
      empty: "No worktrees"
    }, {
      default: i(({ row: r }) => [
        s("div", {
          class: "worktree",
          "data-worktree": r.folder
        }, [
          s("div", b, [
            s("span", W, d(y(r)), 1),
            s("p", P, d(r.folder) + d(r.branch ? ` on ${r.branch}` : ""), 1),
            a.value[r.id] ? (l(), _("p", D, d(a.value[r.id]), 1)) : p("", !0)
          ]),
          n.value === r.id ? (l(), _(j, { key: 0 }, [
            g(o(u), {
              small: "",
              "data-worktree-keep": "",
              onClick: t[0] || (t[0] = (f) => n.value = "")
            }, {
              default: i(() => [...t[1] || (t[1] = [
                k("Keep it", -1)
              ])]),
              _: 1
            }),
            g(o(u), {
              small: "",
              kind: "danger",
              "data-worktree-confirm": "",
              onClick: (f) => c(r)
            }, {
              default: i(() => [...t[2] || (t[2] = [
                k("Yes, remove the folder", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ], 64)) : N(r) ? p("", !0) : (l(), v(o(u), {
            key: 1,
            small: "",
            kind: "danger",
            title: "Remove this worktree folder, keeping its branch",
            "data-worktree-remove": "",
            onClick: (f) => c(r)
          }, {
            default: i(() => [...t[3] || (t[3] = [
              k("Remove worktree", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]))
        ], 8, V)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, M = /* @__PURE__ */ R(F, [["__scopeId", "data-v-ae7a1c5d"]]);
export {
  M as default
};
