/* @code-commandments-generated */
if (!document.getElementById("window-styles-9826ffaeaa2d")) { const style = document.createElement("style"); style.id = "window-styles-9826ffaeaa2d"; style.textContent = ".agent-jobs[data-v-2ccda9b9]{display:flex;flex-direction:column;gap:6px}.agent-jobs-refusal[data-v-2ccda9b9]{margin:0;color:var(--danger);font-size:12.5px}.agent-job[data-v-2ccda9b9]{display:flex;flex:1;gap:10px;align-items:center;min-width:0;padding:6px 0}.agent-job-text[data-v-2ccda9b9]{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0}.agent-job-text span[data-v-2ccda9b9]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as y, openBlock as b, createBlock as j, unref as l, withCtx as h, createElementVNode as _, createElementBlock as S, toDisplayString as g, createCommentVNode as k, createVNode as $, createTextVNode as x } from "vue";
import { useWindow as w, useRows as N, WindowRoom as D, RowList as A, Btn as B } from "@journal/window-kit";
const E = [
  [0, 59],
  [0, 23],
  [1, 31],
  [1, 12],
  [0, 6]
], M = 11520;
function R(n, [s, e]) {
  const t = /* @__PURE__ */ new Set();
  for (const o of n.split(",")) {
    const [r, i = "1"] = o.split("/"), [d, f] = r === "*" ? [s, e] : r.includes("-") ? r.split("-").map(Number) : [Number(r), i === "1" ? Number(r) : e];
    for (let p = d; p <= f; p += Number(i)) t.add(p);
  }
  return t;
}
function W(n) {
  const s = String(n || "").trim().split(/\s+/);
  return s.length === 5 ? s.map((e, t) => R(e, E[t])) : null;
}
function C(n, s = /* @__PURE__ */ new Date()) {
  const e = W(n);
  if (!e) return null;
  const t = new Date(s);
  t.setSeconds(0, 0);
  for (let o = 0; o < M; o++)
    if (t.setMinutes(t.getMinutes() + 1), [t.getMinutes(), t.getHours(), t.getDate(), t.getMonth() + 1, t.getDay()].every((i, d) => e[d].has(i))) return new Date(t);
  return null;
}
const m = (n) => String(n).padStart(2, "0");
function L(n) {
  const s = String(n || "").trim().split(/\s+/);
  if (s.length !== 5) return n || "";
  const [e, t, o, r, i] = s, d = o === "*" && r === "*" && i === "*";
  return d && t === "*" && e.startsWith("*/") ? `every ${e.slice(2)} minutes` : d && t === "*" && /^[\d,]+$/.test(e) ? `every hour at ${e.split(",").map((f) => `:${m(f)}`).join(", ")}` : d && /^\d+$/.test(t) && /^\d+$/.test(e) ? `every day at ${m(t)}:${m(e)}` : !d && /^\d+$/.test(o) && /^\d+$/.test(r) && /^\d+$/.test(t) && /^\d+$/.test(e) ? `once, on ${o}/${r} at ${m(t)}:${m(e)}` : n;
}
const T = (n, s) => {
  const e = n.__vccOpts || n;
  for (const [t, o] of s)
    e[t] = o;
  return e;
}, V = { class: "agent-jobs" }, O = {
  key: 0,
  class: "agent-jobs-refusal",
  role: "alert",
  "data-job-refusal": ""
}, q = ["data-job"], H = { class: "agent-job-text" }, I = {
  __name: "AgentJobs",
  setup(n) {
    const s = w(), { rows: e, failure: t, loaded: o, load: r } = N(`scheduled-job running --agent ${s.agent}`, ["scheduled_job.*"]), i = y(""), d = (c) => c.split(`
`)[0];
    function f(c) {
      const a = C(c.cron);
      return a ? `next at ${a.toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" })}` : "not due in the next 8 days";
    }
    function p(c) {
      const a = L(c.cron);
      return c.is_recurring || a.startsWith("once") ? a : `${a}, once`;
    }
    async function v(c) {
      const a = await s.run(["scheduled-job", "stop", String(c.id)]);
      i.value = a.ok ? "" : a.error, a.ok && r();
    }
    return (c, a) => (b(), j(l(D), { padding: "14px 16px" }, {
      default: h(() => [
        _("div", V, [
          i.value ? (b(), S("p", O, g(i.value), 1)) : k("", !0),
          $(l(A), {
            rows: l(e),
            failure: l(t),
            loaded: l(o),
            empty: "The agent has scheduled nothing",
            hint: "A job the agent sets to run later shows here."
          }, {
            default: h(({ row: u }) => [
              _("div", {
                class: "agent-job",
                "data-job": u.job_id
              }, [
                _("div", H, [
                  _("b", null, g(d(u.prompt)), 1),
                  _("span", null, g(p(u)) + " · " + g(f(u)), 1)
                ]),
                $(l(B), {
                  small: "",
                  disabled: !!u.stop_requested_at,
                  "data-job-stop": "",
                  onClick: (J) => v(u)
                }, {
                  default: h(() => [
                    x(g(u.stop_requested_at ? "Stopping" : "Stop"), 1)
                  ]),
                  _: 2
                }, 1032, ["disabled", "onClick"])
              ], 8, q)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ])
      ]),
      _: 1
    }));
  }
}, U = /* @__PURE__ */ T(I, [["__scopeId", "data-v-2ccda9b9"]]);
export {
  U as default
};
