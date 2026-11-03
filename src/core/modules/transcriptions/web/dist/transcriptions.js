/* @code-commandments-generated */
if (!document.getElementById("window-styles-9948b75cba0f")) { const style = document.createElement("style"); style.id = "window-styles-9948b75cba0f"; style.textContent = ".transcriptions[data-v-03a640d5],.form[data-v-03a640d5],.opened[data-v-03a640d5]{display:flex;flex-direction:column;gap:8px}.bar[data-v-03a640d5]{display:flex;flex-wrap:wrap;align-items:center;gap:8px}.note[data-v-03a640d5]{margin:0;color:var(--text-3);font-size:12px;font-weight:400}.failure[data-v-03a640d5]{margin:0;color:var(--bad, var(--text-2));font-size:12px}.row[data-v-03a640d5]{display:flex;flex-direction:column;gap:2px;width:100%;padding:8px;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.title[data-v-03a640d5]{margin:0;font-size:inherit;font-weight:600}input[data-v-03a640d5],textarea[data-v-03a640d5]{box-sizing:border-box;width:100%;padding:6px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface, none);color:inherit;font:inherit}\n"; document.head.appendChild(style); }
import { ref as v, computed as P, openBlock as o, createBlock as B, unref as a, withCtx as c, createElementVNode as s, createVNode as d, createTextVNode as m, createElementBlock as u, Fragment as F, renderList as L, toDisplayString as l, createCommentVNode as f, withModifiers as j, withDirectives as N, vModelText as V } from "vue";
import { useWindow as q, useRows as M, useListTools as z, WindowRoom as G, Btn as _, ListTools as H, RowList as J, TimeAgo as K, peekRef as Q } from "@journal/window-kit";
const X = (w, y) => {
  const k = w.__vccOpts || w;
  for (const [h, g] of y)
    k[h] = g;
  return k;
}, Y = {
  class: "transcriptions",
  "data-transcriptions": ""
}, Z = { class: "bar" }, tt = {
  key: 0,
  class: "note",
  "data-transcription-notice": ""
}, et = {
  key: 0,
  class: "failure"
}, at = ["data-transcription", "onClick"], nt = { class: "title" }, st = { class: "note" }, ot = { class: "note" }, it = {
  key: 2,
  class: "opened",
  "data-transcription-opened": ""
}, lt = { class: "title" }, rt = { class: "bar" }, ut = {
  key: 0,
  class: "note"
}, ct = ["onClick"], dt = {
  __name: "TranscriptionRows",
  setup(w) {
    const y = q(), { rows: k, failure: h, loaded: g, act: b, actionFailure: R } = M("transcription list", ["transcription.*"]), U = M("transcription sources", []), T = z(k, { title: (n) => `${n.title} ${n.text}` }), x = v(!1), i = v({ title: "", text: "" }), r = v(null), p = v(""), C = v([]), $ = v(""), A = P(() => i.value.title.trim() && i.value.text.trim()), D = (n) => n.text.trim().slice(0, 140);
    async function E() {
      (await b(["transcription", "make", i.value.title.trim(), "--text", i.value.text])).ok && (i.value = { title: "", text: "" }, x.value = !1);
    }
    async function W(n) {
      r.value = n, p.value = n.text;
      const e = await y.read(["link", "list", "--source", `transcription:${n.id}`]);
      C.value = e.ok ? e.value.rows ?? [] : [];
    }
    async function I() {
      (await b(["transcription", "edit", String(r.value.id), "--text", p.value])).ok && (r.value = { ...r.value, text: p.value });
    }
    async function O(n) {
      (await b(["transcription", "fetch", n.name])).ok && ($.value = `The agent was asked to fetch transcriptions from ${n.title}.`);
    }
    return (n, e) => (o(), B(a(G), null, {
      default: c(() => [
        s("div", Y, [
          s("div", Z, [
            d(a(_), {
              small: "",
              "data-transcription-new": "",
              onClick: e[0] || (e[0] = (t) => x.value = !x.value)
            }, {
              default: c(() => [...e[5] || (e[5] = [
                m("New transcription", -1)
              ])]),
              _: 1
            }),
            (o(!0), u(F, null, L(a(U).rows.value, (t) => (o(), B(a(_), {
              key: t.name,
              small: "",
              "data-transcription-fetch": t.name,
              onClick: (S) => O(t)
            }, {
              default: c(() => [
                m("Fetch transcriptions from " + l(t.title), 1)
              ]),
              _: 2
            }, 1032, ["data-transcription-fetch", "onClick"]))), 128)),
            $.value ? (o(), u("span", tt, l($.value), 1)) : f("", !0)
          ]),
          a(R) ? (o(), u("p", et, l(a(R)), 1)) : f("", !0),
          x.value ? (o(), u("form", {
            key: 1,
            class: "form",
            "data-transcription-form": "",
            onSubmit: j(E, ["prevent"])
          }, [
            N(s("input", {
              "onUpdate:modelValue": e[1] || (e[1] = (t) => i.value.title = t),
              placeholder: "Title",
              "aria-label": "Title"
            }, null, 512), [
              [V, i.value.title]
            ]),
            N(s("textarea", {
              "onUpdate:modelValue": e[2] || (e[2] = (t) => i.value.text = t),
              rows: "10",
              placeholder: "Paste the transcript",
              "aria-label": "Transcript"
            }, null, 512), [
              [V, i.value.text]
            ]),
            d(a(_), {
              small: "",
              kind: "primary",
              type: "submit",
              disabled: !A.value
            }, {
              default: c(() => [...e[6] || (e[6] = [
                m("Save", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ], 32)) : f("", !0),
          d(a(H), { tools: a(T) }, null, 8, ["tools"]),
          d(a(J), {
            rows: a(T).shown.value,
            failure: a(h),
            loaded: a(g),
            empty: "No transcriptions yet",
            hint: "A recording you have transcribed shows here with its text.",
            searching: a(T).filtering.value
          }, {
            default: c(({ row: t }) => [
              s("button", {
                type: "button",
                class: "row",
                "data-transcription": t.id,
                onClick: (S) => W(t)
              }, [
                s("span", nt, l(t.title), 1),
                s("span", st, [
                  m(l(t.source || "pasted") + " · ", 1),
                  d(a(K), {
                    at: t.created_at
                  }, null, 8, ["at"])
                ]),
                s("span", ot, l(D(t)), 1)
              ], 8, at)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded", "searching"]),
          r.value ? (o(), u("section", it, [
            s("h3", lt, l(r.value.title), 1),
            N(s("textarea", {
              "onUpdate:modelValue": e[3] || (e[3] = (t) => p.value = t),
              rows: "14",
              "aria-label": "Transcript"
            }, null, 512), [
              [V, p.value]
            ]),
            s("div", rt, [
              d(a(_), {
                small: "",
                kind: "primary",
                "data-transcription-save": "",
                disabled: p.value === r.value.text,
                onClick: I
              }, {
                default: c(() => [...e[7] || (e[7] = [
                  m("Save", -1)
                ])]),
                _: 1
              }, 8, ["disabled"]),
              d(a(_), {
                small: "",
                onClick: e[4] || (e[4] = (t) => r.value = null)
              }, {
                default: c(() => [...e[8] || (e[8] = [
                  m("Close", -1)
                ])]),
                _: 1
              })
            ]),
            e[9] || (e[9] = s("h3", { class: "note" }, "Made from it", -1)),
            C.value.length ? f("", !0) : (o(), u("p", ut, "Nothing yet")),
            (o(!0), u(F, null, L(C.value, (t) => (o(), u("button", {
              key: t.id,
              type: "button",
              class: "row",
              "data-transcription-link": "",
              onClick: (S) => a(Q)(`${t.target_model}:${t.target_id}`)
            }, l(t.target_model) + " " + l(t.target_id), 9, ct))), 128))
          ])) : f("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, mt = /* @__PURE__ */ X(dt, [["__scopeId", "data-v-03a640d5"]]);
export {
  mt as default
};
