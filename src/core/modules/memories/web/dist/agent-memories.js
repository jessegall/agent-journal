if (!document.getElementById("window-styles-578b9bd60f5e")) { const style = document.createElement("style"); style.id = "window-styles-578b9bd60f5e"; style.textContent = ".memory[data-v-f43e8f70]{display:flex;flex-direction:column;gap:3px;width:100%;padding:9px 0;border:0;border-bottom:1px solid var(--border-inner);background:none;color:var(--text);font:inherit;text-align:left;cursor:pointer}.memory:hover .memory-weight[data-v-f43e8f70]{display:inline-flex;gap:6px;align-items:center}.steps[data-v-f43e8f70]{display:inline-flex;gap:2px}.steps i[data-v-f43e8f70]{width:4px;height:8px;border-radius:1px;background:var(--border-2)}.steps i.on[data-v-f43e8f70]{background:var(--text-3)}.memory-title[data-v-f43e8f70]{color:var(--accent-text)}.memory[data-v-f43e8f70]:focus-visible{outline:2px solid var(--accent);outline-offset:-2px}.memory.removed .memory-title[data-v-f43e8f70]{color:var(--text-3)}.memory-text[data-v-f43e8f70]{max-width:74ch;color:var(--text-3);font-size:12px}.memory-meta[data-v-f43e8f70]{display:flex;flex-wrap:wrap;gap:2px 12px;color:var(--text-3);font-size:12px}@media(max-width:720px){.memory[data-v-f43e8f70]{min-height:44px}}.agent-memories[data-v-dc10c24b]{display:flex;flex-direction:column;min-width:0}.band[data-v-dc10c24b]{margin:0;padding:8px 14px 4px;color:var(--text-3);font-size:12px}.agent-memories .row[data-v-dc10c24b]{padding:8px 14px}.notice[data-v-dc10c24b]{display:flex;flex-wrap:wrap;gap:8px 12px;align-items:center;margin:12px 14px;padding:8px 11px;border:1px solid var(--border-2);border-radius:7px;color:var(--danger);font-size:12.5px}.memory-facts[data-v-09dd9f4c]{display:flex;flex-direction:column;gap:6px}.memory-none[data-v-09dd9f4c]{margin:0;color:var(--text-2);font-size:12.5px}.memory-words[data-v-09dd9f4c],.memory-add[data-v-09dd9f4c]{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.memory-word-input[data-v-09dd9f4c]{flex:1 1 140px}.memory-word[data-v-09dd9f4c]{display:inline-flex;gap:4px;align-items:center;padding:1px 8px;border:1px solid var(--border);border-radius:10px;font-size:12.5px}.memory-word-off[data-v-09dd9f4c]{padding:0;border:0;background:none;color:var(--text-3);cursor:pointer}.memory-refusal[data-v-09dd9f4c]{margin:0;color:var(--danger);font-size:12.5px}.task[data-v-d2a32902]{color:var(--text-3);font-size:12px;font-variant-numeric:tabular-nums}.failure[data-v-d2a32902]{margin:0;padding:6px var(--inset);color:var(--bad, var(--text-2));font-size:12px}.memory-round[data-v-4910a3d9]{margin:0 0 0 20px}.memory-round-rows[data-v-4910a3d9]{margin:0;padding:0;list-style:none}.memory-round-row[data-v-4910a3d9]{display:flex;flex-wrap:wrap;gap:2px 8px;padding:2px 0;color:var(--text-2);font-size:12px;line-height:1.45;overflow-wrap:anywhere}.memory-round-ref[data-v-4910a3d9]{padding:0;border:0;background:none;color:var(--accent-text);font:inherit;cursor:pointer}.memory-round-weight[data-v-4910a3d9]{color:var(--text-4)}\n"; document.head.appendChild(style); }
import { computed as _, ref as A, withDirectives as R, openBlock as e, createElementBlock as r, unref as t, normalizeClass as N, createElementVNode as l, toDisplayString as u, createTextVNode as $, Fragment as g, renderList as p, createBlock as w, createCommentVNode as b, onMounted as S, createVNode as V, withCtx as h } from "vue";
import { useWindow as B, peekRef as G, wordLabel as H, vContext as O, Skeleton as W, Btn as j, EmptyState as q, FoldGroup as D } from "@journal/window-kit";
import { _ as F, m as L } from "./MemoryRow-CinYMz_A.js";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const z = ["data-memory"], J = {
  class: "memory-title",
  "data-memory-title": ""
}, K = { class: "memory-text" }, P = { class: "memory-meta" }, Q = { "data-memory-state": "" }, U = {
  class: "memory-weight",
  "data-memory-weight": ""
}, X = {
  class: "steps",
  "aria-hidden": "true"
}, M = 10, Y = {
  __name: "AgentMemoryRow",
  props: { row: { type: Object, required: !0 } },
  setup(o) {
    const n = o, y = _(() => [n.row.task_id ? `Task ${n.row.task_id}` : "", n.row.reason ? `Reason: ${n.row.reason}` : ""].filter(Boolean)), f = B(), c = A(!1), m = () => ({ head: `Memory ${n.row.id}`, items: L(n.row, { run: f.run, ask: () => c.value = !0 }) });
    return (d, i) => R((e(), r("button", {
      type: "button",
      class: N(["memory", { removed: o.row.state === "removed" }]),
      "data-memory": o.row.id,
      onClick: i[1] || (i[1] = (s) => t(G)(`memories:${o.row.id}`))
    }, [
      l("span", J, "Memory " + u(o.row.id), 1),
      l("span", K, u(o.row.text), 1),
      l("span", P, [
        l("span", Q, "State: " + u(t(H)(o.row.state)), 1),
        l("span", U, [
          $(" Weight: " + u(o.row.weight) + " of " + u(M) + " ", 1),
          l("span", X, [
            (e(), r(g, null, p(M, (s) => l("i", {
              key: s,
              class: N({ on: s <= o.row.weight })
            }, null, 2)), 64))
          ])
        ]),
        (e(!0), r(g, null, p(y.value, (s) => (e(), r("span", { key: s }, u(s), 1))), 128))
      ]),
      c.value ? (e(), w(F, {
        key: 0,
        row: o.row,
        onClose: i[0] || (i[0] = (s) => c.value = !1)
      }, null, 8, ["row"])) : b("", !0)
    ], 10, z)), [
      [t(O), m]
    ]);
  }
}, T = /* @__PURE__ */ E(Y, [["__scopeId", "data-v-f43e8f70"]]), Z = {
  class: "agent-memories",
  "data-agent-memories": ""
}, ee = {
  key: 1,
  class: "notice",
  role: "alert",
  "data-agent-memories-failure": ""
}, te = {
  class: "band",
  "data-agent-memories-active": ""
}, oe = {
  __name: "AgentMemories",
  props: { agent: { type: Number, required: !0 } },
  setup(o) {
    const n = o, y = B(), f = `agent-memories.${n.agent}`, c = `agent-removed-memories.${n.agent}`, m = y.props[f], d = y.props[c], i = A(!1), s = _(() => m.loaded.value && d.loaded.value), I = _(() => m.failure.value || d.failure.value), x = (k) => {
      var a;
      return ((a = k.listing.value) == null ? void 0 : a.total) ?? k.rows.value.length;
    }, C = () => y.reload([f, c]);
    return S(C), (k, a) => (e(), r("section", Z, [
      s.value ? I.value ? (e(), r("div", ee, [
        a[2] || (a[2] = l("span", null, "Could not read the memories of this agent: the journal did not answer.", -1)),
        V(t(j), {
          small: "",
          bordered: "",
          "data-agent-memories-retry": "",
          onClick: C
        }, {
          default: h(() => [...a[1] || (a[1] = [
            $("Try again", -1)
          ])]),
          _: 1
        })
      ])) : !t(m).rows.value.length && !t(d).rows.value.length ? (e(), w(t(q), {
        key: 2,
        title: "No memories"
      }, {
        default: h(() => [...a[3] || (a[3] = [
          $("This agent has not made any, and none were given to it.", -1)
        ])]),
        _: 1
      })) : (e(), r(g, { key: 3 }, [
        t(m).rows.value.length ? (e(), r(g, { key: 0 }, [
          l("p", te, "Active: " + u(x(t(m))), 1),
          (e(!0), r(g, null, p(t(m).rows.value, (v) => (e(), w(T, {
            key: v.id,
            class: "row",
            row: v
          }, null, 8, ["row"]))), 128))
        ], 64)) : b("", !0),
        t(d).rows.value.length ? (e(), w(t(D), {
          key: 1,
          label: `Removed: ${x(t(d))}`,
          open: i.value,
          "data-agent-memories-removed": "",
          onToggle: a[0] || (a[0] = (v) => i.value = !i.value)
        }, {
          default: h(() => [
            (e(!0), r(g, null, p(t(d).rows.value, (v) => (e(), w(T, {
              key: v.id,
              class: "row",
              row: v
            }, null, 8, ["row"]))), 128))
          ]),
          _: 1
        }, 8, ["label", "open"])) : b("", !0)
      ], 64)) : (e(), w(t(W), { key: 0 }))
    ]));
  }
}, le = /* @__PURE__ */ E(oe, [["__scopeId", "data-v-dc10c24b"]]);
export {
  le as default
};
