if (!document.getElementById("window-styles-cbcaa7840498")) { const style = document.createElement("style"); style.id = "window-styles-cbcaa7840498"; style.textContent = ".tunnel[data-v-85cbdd28]{display:flex;flex-direction:column;gap:6px}.tunnel-state[data-v-85cbdd28]{margin:0;font-weight:500}.tunnel-address[data-v-85cbdd28]{margin:0;color:var(--text-2);overflow-wrap:anywhere}.tunnel-reason[data-v-85cbdd28]{margin:0;color:var(--text-3);font-size:12.5px}.tunnel-failure[data-v-85cbdd28]{margin:0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { openBlock as n, createBlock as l, unref as e, withCtx as i, createElementVNode as u, createElementBlock as a, toDisplayString as c, Fragment as p, createCommentVNode as _ } from "vue";
import { useWindow as m, WindowRoom as f, Skeleton as k } from "@journal/window-kit";
const h = (r, d) => {
  const s = r.__vccOpts || r;
  for (const [t, o] of d)
    s[t] = o;
  return s;
}, y = {
  class: "tunnel",
  "data-tunnel": ""
}, w = {
  key: 0,
  class: "tunnel-failure",
  role: "alert"
}, g = ["data-state"], v = {
  key: 0,
  class: "tunnel-address",
  "data-tunnel-address": ""
}, x = {
  key: 1,
  class: "tunnel-reason",
  "data-tunnel-reason": ""
}, W = {
  __name: "TunnelWindow",
  setup(r) {
    const d = { connected: "Connected", disconnected: "Not connected", reconnecting: "Reconnecting" }, s = m(), { data: t, failure: o } = s.props.status;
    return (B, C) => (n(), l(e(f), null, {
      default: i(() => [
        u("div", y, [
          e(o) ? (n(), a("p", w, c(e(o)), 1)) : e(t) ? (n(), a(p, { key: 2 }, [
            u("p", {
              class: "tunnel-state",
              "data-state": e(t).state
            }, c(d[e(t).state] ?? e(t).state), 9, g),
            e(t).address ? (n(), a("p", v, c(e(t).address), 1)) : _("", !0),
            e(t).reason ? (n(), a("p", x, c(e(t).reason), 1)) : _("", !0)
          ], 64)) : (n(), l(e(k), {
            key: 1,
            shape: "text"
          }))
        ])
      ]),
      _: 1
    }));
  }
}, S = /* @__PURE__ */ h(W, [["__scopeId", "data-v-85cbdd28"]]);
export {
  S as default
};
