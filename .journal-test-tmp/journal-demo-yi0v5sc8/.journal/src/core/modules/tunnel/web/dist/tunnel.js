/* @code-commandments-generated */
if (!document.getElementById("window-styles-b57566822bc2")) { const style = document.createElement("style"); style.id = "window-styles-b57566822bc2"; style.textContent = ".tunnel[data-v-3c788d7c]{display:flex;flex-direction:column;gap:6px}.tunnel-state[data-v-3c788d7c]{margin:0;font-weight:500}.tunnel-address[data-v-3c788d7c]{margin:0;color:var(--text-2);overflow-wrap:anywhere}.tunnel-reason[data-v-3c788d7c]{margin:0;color:var(--text-3);font-size:12.5px}.tunnel-failure[data-v-3c788d7c]{margin:0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as u, openBlock as t, createBlock as d, unref as _, withCtx as f, createElementVNode as i, createElementBlock as o, toDisplayString as c, Fragment as k, createCommentVNode as v } from "vue";
import { useWindow as m, WindowRoom as h, Skeleton as y } from "@journal/window-kit";
const w = (l, r) => {
  const s = l.__vccOpts || l;
  for (const [e, n] of r)
    s[e] = n;
  return s;
}, x = {
  class: "tunnel",
  "data-tunnel": ""
}, g = {
  key: 0,
  class: "tunnel-failure",
  role: "alert"
}, W = ["data-state"], B = {
  key: 0,
  class: "tunnel-address",
  "data-tunnel-address": ""
}, C = {
  key: 1,
  class: "tunnel-reason",
  "data-tunnel-reason": ""
}, N = {
  __name: "TunnelWindow",
  setup(l) {
    const r = { connected: "Connected", disconnected: "Not connected", reconnecting: "Reconnecting" }, s = m(), e = u(null), n = u("");
    async function p() {
      const a = await s.read("tunnel status");
      n.value = a.ok ? "" : a.error, e.value = a.ok ? a.value : null;
    }
    return p(), (a, R) => (t(), d(_(h), null, {
      default: f(() => [
        i("div", x, [
          n.value ? (t(), o("p", g, c(n.value), 1)) : e.value ? (t(), o(k, { key: 2 }, [
            i("p", {
              class: "tunnel-state",
              "data-state": e.value.state
            }, c(r[e.value.state] ?? e.value.state), 9, W),
            e.value.address ? (t(), o("p", B, c(e.value.address), 1)) : v("", !0),
            e.value.reason ? (t(), o("p", C, c(e.value.reason), 1)) : v("", !0)
          ], 64)) : (t(), d(_(y), {
            key: 1,
            shape: "text"
          }))
        ])
      ]),
      _: 1
    }));
  }
}, E = /* @__PURE__ */ w(N, [["__scopeId", "data-v-3c788d7c"]]);
export {
  E as default
};
