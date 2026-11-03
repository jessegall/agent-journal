/* @code-commandments-generated */
if (!document.getElementById("window-styles-8264e3ca5766")) { const style = document.createElement("style"); style.id = "window-styles-8264e3ca5766"; style.textContent = ".failure[data-v-88524ff7]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.notice[data-v-88524ff7]{margin:0 0 8px;color:var(--text-2);font-size:12px}.top[data-v-88524ff7]{display:flex;align-items:baseline;gap:10px}.top .heading[data-v-88524ff7]{flex:1}.add[data-v-88524ff7]{display:flex;flex-wrap:wrap;gap:6px}.add input[data-v-88524ff7]{flex:1;min-width:120px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px}.heading[data-v-88524ff7]{margin:12px 0 6px;color:var(--text-3);font-size:12px;font-weight:600}.server[data-v-88524ff7]{display:flex;flex:1;flex-direction:column;gap:6px;font-size:13px}.head[data-v-88524ff7]{display:flex;align-items:baseline;gap:10px}.title[data-v-88524ff7]{flex:1;font-weight:600}.standing[data-v-88524ff7],.subject[data-v-88524ff7],.key label[data-v-88524ff7]{color:var(--text-3);font-size:12px}.key[data-v-88524ff7]{display:flex;flex-direction:column;gap:4px}.key input[data-v-88524ff7]{padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px}button[data-v-88524ff7]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { reactive as N, computed as b, ref as S, openBlock as c, createElementBlock as r, Fragment as P, toDisplayString as o, createCommentVNode as m, createElementVNode as a, unref as l, createVNode as h, withCtx as f, createTextVNode as V, withModifiers as x, withDirectives as w, vModelText as C } from "vue";
import { useRows as R, useListTools as M, ago as K, Btn as A, ListTools as W, RowList as L } from "@journal/window-kit";
const q = (_, n) => {
  const i = _.__vccOpts || _;
  for (const [p, u] of n)
    i[p] = u;
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
}, Q = ["data-row"], X = { class: "head" }, Y = { class: "title" }, Z = { class: "standing" }, ee = ["onClick"], te = ["onClick"], se = { class: "subject" }, ae = {
  key: 0,
  class: "subject",
  "data-mcp-check": ""
}, ne = ["onSubmit"], le = ["for"], oe = ["id", "onUpdate:modelValue"], ie = { class: "server" }, de = { class: "head" }, ce = { class: "title" }, re = ["onClick"], ue = { class: "subject" }, me = {
  __name: "ServerRows",
  setup(_) {
    const n = R("mcp list", []), i = R("mcp suggested", []), p = M(n.rows, { title: (t) => t.title }), u = N({}), T = b(() => new Set(n.rows.value.map((t) => t.name))), U = b(() => i.rows.value.filter((t) => !T.value.has(t.name))), g = S(""), $ = b(() => n.actionFailure.value || i.actionFailure.value), d = N({ name: "", target: "" }), j = S([]), k = S(null);
    async function y() {
      const t = await n.context.read("mcp check");
      j.value = t.ok ? t.value.lines : [], k.value = t.ok ? (/* @__PURE__ */ new Date()).toISOString() : null;
    }
    const I = (t) => {
      var s;
      return (s = j.value.find((e) => e.startsWith(`${t.name}  `))) == null ? void 0 : s.slice(t.name.length + 2);
    };
    async function B() {
      await Promise.all([n.load(), i.load(), y()]);
    }
    async function D() {
      (await n.act(["mcp", "add", d.name.trim(), d.target.trim()])).ok && (Object.assign(d, { name: "", target: "" }), await y());
    }
    async function E(t) {
      const s = await n.act(["message", "send", `Please sign in to ${t.title}: call mcp__${t.name}__authenticate, then complete_authentication, and tell me when it is done.`]);
      g.value = s.ok ? `Asked the agent to sign in to ${t.title}; a browser window opens from its terminal.` : "";
    }
    y();
    async function F(t) {
      await i.act(["mcp", "install", t.name]), await n.load();
    }
    async function O(t) {
      const s = (u[t.name] || "").trim();
      if (!s) return;
      (await n.act(["mcp", "key", t.name, s])).ok && (u[t.name] = "");
    }
    return (t, s) => (c(), r(P, null, [
      $.value ? (c(), r("p", z, o($.value), 1)) : m("", !0),
      g.value ? (c(), r("p", G, o(g.value), 1)) : m("", !0),
      a("div", H, [
        s[3] || (s[3] = a("h3", { class: "heading" }, "Installed", -1)),
        k.value ? (c(), r("span", J, "Checked " + o(l(K)(k.value)), 1)) : m("", !0),
        h(l(A), {
          small: "",
          "data-mcp-refresh": "",
          onClick: B
        }, {
          default: f(() => [...s[2] || (s[2] = [
            V("Refresh", -1)
          ])]),
          _: 1
        })
      ]),
      h(l(W), { tools: l(p) }, null, 8, ["tools"]),
      h(l(L), {
        rows: l(p).shown.value,
        failure: l(n).failure.value,
        loaded: l(n).loaded.value,
        empty: "No servers installed",
        hint: "Install one of the suggested servers below, or add your own.",
        searching: l(p).filtering.value
      }, {
        default: f(({ row: e }) => [
          a("div", {
            class: "server",
            "data-row": e.id
          }, [
            a("div", X, [
              a("span", Y, o(e.title), 1),
              a("span", Z, o(e.standing), 1),
              e.auth === "oauth" ? (c(), r("button", {
                key: 0,
                type: "button",
                "data-mcp-sign-in": "",
                onClick: (v) => E(e)
              }, "Sign in", 8, ee)) : m("", !0),
              a("button", {
                type: "button",
                onClick: (v) => l(n).act(["mcp", "remove", e.name])
              }, "Remove", 8, te)
            ]),
            a("code", se, o(e.url || [e.command, ...e.args].join(" ")), 1),
            I(e) ? (c(), r("span", ae, o(I(e)), 1)) : m("", !0),
            e.standing === "needs its key" ? (c(), r("form", {
              key: 1,
              class: "key",
              onSubmit: x((v) => O(e), ["prevent"])
            }, [
              a("label", {
                for: `key-${e.name}`
              }, o(e.key_variable), 9, le),
              w(a("input", {
                id: `key-${e.name}`,
                "onUpdate:modelValue": (v) => u[e.name] = v,
                type: "password",
                autocomplete: "off",
                placeholder: "Paste the key"
              }, null, 8, oe), [
                [C, u[e.name]]
              ]),
              s[4] || (s[4] = a("button", { type: "submit" }, "Save", -1))
            ], 40, ne)) : m("", !0)
          ], 8, Q)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "searching"]),
      s[6] || (s[6] = a("h3", { class: "heading" }, "Add a server", -1)),
      a("form", {
        class: "add",
        "data-mcp-add": "",
        onSubmit: x(D, ["prevent"])
      }, [
        w(a("input", {
          "onUpdate:modelValue": s[0] || (s[0] = (e) => d.name = e),
          placeholder: "Name",
          "aria-label": "Name"
        }, null, 512), [
          [C, d.name]
        ]),
        w(a("input", {
          "onUpdate:modelValue": s[1] || (s[1] = (e) => d.target = e),
          placeholder: "Its address, or the command that starts it",
          "aria-label": "Its address, or the command that starts it"
        }, null, 512), [
          [C, d.target]
        ]),
        h(l(A), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !d.name.trim() || !d.target.trim()
        }, {
          default: f(() => [...s[5] || (s[5] = [
            V("Add", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32),
      s[7] || (s[7] = a("h3", { class: "heading" }, "Suggested", -1)),
      h(l(L), {
        rows: U.value,
        failure: l(i).failure.value,
        loaded: l(i).loaded.value,
        empty: "Every suggested server is installed",
        hint: "A server the journal suggests shows here until it is installed."
      }, {
        default: f(({ row: e }) => [
          a("div", ie, [
            a("div", de, [
              a("span", ce, o(e.title), 1),
              a("button", {
                type: "button",
                onClick: (v) => F(e)
              }, "Install", 8, re)
            ]),
            a("span", ue, o(e.subject), 1)
          ])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ], 64));
  }
}, he = /* @__PURE__ */ q(me, [["__scopeId", "data-v-88524ff7"]]);
export {
  he as default
};
