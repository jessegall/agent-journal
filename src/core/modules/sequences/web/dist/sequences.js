if (!document.getElementById("window-styles-1b29cb95f794")) { const style = document.createElement("style"); style.id = "window-styles-1b29cb95f794"; style.textContent = ".step-cards[data-v-e37eba39]{display:flex;flex-direction:column;gap:8px;margin:0 0 8px;padding:0;list-style:none}.step-card[data-v-e37eba39]{display:flex;gap:8px;align-items:flex-start}.step-number[data-v-e37eba39]{flex:none;width:18px;padding-top:8px;color:var(--text-3);font-size:12px;text-align:right;font-variant-numeric:tabular-nums}.step-moves[data-v-e37eba39]{display:flex;flex:none;gap:2px}textarea[data-v-e37eba39]{flex:1;box-sizing:border-box;min-width:0;padding:6px 10px;border:1px solid var(--border-2);border-radius:8px;background:var(--bg);color:var(--text);font:inherit;font-size:13px;resize:vertical}.run[data-v-d89d02e5]{display:flex;align-items:center;gap:var(--s3);padding:8px 0;border-bottom:1px solid var(--border-inner);font-size:12.5px}.run-number[data-v-d89d02e5]{flex:none;width:30px;color:var(--text-3);font-variant-numeric:tabular-nums}.bar[data-v-d89d02e5]{flex:1;min-width:40px;height:4px;overflow:hidden;border-radius:2px;background:var(--border-2)}.bar i[data-v-d89d02e5]{display:block;height:100%;background:var(--accent)}.run-words[data-v-d89d02e5]{flex:none;color:var(--text-3);font-size:12px;white-space:nowrap}.abandon[data-v-d89d02e5]{flex:none;border:0;background:none;color:var(--text-2);font:inherit;font-size:12px;cursor:pointer}.none[data-v-d89d02e5]{margin:0;color:var(--text-3);font-size:12.5px}.progress[data-v-f42e011f]{display:flex;align-items:center;gap:var(--s3);margin:4px 0 14px}.bar[data-v-f42e011f]{flex:1;height:4px;overflow:hidden;border-radius:2px;background:var(--border-2)}.bar i[data-v-f42e011f]{display:block;height:100%;background:var(--accent)}.progress-words[data-v-f42e011f]{color:var(--text-3);font-size:12px;font-variant-numeric:tabular-nums;white-space:nowrap}.steps[data-v-f42e011f]{margin:0;padding:0;list-style:none}.step[data-v-f42e011f]{display:flex;align-items:flex-start;gap:var(--s3);padding:8px 0;border-bottom:1px solid var(--border-inner)}.step-number[data-v-f42e011f]{flex:none;width:18px;color:var(--text-3);font-size:12px;text-align:right;font-variant-numeric:tabular-nums}.step-body[data-v-f42e011f]{flex:1;min-width:0}.step-text[data-v-f42e011f]{color:var(--text-2)}.step-guard[data-v-f42e011f]{display:block;color:var(--text-3);font-size:12px}.sequence-triggers[data-v-2da9d503]{margin-bottom:14px}.head[data-v-2da9d503]{display:flex;gap:8px;align-items:center;margin-bottom:6px}.title[data-v-2da9d503],.label[data-v-2da9d503],.note[data-v-2da9d503]{color:var(--text-3);font-size:12px}.line[data-v-2da9d503]{margin:0 0 2px;font-size:13px}.card[data-v-2da9d503]{display:flex;flex-direction:column;align-items:flex-start;gap:6px;margin-bottom:8px;padding:10px;border:1px solid var(--border);border-radius:8px}.card input[data-v-2da9d503]{width:100%;padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:13px}.foot[data-v-2da9d503]{display:flex;flex-wrap:wrap;gap:6px;align-items:center}.failure[data-v-186ad116]{margin:0;padding:6px var(--inset);color:var(--bad, var(--text-2));font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as r, createBlock as $, unref as s, createElementBlock as b, Fragment as w, createElementVNode as h, renderList as I, toDisplayString as q, createVNode as v, withCtx as _, createTextVNode as N, createCommentVNode as A, normalizeStyle as H, computed as O, ref as D, withDirectives as oe, vModelText as ue } from "vue";
import { useWindow as x, CreateDialog as J, Btn as C, Icon as L, AgentBadge as K, TextDisplay as ie, Segmented as de, Reader as ce, SwitchCase as pe, ActionsMenu as me, deleteItem as ge, removed as ve, ListReaderLayout as be, Skeleton as _e, PageHeader as ye } from "@journal/window-kit";
const R = [
  { value: "row", label: "A record is made", fields: [{ name: "event", label: "Record and event", placeholder: "plan.create" }] },
  { value: "phrase", label: "You ask for it", fields: [{ name: "text", label: "Words you write", placeholder: "an update please" }] },
  { value: "command", label: "A command runs", fields: [{ name: "pattern", label: "Pattern on the command line", placeholder: "^git push" }] },
  { value: "file", label: "A file is edited", fields: [{ name: "pattern", label: "Files, as a path glob", placeholder: "src/*.py" }] },
  { value: "file-text", label: "An edit adds text", fields: [{ name: "pattern", label: "Files, as a path glob", placeholder: "src/*.py" }, { name: "text", label: "Text in the new content", placeholder: "TODO" }] },
  { value: "tool", label: "A tool is used", fields: [{ name: "tool", label: "Tool name", placeholder: "Edit" }, { name: "pattern", label: "Pattern on its input, if any", placeholder: "migrations/" }] }
], F = (e) => R.find((t) => t.value === e) ?? R[0], he = {
  row: (e) => `When ${e.event} happens`,
  phrase: (e) => `When you ask “${e.text}”`,
  command: (e) => `When a command matching “${e.pattern}” runs`,
  file: (e) => `When a file matching “${e.pattern}” is edited`,
  "file-text": (e) => `When an edit to “${e.pattern}” adds “${e.text}”`,
  tool: (e) => `When ${e.tool} is used${e.pattern ? ` with “${e.pattern}” in its input` : ""}`
}, fe = (e) => he[e.trigger_type](e), Q = (e) => e.length ? e.map(fe) : ["Only when you or the agent start it"], V = () => ({ trigger_type: "phrase", event: "", text: "", pattern: "", tool: "" });
function X(e) {
  const t = F(e.trigger_type).fields.map((n) => [n.name, (e[n.name] || "").trim()]);
  return { trigger_type: e.trigger_type, ...Object.fromEntries(t.filter(([, n]) => n)) };
}
const qe = { tool: ["pattern"] };
function Z(e) {
  const t = e.find((n) => F(n.trigger_type).fields.some((u) => !(qe[n.trigger_type] ?? []).includes(u.name) && !(n[u.name] || "").trim()));
  return t ? `${F(t.trigger_type).label}: complete every field.` : "";
}
const ke = "Add instructions for each step.", ee = (e) => ({ key: "steps", label: "Steps, in order", kind: "slot", required: !0, value: e }), te = (e) => e.steps.some((t) => !t.trim()) ? { steps: ke } : {}, $e = (e) => /\s/.test(e) ? JSON.stringify(e) : e, M = (e) => `journal ${e.map($e).join(" ")}`, Se = (e = "", t = [""]) => [{ key: "title", label: "Title", required: !0, placeholder: "Releasing a version", value: e }, ee(t)], we = (e) => e.title.trim() ? te(e) : { title: "Give the sequence a title." }, Oe = (e) => ["sequence", "make", e.title.trim(), "--steps", e.steps.map((t) => t.trim()).join(" | ")], Ce = (e) => M(["sequence", "make", e.title.trim() || "…", "--steps", e.steps.map((t) => t.trim()).join(" | ") || "…"]), Ae = (e) => JSON.parse(e.step_guards || "[]"), Ne = { file_edits_allowed: !0, allowed_commands: [] }, Te = (e, t) => ["sequence", "edit", String(e.id), "--steps", ...t.steps.map((n) => n.trim()), "--step-guards", JSON.stringify(t.steps.map((n, u) => Ae(e)[u] ?? Ne))], Ie = (e) => () => M(["sequence", "edit", String(e.id), "--steps", "…"]), ne = (e, t) => `${e.value}:${t}`, Re = { tool: ["pattern"] }, xe = [
  { key: "kind", label: "Starts when", kind: "select", options: R.map((e) => [e.value, e.label]) },
  ...R.flatMap((e) => e.fields.map((t) => ({ key: ne(e, t.name), label: t.label, placeholder: t.placeholder, required: !(Re[e.value] ?? []).includes(t.name), when: (n) => n.kind === e.value })))
], se = (e) => ({ ...V(), trigger_type: e.kind, ...Object.fromEntries(R.find((t) => t.value === e.kind).fields.map((t) => [t.name, e[ne({ value: e.kind }, t.name)] ?? ""])) }), We = (e) => Z([se(e)]) ? { [Object.keys(e).find((n) => n.startsWith(`${e.kind}:`))]: "Complete every field." } : {}, je = (e, t) => ["sequence", "edit", String(e.id), "--triggers", JSON.stringify([...JSON.parse(e.triggers || "[]"), X(se(t))])], Ee = (e) => () => M(["sequence", "edit", String(e.id), "--triggers", "…"]), Pe = [{ key: "why", label: "Why", required: !0, placeholder: "The plan changed" }], Le = (e) => ["sequence", "abandon", "--why", e.why.trim(), "--sure"], De = (e) => M(["sequence", "abandon", "--why", e.why.trim() || "…", "--sure"]), Fe = {
  __name: "AbandonRun",
  props: { run: { type: Object, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = t, u = x();
    return (i, d) => (r(), $(s(J), {
      title: `Abandon run ${e.run.id}`,
      submit: "Abandon the run",
      fields: s(Pe),
      command: s(De),
      run: (l) => s(u).run(s(Le)(l)),
      onClose: d[0] || (d[0] = (l) => n("close"))
    }, null, 8, ["title", "fields", "command", "run"]));
  }
}, Je = {
  __name: "AddTrigger",
  props: { sequence: { type: Object, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, u = t, i = x(), d = (l) => i.run(je(n.sequence, l));
    return (l, c) => (r(), $(s(J), {
      title: "Add trigger",
      submit: "Add the trigger",
      fields: s(xe),
      command: s(Ee)(e.sequence),
      check: s(We),
      run: d,
      onClose: c[0] || (c[0] = (a) => u("close"))
    }, null, 8, ["fields", "command", "check"]));
  }
}, j = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [u, i] of t)
    n[u] = i;
  return n;
}, Me = { class: "step-cards" }, Be = { class: "step-number" }, Ve = ["value", "aria-label", "onInput"], ze = { class: "step-moves" }, Ge = {
  __name: "StepCards",
  props: { steps: { type: Array, required: !0 } },
  emits: ["steps"],
  setup(e, { emit: t }) {
    const n = e, u = t;
    function i(c, a) {
      u("steps", n.steps.map((g, p) => p === c ? a : g));
    }
    function d(c, a) {
      const g = [...n.steps], [p] = g.splice(c, 1);
      g.splice(c + a, 0, p), u("steps", g);
    }
    const l = (c) => u("steps", n.steps.filter((a, g) => g !== c));
    return (c, a) => (r(), b(w, null, [
      h("ol", Me, [
        (r(!0), b(w, null, I(e.steps, (g, p) => (r(), b("li", {
          key: p,
          class: "step-card"
        }, [
          h("span", Be, q(p + 1), 1),
          h("textarea", {
            value: g,
            rows: "2",
            "aria-label": `Step ${p + 1}`,
            placeholder: "What the agent does in this step",
            "data-step-text": "",
            onInput: (o) => i(p, o.target.value)
          }, null, 40, Ve),
          h("div", ze, [
            v(s(C), {
              small: "",
              disabled: p === 0,
              "aria-label": `Move step ${p + 1} up`,
              "data-step-up": "",
              onClick: (o) => d(p, -1)
            }, {
              default: _(() => [
                v(s(L), {
                  name: "up",
                  size: 12
                })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"]),
            v(s(C), {
              small: "",
              disabled: p === e.steps.length - 1,
              "aria-label": `Move step ${p + 1} down`,
              "data-step-down": "",
              onClick: (o) => d(p, 1)
            }, {
              default: _(() => [
                v(s(L), {
                  name: "down",
                  size: 12
                })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"]),
            v(s(C), {
              small: "",
              disabled: e.steps.length === 1,
              "aria-label": `Remove step ${p + 1}`,
              "data-step-remove": "",
              onClick: (o) => l(p)
            }, {
              default: _(() => [
                v(s(L), {
                  name: "trash",
                  size: 12
                })
              ]),
              _: 1
            }, 8, ["disabled", "aria-label", "onClick"])
          ])
        ]))), 128))
      ]),
      v(s(C), {
        small: "",
        bordered: "",
        "data-step-add": "",
        onClick: a[0] || (a[0] = (g) => u("steps", [...e.steps, ""]))
      }, {
        default: _(() => [...a[1] || (a[1] = [
          N("Add a step", -1)
        ])]),
        _: 1
      })
    ], 64));
  }
}, ae = /* @__PURE__ */ j(Ge, [["__scopeId", "data-v-e37eba39"]]), Ue = {
  __name: "EditSteps",
  props: { sequence: { type: Object, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, u = t, i = x(), d = (l) => i.run(Te(n.sequence, l));
    return (l, c) => (r(), $(s(J), {
      title: `Edit ${e.sequence.title}`,
      submit: "Save the steps",
      fields: [s(ee)([...e.sequence.steps])],
      command: s(Ie)(e.sequence),
      check: s(te),
      run: d,
      onClose: c[0] || (c[0] = (a) => u("close"))
    }, {
      steps: _(({ value: a, set: g }) => [
        v(ae, {
          steps: a,
          onSteps: g
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
    const n = e, u = t, i = x(), d = (l) => i.run(Oe(l));
    return (l, c) => (r(), $(s(J), {
      title: "New sequence",
      submit: "Make the sequence",
      fields: s(Se)(n.title, n.steps),
      command: s(Ce),
      check: s(we),
      run: d,
      onClose: c[0] || (c[0] = (a) => u("close"))
    }, {
      steps: _(({ value: a, set: g }) => [
        v(ae, {
          steps: a,
          onSteps: g
        }, null, 8, ["steps", "onSteps"])
      ]),
      _: 1
    }, 8, ["fields", "command", "check"]));
  }
}, Ye = (e) => JSON.parse(e.steps), B = (e, t) => t.filter((n) => n.sequence_id === e.id), le = (e) => JSON.parse(e.triggers || "[]"), T = (e) => ({ done: e.step_number - 1, total: Ye(e).length }), re = (e, t) => e.id === Math.max(...t.filter((n) => n.session_agent_id === e.session_agent_id).map((n) => n.id));
function He(e, t) {
  const n = B(e, t).length;
  return `${e.steps.length} steps · ${n ? `${n} running now` : Q(le(e))[0]}`;
}
const Ke = {
  class: "sequence-runs",
  "data-sequence-runs": ""
}, Qe = {
  key: 0,
  class: "none",
  "data-runs-none": ""
}, Xe = { class: "run-number" }, Ze = ["aria-valuenow", "aria-valuemax"], et = { class: "run-words" }, tt = ["onClick"], nt = {
  __name: "SequenceRuns",
  props: { runs: { type: Array, required: !0 }, all: { type: Array, required: !0 } },
  emits: ["abandon"],
  setup(e, { emit: t }) {
    const n = t, u = (i) => `Step ${i.step_number} of ${T(i).total}${i.step_started ? "" : ", not started yet"}`;
    return (i, d) => (r(), b("section", Ke, [
      e.runs.length ? A("", !0) : (r(), b("p", Qe, "No run is going now")),
      (r(!0), b(w, null, I(e.runs, (l) => (r(), b("div", {
        key: l.id,
        class: "run",
        "data-run": ""
      }, [
        h("span", Xe, q(l.id), 1),
        v(s(K), {
          name: `Agent ${l.session_agent_id}`
        }, null, 8, ["name"]),
        h("span", {
          class: "bar",
          role: "progressbar",
          "aria-valuenow": s(T)(l).done,
          "aria-valuemin": "0",
          "aria-valuemax": s(T)(l).total
        }, [
          h("i", {
            style: H({ width: `${s(T)(l).done / s(T)(l).total * 100}%` })
          }, null, 4)
        ], 8, Ze),
        h("span", et, q(u(l)), 1),
        s(re)(l, e.all) ? (r(), b("button", {
          key: 0,
          type: "button",
          class: "abandon",
          "data-run-abandon": "",
          onClick: (c) => n("abandon", l)
        }, "Abandon", 8, tt)) : A("", !0)
      ]))), 128))
    ]));
  }
}, st = /* @__PURE__ */ j(nt, [["__scopeId", "data-v-d89d02e5"]]), at = {
  class: "sequence-steps",
  "data-sequence-steps": ""
}, lt = {
  key: 0,
  class: "progress",
  "data-step-progress": ""
}, rt = ["aria-valuenow", "aria-valuemax"], ot = { class: "progress-words" }, ut = { class: "steps" }, it = { class: "step-number" }, dt = { class: "step-body" }, ct = {
  class: "step-guard",
  "data-step-guard": ""
}, pt = {
  key: 0,
  class: "badge-quiet",
  "data-step-state": ""
}, mt = {
  __name: "SequenceSteps",
  props: { sequence: { type: Object, required: !0 }, runs: { type: Array, required: !0 } },
  setup(e) {
    const t = e, n = O(() => JSON.parse(t.sequence.step_guards || "[]")), u = (a) => n.value[a] ?? { file_edits_allowed: !0, allowed_commands: [] }, i = (a) => [u(a).file_edits_allowed ? "File edits allowed" : "File edits wait", ...u(a).allowed_commands].join(", "), d = O(() => t.runs.length ? T(t.runs.reduce((a, g) => g.step_number > a.step_number ? g : a)) : null), l = O(() => t.runs.length ? Math.min(...t.runs.map((a) => a.step_number)) : 0), c = (a) => t.runs.some((g) => g.step_number === a + 1) ? "In progress" : t.runs.length && a + 1 < l.value ? "Done" : "";
    return (a, g) => (r(), b("section", at, [
      d.value ? (r(), b("div", lt, [
        h("span", {
          class: "bar",
          role: "progressbar",
          "aria-valuenow": d.value.done,
          "aria-valuemin": "0",
          "aria-valuemax": d.value.total
        }, [
          h("i", {
            style: H({ width: `${d.value.done / d.value.total * 100}%` })
          }, null, 4)
        ], 8, rt),
        h("span", ot, q(d.value.done) + " of " + q(d.value.total) + " done", 1)
      ])) : A("", !0),
      h("ol", ut, [
        (r(!0), b(w, null, I(e.sequence.steps, (p, o) => (r(), b("li", {
          key: o,
          class: "step",
          "data-step": ""
        }, [
          h("span", it, q(o + 1), 1),
          h("div", dt, [
            v(s(ie), {
              class: "step-text",
              text: p
            }, null, 8, ["text"]),
            h("span", ct, q(i(o)), 1)
          ]),
          c(o) ? (r(), b("span", pt, q(c(o)), 1)) : A("", !0)
        ]))), 128))
      ])
    ]));
  }
}, gt = /* @__PURE__ */ j(mt, [["__scopeId", "data-v-f42e011f"]]), vt = {
  class: "sequence-triggers",
  "data-sequence-triggers": ""
}, bt = { class: "head" }, _t = { class: "label" }, yt = ["onUpdate:modelValue", "placeholder", "aria-label", "data-trigger-field"], ht = { class: "foot" }, ft = {
  class: "note",
  role: "status"
}, qt = {
  __name: "SequenceTriggers",
  props: { sequence: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = x(), u = R.map((o) => ({ key: o.value, label: o.label })), i = O(() => JSON.parse(t.sequence.triggers || "[]")), d = O(() => Q(i.value)), l = D(null), c = D(""), a = O(() => l.value ? Z(l.value) : ""), g = () => l.value = i.value.map((o) => ({ ...V(), ...o }));
    async function p() {
      const o = await n.run(["sequence", "edit", String(t.sequence.id), "--triggers", JSON.stringify(l.value.map(X))]);
      c.value = o.ok ? "" : o.error, o.ok && (l.value = null);
    }
    return (o, f) => (r(), b("section", vt, [
      h("header", bt, [
        f[3] || (f[3] = h("span", { class: "title" }, "Starts", -1)),
        l.value ? A("", !0) : (r(), $(s(C), {
          key: 0,
          small: "",
          "data-sequence-triggers-edit": "",
          onClick: g
        }, {
          default: _(() => [
            v(s(L), {
              name: "pencil",
              size: 12
            }),
            f[2] || (f[2] = N(" Edit", -1))
          ]),
          _: 1
        }))
      ]),
      l.value ? (r(), b(w, { key: 1 }, [
        (r(!0), b(w, null, I(l.value, (k, E) => (r(), b("div", {
          key: E,
          class: "card",
          "data-sequence-trigger-card": ""
        }, [
          v(s(de), {
            options: s(u),
            value: k.trigger_type,
            onPick: (m) => k.trigger_type = m
          }, null, 8, ["options", "value", "onPick"]),
          (r(!0), b(w, null, I(s(F)(k.trigger_type).fields, (m) => (r(), b(w, {
            key: m.name
          }, [
            h("label", _t, q(m.label), 1),
            oe(h("input", {
              "onUpdate:modelValue": (y) => k[m.name] = y,
              placeholder: m.placeholder,
              "aria-label": m.label,
              "data-trigger-field": m.name
            }, null, 8, yt), [
              [ue, k[m.name]]
            ])
          ], 64))), 128)),
          v(s(C), {
            small: "",
            "data-sequence-trigger-remove": "",
            onClick: (m) => l.value.splice(E, 1)
          }, {
            default: _(() => [...f[4] || (f[4] = [
              N("Remove", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ]))), 128)),
        h("div", ht, [
          v(s(C), {
            small: "",
            "data-sequence-trigger-add": "",
            onClick: f[0] || (f[0] = (k) => l.value.push(s(V)()))
          }, {
            default: _(() => [...f[5] || (f[5] = [
              N("Add a trigger", -1)
            ])]),
            _: 1
          }),
          v(s(C), {
            small: "",
            variant: "primary",
            disabled: !!a.value,
            "data-sequence-triggers-save": "",
            onClick: p
          }, {
            default: _(() => [...f[6] || (f[6] = [
              N("Save", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          v(s(C), {
            small: "",
            onClick: f[1] || (f[1] = (k) => l.value = null)
          }, {
            default: _(() => [...f[7] || (f[7] = [
              N("Cancel", -1)
            ])]),
            _: 1
          }),
          h("span", ft, q(c.value || a.value), 1)
        ])
      ], 64)) : (r(!0), b(w, { key: 0 }, I(d.value, (k) => (r(), b("p", {
        key: k,
        class: "line",
        "data-sequence-trigger": ""
      }, q(k), 1))), 128))
    ]));
  }
}, kt = /* @__PURE__ */ j(qt, [["__scopeId", "data-v-2da9d503"]]), $t = {
  class: "run-head",
  "data-run-head": ""
}, St = {
  __name: "SequenceReader",
  props: { sequence: { type: Object, required: !0 }, runs: { type: Array, required: !0 }, items: { type: Array, required: !0 } },
  emits: ["abandon"],
  setup(e, { emit: t }) {
    const n = e, u = t, i = O(() => B(n.sequence, n.runs)), d = O(() => [
      { key: "steps", label: "Steps", count: n.sequence.steps.length },
      { key: "runs", label: "Runs", count: i.value.length },
      { key: "triggers", label: "Triggers", count: le(n.sequence).length }
    ]), l = O(() => i.value[0] ?? null);
    return (c, a) => (r(), $(s(ce), {
      title: e.sequence.title,
      number: String(e.sequence.id),
      tabs: d.value,
      "data-sequence-reader": ""
    }, {
      agent: _(() => [
        l.value ? (r(), b(w, { key: 0 }, [
          h("span", $t, "Run " + q(l.value.id) + " · step " + q(l.value.step_number) + " of " + q(s(T)(l.value).total), 1),
          v(s(K), {
            name: `Agent ${l.value.session_agent_id}`
          }, null, 8, ["name"])
        ], 64)) : A("", !0)
      ]),
      actions: _(() => [
        v(s(me), {
          items: e.items,
          head: `Sequence ${e.sequence.id}`
        }, null, 8, ["items", "head"])
      ]),
      default: _(({ tab: g }) => [
        v(s(pe), { value: g }, {
          steps: _(() => [
            v(gt, {
              sequence: e.sequence,
              runs: i.value
            }, null, 8, ["sequence", "runs"])
          ]),
          runs: _(() => [
            v(st, {
              runs: i.value,
              all: e.runs,
              onAbandon: a[0] || (a[0] = (p) => u("abandon", p))
            }, null, 8, ["runs", "all"])
          ]),
          triggers: _(() => [
            v(kt, { sequence: e.sequence }, null, 8, ["sequence"])
          ]),
          _: 1
        }, 8, ["value"])
      ]),
      _: 1
    }, 8, ["title", "number", "tabs"]));
  }
};
function wt(e, t, { act: n, ask: u, open: i = null }) {
  const d = B(e, t), l = d.filter((a) => re(a, t)), c = (a) => async ({ say: g }) => {
    const p = await a.line();
    g(p.ok ? a.done : p.error);
  };
  return [
    ...i ? [{ label: "Open", group: "open", run: i }] : [],
    { label: "Start", group: "own", disabled: d.length > 0, reason: "Running", run: c({ line: () => n(["sequence", "run", String(e.id)]), done: `Sequence ${e.id} started` }) },
    ...l.map((a) => ({ label: `Abandon run ${a.id}`, group: "own", run: () => u("abandon", e, a) })),
    { label: "Edit steps", group: "own", run: () => u("steps", e) },
    { label: "Add trigger", group: "own", run: () => u("trigger", e) },
    { label: "Duplicate", group: "own", run: () => u("copy", e) },
    ge({ name: `sequence ${e.id}`, remove: () => n(["sequence", "delete", String(e.id)], ve(e.id)) })
  ];
}
const Ot = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-sequences-failure": ""
}, Ct = {
  key: 0,
  class: "badge-quiet",
  "data-sequence-running": ""
}, At = 460, Nt = {
  __name: "SequenceCards",
  setup(e) {
    const t = x(), { rows: n, data: u, failure: i, loaded: d, act: l, actionFailure: c } = t.props.board, a = O(() => {
      var m;
      return ((m = u.value) == null ? void 0 : m.runs) ?? [];
    }), g = O(() => n.value.map((m) => ({ id: m.id, title: `${m.id} ${m.title}`, desc: He(m, a.value), row: m, running: B(m, a.value).length > 0 }))), p = D(null), o = D(null), f = (m, y, S = null) => o.value = { kind: m, sequence: y, run: S }, k = (m, y = null) => wt(m, a.value, { act: l, ask: f, open: y }), E = (m) => ({ head: `Sequence ${m.id}`, items: k(m.row, () => p.value = m.id) });
    return (m, y) => (r(), $(s(be), {
      chosen: p.value,
      "onUpdate:chosen": y[6] || (y[6] = (S) => p.value = S),
      items: g.value,
      "list-width": At,
      place: E,
      "empty-title": "No sequences yet",
      "pick-line": "Choose a sequence",
      "data-sequences": ""
    }, {
      top: _(() => {
        var S, P, z, G, U;
        return [
          v(s(ye), {
            title: "Sequences",
            count: s(n).length
          }, {
            primary: _(() => [
              v(s(C), {
                small: "",
                variant: "primary",
                "data-sequence-new": "",
                onClick: y[0] || (y[0] = (W) => f("new"))
              }, {
                default: _(() => [...y[7] || (y[7] = [
                  N("New sequence", -1)
                ])]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["count"]),
          s(i) || s(c) ? (r(), b("p", Ot, q(s(i) || s(c)), 1)) : A("", !0),
          ((S = o.value) == null ? void 0 : S.kind) === "new" ? (r(), $(Y, {
            key: 1,
            onClose: y[1] || (y[1] = (W) => o.value = null)
          })) : ((P = o.value) == null ? void 0 : P.kind) === "copy" ? (r(), $(Y, {
            key: 2,
            title: `${o.value.sequence.title} copy`,
            steps: [...o.value.sequence.steps],
            onClose: y[2] || (y[2] = (W) => o.value = null)
          }, null, 8, ["title", "steps"])) : ((z = o.value) == null ? void 0 : z.kind) === "steps" ? (r(), $(Ue, {
            key: 3,
            sequence: o.value.sequence,
            onClose: y[3] || (y[3] = (W) => o.value = null)
          }, null, 8, ["sequence"])) : ((G = o.value) == null ? void 0 : G.kind) === "trigger" ? (r(), $(Je, {
            key: 4,
            sequence: o.value.sequence,
            onClose: y[4] || (y[4] = (W) => o.value = null)
          }, null, 8, ["sequence"])) : ((U = o.value) == null ? void 0 : U.kind) === "abandon" ? (r(), $(Fe, {
            key: 5,
            run: o.value.run,
            onClose: y[5] || (y[5] = (W) => o.value = null)
          }, null, 8, ["run"])) : A("", !0)
        ];
      }),
      empty: _(() => [
        s(d) ? (r(), b(w, { key: 1 }, [
          N("A sequence is steps an agent works through in order.")
        ], 64)) : (r(), $(s(_e), {
          key: 0,
          shape: "rows"
        }))
      ]),
      meta: _(({ item: S }) => [
        S.running ? (r(), b("span", Ct, "Running")) : A("", !0)
      ]),
      reader: _(({ item: S }) => [
        v(St, {
          sequence: S.row,
          runs: a.value,
          items: k(S.row),
          onAbandon: (P) => f("abandon", S.row, P)
        }, null, 8, ["sequence", "runs", "items", "onAbandon"])
      ]),
      _: 1
    }, 8, ["chosen", "items"]));
  }
}, Rt = /* @__PURE__ */ j(Nt, [["__scopeId", "data-v-186ad116"]]);
export {
  Rt as default
};
