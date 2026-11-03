/* @code-commandments-generated */
if (!document.getElementById("window-styles-36f28f63b062")) { const style = document.createElement("style"); style.id = "window-styles-36f28f63b062"; style.textContent = ".dump-dock[data-v-4cfda69f]{display:flex;gap:8px;font-size:12px;line-height:1.45}.dump-dock-title[data-v-4cfda69f]{color:var(--text-4)}.dumps[data-v-2c10eb80]{display:flex;flex-direction:column;gap:12px}.dump[data-v-2c10eb80]{display:flex;flex-direction:column;gap:6px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.dump-earlier[data-v-2c10eb80]{flex-direction:row;align-items:center;justify-content:space-between;color:inherit;text-align:left;cursor:pointer}.dump-head[data-v-2c10eb80]{display:flex;align-items:center;gap:10px}.dump-title[data-v-2c10eb80]{margin:0;font-size:13px;font-weight:500}.dump-name[data-v-2c10eb80]{flex:1;font-size:13px}.dump-pill[data-v-2c10eb80]{padding:1px 8px;border-radius:10px;color:var(--text-3);font-size:11px;border:1px solid var(--border)}.dump-pill[data-phase=Filed][data-v-2c10eb80]{color:var(--accent-text)}.dump-rename[data-v-2c10eb80],.dumps-more[data-v-2c10eb80]{color:var(--text-3);background:none;border:0;cursor:pointer}.dump-rename[data-v-2c10eb80]{margin-left:auto;font-size:12px}.dumps-more[data-v-2c10eb80]{align-self:flex-start}.dump-brief[data-v-2c10eb80],.dumps-note[data-v-2c10eb80]{margin:0;color:var(--text-3);font-size:12px}.dump-progress[data-v-2c10eb80]{display:flex;align-items:center;gap:10px;color:var(--text-3);font-size:12px}.dump-bar[data-v-2c10eb80]{flex:1;height:4px;border-radius:2px;background:var(--border)}.dump-fill[data-v-2c10eb80]{display:block;height:100%;border-radius:2px;background:var(--accent-text)}.item[data-v-2c10eb80]{display:grid;grid-template-columns:64px 1fr;gap:2px 10px;padding:6px 0;border-top:1px solid var(--border)}.item-state[data-v-2c10eb80]{grid-row:span 3;align-self:start;color:var(--text-3);font-size:12px}.item-state.filed[data-v-2c10eb80]{color:var(--accent-text)}.item-state.failed[data-v-2c10eb80]{color:var(--danger)}.item-note[data-v-2c10eb80],.item-refs[data-v-2c10eb80]{color:var(--text-3);font-size:12px}.made-title[data-v-2c10eb80]{margin:8px 0 0;font-size:12px;font-weight:500}.made[data-v-2c10eb80]{display:flex;gap:10px;font-size:12px}.made-kind[data-v-2c10eb80]{color:var(--accent-text)}.made-from[data-v-2c10eb80]{color:var(--text-3)}\n"; document.head.appendChild(style); }
import { ref as d, computed as F, openBlock as o, createElementBlock as n, createBlock as V, unref as y, toDisplayString as a, createCommentVNode as p, createVNode as I, Fragment as c, renderList as w, createElementVNode as l, withDirectives as M, withKeys as z, vModelText as P, normalizeStyle as j, normalizeClass as A } from "vue";
import { useWindow as U, useListTools as W, Skeleton as q, ListTools as G } from "@journal/window-kit";
import { _ as H } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const J = { class: "dumps" }, Q = {
  key: 1,
  class: "dumps-note"
}, X = {
  key: 2,
  class: "dumps-note"
}, Y = ["data-dump"], Z = { class: "dump-head" }, ee = ["onKeydown", "onBlur"], te = {
  key: 1,
  class: "dump-title"
}, se = ["data-phase"], oe = ["onClick"], ne = { class: "dump-brief" }, ae = {
  key: 0,
  class: "dump-progress",
  "data-dump-progress": ""
}, le = { class: "dump-bar" }, ue = { class: "dump-count" }, ie = ["data-item", "data-state"], de = { class: "item-text" }, pe = {
  key: 0,
  class: "item-note"
}, me = {
  key: 1,
  class: "item-refs"
}, ce = { class: "made-title" }, re = { class: "made-kind" }, _e = { class: "made-ref" }, he = { class: "made-from" }, fe = ["data-dump", "onClick"], ve = { class: "dump-title" }, ke = ["data-phase"], ye = {
  __name: "DumpRows",
  setup(we) {
    const N = { new: "New", noted: "Noted", filed: "Filed", failed: "Failed" }, O = { docs: "Document", doc: "Document", plans: "Plan", plan: "Plan", tasks: "Task", task: "Task", reports: "Report", report: "Report" }, R = ["noted", "filed", "failed"], r = U(), i = d([]), m = d(""), g = d(!1), b = d(0), $ = d(null), _ = d(null), h = d(""), D = W(i, { title: (e) => e.title || `Dump ${e.id}`, isOpen: (e) => !e.outcome }), v = F(() => D.shown.value), B = F(() => $.value ?? (v.value[0] ? v.value[0].id : null)), x = (e) => e.title || `Dump ${e.id}`, f = (e) => e.outcome ? "Filed" : "Filing", S = (e) => e.items.filter((u) => R.includes(u.state)).length, k = (e) => e.items.flatMap((u) => u.refs.map((t) => ({ ref: t, from: u.text }))), E = (e) => O[e.split(":")[0]] || e.split(":")[0];
    async function T() {
      const e = await r.read("dump board");
      m.value = e.ok ? "" : e.error, i.value = e.ok ? e.value.dumps : [], b.value = e.ok ? e.value.total : 0, g.value = !0;
    }
    async function K() {
      const e = await r.read(`dump board --before ${Math.min(...i.value.map((u) => u.id))}`);
      if (!e.ok) return void (m.value = e.error);
      i.value = [...i.value, ...e.value.dumps];
    }
    function L(e) {
      _.value = e.id, h.value = e.title;
    }
    async function C(e) {
      const u = h.value.trim();
      if (_.value = null, !u || u === e.title) return;
      const t = await r.run(["dump", "name", String(e.id), u]);
      t.ok || (m.value = t.error);
    }
    return r.follow(["dump.*", "dump_item.*"], T), T(), (e, u) => (o(), n("div", J, [
      g.value ? m.value ? (o(), n("p", Q, a(m.value), 1)) : i.value.length ? p("", !0) : (o(), n("p", X, "No dumps")) : (o(), V(y(q), {
        key: 0,
        shape: "cards"
      })),
      I(y(G), { tools: y(D) }, null, 8, ["tools"]),
      (o(!0), n(c, null, w(v.value, (t) => (o(), n(c, {
        key: t.id
      }, [
        t.id === B.value ? (o(), n("section", {
          key: 0,
          class: "dump",
          "data-dump": t.id
        }, [
          l("header", Z, [
            _.value === t.id ? M((o(), n("input", {
              key: 0,
              "onUpdate:modelValue": u[0] || (u[0] = (s) => h.value = s),
              class: "dump-name",
              "data-dump-name": "",
              maxlength: "80",
              onKeydown: z((s) => C(t), ["enter"]),
              onBlur: (s) => C(t)
            }, null, 40, ee)), [
              [P, h.value]
            ]) : (o(), n("h3", te, a(x(t)), 1)),
            l("span", {
              class: "dump-pill",
              "data-phase": f(t)
            }, a(f(t)), 9, se),
            !t.outcome && _.value !== t.id ? (o(), n("button", {
              key: 2,
              type: "button",
              class: "dump-rename",
              "data-dump-rename": "",
              onClick: (s) => L(t)
            }, "Rename", 8, oe)) : p("", !0)
          ]),
          l("p", ne, a(t.outcome ? `Closed: ${t.outcome}` : t.brief), 1),
          t.items.length ? (o(), n("div", ae, [
            l("span", le, [
              l("span", {
                class: "dump-fill",
                style: j({ width: `${100 * S(t) / t.items.length}%` })
              }, null, 4)
            ]),
            l("span", ue, a(S(t)) + " of " + a(t.items.length) + " files settled", 1)
          ])) : p("", !0),
          (o(!0), n(c, null, w(t.items, (s) => (o(), n("div", {
            key: s.id,
            class: "item",
            "data-item": s.id,
            "data-state": s.state
          }, [
            l("span", {
              class: A(["item-state", s.state])
            }, a(N[s.state] || s.state), 3),
            l("span", de, a(s.text), 1),
            s.summary || s.note ? (o(), n("span", pe, a(s.summary || s.note), 1)) : p("", !0),
            s.refs.length ? (o(), n("span", me, "Filed into " + a(s.refs.join(", ")), 1)) : p("", !0)
          ], 8, ie))), 128)),
          k(t).length ? (o(), n(c, { key: 1 }, [
            l("h4", ce, a(k(t).length) + " things filed", 1),
            (o(!0), n(c, null, w(k(t), (s) => (o(), n("div", {
              key: `${s.ref}-${s.from}`,
              class: "made",
              "data-made": ""
            }, [
              l("span", re, a(E(s.ref)), 1),
              l("span", _e, a(s.ref), 1),
              l("span", he, "From " + a(s.from), 1)
            ]))), 128))
          ], 64)) : p("", !0)
        ], 8, Y)) : (o(), n("button", {
          key: 1,
          type: "button",
          class: "dump dump-earlier",
          "data-dump": t.id,
          onClick: (s) => $.value = t.id
        }, [
          l("span", ve, a(x(t)), 1),
          l("span", {
            class: "dump-pill",
            "data-phase": f(t)
          }, a(f(t)), 9, ke)
        ], 8, fe))
      ], 64))), 128)),
      i.value.length < b.value ? (o(), n("button", {
        key: 3,
        type: "button",
        class: "dumps-more",
        onClick: K
      }, "Show more")) : p("", !0)
    ]));
  }
}, De = /* @__PURE__ */ H(ye, [["__scopeId", "data-v-2c10eb80"]]);
export {
  De as default
};
