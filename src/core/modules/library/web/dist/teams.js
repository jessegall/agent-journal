if (!document.getElementById("window-styles-26f320764993")) { const style = document.createElement("style"); style.id = "window-styles-26f320764993"; style.textContent = ".library[data-v-e8b8f5f0]{display:flex;flex-direction:column;gap:10px}.library-row[data-v-e8b8f5f0]{display:flex;align-items:center;gap:10px;padding:6px 0}.library-open[data-v-e8b8f5f0]{display:flex;flex:1;flex-direction:column;gap:2px;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.library-title[data-v-e8b8f5f0]{font-weight:600}.library-abstract[data-v-e8b8f5f0],.library-excerpt[data-v-e8b8f5f0],.library-facts[data-v-e8b8f5f0],.library-here[data-v-e8b8f5f0]{color:var(--text-3);font-size:12px}.library-failure[data-v-e8b8f5f0],.library-warning[data-v-e8b8f5f0]{margin:0;color:var(--danger);font-size:13px}.library-fields dt[data-v-e8b8f5f0]{margin-top:8px;color:var(--text-3);font-size:12px}.library-fields dd[data-v-e8b8f5f0]{margin:2px 0 0;white-space:pre-wrap}.library-versions[data-v-e8b8f5f0]{padding:0;list-style:none}.library-versions li[data-v-e8b8f5f0]{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 0;font-size:13px}.connect[data-v-32da1756]{display:flex;flex-direction:column;gap:12px;max-width:420px}.connect-lead[data-v-32da1756]{margin:0;color:var(--text-2);font-size:13px}.connect-failure[data-v-32da1756]{margin:0;color:var(--danger);font-size:13px}.compare[data-v-4ed17c46]{display:flex;flex-direction:column;gap:10px}.compare-help[data-v-4ed17c46]{margin:0;color:var(--text-3);font-size:12px}.copy[data-v-ab17c0f6]{display:flex;flex-direction:column;gap:3px;padding:8px 0}.copy-title[data-v-ab17c0f6]{font-weight:600}.copy-facts[data-v-ab17c0f6],.copy-line[data-v-ab17c0f6]{color:var(--text-3);font-size:12px}.copy-buttons[data-v-ab17c0f6]{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px}.copies[data-v-0af30610]{display:flex;flex-direction:column;gap:10px}.copies-share[data-v-0af30610]{display:flex;align-items:flex-end;gap:8px}.copies-list[data-v-0af30610]{margin:0;padding:0;list-style:none}.copies-failure[data-v-0af30610]{margin:0;color:var(--danger);font-size:13px}.copies-empty[data-v-0af30610]{margin:0;color:var(--text-3);font-size:13px}.person[data-v-4a453da6]{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;padding:8px 0}.person-name[data-v-4a453da6]{min-width:120px;font-weight:600}.person-facts[data-v-4a453da6],.person-tokens[data-v-4a453da6]{color:var(--text-3);font-size:12px}.person-tokens[data-v-4a453da6]{flex-basis:100%;margin:0;padding:0 0 0 16px;list-style:none}.person-tokens li[data-v-4a453da6]{display:flex;align-items:center;gap:10px;padding:2px 0}.person-failure[data-v-4a453da6]{flex-basis:100%;margin:0;color:var(--danger);font-size:13px}.people[data-v-1c77317b]{display:flex;flex-direction:column;gap:10px}.people-add[data-v-1c77317b]{display:flex;align-items:flex-end;gap:10px}.people-token[data-v-1c77317b]{margin:0;font-family:var(--mono);font-size:12px;word-break:break-all}.people-failure[data-v-1c77317b]{margin:0;color:var(--danger);font-size:13px}.teams[data-v-455b7882]{display:flex;flex-direction:column;gap:10px}.teams-top[data-v-455b7882]{display:flex;align-items:center;justify-content:space-between}.teams-title[data-v-455b7882]{margin:0;font-size:16px}.teams-header[data-v-455b7882]{display:flex;flex-wrap:wrap;gap:6px 18px;color:var(--text-2);font-size:13px}.teams-failure[data-v-455b7882],.teams-stopped[data-v-455b7882]{margin:0;color:var(--danger);font-size:13px}\n"; document.head.appendChild(style); }
import { ref as T, watch as J, openBlock as a, createElementBlock as n, createVNode as g, unref as e, toDisplayString as v, createCommentVNode as S, createElementVNode as f, withCtx as C, createTextVNode as V, createBlock as A, Fragment as j, renderList as P, withModifiers as F, computed as q } from "vue";
import { useWindow as N, useRunLine as D, SearchBar as ae, Segmented as G, Btn as O, RowList as Q, TimeAgo as M, SidePanel as X, FormField as U, TextInput as Y, DiffCard as te, WindowRoom as le, SwitchCase as re } from "@journal/window-kit";
const I = (p, x) => {
  const h = p.__vccOpts || p;
  for (const [t, i] of x)
    h[t] = i;
  return h;
}, se = {
  class: "library",
  "data-library": ""
}, ne = {
  key: 0,
  class: "library-failure",
  role: "alert",
  "data-library-refusal": ""
}, oe = {
  key: 1,
  class: "library-check",
  "data-library-check": ""
}, ie = { "data-library-command": "" }, de = ["data-library-item"], ue = ["onClick"], ce = { class: "library-title" }, pe = {
  key: 0,
  class: "library-excerpt",
  "data-library-excerpt": ""
}, ye = {
  key: 1,
  class: "library-abstract"
}, ve = { class: "library-facts" }, me = {
  key: 0,
  class: "library-here",
  "data-library-here": ""
}, be = { "data-library-panel": "" }, fe = { class: "library-facts" }, he = {
  class: "library-fields",
  "data-library-fields": ""
}, ke = {
  class: "library-versions",
  "data-library-versions": ""
}, _e = ["data-library-version"], ge = 300, Se = {
  __name: "LibraryBrowse",
  props: { role: { type: String, required: !0 }, canWrite: Boolean },
  emits: ["changed"],
  setup(p, { emit: x }) {
    const h = [
      { key: "", label: "All" },
      { key: "doc", label: "Documents" },
      { key: "sequence", label: "Sequences" },
      { key: "check", label: "Checks" }
    ], t = { doc: "Document", sequence: "Sequence", check: "Check" }, i = N(), c = T(""), l = T(""), o = T([]), b = T(!1), k = T(""), d = T(null), R = T([]), m = T(null), $ = x, { refusal: w, run: r } = D(async () => {
      await E(), $("changed");
    });
    let u = 0;
    const L = (_) => `${_.share}:${_.id}`;
    async function E() {
      c.value ? i.state["listing.type"] = c.value : delete i.state["listing.type"], l.value.trim() ? i.state["listing.search"] = l.value.trim() : delete i.state["listing.search"], await i.reload("listing");
      const _ = i.props.listing;
      k.value = _.failure.value;
      const s = k.value ? [] : _.data.value.rows;
      o.value = [...new Map(s.map((y) => [L(y), y])).values()].map((y) => ({ ...y, item_id: y.id, id: L(y) })), b.value = !0;
    }
    async function W(_) {
      i.state["inspection.share"] = _.share, i.state["inspection.id"] = String(_.item_id), await i.reload("inspection");
      const s = i.props.inspection;
      w.value = s.failure.value, d.value = w.value ? null : { ...s.data.value.item, title: _.title }, R.value = w.value ? [] : s.data.value.versions;
    }
    async function K() {
      const _ = d.value;
      await W({ share: _.share, item_id: _.id, title: _.title });
    }
    async function Z(_) {
      (await r(["library", "remove", _.share, String(_.item_id ?? _.id)])).ok && d.value && await K();
    }
    async function H(_, s = null) {
      (await r(["library", "restore", _.share, String(_.id), ...s ? ["--version", String(s)] : []])).ok && await K();
    }
    async function ee(_) {
      i.state["item.share"] = "check", i.state["item.id"] = String(_.item_id), await i.reload("item");
      const s = i.props.item;
      w.value = s.failure.value, m.value = s.failure.value ? null : { ..._, command: s.data.value.fields.command };
    }
    async function z(_) {
      var s;
      if (_.share === "check" && ((s = m.value) == null ? void 0 : s.id) !== _.id) return void await ee(_);
      m.value = null, await r(["library", "get", _.share, String(_.item_id), ..._.share === "check" ? ["--read"] : []]);
    }
    return J(c, E, { immediate: !0 }), J(l, () => {
      clearTimeout(u), u = setTimeout(E, ge);
    }), (_, s) => (a(), n("div", se, [
      g(e(ae), {
        modelValue: l.value,
        "onUpdate:modelValue": s[0] || (s[0] = (y) => l.value = y),
        placeholder: "Search the library",
        "data-library-search": ""
      }, null, 8, ["modelValue"]),
      g(e(G), {
        options: h,
        value: c.value,
        "data-library-type": "",
        onPick: s[1] || (s[1] = (y) => c.value = y)
      }, null, 8, ["value"]),
      e(w) ? (a(), n("p", ne, v(e(w)), 1)) : S("", !0),
      m.value ? (a(), n("div", oe, [
        s[8] || (s[8] = f("p", null, "This check runs this command on your computer when someone starts it:", -1)),
        f("pre", ie, v(m.value.command), 1),
        g(e(O), {
          small: "",
          onClick: s[2] || (s[2] = (y) => m.value = null)
        }, {
          default: C(() => [...s[6] || (s[6] = [
            V("Cancel", -1)
          ])]),
          _: 1
        }),
        g(e(O), {
          small: "",
          variant: "primary",
          "data-library-confirm": "",
          onClick: s[3] || (s[3] = (y) => z(m.value))
        }, {
          default: C(() => [...s[7] || (s[7] = [
            V("Get the check, stopped", -1)
          ])]),
          _: 1
        })
      ])) : S("", !0),
      g(e(Q), {
        rows: o.value,
        failure: k.value,
        loaded: b.value,
        searching: !!(l.value.trim() || c.value),
        empty: "Nothing in the library yet",
        hint: "Shared documents, sequences and checks appear here."
      }, {
        default: C(({ row: y }) => [
          f("div", {
            class: "library-row",
            "data-library-item": y.id
          }, [
            f("button", {
              type: "button",
              class: "library-open",
              "data-library-open": "",
              onClick: (B) => W(y)
            }, [
              f("span", ce, v(y.title), 1),
              y.excerpt ? (a(), n("span", pe, v(y.excerpt), 1)) : (a(), n("span", ye, v(y.abstract), 1)),
              f("span", ve, [
                V(v(t[y.share]) + ", Version: " + v(y.version) + ", Changed by: " + v(y.updated_by) + ", ", 1),
                g(e(M), {
                  at: y.updated_at
                }, null, 8, ["at"])
              ])
            ], 8, ue),
            y.copy_id ? (a(), n("span", me, "On this journal")) : (a(), A(e(O), {
              key: 1,
              small: "",
              variant: "primary",
              "data-library-get": "",
              onClick: (B) => z(y)
            }, {
              default: C(() => [...s[9] || (s[9] = [
                V("Get", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])),
            p.role === "admin" ? (a(), A(e(O), {
              key: 2,
              small: "",
              variant: "danger",
              "data-library-remove": "",
              onClick: (B) => Z(y)
            }, {
              default: C(() => [...s[10] || (s[10] = [
                V("Remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])) : S("", !0)
          ], 8, de)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "searching"]),
      d.value ? (a(), A(e(X), {
        key: 2,
        title: d.value.title,
        onClose: s[5] || (s[5] = (y) => d.value = null)
      }, {
        default: C(() => [
          f("div", be, [
            d.value.removed_at ? (a(), n(j, { key: 0 }, [
              s[12] || (s[12] = f("p", {
                class: "library-removed",
                "data-library-removed": ""
              }, "Removed from the library", -1)),
              p.role === "admin" ? (a(), A(e(O), {
                key: 0,
                small: "",
                variant: "primary",
                "data-library-restore": "",
                onClick: s[4] || (s[4] = (y) => H(d.value))
              }, {
                default: C(() => [...s[11] || (s[11] = [
                  V("Restore", -1)
                ])]),
                _: 1
              })) : S("", !0)
            ], 64)) : S("", !0),
            f("p", fe, v(t[d.value.share]) + ", Version: " + v(d.value.version) + ", Changed by: " + v(d.value.updated_by), 1),
            f("dl", he, [
              (a(!0), n(j, null, P(d.value.fields, (y, B) => (a(), n(j, { key: B }, [
                f("dt", null, v(B), 1),
                f("dd", null, v(y), 1)
              ], 64))), 128))
            ]),
            s[14] || (s[14] = f("h3", { class: "library-heading" }, "Versions", -1)),
            f("ul", ke, [
              (a(!0), n(j, null, P(R.value, (y) => (a(), n("li", {
                key: y.version,
                "data-library-version": y.version
              }, [
                f("span", null, [
                  V("Version: " + v(y.version) + ", Changed by: " + v(y.user) + ", ", 1),
                  g(e(M), {
                    at: y.created_at
                  }, null, 8, ["at"])
                ]),
                p.canWrite && y.version !== d.value.version ? (a(), A(e(O), {
                  key: 0,
                  small: "",
                  "data-library-restore-version": "",
                  onClick: (B) => H(d.value, y.version)
                }, {
                  default: C(() => [...s[13] || (s[13] = [
                    V("Restore this version", -1)
                  ])]),
                  _: 1
                }, 8, ["onClick"])) : S("", !0)
              ], 8, _e))), 128))
            ])
          ])
        ]),
        _: 1
      }, 8, ["title"])) : S("", !0)
    ]));
  }
}, $e = /* @__PURE__ */ I(Se, [["__scopeId", "data-v-e8b8f5f0"]]), Ce = {
  key: 0,
  class: "connect-failure",
  role: "alert",
  "data-library-refusal": ""
}, we = {
  __name: "LibraryConnect",
  props: { address: { type: String, default: "" } },
  emits: ["connected"],
  setup(p, { emit: x }) {
    const h = p, t = x, i = N(), c = T(h.address), l = T(""), o = T(""), b = T(!1);
    async function k() {
      b.value = !0;
      const d = await i.run(["library", "connect", ...c.value.trim() ? [c.value.trim()] : [], "--token", l.value.trim()]);
      b.value = !1, o.value = d.ok ? "" : d.error, d.ok && (l.value = "", t("connected"));
    }
    return (d, R) => (a(), n("form", {
      class: "connect",
      "data-library-connect": "",
      onSubmit: F(k, ["prevent"])
    }, [
      R[3] || (R[3] = f("p", { class: "connect-lead" }, "Connect this journal to your team's shared server to read and share documents, sequences and checks.", -1)),
      g(e(U), {
        label: "Address",
        for: "library-address",
        help: "An IP address or a web address, such as 10.0.0.5 or https://library.example.com."
      }, {
        default: C(() => [
          g(e(Y), {
            id: "library-address",
            modelValue: c.value,
            "onUpdate:modelValue": R[0] || (R[0] = (m) => c.value = m),
            placeholder: "library.example.com",
            "data-library-address": ""
          }, null, 8, ["modelValue"])
        ]),
        _: 1
      }),
      g(e(U), {
        label: "Token",
        for: "library-token",
        help: "The token an admin of the server gave you. It is stored outside the project."
      }, {
        default: C(() => [
          g(e(Y), {
            id: "library-token",
            modelValue: l.value,
            "onUpdate:modelValue": R[1] || (R[1] = (m) => l.value = m),
            type: "password",
            autocomplete: "off",
            placeholder: "jsl_...",
            "data-library-token": ""
          }, null, 8, ["modelValue"])
        ]),
        _: 1
      }),
      o.value ? (a(), n("p", Ce, v(o.value), 1)) : S("", !0),
      g(e(O), {
        variant: "primary",
        busy: b.value,
        disabled: !l.value.trim(),
        "data-library-submit": "",
        onClick: k
      }, {
        default: C(() => [...R[2] || (R[2] = [
          V("Connect", -1)
        ])]),
        _: 1
      }, 8, ["busy", "disabled"])
    ], 32));
  }
}, xe = /* @__PURE__ */ I(we, [["__scopeId", "data-v-32da1756"]]);
function Re(p, x) {
  const h = p === "" ? [] : p.split(`
`), t = x === "" ? [] : x.split(`
`), i = Array.from({ length: h.length + 1 }, () => new Array(t.length + 1).fill(0));
  for (let b = h.length - 1; b >= 0; b--)
    for (let k = t.length - 1; k >= 0; k--)
      i[b][k] = h[b] === t[k] ? i[b + 1][k + 1] + 1 : Math.max(i[b + 1][k], i[b][k + 1]);
  const c = [];
  let l = 0, o = 0;
  for (; l < h.length || o < t.length; )
    l < h.length && o < t.length && h[l] === t[o] ? c.push({ line_type: "ctx", line: o + 1, text: t[o++] }) && l++ : o < t.length && (l === h.length || i[l][o + 1] >= i[l + 1][o]) ? c.push({ line_type: "add", line: o + 1, text: t[o++] }) : c.push({ line_type: "del", line: null, text: h[l++] });
  return { rows: c, added: c.filter((b) => b.line_type === "add").length, removed: c.filter((b) => b.line_type === "del").length };
}
const Te = {
  class: "compare",
  "data-library-compare": ""
}, Le = {
  key: 0,
  "data-library-same": ""
}, Ve = {
  __name: "CopyCompare",
  props: { here: { type: Object, required: !0 }, library: { type: Object, required: !0 }, at: { type: String, required: !0 } },
  setup(p) {
    const x = p, h = q(
      () => Object.keys({ ...x.here, ...x.library }).map((t) => ({ name: t, ...Re(String(x.here[t] ?? ""), String(x.library[t] ?? "")) })).filter((t) => t.added || t.removed)
    );
    return (t, i) => (a(), n("div", Te, [
      i[0] || (i[0] = f("p", { class: "compare-help" }, "Red lines are only on this journal. Green lines are only in the library.", -1)),
      h.value.length ? S("", !0) : (a(), n("p", Le, "The two versions have the same text.")),
      (a(!0), n(j, null, P(h.value, (c) => (a(), A(e(te), {
        key: c.name,
        path: c.name,
        change: "edit",
        added: c.added,
        removed: c.removed,
        at: p.at,
        rows: c.rows,
        "data-library-diff": ""
      }, null, 8, ["path", "added", "removed", "at", "rows"]))), 128))
    ]));
  }
}, Oe = /* @__PURE__ */ I(Ve, [["__scopeId", "data-v-4ed17c46"]]), Ae = ["data-library-copy", "data-status"], je = { class: "copy-title" }, Ee = {
  class: "copy-facts",
  "data-copy-facts": ""
}, qe = { class: "copy-buttons" }, Ie = {
  __name: "LibraryCopyRow",
  props: { copy: { type: Object, required: !0 }, role: { type: String, required: !0 } },
  emits: ["choose"],
  setup(p, { emit: x }) {
    const h = { doc: "Document", sequence: "Sequence", check: "Check" }, t = {
      compare: "Compare",
      read: "Read",
      mine: "Keep mine",
      send: "Send",
      library: "Use the library's version",
      leave: "Stop following"
    }, i = {
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
    }, c = { admin: "Admin", edit: "Edit", read: "Read-only" }, l = p, o = x, b = q(() => i[l.copy.status].map((d) => ({ key: d, label: t[d] }))), k = q(() => {
      const d = [];
      return l.copy.status === "denied" && d.push(`Role: ${c[l.role]}`), l.copy.status === "denied" && l.copy.server_version > l.copy.version && d.push("A newer version is in the library"), l.copy.status === "agent" && d.push("An agent changed this item. A person sends it to the team."), l.copy.status === "removed" && d.push("Your copy stays on this journal."), l.copy.note && d.push(l.copy.note), d;
    });
    return (d, R) => (a(), n("li", {
      class: "copy",
      "data-library-copy": p.copy.copy_id,
      "data-status": p.copy.status
    }, [
      f("span", je, v(h[p.copy.share]) + " " + v(p.copy.row_id) + ", " + v(p.copy.local_fields.title), 1),
      f("span", Ee, "Status: " + v(p.copy.label) + ", Version: " + v(p.copy.version), 1),
      (a(!0), n(j, null, P(k.value, (m) => (a(), n("span", {
        key: m,
        class: "copy-line",
        "data-copy-line": ""
      }, v(m), 1))), 128)),
      f("span", qe, [
        (a(!0), n(j, null, P(b.value, (m) => (a(), A(e(O), {
          key: m.key,
          small: "",
          variant: m.key === "library" ? "primary" : void 0,
          "data-copy-button": m.key,
          onClick: ($) => o("choose", p.copy, m.key)
        }, {
          default: C(() => [
            V(v(m.label), 1)
          ]),
          _: 2
        }, 1032, ["variant", "data-copy-button", "onClick"]))), 128))
      ])
    ], 8, Ae));
  }
}, Pe = /* @__PURE__ */ I(Ie, [["__scopeId", "data-v-ab17c0f6"]]), Be = {
  class: "copies",
  "data-library-copies": ""
}, Ne = {
  class: "copies-shared",
  "data-library-shared": ""
}, De = {
  key: 0,
  class: "copies-failure",
  role: "alert",
  "data-library-warning": ""
}, We = {
  key: 2,
  class: "copies-failure",
  role: "alert",
  "data-library-refusal": ""
}, Ue = {
  key: 3,
  class: "copies-empty",
  "data-library-no-copies": ""
}, Ye = { class: "copies-list" }, Ge = { "data-library-compare-panel": "" }, Me = {
  key: 0,
  class: "copies-failure",
  "data-library-loss": ""
}, Fe = {
  __name: "LibraryCopies",
  props: { copies: { type: Array, required: !0 }, role: { type: String, required: !0 }, canWrite: Boolean },
  emits: ["changed"],
  setup(p, { emit: x }) {
    const h = x, t = N(), i = ["doc"], c = T(""), l = T(null), o = T(null), { refusal: b, run: k } = D(async () => h("changed"));
    async function d(r) {
      if (Object.keys(r.server_fields).length) return r.server_fields;
      t.state["item.share"] = r.share, t.state["item.id"] = String(r.item_id), await t.reload("item");
      const u = t.props.item;
      return b.value = u.failure.value, u.failure.value ? null : u.data.value.fields;
    }
    async function R(r, u = !1) {
      const L = await d(r);
      o.value = L ? { copy: r, there: L, isTaking: u } : null;
    }
    async function m(r) {
      o.value = null, await k(["library", "resolve", String(r.copy_id), "--keep", "library"]);
    }
    const $ = {
      compare: (r) => R(r),
      read: (r) => R(r),
      send: (r) => k(["library", "resolve", String(r.copy_id), "--keep", "mine"]),
      mine: (r) => k(["library", "resolve", String(r.copy_id), "--keep", "mine"]),
      library: (r) => i.includes(r.share) ? m(r) : R(r, !0),
      leave: (r) => k(["library", "leave", String(r.copy_id)])
    };
    async function w() {
      const [r, u, ...L] = c.value.trim().split(/\s+/);
      if (!r || !/^\d+$/.test(u ?? "") || L.length) return void (b.value = "Write the type and the number, such as doc 63.");
      const E = await k(["library", "share", r, u]);
      l.value = E.ok ? E.value : null, E.ok && (c.value = "");
    }
    return (r, u) => (a(), n("div", Be, [
      p.canWrite ? (a(), n("form", {
        key: 0,
        class: "copies-share",
        "data-library-share": "",
        onSubmit: F(w, ["prevent"])
      }, [
        g(e(U), {
          label: "Share with the team",
          for: "library-share",
          help: "The type and the number of the item on this journal, such as doc 63."
        }, {
          default: C(() => [
            g(e(Y), {
              id: "library-share",
              modelValue: c.value,
              "onUpdate:modelValue": u[0] || (u[0] = (L) => c.value = L),
              placeholder: "doc 63",
              "data-library-share-field": ""
            }, null, 8, ["modelValue"])
          ]),
          _: 1
        }),
        g(e(O), {
          variant: "primary",
          disabled: !c.value.trim(),
          "data-library-share-submit": "",
          onClick: w
        }, {
          default: C(() => [...u[4] || (u[4] = [
            V("Share", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : S("", !0),
      l.value ? (a(), n(j, { key: 1 }, [
        f("p", Ne, v(l.value.line), 1),
        l.value.warning ? (a(), n("p", De, v(l.value.warning), 1)) : S("", !0)
      ], 64)) : S("", !0),
      e(b) ? (a(), n("p", We, v(e(b)), 1)) : S("", !0),
      p.copies.length ? S("", !0) : (a(), n("p", Ue, "No item on this journal follows an item of the library. Get one from the Library tab.")),
      f("ul", Ye, [
        (a(!0), n(j, null, P(p.copies, (L) => (a(), A(Pe, {
          key: L.copy_id,
          copy: L,
          role: p.role,
          onChoose: u[1] || (u[1] = (E, W) => $[W](E))
        }, null, 8, ["copy", "role"]))), 128))
      ]),
      o.value ? (a(), A(e(X), {
        key: 4,
        title: `Compare: ${o.value.copy.local_fields.title}`,
        onClose: u[3] || (u[3] = (L) => o.value = null)
      }, {
        default: C(() => [
          f("div", Ge, [
            i.includes(o.value.copy.share) ? S("", !0) : (a(), n("p", Me, "The text on this journal is lost when you use the library's version: a " + v(o.value.copy.share) + " keeps no earlier versions.", 1)),
            g(Oe, {
              here: o.value.copy.local_fields,
              library: o.value.there,
              at: (/* @__PURE__ */ new Date()).toISOString()
            }, null, 8, ["here", "library", "at"]),
            o.value.isTaking ? (a(), A(e(O), {
              key: 1,
              variant: "primary",
              "data-library-take": "",
              onClick: u[2] || (u[2] = (L) => m(o.value.copy))
            }, {
              default: C(() => [...u[5] || (u[5] = [
                V("Use the library's version", -1)
              ])]),
              _: 1
            })) : S("", !0)
          ])
        ]),
        _: 1
      }, 8, ["title"])) : S("", !0)
    ]));
  }
}, Ke = /* @__PURE__ */ I(Fe, [["__scopeId", "data-v-0af30610"]]), He = ["data-people-user"], ze = { class: "person-name" }, Je = {
  key: 0,
  class: "person-facts",
  "data-people-removed": ""
}, Qe = {
  key: 2,
  class: "person-failure",
  role: "alert",
  "data-people-failure": ""
}, Xe = {
  key: 3,
  class: "person-tokens",
  "data-people-token-list": ""
}, Ze = ["data-people-token"], ea = {
  key: 0,
  "data-people-revoked": ""
}, aa = {
  __name: "LibraryPerson",
  props: { user: { type: Object, required: !0 } },
  emits: ["role", "remove"],
  setup(p, { emit: x }) {
    const h = [
      { key: "admin", label: "Admin" },
      { key: "edit", label: "Edit" },
      { key: "read", label: "Read-only" }
    ], t = p, i = x, c = N(), l = T(null), o = T("");
    async function b() {
      c.state["tokens.user"] = String(t.user.id), await c.reload("tokens");
      const m = c.props.tokens;
      o.value = m.failure.value, l.value = m.failure.value ? null : m.data.value.tokens;
    }
    async function k() {
      if (l.value) return void (l.value = null);
      await b();
    }
    const { refusal: d, run: R } = D(b);
    return (m, $) => (a(), n("li", {
      class: "person",
      "data-people-user": p.user.id
    }, [
      f("span", ze, v(p.user.name), 1),
      p.user.removed_at ? (a(), n("span", Je, "Removed")) : (a(), n(j, { key: 1 }, [
        g(e(G), {
          options: h,
          value: p.user.role,
          "data-people-role": "",
          onPick: $[0] || ($[0] = (w) => i("role", p.user, w))
        }, null, 8, ["value"]),
        g(e(O), {
          small: "",
          "data-people-tokens": "",
          onClick: k
        }, {
          default: C(() => [...$[2] || ($[2] = [
            V("Tokens", -1)
          ])]),
          _: 1
        }),
        g(e(O), {
          small: "",
          variant: "danger",
          "data-people-remove": "",
          onClick: $[1] || ($[1] = (w) => i("remove", p.user))
        }, {
          default: C(() => [...$[3] || ($[3] = [
            V("Remove user", -1)
          ])]),
          _: 1
        })
      ], 64)),
      o.value || e(d) ? (a(), n("p", Qe, v(o.value || e(d)), 1)) : S("", !0),
      l.value ? (a(), n("ul", Xe, [
        (a(!0), n(j, null, P(l.value, (w) => (a(), n("li", {
          key: w.id,
          "data-people-token": w.id
        }, [
          f("span", null, v(w.label || "No label") + ", Last used: " + v(w.last_used_at || "never"), 1),
          w.revoked_at ? (a(), n("span", ea, "Revoked")) : (a(), A(e(O), {
            key: 1,
            small: "",
            variant: "danger",
            "data-people-revoke": "",
            onClick: (r) => e(R)(["library-user", "revoke", String(w.id)])
          }, {
            default: C(() => [...$[4] || ($[4] = [
              V("Revoke", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]))
        ], 8, Ze))), 128))
      ])) : S("", !0)
    ], 8, He));
  }
}, ta = /* @__PURE__ */ I(aa, [["__scopeId", "data-v-4a453da6"]]), la = {
  class: "people",
  "data-library-people": ""
}, ra = {
  key: 0,
  class: "people-token",
  "data-people-first-token": ""
}, sa = {
  key: 1,
  class: "people-failure",
  role: "alert",
  "data-people-refusal": ""
}, na = {
  __name: "LibraryPeople",
  setup(p) {
    const x = [
      { key: "admin", label: "Admin" },
      { key: "edit", label: "Edit" },
      { key: "read", label: "Read-only" }
    ], h = N(), { data: t, failure: i } = h.props.users, c = () => h.reload("users"), { refusal: l, run: o } = D(c), b = T(""), k = T("read"), d = T(null);
    async function R() {
      const m = await o(["library-user", "add", b.value.trim(), "--role", k.value]);
      d.value = m.ok ? m.value : null, m.ok && (b.value = "");
    }
    return c(), (m, $) => {
      var w;
      return a(), n("div", la, [
        f("form", {
          class: "people-add",
          "data-people-add": "",
          onSubmit: F(R, ["prevent"])
        }, [
          g(e(U), {
            label: "Add a user",
            for: "people-name",
            help: "Their first token is shown once, below."
          }, {
            default: C(() => [
              g(e(Y), {
                id: "people-name",
                modelValue: b.value,
                "onUpdate:modelValue": $[0] || ($[0] = (r) => b.value = r),
                placeholder: "Name",
                "data-people-name": ""
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          g(e(G), {
            options: x,
            value: k.value,
            "data-people-new-role": "",
            onPick: $[1] || ($[1] = (r) => k.value = r)
          }, null, 8, ["value"]),
          g(e(O), {
            variant: "primary",
            disabled: !b.value.trim(),
            "data-people-submit": "",
            onClick: R
          }, {
            default: C(() => [...$[4] || ($[4] = [
              V("Add the user", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ], 32),
        d.value ? (a(), n("p", ra, v(d.value.user.name) + " has this token, shown once: " + v(d.value.token_text), 1)) : S("", !0),
        e(l) ? (a(), n("p", sa, v(e(l)), 1)) : S("", !0),
        g(e(Q), {
          rows: ((w = e(t)) == null ? void 0 : w.users) ?? [],
          failure: e(i),
          loaded: !!e(t) || !!e(i),
          empty: "No users yet",
          hint: "The users of the shared server appear here."
        }, {
          default: C(({ row: r }) => [
            g(ta, {
              user: r,
              onRole: $[2] || ($[2] = (u, L) => e(o)(["library-user", "role", String(u.id), L])),
              onRemove: $[3] || ($[3] = (u) => e(o)(["library-user", "remove", String(u.id)]))
            }, null, 8, ["user"])
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]);
    };
  }
}, oa = /* @__PURE__ */ I(na, [["__scopeId", "data-v-1c77317b"]]), ia = {
  class: "teams",
  "data-teams": ""
}, da = { class: "teams-top" }, ua = {
  key: 0,
  class: "teams-failure",
  role: "alert",
  "data-teams-failure": ""
}, ca = {
  key: 1,
  class: "teams-failure",
  role: "alert",
  "data-teams-refusal": ""
}, pa = {
  class: "teams-header",
  "data-teams-header": ""
}, ya = { "data-teams-server": "" }, va = { "data-teams-role": "" }, ma = {
  key: 0,
  "data-teams-reached": ""
}, ba = {
  key: 1,
  "data-teams-plain": ""
}, fa = {
  key: 0,
  class: "teams-stopped",
  role: "alert",
  "data-teams-stopped": ""
}, ha = {
  __name: "TeamsPage",
  setup(p) {
    const x = { admin: "Admin", edit: "Edit", read: "Read-only" }, h = N(), { data: t, failure: i } = h.props.status, { data: c } = h.props.copies, l = T("library"), o = q(() => {
      var r;
      return !!((r = t.value) != null && r.is_connected) && !t.value.stopped;
    }), b = q(() => {
      var r, u;
      return ((r = t.value) == null ? void 0 : r.role) === "admin" || ((u = t.value) == null ? void 0 : u.role) === "edit";
    }), k = q(() => {
      var r;
      return ((r = c.value) == null ? void 0 : r.rows) ?? [];
    }), d = q(() => {
      var r;
      return ((r = t.value) == null ? void 0 : r.role) === "admin";
    }), R = q(() => [
      { key: "library", label: "Library" },
      { key: "copies", label: "On this journal", count: k.value.length },
      ...d.value ? [{ key: "people", label: "People" }] : []
    ]);
    async function m() {
      await h.reload(["status", "copies"]);
    }
    const { refusal: $, run: w } = D(m);
    return (r, u) => (a(), A(e(le), null, {
      default: C(() => {
        var L;
        return [
          f("div", ia, [
            f("div", da, [
              u[3] || (u[3] = f("h2", { class: "teams-title" }, "Teams", -1)),
              o.value ? (a(), A(e(O), {
                key: 0,
                small: "",
                "data-teams-sync": "",
                onClick: u[0] || (u[0] = (E) => e(w)(["library", "sync"]))
              }, {
                default: C(() => [...u[2] || (u[2] = [
                  V("Sync now", -1)
                ])]),
                _: 1
              })) : S("", !0)
            ]),
            e(i) ? (a(), n("p", ua, v(e(i)), 1)) : S("", !0),
            e($) ? (a(), n("p", ca, v(e($)), 1)) : S("", !0),
            (L = e(t)) != null && L.is_connected ? (a(), n(j, { key: 2 }, [
              f("div", pa, [
                f("span", ya, "Connected: " + v(e(t).server_name), 1),
                f("span", va, "Role: " + v(x[e(t).role]), 1),
                e(t).reached_at ? (a(), n("span", ma, [
                  u[4] || (u[4] = V("Last reached: ", -1)),
                  g(e(M), {
                    at: e(t).reached_at
                  }, null, 8, ["at"])
                ])) : S("", !0),
                e(t).is_encrypted ? S("", !0) : (a(), n("span", ba, "Connection: not encrypted"))
              ]),
              e(t).stopped ? (a(), n("p", fa, v(e(t).stopped), 1)) : S("", !0)
            ], 64)) : S("", !0),
            e(t) && !o.value ? (a(), A(xe, {
              key: 3,
              address: e(t).address,
              onConnected: m
            }, null, 8, ["address"])) : S("", !0),
            o.value ? (a(), n(j, { key: 4 }, [
              g(e(G), {
                options: R.value,
                value: l.value,
                "data-teams-tabs": "",
                onPick: u[1] || (u[1] = (E) => l.value = E)
              }, null, 8, ["options", "value"]),
              g(e(re), { value: l.value }, {
                library: C(() => [
                  g($e, {
                    role: e(t).role,
                    "can-write": b.value,
                    onChanged: m
                  }, null, 8, ["role", "can-write"])
                ]),
                copies: C(() => [
                  g(Ke, {
                    copies: k.value,
                    role: e(t).role,
                    "can-write": b.value,
                    onChanged: m
                  }, null, 8, ["copies", "role", "can-write"])
                ]),
                people: C(() => [
                  g(oa)
                ]),
                _: 1
              }, 8, ["value"])
            ], 64)) : S("", !0)
          ])
        ];
      }),
      _: 1
    }));
  }
}, ga = /* @__PURE__ */ I(ha, [["__scopeId", "data-v-455b7882"]]);
export {
  ga as default
};
