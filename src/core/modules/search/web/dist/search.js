if (!document.getElementById("window-styles-22969dc962f4")) { const style = document.createElement("style"); style.id = "window-styles-22969dc962f4"; style.textContent = ".search-mark[data-v-7bd5473b]{display:flex;flex-direction:column;gap:1px;min-width:260px;max-width:520px;margin:2px 0 2px 12px}.search-child[data-v-7bd5473b]{display:flex;gap:10px;align-items:baseline;padding:4px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;text-align:left;cursor:pointer}.search-child[data-v-7bd5473b]:hover:not(:disabled){background:var(--hover);color:var(--text)}.search-child[data-v-7bd5473b]:disabled{cursor:default}.search-child-name[data-v-7bd5473b]{flex:none;min-width:64px;color:var(--text-3)}.search-child-excerpt[data-v-7bd5473b]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.search-more[data-v-7bd5473b]{align-items:center;color:var(--text-3)}.search-none[data-v-7bd5473b]{margin:0;padding:4px 8px;color:var(--text-3);font-size:12px}.search-chips[data-v-3684fe42]{display:flex;flex-wrap:wrap;gap:6px;padding:0 var(--inset)}.search-chip[data-v-3684fe42]{padding:2px 10px;border:0;border-radius:10px;background:var(--raised);color:var(--text-2);font-size:12px;cursor:pointer}.search-chip.on[data-v-3684fe42]{background:var(--accent);color:#fff}.search-text[data-v-3684fe42]{margin:0;white-space:pre-wrap}.search-line[data-v-3684fe42]{display:flex;flex-direction:column;min-width:0}.search-line>span[data-v-3684fe42]:first-child{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.search-reference[data-v-3684fe42]{color:var(--accent);font-size:11px}.search-note[data-v-3684fe42]{margin:0;padding:4px var(--inset);color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as c, computed as C, watch as j, onUnmounted as U, openBlock as s, createBlock as $, unref as i, withCtx as n, createVNode as _, createTextVNode as E, createElementBlock as r, createCommentVNode as y, createElementVNode as w, toDisplayString as o, withKeys as K, withModifiers as L, Fragment as M, renderList as R, normalizeClass as z } from "vue";
import { useWindow as A, ListReaderLayout as D, Reader as H, Markdown as I, Btn as P, Skeleton as F, SearchBar as G, Dialog as Y, titleOfWord as N, copying as q, tableOfWord as J, peekRef as Q } from "@journal/window-kit";
import { _ as X } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const Z = {
  key: 0,
  class: "search-chips"
}, ee = ["data-model", "onClick"], te = {
  key: 1,
  class: "search-note"
}, le = {
  key: 2,
  class: "search-note",
  "data-no-hits": ""
}, ae = {
  key: 3,
  class: "search-note",
  "data-closest": ""
}, se = {
  key: 4,
  class: "search-note",
  "data-total": ""
}, oe = { class: "search-text" }, ne = { class: "search-line" }, re = {
  class: "search-reference",
  "data-search-reference": ""
}, ue = {
  key: 1,
  "data-search-empty": ""
}, ce = 300, ie = {
  __name: "SearchWindow",
  setup(de) {
    const p = A(), u = c(""), d = c(/* @__PURE__ */ new Set()), a = c(null), v = c(""), k = c(!1), h = c(null), g = c(null), S = C(() => {
      var t;
      return [.../* @__PURE__ */ new Set([...(((t = a.value) == null ? void 0 : t.hits) || []).map((e) => e.cli_name), ...d.value])].sort();
    }), T = (t) => N(t).replace(/y$/, "ie") + "s", x = (t) => `${N(t.cli_name)} ${t.id}`, V = C(() => {
      var t;
      return (((t = a.value) == null ? void 0 : t.hits) || []).map((e) => ({ id: `${e.cli_name}:${e.id}`, title: e.title || x(e), desc: e.excerpt, group: T(e.cli_name), hit: e }));
    });
    async function m() {
      clearTimeout(f);
      const t = u.value.trim().split(/\s+/).filter(Boolean);
      if (!t.length) return void (a.value = null);
      k.value = !0, g.value = null, p.state["results.terms"] = t.join(" "), d.value.size ? p.state["results.model"] = [...d.value].join(",") : delete p.state["results.model"], await p.reload("results");
      const e = p.props.results;
      k.value = !1, v.value = e.failure.value, a.value = v.value ? null : e.data.value;
    }
    let f = null;
    j(u, (t) => {
      if (clearTimeout(f), !t.trim()) return void m();
      f = setTimeout(m, ce);
    }, { flush: "sync" }), U(() => clearTimeout(f));
    function B(t) {
      const e = new Set(d.value);
      e.has(t) ? e.delete(t) : e.add(t), d.value = e, m();
    }
    function b(t) {
      const e = J(t.cli_name);
      e ? Q(`${e}:${t.id}`) : h.value = t;
    }
    const O = (t) => ({
      head: t.title,
      items: [
        { label: "Open", group: "open", run: () => b(t.hit) },
        { label: "Copy reference", group: "copy", run: ({ say: e }) => q(t.title, t.title, e) }
      ]
    });
    return (t, e) => (s(), $(i(D), {
      chosen: g.value,
      "onUpdate:chosen": e[2] || (e[2] = (l) => g.value = l),
      items: V.value,
      "list-width": 420,
      place: O,
      "empty-title": a.value ? "No match" : "Search the journal",
      "pick-line": "No result chosen",
      "data-search": ""
    }, {
      top: n(() => [
        _(i(G), {
          modelValue: u.value,
          "onUpdate:modelValue": e[0] || (e[0] = (l) => u.value = l),
          placeholder: "Search",
          onKeydown: K(L(m, ["prevent"]), ["enter"])
        }, null, 8, ["modelValue", "onKeydown"]),
        S.value.length ? (s(), r("div", Z, [
          (s(!0), r(M, null, R(S.value, (l) => (s(), r("button", {
            key: l,
            type: "button",
            class: z(["search-chip", { on: d.value.has(l) }]),
            "data-model": l,
            onClick: (W) => B(l)
          }, o(l), 11, ee))), 128))
        ])) : y("", !0),
        v.value ? (s(), r("p", te, o(v.value), 1)) : a.value && !a.value.hits.length ? (s(), r("p", le, "No results match all these words: " + o(u.value.trim()), 1)) : a.value && a.value.closest ? (s(), r("p", ae, "No result holds all these words: " + o(u.value.trim()) + ", these hold most of them, the closest first", 1)) : a.value ? (s(), r("p", se, o(a.value.total) + " " + o(a.value.total === 1 ? "result matches" : "results match") + " all these words: " + o(u.value.trim()) + o(a.value.total > a.value.hits.length ? `, the newest ${a.value.hits.length} are shown` : ""), 1)) : y("", !0),
        h.value ? (s(), $(i(Y), {
          key: 5,
          padded: "",
          title: `${h.value.cli_name} ${h.value.id}`,
          small: "",
          "data-hit-dialog": "",
          onClose: e[1] || (e[1] = (l) => h.value = null)
        }, {
          default: n(() => [
            w("p", oe, o(h.value.excerpt), 1)
          ]),
          _: 1
        }, 8, ["title"])) : y("", !0)
      ]),
      line: n(({ item: l }) => [
        w("span", ne, [
          w("span", null, o(l.desc), 1),
          w("span", re, o(x(l.hit)), 1)
        ])
      ]),
      empty: n(() => [
        k.value ? (s(), $(i(F), {
          key: 0,
          shape: "rows"
        })) : a.value ? y("", !0) : (s(), r("span", ue, "Type words to find documents, tasks, memories and every other row. A result holds every word."))
      ]),
      reader: n(({ item: l }) => [
        _(i(H), {
          title: l.title,
          number: x(l.hit),
          facts: a.value.closest ? [{ name: "holds", label: "Holds", value: l.hit.matched_tokens.join(", ") }] : [],
          "data-search-reader": ""
        }, {
          primary: n(() => [
            _(i(P), {
              small: "",
              variant: "primary",
              "data-search-open": "",
              onClick: (W) => b(l.hit)
            }, {
              default: n(() => [...e[3] || (e[3] = [
                E("Open", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ]),
          default: n(() => [
            _(i(I), {
              text: l.hit.body || l.hit.excerpt,
              "data-search-text": ""
            }, null, 8, ["text"])
          ]),
          _: 2
        }, 1032, ["title", "number", "facts"])
      ]),
      _: 1
    }, 8, ["chosen", "items", "empty-title"]));
  }
}, me = /* @__PURE__ */ X(ie, [["__scopeId", "data-v-3684fe42"]]);
export {
  me as default
};
