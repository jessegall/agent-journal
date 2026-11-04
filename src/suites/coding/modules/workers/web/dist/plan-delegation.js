/* @code-commandments-generated */
if (!document.getElementById("window-styles-6012a70fa090")) { const style = document.createElement("style"); style.id = "window-styles-6012a70fa090"; style.textContent = ".worker-models[data-v-e982edb4]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-e982edb4]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-e982edb4]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-e982edb4]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-e982edb4]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-e982edb4]{display:flex;gap:8px;align-items:center}.plan-bar[data-v-0af889c7]{position:relative;display:inline-flex;gap:8px;align-items:center;font-size:12.5px}.plan-bar-badge[data-v-0af889c7]{padding:0 7px;border:1px solid var(--border-2);border-radius:99px;color:var(--progress);font-size:11px;line-height:18px}.plan-bar-title[data-v-0af889c7],.plan-bar-delegation[data-v-0af889c7],.plan-bar-agent[data-v-0af889c7]{border:0;background:none;color:var(--text-2);font:inherit;cursor:pointer}.plan-bar-title[data-v-0af889c7]{max-width:260px;padding:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.plan-bar-delegation[data-v-0af889c7]{padding:0 8px;border:1px solid var(--border-2);border-radius:99px;line-height:20px}.plan-bar-popover[data-v-0af889c7]{position:absolute;top:calc(100% + 6px);right:0;z-index:5;display:flex;flex-direction:column;gap:4px;min-width:260px;padding:10px 12px;border:1px solid var(--border);border-radius:10px;background:var(--raised);box-shadow:0 8px 24px #00000040}.plan-bar-head[data-v-0af889c7]{margin:0 0 4px;color:var(--text-3);font-size:11.5px}.plan-bar-agent[data-v-0af889c7]{display:flex;flex-direction:column;align-items:flex-start;padding:2px 0;text-align:left}.plan-bar-agent span[data-v-0af889c7],.number[data-v-ad3f073f]{color:var(--text-3);font-size:12px}.main[data-v-ad3f073f]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-ad3f073f]{color:var(--text-3);font-size:12px}.main[data-v-ef968966]{flex:1}.note[data-v-ef968966]{color:var(--text-3);font-size:12px}.workers-count[data-v-10ae2edc]{display:inline-flex;gap:5px;align-items:center;padding:2px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12.5px;font-variant-numeric:tabular-nums;cursor:pointer}.workers-count[data-v-10ae2edc]:hover{background:var(--hover);color:var(--text)}.worktree[data-v-fe754622]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-fe754622]{flex:1;min-width:0}.worktree-holder[data-v-fe754622]{font-weight:500}.worktree-folder[data-v-fe754622]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-fe754622]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as d, computed as m, openBlock as l, createBlock as g, unref as p, withCtx as y, createElementBlock as i, createElementVNode as n, toDisplayString as o, Fragment as k, withModifiers as w, renderList as x, createCommentVNode as u } from "vue";
import { useWindow as $, useOutside as C, WindowRoom as A, peekRef as _, delegationWord as B } from "@journal/window-kit";
import { _ as D } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const P = ["title"], W = ["aria-expanded"], h = {
  key: 0,
  class: "plan-bar-popover",
  role: "dialog",
  "aria-label": "Agents on this plan",
  "data-plan-bar-popover": ""
}, E = ["onClick"], N = {
  __name: "PlanDelegation",
  setup(R) {
    const c = $(), v = d([]), s = d(!1), b = d(null);
    C(b, () => s.value = !1);
    const a = m(() => v.value.find((r) => r.state === "started") ?? null);
    async function f() {
      const r = await c.read("plan board");
      v.value = r.ok ? r.value.plans : [];
    }
    return c.follow(["plan.*", "task.*"], f), f(), (r, e) => (l(), g(p(A), null, {
      default: y(() => [
        a.value ? (l(), i("span", {
          key: 0,
          ref_key: "root",
          ref: b,
          class: "plan-bar",
          "data-plan-bar": ""
        }, [
          e[3] || (e[3] = n("span", {
            class: "plan-bar-badge",
            "data-plan-bar-badge": ""
          }, "Active", -1)),
          n("button", {
            type: "button",
            class: "plan-bar-title",
            title: a.value.title,
            "data-plan-bar-title": "",
            onClick: e[0] || (e[0] = (t) => p(_)(`plans:${a.value.id}`))
          }, "Plan " + o(a.value.id) + ": " + o(a.value.title), 9, P),
          a.value.delegated ? (l(), i(k, { key: 0 }, [
            n("button", {
              type: "button",
              class: "plan-bar-delegation",
              "aria-expanded": s.value,
              "data-plan-bar-delegation": "",
              onClick: e[1] || (e[1] = w((t) => s.value = !s.value, ["stop"]))
            }, o(p(B)(a.value)), 9, W),
            s.value ? (l(), i("div", h, [
              e[2] || (e[2] = n("p", { class: "plan-bar-head" }, "Agents on this plan", -1)),
              (l(!0), i(k, null, x(a.value.agents, (t) => (l(), i("button", {
                key: `${t.id}:${t.task_id}`,
                type: "button",
                class: "plan-bar-agent",
                "data-plan-bar-agent": "",
                onClick: (V) => p(_)(`agents:${t.id}`)
              }, [
                n("strong", null, o(t.name), 1),
                n("span", null, "task " + o(t.task_id) + ": " + o(t.task_title), 1)
              ], 8, E))), 128))
            ])) : u("", !0)
          ], 64)) : u("", !0)
        ], 512)) : u("", !0)
      ]),
      _: 1
    }));
  }
}, M = /* @__PURE__ */ D(N, [["__scopeId", "data-v-0af889c7"]]);
export {
  M as default
};
