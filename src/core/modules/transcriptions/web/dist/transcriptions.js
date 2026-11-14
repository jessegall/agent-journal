if (!document.getElementById("window-styles-8baf681e1231")) { const style = document.createElement("style"); style.id = "window-styles-8baf681e1231"; style.textContent = "textarea[data-v-e2362fec]{box-sizing:border-box;width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface, none);color:inherit;font:inherit}.form[data-v-4a53e8f0]{display:flex;flex-direction:column;gap:8px;padding:0 var(--inset)}.note[data-v-4a53e8f0]{margin:0;padding:4px var(--inset);color:var(--text-3);font-size:12px}.failed[data-v-4a53e8f0]{color:var(--danger)}input[data-v-4a53e8f0],textarea[data-v-4a53e8f0]{box-sizing:border-box;width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface, none);color:inherit;font:inherit}\n"; document.head.appendChild(style); }
import { ref as v, openBlock as o, createBlock as x, unref as n, withCtx as s, withDirectives as N, createElementBlock as m, vModelText as R, createVNode as T, createTextVNode as D, computed as C, Fragment as _, renderList as z, toDisplayString as h, createCommentVNode as L, withModifiers as A, createElementVNode as B } from "vue";
import { useWindow as M, Reader as K, ResourceLinks as Y, Btn as V, peekRef as G, defaultFilter as J, applyFilter as Q, ListReaderLayout as X, Skeleton as Z, PageHeader as tt, FilterBar as et, copying as I } from "@journal/window-kit";
const P = (c, f) => {
  const d = c.__vccOpts || c;
  for (const [w, g] of f)
    d[w] = g;
  return d;
}, at = {
  __name: "TranscriptionReader",
  props: { row: { type: Object, required: !0 } },
  emits: ["save"],
  setup(c, { emit: f }) {
    const d = c, w = f, g = M(), p = v(d.row.text), S = v("text"), $ = [{ key: "text", label: "Text" }, { key: "linked", label: "Linked items" }], y = [
      { name: "source", label: "Source", value: d.row.source || "Pasted" },
      { name: "created", label: "Made", value: new Date(d.row.created_at).toLocaleString() }
    ];
    function k(u) {
      const r = {};
      for (const l of ["page", "page-size", "kind"]) {
        const b = u.indexOf(`--${l}`);
        b >= 0 && (r[l] = u[b + 1]);
      }
      return g.readKey(`links.${d.row.id}`, r);
    }
    const i = (u) => G(`${u.table}:${u.id}`);
    return (u, r) => (o(), x(n(K), {
      tab: S.value,
      "onUpdate:tab": r[2] || (r[2] = (l) => S.value = l),
      title: c.row.title,
      number: `Transcription ${c.row.id}`,
      tabs: $,
      facts: y,
      "data-transcription-opened": ""
    }, {
      primary: s(() => [
        T(n(V), {
          small: "",
          variant: "primary",
          "data-transcription-save": "",
          disabled: p.value === c.row.text,
          onClick: r[0] || (r[0] = (l) => w("save", p.value))
        }, {
          default: s(() => [...r[3] || (r[3] = [
            D("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: s(({ tab: l }) => [
        l === "text" ? N((o(), m("textarea", {
          key: 0,
          "onUpdate:modelValue": r[1] || (r[1] = (b) => p.value = b),
          rows: "14",
          "aria-label": "Transcript"
        }, null, 512)), [
          [R, p.value]
        ]) : (o(), x(n(Y), {
          key: 1,
          model: "transcription",
          id: c.row.id,
          read: k,
          "link-attribute": "data-transcription-link",
          empty: "Nothing yet",
          onOpen: i
        }, null, 8, ["id"]))
      ]),
      _: 1
    }, 8, ["tab", "title", "number"]));
  }
}, nt = /* @__PURE__ */ P(at, [["__scopeId", "data-v-e2362fec"]]), rt = {
  key: 0,
  class: "note",
  "data-transcription-notice": ""
}, ot = {
  key: 1,
  class: "note failed",
  role: "alert"
}, it = {
  key: 2,
  class: "note failed",
  role: "alert"
}, lt = 400, st = {
  __name: "TranscriptionRows",
  setup(c) {
    const f = M(), { rows: d, failure: w, loaded: g, act: p, actionFailure: S } = f.props.transcriptions, $ = f.props.sources, y = v(null), k = v(!1), i = v({ title: "", text: "" }), u = v(""), r = v(J([])), l = v(""), b = C(() => i.value.title.trim() && i.value.text.trim()), E = (e) => {
      const t = new Date(e).toDateString();
      return t === (/* @__PURE__ */ new Date()).toDateString() ? "Today" : t === new Date(Date.now() - 864e5).toDateString() ? "Yesterday" : new Date(e).toLocaleDateString();
    }, F = C(() => d.value.map((e) => ({ id: e.id, title: e.title, desc: e.text.trim().slice(0, 140), group: E(e.created_at), row: e }))), U = C(() => Q(F.value, [], r.value, l.value, ["title", "desc"]));
    async function H() {
      (await p(["transcription", "make", i.value.title.trim(), "--text", i.value.text])).ok && (i.value = { title: "", text: "" }, k.value = !1);
    }
    const W = (e, t) => p(["transcription", "edit", String(e.id), "--text", t]);
    async function j(e) {
      (await p(["transcription", "fetch", e.name])).ok && (u.value = `The agent was asked to fetch transcriptions from ${e.title}.`);
    }
    const q = (e) => ({
      head: e.title,
      items: [
        { label: "Open", group: "open", disabled: e.id === y.value, reason: "Already open", run: () => y.value = e.id },
        { label: "Copy number", group: "copy", run: ({ say: t }) => I(String(e.id), String(e.id), t) },
        { label: "Copy text", group: "copy", run: ({ say: t }) => I(e.row.text, "text", t) }
      ]
    });
    return (e, t) => (o(), x(n(X), {
      chosen: y.value,
      "onUpdate:chosen": t[5] || (t[5] = (a) => y.value = a),
      items: U.value,
      "list-width": lt,
      place: q,
      "empty-title": "No transcriptions yet",
      "pick-line": "No transcription chosen",
      "data-transcriptions": ""
    }, {
      top: s(() => [
        T(n(tt), {
          title: "Transcriptions",
          count: n(d).length
        }, {
          primary: s(() => [
            T(n(V), {
              small: "",
              variant: "primary",
              "data-transcription-new": "",
              onClick: t[0] || (t[0] = (a) => k.value = !k.value)
            }, {
              default: s(() => [...t[6] || (t[6] = [
                D("New transcription", -1)
              ])]),
              _: 1
            })
          ]),
          actions: s(() => [
            (o(!0), m(_, null, z(n($).rows.value, (a) => (o(), x(n(V), {
              key: a.name,
              small: "",
              "data-transcription-fetch": a.name,
              onClick: (O) => j(a)
            }, {
              default: s(() => [
                D("Fetch transcriptions from " + h(a.title), 1)
              ]),
              _: 2
            }, 1032, ["data-transcription-fetch", "onClick"]))), 128))
          ]),
          _: 1
        }, 8, ["count"]),
        T(n(et), {
          modelValue: r.value,
          "onUpdate:modelValue": t[1] || (t[1] = (a) => r.value = a),
          words: l.value,
          "onUpdate:words": t[2] || (t[2] = (a) => l.value = a),
          fields: [],
          rows: F.value,
          shown: U.value.length,
          placeholder: "Search transcriptions"
        }, null, 8, ["modelValue", "words", "rows", "shown"]),
        u.value ? (o(), m("p", rt, h(u.value), 1)) : L("", !0),
        n(S) ? (o(), m("p", ot, h(n(S)), 1)) : L("", !0),
        n(w) ? (o(), m("p", it, h(n(w)), 1)) : L("", !0),
        k.value ? (o(), m("form", {
          key: 3,
          class: "form",
          "data-transcription-form": "",
          onSubmit: A(H, ["prevent"])
        }, [
          N(B("input", {
            "onUpdate:modelValue": t[3] || (t[3] = (a) => i.value.title = a),
            placeholder: "Title",
            "aria-label": "Title"
          }, null, 512), [
            [R, i.value.title]
          ]),
          N(B("textarea", {
            "onUpdate:modelValue": t[4] || (t[4] = (a) => i.value.text = a),
            rows: "10",
            placeholder: "Paste the transcript",
            "aria-label": "Transcript"
          }, null, 512), [
            [R, i.value.text]
          ]),
          T(n(V), {
            small: "",
            variant: "primary",
            type: "submit",
            disabled: !b.value
          }, {
            default: s(() => [...t[7] || (t[7] = [
              D("Save", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ], 32)) : L("", !0)
      ]),
      empty: s(() => [
        n(g) ? (o(), m(_, { key: 1 }, [
          D("Transcripts of recordings appear here.")
        ], 64)) : (o(), x(n(Z), {
          key: 0,
          shape: "rows"
        }))
      ]),
      reader: s(({ item: a }) => [
        (o(), x(nt, {
          key: a.id,
          row: a.row,
          onSave: (O) => W(a, O)
        }, null, 8, ["row", "onSave"]))
      ]),
      _: 1
    }, 8, ["chosen", "items"]));
  }
}, ct = /* @__PURE__ */ P(st, [["__scopeId", "data-v-4a53e8f0"]]);
export {
  ct as default
};
