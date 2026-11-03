/* @code-commandments-generated */
if (!document.getElementById("window-styles-058700355fa8")) { const style = document.createElement("style"); style.id = "window-styles-058700355fa8"; style.textContent = ".failure[data-v-dfb2f145]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.notice[data-v-dfb2f145]{margin:0 0 8px;color:var(--text-2);font-size:12px}.top[data-v-dfb2f145]{display:flex;align-items:baseline;gap:10px}.top .heading[data-v-dfb2f145]{flex:1}.add[data-v-dfb2f145]{display:flex;flex-wrap:wrap;gap:6px}.add input[data-v-dfb2f145]{flex:1;min-width:120px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px}.heading[data-v-dfb2f145]{margin:12px 0 6px;color:var(--text-3);font-size:12px;font-weight:600}.server[data-v-dfb2f145]{display:flex;flex:1;flex-direction:column;gap:6px;font-size:13px}.head[data-v-dfb2f145]{display:flex;align-items:baseline;gap:10px}.title[data-v-dfb2f145]{flex:1;font-weight:600}.standing[data-v-dfb2f145],.subject[data-v-dfb2f145],.key label[data-v-dfb2f145]{color:var(--text-3);font-size:12px}.key[data-v-dfb2f145]{display:flex;flex-direction:column;gap:4px}.key input[data-v-dfb2f145]{padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px}button[data-v-dfb2f145]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { reactive as N, computed as b, ref as S, openBlock as c, createElementBlock as r, Fragment as M, toDisplayString as i, createCommentVNode as m, createElementVNode as s, unref as n, createVNode as h, withCtx as g, createTextVNode as V, withModifiers as x, withDirectives as $, vModelText as w } from "vue";
import { useRows as R, useListTools as K, ago as W, Btn as A, ListTools as q, RowList as L, removed as D, added as z } from "@journal/window-kit";
const G = (_, l) => {
  const d = _.__vccOpts || _;
  for (const [p, u] of l)
    d[p] = u;
  return d;
}, H = {
  key: 0,
  class: "failure"
}, J = {
  key: 1,
  class: "notice",
  "data-mcp-notice": ""
}, Q = { class: "top" }, X = {
  key: 0,
  class: "subject",
  "data-mcp-checked": ""
}, Y = ["data-row"], Z = { class: "head" }, ee = { class: "title" }, te = { class: "standing" }, ae = ["onClick"], se = ["onClick"], ne = { class: "subject" }, le = {
  key: 0,
  class: "subject",
  "data-mcp-check": ""
}, oe = ["onSubmit"], ie = ["for"], de = ["id", "onUpdate:modelValue"], ce = { class: "server" }, re = { class: "head" }, ue = { class: "title" }, me = ["onClick"], pe = { class: "subject" }, ve = {
  __name: "ServerRows",
  setup(_) {
    const l = R("mcp list", []), d = R("mcp suggested", []), p = K(l.rows, { title: (t) => t.title }), u = N({}), T = b(() => new Set(l.rows.value.map((t) => t.name))), U = b(() => d.rows.value.filter((t) => !T.value.has(t.name))), f = S(""), C = b(() => l.actionFailure.value || d.actionFailure.value), o = N({ name: "", target: "" }), j = S([]), k = S(null);
    async function y() {
      const t = await l.context.read("mcp check");
      j.value = t.ok ? t.value.lines : [], k.value = t.ok ? (/* @__PURE__ */ new Date()).toISOString() : null;
    }
    const I = (t) => {
      var a;
      return (a = j.value.find((e) => e.startsWith(`${t.name}  `))) == null ? void 0 : a.slice(t.name.length + 2);
    };
    async function B() {
      await Promise.all([l.load(), d.load(), y()]);
    }
    async function E() {
      const t = { id: `adding-${Date.now()}`, name: o.name.trim(), title: o.name.trim(), standing: "adding", auth: "", url: o.target.trim(), command: "", args: [], key_variable: "" };
      (await l.act(["mcp", "add", o.name.trim(), o.target.trim()], z(t))).ok && (Object.assign(o, { name: "", target: "" }), await y());
    }
    async function F(t) {
      const a = await l.act(["message", "send", `Please sign in to ${t.title}: call mcp__${t.name}__authenticate, then complete_authentication, and tell me when it is done.`]);
      f.value = a.ok ? `Asked the agent to sign in to ${t.title}; a browser window opens from its terminal.` : "";
    }
    y();
    async function O(t) {
      await d.act(["mcp", "install", t.name], D(t.id)), await l.load();
    }
    async function P(t) {
      const a = (u[t.name] || "").trim();
      if (!a) return;
      (await l.act(["mcp", "key", t.name, a])).ok && (u[t.name] = "");
    }
    return (t, a) => (c(), r(M, null, [
      C.value ? (c(), r("p", H, i(C.value), 1)) : m("", !0),
      f.value ? (c(), r("p", J, i(f.value), 1)) : m("", !0),
      s("div", Q, [
        a[3] || (a[3] = s("h3", { class: "heading" }, "Installed", -1)),
        k.value ? (c(), r("span", X, "Checked " + i(n(W)(k.value)), 1)) : m("", !0),
        h(n(A), {
          small: "",
          "data-mcp-refresh": "",
          onClick: B
        }, {
          default: g(() => [...a[2] || (a[2] = [
            V("Refresh", -1)
          ])]),
          _: 1
        })
      ]),
      h(n(q), { tools: n(p) }, null, 8, ["tools"]),
      h(n(L), {
        rows: n(p).shown.value,
        failure: n(l).failure.value,
        loaded: n(l).loaded.value,
        empty: "No servers installed",
        hint: "Install one of the suggested servers below, or add your own.",
        searching: n(p).filtering.value
      }, {
        default: g(({ row: e }) => [
          s("div", {
            class: "server",
            "data-row": e.id
          }, [
            s("div", Z, [
              s("span", ee, i(e.title), 1),
              s("span", te, i(e.standing), 1),
              e.auth === "oauth" ? (c(), r("button", {
                key: 0,
                type: "button",
                "data-mcp-sign-in": "",
                onClick: (v) => F(e)
              }, "Sign in", 8, ae)) : m("", !0),
              s("button", {
                type: "button",
                onClick: (v) => n(l).act(["mcp", "remove", e.name], n(D)(e.id))
              }, "Remove", 8, se)
            ]),
            s("code", ne, i(e.url || [e.command, ...e.args].join(" ")), 1),
            I(e) ? (c(), r("span", le, i(I(e)), 1)) : m("", !0),
            e.standing === "needs its key" ? (c(), r("form", {
              key: 1,
              class: "key",
              onSubmit: x((v) => P(e), ["prevent"])
            }, [
              s("label", {
                for: `key-${e.name}`
              }, i(e.key_variable), 9, ie),
              $(s("input", {
                id: `key-${e.name}`,
                "onUpdate:modelValue": (v) => u[e.name] = v,
                type: "password",
                autocomplete: "off",
                placeholder: "Paste the key"
              }, null, 8, de), [
                [w, u[e.name]]
              ]),
              a[4] || (a[4] = s("button", { type: "submit" }, "Save", -1))
            ], 40, oe)) : m("", !0)
          ], 8, Y)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "searching"]),
      a[6] || (a[6] = s("h3", { class: "heading" }, "Add a server", -1)),
      s("form", {
        class: "add",
        "data-mcp-add": "",
        onSubmit: x(E, ["prevent"])
      }, [
        $(s("input", {
          "onUpdate:modelValue": a[0] || (a[0] = (e) => o.name = e),
          placeholder: "Name",
          "aria-label": "Name"
        }, null, 512), [
          [w, o.name]
        ]),
        $(s("input", {
          "onUpdate:modelValue": a[1] || (a[1] = (e) => o.target = e),
          placeholder: "Its address, or the command that starts it",
          "aria-label": "Its address, or the command that starts it"
        }, null, 512), [
          [w, o.target]
        ]),
        h(n(A), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !o.name.trim() || !o.target.trim()
        }, {
          default: g(() => [...a[5] || (a[5] = [
            V("Add", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32),
      a[7] || (a[7] = s("h3", { class: "heading" }, "Suggested", -1)),
      h(n(L), {
        rows: U.value,
        failure: n(d).failure.value,
        loaded: n(d).loaded.value,
        empty: "Every suggested server is installed",
        hint: "A server the journal suggests shows here until it is installed."
      }, {
        default: g(({ row: e }) => [
          s("div", ce, [
            s("div", re, [
              s("span", ue, i(e.title), 1),
              s("button", {
                type: "button",
                onClick: (v) => O(e)
              }, "Install", 8, me)
            ]),
            s("span", pe, i(e.subject), 1)
          ])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ], 64));
  }
}, _e = /* @__PURE__ */ G(ve, [["__scopeId", "data-v-dfb2f145"]]);
export {
  _e as default
};
