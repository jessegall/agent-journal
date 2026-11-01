/* @code-commandments-generated */
if (!document.getElementById("window-styles-87fc4ce0490b")) { const style = document.createElement("style"); style.id = "window-styles-87fc4ce0490b"; style.textContent = ".dump[data-v-d2c5a833]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px dashed var(--border-2);border-radius:12px}.dump-notes[data-v-d2c5a833]{padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.dump-files[data-v-d2c5a833],.dump-failure[data-v-d2c5a833]{margin:0;color:var(--text-2);font-size:12px}.dump-row[data-v-d2c5a833]{display:flex;gap:8px}.chat[data-v-b0a9f35a]{position:relative;display:flex;flex-direction:column;gap:8px;height:100%;min-height:0}.history[data-v-b0a9f35a]{flex:1;min-height:0;overflow-y:auto}.history[data-v-b0a9f35a] .row-list-row{padding:1px 8px}.history[data-v-b0a9f35a] .mark.w-event{color:var(--text-3)}.notices[data-v-b0a9f35a]{display:flex;flex-direction:column;margin:-16px -16px 0}.notice[data-v-b0a9f35a]{display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--accent) 10%,var(--bg));font-size:13px}.notice-dot[data-v-b0a9f35a]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.notice-text[data-v-b0a9f35a]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.notice-link[data-v-b0a9f35a]{flex:none;padding:2px 10px;border:1px solid var(--border-2);border-radius:6px;color:var(--text);font-size:12px}.notice-close[data-v-b0a9f35a]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.running-tool[data-v-b0a9f35a]{display:flex;gap:8px;align-items:center;margin:4px 10px;color:var(--text-3);font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:12px}.running-dot[data-v-b0a9f35a]{width:6px;height:6px;border-radius:50%;background:var(--accent)}.scroll-top[data-v-b0a9f35a]{position:absolute;right:14px;top:120px;display:grid;place-items:center;width:30px;height:30px;border:1px solid var(--border-2);border-radius:50%;background:var(--bg);color:var(--text-2);cursor:pointer}.scroll-top.hidden[data-v-b0a9f35a]{visibility:hidden}.composer[data-v-b0a9f35a]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px solid var(--border-2);border-radius:14px}.composer-input[data-v-b0a9f35a]{min-height:54px;padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.composer-row[data-v-b0a9f35a]{display:flex;gap:8px;align-items:center}.composer-attach[data-v-b0a9f35a]{border:0;background:none;color:var(--text-3);cursor:pointer}.composer.dragging[data-v-b0a9f35a]{border-color:var(--accent)}.attached[data-v-b0a9f35a]{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}.attached-file[data-v-b0a9f35a]{display:inline-flex;gap:6px;align-items:center;padding:2px 8px;border:1px solid var(--border-2);border-radius:999px;font-size:12px}.attached-file.failed[data-v-b0a9f35a]{border-color:var(--text-3);text-decoration:line-through}.attached-file button[data-v-b0a9f35a]{border:0;background:none;color:var(--text-3);cursor:pointer}.attached-wait[data-v-b0a9f35a]{color:var(--text-3)}.composer-send[data-v-b0a9f35a]{margin-left:auto}.composer-failure[data-v-b0a9f35a]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as r, openBlock as n, createElementBlock as d, withModifiers as b, withDirectives as re, createElementVNode as s, vModelText as ie, toDisplayString as h, createCommentVNode as _, createVNode as k, unref as o, withCtx as E, createTextVNode as H, computed as B, onMounted as he, onUnmounted as _e, nextTick as oe, watch as ye, Fragment as se, renderList as ne, createBlock as F, normalizeClass as G, withKeys as we } from "vue";
import { Btn as V, useRows as A, shownMarks as be, markDeclaration as Ce, interleaved as Te, fetchMarkDeclarations as De, fetchDockDeclarations as xe, SHORT_CHAT as $e, Icon as N, RowList as Me, MarkHost as Se, MessageCard as Oe, DockStack as Re, dockOpening as Fe } from "@journal/window-kit";
const ue = (C, T) => {
  const g = C.__vccOpts || C;
  for (const [y, f] of T)
    g[y] = f;
  return g;
}, Ae = {
  key: 0,
  class: "dump-files"
}, Ee = { class: "dump-row" }, He = {
  key: 1,
  class: "dump-failure"
}, Ie = 60, ze = {
  __name: "DumpForm",
  props: { run: { type: Function, required: !0 } },
  emits: ["made", "close"],
  setup(C, { emit: T }) {
    const g = T, y = C, f = r(""), p = r([]), D = r(""), x = () => [...f.value.split(/\n\s*\n/).map((i) => i.trim()).filter(Boolean), ...p.value.map((i) => `${i.name}: ${i.text.trim()}`)], P = () => (x()[0] ?? "").replace(/\s+/g, " ").slice(0, Ie);
    async function L(i) {
      var v;
      const l = [...((v = i.dataTransfer) == null ? void 0 : v.files) ?? []];
      p.value = [...p.value, ...await Promise.all(l.map(async (M) => ({ name: M.name, text: await M.text() })))];
    }
    async function $() {
      const i = await y.run(["dump", "make", P(), "--parts", x().join(" | ")]);
      D.value = i.ok ? "" : i.error, i.ok && (f.value = "", p.value = [], g("made"));
    }
    return (i, l) => (n(), d("form", {
      class: "dump",
      "data-dump-form": "",
      onSubmit: b($, ["prevent"]),
      onDragover: l[2] || (l[2] = b(() => {
      }, ["prevent"])),
      onDrop: b(L, ["prevent"])
    }, [
      re(s("textarea", {
        "onUpdate:modelValue": l[0] || (l[0] = (v) => f.value = v),
        class: "dump-notes",
        rows: "4",
        placeholder: "Paste or drop what you have: a paragraph or a file is one part"
      }, null, 512), [
        [ie, f.value]
      ]),
      p.value.length ? (n(), d("p", Ae, h(p.value.map((v) => v.name).join(", ")), 1)) : _("", !0),
      s("div", Ee, [
        k(o(V), {
          kind: "primary",
          small: "",
          disabled: !x().length,
          "data-dump-make": "",
          onClick: $
        }, {
          default: E(() => [...l[3] || (l[3] = [
            H("Make the dump", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        k(o(V), {
          small: "",
          onClick: l[1] || (l[1] = (v) => g("close"))
        }, {
          default: E(() => [...l[4] || (l[4] = [
            H("Cancel", -1)
          ])]),
          _: 1
        })
      ]),
      D.value ? (n(), d("p", He, h(D.value), 1)) : _("", !0)
    ], 32));
  }
}, Be = /* @__PURE__ */ ue(ze, [["__scopeId", "data-v-d2c5a833"]]), Ne = {
  "data-notices": "",
  class: "notices"
}, Ve = { class: "notice-text" }, Pe = ["href", "target"], Le = ["onClick"], je = {
  key: 0,
  "data-running-tool": "",
  class: "running-tool"
}, Ke = {
  key: 0,
  class: "attached",
  "data-attached": ""
}, Ue = ["title"], qe = {
  key: 0,
  class: "attached-wait"
}, We = ["onClick"], Xe = { class: "composer-row" }, Ge = {
  key: 1,
  class: "composer-failure"
}, Je = 180, Qe = 40, Ye = {
  __name: "Chat",
  setup(C) {
    const { rows: T, failure: g, loaded: y, load: f, context: p } = A("message list", ["message.*"]), { rows: D } = A("chat-mark list", ["chat_mark.*"]), { rows: x } = A("dock-item list", ["dock_item.*"]), { rows: P, act: L } = A("notice list", ["notice.*"]), { rows: $ } = A("hook-call list --limit 1", ["hook_call.*"]), i = B(() => be(D.value, Ce, (e) => p.option(e).value)), l = r([]), v = B(() => Te([...T.value, ...l.value], i.value)), M = B(() => {
      var e;
      return ((e = $.value[0]) == null ? void 0 : e.hook) === "pre_tool_use" ? $.value[0].tool : "";
    }), j = r(null), K = r(!0), J = r(!1);
    let Q = 0, Y = !0, U = 0, S = null;
    he(() => {
      q(), Promise.all([De(), xe()]), j.value && typeof ResizeObserver < "u" && (S = new ResizeObserver(([e]) => J.value = e.contentRect.height < $e), S.observe(j.value));
    }), _e(() => {
      S == null || S.disconnect(), clearTimeout(U);
    });
    const w = r(""), I = r(""), m = r(null), Z = r(!0), O = r(!1), u = r([]), ee = r(null), te = r(null), q = () => oe(() => {
      var e;
      return (e = te.value) == null ? void 0 : e.focus();
    }), z = r(!1);
    async function W(e) {
      for (const a of e) {
        const t = { name: a.name, pending: "", failure: "" };
        u.value = [...u.value, t];
        const c = await p.upload(a);
        t.pending = c.ok ? c.value : "", t.failure = c.ok ? "" : c.error, u.value = [...u.value];
      }
      q();
    }
    const ce = (e) => {
      W([...e.target.files]), e.target.value = "";
    }, de = (e) => {
      var t;
      const a = [...((t = e.clipboardData) == null ? void 0 : t.files) ?? []];
      a.length && (e.preventDefault(), W(a));
    }, pe = (e) => {
      var a;
      z.value = !1, W([...((a = e.dataTransfer) == null ? void 0 : a.files) ?? []]);
    }, ve = (e) => u.value = u.value.filter((a) => a !== e), ae = B(() => (w.value.trim() || u.value.length) && u.value.every((e) => e.pending));
    async function X() {
      const e = { text: w.value, attached: u.value }, a = e.attached.flatMap((R) => ["--file", R.pending]), t = e.text || e.attached.map((R) => R.name).join(", "), c = { id: `sending-${Date.now()}`, type: "user", text: t, created_at: Date.now(), files: [], local: !0 };
      l.value = [...l.value, c], w.value = "", u.value = [], I.value = "", q();
      const le = await p.run(["message", "send", t, ...a]);
      le.ok || (I.value = le.error, w.value = e.text, u.value = e.attached), await f(), l.value = l.value.filter((R) => R !== c);
    }
    const me = (e) => !e.shiftKey && (e.preventDefault(), ae.value && X());
    function fe() {
      if (Z.value = !m.value || m.value.scrollTop < 8, !m.value) return;
      const { scrollTop: e, scrollHeight: a, clientHeight: t } = m.value;
      Y = a - e - t < Qe;
      const c = Fe({ top: e, before: Q, height: a, shown: t });
      Q = e, c !== null && (clearTimeout(U), c ? K.value = !0 : U = setTimeout(() => K.value = !1, Je));
    }
    ye([v, y], async () => {
      await oe(), Y && m.value && (m.value.scrollTop = m.value.scrollHeight);
    });
    const ke = () => {
      var e;
      return (e = m.value) == null ? void 0 : e.scrollTo({ top: 0, behavior: "smooth" });
    }, ge = (e) => e.link.startsWith("http") ? e.link : `#open=${e.link}`;
    return (e, a) => (n(), d("div", {
      ref_key: "chat",
      ref: j,
      class: "chat"
    }, [
      s("div", Ne, [
        (n(!0), d(se, null, ne(o(P), (t) => (n(), d("div", {
          key: t.id,
          class: "notice"
        }, [
          a[7] || (a[7] = s("span", { class: "notice-dot" }, null, -1)),
          s("span", Ve, h(t.title), 1),
          s("a", {
            class: "notice-link",
            href: ge(t),
            target: t.link.startsWith("http") ? "_blank" : void 0
          }, h(t.label), 9, Pe),
          s("button", {
            type: "button",
            class: "notice-close",
            "data-notice-close": "",
            "aria-label": "Close",
            onClick: (c) => o(L)(["notice", "close", String(t.id)])
          }, [
            k(o(N), {
              name: "close",
              size: 12
            })
          ], 8, Le)
        ]))), 128))
      ]),
      s("div", {
        ref_key: "scroller",
        ref: m,
        class: "history",
        onScroll: fe
      }, [
        k(o(Me), {
          rows: v.value,
          failure: o(g),
          loaded: o(y),
          shape: "messages",
          empty: "No messages yet"
        }, {
          default: E(({ row: t }) => [
            t.kind === "mark" ? (n(), F(o(Se), {
              key: 0,
              mark: t.row
            }, null, 8, ["mark"])) : (n(), F(o(Oe), {
              key: 1,
              message: t.row
            }, null, 8, ["message"]))
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"]),
        M.value ? (n(), d("p", je, [
          a[8] || (a[8] = s("span", { class: "running-dot" }, null, -1)),
          H(h(M.value), 1)
        ])) : _("", !0)
      ], 544),
      s("button", {
        type: "button",
        "data-scroll-top": "",
        class: G(["scroll-top", { hidden: Z.value }]),
        "aria-label": "Scroll to the top",
        onClick: ke
      }, [
        k(o(N), {
          name: "up",
          size: 14
        })
      ], 2),
      k(o(Re), {
        items: o(x),
        folded: J.value || !K.value
      }, null, 8, ["items", "folded"]),
      O.value ? (n(), F(Be, {
        key: 0,
        run: o(p).run,
        onMade: a[0] || (a[0] = (t) => O.value = !1),
        onClose: a[1] || (a[1] = (t) => O.value = !1)
      }, null, 8, ["run"])) : _("", !0),
      s("form", {
        class: G(["composer", { dragging: z.value }]),
        onSubmit: b(X, ["prevent"]),
        onDragover: a[5] || (a[5] = b((t) => z.value = !0, ["prevent"])),
        onDragleave: a[6] || (a[6] = (t) => z.value = !1),
        onDrop: b(pe, ["prevent"])
      }, [
        u.value.length ? (n(), d("ul", Ke, [
          (n(!0), d(se, null, ne(u.value, (t) => (n(), d("li", {
            key: t.name + t.pending,
            class: G(["attached-file", { failed: t.failure }]),
            title: t.failure
          }, [
            s("span", null, h(t.name), 1),
            !t.pending && !t.failure ? (n(), d("span", qe, "sending")) : _("", !0),
            s("button", {
              type: "button",
              "aria-label": "Remove",
              onClick: (c) => ve(t)
            }, [
              k(o(N), {
                name: "close",
                size: 10
              })
            ], 8, We)
          ], 10, Ue))), 128))
        ])) : _("", !0),
        re(s("textarea", {
          ref_key: "composerInput",
          ref: te,
          "onUpdate:modelValue": a[2] || (a[2] = (t) => w.value = t),
          class: "composer-input",
          rows: "3",
          placeholder: "Message the agent",
          onKeydown: we(me, ["enter"]),
          onPaste: de
        }, null, 544), [
          [ie, w.value]
        ]),
        s("div", Xe, [
          s("input", {
            ref_key: "picker",
            ref: ee,
            type: "file",
            multiple: "",
            hidden: "",
            "data-file-input": "",
            onChange: ce
          }, null, 544),
          s("button", {
            type: "button",
            "data-attach": "",
            class: "composer-attach",
            title: "Attach a file or an image",
            "aria-label": "Attach a file",
            onClick: a[3] || (a[3] = (t) => ee.value.click())
          }, [
            k(o(N), {
              name: "clip",
              size: 16
            })
          ]),
          ae.value ? (n(), F(o(V), {
            key: 0,
            kind: "primary",
            small: "",
            class: "composer-send",
            "data-send": "",
            onClick: X
          }, {
            default: E(() => [...a[9] || (a[9] = [
              H("Send", -1)
            ])]),
            _: 1
          })) : (n(), F(o(V), {
            key: 1,
            small: "",
            bordered: "",
            class: "composer-send",
            "data-dump-files": "",
            onClick: a[4] || (a[4] = (t) => O.value = !O.value)
          }, {
            default: E(() => [...a[10] || (a[10] = [
              H("Dump files", -1)
            ])]),
            _: 1
          }))
        ])
      ], 34),
      I.value ? (n(), d("p", Ge, h(I.value), 1)) : _("", !0)
    ], 512));
  }
}, tt = /* @__PURE__ */ ue(Ye, [["__scopeId", "data-v-b0a9f35a"]]);
export {
  tt as default
};
