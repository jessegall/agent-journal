/* @code-commandments-generated */
if (!document.getElementById("window-styles-cef5f7952b05")) { const style = document.createElement("style"); style.id = "window-styles-cef5f7952b05"; style.textContent = ".tunnel[data-v-fa71c777]{display:flex;flex-direction:column;gap:6px}.tunnel-state[data-v-fa71c777]{margin:0;font-weight:500}.tunnel-address[data-v-fa71c777]{margin:0;color:var(--text-2);overflow-wrap:anywhere}.tunnel-reason[data-v-fa71c777]{margin:0;color:var(--text-3);font-size:12.5px}.tunnel-failure[data-v-fa71c777]{margin:0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { openBlock as n, createBlock as l, unref as e, withCtx as i, createElementVNode as u, createElementBlock as a, toDisplayString as c, Fragment as p, createCommentVNode as _ } from "vue";
import { useWindow as m, WindowRoom as f, Skeleton as k } from "@journal/window-kit";
const h = (r, d) => {
  const s = r.__vccOpts || r;
  for (const [t, o] of d)
    s[t] = o;
  return s;
}, w = {
  class: "tunnel",
  "data-tunnel": ""
}, y = {
  key: 0,
  class: "tunnel-failure",
  role: "alert"
}, g = ["data-state"], x = {
  key: 0,
  class: "tunnel-address",
  "data-tunnel-address": ""
}, W = {
  key: 1,
  class: "tunnel-reason",
  "data-tunnel-reason": ""
}, v = {
  __name: "TunnelWindow",
  setup(r) {
    const d = { connected: "Connected", disconnected: "Not connected", reconnecting: "Reconnecting" }, s = m(), { data: t, failure: o } = s.props.status;
    return (B, C) => (n(), l(e(f), null, {
      default: i(() => [
        u("div", w, [
          e(o) ? (n(), a("p", y, c(e(o)), 1)) : e(t) ? (n(), a(p, { key: 2 }, [
            u("p", {
              class: "tunnel-state",
              "data-state": e(t).state
            }, c(d[e(t).state] ?? e(t).state), 9, g),
            e(t).address ? (n(), a("p", x, c(e(t).address), 1)) : _("", !0),
            e(t).reason ? (n(), a("p", W, c(e(t).reason), 1)) : _("", !0)
          ], 64)) : (n(), l(e(k), {
            key: 1,
            shape: "text"
          }))
        ])
      ]),
      _: 1
    }));
  }
}, S = /* @__PURE__ */ h(v, [["__scopeId", "data-v-fa71c777"]]);
export {
  S as default
};
