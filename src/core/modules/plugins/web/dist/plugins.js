/* @code-commandments-generated */
if (!document.getElementById("window-styles-2e38b54a1750")) { const style = document.createElement("style"); style.id = "window-styles-2e38b54a1750"; style.textContent = ".plugins[data-v-363a6e9a]{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}.plugin[data-v-363a6e9a]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plugin-head[data-v-363a6e9a]{display:flex;gap:10px;align-items:center}.name[data-v-363a6e9a]{flex:1;font-weight:500}.release[data-v-363a6e9a],.plugin-source[data-v-363a6e9a],.plugin-note[data-v-363a6e9a]{margin:0;color:var(--text-3);font-size:12px}.plugin-fault[data-v-363a6e9a]{color:var(--danger);font-size:12px}.toggle[data-v-363a6e9a]{position:relative;flex:none;width:30px;height:17px;border:0;border-radius:9px;background:var(--raised);cursor:pointer}.toggle[data-v-363a6e9a]:after{position:absolute;top:2px;left:2px;width:13px;height:13px;border-radius:50%;background:#fff;content:\"\";transition:transform .15s ease}.toggle.on[data-v-363a6e9a]{background:var(--accent)}.toggle.on[data-v-363a6e9a]:after{transform:translate(13px)}\n"; document.head.appendChild(style); }
import { openBlock as s, createElementBlock as n, unref as t, createBlock as g, toDisplayString as o, createCommentVNode as _, Fragment as h, renderList as k, createElementVNode as c, normalizeClass as m } from "vue";
import { useWindow as f, useRows as b, Skeleton as y } from "@journal/window-kit";
const v = (i, d) => {
  const a = i.__vccOpts || i;
  for (const [l, r] of d)
    a[l] = r;
  return a;
}, x = { class: "plugins" }, C = {
  key: 1,
  class: "plugin-note"
}, S = {
  key: 2,
  class: "plugin-note"
}, B = ["data-row"], N = { class: "plugin-head" }, R = { class: "name" }, $ = { class: "release" }, E = ["aria-checked", "aria-label", "onClick"], F = { class: "plugin-source" }, O = {
  key: 0,
  class: "plugin-fault"
}, P = {
  __name: "PluginRows",
  setup(i) {
    const d = f(), { rows: a, failure: l, loaded: r } = b("plugin list", ["plugin.*"]), p = (u) => d.run(`plugin ${u.enabled ? "disable" : "enable"} ${u.name}`);
    return (u, V) => (s(), n("div", x, [
      t(r) ? !t(l) && !t(a).length ? (s(), n("p", C, "No plugins installed")) : t(l) ? (s(), n("p", S, o(t(l)), 1)) : _("", !0) : (s(), g(t(y), {
        key: 0,
        shape: "cards"
      })),
      (s(!0), n(h, null, k(t(a), (e) => (s(), n("div", {
        key: e.id,
        class: "plugin",
        "data-row": e.id
      }, [
        c("span", N, [
          c("span", R, o(e.title), 1),
          c("span", $, o(e.release), 1),
          c("button", {
            type: "button",
            role: "switch",
            "aria-checked": e.enabled,
            "aria-label": e.enabled ? "Switch off" : "Switch on",
            class: m(["toggle", { on: e.enabled }]),
            onClick: (z) => p(e)
          }, null, 10, E)
        ]),
        c("span", F, o(e.source), 1),
        e.failing ? (s(), n("span", O, o(e.last_fault || "Failing"), 1)) : _("", !0)
      ], 8, B))), 128))
    ]));
  }
}, L = /* @__PURE__ */ v(P, [["__scopeId", "data-v-363a6e9a"]]);
export {
  L as default
};
