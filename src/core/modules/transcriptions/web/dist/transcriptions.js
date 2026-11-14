if (!document.getElementById("window-styles-d1cb5454e379")) { const style = document.createElement("style"); style.id = "window-styles-d1cb5454e379"; style.textContent = "textarea[data-v-e2362fec]{box-sizing:border-box;width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface, none);color:inherit;font:inherit}.note[data-v-05213ab6]{margin:0;padding:4px var(--inset);color:var(--text-3);font-size:12px}.failed[data-v-05213ab6]{color:var(--danger)}\n"; document.head.appendChild(style); }
import { ref as y, openBlock as r, createBlock as k, unref as a, withCtx as d, withDirectives as H, createElementBlock as w, vModelText as M, createVNode as D, createTextVNode as L, computed as R, Fragment as C, renderList as P, toDisplayString as S, createCommentVNode as _ } from "vue";
import { useWindow as V, Reader as W, ResourceLinks as j, Btn as N, peekRef as q, defaultFilter as z, applyFilter as A, ListReaderLayout as E, Skeleton as K, PageHeader as Y, FilterBar as G, copying as F } from "@journal/window-kit";
const O = (c, v) => {
  const s = c.__vccOpts || c;
  for (const [f, b] of v)
    s[f] = b;
  return s;
}, J = {
  __name: "TranscriptionReader",
  props: { row: { type: Object, required: !0 } },
  emits: ["save"],
  setup(c, { emit: v }) {
    const s = c, f = v, b = V(), u = y(s.row.text), g = y("text"), T = [{ key: "text", label: "Text" }, { key: "linked", label: "Linked items" }], m = [
      { name: "source", label: "Source", value: s.row.source || "Pasted" },
      { name: "created", label: "Made", value: new Date(s.row.created_at).toLocaleString() }
    ];
    function x(i) {
      const o = {};
      for (const l of ["page", "page-size", "kind"]) {
        const p = i.indexOf(`--${l}`);
        p >= 0 && (o[l] = i[p + 1]);
      }
      return b.readKey(`links.${s.row.id}`, o);
    }
    const h = (i) => q(`${i.table}:${i.id}`);
    return (i, o) => (r(), k(a(W), {
      tab: g.value,
      "onUpdate:tab": o[2] || (o[2] = (l) => g.value = l),
      title: c.row.title,
      number: `Transcription ${c.row.id}`,
      tabs: T,
      facts: m,
      "data-transcription-opened": ""
    }, {
      primary: d(() => [
        D(a(N), {
          small: "",
          variant: "primary",
          "data-transcription-save": "",
          disabled: u.value === c.row.text,
          onClick: o[0] || (o[0] = (l) => f("save", u.value))
        }, {
          default: d(() => [...o[3] || (o[3] = [
            L("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: d(({ tab: l }) => [
        l === "text" ? H((r(), w("textarea", {
          key: 0,
          "onUpdate:modelValue": o[1] || (o[1] = (p) => u.value = p),
          rows: "14",
          "aria-label": "Transcript"
        }, null, 512)), [
          [M, u.value]
        ]) : (r(), k(a(j), {
          key: 1,
          model: "transcription",
          id: c.row.id,
          read: x,
          "link-attribute": "data-transcription-link",
          empty: "Nothing yet",
          onOpen: h
        }, null, 8, ["id"]))
      ]),
      _: 1
    }, 8, ["tab", "title", "number"]));
  }
}, Q = /* @__PURE__ */ O(J, [["__scopeId", "data-v-e2362fec"]]), X = {
  key: 0,
  class: "note",
  "data-transcription-notice": ""
}, Z = {
  key: 1,
  class: "note failed",
  role: "alert"
}, ee = {
  key: 2,
  class: "note failed",
  role: "alert"
}, te = 400, ae = {
  __name: "TranscriptionRows",
  setup(c) {
    const v = V(), { rows: s, failure: f, loaded: b, act: u, actionFailure: g } = v.props.transcriptions, T = v.props.sources, m = y(null), x = y(""), h = y(z([])), i = y(""), o = (e) => {
      const t = new Date(e).toDateString();
      return t === (/* @__PURE__ */ new Date()).toDateString() ? "Today" : t === new Date(Date.now() - 864e5).toDateString() ? "Yesterday" : new Date(e).toLocaleDateString();
    }, l = R(() => s.value.map((e) => ({ id: e.id, title: e.title, desc: e.text.trim().slice(0, 140), group: o(e.created_at), row: e }))), p = R(() => A(l.value, [], h.value, i.value, ["title", "desc"])), B = (e, t) => u(["transcription", "edit", String(e.id), "--text", t]);
    async function U(e) {
      (await u(["transcription", "fetch", e.name])).ok && (x.value = `The agent was asked to fetch transcriptions from ${e.title}.`);
    }
    const I = (e) => ({
      head: e.title,
      items: [
        { label: "Open", group: "open", disabled: e.id === m.value, reason: "Already open", run: () => m.value = e.id },
        { label: "Copy number", group: "copy", run: ({ say: t }) => F(String(e.id), String(e.id), t) },
        { label: "Copy text", group: "copy", run: ({ say: t }) => F(e.row.text, "text", t) }
      ]
    });
    return (e, t) => (r(), k(a(E), {
      chosen: m.value,
      "onUpdate:chosen": t[2] || (t[2] = (n) => m.value = n),
      items: p.value,
      "list-width": te,
      place: I,
      "empty-title": "No transcriptions yet",
      "pick-line": "No transcription chosen",
      "data-transcriptions": ""
    }, {
      top: d(() => [
        D(a(Y), {
          title: "Transcriptions",
          count: a(s).length
        }, {
          actions: d(() => [
            (r(!0), w(C, null, P(a(T).rows.value, (n) => (r(), k(a(N), {
              key: n.name,
              small: "",
              "data-transcription-fetch": n.name,
              onClick: ($) => U(n)
            }, {
              default: d(() => [
                L("Fetch transcriptions from " + S(n.title), 1)
              ]),
              _: 2
            }, 1032, ["data-transcription-fetch", "onClick"]))), 128))
          ]),
          _: 1
        }, 8, ["count"]),
        D(a(G), {
          modelValue: h.value,
          "onUpdate:modelValue": t[0] || (t[0] = (n) => h.value = n),
          words: i.value,
          "onUpdate:words": t[1] || (t[1] = (n) => i.value = n),
          fields: [],
          rows: l.value,
          shown: p.value.length,
          placeholder: "Search transcriptions"
        }, null, 8, ["modelValue", "words", "rows", "shown"]),
        x.value ? (r(), w("p", X, S(x.value), 1)) : _("", !0),
        a(g) ? (r(), w("p", Z, S(a(g)), 1)) : _("", !0),
        a(f) ? (r(), w("p", ee, S(a(f)), 1)) : _("", !0)
      ]),
      empty: d(() => [
        a(b) ? (r(), w(C, { key: 1 }, [
          L("Transcripts of recordings appear here.")
        ], 64)) : (r(), k(a(K), {
          key: 0,
          shape: "rows"
        }))
      ]),
      reader: d(({ item: n }) => [
        (r(), k(Q, {
          key: n.id,
          row: n.row,
          onSave: ($) => B(n, $)
        }, null, 8, ["row", "onSave"]))
      ]),
      _: 1
    }, 8, ["chosen", "items"]));
  }
}, re = /* @__PURE__ */ O(ae, [["__scopeId", "data-v-05213ab6"]]);
export {
  re as default
};
