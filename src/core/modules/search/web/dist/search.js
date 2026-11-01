/* @code-commandments-generated */
if (!document.getElementById("window-styles-4b44b652ba56")) { const style = document.createElement("style"); style.id = "window-styles-4b44b652ba56"; style.textContent = ".search[data-v-538ce439]{display:flex;flex-direction:column;gap:14px}.search-form[data-v-538ce439]{display:flex;gap:10px;align-items:center;color:var(--text-3)}.search-input[data-v-538ce439]{flex:1;max-width:520px;padding:7px 12px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text)}.search-chips[data-v-538ce439]{display:flex;flex-wrap:wrap;gap:6px}.search-chip[data-v-538ce439]{padding:2px 10px;border:0;border-radius:10px;background:var(--raised);color:var(--text-2);font-size:12px;cursor:pointer}.search-chip.on[data-v-538ce439]{background:var(--accent);color:#fff}.search-hits[data-v-538ce439]{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}.search-hit[data-v-538ce439]{display:flex;gap:12px;width:100%;padding:8px 10px;border:0;border-radius:7px;background:none;color:var(--text);font:inherit;text-align:left;cursor:pointer}.search-hit[data-v-538ce439]:hover:not(:disabled){background:var(--hover)}.search-hit[data-v-538ce439]:disabled{cursor:default}.search-hit-name[data-v-538ce439]{flex:none;width:110px;color:var(--text-3)}.search-hit-passage[data-v-538ce439]{flex:1;min-width:0}.search-note[data-v-538ce439]{margin:0;color:var(--text-3)}\n"; document.head.appendChild(style); }
import { ref as d, computed as C, openBlock as n, createElementBlock as l, createElementVNode as i, withModifiers as q, createVNode as S, unref as h, withDirectives as N, vModelText as B, withCtx as V, createTextVNode as W, Fragment as g, renderList as $, normalizeClass as O, toDisplayString as o, createCommentVNode as b, createBlock as z } from "vue";
import { useWindow as D, Icon as I, Btn as j, Skeleton as E } from "@journal/window-kit";
const F = (v, p) => {
  const u = v.__vccOpts || v;
  for (const [r, c] of p)
    u[r] = c;
  return u;
}, M = { class: "search" }, T = {
  key: 0,
  class: "search-chips"
}, L = ["data-model", "onClick"], U = {
  key: 2,
  class: "search-note"
}, A = {
  key: 3,
  class: "search-note",
  "data-no-hits": ""
}, G = { class: "search-hits" }, H = ["disabled", "onClick"], J = { class: "search-hit-name" }, K = { class: "search-hit-passage" }, P = {
  class: "search-note",
  "data-total": ""
}, Q = {
  __name: "SearchWindow",
  setup(v) {
    const p = {
      task: "tasks.tasks",
      plan: "plans.plans",
      doc: "documents.documents",
      question: "questions.questions",
      template: "templates.templates",
      sequence: "sequences.sequences",
      trigger: "triggers.triggers",
      check: "checks.checks"
    }, u = D(), r = d(""), c = d(/* @__PURE__ */ new Set()), s = d(null), _ = d(""), m = d(!1), w = C(() => {
      var a;
      return [.../* @__PURE__ */ new Set([...(((a = s.value) == null ? void 0 : a.hits) || []).map((t) => t.cli_name), ...c.value])].sort();
    });
    async function k() {
      const a = r.value.trim().split(/\s+/).filter(Boolean);
      if (!a.length) return void (s.value = null);
      m.value = !0;
      const t = c.value.size ? ` --model ${[...c.value].join(",")}` : "", e = await u.read(`search find ${a.map((f) => `"${f}"`).join(" ")}${t}`);
      m.value = !1, _.value = e.ok ? "" : e.error, s.value = e.ok ? e.value : null;
    }
    function x(a) {
      const t = new Set(c.value);
      t.has(a) ? t.delete(a) : t.add(a), c.value = t, k();
    }
    const y = (a) => p[a.cli_name] || "";
    return (a, t) => (n(), l("div", M, [
      i("form", {
        class: "search-form",
        onSubmit: q(k, ["prevent"])
      }, [
        S(h(I), {
          name: "search",
          size: 14
        }),
        N(i("input", {
          "onUpdate:modelValue": t[0] || (t[0] = (e) => r.value = e),
          class: "search-input",
          type: "search",
          placeholder: "Search every row",
          "aria-label": "Search every row"
        }, null, 512), [
          [B, r.value]
        ]),
        S(h(j), {
          kind: "primary",
          small: "",
          "data-search-go": "",
          onClick: k
        }, {
          default: V(() => [...t[1] || (t[1] = [
            W("Search", -1)
          ])]),
          _: 1
        })
      ], 32),
      w.value.length ? (n(), l("div", T, [
        (n(!0), l(g, null, $(w.value, (e) => (n(), l("button", {
          key: e,
          type: "button",
          class: O(["search-chip", { on: c.value.has(e) }]),
          "data-model": e,
          onClick: (f) => x(e)
        }, o(e), 11, L))), 128))
      ])) : b("", !0),
      m.value ? (n(), z(h(E), {
        key: 1,
        shape: "rows"
      })) : _.value ? (n(), l("p", U, o(_.value), 1)) : s.value && !s.value.hits.length ? (n(), l("p", A, "Nothing here holds all of: " + o(r.value.trim()), 1)) : s.value ? (n(), l(g, { key: 4 }, [
        i("ul", G, [
          (n(!0), l(g, null, $(s.value.hits, (e) => (n(), l("li", {
            key: `${e.cli_name}:${e.id}`
          }, [
            i("button", {
              type: "button",
              class: "search-hit",
              "data-hit": "",
              disabled: !y(e),
              onClick: (f) => h(u).open(y(e))
            }, [
              i("span", J, o(e.cli_name) + " " + o(e.id), 1),
              i("span", K, o(e.passage), 1)
            ], 8, H)
          ]))), 128))
        ]),
        i("p", P, o(s.value.total) + " " + o(s.value.total === 1 ? "row holds" : "rows hold") + " all of: " + o(r.value.trim()) + o(s.value.total > s.value.hits.length ? `, the newest ${s.value.hits.length} are shown` : ""), 1)
      ], 64)) : b("", !0)
    ]));
  }
}, Y = /* @__PURE__ */ F(Q, [["__scopeId", "data-v-538ce439"]]);
export {
  Y as default
};
