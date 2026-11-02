/* @code-commandments-generated */
if (!document.getElementById("window-styles-0a370eb74475")) { const style = document.createElement("style"); style.id = "window-styles-0a370eb74475"; style.textContent = ".setting-input[data-v-89c9f086]{display:flex;gap:8px;align-items:center}.setting-unit[data-v-89c9f086]{flex:none;color:var(--text-3);font-size:12px}.setting-list[data-v-89c9f086]{resize:vertical}.setting-head[data-v-89c9f086]{display:flex;gap:6px;align-items:center}.setting-dot[data-v-89c9f086]{width:6px;height:6px;border-radius:50%;background:var(--accent)}.setting-reset[data-v-89c9f086]{margin-left:auto;padding:0 6px;border:0;border-radius:5px;background:none;color:var(--text-3);font:inherit;font-size:11.5px;cursor:pointer}.setting-reset[data-v-89c9f086]:hover{background:var(--hover);color:var(--text)}.setting-group[data-v-89c9f086]{display:flex;flex-direction:column;gap:6px}.setting-group-head[data-v-89c9f086]{display:flex;align-items:center;gap:10px}.setting-group-title[data-v-89c9f086]{margin:0;font-size:13px;font-weight:600}.setting-children[data-v-89c9f086]{display:flex;flex-direction:column;gap:14px;padding-left:14px;border-left:1px solid var(--line)}.setting-children.off[data-v-89c9f086]{opacity:.5}.setting-value[data-v-89c9f086]{display:flex;flex-direction:column;gap:4px}.setting-label[data-v-89c9f086]{font-size:12px;color:var(--text)}.setting-description[data-v-89c9f086],.setting-shown[data-v-89c9f086]{margin:0;font-size:12px;color:var(--text-3)}.setting-field[data-v-89c9f086]{max-width:360px;padding:6px 10px;border:1px solid var(--line);border-radius:6px;color:var(--text);background:transparent}.setting-switch[data-v-89c9f086]{align-self:flex-start;padding:2px 10px;border:0;border-radius:10px;color:var(--text-2);background:var(--raised);font-size:11px;cursor:pointer}.setting-switch[aria-checked=true][data-v-89c9f086]{color:#fff;background:var(--accent)}.setting-choices[data-v-89c9f086]{display:flex;gap:6px}.setting-refusal[data-v-89c9f086]{margin:0;font-size:12px;color:var(--danger)}.environment[data-v-9614e081]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.environment-names[data-v-9614e081]{flex:1;min-width:0}.environment-name[data-v-9614e081]{font-weight:500}.environment-here[data-v-9614e081]{margin-left:8px;color:var(--accent-text);font-size:12px}.environment-folder[data-v-9614e081]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.environment-refusal[data-v-9614e081]{margin:2px 0 0;color:var(--danger);font-size:12.5px}.settings-nav-item.current[data-v-21a6956e]{background:var(--hover);color:var(--text)}.settings[data-v-21a6956e]{display:flex;flex-direction:column;gap:16px}.settings-bar[data-v-21a6956e]{display:flex;flex-wrap:wrap;gap:12px;align-items:center}.settings-search[data-v-21a6956e]{flex:1;min-width:200px;max-width:360px}.settings-saved[data-v-21a6956e]{color:var(--text-3);font-size:12px}.settings-search-field[data-v-21a6956e]{width:100%;max-width:360px;padding:7px 12px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text)}.settings-body[data-v-21a6956e]{display:flex;gap:28px;align-items:flex-start}.settings-nav[data-v-21a6956e]{display:flex;flex:none;flex-direction:column;gap:2px;width:150px;position:sticky;top:0}.settings-nav-item[data-v-21a6956e]{padding:5px 10px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-align:left;cursor:pointer}.settings-nav-item[data-v-21a6956e]:hover{background:var(--hover);color:var(--text)}.settings-sections[data-v-21a6956e]{display:flex;flex:1;flex-direction:column;gap:32px;min-width:0}.settings-module[data-v-21a6956e]{display:flex;flex-direction:column;gap:18px}.settings-module-heading[data-v-21a6956e]{margin:0;font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:var(--text-3)}.settings-failure[data-v-21a6956e],.settings-empty[data-v-21a6956e]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { computed as y, ref as b, openBlock as t, createElementBlock as i, createElementVNode as r, toDisplayString as v, createBlock as N, unref as f, createCommentVNode as O, normalizeClass as Q, Fragment as A, renderList as V, withDirectives as X, vModelText as Z, withCtx as I, createTextVNode as G, createVNode as M, onMounted as oe, onUnmounted as le, withKeys as ie } from "vue";
import { Switch as W, Btn as D, useRows as ee, RowList as re, Segmented as z, Skeleton as ue } from "@journal/window-kit";
const Y = (e, n) => {
  const C = e.__vccOpts || e;
  for (const [S, x] of n)
    C[S] = x;
  return C;
}, de = ["data-setting"], ce = { class: "setting-group-head" }, ve = { class: "setting-group-title" }, fe = { class: "setting-description" }, ge = {
  key: 0,
  class: "setting-refusal"
}, ye = ["data-setting"], me = { class: "setting-head" }, ke = {
  key: 0,
  class: "setting-dot",
  "data-setting-changed": "",
  title: "Changed from the default"
}, he = ["for"], we = ["title"], pe = { class: "setting-description" }, be = { class: "setting-shown" }, Ce = ["id", "disabled"], Se = {
  key: 2,
  class: "setting-choices"
}, $e = ["id", "value", "disabled"], _e = {
  key: 4,
  class: "setting-input"
}, Oe = ["id", "type", "value", "disabled"], Ne = {
  key: 0,
  class: "setting-unit",
  "data-setting-unit": ""
}, xe = {
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
    const n = e, C = y(() => n.rows.filter((h) => h.parent === n.row.key)), S = y(() => n.row.type === "group"), x = y(() => n.row.scope === "project" ? ["--project"] : []), w = b(""), m = b(""), E = /* @__PURE__ */ new Set(["environment", "project"]), p = { seconds: "seconds", minutes: "minutes", hours: "hours", days: "days", bytes: "bytes", characters: "characters", percent: "%" }, $ = y(() => n.row.type === "number" ? p[n.row.key.split(/[-_.]/).at(-1)] ?? "" : ""), _ = y(() => n.row.type === "list" || n.row.type === "number list"), g = y(() => n.row.value ? JSON.parse(n.row.value).join(`
`) : ""), l = y(() => E.has(n.row.source)), c = y(() => !n.readOnly && !n.row.secret && !S.value && l.value && n.row.default !== null && n.row.default !== void 0), j = y(() => typeof n.row.default == "boolean" ? n.row.default ? "on" : "off" : Array.isArray(n.row.default) ? n.row.default.join(",") : String(n.row.default));
    async function R(h) {
      const k = ["setting", "set", n.row.key, String(h), ...x.value], u = await n.save(k);
      u.ok ? w.value = "" : w.value = u.error;
    }
    async function P() {
      const h = await n.save(["setting", "switch", n.row.key, n.row.value === !1 ? "on" : "off", "--project"]);
      w.value = h.ok ? "" : h.error;
    }
    function q(h) {
      R(h.target.value);
    }
    function F(h) {
      const k = h.target.value.split(`
`).map((u) => u.trim()).filter(Boolean);
      R(n.row.type === "list" ? JSON.stringify(k) : k.join(","));
    }
    function L() {
      m.value && R(m.value).then(() => m.value = "");
    }
    return (h, k) => S.value ? (t(), i("section", {
      key: 0,
      class: "setting-group",
      "data-setting": e.row.key
    }, [
      r("div", ce, [
        r("h3", ve, v(e.row.title), 1),
        e.row.toggleable && !e.readOnly ? (t(), N(f(W), {
          key: 0,
          on: e.row.value !== !1,
          title: `Switch ${e.row.title} ${e.row.value === !1 ? "on" : "off"}`,
          "data-group-switch": "",
          onChange: P
        }, null, 8, ["on", "title"])) : O("", !0)
      ]),
      r("p", fe, v(e.row.description), 1),
      r("div", {
        class: Q(["setting-children", { off: e.row.value === !1 }])
      }, [
        (t(!0), i(A, null, V(C.value, (u) => (t(), N(te, {
          key: u.key,
          row: u,
          rows: e.rows,
          "read-only": e.readOnly,
          save: e.save
        }, null, 8, ["row", "rows", "read-only", "save"]))), 128))
      ], 2),
      w.value ? (t(), i("p", ge, v(w.value), 1)) : O("", !0)
    ], 8, de)) : (t(), i("div", {
      key: 1,
      class: "setting-value",
      "data-setting": e.row.key
    }, [
      r("div", me, [
        l.value ? (t(), i("span", ke)) : O("", !0),
        r("label", {
          class: "setting-label",
          for: e.row.key
        }, v(e.row.title), 9, he),
        c.value ? (t(), i("button", {
          key: 1,
          type: "button",
          class: "setting-reset",
          "data-setting-reset": "",
          title: `Back to the default: ${j.value}`,
          onClick: k[0] || (k[0] = (u) => R(j.value))
        }, "Reset", 8, we)) : O("", !0)
      ]),
      r("p", pe, v(e.row.description), 1),
      e.row.secret ? (t(), i(A, { key: 0 }, [
        r("p", be, v(e.row.shown), 1),
        X(r("input", {
          id: e.row.key,
          "onUpdate:modelValue": k[1] || (k[1] = (u) => m.value = u),
          class: "setting-field",
          type: "password",
          disabled: e.readOnly,
          placeholder: "Type a new value",
          onChange: L
        }, null, 40, Ce), [
          [Z, m.value]
        ])
      ], 64)) : e.row.type === "flag" ? (t(), N(f(W), {
        key: 1,
        on: e.row.value === !0,
        title: e.row.title,
        disabled: e.readOnly,
        "data-flag-switch": "",
        onChange: k[2] || (k[2] = (u) => !e.readOnly && R(u ? "on" : "off"))
      }, null, 8, ["on", "title", "disabled"])) : e.row.type === "choice" ? (t(), i("div", Se, [
        (t(!0), i(A, null, V(e.row.choices, (u) => (t(), N(f(D), {
          key: u,
          small: "",
          kind: u === e.row.value ? "primary" : "ghost",
          "data-choice": u,
          disabled: e.readOnly,
          onClick: (U) => R(u)
        }, {
          default: I(() => [
            G(v(u), 1)
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
        r("input", {
          id: e.row.key,
          class: "setting-field",
          type: e.row.type === "number" ? "number" : "text",
          value: e.row.value,
          disabled: e.readOnly,
          onChange: q
        }, null, 40, Oe),
        $.value ? (t(), i("span", Ne, v($.value), 1)) : O("", !0)
      ])),
      w.value ? (t(), i("p", xe, v(w.value), 1)) : O("", !0)
    ], 8, ye));
  }
}, te = /* @__PURE__ */ Y(Ee, [["__scopeId", "data-v-89c9f086"]]), je = ["data-environment"], Re = { class: "environment-names" }, Ae = { class: "environment-name" }, Be = {
  key: 0,
  class: "environment-here"
}, Le = { class: "environment-folder" }, Te = {
  class: "environment-folder",
  "data-environment-state": ""
}, Ie = {
  key: 1,
  class: "environment-refusal",
  role: "alert",
  "data-environment-refusal": ""
}, Ve = {
  __name: "SettingsEnvironments",
  setup(e) {
    const { rows: n, failure: C, loaded: S, load: x, context: w } = ee("environment cards", ["environment.*"]), m = b(0), E = b({}), p = (g) => g.name === w.environment, $ = y(() => [...n.value].sort((g, l) => p(l) - p(g) || g.name.localeCompare(l.name)));
    async function _(g) {
      if (m.value !== g.id) return void (m.value = g.id);
      const l = await w.run(["environment", "delete", String(g.id)]);
      E.value = { ...E.value, [g.id]: l.ok ? "" : l.error }, m.value = 0, l.ok && x();
    }
    return (g, l) => (t(), N(f(re), {
      rows: $.value,
      failure: f(C),
      loaded: f(S),
      empty: "No environments yet"
    }, {
      default: I(({ row: c }) => [
        r("div", {
          class: "environment",
          "data-environment": c.name
        }, [
          r("div", Re, [
            r("span", Ae, v(c.name), 1),
            p(c) ? (t(), i("span", Be, "You are here")) : O("", !0),
            r("p", Le, v(c.folder) + v(c.branch ? ` on ${c.branch}` : ""), 1),
            r("p", Te, v(c.running_agent_count ? "Agent running" : "No agent running") + " · " + v(c.unfinished_task_count) + " " + v(c.unfinished_task_count === 1 ? "task" : "tasks") + " not done", 1),
            E.value[c.id] ? (t(), i("p", Ie, v(E.value[c.id]), 1)) : O("", !0)
          ]),
          m.value === c.id ? (t(), i(A, { key: 0 }, [
            M(f(D), {
              small: "",
              "data-environment-keep": "",
              onClick: l[0] || (l[0] = (j) => m.value = 0)
            }, {
              default: I(() => [...l[1] || (l[1] = [
                G("Keep it", -1)
              ])]),
              _: 1
            }),
            M(f(D), {
              small: "",
              kind: "danger",
              "data-environment-confirm": "",
              onClick: (j) => _(c)
            }, {
              default: I(() => [...l[2] || (l[2] = [
                G("Yes, remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])
          ], 64)) : (t(), N(f(D), {
            key: 1,
            small: "",
            kind: "danger",
            "data-environment-remove": "",
            disabled: p(c),
            title: p(c) ? "Switch to another environment to remove this one" : "Remove this environment",
            onClick: (j) => _(c)
          }, {
            default: I(() => [...l[3] || (l[3] = [
              G("Remove environment", -1)
            ])]),
            _: 1
          }, 8, ["disabled", "title", "onClick"]))
        ], 8, je)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, qe = /* @__PURE__ */ Y(Ve, [["__scopeId", "data-v-9614e081"]]), Fe = { class: "settings" }, Ue = { class: "settings-bar" }, Ge = { class: "settings-search" }, De = {
  key: 1,
  class: "settings-failure"
}, Me = {
  key: 2,
  class: "settings-empty"
}, Pe = { class: "settings-body" }, Ye = {
  class: "settings-nav",
  "aria-label": "Modules"
}, Ke = ["data-jump", "onClick"], He = ["data-module"], Je = { class: "settings-module-heading" }, We = "input,textarea,select,[contenteditable]", ze = 12, Qe = {
  __name: "SettingsTree",
  setup(e) {
    const n = /* @__PURE__ */ new Set(["environment", "project"]), { rows: C, failure: S, loaded: x, load: w, context: m } = ee("setting tree", ["setting.*"]), E = [
      { key: "settings", label: "Settings" },
      { key: "environments", label: "Environments" }
    ], p = b("settings"), $ = b(""), _ = b("all"), g = b(null), l = y(() => C.value.filter((s) => !s.key.endsWith(".*"))), c = (s) => s.type !== "group" && n.has(s.source), j = (s) => s.value === !1, R = { all: () => !0, changed: c, off: j }, P = y(() => [
      { key: "all", label: "All" },
      { key: "changed", label: "Changed", title: "Settings you changed from their default", count: l.value.filter(c).length },
      { key: "off", label: "Off", count: l.value.filter(j).length }
    ]), q = y(() => {
      const s = $.value.trim().toLowerCase();
      if (!s && _.value === "all") return l.value;
      const o = l.value.filter((d) => R[_.value](d) && [d.title, d.description, d.key].join(" ").toLowerCase().includes(s)), a = new Set(o.map((d) => d.key));
      for (const d of o)
        for (let B = l.value.find((T) => T.key === d.parent); B; B = l.value.find((T) => T.key === B.parent)) a.add(B.key);
      return l.value.filter((d) => a.has(d.key));
    }), F = y(() => q.value.filter((s) => s.parent === null)), L = y(() => [...new Set(F.value.map((s) => s.module))]), h = m.face === "phone";
    function k(s) {
      const o = s.split("."), a = o[o.length - 1].replace(/[-_]/g, " ");
      return a.slice(0, 1).toUpperCase() + a.slice(1);
    }
    const u = b(""), U = b(null);
    function ne(s) {
      var o;
      u.value = s, (o = document.querySelector(`[data-module="${s}"]`)) == null || o.scrollIntoView({ block: "start" });
    }
    function K(s) {
      var d, B, T, J;
      if (!((B = (d = s.target).contains) != null && B.call(d, U.value))) return;
      const o = s.target.getBoundingClientRect().top, a = [...((T = U.value) == null ? void 0 : T.querySelectorAll("[data-module]")) ?? []].filter((ae) => ae.getBoundingClientRect().top <= o + ze);
      u.value = ((J = a.at(-1)) == null ? void 0 : J.dataset.module) ?? L.value[0] ?? "";
    }
    function H(s) {
      var o, a, d;
      s.key !== "/" || (a = (o = s.target).closest) != null && a.call(o, We) || (s.preventDefault(), (d = g.value) == null || d.focus());
    }
    oe(() => {
      window.addEventListener("keydown", H), document.addEventListener("scroll", K, { capture: !0, passive: !0 });
    }), le(() => {
      window.removeEventListener("keydown", H), document.removeEventListener("scroll", K, { capture: !0 });
    });
    async function se(s) {
      const o = await m.run(s);
      return o.ok && w(), o;
    }
    return (s, o) => (t(), i("div", Fe, [
      M(f(z), {
        options: E,
        value: p.value,
        "data-settings-tabs": "",
        onPick: o[0] || (o[0] = (a) => p.value = a)
      }, null, 8, ["value"]),
      p.value === "environments" ? (t(), N(qe, { key: 0 })) : (t(), i(A, { key: 1 }, [
        r("div", Ue, [
          r("label", Ge, [
            X(r("input", {
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
          M(f(z), {
            options: P.value,
            value: _.value,
            "data-settings-filter": "",
            onPick: o[3] || (o[3] = (a) => _.value = a)
          }, null, 8, ["options", "value"]),
          o[4] || (o[4] = r("span", { class: "settings-saved" }, "Changes are saved as you make them", -1))
        ]),
        f(x) ? f(S) ? (t(), i("p", De, v(f(S)), 1)) : f(x) && !f(C).length ? (t(), i("p", Me, "No module declares a setting.")) : O("", !0) : (t(), N(f(ue), {
          key: 0,
          shape: "text"
        })),
        r("div", Pe, [
          r("nav", Ye, [
            (t(!0), i(A, null, V(L.value, (a) => (t(), i("button", {
              key: a,
              type: "button",
              class: Q(["settings-nav-item", { current: a === (u.value || L.value[0]) }]),
              "data-jump": a,
              onClick: (d) => ne(a)
            }, v(k(a)), 11, Ke))), 128))
          ]),
          r("div", {
            ref_key: "sections",
            ref: U,
            class: "settings-sections",
            "data-settings-sections": ""
          }, [
            (t(!0), i(A, null, V(L.value, (a) => (t(), i("section", {
              key: a,
              class: "settings-module",
              "data-module": a
            }, [
              r("h3", Je, v(k(a)), 1),
              (t(!0), i(A, null, V(F.value.filter((d) => d.module === a), (d) => (t(), N(te, {
                key: d.key,
                row: d,
                rows: q.value,
                "read-only": h,
                save: se
              }, null, 8, ["row", "rows"]))), 128))
            ], 8, He))), 128))
          ], 512)
        ])
      ], 64))
    ]));
  }
}, et = /* @__PURE__ */ Y(Qe, [["__scopeId", "data-v-21a6956e"]]);
export {
  et as default
};
