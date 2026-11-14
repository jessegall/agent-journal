if (!document.getElementById("window-styles-0620abcc0989")) { const style = document.createElement("style"); style.id = "window-styles-0620abcc0989"; style.textContent = ".check-bar[data-v-643882e1]{display:block;overflow:hidden;height:3px;border-radius:2px;background:var(--hover)}.check-bar-fill[data-v-643882e1]{display:block;height:100%;border-radius:2px;background:var(--accent);transition:width .5s ease}.check-bar-fill.sliding[data-v-643882e1]{width:30%;animation:check-bar-slide-643882e1 1.2s ease-in-out infinite alternate}@keyframes check-bar-slide-643882e1{0%{transform:translate(0)}to{transform:translate(233%)}}.check-tools[data-v-a4a837dc]{display:flex;align-items:center;gap:8px;margin-bottom:10px}.check-space[data-v-a4a837dc]{flex:1}.check-command[data-v-a4a837dc]{display:block;margin-bottom:10px;overflow-wrap:anywhere;color:var(--text-2);font-size:12px}.check-output[data-v-a4a837dc]{overflow:auto;max-height:50vh;margin:0;padding:10px 12px;border-radius:8px;background:var(--raised);font-size:12px;white-space:pre-wrap}.check-runs[data-v-a4a837dc]{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}.check-run-row[data-v-a4a837dc]{display:flex;width:100%;padding:6px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:13px;cursor:pointer}.check-run-row[data-v-a4a837dc]:hover{background:var(--hover)}.check-verdict[data-v-a4a837dc]{color:var(--accent-text)}.check-verdict.failing[data-v-a4a837dc]{color:var(--danger)}.check-note[data-v-a4a837dc]{margin:0;color:var(--text-3)}.note[data-v-341d3654]{margin:0;color:var(--text-3);font-size:12.5px}.rhythm[data-v-341d3654]{color:var(--text-3);font-size:12px;white-space:nowrap}\n"; document.head.appendChild(style); }
import { openBlock as n, createElementBlock as l, createElementVNode as _, normalizeStyle as T, normalizeClass as F, ref as N, computed as P, watch as U, onUnmounted as z, createBlock as h, unref as s, withCtx as d, createVNode as S, createTextVNode as B, toDisplayString as w, createCommentVNode as C, Fragment as I, renderList as M } from "vue";
import { useWindow as V, Dialog as W, Segmented as J, Btn as q, TimeAgo as G, CreateDialog as H, CardPage as K, ActionsMenu as Q, Skeleton as X, copying as Y } from "@journal/window-kit";
const E = (t, k) => {
  const p = t.__vccOpts || t;
  for (const [v, g] of k)
    p[v] = g;
  return p;
}, Z = {
  class: "check-bar",
  "data-check-progress": ""
}, ee = {
  __name: "CheckRunBar",
  props: { percent: { type: Number, required: !0 } },
  setup(t) {
    return (k, p) => (n(), l("span", Z, [
      _("span", {
        class: F(["check-bar-fill", { sliding: !t.percent }]),
        style: T(t.percent ? { width: `${t.percent}%` } : {})
      }, null, 6)
    ]));
  }
}, j = /* @__PURE__ */ E(ee, [["__scopeId", "data-v-643882e1"]]), te = { class: "check-tools" }, ne = { class: "check-command" }, se = {
  key: 1,
  class: "check-note"
}, ae = {
  key: 0,
  class: "check-output",
  "data-check-output": ""
}, oe = {
  key: 1,
  class: "check-note"
}, le = {
  key: 0,
  class: "check-runs",
  "data-check-runs": ""
}, ce = ["onClick"], re = {
  key: 1,
  class: "check-note"
}, ue = {
  __name: "CheckDialog",
  props: { row: { type: Object, required: !0 }, running: Boolean },
  emits: ["close", "run"],
  setup(t, { emit: k }) {
    const p = [
      { key: "output", label: "Output" },
      { key: "runs", label: "Runs" }
    ], v = t, g = k, m = V(), c = N("output"), u = N(null), y = `runs.${v.row.id}`, { rows: b, failure: R } = m.props[y], O = P(() => {
      var f;
      return ((f = u.value) == null ? void 0 : f.output) ?? v.row.last_output;
    });
    function D(f) {
      u.value = f, c.value = "output";
    }
    const x = () => {
      if (c.value === "runs") return m.reload(y);
    };
    U(c, x);
    const $ = m.follow(["check.*"], x);
    return z(() => $ == null ? void 0 : $()), (f, r) => (n(), h(s(W), {
      padded: "",
      title: `Check ${t.row.id}: ${t.row.title}`,
      wide: "",
      "data-check-dialog": "",
      onClose: r[2] || (r[2] = (i) => g("close"))
    }, {
      default: d(() => [
        _("div", te, [
          S(s(J), {
            options: p,
            value: c.value,
            onPick: r[0] || (r[0] = (i) => c.value = i)
          }, null, 8, ["value"]),
          r[3] || (r[3] = _("span", { class: "check-space" }, null, -1)),
          t.row.stopped ? C("", !0) : (n(), h(s(q), {
            key: 0,
            small: "",
            bordered: "",
            "data-check-run": "",
            disabled: t.running,
            onClick: r[1] || (r[1] = (i) => g("run", t.row))
          }, {
            default: d(() => [
              B(w(t.running ? "Running" : "Run"), 1)
            ]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        _("code", ne, w(t.row.command), 1),
        t.row.run_percent !== null && t.row.run_percent !== void 0 ? (n(), h(j, {
          key: 0,
          percent: t.row.run_percent
        }, null, 8, ["percent"])) : C("", !0),
        s(R) ? (n(), l("p", se, w(s(R)), 1)) : C("", !0),
        c.value === "output" ? (n(), l(I, { key: 2 }, [
          O.value ? (n(), l("pre", ae, w(O.value), 1)) : (n(), l("p", oe, "No output yet"))
        ], 64)) : (n(), l(I, { key: 3 }, [
          s(b).length ? (n(), l("ul", le, [
            (n(!0), l(I, null, M(s(b), (i) => (n(), l("li", {
              key: i.run_at
            }, [
              _("button", {
                type: "button",
                class: "check-run-row",
                onClick: (e) => D(i)
              }, [
                _("span", {
                  class: F(["check-verdict", { failing: !i.passed }])
                }, w(i.passed ? "Passed" : "Failed"), 3),
                r[4] || (r[4] = _("span", { class: "check-space" }, null, -1)),
                S(s(G), {
                  at: i.run_at
                }, null, 8, ["at"])
              ], 8, ce)
            ]))), 128))
          ])) : (n(), l("p", re, "No runs yet"))
        ], 64))
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, ie = /* @__PURE__ */ E(ue, [["__scopeId", "data-v-a4a837dc"]]), de = (t) => /\s/.test(t) ? JSON.stringify(t) : t, ke = [
  { key: "title", label: "Title", required: !0, placeholder: "Unit tests" },
  { key: "command", label: "Command", required: !0, placeholder: "pytest tests/unit" },
  { key: "every", label: "Run every, in minutes", kind: "number", help: "Leave blank to run it only by hand.", placeholder: "30" }
], pe = (t) => Number(t.every || 0) < 0 ? { every: "Use a number of minutes, or leave it blank." } : {}, A = (t) => ["check", "make", t.title.trim() || "…", "--command", t.command.trim() || "…", ...Number(t.every) > 0 ? ["--every", String(Number(t.every))] : []], me = (t) => A(t), he = (t) => `journal ${A(t).map(de).join(" ")}`, ve = {
  __name: "NewCheck",
  emits: ["close"],
  setup(t, { emit: k }) {
    const p = k, v = V(), g = (m) => v.run(me(m));
    return (m, c) => (n(), h(s(H), {
      title: "New check",
      submit: "Make the check",
      fields: s(ke),
      command: s(he),
      check: s(pe),
      run: g,
      onClose: c[0] || (c[0] = (u) => p("close"))
    }, null, 8, ["fields", "command", "check"]));
  }
}, ye = {
  key: 1,
  class: "note",
  role: "alert"
}, fe = {
  key: 2,
  class: "note"
}, we = {
  class: "rhythm",
  "data-check-rhythm": ""
}, ge = {
  key: 1,
  class: "note",
  role: "alert",
  "data-check-refusal": ""
}, _e = {
  __name: "CheckCards",
  setup(t) {
    const k = V(), { rows: p, failure: v, loaded: g } = k.props.checks, m = N(null), c = P(() => p.value.find((e) => e.id === m.value) || null), u = N(/* @__PURE__ */ new Set()), y = N(""), b = N(!1), R = (e) => e.status === "running" ? "Running" : e.last_passed === !0 ? "Passing" : e.last_passed === !1 ? "Failing" : "Not run", O = P(() => p.value.map((e) => ({
      id: e.id,
      title: e.title,
      icon: "check",
      state: R(e),
      line: e.command,
      fault: e.last_passed === !1 ? e.last_output : "",
      status: R(e),
      row: e
    }))), D = [{ key: "status", label: "State", options: ["Passing", "Failing", "Running", "Not run"].map((e) => [e, e]), get: (e) => e.status }], x = (e) => e.interval_minutes ? `Every ${e.interval_minutes} minutes` : "Only when run by hand";
    async function $(e) {
      y.value = "";
      const o = await k.run(["check", "start", String(e.id)]);
      o.ok || (y.value = o.error);
    }
    async function f(e) {
      y.value = "", u.value = /* @__PURE__ */ new Set([...u.value, e.id]);
      const o = await k.run(["check", "run", String(e.id)]);
      u.value = new Set([...u.value].filter((a) => a !== e.id)), o.ok || (y.value = o.error);
    }
    const r = (e) => [
      { label: "Open", group: "open", run: () => m.value = e.id },
      e.row.stopped ? { label: "Start", group: "own", run: () => $(e.row) } : { label: "Run now", group: "own", run: () => f(e.row) },
      { label: "Copy command", group: "copy", run: ({ say: o }) => Y(e.row.command, "the command", o) }
    ], i = (e) => ({ head: e.title, items: r(e) });
    return (e, o) => (n(), l(I, null, [
      S(s(K), {
        title: "Checks",
        items: O.value,
        fields: D,
        place: i,
        "empty-title": "No checks yet",
        "data-checks": ""
      }, {
        primary: d(() => [
          S(s(q), {
            small: "",
            variant: "primary",
            "data-check-new": "",
            onClick: o[0] || (o[0] = (a) => b.value = !0)
          }, {
            default: d(() => [...o[3] || (o[3] = [
              B("New check", -1)
            ])]),
            _: 1
          })
        ]),
        empty: d(() => [
          s(g) ? s(v) ? (n(), l("p", ye, w(s(v)), 1)) : (n(), l("p", fe, "A check runs a command and says if it passed.")) : (n(), h(s(X), {
            key: 0,
            shape: "cards"
          }))
        ]),
        corner: d(({ item: a }) => [
          _("span", we, w(x(a.row)), 1)
        ]),
        card: d(({ item: a }) => [
          a.row.run_percent !== null && a.row.run_percent !== void 0 ? (n(), h(j, {
            key: 0,
            percent: a.row.run_percent
          }, null, 8, ["percent"])) : C("", !0),
          y.value ? (n(), l("p", ge, w(y.value), 1)) : C("", !0)
        ]),
        foot: d(({ item: a }) => [
          a.row.stopped ? (n(), h(s(q), {
            key: 1,
            small: "",
            bordered: "",
            "data-check-card-start": "",
            onClick: (L) => $(a.row)
          }, {
            default: d(() => [...o[4] || (o[4] = [
              B("Start", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])) : (n(), h(s(q), {
            key: 0,
            small: "",
            bordered: "",
            "data-check-card-run": "",
            disabled: u.value.has(a.id),
            onClick: (L) => f(a.row)
          }, {
            default: d(() => [
              B(w(u.value.has(a.id) ? "Running" : "Run"), 1)
            ]),
            _: 2
          }, 1032, ["disabled", "onClick"]))
        ]),
        "card-actions": d(({ item: a }) => [
          S(s(Q), {
            items: r(a),
            head: a.title
          }, null, 8, ["items", "head"])
        ]),
        _: 1
      }, 8, ["items"]),
      b.value ? (n(), h(ve, {
        key: 0,
        onClose: o[1] || (o[1] = (a) => b.value = !1)
      })) : C("", !0),
      c.value ? (n(), h(ie, {
        key: 1,
        row: c.value,
        running: u.value.has(c.value.id),
        onClose: o[2] || (o[2] = (a) => m.value = null),
        onRun: f
      }, null, 8, ["row", "running"])) : C("", !0)
    ], 64));
  }
}, $e = /* @__PURE__ */ E(_e, [["__scopeId", "data-v-341d3654"]]);
export {
  $e as default
};
