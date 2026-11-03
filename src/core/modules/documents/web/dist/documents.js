/* @code-commandments-generated */
if (!document.getElementById("window-styles-b0c90a36eaaa")) { const style = document.createElement("style"); style.id = "window-styles-b0c90a36eaaa"; style.textContent = ".library-draft[data-v-0a15759d]{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.library-draft-foot[data-v-0a15759d]{display:flex;gap:6px;justify-content:flex-end}.library[data-v-0a15759d]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-0a15759d]{gap:10px}.library-body[data-v-0a15759d]{display:grid;flex:1;grid-template-columns:minmax(240px,2fr) 3fr;min-height:0}.library-list[data-v-0a15759d]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-0a15759d]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-0a15759d]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-0a15759d]:hover,.library-row.chosen[data-v-0a15759d]{background:var(--hover)}.library-icon[data-v-0a15759d]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-0a15759d]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-0a15759d]{font-weight:600}.library-abstract[data-v-0a15759d]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-0a15759d],.library-age[data-v-0a15759d]{color:var(--text-3);font-size:12px}.library-reader[data-v-0a15759d]{overflow-y:auto;padding:20px 28px}.reader-title[data-v-0a15759d]{margin:0 0 6px;font-size:20px}.reader-abstract[data-v-0a15759d]{margin:0 0 18px;color:var(--text-2)}.reader-empty[data-v-0a15759d]{margin-top:120px;text-align:center}.reader-empty-title[data-v-0a15759d]{margin:0 0 6px;font-weight:500}.reader-empty-text[data-v-0a15759d],.library-more[data-v-0a15759d]{margin:8px 12px;color:var(--muted);background:none;border:0;cursor:pointer}.library-note[data-v-0a15759d]{margin:0;color:var(--text-2)}.library-note[data-v-0a15759d]{padding:12px}\n"; document.head.appendChild(style); }
import { ref as u, computed as I, watch as J, openBlock as n, createElementBlock as d, createVNode as f, unref as v, withCtx as x, createTextVNode as V, toDisplayString as m, withModifiers as R, withDirectives as E, createElementVNode as c, vModelText as U, createCommentVNode as _, withKeys as M, createBlock as W, Fragment as N, renderList as Y, normalizeClass as Q } from "vue";
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
    r.find((C) => p < C.days).rows.push(a);
  }
  return r.filter((a) => a.rows.length);
}
const de = (s, y) => {
  const i = s.__vccOpts || s;
  for (const [r, a] of y)
    i[r] = a;
  return i;
}, ve = { class: "library" }, ce = {
  key: 0,
  class: "library-note",
  role: "alert"
}, ye = { class: "library-draft-foot" }, be = { class: "library-body" }, pe = ["onKeydown"], fe = {
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
    ], i = [
      { key: "open", label: "Open" },
      { key: "closed", label: "Closed" }
    ], r = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], a = u("doc"), p = u("open"), C = u("newest"), k = u(""), w = u(null), S = X(), h = u([]), K = u(0), D = u(""), L = u(!1), g = u(!1), b = u({ title: "", abstract: "", body: "" }), A = u(""), B = I(() => ue(ie(se(h.value, k.value), C.value), C.value)), z = I(() => a.value === "doc" ? "Document" : "Report");
    async function T() {
      const l = a.value, e = p.value, t = await S.read(`document library --kind ${l} --state ${e}`);
      l !== a.value || e !== p.value || (D.value = t.ok ? "" : t.error, h.value = t.ok ? t.value.rows : [], K.value = t.ok ? t.value.total : 0, L.value = !0);
    }
    async function Z() {
      const l = a.value, e = p.value, t = await S.read(`document library --kind ${l} --state ${e} --after ${Math.max(...h.value.map((o) => o.id))}`);
      if (!t.ok) return void (D.value = t.error);
      l === a.value && e === p.value && (h.value = [...h.value, ...t.value.rows]);
    }
    function F(l) {
      w.value = l.id, oe(`${a.value === "doc" ? "docs" : "reports"}:${l.id}`);
    }
    async function j() {
      const { title: l, abstract: e, body: t } = b.value;
      if (!l.trim() || !e.trim()) return;
      const o = await S.run([a.value, "make", l.trim(), "--abstract", e.trim(), "--body", t.trim() || e.trim()]);
      A.value = o.ok ? "" : o.error, o.ok && (g.value = !1, b.value = { title: "", abstract: "", body: "" }, T());
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
      w.value = null, h.value = [], L.value = !1, T();
    }), S.follow(["doc.*", "report.*"], T), T(), (l, e) => (n(), d("div", ve, [
      f(v(ee), {
        modelValue: k.value,
        "onUpdate:modelValue": e[4] || (e[4] = (t) => k.value = t),
        class: "library-bar"
      }, {
        default: x(() => [
          f(v(P), {
            options: y,
            value: a.value,
            onPick: e[0] || (e[0] = (t) => a.value = t)
          }, null, 8, ["value"]),
          f(v(P), {
            options: i,
            value: p.value,
            "data-library-state": "",
            onPick: e[1] || (e[1] = (t) => p.value = t)
          }, null, 8, ["value"]),
          f(v(P), {
            options: r,
            value: C.value,
            onPick: e[2] || (e[2] = (t) => C.value = t)
          }, null, 8, ["value"]),
          f(v(O), {
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
          placeholder: "One line on what it says",
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
        A.value ? (n(), d("p", ce, m(A.value), 1)) : _("", !0),
        c("div", ye, [
          f(v(O), {
            small: "",
            onClick: e[8] || (e[8] = (t) => g.value = !1)
          }, {
            default: x(() => [...e[12] || (e[12] = [
              V("Cancel", -1)
            ])]),
            _: 1
          }),
          f(v(O), {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !b.value.title.trim() || !b.value.abstract.trim(),
            "data-library-create": ""
          }, {
            default: x(() => [...e[13] || (e[13] = [
              V("Make it", -1)
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
            e[10] || (e[10] = M(R((t) => G(1), ["prevent"]), ["down"])),
            e[11] || (e[11] = M(R((t) => G(-1), ["prevent"]), ["up"])),
            M(H, ["esc"]),
            M(R(q, ["self"]), ["enter"])
          ]
        }, [
          L.value ? D.value ? (n(), d("p", fe, m(D.value), 1)) : L.value && !B.value.length ? (n(), d(N, { key: 2 }, [
            c("p", me, m(k.value ? "Nothing matches the search" : `No ${y.find((t) => t.key === a.value).label.toLowerCase()} yet`), 1),
            k.value ? (n(), W(v(O), {
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
          (n(!0), d(N, null, Y(B.value, (t) => (n(), d(N, {
            key: t.key
          }, [
            t.title ? (n(), d("h3", ke, m(t.title), 1)) : _("", !0),
            (n(!0), d(N, null, Y(t.rows, (o) => (n(), d("button", {
              key: o.id,
              type: "button",
              class: Q(["library-row", { chosen: o.id === w.value }]),
              "data-row": o.id,
              onClick: (xe) => F(o)
            }, [
              f(v(ae), {
                name: "file",
                class: "library-icon"
              }),
              c("span", he, [
                c("span", Ce, m(o.title), 1),
                c("span", _e, m(o.abstract), 1),
                c("span", ge, m(z.value) + " " + m(o.id), 1)
              ]),
              f(v(le), {
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
        ], 40, pe)
      ])
    ]));
  }
}, Le = /* @__PURE__ */ de($e, [["__scopeId", "data-v-0a15759d"]]);
export {
  Le as default
};
