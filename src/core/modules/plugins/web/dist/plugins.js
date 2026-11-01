/* @code-commandments-generated */
if (!document.getElementById("window-styles-de688e23c0c8")) { const style = document.createElement("style"); style.id = "window-styles-de688e23c0c8"; style.textContent = ".plugin-output[data-v-3b61a9df]{margin:0 0 6px;font-size:13px;white-space:pre-wrap}.plugin-note[data-v-3b61a9df]{margin:0;color:var(--text-2);font-size:13px}.plugin-tools[data-v-3b61a9df],.plugin-form[data-v-3b61a9df]{display:flex;gap:8px;margin-bottom:10px}.plugin-form input[data-v-3b61a9df]{flex:1;min-width:0}.plugin-moves[data-v-3b61a9df]{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.plugin-settings[data-v-3b61a9df]{display:flex;flex-direction:column;gap:8px;margin-top:8px}.plugin-setting[data-v-3b61a9df]{display:flex;flex-direction:column;gap:2px}.plugin-setting-title[data-v-3b61a9df]{color:var(--text-3);font-size:12px}.plugins[data-v-3b61a9df]{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}.plugin[data-v-3b61a9df]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plugin-head[data-v-3b61a9df]{display:flex;gap:10px;align-items:center}.name[data-v-3b61a9df]{flex:1;font-weight:500}.release[data-v-3b61a9df],.plugin-source[data-v-3b61a9df],.plugin-note[data-v-3b61a9df]{margin:0;color:var(--text-3);font-size:12px}.plugin-fault[data-v-3b61a9df]{color:var(--danger);font-size:12px}.toggle[data-v-3b61a9df]{position:relative;flex:none;width:30px;height:17px;border:0;border-radius:9px;background:var(--raised);cursor:pointer}.toggle[data-v-3b61a9df]:after{position:absolute;top:2px;left:2px;width:13px;height:13px;border-radius:50%;background:#fff;content:\"\";transition:transform .15s ease}.toggle.on[data-v-3b61a9df]{background:var(--accent)}.toggle.on[data-v-3b61a9df]:after{transform:translate(13px)}\n"; document.head.appendChild(style); }
import { ref as f, openBlock as t, createElementBlock as n, Fragment as S, createElementVNode as i, createVNode as m, unref as a, withCtx as o, createTextVNode as p, withModifiers as w, withDirectives as A, vModelText as D, createCommentVNode as d, toDisplayString as r, createBlock as B, renderList as I, normalizeClass as K } from "vue";
import { useWindow as j, useRows as q, Btn as g, Skeleton as G, Dialog as H } from "@journal/window-kit";
const J = (V, h) => {
  const b = V.__vccOpts || V;
  for (const [C, W] of h)
    b[C] = W;
  return b;
}, Q = { class: "plugin-tools" }, X = {
  key: 2,
  class: "plugin-fault",
  role: "alert",
  "data-plugin-refusal": ""
}, Y = { class: "plugins" }, Z = {
  key: 1,
  class: "plugin-note"
}, ee = {
  key: 2,
  class: "plugin-note"
}, le = ["data-row"], te = { class: "plugin-head" }, ne = { class: "name" }, ae = { class: "release" }, se = ["aria-checked", "aria-label", "onClick"], ue = { class: "plugin-source" }, ie = {
  key: 0,
  class: "plugin-fault"
}, oe = { class: "plugin-moves" }, de = {
  key: 1,
  class: "plugin-settings",
  "data-plugin-setting-list": ""
}, re = {
  key: 0,
  class: "plugin-note"
}, pe = { class: "plugin-setting-title" }, ge = ["value", "data-plugin-setting", "onChange"], ve = {
  key: 3,
  class: "plugin-fault",
  role: "alert",
  "data-plugin-record-failure": ""
}, me = { "data-plugin-record-body": "" }, ce = {
  key: 0,
  class: "plugin-fault"
}, ke = {
  key: 1,
  class: "plugin-note"
}, fe = {
  __name: "PluginRows",
  setup(V) {
    const h = j(), { rows: b, failure: C, loaded: W, load: F } = q("plugin list", ["plugin.*"]), x = f(""), c = f(null), _ = f(""), y = f(""), R = f(""), k = f({}), P = (s) => $(`plugin ${s.enabled ? "disable" : "enable"} ${s.name}`);
    async function $(s) {
      const e = await h.run(s);
      return x.value = e.ok ? "" : e.error, e.ok && F(), e.ok;
    }
    async function E() {
      _.value.trim() && await $(["plugin", "install", _.value.trim(), "--yes"]) && (_.value = "", c.value = null);
    }
    async function L() {
      y.value.trim() && await $(["message", "send", `Please make a plugin: ${y.value.trim()}`]) && (y.value = "", c.value = null);
    }
    async function T(s, e) {
      await $(["plugin", "remove", s.name, ...e ? ["--purge"] : []]) && (R.value = "");
    }
    async function M(s) {
      if (k.value[s.name]) {
        const { [s.name]: l, ...u } = k.value;
        return void (k.value = u);
      }
      const e = await h.read(["plugin", "settings", s.name]);
      x.value = e.ok ? "" : e.error, e.ok && (k.value = { ...k.value, [s.name]: e.value.settings });
    }
    const O = (s, e, l) => $(["plugin", "configure", s.name, e.key, l]), v = f(null), N = f("");
    async function U(s) {
      const e = await h.read(`plugin record ${s.name}`);
      N.value = e.ok ? "" : e.error, v.value = e.ok ? e.value : null;
    }
    return (s, e) => (t(), n(S, null, [
      i("div", Q, [
        m(a(g), {
          small: "",
          bordered: "",
          "data-plugin-install": "",
          onClick: e[0] || (e[0] = (l) => c.value = c.value === "install" ? null : "install")
        }, {
          default: o(() => [...e[6] || (e[6] = [
            p("Install a plugin", -1)
          ])]),
          _: 1
        }),
        m(a(g), {
          small: "",
          bordered: "",
          "data-plugin-make": "",
          onClick: e[1] || (e[1] = (l) => c.value = c.value === "make" ? null : "make")
        }, {
          default: o(() => [...e[7] || (e[7] = [
            p("Ask the agent to make one", -1)
          ])]),
          _: 1
        })
      ]),
      c.value === "install" ? (t(), n("form", {
        key: 0,
        class: "plugin-form",
        "data-plugin-install-form": "",
        onSubmit: w(E, ["prevent"])
      }, [
        A(i("input", {
          "onUpdate:modelValue": e[2] || (e[2] = (l) => _.value = l),
          placeholder: "owner/repo, a link or a folder",
          "aria-label": "Where the plugin is"
        }, null, 512), [
          [D, _.value]
        ]),
        m(a(g), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !_.value.trim()
        }, {
          default: o(() => [...e[8] || (e[8] = [
            p("Install", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : d("", !0),
      c.value === "make" ? (t(), n("form", {
        key: 1,
        class: "plugin-form",
        "data-plugin-make-form": "",
        onSubmit: w(L, ["prevent"])
      }, [
        A(i("input", {
          "onUpdate:modelValue": e[3] || (e[3] = (l) => y.value = l),
          placeholder: "What should the plugin do?",
          "aria-label": "What should the plugin do?"
        }, null, 512), [
          [D, y.value]
        ]),
        m(a(g), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !y.value.trim()
        }, {
          default: o(() => [...e[9] || (e[9] = [
            p("Ask", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : d("", !0),
      x.value ? (t(), n("p", X, r(x.value), 1)) : d("", !0),
      i("div", Y, [
        a(W) ? !a(C) && !a(b).length ? (t(), n("p", Z, "No plugins installed")) : a(C) ? (t(), n("p", ee, r(a(C)), 1)) : d("", !0) : (t(), B(a(G), {
          key: 0,
          shape: "cards"
        })),
        (t(!0), n(S, null, I(a(b), (l) => (t(), n("div", {
          key: l.id,
          class: "plugin",
          "data-row": l.id
        }, [
          i("span", te, [
            i("span", ne, r(l.title), 1),
            i("span", ae, r(l.release), 1),
            i("button", {
              type: "button",
              role: "switch",
              "aria-checked": l.enabled,
              "aria-label": l.enabled ? "Switch off" : "Switch on",
              class: K(["toggle", { on: l.enabled }]),
              onClick: (u) => P(l)
            }, null, 10, se)
          ]),
          i("span", ue, r(l.source), 1),
          l.failing ? (t(), n("span", ie, r(l.last_fault || "Failing"), 1)) : d("", !0),
          i("span", oe, [
            m(a(g), {
              small: "",
              "data-plugin-settings": "",
              onClick: (u) => M(l)
            }, {
              default: o(() => [...e[10] || (e[10] = [
                p("Settings", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            m(a(g), {
              small: "",
              "data-plugin-record": "",
              onClick: (u) => U(l)
            }, {
              default: o(() => [...e[11] || (e[11] = [
                p("What it did", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            R.value === l.name ? (t(), n(S, { key: 0 }, [
              m(a(g), {
                small: "",
                onClick: e[4] || (e[4] = (u) => R.value = "")
              }, {
                default: o(() => [...e[12] || (e[12] = [
                  p("Keep it", -1)
                ])]),
                _: 1
              }),
              m(a(g), {
                small: "",
                kind: "danger",
                "data-plugin-remove-keep": "",
                onClick: (u) => T(l, !1)
              }, {
                default: o(() => [...e[13] || (e[13] = [
                  p("Remove, keep its data", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              m(a(g), {
                small: "",
                kind: "danger",
                "data-plugin-remove-purge": "",
                onClick: (u) => T(l, !0)
              }, {
                default: o(() => [...e[14] || (e[14] = [
                  p("Remove with its data", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])
            ], 64)) : (t(), B(a(g), {
              key: 1,
              small: "",
              "data-plugin-remove": "",
              onClick: (u) => R.value = l.name
            }, {
              default: o(() => [...e[15] || (e[15] = [
                p("Remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]))
          ]),
          k.value[l.name] ? (t(), n("div", de, [
            k.value[l.name].length ? d("", !0) : (t(), n("p", re, "This plugin has no settings")),
            (t(!0), n(S, null, I(k.value[l.name], (u) => (t(), n("label", {
              key: u.key,
              class: "plugin-setting"
            }, [
              i("span", pe, r(u.title || u.key), 1),
              i("input", {
                value: u.value,
                "data-plugin-setting": u.key,
                onChange: (z) => O(l, u, z.target.value)
              }, null, 40, ge)
            ]))), 128))
          ])) : d("", !0)
        ], 8, le))), 128))
      ]),
      N.value ? (t(), n("p", ve, r(N.value), 1)) : d("", !0),
      v.value ? (t(), B(a(H), {
        key: 4,
        title: `What ${v.value.name} did`,
        onClose: e[5] || (e[5] = (l) => v.value = null)
      }, {
        default: o(() => [
          i("div", me, [
            v.value.last_fault ? (t(), n("p", ce, "Last fault, " + r(v.value.fault_count) + " in a row: " + r(v.value.last_fault), 1)) : d("", !0),
            v.value.outputs.length ? d("", !0) : (t(), n("p", ke, "It has done nothing yet.")),
            (t(!0), n(S, null, I(v.value.outputs, (l) => (t(), n("p", {
              key: l.id,
              class: "plugin-output",
              "data-plugin-output": ""
            }, r(l.output), 1))), 128))
          ])
        ]),
        _: 1
      }, 8, ["title"])) : d("", !0)
    ], 64));
  }
}, he = /* @__PURE__ */ J(fe, [["__scopeId", "data-v-3b61a9df"]]);
export {
  he as default
};
