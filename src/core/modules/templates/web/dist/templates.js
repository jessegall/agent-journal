if (!document.getElementById("window-styles-bff7404941fd")) { const style = document.createElement("style"); style.id = "window-styles-bff7404941fd"; style.textContent = ".fixed[data-v-5a86c69b]{margin:12px 0 0;color:var(--text-3);font-size:12.5px}.command[data-v-5a86c69b]{margin:0 0 4px;font-family:var(--mono, monospace);font-size:12.5px}.part[data-v-5a86c69b]{margin:0 0 6px;color:var(--text-2);font-size:13px}.age[data-v-8861d63d]{color:var(--text-3);font-size:12px;white-space:nowrap}.failure[data-v-8861d63d]{margin:0;padding:6px var(--inset);color:var(--bad, var(--text-2));font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as r, createBlock as c, unref as a, withCtx as d, createVNode as y, computed as N, createElementBlock as b, createCommentVNode as v, Fragment as q, renderList as F, toDisplayString as O, createElementVNode as G, createTextVNode as x, ref as C } from "vue";
import { useWindow as E, CreateDialog as M, TextList as V, Reader as Q, ReaderSection as U, Btn as L, optionsOf as X, defaultFilter as Y, applyFilter as Z, ListReaderLayout as _, TimeAgo as ee, Skeleton as te, PageHeader as ae, FilterBar as le } from "@journal/window-kit";
const A = { plan: "Plan", task: "Task", doc: "Document" }, j = [["plan", "Plans"], ["task", "Tasks"], ["doc", "Documents"], ["plan,task", "Plans and tasks"]], ne = (e) => /\s/.test(e) ? JSON.stringify(e) : e, R = (e) => `journal ${e.map(ne).join(" ")}`, h = (e) => e.map((t) => t.trim()).filter(Boolean), D = (e) => !e.module, P = (e) => [...new Set(e.parts.flatMap((t) => [...t.matchAll(/\{(\w+)\}/g)].map((l) => l[1])))];
function I(e) {
  const t = e.indexOf(":");
  return t < 0 ? { heading: e, body: "" } : { heading: e.slice(0, t).trim(), body: e.slice(t + 1).trim() };
}
function se(e = null) {
  const t = (e == null ? void 0 : e.targets.join(",")) || "plan";
  return [
    { key: "title", label: "Title", required: !0, placeholder: "Plan: release", value: (e == null ? void 0 : e.title) ?? "" },
    { key: "brief", label: "Description", required: !0, value: (e == null ? void 0 : e.brief) ?? "" },
    { key: "applies", label: "Applies to", kind: "select", options: j.some(([l]) => l === t) ? j : [...j, [t, t]], value: t },
    { key: "purpose", label: "Purpose", value: (e == null ? void 0 : e.purpose) ?? "" },
    { key: "parts", label: "Parts", kind: "slot", required: !0, value: e ? [...e.parts] : [""] },
    { key: "commands", label: "Phase end commands", kind: "slot", help: "Run at each phase end of a plan", value: e ? [...e.commands] : [], when: (l) => l.applies.startsWith("plan") }
  ];
}
const oe = (e) => h(e.parts).some((t) => t.includes("|")) ? { parts: "A part cannot hold the | sign." } : {}, J = (e) => e.applies.startsWith("plan") && h(e.commands).length > 0, re = (e) => ["template", "make", e.title.trim(), "--applies-to", e.applies, "--brief", e.brief.trim(), "--purpose", e.purpose.trim(), "--parts", h(e.parts).join(" | "), ...J(e) ? ["--commands", h(e.commands).join(" | ")] : []], ie = (e) => R(["template", "make", e.title.trim() || "…", "--applies-to", e.applies, "--brief", "…", "--parts", "…"]), de = (e, t) => ["template", "edit", String(e.id), "--title", t.title.trim(), "--brief", t.brief.trim(), "--targets", ...t.applies.split(","), "--purpose", t.purpose.trim(), "--parts", ...h(t.parts), ...J(t) ? ["--commands", ...h(t.commands)] : []], me = (e) => () => R(["template", "edit", String(e.id), "…"]), pe = (e) => [
  { key: "kind", label: "On", kind: "select", options: (e.targets.length ? e.targets : Object.keys(A)).map((t) => [t, A[t] ?? t]), required: !0 },
  { key: "row", label: "Number", required: !0, placeholder: "1131" },
  ...P(e).map((t) => ({ key: `slot-${t}`, label: `{${t}}`, required: !0 }))
], ue = (e) => /^\d+$/.test(e.row.trim()) ? {} : { row: "Write the number of the row." }, ce = (e, t) => ["template", "send", String(e.id), `--on=${t.kind}:${t.row.trim()}`, ...P(e).map((l) => `--set=${l}=${t[`slot-${l}`]}`)], fe = (e) => (t) => R(["template", "send", String(e.id), `--on=${t.kind}:${t.row.trim() || "…"}`, ...P(e).map((l) => `--set=${l}=…`)]), ke = {
  __name: "SendTemplate",
  props: { template: { type: Object, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const l = e, p = t, f = E();
    return (m, s) => (r(), c(a(M), {
      title: `Send ${e.template.title}`,
      submit: "Send it",
      fields: a(pe)(e.template),
      command: a(fe)(e.template),
      check: a(ue),
      run: (o) => a(f).run(a(ce)(l.template, o)),
      onClose: s[0] || (s[0] = (o) => p("close"))
    }, null, 8, ["title", "fields", "command", "check", "run"]));
  }
}, H = {
  __name: "TemplateForm",
  props: { template: { type: Object, default: null } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const l = e, p = t, f = E(), m = (s) => f.run(l.template ? de(l.template, s) : re(s));
    return (s, o) => (r(), c(a(M), {
      title: e.template ? `Edit ${e.template.title}` : "New template",
      submit: e.template ? "Save the template" : "Make the template",
      fields: a(se)(e.template),
      command: e.template ? a(me)(e.template) : a(ie),
      check: a(oe),
      run: m,
      onClose: o[0] || (o[0] = (w) => p("close"))
    }, {
      parts: d(({ value: w, set: $ }) => [
        y(a(V), {
          items: w,
          kind: "part",
          noun: "Part",
          placeholder: "Brief: what the plan is for, {goal}",
          "add-label": "Add a part",
          onItems: $
        }, null, 8, ["items", "onItems"])
      ]),
      commands: d(({ value: w, set: $ }) => [
        y(a(V), {
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
}, K = (e, t) => {
  const l = e.__vccOpts || e;
  for (const [p, f] of t)
    l[p] = f;
  return l;
}, be = {
  key: 0,
  class: "fixed",
  role: "note",
  "data-template-fixed": ""
}, ye = { key: 0 }, we = {
  key: 0,
  class: "part"
}, ge = {
  __name: "TemplateReader",
  props: { template: { type: Object, required: !0 } },
  emits: ["send", "edit"],
  setup(e, { emit: t }) {
    const l = e, p = t, f = N(() => [
      { name: "applies", label: "Applies to", value: l.template.targets.length ? l.template.targets.map((m) => A[m] ?? m).join(", ") : "Any row" },
      { name: "purpose", label: "Purpose", value: l.template.purpose || "None" },
      { name: "slots", label: "Slots", value: P(l.template).map((m) => `{${m}}`).join(", ") || "None" },
      { name: "written", label: "Written by", value: l.template.module ? `The ${l.template.module} module` : "A user" }
    ]);
    return (m, s) => (r(), c(a(Q), {
      title: e.template.title,
      number: String(e.template.id),
      abstract: e.template.brief,
      facts: f.value,
      "data-template-reader": ""
    }, {
      primary: d(() => [
        y(a(L), {
          small: "",
          variant: "primary",
          "data-template-send": "",
          onClick: s[0] || (s[0] = (o) => p("send"))
        }, {
          default: d(() => [...s[2] || (s[2] = [
            x("Send it on a row", -1)
          ])]),
          _: 1
        })
      ]),
      actions: d(() => [
        a(D)(e.template) ? (r(), c(a(L), {
          key: 0,
          small: "",
          "data-template-edit": "",
          onClick: s[1] || (s[1] = (o) => p("edit"))
        }, {
          default: d(() => [...s[3] || (s[3] = [
            x("Edit", -1)
          ])]),
          _: 1
        })) : v("", !0)
      ]),
      default: d(() => [
        a(D)(e.template) ? v("", !0) : (r(), b("p", be, "Once made, a template is not changed: make a new one.")),
        e.template.commands.length ? (r(), c(a(U), {
          key: 1,
          title: "Runs at each phase end"
        }, {
          default: d(() => [
            (r(!0), b(q, null, F(e.template.commands, (o) => (r(), b("p", {
              key: o,
              class: "command",
              "data-template-command": ""
            }, O(o), 1))), 128))
          ]),
          _: 1
        })) : v("", !0),
        y(a(U), { title: "Its parts" }, {
          default: d(() => [
            (r(!0), b(q, null, F(e.template.parts, (o) => (r(), b("p", {
              key: o,
              class: "part",
              "data-template-part": ""
            }, [
              G("strong", null, O(a(I)(o).heading), 1),
              a(I)(o).body ? (r(), b("span", ye, O(` ${a(I)(o).body}`), 1)) : v("", !0)
            ]))), 128)),
            e.template.parts.length ? v("", !0) : (r(), b("p", we, "None"))
          ]),
          _: 1
        })
      ]),
      _: 1
    }, 8, ["title", "number", "abstract", "facts"]));
  }
}, ve = /* @__PURE__ */ K(ge, [["__scopeId", "data-v-5a86c69b"]]), he = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-templates-failure": ""
}, $e = 460, Se = {
  __name: "TemplateCards",
  setup(e) {
    const t = E(), { rows: l, failure: p, loaded: f } = t.props.templates, m = N(() => [{ key: "applies", label: "Applies to", options: X(l.value, (n) => n.targets, (n) => A[n] ?? n), get: (n) => n.targets }]), s = C(Y(m.value)), o = C(""), w = N(() => Z(l.value, m.value, s.value, o.value, ["title", "brief", "purpose"])), $ = N(() => w.value.map((n) => ({ id: n.id, title: `${n.id} ${n.title}`, desc: n.brief, row: n }))), W = C(null), k = C(null), S = (n, i = null) => k.value = { kind: n, template: i }, z = (n) => ({
      head: `Template ${n.id}`,
      items: [
        { label: "Use", group: "open", run: () => S("send", n.row) },
        ...D(n.row) ? [{ label: "Edit", group: "own", run: () => S("edit", n.row) }] : []
      ]
    });
    return (n, i) => (r(), c(a(_), {
      chosen: W.value,
      "onUpdate:chosen": i[6] || (i[6] = (u) => W.value = u),
      items: $.value,
      "list-width": $e,
      place: z,
      "empty-title": "No templates yet",
      "pick-line": "Choose a template",
      "data-templates": ""
    }, {
      top: d(() => {
        var u, T, B;
        return [
          y(a(ae), {
            title: "Templates",
            count: a(l).length
          }, {
            primary: d(() => [
              y(a(L), {
                small: "",
                variant: "primary",
                "data-template-new": "",
                onClick: i[0] || (i[0] = (g) => S("new"))
              }, {
                default: d(() => [...i[7] || (i[7] = [
                  x("New template", -1)
                ])]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["count"]),
          y(a(le), {
            modelValue: s.value,
            "onUpdate:modelValue": i[1] || (i[1] = (g) => s.value = g),
            words: o.value,
            "onUpdate:words": i[2] || (i[2] = (g) => o.value = g),
            fields: m.value,
            rows: a(l),
            shown: w.value.length,
            placeholder: "Search templates"
          }, null, 8, ["modelValue", "words", "fields", "rows", "shown"]),
          a(p) ? (r(), b("p", he, O(a(p)), 1)) : v("", !0),
          ((u = k.value) == null ? void 0 : u.kind) === "new" ? (r(), c(H, {
            key: 1,
            onClose: i[3] || (i[3] = (g) => k.value = null)
          })) : ((T = k.value) == null ? void 0 : T.kind) === "edit" ? (r(), c(H, {
            key: 2,
            template: k.value.template,
            onClose: i[4] || (i[4] = (g) => k.value = null)
          }, null, 8, ["template"])) : ((B = k.value) == null ? void 0 : B.kind) === "send" ? (r(), c(ke, {
            key: 3,
            template: k.value.template,
            onClose: i[5] || (i[5] = (g) => k.value = null)
          }, null, 8, ["template"])) : v("", !0)
        ];
      }),
      empty: d(() => [
        a(f) ? (r(), b(q, { key: 1 }, [
          x("A template is a shape for a task, a plan or a review.")
        ], 64)) : (r(), c(a(te), {
          key: 0,
          shape: "rows"
        }))
      ]),
      meta: d(({ item: u }) => [
        y(a(ee), {
          class: "age",
          at: u.row.created_at
        }, null, 8, ["at"])
      ]),
      reader: d(({ item: u }) => [
        y(ve, {
          template: u.row,
          onSend: (T) => S("send", u.row),
          onEdit: (T) => S("edit", u.row)
        }, null, 8, ["template", "onSend", "onEdit"])
      ]),
      _: 1
    }, 8, ["chosen", "items"]));
  }
}, Ne = /* @__PURE__ */ K(Se, [["__scopeId", "data-v-8861d63d"]]);
export {
  Ne as default
};
