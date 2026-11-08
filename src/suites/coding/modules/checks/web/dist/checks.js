/* @code-commandments-generated */
if (!document.getElementById("window-styles-2f1c3c15c308")) { const style = document.createElement("style"); style.id = "window-styles-2f1c3c15c308"; style.textContent = ".check-bar[data-v-88da7980]{display:block;overflow:hidden;height:3px;border-radius:2px;background:var(--hover)}.check-bar-fill[data-v-88da7980]{display:block;height:100%;border-radius:2px;background:var(--accent);transition:width .5s ease}.check-bar-fill.sliding[data-v-88da7980]{width:30%;animation:check-bar-slide-88da7980 1.2s ease-in-out infinite alternate}@keyframes check-bar-slide-88da7980{0%{transform:translate(0)}to{transform:translate(233%)}}.check-tools[data-v-f0c704f4]{display:flex;align-items:center;gap:8px;margin-bottom:10px}.check-space[data-v-f0c704f4]{flex:1}.check-command[data-v-f0c704f4]{display:block;margin-bottom:10px;overflow-wrap:anywhere;color:var(--text-2);font-size:12px}.check-output[data-v-f0c704f4]{overflow:auto;max-height:50vh;margin:0;padding:10px 12px;border-radius:8px;background:var(--raised);font-size:12px;white-space:pre-wrap}.check-runs[data-v-f0c704f4]{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}.check-run-row[data-v-f0c704f4]{display:flex;width:100%;padding:6px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:13px;cursor:pointer}.check-run-row[data-v-f0c704f4]:hover{background:var(--hover)}.check-verdict[data-v-f0c704f4]{color:var(--accent-text)}.check-verdict.failing[data-v-f0c704f4]{color:var(--danger)}.check-note[data-v-f0c704f4]{margin:0;color:var(--text-3)}.cards[data-v-3a2a6d4c]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-3a2a6d4c]{display:flex;flex-direction:column;min-width:0;gap:8px;min-height:110px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-3a2a6d4c]:hover{border-color:var(--border-strong, var(--border))}.card-head[data-v-3a2a6d4c]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-3a2a6d4c]{width:14px;height:14px}.card-title[data-v-3a2a6d4c]{font-weight:600}.card-run[data-v-3a2a6d4c]{align-self:flex-start}.card-detail[data-v-3a2a6d4c]{margin:0;overflow-wrap:anywhere;color:var(--text-2);font-size:12px;white-space:pre-wrap}.card-foot[data-v-3a2a6d4c]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-3a2a6d4c]{margin:0;color:var(--text-2)}.card-state[data-v-3a2a6d4c]{margin-left:auto;color:var(--text-3)}.card-state.passing[data-v-3a2a6d4c]{color:var(--accent-text)}.card-state.failing[data-v-3a2a6d4c]{color:var(--danger)}\n"; document.head.appendChild(style); }
import { openBlock as t, createElementBlock as a, createElementVNode as u, normalizeStyle as P, normalizeClass as O, ref as w, computed as E, watch as W, onUnmounted as q, createBlock as _, unref as n, withCtx as R, createVNode as B, createTextVNode as N, toDisplayString as l, createCommentVNode as g, Fragment as x, renderList as T, withKeys as z, withModifiers as D } from "vue";
import { useWindow as K, Dialog as F, Segmented as j, Btn as I, TimeAgo as A, useListTools as M, WindowRoom as U, ListTools as G, Skeleton as H, Icon as J } from "@journal/window-kit";
const V = (s, y) => {
  const k = s.__vccOpts || s;
  for (const [f, m] of y)
    k[f] = m;
  return k;
}, Q = {
  class: "check-bar",
  "data-check-progress": ""
}, X = {
  __name: "CheckRunBar",
  props: { percent: { type: Number, required: !0 } },
  setup(s) {
    return (y, k) => (t(), a("span", Q, [
      u("span", {
        class: O(["check-bar-fill", { sliding: !s.percent }]),
        style: P(s.percent ? { width: `${s.percent}%` } : {})
      }, null, 6)
    ]));
  }
}, L = /* @__PURE__ */ V(X, [["__scopeId", "data-v-88da7980"]]), Y = { class: "check-tools" }, Z = { class: "check-command" }, ee = {
  key: 1,
  class: "check-note"
}, te = {
  key: 0,
  class: "check-output",
  "data-check-output": ""
}, ne = {
  key: 1,
  class: "check-note"
}, se = {
  key: 0,
  class: "check-runs",
  "data-check-runs": ""
}, ae = ["onClick"], ce = {
  key: 1,
  class: "check-note"
}, le = {
  __name: "CheckDialog",
  props: { row: { type: Object, required: !0 }, running: Boolean },
  emits: ["close", "run"],
  setup(s, { emit: y }) {
    const k = [
      { key: "output", label: "Output" },
      { key: "runs", label: "Runs" }
    ], f = s, m = y, C = K(), r = w("output"), $ = w(null), d = `runs.${f.row.id}`, { rows: p, failure: S } = C.props[d], b = E(() => {
      var h;
      return ((h = $.value) == null ? void 0 : h.output) ?? f.row.last_output;
    });
    function c(h) {
      $.value = h, r.value = "output";
    }
    const o = () => {
      if (r.value === "runs") return C.reload(d);
    };
    W(r, o);
    const e = C.follow(["check.*"], o);
    return q(() => e == null ? void 0 : e()), (h, i) => (t(), _(n(F), {
      title: `Check ${s.row.id}: ${s.row.title}`,
      wide: "",
      "data-check-dialog": "",
      onClose: i[2] || (i[2] = (v) => m("close"))
    }, {
      default: R(() => [
        u("div", Y, [
          B(n(j), {
            options: k,
            value: r.value,
            onPick: i[0] || (i[0] = (v) => r.value = v)
          }, null, 8, ["value"]),
          i[3] || (i[3] = u("span", { class: "check-space" }, null, -1)),
          s.row.stopped ? g("", !0) : (t(), _(n(I), {
            key: 0,
            small: "",
            bordered: "",
            "data-check-run": "",
            disabled: s.running,
            onClick: i[1] || (i[1] = (v) => m("run", s.row))
          }, {
            default: R(() => [
              N(l(s.running ? "Running" : "Run"), 1)
            ]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        u("code", Z, l(s.row.command), 1),
        s.row.run_percent !== null && s.row.run_percent !== void 0 ? (t(), _(L, {
          key: 0,
          percent: s.row.run_percent
        }, null, 8, ["percent"])) : g("", !0),
        n(S) ? (t(), a("p", ee, l(n(S)), 1)) : g("", !0),
        r.value === "output" ? (t(), a(x, { key: 2 }, [
          b.value ? (t(), a("pre", te, l(b.value), 1)) : (t(), a("p", ne, "No output yet"))
        ], 64)) : (t(), a(x, { key: 3 }, [
          n(p).length ? (t(), a("ul", se, [
            (t(!0), a(x, null, T(n(p), (v) => (t(), a("li", {
              key: v.run_at
            }, [
              u("button", {
                type: "button",
                class: "check-run-row",
                onClick: (fe) => c(v)
              }, [
                u("span", {
                  class: O(["check-verdict", { failing: !v.passed }])
                }, l(v.passed ? "Passed" : "Failed"), 3),
                i[4] || (i[4] = u("span", { class: "check-space" }, null, -1)),
                B(n(A), {
                  at: v.run_at
                }, null, 8, ["at"])
              ], 8, ae)
            ]))), 128))
          ])) : (t(), a("p", ce, "No runs yet"))
        ], 64))
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, oe = /* @__PURE__ */ V(le, [["__scopeId", "data-v-f0c704f4"]]), ue = { class: "cards" }, re = {
  key: 1,
  class: "cards-note"
}, de = {
  key: 2,
  class: "cards-note"
}, ie = {
  key: 3,
  class: "cards-note",
  "data-check-refusal": ""
}, ke = ["data-row", "onClick", "onKeydown"], pe = { class: "card-head" }, he = { class: "card-title" }, ve = { class: "card-detail" }, _e = { class: "card-foot" }, ye = {
  __name: "CheckCards",
  setup(s) {
    const y = K(), { rows: k, failure: f, loaded: m } = y.props.checks, C = M(k, { title: (c) => c.title, isOpen: (c) => !c.stopped }), r = w(null), $ = E(() => k.value.find((c) => c.id === r.value) || null), d = w(/* @__PURE__ */ new Set()), p = w("");
    async function S(c) {
      p.value = "";
      const o = await y.run(["check", "start", String(c.id)]);
      o.ok || (p.value = o.error);
    }
    async function b(c) {
      p.value = "", d.value = /* @__PURE__ */ new Set([...d.value, c.id]);
      const o = await y.run(["check", "run", String(c.id)]);
      d.value = new Set([...d.value].filter((e) => e !== c.id)), o.ok || (p.value = o.error);
    }
    return (c, o) => (t(), _(n(U), null, {
      default: R(() => [
        B(n(G), { tools: n(C) }, null, 8, ["tools"]),
        u("div", ue, [
          n(m) ? n(f) ? (t(), a("p", re, l(n(f)), 1)) : n(m) && !n(k).length ? (t(), a("p", de, "No checks yet")) : g("", !0) : (t(), _(n(H), {
            key: 0,
            shape: "cards"
          })),
          p.value ? (t(), a("p", ie, l(p.value), 1)) : g("", !0),
          (t(!0), a(x, null, T(n(C).shown.value, (e) => (t(), a("div", {
            key: e.id,
            role: "button",
            tabindex: "0",
            class: "card",
            "data-row": e.id,
            onClick: (h) => r.value = e.id,
            onKeydown: z((h) => r.value = e.id, ["enter"])
          }, [
            u("span", pe, [
              B(n(J), {
                name: "check",
                class: "card-icon"
              }),
              N(" Check " + l(e.id), 1),
              u("span", {
                class: O(["card-state", { failing: e.last_passed === !1, passing: e.last_passed === !0 }])
              }, l(e.last_passed === !0 ? "Passing" : e.last_passed === !1 ? "Failing" : "Not run"), 3)
            ]),
            u("span", he, l(e.title), 1),
            u("code", ve, l(e.command), 1),
            e.run_percent !== null && e.run_percent !== void 0 ? (t(), _(L, {
              key: 0,
              percent: e.run_percent
            }, null, 8, ["percent"])) : g("", !0),
            e.stopped ? (t(), _(n(I), {
              key: 2,
              small: "",
              bordered: "",
              class: "card-run",
              "data-check-card-start": "",
              onClick: D((h) => S(e), ["stop"])
            }, {
              default: R(() => [...o[1] || (o[1] = [
                N("Start", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])) : (t(), _(n(I), {
              key: 1,
              small: "",
              bordered: "",
              class: "card-run",
              "data-check-card-run": "",
              disabled: d.value.has(e.id),
              onClick: D((h) => b(e), ["stop"])
            }, {
              default: R(() => [
                N(l(d.value.has(e.id) ? "Running" : "Run"), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onClick"])),
            u("span", _e, l(e.status) + " · " + l(e.interval_minutes ? `Every ${e.interval_minutes} minutes` : "Only when run by hand"), 1)
          ], 40, ke))), 128))
        ]),
        $.value ? (t(), _(oe, {
          key: 0,
          row: $.value,
          running: d.value.has($.value.id),
          onClose: o[0] || (o[0] = (e) => r.value = null),
          onRun: b
        }, null, 8, ["row", "running"])) : g("", !0)
      ]),
      _: 1
    }));
  }
}, Ce = /* @__PURE__ */ V(ye, [["__scopeId", "data-v-3a2a6d4c"]]);
export {
  Ce as default
};
