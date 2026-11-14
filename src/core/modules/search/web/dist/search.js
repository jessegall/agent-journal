if (!document.getElementById("window-styles-2eb3fd2d8cfb")) { const style = document.createElement("style"); style.id = "window-styles-2eb3fd2d8cfb"; style.textContent = ".search-mark[data-v-7bd5473b]{display:flex;flex-direction:column;gap:1px;min-width:260px;max-width:520px;margin:2px 0 2px 12px}.search-child[data-v-7bd5473b]{display:flex;gap:10px;align-items:baseline;padding:4px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;text-align:left;cursor:pointer}.search-child[data-v-7bd5473b]:hover:not(:disabled){background:var(--hover);color:var(--text)}.search-child[data-v-7bd5473b]:disabled{cursor:default}.search-child-name[data-v-7bd5473b]{flex:none;min-width:64px;color:var(--text-3)}.search-child-excerpt[data-v-7bd5473b]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.search-more[data-v-7bd5473b]{align-items:center;color:var(--text-3)}.search-none[data-v-7bd5473b]{margin:0;padding:4px 8px;color:var(--text-3);font-size:12px}.search-chips[data-v-7a9eb178]{display:flex;flex-wrap:wrap;gap:6px;padding:0 var(--inset)}.search-chip[data-v-7a9eb178]{padding:2px 10px;border:0;border-radius:10px;background:var(--raised);color:var(--text-2);font-size:12px;cursor:pointer}.search-chip.on[data-v-7a9eb178]{background:var(--accent);color:#fff}.search-text[data-v-7a9eb178]{margin:0;white-space:pre-wrap}.search-note[data-v-7a9eb178]{margin:0;padding:4px var(--inset);color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as u, computed as S, openBlock as s, createBlock as k, unref as c, withCtx as n, createVNode as m, createElementVNode as b, toDisplayString as o, createTextVNode as g, createElementBlock as r, Fragment as N, createCommentVNode as f, withKeys as E, withModifiers as K, renderList as L, normalizeClass as R } from "vue";
import { useWindow as U, ListReaderLayout as z, Reader as A, Btn as V, Skeleton as D, SearchBar as H, Dialog as T, copying as F, tableOfWord as I, peekRef as M } from "@journal/window-kit";
import { _ as q } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const G = {
  key: 0,
  class: "search-chips"
}, J = ["data-model", "onClick"], P = {
  key: 1,
  class: "search-note"
}, Q = {
  key: 2,
  class: "search-note",
  "data-no-hits": ""
}, X = {
  key: 3,
  class: "search-note",
  "data-closest": ""
}, Y = {
  key: 4,
  class: "search-note",
  "data-total": ""
}, Z = { class: "search-text" }, ee = {
  class: "search-text",
  "data-search-text": ""
}, te = {
  __name: "SearchWindow",
  setup(ae) {
    const p = U(), i = u(""), d = u(/* @__PURE__ */ new Set()), a = u(null), v = u(""), _ = u(!1), h = u(null), y = u(null), x = S(() => {
      var t;
      return [.../* @__PURE__ */ new Set([...(((t = a.value) == null ? void 0 : t.hits) || []).map((e) => e.cli_name), ...d.value])].sort();
    }), $ = (t) => t.charAt(0).toUpperCase() + t.slice(1), B = S(() => {
      var t;
      return (((t = a.value) == null ? void 0 : t.hits) || []).map((e) => ({ id: `${e.cli_name}:${e.id}`, title: `${e.cli_name} ${e.id}`, desc: e.excerpt, group: $(e.cli_name), hit: e }));
    });
    async function w() {
      const t = i.value.trim().split(/\s+/).filter(Boolean);
      if (!t.length) return void (a.value = null);
      _.value = !0, y.value = null, p.state["results.terms"] = t.join(" "), d.value.size ? p.state["results.model"] = [...d.value].join(",") : delete p.state["results.model"], await p.reload("results");
      const e = p.props.results;
      _.value = !1, v.value = e.failure.value, a.value = v.value ? null : e.data.value;
    }
    function O(t) {
      const e = new Set(d.value);
      e.has(t) ? e.delete(t) : e.add(t), d.value = e, w();
    }
    function C(t) {
      const e = I(t.cli_name);
      e ? M(`${e}:${t.id}`) : h.value = t;
    }
    const W = (t) => ({
      head: t.title,
      items: [
        { label: "Open", group: "open", run: () => C(t.hit) },
        { label: "Copy reference", group: "copy", run: ({ say: e }) => F(t.title, t.title, e) }
      ]
    });
    return (t, e) => (s(), k(c(z), {
      chosen: y.value,
      "onUpdate:chosen": e[2] || (e[2] = (l) => y.value = l),
      items: B.value,
      "list-width": 420,
      place: W,
      "empty-title": a.value ? "No match" : "Search",
      "pick-line": "No result chosen",
      "data-search": ""
    }, {
      top: n(() => [
        m(c(H), {
          modelValue: i.value,
          "onUpdate:modelValue": e[0] || (e[0] = (l) => i.value = l),
          placeholder: "Search",
          onKeydown: E(K(w, ["prevent"]), ["enter"])
        }, {
          default: n(() => [
            m(c(V), {
              variant: "primary",
              small: "",
              "data-search-go": "",
              onClick: w
            }, {
              default: n(() => [...e[3] || (e[3] = [
                g("Search", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue", "onKeydown"]),
        x.value.length ? (s(), r("div", G, [
          (s(!0), r(N, null, L(x.value, (l) => (s(), r("button", {
            key: l,
            type: "button",
            class: R(["search-chip", { on: d.value.has(l) }]),
            "data-model": l,
            onClick: (j) => O(l)
          }, o(l), 11, J))), 128))
        ])) : f("", !0),
        v.value ? (s(), r("p", P, o(v.value), 1)) : a.value && !a.value.hits.length ? (s(), r("p", Q, "No results match all these words: " + o(i.value.trim()), 1)) : a.value && a.value.closest ? (s(), r("p", X, "No result holds all these words: " + o(i.value.trim()) + ", these hold most of them, the closest first", 1)) : a.value ? (s(), r("p", Y, o(a.value.total) + " " + o(a.value.total === 1 ? "result matches" : "results match") + " all these words: " + o(i.value.trim()) + o(a.value.total > a.value.hits.length ? `, the newest ${a.value.hits.length} are shown` : ""), 1)) : f("", !0),
        h.value ? (s(), k(c(T), {
          key: 5,
          padded: "",
          title: `${h.value.cli_name} ${h.value.id}`,
          small: "",
          "data-hit-dialog": "",
          onClose: e[1] || (e[1] = (l) => h.value = null)
        }, {
          default: n(() => [
            b("p", Z, o(h.value.excerpt), 1)
          ]),
          _: 1
        }, 8, ["title"])) : f("", !0)
      ]),
      empty: n(() => [
        _.value ? (s(), k(c(D), {
          key: 0,
          shape: "rows"
        })) : a.value ? f("", !0) : (s(), r(N, { key: 1 }, [
          g("Type words and press Enter. A result holds every word.")
        ], 64))
      ]),
      reader: n(({ item: l }) => [
        m(c(A), {
          title: l.title,
          number: $(l.hit.cli_name),
          facts: a.value.closest ? [{ name: "holds", label: "Holds", value: l.hit.matched_tokens.join(", ") }] : [],
          "data-search-reader": ""
        }, {
          primary: n(() => [
            m(c(V), {
              small: "",
              variant: "primary",
              "data-search-open": "",
              onClick: (j) => C(l.hit)
            }, {
              default: n(() => [...e[4] || (e[4] = [
                g("Open", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ]),
          default: n(() => [
            b("p", ee, o(l.hit.excerpt), 1)
          ]),
          _: 2
        }, 1032, ["title", "number", "facts"])
      ]),
      _: 1
    }, 8, ["chosen", "items", "empty-title"]));
  }
}, ne = /* @__PURE__ */ q(te, [["__scopeId", "data-v-7a9eb178"]]);
export {
  ne as default
};
