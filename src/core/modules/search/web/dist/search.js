/* @code-commandments-generated */
if (!document.getElementById("window-styles-ffe84e67b20e")) { const style = document.createElement("style"); style.id = "window-styles-ffe84e67b20e"; style.textContent = ".search-mark[data-v-e8f68bd4]{display:flex;flex-direction:column;gap:1px;min-width:260px;max-width:520px;margin:2px 0 2px 12px}.search-child[data-v-e8f68bd4]{display:flex;gap:10px;align-items:baseline;padding:4px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;text-align:left;cursor:pointer}.search-child[data-v-e8f68bd4]:hover:not(:disabled){background:var(--hover);color:var(--text)}.search-child[data-v-e8f68bd4]:disabled{cursor:default}.search-child-name[data-v-e8f68bd4]{flex:none;min-width:64px;color:var(--text-3)}.search-child-excerpt[data-v-e8f68bd4]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.search-more[data-v-e8f68bd4]{align-items:center;color:var(--text-3)}.search-none[data-v-e8f68bd4]{margin:0;padding:4px 8px;color:var(--text-3);font-size:12px}.search[data-v-873eb612]{display:flex;flex-direction:column;gap:14px}.search-form[data-v-873eb612]{display:flex;gap:10px;align-items:center;color:var(--text-3)}.search-input[data-v-873eb612]{flex:1;max-width:520px;padding:7px 12px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text)}.search-chips[data-v-873eb612]{display:flex;flex-wrap:wrap;gap:6px}.search-chip[data-v-873eb612]{padding:2px 10px;border:0;border-radius:10px;background:var(--raised);color:var(--text-2);font-size:12px;cursor:pointer}.search-chip.on[data-v-873eb612]{background:var(--accent);color:#fff}.search-hits[data-v-873eb612]{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}.search-hit[data-v-873eb612]{display:flex;gap:12px;width:100%;padding:8px 10px;border:0;border-radius:7px;background:none;color:var(--text);font:inherit;text-align:left;cursor:pointer}.search-hit[data-v-873eb612]:hover:not(:disabled){background:var(--hover)}.search-hit[data-v-873eb612]:disabled{cursor:default}.search-hit-name[data-v-873eb612]{flex:none;width:110px;color:var(--text-3)}.search-hit-excerpt[data-v-873eb612]{flex:1;min-width:0}.search-note[data-v-873eb612]{margin:0;color:var(--text-3)}\n"; document.head.appendChild(style); }
import { ref as u, computed as $, openBlock as n, createElementBlock as o, createElementVNode as c, withModifiers as C, createVNode as g, unref as h, withDirectives as q, vModelText as N, withCtx as B, createTextVNode as V, Fragment as _, renderList as y, normalizeClass as W, toDisplayString as l, createCommentVNode as S, createBlock as j } from "vue";
import { useWindow as z, Icon as D, Btn as I, Skeleton as O } from "@journal/window-kit";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const F = {
  class: "search",
  "data-window-flush": ""
}, M = {
  key: 0,
  class: "search-chips"
}, T = ["data-model", "onClick"], L = {
  key: 2,
  class: "search-note"
}, U = {
  key: 3,
  class: "search-note",
  "data-no-hits": ""
}, A = { class: "search-hits" }, G = ["disabled", "onClick"], H = { class: "search-hit-name" }, J = { class: "search-hit-excerpt" }, K = {
  class: "search-note",
  "data-total": ""
}, P = {
  __name: "SearchWindow",
  setup(Q) {
    const x = {
      task: "tasks.tasks",
      plan: "plans.plans",
      doc: "documents.documents",
      question: "questions.questions",
      template: "templates.templates",
      sequence: "sequences.sequences",
      trigger: "triggers.triggers",
      check: "checks.checks"
    }, f = z(), i = u(""), r = u(/* @__PURE__ */ new Set()), s = u(null), d = u(""), p = u(!1), k = $(() => {
      var a;
      return [.../* @__PURE__ */ new Set([...(((a = s.value) == null ? void 0 : a.hits) || []).map((t) => t.cli_name), ...r.value])].sort();
    });
    async function v() {
      const a = i.value.trim().split(/\s+/).filter(Boolean);
      if (!a.length) return void (s.value = null);
      p.value = !0;
      const t = r.value.size ? ` --model ${[...r.value].join(",")}` : "", e = await f.read(`search find ${a.map((m) => `"${m}"`).join(" ")}${t}`);
      p.value = !1, d.value = e.ok ? "" : e.error, s.value = e.ok ? e.value : null;
    }
    function b(a) {
      const t = new Set(r.value);
      t.has(a) ? t.delete(a) : t.add(a), r.value = t, v();
    }
    const w = (a) => x[a.cli_name] || "";
    return (a, t) => (n(), o("div", F, [
      c("form", {
        class: "search-form",
        onSubmit: C(v, ["prevent"])
      }, [
        g(h(D), {
          name: "search",
          size: 14
        }),
        q(c("input", {
          "onUpdate:modelValue": t[0] || (t[0] = (e) => i.value = e),
          class: "search-input",
          type: "search",
          placeholder: "Search the journal",
          "aria-label": "Search the journal"
        }, null, 512), [
          [N, i.value]
        ]),
        g(h(I), {
          kind: "primary",
          small: "",
          "data-search-go": "",
          onClick: v
        }, {
          default: B(() => [...t[1] || (t[1] = [
            V("Search", -1)
          ])]),
          _: 1
        })
      ], 32),
      k.value.length ? (n(), o("div", M, [
        (n(!0), o(_, null, y(k.value, (e) => (n(), o("button", {
          key: e,
          type: "button",
          class: W(["search-chip", { on: r.value.has(e) }]),
          "data-model": e,
          onClick: (m) => b(e)
        }, l(e), 11, T))), 128))
      ])) : S("", !0),
      p.value ? (n(), j(h(O), {
        key: 1,
        shape: "rows"
      })) : d.value ? (n(), o("p", L, l(d.value), 1)) : s.value && !s.value.hits.length ? (n(), o("p", U, "Nothing here holds all of: " + l(i.value.trim()), 1)) : s.value ? (n(), o(_, { key: 4 }, [
        c("ul", A, [
          (n(!0), o(_, null, y(s.value.hits, (e) => (n(), o("li", {
            key: `${e.cli_name}:${e.id}`
          }, [
            c("button", {
              type: "button",
              class: "search-hit",
              "data-hit": "",
              disabled: !w(e),
              onClick: (m) => h(f).open(w(e))
            }, [
              c("span", H, l(e.cli_name) + " " + l(e.id), 1),
              c("span", J, l(e.excerpt), 1)
            ], 8, G)
          ]))), 128))
        ]),
        c("p", K, l(s.value.total) + " " + l(s.value.total === 1 ? "row holds" : "rows hold") + " all of: " + l(i.value.trim()) + l(s.value.total > s.value.hits.length ? `, the newest ${s.value.hits.length} are shown` : ""), 1)
      ], 64)) : S("", !0)
    ]));
  }
}, Z = /* @__PURE__ */ E(P, [["__scopeId", "data-v-873eb612"]]);
export {
  Z as default
};
