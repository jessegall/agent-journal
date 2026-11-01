/* @code-commandments-generated */
if (!document.getElementById("window-styles-5e2388971e7d")) { const style = document.createElement("style"); style.id = "window-styles-5e2388971e7d"; style.textContent = ".setting-input[data-v-fe240729]{display:flex;gap:8px;align-items:center}.setting-unit[data-v-fe240729]{flex:none;color:var(--text-3);font-size:12px}.setting-list[data-v-fe240729]{resize:vertical}.setting-head[data-v-fe240729]{display:flex;gap:6px;align-items:center}.setting-dot[data-v-fe240729]{width:6px;height:6px;border-radius:50%;background:var(--accent)}.setting-reset[data-v-fe240729]{margin-left:auto;padding:0 6px;border:0;border-radius:5px;background:none;color:var(--text-3);font:inherit;font-size:11.5px;cursor:pointer}.setting-reset[data-v-fe240729]:hover{background:var(--hover);color:var(--text)}.setting-group[data-v-fe240729]{display:flex;flex-direction:column;gap:6px}.setting-group-head[data-v-fe240729]{display:flex;align-items:center;gap:10px}.setting-group-title[data-v-fe240729]{margin:0;font-size:13px;font-weight:600}.setting-children[data-v-fe240729]{display:flex;flex-direction:column;gap:14px;padding-left:14px;border-left:1px solid var(--line)}.setting-children.off[data-v-fe240729]{opacity:.5}.setting-value[data-v-fe240729]{display:flex;flex-direction:column;gap:4px}.setting-label[data-v-fe240729]{font-size:12px;color:var(--text)}.setting-description[data-v-fe240729],.setting-shown[data-v-fe240729]{margin:0;font-size:12px;color:var(--text-3)}.setting-field[data-v-fe240729]{max-width:360px;padding:6px 10px;border:1px solid var(--line);border-radius:6px;color:var(--text);background:transparent}.setting-switch[data-v-fe240729]{align-self:flex-start;padding:2px 10px;border:0;border-radius:10px;color:var(--text-2);background:var(--raised);font-size:11px;cursor:pointer}.setting-switch[aria-checked=true][data-v-fe240729]{color:#fff;background:var(--accent)}.setting-choices[data-v-fe240729]{display:flex;gap:6px}.setting-refusal[data-v-fe240729]{margin:0;font-size:12px;color:var(--danger)}.environment[data-v-6932e45c]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.environment-names[data-v-6932e45c]{flex:1;min-width:0}.environment-name[data-v-6932e45c]{font-weight:500}.environment-here[data-v-6932e45c]{margin-left:8px;color:var(--accent-text);font-size:12px}.environment-folder[data-v-6932e45c]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.environment-refusal[data-v-6932e45c]{margin:2px 0 0;color:var(--danger);font-size:12.5px}.settings-nav-item.current[data-v-21a6956e]{background:var(--hover);color:var(--text)}.settings[data-v-21a6956e]{display:flex;flex-direction:column;gap:16px}.settings-bar[data-v-21a6956e]{display:flex;flex-wrap:wrap;gap:12px;align-items:center}.settings-search[data-v-21a6956e]{flex:1;min-width:200px;max-width:360px}.settings-saved[data-v-21a6956e]{color:var(--text-3);font-size:12px}.settings-search-field[data-v-21a6956e]{width:100%;max-width:360px;padding:7px 12px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text)}.settings-body[data-v-21a6956e]{display:flex;gap:28px;align-items:flex-start}.settings-nav[data-v-21a6956e]{display:flex;flex:none;flex-direction:column;gap:2px;width:150px;position:sticky;top:0}.settings-nav-item[data-v-21a6956e]{padding:5px 10px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-align:left;cursor:pointer}.settings-nav-item[data-v-21a6956e]:hover{background:var(--hover);color:var(--text)}.settings-sections[data-v-21a6956e]{display:flex;flex:1;flex-direction:column;gap:32px;min-width:0}.settings-module[data-v-21a6956e]{display:flex;flex-direction:column;gap:18px}.settings-module-heading[data-v-21a6956e]{margin:0;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--text-3)}.settings-failure[data-v-21a6956e],.settings-empty[data-v-21a6956e]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as m, ref as b, openBlock as t, createElementBlock as i, createElementVNode as u, toDisplayString as f, createBlock as x, unref as v, createCommentVNode as O, normalizeClass as Q, Fragment as R, renderList as V, withDirectives as X, vModelText as Z, withCtx as I, createTextVNode as G, createVNode as M, onMounted as oe, onUnmounted as le, withKeys as ie } from "vue";
import { Switch as z, Btn as D, useRows as ee, RowList as re, Segmented as J, Skeleton as ue } from "@journal/window-kit";
const Y = (e, n) => {
  const C = e.__vccOpts || e;
  for (const [S, E] of n)
    C[S] = E;
  return C;
}, de = ["data-setting"], ce = { class: "setting-group-head" }, ve = { class: "setting-group-title" }, fe = { class: "setting-description" }, ge = {
  key: 0,
  class: "setting-refusal"
}, ye = ["data-setting"], me = { class: "setting-head" }, he = {
  key: 0,
  class: "setting-dot",
  "data-setting-changed": "",
  title: "Changed from the default"
}, ke = ["for"], we = ["title"], pe = { class: "setting-description" }, be = { class: "setting-shown" }, Ce = ["id", "disabled"], Se = {
  key: 2,
  class: "setting-choices"
}, $e = ["id", "value", "disabled"], _e = {
  key: 4,
  class: "setting-input"
}, Oe = ["id", "type", "value", "disabled"], xe = {
  key: 0,
  class: "setting-unit",
  "data-setting-unit": ""
}, Ee = {
  key: 5,
  class: "setting-refusal"
}, je = {
  __name: "SettingNode",
  props: {
    row: { type: Object, required: !0 },
    rows: { type: Array, required: !0 },
    readOnly: { type: Boolean, required: !0 },
    save: { type: Function, required: !0 }
  },
  setup(e) {
    const n = e, C = m(() => n.rows.filter((y) => y.parent === n.row.key)), S = m(() => n.row.type === "group"), E = m(() => n.row.scope === "project" ? ["--project"] : []), w = b(""), h = b(""), j = /* @__PURE__ */ new Set(["environment", "project"]), p = { seconds: "seconds", minutes: "minutes", hours: "hours", days: "days", bytes: "bytes", characters: "characters", percent: "%" }, $ = m(() => n.row.type === "number" ? p[n.row.key.split(/[-_.]/).at(-1)] ?? "" : ""), _ = m(() => n.row.type === "list" || n.row.type === "number list"), g = m(() => String(n.row.shown ?? "").split(",").map((y) => y.trim()).filter(Boolean).join(`
`)), l = m(() => j.has(n.row.source)), c = m(() => !n.readOnly && !n.row.secret && !S.value && l.value && n.row.default !== null && n.row.default !== void 0), N = m(() => typeof n.row.default == "boolean" ? n.row.default ? "on" : "off" : Array.isArray(n.row.default) ? n.row.default.join(",") : String(n.row.default));
    async function B(y) {
      const k = ["setting", "set", n.row.key, String(y), ...E.value], d = await n.save(k);
      d.ok ? w.value = "" : w.value = d.error;
    }
    async function P() {
      const y = await n.save(["setting", "switch", n.row.key, n.row.value === !1 ? "on" : "off", "--project"]);
      w.value = y.ok ? "" : y.error;
    }
    function q(y) {
      B(y.target.value);
    }
    function F(y) {
      B(y.target.value.split(`
`).map((k) => k.trim()).filter(Boolean).join(","));
    }
    function T() {
      h.value && B(h.value).then(() => h.value = "");
    }
    return (y, k) => S.value ? (t(), i("section", {
      key: 0,
      class: "setting-group",
      "data-setting": e.row.key
    }, [
      u("div", ce, [
        u("h3", ve, f(e.row.title), 1),
        e.row.toggleable && !e.readOnly ? (t(), x(v(z), {
          key: 0,
          on: e.row.value !== !1,
          title: `Switch ${e.row.title} ${e.row.value === !1 ? "on" : "off"}`,
          "data-group-switch": "",
          onChange: P
        }, null, 8, ["on", "title"])) : O("", !0)
      ]),
      u("p", fe, f(e.row.description), 1),
      u("div", {
        class: Q(["setting-children", { off: e.row.value === !1 }])
      }, [
        (t(!0), i(R, null, V(C.value, (d) => (t(), x(te, {
          key: d.key,
          row: d,
          rows: e.rows,
          "read-only": e.readOnly,
          save: e.save
        }, null, 8, ["row", "rows", "read-only", "save"]))), 128))
      ], 2),
      w.value ? (t(), i("p", ge, f(w.value), 1)) : O("", !0)
    ], 8, de)) : (t(), i("div", {
      key: 1,
      class: "setting-value",
      "data-setting": e.row.key
    }, [
      u("div", me, [
        l.value ? (t(), i("span", he)) : O("", !0),
        u("label", {
          class: "setting-label",
          for: e.row.key
        }, f(e.row.title), 9, ke),
        c.value ? (t(), i("button", {
          key: 1,
          type: "button",
          class: "setting-reset",
          "data-setting-reset": "",
          title: `Back to the default: ${N.value}`,
          onClick: k[0] || (k[0] = (d) => B(N.value))
        }, "Reset", 8, we)) : O("", !0)
      ]),
      u("p", pe, f(e.row.description), 1),
      e.row.secret ? (t(), i(R, { key: 0 }, [
        u("p", be, f(e.row.shown), 1),
        X(u("input", {
          id: e.row.key,
          "onUpdate:modelValue": k[1] || (k[1] = (d) => h.value = d),
          class: "setting-field",
          type: "password",
          disabled: e.readOnly,
          placeholder: "Type a new value",
          onChange: T
        }, null, 40, Ce), [
          [Z, h.value]
        ])
      ], 64)) : e.row.type === "flag" ? (t(), x(v(z), {
        key: 1,
        on: e.row.value === !0,
        title: e.row.title,
        disabled: e.readOnly,
        "data-flag-switch": "",
        onChange: k[2] || (k[2] = (d) => !e.readOnly && B(d ? "on" : "off"))
      }, null, 8, ["on", "title", "disabled"])) : e.row.type === "choice" ? (t(), i("div", Se, [
        (t(!0), i(R, null, V(e.row.choices, (d) => (t(), x(v(D), {
          key: d,
          small: "",
          kind: d === e.row.value ? "primary" : "ghost",
          "data-choice": d,
          disabled: e.readOnly,
          onClick: (U) => B(d)
        }, {
          default: I(() => [
            G(f(d), 1)
          ]),
          _: 2
        }, 1032, ["kind", "data-choice", "disabled", "onClick"]))), 128))
      ])) : _.value ? (t(), i("textarea", {
        key: 3,
        id: e.row.key,
        class: "setting-field setting-list",
        rows: "3",
        value: g.value,
        disabled: e.readOnly,
        placeholder: "One on each line",
        "data-setting-list": "",
        onChange: F
      }, null, 40, $e)) : (t(), i("div", _e, [
        u("input", {
          id: e.row.key,
          class: "setting-field",
          type: e.row.type === "number" ? "number" : "text",
          value: e.row.value,
          disabled: e.readOnly,
          onChange: q
        }, null, 40, Oe),
        $.value ? (t(), i("span", xe, f($.value), 1)) : O("", !0)
      ])),
      w.value ? (t(), i("p", Ee, f(w.value), 1)) : O("", !0)
    ], 8, ye));
  }
}, te = /* @__PURE__ */ Y(je, [["__scopeId", "data-v-fe240729"]]), Ne = ["data-environment"], Be = { class: "environment-names" }, Re = { class: "environment-name" }, Le = {
  key: 0,
  class: "environment-here"
}, Te = { class: "environment-folder" }, Ae = {
  key: 1,
  class: "environment-refusal",
  role: "alert",
  "data-environment-refusal": ""
}, Ie = {
  __name: "SettingsEnvironments",
  setup(e) {
    const { rows: n, failure: C, loaded: S, load: E, context: w } = ee("environment list", ["environment.*"]), h = b(0), j = b({}), p = (g) => g.name === w.environment, $ = m(() => [...n.value].sort((g, l) => p(l) - p(g) || g.name.localeCompare(l.name)));
    async function _(g) {
      if (h.value !== g.id) return void (h.value = g.id);
      const l = await w.run(["environment", "delete", String(g.id)]);
      j.value = { ...j.value, [g.id]: l.ok ? "" : l.error }, h.value = 0, l.ok && E();
    }
    return (g, l) => (t(), x(v(re), {
      rows: $.value,
      failure: v(C),
      loaded: v(S),
      empty: "No environments yet"
    }, {
      default: I(({ row: c }) => [
        u("div", {
          class: "environment",
          "data-environment": c.name
        }, [
          u("div", Be, [
            u("span", Re, f(c.name), 1),
            p(c) ? (t(), i("span", Le, "You are here")) : O("", !0),
            u("p", Te, f(c.folder) + " on " + f(c.branch), 1),
            j.value[c.id] ? (t(), i("p", Ae, f(j.value[c.id]), 1)) : O("", !0)
          ]),
          h.value === c.id ? (t(), i(R, { key: 0 }, [
            M(v(D), {
              small: "",
              "data-environment-keep": "",
              onClick: l[0] || (l[0] = (N) => h.value = 0)
            }, {
              default: I(() => [...l[1] || (l[1] = [
                G("Keep it", -1)
              ])]),
              _: 1
            }),
            M(v(D), {
              small: "",
              kind: "danger",
              "data-environment-confirm": "",
              onClick: (N) => _(c)
            }, {
              default: I(() => [...l[2] || (l[2] = [
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
            onClick: (N) => _(c)
          }, {
            default: I(() => [...l[3] || (l[3] = [
              G("Remove environment", -1)
            ])]),
            _: 1
          }, 8, ["disabled", "title", "onClick"]))
        ], 8, Ne)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, Ve = /* @__PURE__ */ Y(Ie, [["__scopeId", "data-v-6932e45c"]]), qe = { class: "settings" }, Fe = { class: "settings-bar" }, Ue = { class: "settings-search" }, Ge = {
  key: 1,
  class: "settings-failure"
}, De = {
  key: 2,
  class: "settings-empty"
}, Me = { class: "settings-body" }, Pe = {
  class: "settings-nav",
  "aria-label": "Modules"
}, Ye = ["data-jump", "onClick"], Ke = ["data-module"], He = { class: "settings-module-heading" }, We = "input,textarea,select,[contenteditable]", ze = 12, Je = {
  __name: "SettingsTree",
  setup(e) {
    const n = /* @__PURE__ */ new Set(["environment", "project"]), { rows: C, failure: S, loaded: E, load: w, context: h } = ee("setting tree", ["setting.*"]), j = [
      { key: "settings", label: "Settings" },
      { key: "environments", label: "Environments" }
    ], p = b("settings"), $ = b(""), _ = b("all"), g = b(null), l = m(() => C.value.filter((s) => !s.key.endsWith(".*"))), c = (s) => s.type !== "group" && n.has(s.source), N = (s) => s.value === !1, B = { all: () => !0, changed: c, off: N }, P = m(() => [
      { key: "all", label: "All" },
      { key: "changed", label: "Changed", title: "Settings you changed from their default", count: l.value.filter(c).length },
      { key: "off", label: "Off", count: l.value.filter(N).length }
    ]), q = m(() => {
      const s = $.value.trim().toLowerCase();
      if (!s && _.value === "all") return l.value;
      const o = l.value.filter((r) => B[_.value](r) && [r.title, r.description, r.key].join(" ").toLowerCase().includes(s)), a = new Set(o.map((r) => r.key));
      for (const r of o)
        for (let L = l.value.find((A) => A.key === r.parent); L; L = l.value.find((A) => A.key === L.parent)) a.add(L.key);
      return l.value.filter((r) => a.has(r.key));
    }), F = m(() => q.value.filter((s) => s.parent === null)), T = m(() => [...new Set(F.value.map((s) => s.module))]), y = h.face === "phone";
    function k(s) {
      const o = s.split("."), a = o[o.length - 1].replace(/[-_]/g, " ");
      return a.slice(0, 1).toUpperCase() + a.slice(1);
    }
    const d = b(""), U = b(null);
    function ne(s) {
      var o;
      d.value = s, (o = document.querySelector(`[data-module="${s}"]`)) == null || o.scrollIntoView({ block: "start" });
    }
    function K(s) {
      var r, L, A, W;
      if (!((L = (r = s.target).contains) != null && L.call(r, U.value))) return;
      const o = s.target.getBoundingClientRect().top, a = [...((A = U.value) == null ? void 0 : A.querySelectorAll("[data-module]")) ?? []].filter((ae) => ae.getBoundingClientRect().top <= o + ze);
      d.value = ((W = a.at(-1)) == null ? void 0 : W.dataset.module) ?? T.value[0] ?? "";
    }
    function H(s) {
      var o, a, r;
      s.key !== "/" || (a = (o = s.target).closest) != null && a.call(o, We) || (s.preventDefault(), (r = g.value) == null || r.focus());
    }
    oe(() => {
      window.addEventListener("keydown", H), document.addEventListener("scroll", K, { capture: !0, passive: !0 });
    }), le(() => {
      window.removeEventListener("keydown", H), document.removeEventListener("scroll", K, { capture: !0 });
    });
    async function se(s) {
      const o = await h.run(s);
      return o.ok && w(), o;
    }
    return (s, o) => (t(), i("div", qe, [
      M(v(J), {
        options: j,
        value: p.value,
        "data-settings-tabs": "",
        onPick: o[0] || (o[0] = (a) => p.value = a)
      }, null, 8, ["value"]),
      p.value === "environments" ? (t(), x(Ve, { key: 0 })) : (t(), i(R, { key: 1 }, [
        u("div", Fe, [
          u("label", Ue, [
            X(u("input", {
              ref_key: "field",
              ref: g,
              "onUpdate:modelValue": o[1] || (o[1] = (a) => $.value = a),
              class: "settings-search-field",
              type: "search",
              placeholder: "Find a setting",
              "aria-label": "Find a setting",
              onKeydown: o[2] || (o[2] = ie((a) => $.value = "", ["esc"]))
            }, null, 544), [
              [Z, $.value]
            ])
          ]),
          M(v(J), {
            options: P.value,
            value: _.value,
            "data-settings-filter": "",
            onPick: o[3] || (o[3] = (a) => _.value = a)
          }, null, 8, ["options", "value"]),
          o[4] || (o[4] = u("span", { class: "settings-saved" }, "Changes are saved as you make them", -1))
        ]),
        v(E) ? v(S) ? (t(), i("p", Ge, f(v(S)), 1)) : v(E) && !v(C).length ? (t(), i("p", De, "No module declares a setting.")) : O("", !0) : (t(), x(v(ue), {
          key: 0,
          shape: "text"
        })),
        u("div", Me, [
          u("nav", Pe, [
            (t(!0), i(R, null, V(T.value, (a) => (t(), i("button", {
              key: a,
              type: "button",
              class: Q(["settings-nav-item", { current: a === (d.value || T.value[0]) }]),
              "data-jump": a,
              onClick: (r) => ne(a)
            }, f(k(a)), 11, Ye))), 128))
          ]),
          u("div", {
            ref_key: "sections",
            ref: U,
            class: "settings-sections",
            "data-settings-sections": ""
          }, [
            (t(!0), i(R, null, V(T.value, (a) => (t(), i("section", {
              key: a,
              class: "settings-module",
              "data-module": a
            }, [
              u("h3", He, f(k(a)), 1),
              (t(!0), i(R, null, V(F.value.filter((r) => r.module === a), (r) => (t(), x(te, {
                key: r.key,
                row: r,
                rows: q.value,
                "read-only": y,
                save: se
              }, null, 8, ["row", "rows"]))), 128))
            ], 8, Ke))), 128))
          ], 512)
        ])
      ], 64))
    ]));
  }
}, Ze = /* @__PURE__ */ Y(Je, [["__scopeId", "data-v-21a6956e"]]);
export {
  Ze as default
};
