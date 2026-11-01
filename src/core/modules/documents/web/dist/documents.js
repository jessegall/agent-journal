/* @code-commandments-generated */
if (!document.getElementById("window-styles-b07752157766")) { const style = document.createElement("style"); style.id = "window-styles-b07752157766"; style.textContent = ".library-draft[data-v-bdbb2ee8]{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.library-draft-foot[data-v-bdbb2ee8]{display:flex;gap:6px;justify-content:flex-end}.library[data-v-bdbb2ee8]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-bdbb2ee8]{display:flex;gap:10px;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border)}.library-search[data-v-bdbb2ee8]{flex:1;min-width:0}.library-body[data-v-bdbb2ee8]{display:grid;flex:1;grid-template-columns:minmax(240px,2fr) 3fr;min-height:0}.library-list[data-v-bdbb2ee8]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-bdbb2ee8]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-bdbb2ee8]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-bdbb2ee8]:hover,.library-row.chosen[data-v-bdbb2ee8]{background:var(--hover)}.library-icon[data-v-bdbb2ee8]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-bdbb2ee8]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-bdbb2ee8]{font-weight:600}.library-abstract[data-v-bdbb2ee8]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-bdbb2ee8],.library-age[data-v-bdbb2ee8]{color:var(--text-3);font-size:12px}.library-reader[data-v-bdbb2ee8]{overflow-y:auto;padding:20px 28px}.reader-title[data-v-bdbb2ee8]{margin:0 0 6px;font-size:20px}.reader-abstract[data-v-bdbb2ee8]{margin:0 0 18px;color:var(--text-2)}.reader-empty[data-v-bdbb2ee8]{margin-top:120px;text-align:center}.reader-empty-title[data-v-bdbb2ee8]{margin:0 0 6px;font-weight:500}.reader-empty-text[data-v-bdbb2ee8],.library-more[data-v-bdbb2ee8]{margin:8px 12px;color:var(--muted);background:none;border:0;cursor:pointer}.library-note[data-v-bdbb2ee8]{margin:0;color:var(--text-2)}.library-note[data-v-bdbb2ee8]{padding:12px}\n"; document.head.appendChild(style); }
import { ref as y, computed as O, watch as H, openBlock as n, createElementBlock as u, createElementVNode as o, createVNode as k, unref as b, withCtx as L, createTextVNode as V, toDisplayString as d, withModifiers as B, withDirectives as U, vModelText as A, createCommentVNode as _, withKeys as E, createBlock as z, Fragment as g, renderList as F, normalizeClass as J } from "vue";
import { useWindow as Q, TextInput as X, Segmented as G, Btn as R, Skeleton as ee, Icon as te, TextDisplay as ae } from "@journal/window-kit";
const le = 1440 * 60 * 1e3, re = [
  { key: "today", title: "Today", days: 1 },
  { key: "week", title: "Last 7 days", days: 7 },
  { key: "month", title: "Last 30 days", days: 30 },
  { key: "older", title: "Older", days: 1 / 0 }
];
function oe(i, c) {
  const l = c.trim().toLowerCase();
  return l ? i.filter((a) => `${a.title} ${a.abstract}`.toLowerCase().includes(l)) : i;
}
function se(i, c) {
  const l = [...i];
  return c === "title" ? l.sort((a, s) => a.title.localeCompare(s.title)) : l.sort((a, s) => String(s.updated_at).localeCompare(String(a.updated_at)));
}
function ne(i, c, l = Date.now()) {
  if (c === "title") return i.length ? [{ key: "all", title: "", rows: i }] : [];
  const a = re.map((s) => ({ ...s, rows: [] }));
  for (const s of i) {
    const p = (l - Date.parse(s.updated_at)) / le;
    a.find((m) => p < m.days).rows.push(s);
  }
  return a.filter((s) => s.rows.length);
}
function ie(i, c = Date.now()) {
  const l = Math.max(0, Math.round((c - Date.parse(i)) / 6e4));
  return l < 60 ? `${l}m` : l < 1440 ? `${Math.round(l / 60)}h` : `${Math.round(l / 1440)}d`;
}
const ue = (i, c) => {
  const l = i.__vccOpts || i;
  for (const [a, s] of c)
    l[a] = s;
  return l;
}, de = { class: "library" }, ce = { class: "library-bar" }, ve = {
  key: 0,
  class: "library-note",
  role: "alert"
}, ye = { class: "library-draft-foot" }, be = { class: "library-body" }, pe = {
  key: 1,
  class: "library-note"
}, fe = { class: "library-note" }, me = {
  key: 0,
  class: "library-group"
}, ke = ["data-row", "onClick"], he = { class: "library-text" }, we = { class: "library-title" }, _e = { class: "library-abstract" }, xe = { class: "library-ref" }, Ce = { class: "library-age" }, ge = { class: "library-reader" }, $e = { class: "reader-title" }, De = { class: "reader-abstract" }, Me = {
  key: 1,
  class: "reader-empty"
}, Se = { class: "reader-empty-title" }, Le = {
  __name: "DocumentLibrary",
  setup(i) {
    const c = [
      { key: "doc", label: "Documents" },
      { key: "report", label: "Reports" }
    ], l = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], a = y("doc"), s = y("newest"), p = y(""), m = y(null), h = y(null), x = Q(), w = y([]), P = y(0), $ = y(""), D = y(!1), C = y(!1), f = y({ title: "", abstract: "", body: "" }), T = y(""), N = O(() => ne(se(oe(w.value, p.value), s.value), s.value)), I = O(() => a.value === "doc" ? "Document" : "Report");
    async function M() {
      const r = a.value, e = await x.read(`document library --kind ${r}`);
      r === a.value && ($.value = e.ok ? "" : e.error, w.value = e.ok ? e.value.rows : [], P.value = e.ok ? e.value.total : 0, D.value = !0);
    }
    async function W() {
      const r = a.value, e = await x.read(`document library --kind ${r} --after ${Math.max(...w.value.map((t) => t.id))}`);
      if (!e.ok) return void ($.value = e.error);
      r === a.value && (w.value = [...w.value, ...e.value.rows]);
    }
    async function Y(r) {
      const e = await x.read(`${a.value} show ${r.id} --json`);
      return e.ok ? e.value : null;
    }
    function K(r) {
      m.value = r.id, Y(r).then((e) => h.value = e);
    }
    async function Z() {
      const { title: r, abstract: e, body: t } = f.value;
      if (!r.trim() || !e.trim()) return;
      const v = await x.run([a.value, "make", r.trim(), "--abstract", e.trim(), "--body", t.trim() || e.trim()]);
      T.value = v.ok ? "" : v.error, v.ok && (C.value = !1, f.value = { title: "", abstract: "", body: "" }, M());
    }
    const S = O(() => N.value.flatMap((r) => r.rows));
    function j(r) {
      if (!S.value.length) return;
      const e = S.value.findIndex((t) => t.id === m.value);
      K(S.value[e < 0 ? 0 : Math.max(0, Math.min(S.value.length - 1, e + r))]);
    }
    function q() {
      m.value ? (m.value = null, h.value = null) : p.value = "";
    }
    return H(a, () => {
      m.value = null, h.value = null, w.value = [], D.value = !1, M();
    }), x.follow(["doc.*", "report.*"], M), M(), (r, e) => (n(), u("div", de, [
      o("div", ce, [
        k(b(X), {
          modelValue: p.value,
          "onUpdate:modelValue": e[0] || (e[0] = (t) => p.value = t),
          icon: "search",
          class: "library-search",
          placeholder: "Search titles and abstracts"
        }, null, 8, ["modelValue"]),
        k(b(G), {
          options: c,
          value: a.value,
          onPick: e[1] || (e[1] = (t) => a.value = t)
        }, null, 8, ["value"]),
        k(b(G), {
          options: l,
          value: s.value,
          onPick: e[2] || (e[2] = (t) => s.value = t)
        }, null, 8, ["value"]),
        k(b(R), {
          small: "",
          bordered: "",
          "data-library-new": "",
          onClick: e[3] || (e[3] = (t) => C.value = !C.value)
        }, {
          default: L(() => [
            V("New " + d(I.value.toLowerCase()), 1)
          ]),
          _: 1
        })
      ]),
      C.value ? (n(), u("form", {
        key: 0,
        class: "library-draft",
        "data-library-draft": "",
        onSubmit: B(Z, ["prevent"])
      }, [
        U(o("input", {
          "onUpdate:modelValue": e[4] || (e[4] = (t) => f.value.title = t),
          placeholder: "Title",
          "aria-label": "Title"
        }, null, 512), [
          [A, f.value.title]
        ]),
        U(o("input", {
          "onUpdate:modelValue": e[5] || (e[5] = (t) => f.value.abstract = t),
          placeholder: "One line on what it says",
          "aria-label": "Abstract"
        }, null, 512), [
          [A, f.value.abstract]
        ]),
        U(o("textarea", {
          "onUpdate:modelValue": e[6] || (e[6] = (t) => f.value.body = t),
          rows: "4",
          placeholder: "The text",
          "aria-label": "Text"
        }, null, 512), [
          [A, f.value.body]
        ]),
        T.value ? (n(), u("p", ve, d(T.value), 1)) : _("", !0),
        o("div", ye, [
          k(b(R), {
            small: "",
            onClick: e[7] || (e[7] = (t) => C.value = !1)
          }, {
            default: L(() => [...e[11] || (e[11] = [
              V("Cancel", -1)
            ])]),
            _: 1
          }),
          k(b(R), {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !f.value.title.trim() || !f.value.abstract.trim(),
            "data-library-create": ""
          }, {
            default: L(() => [...e[12] || (e[12] = [
              V("Make it", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : _("", !0),
      o("div", be, [
        o("div", {
          class: "library-list",
          tabindex: "0",
          "data-library-list": "",
          onKeydown: [
            e[9] || (e[9] = E(B((t) => j(1), ["prevent"]), ["down"])),
            e[10] || (e[10] = E(B((t) => j(-1), ["prevent"]), ["up"])),
            E(q, ["esc"])
          ]
        }, [
          D.value ? $.value ? (n(), u("p", pe, d($.value), 1)) : D.value && !N.value.length ? (n(), u(g, { key: 2 }, [
            o("p", fe, d(p.value ? "Nothing matches the search" : `No ${c.find((t) => t.key === a.value).label.toLowerCase()} yet`), 1),
            p.value ? (n(), z(b(R), {
              key: 0,
              small: "",
              "data-library-clear": "",
              onClick: e[8] || (e[8] = (t) => p.value = "")
            }, {
              default: L(() => [...e[13] || (e[13] = [
                V("Clear the search", -1)
              ])]),
              _: 1
            })) : _("", !0)
          ], 64)) : _("", !0) : (n(), z(b(ee), {
            key: 0,
            shape: "cards"
          })),
          (n(!0), u(g, null, F(N.value, (t) => (n(), u(g, {
            key: t.key
          }, [
            t.title ? (n(), u("h3", me, d(t.title), 1)) : _("", !0),
            (n(!0), u(g, null, F(t.rows, (v) => (n(), u("button", {
              key: v.id,
              type: "button",
              class: J(["library-row", { chosen: v.id === m.value }]),
              "data-row": v.id,
              onClick: (Ve) => K(v)
            }, [
              k(b(te), {
                name: "file",
                class: "library-icon"
              }),
              o("span", he, [
                o("span", we, d(v.title), 1),
                o("span", _e, d(v.abstract), 1),
                o("span", xe, d(I.value) + " " + d(v.id), 1)
              ]),
              o("span", Ce, d(b(ie)(v.updated_at)), 1)
            ], 10, ke))), 128))
          ], 64))), 128)),
          w.value.length < P.value && !p.value ? (n(), u("button", {
            key: 3,
            type: "button",
            class: "library-more",
            onClick: W
          }, "Show more")) : _("", !0)
        ], 32),
        o("div", ge, [
          h.value ? (n(), u(g, { key: 0 }, [
            o("h2", $e, d(h.value.title), 1),
            o("p", De, d(h.value.abstract), 1),
            k(b(ae), {
              text: h.value.body,
              class: "reader-body"
            }, null, 8, ["text"])
          ], 64)) : (n(), u("div", Me, [
            o("p", Se, "Choose a " + d(I.value.toLowerCase()) + " to read it here", 1),
            e[14] || (e[14] = o("p", { class: "reader-empty-text" }, "Choose one on the left to see its text here.", -1))
          ]))
        ])
      ])
    ]));
  }
}, Ne = /* @__PURE__ */ ue(Le, [["__scopeId", "data-v-bdbb2ee8"]]);
export {
  Ne as default
};
