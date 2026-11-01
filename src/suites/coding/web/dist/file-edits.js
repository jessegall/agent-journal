/* @code-commandments-generated */
if (!document.getElementById("window-styles-b54c41aa4a71")) { const style = document.createElement("style"); style.id = "window-styles-b54c41aa4a71"; style.textContent = ".filter[data-v-89de1475]{box-sizing:border-box;width:100%;max-width:320px;margin-bottom:8px;padding:5px 10px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text);font:inherit;font-size:12.5px}.main[data-v-89de1475]{flex:1}.note[data-v-89de1475]{color:var(--text-3);font-size:12px}.main[data-v-f4d9e119]{flex:1}.note[data-v-f4d9e119]{color:var(--text-3);font-size:12px}.files[data-v-9c5bab02]{display:flex;flex-direction:column;height:100%;min-height:0}.files-bar[data-v-9c5bab02]{display:flex;flex-wrap:wrap;gap:4px;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border)}.files-search[data-v-9c5bab02]{flex:0 1 280px;min-width:160px;margin-right:6px}.files-body[data-v-9c5bab02]{display:grid;flex:1;grid-template-columns:minmax(220px,1fr) 3fr;min-height:0}.files-list[data-v-9c5bab02]{overflow-y:auto;padding:6px;border-right:1px solid var(--border)}.files-row[data-v-9c5bab02]{display:flex;gap:8px;align-items:center;width:100%;padding:4px 8px;border:0;border-radius:6px;background:none;color:inherit;font:inherit;font-size:13px;text-align:left;cursor:pointer}.files-row[data-v-9c5bab02]:hover,.files-row.on[data-v-9c5bab02]{background:var(--hover)}.files-name[data-v-9c5bab02]{overflow:hidden;min-width:0;text-overflow:ellipsis;white-space:nowrap}.files-reader[data-v-9c5bab02]{overflow:auto;padding:14px 18px}.files-path[data-v-9c5bab02]{margin:0 0 10px;font-size:14px;font-weight:600}.files-text[data-v-9c5bab02]{margin:0;font-family:var(--mono, monospace);font-size:12.5px;line-height:1.5}.files-line[data-v-9c5bab02]{display:block;white-space:pre}.files-number[data-v-9c5bab02]{display:inline-block;width:44px;margin-right:12px;color:var(--text-3);text-align:right;-webkit-user-select:none;user-select:none}.files-note[data-v-9c5bab02]{margin:6px 8px;color:var(--text-2);font-size:13px}.terminal[data-v-d3dc8782]{display:flex;flex-direction:column;height:100%;min-height:0;background:var(--code-bg)}.terminal-body[data-v-d3dc8782]{flex:1;min-height:0;margin:0;padding:8px 12px;overflow:auto;color:var(--text-1);font-family:var(--font-mono, ui-monospace, monospace);font-size:12px;line-height:1.45;white-space:pre-wrap;word-break:break-word}.terminal-run[data-v-d3dc8782]{display:flex;align-items:center;gap:8px;padding:6px 12px;border-top:1px solid var(--border);font-family:var(--font-mono, ui-monospace, monospace);font-size:12px}.terminal-prompt[data-v-d3dc8782]{color:var(--text-3)}.terminal-input[data-v-d3dc8782]{flex:1;min-width:0;border:0;outline:0;background:transparent;color:inherit;font:inherit}.terminal-failure[data-v-d3dc8782]{padding:8px 12px;color:var(--text-3)}.agentset[data-v-6136ed71]{position:relative;display:flex;align-items:center;gap:10px;padding:3px 4px 3px 8px;border:1px solid var(--border-2);border-radius:8px}.agentset-settings[data-v-6136ed71]{display:inline-flex;align-items:center;padding:3px 5px;border:0;border-radius:5px;background:none;color:var(--text-2);cursor:pointer}.agentset-settings[data-v-6136ed71]:hover,.agentset-settings[aria-expanded=true][data-v-6136ed71]{background:var(--hover);color:var(--text)}.agentset-menu[data-v-6136ed71]{position:absolute;top:calc(100% + 8px);right:0;z-index:40;display:flex;flex-direction:column;gap:10px;width:260px;padding:12px;border:1px solid var(--border-2);border-radius:10px;background:var(--raised);box-shadow:0 12px 32px #00000073}.agentset-row[data-v-6136ed71]{display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--text-2);font-size:12.5px}.agentset-number[data-v-6136ed71]{width:56px;padding:3px 6px;border:1px solid var(--border-2);border-radius:5px;background:var(--bg);color:var(--text);font:inherit}.agentset-failure[data-v-6136ed71]{margin:0;color:var(--danger);font-size:12px}.agentset-ask[data-v-6136ed71]{margin:0 0 8px;font-size:13px}.agentset-ask-buttons[data-v-6136ed71]{display:flex;justify-content:flex-end;gap:8px}\n"; document.head.appendChild(style); }
import { ref as p, computed as f, openBlock as m, createElementBlock as _, Fragment as v, withDirectives as h, createElementVNode as s, withKeys as w, vModelText as y, createVNode as x, unref as o, withCtx as F, toDisplayString as a } from "vue";
import { useRows as g, RowList as E } from "@journal/window-kit";
import { _ as N } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const C = { class: "main" }, L = { class: "note" }, V = { class: "note" }, k = { class: "note" }, B = {
  __name: "FileEdits",
  setup(D) {
    const { rows: r, failure: n, loaded: d, older: u } = g("file-edit list", ["file_edit.create"], { incremental: !0 }), t = p(""), c = f(() => {
      const i = t.value.trim().toLowerCase();
      return i ? r.value.filter((l) => l.path.toLowerCase().includes(i)) : r.value;
    });
    return (i, l) => (m(), _(v, null, [
      h(s("input", {
        "onUpdate:modelValue": l[0] || (l[0] = (e) => t.value = e),
        class: "filter",
        type: "search",
        placeholder: "Filter files",
        "aria-label": "Filter files",
        "data-edits-filter": "",
        onKeydown: l[1] || (l[1] = w((e) => t.value = "", ["esc"]))
      }, null, 544), [
        [y, t.value]
      ]),
      x(o(E), {
        rows: c.value,
        failure: o(n),
        loaded: o(d),
        older: t.value ? null : o(u),
        empty: t.value ? "No file matches" : "No edits yet"
      }, {
        default: F(({ row: e }) => [
          s("span", C, a(e.path), 1),
          s("span", L, "+" + a(e.added), 1),
          s("span", V, "-" + a(e.removed), 1),
          s("span", k, "agent " + a(e.agent_id), 1)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "older", "empty"])
    ], 64));
  }
}, I = /* @__PURE__ */ N(B, [["__scopeId", "data-v-89de1475"]]);
export {
  I as default
};
