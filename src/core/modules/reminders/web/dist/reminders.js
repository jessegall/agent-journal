/* @code-commandments-generated */
if (!document.getElementById("window-styles-b1175aac33a7")) { const style = document.createElement("style"); style.id = "window-styles-b1175aac33a7"; style.textContent = ".reminders[data-v-a7ffecd5]{display:flex;flex-direction:column;gap:8px}.form[data-v-a7ffecd5]{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.form>input[data-v-a7ffecd5]{flex:1;min-width:200px}input[data-v-a7ffecd5]{padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface, none);color:inherit;font:inherit}.row[data-v-a7ffecd5]{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px}.text[data-v-a7ffecd5]{flex:1;min-width:0}.note[data-v-a7ffecd5]{color:var(--text-3);font-size:12px}.failure[data-v-a7ffecd5]{margin:0;color:var(--bad, var(--text-2));font-size:12px}\n"; document.head.appendChild(style); }
import { reactive as S, computed as E, openBlock as x, createElementBlock as k, createElementVNode as i, withModifiers as N, withDirectives as r, vModelText as p, createTextVNode as a, vModelCheckbox as V, createVNode as f, unref as o, withCtx as _, toDisplayString as v, createCommentVNode as $ } from "vue";
import { useRows as D, Btn as y, RowList as O, removed as w, added as A } from "@journal/window-kit";
const C = (u, m) => {
  const l = u.__vccOpts || u;
  for (const [c, d] of m)
    l[c] = d;
  return l;
}, M = {
  class: "reminders",
  "data-reminders": ""
}, U = { class: "note" }, B = { class: "note" }, I = { class: "note" }, j = {
  key: 0,
  class: "failure"
}, L = ["data-reminder"], T = { class: "text" }, F = { class: "note" }, q = {
  __name: "ReminderRows",
  setup(u) {
    const { rows: m, failure: l, loaded: c, act: d, actionFailure: b } = D("reminder list", ["reminder.*"]), t = S({ text: "", at: "", minutes: "", once: !1 }), g = E(() => t.text.trim() && (t.at || Number(t.minutes)));
    function h(n) {
      if (n.ended_at) return "Ended";
      const e = [];
      return n.due_at && e.push(`At ${new Date(n.due_at).toLocaleString()}`), n.interval_seconds && e.push(`Every ${Math.round(n.interval_seconds / 60)} minutes`), n.interval_tool_uses && e.push(`Every ${n.interval_tool_uses} tool uses`), n.interval_tasks && e.push(`Every ${n.interval_tasks} closed tasks`), n.single_use && e.push("once"), n.block_condition && e.push(`holds until ${n.block_condition}`), e.join(", ");
    }
    async function R() {
      const n = ["reminder", "make", t.text.trim(), ...t.at ? ["--at", new Date(t.at).toISOString()] : [], ...Number(t.minutes) ? ["--every-minutes", String(t.minutes)] : [], ...t.once ? ["--once"] : []], e = { id: `making-${Date.now()}`, text: t.text.trim(), ended_at: null, due_at: t.at ? new Date(t.at).toISOString() : null, interval_seconds: Number(t.minutes) * 60 || 0, single_use: t.once };
      (await d(n, A(e))).ok && Object.assign(t, { text: "", at: "", minutes: "", once: !1 });
    }
    return (n, e) => (x(), k("div", M, [
      i("form", {
        class: "form",
        "data-reminder-form": "",
        onSubmit: N(R, ["prevent"])
      }, [
        r(i("input", {
          "onUpdate:modelValue": e[0] || (e[0] = (s) => t.text = s),
          placeholder: "Reminder text",
          "aria-label": "Reminder text"
        }, null, 512), [
          [p, t.text]
        ]),
        i("label", U, [
          e[4] || (e[4] = a("At", -1)),
          r(i("input", {
            "onUpdate:modelValue": e[1] || (e[1] = (s) => t.at = s),
            type: "datetime-local",
            "aria-label": "At"
          }, null, 512), [
            [p, t.at]
          ])
        ]),
        i("label", B, [
          e[5] || (e[5] = a("Every minutes", -1)),
          r(i("input", {
            "onUpdate:modelValue": e[2] || (e[2] = (s) => t.minutes = s),
            type: "number",
            min: "1",
            "aria-label": "Every minutes"
          }, null, 512), [
            [p, t.minutes]
          ])
        ]),
        i("label", I, [
          r(i("input", {
            "onUpdate:modelValue": e[3] || (e[3] = (s) => t.once = s),
            type: "checkbox",
            "aria-label": "Once"
          }, null, 512), [
            [V, t.once]
          ]),
          e[6] || (e[6] = a(" Once", -1))
        ]),
        f(o(y), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !g.value
        }, {
          default: _(() => [...e[7] || (e[7] = [
            a("Add", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32),
      o(b) ? (x(), k("p", j, v(o(b)), 1)) : $("", !0),
      f(o(O), {
        rows: o(m),
        failure: o(l),
        loaded: o(c),
        empty: "No reminders yet",
        hint: "A reminder you set for the agent shows here with when it is due."
      }, {
        default: _(({ row: s }) => [
          i("div", {
            class: "row",
            "data-reminder": s.id
          }, [
            i("span", T, v(s.text), 1),
            i("span", F, v(h(s)), 1),
            f(o(y), {
              small: "",
              "data-reminder-remove": "",
              onClick: (z) => o(d)(["reminder", "delete", String(s.id)], o(w)(s.id))
            }, {
              default: _(() => [...e[8] || (e[8] = [
                a("Remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ], 8, L)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ]));
  }
}, J = /* @__PURE__ */ C(q, [["__scopeId", "data-v-a7ffecd5"]]);
export {
  J as default
};
