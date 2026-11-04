/* @code-commandments-generated */
if (!document.getElementById("window-styles-f40377b778c6")) { const style = document.createElement("style"); style.id = "window-styles-f40377b778c6"; style.textContent = ".library[data-v-8bb016b5]{display:flex;flex-direction:column;gap:10px}.library-row[data-v-8bb016b5]{display:flex;align-items:center;gap:10px;padding:6px 0}.library-open[data-v-8bb016b5]{display:flex;flex:1;flex-direction:column;gap:2px;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.library-title[data-v-8bb016b5]{font-weight:600}.library-abstract[data-v-8bb016b5],.library-excerpt[data-v-8bb016b5],.library-facts[data-v-8bb016b5],.library-here[data-v-8bb016b5]{color:var(--text-3);font-size:12px}.library-failure[data-v-8bb016b5],.library-warning[data-v-8bb016b5]{margin:0;color:var(--danger);font-size:13px}.library-fields dt[data-v-8bb016b5]{margin-top:8px;color:var(--text-3);font-size:12px}.library-fields dd[data-v-8bb016b5]{margin:2px 0 0;white-space:pre-wrap}.library-versions[data-v-8bb016b5]{padding:0;list-style:none}.library-versions li[data-v-8bb016b5]{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 0;font-size:13px}.connect[data-v-5b788b3e]{display:flex;flex-direction:column;gap:12px;max-width:420px}.connect-lead[data-v-5b788b3e]{margin:0;color:var(--text-2);font-size:13px}.connect-failure[data-v-5b788b3e]{margin:0;color:var(--danger);font-size:13px}.compare[data-v-2ce13660]{display:flex;flex-direction:column;gap:10px}.compare-help[data-v-2ce13660]{margin:0;color:var(--text-3);font-size:12px}.copy[data-v-a32a6821]{display:flex;flex-direction:column;gap:3px;padding:8px 0}.copy-title[data-v-a32a6821]{font-weight:600}.copy-facts[data-v-a32a6821],.copy-line[data-v-a32a6821]{color:var(--text-3);font-size:12px}.copy-buttons[data-v-a32a6821]{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}.copies[data-v-e96ade2f]{display:flex;flex-direction:column;gap:10px}.copies-share[data-v-e96ade2f]{display:flex;align-items:flex-end;gap:8px}.copies-list[data-v-e96ade2f]{margin:0;padding:0;list-style:none}.copies-failure[data-v-e96ade2f]{margin:0;color:var(--danger);font-size:13px}.copies-empty[data-v-e96ade2f]{margin:0;color:var(--text-3);font-size:13px}.teams[data-v-dd56d354]{display:flex;flex-direction:column;gap:10px}.teams-top[data-v-dd56d354]{display:flex;align-items:center;justify-content:space-between}.teams-title[data-v-dd56d354]{margin:0;font-size:16px}.teams-header[data-v-dd56d354]{display:flex;flex-wrap:wrap;gap:6px 18px;color:var(--text-2);font-size:13px}.teams-failure[data-v-dd56d354],.teams-stopped[data-v-dd56d354]{margin:0;color:var(--danger);font-size:13px}\n"; document.head.appendChild(style); }
import { ref as R, watch as H, openBlock as a, createElementBlock as i, createVNode as $, unref as t, toDisplayString as u, createCommentVNode as _, createElementVNode as v, withCtx as S, createTextVNode as V, createBlock as T, Fragment as I, renderList as N, withModifiers as z, computed as q, onMounted as te } from "vue";
import { useWindow as E, useRunLine as G, SearchBar as ae, Segmented as Q, Btn as j, RowList as re, TimeAgo as P, SidePanel as X, FormField as U, TextInput as M, DiffCard as le, useReadLine as J, usePoll as ne, WindowRoom as se, SwitchCase as oe } from "@journal/window-kit";
const B = (c, C) => {
  const f = c.__vccOpts || c;
  for (const [r, p] of C)
    f[r] = p;
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
    ], r = { doc: "Document", sequence: "Sequence", check: "Check" }, p = E(), o = R(""), l = R(""), h = R([]), y = R(!1), g = R(""), s = R(null), x = R([]), k = R(null), m = C, { refusal: b, run: O } = G(async () => {
      await A(), m("changed");
    });
    let w = 0;
    const L = (d) => `${d.kind}:${d.id}`;
    async function A() {
      const d = l.value.trim(), e = await p.read(`library list${o.value ? ` --kind ${o.value}` : ""}${d ? ` --search ${JSON.stringify(d)}` : ""}`);
      g.value = e.ok ? "" : e.error, h.value = e.ok ? e.value.rows.map((n) => ({ ...n, item_id: n.id, id: L(n) })) : [], y.value = !0;
    }
    async function W(d) {
      const [e, n] = await Promise.all([p.read(`library show ${d.kind} ${d.item_id}`), p.read(`library versions ${d.kind} ${d.item_id}`)]);
      b.value = e.ok ? "" : e.error, s.value = e.ok ? { ...e.value, title: d.title } : null, x.value = n.ok ? n.value.versions : [];
    }
    async function K() {
      const d = s.value;
      await W({ kind: d.kind, item_id: d.id, title: d.title });
    }
    async function Z(d) {
      (await O(["library", "remove", d.kind, String(d.item_id ?? d.id)])).ok && s.value && await K();
    }
    async function F(d, e = null) {
      (await O(["library", "restore", d.kind, String(d.id), ...e ? ["--version", String(e)] : []])).ok && await K();
    }
    async function ee(d) {
      const e = await p.read(`library show check ${d.item_id}`);
      b.value = e.ok ? "" : e.error, k.value = e.ok ? { ...d, command: e.value.fields.command } : null;
    }
    async function Y(d) {
      var e;
      if (d.kind === "check" && ((e = k.value) == null ? void 0 : e.id) !== d.id) return void await ee(d);
      k.value = null, await O(["library", "get", d.kind, String(d.item_id), ...d.kind === "check" ? ["--read"] : []]);
    }
    return H(o, A, { immediate: !0 }), H(l, () => {
      clearTimeout(w), w = setTimeout(A, Se);
    }), (d, e) => (a(), i("div", ie, [
      $(t(ae), {
        modelValue: l.value,
        "onUpdate:modelValue": e[0] || (e[0] = (n) => l.value = n),
        placeholder: "Search the library",
        "data-library-search": ""
      }, null, 8, ["modelValue"]),
      $(t(Q), {
        options: f,
        value: o.value,
        "data-library-kind": "",
        onPick: e[1] || (e[1] = (n) => o.value = n)
      }, null, 8, ["value"]),
      t(b) ? (a(), i("p", de, u(t(b)), 1)) : _("", !0),
      k.value ? (a(), i("div", ue, [
        e[8] || (e[8] = v("p", null, "This check runs this command on your computer when someone starts it:", -1)),
        v("pre", ce, u(k.value.command), 1),
        $(t(j), {
          small: "",
          onClick: e[2] || (e[2] = (n) => k.value = null)
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
          onClick: e[3] || (e[3] = (n) => Y(k.value))
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
        loaded: y.value,
        searching: !!(l.value.trim() || o.value),
        empty: "Nothing in the library yet",
        hint: "Shared documents, sequences and checks appear here."
      }, {
        default: S(({ row: n }) => [
          v("div", {
            class: "library-row",
            "data-library-item": n.id
          }, [
            v("button", {
              type: "button",
              class: "library-open",
              "data-library-open": "",
              onClick: (D) => W(n)
            }, [
              v("span", me, u(n.title), 1),
              n.excerpt ? (a(), i("span", ve, u(n.excerpt), 1)) : (a(), i("span", be, u(n.abstract), 1)),
              v("span", he, [
                V(u(r[n.kind]) + ", Version: " + u(n.version) + ", Changed by: " + u(n.updated_by) + ", ", 1),
                $(t(P), {
                  at: n.updated_at
                }, null, 8, ["at"])
              ])
            ], 8, pe),
            n.copy_id ? (a(), i("span", ke, "On this journal")) : (a(), T(t(j), {
              key: 1,
              small: "",
              kind: "primary",
              "data-library-get": "",
              onClick: (D) => Y(n)
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
              onClick: (D) => Z(n)
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
      s.value ? (a(), T(t(X), {
        key: 2,
        title: s.value.title,
        onClose: e[5] || (e[5] = (n) => s.value = null)
      }, {
        default: S(() => [
          v("div", fe, [
            s.value.removed_at ? (a(), i(I, { key: 0 }, [
              e[12] || (e[12] = v("p", {
                class: "library-removed",
                "data-library-removed": ""
              }, "Removed from the library", -1)),
              c.role === "admin" ? (a(), T(t(j), {
                key: 0,
                small: "",
                kind: "primary",
                "data-library-restore": "",
                onClick: e[4] || (e[4] = (n) => F(s.value))
              }, {
                default: S(() => [...e[11] || (e[11] = [
                  V("Restore", -1)
                ])]),
                _: 1
              })) : _("", !0)
            ], 64)) : _("", !0),
            v("p", _e, u(r[s.value.kind]) + ", Version: " + u(s.value.version) + ", Changed by: " + u(s.value.updated_by), 1),
            v("dl", ge, [
              (a(!0), i(I, null, N(s.value.fields, (n, D) => (a(), i(I, { key: D }, [
                v("dt", null, u(D), 1),
                v("dd", null, u(n), 1)
              ], 64))), 128))
            ]),
            e[14] || (e[14] = v("h3", { class: "library-heading" }, "Versions", -1)),
            v("ul", $e, [
              (a(!0), i(I, null, N(x.value, (n) => (a(), i("li", {
                key: n.version,
                "data-library-version": n.version
              }, [
                v("span", null, [
                  V("Version: " + u(n.version) + ", Changed by: " + u(n.user) + ", ", 1),
                  $(t(P), {
                    at: n.created_at
                  }, null, 8, ["at"])
                ]),
                c.canWrite && n.version !== s.value.version ? (a(), T(t(j), {
                  key: 0,
                  small: "",
                  "data-library-restore-version": "",
                  onClick: (D) => F(s.value, n.version)
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
    const f = c, r = C, p = E(), o = R(f.address), l = R(""), h = R(""), y = R(!1);
    async function g() {
      y.value = !0;
      const s = await p.run(["library", "connect", ...o.value.trim() ? [o.value.trim()] : [], "--token", l.value.trim()]);
      y.value = !1, h.value = s.ok ? "" : s.error, s.ok && (l.value = "", r("connected"));
    }
    return (s, x) => (a(), i("form", {
      class: "connect",
      "data-library-connect": "",
      onSubmit: z(g, ["prevent"])
    }, [
      x[3] || (x[3] = v("p", { class: "connect-lead" }, "Connect this journal to your team's shared server to read and share documents, sequences and checks.", -1)),
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
        busy: y.value,
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
`), p = Array.from({ length: f.length + 1 }, () => new Array(r.length + 1).fill(0));
  for (let y = f.length - 1; y >= 0; y--)
    for (let g = r.length - 1; g >= 0; g--)
      p[y][g] = f[y] === r[g] ? p[y + 1][g + 1] + 1 : Math.max(p[y + 1][g], p[y][g + 1]);
  const o = [];
  let l = 0, h = 0;
  for (; l < f.length || h < r.length; )
    l < f.length && h < r.length && f[l] === r[h] ? o.push({ line_type: "ctx", line: h + 1, text: r[h++] }) && l++ : h < r.length && (l === f.length || p[l][h + 1] >= p[l + 1][h]) ? o.push({ line_type: "add", line: h + 1, text: r[h++] }) : o.push({ line_type: "del", line: null, text: f[l++] });
  return { rows: o, added: o.filter((y) => y.line_type === "add").length, removed: o.filter((y) => y.line_type === "del").length };
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
    return (r, p) => (a(), i("div", Te, [
      p[0] || (p[0] = v("p", { class: "compare-help" }, "Red lines are only on this journal. Green lines are only in the library.", -1)),
      f.value.length ? _("", !0) : (a(), i("p", Ie, "The two versions have the same text.")),
      (a(!0), i(I, null, N(f.value, (o) => (a(), T(t(le), {
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
}, qe = /* @__PURE__ */ B(je, [["__scopeId", "data-v-2ce13660"]]), Ae = ["data-library-copy", "data-status"], De = { class: "copy-title" }, Ne = {
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
      send: "Send",
      library: "Use the library's version",
      leave: "Stop following"
    }, p = {
      synced: ["leave"],
      sending: [],
      unsent: [],
      paused: [],
      denied: ["compare", "library"],
      rejected: ["compare"],
      conflict: ["compare", "mine", "library"],
      review: ["read", "library", "leave"],
      removed: ["leave"],
      agent: ["compare", "send", "library"]
    }, o = { admin: "Admin", edit: "Edit", read: "Read-only" }, l = c, h = C, y = q(() => p[l.copy.status].map((s) => ({ key: s, label: r[s] }))), g = q(() => {
      const s = [];
      return l.copy.status === "denied" && s.push(`Role: ${o[l.role]}`), l.copy.status === "denied" && l.copy.server_version > l.copy.version && s.push("A newer version is in the library"), l.copy.status === "agent" && s.push("An agent changed this item. A person sends it to the team."), l.copy.status === "removed" && s.push("Your copy stays on this journal."), l.copy.note && s.push(l.copy.note), s;
    });
    return (s, x) => (a(), i("li", {
      class: "copy",
      "data-library-copy": c.copy.copy_id,
      "data-status": c.copy.status
    }, [
      v("span", De, u(f[c.copy.share]) + " " + u(c.copy.row_id) + ", " + u(c.copy.local_fields.title), 1),
      v("span", Ne, "Status: " + u(c.copy.label) + ", Version: " + u(c.copy.version), 1),
      (a(!0), i(I, null, N(g.value, (k) => (a(), i("span", {
        key: k,
        class: "copy-line",
        "data-copy-line": ""
      }, u(k), 1))), 128)),
      v("span", Be, [
        (a(!0), i(I, null, N(y.value, (k) => (a(), T(t(j), {
          key: k.key,
          small: "",
          kind: k.key === "library" ? "primary" : void 0,
          "data-copy-button": k.key,
          onClick: (m) => h("choose", c.copy, k.key)
        }, {
          default: S(() => [
            V(u(k.label), 1)
          ]),
          _: 2
        }, 1032, ["kind", "data-copy-button", "onClick"]))), 128))
      ])
    ], 8, Ae));
  }
}, Ee = /* @__PURE__ */ B(We, [["__scopeId", "data-v-a32a6821"]]), Pe = {
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
    const f = C, r = E(), p = R(""), o = R(null), l = R(null), { refusal: h, run: y } = G(async () => f("changed"));
    async function g(m) {
      if (Object.keys(m.server_fields).length) return m.server_fields;
      const b = await r.read(`library show ${m.share} ${m.item_id}`);
      return h.value = b.ok ? "" : b.error, b.ok ? b.value.fields : null;
    }
    async function s(m) {
      const b = await g(m);
      l.value = b ? { copy: m, there: b } : null;
    }
    const x = {
      compare: s,
      read: s,
      send: (m) => y(["library", "resolve", String(m.copy_id), "--keep", "mine"]),
      mine: (m) => y(["library", "resolve", String(m.copy_id), "--keep", "mine"]),
      library: (m) => y(["library", "resolve", String(m.copy_id), "--keep", "library"]),
      leave: (m) => y(["library", "leave", String(m.copy_id)])
    };
    async function k() {
      const [m, b, ...O] = p.value.trim().split(/\s+/);
      if (!m || !/^\d+$/.test(b ?? "") || O.length) return void (h.value = "Write the kind and the number, such as doc 63.");
      const w = await y(["library", "share", m, b]);
      o.value = w.ok ? w.value : null, w.ok && (p.value = "");
    }
    return (m, b) => (a(), i("div", Pe, [
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
              modelValue: p.value,
              "onUpdate:modelValue": b[0] || (b[0] = (O) => p.value = O),
              placeholder: "doc 63",
              "data-library-share-field": ""
            }, null, 8, ["modelValue"])
          ]),
          _: 1
        }),
        $(t(j), {
          kind: "primary",
          disabled: !p.value.trim(),
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
        v("p", Ue, u(o.value.line), 1),
        o.value.warning ? (a(), i("p", Me, u(o.value.warning), 1)) : _("", !0)
      ], 64)) : _("", !0),
      t(h) ? (a(), i("p", Ge, u(t(h)), 1)) : _("", !0),
      c.copies.length ? _("", !0) : (a(), i("p", Ke, "No item on this journal follows an item of the library. Get one from the Library tab.")),
      v("ul", Fe, [
        (a(!0), i(I, null, N(c.copies, (O) => (a(), T(Ee, {
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
          v("div", Ye, [
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
}, Je = /* @__PURE__ */ B(He, [["__scopeId", "data-v-e96ade2f"]]), ze = {
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
}, nt = {
  key: 0,
  class: "teams-stopped",
  role: "alert",
  "data-teams-stopped": ""
}, st = 5e3, ot = {
  __name: "TeamsPage",
  setup(c) {
    const C = { admin: "Admin", edit: "Edit", read: "Read-only" }, f = E(), { value: r, failure: p, load: o } = J(() => "library status"), { value: l, load: h } = J(() => "library copies"), y = R("library"), g = q(() => {
      var w;
      return !!((w = r.value) != null && w.is_connected) && !r.value.stopped;
    }), s = q(() => {
      var w, L;
      return ((w = r.value) == null ? void 0 : w.role) === "admin" || ((L = r.value) == null ? void 0 : L.role) === "edit";
    }), x = q(() => {
      var w;
      return ((w = l.value) == null ? void 0 : w.rows) ?? [];
    }), k = q(() => [
      { key: "library", label: "Library" },
      { key: "copies", label: "On this journal", count: x.value.length }
    ]);
    async function m() {
      await Promise.all([o(), h()]);
    }
    const { refusal: b, run: O } = G(m);
    return ne(m, () => !0, st), te(() => f.follow(["library_copy.*"], m)), (w, L) => (a(), T(t(se), null, {
      default: S(() => {
        var A;
        return [
          v("div", ze, [
            v("div", Qe, [
              L[3] || (L[3] = v("h2", { class: "teams-title" }, "Teams", -1)),
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
            t(p) ? (a(), i("p", Xe, u(t(p)), 1)) : _("", !0),
            t(b) ? (a(), i("p", Ze, u(t(b)), 1)) : _("", !0),
            (A = t(r)) != null && A.is_connected ? (a(), i(I, { key: 2 }, [
              v("div", et, [
                v("span", tt, "Connected: " + u(t(r).server_name), 1),
                v("span", at, "Role: " + u(C[t(r).role]), 1),
                t(r).reached_at ? (a(), i("span", rt, [
                  L[4] || (L[4] = V("Last reached: ", -1)),
                  $(t(P), {
                    at: t(r).reached_at
                  }, null, 8, ["at"])
                ])) : _("", !0),
                t(r).is_encrypted ? _("", !0) : (a(), i("span", lt, "Connection: not encrypted"))
              ]),
              t(r).stopped ? (a(), i("p", nt, u(t(r).stopped), 1)) : _("", !0)
            ], 64)) : _("", !0),
            t(r) && !g.value ? (a(), T(Oe, {
              key: 3,
              address: t(r).address,
              onConnected: m
            }, null, 8, ["address"])) : _("", !0),
            g.value ? (a(), i(I, { key: 4 }, [
              $(t(Q), {
                options: k.value,
                value: y.value,
                "data-teams-tabs": "",
                onPick: L[1] || (L[1] = (W) => y.value = W)
              }, null, 8, ["options", "value"]),
              $(t(oe), { value: y.value }, {
                library: S(() => [
                  $(xe, {
                    role: t(r).role,
                    "can-write": s.value,
                    onChanged: m
                  }, null, 8, ["role", "can-write"])
                ]),
                copies: S(() => [
                  $(Je, {
                    copies: x.value,
                    role: t(r).role,
                    "can-write": s.value,
                    onChanged: m
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
