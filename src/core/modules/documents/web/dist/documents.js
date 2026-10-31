/* @code-commandments-generated */
if (!document.getElementById("window-styles-b7eca9547063")) { const style = document.createElement("style"); style.id = "window-styles-b7eca9547063"; style.textContent = ".library[data-v-06134714]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-06134714]{display:flex;gap:10px;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border)}.library-search[data-v-06134714]{flex:1;min-width:0}.library-body[data-v-06134714]{display:grid;flex:1;grid-template-columns:minmax(240px,2fr) 3fr;min-height:0}.library-list[data-v-06134714]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-06134714]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-06134714]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-06134714]:hover,.library-row.chosen[data-v-06134714]{background:var(--hover)}.library-icon[data-v-06134714]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-06134714]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-06134714]{font-weight:600}.library-abstract[data-v-06134714]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-06134714],.library-age[data-v-06134714]{color:var(--text-3);font-size:12px}.library-reader[data-v-06134714]{overflow-y:auto;padding:20px 28px}.reader-title[data-v-06134714]{margin:0 0 6px;font-size:20px}.reader-abstract[data-v-06134714]{margin:0 0 18px;color:var(--text-2)}.reader-empty[data-v-06134714]{margin-top:120px;text-align:center}.reader-empty-title[data-v-06134714]{margin:0 0 6px;font-weight:500}.reader-empty-text[data-v-06134714],.library-note[data-v-06134714]{margin:0;color:var(--text-2)}.library-note[data-v-06134714]{padding:12px}\n"; document.head.appendChild(style); }
import { ref as b, computed as g, watch as N, openBlock as c, createElementBlock as u, createElementVNode as o, createVNode as m, unref as v, toDisplayString as i, createCommentVNode as C, Fragment as f, renderList as D, normalizeClass as V } from "vue";
import { useRows as L, TextInput as M, Segmented as S, Icon as E, TextDisplay as O } from "@journal/window-kit";
const A = 1440 * 60 * 1e3, B = [
  { key: "today", title: "Today", days: 1 },
  { key: "week", title: "Last 7 days", days: 7 },
  { key: "month", title: "Last 30 days", days: 30 },
  { key: "older", title: "Older", days: 1 / 0 }
];
function P(s, l) {
  const t = l.trim().toLowerCase();
  return t ? s.filter((e) => `${e.title} ${e.abstract}`.toLowerCase().includes(t)) : s;
}
function T(s, l) {
  const t = [...s];
  return l === "title" ? t.sort((e, a) => e.title.localeCompare(a.title)) : t.sort((e, a) => String(a.updated_at).localeCompare(String(e.updated_at)));
}
function U(s, l, t = Date.now()) {
  if (l === "title") return s.length ? [{ key: "all", title: "", rows: s }] : [];
  const e = B.map((a) => ({ ...a, rows: [] }));
  for (const a of s) {
    const y = (t - Date.parse(a.updated_at)) / A;
    e.find((_) => y < _.days).rows.push(a);
  }
  return e.filter((a) => a.rows.length);
}
function j(s, l = Date.now()) {
  const t = Math.max(0, Math.round((l - Date.parse(s)) / 6e4));
  return t < 60 ? `${t}m` : t < 1440 ? `${Math.round(t / 60)}h` : `${Math.round(t / 1440)}d`;
}
const z = (s, l) => {
  const t = s.__vccOpts || s;
  for (const [e, a] of l)
    t[e] = a;
  return t;
}, F = { class: "library" }, G = { class: "library-bar" }, Y = { class: "library-body" }, Z = { class: "library-list" }, q = {
  key: 0,
  class: "library-note"
}, H = {
  key: 1,
  class: "library-note"
}, J = {
  key: 0,
  class: "library-group"
}, K = ["data-row", "onClick"], Q = { class: "library-text" }, W = { class: "library-title" }, X = { class: "library-abstract" }, ee = { class: "library-ref" }, te = { class: "library-age" }, ae = { class: "library-reader" }, se = { class: "reader-title" }, oe = { class: "reader-abstract" }, le = {
  key: 1,
  class: "reader-empty"
}, re = { class: "reader-empty-title" }, ne = {
  __name: "DocumentLibrary",
  setup(s) {
    const l = [
      { key: "doc", label: "Documents" },
      { key: "report", label: "Reports" }
    ], t = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], e = b("doc"), a = b("newest"), y = b(""), _ = b(null), p = b(null), $ = L("doc list", ["doc.*"]), R = L("report list", ["report.*"]), h = g(() => e.value === "doc" ? $ : R), w = g(() => U(T(P(h.value.rows.value, y.value), a.value), a.value)), x = g(() => e.value === "doc" ? "Document" : "Report");
    async function I(k) {
      _.value = k.id;
      const n = await h.value.context.read(`${e.value} show ${k.id} --json`);
      p.value = n.ok ? n.value : null;
    }
    return N(e, () => {
      _.value = null, p.value = null;
    }), (k, n) => (c(), u("div", F, [
      o("div", G, [
        m(v(M), {
          modelValue: y.value,
          "onUpdate:modelValue": n[0] || (n[0] = (r) => y.value = r),
          icon: "search",
          class: "library-search",
          placeholder: "Search titles and abstracts"
        }, null, 8, ["modelValue"]),
        m(v(S), {
          options: l,
          value: e.value,
          onPick: n[1] || (n[1] = (r) => e.value = r)
        }, null, 8, ["value"]),
        m(v(S), {
          options: t,
          value: a.value,
          onPick: n[2] || (n[2] = (r) => a.value = r)
        }, null, 8, ["value"])
      ]),
      o("div", Y, [
        o("div", Z, [
          h.value.failure.value ? (c(), u("p", q, i(h.value.failure.value), 1)) : h.value.loaded.value && !w.value.length ? (c(), u("p", H, i(y.value ? "Nothing matches the search" : `No ${l.find((r) => r.key === e.value).label.toLowerCase()} yet`), 1)) : C("", !0),
          (c(!0), u(f, null, D(w.value, (r) => (c(), u(f, {
            key: r.key
          }, [
            r.title ? (c(), u("h3", J, i(r.title), 1)) : C("", !0),
            (c(!0), u(f, null, D(r.rows, (d) => (c(), u("button", {
              key: d.id,
              type: "button",
              class: V(["library-row", { chosen: d.id === _.value }]),
              "data-row": d.id,
              onClick: (ie) => I(d)
            }, [
              m(v(E), {
                name: "file",
                class: "library-icon"
              }),
              o("span", Q, [
                o("span", W, i(d.title), 1),
                o("span", X, i(d.abstract), 1),
                o("span", ee, i(x.value) + " " + i(d.id), 1)
              ]),
              o("span", te, i(v(j)(d.updated_at)), 1)
            ], 10, K))), 128))
          ], 64))), 128))
        ]),
        o("div", ae, [
          p.value ? (c(), u(f, { key: 0 }, [
            o("h2", se, i(p.value.title), 1),
            o("p", oe, i(p.value.abstract), 1),
            m(v(O), {
              text: p.value.body,
              class: "reader-body"
            }, null, 8, ["text"])
          ], 64)) : (c(), u("div", le, [
            o("p", re, "Choose a " + i(x.value.toLowerCase()) + " to read it here", 1),
            n[3] || (n[3] = o("p", { class: "reader-empty-text" }, "Choose one on the left to see its text here.", -1))
          ]))
        ])
      ])
    ]));
  }
}, de = /* @__PURE__ */ z(ne, [["__scopeId", "data-v-06134714"]]);
export {
  de as default
};
