/* @code-commandments-generated */
if (!document.getElementById("window-styles-c766f4aaa214")) { const style = document.createElement("style"); style.id = "window-styles-c766f4aaa214"; style.textContent = ".memories[data-v-b76e1645],.memories-form[data-v-b76e1645]{display:flex;flex-direction:column;gap:8px}.memories-form[data-v-b76e1645]{align-items:flex-start}.memories-form textarea[data-v-b76e1645]{width:100%}.memories-refusal[data-v-b76e1645]{margin:0;color:var(--danger);font-size:12.5px}.memory[data-v-b76e1645]{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0;padding:4px 0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.memory-kind[data-v-b76e1645]{color:var(--text-3);font-size:12px}.memories-page[data-v-e72d53ed]{display:flex;flex-direction:column;gap:8px;align-items:flex-start}.memories-page[data-v-e72d53ed]>.memories{align-self:stretch}.memory-dock[data-v-19bd84d7]{display:flex;gap:8px;font-size:12px;line-height:1.45}.memory-dock-weight[data-v-19bd84d7]{color:var(--text-4)}.memory-round[data-v-03fe1c3a]{margin:0 0 0 20px}.memory-round-rows[data-v-03fe1c3a]{margin:0;padding:0;list-style:none}.memory-round-row[data-v-03fe1c3a]{display:flex;flex-wrap:wrap;gap:2px 8px;padding:2px 0;color:var(--text-2);font-size:12px;line-height:1.45;overflow-wrap:anywhere}.memory-round-ref[data-v-03fe1c3a]{padding:0;border:0;background:none;color:var(--accent-text);font:inherit;cursor:pointer}.memory-round-weight[data-v-03fe1c3a]{color:var(--text-4)}\n"; document.head.appendChild(style); }
import { computed as g, ref as v, openBlock as l, createElementBlock as a, Fragment as f, renderList as p, createBlock as y, unref as _, withCtx as b, createElementVNode as u, withModifiers as k, toDisplayString as w } from "vue";
import { useWindow as S, FoldGroup as x, peekRef as R } from "@journal/window-kit";
import { _ as $ } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const h = { shown: "Still shown", faded: "Removed" };
function B(m) {
  const d = String(m || "").split(`
`).filter(Boolean).map((e) => e.split("|"));
  if (!d.length || d.some(([e, t, o, n]) => !h[e] || !t || o === void 0 || n === void 0)) return null;
  const c = ([e, , t, o]) => e === "faded" ? "faded out at weight 0" : `weight ${t} to ${o}`;
  return Object.entries(h).map(([e, t]) => ({ label: t, rows: d.filter(([o]) => o === e).map((o) => ({ id: Number(o[1]), change: c(o) })) })).filter((e) => e.rows.length);
}
const M = { class: "memory-round" }, C = { class: "memory-round-rows" }, T = ["data-memory-ref", "onClick"], E = { class: "memory-round-weight" }, F = {
  __name: "MemoryRound",
  setup(m) {
    const c = S().option("row"), e = g(() => {
      var n;
      return B((n = c.value) == null ? void 0 : n.lines) || [];
    }), t = v(/* @__PURE__ */ new Set());
    function o(n) {
      const i = new Set(t.value);
      i.delete(n) || i.add(n), t.value = i;
    }
    return (n, i) => (l(), a("div", M, [
      (l(!0), a(f, null, p(e.value, (r) => (l(), y(_(x), {
        key: r.label,
        label: r.label,
        count: r.rows.length,
        open: t.value.has(r.label),
        flush: "",
        onToggle: (s) => o(r.label)
      }, {
        default: b(() => [
          u("ul", C, [
            (l(!0), a(f, null, p(r.rows, (s) => (l(), a("li", {
              key: s.id,
              class: "memory-round-row"
            }, [
              u("button", {
                type: "button",
                class: "memory-round-ref",
                "data-memory-ref": s.id,
                onClick: k((N) => _(R)(`memories:${s.id}`), ["stop"])
              }, "Memory " + w(s.id), 9, T),
              u("span", E, w(s.change), 1)
            ]))), 128))
          ])
        ]),
        _: 2
      }, 1032, ["label", "count", "open", "onToggle"]))), 128))
    ]));
  }
}, D = /* @__PURE__ */ $(F, [["__scopeId", "data-v-03fe1c3a"]]);
export {
  D as default
};
