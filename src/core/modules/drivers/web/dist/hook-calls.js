/* @code-commandments-generated */
if (!document.getElementById("window-styles-2d9e95126a71")) { const style = document.createElement("style"); style.id = "window-styles-2d9e95126a71"; style.textContent = "details[data-v-efdd3bca]{width:100%;font-size:12px}summary[data-v-efdd3bca]{cursor:pointer}.check[data-v-efdd3bca]{padding:8px 0;border-bottom:1px solid var(--border)}.check span[data-v-efdd3bca]{margin-left:8px}.note[data-v-efdd3bca]{color:var(--text-3)}p[data-v-efdd3bca]{margin:4px 0 0;white-space:pre-wrap}.activity[data-v-43507c7a]{width:100%}.summary[data-v-43507c7a]{display:flex;gap:10px}.main[data-v-43507c7a]{flex:1}.note[data-v-43507c7a]{color:var(--text-3);font-size:12px}.nudge[data-v-894b8f1e]{min-width:0;padding:6px 0}.nudge-head[data-v-894b8f1e]{display:flex;gap:10px;align-items:baseline;margin:0 0 2px;font-size:12px}.nudge-key[data-v-894b8f1e]{color:var(--text);font-weight:500}.nudge-type[data-v-894b8f1e],.nudge-count[data-v-894b8f1e]{color:var(--text-3)}.nudge-type[data-type=refusal][data-v-894b8f1e]{color:var(--tone-bad)}.nudge-type[data-type=steering][data-v-894b8f1e]{color:var(--accent-text)}.nudge-text[data-v-894b8f1e]{margin:0;color:var(--text-2);font-size:12.5px;overflow-wrap:anywhere}\n"; document.head.appendChild(style); }
import { openBlock as n, createElementBlock as r, createElementVNode as e, Fragment as m, renderList as k, toDisplayString as o, createCommentVNode as p, createBlock as _, unref as a, withCtx as u, createVNode as f } from "vue";
import { useRows as y, useWindow as g, WindowRoom as v, RowList as C } from "@journal/window-kit";
import { _ as h, h as $ } from "./_plugin-vue_export-helper-BEOZ8alP.mjs";
const x = { "data-stop-checks": "" }, L = {
  key: 0,
  class: "note"
}, N = {
  __name: "StopChecks",
  props: { checks: { type: Array, required: !0 } },
  setup(c) {
    return (d, l) => (n(), r("details", x, [
      l[0] || (l[0] = e("summary", null, "Stop checks", -1)),
      (n(!0), r(m, null, k(c.checks, (t) => (n(), r("div", {
        key: `${t.rule}:${t.layer || ""}`,
        class: "check",
        "data-stop-check": ""
      }, [
        e("strong", null, o(t.rule), 1),
        e("span", null, o(t.outcome), 1),
        t.applied ? p("", !0) : (n(), r("span", L, "Not applied")),
        e("p", null, o(t.reason), 1)
      ]))), 128))
    ]));
  }
}, E = /* @__PURE__ */ h(N, [["__scopeId", "data-v-efdd3bca"]]), S = { class: "activity" }, w = { class: "summary" }, B = { class: "note" }, R = { class: "main" }, V = { class: "note" }, b = {
  __name: "HookCallList",
  setup(c) {
    const { rows: d, failure: l, loaded: t } = y(`hook-call feed --session-agent-id ${g().agent}`, ["hook_call.*"], { incremental: !0 });
    return (H, I) => (n(), _(a(v), null, {
      default: u(() => [
        f(a(C), {
          rows: a(d),
          failure: a(l),
          loaded: a(t),
          empty: "Nothing recorded for this agent yet",
          hint: "Each call the agent program makes to the journal is listed here."
        }, {
          default: u(({ row: s }) => {
            var i;
            return [
              e("div", S, [
                e("div", w, [
                  e("span", B, o(a($)(s.hook)), 1),
                  e("span", R, o(s.tool) + " " + o(s.summary), 1),
                  e("span", V, o(s.refusal || s.answer), 1)
                ]),
                (i = s.stop_checks) != null && i.length ? (n(), _(E, {
                  key: 0,
                  checks: s.stop_checks
                }, null, 8, ["checks"])) : p("", !0)
              ])
            ];
          }),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, A = /* @__PURE__ */ h(b, [["__scopeId", "data-v-43507c7a"]]);
export {
  A as default
};
