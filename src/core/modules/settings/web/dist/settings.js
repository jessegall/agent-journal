/* @code-commandments-generated */
if (!document.getElementById("window-styles-4a88d034a062")) { const style = document.createElement("style"); style.id = "window-styles-4a88d034a062"; style.textContent = ".setting-head[data-v-b370e3d7]{display:flex;gap:6px;align-items:center}.setting-dot[data-v-b370e3d7]{width:6px;height:6px;border-radius:50%;background:var(--accent)}.setting-reset[data-v-b370e3d7]{margin-left:auto;padding:0 6px;border:0;border-radius:5px;background:none;color:var(--text-3);font:inherit;font-size:11.5px;cursor:pointer}.setting-reset[data-v-b370e3d7]:hover{background:var(--hover);color:var(--text)}.setting-group[data-v-b370e3d7]{display:flex;flex-direction:column;gap:6px}.setting-group-head[data-v-b370e3d7]{display:flex;align-items:center;gap:10px}.setting-group-title[data-v-b370e3d7]{margin:0;font-size:13px;font-weight:600}.setting-children[data-v-b370e3d7]{display:flex;flex-direction:column;gap:14px;padding-left:14px;border-left:1px solid var(--line)}.setting-children.off[data-v-b370e3d7]{opacity:.5}.setting-value[data-v-b370e3d7]{display:flex;flex-direction:column;gap:4px}.setting-label[data-v-b370e3d7]{font-size:12px;color:var(--text)}.setting-description[data-v-b370e3d7],.setting-shown[data-v-b370e3d7]{margin:0;font-size:12px;color:var(--text-3)}.setting-field[data-v-b370e3d7]{max-width:360px;padding:6px 10px;border:1px solid var(--line);border-radius:6px;color:var(--text);background:transparent}.setting-switch[data-v-b370e3d7]{align-self:flex-start;padding:2px 10px;border:0;border-radius:10px;color:var(--text-2);background:var(--raised);font-size:11px;cursor:pointer}.setting-switch[aria-checked=true][data-v-b370e3d7]{color:#fff;background:var(--accent)}.setting-choices[data-v-b370e3d7]{display:flex;gap:6px}.setting-refusal[data-v-b370e3d7]{margin:0;font-size:12px;color:var(--danger)}.environment[data-v-6932e45c]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.environment-names[data-v-6932e45c]{flex:1;min-width:0}.environment-name[data-v-6932e45c]{font-weight:500}.environment-here[data-v-6932e45c]{margin-left:8px;color:var(--accent-text);font-size:12px}.environment-folder[data-v-6932e45c]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.environment-refusal[data-v-6932e45c]{margin:2px 0 0;color:var(--danger);font-size:12.5px}.settings[data-v-e859175c]{display:flex;flex-direction:column;gap:16px}.settings-bar[data-v-e859175c]{display:flex;flex-wrap:wrap;gap:12px;align-items:center}.settings-search[data-v-e859175c]{flex:1;min-width:200px;max-width:360px}.settings-saved[data-v-e859175c]{color:var(--text-3);font-size:12px}.settings-search-field[data-v-e859175c]{width:100%;max-width:360px;padding:7px 12px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text)}.settings-body[data-v-e859175c]{display:flex;gap:28px;align-items:flex-start}.settings-nav[data-v-e859175c]{display:flex;flex:none;flex-direction:column;gap:2px;width:150px;position:sticky;top:0}.settings-nav-item[data-v-e859175c]{padding:5px 10px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-align:left;cursor:pointer}.settings-nav-item[data-v-e859175c]:hover{background:var(--hover);color:var(--text)}.settings-sections[data-v-e859175c]{display:flex;flex:1;flex-direction:column;gap:32px;min-width:0}.settings-module[data-v-e859175c]{display:flex;flex-direction:column;gap:18px}.settings-module-heading[data-v-e859175c]{margin:0;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--text-3)}.settings-failure[data-v-e859175c],.settings-empty[data-v-e859175c]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as h, ref as N, openBlock as t, createElementBlock as i, createElementVNode as r, toDisplayString as y, createBlock as S, unref as f, createCommentVNode as j, normalizeClass as Z, Fragment as _, renderList as V, withDirectives as Y, vModelText as H, withCtx as T, createTextVNode as B, createVNode as L, onMounted as ee, onUnmounted as te, withKeys as ne } from "vue";
import { Switch as M, Btn as F, useRows as W, RowList as se, Segmented as P, Skeleton as ae } from "@journal/window-kit";
const U = (e, n) => {
  const C = e.__vccOpts || e;
  for (const [$, O] of n)
    C[$] = O;
  return C;
}, oe = ["data-setting"], le = { class: "setting-group-head" }, ie = { class: "setting-group-title" }, re = { class: "setting-description" }, de = {
  key: 0,
  class: "setting-refusal"
}, ue = ["data-setting"], ce = { class: "setting-head" }, ve = {
  key: 0,
  class: "setting-dot",
  "data-setting-changed": "",
  title: "Changed from the default"
}, fe = ["for"], ye = ["title"], ge = { class: "setting-description" }, me = { class: "setting-shown" }, ke = ["id", "disabled"], he = {
  key: 2,
  class: "setting-choices"
}, we = ["id", "type", "value", "disabled"], pe = {
  key: 4,
  class: "setting-refusal"
}, be = {
  __name: "SettingNode",
  props: {
    row: { type: Object, required: !0 },
    rows: { type: Array, required: !0 },
    readOnly: { type: Boolean, required: !0 },
    save: { type: Function, required: !0 }
  },
  setup(e) {
    const n = e, C = h(() => n.rows.filter((w) => w.parent === n.row.key)), $ = h(() => n.row.type === "group"), O = h(() => n.row.scope === "project" ? ["--project"] : []), m = N(""), g = N(""), x = /* @__PURE__ */ new Set(["environment", "project"]), k = h(() => x.has(n.row.source)), E = h(() => !n.readOnly && !n.row.secret && !$.value && k.value && n.row.default !== null && n.row.default !== void 0), p = h(() => typeof n.row.default == "boolean" ? n.row.default ? "on" : "off" : Array.isArray(n.row.default) ? n.row.default.join(",") : String(n.row.default));
    async function d(w) {
      const b = ["setting", "set", n.row.key, String(w), ...O.value], u = await n.save(b);
      u.ok ? m.value = "" : m.value = u.error;
    }
    async function s() {
      const w = await n.save(["setting", "switch", n.row.key, n.row.value === !1 ? "on" : "off", "--project"]);
      m.value = w.ok ? "" : w.error;
    }
    function v(w) {
      d(w.target.value);
    }
    function R() {
      g.value && d(g.value).then(() => g.value = "");
    }
    return (w, b) => $.value ? (t(), i("section", {
      key: 0,
      class: "setting-group",
      "data-setting": e.row.key
    }, [
      r("div", le, [
        r("h3", ie, y(e.row.title), 1),
        e.row.toggleable && !e.readOnly ? (t(), S(f(M), {
          key: 0,
          on: e.row.value !== !1,
          title: `Switch ${e.row.title} ${e.row.value === !1 ? "on" : "off"}`,
          "data-group-switch": "",
          onChange: s
        }, null, 8, ["on", "title"])) : j("", !0)
      ]),
      r("p", re, y(e.row.description), 1),
      r("div", {
        class: Z(["setting-children", { off: e.row.value === !1 }])
      }, [
        (t(!0), i(_, null, V(C.value, (u) => (t(), S(z, {
          key: u.key,
          row: u,
          rows: e.rows,
          "read-only": e.readOnly,
          save: e.save
        }, null, 8, ["row", "rows", "read-only", "save"]))), 128))
      ], 2),
      m.value ? (t(), i("p", de, y(m.value), 1)) : j("", !0)
    ], 8, oe)) : (t(), i("div", {
      key: 1,
      class: "setting-value",
      "data-setting": e.row.key
    }, [
      r("div", ce, [
        k.value ? (t(), i("span", ve)) : j("", !0),
        r("label", {
          class: "setting-label",
          for: e.row.key
        }, y(e.row.title), 9, fe),
        E.value ? (t(), i("button", {
          key: 1,
          type: "button",
          class: "setting-reset",
          "data-setting-reset": "",
          title: `Back to the default: ${p.value}`,
          onClick: b[0] || (b[0] = (u) => d(p.value))
        }, "Reset", 8, ye)) : j("", !0)
      ]),
      r("p", ge, y(e.row.description), 1),
      e.row.secret ? (t(), i(_, { key: 0 }, [
        r("p", me, y(e.row.shown), 1),
        Y(r("input", {
          id: e.row.key,
          "onUpdate:modelValue": b[1] || (b[1] = (u) => g.value = u),
          class: "setting-field",
          type: "password",
          disabled: e.readOnly,
          placeholder: "Type a new value",
          onChange: R
        }, null, 40, ke), [
          [H, g.value]
        ])
      ], 64)) : e.row.type === "flag" ? (t(), S(f(M), {
        key: 1,
        on: e.row.value === !0,
        title: e.row.title,
        disabled: e.readOnly,
        "data-flag-switch": "",
        onChange: b[2] || (b[2] = (u) => !e.readOnly && d(u ? "on" : "off"))
      }, null, 8, ["on", "title", "disabled"])) : e.row.type === "choice" ? (t(), i("div", he, [
        (t(!0), i(_, null, V(e.row.choices, (u) => (t(), S(f(F), {
          key: u,
          small: "",
          kind: u === e.row.value ? "primary" : "ghost",
          "data-choice": u,
          disabled: e.readOnly,
          onClick: (q) => d(u)
        }, {
          default: T(() => [
            B(y(u), 1)
          ]),
          _: 2
        }, 1032, ["kind", "data-choice", "disabled", "onClick"]))), 128))
      ])) : (t(), i("input", {
        key: 3,
        id: e.row.key,
        class: "setting-field",
        type: e.row.type === "number" ? "number" : "text",
        value: e.row.type === "list" || e.row.type === "number list" ? e.row.shown : e.row.value,
        disabled: e.readOnly,
        onChange: v
      }, null, 40, we)),
      m.value ? (t(), i("p", pe, y(m.value), 1)) : j("", !0)
    ], 8, ue));
  }
}, z = /* @__PURE__ */ U(be, [["__scopeId", "data-v-b370e3d7"]]), Ce = ["data-environment"], $e = { class: "environment-names" }, Se = { class: "environment-name" }, Oe = {
  key: 0,
  class: "environment-here"
}, xe = { class: "environment-folder" }, Ee = {
  key: 1,
  class: "environment-refusal",
  role: "alert",
  "data-environment-refusal": ""
}, je = {
  __name: "SettingsEnvironments",
  setup(e) {
    const { rows: n, failure: C, loaded: $, load: O, context: m } = W("environment list", ["environment.*"]), g = N(0), x = N({}), k = (d) => d.name === m.environment, E = h(() => [...n.value].sort((d, s) => k(s) - k(d) || d.name.localeCompare(s.name)));
    async function p(d) {
      if (g.value !== d.id) return void (g.value = d.id);
      const s = await m.run(["environment", "delete", String(d.id)]);
      x.value = { ...x.value, [d.id]: s.ok ? "" : s.error }, g.value = 0, s.ok && O();
    }
    return (d, s) => (t(), S(f(se), {
      rows: E.value,
      failure: f(C),
      loaded: f($),
      empty: "No environments yet"
    }, {
      default: T(({ row: v }) => [
        r("div", {
          class: "environment",
          "data-environment": v.name
        }, [
          r("div", $e, [
            r("span", Se, y(v.name), 1),
            k(v) ? (t(), i("span", Oe, "You are here")) : j("", !0),
            r("p", xe, y(v.folder) + " on " + y(v.branch), 1),
            x.value[v.id] ? (t(), i("p", Ee, y(x.value[v.id]), 1)) : j("", !0)
          ]),
          g.value === v.id ? (t(), i(_, { key: 0 }, [
            L(f(F), {
              small: "",
              "data-environment-keep": "",
              onClick: s[0] || (s[0] = (R) => g.value = 0)
            }, {
              default: T(() => [...s[1] || (s[1] = [
                B("Keep it", -1)
              ])]),
              _: 1
            }),
            L(f(F), {
              small: "",
              kind: "danger",
              "data-environment-confirm": "",
              onClick: (R) => p(v)
            }, {
              default: T(() => [...s[2] || (s[2] = [
                B("Yes, remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ], 64)) : (t(), S(f(F), {
            key: 1,
            small: "",
            kind: "danger",
            "data-environment-remove": "",
            disabled: k(v),
            title: k(v) ? "Switch to another environment to remove this one" : "Remove this environment",
            onClick: (R) => p(v)
          }, {
            default: T(() => [...s[3] || (s[3] = [
              B("Remove environment", -1)
            ])]),
            _: 1
          }, 8, ["disabled", "title", "onClick"]))
        ], 8, Ce)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, Ne = /* @__PURE__ */ U(je, [["__scopeId", "data-v-6932e45c"]]), _e = { class: "settings" }, Re = { class: "settings-bar" }, Te = { class: "settings-search" }, Ve = {
  key: 1,
  class: "settings-failure"
}, Ae = {
  key: 2,
  class: "settings-empty"
}, Be = { class: "settings-body" }, Fe = {
  class: "settings-nav",
  "aria-label": "Modules"
}, Le = ["data-jump", "onClick"], qe = { class: "settings-sections" }, Ie = ["data-module"], Ue = { class: "settings-module-heading" }, De = "input,textarea,select,[contenteditable]", Ge = {
  __name: "SettingsTree",
  setup(e) {
    const n = /* @__PURE__ */ new Set(["environment", "project"]), { rows: C, failure: $, loaded: O, load: m, context: g } = W("setting tree", ["setting.*"]), x = [
      { key: "settings", label: "Settings" },
      { key: "environments", label: "Environments" }
    ], k = N("settings"), E = N(""), p = N("all"), d = N(null), s = h(() => C.value.filter((l) => !l.key.endsWith(".*"))), v = (l) => l.type !== "group" && n.has(l.source), R = (l) => l.value === !1, w = { all: () => !0, changed: v, off: R }, b = h(() => [
      { key: "all", label: "All" },
      { key: "changed", label: "Changed", title: "Settings you changed from their default", count: s.value.filter(v).length },
      { key: "off", label: "Off", count: s.value.filter(R).length }
    ]), u = h(() => {
      const l = E.value.trim().toLowerCase();
      if (!l && p.value === "all") return s.value;
      const a = s.value.filter((c) => w[p.value](c) && [c.title, c.description, c.key].join(" ").toLowerCase().includes(l)), o = new Set(a.map((c) => c.key));
      for (const c of a)
        for (let A = s.value.find((I) => I.key === c.parent); A; A = s.value.find((I) => I.key === A.parent)) o.add(A.key);
      return s.value.filter((c) => o.has(c.key));
    }), q = h(() => u.value.filter((l) => l.parent === null)), D = h(() => [...new Set(q.value.map((l) => l.module))]), J = g.face === "phone";
    function G(l) {
      const a = l.split("."), o = a[a.length - 1].replace(/[-_]/g, " ");
      return o.slice(0, 1).toUpperCase() + o.slice(1);
    }
    function Q(l) {
      var a;
      (a = document.querySelector(`[data-module="${l}"]`)) == null || a.scrollIntoView({ block: "start" });
    }
    function K(l) {
      var a, o, c;
      l.key !== "/" || (o = (a = l.target).closest) != null && o.call(a, De) || (l.preventDefault(), (c = d.value) == null || c.focus());
    }
    ee(() => window.addEventListener("keydown", K)), te(() => window.removeEventListener("keydown", K));
    async function X(l) {
      const a = await g.run(l);
      return a.ok && m(), a;
    }
    return (l, a) => (t(), i("div", _e, [
      L(f(P), {
        options: x,
        value: k.value,
        "data-settings-tabs": "",
        onPick: a[0] || (a[0] = (o) => k.value = o)
      }, null, 8, ["value"]),
      k.value === "environments" ? (t(), S(Ne, { key: 0 })) : (t(), i(_, { key: 1 }, [
        r("div", Re, [
          r("label", Te, [
            Y(r("input", {
              ref_key: "field",
              ref: d,
              "onUpdate:modelValue": a[1] || (a[1] = (o) => E.value = o),
              class: "settings-search-field",
              type: "search",
              placeholder: "Find a setting",
              "aria-label": "Find a setting",
              onKeydown: a[2] || (a[2] = ne((o) => E.value = "", ["esc"]))
            }, null, 544), [
              [H, E.value]
            ])
          ]),
          L(f(P), {
            options: b.value,
            value: p.value,
            "data-settings-filter": "",
            onPick: a[3] || (a[3] = (o) => p.value = o)
          }, null, 8, ["options", "value"]),
          a[4] || (a[4] = r("span", { class: "settings-saved" }, "Changes are saved as you make them", -1))
        ]),
        f(O) ? f($) ? (t(), i("p", Ve, y(f($)), 1)) : f(O) && !f(C).length ? (t(), i("p", Ae, "No module declares a setting.")) : j("", !0) : (t(), S(f(ae), {
          key: 0,
          shape: "text"
        })),
        r("div", Be, [
          r("nav", Fe, [
            (t(!0), i(_, null, V(D.value, (o) => (t(), i("button", {
              key: o,
              type: "button",
              class: "settings-nav-item",
              "data-jump": o,
              onClick: (c) => Q(o)
            }, y(G(o)), 9, Le))), 128))
          ]),
          r("div", qe, [
            (t(!0), i(_, null, V(D.value, (o) => (t(), i("section", {
              key: o,
              class: "settings-module",
              "data-module": o
            }, [
              r("h3", Ue, y(G(o)), 1),
              (t(!0), i(_, null, V(q.value.filter((c) => c.module === o), (c) => (t(), S(z, {
                key: c.key,
                row: c,
                rows: u.value,
                "read-only": J,
                save: X
              }, null, 8, ["row", "rows"]))), 128))
            ], 8, Ie))), 128))
          ])
        ])
      ], 64))
    ]));
  }
}, Pe = /* @__PURE__ */ U(Ge, [["__scopeId", "data-v-e859175c"]]);
export {
  Pe as default
};
