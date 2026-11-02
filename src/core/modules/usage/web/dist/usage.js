/* @code-commandments-generated */
if (!document.getElementById("window-styles-fbcd6b0a8e14")) { const style = document.createElement("style"); style.id = "window-styles-fbcd6b0a8e14"; style.textContent = ".current[data-v-78349099]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-78349099]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-78349099]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-78349099]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-78349099]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-78349099]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-78349099]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-ad2ed1da]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-ad2ed1da]{margin:0;font-weight:600}.fitness-measure[data-v-ad2ed1da]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-ad2ed1da]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-6f32bf1c]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-6f32bf1c]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-6f32bf1c]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-6f32bf1c]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-6f32bf1c]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-6f32bf1c]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-6f32bf1c]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as _, computed as h, onUnmounted as k, openBlock as n, createElementBlock as s, Fragment as d, createElementVNode as l, toDisplayString as o, createCommentVNode as p, renderList as m, normalizeStyle as y } from "vue";
import { useWindow as w } from "@journal/window-kit";
import { _ as S } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const x = {
  key: 0,
  class: "none"
}, C = { class: "track" }, E = {
  key: 1,
  class: "none"
}, I = {
  key: 2,
  class: "none"
}, N = 3e4, L = {
  __name: "UsagePanel",
  setup(b) {
    const v = w(), a = _(null), u = _(""), c = h(() => {
      var e;
      return ((e = a.value) == null ? void 0 : e.windows) ?? [];
    });
    async function i() {
      const e = await v.read("usage show");
      a.value = e.ok ? e.value : null, u.value = e.ok ? "" : e.error;
    }
    const g = (e) => `Starts again ${new Date(e * 1e3).toLocaleString()}`, f = setInterval(i, N);
    return k(() => clearInterval(f)), i(), (e, r) => (n(), s(d, null, [
      r[1] || (r[1] = l("p", { class: "current" }, "Plan allowance used", -1)),
      u.value ? (n(), s("p", x, o(u.value), 1)) : p("", !0),
      (n(!0), s(d, null, m(c.value, (t) => (n(), s("div", {
        key: t.title,
        class: "meter",
        "data-usage-meter": ""
      }, [
        l("span", null, o(t.title), 1),
        l("strong", null, o(Math.round(t.used_percent)) + "%", 1),
        l("span", C, [
          l("span", {
            style: y({ width: `${t.used_percent}%` })
          }, null, 4)
        ]),
        l("small", null, o(g(t.reset_epoch_seconds)), 1)
      ]))), 128)),
      (n(!0), s(d, null, m(c.value.length ? a.value.unreported_windows : [], (t) => (n(), s("div", {
        key: t,
        class: "meter",
        "data-usage-unreported": ""
      }, [
        l("span", null, o(t), 1),
        r[0] || (r[0] = l("small", null, "Claude Code has not reported this window", -1))
      ]))), 128)),
      a.value && !c.value.length ? (n(), s("p", E, "No current plan window has been reported here.")) : p("", !0),
      a.value ? (n(), s("p", I, "Cost of the open sessions: $" + o(Number(a.value.cost_dollars || 0).toFixed(2)), 1)) : p("", !0)
    ], 64));
  }
}, U = /* @__PURE__ */ S(L, [["__scopeId", "data-v-6f32bf1c"]]);
export {
  U as default
};
