if (!document.getElementById("window-styles-9b5750d71807")) { const style = document.createElement("style"); style.id = "window-styles-9b5750d71807"; style.textContent = ".current[data-v-2e50afc3]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-2e50afc3]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-2e50afc3]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-2e50afc3]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-2e50afc3]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-2e50afc3]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-2e50afc3]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-52b7a0da]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-52b7a0da]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-52b7a0da]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-52b7a0da]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-52b7a0da]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-52b7a0da]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-52b7a0da]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-1cfbcbe7]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-1cfbcbe7]{margin:0;font-weight:600}.fitness-measure[data-v-1cfbcbe7]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-1cfbcbe7]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-bf25ffc4]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-bf25ffc4]{margin:0;font-weight:600}.load-row[data-v-bf25ffc4]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-bf25ffc4]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-84d99a00]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-84d99a00]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-84d99a00]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-84d99a00]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-84d99a00]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-84d99a00]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.limit-form[data-v-84d99a00]{display:grid;grid-template-columns:1fr 1fr 5em auto;gap:6px;padding:8px 0}.limit-form .current[data-v-84d99a00]{grid-column:1 / -1;padding:0}.none[data-v-84d99a00]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as v, ref as f, openBlock as l, createBlock as M, unref as a, withCtx as g, createElementVNode as n, createElementBlock as s, toDisplayString as r, createCommentVNode as w, Fragment as b, renderList as S, normalizeStyle as R, withDirectives as _, vModelSelect as $, vModelText as T, createVNode as V, createTextVNode as N } from "vue";
import { useWindow as W, useRunLine as E, WindowRoom as F, Btn as U } from "@journal/window-kit";
import { _ as z } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const A = {
  key: 0,
  class: "none"
}, I = { class: "track" }, O = {
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
    }), d = f("5 hours"), m = f("fixed"), p = f(50), { refusal: c, run: x } = E(() => i.reload("limits"));
    async function B() {
      const t = Number(p.value);
      if (i.readOnly || !(t > 0 && t <= 100)) {
        c.value = "Use a percent from 1 to 100.";
        return;
      }
      await x(["usage-limit", "set", L.value, d.value, m.value, String(t)]);
    }
    const P = (t) => x(["usage-limit", "delete", String(t.id)]), D = (t) => `${t.window}: ${t.mode === "fixed" ? "halt at" : "halt after"} ${t.percent}%${t.mode === "fixed" ? "" : " more than when it was set"}`, h = (t) => `Starts again ${new Date(t * 1e3).toLocaleString()}`;
    return (t, e) => (l(), M(a(F), { padding: "14px 16px" }, {
      default: g(() => [
        e[8] || (e[8] = n("p", { class: "current" }, "Plan allowance used", -1)),
        a(y) ? (l(), s("p", A, r(a(y)), 1)) : w("", !0),
        (l(!0), s(b, null, S(k.value, (o) => (l(), s("div", {
          key: o.title,
          class: "meter",
          "data-usage-meter": ""
        }, [
          n("span", null, r(o.title), 1),
          n("strong", null, r(Math.round(o.used_percent)) + "%", 1),
          n("span", I, [
            n("span", {
              style: R({ width: `${o.used_percent}%` })
            }, null, 4)
          ]),
          n("small", null, r(o.used_percent >= 100 ? `At the usage limit. ${h(o.reset_epoch_seconds)}` : h(o.reset_epoch_seconds)), 1)
        ]))), 128)),
        n("div", O, [
          e[6] || (e[6] = n("p", { class: "current" }, "Stop the agents at your own limit", -1)),
          _(n("select", {
            "onUpdate:modelValue": e[0] || (e[0] = (o) => d.value = o),
            "aria-label": "Window the limit counts"
          }, [...e[3] || (e[3] = [
            n("option", null, "5 hours", -1),
            n("option", null, "7 days", -1),
            n("option", null, "hour", -1)
          ])], 512), [
            [$, d.value]
          ]),
          _(n("select", {
            "onUpdate:modelValue": e[1] || (e[1] = (o) => m.value = o),
            "aria-label": "Type of limit"
          }, [...e[4] || (e[4] = [
            n("option", { value: "fixed" }, "halt at", -1),
            n("option", { value: "budget" }, "halt after more than", -1)
          ])], 512), [
            [$, m.value]
          ]),
          _(n("input", {
            "onUpdate:modelValue": e[2] || (e[2] = (o) => p.value = o),
            type: "number",
            min: "1",
            max: "100",
            "aria-label": "Percent of the window"
          }, null, 512), [
            [T, p.value]
          ]),
          V(a(U), {
            small: "",
            onClick: B
          }, {
            default: g(() => [...e[5] || (e[5] = [
              N("Set limit", -1)
            ])]),
            _: 1
          }),
          a(c) ? (l(), s("p", j, r(a(c)), 1)) : w("", !0)
        ]),
        (l(!0), s(b, null, S(C.value, (o) => (l(), s("div", {
          key: o.id,
          class: "meter",
          "data-usage-limit": ""
        }, [
          n("span", null, r(D(o)), 1),
          V(a(U), {
            small: "",
            onClick: (J) => P(o)
          }, {
            default: g(() => [...e[7] || (e[7] = [
              N("Remove", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ]))), 128)),
        a(u) && !k.value.length ? (l(), s("p", q, "No current plan window has been reported here.")) : w("", !0)
      ]),
      _: 1
    }));
  }
}, Y = /* @__PURE__ */ z(G, [["__scopeId", "data-v-84d99a00"]]);
export {
  Y as default
};
