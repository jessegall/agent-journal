/* @code-commandments-generated */
if (!document.getElementById("window-styles-adca55bb5fbe")) { const style = document.createElement("style"); style.id = "window-styles-adca55bb5fbe"; style.textContent = ".library[data-v-f2ee2e34]{display:flex;flex-direction:column;gap:10px}.library-row[data-v-f2ee2e34]{display:flex;align-items:center;gap:10px;padding:6px 0}.library-open[data-v-f2ee2e34]{display:flex;flex:1;flex-direction:column;gap:2px;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.library-title[data-v-f2ee2e34]{font-weight:600}.library-abstract[data-v-f2ee2e34],.library-excerpt[data-v-f2ee2e34],.library-facts[data-v-f2ee2e34],.library-here[data-v-f2ee2e34]{color:var(--text-3);font-size:12px}.library-failure[data-v-f2ee2e34],.library-warning[data-v-f2ee2e34]{margin:0;color:var(--danger);font-size:13px}.library-fields dt[data-v-f2ee2e34]{margin-top:8px;color:var(--text-3);font-size:12px}.library-fields dd[data-v-f2ee2e34]{margin:2px 0 0;white-space:pre-wrap}.library-versions[data-v-f2ee2e34]{padding:0;list-style:none}.library-versions li[data-v-f2ee2e34]{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 0;font-size:13px}.connect[data-v-3067baef]{display:flex;flex-direction:column;gap:12px;max-width:420px}.connect-lead[data-v-3067baef]{margin:0;color:var(--text-2);font-size:13px}.connect-failure[data-v-3067baef]{margin:0;color:var(--danger);font-size:13px}.compare[data-v-a6494d43]{display:flex;flex-direction:column;gap:10px}.compare-help[data-v-a6494d43]{margin:0;color:var(--text-3);font-size:12px}.copy[data-v-eb9c7ddf]{display:flex;flex-direction:column;gap:3px;padding:8px 0}.copy-title[data-v-eb9c7ddf]{font-weight:600}.copy-facts[data-v-eb9c7ddf],.copy-line[data-v-eb9c7ddf]{color:var(--text-3);font-size:12px}.copy-buttons[data-v-eb9c7ddf]{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}.copies[data-v-238e1e7f]{display:flex;flex-direction:column;gap:10px}.copies-share[data-v-238e1e7f]{display:flex;align-items:flex-end;gap:8px}.copies-list[data-v-238e1e7f]{margin:0;padding:0;list-style:none}.copies-failure[data-v-238e1e7f]{margin:0;color:var(--danger);font-size:13px}.copies-empty[data-v-238e1e7f]{margin:0;color:var(--text-3);font-size:13px}.person[data-v-cd12fcad]{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;padding:8px 0}.person-name[data-v-cd12fcad]{min-width:120px;font-weight:600}.person-facts[data-v-cd12fcad],.person-tokens[data-v-cd12fcad]{color:var(--text-3);font-size:12px}.person-tokens[data-v-cd12fcad]{flex-basis:100%;margin:0;padding:0 0 0 16px;list-style:none}.person-tokens li[data-v-cd12fcad]{display:flex;align-items:center;gap:10px;padding:2px 0}.person-failure[data-v-cd12fcad]{flex-basis:100%;margin:0;color:var(--danger);font-size:13px}.people[data-v-dde5182e]{display:flex;flex-direction:column;gap:10px}.people-add[data-v-dde5182e]{display:flex;align-items:flex-end;gap:10px}.people-token[data-v-dde5182e]{margin:0;font-family:var(--mono);font-size:12px;word-break:break-all}.people-failure[data-v-dde5182e]{margin:0;color:var(--danger);font-size:13px}.teams[data-v-8fa9d1da]{display:flex;flex-direction:column;gap:10px}.teams-top[data-v-8fa9d1da]{display:flex;align-items:center;justify-content:space-between}.teams-title[data-v-8fa9d1da]{margin:0;font-size:16px}.teams-header[data-v-8fa9d1da]{display:flex;flex-wrap:wrap;gap:6px 18px;color:var(--text-2);font-size:13px}.teams-failure[data-v-8fa9d1da],.teams-stopped[data-v-8fa9d1da]{margin:0;color:var(--danger);font-size:13px}\n"; document.head.appendChild(style); }
import { ref as V, watch as Z, openBlock as a, createElementBlock as o, createVNode as h, unref as e, toDisplayString as u, createCommentVNode as g, createElementVNode as f, withCtx as R, createTextVNode as A, createBlock as E, Fragment as P, renderList as D, withModifiers as J, computed as B, onMounted as le } from "vue";
import { useWindow as U, useRunLine as M, SearchBar as se, Segmented as F, Btn as O, RowList as ee, TimeAgo as H, SidePanel as ae, FormField as Y, TextInput as G, DiffCard as oe, useReadLine as K, usePoll as ne, READ_RATES as ie, WindowRoom as de, SwitchCase as ue } from "@journal/window-kit";
const N = (i, T) => {
  const $ = i.__vccOpts || i;
  for (const [t, k] of T)
    $[t] = k;
  return $;
}, ce = {
  class: "library",
  "data-library": ""
}, ye = {
  key: 0,
  class: "library-failure",
  role: "alert",
  "data-library-refusal": ""
}, pe = {
  key: 1,
  class: "library-check",
  "data-library-check": ""
}, ve = { "data-library-command": "" }, me = ["data-library-item"], be = ["onClick"], fe = { class: "library-title" }, he = {
  key: 0,
  class: "library-excerpt",
  "data-library-excerpt": ""
}, ke = {
  key: 1,
  class: "library-abstract"
}, _e = { class: "library-facts" }, ge = {
  key: 0,
  class: "library-here",
  "data-library-here": ""
}, $e = { "data-library-panel": "" }, Se = { class: "library-facts" }, Ce = {
  class: "library-fields",
  "data-library-fields": ""
}, we = {
  class: "library-versions",
  "data-library-versions": ""
}, Re = ["data-library-version"], xe = 300, Te = {
  __name: "LibraryBrowse",
  props: { role: { type: String, required: !0 }, canWrite: Boolean },
  emits: ["changed"],
  setup(i, { emit: T }) {
    const $ = [
      { key: "", label: "All" },
      { key: "doc", label: "Documents" },
      { key: "sequence", label: "Sequences" },
      { key: "check", label: "Checks" }
    ], t = ["doc", "sequence", "check"], k = { doc: "Document", sequence: "Sequence", check: "Check" }, y = U(), r = V(""), s = V(""), v = V([]), b = V(!1), S = V(""), c = V(null), p = V([]), x = V(null), C = T, { refusal: n, run: _ } = M(async () => {
      await q(), C("changed");
    });
    let w = 0;
    const L = (m) => `${m.share}:${m.id}`;
    async function q() {
      const m = s.value.trim(), l = await Promise.all((r.value ? [r.value] : t).map((j) => y.read(`library list --type ${j}${m ? ` --search ${JSON.stringify(m)}` : ""}`))), d = l.find((j) => !j.ok);
      S.value = d ? d.error : "";
      const I = d ? [] : l.flatMap((j) => j.value.rows);
      v.value = [...new Map(I.map((j) => [L(j), j])).values()].map((j) => ({ ...j, item_id: j.id, id: L(j) })), b.value = !0;
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
    return Z(r, q, { immediate: !0 }), Z(s, () => {
      clearTimeout(w), w = setTimeout(q, xe);
    }), (m, l) => (a(), o("div", ce, [
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
      e(n) ? (a(), o("p", ye, u(e(n)), 1)) : g("", !0),
      x.value ? (a(), o("div", pe, [
        l[8] || (l[8] = f("p", null, "This check runs this command on your computer when someone starts it:", -1)),
        f("pre", ve, u(x.value.command), 1),
        h(e(O), {
          small: "",
          onClick: l[2] || (l[2] = (d) => x.value = null)
        }, {
          default: R(() => [...l[6] || (l[6] = [
            A("Cancel", -1)
          ])]),
          _: 1
        }),
        h(e(O), {
          small: "",
          variant: "primary",
          "data-library-confirm": "",
          onClick: l[3] || (l[3] = (d) => X(x.value))
        }, {
          default: R(() => [...l[7] || (l[7] = [
            A("Get the check, stopped", -1)
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
              onClick: (I) => W(d)
            }, [
              f("span", fe, u(d.title), 1),
              d.excerpt ? (a(), o("span", he, u(d.excerpt), 1)) : (a(), o("span", ke, u(d.abstract), 1)),
              f("span", _e, [
                A(u(k[d.share]) + ", Version: " + u(d.version) + ", Changed by: " + u(d.updated_by) + ", ", 1),
                h(e(H), {
                  at: d.updated_at
                }, null, 8, ["at"])
              ])
            ], 8, be),
            d.copy_id ? (a(), o("span", ge, "On this journal")) : (a(), E(e(O), {
              key: 1,
              small: "",
              variant: "primary",
              "data-library-get": "",
              onClick: (I) => X(d)
            }, {
              default: R(() => [...l[9] || (l[9] = [
                A("Get", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])),
            i.role === "admin" ? (a(), E(e(O), {
              key: 2,
              small: "",
              variant: "danger",
              "data-library-remove": "",
              onClick: (I) => te(d)
            }, {
              default: R(() => [...l[10] || (l[10] = [
                A("Remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])) : g("", !0)
          ], 8, me)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "searching"]),
      c.value ? (a(), E(e(ae), {
        key: 2,
        title: c.value.title,
        onClose: l[5] || (l[5] = (d) => c.value = null)
      }, {
        default: R(() => [
          f("div", $e, [
            c.value.removed_at ? (a(), o(P, { key: 0 }, [
              l[12] || (l[12] = f("p", {
                class: "library-removed",
                "data-library-removed": ""
              }, "Removed from the library", -1)),
              i.role === "admin" ? (a(), E(e(O), {
                key: 0,
                small: "",
                variant: "primary",
                "data-library-restore": "",
                onClick: l[4] || (l[4] = (d) => Q(c.value))
              }, {
                default: R(() => [...l[11] || (l[11] = [
                  A("Restore", -1)
                ])]),
                _: 1
              })) : g("", !0)
            ], 64)) : g("", !0),
            f("p", Se, u(k[c.value.share]) + ", Version: " + u(c.value.version) + ", Changed by: " + u(c.value.updated_by), 1),
            f("dl", Ce, [
              (a(!0), o(P, null, D(c.value.fields, (d, I) => (a(), o(P, { key: I }, [
                f("dt", null, u(I), 1),
                f("dd", null, u(d), 1)
              ], 64))), 128))
            ]),
            l[14] || (l[14] = f("h3", { class: "library-heading" }, "Versions", -1)),
            f("ul", we, [
              (a(!0), o(P, null, D(p.value, (d) => (a(), o("li", {
                key: d.version,
                "data-library-version": d.version
              }, [
                f("span", null, [
                  A("Version: " + u(d.version) + ", Changed by: " + u(d.user) + ", ", 1),
                  h(e(H), {
                    at: d.created_at
                  }, null, 8, ["at"])
                ]),
                i.canWrite && d.version !== c.value.version ? (a(), E(e(O), {
                  key: 0,
                  small: "",
                  "data-library-restore-version": "",
                  onClick: (I) => Q(c.value, d.version)
                }, {
                  default: R(() => [...l[13] || (l[13] = [
                    A("Restore this version", -1)
                  ])]),
                  _: 1
                }, 8, ["onClick"])) : g("", !0)
              ], 8, Re))), 128))
            ])
          ])
        ]),
        _: 1
      }, 8, ["title"])) : g("", !0)
    ]));
  }
}, Le = /* @__PURE__ */ N(Te, [["__scopeId", "data-v-f2ee2e34"]]), Ve = {
  key: 0,
  class: "connect-failure",
  role: "alert",
  "data-library-refusal": ""
}, Ae = {
  __name: "LibraryConnect",
  props: { address: { type: String, default: "" } },
  emits: ["connected"],
  setup(i, { emit: T }) {
    const $ = i, t = T, k = U(), y = V($.address), r = V(""), s = V(""), v = V(!1);
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
      s.value ? (a(), o("p", Ve, u(s.value), 1)) : g("", !0),
      h(e(O), {
        variant: "primary",
        busy: v.value,
        disabled: !r.value.trim(),
        "data-library-submit": "",
        onClick: b
      }, {
        default: R(() => [...c[2] || (c[2] = [
          A("Connect", -1)
        ])]),
        _: 1
      }, 8, ["busy", "disabled"])
    ], 32));
  }
}, Oe = /* @__PURE__ */ N(Ae, [["__scopeId", "data-v-3067baef"]]);
function Ee(i, T) {
  const $ = i === "" ? [] : i.split(`
`), t = T === "" ? [] : T.split(`
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
}, je = {
  key: 0,
  "data-library-same": ""
}, qe = {
  __name: "CopyCompare",
  props: { here: { type: Object, required: !0 }, library: { type: Object, required: !0 }, at: { type: String, required: !0 } },
  setup(i) {
    const T = i, $ = B(
      () => Object.keys({ ...T.here, ...T.library }).map((t) => ({ name: t, ...Ee(String(T.here[t] ?? ""), String(T.library[t] ?? "")) })).filter((t) => t.added || t.removed)
    );
    return (t, k) => (a(), o("div", Pe, [
      k[0] || (k[0] = f("p", { class: "compare-help" }, "Red lines are only on this journal. Green lines are only in the library.", -1)),
      $.value.length ? g("", !0) : (a(), o("p", je, "The two versions have the same text.")),
      (a(!0), o(P, null, D($.value, (y) => (a(), E(e(oe), {
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
}, Ie = /* @__PURE__ */ N(qe, [["__scopeId", "data-v-a6494d43"]]), Be = ["data-library-copy", "data-status"], Ne = { class: "copy-title" }, De = {
  class: "copy-facts",
  "data-copy-facts": ""
}, We = { class: "copy-buttons" }, Ue = {
  __name: "LibraryCopyRow",
  props: { copy: { type: Object, required: !0 }, role: { type: String, required: !0 } },
  emits: ["choose"],
  setup(i, { emit: T }) {
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
    }, y = { admin: "Admin", edit: "Edit", read: "Read-only" }, r = i, s = T, v = B(() => k[r.copy.status].map((S) => ({ key: S, label: t[S] }))), b = B(() => {
      const S = [];
      return r.copy.status === "denied" && S.push(`Role: ${y[r.role]}`), r.copy.status === "denied" && r.copy.server_version > r.copy.version && S.push("A newer version is in the library"), r.copy.status === "agent" && S.push("An agent changed this item. A person sends it to the team."), r.copy.status === "removed" && S.push("Your copy stays on this journal."), r.copy.note && S.push(r.copy.note), S;
    });
    return (S, c) => (a(), o("li", {
      class: "copy",
      "data-library-copy": i.copy.copy_id,
      "data-status": i.copy.status
    }, [
      f("span", Ne, u($[i.copy.share]) + " " + u(i.copy.row_id) + ", " + u(i.copy.local_fields.title), 1),
      f("span", De, "Status: " + u(i.copy.label) + ", Version: " + u(i.copy.version), 1),
      (a(!0), o(P, null, D(b.value, (p) => (a(), o("span", {
        key: p,
        class: "copy-line",
        "data-copy-line": ""
      }, u(p), 1))), 128)),
      f("span", We, [
        (a(!0), o(P, null, D(v.value, (p) => (a(), E(e(O), {
          key: p.key,
          small: "",
          variant: p.key === "library" ? "primary" : void 0,
          "data-copy-button": p.key,
          onClick: (x) => s("choose", i.copy, p.key)
        }, {
          default: R(() => [
            A(u(p.label), 1)
          ]),
          _: 2
        }, 1032, ["variant", "data-copy-button", "onClick"]))), 128))
      ])
    ], 8, Be));
  }
}, Me = /* @__PURE__ */ N(Ue, [["__scopeId", "data-v-eb9c7ddf"]]), Ye = {
  class: "copies",
  "data-library-copies": ""
}, Ge = {
  class: "copies-shared",
  "data-library-shared": ""
}, Fe = {
  key: 0,
  class: "copies-failure",
  role: "alert",
  "data-library-warning": ""
}, He = {
  key: 2,
  class: "copies-failure",
  role: "alert",
  "data-library-refusal": ""
}, Ke = {
  key: 3,
  class: "copies-empty",
  "data-library-no-copies": ""
}, Je = { class: "copies-list" }, ze = { "data-library-compare-panel": "" }, Qe = {
  key: 0,
  class: "copies-failure",
  "data-library-loss": ""
}, Xe = {
  __name: "LibraryCopies",
  props: { copies: { type: Array, required: !0 }, role: { type: String, required: !0 }, canWrite: Boolean },
  emits: ["changed"],
  setup(i, { emit: T }) {
    const $ = T, t = U(), k = ["doc"], y = V(""), r = V(null), s = V(null), { refusal: v, run: b } = M(async () => $("changed"));
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
      const L = await b(["library", "share", n, _]);
      r.value = L.ok ? L.value : null, L.ok && (y.value = "");
    }
    return (n, _) => (a(), o("div", Ye, [
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
        h(e(O), {
          variant: "primary",
          disabled: !y.value.trim(),
          "data-library-share-submit": "",
          onClick: C
        }, {
          default: R(() => [..._[4] || (_[4] = [
            A("Share", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : g("", !0),
      r.value ? (a(), o(P, { key: 1 }, [
        f("p", Ge, u(r.value.line), 1),
        r.value.warning ? (a(), o("p", Fe, u(r.value.warning), 1)) : g("", !0)
      ], 64)) : g("", !0),
      e(v) ? (a(), o("p", He, u(e(v)), 1)) : g("", !0),
      i.copies.length ? g("", !0) : (a(), o("p", Ke, "No item on this journal follows an item of the library. Get one from the Library tab.")),
      f("ul", Je, [
        (a(!0), o(P, null, D(i.copies, (w) => (a(), E(Me, {
          key: w.copy_id,
          copy: w,
          role: i.role,
          onChoose: _[1] || (_[1] = (L, q) => x[q](L))
        }, null, 8, ["copy", "role"]))), 128))
      ]),
      s.value ? (a(), E(e(ae), {
        key: 4,
        title: `Compare: ${s.value.copy.local_fields.title}`,
        onClose: _[3] || (_[3] = (w) => s.value = null)
      }, {
        default: R(() => [
          f("div", ze, [
            k.includes(s.value.copy.share) ? g("", !0) : (a(), o("p", Qe, "The text on this journal is lost when you use the library's version: a " + u(s.value.copy.share) + " keeps no earlier versions.", 1)),
            h(Ie, {
              here: s.value.copy.local_fields,
              library: s.value.there,
              at: (/* @__PURE__ */ new Date()).toISOString()
            }, null, 8, ["here", "library", "at"]),
            s.value.isTaking ? (a(), E(e(O), {
              key: 1,
              variant: "primary",
              "data-library-take": "",
              onClick: _[2] || (_[2] = (w) => p(s.value.copy))
            }, {
              default: R(() => [..._[5] || (_[5] = [
                A("Use the library's version", -1)
              ])]),
              _: 1
            })) : g("", !0)
          ])
        ]),
        _: 1
      }, 8, ["title"])) : g("", !0)
    ]));
  }
}, Ze = /* @__PURE__ */ N(Xe, [["__scopeId", "data-v-238e1e7f"]]), ea = ["data-people-user"], aa = { class: "person-name" }, ta = {
  key: 0,
  class: "person-facts",
  "data-people-removed": ""
}, ra = {
  key: 2,
  class: "person-failure",
  role: "alert",
  "data-people-failure": ""
}, la = {
  key: 3,
  class: "person-tokens",
  "data-people-token-list": ""
}, sa = ["data-people-token"], oa = {
  key: 0,
  "data-people-revoked": ""
}, na = {
  __name: "LibraryPerson",
  props: { user: { type: Object, required: !0 } },
  emits: ["role", "remove"],
  setup(i, { emit: T }) {
    const $ = [
      { key: "admin", label: "Admin" },
      { key: "edit", label: "Edit" },
      { key: "read", label: "Read-only" }
    ], t = i, k = T, y = U(), r = V(null), s = V("");
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
      f("span", aa, u(i.user.name), 1),
      i.user.removed_at ? (a(), o("span", ta, "Removed")) : (a(), o(P, { key: 1 }, [
        h(e(F), {
          options: $,
          value: i.user.role,
          "data-people-role": "",
          onPick: x[0] || (x[0] = (C) => k("role", i.user, C))
        }, null, 8, ["value"]),
        h(e(O), {
          small: "",
          "data-people-tokens": "",
          onClick: b
        }, {
          default: R(() => [...x[2] || (x[2] = [
            A("Tokens", -1)
          ])]),
          _: 1
        }),
        h(e(O), {
          small: "",
          variant: "danger",
          "data-people-remove": "",
          onClick: x[1] || (x[1] = (C) => k("remove", i.user))
        }, {
          default: R(() => [...x[3] || (x[3] = [
            A("Remove user", -1)
          ])]),
          _: 1
        })
      ], 64)),
      s.value || e(S) ? (a(), o("p", ra, u(s.value || e(S)), 1)) : g("", !0),
      r.value ? (a(), o("ul", la, [
        (a(!0), o(P, null, D(r.value, (C) => (a(), o("li", {
          key: C.id,
          "data-people-token": C.id
        }, [
          f("span", null, u(C.label || "No label") + ", Last used: " + u(C.last_used_at || "never"), 1),
          C.revoked_at ? (a(), o("span", oa, "Revoked")) : (a(), E(e(O), {
            key: 1,
            small: "",
            variant: "danger",
            "data-people-revoke": "",
            onClick: (n) => e(c)(["library-user", "revoke", String(C.id)])
          }, {
            default: R(() => [...x[4] || (x[4] = [
              A("Revoke", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]))
        ], 8, sa))), 128))
      ])) : g("", !0)
    ], 8, ea));
  }
}, ia = /* @__PURE__ */ N(na, [["__scopeId", "data-v-cd12fcad"]]), da = {
  class: "people",
  "data-library-people": ""
}, ua = {
  key: 0,
  class: "people-token",
  "data-people-first-token": ""
}, ca = {
  key: 1,
  class: "people-failure",
  role: "alert",
  "data-people-refusal": ""
}, ya = {
  __name: "LibraryPeople",
  setup(i) {
    const T = [
      { key: "admin", label: "Admin" },
      { key: "edit", label: "Edit" },
      { key: "read", label: "Read-only" }
    ], { value: $, failure: t, load: k } = K(() => "library-user list"), { refusal: y, run: r } = M(k), s = V(""), v = V("read"), b = V(null);
    async function S() {
      const c = await r(["library-user", "add", s.value.trim(), "--role", v.value]);
      b.value = c.ok ? c.value : null, c.ok && (s.value = "");
    }
    return k(), (c, p) => {
      var x;
      return a(), o("div", da, [
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
            options: T,
            value: v.value,
            "data-people-new-role": "",
            onPick: p[1] || (p[1] = (C) => v.value = C)
          }, null, 8, ["value"]),
          h(e(O), {
            variant: "primary",
            disabled: !s.value.trim(),
            "data-people-submit": "",
            onClick: S
          }, {
            default: R(() => [...p[4] || (p[4] = [
              A("Add the user", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ], 32),
        b.value ? (a(), o("p", ua, u(b.value.user.name) + " has this token, shown once: " + u(b.value.token_text), 1)) : g("", !0),
        e(y) ? (a(), o("p", ca, u(e(y)), 1)) : g("", !0),
        h(e(ee), {
          rows: ((x = e($)) == null ? void 0 : x.users) ?? [],
          failure: e(t),
          loaded: !!e($) || !!e(t),
          empty: "No users yet",
          hint: "The users of the shared server appear here."
        }, {
          default: R(({ row: C }) => [
            h(ia, {
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
}, pa = /* @__PURE__ */ N(ya, [["__scopeId", "data-v-dde5182e"]]), va = {
  class: "teams",
  "data-teams": ""
}, ma = { class: "teams-top" }, ba = {
  key: 0,
  class: "teams-failure",
  role: "alert",
  "data-teams-failure": ""
}, fa = {
  key: 1,
  class: "teams-failure",
  role: "alert",
  "data-teams-refusal": ""
}, ha = {
  class: "teams-header",
  "data-teams-header": ""
}, ka = { "data-teams-server": "" }, _a = { "data-teams-role": "" }, ga = {
  key: 0,
  "data-teams-reached": ""
}, $a = {
  key: 1,
  "data-teams-plain": ""
}, Sa = {
  key: 0,
  class: "teams-stopped",
  role: "alert",
  "data-teams-stopped": ""
}, Ca = {
  __name: "TeamsPage",
  setup(i) {
    const T = { admin: "Admin", edit: "Edit", read: "Read-only" }, $ = U(), { value: t, failure: k, load: y } = K(() => "library status"), { value: r, load: s } = K(() => "library copies"), v = V("library"), b = B(() => {
      var w;
      return !!((w = t.value) != null && w.is_connected) && !t.value.stopped;
    }), S = B(() => {
      var w, L;
      return ((w = t.value) == null ? void 0 : w.role) === "admin" || ((L = t.value) == null ? void 0 : L.role) === "edit";
    }), c = B(() => {
      var w;
      return ((w = r.value) == null ? void 0 : w.rows) ?? [];
    }), p = B(() => {
      var w;
      return ((w = t.value) == null ? void 0 : w.role) === "admin";
    }), x = B(() => [
      { key: "library", label: "Library" },
      { key: "copies", label: "On this journal", count: c.value.length },
      ...p.value ? [{ key: "people", label: "People" }] : []
    ]);
    async function C() {
      await Promise.all([y(), s()]);
    }
    const { refusal: n, run: _ } = M(C);
    return ne(C, () => !0, ie.libraryCopies), le(() => $.follow(["library_copy.*"], C)), (w, L) => (a(), E(e(de), null, {
      default: R(() => {
        var q;
        return [
          f("div", va, [
            f("div", ma, [
              L[3] || (L[3] = f("h2", { class: "teams-title" }, "Teams", -1)),
              b.value ? (a(), E(e(O), {
                key: 0,
                small: "",
                "data-teams-sync": "",
                onClick: L[0] || (L[0] = (W) => e(_)(["library", "sync"]))
              }, {
                default: R(() => [...L[2] || (L[2] = [
                  A("Sync now", -1)
                ])]),
                _: 1
              })) : g("", !0)
            ]),
            e(k) ? (a(), o("p", ba, u(e(k)), 1)) : g("", !0),
            e(n) ? (a(), o("p", fa, u(e(n)), 1)) : g("", !0),
            (q = e(t)) != null && q.is_connected ? (a(), o(P, { key: 2 }, [
              f("div", ha, [
                f("span", ka, "Connected: " + u(e(t).server_name), 1),
                f("span", _a, "Role: " + u(T[e(t).role]), 1),
                e(t).reached_at ? (a(), o("span", ga, [
                  L[4] || (L[4] = A("Last reached: ", -1)),
                  h(e(H), {
                    at: e(t).reached_at
                  }, null, 8, ["at"])
                ])) : g("", !0),
                e(t).is_encrypted ? g("", !0) : (a(), o("span", $a, "Connection: not encrypted"))
              ]),
              e(t).stopped ? (a(), o("p", Sa, u(e(t).stopped), 1)) : g("", !0)
            ], 64)) : g("", !0),
            e(t) && !b.value ? (a(), E(Oe, {
              key: 3,
              address: e(t).address,
              onConnected: C
            }, null, 8, ["address"])) : g("", !0),
            b.value ? (a(), o(P, { key: 4 }, [
              h(e(F), {
                options: x.value,
                value: v.value,
                "data-teams-tabs": "",
                onPick: L[1] || (L[1] = (W) => v.value = W)
              }, null, 8, ["options", "value"]),
              h(e(ue), { value: v.value }, {
                library: R(() => [
                  h(Le, {
                    role: e(t).role,
                    "can-write": S.value,
                    onChanged: C
                  }, null, 8, ["role", "can-write"])
                ]),
                copies: R(() => [
                  h(Ze, {
                    copies: c.value,
                    role: e(t).role,
                    "can-write": S.value,
                    onChanged: C
                  }, null, 8, ["copies", "role", "can-write"])
                ]),
                people: R(() => [
                  h(pa)
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
}, xa = /* @__PURE__ */ N(Ca, [["__scopeId", "data-v-8fa9d1da"]]);
export {
  xa as default
};
