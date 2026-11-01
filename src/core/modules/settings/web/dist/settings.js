/* @code-commandments-generated */
if (!document.getElementById("window-styles-e5e391fd9823")) { const style = document.createElement("style"); style.id = "window-styles-e5e391fd9823"; style.textContent = ".setting-group[data-v-c5025bda]{display:flex;flex-direction:column;gap:6px}.setting-group-head[data-v-c5025bda]{display:flex;align-items:center;gap:10px}.setting-group-title[data-v-c5025bda]{margin:0;font-size:13px;font-weight:600}.setting-children[data-v-c5025bda]{display:flex;flex-direction:column;gap:14px;padding-left:14px;border-left:1px solid var(--line)}.setting-children.off[data-v-c5025bda]{opacity:.5}.setting-value[data-v-c5025bda]{display:flex;flex-direction:column;gap:4px}.setting-label[data-v-c5025bda]{font-size:12px;color:var(--text)}.setting-description[data-v-c5025bda],.setting-shown[data-v-c5025bda]{margin:0;font-size:12px;color:var(--text-3)}.setting-field[data-v-c5025bda]{max-width:360px;padding:6px 10px;border:1px solid var(--line);border-radius:6px;color:var(--text);background:transparent}.setting-switch[data-v-c5025bda]{align-self:flex-start;padding:2px 10px;border:0;border-radius:10px;color:var(--text-2);background:var(--raised);font-size:11px;cursor:pointer}.setting-switch[aria-checked=true][data-v-c5025bda]{color:#fff;background:var(--accent)}.setting-choices[data-v-c5025bda]{display:flex;gap:6px}.setting-refusal[data-v-c5025bda]{margin:0;font-size:12px;color:var(--danger)}.settings[data-v-02633114]{display:flex;flex-direction:column;gap:16px}.settings-search-field[data-v-02633114]{width:100%;max-width:360px;padding:7px 12px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text)}.settings-body[data-v-02633114]{display:flex;gap:28px;align-items:flex-start}.settings-nav[data-v-02633114]{display:flex;flex:none;flex-direction:column;gap:2px;width:150px;position:sticky;top:0}.settings-nav-item[data-v-02633114]{padding:5px 10px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-align:left;cursor:pointer}.settings-nav-item[data-v-02633114]:hover{background:var(--hover);color:var(--text)}.settings-sections[data-v-02633114]{display:flex;flex:1;flex-direction:column;gap:32px;min-width:0}.settings-module[data-v-02633114]{display:flex;flex-direction:column;gap:18px}.settings-module-heading[data-v-02633114]{margin:0;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--text-3)}.settings-failure[data-v-02633114],.settings-empty[data-v-02633114]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as k, ref as N, openBlock as t, createElementBlock as s, createElementVNode as c, toDisplayString as u, createCommentVNode as j, normalizeClass as U, Fragment as b, renderList as $, createBlock as V, withDirectives as F, vModelText as T, unref as f, withCtx as D, createTextVNode as E } from "vue";
import { Btn as G, useRows as M, Skeleton as z } from "@journal/window-kit";
const I = (e, i) => {
  const h = e.__vccOpts || e;
  for (const [m, p] of i)
    h[m] = p;
  return h;
}, A = ["data-setting"], R = { class: "setting-group-head" }, W = { class: "setting-group-title" }, H = ["aria-checked"], J = { class: "setting-description" }, K = {
  key: 0,
  class: "setting-refusal"
}, P = ["data-setting"], Q = ["for"], X = { class: "setting-description" }, Y = { class: "setting-shown" }, Z = ["id", "disabled"], _ = ["aria-checked", "disabled"], ee = {
  key: 2,
  class: "setting-choices"
}, te = ["id", "type", "value", "disabled"], se = {
  key: 4,
  class: "setting-refusal"
}, ne = {
  __name: "SettingNode",
  props: {
    row: { type: Object, required: !0 },
    rows: { type: Array, required: !0 },
    readOnly: { type: Boolean, required: !0 },
    save: { type: Function, required: !0 }
  },
  setup(e) {
    const i = e, h = k(() => i.rows.filter((d) => d.parent === i.row.key)), m = k(() => i.row.type === "group"), p = k(() => i.row.scope === "project" ? ["--project"] : []), y = N(""), w = N("");
    async function v(d) {
      const g = ["setting", "set", i.row.key, String(d), ...p.value], a = await i.save(g);
      a.ok ? y.value = "" : y.value = a.error;
    }
    async function C() {
      const d = await i.save(["setting", "switch", i.row.key, i.row.value === !1 ? "on" : "off", "--project"]);
      y.value = d.ok ? "" : d.error;
    }
    function O(d) {
      v(d.target.value);
    }
    function S() {
      w.value && v(w.value).then(() => w.value = "");
    }
    return (d, g) => m.value ? (t(), s("section", {
      key: 0,
      class: "setting-group",
      "data-setting": e.row.key
    }, [
      c("div", R, [
        c("h3", W, u(e.row.title), 1),
        e.row.toggleable && !e.readOnly ? (t(), s("button", {
          key: 0,
          type: "button",
          class: "setting-switch",
          role: "switch",
          "aria-checked": e.row.value !== !1,
          "data-group-switch": "",
          onClick: C
        }, u(e.row.value === !1 ? "Off" : "On"), 9, H)) : j("", !0)
      ]),
      c("p", J, u(e.row.description), 1),
      c("div", {
        class: U(["setting-children", { off: e.row.value === !1 }])
      }, [
        (t(!0), s(b, null, $(h.value, (a) => (t(), V(L, {
          key: a.key,
          row: a,
          rows: e.rows,
          "read-only": e.readOnly,
          save: e.save
        }, null, 8, ["row", "rows", "read-only", "save"]))), 128))
      ], 2),
      y.value ? (t(), s("p", K, u(y.value), 1)) : j("", !0)
    ], 8, A)) : (t(), s("div", {
      key: 1,
      class: "setting-value",
      "data-setting": e.row.key
    }, [
      c("label", {
        class: "setting-label",
        for: e.row.key
      }, u(e.row.title), 9, Q),
      c("p", X, u(e.row.description), 1),
      e.row.secret ? (t(), s(b, { key: 0 }, [
        c("p", Y, u(e.row.shown), 1),
        F(c("input", {
          id: e.row.key,
          "onUpdate:modelValue": g[0] || (g[0] = (a) => w.value = a),
          class: "setting-field",
          type: "password",
          disabled: e.readOnly,
          placeholder: "Type a new value",
          onChange: S
        }, null, 40, Z), [
          [T, w.value]
        ])
      ], 64)) : e.row.type === "flag" ? (t(), s("button", {
        key: 1,
        type: "button",
        class: "setting-switch",
        role: "switch",
        "aria-checked": e.row.value === !0,
        disabled: e.readOnly,
        onClick: g[1] || (g[1] = (a) => v(e.row.value === !0 ? "off" : "on"))
      }, u(e.row.value === !0 ? "On" : "Off"), 9, _)) : e.row.type === "choice" ? (t(), s("div", ee, [
        (t(!0), s(b, null, $(e.row.choices, (a) => (t(), V(f(G), {
          key: a,
          small: "",
          kind: a === e.row.value ? "primary" : "ghost",
          "data-choice": a,
          disabled: e.readOnly,
          onClick: (B) => v(a)
        }, {
          default: D(() => [
            E(u(a), 1)
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
      }, null, 40, te)),
      y.value ? (t(), s("p", se, u(y.value), 1)) : j("", !0)
    ], 8, P));
  }
}, L = /* @__PURE__ */ I(ne, [["__scopeId", "data-v-c5025bda"]]), ae = { class: "settings" }, oe = { class: "settings-search" }, le = {
  key: 1,
  class: "settings-failure"
}, ie = {
  key: 2,
  class: "settings-empty"
}, re = { class: "settings-body" }, ce = {
  class: "settings-nav",
  "aria-label": "Modules"
}, ue = ["data-jump", "onClick"], de = { class: "settings-sections" }, ye = ["data-module"], ve = { class: "settings-module-heading" }, we = {
  __name: "SettingsTree",
  setup(e) {
    const { rows: i, failure: h, loaded: m, load: p, context: y } = M("setting tree", ["setting.*"]), w = N(""), v = k(() => i.value.filter((o) => !o.key.endsWith(".*"))), C = k(() => {
      const o = w.value.trim().toLowerCase();
      if (!o) return v.value;
      const r = v.value.filter((l) => [l.title, l.description, l.key].join(" ").toLowerCase().includes(o)), n = new Set(r.map((l) => l.key));
      for (const l of r)
        for (let x = v.value.find((q) => q.key === l.parent); x; x = v.value.find((q) => q.key === x.parent)) n.add(x.key);
      return v.value.filter((l) => n.has(l.key));
    }), O = k(() => C.value.filter((o) => o.parent === null)), S = k(() => [...new Set(O.value.map((o) => o.module))]), d = y.face === "phone";
    function g(o) {
      const r = o.split("."), n = r[r.length - 1].replace(/[-_]/g, " ");
      return n.slice(0, 1).toUpperCase() + n.slice(1);
    }
    function a(o) {
      var r;
      (r = document.querySelector(`[data-module="${o}"]`)) == null || r.scrollIntoView({ block: "start" });
    }
    async function B(o) {
      const r = await y.run(o);
      return r.ok && p(), r;
    }
    return (o, r) => (t(), s("div", ae, [
      c("label", oe, [
        F(c("input", {
          "onUpdate:modelValue": r[0] || (r[0] = (n) => w.value = n),
          class: "settings-search-field",
          type: "search",
          placeholder: "Find a setting",
          "aria-label": "Find a setting"
        }, null, 512), [
          [T, w.value]
        ])
      ]),
      f(m) ? f(h) ? (t(), s("p", le, u(f(h)), 1)) : f(m) && !f(i).length ? (t(), s("p", ie, "No module declares a setting.")) : j("", !0) : (t(), V(f(z), {
        key: 0,
        shape: "text"
      })),
      c("div", re, [
        c("nav", ce, [
          (t(!0), s(b, null, $(S.value, (n) => (t(), s("button", {
            key: n,
            type: "button",
            class: "settings-nav-item",
            "data-jump": n,
            onClick: (l) => a(n)
          }, u(g(n)), 9, ue))), 128))
        ]),
        c("div", de, [
          (t(!0), s(b, null, $(S.value, (n) => (t(), s("section", {
            key: n,
            class: "settings-module",
            "data-module": n
          }, [
            c("h3", ve, u(g(n)), 1),
            (t(!0), s(b, null, $(O.value.filter((l) => l.module === n), (l) => (t(), V(L, {
              key: l.key,
              row: l,
              rows: C.value,
              "read-only": d,
              save: B
            }, null, 8, ["row", "rows"]))), 128))
          ], 8, ye))), 128))
        ])
      ])
    ]));
  }
}, fe = /* @__PURE__ */ I(we, [["__scopeId", "data-v-02633114"]]);
export {
  fe as default
};
