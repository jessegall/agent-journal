if (!document.getElementById("window-styles-1fa04fdeb981")) { const style = document.createElement("style"); style.id = "window-styles-1fa04fdeb981"; style.textContent = ".run[data-v-d89d02e5]{display:flex;align-items:center;gap:var(--s3);padding:8px 0;border-bottom:1px solid var(--border-inner);font-size:12.5px}.run-number[data-v-d89d02e5]{flex:none;width:30px;color:var(--text-3);font-variant-numeric:tabular-nums}.bar[data-v-d89d02e5]{flex:1;min-width:40px;height:4px;overflow:hidden;border-radius:2px;background:var(--border-2)}.bar i[data-v-d89d02e5]{display:block;height:100%;background:var(--accent)}.run-words[data-v-d89d02e5]{flex:none;color:var(--text-3);font-size:12px;white-space:nowrap}.abandon[data-v-d89d02e5]{flex:none;border:0;background:none;color:var(--text-2);font:inherit;font-size:12px;cursor:pointer}.none[data-v-d89d02e5]{margin:0;color:var(--text-3);font-size:12.5px}.progress[data-v-f42e011f]{display:flex;align-items:center;gap:var(--s3);margin:4px 0 14px}.bar[data-v-f42e011f]{flex:1;height:4px;overflow:hidden;border-radius:2px;background:var(--border-2)}.bar i[data-v-f42e011f]{display:block;height:100%;background:var(--accent)}.progress-words[data-v-f42e011f]{color:var(--text-3);font-size:12px;font-variant-numeric:tabular-nums;white-space:nowrap}.steps[data-v-f42e011f]{margin:0;padding:0;list-style:none}.step[data-v-f42e011f]{display:flex;align-items:flex-start;gap:var(--s3);padding:8px 0;border-bottom:1px solid var(--border-inner)}.step-number[data-v-f42e011f]{flex:none;width:18px;color:var(--text-3);font-size:12px;text-align:right;font-variant-numeric:tabular-nums}.step-body[data-v-f42e011f]{flex:1;min-width:0}.step-text[data-v-f42e011f]{color:var(--text-2)}.step-guard[data-v-f42e011f]{display:block;color:var(--text-3);font-size:12px}.sequence-triggers[data-v-2da9d503]{margin-bottom:14px}.head[data-v-2da9d503]{display:flex;gap:8px;align-items:center;margin-bottom:6px}.title[data-v-2da9d503],.label[data-v-2da9d503],.note[data-v-2da9d503]{color:var(--text-3);font-size:12px}.line[data-v-2da9d503]{margin:0 0 2px;font-size:13px}.card[data-v-2da9d503]{display:flex;flex-direction:column;align-items:flex-start;gap:6px;margin-bottom:8px;padding:10px;border:1px solid var(--border);border-radius:8px}.card input[data-v-2da9d503]{width:100%;padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:13px}.foot[data-v-2da9d503]{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.failure[data-v-70b9e7dc]{margin:0;padding:6px var(--inset);color:var(--bad, var(--text-2));font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as u, createBlock as C, unref as s, withCtx as m, createVNode as c, createElementBlock as v, createCommentVNode as x, Fragment as A, renderList as L, createElementVNode as h, toDisplayString as f, normalizeStyle as z, computed as S, ref as j, createTextVNode as T, withDirectives as oe, vModelText as ue } from "vue";
import { useWindow as E, CreateDialog as D, TextList as ie, AgentBadge as H, TextDisplay as de, Btn as W, Icon as ce, Segmented as pe, Reader as me, SwitchCase as K, ActionsMenu as ge, deleteItem as ve, removed as be, defaultFilter as _e, applyFilter as ye, ListReaderLayout as qe, Skeleton as he, PageHeader as fe, FilterBar as ke } from "@journal/window-kit";
const R = [
  { value: "row", label: "A record is made", fields: [{ name: "event", label: "Record and event", placeholder: "plan.create" }] },
  { value: "phrase", label: "You ask for it", fields: [{ name: "text", label: "Words you write", placeholder: "an update please" }] },
  { value: "command", label: "A command runs", fields: [{ name: "pattern", label: "Pattern on the command line", placeholder: "^git push" }] },
  { value: "file", label: "A file is edited", fields: [{ name: "pattern", label: "Files, as a path glob", placeholder: "src/*.py" }] },
  { value: "file-text", label: "An edit adds text", fields: [{ name: "pattern", label: "Files, as a path glob", placeholder: "src/*.py" }, { name: "text", label: "Text in the new content", placeholder: "TODO" }] },
  { value: "tool", label: "A tool is used", fields: [{ name: "tool", label: "Tool name", placeholder: "Edit" }, { name: "pattern", label: "Pattern on its input, if any", placeholder: "migrations/" }] }
], P = (e) => R.find((t) => t.value === e) ?? R[0], $e = {
  row: (e) => `When ${e.event} happens`,
  phrase: (e) => `When you ask “${e.text}”`,
  command: (e) => `When a command matching “${e.pattern}” runs`,
  file: (e) => `When a file matching “${e.pattern}” is edited`,
  "file-text": (e) => `When an edit to “${e.pattern}” adds “${e.text}”`,
  tool: (e) => `When ${e.tool} is used${e.pattern ? ` with “${e.pattern}” in its input` : ""}`
}, we = (e) => $e[e.trigger_type](e), Q = (e) => e.length ? e.map(we) : ["Only when you or the agent start it"], M = () => ({ trigger_type: "phrase", event: "", text: "", pattern: "", tool: "" });
function X(e) {
  const t = P(e.trigger_type).fields.map((n) => [n.name, (e[n.name] || "").trim()]);
  return { trigger_type: e.trigger_type, ...Object.fromEntries(t.filter(([, n]) => n)) };
}
const Se = { tool: ["pattern"] };
function Z(e) {
  const t = e.find((n) => P(n.trigger_type).fields.some((o) => !(Se[n.trigger_type] ?? []).includes(o.name) && !(n[o.name] || "").trim()));
  return t ? `${P(t.trigger_type).label}: complete every field.` : "";
}
const Oe = "Add instructions for each step.", ee = (e) => ({ key: "steps", label: "Steps, in order", kind: "slot", required: !0, value: e }), te = (e) => e.steps.some((t) => !t.trim()) ? { steps: Oe } : {}, Ae = (e) => /\s/.test(e) ? JSON.stringify(e) : e, J = (e) => `journal ${e.map(Ae).join(" ")}`, Ce = (e = "", t = [""]) => [{ key: "title", label: "Title", required: !0, placeholder: "Releasing a version", value: e }, ee(t)], xe = (e) => e.title.trim() ? te(e) : { title: "Give the sequence a title." }, Te = (e) => ["sequence", "make", e.title.trim(), "--steps", e.steps.map((t) => t.trim()).join(" | ")], Ne = (e) => J(["sequence", "make", e.title.trim() || "…", "--steps", e.steps.map((t) => t.trim()).join(" | ") || "…"]), Re = (e) => JSON.parse(e.step_guards || "[]"), Ie = { file_edits_allowed: !0, allowed_commands: [] }, We = (e, t) => ["sequence", "edit", String(e.id), "--steps", ...t.steps.map((n) => n.trim()), "--step-guards", JSON.stringify(t.steps.map((n, o) => Re(e)[o] ?? Ie))], je = (e) => () => J(["sequence", "edit", String(e.id), "--steps", "…"]), ne = (e, t) => `${e.value}:${t}`, Ee = { tool: ["pattern"] }, Fe = [
  { key: "kind", label: "Starts when", kind: "select", options: R.map((e) => [e.value, e.label]) },
  ...R.flatMap((e) => e.fields.map((t) => ({ key: ne(e, t.name), label: t.label, placeholder: t.placeholder, required: !(Ee[e.value] ?? []).includes(t.name), when: (n) => n.kind === e.value })))
], se = (e) => ({ ...M(), trigger_type: e.kind, ...Object.fromEntries(R.find((t) => t.value === e.kind).fields.map((t) => [t.name, e[ne({ value: e.kind }, t.name)] ?? ""])) }), Le = (e) => Z([se(e)]) ? { [Object.keys(e).find((n) => n.startsWith(`${e.kind}:`))]: "Complete every field." } : {}, Pe = (e, t) => ["sequence", "edit", String(e.id), "--triggers", JSON.stringify([...JSON.parse(e.triggers || "[]"), X(se(t))])], De = (e) => () => J(["sequence", "edit", String(e.id), "--triggers", "…"]), Je = [{ key: "why", label: "Why", required: !0, placeholder: "The plan changed" }], Ve = (e) => ["sequence", "abandon", "--why", e.why.trim(), "--sure"], Be = (e) => J(["sequence", "abandon", "--why", e.why.trim() || "…", "--sure"]), Me = {
  __name: "AbandonRun",
  props: { run: { type: Object, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t, o = E();
    return (r, i) => (u(), C(s(D), {
      title: `Abandon run ${e.run.id}`,
      submit: "Abandon the run",
      fields: s(Je),
      command: s(Be),
      run: (a) => s(o).run(s(Ve)(a)),
      onClose: i[0] || (i[0] = (a) => n("close"))
    }, null, 8, ["title", "fields", "command", "run"]));
  }
}, Ue = {
  __name: "AddTrigger",
  props: { sequence: { type: Object, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, o = t, r = E(), i = (a) => r.run(Pe(n.sequence, a));
    return (a, b) => (u(), C(s(D), {
      title: "Add trigger",
      submit: "Add the trigger",
      fields: s(Fe),
      command: s(De)(e.sequence),
      check: s(Le),
      run: i,
      onClose: b[0] || (b[0] = (l) => o("close"))
    }, null, 8, ["fields", "command", "check"]));
  }
}, ae = {
  __name: "StepCards",
  props: { steps: { type: Array, required: !0 } },
  emits: ["steps"],
  setup(e, { emit: t }) {
    const n = t;
    return (o, r) => (u(), C(s(ie), {
      items: e.steps,
      kind: "step",
      noun: "Step",
      placeholder: "What the agent does in this step",
      "add-label": "Add a step",
      onItems: r[0] || (r[0] = (i) => n("steps", i))
    }, null, 8, ["items"]));
  }
}, Ge = {
  __name: "EditSteps",
  props: { sequence: { type: Object, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, o = t, r = E(), i = (a) => r.run(We(n.sequence, a));
    return (a, b) => (u(), C(s(D), {
      title: `Edit ${e.sequence.title}`,
      submit: "Save the steps",
      fields: [s(ee)([...e.sequence.steps])],
      command: s(je)(e.sequence),
      check: s(te),
      run: i,
      onClose: b[0] || (b[0] = (l) => o("close"))
    }, {
      steps: m(({ value: l, set: q }) => [
        c(ae, {
          steps: l,
          onSteps: q
        }, null, 8, ["steps", "onSteps"])
      ]),
      _: 1
    }, 8, ["title", "fields", "command", "check"]));
  }
}, Y = {
  __name: "NewSequence",
  props: { title: { type: String, default: "" }, steps: { type: Array, default: () => [""] } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, o = t, r = E(), i = (a) => r.run(Te(a));
    return (a, b) => (u(), C(s(D), {
      title: "New sequence",
      submit: "Make the sequence",
      fields: s(Ce)(n.title, n.steps),
      command: s(Ne),
      check: s(xe),
      run: i,
      onClose: b[0] || (b[0] = (l) => o("close"))
    }, {
      steps: m(({ value: l, set: q }) => [
        c(ae, {
          steps: l,
          onSteps: q
        }, null, 8, ["steps", "onSteps"])
      ]),
      _: 1
    }, 8, ["fields", "command", "check"]));
  }
}, Ye = (e) => JSON.parse(e.steps), V = (e, t) => t.filter((n) => n.sequence_id === e.id), U = (e) => JSON.parse(e.triggers || "[]"), N = (e) => ({ done: e.step_number - 1, total: Ye(e).length }), le = (e, t) => e.id === Math.max(...t.filter((n) => n.session_agent_id === e.session_agent_id).map((n) => n.id));
function ze(e, t) {
  const n = V(e, t).length;
  return `${e.steps.length} steps · ${n ? `${n} running now` : Q(U(e))[0]}`;
}
const B = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, r] of t)
    n[o] = r;
  return n;
}, He = {
  class: "sequence-runs",
  "data-sequence-runs": ""
}, Ke = {
  key: 0,
  class: "none",
  "data-runs-none": ""
}, Qe = { class: "run-number" }, Xe = ["aria-valuenow", "aria-valuemax"], Ze = { class: "run-words" }, et = ["onClick"], tt = {
  __name: "SequenceRuns",
  props: { runs: { type: Array, required: !0 }, all: { type: Array, required: !0 } },
  emits: ["abandon"],
  setup(e, { emit: t }) {
    const n = t, o = (r) => `Step ${r.step_number} of ${N(r).total}${r.step_started ? "" : ", not started yet"}`;
    return (r, i) => (u(), v("section", He, [
      e.runs.length ? x("", !0) : (u(), v("p", Ke, "No run is going now")),
      (u(!0), v(A, null, L(e.runs, (a) => (u(), v("div", {
        key: a.id,
        class: "run",
        "data-run": ""
      }, [
        h("span", Qe, f(a.id), 1),
        c(s(H), {
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
            style: z({ width: `${s(N)(a).done / s(N)(a).total * 100}%` })
          }, null, 4)
        ], 8, Xe),
        h("span", Ze, f(o(a)), 1),
        s(le)(a, e.all) ? (u(), v("button", {
          key: 0,
          type: "button",
          class: "abandon",
          "data-run-abandon": "",
          onClick: (b) => n("abandon", a)
        }, "Abandon", 8, et)) : x("", !0)
      ]))), 128))
    ]));
  }
}, nt = /* @__PURE__ */ B(tt, [["__scopeId", "data-v-d89d02e5"]]), st = {
  class: "sequence-steps",
  "data-sequence-steps": ""
}, at = {
  key: 0,
  class: "progress",
  "data-step-progress": ""
}, lt = ["aria-valuenow", "aria-valuemax"], rt = { class: "progress-words" }, ot = { class: "steps" }, ut = { class: "step-number" }, it = { class: "step-body" }, dt = {
  class: "step-guard",
  "data-step-guard": ""
}, ct = {
  key: 0,
  class: "badge-quiet",
  "data-step-state": ""
}, pt = {
  __name: "SequenceSteps",
  props: { sequence: { type: Object, required: !0 }, runs: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = S(() => JSON.parse(t.sequence.step_guards || "[]")), o = (l) => n.value[l] ?? { file_edits_allowed: !0, allowed_commands: [] }, r = (l) => [o(l).file_edits_allowed ? "File edits allowed" : "File edits wait", ...o(l).allowed_commands].join(", "), i = S(() => t.runs.length ? N(t.runs.reduce((l, q) => q.step_number > l.step_number ? q : l)) : null), a = S(() => t.runs.length ? Math.min(...t.runs.map((l) => l.step_number)) : 0), b = (l) => t.runs.some((q) => q.step_number === l + 1) ? "In progress" : t.runs.length && l + 1 < a.value ? "Done" : "";
    return (l, q) => (u(), v("section", st, [
      i.value ? (u(), v("div", at, [
        h("span", {
          class: "bar",
          role: "progressbar",
          "aria-valuenow": i.value.done,
          "aria-valuemin": "0",
          "aria-valuemax": i.value.total
        }, [
          h("i", {
            style: z({ width: `${i.value.done / i.value.total * 100}%` })
          }, null, 4)
        ], 8, lt),
        h("span", rt, f(i.value.done) + " of " + f(i.value.total) + " done", 1)
      ])) : x("", !0),
      h("ol", ot, [
        (u(!0), v(A, null, L(e.sequence.steps, ($, y) => (u(), v("li", {
          key: y,
          class: "step",
          "data-step": ""
        }, [
          h("span", ut, f(y + 1), 1),
          h("div", it, [
            c(s(de), {
              class: "step-text",
              text: $
            }, null, 8, ["text"]),
            h("span", dt, f(r(y)), 1)
          ]),
          b(y) ? (u(), v("span", ct, f(b(y)), 1)) : x("", !0)
        ]))), 128))
      ])
    ]));
  }
}, mt = /* @__PURE__ */ B(pt, [["__scopeId", "data-v-f42e011f"]]), gt = {
  class: "sequence-triggers",
  "data-sequence-triggers": ""
}, vt = { class: "head" }, bt = { class: "label" }, _t = ["onUpdate:modelValue", "placeholder", "aria-label", "data-trigger-field"], yt = { class: "foot" }, qt = {
  class: "note",
  role: "status"
}, ht = {
  __name: "SequenceTriggers",
  props: { sequence: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = E(), o = R.map((y) => ({ key: y.value, label: y.label })), r = S(() => JSON.parse(t.sequence.triggers || "[]")), i = S(() => Q(r.value)), a = j(null), b = j(""), l = S(() => a.value ? Z(a.value) : ""), q = () => a.value = r.value.map((y) => ({ ...M(), ...y }));
    async function $() {
      const y = await n.run(["sequence", "edit", String(t.sequence.id), "--triggers", JSON.stringify(a.value.map(X))]);
      b.value = y.ok ? "" : y.error, y.ok && (a.value = null);
    }
    return (y, _) => (u(), v("section", gt, [
      h("header", vt, [
        _[3] || (_[3] = h("span", { class: "title" }, "Starts", -1)),
        a.value ? x("", !0) : (u(), C(s(W), {
          key: 0,
          small: "",
          "data-sequence-triggers-edit": "",
          onClick: q
        }, {
          default: m(() => [
            c(s(ce), {
              name: "pencil",
              size: 12
            }),
            _[2] || (_[2] = T(" Edit", -1))
          ]),
          _: 1
        }))
      ]),
      a.value ? (u(), v(A, { key: 1 }, [
        (u(!0), v(A, null, L(a.value, (k, I) => (u(), v("div", {
          key: I,
          class: "card",
          "data-sequence-trigger-card": ""
        }, [
          c(s(pe), {
            options: s(o),
            value: k.trigger_type,
            onPick: (g) => k.trigger_type = g
          }, null, 8, ["options", "value", "onPick"]),
          (u(!0), v(A, null, L(s(P)(k.trigger_type).fields, (g) => (u(), v(A, {
            key: g.name
          }, [
            h("label", bt, f(g.label), 1),
            oe(h("input", {
              "onUpdate:modelValue": (F) => k[g.name] = F,
              placeholder: g.placeholder,
              "aria-label": g.label,
              "data-trigger-field": g.name
            }, null, 8, _t), [
              [ue, k[g.name]]
            ])
          ], 64))), 128)),
          c(s(W), {
            small: "",
            "data-sequence-trigger-remove": "",
            onClick: (g) => a.value.splice(I, 1)
          }, {
            default: m(() => [..._[4] || (_[4] = [
              T("Remove", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ]))), 128)),
        h("div", yt, [
          c(s(W), {
            small: "",
            "data-sequence-trigger-add": "",
            onClick: _[0] || (_[0] = (k) => a.value.push(s(M)()))
          }, {
            default: m(() => [..._[5] || (_[5] = [
              T("Add a trigger", -1)
            ])]),
            _: 1
          }),
          c(s(W), {
            small: "",
            variant: "primary",
            disabled: !!l.value,
            "data-sequence-triggers-save": "",
            onClick: $
          }, {
            default: m(() => [..._[6] || (_[6] = [
              T("Save", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          c(s(W), {
            small: "",
            onClick: _[1] || (_[1] = (k) => a.value = null)
          }, {
            default: m(() => [..._[7] || (_[7] = [
              T("Cancel", -1)
            ])]),
            _: 1
          }),
          h("span", qt, f(b.value || l.value), 1)
        ])
      ], 64)) : (u(!0), v(A, { key: 0 }, L(i.value, (k) => (u(), v("p", {
        key: k,
        class: "line",
        "data-sequence-trigger": ""
      }, f(k), 1))), 128))
    ]));
  }
}, ft = /* @__PURE__ */ B(ht, [["__scopeId", "data-v-2da9d503"]]), kt = {
  class: "run-head",
  "data-run-head": ""
}, $t = {
  __name: "SequenceReader",
  props: { sequence: { type: Object, required: !0 }, runs: { type: Array, required: !0 }, items: { type: Array, required: !0 } },
  emits: ["abandon"],
  setup(e, { emit: t }) {
    const n = e, o = t, r = S(() => V(n.sequence, n.runs)), i = S(() => [
      { key: "steps", label: "Steps", count: n.sequence.steps.length },
      { key: "runs", label: "Runs", count: r.value.length },
      { key: "triggers", label: "Triggers", count: U(n.sequence).length }
    ]), a = S(() => r.value[0] ?? null);
    return (b, l) => (u(), C(s(me), {
      title: e.sequence.title,
      number: String(e.sequence.id),
      tabs: i.value,
      "data-sequence-reader": ""
    }, {
      agent: m(() => [
        a.value ? (u(), v(A, { key: 0 }, [
          h("span", kt, "Run " + f(a.value.id) + " · step " + f(a.value.step_number) + " of " + f(s(N)(a.value).total), 1),
          c(s(H), {
            name: `Agent ${a.value.session_agent_id}`
          }, null, 8, ["name"])
        ], 64)) : x("", !0)
      ]),
      actions: m(() => [
        c(s(ge), {
          items: e.items,
          head: `Sequence ${e.sequence.id}`
        }, null, 8, ["items", "head"])
      ]),
      default: m(({ tab: q }) => [
        c(s(K), { value: q }, {
          steps: m(() => [
            c(mt, {
              sequence: e.sequence,
              runs: r.value
            }, null, 8, ["sequence", "runs"])
          ]),
          runs: m(() => [
            c(nt, {
              runs: r.value,
              all: e.runs,
              onAbandon: l[0] || (l[0] = ($) => o("abandon", $))
            }, null, 8, ["runs", "all"])
          ]),
          triggers: m(() => [
            c(ft, { sequence: e.sequence }, null, 8, ["sequence"])
          ]),
          _: 1
        }, 8, ["value"])
      ]),
      _: 1
    }, 8, ["title", "number", "tabs"]));
  }
};
function wt(e, t, { act: n, ask: o, open: r = null }) {
  const i = V(e, t), a = i.filter((l) => le(l, t)), b = (l) => async ({ say: q }) => {
    const $ = await l.line();
    q($.ok ? l.done : $.error);
  };
  return [
    ...r ? [{ label: "Open", group: "open", run: r }] : [],
    { label: "Start", group: "own", disabled: i.length > 0, reason: "Running", run: b({ line: () => n(["sequence", "run", String(e.id)]), done: `Sequence ${e.id} started` }) },
    ...a.map((l) => ({ label: `Abandon run ${l.id}`, group: "own", run: () => o("abandon", e, l) })),
    { label: "Edit steps", group: "own", run: () => o("steps", e) },
    { label: "Add trigger", group: "own", run: () => o("trigger", e) },
    { label: "Duplicate", group: "own", run: () => o("copy", e) },
    ve({ name: `sequence ${e.id}`, remove: () => n(["sequence", "delete", String(e.id)], be(e.id)) })
  ];
}
const St = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-sequences-failure": ""
}, Ot = {
  key: 0,
  class: "badge-quiet",
  "data-sequence-running": ""
}, At = 460, Ct = {
  __name: "SequenceCards",
  setup(e) {
    const t = E(), { rows: n, data: o, failure: r, loaded: i, act: a, actionFailure: b } = t.props.board, l = S(() => {
      var p;
      return ((p = o.value) == null ? void 0 : p.runs) ?? [];
    }), q = S(() => n.value.map((p) => ({ id: p.id, title: `${p.id} ${p.title}`, desc: ze(p, l.value), row: p, running: V(p, l.value).length > 0 }))), $ = [
      { key: "state", label: "State", options: [["Running", "Running"], ["Idle", "Idle"]], get: (p) => p.running ? "Running" : "Idle" },
      { key: "trigger", label: "Trigger", options: R.map((p) => [p.value, p.label]), get: (p) => U(p.row).map((d) => d.trigger_type) }
    ], y = j(_e($)), _ = j(""), k = S(() => ye(q.value, $, y.value, _.value, ["title", "desc"])), I = j(null), g = j(null), F = (p, d, w = null) => g.value = { kind: p, sequence: d, run: w }, G = (p, d = null) => wt(p, l.value, { act: a, ask: F, open: d }), re = (p) => ({ head: `Sequence ${p.id}`, items: G(p.row, () => I.value = p.id) });
    return (p, d) => (u(), C(s(qe), {
      chosen: I.value,
      "onUpdate:chosen": d[8] || (d[8] = (w) => I.value = w),
      items: k.value,
      "list-width": At,
      place: re,
      "empty-title": "No sequences yet",
      "pick-line": "Choose a sequence",
      "data-sequences": ""
    }, {
      top: m(() => {
        var w;
        return [
          c(s(fe), {
            title: "Sequences",
            count: s(n).length
          }, {
            primary: m(() => [
              c(s(W), {
                small: "",
                variant: "primary",
                "data-sequence-new": "",
                onClick: d[0] || (d[0] = (O) => F("new"))
              }, {
                default: m(() => [...d[9] || (d[9] = [
                  T("New sequence", -1)
                ])]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["count"]),
          c(s(ke), {
            modelValue: y.value,
            "onUpdate:modelValue": d[1] || (d[1] = (O) => y.value = O),
            words: _.value,
            "onUpdate:words": d[2] || (d[2] = (O) => _.value = O),
            fields: $,
            rows: q.value,
            shown: k.value.length,
            placeholder: "Search sequences"
          }, null, 8, ["modelValue", "words", "rows", "shown"]),
          s(r) || s(b) ? (u(), v("p", St, f(s(r) || s(b)), 1)) : x("", !0),
          c(s(K), {
            value: (w = g.value) == null ? void 0 : w.kind
          }, {
            new: m(() => [
              c(Y, {
                onClose: d[3] || (d[3] = (O) => g.value = null)
              })
            ]),
            copy: m(() => [
              c(Y, {
                title: `${g.value.sequence.title} copy`,
                steps: [...g.value.sequence.steps],
                onClose: d[4] || (d[4] = (O) => g.value = null)
              }, null, 8, ["title", "steps"])
            ]),
            steps: m(() => [
              c(Ge, {
                sequence: g.value.sequence,
                onClose: d[5] || (d[5] = (O) => g.value = null)
              }, null, 8, ["sequence"])
            ]),
            trigger: m(() => [
              c(Ue, {
                sequence: g.value.sequence,
                onClose: d[6] || (d[6] = (O) => g.value = null)
              }, null, 8, ["sequence"])
            ]),
            abandon: m(() => [
              c(Me, {
                run: g.value.run,
                onClose: d[7] || (d[7] = (O) => g.value = null)
              }, null, 8, ["run"])
            ]),
            _: 1
          }, 8, ["value"])
        ];
      }),
      empty: m(() => [
        s(i) ? (u(), v(A, { key: 1 }, [
          T("A sequence is steps an agent works through in order.")
        ], 64)) : (u(), C(s(he), {
          key: 0,
          shape: "rows"
        }))
      ]),
      meta: m(({ item: w }) => [
        w.running ? (u(), v("span", Ot, "Running")) : x("", !0)
      ]),
      reader: m(({ item: w }) => [
        c($t, {
          sequence: w.row,
          runs: l.value,
          items: G(w.row),
          onAbandon: (O) => F("abandon", w.row, O)
        }, null, 8, ["sequence", "runs", "items", "onAbandon"])
      ]),
      _: 1
    }, 8, ["chosen", "items"]));
  }
}, Nt = /* @__PURE__ */ B(Ct, [["__scopeId", "data-v-70b9e7dc"]]);
export {
  Nt as default
};
