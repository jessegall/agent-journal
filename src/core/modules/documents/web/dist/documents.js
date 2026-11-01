/* @code-commandments-generated */
if (!document.getElementById("window-styles-9988080562b9")) { const style = document.createElement("style"); style.id = "window-styles-9988080562b9"; style.textContent = ".library[data-v-56391409]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-56391409]{display:flex;gap:10px;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border)}.library-search[data-v-56391409]{flex:1;min-width:0}.library-body[data-v-56391409]{display:grid;flex:1;grid-template-columns:minmax(240px,2fr) 3fr;min-height:0}.library-list[data-v-56391409]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-56391409]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-56391409]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-56391409]:hover,.library-row.chosen[data-v-56391409]{background:var(--hover)}.library-icon[data-v-56391409]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-56391409]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-56391409]{font-weight:600}.library-abstract[data-v-56391409]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-56391409],.library-age[data-v-56391409]{color:var(--text-3);font-size:12px}.library-reader[data-v-56391409]{overflow-y:auto;padding:20px 28px}.reader-title[data-v-56391409]{margin:0 0 6px;font-size:20px}.reader-abstract[data-v-56391409]{margin:0 0 18px;color:var(--text-2)}.reader-empty[data-v-56391409]{margin-top:120px;text-align:center}.reader-empty-title[data-v-56391409]{margin:0 0 6px;font-weight:500}.reader-empty-text[data-v-56391409],.library-note[data-v-56391409]{margin:0;color:var(--text-2)}.library-note[data-v-56391409]{padding:12px}\n"; document.head.appendChild(style); }
import { ref as m, computed as w, watch as V, openBlock as i, createElementBlock as u, createElementVNode as l, createVNode as f, unref as y, createBlock as M, toDisplayString as c, createCommentVNode as C, Fragment as k, renderList as D, normalizeClass as B } from "vue";
import { useRows as L, TextInput as E, Segmented as S, Skeleton as O, Icon as A, TextDisplay as P } from "@journal/window-kit";
const T = 1440 * 60 * 1e3, U = [
  { key: "today", title: "Today", days: 1 },
  { key: "week", title: "Last 7 days", days: 7 },
  { key: "month", title: "Last 30 days", days: 30 },
  { key: "older", title: "Older", days: 1 / 0 }
];
function j(s, r) {
  const t = r.trim().toLowerCase();
  return t ? s.filter((e) => `${e.title} ${e.abstract}`.toLowerCase().includes(t)) : s;
}
function z(s, r) {
  const t = [...s];
  return r === "title" ? t.sort((e, a) => e.title.localeCompare(a.title)) : t.sort((e, a) => String(a.updated_at).localeCompare(String(e.updated_at)));
}
function F(s, r, t = Date.now()) {
  if (r === "title") return s.length ? [{ key: "all", title: "", rows: s }] : [];
  const e = U.map((a) => ({ ...a, rows: [] }));
  for (const a of s) {
    const v = (t - Date.parse(a.updated_at)) / T;
    e.find((h) => v < h.days).rows.push(a);
  }
  return e.filter((a) => a.rows.length);
}
function G(s, r = Date.now()) {
  const t = Math.max(0, Math.round((r - Date.parse(s)) / 6e4));
  return t < 60 ? `${t}m` : t < 1440 ? `${Math.round(t / 60)}h` : `${Math.round(t / 1440)}d`;
}
const Y = (s, r) => {
  const t = s.__vccOpts || s;
  for (const [e, a] of r)
    t[e] = a;
  return t;
}, Z = { class: "library" }, q = { class: "library-bar" }, H = { class: "library-body" }, J = { class: "library-list" }, K = {
  key: 1,
  class: "library-note"
}, Q = {
  key: 2,
  class: "library-note"
}, W = {
  key: 0,
  class: "library-group"
}, X = ["data-row", "onClick"], ee = { class: "library-text" }, te = { class: "library-title" }, ae = { class: "library-abstract" }, se = { class: "library-ref" }, oe = { class: "library-age" }, le = { class: "library-reader" }, re = { class: "reader-title" }, ne = { class: "reader-abstract" }, ie = {
  key: 1,
  class: "reader-empty"
}, ce = { class: "reader-empty-title" }, ue = {
  __name: "DocumentLibrary",
  setup(s) {
    const r = [
      { key: "doc", label: "Documents" },
      { key: "report", label: "Reports" }
    ], t = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], e = m("doc"), a = m("newest"), v = m(""), h = m(null), p = m(null), R = L("doc list", ["doc.*"]), $ = L("report list", ["report.*"]), _ = w(() => e.value === "doc" ? R : $), g = w(() => F(z(j(_.value.rows.value, v.value), a.value), a.value)), x = w(() => e.value === "doc" ? "Document" : "Report");
    async function I(b) {
      const o = await _.value.context.read(`${e.value} show ${b.id} --json`);
      return o.ok ? o.value : null;
    }
    function N(b) {
      h.value = b.id, I(b).then((o) => p.value = o);
    }
    return V(e, () => {
      h.value = null, p.value = null;
    }), (b, o) => (i(), u("div", Z, [
      l("div", q, [
        f(y(E), {
          modelValue: v.value,
          "onUpdate:modelValue": o[0] || (o[0] = (n) => v.value = n),
          icon: "search",
          class: "library-search",
          placeholder: "Search titles and abstracts"
        }, null, 8, ["modelValue"]),
        f(y(S), {
          options: r,
          value: e.value,
          onPick: o[1] || (o[1] = (n) => e.value = n)
        }, null, 8, ["value"]),
        f(y(S), {
          options: t,
          value: a.value,
          onPick: o[2] || (o[2] = (n) => a.value = n)
        }, null, 8, ["value"])
      ]),
      l("div", H, [
        l("div", J, [
          _.value.loaded.value ? _.value.failure.value ? (i(), u("p", K, c(_.value.failure.value), 1)) : _.value.loaded.value && !g.value.length ? (i(), u("p", Q, c(v.value ? "Nothing matches the search" : `No ${r.find((n) => n.key === e.value).label.toLowerCase()} yet`), 1)) : C("", !0) : (i(), M(y(O), {
            key: 0,
            shape: "cards"
          })),
          (i(!0), u(k, null, D(g.value, (n) => (i(), u(k, {
            key: n.key
          }, [
            n.title ? (i(), u("h3", W, c(n.title), 1)) : C("", !0),
            (i(!0), u(k, null, D(n.rows, (d) => (i(), u("button", {
              key: d.id,
              type: "button",
              class: B(["library-row", { chosen: d.id === h.value }]),
              "data-row": d.id,
              onClick: (de) => N(d)
            }, [
              f(y(A), {
                name: "file",
                class: "library-icon"
              }),
              l("span", ee, [
                l("span", te, c(d.title), 1),
                l("span", ae, c(d.abstract), 1),
                l("span", se, c(x.value) + " " + c(d.id), 1)
              ]),
              l("span", oe, c(y(G)(d.updated_at)), 1)
            ], 10, X))), 128))
          ], 64))), 128))
        ]),
        l("div", le, [
          p.value ? (i(), u(k, { key: 0 }, [
            l("h2", re, c(p.value.title), 1),
            l("p", ne, c(p.value.abstract), 1),
            f(y(P), {
              text: p.value.body,
              class: "reader-body"
            }, null, 8, ["text"])
          ], 64)) : (i(), u("div", ie, [
            l("p", ce, "Choose a " + c(x.value.toLowerCase()) + " to read it here", 1),
            o[3] || (o[3] = l("p", { class: "reader-empty-text" }, "Choose one on the left to see its text here.", -1))
          ]))
        ])
      ])
    ]));
  }
}, pe = /* @__PURE__ */ Y(ue, [["__scopeId", "data-v-56391409"]]);
export {
  pe as default
};
