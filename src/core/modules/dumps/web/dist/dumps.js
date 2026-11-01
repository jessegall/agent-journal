/* @code-commandments-generated */
if (!document.getElementById("window-styles-6729c0a8ab9f")) { const style = document.createElement("style"); style.id = "window-styles-6729c0a8ab9f"; style.textContent = ".dump-dock[data-v-4cfda69f]{display:flex;gap:8px;font-size:12px;line-height:1.45}.dump-dock-title[data-v-4cfda69f]{color:var(--text-4)}.dumps[data-v-89676c6a]{display:flex;flex-direction:column;gap:12px}.dump[data-v-89676c6a]{display:flex;flex-direction:column;gap:6px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.dump-title[data-v-89676c6a]{margin:0;font-size:13px;font-weight:500}.dump-brief[data-v-89676c6a],.dumps-note[data-v-89676c6a]{margin:0;color:var(--text-3);font-size:12px}.item[data-v-89676c6a]{display:grid;grid-template-columns:64px 1fr;gap:2px 10px;padding:6px 0;border-top:1px solid var(--border)}.item-state[data-v-89676c6a]{grid-row:span 3;align-self:start;color:var(--text-3);font-size:12px}.item-state.filed[data-v-89676c6a]{color:var(--accent-text)}.item-state.failed[data-v-89676c6a]{color:var(--danger)}.item-note[data-v-89676c6a],.item-refs[data-v-89676c6a]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as r, openBlock as s, createElementBlock as o, createBlock as y, unref as i, toDisplayString as a, createCommentVNode as m, Fragment as _, renderList as f, createElementVNode as n, normalizeClass as w } from "vue";
import { useRows as h, Skeleton as x } from "@journal/window-kit";
import { _ as N } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const g = { class: "dumps" }, D = {
  key: 1,
  class: "dumps-note"
}, F = {
  key: 2,
  class: "dumps-note"
}, S = ["data-dump"], B = { class: "dump-title" }, C = { class: "dump-brief" }, E = ["data-item", "data-state"], R = { class: "item-text" }, b = {
  key: 0,
  class: "item-note"
}, T = {
  key: 1,
  class: "item-refs"
}, V = {
  __name: "DumpRows",
  setup($) {
    const d = h("dump list", ["dump.*", "dump_item.*"]), p = h("dump-item list", ["dump_item.*"]), v = { new: "New", noted: "Noted", filed: "Filed", failed: "Failed" }, c = r(() => d.rows.value.map((l) => ({ dump: l, items: p.rows.value.filter((u) => u.dump_id === l.id).sort((u, t) => u.position - t.position) }))), k = r(() => d.loaded.value && p.loaded.value);
    return (l, u) => (s(), o("div", g, [
      k.value ? i(d).failure.value ? (s(), o("p", D, a(i(d).failure.value), 1)) : c.value.length ? m("", !0) : (s(), o("p", F, "No dumps")) : (s(), y(i(x), {
        key: 0,
        shape: "cards"
      })),
      (s(!0), o(_, null, f(c.value, (t) => (s(), o("section", {
        key: t.dump.id,
        class: "dump",
        "data-dump": t.dump.id
      }, [
        n("h3", B, a(t.dump.title || `Dump ${t.dump.id}`), 1),
        n("p", C, a(t.dump.outcome ? `Closed: ${t.dump.outcome}` : t.dump.brief), 1),
        (s(!0), o(_, null, f(t.items, (e) => (s(), o("div", {
          key: e.id,
          class: "item",
          "data-item": e.id,
          "data-state": e.state
        }, [
          n("span", {
            class: w(["item-state", e.state])
          }, a(v[e.state] || e.state), 3),
          n("span", R, a(e.text), 1),
          e.summary || e.note ? (s(), o("span", b, a(e.summary || e.note), 1)) : m("", !0),
          e.refs.length ? (s(), o("span", T, "Filed into " + a(e.refs.join(", ")), 1)) : m("", !0)
        ], 8, E))), 128))
      ], 8, S))), 128))
    ]));
  }
}, I = /* @__PURE__ */ N(V, [["__scopeId", "data-v-89676c6a"]]);
export {
  I as default
};
