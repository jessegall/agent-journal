/* @code-commandments-generated */
if (!document.getElementById("window-styles-d2d030f47b41")) { const style = document.createElement("style"); style.id = "window-styles-d2d030f47b41"; style.textContent = ".failure[data-v-00cf0b96]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.heading[data-v-00cf0b96]{margin:12px 0 6px;color:var(--text-3);font-size:12px;font-weight:600}.server[data-v-00cf0b96]{display:flex;flex:1;flex-direction:column;gap:6px;font-size:13px}.head[data-v-00cf0b96]{display:flex;align-items:baseline;gap:10px}.title[data-v-00cf0b96]{flex:1;font-weight:600}.standing[data-v-00cf0b96],.subject[data-v-00cf0b96],.key label[data-v-00cf0b96]{color:var(--text-3);font-size:12px}.key[data-v-00cf0b96]{display:flex;flex-direction:column;gap:4px}.key input[data-v-00cf0b96]{padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px}button[data-v-00cf0b96]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { reactive as C, computed as m, openBlock as v, createElementBlock as _, Fragment as x, toDisplayString as d, createCommentVNode as f, createElementVNode as t, createVNode as y, unref as l, withCtx as h, withModifiers as N, withDirectives as R, vModelText as V } from "vue";
import { useRows as k, RowList as g } from "@journal/window-kit";
const $ = (r, s) => {
  const o = r.__vccOpts || r;
  for (const [i, u] of s)
    o[i] = u;
  return o;
}, E = {
  key: 0,
  class: "failure"
}, F = ["data-row"], I = { class: "head" }, j = { class: "title" }, B = { class: "standing" }, D = ["onClick"], M = ["onSubmit"], U = ["for"], K = ["id", "onUpdate:modelValue"], L = { class: "server" }, O = { class: "head" }, P = { class: "title" }, T = ["onClick"], q = { class: "subject" }, z = {
  __name: "ServerRows",
  setup(r) {
    const s = k("mcp list", []), o = k("mcp suggested", []), i = C({}), u = m(() => new Set(s.rows.value.map((a) => a.name))), b = m(() => o.rows.value.filter((a) => !u.value.has(a.name))), p = m(() => s.actionFailure.value || o.actionFailure.value);
    async function S(a) {
      await o.act(["mcp", "install", a.name]), await s.load();
    }
    async function w(a) {
      const n = (i[a.name] || "").trim();
      if (!n) return;
      (await s.act(["mcp", "key", a.name, n])).ok && (i[a.name] = "");
    }
    return (a, n) => (v(), _(x, null, [
      p.value ? (v(), _("p", E, d(p.value), 1)) : f("", !0),
      n[1] || (n[1] = t("h3", { class: "heading" }, "Installed", -1)),
      y(l(g), {
        rows: l(s).rows.value,
        failure: l(s).failure.value,
        loaded: l(s).loaded.value,
        empty: "No servers installed"
      }, {
        default: h(({ row: e }) => [
          t("div", {
            class: "server",
            "data-row": e.id
          }, [
            t("div", I, [
              t("span", j, d(e.title), 1),
              t("span", B, d(e.standing), 1),
              t("button", {
                type: "button",
                onClick: (c) => l(s).act(["mcp", "remove", e.name])
              }, "Remove", 8, D)
            ]),
            e.standing === "needs its key" ? (v(), _("form", {
              key: 0,
              class: "key",
              onSubmit: N((c) => w(e), ["prevent"])
            }, [
              t("label", {
                for: `key-${e.name}`
              }, d(e.key_variable), 9, U),
              R(t("input", {
                id: `key-${e.name}`,
                "onUpdate:modelValue": (c) => i[e.name] = c,
                type: "password",
                autocomplete: "off",
                placeholder: "Paste the key"
              }, null, 8, K), [
                [V, i[e.name]]
              ]),
              n[0] || (n[0] = t("button", { type: "submit" }, "Save", -1))
            ], 40, M)) : f("", !0)
          ], 8, F)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"]),
      n[2] || (n[2] = t("h3", { class: "heading" }, "Suggested", -1)),
      y(l(g), {
        rows: b.value,
        failure: l(o).failure.value,
        loaded: l(o).loaded.value,
        empty: "Every suggested server is installed"
      }, {
        default: h(({ row: e }) => [
          t("div", L, [
            t("div", O, [
              t("span", P, d(e.title), 1),
              t("button", {
                type: "button",
                onClick: (c) => S(e)
              }, "Install", 8, T)
            ]),
            t("span", q, d(e.subject), 1)
          ])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ], 64));
  }
}, H = /* @__PURE__ */ $(z, [["__scopeId", "data-v-00cf0b96"]]);
export {
  H as default
};
