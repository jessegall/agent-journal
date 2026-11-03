/* @code-commandments-generated */
if (!document.getElementById("window-styles-6782983c33e3")) { const style = document.createElement("style"); style.id = "window-styles-6782983c33e3"; style.textContent = ".words[data-v-7a597156]{display:flex;flex-wrap:wrap;gap:6px;align-items:center;padding:6px 8px;border:1px solid var(--border-2);border-radius:8px;background:var(--bg)}.word[data-v-7a597156]{display:inline-flex;gap:4px;align-items:center;padding:1px 4px 1px 8px;border-radius:99px;background:var(--hover);font-size:13px}.word-remove[data-v-7a597156]{display:inline-grid;place-items:center;padding:2px;border:0;background:none;color:var(--text-3);cursor:pointer}.word-input[data-v-7a597156]{flex:1;min-width:140px;border:0;outline:none;background:none;color:var(--text);font:inherit;font-size:13px}.trigger-editor[data-v-a16956be]{display:flex;flex-direction:column;gap:14px}.summary[data-v-a16956be]{display:flex;flex-direction:column;gap:6px;padding:12px 14px;border:1px solid var(--border-2);border-radius:10px;background:var(--raised)}.summary-label[data-v-a16956be],.field-label[data-v-a16956be]{color:var(--text-3);font-size:12px}.summary-text[data-v-a16956be]{margin:0;font-size:14px;line-height:1.55}.field[data-v-a16956be],.choices[data-v-a16956be]{display:flex;flex-direction:column;gap:6px}.choice[data-v-a16956be]{display:flex;flex-direction:column;gap:2px;padding:8px 10px;border:1px solid var(--border-2);border-radius:8px;background:none;color:inherit;text-align:left;cursor:pointer}.choice.chosen[data-v-a16956be]{border-color:var(--accent);background:var(--accent-dim)}.choice-label[data-v-a16956be]{font-size:13px;font-weight:500}.choice-hint[data-v-a16956be]{color:var(--text-3);font-size:12px}textarea[data-v-a16956be]{box-sizing:border-box;width:100%;padding:7px 10px;border:1px solid var(--border-2);border-radius:8px;background:var(--bg);color:var(--text);font:inherit;font-size:13px;resize:vertical}.new-trigger[data-v-3c3d7ccf]{display:flex;flex-direction:column;gap:14px}.kind[data-v-3c3d7ccf]{display:flex}.examples[data-v-3c3d7ccf],.time[data-v-3c3d7ccf]{display:flex;flex-direction:column;gap:6px}.example-list[data-v-3c3d7ccf]{display:flex;flex-wrap:wrap;gap:6px}.label[data-v-3c3d7ccf]{color:var(--text-3);font-size:12px}.times[data-v-3c3d7ccf]{display:grid;grid-template-columns:1fr 1fr;gap:12px}.time input[data-v-3c3d7ccf]{padding:6px 10px;border:1px solid var(--border-2);border-radius:8px;background:var(--bg);color:var(--text);font:inherit;font-size:13px}.note[data-v-3c3d7ccf],.note[data-v-542f97aa]{flex:1;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as b, openBlock as g, createElementBlock as k, Fragment as $, renderList as L, createTextVNode as x, toDisplayString as y, createElementVNode as s, createVNode as f, unref as d, withDirectives as E, withKeys as K, withModifiers as M, vModelText as I, computed as W, normalizeClass as P, createCommentVNode as B, reactive as V, createBlock as C, withCtx as w } from "vue";
import { Icon as U, useWindow as z, Dialog as R, Segmented as F, Btn as O, useRows as X, RowCards as J, patched as Q, removed as Y } from "@journal/window-kit";
const D = [
  { value: "nudge", label: "Remind the agent", hint: "A short note only the agent sees. It carries on with its work.", ask: "What to remind the agent of", example: "Add the change to src/CHANGELOG.md in plain words." },
  { value: "instruct", label: "Tell the agent to do something now", hint: "The agent sees “Do this now:” followed by your text.", ask: "What the agent should do", example: "Stop and ask me before you touch the database." },
  { value: "deny", label: "Block a command or file change", hint: "The command or file change is refused, and the agent is given your reason.", ask: "Reason the agent is given", example: "Never force-push. Ask me first." }
], Z = [
  { name: "Block a command", phrases: ["push --force"], action: "deny", text: "Never force-push. Ask me first." },
  { name: "Remind the agent when a word appears", phrases: ["CHANGELOG"], action: "nudge", text: "Add the change to src/CHANGELOG.md in plain words." },
  { name: "Tell the agent to stop and ask", phrases: ["migration"], action: "instruct", text: "Stop and ask me before you touch the database." }
], q = (n) => D.find((l) => l.value === n) || D[0], H = (n) => `“${n}”`;
function ee(n) {
  const l = n.slice(0, 3).map(H), i = n.length - 3;
  return i > 0 ? `${l.join(", ")} or ${i} other ${i === 1 ? "phrase" : "phrases"}` : l.length > 1 ? `${l.slice(0, -1).join(", ")} or ${l.at(-1)}` : l[0];
}
const te = {
  nudge: (n) => `remind the agent ${n}`,
  instruct: (n) => `tell the agent to do this now: ${n}`,
  deny: (n) => `block it and tell the agent ${n}`
};
function ne(n) {
  return n.phrases.length ? `When ${ee(n.phrases)} comes up, ${te[n.action](n.text ? H(n.text) : "(no text yet)")}.` : "Add the words to watch for and choose what happens.";
}
const T = (n, l) => {
  const i = n.__vccOpts || n;
  for (const [v, m] of l)
    i[v] = m;
  return i;
}, se = { class: "words" }, oe = ["aria-label", "onClick"], ae = ["onKeydown"], re = {
  __name: "WatchedWords",
  props: { words: { type: Array, required: !0 } },
  emits: ["words"],
  setup(n, { emit: l }) {
    const i = n, v = l, m = b("");
    function u() {
      const t = m.value.trim();
      m.value = "", t && !i.words.includes(t) && v("words", [...i.words, t]);
    }
    const a = (t) => v("words", i.words.filter((r) => r !== t));
    return (t, r) => (g(), k("div", se, [
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
          f(d(U), {
            name: "close",
            size: 11
          })
        ], 8, oe)
      ]))), 128)),
      E(s("input", {
        "onUpdate:modelValue": r[0] || (r[0] = (h) => m.value = h),
        class: "word-input",
        placeholder: "Add a word, then Enter",
        "aria-label": "Add a word",
        "data-trigger-word": "",
        onKeydown: K(M(u, ["prevent"]), ["enter"]),
        onBlur: u
      }, null, 40, ae), [
        [I, m.value]
      ])
    ]));
  }
}, le = /* @__PURE__ */ T(re, [["__scopeId", "data-v-7a597156"]]), ie = { class: "trigger-editor" }, de = { class: "summary" }, ue = { class: "summary-text" }, ce = { class: "field" }, ge = { class: "field" }, ve = { class: "choices" }, me = ["data-action", "onClick"], he = { class: "choice-label" }, pe = { class: "choice-hint" }, fe = { class: "field" }, we = { class: "field-label" }, ke = ["value", "placeholder"], ye = {
  __name: "TriggerEditor",
  props: { trigger: { type: Object, required: !0 } },
  emits: ["change"],
  setup(n, { emit: l }) {
    const i = n, v = l, m = W(() => q(i.trigger.action)), u = W(() => !!i.trigger.next_at);
    return (a, t) => (g(), k("div", ie, [
      u.value ? B("", !0) : (g(), k($, { key: 0 }, [
        s("div", de, [
          t[2] || (t[2] = s("span", { class: "summary-label" }, "What it does", -1)),
          s("p", ue, y(d(ne)(n.trigger)), 1)
        ]),
        s("div", ce, [
          t[3] || (t[3] = s("span", { class: "field-label" }, "When these words appear", -1)),
          f(le, {
            words: n.trigger.phrases,
            onWords: t[0] || (t[0] = (r) => v("change", { phrases: r }))
          }, null, 8, ["words"])
        ]),
        s("div", ge, [
          t[4] || (t[4] = s("span", { class: "field-label" }, "What this trigger does", -1)),
          s("div", ve, [
            (g(!0), k($, null, L(d(D), (r) => (g(), k("button", {
              key: r.value,
              type: "button",
              class: P(["choice", { chosen: r.value === n.trigger.action }]),
              "data-action": r.value,
              onClick: (h) => v("change", { action: r.value })
            }, [
              s("span", he, y(r.label), 1),
              s("span", pe, y(r.hint), 1)
            ], 10, me))), 128))
          ])
        ])
      ], 64)),
      s("label", fe, [
        s("span", we, y(u.value ? "What to tell the agent" : m.value.ask), 1),
        s("textarea", {
          value: n.trigger.text,
          rows: "3",
          placeholder: m.value.example,
          "data-trigger-text": "",
          onChange: t[1] || (t[1] = (r) => v("change", { text: r.target.value }))
        }, null, 40, ke)
      ])
    ]));
  }
}, j = /* @__PURE__ */ T(ye, [["__scopeId", "data-v-a16956be"]]), _e = { class: "new-trigger" }, be = { class: "kind" }, $e = { class: "examples" }, xe = { class: "example-list" }, Ce = { class: "times" }, Oe = { class: "time" }, Ne = { class: "time" }, We = ["disabled"], Te = {
  class: "note",
  role: "status"
}, Ae = {
  __name: "NewTrigger",
  emits: ["close"],
  setup(n, { emit: l }) {
    const i = [
      { key: "words", label: "When words appear" },
      { key: "time", label: "On a schedule" }
    ], v = l, m = z(), u = b("words"), a = V({ phrases: [], action: "nudge", text: "" }), t = V({ every: "", at: "" }), r = b(""), h = W(() => u.value === "time" ? a.text.trim() ? t.every || t.at ? "" : "Choose a time or how often." : "Write what to tell the agent." : a.phrases.length ? a.text.trim() ? "" : `Write ${q(a.action).ask.toLowerCase()}.` : "Add at least one word."), N = ({ phrases: p, action: o, text: e }) => Object.assign(a, { phrases: p, action: o, text: e });
    function A() {
      if (u.value === "words") return ["trigger", "make", a.phrases.join(", "), a.text.trim(), "--do", a.action];
      const p = t.every ? ["--every", String(t.every)] : ["--at", new Date(t.at).toISOString()];
      return ["trigger", "schedule", a.text.trim(), ...p];
    }
    async function S() {
      const p = await m.run(A());
      r.value = p.ok ? "" : p.error, p.ok && v("close");
    }
    return (p, o) => (g(), C(d(R), {
      title: "New trigger",
      onClose: o[6] || (o[6] = (e) => v("close"))
    }, {
      foot: w(() => [
        s("span", Te, y(r.value || h.value), 1),
        f(d(O), {
          onClick: o[5] || (o[5] = (e) => v("close"))
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
        s("div", _e, [
          s("div", be, [
            f(d(F), {
              options: i,
              value: u.value,
              onPick: o[0] || (o[0] = (e) => u.value = e)
            }, null, 8, ["value"])
          ]),
          u.value === "words" ? (g(), k($, { key: 0 }, [
            s("div", $e, [
              o[7] || (o[7] = s("span", { class: "label" }, "Start with an example", -1)),
              s("div", xe, [
                (g(!0), k($, null, L(d(Z), (e) => (g(), C(d(O), {
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
            s("div", Ce, [
              s("label", Oe, [
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
              s("label", Ne, [
                o[9] || (o[9] = s("span", { class: "label" }, "Or once, at", -1)),
                E(s("input", {
                  "onUpdate:modelValue": o[4] || (o[4] = (e) => t.at = e),
                  type: "datetime-local",
                  disabled: !!t.every,
                  "data-trigger-at": ""
                }, null, 8, We), [
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
}, Se = /* @__PURE__ */ T(Ae, [["__scopeId", "data-v-3c3d7ccf"]]), Ee = {
  class: "note",
  role: "status"
}, Ie = {
  __name: "TriggerCards",
  setup(n) {
    const { rows: l, failure: i, loaded: v, act: m } = X("trigger list", ["trigger.*"]), u = b(!1), a = b(null), t = b(""), r = W(() => l.value.find((e) => e.id === a.value) || null), h = {
      phrases: (e) => ["--phrases", ...e],
      action: (e) => ["--action", e],
      text: (e) => ["--text", e]
    }, N = (e) => `Trigger ${e.id} · ${e.action}`, A = (e) => e.next_at ? `Next at ${new Date(e.next_at).toLocaleString()}` : `When these come up: ${e.phrases.join(", ")}`;
    async function S(e) {
      const [[c, _]] = Object.entries(e), G = await m(["trigger", "edit", String(a.value), ...h[c](_)], Q(a.value, e));
      t.value = G.ok ? "" : G.error;
    }
    async function p() {
      const e = await m(["trigger", "strike", String(a.value)], Y(a.value));
      t.value = e.ok ? "" : e.error, e.ok && (a.value = null);
    }
    function o(e) {
      t.value = "", a.value = e.id;
    }
    return (e, c) => (g(), C(d(J), {
      noun: "trigger",
      icon: "bolt",
      rows: d(l),
      failure: d(i),
      loaded: d(v),
      head: N,
      title: (_) => _.text,
      foot: A,
      onNew: c[3] || (c[3] = (_) => u.value = !0),
      onOpen: o
    }, {
      default: w(() => [
        u.value ? (g(), C(Se, {
          key: 0,
          onClose: c[0] || (c[0] = (_) => u.value = !1)
        })) : B("", !0),
        r.value ? (g(), C(d(R), {
          key: 1,
          title: `Trigger ${r.value.id}`,
          onClose: c[2] || (c[2] = (_) => a.value = null)
        }, {
          foot: w(() => [
            s("span", Ee, y(t.value), 1),
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
}, je = /* @__PURE__ */ T(Ie, [["__scopeId", "data-v-542f97aa"]]);
export {
  je as default
};
