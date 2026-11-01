/* @code-commandments-generated */
if (!document.getElementById("window-styles-53e3cd840c06")) { const style = document.createElement("style"); style.id = "window-styles-53e3cd840c06"; style.textContent = ".agent-jobs[data-v-75343eec]{display:flex;flex-direction:column;gap:6px}.agent-jobs-refusal[data-v-75343eec]{margin:0;color:var(--danger);font-size:12.5px}.agent-job[data-v-75343eec]{display:flex;flex:1;gap:10px;align-items:center;min-width:0;padding:6px 0}.agent-job-text[data-v-75343eec]{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0}.agent-job-text span[data-v-75343eec]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as y, openBlock as b, createElementBlock as h, toDisplayString as l, createCommentVNode as j, createVNode as $, unref as f, withCtx as v, createElementVNode as m, createTextVNode as S } from "vue";
import { useWindow as k, useRows as N, RowList as x, Btn as D } from "@journal/window-kit";
const w = [
  [0, 59],
  [0, 23],
  [1, 31],
  [1, 12],
  [0, 6]
], A = 11520;
function E(n, [s, e]) {
  const t = /* @__PURE__ */ new Set();
  for (const o of n.split(",")) {
    const [a, r = "1"] = o.split("/"), [i, p] = a === "*" ? [s, e] : a.includes("-") ? a.split("-").map(Number) : [Number(a), r === "1" ? Number(a) : e];
    for (let _ = i; _ <= p; _ += Number(r)) t.add(_);
  }
  return t;
}
function M(n) {
  const s = String(n || "").trim().split(/\s+/);
  return s.length === 5 ? s.map((e, t) => E(e, w[t])) : null;
}
function B(n, s = /* @__PURE__ */ new Date()) {
  const e = M(n);
  if (!e) return null;
  const t = new Date(s);
  t.setSeconds(0, 0);
  for (let o = 0; o < A; o++)
    if (t.setMinutes(t.getMinutes() + 1), [t.getMinutes(), t.getHours(), t.getDate(), t.getMonth() + 1, t.getDay()].every((r, i) => e[i].has(r))) return new Date(t);
  return null;
}
const g = (n) => String(n).padStart(2, "0");
function C(n) {
  const s = String(n || "").trim().split(/\s+/);
  if (s.length !== 5) return n || "";
  const [e, t, o, a, r] = s, i = o === "*" && a === "*" && r === "*";
  return i && t === "*" && e.startsWith("*/") ? `every ${e.slice(2)} minutes` : i && t === "*" && /^[\d,]+$/.test(e) ? `every hour at ${e.split(",").map((p) => `:${g(p)}`).join(", ")}` : i && /^\d+$/.test(t) && /^\d+$/.test(e) ? `every day at ${g(t)}:${g(e)}` : !i && /^\d+$/.test(o) && /^\d+$/.test(a) && /^\d+$/.test(t) && /^\d+$/.test(e) ? `once, on ${o}/${a} at ${g(t)}:${g(e)}` : n;
}
const L = (n, s) => {
  const e = n.__vccOpts || n;
  for (const [t, o] of s)
    e[t] = o;
  return e;
}, R = { class: "agent-jobs" }, T = {
  key: 0,
  class: "agent-jobs-refusal",
  role: "alert",
  "data-job-refusal": ""
}, V = ["data-job"], O = { class: "agent-job-text" }, W = {
  __name: "AgentJobs",
  setup(n) {
    const s = k(), { rows: e, failure: t, loaded: o, load: a } = N(`scheduled-job running --agent ${s.agent}`, ["scheduled_job.*"]), r = y(""), i = (u) => u.split(`
`)[0];
    function p(u) {
      const d = B(u.cron);
      return d ? `next at ${d.toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" })}` : "not due again";
    }
    async function _(u) {
      const d = await s.run(["scheduled-job", "stop", String(u.id)]);
      r.value = d.ok ? "" : d.error, d.ok && a();
    }
    return (u, d) => (b(), h("div", R, [
      r.value ? (b(), h("p", T, l(r.value), 1)) : j("", !0),
      $(f(x), {
        rows: f(e),
        failure: f(t),
        loaded: f(o),
        empty: "The agent has scheduled nothing"
      }, {
        default: v(({ row: c }) => [
          m("div", {
            class: "agent-job",
            "data-job": c.job_id
          }, [
            m("div", O, [
              m("b", null, l(i(c.prompt)), 1),
              m("span", null, l(f(C)(c.cron)) + l(c.is_recurring ? "" : ", once") + " · " + l(p(c)), 1)
            ]),
            $(f(D), {
              small: "",
              disabled: !!c.stop_asked_at,
              "data-job-stop": "",
              onClick: (H) => _(c)
            }, {
              default: v(() => [
                S(l(c.stop_asked_at ? "Stopping" : "Stop"), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onClick"])
          ], 8, V)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ]));
  }
}, G = /* @__PURE__ */ L(W, [["__scopeId", "data-v-75343eec"]]);
export {
  G as default
};
