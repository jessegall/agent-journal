/* @code-commandments-generated */
if (!document.getElementById("window-styles-5c942dd39925")) { const style = document.createElement("style"); style.id = "window-styles-5c942dd39925"; style.textContent = ".failure[data-v-4e1a8a46]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.notice[data-v-4e1a8a46]{margin:0 0 8px;color:var(--text-2);font-size:12px}.top[data-v-4e1a8a46]{display:flex;align-items:baseline;gap:10px}.top .heading[data-v-4e1a8a46]{flex:1}.add[data-v-4e1a8a46]{display:flex;flex-wrap:wrap;gap:6px}.add input[data-v-4e1a8a46]{flex:1;min-width:120px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px}.heading[data-v-4e1a8a46]{margin:12px 0 6px;color:var(--text-3);font-size:12px;font-weight:600}.server[data-v-4e1a8a46]{display:flex;flex:1;flex-direction:column;gap:6px;font-size:13px}.head[data-v-4e1a8a46]{display:flex;align-items:baseline;gap:10px}.title[data-v-4e1a8a46]{flex:1;font-weight:600}.standing[data-v-4e1a8a46],.subject[data-v-4e1a8a46],.key label[data-v-4e1a8a46]{color:var(--text-3);font-size:12px}.key[data-v-4e1a8a46]{display:flex;flex-direction:column;gap:4px}.key input[data-v-4e1a8a46]{padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px}button[data-v-4e1a8a46]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { reactive as N, computed as b, ref as S, openBlock as c, createBlock as M, unref as n, withCtx as h, createElementBlock as u, toDisplayString as i, createCommentVNode as m, createElementVNode as s, createVNode as _, createTextVNode as V, withModifiers as x, withDirectives as $, vModelText as w } from "vue";
import { useRows as R, useListTools as W, WindowRoom as K, ago as q, Btn as A, ListTools as z, RowList as L, removed as B, added as G } from "@journal/window-kit";
const H = (g, o) => {
  const d = g.__vccOpts || g;
  for (const [p, r] of o)
    d[p] = r;
  return d;
}, J = {
  key: 0,
  class: "failure"
}, Q = {
  key: 1,
  class: "notice",
  "data-mcp-notice": ""
}, X = { class: "top" }, Y = {
  key: 0,
  class: "subject",
  "data-mcp-checked": ""
}, Z = ["data-row"], ee = { class: "head" }, te = { class: "title" }, ae = { class: "standing" }, se = ["onClick"], ne = ["onClick"], oe = { class: "subject" }, le = {
  key: 0,
  class: "subject",
  "data-mcp-check": ""
}, ie = ["onSubmit"], de = ["for"], ce = ["id", "onUpdate:modelValue"], re = { class: "server" }, ue = { class: "head" }, me = { class: "title" }, pe = ["onClick"], ve = { class: "subject" }, he = {
  __name: "ServerRows",
  setup(g) {
    const o = R("mcp list", []), d = R("mcp suggested", []), p = W(o.rows, { title: (t) => t.title }), r = N({}), D = b(() => new Set(o.rows.value.map((t) => t.name))), T = b(() => d.rows.value.filter((t) => !D.value.has(t.name))), f = S(""), C = b(() => o.actionFailure.value || d.actionFailure.value), l = N({ name: "", target: "" }), j = S([]), k = S(null);
    async function y() {
      const t = await o.context.read("mcp check");
      j.value = t.ok ? t.value.lines : [], k.value = t.ok ? (/* @__PURE__ */ new Date()).toISOString() : null;
    }
    const I = (t) => {
      var a;
      return (a = j.value.find((e) => e.startsWith(`${t.name}  `))) == null ? void 0 : a.slice(t.name.length + 2);
    };
    async function U() {
      await Promise.all([o.load(), d.load(), y()]);
    }
    async function E() {
      const t = { id: `adding-${Date.now()}`, name: l.name.trim(), title: l.name.trim(), standing: "adding", auth: "", url: l.target.trim(), command: "", args: [], key_variable: "" };
      (await o.act(["mcp", "add", l.name.trim(), l.target.trim()], G(t))).ok && (Object.assign(l, { name: "", target: "" }), await y());
    }
    async function O(t) {
      const a = await o.act(["message", "send", `Please sign in to ${t.title}: call mcp__${t.name}__authenticate, then complete_authentication, and tell me when it is done.`]);
      f.value = a.ok ? `Asked the agent to sign in to ${t.title}; a browser window opens from its terminal.` : "";
    }
    y();
    async function P(t) {
      await d.act(["mcp", "install", t.name], B(t.id)), await o.load();
    }
    async function F(t) {
      const a = (r[t.name] || "").trim();
      if (!a) return;
      (await o.act(["mcp", "key", t.name, a])).ok && (r[t.name] = "");
    }
    return (t, a) => (c(), M(n(K), null, {
      default: h(() => [
        C.value ? (c(), u("p", J, i(C.value), 1)) : m("", !0),
        f.value ? (c(), u("p", Q, i(f.value), 1)) : m("", !0),
        s("div", X, [
          a[3] || (a[3] = s("h3", { class: "heading" }, "Installed", -1)),
          k.value ? (c(), u("span", Y, "Checked " + i(n(q)(k.value)), 1)) : m("", !0),
          _(n(A), {
            small: "",
            "data-mcp-refresh": "",
            onClick: U
          }, {
            default: h(() => [...a[2] || (a[2] = [
              V("Refresh", -1)
            ])]),
            _: 1
          })
        ]),
        _(n(z), { tools: n(p) }, null, 8, ["tools"]),
        _(n(L), {
          rows: n(p).shown.value,
          failure: n(o).failure.value,
          loaded: n(o).loaded.value,
          empty: "No servers installed",
          hint: "Install one of the suggested servers below, or add your own.",
          searching: n(p).filtering.value
        }, {
          default: h(({ row: e }) => [
            s("div", {
              class: "server",
              "data-row": e.id
            }, [
              s("div", ee, [
                s("span", te, i(e.title), 1),
                s("span", ae, i(e.standing), 1),
                e.auth === "oauth" ? (c(), u("button", {
                  key: 0,
                  type: "button",
                  "data-mcp-sign-in": "",
                  onClick: (v) => O(e)
                }, "Sign in", 8, se)) : m("", !0),
                s("button", {
                  type: "button",
                  onClick: (v) => n(o).act(["mcp", "remove", e.name], n(B)(e.id))
                }, "Remove", 8, ne)
              ]),
              s("code", oe, i(e.url || [e.command, ...e.args].join(" ")), 1),
              I(e) ? (c(), u("span", le, i(I(e)), 1)) : m("", !0),
              e.standing === "needs its key" ? (c(), u("form", {
                key: 1,
                class: "key",
                onSubmit: x((v) => F(e), ["prevent"])
              }, [
                s("label", {
                  for: `key-${e.name}`
                }, i(e.key_variable), 9, de),
                $(s("input", {
                  id: `key-${e.name}`,
                  "onUpdate:modelValue": (v) => r[e.name] = v,
                  type: "password",
                  autocomplete: "off",
                  placeholder: "Paste the key"
                }, null, 8, ce), [
                  [w, r[e.name]]
                ]),
                a[4] || (a[4] = s("button", { type: "submit" }, "Save", -1))
              ], 40, ie)) : m("", !0)
            ], 8, Z)
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
            "onUpdate:modelValue": a[0] || (a[0] = (e) => l.name = e),
            placeholder: "Name",
            "aria-label": "Name"
          }, null, 512), [
            [w, l.name]
          ]),
          $(s("input", {
            "onUpdate:modelValue": a[1] || (a[1] = (e) => l.target = e),
            placeholder: "Its address, or the command that starts it",
            "aria-label": "Its address, or the command that starts it"
          }, null, 512), [
            [w, l.target]
          ]),
          _(n(A), {
            small: "",
            kind: "primary",
            type: "submit",
            disabled: !l.name.trim() || !l.target.trim()
          }, {
            default: h(() => [...a[5] || (a[5] = [
              V("Add", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ], 32),
        a[7] || (a[7] = s("h3", { class: "heading" }, "Suggested", -1)),
        _(n(L), {
          rows: T.value,
          failure: n(d).failure.value,
          loaded: n(d).loaded.value,
          empty: "Every suggested server is installed",
          hint: "A server the journal suggests shows here until it is installed."
        }, {
          default: h(({ row: e }) => [
            s("div", re, [
              s("div", ue, [
                s("span", me, i(e.title), 1),
                s("button", {
                  type: "button",
                  onClick: (v) => P(e)
                }, "Install", 8, pe)
              ]),
              s("span", ve, i(e.subject), 1)
            ])
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, fe = /* @__PURE__ */ H(he, [["__scopeId", "data-v-4e1a8a46"]]);
export {
  fe as default
};
