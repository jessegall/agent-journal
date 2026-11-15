if (!document.getElementById("window-styles-be9efbc3016a")) { const style = document.createElement("style"); style.id = "window-styles-be9efbc3016a"; style.textContent = ".reviewer[data-v-de9b04bb]{height:100%;overflow-y:auto}.queue[data-v-de9b04bb]{margin:0;padding:8px 14px;color:var(--text-3);font-size:12px}.review[data-v-de9b04bb]{padding:12px 14px}.review-title[data-v-de9b04bb]{margin:0 0 8px;color:var(--text);font-size:12px;font-weight:600}.steps[data-v-de9b04bb]{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}.step[data-v-de9b04bb]{display:flex;align-items:baseline;gap:8px;color:var(--text-2);font-size:12px;line-height:1.5}.dot[data-v-de9b04bb]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--text-3)}.dot[data-outcome=passed][data-v-de9b04bb]{background:var(--green, #3aa676)}.dot[data-outcome=failed][data-v-de9b04bb]{background:var(--red, #d4574b)}.text[data-v-de9b04bb]{flex:1;white-space:pre-wrap}time[data-v-de9b04bb]{flex:none;color:var(--text-3);font-size:11px}.list[data-v-9e759df0]{display:flex;flex-direction:column;gap:10px;margin:0;padding:0;list-style:none}.head[data-v-9e759df0]{display:flex;gap:8px;align-items:baseline}.state[data-v-9e759df0]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
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
