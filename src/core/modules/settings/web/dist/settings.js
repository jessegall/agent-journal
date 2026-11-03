/* @code-commandments-generated */
if (!document.getElementById("window-styles-87d08835b1fb")) { const style = document.createElement("style"); style.id = "window-styles-87d08835b1fb"; style.textContent = ".setting-input[data-v-bb0492ed]{display:flex;gap:8px;align-items:center}.setting-unit[data-v-bb0492ed]{flex:none;color:var(--text-3);font-size:12px}.setting-list[data-v-bb0492ed]{resize:vertical}.setting-head[data-v-bb0492ed]{display:flex;gap:6px;align-items:center}.setting-dot[data-v-bb0492ed]{width:6px;height:6px;border-radius:50%;background:var(--accent)}.setting-reset[data-v-bb0492ed]{margin-left:auto;padding:0 6px;border:0;border-radius:5px;background:none;color:var(--text-3);font:inherit;font-size:11.5px;cursor:pointer}.setting-reset[data-v-bb0492ed]:hover{background:var(--hover);color:var(--text)}.setting-group[data-v-bb0492ed]{display:flex;flex-direction:column;gap:6px}.setting-group-head[data-v-bb0492ed]{display:flex;align-items:center;gap:10px}.setting-group-title[data-v-bb0492ed]{margin:0;font-size:13px;font-weight:600}.setting-children[data-v-bb0492ed]{display:flex;flex-direction:column;gap:14px;padding-left:14px;border-left:1px solid var(--line)}.setting-children.off[data-v-bb0492ed]{opacity:.5}.setting-value[data-v-bb0492ed]{display:flex;flex-direction:column;gap:4px}.setting-label[data-v-bb0492ed]{font-size:12px;color:var(--text)}.setting-description[data-v-bb0492ed],.setting-shown[data-v-bb0492ed]{margin:0;font-size:12px;color:var(--text-3)}.setting-field[data-v-bb0492ed]{max-width:360px;padding:6px 10px;border:1px solid var(--line);border-radius:6px;color:var(--text);background:transparent}.setting-switch[data-v-bb0492ed]{align-self:flex-start;padding:2px 10px;border:0;border-radius:10px;color:var(--text-2);background:var(--raised);font-size:11px;cursor:pointer}.setting-switch[aria-checked=true][data-v-bb0492ed]{color:#fff;background:var(--accent)}.setting-choices[data-v-bb0492ed]{display:flex;gap:6px}.setting-refusal[data-v-bb0492ed]{margin:0;font-size:12px;color:var(--danger)}.environment[data-v-f4755e01]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.environment-names[data-v-f4755e01]{flex:1;min-width:0}.environment-name[data-v-f4755e01]{font-weight:500}.environment-here[data-v-f4755e01]{margin-left:8px;color:var(--accent-text);font-size:12px}.environment-folder[data-v-f4755e01]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.environment-refusal[data-v-f4755e01]{margin:2px 0 0;color:var(--danger);font-size:12.5px}.settings-nav-item.current[data-v-e4869a94]{background:var(--hover);color:var(--text)}.settings[data-v-e4869a94]{display:flex;flex-direction:column;gap:16px}.settings-bar[data-v-e4869a94]{flex-wrap:wrap;gap:12px}.settings-saved[data-v-e4869a94]{color:var(--text-3);font-size:12px}.settings-body[data-v-e4869a94]{display:flex;gap:28px;align-items:flex-start}.settings-nav[data-v-e4869a94]{display:flex;flex:none;flex-direction:column;gap:2px;width:150px;position:sticky;top:0}.settings-nav-item[data-v-e4869a94]{padding:5px 10px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-align:left;cursor:pointer}.settings-nav-item[data-v-e4869a94]:hover{background:var(--hover);color:var(--text)}.settings-sections[data-v-e4869a94]{display:flex;flex:1;flex-direction:column;gap:32px;min-width:0}.settings-module[data-v-e4869a94]{display:flex;flex-direction:column;gap:18px}.settings-module-heading[data-v-e4869a94]{margin:0;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--text-3)}.settings-failure[data-v-e4869a94],.settings-empty[data-v-e4869a94]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as h, ref as N, openBlock as n, createElementBlock as l, createElementVNode as c, toDisplayString as f, createBlock as b, unref as v, createCommentVNode as $, normalizeClass as z, Fragment as T, renderList as L, withDirectives as Z, vModelText as ee, withCtx as V, createTextVNode as D, createVNode as U, onMounted as te, onUnmounted as ne } from "vue";
import { Switch as Y, Btn as F, useRows as K, RowList as se, removed as ae, matchesSearch as oe, WindowRoom as le, Segmented as H, SearchBar as ie, Skeleton as re, patchedWhere as ue } from "@journal/window-kit";
const P = (e, t) => {
  const S = e.__vccOpts || e;
  for (const [C, O] of t)
    S[C] = O;
  return S;
}, de = ["data-setting"], ce = { class: "setting-group-head" }, ve = { class: "setting-group-title" }, fe = { class: "setting-description" }, ye = {
  key: 0,
  class: "setting-refusal"
}, ge = ["data-setting"], me = { class: "setting-head" }, he = ["for"], ke = {
  key: 0,
  class: "setting-dot",
  "data-setting-changed": "",
  title: "Changed from the default"
}, we = ["title"], pe = { class: "setting-description" }, be = { class: "setting-shown" }, Se = ["id", "disabled"], Ce = {
  key: 2,
  class: "setting-choices"
}, _e = ["id", "value", "disabled"], $e = {
  key: 4,
  class: "setting-input"
}, Ne = ["id", "type", "value", "disabled"], Oe = {
  key: 0,
  class: "setting-unit",
  "data-setting-unit": ""
}, je = {
  key: 5,
  class: "setting-refusal"
}, Ee = {
  __name: "SettingNode",
  props: {
    row: { type: Object, required: !0 },
    rows: { type: Array, required: !0 },
    readOnly: { type: Boolean, required: !0 },
    save: { type: Function, required: !0 }
  },
  setup(e) {
    const t = e, S = h(() => t.rows.filter((o) => o.parent === t.row.key)), C = h(() => t.row.type === "group"), O = h(() => t.row.scope === "project" ? ["--project"] : []), w = N(""), k = N(""), j = /* @__PURE__ */ new Set(["environment", "project"]), p = { seconds: "seconds", minutes: "minutes", hours: "hours", days: "days", bytes: "bytes", characters: "characters", percent: "%" }, E = h(() => t.row.type === "number" ? p[t.row.key.split(/[-_.]/).at(-1)] ?? "" : ""), _ = h(() => t.row.type === "list" || t.row.type === "number list"), m = h(() => t.row.value ? JSON.parse(t.row.value).join(`
`) : ""), a = h(() => j.has(t.row.source)), u = h(() => !t.readOnly && !t.row.secret && !C.value && a.value && t.row.default !== null && t.row.default !== void 0), A = h(() => typeof t.row.default == "boolean" ? t.row.default ? "on" : "off" : Array.isArray(t.row.default) ? t.row.default.join(",") : String(t.row.default));
    function G(o) {
      if (t.row.type === "flag") return o === "on";
      if (t.row.type === "number") return Number.isNaN(Number(o)) ? o : Number(o);
      if (t.row.type === "list" || t.row.type === "number list") {
        const y = o.startsWith("[") ? JSON.parse(o) : o.split(",").map((i) => i.trim()).filter(Boolean);
        return JSON.stringify(t.row.type === "number list" ? y.map(Number) : y);
      }
      return o;
    }
    async function B(o) {
      const y = ["setting", "set", t.row.key, String(o), ...O.value], i = await t.save(y, t.row.secret ? null : { key: t.row.key, value: G(String(o)) });
      i.ok ? w.value = "" : w.value = i.error;
    }
    async function I() {
      const o = await t.save(["setting", "switch", t.row.key, t.row.value === !1 ? "on" : "off", "--project"], { key: t.row.key, value: t.row.value === !1 });
      w.value = o.ok ? "" : o.error;
    }
    function q(o) {
      B(o.target.value);
    }
    function x(o) {
      const y = o.target.value.split(`
`).map((i) => i.trim()).filter(Boolean);
      B(t.row.type === "list" ? JSON.stringify(y) : y.join(","));
    }
    function W() {
      k.value && B(k.value).then(() => k.value = "");
    }
    return (o, y) => C.value ? (n(), l("section", {
      key: 0,
      class: "setting-group",
      "data-setting": e.row.key
    }, [
      c("div", ce, [
        c("h3", ve, f(e.row.title), 1),
        e.row.toggleable && !e.readOnly ? (n(), b(v(Y), {
          key: 0,
          on: e.row.value !== !1,
          title: `Switch ${e.row.title} ${e.row.value === !1 ? "on" : "off"}`,
          "data-group-switch": "",
          onChange: I
        }, null, 8, ["on", "title"])) : $("", !0)
      ]),
      c("p", fe, f(e.row.description), 1),
      c("div", {
        class: z(["setting-children", { off: e.row.value === !1 }])
      }, [
        (n(!0), l(T, null, L(S.value, (i) => (n(), b(Q, {
          key: i.key,
          row: i,
          rows: e.rows,
          "read-only": e.readOnly,
          save: e.save
        }, null, 8, ["row", "rows", "read-only", "save"]))), 128))
      ], 2),
      w.value ? (n(), l("p", ye, f(w.value), 1)) : $("", !0)
    ], 8, de)) : (n(), l("div", {
      key: 1,
      class: "setting-value",
      "data-setting": e.row.key
    }, [
      c("div", me, [
        c("label", {
          class: "setting-label",
          for: e.row.key
        }, f(e.row.title), 9, he),
        a.value ? (n(), l("span", ke)) : $("", !0),
        u.value ? (n(), l("button", {
          key: 1,
          type: "button",
          class: "setting-reset",
          "data-setting-reset": "",
          title: `Back to the default: ${A.value}`,
          onClick: y[0] || (y[0] = (i) => B(A.value))
        }, "Reset", 8, we)) : $("", !0)
      ]),
      c("p", pe, f(e.row.description), 1),
      e.row.secret ? (n(), l(T, { key: 0 }, [
        c("p", be, f(e.row.shown), 1),
        Z(c("input", {
          id: e.row.key,
          "onUpdate:modelValue": y[1] || (y[1] = (i) => k.value = i),
          class: "setting-field",
          type: "password",
          disabled: e.readOnly,
          placeholder: "Type a new value",
          onChange: W
        }, null, 40, Se), [
          [ee, k.value]
        ])
      ], 64)) : e.row.type === "flag" ? (n(), b(v(Y), {
        key: 1,
        on: e.row.value === !0,
        title: e.row.title,
        disabled: e.readOnly,
        "data-flag-switch": "",
        onChange: y[2] || (y[2] = (i) => !e.readOnly && B(i ? "on" : "off"))
      }, null, 8, ["on", "title", "disabled"])) : e.row.type === "choice" ? (n(), l("div", Ce, [
        (n(!0), l(T, null, L(e.row.choices, (i) => (n(), b(v(F), {
          key: i,
          small: "",
          kind: i === e.row.value ? "primary" : "ghost",
          "data-choice": i,
          disabled: e.readOnly,
          onClick: (J) => B(i)
        }, {
          default: V(() => [
            D(f(i), 1)
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
        onChange: x
      }, null, 40, _e)) : (n(), l("div", $e, [
        c("input", {
          id: e.row.key,
          class: "setting-field",
          type: e.row.type === "number" ? "number" : "text",
          value: e.row.value,
          disabled: e.readOnly,
          onChange: q
        }, null, 40, Ne),
        E.value ? (n(), l("span", Oe, f(E.value), 1)) : $("", !0)
      ])),
      w.value ? (n(), l("p", je, f(w.value), 1)) : $("", !0)
    ], 8, ge));
  }
}, Q = /* @__PURE__ */ P(Ee, [["__scopeId", "data-v-bb0492ed"]]), Ae = ["data-environment"], Be = { class: "environment-names" }, Te = { class: "environment-name" }, Re = {
  key: 0,
  class: "environment-here"
}, Ve = { class: "environment-folder" }, xe = {
  class: "environment-folder",
  "data-environment-state": ""
}, Le = {
  key: 1,
  class: "environment-refusal",
  role: "alert",
  "data-environment-refusal": ""
}, Ue = {
  __name: "SettingsEnvironments",
  setup(e) {
    const { rows: t, failure: S, loaded: C, act: O, context: w } = K("environment cards", ["environment.*"]), k = N(0), j = N({}), p = (m) => m.name === w.environment, E = h(() => [...t.value].sort((m, a) => p(a) - p(m) || m.name.localeCompare(a.name)));
    async function _(m) {
      if (k.value !== m.id) return void (k.value = m.id);
      k.value = 0;
      const a = await O(["environment", "delete", String(m.id)], ae(m.id));
      j.value = { ...j.value, [m.id]: a.ok ? "" : a.error };
    }
    return (m, a) => (n(), b(v(se), {
      rows: E.value,
      failure: v(S),
      loaded: v(C),
      empty: "No environments yet",
      hint: "An environment is one line of work in this project; make one to start."
    }, {
      default: V(({ row: u }) => [
        c("div", {
          class: "environment",
          "data-environment": u.name
        }, [
          c("div", Be, [
            c("span", Te, f(u.name), 1),
            p(u) ? (n(), l("span", Re, "You are here")) : $("", !0),
            c("p", Ve, f(u.folder) + f(u.branch ? ` on ${u.branch}` : ""), 1),
            c("p", xe, f(u.running_agent_count ? "Agent running" : "No agent running") + " · " + f(u.unfinished_task_count) + " " + f(u.unfinished_task_count === 1 ? "task" : "tasks") + " not done", 1),
            j.value[u.id] ? (n(), l("p", Le, f(j.value[u.id]), 1)) : $("", !0)
          ]),
          k.value === u.id ? (n(), l(T, { key: 0 }, [
            U(v(F), {
              small: "",
              "data-environment-keep": "",
              onClick: a[0] || (a[0] = (A) => k.value = 0)
            }, {
              default: V(() => [...a[1] || (a[1] = [
                D("Keep it", -1)
              ])]),
              _: 1
            }),
            U(v(F), {
              small: "",
              kind: "danger",
              "data-environment-confirm": "",
              onClick: (A) => _(u)
            }, {
              default: V(() => [...a[2] || (a[2] = [
                D("Yes, remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ], 64)) : (n(), b(v(F), {
            key: 1,
            small: "",
            kind: "danger",
            "data-environment-remove": "",
            disabled: p(u),
            title: p(u) ? "Switch to another environment to remove this one" : "Remove this environment",
            onClick: (A) => _(u)
          }, {
            default: V(() => [...a[3] || (a[3] = [
              D("Remove environment", -1)
            ])]),
            _: 1
          }, 8, ["disabled", "title", "onClick"]))
        ], 8, Ae)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, Ie = /* @__PURE__ */ P(Ue, [["__scopeId", "data-v-f4755e01"]]), qe = { class: "settings" }, De = {
  key: 1,
  class: "settings-failure"
}, Fe = {
  key: 2,
  class: "settings-empty"
}, Ge = { class: "settings-body" }, We = {
  class: "settings-nav",
  "aria-label": "Modules"
}, Je = ["data-jump", "onClick"], Me = {
  class: "settings-sections",
  "data-settings-sections": ""
}, Pe = ["data-module"], Ye = { class: "settings-module-heading" }, He = "input,textarea,select,[contenteditable]", ze = {
  __name: "SettingsTree",
  setup(e) {
    const t = /* @__PURE__ */ new Set(["environment", "project"]), { rows: S, failure: C, loaded: O, act: w, context: k } = K("setting tree", ["setting.*"]), j = [
      { key: "settings", label: "Settings" },
      { key: "environments", label: "Environments" }
    ], p = N("settings"), E = N(""), _ = N("all"), m = N(null), a = h(() => S.value.filter((r) => !r.key.endsWith(".*"))), u = (r) => r.type !== "group" && t.has(r.source), A = (r) => r.value === !1, G = { all: () => !0, changed: u, off: A }, B = h(() => [
      { key: "all", label: "All" },
      { key: "changed", label: "Changed", title: "Settings you changed from their default", count: a.value.filter(u).length },
      { key: "off", label: "Off", count: a.value.filter(A).length }
    ]), I = h(() => {
      const r = E.value.trim().toLowerCase();
      if (!r && _.value === "all") return a.value;
      const d = a.value.filter((g) => {
        var R;
        return G[_.value](g) && oe(g, r, (R = k.search) == null ? void 0 : R.fields);
      }), s = new Set(d.map((g) => g.key));
      for (const g of d)
        for (let R = a.value.find((M) => M.key === g.parent); R; R = a.value.find((M) => M.key === R.parent)) s.add(R.key);
      return a.value.filter((g) => s.has(g.key));
    }), q = h(() => I.value.filter((r) => r.parent === null)), x = h(() => [...new Set(q.value.map((r) => r.module))]), W = k.face === "phone";
    function o(r) {
      const d = r.split("."), s = d[d.length - 1].replace(/[-_]/g, " ");
      return s.slice(0, 1).toUpperCase() + s.slice(1);
    }
    const y = N(""), i = h(() => x.value.includes(y.value) ? y.value : x.value[0] ?? "");
    function J(r) {
      var d, s, g;
      r.key !== "/" || (s = (d = r.target).closest) != null && s.call(d, He) || (r.preventDefault(), (g = m.value) == null || g.focus());
    }
    te(() => {
      window.addEventListener("keydown", J);
    }), ne(() => {
      window.removeEventListener("keydown", J);
    });
    function X(r, d) {
      return w(r, d && ue((s) => s.key === d.key, { value: d.value }));
    }
    return (r, d) => (n(), b(v(le), null, {
      default: V(() => [
        c("div", qe, [
          U(v(H), {
            options: j,
            value: p.value,
            "data-settings-tabs": "",
            onPick: d[0] || (d[0] = (s) => p.value = s)
          }, null, 8, ["value"]),
          p.value === "environments" ? (n(), b(Ie, { key: 0 })) : (n(), l(T, { key: 1 }, [
            U(v(ie), {
              ref_key: "field",
              ref: m,
              modelValue: E.value,
              "onUpdate:modelValue": d[2] || (d[2] = (s) => E.value = s),
              class: "settings-bar"
            }, {
              default: V(() => [
                U(v(H), {
                  options: B.value,
                  value: _.value,
                  "data-settings-filter": "",
                  onPick: d[1] || (d[1] = (s) => _.value = s)
                }, null, 8, ["options", "value"]),
                d[3] || (d[3] = c("span", { class: "settings-saved" }, "Changes are saved as you make them", -1))
              ]),
              _: 1
            }, 8, ["modelValue"]),
            v(O) ? v(C) ? (n(), l("p", De, f(v(C)), 1)) : v(O) && !v(S).length ? (n(), l("p", Fe, "No module declares a setting.")) : $("", !0) : (n(), b(v(re), {
              key: 0,
              shape: "text"
            })),
            c("div", Ge, [
              c("nav", We, [
                (n(!0), l(T, null, L(x.value, (s) => (n(), l("button", {
                  key: s,
                  type: "button",
                  class: z(["settings-nav-item", { current: s === i.value }]),
                  "data-jump": s,
                  onClick: (g) => y.value = s
                }, f(o(s)), 11, Je))), 128))
              ]),
              c("div", Me, [
                (n(!0), l(T, null, L(x.value.filter((s) => s === i.value), (s) => (n(), l("section", {
                  key: s,
                  class: "settings-module",
                  "data-module": s
                }, [
                  c("h3", Ye, f(o(s)), 1),
                  (n(!0), l(T, null, L(q.value.filter((g) => g.module === s), (g) => (n(), b(Q, {
                    key: g.key,
                    row: g,
                    rows: I.value,
                    "read-only": W,
                    save: X
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
}, Xe = /* @__PURE__ */ P(ze, [["__scopeId", "data-v-e4869a94"]]);
export {
  Xe as default
};
