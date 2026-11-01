/* @code-commandments-generated */
if (!document.getElementById("window-styles-426473e066bd")) { const style = document.createElement("style"); style.id = "window-styles-426473e066bd"; style.textContent = ".setting-head[data-v-cf742d48]{display:flex;gap:6px;align-items:center}.setting-dot[data-v-cf742d48]{width:6px;height:6px;border-radius:50%;background:var(--accent)}.setting-reset[data-v-cf742d48]{margin-left:auto;padding:0 6px;border:0;border-radius:5px;background:none;color:var(--text-3);font:inherit;font-size:11.5px;cursor:pointer}.setting-reset[data-v-cf742d48]:hover{background:var(--hover);color:var(--text)}.setting-group[data-v-cf742d48]{display:flex;flex-direction:column;gap:6px}.setting-group-head[data-v-cf742d48]{display:flex;align-items:center;gap:10px}.setting-group-title[data-v-cf742d48]{margin:0;font-size:13px;font-weight:600}.setting-children[data-v-cf742d48]{display:flex;flex-direction:column;gap:14px;padding-left:14px;border-left:1px solid var(--line)}.setting-children.off[data-v-cf742d48]{opacity:.5}.setting-value[data-v-cf742d48]{display:flex;flex-direction:column;gap:4px}.setting-label[data-v-cf742d48]{font-size:12px;color:var(--text)}.setting-description[data-v-cf742d48],.setting-shown[data-v-cf742d48]{margin:0;font-size:12px;color:var(--text-3)}.setting-field[data-v-cf742d48]{max-width:360px;padding:6px 10px;border:1px solid var(--line);border-radius:6px;color:var(--text);background:transparent}.setting-switch[data-v-cf742d48]{align-self:flex-start;padding:2px 10px;border:0;border-radius:10px;color:var(--text-2);background:var(--raised);font-size:11px;cursor:pointer}.setting-switch[aria-checked=true][data-v-cf742d48]{color:#fff;background:var(--accent)}.setting-choices[data-v-cf742d48]{display:flex;gap:6px}.setting-refusal[data-v-cf742d48]{margin:0;font-size:12px;color:var(--danger)}.settings[data-v-843ce87d]{display:flex;flex-direction:column;gap:16px}.settings-bar[data-v-843ce87d]{display:flex;flex-wrap:wrap;gap:12px;align-items:center}.settings-search[data-v-843ce87d]{flex:1;min-width:200px;max-width:360px}.settings-saved[data-v-843ce87d]{color:var(--text-3);font-size:12px}.settings-search-field[data-v-843ce87d]{width:100%;max-width:360px;padding:7px 12px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text)}.settings-body[data-v-843ce87d]{display:flex;gap:28px;align-items:flex-start}.settings-nav[data-v-843ce87d]{display:flex;flex:none;flex-direction:column;gap:2px;width:150px;position:sticky;top:0}.settings-nav-item[data-v-843ce87d]{padding:5px 10px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-align:left;cursor:pointer}.settings-nav-item[data-v-843ce87d]:hover{background:var(--hover);color:var(--text)}.settings-sections[data-v-843ce87d]{display:flex;flex:1;flex-direction:column;gap:32px;min-width:0}.settings-module[data-v-843ce87d]{display:flex;flex-direction:column;gap:18px}.settings-module-heading[data-v-843ce87d]{margin:0;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--text-3)}.settings-failure[data-v-843ce87d],.settings-empty[data-v-843ce87d]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as h, ref as x, openBlock as t, createElementBlock as r, createElementVNode as u, toDisplayString as v, createBlock as C, unref as w, createCommentVNode as p, normalizeClass as W, Fragment as $, renderList as j, withDirectives as D, vModelText as I, withCtx as z, createTextVNode as Y, onMounted as H, onUnmounted as J, withKeys as Q, createVNode as X } from "vue";
import { Switch as A, Btn as Z, useRows as _, Segmented as ee, Skeleton as te } from "@journal/window-kit";
const R = (e, n) => {
  const k = e.__vccOpts || e;
  for (const [m, S] of n)
    k[m] = S;
  return k;
}, ne = ["data-setting"], se = { class: "setting-group-head" }, ae = { class: "setting-group-title" }, le = { class: "setting-description" }, oe = {
  key: 0,
  class: "setting-refusal"
}, ie = ["data-setting"], re = { class: "setting-head" }, ue = {
  key: 0,
  class: "setting-dot",
  "data-setting-changed": "",
  title: "Changed from the default"
}, de = ["for"], ce = ["title"], fe = { class: "setting-description" }, ve = { class: "setting-shown" }, ye = ["id", "disabled"], ge = {
  key: 2,
  class: "setting-choices"
}, we = ["id", "type", "value", "disabled"], he = {
  key: 4,
  class: "setting-refusal"
}, B = "default", ke = {
  __name: "SettingNode",
  props: {
    row: { type: Object, required: !0 },
    rows: { type: Array, required: !0 },
    readOnly: { type: Boolean, required: !0 },
    save: { type: Function, required: !0 }
  },
  setup(e) {
    const n = e, k = h(() => n.rows.filter((c) => c.parent === n.row.key)), m = h(() => n.row.type === "group"), S = h(() => n.row.scope === "project" ? ["--project"] : []), y = x(""), g = x(""), b = h(() => !n.readOnly && !n.row.secret && !m.value && n.row.source !== B && n.row.default !== null && n.row.default !== void 0), O = h(() => typeof n.row.default == "boolean" ? n.row.default ? "on" : "off" : Array.isArray(n.row.default) ? n.row.default.join(",") : String(n.row.default));
    async function d(c) {
      const f = ["setting", "set", n.row.key, String(c), ...S.value], o = await n.save(f);
      o.ok ? y.value = "" : y.value = o.error;
    }
    async function E() {
      const c = await n.save(["setting", "switch", n.row.key, n.row.value === !1 ? "on" : "off", "--project"]);
      y.value = c.ok ? "" : c.error;
    }
    function F(c) {
      d(c.target.value);
    }
    function L() {
      g.value && d(g.value).then(() => g.value = "");
    }
    return (c, f) => m.value ? (t(), r("section", {
      key: 0,
      class: "setting-group",
      "data-setting": e.row.key
    }, [
      u("div", se, [
        u("h3", ae, v(e.row.title), 1),
        e.row.toggleable && !e.readOnly ? (t(), C(w(A), {
          key: 0,
          on: e.row.value !== !1,
          title: `Switch ${e.row.title} ${e.row.value === !1 ? "on" : "off"}`,
          "data-group-switch": "",
          onChange: E
        }, null, 8, ["on", "title"])) : p("", !0)
      ]),
      u("p", le, v(e.row.description), 1),
      u("div", {
        class: W(["setting-children", { off: e.row.value === !1 }])
      }, [
        (t(!0), r($, null, j(k.value, (o) => (t(), C(G, {
          key: o.key,
          row: o,
          rows: e.rows,
          "read-only": e.readOnly,
          save: e.save
        }, null, 8, ["row", "rows", "read-only", "save"]))), 128))
      ], 2),
      y.value ? (t(), r("p", oe, v(y.value), 1)) : p("", !0)
    ], 8, ne)) : (t(), r("div", {
      key: 1,
      class: "setting-value",
      "data-setting": e.row.key
    }, [
      u("div", re, [
        e.row.source !== B ? (t(), r("span", ue)) : p("", !0),
        u("label", {
          class: "setting-label",
          for: e.row.key
        }, v(e.row.title), 9, de),
        b.value ? (t(), r("button", {
          key: 1,
          type: "button",
          class: "setting-reset",
          "data-setting-reset": "",
          title: `Back to the default: ${O.value}`,
          onClick: f[0] || (f[0] = (o) => d(O.value))
        }, "Reset", 8, ce)) : p("", !0)
      ]),
      u("p", fe, v(e.row.description), 1),
      e.row.secret ? (t(), r($, { key: 0 }, [
        u("p", ve, v(e.row.shown), 1),
        D(u("input", {
          id: e.row.key,
          "onUpdate:modelValue": f[1] || (f[1] = (o) => g.value = o),
          class: "setting-field",
          type: "password",
          disabled: e.readOnly,
          placeholder: "Type a new value",
          onChange: L
        }, null, 40, ye), [
          [I, g.value]
        ])
      ], 64)) : e.row.type === "flag" ? (t(), C(w(A), {
        key: 1,
        on: e.row.value === !0,
        title: e.row.title,
        disabled: e.readOnly,
        "data-flag-switch": "",
        onChange: f[2] || (f[2] = (o) => !e.readOnly && d(o ? "on" : "off"))
      }, null, 8, ["on", "title", "disabled"])) : e.row.type === "choice" ? (t(), r("div", ge, [
        (t(!0), r($, null, j(e.row.choices, (o) => (t(), C(w(Z), {
          key: o,
          small: "",
          kind: o === e.row.value ? "primary" : "ghost",
          "data-choice": o,
          disabled: e.readOnly,
          onClick: (N) => d(o)
        }, {
          default: z(() => [
            Y(v(o), 1)
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
        onChange: F
      }, null, 40, we)),
      y.value ? (t(), r("p", he, v(y.value), 1)) : p("", !0)
    ], 8, ie));
  }
}, G = /* @__PURE__ */ R(ke, [["__scopeId", "data-v-cf742d48"]]), me = { class: "settings" }, be = { class: "settings-bar" }, pe = { class: "settings-search" }, Ce = {
  key: 1,
  class: "settings-failure"
}, $e = {
  key: 2,
  class: "settings-empty"
}, Se = { class: "settings-body" }, Oe = {
  class: "settings-nav",
  "aria-label": "Modules"
}, xe = ["data-jump", "onClick"], je = { class: "settings-sections" }, Ee = ["data-module"], Fe = { class: "settings-module-heading" }, Te = "default", Le = "input,textarea,select,[contenteditable]", Ne = {
  __name: "SettingsTree",
  setup(e) {
    const { rows: n, failure: k, loaded: m, load: S, context: y } = _("setting tree", ["setting.*"]), g = x(""), b = x("all"), O = x(null), d = h(() => n.value.filter((s) => !s.key.endsWith(".*"))), E = (s) => s.type !== "group" && s.source !== Te, F = (s) => s.value === !1, L = { all: () => !0, changed: E, off: F }, c = h(() => [
      { key: "all", label: "All" },
      { key: "changed", label: "Changed", title: "Settings you changed from their default", count: d.value.filter(E).length },
      { key: "off", label: "Off", count: d.value.filter(F).length }
    ]), f = h(() => {
      const s = g.value.trim().toLowerCase();
      if (!s && b.value === "all") return d.value;
      const a = d.value.filter((i) => L[b.value](i) && [i.title, i.description, i.key].join(" ").toLowerCase().includes(s)), l = new Set(a.map((i) => i.key));
      for (const i of a)
        for (let T = d.value.find((U) => U.key === i.parent); T; T = d.value.find((U) => U.key === T.parent)) l.add(T.key);
      return d.value.filter((i) => l.has(i.key));
    }), o = h(() => f.value.filter((s) => s.parent === null)), N = h(() => [...new Set(o.value.map((s) => s.module))]), M = y.face === "phone";
    function V(s) {
      const a = s.split("."), l = a[a.length - 1].replace(/[-_]/g, " ");
      return l.slice(0, 1).toUpperCase() + l.slice(1);
    }
    function K(s) {
      var a;
      (a = document.querySelector(`[data-module="${s}"]`)) == null || a.scrollIntoView({ block: "start" });
    }
    function q(s) {
      var a, l, i;
      s.key !== "/" || (l = (a = s.target).closest) != null && l.call(a, Le) || (s.preventDefault(), (i = O.value) == null || i.focus());
    }
    H(() => window.addEventListener("keydown", q)), J(() => window.removeEventListener("keydown", q));
    async function P(s) {
      const a = await y.run(s);
      return a.ok && S(), a;
    }
    return (s, a) => (t(), r("div", me, [
      u("div", be, [
        u("label", pe, [
          D(u("input", {
            ref_key: "field",
            ref: O,
            "onUpdate:modelValue": a[0] || (a[0] = (l) => g.value = l),
            class: "settings-search-field",
            type: "search",
            placeholder: "Find a setting",
            "aria-label": "Find a setting",
            onKeydown: a[1] || (a[1] = Q((l) => g.value = "", ["esc"]))
          }, null, 544), [
            [I, g.value]
          ])
        ]),
        X(w(ee), {
          options: c.value,
          value: b.value,
          "data-settings-filter": "",
          onPick: a[2] || (a[2] = (l) => b.value = l)
        }, null, 8, ["options", "value"]),
        a[3] || (a[3] = u("span", { class: "settings-saved" }, "Changes are saved as you make them", -1))
      ]),
      w(m) ? w(k) ? (t(), r("p", Ce, v(w(k)), 1)) : w(m) && !w(n).length ? (t(), r("p", $e, "No module declares a setting.")) : p("", !0) : (t(), C(w(te), {
        key: 0,
        shape: "text"
      })),
      u("div", Se, [
        u("nav", Oe, [
          (t(!0), r($, null, j(N.value, (l) => (t(), r("button", {
            key: l,
            type: "button",
            class: "settings-nav-item",
            "data-jump": l,
            onClick: (i) => K(l)
          }, v(V(l)), 9, xe))), 128))
        ]),
        u("div", je, [
          (t(!0), r($, null, j(N.value, (l) => (t(), r("section", {
            key: l,
            class: "settings-module",
            "data-module": l
          }, [
            u("h3", Fe, v(V(l)), 1),
            (t(!0), r($, null, j(o.value.filter((i) => i.module === l), (i) => (t(), C(G, {
              key: i.key,
              row: i,
              rows: f.value,
              "read-only": M,
              save: P
            }, null, 8, ["row", "rows"]))), 128))
          ], 8, Ee))), 128))
        ])
      ])
    ]));
  }
}, qe = /* @__PURE__ */ R(Ne, [["__scopeId", "data-v-843ce87d"]]);
export {
  qe as default
};
