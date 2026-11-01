/* @code-commandments-generated */
if (!document.getElementById("window-styles-fcc59c75bf72")) { const style = document.createElement("style"); style.id = "window-styles-fcc59c75bf72"; style.textContent = ".dump[data-v-d2c5a833]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px dashed var(--border-2);border-radius:12px}.dump-notes[data-v-d2c5a833]{padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.dump-files[data-v-d2c5a833],.dump-failure[data-v-d2c5a833]{margin:0;color:var(--text-2);font-size:12px}.dump-row[data-v-d2c5a833]{display:flex;gap:8px}.chat[data-v-ec8a599e]{position:relative;display:flex;flex-direction:column;gap:8px;height:100%;min-height:0}.history[data-v-ec8a599e]{flex:1;min-height:0;overflow-y:auto}.history[data-v-ec8a599e] .row-list-row{padding:1px 8px}.history[data-v-ec8a599e] .mark.w-event{color:var(--text-3)}.notices[data-v-ec8a599e]{display:flex;flex-direction:column;margin:-16px -16px 0}.notice[data-v-ec8a599e]{display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--accent) 10%,var(--bg));font-size:13px}.notice-dot[data-v-ec8a599e]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.notice-text[data-v-ec8a599e]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.notice-link[data-v-ec8a599e]{flex:none;padding:2px 10px;border:1px solid var(--border-2);border-radius:6px;color:var(--text);font-size:12px}.notice-close[data-v-ec8a599e]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.running-tool[data-v-ec8a599e]{display:flex;gap:8px;align-items:center;margin:4px 10px;color:var(--text-3);font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:12px}.running-dot[data-v-ec8a599e]{width:6px;height:6px;border-radius:50%;background:var(--accent)}.scroll-top[data-v-ec8a599e]{position:absolute;right:14px;top:120px;display:grid;place-items:center;width:30px;height:30px;border:1px solid var(--border-2);border-radius:50%;background:var(--bg);color:var(--text-2);cursor:pointer}.scroll-top.hidden[data-v-ec8a599e]{visibility:hidden}.composer[data-v-ec8a599e]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px solid var(--border-2);border-radius:14px}.composer-input[data-v-ec8a599e]{min-height:54px;padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.composer-row[data-v-ec8a599e]{display:flex;gap:8px;align-items:center}.composer-attach[data-v-ec8a599e]{border:0;background:none;color:var(--text-3)}.composer-send[data-v-ec8a599e]{margin-left:auto}.composer-failure[data-v-ec8a599e]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as m, openBlock as r, createElementBlock as p, withModifiers as B, withDirectives as K, createElementVNode as l, vModelText as O, toDisplayString as f, createCommentVNode as $, createVNode as k, unref as t, withCtx as M, createTextVNode as S, computed as z, onMounted as W, Fragment as q, renderList as G, createBlock as x, normalizeClass as J, withKeys as Q } from "vue";
import { Btn as F, useRows as D, shownMarks as X, markDeclaration as Y, interleaved as Z, fetchMarkDeclarations as ee, fetchDockDeclarations as te, Icon as A, RowList as se, MarkHost as oe, MessageCard as ae, DockStack as le } from "@journal/window-kit";
const P = (_, h) => {
  const v = _.__vccOpts || _;
  for (const [y, d] of h)
    v[y] = d;
  return v;
}, ne = {
  key: 0,
  class: "dump-files"
}, re = { class: "dump-row" }, ie = {
  key: 1,
  class: "dump-failure"
}, ue = 60, ce = {
  __name: "DumpForm",
  props: { run: { type: Function, required: !0 } },
  emits: ["made", "close"],
  setup(_, { emit: h }) {
    const v = h, y = _, d = m(""), i = m([]), g = m(""), w = () => [...d.value.split(/\n\s*\n/).map((n) => n.trim()).filter(Boolean), ...i.value.map((n) => `${n.name}: ${n.text.trim()}`)], N = () => (w()[0] ?? "").replace(/\s+/g, " ").slice(0, ue);
    async function V(n) {
      var u;
      const a = [...((u = n.dataTransfer) == null ? void 0 : u.files) ?? []];
      i.value = [...i.value, ...await Promise.all(a.map(async (c) => ({ name: c.name, text: await c.text() })))];
    }
    async function b() {
      const n = await y.run(["dump", "make", N(), "--parts", w().join(" | ")]);
      g.value = n.ok ? "" : n.error, n.ok && (d.value = "", i.value = [], v("made"));
    }
    return (n, a) => (r(), p("form", {
      class: "dump",
      "data-dump-form": "",
      onSubmit: B(b, ["prevent"]),
      onDragover: a[2] || (a[2] = B(() => {
      }, ["prevent"])),
      onDrop: B(V, ["prevent"])
    }, [
      K(l("textarea", {
        "onUpdate:modelValue": a[0] || (a[0] = (u) => d.value = u),
        class: "dump-notes",
        rows: "4",
        placeholder: "Paste or drop what you have: a paragraph or a file is one part"
      }, null, 512), [
        [O, d.value]
      ]),
      i.value.length ? (r(), p("p", ne, f(i.value.map((u) => u.name).join(", ")), 1)) : $("", !0),
      l("div", re, [
        k(t(F), {
          kind: "primary",
          small: "",
          disabled: !w().length,
          "data-dump-make": "",
          onClick: b
        }, {
          default: M(() => [...a[3] || (a[3] = [
            S("Make the dump", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        k(t(F), {
          small: "",
          onClick: a[1] || (a[1] = (u) => v("close"))
        }, {
          default: M(() => [...a[4] || (a[4] = [
            S("Cancel", -1)
          ])]),
          _: 1
        })
      ]),
      g.value ? (r(), p("p", ie, f(g.value), 1)) : $("", !0)
    ], 32));
  }
}, de = /* @__PURE__ */ P(ce, [["__scopeId", "data-v-d2c5a833"]]), me = { class: "chat" }, pe = {
  "data-notices": "",
  class: "notices"
}, ve = { class: "notice-text" }, ke = ["href", "target"], fe = ["onClick"], _e = {
  key: 0,
  "data-running-tool": "",
  class: "running-tool"
}, he = { class: "composer-row" }, ye = {
  type: "button",
  "data-attach": "",
  class: "composer-attach",
  disabled: "",
  title: "A message holds text only, so there is nothing to attach a file to; Dump files takes files",
  "aria-label": "Attach a file"
}, ge = {
  key: 1,
  class: "composer-failure"
}, we = {
  __name: "Chat",
  setup(_) {
    const { rows: h, failure: v, loaded: y, load: d, context: i } = D("message list", ["message.*"]), { rows: g } = D("chat-mark list", ["chat_mark.*"]), { rows: w } = D("dock-item list", ["dock_item.*"]), { rows: N, act: V } = D("notice list", ["notice.*"]), { rows: b } = D("hook-call list --limit 1", ["hook_call.*"]), n = z(() => X(g.value, Y, (e) => i.option(e).value)), a = z(() => Z(h.value, n.value)), u = z(() => {
      var e;
      return ((e = b.value[0]) == null ? void 0 : e.hook) === "pre_tool_use" ? b.value[0].tool : "";
    });
    W(() => Promise.all([ee(), te()]));
    const c = m(""), E = m(""), T = m(null), I = m(!0), C = m(!1);
    async function R() {
      const e = await i.run(["message", "send", c.value]);
      E.value = e.ok ? "" : e.error, e.ok && (c.value = ""), d();
    }
    const j = (e) => !e.shiftKey && (e.preventDefault(), c.value.trim() && R()), H = () => I.value = !T.value || T.value.scrollTop < 8, L = () => {
      var e;
      return (e = T.value) == null ? void 0 : e.scrollTo({ top: 0, behavior: "smooth" });
    }, U = (e) => e.link.startsWith("http") ? e.link : `#open=${e.link}`;
    return (e, s) => (r(), p("div", me, [
      l("div", pe, [
        (r(!0), p(q, null, G(t(N), (o) => (r(), p("div", {
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
            onClick: (be) => t(V)(["notice", "close", String(o.id)])
          }, [
            k(t(A), {
              name: "close",
              size: 12
            })
          ], 8, fe)
        ]))), 128))
      ]),
      l("div", {
        ref_key: "scroller",
        ref: T,
        class: "history",
        onScroll: H
      }, [
        k(t(se), {
          rows: a.value,
          failure: t(v),
          loaded: t(y),
          shape: "messages",
          empty: "No messages yet"
        }, {
          default: M(({ row: o }) => [
            o.kind === "mark" ? (r(), x(t(oe), {
              key: 0,
              mark: o.row
            }, null, 8, ["mark"])) : (r(), x(t(ae), {
              key: 1,
              message: o.row
            }, null, 8, ["message"]))
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"]),
        u.value ? (r(), p("p", _e, [
          s[5] || (s[5] = l("span", { class: "running-dot" }, null, -1)),
          S(f(u.value), 1)
        ])) : $("", !0)
      ], 544),
      l("button", {
        type: "button",
        "data-scroll-top": "",
        class: J(["scroll-top", { hidden: I.value }]),
        "aria-label": "Scroll to the top",
        onClick: L
      }, [
        k(t(A), {
          name: "up",
          size: 14
        })
      ], 2),
      k(t(le), { items: t(w) }, null, 8, ["items"]),
      C.value ? (r(), x(de, {
        key: 0,
        run: t(i).run,
        onMade: s[0] || (s[0] = (o) => C.value = !1),
        onClose: s[1] || (s[1] = (o) => C.value = !1)
      }, null, 8, ["run"])) : $("", !0),
      l("form", {
        class: "composer",
        onSubmit: B(R, ["prevent"])
      }, [
        K(l("textarea", {
          "onUpdate:modelValue": s[2] || (s[2] = (o) => c.value = o),
          class: "composer-input",
          rows: "3",
          placeholder: "Message the agent",
          onKeydown: Q(j, ["enter"])
        }, null, 544), [
          [O, c.value]
        ]),
        l("div", he, [
          l("button", ye, [
            k(t(A), {
              name: "clip",
              size: 16
            })
          ]),
          c.value.trim() ? (r(), x(t(F), {
            key: 0,
            kind: "primary",
            small: "",
            class: "composer-send",
            "data-send": "",
            onClick: R
          }, {
            default: M(() => [...s[6] || (s[6] = [
              S("Send", -1)
            ])]),
            _: 1
          })) : (r(), x(t(F), {
            key: 1,
            small: "",
            bordered: "",
            class: "composer-send",
            "data-dump-files": "",
            onClick: s[3] || (s[3] = (o) => C.value = !C.value)
          }, {
            default: M(() => [...s[7] || (s[7] = [
              S("Dump files", -1)
            ])]),
            _: 1
          }))
        ])
      ], 32),
      E.value ? (r(), p("p", ge, f(E.value), 1)) : $("", !0)
    ]));
  }
}, De = /* @__PURE__ */ P(we, [["__scopeId", "data-v-ec8a599e"]]);
export {
  De as default
};
