/* @code-commandments-generated */
if (!document.getElementById("window-styles-8ddb226729f8")) { const style = document.createElement("style"); style.id = "window-styles-8ddb226729f8"; style.textContent = ".transcriptions[data-v-54494b8b],.form[data-v-54494b8b],.opened[data-v-54494b8b]{display:flex;flex-direction:column;gap:8px}.bar[data-v-54494b8b]{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.note[data-v-54494b8b]{margin:0;color:var(--text-3);font-size:12px;font-weight:400}.failure[data-v-54494b8b]{margin:0;color:var(--bad, var(--text-2));font-size:12px}.row[data-v-54494b8b]{display:flex;flex-direction:column;gap:2px;width:100%;padding:8px;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.title[data-v-54494b8b]{margin:0;font-size:inherit;font-weight:600}input[data-v-54494b8b],textarea[data-v-54494b8b]{box-sizing:border-box;width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface, none);color:inherit;font:inherit}\n"; document.head.appendChild(style); }
import { ref as v, computed as A, openBlock as r, createBlock as R, unref as a, withCtx as u, createElementVNode as s, createVNode as l, createTextVNode as p, createElementBlock as m, Fragment as I, renderList as P, toDisplayString as d, createCommentVNode as x, withModifiers as j, withDirectives as $, vModelText as L } from "vue";
import { useWindow as q, useRows as V, useListTools as z, WindowRoom as G, Btn as f, ListTools as H, RowList as J, TimeAgo as K, ResourceLinks as Q, peekRef as X } from "@journal/window-kit";
const Y = (y, b) => {
  const k = y.__vccOpts || y;
  for (const [w, T] of b)
    k[w] = T;
  return k;
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
  setup(y) {
    const b = q(), { rows: k, failure: w, loaded: T, act: h, actionFailure: N } = V("transcription list", ["transcription.*"]), S = V("transcription sources", []), g = z(k, { title: (n) => `${n.title} ${n.text}` }), _ = v(!1), i = v({ title: "", text: "" }), o = v(null), c = v(""), C = v(""), B = A(() => i.value.title.trim() && i.value.text.trim()), F = (n) => n.text.trim().slice(0, 140);
    async function M() {
      (await h(["transcription", "make", i.value.title.trim(), "--text", i.value.text])).ok && (i.value = { title: "", text: "" }, _.value = !1);
    }
    function U(n) {
      o.value = n, c.value = n.text;
    }
    const D = (n) => X(`${n.table}:${n.id}`);
    async function E() {
      (await h(["transcription", "edit", String(o.value.id), "--text", c.value])).ok && (o.value = { ...o.value, text: c.value });
    }
    async function O(n) {
      (await h(["transcription", "fetch", n.name])).ok && (C.value = `The agent was asked to fetch transcriptions from ${n.title}.`);
    }
    return (n, t) => (r(), R(a(G), null, {
      default: u(() => [
        s("div", Z, [
          s("div", tt, [
            l(a(f), {
              small: "",
              "data-transcription-new": "",
              onClick: t[0] || (t[0] = (e) => _.value = !_.value)
            }, {
              default: u(() => [...t[5] || (t[5] = [
                p("New transcription", -1)
              ])]),
              _: 1
            }),
            (r(!0), m(I, null, P(a(S).rows.value, (e) => (r(), R(a(f), {
              key: e.name,
              small: "",
              "data-transcription-fetch": e.name,
              onClick: (W) => O(e)
            }, {
              default: u(() => [
                p("Fetch transcriptions from " + d(e.title), 1)
              ]),
              _: 2
            }, 1032, ["data-transcription-fetch", "onClick"]))), 128)),
            C.value ? (r(), m("span", et, d(C.value), 1)) : x("", !0)
          ]),
          a(N) ? (r(), m("p", at, d(a(N)), 1)) : x("", !0),
          _.value ? (r(), m("form", {
            key: 1,
            class: "form",
            "data-transcription-form": "",
            onSubmit: j(M, ["prevent"])
          }, [
            $(s("input", {
              "onUpdate:modelValue": t[1] || (t[1] = (e) => i.value.title = e),
              placeholder: "Title",
              "aria-label": "Title"
            }, null, 512), [
              [L, i.value.title]
            ]),
            $(s("textarea", {
              "onUpdate:modelValue": t[2] || (t[2] = (e) => i.value.text = e),
              rows: "10",
              placeholder: "Paste the transcript",
              "aria-label": "Transcript"
            }, null, 512), [
              [L, i.value.text]
            ]),
            l(a(f), {
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
          ], 32)) : x("", !0),
          l(a(H), { tools: a(g) }, null, 8, ["tools"]),
          l(a(J), {
            rows: a(g).shown.value,
            failure: a(w),
            loaded: a(T),
            empty: "No transcriptions yet",
            hint: "Transcripts of recordings appear here.",
            searching: a(g).filtering.value
          }, {
            default: u(({ row: e }) => [
              s("button", {
                type: "button",
                class: "row",
                "data-transcription": e.id,
                onClick: (W) => U(e)
              }, [
                s("span", st, d(e.title), 1),
                s("span", it, [
                  p(d(e.source || "pasted") + " · ", 1),
                  l(a(K), {
                    at: e.created_at
                  }, null, 8, ["at"])
                ]),
                s("span", ot, d(F(e)), 1)
              ], 8, nt)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded", "searching"]),
          o.value ? (r(), m("section", lt, [
            s("h3", rt, d(o.value.title), 1),
            $(s("textarea", {
              "onUpdate:modelValue": t[3] || (t[3] = (e) => c.value = e),
              rows: "14",
              "aria-label": "Transcript"
            }, null, 512), [
              [L, c.value]
            ]),
            s("div", ut, [
              l(a(f), {
                small: "",
                variant: "primary",
                "data-transcription-save": "",
                disabled: c.value === o.value.text,
                onClick: E
              }, {
                default: u(() => [...t[7] || (t[7] = [
                  p("Save", -1)
                ])]),
                _: 1
              }, 8, ["disabled"]),
              l(a(f), {
                small: "",
                onClick: t[4] || (t[4] = (e) => o.value = null)
              }, {
                default: u(() => [...t[8] || (t[8] = [
                  p("Close", -1)
                ])]),
                _: 1
              })
            ]),
            t[9] || (t[9] = s("h3", { class: "note" }, "Linked items", -1)),
            l(a(Q), {
              model: "transcription",
              id: o.value.id,
              read: a(b).read,
              "link-attribute": "data-transcription-link",
              empty: "Nothing yet",
              onOpen: D
            }, null, 8, ["id", "read"])
          ])) : x("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, vt = /* @__PURE__ */ Y(dt, [["__scopeId", "data-v-54494b8b"]]);
export {
  vt as default
};
