/* @code-commandments-generated */
if (!document.getElementById("window-styles-28d4067fa510")) { const style = document.createElement("style"); style.id = "window-styles-28d4067fa510"; style.textContent = ".library[data-v-cee871b7]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-cee871b7]{display:flex;gap:10px;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border)}.library-search[data-v-cee871b7]{flex:1;min-width:0}.library-body[data-v-cee871b7]{display:grid;flex:1;grid-template-columns:minmax(240px,2fr) 3fr;min-height:0}.library-list[data-v-cee871b7]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-cee871b7]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-cee871b7]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-cee871b7]:hover,.library-row.chosen[data-v-cee871b7]{background:var(--hover)}.library-icon[data-v-cee871b7]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-cee871b7]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-cee871b7]{font-weight:600}.library-abstract[data-v-cee871b7]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-cee871b7],.library-age[data-v-cee871b7]{color:var(--text-3);font-size:12px}.library-reader[data-v-cee871b7]{overflow-y:auto;padding:20px 28px}.reader-title[data-v-cee871b7]{margin:0 0 6px;font-size:20px}.reader-abstract[data-v-cee871b7]{margin:0 0 18px;color:var(--text-2)}.reader-empty[data-v-cee871b7]{margin-top:120px;text-align:center}.reader-empty-title[data-v-cee871b7]{margin:0 0 6px;font-weight:500}.reader-empty-text[data-v-cee871b7],.library-note[data-v-cee871b7]{margin:0;color:var(--text-2)}.library-note[data-v-cee871b7]{padding:12px}\n"; document.head.appendChild(style); }
import { ref as m, computed as w, watch as V, openBlock as c, createElementBlock as u, createElementVNode as l, createVNode as f, unref as v, toDisplayString as i, createCommentVNode as C, Fragment as k, renderList as D, normalizeClass as M } from "vue";
import { useRows as L, TextInput as E, Segmented as R, Icon as O, TextDisplay as A } from "@journal/window-kit";
const B = 1440 * 60 * 1e3, P = [
  { key: "today", title: "Today", days: 1 },
  { key: "week", title: "Last 7 days", days: 7 },
  { key: "month", title: "Last 30 days", days: 30 },
  { key: "older", title: "Older", days: 1 / 0 }
];
function T(s, r) {
  const t = r.trim().toLowerCase();
  return t ? s.filter((e) => `${e.title} ${e.abstract}`.toLowerCase().includes(t)) : s;
}
function U(s, r) {
  const t = [...s];
  return r === "title" ? t.sort((e, a) => e.title.localeCompare(a.title)) : t.sort((e, a) => String(a.updated_at).localeCompare(String(e.updated_at)));
}
function j(s, r, t = Date.now()) {
  if (r === "title") return s.length ? [{ key: "all", title: "", rows: s }] : [];
  const e = P.map((a) => ({ ...a, rows: [] }));
  for (const a of s) {
    const y = (t - Date.parse(a.updated_at)) / B;
    e.find((_) => y < _.days).rows.push(a);
  }
  return e.filter((a) => a.rows.length);
}
function z(s, r = Date.now()) {
  const t = Math.max(0, Math.round((r - Date.parse(s)) / 6e4));
  return t < 60 ? `${t}m` : t < 1440 ? `${Math.round(t / 60)}h` : `${Math.round(t / 1440)}d`;
}
const F = (s, r) => {
  const t = s.__vccOpts || s;
  for (const [e, a] of r)
    t[e] = a;
  return t;
}, G = { class: "library" }, Y = { class: "library-bar" }, Z = { class: "library-body" }, q = { class: "library-list" }, H = {
  key: 0,
  class: "library-note"
}, J = {
  key: 1,
  class: "library-note"
}, K = {
  key: 0,
  class: "library-group"
}, Q = ["data-row", "onClick"], W = { class: "library-text" }, X = { class: "library-title" }, ee = { class: "library-abstract" }, te = { class: "library-ref" }, ae = { class: "library-age" }, se = { class: "library-reader" }, oe = { class: "reader-title" }, le = { class: "reader-abstract" }, re = {
  key: 1,
  class: "reader-empty"
}, ne = { class: "reader-empty-title" }, ie = {
  __name: "DocumentLibrary",
  setup(s) {
    const r = [
      { key: "doc", label: "Documents" },
      { key: "report", label: "Reports" }
    ], t = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], e = m("doc"), a = m("newest"), y = m(""), _ = m(null), p = m(null), S = L("doc list", ["doc.*"]), $ = L("report list", ["report.*"]), h = w(() => e.value === "doc" ? S : $), g = w(() => j(U(T(h.value.rows.value, y.value), a.value), a.value)), x = w(() => e.value === "doc" ? "Document" : "Report");
    async function I(b) {
      const o = await h.value.context.read(`${e.value} show ${b.id} --json`);
      return o.ok ? o.value : null;
    }
    function N(b) {
      _.value = b.id, I(b).then((o) => p.value = o);
    }
    return V(e, () => {
      _.value = null, p.value = null;
    }), (b, o) => (c(), u("div", G, [
      l("div", Y, [
        f(v(E), {
          modelValue: y.value,
          "onUpdate:modelValue": o[0] || (o[0] = (n) => y.value = n),
          icon: "search",
          class: "library-search",
          placeholder: "Search titles and abstracts"
        }, null, 8, ["modelValue"]),
        f(v(R), {
          options: r,
          value: e.value,
          onPick: o[1] || (o[1] = (n) => e.value = n)
        }, null, 8, ["value"]),
        f(v(R), {
          options: t,
          value: a.value,
          onPick: o[2] || (o[2] = (n) => a.value = n)
        }, null, 8, ["value"])
      ]),
      l("div", Z, [
        l("div", q, [
          h.value.failure.value ? (c(), u("p", H, i(h.value.failure.value), 1)) : h.value.loaded.value && !g.value.length ? (c(), u("p", J, i(y.value ? "Nothing matches the search" : `No ${r.find((n) => n.key === e.value).label.toLowerCase()} yet`), 1)) : C("", !0),
          (c(!0), u(k, null, D(g.value, (n) => (c(), u(k, {
            key: n.key
          }, [
            n.title ? (c(), u("h3", K, i(n.title), 1)) : C("", !0),
            (c(!0), u(k, null, D(n.rows, (d) => (c(), u("button", {
              key: d.id,
              type: "button",
              class: M(["library-row", { chosen: d.id === _.value }]),
              "data-row": d.id,
              onClick: (ce) => N(d)
            }, [
              f(v(O), {
                name: "file",
                class: "library-icon"
              }),
              l("span", W, [
                l("span", X, i(d.title), 1),
                l("span", ee, i(d.abstract), 1),
                l("span", te, i(x.value) + " " + i(d.id), 1)
              ]),
              l("span", ae, i(v(z)(d.updated_at)), 1)
            ], 10, Q))), 128))
          ], 64))), 128))
        ]),
        l("div", se, [
          p.value ? (c(), u(k, { key: 0 }, [
            l("h2", oe, i(p.value.title), 1),
            l("p", le, i(p.value.abstract), 1),
            f(v(A), {
              text: p.value.body,
              class: "reader-body"
            }, null, 8, ["text"])
          ], 64)) : (c(), u("div", re, [
            l("p", ne, "Choose a " + i(x.value.toLowerCase()) + " to read it here", 1),
            o[3] || (o[3] = l("p", { class: "reader-empty-text" }, "Choose one on the left to see its text here.", -1))
          ]))
        ])
      ])
    ]));
  }
}, ye = /* @__PURE__ */ F(ie, [["__scopeId", "data-v-cee871b7"]]);
export {
  ye as default
};
