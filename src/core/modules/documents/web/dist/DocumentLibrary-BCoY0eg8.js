import { ref as _, computed as P, openBlock as u, createElementBlock as y, createVNode as m, unref as s, withCtx as T, createTextVNode as V, toDisplayString as k, withModifiers as j, withDirectives as B, createElementVNode as b, vModelText as E, createCommentVNode as S, createBlock as F, Fragment as $, renderList as G, watch as W, onUnmounted as q } from "vue";
import { useWindow as z, SearchBar as H, Segmented as U, Btn as A, Skeleton as J, Icon as K, TimeAgo as Q, peekRef as X } from "@journal/window-kit";
const ee = (a, n) => {
  const r = a.__vccOpts || a;
  for (const [o, l] of n)
    r[o] = l;
  return r;
}, te = 1440 * 60 * 1e3, ae = [
  { key: "today", title: "Today", days: 1 },
  { key: "week", title: "Last 7 days", days: 7 },
  { key: "month", title: "Last 30 days", days: 30 },
  { key: "older", title: "Older", days: 1 / 0 }
];
function le(a, n) {
  const r = n.trim().toLowerCase();
  return r ? a.filter((o) => `${o.title} ${o.abstract}`.toLowerCase().includes(r)) : a;
}
function re(a, n) {
  const r = [...a];
  return n === "title" ? r.sort((o, l) => o.title.localeCompare(l.title)) : r.sort((o, l) => String(l.updated_at).localeCompare(String(o.updated_at)));
}
function oe(a, n, r = Date.now()) {
  if (n === "title") return a.length ? [{ key: "all", title: "", rows: a }] : [];
  const o = ae.map((l) => ({ ...l, rows: [] }));
  for (const l of a) {
    const i = (r - Date.parse(l.updated_at)) / te;
    o.find((v) => i < v.days).rows.push(l);
  }
  return o.filter((l) => l.rows.length);
}
const se = { class: "library" }, ne = {
  key: 0,
  class: "library-note",
  role: "alert"
}, ie = { class: "library-draft-foot" }, ue = { class: "library-body" }, de = {
  class: "library-list",
  "data-library-list": ""
}, ce = {
  key: 1,
  class: "library-note"
}, ye = { class: "library-note" }, be = {
  key: 0,
  class: "library-group"
}, ve = ["data-row", "onClick"], pe = { class: "library-text" }, fe = { class: "library-title" }, me = { class: "library-abstract" }, ke = { class: "library-ref" };
function _e(a, n, r) {
  const o = a.props.library, l = _([]), i = _(0), { failure: v, loaded: w } = o;
  a.state["library.type"] = n.value, a.state["library.state"] = r.value, W(o.data, (f) => {
    l.value = f.rows, i.value = f.total;
  }, { once: !0 });
  async function d() {
    const f = n.value, C = r.value;
    a.state["library.type"] = f, a.state["library.state"] = C, delete a.state["library.before"];
    const g = await a.reload("library");
    f !== n.value || C !== r.value || (l.value = g && !v.value ? o.data.value.rows : [], i.value = g && !v.value ? o.data.value.total : 0, w.value = !0);
  }
  async function x() {
    const f = n.value, C = r.value;
    a.state["library.before"] = String(Math.min(...l.value.map((N) => N.id)));
    const g = await a.reload("library");
    delete a.state["library.before"], !(!g || v.value) && f === n.value && C === r.value && (l.value = [...l.value, ...o.data.value.rows]);
  }
  W([n, r], () => {
    l.value = [], w.value = !1, d();
  });
  const h = a.follow(["doc.*", "report.*"], d);
  return q(() => h == null ? void 0 : h()), { rows: l, total: i, failure: v, loaded: w, load: d, more: x };
}
const we = {
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
    ], l = { doc: "docs", report: "reports" }, i = _("doc"), v = _("open"), w = _("newest"), d = _(""), x = z(), { rows: h, total: f, failure: C, loaded: g, load: N, more: I } = _e(x, i, v), L = _(!1), p = _({ title: "", abstract: "", body: "" }), R = _(""), O = P(() => oe(re(le(h.value, d.value), w.value), w.value)), M = P(() => i.value === "doc" ? "Document" : "Report"), Y = (D) => X(`${l[i.value]}:${D.id}`);
    async function Z() {
      const { title: D, abstract: e, body: t } = p.value;
      if (!D.trim() || !e.trim()) return;
      const c = await x.run([i.value, "make", D.trim(), "--abstract", e.trim(), "--body", t.trim() || e.trim()]);
      R.value = c.ok ? "" : c.error, c.ok && (L.value = !1, p.value = { title: "", abstract: "", body: "" }, N());
    }
    return (D, e) => (u(), y("div", se, [
      m(s(H), {
        modelValue: d.value,
        "onUpdate:modelValue": e[4] || (e[4] = (t) => d.value = t),
        class: "library-bar"
      }, {
        default: T(() => [
          m(s(U), {
            options: n,
            value: i.value,
            onPick: e[0] || (e[0] = (t) => i.value = t)
          }, null, 8, ["value"]),
          m(s(U), {
            options: r,
            value: v.value,
            "data-library-state": "",
            onPick: e[1] || (e[1] = (t) => v.value = t)
          }, null, 8, ["value"]),
          m(s(U), {
            options: o,
            value: w.value,
            onPick: e[2] || (e[2] = (t) => w.value = t)
          }, null, 8, ["value"]),
          m(s(A), {
            small: "",
            bordered: "",
            "data-library-new": "",
            onClick: e[3] || (e[3] = (t) => L.value = !L.value)
          }, {
            default: T(() => [
              V("New " + k(M.value.toLowerCase()), 1)
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue"]),
      L.value ? (u(), y("form", {
        key: 0,
        class: "library-draft",
        "data-library-draft": "",
        onSubmit: j(Z, ["prevent"])
      }, [
        B(b("input", {
          "onUpdate:modelValue": e[5] || (e[5] = (t) => p.value.title = t),
          placeholder: "Title",
          "aria-label": "Title"
        }, null, 512), [
          [E, p.value.title]
        ]),
        B(b("input", {
          "onUpdate:modelValue": e[6] || (e[6] = (t) => p.value.abstract = t),
          placeholder: "A short summary",
          "aria-label": "Abstract"
        }, null, 512), [
          [E, p.value.abstract]
        ]),
        B(b("textarea", {
          "onUpdate:modelValue": e[7] || (e[7] = (t) => p.value.body = t),
          rows: "4",
          placeholder: "The text",
          "aria-label": "Text"
        }, null, 512), [
          [E, p.value.body]
        ]),
        R.value ? (u(), y("p", ne, k(R.value), 1)) : S("", !0),
        b("div", ie, [
          m(s(A), {
            small: "",
            onClick: e[8] || (e[8] = (t) => L.value = !1)
          }, {
            default: T(() => [...e[11] || (e[11] = [
              V("Cancel", -1)
            ])]),
            _: 1
          }),
          m(s(A), {
            small: "",
            variant: "primary",
            type: "submit",
            disabled: !p.value.title.trim() || !p.value.abstract.trim(),
            "data-library-create": ""
          }, {
            default: T(() => [...e[12] || (e[12] = [
              V("Create", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : S("", !0),
      b("div", ue, [
        b("div", de, [
          s(g) ? s(C) ? (u(), y("p", ce, k(s(C)), 1)) : s(g) && !O.value.length ? (u(), y($, { key: 2 }, [
            b("p", ye, k(d.value ? "Nothing matches the search" : `No ${n.find((t) => t.key === i.value).label.toLowerCase()} yet`), 1),
            d.value ? (u(), F(s(A), {
              key: 0,
              small: "",
              "data-library-clear": "",
              onClick: e[9] || (e[9] = (t) => d.value = "")
            }, {
              default: T(() => [...e[13] || (e[13] = [
                V("Clear the search", -1)
              ])]),
              _: 1
            })) : S("", !0)
          ], 64)) : S("", !0) : (u(), F(s(J), {
            key: 0,
            shape: "cards"
          })),
          (u(!0), y($, null, G(O.value, (t) => (u(), y($, {
            key: t.key
          }, [
            t.title ? (u(), y("h3", be, k(t.title), 1)) : S("", !0),
            (u(!0), y($, null, G(t.rows, (c) => (u(), y("button", {
              key: c.id,
              type: "button",
              class: "library-row",
              "data-row": c.id,
              onClick: (Ce) => Y(c)
            }, [
              m(s(K), {
                name: "file",
                class: "library-icon"
              }),
              b("span", pe, [
                b("span", fe, k(c.title), 1),
                b("span", me, k(c.abstract), 1),
                b("span", ke, k(M.value) + " " + k(c.id), 1)
              ]),
              m(s(Q), {
                class: "library-age",
                at: c.updated_at
              }, null, 8, ["at"])
            ], 8, ve))), 128))
          ], 64))), 128)),
          s(h).length < s(f) && !d.value ? (u(), y("button", {
            key: 3,
            type: "button",
            class: "library-more",
            onClick: e[10] || (e[10] = (...t) => s(I) && s(I)(...t))
          }, "Show more")) : S("", !0)
        ])
      ])
    ]));
  }
}, Se = /* @__PURE__ */ ee(we, [["__scopeId", "data-v-b80380bc"]]);
export {
  Se as D,
  ee as _,
  le as a,
  oe as g,
  re as s,
  _e as u
};
