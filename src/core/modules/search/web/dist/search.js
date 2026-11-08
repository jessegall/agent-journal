/* @code-commandments-generated */
if (!document.getElementById("window-styles-36d3c8c8ce43")) { const style = document.createElement("style"); style.id = "window-styles-36d3c8c8ce43"; style.textContent = ".search-mark[data-v-1c0a0a5e]{display:flex;flex-direction:column;gap:1px;min-width:260px;max-width:520px;margin:2px 0 2px 12px}.search-child[data-v-1c0a0a5e]{display:flex;gap:10px;align-items:baseline;padding:4px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;text-align:left;cursor:pointer}.search-child[data-v-1c0a0a5e]:hover:not(:disabled){background:var(--hover);color:var(--text)}.search-child[data-v-1c0a0a5e]:disabled{cursor:default}.search-child-name[data-v-1c0a0a5e]{flex:none;min-width:64px;color:var(--text-3)}.search-child-excerpt[data-v-1c0a0a5e]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.search-more[data-v-1c0a0a5e]{align-items:center;color:var(--text-3)}.search-none[data-v-1c0a0a5e]{margin:0;padding:4px 8px;color:var(--text-3);font-size:12px}.search[data-v-932ed316]{display:flex;flex-direction:column;gap:14px}.search-chips[data-v-932ed316]{display:flex;flex-wrap:wrap;gap:6px}.search-chip[data-v-932ed316]{padding:2px 10px;border:0;border-radius:10px;background:var(--raised);color:var(--text-2);font-size:12px;cursor:pointer}.search-chip.on[data-v-932ed316]{background:var(--accent);color:#fff}.search-hits[data-v-932ed316]{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}.search-hit[data-v-932ed316]{display:flex;gap:12px;width:100%;padding:8px 10px;border:0;border-radius:7px;background:none;color:var(--text);font:inherit;text-align:left;cursor:pointer}.search-hit[data-v-932ed316]:hover:not(:disabled){background:var(--hover)}.search-hit[data-v-932ed316]:disabled{cursor:default}.search-hit-name[data-v-932ed316]{flex:none;width:110px;color:var(--text-3)}.search-hit-excerpt[data-v-932ed316]{flex:1;min-width:0}.search-note[data-v-932ed316]{margin:0;color:var(--text-3)}\n"; document.head.appendChild(style); }
import { ref as i, computed as V, openBlock as l, createElementBlock as o, createVNode as w, unref as h, withKeys as b, withModifiers as q, withCtx as g, createTextVNode as B, Fragment as _, renderList as y, normalizeClass as W, toDisplayString as n, createCommentVNode as x, createBlock as $, createElementVNode as v } from "vue";
import { useWindow as K, SearchBar as O, Btn as j, Skeleton as z } from "@journal/window-kit";
import { _ as D } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
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
    const S = {
      task: "tasks.tasks",
      plan: "plans.plans",
      doc: "documents.documents",
      question: "questions.questions",
      template: "templates.templates",
      sequence: "sequences.sequences",
      trigger: "triggers.triggers",
      check: "checks.checks"
    }, r = K(), c = i(""), u = i(/* @__PURE__ */ new Set()), s = i(null), d = i(""), m = i(!1), f = V(() => {
      var a;
      return [.../* @__PURE__ */ new Set([...(((a = s.value) == null ? void 0 : a.hits) || []).map((t) => t.cli_name), ...u.value])].sort();
    });
    async function p() {
      const a = c.value.trim().split(/\s+/).filter(Boolean);
      if (!a.length) return void (s.value = null);
      m.value = !0, r.state["results.terms"] = a.join(" "), u.value.size ? r.state["results.model"] = [...u.value].join(",") : delete r.state["results.model"], await r.reload("results");
      const t = r.props.results;
      m.value = !1, d.value = t.failure.value, s.value = d.value ? null : t.data.value;
    }
    function C(a) {
      const t = new Set(u.value);
      t.has(a) ? t.delete(a) : t.add(a), u.value = t, p();
    }
    const k = (a) => S[a.cli_name] || "";
    return (a, t) => (l(), o("div", E, [
      w(h(O), {
        modelValue: c.value,
        "onUpdate:modelValue": t[0] || (t[0] = (e) => c.value = e),
        onKeydown: b(q(p, ["prevent"]), ["enter"])
      }, {
        default: g(() => [
          w(h(j), {
            variant: "primary",
            small: "",
            "data-search-go": "",
            onClick: p
          }, {
            default: g(() => [...t[1] || (t[1] = [
              B("Search", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue", "onKeydown"]),
      f.value.length ? (l(), o("div", F, [
        (l(!0), o(_, null, y(f.value, (e) => (l(), o("button", {
          key: e,
          type: "button",
          class: W(["search-chip", { on: u.value.has(e) }]),
          "data-model": e,
          onClick: (N) => C(e)
        }, n(e), 11, I))), 128))
      ])) : x("", !0),
      m.value ? (l(), $(h(z), {
        key: 1,
        shape: "rows"
      })) : d.value ? (l(), o("p", L, n(d.value), 1)) : s.value && !s.value.hits.length ? (l(), o("p", M, "No results match all these words: " + n(c.value.trim()), 1)) : s.value ? (l(), o(_, { key: 4 }, [
        v("ul", T, [
          (l(!0), o(_, null, y(s.value.hits, (e) => (l(), o("li", {
            key: `${e.cli_name}:${e.id}`
          }, [
            v("button", {
              type: "button",
              class: "search-hit",
              "data-hit": "",
              disabled: !k(e),
              onClick: (N) => h(r).open(k(e))
            }, [
              v("span", A, n(e.cli_name) + " " + n(e.id), 1),
              v("span", G, n(e.excerpt), 1)
            ], 8, U)
          ]))), 128))
        ]),
        s.value.closest ? (l(), o("p", H, "No result holds all these words: " + n(c.value.trim()) + ", these hold most of them, the closest first", 1)) : (l(), o("p", J, n(s.value.total) + " " + n(s.value.total === 1 ? "result matches" : "results match") + " all these words: " + n(c.value.trim()) + n(s.value.total > s.value.hits.length ? `, the newest ${s.value.hits.length} are shown` : ""), 1))
      ], 64)) : x("", !0)
    ]));
  }
}, Z = /* @__PURE__ */ D(P, [["__scopeId", "data-v-932ed316"]]);
export {
  Z as default
};
