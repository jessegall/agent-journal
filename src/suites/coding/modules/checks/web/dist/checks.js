if (!document.getElementById("window-styles-4018aa034efe")) { const style = document.createElement("style"); style.id = "window-styles-4018aa034efe"; style.textContent = ".check-bar[data-v-643882e1]{display:block;overflow:hidden;height:3px;border-radius:2px;background:var(--hover)}.check-bar-fill[data-v-643882e1]{display:block;height:100%;border-radius:2px;background:var(--accent);transition:width .5s ease}.check-bar-fill.sliding[data-v-643882e1]{width:30%;animation:check-bar-slide-643882e1 1.2s ease-in-out infinite alternate}@keyframes check-bar-slide-643882e1{0%{transform:translate(0)}to{transform:translate(233%)}}.check-tools[data-v-a4a837dc]{display:flex;align-items:center;gap:8px;margin-bottom:10px}.check-space[data-v-a4a837dc]{flex:1}.check-command[data-v-a4a837dc]{display:block;margin-bottom:10px;overflow-wrap:anywhere;color:var(--text-2);font-size:12px}.check-output[data-v-a4a837dc]{overflow:auto;max-height:50vh;margin:0;padding:10px 12px;border-radius:8px;background:var(--raised);font-size:12px;white-space:pre-wrap}.check-runs[data-v-a4a837dc]{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}.check-run-row[data-v-a4a837dc]{display:flex;width:100%;padding:6px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:13px;cursor:pointer}.check-run-row[data-v-a4a837dc]:hover{background:var(--hover)}.check-verdict[data-v-a4a837dc]{color:var(--accent-text)}.check-verdict.failing[data-v-a4a837dc]{color:var(--danger)}.check-note[data-v-a4a837dc]{margin:0;color:var(--text-3)}.note[data-v-d6603ccf]{margin:0;color:var(--text-3);font-size:12.5px}.rhythm[data-v-d6603ccf]{color:var(--text-3);font-size:12px;white-space:nowrap}\n"; document.head.appendChild(style); }
import { openBlock as t, createElementBlock as o, createElementVNode as m, normalizeStyle as z, normalizeClass as E, ref as R, computed as I, watch as T, onUnmounted as W, createBlock as y, unref as a, withCtx as i, createVNode as B, createTextVNode as P, toDisplayString as p, createCommentVNode as C, Fragment as x, renderList as j } from "vue";
import { useWindow as A, Dialog as L, Segmented as M, Btn as V, TimeAgo as U, CardPage as G, ActionsMenu as H, Skeleton as J, copying as K } from "@journal/window-kit";
const D = (n, k) => {
  const h = n.__vccOpts || n;
  for (const [f, w] of k)
    h[f] = w;
  return h;
}, Q = {
  class: "check-bar",
  "data-check-progress": ""
}, X = {
  __name: "CheckRunBar",
  props: { percent: { type: Number, required: !0 } },
  setup(n) {
    return (k, h) => (t(), o("span", Q, [
      m("span", {
        class: E(["check-bar-fill", { sliding: !n.percent }]),
        style: z(n.percent ? { width: `${n.percent}%` } : {})
      }, null, 6)
    ]));
  }
}, F = /* @__PURE__ */ D(X, [["__scopeId", "data-v-643882e1"]]), Y = { class: "check-tools" }, Z = { class: "check-command" }, ee = {
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
}, ae = ["onClick"], oe = {
  key: 1,
  class: "check-note"
}, ce = {
  __name: "CheckDialog",
  props: { row: { type: Object, required: !0 }, running: Boolean },
  emits: ["close", "run"],
  setup(n, { emit: k }) {
    const h = [
      { key: "output", label: "Output" },
      { key: "runs", label: "Runs" }
    ], f = n, w = k, _ = A(), u = R("output"), r = R(null), d = `runs.${f.row.id}`, { rows: b, failure: S } = _.props[d], N = I(() => {
      var v;
      return ((v = r.value) == null ? void 0 : v.output) ?? f.row.last_output;
    });
    function O(v) {
      r.value = v, u.value = "output";
    }
    const $ = () => {
      if (u.value === "runs") return _.reload(d);
    };
    T(u, $);
    const g = _.follow(["check.*"], $);
    return W(() => g == null ? void 0 : g()), (v, l) => (t(), y(a(L), {
      padded: "",
      title: `Check ${n.row.id}: ${n.row.title}`,
      wide: "",
      "data-check-dialog": "",
      onClose: l[2] || (l[2] = (e) => w("close"))
    }, {
      default: i(() => [
        m("div", Y, [
          B(a(M), {
            options: h,
            value: u.value,
            onPick: l[0] || (l[0] = (e) => u.value = e)
          }, null, 8, ["value"]),
          l[3] || (l[3] = m("span", { class: "check-space" }, null, -1)),
          n.row.stopped ? C("", !0) : (t(), y(a(V), {
            key: 0,
            small: "",
            bordered: "",
            "data-check-run": "",
            disabled: n.running,
            onClick: l[1] || (l[1] = (e) => w("run", n.row))
          }, {
            default: i(() => [
              P(p(n.running ? "Running" : "Run"), 1)
            ]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        m("code", Z, p(n.row.command), 1),
        n.row.run_percent !== null && n.row.run_percent !== void 0 ? (t(), y(F, {
          key: 0,
          percent: n.row.run_percent
        }, null, 8, ["percent"])) : C("", !0),
        a(S) ? (t(), o("p", ee, p(a(S)), 1)) : C("", !0),
        u.value === "output" ? (t(), o(x, { key: 2 }, [
          N.value ? (t(), o("pre", te, p(N.value), 1)) : (t(), o("p", ne, "No output yet"))
        ], 64)) : (t(), o(x, { key: 3 }, [
          a(b).length ? (t(), o("ul", se, [
            (t(!0), o(x, null, j(a(b), (e) => (t(), o("li", {
              key: e.run_at
            }, [
              m("button", {
                type: "button",
                class: "check-run-row",
                onClick: (c) => O(e)
              }, [
                m("span", {
                  class: E(["check-verdict", { failing: !e.passed }])
                }, p(e.passed ? "Passed" : "Failed"), 3),
                l[4] || (l[4] = m("span", { class: "check-space" }, null, -1)),
                B(a(U), {
                  at: e.run_at
                }, null, 8, ["at"])
              ], 8, ae)
            ]))), 128))
          ])) : (t(), o("p", oe, "No runs yet"))
        ], 64))
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, le = /* @__PURE__ */ D(ce, [["__scopeId", "data-v-a4a837dc"]]), ue = {
  key: 1,
  class: "note",
  role: "alert"
}, re = {
  key: 2,
  class: "note"
}, de = {
  class: "rhythm",
  "data-check-rhythm": ""
}, ie = {
  key: 1,
  class: "note",
  role: "alert",
  "data-check-refusal": ""
}, pe = {
  __name: "CheckCards",
  setup(n) {
    const k = A(), { rows: h, failure: f, loaded: w } = k.props.checks, _ = R(null), u = I(() => h.value.find((e) => e.id === _.value) || null), r = R(/* @__PURE__ */ new Set()), d = R(""), b = (e) => e.status === "running" ? "Running" : e.last_passed === !0 ? "Passing" : e.last_passed === !1 ? "Failing" : "Not run", S = I(() => h.value.map((e) => ({
      id: e.id,
      title: e.title,
      icon: "check",
      state: b(e),
      line: e.command,
      fault: e.last_passed === !1 ? e.last_output : "",
      status: b(e),
      row: e
    }))), N = [{ key: "status", label: "State", options: ["Passing", "Failing", "Running", "Not run"].map((e) => [e, e]), get: (e) => e.status }], O = (e) => e.interval_minutes ? `Every ${e.interval_minutes} minutes` : "Only when run by hand";
    async function $(e) {
      d.value = "";
      const c = await k.run(["check", "start", String(e.id)]);
      c.ok || (d.value = c.error);
    }
    async function g(e) {
      d.value = "", r.value = /* @__PURE__ */ new Set([...r.value, e.id]);
      const c = await k.run(["check", "run", String(e.id)]);
      r.value = new Set([...r.value].filter((s) => s !== e.id)), c.ok || (d.value = c.error);
    }
    const v = (e) => [
      { label: "Open", group: "open", run: () => _.value = e.id },
      e.row.stopped ? { label: "Start", group: "own", run: () => $(e.row) } : { label: "Run now", group: "own", run: () => g(e.row) },
      { label: "Copy command", group: "copy", run: ({ say: c }) => K(e.row.command, "the command", c) }
    ], l = (e) => ({ head: e.title, items: v(e) });
    return (e, c) => (t(), o(x, null, [
      B(a(G), {
        title: "Checks",
        items: S.value,
        fields: N,
        place: l,
        "empty-title": "No checks yet",
        "data-checks": ""
      }, {
        empty: i(() => [
          a(w) ? a(f) ? (t(), o("p", ue, p(a(f)), 1)) : (t(), o("p", re, "A check runs a command and says if it passed.")) : (t(), y(a(J), {
            key: 0,
            shape: "cards"
          }))
        ]),
        corner: i(({ item: s }) => [
          m("span", de, p(O(s.row)), 1)
        ]),
        card: i(({ item: s }) => [
          s.row.run_percent !== null && s.row.run_percent !== void 0 ? (t(), y(F, {
            key: 0,
            percent: s.row.run_percent
          }, null, 8, ["percent"])) : C("", !0),
          d.value ? (t(), o("p", ie, p(d.value), 1)) : C("", !0)
        ]),
        foot: i(({ item: s }) => [
          s.row.stopped ? (t(), y(a(V), {
            key: 1,
            small: "",
            bordered: "",
            "data-check-card-start": "",
            onClick: (q) => $(s.row)
          }, {
            default: i(() => [...c[1] || (c[1] = [
              P("Start", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])) : (t(), y(a(V), {
            key: 0,
            small: "",
            bordered: "",
            "data-check-card-run": "",
            disabled: r.value.has(s.id),
            onClick: (q) => g(s.row)
          }, {
            default: i(() => [
              P(p(r.value.has(s.id) ? "Running" : "Run"), 1)
            ]),
            _: 2
          }, 1032, ["disabled", "onClick"]))
        ]),
        "card-actions": i(({ item: s }) => [
          B(a(H), {
            items: v(s),
            head: s.title
          }, null, 8, ["items", "head"])
        ]),
        _: 1
      }, 8, ["items"]),
      u.value ? (t(), y(le, {
        key: 0,
        row: u.value,
        running: r.value.has(u.value.id),
        onClose: c[0] || (c[0] = (s) => _.value = null),
        onRun: g
      }, null, 8, ["row", "running"])) : C("", !0)
    ], 64));
  }
}, ve = /* @__PURE__ */ D(pe, [["__scopeId", "data-v-d6603ccf"]]);
export {
  ve as default
};
