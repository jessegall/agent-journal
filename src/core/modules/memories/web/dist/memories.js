if (!document.getElementById("window-styles-578b9bd60f5e")) { const style = document.createElement("style"); style.id = "window-styles-578b9bd60f5e"; style.textContent = ".memory[data-v-f43e8f70]{display:flex;flex-direction:column;gap:3px;width:100%;padding:9px 0;border:0;border-bottom:1px solid var(--border-inner);background:none;color:var(--text);font:inherit;text-align:left;cursor:pointer}.memory:hover .memory-weight[data-v-f43e8f70]{display:inline-flex;gap:6px;align-items:center}.steps[data-v-f43e8f70]{display:inline-flex;gap:2px}.steps i[data-v-f43e8f70]{width:4px;height:8px;border-radius:1px;background:var(--border-2)}.steps i.on[data-v-f43e8f70]{background:var(--text-3)}.memory-title[data-v-f43e8f70]{color:var(--accent-text)}.memory[data-v-f43e8f70]:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}.memory.removed .memory-title[data-v-f43e8f70]{color:var(--text-3)}.memory-text[data-v-f43e8f70]{max-width:74ch;color:var(--text-3);font-size:12px}.memory-meta[data-v-f43e8f70]{display:flex;flex-wrap:wrap;gap:2px 12px;color:var(--text-3);font-size:12px}@media(max-width:720px){.memory[data-v-f43e8f70]{min-height:44px}}.agent-memories[data-v-dc10c24b]{display:flex;flex-direction:column;min-width:0}.band[data-v-dc10c24b]{margin:0;padding:8px 14px 4px;color:var(--text-3);font-size:12px}.agent-memories .row[data-v-dc10c24b]{padding:8px 14px}.notice[data-v-dc10c24b]{display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center;margin:12px 14px;padding:8px 11px;border:1px solid var(--border-2);border-radius:7px;color:var(--danger);font-size:12.5px}.memory-facts[data-v-09dd9f4c]{display:flex;flex-direction:column;gap:6px}.memory-none[data-v-09dd9f4c]{margin:0;color:var(--text-2);font-size:12.5px}.memory-words[data-v-09dd9f4c],.memory-add[data-v-09dd9f4c]{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.memory-word-input[data-v-09dd9f4c]{flex:1 1 140px}.memory-word[data-v-09dd9f4c]{display:inline-flex;gap:4px;align-items:center;padding:1px 8px;border:1px solid var(--border);border-radius:10px;font-size:12.5px}.memory-word-off[data-v-09dd9f4c]{padding:0;border:0;background:none;color:var(--text-3);cursor:pointer}.memory-refusal[data-v-09dd9f4c]{margin:0;color:var(--danger);font-size:12.5px}.task[data-v-d2a32902]{color:var(--text-3);font-size:12px;font-variant-numeric:tabular-nums}.failure[data-v-d2a32902]{margin:0;padding:6px var(--inset);color:var(--bad, var(--text-2));font-size:12px}.memory-round[data-v-4910a3d9]{margin:0 0 0 20px}.memory-round-rows[data-v-4910a3d9]{margin:0;padding:0;list-style:none}.memory-round-row[data-v-4910a3d9]{display:flex;flex-wrap:wrap;gap:2px 8px;padding:2px 0;color:var(--text-2);font-size:12px;line-height:1.45;overflow-wrap:anywhere}.memory-round-ref[data-v-4910a3d9]{padding:0;border:0;background:none;color:var(--accent-text);font:inherit;cursor:pointer}.memory-round-weight[data-v-4910a3d9]{color:var(--text-4)}\n"; document.head.appendChild(style); }
import { computed as v, openBlock as w, createBlock as g, unref as o, withCtx as f, createVNode as k, ref as h, createElementVNode as W, toDisplayString as _, createElementBlock as S, Fragment as E, createTextVNode as T, createCommentVNode as N } from "vue";
import { optionsOf as x, wordLabel as O, Reader as V, ActionsMenu as B, AgentBadge as F, useWindow as A, defaultFilter as H, applyFilter as C, ListReaderLayout as L, Skeleton as P, PageHeader as G, FilterBar as j, MoreButton as q } from "@journal/window-kit";
import { R as D, _ as U, m as z } from "./MemoryRow-CinYMz_A.js";
import { M as J } from "./MemoryFacts-CmHt2xZv.js";
import { _ as K } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const R = "Main agent", Q = 10;
function $(t, a) {
  var e;
  return t.agent_id === null ? R : ((e = a.find((m) => m.agent_id === t.agent_id)) == null ? void 0 : e.name) ?? `Agent ${t.agent_id}`;
}
const X = (t, a) => [
  { key: "state", label: "State", options: [["active", "Active"], ["removed", "Removed"]], get: (e) => e.state, default: ["active"] },
  { key: "agent", label: "Agent", options: x(t, (e) => $(e, a)), get: (e) => $(e, a) },
  { key: "task", label: "Task", options: x(t, (e) => e.task_id ? `Task ${e.task_id}` : "No task"), get: (e) => e.task_id ? `Task ${e.task_id}` : "No task" }
], Y = (t) => O(t.state), Z = {
  __name: "MemoryReader",
  props: { row: { type: Object, required: !0 }, owner: { type: String, required: !0 }, items: { type: Array, required: !0 } },
  setup(t) {
    const a = t, e = v(() => [
      { name: "state", label: "State", value: Y(a.row) },
      { name: "weight", label: "Weight", value: `${a.row.weight} of ${Q}` },
      { name: "task", label: "Task", value: a.row.task_id ? String(a.row.task_id) : "None", ...a.row.task_id ? { link: `tasks:${a.row.task_id}` } : {} },
      ...a.row.reason ? [{ name: "reason", label: "Reason", value: a.row.reason }] : [],
      { name: "made", label: "Made", value: a.row.created_at, isTime: !0 }
    ]);
    return (m, i) => (w(), g(o(V), {
      title: t.row.text,
      number: String(t.row.id),
      facts: e.value,
      "data-memory-reader": ""
    }, {
      agent: f(() => [
        k(o(F), {
          name: t.owner,
          main: t.owner === o(R)
        }, null, 8, ["name", "main"])
      ]),
      actions: f(() => [
        k(o(B), {
          items: t.items,
          head: `Memory ${t.row.id}`
        }, null, 8, ["items", "head"])
      ]),
      default: f(() => [
        k(J, { row: t.row }, null, 8, ["row"])
      ]),
      _: 1
    }, 8, ["title", "number", "facts"]));
  }
};
function ee(t, a, e, m) {
  const i = A(), u = i.props[t];
  let p = 1;
  async function d() {
    const n = `${t}.`;
    Object.keys(i.state).filter((c) => c.startsWith(n)).forEach((c) => delete i.state[c]), Object.entries(a(e * p)).forEach(([c, b]) => i.state[`${n}${c}`] = String(b)), await i.reload(t);
  }
  const M = () => (p = 1, d()), y = () => (p += 1, d());
  return i.follow(m, d), d(), {
    rows: u.rows,
    total: v(() => {
      var n;
      return ((n = u.data.value) == null ? void 0 : n.total) ?? 0;
    }),
    failure: u.failure,
    loaded: u.loaded,
    load: d,
    reset: M,
    more: y,
    hasMore: v(() => {
      var n;
      return u.rows.value.length < (((n = u.data.value) == null ? void 0 : n.total) ?? 0);
    })
  };
}
const te = {
  key: 1,
  class: "failure",
  role: "alert",
  "data-memories-failure": ""
}, ae = ["title"], oe = 460, re = 100, se = {
  __name: "MemoriesPage",
  setup(t) {
    const a = A(), e = ee("memories", (r) => ({ environment: a.environment, removed: !0, order: "newest", limit: r }), re, ["memory.*"]), m = v(() => {
      var r;
      return ((r = a.props.memories.data.value) == null ? void 0 : r.agents) ?? [];
    }), i = v(() => X(e.rows.value, m.value)), u = h(H(i.value)), p = h(""), d = v(() => C(e.rows.value, i.value, u.value, p.value, ["text", "reason"])), M = v(() => d.value.map((r) => ({ id: r.id, title: r.text, desc: `${$(r, m.value)} · weight ${r.weight}`, row: r, owner: $(r, m.value) }))), y = h(null), n = h(null), c = (r, l = {}) => z(r, { run: a.run, ask: () => n.value = r, ...l }), b = (r) => ({ head: `Memory ${r.id}`, items: c(r.row, {}) }), I = v(() => e.rows.value.length ? "No memory here matches" : "No memories yet");
    return (r, l) => (w(), g(o(L), {
      chosen: y.value,
      "onUpdate:chosen": l[4] || (l[4] = (s) => y.value = s),
      items: M.value,
      "list-width": oe,
      place: b,
      "empty-title": I.value,
      "pick-line": "Choose a memory",
      "open-first": "",
      "data-memories": ""
    }, {
      top: f(() => [
        k(o(G), {
          title: "Memories",
          count: o(e).total.value
        }, null, 8, ["count"]),
        k(o(j), {
          modelValue: u.value,
          "onUpdate:modelValue": l[0] || (l[0] = (s) => u.value = s),
          words: p.value,
          "onUpdate:words": l[1] || (l[1] = (s) => p.value = s),
          fields: i.value,
          rows: o(e).rows.value,
          shown: d.value.length,
          placeholder: "Search memories"
        }, null, 8, ["modelValue", "words", "fields", "rows", "shown"]),
        o(e).hasMore.value ? (w(), g(o(q), {
          key: 0,
          "data-memories-more": "",
          onClick: l[2] || (l[2] = (s) => o(e).more())
        }, {
          default: f(() => [
            T("Show more (" + _(o(e).rows.value.length) + " of " + _(o(e).total.value) + " shown)", 1)
          ]),
          _: 1
        })) : N("", !0),
        o(e).failure.value ? (w(), S("p", te, _(o(e).failure.value), 1)) : N("", !0),
        n.value ? (w(), g(U, {
          key: 2,
          row: n.value,
          onClose: l[3] || (l[3] = (s) => n.value = null)
        }, null, 8, ["row"])) : N("", !0)
      ]),
      empty: f(() => [
        o(e).loaded.value ? o(e).rows.value.length ? (w(), S(E, { key: 2 }, [
          T("Try other words or filters.")
        ], 64)) : (w(), S(E, { key: 1 }, [
          T("Memories you or the agent save appear here.")
        ], 64)) : (w(), g(o(P), {
          key: 0,
          shape: "rows"
        }))
      ]),
      meta: f(({ item: s }) => [
        W("span", {
          class: "task",
          title: s.row.task_id ? `Task ${s.row.task_id}` : "",
          "data-memory-task": ""
        }, _(s.row.task_id ?? ""), 9, ae)
      ]),
      reader: f(({ item: s }) => [
        k(Z, {
          row: s.row,
          owner: s.owner,
          items: c(s.row, { weights: o(D), openLabel: "Open in inspector" })
        }, null, 8, ["row", "owner", "items"])
      ]),
      _: 1
    }, 8, ["chosen", "items", "empty-title"]));
  }
}, de = /* @__PURE__ */ K(se, [["__scopeId", "data-v-d2a32902"]]);
export {
  de as default
};
