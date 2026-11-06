/* @code-commandments-generated */
if (!document.getElementById("window-styles-7b84f8ef4945")) { const style = document.createElement("style"); style.id = "window-styles-7b84f8ef4945"; style.textContent = ".dumps[data-v-2b72d986]{display:flex;flex-direction:column;gap:12px}.dump[data-v-2b72d986]{display:flex;flex-direction:column;gap:6px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.dump-earlier[data-v-2b72d986]{flex-direction:row;align-items:center;justify-content:space-between;color:inherit;text-align:left;cursor:pointer}.dump-head[data-v-2b72d986]{display:flex;align-items:center;gap:10px}.dump-title[data-v-2b72d986]{margin:0;font-size:13px;font-weight:500}.dump-name[data-v-2b72d986]{flex:1;font-size:13px}.dump-pill[data-v-2b72d986]{padding:1px 8px;border-radius:10px;color:var(--text-3);font-size:11px;border:1px solid var(--border)}.dump-pill[data-phase=Filed][data-v-2b72d986]{color:var(--accent-text)}.dump-rename[data-v-2b72d986],.dumps-more[data-v-2b72d986]{color:var(--text-3);background:none;border:0;cursor:pointer}.dump-rename[data-v-2b72d986]{margin-left:auto;font-size:12px}.dumps-more[data-v-2b72d986]{align-self:flex-start}.dump-brief[data-v-2b72d986],.dumps-note[data-v-2b72d986]{margin:0;color:var(--text-3);font-size:12px}.dump-progress[data-v-2b72d986]{display:flex;align-items:center;gap:10px;color:var(--text-3);font-size:12px}.dump-bar[data-v-2b72d986]{flex:1;height:4px;border-radius:2px;background:var(--border)}.dump-fill[data-v-2b72d986]{display:block;height:100%;border-radius:2px;background:var(--accent-text)}.item[data-v-2b72d986]{display:grid;grid-template-columns:64px 1fr;gap:2px 10px;padding:6px 0;border-top:1px solid var(--border)}.item-state[data-v-2b72d986]{grid-row:span 3;align-self:start;color:var(--text-3);font-size:12px}.item-state.filed[data-v-2b72d986]{color:var(--accent-text)}.item-state.failed[data-v-2b72d986]{color:var(--danger)}.item-note[data-v-2b72d986],.item-refs[data-v-2b72d986]{color:var(--text-3);font-size:12px}.made-title[data-v-2b72d986]{margin:8px 0 0;font-size:12px;font-weight:500}.made[data-v-2b72d986]{display:flex;gap:10px;font-size:12px}.made-type[data-v-2b72d986]{color:var(--accent-text)}.made-from[data-v-2b72d986]{color:var(--text-3)}\n"; document.head.appendChild(style); }
import { ref as d, computed as N, openBlock as o, createBlock as B, unref as k, withCtx as P, createElementVNode as l, createElementBlock as n, toDisplayString as a, createCommentVNode as p, createVNode as z, Fragment as r, renderList as x, withDirectives as I, withKeys as W, vModelText as j, normalizeStyle as A, normalizeClass as U } from "vue";
import { useWindow as Y, useListTools as q, WindowRoom as G, Skeleton as H, ListTools as J } from "@journal/window-kit";
const Q = (y, w) => {
  const _ = y.__vccOpts || y;
  for (const [g, m] of w)
    _[g] = m;
  return _;
}, X = { class: "dumps" }, Z = {
  key: 1,
  class: "dumps-note"
}, ee = {
  key: 2,
  class: "dumps-note"
}, te = ["data-dump"], se = { class: "dump-head" }, oe = ["onKeydown", "onBlur"], ne = {
  key: 1,
  class: "dump-title"
}, ae = ["data-phase"], le = ["onClick"], ue = { class: "dump-brief" }, ie = {
  key: 0,
  class: "dump-progress",
  "data-dump-progress": ""
}, de = { class: "dump-bar" }, pe = { class: "dump-count" }, me = ["data-item", "data-state"], ce = { class: "item-text" }, re = {
  key: 0,
  class: "item-note"
}, _e = {
  key: 1,
  class: "item-refs"
}, he = { class: "made-title" }, fe = { class: "made-type" }, ve = { class: "made-ref" }, ke = { class: "made-from" }, ye = ["data-dump", "onClick"], we = { class: "dump-title" }, ge = ["data-phase"], be = {
  __name: "DumpRows",
  setup(y) {
    const w = { new: "New", noted: "Noted", filed: "Filed", failed: "Failed" }, _ = { docs: "Document", doc: "Document", plans: "Plan", plan: "Plan", tasks: "Task", task: "Task", reports: "Report", report: "Report" }, g = ["noted", "filed", "failed"], m = Y(), i = d([]), c = d(""), T = d(!1), C = d(0), D = d(null), h = d(null), f = d(""), S = q(i, { title: (e) => e.title || `Dump ${e.id}`, isOpen: (e) => !e.outcome }), b = N(() => S.shown.value), L = N(() => D.value ?? (b.value[0] ? b.value[0].id : null)), F = (e) => e.title || `Dump ${e.id}`, v = (e) => e.outcome ? "Filed" : "Filing", O = (e) => e.items.filter((u) => g.includes(u.state)).length, $ = (e) => e.items.flatMap((u) => u.refs.map((t) => ({ ref: t, from: u.text }))), V = (e) => _[e.split(":")[0]] || e.split(":")[0];
    async function R() {
      const e = await m.read("dump board");
      c.value = e.ok ? "" : e.error, i.value = e.ok ? e.value.dumps : [], C.value = e.ok ? e.value.total : 0, T.value = !0;
    }
    async function K() {
      const e = await m.read(`dump board --before ${Math.min(...i.value.map((u) => u.id))}`);
      if (!e.ok) return void (c.value = e.error);
      i.value = [...i.value, ...e.value.dumps];
    }
    function M(e) {
      h.value = e.id, f.value = e.title;
    }
    async function E(e) {
      const u = f.value.trim();
      if (h.value = null, !u || u === e.title) return;
      const t = await m.run(["dump", "name", String(e.id), u]);
      t.ok || (c.value = t.error);
    }
    return m.follow(["dump.*", "dump_item.*"], R), R(), (e, u) => (o(), B(k(G), null, {
      default: P(() => [
        l("div", X, [
          T.value ? c.value ? (o(), n("p", Z, a(c.value), 1)) : i.value.length ? p("", !0) : (o(), n("p", ee, "No dumps")) : (o(), B(k(H), {
            key: 0,
            shape: "cards"
          })),
          z(k(J), { tools: k(S) }, null, 8, ["tools"]),
          (o(!0), n(r, null, x(b.value, (t) => (o(), n(r, {
            key: t.id
          }, [
            t.id === L.value ? (o(), n("section", {
              key: 0,
              class: "dump",
              "data-dump": t.id
            }, [
              l("header", se, [
                h.value === t.id ? I((o(), n("input", {
                  key: 0,
                  "onUpdate:modelValue": u[0] || (u[0] = (s) => f.value = s),
                  class: "dump-name",
                  "data-dump-name": "",
                  maxlength: "80",
                  onKeydown: W((s) => E(t), ["enter"]),
                  onBlur: (s) => E(t)
                }, null, 40, oe)), [
                  [j, f.value]
                ]) : (o(), n("h3", ne, a(F(t)), 1)),
                l("span", {
                  class: "dump-pill",
                  "data-phase": v(t)
                }, a(v(t)), 9, ae),
                !t.outcome && h.value !== t.id ? (o(), n("button", {
                  key: 2,
                  type: "button",
                  class: "dump-rename",
                  "data-dump-rename": "",
                  onClick: (s) => M(t)
                }, "Rename", 8, le)) : p("", !0)
              ]),
              l("p", ue, a(t.outcome ? `Closed: ${t.outcome}` : t.brief), 1),
              t.items.length ? (o(), n("div", ie, [
                l("span", de, [
                  l("span", {
                    class: "dump-fill",
                    style: A({ width: `${100 * O(t) / t.items.length}%` })
                  }, null, 4)
                ]),
                l("span", pe, a(O(t)) + " of " + a(t.items.length) + " files settled", 1)
              ])) : p("", !0),
              (o(!0), n(r, null, x(t.items, (s) => (o(), n("div", {
                key: s.id,
                class: "item",
                "data-item": s.id,
                "data-state": s.state
              }, [
                l("span", {
                  class: U(["item-state", s.state])
                }, a(w[s.state] || s.state), 3),
                l("span", ce, a(s.text), 1),
                s.summary || s.note ? (o(), n("span", re, a(s.summary || s.note), 1)) : p("", !0),
                s.refs.length ? (o(), n("span", _e, "Filed into " + a(s.refs.join(", ")), 1)) : p("", !0)
              ], 8, me))), 128)),
              $(t).length ? (o(), n(r, { key: 1 }, [
                l("h4", he, a($(t).length) + " items created", 1),
                (o(!0), n(r, null, x($(t), (s) => (o(), n("div", {
                  key: `${s.ref}-${s.from}`,
                  class: "made",
                  "data-made": ""
                }, [
                  l("span", fe, a(V(s.ref)), 1),
                  l("span", ve, a(s.ref), 1),
                  l("span", ke, "From " + a(s.from), 1)
                ]))), 128))
              ], 64)) : p("", !0)
            ], 8, te)) : (o(), n("button", {
              key: 1,
              type: "button",
              class: "dump dump-earlier",
              "data-dump": t.id,
              onClick: (s) => D.value = t.id
            }, [
              l("span", we, a(F(t)), 1),
              l("span", {
                class: "dump-pill",
                "data-phase": v(t)
              }, a(v(t)), 9, ge)
            ], 8, ye))
          ], 64))), 128)),
          i.value.length < C.value ? (o(), n("button", {
            key: 3,
            type: "button",
            class: "dumps-more",
            onClick: K
          }, "Show more")) : p("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, Te = /* @__PURE__ */ Q(be, [["__scopeId", "data-v-2b72d986"]]);
export {
  Te as default
};
