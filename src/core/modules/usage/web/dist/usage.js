if (!document.getElementById("window-styles-a734fbe4e1f0")) { const style = document.createElement("style"); style.id = "window-styles-a734fbe4e1f0"; style.textContent = ".current[data-v-cc48d24a]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-cc48d24a]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-cc48d24a]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-cc48d24a]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-cc48d24a]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-cc48d24a]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-cc48d24a]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-e020b3e9]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-e020b3e9]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-e020b3e9]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-e020b3e9]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-e020b3e9]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-e020b3e9]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-e020b3e9]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-f3fd6de8]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-f3fd6de8]{margin:0;font-weight:600}.fitness-measure[data-v-f3fd6de8]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-f3fd6de8]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-9de62706]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-9de62706]{margin:0;font-weight:600}.load-row[data-v-9de62706]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-9de62706]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-39e57460]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-39e57460]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-39e57460]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-39e57460]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-39e57460]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-39e57460]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.limit-form[data-v-39e57460]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr) 64px auto;gap:6px;padding:8px 0}.limit-form select[data-v-39e57460],.limit-form .percent[data-v-39e57460]{box-sizing:border-box;width:100%;min-width:0}.limit-form .current[data-v-39e57460]{grid-column:1 / -1;padding:0}.none[data-v-39e57460]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as u, ref as _, openBlock as s, createBlock as T, unref as n, withCtx as k, createElementVNode as l, createElementBlock as o, toDisplayString as r, createCommentVNode as y, Fragment as h, renderList as x, normalizeStyle as F, withDirectives as N, vModelSelect as L, createVNode as S, createTextVNode as U } from "vue";
import { useWindow as O, useRunLine as R, WindowRoom as E, TextInput as z, Btn as C } from "@journal/window-kit";
import { _ as A } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const j = {
  key: 0,
  class: "none"
}, q = { class: "track" }, G = {
  class: "limit-form",
  "data-usage-limit-form": ""
}, H = {
  key: 0,
  class: "none",
  "data-usage-limit-failure": ""
}, J = {
  key: 1,
  class: "none"
}, K = {
  __name: "UsagePanel",
  setup(Q) {
    const i = O(), { data: m, failure: b } = i.props.usage, c = u(() => {
      var e;
      return ((e = m.value) == null ? void 0 : e.windows) ?? [];
    }), I = u(() => {
      var e, a;
      return ((a = (e = i.props.limits) == null ? void 0 : e.rows) == null ? void 0 : a.value) ?? [];
    }), W = u(() => {
      var e, a, t;
      return ((t = (a = (e = m.value) == null ? void 0 : e.agents) == null ? void 0 : a[0]) == null ? void 0 : t.program) ?? "claude";
    }), B = { "5 hours": ["5 hours", "hour"], "7 days": ["7 days"] }, p = u(() => c.value.flatMap((e) => B[e.title] ?? [])), v = _(""), d = u({ get: () => p.value.includes(v.value) ? v.value : p.value[0] ?? "", set: (e) => {
      v.value = e;
    } }), f = _("fixed"), g = _("50"), { refusal: w, run: V } = R(() => i.reload("limits"));
    async function D() {
      const e = Number(g.value);
      if (i.readOnly || !d.value || !(e > 0 && e <= 100)) {
        w.value = "Use a percent from 1 to 100.";
        return;
      }
      await V(["usage-limit", "set", W.value, d.value, f.value, String(e)]);
    }
    const M = (e) => V(["usage-limit", "delete", String(e.id)]), P = (e) => `${e.window}: ${e.mode === "fixed" ? "halt at" : "halt after"} ${e.percent}%${e.mode === "fixed" ? "" : " more than when it was set"}`, $ = (e) => `Starts again ${new Date(e * 1e3).toLocaleString()}`;
    return (e, a) => (s(), T(n(E), { padding: "14px 16px" }, {
      default: k(() => [
        a[7] || (a[7] = l("p", { class: "current" }, "Plan allowance used", -1)),
        n(b) ? (s(), o("p", j, r(n(b)), 1)) : y("", !0),
        (s(!0), o(h, null, x(c.value, (t) => (s(), o("div", {
          key: t.title,
          class: "meter",
          "data-usage-meter": ""
        }, [
          l("span", null, r(t.title), 1),
          l("strong", null, r(Math.round(t.used_percent)) + "%", 1),
          l("span", q, [
            l("span", {
              style: F({ width: `${t.used_percent}%` })
            }, null, 4)
          ]),
          l("small", null, r(t.used_percent >= 100 ? `At the usage limit. ${$(t.reset_epoch_seconds)}` : $(t.reset_epoch_seconds)), 1)
        ]))), 128)),
        l("div", G, [
          a[5] || (a[5] = l("p", { class: "current" }, "Stop the agents at your own limit", -1)),
          N(l("select", {
            "onUpdate:modelValue": a[0] || (a[0] = (t) => d.value = t),
            "aria-label": "Window the limit counts"
          }, [
            (s(!0), o(h, null, x(p.value, (t) => (s(), o("option", { key: t }, r(t), 1))), 128))
          ], 512), [
            [L, d.value]
          ]),
          N(l("select", {
            "onUpdate:modelValue": a[1] || (a[1] = (t) => f.value = t),
            "aria-label": "Type of limit"
          }, [...a[3] || (a[3] = [
            l("option", { value: "fixed" }, "halt at", -1),
            l("option", { value: "budget" }, "halt after more than", -1)
          ])], 512), [
            [L, f.value]
          ]),
          S(n(z), {
            modelValue: g.value,
            "onUpdate:modelValue": a[2] || (a[2] = (t) => g.value = t),
            class: "percent",
            type: "number",
            min: "1",
            max: "100",
            "aria-label": "Percent of the window"
          }, null, 8, ["modelValue"]),
          S(n(C), {
            small: "",
            onClick: D
          }, {
            default: k(() => [...a[4] || (a[4] = [
              U("Set limit", -1)
            ])]),
            _: 1
          }),
          n(w) ? (s(), o("p", H, r(n(w)), 1)) : y("", !0)
        ]),
        (s(!0), o(h, null, x(I.value, (t) => (s(), o("div", {
          key: t.id,
          class: "meter",
          "data-usage-limit": ""
        }, [
          l("span", null, r(P(t)), 1),
          S(n(C), {
            small: "",
            onClick: (X) => M(t)
          }, {
            default: k(() => [...a[6] || (a[6] = [
              U("Remove", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ]))), 128)),
        n(m) && !c.value.length ? (s(), o("p", J, "No current plan window has been reported here.")) : y("", !0)
      ]),
      _: 1
    }));
  }
}, te = /* @__PURE__ */ A(K, [["__scopeId", "data-v-39e57460"]]);
export {
  te as default
};
