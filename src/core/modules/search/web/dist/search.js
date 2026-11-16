if (!document.getElementById("window-styles-b766bf0a5561")) { const style = document.createElement("style"); style.id = "window-styles-b766bf0a5561"; style.textContent = ".search-mark[data-v-7bd5473b]{display:flex;flex-direction:column;gap:1px;min-width:260px;max-width:520px;margin:2px 0 2px 12px}.search-child[data-v-7bd5473b]{display:flex;gap:10px;align-items:baseline;padding:4px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;text-align:left;cursor:pointer}.search-child[data-v-7bd5473b]:hover:not(:disabled){background:var(--hover);color:var(--text)}.search-child[data-v-7bd5473b]:disabled{cursor:default}.search-child-name[data-v-7bd5473b]{flex:none;min-width:64px;color:var(--text-3)}.search-child-excerpt[data-v-7bd5473b]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.search-more[data-v-7bd5473b]{align-items:center;color:var(--text-3)}.search-none[data-v-7bd5473b]{margin:0;padding:4px 8px;color:var(--text-3);font-size:12px}.search-chips[data-v-be1ec60b]{display:flex;flex-wrap:wrap;gap:6px;padding:0 var(--inset)}.search-chip[data-v-be1ec60b]{padding:2px 10px;border:0;border-radius:10px;background:var(--raised);color:var(--text-2);font-size:12px;cursor:pointer}.search-chip.on[data-v-be1ec60b]{background:var(--accent);color:#fff}.search-text[data-v-be1ec60b]{margin:0;white-space:pre-wrap}.search-line[data-v-be1ec60b]{display:flex;flex-direction:column;min-width:0}.search-line>span[data-v-be1ec60b]:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.search-state[data-v-be1ec60b]{color:var(--text-4);font-size:12px;white-space:nowrap}.search-reference[data-v-be1ec60b]{color:var(--accent);font-size:11px}.search-note[data-v-be1ec60b]{margin:0;padding:4px var(--inset);color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as i, computed as C, watch as W, onUnmounted as L, openBlock as s, createBlock as b, unref as c, withCtx as n, createVNode as y, createTextVNode as U, createElementBlock as r, createCommentVNode as v, createElementVNode as w, toDisplayString as o, withKeys as E, withModifiers as K, Fragment as M, renderList as R, normalizeClass as z } from "vue";
import { useWindow as A, ListReaderLayout as D, Reader as H, Markdown as I, Btn as P, Skeleton as F, stateLabel as G, SearchBar as Y, Dialog as q, titleOfWord as N, copying as J, tableOfWord as Q, peekRef as X } from "@journal/window-kit";
import { _ as Z } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const ee = {
  key: 0,
  class: "search-chips"
}, te = ["data-model", "onClick"], ae = {
  key: 1,
  class: "search-note"
}, le = {
  key: 2,
  class: "search-note",
  "data-no-hits": ""
}, se = {
  key: 3,
  class: "search-note",
  "data-closest": ""
}, oe = {
  key: 4,
  class: "search-note",
  "data-total": ""
}, ne = { class: "search-text" }, re = {
  key: 0,
  class: "search-state",
  "data-search-state": ""
}, ce = { class: "search-line" }, ue = {
  class: "search-reference",
  "data-search-reference": ""
}, ie = {
  key: 1,
  "data-search-empty": ""
}, de = 300, he = {
  __name: "SearchWindow",
  setup(pe) {
    const p = A(), u = i(""), d = i(/* @__PURE__ */ new Set()), l = i(null), m = i(""), k = i(!1), h = i(null), g = i(null), $ = C(() => {
      var t;
      return [.../* @__PURE__ */ new Set([...(((t = l.value) == null ? void 0 : t.hits) || []).map((e) => e.cli_name), ...d.value])].sort();
    }), T = (t) => N(t).replace(/y$/, "ie") + "s", x = (t) => `${N(t.cli_name)} ${t.id}`, V = C(() => {
      var t;
      return (((t = l.value) == null ? void 0 : t.hits) || []).map((e) => ({ id: `${e.cli_name}:${e.id}`, title: e.title || x(e), desc: e.excerpt, group: T(e.cli_name), hit: e }));
    });
    async function f() {
      clearTimeout(_);
      const t = u.value.trim().split(/\s+/).filter(Boolean);
      if (!t.length) return void (l.value = null);
      k.value = !0, g.value = null, p.state["results.terms"] = t.join(" "), d.value.size ? p.state["results.model"] = [...d.value].join(",") : delete p.state["results.model"], await p.reload("results");
      const e = p.props.results;
      k.value = !1, m.value = e.failure.value, l.value = m.value ? null : e.data.value;
    }
    let _ = null;
    W(u, (t) => {
      if (clearTimeout(_), !t.trim()) return void f();
      _ = setTimeout(f, de);
    }, { flush: "sync" }), L(() => clearTimeout(_));
    function B(t) {
      const e = new Set(d.value);
      e.has(t) ? e.delete(t) : e.add(t), d.value = e, f();
    }
    function S(t) {
      const e = Q(t.cli_name);
      e ? X(`${e}:${t.id}`) : h.value = t;
    }
    const O = (t) => ({
      head: t.title,
      items: [
        { label: "Open", group: "open", run: () => S(t.hit) },
        { label: "Copy reference", group: "copy", run: ({ say: e }) => J(t.title, t.title, e) }
      ]
    });
    return (t, e) => (s(), b(c(D), {
      chosen: g.value,
      "onUpdate:chosen": e[2] || (e[2] = (a) => g.value = a),
      items: V.value,
      "list-width": 420,
      place: O,
      "empty-title": l.value ? "No match" : "Search the journal",
      "pick-line": "No result chosen",
      "data-search": ""
    }, {
      top: n(() => [
        y(c(Y), {
          modelValue: u.value,
          "onUpdate:modelValue": e[0] || (e[0] = (a) => u.value = a),
          placeholder: "Search",
          onKeydown: E(K(f, ["prevent"]), ["enter"])
        }, null, 8, ["modelValue", "onKeydown"]),
        $.value.length ? (s(), r("div", ee, [
          (s(!0), r(M, null, R($.value, (a) => (s(), r("button", {
            key: a,
            type: "button",
            class: z(["search-chip", { on: d.value.has(a) }]),
            "data-model": a,
            onClick: (j) => B(a)
          }, o(a), 11, te))), 128))
        ])) : v("", !0),
        m.value ? (s(), r("p", ae, o(m.value), 1)) : l.value && !l.value.hits.length ? (s(), r("p", le, "No results match all these words: " + o(u.value.trim()), 1)) : l.value && l.value.closest ? (s(), r("p", se, "No result holds all these words: " + o(u.value.trim()) + ", these hold most of them, the closest first", 1)) : l.value ? (s(), r("p", oe, o(l.value.total) + " " + o(l.value.total === 1 ? "result matches" : "results match") + " all these words: " + o(u.value.trim()) + o(l.value.total > l.value.hits.length ? `, the newest ${l.value.hits.length} are shown` : ""), 1)) : v("", !0),
        h.value ? (s(), b(c(q), {
          key: 5,
          padded: "",
          title: `${h.value.cli_name} ${h.value.id}`,
          small: "",
          "data-hit-dialog": "",
          onClose: e[1] || (e[1] = (a) => h.value = null)
        }, {
          default: n(() => [
            w("p", ne, o(h.value.excerpt), 1)
          ]),
          _: 1
        }, 8, ["title"])) : v("", !0)
      ]),
      meta: n(({ item: a }) => [
        a.hit.state ? (s(), r("span", re, o(c(G)(a.hit.cli_name, a.hit.state)), 1)) : v("", !0)
      ]),
      line: n(({ item: a }) => [
        w("span", ce, [
          w("span", null, o(a.desc), 1),
          w("span", ue, o(x(a.hit)), 1)
        ])
      ]),
      empty: n(() => [
        k.value ? (s(), b(c(F), {
          key: 0,
          shape: "rows"
        })) : l.value ? v("", !0) : (s(), r("span", ie, "Type words to find documents, tasks, memories and everything else the journal keeps. A result contains every word."))
      ]),
      reader: n(({ item: a }) => [
        y(c(H), {
          title: a.title,
          number: x(a.hit),
          facts: l.value.closest ? [{ name: "holds", label: "Holds", value: a.hit.matched_tokens.join(", ") }] : [],
          "data-search-reader": ""
        }, {
          primary: n(() => [
            y(c(P), {
              small: "",
              variant: "primary",
              "data-search-open": "",
              onClick: (j) => S(a.hit)
            }, {
              default: n(() => [...e[3] || (e[3] = [
                U("Open", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ]),
          default: n(() => [
            y(c(I), {
              text: a.hit.body || a.hit.excerpt,
              "data-search-text": ""
            }, null, 8, ["text"])
          ]),
          _: 2
        }, 1032, ["title", "number", "facts"])
      ]),
      _: 1
    }, 8, ["chosen", "items", "empty-title"]));
  }
}, _e = /* @__PURE__ */ Z(he, [["__scopeId", "data-v-be1ec60b"]]);
export {
  _e as default
};
