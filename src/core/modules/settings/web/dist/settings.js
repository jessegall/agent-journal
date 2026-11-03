/* @code-commandments-generated */
if (!document.getElementById("window-styles-26d825489715")) { const style = document.createElement("style"); style.id = "window-styles-26d825489715"; style.textContent = ".setting-input[data-v-89c9f086]{display:flex;gap:8px;align-items:center}.setting-unit[data-v-89c9f086]{flex:none;color:var(--text-3);font-size:12px}.setting-list[data-v-89c9f086]{resize:vertical}.setting-head[data-v-89c9f086]{display:flex;gap:6px;align-items:center}.setting-dot[data-v-89c9f086]{width:6px;height:6px;border-radius:50%;background:var(--accent)}.setting-reset[data-v-89c9f086]{margin-left:auto;padding:0 6px;border:0;border-radius:5px;background:none;color:var(--text-3);font:inherit;font-size:11.5px;cursor:pointer}.setting-reset[data-v-89c9f086]:hover{background:var(--hover);color:var(--text)}.setting-group[data-v-89c9f086]{display:flex;flex-direction:column;gap:6px}.setting-group-head[data-v-89c9f086]{display:flex;align-items:center;gap:10px}.setting-group-title[data-v-89c9f086]{margin:0;font-size:13px;font-weight:600}.setting-children[data-v-89c9f086]{display:flex;flex-direction:column;gap:14px;padding-left:14px;border-left:1px solid var(--line)}.setting-children.off[data-v-89c9f086]{opacity:.5}.setting-value[data-v-89c9f086]{display:flex;flex-direction:column;gap:4px}.setting-label[data-v-89c9f086]{font-size:12px;color:var(--text)}.setting-description[data-v-89c9f086],.setting-shown[data-v-89c9f086]{margin:0;font-size:12px;color:var(--text-3)}.setting-field[data-v-89c9f086]{max-width:360px;padding:6px 10px;border:1px solid var(--line);border-radius:6px;color:var(--text);background:transparent}.setting-switch[data-v-89c9f086]{align-self:flex-start;padding:2px 10px;border:0;border-radius:10px;color:var(--text-2);background:var(--raised);font-size:11px;cursor:pointer}.setting-switch[aria-checked=true][data-v-89c9f086]{color:#fff;background:var(--accent)}.setting-choices[data-v-89c9f086]{display:flex;gap:6px}.setting-refusal[data-v-89c9f086]{margin:0;font-size:12px;color:var(--danger)}.environment[data-v-33d34628]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.environment-names[data-v-33d34628]{flex:1;min-width:0}.environment-name[data-v-33d34628]{font-weight:500}.environment-here[data-v-33d34628]{margin-left:8px;color:var(--accent-text);font-size:12px}.environment-folder[data-v-33d34628]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.environment-refusal[data-v-33d34628]{margin:2px 0 0;color:var(--danger);font-size:12.5px}.settings-nav-item.current[data-v-e412288f]{background:var(--hover);color:var(--text)}.settings[data-v-e412288f]{display:flex;flex-direction:column;gap:16px}.settings-bar[data-v-e412288f]{display:flex;flex-wrap:wrap;gap:12px;align-items:center}.settings-search[data-v-e412288f]{flex:1;min-width:200px;max-width:360px}.settings-saved[data-v-e412288f]{color:var(--text-3);font-size:12px}.settings-search-field[data-v-e412288f]{width:100%;max-width:360px;padding:7px 12px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text)}.settings-body[data-v-e412288f]{display:flex;gap:28px;align-items:flex-start}.settings-nav[data-v-e412288f]{display:flex;flex:none;flex-direction:column;gap:2px;width:150px;position:sticky;top:0}.settings-nav-item[data-v-e412288f]{padding:5px 10px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-align:left;cursor:pointer}.settings-nav-item[data-v-e412288f]:hover{background:var(--hover);color:var(--text)}.settings-sections[data-v-e412288f]{display:flex;flex:1;flex-direction:column;gap:32px;min-width:0}.settings-module[data-v-e412288f]{display:flex;flex-direction:column;gap:18px}.settings-module-heading[data-v-e412288f]{margin:0;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--text-3)}.settings-failure[data-v-e412288f],.settings-empty[data-v-e412288f]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as g, ref as O, openBlock as t, createElementBlock as o, createElementVNode as l, toDisplayString as v, createBlock as x, unref as f, createCommentVNode as _, normalizeClass as W, Fragment as A, renderList as R, withDirectives as z, vModelText as Q, withCtx as L, createTextVNode as I, createVNode as D, onMounted as te, onUnmounted as ne, withKeys as se } from "vue";
import { Switch as H, Btn as q, useRows as X, RowList as ae, Segmented as J, Skeleton as oe } from "@journal/window-kit";
const P = (e, n) => {
  const b = e.__vccOpts || e;
  for (const [C, N] of n)
    b[C] = N;
  return b;
}, le = ["data-setting"], ie = { class: "setting-group-head" }, re = { class: "setting-group-title" }, ue = { class: "setting-description" }, de = {
  key: 0,
  class: "setting-refusal"
}, ce = ["data-setting"], ve = { class: "setting-head" }, fe = {
  key: 0,
  class: "setting-dot",
  "data-setting-changed": "",
  title: "Changed from the default"
}, ge = ["for"], ye = ["title"], me = { class: "setting-description" }, he = { class: "setting-shown" }, ke = ["id", "disabled"], we = {
  key: 2,
  class: "setting-choices"
}, pe = ["id", "value", "disabled"], be = {
  key: 4,
  class: "setting-input"
}, Ce = ["id", "type", "value", "disabled"], Se = {
  key: 0,
  class: "setting-unit",
  "data-setting-unit": ""
}, $e = {
  key: 5,
  class: "setting-refusal"
}, _e = {
  __name: "SettingNode",
  props: {
    row: { type: Object, required: !0 },
    rows: { type: Array, required: !0 },
    readOnly: { type: Boolean, required: !0 },
    save: { type: Function, required: !0 }
  },
  setup(e) {
    const n = e, b = g(() => n.rows.filter((k) => k.parent === n.row.key)), C = g(() => n.row.type === "group"), N = g(() => n.row.scope === "project" ? ["--project"] : []), w = O(""), m = O(""), j = /* @__PURE__ */ new Set(["environment", "project"]), p = { seconds: "seconds", minutes: "minutes", hours: "hours", days: "days", bytes: "bytes", characters: "characters", percent: "%" }, S = g(() => n.row.type === "number" ? p[n.row.key.split(/[-_.]/).at(-1)] ?? "" : ""), $ = g(() => n.row.type === "list" || n.row.type === "number list"), y = g(() => n.row.value ? JSON.parse(n.row.value).join(`
`) : ""), a = g(() => j.has(n.row.source)), d = g(() => !n.readOnly && !n.row.secret && !C.value && a.value && n.row.default !== null && n.row.default !== void 0), E = g(() => typeof n.row.default == "boolean" ? n.row.default ? "on" : "off" : Array.isArray(n.row.default) ? n.row.default.join(",") : String(n.row.default));
    async function T(k) {
      const h = ["setting", "set", n.row.key, String(k), ...N.value], i = await n.save(h);
      i.ok ? w.value = "" : w.value = i.error;
    }
    async function G() {
      const k = await n.save(["setting", "switch", n.row.key, n.row.value === !1 ? "on" : "off", "--project"]);
      w.value = k.ok ? "" : k.error;
    }
    function F(k) {
      T(k.target.value);
    }
    function U(k) {
      const h = k.target.value.split(`
`).map((i) => i.trim()).filter(Boolean);
      T(n.row.type === "list" ? JSON.stringify(h) : h.join(","));
    }
    function B() {
      m.value && T(m.value).then(() => m.value = "");
    }
    return (k, h) => C.value ? (t(), o("section", {
      key: 0,
      class: "setting-group",
      "data-setting": e.row.key
    }, [
      l("div", ie, [
        l("h3", re, v(e.row.title), 1),
        e.row.toggleable && !e.readOnly ? (t(), x(f(H), {
          key: 0,
          on: e.row.value !== !1,
          title: `Switch ${e.row.title} ${e.row.value === !1 ? "on" : "off"}`,
          "data-group-switch": "",
          onChange: G
        }, null, 8, ["on", "title"])) : _("", !0)
      ]),
      l("p", ue, v(e.row.description), 1),
      l("div", {
        class: W(["setting-children", { off: e.row.value === !1 }])
      }, [
        (t(!0), o(A, null, R(b.value, (i) => (t(), x(Z, {
          key: i.key,
          row: i,
          rows: e.rows,
          "read-only": e.readOnly,
          save: e.save
        }, null, 8, ["row", "rows", "read-only", "save"]))), 128))
      ], 2),
      w.value ? (t(), o("p", de, v(w.value), 1)) : _("", !0)
    ], 8, le)) : (t(), o("div", {
      key: 1,
      class: "setting-value",
      "data-setting": e.row.key
    }, [
      l("div", ve, [
        a.value ? (t(), o("span", fe)) : _("", !0),
        l("label", {
          class: "setting-label",
          for: e.row.key
        }, v(e.row.title), 9, ge),
        d.value ? (t(), o("button", {
          key: 1,
          type: "button",
          class: "setting-reset",
          "data-setting-reset": "",
          title: `Back to the default: ${E.value}`,
          onClick: h[0] || (h[0] = (i) => T(E.value))
        }, "Reset", 8, ye)) : _("", !0)
      ]),
      l("p", me, v(e.row.description), 1),
      e.row.secret ? (t(), o(A, { key: 0 }, [
        l("p", he, v(e.row.shown), 1),
        z(l("input", {
          id: e.row.key,
          "onUpdate:modelValue": h[1] || (h[1] = (i) => m.value = i),
          class: "setting-field",
          type: "password",
          disabled: e.readOnly,
          placeholder: "Type a new value",
          onChange: B
        }, null, 40, ke), [
          [Q, m.value]
        ])
      ], 64)) : e.row.type === "flag" ? (t(), x(f(H), {
        key: 1,
        on: e.row.value === !0,
        title: e.row.title,
        disabled: e.readOnly,
        "data-flag-switch": "",
        onChange: h[2] || (h[2] = (i) => !e.readOnly && T(i ? "on" : "off"))
      }, null, 8, ["on", "title", "disabled"])) : e.row.type === "choice" ? (t(), o("div", we, [
        (t(!0), o(A, null, R(e.row.choices, (i) => (t(), x(f(q), {
          key: i,
          small: "",
          kind: i === e.row.value ? "primary" : "ghost",
          "data-choice": i,
          disabled: e.readOnly,
          onClick: (K) => T(i)
        }, {
          default: L(() => [
            I(v(i), 1)
          ]),
          _: 2
        }, 1032, ["kind", "data-choice", "disabled", "onClick"]))), 128))
      ])) : $.value ? (t(), o("textarea", {
        key: 3,
        id: e.row.key,
        class: "setting-field setting-list",
        rows: "3",
        value: y.value,
        disabled: e.readOnly,
        placeholder: "One on each line",
        "data-setting-list": "",
        onChange: U
      }, null, 40, pe)) : (t(), o("div", be, [
        l("input", {
          id: e.row.key,
          class: "setting-field",
          type: e.row.type === "number" ? "number" : "text",
          value: e.row.value,
          disabled: e.readOnly,
          onChange: F
        }, null, 40, Ce),
        S.value ? (t(), o("span", Se, v(S.value), 1)) : _("", !0)
      ])),
      w.value ? (t(), o("p", $e, v(w.value), 1)) : _("", !0)
    ], 8, ce));
  }
}, Z = /* @__PURE__ */ P(_e, [["__scopeId", "data-v-89c9f086"]]), Oe = ["data-environment"], xe = { class: "environment-names" }, Ne = { class: "environment-name" }, je = {
  key: 0,
  class: "environment-here"
}, Ee = { class: "environment-folder" }, Te = {
  class: "environment-folder",
  "data-environment-state": ""
}, Ae = {
  key: 1,
  class: "environment-refusal",
  role: "alert",
  "data-environment-refusal": ""
}, Be = {
  __name: "SettingsEnvironments",
  setup(e) {
    const { rows: n, failure: b, loaded: C, load: N, context: w } = X("environment cards", ["environment.*"]), m = O(0), j = O({}), p = (y) => y.name === w.environment, S = g(() => [...n.value].sort((y, a) => p(a) - p(y) || y.name.localeCompare(a.name)));
    async function $(y) {
      if (m.value !== y.id) return void (m.value = y.id);
      const a = await w.run(["environment", "delete", String(y.id)]);
      j.value = { ...j.value, [y.id]: a.ok ? "" : a.error }, m.value = 0, a.ok && N();
    }
    return (y, a) => (t(), x(f(ae), {
      rows: S.value,
      failure: f(b),
      loaded: f(C),
      empty: "No environments yet",
      hint: "An environment is one line of work in this project; make one to start."
    }, {
      default: L(({ row: d }) => [
        l("div", {
          class: "environment",
          "data-environment": d.name
        }, [
          l("div", xe, [
            l("span", Ne, v(d.name), 1),
            p(d) ? (t(), o("span", je, "You are here")) : _("", !0),
            l("p", Ee, v(d.folder) + v(d.branch ? ` on ${d.branch}` : ""), 1),
            l("p", Te, v(d.running_agent_count ? "Agent running" : "No agent running") + " · " + v(d.unfinished_task_count) + " " + v(d.unfinished_task_count === 1 ? "task" : "tasks") + " not done", 1),
            j.value[d.id] ? (t(), o("p", Ae, v(j.value[d.id]), 1)) : _("", !0)
          ]),
          m.value === d.id ? (t(), o(A, { key: 0 }, [
            D(f(q), {
              small: "",
              "data-environment-keep": "",
              onClick: a[0] || (a[0] = (E) => m.value = 0)
            }, {
              default: L(() => [...a[1] || (a[1] = [
                I("Keep it", -1)
              ])]),
              _: 1
            }),
            D(f(q), {
              small: "",
              kind: "danger",
              "data-environment-confirm": "",
              onClick: (E) => $(d)
            }, {
              default: L(() => [...a[2] || (a[2] = [
                I("Yes, remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ], 64)) : (t(), x(f(q), {
            key: 1,
            small: "",
            kind: "danger",
            "data-environment-remove": "",
            disabled: p(d),
            title: p(d) ? "Switch to another environment to remove this one" : "Remove this environment",
            onClick: (E) => $(d)
          }, {
            default: L(() => [...a[3] || (a[3] = [
              I("Remove environment", -1)
            ])]),
            _: 1
          }, 8, ["disabled", "title", "onClick"]))
        ], 8, Oe)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, Le = /* @__PURE__ */ P(Be, [["__scopeId", "data-v-33d34628"]]), Re = { class: "settings" }, Fe = { class: "settings-bar" }, Ue = { class: "settings-search" }, Ve = {
  key: 1,
  class: "settings-failure"
}, Ie = {
  key: 2,
  class: "settings-empty"
}, qe = { class: "settings-body" }, De = {
  class: "settings-nav",
  "aria-label": "Modules"
}, Ge = ["data-jump", "onClick"], Ke = {
  class: "settings-sections",
  "data-settings-sections": ""
}, Me = ["data-module"], Pe = { class: "settings-module-heading" }, Ye = "input,textarea,select,[contenteditable]", He = {
  __name: "SettingsTree",
  setup(e) {
    const n = /* @__PURE__ */ new Set(["environment", "project"]), { rows: b, failure: C, loaded: N, load: w, context: m } = X("setting tree", ["setting.*"]), j = [
      { key: "settings", label: "Settings" },
      { key: "environments", label: "Environments" }
    ], p = O("settings"), S = O(""), $ = O("all"), y = O(null), a = g(() => b.value.filter((r) => !r.key.endsWith(".*"))), d = (r) => r.type !== "group" && n.has(r.source), E = (r) => r.value === !1, T = { all: () => !0, changed: d, off: E }, G = g(() => [
      { key: "all", label: "All" },
      { key: "changed", label: "Changed", title: "Settings you changed from their default", count: a.value.filter(d).length },
      { key: "off", label: "Off", count: a.value.filter(E).length }
    ]), F = g(() => {
      const r = S.value.trim().toLowerCase();
      if (!r && $.value === "all") return a.value;
      const u = a.value.filter((c) => T[$.value](c) && [c.title, c.description, c.key].join(" ").toLowerCase().includes(r)), s = new Set(u.map((c) => c.key));
      for (const c of u)
        for (let V = a.value.find((M) => M.key === c.parent); V; V = a.value.find((M) => M.key === V.parent)) s.add(V.key);
      return a.value.filter((c) => s.has(c.key));
    }), U = g(() => F.value.filter((r) => r.parent === null)), B = g(() => [...new Set(U.value.map((r) => r.module))]), k = m.face === "phone";
    function h(r) {
      const u = r.split("."), s = u[u.length - 1].replace(/[-_]/g, " ");
      return s.slice(0, 1).toUpperCase() + s.slice(1);
    }
    const i = O(""), K = g(() => B.value.includes(i.value) ? i.value : B.value[0] ?? "");
    function Y(r) {
      var u, s, c;
      r.key !== "/" || (s = (u = r.target).closest) != null && s.call(u, Ye) || (r.preventDefault(), (c = y.value) == null || c.focus());
    }
    te(() => {
      window.addEventListener("keydown", Y);
    }), ne(() => {
      window.removeEventListener("keydown", Y);
    });
    async function ee(r) {
      const u = await m.run(r);
      return u.ok && w(), u;
    }
    return (r, u) => (t(), o("div", Re, [
      D(f(J), {
        options: j,
        value: p.value,
        "data-settings-tabs": "",
        onPick: u[0] || (u[0] = (s) => p.value = s)
      }, null, 8, ["value"]),
      p.value === "environments" ? (t(), x(Le, { key: 0 })) : (t(), o(A, { key: 1 }, [
        l("div", Fe, [
          l("label", Ue, [
            z(l("input", {
              ref_key: "field",
              ref: y,
              "onUpdate:modelValue": u[1] || (u[1] = (s) => S.value = s),
              class: "settings-search-field",
              type: "search",
              placeholder: "Find a setting",
              "aria-label": "Find a setting",
              onKeydown: u[2] || (u[2] = se((s) => S.value = "", ["esc"]))
            }, null, 544), [
              [Q, S.value]
            ])
          ]),
          D(f(J), {
            options: G.value,
            value: $.value,
            "data-settings-filter": "",
            onPick: u[3] || (u[3] = (s) => $.value = s)
          }, null, 8, ["options", "value"]),
          u[4] || (u[4] = l("span", { class: "settings-saved" }, "Changes are saved as you make them", -1))
        ]),
        f(N) ? f(C) ? (t(), o("p", Ve, v(f(C)), 1)) : f(N) && !f(b).length ? (t(), o("p", Ie, "No module declares a setting.")) : _("", !0) : (t(), x(f(oe), {
          key: 0,
          shape: "text"
        })),
        l("div", qe, [
          l("nav", De, [
            (t(!0), o(A, null, R(B.value, (s) => (t(), o("button", {
              key: s,
              type: "button",
              class: W(["settings-nav-item", { current: s === K.value }]),
              "data-jump": s,
              onClick: (c) => i.value = s
            }, v(h(s)), 11, Ge))), 128))
          ]),
          l("div", Ke, [
            (t(!0), o(A, null, R(B.value.filter((s) => s === K.value), (s) => (t(), o("section", {
              key: s,
              class: "settings-module",
              "data-module": s
            }, [
              l("h3", Pe, v(h(s)), 1),
              (t(!0), o(A, null, R(U.value.filter((c) => c.module === s), (c) => (t(), x(Z, {
                key: c.key,
                row: c,
                rows: F.value,
                "read-only": k,
                save: ee
              }, null, 8, ["row", "rows"]))), 128))
            ], 8, Me))), 128))
          ])
        ])
      ], 64))
    ]));
  }
}, ze = /* @__PURE__ */ P(He, [["__scopeId", "data-v-e412288f"]]);
export {
  ze as default
};
