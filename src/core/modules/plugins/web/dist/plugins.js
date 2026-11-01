/* @code-commandments-generated */
if (!document.getElementById("window-styles-3e27084dcef9")) { const style = document.createElement("style"); style.id = "window-styles-3e27084dcef9"; style.textContent = ".plugin-services[data-v-83193c52]{display:flex;flex-direction:column;gap:4px;margin-top:16px}.plugin-services-heading[data-v-83193c52]{margin:0 0 4px;color:var(--text-3);font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase}.plugin-service[data-v-83193c52]{display:flex;gap:12px;justify-content:space-between;padding:4px 0}.plugin-service-state[data-v-83193c52]{color:var(--text-3);font-size:12px}.plugin-service-state.running[data-v-83193c52]{color:var(--accent-text)}.plugin-output[data-v-c46ad820]{margin:0 0 6px;font-size:13px;white-space:pre-wrap}.plugin-note[data-v-c46ad820]{margin:0;color:var(--text-2);font-size:13px}.plugin-tools[data-v-c46ad820],.plugin-form[data-v-c46ad820]{display:flex;gap:8px;margin-bottom:10px}.plugin-form input[data-v-c46ad820]{flex:1;min-width:0}.plugin-moves[data-v-c46ad820]{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.plugin-settings[data-v-c46ad820]{display:flex;flex-direction:column;gap:8px;margin-top:8px}.plugin-setting[data-v-c46ad820]{display:flex;flex-direction:column;gap:2px}.plugin-setting-title[data-v-c46ad820]{color:var(--text-3);font-size:12px}.plugins[data-v-c46ad820]{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}.plugin[data-v-c46ad820]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plugin-head[data-v-c46ad820]{display:flex;gap:10px;align-items:center}.name[data-v-c46ad820]{flex:1;font-weight:500}.release[data-v-c46ad820],.plugin-source[data-v-c46ad820],.plugin-note[data-v-c46ad820]{margin:0;color:var(--text-3);font-size:12px}.plugin-fault[data-v-c46ad820]{color:var(--danger);font-size:12px}.toggle[data-v-c46ad820]{position:relative;flex:none;width:30px;height:17px;border:0;border-radius:9px;background:var(--raised);cursor:pointer}.toggle[data-v-c46ad820]:after{position:absolute;top:2px;left:2px;width:13px;height:13px;border-radius:50%;background:#fff;content:\"\";transition:transform .15s ease}.toggle.on[data-v-c46ad820]{background:var(--accent)}.toggle.on[data-v-c46ad820]:after{transform:translate(13px)}\n"; document.head.appendChild(style); }
import { onMounted as Q, onUnmounted as X, unref as s, openBlock as t, createElementBlock as a, createElementVNode as u, Fragment as S, renderList as P, toDisplayString as o, normalizeClass as D, createCommentVNode as r, ref as h, createVNode as p, withCtx as c, createTextVNode as v, withModifiers as B, withDirectives as M, vModelText as A, createBlock as V } from "vue";
import { useRows as F, useWindow as Y, useListTools as Z, Btn as m, Skeleton as w, ListTools as ee, Dialog as le } from "@journal/window-kit";
const U = (x, k) => {
  const b = x.__vccOpts || x;
  for (const [f, I] of k)
    b[f] = I;
  return b;
}, te = {
  key: 0,
  class: "plugin-services",
  "data-plugin-services": ""
}, ne = ["data-plugin-service"], ae = { class: "plugin-service-name" }, se = 5e3, ie = {
  __name: "PluginServices",
  setup(x) {
    const { rows: k, load: b } = F("plugin services", ["plugin.*"]);
    let f = 0;
    return Q(() => {
      f = setInterval(b, se);
    }), X(() => clearInterval(f)), (I, W) => s(k).length ? (t(), a("section", te, [
      W[0] || (W[0] = u("h3", { class: "plugin-services-heading" }, "Services", -1)),
      (t(!0), a(S, null, P(s(k), (g) => (t(), a("div", {
        key: g.id,
        class: "plugin-service",
        "data-plugin-service": g.id
      }, [
        u("span", ae, o(g.plugin) + " · " + o(g.service), 1),
        u("span", {
          class: D(["plugin-service-state", { running: g.running }])
        }, o(g.running ? `Running, process ${g.pid}` : "Stopped"), 3)
      ], 8, ne))), 128))
    ])) : r("", !0);
  }
}, ue = /* @__PURE__ */ U(ie, [["__scopeId", "data-v-83193c52"]]), oe = { class: "plugin-tools" }, re = {
  key: 2,
  class: "plugin-fault",
  role: "alert",
  "data-plugin-refusal": ""
}, de = { class: "plugins" }, pe = {
  key: 1,
  class: "plugin-note"
}, ce = {
  key: 2,
  class: "plugin-note"
}, ge = ["data-row"], ve = { class: "plugin-head" }, me = { class: "name" }, ke = { class: "release" }, fe = ["aria-checked", "aria-label", "onClick"], _e = { class: "plugin-source" }, ye = {
  key: 0,
  class: "plugin-fault"
}, he = { class: "plugin-moves" }, be = {
  key: 1,
  class: "plugin-settings",
  "data-plugin-setting-list": ""
}, Ce = {
  key: 0,
  class: "plugin-note"
}, $e = { class: "plugin-setting-title" }, Se = ["value", "data-plugin-setting", "onChange"], Re = {
  key: 3,
  class: "plugin-fault",
  role: "alert",
  "data-plugin-record-failure": ""
}, xe = { "data-plugin-record-body": "" }, Ie = {
  key: 0,
  class: "plugin-fault"
}, We = {
  key: 1,
  class: "plugin-note",
  "data-plugin-services": ""
}, Le = {
  key: 2,
  class: "plugin-note"
}, Ne = {
  __name: "PluginRows",
  setup(x) {
    const k = Y(), { rows: b, failure: f, loaded: I, load: W } = F("plugin list", ["plugin.*"]), g = Z(b, { title: (n) => n.title || n.name, isOpen: (n) => n.enabled }), L = h(""), _ = h(null), C = h(""), $ = h(""), N = h(""), y = h({}), j = (n) => R(`plugin ${n.enabled ? "disable" : "enable"} ${n.name}`);
    async function R(n) {
      const e = await k.run(n);
      return L.value = e.ok ? "" : e.error, e.ok && W(), e.ok;
    }
    async function E() {
      C.value.trim() && await R(["plugin", "install", C.value.trim(), "--yes"]) && (C.value = "", _.value = null);
    }
    async function K() {
      $.value.trim() && await R(["message", "send", `Please make a plugin: ${$.value.trim()}`]) && ($.value = "", _.value = null);
    }
    async function O(n, e) {
      await R(["plugin", "remove", n.name, ...e ? ["--purge"] : []]) && (N.value = "");
    }
    async function z(n) {
      if (y.value[n.name]) {
        const { [n.name]: l, ...i } = y.value;
        return void (y.value = i);
      }
      const e = await k.read(["plugin", "settings", n.name]);
      L.value = e.ok ? "" : e.error, e.ok && (y.value = { ...y.value, [n.name]: e.value.settings });
    }
    const J = (n, e, l) => R(["plugin", "configure", n.name, e.key, l]), d = h(null);
    function q(n) {
      try {
        return JSON.parse(n).cards.map((e) => e.detail || e.title).join(`
`);
      } catch {
        return n;
      }
    }
    const T = h("");
    async function G(n) {
      const e = await k.read(`plugin record ${n.name}`);
      T.value = e.ok ? "" : e.error, d.value = e.ok ? e.value : null;
    }
    return (n, e) => (t(), a(S, null, [
      u("div", oe, [
        p(s(m), {
          small: "",
          bordered: "",
          "data-plugin-install": "",
          onClick: e[0] || (e[0] = (l) => _.value = _.value === "install" ? null : "install")
        }, {
          default: c(() => [...e[6] || (e[6] = [
            v("Install a plugin", -1)
          ])]),
          _: 1
        }),
        p(s(m), {
          small: "",
          bordered: "",
          "data-plugin-make": "",
          onClick: e[1] || (e[1] = (l) => _.value = _.value === "make" ? null : "make")
        }, {
          default: c(() => [...e[7] || (e[7] = [
            v("Ask the agent to make one", -1)
          ])]),
          _: 1
        })
      ]),
      _.value === "install" ? (t(), a("form", {
        key: 0,
        class: "plugin-form",
        "data-plugin-install-form": "",
        onSubmit: B(E, ["prevent"])
      }, [
        M(u("input", {
          "onUpdate:modelValue": e[2] || (e[2] = (l) => C.value = l),
          placeholder: "owner/repo, a link or a folder",
          "aria-label": "Where the plugin is"
        }, null, 512), [
          [A, C.value]
        ]),
        p(s(m), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !C.value.trim()
        }, {
          default: c(() => [...e[8] || (e[8] = [
            v("Install", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : r("", !0),
      _.value === "make" ? (t(), a("form", {
        key: 1,
        class: "plugin-form",
        "data-plugin-make-form": "",
        onSubmit: B(K, ["prevent"])
      }, [
        M(u("input", {
          "onUpdate:modelValue": e[3] || (e[3] = (l) => $.value = l),
          placeholder: "What should the plugin do?",
          "aria-label": "What should the plugin do?"
        }, null, 512), [
          [A, $.value]
        ]),
        p(s(m), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !$.value.trim()
        }, {
          default: c(() => [...e[9] || (e[9] = [
            v("Ask", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : r("", !0),
      L.value ? (t(), a("p", re, o(L.value), 1)) : r("", !0),
      u("div", de, [
        s(I) ? !s(f) && !s(b).length ? (t(), a("p", pe, "No plugins installed")) : s(f) ? (t(), a("p", ce, o(s(f)), 1)) : r("", !0) : (t(), V(s(w), {
          key: 0,
          shape: "cards"
        })),
        p(s(ee), {
          tools: s(g),
          placeholder: "Search the plugins"
        }, null, 8, ["tools"]),
        (t(!0), a(S, null, P(s(g).shown.value, (l) => (t(), a("div", {
          key: l.id,
          class: "plugin",
          "data-row": l.id
        }, [
          u("span", ve, [
            u("span", me, o(l.title), 1),
            u("span", ke, o(l.release), 1),
            u("button", {
              type: "button",
              role: "switch",
              "aria-checked": l.enabled,
              "aria-label": l.enabled ? "Switch off" : "Switch on",
              class: D(["toggle", { on: l.enabled }]),
              onClick: (i) => j(l)
            }, null, 10, fe)
          ]),
          u("span", _e, o(l.source), 1),
          l.failing ? (t(), a("span", ye, o(l.last_fault || "Failing"), 1)) : r("", !0),
          u("span", he, [
            p(s(m), {
              small: "",
              "data-plugin-settings": "",
              onClick: (i) => z(l)
            }, {
              default: c(() => [...e[10] || (e[10] = [
                v("Settings", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            p(s(m), {
              small: "",
              "data-plugin-record": "",
              onClick: (i) => G(l)
            }, {
              default: c(() => [...e[11] || (e[11] = [
                v("What it did", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            N.value === l.name ? (t(), a(S, { key: 0 }, [
              p(s(m), {
                small: "",
                onClick: e[4] || (e[4] = (i) => N.value = "")
              }, {
                default: c(() => [...e[12] || (e[12] = [
                  v("Keep it", -1)
                ])]),
                _: 1
              }),
              p(s(m), {
                small: "",
                kind: "danger",
                "data-plugin-remove-keep": "",
                onClick: (i) => O(l, !1)
              }, {
                default: c(() => [...e[13] || (e[13] = [
                  v("Remove, keep its data", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              p(s(m), {
                small: "",
                kind: "danger",
                "data-plugin-remove-purge": "",
                onClick: (i) => O(l, !0)
              }, {
                default: c(() => [...e[14] || (e[14] = [
                  v("Remove with its data", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])
            ], 64)) : (t(), V(s(m), {
              key: 1,
              small: "",
              "data-plugin-remove": "",
              onClick: (i) => N.value = l.name
            }, {
              default: c(() => [...e[15] || (e[15] = [
                v("Remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]))
          ]),
          y.value[l.name] ? (t(), a("div", be, [
            y.value[l.name].length ? r("", !0) : (t(), a("p", Ce, "This plugin has no settings")),
            (t(!0), a(S, null, P(y.value[l.name], (i) => (t(), a("label", {
              key: i.key,
              class: "plugin-setting"
            }, [
              u("span", $e, o(i.title || i.key), 1),
              u("input", {
                value: i.value,
                "data-plugin-setting": i.key,
                onChange: (H) => J(l, i, H.target.value)
              }, null, 40, Se)
            ]))), 128))
          ])) : r("", !0)
        ], 8, ge))), 128))
      ]),
      T.value ? (t(), a("p", Re, o(T.value), 1)) : r("", !0),
      d.value ? (t(), V(s(le), {
        key: 4,
        title: `What ${d.value.name} did`,
        onClose: e[5] || (e[5] = (l) => d.value = null)
      }, {
        default: c(() => {
          var l;
          return [
            u("div", xe, [
              d.value.last_fault ? (t(), a("p", Ie, "Last fault, " + o(d.value.fault_count) + " in a row: " + o(d.value.last_fault), 1)) : r("", !0),
              (l = d.value.services) != null && l.length ? (t(), a("p", We, "Keeps running: " + o(d.value.services.map((i) => i.name).join(", ")), 1)) : r("", !0),
              d.value.outputs.length ? r("", !0) : (t(), a("p", Le, "It has done nothing yet.")),
              (t(!0), a(S, null, P(d.value.outputs, (i) => (t(), a("p", {
                key: i.id,
                class: "plugin-output",
                "data-plugin-output": ""
              }, o(q(i.output)), 1))), 128))
            ])
          ];
        }),
        _: 1
      }, 8, ["title"])) : r("", !0),
      p(ue)
    ], 64));
  }
}, Ve = /* @__PURE__ */ U(Ne, [["__scopeId", "data-v-c46ad820"]]);
export {
  Ve as default
};
