if (!document.getElementById("window-styles-e5c8157d76af")) { const style = document.createElement("style"); style.id = "window-styles-e5c8157d76af"; style.textContent = ".run[data-v-7c86d6bf]{display:flex;align-items:center;gap:var(--s3);padding:8px 0;border-bottom:1px solid var(--border-inner);font-size:12.5px}.run-number[data-v-7c86d6bf]{flex:none;width:30px;color:var(--text-3);font-variant-numeric:tabular-nums}.bar[data-v-7c86d6bf]{flex:1;min-width:40px;height:4px;overflow:hidden;border-radius:2px;background:var(--border-2)}.bar i[data-v-7c86d6bf]{display:block;height:100%;background:var(--accent)}.run-words[data-v-7c86d6bf]{flex:none;color:var(--text-3);font-size:12px;white-space:nowrap}.abandon[data-v-7c86d6bf]{flex:none;border:0;background:none;color:var(--text-2);font:inherit;font-size:12px;cursor:pointer}.none[data-v-7c86d6bf]{margin:0;color:var(--text-3);font-size:12.5px}.progress[data-v-b82a754d]{display:flex;align-items:center;gap:var(--s3);margin:4px 0 14px}.bar[data-v-b82a754d]{flex:1;height:4px;overflow:hidden;border-radius:2px;background:var(--border-2)}.bar i[data-v-b82a754d]{display:block;height:100%;background:var(--accent)}.progress-words[data-v-b82a754d]{color:var(--text-3);font-size:12px;font-variant-numeric:tabular-nums;white-space:nowrap}.steps[data-v-b82a754d]{margin:0;padding:0;list-style:none}.step[data-v-b82a754d]{display:flex;align-items:flex-start;gap:var(--s3);padding:8px 0;border-bottom:1px solid var(--border-inner)}.step-number[data-v-b82a754d]{flex:none;width:18px;color:var(--text-3);font-size:12px;text-align:right;font-variant-numeric:tabular-nums}.step-body[data-v-b82a754d]{flex:1;min-width:0}.step-text[data-v-b82a754d]{color:var(--text-2)}.step-guard[data-v-b82a754d]{display:block;color:var(--text-3);font-size:12px}.sequence-triggers[data-v-4037395c]{margin-bottom:14px}.head[data-v-4037395c]{display:flex;gap:8px;align-items:center;margin-bottom:6px}.title[data-v-4037395c],.label[data-v-4037395c],.note[data-v-4037395c]{color:var(--text-3);font-size:12px}.line[data-v-4037395c]{margin:0 0 2px;font-size:13px}.card[data-v-4037395c]{display:flex;flex-direction:column;align-items:flex-start;gap:6px;margin-bottom:8px;padding:10px;border:1px solid var(--border);border-radius:8px}.card input[data-v-4037395c]{width:100%;padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:13px}.foot[data-v-4037395c]{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.failure[data-v-dcaf6acf]{margin:0;padding:6px var(--inset);color:var(--bad, var(--text-2));font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as r, createBlock as f, unref as s, withCtx as _, createVNode as b, createElementBlock as m, createCommentVNode as x, Fragment as C, renderList as L, createElementVNode as h, toDisplayString as k, normalizeStyle as X, computed as O, ref as j, createTextVNode as T, withDirectives as de, vModelText as ce } from "vue";
import { useWindow as E, CreateDialog as J, TextList as pe, AgentBadge as Z, TextDisplay as me, Btn as W, Icon as ge, Segmented as ve, Reader as be, SwitchCase as ye, ActionsMenu as _e, deleteItem as qe, removed as he, defaultFilter as fe, applyFilter as ke, ListReaderLayout as $e, Skeleton as we, PageHeader as Se, FilterBar as Oe } from "@journal/window-kit";
const R = [
  { value: "row", label: "A record is made", fields: [{ name: "event", label: "Record and event", placeholder: "plan.create" }] },
  { value: "phrase", label: "You ask for it", fields: [{ name: "text", label: "Words you write", placeholder: "an update please" }] },
  { value: "command", label: "A command runs", fields: [{ name: "pattern", label: "Pattern on the command line", placeholder: "^git push" }] },
  { value: "file", label: "A file is edited", fields: [{ name: "pattern", label: "Files, as a path glob", placeholder: "src/*.py" }] },
  { value: "file-text", label: "An edit adds text", fields: [{ name: "pattern", label: "Files, as a path glob", placeholder: "src/*.py" }, { name: "text", label: "Text in the new content", placeholder: "TODO" }] },
  { value: "tool", label: "A tool is used", fields: [{ name: "tool", label: "Tool name", placeholder: "Edit" }, { name: "pattern", label: "Pattern on its input, if any", placeholder: "migrations/" }] }
], D = (e) => R.find((t) => t.value === e) ?? R[0], Ae = {
  row: (e) => `When ${e.event} happens`,
  phrase: (e) => `When you ask “${e.text}”`,
  command: (e) => `When a command matching “${e.pattern}” runs`,
  file: (e) => `When a file matching “${e.pattern}” is edited`,
  "file-text": (e) => `When an edit to “${e.pattern}” adds “${e.text}”`,
  tool: (e) => `When ${e.tool} is used${e.pattern ? ` with “${e.pattern}” in its input` : ""}`
}, Ce = (e) => Ae[e.trigger_type](e), ee = (e) => e.length ? e.map(Ce) : ["Only when you or the agent start it"], U = () => ({ trigger_type: "phrase", event: "", text: "", pattern: "", tool: "" });
function te(e) {
  const t = D(e.trigger_type).fields.map((n) => [n.name, (e[n.name] || "").trim()]);
  return { trigger_type: e.trigger_type, ...Object.fromEntries(t.filter(([, n]) => n)) };
}
const xe = { tool: ["pattern"] };
function ne(e) {
  const t = e.find((n) => D(n.trigger_type).fields.some((u) => !(xe[n.trigger_type] ?? []).includes(u.name) && !(n[u.name] || "").trim()));
  return t ? `${D(t.trigger_type).label}: complete every field.` : "";
}
const Te = "Add instructions for each step.", se = (e) => ({ key: "steps", label: "Steps, in order", kind: "slot", required: !0, value: e }), ae = (e) => e.steps.some((t) => !t.trim()) ? { steps: Te } : {}, Ne = (e) => /\s/.test(e) ? JSON.stringify(e) : e, V = (e) => `journal ${e.map(Ne).join(" ")}`, Re = (e = "", t = [""]) => [{ key: "title", label: "Title", required: !0, placeholder: "Releasing a version", value: e }, se(t)], Ie = (e) => e.title.trim() ? ae(e) : { title: "Give the sequence a title." }, We = (e) => ["sequence", "make", e.title.trim(), "--steps", e.steps.map((t) => t.trim()).join(" | ")], je = (e) => V(["sequence", "make", e.title.trim() || "…", "--steps", e.steps.map((t) => t.trim()).join(" | ") || "…"]), Ee = (e) => JSON.parse(e.step_guards || "[]"), Fe = { file_edits_allowed: !0, allowed_commands: [] }, Le = (e, t) => ["sequence", "edit", String(e.id), "--steps", ...t.steps.map((n) => n.trim()), "--step-guards", JSON.stringify(t.steps.map((n, u) => Ee(e)[u] ?? Fe))], Pe = (e) => () => V(["sequence", "edit", String(e.id), "--steps", "…"]), le = (e, t) => `${e.value}:${t}`, De = { tool: ["pattern"] }, Je = [
  { key: "kind", label: "Starts when", kind: "select", options: R.map((e) => [e.value, e.label]) },
  ...R.flatMap((e) => e.fields.map((t) => ({ key: le(e, t.name), label: t.label, placeholder: t.placeholder, required: !(De[e.value] ?? []).includes(t.name), when: (n) => n.kind === e.value })))
], re = (e) => ({ ...U(), trigger_type: e.kind, ...Object.fromEntries(R.find((t) => t.value === e.kind).fields.map((t) => [t.name, e[le({ value: e.kind }, t.name)] ?? ""])) }), Ve = (e) => ne([re(e)]) ? { [Object.keys(e).find((n) => n.startsWith(`${e.kind}:`))]: "Complete every field." } : {}, Be = (e, t) => ["sequence", "edit", String(e.id), "--triggers", JSON.stringify([...JSON.parse(e.triggers || "[]"), te(re(t))])], Me = (e) => () => V(["sequence", "edit", String(e.id), "--triggers", "…"]), Ue = [{ key: "why", label: "Why", required: !0, placeholder: "The plan changed" }], Ge = (e) => ["sequence", "abandon", "--why", e.why.trim(), "--sure"], Ye = (e) => V(["sequence", "abandon", "--why", e.why.trim() || "…", "--sure"]), ze = {
  __name: "AbandonRun",
  props: { run: { type: Object, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t, u = E();
    return (o, i) => (r(), f(s(J), {
      title: `Abandon run ${e.run.id}`,
      submit: "Abandon the run",
      fields: s(Ue),
      command: s(Ye),
      run: (a) => s(u).run(s(Ge)(a)),
      onClose: i[0] || (i[0] = (a) => n("close"))
    }, null, 8, ["title", "fields", "command", "run"]));
  }
}, He = {
  __name: "AddTrigger",
  props: { sequence: { type: Object, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, u = t, o = E(), i = (a) => o.run(Be(n.sequence, a));
    return (a, g) => (r(), f(s(J), {
      title: "Add trigger",
      submit: "Add the trigger",
      fields: s(Je),
      command: s(Me)(e.sequence),
      check: s(Ve),
      run: i,
      onClose: g[0] || (g[0] = (l) => u("close"))
    }, null, 8, ["fields", "command", "check"]));
  }
}, oe = {
  __name: "StepCards",
  props: { steps: { type: Array, required: !0 } },
  emits: ["steps"],
  setup(e, { emit: t }) {
    const n = t;
    return (u, o) => (r(), f(s(pe), {
      items: e.steps,
      kind: "step",
      noun: "Step",
      placeholder: "What the agent does in this step",
      "add-label": "Add a step",
      onItems: o[0] || (o[0] = (i) => n("steps", i))
    }, null, 8, ["items"]));
  }
}, Ke = {
  __name: "EditSteps",
  props: { sequence: { type: Object, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, u = t, o = E(), i = (a) => o.run(Le(n.sequence, a));
    return (a, g) => (r(), f(s(J), {
      title: `Edit ${e.sequence.title}`,
      submit: "Save the steps",
      fields: [s(se)([...e.sequence.steps])],
      command: s(Pe)(e.sequence),
      check: s(ae),
      run: i,
      onClose: g[0] || (g[0] = (l) => u("close"))
    }, {
      steps: _(({ value: l, set: q }) => [
        b(oe, {
          steps: l,
          onSteps: q
        }, null, 8, ["steps", "onSteps"])
      ]),
      _: 1
    }, 8, ["title", "fields", "command", "check"]));
  }
}, Q = {
  __name: "NewSequence",
  props: { title: { type: String, default: "" }, steps: { type: Array, default: () => [""] } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, u = t, o = E(), i = (a) => o.run(We(a));
    return (a, g) => (r(), f(s(J), {
      title: "New sequence",
      submit: "Make the sequence",
      fields: s(Re)(n.title, n.steps),
      command: s(je),
      check: s(Ie),
      run: i,
      onClose: g[0] || (g[0] = (l) => u("close"))
    }, {
      steps: _(({ value: l, set: q }) => [
        b(oe, {
          steps: l,
          onSteps: q
        }, null, 8, ["steps", "onSteps"])
      ]),
      _: 1
    }, 8, ["fields", "command", "check"]));
  }
}, Qe = (e) => JSON.parse(e.steps), B = (e, t) => t.filter((n) => n.sequence_id === e.id), G = (e) => JSON.parse(e.triggers || "[]"), N = (e) => ({ done: e.step_number - 1, total: Qe(e).length }), ue = (e, t) => e.id === Math.max(...t.filter((n) => n.session_agent_id === e.session_agent_id).map((n) => n.id));
function Xe(e, t) {
  const n = B(e, t).length;
  return `${e.steps.length} steps · ${n ? `${n} running now` : ee(G(e))[0]}`;
}
const M = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [u, o] of t)
    n[u] = o;
  return n;
}, Ze = {
  class: "sequence-runs",
  "data-sequence-runs": ""
}, et = {
  key: 0,
  class: "none",
  "data-runs-none": ""
}, tt = { class: "run-number" }, nt = ["aria-valuenow", "aria-valuemax"], st = { class: "run-words" }, at = ["onClick"], lt = {
  __name: "SequenceRuns",
  props: { runs: { type: Array, required: !0 }, all: { type: Array, required: !0 } },
  emits: ["abandon"],
  setup(e, { emit: t }) {
    const n = t, u = (o) => `Step ${o.step_number} of ${N(o).total}${o.step_started ? "" : ", not started yet"}`;
    return (o, i) => (r(), m("section", Ze, [
      e.runs.length ? x("", !0) : (r(), m("p", et, "No run is going now")),
      (r(!0), m(C, null, L(e.runs, (a) => (r(), m("div", {
        key: a.id,
        class: "run",
        "data-run": ""
      }, [
        h("span", tt, k(a.id), 1),
        b(s(Z), {
          name: `Agent ${a.session_agent_id}`
        }, null, 8, ["name"]),
        h("span", {
          class: "bar",
          role: "progressbar",
          "aria-valuenow": s(N)(a).done,
          "aria-valuemin": "0",
          "aria-valuemax": s(N)(a).total
        }, [
          h("i", {
            style: X({ width: `${s(N)(a).done / s(N)(a).total * 100}%` })
          }, null, 4)
        ], 8, nt),
        h("span", st, k(u(a)), 1),
        s(ue)(a, e.all) ? (r(), m("button", {
          key: 0,
          type: "button",
          class: "abandon",
          "data-run-abandon": "",
          onClick: (g) => n("abandon", a)
        }, "Abandon", 8, at)) : x("", !0)
      ]))), 128))
    ]));
  }
}, rt = /* @__PURE__ */ M(lt, [["__scopeId", "data-v-7c86d6bf"]]), ot = {
  class: "sequence-steps",
  "data-sequence-steps": ""
}, ut = {
  key: 0,
  class: "progress",
  "data-step-progress": ""
}, it = ["aria-valuenow", "aria-valuemax"], dt = { class: "progress-words" }, ct = { class: "steps" }, pt = { class: "step-number" }, mt = { class: "step-body" }, gt = {
  class: "step-guard",
  "data-step-guard": ""
}, vt = {
  key: 0,
  class: "badge-quiet",
  "data-step-state": ""
}, bt = {
  __name: "SequenceSteps",
  props: { sequence: { type: Object, required: !0 }, runs: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = O(() => JSON.parse(t.sequence.step_guards || "[]")), u = (l) => n.value[l] ?? { file_edits_allowed: !0, allowed_commands: [] }, o = (l) => [u(l).file_edits_allowed ? "File edits allowed" : "File edits wait", ...u(l).allowed_commands].join(", "), i = O(() => t.runs.length ? N(t.runs.reduce((l, q) => q.step_number > l.step_number ? q : l)) : null), a = O(() => t.runs.length ? Math.min(...t.runs.map((l) => l.step_number)) : 0), g = (l) => t.runs.some((q) => q.step_number === l + 1) ? "In progress" : t.runs.length && l + 1 < a.value ? "Done" : "";
    return (l, q) => (r(), m("section", ot, [
      i.value ? (r(), m("div", ut, [
        h("span", {
          class: "bar",
          role: "progressbar",
          "aria-valuenow": i.value.done,
          "aria-valuemin": "0",
          "aria-valuemax": i.value.total
        }, [
          h("i", {
            style: X({ width: `${i.value.done / i.value.total * 100}%` })
          }, null, 4)
        ], 8, it),
        h("span", dt, k(i.value.done) + " of " + k(i.value.total) + " done", 1)
      ])) : x("", !0),
      h("ol", ct, [
        (r(!0), m(C, null, L(e.sequence.steps, (w, y) => (r(), m("li", {
          key: y,
          class: "step",
          "data-step": ""
        }, [
          h("span", pt, k(y + 1), 1),
          h("div", mt, [
            b(s(me), {
              class: "step-text",
              text: w
            }, null, 8, ["text"]),
            h("span", gt, k(o(y)), 1)
          ]),
          g(y) ? (r(), m("span", vt, k(g(y)), 1)) : x("", !0)
        ]))), 128))
      ])
    ]));
  }
}, yt = /* @__PURE__ */ M(bt, [["__scopeId", "data-v-b82a754d"]]), _t = {
  class: "sequence-triggers",
  "data-sequence-triggers": ""
}, qt = { class: "head" }, ht = { class: "label" }, ft = ["onUpdate:modelValue", "placeholder", "aria-label", "data-trigger-field"], kt = { class: "foot" }, $t = {
  class: "note",
  role: "status"
}, wt = {
  __name: "SequenceTriggers",
  props: { sequence: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = E(), u = R.map((y) => ({ key: y.value, label: y.label })), o = O(() => JSON.parse(t.sequence.triggers || "[]")), i = O(() => ee(o.value)), a = j(null), g = j(""), l = O(() => a.value ? ne(a.value) : ""), q = () => a.value = o.value.map((y) => ({ ...U(), ...y }));
    async function w() {
      const y = await n.run(["sequence", "edit", String(t.sequence.id), "--triggers", JSON.stringify(a.value.map(te))]);
      g.value = y.ok ? "" : y.error, y.ok && (a.value = null);
    }
    return (y, v) => (r(), m("section", _t, [
      h("header", qt, [
        v[3] || (v[3] = h("span", { class: "title" }, "Starts", -1)),
        a.value ? x("", !0) : (r(), f(s(W), {
          key: 0,
          small: "",
          "data-sequence-triggers-edit": "",
          onClick: q
        }, {
          default: _(() => [
            b(s(ge), {
              name: "pencil",
              size: 12
            }),
            v[2] || (v[2] = T(" Edit", -1))
          ]),
          _: 1
        }))
      ]),
      a.value ? (r(), m(C, { key: 1 }, [
        (r(!0), m(C, null, L(a.value, ($, I) => (r(), m("div", {
          key: I,
          class: "card",
          "data-sequence-trigger-card": ""
        }, [
          b(s(ve), {
            options: s(u),
            value: $.trigger_type,
            onPick: (d) => $.trigger_type = d
          }, null, 8, ["options", "value", "onPick"]),
          (r(!0), m(C, null, L(s(D)($.trigger_type).fields, (d) => (r(), m(C, {
            key: d.name
          }, [
            h("label", ht, k(d.label), 1),
            de(h("input", {
              "onUpdate:modelValue": (F) => $[d.name] = F,
              placeholder: d.placeholder,
              "aria-label": d.label,
              "data-trigger-field": d.name
            }, null, 8, ft), [
              [ce, $[d.name]]
            ])
          ], 64))), 128)),
          b(s(W), {
            small: "",
            "data-sequence-trigger-remove": "",
            onClick: (d) => a.value.splice(I, 1)
          }, {
            default: _(() => [...v[4] || (v[4] = [
              T("Remove", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ]))), 128)),
        h("div", kt, [
          b(s(W), {
            small: "",
            "data-sequence-trigger-add": "",
            onClick: v[0] || (v[0] = ($) => a.value.push(s(U)()))
          }, {
            default: _(() => [...v[5] || (v[5] = [
              T("Add a trigger", -1)
            ])]),
            _: 1
          }),
          b(s(W), {
            small: "",
            variant: "primary",
            disabled: !!l.value,
            "data-sequence-triggers-save": "",
            onClick: w
          }, {
            default: _(() => [...v[6] || (v[6] = [
              T("Save", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          b(s(W), {
            small: "",
            onClick: v[1] || (v[1] = ($) => a.value = null)
          }, {
            default: _(() => [...v[7] || (v[7] = [
              T("Cancel", -1)
            ])]),
            _: 1
          }),
          h("span", $t, k(g.value || l.value), 1)
        ])
      ], 64)) : (r(!0), m(C, { key: 0 }, L(i.value, ($) => (r(), m("p", {
        key: $,
        class: "line",
        "data-sequence-trigger": ""
      }, k($), 1))), 128))
    ]));
  }
}, St = /* @__PURE__ */ M(wt, [["__scopeId", "data-v-4037395c"]]), Ot = {
  class: "run-head",
  "data-run-head": ""
}, At = {
  __name: "SequenceReader",
  props: { sequence: { type: Object, required: !0 }, runs: { type: Array, required: !0 }, items: { type: Array, required: !0 } },
  emits: ["abandon"],
  setup(e, { emit: t }) {
    const n = e, u = t, o = O(() => B(n.sequence, n.runs)), i = O(() => [
      { key: "steps", label: "Steps", count: n.sequence.steps.length },
      { key: "runs", label: "Runs", count: o.value.length },
      { key: "triggers", label: "Triggers", count: G(n.sequence).length }
    ]), a = O(() => o.value[0] ?? null);
    return (g, l) => (r(), f(s(be), {
      title: e.sequence.title,
      number: String(e.sequence.id),
      tabs: i.value,
      "data-sequence-reader": ""
    }, {
      agent: _(() => [
        a.value ? (r(), m(C, { key: 0 }, [
          h("span", Ot, "Run " + k(a.value.id) + " · step " + k(a.value.step_number) + " of " + k(s(N)(a.value).total), 1),
          b(s(Z), {
            name: `Agent ${a.value.session_agent_id}`
          }, null, 8, ["name"])
        ], 64)) : x("", !0)
      ]),
      actions: _(() => [
        b(s(_e), {
          items: e.items,
          head: `Sequence ${e.sequence.id}`
        }, null, 8, ["items", "head"])
      ]),
      default: _(({ tab: q }) => [
        b(s(ye), { value: q }, {
          steps: _(() => [
            b(yt, {
              sequence: e.sequence,
              runs: o.value
            }, null, 8, ["sequence", "runs"])
          ]),
          runs: _(() => [
            b(rt, {
              runs: o.value,
              all: e.runs,
              onAbandon: l[0] || (l[0] = (w) => u("abandon", w))
            }, null, 8, ["runs", "all"])
          ]),
          triggers: _(() => [
            b(St, { sequence: e.sequence }, null, 8, ["sequence"])
          ]),
          _: 1
        }, 8, ["value"])
      ]),
      _: 1
    }, 8, ["title", "number", "tabs"]));
  }
};
function Ct(e, t, { act: n, ask: u, open: o = null }) {
  const i = B(e, t), a = i.filter((l) => ue(l, t)), g = (l) => async ({ say: q }) => {
    const w = await l.line();
    q(w.ok ? l.done : w.error);
  };
  return [
    ...o ? [{ label: "Open", group: "open", run: o }] : [],
    { label: "Start", group: "own", disabled: i.length > 0, reason: "Running", run: g({ line: () => n(["sequence", "run", String(e.id)]), done: `Sequence ${e.id} started` }) },
    ...a.map((l) => ({ label: `Abandon run ${l.id}`, group: "own", run: () => u("abandon", e, l) })),
    { label: "Edit steps", group: "own", run: () => u("steps", e) },
    { label: "Add trigger", group: "own", run: () => u("trigger", e) },
    { label: "Duplicate", group: "own", run: () => u("copy", e) },
    qe({ name: `sequence ${e.id}`, remove: () => n(["sequence", "delete", String(e.id)], he(e.id)) })
  ];
}
const xt = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-sequences-failure": ""
}, Tt = {
  key: 0,
  class: "badge-quiet",
  "data-sequence-running": ""
}, Nt = 460, Rt = {
  __name: "SequenceCards",
  setup(e) {
    const t = E(), { rows: n, data: u, failure: o, loaded: i, act: a, actionFailure: g } = t.props.board, l = O(() => {
      var p;
      return ((p = u.value) == null ? void 0 : p.runs) ?? [];
    }), q = O(() => n.value.map((p) => ({ id: p.id, title: `${p.id} ${p.title}`, desc: Xe(p, l.value), row: p, running: B(p, l.value).length > 0 }))), w = [
      { key: "state", label: "State", options: [["Running", "Running"], ["Idle", "Idle"]], get: (p) => p.running ? "Running" : "Idle" },
      { key: "trigger", label: "Trigger", options: R.map((p) => [p.value, p.label]), get: (p) => G(p.row).map((c) => c.trigger_type) }
    ], y = j(fe(w)), v = j(""), $ = O(() => ke(q.value, w, y.value, v.value, ["title", "desc"])), I = j(null), d = j(null), F = (p, c, S = null) => d.value = { kind: p, sequence: c, run: S }, Y = (p, c = null) => Ct(p, l.value, { act: a, ask: F, open: c }), ie = (p) => ({ head: `Sequence ${p.id}`, items: Y(p.row, () => I.value = p.id) });
    return (p, c) => (r(), f(s($e), {
      chosen: I.value,
      "onUpdate:chosen": c[8] || (c[8] = (S) => I.value = S),
      items: $.value,
      "list-width": Nt,
      place: ie,
      "empty-title": "No sequences yet",
      "pick-line": "Choose a sequence",
      "data-sequences": ""
    }, {
      top: _(() => {
        var S, P, z, H, K;
        return [
          b(s(Se), {
            title: "Sequences",
            count: s(n).length
          }, {
            primary: _(() => [
              b(s(W), {
                small: "",
                variant: "primary",
                "data-sequence-new": "",
                onClick: c[0] || (c[0] = (A) => F("new"))
              }, {
                default: _(() => [...c[9] || (c[9] = [
                  T("New sequence", -1)
                ])]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["count"]),
          b(s(Oe), {
            modelValue: y.value,
            "onUpdate:modelValue": c[1] || (c[1] = (A) => y.value = A),
            words: v.value,
            "onUpdate:words": c[2] || (c[2] = (A) => v.value = A),
            fields: w,
            rows: q.value,
            shown: $.value.length,
            placeholder: "Search sequences"
          }, null, 8, ["modelValue", "words", "rows", "shown"]),
          s(o) || s(g) ? (r(), m("p", xt, k(s(o) || s(g)), 1)) : x("", !0),
          ((S = d.value) == null ? void 0 : S.kind) === "new" ? (r(), f(Q, {
            key: 1,
            onClose: c[3] || (c[3] = (A) => d.value = null)
          })) : ((P = d.value) == null ? void 0 : P.kind) === "copy" ? (r(), f(Q, {
            key: 2,
            title: `${d.value.sequence.title} copy`,
            steps: [...d.value.sequence.steps],
            onClose: c[4] || (c[4] = (A) => d.value = null)
          }, null, 8, ["title", "steps"])) : ((z = d.value) == null ? void 0 : z.kind) === "steps" ? (r(), f(Ke, {
            key: 3,
            sequence: d.value.sequence,
            onClose: c[5] || (c[5] = (A) => d.value = null)
          }, null, 8, ["sequence"])) : ((H = d.value) == null ? void 0 : H.kind) === "trigger" ? (r(), f(He, {
            key: 4,
            sequence: d.value.sequence,
            onClose: c[6] || (c[6] = (A) => d.value = null)
          }, null, 8, ["sequence"])) : ((K = d.value) == null ? void 0 : K.kind) === "abandon" ? (r(), f(ze, {
            key: 5,
            run: d.value.run,
            onClose: c[7] || (c[7] = (A) => d.value = null)
          }, null, 8, ["run"])) : x("", !0)
        ];
      }),
      empty: _(() => [
        s(i) ? (r(), m(C, { key: 1 }, [
          T("A sequence is steps an agent works through in order.")
        ], 64)) : (r(), f(s(we), {
          key: 0,
          shape: "rows"
        }))
      ]),
      meta: _(({ item: S }) => [
        S.running ? (r(), m("span", Tt, "Running")) : x("", !0)
      ]),
      reader: _(({ item: S }) => [
        b(At, {
          sequence: S.row,
          runs: l.value,
          items: Y(S.row),
          onAbandon: (P) => F("abandon", S.row, P)
        }, null, 8, ["sequence", "runs", "items", "onAbandon"])
      ]),
      _: 1
    }, 8, ["chosen", "items"]));
  }
}, jt = /* @__PURE__ */ M(Rt, [["__scopeId", "data-v-dcaf6acf"]]);
export {
  jt as default
};
