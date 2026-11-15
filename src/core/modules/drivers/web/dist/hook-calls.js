if (!document.getElementById("window-styles-69f07e8605fe")) { const style = document.createElement("style"); style.id = "window-styles-69f07e8605fe"; style.textContent = "details[data-v-ef2335fe]{width:100%;font-size:12px}summary[data-v-ef2335fe]{cursor:pointer}.check[data-v-ef2335fe]{padding:8px 0;border-bottom:1px solid var(--border)}.check span[data-v-ef2335fe]{margin-left:8px}.note[data-v-ef2335fe]{color:var(--text-3)}p[data-v-ef2335fe]{margin:4px 0 0;white-space:pre-wrap}.activity[data-v-d4f200c4]{width:100%}.summary[data-v-d4f200c4]{display:flex;gap:10px}.main[data-v-d4f200c4]{flex:1}.note[data-v-d4f200c4]{color:var(--text-3);font-size:12px}.nudge[data-v-ec205110]{min-width:0;padding:6px 0}.nudge-head[data-v-ec205110]{display:flex;gap:10px;align-items:baseline;margin:0 0 2px;font-size:12px}.nudge-key[data-v-ec205110]{color:var(--text);font-weight:500}.nudge-type[data-v-ec205110],.nudge-count[data-v-ec205110]{color:var(--text-3)}.nudge-type[data-type=refusal][data-v-ec205110]{color:var(--tone-bad)}.nudge-type[data-type=steering][data-v-ec205110]{color:var(--accent-text)}.nudge-text[data-v-ec205110]{margin:0;color:var(--text-2);font-size:12.5px;overflow-wrap:anywhere}\n"; document.head.appendChild(style); }
import { openBlock as n, createElementBlock as r, createElementVNode as e, Fragment as k, renderList as f, toDisplayString as a, unref as s, createCommentVNode as _, createBlock as p, withCtx as u, createVNode as y } from "vue";
import { useWindow as g, WindowRoom as v, RowList as L } from "@journal/window-kit";
import { _ as m, r as C, c as x, h as N } from "./_plugin-vue_export-helper-B_V_vggM.mjs";
const S = { "data-stop-checks": "" }, $ = {
  key: 0,
  class: "note"
}, E = {
  __name: "StopChecks",
  props: { checks: { type: Array, required: !0 } },
  setup(i) {
    return (l, c) => (n(), r("details", S, [
      c[0] || (c[0] = e("summary", null, "Stop checks", -1)),
      (n(!0), r(k, null, f(i.checks, (t) => (n(), r("div", {
        key: `${t.rule}:${t.layer || ""}`,
        class: "check",
        "data-stop-check": ""
      }, [
        e("strong", null, a(s(C)(t.rule)), 1),
        e("span", null, a(s(x)(t.outcome)), 1),
        t.applied ? _("", !0) : (n(), r("span", $, "Not applied")),
        e("p", null, a(t.reason), 1)
      ]))), 128))
    ]));
  }
}, b = /* @__PURE__ */ m(E, [["__scopeId", "data-v-ef2335fe"]]), w = { class: "activity" }, B = { class: "summary" }, V = { class: "note" }, H = { class: "main" }, I = { class: "note" }, R = {
  __name: "HookCallList",
  setup(i) {
    const l = g();
    l.state["calls.session-agent-id"] = String(l.agent);
    const { rows: c, failure: t, loaded: h } = l.props.calls;
    return (W, j) => (n(), p(s(v), null, {
      default: u(() => [
        y(s(L), {
          rows: s(c),
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
                  e("span", V, a(s(N)(o.hook)), 1),
                  e("span", H, a(o.tool) + " " + a(o.summary), 1),
                  e("span", I, a(o.refusal || o.answer), 1)
                ]),
                (d = o.stop_checks) != null && d.length ? (n(), p(b, {
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
}, F = /* @__PURE__ */ m(R, [["__scopeId", "data-v-d4f200c4"]]);
export {
  F as default
};
