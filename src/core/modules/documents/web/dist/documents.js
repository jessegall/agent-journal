/* @code-commandments-generated */
if (!document.getElementById("window-styles-70e2e2dab297")) { const style = document.createElement("style"); style.id = "window-styles-70e2e2dab297"; style.textContent = ".library-draft[data-v-32c7e86b]{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.library-draft-foot[data-v-32c7e86b]{display:flex;gap:6px;justify-content:flex-end}.library[data-v-32c7e86b]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-32c7e86b]{gap:10px}.library-body[data-v-32c7e86b]{display:grid;flex:1;grid-template-columns:minmax(240px,2fr) 3fr;min-height:0}.library-list[data-v-32c7e86b]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-32c7e86b]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-32c7e86b]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-32c7e86b]:hover,.library-row.chosen[data-v-32c7e86b]{background:var(--hover)}.library-icon[data-v-32c7e86b]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-32c7e86b]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-32c7e86b]{font-weight:600}.library-abstract[data-v-32c7e86b]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-32c7e86b],.library-age[data-v-32c7e86b]{color:var(--text-3);font-size:12px}.library-reader[data-v-32c7e86b]{overflow-y:auto;padding:20px 28px}.reader-title[data-v-32c7e86b]{margin:0 0 6px;font-size:20px}.reader-abstract[data-v-32c7e86b]{margin:0 0 18px;color:var(--text-2)}.reader-empty[data-v-32c7e86b]{margin-top:120px;text-align:center}.reader-empty-title[data-v-32c7e86b]{margin:0 0 6px;font-weight:500}.reader-empty-text[data-v-32c7e86b],.library-more[data-v-32c7e86b]{margin:8px 12px;color:var(--muted);background:none;border:0;cursor:pointer}.library-note[data-v-32c7e86b]{margin:0;color:var(--text-2)}.library-note[data-v-32c7e86b]{padding:12px}\n"; document.head.appendChild(style); }
import { ref as i, computed as E, watch as J, openBlock as s, createElementBlock as d, createVNode as f, unref as v, withCtx as $, createTextVNode as T, toDisplayString as m, withModifiers as V, withDirectives as M, createElementVNode as c, vModelText as U, createCommentVNode as h, withKeys as R, createBlock as W, Fragment as N, renderList as Y, normalizeClass as Q } from "vue";
import { useWindow as X, SearchBar as ee, Segmented as P, Btn as A, Skeleton as te, Icon as ae, TimeAgo as le, steppedItem as oe, peekRef as re } from "@journal/window-kit";
const se = 1440 * 60 * 1e3, ne = [
  { key: "today", title: "Today", days: 1 },
  { key: "week", title: "Last 7 days", days: 7 },
  { key: "month", title: "Last 30 days", days: 30 },
  { key: "older", title: "Older", days: 1 / 0 }
];
function ue(n, y) {
  const u = y.trim().toLowerCase();
  return u ? n.filter((r) => `${r.title} ${r.abstract}`.toLowerCase().includes(u)) : n;
}
function ie(n, y) {
  const u = [...n];
  return y === "title" ? u.sort((r, a) => r.title.localeCompare(a.title)) : u.sort((r, a) => String(a.updated_at).localeCompare(String(r.updated_at)));
}
function de(n, y, u = Date.now()) {
  if (y === "title") return n.length ? [{ key: "all", title: "", rows: n }] : [];
  const r = ne.map((a) => ({ ...a, rows: [] }));
  for (const a of n) {
    const p = (u - Date.parse(a.updated_at)) / se;
    r.find((_) => p < _.days).rows.push(a);
  }
  return r.filter((a) => a.rows.length);
}
const ve = (n, y) => {
  const u = n.__vccOpts || n;
  for (const [r, a] of y)
    u[r] = a;
  return u;
}, ce = { class: "library" }, ye = {
  key: 0,
  class: "library-note",
  role: "alert"
}, be = { class: "library-draft-foot" }, pe = { class: "library-body" }, fe = ["onKeydown"], me = {
  key: 1,
  class: "library-note"
}, ke = { class: "library-note" }, we = {
  key: 0,
  class: "library-group"
}, Ce = ["data-row", "onClick"], _e = { class: "library-text" }, he = { class: "library-title" }, ge = { class: "library-abstract" }, $e = { class: "library-ref" }, Se = {
  __name: "DocumentLibrary",
  setup(n) {
    const y = [
      { key: "doc", label: "Documents" },
      { key: "report", label: "Reports" }
    ], u = [
      { key: "open", label: "Open" },
      { key: "closed", label: "Closed" }
    ], r = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], a = i("doc"), p = i("open"), _ = i("newest"), k = i(""), w = i(null), S = X(), C = i([]), K = i(0), x = i(""), D = i(!1), g = i(!1), b = i({ title: "", abstract: "", body: "" }), B = i(""), I = E(() => de(ie(ue(C.value, k.value), _.value), _.value)), z = E(() => a.value === "doc" ? "Document" : "Report");
    async function L() {
      const l = a.value, e = p.value, t = await S.read(`document library --kind ${l} --state ${e}`);
      l !== a.value || e !== p.value || (x.value = t.ok ? "" : t.error, C.value = t.ok ? t.value.rows : [], K.value = t.ok ? t.value.total : 0, D.value = !0);
    }
    async function Z() {
      const l = a.value, e = p.value, t = await S.read(`document library --kind ${l} --state ${e} --after ${Math.max(...C.value.map((o) => o.id))}`);
      if (!t.ok) return void (x.value = t.error);
      l === a.value && e === p.value && (C.value = [...C.value, ...t.value.rows]);
    }
    function F(l) {
      w.value = l.id, re(`${a.value === "doc" ? "docs" : "reports"}:${l.id}`);
    }
    async function j() {
      const { title: l, abstract: e, body: t } = b.value;
      if (!l.trim() || !e.trim()) return;
      const o = await S.run([a.value, "make", l.trim(), "--abstract", e.trim(), "--body", t.trim() || e.trim()]);
      B.value = o.ok ? "" : o.error, o.ok && (g.value = !1, b.value = { title: "", abstract: "", body: "" }, L());
    }
    const q = () => {
      const l = O.value.find((e) => e.id === w.value);
      l && F(l);
    }, O = E(() => I.value.flatMap((l) => l.rows));
    function G(l) {
      O.value.length && (w.value = oe(O.value.map((e) => e.id), w.value, l));
    }
    function H() {
      w.value ? w.value = null : k.value = "";
    }
    return J([a, p], () => {
      w.value = null, C.value = [], D.value = !1, L();
    }), S.follow(["doc.*", "report.*"], L), L(), (l, e) => (s(), d("div", ce, [
      f(v(ee), {
        modelValue: k.value,
        "onUpdate:modelValue": e[4] || (e[4] = (t) => k.value = t),
        class: "library-bar"
      }, {
        default: $(() => [
          f(v(P), {
            options: y,
            value: a.value,
            onPick: e[0] || (e[0] = (t) => a.value = t)
          }, null, 8, ["value"]),
          f(v(P), {
            options: u,
            value: p.value,
            "data-library-state": "",
            onPick: e[1] || (e[1] = (t) => p.value = t)
          }, null, 8, ["value"]),
          f(v(P), {
            options: r,
            value: _.value,
            onPick: e[2] || (e[2] = (t) => _.value = t)
          }, null, 8, ["value"]),
          f(v(A), {
            small: "",
            bordered: "",
            "data-library-new": "",
            onClick: e[3] || (e[3] = (t) => g.value = !g.value)
          }, {
            default: $(() => [
              T("New " + m(z.value.toLowerCase()), 1)
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue"]),
      g.value ? (s(), d("form", {
        key: 0,
        class: "library-draft",
        "data-library-draft": "",
        onSubmit: V(j, ["prevent"])
      }, [
        M(c("input", {
          "onUpdate:modelValue": e[5] || (e[5] = (t) => b.value.title = t),
          placeholder: "Title",
          "aria-label": "Title"
        }, null, 512), [
          [U, b.value.title]
        ]),
        M(c("input", {
          "onUpdate:modelValue": e[6] || (e[6] = (t) => b.value.abstract = t),
          placeholder: "A short summary",
          "aria-label": "Abstract"
        }, null, 512), [
          [U, b.value.abstract]
        ]),
        M(c("textarea", {
          "onUpdate:modelValue": e[7] || (e[7] = (t) => b.value.body = t),
          rows: "4",
          placeholder: "The text",
          "aria-label": "Text"
        }, null, 512), [
          [U, b.value.body]
        ]),
        B.value ? (s(), d("p", ye, m(B.value), 1)) : h("", !0),
        c("div", be, [
          f(v(A), {
            small: "",
            onClick: e[8] || (e[8] = (t) => g.value = !1)
          }, {
            default: $(() => [...e[12] || (e[12] = [
              T("Cancel", -1)
            ])]),
            _: 1
          }),
          f(v(A), {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !b.value.title.trim() || !b.value.abstract.trim(),
            "data-library-create": ""
          }, {
            default: $(() => [...e[13] || (e[13] = [
              T("Create", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : h("", !0),
      c("div", pe, [
        c("div", {
          class: "library-list",
          tabindex: "0",
          "data-library-list": "",
          onKeydown: [
            e[10] || (e[10] = R(V((t) => G(1), ["prevent"]), ["down"])),
            e[11] || (e[11] = R(V((t) => G(-1), ["prevent"]), ["up"])),
            R(H, ["esc"]),
            R(V(q, ["self"]), ["enter"])
          ]
        }, [
          D.value ? x.value ? (s(), d("p", me, m(x.value), 1)) : D.value && !I.value.length ? (s(), d(N, { key: 2 }, [
            c("p", ke, m(k.value ? "Nothing matches the search" : `No ${y.find((t) => t.key === a.value).label.toLowerCase()} yet`), 1),
            k.value ? (s(), W(v(A), {
              key: 0,
              small: "",
              "data-library-clear": "",
              onClick: e[9] || (e[9] = (t) => k.value = "")
            }, {
              default: $(() => [...e[14] || (e[14] = [
                T("Clear the search", -1)
              ])]),
              _: 1
            })) : h("", !0)
          ], 64)) : h("", !0) : (s(), W(v(te), {
            key: 0,
            shape: "cards"
          })),
          (s(!0), d(N, null, Y(I.value, (t) => (s(), d(N, {
            key: t.key
          }, [
            t.title ? (s(), d("h3", we, m(t.title), 1)) : h("", !0),
            (s(!0), d(N, null, Y(t.rows, (o) => (s(), d("button", {
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
              c("span", _e, [
                c("span", he, m(o.title), 1),
                c("span", ge, m(o.abstract), 1),
                c("span", $e, m(z.value) + " " + m(o.id), 1)
              ]),
              f(v(le), {
                class: "library-age",
                at: o.updated_at
              }, null, 8, ["at"])
            ], 10, Ce))), 128))
          ], 64))), 128)),
          C.value.length < K.value && !k.value ? (s(), d("button", {
            key: 3,
            type: "button",
            class: "library-more",
            onClick: Z
          }, "Show more")) : h("", !0)
        ], 40, fe)
      ])
    ]));
  }
}, Te = /* @__PURE__ */ ve(Se, [["__scopeId", "data-v-32c7e86b"]]);
export {
  Te as default
};
