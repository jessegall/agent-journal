/* @code-commandments-generated */
if (!document.getElementById("window-styles-c319624279cc")) { const style = document.createElement("style"); style.id = "window-styles-c319624279cc"; style.textContent = ".check-bar[data-v-643882e1]{display:block;overflow:hidden;height:3px;border-radius:2px;background:var(--hover)}.check-bar-fill[data-v-643882e1]{display:block;height:100%;border-radius:2px;background:var(--accent);transition:width .5s ease}.check-bar-fill.sliding[data-v-643882e1]{width:30%;animation:check-bar-slide-643882e1 1.2s ease-in-out infinite alternate}@keyframes check-bar-slide-643882e1{0%{transform:translate(0)}to{transform:translate(233%)}}.check-tools[data-v-847089c9]{display:flex;align-items:center;gap:8px;margin-bottom:10px}.check-space[data-v-847089c9]{flex:1}.check-command[data-v-847089c9]{display:block;margin-bottom:10px;overflow-wrap:anywhere;color:var(--text-2);font-size:12px}.check-output[data-v-847089c9]{overflow:auto;max-height:50vh;margin:0;padding:10px 12px;border-radius:8px;background:var(--raised);font-size:12px;white-space:pre-wrap}.check-runs[data-v-847089c9]{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}.check-run-row[data-v-847089c9]{display:flex;width:100%;padding:6px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:13px;cursor:pointer}.check-run-row[data-v-847089c9]:hover{background:var(--hover)}.check-verdict[data-v-847089c9]{color:var(--accent-text)}.check-verdict.failing[data-v-847089c9]{color:var(--danger)}.check-note[data-v-847089c9]{margin:0;color:var(--text-3)}.cards[data-v-93c655a9]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-93c655a9]{display:flex;flex-direction:column;min-width:0;gap:8px;min-height:110px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-93c655a9]:hover{border-color:var(--border-strong, var(--border))}.card-head[data-v-93c655a9]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-93c655a9]{width:14px;height:14px}.card-title[data-v-93c655a9]{font-weight:600}.card-run[data-v-93c655a9]{align-self:flex-start}.card-detail[data-v-93c655a9]{margin:0;overflow-wrap:anywhere;color:var(--text-2);font-size:12px;white-space:pre-wrap}.card-foot[data-v-93c655a9]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-93c655a9]{margin:0;color:var(--text-2)}.card-state[data-v-93c655a9]{margin-left:auto;color:var(--text-3)}.card-state.passing[data-v-93c655a9]{color:var(--accent-text)}.card-state.failing[data-v-93c655a9]{color:var(--danger)}\n"; document.head.appendChild(style); }
import { openBlock as t, createElementBlock as a, createElementVNode as o, normalizeStyle as L, normalizeClass as I, ref as b, computed as S, createBlock as _, unref as s, withCtx as x, createVNode as N, createTextVNode as B, toDisplayString as c, createCommentVNode as y, Fragment as R, renderList as V, withKeys as T, withModifiers as F } from "vue";
import { useWindow as K, useReadLine as P, Dialog as W, Segmented as q, Btn as D, TimeAgo as z, useRows as j, useListTools as A, WindowRoom as M, ListTools as G, Skeleton as H, Icon as J } from "@journal/window-kit";
const O = (n, p) => {
  const h = n.__vccOpts || n;
  for (const [m, g] of p)
    h[m] = g;
  return h;
}, Q = {
  class: "check-bar",
  "data-check-progress": ""
}, U = {
  __name: "CheckRunBar",
  props: { percent: { type: Number, required: !0 } },
  setup(n) {
    return (p, h) => (t(), a("span", Q, [
      o("span", {
        class: I(["check-bar-fill", { sliding: !n.percent }]),
        style: L(n.percent ? { width: `${n.percent}%` } : {})
      }, null, 6)
    ]));
  }
}, E = /* @__PURE__ */ O(U, [["__scopeId", "data-v-643882e1"]]), X = { class: "check-tools" }, Y = { class: "check-command" }, Z = {
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
  setup(n, { emit: p }) {
    const h = [
      { key: "output", label: "Output" },
      { key: "runs", label: "Runs" }
    ], m = n, g = p, w = K(), r = b("output"), $ = b(null), { value: i, failure: f, load: C } = P(() => `check runs ${m.row.id}`), l = S(() => {
      var u;
      return ((u = i.value) == null ? void 0 : u.rows) ?? [];
    }), v = S(() => {
      var u;
      return ((u = $.value) == null ? void 0 : u.output) ?? m.row.last_output;
    });
    function e(u) {
      $.value = u, r.value = "output";
    }
    return w.follow(["check.*"], C), C(), (u, d) => (t(), _(s(W), {
      title: `Check ${n.row.id}: ${n.row.title}`,
      wide: "",
      "data-check-dialog": "",
      onClose: d[2] || (d[2] = (k) => g("close"))
    }, {
      default: x(() => [
        o("div", X, [
          N(s(q), {
            options: h,
            value: r.value,
            onPick: d[0] || (d[0] = (k) => r.value = k)
          }, null, 8, ["value"]),
          d[3] || (d[3] = o("span", { class: "check-space" }, null, -1)),
          n.row.stopped ? y("", !0) : (t(), _(s(D), {
            key: 0,
            small: "",
            bordered: "",
            "data-check-run": "",
            disabled: n.running,
            onClick: d[1] || (d[1] = (k) => g("run", n.row))
          }, {
            default: x(() => [
              B(c(n.running ? "Running" : "Run"), 1)
            ]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        o("code", Y, c(n.row.command), 1),
        n.row.run_percent !== null && n.row.run_percent !== void 0 ? (t(), _(E, {
          key: 0,
          percent: n.row.run_percent
        }, null, 8, ["percent"])) : y("", !0),
        s(f) ? (t(), a("p", Z, c(s(f)), 1)) : y("", !0),
        r.value === "output" ? (t(), a(R, { key: 2 }, [
          v.value ? (t(), a("pre", ee, c(v.value), 1)) : (t(), a("p", te, "No output yet"))
        ], 64)) : (t(), a(R, { key: 3 }, [
          l.value.length ? (t(), a("ul", ne, [
            (t(!0), a(R, null, V(l.value, (k) => (t(), a("li", {
              key: k.run_at
            }, [
              o("button", {
                type: "button",
                class: "check-run-row",
                onClick: (ye) => e(k)
              }, [
                o("span", {
                  class: I(["check-verdict", { failing: !k.passed }])
                }, c(k.passed ? "Passed" : "Failed"), 3),
                d[4] || (d[4] = o("span", { class: "check-space" }, null, -1)),
                N(s(z), {
                  at: k.run_at
                }, null, 8, ["at"])
              ], 8, se)
            ]))), 128))
          ])) : (t(), a("p", ae, "No runs yet"))
        ], 64))
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, le = /* @__PURE__ */ O(ce, [["__scopeId", "data-v-847089c9"]]), oe = { class: "cards" }, ue = {
  key: 1,
  class: "cards-note"
}, de = {
  key: 2,
  class: "cards-note"
}, re = {
  key: 3,
  class: "cards-note",
  "data-check-refusal": ""
}, ie = ["data-row", "onClick", "onKeydown"], ke = { class: "card-head" }, pe = { class: "card-title" }, he = { class: "card-detail" }, ve = { class: "card-foot" }, _e = {
  __name: "CheckCards",
  setup(n) {
    const { rows: p, failure: h, loaded: m, context: g } = j("check list", ["check.*"]), w = A(p, { title: (l) => l.title, isOpen: (l) => !l.stopped }), r = b(null), $ = S(() => p.value.find((l) => l.id === r.value) || null), i = b(/* @__PURE__ */ new Set()), f = b("");
    async function C(l) {
      f.value = "", i.value = /* @__PURE__ */ new Set([...i.value, l.id]);
      const v = await g.run(["check", "run", String(l.id)]);
      i.value = new Set([...i.value].filter((e) => e !== l.id)), v.ok || (f.value = v.error);
    }
    return (l, v) => (t(), _(s(M), null, {
      default: x(() => [
        N(s(G), { tools: s(w) }, null, 8, ["tools"]),
        o("div", oe, [
          s(m) ? s(h) ? (t(), a("p", ue, c(s(h)), 1)) : s(m) && !s(p).length ? (t(), a("p", de, "No checks yet")) : y("", !0) : (t(), _(s(H), {
            key: 0,
            shape: "cards"
          })),
          f.value ? (t(), a("p", re, c(f.value), 1)) : y("", !0),
          (t(!0), a(R, null, V(s(w).shown.value, (e) => (t(), a("div", {
            key: e.id,
            role: "button",
            tabindex: "0",
            class: "card",
            "data-row": e.id,
            onClick: (u) => r.value = e.id,
            onKeydown: T((u) => r.value = e.id, ["enter"])
          }, [
            o("span", ke, [
              N(s(J), {
                name: "check",
                class: "card-icon"
              }),
              B(" Check " + c(e.id), 1),
              o("span", {
                class: I(["card-state", { failing: e.last_passed === !1, passing: e.last_passed === !0 }])
              }, c(e.last_passed === !0 ? "Passing" : e.last_passed === !1 ? "Failing" : "Not run"), 3)
            ]),
            o("span", pe, c(e.title), 1),
            o("code", he, c(e.command), 1),
            e.run_percent !== null && e.run_percent !== void 0 ? (t(), _(E, {
              key: 0,
              percent: e.run_percent
            }, null, 8, ["percent"])) : y("", !0),
            e.stopped ? y("", !0) : (t(), _(s(D), {
              key: 1,
              small: "",
              bordered: "",
              class: "card-run",
              "data-check-card-run": "",
              disabled: i.value.has(e.id),
              onClick: F((u) => C(e), ["stop"])
            }, {
              default: x(() => [
                B(c(i.value.has(e.id) ? "Running" : "Run"), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onClick"])),
            o("span", ve, c(e.status) + " · " + c(e.interval_minutes ? `Every ${e.interval_minutes} minutes` : "Only when run by hand"), 1)
          ], 40, ie))), 128))
        ]),
        $.value ? (t(), _(le, {
          key: 0,
          row: $.value,
          running: i.value.has($.value.id),
          onClose: v[0] || (v[0] = (e) => r.value = null),
          onRun: C
        }, null, 8, ["row", "running"])) : y("", !0)
      ]),
      _: 1
    }));
  }
}, ge = /* @__PURE__ */ O(_e, [["__scopeId", "data-v-93c655a9"]]);
export {
  ge as default
};
