/* @code-commandments-generated */
if (!document.getElementById("window-styles-8871a505911a")) { const style = document.createElement("style"); style.id = "window-styles-8871a505911a"; style.textContent = ".agent-jobs[data-v-f2adcd35]{display:flex;flex-direction:column;gap:6px}.agent-jobs-refusal[data-v-f2adcd35]{margin:0;color:var(--danger);font-size:12.5px}.agent-job[data-v-f2adcd35]{display:flex;flex:1;gap:10px;align-items:center;min-width:0;padding:6px 0}.agent-job-text[data-v-f2adcd35]{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0}.agent-job-text span[data-v-f2adcd35]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as j, openBlock as h, createElementBlock as b, toDisplayString as p, createCommentVNode as S, createVNode as $, unref as _, withCtx as v, createElementVNode as m, createTextVNode as k } from "vue";
import { useWindow as N, useRows as x, RowList as w, Btn as D } from "@journal/window-kit";
const A = [
  [0, 59],
  [0, 23],
  [1, 31],
  [1, 12],
  [0, 6]
], E = 11520;
function M(n, [s, e]) {
  const t = /* @__PURE__ */ new Set();
  for (const o of n.split(",")) {
    const [r, i = "1"] = o.split("/"), [d, l] = r === "*" ? [s, e] : r.includes("-") ? r.split("-").map(Number) : [Number(r), i === "1" ? Number(r) : e];
    for (let f = d; f <= l; f += Number(i)) t.add(f);
  }
  return t;
}
function B(n) {
  const s = String(n || "").trim().split(/\s+/);
  return s.length === 5 ? s.map((e, t) => M(e, A[t])) : null;
}
function C(n, s = /* @__PURE__ */ new Date()) {
  const e = B(n);
  if (!e) return null;
  const t = new Date(s);
  t.setSeconds(0, 0);
  for (let o = 0; o < E; o++)
    if (t.setMinutes(t.getMinutes() + 1), [t.getMinutes(), t.getHours(), t.getDate(), t.getMonth() + 1, t.getDay()].every((i, d) => e[d].has(i))) return new Date(t);
  return null;
}
const g = (n) => String(n).padStart(2, "0");
function L(n) {
  const s = String(n || "").trim().split(/\s+/);
  if (s.length !== 5) return n || "";
  const [e, t, o, r, i] = s, d = o === "*" && r === "*" && i === "*";
  return d && t === "*" && e.startsWith("*/") ? `every ${e.slice(2)} minutes` : d && t === "*" && /^[\d,]+$/.test(e) ? `every hour at ${e.split(",").map((l) => `:${g(l)}`).join(", ")}` : d && /^\d+$/.test(t) && /^\d+$/.test(e) ? `every day at ${g(t)}:${g(e)}` : !d && /^\d+$/.test(o) && /^\d+$/.test(r) && /^\d+$/.test(t) && /^\d+$/.test(e) ? `once, on ${o}/${r} at ${g(t)}:${g(e)}` : n;
}
const R = (n, s) => {
  const e = n.__vccOpts || n;
  for (const [t, o] of s)
    e[t] = o;
  return e;
}, T = { class: "agent-jobs" }, V = {
  key: 0,
  class: "agent-jobs-refusal",
  role: "alert",
  "data-job-refusal": ""
}, W = ["data-job"], O = { class: "agent-job-text" }, q = {
  __name: "AgentJobs",
  setup(n) {
    const s = N(), { rows: e, failure: t, loaded: o, load: r } = x(`scheduled-job running --agent ${s.agent}`, ["scheduled_job.*"]), i = j(""), d = (c) => c.split(`
`)[0];
    function l(c) {
      const a = C(c.cron);
      return a ? `next at ${a.toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" })}` : "not due in the next 8 days";
    }
    function f(c) {
      const a = L(c.cron);
      return c.is_recurring || a.startsWith("once") ? a : `${a}, once`;
    }
    async function y(c) {
      const a = await s.run(["scheduled-job", "stop", String(c.id)]);
      i.value = a.ok ? "" : a.error, a.ok && r();
    }
    return (c, a) => (h(), b("div", T, [
      i.value ? (h(), b("p", V, p(i.value), 1)) : S("", !0),
      $(_(w), {
        rows: _(e),
        failure: _(t),
        loaded: _(o),
        empty: "The agent has scheduled nothing"
      }, {
        default: v(({ row: u }) => [
          m("div", {
            class: "agent-job",
            "data-job": u.job_id
          }, [
            m("div", O, [
              m("b", null, p(d(u.prompt)), 1),
              m("span", null, p(f(u)) + " · " + p(l(u)), 1)
            ]),
            $(_(D), {
              small: "",
              disabled: !!u.stop_requested_at,
              "data-job-stop": "",
              onClick: (H) => y(u)
            }, {
              default: v(() => [
                k(p(u.stop_requested_at ? "Stopping" : "Stop"), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onClick"])
          ], 8, W)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ]));
  }
}, G = /* @__PURE__ */ R(q, [["__scopeId", "data-v-f2adcd35"]]);
export {
  G as default
};
