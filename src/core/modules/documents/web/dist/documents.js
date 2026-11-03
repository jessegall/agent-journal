/* @code-commandments-generated */
if (!document.getElementById("window-styles-7b932633edbe")) { const style = document.createElement("style"); style.id = "window-styles-7b932633edbe"; style.textContent = ".library-draft[data-v-f27d9b19]{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.library-draft-foot[data-v-f27d9b19]{display:flex;gap:6px;justify-content:flex-end}.library[data-v-f27d9b19]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-f27d9b19]{display:flex;gap:10px;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border)}.library-search[data-v-f27d9b19]{flex:1;min-width:0}.library-body[data-v-f27d9b19]{display:grid;flex:1;grid-template-columns:minmax(240px,2fr) 3fr;min-height:0}.library-list[data-v-f27d9b19]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-f27d9b19]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-f27d9b19]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-f27d9b19]:hover,.library-row.chosen[data-v-f27d9b19]{background:var(--hover)}.library-icon[data-v-f27d9b19]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-f27d9b19]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-f27d9b19]{font-weight:600}.library-abstract[data-v-f27d9b19]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-f27d9b19],.library-age[data-v-f27d9b19]{color:var(--text-3);font-size:12px}.library-reader[data-v-f27d9b19]{overflow-y:auto;padding:20px 28px}.reader-title[data-v-f27d9b19]{margin:0 0 6px;font-size:20px}.reader-abstract[data-v-f27d9b19]{margin:0 0 18px;color:var(--text-2)}.reader-empty[data-v-f27d9b19]{margin-top:120px;text-align:center}.reader-empty-title[data-v-f27d9b19]{margin:0 0 6px;font-weight:500}.reader-empty-text[data-v-f27d9b19],.library-more[data-v-f27d9b19]{margin:8px 12px;color:var(--muted);background:none;border:0;cursor:pointer}.library-note[data-v-f27d9b19]{margin:0;color:var(--text-2)}.library-note[data-v-f27d9b19]{padding:12px}\n"; document.head.appendChild(style); }
import { ref as d, computed as A, watch as J, openBlock as n, createElementBlock as v, createElementVNode as s, createVNode as w, unref as c, withCtx as V, createTextVNode as R, toDisplayString as p, withModifiers as T, withDirectives as E, vModelText as U, createCommentVNode as C, withKeys as M, createBlock as W, Fragment as N, renderList as Y, normalizeClass as Q } from "vue";
import { useWindow as X, SearchBar as ee, Segmented as P, Btn as O, Skeleton as te, Icon as ae, age as le, peekRef as oe } from "@journal/window-kit";
const re = 1440 * 60 * 1e3, ne = [
  { key: "today", title: "Today", days: 1 },
  { key: "week", title: "Last 7 days", days: 7 },
  { key: "month", title: "Last 30 days", days: 30 },
  { key: "older", title: "Older", days: 1 / 0 }
];
function se(i, y) {
  const u = y.trim().toLowerCase();
  return u ? i.filter((r) => `${r.title} ${r.abstract}`.toLowerCase().includes(u)) : i;
}
function ie(i, y) {
  const u = [...i];
  return y === "title" ? u.sort((r, a) => r.title.localeCompare(a.title)) : u.sort((r, a) => String(a.updated_at).localeCompare(String(r.updated_at)));
}
function ue(i, y, u = Date.now()) {
  if (y === "title") return i.length ? [{ key: "all", title: "", rows: i }] : [];
  const r = ne.map((a) => ({ ...a, rows: [] }));
  for (const a of i) {
    const f = (u - Date.parse(a.updated_at)) / re;
    r.find((_) => f < _.days).rows.push(a);
  }
  return r.filter((a) => a.rows.length);
}
const de = (i, y) => {
  const u = i.__vccOpts || i;
  for (const [r, a] of y)
    u[r] = a;
  return u;
}, ve = {
  class: "library",
  "data-window-flush": ""
}, ce = { class: "library-bar" }, ye = {
  key: 0,
  class: "library-note",
  role: "alert"
}, be = { class: "library-draft-foot" }, pe = { class: "library-body" }, fe = ["onKeydown"], me = {
  key: 1,
  class: "library-note"
}, ke = { class: "library-note" }, we = {
  key: 0,
  class: "library-group"
}, he = ["data-row", "onClick"], _e = { class: "library-text" }, Ce = { class: "library-title" }, ge = { class: "library-abstract" }, $e = { class: "library-ref" }, xe = { class: "library-age" }, Se = {
  __name: "DocumentLibrary",
  setup(i) {
    const y = [
      { key: "doc", label: "Documents" },
      { key: "report", label: "Reports" }
    ], u = [
      { key: "open", label: "Open" },
      { key: "closed", label: "Closed" }
    ], r = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], a = d("doc"), f = d("open"), _ = d("newest"), m = d(""), k = d(null), x = X(), h = d([]), K = d(0), S = d(""), D = d(!1), g = d(!1), b = d({ title: "", abstract: "", body: "" }), B = d(""), I = A(() => ue(ie(se(h.value, m.value), _.value), _.value)), z = A(() => a.value === "doc" ? "Document" : "Report");
    async function L() {
      const l = a.value, e = f.value, t = await x.read(`document library --kind ${l} --state ${e}`);
      l !== a.value || e !== f.value || (S.value = t.ok ? "" : t.error, h.value = t.ok ? t.value.rows : [], K.value = t.ok ? t.value.total : 0, D.value = !0);
    }
    async function Z() {
      const l = a.value, e = f.value, t = await x.read(`document library --kind ${l} --state ${e} --after ${Math.max(...h.value.map((o) => o.id))}`);
      if (!t.ok) return void (S.value = t.error);
      l === a.value && e === f.value && (h.value = [...h.value, ...t.value.rows]);
    }
    function F(l) {
      k.value = l.id, oe(`${a.value === "doc" ? "docs" : "reports"}:${l.id}`);
    }
    async function j() {
      const { title: l, abstract: e, body: t } = b.value;
      if (!l.trim() || !e.trim()) return;
      const o = await x.run([a.value, "make", l.trim(), "--abstract", e.trim(), "--body", t.trim() || e.trim()]);
      B.value = o.ok ? "" : o.error, o.ok && (g.value = !1, b.value = { title: "", abstract: "", body: "" }, L());
    }
    const q = () => {
      const l = $.value.find((e) => e.id === k.value);
      l && F(l);
    }, $ = A(() => I.value.flatMap((l) => l.rows));
    function G(l) {
      if (!$.value.length) return;
      const e = $.value.findIndex((t) => t.id === k.value);
      k.value = $.value[e < 0 ? 0 : Math.max(0, Math.min($.value.length - 1, e + l))].id;
    }
    function H() {
      k.value ? k.value = null : m.value = "";
    }
    return J([a, f], () => {
      k.value = null, h.value = [], D.value = !1, L();
    }), x.follow(["doc.*", "report.*"], L), L(), (l, e) => (n(), v("div", ve, [
      s("div", ce, [
        w(c(ee), {
          modelValue: m.value,
          "onUpdate:modelValue": e[0] || (e[0] = (t) => m.value = t),
          class: "library-search",
          placeholder: "Search titles and abstracts"
        }, null, 8, ["modelValue"]),
        w(c(P), {
          options: y,
          value: a.value,
          onPick: e[1] || (e[1] = (t) => a.value = t)
        }, null, 8, ["value"]),
        w(c(P), {
          options: u,
          value: f.value,
          "data-library-state": "",
          onPick: e[2] || (e[2] = (t) => f.value = t)
        }, null, 8, ["value"]),
        w(c(P), {
          options: r,
          value: _.value,
          onPick: e[3] || (e[3] = (t) => _.value = t)
        }, null, 8, ["value"]),
        w(c(O), {
          small: "",
          bordered: "",
          "data-library-new": "",
          onClick: e[4] || (e[4] = (t) => g.value = !g.value)
        }, {
          default: V(() => [
            R("New " + p(z.value.toLowerCase()), 1)
          ]),
          _: 1
        })
      ]),
      g.value ? (n(), v("form", {
        key: 0,
        class: "library-draft",
        "data-library-draft": "",
        onSubmit: T(j, ["prevent"])
      }, [
        E(s("input", {
          "onUpdate:modelValue": e[5] || (e[5] = (t) => b.value.title = t),
          placeholder: "Title",
          "aria-label": "Title"
        }, null, 512), [
          [U, b.value.title]
        ]),
        E(s("input", {
          "onUpdate:modelValue": e[6] || (e[6] = (t) => b.value.abstract = t),
          placeholder: "One line on what it says",
          "aria-label": "Abstract"
        }, null, 512), [
          [U, b.value.abstract]
        ]),
        E(s("textarea", {
          "onUpdate:modelValue": e[7] || (e[7] = (t) => b.value.body = t),
          rows: "4",
          placeholder: "The text",
          "aria-label": "Text"
        }, null, 512), [
          [U, b.value.body]
        ]),
        B.value ? (n(), v("p", ye, p(B.value), 1)) : C("", !0),
        s("div", be, [
          w(c(O), {
            small: "",
            onClick: e[8] || (e[8] = (t) => g.value = !1)
          }, {
            default: V(() => [...e[12] || (e[12] = [
              R("Cancel", -1)
            ])]),
            _: 1
          }),
          w(c(O), {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !b.value.title.trim() || !b.value.abstract.trim(),
            "data-library-create": ""
          }, {
            default: V(() => [...e[13] || (e[13] = [
              R("Make it", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : C("", !0),
      s("div", pe, [
        s("div", {
          class: "library-list",
          tabindex: "0",
          "data-library-list": "",
          onKeydown: [
            e[10] || (e[10] = M(T((t) => G(1), ["prevent"]), ["down"])),
            e[11] || (e[11] = M(T((t) => G(-1), ["prevent"]), ["up"])),
            M(H, ["esc"]),
            M(T(q, ["self"]), ["enter"])
          ]
        }, [
          D.value ? S.value ? (n(), v("p", me, p(S.value), 1)) : D.value && !I.value.length ? (n(), v(N, { key: 2 }, [
            s("p", ke, p(m.value ? "Nothing matches the search" : `No ${y.find((t) => t.key === a.value).label.toLowerCase()} yet`), 1),
            m.value ? (n(), W(c(O), {
              key: 0,
              small: "",
              "data-library-clear": "",
              onClick: e[9] || (e[9] = (t) => m.value = "")
            }, {
              default: V(() => [...e[14] || (e[14] = [
                R("Clear the search", -1)
              ])]),
              _: 1
            })) : C("", !0)
          ], 64)) : C("", !0) : (n(), W(c(te), {
            key: 0,
            shape: "cards"
          })),
          (n(!0), v(N, null, Y(I.value, (t) => (n(), v(N, {
            key: t.key
          }, [
            t.title ? (n(), v("h3", we, p(t.title), 1)) : C("", !0),
            (n(!0), v(N, null, Y(t.rows, (o) => (n(), v("button", {
              key: o.id,
              type: "button",
              class: Q(["library-row", { chosen: o.id === k.value }]),
              "data-row": o.id,
              onClick: (De) => F(o)
            }, [
              w(c(ae), {
                name: "file",
                class: "library-icon"
              }),
              s("span", _e, [
                s("span", Ce, p(o.title), 1),
                s("span", ge, p(o.abstract), 1),
                s("span", $e, p(z.value) + " " + p(o.id), 1)
              ]),
              s("span", xe, p(c(le)(o.updated_at)), 1)
            ], 10, he))), 128))
          ], 64))), 128)),
          h.value.length < K.value && !m.value ? (n(), v("button", {
            key: 3,
            type: "button",
            class: "library-more",
            onClick: Z
          }, "Show more")) : C("", !0)
        ], 40, fe)
      ])
    ]));
  }
}, Re = /* @__PURE__ */ de(Se, [["__scopeId", "data-v-f27d9b19"]]);
export {
  Re as default
};
