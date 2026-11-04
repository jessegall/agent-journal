/* @code-commandments-generated */
if (!document.getElementById("window-styles-a2ea90c3ce0a")) { const style = document.createElement("style"); style.id = "window-styles-a2ea90c3ce0a"; style.textContent = ".rule-dock[data-v-b89aea04]{margin:0;padding:8px 10px;border:1px solid var(--warn);border-radius:8px;background:color-mix(in srgb,var(--warn) 12%,transparent);color:var(--text);font-size:13px;line-height:1.5}\n"; document.head.appendChild(style); }
import { ref as s, watch as l, openBlock as u, createElementBlock as _, toDisplayString as i } from "vue";
import { useWindow as d } from "@journal/window-kit";
const p = (c, o) => {
  const e = c.__vccOpts || c;
  for (const [a, r] of o)
    e[a] = r;
  return e;
}, m = {
  class: "rule-dock",
  "data-rule-dock": ""
}, f = {
  __name: "RuleDock",
  setup(c) {
    const o = d(), e = o.option("row"), a = s(null);
    async function r() {
      const t = await o.read(`rule show ${e.value.target_id}`);
      a.value = t.ok ? t.value : null;
    }
    return l(() => {
      var t;
      return (t = e.value) == null ? void 0 : t.target_id;
    }, r, { immediate: !0 }), (t, k) => {
      var n;
      return u(), _("p", m, i((n = a.value) == null ? void 0 : n.text), 1);
    };
  }
}, x = /* @__PURE__ */ p(f, [["__scopeId", "data-v-b89aea04"]]);
export {
  x as default
};
