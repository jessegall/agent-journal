if (!document.getElementById("window-styles-6db50b252113")) { const style = document.createElement("style"); style.id = "window-styles-6db50b252113"; style.textContent = ".search-mark[data-v-1c0a0a5e]{display:flex;flex-direction:column;gap:1px;min-width:260px;max-width:520px;margin:2px 0 2px 12px}.search-child[data-v-1c0a0a5e]{display:flex;gap:10px;align-items:baseline;padding:4px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;text-align:left;cursor:pointer}.search-child[data-v-1c0a0a5e]:hover:not(:disabled){background:var(--hover);color:var(--text)}.search-child[data-v-1c0a0a5e]:disabled{cursor:default}.search-child-name[data-v-1c0a0a5e]{flex:none;min-width:64px;color:var(--text-3)}.search-child-excerpt[data-v-1c0a0a5e]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.search-more[data-v-1c0a0a5e]{align-items:center;color:var(--text-3)}.search-none[data-v-1c0a0a5e]{margin:0;padding:4px 8px;color:var(--text-3);font-size:12px}.search[data-v-d40ddf74]{display:flex;flex-direction:column;gap:14px}.search-chips[data-v-d40ddf74]{display:flex;flex-wrap:wrap;gap:6px}.search-chip[data-v-d40ddf74]{padding:2px 10px;border:0;border-radius:10px;background:var(--raised);color:var(--text-2);font-size:12px;cursor:pointer}.search-chip.on[data-v-d40ddf74]{background:var(--accent);color:#fff}.search-hits[data-v-d40ddf74]{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}.search-hit[data-v-d40ddf74]{display:flex;gap:12px;width:100%;padding:8px 10px;border:0;border-radius:7px;background:none;color:var(--text);font:inherit;text-align:left;cursor:pointer}.search-hit[data-v-d40ddf74]:hover{background:var(--hover)}.search-dialog-text[data-v-d40ddf74]{margin:0;white-space:pre-wrap}.search-hit-name[data-v-d40ddf74]{flex:none;width:110px;color:var(--text-3)}.search-hit-excerpt[data-v-d40ddf74]{flex:1;min-width:0}.search-hit-words[data-v-d40ddf74]{color:var(--text-2);font-size:12px}.search-note[data-v-d40ddf74]{margin:0;color:var(--text-3)}\n"; document.head.appendChild(style); }
import { ref as i, computed as b, openBlock as l, createElementBlock as n, createVNode as g, unref as _, withKeys as B, withModifiers as N, withCtx as w, createTextVNode as W, Fragment as k, renderList as x, normalizeClass as j, toDisplayString as o, createCommentVNode as m, createBlock as $, createElementVNode as h } from "vue";
import { useWindow as K, SearchBar as z, Btn as D, Skeleton as E, Dialog as F, tableOfWord as H, peekRef as I } from "@journal/window-kit";
import { _ as L } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const M = { class: "search" }, O = {
  key: 0,
  class: "search-chips"
}, R = ["data-model", "onClick"], T = {
  key: 2,
  class: "search-note"
}, U = {
  key: 3,
  class: "search-note",
  "data-no-hits": ""
}, q = { class: "search-hits" }, A = ["onClick"], G = { class: "search-hit-name" }, J = { class: "search-hit-excerpt" }, P = {
  key: 0,
  class: "search-hit-words",
  "data-hit-words": ""
}, Q = {
  key: 0,
  class: "search-note",
  "data-closest": ""
}, X = {
  key: 1,
  class: "search-note",
  "data-total": ""
}, Y = { class: "search-dialog-text" }, Z = {
  __name: "SearchWindow",
  setup(ee) {
    const d = K(), r = i(""), u = i(/* @__PURE__ */ new Set()), s = i(null), v = i(""), p = i(!1), c = i(null), y = b(() => {
      var a;
      return [.../* @__PURE__ */ new Set([...(((a = s.value) == null ? void 0 : a.hits) || []).map((e) => e.cli_name), ...u.value])].sort();
    });
    async function f() {
      const a = r.value.trim().split(/\s+/).filter(Boolean);
      if (!a.length) return void (s.value = null);
      p.value = !0, d.state["results.terms"] = a.join(" "), u.value.size ? d.state["results.model"] = [...u.value].join(",") : delete d.state["results.model"], await d.reload("results");
      const e = d.props.results;
      p.value = !1, v.value = e.failure.value, s.value = v.value ? null : e.data.value;
    }
    function C(a) {
      const e = new Set(u.value);
      e.has(a) ? e.delete(a) : e.add(a), u.value = e, f();
    }
    function S(a) {
      const e = H(a.cli_name);
      e ? I(`${e}:${a.id}`) : c.value = a;
    }
    return (a, e) => (l(), n("div", M, [
      g(_(z), {
        modelValue: r.value,
        "onUpdate:modelValue": e[0] || (e[0] = (t) => r.value = t),
        onKeydown: B(N(f, ["prevent"]), ["enter"])
      }, {
        default: w(() => [
          g(_(D), {
            variant: "primary",
            small: "",
            "data-search-go": "",
            onClick: f
          }, {
            default: w(() => [...e[2] || (e[2] = [
              W("Search", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue", "onKeydown"]),
      y.value.length ? (l(), n("div", O, [
        (l(!0), n(k, null, x(y.value, (t) => (l(), n("button", {
          key: t,
          type: "button",
          class: j(["search-chip", { on: u.value.has(t) }]),
          "data-model": t,
          onClick: (V) => C(t)
        }, o(t), 11, R))), 128))
      ])) : m("", !0),
      p.value ? (l(), $(_(E), {
        key: 1,
        shape: "rows"
      })) : v.value ? (l(), n("p", T, o(v.value), 1)) : s.value && !s.value.hits.length ? (l(), n("p", U, "No results match all these words: " + o(r.value.trim()), 1)) : s.value ? (l(), n(k, { key: 4 }, [
        h("ul", q, [
          (l(!0), n(k, null, x(s.value.hits, (t) => (l(), n("li", {
            key: `${t.cli_name}:${t.id}`
          }, [
            h("button", {
              type: "button",
              class: "search-hit",
              "data-hit": "",
              onClick: (V) => S(t)
            }, [
              h("span", G, o(t.cli_name) + " " + o(t.id), 1),
              h("span", J, o(t.excerpt), 1),
              s.value.closest ? (l(), n("span", P, "holds: " + o(t.matched_words.join(", ")), 1)) : m("", !0)
            ], 8, A)
          ]))), 128))
        ]),
        s.value.closest ? (l(), n("p", Q, "No result holds all these words: " + o(r.value.trim()) + ", these hold most of them, the closest first", 1)) : (l(), n("p", X, o(s.value.total) + " " + o(s.value.total === 1 ? "result matches" : "results match") + " all these words: " + o(r.value.trim()) + o(s.value.total > s.value.hits.length ? `, the newest ${s.value.hits.length} are shown` : ""), 1))
      ], 64)) : m("", !0),
      c.value ? (l(), $(_(F), {
        key: 5,
        padded: "",
        title: `${c.value.cli_name} ${c.value.id}`,
        small: "",
        "data-hit-dialog": "",
        onClose: e[1] || (e[1] = (t) => c.value = null)
      }, {
        default: w(() => [
          h("p", Y, o(c.value.excerpt), 1)
        ]),
        _: 1
      }, 8, ["title"])) : m("", !0)
    ]));
  }
}, le = /* @__PURE__ */ L(Z, [["__scopeId", "data-v-d40ddf74"]]);
export {
  le as default
};
