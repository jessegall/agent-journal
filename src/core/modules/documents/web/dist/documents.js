/* @code-commandments-generated */
if (!document.getElementById("window-styles-eb3b03102f00")) { const style = document.createElement("style"); style.id = "window-styles-eb3b03102f00"; style.textContent = ".library[data-v-26c89ba8]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-26c89ba8]{display:flex;gap:10px;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border)}.library-search[data-v-26c89ba8]{flex:1;min-width:0}.library-body[data-v-26c89ba8]{display:grid;flex:1;grid-template-columns:minmax(240px,2fr) 3fr;min-height:0}.library-list[data-v-26c89ba8]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-26c89ba8]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-26c89ba8]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-26c89ba8]:hover,.library-row.chosen[data-v-26c89ba8]{background:var(--hover)}.library-icon[data-v-26c89ba8]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-26c89ba8]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-26c89ba8]{font-weight:600}.library-abstract[data-v-26c89ba8]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-26c89ba8],.library-age[data-v-26c89ba8]{color:var(--text-3);font-size:12px}.library-reader[data-v-26c89ba8]{overflow-y:auto;padding:20px 28px}.reader-title[data-v-26c89ba8]{margin:0 0 6px;font-size:20px}.reader-abstract[data-v-26c89ba8]{margin:0 0 18px;color:var(--text-2)}.reader-empty[data-v-26c89ba8]{margin-top:120px;text-align:center}.reader-empty-title[data-v-26c89ba8]{margin:0 0 6px;font-weight:500}.reader-empty-text[data-v-26c89ba8],.library-more[data-v-26c89ba8]{margin:8px 12px;color:var(--muted);background:none;border:0;cursor:pointer}.library-note[data-v-26c89ba8]{margin:0;color:var(--text-2)}.library-note[data-v-26c89ba8]{padding:12px}\n"; document.head.appendChild(style); }
import { ref as y, computed as R, watch as E, openBlock as i, createElementBlock as c, createElementVNode as r, createVNode as f, unref as h, createBlock as O, toDisplayString as d, createCommentVNode as D, Fragment as x, renderList as I, normalizeClass as A } from "vue";
import { useWindow as P, TextInput as T, Segmented as M, Skeleton as U, Icon as j, TextDisplay as z } from "@journal/window-kit";
const F = 1440 * 60 * 1e3, G = [
  { key: "today", title: "Today", days: 1 },
  { key: "week", title: "Last 7 days", days: 7 },
  { key: "month", title: "Last 30 days", days: 30 },
  { key: "older", title: "Older", days: 1 / 0 }
];
function W(l, n) {
  const a = n.trim().toLowerCase();
  return a ? l.filter((t) => `${t.title} ${t.abstract}`.toLowerCase().includes(a)) : l;
}
function Y(l, n) {
  const a = [...l];
  return n === "title" ? a.sort((t, o) => t.title.localeCompare(o.title)) : a.sort((t, o) => String(o.updated_at).localeCompare(String(t.updated_at)));
}
function Z(l, n, a = Date.now()) {
  if (n === "title") return l.length ? [{ key: "all", title: "", rows: l }] : [];
  const t = G.map((o) => ({ ...o, rows: [] }));
  for (const o of l) {
    const p = (a - Date.parse(o.updated_at)) / F;
    t.find((m) => p < m.days).rows.push(o);
  }
  return t.filter((o) => o.rows.length);
}
function q(l, n = Date.now()) {
  const a = Math.max(0, Math.round((n - Date.parse(l)) / 6e4));
  return a < 60 ? `${a}m` : a < 1440 ? `${Math.round(a / 60)}h` : `${Math.round(a / 1440)}d`;
}
const H = (l, n) => {
  const a = l.__vccOpts || l;
  for (const [t, o] of n)
    a[t] = o;
  return a;
}, J = { class: "library" }, K = { class: "library-bar" }, Q = { class: "library-body" }, X = { class: "library-list" }, ee = {
  key: 1,
  class: "library-note"
}, te = {
  key: 2,
  class: "library-note"
}, ae = {
  key: 0,
  class: "library-group"
}, oe = ["data-row", "onClick"], le = { class: "library-text" }, se = { class: "library-title" }, re = { class: "library-abstract" }, ne = { class: "library-ref" }, ie = { class: "library-age" }, ue = { class: "library-reader" }, ce = { class: "reader-title" }, de = { class: "reader-abstract" }, ye = {
  key: 1,
  class: "reader-empty"
}, ve = { class: "reader-empty-title" }, pe = {
  __name: "DocumentLibrary",
  setup(l) {
    const n = [
      { key: "doc", label: "Documents" },
      { key: "report", label: "Reports" }
    ], a = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], t = y("doc"), o = y("newest"), p = y(""), m = y(null), b = y(null), k = P(), _ = y([]), $ = y(0), w = y(""), g = y(!1), S = R(() => Z(Y(W(_.value, p.value), o.value), o.value)), L = R(() => t.value === "doc" ? "Document" : "Report");
    async function C() {
      const u = t.value, e = await k.read(`document library --kind ${u}`);
      u === t.value && (w.value = e.ok ? "" : e.error, _.value = e.ok ? e.value.rows : [], $.value = e.ok ? e.value.total : 0, g.value = !0);
    }
    async function N() {
      const u = t.value, e = await k.read(`document library --kind ${u} --after ${Math.max(..._.value.map((s) => s.id))}`);
      if (!e.ok) return void (w.value = e.error);
      u === t.value && (_.value = [..._.value, ...e.value.rows]);
    }
    async function V(u) {
      const e = await k.read(`${t.value} show ${u.id} --json`);
      return e.ok ? e.value : null;
    }
    function B(u) {
      m.value = u.id, V(u).then((e) => b.value = e);
    }
    return E(t, () => {
      m.value = null, b.value = null, _.value = [], g.value = !1, C();
    }), k.follow(["doc.*", "report.*"], C), C(), (u, e) => (i(), c("div", J, [
      r("div", K, [
        f(h(T), {
          modelValue: p.value,
          "onUpdate:modelValue": e[0] || (e[0] = (s) => p.value = s),
          icon: "search",
          class: "library-search",
          placeholder: "Search titles and abstracts"
        }, null, 8, ["modelValue"]),
        f(h(M), {
          options: n,
          value: t.value,
          onPick: e[1] || (e[1] = (s) => t.value = s)
        }, null, 8, ["value"]),
        f(h(M), {
          options: a,
          value: o.value,
          onPick: e[2] || (e[2] = (s) => o.value = s)
        }, null, 8, ["value"])
      ]),
      r("div", Q, [
        r("div", X, [
          g.value ? w.value ? (i(), c("p", ee, d(w.value), 1)) : g.value && !S.value.length ? (i(), c("p", te, d(p.value ? "Nothing matches the search" : `No ${n.find((s) => s.key === t.value).label.toLowerCase()} yet`), 1)) : D("", !0) : (i(), O(h(U), {
            key: 0,
            shape: "cards"
          })),
          (i(!0), c(x, null, I(S.value, (s) => (i(), c(x, {
            key: s.key
          }, [
            s.title ? (i(), c("h3", ae, d(s.title), 1)) : D("", !0),
            (i(!0), c(x, null, I(s.rows, (v) => (i(), c("button", {
              key: v.id,
              type: "button",
              class: A(["library-row", { chosen: v.id === m.value }]),
              "data-row": v.id,
              onClick: (_e) => B(v)
            }, [
              f(h(j), {
                name: "file",
                class: "library-icon"
              }),
              r("span", le, [
                r("span", se, d(v.title), 1),
                r("span", re, d(v.abstract), 1),
                r("span", ne, d(L.value) + " " + d(v.id), 1)
              ]),
              r("span", ie, d(h(q)(v.updated_at)), 1)
            ], 10, oe))), 128))
          ], 64))), 128)),
          _.value.length < $.value && !p.value ? (i(), c("button", {
            key: 3,
            type: "button",
            class: "library-more",
            onClick: N
          }, "Show more")) : D("", !0)
        ]),
        r("div", ue, [
          b.value ? (i(), c(x, { key: 0 }, [
            r("h2", ce, d(b.value.title), 1),
            r("p", de, d(b.value.abstract), 1),
            f(h(z), {
              text: b.value.body,
              class: "reader-body"
            }, null, 8, ["text"])
          ], 64)) : (i(), c("div", ye, [
            r("p", ve, "Choose a " + d(L.value.toLowerCase()) + " to read it here", 1),
            e[3] || (e[3] = r("p", { class: "reader-empty-text" }, "Choose one on the left to see its text here.", -1))
          ]))
        ])
      ])
    ]));
  }
}, me = /* @__PURE__ */ H(pe, [["__scopeId", "data-v-26c89ba8"]]);
export {
  me as default
};
