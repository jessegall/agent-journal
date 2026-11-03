/* @code-commandments-generated */
if (!document.getElementById("window-styles-fa47b73e7809")) { const style = document.createElement("style"); style.id = "window-styles-fa47b73e7809"; style.textContent = ".failure[data-v-eb05c0a9]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.cover[data-v-eb05c0a9]{margin-bottom:8px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px;font-size:13px}.arrived[data-v-eb05c0a9]{display:flex;align-items:center;gap:10px;margin-bottom:8px;font-size:13px}.note[data-v-eb05c0a9]{display:flex;flex-direction:column;gap:4px;margin-bottom:12px;font-size:13px}.standing[data-v-eb05c0a9],.release[data-v-eb05c0a9]{display:flex;align-items:baseline;gap:10px;font-size:13px}.line[data-v-eb05c0a9],.title[data-v-eb05c0a9]{flex:1}.heading[data-v-eb05c0a9]{margin:12px 0 6px;color:var(--text-3);font-size:12px;font-weight:600}.detail[data-v-eb05c0a9]{color:var(--text-3);font-size:12px}button[data-v-eb05c0a9]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as i, openBlock as n, createElementBlock as r, Fragment as N, createCommentVNode as c, createElementVNode as t, createVNode as g, unref as u, withCtx as y, createTextVNode as D, toDisplayString as d, createBlock as B, renderList as L } from "vue";
import { useRows as P, Btn as F, RowList as R, TextDisplay as S } from "@journal/window-kit";
const T = (_, l) => {
  const a = _.__vccOpts || _;
  for (const [v, p] of l)
    a[v] = p;
  return a;
}, V = {
  key: 0,
  class: "cover",
  role: "status",
  "data-update-cover": ""
}, I = {
  key: 1,
  class: "arrived",
  role: "status",
  "data-update-arrived": ""
}, $ = {
  key: 2,
  class: "failure"
}, j = { class: "standing" }, E = { class: "line" }, A = ["data-row"], O = { class: "title" }, W = { class: "detail" }, q = {
  key: 3,
  class: "detail",
  "data-update-notes-failure": ""
}, z = { class: "release" }, G = { class: "title" }, H = { class: "detail" }, J = {
  __name: "UpdatesPanel",
  setup(_) {
    const l = P("release list", ["release.*"]), a = i(null), v = i(""), p = i(!1), m = i(!1), h = i([]), w = i(1), x = i(!0), k = i("");
    async function f() {
      const s = await l.context.read("update check");
      a.value = s.ok ? s.value : null, v.value = s.ok ? "" : s.error;
    }
    async function C() {
      p.value = !0;
      const s = await l.act(["update", "install"]);
      p.value = !1, s.ok && (await f(), m.value = !0);
    }
    async function b(s) {
      const e = await l.context.read(`update notes --page ${s}`);
      k.value = e.ok ? "" : e.error, e.ok && (h.value = [...h.value, ...e.value.notes], w.value = s, x.value = e.value.is_last_page);
    }
    const U = () => window.location.reload();
    return f(), b(1), (s, e) => (n(), r(N, null, [
      p.value ? (n(), r("div", V, "Updating the journal. This takes a short while.")) : c("", !0),
      m.value ? (n(), r("div", I, [
        e[2] || (e[2] = t("span", { class: "line" }, "The update is installed. Reload the page to see it.", -1)),
        g(u(F), {
          small: "",
          kind: "primary",
          "data-update-reload": "",
          onClick: U
        }, {
          default: y(() => [...e[1] || (e[1] = [
            D("Reload", -1)
          ])]),
          _: 1
        })
      ])) : c("", !0),
      v.value || u(l).actionFailure.value ? (n(), r("p", $, d(v.value || u(l).actionFailure.value), 1)) : c("", !0),
      t("div", j, [
        t("span", E, d(a.value ? a.value.line : "Checking for a newer release"), 1),
        t("button", {
          type: "button",
          onClick: f
        }, "Check again"),
        a.value && !a.value.is_current ? (n(), B(u(F), {
          key: 0,
          small: "",
          kind: "primary",
          "data-update-install": "",
          onClick: C
        }, {
          default: y(() => [
            D(d(a.value.tag ? `Update to ${a.value.tag}` : "Update to the latest"), 1)
          ]),
          _: 1
        })) : a.value ? (n(), r("button", {
          key: 1,
          type: "button",
          "data-update-force": "",
          onClick: C
        }, "Install it again")) : c("", !0)
      ]),
      e[3] || (e[3] = t("h3", { class: "heading" }, "Installed releases", -1)),
      g(u(R), {
        rows: u(l).rows.value,
        failure: u(l).failure.value,
        loaded: u(l).loaded.value,
        empty: "No release installed from here yet",
        hint: "A release you install from this journal shows here with when."
      }, {
        default: y(({ row: o }) => [
          t("div", {
            class: "release",
            "data-row": o.id
          }, [
            t("span", O, d(o.tag || o.checksum.slice(0, 12)), 1),
            t("span", W, d(new Date(o.created_at).toLocaleString()), 1)
          ], 8, A)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"]),
      e[4] || (e[4] = t("h3", { class: "heading" }, "What changed", -1)),
      k.value ? (n(), r("p", q, d(k.value), 1)) : c("", !0),
      (n(!0), r(N, null, L(h.value, (o) => (n(), r("article", {
        key: o.tag,
        class: "note",
        "data-update-note": ""
      }, [
        t("div", z, [
          t("span", G, d(o.tag), 1),
          t("span", H, d(new Date(o.published_at).toLocaleDateString()), 1)
        ]),
        g(u(S), {
          text: o.text
        }, null, 8, ["text"])
      ]))), 128)),
      x.value ? c("", !0) : (n(), r("button", {
        key: 4,
        type: "button",
        "data-update-older": "",
        onClick: e[0] || (e[0] = (o) => b(w.value + 1))
      }, "Show older releases"))
    ], 64));
  }
}, Q = /* @__PURE__ */ T(J, [["__scopeId", "data-v-eb05c0a9"]]);
export {
  Q as default
};
