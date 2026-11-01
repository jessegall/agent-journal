/* @code-commandments-generated */
if (!document.getElementById("window-styles-038245c870ff")) { const style = document.createElement("style"); style.id = "window-styles-038245c870ff"; style.textContent = ".plugin-output[data-v-ec0340da]{margin:0 0 6px;font-size:13px;white-space:pre-wrap}.plugin-note[data-v-ec0340da]{margin:0;color:var(--text-2);font-size:13px}.plugin-tools[data-v-ec0340da],.plugin-form[data-v-ec0340da]{display:flex;gap:8px;margin-bottom:10px}.plugin-form input[data-v-ec0340da]{flex:1;min-width:0}.plugin-moves[data-v-ec0340da]{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.plugin-settings[data-v-ec0340da]{display:flex;flex-direction:column;gap:8px;margin-top:8px}.plugin-setting[data-v-ec0340da]{display:flex;flex-direction:column;gap:2px}.plugin-setting-title[data-v-ec0340da]{color:var(--text-3);font-size:12px}.plugins[data-v-ec0340da]{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}.plugin[data-v-ec0340da]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plugin-head[data-v-ec0340da]{display:flex;gap:10px;align-items:center}.name[data-v-ec0340da]{flex:1;font-weight:500}.release[data-v-ec0340da],.plugin-source[data-v-ec0340da],.plugin-note[data-v-ec0340da]{margin:0;color:var(--text-3);font-size:12px}.plugin-fault[data-v-ec0340da]{color:var(--danger);font-size:12px}.toggle[data-v-ec0340da]{position:relative;flex:none;width:30px;height:17px;border:0;border-radius:9px;background:var(--raised);cursor:pointer}.toggle[data-v-ec0340da]:after{position:absolute;top:2px;left:2px;width:13px;height:13px;border-radius:50%;background:#fff;content:\"\";transition:transform .15s ease}.toggle.on[data-v-ec0340da]{background:var(--accent)}.toggle.on[data-v-ec0340da]:after{transform:translate(13px)}\n"; document.head.appendChild(style); }
import { ref as f, openBlock as t, createElementBlock as a, Fragment as S, createElementVNode as i, createVNode as c, unref as u, withCtx as p, createTextVNode as v, withModifiers as w, withDirectives as A, vModelText as D, createCommentVNode as o, toDisplayString as r, createBlock as B, renderList as I, normalizeClass as z } from "vue";
import { useWindow as J, useRows as q, Btn as g, Skeleton as G, Dialog as H } from "@journal/window-kit";
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
}, ve = { class: "plugin-setting-title" }, ge = ["value", "data-plugin-setting", "onChange"], ce = {
  key: 3,
  class: "plugin-fault",
  role: "alert",
  "data-plugin-record-failure": ""
}, me = { "data-plugin-record-body": "" }, ke = {
  key: 0,
  class: "plugin-fault"
}, fe = {
  key: 1,
  class: "plugin-note",
  "data-plugin-services": ""
}, _e = {
  key: 2,
  class: "plugin-note"
}, ye = {
  __name: "PluginRows",
  setup(x) {
    const h = J(), { rows: b, failure: C, loaded: N, load: F } = q("plugin list", ["plugin.*"]), R = f(""), m = f(null), _ = f(""), y = f(""), W = f(""), k = f({}), O = (s) => $(`plugin ${s.enabled ? "disable" : "enable"} ${s.name}`);
    async function $(s) {
      const e = await h.run(s);
      return R.value = e.ok ? "" : e.error, e.ok && F(), e.ok;
    }
    async function P() {
      _.value.trim() && await $(["plugin", "install", _.value.trim(), "--yes"]) && (_.value = "", m.value = null);
    }
    async function j() {
      y.value.trim() && await $(["message", "send", `Please make a plugin: ${y.value.trim()}`]) && (y.value = "", m.value = null);
    }
    async function T(s, e) {
      await $(["plugin", "remove", s.name, ...e ? ["--purge"] : []]) && (W.value = "");
    }
    async function E(s) {
      if (k.value[s.name]) {
        const { [s.name]: l, ...n } = k.value;
        return void (k.value = n);
      }
      const e = await h.read(["plugin", "settings", s.name]);
      R.value = e.ok ? "" : e.error, e.ok && (k.value = { ...k.value, [s.name]: e.value.settings });
    }
    const K = (s, e, l) => $(["plugin", "configure", s.name, e.key, l]), d = f(null);
    function L(s) {
      try {
        return JSON.parse(s).cards.map((e) => e.detail || e.title).join(`
`);
      } catch {
        return s;
      }
    }
    const V = f("");
    async function M(s) {
      const e = await h.read(`plugin record ${s.name}`);
      V.value = e.ok ? "" : e.error, d.value = e.ok ? e.value : null;
    }
    return (s, e) => (t(), a(S, null, [
      i("div", X, [
        c(u(g), {
          small: "",
          bordered: "",
          "data-plugin-install": "",
          onClick: e[0] || (e[0] = (l) => m.value = m.value === "install" ? null : "install")
        }, {
          default: p(() => [...e[6] || (e[6] = [
            v("Install a plugin", -1)
          ])]),
          _: 1
        }),
        c(u(g), {
          small: "",
          bordered: "",
          "data-plugin-make": "",
          onClick: e[1] || (e[1] = (l) => m.value = m.value === "make" ? null : "make")
        }, {
          default: p(() => [...e[7] || (e[7] = [
            v("Ask the agent to make one", -1)
          ])]),
          _: 1
        })
      ]),
      m.value === "install" ? (t(), a("form", {
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
        c(u(g), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !_.value.trim()
        }, {
          default: p(() => [...e[8] || (e[8] = [
            v("Install", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : o("", !0),
      m.value === "make" ? (t(), a("form", {
        key: 1,
        class: "plugin-form",
        "data-plugin-make-form": "",
        onSubmit: w(j, ["prevent"])
      }, [
        A(i("input", {
          "onUpdate:modelValue": e[3] || (e[3] = (l) => y.value = l),
          placeholder: "What should the plugin do?",
          "aria-label": "What should the plugin do?"
        }, null, 512), [
          [D, y.value]
        ]),
        c(u(g), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !y.value.trim()
        }, {
          default: p(() => [...e[9] || (e[9] = [
            v("Ask", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : o("", !0),
      R.value ? (t(), a("p", Y, r(R.value), 1)) : o("", !0),
      i("div", Z, [
        u(N) ? !u(C) && !u(b).length ? (t(), a("p", ee, "No plugins installed")) : u(C) ? (t(), a("p", le, r(u(C)), 1)) : o("", !0) : (t(), B(u(G), {
          key: 0,
          shape: "cards"
        })),
        (t(!0), a(S, null, I(u(b), (l) => (t(), a("div", {
          key: l.id,
          class: "plugin",
          "data-row": l.id
        }, [
          i("span", ne, [
            i("span", ae, r(l.title), 1),
            i("span", se, r(l.release), 1),
            i("button", {
              type: "button",
              role: "switch",
              "aria-checked": l.enabled,
              "aria-label": l.enabled ? "Switch off" : "Switch on",
              class: z(["toggle", { on: l.enabled }]),
              onClick: (n) => O(l)
            }, null, 10, ue)
          ]),
          i("span", ie, r(l.source), 1),
          l.failing ? (t(), a("span", oe, r(l.last_fault || "Failing"), 1)) : o("", !0),
          i("span", re, [
            c(u(g), {
              small: "",
              "data-plugin-settings": "",
              onClick: (n) => E(l)
            }, {
              default: p(() => [...e[10] || (e[10] = [
                v("Settings", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            c(u(g), {
              small: "",
              "data-plugin-record": "",
              onClick: (n) => M(l)
            }, {
              default: p(() => [...e[11] || (e[11] = [
                v("What it did", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            W.value === l.name ? (t(), a(S, { key: 0 }, [
              c(u(g), {
                small: "",
                onClick: e[4] || (e[4] = (n) => W.value = "")
              }, {
                default: p(() => [...e[12] || (e[12] = [
                  v("Keep it", -1)
                ])]),
                _: 1
              }),
              c(u(g), {
                small: "",
                kind: "danger",
                "data-plugin-remove-keep": "",
                onClick: (n) => T(l, !1)
              }, {
                default: p(() => [...e[13] || (e[13] = [
                  v("Remove, keep its data", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              c(u(g), {
                small: "",
                kind: "danger",
                "data-plugin-remove-purge": "",
                onClick: (n) => T(l, !0)
              }, {
                default: p(() => [...e[14] || (e[14] = [
                  v("Remove with its data", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])
            ], 64)) : (t(), B(u(g), {
              key: 1,
              small: "",
              "data-plugin-remove": "",
              onClick: (n) => W.value = l.name
            }, {
              default: p(() => [...e[15] || (e[15] = [
                v("Remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]))
          ]),
          k.value[l.name] ? (t(), a("div", de, [
            k.value[l.name].length ? o("", !0) : (t(), a("p", pe, "This plugin has no settings")),
            (t(!0), a(S, null, I(k.value[l.name], (n) => (t(), a("label", {
              key: n.key,
              class: "plugin-setting"
            }, [
              i("span", ve, r(n.title || n.key), 1),
              i("input", {
                value: n.value,
                "data-plugin-setting": n.key,
                onChange: (U) => K(l, n, U.target.value)
              }, null, 40, ge)
            ]))), 128))
          ])) : o("", !0)
        ], 8, te))), 128))
      ]),
      V.value ? (t(), a("p", ce, r(V.value), 1)) : o("", !0),
      d.value ? (t(), B(u(H), {
        key: 4,
        title: `What ${d.value.name} did`,
        onClose: e[5] || (e[5] = (l) => d.value = null)
      }, {
        default: p(() => {
          var l;
          return [
            i("div", me, [
              d.value.last_fault ? (t(), a("p", ke, "Last fault, " + r(d.value.fault_count) + " in a row: " + r(d.value.last_fault), 1)) : o("", !0),
              (l = d.value.services) != null && l.length ? (t(), a("p", fe, "Keeps running: " + r(d.value.services.map((n) => n.name).join(", ")), 1)) : o("", !0),
              d.value.outputs.length ? o("", !0) : (t(), a("p", _e, "It has done nothing yet.")),
              (t(!0), a(S, null, I(d.value.outputs, (n) => (t(), a("p", {
                key: n.id,
                class: "plugin-output",
                "data-plugin-output": ""
              }, r(L(n.output)), 1))), 128))
            ])
          ];
        }),
        _: 1
      }, 8, ["title"])) : o("", !0)
    ], 64));
  }
}, Ce = /* @__PURE__ */ Q(ye, [["__scopeId", "data-v-ec0340da"]]);
export {
  Ce as default
};
