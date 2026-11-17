import { ref as _, computed as P, openBlock as u, createElementBlock as p, createVNode as m, unref as s, withCtx as S, createTextVNode as x, toDisplayString as k, withModifiers as j, withDirectives as R, createElementVNode as y, vModelText as E, createCommentVNode as L, createBlock as U, Fragment as $, renderList as F, watch as G, onUnmounted as q } from "vue";
import { useWindow as z, SearchBar as H, Segmented as I, Btn as A, Skeleton as J, Icon as K, TimeAgo as Q, MoreButton as X, peekRef as ee } from "@journal/window-kit";
const te = (a, n) => {
  const r = a.__vccOpts || a;
  for (const [o, l] of n)
    r[o] = l;
  return r;
}, ae = 1440 * 60 * 1e3, le = [
  { key: "today", title: "Today", days: 1 },
  { key: "week", title: "Last 7 days", days: 7 },
  { key: "month", title: "Last 30 days", days: 30 },
  { key: "older", title: "Older", days: 1 / 0 }
];
function re(a, n) {
  const r = n.trim().toLowerCase();
  return r ? a.filter((o) => `${o.title} ${o.abstract}`.toLowerCase().includes(r)) : a;
}
function oe(a, n) {
  const r = [...a];
  return n === "title" ? r.sort((o, l) => o.title.localeCompare(l.title)) : r.sort((o, l) => String(l.updated_at).localeCompare(String(o.updated_at)));
}
function se(a, n, r = Date.now()) {
  if (n === "title") return a.length ? [{ key: "all", title: "", rows: a }] : [];
  const o = le.map((l) => ({ ...l, rows: [] }));
  for (const l of a) {
    const i = (r - Date.parse(l.updated_at)) / ae;
    o.find((v) => i < v.days).rows.push(l);
  }
  return o.filter((l) => l.rows.length);
}
const ne = { class: "library" }, ie = {
  key: 0,
  class: "library-note",
  role: "alert"
}, ue = { class: "library-draft-foot" }, de = { class: "library-body" }, ce = {
  class: "library-list",
  "data-library-list": ""
}, ye = {
  key: 1,
  class: "library-note"
}, ve = { class: "library-note" }, be = {
  key: 0,
  class: "library-group"
}, pe = ["data-row", "onClick"], fe = { class: "library-text" }, me = { class: "library-title" }, ke = { class: "library-abstract" }, _e = { class: "library-ref" };
function we(a, n, r) {
  const o = a.props.library, l = _([]), i = _(0), { failure: v, loaded: w } = o;
  a.state["library.type"] = n.value, a.state["library.state"] = r.value, G(o.data, (f) => {
    l.value = f.rows, i.value = f.total;
  }, { once: !0 });
  async function d() {
    const f = n.value, C = r.value;
    a.state["library.type"] = f, a.state["library.state"] = C, delete a.state["library.before"];
    const g = await a.reload("library");
    f !== n.value || C !== r.value || (l.value = g && !v.value ? o.data.value.rows : [], i.value = g && !v.value ? o.data.value.total : 0, w.value = !0);
  }
  async function V() {
    const f = n.value, C = r.value;
    a.state["library.before"] = String(Math.min(...l.value.map((B) => B.id)));
    const g = await a.reload("library");
    delete a.state["library.before"], !(!g || v.value) && f === n.value && C === r.value && (l.value = [...l.value, ...o.data.value.rows]);
  }
  G([n, r], () => {
    l.value = [], w.value = !1, d();
  });
  const h = a.follow(["doc.*", "report.*"], d);
  return q(() => h == null ? void 0 : h()), { rows: l, total: i, failure: v, loaded: w, load: d, more: V };
}
const Ce = {
  __name: "DocumentLibrary",
  setup(a) {
    const n = [
      { key: "doc", label: "Documents" },
      { key: "report", label: "Reports" }
    ], r = [
      { key: "open", label: "Open" },
      { key: "closed", label: "Closed" }
    ], o = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], l = { doc: "docs", report: "reports" }, i = _("doc"), v = _("open"), w = _("newest"), d = _(""), V = z(), { rows: h, total: f, failure: C, loaded: g, load: B, more: W } = we(V, i, v), D = _(!1), b = _({ title: "", abstract: "", body: "" }), N = _(""), M = P(() => se(oe(re(h.value, d.value), w.value), w.value)), O = P(() => i.value === "doc" ? "Document" : "Report"), Y = (T) => ee(`${l[i.value]}:${T.id}`);
    async function Z() {
      const { title: T, abstract: e, body: t } = b.value;
      if (!T.trim() || !e.trim()) return;
      const c = await V.run([i.value, "make", T.trim(), "--abstract", e.trim(), "--body", t.trim() || e.trim()]);
      N.value = c.ok ? "" : c.error, c.ok && (D.value = !1, b.value = { title: "", abstract: "", body: "" }, B());
    }
    return (T, e) => (u(), p("div", ne, [
      m(s(H), {
        modelValue: d.value,
        "onUpdate:modelValue": e[4] || (e[4] = (t) => d.value = t),
        class: "library-bar"
      }, {
        default: S(() => [
          m(s(I), {
            options: n,
            value: i.value,
            onPick: e[0] || (e[0] = (t) => i.value = t)
          }, null, 8, ["value"]),
          m(s(I), {
            options: r,
            value: v.value,
            "data-library-state": "",
            onPick: e[1] || (e[1] = (t) => v.value = t)
          }, null, 8, ["value"]),
          m(s(I), {
            options: o,
            value: w.value,
            onPick: e[2] || (e[2] = (t) => w.value = t)
          }, null, 8, ["value"]),
          m(s(A), {
            small: "",
            bordered: "",
            "data-library-new": "",
            onClick: e[3] || (e[3] = (t) => D.value = !D.value)
          }, {
            default: S(() => [
              x("New " + k(O.value.toLowerCase()), 1)
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue"]),
      D.value ? (u(), p("form", {
        key: 0,
        class: "library-draft",
        "data-library-draft": "",
        onSubmit: j(Z, ["prevent"])
      }, [
        R(y("input", {
          "onUpdate:modelValue": e[5] || (e[5] = (t) => b.value.title = t),
          placeholder: "Title",
          "aria-label": "Title"
        }, null, 512), [
          [E, b.value.title]
        ]),
        R(y("input", {
          "onUpdate:modelValue": e[6] || (e[6] = (t) => b.value.abstract = t),
          placeholder: "A short summary",
          "aria-label": "Abstract"
        }, null, 512), [
          [E, b.value.abstract]
        ]),
        R(y("textarea", {
          "onUpdate:modelValue": e[7] || (e[7] = (t) => b.value.body = t),
          rows: "4",
          placeholder: "The text",
          "aria-label": "Text"
        }, null, 512), [
          [E, b.value.body]
        ]),
        N.value ? (u(), p("p", ie, k(N.value), 1)) : L("", !0),
        y("div", ue, [
          m(s(A), {
            small: "",
            onClick: e[8] || (e[8] = (t) => D.value = !1)
          }, {
            default: S(() => [...e[10] || (e[10] = [
              x("Cancel", -1)
            ])]),
            _: 1
          }),
          m(s(A), {
            small: "",
            variant: "primary",
            type: "submit",
            disabled: !b.value.title.trim() || !b.value.abstract.trim(),
            "data-library-create": ""
          }, {
            default: S(() => [...e[11] || (e[11] = [
              x("Create", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : L("", !0),
      y("div", de, [
        y("div", ce, [
          s(g) ? s(C) ? (u(), p("p", ye, k(s(C)), 1)) : s(g) && !M.value.length ? (u(), p($, { key: 2 }, [
            y("p", ve, k(d.value ? "Nothing matches the search" : `No ${n.find((t) => t.key === i.value).label.toLowerCase()} yet`), 1),
            d.value ? (u(), U(s(A), {
              key: 0,
              small: "",
              "data-library-clear": "",
              onClick: e[9] || (e[9] = (t) => d.value = "")
            }, {
              default: S(() => [...e[12] || (e[12] = [
                x("Clear the search", -1)
              ])]),
              _: 1
            })) : L("", !0)
          ], 64)) : L("", !0) : (u(), U(s(J), {
            key: 0,
            shape: "cards"
          })),
          (u(!0), p($, null, F(M.value, (t) => (u(), p($, {
            key: t.key
          }, [
            t.title ? (u(), p("h3", be, k(t.title), 1)) : L("", !0),
            (u(!0), p($, null, F(t.rows, (c) => (u(), p("button", {
              key: c.id,
              type: "button",
              class: "library-row",
              "data-row": c.id,
              onClick: (ge) => Y(c)
            }, [
              m(s(K), {
                name: "file",
                class: "library-icon"
              }),
              y("span", fe, [
                y("span", me, k(c.title), 1),
                y("span", ke, k(c.abstract), 1),
                y("span", _e, k(O.value) + " " + k(c.id), 1)
              ]),
              m(s(Q), {
                class: "library-age",
                at: c.updated_at
              }, null, 8, ["at"])
            ], 8, pe))), 128))
          ], 64))), 128)),
          s(h).length < s(f) && !d.value ? (u(), U(s(X), {
            key: 3,
            onClick: s(W)
          }, {
            default: S(() => [...e[13] || (e[13] = [
              x("Show more", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])) : L("", !0)
        ])
      ])
    ]));
  }
}, Le = /* @__PURE__ */ te(Ce, [["__scopeId", "data-v-8a7158d9"]]);
export {
  Le as D,
  te as _,
  re as a,
  se as g,
  oe as s,
  we as u
};
