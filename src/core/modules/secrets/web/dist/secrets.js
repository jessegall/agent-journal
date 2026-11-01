/* @code-commandments-generated */
if (!document.getElementById("window-styles-5f642085b986")) { const style = document.createElement("style"); style.id = "window-styles-5f642085b986"; style.textContent = ".failure[data-v-2cadb11b]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.secret[data-v-2cadb11b]{display:flex;flex:1;flex-direction:column;gap:6px;font-size:13px}.head[data-v-2cadb11b]{display:flex;align-items:baseline;gap:10px}.title[data-v-2cadb11b]{flex:1;font-weight:600}.kind[data-v-2cadb11b],.brief[data-v-2cadb11b],.label[data-v-2cadb11b]{color:var(--text-3);font-size:12px}.brief[data-v-2cadb11b]{margin:0}.field[data-v-2cadb11b]{display:flex;flex-direction:column;gap:4px}.field input[data-v-2cadb11b]{padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px}.programs[data-v-2cadb11b]{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px}button[data-v-2cadb11b]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { reactive as C, openBlock as l, createElementBlock as a, Fragment as f, unref as i, toDisplayString as c, createCommentVNode as v, createVNode as x, withCtx as N, createElementVNode as o, renderList as k, withModifiers as V, withDirectives as $, vModelDynamic as F } from "vue";
import { useRows as R, RowList as D } from "@journal/window-kit";
const L = (_, m) => {
  const u = _.__vccOpts || _;
  for (const [y, d] of m)
    u[y] = d;
  return u;
}, B = {
  key: 0,
  class: "failure"
}, E = ["data-row"], M = { class: "head" }, U = { class: "title" }, j = { class: "kind" }, A = {
  key: 0,
  class: "brief"
}, I = ["onSubmit"], O = ["for"], P = ["id", "onUpdate:modelValue", "type", "placeholder"], T = { class: "programs" }, q = ["onClick"], z = ["onClick"], G = {
  __name: "SecretRows",
  setup(_) {
    const { rows: m, failure: u, loaded: y, act: d, actionFailure: b } = R("secret list", ["secret.*"]), p = C({}), r = (n, s) => `${n.id}:${s.name}`, g = (n, s) => n.filled.includes(s.name);
    async function S(n, s) {
      const e = (p[r(n, s)] || "").trim();
      if (!e) return;
      (await d(["secret", "fill", String(n.id), s.name, e])).ok && (p[r(n, s)] = "");
    }
    return (n, s) => (l(), a(f, null, [
      i(b) ? (l(), a("p", B, c(i(b)), 1)) : v("", !0),
      x(i(D), {
        rows: i(m),
        failure: i(u),
        loaded: i(y),
        empty: "No secrets yet"
      }, {
        default: N(({ row: e }) => [
          o("div", {
            class: "secret",
            "data-row": e.id
          }, [
            o("div", M, [
              o("span", U, c(e.title), 1),
              o("span", j, c(e.secret_type), 1)
            ]),
            e.brief ? (l(), a("p", A, c(e.brief), 1)) : v("", !0),
            (l(!0), a(f, null, k(e.fields, (t) => (l(), a("form", {
              key: t.name,
              class: "field",
              onSubmit: V((h) => S(e, t), ["prevent"])
            }, [
              o("label", {
                for: r(e, t)
              }, c(t.name), 9, O),
              $(o("input", {
                id: r(e, t),
                "onUpdate:modelValue": (h) => p[r(e, t)] = h,
                type: t.hidden ? "password" : "text",
                autocomplete: "off",
                placeholder: g(e, t) ? "Filled; type to replace it" : "Type the value"
              }, null, 8, P), [
                [F, p[r(e, t)]]
              ]),
              s[0] || (s[0] = o("button", { type: "submit" }, "Save", -1))
            ], 40, I))), 128)),
            o("div", T, [
              s[1] || (s[1] = o("span", { class: "label" }, "Programs", -1)),
              o("span", null, c(e.programs.length ? e.programs.join(", ") : "None allowed yet"), 1),
              (l(!0), a(f, null, k(e.proposed, (t) => (l(), a("button", {
                key: t,
                type: "button",
                onClick: (h) => i(d)(["secret", "allow", String(e.id), t])
              }, " Allow " + c(t), 9, q))), 128)),
              e.helpers ? v("", !0) : (l(), a("button", {
                key: 0,
                type: "button",
                onClick: (t) => i(d)(["secret", "allow", String(e.id), "--helpers"])
              }, "Let helpers use it", 8, z))
            ])
          ], 8, E)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ], 64));
  }
}, K = /* @__PURE__ */ L(G, [["__scopeId", "data-v-2cadb11b"]]);
export {
  K as default
};
