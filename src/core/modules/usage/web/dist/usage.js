/* @code-commandments-generated */
if (!document.getElementById("window-styles-e326b0c6c681")) { const style = document.createElement("style"); style.id = "window-styles-e326b0c6c681"; style.textContent = ".current[data-v-2e50afc3]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-2e50afc3]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-2e50afc3]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-2e50afc3]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-2e50afc3]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-2e50afc3]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-2e50afc3]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-52b7a0da]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-52b7a0da]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-52b7a0da]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-52b7a0da]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-52b7a0da]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-52b7a0da]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-52b7a0da]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-1cfbcbe7]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-1cfbcbe7]{margin:0;font-weight:600}.fitness-measure[data-v-1cfbcbe7]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-1cfbcbe7]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-bf25ffc4]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-bf25ffc4]{margin:0;font-weight:600}.load-row[data-v-bf25ffc4]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-bf25ffc4]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-6274f07c]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-6274f07c]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-6274f07c]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-6274f07c]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-6274f07c]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-6274f07c]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-6274f07c]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as _, openBlock as o, createBlock as m, unref as e, withCtx as w, createElementVNode as n, createElementBlock as a, toDisplayString as r, createCommentVNode as p, Fragment as g, renderList as f, normalizeStyle as h } from "vue";
import { useWindow as k, WindowRoom as v } from "@journal/window-kit";
import { _ as x } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const y = {
  key: 0,
  class: "none"
}, S = { class: "track" }, B = {
  key: 1,
  class: "none"
}, N = {
  __name: "UsagePanel",
  setup(P) {
    const t = k(), { data: l, failure: c } = t.props.usage, u = _(() => {
      var s;
      return ((s = l.value) == null ? void 0 : s.windows) ?? [];
    }), i = (s) => `Starts again ${new Date(s * 1e3).toLocaleString()}`;
    return (s, d) => (o(), m(e(v), { padding: "14px 16px" }, {
      default: w(() => [
        d[0] || (d[0] = n("p", { class: "current" }, "Plan allowance used", -1)),
        e(c) ? (o(), a("p", y, r(e(c)), 1)) : p("", !0),
        (o(!0), a(g, null, f(u.value, (C) => (o(), a("div", {
          key: e(t).title,
          class: "meter",
          "data-usage-meter": ""
        }, [
          n("span", null, r(e(t).title), 1),
          n("strong", null, r(Math.round(e(t).used_percent)) + "%", 1),
          n("span", S, [
            n("span", {
              style: h({ width: `${e(t).used_percent}%` })
            }, null, 4)
          ]),
          n("small", null, r(i(e(t).reset_epoch_seconds)), 1)
        ]))), 128)),
        e(l) && !u.value.length ? (o(), a("p", B, "No current plan window has been reported here.")) : p("", !0)
      ]),
      _: 1
    }));
  }
}, U = /* @__PURE__ */ x(N, [["__scopeId", "data-v-6274f07c"]]);
export {
  U as default
};
