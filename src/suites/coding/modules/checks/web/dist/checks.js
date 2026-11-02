/* @code-commandments-generated */
if (!document.getElementById("window-styles-3a3bea099748")) { const style = document.createElement("style"); style.id = "window-styles-3a3bea099748"; style.textContent = ".check-tools[data-v-9a294ba1]{display:flex;align-items:center;gap:8px;margin-bottom:10px}.check-space[data-v-9a294ba1]{flex:1}.check-command[data-v-9a294ba1]{display:block;margin-bottom:10px;overflow-wrap:anywhere;color:var(--text-2);font-size:12px}.check-output[data-v-9a294ba1]{overflow:auto;max-height:50vh;margin:0;padding:10px 12px;border-radius:8px;background:var(--raised);font-size:12px;white-space:pre-wrap}.check-runs[data-v-9a294ba1]{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}.check-run-row[data-v-9a294ba1]{display:flex;width:100%;padding:6px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:13px;cursor:pointer}.check-run-row[data-v-9a294ba1]:hover{background:var(--hover)}.check-verdict[data-v-9a294ba1]{color:var(--accent-text)}.check-verdict.failing[data-v-9a294ba1]{color:var(--danger)}.check-note[data-v-9a294ba1]{margin:0;color:var(--text-3)}.cards[data-v-9b535d76]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-9b535d76]{display:flex;flex-direction:column;min-width:0;gap:8px;min-height:110px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-9b535d76]:hover{border-color:var(--border-strong, var(--border))}.card-head[data-v-9b535d76]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-9b535d76]{width:14px;height:14px}.card-title[data-v-9b535d76]{font-weight:600}.card-run[data-v-9b535d76]{align-self:flex-start}.card-detail[data-v-9b535d76]{margin:0;overflow-wrap:anywhere;color:var(--text-2);font-size:12px;white-space:pre-wrap}.card-foot[data-v-9b535d76]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-9b535d76]{margin:0;color:var(--text-2)}.card-state[data-v-9b535d76]{margin-left:auto;color:var(--text-3)}.card-state.passing[data-v-9b535d76]{color:var(--accent-text)}.card-state.failing[data-v-9b535d76]{color:var(--danger)}\n"; document.head.appendChild(style); }
import { ref as m, computed as N, openBlock as t, createBlock as w, unref as s, withCtx as R, createElementVNode as c, createVNode as x, createTextVNode as S, toDisplayString as n, createCommentVNode as g, createElementBlock as a, Fragment as b, renderList as I, normalizeClass as O, withKeys as V, withModifiers as E } from "vue";
import { useWindow as F, Dialog as K, Segmented as L, Btn as B, ago as P, useRows as T, useListTools as W, ListTools as j, Skeleton as q, Icon as z } from "@journal/window-kit";
const D = (u, h) => {
  const v = u.__vccOpts || u;
  for (const [p, f] of h)
    v[p] = f;
  return v;
}, M = { class: "check-tools" }, A = { class: "check-command" }, G = {
  key: 0,
  class: "check-note"
}, H = {
  key: 0,
  class: "check-output",
  "data-check-output": ""
}, J = {
  key: 1,
  class: "check-note"
}, Q = {
  key: 0,
  class: "check-runs",
  "data-check-runs": ""
}, U = ["onClick"], X = ["title"], Y = {
  key: 1,
  class: "check-note"
}, Z = {
  __name: "CheckDialog",
  props: { row: { type: Object, required: !0 }, running: Boolean },
  emits: ["close", "run"],
  setup(u, { emit: h }) {
    const v = [
      { key: "output", label: "Output" },
      { key: "runs", label: "Runs" }
    ], p = u, f = h, $ = F(), r = m("output"), _ = m([]), d = m(null), k = m(""), C = N(() => {
      var e;
      return ((e = d.value) == null ? void 0 : e.output) ?? p.row.last_output;
    });
    async function o() {
      const e = await $.read(`check runs ${p.row.id}`);
      k.value = e.ok ? "" : e.error, e.ok && (_.value = e.value.rows);
    }
    function y(e) {
      d.value = e, r.value = "output";
    }
    return $.follow(["check.*"], o), o(), (e, l) => (t(), w(s(K), {
      title: `Check ${u.row.id}: ${u.row.title}`,
      wide: "",
      "data-check-dialog": "",
      onClose: l[2] || (l[2] = (i) => f("close"))
    }, {
      default: R(() => [
        c("div", M, [
          x(s(L), {
            options: v,
            value: r.value,
            onPick: l[0] || (l[0] = (i) => r.value = i)
          }, null, 8, ["value"]),
          l[3] || (l[3] = c("span", { class: "check-space" }, null, -1)),
          u.row.stopped ? g("", !0) : (t(), w(s(B), {
            key: 0,
            small: "",
            bordered: "",
            "data-check-run": "",
            disabled: u.running,
            onClick: l[1] || (l[1] = (i) => f("run", u.row))
          }, {
            default: R(() => [
              S(n(u.running ? "Running" : "Run"), 1)
            ]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        c("code", A, n(u.row.command), 1),
        k.value ? (t(), a("p", G, n(k.value), 1)) : g("", !0),
        r.value === "output" ? (t(), a(b, { key: 1 }, [
          C.value ? (t(), a("pre", H, n(C.value), 1)) : (t(), a("p", J, "No output yet"))
        ], 64)) : (t(), a(b, { key: 2 }, [
          _.value.length ? (t(), a("ul", Q, [
            (t(!0), a(b, null, I(_.value, (i) => (t(), a("li", {
              key: i.run_at
            }, [
              c("button", {
                type: "button",
                class: "check-run-row",
                onClick: (re) => y(i)
              }, [
                c("span", {
                  class: O(["check-verdict", { failing: !i.passed }])
                }, n(i.passed ? "Passed" : "Failed"), 3),
                l[4] || (l[4] = c("span", { class: "check-space" }, null, -1)),
                c("time", {
                  title: i.run_at
                }, n(s(P)(Date.parse(i.run_at) / 1e3)), 9, X)
              ], 8, U)
            ]))), 128))
          ])) : (t(), a("p", Y, "No runs yet"))
        ], 64))
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, ee = /* @__PURE__ */ D(Z, [["__scopeId", "data-v-9a294ba1"]]), te = { class: "cards" }, se = {
  key: 1,
  class: "cards-note"
}, ne = {
  key: 2,
  class: "cards-note"
}, ae = {
  key: 3,
  class: "cards-note",
  "data-check-refusal": ""
}, oe = ["data-row", "onClick", "onKeydown"], le = { class: "card-head" }, ce = { class: "card-title" }, ue = { class: "card-detail" }, de = { class: "card-foot" }, ie = {
  __name: "CheckCards",
  setup(u) {
    const { rows: h, failure: v, loaded: p, context: f } = T("check list", ["check.*"]), $ = W(h, { title: (o) => o.title, isOpen: (o) => !o.stopped }), r = m(null), _ = N(() => h.value.find((o) => o.id === r.value) || null), d = m(/* @__PURE__ */ new Set()), k = m("");
    async function C(o) {
      k.value = "", d.value = /* @__PURE__ */ new Set([...d.value, o.id]);
      const y = await f.run(["check", "run", String(o.id)]);
      d.value = new Set([...d.value].filter((e) => e !== o.id)), y.ok || (k.value = y.error);
    }
    return (o, y) => (t(), a(b, null, [
      x(s(j), {
        tools: s($),
        placeholder: "Search the checks"
      }, null, 8, ["tools"]),
      c("div", te, [
        s(p) ? s(v) ? (t(), a("p", se, n(s(v)), 1)) : s(p) && !s(h).length ? (t(), a("p", ne, "No checks yet")) : g("", !0) : (t(), w(s(q), {
          key: 0,
          shape: "cards"
        })),
        k.value ? (t(), a("p", ae, n(k.value), 1)) : g("", !0),
        (t(!0), a(b, null, I(s($).shown.value, (e) => (t(), a("div", {
          key: e.id,
          role: "button",
          tabindex: "0",
          class: "card",
          "data-row": e.id,
          onClick: (l) => r.value = e.id,
          onKeydown: V((l) => r.value = e.id, ["enter"])
        }, [
          c("span", le, [
            x(s(z), {
              name: "check",
              class: "card-icon"
            }),
            S(" Check " + n(e.id), 1),
            c("span", {
              class: O(["card-state", { failing: e.last_passed === !1, passing: e.last_passed === !0 }])
            }, n(e.last_passed === !0 ? "Passing" : e.last_passed === !1 ? "Failing" : "Not run"), 3)
          ]),
          c("span", ce, n(e.title), 1),
          c("code", ue, n(e.command), 1),
          e.stopped ? g("", !0) : (t(), w(s(B), {
            key: 0,
            small: "",
            bordered: "",
            class: "card-run",
            "data-check-card-run": "",
            disabled: d.value.has(e.id),
            onClick: E((l) => C(e), ["stop"])
          }, {
            default: R(() => [
              S(n(d.value.has(e.id) ? "Running" : "Run"), 1)
            ]),
            _: 2
          }, 1032, ["disabled", "onClick"])),
          c("span", de, n(e.status) + " · " + n(e.interval_minutes ? `Every ${e.interval_minutes} minutes` : "Only when run by hand"), 1)
        ], 40, oe))), 128))
      ]),
      _.value ? (t(), w(ee, {
        key: 0,
        row: _.value,
        running: d.value.has(_.value.id),
        onClose: y[0] || (y[0] = (e) => r.value = null),
        onRun: C
      }, null, 8, ["row", "running"])) : g("", !0)
    ], 64));
  }
}, ve = /* @__PURE__ */ D(ie, [["__scopeId", "data-v-9b535d76"]]);
export {
  ve as default
};
