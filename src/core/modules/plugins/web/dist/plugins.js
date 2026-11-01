/* @code-commandments-generated */
if (!document.getElementById("window-styles-d6f50ba9f996")) { const style = document.createElement("style"); style.id = "window-styles-d6f50ba9f996"; style.textContent = ".plugin-guide h3[data-v-e6c61b68]{margin:0 0 8px;color:var(--text-3);font-size:11px;font-weight:500;letter-spacing:.04em;text-transform:uppercase}.plugin-guide p[data-v-e6c61b68],.plugin-guide dd[data-v-e6c61b68]{margin:0 0 12px;color:var(--text-2);font-size:12.5px}.plugin-guide dt[data-v-e6c61b68]{font-size:12.5px;font-weight:500}.plugin-guide pre[data-v-e6c61b68]{margin:0 0 16px;padding:10px;border-radius:6px;background:var(--hover);font-size:12px;white-space:pre-wrap;overflow-wrap:anywhere}.preview-from[data-v-3f78b862],.preview-lead[data-v-3f78b862]{margin:0 0 10px;color:var(--text-2);font-size:12.5px}.preview-row[data-v-3f78b862]{display:flex;flex-wrap:wrap;gap:4px 10px;align-items:baseline;padding:5px 0;border-top:1px solid var(--border)}.preview-kind[data-v-3f78b862]{flex:0 0 90px;color:var(--text-3);font-size:12px}.preview-command[data-v-3f78b862]{flex-basis:100%;font-size:12px;overflow-wrap:anywhere}.plugin-services[data-v-83193c52]{display:flex;flex-direction:column;gap:4px;margin-top:16px}.plugin-services-heading[data-v-83193c52]{margin:0 0 4px;color:var(--text-3);font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase}.plugin-service[data-v-83193c52]{display:flex;gap:12px;justify-content:space-between;padding:4px 0}.plugin-service-state[data-v-83193c52]{color:var(--text-3);font-size:12px}.plugin-service-state.running[data-v-83193c52]{color:var(--accent-text)}.plugin-output[data-v-7273a5ae]{margin:0 0 6px;font-size:13px;white-space:pre-wrap}.plugin-note[data-v-7273a5ae]{margin:0;color:var(--text-2);font-size:13px}.plugin-tools[data-v-7273a5ae],.plugin-form[data-v-7273a5ae]{display:flex;gap:8px;margin-bottom:10px}.plugin-form input[data-v-7273a5ae]{flex:1;min-width:0}.plugin-moves[data-v-7273a5ae]{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.plugin-settings[data-v-7273a5ae]{display:flex;flex-direction:column;gap:8px;margin-top:8px}.plugin-setting[data-v-7273a5ae]{display:flex;flex-direction:column;gap:2px}.plugin-setting-title[data-v-7273a5ae]{color:var(--text-3);font-size:12px}.plugins[data-v-7273a5ae]{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}.plugin[data-v-7273a5ae]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plugin-head[data-v-7273a5ae]{display:flex;gap:10px;align-items:center}.name[data-v-7273a5ae]{flex:1;font-weight:500}.release[data-v-7273a5ae],.plugin-source[data-v-7273a5ae],.plugin-note[data-v-7273a5ae]{margin:0;color:var(--text-3);font-size:12px}.plugin-fault[data-v-7273a5ae]{color:var(--danger);font-size:12px}.toggle[data-v-7273a5ae]{position:relative;flex:none;width:30px;height:17px;border:0;border-radius:9px;background:var(--raised);cursor:pointer}.toggle[data-v-7273a5ae]:after{position:absolute;top:2px;left:2px;width:13px;height:13px;border-radius:50%;background:#fff;content:\"\";transition:transform .15s ease}.toggle.on[data-v-7273a5ae]{background:var(--accent)}.toggle.on[data-v-7273a5ae]:after{transform:translate(13px)}\n"; document.head.appendChild(style); }
import { openBlock as a, createBlock as b, unref as i, withCtx as v, createElementVNode as n, createTextVNode as r, toDisplayString as o, createElementBlock as u, Fragment as $, renderList as O, createCommentVNode as g, createVNode as m, onMounted as ae, onUnmounted as ie, normalizeClass as F, ref as y, withModifiers as K, withDirectives as B, vModelText as G } from "vue";
import { Dialog as J, Btn as k, useRows as M, useWindow as ue, useListTools as oe, Skeleton as re, ListTools as de, Dashboard as pe } from "@journal/window-kit";
const U = (w, c) => {
  const f = w.__vccOpts || w;
  for (const [h, I] of c)
    f[h] = I;
  return f;
}, ve = {
  class: "plugin-guide",
  "data-plugin-guide": ""
}, ge = `{
    "name": "standup",
    "title": "Standup",
    "version": "1.0.0",
    "program": "run.sh",
    "hears": ["task.close"],
    "settings": "settings.json",
    "requires": {"node": {"check": "node --version", "hint": "install Node 20"}},
    "setup": [{"name": "packages", "run": "npm install"}],
    "services": [{"name": "web", "command": ["server.sh"], "restart": "on-failure"}],
    "dashboard": {"name": "standup", "title": "Standup"}
}`, me = '{"answer": "refuse", "reason": "why", "line": "a line for the agent", "commands": ["task log 7 done"], "cards": [], "require_skills": []}', ce = {
  __name: "PluginGuide",
  emits: ["close"],
  setup(w, { emit: c }) {
    const f = c, h = [
      ["name, title, version", "Required. The name is how every command refers to the plugin."],
      ["program", "The file run for each event, in the plugin's folder. It gets the event as one line of JSON on its input."],
      ["hears", "The events it runs for."],
      ["holds", "The events it answers before they go on, each with an optional window_ms."],
      ["settings", "A JSON file listing its settings, each with a key, title and kind."],
      ["requires", "Programs that must be installed, each with a check command and a hint."],
      ["setup", "Commands run once, in order, when it installs."],
      ["installed", "A command that answers with JSON settings once it is installed."],
      ["services", "Programs kept running while the plugin is on, each with a name and a command; when, restart and answers are optional."],
      ["health", "How a service answers a health check: socket_env, request and answer."],
      ["cards", "The tone of each kind of card it shows."],
      ["skills", "The folder of the skills it ships."],
      ["reaches", "For an event, which helpers besides the main agent it reaches."],
      ["aliases", "The commands it ships under short names."],
      ["dashboard", "A page it writes, with a name and a title."]
    ];
    return (I, s) => (a(), b(i(J), {
      title: "Make a plugin",
      onClose: s[0] || (s[0] = (d) => f("close"))
    }, {
      default: v(() => [
        n("div", ve, [
          s[1] || (s[1] = n("h3", null, "Manifest", -1)),
          s[2] || (s[2] = n("p", null, [
            r("A plugin is a folder with a "),
            n("code", null, "journal-plugin.json"),
            r(". The journal reads it, shows you everything it would run, and copies the folder when you install it.")
          ], -1)),
          n("pre", null, o(ge)),
          s[3] || (s[3] = n("h3", null, "Keys", -1)),
          n("dl", null, [
            (a(), u($, null, O(h, ([d, R]) => (a(), u($, { key: d }, [
              n("dt", null, o(d), 1),
              n("dd", null, o(R), 1)
            ], 64))), 64))
          ]),
          s[4] || (s[4] = n("h3", null, "Answering an event", -1)),
          s[5] || (s[5] = n("p", null, "The program prints JSON, and printing nothing allows the event. Every key is optional:", -1)),
          n("pre", null, o(me)),
          s[6] || (s[6] = n("h3", null, "Its environment", -1)),
          s[7] || (s[7] = n("p", null, [
            r("A plugin runs as you, with "),
            n("code", null, "journal"),
            r(" on its path. "),
            n("code", null, "$JOURNAL_PLUGIN_DIR"),
            r(" is its folder, "),
            n("code", null, "$JOURNAL_PLUGIN_DATA"),
            r(" a folder for its data, and "),
            n("code", null, "$JOURNAL_SETTINGS"),
            r(" a file with its settings.")
          ], -1)),
          s[8] || (s[8] = n("h3", null, "Its dashboard", -1)),
          s[9] || (s[9] = n("p", null, [
            r("It writes "),
            n("code", null, "dashboards/<name>.json"),
            r(" in its data folder, stating "),
            n("code", null, "start"),
            r(" and "),
            n("code", null, "pages"),
            r(". The journal draws that file; a plugin's own code never runs in the viewer.")
          ], -1))
        ])
      ]),
      _: 1
    }));
  }
}, ke = /* @__PURE__ */ U(ce, [["__scopeId", "data-v-e6c61b68"]]), fe = { "data-plugin-preview": "" }, he = { class: "preview-from" }, ye = {
  key: 0,
  class: "preview-lead"
}, we = ["data-preview-kind"], _e = { class: "preview-kind" }, be = { class: "preview-label" }, $e = { class: "preview-command" }, Ce = {
  __name: "PluginInstallPreview",
  props: { preview: { type: Object, required: !0 } },
  emits: ["close", "install"],
  setup(w, { emit: c }) {
    const f = c, h = { requires: "Checks", setup: "Sets up", installed: "Asks", program: "On events", service: "Keeps running", alias: "Command" };
    return (I, s) => (a(), b(i(J), {
      title: w.preview.title,
      onClose: s[2] || (s[2] = (d) => f("close"))
    }, {
      foot: v(() => [
        m(i(k), {
          onClick: s[0] || (s[0] = (d) => f("close"))
        }, {
          default: v(() => [...s[4] || (s[4] = [
            r("Cancel", -1)
          ])]),
          _: 1
        }),
        m(i(k), {
          kind: "primary",
          "data-plugin-preview-install": "",
          onClick: s[1] || (s[1] = (d) => f("install"))
        }, {
          default: v(() => [...s[5] || (s[5] = [
            r("Install", -1)
          ])]),
          _: 1
        })
      ]),
      default: v(() => [
        n("div", fe, [
          n("p", he, "Version " + o(w.preview.version) + " from " + o(w.preview.source), 1),
          s[3] || (s[3] = n("p", { class: "preview-lead" }, "It runs as you, with your files and your network. This is everything it runs:", -1)),
          w.preview.rows.length ? g("", !0) : (a(), u("p", ye, "It runs nothing.")),
          (a(!0), u($, null, O(w.preview.rows, (d) => (a(), u("div", {
            key: `${d.kind} ${d.label}`,
            class: "preview-row",
            "data-preview-kind": d.kind
          }, [
            n("span", _e, o(h[d.kind]), 1),
            n("span", be, o(d.label), 1),
            n("code", $e, o(d.command), 1)
          ], 8, we))), 128))
        ])
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Se = /* @__PURE__ */ U(Ce, [["__scopeId", "data-v-3f78b862"]]), Ie = {
  key: 0,
  class: "plugin-services",
  "data-plugin-services": ""
}, Te = ["data-plugin-service"], Ne = { class: "plugin-service-name" }, Pe = 5e3, Ae = {
  __name: "PluginServices",
  setup(w) {
    const { rows: c, load: f } = M("plugin services", ["plugin.*"]);
    let h = 0;
    return ae(() => {
      h = setInterval(f, Pe);
    }), ie(() => clearInterval(h)), (I, s) => i(c).length ? (a(), u("section", Ie, [
      s[0] || (s[0] = n("h3", { class: "plugin-services-heading" }, "Services", -1)),
      (a(!0), u($, null, O(i(c), (d) => (a(), u("div", {
        key: d.id,
        class: "plugin-service",
        "data-plugin-service": d.id
      }, [
        n("span", Ne, o(d.plugin) + " · " + o(d.service), 1),
        n("span", {
          class: F(["plugin-service-state", { running: d.running }])
        }, o(d.running ? `Running, process ${d.pid}` : "Stopped"), 3)
      ], 8, Te))), 128))
    ])) : g("", !0);
  }
}, Oe = /* @__PURE__ */ U(Ae, [["__scopeId", "data-v-83193c52"]]), Re = { class: "plugin-tools" }, Le = {
  key: 2,
  class: "plugin-fault",
  role: "alert",
  "data-plugin-refusal": ""
}, je = { class: "plugins" }, xe = {
  key: 1,
  class: "plugin-note"
}, Ee = {
  key: 2,
  class: "plugin-note"
}, Je = ["data-row"], Ue = { class: "plugin-head" }, qe = { class: "name" }, De = { class: "release" }, Me = ["aria-checked", "aria-label", "onClick"], Ve = { class: "plugin-source" }, We = {
  key: 0,
  class: "plugin-fault"
}, Ke = { class: "plugin-moves" }, Be = {
  key: 1,
  class: "plugin-note",
  "data-plugin-latest-line": ""
}, Ge = {
  key: 2,
  class: "plugin-settings",
  "data-plugin-setting-list": ""
}, Fe = {
  key: 0,
  class: "plugin-note"
}, He = { class: "plugin-setting-title" }, ze = ["value", "data-plugin-setting", "onChange"], Xe = {
  key: 3,
  class: "plugin-fault",
  role: "alert",
  "data-plugin-record-failure": ""
}, Ye = { "data-plugin-record-body": "" }, Qe = {
  key: 0,
  class: "plugin-fault"
}, Ze = {
  key: 1,
  class: "plugin-note",
  "data-plugin-services": ""
}, en = {
  key: 2,
  class: "plugin-note"
}, nn = {
  __name: "PluginRows",
  setup(w) {
    const c = ue(), { rows: f, failure: h, loaded: I, load: s } = M("plugin list", ["plugin.*"]), { rows: d } = M("plugin dashboards", ["plugin.*"]), R = (l) => d.value.find((e) => e.plugin === l.name), V = oe(f, { title: (l) => l.title || l.name, isOpen: (l) => l.enabled }), T = y(""), C = y(null), N = y(""), P = y(""), x = y(""), S = y({}), H = (l) => L(`plugin ${l.enabled ? "disable" : "enable"} ${l.name}`);
    async function L(l) {
      const e = await c.run(l);
      return T.value = e.ok ? "" : e.error, e.ok && s(), e.ok;
    }
    const A = y(null), q = y(!1);
    async function z() {
      if (!N.value.trim()) return;
      const l = await c.read(["plugin", "preview", N.value.trim()]);
      T.value = l.ok ? "" : l.error, A.value = l.ok ? l.value : null;
    }
    async function X() {
      const l = await L(["plugin", "install", A.value.source, "--yes"]);
      A.value = null, l && (N.value = "", C.value = null);
    }
    const E = y({});
    async function Y(l) {
      const e = await c.read(["plugin", "latest", l.name]);
      E.value = { ...E.value, [l.name]: e.ok ? e.value.line : e.error };
    }
    const j = y(null);
    async function Q(l) {
      const e = await c.read(["plugin", "dashboard", l.name]);
      T.value = e.ok ? "" : e.error, j.value = e.ok ? { title: R(l).title, document: e.value } : null;
    }
    async function Z() {
      P.value.trim() && await L(["message", "send", `Please make a plugin: ${P.value.trim()}`]) && (P.value = "", C.value = null);
    }
    async function W(l, e) {
      await L(["plugin", "remove", l.name, ...e ? ["--purge"] : []]) && (x.value = "");
    }
    async function ee(l) {
      if (S.value[l.name]) {
        const { [l.name]: t, ...p } = S.value;
        return void (S.value = p);
      }
      const e = await c.read(["plugin", "settings", l.name]);
      T.value = e.ok ? "" : e.error, e.ok && (S.value = { ...S.value, [l.name]: e.value.settings });
    }
    const ne = (l, e, t) => L(["plugin", "configure", l.name, e.key, t]), _ = y(null);
    function te(l) {
      try {
        return JSON.parse(l).cards.map((e) => e.detail || e.title).join(`
`);
      } catch {
        return l;
      }
    }
    const D = y("");
    async function le(l) {
      const e = await c.read(`plugin record ${l.name}`);
      D.value = e.ok ? "" : e.error, _.value = e.ok ? e.value : null;
    }
    return (l, e) => (a(), u($, null, [
      n("div", Re, [
        m(i(k), {
          small: "",
          bordered: "",
          "data-plugin-install": "",
          onClick: e[0] || (e[0] = (t) => C.value = C.value === "install" ? null : "install")
        }, {
          default: v(() => [...e[10] || (e[10] = [
            r("Install a plugin", -1)
          ])]),
          _: 1
        }),
        m(i(k), {
          small: "",
          bordered: "",
          "data-plugin-make": "",
          onClick: e[1] || (e[1] = (t) => C.value = C.value === "make" ? null : "make")
        }, {
          default: v(() => [...e[11] || (e[11] = [
            r("Ask the agent to make one", -1)
          ])]),
          _: 1
        }),
        m(i(k), {
          small: "",
          bordered: "",
          "data-plugin-guide-open": "",
          onClick: e[2] || (e[2] = (t) => q.value = !0)
        }, {
          default: v(() => [...e[12] || (e[12] = [
            r("How to make a plugin", -1)
          ])]),
          _: 1
        })
      ]),
      C.value === "install" ? (a(), u("form", {
        key: 0,
        class: "plugin-form",
        "data-plugin-install-form": "",
        onSubmit: K(z, ["prevent"])
      }, [
        B(n("input", {
          "onUpdate:modelValue": e[3] || (e[3] = (t) => N.value = t),
          placeholder: "The plugin's folder",
          "aria-label": "The plugin's folder"
        }, null, 512), [
          [G, N.value]
        ]),
        m(i(k), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !N.value.trim()
        }, {
          default: v(() => [...e[13] || (e[13] = [
            r("Preview", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : g("", !0),
      C.value === "make" ? (a(), u("form", {
        key: 1,
        class: "plugin-form",
        "data-plugin-make-form": "",
        onSubmit: K(Z, ["prevent"])
      }, [
        B(n("input", {
          "onUpdate:modelValue": e[4] || (e[4] = (t) => P.value = t),
          placeholder: "What should the plugin do?",
          "aria-label": "What should the plugin do?"
        }, null, 512), [
          [G, P.value]
        ]),
        m(i(k), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !P.value.trim()
        }, {
          default: v(() => [...e[14] || (e[14] = [
            r("Ask", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : g("", !0),
      T.value ? (a(), u("p", Le, o(T.value), 1)) : g("", !0),
      n("div", je, [
        i(I) ? !i(h) && !i(f).length ? (a(), u("p", xe, "No plugins installed")) : i(h) ? (a(), u("p", Ee, o(i(h)), 1)) : g("", !0) : (a(), b(i(re), {
          key: 0,
          shape: "cards"
        })),
        m(i(de), {
          tools: i(V),
          placeholder: "Search the plugins"
        }, null, 8, ["tools"]),
        (a(!0), u($, null, O(i(V).shown.value, (t) => (a(), u("div", {
          key: t.id,
          class: "plugin",
          "data-row": t.id
        }, [
          n("span", Ue, [
            n("span", qe, o(t.title), 1),
            n("span", De, o(t.release), 1),
            n("button", {
              type: "button",
              role: "switch",
              "aria-checked": t.enabled,
              "aria-label": t.enabled ? "Switch off" : "Switch on",
              class: F(["toggle", { on: t.enabled }]),
              onClick: (p) => H(t)
            }, null, 10, Me)
          ]),
          n("span", Ve, o(t.source), 1),
          t.failing ? (a(), u("span", We, o(t.last_fault || "Failing"), 1)) : g("", !0),
          n("span", Ke, [
            m(i(k), {
              small: "",
              "data-plugin-settings": "",
              onClick: (p) => ee(t)
            }, {
              default: v(() => [...e[15] || (e[15] = [
                r("Settings", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            m(i(k), {
              small: "",
              "data-plugin-record": "",
              onClick: (p) => le(t)
            }, {
              default: v(() => [...e[16] || (e[16] = [
                r("What it did", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            m(i(k), {
              small: "",
              "data-plugin-latest": "",
              onClick: (p) => Y(t)
            }, {
              default: v(() => [...e[17] || (e[17] = [
                r("Check for updates", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            R(t) ? (a(), b(i(k), {
              key: 0,
              small: "",
              "data-plugin-board": "",
              onClick: (p) => Q(t)
            }, {
              default: v(() => [
                r(o(R(t).title), 1)
              ]),
              _: 2
            }, 1032, ["onClick"])) : g("", !0),
            x.value === t.name ? (a(), u($, { key: 1 }, [
              m(i(k), {
                small: "",
                onClick: e[5] || (e[5] = (p) => x.value = "")
              }, {
                default: v(() => [...e[18] || (e[18] = [
                  r("Keep it", -1)
                ])]),
                _: 1
              }),
              m(i(k), {
                small: "",
                kind: "danger",
                "data-plugin-remove-keep": "",
                onClick: (p) => W(t, !1)
              }, {
                default: v(() => [...e[19] || (e[19] = [
                  r("Remove, keep its data", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              m(i(k), {
                small: "",
                kind: "danger",
                "data-plugin-remove-purge": "",
                onClick: (p) => W(t, !0)
              }, {
                default: v(() => [...e[20] || (e[20] = [
                  r("Remove with its data", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])
            ], 64)) : (a(), b(i(k), {
              key: 2,
              small: "",
              "data-plugin-remove": "",
              onClick: (p) => x.value = t.name
            }, {
              default: v(() => [...e[21] || (e[21] = [
                r("Remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]))
          ]),
          E.value[t.name] ? (a(), u("span", Be, o(E.value[t.name]), 1)) : g("", !0),
          S.value[t.name] ? (a(), u("div", Ge, [
            S.value[t.name].length ? g("", !0) : (a(), u("p", Fe, "This plugin has no settings")),
            (a(!0), u($, null, O(S.value[t.name], (p) => (a(), u("label", {
              key: p.key,
              class: "plugin-setting"
            }, [
              n("span", He, o(p.title || p.key), 1),
              n("input", {
                value: p.value,
                "data-plugin-setting": p.key,
                onChange: (se) => ne(t, p, se.target.value)
              }, null, 40, ze)
            ]))), 128))
          ])) : g("", !0)
        ], 8, Je))), 128))
      ]),
      D.value ? (a(), u("p", Xe, o(D.value), 1)) : g("", !0),
      _.value ? (a(), b(i(J), {
        key: 4,
        title: `What ${_.value.name} did`,
        onClose: e[6] || (e[6] = (t) => _.value = null)
      }, {
        default: v(() => {
          var t;
          return [
            n("div", Ye, [
              _.value.last_fault ? (a(), u("p", Qe, "Last fault, " + o(_.value.fault_count) + " in a row: " + o(_.value.last_fault), 1)) : g("", !0),
              (t = _.value.services) != null && t.length ? (a(), u("p", Ze, "Keeps running: " + o(_.value.services.map((p) => p.name).join(", ")), 1)) : g("", !0),
              _.value.outputs.length ? g("", !0) : (a(), u("p", en, "It has done nothing yet.")),
              (a(!0), u($, null, O(_.value.outputs, (p) => (a(), u("p", {
                key: p.id,
                class: "plugin-output",
                "data-plugin-output": ""
              }, o(te(p.output)), 1))), 128))
            ])
          ];
        }),
        _: 1
      }, 8, ["title"])) : g("", !0),
      m(Oe),
      A.value ? (a(), b(Se, {
        key: 5,
        preview: A.value,
        onClose: e[7] || (e[7] = (t) => A.value = null),
        onInstall: X
      }, null, 8, ["preview"])) : g("", !0),
      q.value ? (a(), b(ke, {
        key: 6,
        onClose: e[8] || (e[8] = (t) => q.value = !1)
      })) : g("", !0),
      j.value ? (a(), b(i(J), {
        key: 7,
        title: j.value.title,
        onClose: e[9] || (e[9] = (t) => j.value = null)
      }, {
        default: v(() => [
          m(i(pe), {
            document: j.value.document
          }, null, 8, ["document"])
        ]),
        _: 1
      }, 8, ["title"])) : g("", !0)
    ], 64));
  }
}, sn = /* @__PURE__ */ U(nn, [["__scopeId", "data-v-7273a5ae"]]);
export {
  sn as default
};
