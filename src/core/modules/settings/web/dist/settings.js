/* @code-commandments-generated */
if (!document.getElementById("window-styles-bd001a6ce606")) { const style = document.createElement("style"); style.id = "window-styles-bd001a6ce606"; style.textContent = ".setting-group[data-v-cde8b6bc]{display:flex;flex-direction:column;gap:6px}.setting-group-head[data-v-cde8b6bc]{display:flex;align-items:center;gap:10px}.setting-group-title[data-v-cde8b6bc]{margin:0;font-size:13px;font-weight:600}.setting-children[data-v-cde8b6bc]{display:flex;flex-direction:column;gap:14px;padding-left:14px;border-left:1px solid var(--line)}.setting-children.off[data-v-cde8b6bc]{opacity:.5}.setting-value[data-v-cde8b6bc]{display:flex;flex-direction:column;gap:4px}.setting-label[data-v-cde8b6bc]{font-size:12px;color:var(--text)}.setting-description[data-v-cde8b6bc],.setting-shown[data-v-cde8b6bc]{margin:0;font-size:12px;color:var(--text-3)}.setting-field[data-v-cde8b6bc]{max-width:360px;padding:6px 10px;border:1px solid var(--line);border-radius:6px;color:var(--text);background:transparent}.setting-switch[data-v-cde8b6bc]{align-self:flex-start;padding:2px 10px;border:1px solid var(--line);border-radius:10px;color:var(--text-2);background:transparent;font-size:11px}.setting-switch[aria-checked=true][data-v-cde8b6bc]{color:var(--text);border-color:var(--accent)}.setting-choices[data-v-cde8b6bc]{display:flex;gap:6px}.setting-refusal[data-v-cde8b6bc]{margin:0;font-size:12px;color:var(--danger)}.settings[data-v-7750b7eb]{display:flex;flex-direction:column;gap:18px}.settings-module[data-v-7750b7eb]{display:flex;flex-direction:column;gap:14px}.settings-module-heading[data-v-7750b7eb]{margin:0;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--text-3)}.settings-failure[data-v-7750b7eb],.settings-empty[data-v-7750b7eb]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as v, ref as N, openBlock as s, createElementBlock as a, createElementVNode as c, toDisplayString as l, createCommentVNode as b, normalizeClass as T, Fragment as k, renderList as O, createBlock as $, withDirectives as V, vModelText as j, unref as f, withCtx as q, createTextVNode as F } from "vue";
import { Btn as D, useRows as E } from "@journal/window-kit";
const p = (e, o) => {
  const w = e.__vccOpts || e;
  for (const [g, h] of o)
    w[g] = h;
  return w;
}, G = ["data-setting"], I = { class: "setting-group-head" }, U = { class: "setting-group-title" }, z = ["aria-checked"], A = { class: "setting-description" }, L = {
  key: 0,
  class: "setting-refusal"
}, M = ["data-setting"], R = ["for"], W = { class: "setting-description" }, H = { class: "setting-shown" }, J = ["id", "disabled"], K = ["aria-checked", "disabled"], P = {
  key: 2,
  class: "setting-choices"
}, Q = ["id", "type", "value", "disabled"], X = {
  key: 4,
  class: "setting-refusal"
}, Y = {
  __name: "SettingNode",
  props: {
    row: { type: Object, required: !0 },
    rows: { type: Array, required: !0 },
    readOnly: { type: Boolean, required: !0 },
    save: { type: Function, required: !0 }
  },
  setup(e) {
    const o = e, w = v(() => o.rows.filter((r) => r.parent === o.row.key)), g = v(() => o.row.type === "group"), h = v(() => o.row.scope === "project" ? ["--project"] : []), i = N(""), u = N("");
    async function y(r) {
      const n = ["setting", "set", o.row.key, String(r), ...h.value], t = await o.save(n);
      t.ok ? i.value = "" : i.value = t.error;
    }
    async function C() {
      const r = await o.save(["setting", "switch", o.row.key, o.row.value === !1 ? "on" : "off", "--project"]);
      i.value = r.ok ? "" : r.error;
    }
    function x(r) {
      y(r.target.value);
    }
    function S() {
      u.value && y(u.value).then(() => u.value = "");
    }
    return (r, n) => g.value ? (s(), a("section", {
      key: 0,
      class: "setting-group",
      "data-setting": e.row.key
    }, [
      c("div", I, [
        c("h3", U, l(e.row.title), 1),
        e.row.toggleable && !e.readOnly ? (s(), a("button", {
          key: 0,
          type: "button",
          class: "setting-switch",
          role: "switch",
          "aria-checked": e.row.value !== !1,
          "data-group-switch": "",
          onClick: C
        }, l(e.row.value === !1 ? "Off" : "On"), 9, z)) : b("", !0)
      ]),
      c("p", A, l(e.row.description), 1),
      c("div", {
        class: T(["setting-children", { off: e.row.value === !1 }])
      }, [
        (s(!0), a(k, null, O(w.value, (t) => (s(), $(B, {
          key: t.key,
          row: t,
          rows: e.rows,
          "read-only": e.readOnly,
          save: e.save
        }, null, 8, ["row", "rows", "read-only", "save"]))), 128))
      ], 2),
      i.value ? (s(), a("p", L, l(i.value), 1)) : b("", !0)
    ], 8, G)) : (s(), a("div", {
      key: 1,
      class: "setting-value",
      "data-setting": e.row.key
    }, [
      c("label", {
        class: "setting-label",
        for: e.row.key
      }, l(e.row.title), 9, R),
      c("p", W, l(e.row.description), 1),
      e.row.secret ? (s(), a(k, { key: 0 }, [
        c("p", H, l(e.row.shown), 1),
        V(c("input", {
          id: e.row.key,
          "onUpdate:modelValue": n[0] || (n[0] = (t) => u.value = t),
          class: "setting-field",
          type: "password",
          disabled: e.readOnly,
          placeholder: "Type a new value",
          onChange: S
        }, null, 40, J), [
          [j, u.value]
        ])
      ], 64)) : e.row.type === "flag" ? (s(), a("button", {
        key: 1,
        type: "button",
        class: "setting-switch",
        role: "switch",
        "aria-checked": e.row.value === !0,
        disabled: e.readOnly,
        onClick: n[1] || (n[1] = (t) => y(e.row.value === !0 ? "off" : "on"))
      }, l(e.row.value === !0 ? "On" : "Off"), 9, K)) : e.row.type === "choice" ? (s(), a("div", P, [
        (s(!0), a(k, null, O(e.row.choices, (t) => (s(), $(f(D), {
          key: t,
          small: "",
          kind: t === e.row.value ? "primary" : "ghost",
          "data-choice": t,
          disabled: e.readOnly,
          onClick: (d) => y(t)
        }, {
          default: q(() => [
            F(l(t), 1)
          ]),
          _: 2
        }, 1032, ["kind", "data-choice", "disabled", "onClick"]))), 128))
      ])) : (s(), a("input", {
        key: 3,
        id: e.row.key,
        class: "setting-field",
        type: e.row.type === "number" ? "number" : "text",
        value: e.row.type === "list" || e.row.type === "number list" ? e.row.shown : e.row.value,
        disabled: e.readOnly,
        onChange: x
      }, null, 40, Q)),
      i.value ? (s(), a("p", X, l(i.value), 1)) : b("", !0)
    ], 8, M));
  }
}, B = /* @__PURE__ */ p(Y, [["__scopeId", "data-v-cde8b6bc"]]), Z = { class: "settings" }, _ = {
  key: 0,
  class: "settings-failure"
}, ee = {
  key: 1,
  class: "settings-empty"
}, te = ["data-module"], se = { class: "settings-module-heading" }, ne = {
  __name: "SettingsTree",
  setup(e) {
    const { rows: o, failure: w, loaded: g, load: h, context: i } = E("setting tree", ["setting.*"]), u = v(() => o.value.filter((n) => !n.key.endsWith(".*"))), y = v(() => u.value.filter((n) => n.parent === null)), C = v(() => [...new Set(y.value.map((n) => n.module))]), x = i.face === "phone";
    function S(n) {
      const t = n.split("."), d = t[t.length - 1].replace(/[-_]/g, " ");
      return d.slice(0, 1).toUpperCase() + d.slice(1);
    }
    async function r(n) {
      const t = await i.run(n);
      return t.ok && h(), t;
    }
    return (n, t) => (s(), a("div", Z, [
      f(w) ? (s(), a("p", _, l(f(w)), 1)) : f(g) && !f(o).length ? (s(), a("p", ee, "No module declares a setting.")) : b("", !0),
      (s(!0), a(k, null, O(C.value, (d) => (s(), a("section", {
        key: d,
        class: "settings-module",
        "data-module": d
      }, [
        c("h3", se, l(S(d)), 1),
        (s(!0), a(k, null, O(y.value.filter((m) => m.module === d), (m) => (s(), $(B, {
          key: m.key,
          row: m,
          rows: u.value,
          "read-only": x,
          save: r
        }, null, 8, ["row", "rows"]))), 128))
      ], 8, te))), 128))
    ]));
  }
}, le = /* @__PURE__ */ p(ne, [["__scopeId", "data-v-7750b7eb"]]);
export {
  le as default
};
