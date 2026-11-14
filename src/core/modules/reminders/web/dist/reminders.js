if (!document.getElementById("window-styles-8a7a0c38af18")) { const style = document.createElement("style"); style.id = "window-styles-8a7a0c38af18"; style.textContent = ".rule[data-v-7aae2810]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.holds[data-v-7aae2810]{flex:none;padding:0 6px;border:1px solid var(--warn);border-radius:999px;color:var(--warn);font-size:11px}.agent[data-v-7aae2810]{flex:none;margin-left:auto}.next[data-v-fc28fe47]{color:var(--text-3);font-size:12px;font-variant-numeric:tabular-nums;white-space:nowrap}.failure[data-v-fc28fe47]{margin:0;padding:6px var(--inset);color:var(--bad, var(--text-2));font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as d, createElementBlock as h, Fragment as T, createElementVNode as C, toDisplayString as w, unref as n, createCommentVNode as N, createVNode as u, computed as _, createBlock as f, withCtx as l, ref as p, createTextVNode as S } from "vue";
import { optionsOf as M, AgentBadge as L, Reader as q, useWindow as P, defaultFilter as G, applyFilter as K, ListReaderLayout as J, Skeleton as Y, PageHeader as z, Btn as Q, FilterBar as X, CreateDialog as Z, copying as ee, short as te, deleteItem as ne, removed as re, added as se } from "@journal/window-kit";
const ae = 60, D = 3600, oe = [["minutes", "Minutes"], ["tool_uses", "Tool uses"], ["tasks", "Closed tasks"], ["once", "Once"]];
function ie(e) {
  return e % D === 0 ? `Every ${e / D} h` : `Every ${Math.max(1, Math.round(e / ae))} min`;
}
function le(e) {
  const t = [];
  return e.interval_seconds && t.push("minutes"), e.interval_tool_uses && t.push("tool_uses"), e.interval_tasks && t.push("tasks"), (e.single_use || e.due_at) && t.push("once"), t;
}
function I(e) {
  const t = [];
  return e.interval_seconds && t.push(ie(e.interval_seconds)), e.interval_tool_uses && t.push(`Every ${e.interval_tool_uses} tool uses`), e.interval_tasks && t.push(e.interval_tasks === 1 ? "Each closed task" : `Every ${e.interval_tasks} closed tasks`), (e.single_use || e.due_at) && t.push("Once"), t.join(" · ") || "Never";
}
const de = (e, t) => e.toDateString() === t.toDateString();
function O(e, t = /* @__PURE__ */ new Date()) {
  const s = new Date(e), i = s.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return de(s, t) ? i : `${s.toLocaleDateString([], { day: "numeric", month: "short" })} ${i}`;
}
function A(e, t = /* @__PURE__ */ new Date()) {
  if (e.ended_at) return "";
  if (e.due_at) return O(e.due_at, t);
  if (e.interval_seconds) {
    const s = e.last_fired_at ?? e.created_at;
    return s ? O(new Date(new Date(s).getTime() + e.interval_seconds * 1e3), t) : "";
  }
  return e.interval_tool_uses ? `in ${e.interval_tool_uses} tool uses` : "";
}
const F = (e) => !!e.block_condition;
function ue(e) {
  return e.block_condition ? e.block_subject ? `Until ${e.block_condition}: ${e.block_subject}` : `Until ${e.block_condition}` : "No";
}
const k = "main agent", ce = (e) => [
  { key: "agent", label: "Agent", options: M(e, () => k), get: () => k },
  { key: "repeats", label: "Repeats", options: oe, get: le },
  { key: "holds", label: "Holds", options: [["holds", "Holds the agent"], ["free", "Does not hold"]], get: (t) => F(t) ? "holds" : "free" }
], H = (e, t) => {
  const s = e.__vccOpts || e;
  for (const [i, m] of t)
    s[i] = m;
  return s;
}, me = {
  class: "rule",
  "data-reminder-rule": ""
}, pe = {
  key: 0,
  class: "holds",
  "data-reminder-holds": ""
}, _e = {
  __name: "ReminderLine",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    return (t, s) => (d(), h(T, null, [
      C("span", me, w(n(I)(e.row)), 1),
      n(F)(e.row) ? (d(), h("span", pe, "Holds")) : N("", !0),
      u(n(L), {
        class: "agent",
        name: n(k),
        main: "",
        chip: "",
        "data-reminder-agent": ""
      }, null, 8, ["name"])
    ], 64));
  }
}, fe = /* @__PURE__ */ H(_e, [["__scopeId", "data-v-7aae2810"]]), he = {
  __name: "ReminderReader",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const t = e, s = _(() => [
      { name: "repeats", label: "Repeats", value: I(t.row) },
      { name: "holds", label: "Holds", value: ue(t.row) },
      { name: "next", label: "Next", value: A(t.row) || "Not timed" },
      t.row.last_fired_at ? { name: "last", label: "Last", value: t.row.last_fired_at, isTime: !0 } : { name: "last", label: "Last", value: "Never" }
    ]);
    return (i, m) => (d(), f(n(q), {
      title: e.row.text,
      number: String(e.row.id),
      facts: s.value,
      "data-reminder-reader": ""
    }, {
      agent: l(() => [
        u(n(L), {
          name: n(k),
          main: ""
        }, null, 8, ["name"])
      ]),
      _: 1
    }, 8, ["title", "number", "facts"]));
  }
}, ke = { minutes: "--every-minutes", tool_uses: "--every-tool-uses", tasks: "--every-tasks" }, ve = 60, c = (e) => e.repeat === "at", U = (e) => Number.isNaN(Date.parse(e)) ? "…" : new Date(e).toISOString(), ye = [
  { key: "text", label: "Reminder", kind: "area", required: !0, placeholder: "Check that the tests still pass" },
  { key: "repeat", label: "When", kind: "select", options: [["at", "At a time"], ["minutes", "Every few minutes"], ["tool_uses", "Every few tool uses"], ["tasks", "Every few closed tasks"]] },
  { key: "at", label: "At", required: !0, placeholder: "2026-11-14 16:00", help: "The date and the time, as 2026-11-14 16:00", when: c },
  { key: "every", label: "Every", kind: "number", required: !0, help: "How many minutes, tool uses or closed tasks pass between two reminders", when: (e) => !c(e) },
  { key: "once", label: "How often", kind: "select", options: [["no", "Keep repeating"], ["yes", "Only once"]], when: (e) => !c(e) }
];
function ge(e) {
  return c(e) ? Number.isNaN(Date.parse(e.at)) ? { at: "Write the time like 2026-11-14 16:00" } : {} : Number.isInteger(Number(e.every)) && Number(e.every) >= 1 ? {} : { every: "Use a whole number of 1 or more" };
}
function j(e) {
  const t = ["reminder", "make", e.text.trim()];
  return c(e) ? [...t, "--at", U(e.at)] : [...t, ke[e.repeat], String(Number(e.every)), ...e.once === "yes" ? ["--once"] : []];
}
function be(e) {
  const t = Number(e.every);
  return {
    id: `making-${Date.now()}`,
    text: e.text.trim(),
    created_at: (/* @__PURE__ */ new Date()).toISOString(),
    due_at: c(e) ? U(e.at) : null,
    interval_seconds: e.repeat === "minutes" ? t * ve : 0,
    interval_tool_uses: e.repeat === "tool_uses" ? t : 0,
    interval_tasks: e.repeat === "tasks" ? t : 0,
    single_use: e.once === "yes",
    block_condition: "",
    block_subject: "",
    last_fired_at: null,
    ended_at: null
  };
}
const we = (e) => `journal ${j(e).map((t) => /\s/.test(t) ? JSON.stringify(t) : t).join(" ")}`, Ne = {
  key: 1,
  class: "failure",
  role: "alert",
  "data-reminders-failure": ""
}, Re = {
  class: "next",
  "data-reminder-next": ""
}, xe = 460, $e = {
  __name: "ReminderRows",
  setup(e) {
    const t = P(), { rows: s, failure: i, loaded: m, act: R, actionFailure: x } = t.props.reminders, v = _(() => ce(s.value)), y = p(G(v.value)), g = p(""), $ = _(() => K(s.value, v.value, y.value, g.value, ["text"])), V = _(() => $.value.map((a) => ({ id: a.id, title: `${a.id} ${a.text}`, row: a }))), E = p(null), b = p(!1), B = async (a) => {
      const r = await R(j(a), se(be(a)));
      return r.ok ? r : { ok: !1, error: r.error };
    }, W = (a) => ({
      head: `Reminder ${a.id}`,
      items: [
        { label: "Copy text", group: "copy", run: ({ say: r }) => ee(a.row.text, te(a.row.text, 30), r) },
        ne({ name: `reminder ${a.id}`, remove: () => R(["reminder", "delete", String(a.id)], re(a.id)) })
      ]
    });
    return (a, r) => (d(), f(n(J), {
      chosen: E.value,
      "onUpdate:chosen": r[4] || (r[4] = (o) => E.value = o),
      items: V.value,
      "list-width": xe,
      place: W,
      "empty-title": "No reminders yet",
      "pick-line": "Choose a reminder",
      "data-reminders": ""
    }, {
      top: l(() => [
        u(n(z), {
          title: "Reminders",
          count: n(s).length
        }, {
          primary: l(() => [
            u(n(Q), {
              small: "",
              variant: "primary",
              "data-reminder-new": "",
              onClick: r[0] || (r[0] = (o) => b.value = !0)
            }, {
              default: l(() => [...r[5] || (r[5] = [
                S("New reminder", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["count"]),
        u(n(X), {
          modelValue: y.value,
          "onUpdate:modelValue": r[1] || (r[1] = (o) => y.value = o),
          words: g.value,
          "onUpdate:words": r[2] || (r[2] = (o) => g.value = o),
          fields: v.value,
          rows: n(s),
          shown: $.value.length,
          placeholder: "Search reminders"
        }, null, 8, ["modelValue", "words", "fields", "rows", "shown"]),
        b.value ? (d(), f(n(Z), {
          key: 0,
          title: "New reminder",
          submit: "Make the reminder",
          fields: n(ye),
          command: n(we),
          check: n(ge),
          run: B,
          onClose: r[3] || (r[3] = (o) => b.value = !1)
        }, null, 8, ["fields", "command", "check"])) : N("", !0),
        n(i) || n(x) ? (d(), h("p", Ne, w(n(i) || n(x)), 1)) : N("", !0)
      ]),
      empty: l(() => [
        n(m) ? (d(), h(T, { key: 1 }, [
          S("Reminders appear here with the time they come.")
        ], 64)) : (d(), f(n(Y), {
          key: 0,
          shape: "rows"
        }))
      ]),
      meta: l(({ item: o }) => [
        C("span", Re, w(n(A)(o.row)), 1)
      ]),
      line: l(({ item: o }) => [
        u(fe, {
          row: o.row
        }, null, 8, ["row"])
      ]),
      reader: l(({ item: o }) => [
        u(he, {
          row: o.row
        }, null, 8, ["row"])
      ]),
      _: 1
    }, 8, ["chosen", "items"]));
  }
}, De = /* @__PURE__ */ H($e, [["__scopeId", "data-v-fc28fe47"]]);
export {
  De as default
};
