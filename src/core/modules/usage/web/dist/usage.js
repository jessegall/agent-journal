if (!document.getElementById("window-styles-9259c4f8cef4")) { const style = document.createElement("style"); style.id = "window-styles-9259c4f8cef4"; style.textContent = ".current[data-v-2e50afc3]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-2e50afc3]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-2e50afc3]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-2e50afc3]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-2e50afc3]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-2e50afc3]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-2e50afc3]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-52b7a0da]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-52b7a0da]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-52b7a0da]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-52b7a0da]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-52b7a0da]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-52b7a0da]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-52b7a0da]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-1b832570]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-1b832570]{margin:0;font-weight:600}.fitness-measure[data-v-1b832570]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-1b832570]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-046f30aa]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-046f30aa]{margin:0;font-weight:600}.load-row[data-v-046f30aa]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-046f30aa]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-b9f679c6]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-b9f679c6]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-b9f679c6]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-b9f679c6]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-b9f679c6]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-b9f679c6]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.limit-form[data-v-b9f679c6]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr) 64px auto;gap:6px;padding:8px 0}.limit-form select[data-v-b9f679c6],.limit-form .percent[data-v-b9f679c6]{box-sizing:border-box;width:100%;min-width:0}.limit-form .current[data-v-b9f679c6]{grid-column:1 / -1;padding:0}.none[data-v-b9f679c6]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as v, ref as f, openBlock as a, createBlock as R, unref as n, withCtx as g, createElementVNode as l, createElementBlock as s, toDisplayString as r, createCommentVNode as w, Fragment as b, renderList as S, normalizeStyle as T, withDirectives as V, vModelSelect as $, createVNode as _, createTextVNode as N } from "vue";
import { useWindow as W, useRunLine as E, WindowRoom as F, TextInput as I, Btn as U } from "@journal/window-kit";
import { _ as M } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const z = {
  key: 0,
  class: "none"
}, A = { class: "track" }, O = {
  class: "limit-form",
  "data-usage-limit-form": ""
}, j = {
  key: 0,
  class: "none",
  "data-usage-limit-failure": ""
}, q = {
  key: 1,
  class: "none"
}, G = {
  __name: "UsagePanel",
  setup(H) {
    const i = W(), { data: u, failure: y } = i.props.usage, k = v(() => {
      var t;
      return ((t = u.value) == null ? void 0 : t.windows) ?? [];
    }), C = v(() => {
      var t, e;
      return ((e = (t = i.props.limits) == null ? void 0 : t.rows) == null ? void 0 : e.value) ?? [];
    }), L = v(() => {
      var t, e, o;
      return ((o = (e = (t = u.value) == null ? void 0 : t.agents) == null ? void 0 : e[0]) == null ? void 0 : o.program) ?? "claude";
    }), d = f("5 hours"), m = f("fixed"), p = f("50"), { refusal: c, run: x } = E(() => i.reload("limits"));
    async function B() {
      const t = Number(p.value);
      if (i.readOnly || !(t > 0 && t <= 100)) {
        c.value = "Use a percent from 1 to 100.";
        return;
      }
      await x(["usage-limit", "set", L.value, d.value, m.value, String(t)]);
    }
    const P = (t) => x(["usage-limit", "delete", String(t.id)]), D = (t) => `${t.window}: ${t.mode === "fixed" ? "halt at" : "halt after"} ${t.percent}%${t.mode === "fixed" ? "" : " more than when it was set"}`, h = (t) => `Starts again ${new Date(t * 1e3).toLocaleString()}`;
    return (t, e) => (a(), R(n(F), { padding: "14px 16px" }, {
      default: g(() => [
        e[8] || (e[8] = l("p", { class: "current" }, "Plan allowance used", -1)),
        n(y) ? (a(), s("p", z, r(n(y)), 1)) : w("", !0),
        (a(!0), s(b, null, S(k.value, (o) => (a(), s("div", {
          key: o.title,
          class: "meter",
          "data-usage-meter": ""
        }, [
          l("span", null, r(o.title), 1),
          l("strong", null, r(Math.round(o.used_percent)) + "%", 1),
          l("span", A, [
            l("span", {
              style: T({ width: `${o.used_percent}%` })
            }, null, 4)
          ]),
          l("small", null, r(o.used_percent >= 100 ? `At the usage limit. ${h(o.reset_epoch_seconds)}` : h(o.reset_epoch_seconds)), 1)
        ]))), 128)),
        l("div", O, [
          e[6] || (e[6] = l("p", { class: "current" }, "Stop the agents at your own limit", -1)),
          V(l("select", {
            "onUpdate:modelValue": e[0] || (e[0] = (o) => d.value = o),
            "aria-label": "Window the limit counts"
          }, [...e[3] || (e[3] = [
            l("option", null, "5 hours", -1),
            l("option", null, "7 days", -1),
            l("option", null, "hour", -1)
          ])], 512), [
            [$, d.value]
          ]),
          V(l("select", {
            "onUpdate:modelValue": e[1] || (e[1] = (o) => m.value = o),
            "aria-label": "Type of limit"
          }, [...e[4] || (e[4] = [
            l("option", { value: "fixed" }, "halt at", -1),
            l("option", { value: "budget" }, "halt after more than", -1)
          ])], 512), [
            [$, m.value]
          ]),
          _(n(I), {
            modelValue: p.value,
            "onUpdate:modelValue": e[2] || (e[2] = (o) => p.value = o),
            class: "percent",
            type: "number",
            min: "1",
            max: "100",
            "aria-label": "Percent of the window"
          }, null, 8, ["modelValue"]),
          _(n(U), {
            small: "",
            onClick: B
          }, {
            default: g(() => [...e[5] || (e[5] = [
              N("Set limit", -1)
            ])]),
            _: 1
          }),
          n(c) ? (a(), s("p", j, r(n(c)), 1)) : w("", !0)
        ]),
        (a(!0), s(b, null, S(C.value, (o) => (a(), s("div", {
          key: o.id,
          class: "meter",
          "data-usage-limit": ""
        }, [
          l("span", null, r(D(o)), 1),
          _(n(U), {
            small: "",
            onClick: (J) => P(o)
          }, {
            default: g(() => [...e[7] || (e[7] = [
              N("Remove", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ]))), 128)),
        n(u) && !k.value.length ? (a(), s("p", q, "No current plan window has been reported here.")) : w("", !0)
      ]),
      _: 1
    }));
  }
}, Y = /* @__PURE__ */ M(G, [["__scopeId", "data-v-b9f679c6"]]);
export {
  Y as default
};
