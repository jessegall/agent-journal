/* @code-commandments-generated */
if (!document.getElementById("window-styles-eab3be241e1b")) { const style = document.createElement("style"); style.id = "window-styles-eab3be241e1b"; style.textContent = ".current[data-v-845f2d56]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-845f2d56]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-845f2d56]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-845f2d56]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-845f2d56]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-845f2d56]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-845f2d56]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-95096d06]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-95096d06]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-95096d06]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-95096d06]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-95096d06]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-95096d06]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-95096d06]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-78de9950]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-78de9950]{margin:0;font-weight:600}.fitness-measure[data-v-78de9950]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-78de9950]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-0038b75c]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-0038b75c]{margin:0;font-weight:600}.load-row[data-v-0038b75c]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-0038b75c]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-a6955edf]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-a6955edf]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-a6955edf]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-a6955edf]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-a6955edf]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-a6955edf]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-a6955edf]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as m, openBlock as s, createBlock as g, unref as a, withCtx as f, createElementVNode as e, createElementBlock as o, toDisplayString as r, createCommentVNode as d, Fragment as h, renderList as k, normalizeStyle as w } from "vue";
import { useWindow as x, WindowRoom as y } from "@journal/window-kit";
import { _ as v } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const S = {
  key: 0,
  class: "none"
}, B = { class: "track" }, N = {
  key: 1,
  class: "none"
}, P = {
  __name: "UsagePanel",
  setup(C) {
    const i = x(), { data: l, failure: c } = i.props.usage, u = m(() => {
      var t;
      return ((t = l.value) == null ? void 0 : t.windows) ?? [];
    }), _ = (t) => `Starts again ${new Date(t * 1e3).toLocaleString()}`;
    return (t, p) => (s(), g(a(y), { padding: "14px 16px" }, {
      default: f(() => [
        p[0] || (p[0] = e("p", { class: "current" }, "Plan allowance used", -1)),
        a(c) ? (s(), o("p", S, r(a(c)), 1)) : d("", !0),
        (s(!0), o(h, null, k(u.value, (n) => (s(), o("div", {
          key: n.title,
          class: "meter",
          "data-usage-meter": ""
        }, [
          e("span", null, r(n.title), 1),
          e("strong", null, r(Math.round(n.used_percent)) + "%", 1),
          e("span", B, [
            e("span", {
              style: w({ width: `${n.used_percent}%` })
            }, null, 4)
          ]),
          e("small", null, r(_(n.reset_epoch_seconds)), 1)
        ]))), 128)),
        a(l) && !u.value.length ? (s(), o("p", N, "No current plan window has been reported here.")) : d("", !0)
      ]),
      _: 1
    }));
  }
}, U = /* @__PURE__ */ v(P, [["__scopeId", "data-v-a6955edf"]]);
export {
  U as default
};
