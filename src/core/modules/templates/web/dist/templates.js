if (!document.getElementById("window-styles-49f998eb368d")) { const style = document.createElement("style"); style.id = "window-styles-49f998eb368d"; style.textContent = ".fixed[data-v-8eec169f]{margin:12px 0 0;color:var(--text-3);font-size:12.5px}.command[data-v-8eec169f]{margin:0 0 4px;font-family:var(--mono, monospace);font-size:12.5px}.part[data-v-8eec169f]{margin:0 0 6px;color:var(--text-2);font-size:13px}.age[data-v-06d7e930]{color:var(--text-3);font-size:12px;white-space:nowrap}.failure[data-v-06d7e930]{margin:0;padding:6px var(--inset);color:var(--bad, var(--text-2));font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as m, createBlock as g, unref as a, withCtx as i, createVNode as d, computed as C, createElementBlock as b, createCommentVNode as v, Fragment as I, renderList as W, toDisplayString as N, createElementVNode as K, createTextVNode as O, ref as T } from "vue";
import { useWindow as D, CreateDialog as U, TextList as B, Reader as z, ReaderSection as F, Btn as q, optionsOf as G, defaultFilter as Q, applyFilter as X, ListReaderLayout as Y, TimeAgo as Z, Skeleton as _, PageHeader as ee, FilterBar as te, SwitchCase as ae } from "@journal/window-kit";
const x = { plan: "Plan", task: "Task", doc: "Document" }, P = [["plan", "Plans"], ["task", "Tasks"], ["doc", "Documents"], ["plan,task", "Plans and tasks"]], le = (e) => /\s/.test(e) ? JSON.stringify(e) : e, E = (e) => `journal ${e.map(le).join(" ")}`, h = (e) => e.map((t) => t.trim()).filter(Boolean), L = (e) => !e.module, A = (e) => [...new Set(e.parts.flatMap((t) => [...t.matchAll(/\{(\w+)\}/g)].map((l) => l[1])))];
function j(e) {
  const t = e.indexOf(":");
  return t < 0 ? { heading: e, body: "" } : { heading: e.slice(0, t).trim(), body: e.slice(t + 1).trim() };
}
function ne(e = null) {
  const t = (e == null ? void 0 : e.targets.join(",")) || "plan";
  return [
    { key: "title", label: "Title", required: !0, placeholder: "Plan: release", value: (e == null ? void 0 : e.title) ?? "" },
    { key: "brief", label: "Description", required: !0, value: (e == null ? void 0 : e.brief) ?? "" },
    { key: "applies", label: "Applies to", kind: "select", options: P.some(([l]) => l === t) ? P : [...P, [t, t]], value: t },
    { key: "purpose", label: "Purpose", value: (e == null ? void 0 : e.purpose) ?? "" },
    { key: "parts", label: "Parts", kind: "slot", required: !0, value: e ? [...e.parts] : [""] },
    { key: "commands", label: "Phase end commands", kind: "slot", help: "Run at each phase end of a plan", value: e ? [...e.commands] : [], when: (l) => l.applies.startsWith("plan") }
  ];
}
const se = (e) => h(e.parts).some((t) => t.includes("|")) ? { parts: "A part cannot hold the | sign." } : {}, H = (e) => e.applies.startsWith("plan") && h(e.commands).length > 0, oe = (e) => ["template", "make", e.title.trim(), "--applies-to", e.applies, "--brief", e.brief.trim(), "--purpose", e.purpose.trim(), "--parts", h(e.parts).join(" | "), ...H(e) ? ["--commands", h(e.commands).join(" | ")] : []], re = (e) => E(["template", "make", e.title.trim() || "…", "--applies-to", e.applies, "--brief", "…", "--parts", "…"]), ie = (e, t) => ["template", "edit", String(e.id), "--title", t.title.trim(), "--brief", t.brief.trim(), "--targets", ...t.applies.split(","), "--purpose", t.purpose.trim(), "--parts", ...h(t.parts), ...H(t) ? ["--commands", ...h(t.commands)] : []], me = (e) => () => E(["template", "edit", String(e.id), "…"]), de = (e) => [
  { key: "kind", label: "On", kind: "select", options: (e.targets.length ? e.targets : Object.keys(x)).map((t) => [t, x[t] ?? t]), required: !0 },
  { key: "row", label: "Number", required: !0, placeholder: "1131" },
  ...A(e).map((t) => ({ key: `slot-${t}`, label: `{${t}}`, required: !0 }))
], pe = (e) => /^\d+$/.test(e.row.trim()) ? {} : { row: "Write the number of the row." }, ue = (e, t) => ["template", "send", String(e.id), `--on=${t.kind}:${t.row.trim()}`, ...A(e).map((l) => `--set=${l}=${t[`slot-${l}`]}`)], ce = (e) => (t) => E(["template", "send", String(e.id), `--on=${t.kind}:${t.row.trim() || "…"}`, ...A(e).map((l) => `--set=${l}=…`)]), fe = {
  __name: "SendTemplate",
  props: { template: { type: Object, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const l = e, u = t, f = D();
    return (p, s) => (m(), g(a(U), {
      title: `Send ${e.template.title}`,
      submit: "Send it",
      fields: a(de)(e.template),
      command: a(ce)(e.template),
      check: a(pe),
      run: (o) => a(f).run(a(ue)(l.template, o)),
      onClose: s[0] || (s[0] = (o) => u("close"))
    }, null, 8, ["title", "fields", "command", "check", "run"]));
  }
}, V = {
  __name: "TemplateForm",
  props: { template: { type: Object, default: null } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const l = e, u = t, f = D(), p = (s) => f.run(l.template ? ie(l.template, s) : oe(s));
    return (s, o) => (m(), g(a(U), {
      title: e.template ? `Edit ${e.template.title}` : "New template",
      submit: e.template ? "Save the template" : "Make the template",
      fields: a(ne)(e.template),
      command: e.template ? a(me)(e.template) : a(re),
      check: a(se),
      run: p,
      onClose: o[0] || (o[0] = (w) => u("close"))
    }, {
      parts: i(({ value: w, set: $ }) => [
        d(a(B), {
          items: w,
          kind: "part",
          noun: "Part",
          placeholder: "Brief: what the plan is for, {goal}",
          "add-label": "Add a part",
          onItems: $
        }, null, 8, ["items", "onItems"])
      ]),
      commands: i(({ value: w, set: $ }) => [
        d(a(B), {
          items: w,
          kind: "command",
          noun: "Command",
          placeholder: "pytest tests -q",
          "add-label": "Add a command",
          "keep-one": !1,
          onItems: $
        }, null, 8, ["items", "onItems"])
      ]),
      _: 1
    }, 8, ["title", "submit", "fields", "command", "check"]));
  }
}, M = (e, t) => {
  const l = e.__vccOpts || e;
  for (const [u, f] of t)
    l[u] = f;
  return l;
}, ke = {
  key: 0,
  class: "fixed",
  role: "note",
  "data-template-fixed": ""
}, be = { key: 0 }, we = {
  key: 0,
  class: "part"
}, ye = {
  __name: "TemplateReader",
  props: { template: { type: Object, required: !0 } },
  emits: ["send", "edit"],
  setup(e, { emit: t }) {
    const l = e, u = t, f = C(() => [
      { name: "applies", label: "Applies to", value: l.template.targets.length ? l.template.targets.map((p) => x[p] ?? p).join(", ") : "Any row" },
      { name: "purpose", label: "Purpose", value: l.template.purpose || "None" },
      { name: "slots", label: "Slots", value: A(l.template).map((p) => `{${p}}`).join(", ") || "None" },
      { name: "written", label: "Written by", value: l.template.module ? `The ${l.template.module} module` : "A user" }
    ]);
    return (p, s) => (m(), g(a(z), {
      title: e.template.title,
      number: String(e.template.id),
      abstract: e.template.brief,
      facts: f.value,
      "data-template-reader": ""
    }, {
      primary: i(() => [
        d(a(q), {
          small: "",
          variant: "primary",
          "data-template-send": "",
          onClick: s[0] || (s[0] = (o) => u("send"))
        }, {
          default: i(() => [...s[2] || (s[2] = [
            O("Send it on a row", -1)
          ])]),
          _: 1
        })
      ]),
      actions: i(() => [
        a(L)(e.template) ? (m(), g(a(q), {
          key: 0,
          small: "",
          "data-template-edit": "",
          onClick: s[1] || (s[1] = (o) => u("edit"))
        }, {
          default: i(() => [...s[3] || (s[3] = [
            O("Edit", -1)
          ])]),
          _: 1
        })) : v("", !0)
      ]),
      default: i(() => [
        a(L)(e.template) ? v("", !0) : (m(), b("p", ke, "Once made, a template is not changed: make a new one.")),
        e.template.commands.length ? (m(), g(a(F), {
          key: 1,
          title: "Runs at each phase end"
        }, {
          default: i(() => [
            (m(!0), b(I, null, W(e.template.commands, (o) => (m(), b("p", {
              key: o,
              class: "command",
              "data-template-command": ""
            }, N(o), 1))), 128))
          ]),
          _: 1
        })) : v("", !0),
        d(a(F), { title: "Its parts" }, {
          default: i(() => [
            (m(!0), b(I, null, W(e.template.parts, (o) => (m(), b("p", {
              key: o,
              class: "part",
              "data-template-part": ""
            }, [
              K("strong", null, N(a(j)(o).heading), 1),
              a(j)(o).body ? (m(), b("span", be, N(` ${a(j)(o).body}`), 1)) : v("", !0)
            ]))), 128)),
            e.template.parts.length ? v("", !0) : (m(), b("p", we, "None"))
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["title", "number", "abstract", "facts"]));
  }
}, ge = /* @__PURE__ */ M(ye, [["__scopeId", "data-v-8eec169f"]]), ve = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-templates-failure": ""
}, he = 460, $e = {
  __name: "TemplateCards",
  setup(e) {
    const t = D(), { rows: l, failure: u, loaded: f } = t.props.templates, p = C(() => [{ key: "applies", label: "Applies to", options: G(l.value, (n) => n.targets, (n) => x[n] ?? n), get: (n) => n.targets }]), s = T(Q(p.value)), o = T(""), w = C(() => X(l.value, p.value, s.value, o.value, ["title", "brief", "purpose"])), $ = C(() => w.value.map((n) => ({ id: n.id, title: `${n.id} ${n.title}`, desc: n.brief, row: n }))), R = T(null), y = T(null), S = (n, r = null) => y.value = { kind: n, template: r }, J = (n) => ({
      head: `Template ${n.id}`,
      items: [
        { label: "Use", group: "open", run: () => S("send", n.row) },
        ...L(n.row) ? [{ label: "Edit", group: "own", run: () => S("edit", n.row) }] : []
      ]
    });
    return (n, r) => (m(), g(a(Y), {
      chosen: R.value,
      "onUpdate:chosen": r[6] || (r[6] = (c) => R.value = c),
      items: $.value,
      "list-width": he,
      place: J,
      "empty-title": "No templates yet",
      "pick-line": "Choose a template",
      "data-templates": ""
    }, {
      top: i(() => {
        var c;
        return [
          d(a(ee), {
            title: "Templates",
            count: a(l).length
          }, {
            primary: i(() => [
              d(a(q), {
                small: "",
                variant: "primary",
                "data-template-new": "",
                onClick: r[0] || (r[0] = (k) => S("new"))
              }, {
                default: i(() => [...r[7] || (r[7] = [
                  O("New template", -1)
                ])]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["count"]),
          d(a(te), {
            modelValue: s.value,
            "onUpdate:modelValue": r[1] || (r[1] = (k) => s.value = k),
            words: o.value,
            "onUpdate:words": r[2] || (r[2] = (k) => o.value = k),
            fields: p.value,
            rows: a(l),
            shown: w.value.length,
            placeholder: "Search templates"
          }, null, 8, ["modelValue", "words", "fields", "rows", "shown"]),
          a(u) ? (m(), b("p", ve, N(a(u)), 1)) : v("", !0),
          d(a(ae), {
            value: (c = y.value) == null ? void 0 : c.kind
          }, {
            new: i(() => [
              d(V, {
                onClose: r[3] || (r[3] = (k) => y.value = null)
              })
            ]),
            edit: i(() => [
              d(V, {
                template: y.value.template,
                onClose: r[4] || (r[4] = (k) => y.value = null)
              }, null, 8, ["template"])
            ]),
            send: i(() => [
              d(fe, {
                template: y.value.template,
                onClose: r[5] || (r[5] = (k) => y.value = null)
              }, null, 8, ["template"])
            ]),
            _: 1
          }, 8, ["value"])
        ];
      }),
      empty: i(() => [
        a(f) ? (m(), b(I, { key: 1 }, [
          O("A template is a shape for a task, a plan or a review.")
        ], 64)) : (m(), g(a(_), {
          key: 0,
          shape: "rows"
        }))
      ]),
      meta: i(({ item: c }) => [
        d(a(Z), {
          class: "age",
          at: c.row.created_at
        }, null, 8, ["at"])
      ]),
      reader: i(({ item: c }) => [
        d(ge, {
          template: c.row,
          onSend: (k) => S("send", c.row),
          onEdit: (k) => S("edit", c.row)
        }, null, 8, ["template", "onSend", "onEdit"])
      ]),
      _: 1
    }, 8, ["chosen", "items"]));
  }
}, Ce = /* @__PURE__ */ M($e, [["__scopeId", "data-v-06d7e930"]]);
export {
  Ce as default
};
