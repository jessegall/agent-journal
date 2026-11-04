/* @code-commandments-generated */
if (!document.getElementById("window-styles-74adda59bdb2")) { const style = document.createElement("style"); style.id = "window-styles-74adda59bdb2"; style.textContent = ".library[data-v-8bb016b5]{display:flex;flex-direction:column;gap:10px}.library-row[data-v-8bb016b5]{display:flex;align-items:center;gap:10px;padding:6px 0}.library-open[data-v-8bb016b5]{display:flex;flex:1;flex-direction:column;gap:2px;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.library-title[data-v-8bb016b5]{font-weight:600}.library-abstract[data-v-8bb016b5],.library-excerpt[data-v-8bb016b5],.library-facts[data-v-8bb016b5],.library-here[data-v-8bb016b5]{color:var(--text-3);font-size:12px}.library-failure[data-v-8bb016b5],.library-warning[data-v-8bb016b5]{margin:0;color:var(--danger);font-size:13px}.library-fields dt[data-v-8bb016b5]{margin-top:8px;color:var(--text-3);font-size:12px}.library-fields dd[data-v-8bb016b5]{margin:2px 0 0;white-space:pre-wrap}.library-versions[data-v-8bb016b5]{padding:0;list-style:none}.library-versions li[data-v-8bb016b5]{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 0;font-size:13px}.connect[data-v-5b788b3e]{display:flex;flex-direction:column;gap:12px;max-width:420px}.connect-lead[data-v-5b788b3e]{margin:0;color:var(--text-2);font-size:13px}.connect-failure[data-v-5b788b3e]{margin:0;color:var(--danger);font-size:13px}.compare[data-v-2ce13660]{display:flex;flex-direction:column;gap:10px}.compare-help[data-v-2ce13660]{margin:0;color:var(--text-3);font-size:12px}.copy[data-v-b6c3ffbb]{display:flex;flex-direction:column;gap:3px;padding:8px 0}.copy-title[data-v-b6c3ffbb]{font-weight:600}.copy-facts[data-v-b6c3ffbb],.copy-line[data-v-b6c3ffbb]{color:var(--text-3);font-size:12px}.copy-buttons[data-v-b6c3ffbb]{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}.copies[data-v-085c92cb]{display:flex;flex-direction:column;gap:10px}.copies-share[data-v-085c92cb]{display:flex;align-items:flex-end;gap:8px}.copies-list[data-v-085c92cb]{margin:0;padding:0;list-style:none}.copies-failure[data-v-085c92cb]{margin:0;color:var(--danger);font-size:13px}.copies-empty[data-v-085c92cb]{margin:0;color:var(--text-3);font-size:13px}.teams[data-v-dd56d354]{display:flex;flex-direction:column;gap:10px}.teams-top[data-v-dd56d354]{display:flex;align-items:center;justify-content:space-between}.teams-title[data-v-dd56d354]{margin:0;font-size:16px}.teams-header[data-v-dd56d354]{display:flex;flex-wrap:wrap;gap:6px 18px;color:var(--text-2);font-size:13px}.teams-failure[data-v-dd56d354],.teams-stopped[data-v-dd56d354]{margin:0;color:var(--danger);font-size:13px}\n"; document.head.appendChild(style); }
import { ref as R, watch as H, openBlock as a, createElementBlock as i, createVNode as $, unref as t, toDisplayString as u, createCommentVNode as _, createElementVNode as m, withCtx as S, createTextVNode as V, createBlock as T, Fragment as I, renderList as A, withModifiers as z, computed as q, onMounted as te } from "vue";
import { useWindow as E, useRunLine as G, SearchBar as ae, Segmented as Q, Btn as j, RowList as re, TimeAgo as P, SidePanel as X, FormField as U, TextInput as M, DiffCard as le, useReadLine as J, usePoll as se, WindowRoom as ne, SwitchCase as oe } from "@journal/window-kit";
const B = (c, C) => {
  const f = c.__vccOpts || c;
  for (const [r, y] of C)
    f[r] = y;
  return f;
}, ie = {
  class: "library",
  "data-library": ""
}, de = {
  key: 0,
  class: "library-failure",
  role: "alert",
  "data-library-refusal": ""
}, ue = {
  key: 1,
  class: "library-check",
  "data-library-check": ""
}, ce = { "data-library-command": "" }, ye = ["data-library-item"], pe = ["onClick"], me = { class: "library-title" }, ve = {
  key: 0,
  class: "library-excerpt",
  "data-library-excerpt": ""
}, be = {
  key: 1,
  class: "library-abstract"
}, he = { class: "library-facts" }, ke = {
  key: 0,
  class: "library-here",
  "data-library-here": ""
}, fe = { "data-library-panel": "" }, _e = { class: "library-facts" }, ge = {
  class: "library-fields",
  "data-library-fields": ""
}, $e = {
  class: "library-versions",
  "data-library-versions": ""
}, Ce = ["data-library-version"], Se = 300, we = {
  __name: "LibraryBrowse",
  props: { role: { type: String, required: !0 }, canWrite: Boolean },
  emits: ["changed"],
  setup(c, { emit: C }) {
    const f = [
      { key: "", label: "All" },
      { key: "doc", label: "Documents" },
      { key: "sequence", label: "Sequences" },
      { key: "check", label: "Checks" }
    ], r = { doc: "Document", sequence: "Sequence", check: "Check" }, y = E(), o = R(""), l = R(""), h = R([]), p = R(!1), g = R(""), n = R(null), x = R([]), k = R(null), v = C, { refusal: b, run: O } = G(async () => {
      await D(), v("changed");
    });
    let w = 0;
    const L = (d) => `${d.kind}:${d.id}`;
    async function D() {
      const d = l.value.trim(), e = await y.read(`library list${o.value ? ` --kind ${o.value}` : ""}${d ? ` --search ${JSON.stringify(d)}` : ""}`);
      g.value = e.ok ? "" : e.error, h.value = e.ok ? e.value.rows.map((s) => ({ ...s, item_id: s.id, id: L(s) })) : [], p.value = !0;
    }
    async function W(d) {
      const [e, s] = await Promise.all([y.read(`library show ${d.kind} ${d.item_id}`), y.read(`library versions ${d.kind} ${d.item_id}`)]);
      b.value = e.ok ? "" : e.error, n.value = e.ok ? { ...e.value, title: d.title } : null, x.value = s.ok ? s.value.versions : [];
    }
    async function K() {
      const d = n.value;
      await W({ kind: d.kind, item_id: d.id, title: d.title });
    }
    async function Z(d) {
      (await O(["library", "remove", d.kind, String(d.item_id ?? d.id)])).ok && n.value && await K();
    }
    async function F(d, e = null) {
      (await O(["library", "restore", d.kind, String(d.id), ...e ? ["--version", String(e)] : []])).ok && await K();
    }
    async function ee(d) {
      const e = await y.read(`library show check ${d.item_id}`);
      b.value = e.ok ? "" : e.error, k.value = e.ok ? { ...d, command: e.value.fields.command } : null;
    }
    async function Y(d) {
      var e;
      if (d.kind === "check" && ((e = k.value) == null ? void 0 : e.id) !== d.id) return void await ee(d);
      k.value = null, await O(["library", "get", d.kind, String(d.item_id), ...d.kind === "check" ? ["--read"] : []]);
    }
    return H(o, D, { immediate: !0 }), H(l, () => {
      clearTimeout(w), w = setTimeout(D, Se);
    }), (d, e) => (a(), i("div", ie, [
      $(t(ae), {
        modelValue: l.value,
        "onUpdate:modelValue": e[0] || (e[0] = (s) => l.value = s),
        placeholder: "Search the library",
        "data-library-search": ""
      }, null, 8, ["modelValue"]),
      $(t(Q), {
        options: f,
        value: o.value,
        "data-library-kind": "",
        onPick: e[1] || (e[1] = (s) => o.value = s)
      }, null, 8, ["value"]),
      t(b) ? (a(), i("p", de, u(t(b)), 1)) : _("", !0),
      k.value ? (a(), i("div", ue, [
        e[8] || (e[8] = m("p", null, "This check runs this command on your computer when someone starts it:", -1)),
        m("pre", ce, u(k.value.command), 1),
        $(t(j), {
          small: "",
          onClick: e[2] || (e[2] = (s) => k.value = null)
        }, {
          default: S(() => [...e[6] || (e[6] = [
            V("Cancel", -1)
          ])]),
          _: 1
        }),
        $(t(j), {
          small: "",
          kind: "primary",
          "data-library-confirm": "",
          onClick: e[3] || (e[3] = (s) => Y(k.value))
        }, {
          default: S(() => [...e[7] || (e[7] = [
            V("Get the check, stopped", -1)
          ])]),
          _: 1
        })
      ])) : _("", !0),
      $(t(re), {
        rows: h.value,
        failure: g.value,
        loaded: p.value,
        searching: !!(l.value.trim() || o.value),
        empty: "Nothing in the library yet",
        hint: "Shared documents, sequences and checks appear here."
      }, {
        default: S(({ row: s }) => [
          m("div", {
            class: "library-row",
            "data-library-item": s.id
          }, [
            m("button", {
              type: "button",
              class: "library-open",
              "data-library-open": "",
              onClick: (N) => W(s)
            }, [
              m("span", me, u(s.title), 1),
              s.excerpt ? (a(), i("span", ve, u(s.excerpt), 1)) : (a(), i("span", be, u(s.abstract), 1)),
              m("span", he, [
                V(u(r[s.kind]) + ", Version: " + u(s.version) + ", Changed by: " + u(s.updated_by) + ", ", 1),
                $(t(P), {
                  at: s.updated_at
                }, null, 8, ["at"])
              ])
            ], 8, pe),
            s.copy_id ? (a(), i("span", ke, "On this journal")) : (a(), T(t(j), {
              key: 1,
              small: "",
              kind: "primary",
              "data-library-get": "",
              onClick: (N) => Y(s)
            }, {
              default: S(() => [...e[9] || (e[9] = [
                V("Get", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])),
            c.role === "admin" ? (a(), T(t(j), {
              key: 2,
              small: "",
              kind: "danger",
              "data-library-remove": "",
              onClick: (N) => Z(s)
            }, {
              default: S(() => [...e[10] || (e[10] = [
                V("Remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])) : _("", !0)
          ], 8, ye)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "searching"]),
      n.value ? (a(), T(t(X), {
        key: 2,
        title: n.value.title,
        onClose: e[5] || (e[5] = (s) => n.value = null)
      }, {
        default: S(() => [
          m("div", fe, [
            n.value.removed_at ? (a(), i(I, { key: 0 }, [
              e[12] || (e[12] = m("p", {
                class: "library-removed",
                "data-library-removed": ""
              }, "Removed from the library", -1)),
              c.role === "admin" ? (a(), T(t(j), {
                key: 0,
                small: "",
                kind: "primary",
                "data-library-restore": "",
                onClick: e[4] || (e[4] = (s) => F(n.value))
              }, {
                default: S(() => [...e[11] || (e[11] = [
                  V("Restore", -1)
                ])]),
                _: 1
              })) : _("", !0)
            ], 64)) : _("", !0),
            m("p", _e, u(r[n.value.kind]) + ", Version: " + u(n.value.version) + ", Changed by: " + u(n.value.updated_by), 1),
            m("dl", ge, [
              (a(!0), i(I, null, A(n.value.fields, (s, N) => (a(), i(I, { key: N }, [
                m("dt", null, u(N), 1),
                m("dd", null, u(s), 1)
              ], 64))), 128))
            ]),
            e[14] || (e[14] = m("h3", { class: "library-heading" }, "Versions", -1)),
            m("ul", $e, [
              (a(!0), i(I, null, A(x.value, (s) => (a(), i("li", {
                key: s.version,
                "data-library-version": s.version
              }, [
                m("span", null, [
                  V("Version: " + u(s.version) + ", Changed by: " + u(s.user) + ", ", 1),
                  $(t(P), {
                    at: s.created_at
                  }, null, 8, ["at"])
                ]),
                c.canWrite && s.version !== n.value.version ? (a(), T(t(j), {
                  key: 0,
                  small: "",
                  "data-library-restore-version": "",
                  onClick: (N) => F(n.value, s.version)
                }, {
                  default: S(() => [...e[13] || (e[13] = [
                    V("Restore this version", -1)
                  ])]),
                  _: 1
                }, 8, ["onClick"])) : _("", !0)
              ], 8, Ce))), 128))
            ])
          ])
        ]),
        _: 1
      }, 8, ["title"])) : _("", !0)
    ]));
  }
}, xe = /* @__PURE__ */ B(we, [["__scopeId", "data-v-8bb016b5"]]), Le = {
  key: 0,
  class: "connect-failure",
  role: "alert",
  "data-library-refusal": ""
}, Re = {
  __name: "LibraryConnect",
  props: { address: { type: String, default: "" } },
  emits: ["connected"],
  setup(c, { emit: C }) {
    const f = c, r = C, y = E(), o = R(f.address), l = R(""), h = R(""), p = R(!1);
    async function g() {
      p.value = !0;
      const n = await y.run(["library", "connect", ...o.value.trim() ? [o.value.trim()] : [], "--token", l.value.trim()]);
      p.value = !1, h.value = n.ok ? "" : n.error, n.ok && (l.value = "", r("connected"));
    }
    return (n, x) => (a(), i("form", {
      class: "connect",
      "data-library-connect": "",
      onSubmit: z(g, ["prevent"])
    }, [
      x[3] || (x[3] = m("p", { class: "connect-lead" }, "Connect this journal to your team's shared server to read and share documents, sequences and checks.", -1)),
      $(t(U), {
        label: "Address",
        for: "library-address",
        help: "An IP address or a web address, such as 10.0.0.5 or https://library.example.com."
      }, {
        default: S(() => [
          $(t(M), {
            id: "library-address",
            modelValue: o.value,
            "onUpdate:modelValue": x[0] || (x[0] = (k) => o.value = k),
            placeholder: "library.example.com",
            "data-library-address": ""
          }, null, 8, ["modelValue"])
        ]),
        _: 1
      }),
      $(t(U), {
        label: "Token",
        for: "library-token",
        help: "The token an admin of the server gave you. It is stored outside the project."
      }, {
        default: S(() => [
          $(t(M), {
            id: "library-token",
            modelValue: l.value,
            "onUpdate:modelValue": x[1] || (x[1] = (k) => l.value = k),
            type: "password",
            autocomplete: "off",
            placeholder: "jsl_...",
            "data-library-token": ""
          }, null, 8, ["modelValue"])
        ]),
        _: 1
      }),
      h.value ? (a(), i("p", Le, u(h.value), 1)) : _("", !0),
      $(t(j), {
        kind: "primary",
        busy: p.value,
        disabled: !l.value.trim(),
        "data-library-submit": "",
        onClick: g
      }, {
        default: S(() => [...x[2] || (x[2] = [
          V("Connect", -1)
        ])]),
        _: 1
      }, 8, ["busy", "disabled"])
    ], 32));
  }
}, Oe = /* @__PURE__ */ B(Re, [["__scopeId", "data-v-5b788b3e"]]);
function Ve(c, C) {
  const f = c === "" ? [] : c.split(`
`), r = C === "" ? [] : C.split(`
`), y = Array.from({ length: f.length + 1 }, () => new Array(r.length + 1).fill(0));
  for (let p = f.length - 1; p >= 0; p--)
    for (let g = r.length - 1; g >= 0; g--)
      y[p][g] = f[p] === r[g] ? y[p + 1][g + 1] + 1 : Math.max(y[p + 1][g], y[p][g + 1]);
  const o = [];
  let l = 0, h = 0;
  for (; l < f.length || h < r.length; )
    l < f.length && h < r.length && f[l] === r[h] ? o.push({ line_type: "ctx", line: h + 1, text: r[h++] }) && l++ : h < r.length && (l === f.length || y[l][h + 1] >= y[l + 1][h]) ? o.push({ line_type: "add", line: h + 1, text: r[h++] }) : o.push({ line_type: "del", line: null, text: f[l++] });
  return { rows: o, added: o.filter((p) => p.line_type === "add").length, removed: o.filter((p) => p.line_type === "del").length };
}
const Te = {
  class: "compare",
  "data-library-compare": ""
}, Ie = {
  key: 0,
  "data-library-same": ""
}, je = {
  __name: "CopyCompare",
  props: { here: { type: Object, required: !0 }, library: { type: Object, required: !0 }, at: { type: String, required: !0 } },
  setup(c) {
    const C = c, f = q(
      () => Object.keys({ ...C.here, ...C.library }).map((r) => ({ name: r, ...Ve(String(C.here[r] ?? ""), String(C.library[r] ?? "")) })).filter((r) => r.added || r.removed)
    );
    return (r, y) => (a(), i("div", Te, [
      y[0] || (y[0] = m("p", { class: "compare-help" }, "Red lines are only on this journal. Green lines are only in the library.", -1)),
      f.value.length ? _("", !0) : (a(), i("p", Ie, "The two versions have the same text.")),
      (a(!0), i(I, null, A(f.value, (o) => (a(), T(t(le), {
        key: o.name,
        path: o.name,
        kind: "edit",
        added: o.added,
        removed: o.removed,
        at: c.at,
        rows: o.rows,
        "data-library-diff": ""
      }, null, 8, ["path", "added", "removed", "at", "rows"]))), 128))
    ]));
  }
}, qe = /* @__PURE__ */ B(je, [["__scopeId", "data-v-2ce13660"]]), De = ["data-library-copy", "data-status"], Ne = { class: "copy-title" }, Ae = {
  class: "copy-facts",
  "data-copy-facts": ""
}, Be = { class: "copy-buttons" }, We = {
  __name: "LibraryCopyRow",
  props: { copy: { type: Object, required: !0 }, role: { type: String, required: !0 } },
  emits: ["choose"],
  setup(c, { emit: C }) {
    const f = { doc: "Document", sequence: "Sequence", check: "Check" }, r = {
      compare: "Compare",
      read: "Read",
      mine: "Keep mine",
      library: "Use the library's version",
      leave: "Stop following"
    }, y = {
      synced: ["leave"],
      sending: [],
      unsent: [],
      paused: [],
      denied: ["compare", "library"],
      rejected: ["compare"],
      conflict: ["compare", "mine", "library"],
      review: ["read", "library", "leave"],
      removed: ["leave"]
    }, o = { admin: "Admin", edit: "Edit", read: "Read-only" }, l = c, h = C, p = q(() => y[l.copy.status].map((n) => ({ key: n, label: r[n] }))), g = q(() => {
      const n = [];
      return l.copy.status === "denied" && n.push(`Role: ${o[l.role]}`), l.copy.status === "denied" && l.copy.server_version > l.copy.version && n.push("A newer version is in the library"), l.copy.status === "removed" && n.push("Your copy stays on this journal."), l.copy.note && n.push(l.copy.note), n;
    });
    return (n, x) => (a(), i("li", {
      class: "copy",
      "data-library-copy": c.copy.copy_id,
      "data-status": c.copy.status
    }, [
      m("span", Ne, u(f[c.copy.share]) + " " + u(c.copy.row_id) + ", " + u(c.copy.local_fields.title), 1),
      m("span", Ae, "Status: " + u(c.copy.label) + ", Version: " + u(c.copy.version), 1),
      (a(!0), i(I, null, A(g.value, (k) => (a(), i("span", {
        key: k,
        class: "copy-line",
        "data-copy-line": ""
      }, u(k), 1))), 128)),
      m("span", Be, [
        (a(!0), i(I, null, A(p.value, (k) => (a(), T(t(j), {
          key: k.key,
          small: "",
          kind: k.key === "library" ? "primary" : void 0,
          "data-copy-button": k.key,
          onClick: (v) => h("choose", c.copy, k.key)
        }, {
          default: S(() => [
            V(u(k.label), 1)
          ]),
          _: 2
        }, 1032, ["kind", "data-copy-button", "onClick"]))), 128))
      ])
    ], 8, De));
  }
}, Ee = /* @__PURE__ */ B(We, [["__scopeId", "data-v-b6c3ffbb"]]), Pe = {
  class: "copies",
  "data-library-copies": ""
}, Ue = {
  class: "copies-shared",
  "data-library-shared": ""
}, Me = {
  key: 0,
  class: "copies-failure",
  role: "alert",
  "data-library-warning": ""
}, Ge = {
  key: 2,
  class: "copies-failure",
  role: "alert",
  "data-library-refusal": ""
}, Ke = {
  key: 3,
  class: "copies-empty",
  "data-library-no-copies": ""
}, Fe = { class: "copies-list" }, Ye = { "data-library-compare-panel": "" }, He = {
  __name: "LibraryCopies",
  props: { copies: { type: Array, required: !0 }, role: { type: String, required: !0 }, canWrite: Boolean },
  emits: ["changed"],
  setup(c, { emit: C }) {
    const f = C, r = E(), y = R(""), o = R(null), l = R(null), { refusal: h, run: p } = G(async () => f("changed"));
    async function g(v) {
      if (Object.keys(v.server_fields).length) return v.server_fields;
      const b = await r.read(`library show ${v.share} ${v.item_id}`);
      return h.value = b.ok ? "" : b.error, b.ok ? b.value.fields : null;
    }
    async function n(v) {
      const b = await g(v);
      l.value = b ? { copy: v, there: b } : null;
    }
    const x = {
      compare: n,
      read: n,
      mine: (v) => p(["library", "resolve", String(v.copy_id), "--keep", "mine"]),
      library: (v) => p(["library", "resolve", String(v.copy_id), "--keep", "library"]),
      leave: (v) => p(["library", "leave", String(v.copy_id)])
    };
    async function k() {
      const [v, b, ...O] = y.value.trim().split(/\s+/);
      if (!v || !/^\d+$/.test(b ?? "") || O.length) return void (h.value = "Write the kind and the number, such as doc 63.");
      const w = await p(["library", "share", v, b]);
      o.value = w.ok ? w.value : null, w.ok && (y.value = "");
    }
    return (v, b) => (a(), i("div", Pe, [
      c.canWrite ? (a(), i("form", {
        key: 0,
        class: "copies-share",
        "data-library-share": "",
        onSubmit: z(k, ["prevent"])
      }, [
        $(t(U), {
          label: "Share with the team",
          for: "library-share",
          help: "The kind and the number of the item on this journal, such as doc 63."
        }, {
          default: S(() => [
            $(t(M), {
              id: "library-share",
              modelValue: y.value,
              "onUpdate:modelValue": b[0] || (b[0] = (O) => y.value = O),
              placeholder: "doc 63",
              "data-library-share-field": ""
            }, null, 8, ["modelValue"])
          ]),
          _: 1
        }),
        $(t(j), {
          kind: "primary",
          disabled: !y.value.trim(),
          "data-library-share-submit": "",
          onClick: k
        }, {
          default: S(() => [...b[3] || (b[3] = [
            V("Share", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : _("", !0),
      o.value ? (a(), i(I, { key: 1 }, [
        m("p", Ue, u(o.value.line), 1),
        o.value.warning ? (a(), i("p", Me, u(o.value.warning), 1)) : _("", !0)
      ], 64)) : _("", !0),
      t(h) ? (a(), i("p", Ge, u(t(h)), 1)) : _("", !0),
      c.copies.length ? _("", !0) : (a(), i("p", Ke, "No item on this journal follows an item of the library. Get one from the Library tab.")),
      m("ul", Fe, [
        (a(!0), i(I, null, A(c.copies, (O) => (a(), T(Ee, {
          key: O.copy_id,
          copy: O,
          role: c.role,
          onChoose: b[1] || (b[1] = (w, L) => x[L](w))
        }, null, 8, ["copy", "role"]))), 128))
      ]),
      l.value ? (a(), T(t(X), {
        key: 4,
        title: `Compare: ${l.value.copy.local_fields.title}`,
        onClose: b[2] || (b[2] = (O) => l.value = null)
      }, {
        default: S(() => [
          m("div", Ye, [
            $(qe, {
              here: l.value.copy.local_fields,
              library: l.value.there,
              at: (/* @__PURE__ */ new Date()).toISOString()
            }, null, 8, ["here", "library", "at"])
          ])
        ]),
        _: 1
      }, 8, ["title"])) : _("", !0)
    ]));
  }
}, Je = /* @__PURE__ */ B(He, [["__scopeId", "data-v-085c92cb"]]), ze = {
  class: "teams",
  "data-teams": ""
}, Qe = { class: "teams-top" }, Xe = {
  key: 0,
  class: "teams-failure",
  role: "alert",
  "data-teams-failure": ""
}, Ze = {
  key: 1,
  class: "teams-failure",
  role: "alert",
  "data-teams-refusal": ""
}, et = {
  class: "teams-header",
  "data-teams-header": ""
}, tt = { "data-teams-server": "" }, at = { "data-teams-role": "" }, rt = {
  key: 0,
  "data-teams-reached": ""
}, lt = {
  key: 1,
  "data-teams-plain": ""
}, st = {
  key: 0,
  class: "teams-stopped",
  role: "alert",
  "data-teams-stopped": ""
}, nt = 5e3, ot = {
  __name: "TeamsPage",
  setup(c) {
    const C = { admin: "Admin", edit: "Edit", read: "Read-only" }, f = E(), { value: r, failure: y, load: o } = J(() => "library status"), { value: l, load: h } = J(() => "library copies"), p = R("library"), g = q(() => {
      var w;
      return !!((w = r.value) != null && w.is_connected) && !r.value.stopped;
    }), n = q(() => {
      var w, L;
      return ((w = r.value) == null ? void 0 : w.role) === "admin" || ((L = r.value) == null ? void 0 : L.role) === "edit";
    }), x = q(() => {
      var w;
      return ((w = l.value) == null ? void 0 : w.rows) ?? [];
    }), k = q(() => [
      { key: "library", label: "Library" },
      { key: "copies", label: "On this journal", count: x.value.length }
    ]);
    async function v() {
      await Promise.all([o(), h()]);
    }
    const { refusal: b, run: O } = G(v);
    return se(v, () => !0, nt), te(() => f.follow(["library_copy.*"], v)), (w, L) => (a(), T(t(ne), null, {
      default: S(() => {
        var D;
        return [
          m("div", ze, [
            m("div", Qe, [
              L[3] || (L[3] = m("h2", { class: "teams-title" }, "Teams", -1)),
              g.value ? (a(), T(t(j), {
                key: 0,
                small: "",
                "data-teams-sync": "",
                onClick: L[0] || (L[0] = (W) => t(O)(["library", "sync"]))
              }, {
                default: S(() => [...L[2] || (L[2] = [
                  V("Sync now", -1)
                ])]),
                _: 1
              })) : _("", !0)
            ]),
            t(y) ? (a(), i("p", Xe, u(t(y)), 1)) : _("", !0),
            t(b) ? (a(), i("p", Ze, u(t(b)), 1)) : _("", !0),
            (D = t(r)) != null && D.is_connected ? (a(), i(I, { key: 2 }, [
              m("div", et, [
                m("span", tt, "Connected: " + u(t(r).server_name), 1),
                m("span", at, "Role: " + u(C[t(r).role]), 1),
                t(r).reached_at ? (a(), i("span", rt, [
                  L[4] || (L[4] = V("Last reached: ", -1)),
                  $(t(P), {
                    at: t(r).reached_at
                  }, null, 8, ["at"])
                ])) : _("", !0),
                t(r).is_encrypted ? _("", !0) : (a(), i("span", lt, "Connection: not encrypted"))
              ]),
              t(r).stopped ? (a(), i("p", st, u(t(r).stopped), 1)) : _("", !0)
            ], 64)) : _("", !0),
            t(r) && !g.value ? (a(), T(Oe, {
              key: 3,
              address: t(r).address,
              onConnected: v
            }, null, 8, ["address"])) : _("", !0),
            g.value ? (a(), i(I, { key: 4 }, [
              $(t(Q), {
                options: k.value,
                value: p.value,
                "data-teams-tabs": "",
                onPick: L[1] || (L[1] = (W) => p.value = W)
              }, null, 8, ["options", "value"]),
              $(t(oe), { value: p.value }, {
                library: S(() => [
                  $(xe, {
                    role: t(r).role,
                    "can-write": n.value,
                    onChanged: v
                  }, null, 8, ["role", "can-write"])
                ]),
                copies: S(() => [
                  $(Je, {
                    copies: x.value,
                    role: t(r).role,
                    "can-write": n.value,
                    onChanged: v
                  }, null, 8, ["copies", "role", "can-write"])
                ]),
                _: 1
              }, 8, ["value"])
            ], 64)) : _("", !0)
          ])
        ];
      }),
      _: 1
    }));
  }
}, ut = /* @__PURE__ */ B(ot, [["__scopeId", "data-v-dd56d354"]]);
export {
  ut as default
};
