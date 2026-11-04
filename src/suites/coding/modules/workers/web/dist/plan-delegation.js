/* @code-commandments-generated */
if (!document.getElementById("window-styles-a4feb3648708")) { const style = document.createElement("style"); style.id = "window-styles-a4feb3648708"; style.textContent = ".worker-models[data-v-ea84e528]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-ea84e528]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-ea84e528]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-ea84e528]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-ea84e528]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-ea84e528]{display:flex;gap:8px;align-items:center}.plan-bar[data-v-f62e90bd]{position:relative;display:inline-flex;gap:8px;align-items:center;font-size:12.5px}.plan-bar-badge[data-v-f62e90bd]{padding:0 7px;border:1px solid var(--border-2);border-radius:99px;color:var(--progress);font-size:11px;line-height:18px}.plan-bar-title[data-v-f62e90bd],.plan-bar-delegation[data-v-f62e90bd],.plan-bar-agent[data-v-f62e90bd]{border:0;background:none;color:var(--text-2);font:inherit;cursor:pointer}.plan-bar-title[data-v-f62e90bd]{max-width:260px;padding:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.plan-bar-delegation[data-v-f62e90bd]{padding:0 8px;border:1px solid var(--border-2);border-radius:99px;line-height:20px}.plan-bar-popover[data-v-f62e90bd]{position:absolute;top:calc(100% + 6px);right:0;z-index:5;display:flex;flex-direction:column;gap:4px;min-width:260px;padding:10px 12px;border:1px solid var(--border);border-radius:10px;background:var(--raised);box-shadow:0 8px 24px #00000040}.plan-bar-head[data-v-f62e90bd]{margin:0 0 4px;color:var(--text-3);font-size:11.5px}.plan-bar-agent[data-v-f62e90bd]{display:flex;flex-direction:column;align-items:flex-start;padding:2px 0;text-align:left}.plan-bar-agent span[data-v-f62e90bd],.number[data-v-073d22f6]{color:var(--text-3);font-size:12px}.main[data-v-073d22f6]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-073d22f6]{color:var(--text-3);font-size:12px}.main[data-v-b360bbe9]{flex:1}.note[data-v-b360bbe9]{color:var(--text-3);font-size:12px}.workers-count[data-v-beb16041]{display:inline-flex;gap:5px;align-items:center;padding:2px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12.5px;font-variant-numeric:tabular-nums;cursor:pointer}.workers-count[data-v-beb16041]:hover{background:var(--hover);color:var(--text)}.worker-moment[data-v-661201ce]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-661201ce]{flex:none;color:var(--text-3);font-size:12px}.worktree[data-v-cee4d71e]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-cee4d71e]{flex:1;min-width:0}.worktree-holder[data-v-cee4d71e]{font-weight:500}.worktree-folder[data-v-cee4d71e]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-cee4d71e]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as p, computed as m, openBlock as l, createBlock as g, unref as d, withCtx as y, createElementBlock as i, createElementVNode as n, toDisplayString as o, Fragment as k, withModifiers as w, renderList as x, createCommentVNode as u } from "vue";
import { useWindow as $, useOutside as C, WindowRoom as A, peekRef as _, delegationWord as B } from "@journal/window-kit";
import { _ as D } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const P = ["title"], W = ["aria-expanded"], h = {
  key: 0,
  class: "plan-bar-popover",
  role: "dialog",
  "aria-label": "Agents on this plan",
  "data-plan-bar-popover": ""
}, E = ["onClick"], N = {
  __name: "PlanDelegation",
  setup(R) {
    const c = $(), b = p([]), s = p(!1), v = p(null);
    C(v, () => s.value = !1);
    const a = m(() => b.value.find((r) => r.state === "started") ?? null);
    async function f() {
      const r = await c.read("plan board");
      b.value = r.ok ? r.value.plans : [];
    }
    return c.follow(["plan.*", "task.*"], f), f(), (r, e) => (l(), g(d(A), null, {
      default: y(() => [
        a.value ? (l(), i("span", {
          key: 0,
          ref_key: "root",
          ref: v,
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
            onClick: e[0] || (e[0] = (t) => d(_)(`plans:${a.value.id}`))
          }, "Plan " + o(a.value.id) + ": " + o(a.value.title), 9, P),
          a.value.delegated ? (l(), i(k, { key: 0 }, [
            n("button", {
              type: "button",
              class: "plan-bar-delegation",
              "aria-expanded": s.value,
              "data-plan-bar-delegation": "",
              onClick: e[1] || (e[1] = w((t) => s.value = !s.value, ["stop"]))
            }, o(d(B)(a.value)), 9, W),
            s.value ? (l(), i("div", h, [
              e[2] || (e[2] = n("p", { class: "plan-bar-head" }, "Agents on this plan", -1)),
              (l(!0), i(k, null, x(a.value.agents, (t) => (l(), i("button", {
                key: `${t.id}:${t.task_id}`,
                type: "button",
                class: "plan-bar-agent",
                "data-plan-bar-agent": "",
                onClick: (V) => d(_)(`agents:${t.id}`)
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
}, M = /* @__PURE__ */ D(N, [["__scopeId", "data-v-f62e90bd"]]);
export {
  M as default
};
