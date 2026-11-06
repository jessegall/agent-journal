/* @code-commandments-generated */
if (!document.getElementById("window-styles-ebfadf64d212")) { const style = document.createElement("style"); style.id = "window-styles-ebfadf64d212"; style.textContent = ".reviewer[data-v-be2043ac]{height:100%;overflow-y:auto}.queue[data-v-be2043ac]{margin:0;padding:8px 14px;color:var(--text-3);font-size:12px}.review[data-v-be2043ac]{padding:12px 14px}.review-title[data-v-be2043ac]{margin:0 0 8px;color:var(--text);font-size:12px;font-weight:600}.steps[data-v-be2043ac]{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}.step[data-v-be2043ac]{display:flex;align-items:baseline;gap:8px;color:var(--text-2);font-size:12px;line-height:1.5}.dot[data-v-be2043ac]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--text-3)}.dot[data-outcome=passed][data-v-be2043ac]{background:var(--green, #3aa676)}.dot[data-outcome=failed][data-v-be2043ac]{background:var(--red, #d4574b)}.text[data-v-be2043ac]{flex:1;white-space:pre-wrap}time[data-v-be2043ac]{flex:none;color:var(--text-3);font-size:11px}.list[data-v-350240bf]{display:flex;flex-direction:column;gap:10px;margin:0;padding:0;list-style:none}.head[data-v-350240bf]{display:flex;gap:8px;align-items:baseline}.state[data-v-350240bf]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as t, createBlock as a, unref as e, withCtx as s, createVNode as d } from "vue";
import { useWindow as i, WindowRoom as p, AgentRowList as l } from "@journal/window-kit";
const m = {
  __name: "ReviewerDropdown",
  setup(u) {
    const { rows: o, failure: r, loaded: n } = i().props.reviewers;
    return (w, c) => (t(), a(e(p), { padding: "14px 16px" }, {
      default: s(() => [
        d(e(l), {
          rows: e(o),
          failure: e(r),
          loaded: e(n),
          none: "No reviewers have been sent from here"
        }, null, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
};
export {
  m as default
};
