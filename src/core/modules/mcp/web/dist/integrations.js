if (!document.getElementById("window-styles-be7f9fe700e1")) { const style = document.createElement("style"); style.id = "window-styles-be7f9fe700e1"; style.textContent = ".note[data-v-361b4c8c]{margin:0;color:var(--text-3);font-size:12.5px}.checked[data-v-361b4c8c]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as i, createBlock as p, unref as a, ref as C, computed as b, watch as V, createElementBlock as v, Fragment as L, createVNode as f, withCtx as m, createCommentVNode as g, createTextVNode as y, toDisplayString as E } from "vue";
import { copying as G, useWindow as F, CreateDialog as O, added as K, CardPage as W, ActionsMenu as z, Btn as h, Skeleton as U, TimeAgo as H, Icon as J, removed as j } from "@journal/window-kit";
const S = "Connected", I = "Failed", N = "Suggested", w = "Installed", Q = [{ key: "status", label: "State", options: [[S, S], [I, I]], get: (e) => e.status }], X = (e) => e.url || [e.command, ...e.args].join(" "), Y = (e) => (e ?? "").replace(/:\s*journal .*$/, ""), Z = (e, s) => e.standing === "needs its key" || /^(needs|missing)/.test(s ?? "");
function ee(e, s) {
  const o = Z(e, s);
  return {
    id: e.id,
    title: e.title,
    icon: "plug",
    state: "Tools: —",
    status: o ? I : S,
    line: X(e),
    fault: o ? `Failed to connect · ${Y(s) || e.standing}` : "",
    group: w,
    row: e
  };
}
const te = (e) => ({ id: `suggested-${e.id}`, title: e.title, icon: "plug", state: e.subject, status: N, line: "Not installed", fault: "", group: N, row: e }), ne = (e) => [{ key: "key", label: e.key_variable, kind: "password", required: !0, placeholder: "Paste the key" }], ae = (e, s) => ["mcp", "key", e.name, s.key.trim()], se = (e) => () => `journal mcp key ${e.name} …`, oe = [{ key: "name", label: "Name", required: !0, placeholder: "shop" }, { key: "target", label: "Address or command", required: !0, placeholder: "https://example.com/mcp, or npx -y shop" }], le = (e) => ["mcp", "add", e.name.trim(), e.target.trim()], re = (e) => `journal mcp add ${e.name.trim() || "…"} ${e.target.trim() || "…"}`;
function ie(e, { check: s, signIn: o, secret: c, remove: u }) {
  const r = e.row;
  return [
    { label: "Check", group: "open", run: s },
    ...r.auth === "oauth" ? [{ label: "Sign in", group: "open", run: o }] : [],
    ...r.key_variable ? [{ label: "Secret", group: "own", run: c }] : [],
    { label: "Copy address", group: "copy", run: ({ say: d }) => G(e.line, "the address", d) },
    { label: "Remove", group: "delete", danger: !0, armedLabel: "Remove: click again", run: u }
  ];
}
const de = {
  __name: "NewServer",
  emits: ["close"],
  setup(e, { emit: s }) {
    const o = s, c = F(), u = (r) => {
      const d = { id: `adding-${Date.now()}`, name: r.name.trim(), title: r.name.trim(), standing: "adding", auth: "", url: r.target.trim(), command: "", args: [], key_variable: "" };
      return c.props.installed.act(le(r), K(d));
    };
    return (r, d) => (i(), p(a(O), {
      title: "New integration",
      submit: "Add the server",
      fields: a(oe),
      command: a(re),
      run: u,
      onClose: d[0] || (d[0] = (k) => o("close"))
    }, null, 8, ["fields", "command"]));
  }
}, ce = {
  __name: "ServerKey",
  props: { row: { type: Object, required: !0 } },
  emits: ["close"],
  setup(e, { emit: s }) {
    const o = e, c = s, u = F(), r = (d) => u.props.installed.act(ae(o.row, d));
    return (d, k) => (i(), p(a(O), {
      title: `Key of ${e.row.title}`,
      submit: "Save the key",
      fields: a(ne)(e.row),
      command: a(se)(e.row),
      run: r,
      onClose: k[0] || (k[0] = (_) => c("close"))
    }, null, 8, ["title", "fields", "command"]));
  }
}, ue = (e, s) => {
  const o = e.__vccOpts || e;
  for (const [c, u] of s)
    o[c] = u;
  return o;
}, me = {
  key: 0,
  class: "checked",
  "data-mcp-checked": ""
}, pe = {
  key: 1,
  class: "note"
}, ge = {
  key: 0,
  class: "note",
  "data-mcp-notice": ""
}, ke = {
  key: 1,
  class: "note",
  role: "alert"
}, ve = {
  __name: "ServerRows",
  setup(e) {
    const s = F(), o = s.props.installed, c = s.props.suggested, u = C(""), r = C(null), d = C(!1), k = C(null), _ = b(() => o.actionFailure.value || c.actionFailure.value), T = b(() => {
      var t;
      return ((t = s.props.check.data.value) == null ? void 0 : t.lines) ?? [];
    }), R = (t) => {
      var n;
      return (n = T.value.find((l) => l.startsWith(`${t.name}  `))) == null ? void 0 : n.slice(t.name.length + 2);
    }, q = b(() => new Set(o.rows.value.map((t) => t.name))), B = b(() => [
      ...o.rows.value.map((t) => ee(t, R(t))),
      ...c.rows.value.filter((t) => !q.value.has(t.name)).map(te)
    ]);
    V(s.props.check.data, (t) => {
      t && (k.value = (/* @__PURE__ */ new Date()).toISOString());
    });
    const $ = () => s.reload(["installed", "suggested", "check"]);
    async function x(t) {
      const n = await o.act(["message", "send", `Please sign in to ${t.title}: call mcp__${t.name}__authenticate, then complete_authentication, and tell me when it is done.`]);
      u.value = n.ok ? `Asked the agent to sign in to ${t.title}; a browser window opens from its terminal.` : "";
    }
    async function A(t) {
      await c.act(["mcp", "install", t.name], j(t.id)), await s.reload("installed");
    }
    const D = (t) => ie(t, {
      check: $,
      signIn: () => x(t.row),
      secret: () => r.value = t.row,
      remove: () => o.act(["mcp", "remove", t.row.name], j(t.row.id))
    }), M = (t) => t.group === w ? { head: t.title, items: D(t) } : { head: t.title, items: [{ label: "Install", group: "open", run: () => A(t.row) }] };
    return (t, n) => (i(), v(L, null, [
      f(a(W), {
        title: "Integrations",
        items: B.value,
        fields: a(Q),
        place: M,
        "empty-title": "No servers installed",
        "data-integrations": ""
      }, {
        primary: m(() => [
          f(a(h), {
            small: "",
            variant: "primary",
            "data-mcp-new": "",
            onClick: n[0] || (n[0] = (l) => d.value = !0)
          }, {
            default: m(() => [
              f(a(J), {
                name: "plus",
                size: 12
              }),
              n[3] || (n[3] = y("New", -1))
            ]),
            _: 1
          })
        ]),
        actions: m(() => [
          k.value ? (i(), v("span", me, [
            n[4] || (n[4] = y("Checked ", -1)),
            f(a(H), { at: k.value }, null, 8, ["at"])
          ])) : g("", !0),
          f(a(h), {
            small: "",
            "data-mcp-refresh": "",
            onClick: $
          }, {
            default: m(() => [...n[5] || (n[5] = [
              y("Refresh", -1)
            ])]),
            _: 1
          })
        ]),
        empty: m(() => [
          a(o).loaded.value ? (i(), v("p", pe, "Install one of the suggested servers, or add your own.")) : (i(), p(a(U), {
            key: 0,
            shape: "cards"
          }))
        ]),
        card: m(({ item: l }) => [
          l.group === a(w) && u.value ? (i(), v(L, { key: 0 }, [
            l.row.auth === "oauth" ? (i(), v("p", ge, E(u.value), 1)) : g("", !0)
          ], 64)) : g("", !0),
          _.value && l.group === a(w) ? (i(), v("p", ke, E(_.value), 1)) : g("", !0)
        ]),
        foot: m(({ item: l }) => [
          l.group === a(N) ? (i(), p(a(h), {
            key: 0,
            small: "",
            bordered: "",
            "data-mcp-install": "",
            onClick: (P) => A(l.row)
          }, {
            default: m(() => [...n[6] || (n[6] = [
              y("Install", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])) : l.fault ? (i(), p(a(h), {
            key: 1,
            small: "",
            bordered: "",
            "data-mcp-check": "",
            onClick: $
          }, {
            default: m(() => [...n[7] || (n[7] = [
              y("Check", -1)
            ])]),
            _: 1
          })) : l.row.auth === "oauth" ? (i(), p(a(h), {
            key: 2,
            small: "",
            bordered: "",
            "data-mcp-sign-in": "",
            onClick: (P) => x(l.row)
          }, {
            default: m(() => [...n[8] || (n[8] = [
              y("Sign in", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])) : g("", !0)
        ]),
        "card-actions": m(({ item: l }) => [
          l.group === a(w) ? (i(), p(a(z), {
            key: 0,
            items: D(l),
            head: l.title
          }, null, 8, ["items", "head"])) : g("", !0)
        ]),
        _: 1
      }, 8, ["items", "fields"]),
      d.value ? (i(), p(de, {
        key: 0,
        onClose: n[1] || (n[1] = (l) => d.value = !1)
      })) : g("", !0),
      r.value ? (i(), p(ce, {
        key: 1,
        row: r.value,
        onClose: n[2] || (n[2] = (l) => r.value = null)
      }, null, 8, ["row"])) : g("", !0)
    ], 64));
  }
}, he = /* @__PURE__ */ ue(ve, [["__scopeId", "data-v-361b4c8c"]]);
export {
  he as default
};
