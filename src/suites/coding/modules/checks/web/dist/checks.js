/* @code-commandments-generated */
if (!document.getElementById("window-styles-53dcb77e1ea6")) { const style = document.createElement("style"); style.id = "window-styles-53dcb77e1ea6"; style.textContent = ".check-bar[data-v-643882e1]{display:block;overflow:hidden;height:3px;border-radius:2px;background:var(--hover)}.check-bar-fill[data-v-643882e1]{display:block;height:100%;border-radius:2px;background:var(--accent);transition:width .5s ease}.check-bar-fill.sliding[data-v-643882e1]{width:30%;animation:check-bar-slide-643882e1 1.2s ease-in-out infinite alternate}@keyframes check-bar-slide-643882e1{0%{transform:translate(0)}to{transform:translate(233%)}}.check-tools[data-v-847089c9]{display:flex;align-items:center;gap:8px;margin-bottom:10px}.check-space[data-v-847089c9]{flex:1}.check-command[data-v-847089c9]{display:block;margin-bottom:10px;overflow-wrap:anywhere;color:var(--text-2);font-size:12px}.check-output[data-v-847089c9]{overflow:auto;max-height:50vh;margin:0;padding:10px 12px;border-radius:8px;background:var(--raised);font-size:12px;white-space:pre-wrap}.check-runs[data-v-847089c9]{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}.check-run-row[data-v-847089c9]{display:flex;width:100%;padding:6px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:13px;cursor:pointer}.check-run-row[data-v-847089c9]:hover{background:var(--hover)}.check-verdict[data-v-847089c9]{color:var(--accent-text)}.check-verdict.failing[data-v-847089c9]{color:var(--danger)}.check-note[data-v-847089c9]{margin:0;color:var(--text-3)}.cards[data-v-53950603]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-53950603]{display:flex;flex-direction:column;min-width:0;gap:8px;min-height:110px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-53950603]:hover{border-color:var(--border-strong, var(--border))}.card-head[data-v-53950603]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-53950603]{width:14px;height:14px}.card-title[data-v-53950603]{font-weight:600}.card-run[data-v-53950603]{align-self:flex-start}.card-detail[data-v-53950603]{margin:0;overflow-wrap:anywhere;color:var(--text-2);font-size:12px;white-space:pre-wrap}.card-foot[data-v-53950603]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-53950603]{margin:0;color:var(--text-2)}.card-state[data-v-53950603]{margin-left:auto;color:var(--text-3)}.card-state.passing[data-v-53950603]{color:var(--accent-text)}.card-state.failing[data-v-53950603]{color:var(--danger)}\n"; document.head.appendChild(style); }
import { openBlock as t, createElementBlock as c, createElementVNode as u, normalizeStyle as T, normalizeClass as O, ref as $, computed as B, createBlock as h, unref as s, withCtx as b, createVNode as N, createTextVNode as S, toDisplayString as o, createCommentVNode as f, Fragment as x, renderList as E, withKeys as F, withModifiers as D } from "vue";
import { useWindow as K, useReadLine as P, Dialog as W, Segmented as q, Btn as I, TimeAgo as z, useRows as j, useListTools as A, WindowRoom as M, ListTools as G, Skeleton as H, Icon as J } from "@journal/window-kit";
const V = (n, v) => {
  const _ = n.__vccOpts || n;
  for (const [y, m] of v)
    _[y] = m;
  return _;
}, Q = {
  class: "check-bar",
  "data-check-progress": ""
}, U = {
  __name: "CheckRunBar",
  props: { percent: { type: Number, required: !0 } },
  setup(n) {
    return (v, _) => (t(), c("span", Q, [
      u("span", {
        class: O(["check-bar-fill", { sliding: !n.percent }]),
        style: T(n.percent ? { width: `${n.percent}%` } : {})
      }, null, 6)
    ]));
  }
}, L = /* @__PURE__ */ V(U, [["__scopeId", "data-v-643882e1"]]), X = { class: "check-tools" }, Y = { class: "check-command" }, Z = {
  key: 1,
  class: "check-note"
}, ee = {
  key: 0,
  class: "check-output",
  "data-check-output": ""
}, te = {
  key: 1,
  class: "check-note"
}, ne = {
  key: 0,
  class: "check-runs",
  "data-check-runs": ""
}, se = ["onClick"], ae = {
  key: 1,
  class: "check-note"
}, ce = {
  __name: "CheckDialog",
  props: { row: { type: Object, required: !0 }, running: Boolean },
  emits: ["close", "run"],
  setup(n, { emit: v }) {
    const _ = [
      { key: "output", label: "Output" },
      { key: "runs", label: "Runs" }
    ], y = n, m = v, w = K(), d = $("output"), g = $(null), { value: i, failure: k, load: R } = P(() => `check runs ${y.row.id}`), C = B(() => {
      var e;
      return ((e = i.value) == null ? void 0 : e.rows) ?? [];
    }), a = B(() => {
      var e;
      return ((e = g.value) == null ? void 0 : e.output) ?? y.row.last_output;
    });
    function r(e) {
      g.value = e, d.value = "output";
    }
    return w.follow(["check.*"], R), R(), (e, l) => (t(), h(s(W), {
      title: `Check ${n.row.id}: ${n.row.title}`,
      wide: "",
      "data-check-dialog": "",
      onClose: l[2] || (l[2] = (p) => m("close"))
    }, {
      default: b(() => [
        u("div", X, [
          N(s(q), {
            options: _,
            value: d.value,
            onPick: l[0] || (l[0] = (p) => d.value = p)
          }, null, 8, ["value"]),
          l[3] || (l[3] = u("span", { class: "check-space" }, null, -1)),
          n.row.stopped ? f("", !0) : (t(), h(s(I), {
            key: 0,
            small: "",
            bordered: "",
            "data-check-run": "",
            disabled: n.running,
            onClick: l[1] || (l[1] = (p) => m("run", n.row))
          }, {
            default: b(() => [
              S(o(n.running ? "Running" : "Run"), 1)
            ]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        u("code", Y, o(n.row.command), 1),
        n.row.run_percent !== null && n.row.run_percent !== void 0 ? (t(), h(L, {
          key: 0,
          percent: n.row.run_percent
        }, null, 8, ["percent"])) : f("", !0),
        s(k) ? (t(), c("p", Z, o(s(k)), 1)) : f("", !0),
        d.value === "output" ? (t(), c(x, { key: 2 }, [
          a.value ? (t(), c("pre", ee, o(a.value), 1)) : (t(), c("p", te, "No output yet"))
        ], 64)) : (t(), c(x, { key: 3 }, [
          C.value.length ? (t(), c("ul", ne, [
            (t(!0), c(x, null, E(C.value, (p) => (t(), c("li", {
              key: p.run_at
            }, [
              u("button", {
                type: "button",
                class: "check-run-row",
                onClick: (ye) => r(p)
              }, [
                u("span", {
                  class: O(["check-verdict", { failing: !p.passed }])
                }, o(p.passed ? "Passed" : "Failed"), 3),
                l[4] || (l[4] = u("span", { class: "check-space" }, null, -1)),
                N(s(z), {
                  at: p.run_at
                }, null, 8, ["at"])
              ], 8, se)
            ]))), 128))
          ])) : (t(), c("p", ae, "No runs yet"))
        ], 64))
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, le = /* @__PURE__ */ V(ce, [["__scopeId", "data-v-847089c9"]]), oe = { class: "cards" }, ue = {
  key: 1,
  class: "cards-note"
}, re = {
  key: 2,
  class: "cards-note"
}, de = {
  key: 3,
  class: "cards-note",
  "data-check-refusal": ""
}, ie = ["data-row", "onClick", "onKeydown"], ke = { class: "card-head" }, pe = { class: "card-title" }, he = { class: "card-detail" }, ve = { class: "card-foot" }, _e = {
  __name: "CheckCards",
  setup(n) {
    const { rows: v, failure: _, loaded: y, context: m } = j("check list", ["check.*"]), w = A(v, { title: (a) => a.title, isOpen: (a) => !a.stopped }), d = $(null), g = B(() => v.value.find((a) => a.id === d.value) || null), i = $(/* @__PURE__ */ new Set()), k = $("");
    async function R(a) {
      k.value = "";
      const r = await m.run(["check", "start", String(a.id)]);
      r.ok || (k.value = r.error);
    }
    async function C(a) {
      k.value = "", i.value = /* @__PURE__ */ new Set([...i.value, a.id]);
      const r = await m.run(["check", "run", String(a.id)]);
      i.value = new Set([...i.value].filter((e) => e !== a.id)), r.ok || (k.value = r.error);
    }
    return (a, r) => (t(), h(s(M), null, {
      default: b(() => [
        N(s(G), { tools: s(w) }, null, 8, ["tools"]),
        u("div", oe, [
          s(y) ? s(_) ? (t(), c("p", ue, o(s(_)), 1)) : s(y) && !s(v).length ? (t(), c("p", re, "No checks yet")) : f("", !0) : (t(), h(s(H), {
            key: 0,
            shape: "cards"
          })),
          k.value ? (t(), c("p", de, o(k.value), 1)) : f("", !0),
          (t(!0), c(x, null, E(s(w).shown.value, (e) => (t(), c("div", {
            key: e.id,
            role: "button",
            tabindex: "0",
            class: "card",
            "data-row": e.id,
            onClick: (l) => d.value = e.id,
            onKeydown: F((l) => d.value = e.id, ["enter"])
          }, [
            u("span", ke, [
              N(s(J), {
                name: "check",
                class: "card-icon"
              }),
              S(" Check " + o(e.id), 1),
              u("span", {
                class: O(["card-state", { failing: e.last_passed === !1, passing: e.last_passed === !0 }])
              }, o(e.last_passed === !0 ? "Passing" : e.last_passed === !1 ? "Failing" : "Not run"), 3)
            ]),
            u("span", pe, o(e.title), 1),
            u("code", he, o(e.command), 1),
            e.run_percent !== null && e.run_percent !== void 0 ? (t(), h(L, {
              key: 0,
              percent: e.run_percent
            }, null, 8, ["percent"])) : f("", !0),
            e.stopped ? (t(), h(s(I), {
              key: 2,
              small: "",
              bordered: "",
              class: "card-run",
              "data-check-card-start": "",
              onClick: D((l) => R(e), ["stop"])
            }, {
              default: b(() => [...r[1] || (r[1] = [
                S("Start", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])) : (t(), h(s(I), {
              key: 1,
              small: "",
              bordered: "",
              class: "card-run",
              "data-check-card-run": "",
              disabled: i.value.has(e.id),
              onClick: D((l) => C(e), ["stop"])
            }, {
              default: b(() => [
                S(o(i.value.has(e.id) ? "Running" : "Run"), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onClick"])),
            u("span", ve, o(e.status) + " · " + o(e.interval_minutes ? `Every ${e.interval_minutes} minutes` : "Only when run by hand"), 1)
          ], 40, ie))), 128))
        ]),
        g.value ? (t(), h(le, {
          key: 0,
          row: g.value,
          running: i.value.has(g.value.id),
          onClose: r[0] || (r[0] = (e) => d.value = null),
          onRun: C
        }, null, 8, ["row", "running"])) : f("", !0)
      ]),
      _: 1
    }));
  }
}, ge = /* @__PURE__ */ V(_e, [["__scopeId", "data-v-53950603"]]);
export {
  ge as default
};
