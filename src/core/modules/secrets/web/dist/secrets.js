/* @code-commandments-generated */
if (!document.getElementById("window-styles-0c4607825116")) { const style = document.createElement("style"); style.id = "window-styles-0c4607825116"; style.textContent = ".failure[data-v-573b80e5]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.secret[data-v-573b80e5]{display:flex;flex:1;flex-direction:column;gap:6px;font-size:13px}.head[data-v-573b80e5]{display:flex;align-items:baseline;gap:10px}.title[data-v-573b80e5]{flex:1;font-weight:600}.kind[data-v-573b80e5],.brief[data-v-573b80e5],.label[data-v-573b80e5]{color:var(--text-3);font-size:12px}.brief[data-v-573b80e5]{margin:0}.field[data-v-573b80e5]{display:flex;flex-direction:column;gap:4px}.field input[data-v-573b80e5]{padding:4px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px}.programs[data-v-573b80e5]{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px}button[data-v-573b80e5]{padding:2px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:inherit;font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { reactive as C, openBlock as l, createElementBlock as i, Fragment as f, unref as a, toDisplayString as r, createCommentVNode as v, createVNode as x, withCtx as N, createElementVNode as o, renderList as b, withModifiers as V, withDirectives as $, vModelDynamic as F } from "vue";
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
    const { rows: m, failure: u, loaded: y, act: d, actionFailure: k } = R("secret list", ["secret.*"]), p = C({}), c = (n, s) => `${n.id}:${s.name}`, g = (n, s) => n.filled.includes(s.name);
    async function S(n, s) {
      const e = (p[c(n, s)] || "").trim();
      if (!e) return;
      (await d(["secret", "fill", String(n.id), s.name, e])).ok && (p[c(n, s)] = "");
    }
    return (n, s) => (l(), i(f, null, [
      a(k) ? (l(), i("p", B, r(a(k)), 1)) : v("", !0),
      x(a(D), {
        rows: a(m),
        failure: a(u),
        loaded: a(y),
        empty: "No secrets yet"
      }, {
        default: N(({ row: e }) => [
          o("div", {
            class: "secret",
            "data-row": e.id
          }, [
            o("div", M, [
              o("span", U, r(e.title), 1),
              o("span", j, r(e.secret_type), 1)
            ]),
            e.brief ? (l(), i("p", A, r(e.brief), 1)) : v("", !0),
            (l(!0), i(f, null, b(e.fields, (t) => (l(), i("form", {
              key: t.name,
              class: "field",
              onSubmit: V((h) => S(e, t), ["prevent"])
            }, [
              o("label", {
                for: c(e, t)
              }, r(t.name), 9, O),
              $(o("input", {
                id: c(e, t),
                "onUpdate:modelValue": (h) => p[c(e, t)] = h,
                type: t.hidden ? "password" : "text",
                autocomplete: "off",
                placeholder: g(e, t) ? "Filled; type to replace it" : "Type the value"
              }, null, 8, P), [
                [F, p[c(e, t)]]
              ]),
              s[0] || (s[0] = o("button", { type: "submit" }, "Save", -1))
            ], 40, I))), 128)),
            o("div", T, [
              s[1] || (s[1] = o("span", { class: "label" }, "Programs", -1)),
              o("span", null, r(e.programs.length ? e.programs.join(", ") : "None allowed yet"), 1),
              (l(!0), i(f, null, b(e.proposed, (t) => (l(), i("button", {
                key: t,
                type: "button",
                onClick: (h) => a(d)(["secret", "allow", String(e.id), t])
              }, "Allow " + r(t), 9, q))), 128)),
              e.helpers ? v("", !0) : (l(), i("button", {
                key: 0,
                type: "button",
                onClick: (t) => a(d)(["secret", "allow", String(e.id), "--helpers"])
              }, "Let helpers use it", 8, z))
            ])
          ], 8, E)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ], 64));
  }
}, K = /* @__PURE__ */ L(G, [["__scopeId", "data-v-573b80e5"]]);
export {
  K as default
};
