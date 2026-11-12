if (!document.getElementById("window-styles-c3ed33de16b1")) { const style = document.createElement("style"); style.id = "window-styles-c3ed33de16b1"; style.textContent = ".library-draft[data-v-ed97fab2]{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.library-draft-foot[data-v-ed97fab2]{display:flex;gap:6px;justify-content:flex-end}.library[data-v-ed97fab2]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-ed97fab2]{gap:10px}.library-body[data-v-ed97fab2]{display:grid;flex:1;grid-template-columns:minmax(240px,2fr) 3fr;min-height:0}.library-list[data-v-ed97fab2]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-ed97fab2]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-ed97fab2]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-ed97fab2]:hover,.library-row.chosen[data-v-ed97fab2]{background:var(--hover)}.library-icon[data-v-ed97fab2]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-ed97fab2]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-ed97fab2]{font-weight:600}.library-abstract[data-v-ed97fab2]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-ed97fab2],.library-age[data-v-ed97fab2]{color:var(--text-3);font-size:12px}.library-reader[data-v-ed97fab2]{overflow-y:auto;padding:20px 28px}.reader-title[data-v-ed97fab2]{margin:0 0 6px;font-size:20px}.reader-abstract[data-v-ed97fab2]{margin:0 0 18px;color:var(--text-2)}.reader-empty[data-v-ed97fab2]{margin-top:120px;text-align:center}.reader-empty-title[data-v-ed97fab2]{margin:0 0 6px;font-weight:500}.reader-empty-text[data-v-ed97fab2],.library-more[data-v-ed97fab2]{margin:8px 12px;color:var(--muted);background:none;border:0;cursor:pointer}.library-note[data-v-ed97fab2]{margin:0;color:var(--text-2)}.library-note[data-v-ed97fab2]{padding:12px}\n"; document.head.appendChild(style); }
import { ref as f, watch as j, computed as E, onUnmounted as ee, openBlock as o, createElementBlock as v, createVNode as w, unref as r, withCtx as L, createTextVNode as T, toDisplayString as k, withModifiers as M, withDirectives as P, createElementVNode as y, vModelText as K, createCommentVNode as g, withKeys as z, createBlock as G, Fragment as V, renderList as q, normalizeClass as te } from "vue";
import { useWindow as ae, SearchBar as le, Segmented as W, Btn as R, Skeleton as re, Icon as oe, TimeAgo as se, DocumentBody as ne, steppedItem as ie } from "@journal/window-kit";
import { d as ue } from "./documentRead-Dr2B0M3c.js";
const de = 1440 * 60 * 1e3, ve = [
  { key: "today", title: "Today", days: 1 },
  { key: "week", title: "Last 7 days", days: 7 },
  { key: "month", title: "Last 30 days", days: 30 },
  { key: "older", title: "Older", days: 1 / 0 }
];
function ye(u, c) {
  const d = c.trim().toLowerCase();
  return d ? u.filter((n) => `${n.title} ${n.abstract}`.toLowerCase().includes(d)) : u;
}
function ce(u, c) {
  const d = [...u];
  return c === "title" ? d.sort((n, a) => n.title.localeCompare(a.title)) : d.sort((n, a) => String(a.updated_at).localeCompare(String(n.updated_at)));
}
function be(u, c, d = Date.now()) {
  if (c === "title") return u.length ? [{ key: "all", title: "", rows: u }] : [];
  const n = ve.map((a) => ({ ...a, rows: [] }));
  for (const a of u) {
    const b = (d - Date.parse(a.updated_at)) / de;
    n.find((_) => b < _.days).rows.push(a);
  }
  return n.filter((a) => a.rows.length);
}
const pe = (u, c) => {
  const d = u.__vccOpts || u;
  for (const [n, a] of c)
    d[n] = a;
  return d;
}, me = { class: "library" }, fe = {
  key: 0,
  class: "library-note",
  role: "alert"
}, ke = { class: "library-draft-foot" }, we = { class: "library-body" }, he = {
  key: 1,
  class: "library-note"
}, Ce = { class: "library-note" }, _e = {
  key: 0,
  class: "library-group"
}, ge = ["data-row", "onClick"], Se = { class: "library-text" }, xe = { class: "library-title" }, De = { class: "library-abstract" }, Le = { class: "library-ref" }, $e = {
  class: "library-reader",
  "data-library-reader": ""
}, Te = {
  key: 1,
  class: "reader-empty-title"
}, Ve = {
  __name: "DocumentLibrary",
  setup(u) {
    const c = [
      { key: "doc", label: "Documents" },
      { key: "report", label: "Reports" }
    ], d = [
      { key: "open", label: "Open" },
      { key: "closed", label: "Closed" }
    ], n = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], a = f("doc"), b = f("open"), _ = f("newest"), h = f(""), p = f(null), i = ae();
    i.state["library.type"] = a.value, i.state["library.state"] = b.value;
    const S = i.props.library, C = f([]), N = f(0), { failure: x, loaded: $ } = S;
    j(S.data, (l) => {
      C.value = l.rows, N.value = l.total;
    }, { once: !0 });
    const D = f(!1), m = f({ title: "", abstract: "", body: "" }), A = f(""), B = E(() => be(ce(ye(C.value, h.value), _.value), _.value)), I = E(() => a.value === "doc" ? "Document" : "Report");
    async function O() {
      const l = a.value, e = b.value;
      i.state["library.type"] = l, i.state["library.state"] = e, delete i.state["library.before"];
      const t = await i.reload("library");
      l !== a.value || e !== b.value || (C.value = t && !x.value ? S.data.value.rows : [], N.value = t && !x.value ? S.data.value.total : 0, $.value = !0);
    }
    async function F() {
      const l = a.value, e = b.value;
      i.state["library.before"] = String(Math.min(...C.value.map((s) => s.id)));
      const t = await i.reload("library");
      delete i.state["library.before"], !(!t || x.value) && l === a.value && e === b.value && (C.value = [...C.value, ...S.data.value.rows]);
    }
    const H = ue(i);
    function J(l) {
      p.value = l.id;
    }
    async function Q() {
      const { title: l, abstract: e, body: t } = m.value;
      if (!l.trim() || !e.trim()) return;
      const s = await i.run([a.value, "make", l.trim(), "--abstract", e.trim(), "--body", t.trim() || e.trim()]);
      A.value = s.ok ? "" : s.error, s.ok && (D.value = !1, m.value = { title: "", abstract: "", body: "" }, O());
    }
    const Y = E(() => B.value.flatMap((l) => l.rows));
    function Z(l) {
      Y.value.length && (p.value = ie(Y.value.map((e) => e.id), p.value, l));
    }
    function X() {
      p.value ? p.value = null : h.value = "";
    }
    j([a, b], () => {
      p.value = null, C.value = [], $.value = !1, O();
    });
    const U = i.follow(["doc.*", "report.*"], O);
    return ee(() => U == null ? void 0 : U()), (l, e) => (o(), v("div", me, [
      w(r(le), {
        modelValue: h.value,
        "onUpdate:modelValue": e[4] || (e[4] = (t) => h.value = t),
        class: "library-bar"
      }, {
        default: L(() => [
          w(r(W), {
            options: c,
            value: a.value,
            onPick: e[0] || (e[0] = (t) => a.value = t)
          }, null, 8, ["value"]),
          w(r(W), {
            options: d,
            value: b.value,
            "data-library-state": "",
            onPick: e[1] || (e[1] = (t) => b.value = t)
          }, null, 8, ["value"]),
          w(r(W), {
            options: n,
            value: _.value,
            onPick: e[2] || (e[2] = (t) => _.value = t)
          }, null, 8, ["value"]),
          w(r(R), {
            small: "",
            bordered: "",
            "data-library-new": "",
            onClick: e[3] || (e[3] = (t) => D.value = !D.value)
          }, {
            default: L(() => [
              T("New " + k(I.value.toLowerCase()), 1)
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue"]),
      D.value ? (o(), v("form", {
        key: 0,
        class: "library-draft",
        "data-library-draft": "",
        onSubmit: M(Q, ["prevent"])
      }, [
        P(y("input", {
          "onUpdate:modelValue": e[5] || (e[5] = (t) => m.value.title = t),
          placeholder: "Title",
          "aria-label": "Title"
        }, null, 512), [
          [K, m.value.title]
        ]),
        P(y("input", {
          "onUpdate:modelValue": e[6] || (e[6] = (t) => m.value.abstract = t),
          placeholder: "A short summary",
          "aria-label": "Abstract"
        }, null, 512), [
          [K, m.value.abstract]
        ]),
        P(y("textarea", {
          "onUpdate:modelValue": e[7] || (e[7] = (t) => m.value.body = t),
          rows: "4",
          placeholder: "The text",
          "aria-label": "Text"
        }, null, 512), [
          [K, m.value.body]
        ]),
        A.value ? (o(), v("p", fe, k(A.value), 1)) : g("", !0),
        y("div", ke, [
          w(r(R), {
            small: "",
            onClick: e[8] || (e[8] = (t) => D.value = !1)
          }, {
            default: L(() => [...e[12] || (e[12] = [
              T("Cancel", -1)
            ])]),
            _: 1
          }),
          w(r(R), {
            small: "",
            variant: "primary",
            type: "submit",
            disabled: !m.value.title.trim() || !m.value.abstract.trim(),
            "data-library-create": ""
          }, {
            default: L(() => [...e[13] || (e[13] = [
              T("Create", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : g("", !0),
      y("div", we, [
        y("div", {
          class: "library-list",
          tabindex: "0",
          "data-library-list": "",
          onKeydown: [
            e[10] || (e[10] = z(M((t) => Z(1), ["prevent"]), ["down"])),
            e[11] || (e[11] = z(M((t) => Z(-1), ["prevent"]), ["up"])),
            z(X, ["esc"])
          ]
        }, [
          r($) ? r(x) ? (o(), v("p", he, k(r(x)), 1)) : r($) && !B.value.length ? (o(), v(V, { key: 2 }, [
            y("p", Ce, k(h.value ? "Nothing matches the search" : `No ${c.find((t) => t.key === a.value).label.toLowerCase()} yet`), 1),
            h.value ? (o(), G(r(R), {
              key: 0,
              small: "",
              "data-library-clear": "",
              onClick: e[9] || (e[9] = (t) => h.value = "")
            }, {
              default: L(() => [...e[14] || (e[14] = [
                T("Clear the search", -1)
              ])]),
              _: 1
            })) : g("", !0)
          ], 64)) : g("", !0) : (o(), G(r(re), {
            key: 0,
            shape: "cards"
          })),
          (o(!0), v(V, null, q(B.value, (t) => (o(), v(V, {
            key: t.key
          }, [
            t.title ? (o(), v("h3", _e, k(t.title), 1)) : g("", !0),
            (o(!0), v(V, null, q(t.rows, (s) => (o(), v("button", {
              key: s.id,
              type: "button",
              class: te(["library-row", { chosen: s.id === p.value }]),
              "data-row": s.id,
              onClick: (Re) => J(s)
            }, [
              w(r(oe), {
                name: "file",
                class: "library-icon"
              }),
              y("span", Se, [
                y("span", xe, k(s.title), 1),
                y("span", De, k(s.abstract), 1),
                y("span", Le, k(I.value) + " " + k(s.id), 1)
              ]),
              w(r(se), {
                class: "library-age",
                at: s.updated_at
              }, null, 8, ["at"])
            ], 10, ge))), 128))
          ], 64))), 128)),
          C.value.length < N.value && !h.value ? (o(), v("button", {
            key: 3,
            type: "button",
            class: "library-more",
            onClick: F
          }, "Show more")) : g("", !0)
        ], 32),
        y("div", $e, [
          p.value ? (o(), G(r(ne), {
            key: `${a.value}:${p.value}`,
            term: a.value,
            id: p.value,
            read: r(H)
          }, null, 8, ["term", "id", "read"])) : (o(), v("p", Te, "Choose a " + k(I.value.toLowerCase()) + " to read it here", 1))
        ])
      ])
    ]));
  }
}, Ie = /* @__PURE__ */ pe(Ve, [["__scopeId", "data-v-ed97fab2"]]);
export {
  Ie as default
};
