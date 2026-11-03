/* @code-commandments-generated */
if (!document.getElementById("window-styles-56f3fd261cf8")) { const style = document.createElement("style"); style.id = "window-styles-56f3fd261cf8"; style.textContent = ".setting-input[data-v-796b5794]{display:flex;gap:8px;align-items:center}.setting-unit[data-v-796b5794]{flex:none;color:var(--text-3);font-size:12px}.setting-list[data-v-796b5794]{resize:vertical}.setting-head[data-v-796b5794]{display:flex;gap:6px;align-items:center}.setting-dot[data-v-796b5794]{width:6px;height:6px;border-radius:50%;background:var(--accent)}.setting-reset[data-v-796b5794]{margin-left:auto;padding:0 6px;border:0;border-radius:5px;background:none;color:var(--text-3);font:inherit;font-size:11.5px;cursor:pointer}.setting-reset[data-v-796b5794]:hover{background:var(--hover);color:var(--text)}.setting-group[data-v-796b5794]{display:flex;flex-direction:column;gap:6px}.setting-group-head[data-v-796b5794]{display:flex;align-items:center;gap:10px}.setting-group-title[data-v-796b5794]{margin:0;font-size:13px;font-weight:600}.setting-children[data-v-796b5794]{display:flex;flex-direction:column;gap:14px;padding-left:14px;border-left:1px solid var(--line)}.setting-children.off[data-v-796b5794]{opacity:.5}.setting-value[data-v-796b5794]{display:flex;flex-direction:column;gap:4px}.setting-label[data-v-796b5794]{font-size:12px;color:var(--text)}.setting-description[data-v-796b5794],.setting-shown[data-v-796b5794]{margin:0;font-size:12px;color:var(--text-3)}.setting-field[data-v-796b5794]{max-width:360px;padding:6px 10px;border:1px solid var(--line);border-radius:6px;color:var(--text);background:transparent}.setting-switch[data-v-796b5794]{align-self:flex-start;padding:2px 10px;border:0;border-radius:10px;color:var(--text-2);background:var(--raised);font-size:11px;cursor:pointer}.setting-switch[aria-checked=true][data-v-796b5794]{color:#fff;background:var(--accent)}.setting-choices[data-v-796b5794]{display:flex;gap:6px}.setting-refusal[data-v-796b5794]{margin:0;font-size:12px;color:var(--danger)}.environment[data-v-f4755e01]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.environment-names[data-v-f4755e01]{flex:1;min-width:0}.environment-name[data-v-f4755e01]{font-weight:500}.environment-here[data-v-f4755e01]{margin-left:8px;color:var(--accent-text);font-size:12px}.environment-folder[data-v-f4755e01]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.environment-refusal[data-v-f4755e01]{margin:2px 0 0;color:var(--danger);font-size:12.5px}.settings-nav-item.current[data-v-6efb2399]{background:var(--hover);color:var(--text)}.settings[data-v-6efb2399]{display:flex;flex-direction:column;gap:16px}.settings-bar[data-v-6efb2399]{display:flex;flex-wrap:wrap;gap:12px;align-items:center}.settings-search[data-v-6efb2399]{flex:1;min-width:200px;max-width:360px}.settings-saved[data-v-6efb2399]{color:var(--text-3);font-size:12px}.settings-search-field[data-v-6efb2399]{width:100%;max-width:360px;padding:7px 12px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text)}.settings-body[data-v-6efb2399]{display:flex;gap:28px;align-items:flex-start}.settings-nav[data-v-6efb2399]{display:flex;flex:none;flex-direction:column;gap:2px;width:150px;position:sticky;top:0}.settings-nav-item[data-v-6efb2399]{padding:5px 10px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-align:left;cursor:pointer}.settings-nav-item[data-v-6efb2399]:hover{background:var(--hover);color:var(--text)}.settings-sections[data-v-6efb2399]{display:flex;flex:1;flex-direction:column;gap:32px;min-width:0}.settings-module[data-v-6efb2399]{display:flex;flex-direction:column;gap:18px}.settings-module-heading[data-v-6efb2399]{margin:0;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--text-3)}.settings-failure[data-v-6efb2399],.settings-empty[data-v-6efb2399]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as h, ref as O, openBlock as n, createElementBlock as l, createElementVNode as i, toDisplayString as f, createBlock as b, unref as g, createCommentVNode as N, normalizeClass as H, Fragment as B, renderList as x, withDirectives as z, vModelText as Q, withCtx as L, createTextVNode as I, createVNode as D, onMounted as te, onUnmounted as ne, withKeys as se } from "vue";
import { Switch as P, Btn as q, useRows as X, RowList as ae, removed as oe, WindowRoom as le, Segmented as Y, Skeleton as ie, patchedWhere as re } from "@journal/window-kit";
const M = (e, t) => {
  const S = e.__vccOpts || e;
  for (const [C, j] of t)
    S[C] = j;
  return S;
}, ue = ["data-setting"], de = { class: "setting-group-head" }, ce = { class: "setting-group-title" }, ve = { class: "setting-description" }, fe = {
  key: 0,
  class: "setting-refusal"
}, ye = ["data-setting"], ge = { class: "setting-head" }, me = {
  key: 0,
  class: "setting-dot",
  "data-setting-changed": "",
  title: "Changed from the default"
}, he = ["for"], ke = ["title"], we = { class: "setting-description" }, pe = { class: "setting-shown" }, be = ["id", "disabled"], Se = {
  key: 2,
  class: "setting-choices"
}, Ce = ["id", "value", "disabled"], $e = {
  key: 4,
  class: "setting-input"
}, _e = ["id", "type", "value", "disabled"], Ne = {
  key: 0,
  class: "setting-unit",
  "data-setting-unit": ""
}, Oe = {
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
    const t = e, S = h(() => t.rows.filter((o) => o.parent === t.row.key)), C = h(() => t.row.type === "group"), j = h(() => t.row.scope === "project" ? ["--project"] : []), w = O(""), k = O(""), E = /* @__PURE__ */ new Set(["environment", "project"]), p = { seconds: "seconds", minutes: "minutes", hours: "hours", days: "days", bytes: "bytes", characters: "characters", percent: "%" }, $ = h(() => t.row.type === "number" ? p[t.row.key.split(/[-_.]/).at(-1)] ?? "" : ""), _ = h(() => t.row.type === "list" || t.row.type === "number list"), m = h(() => t.row.value ? JSON.parse(t.row.value).join(`
`) : ""), a = h(() => E.has(t.row.source)), c = h(() => !t.readOnly && !t.row.secret && !C.value && a.value && t.row.default !== null && t.row.default !== void 0), A = h(() => typeof t.row.default == "boolean" ? t.row.default ? "on" : "off" : Array.isArray(t.row.default) ? t.row.default.join(",") : String(t.row.default));
    function G(o) {
      if (t.row.type === "flag") return o === "on";
      if (t.row.type === "number") return Number.isNaN(Number(o)) ? o : Number(o);
      if (t.row.type === "list" || t.row.type === "number list") {
        const y = o.startsWith("[") ? JSON.parse(o) : o.split(",").map((r) => r.trim()).filter(Boolean);
        return JSON.stringify(t.row.type === "number list" ? y.map(Number) : y);
      }
      return o;
    }
    async function T(o) {
      const y = ["setting", "set", t.row.key, String(o), ...j.value], r = await t.save(y, t.row.secret ? null : { key: t.row.key, value: G(String(o)) });
      r.ok ? w.value = "" : w.value = r.error;
    }
    async function F() {
      const o = await t.save(["setting", "switch", t.row.key, t.row.value === !1 ? "on" : "off", "--project"], { key: t.row.key, value: t.row.value === !1 });
      w.value = o.ok ? "" : o.error;
    }
    function U(o) {
      T(o.target.value);
    }
    function R(o) {
      const y = o.target.value.split(`
`).map((r) => r.trim()).filter(Boolean);
      T(t.row.type === "list" ? JSON.stringify(y) : y.join(","));
    }
    function W() {
      k.value && T(k.value).then(() => k.value = "");
    }
    return (o, y) => C.value ? (n(), l("section", {
      key: 0,
      class: "setting-group",
      "data-setting": e.row.key
    }, [
      i("div", de, [
        i("h3", ce, f(e.row.title), 1),
        e.row.toggleable && !e.readOnly ? (n(), b(g(P), {
          key: 0,
          on: e.row.value !== !1,
          title: `Switch ${e.row.title} ${e.row.value === !1 ? "on" : "off"}`,
          "data-group-switch": "",
          onChange: F
        }, null, 8, ["on", "title"])) : N("", !0)
      ]),
      i("p", ve, f(e.row.description), 1),
      i("div", {
        class: H(["setting-children", { off: e.row.value === !1 }])
      }, [
        (n(!0), l(B, null, x(S.value, (r) => (n(), b(Z, {
          key: r.key,
          row: r,
          rows: e.rows,
          "read-only": e.readOnly,
          save: e.save
        }, null, 8, ["row", "rows", "read-only", "save"]))), 128))
      ], 2),
      w.value ? (n(), l("p", fe, f(w.value), 1)) : N("", !0)
    ], 8, ue)) : (n(), l("div", {
      key: 1,
      class: "setting-value",
      "data-setting": e.row.key
    }, [
      i("div", ge, [
        a.value ? (n(), l("span", me)) : N("", !0),
        i("label", {
          class: "setting-label",
          for: e.row.key
        }, f(e.row.title), 9, he),
        c.value ? (n(), l("button", {
          key: 1,
          type: "button",
          class: "setting-reset",
          "data-setting-reset": "",
          title: `Back to the default: ${A.value}`,
          onClick: y[0] || (y[0] = (r) => T(A.value))
        }, "Reset", 8, ke)) : N("", !0)
      ]),
      i("p", we, f(e.row.description), 1),
      e.row.secret ? (n(), l(B, { key: 0 }, [
        i("p", pe, f(e.row.shown), 1),
        z(i("input", {
          id: e.row.key,
          "onUpdate:modelValue": y[1] || (y[1] = (r) => k.value = r),
          class: "setting-field",
          type: "password",
          disabled: e.readOnly,
          placeholder: "Type a new value",
          onChange: W
        }, null, 40, be), [
          [Q, k.value]
        ])
      ], 64)) : e.row.type === "flag" ? (n(), b(g(P), {
        key: 1,
        on: e.row.value === !0,
        title: e.row.title,
        disabled: e.readOnly,
        "data-flag-switch": "",
        onChange: y[2] || (y[2] = (r) => !e.readOnly && T(r ? "on" : "off"))
      }, null, 8, ["on", "title", "disabled"])) : e.row.type === "choice" ? (n(), l("div", Se, [
        (n(!0), l(B, null, x(e.row.choices, (r) => (n(), b(g(q), {
          key: r,
          small: "",
          kind: r === e.row.value ? "primary" : "ghost",
          "data-choice": r,
          disabled: e.readOnly,
          onClick: (J) => T(r)
        }, {
          default: L(() => [
            I(f(r), 1)
          ]),
          _: 2
        }, 1032, ["kind", "data-choice", "disabled", "onClick"]))), 128))
      ])) : _.value ? (n(), l("textarea", {
        key: 3,
        id: e.row.key,
        class: "setting-field setting-list",
        rows: "3",
        value: m.value,
        disabled: e.readOnly,
        placeholder: "One on each line",
        "data-setting-list": "",
        onChange: R
      }, null, 40, Ce)) : (n(), l("div", $e, [
        i("input", {
          id: e.row.key,
          class: "setting-field",
          type: e.row.type === "number" ? "number" : "text",
          value: e.row.value,
          disabled: e.readOnly,
          onChange: U
        }, null, 40, _e),
        $.value ? (n(), l("span", Ne, f($.value), 1)) : N("", !0)
      ])),
      w.value ? (n(), l("p", Oe, f(w.value), 1)) : N("", !0)
    ], 8, ye));
  }
}, Z = /* @__PURE__ */ M(je, [["__scopeId", "data-v-796b5794"]]), Ee = ["data-environment"], Ae = { class: "environment-names" }, Te = { class: "environment-name" }, Be = {
  key: 0,
  class: "environment-here"
}, Re = { class: "environment-folder" }, Le = {
  class: "environment-folder",
  "data-environment-state": ""
}, xe = {
  key: 1,
  class: "environment-refusal",
  role: "alert",
  "data-environment-refusal": ""
}, Fe = {
  __name: "SettingsEnvironments",
  setup(e) {
    const { rows: t, failure: S, loaded: C, act: j, context: w } = X("environment cards", ["environment.*"]), k = O(0), E = O({}), p = (m) => m.name === w.environment, $ = h(() => [...t.value].sort((m, a) => p(a) - p(m) || m.name.localeCompare(a.name)));
    async function _(m) {
      if (k.value !== m.id) return void (k.value = m.id);
      k.value = 0;
      const a = await j(["environment", "delete", String(m.id)], oe(m.id));
      E.value = { ...E.value, [m.id]: a.ok ? "" : a.error };
    }
    return (m, a) => (n(), b(g(ae), {
      rows: $.value,
      failure: g(S),
      loaded: g(C),
      empty: "No environments yet",
      hint: "An environment is one line of work in this project; make one to start."
    }, {
      default: L(({ row: c }) => [
        i("div", {
          class: "environment",
          "data-environment": c.name
        }, [
          i("div", Ae, [
            i("span", Te, f(c.name), 1),
            p(c) ? (n(), l("span", Be, "You are here")) : N("", !0),
            i("p", Re, f(c.folder) + f(c.branch ? ` on ${c.branch}` : ""), 1),
            i("p", Le, f(c.running_agent_count ? "Agent running" : "No agent running") + " · " + f(c.unfinished_task_count) + " " + f(c.unfinished_task_count === 1 ? "task" : "tasks") + " not done", 1),
            E.value[c.id] ? (n(), l("p", xe, f(E.value[c.id]), 1)) : N("", !0)
          ]),
          k.value === c.id ? (n(), l(B, { key: 0 }, [
            D(g(q), {
              small: "",
              "data-environment-keep": "",
              onClick: a[0] || (a[0] = (A) => k.value = 0)
            }, {
              default: L(() => [...a[1] || (a[1] = [
                I("Keep it", -1)
              ])]),
              _: 1
            }),
            D(g(q), {
              small: "",
              kind: "danger",
              "data-environment-confirm": "",
              onClick: (A) => _(c)
            }, {
              default: L(() => [...a[2] || (a[2] = [
                I("Yes, remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ], 64)) : (n(), b(g(q), {
            key: 1,
            small: "",
            kind: "danger",
            "data-environment-remove": "",
            disabled: p(c),
            title: p(c) ? "Switch to another environment to remove this one" : "Remove this environment",
            onClick: (A) => _(c)
          }, {
            default: L(() => [...a[3] || (a[3] = [
              I("Remove environment", -1)
            ])]),
            _: 1
          }, 8, ["disabled", "title", "onClick"]))
        ], 8, Ee)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, Ue = /* @__PURE__ */ M(Fe, [["__scopeId", "data-v-f4755e01"]]), Ve = { class: "settings" }, Ie = { class: "settings-bar" }, qe = { class: "settings-search" }, De = {
  key: 1,
  class: "settings-failure"
}, Ge = {
  key: 2,
  class: "settings-empty"
}, We = { class: "settings-body" }, Je = {
  class: "settings-nav",
  "aria-label": "Modules"
}, Ke = ["data-jump", "onClick"], Me = {
  class: "settings-sections",
  "data-settings-sections": ""
}, Pe = ["data-module"], Ye = { class: "settings-module-heading" }, He = "input,textarea,select,[contenteditable]", ze = {
  __name: "SettingsTree",
  setup(e) {
    const t = /* @__PURE__ */ new Set(["environment", "project"]), { rows: S, failure: C, loaded: j, act: w, context: k } = X("setting tree", ["setting.*"]), E = [
      { key: "settings", label: "Settings" },
      { key: "environments", label: "Environments" }
    ], p = O("settings"), $ = O(""), _ = O("all"), m = O(null), a = h(() => S.value.filter((d) => !d.key.endsWith(".*"))), c = (d) => d.type !== "group" && t.has(d.source), A = (d) => d.value === !1, G = { all: () => !0, changed: c, off: A }, T = h(() => [
      { key: "all", label: "All" },
      { key: "changed", label: "Changed", title: "Settings you changed from their default", count: a.value.filter(c).length },
      { key: "off", label: "Off", count: a.value.filter(A).length }
    ]), F = h(() => {
      const d = $.value.trim().toLowerCase();
      if (!d && _.value === "all") return a.value;
      const u = a.value.filter((v) => G[_.value](v) && [v.title, v.description, v.key].join(" ").toLowerCase().includes(d)), s = new Set(u.map((v) => v.key));
      for (const v of u)
        for (let V = a.value.find((K) => K.key === v.parent); V; V = a.value.find((K) => K.key === V.parent)) s.add(V.key);
      return a.value.filter((v) => s.has(v.key));
    }), U = h(() => F.value.filter((d) => d.parent === null)), R = h(() => [...new Set(U.value.map((d) => d.module))]), W = k.face === "phone";
    function o(d) {
      const u = d.split("."), s = u[u.length - 1].replace(/[-_]/g, " ");
      return s.slice(0, 1).toUpperCase() + s.slice(1);
    }
    const y = O(""), r = h(() => R.value.includes(y.value) ? y.value : R.value[0] ?? "");
    function J(d) {
      var u, s, v;
      d.key !== "/" || (s = (u = d.target).closest) != null && s.call(u, He) || (d.preventDefault(), (v = m.value) == null || v.focus());
    }
    te(() => {
      window.addEventListener("keydown", J);
    }), ne(() => {
      window.removeEventListener("keydown", J);
    });
    function ee(d, u) {
      return w(d, u && re((s) => s.key === u.key, { value: u.value }));
    }
    return (d, u) => (n(), b(g(le), null, {
      default: L(() => [
        i("div", Ve, [
          D(g(Y), {
            options: E,
            value: p.value,
            "data-settings-tabs": "",
            onPick: u[0] || (u[0] = (s) => p.value = s)
          }, null, 8, ["value"]),
          p.value === "environments" ? (n(), b(Ue, { key: 0 })) : (n(), l(B, { key: 1 }, [
            i("div", Ie, [
              i("label", qe, [
                z(i("input", {
                  ref_key: "field",
                  ref: m,
                  "onUpdate:modelValue": u[1] || (u[1] = (s) => $.value = s),
                  class: "settings-search-field",
                  type: "search",
                  placeholder: "Find a setting",
                  "aria-label": "Find a setting",
                  onKeydown: u[2] || (u[2] = se((s) => $.value = "", ["esc"]))
                }, null, 544), [
                  [Q, $.value]
                ])
              ]),
              D(g(Y), {
                options: T.value,
                value: _.value,
                "data-settings-filter": "",
                onPick: u[3] || (u[3] = (s) => _.value = s)
              }, null, 8, ["options", "value"]),
              u[4] || (u[4] = i("span", { class: "settings-saved" }, "Changes are saved as you make them", -1))
            ]),
            g(j) ? g(C) ? (n(), l("p", De, f(g(C)), 1)) : g(j) && !g(S).length ? (n(), l("p", Ge, "No module declares a setting.")) : N("", !0) : (n(), b(g(ie), {
              key: 0,
              shape: "text"
            })),
            i("div", We, [
              i("nav", Je, [
                (n(!0), l(B, null, x(R.value, (s) => (n(), l("button", {
                  key: s,
                  type: "button",
                  class: H(["settings-nav-item", { current: s === r.value }]),
                  "data-jump": s,
                  onClick: (v) => y.value = s
                }, f(o(s)), 11, Ke))), 128))
              ]),
              i("div", Me, [
                (n(!0), l(B, null, x(R.value.filter((s) => s === r.value), (s) => (n(), l("section", {
                  key: s,
                  class: "settings-module",
                  "data-module": s
                }, [
                  i("h3", Ye, f(o(s)), 1),
                  (n(!0), l(B, null, x(U.value.filter((v) => v.module === s), (v) => (n(), b(Z, {
                    key: v.key,
                    row: v,
                    rows: F.value,
                    "read-only": W,
                    save: ee
                  }, null, 8, ["row", "rows"]))), 128))
                ], 8, Pe))), 128))
              ])
            ])
          ], 64))
        ])
      ]),
      _: 1
    }));
  }
}, Ze = /* @__PURE__ */ M(ze, [["__scopeId", "data-v-6efb2399"]]);
export {
  Ze as default
};
