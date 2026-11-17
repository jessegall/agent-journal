if (!document.getElementById("window-styles-b2140a8f22e4")) { const style = document.createElement("style"); style.id = "window-styles-b2140a8f22e4"; style.textContent = ".dumps[data-v-325a5060]{display:flex;flex-direction:column;gap:12px}.dump[data-v-325a5060]{display:flex;flex-direction:column;gap:6px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.dump-earlier[data-v-325a5060]{flex-direction:row;align-items:center;justify-content:space-between;color:inherit;text-align:left;cursor:pointer}.dump-head[data-v-325a5060]{display:flex;align-items:center;gap:10px}.dump-title[data-v-325a5060]{margin:0;font-size:13px;font-weight:500}.dump-name[data-v-325a5060]{flex:1;font-size:13px}.dump-pill[data-v-325a5060]{padding:1px 8px;border-radius:10px;color:var(--text-3);font-size:11px;border:1px solid var(--border)}.dump-pill[data-phase=Filed][data-v-325a5060]{color:var(--accent-text)}.dump-rename[data-v-325a5060]{margin-left:auto;font-size:12px}.dump-brief[data-v-325a5060],.dumps-note[data-v-325a5060]{margin:0;color:var(--text-3);font-size:12px}.dump-progress[data-v-325a5060]{display:flex;align-items:center;gap:10px;color:var(--text-3);font-size:12px}.dump-bar[data-v-325a5060]{flex:1;height:4px;border-radius:2px;background:var(--border)}.dump-fill[data-v-325a5060]{display:block;height:100%;border-radius:2px;background:var(--accent-text)}.item[data-v-325a5060]{display:grid;grid-template-columns:64px 1fr;gap:2px 10px;padding:6px 0;border-top:1px solid var(--border)}.item-state[data-v-325a5060]{grid-row:span 3;align-self:start;color:var(--text-3);font-size:12px}.item-state.filed[data-v-325a5060]{color:var(--accent-text)}.item-state.failed[data-v-325a5060]{color:var(--danger)}.item-note[data-v-325a5060],.item-refs[data-v-325a5060]{color:var(--text-3);font-size:12px}.made-title[data-v-325a5060]{margin:8px 0 0;font-size:12px;font-weight:500}.made[data-v-325a5060]{display:flex;gap:10px;font-size:12px}.made-type[data-v-325a5060]{color:var(--accent-text)}.made-from[data-v-325a5060]{color:var(--text-3)}\n"; document.head.appendChild(style); }
import { ref as c, computed as y, watch as W, openBlock as o, createBlock as D, unref as p, withCtx as E, createElementVNode as u, createElementBlock as n, toDisplayString as a, createCommentVNode as d, createVNode as j, Fragment as r, renderList as F, withDirectives as A, withKeys as U, vModelText as Y, normalizeStyle as q, normalizeClass as G, createTextVNode as H } from "vue";
import { useWindow as J, useListTools as Q, WindowRoom as X, Skeleton as Z, ListTools as ee, MoreButton as te } from "@journal/window-kit";
const se = (w, g) => {
  const _ = w.__vccOpts || w;
  for (const [T, m] of g)
    _[T] = m;
  return _;
}, oe = { class: "dumps" }, ne = {
  key: 1,
  class: "dumps-note"
}, ae = {
  key: 2,
  class: "dumps-note"
}, le = ["data-dump"], ue = { class: "dump-head" }, ie = ["onKeydown", "onBlur"], de = {
  key: 1,
  class: "dump-title"
}, pe = ["data-phase"], me = ["onClick"], ce = { class: "dump-brief" }, re = {
  key: 0,
  class: "dump-progress",
  "data-dump-progress": ""
}, _e = { class: "dump-bar" }, he = { class: "dump-count" }, fe = ["data-item", "data-state"], ve = { class: "item-text" }, ke = {
  key: 0,
  class: "item-note"
}, ye = {
  key: 1,
  class: "item-refs"
}, we = { class: "made-title" }, ge = { class: "made-type" }, Te = { class: "made-ref" }, xe = { class: "made-from" }, $e = ["data-dump", "onClick"], Ce = { class: "dump-title" }, De = ["data-phase"], Fe = {
  __name: "DumpRows",
  setup(w) {
    const g = { new: "New", noted: "Noted", filed: "Filed", failed: "Failed" }, _ = { docs: "Document", doc: "Document", plans: "Plan", plan: "Plan", tasks: "Task", task: "Task", reports: "Report", report: "Report" }, T = ["noted", "filed", "failed"], m = J(), { data: x, failure: V, loaded: K } = m.props.dumps, i = c([]), h = c(""), S = y(() => h.value || V.value), L = y(() => x.value ? x.value.total : 0);
    W(x, (t) => {
      i.value = t ? t.dumps : [], h.value = "";
    }, { immediate: !0 });
    const b = c(null), f = c(null), v = c(""), N = Q(i, { title: (t) => t.title || `Dump ${t.id}`, isOpen: (t) => !t.outcome }), $ = y(() => N.shown.value), M = y(() => b.value ?? ($.value[0] ? $.value[0].id : null)), O = (t) => t.title || `Dump ${t.id}`, k = (t) => t.outcome ? "Filed" : "Filing", R = (t) => t.items.filter((l) => T.includes(l.state)).length, C = (t) => t.items.flatMap((l) => l.refs.map((e) => ({ ref: e, from: l.text }))), P = (t) => _[t.split(":")[0]] || t.split(":")[0];
    async function z() {
      const t = await m.readKey("dumps", { before: Math.min(...i.value.map((l) => l.id)) });
      if (!t.ok) return void (h.value = t.error);
      i.value = [...i.value, ...t.value.dumps];
    }
    function I(t) {
      f.value = t.id, v.value = t.title;
    }
    async function B(t) {
      const l = v.value.trim();
      if (f.value = null, !l || l === t.title) return;
      const e = await m.run(["dump", "name", String(t.id), l]);
      e.ok || (h.value = e.error);
    }
    return (t, l) => (o(), D(p(X), null, {
      default: E(() => [
        u("div", oe, [
          p(K) ? S.value ? (o(), n("p", ne, a(S.value), 1)) : i.value.length ? d("", !0) : (o(), n("p", ae, "No dumps")) : (o(), D(p(Z), {
            key: 0,
            shape: "cards"
          })),
          j(p(ee), { tools: p(N) }, null, 8, ["tools"]),
          (o(!0), n(r, null, F($.value, (e) => (o(), n(r, {
            key: e.id
          }, [
            e.id === M.value ? (o(), n("section", {
              key: 0,
              class: "dump",
              "data-dump": e.id
            }, [
              u("header", ue, [
                f.value === e.id ? A((o(), n("input", {
                  key: 0,
                  "onUpdate:modelValue": l[0] || (l[0] = (s) => v.value = s),
                  class: "dump-name",
                  "data-dump-name": "",
                  maxlength: "80",
                  onKeydown: U((s) => B(e), ["enter"]),
                  onBlur: (s) => B(e)
                }, null, 40, ie)), [
                  [Y, v.value]
                ]) : (o(), n("h3", de, a(O(e)), 1)),
                u("span", {
                  class: "dump-pill",
                  "data-phase": k(e)
                }, a(k(e)), 9, pe),
                !e.outcome && f.value !== e.id ? (o(), n("button", {
                  key: 2,
                  type: "button",
                  class: "dump-rename",
                  "data-dump-rename": "",
                  onClick: (s) => I(e)
                }, "Rename", 8, me)) : d("", !0)
              ]),
              u("p", ce, a(e.outcome ? `Closed: ${e.outcome}` : e.brief), 1),
              e.items.length ? (o(), n("div", re, [
                u("span", _e, [
                  u("span", {
                    class: "dump-fill",
                    style: q({ width: `${100 * R(e) / e.items.length}%` })
                  }, null, 4)
                ]),
                u("span", he, a(R(e)) + " of " + a(e.items.length) + " files settled", 1)
              ])) : d("", !0),
              (o(!0), n(r, null, F(e.items, (s) => (o(), n("div", {
                key: s.id,
                class: "item",
                "data-item": s.id,
                "data-state": s.state
              }, [
                u("span", {
                  class: G(["item-state", s.state])
                }, a(g[s.state] || s.state), 3),
                u("span", ve, a(s.text), 1),
                s.summary || s.note ? (o(), n("span", ke, a(s.summary || s.note), 1)) : d("", !0),
                s.refs.length ? (o(), n("span", ye, "Filed into " + a(s.refs.join(", ")), 1)) : d("", !0)
              ], 8, fe))), 128)),
              C(e).length ? (o(), n(r, { key: 1 }, [
                u("h4", we, a(C(e).length) + " items created", 1),
                (o(!0), n(r, null, F(C(e), (s) => (o(), n("div", {
                  key: `${s.ref}-${s.from}`,
                  class: "made",
                  "data-made": ""
                }, [
                  u("span", ge, a(P(s.ref)), 1),
                  u("span", Te, a(s.ref), 1),
                  u("span", xe, "From " + a(s.from), 1)
                ]))), 128))
              ], 64)) : d("", !0)
            ], 8, le)) : (o(), n("button", {
              key: 1,
              type: "button",
              class: "dump dump-earlier",
              "data-dump": e.id,
              onClick: (s) => b.value = e.id
            }, [
              u("span", Ce, a(O(e)), 1),
              u("span", {
                class: "dump-pill",
                "data-phase": k(e)
              }, a(k(e)), 9, De)
            ], 8, $e))
          ], 64))), 128)),
          i.value.length < L.value ? (o(), D(p(te), {
            key: 3,
            onClick: z
          }, {
            default: E(() => [...l[1] || (l[1] = [
              H("Show more", -1)
            ])]),
            _: 1
          })) : d("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, Ne = /* @__PURE__ */ se(Fe, [["__scopeId", "data-v-325a5060"]]);
export {
  Ne as default
};
