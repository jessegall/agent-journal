/* @code-commandments-generated */
if (!document.getElementById("window-styles-023cb88beddb")) { const style = document.createElement("style"); style.id = "window-styles-023cb88beddb"; style.textContent = ".tunnel[data-v-2011c570]{display:flex;flex-direction:column;gap:6px}.tunnel-state[data-v-2011c570]{margin:0;font-weight:500}.tunnel-address[data-v-2011c570]{margin:0;color:var(--text-2);overflow-wrap:anywhere}.tunnel-reason[data-v-2011c570]{margin:0;color:var(--text-3);font-size:12.5px}.tunnel-failure[data-v-2011c570]{margin:0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as u, openBlock as t, createElementBlock as s, toDisplayString as c, createBlock as i, unref as v, Fragment as p, createElementVNode as k, createCommentVNode as d } from "vue";
import { useWindow as f, Skeleton as m } from "@journal/window-kit";
const y = (l, r) => {
  const o = l.__vccOpts || l;
  for (const [e, n] of r)
    o[e] = n;
  return o;
}, h = {
  class: "tunnel",
  "data-tunnel": ""
}, g = {
  key: 0,
  class: "tunnel-failure",
  role: "alert"
}, w = ["data-state"], x = {
  key: 0,
  class: "tunnel-address",
  "data-tunnel-address": ""
}, W = {
  key: 1,
  class: "tunnel-reason",
  "data-tunnel-reason": ""
}, B = {
  __name: "TunnelWindow",
  setup(l) {
    const r = { connected: "Connected", disconnected: "Not connected", reconnecting: "Reconnecting" }, o = f(), e = u(null), n = u("");
    async function _() {
      const a = await o.read("tunnel status");
      n.value = a.ok ? "" : a.error, e.value = a.ok ? a.value : null;
    }
    return _(), (a, N) => (t(), s("div", h, [
      n.value ? (t(), s("p", g, c(n.value), 1)) : e.value ? (t(), s(p, { key: 2 }, [
        k("p", {
          class: "tunnel-state",
          "data-state": e.value.state
        }, c(r[e.value.state] ?? e.value.state), 9, w),
        e.value.address ? (t(), s("p", x, c(e.value.address), 1)) : d("", !0),
        e.value.reason ? (t(), s("p", W, c(e.value.reason), 1)) : d("", !0)
      ], 64)) : (t(), i(v(m), {
        key: 1,
        shape: "text"
      }))
    ]));
  }
}, D = /* @__PURE__ */ y(B, [["__scopeId", "data-v-2011c570"]]);
export {
  D as default
};
