if (!document.getElementById("window-styles-8f3804aaa944")) { const style = document.createElement("style"); style.id = "window-styles-8f3804aaa944"; style.textContent = ".check-bar[data-v-643882e1]{display:block;overflow:hidden;height:3px;border-radius:2px;background:var(--hover)}.check-bar-fill[data-v-643882e1]{display:block;height:100%;border-radius:2px;background:var(--accent);transition:width .5s ease}.check-bar-fill.sliding[data-v-643882e1]{width:30%;animation:check-bar-slide-643882e1 1.2s ease-in-out infinite alternate}@keyframes check-bar-slide-643882e1{0%{transform:translate(0)}to{transform:translate(233%)}}.check-tools[data-v-34e974c9]{display:flex;align-items:center;gap:8px;margin-bottom:10px}.check-space[data-v-34e974c9]{flex:1}.check-command[data-v-34e974c9]{display:block;margin-bottom:10px;overflow-wrap:anywhere;color:var(--text-2);font-size:12px}.check-output[data-v-34e974c9]{border-radius:8px;background:#111418;color:#d7dce2}.check-output[data-v-34e974c9] .output-lines{max-height:60vh;margin:0;padding:10px 12px;font:12px/1.5 var(--mono, ui-monospace, monospace);white-space:pre-wrap;overflow-wrap:anywhere}.check-runs[data-v-34e974c9]{display:flex;flex-direction:column;gap:2px;margin:0;padding:0;list-style:none}.check-run-row[data-v-34e974c9]{display:flex;width:100%;padding:6px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:13px;cursor:pointer}.check-run-row[data-v-34e974c9]:hover{background:var(--hover)}.check-verdict[data-v-34e974c9]{color:var(--accent-text)}.check-verdict.failing[data-v-34e974c9]{color:var(--danger)}.check-note[data-v-34e974c9]{margin:0;color:var(--text-3)}.note[data-v-359e907c]{margin:0;color:var(--text-3);font-size:12.5px}.rhythm[data-v-359e907c]{color:var(--text-3);font-size:12px;white-space:nowrap}\n"; document.head.appendChild(style); }
import { openBlock as t, createElementBlock as r, createElementVNode as w, normalizeStyle as T, normalizeClass as E, ref as $, computed as I, watch as U, onUnmounted as z, createBlock as m, unref as s, withCtx as i, createVNode as N, createTextVNode as x, toDisplayString as g, createCommentVNode as _, Fragment as D, renderList as M } from "vue";
import { useWindow as L, Dialog as W, Segmented as J, Btn as B, OutputLines as G, TimeAgo as H, CreateDialog as K, CardPage as Q, ActionsMenu as X, Skeleton as Y, copying as Z } from "@journal/window-kit";
const P = (n, d) => {
  const k = n.__vccOpts || n;
  for (const [h, y] of d)
    k[h] = y;
  return k;
}, ee = {
  class: "check-bar",
  "data-check-progress": ""
}, ne = {
  __name: "CheckRunBar",
  props: { percent: { type: Number, required: !0 } },
  setup(n) {
    return (d, k) => (t(), r("span", ee, [
      w("span", {
        class: E(["check-bar-fill", { sliding: !n.percent }]),
        style: T(n.percent ? { width: `${n.percent}%` } : {})
      }, null, 6)
    ]));
  }
}, F = /* @__PURE__ */ P(ne, [["__scopeId", "data-v-643882e1"]]), te = { class: "check-tools" }, se = { class: "check-command" }, ae = {
  key: 1,
  class: "check-note"
}, oe = {
  key: 2,
  class: "check-output",
  "data-check-output": ""
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
  setup(n, { emit: d }) {
    const k = [
      { key: "output", label: "Output" },
      { key: "runs", label: "Runs" }
    ], h = n, y = d, p = L(), l = $("output"), u = $(null), v = `runs.${h.row.id}`, { rows: b, failure: R } = p.props[v], O = I(() => {
      var f;
      return ((f = u.value) == null ? void 0 : f.output) ?? h.row.last_output;
    }), V = I(() => O.value ? O.value.split(`
`) : []);
    function q(f) {
      u.value = f, l.value = "output";
    }
    const S = () => {
      if (l.value === "runs") return p.reload(v);
    };
    U(l, S);
    const C = p.follow(["check.*"], S);
    return z(() => C == null ? void 0 : C()), (f, c) => (t(), m(s(W), {
      padded: "",
      title: `Check ${n.row.id}: ${n.row.title}`,
      wide: "",
      "data-check-dialog": "",
      onClose: c[2] || (c[2] = (e) => y("close"))
    }, {
      default: i(() => [
        w("div", te, [
          N(s(J), {
            options: k,
            value: l.value,
            onPick: c[0] || (c[0] = (e) => l.value = e)
          }, null, 8, ["value"]),
          c[3] || (c[3] = w("span", { class: "check-space" }, null, -1)),
          n.row.stopped ? _("", !0) : (t(), m(s(B), {
            key: 0,
            small: "",
            bordered: "",
            "data-check-run": "",
            disabled: n.running,
            onClick: c[1] || (c[1] = (e) => y("run", n.row))
          }, {
            default: i(() => [
              x(g(n.running ? "Running" : "Run"), 1)
            ]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        w("code", se, g(n.row.command), 1),
        n.row.run_percent !== null && n.row.run_percent !== void 0 ? (t(), m(F, {
          key: 0,
          percent: n.row.run_percent
        }, null, 8, ["percent"])) : _("", !0),
        s(R) ? (t(), r("p", ae, g(s(R)), 1)) : _("", !0),
        l.value === "output" ? (t(), r("div", oe, [
          N(s(G), { lines: V.value }, null, 8, ["lines"])
        ])) : (t(), r(D, { key: 3 }, [
          s(b).length ? (t(), r("ul", le, [
            (t(!0), r(D, null, M(s(b), (e) => (t(), r("li", {
              key: e.run_at
            }, [
              w("button", {
                type: "button",
                class: "check-run-row",
                onClick: (a) => q(e)
              }, [
                w("span", {
                  class: E(["check-verdict", { failing: !e.passed }])
                }, g(e.passed ? "Passed" : "Failed"), 3),
                c[4] || (c[4] = w("span", { class: "check-space" }, null, -1)),
                N(s(H), {
                  at: e.run_at
                }, null, 8, ["at"])
              ], 8, ce)
            ]))), 128))
          ])) : (t(), r("p", re, "No runs yet"))
        ], 64))
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, ie = /* @__PURE__ */ P(ue, [["__scopeId", "data-v-34e974c9"]]), de = (n) => /\s/.test(n) ? JSON.stringify(n) : n, ke = [
  { key: "title", label: "Title", required: !0, placeholder: "Unit tests" },
  { key: "command", label: "Command", required: !0, placeholder: "pytest tests/unit" },
  { key: "every", label: "Run every, in minutes", kind: "number", help: "Leave blank to run it only by hand.", placeholder: "30" }
], pe = (n) => Number(n.every || 0) < 0 ? { every: "Use a number of minutes, or leave it blank." } : {}, j = (n) => ["check", "make", n.title.trim() || "…", "--command", n.command.trim() || "…", ...Number(n.every) > 0 ? ["--every", String(Number(n.every))] : []], me = (n) => j(n), he = (n) => `journal ${j(n).map(de).join(" ")}`, ve = {
  __name: "NewCheck",
  emits: ["close"],
  setup(n, { emit: d }) {
    const k = d, h = L(), y = (p) => h.run(me(p));
    return (p, l) => (t(), m(s(K), {
      title: "New check",
      submit: "Make the check",
      fields: s(ke),
      command: s(he),
      check: s(pe),
      run: y,
      onClose: l[0] || (l[0] = (u) => k("close"))
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
}, Ce = {
  __name: "CheckCards",
  setup(n) {
    const d = L(), { rows: k, failure: h, loaded: y } = d.props.checks, p = $(null), l = I(() => k.value.find((e) => e.id === p.value) || null), u = $(/* @__PURE__ */ new Set()), v = $(""), b = $(!1), R = (e) => e.status === "running" ? "Running" : e.last_passed === !0 ? "Passing" : e.last_passed === !1 ? "Failing" : "Not run", O = I(() => k.value.map((e) => ({
      id: e.id,
      title: e.title,
      icon: "check",
      state: R(e),
      line: e.command,
      status: R(e),
      row: e
    }))), V = [{ key: "status", label: "State", options: ["Passing", "Failing", "Running", "Not run"].map((e) => [e, e]), get: (e) => e.status }], q = (e) => e.interval_minutes ? `Every ${e.interval_minutes} minutes` : "Only when run by hand";
    async function S(e) {
      v.value = "";
      const a = await d.run(["check", "start", String(e.id)]);
      a.ok || (v.value = a.error);
    }
    async function C(e) {
      v.value = "", u.value = /* @__PURE__ */ new Set([...u.value, e.id]);
      const a = await d.run(["check", "run", String(e.id)]);
      u.value = new Set([...u.value].filter((o) => o !== e.id)), a.ok || (v.value = a.error);
    }
    const f = (e) => [
      { label: "View output", group: "open", run: () => p.value = e.id },
      e.row.stopped ? { label: "Start", group: "own", run: () => S(e.row) } : { label: "Run now", group: "own", run: () => C(e.row) },
      { label: "Copy command", group: "copy", run: ({ say: a }) => Z(e.row.command, "the command", a) }
    ], c = (e) => ({ head: e.title, items: f(e) });
    return (e, a) => (t(), r(D, null, [
      N(s(Q), {
        title: "Checks",
        items: O.value,
        fields: V,
        place: c,
        "empty-title": "No checks yet",
        "data-checks": ""
      }, {
        primary: i(() => [
          N(s(B), {
            small: "",
            variant: "primary",
            "data-check-new": "",
            onClick: a[0] || (a[0] = (o) => b.value = !0)
          }, {
            default: i(() => [...a[3] || (a[3] = [
              x("New check", -1)
            ])]),
            _: 1
          })
        ]),
        empty: i(() => [
          s(y) ? s(h) ? (t(), r("p", ye, g(s(h)), 1)) : (t(), r("p", fe, "A check runs a command and says if it passed.")) : (t(), m(s(Y), {
            key: 0,
            shape: "cards"
          }))
        ]),
        corner: i(({ item: o }) => [
          w("span", we, g(q(o.row)), 1)
        ]),
        card: i(({ item: o }) => [
          o.row.run_percent !== null && o.row.run_percent !== void 0 ? (t(), m(F, {
            key: 0,
            percent: o.row.run_percent
          }, null, 8, ["percent"])) : _("", !0),
          v.value ? (t(), r("p", ge, g(v.value), 1)) : _("", !0)
        ]),
        foot: i(({ item: o }) => [
          o.row.stopped ? (t(), m(s(B), {
            key: 1,
            small: "",
            bordered: "",
            "data-check-card-start": "",
            onClick: (A) => S(o.row)
          }, {
            default: i(() => [...a[4] || (a[4] = [
              x("Start", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])) : (t(), m(s(B), {
            key: 0,
            small: "",
            bordered: "",
            "data-check-card-run": "",
            disabled: u.value.has(o.id),
            onClick: (A) => C(o.row)
          }, {
            default: i(() => [
              x(g(u.value.has(o.id) ? "Running" : "Run"), 1)
            ]),
            _: 2
          }, 1032, ["disabled", "onClick"]))
        ]),
        "card-actions": i(({ item: o }) => [
          N(s(X), {
            items: f(o),
            head: o.title
          }, null, 8, ["items", "head"])
        ]),
        _: 1
      }, 8, ["items"]),
      b.value ? (t(), m(ve, {
        key: 0,
        onClose: a[1] || (a[1] = (o) => b.value = !1)
      })) : _("", !0),
      l.value ? (t(), m(ie, {
        key: 1,
        row: l.value,
        running: u.value.has(l.value.id),
        onClose: a[2] || (a[2] = (o) => p.value = null),
        onRun: C
      }, null, 8, ["row", "running"])) : _("", !0)
    ], 64));
  }
}, $e = /* @__PURE__ */ P(Ce, [["__scopeId", "data-v-359e907c"]]);
export {
  $e as default
};
