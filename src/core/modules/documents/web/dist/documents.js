/* @code-commandments-generated */
if (!document.getElementById("window-styles-8223e8f86d0a")) { const style = document.createElement("style"); style.id = "window-styles-8223e8f86d0a"; style.textContent = ".library-draft[data-v-89dedbc2]{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.library-draft-foot[data-v-89dedbc2]{display:flex;gap:6px;justify-content:flex-end}.library[data-v-89dedbc2]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-89dedbc2]{gap:10px}.library-body[data-v-89dedbc2]{display:grid;flex:1;grid-template-columns:minmax(240px,2fr) 3fr;min-height:0}.library-list[data-v-89dedbc2]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-89dedbc2]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-89dedbc2]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-89dedbc2]:hover,.library-row.chosen[data-v-89dedbc2]{background:var(--hover)}.library-icon[data-v-89dedbc2]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-89dedbc2]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-89dedbc2]{font-weight:600}.library-abstract[data-v-89dedbc2]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-89dedbc2],.library-age[data-v-89dedbc2]{color:var(--text-3);font-size:12px}.library-reader[data-v-89dedbc2]{overflow-y:auto;padding:20px 28px}.reader-title[data-v-89dedbc2]{margin:0 0 6px;font-size:20px}.reader-abstract[data-v-89dedbc2]{margin:0 0 18px;color:var(--text-2)}.reader-empty[data-v-89dedbc2]{margin-top:120px;text-align:center}.reader-empty-title[data-v-89dedbc2]{margin:0 0 6px;font-weight:500}.reader-empty-text[data-v-89dedbc2],.library-more[data-v-89dedbc2]{margin:8px 12px;color:var(--muted);background:none;border:0;cursor:pointer}.library-note[data-v-89dedbc2]{margin:0;color:var(--text-2)}.library-note[data-v-89dedbc2]{padding:12px}\n"; document.head.appendChild(style); }
import { ref as f, watch as j, computed as P, onUnmounted as ee, openBlock as n, createElementBlock as v, createVNode as m, unref as r, withCtx as D, createTextVNode as T, toDisplayString as k, withModifiers as V, withDirectives as K, createElementVNode as c, vModelText as z, createCommentVNode as g, withKeys as R, createBlock as q, Fragment as N, renderList as F, normalizeClass as te } from "vue";
import { useWindow as ae, SearchBar as le, Segmented as G, Btn as A, Skeleton as re, Icon as oe, TimeAgo as se, steppedItem as ne, peekRef as ie } from "@journal/window-kit";
const ue = 1440 * 60 * 1e3, de = [
  { key: "today", title: "Today", days: 1 },
  { key: "week", title: "Last 7 days", days: 7 },
  { key: "month", title: "Last 30 days", days: 30 },
  { key: "older", title: "Older", days: 1 / 0 }
];
function ve(i, y) {
  const u = y.trim().toLowerCase();
  return u ? i.filter((s) => `${s.title} ${s.abstract}`.toLowerCase().includes(u)) : i;
}
function ce(i, y) {
  const u = [...i];
  return y === "title" ? u.sort((s, a) => s.title.localeCompare(a.title)) : u.sort((s, a) => String(a.updated_at).localeCompare(String(s.updated_at)));
}
function ye(i, y, u = Date.now()) {
  if (y === "title") return i.length ? [{ key: "all", title: "", rows: i }] : [];
  const s = de.map((a) => ({ ...a, rows: [] }));
  for (const a of i) {
    const b = (u - Date.parse(a.updated_at)) / ue;
    s.find((_) => b < _.days).rows.push(a);
  }
  return s.filter((a) => a.rows.length);
}
const be = (i, y) => {
  const u = i.__vccOpts || i;
  for (const [s, a] of y)
    u[s] = a;
  return u;
}, pe = { class: "library" }, fe = {
  key: 0,
  class: "library-note",
  role: "alert"
}, me = { class: "library-draft-foot" }, ke = { class: "library-body" }, we = ["onKeydown"], he = {
  key: 1,
  class: "library-note"
}, Ce = { class: "library-note" }, _e = {
  key: 0,
  class: "library-group"
}, ge = ["data-row", "onClick"], Se = { class: "library-text" }, xe = { class: "library-title" }, $e = { class: "library-abstract" }, De = { class: "library-ref" }, Le = {
  __name: "DocumentLibrary",
  setup(i) {
    const y = [
      { key: "doc", label: "Documents" },
      { key: "report", label: "Reports" }
    ], u = [
      { key: "open", label: "Open" },
      { key: "closed", label: "Closed" }
    ], s = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], a = f("doc"), b = f("open"), _ = f("newest"), w = f(""), h = f(null), d = ae();
    d.state["library.type"] = a.value, d.state["library.state"] = b.value;
    const S = d.props.library, C = f([]), B = f(0), { failure: x, loaded: L } = S;
    j(S.data, (l) => {
      C.value = l.rows, B.value = l.total;
    }, { once: !0 });
    const $ = f(!1), p = f({ title: "", abstract: "", body: "" }), I = f(""), O = P(() => ye(ce(ve(C.value, w.value), _.value), _.value)), W = P(() => a.value === "doc" ? "Document" : "Report");
    async function U() {
      const l = a.value, e = b.value;
      d.state["library.type"] = l, d.state["library.state"] = e, delete d.state["library.after"];
      const t = await d.reload("library");
      l !== a.value || e !== b.value || (C.value = t && !x.value ? S.data.value.rows : [], B.value = t && !x.value ? S.data.value.total : 0, L.value = !0);
    }
    async function H() {
      const l = a.value, e = b.value;
      d.state["library.after"] = String(Math.max(...C.value.map((o) => o.id)));
      const t = await d.reload("library");
      delete d.state["library.after"], !(!t || x.value) && l === a.value && e === b.value && (C.value = [...C.value, ...S.data.value.rows]);
    }
    function Y(l) {
      h.value = l.id, ie(`${a.value === "doc" ? "docs" : "reports"}:${l.id}`);
    }
    async function J() {
      const { title: l, abstract: e, body: t } = p.value;
      if (!l.trim() || !e.trim()) return;
      const o = await d.run([a.value, "make", l.trim(), "--abstract", e.trim(), "--body", t.trim() || e.trim()]);
      I.value = o.ok ? "" : o.error, o.ok && ($.value = !1, p.value = { title: "", abstract: "", body: "" }, U());
    }
    const Q = () => {
      const l = E.value.find((e) => e.id === h.value);
      l && Y(l);
    }, E = P(() => O.value.flatMap((l) => l.rows));
    function Z(l) {
      E.value.length && (h.value = ne(E.value.map((e) => e.id), h.value, l));
    }
    function X() {
      h.value ? h.value = null : w.value = "";
    }
    j([a, b], () => {
      h.value = null, C.value = [], L.value = !1, U();
    });
    const M = d.follow(["doc.*", "report.*"], U);
    return ee(() => M == null ? void 0 : M()), (l, e) => (n(), v("div", pe, [
      m(r(le), {
        modelValue: w.value,
        "onUpdate:modelValue": e[4] || (e[4] = (t) => w.value = t),
        class: "library-bar"
      }, {
        default: D(() => [
          m(r(G), {
            options: y,
            value: a.value,
            onPick: e[0] || (e[0] = (t) => a.value = t)
          }, null, 8, ["value"]),
          m(r(G), {
            options: u,
            value: b.value,
            "data-library-state": "",
            onPick: e[1] || (e[1] = (t) => b.value = t)
          }, null, 8, ["value"]),
          m(r(G), {
            options: s,
            value: _.value,
            onPick: e[2] || (e[2] = (t) => _.value = t)
          }, null, 8, ["value"]),
          m(r(A), {
            small: "",
            bordered: "",
            "data-library-new": "",
            onClick: e[3] || (e[3] = (t) => $.value = !$.value)
          }, {
            default: D(() => [
              T("New " + k(W.value.toLowerCase()), 1)
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue"]),
      $.value ? (n(), v("form", {
        key: 0,
        class: "library-draft",
        "data-library-draft": "",
        onSubmit: V(J, ["prevent"])
      }, [
        K(c("input", {
          "onUpdate:modelValue": e[5] || (e[5] = (t) => p.value.title = t),
          placeholder: "Title",
          "aria-label": "Title"
        }, null, 512), [
          [z, p.value.title]
        ]),
        K(c("input", {
          "onUpdate:modelValue": e[6] || (e[6] = (t) => p.value.abstract = t),
          placeholder: "A short summary",
          "aria-label": "Abstract"
        }, null, 512), [
          [z, p.value.abstract]
        ]),
        K(c("textarea", {
          "onUpdate:modelValue": e[7] || (e[7] = (t) => p.value.body = t),
          rows: "4",
          placeholder: "The text",
          "aria-label": "Text"
        }, null, 512), [
          [z, p.value.body]
        ]),
        I.value ? (n(), v("p", fe, k(I.value), 1)) : g("", !0),
        c("div", me, [
          m(r(A), {
            small: "",
            onClick: e[8] || (e[8] = (t) => $.value = !1)
          }, {
            default: D(() => [...e[12] || (e[12] = [
              T("Cancel", -1)
            ])]),
            _: 1
          }),
          m(r(A), {
            small: "",
            variant: "primary",
            type: "submit",
            disabled: !p.value.title.trim() || !p.value.abstract.trim(),
            "data-library-create": ""
          }, {
            default: D(() => [...e[13] || (e[13] = [
              T("Create", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : g("", !0),
      c("div", ke, [
        c("div", {
          class: "library-list",
          tabindex: "0",
          "data-library-list": "",
          onKeydown: [
            e[10] || (e[10] = R(V((t) => Z(1), ["prevent"]), ["down"])),
            e[11] || (e[11] = R(V((t) => Z(-1), ["prevent"]), ["up"])),
            R(X, ["esc"]),
            R(V(Q, ["self"]), ["enter"])
          ]
        }, [
          r(L) ? r(x) ? (n(), v("p", he, k(r(x)), 1)) : r(L) && !O.value.length ? (n(), v(N, { key: 2 }, [
            c("p", Ce, k(w.value ? "Nothing matches the search" : `No ${y.find((t) => t.key === a.value).label.toLowerCase()} yet`), 1),
            w.value ? (n(), q(r(A), {
              key: 0,
              small: "",
              "data-library-clear": "",
              onClick: e[9] || (e[9] = (t) => w.value = "")
            }, {
              default: D(() => [...e[14] || (e[14] = [
                T("Clear the search", -1)
              ])]),
              _: 1
            })) : g("", !0)
          ], 64)) : g("", !0) : (n(), q(r(re), {
            key: 0,
            shape: "cards"
          })),
          (n(!0), v(N, null, F(O.value, (t) => (n(), v(N, {
            key: t.key
          }, [
            t.title ? (n(), v("h3", _e, k(t.title), 1)) : g("", !0),
            (n(!0), v(N, null, F(t.rows, (o) => (n(), v("button", {
              key: o.id,
              type: "button",
              class: te(["library-row", { chosen: o.id === h.value }]),
              "data-row": o.id,
              onClick: (Te) => Y(o)
            }, [
              m(r(oe), {
                name: "file",
                class: "library-icon"
              }),
              c("span", Se, [
                c("span", xe, k(o.title), 1),
                c("span", $e, k(o.abstract), 1),
                c("span", De, k(W.value) + " " + k(o.id), 1)
              ]),
              m(r(se), {
                class: "library-age",
                at: o.updated_at
              }, null, 8, ["at"])
            ], 10, ge))), 128))
          ], 64))), 128)),
          C.value.length < B.value && !w.value ? (n(), v("button", {
            key: 3,
            type: "button",
            class: "library-more",
            onClick: H
          }, "Show more")) : g("", !0)
        ], 40, we)
      ])
    ]));
  }
}, Ne = /* @__PURE__ */ be(Le, [["__scopeId", "data-v-89dedbc2"]]);
export {
  Ne as default
};
