/* @code-commandments-generated */
if (!document.getElementById("window-styles-17fcedc2dc73")) { const style = document.createElement("style"); style.id = "window-styles-17fcedc2dc73"; style.textContent = ".current[data-v-cc48d24a]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-cc48d24a]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-cc48d24a]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-cc48d24a]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-cc48d24a]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-cc48d24a]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-cc48d24a]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-e020b3e9]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-e020b3e9]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-e020b3e9]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-e020b3e9]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-e020b3e9]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-e020b3e9]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-e020b3e9]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-917afa20]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-917afa20]{margin:0;font-weight:600}.fitness-measure[data-v-917afa20]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-917afa20]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-dce9407d]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-dce9407d]{margin:0;font-weight:600}.load-row[data-v-dce9407d]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-dce9407d]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-7da54535]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-7da54535]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-7da54535]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-7da54535]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-7da54535]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-7da54535]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.limit-form[data-v-7da54535]{display:grid;grid-template-columns:1fr 1fr 5em auto;gap:6px;padding:8px 0}.limit-form .current[data-v-7da54535]{grid-column:1 / -1;padding:0}.none[data-v-7da54535]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as f, ref as d, openBlock as n, createBlock as D, unref as r, withCtx as w, createElementVNode as a, createElementBlock as s, toDisplayString as i, createCommentVNode as g, Fragment as h, renderList as b, normalizeStyle as M, withDirectives as k, vModelSelect as S, vModelText as T, createVNode as $, createTextVNode as V } from "vue";
import { useWindow as W, WindowRoom as E, Btn as N } from "@journal/window-kit";
import { _ as F } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const R = {
  key: 0,
  class: "none"
}, z = { class: "track" }, A = {
  class: "limit-form",
  "data-usage-limit-form": ""
}, I = {
  key: 0,
  class: "none",
  "data-usage-limit-failure": ""
}, O = {
  key: 1,
  class: "none"
}, j = {
  __name: "UsagePanel",
  setup(q) {
    const l = W(), { data: m, failure: y } = l.props.usage, _ = f(() => {
      var t;
      return ((t = m.value) == null ? void 0 : t.windows) ?? [];
    }), U = f(() => {
      var t, e;
      return ((e = (t = l.props.limits) == null ? void 0 : t.rows) == null ? void 0 : e.value) ?? [];
    }), C = f(() => {
      var t, e, o;
      return ((o = (e = (t = m.value) == null ? void 0 : t.agents) == null ? void 0 : e[0]) == null ? void 0 : o.program) ?? "claude";
    }), p = d("5 hours"), c = d("fixed"), v = d(50), u = d("");
    async function B() {
      const t = Number(v.value);
      if (l.readOnly || !(t > 0 && t <= 100)) {
        u.value = "Use a percent from 1 to 100.";
        return;
      }
      const e = await l.run(["usage-limit", "set", C.value, p.value, c.value, String(t)]);
      u.value = e.ok ? "" : e.error, e.ok && await l.reload("limits");
    }
    async function L(t) {
      const e = await l.run(["usage-limit", "delete", String(t.id)]);
      u.value = e.ok ? "" : e.error, e.ok && await l.reload("limits");
    }
    const P = (t) => `${t.window}: ${t.mode === "fixed" ? "halt at" : "halt after"} ${t.percent}%${t.mode === "fixed" ? "" : " more than when it was set"}`, x = (t) => `Starts again ${new Date(t * 1e3).toLocaleString()}`;
    return (t, e) => (n(), D(r(E), { padding: "14px 16px" }, {
      default: w(() => [
        e[8] || (e[8] = a("p", { class: "current" }, "Plan allowance used", -1)),
        r(y) ? (n(), s("p", R, i(r(y)), 1)) : g("", !0),
        (n(!0), s(h, null, b(_.value, (o) => (n(), s("div", {
          key: o.title,
          class: "meter",
          "data-usage-meter": ""
        }, [
          a("span", null, i(o.title), 1),
          a("strong", null, i(Math.round(o.used_percent)) + "%", 1),
          a("span", z, [
            a("span", {
              style: M({ width: `${o.used_percent}%` })
            }, null, 4)
          ]),
          a("small", null, i(o.used_percent >= 100 ? `At the usage limit. ${x(o.reset_epoch_seconds)}` : x(o.reset_epoch_seconds)), 1)
        ]))), 128)),
        a("div", A, [
          e[6] || (e[6] = a("p", { class: "current" }, "Stop the agents at your own limit", -1)),
          k(a("select", {
            "onUpdate:modelValue": e[0] || (e[0] = (o) => p.value = o),
            "aria-label": "Window the limit counts"
          }, [...e[3] || (e[3] = [
            a("option", null, "5 hours", -1),
            a("option", null, "7 days", -1),
            a("option", null, "hour", -1)
          ])], 512), [
            [S, p.value]
          ]),
          k(a("select", {
            "onUpdate:modelValue": e[1] || (e[1] = (o) => c.value = o),
            "aria-label": "Type of limit"
          }, [...e[4] || (e[4] = [
            a("option", { value: "fixed" }, "halt at", -1),
            a("option", { value: "budget" }, "halt after more than", -1)
          ])], 512), [
            [S, c.value]
          ]),
          k(a("input", {
            "onUpdate:modelValue": e[2] || (e[2] = (o) => v.value = o),
            type: "number",
            min: "1",
            max: "100",
            "aria-label": "Percent of the window"
          }, null, 512), [
            [T, v.value]
          ]),
          $(r(N), {
            small: "",
            onClick: B
          }, {
            default: w(() => [...e[5] || (e[5] = [
              V("Set limit", -1)
            ])]),
            _: 1
          }),
          u.value ? (n(), s("p", I, i(u.value), 1)) : g("", !0)
        ]),
        (n(!0), s(h, null, b(U.value, (o) => (n(), s("div", {
          key: o.id,
          class: "meter",
          "data-usage-limit": ""
        }, [
          a("span", null, i(P(o)), 1),
          $(r(N), {
            small: "",
            onClick: (G) => L(o)
          }, {
            default: w(() => [...e[7] || (e[7] = [
              V("Remove", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ]))), 128)),
        r(m) && !_.value.length ? (n(), s("p", O, "No current plan window has been reported here.")) : g("", !0)
      ]),
      _: 1
    }));
  }
}, Q = /* @__PURE__ */ F(j, [["__scopeId", "data-v-7da54535"]]);
export {
  Q as default
};
