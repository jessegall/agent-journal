/* @code-commandments-generated */
if (!document.getElementById("window-styles-9e1a38a3c551")) { const style = document.createElement("style"); style.id = "window-styles-9e1a38a3c551"; style.textContent = ".open-questions-icon[data-v-bb9f2ba6]{flex:none;color:var(--text-3)}.open-questions-text[data-v-bb9f2ba6]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.open-questions-space[data-v-bb9f2ba6]{flex:1}.question[data-v-221368c1]{display:flex;flex:1;flex-direction:column;gap:8px;width:100%;max-width:640px;margin-bottom:10px;padding:14px 16px 16px;border:1px solid var(--border-2);border-radius:12px;background:var(--raised);overflow-wrap:anywhere}.question-head[data-v-221368c1]{display:flex;align-items:baseline;justify-content:space-between;gap:12px}.question-time[data-v-221368c1]{flex:none;color:var(--text-3);font-size:11.5px}.question-label[data-v-221368c1]{margin:0;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.question-open[data-v-221368c1]{padding:0;border:0;background:none;color:var(--text);font:inherit;font-size:14.5px;font-weight:600;line-height:1.4;text-align:left;cursor:pointer}.question-options[data-v-221368c1]{display:flex;flex-direction:column;gap:6px}.question-option[data-v-221368c1]{display:flex;flex-direction:column;overflow:hidden;padding:9px 12px;border:1px solid var(--border-2);border-radius:8px;background:var(--bg);color:var(--text);font:inherit;font-size:13px;text-align:left;cursor:pointer;transition:transform .12s ease,border-color .2s ease}.question-option[data-v-221368c1]:hover{border-color:var(--accent)}.question-option[data-v-221368c1]:active{transform:scale(.98)}.question-option.recommended[data-v-221368c1]{border-color:color-mix(in srgb,var(--accent) 40%,var(--border-2))}.question-tag[data-v-221368c1]{margin:-9px -12px 8px;padding:4px 12px;background:color-mix(in srgb,var(--accent) 16%,transparent);color:var(--accent-text);font-size:11px}.question-closed[data-v-221368c1]{margin:0;color:var(--text-3);font-size:12.5px}.question-failure[data-v-221368c1]{margin:0;color:var(--danger);font-size:12.5px}.question-dock[data-v-3f6f88a1]{display:flex;gap:8px;font-size:12px;line-height:1.45}.question-dock-state[data-v-3f6f88a1]{color:var(--text-4)}.waiting-heading[data-v-f7cafce3]{margin:0 8px 6px;font-size:12px;font-weight:600;color:var(--text-2)}.label[data-v-f7cafce3]{flex:1}.detail[data-v-f7cafce3]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as s, openBlock as r, createBlock as a, unref as i, withCtx as c, createCommentVNode as l } from "vue";
import { useWindow as d, WindowRoom as m } from "@journal/window-kit";
import { Q as p } from "./QuestionCard-C_m75N77.js";
const v = {
  __name: "QuestionMarkCard",
  setup(f) {
    const o = d(), u = o.option("row"), e = s(null);
    async function t() {
      const n = await o.read(`question show ${u.value.target_id}`);
      n.ok && (e.value = n.value);
    }
    return o.follow(["question.*"], t), t(), (n, w) => (r(), a(i(m), { padding: "14px 16px" }, {
      default: c(() => [
        e.value ? (r(), a(p, {
          key: 0,
          row: e.value,
          onChanged: t
        }, null, 8, ["row"])) : l("", !0)
      ]),
      _: 1
    }));
  }
};
export {
  v as default
};
