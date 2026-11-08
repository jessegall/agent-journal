/* @code-commandments-generated */
if (!document.getElementById("window-styles-7e1aa73b5368")) { const style = document.createElement("style"); style.id = "window-styles-7e1aa73b5368"; style.textContent = ".current[data-v-2e50afc3]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-2e50afc3]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-2e50afc3]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-2e50afc3]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-2e50afc3]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-2e50afc3]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-2e50afc3]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-52b7a0da]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-52b7a0da]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-52b7a0da]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-52b7a0da]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-52b7a0da]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-52b7a0da]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-52b7a0da]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-1cfbcbe7]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-1cfbcbe7]{margin:0;font-weight:600}.fitness-measure[data-v-1cfbcbe7]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-1cfbcbe7]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-bf25ffc4]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-bf25ffc4]{margin:0;font-weight:600}.load-row[data-v-bf25ffc4]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-bf25ffc4]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-c383dd48]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-c383dd48]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-c383dd48]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-c383dd48]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-c383dd48]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-c383dd48]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-c383dd48]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as m, openBlock as n, createBlock as g, unref as o, withCtx as w, createElementVNode as t, createElementBlock as r, toDisplayString as a, createCommentVNode as _, Fragment as h, renderList as f, normalizeStyle as k } from "vue";
import { useWindow as v, WindowRoom as x } from "@journal/window-kit";
import { _ as y } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const S = {
  key: 0,
  class: "none"
}, B = { class: "track" }, N = {
  key: 1,
  class: "none"
}, P = {
  __name: "UsagePanel",
  setup($) {
    const p = v(), { data: c, failure: l } = p.props.usage, d = m(() => {
      var s;
      return ((s = c.value) == null ? void 0 : s.windows) ?? [];
    }), u = (s) => `Starts again ${new Date(s * 1e3).toLocaleString()}`;
    return (s, i) => (n(), g(o(x), { padding: "14px 16px" }, {
      default: w(() => [
        i[0] || (i[0] = t("p", { class: "current" }, "Plan allowance used", -1)),
        o(l) ? (n(), r("p", S, a(o(l)), 1)) : _("", !0),
        (n(!0), r(h, null, f(d.value, (e) => (n(), r("div", {
          key: e.title,
          class: "meter",
          "data-usage-meter": ""
        }, [
          t("span", null, a(e.title), 1),
          t("strong", null, a(Math.round(e.used_percent)) + "%", 1),
          t("span", B, [
            t("span", {
              style: k({ width: `${e.used_percent}%` })
            }, null, 4)
          ]),
          t("small", null, a(e.used_percent >= 100 ? `At the usage limit. ${u(e.reset_epoch_seconds)}` : u(e.reset_epoch_seconds)), 1)
        ]))), 128)),
        o(c) && !d.value.length ? (n(), r("p", N, "No current plan window has been reported here.")) : _("", !0)
      ]),
      _: 1
    }));
  }
}, L = /* @__PURE__ */ y(P, [["__scopeId", "data-v-c383dd48"]]);
export {
  L as default
};
