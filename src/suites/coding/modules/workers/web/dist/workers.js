/* @code-commandments-generated */
if (!document.getElementById("window-styles-9350f31ae916")) { const style = document.createElement("style"); style.id = "window-styles-9350f31ae916"; style.textContent = ".worker-models[data-v-8506c219]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-8506c219]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-8506c219]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-8506c219]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-8506c219]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-8506c219]{display:flex;gap:8px;align-items:center}.number[data-v-6eb6af04]{color:var(--text-3);font-size:12px}.main[data-v-6eb6af04]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-6eb6af04]{color:var(--text-3);font-size:12px}.main[data-v-a11fd403]{flex:1}.note[data-v-a11fd403]{color:var(--text-3);font-size:12px}.worker-moment[data-v-826dfb51]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-826dfb51]{flex:none;color:var(--text-3);font-size:12px}.program[data-v-fbd94d47]{display:flex;flex-direction:column;gap:6px;padding:10px 0;border-bottom:1px solid var(--border)}.share[data-v-fbd94d47]{display:flex;align-items:center;gap:8px}input[data-v-fbd94d47]{min-width:0;flex:1}output[data-v-fbd94d47]{min-width:36px;text-align:right}small[data-v-fbd94d47]{color:var(--text-3)}p[data-v-fbd94d47]{margin:0}.actions[data-v-fbd94d47]{display:flex;gap:6px}.route[data-v-928533ab]{display:flex;flex-direction:column;gap:6px;padding:10px 0;border-bottom:1px solid var(--border)}p[data-v-928533ab]{margin:0}small[data-v-928533ab]{color:var(--text-3)}.actions[data-v-928533ab]{display:flex;flex-wrap:wrap;gap:6px}.route-form[data-v-1c28c310]{display:flex;flex-direction:column;gap:8px;margin-top:12px}h4[data-v-1c28c310]{margin:0}label[data-v-1c28c310]{display:flex;align-items:center;gap:8px}select[data-v-1c28c310],input[type=number][data-v-1c28c310]{min-width:0;flex:1;background:var(--bg);color:var(--text);border:1px solid var(--border);padding:4px}.outage[data-v-079b94a1]{display:flex;flex-direction:column;gap:8px;padding:10px 0}label[data-v-079b94a1]{display:flex;gap:8px}input[data-v-079b94a1]{min-width:0;flex:1}.split[data-v-29716346]{display:flex;flex-direction:column;gap:8px}p[data-v-29716346],h3[data-v-29716346]{margin:0}p[data-v-29716346]{color:var(--text-3);font-size:12px}h3[data-v-29716346]{margin-top:12px;font-size:13px}label[data-v-29716346]{display:flex;align-items:center;gap:8px}input[data-v-29716346]{width:54px}[role=alert][data-v-29716346]{color:var(--danger)}.worker-tab-body[data-v-f8b83cb6]{padding:14px 16px}.worktree[data-v-158c53fa]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-158c53fa]{flex:1;min-width:0}.worktree-holder[data-v-158c53fa]{font-weight:500}.worktree-folder[data-v-158c53fa]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-158c53fa]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { openBlock as d, createBlock as V, unref as r, withCtx as S, createElementVNode as l, toDisplayString as b, createVNode as w, createElementBlock as v, createTextVNode as m, Fragment as U, renderList as q, createCommentVNode as C, ref as x, withModifiers as G, withDirectives as W, vModelSelect as j, vModelText as F, vModelCheckbox as Y, computed as T, watch as Z } from "vue";
import { useWindow as P, RowList as z, peekRef as _, TimeAgo as ee, Btn as R, WindowRoom as te, InnerTabs as oe, TabBody as le, SwitchCase as ae, AgentRowList as re } from "@journal/window-kit";
import { _ as N } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const ne = ["onClick"], se = { class: "worker-moment-text" }, ie = {
  __name: "WorkerRecent",
  setup(e) {
    const a = P(), { rows: o, failure: i, loaded: f, older: y, more: p } = a.props.recent;
    return (n, g) => (d(), V(r(z), {
      rows: r(o),
      failure: r(i),
      loaded: r(f),
      older: r(y),
      more: r(p),
      empty: "No worker has done anything noteworthy yet",
      hint: "Worker activity appears here as work starts and finishes."
    }, {
      default: S(({ row: $ }) => [
        l("button", {
          type: "button",
          class: "worker-moment",
          "data-worker-moment": "",
          onClick: (h) => r(_)(`${$.target_model}:${$.target_id}`)
        }, [
          l("span", se, b($.text), 1),
          w(r(ee), {
            at: $.created_at
          }, null, 8, ["at"])
        ], 8, ne)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "older", "more"]));
  }
}, ue = /* @__PURE__ */ N(ie, [["__scopeId", "data-v-826dfb51"]]), de = ["data-split-program"], me = { class: "share" }, ve = ["value", "aria-label", "disabled"], be = { key: 0 }, fe = { key: 1 }, ge = { class: "actions" }, pe = {
  __name: "WorkerSplitProgram",
  props: { row: { type: Object, required: !0 }, share: { type: Number, required: !0 }, disabled: Boolean },
  emits: ["share", "save", "back", "out"],
  setup(e) {
    return (a, o) => (d(), v("section", {
      class: "program",
      "data-split-program": e.row.id
    }, [
      l("strong", null, b(e.row.title), 1),
      l("label", me, [
        o[4] || (o[4] = m("Share ", -1)),
        l("input", {
          type: "range",
          min: "0",
          max: "100",
          step: "5",
          value: e.share,
          "aria-label": `${e.row.title} share`,
          disabled: e.disabled,
          onInput: o[0] || (o[0] = (i) => a.$emit("share", Number(i.target.value))),
          onChange: o[1] || (o[1] = (i) => a.$emit("save"))
        }, null, 40, ve),
        l("output", null, b(e.share) + "%", 1)
      ]),
      l("small", null, b(e.row.recent) + " recent worker tasks · " + b(e.row.helpers_recent) + " recent read-only helper tasks", 1),
      (d(!0), v(U, null, q(e.row.windows, (i) => (d(), v("small", { key: i }, b(i), 1))), 128)),
      e.row.is_ready ? C("", !0) : (d(), v("p", be, [
        m(b(e.row.line), 1),
        e.row.ends_at ? (d(), v(U, { key: 0 }, [
          m(" · Until " + b(e.row.ends_at), 1)
        ], 64)) : C("", !0)
      ])),
      e.row.outage && e.row.outage_reason !== e.row.line ? (d(), v("p", fe, b(e.row.outage_reason) + " · Until " + b(e.row.outage_ends_at), 1)) : C("", !0),
      l("div", ge, [
        e.row.outage ? (d(), V(r(R), {
          key: 0,
          small: "",
          disabled: e.disabled,
          onClick: o[2] || (o[2] = (i) => a.$emit("back"))
        }, {
          default: S(() => [...o[5] || (o[5] = [
            m("Back now", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : C("", !0),
        w(r(R), {
          small: "",
          disabled: e.disabled,
          onClick: o[3] || (o[3] = (i) => a.$emit("out"))
        }, {
          default: S(() => [...o[6] || (o[6] = [
            m("Mark out", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 8, de));
  }
}, ke = /* @__PURE__ */ N(pe, [["__scopeId", "data-v-fbd94d47"]]), we = ["data-split-route"], ye = { key: 0 }, $e = { key: 1 }, ce = { class: "actions" }, Se = {
  __name: "WorkerRouteRow",
  props: { row: { type: Object, required: !0 }, count: { type: Number, required: !0 }, disabled: Boolean },
  emits: ["move", "delete"],
  setup(e) {
    return (a, o) => (d(), v("section", {
      class: "route",
      "data-split-route": e.row.id
    }, [
      l("strong", null, b(e.row.position) + ". " + b(e.row.program || "Any program") + " · " + b(e.row.tier || "Profile tier"), 1),
      l("p", null, [
        m(b(e.row.tags.join(", ") || "Any tags"), 1),
        e.row.complexity_from !== null || e.row.complexity_to !== null ? (d(), v(U, { key: 0 }, [
          m(" · Complexity " + b(e.row.complexity_from ?? 1) + " to " + b(e.row.complexity_to ?? 5), 1)
        ], 64)) : C("", !0)
      ]),
      e.row.strict ? (d(), v("small", ye, "Unavailable program: wait.")) : C("", !0),
      e.row.status === "gone" ? (d(), v("small", $e, "This program was removed. This route matches nothing.")) : C("", !0),
      l("div", ce, [
        w(r(R), {
          small: "",
          disabled: e.disabled || e.row.position === 1,
          onClick: o[0] || (o[0] = (i) => a.$emit("move", e.row.position - 1))
        }, {
          default: S(() => [...o[3] || (o[3] = [
            m("Move up", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        w(r(R), {
          small: "",
          disabled: e.disabled || e.row.position === e.count,
          onClick: o[1] || (o[1] = (i) => a.$emit("move", e.row.position + 1))
        }, {
          default: S(() => [...o[4] || (o[4] = [
            m("Move down", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        w(r(R), {
          small: "",
          disabled: e.disabled,
          onClick: o[2] || (o[2] = (i) => a.$emit("delete"))
        }, {
          default: S(() => [...o[5] || (o[5] = [
            m("Delete", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 8, we));
  }
}, he = /* @__PURE__ */ N(Se, [["__scopeId", "data-v-928533ab"]]), xe = ["disabled"], Ce = ["value"], We = ["disabled"], Re = ["disabled"], Me = ["disabled"], Ne = ["value"], Ae = ["disabled"], Be = ["disabled"], Oe = {
  __name: "WorkerRouteForm",
  props: { programs: { type: Array, required: !0 }, tags: { type: Array, required: !0 }, disabled: Boolean },
  emits: ["submit"],
  setup(e, { emit: a }) {
    const o = a, i = x([]), f = x(""), y = x(""), p = x(""), n = x(""), g = x(!1);
    function $() {
      const h = ["worker-route", "make"];
      i.value.length && h.push("--tags", i.value.join(",")), f.value && h.push("--program", f.value), y.value && h.push("--tier", y.value), p.value !== "" && h.push("--complexity-from", String(p.value)), n.value !== "" && h.push("--complexity-to", String(n.value)), g.value && h.push("--strict"), o("submit", h);
    }
    return (h, t) => (d(), v("form", {
      class: "route-form",
      "data-split-route-form": "",
      onSubmit: G($, ["prevent"])
    }, [
      t[15] || (t[15] = l("h4", null, "Add a route", -1)),
      l("label", null, [
        t[6] || (t[6] = m("Tags ", -1)),
        W(l("select", {
          "onUpdate:modelValue": t[0] || (t[0] = (s) => i.value = s),
          multiple: "",
          "aria-label": "Route tags",
          disabled: e.disabled
        }, [
          (d(!0), v(U, null, q(e.tags, (s) => (d(), v("option", {
            key: s.word,
            value: s.word
          }, b(s.word), 9, Ce))), 128))
        ], 8, xe), [
          [j, i.value]
        ])
      ]),
      l("label", null, [
        t[7] || (t[7] = m("Complexity from ", -1)),
        W(l("input", {
          "onUpdate:modelValue": t[1] || (t[1] = (s) => p.value = s),
          type: "number",
          min: "1",
          max: "5",
          "aria-label": "Complexity from",
          disabled: e.disabled
        }, null, 8, We), [
          [F, p.value]
        ])
      ]),
      l("label", null, [
        t[8] || (t[8] = m("Complexity to ", -1)),
        W(l("input", {
          "onUpdate:modelValue": t[2] || (t[2] = (s) => n.value = s),
          type: "number",
          min: "1",
          max: "5",
          "aria-label": "Complexity to",
          disabled: e.disabled
        }, null, 8, Re), [
          [F, n.value]
        ])
      ]),
      l("label", null, [
        t[10] || (t[10] = m("Program ", -1)),
        W(l("select", {
          "onUpdate:modelValue": t[3] || (t[3] = (s) => f.value = s),
          "aria-label": "Route program",
          disabled: e.disabled
        }, [
          t[9] || (t[9] = l("option", { value: "" }, "Any program", -1)),
          (d(!0), v(U, null, q(e.programs, (s) => (d(), v("option", {
            key: s.id,
            value: s.id
          }, b(s.title), 9, Ne))), 128))
        ], 8, Me), [
          [j, f.value]
        ])
      ]),
      l("label", null, [
        t[12] || (t[12] = m("Tier ", -1)),
        W(l("select", {
          "onUpdate:modelValue": t[4] || (t[4] = (s) => y.value = s),
          "aria-label": "Route tier",
          disabled: e.disabled
        }, [...t[11] || (t[11] = [
          l("option", { value: "" }, "Profile tier", -1),
          l("option", { value: "fast" }, "Fast", -1),
          l("option", { value: "general" }, "General", -1),
          l("option", { value: "strongest" }, "Strongest", -1)
        ])], 8, Ae), [
          [j, y.value]
        ])
      ]),
      l("label", null, [
        W(l("input", {
          "onUpdate:modelValue": t[5] || (t[5] = (s) => g.value = s),
          type: "checkbox",
          disabled: e.disabled || !f.value
        }, null, 8, Be), [
          [Y, g.value]
        ]),
        t[13] || (t[13] = m(" Wait for this program when it is out", -1))
      ]),
      w(r(R), {
        type: "submit",
        disabled: e.disabled
      }, {
        default: S(() => [...t[14] || (t[14] = [
          m("Add route", -1)
        ])]),
        _: 1
      }, 8, ["disabled"])
    ], 32));
  }
}, Ue = /* @__PURE__ */ N(Oe, [["__scopeId", "data-v-1c28c310"]]), Ve = ["disabled"], Ie = ["disabled"], Te = {
  __name: "WorkerOutageForm",
  props: { program: { type: String, required: !0 }, disabled: Boolean },
  emits: ["submit", "cancel"],
  setup(e, { emit: a }) {
    const o = a, i = x(""), f = x("");
    function y() {
      o("submit", i.value, new Date(f.value).toISOString());
    }
    return (p, n) => (d(), v("form", {
      class: "outage",
      "data-split-outage-form": "",
      onSubmit: G(y, ["prevent"])
    }, [
      l("strong", null, "Mark " + b(e.program) + " out", 1),
      l("label", null, [
        n[3] || (n[3] = m("Reason ", -1)),
        W(l("input", {
          "onUpdate:modelValue": n[0] || (n[0] = (g) => i.value = g),
          required: "",
          "aria-label": "Outage reason",
          disabled: e.disabled
        }, null, 8, Ve), [
          [F, i.value]
        ])
      ]),
      l("label", null, [
        n[4] || (n[4] = m("Until ", -1)),
        W(l("input", {
          "onUpdate:modelValue": n[1] || (n[1] = (g) => f.value = g),
          type: "datetime-local",
          required: "",
          "aria-label": "Outage ends at",
          disabled: e.disabled
        }, null, 8, Ie), [
          [F, f.value]
        ])
      ]),
      l("div", null, [
        w(r(R), {
          type: "submit",
          disabled: e.disabled
        }, {
          default: S(() => [...n[5] || (n[5] = [
            m("Mark out", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        n[7] || (n[7] = m()),
        w(r(R), {
          disabled: e.disabled,
          onClick: n[2] || (n[2] = (g) => p.$emit("cancel"))
        }, {
          default: S(() => [...n[6] || (n[6] = [
            m("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, qe = /* @__PURE__ */ N(Te, [["__scopeId", "data-v-079b94a1"]]);
function Fe(e, a, o) {
  if (!e.some((t) => t.id === a)) return e;
  if (e.length === 1) return e.map((t) => ({ ...t, share: 100 }));
  const i = Math.max(0, Math.min(100, Math.round(Number(o) / 5) * 5)), f = e.filter((t) => t.id !== a), y = f.reduce((t, s) => t + s.share, 0), p = (100 - i) / 5, n = f.map((t) => ({ id: t.id, units: p * (y ? t.share / y : 1 / f.length) })), g = new Map(n.map((t) => [t.id, Math.floor(t.units)])), $ = p - [...g.values()].reduce((t, s) => t + s, 0), h = [...n].sort((t, s) => s.units % 1 - t.units % 1);
  for (const t of h.slice(0, $)) g.set(t.id, g.get(t.id) + 1);
  return e.map((t) => ({ ...t, share: t.id === a ? i : g.get(t.id) * 5 }));
}
const De = {
  class: "split",
  "data-worker-split": ""
}, je = {
  key: 0,
  role: "alert"
}, Pe = { key: 1 }, Le = ["value", "disabled"], Ee = { key: 3 }, Ge = {
  __name: "WorkerSplit",
  setup(e) {
    const a = P(), { rows: o, failure: i, loaded: f, act: y } = a.props.split, { rows: p, failure: n } = a.props.routes, { rows: g, failure: $ } = a.props.tags, { rows: h, failure: t } = a.props["split-limits"], s = x([]), L = x(""), D = x(!1), A = x(""), I = T(() => h.value.find((k) => k.key === "worker")), B = T(() => D.value || a.readOnly), E = T(() => L.value || i.value || n.value || $.value || t.value);
    Z(o, (k) => {
      s.value = k.map((u) => ({ ...u }));
    }, { immediate: !0 });
    const H = (k) => {
      var u;
      return ((u = s.value.find((c) => c.id === k.id)) == null ? void 0 : u.share) ?? k.share;
    };
    function J(k, u) {
      s.value = Fe(s.value, k.id, u);
    }
    async function M(k) {
      if (!B.value) {
        D.value = !0;
        try {
          const u = await y(k);
          L.value = u.ok ? "" : u.error, u.ok && (A.value = "", await a.reload(["routes", "split-limits"]));
        } finally {
          D.value = !1;
        }
      }
    }
    function K() {
      const k = s.value.map((u) => `${u.id} ${u.share}`).join(",");
      return M(["setting", "set", "journal.core.helpers.program-split", k, "--project"]);
    }
    function Q(k) {
      if (I.value)
        return M(["setting", "set", I.value.run_setting, String(k), "--environment", a.environment]);
    }
    function X(k, u) {
      return M(["provider-outage", "make", A.value, k, "--ends-at", u]);
    }
    return (k, u) => (d(), v("section", De, [
      E.value ? (d(), v("p", je, b(E.value), 1)) : C("", !0),
      I.value ? (d(), v("label", Pe, [
        u[2] || (u[2] = m("Workers running at once ", -1)),
        l("input", {
          type: "number",
          min: "0",
          value: I.value.run_limit,
          "aria-label": "Workers running at once",
          disabled: B.value,
          onChange: u[0] || (u[0] = (c) => Q(c.target.value))
        }, null, 40, Le)
      ])) : C("", !0),
      u[3] || (u[3] = l("p", null, "Shares apply to new tasks. Read-only helpers and workers are counted separately. A program that is out passes its share to the others.", -1)),
      w(r(z), {
        rows: r(o),
        failure: r(i),
        loaded: r(f),
        empty: "No agent programs",
        hint: "Installed program modules appear here."
      }, {
        default: S(({ row: c }) => [
          w(ke, {
            row: c,
            share: H(c),
            disabled: B.value,
            onShare: (O) => J(c, O),
            onSave: K,
            onBack: (O) => M(["provider-outage", "end", c.id]),
            onOut: (O) => A.value = c.id
          }, null, 8, ["row", "share", "disabled", "onShare", "onBack", "onOut"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"]),
      A.value ? (d(), V(qe, {
        key: 2,
        program: A.value,
        disabled: B.value,
        onSubmit: X,
        onCancel: u[1] || (u[1] = (c) => A.value = "")
      }, null, 8, ["program", "disabled"])) : C("", !0),
      u[4] || (u[4] = l("h3", null, "Routes", -1)),
      u[5] || (u[5] = l("p", null, "The first matching route wins.", -1)),
      (d(!0), v(U, null, q(r(p), (c) => (d(), V(he, {
        key: c.id,
        row: c,
        count: r(p).length,
        disabled: B.value,
        onMove: (O) => M(["worker-route", "move", String(c.id), "--to", String(O)]),
        onDelete: (O) => M(["worker-route", "delete", String(c.id)])
      }, null, 8, ["row", "count", "disabled", "onMove", "onDelete"]))), 128)),
      r(p).length ? C("", !0) : (d(), v("p", Ee, "No routes. New tasks follow the split.")),
      w(Ue, {
        programs: r(o),
        tags: r(g),
        disabled: B.value,
        onSubmit: M
      }, null, 8, ["programs", "tags", "disabled"])
    ]));
  }
}, ze = /* @__PURE__ */ N(Ge, [["__scopeId", "data-v-29716346"]]), He = {
  __name: "WorkerDropdown",
  setup(e) {
    var p;
    const a = P();
    a.state.tab = ((p = a.tabs[0]) == null ? void 0 : p.key) ?? "workers";
    const o = T({ get: () => a.tabs.find((n) => n.key === a.state.tab), set: (n) => a.state.tab = n.key }), { rows: i, failure: f, loaded: y } = a.props.workers;
    return (n, g) => (d(), V(r(te), { padding: "0" }, {
      default: S(() => [
        w(r(oe), {
          active: o.value,
          onChoose: g[0] || (g[0] = ($) => o.value = $)
        }, null, 8, ["active"]),
        w(r(le), {
          class: "worker-tab-body",
          tab: o.value
        }, {
          default: S(() => {
            var $;
            return [
              w(r(ae), {
                value: ($ = o.value) == null ? void 0 : $.key
              }, {
                workers: S(() => [
                  w(r(re), {
                    rows: r(i),
                    failure: r(f),
                    loaded: r(y),
                    none: "No workers have been sent from here"
                  }, null, 8, ["rows", "failure", "loaded"])
                ]),
                recent: S(() => [
                  w(ue)
                ]),
                split: S(() => [
                  w(ze)
                ]),
                _: 1
              }, 8, ["value"])
            ];
          }),
          _: 1
        }, 8, ["tab"])
      ]),
      _: 1
    }));
  }
}, Xe = /* @__PURE__ */ N(He, [["__scopeId", "data-v-f8b83cb6"]]);
export {
  Xe as default
};
