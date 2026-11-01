/* @code-commandments-generated */
if (!document.getElementById("window-styles-de22c864e3be")) { const style = document.createElement("style"); style.id = "window-styles-de22c864e3be"; style.textContent = ".dump[data-v-d2c5a833]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px dashed var(--border-2);border-radius:12px}.dump-notes[data-v-d2c5a833]{padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.dump-files[data-v-d2c5a833],.dump-failure[data-v-d2c5a833]{margin:0;color:var(--text-2);font-size:12px}.dump-row[data-v-d2c5a833]{display:flex;gap:8px}.chat[data-v-3c3d5404]{position:relative;display:flex;flex-direction:column;gap:8px;height:100%;min-height:0}.history[data-v-3c3d5404]{flex:1;min-height:0;overflow-y:auto}.history[data-v-3c3d5404] .row-list-row{padding:1px 8px}.history[data-v-3c3d5404] .mark.w-event{color:var(--text-3)}.notices[data-v-3c3d5404]{display:flex;flex-direction:column;margin:-16px -16px 0}.notice[data-v-3c3d5404]{display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--accent) 10%,var(--bg));font-size:13px}.notice-dot[data-v-3c3d5404]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.notice-text[data-v-3c3d5404]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.notice-link[data-v-3c3d5404]{flex:none;padding:2px 10px;border:1px solid var(--border-2);border-radius:6px;color:var(--text);font-size:12px}.notice-close[data-v-3c3d5404]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.running-strip[data-v-3c3d5404]{display:flex;flex:none;gap:8px;align-items:center;margin:0;padding:4px 14px;color:var(--text-3);font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:12px}.running-dot[data-v-3c3d5404]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.running-dot.idle[data-v-3c3d5404]{background:var(--text-4)}.scroll-top[data-v-3c3d5404]{position:absolute;right:14px;top:120px;display:grid;place-items:center;width:30px;height:30px;border:1px solid var(--border-2);border-radius:50%;background:var(--bg);color:var(--text-2);cursor:pointer}.scroll-top.hidden[data-v-3c3d5404]{visibility:hidden}.composer[data-v-3c3d5404]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px solid var(--border-2);border-radius:14px}.composer-input[data-v-3c3d5404]{min-height:54px;padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.composer-row[data-v-3c3d5404]{display:flex;gap:8px;align-items:center}.composer-attach[data-v-3c3d5404]{border:0;background:none;color:var(--text-3);cursor:pointer}.composer.dragging[data-v-3c3d5404]{border-color:var(--accent)}.attached[data-v-3c3d5404]{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}.attached-file[data-v-3c3d5404]{display:inline-flex;gap:6px;align-items:center;padding:2px 8px;border:1px solid var(--border-2);border-radius:999px;font-size:12px}.attached-file.failed[data-v-3c3d5404]{border-color:var(--text-3);text-decoration:line-through}.attached-file button[data-v-3c3d5404]{border:0;background:none;color:var(--text-3);cursor:pointer}.attached-wait[data-v-3c3d5404]{color:var(--text-3)}.composer-send[data-v-3c3d5404]{margin-left:auto}.composer-failure[data-v-3c3d5404]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as s, openBlock as n, createElementBlock as v, withModifiers as x, withDirectives as ce, createElementVNode as o, vModelText as de, toDisplayString as b, createCommentVNode as C, createVNode as m, unref as l, withCtx as H, createTextVNode as V, computed as O, onMounted as be, onUnmounted as Ce, nextTick as Y, watch as xe, Fragment as ie, renderList as ue, createBlock as R, normalizeClass as z, withKeys as Te } from "vue";
import { Btn as L, useRows as F, shownMarks as De, markDeclaration as $e, interleaved as Se, fetchMarkDeclarations as Me, fetchDockDeclarations as Oe, SHORT_CHAT as Re, Icon as N, RowList as Fe, MarkHost as He, MessageCard as Ae, RunningCommand as Ee, DockStack as Be, dockOpening as Ie } from "@journal/window-kit";
const pe = (T, y) => {
  const h = T.__vccOpts || T;
  for (const [_, f] of y)
    h[_] = f;
  return h;
}, ze = {
  key: 0,
  class: "dump-files"
}, Ne = { class: "dump-row" }, Ve = {
  key: 1,
  class: "dump-failure"
}, Le = 60, Pe = {
  __name: "DumpForm",
  props: { run: { type: Function, required: !0 } },
  emits: ["made", "close"],
  setup(T, { emit: y }) {
    const h = y, _ = T, f = s(""), k = s([]), g = s(""), D = () => [...f.value.split(/\n\s*\n/).map((r) => r.trim()).filter(Boolean), ...k.value.map((r) => `${r.name}: ${r.text.trim()}`)], P = () => (D()[0] ?? "").replace(/\s+/g, " ").slice(0, Le);
    async function j(r) {
      var u;
      const i = [...((u = r.dataTransfer) == null ? void 0 : u.files) ?? []];
      k.value = [...k.value, ...await Promise.all(i.map(async (E) => ({ name: E.name, text: await E.text() })))];
    }
    async function A() {
      const r = await _.run(["dump", "make", P(), "--parts", D().join(" | ")]);
      g.value = r.ok ? "" : r.error, r.ok && (f.value = "", k.value = [], h("made"));
    }
    return (r, i) => (n(), v("form", {
      class: "dump",
      "data-dump-form": "",
      onSubmit: x(A, ["prevent"]),
      onDragover: i[2] || (i[2] = x(() => {
      }, ["prevent"])),
      onDrop: x(j, ["prevent"])
    }, [
      ce(o("textarea", {
        "onUpdate:modelValue": i[0] || (i[0] = (u) => f.value = u),
        class: "dump-notes",
        rows: "4",
        placeholder: "Paste or drop what you have: a paragraph or a file is one part"
      }, null, 512), [
        [de, f.value]
      ]),
      k.value.length ? (n(), v("p", ze, b(k.value.map((u) => u.name).join(", ")), 1)) : C("", !0),
      o("div", Ne, [
        m(l(L), {
          kind: "primary",
          small: "",
          disabled: !D().length,
          "data-dump-make": "",
          onClick: A
        }, {
          default: H(() => [...i[3] || (i[3] = [
            V("Make the dump", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        m(l(L), {
          small: "",
          onClick: i[1] || (i[1] = (u) => h("close"))
        }, {
          default: H(() => [...i[4] || (i[4] = [
            V("Cancel", -1)
          ])]),
          _: 1
        })
      ]),
      g.value ? (n(), v("p", Ve, b(g.value), 1)) : C("", !0)
    ], 32));
  }
}, je = /* @__PURE__ */ pe(Pe, [["__scopeId", "data-v-d2c5a833"]]), Ke = {
  "data-notices": "",
  class: "notices"
}, Ue = { class: "notice-text" }, qe = ["href", "target"], We = ["onClick"], Xe = { class: "running-strip" }, Ge = {
  key: 0,
  class: "attached",
  "data-attached": ""
}, Je = ["title"], Qe = {
  key: 0,
  class: "attached-wait"
}, Ye = ["onClick"], Ze = { class: "composer-row" }, et = {
  key: 1,
  class: "composer-failure"
}, tt = 180, at = 2e3, lt = 40, ot = {
  __name: "Chat",
  setup(T) {
    const { rows: y, failure: h, loaded: _, load: f, older: k, context: g } = F("message list", ["message.*"], { incremental: !0 }), { rows: D } = F("chat-mark list", ["chat_mark.*"]), { rows: P } = F("dock-item list", ["dock_item.*"]), { rows: j, act: A } = F("notice list", ["notice.*"]), { rows: r } = F("hook-call list --limit 1", ["hook_call.*"]), i = O(() => De(D.value, $e, (e) => g.option(e).value)), u = s([]), E = O(() => u.value.filter((e) => !y.value.some((t) => t.type === "user" && t.text === e.text && Date.parse(t.created_at) >= e.created_at - at))), Z = O(() => Se([...y.value, ...E.value], i.value)), ee = O(() => {
      var e;
      return ((e = r.value[0]) == null ? void 0 : e.hook) === "pre_tool_use" ? [r.value[0].tool, r.value[0].summary].filter(Boolean).join(" ") : "";
    }), K = s(null), U = s(!0), te = s(!1);
    let ae = 0, le = !0, q = 0, $ = null;
    be(() => {
      X(), Promise.all([Me(), Oe()]), K.value && typeof ResizeObserver < "u" && ($ = new ResizeObserver(([e]) => te.value = e.contentRect.height < Re), $.observe(K.value));
    }), Ce(() => {
      $ == null || $.disconnect(), clearTimeout(q);
    });
    const w = s(""), B = s(""), c = s(null), W = s(!0), S = s(!1), d = s([]), oe = s(null), se = s(null), X = () => Y(() => {
      var e;
      return (e = se.value) == null ? void 0 : e.focus();
    }), I = s(!1);
    async function G(e) {
      for (const t of e) {
        const a = { name: t.name, pending: "", failure: "" };
        d.value = [...d.value, a];
        const p = await g.upload(t);
        a.pending = p.ok ? p.value : "", a.failure = p.ok ? "" : p.error, d.value = [...d.value];
      }
      X();
    }
    const ve = (e) => {
      G([...e.target.files]), e.target.value = "";
    }, me = (e) => {
      var a;
      const t = [...((a = e.clipboardData) == null ? void 0 : a.files) ?? []];
      t.length && (e.preventDefault(), G(t));
    }, fe = (e) => {
      var t;
      I.value = !1, G([...((t = e.dataTransfer) == null ? void 0 : t.files) ?? []]);
    }, ke = (e) => d.value = d.value.filter((t) => t !== e), ne = O(() => (w.value.trim() || d.value.length) && d.value.every((e) => e.pending));
    async function J() {
      const e = { text: w.value, attached: d.value }, t = e.attached.flatMap((M) => ["--file", M.pending]), a = e.text || e.attached.map((M) => M.name).join(", "), p = { id: `sending-${Date.now()}`, type: "user", text: a, created_at: Date.now(), files: [], local: !0 };
      u.value = [...u.value, p], w.value = "", d.value = [], B.value = "", X();
      const re = await g.run(["message", "send", a, ...t]);
      re.ok || (B.value = re.error, w.value = e.text, d.value = e.attached), u.value = u.value.filter((M) => M !== p), await f();
    }
    const ge = (e) => !e.shiftKey && (e.preventDefault(), ne.value && J());
    let Q = !1;
    async function he() {
      if (Q || !_.value) return;
      Q = !0;
      const e = c.value.scrollHeight;
      await k() && (await Y(), c.value.scrollTop += c.value.scrollHeight - e), Q = !1;
    }
    function _e() {
      if (W.value = !c.value || c.value.scrollTop < 8, W.value && c.value && he(), !c.value) return;
      const { scrollTop: e, scrollHeight: t, clientHeight: a } = c.value;
      le = t - e - a < lt;
      const p = Ie({ top: e, before: ae, height: t, shown: a });
      ae = e, p !== null && (clearTimeout(q), p ? U.value = !0 : q = setTimeout(() => U.value = !1, tt));
    }
    xe([Z, _], async () => {
      await Y(), le && c.value && (c.value.scrollTop = c.value.scrollHeight);
    });
    const ye = () => {
      var e;
      return (e = c.value) == null ? void 0 : e.scrollTo({ top: 0, behavior: "smooth" });
    }, we = (e) => e.link.startsWith("http") ? e.link : `#open=${e.link}`;
    return (e, t) => (n(), v("div", {
      ref_key: "chat",
      ref: K,
      class: "chat"
    }, [
      o("div", Ke, [
        (n(!0), v(ie, null, ue(l(j), (a) => (n(), v("div", {
          key: a.id,
          class: "notice"
        }, [
          t[7] || (t[7] = o("span", { class: "notice-dot" }, null, -1)),
          o("span", Ue, b(a.title), 1),
          o("a", {
            class: "notice-link",
            href: we(a),
            target: a.link.startsWith("http") ? "_blank" : void 0
          }, b(a.label), 9, qe),
          o("button", {
            type: "button",
            class: "notice-close",
            "data-notice-close": "",
            "aria-label": "Close",
            onClick: (p) => l(A)(["notice", "close", String(a.id)])
          }, [
            m(l(N), {
              name: "close",
              size: 12
            })
          ], 8, We)
        ]))), 128))
      ]),
      o("div", {
        ref_key: "scroller",
        ref: c,
        class: "history",
        onScroll: _e
      }, [
        m(l(Fe), {
          rows: Z.value,
          failure: l(h),
          loaded: l(_),
          shape: "messages",
          empty: "No messages yet"
        }, {
          default: H(({ row: a }) => [
            a.kind === "mark" ? (n(), R(l(He), {
              key: 0,
              mark: a.row
            }, null, 8, ["mark"])) : (n(), R(l(Ae), {
              key: 1,
              message: a.row
            }, null, 8, ["message"]))
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ], 544),
      o("p", Xe, [
        o("span", {
          class: z(["running-dot", { idle: !ee.value }])
        }, null, 2),
        m(l(Ee), {
          text: ee.value,
          idle: "waiting"
        }, null, 8, ["text"])
      ]),
      o("button", {
        type: "button",
        "data-scroll-top": "",
        class: z(["scroll-top", { hidden: W.value }]),
        "aria-label": "Scroll to the top",
        onClick: ye
      }, [
        m(l(N), {
          name: "up",
          size: 14
        })
      ], 2),
      m(l(Be), {
        items: l(P),
        folded: te.value || !U.value
      }, null, 8, ["items", "folded"]),
      S.value ? (n(), R(je, {
        key: 0,
        run: l(g).run,
        onMade: t[0] || (t[0] = (a) => S.value = !1),
        onClose: t[1] || (t[1] = (a) => S.value = !1)
      }, null, 8, ["run"])) : C("", !0),
      o("form", {
        class: z(["composer", { dragging: I.value }]),
        onSubmit: x(J, ["prevent"]),
        onDragover: t[5] || (t[5] = x((a) => I.value = !0, ["prevent"])),
        onDragleave: t[6] || (t[6] = (a) => I.value = !1),
        onDrop: x(fe, ["prevent"])
      }, [
        d.value.length ? (n(), v("ul", Ge, [
          (n(!0), v(ie, null, ue(d.value, (a) => (n(), v("li", {
            key: a.name + a.pending,
            class: z(["attached-file", { failed: a.failure }]),
            title: a.failure
          }, [
            o("span", null, b(a.name), 1),
            !a.pending && !a.failure ? (n(), v("span", Qe, "sending")) : C("", !0),
            o("button", {
              type: "button",
              "aria-label": "Remove",
              onClick: (p) => ke(a)
            }, [
              m(l(N), {
                name: "close",
                size: 10
              })
            ], 8, Ye)
          ], 10, Je))), 128))
        ])) : C("", !0),
        ce(o("textarea", {
          ref_key: "composerInput",
          ref: se,
          "onUpdate:modelValue": t[2] || (t[2] = (a) => w.value = a),
          class: "composer-input",
          rows: "3",
          placeholder: "Message the agent",
          onKeydown: Te(ge, ["enter"]),
          onPaste: me
        }, null, 544), [
          [de, w.value]
        ]),
        o("div", Ze, [
          o("input", {
            ref_key: "picker",
            ref: oe,
            type: "file",
            multiple: "",
            hidden: "",
            "data-file-input": "",
            onChange: ve
          }, null, 544),
          o("button", {
            type: "button",
            "data-attach": "",
            class: "composer-attach",
            title: "Attach a file or an image",
            "aria-label": "Attach a file",
            onClick: t[3] || (t[3] = (a) => oe.value.click())
          }, [
            m(l(N), {
              name: "clip",
              size: 16
            })
          ]),
          ne.value ? (n(), R(l(L), {
            key: 0,
            kind: "primary",
            small: "",
            class: "composer-send",
            "data-send": "",
            onClick: J
          }, {
            default: H(() => [...t[8] || (t[8] = [
              V("Send", -1)
            ])]),
            _: 1
          })) : (n(), R(l(L), {
            key: 1,
            small: "",
            bordered: "",
            class: "composer-send",
            "data-dump-files": "",
            onClick: t[4] || (t[4] = (a) => S.value = !S.value)
          }, {
            default: H(() => [...t[9] || (t[9] = [
              V("Dump files", -1)
            ])]),
            _: 1
          }))
        ])
      ], 34),
      B.value ? (n(), v("p", et, b(B.value), 1)) : C("", !0)
    ], 512));
  }
}, rt = /* @__PURE__ */ pe(ot, [["__scopeId", "data-v-3c3d5404"]]);
export {
  rt as default
};
