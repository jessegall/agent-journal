if (!document.getElementById("window-styles-684eda9ec426")) { const style = document.createElement("style"); style.id = "window-styles-684eda9ec426"; style.textContent = ".library-draft[data-v-b80380bc]{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.library-draft-foot[data-v-b80380bc]{display:flex;gap:6px;justify-content:flex-end}.library[data-v-b80380bc]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-b80380bc]{gap:10px}.library-body[data-v-b80380bc]{display:grid;flex:1;grid-template-columns:1fr;min-height:0}.library-list[data-v-b80380bc]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-b80380bc]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-b80380bc]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-b80380bc]:hover{background:var(--hover)}.library-icon[data-v-b80380bc]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-b80380bc]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-b80380bc]{font-weight:600}.library-abstract[data-v-b80380bc]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-b80380bc],.library-age[data-v-b80380bc]{color:var(--text-3);font-size:12px}.library-more[data-v-b80380bc]{margin:8px 12px;color:var(--muted);background:none;border:0;cursor:pointer}.library-note[data-v-b80380bc]{margin:0;color:var(--text-2)}.library-note[data-v-b80380bc]{padding:12px}.revisions[data-v-258f93a7]{padding-top:16px}.failure[data-v-258f93a7]{color:var(--bad, var(--text-2));font-size:12.5px}.age[data-v-4bb75170]{color:var(--text-3);font-size:12px;white-space:nowrap}.more[data-v-4bb75170],.failure[data-v-4bb75170]{margin:0;padding:4px var(--inset);font-size:12px}.failure[data-v-4bb75170]{color:var(--bad, var(--text-2))}\n"; document.head.appendChild(style); }
import { ref as p, onMounted as O, openBlock as i, createBlock as w, unref as t, createElementBlock as g, toDisplayString as D, createCommentVNode as S, createVNode as v, computed as q, withCtx as y, Fragment as H, createTextVNode as E } from "vue";
import { peekRef as _, copying as z, useWindow as R, CreateDialog as V, ReaderTimeline as G, Reader as J, SwitchCase as K, ReaderLinks as Q, DocumentBody as X, ActionsMenu as Y, ListReaderLayout as Z, TimeAgo as ee, Skeleton as te, PageHeader as ae, SearchBar as re, Segmented as N, Btn as ne } from "@journal/window-kit";
import { _ as A, u as oe, g as le, s as se, a as ie } from "./DocumentLibrary-BCoY0eg8.js";
import { d as ue } from "./documentRead-DHNxyEM4.js";
const de = { doc: "docs", report: "reports" }, P = { doc: "document", report: "report" }, j = (e) => !!e.close_reason;
function ce(e, s, { ask: o, open: u = null }) {
  return [
    ...u ? [{ label: "Open", group: "open", run: u }] : [],
    { label: "Open in the inspector", group: "open", run: () => _(`${de[s]}:${e.id}`) },
    { label: "Copy the command", group: "copy", run: ({ say: n }) => z(`journal ${s} show ${e.id}`, "the command", n) },
    { label: "Edit the text", group: "own", run: () => o("edit") },
    ...j(e) ? [] : [{ label: "Mark as needing no action", group: "own", run: () => o("settle") }]
  ];
}
const me = {
  key: 1,
  class: "failure",
  role: "alert",
  "data-document-edit-failure": ""
}, ve = {
  __name: "DocumentEdit",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 } },
  emits: ["close"],
  setup(e, { emit: s }) {
    const o = e, u = s, n = R(), l = p(null), r = p(""), b = () => [{ key: "abstract", label: "Summary", required: !0, value: l.value.abstract }, { key: "body", label: "Text", kind: "area", required: !0, value: l.value.body }], f = (c) => `journal ${o.term} edit ${o.id} --abstract "${c.abstract.trim().slice(0, 40)}" --body …`;
    return O(async () => {
      const c = await n.read([o.term, "inspect", String(o.id)]);
      c.ok ? l.value = c.value : r.value = c.error;
    }), (c, x) => l.value ? (i(), w(t(V), {
      key: 0,
      title: `Edit the text of this ${t(P)[e.term]}`,
      submit: "Save the text",
      fields: b(),
      command: f,
      run: ($) => t(n).run([e.term, "edit", String(e.id), "--abstract", $.abstract.trim(), "--body", $.body.trim()]),
      onClose: x[0] || (x[0] = ($) => u("close"))
    }, null, 8, ["title", "fields", "run"])) : r.value ? (i(), g("p", me, D(r.value), 1)) : S("", !0);
  }
}, ye = {
  class: "revisions",
  "data-document-revisions-tab": ""
}, pe = {
  key: 0,
  class: "failure",
  role: "alert"
}, be = {
  __name: "DocumentRevisionList",
  props: { id: { type: Number, required: !0 } },
  setup(e) {
    const s = e, o = R(), u = p([]), n = p("");
    return O(async () => {
      const l = await o.read(["doc", "revisions", String(s.id)]);
      n.value = l.ok ? "" : l.error, u.value = l.ok ? l.value.rows.map((r) => ({ id: r.number, by: r.author_name, at: r.created_at, text: `Revision ${r.number}: ${r.change}` })) : [];
    }), (l, r) => (i(), g("div", ye, [
      n.value ? (i(), g("p", pe, D(n.value), 1)) : S("", !0),
      v(t(G), { entries: u.value }, null, 8, ["entries"])
    ]));
  }
}, ke = /* @__PURE__ */ A(be, [["__scopeId", "data-v-258f93a7"]]), we = {
  __name: "DocumentReader",
  props: { term: { type: String, required: !0 }, row: { type: Object, required: !0 }, items: { type: Array, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const s = e, o = p("text"), u = q(() => [{ key: "text", label: "Text" }, ...s.term === "doc" ? [{ key: "revisions", label: "Revisions" }] : [], { key: "links", label: "Links" }]), n = q(() => [{ name: "state", label: "State", value: j(s.row) ? `Closed: ${s.row.close_reason}` : "Open" }, { name: "updated", label: "Changed", value: s.row.updated_at, isTime: !0 }]);
    return (l, r) => (i(), w(t(J), {
      tab: o.value,
      "onUpdate:tab": r[0] || (r[0] = (b) => o.value = b),
      title: e.row.title,
      number: String(e.row.id),
      abstract: e.row.abstract,
      tabs: u.value,
      facts: n.value,
      "data-document-reader": ""
    }, {
      actions: y(() => [
        v(t(Y), {
          items: e.items,
          head: e.row.title
        }, null, 8, ["items", "head"])
      ]),
      default: y(() => [
        v(t(K), { value: o.value }, {
          text: y(() => [
            (i(), w(t(X), {
              key: `${e.term}:${e.row.id}`,
              term: e.term,
              id: e.row.id,
              read: e.read,
              "text-only": ""
            }, null, 8, ["term", "id", "read"]))
          ]),
          revisions: y(() => [
            (i(), w(ke, {
              key: e.row.id,
              id: e.row.id
            }, null, 8, ["id"]))
          ]),
          links: y(() => [
            v(t(Q), {
              model: e.term,
              id: e.row.id
            }, null, 8, ["model", "id"])
          ]),
          _: 1
        }, 8, ["value"])
      ]),
      _: 1
    }, 8, ["tab", "title", "number", "abstract", "tabs", "facts"]));
  }
}, fe = {
  __name: "DocumentSettle",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 } },
  emits: ["close"],
  setup(e, { emit: s }) {
    const o = e, u = s, n = R(), l = [{ key: "why", label: "Why it needs no action", required: !0, placeholder: "The change was made another way" }], r = (b) => `journal ${o.term} close ${o.id} --why "${b.why.trim() || "…"}"`;
    return (b, f) => (i(), w(t(V), {
      title: `Mark this ${t(P)[e.term]} as needing no action`,
      submit: "Mark it",
      fields: l,
      command: r,
      run: (c) => t(n).run([e.term, "close", String(e.id), "--why", c.why.trim()]),
      onClose: f[0] || (f[0] = (c) => u("close"))
    }, null, 8, ["title", "run"]));
  }
}, he = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-documents-failure": ""
}, ge = {
  key: 1,
  class: "more"
}, $e = 460, Se = {
  __name: "DocumentsPage",
  setup(e) {
    const s = [{ key: "doc", label: "Documents" }, { key: "report", label: "Reports" }], o = [{ key: "open", label: "Open" }, { key: "closed", label: "Closed" }], u = R(), n = p("doc"), l = p("open"), r = p(""), { rows: b, total: f, failure: c, loaded: x, more: $ } = oe(u, n, l), I = q(() => le(se(ie(b.value, r.value), "newest"), "newest").flatMap((d) => d.rows.map((a) => ({ id: a.id, title: `${a.id} ${a.title}`, desc: a.abstract, group: d.title, row: a })))), C = p(null), k = p(null), W = (d, a) => k.value = { kind: d, row: a, term: n.value }, L = (d, a = null) => ce(d, n.value, { ask: (m) => W(m, d), open: a }), U = (d) => ({ head: d.row.title, items: L(d.row, () => C.value = d.id) }), F = ue(u), M = (d, a) => {
      a(d), C.value = null;
    };
    return (d, a) => (i(), w(t(Z), {
      chosen: C.value,
      "onUpdate:chosen": a[5] || (a[5] = (m) => C.value = m),
      items: I.value,
      "list-width": $e,
      place: U,
      "empty-title": `No ${n.value === "doc" ? "documents" : "reports"} yet`,
      "pick-line": "Choose a text to read it",
      "data-documents": ""
    }, {
      top: y(() => {
        var m, B;
        return [
          v(t(ae), {
            title: "Documents",
            count: t(f)
          }, null, 8, ["count"]),
          v(t(re), {
            modelValue: r.value,
            "onUpdate:modelValue": a[2] || (a[2] = (h) => r.value = h),
            class: "bar",
            placeholder: "Search titles and summaries"
          }, {
            default: y(() => [
              v(t(N), {
                options: s,
                value: n.value,
                "data-documents-term": "",
                onPick: a[0] || (a[0] = (h) => M(h, (T) => n.value = T))
              }, null, 8, ["value"]),
              v(t(N), {
                options: o,
                value: l.value,
                "data-documents-state": "",
                onPick: a[1] || (a[1] = (h) => M(h, (T) => l.value = T))
              }, null, 8, ["value"])
            ]),
            _: 1
          }, 8, ["modelValue"]),
          t(c) ? (i(), g("p", he, D(t(c)), 1)) : S("", !0),
          t(b).length < t(f) && !r.value ? (i(), g("p", ge, [
            v(t(ne), {
              small: "",
              bordered: "",
              "data-documents-more": "",
              onClick: t($)
            }, {
              default: y(() => [...a[6] || (a[6] = [
                E("Show more", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ])) : S("", !0),
          ((m = k.value) == null ? void 0 : m.kind) === "edit" ? (i(), w(ve, {
            key: 2,
            term: k.value.term,
            id: k.value.row.id,
            onClose: a[3] || (a[3] = (h) => k.value = null)
          }, null, 8, ["term", "id"])) : ((B = k.value) == null ? void 0 : B.kind) === "settle" ? (i(), w(fe, {
            key: 3,
            term: k.value.term,
            id: k.value.row.id,
            onClose: a[4] || (a[4] = (h) => k.value = null)
          }, null, 8, ["term", "id"])) : S("", !0)
        ];
      }),
      empty: y(() => [
        t(x) ? (i(), g(H, { key: 1 }, [
          E(D(r.value ? "Nothing matches the search." : "Documents and reports the agents write appear here."), 1)
        ], 64)) : (i(), w(t(te), {
          key: 0,
          shape: "rows"
        }))
      ]),
      meta: y(({ item: m }) => [
        v(t(ee), {
          class: "age",
          at: m.row.updated_at
        }, null, 8, ["at"])
      ]),
      reader: y(({ item: m }) => [
        v(we, {
          term: n.value,
          row: m.row,
          items: L(m.row),
          read: t(F)
        }, null, 8, ["term", "row", "items", "read"])
      ]),
      _: 1
    }, 8, ["chosen", "items", "empty-title"]));
  }
}, Te = /* @__PURE__ */ A(Se, [["__scopeId", "data-v-4bb75170"]]);
export {
  Te as default
};
