/* @code-commandments-generated */
if (!document.getElementById("window-styles-d3113a87cabc")) { const style = document.createElement("style"); style.id = "window-styles-d3113a87cabc"; style.textContent = ".search-mark[data-v-65b45c0e]{display:flex;flex-direction:column;gap:1px;min-width:260px;max-width:520px;margin:2px 0 2px 12px}.search-child[data-v-65b45c0e]{display:flex;gap:10px;align-items:baseline;padding:4px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;text-align:left;cursor:pointer}.search-child[data-v-65b45c0e]:hover:not(:disabled){background:var(--hover);color:var(--text)}.search-child[data-v-65b45c0e]:disabled{cursor:default}.search-child-name[data-v-65b45c0e]{flex:none;min-width:64px;color:var(--text-3)}.search-child-excerpt[data-v-65b45c0e]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.search-more[data-v-65b45c0e]{align-items:center;color:var(--text-3)}.search-none[data-v-65b45c0e]{margin:0;padding:4px 8px;color:var(--text-3);font-size:12px}.search[data-v-b30e3bee]{display:flex;flex-direction:column;gap:14px}.search-chips[data-v-b30e3bee]{display:flex;flex-wrap:wrap;gap:6px}.search-chip[data-v-b30e3bee]{padding:2px 10px;border:0;border-radius:10px;background:var(--raised);color:var(--text-2);font-size:12px;cursor:pointer}.search-chip.on[data-v-b30e3bee]{background:var(--accent);color:#fff}.search-hits[data-v-b30e3bee]{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}.search-hit[data-v-b30e3bee]{display:flex;gap:12px;width:100%;padding:8px 10px;border:0;border-radius:7px;background:none;color:var(--text);font:inherit;text-align:left;cursor:pointer}.search-hit[data-v-b30e3bee]:hover:not(:disabled){background:var(--hover)}.search-hit[data-v-b30e3bee]:disabled{cursor:default}.search-hit-name[data-v-b30e3bee]{flex:none;width:110px;color:var(--text-3)}.search-hit-excerpt[data-v-b30e3bee]{flex:1;min-width:0}.search-note[data-v-b30e3bee]{margin:0;color:var(--text-3)}\n"; document.head.appendChild(style); }
import { ref as i, computed as C, openBlock as n, createElementBlock as l, createVNode as g, unref as d, withKeys as V, withModifiers as q, withCtx as y, createTextVNode as B, Fragment as m, renderList as x, normalizeClass as N, toDisplayString as o, createCommentVNode as S, createBlock as W, createElementVNode as u } from "vue";
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
    }, k = K(), r = i(""), c = i(/* @__PURE__ */ new Set()), s = i(null), h = i(""), v = i(!1), f = C(() => {
      var a;
      return [.../* @__PURE__ */ new Set([...(((a = s.value) == null ? void 0 : a.hits) || []).map((t) => t.cli_name), ...c.value])].sort();
    });
    async function p() {
      const a = r.value.trim().split(/\s+/).filter(Boolean);
      if (!a.length) return void (s.value = null);
      v.value = !0;
      const t = c.value.size ? ` --model ${[...c.value].join(",")}` : "", e = await k.read(`search find ${a.map((_) => `"${_}"`).join(" ")}${t}`);
      v.value = !1, h.value = e.ok ? "" : e.error, s.value = e.ok ? e.value : null;
    }
    function b(a) {
      const t = new Set(c.value);
      t.has(a) ? t.delete(a) : t.add(a), c.value = t, p();
    }
    const w = (a) => $[a.cli_name] || "";
    return (a, t) => (n(), l("div", E, [
      g(d(O), {
        modelValue: r.value,
        "onUpdate:modelValue": t[0] || (t[0] = (e) => r.value = e),
        onKeydown: V(q(p, ["prevent"]), ["enter"])
      }, {
        default: y(() => [
          g(d(j), {
            kind: "primary",
            small: "",
            "data-search-go": "",
            onClick: p
          }, {
            default: y(() => [...t[1] || (t[1] = [
              B("Search", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue", "onKeydown"]),
      f.value.length ? (n(), l("div", F, [
        (n(!0), l(m, null, x(f.value, (e) => (n(), l("button", {
          key: e,
          type: "button",
          class: N(["search-chip", { on: c.value.has(e) }]),
          "data-model": e,
          onClick: (_) => b(e)
        }, o(e), 11, I))), 128))
      ])) : S("", !0),
      v.value ? (n(), W(d(z), {
        key: 1,
        shape: "rows"
      })) : h.value ? (n(), l("p", L, o(h.value), 1)) : s.value && !s.value.hits.length ? (n(), l("p", M, "Nothing here holds all of: " + o(r.value.trim()), 1)) : s.value ? (n(), l(m, { key: 4 }, [
        u("ul", T, [
          (n(!0), l(m, null, x(s.value.hits, (e) => (n(), l("li", {
            key: `${e.cli_name}:${e.id}`
          }, [
            u("button", {
              type: "button",
              class: "search-hit",
              "data-hit": "",
              disabled: !w(e),
              onClick: (_) => d(k).open(w(e))
            }, [
              u("span", A, o(e.cli_name) + " " + o(e.id), 1),
              u("span", G, o(e.excerpt), 1)
            ], 8, U)
          ]))), 128))
        ]),
        u("p", H, o(s.value.total) + " " + o(s.value.total === 1 ? "row holds" : "rows hold") + " all of: " + o(r.value.trim()) + o(s.value.total > s.value.hits.length ? `, the newest ${s.value.hits.length} are shown` : ""), 1)
      ], 64)) : S("", !0)
    ]));
  }
}, Y = /* @__PURE__ */ D(J, [["__scopeId", "data-v-b30e3bee"]]);
export {
  Y as default
};
