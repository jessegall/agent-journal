/* @code-commandments-generated */
if (!document.getElementById("window-styles-d0e219c05149")) { const style = document.createElement("style"); style.id = "window-styles-d0e219c05149"; style.textContent = ".current[data-v-78349099]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-78349099]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-78349099]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-78349099]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-78349099]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-78349099]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-78349099]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-88e82b42]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-88e82b42]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-88e82b42]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-88e82b42]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-88e82b42]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-88e82b42]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-88e82b42]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-7beafc0d]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-7beafc0d]{margin:0;font-weight:600}.fitness-measure[data-v-7beafc0d]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-7beafc0d]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-27cf7d88]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-27cf7d88]{margin:0;font-weight:600}.load-row[data-v-27cf7d88]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-27cf7d88]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-de71da80]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-de71da80]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-de71da80]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-de71da80]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-de71da80]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-de71da80]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-de71da80]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as p, computed as f, onUnmounted as h, openBlock as s, createElementBlock as a, Fragment as _, createElementVNode as t, toDisplayString as l, createCommentVNode as i, renderList as k, normalizeStyle as y } from "vue";
import { useWindow as S } from "@journal/window-kit";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const I = {
  key: 0,
  class: "none"
}, w = { class: "track" }, x = {
  key: 1,
  class: "none"
}, L = 3e4, N = {
  __name: "UsagePanel",
  setup(D) {
    const m = S(), o = p(null), r = p(""), u = f(() => {
      var e;
      return ((e = o.value) == null ? void 0 : e.windows) ?? [];
    });
    async function c() {
      const e = await m.read("usage show");
      o.value = e.ok ? e.value : null, r.value = e.ok ? "" : e.error;
    }
    const v = (e) => `Starts again ${new Date(e * 1e3).toLocaleString()}`, g = setInterval(c, L);
    return h(() => clearInterval(g)), c(), (e, d) => (s(), a(_, null, [
      d[0] || (d[0] = t("p", { class: "current" }, "Plan allowance used", -1)),
      r.value ? (s(), a("p", I, l(r.value), 1)) : i("", !0),
      (s(!0), a(_, null, k(u.value, (n) => (s(), a("div", {
        key: n.title,
        class: "meter",
        "data-usage-meter": ""
      }, [
        t("span", null, l(n.title), 1),
        t("strong", null, l(Math.round(n.used_percent)) + "%", 1),
        t("span", w, [
          t("span", {
            style: y({ width: `${n.used_percent}%` })
          }, null, 4)
        ]),
        t("small", null, l(v(n.reset_epoch_seconds)), 1)
      ]))), 128)),
      o.value && !u.value.length ? (s(), a("p", x, "No current plan window has been reported here.")) : i("", !0)
    ], 64));
  }
}, C = /* @__PURE__ */ E(N, [["__scopeId", "data-v-de71da80"]]);
export {
  C as default
};
