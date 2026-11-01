/* @code-commandments-generated */
if (!document.getElementById("window-styles-b5c82244ca2f")) { const style = document.createElement("style"); style.id = "window-styles-b5c82244ca2f"; style.textContent = ".setting-head[data-v-b370e3d7]{display:flex;gap:6px;align-items:center}.setting-dot[data-v-b370e3d7]{width:6px;height:6px;border-radius:50%;background:var(--accent)}.setting-reset[data-v-b370e3d7]{margin-left:auto;padding:0 6px;border:0;border-radius:5px;background:none;color:var(--text-3);font:inherit;font-size:11.5px;cursor:pointer}.setting-reset[data-v-b370e3d7]:hover{background:var(--hover);color:var(--text)}.setting-group[data-v-b370e3d7]{display:flex;flex-direction:column;gap:6px}.setting-group-head[data-v-b370e3d7]{display:flex;align-items:center;gap:10px}.setting-group-title[data-v-b370e3d7]{margin:0;font-size:13px;font-weight:600}.setting-children[data-v-b370e3d7]{display:flex;flex-direction:column;gap:14px;padding-left:14px;border-left:1px solid var(--line)}.setting-children.off[data-v-b370e3d7]{opacity:.5}.setting-value[data-v-b370e3d7]{display:flex;flex-direction:column;gap:4px}.setting-label[data-v-b370e3d7]{font-size:12px;color:var(--text)}.setting-description[data-v-b370e3d7],.setting-shown[data-v-b370e3d7]{margin:0;font-size:12px;color:var(--text-3)}.setting-field[data-v-b370e3d7]{max-width:360px;padding:6px 10px;border:1px solid var(--line);border-radius:6px;color:var(--text);background:transparent}.setting-switch[data-v-b370e3d7]{align-self:flex-start;padding:2px 10px;border:0;border-radius:10px;color:var(--text-2);background:var(--raised);font-size:11px;cursor:pointer}.setting-switch[aria-checked=true][data-v-b370e3d7]{color:#fff;background:var(--accent)}.setting-choices[data-v-b370e3d7]{display:flex;gap:6px}.setting-refusal[data-v-b370e3d7]{margin:0;font-size:12px;color:var(--danger)}.settings[data-v-4ad53d81]{display:flex;flex-direction:column;gap:16px}.settings-bar[data-v-4ad53d81]{display:flex;flex-wrap:wrap;gap:12px;align-items:center}.settings-search[data-v-4ad53d81]{flex:1;min-width:200px;max-width:360px}.settings-saved[data-v-4ad53d81]{color:var(--text-3);font-size:12px}.settings-search-field[data-v-4ad53d81]{width:100%;max-width:360px;padding:7px 12px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text)}.settings-body[data-v-4ad53d81]{display:flex;gap:28px;align-items:flex-start}.settings-nav[data-v-4ad53d81]{display:flex;flex:none;flex-direction:column;gap:2px;width:150px;position:sticky;top:0}.settings-nav-item[data-v-4ad53d81]{padding:5px 10px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-align:left;cursor:pointer}.settings-nav-item[data-v-4ad53d81]:hover{background:var(--hover);color:var(--text)}.settings-sections[data-v-4ad53d81]{display:flex;flex:1;flex-direction:column;gap:32px;min-width:0}.settings-module[data-v-4ad53d81]{display:flex;flex-direction:column;gap:18px}.settings-module-heading[data-v-4ad53d81]{margin:0;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--text-3)}.settings-failure[data-v-4ad53d81],.settings-empty[data-v-4ad53d81]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as f, ref as x, openBlock as t, createElementBlock as r, createElementVNode as u, toDisplayString as v, createBlock as O, unref as g, createCommentVNode as $, normalizeClass as P, Fragment as j, renderList as N, withDirectives as G, vModelText as I, withCtx as W, createTextVNode as z, onMounted as Y, onUnmounted as J, withKeys as Q, createVNode as X } from "vue";
import { Switch as D, Btn as Z, useRows as _, Segmented as ee, Skeleton as te } from "@journal/window-kit";
const R = (e, s) => {
  const m = e.__vccOpts || e;
  for (const [b, C] of s)
    m[b] = C;
  return m;
}, ne = ["data-setting"], se = { class: "setting-group-head" }, ae = { class: "setting-group-title" }, le = { class: "setting-description" }, oe = {
  key: 0,
  class: "setting-refusal"
}, ie = ["data-setting"], re = { class: "setting-head" }, ue = {
  key: 0,
  class: "setting-dot",
  "data-setting-changed": "",
  title: "Changed from the default"
}, de = ["for"], ce = ["title"], ve = { class: "setting-description" }, fe = { class: "setting-shown" }, ye = ["id", "disabled"], ge = {
  key: 2,
  class: "setting-choices"
}, we = ["id", "type", "value", "disabled"], he = {
  key: 4,
  class: "setting-refusal"
}, ke = {
  __name: "SettingNode",
  props: {
    row: { type: Object, required: !0 },
    rows: { type: Array, required: !0 },
    readOnly: { type: Boolean, required: !0 },
    save: { type: Function, required: !0 }
  },
  setup(e) {
    const s = e, m = f(() => s.rows.filter((d) => d.parent === s.row.key)), b = f(() => s.row.type === "group"), C = f(() => s.row.scope === "project" ? ["--project"] : []), w = x(""), h = x(""), S = /* @__PURE__ */ new Set(["environment", "project"]), p = f(() => S.has(s.row.source)), E = f(() => !s.readOnly && !s.row.secret && !b.value && p.value && s.row.default !== null && s.row.default !== void 0), y = f(() => typeof s.row.default == "boolean" ? s.row.default ? "on" : "off" : Array.isArray(s.row.default) ? s.row.default.join(",") : String(s.row.default));
    async function k(d) {
      const c = ["setting", "set", s.row.key, String(d), ...C.value], o = await s.save(c);
      o.ok ? w.value = "" : w.value = o.error;
    }
    async function V() {
      const d = await s.save(["setting", "switch", s.row.key, s.row.value === !1 ? "on" : "off", "--project"]);
      w.value = d.ok ? "" : d.error;
    }
    function T(d) {
      k(d.target.value);
    }
    function q() {
      h.value && k(h.value).then(() => h.value = "");
    }
    return (d, c) => b.value ? (t(), r("section", {
      key: 0,
      class: "setting-group",
      "data-setting": e.row.key
    }, [
      u("div", se, [
        u("h3", ae, v(e.row.title), 1),
        e.row.toggleable && !e.readOnly ? (t(), O(g(D), {
          key: 0,
          on: e.row.value !== !1,
          title: `Switch ${e.row.title} ${e.row.value === !1 ? "on" : "off"}`,
          "data-group-switch": "",
          onChange: V
        }, null, 8, ["on", "title"])) : $("", !0)
      ]),
      u("p", le, v(e.row.description), 1),
      u("div", {
        class: P(["setting-children", { off: e.row.value === !1 }])
      }, [
        (t(!0), r(j, null, N(m.value, (o) => (t(), O(M, {
          key: o.key,
          row: o,
          rows: e.rows,
          "read-only": e.readOnly,
          save: e.save
        }, null, 8, ["row", "rows", "read-only", "save"]))), 128))
      ], 2),
      w.value ? (t(), r("p", oe, v(w.value), 1)) : $("", !0)
    ], 8, ne)) : (t(), r("div", {
      key: 1,
      class: "setting-value",
      "data-setting": e.row.key
    }, [
      u("div", re, [
        p.value ? (t(), r("span", ue)) : $("", !0),
        u("label", {
          class: "setting-label",
          for: e.row.key
        }, v(e.row.title), 9, de),
        E.value ? (t(), r("button", {
          key: 1,
          type: "button",
          class: "setting-reset",
          "data-setting-reset": "",
          title: `Back to the default: ${y.value}`,
          onClick: c[0] || (c[0] = (o) => k(y.value))
        }, "Reset", 8, ce)) : $("", !0)
      ]),
      u("p", ve, v(e.row.description), 1),
      e.row.secret ? (t(), r(j, { key: 0 }, [
        u("p", fe, v(e.row.shown), 1),
        G(u("input", {
          id: e.row.key,
          "onUpdate:modelValue": c[1] || (c[1] = (o) => h.value = o),
          class: "setting-field",
          type: "password",
          disabled: e.readOnly,
          placeholder: "Type a new value",
          onChange: q
        }, null, 40, ye), [
          [I, h.value]
        ])
      ], 64)) : e.row.type === "flag" ? (t(), O(g(D), {
        key: 1,
        on: e.row.value === !0,
        title: e.row.title,
        disabled: e.readOnly,
        "data-flag-switch": "",
        onChange: c[2] || (c[2] = (o) => !e.readOnly && k(o ? "on" : "off"))
      }, null, 8, ["on", "title", "disabled"])) : e.row.type === "choice" ? (t(), r("div", ge, [
        (t(!0), r(j, null, N(e.row.choices, (o) => (t(), O(g(Z), {
          key: o,
          small: "",
          kind: o === e.row.value ? "primary" : "ghost",
          "data-choice": o,
          disabled: e.readOnly,
          onClick: (B) => k(o)
        }, {
          default: W(() => [
            z(v(o), 1)
          ]),
          _: 2
        }, 1032, ["kind", "data-choice", "disabled", "onClick"]))), 128))
      ])) : (t(), r("input", {
        key: 3,
        id: e.row.key,
        class: "setting-field",
        type: e.row.type === "number" ? "number" : "text",
        value: e.row.type === "list" || e.row.type === "number list" ? e.row.shown : e.row.value,
        disabled: e.readOnly,
        onChange: T
      }, null, 40, we)),
      w.value ? (t(), r("p", he, v(w.value), 1)) : $("", !0)
    ], 8, ie));
  }
}, M = /* @__PURE__ */ R(ke, [["__scopeId", "data-v-b370e3d7"]]), me = { class: "settings" }, be = { class: "settings-bar" }, pe = { class: "settings-search" }, Ce = {
  key: 1,
  class: "settings-failure"
}, Se = {
  key: 2,
  class: "settings-empty"
}, $e = { class: "settings-body" }, Oe = {
  class: "settings-nav",
  "aria-label": "Modules"
}, je = ["data-jump", "onClick"], xe = { class: "settings-sections" }, Ne = ["data-module"], Ee = { class: "settings-module-heading" }, Ve = "input,textarea,select,[contenteditable]", Fe = {
  __name: "SettingsTree",
  setup(e) {
    const s = /* @__PURE__ */ new Set(["environment", "project"]), { rows: m, failure: b, loaded: C, load: w, context: h } = _("setting tree", ["setting.*"]), S = x(""), p = x("all"), E = x(null), y = f(() => m.value.filter((n) => !n.key.endsWith(".*"))), k = (n) => n.type !== "group" && s.has(n.source), V = (n) => n.value === !1, T = { all: () => !0, changed: k, off: V }, q = f(() => [
      { key: "all", label: "All" },
      { key: "changed", label: "Changed", title: "Settings you changed from their default", count: y.value.filter(k).length },
      { key: "off", label: "Off", count: y.value.filter(V).length }
    ]), d = f(() => {
      const n = S.value.trim().toLowerCase();
      if (!n && p.value === "all") return y.value;
      const a = y.value.filter((i) => T[p.value](i) && [i.title, i.description, i.key].join(" ").toLowerCase().includes(n)), l = new Set(a.map((i) => i.key));
      for (const i of a)
        for (let F = y.value.find((A) => A.key === i.parent); F; F = y.value.find((A) => A.key === F.parent)) l.add(F.key);
      return y.value.filter((i) => l.has(i.key));
    }), c = f(() => d.value.filter((n) => n.parent === null)), o = f(() => [...new Set(c.value.map((n) => n.module))]), B = h.face === "phone";
    function L(n) {
      const a = n.split("."), l = a[a.length - 1].replace(/[-_]/g, " ");
      return l.slice(0, 1).toUpperCase() + l.slice(1);
    }
    function H(n) {
      var a;
      (a = document.querySelector(`[data-module="${n}"]`)) == null || a.scrollIntoView({ block: "start" });
    }
    function U(n) {
      var a, l, i;
      n.key !== "/" || (l = (a = n.target).closest) != null && l.call(a, Ve) || (n.preventDefault(), (i = E.value) == null || i.focus());
    }
    Y(() => window.addEventListener("keydown", U)), J(() => window.removeEventListener("keydown", U));
    async function K(n) {
      const a = await h.run(n);
      return a.ok && w(), a;
    }
    return (n, a) => (t(), r("div", me, [
      u("div", be, [
        u("label", pe, [
          G(u("input", {
            ref_key: "field",
            ref: E,
            "onUpdate:modelValue": a[0] || (a[0] = (l) => S.value = l),
            class: "settings-search-field",
            type: "search",
            placeholder: "Find a setting",
            "aria-label": "Find a setting",
            onKeydown: a[1] || (a[1] = Q((l) => S.value = "", ["esc"]))
          }, null, 544), [
            [I, S.value]
          ])
        ]),
        X(g(ee), {
          options: q.value,
          value: p.value,
          "data-settings-filter": "",
          onPick: a[2] || (a[2] = (l) => p.value = l)
        }, null, 8, ["options", "value"]),
        a[3] || (a[3] = u("span", { class: "settings-saved" }, "Changes are saved as you make them", -1))
      ]),
      g(C) ? g(b) ? (t(), r("p", Ce, v(g(b)), 1)) : g(C) && !g(m).length ? (t(), r("p", Se, "No module declares a setting.")) : $("", !0) : (t(), O(g(te), {
        key: 0,
        shape: "text"
      })),
      u("div", $e, [
        u("nav", Oe, [
          (t(!0), r(j, null, N(o.value, (l) => (t(), r("button", {
            key: l,
            type: "button",
            class: "settings-nav-item",
            "data-jump": l,
            onClick: (i) => H(l)
          }, v(L(l)), 9, je))), 128))
        ]),
        u("div", xe, [
          (t(!0), r(j, null, N(o.value, (l) => (t(), r("section", {
            key: l,
            class: "settings-module",
            "data-module": l
          }, [
            u("h3", Ee, v(L(l)), 1),
            (t(!0), r(j, null, N(c.value.filter((i) => i.module === l), (i) => (t(), O(M, {
              key: i.key,
              row: i,
              rows: d.value,
              "read-only": B,
              save: K
            }, null, 8, ["row", "rows"]))), 128))
          ], 8, Ne))), 128))
        ])
      ])
    ]));
  }
}, Ae = /* @__PURE__ */ R(Fe, [["__scopeId", "data-v-4ad53d81"]]);
export {
  Ae as default
};
