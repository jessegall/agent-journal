if (!document.getElementById("window-styles-2db6a4f3301d")) { const style = document.createElement("style"); style.id = "window-styles-2db6a4f3301d"; style.textContent = ".connect[data-v-b69f5dd5]{display:flex;flex-direction:column;gap:12px;max-width:420px}.connect-lead[data-v-b69f5dd5]{margin:0;color:var(--text-2);font-size:13px}.connect-failure[data-v-b69f5dd5]{margin:0;color:var(--danger);font-size:13px}.person[data-v-21161250]{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;padding:8px 0}.person-name[data-v-21161250]{min-width:120px;font-weight:600}.person-facts[data-v-21161250],.person-tokens[data-v-21161250]{color:var(--text-3);font-size:12px}.person-tokens[data-v-21161250]{flex-basis:100%;margin:0;padding:0 0 0 16px;list-style:none}.person-tokens li[data-v-21161250]{display:flex;align-items:center;gap:10px;padding:2px 0}.person-failure[data-v-21161250]{flex-basis:100%;margin:0;color:var(--danger);font-size:13px}.people[data-v-ebd0ab68]{display:flex;flex-direction:column;gap:10px}.people-add[data-v-ebd0ab68]{display:flex;align-items:flex-end;gap:10px}.people-token[data-v-ebd0ab68]{margin:0;font-family:var(--mono);font-size:12px;word-break:break-all}.people-failure[data-v-ebd0ab68]{margin:0;color:var(--danger);font-size:13px}.compare[data-v-a6494d43]{display:flex;flex-direction:column;gap:10px}.compare-help[data-v-a6494d43]{margin:0;color:var(--text-3);font-size:12px}.when[data-v-a44b2241],.loss[data-v-a44b2241]{margin:8px 0;color:var(--text-3);font-size:12.5px}.versions[data-v-a44b2241]{display:flex;flex-direction:column;gap:6px;margin:0;padding:0;list-style:none;font-size:12.5px}.versions li[data-v-a44b2241]{display:flex;align-items:center;justify-content:space-between;gap:8px}.failure[data-v-13a6a680]{margin:0;padding:6px var(--inset);color:var(--bad, var(--text-2));font-size:12px}.quiet[data-v-13a6a680]{color:var(--text-4);font-size:12px;white-space:nowrap}.badge-update[data-v-13a6a680]{padding:1px 7px;border-radius:999px;background:var(--accent-dim);color:var(--accent-text);font-size:11.5px;font-weight:500}.note[data-v-13a6a680]{margin:0 0 8px;color:var(--text-2);font-size:13px}pre[data-v-13a6a680]{margin:0;padding:8px;overflow:auto;border:1px solid var(--border);border-radius:6px;font-size:12px}.teams[data-v-0a68d8f5]{display:flex;flex:1;flex-direction:column;gap:6px;min-height:0}.teams-header[data-v-0a68d8f5]{display:flex;flex-wrap:wrap;gap:6px 18px;padding:0 var(--inset);color:var(--text-2);font-size:13px}.teams-note[data-v-0a68d8f5]{margin:0;padding:0 var(--inset);color:var(--text-2);font-size:13px}.failure[data-v-0a68d8f5]{color:var(--danger)}\n"; document.head.appendChild(style); }
import { ref as $, openBlock as n, createElementBlock as u, withModifiers as re, createElementVNode as A, createVNode as b, unref as t, withCtx as f, toDisplayString as _, createCommentVNode as w, createTextVNode as q, Fragment as E, renderList as Y, createBlock as D, computed as V, useModel as ue, watch as le, mergeModels as ee, createSlots as de } from "vue";
import { useWindow as U, FormField as M, TextInput as G, Btn as N, useRunLine as z, Segmented as J, RowList as ce, CreateDialog as me, DiffCard as ve, copying as pe, Reader as ye, TimeAgo as H, ActionsMenu as be, defaultFilter as fe, applyFilter as he, ListReaderLayout as ke, Skeleton as we, FilterBar as ge, Dialog as _e, WindowRoom as $e, PageHeader as Se, SwitchCase as Ce } from "@journal/window-kit";
const W = (a, h) => {
  const s = a.__vccOpts || a;
  for (const [r, i] of h)
    s[r] = i;
  return s;
}, Re = {
  key: 0,
  class: "connect-failure",
  role: "alert",
  "data-library-refusal": ""
}, Te = {
  __name: "LibraryConnect",
  props: { address: { type: String, default: "" } },
  emits: ["connected"],
  setup(a, { emit: h }) {
    const s = a, r = h, i = U(), e = $(s.address), l = $(""), d = $(""), o = $(!1);
    async function v() {
      o.value = !0;
      const R = await i.run(["library", "connect", ...e.value.trim() ? [e.value.trim()] : [], "--token", l.value.trim()]);
      o.value = !1, d.value = R.ok ? "" : R.error, R.ok && (l.value = "", r("connected"));
    }
    return (R, k) => (n(), u("form", {
      class: "connect",
      "data-library-connect": "",
      onSubmit: re(v, ["prevent"])
    }, [
      k[3] || (k[3] = A("p", { class: "connect-lead" }, "Connect this journal to your team's shared server to read and share documents, sequences and checks.", -1)),
      b(t(M), {
        label: "Address",
        for: "library-address",
        help: "An IP address or a web address, such as 10.0.0.5 or https://library.example.com."
      }, {
        default: f(() => [
          b(t(G), {
            id: "library-address",
            modelValue: e.value,
            "onUpdate:modelValue": k[0] || (k[0] = (g) => e.value = g),
            placeholder: "library.example.com",
            "data-library-address": ""
          }, null, 8, ["modelValue"])
        ]),
        _: 1
      }),
      b(t(M), {
        label: "Token",
        for: "library-token",
        help: "The token an admin of the server gave you. It is stored outside the project."
      }, {
        default: f(() => [
          b(t(G), {
            id: "library-token",
            modelValue: l.value,
            "onUpdate:modelValue": k[1] || (k[1] = (g) => l.value = g),
            type: "password",
            autocomplete: "off",
            placeholder: "jsl_...",
            "data-library-token": ""
          }, null, 8, ["modelValue"])
        ]),
        _: 1
      }),
      d.value ? (n(), u("p", Re, _(d.value), 1)) : w("", !0),
      b(t(N), {
        variant: "primary",
        busy: o.value,
        disabled: !l.value.trim(),
        "data-library-submit": "",
        onClick: v
      }, {
        default: f(() => [...k[2] || (k[2] = [
          q("Connect", -1)
        ])]),
        _: 1
      }, 8, ["busy", "disabled"])
    ], 32));
  }
}, xe = /* @__PURE__ */ W(Te, [["__scopeId", "data-v-b69f5dd5"]]), Oe = ["data-people-user"], Le = { class: "person-name" }, Ve = {
  key: 0,
  class: "person-facts",
  "data-people-removed": ""
}, qe = {
  key: 2,
  class: "person-failure",
  role: "alert",
  "data-people-failure": ""
}, Ae = {
  key: 3,
  class: "person-tokens",
  "data-people-token-list": ""
}, Ie = ["data-people-token"], je = {
  key: 0,
  "data-people-revoked": ""
}, De = {
  __name: "LibraryPerson",
  props: { user: { type: Object, required: !0 } },
  emits: ["role", "remove"],
  setup(a, { emit: h }) {
    const s = [
      { key: "admin", label: "Admin" },
      { key: "edit", label: "Edit" },
      { key: "read", label: "Read-only" }
    ], r = a, i = h, e = U(), l = $(null), d = $("");
    async function o() {
      e.state["tokens.user"] = String(r.user.id), await e.reload("tokens");
      const g = e.props.tokens;
      d.value = g.failure.value, l.value = g.failure.value ? null : g.data.value.tokens;
    }
    async function v() {
      if (l.value) return void (l.value = null);
      await o();
    }
    const { refusal: R, run: k } = z(o);
    return (g, m) => (n(), u("li", {
      class: "person",
      "data-people-user": a.user.id
    }, [
      A("span", Le, _(a.user.name), 1),
      a.user.removed_at ? (n(), u("span", Ve, "Removed")) : (n(), u(E, { key: 1 }, [
        b(t(J), {
          options: s,
          value: a.user.role,
          "data-people-role": "",
          onPick: m[0] || (m[0] = (x) => i("role", a.user, x))
        }, null, 8, ["value"]),
        b(t(N), {
          small: "",
          "data-people-tokens": "",
          onClick: v
        }, {
          default: f(() => [...m[2] || (m[2] = [
            q("Tokens", -1)
          ])]),
          _: 1
        }),
        b(t(N), {
          small: "",
          variant: "danger",
          "data-people-remove": "",
          onClick: m[1] || (m[1] = (x) => i("remove", a.user))
        }, {
          default: f(() => [...m[3] || (m[3] = [
            q("Remove user", -1)
          ])]),
          _: 1
        })
      ], 64)),
      d.value || t(R) ? (n(), u("p", qe, _(d.value || t(R)), 1)) : w("", !0),
      l.value ? (n(), u("ul", Ae, [
        (n(!0), u(E, null, Y(l.value, (x) => (n(), u("li", {
          key: x.id,
          "data-people-token": x.id
        }, [
          A("span", null, _(x.label || "No label") + ", Last used: " + _(x.last_used_at || "never"), 1),
          x.revoked_at ? (n(), u("span", je, "Revoked")) : (n(), D(t(N), {
            key: 1,
            small: "",
            variant: "danger",
            "data-people-revoke": "",
            onClick: (O) => t(k)(["library-user", "revoke", String(x.id)])
          }, {
            default: f(() => [...m[4] || (m[4] = [
              q("Revoke", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]))
        ], 8, Ie))), 128))
      ])) : w("", !0)
    ], 8, Oe));
  }
}, Ne = /* @__PURE__ */ W(De, [["__scopeId", "data-v-21161250"]]), Ee = {
  class: "people",
  "data-library-people": ""
}, Ue = {
  key: 0,
  class: "people-token",
  "data-people-first-token": ""
}, We = {
  key: 1,
  class: "people-failure",
  role: "alert",
  "data-people-refusal": ""
}, Pe = {
  __name: "LibraryPeople",
  setup(a) {
    const h = [
      { key: "admin", label: "Admin" },
      { key: "edit", label: "Edit" },
      { key: "read", label: "Read-only" }
    ], s = U(), { data: r, failure: i } = s.props.users, e = () => s.reload("users"), { refusal: l, run: d } = z(e), o = $(""), v = $("read"), R = $(null);
    async function k() {
      const g = await d(["library-user", "add", o.value.trim(), "--role", v.value]);
      R.value = g.ok ? g.value : null, g.ok && (o.value = "");
    }
    return e(), (g, m) => {
      var x;
      return n(), u("div", Ee, [
        A("form", {
          class: "people-add",
          "data-people-add": "",
          onSubmit: re(k, ["prevent"])
        }, [
          b(t(M), {
            label: "Add a user",
            for: "people-name",
            help: "Their first token is shown once, below."
          }, {
            default: f(() => [
              b(t(G), {
                id: "people-name",
                modelValue: o.value,
                "onUpdate:modelValue": m[0] || (m[0] = (O) => o.value = O),
                placeholder: "Name",
                "data-people-name": ""
              }, null, 8, ["modelValue"])
            ]),
            _: 1
          }),
          b(t(J), {
            options: h,
            value: v.value,
            "data-people-new-role": "",
            onPick: m[1] || (m[1] = (O) => v.value = O)
          }, null, 8, ["value"]),
          b(t(N), {
            variant: "primary",
            disabled: !o.value.trim(),
            "data-people-submit": "",
            onClick: k
          }, {
            default: f(() => [...m[4] || (m[4] = [
              q("Add the user", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ], 32),
        R.value ? (n(), u("p", Ue, _(R.value.user.name) + " has this token, shown once: " + _(R.value.token_text), 1)) : w("", !0),
        t(l) ? (n(), u("p", We, _(t(l)), 1)) : w("", !0),
        b(t(ce), {
          rows: ((x = t(r)) == null ? void 0 : x.users) ?? [],
          failure: t(i),
          loaded: !!t(r) || !!t(i),
          empty: "No users yet",
          hint: "The users of the shared server appear here."
        }, {
          default: f(({ row: O }) => [
            b(Ne, {
              user: O,
              onRole: m[2] || (m[2] = (T, C) => t(d)(["library-user", "role", String(T.id), C])),
              onRemove: m[3] || (m[3] = (T) => t(d)(["library-user", "remove", String(T.id)]))
            }, null, 8, ["user"])
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]);
    };
  }
}, Be = /* @__PURE__ */ W(Pe, [["__scopeId", "data-v-ebd0ab68"]]), Fe = {
  __name: "ShareDialog",
  emits: ["close", "shared"],
  setup(a, { emit: h }) {
    const s = h, r = U(), i = [
      { key: "kind", label: "Type", kind: "select", options: [["doc", "Document"], ["sequence", "Sequence"], ["check", "Check"]], required: !0 },
      { key: "number", label: "Number", required: !0, placeholder: "63" }
    ], e = (o) => /^\d+$/.test(o.number.trim()) ? {} : { number: "Write the number, such as 63." }, l = (o) => `journal library share ${o.kind} ${o.number.trim() || "…"}`;
    async function d(o) {
      const v = await r.run(["library", "share", o.kind, o.number.trim()]);
      return v.ok && s("shared", v.value), v;
    }
    return (o, v) => (n(), D(t(me), {
      title: "Share",
      submit: "Share",
      fields: i,
      command: l,
      check: e,
      run: d,
      onClose: v[0] || (v[0] = (R) => s("close"))
    }));
  }
};
function Me(a, h) {
  const s = a === "" ? [] : a.split(`
`), r = h === "" ? [] : h.split(`
`), i = Array.from({ length: s.length + 1 }, () => new Array(r.length + 1).fill(0));
  for (let o = s.length - 1; o >= 0; o--)
    for (let v = r.length - 1; v >= 0; v--)
      i[o][v] = s[o] === r[v] ? i[o + 1][v + 1] + 1 : Math.max(i[o + 1][v], i[o][v + 1]);
  const e = [];
  let l = 0, d = 0;
  for (; l < s.length || d < r.length; )
    l < s.length && d < r.length && s[l] === r[d] ? e.push({ line_type: "ctx", line: d + 1, text: r[d++] }) && l++ : d < r.length && (l === s.length || i[l][d + 1] >= i[l + 1][d]) ? e.push({ line_type: "add", line: d + 1, text: r[d++] }) : e.push({ line_type: "del", line: null, text: s[l++] });
  return { rows: e, added: e.filter((o) => o.line_type === "add").length, removed: e.filter((o) => o.line_type === "del").length };
}
const Ge = {
  class: "compare",
  "data-library-compare": ""
}, He = {
  key: 0,
  "data-library-same": ""
}, Ke = {
  __name: "CopyCompare",
  props: { here: { type: Object, required: !0 }, library: { type: Object, required: !0 }, at: { type: String, required: !0 } },
  setup(a) {
    const h = a, s = V(
      () => Object.keys({ ...h.here, ...h.library }).map((r) => ({ name: r, ...Me(String(h.here[r] ?? ""), String(h.library[r] ?? "")) })).filter((r) => r.added || r.removed)
    );
    return (r, i) => (n(), u("div", Ge, [
      i[0] || (i[0] = A("p", { class: "compare-help" }, "Red lines are only on this journal. Green lines are only in the library.", -1)),
      s.value.length ? w("", !0) : (n(), u("p", He, "The two versions have the same text.")),
      (n(!0), u(E, null, Y(s.value, (e) => (n(), D(t(ve), {
        key: e.name,
        path: e.name,
        change: "edit",
        added: e.added,
        removed: e.removed,
        at: a.at,
        rows: e.rows,
        "data-library-diff": ""
      }, null, 8, ["path", "added", "removed", "at", "rows"]))), 128))
    ]));
  }
}, Ye = /* @__PURE__ */ W(Ke, [["__scopeId", "data-v-a6494d43"]]), K = { doc: "Document", sequence: "Sequence", check: "Check" }, ze = { doc: "Documents", sequence: "Sequences", check: "Checks" }, P = { update: "Update", current: "Up to date", unfollowed: "Not followed" }, se = ["doc"], Je = ["unsent", "sending", "agent", "denied", "rejected", "paused"], ne = (a) => a ? a.status === "synced" ? "current" : "update" : "unfollowed", te = (a) => ne(a) !== "update" ? "" : a.status === "removed" ? "Removed from the library" : Je.includes(a.status) ? "Changed here" : "Newer in library", F = [
  { key: "kind", label: "Type", options: Object.entries(K), get: (a) => a.row.share },
  { key: "state", label: "State", options: Object.entries(P), get: (a) => a.state }
];
function Qe(a, h) {
  const s = new Map(h.map((e) => [`${e.share}:${e.item_id}`, e])), r = a.map((e) => ({ id: `${e.share}:${e.id}`, title: e.title, share: e.share, item_id: e.id, by: e.updated_by, at: e.updated_at, version: e.version, copy: s.get(`${e.share}:${e.id}`) ?? null })), i = h.filter((e) => !a.some((l) => l.share === e.share && l.id === e.item_id)).map((e) => ({ id: `${e.share}:${e.item_id}`, title: e.local_fields.title, share: e.share, item_id: e.item_id, by: "", at: "", version: e.version, copy: e }));
  return [...r, ...i].map((e) => {
    const l = ne(e.copy);
    return { id: e.id, title: e.title, desc: [te(e.copy), e.by].filter(Boolean).join(" · "), group: ze[e.share], state: l, way: te(e.copy), row: e };
  });
}
const oe = (a) => a.state === "unfollowed" ? "Follow" : a.state === "update" ? a.way === "Changed here" ? "Share" : "Update" : "";
function Xe(a, { open: h, act: s, canWrite: r, leave: i }) {
  const e = oe(a);
  return [
    ...h ? [{ label: "Open", group: "open", run: h }] : [],
    ...e ? [{ label: e, group: "open", disabled: !r && e !== "Follow", reason: "Your role may not change the library", run: () => s(e) }] : [],
    { label: "Copy name", group: "copy", run: ({ say: l }) => pe(a.title, a.title, l) },
    ...a.row.copy ? [{ label: "Stop following", group: "own", run: i }] : []
  ];
}
const Ze = {
  key: 0,
  class: "when",
  "data-team-when": ""
}, et = {
  key: 1,
  class: "when",
  "data-team-note": ""
}, tt = {
  key: 0,
  class: "loss",
  "data-library-loss": ""
}, at = {
  key: 0,
  class: "loss",
  role: "alert"
}, rt = {
  class: "versions",
  "data-library-versions": ""
}, lt = ["data-library-version"], st = {
  __name: "TeamReader",
  props: /* @__PURE__ */ ee({ item: { type: Object, required: !0 }, items: { type: Array, required: !0 }, canWrite: Boolean }, {
    tab: { type: String, default: "details" },
    tabModifiers: {}
  }),
  emits: /* @__PURE__ */ ee(["act"], ["update:tab"]),
  setup(a, { emit: h }) {
    const s = a, r = h, i = U(), e = ue(a, "tab"), l = V(() => s.item.row.copy), d = V(() => oe(s.item)), o = V(() => !l.value || l.value.version === l.value.server_version), v = V(() => [
      { name: "kind", label: "Type", value: K[s.item.row.share] },
      { name: "state", label: "State", value: s.item.way ? `${P[s.item.state]}: ${s.item.way}` : P[s.item.state] },
      ...o.value ? [{ name: "version", label: "Version", value: String(s.item.row.version) }] : [{ name: "library", label: "Library", value: `version ${l.value.server_version}` }, { name: "here", label: "Here", value: `version ${l.value.version}` }]
    ]), R = V(() => [{ key: "details", label: "Details" }, ...s.item.state === "update" && l.value ? [{ key: "compare", label: "Compare" }] : [], { key: "versions", label: "Versions" }]), k = $([]), g = $("");
    async function m() {
      i.state["inspection.share"] = s.item.row.share, i.state["inspection.id"] = String(s.item.row.item_id), await i.reload("inspection");
      const T = i.props.inspection;
      g.value = T.failure.value, k.value = g.value ? [] : T.data.value.versions;
    }
    le([() => e.value, () => s.item.id], ([T]) => T === "versions" && m(), { immediate: !0 });
    const x = async (T) => {
      const C = await i.run(["library", "restore", s.item.row.share, String(s.item.row.item_id), "--version", String(T)]);
      C.ok ? m() : g.value = C.error;
    }, O = V(() => {
      var T;
      return ((T = l.value) == null ? void 0 : T.server_fields) ?? {};
    });
    return (T, C) => (n(), D(t(ye), {
      tab: e.value,
      "onUpdate:tab": C[2] || (C[2] = (S) => e.value = S),
      title: a.item.title,
      number: `${t(K)[a.item.row.share]} ${a.item.row.item_id}`,
      abstract: a.item.row.by ? `Shared by ${a.item.row.by}` : "",
      tabs: R.value,
      facts: v.value,
      "data-team-reader": ""
    }, {
      primary: f(() => [
        d.value ? (n(), D(t(N), {
          key: 0,
          small: "",
          variant: "primary",
          "data-team-primary": "",
          onClick: C[0] || (C[0] = (S) => r("act", d.value))
        }, {
          default: f(() => [
            q(_(d.value), 1)
          ]),
          _: 1
        })) : w("", !0)
      ]),
      actions: f(() => [
        b(t(be), {
          items: a.items,
          head: a.item.title
        }, null, 8, ["items", "head"])
      ]),
      default: f(({ tab: S }) => {
        var p;
        return [
          S === "details" && a.item.row.at ? (n(), u("p", Ze, [
            C[3] || (C[3] = q("Changed ", -1)),
            b(t(H), {
              at: a.item.row.at
            }, null, 8, ["at"])
          ])) : w("", !0),
          S === "details" && ((p = l.value) != null && p.note) ? (n(), u("p", et, _(l.value.note), 1)) : w("", !0),
          S === "compare" && l.value ? (n(), u(E, { key: 2 }, [
            t(se).includes(a.item.row.share) ? w("", !0) : (n(), u("p", tt, "The text on this journal is lost when you use the library's version: a " + _(a.item.row.share) + " keeps no earlier versions.", 1)),
            b(Ye, {
              here: l.value.local_fields,
              library: O.value,
              at: (/* @__PURE__ */ new Date()).toISOString()
            }, null, 8, ["here", "library", "at"]),
            a.item.way !== "Changed here" ? (n(), D(t(N), {
              key: 1,
              small: "",
              variant: "primary",
              "data-library-take": "",
              onClick: C[1] || (C[1] = (I) => r("act", "Take"))
            }, {
              default: f(() => [...C[4] || (C[4] = [
                q("Use the library's version", -1)
              ])]),
              _: 1
            })) : w("", !0)
          ], 64)) : w("", !0),
          S === "versions" ? (n(), u(E, { key: 3 }, [
            g.value ? (n(), u("p", at, _(g.value), 1)) : w("", !0),
            A("ul", rt, [
              (n(!0), u(E, null, Y(k.value, (I) => (n(), u("li", {
                key: I.version,
                "data-library-version": I.version
              }, [
                A("span", null, [
                  q("Version " + _(I.version) + ", changed by " + _(I.user) + ", ", 1),
                  b(t(H), {
                    at: I.created_at
                  }, null, 8, ["at"])
                ]),
                a.canWrite && I.version !== a.item.row.version ? (n(), D(t(N), {
                  key: 0,
                  small: "",
                  "data-library-restore-version": "",
                  onClick: (j) => x(I.version)
                }, {
                  default: f(() => [...C[5] || (C[5] = [
                    q("Restore this version", -1)
                  ])]),
                  _: 1
                }, 8, ["onClick"])) : w("", !0)
              ], 8, lt))), 128))
            ])
          ], 64)) : w("", !0)
        ];
      }),
      _: 1
    }, 8, ["tab", "title", "number", "abstract", "tabs", "facts"]));
  }
}, nt = /* @__PURE__ */ W(st, [["__scopeId", "data-v-a44b2241"]]), ot = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-library-refusal": ""
}, it = {
  key: 0,
  class: "badge-update",
  "data-team-badge": ""
}, ut = {
  key: 1,
  class: "quiet",
  "data-team-state": ""
}, dt = { "data-library-command": "" }, ct = 460, mt = {
  __name: "TeamLibrary",
  props: { copies: { type: Array, required: !0 }, mine: Boolean, userName: { type: String, default: "" }, canWrite: Boolean },
  emits: ["changed", "counted"],
  setup(a, { emit: h }) {
    const s = a, r = h, i = U(), e = $(!1), l = $(""), d = $([]), o = $(""), v = $(null), R = $("details"), k = $(null), g = $(fe(F)), m = $("");
    async function x() {
      delete i.state["listing.type"], delete i.state["listing.search"], await i.reload("listing");
      const y = i.props.listing;
      l.value = y.failure.value, d.value = l.value ? [] : y.data.value.rows, e.value = !0;
    }
    x();
    const O = V(() => Qe(d.value, s.copies)), T = V(() => O.value.filter((y) => y.row.by === s.userName));
    le([O, T], () => r("counted", { library: O.value.length, here: T.value.length }), { immediate: !0 });
    const C = V(() => s.mine ? T.value : O.value), S = V(() => he(C.value, F, g.value, m.value, ["title"]));
    async function p(y) {
      o.value = "";
      const c = await i.run(y);
      return c.ok ? (await x(), r("changed")) : o.value = c.error, c;
    }
    async function I(y) {
      if (y.row.share !== "check") return p(["library", "get", y.row.share, String(y.row.item_id)]);
      i.state["item.share"] = "check", i.state["item.id"] = String(y.row.item_id), await i.reload("item");
      const c = i.props.item;
      o.value = c.failure.value, k.value = c.failure.value ? null : { item: y, command: c.data.value.fields.command };
    }
    const j = async () => {
      const { item: y } = k.value;
      k.value = null, await p(["library", "get", "check", String(y.row.item_id), "--read"]);
    }, Q = (y, c) => p(["library", "resolve", String(y.row.copy.copy_id), "--keep", c]);
    function X(y, c) {
      if (c === "Follow") return I(y);
      if (c === "Share") return Q(y, "mine");
      if (c === "Take" || c === "Update" && se.includes(y.row.share)) return Q(y, "library");
      R.value = "compare", v.value = y.id;
    }
    const Z = (y, c = null) => Xe(y, { open: c, act: (L) => X(y, L), canWrite: s.canWrite, leave: () => p(["library", "leave", String(y.row.copy.copy_id)]) }), ie = (y) => ({ head: y.title, items: Z(y, () => v.value = y.id) });
    return (y, c) => (n(), u(E, null, [
      b(t(ke), {
        chosen: v.value,
        "onUpdate:chosen": c[3] || (c[3] = (L) => v.value = L),
        items: S.value,
        "list-width": ct,
        place: ie,
        "empty-title": a.mine ? "Nothing shared from here yet" : "Nothing in the library yet",
        "pick-line": "Choose an item",
        "data-library": ""
      }, {
        top: f(() => [
          b(t(ge), {
            modelValue: g.value,
            "onUpdate:modelValue": c[0] || (c[0] = (L) => g.value = L),
            words: m.value,
            "onUpdate:words": c[1] || (c[1] = (L) => m.value = L),
            fields: t(F),
            rows: C.value,
            shown: S.value.length,
            placeholder: "Search the library"
          }, null, 8, ["modelValue", "words", "fields", "rows", "shown"]),
          l.value || o.value ? (n(), u("p", ot, _(l.value || o.value), 1)) : w("", !0)
        ]),
        empty: f(() => [
          e.value ? (n(), u(E, { key: 1 }, [
            q("Shared documents, sequences and checks appear here.")
          ], 64)) : (n(), D(t(we), {
            key: 0,
            shape: "rows"
          }))
        ]),
        meta: f(({ item: L }) => [
          L.state === "update" ? (n(), u("span", it, _(t(P).update), 1)) : (n(), u("span", ut, _(t(P)[L.state]), 1))
        ]),
        reader: f(({ item: L }) => [
          b(nt, {
            tab: R.value,
            "onUpdate:tab": c[2] || (c[2] = (B) => R.value = B),
            item: L,
            items: Z(L),
            "can-write": a.canWrite,
            onAct: (B) => X(L, B)
          }, null, 8, ["tab", "item", "items", "can-write", "onAct"])
        ]),
        _: 1
      }, 8, ["chosen", "items", "empty-title"]),
      k.value ? (n(), D(t(_e), {
        key: 0,
        padded: "",
        title: "Get the check",
        fits: "",
        onClose: c[5] || (c[5] = (L) => k.value = null)
      }, {
        foot: f(() => [
          b(t(N), {
            onClick: c[4] || (c[4] = (L) => k.value = null)
          }, {
            default: f(() => [...c[6] || (c[6] = [
              q("Cancel", -1)
            ])]),
            _: 1
          }),
          b(t(N), {
            variant: "primary",
            "data-library-confirm": "",
            onClick: j
          }, {
            default: f(() => [...c[7] || (c[7] = [
              q("Get the check, stopped", -1)
            ])]),
            _: 1
          })
        ]),
        default: f(() => [
          c[8] || (c[8] = A("p", { class: "note" }, "This check runs this command on your computer when someone starts it:", -1)),
          A("pre", dt, _(k.value.command), 1)
        ]),
        _: 1
      })) : w("", !0)
    ], 64));
  }
}, ae = /* @__PURE__ */ W(mt, [["__scopeId", "data-v-13a6a680"]]), vt = {
  class: "teams",
  "data-teams": ""
}, pt = {
  key: 0,
  class: "teams-note failure",
  role: "alert",
  "data-teams-failure": ""
}, yt = {
  key: 1,
  class: "teams-note failure",
  role: "alert",
  "data-teams-refusal": ""
}, bt = {
  class: "teams-note",
  "data-library-shared": ""
}, ft = {
  key: 0,
  class: "teams-note failure",
  role: "alert",
  "data-library-warning": ""
}, ht = {
  class: "teams-header",
  "data-teams-header": ""
}, kt = { "data-teams-server": "" }, wt = { "data-teams-role": "" }, gt = {
  key: 0,
  "data-teams-reached": ""
}, _t = {
  key: 1,
  "data-teams-plain": ""
}, $t = {
  key: 0,
  class: "teams-note failure",
  role: "alert",
  "data-teams-stopped": ""
}, St = {
  __name: "TeamsPage",
  setup(a) {
    const h = { admin: "Admin", edit: "Edit", read: "Read-only" }, s = U(), { data: r, failure: i } = s.props.status, { data: e } = s.props.copies, l = $("library"), d = V(() => {
      var S;
      return !!((S = r.value) != null && S.is_connected) && !r.value.stopped;
    }), o = V(() => {
      var S, p;
      return ((S = r.value) == null ? void 0 : S.role) === "admin" || ((p = r.value) == null ? void 0 : p.role) === "edit";
    }), v = V(() => {
      var S;
      return ((S = e.value) == null ? void 0 : S.rows) ?? [];
    }), R = V(() => {
      var S;
      return ((S = r.value) == null ? void 0 : S.role) === "admin";
    }), k = $({ library: 0, here: 0 }), g = $(!1), m = $(null), x = V(() => [
      { key: "library", label: "Library", count: k.value.library },
      { key: "here", label: "Shared from here", count: k.value.here },
      ...R.value ? [{ key: "people", label: "Users" }] : []
    ]);
    async function O() {
      await s.reload(["status", "copies"]);
    }
    const { refusal: T, run: C } = z(O);
    return (S, p) => (n(), D(t($e), { padding: "0" }, {
      default: f(() => {
        var I;
        return [
          A("div", vt, [
            b(t(Se), { title: "Teams" }, de({ _: 2 }, [
              d.value ? {
                name: "primary",
                fn: f(() => [
                  o.value ? (n(), D(t(N), {
                    key: 0,
                    small: "",
                    variant: "primary",
                    "data-library-share-submit": "",
                    onClick: p[0] || (p[0] = (j) => g.value = !0)
                  }, {
                    default: f(() => [...p[7] || (p[7] = [
                      q("Share", -1)
                    ])]),
                    _: 1
                  })) : w("", !0),
                  b(t(N), {
                    small: "",
                    "data-teams-sync": "",
                    onClick: p[1] || (p[1] = (j) => t(C)(["library", "sync"]))
                  }, {
                    default: f(() => [...p[8] || (p[8] = [
                      q("Sync", -1)
                    ])]),
                    _: 1
                  })
                ]),
                key: "0"
              } : void 0
            ]), 1024),
            t(i) ? (n(), u("p", pt, _(t(i)), 1)) : w("", !0),
            t(T) ? (n(), u("p", yt, _(t(T)), 1)) : w("", !0),
            m.value ? (n(), u(E, { key: 2 }, [
              A("p", bt, _(m.value.line), 1),
              m.value.warning ? (n(), u("p", ft, _(m.value.warning), 1)) : w("", !0)
            ], 64)) : w("", !0),
            (I = t(r)) != null && I.is_connected ? (n(), u(E, { key: 3 }, [
              A("div", ht, [
                A("span", kt, "Connected: " + _(t(r).server_name), 1),
                A("span", wt, "Role: " + _(h[t(r).role]), 1),
                t(r).reached_at ? (n(), u("span", gt, [
                  p[9] || (p[9] = q("Last reached: ", -1)),
                  b(t(H), {
                    at: t(r).reached_at
                  }, null, 8, ["at"])
                ])) : w("", !0),
                t(r).is_encrypted ? w("", !0) : (n(), u("span", _t, "Connection: not encrypted"))
              ]),
              t(r).stopped ? (n(), u("p", $t, _(t(r).stopped), 1)) : w("", !0)
            ], 64)) : w("", !0),
            t(r) && !d.value ? (n(), D(xe, {
              key: 4,
              address: t(r).address,
              onConnected: O
            }, null, 8, ["address"])) : w("", !0),
            d.value ? (n(), u(E, { key: 5 }, [
              b(t(J), {
                options: x.value,
                value: l.value,
                "data-teams-tabs": "",
                onPick: p[2] || (p[2] = (j) => l.value = j)
              }, null, 8, ["options", "value"]),
              b(t(Ce), { value: l.value }, {
                library: f(() => [
                  b(ae, {
                    copies: v.value,
                    "user-name": t(r).user_name,
                    "can-write": o.value,
                    onChanged: O,
                    onCounted: p[3] || (p[3] = (j) => k.value = j)
                  }, null, 8, ["copies", "user-name", "can-write"])
                ]),
                here: f(() => [
                  b(ae, {
                    mine: "",
                    copies: v.value,
                    "user-name": t(r).user_name,
                    "can-write": o.value,
                    onChanged: O,
                    onCounted: p[4] || (p[4] = (j) => k.value = j)
                  }, null, 8, ["copies", "user-name", "can-write"])
                ]),
                people: f(() => [
                  b(Be)
                ]),
                _: 1
              }, 8, ["value"])
            ], 64)) : w("", !0)
          ]),
          g.value ? (n(), D(Fe, {
            key: 0,
            onClose: p[5] || (p[5] = (j) => g.value = !1),
            onShared: p[6] || (p[6] = (j) => {
              m.value = j, O();
            })
          })) : w("", !0)
        ];
      }),
      _: 1
    }));
  }
}, Tt = /* @__PURE__ */ W(St, [["__scopeId", "data-v-0a68d8f5"]]);
export {
  Tt as default
};
