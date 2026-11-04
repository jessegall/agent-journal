/* @code-commandments-generated */
if (!document.getElementById("window-styles-d0fb2020e583")) { const style = document.createElement("style"); style.id = "window-styles-d0fb2020e583"; style.textContent = ".library[data-v-a806240e]{display:flex;flex-direction:column;gap:10px}.library-row[data-v-a806240e]{display:flex;align-items:center;gap:10px;padding:6px 0}.library-open[data-v-a806240e]{display:flex;flex:1;flex-direction:column;gap:2px;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.library-title[data-v-a806240e]{font-weight:600}.library-abstract[data-v-a806240e],.library-excerpt[data-v-a806240e],.library-facts[data-v-a806240e],.library-here[data-v-a806240e]{color:var(--text-3);font-size:12px}.library-failure[data-v-a806240e],.library-warning[data-v-a806240e]{margin:0;color:var(--danger);font-size:13px}.library-fields dt[data-v-a806240e]{margin-top:8px;color:var(--text-3);font-size:12px}.library-fields dd[data-v-a806240e]{margin:2px 0 0;white-space:pre-wrap}.library-versions[data-v-a806240e]{padding:0;list-style:none}.library-versions li[data-v-a806240e]{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 0;font-size:13px}.connect[data-v-5b788b3e]{display:flex;flex-direction:column;gap:12px;max-width:420px}.connect-lead[data-v-5b788b3e]{margin:0;color:var(--text-2);font-size:13px}.connect-failure[data-v-5b788b3e]{margin:0;color:var(--danger);font-size:13px}.compare[data-v-2ce13660]{display:flex;flex-direction:column;gap:10px}.compare-help[data-v-2ce13660]{margin:0;color:var(--text-3);font-size:12px}.copy[data-v-a32a6821]{display:flex;flex-direction:column;gap:3px;padding:8px 0}.copy-title[data-v-a32a6821]{font-weight:600}.copy-facts[data-v-a32a6821],.copy-line[data-v-a32a6821]{color:var(--text-3);font-size:12px}.copy-buttons[data-v-a32a6821]{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}.copies[data-v-57ff56d0]{display:flex;flex-direction:column;gap:10px}.copies-share[data-v-57ff56d0]{display:flex;align-items:flex-end;gap:8px}.copies-list[data-v-57ff56d0]{margin:0;padding:0;list-style:none}.copies-failure[data-v-57ff56d0]{margin:0;color:var(--danger);font-size:13px}.copies-empty[data-v-57ff56d0]{margin:0;color:var(--text-3);font-size:13px}.person[data-v-d58382ff]{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;padding:8px 0}.person-name[data-v-d58382ff]{min-width:120px;font-weight:600}.person-facts[data-v-d58382ff],.person-tokens[data-v-d58382ff]{color:var(--text-3);font-size:12px}.person-tokens[data-v-d58382ff]{flex-basis:100%;margin:0;padding:0 0 0 16px;list-style:none}.person-tokens li[data-v-d58382ff]{display:flex;align-items:center;gap:10px;padding:2px 0}.person-failure[data-v-d58382ff]{flex-basis:100%;margin:0;color:var(--danger);font-size:13px}.people[data-v-29247035]{display:flex;flex-direction:column;gap:10px}.people-add[data-v-29247035]{display:flex;align-items:flex-end;gap:10px}.people-token[data-v-29247035]{margin:0;font-family:var(--mono);font-size:12px;word-break:break-all}.people-failure[data-v-29247035]{margin:0;color:var(--danger);font-size:13px}.teams[data-v-beceaea8]{display:flex;flex-direction:column;gap:10px}.teams-top[data-v-beceaea8]{display:flex;align-items:center;justify-content:space-between}.teams-title[data-v-beceaea8]{margin:0;font-size:16px}.teams-header[data-v-beceaea8]{display:flex;flex-wrap:wrap;gap:6px 18px;color:var(--text-2);font-size:13px}.teams-failure[data-v-beceaea8],.teams-stopped[data-v-beceaea8]{margin:0;color:var(--danger);font-size:13px}\n"; document.head.appendChild(style); }
import { ref as T, watch as Z, openBlock as a, createElementBlock as n, createVNode as f, unref as e, toDisplayString as u, createCommentVNode as g, createElementVNode as k, withCtx as R, createTextVNode as V, createBlock as I, Fragment as j, renderList as B, withModifiers as J, computed as E, onMounted as re } from "vue";
import { useWindow as U, useRunLine as M, SearchBar as se, Segmented as F, Btn as A, RowList as ee, TimeAgo as H, SidePanel as ae, FormField as K, TextInput as G, DiffCard as ne, useReadLine as Y, usePoll as oe, WindowRoom as ie, SwitchCase as de } from "@journal/window-kit";
const D = (i, L) => {
  const $ = i.__vccOpts || i;
  for (const [t, h] of L)
    $[t] = h;
  return $;
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
}, pe = { "data-library-command": "" }, ve = ["data-library-item"], me = ["onClick"], be = { class: "library-title" }, ke = {
  key: 0,
  class: "library-excerpt",
  "data-library-excerpt": ""
}, fe = {
  key: 1,
  class: "library-abstract"
}, he = { class: "library-facts" }, _e = {
  key: 0,
  class: "library-here",
  "data-library-here": ""
}, ge = { "data-library-panel": "" }, $e = { class: "library-facts" }, Se = {
  class: "library-fields",
  "data-library-fields": ""
}, Ce = {
  class: "library-versions",
  "data-library-versions": ""
}, we = ["data-library-version"], Re = 300, xe = {
  __name: "LibraryBrowse",
  props: { role: { type: String, required: !0 }, canWrite: Boolean },
  emits: ["changed"],
  setup(i, { emit: L }) {
    const $ = [
      { key: "", label: "All" },
      { key: "doc", label: "Documents" },
      { key: "sequence", label: "Sequences" },
      { key: "check", label: "Checks" }
    ], t = ["doc", "sequence", "check"], h = { doc: "Document", sequence: "Sequence", check: "Check" }, y = U(), l = T(""), s = T(""), v = T([]), b = T(!1), S = T(""), c = T(null), p = T([]), x = T(null), C = L, { refusal: o, run: _ } = M(async () => {
      await P(), C("changed");
    });
    let w = 0;
    const O = (m) => `${m.kind}:${m.id}`;
    async function P() {
      const m = s.value.trim(), r = await Promise.all((l.value ? [l.value] : t).map((N) => y.read(`library list --kind ${N}${m ? ` --search ${JSON.stringify(m)}` : ""}`))), d = r.find((N) => !N.ok);
      S.value = d ? d.error : "";
      const q = d ? [] : r.flatMap((N) => N.value.rows);
      v.value = [...new Map(q.map((N) => [O(N), N])).values()].map((N) => ({ ...N, item_id: N.id, id: O(N) })), b.value = !0;
    }
    async function W(m) {
      const [r, d] = await Promise.all([y.read(`library show ${m.kind} ${m.item_id}`), y.read(`library versions ${m.kind} ${m.item_id}`)]);
      o.value = r.ok ? "" : r.error, c.value = r.ok ? { ...r.value, title: m.title } : null, p.value = d.ok ? d.value.versions : [];
    }
    async function z() {
      const m = c.value;
      await W({ kind: m.kind, item_id: m.id, title: m.title });
    }
    async function te(m) {
      (await _(["library", "remove", m.kind, String(m.item_id ?? m.id)])).ok && c.value && await z();
    }
    async function Q(m, r = null) {
      (await _(["library", "restore", m.kind, String(m.id), ...r ? ["--version", String(r)] : []])).ok && await z();
    }
    async function le(m) {
      const r = await y.read(`library show check ${m.item_id}`);
      o.value = r.ok ? "" : r.error, x.value = r.ok ? { ...m, command: r.value.fields.command } : null;
    }
    async function X(m) {
      var r;
      if (m.kind === "check" && ((r = x.value) == null ? void 0 : r.id) !== m.id) return void await le(m);
      x.value = null, await _(["library", "get", m.kind, String(m.item_id), ...m.kind === "check" ? ["--read"] : []]);
    }
    return Z(l, P, { immediate: !0 }), Z(s, () => {
      clearTimeout(w), w = setTimeout(P, Re);
    }), (m, r) => (a(), n("div", ue, [
      f(e(se), {
        modelValue: s.value,
        "onUpdate:modelValue": r[0] || (r[0] = (d) => s.value = d),
        placeholder: "Search the library",
        "data-library-search": ""
      }, null, 8, ["modelValue"]),
      f(e(F), {
        options: $,
        value: l.value,
        "data-library-kind": "",
        onPick: r[1] || (r[1] = (d) => l.value = d)
      }, null, 8, ["value"]),
      e(o) ? (a(), n("p", ce, u(e(o)), 1)) : g("", !0),
      x.value ? (a(), n("div", ye, [
        r[8] || (r[8] = k("p", null, "This check runs this command on your computer when someone starts it:", -1)),
        k("pre", pe, u(x.value.command), 1),
        f(e(A), {
          small: "",
          onClick: r[2] || (r[2] = (d) => x.value = null)
        }, {
          default: R(() => [...r[6] || (r[6] = [
            V("Cancel", -1)
          ])]),
          _: 1
        }),
        f(e(A), {
          small: "",
          kind: "primary",
          "data-library-confirm": "",
          onClick: r[3] || (r[3] = (d) => X(x.value))
        }, {
          default: R(() => [...r[7] || (r[7] = [
            V("Get the check, stopped", -1)
          ])]),
          _: 1
        })
      ])) : g("", !0),
      f(e(ee), {
        rows: v.value,
        failure: S.value,
        loaded: b.value,
        searching: !!(s.value.trim() || l.value),
        empty: "Nothing in the library yet",
        hint: "Shared documents, sequences and checks appear here."
      }, {
        default: R(({ row: d }) => [
          k("div", {
            class: "library-row",
            "data-library-item": d.id
          }, [
            k("button", {
              type: "button",
              class: "library-open",
              "data-library-open": "",
              onClick: (q) => W(d)
            }, [
              k("span", be, u(d.title), 1),
              d.excerpt ? (a(), n("span", ke, u(d.excerpt), 1)) : (a(), n("span", fe, u(d.abstract), 1)),
              k("span", he, [
                V(u(h[d.kind]) + ", Version: " + u(d.version) + ", Changed by: " + u(d.updated_by) + ", ", 1),
                f(e(H), {
                  at: d.updated_at
                }, null, 8, ["at"])
              ])
            ], 8, me),
            d.copy_id ? (a(), n("span", _e, "On this journal")) : (a(), I(e(A), {
              key: 1,
              small: "",
              kind: "primary",
              "data-library-get": "",
              onClick: (q) => X(d)
            }, {
              default: R(() => [...r[9] || (r[9] = [
                V("Get", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])),
            i.role === "admin" ? (a(), I(e(A), {
              key: 2,
              small: "",
              kind: "danger",
              "data-library-remove": "",
              onClick: (q) => te(d)
            }, {
              default: R(() => [...r[10] || (r[10] = [
                V("Remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])) : g("", !0)
          ], 8, ve)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "searching"]),
      c.value ? (a(), I(e(ae), {
        key: 2,
        title: c.value.title,
        onClose: r[5] || (r[5] = (d) => c.value = null)
      }, {
        default: R(() => [
          k("div", ge, [
            c.value.removed_at ? (a(), n(j, { key: 0 }, [
              r[12] || (r[12] = k("p", {
                class: "library-removed",
                "data-library-removed": ""
              }, "Removed from the library", -1)),
              i.role === "admin" ? (a(), I(e(A), {
                key: 0,
                small: "",
                kind: "primary",
                "data-library-restore": "",
                onClick: r[4] || (r[4] = (d) => Q(c.value))
              }, {
                default: R(() => [...r[11] || (r[11] = [
                  V("Restore", -1)
                ])]),
                _: 1
              })) : g("", !0)
            ], 64)) : g("", !0),
            k("p", $e, u(h[c.value.kind]) + ", Version: " + u(c.value.version) + ", Changed by: " + u(c.value.updated_by), 1),
            k("dl", Se, [
              (a(!0), n(j, null, B(c.value.fields, (d, q) => (a(), n(j, { key: q }, [
                k("dt", null, u(q), 1),
                k("dd", null, u(d), 1)
              ], 64))), 128))
            ]),
            r[14] || (r[14] = k("h3", { class: "library-heading" }, "Versions", -1)),
            k("ul", Ce, [
              (a(!0), n(j, null, B(p.value, (d) => (a(), n("li", {
                key: d.version,
                "data-library-version": d.version
              }, [
                k("span", null, [
                  V("Version: " + u(d.version) + ", Changed by: " + u(d.user) + ", ", 1),
                  f(e(H), {
                    at: d.created_at
                  }, null, 8, ["at"])
                ]),
                i.canWrite && d.version !== c.value.version ? (a(), I(e(A), {
                  key: 0,
                  small: "",
                  "data-library-restore-version": "",
                  onClick: (q) => Q(c.value, d.version)
                }, {
                  default: R(() => [...r[13] || (r[13] = [
                    V("Restore this version", -1)
                  ])]),
                  _: 1
                }, 8, ["onClick"])) : g("", !0)
              ], 8, we))), 128))
            ])
          ])
        ]),
        _: 1
      }, 8, ["title"])) : g("", !0)
    ]));
  }
}, Le = /* @__PURE__ */ D(xe, [["__scopeId", "data-v-a806240e"]]), Oe = {
  key: 0,
  class: "connect-failure",
  role: "alert",
  "data-library-refusal": ""
}, Te = {
  __name: "LibraryConnect",
  props: { address: { type: String, default: "" } },
  emits: ["connected"],
  setup(i, { emit: L }) {
    const $ = i, t = L, h = U(), y = T($.address), l = T(""), s = T(""), v = T(!1);
    async function b() {
      v.value = !0;
      const S = await h.run(["library", "connect", ...y.value.trim() ? [y.value.trim()] : [], "--token", l.value.trim()]);
      v.value = !1, s.value = S.ok ? "" : S.error, S.ok && (l.value = "", t("connected"));
    }
    return (S, c) => (a(), n("form", {
      class: "connect",
      "data-library-connect": "",
      onSubmit: J(b, ["prevent"])
    }, [
      c[3] || (c[3] = k("p", { class: "connect-lead" }, "Connect this journal to your team's shared server to read and share documents, sequences and checks.", -1)),
      f(e(K), {
        label: "Address",
        for: "library-address",
        help: "An IP address or a web address, such as 10.0.0.5 or https://library.example.com."
      }, {
        default: R(() => [
          f(e(G), {
            id: "library-address",
            modelValue: y.value,
            "onUpdate:modelValue": c[0] || (c[0] = (p) => y.value = p),
            placeholder: "library.example.com",
            "data-library-address": ""
          }, null, 8, ["modelValue"])
        ]),
        _: 1
      }),
      f(e(K), {
        label: "Token",
        for: "library-token",
        help: "The token an admin of the server gave you. It is stored outside the project."
      }, {
        default: R(() => [
          f(e(G), {
            id: "library-token",
            modelValue: l.value,
            "onUpdate:modelValue": c[1] || (c[1] = (p) => l.value = p),
            type: "password",
            autocomplete: "off",
            placeholder: "jsl_...",
            "data-library-token": ""
          }, null, 8, ["modelValue"])
        ]),
        _: 1
      }),
      s.value ? (a(), n("p", Oe, u(s.value), 1)) : g("", !0),
      f(e(A), {
        kind: "primary",
        busy: v.value,
        disabled: !l.value.trim(),
        "data-library-submit": "",
        onClick: b
      }, {
        default: R(() => [...c[2] || (c[2] = [
          V("Connect", -1)
        ])]),
        _: 1
      }, 8, ["busy", "disabled"])
    ], 32));
  }
}, Ve = /* @__PURE__ */ D(Te, [["__scopeId", "data-v-5b788b3e"]]);
function Ae(i, L) {
  const $ = i === "" ? [] : i.split(`
`), t = L === "" ? [] : L.split(`
`), h = Array.from({ length: $.length + 1 }, () => new Array(t.length + 1).fill(0));
  for (let v = $.length - 1; v >= 0; v--)
    for (let b = t.length - 1; b >= 0; b--)
      h[v][b] = $[v] === t[b] ? h[v + 1][b + 1] + 1 : Math.max(h[v + 1][b], h[v][b + 1]);
  const y = [];
  let l = 0, s = 0;
  for (; l < $.length || s < t.length; )
    l < $.length && s < t.length && $[l] === t[s] ? y.push({ line_type: "ctx", line: s + 1, text: t[s++] }) && l++ : s < t.length && (l === $.length || h[l][s + 1] >= h[l + 1][s]) ? y.push({ line_type: "add", line: s + 1, text: t[s++] }) : y.push({ line_type: "del", line: null, text: $[l++] });
  return { rows: y, added: y.filter((v) => v.line_type === "add").length, removed: y.filter((v) => v.line_type === "del").length };
}
const Ie = {
  class: "compare",
  "data-library-compare": ""
}, je = {
  key: 0,
  "data-library-same": ""
}, Ne = {
  __name: "CopyCompare",
  props: { here: { type: Object, required: !0 }, library: { type: Object, required: !0 }, at: { type: String, required: !0 } },
  setup(i) {
    const L = i, $ = E(
      () => Object.keys({ ...L.here, ...L.library }).map((t) => ({ name: t, ...Ae(String(L.here[t] ?? ""), String(L.library[t] ?? "")) })).filter((t) => t.added || t.removed)
    );
    return (t, h) => (a(), n("div", Ie, [
      h[0] || (h[0] = k("p", { class: "compare-help" }, "Red lines are only on this journal. Green lines are only in the library.", -1)),
      $.value.length ? g("", !0) : (a(), n("p", je, "The two versions have the same text.")),
      (a(!0), n(j, null, B($.value, (y) => (a(), I(e(ne), {
        key: y.name,
        path: y.name,
        kind: "edit",
        added: y.added,
        removed: y.removed,
        at: i.at,
        rows: y.rows,
        "data-library-diff": ""
      }, null, 8, ["path", "added", "removed", "at", "rows"]))), 128))
    ]));
  }
}, Pe = /* @__PURE__ */ D(Ne, [["__scopeId", "data-v-2ce13660"]]), qe = ["data-library-copy", "data-status"], Ee = { class: "copy-title" }, De = {
  class: "copy-facts",
  "data-copy-facts": ""
}, Be = { class: "copy-buttons" }, We = {
  __name: "LibraryCopyRow",
  props: { copy: { type: Object, required: !0 }, role: { type: String, required: !0 } },
  emits: ["choose"],
  setup(i, { emit: L }) {
    const $ = { doc: "Document", sequence: "Sequence", check: "Check" }, t = {
      compare: "Compare",
      read: "Read",
      mine: "Keep mine",
      send: "Send",
      library: "Use the library's version",
      leave: "Stop following"
    }, h = {
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
    }, y = { admin: "Admin", edit: "Edit", read: "Read-only" }, l = i, s = L, v = E(() => h[l.copy.status].map((S) => ({ key: S, label: t[S] }))), b = E(() => {
      const S = [];
      return l.copy.status === "denied" && S.push(`Role: ${y[l.role]}`), l.copy.status === "denied" && l.copy.server_version > l.copy.version && S.push("A newer version is in the library"), l.copy.status === "agent" && S.push("An agent changed this item. A person sends it to the team."), l.copy.status === "removed" && S.push("Your copy stays on this journal."), l.copy.note && S.push(l.copy.note), S;
    });
    return (S, c) => (a(), n("li", {
      class: "copy",
      "data-library-copy": i.copy.copy_id,
      "data-status": i.copy.status
    }, [
      k("span", Ee, u($[i.copy.share]) + " " + u(i.copy.row_id) + ", " + u(i.copy.local_fields.title), 1),
      k("span", De, "Status: " + u(i.copy.label) + ", Version: " + u(i.copy.version), 1),
      (a(!0), n(j, null, B(b.value, (p) => (a(), n("span", {
        key: p,
        class: "copy-line",
        "data-copy-line": ""
      }, u(p), 1))), 128)),
      k("span", Be, [
        (a(!0), n(j, null, B(v.value, (p) => (a(), I(e(A), {
          key: p.key,
          small: "",
          kind: p.key === "library" ? "primary" : void 0,
          "data-copy-button": p.key,
          onClick: (x) => s("choose", i.copy, p.key)
        }, {
          default: R(() => [
            V(u(p.label), 1)
          ]),
          _: 2
        }, 1032, ["kind", "data-copy-button", "onClick"]))), 128))
      ])
    ], 8, qe));
  }
}, Ue = /* @__PURE__ */ D(We, [["__scopeId", "data-v-a32a6821"]]), Me = {
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
  setup(i, { emit: L }) {
    const $ = L, t = U(), h = ["doc"], y = T(""), l = T(null), s = T(null), { refusal: v, run: b } = M(async () => $("changed"));
    async function S(o) {
      if (Object.keys(o.server_fields).length) return o.server_fields;
      const _ = await t.read(`library show ${o.share} ${o.item_id}`);
      return v.value = _.ok ? "" : _.error, _.ok ? _.value.fields : null;
    }
    async function c(o, _ = !1) {
      const w = await S(o);
      s.value = w ? { copy: o, there: w, isTaking: _ } : null;
    }
    async function p(o) {
      s.value = null, await b(["library", "resolve", String(o.copy_id), "--keep", "library"]);
    }
    const x = {
      compare: (o) => c(o),
      read: (o) => c(o),
      send: (o) => b(["library", "resolve", String(o.copy_id), "--keep", "mine"]),
      mine: (o) => b(["library", "resolve", String(o.copy_id), "--keep", "mine"]),
      library: (o) => h.includes(o.share) ? p(o) : c(o, !0),
      leave: (o) => b(["library", "leave", String(o.copy_id)])
    };
    async function C() {
      const [o, _, ...w] = y.value.trim().split(/\s+/);
      if (!o || !/^\d+$/.test(_ ?? "") || w.length) return void (v.value = "Write the kind and the number, such as doc 63.");
      const O = await b(["library", "share", o, _]);
      l.value = O.ok ? O.value : null, O.ok && (y.value = "");
    }
    return (o, _) => (a(), n("div", Me, [
      i.canWrite ? (a(), n("form", {
        key: 0,
        class: "copies-share",
        "data-library-share": "",
        onSubmit: J(C, ["prevent"])
      }, [
        f(e(K), {
          label: "Share with the team",
          for: "library-share",
          help: "The kind and the number of the item on this journal, such as doc 63."
        }, {
          default: R(() => [
            f(e(G), {
              id: "library-share",
              modelValue: y.value,
              "onUpdate:modelValue": _[0] || (_[0] = (w) => y.value = w),
              placeholder: "doc 63",
              "data-library-share-field": ""
            }, null, 8, ["modelValue"])
          ]),
          _: 1
        }),
        f(e(A), {
          kind: "primary",
          disabled: !y.value.trim(),
          "data-library-share-submit": "",
          onClick: C
        }, {
          default: R(() => [..._[4] || (_[4] = [
            V("Share", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : g("", !0),
      l.value ? (a(), n(j, { key: 1 }, [
        k("p", Ke, u(l.value.line), 1),
        l.value.warning ? (a(), n("p", Ge, u(l.value.warning), 1)) : g("", !0)
      ], 64)) : g("", !0),
      e(v) ? (a(), n("p", Fe, u(e(v)), 1)) : g("", !0),
      i.copies.length ? g("", !0) : (a(), n("p", He, "No item on this journal follows an item of the library. Get one from the Library tab.")),
      k("ul", Ye, [
        (a(!0), n(j, null, B(i.copies, (w) => (a(), I(Ue, {
          key: w.copy_id,
          copy: w,
          role: i.role,
          onChoose: _[1] || (_[1] = (O, P) => x[P](O))
        }, null, 8, ["copy", "role"]))), 128))
      ]),
      s.value ? (a(), I(e(ae), {
        key: 4,
        title: `Compare: ${s.value.copy.local_fields.title}`,
        onClose: _[3] || (_[3] = (w) => s.value = null)
      }, {
        default: R(() => [
          k("div", Je, [
            h.includes(s.value.copy.share) ? g("", !0) : (a(), n("p", ze, "The text on this journal is lost when you use the library's version: a " + u(s.value.copy.share) + " keeps no earlier versions.", 1)),
            f(Pe, {
              here: s.value.copy.local_fields,
              library: s.value.there,
              at: (/* @__PURE__ */ new Date()).toISOString()
            }, null, 8, ["here", "library", "at"]),
            s.value.isTaking ? (a(), I(e(A), {
              key: 1,
              kind: "primary",
              "data-library-take": "",
              onClick: _[2] || (_[2] = (w) => p(s.value.copy))
            }, {
              default: R(() => [..._[5] || (_[5] = [
                V("Use the library's version", -1)
              ])]),
              _: 1
            })) : g("", !0)
          ])
        ]),
        _: 1
      }, 8, ["title"])) : g("", !0)
    ]));
  }
}, Xe = /* @__PURE__ */ D(Qe, [["__scopeId", "data-v-57ff56d0"]]), Ze = ["data-people-user"], ea = { class: "person-name" }, aa = {
  key: 0,
  class: "person-facts",
  "data-people-removed": ""
}, ta = {
  key: 2,
  class: "person-failure",
  role: "alert",
  "data-people-failure": ""
}, la = {
  key: 3,
  class: "person-tokens",
  "data-people-token-list": ""
}, ra = ["data-people-token"], sa = {
  key: 0,
  "data-people-revoked": ""
}, na = {
  __name: "LibraryPerson",
  props: { user: { type: Object, required: !0 } },
  emits: ["role", "remove"],
  setup(i, { emit: L }) {
    const $ = [
      { key: "admin", label: "Admin" },
      { key: "edit", label: "Edit" },
      { key: "read", label: "Read-only" }
    ], t = i, h = L, y = U(), l = T(null), s = T("");
    async function v() {
      const p = await y.read(`library-user tokens ${t.user.id}`);
      s.value = p.ok ? "" : p.error, l.value = p.ok ? p.value.tokens : null;
    }
    async function b() {
      if (l.value) return void (l.value = null);
      await v();
    }
    const { refusal: S, run: c } = M(v);
    return (p, x) => (a(), n("li", {
      class: "person",
      "data-people-user": i.user.id
    }, [
      k("span", ea, u(i.user.name), 1),
      i.user.removed_at ? (a(), n("span", aa, "Removed")) : (a(), n(j, { key: 1 }, [
        f(e(F), {
          options: $,
          value: i.user.role,
          "data-people-role": "",
          onPick: x[0] || (x[0] = (C) => h("role", i.user, C))
        }, null, 8, ["value"]),
        f(e(A), {
          small: "",
          "data-people-tokens": "",
          onClick: b
        }, {
          default: R(() => [...x[2] || (x[2] = [
            V("Tokens", -1)
          ])]),
          _: 1
        }),
        f(e(A), {
          small: "",
          kind: "danger",
          "data-people-remove": "",
          onClick: x[1] || (x[1] = (C) => h("remove", i.user))
        }, {
          default: R(() => [...x[3] || (x[3] = [
            V("Remove user", -1)
          ])]),
          _: 1
        })
      ], 64)),
      s.value || e(S) ? (a(), n("p", ta, u(s.value || e(S)), 1)) : g("", !0),
      l.value ? (a(), n("ul", la, [
        (a(!0), n(j, null, B(l.value, (C) => (a(), n("li", {
          key: C.id,
          "data-people-token": C.id
        }, [
          k("span", null, u(C.label || "No label") + ", Last used: " + u(C.last_used_at || "never"), 1),
          C.revoked_at ? (a(), n("span", sa, "Revoked")) : (a(), I(e(A), {
            key: 1,
            small: "",
            kind: "danger",
            "data-people-revoke": "",
            onClick: (o) => e(c)(["library-user", "revoke", String(C.id)])
          }, {
            default: R(() => [...x[4] || (x[4] = [
              V("Revoke", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]))
        ], 8, ra))), 128))
      ])) : g("", !0)
    ], 8, Ze));
  }
}, oa = /* @__PURE__ */ D(na, [["__scopeId", "data-v-d58382ff"]]), ia = {
  class: "people",
  "data-library-people": ""
}, da = {
  key: 0,
  class: "people-token",
  "data-people-first-token": ""
}, ua = {
  key: 1,
  class: "people-failure",
  role: "alert",
  "data-people-refusal": ""
}, ca = {
  __name: "LibraryPeople",
  setup(i) {
    const L = [
      { key: "admin", label: "Admin" },
      { key: "edit", label: "Edit" },
      { key: "read", label: "Read-only" }
    ], { value: $, failure: t, load: h } = Y(() => "library-user list"), { refusal: y, run: l } = M(h), s = T(""), v = T("read"), b = T(null);
    async function S() {
      const c = await l(["library-user", "add", s.value.trim(), "--role", v.value]);
      b.value = c.ok ? c.value : null, c.ok && (s.value = "");
    }
    return h(), (c, p) => {
      var x;
      return a(), n("div", ia, [
        k("form", {
          class: "people-add",
          "data-people-add": "",
          onSubmit: J(S, ["prevent"])
        }, [
          f(e(K), {
            label: "Add a user",
            for: "people-name",
            help: "Their first token is shown once, below."
          }, {
            default: R(() => [
              f(e(G), {
                id: "people-name",
                modelValue: s.value,
                "onUpdate:modelValue": p[0] || (p[0] = (C) => s.value = C),
                placeholder: "Name",
                "data-people-name": ""
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          f(e(F), {
            options: L,
            value: v.value,
            "data-people-new-role": "",
            onPick: p[1] || (p[1] = (C) => v.value = C)
          }, null, 8, ["value"]),
          f(e(A), {
            kind: "primary",
            disabled: !s.value.trim(),
            "data-people-submit": "",
            onClick: S
          }, {
            default: R(() => [...p[4] || (p[4] = [
              V("Add the user", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ], 32),
        b.value ? (a(), n("p", da, u(b.value.user.name) + " has this token, shown once: " + u(b.value.token_text), 1)) : g("", !0),
        e(y) ? (a(), n("p", ua, u(e(y)), 1)) : g("", !0),
        f(e(ee), {
          rows: ((x = e($)) == null ? void 0 : x.users) ?? [],
          failure: e(t),
          loaded: !!e($) || !!e(t),
          empty: "No users yet",
          hint: "The users of the shared server appear here."
        }, {
          default: R(({ row: C }) => [
            f(oa, {
              user: C,
              onRole: p[2] || (p[2] = (o, _) => e(l)(["library-user", "role", String(o.id), _])),
              onRemove: p[3] || (p[3] = (o) => e(l)(["library-user", "remove", String(o.id)]))
            }, null, 8, ["user"])
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]);
    };
  }
}, ya = /* @__PURE__ */ D(ca, [["__scopeId", "data-v-29247035"]]), pa = {
  class: "teams",
  "data-teams": ""
}, va = { class: "teams-top" }, ma = {
  key: 0,
  class: "teams-failure",
  role: "alert",
  "data-teams-failure": ""
}, ba = {
  key: 1,
  class: "teams-failure",
  role: "alert",
  "data-teams-refusal": ""
}, ka = {
  class: "teams-header",
  "data-teams-header": ""
}, fa = { "data-teams-server": "" }, ha = { "data-teams-role": "" }, _a = {
  key: 0,
  "data-teams-reached": ""
}, ga = {
  key: 1,
  "data-teams-plain": ""
}, $a = {
  key: 0,
  class: "teams-stopped",
  role: "alert",
  "data-teams-stopped": ""
}, Sa = 5e3, Ca = {
  __name: "TeamsPage",
  setup(i) {
    const L = { admin: "Admin", edit: "Edit", read: "Read-only" }, $ = U(), { value: t, failure: h, load: y } = Y(() => "library status"), { value: l, load: s } = Y(() => "library copies"), v = T("library"), b = E(() => {
      var w;
      return !!((w = t.value) != null && w.is_connected) && !t.value.stopped;
    }), S = E(() => {
      var w, O;
      return ((w = t.value) == null ? void 0 : w.role) === "admin" || ((O = t.value) == null ? void 0 : O.role) === "edit";
    }), c = E(() => {
      var w;
      return ((w = l.value) == null ? void 0 : w.rows) ?? [];
    }), p = E(() => {
      var w;
      return ((w = t.value) == null ? void 0 : w.role) === "admin";
    }), x = E(() => [
      { key: "library", label: "Library" },
      { key: "copies", label: "On this journal", count: c.value.length },
      ...p.value ? [{ key: "people", label: "People" }] : []
    ]);
    async function C() {
      await Promise.all([y(), s()]);
    }
    const { refusal: o, run: _ } = M(C);
    return oe(C, () => !0, Sa), re(() => $.follow(["library_copy.*"], C)), (w, O) => (a(), I(e(ie), null, {
      default: R(() => {
        var P;
        return [
          k("div", pa, [
            k("div", va, [
              O[3] || (O[3] = k("h2", { class: "teams-title" }, "Teams", -1)),
              b.value ? (a(), I(e(A), {
                key: 0,
                small: "",
                "data-teams-sync": "",
                onClick: O[0] || (O[0] = (W) => e(_)(["library", "sync"]))
              }, {
                default: R(() => [...O[2] || (O[2] = [
                  V("Sync now", -1)
                ])]),
                _: 1
              })) : g("", !0)
            ]),
            e(h) ? (a(), n("p", ma, u(e(h)), 1)) : g("", !0),
            e(o) ? (a(), n("p", ba, u(e(o)), 1)) : g("", !0),
            (P = e(t)) != null && P.is_connected ? (a(), n(j, { key: 2 }, [
              k("div", ka, [
                k("span", fa, "Connected: " + u(e(t).server_name), 1),
                k("span", ha, "Role: " + u(L[e(t).role]), 1),
                e(t).reached_at ? (a(), n("span", _a, [
                  O[4] || (O[4] = V("Last reached: ", -1)),
                  f(e(H), {
                    at: e(t).reached_at
                  }, null, 8, ["at"])
                ])) : g("", !0),
                e(t).is_encrypted ? g("", !0) : (a(), n("span", ga, "Connection: not encrypted"))
              ]),
              e(t).stopped ? (a(), n("p", $a, u(e(t).stopped), 1)) : g("", !0)
            ], 64)) : g("", !0),
            e(t) && !b.value ? (a(), I(Ve, {
              key: 3,
              address: e(t).address,
              onConnected: C
            }, null, 8, ["address"])) : g("", !0),
            b.value ? (a(), n(j, { key: 4 }, [
              f(e(F), {
                options: x.value,
                value: v.value,
                "data-teams-tabs": "",
                onPick: O[1] || (O[1] = (W) => v.value = W)
              }, null, 8, ["options", "value"]),
              f(e(de), { value: v.value }, {
                library: R(() => [
                  f(Le, {
                    role: e(t).role,
                    "can-write": S.value,
                    onChanged: C
                  }, null, 8, ["role", "can-write"])
                ]),
                copies: R(() => [
                  f(Xe, {
                    copies: c.value,
                    role: e(t).role,
                    "can-write": S.value,
                    onChanged: C
                  }, null, 8, ["copies", "role", "can-write"])
                ]),
                people: R(() => [
                  f(ya)
                ]),
                _: 1
              }, 8, ["value"])
            ], 64)) : g("", !0)
          ])
        ];
      }),
      _: 1
    }));
  }
}, xa = /* @__PURE__ */ D(Ca, [["__scopeId", "data-v-beceaea8"]]);
export {
  xa as default
};
