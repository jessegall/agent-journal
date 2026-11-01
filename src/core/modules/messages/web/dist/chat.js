/* @code-commandments-generated */
if (!document.getElementById("window-styles-c1c2e5b58f32")) { const style = document.createElement("style"); style.id = "window-styles-c1c2e5b58f32"; style.textContent = ".dump[data-v-d2c5a833]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px dashed var(--border-2);border-radius:12px}.dump-notes[data-v-d2c5a833]{padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.dump-files[data-v-d2c5a833],.dump-failure[data-v-d2c5a833]{margin:0;color:var(--text-2);font-size:12px}.dump-row[data-v-d2c5a833]{display:flex;gap:8px}.chat[data-v-5c4aaa0a]{position:relative;display:flex;flex-direction:column;gap:8px;height:100%;min-height:0}.history[data-v-5c4aaa0a]{flex:1;min-height:0;overflow-y:auto}.history[data-v-5c4aaa0a] .row-list-row{padding:1px 8px}.history[data-v-5c4aaa0a] .mark.w-event{color:var(--text-3)}.notices[data-v-5c4aaa0a]{display:flex;flex-direction:column;margin:-16px -16px 0}.notice[data-v-5c4aaa0a]{display:flex;gap:8px;align-items:center;padding:6px 10px;border-bottom:1px solid var(--border);background:color-mix(in srgb,var(--accent) 10%,var(--bg));font-size:13px}.notice-dot[data-v-5c4aaa0a]{flex:none;width:6px;height:6px;border-radius:50%;background:var(--accent)}.notice-text[data-v-5c4aaa0a]{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.notice-link[data-v-5c4aaa0a]{flex:none;padding:2px 10px;border:1px solid var(--border-2);border-radius:6px;color:var(--text);font-size:12px}.notice-close[data-v-5c4aaa0a]{flex:none;border:0;background:none;color:var(--text-3);cursor:pointer}.running-tool[data-v-5c4aaa0a]{display:flex;gap:8px;align-items:center;margin:4px 10px;color:var(--text-3);font-family:ui-monospace,SF Mono,Menlo,monospace;font-size:12px}.running-dot[data-v-5c4aaa0a]{width:6px;height:6px;border-radius:50%;background:var(--accent)}.scroll-top[data-v-5c4aaa0a]{position:absolute;right:14px;top:120px;display:grid;place-items:center;width:30px;height:30px;border:1px solid var(--border-2);border-radius:50%;background:var(--bg);color:var(--text-2);cursor:pointer}.scroll-top.hidden[data-v-5c4aaa0a]{visibility:hidden}.composer[data-v-5c4aaa0a]{display:flex;flex-direction:column;gap:6px;padding:10px 12px;border:1px solid var(--border-2);border-radius:14px}.composer-input[data-v-5c4aaa0a]{min-height:54px;padding:0;border:0;outline:0;color:var(--text);background:transparent;font:inherit;resize:none}.composer-row[data-v-5c4aaa0a]{display:flex;gap:8px;align-items:center}.composer-attach[data-v-5c4aaa0a]{border:0;background:none;color:var(--text-3);cursor:pointer}.composer.dragging[data-v-5c4aaa0a]{border-color:var(--accent)}.attached[data-v-5c4aaa0a]{display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;list-style:none}.attached-file[data-v-5c4aaa0a]{display:inline-flex;gap:6px;align-items:center;padding:2px 8px;border:1px solid var(--border-2);border-radius:999px;font-size:12px}.attached-file.failed[data-v-5c4aaa0a]{border-color:var(--text-3);text-decoration:line-through}.attached-file button[data-v-5c4aaa0a]{border:0;background:none;color:var(--text-3);cursor:pointer}.attached-wait[data-v-5c4aaa0a]{color:var(--text-3)}.composer-send[data-v-5c4aaa0a]{margin-left:auto}.composer-failure[data-v-5c4aaa0a]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as n, openBlock as s, createElementBlock as v, withModifiers as T, withDirectives as ce, createElementVNode as o, vModelText as de, toDisplayString as y, createCommentVNode as w, createVNode as g, unref as l, withCtx as H, createTextVNode as A, computed as O, onMounted as be, onUnmounted as Ce, nextTick as Q, watch as Te, Fragment as ie, renderList as ue, createBlock as R, normalizeClass as Y, withKeys as xe } from "vue";
import { Btn as V, useRows as F, shownMarks as De, markDeclaration as $e, interleaved as Se, fetchMarkDeclarations as Me, fetchDockDeclarations as Oe, SHORT_CHAT as Re, Icon as N, RowList as Fe, MarkHost as He, MessageCard as Ae, DockStack as Ee, dockOpening as Ie } from "@journal/window-kit";
const pe = (x, b) => {
  const h = x.__vccOpts || x;
  for (const [_, m] of b)
    h[_] = m;
  return h;
}, ze = {
  key: 0,
  class: "dump-files"
}, Be = { class: "dump-row" }, Ne = {
  key: 1,
  class: "dump-failure"
}, Ve = 60, Le = {
  __name: "DumpForm",
  props: { run: { type: Function, required: !0 } },
  emits: ["made", "close"],
  setup(x, { emit: b }) {
    const h = b, _ = x, m = n(""), f = n([]), k = n(""), D = () => [...m.value.split(/\n\s*\n/).map((r) => r.trim()).filter(Boolean), ...f.value.map((r) => `${r.name}: ${r.text.trim()}`)], L = () => (D()[0] ?? "").replace(/\s+/g, " ").slice(0, Ve);
    async function P(r) {
      var u;
      const i = [...((u = r.dataTransfer) == null ? void 0 : u.files) ?? []];
      f.value = [...f.value, ...await Promise.all(i.map(async (I) => ({ name: I.name, text: await I.text() })))];
    }
    async function E() {
      const r = await _.run(["dump", "make", L(), "--parts", D().join(" | ")]);
      k.value = r.ok ? "" : r.error, r.ok && (m.value = "", f.value = [], h("made"));
    }
    return (r, i) => (s(), v("form", {
      class: "dump",
      "data-dump-form": "",
      onSubmit: T(E, ["prevent"]),
      onDragover: i[2] || (i[2] = T(() => {
      }, ["prevent"])),
      onDrop: T(P, ["prevent"])
    }, [
      ce(o("textarea", {
        "onUpdate:modelValue": i[0] || (i[0] = (u) => m.value = u),
        class: "dump-notes",
        rows: "4",
        placeholder: "Paste or drop what you have: a paragraph or a file is one part"
      }, null, 512), [
        [de, m.value]
      ]),
      f.value.length ? (s(), v("p", ze, y(f.value.map((u) => u.name).join(", ")), 1)) : w("", !0),
      o("div", Be, [
        g(l(V), {
          kind: "primary",
          small: "",
          disabled: !D().length,
          "data-dump-make": "",
          onClick: E
        }, {
          default: H(() => [...i[3] || (i[3] = [
            A("Make the dump", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        g(l(V), {
          small: "",
          onClick: i[1] || (i[1] = (u) => h("close"))
        }, {
          default: H(() => [...i[4] || (i[4] = [
            A("Cancel", -1)
          ])]),
          _: 1
        })
      ]),
      k.value ? (s(), v("p", Ne, y(k.value), 1)) : w("", !0)
    ], 32));
  }
}, Pe = /* @__PURE__ */ pe(Le, [["__scopeId", "data-v-d2c5a833"]]), Ke = {
  "data-notices": "",
  class: "notices"
}, je = { class: "notice-text" }, Ue = ["href", "target"], qe = ["onClick"], We = {
  key: 0,
  "data-running-tool": "",
  class: "running-tool"
}, Xe = {
  key: 0,
  class: "attached",
  "data-attached": ""
}, Ge = ["title"], Je = {
  key: 0,
  class: "attached-wait"
}, Qe = ["onClick"], Ye = { class: "composer-row" }, Ze = {
  key: 1,
  class: "composer-failure"
}, et = 180, tt = 2e3, at = 40, lt = {
  __name: "Chat",
  setup(x) {
    const { rows: b, failure: h, loaded: _, load: m, older: f, context: k } = F("message list", ["message.*"], { incremental: !0 }), { rows: D } = F("chat-mark list", ["chat_mark.*"]), { rows: L } = F("dock-item list", ["dock_item.*"]), { rows: P, act: E } = F("notice list", ["notice.*"]), { rows: r } = F("hook-call list --limit 1", ["hook_call.*"]), i = O(() => De(D.value, $e, (e) => k.option(e).value)), u = n([]), I = O(() => u.value.filter((e) => !b.value.some((t) => t.type === "user" && t.text === e.text && Date.parse(t.created_at) >= e.created_at - tt))), Z = O(() => Se([...b.value, ...I.value], i.value)), ee = O(() => {
      var e;
      return ((e = r.value[0]) == null ? void 0 : e.hook) === "pre_tool_use" ? r.value[0].tool : "";
    }), K = n(null), j = n(!0), te = n(!1);
    let ae = 0, le = !0, U = 0, $ = null;
    be(() => {
      W(), Promise.all([Me(), Oe()]), K.value && typeof ResizeObserver < "u" && ($ = new ResizeObserver(([e]) => te.value = e.contentRect.height < Re), $.observe(K.value));
    }), Ce(() => {
      $ == null || $.disconnect(), clearTimeout(U);
    });
    const C = n(""), z = n(""), c = n(null), q = n(!0), S = n(!1), d = n([]), oe = n(null), se = n(null), W = () => Q(() => {
      var e;
      return (e = se.value) == null ? void 0 : e.focus();
    }), B = n(!1);
    async function X(e) {
      for (const t of e) {
        const a = { name: t.name, pending: "", failure: "" };
        d.value = [...d.value, a];
        const p = await k.upload(t);
        a.pending = p.ok ? p.value : "", a.failure = p.ok ? "" : p.error, d.value = [...d.value];
      }
      W();
    }
    const ve = (e) => {
      X([...e.target.files]), e.target.value = "";
    }, me = (e) => {
      var a;
      const t = [...((a = e.clipboardData) == null ? void 0 : a.files) ?? []];
      t.length && (e.preventDefault(), X(t));
    }, fe = (e) => {
      var t;
      B.value = !1, X([...((t = e.dataTransfer) == null ? void 0 : t.files) ?? []]);
    }, ke = (e) => d.value = d.value.filter((t) => t !== e), ne = O(() => (C.value.trim() || d.value.length) && d.value.every((e) => e.pending));
    async function G() {
      const e = { text: C.value, attached: d.value }, t = e.attached.flatMap((M) => ["--file", M.pending]), a = e.text || e.attached.map((M) => M.name).join(", "), p = { id: `sending-${Date.now()}`, type: "user", text: a, created_at: Date.now(), files: [], local: !0 };
      u.value = [...u.value, p], C.value = "", d.value = [], z.value = "", W();
      const re = await k.run(["message", "send", a, ...t]);
      re.ok || (z.value = re.error, C.value = e.text, d.value = e.attached), u.value = u.value.filter((M) => M !== p), await m();
    }
    const ge = (e) => !e.shiftKey && (e.preventDefault(), ne.value && G());
    let J = !1;
    async function he() {
      if (J || !_.value) return;
      J = !0;
      const e = c.value.scrollHeight;
      await f() && (await Q(), c.value.scrollTop += c.value.scrollHeight - e), J = !1;
    }
    function _e() {
      if (q.value = !c.value || c.value.scrollTop < 8, q.value && c.value && he(), !c.value) return;
      const { scrollTop: e, scrollHeight: t, clientHeight: a } = c.value;
      le = t - e - a < at;
      const p = Ie({ top: e, before: ae, height: t, shown: a });
      ae = e, p !== null && (clearTimeout(U), p ? j.value = !0 : U = setTimeout(() => j.value = !1, et));
    }
    Te([Z, _], async () => {
      await Q(), le && c.value && (c.value.scrollTop = c.value.scrollHeight);
    });
    const ye = () => {
      var e;
      return (e = c.value) == null ? void 0 : e.scrollTo({ top: 0, behavior: "smooth" });
    }, we = (e) => e.link.startsWith("http") ? e.link : `#open=${e.link}`;
    return (e, t) => (s(), v("div", {
      ref_key: "chat",
      ref: K,
      class: "chat"
    }, [
      o("div", Ke, [
        (s(!0), v(ie, null, ue(l(P), (a) => (s(), v("div", {
          key: a.id,
          class: "notice"
        }, [
          t[7] || (t[7] = o("span", { class: "notice-dot" }, null, -1)),
          o("span", je, y(a.title), 1),
          o("a", {
            class: "notice-link",
            href: we(a),
            target: a.link.startsWith("http") ? "_blank" : void 0
          }, y(a.label), 9, Ue),
          o("button", {
            type: "button",
            class: "notice-close",
            "data-notice-close": "",
            "aria-label": "Close",
            onClick: (p) => l(E)(["notice", "close", String(a.id)])
          }, [
            g(l(N), {
              name: "close",
              size: 12
            })
          ], 8, qe)
        ]))), 128))
      ]),
      o("div", {
        ref_key: "scroller",
        ref: c,
        class: "history",
        onScroll: _e
      }, [
        g(l(Fe), {
          rows: Z.value,
          failure: l(h),
          loaded: l(_),
          shape: "messages",
          empty: "No messages yet"
        }, {
          default: H(({ row: a }) => [
            a.kind === "mark" ? (s(), R(l(He), {
              key: 0,
              mark: a.row
            }, null, 8, ["mark"])) : (s(), R(l(Ae), {
              key: 1,
              message: a.row
            }, null, 8, ["message"]))
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"]),
        ee.value ? (s(), v("p", We, [
          t[8] || (t[8] = o("span", { class: "running-dot" }, null, -1)),
          A(y(ee.value), 1)
        ])) : w("", !0)
      ], 544),
      o("button", {
        type: "button",
        "data-scroll-top": "",
        class: Y(["scroll-top", { hidden: q.value }]),
        "aria-label": "Scroll to the top",
        onClick: ye
      }, [
        g(l(N), {
          name: "up",
          size: 14
        })
      ], 2),
      g(l(Ee), {
        items: l(L),
        folded: te.value || !j.value
      }, null, 8, ["items", "folded"]),
      S.value ? (s(), R(Pe, {
        key: 0,
        run: l(k).run,
        onMade: t[0] || (t[0] = (a) => S.value = !1),
        onClose: t[1] || (t[1] = (a) => S.value = !1)
      }, null, 8, ["run"])) : w("", !0),
      o("form", {
        class: Y(["composer", { dragging: B.value }]),
        onSubmit: T(G, ["prevent"]),
        onDragover: t[5] || (t[5] = T((a) => B.value = !0, ["prevent"])),
        onDragleave: t[6] || (t[6] = (a) => B.value = !1),
        onDrop: T(fe, ["prevent"])
      }, [
        d.value.length ? (s(), v("ul", Xe, [
          (s(!0), v(ie, null, ue(d.value, (a) => (s(), v("li", {
            key: a.name + a.pending,
            class: Y(["attached-file", { failed: a.failure }]),
            title: a.failure
          }, [
            o("span", null, y(a.name), 1),
            !a.pending && !a.failure ? (s(), v("span", Je, "sending")) : w("", !0),
            o("button", {
              type: "button",
              "aria-label": "Remove",
              onClick: (p) => ke(a)
            }, [
              g(l(N), {
                name: "close",
                size: 10
              })
            ], 8, Qe)
          ], 10, Ge))), 128))
        ])) : w("", !0),
        ce(o("textarea", {
          ref_key: "composerInput",
          ref: se,
          "onUpdate:modelValue": t[2] || (t[2] = (a) => C.value = a),
          class: "composer-input",
          rows: "3",
          placeholder: "Message the agent",
          onKeydown: xe(ge, ["enter"]),
          onPaste: me
        }, null, 544), [
          [de, C.value]
        ]),
        o("div", Ye, [
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
            g(l(N), {
              name: "clip",
              size: 16
            })
          ]),
          ne.value ? (s(), R(l(V), {
            key: 0,
            kind: "primary",
            small: "",
            class: "composer-send",
            "data-send": "",
            onClick: G
          }, {
            default: H(() => [...t[9] || (t[9] = [
              A("Send", -1)
            ])]),
            _: 1
          })) : (s(), R(l(V), {
            key: 1,
            small: "",
            bordered: "",
            class: "composer-send",
            "data-dump-files": "",
            onClick: t[4] || (t[4] = (a) => S.value = !S.value)
          }, {
            default: H(() => [...t[10] || (t[10] = [
              A("Dump files", -1)
            ])]),
            _: 1
          }))
        ])
      ], 34),
      z.value ? (s(), v("p", Ze, y(z.value), 1)) : w("", !0)
    ], 512));
  }
}, nt = /* @__PURE__ */ pe(lt, [["__scopeId", "data-v-5c4aaa0a"]]);
export {
  nt as default
};
