/* @code-commandments-generated */
if (!document.getElementById("window-styles-8a48a5f980fa")) { const style = document.createElement("style"); style.id = "window-styles-8a48a5f980fa"; style.textContent = ".library-draft[data-v-a0c99d09]{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.library-draft-foot[data-v-a0c99d09]{display:flex;gap:6px;justify-content:flex-end}.library[data-v-a0c99d09]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-a0c99d09]{display:flex;gap:10px;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border)}.library-search[data-v-a0c99d09]{flex:1;min-width:0}.library-body[data-v-a0c99d09]{display:grid;flex:1;grid-template-columns:minmax(240px,2fr) 3fr;min-height:0}.library-list[data-v-a0c99d09]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-a0c99d09]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-a0c99d09]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-a0c99d09]:hover,.library-row.chosen[data-v-a0c99d09]{background:var(--hover)}.library-icon[data-v-a0c99d09]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-a0c99d09]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-a0c99d09]{font-weight:600}.library-abstract[data-v-a0c99d09]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-a0c99d09],.library-age[data-v-a0c99d09]{color:var(--text-3);font-size:12px}.library-reader[data-v-a0c99d09]{overflow-y:auto;padding:20px 28px}.reader-title[data-v-a0c99d09]{margin:0 0 6px;font-size:20px}.reader-abstract[data-v-a0c99d09]{margin:0 0 18px;color:var(--text-2)}.reader-empty[data-v-a0c99d09]{margin-top:120px;text-align:center}.reader-empty-title[data-v-a0c99d09]{margin:0 0 6px;font-weight:500}.reader-empty-text[data-v-a0c99d09],.library-more[data-v-a0c99d09]{margin:8px 12px;color:var(--muted);background:none;border:0;cursor:pointer}.library-note[data-v-a0c99d09]{margin:0;color:var(--text-2)}.library-note[data-v-a0c99d09]{padding:12px}\n"; document.head.appendChild(style); }
import { ref as u, computed as I, watch as J, openBlock as n, createElementBlock as v, createElementVNode as d, createVNode as f, unref as c, withCtx as T, createTextVNode as V, toDisplayString as m, withModifiers as R, withDirectives as E, vModelText as U, createCommentVNode as C, withKeys as M, createBlock as W, Fragment as N, renderList as Y, normalizeClass as Q } from "vue";
import { useWindow as X, SearchBar as ee, Segmented as P, Btn as O, Skeleton as te, Icon as ae, TimeAgo as le, peekRef as oe } from "@journal/window-kit";
const re = 1440 * 60 * 1e3, ne = [
  { key: "today", title: "Today", days: 1 },
  { key: "week", title: "Last 7 days", days: 7 },
  { key: "month", title: "Last 30 days", days: 30 },
  { key: "older", title: "Older", days: 1 / 0 }
];
function se(s, y) {
  const i = y.trim().toLowerCase();
  return i ? s.filter((r) => `${r.title} ${r.abstract}`.toLowerCase().includes(i)) : s;
}
function ie(s, y) {
  const i = [...s];
  return y === "title" ? i.sort((r, a) => r.title.localeCompare(a.title)) : i.sort((r, a) => String(a.updated_at).localeCompare(String(r.updated_at)));
}
function ue(s, y, i = Date.now()) {
  if (y === "title") return s.length ? [{ key: "all", title: "", rows: s }] : [];
  const r = ne.map((a) => ({ ...a, rows: [] }));
  for (const a of s) {
    const p = (i - Date.parse(a.updated_at)) / re;
    r.find((_) => p < _.days).rows.push(a);
  }
  return r.filter((a) => a.rows.length);
}
const de = (s, y) => {
  const i = s.__vccOpts || s;
  for (const [r, a] of y)
    i[r] = a;
  return i;
}, ve = { class: "library" }, ce = { class: "library-bar" }, ye = {
  key: 0,
  class: "library-note",
  role: "alert"
}, be = { class: "library-draft-foot" }, pe = { class: "library-body" }, fe = ["onKeydown"], me = {
  key: 1,
  class: "library-note"
}, ke = { class: "library-note" }, we = {
  key: 0,
  class: "library-group"
}, he = ["data-row", "onClick"], _e = { class: "library-text" }, Ce = { class: "library-title" }, ge = { class: "library-abstract" }, $e = { class: "library-ref" }, xe = {
  __name: "DocumentLibrary",
  setup(s) {
    const y = [
      { key: "doc", label: "Documents" },
      { key: "report", label: "Reports" }
    ], i = [
      { key: "open", label: "Open" },
      { key: "closed", label: "Closed" }
    ], r = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], a = u("doc"), p = u("open"), _ = u("newest"), k = u(""), w = u(null), x = X(), h = u([]), K = u(0), S = u(""), D = u(!1), g = u(!1), b = u({ title: "", abstract: "", body: "" }), A = u(""), B = I(() => ue(ie(se(h.value, k.value), _.value), _.value)), z = I(() => a.value === "doc" ? "Document" : "Report");
    async function L() {
      const l = a.value, e = p.value, t = await x.read(`document library --kind ${l} --state ${e}`);
      l !== a.value || e !== p.value || (S.value = t.ok ? "" : t.error, h.value = t.ok ? t.value.rows : [], K.value = t.ok ? t.value.total : 0, D.value = !0);
    }
    async function Z() {
      const l = a.value, e = p.value, t = await x.read(`document library --kind ${l} --state ${e} --after ${Math.max(...h.value.map((o) => o.id))}`);
      if (!t.ok) return void (S.value = t.error);
      l === a.value && e === p.value && (h.value = [...h.value, ...t.value.rows]);
    }
    function F(l) {
      w.value = l.id, oe(`${a.value === "doc" ? "docs" : "reports"}:${l.id}`);
    }
    async function j() {
      const { title: l, abstract: e, body: t } = b.value;
      if (!l.trim() || !e.trim()) return;
      const o = await x.run([a.value, "make", l.trim(), "--abstract", e.trim(), "--body", t.trim() || e.trim()]);
      A.value = o.ok ? "" : o.error, o.ok && (g.value = !1, b.value = { title: "", abstract: "", body: "" }, L());
    }
    const q = () => {
      const l = $.value.find((e) => e.id === w.value);
      l && F(l);
    }, $ = I(() => B.value.flatMap((l) => l.rows));
    function G(l) {
      if (!$.value.length) return;
      const e = $.value.findIndex((t) => t.id === w.value);
      w.value = $.value[e < 0 ? 0 : Math.max(0, Math.min($.value.length - 1, e + l))].id;
    }
    function H() {
      w.value ? w.value = null : k.value = "";
    }
    return J([a, p], () => {
      w.value = null, h.value = [], D.value = !1, L();
    }), x.follow(["doc.*", "report.*"], L), L(), (l, e) => (n(), v("div", ve, [
      d("div", ce, [
        f(c(ee), {
          modelValue: k.value,
          "onUpdate:modelValue": e[0] || (e[0] = (t) => k.value = t),
          class: "library-search"
        }, null, 8, ["modelValue"]),
        f(c(P), {
          options: y,
          value: a.value,
          onPick: e[1] || (e[1] = (t) => a.value = t)
        }, null, 8, ["value"]),
        f(c(P), {
          options: i,
          value: p.value,
          "data-library-state": "",
          onPick: e[2] || (e[2] = (t) => p.value = t)
        }, null, 8, ["value"]),
        f(c(P), {
          options: r,
          value: _.value,
          onPick: e[3] || (e[3] = (t) => _.value = t)
        }, null, 8, ["value"]),
        f(c(O), {
          small: "",
          bordered: "",
          "data-library-new": "",
          onClick: e[4] || (e[4] = (t) => g.value = !g.value)
        }, {
          default: T(() => [
            V("New " + m(z.value.toLowerCase()), 1)
          ]),
          _: 1
        })
      ]),
      g.value ? (n(), v("form", {
        key: 0,
        class: "library-draft",
        "data-library-draft": "",
        onSubmit: R(j, ["prevent"])
      }, [
        E(d("input", {
          "onUpdate:modelValue": e[5] || (e[5] = (t) => b.value.title = t),
          placeholder: "Title",
          "aria-label": "Title"
        }, null, 512), [
          [U, b.value.title]
        ]),
        E(d("input", {
          "onUpdate:modelValue": e[6] || (e[6] = (t) => b.value.abstract = t),
          placeholder: "One line on what it says",
          "aria-label": "Abstract"
        }, null, 512), [
          [U, b.value.abstract]
        ]),
        E(d("textarea", {
          "onUpdate:modelValue": e[7] || (e[7] = (t) => b.value.body = t),
          rows: "4",
          placeholder: "The text",
          "aria-label": "Text"
        }, null, 512), [
          [U, b.value.body]
        ]),
        A.value ? (n(), v("p", ye, m(A.value), 1)) : C("", !0),
        d("div", be, [
          f(c(O), {
            small: "",
            onClick: e[8] || (e[8] = (t) => g.value = !1)
          }, {
            default: T(() => [...e[12] || (e[12] = [
              V("Cancel", -1)
            ])]),
            _: 1
          }),
          f(c(O), {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !b.value.title.trim() || !b.value.abstract.trim(),
            "data-library-create": ""
          }, {
            default: T(() => [...e[13] || (e[13] = [
              V("Make it", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : C("", !0),
      d("div", pe, [
        d("div", {
          class: "library-list",
          tabindex: "0",
          "data-library-list": "",
          onKeydown: [
            e[10] || (e[10] = M(R((t) => G(1), ["prevent"]), ["down"])),
            e[11] || (e[11] = M(R((t) => G(-1), ["prevent"]), ["up"])),
            M(H, ["esc"]),
            M(R(q, ["self"]), ["enter"])
          ]
        }, [
          D.value ? S.value ? (n(), v("p", me, m(S.value), 1)) : D.value && !B.value.length ? (n(), v(N, { key: 2 }, [
            d("p", ke, m(k.value ? "Nothing matches the search" : `No ${y.find((t) => t.key === a.value).label.toLowerCase()} yet`), 1),
            k.value ? (n(), W(c(O), {
              key: 0,
              small: "",
              "data-library-clear": "",
              onClick: e[9] || (e[9] = (t) => k.value = "")
            }, {
              default: T(() => [...e[14] || (e[14] = [
                V("Clear the search", -1)
              ])]),
              _: 1
            })) : C("", !0)
          ], 64)) : C("", !0) : (n(), W(c(te), {
            key: 0,
            shape: "cards"
          })),
          (n(!0), v(N, null, Y(B.value, (t) => (n(), v(N, {
            key: t.key
          }, [
            t.title ? (n(), v("h3", we, m(t.title), 1)) : C("", !0),
            (n(!0), v(N, null, Y(t.rows, (o) => (n(), v("button", {
              key: o.id,
              type: "button",
              class: Q(["library-row", { chosen: o.id === w.value }]),
              "data-row": o.id,
              onClick: (Se) => F(o)
            }, [
              f(c(ae), {
                name: "file",
                class: "library-icon"
              }),
              d("span", _e, [
                d("span", Ce, m(o.title), 1),
                d("span", ge, m(o.abstract), 1),
                d("span", $e, m(z.value) + " " + m(o.id), 1)
              ]),
              f(c(le), {
                class: "library-age",
                at: o.updated_at
              }, null, 8, ["at"])
            ], 10, he))), 128))
          ], 64))), 128)),
          h.value.length < K.value && !k.value ? (n(), v("button", {
            key: 3,
            type: "button",
            class: "library-more",
            onClick: Z
          }, "Show more")) : C("", !0)
        ], 40, fe)
      ])
    ]));
  }
}, Te = /* @__PURE__ */ de(xe, [["__scopeId", "data-v-a0c99d09"]]);
export {
  Te as default
};
