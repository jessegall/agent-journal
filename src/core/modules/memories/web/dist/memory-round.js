/* @code-commandments-generated */
if (!document.getElementById("window-styles-c1ba9876e76a")) { const style = document.createElement("style"); style.id = "window-styles-c1ba9876e76a"; style.textContent = ".memory-dock[data-v-19bd84d7]{display:flex;gap:8px;font-size:12px;line-height:1.45}.memory-dock-weight[data-v-19bd84d7]{color:var(--text-4)}.memory-round[data-v-0779e035]{margin:0 0 0 20px}.memory-round-rows[data-v-0779e035]{margin:0;padding:0;list-style:none}.memory-round-row[data-v-0779e035]{display:flex;flex-wrap:wrap;gap:2px 8px;padding:2px 0;color:var(--text-2);font-size:12px;line-height:1.45;overflow-wrap:anywhere}.memory-round-ref[data-v-0779e035]{padding:0;border:0;background:none;color:var(--accent-text);font:inherit;cursor:pointer}.memory-round-weight[data-v-0779e035]{color:var(--text-4)}\n"; document.head.appendChild(style); }
import { computed as h, ref as v, openBlock as i, createElementBlock as d, Fragment as f, renderList as p, createBlock as y, unref as w, withCtx as b, createElementVNode as c, withModifiers as k, toDisplayString as g } from "vue";
import { useWindow as S, FoldGroup as x } from "@journal/window-kit";
import { _ as B } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const _ = { shown: "Still shown", faded: "Removed" };
function M(m) {
  const r = String(m || "").split(`
`).filter(Boolean).map((e) => e.split("|"));
  if (!r.length || r.some(([e, n, o, t]) => !_[e] || !n || o === void 0 || t === void 0)) return null;
  const a = ([e, , n, o]) => e === "faded" ? "faded out at weight 0" : `weight ${n} to ${o}`;
  return Object.entries(_).map(([e, n]) => ({ label: n, rows: r.filter(([o]) => o === e).map((o) => ({ id: Number(o[1]), change: a(o) })) })).filter((e) => e.rows.length);
}
const R = { class: "memory-round" }, $ = { class: "memory-round-rows" }, T = { class: "memory-round-weight" }, C = {
  __name: "MemoryRound",
  setup(m) {
    const r = S(), a = r.option("row"), e = h(() => {
      var t;
      return M((t = a.value) == null ? void 0 : t.lines) || [];
    }), n = v(/* @__PURE__ */ new Set());
    function o(t) {
      const s = new Set(n.value);
      s.delete(t) || s.add(t), n.value = s;
    }
    return (t, s) => (i(), d("div", R, [
      (i(!0), d(f, null, p(e.value, (l) => (i(), y(w(x), {
        key: l.label,
        label: l.label,
        count: l.rows.length,
        open: n.value.has(l.label),
        flush: "",
        onToggle: (u) => o(l.label)
      }, {
        default: b(() => [
          c("ul", $, [
            (i(!0), d(f, null, p(l.rows, (u) => (i(), d("li", {
              key: u.id,
              class: "memory-round-row"
            }, [
              c("button", {
                type: "button",
                class: "memory-round-ref",
                onClick: s[0] || (s[0] = k((E) => w(r).open("memories.list"), ["stop"]))
              }, "Memory " + g(u.id), 1),
              c("span", T, g(u.change), 1)
            ]))), 128))
          ])
        ]),
        _: 2
      }, 1032, ["label", "count", "open", "onToggle"]))), 128))
    ]));
  }
}, j = /* @__PURE__ */ B(C, [["__scopeId", "data-v-0779e035"]]);
export {
  j as default
};
