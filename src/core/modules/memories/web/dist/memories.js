if (!document.getElementById("window-styles-89d8180fec29")) { const style = document.createElement("style"); style.id = "window-styles-89d8180fec29"; style.textContent = ".memory[data-v-f43e8f70]{display:flex;flex-direction:column;gap:3px;width:100%;padding:9px 0;border:0;border-bottom:1px solid var(--border-inner);background:none;color:var(--text);font:inherit;text-align:left;cursor:pointer}.memory:hover .memory-weight[data-v-f43e8f70]{display:inline-flex;gap:6px;align-items:center}.steps[data-v-f43e8f70]{display:inline-flex;gap:2px}.steps i[data-v-f43e8f70]{width:4px;height:8px;border-radius:1px;background:var(--border-2)}.steps i.on[data-v-f43e8f70]{background:var(--text-3)}.memory-title[data-v-f43e8f70]{color:var(--accent-text)}.memory[data-v-f43e8f70]:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}.memory.removed .memory-title[data-v-f43e8f70]{color:var(--text-3)}.memory-text[data-v-f43e8f70]{max-width:74ch;color:var(--text-3);font-size:12px}.memory-meta[data-v-f43e8f70]{display:flex;flex-wrap:wrap;gap:2px 12px;color:var(--text-3);font-size:12px}@media(max-width:720px){.memory[data-v-f43e8f70]{min-height:44px}}.agent-memories[data-v-dc10c24b]{display:flex;flex-direction:column;min-width:0}.band[data-v-dc10c24b]{margin:0;padding:8px 14px 4px;color:var(--text-3);font-size:12px}.agent-memories .row[data-v-dc10c24b]{padding:8px 14px}.notice[data-v-dc10c24b]{display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center;margin:12px 14px;padding:8px 11px;border:1px solid var(--border-2);border-radius:7px;color:var(--danger);font-size:12.5px}.memory-facts[data-v-09dd9f4c]{display:flex;flex-direction:column;gap:6px}.memory-none[data-v-09dd9f4c]{margin:0;color:var(--text-2);font-size:12.5px}.memory-words[data-v-09dd9f4c],.memory-add[data-v-09dd9f4c]{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.memory-word-input[data-v-09dd9f4c]{flex:1 1 140px}.memory-word[data-v-09dd9f4c]{display:inline-flex;gap:4px;align-items:center;padding:1px 8px;border:1px solid var(--border);border-radius:10px;font-size:12.5px}.memory-word-off[data-v-09dd9f4c]{padding:0;border:0;background:none;color:var(--text-3);cursor:pointer}.memory-refusal[data-v-09dd9f4c]{margin:0;color:var(--danger);font-size:12.5px}.more[data-v-f3b29426]{margin:0;padding:4px 16px;color:var(--text-3);font-size:12px}.task[data-v-f3b29426]{color:var(--text-3);font-size:12px;font-variant-numeric:tabular-nums}.failure[data-v-f3b29426]{margin:0;padding:6px var(--inset);color:var(--bad, var(--text-2));font-size:12px}.memory-round[data-v-4910a3d9]{margin:0 0 0 20px}.memory-round-rows[data-v-4910a3d9]{margin:0;padding:0;list-style:none}.memory-round-row[data-v-4910a3d9]{display:flex;flex-wrap:wrap;gap:2px 8px;padding:2px 0;color:var(--text-2);font-size:12px;line-height:1.45;overflow-wrap:anywhere}.memory-round-ref[data-v-4910a3d9]{padding:0;border:0;background:none;color:var(--accent-text);font:inherit;cursor:pointer}.memory-round-weight[data-v-4910a3d9]{color:var(--text-4)}\n"; document.head.appendChild(style); }
import { computed as v, openBlock as w, createBlock as b, unref as o, withCtx as f, createVNode as k, ref as y, createElementVNode as W, toDisplayString as h, createElementBlock as _, Fragment as E, createTextVNode as $, createCommentVNode as N } from "vue";
import { optionsOf as x, wordLabel as O, Reader as V, ActionsMenu as B, AgentBadge as F, useWindow as A, defaultFilter as H, applyFilter as C, ListReaderLayout as L, Skeleton as P, PageHeader as G, FilterBar as j, Btn as q } from "@journal/window-kit";
import { R as D, _ as U, m as z } from "./MemoryRow-CinYMz_A.js";
import { M as J } from "./MemoryFacts-CmHt2xZv.js";
import { _ as K } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const R = "Main agent", Q = 10;
function M(t, a) {
  var e;
  return t.agent_id === null ? R : ((e = a.find((m) => m.agent_id === t.agent_id)) == null ? void 0 : e.name) ?? `Agent ${t.agent_id}`;
}
const X = (t, a) => [
  { key: "state", label: "State", options: [["active", "Active"], ["removed", "Removed"]], get: (e) => e.state, default: ["active"] },
  { key: "agent", label: "Agent", options: x(t, (e) => M(e, a)), get: (e) => M(e, a) },
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
    return (m, i) => (w(), b(o(V), {
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
    const l = `${t}.`;
    Object.keys(i.state).filter((c) => c.startsWith(l)).forEach((c) => delete i.state[c]), Object.entries(a(e * p)).forEach(([c, T]) => i.state[`${l}${c}`] = String(T)), await i.reload(t);
  }
  const S = () => (p = 1, d()), g = () => (p += 1, d());
  return i.follow(m, d), d(), {
    rows: u.rows,
    total: v(() => {
      var l;
      return ((l = u.data.value) == null ? void 0 : l.total) ?? 0;
    }),
    failure: u.failure,
    loaded: u.loaded,
    load: d,
    reset: S,
    more: g,
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
    const a = A(), e = ee("memories", (r) => ({ environment: a.environment, removed: !0, order: "newest", limit: r }), se, ["memory.*"]), m = v(() => {
      var r;
      return ((r = a.props.memories.data.value) == null ? void 0 : r.agents) ?? [];
    }), i = v(() => X(e.rows.value, m.value)), u = y(H(i.value)), p = y(""), d = v(() => C(e.rows.value, i.value, u.value, p.value, ["text", "reason"])), S = v(() => d.value.map((r) => ({ id: r.id, title: r.text, desc: `${M(r, m.value)} · weight ${r.weight}`, row: r, owner: M(r, m.value) }))), g = y(null), l = y(null), c = (r, n = {}) => z(r, { run: a.run, ask: () => l.value = r, ...n }), T = (r) => ({ head: `Memory ${r.id}`, items: c(r.row, {}) }), I = v(() => e.rows.value.length ? "No memory here matches" : "No memories yet");
    return (r, n) => (w(), b(o(L), {
      chosen: g.value,
      "onUpdate:chosen": n[4] || (n[4] = (s) => g.value = s),
      items: S.value,
      "list-width": re,
      place: T,
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
          "onUpdate:modelValue": n[0] || (n[0] = (s) => u.value = s),
          words: p.value,
          "onUpdate:words": n[1] || (n[1] = (s) => p.value = s),
          fields: i.value,
          rows: o(e).rows.value,
          shown: d.value.length,
          placeholder: "Search memories"
        }, null, 8, ["modelValue", "words", "fields", "rows", "shown"]),
        o(e).hasMore.value ? (w(), _("p", te, [
          $("Showing " + h(o(e).rows.value.length) + " of " + h(o(e).total.value) + " ", 1),
          k(o(q), {
            small: "",
            bordered: "",
            onClick: n[2] || (n[2] = (s) => o(e).more())
          }, {
            default: f(() => [...n[5] || (n[5] = [
              $("Show more", -1)
            ])]),
            _: 1
          })
        ])) : N("", !0),
        o(e).failure.value ? (w(), _("p", ae, h(o(e).failure.value), 1)) : N("", !0),
        l.value ? (w(), b(U, {
          key: 2,
          row: l.value,
          onClose: n[3] || (n[3] = (s) => l.value = null)
        }, null, 8, ["row"])) : N("", !0)
      ]),
      empty: f(() => [
        o(e).loaded.value ? o(e).rows.value.length ? (w(), _(E, { key: 2 }, [
          $("Try other words or filters.")
        ], 64)) : (w(), _(E, { key: 1 }, [
          $("Memories you or the agent save appear here.")
        ], 64)) : (w(), b(o(P), {
          key: 0,
          shape: "rows"
        }))
      ]),
      meta: f(({ item: s }) => [
        W("span", {
          class: "task",
          title: s.row.task_id ? `Task ${s.row.task_id}` : "",
          "data-memory-task": ""
        }, h(s.row.task_id ?? ""), 9, oe)
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
}, ce = /* @__PURE__ */ K(ne, [["__scopeId", "data-v-f3b29426"]]);
export {
  ce as default
};
