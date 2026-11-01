/* @code-commandments-generated */
if (!document.getElementById("window-styles-749bed1436ea")) { const style = document.createElement("style"); style.id = "window-styles-749bed1436ea"; style.textContent = ".main[data-v-9c0bceef]{flex:1}.note[data-v-9c0bceef]{color:var(--text-3);font-size:12px}.main[data-v-f4d9e119]{flex:1}.note[data-v-f4d9e119]{color:var(--text-3);font-size:12px}.terminal[data-v-4276f3c8]{display:flex;flex-direction:column;height:100%;min-height:0;background:var(--code-bg)}.terminal-body[data-v-4276f3c8]{flex:1;min-height:0;margin:0;padding:8px 12px;overflow:auto;color:var(--text-1);font-family:var(--font-mono, ui-monospace, monospace);font-size:12px;line-height:1.45;white-space:pre-wrap;word-break:break-word}.terminal-failure[data-v-4276f3c8]{padding:8px 12px;color:var(--text-3)}.agentset[data-v-7c96a530]{position:relative;display:flex;align-items:center;gap:10px;padding:3px 4px 3px 8px;border:1px solid var(--border-2);border-radius:8px}.agentset-settings[data-v-7c96a530]{display:inline-flex;align-items:center;padding:3px 5px;border:0;border-radius:5px;background:none;color:var(--text-2);cursor:pointer}.agentset-settings[data-v-7c96a530]:hover,.agentset-settings[aria-expanded=true][data-v-7c96a530]{background:var(--hover);color:var(--text)}.agentset-menu[data-v-7c96a530]{position:absolute;top:calc(100% + 8px);right:0;z-index:40;display:flex;flex-direction:column;gap:10px;width:260px;padding:12px;border:1px solid var(--border-2);border-radius:10px;background:var(--raised);box-shadow:0 12px 32px #00000073}.agentset-row[data-v-7c96a530]{display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--text-2);font-size:12.5px}.agentset-number[data-v-7c96a530]{width:56px;padding:3px 6px;border:1px solid var(--border-2);border-radius:5px;background:var(--bg);color:var(--text);font:inherit}.agentset-failure[data-v-7c96a530]{margin:0;color:var(--danger);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as o, onUnmounted as D, openBlock as p, createElementBlock as f, createVNode as c, unref as d, createElementVNode as s, withModifiers as I, toDisplayString as N, createCommentVNode as E } from "vue";
import { useWindow as T, useOutside as j, Switch as $, Segmented as L, Icon as V } from "@journal/window-kit";
import { _ as P } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const R = ["aria-expanded"], U = {
  key: 0,
  class: "agentset-menu",
  role: "dialog",
  "aria-label": "Work mode settings",
  "data-work-menu": ""
}, z = { class: "agentset-row" }, H = { class: "agentset-row" }, K = ["value"], q = {
  key: 0,
  class: "agentset-failure",
  role: "alert"
}, O = "journal.suites.coding.auto-mode", S = "journal.suites.coding.workers.builder-dispatches-workers", x = "journal.suites.coding.workers.worker-limit", F = {
  __name: "WorkMode",
  setup(G) {
    const v = [
      { key: "coding.builder", label: "Builder", tip: { title: "Builder", line: "The agent builds it itself, and sends workers when a job is better done beside it." } },
      { key: "coding.orchestrator", label: "Orchestrator", tip: { title: "Orchestrator", line: "The agent plans, hands the work to workers, then reviews and merges it; it writes code itself only where no worker can." } }
    ], n = T(), u = o(v[0].key), r = o(!0), i = o(!0), m = o(2), a = o(!1), h = o(null);
    j(h, () => a.value = !1);
    const w = o(""), g = async (t) => {
      var l;
      const e = await n.read(`setting show ${t} --environment ${n.environment}`);
      return e.ok ? (l = e.value) == null ? void 0 : l.value : void 0;
    };
    async function M() {
      const t = await n.read(`suite current ${n.environment}`), e = t.ok ? v.find((l) => {
        var b;
        return String(((b = t.value) == null ? void 0 : b.drivers) ?? "").includes(l.key);
      }) : null;
      e && (u.value = e.key), r.value = await g(O) !== !1, i.value = await g(S) !== !1, m.value = Number(await g(x) ?? 2);
    }
    async function _(t) {
      const e = await n.run(t);
      return w.value = e.ok ? "" : e.error, e.ok;
    }
    async function W(t) {
      t !== u.value && await _(`driver choose ${t} --environment ${n.environment}`) && (u.value = t);
    }
    const k = (t, e) => _(`setting set ${t} ${e} --environment ${n.environment}`);
    async function C() {
      await k(O, !r.value) && (r.value = !r.value);
    }
    async function A() {
      await k(S, !i.value) && (i.value = !i.value);
    }
    async function B(t) {
      const e = Number(t.target.value);
      await k(x, e) && (m.value = e);
    }
    const y = (t) => t.key === "Escape" && (a.value = !1);
    return window.addEventListener("keydown", y), D(() => window.removeEventListener("keydown", y)), M(), (t, e) => (p(), f("span", {
      ref_key: "root",
      ref: h,
      class: "agentset",
      "data-work-mode": ""
    }, [
      c(d($), {
        on: r.value,
        word: "Auto",
        title: "Auto mode: the agent is given the next open task when it stops or leaves its task",
        "data-auto-toggle": "",
        onChange: C
      }, null, 8, ["on"]),
      c(d(L), {
        class: "agentset-mode",
        options: v,
        value: u.value,
        onPick: W
      }, null, 8, ["value"]),
      s("button", {
        type: "button",
        class: "agentset-settings",
        "data-work-settings": "",
        title: "Work mode settings",
        "aria-expanded": a.value,
        onClick: e[0] || (e[0] = I((l) => a.value = !a.value, ["stop"]))
      }, [
        c(d(V), {
          name: "caret",
          size: 12
        })
      ], 8, R),
      a.value ? (p(), f("div", U, [
        s("label", z, [
          e[1] || (e[1] = s("span", null, "Builder sends workers", -1)),
          c(d($), {
            on: i.value,
            onChange: A
          }, null, 8, ["on"])
        ]),
        s("label", H, [
          e[2] || (e[2] = s("span", null, "Worker limit", -1)),
          s("input", {
            class: "agentset-number",
            type: "number",
            min: "0",
            value: m.value,
            onChange: B
          }, null, 40, K)
        ]),
        w.value ? (p(), f("p", q, N(w.value), 1)) : E("", !0)
      ])) : E("", !0)
    ], 512));
  }
}, Y = /* @__PURE__ */ P(F, [["__scopeId", "data-v-7c96a530"]]);
export {
  Y as default
};
