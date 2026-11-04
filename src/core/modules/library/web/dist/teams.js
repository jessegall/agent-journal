/* @code-commandments-generated */
if (!document.getElementById("window-styles-0d526185c4c0")) { const style = document.createElement("style"); style.id = "window-styles-0d526185c4c0"; style.textContent = ".library[data-v-25ee697c]{display:flex;flex-direction:column;gap:10px}.library-share[data-v-25ee697c]{display:flex;align-items:flex-end;gap:8px}.library-row[data-v-25ee697c]{display:flex;align-items:center;gap:10px;padding:6px 0}.library-open[data-v-25ee697c]{display:flex;flex:1;flex-direction:column;gap:2px;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.library-title[data-v-25ee697c]{font-weight:600}.library-abstract[data-v-25ee697c],.library-excerpt[data-v-25ee697c],.library-facts[data-v-25ee697c],.library-here[data-v-25ee697c]{color:var(--text-3);font-size:12px}.library-failure[data-v-25ee697c],.library-warning[data-v-25ee697c]{margin:0;color:var(--danger);font-size:13px}.library-fields dt[data-v-25ee697c]{margin-top:8px;color:var(--text-3);font-size:12px}.library-fields dd[data-v-25ee697c]{margin:2px 0 0;white-space:pre-wrap}.library-versions[data-v-25ee697c]{padding:0;list-style:none}.library-versions li[data-v-25ee697c]{display:flex;align-items:center;justify-content:space-between;gap:8px;padding:4px 0;font-size:13px}.connect[data-v-5b788b3e]{display:flex;flex-direction:column;gap:12px;max-width:420px}.connect-lead[data-v-5b788b3e]{margin:0;color:var(--text-2);font-size:13px}.connect-failure[data-v-5b788b3e]{margin:0;color:var(--danger);font-size:13px}.teams[data-v-970c94ea]{display:flex;flex-direction:column;gap:10px}.teams-title[data-v-970c94ea]{margin:0;font-size:16px}.teams-header[data-v-970c94ea]{display:flex;flex-wrap:wrap;gap:6px 18px;color:var(--text-2);font-size:13px}.teams-failure[data-v-970c94ea],.teams-stopped[data-v-970c94ea]{margin:0;color:var(--danger);font-size:13px}\n"; document.head.appendChild(style); }
import { ref as k, watch as U, openBlock as r, createElementBlock as d, createVNode as v, unref as t, withModifiers as K, withCtx as _, createTextVNode as g, createCommentVNode as u, Fragment as x, createElementVNode as i, toDisplayString as n, createBlock as L, renderList as F, computed as M } from "vue";
import { useWindow as H, useRunLine as z, SearchBar as G, Segmented as Q, FormField as D, TextInput as N, Btn as R, RowList as X, TimeAgo as O, SidePanel as Z, useReadLine as ee, usePoll as ae, WindowRoom as te } from "@journal/window-kit";
const W = (h, w) => {
  const s = h.__vccOpts || h;
  for (const [f, m] of w)
    s[f] = m;
  return s;
}, re = {
  class: "library",
  "data-library": ""
}, le = {
  class: "library-shared",
  "data-library-shared": ""
}, se = {
  key: 0,
  class: "library-warning",
  role: "alert",
  "data-library-warning": ""
}, ne = {
  key: 2,
  class: "library-failure",
  role: "alert",
  "data-library-refusal": ""
}, oe = ["data-library-item"], ie = ["onClick"], de = { class: "library-title" }, ue = {
  key: 0,
  class: "library-excerpt",
  "data-library-excerpt": ""
}, ce = {
  key: 1,
  class: "library-abstract"
}, ye = { class: "library-facts" }, ve = {
  key: 0,
  class: "library-here",
  "data-library-here": ""
}, me = { "data-library-panel": "" }, be = { class: "library-facts" }, pe = {
  class: "library-fields",
  "data-library-fields": ""
}, ke = {
  class: "library-versions",
  "data-library-versions": ""
}, _e = ["data-library-version"], he = 300, fe = {
  __name: "LibraryBrowse",
  props: { role: { type: String, required: !0 }, canWrite: Boolean },
  setup(h) {
    const w = [
      { key: "", label: "All" },
      { key: "doc", label: "Documents" },
      { key: "sequence", label: "Sequences" },
      { key: "check", label: "Checks" }
    ], s = { doc: "Document", sequence: "Sequence", check: "Check" }, f = H(), m = k(""), b = k(""), C = k([]), p = k(!1), c = k(""), o = k(null), V = k([]), y = k(""), $ = k(null), { refusal: I, run: T } = z(B);
    let E = 0;
    const J = (l) => `${l.kind}:${l.id}`;
    async function B() {
      const l = b.value.trim(), a = await f.read(`library list${m.value ? ` --kind ${m.value}` : ""}${l ? ` --search ${JSON.stringify(l)}` : ""}`);
      c.value = a.ok ? "" : a.error, C.value = a.ok ? a.value.rows.map((e) => ({ ...e, item_id: e.id, id: J(e) })) : [], p.value = !0;
    }
    async function P(l) {
      const [a, e] = await Promise.all([f.read(`library show ${l.kind} ${l.item_id}`), f.read(`library versions ${l.kind} ${l.item_id}`)]);
      I.value = a.ok ? "" : a.error, o.value = a.ok ? { ...a.value, title: l.title } : null, V.value = e.ok ? e.value.versions : [];
    }
    async function q() {
      const l = o.value;
      await P({ kind: l.kind, item_id: l.id, title: l.title });
    }
    async function Y(l) {
      (await T(["library", "remove", l.kind, String(l.item_id ?? l.id)])).ok && o.value && await q();
    }
    async function A(l, a = null) {
      (await T(["library", "restore", l.kind, String(l.id), ...a ? ["--version", String(a)] : []])).ok && await q();
    }
    async function j() {
      const [l, a, ...e] = y.value.trim().split(/\s+/);
      if (!l || !/^\d+$/.test(a ?? "") || e.length) return void (I.value = "Write the kind and the number, such as doc 63.");
      const S = await T(["library", "share", l, a]);
      $.value = S.ok ? S.value : null, S.ok && (y.value = "");
    }
    return U(m, B, { immediate: !0 }), U(b, () => {
      clearTimeout(E), E = setTimeout(B, he);
    }), (l, a) => (r(), d("div", re, [
      v(t(G), {
        modelValue: b.value,
        "onUpdate:modelValue": a[0] || (a[0] = (e) => b.value = e),
        placeholder: "Search the library",
        "data-library-search": ""
      }, null, 8, ["modelValue"]),
      v(t(Q), {
        options: w,
        value: m.value,
        "data-library-kind": "",
        onPick: a[1] || (a[1] = (e) => m.value = e)
      }, null, 8, ["value"]),
      h.canWrite ? (r(), d("form", {
        key: 0,
        class: "library-share",
        "data-library-share": "",
        onSubmit: K(j, ["prevent"])
      }, [
        v(t(D), {
          label: "Share with the team",
          for: "library-share",
          help: "The kind and the number of the item on this journal, such as doc 63."
        }, {
          default: _(() => [
            v(t(N), {
              id: "library-share",
              modelValue: y.value,
              "onUpdate:modelValue": a[2] || (a[2] = (e) => y.value = e),
              placeholder: "doc 63",
              "data-library-share-field": ""
            }, null, 8, ["modelValue"])
          ]),
          _: 1
        }),
        v(t(R), {
          kind: "primary",
          disabled: !y.value.trim(),
          "data-library-share-submit": "",
          onClick: j
        }, {
          default: _(() => [...a[5] || (a[5] = [
            g("Share", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : u("", !0),
      $.value ? (r(), d(x, { key: 1 }, [
        i("p", le, n($.value.line), 1),
        $.value.warning ? (r(), d("p", se, n($.value.warning), 1)) : u("", !0)
      ], 64)) : u("", !0),
      t(I) ? (r(), d("p", ne, n(t(I)), 1)) : u("", !0),
      v(t(X), {
        rows: C.value,
        failure: c.value,
        loaded: p.value,
        searching: !!(b.value.trim() || m.value),
        empty: "Nothing in the library yet",
        hint: "Shared documents, sequences and checks appear here."
      }, {
        default: _(({ row: e }) => [
          i("div", {
            class: "library-row",
            "data-library-item": e.id
          }, [
            i("button", {
              type: "button",
              class: "library-open",
              "data-library-open": "",
              onClick: (S) => P(e)
            }, [
              i("span", de, n(e.title), 1),
              e.excerpt ? (r(), d("span", ue, n(e.excerpt), 1)) : (r(), d("span", ce, n(e.abstract), 1)),
              i("span", ye, [
                g(n(s[e.kind]) + ", Version: " + n(e.version) + ", Changed by: " + n(e.updated_by) + ", ", 1),
                v(t(O), {
                  at: e.updated_at
                }, null, 8, ["at"])
              ])
            ], 8, ie),
            e.copy_id ? (r(), d("span", ve, "On this journal")) : u("", !0),
            h.role === "admin" ? (r(), L(t(R), {
              key: 1,
              small: "",
              kind: "danger",
              "data-library-remove": "",
              onClick: (S) => Y(e)
            }, {
              default: _(() => [...a[6] || (a[6] = [
                g("Remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])) : u("", !0)
          ], 8, oe)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "searching"]),
      o.value ? (r(), L(t(Z), {
        key: 3,
        title: o.value.title,
        onClose: a[4] || (a[4] = (e) => o.value = null)
      }, {
        default: _(() => [
          i("div", me, [
            o.value.removed_at ? (r(), d(x, { key: 0 }, [
              a[8] || (a[8] = i("p", {
                class: "library-removed",
                "data-library-removed": ""
              }, "Removed from the library", -1)),
              h.role === "admin" ? (r(), L(t(R), {
                key: 0,
                small: "",
                kind: "primary",
                "data-library-restore": "",
                onClick: a[3] || (a[3] = (e) => A(o.value))
              }, {
                default: _(() => [...a[7] || (a[7] = [
                  g("Restore", -1)
                ])]),
                _: 1
              })) : u("", !0)
            ], 64)) : u("", !0),
            i("p", be, n(s[o.value.kind]) + ", Version: " + n(o.value.version) + ", Changed by: " + n(o.value.updated_by), 1),
            i("dl", pe, [
              (r(!0), d(x, null, F(o.value.fields, (e, S) => (r(), d(x, { key: S }, [
                i("dt", null, n(S), 1),
                i("dd", null, n(e), 1)
              ], 64))), 128))
            ]),
            a[10] || (a[10] = i("h3", { class: "library-heading" }, "Versions", -1)),
            i("ul", ke, [
              (r(!0), d(x, null, F(V.value, (e) => (r(), d("li", {
                key: e.version,
                "data-library-version": e.version
              }, [
                i("span", null, [
                  g("Version: " + n(e.version) + ", Changed by: " + n(e.user) + ", ", 1),
                  v(t(O), {
                    at: e.created_at
                  }, null, 8, ["at"])
                ]),
                h.canWrite && e.version !== o.value.version ? (r(), L(t(R), {
                  key: 0,
                  small: "",
                  "data-library-restore-version": "",
                  onClick: (S) => A(o.value, e.version)
                }, {
                  default: _(() => [...a[9] || (a[9] = [
                    g("Restore this version", -1)
                  ])]),
                  _: 1
                }, 8, ["onClick"])) : u("", !0)
              ], 8, _e))), 128))
            ])
          ])
        ]),
        _: 1
      }, 8, ["title"])) : u("", !0)
    ]));
  }
}, Ce = /* @__PURE__ */ W(fe, [["__scopeId", "data-v-25ee697c"]]), $e = {
  key: 0,
  class: "connect-failure",
  role: "alert",
  "data-library-refusal": ""
}, Se = {
  __name: "LibraryConnect",
  props: { address: { type: String, default: "" } },
  emits: ["connected"],
  setup(h, { emit: w }) {
    const s = h, f = w, m = H(), b = k(s.address), C = k(""), p = k(""), c = k(!1);
    async function o() {
      c.value = !0;
      const V = await m.run(["library", "connect", ...b.value.trim() ? [b.value.trim()] : [], "--token", C.value.trim()]);
      c.value = !1, p.value = V.ok ? "" : V.error, V.ok && (C.value = "", f("connected"));
    }
    return (V, y) => (r(), d("form", {
      class: "connect",
      "data-library-connect": "",
      onSubmit: K(o, ["prevent"])
    }, [
      y[3] || (y[3] = i("p", { class: "connect-lead" }, "Connect this journal to your team's shared server to read and share documents, sequences and checks.", -1)),
      v(t(D), {
        label: "Address",
        for: "library-address",
        help: "An IP address or a web address, such as 10.0.0.5 or https://library.example.com."
      }, {
        default: _(() => [
          v(t(N), {
            id: "library-address",
            modelValue: b.value,
            "onUpdate:modelValue": y[0] || (y[0] = ($) => b.value = $),
            placeholder: "library.example.com",
            "data-library-address": ""
          }, null, 8, ["modelValue"])
        ]),
        _: 1
      }),
      v(t(D), {
        label: "Token",
        for: "library-token",
        help: "The token an admin of the server gave you. It is stored outside the project."
      }, {
        default: _(() => [
          v(t(N), {
            id: "library-token",
            modelValue: C.value,
            "onUpdate:modelValue": y[1] || (y[1] = ($) => C.value = $),
            type: "password",
            autocomplete: "off",
            placeholder: "jsl_...",
            "data-library-token": ""
          }, null, 8, ["modelValue"])
        ]),
        _: 1
      }),
      p.value ? (r(), d("p", $e, n(p.value), 1)) : u("", !0),
      v(t(R), {
        kind: "primary",
        busy: c.value,
        disabled: !C.value.trim(),
        "data-library-submit": "",
        onClick: o
      }, {
        default: _(() => [...y[2] || (y[2] = [
          g("Connect", -1)
        ])]),
        _: 1
      }, 8, ["busy", "disabled"])
    ], 32));
  }
}, ge = /* @__PURE__ */ W(Se, [["__scopeId", "data-v-5b788b3e"]]), we = {
  class: "teams",
  "data-teams": ""
}, Ve = {
  key: 0,
  class: "teams-failure",
  role: "alert",
  "data-teams-failure": ""
}, Le = {
  class: "teams-header",
  "data-teams-header": ""
}, xe = { "data-teams-server": "" }, Re = { "data-teams-role": "" }, Ie = {
  key: 0,
  "data-teams-reached": ""
}, Te = {
  key: 1,
  "data-teams-plain": ""
}, Be = {
  key: 0,
  class: "teams-stopped",
  role: "alert",
  "data-teams-stopped": ""
}, De = 5e3, Ne = {
  __name: "TeamsPage",
  setup(h) {
    const w = { admin: "Admin", edit: "Edit", read: "Read-only" }, { value: s, failure: f, load: m } = ee(() => "library status"), b = M(() => {
      var p;
      return !!((p = s.value) != null && p.is_connected) && !s.value.stopped;
    }), C = M(() => {
      var p, c;
      return ((p = s.value) == null ? void 0 : p.role) === "admin" || ((c = s.value) == null ? void 0 : c.role) === "edit";
    });
    return ae(m, () => !0, De), (p, c) => (r(), L(t(te), null, {
      default: _(() => {
        var o;
        return [
          i("div", we, [
            c[1] || (c[1] = i("h2", { class: "teams-title" }, "Teams", -1)),
            t(f) ? (r(), d("p", Ve, n(t(f)), 1)) : u("", !0),
            (o = t(s)) != null && o.is_connected ? (r(), d(x, { key: 1 }, [
              i("div", Le, [
                i("span", xe, "Connected: " + n(t(s).server_name), 1),
                i("span", Re, "Role: " + n(w[t(s).role]), 1),
                t(s).reached_at ? (r(), d("span", Ie, [
                  c[0] || (c[0] = g("Last reached: ", -1)),
                  v(t(O), {
                    at: t(s).reached_at
                  }, null, 8, ["at"])
                ])) : u("", !0),
                t(s).is_encrypted ? u("", !0) : (r(), d("span", Te, "Connection: not encrypted"))
              ]),
              t(s).stopped ? (r(), d("p", Be, n(t(s).stopped), 1)) : u("", !0)
            ], 64)) : u("", !0),
            t(s) && !b.value ? (r(), L(ge, {
              key: 2,
              address: t(s).address,
              onConnected: t(m)
            }, null, 8, ["address", "onConnected"])) : u("", !0),
            b.value ? (r(), L(Ce, {
              key: 3,
              role: t(s).role,
              "can-write": C.value
            }, null, 8, ["role", "can-write"])) : u("", !0)
          ])
        ];
      }),
      _: 1
    }));
  }
}, Ee = /* @__PURE__ */ W(Ne, [["__scopeId", "data-v-970c94ea"]]);
export {
  Ee as default
};
