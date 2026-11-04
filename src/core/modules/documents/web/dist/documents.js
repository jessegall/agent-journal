/* @code-commandments-generated */
if (!document.getElementById("window-styles-817359217d34")) { const style = document.createElement("style"); style.id = "window-styles-817359217d34"; style.textContent = ".library-draft[data-v-bba0e4f5]{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.library-draft-foot[data-v-bba0e4f5]{display:flex;gap:6px;justify-content:flex-end}.library[data-v-bba0e4f5]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-bba0e4f5]{gap:10px}.library-body[data-v-bba0e4f5]{display:grid;flex:1;grid-template-columns:minmax(240px,2fr) 3fr;min-height:0}.library-list[data-v-bba0e4f5]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-bba0e4f5]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-bba0e4f5]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-bba0e4f5]:hover,.library-row.chosen[data-v-bba0e4f5]{background:var(--hover)}.library-icon[data-v-bba0e4f5]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-bba0e4f5]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-bba0e4f5]{font-weight:600}.library-abstract[data-v-bba0e4f5]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-bba0e4f5],.library-age[data-v-bba0e4f5]{color:var(--text-3);font-size:12px}.library-reader[data-v-bba0e4f5]{overflow-y:auto;padding:20px 28px}.reader-title[data-v-bba0e4f5]{margin:0 0 6px;font-size:20px}.reader-abstract[data-v-bba0e4f5]{margin:0 0 18px;color:var(--text-2)}.reader-empty[data-v-bba0e4f5]{margin-top:120px;text-align:center}.reader-empty-title[data-v-bba0e4f5]{margin:0 0 6px;font-weight:500}.reader-empty-text[data-v-bba0e4f5],.library-more[data-v-bba0e4f5]{margin:8px 12px;color:var(--muted);background:none;border:0;cursor:pointer}.library-note[data-v-bba0e4f5]{margin:0;color:var(--text-2)}.library-note[data-v-bba0e4f5]{padding:12px}\n"; document.head.appendChild(style); }
import { ref as i, computed as O, watch as J, openBlock as n, createElementBlock as d, createVNode as p, unref as v, withCtx as x, createTextVNode as V, toDisplayString as m, withModifiers as R, withDirectives as E, createElementVNode as c, vModelText as U, createCommentVNode as _, withKeys as N, createBlock as W, Fragment as A, renderList as Y, normalizeClass as Q } from "vue";
import { useWindow as X, SearchBar as ee, Segmented as P, Btn as M, Skeleton as te, Icon as ae, TimeAgo as le, peekRef as oe } from "@journal/window-kit";
const re = 1440 * 60 * 1e3, ne = [
  { key: "today", title: "Today", days: 1 },
  { key: "week", title: "Last 7 days", days: 7 },
  { key: "month", title: "Last 30 days", days: 30 },
  { key: "older", title: "Older", days: 1 / 0 }
];
function se(s, y) {
  const u = y.trim().toLowerCase();
  return u ? s.filter((r) => `${r.title} ${r.abstract}`.toLowerCase().includes(u)) : s;
}
function ue(s, y) {
  const u = [...s];
  return y === "title" ? u.sort((r, a) => r.title.localeCompare(a.title)) : u.sort((r, a) => String(a.updated_at).localeCompare(String(r.updated_at)));
}
function ie(s, y, u = Date.now()) {
  if (y === "title") return s.length ? [{ key: "all", title: "", rows: s }] : [];
  const r = ne.map((a) => ({ ...a, rows: [] }));
  for (const a of s) {
    const f = (u - Date.parse(a.updated_at)) / re;
    r.find((C) => f < C.days).rows.push(a);
  }
  return r.filter((a) => a.rows.length);
}
const de = (s, y) => {
  const u = s.__vccOpts || s;
  for (const [r, a] of y)
    u[r] = a;
  return u;
}, ve = { class: "library" }, ce = {
  key: 0,
  class: "library-note",
  role: "alert"
}, ye = { class: "library-draft-foot" }, be = { class: "library-body" }, fe = ["onKeydown"], pe = {
  key: 1,
  class: "library-note"
}, me = { class: "library-note" }, ke = {
  key: 0,
  class: "library-group"
}, we = ["data-row", "onClick"], he = { class: "library-text" }, Ce = { class: "library-title" }, _e = { class: "library-abstract" }, ge = { class: "library-ref" }, $e = {
  __name: "DocumentLibrary",
  setup(s) {
    const y = [
      { key: "doc", label: "Documents" },
      { key: "report", label: "Reports" }
    ], u = [
      { key: "open", label: "Open" },
      { key: "closed", label: "Closed" }
    ], r = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], a = i("doc"), f = i("open"), C = i("newest"), k = i(""), w = i(null), S = X(), h = i([]), K = i(0), D = i(""), L = i(!1), g = i(!1), b = i({ title: "", abstract: "", body: "" }), B = i(""), I = O(() => ie(ue(se(h.value, k.value), C.value), C.value)), z = O(() => a.value === "doc" ? "Document" : "Report");
    async function T() {
      const l = a.value, e = f.value, t = await S.read(`document library --kind ${l} --state ${e}`);
      l !== a.value || e !== f.value || (D.value = t.ok ? "" : t.error, h.value = t.ok ? t.value.rows : [], K.value = t.ok ? t.value.total : 0, L.value = !0);
    }
    async function Z() {
      const l = a.value, e = f.value, t = await S.read(`document library --kind ${l} --state ${e} --after ${Math.max(...h.value.map((o) => o.id))}`);
      if (!t.ok) return void (D.value = t.error);
      l === a.value && e === f.value && (h.value = [...h.value, ...t.value.rows]);
    }
    function F(l) {
      w.value = l.id, oe(`${a.value === "doc" ? "docs" : "reports"}:${l.id}`);
    }
    async function j() {
      const { title: l, abstract: e, body: t } = b.value;
      if (!l.trim() || !e.trim()) return;
      const o = await S.run([a.value, "make", l.trim(), "--abstract", e.trim(), "--body", t.trim() || e.trim()]);
      B.value = o.ok ? "" : o.error, o.ok && (g.value = !1, b.value = { title: "", abstract: "", body: "" }, T());
    }
    const q = () => {
      const l = $.value.find((e) => e.id === w.value);
      l && F(l);
    }, $ = O(() => I.value.flatMap((l) => l.rows));
    function G(l) {
      if (!$.value.length) return;
      const e = $.value.findIndex((t) => t.id === w.value);
      w.value = $.value[e < 0 ? 0 : Math.max(0, Math.min($.value.length - 1, e + l))].id;
    }
    function H() {
      w.value ? w.value = null : k.value = "";
    }
    return J([a, f], () => {
      w.value = null, h.value = [], L.value = !1, T();
    }), S.follow(["doc.*", "report.*"], T), T(), (l, e) => (n(), d("div", ve, [
      p(v(ee), {
        modelValue: k.value,
        "onUpdate:modelValue": e[4] || (e[4] = (t) => k.value = t),
        class: "library-bar"
      }, {
        default: x(() => [
          p(v(P), {
            options: y,
            value: a.value,
            onPick: e[0] || (e[0] = (t) => a.value = t)
          }, null, 8, ["value"]),
          p(v(P), {
            options: u,
            value: f.value,
            "data-library-state": "",
            onPick: e[1] || (e[1] = (t) => f.value = t)
          }, null, 8, ["value"]),
          p(v(P), {
            options: r,
            value: C.value,
            onPick: e[2] || (e[2] = (t) => C.value = t)
          }, null, 8, ["value"]),
          p(v(M), {
            small: "",
            bordered: "",
            "data-library-new": "",
            onClick: e[3] || (e[3] = (t) => g.value = !g.value)
          }, {
            default: x(() => [
              V("New " + m(z.value.toLowerCase()), 1)
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue"]),
      g.value ? (n(), d("form", {
        key: 0,
        class: "library-draft",
        "data-library-draft": "",
        onSubmit: R(j, ["prevent"])
      }, [
        E(c("input", {
          "onUpdate:modelValue": e[5] || (e[5] = (t) => b.value.title = t),
          placeholder: "Title",
          "aria-label": "Title"
        }, null, 512), [
          [U, b.value.title]
        ]),
        E(c("input", {
          "onUpdate:modelValue": e[6] || (e[6] = (t) => b.value.abstract = t),
          placeholder: "A short summary",
          "aria-label": "Abstract"
        }, null, 512), [
          [U, b.value.abstract]
        ]),
        E(c("textarea", {
          "onUpdate:modelValue": e[7] || (e[7] = (t) => b.value.body = t),
          rows: "4",
          placeholder: "The text",
          "aria-label": "Text"
        }, null, 512), [
          [U, b.value.body]
        ]),
        B.value ? (n(), d("p", ce, m(B.value), 1)) : _("", !0),
        c("div", ye, [
          p(v(M), {
            small: "",
            onClick: e[8] || (e[8] = (t) => g.value = !1)
          }, {
            default: x(() => [...e[12] || (e[12] = [
              V("Cancel", -1)
            ])]),
            _: 1
          }),
          p(v(M), {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !b.value.title.trim() || !b.value.abstract.trim(),
            "data-library-create": ""
          }, {
            default: x(() => [...e[13] || (e[13] = [
              V("Create", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : _("", !0),
      c("div", be, [
        c("div", {
          class: "library-list",
          tabindex: "0",
          "data-library-list": "",
          onKeydown: [
            e[10] || (e[10] = N(R((t) => G(1), ["prevent"]), ["down"])),
            e[11] || (e[11] = N(R((t) => G(-1), ["prevent"]), ["up"])),
            N(H, ["esc"]),
            N(R(q, ["self"]), ["enter"])
          ]
        }, [
          L.value ? D.value ? (n(), d("p", pe, m(D.value), 1)) : L.value && !I.value.length ? (n(), d(A, { key: 2 }, [
            c("p", me, m(k.value ? "Nothing matches the search" : `No ${y.find((t) => t.key === a.value).label.toLowerCase()} yet`), 1),
            k.value ? (n(), W(v(M), {
              key: 0,
              small: "",
              "data-library-clear": "",
              onClick: e[9] || (e[9] = (t) => k.value = "")
            }, {
              default: x(() => [...e[14] || (e[14] = [
                V("Clear the search", -1)
              ])]),
              _: 1
            })) : _("", !0)
          ], 64)) : _("", !0) : (n(), W(v(te), {
            key: 0,
            shape: "cards"
          })),
          (n(!0), d(A, null, Y(I.value, (t) => (n(), d(A, {
            key: t.key
          }, [
            t.title ? (n(), d("h3", ke, m(t.title), 1)) : _("", !0),
            (n(!0), d(A, null, Y(t.rows, (o) => (n(), d("button", {
              key: o.id,
              type: "button",
              class: Q(["library-row", { chosen: o.id === w.value }]),
              "data-row": o.id,
              onClick: (xe) => F(o)
            }, [
              p(v(ae), {
                name: "file",
                class: "library-icon"
              }),
              c("span", he, [
                c("span", Ce, m(o.title), 1),
                c("span", _e, m(o.abstract), 1),
                c("span", ge, m(z.value) + " " + m(o.id), 1)
              ]),
              p(v(le), {
                class: "library-age",
                at: o.updated_at
              }, null, 8, ["at"])
            ], 10, we))), 128))
          ], 64))), 128)),
          h.value.length < K.value && !k.value ? (n(), d("button", {
            key: 3,
            type: "button",
            class: "library-more",
            onClick: Z
          }, "Show more")) : _("", !0)
        ], 40, fe)
      ])
    ]));
  }
}, Le = /* @__PURE__ */ de($e, [["__scopeId", "data-v-bba0e4f5"]]);
export {
  Le as default
};
