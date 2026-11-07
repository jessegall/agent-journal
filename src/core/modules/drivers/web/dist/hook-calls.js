/* @code-commandments-generated */
if (!document.getElementById("window-styles-bca4cee258ef")) { const style = document.createElement("style"); style.id = "window-styles-bca4cee258ef"; style.textContent = "details[data-v-769933cd]{width:100%;font-size:12px}summary[data-v-769933cd]{cursor:pointer}.check[data-v-769933cd]{padding:8px 0;border-bottom:1px solid var(--border)}.check span[data-v-769933cd]{margin-left:8px}.note[data-v-769933cd]{color:var(--text-3)}p[data-v-769933cd]{margin:4px 0 0;white-space:pre-wrap}.activity[data-v-b781af7b]{width:100%}.summary[data-v-b781af7b]{display:flex;gap:10px}.main[data-v-b781af7b]{flex:1}.note[data-v-b781af7b]{color:var(--text-3);font-size:12px}.nudge[data-v-7cdcc629]{min-width:0;padding:6px 0}.nudge-head[data-v-7cdcc629]{display:flex;gap:10px;align-items:baseline;margin:0 0 2px;font-size:12px}.nudge-key[data-v-7cdcc629]{color:var(--text);font-weight:500}.nudge-type[data-v-7cdcc629],.nudge-count[data-v-7cdcc629]{color:var(--text-3)}.nudge-type[data-type=refusal][data-v-7cdcc629]{color:var(--tone-bad)}.nudge-type[data-type=steering][data-v-7cdcc629]{color:var(--accent-text)}.nudge-text[data-v-7cdcc629]{margin:0;color:var(--text-2);font-size:12.5px;overflow-wrap:anywhere}\n"; document.head.appendChild(style); }
import { openBlock as n, createElementBlock as c, createElementVNode as e, Fragment as k, renderList as f, toDisplayString as o, createCommentVNode as u, createBlock as p, unref as a, withCtx as _, createVNode as y } from "vue";
import { useWindow as g, WindowRoom as v, RowList as C } from "@journal/window-kit";
import { _ as m, h as x } from "./_plugin-vue_export-helper-BEOZ8alP.js";
const L = { "data-stop-checks": "" }, N = {
  key: 0,
  class: "note"
}, S = {
  __name: "StopChecks",
  props: { checks: { type: Array, required: !0 } },
  setup(i) {
    return (l, r) => (n(), c("details", L, [
      r[0] || (r[0] = e("summary", null, "Stop checks", -1)),
      (n(!0), c(k, null, f(i.checks, (t) => (n(), c("div", {
        key: `${t.rule}:${t.layer || ""}`,
        class: "check",
        "data-stop-check": ""
      }, [
        e("strong", null, o(t.rule), 1),
        e("span", null, o(t.outcome), 1),
        t.applied ? u("", !0) : (n(), c("span", N, "Not applied")),
        e("p", null, o(t.reason), 1)
      ]))), 128))
    ]));
  }
}, $ = /* @__PURE__ */ m(S, [["__scopeId", "data-v-769933cd"]]), E = { class: "activity" }, b = { class: "summary" }, w = { class: "note" }, B = { class: "main" }, V = { class: "note" }, H = {
  __name: "HookCallList",
  setup(i) {
    const l = g();
    l.state["calls.session-agent-id"] = String(l.agent);
    const { rows: r, failure: t, loaded: h } = l.props.calls;
    return (I, R) => (n(), p(a(v), null, {
      default: _(() => [
        y(a(C), {
          rows: a(r),
          failure: a(t),
          loaded: a(h),
          empty: "Nothing recorded for this agent yet",
          hint: "Each call the agent program makes to the journal is listed here."
        }, {
          default: _(({ row: s }) => {
            var d;
            return [
              e("div", E, [
                e("div", b, [
                  e("span", w, o(a(x)(s.hook)), 1),
                  e("span", B, o(s.tool) + " " + o(s.summary), 1),
                  e("span", V, o(s.refusal || s.answer), 1)
                ]),
                (d = s.stop_checks) != null && d.length ? (n(), p($, {
                  key: 0,
                  checks: s.stop_checks
                }, null, 8, ["checks"])) : u("", !0)
              ])
            ];
          }),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, A = /* @__PURE__ */ m(H, [["__scopeId", "data-v-b781af7b"]]);
export {
  A as default
};
