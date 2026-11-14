if (!document.getElementById("window-styles-0c3a24760463")) { const style = document.createElement("style"); style.id = "window-styles-0c3a24760463"; style.textContent = ".memory[data-v-5dcc6954]{display:flex;flex-direction:column;gap:3px;width:100%;padding:9px 0;border:0;border-bottom:1px solid var(--border-inner);background:none;color:var(--text);font:inherit;text-align:left;cursor:pointer}.memory:hover .memory-weight[data-v-5dcc6954]{display:inline-flex;gap:6px;align-items:center}.steps[data-v-5dcc6954]{display:inline-flex;gap:2px}.steps i[data-v-5dcc6954]{width:4px;height:8px;border-radius:1px;background:var(--border-2)}.steps i.on[data-v-5dcc6954]{background:var(--text-3)}.memory-title[data-v-5dcc6954]{color:var(--accent-text)}.memory[data-v-5dcc6954]:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}.memory.removed .memory-title[data-v-5dcc6954]{color:var(--text-3)}.memory-text[data-v-5dcc6954]{max-width:74ch;color:var(--text-3);font-size:12px}.memory-meta[data-v-5dcc6954]{display:flex;flex-wrap:wrap;gap:2px 12px;color:var(--text-3);font-size:12px}@media(max-width:720px){.memory[data-v-5dcc6954]{min-height:44px}}.agent-memories[data-v-dc10c24b]{display:flex;flex-direction:column;min-width:0}.band[data-v-dc10c24b]{margin:0;padding:8px 14px 4px;color:var(--text-3);font-size:12px}.agent-memories .row[data-v-dc10c24b]{padding:8px 14px}.notice[data-v-dc10c24b]{display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center;margin:12px 14px;padding:8px 11px;border:1px solid var(--border-2);border-radius:7px;color:var(--danger);font-size:12.5px}.memory-facts[data-v-09dd9f4c]{display:flex;flex-direction:column;gap:6px}.memory-none[data-v-09dd9f4c]{margin:0;color:var(--text-2);font-size:12.5px}.memory-words[data-v-09dd9f4c],.memory-add[data-v-09dd9f4c]{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.memory-word-input[data-v-09dd9f4c]{flex:1 1 140px}.memory-word[data-v-09dd9f4c]{display:inline-flex;gap:4px;align-items:center;padding:1px 8px;border:1px solid var(--border);border-radius:10px;font-size:12.5px}.memory-word-off[data-v-09dd9f4c]{padding:0;border:0;background:none;color:var(--text-3);cursor:pointer}.memory-refusal[data-v-09dd9f4c]{margin:0;color:var(--danger);font-size:12.5px}.columns[data-v-0faeaba2]{display:flex;gap:var(--s3);padding:4px 16px;color:var(--text-3);font-size:11px}.columns-memory[data-v-0faeaba2]{flex:1}.more[data-v-0faeaba2]{margin:0;padding:4px 16px;color:var(--text-3);font-size:12px}.task[data-v-0faeaba2]{color:var(--text-3);font-size:12px;font-variant-numeric:tabular-nums}.failure[data-v-0faeaba2]{margin:0;padding:6px var(--inset);color:var(--bad, var(--text-2));font-size:12px}.memory-round[data-v-4910a3d9]{margin:0 0 0 20px}.memory-round-rows[data-v-4910a3d9]{margin:0;padding:0;list-style:none}.memory-round-row[data-v-4910a3d9]{display:flex;flex-wrap:wrap;gap:2px 8px;padding:2px 0;color:var(--text-2);font-size:12px;line-height:1.45;overflow-wrap:anywhere}.memory-round-ref[data-v-4910a3d9]{padding:0;border:0;background:none;color:var(--accent-text);font:inherit;cursor:pointer}.memory-round-weight[data-v-4910a3d9]{color:var(--text-4)}\n"; document.head.appendChild(style); }
import { computed as v, openBlock as w, createBlock as $, unref as o, withCtx as f, createVNode as g, ref as h, createElementVNode as k, toDisplayString as _, createElementBlock as M, Fragment as A, createTextVNode as b, createCommentVNode as x } from "vue";
import { optionsOf as W, wordLabel as O, Reader as V, ActionsMenu as B, AgentBadge as F, useWindow as N, defaultFilter as H, applyFilter as C, ListReaderLayout as L, Skeleton as P, PageHeader as G, FilterBar as j, Btn as q } from "@journal/window-kit";
import { R as D, _ as U, m as z } from "./memoryItems-CinYMz_A.js";
import { M as J } from "./MemoryFacts-CmHt2xZv.js";
import { _ as K } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const R = "Main agent", Q = 10;
function S(t, a) {
  var e;
  return t.agent_id === null ? R : ((e = a.find((m) => m.agent_id === t.agent_id)) == null ? void 0 : e.name) ?? `Agent ${t.agent_id}`;
}
const X = (t, a) => [
  { key: "state", label: "State", options: [["active", "Active"], ["removed", "Removed"]], get: (e) => e.state, default: ["active"] },
  { key: "agent", label: "Agent", options: W(t, (e) => S(e, a)), get: (e) => S(e, a) }
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
    return (m, i) => (w(), $(o(V), {
      title: t.row.text,
      number: String(t.row.id),
      facts: e.value,
      "data-memory-reader": ""
    }, {
      agent: f(() => [
        g(o(F), {
          name: t.owner,
          main: t.owner === o(R)
        }, null, 8, ["name", "main"])
      ]),
      actions: f(() => [
        g(o(B), {
          items: t.items,
          head: `Memory ${t.row.id}`
        }, null, 8, ["items", "head"])
      ]),
      default: f(() => [
        g(J, { row: t.row }, null, 8, ["row"])
      ]),
      _: 1
    }, 8, ["title", "number", "facts"]));
  }
};
function ee(t, a, e, m) {
  const i = N(), u = i.props[t];
  let p = 1;
  async function d() {
    const l = `${t}.`;
    Object.keys(i.state).filter((c) => c.startsWith(l)).forEach((c) => delete i.state[c]), Object.entries(a(e * p)).forEach(([c, E]) => i.state[`${l}${c}`] = String(E)), await i.reload(t);
  }
  const T = () => (p = 1, d()), y = () => (p += 1, d());
  return i.follow(m, d), d(), {
    rows: u.rows,
    total: v(() => {
      var l;
      return ((l = u.data.value) == null ? void 0 : l.total) ?? 0;
    }),
    failure: u.failure,
    loaded: u.loaded,
    load: d,
    reset: T,
    more: y,
    hasMore: v(() => {
      var l;
      return u.rows.value.length < (((l = u.data.value) == null ? void 0 : l.total) ?? 0);
    })
  };
}
const te = {
  key: 0,
  class: "more",
  "data-memories-more": ""
}, ae = {
  key: 1,
  class: "failure",
  role: "alert",
  "data-memories-failure": ""
}, oe = ["title"], re = 460, se = 100, ne = {
  __name: "MemoriesPage",
  setup(t) {
    const a = N(), e = ee("memories", (r) => ({ environment: a.environment, removed: !0, order: "newest", limit: r }), se, ["memory.*"]), m = v(() => {
      var r;
      return ((r = a.props.memories.data.value) == null ? void 0 : r.agents) ?? [];
    }), i = v(() => X(e.rows.value, m.value)), u = h(H(i.value)), p = h(""), d = v(() => C(e.rows.value, i.value, u.value, p.value, ["text", "reason"])), T = v(() => d.value.map((r) => ({ id: r.id, title: r.text, desc: `${S(r, m.value)} · weight ${r.weight}`, row: r, owner: S(r, m.value) }))), y = h(null), l = h(null), c = (r, s = {}) => z(r, { run: a.run, ask: () => l.value = r, ...s }), E = (r) => ({ head: `Memory ${r.id}`, items: c(r.row, {}) }), I = v(() => e.rows.value.length ? "No memory here matches" : "No memories yet");
    return (r, s) => (w(), $(o(L), {
      chosen: y.value,
      "onUpdate:chosen": s[4] || (s[4] = (n) => y.value = n),
      items: T.value,
      "list-width": re,
      place: E,
      "empty-title": I.value,
      "pick-line": "Choose a memory",
      "data-memories": ""
    }, {
      top: f(() => [
        g(o(G), {
          title: "Memories",
          count: o(e).total.value
        }, null, 8, ["count"]),
        g(o(j), {
          modelValue: u.value,
          "onUpdate:modelValue": s[0] || (s[0] = (n) => u.value = n),
          words: p.value,
          "onUpdate:words": s[1] || (s[1] = (n) => p.value = n),
          fields: i.value,
          rows: o(e).rows.value,
          shown: d.value.length,
          placeholder: "Search memories"
        }, null, 8, ["modelValue", "words", "fields", "rows", "shown"]),
        s[6] || (s[6] = k("div", {
          class: "columns",
          "aria-hidden": "true"
        }, [
          k("span", { class: "columns-memory" }, "Memory"),
          k("span", null, "Task")
        ], -1)),
        o(e).hasMore.value ? (w(), M("p", te, [
          b("Showing " + _(o(e).rows.value.length) + " of " + _(o(e).total.value) + " ", 1),
          g(o(q), {
            small: "",
            bordered: "",
            onClick: s[2] || (s[2] = (n) => o(e).more())
          }, {
            default: f(() => [...s[5] || (s[5] = [
              b("Show more", -1)
            ])]),
            _: 1
          })
        ])) : x("", !0),
        o(e).failure.value ? (w(), M("p", ae, _(o(e).failure.value), 1)) : x("", !0),
        l.value ? (w(), $(U, {
          key: 2,
          row: l.value,
          onClose: s[3] || (s[3] = (n) => l.value = null)
        }, null, 8, ["row"])) : x("", !0)
      ]),
      empty: f(() => [
        o(e).loaded.value ? o(e).rows.value.length ? (w(), M(A, { key: 2 }, [
          b("Try other words or filters.")
        ], 64)) : (w(), M(A, { key: 1 }, [
          b("Memories you or the agent save appear here.")
        ], 64)) : (w(), $(o(P), {
          key: 0,
          shape: "rows"
        }))
      ]),
      meta: f(({ item: n }) => [
        k("span", {
          class: "task",
          title: n.row.task_id ? `Task ${n.row.task_id}` : "",
          "data-memory-task": ""
        }, _(n.row.task_id ?? ""), 9, oe)
      ]),
      reader: f(({ item: n }) => [
        g(Z, {
          row: n.row,
          owner: n.owner,
          items: c(n.row, { weights: o(D), openLabel: "Open in inspector" })
        }, null, 8, ["row", "owner", "items"])
      ]),
      _: 1
    }, 8, ["chosen", "items", "empty-title"]));
  }
}, ce = /* @__PURE__ */ K(ne, [["__scopeId", "data-v-0faeaba2"]]);
export {
  ce as default
};
