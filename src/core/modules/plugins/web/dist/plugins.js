/* @code-commandments-generated */
if (!document.getElementById("window-styles-332c7e31d728")) { const style = document.createElement("style"); style.id = "window-styles-332c7e31d728"; style.textContent = ".plugin-guide h3[data-v-584e0da5]{margin:0 0 8px;color:var(--text-3);font-size:11px;font-weight:500;letter-spacing:.04em;text-transform:uppercase}.plugin-guide p[data-v-584e0da5],.plugin-guide dd[data-v-584e0da5]{margin:0 0 12px;color:var(--text-2);font-size:12.5px}.plugin-guide dt[data-v-584e0da5]{font-size:12.5px;font-weight:500}.plugin-guide pre[data-v-584e0da5]{margin:0 0 16px;padding:10px;border-radius:6px;background:var(--hover);font-size:12px;white-space:pre-wrap;overflow-wrap:anywhere}.preview-from[data-v-3f78b862],.preview-lead[data-v-3f78b862]{margin:0 0 10px;color:var(--text-2);font-size:12.5px}.preview-row[data-v-3f78b862]{display:flex;flex-wrap:wrap;gap:4px 10px;align-items:baseline;padding:5px 0;border-top:1px solid var(--border)}.preview-kind[data-v-3f78b862]{flex:0 0 90px;color:var(--text-3);font-size:12px}.preview-command[data-v-3f78b862]{flex-basis:100%;font-size:12px;overflow-wrap:anywhere}.plugin-output[data-v-7f69ba78]{margin:0 0 6px;font-size:13px;white-space:pre-wrap}.plugin-note[data-v-7f69ba78]{margin:0;color:var(--text-3);font-size:12px}.plugin-fault[data-v-7f69ba78]{color:var(--danger);font-size:12px}.plugin-settings[data-v-36857445]{display:flex;flex-direction:column;gap:8px;margin-top:8px}.plugin-setting[data-v-36857445]{display:flex;flex-direction:column;gap:2px}.plugin-setting-title[data-v-36857445]{color:var(--text-3);font-size:12px}.plugin-note[data-v-36857445]{margin:0;color:var(--text-3);font-size:12px}.plugin-output[data-v-82b17d38]{margin:0 0 6px;font-size:13px;white-space:pre-wrap}.plugin-note[data-v-82b17d38]{margin:0;color:var(--text-3);font-size:12px}.plugin-services[data-v-83193c52]{display:flex;flex-direction:column;gap:4px;margin-top:16px}.plugin-services-heading[data-v-83193c52]{margin:0 0 4px;color:var(--text-3);font-size:11px;font-weight:600;letter-spacing:.04em;text-transform:uppercase}.plugin-service[data-v-83193c52]{display:flex;gap:12px;justify-content:space-between;padding:4px 0}.plugin-service-state[data-v-83193c52]{color:var(--text-3);font-size:12px}.plugin-service-state.running[data-v-83193c52]{color:var(--accent-text)}.plugin-note[data-v-0e9d453b]{margin:0;color:var(--text-2);font-size:13px}.plugin-tools[data-v-0e9d453b],.plugin-form[data-v-0e9d453b]{display:flex;gap:8px;margin-bottom:10px}.plugin-form input[data-v-0e9d453b]{flex:1;min-width:0}.plugin-moves[data-v-0e9d453b]{display:flex;flex-wrap:wrap;gap:6px;margin-top:6px}.plugins[data-v-0e9d453b]{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:12px}.plugin[data-v-0e9d453b]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plugin-head[data-v-0e9d453b]{display:flex;gap:10px;align-items:center}.name[data-v-0e9d453b]{flex:1;font-weight:500}.release[data-v-0e9d453b],.plugin-source[data-v-0e9d453b],.plugin-note[data-v-0e9d453b]{margin:0;color:var(--text-3);font-size:12px}.plugin-fault[data-v-0e9d453b]{color:var(--danger);font-size:12px}.toggle[data-v-0e9d453b]{position:relative;flex:none;width:30px;height:17px;border:0;border-radius:9px;background:var(--raised);cursor:pointer}.toggle[data-v-0e9d453b]:after{position:absolute;top:2px;left:2px;width:13px;height:13px;border-radius:50%;background:#fff;content:\"\";transition:transform .15s ease}.toggle.on[data-v-0e9d453b]{background:var(--accent)}.toggle.on[data-v-0e9d453b]:after{transform:translate(13px)}\n"; document.head.appendChild(style); }
import { openBlock as l, createBlock as w, unref as i, withCtx as g, createElementVNode as t, createTextVNode as d, toDisplayString as p, createElementBlock as u, Fragment as b, renderList as A, createCommentVNode as c, createVNode as k, onMounted as oe, onUnmounted as re, normalizeClass as H, ref as _, withModifiers as K, withDirectives as B, vModelText as G } from "vue";
import { Dialog as D, Btn as h, useRows as W, useWindow as de, useListTools as pe, useReadLine as ge, Skeleton as ve, ListTools as ce, Dashboard as me } from "@journal/window-kit";
const N = (o, m) => {
  const f = o.__vccOpts || o;
  for (const [y, v] of m)
    f[y] = v;
  return f;
}, fe = {
  class: "plugin-guide",
  "data-plugin-guide": ""
}, ke = `{
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
  setup(o, { emit: m }) {
    const f = m, y = [
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
    return (v, n) => (l(), w(i(D), {
      title: "Make a plugin",
      onClose: n[0] || (n[0] = (r) => f("close"))
    }, {
      default: g(() => [
        t("div", fe, [
          n[1] || (n[1] = t("h3", null, "Manifest", -1)),
          n[2] || (n[2] = t("p", null, [
            d("A plugin is a folder or a repository with a "),
            t("code", null, "journal-plugin.json"),
            d(". The journal reads it, shows you everything it would run, and copies it when you install it, a repository at its newest version tag.")
          ], -1)),
          t("pre", null, p(ke)),
          n[3] || (n[3] = t("h3", null, "Keys", -1)),
          t("dl", null, [
            (l(), u(b, null, A(y, ([r, C]) => (l(), u(b, { key: r }, [
              t("dt", null, p(r), 1),
              t("dd", null, p(C), 1)
            ], 64))), 64))
          ]),
          n[4] || (n[4] = t("h3", null, "Answering an event", -1)),
          n[5] || (n[5] = t("p", null, "The program prints JSON, and printing nothing allows the event. Every key is optional:", -1)),
          t("pre", null, p(he)),
          n[6] || (n[6] = t("h3", null, "Its environment", -1)),
          n[7] || (n[7] = t("p", null, [
            d("A plugin runs as you, with "),
            t("code", null, "journal"),
            d(" on its path. "),
            t("code", null, "$JOURNAL_PLUGIN_DIR"),
            d(" is its folder, "),
            t("code", null, "$JOURNAL_PLUGIN_DATA"),
            d(" a folder for its data, and "),
            t("code", null, "$JOURNAL_SETTINGS"),
            d(" a file with its settings.")
          ], -1)),
          n[8] || (n[8] = t("h3", null, "Its dashboard", -1)),
          n[9] || (n[9] = t("p", null, [
            d("It writes "),
            t("code", null, "dashboards/<name>.json"),
            d(" in its data folder, stating "),
            t("code", null, "start"),
            d(" and "),
            t("code", null, "pages"),
            d(". The journal draws that file; a plugin's own code never runs in the viewer.")
          ], -1))
        ])
      ]),
      _: 1
    }));
  }
}, we = /* @__PURE__ */ N(ye, [["__scopeId", "data-v-584e0da5"]]), $e = { "data-plugin-preview": "" }, _e = { class: "preview-from" }, be = {
  key: 0,
  class: "preview-lead"
}, Ce = ["data-preview-kind"], Se = { class: "preview-kind" }, Ie = { class: "preview-label" }, Pe = { class: "preview-command" }, Te = {
  __name: "PluginInstallPreview",
  props: { preview: { type: Object, required: !0 } },
  emits: ["close", "install"],
  setup(o, { emit: m }) {
    const f = m, y = { requires: "Checks", setup: "Sets up", installed: "Asks", program: "On events", service: "Keeps running", alias: "Command" };
    return (v, n) => (l(), w(i(D), {
      title: o.preview.title,
      onClose: n[2] || (n[2] = (r) => f("close"))
    }, {
      foot: g(() => [
        k(i(h), {
          onClick: n[0] || (n[0] = (r) => f("close"))
        }, {
          default: g(() => [...n[4] || (n[4] = [
            d("Cancel", -1)
          ])]),
          _: 1
        }),
        k(i(h), {
          kind: "primary",
          "data-plugin-preview-install": "",
          onClick: n[1] || (n[1] = (r) => f("install"))
        }, {
          default: g(() => [...n[5] || (n[5] = [
            d("Install", -1)
          ])]),
          _: 1
        })
      ]),
      default: g(() => [
        t("div", $e, [
          t("p", _e, "Version " + p(o.preview.version) + " from " + p(o.preview.source), 1),
          n[3] || (n[3] = t("p", { class: "preview-lead" }, "It runs as you, with your files and your network. This is everything it runs:", -1)),
          o.preview.rows.length ? c("", !0) : (l(), u("p", be, "It runs nothing.")),
          (l(!0), u(b, null, A(o.preview.rows, (r) => (l(), u("div", {
            key: `${r.kind} ${r.label}`,
            class: "preview-row",
            "data-preview-kind": r.kind
          }, [
            t("span", Se, p(y[r.kind]), 1),
            t("span", Ie, p(r.label), 1),
            t("code", Pe, p(r.command), 1)
          ], 8, Ce))), 128))
        ])
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Ae = /* @__PURE__ */ N(Te, [["__scopeId", "data-v-3f78b862"]]), Ne = { "data-plugin-record-body": "" }, Re = {
  key: 0,
  class: "plugin-fault"
}, Le = {
  key: 1,
  class: "plugin-note",
  "data-plugin-services": ""
}, Oe = {
  key: 2,
  class: "plugin-note"
}, Ue = {
  __name: "PluginRecordDialog",
  props: { record: { type: Object, required: !0 } },
  emits: ["close"],
  setup(o, { emit: m }) {
    const f = m;
    function y(v) {
      try {
        return JSON.parse(v).cards.map((n) => n.detail || n.title).join(`
`);
      } catch {
        return v;
      }
    }
    return (v, n) => (l(), w(i(D), {
      title: `What ${o.record.name} did`,
      onClose: n[0] || (n[0] = (r) => f("close"))
    }, {
      default: g(() => {
        var r;
        return [
          t("div", Ne, [
            o.record.last_fault ? (l(), u("p", Re, "Last fault, " + p(o.record.fault_count) + " without a success: " + p(o.record.last_fault), 1)) : c("", !0),
            (r = o.record.services) != null && r.length ? (l(), u("p", Le, "Keeps running: " + p(o.record.services.map((C) => C.name).join(", ")), 1)) : c("", !0),
            o.record.outputs.length ? c("", !0) : (l(), u("p", Oe, "It has done nothing yet.")),
            (l(!0), u(b, null, A(o.record.outputs, (C) => (l(), u("p", {
              key: C.id,
              class: "plugin-output",
              "data-plugin-output": ""
            }, p(y(C.output)), 1))), 128))
          ])
        ];
      }),
      _: 1
    }, 8, ["title"]));
  }
}, je = /* @__PURE__ */ N(Ue, [["__scopeId", "data-v-7f69ba78"]]), xe = {
  class: "plugin-settings",
  "data-plugin-setting-list": ""
}, De = {
  key: 0,
  class: "plugin-note"
}, qe = { class: "plugin-setting-title" }, Ee = ["value", "data-plugin-setting", "onChange"], Je = {
  __name: "PluginSettingList",
  props: { settings: { type: Array, required: !0 } },
  emits: ["configure"],
  setup(o, { emit: m }) {
    const f = m;
    return (y, v) => (l(), u("div", xe, [
      o.settings.length ? c("", !0) : (l(), u("p", De, "This plugin has no settings")),
      (l(!0), u(b, null, A(o.settings, (n) => (l(), u("label", {
        key: n.key,
        class: "plugin-setting"
      }, [
        t("span", qe, p(n.title || n.key), 1),
        t("input", {
          value: n.value,
          "data-plugin-setting": n.key,
          onChange: (r) => f("configure", n, r.target.value)
        }, null, 40, Ee)
      ]))), 128))
    ]));
  }
}, We = /* @__PURE__ */ N(Je, [["__scopeId", "data-v-36857445"]]), Me = { "data-plugin-upgrade-body": "" }, Ve = { class: "plugin-note" }, Fe = {
  key: 0,
  class: "plugin-note"
}, Ke = {
  __name: "PluginUpgradeDialog",
  props: { upgrade: { type: Object, required: !0 } },
  emits: ["close", "apply"],
  setup(o, { emit: m }) {
    const f = m;
    return (y, v) => (l(), w(i(D), {
      title: `Upgrade ${o.upgrade.name}`,
      onClose: v[2] || (v[2] = (n) => f("close"))
    }, {
      foot: g(() => [
        k(i(h), {
          onClick: v[0] || (v[0] = (n) => f("close"))
        }, {
          default: g(() => [...v[3] || (v[3] = [
            d("Cancel", -1)
          ])]),
          _: 1
        }),
        k(i(h), {
          kind: "primary",
          "data-plugin-upgrade-apply": "",
          onClick: v[1] || (v[1] = (n) => f("apply"))
        }, {
          default: g(() => [...v[4] || (v[4] = [
            d("Upgrade", -1)
          ])]),
          _: 1
        })
      ]),
      default: g(() => [
        t("div", Me, [
          t("p", Ve, p(o.upgrade.installed) + " to " + p(o.upgrade.version) + ". Services that run keep the old code until the journal restarts.", 1),
          o.upgrade.changes.length ? c("", !0) : (l(), u("p", Fe, "It runs the same commands as the version you have.")),
          (l(!0), u(b, null, A(o.upgrade.changes, (n) => (l(), u("p", {
            key: n,
            class: "plugin-output",
            "data-plugin-upgrade-change": ""
          }, p(n), 1))), 128))
        ])
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, Be = /* @__PURE__ */ N(Ke, [["__scopeId", "data-v-82b17d38"]]), Ge = {
  key: 0,
  class: "plugin-services",
  "data-plugin-services": ""
}, He = ["data-plugin-service"], ze = { class: "plugin-service-name" }, Xe = 5e3, Ye = {
  __name: "PluginServices",
  setup(o) {
    const { rows: m, load: f } = W("plugin services", ["plugin.*"]);
    let y = 0;
    return oe(() => {
      y = setInterval(f, Xe);
    }), re(() => clearInterval(y)), (v, n) => i(m).length ? (l(), u("section", Ge, [
      n[0] || (n[0] = t("h3", { class: "plugin-services-heading" }, "Services", -1)),
      (l(!0), u(b, null, A(i(m), (r) => (l(), u("div", {
        key: r.id,
        class: "plugin-service",
        "data-plugin-service": r.id
      }, [
        t("span", ze, p(r.plugin) + " · " + p(r.service), 1),
        t("span", {
          class: H(["plugin-service-state", { running: r.running }])
        }, p(r.running ? `Running, process ${r.pid}` : "Stopped"), 3)
      ], 8, He))), 128))
    ])) : c("", !0);
  }
}, Qe = /* @__PURE__ */ N(Ye, [["__scopeId", "data-v-83193c52"]]), Ze = { class: "plugin-tools" }, en = {
  key: 2,
  class: "plugin-fault",
  role: "alert",
  "data-plugin-refusal": ""
}, nn = { class: "plugins" }, tn = {
  key: 1,
  class: "plugin-note"
}, ln = {
  key: 2,
  class: "plugin-note"
}, sn = ["data-row"], an = { class: "plugin-head" }, un = { class: "name" }, on = { class: "release" }, rn = ["aria-checked", "aria-label", "onClick"], dn = { class: "plugin-source" }, pn = {
  key: 0,
  class: "plugin-fault"
}, gn = { class: "plugin-moves" }, vn = {
  class: "plugin-note",
  "data-plugin-latest-line": ""
}, cn = {
  key: 3,
  class: "plugin-fault",
  role: "alert",
  "data-plugin-record-failure": ""
}, mn = {
  __name: "PluginRows",
  setup(o) {
    const m = de(), { rows: f, failure: y, loaded: v, load: n } = W("plugin list", ["plugin.*"]), { rows: r } = W("plugin dashboards", ["plugin.*"]), C = (s) => r.value.find((e) => e.plugin === s.name), M = pe(f, { title: (s) => s.title || s.name, isOpen: (s) => s.enabled }), I = _(""), S = _(null), R = _(""), L = _(""), q = _(""), P = _({}), z = (s) => O(`plugin ${s.enabled ? "disable" : "enable"} ${s.name}`);
    async function O(s) {
      const e = await m.run(s);
      return I.value = e.ok ? "" : e.error, e.ok && n(), e.ok;
    }
    const U = _(null), E = _(!1);
    async function X() {
      if (!R.value.trim()) return;
      const s = await m.read(["plugin", "preview", R.value.trim()]);
      I.value = s.ok ? "" : s.error, U.value = s.ok ? s.value : null;
    }
    async function Y() {
      const s = await O(["plugin", "install", U.value.source, "--yes"]);
      U.value = null, s && (R.value = "", S.value = null);
    }
    const T = _({});
    async function Q(s) {
      const e = await m.read(["plugin", "latest", s.name]);
      T.value = { ...T.value, [s.name]: e.ok ? e.value : { line: e.error, is_newer: !1 } };
    }
    const j = _(null);
    async function Z(s) {
      const e = await m.run(["plugin", "upgrade", s.name]);
      I.value = e.ok ? "" : e.error, j.value = e.ok ? e.value : null;
    }
    async function ee() {
      const s = j.value.name;
      j.value = null, await O(["plugin", "upgrade", s, "--yes"]) && (T.value = { ...T.value, [s]: { line: `${s} is upgraded; running services change at the next restart`, is_newer: !1 } });
    }
    function ne(s) {
      const e = new URL(window.location.href);
      e.searchParams.set("page", "coding.files"), e.searchParams.set("file", s.path), window.location.assign(e.href);
    }
    const x = _(null);
    async function te(s) {
      const e = await m.read(["plugin", "dashboard", s.name]);
      I.value = e.ok ? "" : e.error, x.value = e.ok ? { title: C(s).title, document: e.value } : null;
    }
    async function le() {
      L.value.trim() && await O(["message", "send", `Please make a plugin: ${L.value.trim()}`]) && (L.value = "", S.value = null);
    }
    async function V(s, e) {
      await O(["plugin", "remove", s.name, ...e ? ["--purge"] : []]) && (q.value = "");
    }
    async function se(s) {
      if (P.value[s.name]) {
        const { [s.name]: a, ...$ } = P.value;
        return void (P.value = $);
      }
      const e = await m.read(["plugin", "settings", s.name]);
      I.value = e.ok ? "" : e.error, e.ok && (P.value = { ...P.value, [s.name]: e.value.settings });
    }
    const ae = (s, e, a) => O(["plugin", "configure", s.name, e.key, a]), { value: J, failure: F, load: ie } = ge((s) => `plugin record ${s.name}`);
    return (s, e) => (l(), u(b, null, [
      t("div", Ze, [
        k(i(h), {
          small: "",
          bordered: "",
          "data-plugin-install": "",
          onClick: e[0] || (e[0] = (a) => S.value = S.value === "install" ? null : "install")
        }, {
          default: g(() => [...e[11] || (e[11] = [
            d("Install a plugin", -1)
          ])]),
          _: 1
        }),
        k(i(h), {
          small: "",
          bordered: "",
          "data-plugin-make": "",
          onClick: e[1] || (e[1] = (a) => S.value = S.value === "make" ? null : "make")
        }, {
          default: g(() => [...e[12] || (e[12] = [
            d("Ask the agent to make one", -1)
          ])]),
          _: 1
        }),
        k(i(h), {
          small: "",
          bordered: "",
          "data-plugin-guide-open": "",
          onClick: e[2] || (e[2] = (a) => E.value = !0)
        }, {
          default: g(() => [...e[13] || (e[13] = [
            d("How to make a plugin", -1)
          ])]),
          _: 1
        })
      ]),
      S.value === "install" ? (l(), u("form", {
        key: 0,
        class: "plugin-form",
        "data-plugin-install-form": "",
        onSubmit: K(X, ["prevent"])
      }, [
        B(t("input", {
          "onUpdate:modelValue": e[3] || (e[3] = (a) => R.value = a),
          placeholder: "owner/repo, a link or a folder",
          "aria-label": "Where the plugin is"
        }, null, 512), [
          [G, R.value]
        ]),
        k(i(h), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !R.value.trim()
        }, {
          default: g(() => [...e[14] || (e[14] = [
            d("Preview", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : c("", !0),
      S.value === "make" ? (l(), u("form", {
        key: 1,
        class: "plugin-form",
        "data-plugin-make-form": "",
        onSubmit: K(le, ["prevent"])
      }, [
        B(t("input", {
          "onUpdate:modelValue": e[4] || (e[4] = (a) => L.value = a),
          placeholder: "What should the plugin do?",
          "aria-label": "What should the plugin do?"
        }, null, 512), [
          [G, L.value]
        ]),
        k(i(h), {
          small: "",
          kind: "primary",
          type: "submit",
          disabled: !L.value.trim()
        }, {
          default: g(() => [...e[15] || (e[15] = [
            d("Ask", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ], 32)) : c("", !0),
      I.value ? (l(), u("p", en, p(I.value), 1)) : c("", !0),
      t("div", nn, [
        i(v) ? !i(y) && !i(f).length ? (l(), u("p", tn, "No plugins installed")) : i(y) ? (l(), u("p", ln, p(i(y)), 1)) : c("", !0) : (l(), w(i(ve), {
          key: 0,
          shape: "cards"
        })),
        k(i(ce), {
          tools: i(M),
          placeholder: "Search the plugins"
        }, null, 8, ["tools"]),
        (l(!0), u(b, null, A(i(M).shown.value, (a) => (l(), u("div", {
          key: a.id,
          class: "plugin",
          "data-row": a.id
        }, [
          t("span", an, [
            t("span", un, p(a.title), 1),
            t("span", on, p(a.release), 1),
            t("button", {
              type: "button",
              role: "switch",
              "aria-checked": a.enabled,
              "aria-label": a.enabled ? "Switch off" : "Switch on",
              class: H(["toggle", { on: a.enabled }]),
              onClick: ($) => z(a)
            }, null, 10, rn)
          ]),
          t("span", dn, p(a.source), 1),
          a.failing ? (l(), u("span", pn, p(a.last_fault || "Failing"), 1)) : c("", !0),
          t("span", gn, [
            k(i(h), {
              small: "",
              "data-plugin-settings": "",
              onClick: ($) => se(a)
            }, {
              default: g(() => [...e[16] || (e[16] = [
                d("Settings", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            k(i(h), {
              small: "",
              "data-plugin-record": "",
              onClick: ($) => i(ie)(a)
            }, {
              default: g(() => [...e[17] || (e[17] = [
                d("What it did", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            k(i(h), {
              small: "",
              "data-plugin-latest": "",
              onClick: ($) => Q(a)
            }, {
              default: g(() => [...e[18] || (e[18] = [
                d("Check for updates", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]),
            C(a) ? (l(), w(i(h), {
              key: 0,
              small: "",
              "data-plugin-board": "",
              onClick: ($) => te(a)
            }, {
              default: g(() => [
                d(p(C(a).title), 1)
              ]),
              _: 2
            }, 1032, ["onClick"])) : c("", !0),
            q.value === a.name ? (l(), u(b, { key: 1 }, [
              k(i(h), {
                small: "",
                onClick: e[5] || (e[5] = ($) => q.value = "")
              }, {
                default: g(() => [...e[19] || (e[19] = [
                  d("Keep it", -1)
                ])]),
                _: 1
              }),
              k(i(h), {
                small: "",
                kind: "danger",
                "data-plugin-remove-keep": "",
                onClick: ($) => V(a, !1)
              }, {
                default: g(() => [...e[20] || (e[20] = [
                  d("Remove, keep its data", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              k(i(h), {
                small: "",
                kind: "danger",
                "data-plugin-remove-purge": "",
                onClick: ($) => V(a, !0)
              }, {
                default: g(() => [...e[21] || (e[21] = [
                  d("Remove with its data", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])
            ], 64)) : (l(), w(i(h), {
              key: 2,
              small: "",
              "data-plugin-remove": "",
              onClick: ($) => q.value = a.name
            }, {
              default: g(() => [...e[22] || (e[22] = [
                d("Remove", -1)
              ])]),
              _: 1
            }, 8, ["onClick"]))
          ]),
          T.value[a.name] ? (l(), u(b, { key: 1 }, [
            t("span", vn, p(T.value[a.name].line), 1),
            T.value[a.name].is_newer ? (l(), w(i(h), {
              key: 0,
              small: "",
              kind: "primary",
              "data-plugin-upgrade": "",
              onClick: ($) => Z(a)
            }, {
              default: g(() => [...e[23] || (e[23] = [
                d("See what changes", -1)
              ])]),
              _: 1
            }, 8, ["onClick"])) : c("", !0)
          ], 64)) : c("", !0),
          P.value[a.name] ? (l(), w(We, {
            key: 2,
            settings: P.value[a.name],
            onConfigure: ($, ue) => ae(a, $, ue)
          }, null, 8, ["settings", "onConfigure"])) : c("", !0)
        ], 8, sn))), 128))
      ]),
      i(F) ? (l(), u("p", cn, p(i(F)), 1)) : c("", !0),
      i(J) ? (l(), w(je, {
        key: 4,
        record: i(J),
        onClose: e[6] || (e[6] = (a) => J.value = null)
      }, null, 8, ["record"])) : c("", !0),
      k(Qe),
      U.value ? (l(), w(Ae, {
        key: 5,
        preview: U.value,
        onClose: e[7] || (e[7] = (a) => U.value = null),
        onInstall: Y
      }, null, 8, ["preview"])) : c("", !0),
      j.value ? (l(), w(Be, {
        key: 6,
        upgrade: j.value,
        onClose: e[8] || (e[8] = (a) => j.value = null),
        onApply: ee
      }, null, 8, ["upgrade"])) : c("", !0),
      E.value ? (l(), w(we, {
        key: 7,
        onClose: e[9] || (e[9] = (a) => E.value = !1)
      })) : c("", !0),
      x.value ? (l(), w(i(D), {
        key: 8,
        title: x.value.title,
        onClose: e[10] || (e[10] = (a) => x.value = null)
      }, {
        default: g(() => [
          k(i(me), {
            document: x.value.document,
            onFile: ne
          }, null, 8, ["document"])
        ]),
        _: 1
      }, 8, ["title"])) : c("", !0)
    ], 64));
  }
}, hn = /* @__PURE__ */ N(mn, [["__scopeId", "data-v-0e9d453b"]]);
export {
  hn as default
};
