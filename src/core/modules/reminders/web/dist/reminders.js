if (!document.getElementById("window-styles-aed3b6890d27")) { const style = document.createElement("style"); style.id = "window-styles-aed3b6890d27"; style.textContent = ".reminders[data-v-f60e4569]{display:flex;flex-direction:column;gap:8px}.form[data-v-f60e4569]{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.form>input[data-v-f60e4569]{flex:1;min-width:200px}input[data-v-f60e4569]{padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface, none);color:inherit;font:inherit}.row[data-v-f60e4569]{display:flex;flex-wrap:wrap;align-items:center;gap:8px;padding:8px}.text[data-v-f60e4569]{flex:1;min-width:0}.note[data-v-f60e4569]{color:var(--text-3);font-size:12px}.failure[data-v-f60e4569]{margin:0;color:var(--bad, var(--text-2));font-size:12px}\n"; document.head.appendChild(style); }
import { reactive as R, computed as S, openBlock as x, createBlock as N, unref as a, withCtx as r, createElementVNode as i, withModifiers as V, withDirectives as u, vModelText as _, createTextVNode as o, vModelCheckbox as $, createVNode as f, createElementBlock as D, toDisplayString as v, createCommentVNode as E } from "vue";
import { useWindow as O, WindowRoom as C, Btn as k, RowList as I, removed as M, added as w } from "@journal/window-kit";
const A = (m, c) => {
  const l = m.__vccOpts || m;
  for (const [p, d] of c)
    l[p] = d;
  return l;
}, B = {
  class: "reminders",
  "data-reminders": ""
}, U = { class: "note" }, W = { class: "note" }, j = { class: "note" }, L = {
  key: 0,
  class: "failure"
}, T = ["data-reminder"], F = { class: "text" }, q = { class: "note" }, z = {
  __name: "ReminderRows",
  setup(m) {
    const { rows: c, failure: l, loaded: p, act: d, actionFailure: b } = O().props.reminders, t = R({ text: "", at: "", minutes: "", once: !1 }), y = S(() => t.text.trim() && (t.at || Number(t.minutes)));
    function g(n) {
      if (n.ended_at) return "Ended";
      const e = [];
      return n.due_at && e.push(`At ${new Date(n.due_at).toLocaleString()}`), n.interval_seconds && e.push(`Every ${Math.round(n.interval_seconds / 60)} minutes`), n.interval_tool_uses && e.push(`Every ${n.interval_tool_uses} tool uses`), n.interval_tasks && e.push(`Every ${n.interval_tasks} closed tasks`), n.single_use && e.push("once"), n.block_condition && e.push(`Waiting: ${n.block_condition}`), e.join(", ");
    }
    async function h() {
      const n = ["reminder", "make", t.text.trim(), ...t.at ? ["--at", new Date(t.at).toISOString()] : [], ...Number(t.minutes) ? ["--every-minutes", String(t.minutes)] : [], ...t.once ? ["--once"] : []], e = { id: `making-${Date.now()}`, text: t.text.trim(), ended_at: null, due_at: t.at ? new Date(t.at).toISOString() : null, interval_seconds: Number(t.minutes) * 60 || 0, single_use: t.once };
      (await d(n, w(e))).ok && Object.assign(t, { text: "", at: "", minutes: "", once: !1 });
    }
    return (n, e) => (x(), N(a(C), null, {
      default: r(() => [
        i("div", B, [
          i("form", {
            class: "form",
            "data-reminder-form": "",
            onSubmit: V(h, ["prevent"])
          }, [
            u(i("input", {
              "onUpdate:modelValue": e[0] || (e[0] = (s) => t.text = s),
              placeholder: "Reminder text",
              "aria-label": "Reminder text"
            }, null, 512), [
              [_, t.text]
            ]),
            i("label", U, [
              e[4] || (e[4] = o("At", -1)),
              u(i("input", {
                "onUpdate:modelValue": e[1] || (e[1] = (s) => t.at = s),
                type: "datetime-local",
                "aria-label": "At"
              }, null, 512), [
                [_, t.at]
              ])
            ]),
            i("label", W, [
              e[5] || (e[5] = o("Interval (minutes)", -1)),
              u(i("input", {
                "onUpdate:modelValue": e[2] || (e[2] = (s) => t.minutes = s),
                type: "number",
                min: "1",
                "aria-label": "Interval (minutes)"
              }, null, 512), [
                [_, t.minutes]
              ])
            ]),
            i("label", j, [
              u(i("input", {
                "onUpdate:modelValue": e[3] || (e[3] = (s) => t.once = s),
                type: "checkbox",
                "aria-label": "Once"
              }, null, 512), [
                [$, t.once]
              ]),
              e[6] || (e[6] = o(" Once", -1))
            ]),
            f(a(k), {
              small: "",
              variant: "primary",
              type: "submit",
              disabled: !y.value
            }, {
              default: r(() => [...e[7] || (e[7] = [
                o("Add", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ], 32),
          a(b) ? (x(), D("p", L, v(a(b)), 1)) : E("", !0),
          f(a(I), {
            rows: a(c),
            failure: a(l),
            loaded: a(p),
            empty: "No reminders yet",
            hint: "Reminders appear here with their scheduled times."
          }, {
            default: r(({ row: s }) => [
              i("div", {
                class: "row",
                "data-reminder": s.id
              }, [
                i("span", F, v(s.text), 1),
                i("span", q, v(g(s)), 1),
                f(a(k), {
                  small: "",
                  "data-reminder-remove": "",
                  onClick: (G) => a(d)(["reminder", "delete", String(s.id)], a(M)(s.id))
                }, {
                  default: r(() => [...e[8] || (e[8] = [
                    o("Remove", -1)
                  ])]),
                  _: 1
                }, 8, ["onClick"])
              ], 8, T)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ])
      ]),
      _: 1
    }));
  }
}, K = /* @__PURE__ */ A(z, [["__scopeId", "data-v-f60e4569"]]);
export {
  K as default
};
