if (!document.getElementById("window-styles-6767b18b1416")) { const style = document.createElement("style"); style.id = "window-styles-6767b18b1416"; style.textContent = ".output-dock-inner[data-v-2d71606f]{min-height:0;overflow:hidden}.output-dock-state[data-v-2d71606f]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-2d71606f]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-2d71606f .9s linear infinite}@keyframes output-spin-2d71606f{to{transform:rotate(360deg)}}.output-dock-pending[data-v-2d71606f]{display:inline-flex;align-items:center;flex:none;gap:3px}.output-dock-pending i[data-v-2d71606f]{width:4px;height:4px;border-radius:50%;background:var(--text-3);animation:output-pending-2d71606f 1.2s ease-in-out infinite}.output-dock-pending i[data-v-2d71606f]:nth-child(2){animation-delay:.2s}.output-dock-pending i[data-v-2d71606f]:nth-child(3){animation-delay:.4s}@keyframes output-pending-2d71606f{0%,60%,to{opacity:.3}30%{opacity:1}}@media(prefers-reduced-motion:reduce){.output-dock-pending i[data-v-2d71606f]{animation:none}}.output-dock-title[data-v-2d71606f]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-2d71606f]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-percent[data-v-2d71606f]{--dock-bar-width: 64px;--dock-bar-height: 8px;flex:none;align-self:center;width:var(--dock-bar-width);height:var(--dock-bar-height);margin-right:6px;overflow:hidden;border-radius:4px;background:var(--bar-track)}.output-dock-percent i[data-v-2d71606f]{display:block;height:100%}.output-dock-terminal[data-v-2d71606f]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-2d71606f]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-2d71606f]{height:100%;transition:width .4s ease}.output-dock-box[data-v-2d71606f]{position:relative}.output-dock-report[data-v-2d71606f]{position:absolute;top:6px;right:14px;display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;padding:0;border:0;border-radius:6px;background:none;color:var(--text-3);cursor:pointer}.output-dock-report[data-v-2d71606f]:hover{background:var(--hover);color:var(--text)}.output-dock-report[data-v-2d71606f]{opacity:0;transition:opacity .12s ease}.output-dock-box:hover .output-dock-report[data-v-2d71606f],.output-dock-report[data-v-2d71606f]:focus-visible,.output-dock-report[aria-expanded=true][data-v-2d71606f]{opacity:1}.output-dock-loading[data-v-2d71606f]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-2d71606f]{animation:output-fade-2d71606f .22s var(--ease) .32s backwards}@keyframes output-fade-2d71606f{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-2d71606f]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-8c713a5e]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-8c713a5e]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-8c713a5e]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-8c713a5e]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-8c713a5e]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.outputs[data-v-f0e0035c]{display:flex;flex:1;flex-direction:column;min-height:0}.note[data-v-f0e0035c]{margin:0;padding:0 var(--inset);color:var(--text-3);font-size:12px}.failure[data-v-f0e0035c]{color:var(--danger)}.running[data-v-f0e0035c]{display:flex;align-items:baseline;gap:8px;margin:0;padding:4px var(--inset);font-size:12px}.line[data-v-f0e0035c]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.marks[data-v-f0e0035c]{padding:8px var(--inset);font-size:12px}.marks h3[data-v-f0e0035c]{margin:0 0 4px;font-size:12px;color:var(--text-2)}.mark[data-v-f0e0035c]{display:flex;gap:8px;margin:2px 0}.why[data-v-f0e0035c],.who[data-v-f0e0035c]{flex:none;color:var(--text-3)}button[data-v-f0e0035c]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { computed as r, openBlock as a, createBlock as C, unref as s, withCtx as D, createElementVNode as l, createVNode as _, createElementBlock as o, toDisplayString as i, createCommentVNode as p, Fragment as y, renderList as h } from "vue";
import { useWindow as L, ago as N, stateLabel as k, optionsOf as g, WindowRoom as S, PageHeader as T, TableLayout as W } from "@journal/window-kit";
import { _ as A } from "./RunButtons-DurAB3P9.js";
import { _ as V } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const E = {
  class: "outputs",
  "data-outputs": ""
}, R = {
  key: 0,
  class: "note failure",
  role: "alert"
}, F = { class: "line" }, H = {
  key: 1,
  class: "marks",
  "data-unreadable-marks": ""
}, I = { class: "line" }, P = { class: "why" }, U = { class: "who" }, j = {
  key: 0,
  class: "note"
}, q = {
  __name: "Outputs",
  setup(z) {
    const d = L();
    d.agent != null && (d.state["runs.session-agent-id"] = d.agent);
    const { rows: c, failure: m, loaded: b } = d.props.runs, v = d.props.marks.rows, f = r(() => (v.value ?? []).filter((e) => !e.lifted_at)), $ = (e) => e.state === "running" || e.state === "background", x = [{ key: "id", label: "Output" }, { key: "line", label: "Command" }, { key: "agent", label: "Agent" }, { key: "task", label: "Task" }, { key: "state", label: "State" }, { key: "took", label: "Duration" }, { key: "when", label: "When" }], M = (e) => {
      if (!e.started_at) return "";
      const n = Math.max(0, Math.floor(((e.ended_at ? new Date(e.ended_at) : /* @__PURE__ */ new Date()) - new Date(e.started_at)) / 1e3));
      return n < 60 ? `${n} s` : `${Math.floor(n / 60)} m ${n % 60} s`;
    }, u = r(() => c.value.map((e) => ({
      ref: `output:${e.id}`,
      id: e.id,
      line: e.line,
      agent: e.session_agent_id ? `Agent ${e.session_agent_id}` : "",
      task: e.task_id ? `Task ${e.task_id}` : "",
      state: k("process", e.state),
      status: e.state,
      took: M(e),
      when: e.created_at ? N(e.created_at) : "",
      tone: e.state === "failed" || e.state === "lost" ? "danger" : "",
      row: e
    }))), O = r(() => [
      { key: "state", label: "State", options: g(u.value, (e) => [e.status], (e) => k("process", e)), get: (e) => e.status },
      { key: "agent", label: "Agent", options: g(u.value, (e) => [e.agent].filter(Boolean)), get: (e) => e.agent },
      { key: "task", label: "Task", options: g(u.value, (e) => [e.task].filter(Boolean)), get: (e) => e.task }
    ]), B = r(() => c.value.filter($));
    return (e, n) => (a(), C(s(S), { padding: "0" }, {
      default: D(() => [
        l("div", E, [
          _(s(T), {
            title: "Output",
            count: s(c).length
          }, null, 8, ["count"]),
          s(m) ? (a(), o("p", R, i(s(m)), 1)) : p("", !0),
          (a(!0), o(y, null, h(B.value, (t) => (a(), o("p", {
            key: t.id,
            class: "running",
            "data-running-run": ""
          }, [
            l("span", F, i(t.line), 1),
            _(A, {
              "process-id": t.id
            }, null, 8, ["process-id"])
          ]))), 128)),
          _(s(W), {
            columns: x,
            rows: u.value,
            fields: O.value,
            empty: s(b) ? "No commands yet" : "Loading",
            "data-outputs-table": ""
          }, null, 8, ["rows", "fields", "empty"]),
          f.value.length ? (a(), o("section", H, [
            n[0] || (n[0] = l("h3", null, "Commands no reader can read", -1)),
            (a(!0), o(y, null, h(f.value, (t) => (a(), o("p", {
              key: t.id,
              class: "mark",
              "data-unreadable-mark": ""
            }, [
              l("span", I, i(t.words), 1),
              l("span", P, "Why: " + i(s(k)("unreadable_mark", t.reason)), 1),
              l("span", U, "Marked by: " + i(t.creator_id), 1),
              t.note ? (a(), o("span", j, i(t.note), 1)) : p("", !0)
            ]))), 128))
          ])) : p("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, X = /* @__PURE__ */ V(q, [["__scopeId", "data-v-f0e0035c"]]);
export {
  X as default
};
