/* @code-commandments-generated */
if (!document.getElementById("window-styles-338dfe0be23e")) { const style = document.createElement("style"); style.id = "window-styles-338dfe0be23e"; style.textContent = ".dump-dock[data-v-4cfda69f]{display:flex;gap:8px;font-size:12px;line-height:1.45}.dump-dock-title[data-v-4cfda69f]{color:var(--text-4)}.dumps[data-v-405e9534]{display:flex;flex-direction:column;gap:12px}.dump[data-v-405e9534]{display:flex;flex-direction:column;gap:6px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.dump-title[data-v-405e9534]{margin:0;font-size:13px;font-weight:500}.dumps-more[data-v-405e9534]{align-self:flex-start;color:var(--text-3);background:none;border:0;cursor:pointer}.dump-brief[data-v-405e9534],.dumps-note[data-v-405e9534]{margin:0;color:var(--text-3);font-size:12px}.item[data-v-405e9534]{display:grid;grid-template-columns:64px 1fr;gap:2px 10px;padding:6px 0;border-top:1px solid var(--border)}.item-state[data-v-405e9534]{grid-row:span 3;align-self:start;color:var(--text-3);font-size:12px}.item-state.filed[data-v-405e9534]{color:var(--accent-text)}.item-state.failed[data-v-405e9534]{color:var(--danger)}.item-note[data-v-405e9534],.item-refs[data-v-405e9534]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as d, openBlock as s, createElementBlock as o, createBlock as x, unref as r, toDisplayString as l, createCommentVNode as c, createVNode as N, Fragment as k, renderList as y, createElementVNode as i, normalizeClass as g } from "vue";
import { useWindow as D, useListTools as S, Skeleton as C, ListTools as F } from "@journal/window-kit";
import { _ as T } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const $ = { class: "dumps" }, B = {
  key: 1,
  class: "dumps-note"
}, E = {
  key: 2,
  class: "dumps-note"
}, L = ["data-dump"], V = { class: "dump-title" }, R = { class: "dump-brief" }, j = ["data-item", "data-state"], z = { class: "item-text" }, A = {
  key: 0,
  class: "item-note"
}, I = {
  key: 1,
  class: "item-refs"
}, M = {
  __name: "DumpRows",
  setup(O) {
    const w = { new: "New", noted: "Noted", filed: "Filed", failed: "Failed" }, m = D(), n = d([]), u = d(""), p = d(!1), _ = d(0), f = S(n, { title: (e) => e.title || `Dump ${e.id}`, isOpen: (e) => !e.outcome });
    async function v() {
      const e = await m.read("dump board");
      u.value = e.ok ? "" : e.error, n.value = e.ok ? e.value.dumps : [], _.value = e.ok ? e.value.total : 0, p.value = !0;
    }
    async function b() {
      const e = await m.read(`dump board --before ${Math.min(...n.value.map((h) => h.id))}`);
      if (!e.ok) return void (u.value = e.error);
      n.value = [...n.value, ...e.value.dumps];
    }
    return m.follow(["dump.*", "dump_item.*"], v), v(), (e, h) => (s(), o("div", $, [
      p.value ? u.value ? (s(), o("p", B, l(u.value), 1)) : n.value.length ? c("", !0) : (s(), o("p", E, "No dumps")) : (s(), x(r(C), {
        key: 0,
        shape: "cards"
      })),
      N(r(F), { tools: r(f) }, null, 8, ["tools"]),
      (s(!0), o(k, null, y(r(f).shown.value, (a) => (s(), o("section", {
        key: a.id,
        class: "dump",
        "data-dump": a.id
      }, [
        i("h3", V, l(a.title || `Dump ${a.id}`), 1),
        i("p", R, l(a.outcome ? `Closed: ${a.outcome}` : a.brief), 1),
        (s(!0), o(k, null, y(a.items, (t) => (s(), o("div", {
          key: t.id,
          class: "item",
          "data-item": t.id,
          "data-state": t.state
        }, [
          i("span", {
            class: g(["item-state", t.state])
          }, l(w[t.state] || t.state), 3),
          i("span", z, l(t.text), 1),
          t.summary || t.note ? (s(), o("span", A, l(t.summary || t.note), 1)) : c("", !0),
          t.refs.length ? (s(), o("span", I, "Filed into " + l(t.refs.join(", ")), 1)) : c("", !0)
        ], 8, j))), 128))
      ], 8, L))), 128)),
      n.value.length < _.value ? (s(), o("button", {
        key: 3,
        type: "button",
        class: "dumps-more",
        onClick: b
      }, "Show more")) : c("", !0)
    ]));
  }
}, H = /* @__PURE__ */ T(M, [["__scopeId", "data-v-405e9534"]]);
export {
  H as default
};
