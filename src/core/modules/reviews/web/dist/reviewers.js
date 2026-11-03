/* @code-commandments-generated */
if (!document.getElementById("window-styles-e1e7e90705ce")) { const style = document.createElement("style"); style.id = "window-styles-e1e7e90705ce"; style.textContent = ".reviewer[data-v-83683a1d]{height:100%;overflow-y:auto}.queue[data-v-83683a1d]{margin:0;padding:8px 14px;color:var(--text-3);font-size:12px}.review[data-v-83683a1d]{padding:12px 14px}.review-title[data-v-83683a1d]{margin:0 0 8px;color:var(--text);font-size:12px;font-weight:600}.steps[data-v-83683a1d]{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}.step[data-v-83683a1d]{display:flex;align-items:baseline;gap:8px;color:var(--text-2);font-size:12px;line-height:1.5}.dot[data-v-83683a1d]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--text-3)}.dot[data-outcome=passed][data-v-83683a1d]{background:var(--green, #3aa676)}.dot[data-outcome=failed][data-v-83683a1d]{background:var(--red, #d4574b)}.text[data-v-83683a1d]{flex:1;white-space:pre-wrap}time[data-v-83683a1d]{flex:none;color:var(--text-3);font-size:11px}\n"; document.head.appendChild(style); }
import { openBlock as t, createBlock as a, unref as e } from "vue";
import { useRows as s, AgentRowList as l } from "@journal/window-kit";
const d = {
  __name: "ReviewerDropdown",
  setup(i) {
    const { rows: r, failure: o, loaded: n } = s("agent list --role reviewer", ["agent.*"]);
    return (u, c) => (t(), a(e(l), {
      rows: e(r),
      failure: e(o),
      loaded: e(n),
      none: "No reviewers have been sent from here"
    }, null, 8, ["rows", "failure", "loaded"]));
  }
};
export {
  d as default
};
