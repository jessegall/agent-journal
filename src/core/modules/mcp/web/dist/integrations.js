/* @code-commandments-generated */
if (!document.getElementById("window-styles-12844f23a9d4")) { const style = document.createElement("style"); style.id = "window-styles-12844f23a9d4"; style.textContent = ".failure[data-v-8119dcb4]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.notice[data-v-8119dcb4]{margin:0 0 8px;color:var(--text-2);font-size:12px}.top[data-v-8119dcb4]{display:flex;align-items:baseline;gap:10px}.top .heading[data-v-8119dcb4]{flex:1}.add[data-v-8119dcb4]{display:flex;flex-wrap:wrap;gap:6px}.add input[data-v-8119dcb4]{flex:1;min-width:120px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px}.heading[data-v-8119dcb4]{margin:12px 0 6px;color:var(--text-3);font-size:12px;font-weight:600}.server[data-v-8119dcb4]{display:flex;flex:1;flex-direction:column;gap:6px;font-size:13px}.head[data-v-8119dcb4]{display:flex;align-items:baseline;gap:10px}.title[data-v-8119dcb4]{flex:1;font-weight:600}.standing[data-v-8119dcb4],.subject[data-v-8119dcb4],.key label[data-v-8119dcb4]{color:var(--text-3);font-size:12px}.key[data-v-8119dcb4]{display:flex;flex-direction:column;gap:4px}.key input[data-v-8119dcb4]{padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px}button[data-v-8119dcb4]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { reactive as w, computed as b, ref as S, openBlock as c, createElementBlock as u, Fragment as P, toDisplayString as o, createCommentVNode as m, createElementVNode as s, unref as l, createVNode as v, withCtx as _, createTextVNode as x, withModifiers as I, withDirectives as C, vModelText as $ } from "vue";
import { useRows as R, ago as M, Btn as A, RowList as U } from "@journal/window-kit";
const T = (h, n) => {
  const i = h.__vccOpts || h;
  for (const [r, f] of n)
    i[r] = f;
  return i;
}, K = {
  key: 0,
  class: "failure"
}, W = {
  key: 1,
  class: "notice",
  "data-mcp-notice": ""
}, q = { class: "top" }, z = {
  key: 0,
  class: "subject",
  "data-mcp-checked": ""
}, G = ["data-row"], H = { class: "head" }, J = { class: "title" }, Q = { class: "standing" }, X = ["onClick"], Y = ["onClick"], Z = { class: "subject" }, ee = {
  key: 0,
  class: "subject",
  "data-mcp-check": ""
}, te = ["onSubmit"], ae = ["for"], se = ["id", "onUpdate:modelValue"], ne = { class: "server" }, le = { class: "head" }, oe = { class: "title" }, ie = ["onClick"], de = { class: "subject" }, ce = {
  __name: "ServerRows",
  setup(h) {
    const n = R("mcp list", []), i = R("mcp suggested", []), r = w({}), f = b(() => new Set(n.rows.value.map((a) => a.name))), B = b(() => i.rows.value.filter((a) => !f.value.has(a.name))), k = S(""), N = b(() => n.actionFailure.value || i.actionFailure.value), d = w({ name: "", target: "" }), V = S([]), g = S(null);
    async function y() {
      const a = await n.context.read("mcp check");
      V.value = a.ok ? a.value.lines : [], g.value = a.ok ? (/* @__PURE__ */ new Date()).toISOString() : null;
    }
    const j = (a) => {
      var t;
      return (t = V.value.find((e) => e.startsWith(`${a.name}  `))) == null ? void 0 : t.slice(a.name.length + 2);
    };
    async function D() {
      await Promise.all([n.load(), i.load(), y()]);
    }
    async function E() {
      (await n.act(["mcp", "add", d.name.trim(), d.target.trim()])).ok && (Object.assign(d, { name: "", target: "" }), await y());
    }
    async function F(a) {
      const t = await n.act(["message", "send", `Please sign in to ${a.title}: call mcp__${a.name}__authenticate, then complete_authentication, and tell me when it is done.`]);
      k.value = t.ok ? `Asked the agent to sign in to ${a.title}; a browser window opens from its terminal.` : "";
    }
    y();
    async function L(a) {
      await i.act(["mcp", "install", a.name]), await n.load();
    }
    async function O(a) {
      const t = (r[a.name] || "").trim();
      if (!t) return;
      (await n.act(["mcp", "key", a.name, t])).ok && (r[a.name] = "");
    }
    return (a, t) => (c(), u(P, null, [
      N.value ? (c(), u("p", K, o(N.value), 1)) : m("", !0),
      k.value ? (c(), u("p", W, o(k.value), 1)) : m("", !0),
      s("div", q, [
        t[3] || (t[3] = s("h3", { class: "heading" }, "Installed", -1)),
        g.value ? (c(), u("span", z, "Checked " + o(l(M)(g.value)), 1)) : m("", !0),
        v(l(A), {
          small: "",
          "data-mcp-refresh": "",
          onClick: D
        }, {
          default: _(() => [...t[2] || (t[2] = [
            x("Refresh", -1)
          ])]),
          _: 1
        })
      ]),
      v(l(U), {
        rows: l(n).rows.value,
        failure: l(n).failure.value,
        loaded: l(n).loaded.value,
        empty: "No servers installed"
      }, {
        default: _(({ row: e }) => [
          s("div", {
            class: "server",
            "data-row": e.id
          }, [
            s("div", H, [
              s("span", J, o(e.title), 1),
              s("span", Q, o(e.standing), 1),
              e.auth === "oauth" ? (c(), u("button", {
                key: 0,
                type: "button",
                "data-mcp-sign-in": "",
                onClick: (p) => F(e)
              }, "Sign in", 8, X)) : m("", !0),
              s("button", {
                type: "button",
                onClick: (p) => l(n).act(["mcp", "remove", e.name])
              }, "Remove", 8, Y)
            ]),
            s("code", Z, o(e.url || [e.command, ...e.args].join(" ")), 1),
            j(e) ? (c(), u("span", ee, o(j(e)), 1)) : m("", !0),
            e.standing === "needs its key" ? (c(), u("form", {
              key: 1,
              class: "key",
              onSubmit: I((p) => O(e), ["prevent"])
            }, [
              s("label", {
                for: `key-${e.name}`
              }, o(e.key_variable), 9, ae),
              C(s("input", {
                id: `key-${e.name}`,
                "onUpdate:modelValue": (p) => r[e.name] = p,
                type: "password",
                autocomplete: "off",
                placeholder: "Paste the key"
              }, null, 8, se), [
                [$, r[e.name]]
              ]),
              t[4] || (t[4] = s("button", { type: "submit" }, "Save", -1))
            ], 40, te)) : m("", !0)
          ], 8, G)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"]),
      t[6] || (t[6] = s("h3", { class: "heading" }, "Add a server", -1)),
      s("form", {
        class: "add",
        "data-mcp-add": "",
        onSubmit: I(E, ["prevent"])
      }, [
        C(s("input", {
          "onUpdate:modelValue": t[0] || (t[0] = (e) => d.name = e),
          placeholder: "Name",
          "aria-label": "Name"
        }, null, 512), [
          [$, d.name]
        ]),
        C(s("input", {
          "onUpdate:modelValue": t[1] || (t[1] = (e) => d.target = e),
          placeholder: "Its address, or the command that starts it",
          "aria-label": "Its address, or the command that starts it"
        }, null, 512), [
          [$, d.target]
        ]),
        v(l(A), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !d.name.trim() || !d.target.trim()
        }, {
          default: _(() => [...t[5] || (t[5] = [
            x("Add", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32),
      t[7] || (t[7] = s("h3", { class: "heading" }, "Suggested", -1)),
      v(l(U), {
        rows: B.value,
        failure: l(i).failure.value,
        loaded: l(i).loaded.value,
        empty: "Every suggested server is installed"
      }, {
        default: _(({ row: e }) => [
          s("div", ne, [
            s("div", le, [
              s("span", oe, o(e.title), 1),
              s("button", {
                type: "button",
                onClick: (p) => L(e)
              }, "Install", 8, ie)
            ]),
            s("span", de, o(e.subject), 1)
          ])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ], 64));
  }
}, me = /* @__PURE__ */ T(ce, [["__scopeId", "data-v-8119dcb4"]]);
export {
  me as default
};
