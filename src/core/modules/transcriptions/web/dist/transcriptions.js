/* @code-commandments-generated */
if (!document.getElementById("window-styles-30e027007901")) { const style = document.createElement("style"); style.id = "window-styles-30e027007901"; style.textContent = ".transcriptions[data-v-0c7915ac],.form[data-v-0c7915ac],.opened[data-v-0c7915ac]{display:flex;flex-direction:column;gap:8px}.bar[data-v-0c7915ac]{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.note[data-v-0c7915ac]{margin:0;color:var(--text-3);font-size:12px;font-weight:400}.failure[data-v-0c7915ac]{margin:0;color:var(--bad, var(--text-2));font-size:12px}.row[data-v-0c7915ac]{display:flex;flex-direction:column;gap:2px;width:100%;padding:8px;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.title[data-v-0c7915ac]{margin:0;font-size:inherit;font-weight:600}input[data-v-0c7915ac],textarea[data-v-0c7915ac]{box-sizing:border-box;width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface, none);color:inherit;font:inherit}\n"; document.head.appendChild(style); }
import { ref as d, computed as P, openBlock as o, createElementBlock as r, createElementVNode as n, createVNode as p, unref as a, withCtx as v, createTextVNode as f, Fragment as B, renderList as F, createBlock as W, toDisplayString as i, createCommentVNode as m, withModifiers as j, withDirectives as N, vModelText as V } from "vue";
import { useWindow as q, useRows as L, useListTools as z, Btn as _, ListTools as G, RowList as H, ago as J, peekRef as K } from "@journal/window-kit";
const Q = (y, w) => {
  const k = y.__vccOpts || y;
  for (const [h, g] of w)
    k[h] = g;
  return k;
}, X = {
  class: "transcriptions",
  "data-transcriptions": ""
}, Y = { class: "bar" }, Z = {
  key: 0,
  class: "note",
  "data-transcription-notice": ""
}, tt = {
  key: 0,
  class: "failure"
}, et = ["data-transcription", "onClick"], at = { class: "title" }, st = { class: "note" }, nt = { class: "note" }, ot = {
  key: 2,
  class: "opened",
  "data-transcription-opened": ""
}, it = { class: "title" }, lt = { class: "bar" }, rt = {
  key: 0,
  class: "note"
}, ut = ["onClick"], ct = {
  __name: "TranscriptionRows",
  setup(y) {
    const w = q(), { rows: k, failure: h, loaded: g, act: b, actionFailure: R } = L("transcription list", ["transcription.*"]), M = L("transcription sources", []), C = z(k, { title: (s) => `${s.title} ${s.text}` }), x = d(!1), l = d({ title: "", text: "" }), u = d(null), c = d(""), T = d([]), $ = d(""), U = P(() => l.value.title.trim() && l.value.text.trim()), D = (s) => s.text.trim().slice(0, 140);
    async function E() {
      (await b(["transcription", "make", l.value.title.trim(), "--text", l.value.text])).ok && (l.value = { title: "", text: "" }, x.value = !1);
    }
    async function A(s) {
      u.value = s, c.value = s.text;
      const e = await w.read(["link", "list", "--source", `transcription:${s.id}`]);
      T.value = e.ok ? e.value.rows ?? [] : [];
    }
    async function I() {
      (await b(["transcription", "edit", String(u.value.id), "--text", c.value])).ok && (u.value = { ...u.value, text: c.value });
    }
    async function O(s) {
      (await b(["transcription", "fetch", s.name])).ok && ($.value = `The agent was asked to fetch transcriptions from ${s.title}.`);
    }
    return (s, e) => (o(), r("div", X, [
      n("div", Y, [
        p(a(_), {
          small: "",
          "data-transcription-new": "",
          onClick: e[0] || (e[0] = (t) => x.value = !x.value)
        }, {
          default: v(() => [...e[5] || (e[5] = [
            f("New transcription", -1)
          ])]),
          _: 1
        }),
        (o(!0), r(B, null, F(a(M).rows.value, (t) => (o(), W(a(_), {
          key: t.name,
          small: "",
          "data-transcription-fetch": t.name,
          onClick: (S) => O(t)
        }, {
          default: v(() => [
            f("Fetch transcriptions from " + i(t.title), 1)
          ]),
          _: 2
        }, 1032, ["data-transcription-fetch", "onClick"]))), 128)),
        $.value ? (o(), r("span", Z, i($.value), 1)) : m("", !0)
      ]),
      a(R) ? (o(), r("p", tt, i(a(R)), 1)) : m("", !0),
      x.value ? (o(), r("form", {
        key: 1,
        class: "form",
        "data-transcription-form": "",
        onSubmit: j(E, ["prevent"])
      }, [
        N(n("input", {
          "onUpdate:modelValue": e[1] || (e[1] = (t) => l.value.title = t),
          placeholder: "Title",
          "aria-label": "Title"
        }, null, 512), [
          [V, l.value.title]
        ]),
        N(n("textarea", {
          "onUpdate:modelValue": e[2] || (e[2] = (t) => l.value.text = t),
          rows: "10",
          placeholder: "Paste the transcript",
          "aria-label": "Transcript"
        }, null, 512), [
          [V, l.value.text]
        ]),
        p(a(_), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !U.value
        }, {
          default: v(() => [...e[6] || (e[6] = [
            f("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : m("", !0),
      p(a(G), { tools: a(C) }, null, 8, ["tools"]),
      p(a(H), {
        rows: a(C).shown.value,
        failure: a(h),
        loaded: a(g),
        empty: "No transcriptions yet",
        hint: "A recording you have transcribed shows here with its text.",
        searching: a(C).filtering.value
      }, {
        default: v(({ row: t }) => [
          n("button", {
            type: "button",
            class: "row",
            "data-transcription": t.id,
            onClick: (S) => A(t)
          }, [
            n("span", at, i(t.title), 1),
            n("span", st, i(t.source || "pasted") + " · " + i(a(J)(t.created_at)), 1),
            n("span", nt, i(D(t)), 1)
          ], 8, et)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "searching"]),
      u.value ? (o(), r("section", ot, [
        n("h3", it, i(u.value.title), 1),
        N(n("textarea", {
          "onUpdate:modelValue": e[3] || (e[3] = (t) => c.value = t),
          rows: "14",
          "aria-label": "Transcript"
        }, null, 512), [
          [V, c.value]
        ]),
        n("div", lt, [
          p(a(_), {
            small: "",
            kind: "primary",
            "data-transcription-save": "",
            disabled: c.value === u.value.text,
            onClick: I
          }, {
            default: v(() => [...e[7] || (e[7] = [
              f("Save", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          p(a(_), {
            small: "",
            onClick: e[4] || (e[4] = (t) => u.value = null)
          }, {
            default: v(() => [...e[8] || (e[8] = [
              f("Close", -1)
            ])]),
            _: 1
          })
        ]),
        e[9] || (e[9] = n("h3", { class: "note" }, "Made from it", -1)),
        T.value.length ? m("", !0) : (o(), r("p", rt, "Nothing yet")),
        (o(!0), r(B, null, F(T.value, (t) => (o(), r("button", {
          key: t.id,
          type: "button",
          class: "row",
          "data-transcription-link": "",
          onClick: (S) => a(K)(`${t.target_model}:${t.target_id}`)
        }, i(t.target_model) + " " + i(t.target_id), 9, ut))), 128))
      ])) : m("", !0)
    ]));
  }
}, vt = /* @__PURE__ */ Q(ct, [["__scopeId", "data-v-0c7915ac"]]);
export {
  vt as default
};
