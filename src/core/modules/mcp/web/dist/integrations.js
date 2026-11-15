if (!document.getElementById("window-styles-a3d2122006a3")) { const style = document.createElement("style"); style.id = "window-styles-a3d2122006a3"; style.textContent = ".note[data-v-3395a19a]{margin:0;color:var(--text-3);font-size:12.5px}.checked[data-v-3395a19a]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as i, createBlock as p, unref as s, ref as w, computed as C, watch as V, createElementBlock as v, Fragment as L, createVNode as b, withCtx as m, createCommentVNode as g, createTextVNode as y, toDisplayString as E } from "vue";
import { copying as G, useWindow as F, CreateDialog as O, added as K, CardPage as W, ActionsMenu as U, Btn as f, Skeleton as z, TimeAgo as H, removed as j } from "@journal/window-kit";
const S = "Connected", I = "Failed", N = "Suggested", h = "Installed", J = [{ key: "status", label: "State", options: [[S, S], [I, I]], get: (e) => e.status }], Q = (e) => e.url || [e.command, ...e.args].join(" "), X = (e) => (e ?? "").replace(/:\s*journal .*$/, ""), Y = (e, a) => e.standing === "needs its key" || /^(needs|missing)/.test(a ?? "");
function Z(e, a) {
  const o = Y(e, a);
  return {
    id: e.id,
    title: e.title,
    icon: "plug",
    state: "Tools: —",
    status: o ? I : S,
    line: Q(e),
    fault: o ? `Failed to connect · ${X(a) || e.standing}` : "",
    group: h,
    row: e
  };
}
const ee = (e) => ({ id: `suggested-${e.id}`, title: e.title, icon: "plug", state: e.subject, status: N, line: "Not installed", fault: "", group: N, row: e }), te = (e) => [{ key: "key", label: e.key_variable, kind: "password", required: !0, placeholder: "Paste the key" }], ne = (e, a) => ["mcp", "key", e.name, a.key.trim()], ae = (e) => () => `journal mcp key ${e.name} …`, se = [{ key: "name", label: "Name", required: !0, placeholder: "shop" }, { key: "target", label: "Address or command", required: !0, placeholder: "https://example.com/mcp, or npx -y shop" }], oe = (e) => ["mcp", "add", e.name.trim(), e.target.trim()], le = (e) => `journal mcp add ${e.name.trim() || "…"} ${e.target.trim() || "…"}`;
function re(e, { check: a, signIn: o, secret: c, remove: u }) {
  const r = e.row;
  return [
    { label: "Check", group: "open", run: a },
    ...r.auth === "oauth" ? [{ label: "Sign in", group: "open", run: o }] : [],
    ...r.key_variable ? [{ label: "Secret", group: "own", run: c }] : [],
    { label: "Copy address", group: "copy", run: ({ say: d }) => G(e.line, "the address", d) },
    { label: "Remove", group: "delete", danger: !0, armedLabel: "Remove: click again", run: u }
  ];
}
const ie = {
  __name: "NewServer",
  emits: ["close"],
  setup(e, { emit: a }) {
    const o = a, c = F(), u = (r) => {
      const d = { id: `adding-${Date.now()}`, name: r.name.trim(), title: r.name.trim(), standing: "adding", auth: "", url: r.target.trim(), command: "", args: [], key_variable: "" };
      return c.props.installed.act(oe(r), K(d));
    };
    return (r, d) => (i(), p(s(O), {
      title: "New integration",
      submit: "Add the server",
      fields: s(se),
      command: s(le),
      run: u,
      onClose: d[0] || (d[0] = (k) => o("close"))
    }, null, 8, ["fields", "command"]));
  }
}, de = {
  __name: "ServerKey",
  props: { row: { type: Object, required: !0 } },
  emits: ["close"],
  setup(e, { emit: a }) {
    const o = e, c = a, u = F(), r = (d) => u.props.installed.act(ne(o.row, d));
    return (d, k) => (i(), p(s(O), {
      title: `Key of ${e.row.title}`,
      submit: "Save the key",
      fields: s(te)(e.row),
      command: s(ae)(e.row),
      run: r,
      onClose: k[0] || (k[0] = (_) => c("close"))
    }, null, 8, ["title", "fields", "command"]));
  }
}, ce = (e, a) => {
  const o = e.__vccOpts || e;
  for (const [c, u] of a)
    o[c] = u;
  return o;
}, ue = {
  key: 0,
  class: "checked",
  "data-mcp-checked": ""
}, me = {
  key: 1,
  class: "note"
}, pe = {
  key: 0,
  class: "note",
  "data-mcp-notice": ""
}, ge = {
  key: 1,
  class: "note",
  role: "alert"
}, ke = {
  __name: "ServerRows",
  setup(e) {
    const a = F(), o = a.props.installed, c = a.props.suggested, u = w(""), r = w(null), d = w(!1), k = w(null), _ = C(() => o.actionFailure.value || c.actionFailure.value), T = C(() => {
      var t;
      return ((t = a.props.check.data.value) == null ? void 0 : t.lines) ?? [];
    }), R = (t) => {
      var n;
      return (n = T.value.find((l) => l.startsWith(`${t.name}  `))) == null ? void 0 : n.slice(t.name.length + 2);
    }, q = C(() => new Set(o.rows.value.map((t) => t.name))), B = C(() => [
      ...o.rows.value.map((t) => Z(t, R(t))),
      ...c.rows.value.filter((t) => !q.value.has(t.name)).map(ee)
    ]);
    V(a.props.check.data, (t) => {
      t && (k.value = (/* @__PURE__ */ new Date()).toISOString());
    });
    const $ = () => a.reload(["installed", "suggested", "check"]);
    async function x(t) {
      const n = await o.act(["message", "send", `Please sign in to ${t.title}: call mcp__${t.name}__authenticate, then complete_authentication, and tell me when it is done.`]);
      u.value = n.ok ? `Asked the agent to sign in to ${t.title}; a browser window opens from its terminal.` : "";
    }
    async function A(t) {
      await c.act(["mcp", "install", t.name], j(t.id)), await a.reload("installed");
    }
    const D = (t) => re(t, {
      check: $,
      signIn: () => x(t.row),
      secret: () => r.value = t.row,
      remove: () => o.act(["mcp", "remove", t.row.name], j(t.row.id))
    }), M = (t) => t.group === h ? { head: t.title, items: D(t) } : { head: t.title, items: [{ label: "Install", group: "open", run: () => A(t.row) }] };
    return (t, n) => (i(), v(L, null, [
      b(s(W), {
        title: "Integrations",
        items: B.value,
        fields: s(J),
        place: M,
        "empty-title": "No servers installed",
        "data-integrations": ""
      }, {
        primary: m(() => [
          b(s(f), {
            small: "",
            variant: "primary",
            "data-mcp-new": "",
            onClick: n[0] || (n[0] = (l) => d.value = !0)
          }, {
            default: m(() => [...n[3] || (n[3] = [
              y("Add server", -1)
            ])]),
            _: 1
          })
        ]),
        actions: m(() => [
          k.value ? (i(), v("span", ue, [
            n[4] || (n[4] = y("Checked ", -1)),
            b(s(H), { at: k.value }, null, 8, ["at"])
          ])) : g("", !0),
          b(s(f), {
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
          s(o).loaded.value ? (i(), v("p", me, "Install one of the suggested servers, or add your own.")) : (i(), p(s(z), {
            key: 0,
            shape: "cards"
          }))
        ]),
        card: m(({ item: l }) => [
          l.group === s(h) && u.value ? (i(), v(L, { key: 0 }, [
            l.row.auth === "oauth" ? (i(), v("p", pe, E(u.value), 1)) : g("", !0)
          ], 64)) : g("", !0),
          _.value && l.group === s(h) ? (i(), v("p", ge, E(_.value), 1)) : g("", !0)
        ]),
        foot: m(({ item: l }) => [
          l.group === s(N) ? (i(), p(s(f), {
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
          }, 8, ["onClick"])) : l.fault ? (i(), p(s(f), {
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
          })) : l.row.auth === "oauth" ? (i(), p(s(f), {
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
          l.group === s(h) ? (i(), p(s(U), {
            key: 0,
            items: D(l),
            head: l.title
          }, null, 8, ["items", "head"])) : g("", !0)
        ]),
        _: 1
      }, 8, ["items", "fields"]),
      d.value ? (i(), p(ie, {
        key: 0,
        onClose: n[1] || (n[1] = (l) => d.value = !1)
      })) : g("", !0),
      r.value ? (i(), p(de, {
        key: 1,
        row: r.value,
        onClose: n[2] || (n[2] = (l) => r.value = null)
      }, null, 8, ["row"])) : g("", !0)
    ], 64));
  }
}, fe = /* @__PURE__ */ ce(ke, [["__scopeId", "data-v-3395a19a"]]);
export {
  fe as default
};
