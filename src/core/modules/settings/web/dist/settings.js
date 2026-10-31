/* @code-commandments-generated */
if (!document.getElementById("window-styles-fe3a1926159a")) { const style = document.createElement("style"); style.id = "window-styles-fe3a1926159a"; style.textContent = ".setting-group[data-v-b742c984]{display:flex;flex-direction:column;gap:6px}.setting-group-head[data-v-b742c984]{display:flex;align-items:center;gap:10px}.setting-group-title[data-v-b742c984]{margin:0;font-size:13px;font-weight:600}.setting-children[data-v-b742c984]{display:flex;flex-direction:column;gap:14px;padding-left:14px;border-left:1px solid var(--line)}.setting-children.off[data-v-b742c984]{opacity:.5}.setting-value[data-v-b742c984]{display:flex;flex-direction:column;gap:4px}.setting-label[data-v-b742c984]{font-size:12px;color:var(--text)}.setting-description[data-v-b742c984],.setting-shown[data-v-b742c984]{margin:0;font-size:12px;color:var(--text-3)}.setting-field[data-v-b742c984]{max-width:360px;padding:6px 10px;border:1px solid var(--line);border-radius:6px;color:var(--text);background:transparent}.setting-switch[data-v-b742c984]{align-self:flex-start;padding:2px 10px;border:1px solid var(--line);border-radius:10px;color:var(--text-2);background:transparent;font-size:11px}.setting-switch[aria-checked=true][data-v-b742c984]{color:var(--text);border-color:var(--accent)}.setting-choices[data-v-b742c984]{display:flex;gap:6px}.setting-refusal[data-v-b742c984]{margin:0;font-size:12px;color:var(--danger)}.settings[data-v-daedebf4]{display:flex;flex-direction:column;gap:18px}.settings-failure[data-v-daedebf4],.settings-empty[data-v-daedebf4]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as h, ref as S, openBlock as t, createElementBlock as s, createElementVNode as u, toDisplayString as l, createCommentVNode as k, normalizeClass as B, Fragment as m, renderList as x, createBlock as C, withDirectives as T, vModelText as V, unref as f, withCtx as j, createTextVNode as q } from "vue";
import { Btn as F, useRows as D } from "@journal/window-kit";
const N = (e, n) => {
  const w = e.__vccOpts || e;
  for (const [v, g] of n)
    w[v] = g;
  return w;
}, E = ["data-setting"], G = { class: "setting-group-head" }, I = { class: "setting-group-title" }, z = ["aria-checked"], A = { class: "setting-description" }, L = {
  key: 0,
  class: "setting-refusal"
}, M = ["data-setting"], R = ["for"], U = { class: "setting-description" }, W = { class: "setting-shown" }, H = ["id", "disabled"], J = ["aria-checked", "disabled"], K = {
  key: 2,
  class: "setting-choices"
}, P = ["id", "type", "value", "disabled"], Q = {
  key: 4,
  class: "setting-refusal"
}, X = {
  __name: "SettingNode",
  props: {
    row: { type: Object, required: !0 },
    rows: { type: Array, required: !0 },
    readOnly: { type: Boolean, required: !0 },
    save: { type: Function, required: !0 }
  },
  setup(e) {
    const n = e, w = h(() => n.rows.filter((a) => a.parent === n.row.key)), v = h(() => n.row.type === "group"), g = h(() => n.row.scope === "project" ? ["--project"] : []), i = S(""), c = S("");
    async function y(a) {
      const r = await n.save(["setting", "set", n.row.key, String(a), ...g.value]);
      i.value = r.ok ? "" : r.error;
    }
    async function b() {
      const a = await n.save(["setting", "switch", n.row.key, n.row.value === !1 ? "on" : "off", "--project"]);
      i.value = a.ok ? "" : a.error;
    }
    function O(a) {
      y(a.target.value);
    }
    function d() {
      c.value && y(c.value).then(() => c.value = "");
    }
    return (a, r) => v.value ? (t(), s("section", {
      key: 0,
      class: "setting-group",
      "data-setting": e.row.key
    }, [
      u("div", G, [
        u("h3", I, l(e.row.title), 1),
        e.row.toggleable && !e.readOnly ? (t(), s("button", {
          key: 0,
          type: "button",
          class: "setting-switch",
          role: "switch",
          "aria-checked": e.row.value !== !1,
          "data-group-switch": "",
          onClick: b
        }, l(e.row.value === !1 ? "Off" : "On"), 9, z)) : k("", !0)
      ]),
      u("p", A, l(e.row.description), 1),
      u("div", {
        class: B(["setting-children", { off: e.row.value === !1 }])
      }, [
        (t(!0), s(m, null, x(w.value, (o) => (t(), C($, {
          key: o.key,
          row: o,
          rows: e.rows,
          "read-only": e.readOnly,
          save: e.save
        }, null, 8, ["row", "rows", "read-only", "save"]))), 128))
      ], 2),
      i.value ? (t(), s("p", L, l(i.value), 1)) : k("", !0)
    ], 8, E)) : (t(), s("div", {
      key: 1,
      class: "setting-value",
      "data-setting": e.row.key
    }, [
      u("label", {
        class: "setting-label",
        for: e.row.key
      }, l(e.row.title), 9, R),
      u("p", U, l(e.row.description), 1),
      e.row.secret ? (t(), s(m, { key: 0 }, [
        u("p", W, l(e.row.shown), 1),
        T(u("input", {
          id: e.row.key,
          "onUpdate:modelValue": r[0] || (r[0] = (o) => c.value = o),
          class: "setting-field",
          type: "password",
          disabled: e.readOnly,
          placeholder: "Type a new value",
          onChange: d
        }, null, 40, H), [
          [V, c.value]
        ])
      ], 64)) : e.row.type === "flag" ? (t(), s("button", {
        key: 1,
        type: "button",
        class: "setting-switch",
        role: "switch",
        "aria-checked": e.row.value === !0,
        disabled: e.readOnly,
        onClick: r[1] || (r[1] = (o) => y(e.row.value === !0 ? "off" : "on"))
      }, l(e.row.value === !0 ? "On" : "Off"), 9, J)) : e.row.type === "choice" ? (t(), s("div", K, [
        (t(!0), s(m, null, x(e.row.choices, (o) => (t(), C(f(F), {
          key: o,
          small: "",
          kind: o === e.row.value ? "primary" : "ghost",
          "data-choice": o,
          disabled: e.readOnly,
          onClick: (ee) => y(o)
        }, {
          default: j(() => [
            q(l(o), 1)
          ]),
          _: 2
        }, 1032, ["kind", "data-choice", "disabled", "onClick"]))), 128))
      ])) : (t(), s("input", {
        key: 3,
        id: e.row.key,
        class: "setting-field",
        type: e.row.type === "number" ? "number" : "text",
        value: e.row.type === "list" || e.row.type === "number list" ? e.row.shown : e.row.value,
        disabled: e.readOnly,
        onChange: O
      }, null, 40, P)),
      i.value ? (t(), s("p", Q, l(i.value), 1)) : k("", !0)
    ], 8, M));
  }
}, $ = /* @__PURE__ */ N(X, [["__scopeId", "data-v-b742c984"]]), Y = { class: "settings" }, Z = {
  key: 0,
  class: "settings-failure"
}, p = {
  key: 1,
  class: "settings-empty"
}, _ = {
  __name: "SettingsTree",
  setup(e) {
    const { rows: n, failure: w, loaded: v, load: g, context: i } = D("setting tree", ["setting.*"]), c = h(() => n.value.filter((d) => !d.key.endsWith(".*"))), y = h(() => c.value.filter((d) => d.parent === null)), b = i.face === "phone";
    async function O(d) {
      const a = await i.run(d);
      return a.ok && g(), a;
    }
    return (d, a) => (t(), s("div", Y, [
      f(w) ? (t(), s("p", Z, l(f(w)), 1)) : f(v) && !f(n).length ? (t(), s("p", p, "No module declares a setting.")) : k("", !0),
      (t(!0), s(m, null, x(y.value, (r) => (t(), C($, {
        key: r.key,
        row: r,
        rows: c.value,
        "read-only": b,
        save: O
      }, null, 8, ["row", "rows"]))), 128))
    ]));
  }
}, ne = /* @__PURE__ */ N(_, [["__scopeId", "data-v-daedebf4"]]);
export {
  ne as default
};
