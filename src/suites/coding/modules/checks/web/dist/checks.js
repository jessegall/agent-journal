/* @code-commandments-generated */
if (!document.getElementById("window-styles-f4c48e2efc18")) { const style = document.createElement("style"); style.id = "window-styles-f4c48e2efc18"; style.textContent = ".check-bar[data-v-643882e1]{display:block;overflow:hidden;height:3px;border-radius:2px;background:var(--hover)}.check-bar-fill[data-v-643882e1]{display:block;height:100%;border-radius:2px;background:var(--accent);transition:width .5s ease}.check-bar-fill.sliding[data-v-643882e1]{width:30%;animation:check-bar-slide-643882e1 1.2s ease-in-out infinite alternate}@keyframes check-bar-slide-643882e1{0%{transform:translate(0)}to{transform:translate(233%)}}.check-tools[data-v-07a21e8d]{display:flex;align-items:center;gap:8px;margin-bottom:10px}.check-space[data-v-07a21e8d]{flex:1}.check-command[data-v-07a21e8d]{display:block;margin-bottom:10px;overflow-wrap:anywhere;color:var(--text-2);font-size:12px}.check-output[data-v-07a21e8d]{overflow:auto;max-height:50vh;margin:0;padding:10px 12px;border-radius:8px;background:var(--raised);font-size:12px;white-space:pre-wrap}.check-runs[data-v-07a21e8d]{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}.check-run-row[data-v-07a21e8d]{display:flex;width:100%;padding:6px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:13px;cursor:pointer}.check-run-row[data-v-07a21e8d]:hover{background:var(--hover)}.check-verdict[data-v-07a21e8d]{color:var(--accent-text)}.check-verdict.failing[data-v-07a21e8d]{color:var(--danger)}.check-note[data-v-07a21e8d]{margin:0;color:var(--text-3)}.cards[data-v-e541cb99]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-e541cb99]{display:flex;flex-direction:column;min-width:0;gap:8px;min-height:110px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-e541cb99]:hover{border-color:var(--border-strong, var(--border))}.card-head[data-v-e541cb99]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-e541cb99]{width:14px;height:14px}.card-title[data-v-e541cb99]{font-weight:600}.card-run[data-v-e541cb99]{align-self:flex-start}.card-detail[data-v-e541cb99]{margin:0;overflow-wrap:anywhere;color:var(--text-2);font-size:12px;white-space:pre-wrap}.card-foot[data-v-e541cb99]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-e541cb99]{margin:0;color:var(--text-2)}.card-state[data-v-e541cb99]{margin-left:auto;color:var(--text-3)}.card-state.passing[data-v-e541cb99]{color:var(--accent-text)}.card-state.failing[data-v-e541cb99]{color:var(--danger)}\n"; document.head.appendChild(style); }
import { openBlock as t, createElementBlock as a, createElementVNode as l, normalizeStyle as L, normalizeClass as I, ref as b, computed as x, createBlock as f, unref as s, withCtx as S, createVNode as N, createTextVNode as B, toDisplayString as c, createCommentVNode as _, Fragment as w, renderList as D, withKeys as F, withModifiers as K } from "vue";
import { useWindow as P, useReadLine as T, Dialog as q, Segmented as z, Btn as V, ago as W, useRows as j, useListTools as M, ListTools as A, Skeleton as G, Icon as H } from "@journal/window-kit";
const O = (n, h) => {
  const p = n.__vccOpts || n;
  for (const [y, g] of h)
    p[y] = g;
  return p;
}, J = {
  class: "check-bar",
  "data-check-progress": ""
}, Q = {
  __name: "CheckRunBar",
  props: { percent: { type: Number, required: !0 } },
  setup(n) {
    return (h, p) => (t(), a("span", J, [
      l("span", {
        class: I(["check-bar-fill", { sliding: !n.percent }]),
        style: L(n.percent ? { width: `${n.percent}%` } : {})
      }, null, 6)
    ]));
  }
}, E = /* @__PURE__ */ O(Q, [["__scopeId", "data-v-643882e1"]]), U = { class: "check-tools" }, X = { class: "check-command" }, Y = {
  key: 1,
  class: "check-note"
}, Z = {
  key: 0,
  class: "check-output",
  "data-check-output": ""
}, ee = {
  key: 1,
  class: "check-note"
}, te = {
  key: 0,
  class: "check-runs",
  "data-check-runs": ""
}, ne = ["onClick"], se = ["title"], ae = {
  key: 1,
  class: "check-note"
}, ce = {
  __name: "CheckDialog",
  props: { row: { type: Object, required: !0 }, running: Boolean },
  emits: ["close", "run"],
  setup(n, { emit: h }) {
    const p = [
      { key: "output", label: "Output" },
      { key: "runs", label: "Runs" }
    ], y = n, g = h, R = P(), i = b("output"), $ = b(null), { value: k, failure: m, load: C } = T(() => `check runs ${y.row.id}`), o = x(() => {
      var u;
      return ((u = k.value) == null ? void 0 : u.rows) ?? [];
    }), v = x(() => {
      var u;
      return ((u = $.value) == null ? void 0 : u.output) ?? y.row.last_output;
    });
    function e(u) {
      $.value = u, i.value = "output";
    }
    return R.follow(["check.*"], C), C(), (u, d) => (t(), f(s(q), {
      title: `Check ${n.row.id}: ${n.row.title}`,
      wide: "",
      "data-check-dialog": "",
      onClose: d[2] || (d[2] = (r) => g("close"))
    }, {
      default: S(() => [
        l("div", U, [
          N(s(z), {
            options: p,
            value: i.value,
            onPick: d[0] || (d[0] = (r) => i.value = r)
          }, null, 8, ["value"]),
          d[3] || (d[3] = l("span", { class: "check-space" }, null, -1)),
          n.row.stopped ? _("", !0) : (t(), f(s(V), {
            key: 0,
            small: "",
            bordered: "",
            "data-check-run": "",
            disabled: n.running,
            onClick: d[1] || (d[1] = (r) => g("run", n.row))
          }, {
            default: S(() => [
              B(c(n.running ? "Running" : "Run"), 1)
            ]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        l("code", X, c(n.row.command), 1),
        n.row.run_percent !== null && n.row.run_percent !== void 0 ? (t(), f(E, {
          key: 0,
          percent: n.row.run_percent
        }, null, 8, ["percent"])) : _("", !0),
        s(m) ? (t(), a("p", Y, c(s(m)), 1)) : _("", !0),
        i.value === "output" ? (t(), a(w, { key: 2 }, [
          v.value ? (t(), a("pre", Z, c(v.value), 1)) : (t(), a("p", ee, "No output yet"))
        ], 64)) : (t(), a(w, { key: 3 }, [
          o.value.length ? (t(), a("ul", te, [
            (t(!0), a(w, null, D(o.value, (r) => (t(), a("li", {
              key: r.run_at
            }, [
              l("button", {
                type: "button",
                class: "check-run-row",
                onClick: (ye) => e(r)
              }, [
                l("span", {
                  class: I(["check-verdict", { failing: !r.passed }])
                }, c(r.passed ? "Passed" : "Failed"), 3),
                d[4] || (d[4] = l("span", { class: "check-space" }, null, -1)),
                l("time", {
                  title: r.run_at
                }, c(s(W)(Date.parse(r.run_at) / 1e3)), 9, se)
              ], 8, ne)
            ]))), 128))
          ])) : (t(), a("p", ae, "No runs yet"))
        ], 64))
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, le = /* @__PURE__ */ O(ce, [["__scopeId", "data-v-07a21e8d"]]), oe = { class: "cards" }, ue = {
  key: 1,
  class: "cards-note"
}, de = {
  key: 2,
  class: "cards-note"
}, re = {
  key: 3,
  class: "cards-note",
  "data-check-refusal": ""
}, ie = ["data-row", "onClick", "onKeydown"], ke = { class: "card-head" }, he = { class: "card-title" }, pe = { class: "card-detail" }, ve = { class: "card-foot" }, _e = {
  __name: "CheckCards",
  setup(n) {
    const { rows: h, failure: p, loaded: y, context: g } = j("check list", ["check.*"]), R = M(h, { title: (o) => o.title, isOpen: (o) => !o.stopped }), i = b(null), $ = x(() => h.value.find((o) => o.id === i.value) || null), k = b(/* @__PURE__ */ new Set()), m = b("");
    async function C(o) {
      m.value = "", k.value = /* @__PURE__ */ new Set([...k.value, o.id]);
      const v = await g.run(["check", "run", String(o.id)]);
      k.value = new Set([...k.value].filter((e) => e !== o.id)), v.ok || (m.value = v.error);
    }
    return (o, v) => (t(), a(w, null, [
      N(s(A), {
        tools: s(R),
        placeholder: "Search the checks"
      }, null, 8, ["tools"]),
      l("div", oe, [
        s(y) ? s(p) ? (t(), a("p", ue, c(s(p)), 1)) : s(y) && !s(h).length ? (t(), a("p", de, "No checks yet")) : _("", !0) : (t(), f(s(G), {
          key: 0,
          shape: "cards"
        })),
        m.value ? (t(), a("p", re, c(m.value), 1)) : _("", !0),
        (t(!0), a(w, null, D(s(R).shown.value, (e) => (t(), a("div", {
          key: e.id,
          role: "button",
          tabindex: "0",
          class: "card",
          "data-row": e.id,
          onClick: (u) => i.value = e.id,
          onKeydown: F((u) => i.value = e.id, ["enter"])
        }, [
          l("span", ke, [
            N(s(H), {
              name: "check",
              class: "card-icon"
            }),
            B(" Check " + c(e.id), 1),
            l("span", {
              class: I(["card-state", { failing: e.last_passed === !1, passing: e.last_passed === !0 }])
            }, c(e.last_passed === !0 ? "Passing" : e.last_passed === !1 ? "Failing" : "Not run"), 3)
          ]),
          l("span", he, c(e.title), 1),
          l("code", pe, c(e.command), 1),
          e.run_percent !== null && e.run_percent !== void 0 ? (t(), f(E, {
            key: 0,
            percent: e.run_percent
          }, null, 8, ["percent"])) : _("", !0),
          e.stopped ? _("", !0) : (t(), f(s(V), {
            key: 1,
            small: "",
            bordered: "",
            class: "card-run",
            "data-check-card-run": "",
            disabled: k.value.has(e.id),
            onClick: K((u) => C(e), ["stop"])
          }, {
            default: S(() => [
              B(c(k.value.has(e.id) ? "Running" : "Run"), 1)
            ]),
            _: 2
          }, 1032, ["disabled", "onClick"])),
          l("span", ve, c(e.status) + " · " + c(e.interval_minutes ? `Every ${e.interval_minutes} minutes` : "Only when run by hand"), 1)
        ], 40, ie))), 128))
      ]),
      $.value ? (t(), f(le, {
        key: 0,
        row: $.value,
        running: k.value.has($.value.id),
        onClose: v[0] || (v[0] = (e) => i.value = null),
        onRun: C
      }, null, 8, ["row", "running"])) : _("", !0)
    ], 64));
  }
}, ge = /* @__PURE__ */ O(_e, [["__scopeId", "data-v-e541cb99"]]);
export {
  ge as default
};
