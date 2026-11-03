/* @code-commandments-generated */
if (!document.getElementById("window-styles-e6bf493f174a")) { const style = document.createElement("style"); style.id = "window-styles-e6bf493f174a"; style.textContent = ".reminders[data-v-6f85f54c]{display:flex;flex-direction:column;gap:8px}.form[data-v-6f85f54c]{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.form>input[data-v-6f85f54c]{flex:1;min-width:200px}input[data-v-6f85f54c]{padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface, none);color:inherit;font:inherit}.row[data-v-6f85f54c]{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px}.text[data-v-6f85f54c]{flex:1;min-width:0}.note[data-v-6f85f54c]{color:var(--text-3);font-size:12px}.failure[data-v-6f85f54c]{margin:0;color:var(--bad, var(--text-2));font-size:12px}\n"; document.head.appendChild(style); }
import { reactive as R, computed as S, openBlock as k, createBlock as E, unref as o, withCtx as r, createElementVNode as i, withModifiers as N, withDirectives as u, vModelText as f, createTextVNode as a, vModelCheckbox as V, createVNode as _, createElementBlock as $, toDisplayString as v, createCommentVNode as w } from "vue";
import { useRows as D, WindowRoom as O, Btn as x, RowList as A, removed as C, added as M } from "@journal/window-kit";
const B = (m, c) => {
  const l = m.__vccOpts || m;
  for (const [p, d] of c)
    l[p] = d;
  return l;
}, U = {
  class: "reminders",
  "data-reminders": ""
}, I = { class: "note" }, j = { class: "note" }, L = { class: "note" }, T = {
  key: 0,
  class: "failure"
}, F = ["data-reminder"], W = { class: "text" }, q = { class: "note" }, z = {
  __name: "ReminderRows",
  setup(m) {
    const { rows: c, failure: l, loaded: p, act: d, actionFailure: b } = D("reminder list", ["reminder.*"]), t = R({ text: "", at: "", minutes: "", once: !1 }), y = S(() => t.text.trim() && (t.at || Number(t.minutes)));
    function g(n) {
      if (n.ended_at) return "Ended";
      const e = [];
      return n.due_at && e.push(`At ${new Date(n.due_at).toLocaleString()}`), n.interval_seconds && e.push(`Every ${Math.round(n.interval_seconds / 60)} minutes`), n.interval_tool_uses && e.push(`Every ${n.interval_tool_uses} tool uses`), n.interval_tasks && e.push(`Every ${n.interval_tasks} closed tasks`), n.single_use && e.push("once"), n.block_condition && e.push(`holds until ${n.block_condition}`), e.join(", ");
    }
    async function h() {
      const n = ["reminder", "make", t.text.trim(), ...t.at ? ["--at", new Date(t.at).toISOString()] : [], ...Number(t.minutes) ? ["--every-minutes", String(t.minutes)] : [], ...t.once ? ["--once"] : []], e = { id: `making-${Date.now()}`, text: t.text.trim(), ended_at: null, due_at: t.at ? new Date(t.at).toISOString() : null, interval_seconds: Number(t.minutes) * 60 || 0, single_use: t.once };
      (await d(n, M(e))).ok && Object.assign(t, { text: "", at: "", minutes: "", once: !1 });
    }
    return (n, e) => (k(), E(o(O), null, {
      default: r(() => [
        i("div", U, [
          i("form", {
            class: "form",
            "data-reminder-form": "",
            onSubmit: N(h, ["prevent"])
          }, [
            u(i("input", {
              "onUpdate:modelValue": e[0] || (e[0] = (s) => t.text = s),
              placeholder: "Reminder text",
              "aria-label": "Reminder text"
            }, null, 512), [
              [f, t.text]
            ]),
            i("label", I, [
              e[4] || (e[4] = a("At", -1)),
              u(i("input", {
                "onUpdate:modelValue": e[1] || (e[1] = (s) => t.at = s),
                type: "datetime-local",
                "aria-label": "At"
              }, null, 512), [
                [f, t.at]
              ])
            ]),
            i("label", j, [
              e[5] || (e[5] = a("Every minutes", -1)),
              u(i("input", {
                "onUpdate:modelValue": e[2] || (e[2] = (s) => t.minutes = s),
                type: "number",
                min: "1",
                "aria-label": "Every minutes"
              }, null, 512), [
                [f, t.minutes]
              ])
            ]),
            i("label", L, [
              u(i("input", {
                "onUpdate:modelValue": e[3] || (e[3] = (s) => t.once = s),
                type: "checkbox",
                "aria-label": "Once"
              }, null, 512), [
                [V, t.once]
              ]),
              e[6] || (e[6] = a(" Once", -1))
            ]),
            _(o(x), {
              small: "",
              kind: "primary",
              type: "submit",
              disabled: !y.value
            }, {
              default: r(() => [...e[7] || (e[7] = [
                a("Add", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ], 32),
          o(b) ? (k(), $("p", T, v(o(b)), 1)) : w("", !0),
          _(o(A), {
            rows: o(c),
            failure: o(l),
            loaded: o(p),
            empty: "No reminders yet",
            hint: "A reminder you set for the agent shows here with when it is due."
          }, {
            default: r(({ row: s }) => [
              i("div", {
                class: "row",
                "data-reminder": s.id
              }, [
                i("span", W, v(s.text), 1),
                i("span", q, v(g(s)), 1),
                _(o(x), {
                  small: "",
                  "data-reminder-remove": "",
                  onClick: (G) => o(d)(["reminder", "delete", String(s.id)], o(C)(s.id))
                }, {
                  default: r(() => [...e[8] || (e[8] = [
                    a("Remove", -1)
                  ])]),
                  _: 1
                }, 8, ["onClick"])
              ], 8, F)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ])
      ]),
      _: 1
    }));
  }
}, K = /* @__PURE__ */ B(z, [["__scopeId", "data-v-6f85f54c"]]);
export {
  K as default
};
