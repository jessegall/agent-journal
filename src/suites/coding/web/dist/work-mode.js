/* @code-commandments-generated */
if (!document.getElementById("window-styles-c43c1a0d5e82")) { const style = document.createElement("style"); style.id = "window-styles-c43c1a0d5e82"; style.textContent = ".main[data-v-67afafdd]{flex:1}.note[data-v-67afafdd]{color:var(--text-3);font-size:12px}.main[data-v-e7401c03]{flex:1}.note[data-v-e7401c03]{color:var(--text-3);font-size:12px}.terminal[data-v-4276f3c8]{display:flex;flex-direction:column;height:100%;min-height:0;background:var(--code-bg)}.terminal-body[data-v-4276f3c8]{flex:1;min-height:0;margin:0;padding:8px 12px;overflow:auto;color:var(--text-1);font-family:var(--font-mono, ui-monospace, monospace);font-size:12px;line-height:1.45;white-space:pre-wrap;word-break:break-word}.terminal-failure[data-v-4276f3c8]{padding:8px 12px;color:var(--text-3)}.agentset[data-v-1c636f36]{position:relative;display:flex;align-items:center;gap:10px;padding:3px 4px 3px 8px;border:1px solid var(--border-2);border-radius:8px}.agentset-settings[data-v-1c636f36]{display:inline-flex;align-items:center;padding:3px 5px;border:0;border-radius:5px;background:none;color:var(--text-2);cursor:pointer}.agentset-settings[data-v-1c636f36]:hover,.agentset-settings[aria-expanded=true][data-v-1c636f36]{background:var(--hover);color:var(--text)}.agentset-menu[data-v-1c636f36]{position:absolute;top:calc(100% + 8px);right:0;z-index:40;display:flex;flex-direction:column;gap:10px;width:260px;padding:12px;border:1px solid var(--border-2);border-radius:10px;background:var(--raised);box-shadow:0 12px 32px #00000073}.agentset-row[data-v-1c636f36]{display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--text-2);font-size:12.5px}.agentset-number[data-v-1c636f36]{width:56px;padding:3px 6px;border:1px solid var(--border-2);border-radius:5px;background:var(--bg);color:var(--text);font:inherit}.agentset-failure[data-v-1c636f36]{margin:0;color:var(--danger);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as o, onUnmounted as B, openBlock as p, createElementBlock as f, createVNode as c, unref as d, createElementVNode as a, withModifiers as D, toDisplayString as I, createCommentVNode as b } from "vue";
import { useWindow as N, Switch as E, Segmented as T, Icon as j } from "@journal/window-kit";
import { _ as L } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const V = {
  class: "agentset",
  "data-work-mode": ""
}, P = ["aria-expanded"], R = {
  key: 0,
  class: "agentset-menu",
  role: "dialog",
  "aria-label": "Work mode settings",
  "data-work-menu": ""
}, U = { class: "agentset-row" }, z = { class: "agentset-row" }, H = ["value"], K = {
  key: 0,
  class: "agentset-failure",
  role: "alert"
}, $ = "journal.suites.coding.auto-mode", S = "journal.suites.coding.workers.builder-dispatches-workers", x = "journal.suites.coding.workers.worker-limit", q = {
  __name: "WorkMode",
  setup(F) {
    const v = [
      { key: "coding.builder", label: "Builder", tip: { title: "Builder", line: "The agent builds it itself, and sends workers when a job is better done beside it." } },
      { key: "coding.orchestrator", label: "Orchestrator", tip: { title: "Orchestrator", line: "The agent plans, hands the work to workers, then reviews and merges it; it writes code itself only where no worker can." } }
    ], n = N(), u = o(v[0].key), s = o(!0), i = o(!0), m = o(2), r = o(!1), w = o(""), g = async (t) => {
      var l;
      const e = await n.read(`setting show ${t} --environment ${n.environment}`);
      return e.ok ? (l = e.value) == null ? void 0 : l.value : void 0;
    };
    async function M() {
      const t = await n.read(`suite current ${n.environment}`), e = t.ok ? v.find((l) => {
        var y;
        return String(((y = t.value) == null ? void 0 : y.drivers) ?? "").includes(l.key);
      }) : null;
      e && (u.value = e.key), s.value = await g($) !== !1, i.value = await g(S) !== !1, m.value = Number(await g(x) ?? 2);
    }
    async function h(t) {
      const e = await n.run(t);
      return w.value = e.ok ? "" : e.error, e.ok;
    }
    async function O(t) {
      t !== u.value && await h(`driver choose ${t} --environment ${n.environment}`) && (u.value = t);
    }
    const k = (t, e) => h(`setting set ${t} ${e} --environment ${n.environment}`);
    async function W() {
      await k($, !s.value) && (s.value = !s.value);
    }
    async function C() {
      await k(S, !i.value) && (i.value = !i.value);
    }
    async function A(t) {
      const e = Number(t.target.value);
      await k(x, e) && (m.value = e);
    }
    const _ = (t) => t.key === "Escape" && (r.value = !1);
    return window.addEventListener("keydown", _), B(() => window.removeEventListener("keydown", _)), M(), (t, e) => (p(), f("span", V, [
      c(d(E), {
        on: s.value,
        word: "Auto",
        title: "Auto mode: the agent is given the next open task when it stops or leaves its task",
        "data-auto-toggle": "",
        onChange: W
      }, null, 8, ["on"]),
      c(d(T), {
        class: "agentset-mode",
        options: v,
        value: u.value,
        onPick: O
      }, null, 8, ["value"]),
      a("button", {
        type: "button",
        class: "agentset-settings",
        "data-work-settings": "",
        title: "Work mode settings",
        "aria-expanded": r.value,
        onClick: e[0] || (e[0] = D((l) => r.value = !r.value, ["stop"]))
      }, [
        c(d(j), {
          name: "caret",
          size: 12
        })
      ], 8, P),
      r.value ? (p(), f("div", R, [
        a("label", U, [
          e[1] || (e[1] = a("span", null, "Builder sends workers", -1)),
          c(d(E), {
            on: i.value,
            onChange: C
          }, null, 8, ["on"])
        ]),
        a("label", z, [
          e[2] || (e[2] = a("span", null, "Worker limit", -1)),
          a("input", {
            class: "agentset-number",
            type: "number",
            min: "0",
            value: m.value,
            onChange: A
          }, null, 40, H)
        ]),
        w.value ? (p(), f("p", K, I(w.value), 1)) : b("", !0)
      ])) : b("", !0)
    ]));
  }
}, X = /* @__PURE__ */ L(q, [["__scopeId", "data-v-1c636f36"]]);
export {
  X as default
};
