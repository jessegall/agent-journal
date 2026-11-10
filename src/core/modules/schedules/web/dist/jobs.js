if (!document.getElementById("window-styles-d94e8c4c52fb")) { const style = document.createElement("style"); style.id = "window-styles-d94e8c4c52fb"; style.textContent = ".agent-jobs[data-v-c96dcf7f]{display:flex;flex-direction:column;gap:6px}.agent-jobs-refusal[data-v-c96dcf7f]{margin:0;color:var(--danger);font-size:12.5px}.agent-job[data-v-c96dcf7f]{display:flex;flex:1;gap:10px;align-items:center;min-width:0;padding:6px 0}.agent-job-text[data-v-c96dcf7f]{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0}.agent-job-text span[data-v-c96dcf7f]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as v, openBlock as h, createBlock as j, unref as l, withCtx as b, createElementVNode as _, createElementBlock as y, toDisplayString as m, createCommentVNode as S, createVNode as $, createTextVNode as k } from "vue";
import { useWindow as N, WindowRoom as x, RowList as w, Btn as D } from "@journal/window-kit";
const A = [
  [0, 59],
  [0, 23],
  [1, 31],
  [1, 12],
  [0, 6]
], B = 11520;
function E(s, [n, e]) {
  const t = /* @__PURE__ */ new Set();
  for (const r of s.split(",")) {
    const [o, c = "1"] = r.split("/"), [i, p] = o === "*" ? [n, e] : o.includes("-") ? o.split("-").map(Number) : [Number(o), c === "1" ? Number(o) : e];
    for (let f = i; f <= p; f += Number(c)) t.add(f);
  }
  return t;
}
function M(s) {
  const n = String(s || "").trim().split(/\s+/);
  return n.length === 5 ? n.map((e, t) => E(e, A[t])) : null;
}
function W(s, n = /* @__PURE__ */ new Date()) {
  const e = M(s);
  if (!e) return null;
  const t = new Date(n);
  t.setSeconds(0, 0);
  for (let r = 0; r < B; r++)
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
}, R = { class: "agent-jobs" }, V = {
  key: 0,
  class: "agent-jobs-refusal",
  role: "alert",
  "data-job-refusal": ""
}, O = ["data-job"], T = { class: "agent-job-text" }, q = {
  __name: "AgentJobs",
  setup(s) {
    const n = N();
    n.state["jobs.agent"] = String(n.agent);
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
        _("div", R, [
          o.value ? (h(), y("p", V, m(o.value), 1)) : S("", !0),
          $(l(w), {
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
                _("div", T, [
                  _("b", null, m(c(u.prompt)), 1),
                  _("span", null, m(p(u)) + " · " + m(i(u)), 1)
                ]),
                $(l(D), {
                  small: "",
                  disabled: !!u.stop_requested_at,
                  "data-job-stop": "",
                  onClick: (H) => f(u)
                }, {
                  default: b(() => [
                    k(m(u.stop_requested_at ? "Stopping" : "Stop"), 1)
                  ]),
                  _: 2
                }, 1032, ["disabled", "onClick"])
              ], 8, O)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ])
      ]),
      _: 1
    }));
  }
}, G = /* @__PURE__ */ L(q, [["__scopeId", "data-v-c96dcf7f"]]);
export {
  G as default
};
