/* @code-commandments-generated */
if (!document.getElementById("window-styles-ef7ef1d49d07")) { const style = document.createElement("style"); style.id = "window-styles-ef7ef1d49d07"; style.textContent = ".releases[data-v-b46da630]{position:relative;min-height:100px}.failure[data-v-b46da630]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.cover[data-v-b46da630]{margin-bottom:8px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px;font-size:13px}.arrived[data-v-b46da630]{display:flex;align-items:center;gap:10px;margin-bottom:8px;font-size:13px}.note[data-v-b46da630]{display:flex;flex-direction:column;gap:4px;margin-bottom:12px;font-size:13px}.standing[data-v-b46da630],.release[data-v-b46da630]{display:flex;align-items:baseline;gap:10px;font-size:13px}.line[data-v-b46da630],.title[data-v-b46da630]{flex:1}.heading[data-v-b46da630]{margin:12px 0 6px;color:var(--text-3);font-size:12px;font-weight:600}.detail[data-v-b46da630]{color:var(--text-3);font-size:12px}button[data-v-b46da630]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { computed as _, ref as v, watch as I, openBlock as i, createBlock as R, unref as o, withCtx as h, createElementBlock as r, createCommentVNode as p, createElementVNode as l, createVNode as w, createTextVNode as N, toDisplayString as u, Fragment as P, renderList as V } from "vue";
import { useWindow as W, WindowRoom as E, Btn as D, RowList as $, TextDisplay as j } from "@journal/window-kit";
const q = (f, a) => {
  const d = f.__vccOpts || f;
  for (const [c, n] of a)
    d[c] = n;
  return d;
}, O = {
  key: 0,
  class: "cover",
  role: "status",
  "data-update-cover": ""
}, z = {
  key: 1,
  class: "arrived",
  role: "status",
  "data-update-arrived": ""
}, A = {
  key: 2,
  class: "failure"
}, G = { class: "standing" }, H = { class: "line" }, J = { class: "releases" }, K = ["data-row"], M = { class: "title" }, Q = { class: "detail" }, X = {
  key: 3,
  class: "detail",
  "data-update-notes-failure": ""
}, Y = { class: "release" }, Z = { class: "title" }, ee = { class: "detail" }, te = {
  __name: "UpdatesPanel",
  setup(f) {
    const a = W(), d = a.props.releases, { failure: c } = a.props.standing, n = _(() => c.value ? null : a.props.standing.data.value), g = v(!1), k = v(""), b = v(!1), L = _(() => {
      var e, s, t;
      return b.value && ((e = n.value) == null ? void 0 : e.is_current) && ((t = (s = n.value) == null ? void 0 : s.installation) == null ? void 0 : t.step) === "finished";
    }), y = v([]), m = v(1), S = _(() => {
      var e;
      return ((e = a.props.notes.data.value) == null ? void 0 : e.is_last_page) ?? !0;
    }), { failure: x } = a.props.notes;
    I(() => a.props.notes.data.value, (e) => {
      e && (y.value = m.value === 1 ? e.notes : [...y.value, ...e.notes]);
    });
    const T = _(() => n.value ? n.value.line : c.value ? "Release unavailable" : "Checking for a newer release");
    async function U() {
      await a.reload("standing");
    }
    async function C() {
      g.value = !0;
      const e = await a.run(["update", "install"]);
      k.value = e.ok ? "" : e.error, g.value = !1, await a.reload({ only: e.ok ? ["releases", "standing"] : ["releases"] }), e.ok && (b.value = !0);
    }
    async function B(e) {
      m.value = e, a.state["notes.page"] = String(e), await a.reload("notes");
    }
    const F = () => globalThis.location.reload();
    return (e, s) => (i(), R(o(E), null, {
      default: h(() => [
        g.value ? (i(), r("div", O, "Updating the journal. This takes a short while.")) : p("", !0),
        L.value ? (i(), r("div", z, [
          s[2] || (s[2] = l("span", { class: "line" }, "The update is installed. Reload the page to see it.", -1)),
          w(o(D), {
            small: "",
            variant: "primary",
            "data-update-reload": "",
            onClick: F
          }, {
            default: h(() => [...s[1] || (s[1] = [
              N("Reload", -1)
            ])]),
            _: 1
          })
        ])) : p("", !0),
        o(c) || k.value ? (i(), r("p", A, u(o(c) || k.value), 1)) : p("", !0),
        l("div", G, [
          l("span", H, u(T.value), 1),
          l("button", {
            type: "button",
            onClick: U
          }, "Check again"),
          n.value && !n.value.is_current ? (i(), R(o(D), {
            key: 0,
            small: "",
            variant: "primary",
            "data-update-install": "",
            onClick: C
          }, {
            default: h(() => {
              var t;
              return [
                N(u(((t = n.value.installation) == null ? void 0 : t.step) === "failed" ? "Retry update" : n.value.tag ? `Update to ${n.value.tag}` : "Update to the latest"), 1)
              ];
            }),
            _: 1
          })) : n.value ? (i(), r("button", {
            key: 1,
            type: "button",
            "data-update-force": "",
            onClick: C
          }, "Install it again")) : p("", !0)
        ]),
        s[3] || (s[3] = l("h3", { class: "heading" }, "Installed releases", -1)),
        l("div", J, [
          w(o($), {
            rows: o(d).rows.value,
            failure: o(d).failure.value,
            loaded: o(d).loaded.value,
            empty: "No installation history yet",
            hint: "Installed releases appear here with their installation dates."
          }, {
            default: h(({ row: t }) => [
              l("div", {
                class: "release",
                "data-row": t.id
              }, [
                l("span", M, u(t.tag || t.checksum.slice(0, 12)), 1),
                l("span", Q, u(new Date(t.created_at).toLocaleString()), 1)
              ], 8, K)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ]),
        s[4] || (s[4] = l("h3", { class: "heading" }, "What changed", -1)),
        o(x) ? (i(), r("p", X, u(o(x)), 1)) : p("", !0),
        (i(!0), r(P, null, V(y.value, (t) => (i(), r("article", {
          key: t.tag,
          class: "note",
          "data-update-note": ""
        }, [
          l("div", Y, [
            l("span", Z, u(t.tag), 1),
            l("span", ee, u(new Date(t.published_at).toLocaleDateString()), 1)
          ]),
          w(o(j), {
            text: t.text
          }, null, 8, ["text"])
        ]))), 128)),
        S.value ? p("", !0) : (i(), r("button", {
          key: 4,
          type: "button",
          "data-update-older": "",
          onClick: s[0] || (s[0] = (t) => B(m.value + 1))
        }, "Show older releases"))
      ]),
      _: 1
    }));
  }
}, le = /* @__PURE__ */ q(te, [["__scopeId", "data-v-b46da630"]]);
export {
  le as default
};
