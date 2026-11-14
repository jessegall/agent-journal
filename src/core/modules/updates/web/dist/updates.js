if (!document.getElementById("window-styles-bf90dce16127")) { const style = document.createElement("style"); style.id = "window-styles-bf90dce16127"; style.textContent = ".failure[data-v-6c1a87b1]{margin:0;padding:4px var(--inset);color:var(--bad, var(--text-2));font-size:12px}.cover[data-v-6c1a87b1],.arrived[data-v-6c1a87b1],.standing[data-v-6c1a87b1]{display:flex;align-items:center;gap:10px;padding:6px var(--inset);font-size:13px}.line[data-v-6c1a87b1]{flex:1}.detail[data-v-6c1a87b1]{margin:0;padding:4px var(--inset);color:var(--text-3);font-size:12px}button[data-v-6c1a87b1]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { computed as h, ref as d, watch as S, openBlock as o, createBlock as C, unref as n, withCtx as c, createVNode as x, createElementBlock as i, createTextVNode as R, toDisplayString as g, createCommentVNode as p, createElementVNode as _ } from "vue";
import { useWindow as j, ListReaderLayout as E, Reader as O, TextDisplay as q, PageHeader as A, Btn as U, copying as H } from "@journal/window-kit";
const W = (y, a) => {
  const v = y.__vccOpts || y;
  for (const [u, s] of a)
    v[u] = s;
  return v;
}, z = {
  key: 0,
  class: "cover",
  role: "status",
  "data-update-cover": ""
}, G = {
  key: 1,
  class: "arrived",
  role: "status",
  "data-update-arrived": ""
}, J = {
  key: 2,
  class: "failure"
}, K = { class: "standing" }, M = { class: "line" }, Q = {
  key: 3,
  class: "detail",
  "data-update-notes-failure": ""
}, X = {
  key: 4,
  class: "standing"
}, Y = {
  key: 1,
  class: "detail"
}, Z = {
  __name: "UpdatesPanel",
  setup(y) {
    const a = j(), v = a.props.releases, { failure: u } = a.props.standing, s = h(() => u.value ? null : a.props.standing.data.value), k = d(!1), b = d(""), D = d(!1), I = h(() => {
      var e, l, t;
      return D.value && ((e = s.value) == null ? void 0 : e.is_current) && ((t = (l = s.value) == null ? void 0 : l.installation) == null ? void 0 : t.step) === "finished";
    }), m = d([]), w = d(1), P = h(() => {
      var e;
      return ((e = a.props.notes.data.value) == null ? void 0 : e.is_last_page) ?? !0;
    }), { failure: L } = a.props.notes;
    S(() => a.props.notes.data.value, (e) => {
      e && (m.value = w.value === 1 ? e.notes : [...m.value, ...e.notes]);
    });
    const T = h(() => s.value ? s.value.line : u.value ? "Release unavailable" : "Checking for a newer release");
    async function B() {
      await a.reload("standing");
    }
    async function N() {
      k.value = !0;
      const e = await a.run(["update", "install"]);
      b.value = e.ok ? "" : e.error, k.value = !1, await a.reload({ only: e.ok ? ["releases", "standing"] : ["releases"] }), e.ok && (D.value = !0);
    }
    async function V(e) {
      w.value = e, a.state["notes.page"] = String(e), await a.reload("notes");
    }
    const F = () => globalThis.location.reload(), r = d(null), f = h(() => [
      ...m.value.map((e) => ({ id: e.tag, title: e.tag, desc: new Date(e.published_at).toLocaleDateString(), group: "Release notes", note: e })),
      ...v.rows.value.map((e) => ({ id: `installed-${e.id}`, title: e.tag || e.checksum.slice(0, 12), desc: new Date(e.created_at).toLocaleString(), group: "Installed here", installed: e }))
    ]);
    S(() => f.value.length, () => {
      r.value === null && f.value.length && (r.value = f.value[0].id);
    }, { flush: "post" });
    const $ = (e) => ({
      head: e.title,
      items: [
        { label: "Open", group: "open", disabled: e.id === r.value, reason: "Already open", run: () => r.value = e.id },
        { label: "Copy name", group: "copy", run: ({ say: l }) => H(e.title, e.title, l) }
      ]
    });
    return (e, l) => (o(), C(n(E), {
      chosen: r.value,
      "onUpdate:chosen": l[1] || (l[1] = (t) => r.value = t),
      items: f.value,
      "list-width": 320,
      place: $,
      "empty-title": "No releases yet",
      "pick-line": "No release chosen",
      "data-updates": ""
    }, {
      top: c(() => [
        x(n(A), { title: "Updates" }),
        k.value ? (o(), i("div", z, "Updating the journal. This takes a short while.")) : p("", !0),
        I.value ? (o(), i("div", G, [
          l[3] || (l[3] = _("span", { class: "line" }, "The update is installed. Reload the page to see it.", -1)),
          x(n(U), {
            small: "",
            variant: "primary",
            "data-update-reload": "",
            onClick: F
          }, {
            default: c(() => [...l[2] || (l[2] = [
              R("Reload", -1)
            ])]),
            _: 1
          })
        ])) : p("", !0),
        n(u) || b.value ? (o(), i("p", J, g(n(u) || b.value), 1)) : p("", !0),
        _("div", K, [
          _("span", M, g(T.value), 1),
          _("button", {
            type: "button",
            onClick: B
          }, "Check again"),
          s.value && !s.value.is_current ? (o(), C(n(U), {
            key: 0,
            small: "",
            variant: "primary",
            "data-update-install": "",
            onClick: N
          }, {
            default: c(() => {
              var t;
              return [
                R(g(((t = s.value.installation) == null ? void 0 : t.step) === "failed" ? "Retry update" : s.value.tag ? `Update to ${s.value.tag}` : "Update to the latest"), 1)
              ];
            }),
            _: 1
          })) : s.value ? (o(), i("button", {
            key: 1,
            type: "button",
            "data-update-force": "",
            onClick: N
          }, "Install it again")) : p("", !0)
        ]),
        n(L) ? (o(), i("p", Q, g(n(L)), 1)) : p("", !0),
        P.value ? p("", !0) : (o(), i("div", X, [
          _("button", {
            type: "button",
            "data-update-older": "",
            onClick: l[0] || (l[0] = (t) => V(w.value + 1))
          }, "Show older releases")
        ]))
      ]),
      empty: c(() => [
        R(g(n(v).loaded.value ? "Installed releases appear here with their installation dates." : ""), 1)
      ]),
      reader: c(({ item: t }) => [
        x(n(O), {
          title: t.title,
          number: t.note ? "Release notes" : "Installed here",
          facts: t.note ? [{ name: "published", label: "Published", value: new Date(t.note.published_at).toLocaleDateString() }] : [{ name: "installed", label: "Installed", value: new Date(t.installed.created_at).toLocaleString() }],
          "data-update-note": ""
        }, {
          default: c(() => [
            t.note ? (o(), C(n(q), {
              key: 0,
              text: t.note.text
            }, null, 8, ["text"])) : (o(), i("p", Y, "This release was installed on this journal."))
          ]),
          _: 2
        }, 1032, ["title", "number", "facts"])
      ]),
      _: 1
    }, 8, ["chosen", "items"]));
  }
}, ae = /* @__PURE__ */ W(Z, [["__scopeId", "data-v-6c1a87b1"]]);
export {
  ae as default
};
