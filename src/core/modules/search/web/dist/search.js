/* @code-commandments-generated */
if (!document.getElementById("window-styles-c46a57cf463b")) { const style = document.createElement("style"); style.id = "window-styles-c46a57cf463b"; style.textContent = ".search-mark[data-v-7bd5473b]{display:flex;flex-direction:column;gap:1px;min-width:260px;max-width:520px;margin:2px 0 2px 12px}.search-child[data-v-7bd5473b]{display:flex;gap:10px;align-items:baseline;padding:4px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;text-align:left;cursor:pointer}.search-child[data-v-7bd5473b]:hover:not(:disabled){background:var(--hover);color:var(--text)}.search-child[data-v-7bd5473b]:disabled{cursor:default}.search-child-name[data-v-7bd5473b]{flex:none;min-width:64px;color:var(--text-3)}.search-child-excerpt[data-v-7bd5473b]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.search-more[data-v-7bd5473b]{align-items:center;color:var(--text-3)}.search-none[data-v-7bd5473b]{margin:0;padding:4px 8px;color:var(--text-3);font-size:12px}.search[data-v-2ed05814]{display:flex;flex-direction:column;gap:14px}.search-chips[data-v-2ed05814]{display:flex;flex-wrap:wrap;gap:6px}.search-chip[data-v-2ed05814]{padding:2px 10px;border:0;border-radius:10px;background:var(--raised);color:var(--text-2);font-size:12px;cursor:pointer}.search-chip.on[data-v-2ed05814]{background:var(--accent);color:#fff}.search-hits[data-v-2ed05814]{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}.search-hit[data-v-2ed05814]{display:flex;gap:12px;width:100%;padding:8px 10px;border:0;border-radius:7px;background:none;color:var(--text);font:inherit;text-align:left;cursor:pointer}.search-hit[data-v-2ed05814]:hover:not(:disabled){background:var(--hover)}.search-hit[data-v-2ed05814]:disabled{cursor:default}.search-hit-name[data-v-2ed05814]{flex:none;width:110px;color:var(--text-3)}.search-hit-excerpt[data-v-2ed05814]{flex:1;min-width:0}.search-note[data-v-2ed05814]{margin:0;color:var(--text-3)}\n"; document.head.appendChild(style); }
import { ref as i, computed as V, openBlock as n, createElementBlock as o, createVNode as g, unref as d, withKeys as b, withModifiers as q, withCtx as y, createTextVNode as B, Fragment as _, renderList as x, normalizeClass as N, toDisplayString as l, createCommentVNode as S, createBlock as W, createElementVNode as u } from "vue";
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
  class: "search-note",
  "data-total": ""
}, J = {
  __name: "SearchWindow",
  setup(P) {
    const $ = {
      task: "tasks.tasks",
      plan: "plans.plans",
      doc: "documents.documents",
      question: "questions.questions",
      template: "templates.templates",
      sequence: "sequences.sequences",
      trigger: "triggers.triggers",
      check: "checks.checks"
    }, k = K(), r = i(""), c = i(/* @__PURE__ */ new Set()), s = i(null), h = i(""), v = i(!1), f = V(() => {
      var a;
      return [.../* @__PURE__ */ new Set([...(((a = s.value) == null ? void 0 : a.hits) || []).map((t) => t.cli_name), ...c.value])].sort();
    });
    async function m() {
      const a = r.value.trim().split(/\s+/).filter(Boolean);
      if (!a.length) return void (s.value = null);
      v.value = !0;
      const t = c.value.size ? ` --model ${[...c.value].join(",")}` : "", e = await k.read(`search find ${a.map((p) => `"${p}"`).join(" ")}${t}`);
      v.value = !1, h.value = e.ok ? "" : e.error, s.value = e.ok ? e.value : null;
    }
    function C(a) {
      const t = new Set(c.value);
      t.has(a) ? t.delete(a) : t.add(a), c.value = t, m();
    }
    const w = (a) => $[a.cli_name] || "";
    return (a, t) => (n(), o("div", E, [
      g(d(O), {
        modelValue: r.value,
        "onUpdate:modelValue": t[0] || (t[0] = (e) => r.value = e),
        onKeydown: b(q(m, ["prevent"]), ["enter"])
      }, {
        default: y(() => [
          g(d(j), {
            variant: "primary",
            small: "",
            "data-search-go": "",
            onClick: m
          }, {
            default: y(() => [...t[1] || (t[1] = [
              B("Search", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue", "onKeydown"]),
      f.value.length ? (n(), o("div", F, [
        (n(!0), o(_, null, x(f.value, (e) => (n(), o("button", {
          key: e,
          type: "button",
          class: N(["search-chip", { on: c.value.has(e) }]),
          "data-model": e,
          onClick: (p) => C(e)
        }, l(e), 11, I))), 128))
      ])) : S("", !0),
      v.value ? (n(), W(d(z), {
        key: 1,
        shape: "rows"
      })) : h.value ? (n(), o("p", L, l(h.value), 1)) : s.value && !s.value.hits.length ? (n(), o("p", M, "No results match all these words: " + l(r.value.trim()), 1)) : s.value ? (n(), o(_, { key: 4 }, [
        u("ul", T, [
          (n(!0), o(_, null, x(s.value.hits, (e) => (n(), o("li", {
            key: `${e.cli_name}:${e.id}`
          }, [
            u("button", {
              type: "button",
              class: "search-hit",
              "data-hit": "",
              disabled: !w(e),
              onClick: (p) => d(k).open(w(e))
            }, [
              u("span", A, l(e.cli_name) + " " + l(e.id), 1),
              u("span", G, l(e.excerpt), 1)
            ], 8, U)
          ]))), 128))
        ]),
        u("p", H, l(s.value.total) + " " + l(s.value.total === 1 ? "result matches" : "results match") + " all these words: " + l(r.value.trim()) + l(s.value.total > s.value.hits.length ? `, the newest ${s.value.hits.length} are shown` : ""), 1)
      ], 64)) : S("", !0)
    ]));
  }
}, Y = /* @__PURE__ */ D(J, [["__scopeId", "data-v-2ed05814"]]);
export {
  Y as default
};
