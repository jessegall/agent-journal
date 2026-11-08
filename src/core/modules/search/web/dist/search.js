/* @code-commandments-generated */
if (!document.getElementById("window-styles-0973380a50ca")) { const style = document.createElement("style"); style.id = "window-styles-0973380a50ca"; style.textContent = ".search-mark[data-v-1c0a0a5e]{display:flex;flex-direction:column;gap:1px;min-width:260px;max-width:520px;margin:2px 0 2px 12px}.search-child[data-v-1c0a0a5e]{display:flex;gap:10px;align-items:baseline;padding:4px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;text-align:left;cursor:pointer}.search-child[data-v-1c0a0a5e]:hover:not(:disabled){background:var(--hover);color:var(--text)}.search-child[data-v-1c0a0a5e]:disabled{cursor:default}.search-child-name[data-v-1c0a0a5e]{flex:none;min-width:64px;color:var(--text-3)}.search-child-excerpt[data-v-1c0a0a5e]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.search-more[data-v-1c0a0a5e]{align-items:center;color:var(--text-3)}.search-none[data-v-1c0a0a5e]{margin:0;padding:4px 8px;color:var(--text-3);font-size:12px}.search[data-v-026bff2e]{display:flex;flex-direction:column;gap:14px}.search-chips[data-v-026bff2e]{display:flex;flex-wrap:wrap;gap:6px}.search-chip[data-v-026bff2e]{padding:2px 10px;border:0;border-radius:10px;background:var(--raised);color:var(--text-2);font-size:12px;cursor:pointer}.search-chip.on[data-v-026bff2e]{background:var(--accent);color:#fff}.search-hits[data-v-026bff2e]{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}.search-hit[data-v-026bff2e]{display:flex;gap:12px;width:100%;padding:8px 10px;border:0;border-radius:7px;background:none;color:var(--text);font:inherit;text-align:left;cursor:pointer}.search-hit[data-v-026bff2e]:hover{background:var(--hover)}.search-dialog-text[data-v-026bff2e]{margin:0;white-space:pre-wrap}.search-hit-name[data-v-026bff2e]{flex:none;width:110px;color:var(--text-3)}.search-hit-excerpt[data-v-026bff2e]{flex:1;min-width:0}.search-note[data-v-026bff2e]{margin:0;color:var(--text-3)}\n"; document.head.appendChild(style); }
import { ref as i, computed as V, openBlock as l, createElementBlock as n, createVNode as g, unref as _, withKeys as B, withModifiers as N, withCtx as f, createTextVNode as W, Fragment as k, renderList as x, normalizeClass as K, toDisplayString as o, createCommentVNode as w, createBlock as $, createElementVNode as h } from "vue";
import { useWindow as j, SearchBar as z, Btn as D, Skeleton as E, Dialog as F, tableOfWord as H, peekRef as I } from "@journal/window-kit";
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
  class: "search-note",
  "data-closest": ""
}, Q = {
  key: 1,
  class: "search-note",
  "data-total": ""
}, X = { class: "search-dialog-text" }, Y = {
  __name: "SearchWindow",
  setup(Z) {
    const d = j(), r = i(""), u = i(/* @__PURE__ */ new Set()), a = i(null), v = i(""), m = i(!1), c = i(null), y = V(() => {
      var s;
      return [.../* @__PURE__ */ new Set([...(((s = a.value) == null ? void 0 : s.hits) || []).map((e) => e.cli_name), ...u.value])].sort();
    });
    async function p() {
      const s = r.value.trim().split(/\s+/).filter(Boolean);
      if (!s.length) return void (a.value = null);
      m.value = !0, d.state["results.terms"] = s.join(" "), u.value.size ? d.state["results.model"] = [...u.value].join(",") : delete d.state["results.model"], await d.reload("results");
      const e = d.props.results;
      m.value = !1, v.value = e.failure.value, a.value = v.value ? null : e.data.value;
    }
    function C(s) {
      const e = new Set(u.value);
      e.has(s) ? e.delete(s) : e.add(s), u.value = e, p();
    }
    function S(s) {
      const e = H(s.cli_name);
      e ? I(`${e}:${s.id}`) : c.value = s;
    }
    return (s, e) => (l(), n("div", M, [
      g(_(z), {
        modelValue: r.value,
        "onUpdate:modelValue": e[0] || (e[0] = (t) => r.value = t),
        onKeydown: B(N(p, ["prevent"]), ["enter"])
      }, {
        default: f(() => [
          g(_(D), {
            variant: "primary",
            small: "",
            "data-search-go": "",
            onClick: p
          }, {
            default: f(() => [...e[2] || (e[2] = [
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
          class: K(["search-chip", { on: u.value.has(t) }]),
          "data-model": t,
          onClick: (b) => C(t)
        }, o(t), 11, R))), 128))
      ])) : w("", !0),
      m.value ? (l(), $(_(E), {
        key: 1,
        shape: "rows"
      })) : v.value ? (l(), n("p", T, o(v.value), 1)) : a.value && !a.value.hits.length ? (l(), n("p", U, "No results match all these words: " + o(r.value.trim()), 1)) : a.value ? (l(), n(k, { key: 4 }, [
        h("ul", q, [
          (l(!0), n(k, null, x(a.value.hits, (t) => (l(), n("li", {
            key: `${t.cli_name}:${t.id}`
          }, [
            h("button", {
              type: "button",
              class: "search-hit",
              "data-hit": "",
              onClick: (b) => S(t)
            }, [
              h("span", G, o(t.cli_name) + " " + o(t.id), 1),
              h("span", J, o(t.excerpt), 1)
            ], 8, A)
          ]))), 128))
        ]),
        a.value.closest ? (l(), n("p", P, "No result holds all these words: " + o(r.value.trim()) + ", these hold most of them, the closest first", 1)) : (l(), n("p", Q, o(a.value.total) + " " + o(a.value.total === 1 ? "result matches" : "results match") + " all these words: " + o(r.value.trim()) + o(a.value.total > a.value.hits.length ? `, the newest ${a.value.hits.length} are shown` : ""), 1))
      ], 64)) : w("", !0),
      c.value ? (l(), $(_(F), {
        key: 5,
        title: `${c.value.cli_name} ${c.value.id}`,
        small: "",
        "data-hit-dialog": "",
        onClose: e[1] || (e[1] = (t) => c.value = null)
      }, {
        default: f(() => [
          h("p", X, o(c.value.excerpt), 1)
        ]),
        _: 1
      }, 8, ["title"])) : w("", !0)
    ]));
  }
}, ae = /* @__PURE__ */ L(Y, [["__scopeId", "data-v-026bff2e"]]);
export {
  ae as default
};
