/* @code-commandments-generated */
if (!document.getElementById("window-styles-7da64146641d")) { const style = document.createElement("style"); style.id = "window-styles-7da64146641d"; style.textContent = ".tool[data-v-268ef0aa]{display:flex;flex-direction:column;gap:6px;margin-bottom:12px;padding:12px;border:1px solid var(--border-2);border-radius:10px;font-size:13px}.head[data-v-268ef0aa]{display:flex;align-items:baseline;gap:10px}.title[data-v-268ef0aa]{flex:1;font-weight:600}.state[data-v-268ef0aa],.detail[data-v-268ef0aa]{margin:0;color:var(--text-3);font-size:12px}.actions[data-v-268ef0aa]{display:flex;gap:8px}.failure[data-v-268ef0aa]{margin:0;color:var(--bad, var(--text-2));font-size:12px}\n"; document.head.appendChild(style); }
import { computed as y, ref as g, watch as B, onBeforeUnmount as R, openBlock as o, createBlock as I, unref as i, withCtx as m, createElementBlock as v, toDisplayString as s, createCommentVNode as b, Fragment as S, renderList as V, createElementVNode as n, createTextVNode as w, createVNode as L } from "vue";
import { useWindow as $, WindowRoom as D, Btn as x } from "@journal/window-kit";
const E = (h, a) => {
  const u = h.__vccOpts || h;
  for (const [_, f] of a)
    u[_] = f;
  return u;
}, P = {
  key: 0,
  class: "failure",
  "data-tools-failure": ""
}, W = ["data-tool"], F = { class: "head" }, M = { class: "title" }, U = {
  class: "state",
  "data-tool-state": ""
}, j = { class: "detail" }, q = {
  class: "detail",
  "data-tool-installed": ""
}, z = {
  class: "detail",
  "data-tool-refreshed": ""
}, A = { class: "actions" }, G = {
  key: 0,
  class: "failure",
  "data-tool-failure": ""
}, H = 3e3, J = {
  __name: "ToolsPanel",
  setup(h) {
    const a = $(), { data: u, failure: _ } = a.props.tools, f = y(() => {
      var t;
      return ((t = u.value) == null ? void 0 : t.tools) ?? [];
    }), d = g(""), c = g({ name: "", text: "" }), p = y(() => a.face === "phone" || a.readOnly === !0), N = y(() => f.value.some((t) => t.is_running));
    let l = null;
    B(N, (t) => {
      t && l === null && (l = setInterval(() => a.reload("tools"), H)), !t && l !== null && (clearInterval(l), l = null);
    }, { immediate: !0 }), R(() => clearInterval(l));
    async function k(t, r) {
      d.value = t.name, c.value = { name: "", text: "" };
      try {
        const e = await a.run(r);
        c.value = { name: t.name, text: e.ok ? "" : e.error }, await a.reload("tools");
      } finally {
        d.value = "";
      }
    }
    const O = (t) => t.refreshed_at ? `Last refresh ${new Date(t.refreshed_at).toLocaleString()}` : "Never refreshed", T = (t) => t.is_running ? "Refreshing" : t.is_failed ? "The last refresh failed" : t.is_on ? "On" : "Off";
    return (t, r) => (o(), I(i(D), null, {
      default: m(() => [
        i(_) ? (o(), v("p", P, s(i(_)), 1)) : b("", !0),
        (o(!0), v(S, null, V(f.value, (e) => (o(), v("article", {
          key: e.name,
          class: "tool",
          "data-tool": e.name
        }, [
          n("div", F, [
            n("span", M, s(e.title), 1),
            n("span", U, s(T(e)), 1)
          ]),
          n("p", j, s(e.description), 1),
          n("p", q, s(e.is_installed ? "Installed" : "Not installed"), 1),
          n("p", z, s(O(e)), 1),
          n("div", A, [
            e.is_installed ? b("", !0) : (o(), I(i(x), {
              key: 0,
              bordered: "",
              disabled: p.value || d.value !== "",
              "data-tool-install": "",
              onClick: (C) => k(e, ["tool", "install", e.name])
            }, {
              default: m(() => [...r[0] || (r[0] = [
                w("Install", -1)
              ])]),
              _: 1
            }, 8, ["disabled", "onClick"])),
            L(i(x), {
              bordered: "",
              disabled: p.value || d.value !== "",
              "data-tool-switch": "",
              onClick: (C) => k(e, ["tool", e.is_on ? "off" : "on", e.name])
            }, {
              default: m(() => [
                w(s(e.is_on ? "Turn off" : "Turn on"), 1)
              ]),
              _: 2
            }, 1032, ["disabled", "onClick"]),
            L(i(x), {
              bordered: "",
              disabled: p.value || d.value !== "" || !e.is_installed || e.is_running,
              "data-tool-refresh": "",
              onClick: (C) => k(e, ["tool", "refresh", e.name])
            }, {
              default: m(() => [...r[1] || (r[1] = [
                w("Refresh now", -1)
              ])]),
              _: 1
            }, 8, ["disabled", "onClick"])
          ]),
          c.value.name === e.name && c.value.text ? (o(), v("p", G, s(c.value.text), 1)) : b("", !0)
        ], 8, W))), 128))
      ]),
      _: 1
    }));
  }
}, X = /* @__PURE__ */ E(J, [["__scopeId", "data-v-268ef0aa"]]);
export {
  X as default
};
