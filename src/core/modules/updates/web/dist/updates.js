/* @code-commandments-generated */
if (!document.getElementById("window-styles-c93fe4ea9a74")) { const style = document.createElement("style"); style.id = "window-styles-c93fe4ea9a74"; style.textContent = ".releases[data-v-192a4a0c]{position:relative;min-height:100px}.failure[data-v-192a4a0c]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.cover[data-v-192a4a0c]{margin-bottom:8px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px;font-size:13px}.arrived[data-v-192a4a0c]{display:flex;align-items:center;gap:10px;margin-bottom:8px;font-size:13px}.note[data-v-192a4a0c]{display:flex;flex-direction:column;gap:4px;margin-bottom:12px;font-size:13px}.standing[data-v-192a4a0c],.release[data-v-192a4a0c]{display:flex;align-items:baseline;gap:10px;font-size:13px}.line[data-v-192a4a0c],.title[data-v-192a4a0c]{flex:1}.heading[data-v-192a4a0c]{margin:12px 0 6px;color:var(--text-3);font-size:12px;font-weight:600}.detail[data-v-192a4a0c]{color:var(--text-3);font-size:12px}button[data-v-192a4a0c]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as u, computed as U, openBlock as n, createBlock as N, unref as r, withCtx as _, createElementBlock as i, createCommentVNode as v, createElementVNode as t, createVNode as y, createTextVNode as R, toDisplayString as d, Fragment as B, renderList as P } from "vue";
import { useRows as S, WindowRoom as T, Btn as D, RowList as V, TextDisplay as I } from "@journal/window-kit";
const $ = (h, l) => {
  const a = h.__vccOpts || h;
  for (const [c, p] of l)
    a[c] = p;
  return a;
}, j = {
  key: 0,
  class: "cover",
  role: "status",
  "data-update-cover": ""
}, E = {
  key: 1,
  class: "arrived",
  role: "status",
  "data-update-arrived": ""
}, W = {
  key: 2,
  class: "failure"
}, A = { class: "standing" }, O = { class: "line" }, q = { class: "releases" }, z = ["data-row"], G = { class: "title" }, H = { class: "detail" }, J = {
  key: 3,
  class: "detail",
  "data-update-notes-failure": ""
}, K = { class: "release" }, M = { class: "title" }, Q = { class: "detail" }, X = {
  __name: "UpdatesPanel",
  setup(h) {
    const l = S("release list", ["release.*"]), a = u(null), c = u(""), p = u(!1), m = u(!1), k = u([]), w = u(1), x = u(!0), f = u(""), F = U(() => a.value ? a.value.line : c.value ? "Release unavailable" : "Checking for a newer release");
    async function g() {
      c.value = "";
      const s = await l.context.read("update check");
      a.value = s.ok ? s.value : null, c.value = s.ok ? "" : s.error;
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
    const L = () => window.location.reload();
    return g(), b(1), (s, e) => (n(), N(r(T), null, {
      default: _(() => [
        p.value ? (n(), i("div", j, "Updating the journal. This takes a short while.")) : v("", !0),
        m.value ? (n(), i("div", E, [
          e[2] || (e[2] = t("span", { class: "line" }, "The update is installed. Reload the page to see it.", -1)),
          y(r(D), {
            small: "",
            kind: "primary",
            "data-update-reload": "",
            onClick: L
          }, {
            default: _(() => [...e[1] || (e[1] = [
              R("Reload", -1)
            ])]),
            _: 1
          })
        ])) : v("", !0),
        c.value || r(l).actionFailure.value ? (n(), i("p", W, d(c.value || r(l).actionFailure.value), 1)) : v("", !0),
        t("div", A, [
          t("span", O, d(F.value), 1),
          t("button", {
            type: "button",
            onClick: g
          }, "Check again"),
          a.value && !a.value.is_current ? (n(), N(r(D), {
            key: 0,
            small: "",
            kind: "primary",
            "data-update-install": "",
            onClick: C
          }, {
            default: _(() => [
              R(d(a.value.tag ? `Update to ${a.value.tag}` : "Update to the latest"), 1)
            ]),
            _: 1
          })) : a.value ? (n(), i("button", {
            key: 1,
            type: "button",
            "data-update-force": "",
            onClick: C
          }, "Install it again")) : v("", !0)
        ]),
        e[3] || (e[3] = t("h3", { class: "heading" }, "Installed releases", -1)),
        t("div", q, [
          y(r(V), {
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
                t("span", G, d(o.tag || o.checksum.slice(0, 12)), 1),
                t("span", H, d(new Date(o.created_at).toLocaleString()), 1)
              ], 8, z)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ]),
        e[4] || (e[4] = t("h3", { class: "heading" }, "What changed", -1)),
        f.value ? (n(), i("p", J, d(f.value), 1)) : v("", !0),
        (n(!0), i(B, null, P(k.value, (o) => (n(), i("article", {
          key: o.tag,
          class: "note",
          "data-update-note": ""
        }, [
          t("div", K, [
            t("span", M, d(o.tag), 1),
            t("span", Q, d(new Date(o.published_at).toLocaleDateString()), 1)
          ]),
          y(r(I), {
            text: o.text
          }, null, 8, ["text"])
        ]))), 128)),
        x.value ? v("", !0) : (n(), i("button", {
          key: 4,
          type: "button",
          "data-update-older": "",
          onClick: e[0] || (e[0] = (o) => b(w.value + 1))
        }, "Show older releases"))
      ]),
      _: 1
    }));
  }
}, ee = /* @__PURE__ */ $(X, [["__scopeId", "data-v-192a4a0c"]]);
export {
  ee as default
};
