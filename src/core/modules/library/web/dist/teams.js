/* @code-commandments-generated */
if (!document.getElementById("window-styles-fb8cdbfdd2ea")) { const style = document.createElement("style"); style.id = "window-styles-fb8cdbfdd2ea"; style.textContent = ".library[data-v-f2ee2e34]{display:flex;flex-direction:column;gap:10px}.library-row[data-v-f2ee2e34]{display:flex;align-items:center;gap:10px;padding:6px 0}.library-open[data-v-f2ee2e34]{display:flex;flex:1;flex-direction:column;gap:2px;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.library-title[data-v-f2ee2e34]{font-weight:600}.library-abstract[data-v-f2ee2e34],.library-excerpt[data-v-f2ee2e34],.library-facts[data-v-f2ee2e34],.library-here[data-v-f2ee2e34]{color:var(--text-3);font-size:12px}.library-failure[data-v-f2ee2e34],.library-warning[data-v-f2ee2e34]{margin:0;color:var(--danger);font-size:13px}.library-fields dt[data-v-f2ee2e34]{margin-top:8px;color:var(--text-3);font-size:12px}.library-fields dd[data-v-f2ee2e34]{margin:2px 0 0;white-space:pre-wrap}.library-versions[data-v-f2ee2e34]{padding:0;list-style:none}.library-versions li[data-v-f2ee2e34]{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 0;font-size:13px}.connect[data-v-3067baef]{display:flex;flex-direction:column;gap:12px;max-width:420px}.connect-lead[data-v-3067baef]{margin:0;color:var(--text-2);font-size:13px}.connect-failure[data-v-3067baef]{margin:0;color:var(--danger);font-size:13px}.compare[data-v-a6494d43]{display:flex;flex-direction:column;gap:10px}.compare-help[data-v-a6494d43]{margin:0;color:var(--text-3);font-size:12px}.copy[data-v-eb9c7ddf]{display:flex;flex-direction:column;gap:3px;padding:8px 0}.copy-title[data-v-eb9c7ddf]{font-weight:600}.copy-facts[data-v-eb9c7ddf],.copy-line[data-v-eb9c7ddf]{color:var(--text-3);font-size:12px}.copy-buttons[data-v-eb9c7ddf]{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}.copies[data-v-238e1e7f]{display:flex;flex-direction:column;gap:10px}.copies-share[data-v-238e1e7f]{display:flex;align-items:flex-end;gap:8px}.copies-list[data-v-238e1e7f]{margin:0;padding:0;list-style:none}.copies-failure[data-v-238e1e7f]{margin:0;color:var(--danger);font-size:13px}.copies-empty[data-v-238e1e7f]{margin:0;color:var(--text-3);font-size:13px}.person[data-v-cd12fcad]{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;padding:8px 0}.person-name[data-v-cd12fcad]{min-width:120px;font-weight:600}.person-facts[data-v-cd12fcad],.person-tokens[data-v-cd12fcad]{color:var(--text-3);font-size:12px}.person-tokens[data-v-cd12fcad]{flex-basis:100%;margin:0;padding:0 0 0 16px;list-style:none}.person-tokens li[data-v-cd12fcad]{display:flex;align-items:center;gap:10px;padding:2px 0}.person-failure[data-v-cd12fcad]{flex-basis:100%;margin:0;color:var(--danger);font-size:13px}.people[data-v-dde5182e]{display:flex;flex-direction:column;gap:10px}.people-add[data-v-dde5182e]{display:flex;align-items:flex-end;gap:10px}.people-token[data-v-dde5182e]{margin:0;font-family:var(--mono);font-size:12px;word-break:break-all}.people-failure[data-v-dde5182e]{margin:0;color:var(--danger);font-size:13px}.teams[data-v-beceaea8]{display:flex;flex-direction:column;gap:10px}.teams-top[data-v-beceaea8]{display:flex;align-items:center;justify-content:space-between}.teams-title[data-v-beceaea8]{margin:0;font-size:16px}.teams-header[data-v-beceaea8]{display:flex;flex-wrap:wrap;gap:6px 18px;color:var(--text-2);font-size:13px}.teams-failure[data-v-beceaea8],.teams-stopped[data-v-beceaea8]{margin:0;color:var(--danger);font-size:13px}\n"; document.head.appendChild(style); }
import { ref as O, watch as Z, openBlock as a, createElementBlock as o, createVNode as h, unref as e, toDisplayString as u, createCommentVNode as g, createElementVNode as f, withCtx as R, createTextVNode as V, createBlock as P, Fragment as E, renderList as D, withModifiers as J, computed as N, onMounted as le } from "vue";
import { useWindow as U, useRunLine as M, SearchBar as se, Segmented as F, Btn as A, RowList as ee, TimeAgo as H, SidePanel as ae, FormField as Y, TextInput as G, DiffCard as oe, useReadLine as K, usePoll as ne, WindowRoom as ie, SwitchCase as de } from "@journal/window-kit";
const B = (i, L) => {
  const $ = i.__vccOpts || i;
  for (const [t, k] of L)
    $[t] = k;
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
}, pe = { "data-library-command": "" }, ve = ["data-library-item"], me = ["onClick"], be = { class: "library-title" }, fe = {
  key: 0,
  class: "library-excerpt",
  "data-library-excerpt": ""
}, he = {
  key: 1,
  class: "library-abstract"
}, ke = { class: "library-facts" }, _e = {
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
    ], t = ["doc", "sequence", "check"], k = { doc: "Document", sequence: "Sequence", check: "Check" }, y = U(), r = O(""), s = O(""), v = O([]), b = O(!1), S = O(""), c = O(null), p = O([]), x = O(null), C = L, { refusal: n, run: _ } = M(async () => {
      await I(), C("changed");
    });
    let w = 0;
    const T = (m) => `${m.share}:${m.id}`;
    async function I() {
      const m = s.value.trim(), l = await Promise.all((r.value ? [r.value] : t).map((j) => y.read(`library list --type ${j}${m ? ` --search ${JSON.stringify(m)}` : ""}`))), d = l.find((j) => !j.ok);
      S.value = d ? d.error : "";
      const q = d ? [] : l.flatMap((j) => j.value.rows);
      v.value = [...new Map(q.map((j) => [T(j), j])).values()].map((j) => ({ ...j, item_id: j.id, id: T(j) })), b.value = !0;
    }
    async function W(m) {
      const [l, d] = await Promise.all([y.read(`library show ${m.share} ${m.item_id}`), y.read(`library versions ${m.share} ${m.item_id}`)]);
      n.value = l.ok ? "" : l.error, c.value = l.ok ? { ...l.value, title: m.title } : null, p.value = d.ok ? d.value.versions : [];
    }
    async function z() {
      const m = c.value;
      await W({ share: m.share, item_id: m.id, title: m.title });
    }
    async function te(m) {
      (await _(["library", "remove", m.share, String(m.item_id ?? m.id)])).ok && c.value && await z();
    }
    async function Q(m, l = null) {
      (await _(["library", "restore", m.share, String(m.id), ...l ? ["--version", String(l)] : []])).ok && await z();
    }
    async function re(m) {
      const l = await y.read(`library show check ${m.item_id}`);
      n.value = l.ok ? "" : l.error, x.value = l.ok ? { ...m, command: l.value.fields.command } : null;
    }
    async function X(m) {
      var l;
      if (m.share === "check" && ((l = x.value) == null ? void 0 : l.id) !== m.id) return void await re(m);
      x.value = null, await _(["library", "get", m.share, String(m.item_id), ...m.share === "check" ? ["--read"] : []]);
    }
    return Z(r, I, { immediate: !0 }), Z(s, () => {
      clearTimeout(w), w = setTimeout(I, Re);
    }), (m, l) => (a(), o("div", ue, [
      h(e(se), {
        modelValue: s.value,
        "onUpdate:modelValue": l[0] || (l[0] = (d) => s.value = d),
        placeholder: "Search the library",
        "data-library-search": ""
      }, null, 8, ["modelValue"]),
      h(e(F), {
        options: $,
        value: r.value,
        "data-library-type": "",
        onPick: l[1] || (l[1] = (d) => r.value = d)
      }, null, 8, ["value"]),
      e(n) ? (a(), o("p", ce, u(e(n)), 1)) : g("", !0),
      x.value ? (a(), o("div", ye, [
        l[8] || (l[8] = f("p", null, "This check runs this command on your computer when someone starts it:", -1)),
        f("pre", pe, u(x.value.command), 1),
        h(e(A), {
          small: "",
          onClick: l[2] || (l[2] = (d) => x.value = null)
        }, {
          default: R(() => [...l[6] || (l[6] = [
            V("Cancel", -1)
          ])]),
          _: 1
        }),
        h(e(A), {
          small: "",
          variant: "primary",
          "data-library-confirm": "",
          onClick: l[3] || (l[3] = (d) => X(x.value))
        }, {
          default: R(() => [...l[7] || (l[7] = [
            V("Get the check, stopped", -1)
          ])]),
          _: 1
        })
      ])) : g("", !0),
      h(e(ee), {
        rows: v.value,
        failure: S.value,
        loaded: b.value,
        searching: !!(s.value.trim() || r.value),
        empty: "Nothing in the library yet",
        hint: "Shared documents, sequences and checks appear here."
      }, {
        default: R(({ row: d }) => [
          f("div", {
            class: "library-row",
            "data-library-item": d.id
          }, [
            f("button", {
              type: "button",
              class: "library-open",
              "data-library-open": "",
              onClick: (q) => W(d)
            }, [
              f("span", be, u(d.title), 1),
              d.excerpt ? (a(), o("span", fe, u(d.excerpt), 1)) : (a(), o("span", he, u(d.abstract), 1)),
              f("span", ke, [
                V(u(k[d.share]) + ", Version: " + u(d.version) + ", Changed by: " + u(d.updated_by) + ", ", 1),
                h(e(H), {
                  at: d.updated_at
                }, null, 8, ["at"])
              ])
            ], 8, me),
            d.copy_id ? (a(), o("span", _e, "On this journal")) : (a(), P(e(A), {
              key: 1,
              small: "",
              variant: "primary",
              "data-library-get": "",
              onClick: (q) => X(d)
            }, {
              default: R(() => [...l[9] || (l[9] = [
                V("Get", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])),
            i.role === "admin" ? (a(), P(e(A), {
              key: 2,
              small: "",
              variant: "danger",
              "data-library-remove": "",
              onClick: (q) => te(d)
            }, {
              default: R(() => [...l[10] || (l[10] = [
                V("Remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])) : g("", !0)
          ], 8, ve)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "searching"]),
      c.value ? (a(), P(e(ae), {
        key: 2,
        title: c.value.title,
        onClose: l[5] || (l[5] = (d) => c.value = null)
      }, {
        default: R(() => [
          f("div", ge, [
            c.value.removed_at ? (a(), o(E, { key: 0 }, [
              l[12] || (l[12] = f("p", {
                class: "library-removed",
                "data-library-removed": ""
              }, "Removed from the library", -1)),
              i.role === "admin" ? (a(), P(e(A), {
                key: 0,
                small: "",
                variant: "primary",
                "data-library-restore": "",
                onClick: l[4] || (l[4] = (d) => Q(c.value))
              }, {
                default: R(() => [...l[11] || (l[11] = [
                  V("Restore", -1)
                ])]),
                _: 1
              })) : g("", !0)
            ], 64)) : g("", !0),
            f("p", $e, u(k[c.value.share]) + ", Version: " + u(c.value.version) + ", Changed by: " + u(c.value.updated_by), 1),
            f("dl", Se, [
              (a(!0), o(E, null, D(c.value.fields, (d, q) => (a(), o(E, { key: q }, [
                f("dt", null, u(q), 1),
                f("dd", null, u(d), 1)
              ], 64))), 128))
            ]),
            l[14] || (l[14] = f("h3", { class: "library-heading" }, "Versions", -1)),
            f("ul", Ce, [
              (a(!0), o(E, null, D(p.value, (d) => (a(), o("li", {
                key: d.version,
                "data-library-version": d.version
              }, [
                f("span", null, [
                  V("Version: " + u(d.version) + ", Changed by: " + u(d.user) + ", ", 1),
                  h(e(H), {
                    at: d.created_at
                  }, null, 8, ["at"])
                ]),
                i.canWrite && d.version !== c.value.version ? (a(), P(e(A), {
                  key: 0,
                  small: "",
                  "data-library-restore-version": "",
                  onClick: (q) => Q(c.value, d.version)
                }, {
                  default: R(() => [...l[13] || (l[13] = [
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
}, Le = /* @__PURE__ */ B(xe, [["__scopeId", "data-v-f2ee2e34"]]), Te = {
  key: 0,
  class: "connect-failure",
  role: "alert",
  "data-library-refusal": ""
}, Oe = {
  __name: "LibraryConnect",
  props: { address: { type: String, default: "" } },
  emits: ["connected"],
  setup(i, { emit: L }) {
    const $ = i, t = L, k = U(), y = O($.address), r = O(""), s = O(""), v = O(!1);
    async function b() {
      v.value = !0;
      const S = await k.run(["library", "connect", ...y.value.trim() ? [y.value.trim()] : [], "--token", r.value.trim()]);
      v.value = !1, s.value = S.ok ? "" : S.error, S.ok && (r.value = "", t("connected"));
    }
    return (S, c) => (a(), o("form", {
      class: "connect",
      "data-library-connect": "",
      onSubmit: J(b, ["prevent"])
    }, [
      c[3] || (c[3] = f("p", { class: "connect-lead" }, "Connect this journal to your team's shared server to read and share documents, sequences and checks.", -1)),
      h(e(Y), {
        label: "Address",
        for: "library-address",
        help: "An IP address or a web address, such as 10.0.0.5 or https://library.example.com."
      }, {
        default: R(() => [
          h(e(G), {
            id: "library-address",
            modelValue: y.value,
            "onUpdate:modelValue": c[0] || (c[0] = (p) => y.value = p),
            placeholder: "library.example.com",
            "data-library-address": ""
          }, null, 8, ["modelValue"])
        ]),
        _: 1
      }),
      h(e(Y), {
        label: "Token",
        for: "library-token",
        help: "The token an admin of the server gave you. It is stored outside the project."
      }, {
        default: R(() => [
          h(e(G), {
            id: "library-token",
            modelValue: r.value,
            "onUpdate:modelValue": c[1] || (c[1] = (p) => r.value = p),
            type: "password",
            autocomplete: "off",
            placeholder: "jsl_...",
            "data-library-token": ""
          }, null, 8, ["modelValue"])
        ]),
        _: 1
      }),
      s.value ? (a(), o("p", Te, u(s.value), 1)) : g("", !0),
      h(e(A), {
        variant: "primary",
        busy: v.value,
        disabled: !r.value.trim(),
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
}, Ve = /* @__PURE__ */ B(Oe, [["__scopeId", "data-v-3067baef"]]);
function Ae(i, L) {
  const $ = i === "" ? [] : i.split(`
`), t = L === "" ? [] : L.split(`
`), k = Array.from({ length: $.length + 1 }, () => new Array(t.length + 1).fill(0));
  for (let v = $.length - 1; v >= 0; v--)
    for (let b = t.length - 1; b >= 0; b--)
      k[v][b] = $[v] === t[b] ? k[v + 1][b + 1] + 1 : Math.max(k[v + 1][b], k[v][b + 1]);
  const y = [];
  let r = 0, s = 0;
  for (; r < $.length || s < t.length; )
    r < $.length && s < t.length && $[r] === t[s] ? y.push({ line_type: "ctx", line: s + 1, text: t[s++] }) && r++ : s < t.length && (r === $.length || k[r][s + 1] >= k[r + 1][s]) ? y.push({ line_type: "add", line: s + 1, text: t[s++] }) : y.push({ line_type: "del", line: null, text: $[r++] });
  return { rows: y, added: y.filter((v) => v.line_type === "add").length, removed: y.filter((v) => v.line_type === "del").length };
}
const Pe = {
  class: "compare",
  "data-library-compare": ""
}, Ee = {
  key: 0,
  "data-library-same": ""
}, je = {
  __name: "CopyCompare",
  props: { here: { type: Object, required: !0 }, library: { type: Object, required: !0 }, at: { type: String, required: !0 } },
  setup(i) {
    const L = i, $ = N(
      () => Object.keys({ ...L.here, ...L.library }).map((t) => ({ name: t, ...Ae(String(L.here[t] ?? ""), String(L.library[t] ?? "")) })).filter((t) => t.added || t.removed)
    );
    return (t, k) => (a(), o("div", Pe, [
      k[0] || (k[0] = f("p", { class: "compare-help" }, "Red lines are only on this journal. Green lines are only in the library.", -1)),
      $.value.length ? g("", !0) : (a(), o("p", Ee, "The two versions have the same text.")),
      (a(!0), o(E, null, D($.value, (y) => (a(), P(e(oe), {
        key: y.name,
        path: y.name,
        change: "edit",
        added: y.added,
        removed: y.removed,
        at: i.at,
        rows: y.rows,
        "data-library-diff": ""
      }, null, 8, ["path", "added", "removed", "at", "rows"]))), 128))
    ]));
  }
}, Ie = /* @__PURE__ */ B(je, [["__scopeId", "data-v-a6494d43"]]), qe = ["data-library-copy", "data-status"], Ne = { class: "copy-title" }, Be = {
  class: "copy-facts",
  "data-copy-facts": ""
}, De = { class: "copy-buttons" }, We = {
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
    }, k = {
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
    }, y = { admin: "Admin", edit: "Edit", read: "Read-only" }, r = i, s = L, v = N(() => k[r.copy.status].map((S) => ({ key: S, label: t[S] }))), b = N(() => {
      const S = [];
      return r.copy.status === "denied" && S.push(`Role: ${y[r.role]}`), r.copy.status === "denied" && r.copy.server_version > r.copy.version && S.push("A newer version is in the library"), r.copy.status === "agent" && S.push("An agent changed this item. A person sends it to the team."), r.copy.status === "removed" && S.push("Your copy stays on this journal."), r.copy.note && S.push(r.copy.note), S;
    });
    return (S, c) => (a(), o("li", {
      class: "copy",
      "data-library-copy": i.copy.copy_id,
      "data-status": i.copy.status
    }, [
      f("span", Ne, u($[i.copy.share]) + " " + u(i.copy.row_id) + ", " + u(i.copy.local_fields.title), 1),
      f("span", Be, "Status: " + u(i.copy.label) + ", Version: " + u(i.copy.version), 1),
      (a(!0), o(E, null, D(b.value, (p) => (a(), o("span", {
        key: p,
        class: "copy-line",
        "data-copy-line": ""
      }, u(p), 1))), 128)),
      f("span", De, [
        (a(!0), o(E, null, D(v.value, (p) => (a(), P(e(A), {
          key: p.key,
          small: "",
          variant: p.key === "library" ? "primary" : void 0,
          "data-copy-button": p.key,
          onClick: (x) => s("choose", i.copy, p.key)
        }, {
          default: R(() => [
            V(u(p.label), 1)
          ]),
          _: 2
        }, 1032, ["variant", "data-copy-button", "onClick"]))), 128))
      ])
    ], 8, qe));
  }
}, Ue = /* @__PURE__ */ B(We, [["__scopeId", "data-v-eb9c7ddf"]]), Me = {
  class: "copies",
  "data-library-copies": ""
}, Ye = {
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
}, Ke = { class: "copies-list" }, Je = { "data-library-compare-panel": "" }, ze = {
  key: 0,
  class: "copies-failure",
  "data-library-loss": ""
}, Qe = {
  __name: "LibraryCopies",
  props: { copies: { type: Array, required: !0 }, role: { type: String, required: !0 }, canWrite: Boolean },
  emits: ["changed"],
  setup(i, { emit: L }) {
    const $ = L, t = U(), k = ["doc"], y = O(""), r = O(null), s = O(null), { refusal: v, run: b } = M(async () => $("changed"));
    async function S(n) {
      if (Object.keys(n.server_fields).length) return n.server_fields;
      const _ = await t.read(`library show ${n.share} ${n.item_id}`);
      return v.value = _.ok ? "" : _.error, _.ok ? _.value.fields : null;
    }
    async function c(n, _ = !1) {
      const w = await S(n);
      s.value = w ? { copy: n, there: w, isTaking: _ } : null;
    }
    async function p(n) {
      s.value = null, await b(["library", "resolve", String(n.copy_id), "--keep", "library"]);
    }
    const x = {
      compare: (n) => c(n),
      read: (n) => c(n),
      send: (n) => b(["library", "resolve", String(n.copy_id), "--keep", "mine"]),
      mine: (n) => b(["library", "resolve", String(n.copy_id), "--keep", "mine"]),
      library: (n) => k.includes(n.share) ? p(n) : c(n, !0),
      leave: (n) => b(["library", "leave", String(n.copy_id)])
    };
    async function C() {
      const [n, _, ...w] = y.value.trim().split(/\s+/);
      if (!n || !/^\d+$/.test(_ ?? "") || w.length) return void (v.value = "Write the type and the number, such as doc 63.");
      const T = await b(["library", "share", n, _]);
      r.value = T.ok ? T.value : null, T.ok && (y.value = "");
    }
    return (n, _) => (a(), o("div", Me, [
      i.canWrite ? (a(), o("form", {
        key: 0,
        class: "copies-share",
        "data-library-share": "",
        onSubmit: J(C, ["prevent"])
      }, [
        h(e(Y), {
          label: "Share with the team",
          for: "library-share",
          help: "The type and the number of the item on this journal, such as doc 63."
        }, {
          default: R(() => [
            h(e(G), {
              id: "library-share",
              modelValue: y.value,
              "onUpdate:modelValue": _[0] || (_[0] = (w) => y.value = w),
              placeholder: "doc 63",
              "data-library-share-field": ""
            }, null, 8, ["modelValue"])
          ]),
          _: 1
        }),
        h(e(A), {
          variant: "primary",
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
      r.value ? (a(), o(E, { key: 1 }, [
        f("p", Ye, u(r.value.line), 1),
        r.value.warning ? (a(), o("p", Ge, u(r.value.warning), 1)) : g("", !0)
      ], 64)) : g("", !0),
      e(v) ? (a(), o("p", Fe, u(e(v)), 1)) : g("", !0),
      i.copies.length ? g("", !0) : (a(), o("p", He, "No item on this journal follows an item of the library. Get one from the Library tab.")),
      f("ul", Ke, [
        (a(!0), o(E, null, D(i.copies, (w) => (a(), P(Ue, {
          key: w.copy_id,
          copy: w,
          role: i.role,
          onChoose: _[1] || (_[1] = (T, I) => x[I](T))
        }, null, 8, ["copy", "role"]))), 128))
      ]),
      s.value ? (a(), P(e(ae), {
        key: 4,
        title: `Compare: ${s.value.copy.local_fields.title}`,
        onClose: _[3] || (_[3] = (w) => s.value = null)
      }, {
        default: R(() => [
          f("div", Je, [
            k.includes(s.value.copy.share) ? g("", !0) : (a(), o("p", ze, "The text on this journal is lost when you use the library's version: a " + u(s.value.copy.share) + " keeps no earlier versions.", 1)),
            h(Ie, {
              here: s.value.copy.local_fields,
              library: s.value.there,
              at: (/* @__PURE__ */ new Date()).toISOString()
            }, null, 8, ["here", "library", "at"]),
            s.value.isTaking ? (a(), P(e(A), {
              key: 1,
              variant: "primary",
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
}, Xe = /* @__PURE__ */ B(Qe, [["__scopeId", "data-v-238e1e7f"]]), Ze = ["data-people-user"], ea = { class: "person-name" }, aa = {
  key: 0,
  class: "person-facts",
  "data-people-removed": ""
}, ta = {
  key: 2,
  class: "person-failure",
  role: "alert",
  "data-people-failure": ""
}, ra = {
  key: 3,
  class: "person-tokens",
  "data-people-token-list": ""
}, la = ["data-people-token"], sa = {
  key: 0,
  "data-people-revoked": ""
}, oa = {
  __name: "LibraryPerson",
  props: { user: { type: Object, required: !0 } },
  emits: ["role", "remove"],
  setup(i, { emit: L }) {
    const $ = [
      { key: "admin", label: "Admin" },
      { key: "edit", label: "Edit" },
      { key: "read", label: "Read-only" }
    ], t = i, k = L, y = U(), r = O(null), s = O("");
    async function v() {
      const p = await y.read(`library-user tokens ${t.user.id}`);
      s.value = p.ok ? "" : p.error, r.value = p.ok ? p.value.tokens : null;
    }
    async function b() {
      if (r.value) return void (r.value = null);
      await v();
    }
    const { refusal: S, run: c } = M(v);
    return (p, x) => (a(), o("li", {
      class: "person",
      "data-people-user": i.user.id
    }, [
      f("span", ea, u(i.user.name), 1),
      i.user.removed_at ? (a(), o("span", aa, "Removed")) : (a(), o(E, { key: 1 }, [
        h(e(F), {
          options: $,
          value: i.user.role,
          "data-people-role": "",
          onPick: x[0] || (x[0] = (C) => k("role", i.user, C))
        }, null, 8, ["value"]),
        h(e(A), {
          small: "",
          "data-people-tokens": "",
          onClick: b
        }, {
          default: R(() => [...x[2] || (x[2] = [
            V("Tokens", -1)
          ])]),
          _: 1
        }),
        h(e(A), {
          small: "",
          variant: "danger",
          "data-people-remove": "",
          onClick: x[1] || (x[1] = (C) => k("remove", i.user))
        }, {
          default: R(() => [...x[3] || (x[3] = [
            V("Remove user", -1)
          ])]),
          _: 1
        })
      ], 64)),
      s.value || e(S) ? (a(), o("p", ta, u(s.value || e(S)), 1)) : g("", !0),
      r.value ? (a(), o("ul", ra, [
        (a(!0), o(E, null, D(r.value, (C) => (a(), o("li", {
          key: C.id,
          "data-people-token": C.id
        }, [
          f("span", null, u(C.label || "No label") + ", Last used: " + u(C.last_used_at || "never"), 1),
          C.revoked_at ? (a(), o("span", sa, "Revoked")) : (a(), P(e(A), {
            key: 1,
            small: "",
            variant: "danger",
            "data-people-revoke": "",
            onClick: (n) => e(c)(["library-user", "revoke", String(C.id)])
          }, {
            default: R(() => [...x[4] || (x[4] = [
              V("Revoke", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]))
        ], 8, la))), 128))
      ])) : g("", !0)
    ], 8, Ze));
  }
}, na = /* @__PURE__ */ B(oa, [["__scopeId", "data-v-cd12fcad"]]), ia = {
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
    ], { value: $, failure: t, load: k } = K(() => "library-user list"), { refusal: y, run: r } = M(k), s = O(""), v = O("read"), b = O(null);
    async function S() {
      const c = await r(["library-user", "add", s.value.trim(), "--role", v.value]);
      b.value = c.ok ? c.value : null, c.ok && (s.value = "");
    }
    return k(), (c, p) => {
      var x;
      return a(), o("div", ia, [
        f("form", {
          class: "people-add",
          "data-people-add": "",
          onSubmit: J(S, ["prevent"])
        }, [
          h(e(Y), {
            label: "Add a user",
            for: "people-name",
            help: "Their first token is shown once, below."
          }, {
            default: R(() => [
              h(e(G), {
                id: "people-name",
                modelValue: s.value,
                "onUpdate:modelValue": p[0] || (p[0] = (C) => s.value = C),
                placeholder: "Name",
                "data-people-name": ""
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          h(e(F), {
            options: L,
            value: v.value,
            "data-people-new-role": "",
            onPick: p[1] || (p[1] = (C) => v.value = C)
          }, null, 8, ["value"]),
          h(e(A), {
            variant: "primary",
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
        b.value ? (a(), o("p", da, u(b.value.user.name) + " has this token, shown once: " + u(b.value.token_text), 1)) : g("", !0),
        e(y) ? (a(), o("p", ua, u(e(y)), 1)) : g("", !0),
        h(e(ee), {
          rows: ((x = e($)) == null ? void 0 : x.users) ?? [],
          failure: e(t),
          loaded: !!e($) || !!e(t),
          empty: "No users yet",
          hint: "The users of the shared server appear here."
        }, {
          default: R(({ row: C }) => [
            h(na, {
              user: C,
              onRole: p[2] || (p[2] = (n, _) => e(r)(["library-user", "role", String(n.id), _])),
              onRemove: p[3] || (p[3] = (n) => e(r)(["library-user", "remove", String(n.id)]))
            }, null, 8, ["user"])
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]);
    };
  }
}, ya = /* @__PURE__ */ B(ca, [["__scopeId", "data-v-dde5182e"]]), pa = {
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
}, fa = {
  class: "teams-header",
  "data-teams-header": ""
}, ha = { "data-teams-server": "" }, ka = { "data-teams-role": "" }, _a = {
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
    const L = { admin: "Admin", edit: "Edit", read: "Read-only" }, $ = U(), { value: t, failure: k, load: y } = K(() => "library status"), { value: r, load: s } = K(() => "library copies"), v = O("library"), b = N(() => {
      var w;
      return !!((w = t.value) != null && w.is_connected) && !t.value.stopped;
    }), S = N(() => {
      var w, T;
      return ((w = t.value) == null ? void 0 : w.role) === "admin" || ((T = t.value) == null ? void 0 : T.role) === "edit";
    }), c = N(() => {
      var w;
      return ((w = r.value) == null ? void 0 : w.rows) ?? [];
    }), p = N(() => {
      var w;
      return ((w = t.value) == null ? void 0 : w.role) === "admin";
    }), x = N(() => [
      { key: "library", label: "Library" },
      { key: "copies", label: "On this journal", count: c.value.length },
      ...p.value ? [{ key: "people", label: "People" }] : []
    ]);
    async function C() {
      await Promise.all([y(), s()]);
    }
    const { refusal: n, run: _ } = M(C);
    return ne(C, () => !0, Sa), le(() => $.follow(["library_copy.*"], C)), (w, T) => (a(), P(e(ie), null, {
      default: R(() => {
        var I;
        return [
          f("div", pa, [
            f("div", va, [
              T[3] || (T[3] = f("h2", { class: "teams-title" }, "Teams", -1)),
              b.value ? (a(), P(e(A), {
                key: 0,
                small: "",
                "data-teams-sync": "",
                onClick: T[0] || (T[0] = (W) => e(_)(["library", "sync"]))
              }, {
                default: R(() => [...T[2] || (T[2] = [
                  V("Sync now", -1)
                ])]),
                _: 1
              })) : g("", !0)
            ]),
            e(k) ? (a(), o("p", ma, u(e(k)), 1)) : g("", !0),
            e(n) ? (a(), o("p", ba, u(e(n)), 1)) : g("", !0),
            (I = e(t)) != null && I.is_connected ? (a(), o(E, { key: 2 }, [
              f("div", fa, [
                f("span", ha, "Connected: " + u(e(t).server_name), 1),
                f("span", ka, "Role: " + u(L[e(t).role]), 1),
                e(t).reached_at ? (a(), o("span", _a, [
                  T[4] || (T[4] = V("Last reached: ", -1)),
                  h(e(H), {
                    at: e(t).reached_at
                  }, null, 8, ["at"])
                ])) : g("", !0),
                e(t).is_encrypted ? g("", !0) : (a(), o("span", ga, "Connection: not encrypted"))
              ]),
              e(t).stopped ? (a(), o("p", $a, u(e(t).stopped), 1)) : g("", !0)
            ], 64)) : g("", !0),
            e(t) && !b.value ? (a(), P(Ve, {
              key: 3,
              address: e(t).address,
              onConnected: C
            }, null, 8, ["address"])) : g("", !0),
            b.value ? (a(), o(E, { key: 4 }, [
              h(e(F), {
                options: x.value,
                value: v.value,
                "data-teams-tabs": "",
                onPick: T[1] || (T[1] = (W) => v.value = W)
              }, null, 8, ["options", "value"]),
              h(e(de), { value: v.value }, {
                library: R(() => [
                  h(Le, {
                    role: e(t).role,
                    "can-write": S.value,
                    onChanged: C
                  }, null, 8, ["role", "can-write"])
                ]),
                copies: R(() => [
                  h(Xe, {
                    copies: c.value,
                    role: e(t).role,
                    "can-write": S.value,
                    onChanged: C
                  }, null, 8, ["copies", "role", "can-write"])
                ]),
                people: R(() => [
                  h(ya)
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
}, xa = /* @__PURE__ */ B(Ca, [["__scopeId", "data-v-beceaea8"]]);
export {
  xa as default
};
