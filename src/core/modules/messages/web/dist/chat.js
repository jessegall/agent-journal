/* @code-commandments-generated */
if (!document.getElementById("window-styles-78856ab8e5da")) { const style = document.createElement("style"); style.id = "window-styles-78856ab8e5da"; style.textContent = ".dump[data-v-d2c5a833]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px dashed var(--border-2);border-radius:12px}.dump-notes[data-v-d2c5a833]{padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.dump-files[data-v-d2c5a833],.dump-failure[data-v-d2c5a833]{margin:0;color:var(--text-2);font-size:12px}.dump-row[data-v-d2c5a833]{display:flex;gap:8px}.chat[data-v-aa386be5]{position:relative;display:flex;flex-direction:column;gap:8px;height:100%;min-height:0}.history[data-v-aa386be5]{flex:1;min-height:0;overflow-y:auto}.history[data-v-aa386be5] .row-list-row{padding:1px 8px}.history[data-v-aa386be5] .mark.w-event{color:var(--text-3)}.notices[data-v-aa386be5]{display:flex;flex-direction:column;margin:-16px -16px 0}.notice[data-v-aa386be5]{display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--accent) 10%,var(--bg));font-size:13px}.notice-dot[data-v-aa386be5]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.notice-text[data-v-aa386be5]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.notice-link[data-v-aa386be5]{flex:none;padding:2px 10px;border:1px solid var(--border-2);border-radius:6px;color:var(--text);font-size:12px}.notice-close[data-v-aa386be5]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.running-tool[data-v-aa386be5]{display:flex;gap:8px;align-items:center;margin:4px 10px;color:var(--text-3);font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:12px}.running-dot[data-v-aa386be5]{width:6px;height:6px;border-radius:50%;background:var(--accent)}.scroll-top[data-v-aa386be5]{position:absolute;right:14px;top:120px;display:grid;place-items:center;width:30px;height:30px;border:1px solid var(--border-2);border-radius:50%;background:var(--bg);color:var(--text-2);cursor:pointer}.scroll-top.hidden[data-v-aa386be5]{visibility:hidden}.composer[data-v-aa386be5]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px solid var(--border-2);border-radius:14px}.composer-input[data-v-aa386be5]{min-height:54px;padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.composer-row[data-v-aa386be5]{display:flex;gap:8px;align-items:center}.composer-attach[data-v-aa386be5]{border:0;background:none;color:var(--text-3)}.composer-send[data-v-aa386be5]{margin-left:auto}.composer-failure[data-v-aa386be5]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as p, openBlock as r, createElementBlock as v, withModifiers as T, withDirectives as K, createElementVNode as l, vModelText as O, toDisplayString as f, createCommentVNode as D, createVNode as c, unref as t, withCtx as $, createTextVNode as M, computed as R, onMounted as W, Fragment as q, renderList as G, createBlock as z, normalizeClass as J, withKeys as Q } from "vue";
import { Btn as B, useRows as x, shownMarks as X, markDeclaration as Y, interleaved as Z, fetchMarkDeclarations as ee, fetchDockDeclarations as te, Icon as A, RowList as se, MarkHost as oe, MessageCard as ae, DockStack as le } from "@journal/window-kit";
const P = (_, h) => {
  const k = _.__vccOpts || _;
  for (const [g, m] of h)
    k[g] = m;
  return k;
}, ne = {
  key: 0,
  class: "dump-files"
}, re = { class: "dump-row" }, ie = {
  key: 1,
  class: "dump-failure"
}, ue = 60, de = {
  __name: "DumpForm",
  props: { run: { type: Function, required: !0 } },
  emits: ["made", "close"],
  setup(_, { emit: h }) {
    const k = h, g = _, m = p(""), i = p([]), y = p(""), w = () => [...m.value.split(/\n\s*\n/).map((n) => n.trim()).filter(Boolean), ...i.value.map((n) => `${n.name}: ${n.text.trim()}`)], F = () => (w()[0] ?? "").replace(/\s+/g, " ").slice(0, ue);
    async function N(n) {
      var u;
      const a = [...((u = n.dataTransfer) == null ? void 0 : u.files) ?? []];
      i.value = [...i.value, ...await Promise.all(a.map(async (d) => ({ name: d.name, text: await d.text() })))];
    }
    async function b() {
      const n = await g.run(["dump", "make", F(), "--parts", w().join(" | ")]);
      y.value = n.ok ? "" : n.error, n.ok && (m.value = "", i.value = [], k("made"));
    }
    return (n, a) => (r(), v("form", {
      class: "dump",
      "data-dump-form": "",
      onSubmit: T(b, ["prevent"]),
      onDragover: a[2] || (a[2] = T(() => {
      }, ["prevent"])),
      onDrop: T(N, ["prevent"])
    }, [
      K(l("textarea", {
        "onUpdate:modelValue": a[0] || (a[0] = (u) => m.value = u),
        class: "dump-notes",
        rows: "4",
        placeholder: "Paste or drop what you have: a paragraph or a file is one part"
      }, null, 512), [
        [O, m.value]
      ]),
      i.value.length ? (r(), v("p", ne, f(i.value.map((u) => u.name).join(", ")), 1)) : D("", !0),
      l("div", re, [
        c(t(B), {
          kind: "primary",
          small: "",
          disabled: !w().length,
          "data-dump-make": "",
          onClick: b
        }, {
          default: $(() => [...a[3] || (a[3] = [
            M("Make the dump", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        c(t(B), {
          small: "",
          onClick: a[1] || (a[1] = (u) => k("close"))
        }, {
          default: $(() => [...a[4] || (a[4] = [
            M("Cancel", -1)
          ])]),
          _: 1
        })
      ]),
      y.value ? (r(), v("p", ie, f(y.value), 1)) : D("", !0)
    ], 32));
  }
}, ce = /* @__PURE__ */ P(de, [["__scopeId", "data-v-d2c5a833"]]), me = { class: "chat" }, pe = {
  "data-notices": "",
  class: "notices"
}, ve = { class: "notice-text" }, ke = ["href", "target"], fe = ["onClick"], _e = {
  key: 0,
  "data-running-tool": "",
  class: "running-tool"
}, he = { class: "composer-row" }, ge = {
  type: "button",
  "data-attach": "",
  class: "composer-attach",
  disabled: "",
  title: "A message holds text only, so there is nothing to attach a file to; Dump files takes files",
  "aria-label": "Attach a file"
}, ye = {
  key: 1,
  class: "composer-failure"
}, we = {
  __name: "Chat",
  setup(_) {
    const { rows: h, failure: k, loaded: g, load: m, context: i } = x("message list", ["message.*"]), { rows: y } = x("chat-mark list", ["chat_mark.*"]), { rows: w } = x("dock-item list", ["dock_item.*"]), { rows: F, act: N } = x("notice list", ["notice.*"]), { rows: b } = x("hook-call list --limit 1", ["hook_call.*"]), n = R(() => X(y.value, Y, (e) => i.option(e).value)), a = R(() => Z(h.value, n.value)), u = R(() => {
      var e;
      return ((e = b.value[0]) == null ? void 0 : e.hook) === "pre_tool_use" ? b.value[0].tool : "";
    });
    W(() => Promise.all([ee(), te()]));
    const d = p(""), V = p(""), S = p(null), I = p(!0), C = p(!1);
    async function E() {
      const e = await i.run(["message", "send", d.value]);
      V.value = e.ok ? "" : e.error, e.ok && (d.value = ""), m();
    }
    const j = (e) => !e.shiftKey && (e.preventDefault(), d.value.trim() && E()), H = () => I.value = !S.value || S.value.scrollTop < 8, L = () => {
      var e;
      return (e = S.value) == null ? void 0 : e.scrollTo({ top: 0, behavior: "smooth" });
    }, U = (e) => e.link.startsWith("http") ? e.link : `#open=${e.link}`;
    return (e, s) => (r(), v("div", me, [
      l("div", pe, [
        (r(!0), v(q, null, G(t(F), (o) => (r(), v("div", {
          key: o.id,
          class: "notice"
        }, [
          s[4] || (s[4] = l("span", { class: "notice-dot" }, null, -1)),
          l("span", ve, f(o.title), 1),
          l("a", {
            class: "notice-link",
            href: U(o),
            target: o.link.startsWith("http") ? "_blank" : void 0
          }, f(o.label), 9, ke),
          l("button", {
            type: "button",
            class: "notice-close",
            "data-notice-close": "",
            "aria-label": "Close",
            onClick: (be) => t(N)(["notice", "close", String(o.id)])
          }, [
            c(t(A), {
              name: "close",
              size: 12
            })
          ], 8, fe)
        ]))), 128))
      ]),
      l("div", {
        ref_key: "scroller",
        ref: S,
        class: "history",
        onScroll: H
      }, [
        c(t(se), {
          rows: a.value,
          failure: t(k),
          loaded: t(g),
          shape: "messages",
          empty: "No messages yet"
        }, {
          default: $(({ row: o }) => [
            o.kind === "mark" ? (r(), z(t(oe), {
              key: 0,
              mark: o.row
            }, null, 8, ["mark"])) : (r(), z(t(ae), {
              key: 1,
              message: o.row
            }, null, 8, ["message"]))
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"]),
        u.value ? (r(), v("p", _e, [
          s[5] || (s[5] = l("span", { class: "running-dot" }, null, -1)),
          M(f(u.value), 1)
        ])) : D("", !0)
      ], 544),
      l("button", {
        type: "button",
        "data-scroll-top": "",
        class: J(["scroll-top", { hidden: I.value }]),
        "aria-label": "Scroll to the top",
        onClick: L
      }, [
        c(t(A), {
          name: "up",
          size: 14
        })
      ], 2),
      c(t(le), { items: t(w) }, null, 8, ["items"]),
      C.value ? (r(), z(ce, {
        key: 0,
        run: t(i).run,
        onMade: s[0] || (s[0] = (o) => C.value = !1),
        onClose: s[1] || (s[1] = (o) => C.value = !1)
      }, null, 8, ["run"])) : D("", !0),
      l("form", {
        class: "composer",
        onSubmit: T(E, ["prevent"])
      }, [
        K(l("textarea", {
          "onUpdate:modelValue": s[2] || (s[2] = (o) => d.value = o),
          class: "composer-input",
          rows: "3",
          placeholder: "Message the agent",
          onKeydown: Q(j, ["enter"])
        }, null, 544), [
          [O, d.value]
        ]),
        l("div", he, [
          l("button", ge, [
            c(t(A), {
              name: "clip",
              size: 16
            })
          ]),
          c(t(B), {
            small: "",
            bordered: "",
            "data-dump-files": "",
            onClick: s[3] || (s[3] = (o) => C.value = !C.value)
          }, {
            default: $(() => [...s[6] || (s[6] = [
              M("Dump files", -1)
            ])]),
            _: 1
          }),
          c(t(B), {
            kind: "primary",
            small: "",
            class: "composer-send",
            disabled: !d.value.trim(),
            onClick: E
          }, {
            default: $(() => [...s[7] || (s[7] = [
              M("Send", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])
        ])
      ], 32),
      V.value ? (r(), v("p", ye, f(V.value), 1)) : D("", !0)
    ]));
  }
}, De = /* @__PURE__ */ P(we, [["__scopeId", "data-v-aa386be5"]]);
export {
  De as default
};
