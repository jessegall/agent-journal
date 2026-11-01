/* @code-commandments-generated */
if (!document.getElementById("window-styles-b726a70dbd95")) { const style = document.createElement("style"); style.id = "window-styles-b726a70dbd95"; style.textContent = ".setting-group[data-v-68a9dfc2]{display:flex;flex-direction:column;gap:6px}.setting-group-head[data-v-68a9dfc2]{display:flex;align-items:center;gap:10px}.setting-group-title[data-v-68a9dfc2]{margin:0;font-size:13px;font-weight:600}.setting-children[data-v-68a9dfc2]{display:flex;flex-direction:column;gap:14px;padding-left:14px;border-left:1px solid var(--line)}.setting-children.off[data-v-68a9dfc2]{opacity:.5}.setting-value[data-v-68a9dfc2]{display:flex;flex-direction:column;gap:4px}.setting-label[data-v-68a9dfc2]{font-size:12px;color:var(--text)}.setting-description[data-v-68a9dfc2],.setting-shown[data-v-68a9dfc2]{margin:0;font-size:12px;color:var(--text-3)}.setting-field[data-v-68a9dfc2]{max-width:360px;padding:6px 10px;border:1px solid var(--line);border-radius:6px;color:var(--text);background:transparent}.setting-switch[data-v-68a9dfc2]{align-self:flex-start;padding:2px 10px;border:0;border-radius:10px;color:var(--text-2);background:var(--raised);font-size:11px;cursor:pointer}.setting-switch[aria-checked=true][data-v-68a9dfc2]{color:#fff;background:var(--accent)}.setting-choices[data-v-68a9dfc2]{display:flex;gap:6px}.setting-refusal[data-v-68a9dfc2]{margin:0;font-size:12px;color:var(--danger)}.settings[data-v-02633114]{display:flex;flex-direction:column;gap:16px}.settings-search-field[data-v-02633114]{width:100%;max-width:360px;padding:7px 12px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text)}.settings-body[data-v-02633114]{display:flex;gap:28px;align-items:flex-start}.settings-nav[data-v-02633114]{display:flex;flex:none;flex-direction:column;gap:2px;width:150px;position:sticky;top:0}.settings-nav-item[data-v-02633114]{padding:5px 10px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-align:left;cursor:pointer}.settings-nav-item[data-v-02633114]:hover{background:var(--hover);color:var(--text)}.settings-sections[data-v-02633114]{display:flex;flex:1;flex-direction:column;gap:32px;min-width:0}.settings-module[data-v-02633114]{display:flex;flex-direction:column;gap:18px}.settings-module-heading[data-v-02633114]{margin:0;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--text-3)}.settings-failure[data-v-02633114],.settings-empty[data-v-02633114]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as k, ref as N, openBlock as t, createElementBlock as a, createElementVNode as c, toDisplayString as d, createBlock as b, unref as f, createCommentVNode as V, normalizeClass as D, Fragment as $, renderList as C, withDirectives as T, vModelText as I, withCtx as E, createTextVNode as G } from "vue";
import { Switch as F, Btn as M, useRows as z, Skeleton as A } from "@journal/window-kit";
const L = (e, i) => {
  const h = e.__vccOpts || e;
  for (const [m, p] of i)
    h[m] = p;
  return h;
}, R = ["data-setting"], W = { class: "setting-group-head" }, H = { class: "setting-group-title" }, J = { class: "setting-description" }, K = {
  key: 0,
  class: "setting-refusal"
}, P = ["data-setting"], Q = ["for"], X = { class: "setting-description" }, Y = { class: "setting-shown" }, Z = ["id", "disabled"], _ = {
  key: 2,
  class: "setting-choices"
}, ee = ["id", "type", "value", "disabled"], te = {
  key: 4,
  class: "setting-refusal"
}, se = {
  __name: "SettingNode",
  props: {
    row: { type: Object, required: !0 },
    rows: { type: Array, required: !0 },
    readOnly: { type: Boolean, required: !0 },
    save: { type: Function, required: !0 }
  },
  setup(e) {
    const i = e, h = k(() => i.rows.filter((u) => u.parent === i.row.key)), m = k(() => i.row.type === "group"), p = k(() => i.row.scope === "project" ? ["--project"] : []), y = N(""), w = N("");
    async function v(u) {
      const g = ["setting", "set", i.row.key, String(u), ...p.value], s = await i.save(g);
      s.ok ? y.value = "" : y.value = s.error;
    }
    async function S() {
      const u = await i.save(["setting", "switch", i.row.key, i.row.value === !1 ? "on" : "off", "--project"]);
      y.value = u.ok ? "" : u.error;
    }
    function O(u) {
      v(u.target.value);
    }
    function x() {
      w.value && v(w.value).then(() => w.value = "");
    }
    return (u, g) => m.value ? (t(), a("section", {
      key: 0,
      class: "setting-group",
      "data-setting": e.row.key
    }, [
      c("div", W, [
        c("h3", H, d(e.row.title), 1),
        e.row.toggleable && !e.readOnly ? (t(), b(f(F), {
          key: 0,
          on: e.row.value !== !1,
          title: `Switch ${e.row.title} ${e.row.value === !1 ? "on" : "off"}`,
          "data-group-switch": "",
          onChange: S
        }, null, 8, ["on", "title"])) : V("", !0)
      ]),
      c("p", J, d(e.row.description), 1),
      c("div", {
        class: D(["setting-children", { off: e.row.value === !1 }])
      }, [
        (t(!0), a($, null, C(h.value, (s) => (t(), b(U, {
          key: s.key,
          row: s,
          rows: e.rows,
          "read-only": e.readOnly,
          save: e.save
        }, null, 8, ["row", "rows", "read-only", "save"]))), 128))
      ], 2),
      y.value ? (t(), a("p", K, d(y.value), 1)) : V("", !0)
    ], 8, R)) : (t(), a("div", {
      key: 1,
      class: "setting-value",
      "data-setting": e.row.key
    }, [
      c("label", {
        class: "setting-label",
        for: e.row.key
      }, d(e.row.title), 9, Q),
      c("p", X, d(e.row.description), 1),
      e.row.secret ? (t(), a($, { key: 0 }, [
        c("p", Y, d(e.row.shown), 1),
        T(c("input", {
          id: e.row.key,
          "onUpdate:modelValue": g[0] || (g[0] = (s) => w.value = s),
          class: "setting-field",
          type: "password",
          disabled: e.readOnly,
          placeholder: "Type a new value",
          onChange: x
        }, null, 40, Z), [
          [I, w.value]
        ])
      ], 64)) : e.row.type === "flag" ? (t(), b(f(F), {
        key: 1,
        on: e.row.value === !0,
        title: e.row.title,
        disabled: e.readOnly,
        "data-flag-switch": "",
        onChange: g[1] || (g[1] = (s) => !e.readOnly && v(s ? "on" : "off"))
      }, null, 8, ["on", "title", "disabled"])) : e.row.type === "choice" ? (t(), a("div", _, [
        (t(!0), a($, null, C(e.row.choices, (s) => (t(), b(f(M), {
          key: s,
          small: "",
          kind: s === e.row.value ? "primary" : "ghost",
          "data-choice": s,
          disabled: e.readOnly,
          onClick: (B) => v(s)
        }, {
          default: E(() => [
            G(d(s), 1)
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
        onChange: O
      }, null, 40, ee)),
      y.value ? (t(), a("p", te, d(y.value), 1)) : V("", !0)
    ], 8, P));
  }
}, U = /* @__PURE__ */ L(se, [["__scopeId", "data-v-68a9dfc2"]]), ne = { class: "settings" }, ae = { class: "settings-search" }, le = {
  key: 1,
  class: "settings-failure"
}, oe = {
  key: 2,
  class: "settings-empty"
}, ie = { class: "settings-body" }, re = {
  class: "settings-nav",
  "aria-label": "Modules"
}, ce = ["data-jump", "onClick"], ue = { class: "settings-sections" }, de = ["data-module"], ye = { class: "settings-module-heading" }, ve = {
  __name: "SettingsTree",
  setup(e) {
    const { rows: i, failure: h, loaded: m, load: p, context: y } = z("setting tree", ["setting.*"]), w = N(""), v = k(() => i.value.filter((l) => !l.key.endsWith(".*"))), S = k(() => {
      const l = w.value.trim().toLowerCase();
      if (!l) return v.value;
      const r = v.value.filter((o) => [o.title, o.description, o.key].join(" ").toLowerCase().includes(l)), n = new Set(r.map((o) => o.key));
      for (const o of r)
        for (let j = v.value.find((q) => q.key === o.parent); j; j = v.value.find((q) => q.key === j.parent)) n.add(j.key);
      return v.value.filter((o) => n.has(o.key));
    }), O = k(() => S.value.filter((l) => l.parent === null)), x = k(() => [...new Set(O.value.map((l) => l.module))]), u = y.face === "phone";
    function g(l) {
      const r = l.split("."), n = r[r.length - 1].replace(/[-_]/g, " ");
      return n.slice(0, 1).toUpperCase() + n.slice(1);
    }
    function s(l) {
      var r;
      (r = document.querySelector(`[data-module="${l}"]`)) == null || r.scrollIntoView({ block: "start" });
    }
    async function B(l) {
      const r = await y.run(l);
      return r.ok && p(), r;
    }
    return (l, r) => (t(), a("div", ne, [
      c("label", ae, [
        T(c("input", {
          "onUpdate:modelValue": r[0] || (r[0] = (n) => w.value = n),
          class: "settings-search-field",
          type: "search",
          placeholder: "Find a setting",
          "aria-label": "Find a setting"
        }, null, 512), [
          [I, w.value]
        ])
      ]),
      f(m) ? f(h) ? (t(), a("p", le, d(f(h)), 1)) : f(m) && !f(i).length ? (t(), a("p", oe, "No module declares a setting.")) : V("", !0) : (t(), b(f(A), {
        key: 0,
        shape: "text"
      })),
      c("div", ie, [
        c("nav", re, [
          (t(!0), a($, null, C(x.value, (n) => (t(), a("button", {
            key: n,
            type: "button",
            class: "settings-nav-item",
            "data-jump": n,
            onClick: (o) => s(n)
          }, d(g(n)), 9, ce))), 128))
        ]),
        c("div", ue, [
          (t(!0), a($, null, C(x.value, (n) => (t(), a("section", {
            key: n,
            class: "settings-module",
            "data-module": n
          }, [
            c("h3", ye, d(g(n)), 1),
            (t(!0), a($, null, C(O.value.filter((o) => o.module === n), (o) => (t(), b(U, {
              key: o.key,
              row: o,
              rows: S.value,
              "read-only": u,
              save: B
            }, null, 8, ["row", "rows"]))), 128))
          ], 8, de))), 128))
        ])
      ])
    ]));
  }
}, fe = /* @__PURE__ */ L(ve, [["__scopeId", "data-v-02633114"]]);
export {
  fe as default
};
