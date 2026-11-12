if (!document.getElementById("window-styles-058eada9df5c")) { const style = document.createElement("style"); style.id = "window-styles-058eada9df5c"; style.textContent = ".agent-jobs[data-v-bc6f180b]{display:flex;flex-direction:column;gap:6px}.agent-jobs-refusal[data-v-bc6f180b]{margin:0;color:var(--danger);font-size:12.5px}.agent-job[data-v-bc6f180b]{display:flex;flex:1;gap:10px;align-items:center;min-width:0;padding:6px 0}.agent-job-text[data-v-bc6f180b]{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0}.agent-job-text span[data-v-bc6f180b]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as v, openBlock as h, createBlock as j, unref as l, withCtx as b, createElementVNode as _, createElementBlock as y, toDisplayString as m, createCommentVNode as S, createVNode as $, createTextVNode as k } from "vue";
import { useWindow as N, agentRowArgument as w, WindowRoom as x, RowList as D, Btn as A } from "@journal/window-kit";
const B = [
  [0, 59],
  [0, 23],
  [1, 31],
  [1, 12],
  [0, 6]
], E = 11520;
function M(s, [n, e]) {
  const t = /* @__PURE__ */ new Set();
  for (const r of s.split(",")) {
    const [o, c = "1"] = r.split("/"), [i, p] = o === "*" ? [n, e] : o.includes("-") ? o.split("-").map(Number) : [Number(o), c === "1" ? Number(o) : e];
    for (let f = i; f <= p; f += Number(c)) t.add(f);
  }
  return t;
}
function R(s) {
  const n = String(s || "").trim().split(/\s+/);
  return n.length === 5 ? n.map((e, t) => M(e, B[t])) : null;
}
function W(s, n = /* @__PURE__ */ new Date()) {
  const e = R(s);
  if (!e) return null;
  const t = new Date(n);
  t.setSeconds(0, 0);
  for (let r = 0; r < E; r++)
    if (t.setMinutes(t.getMinutes() + 1), [t.getMinutes(), t.getHours(), t.getDate(), t.getMonth() + 1, t.getDay()].every((c, i) => e[i].has(c))) return new Date(t);
  return null;
}
const g = (s) => String(s).padStart(2, "0");
function C(s) {
  const n = String(s || "").trim().split(/\s+/);
  if (n.length !== 5) return s || "";
  const [e, t, r, o, c] = n, i = r === "*" && o === "*" && c === "*";
  return i && t === "*" && e.startsWith("*/") ? `every ${e.slice(2)} minutes` : i && t === "*" && /^[\d,]+$/.test(e) ? `every hour at ${e.split(",").map((p) => `:${g(p)}`).join(", ")}` : i && /^\d+$/.test(t) && /^\d+$/.test(e) ? `every day at ${g(t)}:${g(e)}` : !i && /^\d+$/.test(r) && /^\d+$/.test(o) && /^\d+$/.test(t) && /^\d+$/.test(e) ? `once, on ${r}/${o} at ${g(t)}:${g(e)}` : s;
}
const L = (s, n) => {
  const e = s.__vccOpts || s;
  for (const [t, r] of n)
    e[t] = r;
  return e;
}, V = { class: "agent-jobs" }, O = {
  key: 0,
  class: "agent-jobs-refusal",
  role: "alert",
  "data-job-refusal": ""
}, T = ["data-job"], q = { class: "agent-job-text" }, H = {
  __name: "AgentJobs",
  setup(s) {
    const n = N();
    n.state["jobs.agent"] = w(n.agent);
    const { rows: e, failure: t, loaded: r } = n.props.jobs, o = v(""), c = (d) => d.split(`
`)[0];
    function i(d) {
      const a = W(d.cron);
      return a ? `next at ${a.toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit" })}` : "not due in the next 8 days";
    }
    function p(d) {
      const a = C(d.cron);
      return d.is_recurring || a.startsWith("once") ? a : `${a}, once`;
    }
    async function f(d) {
      const a = await n.run(["scheduled-job", "stop", String(d.id)]);
      o.value = a.ok ? "" : a.error, a.ok && n.reload("jobs");
    }
    return (d, a) => (h(), j(l(x), { padding: "14px 16px" }, {
      default: b(() => [
        _("div", V, [
          o.value ? (h(), y("p", O, m(o.value), 1)) : S("", !0),
          $(l(D), {
            rows: l(e),
            failure: l(t),
            loaded: l(r),
            empty: "No scheduled jobs",
            hint: "Scheduled jobs appear here."
          }, {
            default: b(({ row: u }) => [
              _("div", {
                class: "agent-job",
                "data-job": u.job_id
              }, [
                _("div", q, [
                  _("b", null, m(c(u.prompt)), 1),
                  _("span", null, m(p(u)) + " · " + m(i(u)), 1)
                ]),
                $(l(A), {
                  small: "",
                  disabled: !!u.stop_requested_at,
                  "data-job-stop": "",
                  onClick: (I) => f(u)
                }, {
                  default: b(() => [
                    k(m(u.stop_requested_at ? "Stopping" : "Stop"), 1)
                  ]),
                  _: 2
                }, 1032, ["disabled", "onClick"])
              ], 8, T)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ])
      ]),
      _: 1
    }));
  }
}, K = /* @__PURE__ */ L(H, [["__scopeId", "data-v-bc6f180b"]]);
export {
  K as default
};
