import { useCssVars as re, ref as m, watch as J, computed as W, onUnmounted as oe, openBlock as o, createElementBlock as v, createVNode as w, unref as l, withCtx as D, createTextVNode as V, toDisplayString as k, withModifiers as B, withDirectives as Y, createElementVNode as b, vModelText as Z, createCommentVNode as S, withKeys as N, createBlock as j, Fragment as A, renderList as Q, normalizeClass as se } from "vue";
import { useWindow as ne, SearchBar as ie, Segmented as q, Btn as U, Skeleton as ue, Icon as de, TimeAgo as ve, DocumentBody as ce, steppedItem as ye, peekRef as be } from "@journal/window-kit";
import { d as pe } from "./documentRead-Dr2B0M3c.js";
const fe = 1440 * 60 * 1e3, me = [
  { key: "today", title: "Today", days: 1 },
  { key: "week", title: "Last 7 days", days: 7 },
  { key: "month", title: "Last 30 days", days: 30 },
  { key: "older", title: "Older", days: 1 / 0 }
];
function ke(r, p) {
  const c = p.trim().toLowerCase();
  return c ? r.filter((u) => `${u.title} ${u.abstract}`.toLowerCase().includes(c)) : r;
}
function we(r, p) {
  const c = [...r];
  return p === "title" ? c.sort((u, s) => u.title.localeCompare(s.title)) : c.sort((u, s) => String(s.updated_at).localeCompare(String(u.updated_at)));
}
function he(r, p, c = Date.now()) {
  if (p === "title") return r.length ? [{ key: "all", title: "", rows: r }] : [];
  const u = me.map((s) => ({ ...s, rows: [] }));
  for (const s of r) {
    const E = (c - Date.parse(s.updated_at)) / fe;
    u.find((x) => E < x.days).rows.push(s);
  }
  return u.filter((s) => s.rows.length);
}
const Ce = (r, p) => {
  const c = r.__vccOpts || r;
  for (const [u, s] of p)
    c[u] = s;
  return c;
}, ge = { class: "library" }, Se = {
  key: 0,
  class: "library-note",
  role: "alert"
}, xe = { class: "library-draft-foot" }, $e = { class: "library-body" }, Le = {
  key: 1,
  class: "library-note"
}, _e = { class: "library-note" }, De = {
  key: 0,
  class: "library-group"
}, Te = ["data-row", "onClick"], Re = { class: "library-text" }, Ve = { class: "library-title" }, Be = { class: "library-abstract" }, Ne = { class: "library-ref" }, Ae = {
  key: 0,
  class: "library-reader",
  "data-library-reader": ""
}, Ue = {
  key: 1,
  class: "reader-empty-title"
}, Ee = {
  __name: "DocumentLibrary",
  props: { reader: { type: Boolean, default: !1 } },
  setup(r) {
    re((a) => ({
      b5aded46: r.reader ? "minmax(240px, 2fr) 3fr" : "1fr"
    }));
    const p = [
      { key: "doc", label: "Documents" },
      { key: "report", label: "Reports" }
    ], c = [
      { key: "open", label: "Open" },
      { key: "closed", label: "Closed" }
    ], u = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], s = r, E = { doc: "docs", report: "reports" }, x = s.reader ? (new URLSearchParams(globalThis.location.search).get("doc") ?? "").split(":") : [], n = m(["doc", "report"].includes(x[0]) ? x[0] : "doc"), h = m("open"), T = m("newest"), C = m(""), y = m(Number(x[1]) || null), d = ne();
    d.state["library.type"] = n.value, d.state["library.state"] = h.value;
    const $ = d.props.library, g = m([]), I = m(0), { failure: L, loaded: R } = $;
    J($.data, (a) => {
      g.value = a.rows, I.value = a.total;
    }, { once: !0 });
    const _ = m(!1), f = m({ title: "", abstract: "", body: "" }), O = m(""), M = W(() => he(we(ke(g.value, C.value), T.value), T.value)), P = W(() => n.value === "doc" ? "Document" : "Report");
    async function K() {
      const a = n.value, e = h.value;
      d.state["library.type"] = a, d.state["library.state"] = e, delete d.state["library.before"];
      const t = await d.reload("library");
      a !== n.value || e !== h.value || (g.value = t && !L.value ? $.data.value.rows : [], I.value = t && !L.value ? $.data.value.total : 0, R.value = !0);
    }
    async function X() {
      const a = n.value, e = h.value;
      d.state["library.before"] = String(Math.min(...g.value.map((i) => i.id)));
      const t = await d.reload("library");
      delete d.state["library.before"], !(!t || L.value) && a === n.value && e === h.value && (g.value = [...g.value, ...$.data.value.rows]);
    }
    const ee = pe(d);
    function F(a) {
      s.reader ? y.value = a.id : be(`${E[n.value]}:${a.id}`);
    }
    const te = () => {
      const a = z.value.find((e) => e.id === y.value);
      a && F(a);
    };
    async function ae() {
      const { title: a, abstract: e, body: t } = f.value;
      if (!a.trim() || !e.trim()) return;
      const i = await d.run([n.value, "make", a.trim(), "--abstract", e.trim(), "--body", t.trim() || e.trim()]);
      O.value = i.ok ? "" : i.error, i.ok && (_.value = !1, f.value = { title: "", abstract: "", body: "" }, K());
    }
    const z = W(() => M.value.flatMap((a) => a.rows));
    function H(a) {
      z.value.length && (y.value = ye(z.value.map((e) => e.id), y.value, a));
    }
    function le() {
      y.value ? y.value = null : C.value = "";
    }
    J([n, h], () => {
      y.value = null, g.value = [], R.value = !1, K();
    });
    const G = d.follow(["doc.*", "report.*"], K);
    return oe(() => G == null ? void 0 : G()), (a, e) => (o(), v("div", ge, [
      w(l(ie), {
        modelValue: C.value,
        "onUpdate:modelValue": e[4] || (e[4] = (t) => C.value = t),
        class: "library-bar"
      }, {
        default: D(() => [
          w(l(q), {
            options: p,
            value: n.value,
            onPick: e[0] || (e[0] = (t) => n.value = t)
          }, null, 8, ["value"]),
          w(l(q), {
            options: c,
            value: h.value,
            "data-library-state": "",
            onPick: e[1] || (e[1] = (t) => h.value = t)
          }, null, 8, ["value"]),
          w(l(q), {
            options: u,
            value: T.value,
            onPick: e[2] || (e[2] = (t) => T.value = t)
          }, null, 8, ["value"]),
          w(l(U), {
            small: "",
            bordered: "",
            "data-library-new": "",
            onClick: e[3] || (e[3] = (t) => _.value = !_.value)
          }, {
            default: D(() => [
              V("New " + k(P.value.toLowerCase()), 1)
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue"]),
      _.value ? (o(), v("form", {
        key: 0,
        class: "library-draft",
        "data-library-draft": "",
        onSubmit: B(ae, ["prevent"])
      }, [
        Y(b("input", {
          "onUpdate:modelValue": e[5] || (e[5] = (t) => f.value.title = t),
          placeholder: "Title",
          "aria-label": "Title"
        }, null, 512), [
          [Z, f.value.title]
        ]),
        Y(b("input", {
          "onUpdate:modelValue": e[6] || (e[6] = (t) => f.value.abstract = t),
          placeholder: "A short summary",
          "aria-label": "Abstract"
        }, null, 512), [
          [Z, f.value.abstract]
        ]),
        Y(b("textarea", {
          "onUpdate:modelValue": e[7] || (e[7] = (t) => f.value.body = t),
          rows: "4",
          placeholder: "The text",
          "aria-label": "Text"
        }, null, 512), [
          [Z, f.value.body]
        ]),
        O.value ? (o(), v("p", Se, k(O.value), 1)) : S("", !0),
        b("div", xe, [
          w(l(U), {
            small: "",
            onClick: e[8] || (e[8] = (t) => _.value = !1)
          }, {
            default: D(() => [...e[13] || (e[13] = [
              V("Cancel", -1)
            ])]),
            _: 1
          }),
          w(l(U), {
            small: "",
            variant: "primary",
            type: "submit",
            disabled: !f.value.title.trim() || !f.value.abstract.trim(),
            "data-library-create": ""
          }, {
            default: D(() => [...e[14] || (e[14] = [
              V("Create", -1)
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
            e[10] || (e[10] = N(B((t) => H(1), ["prevent"]), ["down"])),
            e[11] || (e[11] = N(B((t) => H(-1), ["prevent"]), ["up"])),
            N(le, ["esc"]),
            e[12] || (e[12] = N(B((t) => !r.reader && te(), ["self"]), ["enter"]))
          ]
        }, [
          l(R) ? l(L) ? (o(), v("p", Le, k(l(L)), 1)) : l(R) && !M.value.length ? (o(), v(A, { key: 2 }, [
            b("p", _e, k(C.value ? "Nothing matches the search" : `No ${p.find((t) => t.key === n.value).label.toLowerCase()} yet`), 1),
            C.value ? (o(), j(l(U), {
              key: 0,
              small: "",
              "data-library-clear": "",
              onClick: e[9] || (e[9] = (t) => C.value = "")
            }, {
              default: D(() => [...e[15] || (e[15] = [
                V("Clear the search", -1)
              ])]),
              _: 1
            })) : S("", !0)
          ], 64)) : S("", !0) : (o(), j(l(ue), {
            key: 0,
            shape: "cards"
          })),
          (o(!0), v(A, null, Q(M.value, (t) => (o(), v(A, {
            key: t.key
          }, [
            t.title ? (o(), v("h3", De, k(t.title), 1)) : S("", !0),
            (o(!0), v(A, null, Q(t.rows, (i) => (o(), v("button", {
              key: i.id,
              type: "button",
              class: se(["library-row", { chosen: i.id === y.value }]),
              "data-row": i.id,
              onClick: (Ie) => F(i)
            }, [
              w(l(de), {
                name: "file",
                class: "library-icon"
              }),
              b("span", Re, [
                b("span", Ve, k(i.title), 1),
                b("span", Be, k(i.abstract), 1),
                b("span", Ne, k(P.value) + " " + k(i.id), 1)
              ]),
              w(l(ve), {
                class: "library-age",
                at: i.updated_at
              }, null, 8, ["at"])
            ], 10, Te))), 128))
          ], 64))), 128)),
          g.value.length < I.value && !C.value ? (o(), v("button", {
            key: 3,
            type: "button",
            class: "library-more",
            onClick: X
          }, "Show more")) : S("", !0)
        ], 32),
        r.reader ? (o(), v("div", Ae, [
          y.value ? (o(), j(l(ce), {
            key: `${n.value}:${y.value}`,
            term: n.value,
            id: y.value,
            read: l(ee)
          }, null, 8, ["term", "id", "read"])) : (o(), v("p", Ue, "Choose a " + k(P.value.toLowerCase()) + " to read it here", 1))
        ])) : S("", !0)
      ])
    ]));
  }
}, Ke = /* @__PURE__ */ Ce(Ee, [["__scopeId", "data-v-b2790d0b"]]);
export {
  Ke as D
};
