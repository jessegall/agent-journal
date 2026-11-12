if (!document.getElementById("window-styles-93c2023d4e91")) { const style = document.createElement("style"); style.id = "window-styles-93c2023d4e91"; style.textContent = ".output-dock-inner[data-v-df2226c3]{min-height:0;overflow:hidden}.output-dock-state[data-v-df2226c3]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-df2226c3]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-df2226c3 .9s linear infinite}@keyframes output-spin-df2226c3{to{transform:rotate(360deg)}}.output-dock-pending[data-v-df2226c3]{display:inline-flex;align-items:center;flex:none;gap:3px}.output-dock-pending i[data-v-df2226c3]{width:4px;height:4px;border-radius:50%;background:var(--text-3);animation:output-pending-df2226c3 1.2s ease-in-out infinite}.output-dock-pending i[data-v-df2226c3]:nth-child(2){animation-delay:.2s}.output-dock-pending i[data-v-df2226c3]:nth-child(3){animation-delay:.4s}@keyframes output-pending-df2226c3{0%,60%,to{opacity:.3}30%{opacity:1}}@media(prefers-reduced-motion:reduce){.output-dock-pending i[data-v-df2226c3]{animation:none}}.output-dock-title[data-v-df2226c3]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-df2226c3]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-percent[data-v-df2226c3]{--dock-bar-width: 64px;--dock-bar-height: 8px;flex:none;align-self:center;width:var(--dock-bar-width);height:var(--dock-bar-height);margin-right:6px;overflow:hidden;border-radius:4px;background:var(--bar-track)}.output-dock-percent i[data-v-df2226c3]{display:block;height:100%}.output-dock-terminal[data-v-df2226c3]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-df2226c3]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-df2226c3]{height:100%;transition:width .4s ease}.output-dock-box[data-v-df2226c3]{position:relative}.output-dock-report[data-v-df2226c3]{position:absolute;top:6px;right:14px;display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;padding:0;border:0;border-radius:6px;background:none;color:var(--text-3);cursor:pointer}.output-dock-report[data-v-df2226c3]:hover{background:var(--hover);color:var(--text)}.output-dock-loading[data-v-df2226c3]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-df2226c3]{animation:output-fade-df2226c3 .22s var(--ease) .32s backwards}@keyframes output-fade-df2226c3{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-df2226c3]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-6f238ea7]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-6f238ea7]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-6f238ea7]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-6f238ea7]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-6f238ea7]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-d79ed4cf]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-d79ed4cf]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-d79ed4cf],.state.lost[data-v-d79ed4cf]{color:var(--red, #d4574b)}.line[data-v-d79ed4cf]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.marks[data-v-d79ed4cf]{padding:8px 12px;font-size:12px}.marks h3[data-v-d79ed4cf]{margin:0 0 4px;font-size:12px;color:var(--text-2)}.mark[data-v-d79ed4cf]{display:flex;gap:8px;margin:2px 0}.why[data-v-d79ed4cf],.who[data-v-d79ed4cf],.note[data-v-d79ed4cf]{flex:none;color:var(--text-3)}button[data-v-d79ed4cf]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { computed as b, openBlock as a, createBlock as p, unref as s, withCtx as _, createVNode as m, createElementVNode as n, normalizeClass as v, toDisplayString as o, createCommentVNode as d, createElementBlock as l, Fragment as x, renderList as C } from "vue";
import { useWindow as L, useListTools as N, WindowRoom as B, ListTools as O, RowList as R, stateLabel as f } from "@journal/window-kit";
import { _ as V } from "./RunButtons-DurAB3P9.mjs";
import { _ as W } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const E = { class: "run" }, M = { class: "line" }, T = {
  key: 0,
  class: "marks",
  "data-unreadable-marks": ""
}, z = { class: "line" }, D = { class: "why" }, F = { class: "who" }, I = {
  key: 0,
  class: "note"
}, S = {
  __name: "Outputs",
  setup($) {
    const r = L();
    r.agent != null && (r.state["runs.session-agent-id"] = r.agent);
    const { rows: h, failure: g, loaded: k } = r.props.runs, y = r.props.marks.rows, c = b(() => (y.value ?? []).filter((t) => !t.lifted_at)), i = N(h, { title: (t) => t.line, isOpen: (t) => t.state === "running" }), w = (t) => t.state === "running" || t.state === "background";
    return (t, u) => (a(), p(s(B), null, {
      default: _(() => [
        m(s(O), { tools: s(i) }, null, 8, ["tools"]),
        m(s(R), {
          rows: s(i).shown.value,
          failure: s(g),
          loaded: s(k),
          empty: "No commands yet",
          hint: "Commands run by an agent appear here with their output.",
          searching: s(i).filtering.value
        }, {
          default: _(({ row: e }) => [
            n("div", E, [
              n("span", {
                class: v(["state", e.state])
              }, o(s(f)("process", e.state)), 3),
              n("span", M, o(e.line), 1),
              w(e) ? (a(), p(V, {
                key: 0,
                "process-id": e.id
              }, null, 8, ["process-id"])) : d("", !0)
            ])
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "searching"]),
        c.value.length ? (a(), l("section", T, [
          u[0] || (u[0] = n("h3", null, "Commands no reader can read", -1)),
          (a(!0), l(x, null, C(c.value, (e) => (a(), l("p", {
            key: e.id,
            class: "mark",
            "data-unreadable-mark": ""
          }, [
            n("span", z, o(e.words), 1),
            n("span", D, "Why: " + o(s(f)("unreadable_mark", e.reason)), 1),
            n("span", F, "Marked by: " + o(e.creator_id), 1),
            e.note ? (a(), l("span", I, o(e.note), 1)) : d("", !0)
          ]))), 128))
        ])) : d("", !0)
      ]),
      _: 1
    }));
  }
}, H = /* @__PURE__ */ W(S, [["__scopeId", "data-v-d79ed4cf"]]);
export {
  H as default
};
