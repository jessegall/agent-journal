/* @code-commandments-generated */
if (!document.getElementById("window-styles-bd48997f96ed")) { const style = document.createElement("style"); style.id = "window-styles-bd48997f96ed"; style.textContent = ".plugin-output[data-v-6b17f7fa]{margin:0 0 6px;font-size:13px;white-space:pre-wrap}.plugin-note[data-v-6b17f7fa]{margin:0;color:var(--text-2);font-size:13px}.plugin-tools[data-v-6b17f7fa],.plugin-form[data-v-6b17f7fa]{display:flex;gap:8px;margin-bottom:10px}.plugin-form input[data-v-6b17f7fa]{flex:1;min-width:0}.plugin-moves[data-v-6b17f7fa]{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.plugin-settings[data-v-6b17f7fa]{display:flex;flex-direction:column;gap:8px;margin-top:8px}.plugin-setting[data-v-6b17f7fa]{display:flex;flex-direction:column;gap:2px}.plugin-setting-title[data-v-6b17f7fa]{color:var(--text-3);font-size:12px}.plugins[data-v-6b17f7fa]{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}.plugin[data-v-6b17f7fa]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plugin-head[data-v-6b17f7fa]{display:flex;gap:10px;align-items:center}.name[data-v-6b17f7fa]{flex:1;font-weight:500}.release[data-v-6b17f7fa],.plugin-source[data-v-6b17f7fa],.plugin-note[data-v-6b17f7fa]{margin:0;color:var(--text-3);font-size:12px}.plugin-fault[data-v-6b17f7fa]{color:var(--danger);font-size:12px}.toggle[data-v-6b17f7fa]{position:relative;flex:none;width:30px;height:17px;border:0;border-radius:9px;background:var(--raised);cursor:pointer}.toggle[data-v-6b17f7fa]:after{position:absolute;top:2px;left:2px;width:13px;height:13px;border-radius:50%;background:#fff;content:\"\";transition:transform .15s ease}.toggle.on[data-v-6b17f7fa]{background:var(--accent)}.toggle.on[data-v-6b17f7fa]:after{transform:translate(13px)}\n"; document.head.appendChild(style); }
import { ref as f, openBlock as n, createElementBlock as s, Fragment as S, createElementVNode as u, createVNode as v, unref as i, withCtx as p, createTextVNode as g, withModifiers as O, withDirectives as w, vModelText as A, createCommentVNode as o, toDisplayString as r, createBlock as V, renderList as B, normalizeClass as J } from "vue";
import { useWindow as q, useRows as G, useListTools as H, Btn as c, Skeleton as Q, ListTools as X, Dialog as Y } from "@journal/window-kit";
const Z = (x, h) => {
  const b = x.__vccOpts || x;
  for (const [C, N] of h)
    b[C] = N;
  return b;
}, ee = { class: "plugin-tools" }, le = {
  key: 2,
  class: "plugin-fault",
  role: "alert",
  "data-plugin-refusal": ""
}, te = { class: "plugins" }, ne = {
  key: 1,
  class: "plugin-note"
}, ae = {
  key: 2,
  class: "plugin-note"
}, se = ["data-row"], ie = { class: "plugin-head" }, ue = { class: "name" }, oe = { class: "release" }, re = ["aria-checked", "aria-label", "onClick"], de = { class: "plugin-source" }, pe = {
  key: 0,
  class: "plugin-fault"
}, ve = { class: "plugin-moves" }, ge = {
  key: 1,
  class: "plugin-settings",
  "data-plugin-setting-list": ""
}, ce = {
  key: 0,
  class: "plugin-note"
}, me = { class: "plugin-setting-title" }, ke = ["value", "data-plugin-setting", "onChange"], fe = {
  key: 3,
  class: "plugin-fault",
  role: "alert",
  "data-plugin-record-failure": ""
}, _e = { "data-plugin-record-body": "" }, ye = {
  key: 0,
  class: "plugin-fault"
}, he = {
  key: 1,
  class: "plugin-note",
  "data-plugin-services": ""
}, be = {
  key: 2,
  class: "plugin-note"
}, Ce = {
  __name: "PluginRows",
  setup(x) {
    const h = q(), { rows: b, failure: C, loaded: N, load: D } = G("plugin list", ["plugin.*"]), I = H(b, { title: (t) => t.title || t.name, isOpen: (t) => t.enabled }), R = f(""), m = f(null), _ = f(""), y = f(""), W = f(""), k = f({}), F = (t) => $(`plugin ${t.enabled ? "disable" : "enable"} ${t.name}`);
    async function $(t) {
      const e = await h.run(t);
      return R.value = e.ok ? "" : e.error, e.ok && D(), e.ok;
    }
    async function P() {
      _.value.trim() && await $(["plugin", "install", _.value.trim(), "--yes"]) && (_.value = "", m.value = null);
    }
    async function j() {
      y.value.trim() && await $(["message", "send", `Please make a plugin: ${y.value.trim()}`]) && (y.value = "", m.value = null);
    }
    async function L(t, e) {
      await $(["plugin", "remove", t.name, ...e ? ["--purge"] : []]) && (W.value = "");
    }
    async function E(t) {
      if (k.value[t.name]) {
        const { [t.name]: l, ...a } = k.value;
        return void (k.value = a);
      }
      const e = await h.read(["plugin", "settings", t.name]);
      R.value = e.ok ? "" : e.error, e.ok && (k.value = { ...k.value, [t.name]: e.value.settings });
    }
    const K = (t, e, l) => $(["plugin", "configure", t.name, e.key, l]), d = f(null);
    function M(t) {
      try {
        return JSON.parse(t).cards.map((e) => e.detail || e.title).join(`
`);
      } catch {
        return t;
      }
    }
    const T = f("");
    async function U(t) {
      const e = await h.read(`plugin record ${t.name}`);
      T.value = e.ok ? "" : e.error, d.value = e.ok ? e.value : null;
    }
    return (t, e) => (n(), s(S, null, [
      u("div", ee, [
        v(i(c), {
          small: "",
          bordered: "",
          "data-plugin-install": "",
          onClick: e[0] || (e[0] = (l) => m.value = m.value === "install" ? null : "install")
        }, {
          default: p(() => [...e[6] || (e[6] = [
            g("Install a plugin", -1)
          ])]),
          _: 1
        }),
        v(i(c), {
          small: "",
          bordered: "",
          "data-plugin-make": "",
          onClick: e[1] || (e[1] = (l) => m.value = m.value === "make" ? null : "make")
        }, {
          default: p(() => [...e[7] || (e[7] = [
            g("Ask the agent to make one", -1)
          ])]),
          _: 1
        })
      ]),
      m.value === "install" ? (n(), s("form", {
        key: 0,
        class: "plugin-form",
        "data-plugin-install-form": "",
        onSubmit: O(P, ["prevent"])
      }, [
        w(u("input", {
          "onUpdate:modelValue": e[2] || (e[2] = (l) => _.value = l),
          placeholder: "owner/repo, a link or a folder",
          "aria-label": "Where the plugin is"
        }, null, 512), [
          [A, _.value]
        ]),
        v(i(c), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !_.value.trim()
        }, {
          default: p(() => [...e[8] || (e[8] = [
            g("Install", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : o("", !0),
      m.value === "make" ? (n(), s("form", {
        key: 1,
        class: "plugin-form",
        "data-plugin-make-form": "",
        onSubmit: O(j, ["prevent"])
      }, [
        w(u("input", {
          "onUpdate:modelValue": e[3] || (e[3] = (l) => y.value = l),
          placeholder: "What should the plugin do?",
          "aria-label": "What should the plugin do?"
        }, null, 512), [
          [A, y.value]
        ]),
        v(i(c), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !y.value.trim()
        }, {
          default: p(() => [...e[9] || (e[9] = [
            g("Ask", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : o("", !0),
      R.value ? (n(), s("p", le, r(R.value), 1)) : o("", !0),
      u("div", te, [
        i(N) ? !i(C) && !i(b).length ? (n(), s("p", ne, "No plugins installed")) : i(C) ? (n(), s("p", ae, r(i(C)), 1)) : o("", !0) : (n(), V(i(Q), {
          key: 0,
          shape: "cards"
        })),
        v(i(X), {
          tools: i(I),
          placeholder: "Search the plugins"
        }, null, 8, ["tools"]),
        (n(!0), s(S, null, B(i(I).shown.value, (l) => (n(), s("div", {
          key: l.id,
          class: "plugin",
          "data-row": l.id
        }, [
          u("span", ie, [
            u("span", ue, r(l.title), 1),
            u("span", oe, r(l.release), 1),
            u("button", {
              type: "button",
              role: "switch",
              "aria-checked": l.enabled,
              "aria-label": l.enabled ? "Switch off" : "Switch on",
              class: J(["toggle", { on: l.enabled }]),
              onClick: (a) => F(l)
            }, null, 10, re)
          ]),
          u("span", de, r(l.source), 1),
          l.failing ? (n(), s("span", pe, r(l.last_fault || "Failing"), 1)) : o("", !0),
          u("span", ve, [
            v(i(c), {
              small: "",
              "data-plugin-settings": "",
              onClick: (a) => E(l)
            }, {
              default: p(() => [...e[10] || (e[10] = [
                g("Settings", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            v(i(c), {
              small: "",
              "data-plugin-record": "",
              onClick: (a) => U(l)
            }, {
              default: p(() => [...e[11] || (e[11] = [
                g("What it did", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            W.value === l.name ? (n(), s(S, { key: 0 }, [
              v(i(c), {
                small: "",
                onClick: e[4] || (e[4] = (a) => W.value = "")
              }, {
                default: p(() => [...e[12] || (e[12] = [
                  g("Keep it", -1)
                ])]),
                _: 1
              }),
              v(i(c), {
                small: "",
                kind: "danger",
                "data-plugin-remove-keep": "",
                onClick: (a) => L(l, !1)
              }, {
                default: p(() => [...e[13] || (e[13] = [
                  g("Remove, keep its data", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              v(i(c), {
                small: "",
                kind: "danger",
                "data-plugin-remove-purge": "",
                onClick: (a) => L(l, !0)
              }, {
                default: p(() => [...e[14] || (e[14] = [
                  g("Remove with its data", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])
            ], 64)) : (n(), V(i(c), {
              key: 1,
              small: "",
              "data-plugin-remove": "",
              onClick: (a) => W.value = l.name
            }, {
              default: p(() => [...e[15] || (e[15] = [
                g("Remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]))
          ]),
          k.value[l.name] ? (n(), s("div", ge, [
            k.value[l.name].length ? o("", !0) : (n(), s("p", ce, "This plugin has no settings")),
            (n(!0), s(S, null, B(k.value[l.name], (a) => (n(), s("label", {
              key: a.key,
              class: "plugin-setting"
            }, [
              u("span", me, r(a.title || a.key), 1),
              u("input", {
                value: a.value,
                "data-plugin-setting": a.key,
                onChange: (z) => K(l, a, z.target.value)
              }, null, 40, ke)
            ]))), 128))
          ])) : o("", !0)
        ], 8, se))), 128))
      ]),
      T.value ? (n(), s("p", fe, r(T.value), 1)) : o("", !0),
      d.value ? (n(), V(i(Y), {
        key: 4,
        title: `What ${d.value.name} did`,
        onClose: e[5] || (e[5] = (l) => d.value = null)
      }, {
        default: p(() => {
          var l;
          return [
            u("div", _e, [
              d.value.last_fault ? (n(), s("p", ye, "Last fault, " + r(d.value.fault_count) + " in a row: " + r(d.value.last_fault), 1)) : o("", !0),
              (l = d.value.services) != null && l.length ? (n(), s("p", he, "Keeps running: " + r(d.value.services.map((a) => a.name).join(", ")), 1)) : o("", !0),
              d.value.outputs.length ? o("", !0) : (n(), s("p", be, "It has done nothing yet.")),
              (n(!0), s(S, null, B(d.value.outputs, (a) => (n(), s("p", {
                key: a.id,
                class: "plugin-output",
                "data-plugin-output": ""
              }, r(M(a.output)), 1))), 128))
            ])
          ];
        }),
        _: 1
      }, 8, ["title"])) : o("", !0)
    ], 64));
  }
}, Re = /* @__PURE__ */ Z(Ce, [["__scopeId", "data-v-6b17f7fa"]]);
export {
  Re as default
};
