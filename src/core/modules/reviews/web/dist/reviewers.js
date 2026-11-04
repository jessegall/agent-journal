/* @code-commandments-generated */
if (!document.getElementById("window-styles-9528e1be110c")) { const style = document.createElement("style"); style.id = "window-styles-9528e1be110c"; style.textContent = ".reviewer[data-v-74156f2e]{height:100%;overflow-y:auto}.queue[data-v-74156f2e]{margin:0;padding:8px 14px;color:var(--text-3);font-size:12px}.review[data-v-74156f2e]{padding:12px 14px}.review-title[data-v-74156f2e]{margin:0 0 8px;color:var(--text);font-size:12px;font-weight:600}.steps[data-v-74156f2e]{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}.step[data-v-74156f2e]{display:flex;align-items:baseline;gap:8px;color:var(--text-2);font-size:12px;line-height:1.5}.dot[data-v-74156f2e]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--text-3)}.dot[data-outcome=passed][data-v-74156f2e]{background:var(--green, #3aa676)}.dot[data-outcome=failed][data-v-74156f2e]{background:var(--red, #d4574b)}.text[data-v-74156f2e]{flex:1;white-space:pre-wrap}time[data-v-74156f2e]{flex:none;color:var(--text-3);font-size:11px}\n"; document.head.appendChild(style); }
import { openBlock as n, createBlock as a, unref as e, withCtx as s, createVNode as i } from "vue";
import { useRows as l, WindowRoom as d, AgentRowList as p } from "@journal/window-kit";
const m = {
  __name: "ReviewerDropdown",
  setup(u) {
    const { rows: o, failure: r, loaded: t } = l("agent list --role reviewer", ["agent.*"]);
    return (w, c) => (n(), a(e(d), { padding: "14px 16px" }, {
      default: s(() => [
        i(e(p), {
          rows: e(o),
          failure: e(r),
          loaded: e(t),
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
