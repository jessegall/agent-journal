/* @code-commandments-generated */
if (!document.getElementById("window-styles-d2eb491bb9c6")) { const style = document.createElement("style"); style.id = "window-styles-d2eb491bb9c6"; style.textContent = ".filter[data-v-89de1475]{box-sizing:border-box;width:100%;max-width:320px;margin-bottom:8px;padding:5px 10px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text);font:inherit;font-size:12.5px}.main[data-v-89de1475]{flex:1}.note[data-v-89de1475]{color:var(--text-3);font-size:12px}.main[data-v-f4d9e119]{flex:1}.note[data-v-f4d9e119]{color:var(--text-3);font-size:12px}.files[data-v-9c5bab02]{display:flex;flex-direction:column;height:100%;min-height:0}.files-bar[data-v-9c5bab02]{display:flex;flex-wrap:wrap;gap:4px;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border)}.files-search[data-v-9c5bab02]{flex:0 1 280px;min-width:160px;margin-right:6px}.files-body[data-v-9c5bab02]{display:grid;flex:1;grid-template-columns:minmax(220px,1fr) 3fr;min-height:0}.files-list[data-v-9c5bab02]{overflow-y:auto;padding:6px;border-right:1px solid var(--border)}.files-row[data-v-9c5bab02]{display:flex;gap:8px;align-items:center;width:100%;padding:4px 8px;border:0;border-radius:6px;background:none;color:inherit;font:inherit;font-size:13px;text-align:left;cursor:pointer}.files-row[data-v-9c5bab02]:hover,.files-row.on[data-v-9c5bab02]{background:var(--hover)}.files-name[data-v-9c5bab02]{overflow:hidden;min-width:0;text-overflow:ellipsis;white-space:nowrap}.files-reader[data-v-9c5bab02]{overflow:auto;padding:14px 18px}.files-path[data-v-9c5bab02]{margin:0 0 10px;font-size:14px;font-weight:600}.files-text[data-v-9c5bab02]{margin:0;font-family:var(--mono, monospace);font-size:12.5px;line-height:1.5}.files-line[data-v-9c5bab02]{display:block;white-space:pre}.files-number[data-v-9c5bab02]{display:inline-block;width:44px;margin-right:12px;color:var(--text-3);text-align:right;-webkit-user-select:none;user-select:none}.files-note[data-v-9c5bab02]{margin:6px 8px;color:var(--text-2);font-size:13px}.terminal[data-v-d3dc8782]{display:flex;flex-direction:column;height:100%;min-height:0;background:var(--code-bg)}.terminal-body[data-v-d3dc8782]{flex:1;min-height:0;margin:0;padding:8px 12px;overflow:auto;color:var(--text-1);font-family:var(--font-mono, ui-monospace, monospace);font-size:12px;line-height:1.45;white-space:pre-wrap;word-break:break-word}.terminal-run[data-v-d3dc8782]{display:flex;align-items:center;gap:8px;padding:6px 12px;border-top:1px solid var(--border);font-family:var(--font-mono, ui-monospace, monospace);font-size:12px}.terminal-prompt[data-v-d3dc8782]{color:var(--text-3)}.terminal-input[data-v-d3dc8782]{flex:1;min-width:0;border:0;outline:0;background:transparent;color:inherit;font:inherit}.terminal-failure[data-v-d3dc8782]{padding:8px 12px;color:var(--text-3)}.agentset[data-v-6aa7e24f]{position:relative;display:flex;align-items:center;gap:10px;padding:3px 4px 3px 8px;border:1px solid var(--border-2);border-radius:8px}.agentset-settings[data-v-6aa7e24f]{display:inline-flex;align-items:center;padding:3px 5px;border:0;border-radius:5px;background:none;color:var(--text-2);cursor:pointer}.agentset-settings[data-v-6aa7e24f]:hover,.agentset-settings[aria-expanded=true][data-v-6aa7e24f]{background:var(--hover);color:var(--text)}.agentset-menu[data-v-6aa7e24f]{position:absolute;top:calc(100% + 8px);right:0;z-index:40;display:flex;flex-direction:column;gap:10px;width:260px;padding:12px;border:1px solid var(--border-2);border-radius:10px;background:var(--raised);box-shadow:0 12px 32px #00000073}.agentset-row[data-v-6aa7e24f]{display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--text-2);font-size:12.5px}.agentset-number[data-v-6aa7e24f]{width:56px;padding:3px 6px;border:1px solid var(--border-2);border-radius:5px;background:var(--bg);color:var(--text);font:inherit}.agentset-failure[data-v-6aa7e24f]{margin:0;color:var(--danger);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as s, onUnmounted as T, openBlock as l, createElementBlock as a, toDisplayString as d, createBlock as I, unref as w, Fragment as y, renderList as N, createElementVNode as m, createTextVNode as E, withModifiers as g, withDirectives as L, withKeys as b, vModelText as V, createCommentVNode as h, nextTick as B } from "vue";
import { useWindow as C, EmptyState as D } from "@journal/window-kit";
import { _ as H } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const K = {
  key: 0,
  class: "terminal-failure"
}, M = { class: "terminal-line" }, O = ["onKeydown"], $ = {
  key: 0,
  class: "terminal-failure",
  role: "alert",
  "data-terminal-refusal": ""
}, F = 1e3, U = {
  __name: "Terminal",
  setup(W) {
    const r = C(), o = s([]), i = s(""), n = s(null), u = s(""), v = s(""), _ = s(null);
    let k = 0;
    async function f() {
      const t = u.value;
      if (!t.trim()) return;
      u.value = "";
      const e = await r.run(["agent", "type", String(r.agent), t]);
      v.value = e.ok ? "" : e.error, e.ok ? p() : u.value = t;
    }
    function x(t) {
      var e;
      String(window.getSelection()) || t.target.closest("button, a, input, textarea") || (e = _.value) == null || e.focus();
    }
    async function p() {
      const t = await r.read(`agent terminal ${r.agent} --after ${k}`);
      if (!t.ok) {
        i.value = t.error;
        return;
      }
      if (i.value = "", !t.value.rows.length) return;
      const e = !n.value || n.value.scrollTop + n.value.clientHeight >= n.value.scrollHeight - 4;
      o.value = [...o.value, ...t.value.rows].slice(-2e3), k = o.value[o.value.length - 1].number, await B(), e && n.value && (n.value.scrollTop = n.value.scrollHeight);
    }
    const S = setInterval(() => {
      r.visible.value && p();
    }, F);
    return T(() => clearInterval(S)), p(), (t, e) => (l(), a("section", {
      class: "terminal",
      onClick: x
    }, [
      i.value ? (l(), a("p", K, d(i.value), 1)) : o.value.length ? (l(), a("pre", {
        key: 2,
        ref_key: "body",
        ref: n,
        class: "terminal-body"
      }, [
        (l(!0), a(y, null, N(o.value, (c) => (l(), a(y, {
          key: c.number
        }, [
          m("span", M, d(c.text), 1),
          e[1] || (e[1] = E(`
`, -1))
        ], 64))), 128))
      ], 512)) : (l(), I(w(D), {
        key: 1,
        title: "No terminal output from this agent yet"
      })),
      w(r).agent ? (l(), a(y, { key: 3 }, [
        m("form", {
          class: "terminal-run",
          "data-terminal-run": "",
          onSubmit: g(f, ["prevent"])
        }, [
          e[2] || (e[2] = m("span", { class: "terminal-prompt" }, "$", -1)),
          L(m("input", {
            ref_key: "input",
            ref: _,
            "onUpdate:modelValue": e[0] || (e[0] = (c) => u.value = c),
            class: "terminal-input",
            "aria-label": "A command to run in the agent's terminal",
            autocomplete: "off",
            onKeydown: [
              b(g(f, ["ctrl", "prevent"]), ["enter"]),
              b(g(f, ["meta", "prevent"]), ["enter"])
            ]
          }, null, 40, O), [
            [V, u.value]
          ])
        ], 32),
        v.value ? (l(), a("p", $, d(v.value), 1)) : h("", !0)
      ], 64)) : h("", !0)
    ]));
  }
}, z = /* @__PURE__ */ H(U, [["__scopeId", "data-v-d3dc8782"]]);
export {
  z as default
};
