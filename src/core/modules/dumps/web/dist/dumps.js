/* @code-commandments-generated */
if (!document.getElementById("window-styles-d55150df1441")) { const style = document.createElement("style"); style.id = "window-styles-d55150df1441"; style.textContent = ".dumps[data-v-a0bd6fa2]{display:flex;flex-direction:column;gap:12px}.dump[data-v-a0bd6fa2]{display:flex;flex-direction:column;gap:6px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.dump-earlier[data-v-a0bd6fa2]{flex-direction:row;align-items:center;justify-content:space-between;color:inherit;text-align:left;cursor:pointer}.dump-head[data-v-a0bd6fa2]{display:flex;align-items:center;gap:10px}.dump-title[data-v-a0bd6fa2]{margin:0;font-size:13px;font-weight:500}.dump-name[data-v-a0bd6fa2]{flex:1;font-size:13px}.dump-pill[data-v-a0bd6fa2]{padding:1px 8px;border-radius:10px;color:var(--text-3);font-size:11px;border:1px solid var(--border)}.dump-pill[data-phase=Filed][data-v-a0bd6fa2]{color:var(--accent-text)}.dump-rename[data-v-a0bd6fa2],.dumps-more[data-v-a0bd6fa2]{color:var(--text-3);background:none;border:0;cursor:pointer}.dump-rename[data-v-a0bd6fa2]{margin-left:auto;font-size:12px}.dumps-more[data-v-a0bd6fa2]{align-self:flex-start}.dump-brief[data-v-a0bd6fa2],.dumps-note[data-v-a0bd6fa2]{margin:0;color:var(--text-3);font-size:12px}.dump-progress[data-v-a0bd6fa2]{display:flex;align-items:center;gap:10px;color:var(--text-3);font-size:12px}.dump-bar[data-v-a0bd6fa2]{flex:1;height:4px;border-radius:2px;background:var(--border)}.dump-fill[data-v-a0bd6fa2]{display:block;height:100%;border-radius:2px;background:var(--accent-text)}.item[data-v-a0bd6fa2]{display:grid;grid-template-columns:64px 1fr;gap:2px 10px;padding:6px 0;border-top:1px solid var(--border)}.item-state[data-v-a0bd6fa2]{grid-row:span 3;align-self:start;color:var(--text-3);font-size:12px}.item-state.filed[data-v-a0bd6fa2]{color:var(--accent-text)}.item-state.failed[data-v-a0bd6fa2]{color:var(--danger)}.item-note[data-v-a0bd6fa2],.item-refs[data-v-a0bd6fa2]{color:var(--text-3);font-size:12px}.made-title[data-v-a0bd6fa2]{margin:8px 0 0;font-size:12px;font-weight:500}.made[data-v-a0bd6fa2]{display:flex;gap:10px;font-size:12px}.made-type[data-v-a0bd6fa2]{color:var(--accent-text)}.made-from[data-v-a0bd6fa2]{color:var(--text-3)}\n"; document.head.appendChild(style); }
import { ref as m, computed as k, watch as I, openBlock as o, createBlock as N, unref as c, withCtx as W, createElementVNode as l, createElementBlock as n, toDisplayString as a, createCommentVNode as d, createVNode as j, Fragment as r, renderList as C, withDirectives as A, withKeys as U, vModelText as Y, normalizeStyle as q, normalizeClass as G } from "vue";
import { useWindow as H, useListTools as J, WindowRoom as Q, Skeleton as X, ListTools as Z } from "@journal/window-kit";
const ee = (w, g) => {
  const _ = w.__vccOpts || w;
  for (const [b, p] of g)
    _[b] = p;
  return _;
}, te = { class: "dumps" }, se = {
  key: 1,
  class: "dumps-note"
}, oe = {
  key: 2,
  class: "dumps-note"
}, ne = ["data-dump"], ae = { class: "dump-head" }, le = ["onKeydown", "onBlur"], ue = {
  key: 1,
  class: "dump-title"
}, ie = ["data-phase"], de = ["onClick"], pe = { class: "dump-brief" }, me = {
  key: 0,
  class: "dump-progress",
  "data-dump-progress": ""
}, ce = { class: "dump-bar" }, re = { class: "dump-count" }, _e = ["data-item", "data-state"], he = { class: "item-text" }, fe = {
  key: 0,
  class: "item-note"
}, ve = {
  key: 1,
  class: "item-refs"
}, ye = { class: "made-title" }, ke = { class: "made-type" }, we = { class: "made-ref" }, ge = { class: "made-from" }, be = ["data-dump", "onClick"], Te = { class: "dump-title" }, $e = ["data-phase"], xe = {
  __name: "DumpRows",
  setup(w) {
    const g = { new: "New", noted: "Noted", filed: "Filed", failed: "Failed" }, _ = { docs: "Document", doc: "Document", plans: "Plan", plan: "Plan", tasks: "Task", task: "Task", reports: "Report", report: "Report" }, b = ["noted", "filed", "failed"], p = H(), { data: T, failure: B, loaded: K } = p.props.dumps, i = m([]), h = m(""), D = k(() => h.value || B.value), L = k(() => T.value ? T.value.total : 0);
    I(T, (t) => {
      i.value = t ? t.dumps : [], h.value = "";
    }, { immediate: !0 });
    const F = m(null), f = m(null), v = m(""), S = J(i, { title: (t) => t.title || `Dump ${t.id}`, isOpen: (t) => !t.outcome }), $ = k(() => S.shown.value), V = k(() => F.value ?? ($.value[0] ? $.value[0].id : null)), O = (t) => t.title || `Dump ${t.id}`, y = (t) => t.outcome ? "Filed" : "Filing", R = (t) => t.items.filter((u) => b.includes(u.state)).length, x = (t) => t.items.flatMap((u) => u.refs.map((e) => ({ ref: e, from: u.text }))), M = (t) => _[t.split(":")[0]] || t.split(":")[0];
    async function P() {
      const t = await p.readKey("dumps", { before: Math.min(...i.value.map((u) => u.id)) });
      if (!t.ok) return void (h.value = t.error);
      i.value = [...i.value, ...t.value.dumps];
    }
    function z(t) {
      f.value = t.id, v.value = t.title;
    }
    async function E(t) {
      const u = v.value.trim();
      if (f.value = null, !u || u === t.title) return;
      const e = await p.run(["dump", "name", String(t.id), u]);
      e.ok || (h.value = e.error);
    }
    return (t, u) => (o(), N(c(Q), null, {
      default: W(() => [
        l("div", te, [
          c(K) ? D.value ? (o(), n("p", se, a(D.value), 1)) : i.value.length ? d("", !0) : (o(), n("p", oe, "No dumps")) : (o(), N(c(X), {
            key: 0,
            shape: "cards"
          })),
          j(c(Z), { tools: c(S) }, null, 8, ["tools"]),
          (o(!0), n(r, null, C($.value, (e) => (o(), n(r, {
            key: e.id
          }, [
            e.id === V.value ? (o(), n("section", {
              key: 0,
              class: "dump",
              "data-dump": e.id
            }, [
              l("header", ae, [
                f.value === e.id ? A((o(), n("input", {
                  key: 0,
                  "onUpdate:modelValue": u[0] || (u[0] = (s) => v.value = s),
                  class: "dump-name",
                  "data-dump-name": "",
                  maxlength: "80",
                  onKeydown: U((s) => E(e), ["enter"]),
                  onBlur: (s) => E(e)
                }, null, 40, le)), [
                  [Y, v.value]
                ]) : (o(), n("h3", ue, a(O(e)), 1)),
                l("span", {
                  class: "dump-pill",
                  "data-phase": y(e)
                }, a(y(e)), 9, ie),
                !e.outcome && f.value !== e.id ? (o(), n("button", {
                  key: 2,
                  type: "button",
                  class: "dump-rename",
                  "data-dump-rename": "",
                  onClick: (s) => z(e)
                }, "Rename", 8, de)) : d("", !0)
              ]),
              l("p", pe, a(e.outcome ? `Closed: ${e.outcome}` : e.brief), 1),
              e.items.length ? (o(), n("div", me, [
                l("span", ce, [
                  l("span", {
                    class: "dump-fill",
                    style: q({ width: `${100 * R(e) / e.items.length}%` })
                  }, null, 4)
                ]),
                l("span", re, a(R(e)) + " of " + a(e.items.length) + " files settled", 1)
              ])) : d("", !0),
              (o(!0), n(r, null, C(e.items, (s) => (o(), n("div", {
                key: s.id,
                class: "item",
                "data-item": s.id,
                "data-state": s.state
              }, [
                l("span", {
                  class: G(["item-state", s.state])
                }, a(g[s.state] || s.state), 3),
                l("span", he, a(s.text), 1),
                s.summary || s.note ? (o(), n("span", fe, a(s.summary || s.note), 1)) : d("", !0),
                s.refs.length ? (o(), n("span", ve, "Filed into " + a(s.refs.join(", ")), 1)) : d("", !0)
              ], 8, _e))), 128)),
              x(e).length ? (o(), n(r, { key: 1 }, [
                l("h4", ye, a(x(e).length) + " items created", 1),
                (o(!0), n(r, null, C(x(e), (s) => (o(), n("div", {
                  key: `${s.ref}-${s.from}`,
                  class: "made",
                  "data-made": ""
                }, [
                  l("span", ke, a(M(s.ref)), 1),
                  l("span", we, a(s.ref), 1),
                  l("span", ge, "From " + a(s.from), 1)
                ]))), 128))
              ], 64)) : d("", !0)
            ], 8, ne)) : (o(), n("button", {
              key: 1,
              type: "button",
              class: "dump dump-earlier",
              "data-dump": e.id,
              onClick: (s) => F.value = e.id
            }, [
              l("span", Te, a(O(e)), 1),
              l("span", {
                class: "dump-pill",
                "data-phase": y(e)
              }, a(y(e)), 9, $e)
            ], 8, be))
          ], 64))), 128)),
          i.value.length < L.value ? (o(), n("button", {
            key: 3,
            type: "button",
            class: "dumps-more",
            onClick: P
          }, "Show more")) : d("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, Fe = /* @__PURE__ */ ee(xe, [["__scopeId", "data-v-a0bd6fa2"]]);
export {
  Fe as default
};
