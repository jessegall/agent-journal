/* @code-commandments-generated */
if (!document.getElementById("window-styles-a075df617d9a")) { const style = document.createElement("style"); style.id = "window-styles-a075df617d9a"; style.textContent = ".words[data-v-7a597156]{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:6px 8px;border:1px solid var(--border-2);border-radius:8px;background:var(--bg)}.word[data-v-7a597156]{display:inline-flex;gap:4px;align-items:center;padding:1px 4px 1px 8px;border-radius:99px;background:var(--hover);font-size:13px}.word-remove[data-v-7a597156]{display:inline-grid;place-items:center;padding:2px;border:0;background:none;color:var(--text-3);cursor:pointer}.word-input[data-v-7a597156]{flex:1;min-width:140px;border:0;outline:none;background:none;color:var(--text);font:inherit;font-size:13px}.trigger-editor[data-v-a16956be]{display:flex;flex-direction:column;gap:14px}.summary[data-v-a16956be]{display:flex;flex-direction:column;gap:6px;padding:12px 14px;border:1px solid var(--border-2);border-radius:10px;background:var(--raised)}.summary-label[data-v-a16956be],.field-label[data-v-a16956be]{color:var(--text-3);font-size:12px}.summary-text[data-v-a16956be]{margin:0;font-size:14px;line-height:1.55}.field[data-v-a16956be],.choices[data-v-a16956be]{display:flex;flex-direction:column;gap:6px}.choice[data-v-a16956be]{display:flex;flex-direction:column;gap:2px;padding:8px 10px;border:1px solid var(--border-2);border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.choice.chosen[data-v-a16956be]{border-color:var(--accent);background:var(--accent-dim)}.choice-label[data-v-a16956be]{font-size:13px;font-weight:500}.choice-hint[data-v-a16956be]{color:var(--text-3);font-size:12px}textarea[data-v-a16956be]{box-sizing:border-box;width:100%;padding:7px 10px;border:1px solid var(--border-2);border-radius:8px;background:var(--bg);color:var(--text);font:inherit;font-size:13px;resize:vertical}.new-trigger[data-v-a6761cd8]{display:flex;flex-direction:column;gap:14px}.examples[data-v-a6761cd8],.time[data-v-a6761cd8]{display:flex;flex-direction:column;gap:6px}.example-list[data-v-a6761cd8]{display:flex;flex-wrap:wrap;gap:6px}.label[data-v-a6761cd8]{color:var(--text-3);font-size:12px}.times[data-v-a6761cd8]{display:grid;grid-template-columns:1fr 1fr;gap:12px}.time input[data-v-a6761cd8]{padding:6px 10px;border:1px solid var(--border-2);border-radius:8px;background:var(--bg);color:var(--text);font:inherit;font-size:13px}.note[data-v-a6761cd8]{flex:1;color:var(--text-3);font-size:12px}.cards-page[data-v-82c96f74]{display:flex;flex-direction:column;height:100%;min-height:0}.cards-bar[data-v-82c96f74]{display:flex;gap:10px;align-items:center;justify-content:space-between;padding:8px 20px;border-bottom:1px solid var(--border)}.cards-count[data-v-82c96f74],.note[data-v-82c96f74]{color:var(--text-3);font-size:12px}.note[data-v-82c96f74]{flex:1}.cards[data-v-82c96f74]{flex:1;overflow-y:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-82c96f74]{display:flex;flex-direction:column;gap:8px;min-height:110px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-82c96f74]:hover{border-color:var(--border-strong, var(--border))}.card-head[data-v-82c96f74]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-82c96f74]{width:14px;height:14px}.card-title[data-v-82c96f74]{font-weight:600}.card-foot[data-v-82c96f74]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-82c96f74]{margin:0;color:var(--text-2)}.card-age[data-v-82c96f74]{margin-left:auto}\n"; document.head.appendChild(style); }
import { ref as $, openBlock as c, createElementBlock as p, Fragment as w, renderList as T, createTextVNode as y, toDisplayString as g, createElementVNode as t, createVNode as f, unref as r, withDirectives as I, withKeys as K, withModifiers as z, vModelText as B, computed as S, normalizeClass as M, createCommentVNode as W, reactive as G, createBlock as x, withCtx as k } from "vue";
import { Icon as D, useWindow as V, Dialog as R, Segmented as P, Btn as b, useRows as U, Skeleton as F, ago as X } from "@journal/window-kit";
const j = [
  { value: "nudge", label: "Remind the agent", hint: "A short note only the agent sees. It carries on with its work.", ask: "What to remind the agent of", example: "Add the change to src/CHANGELOG.md in plain words." },
  { value: "instruct", label: "Tell the agent to do something now", hint: "The agent sees “Do this now:” followed by your text.", ask: "What the agent should do", example: "Stop and ask me before you touch the database." },
  { value: "deny", label: "Block a command or file change", hint: "The command or file change is refused, and the agent is given your reason.", ask: "Reason the agent is given", example: "Never force-push. Ask me first." }
], J = [
  { name: "Block a command", phrases: ["push --force"], action: "deny", text: "Never force-push. Ask me first." },
  { name: "Remind the agent when a word appears", phrases: ["CHANGELOG"], action: "nudge", text: "Add the change to src/CHANGELOG.md in plain words." },
  { name: "Tell the agent to stop and ask", phrases: ["migration"], action: "instruct", text: "Stop and ask me before you touch the database." }
], q = (a) => j.find((u) => u.value === a) || j[0], H = (a) => `“${a}”`;
function Q(a) {
  const u = a.slice(0, 3).map(H), d = a.length - 3;
  return d > 0 ? `${u.join(", ")} or ${d} other ${d === 1 ? "phrase" : "phrases"}` : u.length > 1 ? `${u.slice(0, -1).join(", ")} or ${u.at(-1)}` : u[0];
}
const Y = {
  nudge: (a) => `remind the agent ${a}`,
  instruct: (a) => `tell the agent to do this now: ${a}`,
  deny: (a) => `block it and tell the agent ${a}`
};
function Z(a) {
  return a.phrases.length ? `When ${Q(a.phrases)} comes up, ${Y[a.action](a.text ? H(a.text) : "(no text yet)")}.` : "Add the words to watch for and choose what happens.";
}
const A = (a, u) => {
  const d = a.__vccOpts || a;
  for (const [h, v] of u)
    d[h] = v;
  return d;
}, ee = { class: "words" }, te = ["aria-label", "onClick"], se = ["onKeydown"], ne = {
  __name: "WatchedWords",
  props: { words: { type: Array, required: !0 } },
  emits: ["words"],
  setup(a, { emit: u }) {
    const d = a, h = u, v = $("");
    function m() {
      const n = v.value.trim();
      v.value = "", n && !d.words.includes(n) && h("words", [...d.words, n]);
    }
    const l = (n) => h("words", d.words.filter((i) => i !== n));
    return (n, i) => (c(), p("div", ee, [
      (c(!0), p(w, null, T(a.words, (_) => (c(), p("span", {
        key: _,
        class: "word"
      }, [
        y(g(_) + " ", 1),
        t("button", {
          type: "button",
          class: "word-remove",
          "aria-label": `Remove ${_}`,
          onClick: (C) => l(_)
        }, [
          f(r(D), {
            name: "close",
            size: 11
          })
        ], 8, te)
      ]))), 128)),
      I(t("input", {
        "onUpdate:modelValue": i[0] || (i[0] = (_) => v.value = _),
        class: "word-input",
        placeholder: "Add a word, then Enter",
        "aria-label": "Add a word",
        "data-trigger-word": "",
        onKeydown: K(z(m, ["prevent"]), ["enter"]),
        onBlur: m
      }, null, 40, se), [
        [B, v.value]
      ])
    ]));
  }
}, ae = /* @__PURE__ */ A(ne, [["__scopeId", "data-v-7a597156"]]), oe = { class: "trigger-editor" }, re = { class: "summary" }, le = { class: "summary-text" }, ie = { class: "field" }, de = { class: "field" }, ce = { class: "choices" }, ue = ["data-action", "onClick"], ge = { class: "choice-label" }, he = { class: "choice-hint" }, me = { class: "field" }, pe = { class: "field-label" }, ve = ["value", "placeholder"], fe = {
  __name: "TriggerEditor",
  props: { trigger: { type: Object, required: !0 } },
  emits: ["change"],
  setup(a, { emit: u }) {
    const d = a, h = u, v = S(() => q(d.trigger.action)), m = S(() => !!d.trigger.next_at);
    return (l, n) => (c(), p("div", oe, [
      m.value ? W("", !0) : (c(), p(w, { key: 0 }, [
        t("div", re, [
          n[2] || (n[2] = t("span", { class: "summary-label" }, "What it does", -1)),
          t("p", le, g(r(Z)(a.trigger)), 1)
        ]),
        t("div", ie, [
          n[3] || (n[3] = t("span", { class: "field-label" }, "When these words appear", -1)),
          f(ae, {
            words: a.trigger.phrases,
            onWords: n[0] || (n[0] = (i) => h("change", { phrases: i }))
          }, null, 8, ["words"])
        ]),
        t("div", de, [
          n[4] || (n[4] = t("span", { class: "field-label" }, "What this trigger does", -1)),
          t("div", ce, [
            (c(!0), p(w, null, T(r(j), (i) => (c(), p("button", {
              key: i.value,
              type: "button",
              class: M(["choice", { chosen: i.value === a.trigger.action }]),
              "data-action": i.value,
              onClick: (_) => h("change", { action: i.value })
            }, [
              t("span", ge, g(i.label), 1),
              t("span", he, g(i.hint), 1)
            ], 10, ue))), 128))
          ])
        ])
      ], 64)),
      t("label", me, [
        t("span", pe, g(m.value ? "What to tell the agent" : v.value.ask), 1),
        t("textarea", {
          value: a.trigger.text,
          rows: "3",
          placeholder: v.value.example,
          "data-trigger-text": "",
          onChange: n[1] || (n[1] = (i) => h("change", { text: i.target.value }))
        }, null, 40, ve)
      ])
    ]));
  }
}, L = /* @__PURE__ */ A(fe, [["__scopeId", "data-v-a16956be"]]), _e = { class: "new-trigger" }, ke = { class: "examples" }, ye = { class: "example-list" }, we = { class: "times" }, $e = { class: "time" }, be = { class: "time" }, xe = ["disabled"], Ce = {
  class: "note",
  role: "status"
}, Ne = {
  __name: "NewTrigger",
  emits: ["close"],
  setup(a, { emit: u }) {
    const d = [
      { key: "words", label: "When words appear" },
      { key: "time", label: "On a schedule" }
    ], h = u, v = V(), m = $("words"), l = G({ phrases: [], action: "nudge", text: "" }), n = G({ every: "", at: "" }), i = $(""), _ = S(() => m.value === "time" ? l.text.trim() ? n.every || n.at ? "" : "Choose a time or how often." : "Write what to tell the agent." : l.phrases.length ? l.text.trim() ? "" : `Write ${q(l.action).ask.toLowerCase()}.` : "Add at least one word."), C = ({ phrases: o, action: e, text: s }) => Object.assign(l, { phrases: o, action: e, text: s });
    function O() {
      if (m.value === "words") return ["trigger", "make", l.phrases.join(", "), l.text.trim(), "--do", l.action];
      const o = n.every ? ["--every", String(n.every)] : ["--at", new Date(n.at).toISOString()];
      return ["trigger", "schedule", l.text.trim(), ...o];
    }
    async function E() {
      const o = await v.run(O());
      i.value = o.ok ? "" : o.error, o.ok && h("close");
    }
    return (o, e) => (c(), x(r(R), {
      title: "New trigger",
      onClose: e[6] || (e[6] = (s) => h("close"))
    }, {
      foot: k(() => [
        t("span", Ce, g(i.value || _.value), 1),
        f(r(b), {
          onClick: e[5] || (e[5] = (s) => h("close"))
        }, {
          default: k(() => [...e[10] || (e[10] = [
            y("Cancel", -1)
          ])]),
          _: 1
        }),
        f(r(b), {
          kind: "primary",
          disabled: !!_.value,
          "data-trigger-create": "",
          onClick: E
        }, {
          default: k(() => [...e[11] || (e[11] = [
            y("Create trigger", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: k(() => [
        t("div", _e, [
          f(r(P), {
            options: d,
            value: m.value,
            onPick: e[0] || (e[0] = (s) => m.value = s)
          }, null, 8, ["value"]),
          m.value === "words" ? (c(), p(w, { key: 0 }, [
            t("div", ke, [
              e[7] || (e[7] = t("span", { class: "label" }, "Start with an example", -1)),
              t("div", ye, [
                (c(!0), p(w, null, T(r(J), (s) => (c(), x(r(b), {
                  key: s.name,
                  small: "",
                  onClick: (N) => C(s)
                }, {
                  default: k(() => [
                    y(g(s.name), 1)
                  ]),
                  _: 2
                }, 1032, ["onClick"]))), 128))
              ])
            ]),
            f(L, {
              trigger: l,
              onChange: e[1] || (e[1] = (s) => Object.assign(l, s))
            }, null, 8, ["trigger"])
          ], 64)) : (c(), p(w, { key: 1 }, [
            f(L, {
              trigger: { ...l, next_at: "scheduled" },
              onChange: e[2] || (e[2] = (s) => Object.assign(l, s))
            }, null, 8, ["trigger"]),
            t("div", we, [
              t("label", $e, [
                e[8] || (e[8] = t("span", { class: "label" }, "Every so many minutes", -1)),
                I(t("input", {
                  "onUpdate:modelValue": e[3] || (e[3] = (s) => n.every = s),
                  type: "number",
                  min: "1",
                  "data-trigger-every": ""
                }, null, 512), [
                  [B, n.every]
                ])
              ]),
              t("label", be, [
                e[9] || (e[9] = t("span", { class: "label" }, "Or once, at", -1)),
                I(t("input", {
                  "onUpdate:modelValue": e[4] || (e[4] = (s) => n.at = s),
                  type: "datetime-local",
                  disabled: !!n.every,
                  "data-trigger-at": ""
                }, null, 8, xe), [
                  [B, n.at]
                ])
              ])
            ])
          ], 64))
        ])
      ]),
      _: 1
    }));
  }
}, We = /* @__PURE__ */ A(Ne, [["__scopeId", "data-v-a6761cd8"]]), Se = { class: "cards-page" }, Te = { class: "cards-bar" }, Ae = { class: "cards-count" }, Oe = { class: "cards" }, Ee = {
  key: 1,
  class: "cards-note"
}, Ie = {
  key: 2,
  class: "cards-note"
}, Be = ["data-row", "onClick"], De = { class: "card-head" }, je = { class: "card-age" }, Le = { class: "card-title" }, Ge = { class: "card-foot" }, Ve = {
  class: "note",
  role: "status"
}, Re = {
  __name: "TriggerCards",
  setup(a) {
    const u = V(), { rows: d, failure: h, loaded: v } = U("trigger list", ["trigger.*"]), m = $(!1), l = $(null), n = $(""), i = S(() => d.value.find((o) => o.id === l.value) || null), _ = {
      phrases: (o) => ["--phrases", ...o],
      action: (o) => ["--action", o],
      text: (o) => ["--text", o]
    };
    async function C(o) {
      const [[e, s]] = Object.entries(o), N = await u.run(["trigger", "edit", String(l.value), ..._[e](s)]);
      n.value = N.ok ? "" : N.error;
    }
    async function O() {
      const o = await u.run(["trigger", "strike", String(l.value)]);
      n.value = o.ok ? "" : o.error, o.ok && (l.value = null);
    }
    function E(o) {
      n.value = "", l.value = o.id;
    }
    return (o, e) => (c(), p("div", Se, [
      t("div", Te, [
        t("span", Ae, g(r(d).length) + " " + g(r(d).length === 1 ? "trigger" : "triggers"), 1),
        f(r(b), {
          small: "",
          bordered: "",
          "data-trigger-new": "",
          onClick: e[0] || (e[0] = (s) => m.value = !0)
        }, {
          default: k(() => [
            f(r(D), {
              name: "plus",
              size: 12
            }),
            e[4] || (e[4] = y(" New trigger", -1))
          ]),
          _: 1
        })
      ]),
      t("div", Oe, [
        r(v) ? r(h) ? (c(), p("p", Ee, g(r(h)), 1)) : r(v) && !r(d).length ? (c(), p("p", Ie, "No triggers yet")) : W("", !0) : (c(), x(r(F), {
          key: 0,
          shape: "cards"
        })),
        (c(!0), p(w, null, T(r(d), (s) => (c(), p("button", {
          key: s.id,
          type: "button",
          class: "card",
          "data-row": s.id,
          onClick: (N) => E(s)
        }, [
          t("span", De, [
            f(r(D), {
              name: "bolt",
              class: "card-icon"
            }),
            y(" Trigger " + g(s.id) + " · " + g(s.action), 1),
            t("span", je, g(r(X)(s.created_at)), 1)
          ]),
          t("span", Le, g(s.text), 1),
          t("span", Ge, g(s.next_at ? `Next at ${new Date(s.next_at).toLocaleString()}` : `When these come up: ${s.phrases.join(", ")}`), 1)
        ], 8, Be))), 128))
      ]),
      m.value ? (c(), x(We, {
        key: 0,
        onClose: e[1] || (e[1] = (s) => m.value = !1)
      })) : W("", !0),
      i.value ? (c(), x(r(R), {
        key: 1,
        title: `Trigger ${i.value.id}`,
        onClose: e[3] || (e[3] = (s) => l.value = null)
      }, {
        foot: k(() => [
          t("span", Ve, g(n.value), 1),
          f(r(b), {
            kind: "danger",
            "data-trigger-strike": "",
            onClick: O
          }, {
            default: k(() => [...e[5] || (e[5] = [
              y("End this trigger", -1)
            ])]),
            _: 1
          }),
          f(r(b), {
            "data-trigger-done": "",
            onClick: e[2] || (e[2] = (s) => l.value = null)
          }, {
            default: k(() => [...e[6] || (e[6] = [
              y("Done", -1)
            ])]),
            _: 1
          })
        ]),
        default: k(() => [
          f(L, {
            trigger: i.value,
            onChange: C
          }, null, 8, ["trigger"])
        ]),
        _: 1
      }, 8, ["title"])) : W("", !0)
    ]));
  }
}, Ke = /* @__PURE__ */ A(Re, [["__scopeId", "data-v-82c96f74"]]);
export {
  Ke as default
};
