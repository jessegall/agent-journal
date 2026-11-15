if (!document.getElementById("window-styles-a4f5f4415ddb")) { const style = document.createElement("style"); style.id = "window-styles-a4f5f4415ddb"; style.textContent = ".age[data-v-829ed138]{color:var(--text-3);font-size:12px;white-space:nowrap}.more[data-v-829ed138],.failure[data-v-829ed138]{margin:0;padding:6px var(--inset);color:var(--text-3);font-size:12px}.failure[data-v-829ed138]{color:var(--bad, var(--text-2))}\n"; document.head.appendChild(style); }
import { openBlock as p, createBlock as g, unref as t, computed as C, withCtx as c, createVNode as y, createTextVNode as $, createCommentVNode as x, createElementBlock as S, ref as b, Fragment as _, toDisplayString as j } from "vue";
import { useWindow as V, CreateDialog as N, copying as L, deleteItem as M, Reader as P, ActionsMenu as U, Btn as W, defaultFilter as H, applyFilter as z, ListReaderLayout as G, TimeAgo as J, Skeleton as K, PageHeader as Q, FilterBar as X, removed as Y } from "@journal/window-kit";
const Z = {
  __name: "RuleEdit",
  props: { rule: { type: Object, required: !0 } },
  emits: ["close"],
  setup(e, { emit: r }) {
    const o = e, u = r, i = V(), d = [{ key: "text", label: "What every agent must follow", kind: "area", required: !0, value: o.rule.text }], n = (m) => `journal rule edit ${o.rule.id} --text "${m.text.trim().slice(0, 40)}${m.text.trim().length > 40 ? "…" : ""}"`;
    return (m, v) => (p(), g(t(N), {
      title: `Edit rule ${e.rule.id}`,
      submit: "Save the rule",
      fields: d,
      command: n,
      run: (w) => t(i).run(["rule", "edit", String(e.rule.id), "--text", w.text.trim()]),
      onClose: v[0] || (v[0] = (w) => u("close"))
    }, null, 8, ["title", "run"]));
  }
}, T = { proposed: "Waiting for you", active: "Active", denied: "Denied", removed: "Removed" }, F = Object.keys(T), h = [
  { key: "state", label: "State", options: [["proposed", "Waiting"], ["active", "Active"], ["denied", "Denied"], ["removed", "Removed"]], get: (e) => e.state, default: ["proposed", "active"] }
], ee = (e) => [...e].sort((r, o) => F.indexOf(r.state) - F.indexOf(o.state)).map((r) => ({ id: r.id, title: r.text, desc: "", group: T[r.state], row: r }));
function te(e, { run: r, remove: o, ask: u, open: i = null }) {
  const d = String(e.id), n = (v, w) => async ({ say: k }) => {
    const f = await r(v);
    k(f.ok ? w : f.error);
  }, m = e.state === "active";
  return [
    ...i ? [{ label: "Open", group: "open", run: i }] : [],
    { label: "Copy text", group: "copy", run: ({ say: v }) => L(e.text, "", v) },
    ...e.state === "proposed" ? [
      { label: "Approve", group: "own", run: n(["rule", "approve", d], `Rule ${d} approved`) },
      { label: "Decline", group: "own", run: n(["rule", "deny", d], `Rule ${d} declined`) }
    ] : [],
    ...m ? [{ label: "Edit", group: "own", run: u }, M({ word: "Remove", name: `rule ${d}`, remove: o })] : []
  ];
}
const re = {
  key: 0,
  class: "badge-quiet",
  "data-rule-removed": ""
}, oe = {
  __name: "RuleReader",
  props: { rule: { type: Object, required: !0 }, items: { type: Array, required: !0 } },
  emits: ["approve"],
  setup(e, { emit: r }) {
    const o = e, u = r, i = C(() => [
      { name: "state", label: "State", value: T[o.rule.state] ?? o.rule.state },
      { name: "made", label: "Made", value: o.rule.created_at, isTime: !0 }
    ]);
    return (d, n) => (p(), g(t(P), {
      title: e.rule.text,
      number: String(e.rule.id),
      facts: i.value,
      "data-rule-reader": ""
    }, {
      agent: c(() => [
        e.rule.state === "removed" ? (p(), S("span", re, "Removed")) : x("", !0)
      ]),
      primary: c(() => [
        e.rule.state === "proposed" ? (p(), g(t(W), {
          key: 0,
          small: "",
          variant: "primary",
          "data-rule-approve": "",
          onClick: n[0] || (n[0] = (m) => u("approve"))
        }, {
          default: c(() => [...n[1] || (n[1] = [
            $("Approve", -1)
          ])]),
          _: 1
        })) : x("", !0)
      ]),
      actions: c(() => [
        y(t(U), {
          items: e.items,
          head: `Rule ${e.rule.id}`
        }, null, 8, ["items", "head"])
      ]),
      _: 1
    }, 8, ["title", "number", "facts"]));
  }
}, le = (e, r) => {
  const o = e.__vccOpts || e;
  for (const [u, i] of r)
    o[u] = i;
  return o;
}, ae = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-rules-failure": ""
}, ne = {
  key: 1,
  class: "more",
  "data-rules-more": ""
}, se = 460, ue = {
  __name: "RulesPage",
  setup(e) {
    const r = V(), { rows: o, failure: u, loaded: i, more: d, load: n, older: m, act: v, actionFailure: w } = r.props.rules, k = b(H(h)), f = b(""), D = C(() => z(o.value, h, k.value, f.value, ["text"])), q = C(() => ee(D.value)), A = b(null), R = b(null), E = (s, l = null) => te(s, { run: async (a) => {
      const O = await r.run(a);
      return O.ok && n(), O;
    }, remove: () => v(["rule", "remove", String(s.id)], Y(s.id)), ask: () => R.value = s, open: l }), B = (s) => ({ head: `Rule ${s.id}`, items: E(s.row, () => A.value = s.id) }), I = async (s) => {
      (await r.run(["rule", "approve", String(s.id)])).ok && n();
    };
    return (s, l) => (p(), g(t(G), {
      chosen: A.value,
      "onUpdate:chosen": l[4] || (l[4] = (a) => A.value = a),
      items: q.value,
      "list-width": se,
      place: B,
      "empty-title": "No rules yet",
      "pick-line": "Choose a rule",
      "data-rules": ""
    }, {
      top: c(() => [
        y(t(Q), {
          title: "Rules",
          count: t(o).length
        }, null, 8, ["count"]),
        y(t(X), {
          modelValue: k.value,
          "onUpdate:modelValue": l[0] || (l[0] = (a) => k.value = a),
          words: f.value,
          "onUpdate:words": l[1] || (l[1] = (a) => f.value = a),
          fields: t(h),
          rows: t(o),
          shown: D.value.length,
          placeholder: "Search rules"
        }, null, 8, ["modelValue", "words", "fields", "rows", "shown"]),
        t(u) || t(w) ? (p(), S("p", ae, j(t(u) || t(w)), 1)) : x("", !0),
        t(d) ? (p(), S("p", ne, [
          l[6] || (l[6] = $("Older rules are not shown ", -1)),
          y(t(W), {
            small: "",
            bordered: "",
            "data-row-list-more": "",
            onClick: l[2] || (l[2] = (a) => t(m)())
          }, {
            default: c(() => [...l[5] || (l[5] = [
              $("Show older rules", -1)
            ])]),
            _: 1
          })
        ])) : x("", !0),
        R.value ? (p(), g(Z, {
          key: 2,
          rule: R.value,
          onClose: l[3] || (l[3] = (a) => R.value = null)
        }, null, 8, ["rule"])) : x("", !0)
      ]),
      empty: c(() => [
        t(i) ? (p(), S(_, { key: 1 }, [
          $("Rules you add or approve hold for every agent.")
        ], 64)) : (p(), g(t(K), {
          key: 0,
          shape: "rows"
        }))
      ]),
      meta: c(({ item: a }) => [
        y(t(J), {
          class: "age",
          at: a.row.created_at
        }, null, 8, ["at"])
      ]),
      reader: c(({ item: a }) => [
        y(oe, {
          rule: a.row,
          items: E(a.row),
          onApprove: (O) => I(a.row)
        }, null, 8, ["rule", "items", "onApprove"])
      ]),
      _: 1
    }, 8, ["chosen", "items"]));
  }
}, pe = /* @__PURE__ */ le(ue, [["__scopeId", "data-v-829ed138"]]);
export {
  pe as default
};
