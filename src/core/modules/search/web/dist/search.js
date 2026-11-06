/* @code-commandments-generated */
if (!document.getElementById("window-styles-d729f496916c")) { const style = document.createElement("style"); style.id = "window-styles-d729f496916c"; style.textContent = ".search-mark[data-v-7bd5473b]{display:flex;flex-direction:column;gap:1px;min-width:260px;max-width:520px;margin:2px 0 2px 12px}.search-child[data-v-7bd5473b]{display:flex;gap:10px;align-items:baseline;padding:4px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;text-align:left;cursor:pointer}.search-child[data-v-7bd5473b]:hover:not(:disabled){background:var(--hover);color:var(--text)}.search-child[data-v-7bd5473b]:disabled{cursor:default}.search-child-name[data-v-7bd5473b]{flex:none;min-width:64px;color:var(--text-3)}.search-child-excerpt[data-v-7bd5473b]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.search-more[data-v-7bd5473b]{align-items:center;color:var(--text-3)}.search-none[data-v-7bd5473b]{margin:0;padding:4px 8px;color:var(--text-3);font-size:12px}.search[data-v-ac790cb5]{display:flex;flex-direction:column;gap:14px}.search-chips[data-v-ac790cb5]{display:flex;flex-wrap:wrap;gap:6px}.search-chip[data-v-ac790cb5]{padding:2px 10px;border:0;border-radius:10px;background:var(--raised);color:var(--text-2);font-size:12px;cursor:pointer}.search-chip.on[data-v-ac790cb5]{background:var(--accent);color:#fff}.search-hits[data-v-ac790cb5]{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}.search-hit[data-v-ac790cb5]{display:flex;gap:12px;width:100%;padding:8px 10px;border:0;border-radius:7px;background:none;color:var(--text);font:inherit;text-align:left;cursor:pointer}.search-hit[data-v-ac790cb5]:hover:not(:disabled){background:var(--hover)}.search-hit[data-v-ac790cb5]:disabled{cursor:default}.search-hit-name[data-v-ac790cb5]{flex:none;width:110px;color:var(--text-3)}.search-hit-excerpt[data-v-ac790cb5]{flex:1;min-width:0}.search-note[data-v-ac790cb5]{margin:0;color:var(--text-3)}\n"; document.head.appendChild(style); }
import { ref as i, computed as b, openBlock as l, createElementBlock as o, createVNode as g, unref as u, withKeys as N, withModifiers as V, withCtx as y, createTextVNode as q, Fragment as _, renderList as x, normalizeClass as B, toDisplayString as n, createCommentVNode as S, createBlock as W, createElementVNode as d } from "vue";
import { useWindow as K, SearchBar as O, Btn as j, Skeleton as z } from "@journal/window-kit";
import { _ as D } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const E = { class: "search" }, F = {
  key: 0,
  class: "search-chips"
}, I = ["data-model", "onClick"], L = {
  key: 2,
  class: "search-note"
}, M = {
  key: 3,
  class: "search-note",
  "data-no-hits": ""
}, T = { class: "search-hits" }, U = ["disabled", "onClick"], A = { class: "search-hit-name" }, G = { class: "search-hit-excerpt" }, H = {
  key: 0,
  class: "search-note",
  "data-closest": ""
}, J = {
  key: 1,
  class: "search-note",
  "data-total": ""
}, P = {
  __name: "SearchWindow",
  setup(Q) {
    const $ = {
      task: "tasks.tasks",
      plan: "plans.plans",
      doc: "documents.documents",
      question: "questions.questions",
      template: "templates.templates",
      sequence: "sequences.sequences",
      trigger: "triggers.triggers",
      check: "checks.checks"
    }, k = K(), c = i(""), r = i(/* @__PURE__ */ new Set()), t = i(null), h = i(""), v = i(!1), f = b(() => {
      var a;
      return [.../* @__PURE__ */ new Set([...(((a = t.value) == null ? void 0 : a.hits) || []).map((s) => s.cli_name), ...r.value])].sort();
    });
    async function m() {
      const a = c.value.trim().split(/\s+/).filter(Boolean);
      if (!a.length) return void (t.value = null);
      v.value = !0;
      const s = r.value.size ? ` --model ${[...r.value].join(",")}` : "", e = await k.read(`search find ${a.map((p) => `"${p}"`).join(" ")}${s}`);
      v.value = !1, h.value = e.ok ? "" : e.error, t.value = e.ok ? e.value : null;
    }
    function C(a) {
      const s = new Set(r.value);
      s.has(a) ? s.delete(a) : s.add(a), r.value = s, m();
    }
    const w = (a) => $[a.cli_name] || "";
    return (a, s) => (l(), o("div", E, [
      g(u(O), {
        modelValue: c.value,
        "onUpdate:modelValue": s[0] || (s[0] = (e) => c.value = e),
        onKeydown: N(V(m, ["prevent"]), ["enter"])
      }, {
        default: y(() => [
          g(u(j), {
            variant: "primary",
            small: "",
            "data-search-go": "",
            onClick: m
          }, {
            default: y(() => [...s[1] || (s[1] = [
              q("Search", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue", "onKeydown"]),
      f.value.length ? (l(), o("div", F, [
        (l(!0), o(_, null, x(f.value, (e) => (l(), o("button", {
          key: e,
          type: "button",
          class: B(["search-chip", { on: r.value.has(e) }]),
          "data-model": e,
          onClick: (p) => C(e)
        }, n(e), 11, I))), 128))
      ])) : S("", !0),
      v.value ? (l(), W(u(z), {
        key: 1,
        shape: "rows"
      })) : h.value ? (l(), o("p", L, n(h.value), 1)) : t.value && !t.value.hits.length ? (l(), o("p", M, "No results match all these words: " + n(c.value.trim()), 1)) : t.value ? (l(), o(_, { key: 4 }, [
        d("ul", T, [
          (l(!0), o(_, null, x(t.value.hits, (e) => (l(), o("li", {
            key: `${e.cli_name}:${e.id}`
          }, [
            d("button", {
              type: "button",
              class: "search-hit",
              "data-hit": "",
              disabled: !w(e),
              onClick: (p) => u(k).open(w(e))
            }, [
              d("span", A, n(e.cli_name) + " " + n(e.id), 1),
              d("span", G, n(e.excerpt), 1)
            ], 8, U)
          ]))), 128))
        ]),
        t.value.closest ? (l(), o("p", H, "No result holds all these words: " + n(c.value.trim()) + ", these hold most of them, the closest first", 1)) : (l(), o("p", J, n(t.value.total) + " " + n(t.value.total === 1 ? "result matches" : "results match") + " all these words: " + n(c.value.trim()) + n(t.value.total > t.value.hits.length ? `, the newest ${t.value.hits.length} are shown` : ""), 1))
      ], 64)) : S("", !0)
    ]));
  }
}, Z = /* @__PURE__ */ D(P, [["__scopeId", "data-v-ac790cb5"]]);
export {
  Z as default
};
