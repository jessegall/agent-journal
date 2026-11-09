if (!document.getElementById("window-styles-d1117b94f7d2")) { const style = document.createElement("style"); style.id = "window-styles-d1117b94f7d2"; style.textContent = "details[data-v-ebe6bd00]{width:100%;font-size:12px}summary[data-v-ebe6bd00]{cursor:pointer}.check[data-v-ebe6bd00]{padding:8px 0;border-bottom:1px solid var(--border)}.check span[data-v-ebe6bd00]{margin-left:8px}.note[data-v-ebe6bd00]{color:var(--text-3)}p[data-v-ebe6bd00]{margin:4px 0 0;white-space:pre-wrap}.activity[data-v-b781af7b]{width:100%}.summary[data-v-b781af7b]{display:flex;gap:10px}.main[data-v-b781af7b]{flex:1}.note[data-v-b781af7b]{color:var(--text-3);font-size:12px}.nudge[data-v-7cdcc629]{min-width:0;padding:6px 0}.nudge-head[data-v-7cdcc629]{display:flex;gap:10px;align-items:baseline;margin:0 0 2px;font-size:12px}.nudge-key[data-v-7cdcc629]{color:var(--text);font-weight:500}.nudge-type[data-v-7cdcc629],.nudge-count[data-v-7cdcc629]{color:var(--text-3)}.nudge-type[data-type=refusal][data-v-7cdcc629]{color:var(--tone-bad)}.nudge-type[data-type=steering][data-v-7cdcc629]{color:var(--accent-text)}.nudge-text[data-v-7cdcc629]{margin:0;color:var(--text-2);font-size:12.5px;overflow-wrap:anywhere}\n"; document.head.appendChild(style); }
import { openBlock as n, createElementBlock as c, createElementVNode as e, Fragment as k, renderList as f, toDisplayString as a, unref as s, createCommentVNode as _, createBlock as p, withCtx as u, createVNode as y } from "vue";
import { useWindow as g, WindowRoom as v, RowList as b } from "@journal/window-kit";
import { _ as m, r as L, c as C, h as x } from "./_plugin-vue_export-helper-B_V_vggM.js";
const N = { "data-stop-checks": "" }, S = {
  key: 0,
  class: "note"
}, $ = {
  __name: "StopChecks",
  props: { checks: { type: Array, required: !0 } },
  setup(i) {
    return (l, r) => (n(), c("details", N, [
      r[0] || (r[0] = e("summary", null, "Stop checks", -1)),
      (n(!0), c(k, null, f(i.checks, (t) => (n(), c("div", {
        key: `${t.rule}:${t.layer || ""}`,
        class: "check",
        "data-stop-check": ""
      }, [
        e("strong", null, a(s(L)(t.rule)), 1),
        e("span", null, a(s(C)(t.outcome)), 1),
        t.applied ? _("", !0) : (n(), c("span", S, "Not applied")),
        e("p", null, a(t.reason), 1)
      ]))), 128))
    ]));
  }
}, E = /* @__PURE__ */ m($, [["__scopeId", "data-v-ebe6bd00"]]), w = { class: "activity" }, B = { class: "summary" }, V = { class: "note" }, H = { class: "main" }, I = { class: "note" }, R = {
  __name: "HookCallList",
  setup(i) {
    const l = g();
    l.state["calls.session-agent-id"] = String(l.agent);
    const { rows: r, failure: t, loaded: h } = l.props.calls;
    return (W, j) => (n(), p(s(v), null, {
      default: u(() => [
        y(s(b), {
          rows: s(r),
          failure: s(t),
          loaded: s(h),
          empty: "Nothing recorded for this agent yet",
          hint: "Each call the agent program makes to the journal is listed here."
        }, {
          default: u(({ row: o }) => {
            var d;
            return [
              e("div", w, [
                e("div", B, [
                  e("span", V, a(s(x)(o.hook)), 1),
                  e("span", H, a(o.tool) + " " + a(o.summary), 1),
                  e("span", I, a(o.refusal || o.answer), 1)
                ]),
                (d = o.stop_checks) != null && d.length ? (n(), p(E, {
                  key: 0,
                  checks: o.stop_checks
                }, null, 8, ["checks"])) : _("", !0)
              ])
            ];
          }),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, F = /* @__PURE__ */ m(R, [["__scopeId", "data-v-b781af7b"]]);
export {
  F as default
};
