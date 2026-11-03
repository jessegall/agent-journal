/* @code-commandments-generated */
if (!document.getElementById("window-styles-ac4c3ed54c90")) { const style = document.createElement("style"); style.id = "window-styles-ac4c3ed54c90"; style.textContent = ".setting-input[data-v-796b5794]{display:flex;gap:8px;align-items:center}.setting-unit[data-v-796b5794]{flex:none;color:var(--text-3);font-size:12px}.setting-list[data-v-796b5794]{resize:vertical}.setting-head[data-v-796b5794]{display:flex;gap:6px;align-items:center}.setting-dot[data-v-796b5794]{width:6px;height:6px;border-radius:50%;background:var(--accent)}.setting-reset[data-v-796b5794]{margin-left:auto;padding:0 6px;border:0;border-radius:5px;background:none;color:var(--text-3);font:inherit;font-size:11.5px;cursor:pointer}.setting-reset[data-v-796b5794]:hover{background:var(--hover);color:var(--text)}.setting-group[data-v-796b5794]{display:flex;flex-direction:column;gap:6px}.setting-group-head[data-v-796b5794]{display:flex;align-items:center;gap:10px}.setting-group-title[data-v-796b5794]{margin:0;font-size:13px;font-weight:600}.setting-children[data-v-796b5794]{display:flex;flex-direction:column;gap:14px;padding-left:14px;border-left:1px solid var(--line)}.setting-children.off[data-v-796b5794]{opacity:.5}.setting-value[data-v-796b5794]{display:flex;flex-direction:column;gap:4px}.setting-label[data-v-796b5794]{font-size:12px;color:var(--text)}.setting-description[data-v-796b5794],.setting-shown[data-v-796b5794]{margin:0;font-size:12px;color:var(--text-3)}.setting-field[data-v-796b5794]{max-width:360px;padding:6px 10px;border:1px solid var(--line);border-radius:6px;color:var(--text);background:transparent}.setting-switch[data-v-796b5794]{align-self:flex-start;padding:2px 10px;border:0;border-radius:10px;color:var(--text-2);background:var(--raised);font-size:11px;cursor:pointer}.setting-switch[aria-checked=true][data-v-796b5794]{color:#fff;background:var(--accent)}.setting-choices[data-v-796b5794]{display:flex;gap:6px}.setting-refusal[data-v-796b5794]{margin:0;font-size:12px;color:var(--danger)}.environment[data-v-f4755e01]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.environment-names[data-v-f4755e01]{flex:1;min-width:0}.environment-name[data-v-f4755e01]{font-weight:500}.environment-here[data-v-f4755e01]{margin-left:8px;color:var(--accent-text);font-size:12px}.environment-folder[data-v-f4755e01]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.environment-refusal[data-v-f4755e01]{margin:2px 0 0;color:var(--danger);font-size:12.5px}.settings-nav-item.current[data-v-9ca5647a]{background:var(--hover);color:var(--text)}.settings[data-v-9ca5647a]{display:flex;flex-direction:column;gap:16px}.settings-bar[data-v-9ca5647a]{display:flex;flex-wrap:wrap;gap:12px;align-items:center}.settings-search[data-v-9ca5647a]{flex:1;min-width:200px;max-width:360px}.settings-saved[data-v-9ca5647a]{color:var(--text-3);font-size:12px}.settings-search-field[data-v-9ca5647a]{width:100%;max-width:360px;padding:7px 12px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text)}.settings-body[data-v-9ca5647a]{display:flex;gap:28px;align-items:flex-start}.settings-nav[data-v-9ca5647a]{display:flex;flex:none;flex-direction:column;gap:2px;width:150px;position:sticky;top:0}.settings-nav-item[data-v-9ca5647a]{padding:5px 10px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-align:left;cursor:pointer}.settings-nav-item[data-v-9ca5647a]:hover{background:var(--hover);color:var(--text)}.settings-sections[data-v-9ca5647a]{display:flex;flex:1;flex-direction:column;gap:32px;min-width:0}.settings-module[data-v-9ca5647a]{display:flex;flex-direction:column;gap:18px}.settings-module-heading[data-v-9ca5647a]{margin:0;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--text-3)}.settings-failure[data-v-9ca5647a],.settings-empty[data-v-9ca5647a]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as h, ref as N, openBlock as n, createElementBlock as o, createElementVNode as u, toDisplayString as f, createBlock as O, unref as g, createCommentVNode as _, normalizeClass as H, Fragment as B, renderList as x, withDirectives as z, vModelText as Q, withCtx as R, createTextVNode as I, createVNode as D, onMounted as te, onUnmounted as ne, withKeys as se } from "vue";
import { Switch as P, Btn as q, useRows as X, RowList as ae, removed as oe, Segmented as Y, Skeleton as le, patchedWhere as ie } from "@journal/window-kit";
const M = (e, t) => {
  const b = e.__vccOpts || e;
  for (const [S, j] of t)
    b[S] = j;
  return b;
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
}, Se = ["id", "value", "disabled"], Ce = {
  key: 4,
  class: "setting-input"
}, $e = ["id", "type", "value", "disabled"], _e = {
  key: 0,
  class: "setting-unit",
  "data-setting-unit": ""
}, Ne = {
  key: 5,
  class: "setting-refusal"
}, Oe = {
  __name: "SettingNode",
  props: {
    row: { type: Object, required: !0 },
    rows: { type: Array, required: !0 },
    readOnly: { type: Boolean, required: !0 },
    save: { type: Function, required: !0 }
  },
  setup(e) {
    const t = e, b = h(() => t.rows.filter((l) => l.parent === t.row.key)), S = h(() => t.row.type === "group"), j = h(() => t.row.scope === "project" ? ["--project"] : []), w = N(""), k = N(""), E = /* @__PURE__ */ new Set(["environment", "project"]), p = { seconds: "seconds", minutes: "minutes", hours: "hours", days: "days", bytes: "bytes", characters: "characters", percent: "%" }, C = h(() => t.row.type === "number" ? p[t.row.key.split(/[-_.]/).at(-1)] ?? "" : ""), $ = h(() => t.row.type === "list" || t.row.type === "number list"), m = h(() => t.row.value ? JSON.parse(t.row.value).join(`
`) : ""), a = h(() => E.has(t.row.source)), c = h(() => !t.readOnly && !t.row.secret && !S.value && a.value && t.row.default !== null && t.row.default !== void 0), A = h(() => typeof t.row.default == "boolean" ? t.row.default ? "on" : "off" : Array.isArray(t.row.default) ? t.row.default.join(",") : String(t.row.default));
    function G(l) {
      if (t.row.type === "flag") return l === "on";
      if (t.row.type === "number") return Number.isNaN(Number(l)) ? l : Number(l);
      if (t.row.type === "list" || t.row.type === "number list") {
        const y = l.startsWith("[") ? JSON.parse(l) : l.split(",").map((i) => i.trim()).filter(Boolean);
        return JSON.stringify(t.row.type === "number list" ? y.map(Number) : y);
      }
      return l;
    }
    async function T(l) {
      const y = ["setting", "set", t.row.key, String(l), ...j.value], i = await t.save(y, t.row.secret ? null : { key: t.row.key, value: G(String(l)) });
      i.ok ? w.value = "" : w.value = i.error;
    }
    async function F() {
      const l = await t.save(["setting", "switch", t.row.key, t.row.value === !1 ? "on" : "off", "--project"], { key: t.row.key, value: t.row.value === !1 });
      w.value = l.ok ? "" : l.error;
    }
    function U(l) {
      T(l.target.value);
    }
    function L(l) {
      const y = l.target.value.split(`
`).map((i) => i.trim()).filter(Boolean);
      T(t.row.type === "list" ? JSON.stringify(y) : y.join(","));
    }
    function J() {
      k.value && T(k.value).then(() => k.value = "");
    }
    return (l, y) => S.value ? (n(), o("section", {
      key: 0,
      class: "setting-group",
      "data-setting": e.row.key
    }, [
      u("div", ue, [
        u("h3", de, f(e.row.title), 1),
        e.row.toggleable && !e.readOnly ? (n(), O(g(P), {
          key: 0,
          on: e.row.value !== !1,
          title: `Switch ${e.row.title} ${e.row.value === !1 ? "on" : "off"}`,
          "data-group-switch": "",
          onChange: F
        }, null, 8, ["on", "title"])) : _("", !0)
      ]),
      u("p", ce, f(e.row.description), 1),
      u("div", {
        class: H(["setting-children", { off: e.row.value === !1 }])
      }, [
        (n(!0), o(B, null, x(b.value, (i) => (n(), O(Z, {
          key: i.key,
          row: i,
          rows: e.rows,
          "read-only": e.readOnly,
          save: e.save
        }, null, 8, ["row", "rows", "read-only", "save"]))), 128))
      ], 2),
      w.value ? (n(), o("p", ve, f(w.value), 1)) : _("", !0)
    ], 8, re)) : (n(), o("div", {
      key: 1,
      class: "setting-value",
      "data-setting": e.row.key
    }, [
      u("div", ye, [
        a.value ? (n(), o("span", ge)) : _("", !0),
        u("label", {
          class: "setting-label",
          for: e.row.key
        }, f(e.row.title), 9, me),
        c.value ? (n(), o("button", {
          key: 1,
          type: "button",
          class: "setting-reset",
          "data-setting-reset": "",
          title: `Back to the default: ${A.value}`,
          onClick: y[0] || (y[0] = (i) => T(A.value))
        }, "Reset", 8, he)) : _("", !0)
      ]),
      u("p", ke, f(e.row.description), 1),
      e.row.secret ? (n(), o(B, { key: 0 }, [
        u("p", we, f(e.row.shown), 1),
        z(u("input", {
          id: e.row.key,
          "onUpdate:modelValue": y[1] || (y[1] = (i) => k.value = i),
          class: "setting-field",
          type: "password",
          disabled: e.readOnly,
          placeholder: "Type a new value",
          onChange: J
        }, null, 40, pe), [
          [Q, k.value]
        ])
      ], 64)) : e.row.type === "flag" ? (n(), O(g(P), {
        key: 1,
        on: e.row.value === !0,
        title: e.row.title,
        disabled: e.readOnly,
        "data-flag-switch": "",
        onChange: y[2] || (y[2] = (i) => !e.readOnly && T(i ? "on" : "off"))
      }, null, 8, ["on", "title", "disabled"])) : e.row.type === "choice" ? (n(), o("div", be, [
        (n(!0), o(B, null, x(e.row.choices, (i) => (n(), O(g(q), {
          key: i,
          small: "",
          kind: i === e.row.value ? "primary" : "ghost",
          "data-choice": i,
          disabled: e.readOnly,
          onClick: (W) => T(i)
        }, {
          default: R(() => [
            I(f(i), 1)
          ]),
          _: 2
        }, 1032, ["kind", "data-choice", "disabled", "onClick"]))), 128))
      ])) : $.value ? (n(), o("textarea", {
        key: 3,
        id: e.row.key,
        class: "setting-field setting-list",
        rows: "3",
        value: m.value,
        disabled: e.readOnly,
        placeholder: "One on each line",
        "data-setting-list": "",
        onChange: L
      }, null, 40, Se)) : (n(), o("div", Ce, [
        u("input", {
          id: e.row.key,
          class: "setting-field",
          type: e.row.type === "number" ? "number" : "text",
          value: e.row.value,
          disabled: e.readOnly,
          onChange: U
        }, null, 40, $e),
        C.value ? (n(), o("span", _e, f(C.value), 1)) : _("", !0)
      ])),
      w.value ? (n(), o("p", Ne, f(w.value), 1)) : _("", !0)
    ], 8, fe));
  }
}, Z = /* @__PURE__ */ M(Oe, [["__scopeId", "data-v-796b5794"]]), je = ["data-environment"], Ee = { class: "environment-names" }, Ae = { class: "environment-name" }, Te = {
  key: 0,
  class: "environment-here"
}, Be = { class: "environment-folder" }, Le = {
  class: "environment-folder",
  "data-environment-state": ""
}, Re = {
  key: 1,
  class: "environment-refusal",
  role: "alert",
  "data-environment-refusal": ""
}, xe = {
  __name: "SettingsEnvironments",
  setup(e) {
    const { rows: t, failure: b, loaded: S, act: j, context: w } = X("environment cards", ["environment.*"]), k = N(0), E = N({}), p = (m) => m.name === w.environment, C = h(() => [...t.value].sort((m, a) => p(a) - p(m) || m.name.localeCompare(a.name)));
    async function $(m) {
      if (k.value !== m.id) return void (k.value = m.id);
      k.value = 0;
      const a = await j(["environment", "delete", String(m.id)], oe(m.id));
      E.value = { ...E.value, [m.id]: a.ok ? "" : a.error };
    }
    return (m, a) => (n(), O(g(ae), {
      rows: C.value,
      failure: g(b),
      loaded: g(S),
      empty: "No environments yet",
      hint: "An environment is one line of work in this project; make one to start."
    }, {
      default: R(({ row: c }) => [
        u("div", {
          class: "environment",
          "data-environment": c.name
        }, [
          u("div", Ee, [
            u("span", Ae, f(c.name), 1),
            p(c) ? (n(), o("span", Te, "You are here")) : _("", !0),
            u("p", Be, f(c.folder) + f(c.branch ? ` on ${c.branch}` : ""), 1),
            u("p", Le, f(c.running_agent_count ? "Agent running" : "No agent running") + " · " + f(c.unfinished_task_count) + " " + f(c.unfinished_task_count === 1 ? "task" : "tasks") + " not done", 1),
            E.value[c.id] ? (n(), o("p", Re, f(E.value[c.id]), 1)) : _("", !0)
          ]),
          k.value === c.id ? (n(), o(B, { key: 0 }, [
            D(g(q), {
              small: "",
              "data-environment-keep": "",
              onClick: a[0] || (a[0] = (A) => k.value = 0)
            }, {
              default: R(() => [...a[1] || (a[1] = [
                I("Keep it", -1)
              ])]),
              _: 1
            }),
            D(g(q), {
              small: "",
              kind: "danger",
              "data-environment-confirm": "",
              onClick: (A) => $(c)
            }, {
              default: R(() => [...a[2] || (a[2] = [
                I("Yes, remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ], 64)) : (n(), O(g(q), {
            key: 1,
            small: "",
            kind: "danger",
            "data-environment-remove": "",
            disabled: p(c),
            title: p(c) ? "Switch to another environment to remove this one" : "Remove this environment",
            onClick: (A) => $(c)
          }, {
            default: R(() => [...a[3] || (a[3] = [
              I("Remove environment", -1)
            ])]),
            _: 1
          }, 8, ["disabled", "title", "onClick"]))
        ], 8, je)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, Fe = /* @__PURE__ */ M(xe, [["__scopeId", "data-v-f4755e01"]]), Ue = { class: "settings" }, Ve = { class: "settings-bar" }, Ie = { class: "settings-search" }, qe = {
  key: 1,
  class: "settings-failure"
}, De = {
  key: 2,
  class: "settings-empty"
}, Ge = { class: "settings-body" }, Je = {
  class: "settings-nav",
  "aria-label": "Modules"
}, We = ["data-jump", "onClick"], Ke = {
  class: "settings-sections",
  "data-settings-sections": ""
}, Me = ["data-module"], Pe = { class: "settings-module-heading" }, Ye = "input,textarea,select,[contenteditable]", He = {
  __name: "SettingsTree",
  setup(e) {
    const t = /* @__PURE__ */ new Set(["environment", "project"]), { rows: b, failure: S, loaded: j, act: w, context: k } = X("setting tree", ["setting.*"]), E = [
      { key: "settings", label: "Settings" },
      { key: "environments", label: "Environments" }
    ], p = N("settings"), C = N(""), $ = N("all"), m = N(null), a = h(() => b.value.filter((d) => !d.key.endsWith(".*"))), c = (d) => d.type !== "group" && t.has(d.source), A = (d) => d.value === !1, G = { all: () => !0, changed: c, off: A }, T = h(() => [
      { key: "all", label: "All" },
      { key: "changed", label: "Changed", title: "Settings you changed from their default", count: a.value.filter(c).length },
      { key: "off", label: "Off", count: a.value.filter(A).length }
    ]), F = h(() => {
      const d = C.value.trim().toLowerCase();
      if (!d && $.value === "all") return a.value;
      const r = a.value.filter((v) => G[$.value](v) && [v.title, v.description, v.key].join(" ").toLowerCase().includes(d)), s = new Set(r.map((v) => v.key));
      for (const v of r)
        for (let V = a.value.find((K) => K.key === v.parent); V; V = a.value.find((K) => K.key === V.parent)) s.add(V.key);
      return a.value.filter((v) => s.has(v.key));
    }), U = h(() => F.value.filter((d) => d.parent === null)), L = h(() => [...new Set(U.value.map((d) => d.module))]), J = k.face === "phone";
    function l(d) {
      const r = d.split("."), s = r[r.length - 1].replace(/[-_]/g, " ");
      return s.slice(0, 1).toUpperCase() + s.slice(1);
    }
    const y = N(""), i = h(() => L.value.includes(y.value) ? y.value : L.value[0] ?? "");
    function W(d) {
      var r, s, v;
      d.key !== "/" || (s = (r = d.target).closest) != null && s.call(r, Ye) || (d.preventDefault(), (v = m.value) == null || v.focus());
    }
    te(() => {
      window.addEventListener("keydown", W);
    }), ne(() => {
      window.removeEventListener("keydown", W);
    });
    function ee(d, r) {
      return w(d, r && ie((s) => s.key === r.key, { value: r.value }));
    }
    return (d, r) => (n(), o("div", Ue, [
      D(g(Y), {
        options: E,
        value: p.value,
        "data-settings-tabs": "",
        onPick: r[0] || (r[0] = (s) => p.value = s)
      }, null, 8, ["value"]),
      p.value === "environments" ? (n(), O(Fe, { key: 0 })) : (n(), o(B, { key: 1 }, [
        u("div", Ve, [
          u("label", Ie, [
            z(u("input", {
              ref_key: "field",
              ref: m,
              "onUpdate:modelValue": r[1] || (r[1] = (s) => C.value = s),
              class: "settings-search-field",
              type: "search",
              placeholder: "Find a setting",
              "aria-label": "Find a setting",
              onKeydown: r[2] || (r[2] = se((s) => C.value = "", ["esc"]))
            }, null, 544), [
              [Q, C.value]
            ])
          ]),
          D(g(Y), {
            options: T.value,
            value: $.value,
            "data-settings-filter": "",
            onPick: r[3] || (r[3] = (s) => $.value = s)
          }, null, 8, ["options", "value"]),
          r[4] || (r[4] = u("span", { class: "settings-saved" }, "Changes are saved as you make them", -1))
        ]),
        g(j) ? g(S) ? (n(), o("p", qe, f(g(S)), 1)) : g(j) && !g(b).length ? (n(), o("p", De, "No module declares a setting.")) : _("", !0) : (n(), O(g(le), {
          key: 0,
          shape: "text"
        })),
        u("div", Ge, [
          u("nav", Je, [
            (n(!0), o(B, null, x(L.value, (s) => (n(), o("button", {
              key: s,
              type: "button",
              class: H(["settings-nav-item", { current: s === i.value }]),
              "data-jump": s,
              onClick: (v) => y.value = s
            }, f(l(s)), 11, We))), 128))
          ]),
          u("div", Ke, [
            (n(!0), o(B, null, x(L.value.filter((s) => s === i.value), (s) => (n(), o("section", {
              key: s,
              class: "settings-module",
              "data-module": s
            }, [
              u("h3", Pe, f(l(s)), 1),
              (n(!0), o(B, null, x(U.value.filter((v) => v.module === s), (v) => (n(), O(Z, {
                key: v.key,
                row: v,
                rows: F.value,
                "read-only": J,
                save: ee
              }, null, 8, ["row", "rows"]))), 128))
            ], 8, Me))), 128))
          ])
        ])
      ], 64))
    ]));
  }
}, Xe = /* @__PURE__ */ M(He, [["__scopeId", "data-v-9ca5647a"]]);
export {
  Xe as default
};
