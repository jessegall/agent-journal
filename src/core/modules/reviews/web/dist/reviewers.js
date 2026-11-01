/* @code-commandments-generated */
if (!document.getElementById("window-styles-3480777fb483")) { const style = document.createElement("style"); style.id = "window-styles-3480777fb483"; style.textContent = ".reviewer[data-v-77abe068]{height:100%;overflow-y:auto}.queue[data-v-77abe068]{margin:0;padding:8px 14px;color:var(--text-3);font-size:12px}.review[data-v-77abe068]{padding:12px 14px}.review-title[data-v-77abe068]{margin:0 0 8px;color:var(--text);font-size:12px;font-weight:600}.steps[data-v-77abe068]{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}.step[data-v-77abe068]{display:flex;align-items:baseline;gap:8px;color:var(--text-2);font-size:12px;line-height:1.5}.dot[data-v-77abe068]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--text-3)}.dot[data-outcome=passed][data-v-77abe068]{background:var(--green, #3aa676)}.dot[data-outcome=failed][data-v-77abe068]{background:var(--red, #d4574b)}.text[data-v-77abe068]{flex:1;white-space:pre-wrap}time[data-v-77abe068]{flex:none;color:var(--text-3);font-size:11px}\n"; document.head.appendChild(style); }
import { openBlock as t, createBlock as a, unref as e } from "vue";
import { useRows as s, AgentDropdownRows as l } from "@journal/window-kit";
const f = {
  __name: "ReviewerDropdown",
  setup(i) {
    const { rows: r, failure: o, loaded: n } = s("agent list --role reviewer", ["agent.*"]);
    return (u, w) => (t(), a(e(l), {
      rows: e(r),
      failure: e(o),
      loaded: e(n),
      none: "No reviewers have been sent from here"
    }, null, 8, ["rows", "failure", "loaded"]));
  }
};
export {
  f as default
};
