/* @code-commandments-generated */
if (!document.getElementById("window-styles-61069bfb3c6d")) { const style = document.createElement("style"); style.id = "window-styles-61069bfb3c6d"; style.textContent = ".failure[data-v-11c25cf4]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.notice[data-v-11c25cf4]{margin:0 0 8px;color:var(--text-2);font-size:12px}.top[data-v-11c25cf4]{display:flex;align-items:baseline;gap:10px}.top .heading[data-v-11c25cf4]{flex:1}.add[data-v-11c25cf4]{display:flex;flex-wrap:wrap;gap:6px}.add input[data-v-11c25cf4]{flex:1;min-width:120px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px}.heading[data-v-11c25cf4]{margin:12px 0 6px;color:var(--text-3);font-size:12px;font-weight:600}.server[data-v-11c25cf4]{display:flex;flex:1;flex-direction:column;gap:6px;font-size:13px}.head[data-v-11c25cf4]{display:flex;align-items:baseline;gap:10px}.title[data-v-11c25cf4]{flex:1;font-weight:600}.standing[data-v-11c25cf4],.subject[data-v-11c25cf4],.key label[data-v-11c25cf4]{color:var(--text-3);font-size:12px}.key[data-v-11c25cf4]{display:flex;flex-direction:column;gap:4px}.key input[data-v-11c25cf4]{padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px}button[data-v-11c25cf4]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { reactive as j, computed as b, ref as S, openBlock as c, createElementBlock as r, Fragment as P, toDisplayString as o, createCommentVNode as m, createElementVNode as s, unref as l, createVNode as v, withCtx as _, createTextVNode as x, withModifiers as I, withDirectives as C, vModelText as $ } from "vue";
import { useRows as R, useListTools as M, ago as K, Btn as L, ListTools as W, RowList as A } from "@journal/window-kit";
const q = (f, n) => {
  const i = f.__vccOpts || f;
  for (const [h, u] of n)
    i[h] = u;
  return i;
}, z = {
  key: 0,
  class: "failure"
}, G = {
  key: 1,
  class: "notice",
  "data-mcp-notice": ""
}, H = { class: "top" }, J = {
  key: 0,
  class: "subject",
  "data-mcp-checked": ""
}, Q = ["data-row"], X = { class: "head" }, Y = { class: "title" }, Z = { class: "standing" }, ee = ["onClick"], te = ["onClick"], ae = { class: "subject" }, se = {
  key: 0,
  class: "subject",
  "data-mcp-check": ""
}, ne = ["onSubmit"], le = ["for"], oe = ["id", "onUpdate:modelValue"], ie = { class: "server" }, de = { class: "head" }, ce = { class: "title" }, re = ["onClick"], ue = { class: "subject" }, me = {
  __name: "ServerRows",
  setup(f) {
    const n = R("mcp list", []), i = R("mcp suggested", []), h = M(n.rows, { title: (t) => t.title }), u = j({}), T = b(() => new Set(n.rows.value.map((t) => t.name))), U = b(() => i.rows.value.filter((t) => !T.value.has(t.name))), k = S(""), w = b(() => n.actionFailure.value || i.actionFailure.value), d = j({ name: "", target: "" }), N = S([]), g = S(null);
    async function y() {
      const t = await n.context.read("mcp check");
      N.value = t.ok ? t.value.lines : [], g.value = t.ok ? (/* @__PURE__ */ new Date()).toISOString() : null;
    }
    const V = (t) => {
      var a;
      return (a = N.value.find((e) => e.startsWith(`${t.name}  `))) == null ? void 0 : a.slice(t.name.length + 2);
    };
    async function B() {
      await Promise.all([n.load(), i.load(), y()]);
    }
    async function D() {
      (await n.act(["mcp", "add", d.name.trim(), d.target.trim()])).ok && (Object.assign(d, { name: "", target: "" }), await y());
    }
    async function E(t) {
      const a = await n.act(["message", "send", `Please sign in to ${t.title}: call mcp__${t.name}__authenticate, then complete_authentication, and tell me when it is done.`]);
      k.value = a.ok ? `Asked the agent to sign in to ${t.title}; a browser window opens from its terminal.` : "";
    }
    y();
    async function F(t) {
      await i.act(["mcp", "install", t.name]), await n.load();
    }
    async function O(t) {
      const a = (u[t.name] || "").trim();
      if (!a) return;
      (await n.act(["mcp", "key", t.name, a])).ok && (u[t.name] = "");
    }
    return (t, a) => (c(), r(P, null, [
      w.value ? (c(), r("p", z, o(w.value), 1)) : m("", !0),
      k.value ? (c(), r("p", G, o(k.value), 1)) : m("", !0),
      s("div", H, [
        a[3] || (a[3] = s("h3", { class: "heading" }, "Installed", -1)),
        g.value ? (c(), r("span", J, "Checked " + o(l(K)(g.value)), 1)) : m("", !0),
        v(l(L), {
          small: "",
          "data-mcp-refresh": "",
          onClick: B
        }, {
          default: _(() => [...a[2] || (a[2] = [
            x("Refresh", -1)
          ])]),
          _: 1
        })
      ]),
      v(l(W), {
        tools: l(h),
        placeholder: "Search the servers"
      }, null, 8, ["tools"]),
      v(l(A), {
        rows: l(h).shown.value,
        failure: l(n).failure.value,
        loaded: l(n).loaded.value,
        empty: "No servers installed"
      }, {
        default: _(({ row: e }) => [
          s("div", {
            class: "server",
            "data-row": e.id
          }, [
            s("div", X, [
              s("span", Y, o(e.title), 1),
              s("span", Z, o(e.standing), 1),
              e.auth === "oauth" ? (c(), r("button", {
                key: 0,
                type: "button",
                "data-mcp-sign-in": "",
                onClick: (p) => E(e)
              }, "Sign in", 8, ee)) : m("", !0),
              s("button", {
                type: "button",
                onClick: (p) => l(n).act(["mcp", "remove", e.name])
              }, "Remove", 8, te)
            ]),
            s("code", ae, o(e.url || [e.command, ...e.args].join(" ")), 1),
            V(e) ? (c(), r("span", se, o(V(e)), 1)) : m("", !0),
            e.standing === "needs its key" ? (c(), r("form", {
              key: 1,
              class: "key",
              onSubmit: I((p) => O(e), ["prevent"])
            }, [
              s("label", {
                for: `key-${e.name}`
              }, o(e.key_variable), 9, le),
              C(s("input", {
                id: `key-${e.name}`,
                "onUpdate:modelValue": (p) => u[e.name] = p,
                type: "password",
                autocomplete: "off",
                placeholder: "Paste the key"
              }, null, 8, oe), [
                [$, u[e.name]]
              ]),
              a[4] || (a[4] = s("button", { type: "submit" }, "Save", -1))
            ], 40, ne)) : m("", !0)
          ], 8, Q)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"]),
      a[6] || (a[6] = s("h3", { class: "heading" }, "Add a server", -1)),
      s("form", {
        class: "add",
        "data-mcp-add": "",
        onSubmit: I(D, ["prevent"])
      }, [
        C(s("input", {
          "onUpdate:modelValue": a[0] || (a[0] = (e) => d.name = e),
          placeholder: "Name",
          "aria-label": "Name"
        }, null, 512), [
          [$, d.name]
        ]),
        C(s("input", {
          "onUpdate:modelValue": a[1] || (a[1] = (e) => d.target = e),
          placeholder: "Its address, or the command that starts it",
          "aria-label": "Its address, or the command that starts it"
        }, null, 512), [
          [$, d.target]
        ]),
        v(l(L), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !d.name.trim() || !d.target.trim()
        }, {
          default: _(() => [...a[5] || (a[5] = [
            x("Add", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32),
      a[7] || (a[7] = s("h3", { class: "heading" }, "Suggested", -1)),
      v(l(A), {
        rows: U.value,
        failure: l(i).failure.value,
        loaded: l(i).loaded.value,
        empty: "Every suggested server is installed"
      }, {
        default: _(({ row: e }) => [
          s("div", ie, [
            s("div", de, [
              s("span", ce, o(e.title), 1),
              s("button", {
                type: "button",
                onClick: (p) => F(e)
              }, "Install", 8, re)
            ]),
            s("span", ue, o(e.subject), 1)
          ])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ], 64));
  }
}, he = /* @__PURE__ */ q(me, [["__scopeId", "data-v-11c25cf4"]]);
export {
  he as default
};
