/* @code-commandments-generated */
if (!document.getElementById("window-styles-8394e7c141cc")) { const style = document.createElement("style"); style.id = "window-styles-8394e7c141cc"; style.textContent = ".failure[data-v-68456d24]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.cover[data-v-68456d24]{margin-bottom:8px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px;font-size:13px}.arrived[data-v-68456d24]{display:flex;align-items:center;gap:10px;margin-bottom:8px;font-size:13px}.note[data-v-68456d24]{display:flex;flex-direction:column;gap:4px;margin-bottom:12px;font-size:13px}.standing[data-v-68456d24],.release[data-v-68456d24]{display:flex;align-items:baseline;gap:10px;font-size:13px}.line[data-v-68456d24],.title[data-v-68456d24]{flex:1}.heading[data-v-68456d24]{margin:12px 0 6px;color:var(--text-3);font-size:12px;font-weight:600}.detail[data-v-68456d24]{color:var(--text-3);font-size:12px}button[data-v-68456d24]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as u, openBlock as n, createBlock as N, unref as r, withCtx as _, createElementBlock as i, createCommentVNode as c, createElementVNode as t, createVNode as y, createTextVNode as D, toDisplayString as d, Fragment as U, renderList as B } from "vue";
import { useRows as L, WindowRoom as P, Btn as F, RowList as S, TextDisplay as T } from "@journal/window-kit";
const V = (h, l) => {
  const a = h.__vccOpts || h;
  for (const [v, p] of l)
    a[v] = p;
  return a;
}, I = {
  key: 0,
  class: "cover",
  role: "status",
  "data-update-cover": ""
}, $ = {
  key: 1,
  class: "arrived",
  role: "status",
  "data-update-arrived": ""
}, j = {
  key: 2,
  class: "failure"
}, E = { class: "standing" }, W = { class: "line" }, A = ["data-row"], O = { class: "title" }, q = { class: "detail" }, z = {
  key: 3,
  class: "detail",
  "data-update-notes-failure": ""
}, G = { class: "release" }, H = { class: "title" }, J = { class: "detail" }, K = {
  __name: "UpdatesPanel",
  setup(h) {
    const l = L("release list", ["release.*"]), a = u(null), v = u(""), p = u(!1), m = u(!1), k = u([]), w = u(1), x = u(!0), f = u("");
    async function g() {
      const s = await l.context.read("update check");
      a.value = s.ok ? s.value : null, v.value = s.ok ? "" : s.error;
    }
    async function C() {
      p.value = !0;
      const s = await l.act(["update", "install"]);
      p.value = !1, s.ok && (await g(), m.value = !0);
    }
    async function b(s) {
      const e = await l.context.read(`update notes --page ${s}`);
      f.value = e.ok ? "" : e.error, e.ok && (k.value = [...k.value, ...e.value.notes], w.value = s, x.value = e.value.is_last_page);
    }
    const R = () => window.location.reload();
    return g(), b(1), (s, e) => (n(), N(r(P), null, {
      default: _(() => [
        p.value ? (n(), i("div", I, "Updating the journal. This takes a short while.")) : c("", !0),
        m.value ? (n(), i("div", $, [
          e[2] || (e[2] = t("span", { class: "line" }, "The update is installed. Reload the page to see it.", -1)),
          y(r(F), {
            small: "",
            kind: "primary",
            "data-update-reload": "",
            onClick: R
          }, {
            default: _(() => [...e[1] || (e[1] = [
              D("Reload", -1)
            ])]),
            _: 1
          })
        ])) : c("", !0),
        v.value || r(l).actionFailure.value ? (n(), i("p", j, d(v.value || r(l).actionFailure.value), 1)) : c("", !0),
        t("div", E, [
          t("span", W, d(a.value ? a.value.line : "Checking for a newer release"), 1),
          t("button", {
            type: "button",
            onClick: g
          }, "Check again"),
          a.value && !a.value.is_current ? (n(), N(r(F), {
            key: 0,
            small: "",
            kind: "primary",
            "data-update-install": "",
            onClick: C
          }, {
            default: _(() => [
              D(d(a.value.tag ? `Update to ${a.value.tag}` : "Update to the latest"), 1)
            ]),
            _: 1
          })) : a.value ? (n(), i("button", {
            key: 1,
            type: "button",
            "data-update-force": "",
            onClick: C
          }, "Install it again")) : c("", !0)
        ]),
        e[3] || (e[3] = t("h3", { class: "heading" }, "Installed releases", -1)),
        y(r(S), {
          rows: r(l).rows.value,
          failure: r(l).failure.value,
          loaded: r(l).loaded.value,
          empty: "No release installed from here yet",
          hint: "A release you install from this journal shows here with when."
        }, {
          default: _(({ row: o }) => [
            t("div", {
              class: "release",
              "data-row": o.id
            }, [
              t("span", O, d(o.tag || o.checksum.slice(0, 12)), 1),
              t("span", q, d(new Date(o.created_at).toLocaleString()), 1)
            ], 8, A)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"]),
        e[4] || (e[4] = t("h3", { class: "heading" }, "What changed", -1)),
        f.value ? (n(), i("p", z, d(f.value), 1)) : c("", !0),
        (n(!0), i(U, null, B(k.value, (o) => (n(), i("article", {
          key: o.tag,
          class: "note",
          "data-update-note": ""
        }, [
          t("div", G, [
            t("span", H, d(o.tag), 1),
            t("span", J, d(new Date(o.published_at).toLocaleDateString()), 1)
          ]),
          y(r(T), {
            text: o.text
          }, null, 8, ["text"])
        ]))), 128)),
        x.value ? c("", !0) : (n(), i("button", {
          key: 4,
          type: "button",
          "data-update-older": "",
          onClick: e[0] || (e[0] = (o) => b(w.value + 1))
        }, "Show older releases"))
      ]),
      _: 1
    }));
  }
}, X = /* @__PURE__ */ V(K, [["__scopeId", "data-v-68456d24"]]);
export {
  X as default
};
