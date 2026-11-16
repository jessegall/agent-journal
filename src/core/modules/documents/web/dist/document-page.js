if (!document.getElementById("window-styles-3d6f6c51354e")) { const style = document.createElement("style"); style.id = "window-styles-3d6f6c51354e"; style.textContent = ".library-draft[data-v-b80380bc]{display:flex;flex-direction:column;gap:8px;margin-bottom:12px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px}.library-draft-foot[data-v-b80380bc]{display:flex;gap:6px;justify-content:flex-end}.library[data-v-b80380bc]{display:flex;flex-direction:column;height:100%;min-height:0}.library-bar[data-v-b80380bc]{gap:10px}.library-body[data-v-b80380bc]{display:grid;flex:1;grid-template-columns:1fr;min-height:0}.library-list[data-v-b80380bc]{overflow-y:auto;padding:6px 10px;border-right:1px solid var(--border)}.library-group[data-v-b80380bc]{margin:12px 20px 6px;font-size:13px;font-weight:500;color:var(--text-2)}.library-row[data-v-b80380bc]{display:flex;gap:12px;align-items:flex-start;width:100%;padding:10px 12px;border:0;border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.library-row[data-v-b80380bc]:hover{background:var(--hover)}.library-icon[data-v-b80380bc]{flex:none;width:28px;height:34px;color:var(--text-3)}.library-text[data-v-b80380bc]{display:flex;flex:1;flex-direction:column;gap:4px;min-width:0}.library-title[data-v-b80380bc]{font-weight:600}.library-abstract[data-v-b80380bc]{display:-webkit-box;overflow:hidden;-webkit-box-orient:vertical;-webkit-line-clamp:2;color:var(--text-2);font-size:13px}.library-ref[data-v-b80380bc],.library-age[data-v-b80380bc]{color:var(--text-3);font-size:12px}.library-more[data-v-b80380bc]{margin:8px 12px;color:var(--muted);background:none;border:0;cursor:pointer}.library-note[data-v-b80380bc]{margin:0;color:var(--text-2)}.library-note[data-v-b80380bc]{padding:12px}.revisions[data-v-258f93a7]{padding-top:16px}.failure[data-v-258f93a7]{color:var(--bad, var(--text-2));font-size:12.5px}.age[data-v-efc3b3c5]{color:var(--text-3);font-size:12px;white-space:nowrap}.more[data-v-efc3b3c5],.failure[data-v-efc3b3c5]{margin:0;padding:4px var(--inset);font-size:12px}.failure[data-v-efc3b3c5]{color:var(--bad, var(--text-2))}\n"; document.head.appendChild(style); }
import { ref as y, onMounted as N, openBlock as m, createBlock as h, unref as t, createElementBlock as g, toDisplayString as C, createCommentVNode as D, createVNode as d, computed as q, withCtx as c, Fragment as F, createTextVNode as B } from "vue";
import { peekRef as H, copying as z, useWindow as R, CreateDialog as O, ReaderTimeline as G, Reader as J, SwitchCase as V, ReaderLinks as K, DocumentBody as Q, ActionsMenu as X, ListReaderLayout as Y, TimeAgo as Z, Skeleton as ee, PageHeader as te, SearchBar as ae, Segmented as E, Btn as re } from "@journal/window-kit";
import { _ as A, u as ne, g as oe, s as le, a as se } from "./DocumentLibrary-BCoY0eg8.js";
import { d as ue } from "./documentRead-DHNxyEM4.js";
const ie = { doc: "docs", report: "reports" }, P = { doc: "document", report: "report" }, j = (e) => !!e.close_reason;
function de(e, s, { ask: o, open: u = null }) {
  return [
    ...u ? [{ label: "Open", group: "open", run: u }] : [],
    { label: "Open in the inspector", group: "open", run: () => H(`${ie[s]}:${e.id}`) },
    { label: "Copy the command", group: "copy", run: ({ say: n }) => z(`journal ${s} show ${e.id}`, "the command", n) },
    { label: "Edit the text", group: "own", run: () => o("edit") },
    ...j(e) ? [] : [{ label: "Mark as needing no action", group: "own", run: () => o("settle") }]
  ];
}
const ce = {
  key: 1,
  class: "failure",
  role: "alert",
  "data-document-edit-failure": ""
}, me = {
  __name: "DocumentEdit",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 } },
  emits: ["close"],
  setup(e, { emit: s }) {
    const o = e, u = s, n = R(), l = y(null), r = y(""), b = () => [{ key: "abstract", label: "Summary", required: !0, value: l.value.abstract }, { key: "body", label: "Text", kind: "area", required: !0, value: l.value.body }], w = (v) => `journal ${o.term} edit ${o.id} --abstract "${v.abstract.trim().slice(0, 40)}" --body …`;
    return N(async () => {
      const v = await n.read([o.term, "inspect", String(o.id)]);
      v.ok ? l.value = v.value : r.value = v.error;
    }), (v, S) => l.value ? (m(), h(t(O), {
      key: 0,
      title: `Edit the text of this ${t(P)[e.term]}`,
      submit: "Save the text",
      fields: b(),
      command: w,
      run: ($) => t(n).run([e.term, "edit", String(e.id), "--abstract", $.abstract.trim(), "--body", $.body.trim()]),
      onClose: S[0] || (S[0] = ($) => u("close"))
    }, null, 8, ["title", "fields", "run"])) : r.value ? (m(), g("p", ce, C(r.value), 1)) : D("", !0);
  }
}, ve = {
  class: "revisions",
  "data-document-revisions-tab": ""
}, pe = {
  key: 0,
  class: "failure",
  role: "alert"
}, ye = {
  __name: "DocumentRevisionList",
  props: { id: { type: Number, required: !0 } },
  setup(e) {
    const s = e, o = R(), u = y([]), n = y("");
    return N(async () => {
      const l = await o.read(["doc", "revisions", String(s.id)]);
      n.value = l.ok ? "" : l.error, u.value = l.ok ? l.value.rows.map((r) => ({ id: r.number, by: r.author_name, at: r.created_at, text: `Revision ${r.number}: ${r.change}` })) : [];
    }), (l, r) => (m(), g("div", ve, [
      n.value ? (m(), g("p", pe, C(n.value), 1)) : D("", !0),
      d(t(G), { entries: u.value }, null, 8, ["entries"])
    ]));
  }
}, be = /* @__PURE__ */ A(ye, [["__scopeId", "data-v-258f93a7"]]), ke = {
  __name: "DocumentReader",
  props: { term: { type: String, required: !0 }, row: { type: Object, required: !0 }, items: { type: Array, required: !0 }, read: { type: Function, required: !0 } },
  setup(e) {
    const s = e, o = y("text"), u = q(() => [{ key: "text", label: "Text" }, ...s.term === "doc" ? [{ key: "revisions", label: "Revisions" }] : [], { key: "links", label: "Links" }]), n = q(() => [{ name: "state", label: "State", value: j(s.row) ? `Closed: ${s.row.close_reason}` : "Open" }, { name: "updated", label: "Changed", value: s.row.updated_at, isTime: !0 }]);
    return (l, r) => (m(), h(t(J), {
      tab: o.value,
      "onUpdate:tab": r[0] || (r[0] = (b) => o.value = b),
      title: e.row.title,
      number: String(e.row.id),
      abstract: e.row.abstract,
      tabs: u.value,
      facts: n.value,
      "data-document-reader": ""
    }, {
      actions: c(() => [
        d(t(X), {
          items: e.items,
          head: e.row.title
        }, null, 8, ["items", "head"])
      ]),
      default: c(() => [
        d(t(V), { value: o.value }, {
          text: c(() => [
            (m(), h(t(Q), {
              key: `${e.term}:${e.row.id}`,
              term: e.term,
              id: e.row.id,
              read: e.read,
              "text-only": ""
            }, null, 8, ["term", "id", "read"]))
          ]),
          revisions: c(() => [
            (m(), h(be, {
              key: e.row.id,
              id: e.row.id
            }, null, 8, ["id"]))
          ]),
          links: c(() => [
            d(t(K), {
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
}, we = {
  __name: "DocumentSettle",
  props: { term: { type: String, required: !0 }, id: { type: Number, required: !0 } },
  emits: ["close"],
  setup(e, { emit: s }) {
    const o = e, u = s, n = R(), l = [{ key: "why", label: "Why it needs no action", required: !0, placeholder: "The change was made another way" }], r = (b) => `journal ${o.term} close ${o.id} --why "${b.why.trim() || "…"}"`;
    return (b, w) => (m(), h(t(O), {
      title: `Mark this ${t(P)[e.term]} as needing no action`,
      submit: "Mark it",
      fields: l,
      command: r,
      run: (v) => t(n).run([e.term, "close", String(e.id), "--why", v.why.trim()]),
      onClose: w[0] || (w[0] = (v) => u("close"))
    }, null, 8, ["title", "run"]));
  }
}, fe = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-documents-failure": ""
}, he = {
  key: 1,
  class: "more"
}, ge = 460, $e = {
  __name: "DocumentsPage",
  setup(e) {
    const s = [{ key: "doc", label: "Documents" }, { key: "report", label: "Reports" }], o = [{ key: "open", label: "Open" }, { key: "closed", label: "Closed" }], u = R(), n = y("doc"), l = y("open"), r = y(""), { rows: b, total: w, failure: v, loaded: S, more: $ } = ne(u, n, l), I = q(() => oe(le(se(b.value, r.value), "newest"), "newest").flatMap((i) => i.rows.map((a) => ({ id: a.id, title: `${a.id} ${a.title}`, desc: a.abstract, group: i.title, row: a })))), x = y(null), k = y(null), W = (i, a) => k.value = { kind: i, row: a, term: n.value }, L = (i, a = null) => de(i, n.value, { ask: (p) => W(p, i), open: a }), U = (i) => ({ head: i.row.title, items: L(i.row, () => x.value = i.id) }), _ = ue(u), M = (i, a) => {
      a(i), x.value = null;
    };
    return (i, a) => (m(), h(t(Y), {
      chosen: x.value,
      "onUpdate:chosen": a[5] || (a[5] = (p) => x.value = p),
      items: I.value,
      "list-width": ge,
      place: U,
      "empty-title": `No ${n.value === "doc" ? "documents" : "reports"} yet`,
      "pick-line": "Choose a text to read it",
      "data-documents": ""
    }, {
      top: c(() => {
        var p;
        return [
          d(t(te), {
            title: "Documents",
            count: t(w)
          }, null, 8, ["count"]),
          d(t(ae), {
            modelValue: r.value,
            "onUpdate:modelValue": a[2] || (a[2] = (f) => r.value = f),
            class: "bar",
            placeholder: "Search titles and summaries"
          }, {
            default: c(() => [
              d(t(E), {
                options: s,
                value: n.value,
                "data-documents-term": "",
                onPick: a[0] || (a[0] = (f) => M(f, (T) => n.value = T))
              }, null, 8, ["value"]),
              d(t(E), {
                options: o,
                value: l.value,
                "data-documents-state": "",
                onPick: a[1] || (a[1] = (f) => M(f, (T) => l.value = T))
              }, null, 8, ["value"])
            ]),
            _: 1
          }, 8, ["modelValue"]),
          t(v) ? (m(), g("p", fe, C(t(v)), 1)) : D("", !0),
          t(b).length < t(w) && !r.value ? (m(), g("p", he, [
            d(t(re), {
              small: "",
              bordered: "",
              "data-documents-more": "",
              onClick: t($)
            }, {
              default: c(() => [...a[6] || (a[6] = [
                B("Show more", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ])) : D("", !0),
          d(t(V), {
            value: (p = k.value) == null ? void 0 : p.kind
          }, {
            edit: c(() => [
              d(me, {
                term: k.value.term,
                id: k.value.row.id,
                onClose: a[3] || (a[3] = (f) => k.value = null)
              }, null, 8, ["term", "id"])
            ]),
            settle: c(() => [
              d(we, {
                term: k.value.term,
                id: k.value.row.id,
                onClose: a[4] || (a[4] = (f) => k.value = null)
              }, null, 8, ["term", "id"])
            ]),
            _: 1
          }, 8, ["value"])
        ];
      }),
      empty: c(() => [
        t(S) ? (m(), g(F, { key: 1 }, [
          B(C(r.value ? "Nothing matches the search." : "Documents and reports the agents write appear here."), 1)
        ], 64)) : (m(), h(t(ee), {
          key: 0,
          shape: "rows"
        }))
      ]),
      meta: c(({ item: p }) => [
        d(t(Z), {
          class: "age",
          at: p.row.updated_at
        }, null, 8, ["at"])
      ]),
      reader: c(({ item: p }) => [
        d(ke, {
          term: n.value,
          row: p.row,
          items: L(p.row),
          read: t(_)
        }, null, 8, ["term", "row", "items", "read"])
      ]),
      _: 1
    }, 8, ["chosen", "items", "empty-title"]));
  }
}, Re = /* @__PURE__ */ A($e, [["__scopeId", "data-v-efc3b3c5"]]);
export {
  Re as default
};
