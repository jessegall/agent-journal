/* @code-commandments-generated */
if (!document.getElementById("window-styles-9ad208c6223f")) { const style = document.createElement("style"); style.id = "window-styles-9ad208c6223f"; style.textContent = ".reviewer[data-v-193a4f94]{height:100%;overflow-y:auto}.queue[data-v-193a4f94]{margin:0;padding:8px 14px;color:var(--text-3);font-size:12px}.review[data-v-193a4f94]{padding:12px 14px}.review-title[data-v-193a4f94]{margin:0 0 8px;color:var(--text);font-size:12px;font-weight:600}.steps[data-v-193a4f94]{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}.step[data-v-193a4f94]{display:flex;align-items:baseline;gap:8px;color:var(--text-2);font-size:12px;line-height:1.5}.dot[data-v-193a4f94]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--text-3)}.dot[data-outcome=passed][data-v-193a4f94]{background:var(--green, #3aa676)}.dot[data-outcome=failed][data-v-193a4f94]{background:var(--red, #d4574b)}.text[data-v-193a4f94]{flex:1;white-space:pre-wrap}time[data-v-193a4f94]{flex:none;color:var(--text-3);font-size:11px}\n"; document.head.appendChild(style); }
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
