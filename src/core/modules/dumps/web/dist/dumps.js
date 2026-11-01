/* @code-commandments-generated */
if (!document.getElementById("window-styles-2aad83978f70")) { const style = document.createElement("style"); style.id = "window-styles-2aad83978f70"; style.textContent = ".dump-dock[data-v-4cfda69f]{display:flex;gap:8px;font-size:12px;line-height:1.45}.dump-dock-title[data-v-4cfda69f]{color:var(--text-4)}.dumps[data-v-b63cc409]{display:flex;flex-direction:column;gap:12px}.dump[data-v-b63cc409]{display:flex;flex-direction:column;gap:6px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.dump-title[data-v-b63cc409]{margin:0;font-size:13px;font-weight:500}.dumps-more[data-v-b63cc409]{align-self:flex-start;color:var(--text-3);background:none;border:0;cursor:pointer}.dump-brief[data-v-b63cc409],.dumps-note[data-v-b63cc409]{margin:0;color:var(--text-3);font-size:12px}.item[data-v-b63cc409]{display:grid;grid-template-columns:64px 1fr;gap:2px 10px;padding:6px 0;border-top:1px solid var(--border)}.item-state[data-v-b63cc409]{grid-row:span 3;align-self:start;color:var(--text-3);font-size:12px}.item-state.filed[data-v-b63cc409]{color:var(--accent-text)}.item-state.failed[data-v-b63cc409]{color:var(--danger)}.item-note[data-v-b63cc409],.item-refs[data-v-b63cc409]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as d, openBlock as s, createElementBlock as o, createBlock as w, unref as b, toDisplayString as l, createCommentVNode as r, Fragment as v, renderList as h, createElementVNode as c, normalizeClass as x } from "vue";
import { useWindow as g, Skeleton as N } from "@journal/window-kit";
import { _ as S } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const C = { class: "dumps" }, D = {
  key: 1,
  class: "dumps-note"
}, F = {
  key: 2,
  class: "dumps-note"
}, B = ["data-dump"], E = { class: "dump-title" }, $ = { class: "dump-brief" }, R = ["data-item", "data-state"], T = { class: "item-text" }, V = {
  key: 0,
  class: "item-note"
}, j = {
  key: 1,
  class: "item-refs"
}, z = {
  __name: "DumpRows",
  setup(A) {
    const k = { new: "New", noted: "Noted", filed: "Filed", failed: "Failed" }, i = g(), n = d([]), u = d(""), m = d(!1), p = d(0);
    async function _() {
      const t = await i.read("dump board");
      u.value = t.ok ? "" : t.error, n.value = t.ok ? t.value.dumps : [], p.value = t.ok ? t.value.total : 0, m.value = !0;
    }
    async function y() {
      const t = await i.read(`dump board --before ${Math.min(...n.value.map((f) => f.id))}`);
      if (!t.ok) return void (u.value = t.error);
      n.value = [...n.value, ...t.value.dumps];
    }
    return i.follow(["dump.*", "dump_item.*"], _), _(), (t, f) => (s(), o("div", C, [
      m.value ? u.value ? (s(), o("p", D, l(u.value), 1)) : n.value.length ? r("", !0) : (s(), o("p", F, "No dumps")) : (s(), w(b(N), {
        key: 0,
        shape: "cards"
      })),
      (s(!0), o(v, null, h(n.value, (a) => (s(), o("section", {
        key: a.id,
        class: "dump",
        "data-dump": a.id
      }, [
        c("h3", E, l(a.title || `Dump ${a.id}`), 1),
        c("p", $, l(a.outcome ? `Closed: ${a.outcome}` : a.brief), 1),
        (s(!0), o(v, null, h(a.items, (e) => (s(), o("div", {
          key: e.id,
          class: "item",
          "data-item": e.id,
          "data-state": e.state
        }, [
          c("span", {
            class: x(["item-state", e.state])
          }, l(k[e.state] || e.state), 3),
          c("span", T, l(e.text), 1),
          e.summary || e.note ? (s(), o("span", V, l(e.summary || e.note), 1)) : r("", !0),
          e.refs.length ? (s(), o("span", j, "Filed into " + l(e.refs.join(", ")), 1)) : r("", !0)
        ], 8, R))), 128))
      ], 8, B))), 128)),
      n.value.length < p.value ? (s(), o("button", {
        key: 3,
        type: "button",
        class: "dumps-more",
        onClick: y
      }, "Show more")) : r("", !0)
    ]));
  }
}, W = /* @__PURE__ */ S(z, [["__scopeId", "data-v-b63cc409"]]);
export {
  W as default
};
