import { useCssVars as re, ref as p, watch as H, computed as W, onUnmounted as oe, openBlock as s, createElementBlock as v, createVNode as w, unref as r, withCtx as x, createTextVNode as A, toDisplayString as k, withModifiers as N, withDirectives as Y, createElementVNode as b, vModelText as Z, createCommentVNode as S, withKeys as P, createBlock as B, Fragment as U, renderList as J, resolveDynamicComponent as se, normalizeClass as ne } from "vue";
import { useWindow as ie, SearchBar as ue, Segmented as j, Btn as E, Skeleton as de, Icon as ce, TimeAgo as ve, DocumentBody as ye, steppedItem as be } from "@journal/window-kit";
import { d as fe } from "./documentRead-Dr2B0M3c.js";
const me = 1440 * 60 * 1e3, pe = [
  { key: "today", title: "Today", days: 1 },
  { key: "week", title: "Last 7 days", days: 7 },
  { key: "month", title: "Last 30 days", days: 30 },
  { key: "older", title: "Older", days: 1 / 0 }
];
function ke(l, f) {
  const c = f.trim().toLowerCase();
  return c ? l.filter((i) => `${i.title} ${i.abstract}`.toLowerCase().includes(c)) : l;
}
function we(l, f) {
  const c = [...l];
  return f === "title" ? c.sort((i, u) => i.title.localeCompare(u.title)) : c.sort((i, u) => String(u.updated_at).localeCompare(String(i.updated_at)));
}
function he(l, f, c = Date.now()) {
  if (f === "title") return l.length ? [{ key: "all", title: "", rows: l }] : [];
  const i = pe.map((u) => ({ ...u, rows: [] }));
  for (const u of l) {
    const $ = (c - Date.parse(u.updated_at)) / me;
    i.find((o) => $ < o.days).rows.push(u);
  }
  return i.filter((u) => u.rows.length);
}
const Ce = (l, f) => {
  const c = l.__vccOpts || l;
  for (const [i, u] of f)
    c[i] = u;
  return c;
}, ge = { class: "library" }, Se = {
  key: 0,
  class: "library-note",
  role: "alert"
}, xe = { class: "library-draft-foot" }, $e = { class: "library-body" }, De = {
  key: 1,
  class: "library-note"
}, Le = { class: "library-note" }, Te = {
  key: 0,
  class: "library-group"
}, Re = { class: "library-text" }, Ve = { class: "library-title" }, Ae = { class: "library-abstract" }, Ne = { class: "library-ref" }, Pe = {
  key: 0,
  class: "library-reader",
  "data-library-reader": ""
}, Be = {
  key: 1,
  class: "reader-empty-title"
}, Ue = "documents.page", Ee = {
  __name: "DocumentLibrary",
  props: { reader: { type: Boolean, default: !1 } },
  setup(l) {
    re((a) => ({
      v43ca2cf9: l.reader ? "minmax(240px, 2fr) 3fr" : "1fr"
    }));
    const f = [
      { key: "doc", label: "Documents" },
      { key: "report", label: "Reports" }
    ], c = [
      { key: "open", label: "Open" },
      { key: "closed", label: "Closed" }
    ], i = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], $ = l.reader ? (new URLSearchParams(globalThis.location.search).get("doc") ?? "").split(":") : [], o = p(["doc", "report"].includes($[0]) ? $[0] : "doc"), h = p("open"), R = p("newest"), C = p(""), y = p(Number($[1]) || null), d = ie();
    d.state["library.type"] = o.value, d.state["library.state"] = h.value;
    const D = d.props.library, g = p([]), I = p(0), { failure: L, loaded: V } = D;
    H(D.data, (a) => {
      g.value = a.rows, I.value = a.total;
    }, { once: !0 });
    const T = p(!1), m = p({ title: "", abstract: "", body: "" }), O = p(""), M = W(() => he(we(ke(g.value, C.value), R.value), R.value)), _ = W(() => o.value === "doc" ? "Document" : "Report");
    async function G() {
      const a = o.value, e = h.value;
      d.state["library.type"] = a, d.state["library.state"] = e, delete d.state["library.before"];
      const t = await d.reload("library");
      a !== o.value || e !== h.value || (g.value = t && !L.value ? D.data.value.rows : [], I.value = t && !L.value ? D.data.value.total : 0, V.value = !0);
    }
    async function Q() {
      const a = o.value, e = h.value;
      d.state["library.before"] = String(Math.min(...g.value.map((n) => n.id)));
      const t = await d.reload("library");
      delete d.state["library.before"], !(!t || L.value) && a === o.value && e === h.value && (g.value = [...g.value, ...D.data.value.rows]);
    }
    const X = fe(d);
    function ee(a) {
      y.value = a.id;
    }
    const q = (a) => {
      const e = new URL(globalThis.location.href);
      for (const t of ["view", "float"]) e.searchParams.delete(t);
      return e.searchParams.set("page", Ue), e.searchParams.set("doc", `${o.value}:${a.id}`), e.search;
    }, te = () => {
      const a = K.value.find((e) => e.id === y.value);
      a && globalThis.location.assign(q(a));
    };
    async function ae() {
      const { title: a, abstract: e, body: t } = m.value;
      if (!a.trim() || !e.trim()) return;
      const n = await d.run([o.value, "make", a.trim(), "--abstract", e.trim(), "--body", t.trim() || e.trim()]);
      O.value = n.ok ? "" : n.error, n.ok && (T.value = !1, m.value = { title: "", abstract: "", body: "" }, G());
    }
    const K = W(() => M.value.flatMap((a) => a.rows));
    function F(a) {
      K.value.length && (y.value = be(K.value.map((e) => e.id), y.value, a));
    }
    function le() {
      y.value ? y.value = null : C.value = "";
    }
    H([o, h], () => {
      y.value = null, g.value = [], V.value = !1, G();
    });
    const z = d.follow(["doc.*", "report.*"], G);
    return oe(() => z == null ? void 0 : z()), (a, e) => (s(), v("div", ge, [
      w(r(ue), {
        modelValue: C.value,
        "onUpdate:modelValue": e[4] || (e[4] = (t) => C.value = t),
        class: "library-bar"
      }, {
        default: x(() => [
          w(r(j), {
            options: f,
            value: o.value,
            onPick: e[0] || (e[0] = (t) => o.value = t)
          }, null, 8, ["value"]),
          w(r(j), {
            options: c,
            value: h.value,
            "data-library-state": "",
            onPick: e[1] || (e[1] = (t) => h.value = t)
          }, null, 8, ["value"]),
          w(r(j), {
            options: i,
            value: R.value,
            onPick: e[2] || (e[2] = (t) => R.value = t)
          }, null, 8, ["value"]),
          w(r(E), {
            small: "",
            bordered: "",
            "data-library-new": "",
            onClick: e[3] || (e[3] = (t) => T.value = !T.value)
          }, {
            default: x(() => [
              A("New " + k(_.value.toLowerCase()), 1)
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue"]),
      T.value ? (s(), v("form", {
        key: 0,
        class: "library-draft",
        "data-library-draft": "",
        onSubmit: N(ae, ["prevent"])
      }, [
        Y(b("input", {
          "onUpdate:modelValue": e[5] || (e[5] = (t) => m.value.title = t),
          placeholder: "Title",
          "aria-label": "Title"
        }, null, 512), [
          [Z, m.value.title]
        ]),
        Y(b("input", {
          "onUpdate:modelValue": e[6] || (e[6] = (t) => m.value.abstract = t),
          placeholder: "A short summary",
          "aria-label": "Abstract"
        }, null, 512), [
          [Z, m.value.abstract]
        ]),
        Y(b("textarea", {
          "onUpdate:modelValue": e[7] || (e[7] = (t) => m.value.body = t),
          rows: "4",
          placeholder: "The text",
          "aria-label": "Text"
        }, null, 512), [
          [Z, m.value.body]
        ]),
        O.value ? (s(), v("p", Se, k(O.value), 1)) : S("", !0),
        b("div", xe, [
          w(r(E), {
            small: "",
            onClick: e[8] || (e[8] = (t) => T.value = !1)
          }, {
            default: x(() => [...e[13] || (e[13] = [
              A("Cancel", -1)
            ])]),
            _: 1
          }),
          w(r(E), {
            small: "",
            variant: "primary",
            type: "submit",
            disabled: !m.value.title.trim() || !m.value.abstract.trim(),
            "data-library-create": ""
          }, {
            default: x(() => [...e[14] || (e[14] = [
              A("Create", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : S("", !0),
      b("div", $e, [
        b("div", {
          class: "library-list",
          tabindex: "0",
          "data-library-list": "",
          onKeydown: [
            e[10] || (e[10] = P(N((t) => F(1), ["prevent"]), ["down"])),
            e[11] || (e[11] = P(N((t) => F(-1), ["prevent"]), ["up"])),
            P(le, ["esc"]),
            e[12] || (e[12] = P(N((t) => !l.reader && te(), ["self"]), ["enter"]))
          ]
        }, [
          r(V) ? r(L) ? (s(), v("p", De, k(r(L)), 1)) : r(V) && !M.value.length ? (s(), v(U, { key: 2 }, [
            b("p", Le, k(C.value ? "Nothing matches the search" : `No ${f.find((t) => t.key === o.value).label.toLowerCase()} yet`), 1),
            C.value ? (s(), B(r(E), {
              key: 0,
              small: "",
              "data-library-clear": "",
              onClick: e[9] || (e[9] = (t) => C.value = "")
            }, {
              default: x(() => [...e[15] || (e[15] = [
                A("Clear the search", -1)
              ])]),
              _: 1
            })) : S("", !0)
          ], 64)) : S("", !0) : (s(), B(r(de), {
            key: 0,
            shape: "cards"
          })),
          (s(!0), v(U, null, J(M.value, (t) => (s(), v(U, {
            key: t.key
          }, [
            t.title ? (s(), v("h3", Te, k(t.title), 1)) : S("", !0),
            (s(!0), v(U, null, J(t.rows, (n) => (s(), B(se(l.reader ? "button" : "a"), {
              key: n.id,
              type: l.reader ? "button" : void 0,
              href: l.reader ? void 0 : q(n),
              class: ne(["library-row", { chosen: n.id === y.value }]),
              "data-row": n.id,
              onClick: (Ie) => l.reader && ee(n)
            }, {
              default: x(() => [
                w(r(ce), {
                  name: "file",
                  class: "library-icon"
                }),
                b("span", Re, [
                  b("span", Ve, k(n.title), 1),
                  b("span", Ae, k(n.abstract), 1),
                  b("span", Ne, k(_.value) + " " + k(n.id), 1)
                ]),
                w(r(ve), {
                  class: "library-age",
                  at: n.updated_at
                }, null, 8, ["at"])
              ]),
              _: 2
            }, 1032, ["type", "href", "class", "data-row", "onClick"]))), 128))
          ], 64))), 128)),
          g.value.length < I.value && !C.value ? (s(), v("button", {
            key: 3,
            type: "button",
            class: "library-more",
            onClick: Q
          }, "Show more")) : S("", !0)
        ], 32),
        l.reader ? (s(), v("div", Pe, [
          y.value ? (s(), B(r(ye), {
            key: `${o.value}:${y.value}`,
            term: o.value,
            id: y.value,
            read: r(X)
          }, null, 8, ["term", "id", "read"])) : (s(), v("p", Be, "Choose a " + k(_.value.toLowerCase()) + " to read it here", 1))
        ])) : S("", !0)
      ])
    ]));
  }
}, Ge = /* @__PURE__ */ Ce(Ee, [["__scopeId", "data-v-9c3cb4d4"]]);
export {
  Ge as D
};
