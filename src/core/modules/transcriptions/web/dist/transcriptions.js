/* @code-commandments-generated */
if (!document.getElementById("window-styles-ad2b214ca472")) { const style = document.createElement("style"); style.id = "window-styles-ad2b214ca472"; style.textContent = ".transcriptions[data-v-d46d2b7e],.form[data-v-d46d2b7e],.opened[data-v-d46d2b7e]{display:flex;flex-direction:column;gap:8px}.bar[data-v-d46d2b7e]{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.note[data-v-d46d2b7e]{margin:0;color:var(--text-3);font-size:12px;font-weight:400}.failure[data-v-d46d2b7e]{margin:0;color:var(--bad, var(--text-2));font-size:12px}.row[data-v-d46d2b7e]{display:flex;flex-direction:column;gap:2px;width:100%;padding:8px;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.title[data-v-d46d2b7e]{margin:0;font-size:inherit;font-weight:600}input[data-v-d46d2b7e],textarea[data-v-d46d2b7e]{box-sizing:border-box;width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface, none);color:inherit;font:inherit}\n"; document.head.appendChild(style); }
import { ref as f, computed as z, openBlock as r, createBlock as R, unref as n, withCtx as u, createElementVNode as s, createVNode as l, createTextVNode as p, createElementBlock as m, Fragment as A, renderList as I, toDisplayString as d, createCommentVNode as w, withModifiers as K, withDirectives as L, vModelText as N } from "vue";
import { useWindow as P, useListTools as j, WindowRoom as q, Btn as k, ListTools as G, RowList as H, TimeAgo as J, ResourceLinks as Q, peekRef as X } from "@journal/window-kit";
const Y = (b, v) => {
  const x = b.__vccOpts || b;
  for (const [g, T] of v)
    x[g] = T;
  return x;
}, Z = {
  class: "transcriptions",
  "data-transcriptions": ""
}, tt = { class: "bar" }, et = {
  key: 0,
  class: "note",
  "data-transcription-notice": ""
}, at = {
  key: 0,
  class: "failure"
}, nt = ["data-transcription", "onClick"], st = { class: "title" }, it = { class: "note" }, ot = { class: "note" }, lt = {
  key: 2,
  class: "opened",
  "data-transcription-opened": ""
}, rt = { class: "title" }, ut = { class: "bar" }, dt = {
  __name: "TranscriptionRows",
  setup(b) {
    const v = P(), { rows: x, failure: g, loaded: T, act: h, actionFailure: V } = v.props.transcriptions, S = v.props.sources, $ = j(x, { title: (a) => `${a.title} ${a.text}` }), _ = f(!1), o = f({ title: "", text: "" }), i = f(null), c = f(""), C = f(""), B = z(() => o.value.title.trim() && o.value.text.trim()), F = (a) => a.text.trim().slice(0, 140);
    async function M() {
      (await h(["transcription", "make", o.value.title.trim(), "--text", o.value.text])).ok && (o.value = { title: "", text: "" }, _.value = !1);
    }
    function O(a) {
      i.value = a, c.value = a.text;
    }
    const U = (a) => X(`${a.table}:${a.id}`);
    function D(a) {
      const t = {};
      for (const e of ["page", "page-size", "kind"]) {
        const y = a.indexOf(`--${e}`);
        y >= 0 && (t[e] = a[y + 1]);
      }
      return v.readKey(`links.${i.value.id}`, t);
    }
    async function E() {
      (await h(["transcription", "edit", String(i.value.id), "--text", c.value])).ok && (i.value = { ...i.value, text: c.value });
    }
    async function W(a) {
      (await h(["transcription", "fetch", a.name])).ok && (C.value = `The agent was asked to fetch transcriptions from ${a.title}.`);
    }
    return (a, t) => (r(), R(n(q), null, {
      default: u(() => [
        s("div", Z, [
          s("div", tt, [
            l(n(k), {
              small: "",
              "data-transcription-new": "",
              onClick: t[0] || (t[0] = (e) => _.value = !_.value)
            }, {
              default: u(() => [...t[5] || (t[5] = [
                p("New transcription", -1)
              ])]),
              _: 1
            }),
            (r(!0), m(A, null, I(n(S).rows.value, (e) => (r(), R(n(k), {
              key: e.name,
              small: "",
              "data-transcription-fetch": e.name,
              onClick: (y) => W(e)
            }, {
              default: u(() => [
                p("Fetch transcriptions from " + d(e.title), 1)
              ]),
              _: 2
            }, 1032, ["data-transcription-fetch", "onClick"]))), 128)),
            C.value ? (r(), m("span", et, d(C.value), 1)) : w("", !0)
          ]),
          n(V) ? (r(), m("p", at, d(n(V)), 1)) : w("", !0),
          _.value ? (r(), m("form", {
            key: 1,
            class: "form",
            "data-transcription-form": "",
            onSubmit: K(M, ["prevent"])
          }, [
            L(s("input", {
              "onUpdate:modelValue": t[1] || (t[1] = (e) => o.value.title = e),
              placeholder: "Title",
              "aria-label": "Title"
            }, null, 512), [
              [N, o.value.title]
            ]),
            L(s("textarea", {
              "onUpdate:modelValue": t[2] || (t[2] = (e) => o.value.text = e),
              rows: "10",
              placeholder: "Paste the transcript",
              "aria-label": "Transcript"
            }, null, 512), [
              [N, o.value.text]
            ]),
            l(n(k), {
              small: "",
              variant: "primary",
              type: "submit",
              disabled: !B.value
            }, {
              default: u(() => [...t[6] || (t[6] = [
                p("Save", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ], 32)) : w("", !0),
          l(n(G), { tools: n($) }, null, 8, ["tools"]),
          l(n(H), {
            rows: n($).shown.value,
            failure: n(g),
            loaded: n(T),
            empty: "No transcriptions yet",
            hint: "Transcripts of recordings appear here.",
            searching: n($).filtering.value
          }, {
            default: u(({ row: e }) => [
              s("button", {
                type: "button",
                class: "row",
                "data-transcription": e.id,
                onClick: (y) => O(e)
              }, [
                s("span", st, d(e.title), 1),
                s("span", it, [
                  p(d(e.source || "pasted") + " · ", 1),
                  l(n(J), {
                    at: e.created_at
                  }, null, 8, ["at"])
                ]),
                s("span", ot, d(F(e)), 1)
              ], 8, nt)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded", "searching"]),
          i.value ? (r(), m("section", lt, [
            s("h3", rt, d(i.value.title), 1),
            L(s("textarea", {
              "onUpdate:modelValue": t[3] || (t[3] = (e) => c.value = e),
              rows: "14",
              "aria-label": "Transcript"
            }, null, 512), [
              [N, c.value]
            ]),
            s("div", ut, [
              l(n(k), {
                small: "",
                variant: "primary",
                "data-transcription-save": "",
                disabled: c.value === i.value.text,
                onClick: E
              }, {
                default: u(() => [...t[7] || (t[7] = [
                  p("Save", -1)
                ])]),
                _: 1
              }, 8, ["disabled"]),
              l(n(k), {
                small: "",
                onClick: t[4] || (t[4] = (e) => i.value = null)
              }, {
                default: u(() => [...t[8] || (t[8] = [
                  p("Close", -1)
                ])]),
                _: 1
              })
            ]),
            t[9] || (t[9] = s("h3", { class: "note" }, "Linked items", -1)),
            l(n(Q), {
              model: "transcription",
              id: i.value.id,
              read: D,
              "link-attribute": "data-transcription-link",
              empty: "Nothing yet",
              onOpen: U
            }, null, 8, ["id"])
          ])) : w("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, vt = /* @__PURE__ */ Y(dt, [["__scopeId", "data-v-d46d2b7e"]]);
export {
  vt as default
};
