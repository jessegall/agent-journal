if (!document.getElementById("window-styles-4c0fa66e68ca")) { const style = document.createElement("style"); style.id = "window-styles-4c0fa66e68ca"; style.textContent = ".run[data-v-d89d02e5]{display:flex;align-items:center;gap:var(--s3);padding:8px 0;border-bottom:1px solid var(--border-inner);font-size:12.5px}.run-number[data-v-d89d02e5]{flex:none;width:30px;color:var(--text-3);font-variant-numeric:tabular-nums}.bar[data-v-d89d02e5]{flex:1;min-width:40px;height:4px;overflow:hidden;border-radius:2px;background:var(--border-2)}.bar i[data-v-d89d02e5]{display:block;height:100%;background:var(--accent)}.run-words[data-v-d89d02e5]{flex:none;color:var(--text-3);font-size:12px;white-space:nowrap}.abandon[data-v-d89d02e5]{flex:none;border:0;background:none;color:var(--text-2);font:inherit;font-size:12px;cursor:pointer}.none[data-v-d89d02e5]{margin:0;color:var(--text-3);font-size:12.5px}.progress[data-v-f42e011f]{display:flex;align-items:center;gap:var(--s3);margin:4px 0 14px}.bar[data-v-f42e011f]{flex:1;height:4px;overflow:hidden;border-radius:2px;background:var(--border-2)}.bar i[data-v-f42e011f]{display:block;height:100%;background:var(--accent)}.progress-words[data-v-f42e011f]{color:var(--text-3);font-size:12px;font-variant-numeric:tabular-nums;white-space:nowrap}.steps[data-v-f42e011f]{margin:0;padding:0;list-style:none}.step[data-v-f42e011f]{display:flex;align-items:flex-start;gap:var(--s3);padding:8px 0;border-bottom:1px solid var(--border-inner)}.step-number[data-v-f42e011f]{flex:none;width:18px;color:var(--text-3);font-size:12px;text-align:right;font-variant-numeric:tabular-nums}.step-body[data-v-f42e011f]{flex:1;min-width:0}.step-text[data-v-f42e011f]{color:var(--text-2)}.step-guard[data-v-f42e011f]{display:block;color:var(--text-3);font-size:12px}.sequence-triggers[data-v-2da9d503]{margin-bottom:14px}.head[data-v-2da9d503]{display:flex;gap:8px;align-items:center;margin-bottom:6px}.title[data-v-2da9d503],.label[data-v-2da9d503],.note[data-v-2da9d503]{color:var(--text-3);font-size:12px}.line[data-v-2da9d503]{margin:0 0 2px;font-size:13px}.card[data-v-2da9d503]{display:flex;flex-direction:column;align-items:flex-start;gap:6px;margin-bottom:8px;padding:10px;border:1px solid var(--border);border-radius:8px}.card input[data-v-2da9d503]{width:100%;padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:13px}.foot[data-v-2da9d503]{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.failure[data-v-186ad116]{margin:0;padding:6px var(--inset);color:var(--bad, var(--text-2));font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as r, createBlock as h, unref as s, withCtx as b, createVNode as _, createElementBlock as m, createCommentVNode as A, Fragment as O, renderList as W, createElementVNode as y, toDisplayString as f, normalizeStyle as z, computed as w, ref as L, createTextVNode as C, withDirectives as re, vModelText as oe } from "vue";
import { useWindow as R, CreateDialog as D, TextList as ue, AgentBadge as H, TextDisplay as ie, Btn as T, Icon as de, Segmented as ce, Reader as pe, SwitchCase as me, ActionsMenu as ge, deleteItem as ve, removed as be, ListReaderLayout as _e, Skeleton as ye, PageHeader as qe } from "@journal/window-kit";
const N = [
  { value: "row", label: "A record is made", fields: [{ name: "event", label: "Record and event", placeholder: "plan.create" }] },
  { value: "phrase", label: "You ask for it", fields: [{ name: "text", label: "Words you write", placeholder: "an update please" }] },
  { value: "command", label: "A command runs", fields: [{ name: "pattern", label: "Pattern on the command line", placeholder: "^git push" }] },
  { value: "file", label: "A file is edited", fields: [{ name: "pattern", label: "Files, as a path glob", placeholder: "src/*.py" }] },
  { value: "file-text", label: "An edit adds text", fields: [{ name: "pattern", label: "Files, as a path glob", placeholder: "src/*.py" }, { name: "text", label: "Text in the new content", placeholder: "TODO" }] },
  { value: "tool", label: "A tool is used", fields: [{ name: "tool", label: "Tool name", placeholder: "Edit" }, { name: "pattern", label: "Pattern on its input, if any", placeholder: "migrations/" }] }
], P = (e) => N.find((t) => t.value === e) ?? N[0], he = {
  row: (e) => `When ${e.event} happens`,
  phrase: (e) => `When you ask “${e.text}”`,
  command: (e) => `When a command matching “${e.pattern}” runs`,
  file: (e) => `When a file matching “${e.pattern}” is edited`,
  "file-text": (e) => `When an edit to “${e.pattern}” adds “${e.text}”`,
  tool: (e) => `When ${e.tool} is used${e.pattern ? ` with “${e.pattern}” in its input` : ""}`
}, fe = (e) => he[e.trigger_type](e), K = (e) => e.length ? e.map(fe) : ["Only when you or the agent start it"], M = () => ({ trigger_type: "phrase", event: "", text: "", pattern: "", tool: "" });
function Q(e) {
  const t = P(e.trigger_type).fields.map((n) => [n.name, (e[n.name] || "").trim()]);
  return { trigger_type: e.trigger_type, ...Object.fromEntries(t.filter(([, n]) => n)) };
}
const ke = { tool: ["pattern"] };
function X(e) {
  const t = e.find((n) => P(n.trigger_type).fields.some((i) => !(ke[n.trigger_type] ?? []).includes(i.name) && !(n[i.name] || "").trim()));
  return t ? `${P(t.trigger_type).label}: complete every field.` : "";
}
const $e = "Add instructions for each step.", Z = (e) => ({ key: "steps", label: "Steps, in order", kind: "slot", required: !0, value: e }), ee = (e) => e.steps.some((t) => !t.trim()) ? { steps: $e } : {}, Se = (e) => /\s/.test(e) ? JSON.stringify(e) : e, F = (e) => `journal ${e.map(Se).join(" ")}`, we = (e = "", t = [""]) => [{ key: "title", label: "Title", required: !0, placeholder: "Releasing a version", value: e }, Z(t)], Oe = (e) => e.title.trim() ? ee(e) : { title: "Give the sequence a title." }, Ae = (e) => ["sequence", "make", e.title.trim(), "--steps", e.steps.map((t) => t.trim()).join(" | ")], Ce = (e) => F(["sequence", "make", e.title.trim() || "…", "--steps", e.steps.map((t) => t.trim()).join(" | ") || "…"]), xe = (e) => JSON.parse(e.step_guards || "[]"), Te = { file_edits_allowed: !0, allowed_commands: [] }, Ne = (e, t) => ["sequence", "edit", String(e.id), "--steps", ...t.steps.map((n) => n.trim()), "--step-guards", JSON.stringify(t.steps.map((n, i) => xe(e)[i] ?? Te))], Re = (e) => () => F(["sequence", "edit", String(e.id), "--steps", "…"]), te = (e, t) => `${e.value}:${t}`, Ie = { tool: ["pattern"] }, We = [
  { key: "kind", label: "Starts when", kind: "select", options: N.map((e) => [e.value, e.label]) },
  ...N.flatMap((e) => e.fields.map((t) => ({ key: te(e, t.name), label: t.label, placeholder: t.placeholder, required: !(Ie[e.value] ?? []).includes(t.name), when: (n) => n.kind === e.value })))
], ne = (e) => ({ ...M(), trigger_type: e.kind, ...Object.fromEntries(N.find((t) => t.value === e.kind).fields.map((t) => [t.name, e[te({ value: e.kind }, t.name)] ?? ""])) }), je = (e) => X([ne(e)]) ? { [Object.keys(e).find((n) => n.startsWith(`${e.kind}:`))]: "Complete every field." } : {}, Ee = (e, t) => ["sequence", "edit", String(e.id), "--triggers", JSON.stringify([...JSON.parse(e.triggers || "[]"), Q(ne(t))])], Le = (e) => () => F(["sequence", "edit", String(e.id), "--triggers", "…"]), Pe = [{ key: "why", label: "Why", required: !0, placeholder: "The plan changed" }], De = (e) => ["sequence", "abandon", "--why", e.why.trim(), "--sure"], Fe = (e) => F(["sequence", "abandon", "--why", e.why.trim() || "…", "--sure"]), Je = {
  __name: "AbandonRun",
  props: { run: { type: Object, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t, i = R();
    return (o, c) => (r(), h(s(D), {
      title: `Abandon run ${e.run.id}`,
      submit: "Abandon the run",
      fields: s(Pe),
      command: s(Fe),
      run: (a) => s(i).run(s(De)(a)),
      onClose: c[0] || (c[0] = (a) => n("close"))
    }, null, 8, ["title", "fields", "command", "run"]));
  }
}, Be = {
  __name: "AddTrigger",
  props: { sequence: { type: Object, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, i = t, o = R(), c = (a) => o.run(Ee(n.sequence, a));
    return (a, g) => (r(), h(s(D), {
      title: "Add trigger",
      submit: "Add the trigger",
      fields: s(We),
      command: s(Le)(e.sequence),
      check: s(je),
      run: c,
      onClose: g[0] || (g[0] = (l) => i("close"))
    }, null, 8, ["fields", "command", "check"]));
  }
}, se = {
  __name: "StepCards",
  props: { steps: { type: Array, required: !0 } },
  emits: ["steps"],
  setup(e, { emit: t }) {
    const n = t;
    return (i, o) => (r(), h(s(ue), {
      items: e.steps,
      kind: "step",
      noun: "Step",
      placeholder: "What the agent does in this step",
      "add-label": "Add a step",
      onItems: o[0] || (o[0] = (c) => n("steps", c))
    }, null, 8, ["items"]));
  }
}, Me = {
  __name: "EditSteps",
  props: { sequence: { type: Object, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, i = t, o = R(), c = (a) => o.run(Ne(n.sequence, a));
    return (a, g) => (r(), h(s(D), {
      title: `Edit ${e.sequence.title}`,
      submit: "Save the steps",
      fields: [s(Z)([...e.sequence.steps])],
      command: s(Re)(e.sequence),
      check: s(ee),
      run: c,
      onClose: g[0] || (g[0] = (l) => i("close"))
    }, {
      steps: b(({ value: l, set: q }) => [
        _(se, {
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
    const n = e, i = t, o = R(), c = (a) => o.run(Ae(a));
    return (a, g) => (r(), h(s(D), {
      title: "New sequence",
      submit: "Make the sequence",
      fields: s(we)(n.title, n.steps),
      command: s(Ce),
      check: s(Oe),
      run: c,
      onClose: g[0] || (g[0] = (l) => i("close"))
    }, {
      steps: b(({ value: l, set: q }) => [
        _(se, {
          steps: l,
          onSteps: q
        }, null, 8, ["steps", "onSteps"])
      ]),
      _: 1
    }, 8, ["fields", "command", "check"]));
  }
}, Ve = (e) => JSON.parse(e.steps), J = (e, t) => t.filter((n) => n.sequence_id === e.id), ae = (e) => JSON.parse(e.triggers || "[]"), x = (e) => ({ done: e.step_number - 1, total: Ve(e).length }), le = (e, t) => e.id === Math.max(...t.filter((n) => n.session_agent_id === e.session_agent_id).map((n) => n.id));
function Ge(e, t) {
  const n = J(e, t).length;
  return `${e.steps.length} steps · ${n ? `${n} running now` : K(ae(e))[0]}`;
}
const B = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [i, o] of t)
    n[i] = o;
  return n;
}, Ue = {
  class: "sequence-runs",
  "data-sequence-runs": ""
}, Ye = {
  key: 0,
  class: "none",
  "data-runs-none": ""
}, ze = { class: "run-number" }, He = ["aria-valuenow", "aria-valuemax"], Ke = { class: "run-words" }, Qe = ["onClick"], Xe = {
  __name: "SequenceRuns",
  props: { runs: { type: Array, required: !0 }, all: { type: Array, required: !0 } },
  emits: ["abandon"],
  setup(e, { emit: t }) {
    const n = t, i = (o) => `Step ${o.step_number} of ${x(o).total}${o.step_started ? "" : ", not started yet"}`;
    return (o, c) => (r(), m("section", Ue, [
      e.runs.length ? A("", !0) : (r(), m("p", Ye, "No run is going now")),
      (r(!0), m(O, null, W(e.runs, (a) => (r(), m("div", {
        key: a.id,
        class: "run",
        "data-run": ""
      }, [
        y("span", ze, f(a.id), 1),
        _(s(H), {
          name: `Agent ${a.session_agent_id}`
        }, null, 8, ["name"]),
        y("span", {
          class: "bar",
          role: "progressbar",
          "aria-valuenow": s(x)(a).done,
          "aria-valuemin": "0",
          "aria-valuemax": s(x)(a).total
        }, [
          y("i", {
            style: z({ width: `${s(x)(a).done / s(x)(a).total * 100}%` })
          }, null, 4)
        ], 8, He),
        y("span", Ke, f(i(a)), 1),
        s(le)(a, e.all) ? (r(), m("button", {
          key: 0,
          type: "button",
          class: "abandon",
          "data-run-abandon": "",
          onClick: (g) => n("abandon", a)
        }, "Abandon", 8, Qe)) : A("", !0)
      ]))), 128))
    ]));
  }
}, Ze = /* @__PURE__ */ B(Xe, [["__scopeId", "data-v-d89d02e5"]]), et = {
  class: "sequence-steps",
  "data-sequence-steps": ""
}, tt = {
  key: 0,
  class: "progress",
  "data-step-progress": ""
}, nt = ["aria-valuenow", "aria-valuemax"], st = { class: "progress-words" }, at = { class: "steps" }, lt = { class: "step-number" }, rt = { class: "step-body" }, ot = {
  class: "step-guard",
  "data-step-guard": ""
}, ut = {
  key: 0,
  class: "badge-quiet",
  "data-step-state": ""
}, it = {
  __name: "SequenceSteps",
  props: { sequence: { type: Object, required: !0 }, runs: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = w(() => JSON.parse(t.sequence.step_guards || "[]")), i = (l) => n.value[l] ?? { file_edits_allowed: !0, allowed_commands: [] }, o = (l) => [i(l).file_edits_allowed ? "File edits allowed" : "File edits wait", ...i(l).allowed_commands].join(", "), c = w(() => t.runs.length ? x(t.runs.reduce((l, q) => q.step_number > l.step_number ? q : l)) : null), a = w(() => t.runs.length ? Math.min(...t.runs.map((l) => l.step_number)) : 0), g = (l) => t.runs.some((q) => q.step_number === l + 1) ? "In progress" : t.runs.length && l + 1 < a.value ? "Done" : "";
    return (l, q) => (r(), m("section", et, [
      c.value ? (r(), m("div", tt, [
        y("span", {
          class: "bar",
          role: "progressbar",
          "aria-valuenow": c.value.done,
          "aria-valuemin": "0",
          "aria-valuemax": c.value.total
        }, [
          y("i", {
            style: z({ width: `${c.value.done / c.value.total * 100}%` })
          }, null, 4)
        ], 8, nt),
        y("span", st, f(c.value.done) + " of " + f(c.value.total) + " done", 1)
      ])) : A("", !0),
      y("ol", at, [
        (r(!0), m(O, null, W(e.sequence.steps, ($, u) => (r(), m("li", {
          key: u,
          class: "step",
          "data-step": ""
        }, [
          y("span", lt, f(u + 1), 1),
          y("div", rt, [
            _(s(ie), {
              class: "step-text",
              text: $
            }, null, 8, ["text"]),
            y("span", ot, f(o(u)), 1)
          ]),
          g(u) ? (r(), m("span", ut, f(g(u)), 1)) : A("", !0)
        ]))), 128))
      ])
    ]));
  }
}, dt = /* @__PURE__ */ B(it, [["__scopeId", "data-v-f42e011f"]]), ct = {
  class: "sequence-triggers",
  "data-sequence-triggers": ""
}, pt = { class: "head" }, mt = { class: "label" }, gt = ["onUpdate:modelValue", "placeholder", "aria-label", "data-trigger-field"], vt = { class: "foot" }, bt = {
  class: "note",
  role: "status"
}, _t = {
  __name: "SequenceTriggers",
  props: { sequence: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = R(), i = N.map((u) => ({ key: u.value, label: u.label })), o = w(() => JSON.parse(t.sequence.triggers || "[]")), c = w(() => K(o.value)), a = L(null), g = L(""), l = w(() => a.value ? X(a.value) : ""), q = () => a.value = o.value.map((u) => ({ ...M(), ...u }));
    async function $() {
      const u = await n.run(["sequence", "edit", String(t.sequence.id), "--triggers", JSON.stringify(a.value.map(Q))]);
      g.value = u.ok ? "" : u.error, u.ok && (a.value = null);
    }
    return (u, v) => (r(), m("section", ct, [
      y("header", pt, [
        v[3] || (v[3] = y("span", { class: "title" }, "Starts", -1)),
        a.value ? A("", !0) : (r(), h(s(T), {
          key: 0,
          small: "",
          "data-sequence-triggers-edit": "",
          onClick: q
        }, {
          default: b(() => [
            _(s(de), {
              name: "pencil",
              size: 12
            }),
            v[2] || (v[2] = C(" Edit", -1))
          ]),
          _: 1
        }))
      ]),
      a.value ? (r(), m(O, { key: 1 }, [
        (r(!0), m(O, null, W(a.value, (k, j) => (r(), m("div", {
          key: j,
          class: "card",
          "data-sequence-trigger-card": ""
        }, [
          _(s(ce), {
            options: s(i),
            value: k.trigger_type,
            onPick: (d) => k.trigger_type = d
          }, null, 8, ["options", "value", "onPick"]),
          (r(!0), m(O, null, W(s(P)(k.trigger_type).fields, (d) => (r(), m(O, {
            key: d.name
          }, [
            y("label", mt, f(d.label), 1),
            re(y("input", {
              "onUpdate:modelValue": (p) => k[d.name] = p,
              placeholder: d.placeholder,
              "aria-label": d.label,
              "data-trigger-field": d.name
            }, null, 8, gt), [
              [oe, k[d.name]]
            ])
          ], 64))), 128)),
          _(s(T), {
            small: "",
            "data-sequence-trigger-remove": "",
            onClick: (d) => a.value.splice(j, 1)
          }, {
            default: b(() => [...v[4] || (v[4] = [
              C("Remove", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ]))), 128)),
        y("div", vt, [
          _(s(T), {
            small: "",
            "data-sequence-trigger-add": "",
            onClick: v[0] || (v[0] = (k) => a.value.push(s(M)()))
          }, {
            default: b(() => [...v[5] || (v[5] = [
              C("Add a trigger", -1)
            ])]),
            _: 1
          }),
          _(s(T), {
            small: "",
            variant: "primary",
            disabled: !!l.value,
            "data-sequence-triggers-save": "",
            onClick: $
          }, {
            default: b(() => [...v[6] || (v[6] = [
              C("Save", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          _(s(T), {
            small: "",
            onClick: v[1] || (v[1] = (k) => a.value = null)
          }, {
            default: b(() => [...v[7] || (v[7] = [
              C("Cancel", -1)
            ])]),
            _: 1
          }),
          y("span", bt, f(g.value || l.value), 1)
        ])
      ], 64)) : (r(!0), m(O, { key: 0 }, W(c.value, (k) => (r(), m("p", {
        key: k,
        class: "line",
        "data-sequence-trigger": ""
      }, f(k), 1))), 128))
    ]));
  }
}, yt = /* @__PURE__ */ B(_t, [["__scopeId", "data-v-2da9d503"]]), qt = {
  class: "run-head",
  "data-run-head": ""
}, ht = {
  __name: "SequenceReader",
  props: { sequence: { type: Object, required: !0 }, runs: { type: Array, required: !0 }, items: { type: Array, required: !0 } },
  emits: ["abandon"],
  setup(e, { emit: t }) {
    const n = e, i = t, o = w(() => J(n.sequence, n.runs)), c = w(() => [
      { key: "steps", label: "Steps", count: n.sequence.steps.length },
      { key: "runs", label: "Runs", count: o.value.length },
      { key: "triggers", label: "Triggers", count: ae(n.sequence).length }
    ]), a = w(() => o.value[0] ?? null);
    return (g, l) => (r(), h(s(pe), {
      title: e.sequence.title,
      number: String(e.sequence.id),
      tabs: c.value,
      "data-sequence-reader": ""
    }, {
      agent: b(() => [
        a.value ? (r(), m(O, { key: 0 }, [
          y("span", qt, "Run " + f(a.value.id) + " · step " + f(a.value.step_number) + " of " + f(s(x)(a.value).total), 1),
          _(s(H), {
            name: `Agent ${a.value.session_agent_id}`
          }, null, 8, ["name"])
        ], 64)) : A("", !0)
      ]),
      actions: b(() => [
        _(s(ge), {
          items: e.items,
          head: `Sequence ${e.sequence.id}`
        }, null, 8, ["items", "head"])
      ]),
      default: b(({ tab: q }) => [
        _(s(me), { value: q }, {
          steps: b(() => [
            _(dt, {
              sequence: e.sequence,
              runs: o.value
            }, null, 8, ["sequence", "runs"])
          ]),
          runs: b(() => [
            _(Ze, {
              runs: o.value,
              all: e.runs,
              onAbandon: l[0] || (l[0] = ($) => i("abandon", $))
            }, null, 8, ["runs", "all"])
          ]),
          triggers: b(() => [
            _(yt, { sequence: e.sequence }, null, 8, ["sequence"])
          ]),
          _: 1
        }, 8, ["value"])
      ]),
      _: 1
    }, 8, ["title", "number", "tabs"]));
  }
};
function ft(e, t, { act: n, ask: i, open: o = null }) {
  const c = J(e, t), a = c.filter((l) => le(l, t)), g = (l) => async ({ say: q }) => {
    const $ = await l.line();
    q($.ok ? l.done : $.error);
  };
  return [
    ...o ? [{ label: "Open", group: "open", run: o }] : [],
    { label: "Start", group: "own", disabled: c.length > 0, reason: "Running", run: g({ line: () => n(["sequence", "run", String(e.id)]), done: `Sequence ${e.id} started` }) },
    ...a.map((l) => ({ label: `Abandon run ${l.id}`, group: "own", run: () => i("abandon", e, l) })),
    { label: "Edit steps", group: "own", run: () => i("steps", e) },
    { label: "Add trigger", group: "own", run: () => i("trigger", e) },
    { label: "Duplicate", group: "own", run: () => i("copy", e) },
    ve({ name: `sequence ${e.id}`, remove: () => n(["sequence", "delete", String(e.id)], be(e.id)) })
  ];
}
const kt = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-sequences-failure": ""
}, $t = {
  key: 0,
  class: "badge-quiet",
  "data-sequence-running": ""
}, St = 460, wt = {
  __name: "SequenceCards",
  setup(e) {
    const t = R(), { rows: n, data: i, failure: o, loaded: c, act: a, actionFailure: g } = t.props.board, l = w(() => {
      var d;
      return ((d = i.value) == null ? void 0 : d.runs) ?? [];
    }), q = w(() => n.value.map((d) => ({ id: d.id, title: `${d.id} ${d.title}`, desc: Ge(d, l.value), row: d, running: J(d, l.value).length > 0 }))), $ = L(null), u = L(null), v = (d, p, S = null) => u.value = { kind: d, sequence: p, run: S }, k = (d, p = null) => ft(d, l.value, { act: a, ask: v, open: p }), j = (d) => ({ head: `Sequence ${d.id}`, items: k(d.row, () => $.value = d.id) });
    return (d, p) => (r(), h(s(_e), {
      chosen: $.value,
      "onUpdate:chosen": p[6] || (p[6] = (S) => $.value = S),
      items: q.value,
      "list-width": St,
      place: j,
      "empty-title": "No sequences yet",
      "pick-line": "Choose a sequence",
      "data-sequences": ""
    }, {
      top: b(() => {
        var S, E, V, G, U;
        return [
          _(s(qe), {
            title: "Sequences",
            count: s(n).length
          }, {
            primary: b(() => [
              _(s(T), {
                small: "",
                variant: "primary",
                "data-sequence-new": "",
                onClick: p[0] || (p[0] = (I) => v("new"))
              }, {
                default: b(() => [...p[7] || (p[7] = [
                  C("New sequence", -1)
                ])]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["count"]),
          s(o) || s(g) ? (r(), m("p", kt, f(s(o) || s(g)), 1)) : A("", !0),
          ((S = u.value) == null ? void 0 : S.kind) === "new" ? (r(), h(Y, {
            key: 1,
            onClose: p[1] || (p[1] = (I) => u.value = null)
          })) : ((E = u.value) == null ? void 0 : E.kind) === "copy" ? (r(), h(Y, {
            key: 2,
            title: `${u.value.sequence.title} copy`,
            steps: [...u.value.sequence.steps],
            onClose: p[2] || (p[2] = (I) => u.value = null)
          }, null, 8, ["title", "steps"])) : ((V = u.value) == null ? void 0 : V.kind) === "steps" ? (r(), h(Me, {
            key: 3,
            sequence: u.value.sequence,
            onClose: p[3] || (p[3] = (I) => u.value = null)
          }, null, 8, ["sequence"])) : ((G = u.value) == null ? void 0 : G.kind) === "trigger" ? (r(), h(Be, {
            key: 4,
            sequence: u.value.sequence,
            onClose: p[4] || (p[4] = (I) => u.value = null)
          }, null, 8, ["sequence"])) : ((U = u.value) == null ? void 0 : U.kind) === "abandon" ? (r(), h(Je, {
            key: 5,
            run: u.value.run,
            onClose: p[5] || (p[5] = (I) => u.value = null)
          }, null, 8, ["run"])) : A("", !0)
        ];
      }),
      empty: b(() => [
        s(c) ? (r(), m(O, { key: 1 }, [
          C("A sequence is steps an agent works through in order.")
        ], 64)) : (r(), h(s(ye), {
          key: 0,
          shape: "rows"
        }))
      ]),
      meta: b(({ item: S }) => [
        S.running ? (r(), m("span", $t, "Running")) : A("", !0)
      ]),
      reader: b(({ item: S }) => [
        _(ht, {
          sequence: S.row,
          runs: l.value,
          items: k(S.row),
          onAbandon: (E) => v("abandon", S.row, E)
        }, null, 8, ["sequence", "runs", "items", "onAbandon"])
      ]),
      _: 1
    }, 8, ["chosen", "items"]));
  }
}, Ct = /* @__PURE__ */ B(wt, [["__scopeId", "data-v-186ad116"]]);
export {
  Ct as default
};
