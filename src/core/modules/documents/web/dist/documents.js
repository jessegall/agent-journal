/* @code-commandments-generated */
if (!document.getElementById("window-styles-f1ce98804066")) { const style = document.createElement("style"); style.id = "window-styles-f1ce98804066"; style.textContent = ".library-draft[data-v-28f892d0]{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.library-draft-foot[data-v-28f892d0]{display:flex;gap:6px;justify-content:flex-end}.library[data-v-28f892d0]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-28f892d0]{display:flex;gap:10px;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border)}.library-search[data-v-28f892d0]{flex:1;min-width:0}.library-body[data-v-28f892d0]{display:grid;flex:1;grid-template-columns:minmax(240px,2fr) 3fr;min-height:0}.library-list[data-v-28f892d0]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-28f892d0]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-28f892d0]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-28f892d0]:hover,.library-row.chosen[data-v-28f892d0]{background:var(--hover)}.library-icon[data-v-28f892d0]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-28f892d0]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-28f892d0]{font-weight:600}.library-abstract[data-v-28f892d0]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-28f892d0],.library-age[data-v-28f892d0]{color:var(--text-3);font-size:12px}.library-reader[data-v-28f892d0]{overflow-y:auto;padding:20px 28px}.reader-title[data-v-28f892d0]{margin:0 0 6px;font-size:20px}.reader-abstract[data-v-28f892d0]{margin:0 0 18px;color:var(--text-2)}.reader-empty[data-v-28f892d0]{margin-top:120px;text-align:center}.reader-empty-title[data-v-28f892d0]{margin:0 0 6px;font-weight:500}.reader-empty-text[data-v-28f892d0],.library-more[data-v-28f892d0]{margin:8px 12px;color:var(--muted);background:none;border:0;cursor:pointer}.library-note[data-v-28f892d0]{margin:0;color:var(--text-2)}.library-note[data-v-28f892d0]{padding:12px}\n"; document.head.appendChild(style); }
import { ref as d, computed as B, watch as Q, openBlock as s, createElementBlock as c, createElementVNode as r, createVNode as m, unref as b, withCtx as V, createTextVNode as R, toDisplayString as v, withModifiers as E, withDirectives as U, vModelText as P, createCommentVNode as C, withKeys as K, createBlock as W, Fragment as S, renderList as Y, normalizeClass as X } from "vue";
import { useWindow as ee, TextInput as te, Segmented as j, Btn as N, Skeleton as ae, Icon as le, TextDisplay as oe } from "@journal/window-kit";
const re = 1440 * 60 * 1e3, se = [
  { key: "today", title: "Today", days: 1 },
  { key: "week", title: "Last 7 days", days: 7 },
  { key: "month", title: "Last 30 days", days: 30 },
  { key: "older", title: "Older", days: 1 / 0 }
];
function ne(n, y) {
  const l = y.trim().toLowerCase();
  return l ? n.filter((u) => `${u.title} ${u.abstract}`.toLowerCase().includes(l)) : n;
}
function ie(n, y) {
  const l = [...n];
  return y === "title" ? l.sort((u, a) => u.title.localeCompare(a.title)) : l.sort((u, a) => String(a.updated_at).localeCompare(String(u.updated_at)));
}
function ue(n, y, l = Date.now()) {
  if (y === "title") return n.length ? [{ key: "all", title: "", rows: n }] : [];
  const u = se.map((a) => ({ ...a, rows: [] }));
  for (const a of n) {
    const f = (l - Date.parse(a.updated_at)) / re;
    u.find((_) => f < _.days).rows.push(a);
  }
  return u.filter((a) => a.rows.length);
}
function de(n, y = Date.now()) {
  const l = Math.max(0, Math.round((y - Date.parse(n)) / 6e4));
  return l < 60 ? `${l}m` : l < 1440 ? `${Math.round(l / 60)}h` : `${Math.round(l / 1440)}d`;
}
const ce = (n, y) => {
  const l = n.__vccOpts || n;
  for (const [u, a] of y)
    l[u] = a;
  return l;
}, ve = { class: "library" }, ye = { class: "library-bar" }, be = {
  key: 0,
  class: "library-note",
  role: "alert"
}, pe = { class: "library-draft-foot" }, fe = { class: "library-body" }, me = {
  key: 1,
  class: "library-note"
}, ke = { class: "library-note" }, he = {
  key: 0,
  class: "library-group"
}, we = ["data-row", "onClick"], _e = { class: "library-text" }, xe = { class: "library-title" }, Ce = { class: "library-abstract" }, $e = { class: "library-ref" }, ge = { class: "library-age" }, Se = { class: "library-reader" }, De = { class: "reader-title" }, Me = { class: "reader-abstract" }, Le = {
  key: 1,
  class: "reader-empty"
}, Te = { class: "reader-empty-title" }, Ve = {
  __name: "DocumentLibrary",
  setup(n) {
    const y = [
      { key: "doc", label: "Documents" },
      { key: "report", label: "Reports" }
    ], l = [
      { key: "open", label: "Open" },
      { key: "closed", label: "Closed" }
    ], u = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], a = d("doc"), f = d("open"), _ = d("newest"), k = d(""), x = d(null), h = d(null), $ = ee(), w = d([]), z = d(0), D = d(""), M = d(!1), g = d(!1), p = d({ title: "", abstract: "", body: "" }), I = d(""), O = B(() => ue(ie(ne(w.value, k.value), _.value), _.value)), A = B(() => a.value === "doc" ? "Document" : "Report");
    async function L() {
      const o = a.value, e = f.value, t = await $.read(`document library --kind ${o} --state ${e}`);
      o !== a.value || e !== f.value || (D.value = t.ok ? "" : t.error, w.value = t.ok ? t.value.rows : [], z.value = t.ok ? t.value.total : 0, M.value = !0);
    }
    async function Z() {
      const o = a.value, e = f.value, t = await $.read(`document library --kind ${o} --state ${e} --after ${Math.max(...w.value.map((i) => i.id))}`);
      if (!t.ok) return void (D.value = t.error);
      o === a.value && e === f.value && (w.value = [...w.value, ...t.value.rows]);
    }
    async function q(o) {
      const e = await $.read(`${a.value} show ${o.id} --json`);
      return e.ok ? e.value : null;
    }
    function F(o) {
      x.value = o.id, q(o).then((e) => h.value = e);
    }
    async function H() {
      const { title: o, abstract: e, body: t } = p.value;
      if (!o.trim() || !e.trim()) return;
      const i = await $.run([a.value, "make", o.trim(), "--abstract", e.trim(), "--body", t.trim() || e.trim()]);
      I.value = i.ok ? "" : i.error, i.ok && (g.value = !1, p.value = { title: "", abstract: "", body: "" }, L());
    }
    const T = B(() => O.value.flatMap((o) => o.rows));
    function G(o) {
      if (!T.value.length) return;
      const e = T.value.findIndex((t) => t.id === x.value);
      F(T.value[e < 0 ? 0 : Math.max(0, Math.min(T.value.length - 1, e + o))]);
    }
    function J() {
      x.value ? (x.value = null, h.value = null) : k.value = "";
    }
    return Q([a, f], () => {
      x.value = null, h.value = null, w.value = [], M.value = !1, L();
    }), $.follow(["doc.*", "report.*"], L), L(), (o, e) => (s(), c("div", ve, [
      r("div", ye, [
        m(b(te), {
          modelValue: k.value,
          "onUpdate:modelValue": e[0] || (e[0] = (t) => k.value = t),
          icon: "search",
          class: "library-search",
          placeholder: "Search titles and abstracts"
        }, null, 8, ["modelValue"]),
        m(b(j), {
          options: y,
          value: a.value,
          onPick: e[1] || (e[1] = (t) => a.value = t)
        }, null, 8, ["value"]),
        m(b(j), {
          options: l,
          value: f.value,
          "data-library-state": "",
          onPick: e[2] || (e[2] = (t) => f.value = t)
        }, null, 8, ["value"]),
        m(b(j), {
          options: u,
          value: _.value,
          onPick: e[3] || (e[3] = (t) => _.value = t)
        }, null, 8, ["value"]),
        m(b(N), {
          small: "",
          bordered: "",
          "data-library-new": "",
          onClick: e[4] || (e[4] = (t) => g.value = !g.value)
        }, {
          default: V(() => [
            R("New " + v(A.value.toLowerCase()), 1)
          ]),
          _: 1
        })
      ]),
      g.value ? (s(), c("form", {
        key: 0,
        class: "library-draft",
        "data-library-draft": "",
        onSubmit: E(H, ["prevent"])
      }, [
        U(r("input", {
          "onUpdate:modelValue": e[5] || (e[5] = (t) => p.value.title = t),
          placeholder: "Title",
          "aria-label": "Title"
        }, null, 512), [
          [P, p.value.title]
        ]),
        U(r("input", {
          "onUpdate:modelValue": e[6] || (e[6] = (t) => p.value.abstract = t),
          placeholder: "One line on what it says",
          "aria-label": "Abstract"
        }, null, 512), [
          [P, p.value.abstract]
        ]),
        U(r("textarea", {
          "onUpdate:modelValue": e[7] || (e[7] = (t) => p.value.body = t),
          rows: "4",
          placeholder: "The text",
          "aria-label": "Text"
        }, null, 512), [
          [P, p.value.body]
        ]),
        I.value ? (s(), c("p", be, v(I.value), 1)) : C("", !0),
        r("div", pe, [
          m(b(N), {
            small: "",
            onClick: e[8] || (e[8] = (t) => g.value = !1)
          }, {
            default: V(() => [...e[12] || (e[12] = [
              R("Cancel", -1)
            ])]),
            _: 1
          }),
          m(b(N), {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !p.value.title.trim() || !p.value.abstract.trim(),
            "data-library-create": ""
          }, {
            default: V(() => [...e[13] || (e[13] = [
              R("Make it", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : C("", !0),
      r("div", fe, [
        r("div", {
          class: "library-list",
          tabindex: "0",
          "data-library-list": "",
          onKeydown: [
            e[10] || (e[10] = K(E((t) => G(1), ["prevent"]), ["down"])),
            e[11] || (e[11] = K(E((t) => G(-1), ["prevent"]), ["up"])),
            K(J, ["esc"])
          ]
        }, [
          M.value ? D.value ? (s(), c("p", me, v(D.value), 1)) : M.value && !O.value.length ? (s(), c(S, { key: 2 }, [
            r("p", ke, v(k.value ? "Nothing matches the search" : `No ${y.find((t) => t.key === a.value).label.toLowerCase()} yet`), 1),
            k.value ? (s(), W(b(N), {
              key: 0,
              small: "",
              "data-library-clear": "",
              onClick: e[9] || (e[9] = (t) => k.value = "")
            }, {
              default: V(() => [...e[14] || (e[14] = [
                R("Clear the search", -1)
              ])]),
              _: 1
            })) : C("", !0)
          ], 64)) : C("", !0) : (s(), W(b(ae), {
            key: 0,
            shape: "cards"
          })),
          (s(!0), c(S, null, Y(O.value, (t) => (s(), c(S, {
            key: t.key
          }, [
            t.title ? (s(), c("h3", he, v(t.title), 1)) : C("", !0),
            (s(!0), c(S, null, Y(t.rows, (i) => (s(), c("button", {
              key: i.id,
              type: "button",
              class: X(["library-row", { chosen: i.id === x.value }]),
              "data-row": i.id,
              onClick: (Re) => F(i)
            }, [
              m(b(le), {
                name: "file",
                class: "library-icon"
              }),
              r("span", _e, [
                r("span", xe, v(i.title), 1),
                r("span", Ce, v(i.abstract), 1),
                r("span", $e, v(A.value) + " " + v(i.id), 1)
              ]),
              r("span", ge, v(b(de)(i.updated_at)), 1)
            ], 10, we))), 128))
          ], 64))), 128)),
          w.value.length < z.value && !k.value ? (s(), c("button", {
            key: 3,
            type: "button",
            class: "library-more",
            onClick: Z
          }, "Show more")) : C("", !0)
        ], 32),
        r("div", Se, [
          h.value ? (s(), c(S, { key: 0 }, [
            r("h2", De, v(h.value.title), 1),
            r("p", Me, v(h.value.abstract), 1),
            m(b(oe), {
              text: h.value.body,
              class: "reader-body"
            }, null, 8, ["text"])
          ], 64)) : (s(), c("div", Le, [
            r("p", Te, "Choose a " + v(A.value.toLowerCase()) + " to read it here", 1),
            e[15] || (e[15] = r("p", { class: "reader-empty-text" }, "Choose one on the left to see its text here.", -1))
          ]))
        ])
      ])
    ]));
  }
}, Oe = /* @__PURE__ */ ce(Ve, [["__scopeId", "data-v-28f892d0"]]);
export {
  Oe as default
};
