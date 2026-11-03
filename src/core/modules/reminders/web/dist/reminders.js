/* @code-commandments-generated */
if (!document.getElementById("window-styles-00c20ac6898f")) { const style = document.createElement("style"); style.id = "window-styles-00c20ac6898f"; style.textContent = ".reminders[data-v-b6d07982]{display:flex;flex-direction:column;gap:8px}.form[data-v-b6d07982]{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.form>input[data-v-b6d07982]{flex:1;min-width:200px}input[data-v-b6d07982]{padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface, none);color:inherit;font:inherit}.row[data-v-b6d07982]{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px}.text[data-v-b6d07982]{flex:1;min-width:0}.note[data-v-b6d07982]{color:var(--text-3);font-size:12px}.failure[data-v-b6d07982]{margin:0;color:var(--bad, var(--text-2));font-size:12px}\n"; document.head.appendChild(style); }
import { reactive as E, computed as V, openBlock as k, createElementBlock as x, createElementVNode as i, withModifiers as N, withDirectives as d, vModelText as p, createTextVNode as a, vModelCheckbox as S, createVNode as f, unref as o, withCtx as _, toDisplayString as v, createCommentVNode as $ } from "vue";
import { useRows as A, Btn as y, RowList as C } from "@journal/window-kit";
const M = (u, m) => {
  const l = u.__vccOpts || u;
  for (const [c, r] of m)
    l[c] = r;
  return l;
}, O = {
  class: "reminders",
  "data-reminders": ""
}, w = { class: "note" }, D = { class: "note" }, U = { class: "note" }, B = {
  key: 0,
  class: "failure"
}, j = ["data-reminder"], I = { class: "text" }, L = { class: "note" }, T = {
  __name: "ReminderRows",
  setup(u) {
    const { rows: m, failure: l, loaded: c, act: r, actionFailure: b } = A("reminder list", ["reminder.*"]), t = E({ text: "", at: "", minutes: "", once: !1 }), h = V(() => t.text.trim() && (t.at || Number(t.minutes)));
    function g(n) {
      if (n.ended_at) return "Ended";
      const e = [];
      return n.due_at && e.push(`At ${new Date(n.due_at).toLocaleString()}`), n.interval_seconds && e.push(`Every ${Math.round(n.interval_seconds / 60)} minutes`), n.interval_tool_uses && e.push(`Every ${n.interval_tool_uses} tool uses`), n.interval_tasks && e.push(`Every ${n.interval_tasks} closed tasks`), n.single_use && e.push("once"), n.block_condition && e.push(`holds until ${n.block_condition}`), e.join(", ");
    }
    async function R() {
      const n = ["reminder", "make", t.text.trim(), ...t.at ? ["--at", new Date(t.at).toISOString()] : [], ...Number(t.minutes) ? ["--every-minutes", String(t.minutes)] : [], ...t.once ? ["--once"] : []];
      (await r(n)).ok && Object.assign(t, { text: "", at: "", minutes: "", once: !1 });
    }
    return (n, e) => (k(), x("div", O, [
      i("form", {
        class: "form",
        "data-reminder-form": "",
        onSubmit: N(R, ["prevent"])
      }, [
        d(i("input", {
          "onUpdate:modelValue": e[0] || (e[0] = (s) => t.text = s),
          placeholder: "Reminder text",
          "aria-label": "Reminder text"
        }, null, 512), [
          [p, t.text]
        ]),
        i("label", w, [
          e[4] || (e[4] = a("At", -1)),
          d(i("input", {
            "onUpdate:modelValue": e[1] || (e[1] = (s) => t.at = s),
            type: "datetime-local",
            "aria-label": "At"
          }, null, 512), [
            [p, t.at]
          ])
        ]),
        i("label", D, [
          e[5] || (e[5] = a("Every minutes", -1)),
          d(i("input", {
            "onUpdate:modelValue": e[2] || (e[2] = (s) => t.minutes = s),
            type: "number",
            min: "1",
            "aria-label": "Every minutes"
          }, null, 512), [
            [p, t.minutes]
          ])
        ]),
        i("label", U, [
          d(i("input", {
            "onUpdate:modelValue": e[3] || (e[3] = (s) => t.once = s),
            type: "checkbox",
            "aria-label": "Once"
          }, null, 512), [
            [S, t.once]
          ]),
          e[6] || (e[6] = a(" Once", -1))
        ]),
        f(o(y), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !h.value
        }, {
          default: _(() => [...e[7] || (e[7] = [
            a("Add", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32),
      o(b) ? (k(), x("p", B, v(o(b)), 1)) : $("", !0),
      f(o(C), {
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
            i("span", I, v(s.text), 1),
            i("span", L, v(g(s)), 1),
            f(o(y), {
              small: "",
              "data-reminder-remove": "",
              onClick: (F) => o(r)(["reminder", "delete", String(s.id)])
            }, {
              default: _(() => [...e[8] || (e[8] = [
                a("Remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ], 8, j)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ]));
  }
}, G = /* @__PURE__ */ M(T, [["__scopeId", "data-v-b6d07982"]]);
export {
  G as default
};
