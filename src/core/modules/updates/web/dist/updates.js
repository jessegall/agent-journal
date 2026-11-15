if (!document.getElementById("window-styles-8d45be9f5618")) { const style = document.createElement("style"); style.id = "window-styles-8d45be9f5618"; style.textContent = ".failure[data-v-c29664d4]{margin:0;padding:4px var(--inset);color:var(--bad, var(--text-2));font-size:12px}.cover[data-v-c29664d4],.arrived[data-v-c29664d4],.standing[data-v-c29664d4]{display:flex;align-items:center;gap:10px;padding:6px var(--inset);font-size:13px}.line[data-v-c29664d4]{flex:1}.detail[data-v-c29664d4]{margin:0;padding:4px var(--inset);color:var(--text-3);font-size:12px}button[data-v-c29664d4]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { computed as h, ref as d, watch as N, openBlock as n, createBlock as f, unref as o, withCtx as c, createVNode as x, createElementBlock as i, Fragment as j, createTextVNode as R, createCommentVNode as p, createElementVNode as g, toDisplayString as k } from "vue";
import { useWindow as E, ListReaderLayout as O, Reader as q, TextDisplay as A, Skeleton as H, PageHeader as W, Btn as U, copying as z } from "@journal/window-kit";
const G = (y, a) => {
  const v = y.__vccOpts || y;
  for (const [r, s] of a)
    v[r] = s;
  return v;
}, J = {
  key: 0,
  class: "cover",
  role: "status",
  "data-update-cover": ""
}, K = {
  key: 1,
  class: "arrived",
  role: "status",
  "data-update-arrived": ""
}, M = {
  key: 2,
  class: "failure"
}, Q = { class: "standing" }, X = { class: "line" }, Y = {
  key: 3,
  class: "detail",
  "data-update-notes-failure": ""
}, Z = {
  key: 4,
  class: "standing"
}, ee = {
  key: 1,
  class: "detail"
}, te = {
  __name: "UpdatesPanel",
  setup(y) {
    const a = E(), v = a.props.releases, { failure: r } = a.props.standing, s = h(() => r.value ? null : a.props.standing.data.value), m = d(!1), b = d(""), D = d(!1), I = h(() => {
      var e, l, t;
      return D.value && ((e = s.value) == null ? void 0 : e.is_current) && ((t = (l = s.value) == null ? void 0 : l.installation) == null ? void 0 : t.step) === "finished";
    }), w = d([]), C = d(1), P = h(() => {
      var e;
      return ((e = a.props.notes.data.value) == null ? void 0 : e.is_last_page) ?? !0;
    }), { failure: S } = a.props.notes;
    N(() => a.props.notes.data.value, (e) => {
      e && (w.value = C.value === 1 ? e.notes : [...w.value, ...e.notes]);
    });
    const T = h(() => s.value ? s.value.line : r.value ? "Release unavailable" : "Checking for a newer release");
    async function B() {
      await a.reload("standing");
    }
    async function L() {
      m.value = !0;
      const e = await a.run(["update", "install"]);
      b.value = e.ok ? "" : e.error, m.value = !1, await a.reload({ only: e.ok ? ["releases", "standing"] : ["releases"] }), e.ok && (D.value = !0);
    }
    async function F(e) {
      C.value = e, a.state["notes.page"] = String(e), await a.reload("notes");
    }
    const V = () => globalThis.location.reload(), u = d(null), _ = h(() => [
      ...w.value.map((e) => ({ id: e.tag, title: e.tag, desc: new Date(e.published_at).toLocaleDateString(), group: "Release notes", note: e })),
      ...v.rows.value.map((e) => ({ id: `installed-${e.id}`, title: e.tag || e.checksum.slice(0, 12), desc: new Date(e.created_at).toLocaleString(), group: "Installed here", installed: e }))
    ]);
    N(() => _.value.length, () => {
      u.value === null && _.value.length && (u.value = _.value[0].id);
    }, { flush: "post" });
    const $ = (e) => ({
      head: e.title,
      items: [
        { label: "Open", group: "open", disabled: e.id === u.value, reason: "Already open", run: () => u.value = e.id },
        { label: "Copy name", group: "copy", run: ({ say: l }) => z(e.title, e.title, l) }
      ]
    });
    return (e, l) => (n(), f(o(O), {
      chosen: u.value,
      "onUpdate:chosen": l[1] || (l[1] = (t) => u.value = t),
      items: _.value,
      "list-width": 320,
      place: $,
      "empty-title": "No releases yet",
      "pick-line": "No release chosen",
      "data-updates": ""
    }, {
      top: c(() => [
        x(o(W), { title: "Updates" }),
        m.value ? (n(), i("div", J, "Updating the journal. This takes a short while.")) : p("", !0),
        I.value ? (n(), i("div", K, [
          l[3] || (l[3] = g("span", { class: "line" }, "The update is installed. Reload the page to see it.", -1)),
          x(o(U), {
            small: "",
            variant: "primary",
            "data-update-reload": "",
            onClick: V
          }, {
            default: c(() => [...l[2] || (l[2] = [
              R("Reload", -1)
            ])]),
            _: 1
          })
        ])) : p("", !0),
        o(r) || b.value ? (n(), i("p", M, k(o(r) || b.value), 1)) : p("", !0),
        g("div", Q, [
          g("span", X, k(T.value), 1),
          g("button", {
            type: "button",
            onClick: B
          }, "Check again"),
          s.value && !s.value.is_current ? (n(), f(o(U), {
            key: 0,
            small: "",
            variant: "primary",
            "data-update-install": "",
            onClick: L
          }, {
            default: c(() => {
              var t;
              return [
                R(k(((t = s.value.installation) == null ? void 0 : t.step) === "failed" ? "Retry update" : s.value.tag ? `Update to ${s.value.tag}` : "Update to the latest"), 1)
              ];
            }),
            _: 1
          })) : s.value ? (n(), i("button", {
            key: 1,
            type: "button",
            "data-update-force": "",
            onClick: L
          }, "Install it again")) : p("", !0)
        ]),
        o(S) ? (n(), i("p", Y, k(o(S)), 1)) : p("", !0),
        P.value ? p("", !0) : (n(), i("div", Z, [
          g("button", {
            type: "button",
            "data-update-older": "",
            onClick: l[0] || (l[0] = (t) => F(C.value + 1))
          }, "Show older releases")
        ]))
      ]),
      empty: c(() => [
        o(v).loaded.value ? (n(), i(j, { key: 0 }, [
          R("Installed releases appear here with their installation dates.")
        ], 64)) : (n(), f(o(H), {
          key: 1,
          shape: "rows"
        }))
      ]),
      reader: c(({ item: t }) => [
        x(o(q), {
          title: t.title,
          number: t.note ? "Release notes" : "Installed here",
          facts: t.note ? [{ name: "published", label: "Published", value: new Date(t.note.published_at).toLocaleDateString() }] : [{ name: "installed", label: "Installed", value: new Date(t.installed.created_at).toLocaleString() }],
          "data-update-note": ""
        }, {
          default: c(() => [
            t.note ? (n(), f(o(A), {
              key: 0,
              text: t.note.text
            }, null, 8, ["text"])) : (n(), i("p", ee, "This release was installed on this journal."))
          ]),
          _: 2
        }, 1032, ["title", "number", "facts"])
      ]),
      _: 1
    }, 8, ["chosen", "items"]));
  }
}, se = /* @__PURE__ */ G(te, [["__scopeId", "data-v-c29664d4"]]);
export {
  se as default
};
