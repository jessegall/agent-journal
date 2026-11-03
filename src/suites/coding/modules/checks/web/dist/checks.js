/* @code-commandments-generated */
if (!document.getElementById("window-styles-fc7846aab58f")) { const style = document.createElement("style"); style.id = "window-styles-fc7846aab58f"; style.textContent = ".check-bar[data-v-643882e1]{display:block;overflow:hidden;height:3px;border-radius:2px;background:var(--hover)}.check-bar-fill[data-v-643882e1]{display:block;height:100%;border-radius:2px;background:var(--accent);transition:width .5s ease}.check-bar-fill.sliding[data-v-643882e1]{width:30%;animation:check-bar-slide-643882e1 1.2s ease-in-out infinite alternate}@keyframes check-bar-slide-643882e1{0%{transform:translate(0)}to{transform:translate(233%)}}.check-tools[data-v-07a21e8d]{display:flex;align-items:center;gap:8px;margin-bottom:10px}.check-space[data-v-07a21e8d]{flex:1}.check-command[data-v-07a21e8d]{display:block;margin-bottom:10px;overflow-wrap:anywhere;color:var(--text-2);font-size:12px}.check-output[data-v-07a21e8d]{overflow:auto;max-height:50vh;margin:0;padding:10px 12px;border-radius:8px;background:var(--raised);font-size:12px;white-space:pre-wrap}.check-runs[data-v-07a21e8d]{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}.check-run-row[data-v-07a21e8d]{display:flex;width:100%;padding:6px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:13px;cursor:pointer}.check-run-row[data-v-07a21e8d]:hover{background:var(--hover)}.check-verdict[data-v-07a21e8d]{color:var(--accent-text)}.check-verdict.failing[data-v-07a21e8d]{color:var(--danger)}.check-note[data-v-07a21e8d]{margin:0;color:var(--text-3)}.cards[data-v-93c655a9]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-93c655a9]{display:flex;flex-direction:column;min-width:0;gap:8px;min-height:110px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-93c655a9]:hover{border-color:var(--border-strong, var(--border))}.card-head[data-v-93c655a9]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-93c655a9]{width:14px;height:14px}.card-title[data-v-93c655a9]{font-weight:600}.card-run[data-v-93c655a9]{align-self:flex-start}.card-detail[data-v-93c655a9]{margin:0;overflow-wrap:anywhere;color:var(--text-2);font-size:12px;white-space:pre-wrap}.card-foot[data-v-93c655a9]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-93c655a9]{margin:0;color:var(--text-2)}.card-state[data-v-93c655a9]{margin-left:auto;color:var(--text-3)}.card-state.passing[data-v-93c655a9]{color:var(--accent-text)}.card-state.failing[data-v-93c655a9]{color:var(--danger)}\n"; document.head.appendChild(style); }
import { openBlock as t, createElementBlock as a, createElementVNode as l, normalizeStyle as L, normalizeClass as I, ref as b, computed as N, createBlock as _, unref as s, withCtx as x, createVNode as S, createTextVNode as B, toDisplayString as c, createCommentVNode as y, Fragment as R, renderList as D, withKeys as F, withModifiers as K } from "vue";
import { useWindow as P, useReadLine as T, Dialog as W, Segmented as q, Btn as V, ago as z, useRows as j, useListTools as M, WindowRoom as A, ListTools as G, Skeleton as H, Icon as J } from "@journal/window-kit";
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
      l("span", {
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
}, se = ["onClick"], ae = ["title"], ce = {
  key: 1,
  class: "check-note"
}, le = {
  __name: "CheckDialog",
  props: { row: { type: Object, required: !0 }, running: Boolean },
  emits: ["close", "run"],
  setup(n, { emit: p }) {
    const h = [
      { key: "output", label: "Output" },
      { key: "runs", label: "Runs" }
    ], m = n, g = p, w = P(), r = b("output"), $ = b(null), { value: k, failure: f, load: C } = T(() => `check runs ${m.row.id}`), o = N(() => {
      var u;
      return ((u = k.value) == null ? void 0 : u.rows) ?? [];
    }), v = N(() => {
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
      onClose: d[2] || (d[2] = (i) => g("close"))
    }, {
      default: x(() => [
        l("div", X, [
          S(s(q), {
            options: h,
            value: r.value,
            onPick: d[0] || (d[0] = (i) => r.value = i)
          }, null, 8, ["value"]),
          d[3] || (d[3] = l("span", { class: "check-space" }, null, -1)),
          n.row.stopped ? y("", !0) : (t(), _(s(V), {
            key: 0,
            small: "",
            bordered: "",
            "data-check-run": "",
            disabled: n.running,
            onClick: d[1] || (d[1] = (i) => g("run", n.row))
          }, {
            default: x(() => [
              B(c(n.running ? "Running" : "Run"), 1)
            ]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        l("code", Y, c(n.row.command), 1),
        n.row.run_percent !== null && n.row.run_percent !== void 0 ? (t(), _(E, {
          key: 0,
          percent: n.row.run_percent
        }, null, 8, ["percent"])) : y("", !0),
        s(f) ? (t(), a("p", Z, c(s(f)), 1)) : y("", !0),
        r.value === "output" ? (t(), a(R, { key: 2 }, [
          v.value ? (t(), a("pre", ee, c(v.value), 1)) : (t(), a("p", te, "No output yet"))
        ], 64)) : (t(), a(R, { key: 3 }, [
          o.value.length ? (t(), a("ul", ne, [
            (t(!0), a(R, null, D(o.value, (i) => (t(), a("li", {
              key: i.run_at
            }, [
              l("button", {
                type: "button",
                class: "check-run-row",
                onClick: (me) => e(i)
              }, [
                l("span", {
                  class: I(["check-verdict", { failing: !i.passed }])
                }, c(i.passed ? "Passed" : "Failed"), 3),
                d[4] || (d[4] = l("span", { class: "check-space" }, null, -1)),
                l("time", {
                  title: i.run_at
                }, c(s(z)(Date.parse(i.run_at) / 1e3)), 9, ae)
              ], 8, se)
            ]))), 128))
          ])) : (t(), a("p", ce, "No runs yet"))
        ], 64))
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, oe = /* @__PURE__ */ O(le, [["__scopeId", "data-v-07a21e8d"]]), ue = { class: "cards" }, de = {
  key: 1,
  class: "cards-note"
}, ie = {
  key: 2,
  class: "cards-note"
}, re = {
  key: 3,
  class: "cards-note",
  "data-check-refusal": ""
}, ke = ["data-row", "onClick", "onKeydown"], pe = { class: "card-head" }, he = { class: "card-title" }, ve = { class: "card-detail" }, _e = { class: "card-foot" }, ye = {
  __name: "CheckCards",
  setup(n) {
    const { rows: p, failure: h, loaded: m, context: g } = j("check list", ["check.*"]), w = M(p, { title: (o) => o.title, isOpen: (o) => !o.stopped }), r = b(null), $ = N(() => p.value.find((o) => o.id === r.value) || null), k = b(/* @__PURE__ */ new Set()), f = b("");
    async function C(o) {
      f.value = "", k.value = /* @__PURE__ */ new Set([...k.value, o.id]);
      const v = await g.run(["check", "run", String(o.id)]);
      k.value = new Set([...k.value].filter((e) => e !== o.id)), v.ok || (f.value = v.error);
    }
    return (o, v) => (t(), _(s(A), null, {
      default: x(() => [
        S(s(G), { tools: s(w) }, null, 8, ["tools"]),
        l("div", ue, [
          s(m) ? s(h) ? (t(), a("p", de, c(s(h)), 1)) : s(m) && !s(p).length ? (t(), a("p", ie, "No checks yet")) : y("", !0) : (t(), _(s(H), {
            key: 0,
            shape: "cards"
          })),
          f.value ? (t(), a("p", re, c(f.value), 1)) : y("", !0),
          (t(!0), a(R, null, D(s(w).shown.value, (e) => (t(), a("div", {
            key: e.id,
            role: "button",
            tabindex: "0",
            class: "card",
            "data-row": e.id,
            onClick: (u) => r.value = e.id,
            onKeydown: F((u) => r.value = e.id, ["enter"])
          }, [
            l("span", pe, [
              S(s(J), {
                name: "check",
                class: "card-icon"
              }),
              B(" Check " + c(e.id), 1),
              l("span", {
                class: I(["card-state", { failing: e.last_passed === !1, passing: e.last_passed === !0 }])
              }, c(e.last_passed === !0 ? "Passing" : e.last_passed === !1 ? "Failing" : "Not run"), 3)
            ]),
            l("span", he, c(e.title), 1),
            l("code", ve, c(e.command), 1),
            e.run_percent !== null && e.run_percent !== void 0 ? (t(), _(E, {
              key: 0,
              percent: e.run_percent
            }, null, 8, ["percent"])) : y("", !0),
            e.stopped ? y("", !0) : (t(), _(s(V), {
              key: 1,
              small: "",
              bordered: "",
              class: "card-run",
              "data-check-card-run": "",
              disabled: k.value.has(e.id),
              onClick: K((u) => C(e), ["stop"])
            }, {
              default: x(() => [
                B(c(k.value.has(e.id) ? "Running" : "Run"), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onClick"])),
            l("span", _e, c(e.status) + " · " + c(e.interval_minutes ? `Every ${e.interval_minutes} minutes` : "Only when run by hand"), 1)
          ], 40, ke))), 128))
        ]),
        $.value ? (t(), _(oe, {
          key: 0,
          row: $.value,
          running: k.value.has($.value.id),
          onClose: v[0] || (v[0] = (e) => r.value = null),
          onRun: C
        }, null, 8, ["row", "running"])) : y("", !0)
      ]),
      _: 1
    }));
  }
}, $e = /* @__PURE__ */ O(ye, [["__scopeId", "data-v-93c655a9"]]);
export {
  $e as default
};
