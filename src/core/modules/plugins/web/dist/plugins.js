/* @code-commandments-generated */
if (!document.getElementById("window-styles-c912283a24f6")) { const style = document.createElement("style"); style.id = "window-styles-c912283a24f6"; style.textContent = ".plugin[data-v-be0640a0]{display:flex;flex:1;align-items:baseline;gap:10px;font-size:13px}.name[data-v-be0640a0]{flex:1;font-weight:600}.release[data-v-be0640a0],.state[data-v-be0640a0]{color:var(--text-3);font-size:12px}.state.on[data-v-be0640a0]{color:var(--good, var(--text-2))}.switch[data-v-be0640a0]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { openBlock as _, createBlock as u, unref as n, withCtx as p, createElementVNode as t, toDisplayString as o, normalizeClass as f } from "vue";
import { useWindow as m, useRows as h, RowList as b } from "@journal/window-kit";
const g = (a, l) => {
  const s = a.__vccOpts || a;
  for (const [c, i] of l)
    s[c] = i;
  return s;
}, w = ["data-row"], v = { class: "name" }, k = { class: "release" }, x = ["onClick"], y = {
  __name: "PluginRows",
  setup(a) {
    const l = m(), { rows: s, failure: c, loaded: i } = h("plugin list", ["plugin.*"]), r = (d) => l.run(`plugin ${d.enabled ? "disable" : "enable"} ${d.name}`);
    return (d, C) => (_(), u(n(b), {
      rows: n(s),
      failure: n(c),
      loaded: n(i),
      empty: "No plugins installed"
    }, {
      default: p(({ row: e }) => [
        t("div", {
          class: "plugin",
          "data-row": e.id
        }, [
          t("span", v, o(e.title), 1),
          t("span", k, o(e.release), 1),
          t("span", {
            class: f(["state", { on: e.enabled }])
          }, o(e.enabled ? "On" : "Off"), 3),
          t("button", {
            class: "switch",
            type: "button",
            onClick: (O) => r(e)
          }, o(e.enabled ? "Switch off" : "Switch on"), 9, x)
        ], 8, w)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, $ = /* @__PURE__ */ g(y, [["__scopeId", "data-v-be0640a0"]]);
export {
  $ as default
};
