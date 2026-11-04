/* @code-commandments-generated */
if (!document.getElementById("window-styles-fc9101f4a56d")) { const style = document.createElement("style"); style.id = "window-styles-fc9101f4a56d"; style.textContent = ".library[data-v-a806240e]{display:flex;flex-direction:column;gap:10px}.library-row[data-v-a806240e]{display:flex;align-items:center;gap:10px;padding:6px 0}.library-open[data-v-a806240e]{display:flex;flex:1;flex-direction:column;gap:2px;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.library-title[data-v-a806240e]{font-weight:600}.library-abstract[data-v-a806240e],.library-excerpt[data-v-a806240e],.library-facts[data-v-a806240e],.library-here[data-v-a806240e]{color:var(--text-3);font-size:12px}.library-failure[data-v-a806240e],.library-warning[data-v-a806240e]{margin:0;color:var(--danger);font-size:13px}.library-fields dt[data-v-a806240e]{margin-top:8px;color:var(--text-3);font-size:12px}.library-fields dd[data-v-a806240e]{margin:2px 0 0;white-space:pre-wrap}.library-versions[data-v-a806240e]{padding:0;list-style:none}.library-versions li[data-v-a806240e]{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 0;font-size:13px}.connect[data-v-5b788b3e]{display:flex;flex-direction:column;gap:12px;max-width:420px}.connect-lead[data-v-5b788b3e]{margin:0;color:var(--text-2);font-size:13px}.connect-failure[data-v-5b788b3e]{margin:0;color:var(--danger);font-size:13px}.compare[data-v-2ce13660]{display:flex;flex-direction:column;gap:10px}.compare-help[data-v-2ce13660]{margin:0;color:var(--text-3);font-size:12px}.copy[data-v-a32a6821]{display:flex;flex-direction:column;gap:3px;padding:8px 0}.copy-title[data-v-a32a6821]{font-weight:600}.copy-facts[data-v-a32a6821],.copy-line[data-v-a32a6821]{color:var(--text-3);font-size:12px}.copy-buttons[data-v-a32a6821]{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}.copies[data-v-57ff56d0]{display:flex;flex-direction:column;gap:10px}.copies-share[data-v-57ff56d0]{display:flex;align-items:flex-end;gap:8px}.copies-list[data-v-57ff56d0]{margin:0;padding:0;list-style:none}.copies-failure[data-v-57ff56d0]{margin:0;color:var(--danger);font-size:13px}.copies-empty[data-v-57ff56d0]{margin:0;color:var(--text-3);font-size:13px}.teams[data-v-dd56d354]{display:flex;flex-direction:column;gap:10px}.teams-top[data-v-dd56d354]{display:flex;align-items:center;justify-content:space-between}.teams-title[data-v-dd56d354]{margin:0;font-size:16px}.teams-header[data-v-dd56d354]{display:flex;flex-wrap:wrap;gap:6px 18px;color:var(--text-2);font-size:13px}.teams-failure[data-v-dd56d354],.teams-stopped[data-v-dd56d354]{margin:0;color:var(--danger);font-size:13px}\n"; document.head.appendChild(style); }
import { ref as L, watch as z, openBlock as t, createElementBlock as i, createVNode as $, unref as a, toDisplayString as y, createCommentVNode as k, createElementVNode as b, withCtx as w, createTextVNode as O, createBlock as T, Fragment as q, renderList as B, withModifiers as X, computed as E, onMounted as re } from "vue";
import { useWindow as W, useRunLine as G, SearchBar as le, Segmented as Z, Btn as j, RowList as se, TimeAgo as U, SidePanel as ee, FormField as M, TextInput as K, DiffCard as ne, useReadLine as Q, usePoll as oe, WindowRoom as ie, SwitchCase as de } from "@journal/window-kit";
const P = (m, x) => {
  const _ = m.__vccOpts || m;
  for (const [r, g] of x)
    _[r] = g;
  return _;
}, ue = {
  class: "library",
  "data-library": ""
}, ce = {
  key: 0,
  class: "library-failure",
  role: "alert",
  "data-library-refusal": ""
}, ye = {
  key: 1,
  class: "library-check",
  "data-library-check": ""
}, pe = { "data-library-command": "" }, me = ["data-library-item"], ve = ["onClick"], be = { class: "library-title" }, he = {
  key: 0,
  class: "library-excerpt",
  "data-library-excerpt": ""
}, ke = {
  key: 1,
  class: "library-abstract"
}, fe = { class: "library-facts" }, _e = {
  key: 0,
  class: "library-here",
  "data-library-here": ""
}, ge = { "data-library-panel": "" }, Se = { class: "library-facts" }, $e = {
  class: "library-fields",
  "data-library-fields": ""
}, Ce = {
  class: "library-versions",
  "data-library-versions": ""
}, we = ["data-library-version"], xe = 300, Re = {
  __name: "LibraryBrowse",
  props: { role: { type: String, required: !0 }, canWrite: Boolean },
  emits: ["changed"],
  setup(m, { emit: x }) {
    const _ = [
      { key: "", label: "All" },
      { key: "doc", label: "Documents" },
      { key: "sequence", label: "Sequences" },
      { key: "check", label: "Checks" }
    ], r = ["doc", "sequence", "check"], g = { doc: "Document", sequence: "Sequence", check: "Check" }, c = W(), l = L(""), n = L(""), v = L([]), f = L(!1), S = L(""), p = L(null), C = L([]), R = L(null), N = x, { refusal: d, run: o } = G(async () => {
      await A(), N("changed");
    });
    let h = 0;
    const I = (u) => `${u.kind}:${u.id}`;
    async function A() {
      const u = n.value.trim(), e = await Promise.all((l.value ? [l.value] : r).map((V) => c.read(`library list --kind ${V}${u ? ` --search ${JSON.stringify(u)}` : ""}`))), s = e.find((V) => !V.ok);
      S.value = s ? s.error : "";
      const D = s ? [] : e.flatMap((V) => V.value.rows);
      v.value = [...new Map(D.map((V) => [I(V), V])).values()].map((V) => ({ ...V, item_id: V.id, id: I(V) })), f.value = !0;
    }
    async function F(u) {
      const [e, s] = await Promise.all([c.read(`library show ${u.kind} ${u.item_id}`), c.read(`library versions ${u.kind} ${u.item_id}`)]);
      d.value = e.ok ? "" : e.error, p.value = e.ok ? { ...e.value, title: u.title } : null, C.value = s.ok ? s.value.versions : [];
    }
    async function H() {
      const u = p.value;
      await F({ kind: u.kind, item_id: u.id, title: u.title });
    }
    async function ae(u) {
      (await o(["library", "remove", u.kind, String(u.item_id ?? u.id)])).ok && p.value && await H();
    }
    async function Y(u, e = null) {
      (await o(["library", "restore", u.kind, String(u.id), ...e ? ["--version", String(e)] : []])).ok && await H();
    }
    async function te(u) {
      const e = await c.read(`library show check ${u.item_id}`);
      d.value = e.ok ? "" : e.error, R.value = e.ok ? { ...u, command: e.value.fields.command } : null;
    }
    async function J(u) {
      var e;
      if (u.kind === "check" && ((e = R.value) == null ? void 0 : e.id) !== u.id) return void await te(u);
      R.value = null, await o(["library", "get", u.kind, String(u.item_id), ...u.kind === "check" ? ["--read"] : []]);
    }
    return z(l, A, { immediate: !0 }), z(n, () => {
      clearTimeout(h), h = setTimeout(A, xe);
    }), (u, e) => (t(), i("div", ue, [
      $(a(le), {
        modelValue: n.value,
        "onUpdate:modelValue": e[0] || (e[0] = (s) => n.value = s),
        placeholder: "Search the library",
        "data-library-search": ""
      }, null, 8, ["modelValue"]),
      $(a(Z), {
        options: _,
        value: l.value,
        "data-library-kind": "",
        onPick: e[1] || (e[1] = (s) => l.value = s)
      }, null, 8, ["value"]),
      a(d) ? (t(), i("p", ce, y(a(d)), 1)) : k("", !0),
      R.value ? (t(), i("div", ye, [
        e[8] || (e[8] = b("p", null, "This check runs this command on your computer when someone starts it:", -1)),
        b("pre", pe, y(R.value.command), 1),
        $(a(j), {
          small: "",
          onClick: e[2] || (e[2] = (s) => R.value = null)
        }, {
          default: w(() => [...e[6] || (e[6] = [
            O("Cancel", -1)
          ])]),
          _: 1
        }),
        $(a(j), {
          small: "",
          kind: "primary",
          "data-library-confirm": "",
          onClick: e[3] || (e[3] = (s) => J(R.value))
        }, {
          default: w(() => [...e[7] || (e[7] = [
            O("Get the check, stopped", -1)
          ])]),
          _: 1
        })
      ])) : k("", !0),
      $(a(se), {
        rows: v.value,
        failure: S.value,
        loaded: f.value,
        searching: !!(n.value.trim() || l.value),
        empty: "Nothing in the library yet",
        hint: "Shared documents, sequences and checks appear here."
      }, {
        default: w(({ row: s }) => [
          b("div", {
            class: "library-row",
            "data-library-item": s.id
          }, [
            b("button", {
              type: "button",
              class: "library-open",
              "data-library-open": "",
              onClick: (D) => F(s)
            }, [
              b("span", be, y(s.title), 1),
              s.excerpt ? (t(), i("span", he, y(s.excerpt), 1)) : (t(), i("span", ke, y(s.abstract), 1)),
              b("span", fe, [
                O(y(g[s.kind]) + ", Version: " + y(s.version) + ", Changed by: " + y(s.updated_by) + ", ", 1),
                $(a(U), {
                  at: s.updated_at
                }, null, 8, ["at"])
              ])
            ], 8, ve),
            s.copy_id ? (t(), i("span", _e, "On this journal")) : (t(), T(a(j), {
              key: 1,
              small: "",
              kind: "primary",
              "data-library-get": "",
              onClick: (D) => J(s)
            }, {
              default: w(() => [...e[9] || (e[9] = [
                O("Get", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])),
            m.role === "admin" ? (t(), T(a(j), {
              key: 2,
              small: "",
              kind: "danger",
              "data-library-remove": "",
              onClick: (D) => ae(s)
            }, {
              default: w(() => [...e[10] || (e[10] = [
                O("Remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])) : k("", !0)
          ], 8, me)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "searching"]),
      p.value ? (t(), T(a(ee), {
        key: 2,
        title: p.value.title,
        onClose: e[5] || (e[5] = (s) => p.value = null)
      }, {
        default: w(() => [
          b("div", ge, [
            p.value.removed_at ? (t(), i(q, { key: 0 }, [
              e[12] || (e[12] = b("p", {
                class: "library-removed",
                "data-library-removed": ""
              }, "Removed from the library", -1)),
              m.role === "admin" ? (t(), T(a(j), {
                key: 0,
                small: "",
                kind: "primary",
                "data-library-restore": "",
                onClick: e[4] || (e[4] = (s) => Y(p.value))
              }, {
                default: w(() => [...e[11] || (e[11] = [
                  O("Restore", -1)
                ])]),
                _: 1
              })) : k("", !0)
            ], 64)) : k("", !0),
            b("p", Se, y(g[p.value.kind]) + ", Version: " + y(p.value.version) + ", Changed by: " + y(p.value.updated_by), 1),
            b("dl", $e, [
              (t(!0), i(q, null, B(p.value.fields, (s, D) => (t(), i(q, { key: D }, [
                b("dt", null, y(D), 1),
                b("dd", null, y(s), 1)
              ], 64))), 128))
            ]),
            e[14] || (e[14] = b("h3", { class: "library-heading" }, "Versions", -1)),
            b("ul", Ce, [
              (t(!0), i(q, null, B(C.value, (s) => (t(), i("li", {
                key: s.version,
                "data-library-version": s.version
              }, [
                b("span", null, [
                  O("Version: " + y(s.version) + ", Changed by: " + y(s.user) + ", ", 1),
                  $(a(U), {
                    at: s.created_at
                  }, null, 8, ["at"])
                ]),
                m.canWrite && s.version !== p.value.version ? (t(), T(a(j), {
                  key: 0,
                  small: "",
                  "data-library-restore-version": "",
                  onClick: (D) => Y(p.value, s.version)
                }, {
                  default: w(() => [...e[13] || (e[13] = [
                    O("Restore this version", -1)
                  ])]),
                  _: 1
                }, 8, ["onClick"])) : k("", !0)
              ], 8, we))), 128))
            ])
          ])
        ]),
        _: 1
      }, 8, ["title"])) : k("", !0)
    ]));
  }
}, Le = /* @__PURE__ */ P(Re, [["__scopeId", "data-v-a806240e"]]), Oe = {
  key: 0,
  class: "connect-failure",
  role: "alert",
  "data-library-refusal": ""
}, Te = {
  __name: "LibraryConnect",
  props: { address: { type: String, default: "" } },
  emits: ["connected"],
  setup(m, { emit: x }) {
    const _ = m, r = x, g = W(), c = L(_.address), l = L(""), n = L(""), v = L(!1);
    async function f() {
      v.value = !0;
      const S = await g.run(["library", "connect", ...c.value.trim() ? [c.value.trim()] : [], "--token", l.value.trim()]);
      v.value = !1, n.value = S.ok ? "" : S.error, S.ok && (l.value = "", r("connected"));
    }
    return (S, p) => (t(), i("form", {
      class: "connect",
      "data-library-connect": "",
      onSubmit: X(f, ["prevent"])
    }, [
      p[3] || (p[3] = b("p", { class: "connect-lead" }, "Connect this journal to your team's shared server to read and share documents, sequences and checks.", -1)),
      $(a(M), {
        label: "Address",
        for: "library-address",
        help: "An IP address or a web address, such as 10.0.0.5 or https://library.example.com."
      }, {
        default: w(() => [
          $(a(K), {
            id: "library-address",
            modelValue: c.value,
            "onUpdate:modelValue": p[0] || (p[0] = (C) => c.value = C),
            placeholder: "library.example.com",
            "data-library-address": ""
          }, null, 8, ["modelValue"])
        ]),
        _: 1
      }),
      $(a(M), {
        label: "Token",
        for: "library-token",
        help: "The token an admin of the server gave you. It is stored outside the project."
      }, {
        default: w(() => [
          $(a(K), {
            id: "library-token",
            modelValue: l.value,
            "onUpdate:modelValue": p[1] || (p[1] = (C) => l.value = C),
            type: "password",
            autocomplete: "off",
            placeholder: "jsl_...",
            "data-library-token": ""
          }, null, 8, ["modelValue"])
        ]),
        _: 1
      }),
      n.value ? (t(), i("p", Oe, y(n.value), 1)) : k("", !0),
      $(a(j), {
        kind: "primary",
        busy: v.value,
        disabled: !l.value.trim(),
        "data-library-submit": "",
        onClick: f
      }, {
        default: w(() => [...p[2] || (p[2] = [
          O("Connect", -1)
        ])]),
        _: 1
      }, 8, ["busy", "disabled"])
    ], 32));
  }
}, Ve = /* @__PURE__ */ P(Te, [["__scopeId", "data-v-5b788b3e"]]);
function Ie(m, x) {
  const _ = m === "" ? [] : m.split(`
`), r = x === "" ? [] : x.split(`
`), g = Array.from({ length: _.length + 1 }, () => new Array(r.length + 1).fill(0));
  for (let v = _.length - 1; v >= 0; v--)
    for (let f = r.length - 1; f >= 0; f--)
      g[v][f] = _[v] === r[f] ? g[v + 1][f + 1] + 1 : Math.max(g[v + 1][f], g[v][f + 1]);
  const c = [];
  let l = 0, n = 0;
  for (; l < _.length || n < r.length; )
    l < _.length && n < r.length && _[l] === r[n] ? c.push({ line_type: "ctx", line: n + 1, text: r[n++] }) && l++ : n < r.length && (l === _.length || g[l][n + 1] >= g[l + 1][n]) ? c.push({ line_type: "add", line: n + 1, text: r[n++] }) : c.push({ line_type: "del", line: null, text: _[l++] });
  return { rows: c, added: c.filter((v) => v.line_type === "add").length, removed: c.filter((v) => v.line_type === "del").length };
}
const je = {
  class: "compare",
  "data-library-compare": ""
}, qe = {
  key: 0,
  "data-library-same": ""
}, Ae = {
  __name: "CopyCompare",
  props: { here: { type: Object, required: !0 }, library: { type: Object, required: !0 }, at: { type: String, required: !0 } },
  setup(m) {
    const x = m, _ = E(
      () => Object.keys({ ...x.here, ...x.library }).map((r) => ({ name: r, ...Ie(String(x.here[r] ?? ""), String(x.library[r] ?? "")) })).filter((r) => r.added || r.removed)
    );
    return (r, g) => (t(), i("div", je, [
      g[0] || (g[0] = b("p", { class: "compare-help" }, "Red lines are only on this journal. Green lines are only in the library.", -1)),
      _.value.length ? k("", !0) : (t(), i("p", qe, "The two versions have the same text.")),
      (t(!0), i(q, null, B(_.value, (c) => (t(), T(a(ne), {
        key: c.name,
        path: c.name,
        kind: "edit",
        added: c.added,
        removed: c.removed,
        at: m.at,
        rows: c.rows,
        "data-library-diff": ""
      }, null, 8, ["path", "added", "removed", "at", "rows"]))), 128))
    ]));
  }
}, De = /* @__PURE__ */ P(Ae, [["__scopeId", "data-v-2ce13660"]]), Ne = ["data-library-copy", "data-status"], Ee = { class: "copy-title" }, Be = {
  class: "copy-facts",
  "data-copy-facts": ""
}, Pe = { class: "copy-buttons" }, We = {
  __name: "LibraryCopyRow",
  props: { copy: { type: Object, required: !0 }, role: { type: String, required: !0 } },
  emits: ["choose"],
  setup(m, { emit: x }) {
    const _ = { doc: "Document", sequence: "Sequence", check: "Check" }, r = {
      compare: "Compare",
      read: "Read",
      mine: "Keep mine",
      send: "Send",
      library: "Use the library's version",
      leave: "Stop following"
    }, g = {
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
    }, c = { admin: "Admin", edit: "Edit", read: "Read-only" }, l = m, n = x, v = E(() => g[l.copy.status].map((S) => ({ key: S, label: r[S] }))), f = E(() => {
      const S = [];
      return l.copy.status === "denied" && S.push(`Role: ${c[l.role]}`), l.copy.status === "denied" && l.copy.server_version > l.copy.version && S.push("A newer version is in the library"), l.copy.status === "agent" && S.push("An agent changed this item. A person sends it to the team."), l.copy.status === "removed" && S.push("Your copy stays on this journal."), l.copy.note && S.push(l.copy.note), S;
    });
    return (S, p) => (t(), i("li", {
      class: "copy",
      "data-library-copy": m.copy.copy_id,
      "data-status": m.copy.status
    }, [
      b("span", Ee, y(_[m.copy.share]) + " " + y(m.copy.row_id) + ", " + y(m.copy.local_fields.title), 1),
      b("span", Be, "Status: " + y(m.copy.label) + ", Version: " + y(m.copy.version), 1),
      (t(!0), i(q, null, B(f.value, (C) => (t(), i("span", {
        key: C,
        class: "copy-line",
        "data-copy-line": ""
      }, y(C), 1))), 128)),
      b("span", Pe, [
        (t(!0), i(q, null, B(v.value, (C) => (t(), T(a(j), {
          key: C.key,
          small: "",
          kind: C.key === "library" ? "primary" : void 0,
          "data-copy-button": C.key,
          onClick: (R) => n("choose", m.copy, C.key)
        }, {
          default: w(() => [
            O(y(C.label), 1)
          ]),
          _: 2
        }, 1032, ["kind", "data-copy-button", "onClick"]))), 128))
      ])
    ], 8, Ne));
  }
}, Ue = /* @__PURE__ */ P(We, [["__scopeId", "data-v-a32a6821"]]), Me = {
  class: "copies",
  "data-library-copies": ""
}, Ke = {
  class: "copies-shared",
  "data-library-shared": ""
}, Ge = {
  key: 0,
  class: "copies-failure",
  role: "alert",
  "data-library-warning": ""
}, Fe = {
  key: 2,
  class: "copies-failure",
  role: "alert",
  "data-library-refusal": ""
}, He = {
  key: 3,
  class: "copies-empty",
  "data-library-no-copies": ""
}, Ye = { class: "copies-list" }, Je = { "data-library-compare-panel": "" }, ze = {
  key: 0,
  class: "copies-failure",
  "data-library-loss": ""
}, Qe = {
  __name: "LibraryCopies",
  props: { copies: { type: Array, required: !0 }, role: { type: String, required: !0 }, canWrite: Boolean },
  emits: ["changed"],
  setup(m, { emit: x }) {
    const _ = x, r = W(), g = ["doc"], c = L(""), l = L(null), n = L(null), { refusal: v, run: f } = G(async () => _("changed"));
    async function S(d) {
      if (Object.keys(d.server_fields).length) return d.server_fields;
      const o = await r.read(`library show ${d.share} ${d.item_id}`);
      return v.value = o.ok ? "" : o.error, o.ok ? o.value.fields : null;
    }
    async function p(d, o = !1) {
      const h = await S(d);
      n.value = h ? { copy: d, there: h, isTaking: o } : null;
    }
    async function C(d) {
      n.value = null, await f(["library", "resolve", String(d.copy_id), "--keep", "library"]);
    }
    const R = {
      compare: (d) => p(d),
      read: (d) => p(d),
      send: (d) => f(["library", "resolve", String(d.copy_id), "--keep", "mine"]),
      mine: (d) => f(["library", "resolve", String(d.copy_id), "--keep", "mine"]),
      library: (d) => g.includes(d.share) ? C(d) : p(d, !0),
      leave: (d) => f(["library", "leave", String(d.copy_id)])
    };
    async function N() {
      const [d, o, ...h] = c.value.trim().split(/\s+/);
      if (!d || !/^\d+$/.test(o ?? "") || h.length) return void (v.value = "Write the kind and the number, such as doc 63.");
      const I = await f(["library", "share", d, o]);
      l.value = I.ok ? I.value : null, I.ok && (c.value = "");
    }
    return (d, o) => (t(), i("div", Me, [
      m.canWrite ? (t(), i("form", {
        key: 0,
        class: "copies-share",
        "data-library-share": "",
        onSubmit: X(N, ["prevent"])
      }, [
        $(a(M), {
          label: "Share with the team",
          for: "library-share",
          help: "The kind and the number of the item on this journal, such as doc 63."
        }, {
          default: w(() => [
            $(a(K), {
              id: "library-share",
              modelValue: c.value,
              "onUpdate:modelValue": o[0] || (o[0] = (h) => c.value = h),
              placeholder: "doc 63",
              "data-library-share-field": ""
            }, null, 8, ["modelValue"])
          ]),
          _: 1
        }),
        $(a(j), {
          kind: "primary",
          disabled: !c.value.trim(),
          "data-library-share-submit": "",
          onClick: N
        }, {
          default: w(() => [...o[4] || (o[4] = [
            O("Share", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : k("", !0),
      l.value ? (t(), i(q, { key: 1 }, [
        b("p", Ke, y(l.value.line), 1),
        l.value.warning ? (t(), i("p", Ge, y(l.value.warning), 1)) : k("", !0)
      ], 64)) : k("", !0),
      a(v) ? (t(), i("p", Fe, y(a(v)), 1)) : k("", !0),
      m.copies.length ? k("", !0) : (t(), i("p", He, "No item on this journal follows an item of the library. Get one from the Library tab.")),
      b("ul", Ye, [
        (t(!0), i(q, null, B(m.copies, (h) => (t(), T(Ue, {
          key: h.copy_id,
          copy: h,
          role: m.role,
          onChoose: o[1] || (o[1] = (I, A) => R[A](I))
        }, null, 8, ["copy", "role"]))), 128))
      ]),
      n.value ? (t(), T(a(ee), {
        key: 4,
        title: `Compare: ${n.value.copy.local_fields.title}`,
        onClose: o[3] || (o[3] = (h) => n.value = null)
      }, {
        default: w(() => [
          b("div", Je, [
            g.includes(n.value.copy.share) ? k("", !0) : (t(), i("p", ze, "The text on this journal is lost when you use the library's version: a " + y(n.value.copy.share) + " keeps no earlier versions.", 1)),
            $(De, {
              here: n.value.copy.local_fields,
              library: n.value.there,
              at: (/* @__PURE__ */ new Date()).toISOString()
            }, null, 8, ["here", "library", "at"]),
            n.value.isTaking ? (t(), T(a(j), {
              key: 1,
              kind: "primary",
              "data-library-take": "",
              onClick: o[2] || (o[2] = (h) => C(n.value.copy))
            }, {
              default: w(() => [...o[5] || (o[5] = [
                O("Use the library's version", -1)
              ])]),
              _: 1
            })) : k("", !0)
          ])
        ]),
        _: 1
      }, 8, ["title"])) : k("", !0)
    ]));
  }
}, Xe = /* @__PURE__ */ P(Qe, [["__scopeId", "data-v-57ff56d0"]]), Ze = {
  class: "teams",
  "data-teams": ""
}, ea = { class: "teams-top" }, aa = {
  key: 0,
  class: "teams-failure",
  role: "alert",
  "data-teams-failure": ""
}, ta = {
  key: 1,
  class: "teams-failure",
  role: "alert",
  "data-teams-refusal": ""
}, ra = {
  class: "teams-header",
  "data-teams-header": ""
}, la = { "data-teams-server": "" }, sa = { "data-teams-role": "" }, na = {
  key: 0,
  "data-teams-reached": ""
}, oa = {
  key: 1,
  "data-teams-plain": ""
}, ia = {
  key: 0,
  class: "teams-stopped",
  role: "alert",
  "data-teams-stopped": ""
}, da = 5e3, ua = {
  __name: "TeamsPage",
  setup(m) {
    const x = { admin: "Admin", edit: "Edit", read: "Read-only" }, _ = W(), { value: r, failure: g, load: c } = Q(() => "library status"), { value: l, load: n } = Q(() => "library copies"), v = L("library"), f = E(() => {
      var o;
      return !!((o = r.value) != null && o.is_connected) && !r.value.stopped;
    }), S = E(() => {
      var o, h;
      return ((o = r.value) == null ? void 0 : o.role) === "admin" || ((h = r.value) == null ? void 0 : h.role) === "edit";
    }), p = E(() => {
      var o;
      return ((o = l.value) == null ? void 0 : o.rows) ?? [];
    }), C = E(() => [
      { key: "library", label: "Library" },
      { key: "copies", label: "On this journal", count: p.value.length }
    ]);
    async function R() {
      await Promise.all([c(), n()]);
    }
    const { refusal: N, run: d } = G(R);
    return oe(R, () => !0, da), re(() => _.follow(["library_copy.*"], R)), (o, h) => (t(), T(a(ie), null, {
      default: w(() => {
        var I;
        return [
          b("div", Ze, [
            b("div", ea, [
              h[3] || (h[3] = b("h2", { class: "teams-title" }, "Teams", -1)),
              f.value ? (t(), T(a(j), {
                key: 0,
                small: "",
                "data-teams-sync": "",
                onClick: h[0] || (h[0] = (A) => a(d)(["library", "sync"]))
              }, {
                default: w(() => [...h[2] || (h[2] = [
                  O("Sync now", -1)
                ])]),
                _: 1
              })) : k("", !0)
            ]),
            a(g) ? (t(), i("p", aa, y(a(g)), 1)) : k("", !0),
            a(N) ? (t(), i("p", ta, y(a(N)), 1)) : k("", !0),
            (I = a(r)) != null && I.is_connected ? (t(), i(q, { key: 2 }, [
              b("div", ra, [
                b("span", la, "Connected: " + y(a(r).server_name), 1),
                b("span", sa, "Role: " + y(x[a(r).role]), 1),
                a(r).reached_at ? (t(), i("span", na, [
                  h[4] || (h[4] = O("Last reached: ", -1)),
                  $(a(U), {
                    at: a(r).reached_at
                  }, null, 8, ["at"])
                ])) : k("", !0),
                a(r).is_encrypted ? k("", !0) : (t(), i("span", oa, "Connection: not encrypted"))
              ]),
              a(r).stopped ? (t(), i("p", ia, y(a(r).stopped), 1)) : k("", !0)
            ], 64)) : k("", !0),
            a(r) && !f.value ? (t(), T(Ve, {
              key: 3,
              address: a(r).address,
              onConnected: R
            }, null, 8, ["address"])) : k("", !0),
            f.value ? (t(), i(q, { key: 4 }, [
              $(a(Z), {
                options: C.value,
                value: v.value,
                "data-teams-tabs": "",
                onPick: h[1] || (h[1] = (A) => v.value = A)
              }, null, 8, ["options", "value"]),
              $(a(de), { value: v.value }, {
                library: w(() => [
                  $(Le, {
                    role: a(r).role,
                    "can-write": S.value,
                    onChanged: R
                  }, null, 8, ["role", "can-write"])
                ]),
                copies: w(() => [
                  $(Xe, {
                    copies: p.value,
                    role: a(r).role,
                    "can-write": S.value,
                    onChanged: R
                  }, null, 8, ["copies", "role", "can-write"])
                ]),
                _: 1
              }, 8, ["value"])
            ], 64)) : k("", !0)
          ])
        ];
      }),
      _: 1
    }));
  }
}, pa = /* @__PURE__ */ P(ua, [["__scopeId", "data-v-dd56d354"]]);
export {
  pa as default
};
