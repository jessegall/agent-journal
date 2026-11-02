/* @code-commandments-generated */
if (!document.getElementById("window-styles-c2ffeb836253")) { const style = document.createElement("style"); style.id = "window-styles-c2ffeb836253"; style.textContent = ".transcriptions[data-v-d7258d25],.form[data-v-d7258d25],.opened[data-v-d7258d25]{display:flex;flex-direction:column;gap:8px}.bar[data-v-d7258d25]{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.note[data-v-d7258d25]{margin:0;color:var(--text-3);font-size:12px;font-weight:400}.failure[data-v-d7258d25]{margin:0;color:var(--bad, var(--text-2));font-size:12px}.row[data-v-d7258d25]{display:flex;flex-direction:column;gap:2px;width:100%;padding:8px;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.title[data-v-d7258d25]{margin:0;font-size:inherit;font-weight:600}input[data-v-d7258d25],textarea[data-v-d7258d25]{box-sizing:border-box;width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface, none);color:inherit;font:inherit}\n"; document.head.appendChild(style); }
import { ref as d, computed as W, openBlock as o, createElementBlock as r, createElementVNode as n, createVNode as p, unref as a, withCtx as v, createTextVNode as m, Fragment as B, renderList as F, createBlock as j, toDisplayString as l, createCommentVNode as f, withModifiers as q, withDirectives as $, vModelText as N } from "vue";
import { useWindow as z, useRows as L, useListTools as A, Btn as _, ListTools as G, RowList as H, ago as J, peekRef as K } from "@journal/window-kit";
const Q = (y, w) => {
  const k = y.__vccOpts || y;
  for (const [b, h] of w)
    k[b] = h;
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
}, lt = { class: "title" }, it = { class: "bar" }, rt = {
  key: 0,
  class: "note"
}, ut = ["onClick"], ct = {
  __name: "TranscriptionRows",
  setup(y) {
    const w = z(), { rows: k, failure: b, loaded: h, act: g, actionFailure: V } = L("transcription list", ["transcription.*"]), M = L("transcription sources", []), S = A(k, { title: (s) => `${s.title} ${s.text}` }), x = d(!1), i = d({ title: "", text: "" }), u = d(null), c = d(""), C = d([]), T = d(""), U = W(() => i.value.title.trim() && i.value.text.trim()), D = (s) => s.text.trim().slice(0, 140);
    async function E() {
      (await g(["transcription", "make", i.value.title.trim(), "--text", i.value.text])).ok && (i.value = { title: "", text: "" }, x.value = !1);
    }
    async function I(s) {
      u.value = s, c.value = s.text;
      const e = await w.read(["link", "list", "--source", `transcription:${s.id}`]);
      C.value = e.ok ? e.value.rows ?? [] : [];
    }
    async function O() {
      (await g(["transcription", "edit", String(u.value.id), "--text", c.value])).ok && (u.value = { ...u.value, text: c.value });
    }
    async function P(s) {
      (await g(["transcription", "fetch", s.name])).ok && (T.value = `The agent was asked to fetch transcriptions from ${s.title}.`);
    }
    return (s, e) => (o(), r("div", X, [
      n("div", Y, [
        p(a(_), {
          small: "",
          "data-transcription-new": "",
          onClick: e[0] || (e[0] = (t) => x.value = !x.value)
        }, {
          default: v(() => [...e[5] || (e[5] = [
            m("New transcription", -1)
          ])]),
          _: 1
        }),
        (o(!0), r(B, null, F(a(M).rows.value, (t) => (o(), j(a(_), {
          key: t.name,
          small: "",
          "data-transcription-fetch": t.name,
          onClick: (R) => P(t)
        }, {
          default: v(() => [
            m("Fetch transcriptions from " + l(t.title), 1)
          ]),
          _: 2
        }, 1032, ["data-transcription-fetch", "onClick"]))), 128)),
        T.value ? (o(), r("span", Z, l(T.value), 1)) : f("", !0)
      ]),
      a(V) ? (o(), r("p", tt, l(a(V)), 1)) : f("", !0),
      x.value ? (o(), r("form", {
        key: 1,
        class: "form",
        "data-transcription-form": "",
        onSubmit: q(E, ["prevent"])
      }, [
        $(n("input", {
          "onUpdate:modelValue": e[1] || (e[1] = (t) => i.value.title = t),
          placeholder: "Title",
          "aria-label": "Title"
        }, null, 512), [
          [N, i.value.title]
        ]),
        $(n("textarea", {
          "onUpdate:modelValue": e[2] || (e[2] = (t) => i.value.text = t),
          rows: "10",
          placeholder: "Paste the transcript",
          "aria-label": "Transcript"
        }, null, 512), [
          [N, i.value.text]
        ]),
        p(a(_), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !U.value
        }, {
          default: v(() => [...e[6] || (e[6] = [
            m("Save", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : f("", !0),
      p(a(G), {
        tools: a(S),
        placeholder: "Search the transcriptions"
      }, null, 8, ["tools"]),
      p(a(H), {
        rows: a(S).shown.value,
        failure: a(b),
        loaded: a(h),
        empty: "No transcriptions yet"
      }, {
        default: v(({ row: t }) => [
          n("button", {
            type: "button",
            class: "row",
            "data-transcription": t.id,
            onClick: (R) => I(t)
          }, [
            n("span", at, l(t.title), 1),
            n("span", st, l(t.source || "pasted") + " · " + l(a(J)(t.created_at)), 1),
            n("span", nt, l(D(t)), 1)
          ], 8, et)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"]),
      u.value ? (o(), r("section", ot, [
        n("h3", lt, l(u.value.title), 1),
        $(n("textarea", {
          "onUpdate:modelValue": e[3] || (e[3] = (t) => c.value = t),
          rows: "14",
          "aria-label": "Transcript"
        }, null, 512), [
          [N, c.value]
        ]),
        n("div", it, [
          p(a(_), {
            small: "",
            kind: "primary",
            "data-transcription-save": "",
            disabled: c.value === u.value.text,
            onClick: O
          }, {
            default: v(() => [...e[7] || (e[7] = [
              m("Save", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          p(a(_), {
            small: "",
            onClick: e[4] || (e[4] = (t) => u.value = null)
          }, {
            default: v(() => [...e[8] || (e[8] = [
              m("Close", -1)
            ])]),
            _: 1
          })
        ]),
        e[9] || (e[9] = n("h3", { class: "note" }, "Made from it", -1)),
        C.value.length ? f("", !0) : (o(), r("p", rt, "Nothing yet")),
        (o(!0), r(B, null, F(C.value, (t) => (o(), r("button", {
          key: t.id,
          type: "button",
          class: "row",
          "data-transcription-link": "",
          onClick: (R) => a(K)(`${t.target_model}:${t.target_id}`)
        }, l(t.target_model) + " " + l(t.target_id), 9, ut))), 128))
      ])) : f("", !0)
    ]));
  }
}, vt = /* @__PURE__ */ Q(ct, [["__scopeId", "data-v-d7258d25"]]);
export {
  vt as default
};
