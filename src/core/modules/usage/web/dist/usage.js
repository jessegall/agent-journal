/* @code-commandments-generated */
if (!document.getElementById("window-styles-04a13e104bec")) { const style = document.createElement("style"); style.id = "window-styles-04a13e104bec"; style.textContent = ".current[data-v-845f2d56]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-845f2d56]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-845f2d56]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-845f2d56]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-845f2d56]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-845f2d56]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-845f2d56]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-ef30dc1b]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-ef30dc1b]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-ef30dc1b]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-ef30dc1b]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-ef30dc1b]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-ef30dc1b]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-ef30dc1b]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-b55877dd]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-b55877dd]{margin:0;font-weight:600}.fitness-measure[data-v-b55877dd]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-b55877dd]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-fd584773]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-fd584773]{margin:0;font-weight:600}.load-row[data-v-fd584773]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-fd584773]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-bf472fbc]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-bf472fbc]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-bf472fbc]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-bf472fbc]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-bf472fbc]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-bf472fbc]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-bf472fbc]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as m, openBlock as n, createBlock as g, unref as a, withCtx as f, createElementVNode as e, createElementBlock as r, toDisplayString as o, createCommentVNode as d, Fragment as h, renderList as k, normalizeStyle as S } from "vue";
import { useUsage as v, usePoll as x, WindowRoom as y } from "@journal/window-kit";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const L = {
  key: 0,
  class: "none"
}, N = { class: "track" }, P = {
  key: 1,
  class: "none"
}, b = 3e4, w = {
  __name: "UsagePanel",
  setup(B) {
    const { value: l, failure: c, load: _ } = v(), u = m(() => {
      var t;
      return ((t = l.value) == null ? void 0 : t.windows) ?? [];
    }), i = (t) => `Starts again ${new Date(t * 1e3).toLocaleString()}`;
    return x(_, () => !0, b), (t, p) => (n(), g(a(y), { padding: "14px 16px" }, {
      default: f(() => [
        p[0] || (p[0] = e("p", { class: "current" }, "Plan allowance used", -1)),
        a(c) ? (n(), r("p", L, o(a(c)), 1)) : d("", !0),
        (n(!0), r(h, null, k(u.value, (s) => (n(), r("div", {
          key: s.title,
          class: "meter",
          "data-usage-meter": ""
        }, [
          e("span", null, o(s.title), 1),
          e("strong", null, o(Math.round(s.used_percent)) + "%", 1),
          e("span", N, [
            e("span", {
              style: S({ width: `${s.used_percent}%` })
            }, null, 4)
          ]),
          e("small", null, o(i(s.reset_epoch_seconds)), 1)
        ]))), 128)),
        a(l) && !u.value.length ? (n(), r("p", P, "No current plan window has been reported here.")) : d("", !0)
      ]),
      _: 1
    }));
  }
}, R = /* @__PURE__ */ E(w, [["__scopeId", "data-v-bf472fbc"]]);
export {
  R as default
};
