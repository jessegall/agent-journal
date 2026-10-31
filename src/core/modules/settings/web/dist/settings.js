/* @code-commandments-generated */
if (!document.getElementById("window-styles-b8928a44858e")) { const style = document.createElement("style"); style.id = "window-styles-b8928a44858e"; style.textContent = ".setting-group[data-v-b742c984]{display:flex;flex-direction:column;gap:6px}.setting-group-head[data-v-b742c984]{display:flex;align-items:center;gap:10px}.setting-group-title[data-v-b742c984]{margin:0;font-size:13px;font-weight:600}.setting-children[data-v-b742c984]{display:flex;flex-direction:column;gap:14px;padding-left:14px;border-left:1px solid var(--line)}.setting-children.off[data-v-b742c984]{opacity:.5}.setting-value[data-v-b742c984]{display:flex;flex-direction:column;gap:4px}.setting-label[data-v-b742c984]{font-size:12px;color:var(--text)}.setting-description[data-v-b742c984],.setting-shown[data-v-b742c984]{margin:0;font-size:12px;color:var(--text-3)}.setting-field[data-v-b742c984]{max-width:360px;padding:6px 10px;border:1px solid var(--line);border-radius:6px;color:var(--text);background:transparent}.setting-switch[data-v-b742c984]{align-self:flex-start;padding:2px 10px;border:1px solid var(--line);border-radius:10px;color:var(--text-2);background:transparent;font-size:11px}.setting-switch[aria-checked=true][data-v-b742c984]{color:var(--text);border-color:var(--accent)}.setting-choices[data-v-b742c984]{display:flex;gap:6px}.setting-refusal[data-v-b742c984]{margin:0;font-size:12px;color:var(--danger)}.settings[data-v-1c6e8e50]{display:flex;flex-direction:column;gap:18px}.settings-module[data-v-1c6e8e50]{display:flex;flex-direction:column;gap:14px}.settings-module-heading[data-v-1c6e8e50]{margin:0;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--text-3)}.settings-failure[data-v-1c6e8e50],.settings-empty[data-v-1c6e8e50]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as y, ref as N, openBlock as t, createElementBlock as a, createElementVNode as c, toDisplayString as l, createCommentVNode as b, normalizeClass as V, Fragment as k, renderList as O, createBlock as $, withDirectives as j, vModelText as p, unref as f, withCtx as q, createTextVNode as F } from "vue";
import { Btn as A, useRows as D } from "@journal/window-kit";
const B = (e, o) => {
  const d = e.__vccOpts || e;
  for (const [v, g] of o)
    d[v] = g;
  return d;
}, E = ["data-setting"], G = { class: "setting-group-head" }, I = { class: "setting-group-title" }, U = ["aria-checked"], z = { class: "setting-description" }, L = {
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
    const o = e, d = y(() => o.rows.filter((r) => r.parent === o.row.key)), v = y(() => o.row.type === "group"), g = y(() => o.row.scope === "project" ? ["--project"] : []), i = N(""), u = N("");
    async function w(r) {
      const s = await o.save(["setting", "set", o.row.key, String(r), ...g.value]);
      i.value = s.ok ? "" : s.error;
    }
    async function C() {
      const r = await o.save(["setting", "switch", o.row.key, o.row.value === !1 ? "on" : "off", "--project"]);
      i.value = r.ok ? "" : r.error;
    }
    function x(r) {
      w(r.target.value);
    }
    function S() {
      u.value && w(u.value).then(() => u.value = "");
    }
    return (r, s) => v.value ? (t(), a("section", {
      key: 0,
      class: "setting-group",
      "data-setting": e.row.key
    }, [
      c("div", G, [
        c("h3", I, l(e.row.title), 1),
        e.row.toggleable && !e.readOnly ? (t(), a("button", {
          key: 0,
          type: "button",
          class: "setting-switch",
          role: "switch",
          "aria-checked": e.row.value !== !1,
          "data-group-switch": "",
          onClick: C
        }, l(e.row.value === !1 ? "Off" : "On"), 9, U)) : b("", !0)
      ]),
      c("p", z, l(e.row.description), 1),
      c("div", {
        class: V(["setting-children", { off: e.row.value === !1 }])
      }, [
        (t(!0), a(k, null, O(d.value, (n) => (t(), $(T, {
          key: n.key,
          row: n,
          rows: e.rows,
          "read-only": e.readOnly,
          save: e.save
        }, null, 8, ["row", "rows", "read-only", "save"]))), 128))
      ], 2),
      i.value ? (t(), a("p", L, l(i.value), 1)) : b("", !0)
    ], 8, E)) : (t(), a("div", {
      key: 1,
      class: "setting-value",
      "data-setting": e.row.key
    }, [
      c("label", {
        class: "setting-label",
        for: e.row.key
      }, l(e.row.title), 9, R),
      c("p", W, l(e.row.description), 1),
      e.row.secret ? (t(), a(k, { key: 0 }, [
        c("p", H, l(e.row.shown), 1),
        j(c("input", {
          id: e.row.key,
          "onUpdate:modelValue": s[0] || (s[0] = (n) => u.value = n),
          class: "setting-field",
          type: "password",
          disabled: e.readOnly,
          placeholder: "Type a new value",
          onChange: S
        }, null, 40, J), [
          [p, u.value]
        ])
      ], 64)) : e.row.type === "flag" ? (t(), a("button", {
        key: 1,
        type: "button",
        class: "setting-switch",
        role: "switch",
        "aria-checked": e.row.value === !0,
        disabled: e.readOnly,
        onClick: s[1] || (s[1] = (n) => w(e.row.value === !0 ? "off" : "on"))
      }, l(e.row.value === !0 ? "On" : "Off"), 9, K)) : e.row.type === "choice" ? (t(), a("div", P, [
        (t(!0), a(k, null, O(e.row.choices, (n) => (t(), $(f(A), {
          key: n,
          small: "",
          kind: n === e.row.value ? "primary" : "ghost",
          "data-choice": n,
          disabled: e.readOnly,
          onClick: (h) => w(n)
        }, {
          default: q(() => [
            F(l(n), 1)
          ]),
          _: 2
        }, 1032, ["kind", "data-choice", "disabled", "onClick"]))), 128))
      ])) : (t(), a("input", {
        key: 3,
        id: e.row.key,
        class: "setting-field",
        type: e.row.type === "number" ? "number" : "text",
        value: e.row.type === "list" || e.row.type === "number list" ? e.row.shown : e.row.value,
        disabled: e.readOnly,
        onChange: x
      }, null, 40, Q)),
      i.value ? (t(), a("p", X, l(i.value), 1)) : b("", !0)
    ], 8, M));
  }
}, T = /* @__PURE__ */ B(Y, [["__scopeId", "data-v-b742c984"]]), Z = { class: "settings" }, _ = {
  key: 0,
  class: "settings-failure"
}, ee = {
  key: 1,
  class: "settings-empty"
}, te = ["data-module"], se = { class: "settings-module-heading" }, ne = {
  __name: "SettingsTree",
  setup(e) {
    const { rows: o, failure: d, loaded: v, load: g, context: i } = D("setting tree", ["setting.*"]), u = y(() => o.value.filter((s) => !s.key.endsWith(".*"))), w = y(() => u.value.filter((s) => s.parent === null)), C = y(() => [...new Set(w.value.map((s) => s.module))]), x = i.face === "phone";
    function S(s) {
      const n = s.split(".").at(-1).replace(/[-_]/g, " ");
      return n.charAt(0).toUpperCase() + n.slice(1);
    }
    async function r(s) {
      const n = await i.run(s);
      return n.ok && g(), n;
    }
    return (s, n) => (t(), a("div", Z, [
      f(d) ? (t(), a("p", _, l(f(d)), 1)) : f(v) && !f(o).length ? (t(), a("p", ee, "No module declares a setting.")) : b("", !0),
      (t(!0), a(k, null, O(C.value, (h) => (t(), a("section", {
        key: h,
        class: "settings-module",
        "data-module": h
      }, [
        c("h3", se, l(S(h)), 1),
        (t(!0), a(k, null, O(w.value.filter((m) => m.module === h), (m) => (t(), $(T, {
          key: m.key,
          row: m,
          rows: u.value,
          "read-only": x,
          save: r
        }, null, 8, ["row", "rows"]))), 128))
      ], 8, te))), 128))
    ]));
  }
}, le = /* @__PURE__ */ B(ne, [["__scopeId", "data-v-1c6e8e50"]]);
export {
  le as default
};
