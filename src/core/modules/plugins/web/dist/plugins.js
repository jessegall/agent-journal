/* @code-commandments-generated */
if (!document.getElementById("window-styles-55cce5b0fa2e")) { const style = document.createElement("style"); style.id = "window-styles-55cce5b0fa2e"; style.textContent = ".plugin-guide h3[data-v-584e0da5]{margin:0 0 8px;color:var(--text-3);font-size:11px;font-weight:500;letter-spacing:.04em;text-transform:uppercase}.plugin-guide p[data-v-584e0da5],.plugin-guide dd[data-v-584e0da5]{margin:0 0 12px;color:var(--text-2);font-size:12.5px}.plugin-guide dt[data-v-584e0da5]{font-size:12.5px;font-weight:500}.plugin-guide pre[data-v-584e0da5]{margin:0 0 16px;padding:10px;border-radius:6px;background:var(--hover);font-size:12px;white-space:pre-wrap;overflow-wrap:anywhere}.preview-from[data-v-3f78b862],.preview-lead[data-v-3f78b862]{margin:0 0 10px;color:var(--text-2);font-size:12.5px}.preview-row[data-v-3f78b862]{display:flex;flex-wrap:wrap;gap:4px 10px;align-items:baseline;padding:5px 0;border-top:1px solid var(--border)}.preview-kind[data-v-3f78b862]{flex:0 0 90px;color:var(--text-3);font-size:12px}.preview-command[data-v-3f78b862]{flex-basis:100%;font-size:12px;overflow-wrap:anywhere}.plugin-services[data-v-83193c52]{display:flex;flex-direction:column;gap:4px;margin-top:16px}.plugin-services-heading[data-v-83193c52]{margin:0 0 4px;color:var(--text-3);font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase}.plugin-service[data-v-83193c52]{display:flex;gap:12px;justify-content:space-between;padding:4px 0}.plugin-service-state[data-v-83193c52]{color:var(--text-3);font-size:12px}.plugin-service-state.running[data-v-83193c52]{color:var(--accent-text)}.plugin-output[data-v-587a41f0]{margin:0 0 6px;font-size:13px;white-space:pre-wrap}.plugin-note[data-v-587a41f0]{margin:0;color:var(--text-2);font-size:13px}.plugin-tools[data-v-587a41f0],.plugin-form[data-v-587a41f0]{display:flex;gap:8px;margin-bottom:10px}.plugin-form input[data-v-587a41f0]{flex:1;min-width:0}.plugin-moves[data-v-587a41f0]{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.plugin-settings[data-v-587a41f0]{display:flex;flex-direction:column;gap:8px;margin-top:8px}.plugin-setting[data-v-587a41f0]{display:flex;flex-direction:column;gap:2px}.plugin-setting-title[data-v-587a41f0]{color:var(--text-3);font-size:12px}.plugins[data-v-587a41f0]{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}.plugin[data-v-587a41f0]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plugin-head[data-v-587a41f0]{display:flex;gap:10px;align-items:center}.name[data-v-587a41f0]{flex:1;font-weight:500}.release[data-v-587a41f0],.plugin-source[data-v-587a41f0],.plugin-note[data-v-587a41f0]{margin:0;color:var(--text-3);font-size:12px}.plugin-fault[data-v-587a41f0]{color:var(--danger);font-size:12px}.toggle[data-v-587a41f0]{position:relative;flex:none;width:30px;height:17px;border:0;border-radius:9px;background:var(--raised);cursor:pointer}.toggle[data-v-587a41f0]:after{position:absolute;top:2px;left:2px;width:13px;height:13px;border-radius:50%;background:#fff;content:\"\";transition:transform .15s ease}.toggle.on[data-v-587a41f0]{background:var(--accent)}.toggle.on[data-v-587a41f0]:after{transform:translate(13px)}\n"; document.head.appendChild(style); }
import { openBlock as s, createBlock as b, unref as i, withCtx as d, createElementVNode as t, createTextVNode as r, toDisplayString as o, createElementBlock as u, Fragment as C, renderList as N, createCommentVNode as g, createVNode as m, onMounted as re, onUnmounted as de, normalizeClass as H, ref as h, withModifiers as K, withDirectives as B, vModelText as G } from "vue";
import { Dialog as E, Btn as c, useRows as M, useWindow as pe, useListTools as ve, Skeleton as ge, ListTools as me, Dashboard as ce } from "@journal/window-kit";
const W = (w, k) => {
  const f = w.__vccOpts || w;
  for (const [y, A] of k)
    f[y] = A;
  return f;
}, ke = {
  class: "plugin-guide",
  "data-plugin-guide": ""
}, fe = `{
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
}`, he = '{"answer": "refuse", "reason": "why", "line": "a line for the agent", "commands": ["task log 7 done"], "cards": [], "require_skills": []}', ye = {
  __name: "PluginGuide",
  emits: ["close"],
  setup(w, { emit: k }) {
    const f = k, y = [
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
    return (A, a) => (s(), b(i(E), {
      title: "Make a plugin",
      onClose: a[0] || (a[0] = (p) => f("close"))
    }, {
      default: d(() => [
        t("div", ke, [
          a[1] || (a[1] = t("h3", null, "Manifest", -1)),
          a[2] || (a[2] = t("p", null, [
            r("A plugin is a folder or a repository with a "),
            t("code", null, "journal-plugin.json"),
            r(". The journal reads it, shows you everything it would run, and copies it when you install it, a repository at its newest version tag.")
          ], -1)),
          t("pre", null, o(fe)),
          a[3] || (a[3] = t("h3", null, "Keys", -1)),
          t("dl", null, [
            (s(), u(C, null, N(y, ([p, j]) => (s(), u(C, { key: p }, [
              t("dt", null, o(p), 1),
              t("dd", null, o(j), 1)
            ], 64))), 64))
          ]),
          a[4] || (a[4] = t("h3", null, "Answering an event", -1)),
          a[5] || (a[5] = t("p", null, "The program prints JSON, and printing nothing allows the event. Every key is optional:", -1)),
          t("pre", null, o(he)),
          a[6] || (a[6] = t("h3", null, "Its environment", -1)),
          a[7] || (a[7] = t("p", null, [
            r("A plugin runs as you, with "),
            t("code", null, "journal"),
            r(" on its path. "),
            t("code", null, "$JOURNAL_PLUGIN_DIR"),
            r(" is its folder, "),
            t("code", null, "$JOURNAL_PLUGIN_DATA"),
            r(" a folder for its data, and "),
            t("code", null, "$JOURNAL_SETTINGS"),
            r(" a file with its settings.")
          ], -1)),
          a[8] || (a[8] = t("h3", null, "Its dashboard", -1)),
          a[9] || (a[9] = t("p", null, [
            r("It writes "),
            t("code", null, "dashboards/<name>.json"),
            r(" in its data folder, stating "),
            t("code", null, "start"),
            r(" and "),
            t("code", null, "pages"),
            r(". The journal draws that file; a plugin's own code never runs in the viewer.")
          ], -1))
        ])
      ]),
      _: 1
    }));
  }
}, we = /* @__PURE__ */ W(ye, [["__scopeId", "data-v-584e0da5"]]), _e = { "data-plugin-preview": "" }, $e = { class: "preview-from" }, be = {
  key: 0,
  class: "preview-lead"
}, Ce = ["data-preview-kind"], Se = { class: "preview-kind" }, Ie = { class: "preview-label" }, Pe = { class: "preview-command" }, Te = {
  __name: "PluginInstallPreview",
  props: { preview: { type: Object, required: !0 } },
  emits: ["close", "install"],
  setup(w, { emit: k }) {
    const f = k, y = { requires: "Checks", setup: "Sets up", installed: "Asks", program: "On events", service: "Keeps running", alias: "Command" };
    return (A, a) => (s(), b(i(E), {
      title: w.preview.title,
      onClose: a[2] || (a[2] = (p) => f("close"))
    }, {
      foot: d(() => [
        m(i(c), {
          onClick: a[0] || (a[0] = (p) => f("close"))
        }, {
          default: d(() => [...a[4] || (a[4] = [
            r("Cancel", -1)
          ])]),
          _: 1
        }),
        m(i(c), {
          kind: "primary",
          "data-plugin-preview-install": "",
          onClick: a[1] || (a[1] = (p) => f("install"))
        }, {
          default: d(() => [...a[5] || (a[5] = [
            r("Install", -1)
          ])]),
          _: 1
        })
      ]),
      default: d(() => [
        t("div", _e, [
          t("p", $e, "Version " + o(w.preview.version) + " from " + o(w.preview.source), 1),
          a[3] || (a[3] = t("p", { class: "preview-lead" }, "It runs as you, with your files and your network. This is everything it runs:", -1)),
          w.preview.rows.length ? g("", !0) : (s(), u("p", be, "It runs nothing.")),
          (s(!0), u(C, null, N(w.preview.rows, (p) => (s(), u("div", {
            key: `${p.kind} ${p.label}`,
            class: "preview-row",
            "data-preview-kind": p.kind
          }, [
            t("span", Se, o(y[p.kind]), 1),
            t("span", Ie, o(p.label), 1),
            t("code", Pe, o(p.command), 1)
          ], 8, Ce))), 128))
        ])
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Ne = /* @__PURE__ */ W(Te, [["__scopeId", "data-v-3f78b862"]]), Ae = {
  key: 0,
  class: "plugin-services",
  "data-plugin-services": ""
}, Oe = ["data-plugin-service"], Re = { class: "plugin-service-name" }, Le = 5e3, Ue = {
  __name: "PluginServices",
  setup(w) {
    const { rows: k, load: f } = M("plugin services", ["plugin.*"]);
    let y = 0;
    return re(() => {
      y = setInterval(f, Le);
    }), de(() => clearInterval(y)), (A, a) => i(k).length ? (s(), u("section", Ae, [
      a[0] || (a[0] = t("h3", { class: "plugin-services-heading" }, "Services", -1)),
      (s(!0), u(C, null, N(i(k), (p) => (s(), u("div", {
        key: p.id,
        class: "plugin-service",
        "data-plugin-service": p.id
      }, [
        t("span", Re, o(p.plugin) + " · " + o(p.service), 1),
        t("span", {
          class: H(["plugin-service-state", { running: p.running }])
        }, o(p.running ? `Running, process ${p.pid}` : "Stopped"), 3)
      ], 8, Oe))), 128))
    ])) : g("", !0);
  }
}, je = /* @__PURE__ */ W(Ue, [["__scopeId", "data-v-83193c52"]]), xe = { class: "plugin-tools" }, Ee = {
  key: 2,
  class: "plugin-fault",
  role: "alert",
  "data-plugin-refusal": ""
}, Je = { class: "plugins" }, We = {
  key: 1,
  class: "plugin-note"
}, qe = {
  key: 2,
  class: "plugin-note"
}, De = ["data-row"], Me = { class: "plugin-head" }, Ve = { class: "name" }, Fe = { class: "release" }, Ke = ["aria-checked", "aria-label", "onClick"], Be = { class: "plugin-source" }, Ge = {
  key: 0,
  class: "plugin-fault"
}, He = { class: "plugin-moves" }, ze = {
  class: "plugin-note",
  "data-plugin-latest-line": ""
}, Xe = {
  key: 2,
  class: "plugin-settings",
  "data-plugin-setting-list": ""
}, Ye = {
  key: 0,
  class: "plugin-note"
}, Qe = { class: "plugin-setting-title" }, Ze = ["value", "data-plugin-setting", "onChange"], en = {
  key: 3,
  class: "plugin-fault",
  role: "alert",
  "data-plugin-record-failure": ""
}, nn = { "data-plugin-record-body": "" }, tn = {
  key: 0,
  class: "plugin-fault"
}, ln = {
  key: 1,
  class: "plugin-note",
  "data-plugin-services": ""
}, sn = {
  key: 2,
  class: "plugin-note"
}, an = { "data-plugin-upgrade-body": "" }, un = { class: "plugin-note" }, on = {
  key: 0,
  class: "plugin-note"
}, rn = {
  __name: "PluginRows",
  setup(w) {
    const k = pe(), { rows: f, failure: y, loaded: A, load: a } = M("plugin list", ["plugin.*"]), { rows: p } = M("plugin dashboards", ["plugin.*"]), j = (l) => p.value.find((e) => e.plugin === l.name), V = ve(f, { title: (l) => l.title || l.name, isOpen: (l) => l.enabled }), P = h(""), S = h(null), O = h(""), R = h(""), J = h(""), I = h({}), z = (l) => L(`plugin ${l.enabled ? "disable" : "enable"} ${l.name}`);
    async function L(l) {
      const e = await k.run(l);
      return P.value = e.ok ? "" : e.error, e.ok && a(), e.ok;
    }
    const U = h(null), q = h(!1);
    async function X() {
      if (!O.value.trim()) return;
      const l = await k.read(["plugin", "preview", O.value.trim()]);
      P.value = l.ok ? "" : l.error, U.value = l.ok ? l.value : null;
    }
    async function Y() {
      const l = await L(["plugin", "install", U.value.source, "--yes"]);
      U.value = null, l && (O.value = "", S.value = null);
    }
    const T = h({});
    async function Q(l) {
      const e = await k.read(["plugin", "latest", l.name]);
      T.value = { ...T.value, [l.name]: e.ok ? e.value : { line: e.error, is_newer: !1 } };
    }
    const _ = h(null);
    async function Z(l) {
      const e = await k.run(["plugin", "upgrade", l.name]);
      P.value = e.ok ? "" : e.error, _.value = e.ok ? e.value : null;
    }
    async function ee() {
      const l = _.value.name;
      _.value = null, await L(["plugin", "upgrade", l, "--yes"]) && (T.value = { ...T.value, [l]: { line: `${l} is upgraded; running services change at the next restart`, is_newer: !1 } });
    }
    function ne(l) {
      const e = new URL(window.location.href);
      e.searchParams.set("page", "coding.files"), e.searchParams.set("file", l.path), window.location.assign(e.href);
    }
    const x = h(null);
    async function te(l) {
      const e = await k.read(["plugin", "dashboard", l.name]);
      P.value = e.ok ? "" : e.error, x.value = e.ok ? { title: j(l).title, document: e.value } : null;
    }
    async function le() {
      R.value.trim() && await L(["message", "send", `Please make a plugin: ${R.value.trim()}`]) && (R.value = "", S.value = null);
    }
    async function F(l, e) {
      await L(["plugin", "remove", l.name, ...e ? ["--purge"] : []]) && (J.value = "");
    }
    async function se(l) {
      if (I.value[l.name]) {
        const { [l.name]: n, ...v } = I.value;
        return void (I.value = v);
      }
      const e = await k.read(["plugin", "settings", l.name]);
      P.value = e.ok ? "" : e.error, e.ok && (I.value = { ...I.value, [l.name]: e.value.settings });
    }
    const ae = (l, e, n) => L(["plugin", "configure", l.name, e.key, n]), $ = h(null);
    function ie(l) {
      try {
        return JSON.parse(l).cards.map((e) => e.detail || e.title).join(`
`);
      } catch {
        return l;
      }
    }
    const D = h("");
    async function ue(l) {
      const e = await k.read(`plugin record ${l.name}`);
      D.value = e.ok ? "" : e.error, $.value = e.ok ? e.value : null;
    }
    return (l, e) => (s(), u(C, null, [
      t("div", xe, [
        m(i(c), {
          small: "",
          bordered: "",
          "data-plugin-install": "",
          onClick: e[0] || (e[0] = (n) => S.value = S.value === "install" ? null : "install")
        }, {
          default: d(() => [...e[12] || (e[12] = [
            r("Install a plugin", -1)
          ])]),
          _: 1
        }),
        m(i(c), {
          small: "",
          bordered: "",
          "data-plugin-make": "",
          onClick: e[1] || (e[1] = (n) => S.value = S.value === "make" ? null : "make")
        }, {
          default: d(() => [...e[13] || (e[13] = [
            r("Ask the agent to make one", -1)
          ])]),
          _: 1
        }),
        m(i(c), {
          small: "",
          bordered: "",
          "data-plugin-guide-open": "",
          onClick: e[2] || (e[2] = (n) => q.value = !0)
        }, {
          default: d(() => [...e[14] || (e[14] = [
            r("How to make a plugin", -1)
          ])]),
          _: 1
        })
      ]),
      S.value === "install" ? (s(), u("form", {
        key: 0,
        class: "plugin-form",
        "data-plugin-install-form": "",
        onSubmit: K(X, ["prevent"])
      }, [
        B(t("input", {
          "onUpdate:modelValue": e[3] || (e[3] = (n) => O.value = n),
          placeholder: "owner/repo, a link or a folder",
          "aria-label": "Where the plugin is"
        }, null, 512), [
          [G, O.value]
        ]),
        m(i(c), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !O.value.trim()
        }, {
          default: d(() => [...e[15] || (e[15] = [
            r("Preview", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : g("", !0),
      S.value === "make" ? (s(), u("form", {
        key: 1,
        class: "plugin-form",
        "data-plugin-make-form": "",
        onSubmit: K(le, ["prevent"])
      }, [
        B(t("input", {
          "onUpdate:modelValue": e[4] || (e[4] = (n) => R.value = n),
          placeholder: "What should the plugin do?",
          "aria-label": "What should the plugin do?"
        }, null, 512), [
          [G, R.value]
        ]),
        m(i(c), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !R.value.trim()
        }, {
          default: d(() => [...e[16] || (e[16] = [
            r("Ask", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : g("", !0),
      P.value ? (s(), u("p", Ee, o(P.value), 1)) : g("", !0),
      t("div", Je, [
        i(A) ? !i(y) && !i(f).length ? (s(), u("p", We, "No plugins installed")) : i(y) ? (s(), u("p", qe, o(i(y)), 1)) : g("", !0) : (s(), b(i(ge), {
          key: 0,
          shape: "cards"
        })),
        m(i(me), {
          tools: i(V),
          placeholder: "Search the plugins"
        }, null, 8, ["tools"]),
        (s(!0), u(C, null, N(i(V).shown.value, (n) => (s(), u("div", {
          key: n.id,
          class: "plugin",
          "data-row": n.id
        }, [
          t("span", Me, [
            t("span", Ve, o(n.title), 1),
            t("span", Fe, o(n.release), 1),
            t("button", {
              type: "button",
              role: "switch",
              "aria-checked": n.enabled,
              "aria-label": n.enabled ? "Switch off" : "Switch on",
              class: H(["toggle", { on: n.enabled }]),
              onClick: (v) => z(n)
            }, null, 10, Ke)
          ]),
          t("span", Be, o(n.source), 1),
          n.failing ? (s(), u("span", Ge, o(n.last_fault || "Failing"), 1)) : g("", !0),
          t("span", He, [
            m(i(c), {
              small: "",
              "data-plugin-settings": "",
              onClick: (v) => se(n)
            }, {
              default: d(() => [...e[17] || (e[17] = [
                r("Settings", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            m(i(c), {
              small: "",
              "data-plugin-record": "",
              onClick: (v) => ue(n)
            }, {
              default: d(() => [...e[18] || (e[18] = [
                r("What it did", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            m(i(c), {
              small: "",
              "data-plugin-latest": "",
              onClick: (v) => Q(n)
            }, {
              default: d(() => [...e[19] || (e[19] = [
                r("Check for updates", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            j(n) ? (s(), b(i(c), {
              key: 0,
              small: "",
              "data-plugin-board": "",
              onClick: (v) => te(n)
            }, {
              default: d(() => [
                r(o(j(n).title), 1)
              ]),
              _: 2
            }, 1032, ["onClick"])) : g("", !0),
            J.value === n.name ? (s(), u(C, { key: 1 }, [
              m(i(c), {
                small: "",
                onClick: e[5] || (e[5] = (v) => J.value = "")
              }, {
                default: d(() => [...e[20] || (e[20] = [
                  r("Keep it", -1)
                ])]),
                _: 1
              }),
              m(i(c), {
                small: "",
                kind: "danger",
                "data-plugin-remove-keep": "",
                onClick: (v) => F(n, !1)
              }, {
                default: d(() => [...e[21] || (e[21] = [
                  r("Remove, keep its data", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              m(i(c), {
                small: "",
                kind: "danger",
                "data-plugin-remove-purge": "",
                onClick: (v) => F(n, !0)
              }, {
                default: d(() => [...e[22] || (e[22] = [
                  r("Remove with its data", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])
            ], 64)) : (s(), b(i(c), {
              key: 2,
              small: "",
              "data-plugin-remove": "",
              onClick: (v) => J.value = n.name
            }, {
              default: d(() => [...e[23] || (e[23] = [
                r("Remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]))
          ]),
          T.value[n.name] ? (s(), u(C, { key: 1 }, [
            t("span", ze, o(T.value[n.name].line), 1),
            T.value[n.name].is_newer ? (s(), b(i(c), {
              key: 0,
              small: "",
              kind: "primary",
              "data-plugin-upgrade": "",
              onClick: (v) => Z(n)
            }, {
              default: d(() => [...e[24] || (e[24] = [
                r("See what changes", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])) : g("", !0)
          ], 64)) : g("", !0),
          I.value[n.name] ? (s(), u("div", Xe, [
            I.value[n.name].length ? g("", !0) : (s(), u("p", Ye, "This plugin has no settings")),
            (s(!0), u(C, null, N(I.value[n.name], (v) => (s(), u("label", {
              key: v.key,
              class: "plugin-setting"
            }, [
              t("span", Qe, o(v.title || v.key), 1),
              t("input", {
                value: v.value,
                "data-plugin-setting": v.key,
                onChange: (oe) => ae(n, v, oe.target.value)
              }, null, 40, Ze)
            ]))), 128))
          ])) : g("", !0)
        ], 8, De))), 128))
      ]),
      D.value ? (s(), u("p", en, o(D.value), 1)) : g("", !0),
      $.value ? (s(), b(i(E), {
        key: 4,
        title: `What ${$.value.name} did`,
        onClose: e[6] || (e[6] = (n) => $.value = null)
      }, {
        default: d(() => {
          var n;
          return [
            t("div", nn, [
              $.value.last_fault ? (s(), u("p", tn, "Last fault, " + o($.value.fault_count) + " without a success: " + o($.value.last_fault), 1)) : g("", !0),
              (n = $.value.services) != null && n.length ? (s(), u("p", ln, "Keeps running: " + o($.value.services.map((v) => v.name).join(", ")), 1)) : g("", !0),
              $.value.outputs.length ? g("", !0) : (s(), u("p", sn, "It has done nothing yet.")),
              (s(!0), u(C, null, N($.value.outputs, (v) => (s(), u("p", {
                key: v.id,
                class: "plugin-output",
                "data-plugin-output": ""
              }, o(ie(v.output)), 1))), 128))
            ])
          ];
        }),
        _: 1
      }, 8, ["title"])) : g("", !0),
      m(je),
      U.value ? (s(), b(Ne, {
        key: 5,
        preview: U.value,
        onClose: e[7] || (e[7] = (n) => U.value = null),
        onInstall: Y
      }, null, 8, ["preview"])) : g("", !0),
      _.value ? (s(), b(i(E), {
        key: 6,
        title: `Upgrade ${_.value.name}`,
        onClose: e[9] || (e[9] = (n) => _.value = null)
      }, {
        foot: d(() => [
          m(i(c), {
            onClick: e[8] || (e[8] = (n) => _.value = null)
          }, {
            default: d(() => [...e[25] || (e[25] = [
              r("Cancel", -1)
            ])]),
            _: 1
          }),
          m(i(c), {
            kind: "primary",
            "data-plugin-upgrade-apply": "",
            onClick: ee
          }, {
            default: d(() => [...e[26] || (e[26] = [
              r("Upgrade", -1)
            ])]),
            _: 1
          })
        ]),
        default: d(() => [
          t("div", an, [
            t("p", un, o(_.value.installed) + " to " + o(_.value.version) + ". Services that run keep the old code until the journal restarts.", 1),
            _.value.changes.length ? g("", !0) : (s(), u("p", on, "It runs the same commands as the version you have.")),
            (s(!0), u(C, null, N(_.value.changes, (n) => (s(), u("p", {
              key: n,
              class: "plugin-output",
              "data-plugin-upgrade-change": ""
            }, o(n), 1))), 128))
          ])
        ]),
        _: 1
      }, 8, ["title"])) : g("", !0),
      q.value ? (s(), b(we, {
        key: 7,
        onClose: e[10] || (e[10] = (n) => q.value = !1)
      })) : g("", !0),
      x.value ? (s(), b(i(E), {
        key: 8,
        title: x.value.title,
        onClose: e[11] || (e[11] = (n) => x.value = null)
      }, {
        default: d(() => [
          m(i(ce), {
            document: x.value.document,
            onFile: ne
          }, null, 8, ["document"])
        ]),
        _: 1
      }, 8, ["title"])) : g("", !0)
    ], 64));
  }
}, vn = /* @__PURE__ */ W(rn, [["__scopeId", "data-v-587a41f0"]]);
export {
  vn as default
};
