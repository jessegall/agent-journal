/* @code-commandments-generated */
if (!document.getElementById("window-styles-7da3f7062cb0")) { const style = document.createElement("style"); style.id = "window-styles-7da3f7062cb0"; style.textContent = ".library-draft[data-v-69bc2dda]{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.library-draft-foot[data-v-69bc2dda]{display:flex;gap:6px;justify-content:flex-end}.library[data-v-69bc2dda]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-69bc2dda]{display:flex;gap:10px;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border)}.library-search[data-v-69bc2dda]{flex:1;min-width:0}.library-body[data-v-69bc2dda]{display:grid;flex:1;grid-template-columns:minmax(240px,2fr) 3fr;min-height:0}.library-list[data-v-69bc2dda]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-69bc2dda]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-69bc2dda]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-69bc2dda]:hover,.library-row.chosen[data-v-69bc2dda]{background:var(--hover)}.library-icon[data-v-69bc2dda]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-69bc2dda]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-69bc2dda]{font-weight:600}.library-abstract[data-v-69bc2dda]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-69bc2dda],.library-age[data-v-69bc2dda]{color:var(--text-3);font-size:12px}.library-reader[data-v-69bc2dda]{overflow-y:auto;padding:20px 28px}.reader-title[data-v-69bc2dda]{margin:0 0 6px;font-size:20px}.reader-abstract[data-v-69bc2dda]{margin:0 0 18px;color:var(--text-2)}.reader-empty[data-v-69bc2dda]{margin-top:120px;text-align:center}.reader-empty-title[data-v-69bc2dda]{margin:0 0 6px;font-weight:500}.reader-empty-text[data-v-69bc2dda],.library-more[data-v-69bc2dda]{margin:8px 12px;color:var(--muted);background:none;border:0;cursor:pointer}.library-note[data-v-69bc2dda]{margin:0;color:var(--text-2)}.library-note[data-v-69bc2dda]{padding:12px}\n"; document.head.appendChild(style); }
import { ref as c, computed as B, watch as J, openBlock as i, createElementBlock as v, createElementVNode as u, createVNode as w, unref as y, withCtx as L, createTextVNode as T, toDisplayString as p, withModifiers as V, withDirectives as E, vModelText as U, createCommentVNode as C, withKeys as R, createBlock as W, Fragment as N, renderList as Y, normalizeClass as Q } from "vue";
import { useWindow as X, TextInput as ee, Segmented as P, Btn as I, Skeleton as te, Icon as ae, peekRef as le } from "@journal/window-kit";
const oe = 1440 * 60 * 1e3, re = [
  { key: "today", title: "Today", days: 1 },
  { key: "week", title: "Last 7 days", days: 7 },
  { key: "month", title: "Last 30 days", days: 30 },
  { key: "older", title: "Older", days: 1 / 0 }
];
function ne(r, d) {
  const o = d.trim().toLowerCase();
  return o ? r.filter((s) => `${s.title} ${s.abstract}`.toLowerCase().includes(o)) : r;
}
function se(r, d) {
  const o = [...r];
  return d === "title" ? o.sort((s, a) => s.title.localeCompare(a.title)) : o.sort((s, a) => String(a.updated_at).localeCompare(String(s.updated_at)));
}
function ie(r, d, o = Date.now()) {
  if (d === "title") return r.length ? [{ key: "all", title: "", rows: r }] : [];
  const s = re.map((a) => ({ ...a, rows: [] }));
  for (const a of r) {
    const f = (o - Date.parse(a.updated_at)) / oe;
    s.find((_) => f < _.days).rows.push(a);
  }
  return s.filter((a) => a.rows.length);
}
function ue(r, d = Date.now()) {
  const o = Math.max(0, Math.round((d - Date.parse(r)) / 6e4));
  return o < 60 ? `${o}m` : o < 1440 ? `${Math.round(o / 60)}h` : `${Math.round(o / 1440)}d`;
}
const de = (r, d) => {
  const o = r.__vccOpts || r;
  for (const [s, a] of d)
    o[s] = a;
  return o;
}, ce = {
  class: "library",
  "data-window-flush": ""
}, ve = { class: "library-bar" }, ye = {
  key: 0,
  class: "library-note",
  role: "alert"
}, be = { class: "library-draft-foot" }, pe = { class: "library-body" }, fe = ["onKeydown"], me = {
  key: 1,
  class: "library-note"
}, ke = { class: "library-note" }, we = {
  key: 0,
  class: "library-group"
}, he = ["data-row", "onClick"], _e = { class: "library-text" }, Ce = { class: "library-title" }, $e = { class: "library-abstract" }, ge = { class: "library-ref" }, xe = { class: "library-age" }, Se = {
  __name: "DocumentLibrary",
  setup(r) {
    const d = [
      { key: "doc", label: "Documents" },
      { key: "report", label: "Reports" }
    ], o = [
      { key: "open", label: "Open" },
      { key: "closed", label: "Closed" }
    ], s = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], a = c("doc"), f = c("open"), _ = c("newest"), m = c(""), k = c(null), x = X(), h = c([]), K = c(0), S = c(""), D = c(!1), $ = c(!1), b = c({ title: "", abstract: "", body: "" }), O = c(""), A = B(() => ie(se(ne(h.value, m.value), _.value), _.value)), z = B(() => a.value === "doc" ? "Document" : "Report");
    async function M() {
      const l = a.value, e = f.value, t = await x.read(`document library --kind ${l} --state ${e}`);
      l !== a.value || e !== f.value || (S.value = t.ok ? "" : t.error, h.value = t.ok ? t.value.rows : [], K.value = t.ok ? t.value.total : 0, D.value = !0);
    }
    async function Z() {
      const l = a.value, e = f.value, t = await x.read(`document library --kind ${l} --state ${e} --after ${Math.max(...h.value.map((n) => n.id))}`);
      if (!t.ok) return void (S.value = t.error);
      l === a.value && e === f.value && (h.value = [...h.value, ...t.value.rows]);
    }
    function F(l) {
      k.value = l.id, le(`${a.value === "doc" ? "docs" : "reports"}:${l.id}`);
    }
    async function j() {
      const { title: l, abstract: e, body: t } = b.value;
      if (!l.trim() || !e.trim()) return;
      const n = await x.run([a.value, "make", l.trim(), "--abstract", e.trim(), "--body", t.trim() || e.trim()]);
      O.value = n.ok ? "" : n.error, n.ok && ($.value = !1, b.value = { title: "", abstract: "", body: "" }, M());
    }
    const q = () => {
      const l = g.value.find((e) => e.id === k.value);
      l && F(l);
    }, g = B(() => A.value.flatMap((l) => l.rows));
    function G(l) {
      if (!g.value.length) return;
      const e = g.value.findIndex((t) => t.id === k.value);
      k.value = g.value[e < 0 ? 0 : Math.max(0, Math.min(g.value.length - 1, e + l))].id;
    }
    function H() {
      k.value ? k.value = null : m.value = "";
    }
    return J([a, f], () => {
      k.value = null, h.value = [], D.value = !1, M();
    }), x.follow(["doc.*", "report.*"], M), M(), (l, e) => (i(), v("div", ce, [
      u("div", ve, [
        w(y(ee), {
          modelValue: m.value,
          "onUpdate:modelValue": e[0] || (e[0] = (t) => m.value = t),
          icon: "search",
          class: "library-search",
          placeholder: "Search titles and abstracts"
        }, null, 8, ["modelValue"]),
        w(y(P), {
          options: d,
          value: a.value,
          onPick: e[1] || (e[1] = (t) => a.value = t)
        }, null, 8, ["value"]),
        w(y(P), {
          options: o,
          value: f.value,
          "data-library-state": "",
          onPick: e[2] || (e[2] = (t) => f.value = t)
        }, null, 8, ["value"]),
        w(y(P), {
          options: s,
          value: _.value,
          onPick: e[3] || (e[3] = (t) => _.value = t)
        }, null, 8, ["value"]),
        w(y(I), {
          small: "",
          bordered: "",
          "data-library-new": "",
          onClick: e[4] || (e[4] = (t) => $.value = !$.value)
        }, {
          default: L(() => [
            T("New " + p(z.value.toLowerCase()), 1)
          ]),
          _: 1
        })
      ]),
      $.value ? (i(), v("form", {
        key: 0,
        class: "library-draft",
        "data-library-draft": "",
        onSubmit: V(j, ["prevent"])
      }, [
        E(u("input", {
          "onUpdate:modelValue": e[5] || (e[5] = (t) => b.value.title = t),
          placeholder: "Title",
          "aria-label": "Title"
        }, null, 512), [
          [U, b.value.title]
        ]),
        E(u("input", {
          "onUpdate:modelValue": e[6] || (e[6] = (t) => b.value.abstract = t),
          placeholder: "One line on what it says",
          "aria-label": "Abstract"
        }, null, 512), [
          [U, b.value.abstract]
        ]),
        E(u("textarea", {
          "onUpdate:modelValue": e[7] || (e[7] = (t) => b.value.body = t),
          rows: "4",
          placeholder: "The text",
          "aria-label": "Text"
        }, null, 512), [
          [U, b.value.body]
        ]),
        O.value ? (i(), v("p", ye, p(O.value), 1)) : C("", !0),
        u("div", be, [
          w(y(I), {
            small: "",
            onClick: e[8] || (e[8] = (t) => $.value = !1)
          }, {
            default: L(() => [...e[12] || (e[12] = [
              T("Cancel", -1)
            ])]),
            _: 1
          }),
          w(y(I), {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !b.value.title.trim() || !b.value.abstract.trim(),
            "data-library-create": ""
          }, {
            default: L(() => [...e[13] || (e[13] = [
              T("Make it", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : C("", !0),
      u("div", pe, [
        u("div", {
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
          D.value ? S.value ? (i(), v("p", me, p(S.value), 1)) : D.value && !A.value.length ? (i(), v(N, { key: 2 }, [
            u("p", ke, p(m.value ? "Nothing matches the search" : `No ${d.find((t) => t.key === a.value).label.toLowerCase()} yet`), 1),
            m.value ? (i(), W(y(I), {
              key: 0,
              small: "",
              "data-library-clear": "",
              onClick: e[9] || (e[9] = (t) => m.value = "")
            }, {
              default: L(() => [...e[14] || (e[14] = [
                T("Clear the search", -1)
              ])]),
              _: 1
            })) : C("", !0)
          ], 64)) : C("", !0) : (i(), W(y(te), {
            key: 0,
            shape: "cards"
          })),
          (i(!0), v(N, null, Y(A.value, (t) => (i(), v(N, {
            key: t.key
          }, [
            t.title ? (i(), v("h3", we, p(t.title), 1)) : C("", !0),
            (i(!0), v(N, null, Y(t.rows, (n) => (i(), v("button", {
              key: n.id,
              type: "button",
              class: Q(["library-row", { chosen: n.id === k.value }]),
              "data-row": n.id,
              onClick: (De) => F(n)
            }, [
              w(y(ae), {
                name: "file",
                class: "library-icon"
              }),
              u("span", _e, [
                u("span", Ce, p(n.title), 1),
                u("span", $e, p(n.abstract), 1),
                u("span", ge, p(z.value) + " " + p(n.id), 1)
              ]),
              u("span", xe, p(y(ue)(n.updated_at)), 1)
            ], 10, he))), 128))
          ], 64))), 128)),
          h.value.length < K.value && !m.value ? (i(), v("button", {
            key: 3,
            type: "button",
            class: "library-more",
            onClick: Z
          }, "Show more")) : C("", !0)
        ], 40, fe)
      ])
    ]));
  }
}, Te = /* @__PURE__ */ de(Se, [["__scopeId", "data-v-69bc2dda"]]);
export {
  Te as default
};
