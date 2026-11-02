/* @code-commandments-generated */
if (!document.getElementById("window-styles-faea43bf9ff6")) { const style = document.createElement("style"); style.id = "window-styles-faea43bf9ff6"; style.textContent = ".words[data-v-7a597156]{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:6px 8px;border:1px solid var(--border-2);border-radius:8px;background:var(--bg)}.word[data-v-7a597156]{display:inline-flex;gap:4px;align-items:center;padding:1px 4px 1px 8px;border-radius:99px;background:var(--hover);font-size:13px}.word-remove[data-v-7a597156]{display:inline-grid;place-items:center;padding:2px;border:0;background:none;color:var(--text-3);cursor:pointer}.word-input[data-v-7a597156]{flex:1;min-width:140px;border:0;outline:none;background:none;color:var(--text);font:inherit;font-size:13px}.trigger-editor[data-v-a16956be]{display:flex;flex-direction:column;gap:14px}.summary[data-v-a16956be]{display:flex;flex-direction:column;gap:6px;padding:12px 14px;border:1px solid var(--border-2);border-radius:10px;background:var(--raised)}.summary-label[data-v-a16956be],.field-label[data-v-a16956be]{color:var(--text-3);font-size:12px}.summary-text[data-v-a16956be]{margin:0;font-size:14px;line-height:1.55}.field[data-v-a16956be],.choices[data-v-a16956be]{display:flex;flex-direction:column;gap:6px}.choice[data-v-a16956be]{display:flex;flex-direction:column;gap:2px;padding:8px 10px;border:1px solid var(--border-2);border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.choice.chosen[data-v-a16956be]{border-color:var(--accent);background:var(--accent-dim)}.choice-label[data-v-a16956be]{font-size:13px;font-weight:500}.choice-hint[data-v-a16956be]{color:var(--text-3);font-size:12px}textarea[data-v-a16956be]{box-sizing:border-box;width:100%;padding:7px 10px;border:1px solid var(--border-2);border-radius:8px;background:var(--bg);color:var(--text);font:inherit;font-size:13px;resize:vertical}.new-trigger[data-v-3c3d7ccf]{display:flex;flex-direction:column;gap:14px}.kind[data-v-3c3d7ccf]{display:flex}.examples[data-v-3c3d7ccf],.time[data-v-3c3d7ccf]{display:flex;flex-direction:column;gap:6px}.example-list[data-v-3c3d7ccf]{display:flex;flex-wrap:wrap;gap:6px}.label[data-v-3c3d7ccf]{color:var(--text-3);font-size:12px}.times[data-v-3c3d7ccf]{display:grid;grid-template-columns:1fr 1fr;gap:12px}.time input[data-v-3c3d7ccf]{padding:6px 10px;border:1px solid var(--border-2);border-radius:8px;background:var(--bg);color:var(--text);font:inherit;font-size:13px}.note[data-v-3c3d7ccf],.note[data-v-749ba1ff]{flex:1;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as b, openBlock as g, createElementBlock as k, Fragment as $, renderList as L, createTextVNode as x, toDisplayString as y, createElementVNode as s, createVNode as f, unref as d, withDirectives as E, withKeys as M, withModifiers as P, vModelText as I, computed as W, normalizeClass as U, createCommentVNode as B, reactive as V, createBlock as C, withCtx as w } from "vue";
import { Icon as z, useWindow as R, Dialog as q, Segmented as F, Btn as O, useRows as X, RowCards as J } from "@journal/window-kit";
const D = [
  { value: "nudge", label: "Remind the agent", hint: "A short note only the agent sees. It carries on with its work.", ask: "What to remind the agent of", example: "Add the change to src/CHANGELOG.md in plain words." },
  { value: "instruct", label: "Tell the agent to do something now", hint: "The agent sees “Do this now:” followed by your text.", ask: "What the agent should do", example: "Stop and ask me before you touch the database." },
  { value: "deny", label: "Block a command or file change", hint: "The command or file change is refused, and the agent is given your reason.", ask: "Reason the agent is given", example: "Never force-push. Ask me first." }
], Q = [
  { name: "Block a command", phrases: ["push --force"], action: "deny", text: "Never force-push. Ask me first." },
  { name: "Remind the agent when a word appears", phrases: ["CHANGELOG"], action: "nudge", text: "Add the change to src/CHANGELOG.md in plain words." },
  { name: "Tell the agent to stop and ask", phrases: ["migration"], action: "instruct", text: "Stop and ask me before you touch the database." }
], H = (n) => D.find((l) => l.value === n) || D[0], K = (n) => `“${n}”`;
function Y(n) {
  const l = n.slice(0, 3).map(K), i = n.length - 3;
  return i > 0 ? `${l.join(", ")} or ${i} other ${i === 1 ? "phrase" : "phrases"}` : l.length > 1 ? `${l.slice(0, -1).join(", ")} or ${l.at(-1)}` : l[0];
}
const Z = {
  nudge: (n) => `remind the agent ${n}`,
  instruct: (n) => `tell the agent to do this now: ${n}`,
  deny: (n) => `block it and tell the agent ${n}`
};
function ee(n) {
  return n.phrases.length ? `When ${Y(n.phrases)} comes up, ${Z[n.action](n.text ? K(n.text) : "(no text yet)")}.` : "Add the words to watch for and choose what happens.";
}
const T = (n, l) => {
  const i = n.__vccOpts || n;
  for (const [m, v] of l)
    i[m] = v;
  return i;
}, te = { class: "words" }, ne = ["aria-label", "onClick"], se = ["onKeydown"], oe = {
  __name: "WatchedWords",
  props: { words: { type: Array, required: !0 } },
  emits: ["words"],
  setup(n, { emit: l }) {
    const i = n, m = l, v = b("");
    function u() {
      const t = v.value.trim();
      v.value = "", t && !i.words.includes(t) && m("words", [...i.words, t]);
    }
    const a = (t) => m("words", i.words.filter((r) => r !== t));
    return (t, r) => (g(), k("div", te, [
      (g(!0), k($, null, L(n.words, (h) => (g(), k("span", {
        key: h,
        class: "word"
      }, [
        x(y(h) + " ", 1),
        s("button", {
          type: "button",
          class: "word-remove",
          "aria-label": `Remove ${h}`,
          onClick: (N) => a(h)
        }, [
          f(d(z), {
            name: "close",
            size: 11
          })
        ], 8, ne)
      ]))), 128)),
      E(s("input", {
        "onUpdate:modelValue": r[0] || (r[0] = (h) => v.value = h),
        class: "word-input",
        placeholder: "Add a word, then Enter",
        "aria-label": "Add a word",
        "data-trigger-word": "",
        onKeydown: M(P(u, ["prevent"]), ["enter"]),
        onBlur: u
      }, null, 40, se), [
        [I, v.value]
      ])
    ]));
  }
}, ae = /* @__PURE__ */ T(oe, [["__scopeId", "data-v-7a597156"]]), re = { class: "trigger-editor" }, le = { class: "summary" }, ie = { class: "summary-text" }, de = { class: "field" }, ue = { class: "field" }, ce = { class: "choices" }, ge = ["data-action", "onClick"], me = { class: "choice-label" }, ve = { class: "choice-hint" }, he = { class: "field" }, pe = { class: "field-label" }, fe = ["value", "placeholder"], we = {
  __name: "TriggerEditor",
  props: { trigger: { type: Object, required: !0 } },
  emits: ["change"],
  setup(n, { emit: l }) {
    const i = n, m = l, v = W(() => H(i.trigger.action)), u = W(() => !!i.trigger.next_at);
    return (a, t) => (g(), k("div", re, [
      u.value ? B("", !0) : (g(), k($, { key: 0 }, [
        s("div", le, [
          t[2] || (t[2] = s("span", { class: "summary-label" }, "What it does", -1)),
          s("p", ie, y(d(ee)(n.trigger)), 1)
        ]),
        s("div", de, [
          t[3] || (t[3] = s("span", { class: "field-label" }, "When these words appear", -1)),
          f(ae, {
            words: n.trigger.phrases,
            onWords: t[0] || (t[0] = (r) => m("change", { phrases: r }))
          }, null, 8, ["words"])
        ]),
        s("div", ue, [
          t[4] || (t[4] = s("span", { class: "field-label" }, "What this trigger does", -1)),
          s("div", ce, [
            (g(!0), k($, null, L(d(D), (r) => (g(), k("button", {
              key: r.value,
              type: "button",
              class: U(["choice", { chosen: r.value === n.trigger.action }]),
              "data-action": r.value,
              onClick: (h) => m("change", { action: r.value })
            }, [
              s("span", me, y(r.label), 1),
              s("span", ve, y(r.hint), 1)
            ], 10, ge))), 128))
          ])
        ])
      ], 64)),
      s("label", he, [
        s("span", pe, y(u.value ? "What to tell the agent" : v.value.ask), 1),
        s("textarea", {
          value: n.trigger.text,
          rows: "3",
          placeholder: v.value.example,
          "data-trigger-text": "",
          onChange: t[1] || (t[1] = (r) => m("change", { text: r.target.value }))
        }, null, 40, fe)
      ])
    ]));
  }
}, j = /* @__PURE__ */ T(we, [["__scopeId", "data-v-a16956be"]]), ke = { class: "new-trigger" }, ye = { class: "kind" }, _e = { class: "examples" }, be = { class: "example-list" }, $e = { class: "times" }, xe = { class: "time" }, Ce = { class: "time" }, Oe = ["disabled"], Ne = {
  class: "note",
  role: "status"
}, We = {
  __name: "NewTrigger",
  emits: ["close"],
  setup(n, { emit: l }) {
    const i = [
      { key: "words", label: "When words appear" },
      { key: "time", label: "On a schedule" }
    ], m = l, v = R(), u = b("words"), a = V({ phrases: [], action: "nudge", text: "" }), t = V({ every: "", at: "" }), r = b(""), h = W(() => u.value === "time" ? a.text.trim() ? t.every || t.at ? "" : "Choose a time or how often." : "Write what to tell the agent." : a.phrases.length ? a.text.trim() ? "" : `Write ${H(a.action).ask.toLowerCase()}.` : "Add at least one word."), N = ({ phrases: p, action: o, text: e }) => Object.assign(a, { phrases: p, action: o, text: e });
    function A() {
      if (u.value === "words") return ["trigger", "make", a.phrases.join(", "), a.text.trim(), "--do", a.action];
      const p = t.every ? ["--every", String(t.every)] : ["--at", new Date(t.at).toISOString()];
      return ["trigger", "schedule", a.text.trim(), ...p];
    }
    async function S() {
      const p = await v.run(A());
      r.value = p.ok ? "" : p.error, p.ok && m("close");
    }
    return (p, o) => (g(), C(d(q), {
      title: "New trigger",
      onClose: o[6] || (o[6] = (e) => m("close"))
    }, {
      foot: w(() => [
        s("span", Ne, y(r.value || h.value), 1),
        f(d(O), {
          onClick: o[5] || (o[5] = (e) => m("close"))
        }, {
          default: w(() => [...o[10] || (o[10] = [
            x("Cancel", -1)
          ])]),
          _: 1
        }),
        f(d(O), {
          kind: "primary",
          disabled: !!h.value,
          "data-trigger-create": "",
          onClick: S
        }, {
          default: w(() => [...o[11] || (o[11] = [
            x("Create trigger", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ]),
      default: w(() => [
        s("div", ke, [
          s("div", ye, [
            f(d(F), {
              options: i,
              value: u.value,
              onPick: o[0] || (o[0] = (e) => u.value = e)
            }, null, 8, ["value"])
          ]),
          u.value === "words" ? (g(), k($, { key: 0 }, [
            s("div", _e, [
              o[7] || (o[7] = s("span", { class: "label" }, "Start with an example", -1)),
              s("div", be, [
                (g(!0), k($, null, L(d(Q), (e) => (g(), C(d(O), {
                  key: e.name,
                  small: "",
                  bordered: "",
                  onClick: (c) => N(e)
                }, {
                  default: w(() => [
                    x(y(e.name), 1)
                  ]),
                  _: 2
                }, 1032, ["onClick"]))), 128))
              ])
            ]),
            f(j, {
              trigger: a,
              onChange: o[1] || (o[1] = (e) => Object.assign(a, e))
            }, null, 8, ["trigger"])
          ], 64)) : (g(), k($, { key: 1 }, [
            f(j, {
              trigger: { ...a, next_at: "scheduled" },
              onChange: o[2] || (o[2] = (e) => Object.assign(a, e))
            }, null, 8, ["trigger"]),
            s("div", $e, [
              s("label", xe, [
                o[8] || (o[8] = s("span", { class: "label" }, "Every so many minutes", -1)),
                E(s("input", {
                  "onUpdate:modelValue": o[3] || (o[3] = (e) => t.every = e),
                  type: "number",
                  min: "1",
                  "data-trigger-every": ""
                }, null, 512), [
                  [I, t.every]
                ])
              ]),
              s("label", Ce, [
                o[9] || (o[9] = s("span", { class: "label" }, "Or once, at", -1)),
                E(s("input", {
                  "onUpdate:modelValue": o[4] || (o[4] = (e) => t.at = e),
                  type: "datetime-local",
                  disabled: !!t.every,
                  "data-trigger-at": ""
                }, null, 8, Oe), [
                  [I, t.at]
                ])
              ])
            ])
          ], 64))
        ])
      ]),
      _: 1
    }));
  }
}, Te = /* @__PURE__ */ T(We, [["__scopeId", "data-v-3c3d7ccf"]]), Ae = {
  class: "note",
  role: "status"
}, Se = {
  __name: "TriggerCards",
  setup(n) {
    const l = R(), { rows: i, failure: m, loaded: v } = X("trigger list", ["trigger.*"]), u = b(!1), a = b(null), t = b(""), r = W(() => i.value.find((e) => e.id === a.value) || null), h = {
      phrases: (e) => ["--phrases", ...e],
      action: (e) => ["--action", e],
      text: (e) => ["--text", e]
    }, N = (e) => `Trigger ${e.id} · ${e.action}`, A = (e) => e.next_at ? `Next at ${new Date(e.next_at).toLocaleString()}` : `When these come up: ${e.phrases.join(", ")}`;
    async function S(e) {
      const [[c, _]] = Object.entries(e), G = await l.run(["trigger", "edit", String(a.value), ...h[c](_)]);
      t.value = G.ok ? "" : G.error;
    }
    async function p() {
      const e = await l.run(["trigger", "strike", String(a.value)]);
      t.value = e.ok ? "" : e.error, e.ok && (a.value = null);
    }
    function o(e) {
      t.value = "", a.value = e.id;
    }
    return (e, c) => (g(), C(d(J), {
      noun: "trigger",
      icon: "bolt",
      rows: d(i),
      failure: d(m),
      loaded: d(v),
      head: N,
      title: (_) => _.text,
      foot: A,
      onNew: c[3] || (c[3] = (_) => u.value = !0),
      onOpen: o
    }, {
      default: w(() => [
        u.value ? (g(), C(Te, {
          key: 0,
          onClose: c[0] || (c[0] = (_) => u.value = !1)
        })) : B("", !0),
        r.value ? (g(), C(d(q), {
          key: 1,
          title: `Trigger ${r.value.id}`,
          onClose: c[2] || (c[2] = (_) => a.value = null)
        }, {
          foot: w(() => [
            s("span", Ae, y(t.value), 1),
            f(d(O), {
              kind: "danger",
              "data-trigger-strike": "",
              onClick: p
            }, {
              default: w(() => [...c[4] || (c[4] = [
                x("End this trigger", -1)
              ])]),
              _: 1
            }),
            f(d(O), {
              "data-trigger-done": "",
              onClick: c[1] || (c[1] = (_) => a.value = null)
            }, {
              default: w(() => [...c[5] || (c[5] = [
                x("Done", -1)
              ])]),
              _: 1
            })
          ]),
          default: w(() => [
            f(j, {
              trigger: r.value,
              onChange: S
            }, null, 8, ["trigger"])
          ]),
          _: 1
        }, 8, ["title"])) : B("", !0)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "title"]));
  }
}, Be = /* @__PURE__ */ T(Se, [["__scopeId", "data-v-749ba1ff"]]);
export {
  Be as default
};
