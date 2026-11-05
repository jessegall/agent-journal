/* @code-commandments-generated */
if (!document.getElementById("window-styles-fdb739d70e79")) { const style = document.createElement("style"); style.id = "window-styles-fdb739d70e79"; style.textContent = ".releases[data-v-65d1eb8c]{position:relative;min-height:100px}.failure[data-v-65d1eb8c]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.cover[data-v-65d1eb8c]{margin-bottom:8px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px;font-size:13px}.arrived[data-v-65d1eb8c]{display:flex;align-items:center;gap:10px;margin-bottom:8px;font-size:13px}.note[data-v-65d1eb8c]{display:flex;flex-direction:column;gap:4px;margin-bottom:12px;font-size:13px}.standing[data-v-65d1eb8c],.release[data-v-65d1eb8c]{display:flex;align-items:baseline;gap:10px;font-size:13px}.line[data-v-65d1eb8c],.title[data-v-65d1eb8c]{flex:1}.heading[data-v-65d1eb8c]{margin:12px 0 6px;color:var(--text-3);font-size:12px;font-weight:600}.detail[data-v-65d1eb8c]{color:var(--text-3);font-size:12px}button[data-v-65d1eb8c]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as r, computed as R, openBlock as o, createBlock as N, unref as i, withCtx as h, createElementBlock as u, createCommentVNode as v, createElementVNode as s, createVNode as y, createTextVNode as D, toDisplayString as d, Fragment as I, renderList as P } from "vue";
import { useRows as S, WindowRoom as T, Btn as F, RowList as V, TextDisplay as $ } from "@journal/window-kit";
const E = (f, n) => {
  const a = f.__vccOpts || f;
  for (const [c, p] of n)
    a[c] = p;
  return a;
}, W = {
  key: 0,
  class: "cover",
  role: "status",
  "data-update-cover": ""
}, j = {
  key: 1,
  class: "arrived",
  role: "status",
  "data-update-arrived": ""
}, q = {
  key: 2,
  class: "failure"
}, O = { class: "standing" }, z = { class: "line" }, A = { class: "releases" }, G = ["data-row"], H = { class: "title" }, J = { class: "detail" }, K = {
  key: 3,
  class: "detail",
  "data-update-notes-failure": ""
}, M = { class: "release" }, Q = { class: "title" }, X = { class: "detail" }, Y = {
  __name: "UpdatesPanel",
  setup(f) {
    const n = S("release list", ["release.*"]), a = r(null), c = r(""), p = r(!1), m = r(!1), L = R(() => {
      var l, e, t;
      return m.value && ((l = a.value) == null ? void 0 : l.is_current) && ((t = (e = a.value) == null ? void 0 : e.installation) == null ? void 0 : t.step) === "finished";
    }), k = r([]), w = r(1), x = r(!0), g = r(""), U = R(() => a.value ? a.value.line : c.value ? "Release unavailable" : "Checking for a newer release");
    async function _() {
      c.value = "";
      const l = await n.context.read("update check");
      a.value = l.ok ? l.value : null, c.value = l.ok ? "" : l.error;
    }
    async function b() {
      p.value = !0;
      const l = await n.act(["update", "install"]);
      p.value = !1, l.ok && (await _(), m.value = !0);
    }
    async function C(l) {
      const e = await n.context.read(`update notes --page ${l}`);
      g.value = e.ok ? "" : e.error, e.ok && (k.value = [...k.value, ...e.value.notes], w.value = l, x.value = e.value.is_last_page);
    }
    const B = () => window.location.reload();
    return n.context.follow(["release.*", "release_install.*"], _), _(), C(1), (l, e) => (o(), N(i(T), null, {
      default: h(() => [
        p.value ? (o(), u("div", W, "Updating the journal. This takes a short while.")) : v("", !0),
        L.value ? (o(), u("div", j, [
          e[2] || (e[2] = s("span", { class: "line" }, "The update is installed. Reload the page to see it.", -1)),
          y(i(F), {
            small: "",
            kind: "primary",
            "data-update-reload": "",
            onClick: B
          }, {
            default: h(() => [...e[1] || (e[1] = [
              D("Reload", -1)
            ])]),
            _: 1
          })
        ])) : v("", !0),
        c.value || i(n).actionFailure.value ? (o(), u("p", q, d(c.value || i(n).actionFailure.value), 1)) : v("", !0),
        s("div", O, [
          s("span", z, d(U.value), 1),
          s("button", {
            type: "button",
            onClick: _
          }, "Check again"),
          a.value && !a.value.is_current ? (o(), N(i(F), {
            key: 0,
            small: "",
            kind: "primary",
            "data-update-install": "",
            onClick: b
          }, {
            default: h(() => {
              var t;
              return [
                D(d(((t = a.value.installation) == null ? void 0 : t.step) === "failed" ? "Retry update" : a.value.tag ? `Update to ${a.value.tag}` : "Update to the latest"), 1)
              ];
            }),
            _: 1
          })) : a.value ? (o(), u("button", {
            key: 1,
            type: "button",
            "data-update-force": "",
            onClick: b
          }, "Install it again")) : v("", !0)
        ]),
        e[3] || (e[3] = s("h3", { class: "heading" }, "Installed releases", -1)),
        s("div", A, [
          y(i(V), {
            rows: i(n).rows.value,
            failure: i(n).failure.value,
            loaded: i(n).loaded.value,
            empty: "No installation history yet",
            hint: "Installed releases appear here with their installation dates."
          }, {
            default: h(({ row: t }) => [
              s("div", {
                class: "release",
                "data-row": t.id
              }, [
                s("span", H, d(t.tag || t.checksum.slice(0, 12)), 1),
                s("span", J, d(new Date(t.created_at).toLocaleString()), 1)
              ], 8, G)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ]),
        e[4] || (e[4] = s("h3", { class: "heading" }, "What changed", -1)),
        g.value ? (o(), u("p", K, d(g.value), 1)) : v("", !0),
        (o(!0), u(I, null, P(k.value, (t) => (o(), u("article", {
          key: t.tag,
          class: "note",
          "data-update-note": ""
        }, [
          s("div", M, [
            s("span", Q, d(t.tag), 1),
            s("span", X, d(new Date(t.published_at).toLocaleDateString()), 1)
          ]),
          y(i($), {
            text: t.text
          }, null, 8, ["text"])
        ]))), 128)),
        x.value ? v("", !0) : (o(), u("button", {
          key: 4,
          type: "button",
          "data-update-older": "",
          onClick: e[0] || (e[0] = (t) => C(w.value + 1))
        }, "Show older releases"))
      ]),
      _: 1
    }));
  }
}, te = /* @__PURE__ */ E(Y, [["__scopeId", "data-v-65d1eb8c"]]);
export {
  te as default
};
