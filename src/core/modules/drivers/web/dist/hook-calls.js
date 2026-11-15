if (!document.getElementById("window-styles-7685cd097e86")) { const style = document.createElement("style"); style.id = "window-styles-7685cd097e86"; style.textContent = ".agent-message[data-v-64679be0]{min-width:0;padding:6px 0}.agent-message-head[data-v-64679be0]{display:flex;gap:10px;align-items:baseline;margin:0 0 2px;font-size:12px}.agent-message-key[data-v-64679be0]{color:var(--text);font-weight:500}.agent-message-type[data-v-64679be0],.agent-message-count[data-v-64679be0]{color:var(--text-3)}.agent-message-type[data-type=refusal][data-v-64679be0]{color:var(--tone-bad)}.agent-message-type[data-type=steering][data-v-64679be0]{color:var(--accent-text)}.agent-message-text[data-v-64679be0]{margin:0;color:var(--text-2);font-size:12.5px;overflow-wrap:anywhere}details[data-v-edc7aad3]{width:100%;font-size:12px}summary[data-v-edc7aad3]{cursor:pointer}.check[data-v-edc7aad3]{padding:8px 0;border-bottom:1px solid var(--border)}.check span[data-v-edc7aad3]{margin-left:8px}.note[data-v-edc7aad3]{color:var(--text-3)}p[data-v-edc7aad3]{margin:4px 0 0;white-space:pre-wrap}.activity[data-v-b781af7b]{width:100%}.summary[data-v-b781af7b]{display:flex;gap:10px}.main[data-v-b781af7b]{flex:1}.note[data-v-b781af7b]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as n, createElementBlock as r, createElementVNode as e, Fragment as k, renderList as f, toDisplayString as a, unref as t, createCommentVNode as _, createBlock as p, withCtx as u, createVNode as y } from "vue";
import { useWindow as g, WindowRoom as v, RowList as L } from "@journal/window-kit";
import { _ as h, r as C, c as b, h as x } from "./_plugin-vue_export-helper-CIxTtzM2.js";
const N = { "data-stop-checks": "" }, S = {
  key: 0,
  class: "note"
}, E = {
  __name: "StopChecks",
  props: { checks: { type: Array, required: !0 } },
  setup(i) {
    return (c, l) => (n(), r("details", N, [
      l[0] || (l[0] = e("summary", null, "Stop checks", -1)),
      (n(!0), r(k, null, f(i.checks, (s) => (n(), r("div", {
        key: s.rule,
        class: "check",
        "data-stop-check": ""
      }, [
        e("strong", null, a(t(C)(s.rule)), 1),
        e("span", null, a(t(b)(s.outcome)), 1),
        s.applied ? _("", !0) : (n(), r("span", S, "Not applied")),
        e("p", null, a(s.reason), 1)
      ]))), 128))
    ]));
  }
}, w = /* @__PURE__ */ h(E, [["__scopeId", "data-v-edc7aad3"]]), B = { class: "activity" }, V = { class: "summary" }, $ = { class: "note" }, H = { class: "main" }, I = { class: "note" }, R = {
  __name: "HookCallList",
  setup(i) {
    const c = g();
    c.state["calls.session-agent-id"] = String(c.agent);
    const { rows: l, failure: s, loaded: m } = c.props.calls;
    return (W, j) => (n(), p(t(v), null, {
      default: u(() => [
        y(t(L), {
          rows: t(l),
          failure: t(s),
          loaded: t(m),
          empty: "Nothing recorded for this agent yet",
          hint: "Each call the agent program makes to the journal is listed here."
        }, {
          default: u(({ row: o }) => {
            var d;
            return [
              e("div", B, [
                e("div", V, [
                  e("span", $, a(t(x)(o.hook)), 1),
                  e("span", H, a(o.tool) + " " + a(o.summary), 1),
                  e("span", I, a(o.refusal || o.answer), 1)
                ]),
                (d = o.stop_checks) != null && d.length ? (n(), p(w, {
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
}, F = /* @__PURE__ */ h(R, [["__scopeId", "data-v-b781af7b"]]);
export {
  F as default
};
