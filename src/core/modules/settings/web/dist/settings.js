/* @code-commandments-generated */
if (!document.getElementById("window-styles-58e3710a5a24")) { const style = document.createElement("style"); style.id = "window-styles-58e3710a5a24"; style.textContent = ".setting-input[data-v-fe240729]{display:flex;gap:8px;align-items:center}.setting-unit[data-v-fe240729]{flex:none;color:var(--text-3);font-size:12px}.setting-list[data-v-fe240729]{resize:vertical}.setting-head[data-v-fe240729]{display:flex;gap:6px;align-items:center}.setting-dot[data-v-fe240729]{width:6px;height:6px;border-radius:50%;background:var(--accent)}.setting-reset[data-v-fe240729]{margin-left:auto;padding:0 6px;border:0;border-radius:5px;background:none;color:var(--text-3);font:inherit;font-size:11.5px;cursor:pointer}.setting-reset[data-v-fe240729]:hover{background:var(--hover);color:var(--text)}.setting-group[data-v-fe240729]{display:flex;flex-direction:column;gap:6px}.setting-group-head[data-v-fe240729]{display:flex;align-items:center;gap:10px}.setting-group-title[data-v-fe240729]{margin:0;font-size:13px;font-weight:600}.setting-children[data-v-fe240729]{display:flex;flex-direction:column;gap:14px;padding-left:14px;border-left:1px solid var(--line)}.setting-children.off[data-v-fe240729]{opacity:.5}.setting-value[data-v-fe240729]{display:flex;flex-direction:column;gap:4px}.setting-label[data-v-fe240729]{font-size:12px;color:var(--text)}.setting-description[data-v-fe240729],.setting-shown[data-v-fe240729]{margin:0;font-size:12px;color:var(--text-3)}.setting-field[data-v-fe240729]{max-width:360px;padding:6px 10px;border:1px solid var(--line);border-radius:6px;color:var(--text);background:transparent}.setting-switch[data-v-fe240729]{align-self:flex-start;padding:2px 10px;border:0;border-radius:10px;color:var(--text-2);background:var(--raised);font-size:11px;cursor:pointer}.setting-switch[aria-checked=true][data-v-fe240729]{color:#fff;background:var(--accent)}.setting-choices[data-v-fe240729]{display:flex;gap:6px}.setting-refusal[data-v-fe240729]{margin:0;font-size:12px;color:var(--danger)}.environment[data-v-6932e45c]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.environment-names[data-v-6932e45c]{flex:1;min-width:0}.environment-name[data-v-6932e45c]{font-weight:500}.environment-here[data-v-6932e45c]{margin-left:8px;color:var(--accent-text);font-size:12px}.environment-folder[data-v-6932e45c]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.environment-refusal[data-v-6932e45c]{margin:2px 0 0;color:var(--danger);font-size:12.5px}.settings-nav-item.current[data-v-a8905132]{background:var(--hover);color:var(--text)}.settings[data-v-a8905132]{display:flex;flex-direction:column;gap:16px}.settings-bar[data-v-a8905132]{display:flex;flex-wrap:wrap;gap:12px;align-items:center}.settings-search[data-v-a8905132]{flex:1;min-width:200px;max-width:360px}.settings-saved[data-v-a8905132]{color:var(--text-3);font-size:12px}.settings-search-field[data-v-a8905132]{width:100%;max-width:360px;padding:7px 12px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text)}.settings-body[data-v-a8905132]{display:flex;gap:28px;align-items:flex-start}.settings-nav[data-v-a8905132]{display:flex;flex:none;flex-direction:column;gap:2px;width:150px;position:sticky;top:0}.settings-nav-item[data-v-a8905132]{padding:5px 10px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-align:left;cursor:pointer}.settings-nav-item[data-v-a8905132]:hover{background:var(--hover);color:var(--text)}.settings-sections[data-v-a8905132]{display:flex;flex:1;flex-direction:column;gap:32px;min-width:0}.settings-module[data-v-a8905132]{display:flex;flex-direction:column;gap:18px}.settings-module-heading[data-v-a8905132]{margin:0;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--text-3)}.settings-failure[data-v-a8905132],.settings-empty[data-v-a8905132]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as m, ref as b, openBlock as t, createElementBlock as i, createElementVNode as u, toDisplayString as f, createBlock as x, unref as v, createCommentVNode as O, normalizeClass as z, Fragment as R, renderList as V, withDirectives as J, vModelText as Q, withCtx as L, createTextVNode as G, createVNode as P, onMounted as se, onUnmounted as ae, withKeys as oe } from "vue";
import { Switch as H, Btn as D, useRows as X, RowList as le, Segmented as W, Skeleton as ie } from "@journal/window-kit";
const Y = (e, n) => {
  const C = e.__vccOpts || e;
  for (const [S, j] of n)
    C[S] = j;
  return C;
}, re = ["data-setting"], ue = { class: "setting-group-head" }, de = { class: "setting-group-title" }, ce = { class: "setting-description" }, ve = {
  key: 0,
  class: "setting-refusal"
}, fe = ["data-setting"], ye = { class: "setting-head" }, ge = {
  key: 0,
  class: "setting-dot",
  "data-setting-changed": "",
  title: "Changed from the default"
}, me = ["for"], he = ["title"], ke = { class: "setting-description" }, we = { class: "setting-shown" }, pe = ["id", "disabled"], be = {
  key: 2,
  class: "setting-choices"
}, Ce = ["id", "value", "disabled"], Se = {
  key: 4,
  class: "setting-input"
}, $e = ["id", "type", "value", "disabled"], _e = {
  key: 0,
  class: "setting-unit",
  "data-setting-unit": ""
}, Oe = {
  key: 5,
  class: "setting-refusal"
}, xe = {
  __name: "SettingNode",
  props: {
    row: { type: Object, required: !0 },
    rows: { type: Array, required: !0 },
    readOnly: { type: Boolean, required: !0 },
    save: { type: Function, required: !0 }
  },
  setup(e) {
    const n = e, C = m(() => n.rows.filter((g) => g.parent === n.row.key)), S = m(() => n.row.type === "group"), j = m(() => n.row.scope === "project" ? ["--project"] : []), w = b(""), h = b(""), N = /* @__PURE__ */ new Set(["environment", "project"]), p = { seconds: "seconds", minutes: "minutes", hours: "hours", days: "days", bytes: "bytes", characters: "characters", percent: "%" }, $ = m(() => n.row.type === "number" ? p[n.row.key.split(/[-_.]/).at(-1)] ?? "" : ""), _ = m(() => n.row.type === "list" || n.row.type === "number list"), y = m(() => String(n.row.shown ?? "").split(",").map((g) => g.trim()).filter(Boolean).join(`
`)), l = m(() => N.has(n.row.source)), c = m(() => !n.readOnly && !n.row.secret && !S.value && l.value && n.row.default !== null && n.row.default !== void 0), E = m(() => typeof n.row.default == "boolean" ? n.row.default ? "on" : "off" : Array.isArray(n.row.default) ? n.row.default.join(",") : String(n.row.default));
    async function B(g) {
      const k = ["setting", "set", n.row.key, String(g), ...j.value], d = await n.save(k);
      d.ok ? w.value = "" : w.value = d.error;
    }
    async function M() {
      const g = await n.save(["setting", "switch", n.row.key, n.row.value === !1 ? "on" : "off", "--project"]);
      w.value = g.ok ? "" : g.error;
    }
    function q(g) {
      B(g.target.value);
    }
    function F(g) {
      B(g.target.value.split(`
`).map((k) => k.trim()).filter(Boolean).join(","));
    }
    function A() {
      h.value && B(h.value).then(() => h.value = "");
    }
    return (g, k) => S.value ? (t(), i("section", {
      key: 0,
      class: "setting-group",
      "data-setting": e.row.key
    }, [
      u("div", ue, [
        u("h3", de, f(e.row.title), 1),
        e.row.toggleable && !e.readOnly ? (t(), x(v(H), {
          key: 0,
          on: e.row.value !== !1,
          title: `Switch ${e.row.title} ${e.row.value === !1 ? "on" : "off"}`,
          "data-group-switch": "",
          onChange: M
        }, null, 8, ["on", "title"])) : O("", !0)
      ]),
      u("p", ce, f(e.row.description), 1),
      u("div", {
        class: z(["setting-children", { off: e.row.value === !1 }])
      }, [
        (t(!0), i(R, null, V(C.value, (d) => (t(), x(Z, {
          key: d.key,
          row: d,
          rows: e.rows,
          "read-only": e.readOnly,
          save: e.save
        }, null, 8, ["row", "rows", "read-only", "save"]))), 128))
      ], 2),
      w.value ? (t(), i("p", ve, f(w.value), 1)) : O("", !0)
    ], 8, re)) : (t(), i("div", {
      key: 1,
      class: "setting-value",
      "data-setting": e.row.key
    }, [
      u("div", ye, [
        l.value ? (t(), i("span", ge)) : O("", !0),
        u("label", {
          class: "setting-label",
          for: e.row.key
        }, f(e.row.title), 9, me),
        c.value ? (t(), i("button", {
          key: 1,
          type: "button",
          class: "setting-reset",
          "data-setting-reset": "",
          title: `Back to the default: ${E.value}`,
          onClick: k[0] || (k[0] = (d) => B(E.value))
        }, "Reset", 8, he)) : O("", !0)
      ]),
      u("p", ke, f(e.row.description), 1),
      e.row.secret ? (t(), i(R, { key: 0 }, [
        u("p", we, f(e.row.shown), 1),
        J(u("input", {
          id: e.row.key,
          "onUpdate:modelValue": k[1] || (k[1] = (d) => h.value = d),
          class: "setting-field",
          type: "password",
          disabled: e.readOnly,
          placeholder: "Type a new value",
          onChange: A
        }, null, 40, pe), [
          [Q, h.value]
        ])
      ], 64)) : e.row.type === "flag" ? (t(), x(v(H), {
        key: 1,
        on: e.row.value === !0,
        title: e.row.title,
        disabled: e.readOnly,
        "data-flag-switch": "",
        onChange: k[2] || (k[2] = (d) => !e.readOnly && B(d ? "on" : "off"))
      }, null, 8, ["on", "title", "disabled"])) : e.row.type === "choice" ? (t(), i("div", be, [
        (t(!0), i(R, null, V(e.row.choices, (d) => (t(), x(v(D), {
          key: d,
          small: "",
          kind: d === e.row.value ? "primary" : "ghost",
          "data-choice": d,
          disabled: e.readOnly,
          onClick: (U) => B(d)
        }, {
          default: L(() => [
            G(f(d), 1)
          ]),
          _: 2
        }, 1032, ["kind", "data-choice", "disabled", "onClick"]))), 128))
      ])) : _.value ? (t(), i("textarea", {
        key: 3,
        id: e.row.key,
        class: "setting-field setting-list",
        rows: "3",
        value: y.value,
        disabled: e.readOnly,
        placeholder: "One on each line",
        "data-setting-list": "",
        onChange: F
      }, null, 40, Ce)) : (t(), i("div", Se, [
        u("input", {
          id: e.row.key,
          class: "setting-field",
          type: e.row.type === "number" ? "number" : "text",
          value: e.row.value,
          disabled: e.readOnly,
          onChange: q
        }, null, 40, $e),
        $.value ? (t(), i("span", _e, f($.value), 1)) : O("", !0)
      ])),
      w.value ? (t(), i("p", Oe, f(w.value), 1)) : O("", !0)
    ], 8, fe));
  }
}, Z = /* @__PURE__ */ Y(xe, [["__scopeId", "data-v-fe240729"]]), je = ["data-environment"], Ne = { class: "environment-names" }, Ee = { class: "environment-name" }, Be = {
  key: 0,
  class: "environment-here"
}, Re = { class: "environment-folder" }, Te = {
  key: 1,
  class: "environment-refusal",
  role: "alert",
  "data-environment-refusal": ""
}, Ae = {
  __name: "SettingsEnvironments",
  setup(e) {
    const { rows: n, failure: C, loaded: S, load: j, context: w } = X("environment list", ["environment.*"]), h = b(0), N = b({}), p = (y) => y.name === w.environment, $ = m(() => [...n.value].sort((y, l) => p(l) - p(y) || y.name.localeCompare(l.name)));
    async function _(y) {
      if (h.value !== y.id) return void (h.value = y.id);
      const l = await w.run(["environment", "delete", String(y.id)]);
      N.value = { ...N.value, [y.id]: l.ok ? "" : l.error }, h.value = 0, l.ok && j();
    }
    return (y, l) => (t(), x(v(le), {
      rows: $.value,
      failure: v(C),
      loaded: v(S),
      empty: "No environments yet"
    }, {
      default: L(({ row: c }) => [
        u("div", {
          class: "environment",
          "data-environment": c.name
        }, [
          u("div", Ne, [
            u("span", Ee, f(c.name), 1),
            p(c) ? (t(), i("span", Be, "You are here")) : O("", !0),
            u("p", Re, f(c.folder) + " on " + f(c.branch), 1),
            N.value[c.id] ? (t(), i("p", Te, f(N.value[c.id]), 1)) : O("", !0)
          ]),
          h.value === c.id ? (t(), i(R, { key: 0 }, [
            P(v(D), {
              small: "",
              "data-environment-keep": "",
              onClick: l[0] || (l[0] = (E) => h.value = 0)
            }, {
              default: L(() => [...l[1] || (l[1] = [
                G("Keep it", -1)
              ])]),
              _: 1
            }),
            P(v(D), {
              small: "",
              kind: "danger",
              "data-environment-confirm": "",
              onClick: (E) => _(c)
            }, {
              default: L(() => [...l[2] || (l[2] = [
                G("Yes, remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ], 64)) : (t(), x(v(D), {
            key: 1,
            small: "",
            kind: "danger",
            "data-environment-remove": "",
            disabled: p(c),
            title: p(c) ? "Switch to another environment to remove this one" : "Remove this environment",
            onClick: (E) => _(c)
          }, {
            default: L(() => [...l[3] || (l[3] = [
              G("Remove environment", -1)
            ])]),
            _: 1
          }, 8, ["disabled", "title", "onClick"]))
        ], 8, je)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, Ie = /* @__PURE__ */ Y(Ae, [["__scopeId", "data-v-6932e45c"]]), Le = { class: "settings" }, Ve = { class: "settings-bar" }, qe = { class: "settings-search" }, Fe = {
  key: 1,
  class: "settings-failure"
}, Ue = {
  key: 2,
  class: "settings-empty"
}, Ge = { class: "settings-body" }, De = {
  class: "settings-nav",
  "aria-label": "Modules"
}, Pe = ["data-jump", "onClick"], Me = ["data-module"], Ye = { class: "settings-module-heading" }, Ke = "input,textarea,select,[contenteditable]", He = 12, We = {
  __name: "SettingsTree",
  setup(e) {
    const n = /* @__PURE__ */ new Set(["environment", "project"]), { rows: C, failure: S, loaded: j, load: w, context: h } = X("setting tree", ["setting.*"]), N = [
      { key: "settings", label: "Settings" },
      { key: "environments", label: "Environments" }
    ], p = b("settings"), $ = b(""), _ = b("all"), y = b(null), l = m(() => C.value.filter((a) => !a.key.endsWith(".*"))), c = (a) => a.type !== "group" && n.has(a.source), E = (a) => a.value === !1, B = { all: () => !0, changed: c, off: E }, M = m(() => [
      { key: "all", label: "All" },
      { key: "changed", label: "Changed", title: "Settings you changed from their default", count: l.value.filter(c).length },
      { key: "off", label: "Off", count: l.value.filter(E).length }
    ]), q = m(() => {
      const a = $.value.trim().toLowerCase();
      if (!a && _.value === "all") return l.value;
      const o = l.value.filter((r) => B[_.value](r) && [r.title, r.description, r.key].join(" ").toLowerCase().includes(a)), s = new Set(o.map((r) => r.key));
      for (const r of o)
        for (let T = l.value.find((I) => I.key === r.parent); T; T = l.value.find((I) => I.key === T.parent)) s.add(T.key);
      return l.value.filter((r) => s.has(r.key));
    }), F = m(() => q.value.filter((a) => a.parent === null)), A = m(() => [...new Set(F.value.map((a) => a.module))]), g = h.face === "phone";
    function k(a) {
      const o = a.split("."), s = o[o.length - 1].replace(/[-_]/g, " ");
      return s.slice(0, 1).toUpperCase() + s.slice(1);
    }
    const d = b(""), U = b(null);
    function ee(a) {
      var o;
      d.value = a, (o = document.querySelector(`[data-module="${a}"]`)) == null || o.scrollIntoView({ block: "start" });
    }
    function te() {
      var s, r, T;
      const a = ((s = U.value) == null ? void 0 : s.getBoundingClientRect().top) ?? 0, o = [...((r = U.value) == null ? void 0 : r.querySelectorAll("[data-module]")) ?? []].filter((I) => I.getBoundingClientRect().top <= a + He);
      d.value = ((T = o.at(-1)) == null ? void 0 : T.dataset.module) ?? A.value[0] ?? "";
    }
    function K(a) {
      var o, s, r;
      a.key !== "/" || (s = (o = a.target).closest) != null && s.call(o, Ke) || (a.preventDefault(), (r = y.value) == null || r.focus());
    }
    se(() => window.addEventListener("keydown", K)), ae(() => window.removeEventListener("keydown", K));
    async function ne(a) {
      const o = await h.run(a);
      return o.ok && w(), o;
    }
    return (a, o) => (t(), i("div", Le, [
      P(v(W), {
        options: N,
        value: p.value,
        "data-settings-tabs": "",
        onPick: o[0] || (o[0] = (s) => p.value = s)
      }, null, 8, ["value"]),
      p.value === "environments" ? (t(), x(Ie, { key: 0 })) : (t(), i(R, { key: 1 }, [
        u("div", Ve, [
          u("label", qe, [
            J(u("input", {
              ref_key: "field",
              ref: y,
              "onUpdate:modelValue": o[1] || (o[1] = (s) => $.value = s),
              class: "settings-search-field",
              type: "search",
              placeholder: "Find a setting",
              "aria-label": "Find a setting",
              onKeydown: o[2] || (o[2] = oe((s) => $.value = "", ["esc"]))
            }, null, 544), [
              [Q, $.value]
            ])
          ]),
          P(v(W), {
            options: M.value,
            value: _.value,
            "data-settings-filter": "",
            onPick: o[3] || (o[3] = (s) => _.value = s)
          }, null, 8, ["options", "value"]),
          o[4] || (o[4] = u("span", { class: "settings-saved" }, "Changes are saved as you make them", -1))
        ]),
        v(j) ? v(S) ? (t(), i("p", Fe, f(v(S)), 1)) : v(j) && !v(C).length ? (t(), i("p", Ue, "No module declares a setting.")) : O("", !0) : (t(), x(v(ie), {
          key: 0,
          shape: "text"
        })),
        u("div", Ge, [
          u("nav", De, [
            (t(!0), i(R, null, V(A.value, (s) => (t(), i("button", {
              key: s,
              type: "button",
              class: z(["settings-nav-item", { current: s === (d.value || A.value[0]) }]),
              "data-jump": s,
              onClick: (r) => ee(s)
            }, f(k(s)), 11, Pe))), 128))
          ]),
          u("div", {
            ref_key: "sections",
            ref: U,
            class: "settings-sections",
            "data-settings-sections": "",
            onScrollPassive: te
          }, [
            (t(!0), i(R, null, V(A.value, (s) => (t(), i("section", {
              key: s,
              class: "settings-module",
              "data-module": s
            }, [
              u("h3", Ye, f(k(s)), 1),
              (t(!0), i(R, null, V(F.value.filter((r) => r.module === s), (r) => (t(), x(Z, {
                key: r.key,
                row: r,
                rows: q.value,
                "read-only": g,
                save: ne
              }, null, 8, ["row", "rows"]))), 128))
            ], 8, Me))), 128))
          ], 544)
        ])
      ], 64))
    ]));
  }
}, Qe = /* @__PURE__ */ Y(We, [["__scopeId", "data-v-a8905132"]]);
export {
  Qe as default
};
