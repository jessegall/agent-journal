/* @code-commandments-generated */
if (!document.getElementById("window-styles-a29f80d26d14")) { const style = document.createElement("style"); style.id = "window-styles-a29f80d26d14"; style.textContent = ".releases[data-v-f0780fac]{position:relative;min-height:100px}.failure[data-v-f0780fac]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.cover[data-v-f0780fac]{margin-bottom:8px;padding:10px 12px;border:1px solid var(--border-2);border-radius:10px;font-size:13px}.arrived[data-v-f0780fac]{display:flex;align-items:center;gap:10px;margin-bottom:8px;font-size:13px}.note[data-v-f0780fac]{display:flex;flex-direction:column;gap:4px;margin-bottom:12px;font-size:13px}.standing[data-v-f0780fac],.release[data-v-f0780fac]{display:flex;align-items:baseline;gap:10px;font-size:13px}.line[data-v-f0780fac],.title[data-v-f0780fac]{flex:1}.heading[data-v-f0780fac]{margin:12px 0 6px;color:var(--text-3);font-size:12px;font-weight:600}.detail[data-v-f0780fac]{color:var(--text-3);font-size:12px}button[data-v-f0780fac]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { computed as v, ref as _, watch as B, openBlock as i, createBlock as R, unref as a, withCtx as f, createElementBlock as u, createCommentVNode as p, createElementVNode as l, createVNode as m, createTextVNode as N, toDisplayString as d, Fragment as I, renderList as P } from "vue";
import { useWindow as V, WindowRoom as W, Btn as D, RowList as E, TextDisplay as $ } from "@journal/window-kit";
const j = (h, o) => {
  const r = h.__vccOpts || h;
  for (const [c, n] of o)
    r[c] = n;
  return r;
}, q = {
  key: 0,
  class: "cover",
  role: "status",
  "data-update-cover": ""
}, O = {
  key: 1,
  class: "arrived",
  role: "status",
  "data-update-arrived": ""
}, z = {
  key: 2,
  class: "failure"
}, A = { class: "standing" }, G = { class: "line" }, H = { class: "releases" }, J = ["data-row"], K = { class: "title" }, M = { class: "detail" }, Q = {
  key: 3,
  class: "detail",
  "data-update-notes-failure": ""
}, X = { class: "release" }, Y = { class: "title" }, Z = { class: "detail" }, ee = {
  __name: "UpdatesPanel",
  setup(h) {
    const o = V(), r = o.props.releases, { failure: c } = o.props.standing, n = v(() => c.value ? null : o.props.standing.data.value), g = _(!1), w = _(!1), F = v(() => {
      var t, s, e;
      return w.value && ((t = n.value) == null ? void 0 : t.is_current) && ((e = (s = n.value) == null ? void 0 : s.installation) == null ? void 0 : e.step) === "finished";
    }), k = _([]), y = _(1), L = v(() => {
      var t;
      return ((t = o.props.notes.data.value) == null ? void 0 : t.is_last_page) ?? !0;
    }), { failure: b } = o.props.notes;
    B(() => o.props.notes.data.value, (t) => {
      t && (k.value = y.value === 1 ? t.notes : [...k.value, ...t.notes]);
    });
    const S = v(() => n.value ? n.value.line : c.value ? "Release unavailable" : "Checking for a newer release");
    async function x() {
      await o.reload("standing");
    }
    async function C() {
      g.value = !0;
      const t = await r.act(["update", "install"]);
      g.value = !1, t.ok && (await x(), w.value = !0);
    }
    async function T(t) {
      y.value = t, o.state["notes.page"] = String(t), await o.reload("notes");
    }
    const U = () => globalThis.location.reload();
    return (t, s) => (i(), R(a(W), null, {
      default: f(() => [
        g.value ? (i(), u("div", q, "Updating the journal. This takes a short while.")) : p("", !0),
        F.value ? (i(), u("div", O, [
          s[2] || (s[2] = l("span", { class: "line" }, "The update is installed. Reload the page to see it.", -1)),
          m(a(D), {
            small: "",
            variant: "primary",
            "data-update-reload": "",
            onClick: U
          }, {
            default: f(() => [...s[1] || (s[1] = [
              N("Reload", -1)
            ])]),
            _: 1
          })
        ])) : p("", !0),
        a(c) || a(r).actionFailure.value ? (i(), u("p", z, d(a(c) || a(r).actionFailure.value), 1)) : p("", !0),
        l("div", A, [
          l("span", G, d(S.value), 1),
          l("button", {
            type: "button",
            onClick: x
          }, "Check again"),
          n.value && !n.value.is_current ? (i(), R(a(D), {
            key: 0,
            small: "",
            variant: "primary",
            "data-update-install": "",
            onClick: C
          }, {
            default: f(() => {
              var e;
              return [
                N(d(((e = n.value.installation) == null ? void 0 : e.step) === "failed" ? "Retry update" : n.value.tag ? `Update to ${n.value.tag}` : "Update to the latest"), 1)
              ];
            }),
            _: 1
          })) : n.value ? (i(), u("button", {
            key: 1,
            type: "button",
            "data-update-force": "",
            onClick: C
          }, "Install it again")) : p("", !0)
        ]),
        s[3] || (s[3] = l("h3", { class: "heading" }, "Installed releases", -1)),
        l("div", H, [
          m(a(E), {
            rows: a(r).rows.value,
            failure: a(r).failure.value,
            loaded: a(r).loaded.value,
            empty: "No installation history yet",
            hint: "Installed releases appear here with their installation dates."
          }, {
            default: f(({ row: e }) => [
              l("div", {
                class: "release",
                "data-row": e.id
              }, [
                l("span", K, d(e.tag || e.checksum.slice(0, 12)), 1),
                l("span", M, d(new Date(e.created_at).toLocaleString()), 1)
              ], 8, J)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ]),
        s[4] || (s[4] = l("h3", { class: "heading" }, "What changed", -1)),
        a(b) ? (i(), u("p", Q, d(a(b)), 1)) : p("", !0),
        (i(!0), u(I, null, P(k.value, (e) => (i(), u("article", {
          key: e.tag,
          class: "note",
          "data-update-note": ""
        }, [
          l("div", X, [
            l("span", Y, d(e.tag), 1),
            l("span", Z, d(new Date(e.published_at).toLocaleDateString()), 1)
          ]),
          m(a($), {
            text: e.text
          }, null, 8, ["text"])
        ]))), 128)),
        L.value ? p("", !0) : (i(), u("button", {
          key: 4,
          type: "button",
          "data-update-older": "",
          onClick: s[0] || (s[0] = (e) => T(y.value + 1))
        }, "Show older releases"))
      ]),
      _: 1
    }));
  }
}, se = /* @__PURE__ */ j(ee, [["__scopeId", "data-v-f0780fac"]]);
export {
  se as default
};
