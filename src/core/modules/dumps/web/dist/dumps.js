/* @code-commandments-generated */
if (!document.getElementById("window-styles-46957f7cd0cd")) { const style = document.createElement("style"); style.id = "window-styles-46957f7cd0cd"; style.textContent = ".dump-dock[data-v-4cfda69f]{display:flex;gap:8px;font-size:12px;line-height:1.45}.dump-dock-title[data-v-4cfda69f]{color:var(--text-4)}.dumps[data-v-fb118183]{display:flex;flex-direction:column;gap:12px}.dump[data-v-fb118183]{display:flex;flex-direction:column;gap:6px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.dump-earlier[data-v-fb118183]{flex-direction:row;align-items:center;justify-content:space-between;color:inherit;text-align:left;cursor:pointer}.dump-head[data-v-fb118183]{display:flex;align-items:center;gap:10px}.dump-title[data-v-fb118183]{margin:0;font-size:13px;font-weight:500}.dump-name[data-v-fb118183]{flex:1;font-size:13px}.dump-pill[data-v-fb118183]{padding:1px 8px;border-radius:10px;color:var(--text-3);font-size:11px;border:1px solid var(--border)}.dump-pill[data-phase=Filed][data-v-fb118183]{color:var(--accent-text)}.dump-rename[data-v-fb118183],.dumps-more[data-v-fb118183]{color:var(--text-3);background:none;border:0;cursor:pointer}.dump-rename[data-v-fb118183]{margin-left:auto;font-size:12px}.dumps-more[data-v-fb118183]{align-self:flex-start}.dump-brief[data-v-fb118183],.dumps-note[data-v-fb118183]{margin:0;color:var(--text-3);font-size:12px}.dump-progress[data-v-fb118183]{display:flex;align-items:center;gap:10px;color:var(--text-3);font-size:12px}.dump-bar[data-v-fb118183]{flex:1;height:4px;border-radius:2px;background:var(--border)}.dump-fill[data-v-fb118183]{display:block;height:100%;border-radius:2px;background:var(--accent-text)}.item[data-v-fb118183]{display:grid;grid-template-columns:64px 1fr;gap:2px 10px;padding:6px 0;border-top:1px solid var(--border)}.item-state[data-v-fb118183]{grid-row:span 3;align-self:start;color:var(--text-3);font-size:12px}.item-state.filed[data-v-fb118183]{color:var(--accent-text)}.item-state.failed[data-v-fb118183]{color:var(--danger)}.item-note[data-v-fb118183],.item-refs[data-v-fb118183]{color:var(--text-3);font-size:12px}.made-title[data-v-fb118183]{margin:8px 0 0;font-size:12px;font-weight:500}.made[data-v-fb118183]{display:flex;gap:10px;font-size:12px}.made-kind[data-v-fb118183]{color:var(--accent-text)}.made-from[data-v-fb118183]{color:var(--text-3)}\n"; document.head.appendChild(style); }
import { ref as d, computed as F, openBlock as o, createBlock as N, unref as v, withCtx as I, createElementVNode as l, createElementBlock as n, toDisplayString as a, createCommentVNode as m, createVNode as M, Fragment as c, renderList as w, withDirectives as z, withKeys as P, vModelText as W, normalizeStyle as j, normalizeClass as A } from "vue";
import { useWindow as U, useListTools as q, WindowRoom as G, Skeleton as H, ListTools as J } from "@journal/window-kit";
import { _ as Q } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const X = { class: "dumps" }, Y = {
  key: 1,
  class: "dumps-note"
}, Z = {
  key: 2,
  class: "dumps-note"
}, ee = ["data-dump"], te = { class: "dump-head" }, se = ["onKeydown", "onBlur"], oe = {
  key: 1,
  class: "dump-title"
}, ne = ["data-phase"], ae = ["onClick"], le = { class: "dump-brief" }, ue = {
  key: 0,
  class: "dump-progress",
  "data-dump-progress": ""
}, ie = { class: "dump-bar" }, de = { class: "dump-count" }, me = ["data-item", "data-state"], pe = { class: "item-text" }, ce = {
  key: 0,
  class: "item-note"
}, re = {
  key: 1,
  class: "item-refs"
}, _e = { class: "made-title" }, he = { class: "made-kind" }, fe = { class: "made-ref" }, ve = { class: "made-from" }, ke = ["data-dump", "onClick"], ye = { class: "dump-title" }, we = ["data-phase"], ge = {
  __name: "DumpRows",
  setup(be) {
    const R = { new: "New", noted: "Noted", filed: "Filed", failed: "Failed" }, O = { docs: "Document", doc: "Document", plans: "Plan", plan: "Plan", tasks: "Task", task: "Task", reports: "Report", report: "Report" }, B = ["noted", "filed", "failed"], r = U(), i = d([]), p = d(""), g = d(!1), b = d(0), $ = d(null), _ = d(null), h = d(""), x = q(i, { title: (e) => e.title || `Dump ${e.id}`, isOpen: (e) => !e.outcome }), k = F(() => x.shown.value), E = F(() => $.value ?? (k.value[0] ? k.value[0].id : null)), D = (e) => e.title || `Dump ${e.id}`, f = (e) => e.outcome ? "Filed" : "Filing", C = (e) => e.items.filter((u) => B.includes(u.state)).length, y = (e) => e.items.flatMap((u) => u.refs.map((t) => ({ ref: t, from: u.text }))), K = (e) => O[e.split(":")[0]] || e.split(":")[0];
    async function S() {
      const e = await r.read("dump board");
      p.value = e.ok ? "" : e.error, i.value = e.ok ? e.value.dumps : [], b.value = e.ok ? e.value.total : 0, g.value = !0;
    }
    async function L() {
      const e = await r.read(`dump board --before ${Math.min(...i.value.map((u) => u.id))}`);
      if (!e.ok) return void (p.value = e.error);
      i.value = [...i.value, ...e.value.dumps];
    }
    function V(e) {
      _.value = e.id, h.value = e.title;
    }
    async function T(e) {
      const u = h.value.trim();
      if (_.value = null, !u || u === e.title) return;
      const t = await r.run(["dump", "name", String(e.id), u]);
      t.ok || (p.value = t.error);
    }
    return r.follow(["dump.*", "dump_item.*"], S), S(), (e, u) => (o(), N(v(G), null, {
      default: I(() => [
        l("div", X, [
          g.value ? p.value ? (o(), n("p", Y, a(p.value), 1)) : i.value.length ? m("", !0) : (o(), n("p", Z, "No dumps")) : (o(), N(v(H), {
            key: 0,
            shape: "cards"
          })),
          M(v(J), { tools: v(x) }, null, 8, ["tools"]),
          (o(!0), n(c, null, w(k.value, (t) => (o(), n(c, {
            key: t.id
          }, [
            t.id === E.value ? (o(), n("section", {
              key: 0,
              class: "dump",
              "data-dump": t.id
            }, [
              l("header", te, [
                _.value === t.id ? z((o(), n("input", {
                  key: 0,
                  "onUpdate:modelValue": u[0] || (u[0] = (s) => h.value = s),
                  class: "dump-name",
                  "data-dump-name": "",
                  maxlength: "80",
                  onKeydown: P((s) => T(t), ["enter"]),
                  onBlur: (s) => T(t)
                }, null, 40, se)), [
                  [W, h.value]
                ]) : (o(), n("h3", oe, a(D(t)), 1)),
                l("span", {
                  class: "dump-pill",
                  "data-phase": f(t)
                }, a(f(t)), 9, ne),
                !t.outcome && _.value !== t.id ? (o(), n("button", {
                  key: 2,
                  type: "button",
                  class: "dump-rename",
                  "data-dump-rename": "",
                  onClick: (s) => V(t)
                }, "Rename", 8, ae)) : m("", !0)
              ]),
              l("p", le, a(t.outcome ? `Closed: ${t.outcome}` : t.brief), 1),
              t.items.length ? (o(), n("div", ue, [
                l("span", ie, [
                  l("span", {
                    class: "dump-fill",
                    style: j({ width: `${100 * C(t) / t.items.length}%` })
                  }, null, 4)
                ]),
                l("span", de, a(C(t)) + " of " + a(t.items.length) + " files settled", 1)
              ])) : m("", !0),
              (o(!0), n(c, null, w(t.items, (s) => (o(), n("div", {
                key: s.id,
                class: "item",
                "data-item": s.id,
                "data-state": s.state
              }, [
                l("span", {
                  class: A(["item-state", s.state])
                }, a(R[s.state] || s.state), 3),
                l("span", pe, a(s.text), 1),
                s.summary || s.note ? (o(), n("span", ce, a(s.summary || s.note), 1)) : m("", !0),
                s.refs.length ? (o(), n("span", re, "Filed into " + a(s.refs.join(", ")), 1)) : m("", !0)
              ], 8, me))), 128)),
              y(t).length ? (o(), n(c, { key: 1 }, [
                l("h4", _e, a(y(t).length) + " things filed", 1),
                (o(!0), n(c, null, w(y(t), (s) => (o(), n("div", {
                  key: `${s.ref}-${s.from}`,
                  class: "made",
                  "data-made": ""
                }, [
                  l("span", he, a(K(s.ref)), 1),
                  l("span", fe, a(s.ref), 1),
                  l("span", ve, "From " + a(s.from), 1)
                ]))), 128))
              ], 64)) : m("", !0)
            ], 8, ee)) : (o(), n("button", {
              key: 1,
              type: "button",
              class: "dump dump-earlier",
              "data-dump": t.id,
              onClick: (s) => $.value = t.id
            }, [
              l("span", ye, a(D(t)), 1),
              l("span", {
                class: "dump-pill",
                "data-phase": f(t)
              }, a(f(t)), 9, we)
            ], 8, ke))
          ], 64))), 128)),
          i.value.length < b.value ? (o(), n("button", {
            key: 3,
            type: "button",
            class: "dumps-more",
            onClick: L
          }, "Show more")) : m("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, Ce = /* @__PURE__ */ Q(ge, [["__scopeId", "data-v-fb118183"]]);
export {
  Ce as default
};
