/* @code-commandments-generated */
if (!document.getElementById("window-styles-19e6ee65844f")) { const style = document.createElement("style"); style.id = "window-styles-19e6ee65844f"; style.textContent = ".filter[data-v-89de1475]{box-sizing:border-box;width:100%;max-width:320px;margin-bottom:8px;padding:5px 10px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text);font:inherit;font-size:12.5px}.main[data-v-89de1475]{flex:1}.note[data-v-89de1475]{color:var(--text-3);font-size:12px}.main[data-v-f4d9e119]{flex:1}.note[data-v-f4d9e119]{color:var(--text-3);font-size:12px}.terminal[data-v-4276f3c8]{display:flex;flex-direction:column;height:100%;min-height:0;background:var(--code-bg)}.terminal-body[data-v-4276f3c8]{flex:1;min-height:0;margin:0;padding:8px 12px;overflow:auto;color:var(--text-1);font-family:var(--font-mono, ui-monospace, monospace);font-size:12px;line-height:1.45;white-space:pre-wrap;word-break:break-word}.terminal-failure[data-v-4276f3c8]{padding:8px 12px;color:var(--text-3)}.agentset[data-v-6aa7e24f]{position:relative;display:flex;align-items:center;gap:10px;padding:3px 4px 3px 8px;border:1px solid var(--border-2);border-radius:8px}.agentset-settings[data-v-6aa7e24f]{display:inline-flex;align-items:center;padding:3px 5px;border:0;border-radius:5px;background:none;color:var(--text-2);cursor:pointer}.agentset-settings[data-v-6aa7e24f]:hover,.agentset-settings[aria-expanded=true][data-v-6aa7e24f]{background:var(--hover);color:var(--text)}.agentset-menu[data-v-6aa7e24f]{position:absolute;top:calc(100% + 8px);right:0;z-index:40;display:flex;flex-direction:column;gap:10px;width:260px;padding:12px;border:1px solid var(--border-2);border-radius:10px;background:var(--raised);box-shadow:0 12px 32px #00000073}.agentset-row[data-v-6aa7e24f]{display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--text-2);font-size:12.5px}.agentset-number[data-v-6aa7e24f]{width:56px;padding:3px 6px;border:1px solid var(--border-2);border-radius:5px;background:var(--bg);color:var(--text);font:inherit}.agentset-failure[data-v-6aa7e24f]{margin:0;color:var(--danger);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as o, onUnmounted as $, openBlock as p, createElementBlock as h, createVNode as d, unref as c, createElementVNode as s, withModifiers as B, toDisplayString as D, createCommentVNode as O } from "vue";
import { useWindow as I, useOutside as N, Switch as S, Segmented as T, Icon as V } from "@journal/window-kit";
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
}, x = "journal.suites.coding.auto-mode", M = "journal.suites.coding.workers.builder-dispatches-workers", W = "journal.suites.coding.workers.worker-limit", F = {
  __name: "WorkMode",
  setup(G) {
    const v = [
      { key: "coding.builder", label: "Builder", tip: { title: "Builder", line: "The agent builds it itself, and sends workers when a job is better done beside it." } },
      { key: "coding.orchestrator", label: "Orchestrator", tip: { title: "Orchestrator", line: "The agent plans, hands the work to workers, then reviews and merges it; it writes code itself only where no worker can." } }
    ], n = I(), u = o(v[0].key), r = o(!0), i = o(!0), w = o(2), a = o(!1), _ = o(null);
    N(_, () => a.value = !1);
    const g = o(""), m = async (t) => {
      var l;
      const e = await n.read(`setting show ${t} --environment ${n.environment}`);
      return e.ok ? (l = e.value) == null ? void 0 : l.value : void 0;
    };
    async function j() {
      const t = await n.read(`suite current ${n.environment}`), e = t.ok ? v.find((l) => {
        var E;
        return String(((E = t.value) == null ? void 0 : E.drivers) ?? "").includes(l.key);
      }) : null;
      e && (u.value = e.key), r.value = await m(x) !== !1, i.value = await m(M) !== !1, w.value = Number(await m(W) ?? 2);
    }
    async function y(t) {
      const e = await n.run(t);
      return g.value = e.ok ? "" : e.error, e.ok;
    }
    async function C(t) {
      t !== u.value && await y(`driver choose ${t} --environment ${n.environment}`) && (u.value = t);
    }
    const k = (t, e) => y(`setting set ${t} ${e} --environment ${n.environment}`);
    async function f() {
      await k(x, !r.value) && (r.value = !r.value);
    }
    window.addEventListener("journal:toggle-auto", f), $(() => window.removeEventListener("journal:toggle-auto", f));
    async function L() {
      await k(M, !i.value) && (i.value = !i.value);
    }
    async function A(t) {
      const e = Number(t.target.value);
      await k(W, e) && (w.value = e);
    }
    const b = (t) => t.key === "Escape" && (a.value = !1);
    return window.addEventListener("keydown", b), $(() => window.removeEventListener("keydown", b)), j(), (t, e) => (p(), h("span", {
      ref_key: "root",
      ref: _,
      class: "agentset",
      "data-work-mode": ""
    }, [
      d(c(S), {
        on: r.value,
        word: "Auto",
        title: "Auto mode: the agent is given the next open task when it stops or leaves its task",
        "data-auto-toggle": "",
        onChange: f
      }, null, 8, ["on"]),
      d(c(T), {
        class: "agentset-mode",
        options: v,
        value: u.value,
        onPick: C
      }, null, 8, ["value"]),
      s("button", {
        type: "button",
        class: "agentset-settings",
        "data-work-settings": "",
        title: "Work mode settings",
        "aria-expanded": a.value,
        onClick: e[0] || (e[0] = B((l) => a.value = !a.value, ["stop"]))
      }, [
        d(c(V), {
          name: "caret",
          size: 12
        })
      ], 8, R),
      a.value ? (p(), h("div", U, [
        s("label", z, [
          e[1] || (e[1] = s("span", null, "Builder sends workers", -1)),
          d(c(S), {
            on: i.value,
            onChange: L
          }, null, 8, ["on"])
        ]),
        s("label", H, [
          e[2] || (e[2] = s("span", null, "Worker limit", -1)),
          s("input", {
            class: "agentset-number",
            type: "number",
            min: "0",
            value: w.value,
            onChange: A
          }, null, 40, K)
        ]),
        g.value ? (p(), h("p", q, D(g.value), 1)) : O("", !0)
      ])) : O("", !0)
    ], 512));
  }
}, Y = /* @__PURE__ */ P(F, [["__scopeId", "data-v-6aa7e24f"]]);
export {
  Y as default
};
