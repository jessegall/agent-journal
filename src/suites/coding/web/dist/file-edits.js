/* @code-commandments-generated */
if (!document.getElementById("window-styles-c43c1a0d5e82")) { const style = document.createElement("style"); style.id = "window-styles-c43c1a0d5e82"; style.textContent = ".main[data-v-67afafdd]{flex:1}.note[data-v-67afafdd]{color:var(--text-3);font-size:12px}.main[data-v-e7401c03]{flex:1}.note[data-v-e7401c03]{color:var(--text-3);font-size:12px}.terminal[data-v-4276f3c8]{display:flex;flex-direction:column;height:100%;min-height:0;background:var(--code-bg)}.terminal-body[data-v-4276f3c8]{flex:1;min-height:0;margin:0;padding:8px 12px;overflow:auto;color:var(--text-1);font-family:var(--font-mono, ui-monospace, monospace);font-size:12px;line-height:1.45;white-space:pre-wrap;word-break:break-word}.terminal-failure[data-v-4276f3c8]{padding:8px 12px;color:var(--text-3)}.agentset[data-v-1c636f36]{position:relative;display:flex;align-items:center;gap:10px;padding:3px 4px 3px 8px;border:1px solid var(--border-2);border-radius:8px}.agentset-settings[data-v-1c636f36]{display:inline-flex;align-items:center;padding:3px 5px;border:0;border-radius:5px;background:none;color:var(--text-2);cursor:pointer}.agentset-settings[data-v-1c636f36]:hover,.agentset-settings[aria-expanded=true][data-v-1c636f36]{background:var(--hover);color:var(--text)}.agentset-menu[data-v-1c636f36]{position:absolute;top:calc(100% + 8px);right:0;z-index:40;display:flex;flex-direction:column;gap:10px;width:260px;padding:12px;border:1px solid var(--border-2);border-radius:10px;background:var(--raised);box-shadow:0 12px 32px #00000073}.agentset-row[data-v-1c636f36]{display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--text-2);font-size:12.5px}.agentset-number[data-v-1c636f36]{width:56px;padding:3px 6px;border:1px solid var(--border-2);border-radius:5px;background:var(--bg);color:var(--text);font:inherit}.agentset-failure[data-v-1c636f36]{margin:0;color:var(--danger);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as n, createBlock as _, unref as t, withCtx as c, createElementVNode as s, toDisplayString as o } from "vue";
import { useRows as r, RowList as l } from "@journal/window-kit";
import { _ as p } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const f = { class: "main" }, m = { class: "note" }, u = { class: "note" }, h = { class: "note" }, x = {
  __name: "FileEdits",
  setup(g) {
    const { rows: a, failure: d, loaded: i } = r("file-edit list", ["file_edit.create"]);
    return (w, y) => (n(), _(t(l), {
      rows: t(a),
      failure: t(d),
      loaded: t(i),
      empty: "No edits yet"
    }, {
      default: c(({ row: e }) => [
        s("span", f, o(e.path), 1),
        s("span", m, "+" + o(e.added), 1),
        s("span", u, "-" + o(e.removed), 1),
        s("span", h, "agent " + o(e.agent_id), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, B = /* @__PURE__ */ p(x, [["__scopeId", "data-v-67afafdd"]]);
export {
  B as default
};
