/* @code-commandments-generated */
if (!document.getElementById("window-styles-a3192e342639")) { const style = document.createElement("style"); style.id = "window-styles-a3192e342639"; style.textContent = ".check-tools[data-v-e37d4ab9]{display:flex;align-items:center;gap:8px;margin-bottom:10px}.check-space[data-v-e37d4ab9]{flex:1}.check-command[data-v-e37d4ab9]{display:block;margin-bottom:10px;overflow-wrap:anywhere;color:var(--text-2);font-size:12px}.check-output[data-v-e37d4ab9]{overflow:auto;max-height:50vh;margin:0;padding:10px 12px;border-radius:8px;background:var(--raised);font-size:12px;white-space:pre-wrap}.check-runs[data-v-e37d4ab9]{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}.check-run-row[data-v-e37d4ab9]{display:flex;width:100%;padding:6px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:13px;cursor:pointer}.check-run-row[data-v-e37d4ab9]:hover{background:var(--hover)}.check-verdict[data-v-e37d4ab9]{color:var(--accent-text)}.check-verdict.failing[data-v-e37d4ab9]{color:var(--danger)}.check-note[data-v-e37d4ab9]{margin:0;color:var(--text-3)}.cards[data-v-9b535d76]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-9b535d76]{display:flex;flex-direction:column;min-width:0;gap:8px;min-height:110px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-9b535d76]:hover{border-color:var(--border-strong, var(--border))}.card-head[data-v-9b535d76]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-9b535d76]{width:14px;height:14px}.card-title[data-v-9b535d76]{font-weight:600}.card-run[data-v-9b535d76]{align-self:flex-start}.card-detail[data-v-9b535d76]{margin:0;overflow-wrap:anywhere;color:var(--text-2);font-size:12px;white-space:pre-wrap}.card-foot[data-v-9b535d76]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-9b535d76]{margin:0;color:var(--text-2)}.card-state[data-v-9b535d76]{margin-left:auto;color:var(--text-3)}.card-state.passing[data-v-9b535d76]{color:var(--accent-text)}.card-state.failing[data-v-9b535d76]{color:var(--danger)}\n"; document.head.appendChild(style); }
import { ref as C, computed as x, openBlock as t, createBlock as b, unref as s, withCtx as S, createElementVNode as l, createVNode as N, createTextVNode as I, toDisplayString as n, createCommentVNode as g, createElementBlock as a, Fragment as w, renderList as O, normalizeClass as B, withKeys as E, withModifiers as L } from "vue";
import { useWindow as F, useReadLine as K, Dialog as P, Segmented as T, Btn as D, ago as W, useRows as j, useListTools as q, ListTools as z, Skeleton as M, Icon as A } from "@journal/window-kit";
const V = (c, p) => {
  const v = c.__vccOpts || c;
  for (const [_, m] of p)
    v[_] = m;
  return v;
}, G = { class: "check-tools" }, H = { class: "check-command" }, J = {
  key: 0,
  class: "check-note"
}, Q = {
  key: 0,
  class: "check-output",
  "data-check-output": ""
}, U = {
  key: 1,
  class: "check-note"
}, X = {
  key: 0,
  class: "check-runs",
  "data-check-runs": ""
}, Y = ["onClick"], Z = ["title"], ee = {
  key: 1,
  class: "check-note"
}, te = {
  __name: "CheckDialog",
  props: { row: { type: Object, required: !0 }, running: Boolean },
  emits: ["close", "run"],
  setup(c, { emit: p }) {
    const v = [
      { key: "output", label: "Output" },
      { key: "runs", label: "Runs" }
    ], _ = c, m = p, R = F(), r = C("output"), f = C(null), { value: k, failure: y, load: $ } = K(() => `check runs ${_.row.id}`), o = x(() => {
      var u;
      return ((u = k.value) == null ? void 0 : u.rows) ?? [];
    }), h = x(() => {
      var u;
      return ((u = f.value) == null ? void 0 : u.output) ?? _.row.last_output;
    });
    function e(u) {
      f.value = u, r.value = "output";
    }
    return R.follow(["check.*"], $), $(), (u, d) => (t(), b(s(P), {
      title: `Check ${c.row.id}: ${c.row.title}`,
      wide: "",
      "data-check-dialog": "",
      onClose: d[2] || (d[2] = (i) => m("close"))
    }, {
      default: S(() => [
        l("div", G, [
          N(s(T), {
            options: v,
            value: r.value,
            onPick: d[0] || (d[0] = (i) => r.value = i)
          }, null, 8, ["value"]),
          d[3] || (d[3] = l("span", { class: "check-space" }, null, -1)),
          c.row.stopped ? g("", !0) : (t(), b(s(D), {
            key: 0,
            small: "",
            bordered: "",
            "data-check-run": "",
            disabled: c.running,
            onClick: d[1] || (d[1] = (i) => m("run", c.row))
          }, {
            default: S(() => [
              I(n(c.running ? "Running" : "Run"), 1)
            ]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        l("code", H, n(c.row.command), 1),
        s(y) ? (t(), a("p", J, n(s(y)), 1)) : g("", !0),
        r.value === "output" ? (t(), a(w, { key: 1 }, [
          h.value ? (t(), a("pre", Q, n(h.value), 1)) : (t(), a("p", U, "No output yet"))
        ], 64)) : (t(), a(w, { key: 2 }, [
          o.value.length ? (t(), a("ul", X, [
            (t(!0), a(w, null, O(o.value, (i) => (t(), a("li", {
              key: i.run_at
            }, [
              l("button", {
                type: "button",
                class: "check-run-row",
                onClick: (he) => e(i)
              }, [
                l("span", {
                  class: B(["check-verdict", { failing: !i.passed }])
                }, n(i.passed ? "Passed" : "Failed"), 3),
                d[4] || (d[4] = l("span", { class: "check-space" }, null, -1)),
                l("time", {
                  title: i.run_at
                }, n(s(W)(Date.parse(i.run_at) / 1e3)), 9, Z)
              ], 8, Y)
            ]))), 128))
          ])) : (t(), a("p", ee, "No runs yet"))
        ], 64))
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, se = /* @__PURE__ */ V(te, [["__scopeId", "data-v-e37d4ab9"]]), ne = { class: "cards" }, ae = {
  key: 1,
  class: "cards-note"
}, oe = {
  key: 2,
  class: "cards-note"
}, le = {
  key: 3,
  class: "cards-note",
  "data-check-refusal": ""
}, ce = ["data-row", "onClick", "onKeydown"], ue = { class: "card-head" }, de = { class: "card-title" }, ie = { class: "card-detail" }, re = { class: "card-foot" }, ke = {
  __name: "CheckCards",
  setup(c) {
    const { rows: p, failure: v, loaded: _, context: m } = j("check list", ["check.*"]), R = q(p, { title: (o) => o.title, isOpen: (o) => !o.stopped }), r = C(null), f = x(() => p.value.find((o) => o.id === r.value) || null), k = C(/* @__PURE__ */ new Set()), y = C("");
    async function $(o) {
      y.value = "", k.value = /* @__PURE__ */ new Set([...k.value, o.id]);
      const h = await m.run(["check", "run", String(o.id)]);
      k.value = new Set([...k.value].filter((e) => e !== o.id)), h.ok || (y.value = h.error);
    }
    return (o, h) => (t(), a(w, null, [
      N(s(z), {
        tools: s(R),
        placeholder: "Search the checks"
      }, null, 8, ["tools"]),
      l("div", ne, [
        s(_) ? s(v) ? (t(), a("p", ae, n(s(v)), 1)) : s(_) && !s(p).length ? (t(), a("p", oe, "No checks yet")) : g("", !0) : (t(), b(s(M), {
          key: 0,
          shape: "cards"
        })),
        y.value ? (t(), a("p", le, n(y.value), 1)) : g("", !0),
        (t(!0), a(w, null, O(s(R).shown.value, (e) => (t(), a("div", {
          key: e.id,
          role: "button",
          tabindex: "0",
          class: "card",
          "data-row": e.id,
          onClick: (u) => r.value = e.id,
          onKeydown: E((u) => r.value = e.id, ["enter"])
        }, [
          l("span", ue, [
            N(s(A), {
              name: "check",
              class: "card-icon"
            }),
            I(" Check " + n(e.id), 1),
            l("span", {
              class: B(["card-state", { failing: e.last_passed === !1, passing: e.last_passed === !0 }])
            }, n(e.last_passed === !0 ? "Passing" : e.last_passed === !1 ? "Failing" : "Not run"), 3)
          ]),
          l("span", de, n(e.title), 1),
          l("code", ie, n(e.command), 1),
          e.stopped ? g("", !0) : (t(), b(s(D), {
            key: 0,
            small: "",
            bordered: "",
            class: "card-run",
            "data-check-card-run": "",
            disabled: k.value.has(e.id),
            onClick: L((u) => $(e), ["stop"])
          }, {
            default: S(() => [
              I(n(k.value.has(e.id) ? "Running" : "Run"), 1)
            ]),
            _: 2
          }, 1032, ["disabled", "onClick"])),
          l("span", re, n(e.status) + " · " + n(e.interval_minutes ? `Every ${e.interval_minutes} minutes` : "Only when run by hand"), 1)
        ], 40, ce))), 128))
      ]),
      f.value ? (t(), b(se, {
        key: 0,
        row: f.value,
        running: k.value.has(f.value.id),
        onClose: h[0] || (h[0] = (e) => r.value = null),
        onRun: $
      }, null, 8, ["row", "running"])) : g("", !0)
    ], 64));
  }
}, _e = /* @__PURE__ */ V(ke, [["__scopeId", "data-v-9b535d76"]]);
export {
  _e as default
};
