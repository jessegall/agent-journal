/* @code-commandments-generated */
if (!document.getElementById("window-styles-e907f1e2388e")) { const style = document.createElement("style"); style.id = "window-styles-e907f1e2388e"; style.textContent = ".tool[data-v-4683a112]{display:flex;flex-direction:column;gap:6px;margin-bottom:12px;padding:12px;border:1px solid var(--border-2);border-radius:10px;font-size:13px}.head[data-v-4683a112]{display:flex;align-items:baseline;gap:10px}.title[data-v-4683a112]{flex:1;font-weight:600}.state[data-v-4683a112],.detail[data-v-4683a112]{margin:0;color:var(--text-3);font-size:12px}.actions[data-v-4683a112]{display:flex;gap:8px}.failure[data-v-4683a112]{margin:0;color:var(--bad, var(--text-2));font-size:12px}\n"; document.head.appendChild(style); }
import { computed as k, ref as C, openBlock as r, createBlock as L, unref as o, withCtx as f, createElementBlock as v, toDisplayString as s, createCommentVNode as y, Fragment as I, renderList as B, createElementVNode as n, createTextVNode as b, createVNode as N } from "vue";
import { useWindow as P, usePoll as R, WindowRoom as S, Btn as x } from "@journal/window-kit";
const V = (m, a) => {
  const c = m.__vccOpts || m;
  for (const [u, _] of a)
    c[u] = _;
  return c;
}, $ = {
  key: 0,
  class: "failure",
  "data-tools-failure": ""
}, D = ["data-tool"], E = { class: "head" }, W = { class: "title" }, F = {
  class: "state",
  "data-tool-state": ""
}, M = { class: "detail" }, j = {
  class: "detail",
  "data-tool-installed": ""
}, q = {
  class: "detail",
  "data-tool-refreshed": ""
}, z = { class: "actions" }, A = {
  key: 0,
  class: "failure",
  "data-tool-failure": ""
}, G = 3e3, H = {
  __name: "ToolsPanel",
  setup(m) {
    const a = P(), { data: c, failure: u } = a.props.tools, _ = k(() => {
      var t;
      return ((t = c.value) == null ? void 0 : t.tools) ?? [];
    }), i = C(""), d = C({ name: "", text: "" }), p = k(() => a.face === "phone" || a.readOnly === !0), g = k(() => _.value.some((t) => t.is_running));
    R(() => g.value && a.reload("tools"), () => g.value, G);
    async function h(t, l) {
      i.value = t.name, d.value = { name: "", text: "" };
      try {
        const e = await a.run(l);
        d.value = { name: t.name, text: e.ok ? "" : e.error }, await a.reload("tools");
      } finally {
        i.value = "";
      }
    }
    const O = (t) => t.refreshed_at ? `Last refresh ${new Date(t.refreshed_at).toLocaleString()}` : "Never refreshed", T = (t) => t.is_running ? "Refreshing" : t.is_failed ? "The last refresh failed" : t.is_on ? "On" : "Off";
    return (t, l) => (r(), L(o(S), null, {
      default: f(() => [
        o(u) ? (r(), v("p", $, s(o(u)), 1)) : y("", !0),
        (r(!0), v(I, null, B(_.value, (e) => (r(), v("article", {
          key: e.name,
          class: "tool",
          "data-tool": e.name
        }, [
          n("div", E, [
            n("span", W, s(e.title), 1),
            n("span", F, s(T(e)), 1)
          ]),
          n("p", M, s(e.description), 1),
          n("p", j, s(e.is_installed ? "Installed" : "Not installed"), 1),
          n("p", q, s(O(e)), 1),
          n("div", z, [
            e.is_installed ? y("", !0) : (r(), L(o(x), {
              key: 0,
              bordered: "",
              disabled: p.value || i.value !== "",
              "data-tool-install": "",
              onClick: (w) => h(e, ["tool", "install", e.name])
            }, {
              default: f(() => [...l[0] || (l[0] = [
                b("Install", -1)
              ])]),
              _: 1
            }, 8, ["disabled", "onClick"])),
            N(o(x), {
              bordered: "",
              disabled: p.value || i.value !== "",
              "data-tool-switch": "",
              onClick: (w) => h(e, ["tool", e.is_on ? "off" : "on", e.name])
            }, {
              default: f(() => [
                b(s(e.is_on ? "Turn off" : "Turn on"), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onClick"]),
            N(o(x), {
              bordered: "",
              disabled: p.value || i.value !== "" || !e.is_installed || e.is_running,
              "data-tool-refresh": "",
              onClick: (w) => h(e, ["tool", "refresh", e.name])
            }, {
              default: f(() => [...l[1] || (l[1] = [
                b("Refresh now", -1)
              ])]),
              _: 1
            }, 8, ["disabled", "onClick"])
          ]),
          d.value.name === e.name && d.value.text ? (r(), v("p", A, s(d.value.text), 1)) : y("", !0)
        ], 8, D))), 128))
      ]),
      _: 1
    }));
  }
}, Q = /* @__PURE__ */ V(H, [["__scopeId", "data-v-4683a112"]]);
export {
  Q as default
};
