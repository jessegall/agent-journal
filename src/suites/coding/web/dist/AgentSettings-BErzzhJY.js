/* @code-commandments-generated */
import { reactive as O, ref as S, computed as v, watch as P, openBlock as s, createElementBlock as r, Fragment as B, renderList as N, createElementVNode as g, toDisplayString as l, createBlock as w, unref as h, withDirectives as K, vModelText as L, createCommentVNode as b, createVNode as A, withCtx as x, createTextVNode as f } from "vue";
import { useWindow as I, Switch as D, Btn as W, WindowRoom as q, Segmented as F } from "@journal/window-kit";
import { _ as M } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const H = ["data-agent-settings-group"], z = ["data-control"], J = { class: "group-text" }, Q = { class: "group-label" }, X = { class: "group-line" }, Y = { class: "group-source" }, Z = ["onUpdate:modelValue", "data-field"], ee = {
  key: 0,
  class: "group-hint",
  "data-group-blank": ""
}, te = {
  key: 1,
  class: "group-hint",
  role: "alert",
  "data-group-stale": ""
}, ae = {
  key: 2,
  class: "group-failure",
  role: "alert",
  "data-group-failure": ""
}, se = { class: "group-buttons" }, ne = {
  __name: "AgentSettingsGroup",
  props: { group: { type: String, required: !0 } },
  setup($) {
    const _ = $, k = I(), u = k.props.work, n = O({}), i = S(""), o = S(""), p = S(!1), c = v(() => {
      var t;
      return (((t = u.data.value) == null ? void 0 : t.fields) ?? []).filter((e) => e.group === _.group);
    }), T = (t) => t.type === "flag" ? !!t.value : String(t.value), y = v(() => c.value.filter((t) => n[t.key] !== T(t))), m = v(() => y.value.length > 0), V = v(() => {
      var t;
      return m.value && i.value && ((t = u.data.value) == null ? void 0 : t.revision) !== i.value;
    }), E = (t) => t.type === "flag" ? n[t.key] ? "on" : "off" : String(n[t.key]).trim(), C = v(() => y.value.some((t) => t.type !== "flag" && E(t) === ""));
    function j() {
      var t;
      for (const e of c.value) n[e.key] = T(e);
      i.value = ((t = u.data.value) == null ? void 0 : t.revision) ?? "", o.value = "";
    }
    P(() => u.data.value, () => {
      (!i.value || !m.value) && j();
    }, { immediate: !0 });
    async function U() {
      p.value = !0;
      const t = await k.run(`work-settings apply --revision ${i.value} ${y.value.map((e) => `${e.key}=${E(e)}`).join(" ")}`);
      p.value = !1, o.value = t.ok ? "" : t.error, await k.reload("work"), t.ok && j();
    }
    return (t, e) => (s(), r("section", {
      class: "group",
      "data-agent-settings-group": $.group
    }, [
      (s(!0), r(B, null, N(c.value, (a) => (s(), r("label", {
        key: a.key,
        class: "group-row",
        "data-control": a.key
      }, [
        g("span", J, [
          g("span", Q, l(a.title), 1),
          g("span", X, l(a.description), 1),
          g("span", Y, l(a.source), 1)
        ]),
        a.type === "flag" ? (s(), w(h(D), {
          key: 0,
          on: n[a.key],
          onChange: (d) => n[a.key] = !n[a.key]
        }, null, 8, ["on", "onChange"])) : K((s(), r("input", {
          key: 1,
          "onUpdate:modelValue": (d) => n[a.key] = d,
          class: "group-input",
          type: "number",
          min: "0",
          step: "any",
          "data-field": a.key
        }, null, 8, Z)), [
          [L, n[a.key]]
        ])
      ], 8, z))), 128)),
      C.value ? (s(), r("p", ee, "A number is missing.")) : b("", !0),
      V.value ? (s(), r("p", te, "These settings changed since you opened them. Cancel to read them again.")) : b("", !0),
      o.value ? (s(), r("p", ae, l(o.value), 1)) : b("", !0),
      g("div", se, [
        A(h(W), {
          disabled: !m.value || p.value,
          "data-group-cancel": "",
          onClick: j
        }, {
          default: x(() => [...e[0] || (e[0] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        A(h(W), {
          disabled: !m.value || p.value || V.value || C.value,
          "data-group-apply": "",
          onClick: U
        }, {
          default: x(() => [...e[1] || (e[1] = [
            f("Apply", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 8, H));
  }
}, R = /* @__PURE__ */ M(ne, [["__scopeId", "data-v-182593af"]]), oe = {
  __name: "AgentSettingsAdvanced",
  setup($) {
    return (_, k) => (s(), w(R, {
      group: "advanced",
      "data-agent-settings-advanced": ""
    }));
  }
}, le = {
  class: "agents",
  "data-agent-settings-agents": ""
}, re = {
  key: 0,
  class: "agents-empty"
}, ie = ["data-agent-type"], ue = { class: "agents-title" }, ce = { class: "agents-count" }, de = {
  key: 0,
  class: "agents-profiles"
}, ge = ["data-agent-profile"], ke = { class: "agents-group" }, pe = {
  __name: "AgentSettingsAgents",
  setup($) {
    const _ = I(), k = v(() => _.props.limits.rows.value ?? []), u = (n) => n === 0 ? "no limit" : n;
    return (n, i) => (s(), r("section", le, [
      k.value.length ? b("", !0) : (s(), r("p", re, "No agent types report limits.")),
      (s(!0), r(B, null, N(k.value, (o) => {
        var p;
        return s(), r("article", {
          key: o.key,
          class: "agents-type",
          "data-agent-type": o.key
        }, [
          g("h3", ue, l(o.label), 1),
          g("p", ce, l(o.running) + " running of " + l(o.run_limit) + ", " + l(o.kept) + " kept of " + l(u(o.kept_limit)), 1),
          (p = o.profiles) != null && p.length ? (s(), r("ul", de, [
            (s(!0), r(B, null, N(o.profiles, (c) => (s(), r("li", {
              key: c.profile,
              "data-agent-profile": c.profile
            }, [
              f(l(c.title) + " ", 1),
              g("span", ke, l(c.group), 1),
              f(": " + l(c.running) + " running of " + l(c.run_limit) + ", " + l(c.kept) + " kept of " + l(u(c.kept_limit)), 1)
            ], 8, ge))), 128))
          ])) : b("", !0)
        ], 8, ie);
      }), 128))
    ]));
  }
}, _e = /* @__PURE__ */ M(pe, [["__scopeId", "data-v-249c0f13"]]), ve = {
  __name: "AgentSettingsTests",
  setup($) {
    return (_, k) => (s(), w(R, {
      group: "tests",
      "data-agent-settings-tests": ""
    }));
  }
}, he = {
  class: "work",
  "data-agent-settings-work": ""
}, ye = {
  class: "work-flow",
  "data-work-flow": ""
}, me = { class: "work-presets" }, we = ["data-control"], fe = { class: "work-text" }, be = { class: "work-label" }, $e = { class: "work-line" }, Ae = {
  key: 0,
  class: "work-hint",
  "data-work-hint": ""
}, Se = {
  key: 1,
  class: "work-hint",
  role: "alert",
  "data-work-stale": ""
}, Ce = {
  key: 2,
  class: "work-failure",
  role: "alert",
  "data-work-failure": ""
}, je = { class: "work-buttons" }, xe = "journal.suites.coding.auto-mode", Te = "journal.suites.coding.workers.main-dispatches-workers", We = {
  __name: "AgentSettingsWork",
  setup($) {
    const _ = [
      { key: "journal.suites.coding.auto-mode", label: "Auto mode", line: "The journal hands the main agent its next task, and it keeps going while tasks are left" },
      { key: "journal.suites.coding.main-writes-code", label: "Main agent writes code", line: "The main agent may change project files itself; off, it plans, delegates and merges" },
      { key: "journal.suites.coding.workers.main-dispatches-workers", label: "Main agent sends workers", line: "Whether the main agent may send workers to do tasks." },
      { key: "journal.suites.coding.continue-while-delegatable", label: "Keep going while work can be delegated", line: "Keep the main agent working while open tasks can still be sent to workers." },
      { key: "journal.suites.coding.workers.merger-on", label: "Merger takes in workers", line: "A helper merges workers whose tests passed, and passes on what the main agent must judge." },
      { key: "journal.suites.coding.main-starts-helpers", label: "Use ordinary helpers", line: "Whether the main agent may start ordinary helpers." },
      { key: "journal.suites.coding.designer-enabled", label: "Use a designer", line: "Whether the main agent may start a designer, which writes a design document and changes no code." },
      { key: "journal.suites.coding.workers.main-agent-may-merge", label: "Main agent may merge workers", line: "Whether the main agent may merge the work of a worker itself." }
    ], k = [{ key: "builder", label: "Builder" }, { key: "orchestrator", label: "Orchestrator" }], u = I(), n = u.props.work, i = O({}), o = S(""), p = S(""), c = S(!1), T = v(() => _.filter((e) => {
      var a, d;
      return i[e.key] !== ((d = (a = n.data.value) == null ? void 0 : a.controls) == null ? void 0 : d[e.key]);
    })), y = v(() => T.value.length > 0), m = v(() => y.value && n.data.value && o.value && n.data.value.revision !== o.value), V = v(() => {
      var e;
      return ((e = n.data.value) == null ? void 0 : e.workflow) ?? "";
    }), E = v(() => i[xe] === !1 && i[Te] === !1);
    function C() {
      const e = n.data.value;
      if (e) {
        for (const a of _) i[a.key] = e.controls[a.key];
        o.value = e.revision, p.value = "";
      }
    }
    P(() => n.data.value, () => {
      (!o.value || !y.value) && C();
    }, { immediate: !0 });
    async function j(e) {
      c.value = !0;
      const a = await u.run(e);
      c.value = !1, a.ok ? (await u.reload("work"), C()) : (p.value = a.error, await u.reload("work"));
    }
    const U = () => j(`work-settings apply --revision ${o.value} ${T.value.map((e) => `${e.key}=${i[e.key] ? "on" : "off"}`).join(" ")}`), t = (e) => j(`work-settings preset ${e} --revision ${o.value}`);
    return (e, a) => (s(), r("section", he, [
      g("p", ye, [
        a[0] || (a[0] = f("Workflow: ", -1)),
        g("strong", null, l(V.value || "unknown"), 1)
      ]),
      g("div", me, [
        (s(), r(B, null, N(k, (d) => A(h(W), {
          key: d.key,
          disabled: c.value || m.value,
          "data-preset": d.key,
          onClick: (G) => t(d.key)
        }, {
          default: x(() => [
            f(l(d.label), 1)
          ]),
          _: 2
        }, 1032, ["disabled", "data-preset", "onClick"])), 64))
      ]),
      (s(), r(B, null, N(_, (d) => g("label", {
        key: d.key,
        class: "work-row",
        "data-control": d.key
      }, [
        g("span", fe, [
          g("span", be, l(d.label), 1),
          g("span", $e, l(d.line), 1)
        ]),
        A(h(D), {
          on: i[d.key],
          onChange: (G) => i[d.key] = !i[d.key]
        }, null, 8, ["on", "onChange"])
      ], 8, we)), 64)),
      E.value ? (s(), r("p", Ae, "With Auto off and no workers, nothing starts the work: a person starts tasks or turns one of them on.")) : b("", !0),
      m.value ? (s(), r("p", Se, "These settings changed since you opened them. Cancel to read them again.")) : b("", !0),
      p.value ? (s(), r("p", Ce, l(p.value), 1)) : b("", !0),
      g("div", je, [
        A(h(W), {
          disabled: !y.value || c.value,
          "data-work-cancel": "",
          onClick: C
        }, {
          default: x(() => [...a[1] || (a[1] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        A(h(W), {
          disabled: !y.value || c.value || m.value,
          "data-work-apply": "",
          onClick: U
        }, {
          default: x(() => [...a[2] || (a[2] = [
            f("Apply", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ]));
  }
}, Be = /* @__PURE__ */ M(We, [["__scopeId", "data-v-d9a63641"]]), Ne = {
  class: "settings",
  "data-agent-settings": ""
}, Ve = {
  __name: "AgentSettings",
  setup($) {
    const _ = [{ key: "work", label: "Work" }, { key: "agents", label: "Agents" }, { key: "tests", label: "Tests" }, { key: "advanced", label: "Advanced" }], k = I(), u = S("work");
    function n(i) {
      u.value = i, k.state.tab = i === "agents" ? "agents" : "";
    }
    return (i, o) => (s(), w(h(q), null, {
      default: x(() => [
        g("div", Ne, [
          A(h(F), {
            options: _,
            value: u.value,
            onPick: n
          }, null, 8, ["value"]),
          u.value === "work" ? (s(), w(Be, { key: 0 })) : u.value === "agents" ? (s(), w(_e, { key: 1 })) : u.value === "tests" ? (s(), w(ve, { key: 2 })) : (s(), w(oe, { key: 3 }))
        ])
      ]),
      _: 1
    }));
  }
}, Ue = /* @__PURE__ */ M(Ve, [["__scopeId", "data-v-1f00b7cf"]]);
export {
  Ue as A
};
