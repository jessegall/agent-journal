/* @code-commandments-generated */
if (!document.getElementById("window-styles-c97079ebf7c1")) { const style = document.createElement("style"); style.id = "window-styles-c97079ebf7c1"; style.textContent = ".failure[data-v-0c74f0e5]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.notice[data-v-0c74f0e5]{margin:0 0 8px;color:var(--text-2);font-size:12px}.top[data-v-0c74f0e5]{display:flex;align-items:baseline;gap:10px}.top .heading[data-v-0c74f0e5]{flex:1}.add[data-v-0c74f0e5]{display:flex;flex-wrap:wrap;gap:6px}.add input[data-v-0c74f0e5]{flex:1;min-width:120px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px}.heading[data-v-0c74f0e5]{margin:12px 0 6px;color:var(--text-3);font-size:12px;font-weight:600}.server[data-v-0c74f0e5]{display:flex;flex:1;flex-direction:column;gap:6px;font-size:13px}.head[data-v-0c74f0e5]{display:flex;align-items:baseline;gap:10px}.title[data-v-0c74f0e5]{flex:1;font-weight:600}.standing[data-v-0c74f0e5],.subject[data-v-0c74f0e5],.key label[data-v-0c74f0e5]{color:var(--text-3);font-size:12px}.key[data-v-0c74f0e5]{display:flex;flex-direction:column;gap:4px}.key input[data-v-0c74f0e5]{padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px}button[data-v-0c74f0e5]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { reactive as j, computed as b, ref as S, openBlock as c, createBlock as M, unref as n, withCtx as f, createElementBlock as u, toDisplayString as d, createCommentVNode as m, createElementVNode as s, createTextVNode as $, createVNode as p, withModifiers as x, withDirectives as w, vModelText as C } from "vue";
import { useRows as R, useListTools as W, WindowRoom as K, TimeAgo as q, Btn as A, ListTools as z, RowList as L, removed as T, added as G } from "@journal/window-kit";
const H = (g, l) => {
  const i = g.__vccOpts || g;
  for (const [v, r] of l)
    i[v] = r;
  return i;
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
}, Z = ["data-row"], ee = { class: "head" }, te = { class: "title" }, ae = { class: "standing" }, se = ["onClick"], ne = ["onClick"], le = { class: "subject" }, oe = {
  key: 0,
  class: "subject",
  "data-mcp-check": ""
}, ie = ["onSubmit"], de = ["for"], ce = ["id", "onUpdate:modelValue"], re = { class: "server" }, ue = { class: "head" }, me = { class: "title" }, pe = ["onClick"], ve = { class: "subject" }, he = {
  __name: "ServerRows",
  setup(g) {
    const l = R("mcp list", []), i = R("mcp suggested", []), v = W(l.rows, { title: (a) => a.title }), r = j({}), B = b(() => new Set(l.rows.value.map((a) => a.name))), D = b(() => i.rows.value.filter((a) => !B.value.has(a.name))), _ = S(""), I = b(() => l.actionFailure.value || i.actionFailure.value), o = j({ name: "", target: "" }), N = S([]), k = S(null);
    async function y() {
      const a = await l.context.read("mcp check");
      N.value = a.ok ? a.value.lines : [], k.value = a.ok ? (/* @__PURE__ */ new Date()).toISOString() : null;
    }
    const V = (a) => {
      var t;
      return (t = N.value.find((e) => e.startsWith(`${a.name}  `))) == null ? void 0 : t.slice(a.name.length + 2);
    };
    async function U() {
      await Promise.all([l.load(), i.load(), y()]);
    }
    async function E() {
      const a = { id: `adding-${Date.now()}`, name: o.name.trim(), title: o.name.trim(), standing: "adding", auth: "", url: o.target.trim(), command: "", args: [], key_variable: "" };
      (await l.act(["mcp", "add", o.name.trim(), o.target.trim()], G(a))).ok && (Object.assign(o, { name: "", target: "" }), await y());
    }
    async function O(a) {
      const t = await l.act(["message", "send", `Please sign in to ${a.title}: call mcp__${a.name}__authenticate, then complete_authentication, and tell me when it is done.`]);
      _.value = t.ok ? `Asked the agent to sign in to ${a.title}; a browser window opens from its terminal.` : "";
    }
    y();
    async function P(a) {
      await i.act(["mcp", "install", a.name], T(a.id)), await l.load();
    }
    async function F(a) {
      const t = (r[a.name] || "").trim();
      if (!t) return;
      (await l.act(["mcp", "key", a.name, t])).ok && (r[a.name] = "");
    }
    return (a, t) => (c(), M(n(K), null, {
      default: f(() => [
        I.value ? (c(), u("p", J, d(I.value), 1)) : m("", !0),
        _.value ? (c(), u("p", Q, d(_.value), 1)) : m("", !0),
        s("div", X, [
          t[4] || (t[4] = s("h3", { class: "heading" }, "Installed", -1)),
          k.value ? (c(), u("span", Y, [
            t[2] || (t[2] = $("Checked ", -1)),
            p(n(q), { at: k.value }, null, 8, ["at"])
          ])) : m("", !0),
          p(n(A), {
            small: "",
            "data-mcp-refresh": "",
            onClick: U
          }, {
            default: f(() => [...t[3] || (t[3] = [
              $("Refresh", -1)
            ])]),
            _: 1
          })
        ]),
        p(n(z), { tools: n(v) }, null, 8, ["tools"]),
        p(n(L), {
          rows: n(v).shown.value,
          failure: n(l).failure.value,
          loaded: n(l).loaded.value,
          empty: "No servers installed",
          hint: "Install one of the suggested servers below, or add your own.",
          searching: n(v).filtering.value
        }, {
          default: f(({ row: e }) => [
            s("div", {
              class: "server",
              "data-row": e.id
            }, [
              s("div", ee, [
                s("span", te, d(e.title), 1),
                s("span", ae, d(e.standing), 1),
                e.auth === "oauth" ? (c(), u("button", {
                  key: 0,
                  type: "button",
                  "data-mcp-sign-in": "",
                  onClick: (h) => O(e)
                }, "Sign in", 8, se)) : m("", !0),
                s("button", {
                  type: "button",
                  onClick: (h) => n(l).act(["mcp", "remove", e.name], n(T)(e.id))
                }, "Remove", 8, ne)
              ]),
              s("code", le, d(e.url || [e.command, ...e.args].join(" ")), 1),
              V(e) ? (c(), u("span", oe, d(V(e)), 1)) : m("", !0),
              e.standing === "needs its key" ? (c(), u("form", {
                key: 1,
                class: "key",
                onSubmit: x((h) => F(e), ["prevent"])
              }, [
                s("label", {
                  for: `key-${e.name}`
                }, d(e.key_variable), 9, de),
                w(s("input", {
                  id: `key-${e.name}`,
                  "onUpdate:modelValue": (h) => r[e.name] = h,
                  type: "password",
                  autocomplete: "off",
                  placeholder: "Paste the key"
                }, null, 8, ce), [
                  [C, r[e.name]]
                ]),
                t[5] || (t[5] = s("button", { type: "submit" }, "Save", -1))
              ], 40, ie)) : m("", !0)
            ], 8, Z)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "searching"]),
        t[7] || (t[7] = s("h3", { class: "heading" }, "Add a server", -1)),
        s("form", {
          class: "add",
          "data-mcp-add": "",
          onSubmit: x(E, ["prevent"])
        }, [
          w(s("input", {
            "onUpdate:modelValue": t[0] || (t[0] = (e) => o.name = e),
            placeholder: "Name",
            "aria-label": "Name"
          }, null, 512), [
            [C, o.name]
          ]),
          w(s("input", {
            "onUpdate:modelValue": t[1] || (t[1] = (e) => o.target = e),
            placeholder: "Its address, or the command that starts it",
            "aria-label": "Its address, or the command that starts it"
          }, null, 512), [
            [C, o.target]
          ]),
          p(n(A), {
            small: "",
            variant: "primary",
            type: "submit",
            disabled: !o.name.trim() || !o.target.trim()
          }, {
            default: f(() => [...t[6] || (t[6] = [
              $("Add", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ], 32),
        t[8] || (t[8] = s("h3", { class: "heading" }, "Suggested", -1)),
        p(n(L), {
          rows: D.value,
          failure: n(i).failure.value,
          loaded: n(i).loaded.value,
          empty: "Every suggested server is installed",
          hint: "Suggested servers appear here until installed."
        }, {
          default: f(({ row: e }) => [
            s("div", re, [
              s("div", ue, [
                s("span", me, d(e.title), 1),
                s("button", {
                  type: "button",
                  onClick: (h) => P(e)
                }, "Install", 8, pe)
              ]),
              s("span", ve, d(e.subject), 1)
            ])
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, _e = /* @__PURE__ */ H(he, [["__scopeId", "data-v-0c74f0e5"]]);
export {
  _e as default
};
