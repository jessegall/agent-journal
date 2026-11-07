/* @code-commandments-generated */
if (!document.getElementById("window-styles-90193821cc9c")) { const style = document.createElement("style"); style.id = "window-styles-90193821cc9c"; style.textContent = ".failure[data-v-8c63a747]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.notice[data-v-8c63a747]{margin:0 0 8px;color:var(--text-2);font-size:12px}.top[data-v-8c63a747]{display:flex;align-items:baseline;gap:10px}.top .heading[data-v-8c63a747]{flex:1}.add[data-v-8c63a747]{display:flex;flex-wrap:wrap;gap:6px}.add input[data-v-8c63a747]{flex:1;min-width:120px;padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px}.heading[data-v-8c63a747]{margin:12px 0 6px;color:var(--text-3);font-size:12px;font-weight:600}.server[data-v-8c63a747]{display:flex;flex:1;flex-direction:column;gap:6px;font-size:13px}.head[data-v-8c63a747]{display:flex;align-items:baseline;gap:10px}.title[data-v-8c63a747]{flex:1;font-weight:600}.standing[data-v-8c63a747],.subject[data-v-8c63a747],.key label[data-v-8c63a747]{color:var(--text-3);font-size:12px}.key[data-v-8c63a747]{display:flex;flex-direction:column;gap:4px}.key input[data-v-8c63a747]{padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px}button[data-v-8c63a747]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { reactive as N, computed as f, ref as V, watch as F, openBlock as r, createBlock as M, unref as n, withCtx as g, createElementBlock as u, toDisplayString as d, createCommentVNode as m, createElementVNode as s, createTextVNode as S, createVNode as p, withModifiers as j, withDirectives as w, vModelText as $ } from "vue";
import { useWindow as P, useListTools as K, WindowRoom as q, TimeAgo as z, Btn as x, ListTools as G, RowList as R, removed as A, added as H } from "@journal/window-kit";
const J = (k, i) => {
  const l = k.__vccOpts || k;
  for (const [c, v] of i)
    l[c] = v;
  return l;
}, Q = {
  key: 0,
  class: "failure"
}, X = {
  key: 1,
  class: "notice",
  "data-mcp-notice": ""
}, Y = { class: "top" }, Z = {
  key: 0,
  class: "subject",
  "data-mcp-checked": ""
}, ee = ["data-row"], te = { class: "head" }, ae = { class: "title" }, se = { class: "standing" }, ne = ["onClick"], le = ["onClick"], oe = { class: "subject" }, ie = {
  key: 0,
  class: "subject",
  "data-mcp-check": ""
}, de = ["onSubmit"], ce = ["for"], re = ["id", "onUpdate:modelValue"], ue = { class: "server" }, me = { class: "head" }, pe = { class: "title" }, ve = ["onClick"], he = { class: "subject" }, ge = {
  __name: "ServerRows",
  setup(k) {
    const i = P(), l = i.props.installed, c = i.props.suggested, v = K(l.rows, { title: (t) => t.title }), _ = N({}), L = f(() => new Set(l.rows.value.map((t) => t.name))), T = f(() => c.rows.value.filter((t) => !L.value.has(t.name))), y = V(""), C = f(() => l.actionFailure.value || c.actionFailure.value), o = N({ name: "", target: "" }), B = f(() => {
      var t;
      return ((t = i.props.check.data.value) == null ? void 0 : t.lines) ?? [];
    }), b = V(null);
    F(i.props.check.data, (t) => {
      t && (b.value = (/* @__PURE__ */ new Date()).toISOString());
    });
    const I = (t) => {
      var a;
      return (a = B.value.find((e) => e.startsWith(`${t.name}  `))) == null ? void 0 : a.slice(t.name.length + 2);
    };
    async function D() {
      await i.reload(["installed", "suggested", "check"]);
    }
    async function U() {
      const t = { id: `adding-${Date.now()}`, name: o.name.trim(), title: o.name.trim(), standing: "adding", auth: "", url: o.target.trim(), command: "", args: [], key_variable: "" };
      (await l.act(["mcp", "add", o.name.trim(), o.target.trim()], H(t))).ok && (Object.assign(o, { name: "", target: "" }), await i.reload("check"));
    }
    async function E(t) {
      const a = await l.act(["message", "send", `Please sign in to ${t.title}: call mcp__${t.name}__authenticate, then complete_authentication, and tell me when it is done.`]);
      y.value = a.ok ? `Asked the agent to sign in to ${t.title}; a browser window opens from its terminal.` : "";
    }
    async function O(t) {
      await c.act(["mcp", "install", t.name], A(t.id)), await i.reload("installed");
    }
    async function W(t) {
      const a = (_[t.name] || "").trim();
      if (!a) return;
      (await l.act(["mcp", "key", t.name, a])).ok && (_[t.name] = "");
    }
    return (t, a) => (r(), M(n(q), null, {
      default: g(() => [
        C.value ? (r(), u("p", Q, d(C.value), 1)) : m("", !0),
        y.value ? (r(), u("p", X, d(y.value), 1)) : m("", !0),
        s("div", Y, [
          a[4] || (a[4] = s("h3", { class: "heading" }, "Installed", -1)),
          b.value ? (r(), u("span", Z, [
            a[2] || (a[2] = S("Checked ", -1)),
            p(n(z), { at: b.value }, null, 8, ["at"])
          ])) : m("", !0),
          p(n(x), {
            small: "",
            "data-mcp-refresh": "",
            onClick: D
          }, {
            default: g(() => [...a[3] || (a[3] = [
              S("Refresh", -1)
            ])]),
            _: 1
          })
        ]),
        p(n(G), { tools: n(v) }, null, 8, ["tools"]),
        p(n(R), {
          rows: n(v).shown.value,
          failure: n(l).failure.value,
          loaded: n(l).loaded.value,
          empty: "No servers installed",
          hint: "Install one of the suggested servers below, or add your own.",
          searching: n(v).filtering.value
        }, {
          default: g(({ row: e }) => [
            s("div", {
              class: "server",
              "data-row": e.id
            }, [
              s("div", te, [
                s("span", ae, d(e.title), 1),
                s("span", se, d(e.standing), 1),
                e.auth === "oauth" ? (r(), u("button", {
                  key: 0,
                  type: "button",
                  "data-mcp-sign-in": "",
                  onClick: (h) => E(e)
                }, "Sign in", 8, ne)) : m("", !0),
                s("button", {
                  type: "button",
                  onClick: (h) => n(l).act(["mcp", "remove", e.name], n(A)(e.id))
                }, "Remove", 8, le)
              ]),
              s("code", oe, d(e.url || [e.command, ...e.args].join(" ")), 1),
              I(e) ? (r(), u("span", ie, d(I(e)), 1)) : m("", !0),
              e.standing === "needs its key" ? (r(), u("form", {
                key: 1,
                class: "key",
                onSubmit: j((h) => W(e), ["prevent"])
              }, [
                s("label", {
                  for: `key-${e.name}`
                }, d(e.key_variable), 9, ce),
                w(s("input", {
                  id: `key-${e.name}`,
                  "onUpdate:modelValue": (h) => _[e.name] = h,
                  type: "password",
                  autocomplete: "off",
                  placeholder: "Paste the key"
                }, null, 8, re), [
                  [$, _[e.name]]
                ]),
                a[5] || (a[5] = s("button", { type: "submit" }, "Save", -1))
              ], 40, de)) : m("", !0)
            ], 8, ee)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "searching"]),
        a[7] || (a[7] = s("h3", { class: "heading" }, "Add a server", -1)),
        s("form", {
          class: "add",
          "data-mcp-add": "",
          onSubmit: j(U, ["prevent"])
        }, [
          w(s("input", {
            "onUpdate:modelValue": a[0] || (a[0] = (e) => o.name = e),
            placeholder: "Name",
            "aria-label": "Name"
          }, null, 512), [
            [$, o.name]
          ]),
          w(s("input", {
            "onUpdate:modelValue": a[1] || (a[1] = (e) => o.target = e),
            placeholder: "Its address, or the command that starts it",
            "aria-label": "Its address, or the command that starts it"
          }, null, 512), [
            [$, o.target]
          ]),
          p(n(x), {
            small: "",
            variant: "primary",
            type: "submit",
            disabled: !o.name.trim() || !o.target.trim()
          }, {
            default: g(() => [...a[6] || (a[6] = [
              S("Add", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ], 32),
        a[8] || (a[8] = s("h3", { class: "heading" }, "Suggested", -1)),
        p(n(R), {
          rows: T.value,
          failure: n(c).failure.value,
          loaded: n(c).loaded.value,
          empty: "Every suggested server is installed",
          hint: "Suggested servers appear here until installed."
        }, {
          default: g(({ row: e }) => [
            s("div", ue, [
              s("div", me, [
                s("span", pe, d(e.title), 1),
                s("button", {
                  type: "button",
                  onClick: (h) => O(e)
                }, "Install", 8, ve)
              ]),
              s("span", he, d(e.subject), 1)
            ])
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, ke = /* @__PURE__ */ J(ge, [["__scopeId", "data-v-8c63a747"]]);
export {
  ke as default
};
