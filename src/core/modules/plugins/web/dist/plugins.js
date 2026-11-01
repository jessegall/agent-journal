/* @code-commandments-generated */
if (!document.getElementById("window-styles-77a8199cb5d4")) { const style = document.createElement("style"); style.id = "window-styles-77a8199cb5d4"; style.textContent = ".plugin-tools[data-v-64d191a4],.plugin-form[data-v-64d191a4]{display:flex;gap:8px;margin-bottom:10px}.plugin-form input[data-v-64d191a4]{flex:1;min-width:0}.plugin-moves[data-v-64d191a4]{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.plugin-settings[data-v-64d191a4]{display:flex;flex-direction:column;gap:8px;margin-top:8px}.plugin-setting[data-v-64d191a4]{display:flex;flex-direction:column;gap:2px}.plugin-setting-title[data-v-64d191a4]{color:var(--text-3);font-size:12px}.plugins[data-v-64d191a4]{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}.plugin[data-v-64d191a4]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plugin-head[data-v-64d191a4]{display:flex;gap:10px;align-items:center}.name[data-v-64d191a4]{flex:1;font-weight:500}.release[data-v-64d191a4],.plugin-source[data-v-64d191a4],.plugin-note[data-v-64d191a4]{margin:0;color:var(--text-3);font-size:12px}.plugin-fault[data-v-64d191a4]{color:var(--danger);font-size:12px}.toggle[data-v-64d191a4]{position:relative;flex:none;width:30px;height:17px;border:0;border-radius:9px;background:var(--raised);cursor:pointer}.toggle[data-v-64d191a4]:after{position:absolute;top:2px;left:2px;width:13px;height:13px;border-radius:50%;background:#fff;content:\"\";transition:transform .15s ease}.toggle.on[data-v-64d191a4]{background:var(--accent)}.toggle.on[data-v-64d191a4]:after{transform:translate(13px)}\n"; document.head.appendChild(style); }
import { ref as _, openBlock as t, createElementBlock as i, Fragment as x, createElementVNode as u, createVNode as m, unref as n, withCtx as o, createTextVNode as d, withModifiers as B, withDirectives as T, vModelText as W, createCommentVNode as v, toDisplayString as k, createBlock as A, renderList as I, normalizeClass as w } from "vue";
import { useWindow as z, useRows as K, Btn as r, Skeleton as L } from "@journal/window-kit";
const j = (R, C) => {
  const y = R.__vccOpts || R;
  for (const [b, V] of C)
    y[b] = V;
  return y;
}, q = { class: "plugin-tools" }, G = {
  key: 2,
  class: "plugin-fault",
  role: "alert",
  "data-plugin-refusal": ""
}, H = { class: "plugins" }, J = {
  key: 1,
  class: "plugin-note"
}, Q = {
  key: 2,
  class: "plugin-note"
}, X = ["data-row"], Y = { class: "plugin-head" }, Z = { class: "name" }, ee = { class: "release" }, le = ["aria-checked", "aria-label", "onClick"], te = { class: "plugin-source" }, ne = {
  key: 0,
  class: "plugin-fault"
}, ae = { class: "plugin-moves" }, se = {
  key: 1,
  class: "plugin-settings",
  "data-plugin-setting-list": ""
}, ie = {
  key: 0,
  class: "plugin-note"
}, ue = { class: "plugin-setting-title" }, oe = ["value", "data-plugin-setting", "onChange"], de = {
  __name: "PluginRows",
  setup(R) {
    const C = z(), { rows: y, failure: b, loaded: V, load: P } = K("plugin list", ["plugin.*"]), $ = _(""), p = _(null), c = _(""), f = _(""), S = _(""), g = _({}), D = (a) => h(`plugin ${a.enabled ? "disable" : "enable"} ${a.name}`);
    async function h(a) {
      const e = await C.run(a);
      return $.value = e.ok ? "" : e.error, e.ok && P(), e.ok;
    }
    async function E() {
      c.value.trim() && await h(["plugin", "install", c.value.trim(), "--yes"]) && (c.value = "", p.value = null);
    }
    async function F() {
      f.value.trim() && await h(["message", "send", `Please make a plugin: ${f.value.trim()}`]) && (f.value = "", p.value = null);
    }
    async function N(a, e) {
      await h(["plugin", "remove", a.name, ...e ? ["--purge"] : []]) && (S.value = "");
    }
    async function M(a) {
      if (g.value[a.name]) {
        const { [a.name]: l, ...s } = g.value;
        return void (g.value = s);
      }
      const e = await C.read(["plugin", "settings", a.name]);
      $.value = e.ok ? "" : e.error, e.ok && (g.value = { ...g.value, [a.name]: e.value.settings });
    }
    const O = (a, e, l) => h(["plugin", "configure", a.name, e.key, l]);
    return (a, e) => (t(), i(x, null, [
      u("div", q, [
        m(n(r), {
          small: "",
          bordered: "",
          "data-plugin-install": "",
          onClick: e[0] || (e[0] = (l) => p.value = p.value === "install" ? null : "install")
        }, {
          default: o(() => [...e[5] || (e[5] = [
            d("Install a plugin", -1)
          ])]),
          _: 1
        }),
        m(n(r), {
          small: "",
          bordered: "",
          "data-plugin-make": "",
          onClick: e[1] || (e[1] = (l) => p.value = p.value === "make" ? null : "make")
        }, {
          default: o(() => [...e[6] || (e[6] = [
            d("Ask the agent to make one", -1)
          ])]),
          _: 1
        })
      ]),
      p.value === "install" ? (t(), i("form", {
        key: 0,
        class: "plugin-form",
        "data-plugin-install-form": "",
        onSubmit: B(E, ["prevent"])
      }, [
        T(u("input", {
          "onUpdate:modelValue": e[2] || (e[2] = (l) => c.value = l),
          placeholder: "owner/repo, a link or a folder",
          "aria-label": "Where the plugin is"
        }, null, 512), [
          [W, c.value]
        ]),
        m(n(r), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !c.value.trim()
        }, {
          default: o(() => [...e[7] || (e[7] = [
            d("Install", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : v("", !0),
      p.value === "make" ? (t(), i("form", {
        key: 1,
        class: "plugin-form",
        "data-plugin-make-form": "",
        onSubmit: B(F, ["prevent"])
      }, [
        T(u("input", {
          "onUpdate:modelValue": e[3] || (e[3] = (l) => f.value = l),
          placeholder: "What should the plugin do?",
          "aria-label": "What should the plugin do?"
        }, null, 512), [
          [W, f.value]
        ]),
        m(n(r), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !f.value.trim()
        }, {
          default: o(() => [...e[8] || (e[8] = [
            d("Ask", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : v("", !0),
      $.value ? (t(), i("p", G, k($.value), 1)) : v("", !0),
      u("div", H, [
        n(V) ? !n(b) && !n(y).length ? (t(), i("p", J, "No plugins installed")) : n(b) ? (t(), i("p", Q, k(n(b)), 1)) : v("", !0) : (t(), A(n(L), {
          key: 0,
          shape: "cards"
        })),
        (t(!0), i(x, null, I(n(y), (l) => (t(), i("div", {
          key: l.id,
          class: "plugin",
          "data-row": l.id
        }, [
          u("span", Y, [
            u("span", Z, k(l.title), 1),
            u("span", ee, k(l.release), 1),
            u("button", {
              type: "button",
              role: "switch",
              "aria-checked": l.enabled,
              "aria-label": l.enabled ? "Switch off" : "Switch on",
              class: w(["toggle", { on: l.enabled }]),
              onClick: (s) => D(l)
            }, null, 10, le)
          ]),
          u("span", te, k(l.source), 1),
          l.failing ? (t(), i("span", ne, k(l.last_fault || "Failing"), 1)) : v("", !0),
          u("span", ae, [
            m(n(r), {
              small: "",
              "data-plugin-settings": "",
              onClick: (s) => M(l)
            }, {
              default: o(() => [...e[9] || (e[9] = [
                d("Settings", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            S.value === l.name ? (t(), i(x, { key: 0 }, [
              m(n(r), {
                small: "",
                onClick: e[4] || (e[4] = (s) => S.value = "")
              }, {
                default: o(() => [...e[10] || (e[10] = [
                  d("Keep it", -1)
                ])]),
                _: 1
              }),
              m(n(r), {
                small: "",
                kind: "danger",
                "data-plugin-remove-keep": "",
                onClick: (s) => N(l, !1)
              }, {
                default: o(() => [...e[11] || (e[11] = [
                  d("Remove, keep its data", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              m(n(r), {
                small: "",
                kind: "danger",
                "data-plugin-remove-purge": "",
                onClick: (s) => N(l, !0)
              }, {
                default: o(() => [...e[12] || (e[12] = [
                  d("Remove with its data", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])
            ], 64)) : (t(), A(n(r), {
              key: 1,
              small: "",
              "data-plugin-remove": "",
              onClick: (s) => S.value = l.name
            }, {
              default: o(() => [...e[13] || (e[13] = [
                d("Remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]))
          ]),
          g.value[l.name] ? (t(), i("div", se, [
            g.value[l.name].length ? v("", !0) : (t(), i("p", ie, "This plugin has no settings")),
            (t(!0), i(x, null, I(g.value[l.name], (s) => (t(), i("label", {
              key: s.key,
              class: "plugin-setting"
            }, [
              u("span", ue, k(s.title || s.key), 1),
              u("input", {
                value: s.value,
                "data-plugin-setting": s.key,
                onChange: (U) => O(l, s, U.target.value)
              }, null, 40, oe)
            ]))), 128))
          ])) : v("", !0)
        ], 8, X))), 128))
      ])
    ], 64));
  }
}, ge = /* @__PURE__ */ j(de, [["__scopeId", "data-v-64d191a4"]]);
export {
  ge as default
};
