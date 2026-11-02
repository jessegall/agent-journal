/* @code-commandments-generated */
if (!document.getElementById("window-styles-5a7357946aba")) { const style = document.createElement("style"); style.id = "window-styles-5a7357946aba"; style.textContent = ".current[data-v-78349099]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-78349099]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-78349099]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-78349099]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-78349099]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-78349099]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-78349099]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-7beafc0d]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-7beafc0d]{margin:0;font-weight:600}.fitness-measure[data-v-7beafc0d]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-7beafc0d]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-27cf7d88]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-27cf7d88]{margin:0;font-weight:600}.load-row[data-v-27cf7d88]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-27cf7d88]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-21b9065f]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-21b9065f]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-21b9065f]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-21b9065f]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-21b9065f]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-21b9065f]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-21b9065f]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as s, createElementBlock as t, unref as n, toDisplayString as a, createCommentVNode as i, Fragment as l, createElementVNode as r, renderList as p, createTextVNode as u } from "vue";
import { useWindow as m, useReadLine as h } from "@journal/window-kit";
import { _ as k } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const g = {
  class: "fitness",
  "data-fitness": ""
}, y = {
  key: 0,
  class: "fitness-note"
}, v = {
  class: "fitness-head",
  "data-fitness-head": ""
}, x = ["data-measure"], F = {
  __name: "FitnessPanel",
  setup(w) {
    const f = m(), { value: o, failure: d, load: _ } = h(() => `usage fitness --agent ${f.agent}`);
    return _(), (V, c) => (s(), t("div", g, [
      n(d) ? (s(), t("p", y, a(n(d)), 1)) : i("", !0),
      n(o) ? (s(), t(l, { key: 1 }, [
        r("p", v, a(n(o).is_measured ? `Fitness ${n(o).score} of 100` : "Fitness not measured yet: an agent is measured after its first half hour"), 1),
        (s(!0), t(l, null, p(n(o).measures, (e) => (s(), t("p", {
          key: e.key,
          class: "fitness-measure",
          "data-measure": e.key
        }, [
          r("span", null, a(e.label), 1),
          r("span", null, [
            u(a(e.value), 1),
            e.pass_level !== null ? (s(), t(l, { key: 0 }, [
              u(" of " + a(e.pass_level), 1)
            ], 64)) : i("", !0)
          ])
        ], 8, x))), 128)),
        c[0] || (c[0] = r("p", { class: "fitness-note" }, "Counts messages, waits and tasks. Version 4 also measured workers, merges and lines of code, which this version does not record.", -1))
      ], 64)) : i("", !0)
    ]));
  }
}, C = /* @__PURE__ */ k(F, [["__scopeId", "data-v-7beafc0d"]]);
export {
  C as default
};
