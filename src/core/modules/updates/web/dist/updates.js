/* @code-commandments-generated */
if (!document.getElementById("window-styles-fe200c1602d9")) { const style = document.createElement("style"); style.id = "window-styles-fe200c1602d9"; style.textContent = ".failure[data-v-2b34dc3e]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.standing[data-v-2b34dc3e],.release[data-v-2b34dc3e]{display:flex;align-items:baseline;gap:10px;font-size:13px}.line[data-v-2b34dc3e],.title[data-v-2b34dc3e]{flex:1}.heading[data-v-2b34dc3e]{margin:12px 0 6px;color:var(--text-3);font-size:12px;font-weight:600}.detail[data-v-2b34dc3e]{color:var(--text-3);font-size:12px}button[data-v-2b34dc3e]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as p, openBlock as u, createElementBlock as d, Fragment as k, unref as l, toDisplayString as r, createCommentVNode as v, createElementVNode as a, createVNode as h, withCtx as m } from "vue";
import { useRows as g, RowList as w } from "@journal/window-kit";
const y = (i, e) => {
  const t = i.__vccOpts || i;
  for (const [n, o] of e)
    t[n] = o;
  return t;
}, C = {
  key: 0,
  class: "failure"
}, b = { class: "standing" }, x = { class: "line" }, F = ["data-row"], N = { class: "title" }, I = { class: "detail" }, V = {
  __name: "UpdatesPanel",
  setup(i) {
    const e = g("release list", ["release.*"]), t = p(null), n = p("");
    async function o() {
      const s = await e.context.read("update check");
      t.value = s.ok ? s.value : null, n.value = s.ok ? "" : s.error;
    }
    async function f() {
      (await e.act(["update", "install"])).ok && await o();
    }
    return o(), (s, _) => (u(), d(k, null, [
      n.value || l(e).actionFailure.value ? (u(), d("p", C, r(n.value || l(e).actionFailure.value), 1)) : v("", !0),
      a("div", b, [
        a("span", x, r(t.value ? t.value.line : "Checking for a newer release"), 1),
        a("button", {
          type: "button",
          onClick: o
        }, "Check again"),
        t.value && !t.value.is_current ? (u(), d("button", {
          key: 0,
          type: "button",
          onClick: f
        }, "Install")) : v("", !0)
      ]),
      _[0] || (_[0] = a("h3", { class: "heading" }, "Installed releases", -1)),
      h(l(w), {
        rows: l(e).rows.value,
        failure: l(e).failure.value,
        loaded: l(e).loaded.value,
        empty: "No release installed from here yet"
      }, {
        default: m(({ row: c }) => [
          a("div", {
            class: "release",
            "data-row": c.id
          }, [
            a("span", N, r(c.tag || c.checksum.slice(0, 12)), 1),
            a("span", I, r(new Date(c.created_at).toLocaleString()), 1)
          ], 8, F)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ], 64));
  }
}, E = /* @__PURE__ */ y(V, [["__scopeId", "data-v-2b34dc3e"]]);
export {
  E as default
};
