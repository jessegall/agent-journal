if (!document.getElementById("window-styles-76c62683ad19")) { const style = document.createElement("style"); style.id = "window-styles-76c62683ad19"; style.textContent = ".revisions[data-v-258f93a7]{padding-top:16px}.failure[data-v-258f93a7]{color:var(--bad, var(--text-2));font-size:12.5px}.age[data-v-d58ef5de]{color:var(--text-3);font-size:12px;white-space:nowrap}.more[data-v-d58ef5de],.failure[data-v-d58ef5de]{margin:0;padding:4px var(--inset);font-size:12px}.failure[data-v-d58ef5de]{color:var(--bad, var(--text-2))}.library-draft[data-v-d338a838]{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.library-draft-foot[data-v-d338a838]{display:flex;gap:6px;justify-content:flex-end}.library[data-v-d338a838]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-d338a838]{gap:10px}.library-body[data-v-d338a838]{display:grid;flex:1;grid-template-columns:1fr;min-height:0}.library-list[data-v-d338a838]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-d338a838]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-d338a838]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-d338a838]:hover{background:var(--hover)}.library-icon[data-v-d338a838]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-d338a838]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-d338a838]{font-weight:600}.library-abstract[data-v-d338a838]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-d338a838],.library-age[data-v-d338a838]{color:var(--text-3);font-size:12px}.library-more[data-v-d338a838]{margin:8px 12px;color:var(--muted);background:none;border:0;cursor:pointer}.library-note[data-v-d338a838]{margin:0;color:var(--text-2)}.library-note[data-v-d338a838]{padding:12px}\n"; document.head.appendChild(style); }
import { ref as v, computed as $, openBlock as l, createElementBlock as o, createVNode as i, unref as a, withCtx as p, createTextVNode as f, toDisplayString as u, withModifiers as j, withDirectives as g, createElementVNode as s, vModelText as x, createCommentVNode as y, createBlock as E, Fragment as _, renderList as I } from "vue";
import { useWindow as q, SearchBar as z, Segmented as T, Btn as w, Skeleton as G, Icon as H, TimeAgo as J, peekRef as K } from "@journal/window-kit";
import { _ as Q, u as X, g as Y, s as ee, a as te } from "./useLibrary-ChW9gsla.js";
const ae = { class: "library" }, le = {
  key: 0,
  class: "library-note",
  role: "alert"
}, re = { class: "library-draft-foot" }, oe = { class: "library-body" }, se = {
  class: "library-list",
  "data-library-list": ""
}, ne = {
  key: 1,
  class: "library-note"
}, ie = { class: "library-note" }, ue = {
  key: 0,
  class: "library-group"
}, de = ["data-row", "onClick"], be = { class: "library-text" }, ve = { class: "library-title" }, ye = { class: "library-abstract" }, ce = { class: "library-ref" }, me = {
  __name: "DocumentLibrary",
  setup(pe) {
    const V = [
      { key: "doc", label: "Documents" },
      { key: "report", label: "Reports" }
    ], U = [
      { key: "open", label: "Open" },
      { key: "closed", label: "Closed" }
    ], P = [
      { key: "newest", label: "Newest" },
      { key: "title", label: "A to Z" }
    ], M = { doc: "docs", report: "reports" }, d = v("doc"), C = v("open"), k = v("newest"), b = v(""), L = q(), { rows: N, total: O, failure: h, loaded: A, load: F, more: B } = X(L, d, C), c = v(!1), n = v({ title: "", abstract: "", body: "" }), S = v(""), D = $(() => Y(ee(te(N.value, b.value), k.value), k.value)), R = $(() => d.value === "doc" ? "Document" : "Report"), W = (m) => K(`${M[d.value]}:${m.id}`);
    async function Z() {
      const { title: m, abstract: e, body: t } = n.value;
      if (!m.trim() || !e.trim()) return;
      const r = await L.run([d.value, "make", m.trim(), "--abstract", e.trim(), "--body", t.trim() || e.trim()]);
      S.value = r.ok ? "" : r.error, r.ok && (c.value = !1, n.value = { title: "", abstract: "", body: "" }, F());
    }
    return (m, e) => (l(), o("div", ae, [
      i(a(z), {
        modelValue: b.value,
        "onUpdate:modelValue": e[4] || (e[4] = (t) => b.value = t),
        class: "library-bar"
      }, {
        default: p(() => [
          i(a(T), {
            options: V,
            value: d.value,
            onPick: e[0] || (e[0] = (t) => d.value = t)
          }, null, 8, ["value"]),
          i(a(T), {
            options: U,
            value: C.value,
            "data-library-state": "",
            onPick: e[1] || (e[1] = (t) => C.value = t)
          }, null, 8, ["value"]),
          i(a(T), {
            options: P,
            value: k.value,
            onPick: e[2] || (e[2] = (t) => k.value = t)
          }, null, 8, ["value"]),
          i(a(w), {
            small: "",
            bordered: "",
            "data-library-new": "",
            onClick: e[3] || (e[3] = (t) => c.value = !c.value)
          }, {
            default: p(() => [
              f("New " + u(R.value.toLowerCase()), 1)
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue"]),
      c.value ? (l(), o("form", {
        key: 0,
        class: "library-draft",
        "data-library-draft": "",
        onSubmit: j(Z, ["prevent"])
      }, [
        g(s("input", {
          "onUpdate:modelValue": e[5] || (e[5] = (t) => n.value.title = t),
          placeholder: "Title",
          "aria-label": "Title"
        }, null, 512), [
          [x, n.value.title]
        ]),
        g(s("input", {
          "onUpdate:modelValue": e[6] || (e[6] = (t) => n.value.abstract = t),
          placeholder: "A short summary",
          "aria-label": "Abstract"
        }, null, 512), [
          [x, n.value.abstract]
        ]),
        g(s("textarea", {
          "onUpdate:modelValue": e[7] || (e[7] = (t) => n.value.body = t),
          rows: "4",
          placeholder: "The text",
          "aria-label": "Text"
        }, null, 512), [
          [x, n.value.body]
        ]),
        S.value ? (l(), o("p", le, u(S.value), 1)) : y("", !0),
        s("div", re, [
          i(a(w), {
            small: "",
            onClick: e[8] || (e[8] = (t) => c.value = !1)
          }, {
            default: p(() => [...e[11] || (e[11] = [
              f("Cancel", -1)
            ])]),
            _: 1
          }),
          i(a(w), {
            small: "",
            variant: "primary",
            type: "submit",
            disabled: !n.value.title.trim() || !n.value.abstract.trim(),
            "data-library-create": ""
          }, {
            default: p(() => [...e[12] || (e[12] = [
              f("Create", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32)) : y("", !0),
      s("div", oe, [
        s("div", se, [
          a(A) ? a(h) ? (l(), o("p", ne, u(a(h)), 1)) : a(A) && !D.value.length ? (l(), o(_, { key: 2 }, [
            s("p", ie, u(b.value ? "Nothing matches the search" : `No ${V.find((t) => t.key === d.value).label.toLowerCase()} yet`), 1),
            b.value ? (l(), E(a(w), {
              key: 0,
              small: "",
              "data-library-clear": "",
              onClick: e[9] || (e[9] = (t) => b.value = "")
            }, {
              default: p(() => [...e[13] || (e[13] = [
                f("Clear the search", -1)
              ])]),
              _: 1
            })) : y("", !0)
          ], 64)) : y("", !0) : (l(), E(a(G), {
            key: 0,
            shape: "cards"
          })),
          (l(!0), o(_, null, I(D.value, (t) => (l(), o(_, {
            key: t.key
          }, [
            t.title ? (l(), o("h3", ue, u(t.title), 1)) : y("", !0),
            (l(!0), o(_, null, I(t.rows, (r) => (l(), o("button", {
              key: r.id,
              type: "button",
              class: "library-row",
              "data-row": r.id,
              onClick: (ke) => W(r)
            }, [
              i(a(H), {
                name: "file",
                class: "library-icon"
              }),
              s("span", be, [
                s("span", ve, u(r.title), 1),
                s("span", ye, u(r.abstract), 1),
                s("span", ce, u(R.value) + " " + u(r.id), 1)
              ]),
              i(a(J), {
                class: "library-age",
                at: r.updated_at
              }, null, 8, ["at"])
            ], 8, de))), 128))
          ], 64))), 128)),
          a(N).length < a(O) && !b.value ? (l(), o("button", {
            key: 3,
            type: "button",
            class: "library-more",
            onClick: e[10] || (e[10] = (...t) => a(B) && a(B)(...t))
          }, "Show more")) : y("", !0)
        ])
      ])
    ]));
  }
}, Ce = /* @__PURE__ */ Q(me, [["__scopeId", "data-v-d338a838"]]);
export {
  Ce as default
};
