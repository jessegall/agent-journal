/* @code-commandments-generated */
if (!document.getElementById("window-styles-11d8c8a67035")) { const style = document.createElement("style"); style.id = "window-styles-11d8c8a67035"; style.textContent = ".plugin-output[data-v-a417ae13]{margin:0 0 6px;font-size:13px;white-space:pre-wrap}.plugin-note[data-v-a417ae13]{margin:0;color:var(--text-2);font-size:13px}.plugin-tools[data-v-a417ae13],.plugin-form[data-v-a417ae13]{display:flex;gap:8px;margin-bottom:10px}.plugin-form input[data-v-a417ae13]{flex:1;min-width:0}.plugin-moves[data-v-a417ae13]{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.plugin-settings[data-v-a417ae13]{display:flex;flex-direction:column;gap:8px;margin-top:8px}.plugin-setting[data-v-a417ae13]{display:flex;flex-direction:column;gap:2px}.plugin-setting-title[data-v-a417ae13]{color:var(--text-3);font-size:12px}.plugins[data-v-a417ae13]{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}.plugin[data-v-a417ae13]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plugin-head[data-v-a417ae13]{display:flex;gap:10px;align-items:center}.name[data-v-a417ae13]{flex:1;font-weight:500}.release[data-v-a417ae13],.plugin-source[data-v-a417ae13],.plugin-note[data-v-a417ae13]{margin:0;color:var(--text-3);font-size:12px}.plugin-fault[data-v-a417ae13]{color:var(--danger);font-size:12px}.toggle[data-v-a417ae13]{position:relative;flex:none;width:30px;height:17px;border:0;border-radius:9px;background:var(--raised);cursor:pointer}.toggle[data-v-a417ae13]:after{position:absolute;top:2px;left:2px;width:13px;height:13px;border-radius:50%;background:#fff;content:\"\";transition:transform .15s ease}.toggle.on[data-v-a417ae13]{background:var(--accent)}.toggle.on[data-v-a417ae13]:after{transform:translate(13px)}\n"; document.head.appendChild(style); }
import { ref as f, openBlock as t, createElementBlock as a, Fragment as S, createElementVNode as i, createVNode as m, unref as s, withCtx as o, createTextVNode as p, withModifiers as w, withDirectives as A, vModelText as D, createCommentVNode as r, toDisplayString as d, createBlock as B, renderList as I, normalizeClass as J } from "vue";
import { useWindow as K, useRows as q, Btn as g, Skeleton as G, Dialog as H } from "@journal/window-kit";
const Q = (x, h) => {
  const b = x.__vccOpts || x;
  for (const [C, N] of h)
    b[C] = N;
  return b;
}, X = { class: "plugin-tools" }, Y = {
  key: 2,
  class: "plugin-fault",
  role: "alert",
  "data-plugin-refusal": ""
}, Z = { class: "plugins" }, ee = {
  key: 1,
  class: "plugin-note"
}, le = {
  key: 2,
  class: "plugin-note"
}, te = ["data-row"], ne = { class: "plugin-head" }, ae = { class: "name" }, se = { class: "release" }, ue = ["aria-checked", "aria-label", "onClick"], ie = { class: "plugin-source" }, oe = {
  key: 0,
  class: "plugin-fault"
}, re = { class: "plugin-moves" }, de = {
  key: 1,
  class: "plugin-settings",
  "data-plugin-setting-list": ""
}, pe = {
  key: 0,
  class: "plugin-note"
}, ge = { class: "plugin-setting-title" }, ve = ["value", "data-plugin-setting", "onChange"], me = {
  key: 3,
  class: "plugin-fault",
  role: "alert",
  "data-plugin-record-failure": ""
}, ce = { "data-plugin-record-body": "" }, ke = {
  key: 0,
  class: "plugin-fault"
}, fe = {
  key: 1,
  class: "plugin-note"
}, _e = {
  __name: "PluginRows",
  setup(x) {
    const h = K(), { rows: b, failure: C, loaded: N, load: F } = q("plugin list", ["plugin.*"]), R = f(""), c = f(null), _ = f(""), y = f(""), W = f(""), k = f({}), O = (n) => $(`plugin ${n.enabled ? "disable" : "enable"} ${n.name}`);
    async function $(n) {
      const e = await h.run(n);
      return R.value = e.ok ? "" : e.error, e.ok && F(), e.ok;
    }
    async function P() {
      _.value.trim() && await $(["plugin", "install", _.value.trim(), "--yes"]) && (_.value = "", c.value = null);
    }
    async function E() {
      y.value.trim() && await $(["message", "send", `Please make a plugin: ${y.value.trim()}`]) && (y.value = "", c.value = null);
    }
    async function T(n, e) {
      await $(["plugin", "remove", n.name, ...e ? ["--purge"] : []]) && (W.value = "");
    }
    async function L(n) {
      if (k.value[n.name]) {
        const { [n.name]: l, ...u } = k.value;
        return void (k.value = u);
      }
      const e = await h.read(["plugin", "settings", n.name]);
      R.value = e.ok ? "" : e.error, e.ok && (k.value = { ...k.value, [n.name]: e.value.settings });
    }
    const M = (n, e, l) => $(["plugin", "configure", n.name, e.key, l]), v = f(null);
    function U(n) {
      try {
        return JSON.parse(n).cards.map((e) => e.detail || e.title).join(`
`);
      } catch {
        return n;
      }
    }
    const V = f("");
    async function j(n) {
      const e = await h.read(`plugin record ${n.name}`);
      V.value = e.ok ? "" : e.error, v.value = e.ok ? e.value : null;
    }
    return (n, e) => (t(), a(S, null, [
      i("div", X, [
        m(s(g), {
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
        m(s(g), {
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
      c.value === "install" ? (t(), a("form", {
        key: 0,
        class: "plugin-form",
        "data-plugin-install-form": "",
        onSubmit: w(P, ["prevent"])
      }, [
        A(i("input", {
          "onUpdate:modelValue": e[2] || (e[2] = (l) => _.value = l),
          placeholder: "owner/repo, a link or a folder",
          "aria-label": "Where the plugin is"
        }, null, 512), [
          [D, _.value]
        ]),
        m(s(g), {
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
      ], 32)) : r("", !0),
      c.value === "make" ? (t(), a("form", {
        key: 1,
        class: "plugin-form",
        "data-plugin-make-form": "",
        onSubmit: w(E, ["prevent"])
      }, [
        A(i("input", {
          "onUpdate:modelValue": e[3] || (e[3] = (l) => y.value = l),
          placeholder: "What should the plugin do?",
          "aria-label": "What should the plugin do?"
        }, null, 512), [
          [D, y.value]
        ]),
        m(s(g), {
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
      ], 32)) : r("", !0),
      R.value ? (t(), a("p", Y, d(R.value), 1)) : r("", !0),
      i("div", Z, [
        s(N) ? !s(C) && !s(b).length ? (t(), a("p", ee, "No plugins installed")) : s(C) ? (t(), a("p", le, d(s(C)), 1)) : r("", !0) : (t(), B(s(G), {
          key: 0,
          shape: "cards"
        })),
        (t(!0), a(S, null, I(s(b), (l) => (t(), a("div", {
          key: l.id,
          class: "plugin",
          "data-row": l.id
        }, [
          i("span", ne, [
            i("span", ae, d(l.title), 1),
            i("span", se, d(l.release), 1),
            i("button", {
              type: "button",
              role: "switch",
              "aria-checked": l.enabled,
              "aria-label": l.enabled ? "Switch off" : "Switch on",
              class: J(["toggle", { on: l.enabled }]),
              onClick: (u) => O(l)
            }, null, 10, ue)
          ]),
          i("span", ie, d(l.source), 1),
          l.failing ? (t(), a("span", oe, d(l.last_fault || "Failing"), 1)) : r("", !0),
          i("span", re, [
            m(s(g), {
              small: "",
              "data-plugin-settings": "",
              onClick: (u) => L(l)
            }, {
              default: o(() => [...e[10] || (e[10] = [
                p("Settings", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            m(s(g), {
              small: "",
              "data-plugin-record": "",
              onClick: (u) => j(l)
            }, {
              default: o(() => [...e[11] || (e[11] = [
                p("What it did", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            W.value === l.name ? (t(), a(S, { key: 0 }, [
              m(s(g), {
                small: "",
                onClick: e[4] || (e[4] = (u) => W.value = "")
              }, {
                default: o(() => [...e[12] || (e[12] = [
                  p("Keep it", -1)
                ])]),
                _: 1
              }),
              m(s(g), {
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
              m(s(g), {
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
            ], 64)) : (t(), B(s(g), {
              key: 1,
              small: "",
              "data-plugin-remove": "",
              onClick: (u) => W.value = l.name
            }, {
              default: o(() => [...e[15] || (e[15] = [
                p("Remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]))
          ]),
          k.value[l.name] ? (t(), a("div", de, [
            k.value[l.name].length ? r("", !0) : (t(), a("p", pe, "This plugin has no settings")),
            (t(!0), a(S, null, I(k.value[l.name], (u) => (t(), a("label", {
              key: u.key,
              class: "plugin-setting"
            }, [
              i("span", ge, d(u.title || u.key), 1),
              i("input", {
                value: u.value,
                "data-plugin-setting": u.key,
                onChange: (z) => M(l, u, z.target.value)
              }, null, 40, ve)
            ]))), 128))
          ])) : r("", !0)
        ], 8, te))), 128))
      ]),
      V.value ? (t(), a("p", me, d(V.value), 1)) : r("", !0),
      v.value ? (t(), B(s(H), {
        key: 4,
        title: `What ${v.value.name} did`,
        onClose: e[5] || (e[5] = (l) => v.value = null)
      }, {
        default: o(() => [
          i("div", ce, [
            v.value.last_fault ? (t(), a("p", ke, "Last fault, " + d(v.value.fault_count) + " in a row: " + d(v.value.last_fault), 1)) : r("", !0),
            v.value.outputs.length ? r("", !0) : (t(), a("p", fe, "It has done nothing yet.")),
            (t(!0), a(S, null, I(v.value.outputs, (l) => (t(), a("p", {
              key: l.id,
              class: "plugin-output",
              "data-plugin-output": ""
            }, d(U(l.output)), 1))), 128))
          ])
        ]),
        _: 1
      }, 8, ["title"])) : r("", !0)
    ], 64));
  }
}, be = /* @__PURE__ */ Q(_e, [["__scopeId", "data-v-a417ae13"]]);
export {
  be as default
};
